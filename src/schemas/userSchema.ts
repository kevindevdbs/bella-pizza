import { z } from "zod";

export const createUserSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({ message: "O nome precisa ser um texto" })
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  password: z
    .string({ message: "A senha precisa ser um texto" })
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  email: z.email({ message: "Email inválido" }),
  role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
});

export const authUserSchema = z.object({
  email: z.email({ message: "Email inválido" }),
  password: z
    .string({ message: "A senha precisa ser um texto" })
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

export type authUserSchema = z.infer<typeof authUserSchema>;
export type createUserSchema = z.infer<typeof createUserSchema>;
