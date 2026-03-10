"use client";

import type { RenderItem } from "@/features/render/types/render.types";
import RenderSessionCard from "./render-session-card";

type RenderSessionListProps = {
  renders: RenderItem[];
  editingRenderId: string | null;
  normalizeImageUrl: (url?: string | null) => string | null;
  onToggleEdit: (renderId: string) => void;
  onSuccessEdit: (parentId: string, render: RenderItem) => void;
  onDownload: (render: RenderItem) => Promise<void>;
};

export default function RenderSessionList({
  renders,
  editingRenderId,
  normalizeImageUrl,
  onToggleEdit,
  onSuccessEdit,
  onDownload,
}: RenderSessionListProps) {
  if (renders.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Evolução dos renders
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          Edite uma versão existente e acompanhe as novas variações logo abaixo
          dela.
        </p>
      </div>

      <div className="space-y-4">
        {renders.map((render) => (
          <RenderSessionCard
            key={render.id}
            render={render}
            imageUrl={normalizeImageUrl(render.generatedImageUrl)}
            isEditing={editingRenderId === render.id}
            onToggleEdit={() => onToggleEdit(render.id)}
            onSuccessEdit={(editedRender) =>
              onSuccessEdit(render.id, editedRender)
            }
            onDownload={() => onDownload(render)}
          />
        ))}
      </div>
    </section>
  );
}
