import { z } from "zod";
import { GALLERY_CATEGORIES } from "@repo/types";

/** URL or /public path. Mirrors the blog image validator. */
const imageSrcSchema = z
  .string({ error: "url is required" })
  .trim()
  .min(1, "url is required")
  .refine(
    (v) => v.startsWith("/") || /^https?:\/\//i.test(v),
    "must be a relative path (starting with /) or an http(s) URL"
  );

const categorySchema = z.enum(
  GALLERY_CATEGORIES as unknown as [string, ...string[]],
  { error: `category must be one of: ${GALLERY_CATEGORIES.join(", ")}` }
);

export const createGalleryImageSchema = z.object({
  url: imageSrcSchema,
  alt: z
    .string({ error: "alt text is required" })
    .trim()
    .min(1, "alt text is required")
    .max(300, "alt text must be at most 300 characters"),
  category: categorySchema,
  order: z.coerce.number().int().min(0).max(10_000).optional(),
});

export const updateGalleryImageSchema = createGalleryImageSchema.partial();

export const listGalleryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(100),
  category: categorySchema.optional(),
});

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
export type ListGalleryQueryInput = z.infer<typeof listGalleryQuerySchema>;
