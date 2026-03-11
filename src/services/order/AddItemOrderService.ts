import { prisma } from "../../lib/prisma";

interface ItemProps {
  order_id: string;
  product_id: string;
  amount: number;
}

export class AddItemOrderService {
  async execute({ order_id, product_id, amount }: ItemProps) {
    const OrderExists = await prisma.order.findFirst({
      where: {
        id: order_id,
      },
    });

    if (!OrderExists) {
      throw new Error("Order não encontrada");
    }

    const ProductExists = await prisma.product.findFirst({
      where: {
        id: product_id,
        disabled: false,
      },
    });

    if (!ProductExists) {
      throw new Error("Produto não encontrado");
    }

    try {
        const item = await prisma.item.create({
            data:{
                amount,
                orderId : order_id,
                productId: product_id
            },
            select:{
                id: true,
                orderId: true,
                productId: true,
                amount: true,
                createdAt: true,
                product:{
                    select:{
                        id:true,
                        name: true,
                        price: true,
                        description: true,
                        imageUrl: true,
                    }
                }
            }
        })

        return item;
    } catch (error) {
      console.log(error);
      throw new Error("Não foi possivel adicionar o item");
    }
  }
}
