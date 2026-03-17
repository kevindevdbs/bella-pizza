import { Skeleton } from "@/components/ui/skeleton";

export function AuthPageSkeleton() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(from_var(--primary)_l_c_h/0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(from_var(--secondary)_l_c_h/0.1),transparent_60%)]" />

      <section className="relative z-10 w-full max-w-md rounded-xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-10 w-56" />
          <Skeleton className="mx-auto h-4 w-64" />
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <Skeleton className="h-10 w-full rounded-lg bg-primary/40" />
        </div>
      </section>
    </main>
  );
}

function DashboardSidebarSkeleton() {
  return (
    <>
      <aside className="hidden h-screen w-70 shrink-0 border-r border-border bg-card md:block">
        <div className="space-y-5 p-4">
          <div className="space-y-3 border-b border-border pb-5">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </aside>

      <header className="fixed top-0 right-0 left-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </header>
    </>
  );
}

export function DashboardOverviewSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] space-y-6 rounded-2xl bg-background p-4 text-foreground md:min-h-screen md:p-6">
      <header className="space-y-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-72" />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card p-4"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 xl:col-span-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="mt-4 h-56 w-full" />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <Skeleton className="h-4 w-24" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardCategoriesSkeleton() {
  return (
    <section className="min-h-[calc(100vh-4rem)] rounded-2xl bg-background p-4 text-foreground md:min-h-screen md:p-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Skeleton className="h-10 w-40 rounded-lg bg-primary/40" />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card p-5"
          >
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="mt-2 h-3 w-16" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function DashboardProductsSkeleton() {
  return (
    <section className="min-h-[calc(100vh-4rem)] rounded-2xl bg-background p-4 text-foreground md:min-h-screen md:p-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Skeleton className="h-10 w-44 rounded-lg bg-primary/40" />
      </header>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="hidden grid-cols-[72px_1fr_140px_160px_1fr_132px] gap-2 border-b border-border bg-muted/30 px-4 py-3 lg:grid">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="ml-auto h-4 w-14" />
        </div>

        <div className="space-y-2 p-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-3 rounded-lg border border-border/80 p-3 lg:grid-cols-[56px_1fr_130px_160px_1fr_120px] lg:items-center"
            >
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-24 rounded-md bg-primary/40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebarSkeleton />
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <div className="p-4 md:p-6">
          <DashboardOverviewSkeleton />
        </div>
      </main>
    </div>
  );
}

export function AccessDeniedSkeleton() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(from_var(--primary)_l_c_h/0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(from_var(--secondary)_l_c_h/0.08),transparent_60%)]" />

      <section className="relative z-10 w-full max-w-xl rounded-xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto size-14 rounded-full" />
          <Skeleton className="mx-auto h-10 w-64" />
          <Skeleton className="mx-auto h-4 w-full max-w-lg" />
          <Skeleton className="mx-auto h-4 w-full max-w-lg" />
        </div>

        <div className="mt-5 space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </section>
    </main>
  );
}
