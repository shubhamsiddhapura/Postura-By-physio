import type { BookingStatus } from "@repo/types";

/** Map booking status to a Badge tone for consistent styling admin-wide. */
export const BOOKING_STATUS_TONE: Record<
  BookingStatus,
  "amber" | "blue" | "green" | "red"
> = {
  pending: "amber",
  confirmed: "blue",
  completed: "green",
  cancelled: "red",
};
