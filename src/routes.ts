import { Router } from "express";
import {CreateUserController } from "./controllers/user/CreateUserController";
import { validateSchema } from "./middlewares/validateSchema";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";

const router = Router();

router.get("/alive" , (req , res)=> {
    res.json({message: "Servidor Vivo !"})
})

router.post("/users" , validateSchema(createUserSchema),  new CreateUserController().handle)
router.get("/users" , isAuthenticated , new DetailUserController().handle)
router.post("/session" , validateSchema(authUserSchema),  new AuthUserController().handle)

export {router};    