import Link from "next/link";
import { Eye } from "lucide-react";
import type { BookingDto, BookingStatus } from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookingsTabs } from "@/components/bookings/BookingsTabs";
import { bookingsApi } from "@/lib/api";
import { BOOKING_STATUS_TONE } from "@/lib/bookings";
import { BookingTime } from "@/components/bookings/BookingTime";
import { BookingsFilters } from "./BookingsFilters";

export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  status?: BookingStatus | "all";
  program?: string | "all";
};

export default async function BookingsListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const search = searchParams.search?.trim() || undefined;
  const statusFilter = (searchParams.status ?? "all") as
    | BookingStatus
    | "all";
  const programFilter = searchParams.program ?? "all";

  let items: BookingDto[] = [];
  let total = 0;
  let loadError: string | null = null;

  try {
    const res = await bookingsApi.list({
      limit: 200,
      search,
      status: statusFilter !== "all" ? statusFilter : undefined,
      program:
        programFilter !== "all" &&
        (BOOKING_PROGRAMS as readonly string[]).includes(programFilter)
          ? (programFilter as (typeof BOOKING_PROGRAMS)[number])
          : undefined,
    });
    items = res.data;
    total = res.meta?.total ?? items.length;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load bookings";
  }

  // Small top-of-page summary: count pending actions prominently.
  const pendingCount = items.filter((b) => b.status === "pending").length;
  const confirmedCount = items.filter((b) => b.status === "confirmed").length;
  const completedCount = items.filter((b) => b.status === "completed").length;
  const cancelledCount = items.filter((b) => b.status === "cancelled").length;

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Appointment requests submitted from the public site."
      />
      <BookingsTabs />

      <div className="space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        {!loadError ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Total
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                {total || items.length}
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                Pending
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-amber-800">
                {pendingCount}
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                Confirmed
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-blue-800">
                {confirmedCount}
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Completed
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-800">
                {completedCount}
              </p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50/60 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
                Cancelled
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-red-800">
                {cancelledCount}
              </p>
            </div>
          </div>
        ) : null}

        <BookingsFilters
          initialSearch={search ?? ""}
          initialStatus={statusFilter}
          initialProgram={programFilter}
        />

        {loadError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Could not load bookings</p>
            <p className="mt-1">{loadError}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-sm font-medium text-gray-700">
              No bookings found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {search || statusFilter !== "all" || programFilter !== "all"
                ? "Try clearing your filters."
                : "New appointment requests from the public site will appear here."}
            </p>
          </div>
        ) : (
          <>
            {pendingCount > 0 && statusFilter === "all" ? (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
                <span className="font-medium">{pendingCount}</span>{" "}
                {pendingCount === 1 ? "booking" : "bookings"} awaiting your
                response.
              </div>
            ) : null}

            {/* overflow-x-auto lets the table scroll horizontally on zoom / narrow viewports */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left sm:px-5">Customer</th>
                    {/* Program — hide on xs */}
                    <th className="hidden px-4 py-3 text-left sm:table-cell sm:px-5">
                      Program
                    </th>
                    {/* Preferred time — hide below md */}
                    <th className="hidden px-4 py-3 text-left md:table-cell sm:px-5">
                      Preferred
                    </th>
                    {/* Consultation type — hide below lg */}
                    <th className="hidden px-4 py-3 text-left lg:table-cell sm:px-5">
                      Consultation
                    </th>
                    {/* Submitted date — hide below lg */}
                    <th className="hidden px-4 py-3 text-left lg:table-cell sm:px-5">
                      Submitted
                    </th>
                    <th className="px-4 py-3 text-left sm:px-5">Status</th>
                    <th className="px-4 py-3 text-right sm:px-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {b.fullName}
                          </span>
                          <span className="mt-0.5 text-xs text-gray-500">
                            {b.phone}
                          </span>
                          {/* Email visible only on sm+ to save space */}
                          <span className="hidden text-xs text-gray-400 sm:block">
                            {b.email}
                          </span>
                        </div>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-gray-700 sm:table-cell sm:px-5">
                        {BOOKING_PROGRAM_LABELS[b.program]}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-gray-700 md:table-cell sm:px-5">
                        <BookingTime booking={b} compact />
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-gray-600 lg:table-cell sm:px-5">
                        {b.consultationType ?? (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-gray-500 lg:table-cell sm:px-5">
                        {new Date(b.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <Badge tone={BOOKING_STATUS_TONE[b.status]}>
                          {BOOKING_STATUS_LABELS[b.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/bookings/${b.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="text-xs text-gray-500">
          {items.length} of {total} shown
        </p>
      </div>
    </>
  );
}
