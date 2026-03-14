"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/actions/auth";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

export function FormRegister() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.redirectTo) router.replace(state.redirectTo);
  }, [state, router]);

  return (
    <Card className="relative z-10 w-full max-w-md border-border/80 bg-card/95 text-card-foreground shadow-2xl backdrop-blur">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-4xl font-semibold tracking-tight">
          <span className="text-foreground">Bella</span>
          <span className="text-primary">Pizza</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Preencha os dados para criar sua conta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nome
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Seu nome completo..."
              className="h-10 border-input bg-background/60 text-foreground placeholder:text-muted-foreground focus-visible:border-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Seu email completo..."
              className="h-10 border-input bg-background/60 text-foreground placeholder:text-muted-foreground focus-visible:border-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Senha
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={6}
              placeholder="••••••••"
              className="h-10 border-input bg-background/60 text-foreground placeholder:text-muted-foreground focus-visible:border-ring"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="h-10 w-full text-sm font-semibold"
          >
            {isPending ? <Spinner /> : "Criar Conta"}
          </Button>

          {state?.error ? (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-2 text-center text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Faça login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
