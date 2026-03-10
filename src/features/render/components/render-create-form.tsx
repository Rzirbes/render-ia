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

const USE_MOCK_RENDERS = true;

const MOCK_RENDERS: RenderItem[] = [
  {
    id: "mock-render-1",
    userId: "mock-user",
    status: "DONE",
    originalImageUrl: "/mocks/render-1.jpg",
    originalImagePath: "/mocks/render-1.jpg",
    sourceImageMimeType: "image/jpeg",
    generatedImageUrl: "/mocks/render-1.jpg",
    outputImagePath: "/mocks/render-1.jpg",
    prompt:
      "Casa contemporânea com fachada em concreto aparente, vidro amplo e jardim tropical.",
    presetId: "daylight_9am",
    creditsUsed: 1,
    errorCode: null,
    errorMessage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mock-render-2",
    userId: "mock-user",
    status: "DONE",
    originalImageUrl: "/mocks/render-2.jpg",
    originalImagePath: "/mocks/render-2.jpg",
    sourceImageMimeType: "image/jpeg",
    generatedImageUrl: "/mocks/render-2.jpg",
    outputImagePath: "/mocks/render-2.jpg",
    prompt:
      "Sala integrada com iluminação quente, sofá em linho claro e marcenaria amadeirada.",
    presetId: "daylight_9am",
    creditsUsed: 1,
    errorCode: null,
    errorMessage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function RenderCreateForm() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  const [sessionRenders, setSessionRenders] = useState<RenderItem[]>(
    USE_MOCK_RENDERS ? MOCK_RENDERS : [],
  );
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
    if (USE_MOCK_RENDERS) {
      try {
        setError(null);
        setResult(null);
        setStatus("processing");

        const mockResult: RenderItem = {
          id: `mock-render-${crypto.randomUUID()}`,
          userId: "mock-user",
          status: "DONE",
          originalImageUrl: file
            ? URL.createObjectURL(file)
            : "/mocks/render-1.jpg",
          originalImagePath: file ? "mock-upload" : "/mocks/render-1.jpg",
          sourceImageMimeType: file?.type || "image/jpeg",
          generatedImageUrl: "/mocks/render-3.jpg",
          outputImagePath: "/mocks/render-3.jpg",
          prompt: prompt || "Mock render gerado para ajuste de layout.",
          presetId,
          creditsUsed: 1,
          errorCode: null,
          errorMessage: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setResult(mockResult);
        handleAddRender(mockResult);
        setStatus("done");
        return;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao gerar mock render.",
        );
        setStatus("error");
        return;
      }
    }

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
