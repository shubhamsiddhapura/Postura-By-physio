import { z } from "zod";
import { BOOKING_PROGRAMS, BOOKING_STATUSES } from "@repo/types";

/**
 * Phone validation is intentionally lenient — the public is messy about
 * punctuation. We only require at least 7 digits, keeping any formatting.
 */
const phoneSchema = z
  .string({ error: "phone is required" })
  .trim()
  .min(7, "phone must contain at least 7 digits")
  .max(32, "phone must be at most 32 characters")
  .refine(
    (v) => (v.match(/\d/g) ?? []).length >= 7,
    "phone must contain at least 7 digits"
  );

const programSchema = z.enum(
  BOOKING_PROGRAMS as unknown as [string, ...string[]],
  { error: `program must be one of: ${BOOKING_PROGRAMS.join(", ")}` }
);

const statusSchema = z.enum(
  BOOKING_STATUSES as unknown as [string, ...string[]],
  { error: `status must be one of: ${BOOKING_STATUSES.join(", ")}` }
);

/**
 * Optional string field that collapses whitespace/empty to `null` but
 * preserves `undefined` when the key is absent from the payload. This is
 * the distinction the PATCH route relies on: missing key = don't touch,
 * explicit null/"" = clear.
 */
const optionalTrimmed = (max: number) =>
  z
    .union([z.string(), z.null()])
    .optional()
    .transform((v) => {
      if (v === undefined) return undefined;
      if (v === null) return null;
      const trimmed = v.trim();
      return trimmed === "" ? null : trimmed;
    })
    .pipe(
      z
        .string()
        .max(max, `must be at most ${max} characters`)
        .nullable()
        .optional()
    );

export const createBookingSchema = z.object({
  program: programSchema,

  fullName: z
    .string({ error: "fullName is required" })
    .trim()
    .min(2, "fullName must be at least 2 characters")
    .max(120, "fullName must be at most 120 characters"),

  phone: phoneSchema,

  email: z
    .string({ error: "email is required" })
    .trim()
    .toLowerCase()
    .email("email must be a valid email address")
    .max(200, "email must be at most 200 characters"),

  preferredDateTime: z
    .string({ error: "preferredDateTime is required" })
    .trim()
    .min(3, "preferredDateTime must be at least 3 characters")
    .max(120, "preferredDateTime must be at most 120 characters"),

  preferredDateTimeUtc: z
    .string({ error: "preferredDateTimeUtc is required" })
    .trim()
    .datetime({ offset: true, message: "preferredDateTimeUtc must be an ISO 8601 timestamp" }),

  patientTimezone: z
    .string({ error: "patientTimezone is required" })
    .trim()
    .min(1, "patientTimezone cannot be empty")
    .max(80, "patientTimezone must be at most 80 characters"),

  consultationType: optionalTrimmed(80),
  service: optionalTrimmed(120),
  address: optionalTrimmed(500),
  message: optionalTrimmed(2000),

  profileAbout: optionalTrimmed(120),
  activityLevel: optionalTrimmed(120),
  discomfortArea: optionalTrimmed(120),
  possibleCause: optionalTrimmed(120),
});

export const updateBookingSchema = z.object({
  status: statusSchema.optional(),
  notes: optionalTrimmed(4000),
  // Admin-editable so a patient can be rescheduled after a phone call.
  // When rescheduling, the admin UI sends the new UTC timestamp and the
  // preferredDateTime string it rendered for the admin's own timezone;
  // the patient-local display is regenerated from `patientTimezone`.
  preferredDateTimeUtc: z
    .string()
    .trim()
    .datetime({ offset: true, message: "preferredDateTimeUtc must be an ISO 8601 timestamp" })
    .optional(),
  preferredDateTime: z
    .string()
    .trim()
    .min(3, "preferredDateTime must be at least 3 characters")
    .max(120, "preferredDateTime must be at most 120 characters")
    .optional(),
});

export const listBookingsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  status: statusSchema.optional(),
  program: programSchema.optional(),
  search: z.string().trim().min(1).max(120).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type ListBookingsQueryInput = z.infer<typeof listBookingsQuerySchema>;
