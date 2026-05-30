"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  ChevronLeft,
  Film,
  ImagePlus,
  Loader2,
  Play,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type {
  CreateTestimonialDto,
  TestimonialDto,
  UpdateTestimonialDto,
} from "@repo/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ApiError,
  API_BASE_URL,
  testimonialsApi,
  uploadsApi,
  type FieldErrors,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { TestimonialStarGlyph } from "@/components/testimonials/TestimonialStarGlyphs";

type Mode = "create" | "edit";

type FormState = {
  tag: string;
  quote: string;
  name: string;
  age: string;
  avatar: string;
  rating: number;
  /**
   * Patient-submitted photo URLs. Stored as an array of fully-qualified
   * Supabase public URLs so the form value can be sent straight to the
   * API without any further resolving. Empty array means "no photos".
   */
  photos: string[];
  /** Patient-submitted video URLs. Same shape as `photos`. */
  videos: string[];
  order: string;
  published: boolean;
};

function emptyForm(): FormState {
  return {
    tag: "",
    quote: "",
    name: "",
    age: "",
    avatar: "",
    rating: 5,
    photos: [],
    videos: [],
    order: "",
    published: true,
  };
}

function clampRating(n: number | undefined): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 5;
  return Math.max(1, Math.min(5, Math.round(n)));
}

function formFromDto(t: TestimonialDto): FormState {
  return {
    tag: t.tag,
    quote: t.quote,
    name: t.name,
    age: String(t.age),
    // `avatar` may be null when the patient submitted the public
    // share-your-story form without a photo. The form keeps a string
    // FormState so an empty string represents "no avatar" and the
    // existing controls (avatar URL field, upload button) continue to
    // work without a separate "null" code path.
    avatar: t.avatar ?? "",
    rating: clampRating(t.rating),
    photos: t.photos ?? [],
    videos: t.videos ?? [],
    order: String(t.order),
    published: t.published,
  };
}

/**
 * Editable testimonial form rendered as the **actual testimonial card**
 * the public page will show. Every field the card surfaces (tag, quote,
 * name, age, avatar) is edited in place, so the admin never has to
 * imagine the final rendering — the form IS the card.
 *
 * Order + Visibility don't appear on the card itself and stay as a
 * small meta strip beneath it.
 *
 * The card's Tailwind classes must stay in sync with
 * `apps/web/components/Testimonials/TestimonialsReviewsSection.tsx`
 * and `components/testimonials/TestimonialPreviewCard.tsx` — change
 * all three together when the public card design evolves.
 */
export function TestimonialForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: TestimonialDto;
}) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(
    initial ? formFromDto(initial) : emptyForm()
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isEdit = mode === "edit";

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const parsedAge = state.age.trim() === "" ? NaN : Number(state.age);
    const parsedOrder =
      state.order.trim() === "" ? undefined : Number(state.order);

    const payload: CreateTestimonialDto | UpdateTestimonialDto = {
      tag: state.tag.trim(),
      quote: state.quote.trim(),
      name: state.name.trim(),
      age: Number.isNaN(parsedAge) ? (undefined as unknown as number) : parsedAge,
      avatar: state.avatar.trim(),
      rating: clampRating(state.rating),
      // Always round-trip the media arrays so the admin can both save
      // the patient-uploaded files and add/remove their own. Sending
      // them explicitly (even when empty) is fine because the API
      // treats `[]` as "no media" and a missing key as "don't touch".
      photos: state.photos,
      videos: state.videos,
      order: parsedOrder,
      published: state.published,
    };

    startTransition(async () => {
      try {
        if (isEdit && initial) {
          await testimonialsApi.update(
            initial.id,
            payload as UpdateTestimonialDto
          );
        } else {
          await testimonialsApi.create(payload as CreateTestimonialDto);
        }
        router.push("/testimonials");
        router.refresh();
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.fieldErrors) setErrors(err.fieldErrors);
          setFormError(err.message);
        } else {
          setFormError(
            err instanceof Error ? err.message : "Something went wrong"
          );
        }
      }
    });
  }

  const err = (field: string) => errors[field]?.[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/testimonials"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to testimonials
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/testimonials">
            <Button variant="ghost" size="sm" type="button">
              Cancel
            </Button>
          </Link>
          <Button size="sm" type="submit" disabled={isPending}>
            <Save className="h-4 w-4" />
            {isPending
              ? "Saving..."
              : isEdit
                ? "Save changes"
                : "Add testimonial"}
          </Button>
        </div>
      </div>

      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <div className="mx-auto max-w-xl">
        <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-wide text-gray-400">
          Edit the card directly — this is how it will appear on the public site
        </p>

        <EditableTestimonialCard
          state={state}
          onChange={updateField}
          errors={errors}
        />

        {/* Field-level error summary — the card itself only hints at
            invalid fields via a red border; full messages surface here so
            the admin sees the validation reason without hunting. */}
        {(err("name") ||
          err("age") ||
          err("tag") ||
          err("quote") ||
          err("avatar") ||
          err("rating")) && (
          <ul className="mt-3 space-y-1 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {err("name") ? <li>Name: {err("name")}</li> : null}
            {err("age") ? <li>Age: {err("age")}</li> : null}
            {err("tag") ? <li>Tag: {err("tag")}</li> : null}
            {err("quote") ? <li>Quote: {err("quote")}</li> : null}
            {err("avatar") ? <li>Avatar: {err("avatar")}</li> : null}
            {err("rating") ? <li>Rating: {err("rating")}</li> : null}
          </ul>
        )}

        <MetaStrip
          order={state.order}
          published={state.published}
          avatar={state.avatar}
          onChange={updateField}
          orderError={err("order")}
        />

        <PatientMediaCard
          photos={state.photos}
          videos={state.videos}
          onChangePhotos={(next) => updateField("photos", next)}
          onChangeVideos={(next) => updateField("videos", next)}
        />
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-6">
        <Link href="/testimonials">
          <Button variant="ghost" size="sm" type="button">
            Cancel
          </Button>
        </Link>
        <Button size="sm" type="submit" disabled={isPending}>
          <Save className="h-4 w-4" />
          {isPending
            ? "Saving..."
            : isEdit
              ? "Save changes"
              : "Add testimonial"}
        </Button>
      </div>
    </form>
  );
}

