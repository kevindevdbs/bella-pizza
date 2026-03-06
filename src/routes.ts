import { Router } from "express";

const router = Router();

router.get("/alive" , (req , res)=> {
    res.json({message: "Servidor Vivo !"})
})

export {router};