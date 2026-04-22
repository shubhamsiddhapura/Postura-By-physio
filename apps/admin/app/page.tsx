import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  FileText,
  Image as ImageIcon,
  MessageSquareQuote,
} from "lucide-react";
import type {
  BookingDto,
  BookingStatus,
  BookingProgram,
} from "@repo/types";
import { BOOKING_STATUS_LABELS } from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import {
  blogsApi,
  bookingsApi,
  galleryApi,
  testimonialsApi,
} from "@/lib/api";
import { BookingTime } from "@/components/bookings/BookingTime";

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/* Stats + recent-bookings fetching                                   */
/* ------------------------------------------------------------------ */

type DashboardData = {
  bookings: { pending: number; confirmed: number };
  blogs: { total: number; published: number };
  testimonials: { total: number; published: number };
  gallery: { total: number };
  recentBookings: BookingDto[];
  apiOnline: boolean;
};

async function getDashboardData(): Promise<DashboardData> {
  const results = await Promise.allSettled([
    bookingsApi.list({ status: "pending", limit: 1 }),
    bookingsApi.list({ status: "confirmed", limit: 1 }),
    blogsApi.list({ limit: 1 }),
    blogsApi.list({ limit: 1, published: true }),
    testimonialsApi.list({ limit: 1 }),
    testimonialsApi.list({ limit: 1, published: true }),
    galleryApi.list({ limit: 1 }),
    bookingsApi.list({ limit: 5 }),
  ]);

  const total = (i: number) => {
    const r = results[i];
    return r.status === "fulfilled" ? (r.value.meta?.total ?? 0) : 0;
  };

  const recent =
    results[7].status === "fulfilled"
      ? (results[7].value.data as BookingDto[])
      : [];

  // Any fulfilled call = API reachable. All rejected = offline.
  const apiOnline = results.some((r) => r.status === "fulfilled");

  return {
    bookings: { pending: total(0), confirmed: total(1) },
    blogs: { total: total(2), published: total(3) },
    testimonials: { total: total(4), published: total(5) },
    gallery: { total: total(6) },
    recentBookings: recent,
    apiOnline,
  };
}

/* ------------------------------------------------------------------ */
/* Manage-content tile config                                         */
/* ------------------------------------------------------------------ */

const tiles = [
  {
    label: "Bookings",
    href: "/bookings",
    description:
      "Review appointment requests, reschedule, and confirm patients.",
    icon: CalendarCheck,
  },
  {
    label: "Availability",
    href: "/bookings/availability",
    description: "Set weekly time slots and block dates the clinic is closed.",
    icon: CalendarClock,
  },
  {
    label: "Blogs",
    href: "/blogs",
    description: "Write and manage articles shown on the website.",
    icon: FileText,
  },
  {
    label: "Testimonials",
    href: "/testimonials",
    description: "Moderate and publish client reviews.",
    icon: MessageSquareQuote,
  },
  {
    label: "Gallery",
    href: "/gallery",
    description: "Manage clinic photos organised by category.",
    icon: ImageIcon,
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <>
      <PageHeader
        title="Welcome back"
        description="Quick overview of what's live on Postura by Physio."
      />

      <div className="space-y-10 px-8 py-8">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              At a glance
            </h2>
            <ApiStatusPill online={data.apiOnline} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Pending bookings"
              value={data.bookings.pending}
              tone={data.bookings.pending > 0 ? "attention" : undefined}
              href="/bookings?status=pending"
              hint={
                data.bookings.pending > 0 ? "Awaiting your review" : "All clear"
              }
            />
            <StatCard
              label="Confirmed"
              value={data.bookings.confirmed}
              href="/bookings?status=confirmed"
              hint="Upcoming sessions"
            />
            <StatCard
              label="Blogs"
              value={data.blogs.total}
              href="/blogs"
              hint={`${data.blogs.published} published · ${Math.max(
                0,
                data.blogs.total - data.blogs.published
              )} draft`}
            />
            <StatCard
              label="Testimonials"
              value={data.testimonials.total}
              href="/testimonials"
              hint={`${data.testimonials.published} published`}
            />
          </div>
        </section>

        <RecentBookings bookings={data.recentBookings} />

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Manage content
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((tile) => {
              const Icon = tile.icon;
              return (
                <Link
                  key={tile.label}
                  href={tile.href}
                  className="group block focus:outline-none"
                >
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardContent className="flex items-start gap-4">
                      <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-primary text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900">
                          {tile.label}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {tile.description}
                        </p>
                      </div>
                      <ArrowRight className="mt-1.5 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  tone,
  hint,
  href,
}: {
  label: string;
  value: number | string;
  tone?: "attention" | "ok" | "bad";
  hint?: string;
  href?: string;
}) {
  const toneClass =
    tone === "attention"
      ? "text-amber-600"
      : tone === "bad"
        ? "text-red-600"
        : tone === "ok"
          ? "text-emerald-600"
          : "text-gray-900";

  const inner = (
    <Card className={href ? "transition-shadow hover:shadow-md" : undefined}>
      <CardContent className="py-5">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {label}
        </p>
        <p className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</p>
        {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href} className="block focus:outline-none">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function ApiStatusPill({ online }: { online: boolean }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium " +
        (online
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700")
      }
    >
      <span
        className={
          "h-1.5 w-1.5 rounded-full " +
          (online ? "bg-emerald-500" : "bg-red-500")
        }
      />
      API {online ? "online" : "offline"}
    </span>
  );
}

function RecentBookings({ bookings }: { bookings: BookingDto[] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Recent bookings
        </h2>
        <Link
          href="/bookings"
          className="text-xs font-medium text-primary hover:text-primary/80"
        >
          View all →
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-500">
              No bookings yet. When a patient submits a request it'll appear here.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <BookingRow key={b.id} booking={b} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function BookingRow({ booking }: { booking: BookingDto }) {
  return (
    <li>
      <Link
        href={`/bookings/${booking.id}`}
        className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-gray-900">
              {booking.fullName}
            </p>
            <ProgramPill program={booking.program} />
          </div>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            <BookingTime booking={booking} compact showPatientHint={false} /> · {booking.phone}
          </p>
        </div>

        <StatusChip status={booking.status} />

        <span className="hidden w-28 flex-shrink-0 text-right text-xs text-gray-400 sm:block">
          {formatReceived(booking.createdAt)}
        </span>
      </Link>
    </li>
  );
}

function ProgramPill({ program }: { program: BookingProgram }) {
  return (
    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-600">
      {program === "physiotherapy" ? "Physio" : "Fitness"}
    </span>
  );
}

const STATUS_TONE: Record<BookingStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-gray-200 bg-gray-50 text-gray-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

function StatusChip({ status }: { status: BookingStatus }) {
  return (
    <span
      className={
        "inline-flex flex-shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium " +
        STATUS_TONE[status]
      }
    >
      {BOOKING_STATUS_LABELS[status]}
    </span>
  );
}

/**
 * Short human-friendly "when was this received" string.
 * Today → "Today 3:12 PM", yesterday → "Yesterday", older → "Apr 12".
 */
function formatReceived(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return `Today ${d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const wasYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();
  if (wasYesterday) return "Yesterday";

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
