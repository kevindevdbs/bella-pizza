import { prisma } from "../../lib/prisma";

interface IListProductsByCategoryServiceProps {
  category_id: string;
}

export class ListProductsByCategoryService {
  async execute({ category_id }: IListProductsByCategoryServiceProps) {
    const categoryExists = await prisma.category.findFirst({
      where: {
        id: category_id,
      },
    });

    if (!categoryExists) {
      throw new Error("Categoria não encontrada");
    }

    try {
      const result = await prisma.product.findMany({
        where: {
          categoryId: category_id,
        },
        select:{
            id: true,
            name: true,
            price: true,
            description: true,
            categoryId: true,
            imageUrl: true,
            createdAt: true,
            disabled: true,
            category:{
                select:{
                    id: true,
                    name: true
                    
                }
            }
        }
      });

      return result;

    } catch (error) {
        console.log(error)
        throw new Error("Não foi possivel buscar os produtos")
    }
  }
}
