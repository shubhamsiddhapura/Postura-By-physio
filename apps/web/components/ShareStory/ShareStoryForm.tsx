"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Film,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";
import type { CreateTestimonialDto } from "@repo/types";
import { cn } from "../../lib/utils";

type SubmitState = "idle" | "loading" | "success" | "error";

type FormState = {
  name: string;
  age: string;
  tag: string;
  quote: string;
  rating: number;
  avatar: string | null;
  photos: string[];
  videos: string[];
};

type FieldErrors = Partial<
  Record<"name" | "age" | "tag" | "quote" | "rating", string>
>;

const TAG_OPTIONS = [
  "Patient",
  "Working Professional",
  "Student",
  "Senior Citizen",
  "Athlete",
  "Home Maker",
  "Other",
] as const;

const MAX_PHOTOS = 6;
const MAX_VIDEOS = 2;

const fieldClass =
  "w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary";
const inputBase = `h-11 ${fieldClass}`;

/**
 * Public testimonial submission form rendered by the
 * `/share-your-story` page. Uploads each file as it's chosen so the
 * final POST to `/api/testimonials` only carries URLs.
 *
 * Submissions default to `published: false` — the admin reviews each
 * story in the dashboard before it appears on the public testimonials
 * page.
 */
export function ShareStoryForm() {
  const [state, setState] = useState<FormState>({
    name: "",
    age: "",
    tag: "",
    quote: "",
    rating: 5,
    avatar: null,
    photos: [],
    videos: [],
  });
  const [customTag, setCustomTag] = useState("");
  const [touched, setTouched] = useState<
    Partial<Record<keyof FieldErrors, boolean>>
  >({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const errors: FieldErrors = useMemo(() => {
    const e: FieldErrors = {};
    const name = state.name.trim();
    const ageNum = state.age.trim() === "" ? NaN : Number(state.age);
    const quote = state.quote.trim();
    const tag = effectiveTag(state.tag, customTag);

    if (!name) e.name = "Please tell us your name.";
    else if (name.length < 2) e.name = "Name looks too short.";

    if (Number.isNaN(ageNum)) e.age = "Please enter your age.";
    else if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120)
      e.age = "Age must be between 1 and 120.";

    if (!tag) e.tag = "Please choose how you’d like to be described.";

    if (!quote) e.quote = "Please share your experience.";
    else if (quote.length < 10)
      e.quote = "Tell us a bit more — at least 10 characters.";

    if (state.rating < 1 || state.rating > 5)
      e.rating = "Please pick a star rating.";

    return e;
  }, [state, customTag]);

  const isValid = Object.keys(errors).length === 0;

  const showError = (key: keyof FieldErrors) =>
    Boolean(attemptedSubmit || touched[key]);

  async function submit() {
    if (submitState === "loading") return;
    setAttemptedSubmit(true);
    setSubmitError(null);
    if (!isValid) return;

    const tag = effectiveTag(state.tag, customTag);
    const payload: CreateTestimonialDto = {
      tag,
      quote: state.quote.trim(),
      name: state.name.trim(),
      age: Number(state.age),
      rating: state.rating,
      avatar: state.avatar || null,
      photos: state.photos,
      videos: state.videos,
      // Public submissions are unpublished by default — the admin
      // reviews each story before it goes live.
      published: false,
    };

    setSubmitState("loading");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };
      if (!res.ok || data.success === false) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  function reset() {
    setState({
      name: "",
      age: "",
      tag: "",
      quote: "",
      rating: 5,
      avatar: null,
      photos: [],
      videos: [],
    });
    setCustomTag("");
    setTouched({});
    setAttemptedSubmit(false);
    setSubmitError(null);
    setSubmitState("idle");
  }

  if (submitState === "success") {
    return <SuccessCard onReset={reset} />;
  }

  return (
    <div className="rounded-tl-[36px] rounded-br-[36px] rounded-bl-[12px] rounded-tr-[12px] bg-[#fafafa] p-6 md:p-10">
      <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
        Tell Us About Your Experience
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        All fields marked with{" "}
        <span className="text-red-500">*</span> are required. Photos and
        videos are completely optional.
      </p>

      <form
        className="mt-8 space-y-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        

        <div className="grid gap-4 md:grid-cols-2">
        <RatingField
          value={state.rating}
          onChange={(v) => update("rating", v)}
          invalid={Boolean(errors.rating) && showError("rating")}
          error={showError("rating") ? errors.rating : undefined}
        />
          <FieldShell
            label="Your Name"
            required
            error={showError("name") ? errors.name : undefined}
          >
            <input
              type="text"
              value={state.name}
              onChange={(e) => update("name", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              placeholder="e.g. Rahul Shah"
              className={cn(
                inputBase,
                errors.name && showError("name")
                  ? "border-red-500 focus:border-red-500"
                  : ""
              )}
              aria-invalid={Boolean(errors.name) && showError("name")}
            />
          </FieldShell>

          <FieldShell
            label="Age"
            required
            error={showError("age") ? errors.age : undefined}
          >
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              value={state.age}
              onChange={(e) => update("age", e.target.value.replace(/\D/g, ""))}
              onBlur={() => setTouched((t) => ({ ...t, age: true }))}
              placeholder="e.g. 32"
              className={cn(
                inputBase,
                "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                errors.age && showError("age")
                  ? "border-red-500 focus:border-red-500"
                  : ""
              )}
              aria-invalid={Boolean(errors.age) && showError("age")}
            />
          </FieldShell>
        </div>

        <TagField
          value={state.tag}
          onChange={(v) => update("tag", v)}
          customTag={customTag}
          onCustomChange={setCustomTag}
          invalid={Boolean(errors.tag) && showError("tag")}
          error={showError("tag") ? errors.tag : undefined}
          onTouch={() => setTouched((t) => ({ ...t, tag: true }))}
        />

        <FieldShell
          label="Your Story"
          required
          error={showError("quote") ? errors.quote : undefined}
          hint={`${state.quote.length} / 1000`}
        >
          <textarea
            value={state.quote}
            onChange={(e) => update("quote", e.target.value.slice(0, 1000))}
            onBlur={() => setTouched((t) => ({ ...t, quote: true }))}
            placeholder="What were you experiencing before? How did sessions with us help? What does your day-to-day feel like now?"
            rows={6}
            className={cn(
              "w-full resize-y rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm leading-7 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary",
              errors.quote && showError("quote")
                ? "border-red-500 focus:border-red-500"
                : ""
            )}
            aria-invalid={Boolean(errors.quote) && showError("quote")}
          />
        </FieldShell>

        <AvatarField
          value={state.avatar}
          onChange={(v) => update("avatar", v)}
          fallbackName={state.name}
        />

        <PhotosField
          values={state.photos}
          onChange={(v) => update("photos", v)}
        />

        <VideosField
          values={state.videos}
          onChange={(v) => update("videos", v)}
        />

        {submitError ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </p>
        ) : null}

        <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            By submitting, you agree to let Postura by Physio publish your
            story (after review) on our website and social channels.
          </p>
          <SubmitButton loading={submitState === "loading"} />
        </div>
      </form>
    </div>
  );
}

// ---------- Sub-components ----------

function FieldShell({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-800">
          {label}
          {required ? <span className="ml-0.5 text-red-500">*</span> : null}
        </label>
        {hint ? (
          <span className="text-[11px] font-medium text-gray-400">{hint}</span>
        ) : null}
      </div>
      <div className="mt-2">{children}</div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

function RatingField({
  value,
  onChange,
  invalid,
  error,
}: {
  value: number;
  onChange: (v: number) => void;
  invalid: boolean;
  error?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  return (
    <div>
      <label className="text-sm font-semibold text-gray-800">
        How would you rate your experience?
        <span className="ml-0.5 text-red-500">*</span>
      </label>
      <div
        className={cn(
          "mt-3 inline-flex w-fit items-center gap-1 rounded-2xl bg-white px-3 py-2 ring-1 ring-gray-200",
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
              onMouseEnter={() => setHover(n)}
              onClick={() => onChange(n)}
              className="rounded-lg p-1 transition hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
              aria-label={`Rate ${n} of 5`}
              aria-current={value === n ? "true" : undefined}
            >
              <Star
                className={cn(
                  "h-7 w-7 transition",
                  active
                    ? "fill-[#FF9000] text-[#FF9000]"
                    : "fill-gray-200 text-gray-200"
                )}
                strokeWidth={0}
              />
            </button>
          );
        })}
        <span className="ml-2 text-sm font-medium text-gray-500">
          {value} / 5
        </span>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

function TagField({
  value,
  onChange,
  customTag,
  onCustomChange,
  invalid,
  error,
  onTouch,
}: {
  value: string;
  onChange: (v: string) => void;
  customTag: string;
  onCustomChange: (v: string) => void;
  invalid: boolean;
  error?: string;
  onTouch: () => void;
}) {
  const isOther = value === "Other";
  return (
    <FieldShell label="How would you describe yourself?" required error={error}>
      <div className="flex flex-wrap gap-2">
        {TAG_OPTIONS.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                onTouch();
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
                selected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:text-primary",
                invalid && !selected && "border-red-300"
              )}
              aria-pressed={selected}
            >
              {option}
            </button>
          );
        })}
      </div>
      {isOther ? (
        <input
          type="text"
          value={customTag}
          onChange={(e) => onCustomChange(e.target.value.slice(0, 80))}
          placeholder="Describe yourself in a few words (e.g. ‘New mom’)"
          className={cn(inputBase, "mt-3")}
          aria-label="Custom description"
        />
      ) : null}
    </FieldShell>
  );
}

