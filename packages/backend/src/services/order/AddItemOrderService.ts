import { prisma } from "../../lib/prisma";
import { OrderRealtimePublisher } from "./OrderRealtimePublisher";

interface ItemProps {
  order_id: string;
  product_id: string;
  amount: number;
  note?: string;
}

export class AddItemOrderService {
  async execute({ order_id, product_id, amount, note }: ItemProps) {
    const OrderExists = await prisma.order.findFirst({
      where: {
        id: order_id,
      },
    });

    if (!OrderExists) {
      throw new Error("Order não encontrada");
    }

    const ProductExists = await prisma.product.findFirst({
      where: {
        id: product_id,
        disabled: false,
      },
    });

    if (!ProductExists) {
      throw new Error("Produto não encontrado");
    }

    try {
      const item = await prisma.item.create({
        data: {
          amount,
          note,
          orderId: order_id,
          productId: product_id,
        },
        select: {
          id: true,
          orderId: true,
          productId: true,
          amount: true,
          note: true,
          createdAt: true,
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

      OrderRealtimePublisher.emitItemAdded({
        orderId: item.orderId,
        table: OrderExists.table,
        itemId: item.id,
        draft: OrderExists.draft,
        status: OrderExists.status,
      });

      return item;
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possivel adicionar o item");
    }
  }
}
