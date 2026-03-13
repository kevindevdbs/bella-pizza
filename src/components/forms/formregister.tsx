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
  const router = useRouter()

  useEffect(()=>{
    if(state?.success && state.redirectTo)
        router.replace(state.redirectTo)
  },[state , router])

  return (
    <Card className="relative z-10 w-full max-w-md border border-white/10 bg-foreground/95 text-white shadow-2xl backdrop-blur">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-4xl font-semibold tracking-tight">
          <span className="text-white">Bella</span>
          <span className="text-primary">Pizza</span>
        </CardTitle>
        <CardDescription className="text-white/70">
          Preencha os dados para criar sua conta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nome
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Seu nome completo..."
              className="h-10 border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Seu email completo..."
              className="h-10 border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Senha
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={6}
              placeholder="••••••••"
              className="h-10 border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-primary"
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
            <p className="text-center text-sm  bg-accent-foreground text-red-500 rounded-full p-2">
              {state.error}
            </p>
          ) : null}

          <p className="text-center text-sm text-white/75">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-white hover:text-primary"
            >
              Faça login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
