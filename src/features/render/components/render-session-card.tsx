"use client";

import { useState } from "react";
import type { RenderItem } from "@/features/render/types/render.types";
import RenderEditForm from "./render-edit-form";
import { IconDownload, IconPencil } from "@tabler/icons-react";
import { getRenderStatus } from "../utils/render-status";

type RenderSessionCardProps = {
  render: RenderItem;
  imageUrl: string | null;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSuccessEdit: (render: RenderItem) => void;
  onDownload: () => Promise<void>;
};

export default function RenderSessionCard({
  render,
  imageUrl,
  isEditing,
  onToggleEdit,
  onSuccessEdit,
  onDownload,
}: RenderSessionCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const statusInfo = getRenderStatus(render.status);
  const StatusIcon = statusInfo.icon;

  async function handleDownloadClick() {
    try {
      setIsDownloading(true);
      await onDownload();
    } catch (error) {
      console.error(error);
      alert("Erro ao baixar imagem.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4 md:p-5">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={render.prompt || "Render gerado"}
                className="h-full max-h-[420px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[280px] items-center justify-center text-sm text-zinc-500">
                Imagem indisponível
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Prompt
              </p>
              <p className="mt-1 text-sm text-zinc-200">
                {render.prompt || "Sem prompt informado."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs text-zinc-500">Status</p>

                <div className="mt-2">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${statusInfo.bg}`}
                  >
                    <StatusIcon size={14} className={statusInfo.color} />
                    <span className="text-white">{statusInfo.label}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs text-zinc-500">Preset</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {render.presetId}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {imageUrl ? (
              <button
                type="button"
                onClick={() => void handleDownloadClick()}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <IconDownload size={16} />
                {isDownloading ? "Baixando..." : "Download"}
              </button>
            ) : null}

            <button
              type="button"
              onClick={onToggleEdit}
              className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/15 px-4 py-2 text-sm font-medium text-fuchsia-200 transition hover:bg-fuchsia-500/25 hover:text-white"
            >
              <IconPencil size={16} />
              {isEditing ? "Fechar edição" : "Editar render"}
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-5 border-t border-white/10 pt-5">
          <RenderEditForm
            renderId={render.id}
            previewSrc={imageUrl ?? ""}
            onSuccess={onSuccessEdit}
          />
        </div>
      ) : null}
    </div>
  );
}
