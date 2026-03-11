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
  onClear?: () => void;
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
  onClear,
}: RenderFormBaseProps) {
  const [file, setFile] = useState<File | null>(null);
  const [presetId, setPresetId] = useState<RenderPresetId>(initialPresetId);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [result, setResult] = useState<RenderItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewModalSrc, setPreviewModalSrc] = useState<string | null>(null);

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

  function handleClear() {
    setFile(null);
    setPrompt(initialPrompt);
    setPresetId(initialPresetId);
    setResult(null);
    setError(null);
    setStatus("idle");
    setPreviewModalSrc(null);
    onClear?.();
  }

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

  function openPreview(src?: string | null) {
    if (!src) return;
    setPreviewModalSrc(src);
  }

  function closePreview() {
    setPreviewModalSrc(null);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {allowFileUpload ? (
          <div>
            <label className="mb-1 block text-sm text-text-primary">
              Imagem
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] ?? null;
                setFile(selectedFile);
              }}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:text-white hover:file:bg-primary-hover"
            />
          </div>
        ) : null}

        {resolvedPreviewSrc ? (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm text-text-secondary">
              {mode === "edit" ? "Imagem base da edição" : "Pré-visualização"}
            </p>

            <button
              type="button"
              onClick={() => openPreview(resolvedPreviewSrc)}
              className="relative block aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface"
            >
              <Image
                src={resolvedPreviewSrc}
                alt="Imagem base"
                fill
                className="object-cover transition hover:scale-[1.01]"
                unoptimized
              />
            </button>
          </div>
        ) : null}

        {mode === "create" ? (
          <div>
            <label className="mb-1 block text-sm text-text-primary">
              Preset
            </label>
            <select
              value={presetId}
              onChange={(e) => setPresetId(e.target.value as RenderPresetId)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary outline-none transition focus:border-primary"
            >
              <option value="daylight_9am">
                Interior/geral — Daylight 9AM
              </option>
              <option value="blue_hour">Interior/geral — Blue Hour</option>
              <option value="exterior_daylight_locked">
                Exterior — Daylight Locked
              </option>
            </select>
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm text-text-primary">
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
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-primary outline-none transition placeholder:text-text-secondary focus:border-primary"
            rows={4}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
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

          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-text-primary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Limpar
          </button>
        </div>

        {error ? <p className="text-sm text-error">{error}</p> : null}

        {result ? (
          <div className="rounded-lg border border-border bg-card p-4">
            {(() => {
              const statusInfo = getRenderStatus(result.status);
              const Icon = statusInfo.icon;

              return (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Icon size={18} />
                  <span>{statusInfo.label}</span>
                </div>
              );
            })()}

            {resolvedGeneratedImageSrc ? (
              <button
                type="button"
                onClick={() => openPreview(resolvedGeneratedImageSrc)}
                className="relative mt-4 block aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface"
              >
                <Image
                  src={resolvedGeneratedImageSrc}
                  alt="Render gerado"
                  fill
                  className="object-cover transition hover:scale-[1.01]"
                  unoptimized
                />
              </button>
            ) : null}

            {showActions && resolvedGeneratedImageSrc ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={resolvedGeneratedImageSrc}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-primary transition hover:bg-surface-hover"
                >
                  Download
                </a>

                {onEditClick ? (
                  <button
                    type="button"
                    onClick={() => onEditClick(result)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm text-white transition hover:bg-primary-hover"
                  >
                    Editar
                  </button>
                ) : null}
              </div>
            ) : null}

            {result.errorMessage ? (
              <p className="mt-2 text-sm text-error">{result.errorMessage}</p>
            ) : null}
          </div>
        ) : null}
      </form>

      {previewModalSrc ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closePreview}
        >
          <div
            className="relative max-h-[90vh] max-w-[95vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePreview}
              className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold text-black shadow-lg"
            >
              ×
            </button>

            <div className="relative h-[85vh] w-[95vw] max-w-6xl">
              <Image
                src={previewModalSrc}
                alt="Visualização completa"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
