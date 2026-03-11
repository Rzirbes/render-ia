"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import imageCompression from "browser-image-compression";
import type { RenderItem } from "@/features/render/types/render.types";
import {
  createRenderService,
  processRenderService,
  uploadRenderImageService,
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

    try {
      setError(null);
      setResult(null);

      setStatus("uploading");

      const finalFile = await compressImageIfNeeded(file);
      const uploaded = await uploadRenderImageService(finalFile);

      setStatus("creating");
      const created = await createRenderService({
        originalImageUrl: uploaded.url,
        originalImagePath: uploaded.path,
        originalImageMimeType: uploaded.mimeType,
        presetId,
        prompt: prompt || undefined,
      });

      await Promise.all([mutateUser(), mutate("renders")]);

      setStatus("processing");
      const processed = await processRenderService(created.id);

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
    }
  }

  function handleToggleEdit(renderId: string) {
    setEditingRenderId((prev) => (prev === renderId ? null : renderId));
  }

  function handleClosePreview() {
    setPreviewImageUrl(null);
  }

  function handleClearForm() {
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
