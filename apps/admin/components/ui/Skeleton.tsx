import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
    />
  );
}

/** A full page loading skeleton that mirrors the PageHeader + content layout. */
export function PageSkeleton({
  rows = 5,
  variant = "table",
}: {
  rows?: number;
  variant?: "table" | "cards" | "form";
}) {
  return (
    <div className="animate-pulse">
      {/* PageHeader skeleton */}
      <div className="border-b border-gray-100 bg-white px-8 py-5">
        <Skeleton className="mb-2 h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="px-8 py-6">
        {variant === "table" && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {/* Filter bar */}
            <div className="flex gap-3 border-b border-gray-100 p-4">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-20" />
            </div>
            {/* Table rows */}
            <div className="divide-y divide-gray-100">
              {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        )}

        {variant === "cards" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5"
              >
                <Skeleton className="h-10 w-10 flex-shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {variant === "form" && (
          <div className="mx-auto max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-8">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
}
