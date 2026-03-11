import { z } from "zod";

export const createOrderSchema = z.object({
  name: z.string({ message: "O nome precisa ser um texto" }).optional(),
  table: z
    .number({ message: "A mesa do pedido e obrigatória" })
    .int({ message: "o número da mesa deve ser um número inteiro" })
    .positive({ message: "O número da mesa deve ser positivo" }),
});

export const listOrdersSchema = z.object({
  draft: z
    .string()
    .optional()
    .refine(
      (value) => value === undefined || value === "true" || value === "false",
      {
        message: "O parâmetro draft deve ser true ou false",
      },
    ),
});

export const detailOrderSchema = z.object({
  order_id: z.string({ message: "O id da order é obrigatório" }),
});

export const addItemOrderSchema = z.object({
  order_id: z.string({ message: "O id da order é obrigatório" }),
  product_id: z.string({ message: "O id do produto é obrigatório" }),
  amount: z
    .number()
    .int({ message: "O número deve ser inteiro" })
    .positive({ message: "O número deve ser positivo" }),
});

export const removeItemOrderSchema = z.object({
  item_id: z.string({ message: "O id do item é obrigatório" }),
});

export const deleteOrderSchema = z.object({
  order_id: z.string({ message: "O id da order é obrigatório" }),
});

export const sendOrderSchema = z.object({
  name: z.string({ message: "O nome do cliente precisa ser um texto" }),
  order_id: z.string({ message: "O id do pedido precisa ser um texto" }),
});

export const finishOrderSchema = z.object({
  order_id: z.string({ message: "O id do pedido precisa ser um texto" }),
});

export type listOrdersSchema = z.infer<typeof listOrdersSchema>;
export type createOrderSchema = z.infer<typeof createOrderSchema>;
export type detailOrderSchema = z.infer<typeof detailOrderSchema>;
export type addItemOrderSchema = z.infer<typeof addItemOrderSchema>;
export type removeItemOrderSchema = z.infer<typeof removeItemOrderSchema>;
export type deleteOrderSchema = z.infer<typeof deleteOrderSchema>;
export type sendOrderSchema = z.infer<typeof sendOrderSchema>;
export type finishOrderSchema = z.infer<typeof finishOrderSchema>;
