import { prisma } from "../../lib/prisma";
import { OrderRealtimePublisher } from "./OrderRealtimePublisher";

interface RemoveItemOrderProps {
  item_id: string;
}

export class RemoveItemOrderService {
  async execute({ item_id }: RemoveItemOrderProps) {
    const itemExists = await prisma.item.findFirst({
      where: {
        id: item_id,
      },
      select: {
        id: true,
        orderId: true,
        order: {
          select: {
            table: true,
            draft: true,
            status: true,
          },
        },
      },
    });

    if (!itemExists) {
      throw new Error("Item não encontrado");
    }

    try {
      await prisma.item.delete({
        where: {
          id: item_id,
        },
      });

      OrderRealtimePublisher.emitItemRemoved({
        orderId: itemExists.orderId,
        table: itemExists.order.table,
        itemId: itemExists.id,
        draft: itemExists.order.draft,
        status: itemExists.order.status,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possivel deletar o item");
    }

    return "Item deletado com sucesso.";
  }
}
