import { z } from "zod";
import { DAYS_OF_WEEK } from "@repo/types";
import { parseDisplayTime } from "../time";

const dayOfWeekSchema = z.coerce
  .number({ error: "dayOfWeek is required" })
  .int("dayOfWeek must be an integer")
  .refine(
    (n): n is (typeof DAYS_OF_WEEK)[number] =>
      (DAYS_OF_WEEK as readonly number[]).includes(n),
    "dayOfWeek must be 0 (Sun) to 6 (Sat)"
  );

/**
 * `time` arrives as a display string but we normalise + index as an object
 * so the route handler can pick up `display` and `minutes` without
 * re-parsing. Returned from `.transform` so subsequent `.parse()` consumers
 * get the derived values for free.
 */
const timeSchema = z
  .string({ error: "time is required" })
  .trim()
  .min(1, "time cannot be empty")
  .transform((v, ctx) => {
    const parsed = parseDisplayTime(v);
    if (!parsed) {
      ctx.addIssue({
        code: "custom",
        message: 'time must look like "7:00 AM" or "11:30 PM"',
      });
      return z.NEVER;
    }
    return parsed;
  });

export const createAvailabilitySlotSchema = z.object({
  dayOfWeek: dayOfWeekSchema,
  time: timeSchema,
});

/**
 * `date` must be an ISO calendar date (`YYYY-MM-DD`). We deliberately
 * don't accept full ISO timestamps so a single day can't ambiguously span
 * two calendar dates across timezones.
 */
const dateOnlySchema = z
  .string({ error: "date is required" })
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format")
  .refine((v) => !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime()), {
    message: "date is not a real calendar date",
  });

export const createBlockedDateSchema = z.object({
  date: dateOnlySchema,
  reason: z
    .union([z.string(), z.null()])
    .optional()
    .transform((v) => {
      if (v === undefined) return undefined;
      if (v === null) return null;
      const t = v.trim();
      return t === "" ? null : t;
    })
    .pipe(z.string().max(200, "reason must be at most 200 characters").nullable().optional()),
});

export const availabilityForDateQuerySchema = z.object({
  date: dateOnlySchema,
  /**
   * Optional IANA timezone. When present, `date` is interpreted in this
   * zone and the returned slots are formatted in it. Omitted / blank
   * string falls back to the clinic timezone (legacy behaviour).
   */
  tz: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

export type CreateAvailabilitySlotInput = z.infer<
  typeof createAvailabilitySlotSchema
>;
export type CreateBlockedDateInput = z.infer<typeof createBlockedDateSchema>;
export type AvailabilityForDateQueryInput = z.infer<
  typeof availabilityForDateQuerySchema
>;
