import { Request, Response } from "express";
import { GetOrdersStatisticsService } from "../../services/order/GetOrdersStatisticsService";

export class GetOrdersStatisticsController {
  async handle(req: Request, res: Response) {
    const getOrdersStatisticsService = new GetOrdersStatisticsService();
    const result = await getOrdersStatisticsService.execute();

    res.status(200).json(result);
  }
}
