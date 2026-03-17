import { prisma } from "../../lib/prisma";

interface GetActiveOrderByTableProps {
  table: number;
}

export class GetActiveOrderByTableService {
  async execute({ table }: GetActiveOrderByTableProps) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          table,
          status: false,
        },
        orderBy: [{ draft: "asc" }, { updatedAt: "desc" }],
        select: {
          id: true,
          table: true,
          name: true,
          draft: true,
          status: true,
          createdAt: true,
        },
      });

      if (!order) {
        throw new Error("Nenhum pedido em produção encontrado para esta mesa");
      }

      return order;
    } catch (error) {
      console.log(error);

      if (
        error instanceof Error &&
        error.message === "Nenhum pedido em produção encontrado para esta mesa"
      ) {
        throw error;
      }

      throw new Error("Não foi possivel buscar pedido ativo da mesa");
    }
  }
}
