import { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { validateSchema } from "./middlewares/validateSchema";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCategoryController";
import { createCategorySchema } from "./schemas/categorySchema";
import { isAdmin } from "./middlewares/isAdmin";

const router = Router();

router.get("/alive", (req, res) => {
  res.json({ message: "Servidor Vivo !" });
});

//Rotas Usuario

router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle,
);
router.get("/me", isAuthenticated, new DetailUserController().handle);

//Rotas Login
router.post(
  "/session",
  validateSchema(authUserSchema),
  new AuthUserController().handle,
);

//Rotas Categoria
router.post(
  "/category",
  isAuthenticated,
  isAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle,
);

router.get("/category", isAuthenticated, new ListCategoryController().handle);

export { router };
