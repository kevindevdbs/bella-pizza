import { FormLogin } from "@/components/forms/formlogin";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function Login() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(from_var(--primary)_l_c_h/0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(from_var(--secondary)_l_c_h/0.1),transparent_60%)]" />

      <div className="w-full max-w-md space-y-6">
        <Card className="border border-primary/20 bg-primary/5 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                Conta de Teste
              </span>
            </div>
            <p className="text-sm text-foreground">
              Disponibilizamos uma conta com acesso{" "}
              <span className="font-semibold">admin</span> para testar a
              aplicação:
            </p>
            <div className="space-y-2 rounded-lg bg-background/50 p-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email:</p>
                <p className="font-mono text-sm text-foreground">
                  teste@cozinha.com
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Senha:</p>
                <p className="font-mono text-sm text-foreground">123123</p>
              </div>
            </div>
          </div>
        </Card>

        <FormLogin />
        <div className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
