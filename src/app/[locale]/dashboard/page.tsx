import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/features/auth/server/auth-session";
import { IconCoins, IconCrown, IconPhoto } from "@tabler/icons-react";
import RenderDashboardClient from "@/features/render/components/render-dashboard-client";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="py-8 md:py-10">
        <Container>
          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Dashboard
              </h1>

              <p className="max-w-2xl text-sm text-muted md:text-base">
                Gere renders arquitetônicos com IA e acompanhe seus resultados.
              </p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-[#18181f]">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted">
                      Créditos disponíveis
                    </span>

                    <strong className="text-2xl text-foreground">
                      {user?.credits ?? 0}
                    </strong>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-3">
                    <IconCoins size={24} className="text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-[#18181f]">
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

              <Card className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-[#18181f]">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted">Total de renders</span>

                    <strong className="text-2xl text-foreground">10</strong>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-3">
                    <IconPhoto size={24} className="text-primary" />
                  </div>
                </div>
              </Card>
            </section>

            <RenderDashboardClient totalRenders={0} />
          </div>
        </Container>
      </main>
    </div>
  );
}
