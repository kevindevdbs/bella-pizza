import { Request, Response } from "express";
import { GetFinishedOrdersService } from "../../services/order/GetFinishedOrdersService";

export class GetFinishedOrdersController {
  async handle(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    const getFinishedOrdersService = new GetFinishedOrdersService();
    const result = await getFinishedOrdersService.execute({
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
    });

    res.status(200).json(result);
  }
}
