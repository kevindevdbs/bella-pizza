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
  note: z
    .string({ message: "A observação precisa ser um texto" })
    .trim()
    .max(220, { message: "A observação deve ter no máximo 220 caracteres" })
    .optional(),
});

export const activeOrderByTableSchema = z.object({
  table: z.coerce
    .number({ message: "A mesa do pedido e obrigatória" })
    .int({ message: "o número da mesa deve ser um número inteiro" })
    .positive({ message: "O número da mesa deve ser positivo" }),
});

export const updateOrderItemSchema = z
  .object({
    item_id: z.string({ message: "O id do item é obrigatório" }),
    amount: z
      .number({ message: "A quantidade deve ser um número" })
      .int({ message: "A quantidade deve ser um número inteiro" })
      .positive({ message: "A quantidade deve ser positiva" })
      .optional(),
    note: z
      .string({ message: "A observação precisa ser um texto" })
      .trim()
      .max(220, { message: "A observação deve ter no máximo 220 caracteres" })
      .optional(),
  })
  .refine(
    (payload) => payload.amount !== undefined || payload.note !== undefined,
    {
      message: "Envie amount ou note para atualizar o item",
      path: ["item_id"],
    },
  );

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
export type activeOrderByTableSchema = z.infer<typeof activeOrderByTableSchema>;
export type updateOrderItemSchema = z.infer<typeof updateOrderItemSchema>;
export type removeItemOrderSchema = z.infer<typeof removeItemOrderSchema>;
export type deleteOrderSchema = z.infer<typeof deleteOrderSchema>;
export type sendOrderSchema = z.infer<typeof sendOrderSchema>;
export type finishOrderSchema = z.infer<typeof finishOrderSchema>;
