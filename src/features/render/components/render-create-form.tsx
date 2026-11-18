"use client";

import { useRef, useState } from "react";
import { useSWRConfig } from "swr";
import imageCompression from "browser-image-compression";
import type { RenderItem } from "@/features/render/types/render.types";
import {
  createRenderService,
  uploadRenderImageService,
  waitForRenderCompletion,
} from "../client/render.service";
import RenderFormBase, {
  type RenderFormSubmitParams,
} from "./render-form-base";
import RenderSessionList from "./render-session-list";
import {
  downloadRenderImage,
  getRenderDownloadFileName,
} from "../utils/download-render-image";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import {
  IDEMPOTENCY_KEY_REUSED,
  isApiErrorCode,
} from "../utils/api-error";
import {
  resolveCreateAttempt,
  type CreateRequestAttempt,
} from "../utils/create-request";

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function RenderCreateForm() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const { mutate } = useSWRConfig();
  const { mutateUser } = useCurrentUser();

  const [sessionRenders, setSessionRenders] = useState<RenderItem[]>([]);
  const [editingRenderId, setEditingRenderId] = useState<string | null>(null);

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);

  // Solicitação de criação ainda não confirmada pela API (ver
  // utils/create-request.ts). Reaproveitada num novo clique com os mesmos
  // dados; descartada após sucesso, ao limpar o formulário ou se a API
  // recusar a chave.
  const pendingCreateRef = useRef<CreateRequestAttempt | null>(null);
  // Impede duas submissões simultâneas (duplo clique antes do re-render).
  const submittingRef = useRef(false);

  function normalizeImageUrl(url?: string | null) {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return `${apiUrl}${url}`;
  }

  async function compressImageIfNeeded(file: File) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Envie um arquivo de imagem válido.");
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `A imagem é muito grande. Envie um arquivo de até ${MAX_FILE_SIZE_MB}MB.`,
      );
    }

    const shouldCompress =
      file.size > 2 * 1024 * 1024 || file.type === "image/png";

    if (!shouldCompress) {
      return file;
    }

    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1800,
      useWebWorker: true,
      initialQuality: 0.85,
    });

    return compressedFile;
  }

  async function handleDownloadRender(render: RenderItem) {
    const imageUrl = normalizeImageUrl(render.generatedImageUrl);

    if (!imageUrl) {
      throw new Error("Imagem do render não encontrada.");
    }

    await downloadRenderImage(
      imageUrl,
      getRenderDownloadFileName(
        render.id,
        render.sourceImageMimeType ?? undefined,
      ),
    );
  }

  function handleAddRender(render: RenderItem) {
    const normalizedRender = {
      ...render,
      generatedImageUrl: normalizeImageUrl(render.generatedImageUrl),
    };

    setSessionRenders((prev) => [normalizedRender, ...prev]);
  }

  function handleAddEditedRender(parentId: string, render: RenderItem) {
    const normalizedRender = {
      ...render,
      generatedImageUrl: normalizeImageUrl(render.generatedImageUrl),
    };

    setSessionRenders((prev) => {
      const parentIndex = prev.findIndex((item) => item.id === parentId);

      if (parentIndex === -1) {
        return [normalizedRender, ...prev];
      }

      const updated = [...prev];
      updated.splice(parentIndex + 1, 0, normalizedRender);
      return updated;
    });

    setEditingRenderId(null);
  }

  async function handleCreateRender({
    file,
    prompt,
    presetId,
    setStatus,
    setResult,
    setError,
  }: RenderFormSubmitParams) {
    if (!file) {
      setError("Selecione uma imagem antes de gerar o render.");
      setStatus("error");
      return;
    }

    if (submittingRef.current) return;
    submittingRef.current = true;

    const attempt = resolveCreateAttempt(pendingCreateRef.current, {
      file,
      prompt,
      presetId,
    });
    pendingCreateRef.current = attempt;

    try {
      setError(null);
      setResult(null);

      if (!attempt.uploaded) {
        setStatus("uploading");
        const finalFile = await compressImageIfNeeded(file);
        attempt.uploaded = await uploadRenderImageService(finalFile);
      }
      const uploaded = attempt.uploaded;

      setStatus("creating");
      let created: RenderItem;
      try {
        created = await createRenderService({
          originalImageUrl: uploaded.url,
          originalImagePath: uploaded.path,
          originalImageMimeType: uploaded.mimeType,
          presetId,
          prompt: prompt || undefined,
          clientRequestId: attempt.clientRequestId,
        });
      } catch (createError) {
        if (isApiErrorCode(createError, IDEMPOTENCY_KEY_REUSED)) {
          // Chave inutilizável: o próximo clique gera uma nova solicitação.
          pendingCreateRef.current = null;
        }
        throw createError;
      }

      // Criação confirmada: um novo clique é uma nova solicitação.
      pendingCreateRef.current = null;

      await Promise.all([mutateUser(), mutate("renders")]);

      // O render já foi enfileirado na criação; apenas acompanhamos o status.
      setStatus("processing");
      const processed = await waitForRenderCompletion(created.id);

      const finalResult = {
        ...processed,
        generatedImageUrl: normalizeImageUrl(processed.generatedImageUrl),
      };

      setResult(finalResult);
      handleAddRender(finalResult);

      await Promise.all([mutateUser(), mutate("renders")]);

      setStatus("done");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao processar render.";

      if (message.includes("FUNCTION_PAYLOAD_TOO_LARGE")) {
        setError(
          "A imagem enviada é muito grande. Tente usar um arquivo menor ou exportar em JPG.",
        );
      } else {
        setError(message);
      }

      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  function handleToggleEdit(renderId: string) {
    setEditingRenderId((prev) => (prev === renderId ? null : renderId));
  }

  function handleClosePreview() {
    setPreviewImageUrl(null);
  }

  function handleClearForm() {
    pendingCreateRef.current = null;
    setFormResetKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-8">
      <RenderFormBase
        key={formResetKey}
        mode="create"
        allowFileUpload
        onSubmit={handleCreateRender}
        onClear={handleClearForm}
      />

      <RenderSessionList
        renders={sessionRenders}
        editingRenderId={editingRenderId}
        normalizeImageUrl={normalizeImageUrl}
        onToggleEdit={handleToggleEdit}
        onSuccessEdit={handleAddEditedRender}
        onDownload={handleDownloadRender}
      />

      {previewImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={handleClosePreview}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClosePreview}
              className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg"
            >
              ×
            </button>

            <img
              src={previewImageUrl}
              alt="Preview do render"
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
