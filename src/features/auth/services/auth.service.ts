import type {
  ApiErrorResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    ("message" in value || "error" in value || "statusCode" in value)
  );
}

function isRegisterResponse(value: unknown): value is RegisterResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value
  );
}

export async function registerService(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL não foi definida.");
  }

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
    }),
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(isApiErrorResponse(result) ? result : null),
    );
  }

  if (!isRegisterResponse(result)) {
    throw new Error("Resposta inválida do servidor.");
  }

  return result;
}

function extractErrorMessage(error: ApiErrorResponse | null): string {
  if (!error) return "Não foi possível criar a conta.";

  if (Array.isArray(error.message)) {
    return error.message[0] ?? "Não foi possível criar a conta.";
  }

  if (typeof error.message === "string") {
    return error.message;
  }

  return "Não foi possível criar a conta.";
}
