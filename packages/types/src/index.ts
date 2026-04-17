// Generic API response shape used across all endpoints
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: true; data: T; meta: Record<string, unknown> }
  | { success: false; error: string; issues?: unknown };

// ---------- Icon whitelist ----------
/**
 * Icons available for section items (causes / solutions).
 * Names correspond 1:1 with components in `lucide-react`.
 * Keep this list curated so admin pickers stay tidy.
 */
export const ICON_NAMES = [
  "Armchair",
  "Brain",
  "Dumbbell",
  "Footprints",
  "HandHeart",
  "LaptopMinimal",
  "MousePointer2",
  "PersonStanding",
  "Activity",
  "Heart",
  "Stethoscope",
  "Sparkles",
  "Target",
  "Zap",
  "Shield",
  "Award",
  "Leaf",
  "Sun",
  "Moon",
  "Flame",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

// ---------- Section items (repeatable card/list blocks) ----------
export interface SectionItem {
  title: string;
  description: string;
  icon: IconName;
}

// ---------- Blog ----------
/**
 * Shape returned by the public API. Sections mirror the web detail page
 * top-to-bottom: hero, intro, (optional causes), symptoms,
 * (optional solutions), (optional conclusion).
 */
export interface BlogDto {
  // Hero
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  excerpt: string;
  imageSrc: string;
  author: string;
  tags: string[];
  date: string; // publishedAt formatted as "February 27, 2026"
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Introduction
  introEyebrow: string;
  introTitle: string;
  introDescription: string;
  introDescription2: string | null;
  introImageSrc: string;
  introImageAlt: string | null;

  // Causes (optional block)
  causesEyebrow: string | null;
  causesTitle: string | null;
  causesDescription: string | null;
  causesColumns: number | null;
  causesItems: SectionItem[] | null;

  // Symptoms
  symptomsEyebrow: string;
  symptomsTitle: string;
  symptomsDescription: string;
  symptomsBullets: string[];
  symptomsImageSrc: string;
  symptomsImageAlt: string | null;
  symptomsFlipImage: boolean;

  // Solutions (optional block)
  solutionsEyebrow: string | null;
  solutionsTitle: string | null;
  solutionsDescription: string | null;
  solutionsItems: SectionItem[] | null;

  // Conclusion (optional block)
  conclusionTitle: string | null;
  conclusionParagraphs: string[];
}

/**
 * Request shape for creating a blog. `slug` is optional (auto from title);
 * optional section fields may be omitted entirely.
 */
export interface CreateBlogDto {
  // Hero
  title: string;
  slug?: string;
  eyebrow: string;
  excerpt: string;
  imageSrc: string;
  author?: string;
  tags?: string[];
  published?: boolean;
  publishedAt?: string | null;

  // Introduction (required)
  introEyebrow: string;
  introTitle: string;
  introDescription: string;
  introDescription2?: string | null;
  introImageSrc: string;
  introImageAlt?: string | null;

  // Causes (optional; all-or-nothing)
  causesEyebrow?: string | null;
  causesTitle?: string | null;
  causesDescription?: string | null;
  causesColumns?: number | null;
  causesItems?: SectionItem[] | null;

  // Symptoms (required)
  symptomsEyebrow: string;
  symptomsTitle: string;
  symptomsDescription: string;
  symptomsBullets: string[];
  symptomsImageSrc: string;
  symptomsImageAlt?: string | null;
  symptomsFlipImage?: boolean;

  // Solutions (optional)
  solutionsEyebrow?: string | null;
  solutionsTitle?: string | null;
  solutionsDescription?: string | null;
  solutionsItems?: SectionItem[] | null;

  // Conclusion (optional)
  conclusionTitle?: string | null;
  conclusionParagraphs?: string[];
}

export type UpdateBlogDto = Partial<CreateBlogDto>;

export interface ListBlogsQuery {
  page?: number;
  limit?: number;
  published?: boolean;
  search?: string;
  tag?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------- Uploads ----------
/**
 * Response returned by `POST /api/uploads` after a successful file upload.
 * `url` is the public CDN URL to store on the record (e.g. `imageSrc`).
 */
export interface UploadResultDto {
  url: string;
  path: string;
  size: number;
  mime: string;
}

// ---------- Testimonial ----------
/**
 * Fields map 1:1 to the reviews section on `apps/web/app/testimonials`:
 *   - `tag`: small pill shown top-right ("IT Professional", "Student"...)
 *   - `quote`: review body in quotes
 *   - `name` + `age`: byline, rendered as "Rahul Shah (30)"
 *   - `avatar`: round profile image (URL or /public path)
 *   - `order`: explicit sort (lower shows first)
 *   - `published`: false hides from the public page
 */
export interface TestimonialDto {
  id: string;
  tag: string;
  quote: string;
  name: string;
  age: number;
  avatar: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialDto {
  tag: string;
  quote: string;
  name: string;
  age: number;
  avatar: string;
  order?: number;
  published?: boolean;
}

export type UpdateTestimonialDto = Partial<CreateTestimonialDto>;

export interface ListTestimonialsQuery {
  page?: number;
  limit?: number;
  published?: boolean;
  search?: string;
  tag?: string;
}

// ---------- Gallery ----------
/**
 * Category ids for gallery images. Each corresponds 1:1 to a section on the
 * public gallery page (masonry, split-feature, yoga, pilates, corporate).
 */
export const GALLERY_CATEGORIES = [
  "physiotherapy",
  "aerobics",
  "yoga",
  "pilates",
  "corporate",
] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

/** Human-readable labels for the admin UI. */
export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  physiotherapy: "Physiotherapy",
  aerobics: "Aerobics",
  yoga: "Yoga",
  pilates: "Pilates",
  corporate: "Corporate Wellness",
};

export interface GalleryImageDto {
  id: string;
  url: string;
  alt: string;
  category: GalleryCategory;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryImageDto {
  url: string;
  alt: string;
  category: GalleryCategory;
  order?: number;
}

export type UpdateGalleryImageDto = Partial<CreateGalleryImageDto>;

export interface ListGalleryQuery {
  category?: GalleryCategory;
  page?: number;
  limit?: number;
}
