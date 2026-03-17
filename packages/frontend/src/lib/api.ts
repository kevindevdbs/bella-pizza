const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const API_URL = process.env.API_URL as string | undefined;

function resolveApiBaseUrl() {
  if (!NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL nao foi configurada.");
  }

  if (typeof window === "undefined") {
    return (API_URL || NEXT_PUBLIC_API_URL).replace(/\/$/, "");
  }

  try {
    const url = new URL(NEXT_PUBLIC_API_URL);
    const isLocalHost =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1";

    if (isLocalHost) {
      url.hostname = window.location.hostname;
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
}

export function getApiUrl() {
  return resolveApiBaseUrl();
}

interface FetchOptions extends RequestInit {
  token?: string;
  cache?: "force-cache" | "no-store";

  next?: {
    revalidate?: false | 0 | number;
    tags?: string[];
  };
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const apiBaseUrl = resolveApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Erro HTTP:" + response.status,
    }));

    throw new Error(error.error || "Erro na Requisição");
  }

  return response.json();
}
