import { Request, Response } from "express";
import { AddItemOrderService } from "../../services/order/AddItemOrderService";

export class AddItemOrderController {
  async handle(req: Request, res: Response) {
    const { order_id, product_id, amount, note } = req.body;

    const addItemOrderService = new AddItemOrderService();
    const item = await addItemOrderService.execute({
      order_id,
      product_id,
      amount,
      note,
    });

    res.status(201).json(item);
  }
}
