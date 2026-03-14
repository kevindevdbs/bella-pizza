import Link from "next/link";
import { Home, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AccessDenied() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(from_var(--primary)_l_c_h/0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(from_var(--secondary)_l_c_h/0.08),transparent_60%)]" />

      <Card className="relative z-10 w-full max-w-xl border-border/80 bg-card/95 text-card-foreground shadow-2xl backdrop-blur">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/25">
            <Lock className="size-7" />
          </div>

          <CardTitle className="text-4xl font-semibold tracking-tight">
            Acesso negado
          </CardTitle>

          <CardDescription className="mx-auto max-w-md text-base text-muted-foreground">
            Sua conta nao tem permissao para acessar esta area administrativa.
            Se voce acredita que isso esta incorreto, entre em contato com o
            responsavel do sistema.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Perfil atual sem privilegios de administrador.
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" className="cursor-pointer">
              <Link href="/">
                <Home className="size-4" />
                Voltar para inicio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
