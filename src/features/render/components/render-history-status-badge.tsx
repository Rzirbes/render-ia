"use client";

import {
  IconCheck,
  IconClock,
  IconLoader2,
  IconAlertTriangle,
} from "@tabler/icons-react";

import { RenderItemList } from "../types/render.types";

type Props = {
  status: RenderItemList["status"];
};

export function RenderHistoryStatusBadge({ status }: Props) {
  if (status === "DONE") {
    return <IconCheck size={18} className="shrink-0 text-success" />;
  }

  if (status === "PROCESSING") {
    return (
      <IconLoader2 size={18} className="shrink-0 animate-spin text-accent" />
    );
  }

  if (status === "PENDING") {
    return <IconClock size={18} className="shrink-0 text-text-secondary" />;
  }

  if (status === "ERROR") {
    return <IconAlertTriangle size={18} className="shrink-0 text-error" />;
  }

  return null;
}
