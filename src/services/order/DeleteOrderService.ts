import { prisma } from "../../lib/prisma";
import { OrderRealtimePublisher } from "./OrderRealtimePublisher";

interface DeleteOrderProps {
  order_id: string;
}

interface DeleteOrderResult {
  message: string;
  table: number;
}

export class DeleteOrderService {
  async execute({ order_id }: DeleteOrderProps) {
    const orderExists = await prisma.order.findFirst({
      where: {
        id: order_id,
      },
      select: {
        id: true,
        table: true,
        draft: true,
        status: true,
      },
    });

    if (!orderExists) {
      throw new Error("Pedido não encontrado");
    }

    if (orderExists.draft) {
      throw new Error("Só é possível cancelar pedidos enviados para a cozinha");
    }

    if (orderExists.status) {
      throw new Error("Pedido já finalizado. Não é possível cancelar");
    }

    try {
      await prisma.order.delete({
        where: {
          id: order_id,
        },
      });

      OrderRealtimePublisher.emitDeleted({
        orderId: orderExists.id,
        table: orderExists.table,
        draft: orderExists.draft,
        status: orderExists.status,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possivel deletar o pedido");
    }

    const result: DeleteOrderResult = {
      message: `Pedido da mesa ${orderExists.table} cancelado com sucesso.`,
      table: orderExists.table,
    };

    return result;
  }
}
