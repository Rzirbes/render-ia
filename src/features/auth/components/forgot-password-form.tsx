"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPasswordService } from "@/features/auth/client/forgot-password.service";

type ForgotPasswordFormProps = {
  locale: string;
};

export function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setServerError(null);
      setSuccessMessage(null);

      await forgotPasswordService({
        email,
        locale,
      });

      setSuccessMessage(
        "Se existir uma conta com esse e-mail, você receberá um link para redefinir sua senha.",
      );
      setEmail("");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao solicitar recuperação de senha.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-8 shadow-sm"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Esqueceu sua senha?
          </h1>
          <p className="text-sm text-muted">
            Informe seu e-mail para receber o link de redefinição.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-foreground">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        {serverError && (
          <div className="rounded-xl border border-error bg-error-soft px-4 py-3 text-sm text-error">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-primary px-4 py-3 font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
        </button>

        <div className="text-center text-sm text-muted">
          Lembrou sua senha?{" "}
          <Link
            href={`/${locale}/login`}
            className="font-medium text-foreground transition hover:text-primary-hover"
          >
            Voltar para login
          </Link>
        </div>
      </form>
    </div>
  );
}
