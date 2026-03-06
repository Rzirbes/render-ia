import { LoginForm } from "@/features/auth/components/login-form";

type LoginPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <LoginForm locale={locale} />
      </div>
    </main>
  );
}
