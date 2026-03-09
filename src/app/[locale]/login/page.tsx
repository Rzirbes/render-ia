import { isAuthenticated } from "@/features/auth/server/auth-session";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect(`/${locale}/home`);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <LoginForm locale={locale} />
      </div>
    </main>
  );
}
