import Link from "next/link";
import { Eye, Search } from "lucide-react";
import type { BookingDto, BookingStatus } from "@repo/types";
import {
  BOOKING_PROGRAMS,
  BOOKING_PROGRAM_LABELS,
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
} from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookingsTabs } from "@/components/bookings/BookingsTabs";
import { bookingsApi } from "@/lib/api";
import { BOOKING_STATUS_TONE } from "@/lib/bookings";

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

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Appointment requests submitted from the public site."
      />
      <BookingsTabs />

      <div className="space-y-4 px-8 py-6">
        <form className="flex flex-wrap items-center gap-3" action="/bookings">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              name="search"
              defaultValue={search ?? ""}
              placeholder="Search by name / phone / email..."
              className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
            />
          </div>

          <select
            name="status"
            defaultValue={statusFilter}
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
          >
            <option value="all">All statuses</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {BOOKING_STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          <select
            name="program"
            defaultValue={programFilter}
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
          >
            <option value="all">All programs</option>
            {BOOKING_PROGRAMS.map((p) => (
              <option key={p} value={p}>
                {BOOKING_PROGRAM_LABELS[p]}
              </option>
            ))}
          </select>

          <Button variant="outline" type="submit" size="sm">
            Apply
          </Button>

          {search || statusFilter !== "all" || programFilter !== "all" ? (
            <Link
              href="/bookings"
              className="text-sm text-gray-500 underline-offset-4 hover:text-gray-900 hover:underline"
            >
              Clear
            </Link>
          ) : null}
        </form>

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

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-3 text-left">Customer</th>
                    <th className="px-5 py-3 text-left">Program</th>
                    <th className="px-5 py-3 text-left">Preferred</th>
                    <th className="px-5 py-3 text-left">Consultation</th>
                    <th className="px-5 py-3 text-left">Submitted</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {b.fullName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {b.phone} · {b.email}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-700">
                        {BOOKING_PROGRAM_LABELS[b.program]}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-700">
                        {b.preferredDateTime}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                        {b.consultationType ?? (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                        {new Date(b.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={BOOKING_STATUS_TONE[b.status]}>
                          {BOOKING_STATUS_LABELS[b.status]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/bookings/${b.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3.5 w-3.5" />
                              View
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
