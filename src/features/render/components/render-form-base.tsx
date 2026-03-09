"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  RenderItem,
  RenderPresetId,
} from "@/features/render/types/render.types";
import { getRenderStatus } from "../utils/render-status";
import Image from "next/image";

export type FormStatus =
  | "idle"
  | "uploading"
  | "creating"
  | "processing"
  | "done"
  | "error";

export type RenderFormSubmitParams = {
  file: File | null;
  prompt: string;
  presetId: RenderPresetId;
  setStatus: (status: FormStatus) => void;
  setResult: (result: RenderItem | null) => void;
  setError: (error: string | null) => void;
};

type RenderFormBaseProps = {
  mode: "create" | "edit";
  previewSrc?: string | null;
  generatedImageSrc?: string | null;
  allowFileUpload?: boolean;
  initialPrompt?: string;
  initialPresetId?: RenderPresetId;
  onSubmit: (params: RenderFormSubmitParams) => Promise<void>;
  onEditClick?: (result: RenderItem) => void;
  showActions?: boolean;
};

export default function RenderFormBase({
  mode,
  previewSrc,
  generatedImageSrc,
  allowFileUpload = true,
  initialPrompt = "",
  initialPresetId = "daylight_9am",
  onSubmit,
  onEditClick,
  showActions = true,
}: RenderFormBaseProps) {
  const [file, setFile] = useState<File | null>(null);
  const [presetId, setPresetId] = useState<RenderPresetId>(initialPresetId);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [result, setResult] = useState<RenderItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resolvedGeneratedImageSrc =
    result?.generatedImageUrl ?? generatedImageSrc ?? null;

  const internalPreviewSrc = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (internalPreviewSrc) {
        URL.revokeObjectURL(internalPreviewSrc);
      }
    };
  }, [internalPreviewSrc]);

  const resolvedPreviewSrc =
    allowFileUpload && internalPreviewSrc ? internalPreviewSrc : previewSrc;

  const isSubmitting =
    status === "uploading" || status === "creating" || status === "processing";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await onSubmit({
      file,
      prompt,
      presetId,
      setStatus,
      setResult,
      setError,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {allowFileUpload ? (
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
      ) : null}

      {resolvedPreviewSrc ? (
        <div className="rounded-lg border border-zinc-800 p-4">
          <p className="mb-3 text-sm text-zinc-400">
            {mode === "edit" ? "Imagem base da edição" : "Pré-visualização"}
          </p>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800">
            <Image
              src={resolvedPreviewSrc}
              alt="Imagem base"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      ) : null}

      {mode === "create" ? (
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
      ) : null}

      <div>
        <label className="mb-1 block text-sm">
          {mode === "edit" ? "O que deseja alterar?" : "Prompt adicional"}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === "edit"
              ? "Ex: trocar a parede de madeira por uma parede branca lisa"
              : "Opcional"
          }
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
            ? mode === "edit"
              ? "Criando edição..."
              : "Criando..."
            : status === "processing"
              ? "Processando..."
              : mode === "edit"
                ? "Editar render"
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

          {resolvedGeneratedImageSrc ? (
            <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-zinc-800">
              <Image
                src={resolvedGeneratedImageSrc}
                alt="Render gerado"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}
          {showActions && resolvedGeneratedImageSrc ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={resolvedGeneratedImageSrc}
                download
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
              >
                Download
              </a>

              {onEditClick ? (
                <button
                  type="button"
                  onClick={() => onEditClick(result)}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white transition hover:bg-violet-500"
                >
                  Editar
                </button>
              ) : null}
            </div>
          ) : null}

          {result.errorMessage ? (
            <p className="mt-2 text-sm text-red-400">{result.errorMessage}</p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
