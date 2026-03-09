import { compare } from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { sign } from "jsonwebtoken";

interface IAuthUserService {
  email: string;
  password: string;
}

export class AuthUserService {
  async execute({ email, password }: IAuthUserService) {
    //Busca um usuário com o email fornecido

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    //Se o usuário não existir, lança um erro indicando que o email ou senha são inválidos

    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    //Compara a senha fornecida com a senha armazenada no banco de dados usando bcryptjs

    const isPasswordValid = await compare(password, user.password);

    //Se a senha não for válida, lança um erro indicando que o email ou senha são inválidos

    if (!isPasswordValid) {
      throw new Error("Email ou senha inválidos");
    }

    //Gerar um token de autenticação usando JWT (JSON Web Token) para o usuário autenticado

    const token = sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "30d",
      },
    );
    //Retorna um objeto contendo as informações do usuário autenticado e o token de autenticação gerado

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }
}
