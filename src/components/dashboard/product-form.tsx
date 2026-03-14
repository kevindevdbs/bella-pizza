"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUp, Plus } from "lucide-react";
import Image from "next/image";
import { createProductAction } from "@/actions/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

type ProductCategory = {
  id: string;
  name: string;
};

type ProductFormProps = {
  categories: ProductCategory[];
};

export default function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createProductAction,
    null,
  );
  const [categoryId, setCategoryId] = useState("");
  const [fileName, setFileName] = useState("");
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      setCategoryId("");
      setFileName("");
      setPreview(null);
      setValue("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.refresh();
    }
  }, [state, router]);

  const hasCategories = useMemo(() => categories.length > 0, [categories]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const removeString = e.target.value.replace(/\D/g, "");

    const cents = removeString ? parseInt(removeString, 10) : 0;

    const formatted = (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setValue(formatted);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="self-start cursor-pointer">
          <Plus className="size-4" />
          Novo Produto
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl border border-border bg-card text-card-foreground">
        <form action={formAction} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-3xl font-semibold">
              Novo Produto
            </DialogTitle>
            <DialogDescription>
              Cadastre um novo item para o cardapio da Pizzaria Forno D'Italia.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do produto</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ex: Pizza Calabresa"
                className="h-10 bg-background/70"
                minLength={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preco</Label>
              <Input
                id="price"
                name="price"
                value={value}
                onChange={handleChange}
                type="text"
                placeholder="R$ 0,00"
                className="h-10 bg-background/70"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Categoria</Label>
            <input type="hidden" name="category_id" value={categoryId} />
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={!hasCategories}
            >
              <SelectTrigger
                id="category_id"
                className="h-10 w-full bg-background/70"
              >
                <SelectValue
                  placeholder={
                    hasCategories
                      ? "Selecione uma categoria"
                      : "Nenhuma categoria cadastrada"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descricao</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva o produto..."
              className="min-h-24 bg-background/70"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Imagem do produto</Label>
            {preview ? (
              <div className="space-y-3">
                <div className="relative h-32 w-32 overflow-hidden rounded-md border border-border">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPreview(null);
                    setFileName("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remover imagem
                </Button>
              </div>
            ) : (
              <label
                htmlFor="file"
                className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background/40 px-4 py-4 text-center hover:bg-muted/40"
              >
                <ImageUp className="size-5 text-muted-foreground" />
                <span className="mt-2 text-sm text-muted-foreground">
                  Clique para selecionar uma imagem
                </span>
              </label>
            )}
            <input
              ref={fileInputRef}
              id="file"
              name="file"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const currentFile = event.target.files?.[0];
                setFileName(currentFile?.name ?? "");
                if (currentFile) {
                  const reader = new FileReader();
                  reader.onload = (e) => setPreview(e.target?.result as string);
                  reader.readAsDataURL(currentFile);
                } else {
                  setPreview(null);
                }
              }}
              required
            />
          </div>

          {state?.error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          <DialogFooter className="-mx-4 -mb-4 border-t border-border bg-muted/30 p-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending || !hasCategories || !categoryId}
            >
              {isPending ? <Spinner /> : "Criar produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
