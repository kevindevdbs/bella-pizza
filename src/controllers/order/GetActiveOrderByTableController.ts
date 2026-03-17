import { Request, Response } from "express";
import { GetActiveOrderByTableService } from "../../services/order/GetActiveOrderByTableService";

export class GetActiveOrderByTableController {
  async handle(req: Request, res: Response) {
    const table = Number(req.query.table);

    const service = new GetActiveOrderByTableService();
    const order = await service.execute({ table });

    return res.status(200).json({ order });
  }
}
