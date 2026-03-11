"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import RenderCreateForm from "@/features/render/components/render-create-form";
import { RendersHistory } from "@/features/render/components/renders-history";
import type { RenderItem } from "@/features/render/types/render.types";
import { RendersDetailModal } from "./renders-detail-modal";

type RenderDashboardClientProps = {
  totalRenders?: number;
};

export default function RenderDashboardClient({
}: RenderDashboardClientProps) {
  const [selectedRender, setSelectedRender] = useState<RenderItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleOpenRender(render: RenderItem) {
    setSelectedRender(render);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedRender(null);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <Card className="rounded-2xl border-white/10 bg-white/2 p-6 md:p-7">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">
            Criar novo render
          </h2>

          <p className="mt-1 text-sm text-muted">
            Envie uma imagem, descreva o ambiente e gere uma nova versão.
          </p>
        </div>

        <RenderCreateForm />
      </Card>

      <Card className="rounded-2xl border-white/10 bg-white/2 p-5 md:p-6">
        <div className="flex h-[calc(100vh-180px)] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-background p-5">
          <div className="mb-4 shrink-0">
            <h3 className="text-xl font-semibold text-text-primary">
              Renders recentes
            </h3>
            <p className="text-sm text-text-secondary">
              Histórico compacto dos últimos renders.
            </p>
          </div>

          <div className="min-h-0 flex-1">
            <RendersHistory onOpenRender={handleOpenRender} />
          </div>
        </div>
      </Card>

      {isModalOpen && selectedRender ? (
        <RendersDetailModal
          open={isModalOpen}
          render={selectedRender}
          onClose={handleCloseModal}
        />
      ) : null}
    </section>
  );
}
