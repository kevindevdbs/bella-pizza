
import { prisma } from "../../lib/prisma";

interface ICreateCategoryProps {
  name: string;
}

export class CreateCategoryService {
  async execute({ name }: ICreateCategoryProps) {
    
    const categoryExists = await prisma.category.findFirst({
      where: {
        name,
      },
    });

    if (categoryExists) {
      throw new Error("Categoria já existe");
    }

    try {
      const category = await prisma.category.create({
        data: {
          name,
        },

        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });

      return category;
    } catch (error) {
      throw new Error("Erro ao criar categoria");
    }
  }
}
