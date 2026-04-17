import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import type { BookingDto } from "@repo/types";
import {
  BOOKING_PROGRAM_LABELS,
  BOOKING_STATUS_LABELS,
} from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BookingStatusForm } from "@/components/bookings/BookingStatusForm";
import { DeleteBookingButton } from "@/components/bookings/DeleteBookingButton";
import { ApiError, bookingsApi } from "@/lib/api";
import { BOOKING_STATUS_TONE } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let booking: BookingDto;
  try {
    const res = await bookingsApi.get(params.id);
    booking = res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const hasInteraction = Boolean(
    booking.profileAbout ||
      booking.activityLevel ||
      booking.discomfortArea ||
      booking.possibleCause
  );

  return (
    <>
      <PageHeader
        title={booking.fullName}
        description={`${BOOKING_PROGRAM_LABELS[booking.program]} · submitted ${new Date(
          booking.createdAt
        ).toLocaleString("en-IN")}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge tone={BOOKING_STATUS_TONE[booking.status]}>
              {BOOKING_STATUS_LABELS[booking.status]}
            </Badge>
            <DeleteBookingButton
              id={booking.id}
              label={booking.fullName}
              redirectTo="/bookings"
            />
          </div>
        }
      />

      <div className="space-y-6 px-8 py-6">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to bookings
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          {/* LEFT: customer-submitted details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <DetailRows
                  rows={[
                    ["Program", BOOKING_PROGRAM_LABELS[booking.program]],
                    ["Preferred date & time", booking.preferredDateTime],
                    ["Consultation type", booking.consultationType],
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailRows
                  rows={[
                    ["Full name", booking.fullName],
                    ["Phone", booking.phone],
                    ["Email", booking.email],
                    ["Address", booking.address],
                  ]}
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href={`tel:${booking.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </a>
                  <a
                    href={`mailto:${booking.email}?subject=${encodeURIComponent(
                      `Re: Your booking with Postura by Physio`
                    )}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                </div>
              </CardContent>
            </Card>

            {booking.message ? (
              <Card>
                <CardHeader>
                  <CardTitle>Message from customer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                    {booking.message}
                  </p>
                </CardContent>
              </Card>
            ) : null}

            {hasInteraction ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Questionnaire
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      (from /patient-interaction)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DetailRows
                    rows={[
                      ["Profile", booking.profileAbout],
                      ["Activity level", booking.activityLevel],
                      ["Discomfort area", booking.discomfortArea],
                      ["Possible cause", booking.possibleCause],
                    ]}
                  />
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* RIGHT: workflow */}
          <div className="space-y-6">
            <BookingStatusForm booking={booking} />

            <Card>
              <CardHeader>
                <CardTitle>Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <DetailRows
                  rows={[
                    [
                      "Created",
                      new Date(booking.createdAt).toLocaleString("en-IN"),
                    ],
                    [
                      "Last update",
                      new Date(booking.updatedAt).toLocaleString("en-IN"),
                    ],
                    ["Booking ID", booking.id],
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailRows({
  rows,
}: {
  rows: Array<[label: string, value: string | null | undefined]>;
}) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[140px,1fr]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-xs font-medium uppercase tracking-wider text-gray-500 sm:pt-0.5">
            {label}
          </dt>
          <dd className="text-sm text-gray-900">
            {value ? (
              <span className="whitespace-pre-wrap">{value}</span>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
