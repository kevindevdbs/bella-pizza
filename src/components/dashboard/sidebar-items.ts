import { Box, ShoppingCart, Tag } from "lucide-react";

export const sidebarMenuItems = [
  {
    href: "/dashboard",
    label: "Pedidos",
    icon: ShoppingCart,
  },
  {
    href: "/dashboard/products",
    label: "Produtos",
    icon: Box,
  },
  {
    href: "/dashboard/categorys",
    label: "Categorias",
    icon: Tag,
  },
];
