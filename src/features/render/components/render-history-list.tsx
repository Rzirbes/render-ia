"use client";

import { RenderItemList } from "../types/render.types";
import { RenderHistoryCard } from "./render-history-card";

type Props = {
  renders: RenderItemList[];
  onOpen: (id: string) => void;
};

export function RenderHistoryList({ renders, onOpen }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto pr-1 pb-1">
      {renders.map((render) => (
        <RenderHistoryCard key={render.id} render={render} onOpen={onOpen} />
      ))}
    </div>
  );
}
