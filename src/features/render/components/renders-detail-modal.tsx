"use client";

import Image from "next/image";
import type { RenderItem } from "@/features/render/types/render.types";
import { getRenderStatus } from "../utils/render-status";
import {
  downloadRenderImage,
  getRenderDownloadFileName,
} from "../utils/download-render-image";
import { IconDownload, IconX } from "@tabler/icons-react";

type RendersDetailModalProps = {
  open: boolean;
  render: RenderItem | null;
  onClose: () => void;
};

export function RendersDetailModal({
  open,
  render,
  onClose,
}: RendersDetailModalProps) {
  if (!open || !render) return null;

  const imageSrc = render.generatedImageUrl ?? render.originalImageUrl ?? "";
  const imageAlt = render.prompt ?? "Render";

  const status = getRenderStatus(render.status);
  const StatusIcon = status.icon;

  const downloadableImageUrl = render.generatedImageUrl;

  function handleDownload() {
    if (!downloadableImageUrl) return;

    downloadRenderImage(
      downloadableImageUrl,
      getRenderDownloadFileName(downloadableImageUrl),
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl rounded-2xl border border-white/10 bg-background p-6 shadow-2xl">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            Detalhes do render
          </h3>

          <button
            onClick={onClose}
            className="rounded-md p-2 text-text-secondary transition hover:bg-white/5"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          {/* IMAGEM */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                Imagem indisponível
              </div>
            )}
          </div>

          {/* INFORMAÇÕES */}
          <div className="flex flex-col gap-5">
            {/* PROMPT */}
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">
                Prompt
              </p>

              <div className="mt-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-text-primary">
                {render.prompt || "Sem prompt informado."}
              </div>
            </div>

            {/* PRESET */}
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">
                Preset
              </p>

              <p className="mt-1 text-sm text-text-primary">
                {render.presetId || "Não informado"}
              </p>
            </div>

            {/* STATUS */}
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">
                Status
              </p>

              <div
                className={`mt-2 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${status.bg}`}
              >
                <StatusIcon size={16} className={status.color} />

                <span className="font-medium text-text-primary">
                  {status.label}
                </span>
              </div>

              {status.description && (
                <p className="mt-1 text-xs text-text-secondary">
                  {status.description}
                </p>
              )}
            </div>

            {/* CRÉDITOS */}
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">
                Créditos usados
              </p>

              <p className="mt-1 text-sm text-text-primary">
                {render.creditsUsed ?? 0}
              </p>
            </div>

            {/* DOWNLOAD */}
            {render.status === "DONE" && render.generatedImageUrl && (
              <button
                onClick={handleDownload}
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-primary transition hover:bg-white/10"
              >
                <IconDownload size={16} />
                Baixar render
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
