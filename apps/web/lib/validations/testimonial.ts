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
 */
const optionalImageSrcSchema = z
  .union([imageSrcSchema, z.literal(""), z.null()])
  .optional()
  .transform((v) => (v === "" || v === undefined ? null : v));

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

const mediaArraySchema = z
  .array(mediaUrlSchema)
  .max(20, "at most 20 items")
  .optional()
  .transform((v) => v ?? []);

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

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
export type ListTestimonialsQueryInput = z.infer<
  typeof listTestimonialsQuerySchema
>;
