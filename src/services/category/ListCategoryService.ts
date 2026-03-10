import { prisma } from "../../lib/prisma";

export class ListCategoryService {
  async execute() {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return categories;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao listar categorias");
    }
  }
}
