"use server";

import { apiClient } from "@/lib/api";
import { deleteToken, setToken } from "@/lib/auth";
import { Session, User } from "@/lib/types";

type RegisterActionState = {
  success: boolean;
  error: string;
  redirectTo?: string;
};

export async function registerAction(
  prevState: RegisterActionState | null,
  formData: FormData,
) {
  try {
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    const data = { name, email, password };

    await apiClient<User>("users", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return { success: true, error: "", redirectTo: "/login" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Erro ao criar conta" };
  }
}

export async function loginAction(
  prevState: RegisterActionState | null,
  formData: FormData,
) {
  try {
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    const data = { email, password };

    const response = await apiClient<Session>("session", {
      method: "POST",
      body: JSON.stringify(data),
    });

    await setToken(response.token);

    return { success: true, error: "", redirectTo: "/dashboard" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Erro ao fazer login" };
  }
}

export async function logoutAction() {
  await deleteToken();
}
