import { Request, Response } from "express";
import { CreateOrderService } from "../../services/order/CreateOrderService";

export class CreateOrderController {
  async handle(req: Request, res: Response) {
    const { name, table } = req.body;

    const createOrderService = new CreateOrderService();
    const order = await createOrderService.execute({
      name: name,
      table: table,
    });

    res.status(201).json({
      order,
    });
  }
}
