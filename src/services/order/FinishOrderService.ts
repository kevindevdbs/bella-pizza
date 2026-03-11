import { prisma } from "../../lib/prisma"

interface FinishOrderProps{

    order_id : string
}



export class FinishOrderService{
    async execute({order_id}: FinishOrderProps){

        const orderExists = await prisma.order.findFirst({
            where:{
                id: order_id
            }
        })

        if(!orderExists){
            throw new Error("Pedido não encontrado")
        }

        try {
            const orderUpdate = await prisma.order.update({
                where:{
                    id: order_id
                },
                data:{
                    status: true
                },
                select:{
                    id: true,
                    name: true,
                    draft: true,
                    table: true,
                    status: true,
                    items: true,
                    createdAt: true
                }
            })

            return orderUpdate
            
        } catch (error) {
            console.log(error)
            throw new Error("Não foi possível finalizar o pedido")
        }
    }
}