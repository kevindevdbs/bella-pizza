import { FormLogin } from "@/components/forms/formlogin";

export default function Login() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(from_var(--primary)_l_c_h/0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(from_var(--secondary)_l_c_h/0.1),transparent_60%)]" />

      <FormLogin />
    </main>
  );
}
