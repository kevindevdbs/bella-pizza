import { prisma } from "../../lib/prisma";
import { OrderRealtimePublisher } from "./OrderRealtimePublisher";

interface ICreateOrderServiceProps {
  name?: string;
  table: number;
}

export class CreateOrderService {
  async execute({ name, table }: ICreateOrderServiceProps) {
    try {
      const { removedOrderIds, createdOrder } = await prisma.$transaction(
        async (tx) => {
          await tx.$executeRaw`SELECT pg_advisory_xact_lock(${table})`;

          const openedDrafts = await tx.order.findMany({
            where: {
              table,
              draft: true,
            },
            select: {
              id: true,
              draft: true,
              status: true,
            },
          });

          const removedIds = openedDrafts.map((order) => order.id);

          if (removedIds.length > 0) {
            await tx.order.deleteMany({
              where: {
                id: {
                  in: removedIds,
                },
                draft: true,
              },
            });
          }

          const newOrder = await tx.order.create({
            data: {
              table,
              name,
            },
            select: {
              id: true,
              name: true,
              table: true,
              items: true,
              status: true,
              draft: true,
              createdAt: true,
            },
          });

          return {
            removedOrderIds: removedIds,
            createdOrder: newOrder,
          };
        },
      );

      for (const removedOrder of removedOrderIds) {
        OrderRealtimePublisher.emitDeleted({
          orderId: removedOrder,
          table,
          draft: true,
          status: false,
        });
      }

      OrderRealtimePublisher.emitCreated(createdOrder);

      return createdOrder;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao criar Order");
    }
  }
}
