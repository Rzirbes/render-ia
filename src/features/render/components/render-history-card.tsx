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
  onOpen: (id: string) => void;
};

export function RenderHistoryCard({ render, onOpen }: Props) {
  const imageUrl =
    getRenderImageUrl(render.generatedImageUrl) ??
    getRenderImageUrl(render.originalImageUrl);

  const title = getRenderTitle(render);

  return (
    <button
      type="button"
      onClick={() => onOpen(render.id)}
      className="group flex w-full gap-3 rounded-2xl border border-border bg-surface p-3 text-left transition-all duration-200 hover:border-primary/40 hover:bg-surface-hover"
    >
      <RenderHistoryThumbnail imageUrl={imageUrl} alt={title} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text-primary">
              {title}
            </p>

            <div className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
              <IconCalendarTime size={14} />
              <span>{formatRenderDate(render.createdAt)}</span>
            </div>
          </div>

          <div className="shrink-0">
            <RenderHistoryStatusBadge status={render.status} />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          {render.status === "ERROR" && render.errorMessage ? (
            <p className="line-clamp-1 min-w-0 flex-1 text-xs text-error">
              {render.errorMessage}
            </p>
          ) : (
            <div className="min-w-0 flex items-center gap-1 text-xs text-text-secondary">
              <IconSparkles size={14} className="shrink-0" />
              <span className="truncate">
                Créditos usados: {render.creditsUsed}
              </span>
            </div>
          )}

          {render.presetId ? (
            <span className="max-w-[92px] truncate rounded-md border border-border bg-card px-2 py-1 text-[11px] text-text-secondary">
              {render.presetId}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
