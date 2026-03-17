import { Request, Response } from "express";
import { UpdateOrderItemService } from "../../services/order/UpdateOrderItemService";

export class UpdateOrderItemController {
  async handle(req: Request, res: Response) {
    const { item_id, amount, note } = req.body;

    const service = new UpdateOrderItemService();
    const item = await service.execute({
      item_id,
      amount,
      note,
    });

    return res.status(200).json(item);
  }
}
