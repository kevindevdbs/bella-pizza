"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarMenuItems } from "@/components/dashboard/sidebar-items";
import { logoutAction } from "@/actions/auth";
import { useTransition } from "react";

type SidebarDesktopProps = {
  userName: string;
};

export function SidebarDesktop({ userName }: SidebarDesktopProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogOut() {
    startTransition(async () => {
      await logoutAction();
      router.replace("/login");
      router.refresh();
    });
  }

  return (
    <aside className="hidden h-screen w-70 shrink-0 md:block">
      <div className="flex h-full flex-col bg-card text-card-foreground">
        <div className="border-b border-border px-4 py-6">
          <h2 className="text-3xl font-bold leading-none tracking-tight">
            <span className="text-secondary">Bella</span>
            <span className="text-primary">Pizza</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">Ola {userName}</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-2">
            {sidebarMenuItems.map((item) => {
              const isActive = pathname === item.href;
              const ItemIcon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <ItemIcon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={handleLogOut}
            disabled={isPending}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
