import { Skeleton } from "@/components/ui/skeleton";

type OrderSkeletonProps = {
  count?: number;
};

export default function OrderSkeleton({ count = 6 }: OrderSkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((_, index) => (
        <div
          key={`order-skeleton-${index}`}
          className="rounded-xl border border-border bg-card/95 p-4"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>

          <div className="mt-4 space-y-2 rounded-lg border border-border/70 bg-muted/25 p-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-7 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
