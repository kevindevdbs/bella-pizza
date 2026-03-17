import ProductForm from "@/components/dashboard/product-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category, Product } from "@/lib/types";
import { deleteProductAction } from "@/actions/product";
import { Trash2 } from "lucide-react";

type NormalizedProduct = {
  id: string;
  name: string;
  priceLabel: string;
  description: string;
  imageUrl: string;
  categoryName: string;
};

function formatPrice(value: number | string) {
  const numeric =
    typeof value === "number"
      ? value / 100
      : Number(String(value).replace(",", ".")) / 100;
  if (!Number.isFinite(numeric)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numeric);
}

function normalizeProducts(products: Product[]) {
  return products.map<NormalizedProduct>((product) => ({
    id: product.id,
    name: product.name,
    priceLabel: formatPrice(product.price),
    description: product.description,
    imageUrl: product.imageUrl,
    categoryName: product.category?.name ?? "Sem categoria",
  }));
}

async function getProducts(token: string) {
  try {
    return await apiClient<Product[]>("products", { token, cache: "no-store" });
  } catch {
    try {
      return await apiClient<Product[]>("product", {
        token,
        cache: "no-store",
      });
    } catch {
      return [];
    }
  }
}

export default async function Products() {
  const token = await getToken();

  if (!token) {
    return null;
  }

  const [productsRaw, categories] = await Promise.all([
    getProducts(token),
    apiClient<Category[]>("category", { token, cache: "no-store" }),
  ]);

  const products = normalizeProducts(productsRaw);

  return (
    <section className="min-h-[calc(100vh-4rem)] rounded-2xl bg-background p-4 text-foreground md:min-h-screen md:p-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie o cardapio da Pizzaria Forno D'Italia
          </p>
        </div>

        <ProductForm categories={categories} />
      </header>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">Imagem</TableHead>
              <TableHead className="px-2">Nome</TableHead>
              <TableHead className="px-2">Preco</TableHead>
              <TableHead className="px-2">Categoria</TableHead>
              <TableHead className="px-2">Descricao</TableHead>
              <TableHead className="px-4 text-right">Acoes</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/20">
                  <TableCell className="px-4">
                    <div className="size-10 overflow-hidden rounded-md border border-border bg-muted/30">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-2 font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell className="px-2 text-primary">
                    {product.priceLabel}
                  </TableCell>
                  <TableCell className="px-2">
                    <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                      {product.categoryName}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-56 px-2 text-muted-foreground">
                    <p className="truncate">{product.description}</p>
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <form action={deleteProductAction} className="inline-flex">
                      <input
                        type="hidden"
                        name="product_id"
                        value={product.id}
                      />
                      <Button
                        type="submit"
                        variant="destructive"
                        size="sm"
                        className="cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                        Excluir
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Nenhum produto cadastrado no momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
