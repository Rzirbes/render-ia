/**
 * Erro de API com status HTTP e `code` da API Nest preservados ao longo da
 * cadeia API -> rota BFF (/api/renders) -> cliente.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;

  constructor(status: number, message: string, code: string | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export const RENDER_PROCESSING = "RENDER_PROCESSING";
export const IDEMPOTENCY_KEY_REUSED = "IDEMPOTENCY_KEY_REUSED";

/** Mensagens amigáveis para códigos conhecidos da API. */
const FRIENDLY_MESSAGES: Record<string, string> = {
  [RENDER_PROCESSING]:
    "Este render ainda está sendo gerado e não pode ser excluído agora. Aguarde a conclusão e tente novamente.",
  [IDEMPOTENCY_KEY_REUSED]:
    "Esta solicitação já foi enviada com outros dados. Clique em gerar novamente para criar um novo render.",
};

function readBody(data: unknown): { message: string | null; code: string | null } {
  if (data && typeof data === "object") {
    const obj = data as { message?: unknown; code?: unknown };
    const message = Array.isArray(obj.message)
      ? obj.message.filter((m) => typeof m === "string").join(" ")
      : typeof obj.message === "string"
        ? obj.message
        : null;
    return {
      message: message || null,
      code: typeof obj.code === "string" ? obj.code : null,
    };
  }
  if (typeof data === "string" && data.trim()) {
    return { message: data, code: null };
  }
  return { message: null, code: null };
}

/** Lê a resposta; em erro lança `ApiError` com status, code e mensagem. */
export async function parseApiResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  const text = await response.text();

  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const { message, code } = readBody(data);
    throw new ApiError(
      response.status,
      (code && FRIENDLY_MESSAGES[code]) || message || fallbackMessage,
      code,
    );
  }

  return data as T;
}

export function isApiErrorCode(err: unknown, code: string): boolean {
  return err instanceof ApiError && err.code === code;
}

/**
 * Falhas em que repetir a MESMA requisição (mesmo clientRequestId) é seguro e
 * útil: rede caiu (fetch rejeitou com TypeError) ou gateway/timeout. 4xx e
 * 500 genérico não são repetidos automaticamente.
 */
export function isTransientError(err: unknown): boolean {
  if (err instanceof ApiError) {
    return [408, 502, 503, 504].includes(err.status);
  }
  return err instanceof TypeError;
}
