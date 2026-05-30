import type { AvailabilitySlotDto, BlockedDateDto } from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { AvailabilityEditor } from "@/components/bookings/AvailabilityEditor";
import { BookingsTabs } from "@/components/bookings/BookingsTabs";
import { availabilityApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  let slots: AvailabilitySlotDto[] = [];
  let blockedDates: BlockedDateDto[] = [];
  let loadError: string | null = null;

  try {
    const [slotsRes, blockedRes] = await Promise.all([
      availabilityApi.listSlots(),
      availabilityApi.listBlockedDates(),
    ]);
    slots = slotsRes.data;
    blockedDates = blockedRes.data;
  } catch (err) {
    loadError =
      err instanceof Error ? err.message : "Failed to load availability";
  }

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Appointment requests submitted from the public site."
      />
      <BookingsTabs />

      <div className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 lg:px-6">
        {loadError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Could not load availability</p>
            <p className="mt-1">{loadError}</p>
          </div>
        ) : (
          <AvailabilityEditor
            initialSlots={slots}
            initialBlockedDates={blockedDates}
          />
        )}
      </div>
    </>
  );
}
