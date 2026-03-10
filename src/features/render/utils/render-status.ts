import {
  IconAlertCircle,
  IconBolt,
  IconCircleCheck,
  IconClock,
} from "@tabler/icons-react";
import type { RenderItem } from "../types/render.types";

export function getRenderStatus(status: RenderItem["status"]) {
  switch (status) {
    case "PENDING":
      return {
        label: "Na fila",
        description: "Aguardando processamento",
        icon: IconClock,
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20",
      };

    case "PROCESSING":
      return {
        label: "Gerando",
        description: "IA processando o render",
        icon: IconBolt,
        color: "text-sky-400",
        bg: "bg-sky-500/10 border-sky-500/20",
      };

    case "DONE":
      return {
        label: "Concluído",
        description: "Render finalizado",
        icon: IconCircleCheck,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/20",
      };

    case "ERROR":
      return {
        label: "Erro",
        description: "Falha ao gerar render",
        icon: IconAlertCircle,
        color: "text-rose-400",
        bg: "bg-rose-500/10 border-rose-500/20",
      };

    default:
      return {
        label: status,
        description: "",
        icon: IconAlertCircle,
        color: "text-zinc-400",
        bg: "bg-zinc-500/10 border-zinc-500/20",
      };
  }
}
