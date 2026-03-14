import { prisma } from "../../lib/prisma"

interface IListOrdersServiceProps{
    draft?: boolean
}

export class ListOrdersService{
    async execute({draft}: IListOrdersServiceProps){

        try {
            const result =  await prisma.order.findMany({
                where: {
                    draft: draft
                },
                select:{
                    id: true,
                    name: true,
                    draft: true,
                    table: true, 
                    status: true,
                    createdAt: true,
                    items: {
                        select:{
                            id:true,
                            amount: true,
                            product : {
                                select:{
                                    id: true, 
                                    name: true,
                                    price: true,
                                    imageUrl: true,
                                    description: true

                                }
                            }
                        }
                    }
                }
            })

            return result;
            
        } catch (error) {
            console.log(error)
            throw new Error("Não foi possivel listar todos os pedidos")
        }
    }
}