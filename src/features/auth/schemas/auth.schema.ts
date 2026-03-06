import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nome obrigatório"),
    email: z.string().trim().email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterSchemaData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginSchemaData = z.infer<typeof loginSchema>;
