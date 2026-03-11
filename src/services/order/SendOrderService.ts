import { prisma } from "../../lib/prisma"

interface SendOrderProps{

    name: string,
    order_id : string
}

export class SendOrderService{
    async execute({name , order_id}: SendOrderProps){
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
                    draft: false,
                    name: name
                },
                select:{
                    id: true,
                    name: true,
                    table: true,
                    draft: true,
                    status: true,
                    createdAt: true
                }
            })

            return orderUpdate

        } catch (error) {
            console.log(error)
            throw new Error("Não foi possivel enviar o pedido")
        }
    }
}