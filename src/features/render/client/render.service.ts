import type {
  CreateRenderPayload,
  EditRenderPayload,
  ListRendersResponse,
  RenderItem,
  UploadRenderImageResponse,
} from "../types/render.types";

async function parseResponse<T>(
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
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
    ) {
      throw new Error((data as { message: string }).message);
    }

    if (typeof data === "string" && data.trim()) {
      throw new Error(data);
    }

    throw new Error(fallbackMessage);
  }

  return data as T;
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

export async function createRenderService(
  payload: CreateRenderPayload,
): Promise<RenderItem> {
  const response = await fetch("/api/renders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<RenderItem>(response, "Erro ao criar render.");
}

export async function processRenderService(id: string): Promise<RenderItem> {
  const response = await fetch(`/api/renders/${id}/process`, {
    method: "POST",
  });

  return parseResponse<RenderItem>(response, "Erro ao processar render.");
}

export async function getRenderService(id: string): Promise<RenderItem> {
  const response = await fetch(`/api/renders/${id}`);

  return parseResponse<RenderItem>(response, "Erro ao buscar render.");
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