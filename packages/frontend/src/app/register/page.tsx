import { FormRegister } from "@/components/forms/formregister";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";

export default async function Register() {
  const user = await getUser();

  if (user !== null) {
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

        <FormRegister />
      </div>
    </main>
  );
}
