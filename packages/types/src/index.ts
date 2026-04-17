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

// ---------- Testimonial ----------
export interface CreateTestimonialDto {
  name: string;
  role?: string;
  content: string;
  rating: number;
  avatar?: string;
  featured?: boolean;
}
export interface UpdateTestimonialDto extends Partial<CreateTestimonialDto> {
  approved?: boolean;
}

// ---------- Gallery ----------
export interface CreateGalleryImageDto {
  url: string;
  publicId: string;
  caption?: string;
  category?: string;
  order?: number;
}
