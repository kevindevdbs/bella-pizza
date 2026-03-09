import {Request , Response, NextFunction} from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}

export function isAuthenticated(req: Request , res: Response , next: NextFunction) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    
    try {
        const [, token] = authToken.split(" ");
        const { sub } = verify(token!, process.env.JWT_SECRET!) as IPayload;

        req.user_id = sub;
        return next();

    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
}