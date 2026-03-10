import {Request , Response , NextFunction } from "express";
import { prisma } from "../lib/prisma";

export async function isAdmin(req: Request, res: Response, next: NextFunction) : Promise<void> {
    const userId = req.user_id;

    if (!userId) {
         res.status(401).json({ message: "Usuário não autenticado" });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
         res.status(404).json({ message: "Usuário sem Permissão" });
    }

    if (user?.role !== "ADMIN") {
         res.status(403).json({ message: "Usuário sem Permissão" });
    }

     next();
}