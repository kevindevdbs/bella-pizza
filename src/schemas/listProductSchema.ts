import { z } from "zod";

export const listProductSchema = z.object({
  disabled: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val === "true" || val === "false",
      {
        message: "O parâmetro disabled deve ser true ou false",
      },
    ),
});

export type listProductSchema = z.infer<typeof listProductSchema>;