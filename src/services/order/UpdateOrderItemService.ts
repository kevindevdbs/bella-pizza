import { prisma } from "../../lib/prisma";
import { OrderRealtimePublisher } from "./OrderRealtimePublisher";

interface UpdateOrderItemServiceProps {
  item_id: string;
  amount?: number;
  note?: string;
}

export class UpdateOrderItemService {
  async execute({ item_id, amount, note }: UpdateOrderItemServiceProps) {
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

    if (itemExists.order.status) {
      throw new Error("Pedido já finalizado. Não é possível alterar o item");
    }

    try {
      const updatedItem = await prisma.item.update({
        where: {
          id: item_id,
        },
        data: {
          amount,
          note,
        },
        select: {
          id: true,
          amount: true,
          note: true,
          orderId: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
              imageUrl: true,
            },
          },
        },
      });

      OrderRealtimePublisher.emitItemUpdated({
        orderId: updatedItem.orderId,
        table: itemExists.order.table,
        itemId: updatedItem.id,
        draft: itemExists.order.draft,
        status: itemExists.order.status,
      });

      return updatedItem;
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possível atualizar o item");
    }
  }
}