function AvatarField({
  value,
  onChange,
  fallbackName,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  fallbackName: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploadError(null);
    setIsUploading(true);
    try {
      const url = await uploadFile("/api/uploads", file);
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <FieldShell
      label="Your Profile Photo"
      hint="Optional"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          aria-label={value ? "Change profile photo" : "Upload profile photo"}
          className={cn(
            "group relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden bg-white ring-1 ring-gray-200 transition",
            "rounded-tl-[18px] rounded-br-[18px] rounded-tr-[6px] rounded-bl-[6px]",
            "hover:ring-primary/40"
          )}
        >
          {value ? (
            <span className="absolute inset-0">
              <Image
                src={value}
                alt={
                  fallbackName.trim()
                    ? `${fallbackName} profile photo`
                    : "Uploaded profile photo"
                }
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            </span>
          ) : fallbackName.trim() ? (
            <span className="text-base font-semibold uppercase text-gray-400">
              {initials(fallbackName)}
            </span>
          ) : (
            <User className="h-7 w-7 text-gray-300" />
          )}
          <span
            className={cn(
              "absolute inset-0 grid place-items-center bg-black/50 text-white opacity-0 transition-opacity",
              "group-hover:opacity-100",
              isUploading && "opacity-100"
            )}
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-800">
            Add a face to your story
          </p>
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG, or WebP up to 5&nbsp;MB. If you skip this, we&rsquo;ll
            show your initials inside a friendly avatar.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-primary/40 hover:text-primary disabled:opacity-60"
            >
              <Camera className="h-3.5 w-3.5" />
              {value ? "Replace photo" : "Upload photo"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange(null)}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 transition hover:border-red-200 hover:text-red-600 disabled:opacity-60"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            ) : null}
          </div>
          {uploadError ? (
            <p className="mt-2 text-xs font-medium text-red-600">
              {uploadError}
            </p>
          ) : null}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>
    </FieldShell>
  );
}

function PhotosField({
  values,
  onChange,
}: {
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    if (values.length >= MAX_PHOTOS) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      const remaining = MAX_PHOTOS - values.length;
      const list = Array.from(files).slice(0, remaining);
      const uploaded: string[] = [];
      for (const file of list) {
        const url = await uploadFile("/api/uploads", file);
        uploaded.push(url);
      }
      onChange([...values, ...uploaded]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeAt(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  const reachedMax = values.length >= MAX_PHOTOS;

  return (
    <FieldShell
      label="Add Photos"
      hint={`Optional · ${values.length}/${MAX_PHOTOS}`}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {values.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200"
          >
            <Image
              src={url}
              alt={`Uploaded photo ${idx + 1}`}
              fill
              sizes="(min-width: 768px) 160px, 40vw"
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              aria-label="Remove photo"
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-gray-500 shadow ring-1 ring-gray-200 transition hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {!reachedMax ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-gray-400 transition",
              "hover:border-primary/50 hover:text-primary",
              isUploading && "cursor-wait opacity-70"
            )}
            aria-label="Upload photos"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ImagePlus className="h-6 w-6" />
            )}
            <span className="text-xs font-semibold">
              {isUploading ? "Uploading…" : "Add photo"}
            </span>
          </button>
        ) : null}
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Recovery shots, before/after, sessions in progress — anything you
        feel comfortable sharing.
      </p>
      {uploadError ? (
        <p className="mt-1 text-xs font-medium text-red-600">{uploadError}</p>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            void handleFiles(e.target.files);
          }
        }}
      />
    </FieldShell>
  );
}

