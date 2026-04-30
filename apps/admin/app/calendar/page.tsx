import type {
  AvailabilitySlotDto,
  BlockedDateDto,
  BookingDto,
} from "@repo/types";
import { BookingsCalendar } from "@/components/bookings/BookingsCalendar";
import { availabilityApi, bookingsApi } from "@/lib/api";

export const dynamic = "force-dynamic";

/**
 * Full-screen booking calendar. Pulls the most recent 200 bookings
 * (admin view has capped limit at 200) along with the weekly
 * availability template + one-off blocked dates so the client
 * component can derive "available slots" counts per visible day.
 */
export default async function CalendarPage() {
  let bookings: BookingDto[] = [];
  let slots: AvailabilitySlotDto[] = [];
  let blockedDates: BlockedDateDto[] = [];
  let loadError: string | null = null;

  try {
    const [bookingsRes, slotsRes, blockedRes] = await Promise.all([
      bookingsApi.list({ limit: 200 }),
      availabilityApi.listSlots(),
      availabilityApi.listBlockedDates(),
    ]);
    bookings = bookingsRes.data;
    slots = slotsRes.data;
    blockedDates = blockedRes.data;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load calendar data";
  }

  return (
    <>
      <div className="h-full p-0">
        {loadError ? (
          <div className="m-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:m-6 lg:m-8">
            <p className="font-medium">Could not load calendar</p>
            <p className="mt-1">{loadError}</p>
          </div>
        ) : (
          <div className="p-3 sm:p-4 lg:p-6">
            <BookingsCalendar
              bookings={bookings}
              slots={slots}
              blockedDates={blockedDates}
            />
          </div>
        )}
      </div>
    </>
  );
}

