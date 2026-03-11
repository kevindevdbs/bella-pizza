import { prisma } from "../../lib/prisma";

interface IListProductProps {
  disabled: boolean;
}

export class ListProductService {
  async execute({ disabled }: IListProductProps) {
    try {
      const products = await prisma.product.findMany({
        where: {
          disabled,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          imageUrl: true,
          disabled: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return products;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao listar produtos");
    }
  }
}
