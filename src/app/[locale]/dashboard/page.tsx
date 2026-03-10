import { RendersHistory } from "@/features/render/components/renders-history";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/features/auth/server/auth-session";

import { IconCoins, IconCrown, IconPhoto } from "@tabler/icons-react";
import RenderCreateForm from "@/features/render/components/render-create-form";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <main className="py-8 md:py-10">
        <Container>
          <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
                Dashboard
              </h1>

              <p className="max-w-2xl text-sm text-text-secondary md:text-base">
                Gere renders arquitetônicos com IA e acompanhe seus resultados.
              </p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-2xl border-white/10 bg-white/2 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-text-secondary">
                      Créditos disponíveis
                    </span>

                    <strong className="text-2xl text-text-primary">
                      {user?.credits ?? 0}
                    </strong>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                    <IconCoins size={24} className="text-brand" />
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-white/10 bg-white/2 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-text-secondary">
                      Plano atual
                    </span>

                    <strong className="text-2xl text-text-primary">Free</strong>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                    <IconCrown size={24} className="text-brand" />
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-white/10 bg-white/2 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-text-secondary">
                      Total de renders
                    </span>

                    <strong className="text-2xl text-text-primary">0</strong>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                    <IconPhoto size={24} className="text-brand" />
                  </div>
                </div>
              </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
              <Card className="rounded-2xl border-white/10 bg-white/2 p-6 md:p-7">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary md:text-2xl">
                    Criar novo render
                  </h2>

                  <p className="mt-1 text-sm text-text-secondary">
                    Envie uma imagem, descreva o ambiente e gere uma nova
                    versão.
                  </p>
                </div>

                <RenderCreateForm />
              </Card>

              <Card className="rounded-2xl border-white/10 bg-white/2 p-5 md:p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                      Renders recentes
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      Histórico compacto dos últimos renders.
                    </p>
                  </div>
                </div>

                <div className="max-h-130 overflow-hidden">
                  <RendersHistory />
                </div>
              </Card>
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
