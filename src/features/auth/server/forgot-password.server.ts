import {
  ApiErrorResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getErrorMessage(data: unknown, fallback: string) {
  if (typeof data === "object" && data !== null) {
    const errorData = data as ApiErrorResponse;

    if (Array.isArray(errorData.message)) {
      return errorData.message.join(", ");
    }

    if (typeof errorData.message === "string") {
      return errorData.message;
    }

    if (typeof errorData.error === "string") {
      return errorData.error;
    }
  }

  return fallback;
}

export async function forgotPasswordServer(
  input: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL não está configurada.");
  }

  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    let errorData: unknown = null;

    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    throw new Error(
      getErrorMessage(errorData, "Erro ao solicitar recuperação de senha."),
    );
  }

  return response.json();
}
