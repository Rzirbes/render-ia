import { isAuthenticated } from "@/features/auth/server/auth-session";
import { redirect } from "next/navigation";
import AppHeader from "@/features/layout/components/app-header";
import { DashboardLayoutProps } from "@/features/auth/types/auth.types";

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect(`/${locale}/login`);
  }

  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  );
}
