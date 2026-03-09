"use client";

import { RenderItemList } from "../types/render.types";
import {
  getRenderStatusClassName,
  getRenderStatusLabel,
} from "../utils/render-history.helpers";

type Props = {
  status: RenderItemList["status"];
};

export function RenderHistoryStatusBadge({ status }: Props) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${getRenderStatusClassName(status)}`}
    >
      {getRenderStatusLabel(status)}
    </span>
  );
}
