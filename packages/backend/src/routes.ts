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
import {
  createProductSchema,
  listProductsByCategorySchema,
  listProductSchema,
} from "./schemas/productSchema";
import { ListProductController } from "./controllers/product/ListProductController";
import { DeleteProductController } from "./controllers/product/DeleteProductController";
import { ListProductsByCategoryController } from "./controllers/product/ListProductsByCategoryController";
import {
  addItemOrderSchema,
  activeOrderByTableSchema,
  createOrderSchema,
  deleteOrderSchema,
  detailOrderSchema,
  finishOrderSchema,
  listOrdersSchema,
  removeItemOrderSchema,
  sendOrderSchema,
  updateOrderItemSchema,
} from "./schemas/orderSchema";
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import { ListOrdersController } from "./controllers/order/ListOrdersController";
import { AddItemOrderController } from "./controllers/order/AddItemOrderController";
import { RemoveItemOrderController } from "./controllers/order/RemoveItemOrderController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";
import { DeleteOrderController } from "./controllers/order/DeleteOrderController";
import { GetActiveOrderByTableController } from "./controllers/order/GetActiveOrderByTableController";
import { UpdateOrderItemController } from "./controllers/order/UpdateOrderItemController";
import { GetFinishedOrdersController } from "./controllers/order/GetFinishedOrdersController";
import { GetOrdersStatisticsController } from "./controllers/order/GetOrdersStatisticsController";

const router = Router();
const upload = multer(uploadconfig);

router.get("/alive", (_req, res) => {
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

router.get(
  "/products",
  isAuthenticated,
  validateSchema(listProductSchema),
  new ListProductController().handle,
);
router.get(
  "/category/products",
  isAuthenticated,
  validateSchema(listProductsByCategorySchema),
  new ListProductsByCategoryController().handle,
);
router.delete(
  "/product",
  isAuthenticated,
  isAdmin,
  new DeleteProductController().handle,
);

//Rotas Pedidos

router.post(
  "/order",
  isAuthenticated,
  validateSchema(createOrderSchema),
  new CreateOrderController().handle,
);
router.delete(
  "/order",
  isAuthenticated,
  isAdmin,
  validateSchema(deleteOrderSchema),
  new DeleteOrderController().handle,
);
router.get(
  "/orders",
  isAuthenticated,
  isAdmin,
  validateSchema(listOrdersSchema),
  new ListOrdersController().handle,
);
router.get(
  "/orders/finished",
  isAuthenticated,
  isAdmin,
  new GetFinishedOrdersController().handle,
);
router.get(
  "/orders/statistics",
  isAuthenticated,
  isAdmin,
  new GetOrdersStatisticsController().handle,
);
router.get(
  "/order/detail",
  isAuthenticated,
  validateSchema(detailOrderSchema),
  new DetailOrderController().handle,
);
router.get(
  "/order/active-by-table",
  isAuthenticated,
  validateSchema(activeOrderByTableSchema),
  new GetActiveOrderByTableController().handle,
);

router.post(
  "/order/add",
  isAuthenticated,
  validateSchema(addItemOrderSchema),
  new AddItemOrderController().handle,
);

router.delete(
  "/order/remove",
  isAuthenticated,
  validateSchema(removeItemOrderSchema),
  new RemoveItemOrderController().handle,
);
router.put(
  "/order/item",
  isAuthenticated,
  validateSchema(updateOrderItemSchema),
  new UpdateOrderItemController().handle,
);

router.put(
  "/order/send",
  isAuthenticated,
  validateSchema(sendOrderSchema),
  new SendOrderController().handle,
);
router.put(
  "/order/finish",
  isAuthenticated,
  validateSchema(finishOrderSchema),
  new FinishOrderController().handle,
);

export { router };
