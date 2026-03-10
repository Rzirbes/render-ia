"use client";

import { useState } from "react";
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

export default function RenderCreateForm() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  const [sessionRenders, setSessionRenders] = useState<RenderItem[]>([]);
  const [editingRenderId, setEditingRenderId] = useState<string | null>(null);

  function normalizeImageUrl(url?: string | null) {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return `${apiUrl}${url}`;
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
      const uploaded = await uploadRenderImageService(file);

      setStatus("creating");
      const created = await createRenderService({
        originalImageUrl: uploaded.url,
        originalImagePath: uploaded.path,
        originalImageMimeType: uploaded.mimeType,
        presetId,
        prompt: prompt || undefined,
      });

      setStatus("processing");
      const processed = await processRenderService(created.id);

      const finalResult = {
        ...processed,
        generatedImageUrl: normalizeImageUrl(processed.generatedImageUrl),
      };

      setResult(finalResult);
      handleAddRender(finalResult);
      setStatus("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao processar render.",
      );
      setStatus("error");
    }
  }

  function handleToggleEdit(renderId: string) {
    setEditingRenderId((prev) => (prev === renderId ? null : renderId));
  }

  return (
    <div className="space-y-8">
      <RenderFormBase
        mode="create"
        allowFileUpload
        onSubmit={handleCreateRender}
      />

      <RenderSessionList
        renders={sessionRenders}
        editingRenderId={editingRenderId}
        normalizeImageUrl={normalizeImageUrl}
        onToggleEdit={handleToggleEdit}
        onSuccessEdit={handleAddEditedRender}
        onDownload={handleDownloadRender}
      />
    </div>
  );
}
