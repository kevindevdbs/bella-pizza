import { prisma } from "../../lib/prisma";

interface ICreateOrderServiceProps {
  name?: string;
  table: number;
}

export class CreateOrderService {
  async execute({name , table}: ICreateOrderServiceProps) {

    try {

        const result = await prisma.order.create({
            data:{
                table,
                name
            },
            select:{
                id: true,
                name: true,
                table: true,
                items: true,
                status: true,
                draft: true,
                createdAt: true
            }
        })

        return result;
        
    } catch (error) {
        console.log(error);
        throw new Error("Erro ao criar Order")
    }
  }
}
