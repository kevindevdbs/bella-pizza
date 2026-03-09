import { prisma } from "../../lib/prisma";
import { User } from "../../generated/prisma/client";
import { hash } from "bcryptjs";

class CreateUserService {
  async execute(user: User) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      throw new Error("Email já cadastrado.");
    }

    const passwordHash = await hash(user.password, 8);
    user.password = passwordHash;

    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return { createdUser };
  }
}

export { CreateUserService };
