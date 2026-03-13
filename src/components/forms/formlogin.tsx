"use client"

import { loginAction } from "@/actions/auth";
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
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Spinner } from "../ui/spinner";

export function FormLogin() {

  const [state , formAction , isPending] = useActionState(loginAction , null)
  const router = useRouter()

  useEffect(()=>{
    if(state?.success && state.redirectTo){
      router.replace(state.redirectTo)
    }
  },[state , router])

  return (
    <Card className="relative z-10 w-full max-w-md border border-white/10 bg-foreground/95 text-white shadow-2xl backdrop-blur">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-4xl font-semibold tracking-tight">
          <span className="text-white">Bella</span>
          <span className="text-primary">Pizza</span>
        </CardTitle>
        <CardDescription className="text-white/70">
          Preencha os dados para acessar sua conta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              className="h-10 border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha" className="text-white">
              Senha
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              minLength={6}
              className="h-10 border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-primary"
            />
          </div>

          <Button
            type="submit"
            className="h-10 w-full text-sm font-semibold"
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Acessar"}
          </Button>

          {state?.error ? (
            <p className="text-center text-sm  bg-accent-foreground text-red-500 rounded-full p-2">{state.error}</p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
