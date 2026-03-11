import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <ResetPasswordForm locale={locale} token={token ?? ""} />
    </div>
  );
}
