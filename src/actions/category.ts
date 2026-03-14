"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category } from "@/lib/types";

export type CreateCategoryActionState = {
  success: boolean;
  error: string;
};

export async function createCategoryAction(
  prevState: CreateCategoryActionState | null,
  formData: FormData,
): Promise<CreateCategoryActionState> {
  try {
    const token = await getToken();

    if (!token) {
      return {
        success: false,
        error: "Sessao expirada. Faca login novamente.",
      };
    }

    const name = String(formData.get("name") || "").trim();

    if (!name) {
      return { success: false, error: "Informe o nome da categoria." };
    }

    await apiClient<Category>("category", {
      method: "POST",
      token,
      body: JSON.stringify({ name }),
    });

    revalidatePath("/dashboard/categorys");
    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Nao foi possivel criar a categoria." };
  }
}
