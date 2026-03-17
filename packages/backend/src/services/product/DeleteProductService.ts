import { prisma } from "../../lib/prisma";

interface IDeleteProductProps{
    product_id : string
}

export class DeleteProductService {
  async execute({product_id}: IDeleteProductProps) {

    const productExists = await prisma.product.findFirst({
      where: {
        id: product_id,
        disabled: false
      },
    });

    if (!productExists) {
      throw new Error("Produto não encontrado");

    }
    try {
      await prisma.product.update({
        where: {
          id: product_id,
        },
        data: {
          disabled: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possivel deletar o produto");
    }

    return "Produto deletado com sucesso."
  }
}
