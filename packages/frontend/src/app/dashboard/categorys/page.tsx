import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category } from "@/lib/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CategoryForm from "@/components/dashboard/category-from";

export default async function Categorys() {
  const token = await getToken();
  const categories = await apiClient<Category[]>("category", {
    token: token!,
    cache: "no-store",
  });

  return (
    <section className="min-h-[calc(100vh-4rem)] rounded-2xl bg-background p-4 text-foreground md:min-h-screen md:p-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-sm text-muted-foreground">
            Organize os produtos em categorias
          </p>
        </div>

        <CategoryForm />
      </header>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="gap-0 border border-border py-0 ring-0"
            >
              <CardHeader className="px-5 py-4">
                <CardTitle className="text-3xl font-semibold leading-tight">
                  {category.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  ID: {category.id}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-dashed border-border bg-card py-0 ring-0">
          <CardHeader className="px-5 py-8 text-center">
            <CardTitle className="text-lg font-semibold">
              Nenhuma categoria cadastrada
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Crie sua primeira categoria para organizar os produtos da Pizzaria
              Bella Pizza.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </section>
  );
}
