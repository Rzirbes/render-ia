import { isAuthenticated } from "@/features/auth/server/auth-session";
import { redirect } from "next/navigation";

export default async function Page() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect("/dashboard");
  }

  redirect("/login");
}
