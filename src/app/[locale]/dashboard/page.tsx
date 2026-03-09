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
      <main className="py-10">
        <Container>
          <div className="flex flex-col gap-8">
            {/* Header */}
            <section className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-text-primary">
                Dashboard
              </h1>

              <p className="text-text-secondary">
                Gere renders arquitetônicos com IA e acompanhe seus resultados.
              </p>
            </section>

            {/* Stats */}
            <section className="grid gap-4 md:grid-cols-3">
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-text-secondary">
                      Créditos disponíveis
                    </span>

                    <strong className="text-2xl text-text-primary">
                      {user?.credits ?? 0}
                    </strong>
                  </div>

                  <IconCoins size={28} className="text-brand" />
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-text-secondary">
                      Plano atual
                    </span>

                    <strong className="text-2xl text-text-primary">Free</strong>
                  </div>

                  <IconCrown size={28} className="text-brand" />
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-text-secondary">
                      Total de renders
                    </span>

                    <strong className="text-2xl text-text-primary">0</strong>
                  </div>

                  <IconPhoto size={28} className="text-brand" />
                </div>
              </Card>
            </section>

            {/* Content */}
            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Create render */}
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Criar novo render
                  </h2>

                  <p className="mt-1 text-sm text-text-secondary">
                    Envie uma imagem, descreva o ambiente e gere uma nova
                    versão.
                  </p>
                </div>

                <RenderCreateForm />
              </Card>

              {/* Recent renders */}
              <Card>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Renders recentes
                  </h2>

                  <p className="mt-1 text-sm text-text-secondary">
                    Aqui aparecerão seus últimos renders gerados.
                  </p>
                </div>

                <RendersHistory />
              </Card>
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
