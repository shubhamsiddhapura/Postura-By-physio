import { API_BASE_URL } from "@/lib/api";
import { cn } from "@/lib/utils";
import { TestimonialStarRow } from "@/components/testimonials/TestimonialStarGlyphs";

/**
 * Shape of a single testimonial card — the same props the public card
 * consumes in `apps/web/components/Testimonials/TestimonialsReviewsSection`.
 */
export type TestimonialCardData = {
  tag: string;
  quote: string;
  name: string;
  age: number | string;
  avatar: string;
  /** 1-5 stars. Falls back to 5 when omitted to preserve legacy behaviour. */
  rating?: number;
};

type Props = {
  data: TestimonialCardData;
  /**
   * When true, empty fields are filled with neutral placeholder copy so the
   * preview still communicates the final card shape. Used in the form
   * preview while the admin is still typing.
   */
  placeholders?: boolean;
  className?: string;
};

/**
 * Pixel-for-pixel mirror of the public site's testimonial card —
 * `apps/web/components/Testimonials/TestimonialsReviewsSection.tsx`.
 *
 * The public component uses `next/image`; the admin build renders a plain
 * `<img>` to avoid adding a remote-image domain for every avatar host the
 * admin might paste in. Same Tailwind classes, same rounded-corner
 * asymmetry, same star + tag header, same avatar chip.
 *
 * Keep visual changes here and in the public card in lock-step so the
 * admin preview never lies about the final rendering.
 */
export function TestimonialPreviewCard({
  data,
  placeholders = false,
  className,
}: Props) {
  const tag = data.tag.trim() || (placeholders ? "Patient" : "");
  const quote =
    data.quote.trim() ||
    (placeholders
      ? "Your patient's review will appear here as it will be rendered on the public site."
      : "");
  const name = data.name.trim() || (placeholders ? "Patient name" : "");
  const age =
    typeof data.age === "number"
      ? data.age
      : data.age.toString().trim() === ""
      ? placeholders
        ? "—"
        : ""
      : data.age;
  const avatar = resolveAvatarUrl(data.avatar);

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-tl-[36px] rounded-br-[36px] rounded-tr-[12px] rounded-bl-[12px] bg-white p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <TestimonialStarRow value={clampRating(data.rating)} />
        {tag ? (
          <span className="shrink-0 rounded-full border border-black px-3 py-1 text-xs font-medium text-gray-900">
            {tag}
          </span>
        ) : null}
      </div>

      <p className="mt-5 flex-1 text-sm leading-7 text-gray-900 md:text-base">
        {quote ? `\u201C${quote}\u201D` : ""}
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
        <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-tl-[12px] rounded-br-[12px] rounded-tr-[4px] rounded-bl-[4px] bg-gray-100 ring-1 ring-black/5">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              width={48}
              height={48}
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="text-xs font-semibold uppercase text-gray-500"
            >
              {initials(name)}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-gray-900">
          {name}
          {age !== "" ? (
            <>
              {" "}
              <span className="font-medium text-gray-600">({age})</span>
            </>
          ) : null}
        </p>
      </div>
    </article>
  );
}

/** Normalise the incoming rating so no card can request more than 5 stars. */
function clampRating(n: number | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 5;
  return Math.max(1, Math.min(5, Math.round(n)));
}

/**
 * Resolve an avatar src to a URL the admin origin can render. Remote
 * URLs pass through unchanged; relative `/uploads/...` paths live on the
 * web origin so we prefix them with `API_BASE_URL`.
 */
function resolveAvatarUrl(src: string): string {
  const trimmed = src.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `${API_BASE_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
