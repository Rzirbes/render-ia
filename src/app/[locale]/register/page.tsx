import { RegisterForm } from "@/features/auth/components/register-form";

type RegisterPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <RegisterForm locale={locale} />
      </div>
    </main>
  );
}
