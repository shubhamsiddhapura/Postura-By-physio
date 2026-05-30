import { z } from "zod";

/** URL or /public path. Reused across blog / gallery / testimonial. */
const imageSrcSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (v) => v.startsWith("/") || /^https?:\/\//i.test(v),
    "must be a relative path (starting with /) or an http(s) URL"
  );

/**
 * Optional avatar — the public share-your-story form lets the patient
 * skip the photo entirely. We accept `""` or `null` as "no avatar" and
 * normalise both to `null` so the database stores a single canonical
 * "missing" marker.
 *
 * IMPORTANT — the `.optional()` MUST come AFTER `.transform()` so the
 * transform only runs when the field is actually present in the
 * payload. The PATCH route relies on `undefined` meaning "don't touch
 * this column"; if we transformed missing → null at the schema layer
 * the partial-update semantics would be impossible to express.
 */
const optionalImageSrcSchema = z
  .union([imageSrcSchema, z.literal(""), z.null()])
  .transform((v) => (v === "" ? null : v))
  .optional();

/**
 * URL of an uploaded media asset (image or video). Same rules as
 * `imageSrcSchema` but error messaging is generic so it works for both
 * photos and videos.
 */
const mediaUrlSchema = z
  .string()
  .trim()
  .min(1, "media URL cannot be empty")
  .refine(
    (v) => v.startsWith("/") || /^https?:\/\//i.test(v),
    "must be a relative path (starting with /) or an http(s) URL"
  );

/**
 * Photos/videos arrays are kept fully optional WITHOUT a default-to-`[]`
 * transform so that PATCH payloads which omit the field leave the
 * existing rows untouched. An explicit empty array `[]` still means
 * "clear all media" — the route layer handles the "missing → []"
 * default for create.
 */
const mediaArraySchema = z
  .array(mediaUrlSchema)
  .max(20, "at most 20 items")
  .optional();

export const createTestimonialSchema = z.object({
  tag: z
    .string({ error: "tag is required" })
    .trim()
    .min(1, "tag cannot be empty")
    .max(80, "tag must be at most 80 characters"),

  quote: z
    .string({ error: "quote is required" })
    .trim()
    .min(10, "quote must be at least 10 characters")
    .max(1000, "quote must be at most 1000 characters"),

  name: z
    .string({ error: "name is required" })
    .trim()
    .min(1, "name cannot be empty")
    .max(120, "name must be at most 120 characters"),

  age: z.coerce
    .number({ error: "age is required" })
    .int("age must be an integer")
    .min(1, "age must be at least 1")
    .max(120, "age must be at most 120"),

  avatar: optionalImageSrcSchema,

  rating: z.coerce
    .number({ error: "rating must be a number" })
    .int("rating must be a whole number")
    .min(1, "rating must be at least 1")
    .max(5, "rating must be at most 5")
    .optional(),

  photos: mediaArraySchema,
  videos: mediaArraySchema,

  order: z.coerce.number().int().min(0).max(10_000).optional(),

  published: z.boolean().optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export const listTestimonialsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(100),
  published: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .optional(),
  search: z.string().trim().min(1).max(120).optional(),
  tag: z.string().trim().min(1).max(80).optional(),
});

/** POST /api/internal/testimonials/send-share-invite (admin-invoked via proxy). */
export const sendTestimonialShareInviteSchema = z.object({
  email: z.string({ error: "email is required" }).trim().email("invalid email address"),
});

export type SendTestimonialShareInviteInput = z.infer<
  typeof sendTestimonialShareInviteSchema
>;

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
export type ListTestimonialsQueryInput = z.infer<
  typeof listTestimonialsQuerySchema
>;
