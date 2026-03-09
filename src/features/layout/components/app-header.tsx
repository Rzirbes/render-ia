import { getCurrentUser } from "@/features/auth/server/auth-session";
import { IconBolt, IconCoins, IconUser } from "@tabler/icons-react";

export default async function AppHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-text-primary">
          <IconBolt size={22} className="text-brand" />
          <span>RenderIA</span>
        </div>

        {/* User area */}
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <IconUser size={18} />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-1 rounded-lg bg-surface px-3 py-1 border border-border">
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
