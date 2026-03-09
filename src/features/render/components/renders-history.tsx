"use client";

import { useEffect, useState } from "react";

import {
  RenderHistoryEmpty,
  RenderHistoryError,
  RenderHistoryLoading,
} from "./render-history-states";
import { RenderHistoryList } from "./render-history-list";
import { RenderItemList } from "../types/render.types";
import { listRendersService } from "../client/render.service";

export function RendersHistory() {
  const [renders, setRenders] = useState<RenderItemList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);

        const data = await listRendersService();

        console.log("RENDERS HISTORY RESPONSE:", data);
        console.log("RENDERS HISTORY ITEMS:", data.items);

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

  return <RenderHistoryList renders={renders} />;
}