function VideosField({
  values,
  onChange,
}: {
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    if (values.length >= MAX_VIDEOS) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      const remaining = MAX_VIDEOS - values.length;
      const list = Array.from(files).slice(0, remaining);
      const uploaded: string[] = [];
      for (const [i, file] of list.entries()) {
        setProgressLabel(`Uploading ${i + 1} of ${list.length}…`);
        const url = await uploadFile("/api/uploads/video", file);
        uploaded.push(url);
      }
      onChange([...values, ...uploaded]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      setProgressLabel(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeAt(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  const reachedMax = values.length >= MAX_VIDEOS;

  return (
    <FieldShell
      label="Add Short Videos"
      hint={`Optional · ${values.length}/${MAX_VIDEOS}`}
    >
      <div className="space-y-3">
        {values.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative overflow-hidden rounded-2xl bg-black ring-1 ring-gray-200"
          >
            <video
              src={url}
              controls
              preload="metadata"
              className="h-56 w-full bg-black object-contain"
            />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              aria-label="Remove video"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-gray-500 shadow ring-1 ring-gray-200 transition hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {!reachedMax ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-white px-4 py-5 text-left transition",
              "hover:border-primary/50",
              isUploading && "cursor-wait opacity-70"
            )}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Film className="h-5 w-5" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-gray-900">
                {isUploading
                  ? (progressLabel ?? "Uploading…")
                  : "Upload a short clip"}
              </span>
              <span className="mt-0.5 block text-xs text-gray-500">
                MP4, MOV, or WebM up to 50&nbsp;MB. Around 30 seconds works
                best.
              </span>
            </span>
          </button>
        ) : null}
      </div>

      {uploadError ? (
        <p className="mt-2 text-xs font-medium text-red-600">{uploadError}</p>
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
    </FieldShell>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <div className="group relative inline-flex transform items-center self-end transition-transform duration-300 hover:scale-105">
      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-w-[170px] items-center justify-center gap-3 whitespace-nowrap rounded-full bg-secondary px-6 py-3 pr-11 text-xs font-semibold text-white shadow-sm transition hover:brightness-90 disabled:opacity-60 md:min-w-[200px] md:text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sharing…
          </>
        ) : (
          "Share My Story"
        )}
      </button>
      <span className="absolute -right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-[#FEF9E0]">
        <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-45" />
      </span>
    </div>
  );
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  // Soft scroll-into-view so users on mobile see the confirmation.
  useEffect(() => {
    document
      .getElementById("share-your-story")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="rounded-tl-[36px] rounded-br-[36px] rounded-bl-[12px] rounded-tr-[12px] bg-[#fafafa] p-8 text-center md:p-12">
      <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
      <h3 className="mt-6 text-2xl font-bold text-gray-900 md:text-3xl">
        Thank you for sharing your story!
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
        Your testimonial has been received. Our team will review it and
        publish it on the website soon. We&rsquo;re grateful you took the
        time to inspire someone else&rsquo;s journey.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
      >
        Share another story
      </button>
    </div>
  );
}

// ---------- Helpers ----------

function effectiveTag(selected: string, custom: string): string {
  if (selected === "Other") return custom.trim();
  return selected.trim();
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/**
 * Shared upload helper. Posts a single `File` to either `/api/uploads`
 * (images) or `/api/uploads/video` (videos) and returns the public URL.
 *
 * Both endpoints share the same response shape: `{ data: { url, ... } }`
 * on success and `{ error: string }` on failure.
 */
async function uploadFile(endpoint: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(endpoint, { method: "POST", body: formData });
  const json = (await res.json().catch(() => ({}))) as {
    data?: { url: string };
    error?: string;
    success?: boolean;
  };
  if (!res.ok || json.success === false || !json.data?.url) {
    throw new Error(json.error ?? "Upload failed.");
  }
  return json.data.url;
}
