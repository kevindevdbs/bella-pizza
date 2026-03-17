import { Request, Response } from "express";
import { RemoveItemOrderService } from "../../services/order/RemoveItemOrderService";

export class RemoveItemOrderController {
  async handle(req: Request, res: Response) {
    const item_id = req.query.item_id as string;

    const removeItemOrderService = new RemoveItemOrderService();
    const result = await removeItemOrderService.execute({ item_id });

    return res.status(200).json({ message: result });
  }
}
