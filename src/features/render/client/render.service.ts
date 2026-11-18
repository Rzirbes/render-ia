import type {
  CreateRenderPayload,
  EditRenderPayload,
  ListRendersResponse,
  RenderItem,
  UploadRenderImageResponse,
} from "../types/render.types";
import {
  isTransientError,
  parseApiResponse as parseResponse,
} from "../utils/api-error";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function uploadRenderImageService(
  file: File,
): Promise<UploadRenderImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/renders/upload", {
    method: "POST",
    body: formData,
  });

  return parseResponse<UploadRenderImageResponse>(
    response,
    "Erro ao enviar imagem.",
  );
}

/**
 * Cria um render. `clientRequestId` é obrigatório: identifica a solicitação
 * lógica e é reenviado, idêntico, nos retries automáticos de falhas
 * transitórias (rede, 502/503/504). Se uma tentativa anterior chegou a criar
 * o render, a API devolve o mesmo render (sem nova cobrança).
 */
export async function createRenderService(
  payload: CreateRenderPayload & { clientRequestId: string },
  { maxAttempts = 3, baseDelayMs = 1000 } = {},
): Promise<RenderItem> {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch("/api/renders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      return await parseResponse<RenderItem>(
        response,
        "Erro ao criar render.",
      );
    } catch (err) {
      if (attempt >= maxAttempts || !isTransientError(err)) {
        throw err;
      }
      await sleep(baseDelayMs * 2 ** (attempt - 1));
    }
  }
}

export async function getRenderService(id: string): Promise<RenderItem> {
  const response = await fetch(`/api/renders/${id}`);

  return parseResponse<RenderItem>(response, "Erro ao buscar render.");
}

const FINAL_STATUSES = new Set<RenderItem["status"]>(["DONE", "ERROR"]);


/**
 * Acompanha um render até DONE ou ERROR.
 *
 * O processamento é feito exclusivamente pelo worker da API (BullMQ) assim
 * que o render é criado; o frontend apenas consulta o status. Nunca dispara
 * um segundo processamento.
 */
export async function waitForRenderCompletion(
  id: string,
  {
    intervalMs = 2000,
    timeoutMs = 10 * 60 * 1000,
    maxConsecutiveErrors = 3,
  }: {
    intervalMs?: number;
    timeoutMs?: number;
    maxConsecutiveErrors?: number;
  } = {},
): Promise<RenderItem> {
  const deadline = Date.now() + timeoutMs;
  let consecutiveErrors = 0;

  for (;;) {
    try {
      const render = await getRenderService(id);
      consecutiveErrors = 0;

      if (FINAL_STATUSES.has(render.status)) {
        return render;
      }
    } catch (err) {
      consecutiveErrors += 1;
      if (consecutiveErrors >= maxConsecutiveErrors) {
        throw err;
      }
    }

    if (Date.now() >= deadline) {
      throw new Error(
        "O render ainda está em processamento. Acompanhe o resultado no histórico.",
      );
    }

    await sleep(intervalMs);
  }
}

export async function listRendersService(
  page = 1,
  pageSize = 10,
): Promise<ListRendersResponse> {
  const response = await fetch(
    `/api/renders?page=${page}&pageSize=${pageSize}`,
  );

  return parseResponse<ListRendersResponse>(
    response,
    "Erro ao listar renders.",
  );
}

/**
 * Remove um render. A API recusa com 409 RENDER_PROCESSING enquanto ele está
 * sendo gerado; o `ApiError` lançado já traz a mensagem amigável. Use
 * `canDeleteRender` para nem oferecer a ação nesse estado.
 */
export async function deleteRenderService(id: string): Promise<{ ok: true }> {
  const response = await fetch(`/api/renders/${id}`, {
    method: "DELETE",
  });

  return parseResponse<{ ok: true }>(response, "Erro ao remover render.");
}

export async function editRenderService(
  id: string,
  payload: EditRenderPayload,
): Promise<RenderItem> {
  const response = await fetch(`/api/renders/${id}/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<RenderItem>(response, "Erro ao editar render.");
}