import { prisma } from "../../lib/prisma";

interface DeleteOrderProps {
  order_id: string;
}

export class DeleteOrderService {
  async execute({ order_id }: DeleteOrderProps) {
    const orderExists = await prisma.order.findFirst({
      where: {
        id: order_id,
      },
    });

    if (!orderExists) {
      throw new Error("Pedido não encontrado");
    }

    try {
      await prisma.order.delete({
        where: {
          id: order_id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possivel deletar o pedido");
    }

    return "Pedido deletado com sucesso.";
  }
}
