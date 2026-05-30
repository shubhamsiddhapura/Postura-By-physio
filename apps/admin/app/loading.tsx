import { Skeleton } from "@/components/ui/Skeleton";

/** Dashboard loading skeleton */
export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* PageHeader */}
      <div className="border-b border-gray-100 bg-white px-8 py-5">
        <Skeleton className="mb-2 h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-10 px-8 py-8">
        {/* Stat cards */}
        <section>
          <Skeleton className="mb-3 h-4 w-24" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <Skeleton className="mb-2 h-3 w-28" />
                <Skeleton className="mb-1 h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </section>

        {/* Recent bookings */}
        <section>
          <Skeleton className="mb-3 h-4 w-32" />
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Manage content tiles */}
        <section>
          <Skeleton className="mb-3 h-4 w-32" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5"
              >
                <Skeleton className="h-10 w-10 flex-shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
