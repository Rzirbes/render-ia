"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerService } from "@/features/auth/services/auth.service";
import {
  registerSchema,
  type RegisterSchemaData,
} from "@/features/auth/schemas/auth.schema";
import { RegisterRequest } from "@/features/auth/types/auth.types";

type RegisterFormProps = {
  locale: string;
};

export function RegisterForm({ locale }: RegisterFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterRequest) {
    try {
      setServerError(null);

      await registerService({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      router.push(`/${locale}/login`);
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Erro inesperado ao criar conta.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Criar conta</h1>
        <p className="text-sm text-muted">
          Cadastre-se para começar a usar o RenderIA
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm text-foreground">
          Nome
        </label>
        <input
          id="name"
          type="text"
          placeholder="Seu nome"
          {...register("name")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary"
        />
        {errors.name && (
          <p className="text-sm text-error">{errors.name.message}</p>
        )}
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
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary"
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
          placeholder="Mínimo de 8 caracteres"
          {...register("password")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary"
        />
        {errors.password && (
          <p className="text-sm text-error">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm text-foreground">
          Confirmar senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Repita sua senha"
          {...register("confirmPassword")}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-error">{errors.confirmPassword.message}</p>
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
        className="w-full rounded-xl bg-primary px-4 py-3 font-medium text-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Criando conta..." : "Cadastrar"}
      </button>

      <div className="text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link
          href={`/${locale}/login`}
          className="font-medium text-primary transition hover:text-primary-hover"
        >
          Entrar
        </Link>
      </div>
    </form>
  );
}
