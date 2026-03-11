import { Router } from "express";
import uploadconfig from "./config/multer";
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
import multer from "multer";
import { CreateProductController } from "./controllers/product/CreateProductController";
import { createProductSchema } from "./schemas/productSchema";
import { ListProductController } from "./controllers/product/ListProductController";
import { DeleteProductController } from "./controllers/product/DeleteProductController";

const router = Router();
const upload = multer(uploadconfig);

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

//Rotas Produtos

router.post(
  "/product",
  isAuthenticated,
  isAdmin,
  upload.single("file"),
  validateSchema(createProductSchema),
  new CreateProductController().handle,
);

router.get("/products", isAuthenticated, new ListProductController().handle);
router.delete("/product", isAuthenticated, isAdmin , new DeleteProductController().handle);

export { router };
