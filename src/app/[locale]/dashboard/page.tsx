import { isAuthenticated } from "@/features/auth/server/auth-session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard</h1>
    </main>
  );
}
