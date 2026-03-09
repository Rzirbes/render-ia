import { IconAlertCircle, IconBolt, IconCircleCheck, IconClock } from "@tabler/icons-react";
import type { RenderItem } from "../types/render.types";

export function getRenderStatus(status: RenderItem["status"]) {
  switch (status) {
    case "PENDING":
      return {
        label: "Render na fila...",
        icon: IconClock,
      };

    case "PROCESSING":
      return {
        label: "Gerando render com IA...",
        icon: IconBolt,
      };

    case "DONE":
      return {
        label: "Render finalizado!",
        icon: IconCircleCheck,
      };

    case "ERROR":
      return {
        label: "Erro ao gerar render",
        icon: IconAlertCircle,
      };

    default:
      return {
        label: status,
        icon: IconAlertCircle,
      };
  }
}
