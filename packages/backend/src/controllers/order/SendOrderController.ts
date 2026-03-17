import {Request , Response} from "express"
import { SendOrderService } from "../../services/order/SendOrderService";

export class SendOrderController{
    async handle(req : Request , res: Response){

        const {name , order_id} = req.body;

        const sendOrderService = new SendOrderService()
        const orderUpdated = await sendOrderService.execute({name , order_id})

        res.status(200).json(orderUpdated)
    }
}