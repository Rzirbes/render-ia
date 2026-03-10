import { Container } from "@/components/ui/container";
import DashboardStats from "@/features/dashboard/components/dashboard-stats";
import RenderDashboardClient from "@/features/render/components/render-dashboard-client";

export default async function DashboardPage() {
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

            <DashboardStats totalRenders={0} />

            <RenderDashboardClient totalRenders={0} />
          </div>
        </Container>
      </main>
    </div>
  );
}
