import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ForgotPasswordPage({ params }: PageProps) {
  const { locale } = await params;

  return <ForgotPasswordForm locale={locale} />;
}
