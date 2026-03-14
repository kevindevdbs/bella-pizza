"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarMenuItems } from "@/components/dashboard/sidebar-items";
import { useTransition } from "react";
import { logoutAction } from "@/actions/auth";

type SidebarMobileProps = {
  userName: string;
};

export function SidebarMobile({ userName }: SidebarMobileProps) {
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
    <header className="fixed top-0 right-0 left-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-foreground">
          Bella<span className="text-primary">Pizza</span>
        </span>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="Abrir menu">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-70 border-r-0 p-0"
            showCloseButton={false}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Menu do dashboard</SheetTitle>
            </SheetHeader>

            <div className="flex h-full flex-col bg-card text-card-foreground">
              <div className="border-b border-border px-4 py-6">
                <h2 className="text-3xl font-bold leading-none tracking-tight">
                  Bella<span className="text-primary">Pizza</span>
                </h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  Ola {userName}
                </p>
              </div>

              <nav className="flex-1 px-3 py-4">
                <ul className="space-y-2">
                  {sidebarMenuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const ItemIcon = item.icon;

                    return (
                      <li key={item.href}>
                        <SheetClose asChild>
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
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-t border-border p-3">
                <SheetClose asChild>
                  <button
                    type="button"
                    onClick={handleLogOut}
                    disabled={isPending}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <LogOut className="size-4" />
                    <span>Sair</span>
                  </button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
