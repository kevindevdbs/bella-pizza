"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createCategoryAction } from "@/actions/category";
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
import { Spinner } from "@/components/ui/spinner";

export default function CategoryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createCategoryAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="self-start cursor-pointer">
          <Plus className="size-4" />
          Nova Categoria
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg border border-border bg-card text-card-foreground">
        <form action={formAction}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-3xl font-semibold cursor-pointer">
              Criar nova categoria
            </DialogTitle>
            <DialogDescription>
              Cadastre uma categoria para organizar os produtos da sua pizzaria.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 px-6 pt-2 pb-6">
            <Label htmlFor="name" className="text-foreground">
              Nome da categoria
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              minLength={2}
              placeholder="Ex: Pizza Calabresa"
              className="h-10 bg-background/70"
              required
            />

            {state?.error ? (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            ) : null}
          </div>

          <DialogFooter className="bg-transparent border-none">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
