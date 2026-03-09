import z, { ZodError, ZodType } from "zod";
import { NextFunction, Request, Response } from "express";

export const validateSchema =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);

      return next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: z.flattenError(error) });
      }

      res.status(500).json({ error: "Erro Interno do Servidor." });
    }
  };
