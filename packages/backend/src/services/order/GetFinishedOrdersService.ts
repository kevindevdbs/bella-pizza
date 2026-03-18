import { prisma } from "../../lib/prisma";

interface IGetFinishedOrdersServiceProps {
  startDate?: string;
  endDate?: string;
}

export class GetFinishedOrdersService {
  async execute({ startDate, endDate }: IGetFinishedOrdersServiceProps) {
    try {
      const whereCondition: any = {
        draft: false,
        status: true,
      };

      if (startDate || endDate) {
        whereCondition.createdAt = {};

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          whereCondition.createdAt.gte = start;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          whereCondition.createdAt.lte = end;
        }
      }

      const result = await prisma.order.findMany({
        where: whereCondition,
        select: {
          id: true,
          name: true,
          draft: true,
          table: true,
          status: true,
          createdAt: true,
          items: {
            select: {
              id: true,
              amount: true,
              note: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true,
                  description: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possível listar os pedidos finalizados");
    }
  }
}
