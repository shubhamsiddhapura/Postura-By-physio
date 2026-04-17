import { z } from "zod";
import { ICON_NAMES } from "@repo/types";

/**
 * URL-friendly slug validator: lowercase alphanumerics separated by single hyphens.
 * Example: "neck-pain-in-it-professionals"
 */
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Accepts an ISO date string OR `null`/omitted. Used for `publishedAt`. */
const publishedAtSchema = z
  .string()
  .datetime({ message: "publishedAt must be an ISO 8601 date string" })
  .nullable()
  .optional();

/** Local image path (/foo.jpg) or absolute http(s) URL. */
const imagePathSchema = z
  .string({ error: "image path is required" })
  .trim()
  .min(1, "image path is required")
  .refine(
    (v) => v.startsWith("/") || /^https?:\/\//i.test(v),
    "must be a relative path (starting with /) or an http(s) URL"
  );

/** Icon must be one of the whitelisted Lucide names. */
const iconSchema = z.enum(ICON_NAMES as unknown as [string, ...string[]], {
  error: `icon must be one of: ${ICON_NAMES.join(", ")}`,
});

/** Shared shape for card-style items in causes/solutions sections. */
const sectionItemSchema = z.object({
  title: z.string().trim().min(1, "item title cannot be empty").max(200),
  description: z
    .string()
    .trim()
    .min(1, "item description cannot be empty")
    .max(600),
  icon: iconSchema,
});

export const createBlogSchema = z.object({
  // ---------- Hero ----------
  title: z
    .string({ error: "title is required" })
    .trim()
    .min(3, "title must be at least 3 characters")
    .max(200, "title must be at most 200 characters"),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(220)
    .regex(slugRegex, "slug must be lowercase letters/numbers separated by hyphens")
    .optional(),

  eyebrow: z
    .string({ error: "eyebrow is required" })
    .trim()
    .min(1, "eyebrow cannot be empty")
    .max(120, "eyebrow must be at most 120 characters"),

  excerpt: z
    .string({ error: "excerpt is required" })
    .trim()
    .min(10, "excerpt must be at least 10 characters")
    .max(500, "excerpt must be at most 500 characters"),

  imageSrc: imagePathSchema,

  author: z.string().trim().min(1).max(120).optional(),

  tags: z
    .array(z.string().trim().min(1).max(40))
    .max(20, "too many tags")
    .optional(),

  published: z.boolean().optional(),
  publishedAt: publishedAtSchema,

  // ---------- Introduction (required) ----------
  introEyebrow: z.string().trim().min(1).max(120),
  introTitle: z.string().trim().min(1).max(200),
  introDescription: z.string().trim().min(10).max(2000),
  introDescription2: z.string().trim().max(2000).nullish(),
  introImageSrc: imagePathSchema,
  introImageAlt: z.string().trim().max(200).nullish(),

  // ---------- Causes (optional block) ----------
  causesEyebrow: z.string().trim().max(200).nullish(),
  causesTitle: z.string().trim().max(200).nullish(),
  causesDescription: z.string().trim().max(2000).nullish(),
  causesColumns: z.coerce.number().int().min(2).max(4).nullish(),
  causesItems: z.array(sectionItemSchema).max(12).nullish(),

  // ---------- Symptoms (required) ----------
  symptomsEyebrow: z.string().trim().min(1).max(120),
  symptomsTitle: z.string().trim().min(1).max(200),
  symptomsDescription: z.string().trim().min(10).max(2000),
  symptomsBullets: z
    .array(z.string().trim().min(1, "bullet cannot be empty").max(300))
    .min(1, "at least one bullet is required")
    .max(20, "too many bullets"),
  symptomsImageSrc: imagePathSchema,
  symptomsImageAlt: z.string().trim().max(200).nullish(),
  symptomsFlipImage: z.boolean().optional(),

  // ---------- Solutions (optional block) ----------
  solutionsEyebrow: z.string().trim().max(200).nullish(),
  solutionsTitle: z.string().trim().max(200).nullish(),
  solutionsDescription: z.string().trim().max(2000).nullish(),
  solutionsItems: z.array(sectionItemSchema).max(12).nullish(),

  // ---------- Conclusion (optional block) ----------
  conclusionTitle: z.string().trim().max(200).nullish(),
  conclusionParagraphs: z
    .array(z.string().trim().min(1).max(2000))
    .max(20)
    .optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const listBlogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  published: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .optional(),
  search: z.string().trim().min(1).max(120).optional(),
  tag: z.string().trim().min(1).max(40).optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type ListBlogsQueryInput = z.infer<typeof listBlogsQuerySchema>;
