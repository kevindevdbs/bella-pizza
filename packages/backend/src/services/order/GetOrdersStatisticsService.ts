import { prisma } from "../../lib/prisma";

interface IOrderStatistics {
  count: number;
  total: number;
}

interface IOrdersStatisticsResponse {
  daily: IOrderStatistics;
  monthly: IOrderStatistics;
  yearly: IOrderStatistics;
}

export class GetOrdersStatisticsService {
  async execute(): Promise<IOrdersStatisticsResponse> {
    try {
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const todayEnd = new Date(todayStart);
      todayEnd.setHours(23, 59, 59, 999);

      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearEnd = new Date(now.getFullYear(), 11, 31);
      yearEnd.setHours(23, 59, 59, 999);

      const dailyOrders = await prisma.order.findMany({
        where: {
          draft: false,
          status: true,
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        select: {
          id: true,
          items: {
            select: {
              amount: true,
              product: {
                select: {
                  price: true,
                },
              },
            },
          },
        },
      });

      const monthlyOrders = await prisma.order.findMany({
        where: {
          draft: false,
          status: true,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        select: {
          id: true,
          items: {
            select: {
              amount: true,
              product: {
                select: {
                  price: true,
                },
              },
            },
          },
        },
      });

      const yearlyOrders = await prisma.order.findMany({
        where: {
          draft: false,
          status: true,
          createdAt: {
            gte: yearStart,
            lte: yearEnd,
          },
        },
        select: {
          id: true,
          items: {
            select: {
              amount: true,
              product: {
                select: {
                  price: true,
                },
              },
            },
          },
        },
      });

      const calculateTotal = (
        orders: Array<{
          id: string;
          items: Array<{
            amount: number;
            product: { price: number };
          }>;
        }>,
      ): number => {
        return orders.reduce((sum, order) => {
          const orderTotal = order.items.reduce((itemSum, item) => {
            return itemSum + item.product.price * item.amount;
          }, 0);
          return sum + orderTotal;
        }, 0);
      };

      return {
        daily: {
          count: dailyOrders.length,
          total: calculateTotal(dailyOrders),
        },
        monthly: {
          count: monthlyOrders.length,
          total: calculateTotal(monthlyOrders),
        },
        yearly: {
          count: yearlyOrders.length,
          total: calculateTotal(yearlyOrders),
        },
      };
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possível calcular as estatísticas de pedidos");
    }
  }
}
