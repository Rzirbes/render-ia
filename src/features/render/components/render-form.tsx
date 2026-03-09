"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  RenderItem,
  RenderPresetId,
} from "@/features/render/types/render.types";
import {
  createRenderService,
  processRenderService,
  uploadRenderImageService,
} from "../client/render.service";
import { getRenderStatus } from "../utils/render-status";
import Image from "next/image";

type FormStatus =
  | "idle"
  | "uploading"
  | "creating"
  | "processing"
  | "done"
  | "error";

export default function RenderForm() {
  const [file, setFile] = useState<File | null>(null);
  const [presetId, setPresetId] = useState<RenderPresetId>("daylight_9am");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [result, setResult] = useState<RenderItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  const previewSrc = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  const generatedImageSrc = result?.generatedImageUrl
    ? result.generatedImageUrl.startsWith("http")
      ? result.generatedImageUrl
      : `${apiUrl}${result.generatedImageUrl}`
    : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

      setResult(processed);
      setStatus("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao processar render.",
      );
      setStatus("error");
    }
  }

  const isSubmitting =
    status === "uploading" || status === "creating" || status === "processing";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm">Imagem</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] ?? null;
            setFile(selectedFile);
          }}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
        />
      </div>

      {previewSrc ? (
        <div className="rounded-lg border border-zinc-800 p-4">
          <p className="mb-3 text-sm text-zinc-400">Pré-visualização</p>
          <Image
            src={previewSrc}
            alt="Imagem selecionada"
            className="w-full rounded-xl border border-zinc-800 object-cover"
          />
        </div>
      ) : null}

      <div>
        <label className="mb-1 block text-sm">Preset</label>
        <select
          value={presetId}
          onChange={(e) => setPresetId(e.target.value as RenderPresetId)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
        >
          <option value="daylight_9am">Daylight 9AM</option>
          <option value="blue_hour">Blue Hour</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm">Prompt adicional</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Opcional"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-violet-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {status === "uploading"
          ? "Enviando imagem..."
          : status === "creating"
            ? "Criando..."
            : status === "processing"
              ? "Processando..."
              : "Gerar render"}
      </button>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {result ? (
        <div className="rounded-lg border border-zinc-800 p-4">
          {(() => {
            const statusInfo = getRenderStatus(result.status);
            const Icon = statusInfo.icon;

            return (
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Icon size={18} />
                <span>{statusInfo.label}</span>
              </div>
            );
          })()}

          {generatedImageSrc ? (
            <Image
              src={generatedImageSrc}
              alt="Render gerado"
              className="mt-4 w-full rounded-xl border border-zinc-800 object-cover"
            />
          ) : null}

          {result.errorMessage ? (
            <p className="mt-2 text-sm text-red-400">{result.errorMessage}</p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
