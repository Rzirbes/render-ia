import type { RenderItemList } from "../types/render.types";

export function getRenderStatusLabel(status: RenderItemList["status"]) {
  switch (status) {
    case "PENDING":
      return "Na fila";
    case "PROCESSING":
      return "Processando";
    case "DONE":
      return "Concluído";
    case "ERROR":
      return "Erro";
    default:
      return status;
  }
}

export function getRenderStatusClassName(status: RenderItemList["status"]) {
  switch (status) {
    case "DONE":
      return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    case "PROCESSING":
      return "border border-amber-500/20 bg-amber-500/10 text-amber-400";
    case "PENDING":
      return "border border-blue-500/20 bg-blue-500/10 text-blue-400";
    case "ERROR":
      return "border border-red-500/20 bg-red-500/10 text-red-400";
    default:
      return "border border-zinc-700 bg-zinc-800 text-zinc-300";
  }
}

export function formatRenderDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function getRenderTitle(render: RenderItemList) {
  return (
    render.prompt?.trim() ||
    render.presetId?.replaceAll("_", " ") ||
    "Render sem título"
  );
}
