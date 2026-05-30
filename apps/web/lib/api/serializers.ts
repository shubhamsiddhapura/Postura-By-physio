import type {
  AvailabilitySlot,
  BlockedDate,
  Blog,
  Booking,
  Certification,
  GalleryImage,
  Testimonial,
} from "@repo/db";
import type {
  AvailabilitySlotDto,
  BlockedDateDto,
  BlogDto,
  BookingDto,
  BookingProgram,
  BookingStatus,
  CertificationDto,
  DayOfWeek,
  GalleryCategory,
  GalleryImageDto,
  SectionItem,
  TestimonialDto,
} from "@repo/types";

function formatDate(d: Date | null): string {
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

/** Narrow `Prisma.JsonValue` to `SectionItem[]` with a best-effort guard. */
function asSectionItems(value: unknown): SectionItem[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.filter(
    (it): it is SectionItem =>
      typeof it === "object" &&
      it !== null &&
      typeof (it as SectionItem).title === "string" &&
      typeof (it as SectionItem).description === "string" &&
      typeof (it as SectionItem).icon === "string"
  );
  return items.length > 0 ? items : null;
}

export function serializeBlog(blog: Blog): BlogDto {
  return {
    // Hero
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    eyebrow: blog.eyebrow,
    excerpt: blog.excerpt,
    imageSrc: blog.imageSrc,
    author: blog.author,
    tags: blog.tags,
    date: formatDate(blog.publishedAt ?? blog.createdAt),
    published: blog.published,
    publishedAt: blog.publishedAt ? blog.publishedAt.toISOString() : null,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),

    // Introduction
    introEyebrow: blog.introEyebrow,
    introTitle: blog.introTitle,
    introDescription: blog.introDescription,
    introDescription2: blog.introDescription2 ?? null,
    introImageSrc: blog.introImageSrc,
    introImageAlt: blog.introImageAlt ?? null,

    // Causes
    causesEyebrow: blog.causesEyebrow ?? null,
    causesTitle: blog.causesTitle ?? null,
    causesDescription: blog.causesDescription ?? null,
    causesColumns: blog.causesColumns ?? null,
    causesItems: asSectionItems(blog.causesItems),

    // Symptoms
    symptomsEyebrow: blog.symptomsEyebrow,
    symptomsTitle: blog.symptomsTitle,
    symptomsDescription: blog.symptomsDescription,
    symptomsBullets: blog.symptomsBullets,
    symptomsImageSrc: blog.symptomsImageSrc,
    symptomsImageAlt: blog.symptomsImageAlt ?? null,
    symptomsFlipImage: blog.symptomsFlipImage,

    // Solutions
    solutionsEyebrow: blog.solutionsEyebrow ?? null,
    solutionsTitle: blog.solutionsTitle ?? null,
    solutionsDescription: blog.solutionsDescription ?? null,
    solutionsItems: asSectionItems(blog.solutionsItems),

    // Conclusion
    conclusionTitle: blog.conclusionTitle ?? null,
    conclusionParagraphs: blog.conclusionParagraphs,
  };
}

export function serializeBooking(b: Booking): BookingDto {
  return {
    id: b.id,
    program: b.program as BookingProgram,
    fullName: b.fullName,
    phone: b.phone,
    email: b.email,
    preferredDateTime: b.preferredDateTime,
    preferredDateTimeUtc: b.preferredDateTimeUtc
      ? b.preferredDateTimeUtc.toISOString()
      : null,
    patientTimezone: b.patientTimezone,
    consultationType: b.consultationType,
    service: b.service,
    address: b.address,
    message: b.message,
    profileAbout: b.profileAbout,
    activityLevel: b.activityLevel,
    discomfortArea: b.discomfortArea,
    possibleCause: b.possibleCause,
    status: b.status as BookingStatus,
    notes: b.notes,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  };
}

export function serializeTestimonial(t: Testimonial): TestimonialDto {
  return {
    id: t.id,
    tag: t.tag,
    quote: t.quote,
    name: t.name,
    age: t.age,
    avatar: t.avatar,
    rating: t.rating,
    photos: t.photos ?? [],
    videos: t.videos ?? [],
    order: t.order,
    published: t.published,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

export function serializeAvailabilitySlot(s: AvailabilitySlot): AvailabilitySlotDto {
  return {
    id: s.id,
    dayOfWeek: s.dayOfWeek as DayOfWeek,
    time: s.time,
    sortKey: s.sortKey,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

/**
 * `BlockedDate.date` is stored as a date-only (@db.Date) column. Prisma still
 * returns a Date object but in UTC — we format as YYYY-MM-DD directly from
 * its UTC components so the string round-trips to the same calendar day
 * regardless of server timezone.
 */
export function serializeBlockedDate(b: BlockedDate): BlockedDateDto {
  const y = b.date.getUTCFullYear();
  const m = String(b.date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(b.date.getUTCDate()).padStart(2, "0");
  return {
    id: b.id,
    date: `${y}-${m}-${d}`,
    reason: b.reason,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  };
}

export function serializeGalleryImage(image: GalleryImage): GalleryImageDto {
  return {
    id: image.id,
    url: image.url,
    alt: image.alt,
    category: image.category as GalleryCategory,
    order: image.order,
    createdAt: image.createdAt.toISOString(),
    updatedAt: image.updatedAt.toISOString(),
  };
}

export function serializeCertification(c: Certification): CertificationDto {
  return {
    id: c.id,
    imageUrl: c.imageUrl,
    title: c.title,
    alt: c.alt,
    order: c.order,
    published: c.published,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}
