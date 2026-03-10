"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { logoutAction } from "@/features/auth/server/logout";
import { IconBolt, IconCoins, IconUser, IconLogout } from "@tabler/icons-react";

export default function AppHeader() {
  const { user, isLoading, mutateUser } = useCurrentUser();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logoutAction();

      await mutateUser(undefined, { revalidate: false });

      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Erro ao fazer logout", err);
    }
  }

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

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-1 transition hover:bg-surface"
              >
                <IconLogout size={16} />
                Sair
              </button>
            </>
          ) : (
            <span className="text-text-muted">Não autenticado</span>
          )}
        </div>
      </div>
    </header>
  );
}
