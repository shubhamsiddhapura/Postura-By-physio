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

// ---------- Booking ----------
/**
 * Values map to the two program cards on `/book-a-session`. Kept as a
 * readonly tuple so the admin UI can iterate without hardcoding strings.
 */
export const BOOKING_PROGRAMS = ["physiotherapy", "fitness"] as const;
export type BookingProgram = (typeof BOOKING_PROGRAMS)[number];

export const BOOKING_PROGRAM_LABELS: Record<BookingProgram, string> = {
  physiotherapy: "Physiotherapy Program",
  fitness: "Fitness Program",
};

/** Workflow states available in the admin table's status filter / dropdown. */
export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

/**
 * Consultation types offered on the public form. Empty string in the form
 * maps to `null` in the DB.
 */
export const CONSULTATION_TYPES = [
  "Home visit",
  "Online",
  "Phone",
  "Society / group",
] as const;
export type ConsultationType = (typeof CONSULTATION_TYPES)[number];

export interface BookingDto {
  id: string;
  program: BookingProgram;
  fullName: string;
  phone: string;
  email: string;
  preferredDateTime: string;
  consultationType: string | null;
  address: string | null;
  message: string | null;

  // Questionnaire — populated only when booking came from /patient-interaction
  profileAbout: string | null;
  activityLevel: string | null;
  discomfortArea: string | null;
  possibleCause: string | null;

  status: BookingStatus;
  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  program: BookingProgram;
  fullName: string;
  phone: string;
  email: string;
  preferredDateTime: string;
  consultationType?: string | null;
  address?: string | null;
  message?: string | null;

  profileAbout?: string | null;
  activityLevel?: string | null;
  discomfortArea?: string | null;
  possibleCause?: string | null;
}

/**
 * Admin-mutable fields on a booking.
 *
 * - `status` + `notes` drive the workflow / internal comms.
 * - `preferredDateTime` can be adjusted when the admin calls the patient
 *   and agrees on a different slot (e.g. two customers requested the
 *   same 10 AM and admin reshuffles one to 11:30 AM).
 *
 * Customer-submitted identity / contact / questionnaire fields remain
 * immutable — the source of truth is what the customer sent.
 */
export interface UpdateBookingDto {
  status?: BookingStatus;
  notes?: string | null;
  preferredDateTime?: string;
}

export interface ListBookingsQuery {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  program?: BookingProgram;
  search?: string; // matches name / phone / email
}

// ---------- Availability ----------
/**
 * Day-of-week indices match `Date.getDay()` — 0 = Sunday ... 6 = Saturday.
 * The tuple order is used by the admin UI to render the weekly grid
 * left-to-right starting Sunday.
 */
export const DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const DAY_OF_WEEK_SHORT_LABELS: Record<DayOfWeek, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

/**
 * A single entry in the weekly availability template. `time` is the
 * human-readable string rendered on the public page ("10:00 AM");
 * `sortKey` is the minutes-of-day value used to order slots chronologically
 * without re-parsing the string on every query.
 */
export interface AvailabilitySlotDto {
  id: string;
  dayOfWeek: DayOfWeek;
  time: string;
  sortKey: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilitySlotDto {
  dayOfWeek: DayOfWeek;
  time: string;
}

/**
 * A single date blocked in full (holiday / leave). Dates are serialized as
 * `YYYY-MM-DD` (date-only, no timezone).
 */
export interface BlockedDateDto {
  id: string;
  date: string;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlockedDateDto {
  date: string; // YYYY-MM-DD
  reason?: string | null;
}

/** Why a given slot is unavailable. `null` = slot is bookable. */
export type SlotUnavailableReason = "past" | "taken";

/** Slot status for a specific date returned by GET /api/availability. */
export interface DateSlotDto {
  time: string;
  sortKey: number;
  available: boolean;
  reason: SlotUnavailableReason | null;
}

/**
 * Response shape for `GET /api/availability?date=YYYY-MM-DD`. Used by the
 * public BookingDateTimeField to decide which slots to enable.
 */
export interface AvailabilityForDateDto {
  date: string; // YYYY-MM-DD (echoed back)
  dayOfWeek: DayOfWeek;
  blocked: boolean;
  blockedReason: string | null;
  slots: DateSlotDto[];
}
