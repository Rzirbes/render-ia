"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginSchemaData,
} from "@/features/auth/schemas/auth.schema";

type LoginFormProps = {
  locale: string;
};

export function LoginForm({ locale }: LoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchemaData) {
    try {
      setServerError(null);

      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const message = Array.isArray(result?.message)
          ? result.message[0]
          : result?.message;

        throw new Error(message || "Não foi possível fazer login.");
      }

      router.push(`/${locale}/home`);
      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao fazer login.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Entrar</h1>
        <p className="text-sm text-muted">
          Acesse sua conta para continuar no RenderIA
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
          {...register("email")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {errors.email && (
          <p className="text-sm text-error">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm text-foreground">
          Senha
        </label>
        <input
          id="password"
          type="password"
          placeholder="Digite sua senha"
          {...register("password")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {errors.password && (
          <p className="text-sm text-error">{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <div className="rounded-xl border border-error bg-error-soft px-4 py-3 text-sm text-error">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-primary px-4 py-3 font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      <div className="text-center text-sm text-muted">
        Não tem conta?{" "}
        <Link
          href={`/${locale}/register`}
          className="font-medium text-foreground transition hover:text-primary-hover"
        >
          Criar conta
        </Link>
      </div>
    </form>
  );
}
