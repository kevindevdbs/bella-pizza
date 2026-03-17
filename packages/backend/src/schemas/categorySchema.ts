import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string({message: "O nome precisa ser um texto"}).min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
});

export type createCategorySchema = z.infer<typeof createCategorySchema>;