// ---------------- Editable card ----------------

function EditableTestimonialCard({
  state,
  onChange,
  errors,
}: {
  state: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  errors: FieldErrors;
}) {
  const has = (field: keyof FormState) => Boolean(errors[field]?.[0]);

  return (
    <article className="flex flex-col rounded-tl-[36px] rounded-br-[36px] rounded-tr-[12px] rounded-bl-[12px] bg-[#fafafa] p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <EditableStarRating
            value={state.rating}
            onChange={(next) => onChange("rating", next)}
            invalid={has("rating")}
          />
          <span className="text-[10px] leading-tight text-gray-400">
            Click a star to set 1–5 (saved with this testimonial).
          </span>
        </div>
        <input
          type="text"
          value={state.tag}
          onChange={(e) => onChange("tag", e.target.value)}
          placeholder="Patient"
          aria-label="Tag"
          required
          className={cn(
            "shrink-0 rounded-full border bg-transparent px-3 py-1 text-center text-xs font-medium text-gray-900 outline-none transition-colors",
            "focus:ring-2 focus:ring-primary/20",
            has("tag") ? "border-red-400" : "border-black",
            "w-[140px] max-w-[200px]"
          )}
        />
      </div>

      {/* Quote — editable in place. We don't wrap the textarea in literal
          quote marks while editing (breaks the text flow) but position two
          large decorative marks as background glyphs so the admin sees the
          final punctuation shape. */}
      <div className="relative mt-5 flex-1">
        <span
          aria-hidden
          className="pointer-events-none absolute -left-1 -top-3 select-none text-4xl leading-none text-gray-300"
        >
          &ldquo;
        </span>
        <textarea
          value={state.quote}
          onChange={(e) => onChange("quote", e.target.value)}
          placeholder="Write the patient's review in their own voice…"
          aria-label="Quote"
          required
          rows={5}
          className={cn(
            "w-full resize-y rounded-md bg-transparent px-3 py-2 text-sm leading-7 text-gray-900 md:text-base",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20",
            has("quote") && "ring-2 ring-red-300"
          )}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-3 right-0 select-none text-4xl leading-none text-gray-300"
        >
          &rdquo;
        </span>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
        <AvatarUpload
          value={state.avatar}
          onChange={(v) => onChange("avatar", v)}
          invalid={has("avatar")}
          fallbackName={state.name}
        />

        {/* Name + age sit tight together — same visual flow as the
            public card's `<p>{name} ({age})</p>`. Inputs use the `size`
            attribute to auto-fit their content so short names collapse
            naturally and the "(age)" chip hugs the end of the name. */}
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-1 gap-y-0 text-sm">
          <input
            type="text"
            value={state.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Patient name"
            aria-label="Name"
            required
            size={Math.min(Math.max(state.name.length || 12, 10), 28)}
            className={cn(
              "min-w-0 max-w-full border-b bg-transparent pb-0.5 font-semibold text-gray-900 outline-none transition-colors",
              has("name")
                ? "border-red-400"
                : "border-transparent focus:border-gray-300"
            )}
          />
          <span className="whitespace-nowrap font-medium text-gray-600">
            (
            <input
              type="number"
              min={1}
              max={120}
              value={state.age}
              onChange={(e) => onChange("age", e.target.value)}
              placeholder="age"
              aria-label="Age"
              required
              className={cn(
                "w-8 border-b bg-transparent pb-0.5 text-center font-medium text-gray-600 outline-none transition-colors",
                // Hide native number spinners; min/max already constrain
                // the value and the arrows don't fit the card typography.
                "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                has("age")
                  ? "border-red-400"
                  : "border-transparent focus:border-gray-300"
              )}
            />
            )
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * Interactive 5-star rating: click to set, hover to preview. Uses plain
 * SVG glyphs (not Lucide) so the client bundle stays light.
 */
function EditableStarRating({
  value,
  onChange,
  invalid,
}: {
  value: number;
  onChange: (next: number) => void;
  invalid?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div
      className={cn(
        "flex w-fit items-center gap-0.5 rounded-md p-0.5",
        invalid && "ring-2 ring-red-300"
      )}
      role="group"
      aria-label={`Star rating, currently ${value} of 5`}
      onMouseLeave={() => setHover(null)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= display;
        return (
          <button
            key={n}
            type="button"
            className="rounded p-0.5 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            aria-label={`Set rating to ${n} of 5 stars`}
            aria-current={value === n ? "true" : undefined}
          >
            <TestimonialStarGlyph filled={active} />
          </button>
        );
      })}
    </div>
  );
}

// ---------------- Avatar upload ----------------

function AvatarUpload({
  value,
  onChange,
  invalid,
  fallbackName,
}: {
  value: string;
  onChange: (next: string) => void;
  invalid: boolean;
  fallbackName: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const src = resolveAvatarUrl(value);

  async function handleFile(file: File) {
    setUploadError(null);
    setIsUploading(true);
    try {
      const result = await uploadsApi.image(file);
      onChange(result.url);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Upload failed";
      setUploadError(message);
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        aria-label={src ? "Change photo" : "Upload photo"}
        disabled={isUploading}
        className={cn(
          "group relative grid h-12 w-12 place-items-center overflow-hidden bg-gray-100 ring-1 transition",
          "rounded-tl-[12px] rounded-br-[12px] rounded-tr-[4px] rounded-bl-[4px]",
          invalid ? "ring-red-400" : "ring-black/5",
          "hover:ring-primary/40"
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0.2";
            }}
          />
        ) : (
          <span className="text-xs font-medium uppercase text-gray-400">
            {initials(fallbackName)}
          </span>
        )}

        <span
          className={cn(
            "absolute inset-0 grid place-items-center bg-black/50 text-white opacity-0 transition-opacity",
            "group-hover:opacity-100",
            isUploading && "opacity-100"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </span>
      </button>

      {value ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          disabled={isUploading}
          aria-label="Remove photo"
          className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-gray-400 shadow ring-1 ring-gray-200 transition hover:text-red-600"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {uploadError ? (
        <p className="absolute left-0 top-full mt-1 whitespace-nowrap text-[10px] text-red-600">
          {uploadError}
        </p>
      ) : null}
    </div>
  );
}

// ---------------- Meta strip (order + visibility + avatar URL fallback) ----------------

function MetaStrip({
  order,
  published,
  avatar,
  onChange,
  orderError,
}: {
  order: string;
  published: boolean;
  avatar: string;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  orderError?: string;
}) {
  return (
    <Card className="mt-6">
      <CardContent className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Card settings
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Order</Label>
            <Input
              type="number"
              min={0}
              value={order}
              onChange={(e) => onChange("order", e.target.value)}
              placeholder="auto"
              invalid={Boolean(orderError)}
            />
            {orderError ? (
              <p className="text-xs text-red-600">{orderError}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Lower shows first. Leave blank to append to the end.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Visibility</Label>
            <label className="flex h-9 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => onChange("published", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-gray-700">
                Published (shown on public page)
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Avatar URL</Label>
          <Input
            value={avatar}
            onChange={(e) => onChange("avatar", e.target.value)}
            placeholder="/uploads/patient.jpg or https://…"
          />
          <p className="text-[11px] text-gray-500">
            Click the photo above to upload, or paste any image URL here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------- Patient media (photos + videos) ----------------

const MAX_PHOTOS = 10;
const MAX_VIDEOS = 4;

/**
 * Optional media uploads attached to a testimonial. Used by the public
 * `/share-your-story` form to let patients send recovery shots / story
 * clips, and editable here so admins can curate that media (add new
 * items, remove unwanted ones, replace) before publishing.
 *
 * The card sits below `MetaStrip` because — unlike the in-card avatar
 * — these media don't appear on the public testimonial card itself;
 * they feed the "Hear From Our Clients" strip on `/testimonials` and
 * reappear in the admin listing for moderation.
 */
function PatientMediaCard({
  photos,
  videos,
  onChangePhotos,
  onChangeVideos,
}: {
  photos: string[];
  videos: string[];
  onChangePhotos: (next: string[]) => void;
  onChangeVideos: (next: string[]) => void;
}) {
  return (
    <Card className="mt-6">
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Patient media
            </p>
            <p className="mt-0.5 text-[11px] text-gray-500">
              Photos and videos attached to this testimonial. They power
              the "Hear From Our Clients" strip on the public page.
            </p>
          </div>
        </div>

        <PhotoUploadGrid
          values={photos}
          onChange={onChangePhotos}
          max={MAX_PHOTOS}
        />

        <div className="border-t border-gray-100" />

        <VideoUploadGrid
          values={videos}
          onChange={onChangeVideos}
          max={MAX_VIDEOS}
        />
      </CardContent>
    </Card>
  );
}

function PhotoUploadGrid({
  values,
  onChange,
  max,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  max: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFiles(list: FileList) {
    if (values.length >= max) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      const remaining = max - values.length;
      const files = Array.from(list).slice(0, remaining);
      const uploaded: string[] = [];
      for (const file of files) {
        const result = await uploadsApi.image(file);
        uploaded.push(result.url);
      }
      onChange([...values, ...uploaded]);
    } catch (err) {
      setUploadError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Upload failed"
      );
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeAt(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  const reachedMax = values.length >= max;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label>Photos</Label>
        <span className="text-[11px] font-medium text-gray-500">
          {values.length} / {max}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {values.map((url, idx) => (
          <div
            key={`p-${idx}-${url}`}
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              aria-label={`Remove photo ${idx + 1}`}
              className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/95 text-gray-500 shadow ring-1 ring-gray-200 transition hover:text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}

        {!reachedMax ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-gray-200 bg-white text-gray-400 transition",
              "hover:border-primary/50 hover:text-primary",
              isUploading && "cursor-wait opacity-70"
            )}
            aria-label="Upload photos"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ImagePlus className="h-5 w-5" />
            )}
            <span className="text-[11px] font-semibold">
              {isUploading ? "Uploading…" : "Add photo"}
            </span>
          </button>
        ) : null}
      </div>

      {uploadError ? (
        <p className="mt-2 text-xs text-red-600">{uploadError}</p>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            void handleFiles(e.target.files);
          }
        }}
      />
    </div>
  );
}

function VideoUploadGrid({
  values,
  onChange,
  max,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  max: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);

  async function handleFiles(list: FileList) {
    if (values.length >= max) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      const remaining = max - values.length;
      const files = Array.from(list).slice(0, remaining);
      const uploaded: string[] = [];
      for (const [i, file] of files.entries()) {
        setProgressLabel(`Uploading ${i + 1} of ${files.length}…`);
        const result = await uploadsApi.video(file);
        uploaded.push(result.url);
      }
      onChange([...values, ...uploaded]);
    } catch (err) {
      setUploadError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Upload failed"
      );
    } finally {
      setIsUploading(false);
      setProgressLabel(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeAt(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  const reachedMax = values.length >= max;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label>Videos</Label>
        <span className="text-[11px] font-medium text-gray-500">
          {values.length} / {max}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {values.map((url, idx) => (
          <div
            key={`v-${idx}-${url}`}
            className="group relative aspect-video overflow-hidden rounded-lg bg-black ring-1 ring-gray-200"
          >
            <video
              src={url}
              preload="metadata"
              muted
              playsInline
              controls
              className="h-full w-full object-cover"
            />
            <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/15 opacity-0 transition group-hover:opacity-100">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-gray-900 shadow">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </span>
            </span>
            <button
              type="button"
              onClick={() => removeAt(idx)}
              aria-label={`Remove video ${idx + 1}`}
              className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/95 text-gray-500 shadow ring-1 ring-gray-200 transition hover:text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}

        {!reachedMax ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "flex aspect-video flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-gray-200 bg-white text-gray-400 transition",
              "hover:border-primary/50 hover:text-primary",
              isUploading && "cursor-wait opacity-70"
            )}
            aria-label="Upload videos"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Film className="h-5 w-5" />
            )}
            <span className="text-[11px] font-semibold">
              {isUploading ? (progressLabel ?? "Uploading…") : "Add video"}
            </span>
          </button>
        ) : null}
      </div>

      <p className="mt-2 text-[11px] text-gray-500">
        MP4, MOV, or WebM up to 50&nbsp;MB. Around 30 seconds works best.
      </p>

      {uploadError ? (
        <p className="mt-1 text-xs text-red-600">{uploadError}</p>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/ogg"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            void handleFiles(e.target.files);
          }
        }}
      />
    </div>
  );
}

// ---------------- Shared helpers ----------------

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
