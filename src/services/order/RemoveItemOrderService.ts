import { prisma } from "../../lib/prisma";

interface RemoveItemOrderProps {
  item_id: string;
}

export class RemoveItemOrderService {
  async execute({ item_id }: RemoveItemOrderProps) {
    const itemExists = await prisma.item.findFirst({
      where: {
        id: item_id,
      },
    });

    if (!itemExists) {
      throw new Error("Item não encontrado");
    }

    try {
      await prisma.item.delete({
        where: {
          id: item_id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possivel deletar o item");
    }

    return "Item deletado com sucesso.";
  }
}
