import React from "react";
import { requiredAdmin } from "@/lib/auth";
import SideBar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requiredAdmin();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SideBar userName={user.name} />
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
