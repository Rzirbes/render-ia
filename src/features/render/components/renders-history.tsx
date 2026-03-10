"use client";

import { useEffect, useState } from "react";

import {
  RenderHistoryEmpty,
  RenderHistoryError,
  RenderHistoryLoading,
} from "./render-history-states";
import { RenderHistoryList } from "./render-history-list";
import { RenderItem, RenderItemList } from "../types/render.types";
import { getRenderService, listRendersService } from "../client/render.service";

type Props = {
  onOpenRender: (render: RenderItem) => void;
};

export function RendersHistory({ onOpenRender }: Props) {
  const [renders, setRenders] = useState<RenderItemList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function handleOpenRender(id: string) {
    try {
      const render = await getRenderService(id);
      onOpenRender(render);
    } catch (err) {
      console.error("Erro ao abrir render", err);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        setError(null);

        const data = await listRendersService();
        setRenders(data.items ?? []);
      } catch (err) {
        console.error("Erro ao carregar renders", err);
        setError("Não foi possível carregar os renders.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <RenderHistoryLoading />;
  }

  if (error) {
    return <RenderHistoryError message={error} />;
  }

  if (renders.length === 0) {
    return <RenderHistoryEmpty />;
  }

  return <RenderHistoryList renders={renders} onOpen={handleOpenRender} />;
}
