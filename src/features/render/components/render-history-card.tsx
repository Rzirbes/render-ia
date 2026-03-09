"use client";

import { IconCalendarTime, IconSparkles } from "@tabler/icons-react";

import { RenderHistoryThumbnail } from "./render-history-thumbnail";
import { RenderHistoryStatusBadge } from "./render-history-status-badge";
import { RenderItemList } from "../types/render.types";
import { getRenderImageUrl } from "../utils/get-render-image-url";
import {
  formatRenderDate,
  getRenderTitle,
} from "../utils/render-history.helpers";

type Props = {
  render: RenderItemList;
};

export function RenderHistoryCard({ render }: Props) {
  const imageUrl =
    getRenderImageUrl(render.generatedImageUrl) ??
    getRenderImageUrl(render.originalImageUrl);

  const title = getRenderTitle(render);

  return (
    <div className="group flex gap-4 rounded-2xl border border-border bg-surface/40 p-3 transition-all duration-200 hover:border-white/10 hover:bg-surface/70">
      <RenderHistoryThumbnail imageUrl={imageUrl} alt={title} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {title}
            </p>

            <div className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
              <IconCalendarTime size={14} />
              <span>{formatRenderDate(render.createdAt)}</span>
            </div>
          </div>

          <RenderHistoryStatusBadge status={render.status} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          {render.status === "ERROR" && render.errorMessage ? (
            <p className="line-clamp-1 text-xs text-red-400">
              {render.errorMessage}
            </p>
          ) : (
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <IconSparkles size={14} />
              <span>Créditos usados: {render.creditsUsed}</span>
            </div>
          )}

          {render.presetId ? (
            <span className="truncate rounded-md bg-white/5 px-2 py-1 text-[11px] text-text-secondary">
              {render.presetId}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
