"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";

export type ProductActionState = {
  success: boolean;
  error: string;
};

function normalizePrice(rawPrice: string) {
  const normalized = rawPrice
    .replace("R$", "")
    .replace(/\s/g, "")
    .replace(",", ".")
    .trim();
  

  const floatValue = parseFloat(normalized)
  if(isNaN(floatValue)) return "0"
  return Math.round(floatValue * 100).toString();
}

export async function createProductAction(
  prevState: ProductActionState | null,
  formData: FormData,
): Promise<ProductActionState> {
  try {
    const token = await getToken();

    if (!token) {
      return {
        success: false,
        error: "Sessao expirada. Faca login novamente.",
      };
    }

    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const categoryId = String(formData.get("category_id") || "").trim();
    const price = normalizePrice(String(formData.get("price") || ""));
    const file = formData.get("file");

    if (!name || !description || !categoryId || !price) {
      return {
        success: false,
        error: "Preencha todos os campos obrigatorios.",
      };
    }

    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Selecione uma imagem do produto." };
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("price", price);
    payload.append("description", description);
    payload.append("category_id", categoryId);
    payload.append("file", file);

    await apiClient("product", {
      method: "POST",
      token,
      body: payload,
    });

    revalidatePath("/dashboard/products");
    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Nao foi possivel criar o produto." };
  }
}

export async function deleteProductAction(formData: FormData) {
  const token = await getToken();
  const productId = String(formData.get("product_id") || "").trim();

  if (!token || !productId) {
    return;
  }

  try {
    await apiClient(`product?product_id=${productId}`, {
      method: "DELETE",
      token,
    });
  } finally {
    revalidatePath("/dashboard/products");
  }
}
