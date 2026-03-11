import { prisma } from "../../lib/prisma";

interface DetailOrderProps {
  order_id: string;
}

export class DetailOrderService {
  async execute({ order_id }: DetailOrderProps) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: order_id,
        },
        select: {
          id: true,
          name: true,
          table: true,
          status: true,
          draft: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              id: true,
              amount: true,
              createdAt: true,
              updatedAt: true,
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
          },
        },
      });

      if (!order) {
        throw new Error("Order não encontrada");
      }

      return order;
    } catch (error) {
      console.log(error);

      if (error instanceof Error && error.message === "Order não encontrada") {
        throw error;
      }

      throw new Error("Não foi possivel buscar os detalhes do pedido");
    }
  }
}
