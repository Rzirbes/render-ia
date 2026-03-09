"use client";

import { RenderItemList } from "../types/render.types";
import { RenderHistoryCard } from "./render-history-card";

type Props = {
  renders: RenderItemList[];
};

export function RenderHistoryList({ renders }: Props) {
  return (
    <div className="flex max-h-[520px] flex-col gap-3 overflow-y-auto pr-1">
      {renders.map((render) => (
        <RenderHistoryCard key={render.id} render={render} />
      ))}
    </div>
  );
}
