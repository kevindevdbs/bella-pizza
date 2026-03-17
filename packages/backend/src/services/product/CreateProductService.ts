import { Readable } from "node:stream";
import cloudinary from "../../config/cloudinary";
import { prisma } from "../../lib/prisma";

interface ICreateProductProps {
  name: string;
  price: string;
  description: string;
  category_id: string;
  imageBuffer: Buffer;
  imageName: string;
}

export class CreateProductService {
  async execute({
    name,
    price,
    description,
    category_id,
    imageBuffer,
    imageName,
  }: ICreateProductProps) {
    const categoryExists = await prisma.category.findFirst({
      where: {
        id: category_id,
      },
    });

    if (!categoryExists) {
      throw new Error("Categoria não encontrada");
    }

    let bannerUrl = "";

    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: "image",
            public_id: `${Date.now()} - ${imageName.split(".")[0]}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        const bufferStream = Readable.from(imageBuffer);
        bufferStream.pipe(uploadStream);

      });

      bannerUrl = result.secure_url  

    } catch (error) {
      console.log(error);
      throw new Error("Erro ao fazer o upload da imagem");
    }

    const productExists = await prisma.product.findFirst({
        where: {
            name: name
        }
    })

    if(productExists){
        throw new Error("Já existe um produto com o mesmo nome")
    }




    const product = await prisma.product.create({
        data:{
            name: name,
            price: parseInt(price),
            description: description,
            imageUrl: bannerUrl,
            categoryId: category_id
        },
        select: {
            id: true,
            name: true,
            price: true,
            description: true,
            categoryId: true,
            imageUrl: true,
            createdAt: true

        }
    })

    return product;
  }
}
