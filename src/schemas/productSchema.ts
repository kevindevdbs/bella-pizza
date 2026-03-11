import z from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "O nome do produto é obrigatório"),
    price: z.string().min(1, { message: "O preço do produto é obrigatório" }).regex(/^\d+$/, "O preço deve ser um número inteiro"),
    description: z.string().min(1 , {message: "A descrição do produto é obrigatória"}),
    category_id: z.string().min(1 , {message: "A categoria do produto é obrigatória"})
})

export type createProductSchema = z.infer<typeof createProductSchema>;