import "server-only";

import { cookies } from "next/headers";
import type {
  CreateRenderPayload,
  ListRendersResponse,
  RenderItem,
  UploadRenderImageResponse,
} from "../types/render.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}

async function apiRenderFetch(path: string, init?: RequestInit) {
  const token = await getToken();

  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL não configurada.");
  }

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const headers = new Headers(init?.headers);

  headers.set("Authorization", `Bearer ${token}`);

  const isFormData = init?.body instanceof FormData;

  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  return response;
}

async function parseApiResponse<T>(
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

export async function uploadRenderImage(
  file: File,
): Promise<UploadRenderImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRenderFetch("/renders/upload", {
    method: "POST",
    body: formData,
  });

  return parseApiResponse<UploadRenderImageResponse>(
    response,
    "Erro ao enviar imagem.",
  );
}

export async function createRender(
  payload: CreateRenderPayload,
): Promise<RenderItem> {
  const response = await apiRenderFetch("/renders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return parseApiResponse<RenderItem>(
    response,
    "Não foi possível criar o render.",
  );
}

export async function processRender(id: string): Promise<RenderItem> {
  const response = await apiRenderFetch(`/renders/${id}/process`, {
    method: "POST",
  });

  return parseApiResponse<RenderItem>(
    response,
    "Não foi possível processar o render.",
  );
}

export async function getRender(id: string): Promise<RenderItem> {
  const response = await apiRenderFetch(`/renders/${id}`);

  return parseApiResponse<RenderItem>(
    response,
    "Não foi possível buscar o render.",
  );
}

export async function listRenders(
  page = 1,
  pageSize = 10,
): Promise<ListRendersResponse> {
  const response = await apiRenderFetch(
    `/renders?page=${page}&pageSize=${pageSize}`,
  );

  return parseApiResponse<ListRendersResponse>(
    response,
    "Não foi possível listar os renders.",
  );
}

export async function deleteRender(id: string): Promise<{ ok: true }> {
  const response = await apiRenderFetch(`/renders/${id}`, {
    method: "DELETE",
  });

  return parseApiResponse<{ ok: true }>(
    response,
    "Não foi possível remover o render.",
  );
}
