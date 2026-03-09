"use client";

import {
  IconAlertCircle,
  IconLoader2,
  IconPhotoOff,
} from "@tabler/icons-react";

export function RenderHistoryLoading() {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center gap-3 text-sm text-text-muted">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
        <IconLoader2 size={18} className="animate-spin" />
      </div>
      <span>Carregando renders...</span>
    </div>
  );
}

export function RenderHistoryError({ message }: { message: string }) {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center gap-3 text-sm text-red-400">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
        <IconAlertCircle size={20} />
      </div>
      <span>{message}</span>
    </div>
  );
}

export function RenderHistoryEmpty() {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/30 px-6 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface">
        <IconPhotoOff size={24} className="text-text-muted" />
      </div>

      <p className="text-sm font-medium text-text-primary">
        Nenhum render encontrado
      </p>

      <p className="mt-1 text-sm text-text-secondary">
        Seus renders recentes aparecerão aqui assim que forem gerados.
      </p>
    </div>
  );
}
