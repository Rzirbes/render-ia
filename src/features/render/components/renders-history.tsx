"use client";

import {
  RenderHistoryEmpty,
  RenderHistoryError,
  RenderHistoryLoading,
} from "./render-history-states";
import { RenderHistoryList } from "./render-history-list";
import { RenderItem } from "../types/render.types";
import { getRenderService } from "../client/render.service";
import { useRenders } from "../hooks/use-renders";

type Props = {
  onOpenRender: (render: RenderItem) => void;
};

export function RendersHistory({ onOpenRender }: Props) {
  const { renders, error, isLoading } = useRenders();

  async function handleOpenRender(id: string) {
    try {
      const render = await getRenderService(id);
      onOpenRender(render);
    } catch (err) {
      console.error("Erro ao abrir render", err);
    }
  }

  if (isLoading) {
    return <RenderHistoryLoading />;
  }

  if (error) {
    return (
      <RenderHistoryError message="Não foi possível carregar os renders." />
    );
  }

  if (renders.length === 0) {
    return <RenderHistoryEmpty />;
  }

  return <RenderHistoryList renders={renders} onOpen={handleOpenRender} />;
}
