import {Request , Response} from "express"
import { ListOrdersService } from "../../services/order/ListOrdersService";

export class ListOrdersController {
    async handle(req: Request , res: Response){

        const draftParam = req.query.draft ?? "true";

        const listOrdersServices = new ListOrdersService()
        const result = await listOrdersServices.execute({
            draft: draftParam === "true"
        })
        res.status(200).json(result)
    }
}