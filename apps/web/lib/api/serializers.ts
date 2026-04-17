import type { Blog, GalleryImage, Testimonial } from "@repo/db";
import type {
  BlogDto,
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

export function serializeTestimonial(t: Testimonial): TestimonialDto {
  return {
    id: t.id,
    tag: t.tag,
    quote: t.quote,
    name: t.name,
    age: t.age,
    avatar: t.avatar,
    order: t.order,
    published: t.published,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
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
