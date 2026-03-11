import { Request, Response } from "express";
import { ListProductService } from "../../services/product/ListProductService";
import { listProductSchema } from "../../schemas/productSchema";

interface IListProductQuery {
  disabled?: string;
}

export class ListProductController {
  async handle(
    req: Request<object, object, object, IListProductQuery>,
    res: Response,
  ) {
    // Validação do query param usando schema Zod
    const parseResult = listProductSchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.message });
    }

    const disabledParam = req.query.disabled ?? "false";

    const listProductService = new ListProductService();
    const products = await listProductService.execute({
      disabled: disabledParam === "true",
    });

    return res.status(200).json(products);
  }
}
