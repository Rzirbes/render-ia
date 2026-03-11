"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ResetPasswordFormProps = {
  locale: string;
  token: string;
};

export function ResetPasswordForm({ locale, token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tokenInvalid = !token;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setServerError("As senhas não coincidem.");
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError(null);
      setSuccessMessage(null);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message = Array.isArray(result?.message)
          ? result.message[0]
          : result?.message;

        throw new Error(message || "Não foi possível redefinir a senha.");
      }

      setSuccessMessage("Senha redefinida com sucesso.");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 1500);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao redefinir a senha.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (tokenInvalid) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Link inválido
          </h1>
          <p className="text-sm text-muted">
            O token de redefinição não foi encontrado.
          </p>

          <Link
            href={`/${locale}/forgot-password`}
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 font-medium text-white transition hover:bg-primary-hover"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Redefinir senha
          </h1>
          <p className="text-sm text-muted">
            Digite sua nova senha para acessar sua conta novamente.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-foreground"
          >
            Nova senha
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Digite a nova senha"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-foreground"
          >
            Confirmar nova senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
          {isSubmitting ? "Salvando..." : "Redefinir senha"}
        </button>

        <div className="text-center text-sm text-muted">
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
