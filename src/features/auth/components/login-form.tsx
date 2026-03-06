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

      const response = await fetch(`/${locale}/api/auth/login`, {
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
      className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">Entrar</h1>
        <p className="text-sm text-zinc-400">
          Acesse sua conta para continuar no RenderIA
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm text-zinc-200">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          placeholder="seuemail@exemplo.com"
          {...register("email")}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-zinc-500"
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm text-zinc-200">
          Senha
        </label>
        <input
          id="password"
          type="password"
          placeholder="Digite sua senha"
          {...register("password")}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-zinc-500"
        />
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      <div className="text-center text-sm text-zinc-400">
        Não tem conta?{" "}
        <Link
          href={`/${locale}/register`}
          className="font-medium text-white hover:underline"
        >
          Criar conta
        </Link>
      </div>
    </form>
  );
}
