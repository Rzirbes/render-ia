import { NextResponse } from "next/server";
import { ApiError } from "@/features/render/utils/api-error";

/**
 * Converte erros das rotas BFF de renders em resposta HTTP preservando o
 * status e o `code` da API (ex.: 409 RENDER_PROCESSING). Falha ao alcançar a
 * API (rede/DNS) vira 502, que o cliente pode repetir com segurança.
 */
export function renderErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message, code: error.code },
      { status: error.status },
    );
  }

  if (error instanceof TypeError) {
    return NextResponse.json(
      { message: "Não foi possível conectar à API. Tente novamente." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { message: error instanceof Error ? error.message : fallbackMessage },
    { status: 500 },
  );
}
