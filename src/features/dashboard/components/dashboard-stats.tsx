"use client";

import { Card } from "@/components/ui/card";
import { IconCoins, IconCrown, IconPhoto } from "@tabler/icons-react";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useRenders } from "@/features/render/hooks/use-renders";

export default function DashboardStats() {
  const { user, isLoading } = useCurrentUser();
  const { totalRenders, isLoading: isLoadingRenders } = useRenders();

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted">Créditos disponíveis</span>

            <strong className="text-2xl text-foreground">
              {isLoading ? "..." : (user?.credits ?? 0)}
            </strong>
          </div>

          <div className="rounded-xl border border-border bg-background p-3">
            <IconCoins size={24} className="text-primary" />
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted">Plano atual</span>

            <strong className="text-2xl text-foreground">Free</strong>
          </div>

          <div className="rounded-xl border border-border bg-background p-3">
            <IconCrown size={24} className="text-primary" />
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted">Total de renders</span>

            <strong className="text-2xl text-foreground">
              {isLoadingRenders ? "..." : totalRenders}
            </strong>
          </div>

          <div className="rounded-xl border border-border bg-background p-3">
            <IconPhoto size={24} className="text-primary" />
          </div>
        </div>
      </Card>
    </section>
  );
}
