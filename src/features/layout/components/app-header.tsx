"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { IconBolt, IconCoins, IconUser } from "@tabler/icons-react";

export default function AppHeader() {
  const { user, isLoading } = useCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2 font-semibold text-text-primary">
          <IconBolt size={22} className="text-brand" />
          <span>RenderIA</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-text-secondary">
          {isLoading ? (
            <span className="text-text-muted">Carregando...</span>
          ) : user ? (
            <>
              <div className="flex items-center gap-2">
                <IconUser size={18} />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1">
                <IconCoins size={16} className="text-brand" />
                <span className="text-text-primary">{user.credits}</span>
              </div>
            </>
          ) : (
            <span className="text-text-muted">Não autenticado</span>
          )}
        </div>
      </div>
    </header>
  );
}
