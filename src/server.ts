import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config"
import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

export {app};
