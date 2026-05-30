import { z } from "zod";

/** URL or /public path. Mirrors the gallery / blog image validators. */
const imageSrcSchema = z
  .string({ error: "imageUrl is required" })
  .trim()
  .min(1, "imageUrl is required")
  .refine(
    (v) => v.startsWith("/") || /^https?:\/\//i.test(v),
    "must be a relative path (starting with /) or an http(s) URL"
  );

export const createCertificationSchema = z.object({
  imageUrl: imageSrcSchema,
  title: z
    .string({ error: "title is required" })
    .trim()
    .min(1, "title is required")
    .max(160, "title must be at most 160 characters"),
  alt: z
    .string({ error: "alt text is required" })
    .trim()
    .min(1, "alt text is required")
    .max(300, "alt text must be at most 300 characters"),
  order: z.coerce.number().int().min(0).max(10_000).optional(),
  published: z.boolean().optional(),
});

export const updateCertificationSchema = createCertificationSchema.partial();

export const listCertificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(100),
  published: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .optional(),
});

export type CreateCertificationInput = z.infer<typeof createCertificationSchema>;
export type UpdateCertificationInput = z.infer<typeof updateCertificationSchema>;
export type ListCertificationsQueryInput = z.infer<
  typeof listCertificationsQuerySchema
>;
