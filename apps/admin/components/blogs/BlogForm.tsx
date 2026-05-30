"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  CheckCheckIcon,
  ChevronDown,
  ChevronLeft,
  Image as ImageIcon,
  Plus,
  Save,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";
import type {
  BlogDto,
  CreateBlogDto,
  IconName,
  SectionItem,
  UpdateBlogDto,
} from "@repo/types";
import { ICON_NAMES } from "@repo/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { ApiError, blogsApi, type FieldErrors } from "@/lib/api";
import { iconFor } from "@/lib/icons";
import { ImageInput } from "@/components/blogs/ImageInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────── */
/* Brand constants — match website exactly                     */
/* ─────────────────────────────────────────────────────────── */
const HERO_TEAL = "#007575";
const HERO_CREAM = "#FEF9E0";

/* ─────────────────────────────────────────────────────────── */
/* Types & helpers                                             */
/* ─────────────────────────────────────────────────────────── */
type Mode = "create" | "edit";

type FormState = {
  title: string;
  slug: string;
  eyebrow: string;
  excerpt: string;
  imageSrc: string;
  author: string;
  tagsInput: string;
  published: boolean;

  introEyebrow: string;
  introTitle: string;
  introDescription: string;
  introDescription2: string;
  introImageSrc: string;
  introImageAlt: string;

  causesEnabled: boolean;
  causesEyebrow: string;
  causesTitle: string;
  causesDescription: string;
  causesColumns: number;
  causesItems: SectionItem[];

  symptomsEyebrow: string;
  symptomsTitle: string;
  symptomsDescription: string;
  symptomsBullets: string[];
  symptomsImageSrc: string;
  symptomsImageAlt: string;
  symptomsFlipImage: boolean;

  solutionsEnabled: boolean;
  solutionsEyebrow: string;
  solutionsTitle: string;
  solutionsDescription: string;
  solutionsItems: SectionItem[];

  conclusionEnabled: boolean;
  conclusionTitle: string;
  conclusionParagraphs: string[];
};

function emptyItem(): SectionItem {
  return { title: "", description: "", icon: "Sparkles" };
}

function emptyForm(): FormState {
  return {
    title: "",
    slug: "",
    eyebrow: "",
    excerpt: "",
    imageSrc: "",
    author: "",
    tagsInput: "",
    published: false,

    introEyebrow: "Intro",
    introTitle: "Introduction",
    introDescription: "",
    introDescription2: "",
    introImageSrc: "/blog-intro.jpg",
    introImageAlt: "",

    causesEnabled: false,
    causesEyebrow: "",
    causesTitle: "",
    causesDescription: "",
    causesColumns: 4,
    causesItems: [emptyItem()],

    symptomsEyebrow: "Symptoms",
    symptomsTitle: "Common Symptoms to Watch",
    symptomsDescription: "",
    symptomsBullets: [""],
    symptomsImageSrc: "/blog-symptoms.jpg",
    symptomsImageAlt: "",
    symptomsFlipImage: false,

    solutionsEnabled: false,
    solutionsEyebrow: "",
    solutionsTitle: "",
    solutionsDescription: "",
    solutionsItems: [emptyItem()],

    conclusionEnabled: false,
    conclusionTitle: "Conclusion",
    conclusionParagraphs: [""],
  };
}

function formFromBlog(blog: BlogDto): FormState {
  const causesItems =
    blog.causesItems && blog.causesItems.length > 0
      ? blog.causesItems
      : [emptyItem()];
  const solutionsItems =
    blog.solutionsItems && blog.solutionsItems.length > 0
      ? blog.solutionsItems
      : [emptyItem()];

  return {
    title: blog.title,
    slug: blog.slug,
    eyebrow: blog.eyebrow,
    excerpt: blog.excerpt,
    imageSrc: blog.imageSrc,
    author: blog.author,
    tagsInput: blog.tags.join(", "),
    published: blog.published,

    introEyebrow: blog.introEyebrow,
    introTitle: blog.introTitle,
    introDescription: blog.introDescription,
    introDescription2: blog.introDescription2 ?? "",
    introImageSrc: blog.introImageSrc,
    introImageAlt: blog.introImageAlt ?? "",

    causesEnabled: Boolean(
      blog.causesEyebrow &&
        blog.causesTitle &&
        (blog.causesItems?.length ?? 0) > 0
    ),
    causesEyebrow: blog.causesEyebrow ?? "",
    causesTitle: blog.causesTitle ?? "",
    causesDescription: blog.causesDescription ?? "",
    causesColumns: blog.causesColumns ?? 4,
    causesItems,

    symptomsEyebrow: blog.symptomsEyebrow,
    symptomsTitle: blog.symptomsTitle,
    symptomsDescription: blog.symptomsDescription,
    symptomsBullets:
      blog.symptomsBullets.length > 0 ? blog.symptomsBullets : [""],
    symptomsImageSrc: blog.symptomsImageSrc,
    symptomsImageAlt: blog.symptomsImageAlt ?? "",
    symptomsFlipImage: blog.symptomsFlipImage,

    solutionsEnabled: Boolean(
      blog.solutionsEyebrow &&
        blog.solutionsTitle &&
        (blog.solutionsItems?.length ?? 0) > 0
    ),
    solutionsEyebrow: blog.solutionsEyebrow ?? "",
    solutionsTitle: blog.solutionsTitle ?? "",
    solutionsDescription: blog.solutionsDescription ?? "",
    solutionsItems,

    conclusionEnabled: blog.conclusionParagraphs.length > 0,
    conclusionTitle: blog.conclusionTitle ?? "Conclusion",
    conclusionParagraphs:
      blog.conclusionParagraphs.length > 0 ? blog.conclusionParagraphs : [""],
  };
}

/* ─────────────────────────────────────────────────────────── */
/* Main component                                              */
/* ─────────────────────────────────────────────────────────── */
export function BlogForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: BlogDto;
}) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(
    initial ? formFromBlog(initial) : emptyForm()
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [metaOpen, setMetaOpen] = useState(false);
  const [drawer, setDrawer] = useState<null | DrawerTarget>(null);

  const isEdit = mode === "edit";

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function updateArrayItem(
    key: "symptomsBullets" | "conclusionParagraphs",
    index: number,
    value: string
  ) {
    setState((s) => {
      const next = [...s[key]];
      next[index] = value;
      return { ...s, [key]: next };
    });
  }

  function addArrayItem(
    key: "symptomsBullets" | "conclusionParagraphs",
    initialValue = ""
  ) {
    setState((s) => ({ ...s, [key]: [...s[key], initialValue] }));
  }

  function removeArrayItem(
    key: "symptomsBullets" | "conclusionParagraphs",
    index: number
  ) {
    setState((s) => {
      if (s[key].length <= 1) return s;
      return { ...s, [key]: s[key].filter((_, i) => i !== index) };
    });
  }

  function updateSectionItem(
    key: "causesItems" | "solutionsItems",
    index: number,
    patch: Partial<SectionItem>
  ) {
    setState((s) => {
      const next = [...s[key]];
      next[index] = { ...next[index], ...patch };
      return { ...s, [key]: next };
    });
  }

  function addSectionItem(key: "causesItems" | "solutionsItems") {
    setState((s) => ({ ...s, [key]: [...s[key], emptyItem()] }));
  }

  function removeSectionItem(
    key: "causesItems" | "solutionsItems",
    index: number
  ) {
    setState((s) => {
      if (s[key].length <= 1) return s;
      return { ...s, [key]: s[key].filter((_, i) => i !== index) };
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const tags = state.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const trimmedBullets = state.symptomsBullets
      .map((b) => b.trim())
      .filter(Boolean);

    const trimmedConclusionParas = state.conclusionParagraphs
      .map((p) => p.trim())
      .filter(Boolean);

    function cleanItems(items: SectionItem[]): SectionItem[] {
      return items
        .map((it) => ({
          title: it.title.trim(),
          description: it.description.trim(),
          icon: it.icon,
        }))
        .filter((it) => it.title && it.description);
    }

    const payload: CreateBlogDto | UpdateBlogDto = {
      title: state.title.trim(),
      slug: state.slug.trim() || undefined,
      eyebrow: state.eyebrow.trim(),
      excerpt: state.excerpt.trim(),
      imageSrc: state.imageSrc.trim(),
      author: state.author.trim() || undefined,
      tags,
      published: state.published,

      introEyebrow: state.introEyebrow.trim(),
      introTitle: state.introTitle.trim(),
      introDescription: state.introDescription.trim(),
      introDescription2: state.introDescription2.trim() || null,
      introImageSrc: state.introImageSrc.trim(),
      introImageAlt: state.introImageAlt.trim() || null,

      causesEyebrow: state.causesEnabled ? state.causesEyebrow.trim() : null,
      causesTitle: state.causesEnabled ? state.causesTitle.trim() : null,
      causesDescription: state.causesEnabled
        ? state.causesDescription.trim()
        : null,
      causesColumns: state.causesEnabled ? state.causesColumns : null,
      causesItems: state.causesEnabled ? cleanItems(state.causesItems) : null,

      symptomsEyebrow: state.symptomsEyebrow.trim(),
      symptomsTitle: state.symptomsTitle.trim(),
      symptomsDescription: state.symptomsDescription.trim(),
      symptomsBullets: trimmedBullets,
      symptomsImageSrc: state.symptomsImageSrc.trim(),
      symptomsImageAlt: state.symptomsImageAlt.trim() || null,
      symptomsFlipImage: state.symptomsFlipImage,

      solutionsEyebrow: state.solutionsEnabled
        ? state.solutionsEyebrow.trim()
        : null,
      solutionsTitle: state.solutionsEnabled
        ? state.solutionsTitle.trim()
        : null,
      solutionsDescription: state.solutionsEnabled
        ? state.solutionsDescription.trim()
        : null,
      solutionsItems: state.solutionsEnabled
        ? cleanItems(state.solutionsItems)
        : null,

      conclusionTitle: state.conclusionEnabled
        ? state.conclusionTitle.trim()
        : null,
      conclusionParagraphs: state.conclusionEnabled
        ? trimmedConclusionParas
        : [],
    };

    startTransition(async () => {
      try {
        if (isEdit && initial) {
          await blogsApi.update(initial.id, payload as UpdateBlogDto);
        } else {
          await blogsApi.create(payload as CreateBlogDto);
        }
        router.push("/blogs");
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

  // Shared inline-input class strings (transparent, underline on focus)
  const inlineOnTeal =
    "w-full bg-transparent outline-none border-b border-transparent focus:border-white/30 placeholder:text-white/30 transition-colors";
  const inlineOnWhite =
    "w-full bg-transparent outline-none border-b border-transparent focus:border-gray-300 placeholder:text-gray-300 transition-colors";

  // Column count → Tailwind class (static list so Tailwind keeps them)
  const causesGridClass: Record<number, string> = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  // Display date (mirrors the website which shows `post.date`)
  const displayDate =
    (isEdit && initial?.date) ||
    (state.published
      ? new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Draft — date set on publish");

  /* ─────────────────────────────────────────────────── */
  /* Render — exact website structure                     */
  /* ─────────────────────────────────────────────────── */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawer(null);
    }
    if (drawer) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawer]);

  const drawerConfig = useMemo(() => {
    if (!drawer) return null;
    if (drawer === "cover") {
      return {
        title: "Cover image",
        srcKey: "imageSrc" as const,
        altKey: null,
        flipKey: null,
        placeholder: "/blog1-details.jpg",
        errorKey: "imageSrc" as const,
      };
    }
    if (drawer === "intro") {
      return {
        title: "Introduction image",
        srcKey: "introImageSrc" as const,
        altKey: "introImageAlt" as const,
        flipKey: null,
        placeholder: "/blog-intro.jpg",
        errorKey: "introImageSrc" as const,
      };
    }
    return {
      title: "Symptoms image",
      srcKey: "symptomsImageSrc" as const,
      altKey: "symptomsImageAlt" as const,
      flipKey: "symptomsFlipImage" as const,
      placeholder: "/blog-symptoms.jpg",
      errorKey: "symptomsImageSrc" as const,
    };
  }, [drawer]);

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-white">

      {/* ══════════ Sticky Admin Toolbar ══════════ */}
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to blogs
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMetaOpen((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
              metaOpen
                ? "border-primary/30 bg-primary/5 text-primary"
                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
            )}
          >
            <Settings className="h-3.5 w-3.5" />
            SEO & Settings
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform",
                metaOpen && "rotate-180"
              )}
            />
          </button>

          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-gray-300">
            <input
              type="checkbox"
              checked={state.published}
              onChange={(e) => set("published", e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary/20"
            />
            <span className={state.published ? "text-emerald-700" : "text-gray-500"}>
              {state.published ? "Published" : "Draft"}
            </span>
          </label>

          <Button size="sm" type="submit" disabled={isPending}>
            <Save className="h-4 w-4" />
            {isPending ? "Saving…" : isEdit ? "Save changes" : "Create blog"}
          </Button>
        </div>
      </div>

      {/* SEO & meta panel */}
      {metaOpen && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    SEO & Settings
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    These fields don&apos;t appear on the page but control
                    discoverability and sharing previews.
                  </p>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                  Optional tweaks
                </div>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="grid gap-4 sm:grid-cols-2">
                  <MetaField
                    label="Slug"
                    hint="Used in the URL. Leave blank to auto-generate from title."
                    error={err("slug")}
                  >
                    <Input
                      value={state.slug}
                      onChange={(e) => set("slug", e.target.value)}
                      placeholder="neck-pain-it-professionals"
                      invalid={Boolean(err("slug"))}
                    />
                  </MetaField>

                  <MetaField
                    label="Tags"
                    hint="Comma-separated. Keep them short and consistent."
                    error={err("tags")}
                  >
                    <Input
                      value={state.tagsInput}
                      onChange={(e) => set("tagsInput", e.target.value)}
                      placeholder="neck-pain, ergonomics"
                    />
                  </MetaField>

                  <div className="sm:col-span-2">
                    <MetaField
                      label="Excerpt"
                      hint="Used for meta description + cards. Keep it ~150–160 chars."
                      required
                      error={err("excerpt")}
                    >
                      <AutoGrowTextarea
                        value={state.excerpt}
                        onChange={(v) => set("excerpt", v)}
                        minRows={2}
                        maxRows={6}
                        required
                        className={cn(
                          "w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10",
                          Boolean(err("excerpt")) && "border-red-300 ring-1 ring-red-200"
                        )}
                        placeholder="Short summary shown in search / share previews…"
                      />
                    </MetaField>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Preview
                  </p>
                  <div className="mt-3 space-y-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <p className="text-[11px] font-semibold text-gray-500">
                        Badges
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {state.tagsInput
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .slice(0, 8)
                          .map((t, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary"
                            >
                              {t}
                            </span>
                          ))}
                        {!state.tagsInput.trim() ? (
                          <span className="text-xs text-gray-400">
                            Add tags to see badges
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <p className="text-[11px] font-semibold text-gray-500">
                        Meta snippet
                      </p>
                      <p className="mt-2 line-clamp-3 text-sm text-gray-700">
                        {state.excerpt.trim() || "Your excerpt will appear here."}
                      </p>
                      <p className="mt-2 text-[11px] text-gray-400">
                        Length: {state.excerpt.trim().length}/500
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {formError && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          § 1  HERO — replicates apps/web/app/blogs/[id]/page.tsx
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative">
        <SectionLabel index={1} label="Hero" floating light />

        <section className="relative pb-0">
          <div
            className="relative flex h-[90vh] items-center overflow-hidden rounded-bl-3xl rounded-br-[clamp(3rem,12vw,7.5rem)] pb-[clamp(8rem,22vw,14rem)] pt-10 md:h-screen md:pt-14"
            style={{ backgroundColor: HERO_TEAL }}
          >
            <div className="w-full px-4 text-center md:mx-32 md:text-left">
              {/* Eyebrow */}
              <div
                className="flex items-center justify-center gap-2 text-xs font-medium md:justify-start md:text-sm"
                style={{ color: HERO_CREAM }}
              >
                <span>✦</span>
                <input
                  value={state.eyebrow}
                  onChange={(e) => set("eyebrow", e.target.value)}
                  placeholder="Postura Insights"
                  required
                  className={cn(inlineOnTeal, "max-w-md text-xs md:text-sm")}
                  style={{ color: HERO_CREAM }}
                />
              </div>
              {err("eyebrow") && (
                <p className="mt-1 text-xs text-red-200">{err("eyebrow")}</p>
              )}

              {/* Title */}
              <textarea
                value={state.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Your blog title…"
                rows={3}
                required
                className={cn(
                  inlineOnTeal,
                  "mt-4 max-w-4xl resize-none font-cabinet text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-6xl lg:leading-[1.15]"
                )}
                style={{ color: HERO_CREAM }}
              />
              {err("title") && (
                <p className="mt-1 text-xs text-red-200">{err("title")}</p>
              )}

              {/* Date + Author row */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-20 md:justify-start md:gap-6">
                {/* Date */}
                <div className="flex flex-col items-center gap-3 md:flex-row">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg md:h-11 md:w-11"
                    style={{ backgroundColor: HERO_CREAM }}
                  >
                    <Calendar
                      className="h-[18px] w-[18px] md:h-5 md:w-5"
                      style={{ color: HERO_TEAL }}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </span>
                  <span
                    className="text-sm font-medium md:text-base"
                    style={{ color: HERO_CREAM }}
                  >
                    {displayDate}
                  </span>
                </div>

                {/* Author */}
                <div className="flex flex-col items-center gap-3 md:flex-row">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg md:h-11 md:w-11"
                    style={{ backgroundColor: HERO_CREAM }}
                  >
                    <User
                      className="h-[18px] w-[18px] md:h-5 md:w-5"
                      style={{ color: HERO_TEAL }}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </span>
                  <input
                    value={state.author}
                    onChange={(e) => set("author", e.target.value)}
                    placeholder="Dr. Priyanshi Pandya"
                    className={cn(inlineOnTeal, "max-w-xs text-sm font-medium md:text-base")}
                    style={{ color: HERO_CREAM }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cover image — overlapping the hero bottom */}
          <div className="relative z-10 mx-auto -mt-40 max-w-7xl px-4 md:-mt-60">
            <HoverImageEditor
              value={state.imageSrc}
              alt={state.title}
              invalid={Boolean(err("imageSrc"))}
              onRequestChange={() => setDrawer("cover")}
              className="relative h-[300px] w-full overflow-hidden rounded-tl-3xl rounded-tr-[84px] rounded-br-3xl rounded-bl-[84px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] md:h-[580px]"
            />
            {err("imageSrc") && (
              <p className="mt-2 text-xs text-red-600">{err("imageSrc")}</p>
            )}
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          § 2  INTRODUCTION — replicates CommonChallenges
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative pt-10 md:pt-20">
        <SectionLabel index={2} label="Introduction" />
        <section className="bg-white">
          <div className="mx-auto max-w-[90vw] py-12 md:px-4 md:py-10">
            <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
              {/* LEFT image with watermark */}
              <div className="relative md:pl-16">
                <HoverImageEditor
                  value={state.introImageSrc}
                  alt={state.introImageAlt}
                  invalid={Boolean(err("introImageSrc"))}
                  onRequestChange={() => setDrawer("intro")}
                  className="relative h-[52vh] w-full overflow-hidden rounded-tl-[84px] rounded-tr-xl rounded-br-[84px] rounded-bl-xl bg-gray-100 md:h-[68vh] md:w-[32vw]"
                />
                {/* Watermark overlay */}
                <div className="pointer-events-none absolute -left-6 bottom-0 md:left-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-svg.png"
                    alt=""
                    width={190}
                    height={320}
                    className="h-auto w-[150px] opacity-60 md:w-[220px]"
                  />
                </div>
              </div>

              {/* RIGHT content */}
              <div className="max-w-xl text-center md:text-left">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 md:justify-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/sparkle.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                  <input
                    value={state.introEyebrow}
                    onChange={(e) => set("introEyebrow", e.target.value)}
                    placeholder="Intro"
                    required
                    className={cn(inlineOnWhite, "max-w-xs text-primary")}
                  />
                </div>

                <textarea
                  value={state.introTitle}
                  onChange={(e) => set("introTitle", e.target.value)}
                  placeholder="Introduction title…"
                  rows={2}
                  required
                  className={cn(
                    inlineOnWhite,
                    "mt-2 resize-none font-cabinet text-3xl font-bold tracking-tight text-gray-900 md:text-5xl"
                  )}
                />

                <textarea
                  value={state.introDescription}
                  onChange={(e) => set("introDescription", e.target.value)}
                  placeholder="Primary paragraph…"
                  rows={5}
                  required
                  className={cn(
                    inlineOnWhite,
                    "mt-4 resize-none text-sm leading-6 text-gray-500"
                  )}
                />

                <textarea
                  value={state.introDescription2}
                  onChange={(e) => set("introDescription2", e.target.value)}
                  placeholder="Secondary paragraph (optional)…"
                  rows={4}
                  className={cn(
                    inlineOnWhite,
                    "mt-5 resize-none text-sm leading-6 text-gray-500 md:mt-6"
                  )}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          § 3  CAUSES (optional) — replicates WhyChooseUs
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative pt-5 md:pt-10">
        <SectionLabel
          index={3}
          label="Causes"
          optional
          rightSlot={
            <OptionalToggle
              enabled={state.causesEnabled}
              onToggle={(v) => set("causesEnabled", v)}
            />
          }
        />

        {state.causesEnabled ? (
          <section className="bg-white">
            <div className="mx-auto max-w-[90vw] py-16 md:px-4 md:py-10">
              {/* Heading split */}
              <div className="grid gap-3 md:grid-cols-[1fr,1.2fr] md:items-end md:gap-20">
                <div className="text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-primary md:justify-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/sparkle.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                    <input
                      value={state.causesEyebrow}
                      onChange={(e) => set("causesEyebrow", e.target.value)}
                      placeholder="Why Neck Pain is Common…"
                      className={cn(inlineOnWhite, "max-w-md")}
                    />
                  </div>
                  <AutoGrowTextarea
                    value={state.causesTitle}
                    onChange={(v) => set("causesTitle", v)}
                    placeholder="Common Causes of Neck Pain in Desk Jobs"
                    minRows={1}
                    maxRows={3}
                    className={cn(
                      inlineOnWhite,
                      "mt-4 resize-none font-cabinet text-3xl font-bold tracking-tight text-gray-900 md:text-5xl"
                    )}
                  />
                </div>

                <div className="md:justify-self-end w-full">
                  <AutoGrowTextarea
                    value={state.causesDescription}
                    onChange={(v) => set("causesDescription", v)}
                    placeholder="Description…"
                    minRows={2}
                    maxRows={6}
                    className={cn(
                      inlineOnWhite,
                      "w-full resize-none text-center text-sm leading-6 text-gray-500 md:text-left"
                    )}
                  />
                  {/* Column picker (admin-only control) */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 md:justify-start">
                    <span>Desktop columns:</span>
                    {[2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => set("causesColumns", n)}
                        className={cn(
                          "h-6 w-6 rounded border text-xs font-medium transition",
                          state.causesColumns === n
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 text-gray-500 hover:border-primary/50"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cards grid */}
              <div
                className={cn(
                  "mt-12 grid grid-cols-1 gap-6 md:items-stretch",
                  causesGridClass[state.causesColumns] ?? "md:grid-cols-4"
                )}
              >
                {state.causesItems.map((item, idx) => {
                  const Icon = iconFor(item.icon);
                  return (
                    <div
                      key={idx}
                      className="group/card relative flex h-full cursor-text flex-col items-center rounded-bl-xl rounded-br-[36px] rounded-tl-[36px] rounded-tr-xl bg-gray-50 px-4 py-4 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] md:min-h-[200px] md:items-start"
                    >
                      <button
                        type="button"
                        onClick={() => removeSectionItem("causesItems", idx)}
                        disabled={state.causesItems.length === 1}
                        className="absolute right-2 top-2 hidden h-6 w-6 items-center justify-center rounded-full text-red-400 hover:bg-red-50 group-hover/card:flex disabled:opacity-30"
                        aria-label="Remove card"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary text-white">
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="mt-6 flex w-full flex-col">
                        <input
                          value={item.title}
                          onChange={(e) =>
                            updateSectionItem("causesItems", idx, {
                              title: e.target.value,
                            })
                          }
                          placeholder="Card title…"
                          className={cn(
                            "w-full bg-transparent text-center text-lg font-semibold text-primary outline-none border-b border-transparent focus:border-primary/30 md:text-left"
                          )}
                        />
                        <AutoGrowTextarea
                          value={item.description}
                          onChange={(v) =>
                            updateSectionItem("causesItems", idx, {
                              description: v,
                            })
                          }
                          placeholder="Description…"
                          minRows={2}
                          maxRows={8}
                          className={cn(
                            "mt-4 w-full resize-none bg-transparent text-center text-sm leading-6 text-gray-500 outline-none border-b border-transparent focus:border-gray-300 md:text-left"
                          )}
                        />
                        <div className="mt-2 flex items-center justify-center gap-1.5 md:justify-start">
                          <span className="text-[10px] text-gray-400">Icon:</span>
                          <div className="w-44">
                            <Select
                              value={item.icon}
                              onValueChange={(v) =>
                                updateSectionItem("causesItems", idx, {
                                  icon: v as IconName,
                                })
                              }
                            >
                              <SelectTrigger className="h-8 border-0 bg-transparent px-0 text-[11px] text-gray-600 shadow-none focus-visible:ring-0">
                                <SelectValue placeholder="Select icon" />
                              </SelectTrigger>
                              <SelectContent>
                                {ICON_NAMES.map((n) => (
                                  <SelectItem key={n} value={n}>
                                    {n}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add card */}
                <button
                  type="button"
                  onClick={() => addSectionItem("causesItems")}
                  className="flex min-h-[200px] items-center justify-center gap-1.5 rounded-bl-xl rounded-br-[36px] rounded-tl-[36px] rounded-tr-xl border-2 border-dashed border-gray-200 bg-white text-sm text-gray-400 transition hover:border-primary/40 hover:text-primary"
                >
                  <Plus className="h-4 w-4" /> Add card
                </button>
              </div>
            </div>
          </section>
        ) : (
          <EmptySectionPlaceholder label="Causes section hidden — toggle on to include" />
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          § 4  SYMPTOMS — replicates KeyBenefits
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative pt-5 md:pt-10">
        <SectionLabel index={4} label="Symptoms" />
        <section className="bg-white">
          <div className="mx-auto max-w-[90vw] pb-20 pt-12 md:px-10 md:pt-10">
            <div className="grid items-center gap-5 md:flex md:items-center md:justify-between md:gap-14">
              {/* LEFT content */}
              <div className="w-full max-w-xl text-center md:text-left">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 md:justify-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/sparkle.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                  <input
                    value={state.symptomsEyebrow}
                    onChange={(e) => set("symptomsEyebrow", e.target.value)}
                    placeholder="Symptoms"
                    required
                    className={cn(inlineOnWhite, "max-w-xs text-primary")}
                  />
                </div>

                <AutoGrowTextarea
                  value={state.symptomsTitle}
                  onChange={(v) => set("symptomsTitle", v)}
                  placeholder="Common Symptoms to Watch"
                  required
                  minRows={1}
                  maxRows={3}
                  className={cn(
                    inlineOnWhite,
                    "mt-2 resize-none font-cabinet text-3xl font-bold tracking-tight text-gray-900 md:text-5xl"
                  )}
                />

                <AutoGrowTextarea
                  value={state.symptomsDescription}
                  onChange={(v) => set("symptomsDescription", v)}
                  placeholder="Description…"
                  required
                  minRows={2}
                  maxRows={7}
                  className={cn(
                    inlineOnWhite,
                    "mt-4 resize-none text-sm leading-6 text-gray-500"
                  )}
                />

                {/* Bullets with secondary (orange) checkmark circles — matches website exactly */}
                <ul className="mt-6 space-y-3 text-left text-sm text-gray-600 md:mt-7">
                  {state.symptomsBullets.map((b, idx) => (
                    <li key={idx} className="group/bullet flex gap-3">
                      <span
                        className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary"
                        aria-hidden
                      >
                        <CheckCheckIcon className="h-4 w-4 text-white" />
                      </span>
                      <input
                        value={b}
                        onChange={(e) =>
                          updateArrayItem("symptomsBullets", idx, e.target.value)
                        }
                        placeholder={`Symptom ${idx + 1}…`}
                        className={cn(inlineOnWhite, "flex-1")}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("symptomsBullets", idx)}
                        disabled={state.symptomsBullets.length === 1}
                        className="hidden text-gray-300 hover:text-red-500 group-hover/bullet:block disabled:opacity-30"
                        aria-label="Remove bullet"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={() => addArrayItem("symptomsBullets")}
                      className="ml-9 flex items-center gap-1.5 text-xs font-medium text-primary/60 transition hover:text-primary"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add bullet
                    </button>
                  </li>
                </ul>
              </div>

              {/* RIGHT image with watermark */}
              <div className="relative mt-8 w-full md:mt-0 md:w-[32vw] md:max-w-[520px] md:flex-shrink-0">
                <HoverImageEditor
                  value={state.symptomsImageSrc}
                  alt={state.symptomsImageAlt}
                  invalid={Boolean(err("symptomsImageSrc"))}
                  flipX={state.symptomsFlipImage}
                  onRequestChange={() => setDrawer("symptoms")}
                  className="relative h-[52vh] min-h-[320px] w-full overflow-hidden rounded-tl-xl rounded-tr-[84px] rounded-br-xl rounded-bl-[84px] bg-gray-100 md:h-[68vh]"
                />
                <div className="pointer-events-none absolute -left-5 bottom-0 md:-left-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-svg.png"
                    alt=""
                    width={190}
                    height={320}
                    className="h-auto w-[150px] opacity-60 md:w-[220px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          § 5  SOLUTIONS (optional) — replicates solutions section
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative pt-5 md:pt-10">
        <SectionLabel
          index={5}
          label="Solutions"
          optional
          rightSlot={
            <OptionalToggle
              enabled={state.solutionsEnabled}
              onToggle={(v) => set("solutionsEnabled", v)}
            />
          }
        />
        {state.solutionsEnabled ? (
          <section className="bg-white pt-10 md:pt-16">
            <div className="mx-auto max-w-[90vw] px-4">
              <div className="grid gap-10 md:grid-cols-12 md:items-start">
                {/* Left heading */}
                <div className="text-center md:col-span-5 md:text-left">
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 md:justify-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/sparkle.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                    <input
                      value={state.solutionsEyebrow}
                      onChange={(e) => set("solutionsEyebrow", e.target.value)}
                      placeholder="How Physio Helps…"
                      className={cn(inlineOnWhite, "max-w-xs text-primary")}
                    />
                  </div>
                  <AutoGrowTextarea
                    value={state.solutionsTitle}
                    onChange={(v) => set("solutionsTitle", v)}
                    placeholder={"Physiotherapy\nSolutions for\nNeck Pain"}
                    minRows={2}
                    maxRows={5}
                    className={cn(
                      inlineOnWhite,
                      "mt-4 resize-none whitespace-pre-line font-cabinet text-3xl font-bold tracking-tight text-gray-900 md:text-5xl"
                    )}
                  />
                  <AutoGrowTextarea
                    value={state.solutionsDescription}
                    onChange={(v) => set("solutionsDescription", v)}
                    placeholder="Description…"
                    minRows={2}
                    maxRows={7}
                    className={cn(
                      inlineOnWhite,
                      "mt-4 resize-none text-sm leading-6 text-gray-500 md:mt-6"
                    )}
                  />
                </div>

                {/* Right list */}
                <div className="md:col-span-7">
                  {state.solutionsItems.map((item, idx, arr) => {
                    const Icon = iconFor(item.icon);
                    return (
                      <div key={idx} className="py-3 md:py-4">
                        <div className="group/sol flex gap-5">
                          <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-primary">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <input
                              value={item.title}
                              onChange={(e) =>
                                updateSectionItem("solutionsItems", idx, {
                                  title: e.target.value,
                                })
                              }
                              placeholder="Solution title…"
                              className={cn(
                                "w-full bg-transparent text-base font-semibold text-gray-900 outline-none border-b border-transparent focus:border-gray-300 md:text-lg"
                              )}
                            />
                            <AutoGrowTextarea
                              value={item.description}
                              onChange={(v) =>
                                updateSectionItem("solutionsItems", idx, {
                                  description: v,
                                })
                              }
                              placeholder="Description…"
                              minRows={2}
                              maxRows={8}
                              className={cn(
                                "mt-2 w-full resize-none bg-transparent text-sm leading-6 text-gray-500 outline-none border-b border-transparent focus:border-gray-300"
                              )}
                            />
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="text-[10px] text-gray-400">
                                Icon:
                              </span>
                              <div className="w-44">
                                <Select
                                  value={item.icon}
                                  onValueChange={(v) =>
                                    updateSectionItem("solutionsItems", idx, {
                                      icon: v as IconName,
                                    })
                                  }
                                >
                                  <SelectTrigger className="h-8 border-0 bg-transparent px-0 text-[11px] text-gray-600 shadow-none focus-visible:ring-0">
                                    <SelectValue placeholder="Select icon" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ICON_NAMES.map((n) => (
                                      <SelectItem key={n} value={n}>
                                        {n}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  removeSectionItem("solutionsItems", idx)
                                }
                                disabled={state.solutionsItems.length === 1}
                                className="ml-auto hidden text-red-400 hover:text-red-600 group-hover/sol:block disabled:opacity-30"
                                aria-label="Remove solution"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                        {idx < arr.length - 1 && (
                          <div className="mt-6 h-px w-full bg-gray-200" />
                        )}
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => addSectionItem("solutionsItems")}
                    className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary/60 transition hover:text-primary"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add solution
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <EmptySectionPlaceholder label="Solutions section hidden — toggle on to include" />
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          § 6  CONCLUSION (optional) — replicates conclusion section
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative pt-5 md:pt-10">
        <SectionLabel
          index={6}
          label="Conclusion"
          optional
          rightSlot={
            <OptionalToggle
              enabled={state.conclusionEnabled}
              onToggle={(v) => set("conclusionEnabled", v)}
            />
          }
        />

        {state.conclusionEnabled ? (
          <section className="bg-white pb-16 pt-10 md:pb-20 md:pt-12">
            <div className="mx-auto max-w-[90vw] px-4 text-center md:text-left">
              <div className="h-px w-full bg-gray-200" />

              <input
                value={state.conclusionTitle}
                onChange={(e) => set("conclusionTitle", e.target.value)}
                placeholder="Conclusion"
                className={cn(
                  "mt-10 w-full bg-transparent font-cabinet text-4xl font-bold tracking-tight text-gray-900 outline-none border-b border-transparent focus:border-gray-300 md:mt-12 md:text-5xl"
                )}
              />

              <div className="mt-6 max-w-7xl space-y-5 text-sm leading-6 text-gray-500 md:mt-7">
                {state.conclusionParagraphs.map((p, idx) => (
                  <div key={idx} className="group/para flex gap-3">
                    <textarea
                      value={p}
                      onChange={(e) =>
                        updateArrayItem(
                          "conclusionParagraphs",
                          idx,
                          e.target.value
                        )
                      }
                      placeholder={`Paragraph ${idx + 1}…`}
                      rows={3}
                      className={cn(
                        "flex-1 resize-none bg-transparent text-sm leading-6 text-gray-500 outline-none border-b border-transparent focus:border-gray-200"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem("conclusionParagraphs", idx)
                      }
                      disabled={state.conclusionParagraphs.length === 1}
                      className="mt-1 hidden shrink-0 text-gray-300 hover:text-red-500 group-hover/para:block disabled:opacity-30"
                      aria-label="Remove paragraph"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("conclusionParagraphs")}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary/60 transition hover:text-primary"
                >
                  <Plus className="h-3.5 w-3.5" /> Add paragraph
                </button>
              </div>
            </div>
          </section>
        ) : (
          <EmptySectionPlaceholder label="Conclusion section hidden — toggle on to include" />
        )}
      </div>

      {/* ══════════ Sticky Bottom Save Bar ══════════ */}
      <div className="sticky bottom-0 z-20 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Discard & back
          </Link>
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={state.published}
                onChange={(e) => set("published", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              <span
                className={
                  state.published
                    ? "font-medium text-emerald-700"
                    : "text-gray-500"
                }
              >
                {state.published ? "Published" : "Draft"}
              </span>
            </label>
            <Button type="submit" disabled={isPending}>
              <Save className="h-4 w-4" />
              {isPending
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Create blog"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right-side image drawer */}
      {drawer && drawerConfig ? (
        <ImageDrawer
          title={drawerConfig.title}
          srcValue={state[drawerConfig.srcKey]}
          onSrcChange={(v) => set(drawerConfig.srcKey, v)}
          srcPlaceholder={drawerConfig.placeholder}
          srcError={err(drawerConfig.errorKey)}
          altLabel={drawerConfig.altKey ? "Alt text" : undefined}
          altValue={drawerConfig.altKey ? (state[drawerConfig.altKey] as string) : undefined}
          onAltChange={
            drawerConfig.altKey
              ? (v) => set(drawerConfig.altKey as any, v)
              : undefined
          }
          flipValue={
            drawerConfig.flipKey ? (state[drawerConfig.flipKey] as boolean) : undefined
          }
          onFlipChange={
            drawerConfig.flipKey
              ? (v) => set(drawerConfig.flipKey as any, v)
              : undefined
          }
          onClose={() => setDrawer(null)}
        />
      ) : null}
    </form>
  );
}

function AutoGrowTextarea({
  value,
  onChange,
  className,
  placeholder,
  required,
  minRows = 1,
  maxRows,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  minRows?: number;
  maxRows?: number;
  style?: React.CSSProperties;
}) {
  const [el, setEl] = useState<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!el) return;
    // Reset then size to content.
    el.style.height = "0px";
    const lineHeight = Number.parseFloat(
      window.getComputedStyle(el).lineHeight || "16"
    );
    const maxHeight =
      maxRows && lineHeight ? Math.round(maxRows * lineHeight) : undefined;
    const next = Math.max(el.scrollHeight, Math.round(minRows * lineHeight));
    el.style.height = `${Math.min(next, maxHeight ?? next)}px`;
  }, [el, value, minRows, maxRows]);

  return (
    <textarea
      ref={setEl}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      rows={minRows}
      className={cn("overflow-hidden", className)}
      style={style}
    />
  );
}

type DrawerTarget = "cover" | "intro" | "symptoms";

function ImageDrawer({
  title,
  srcValue,
  onSrcChange,
  srcPlaceholder,
  srcError,
  altLabel,
  altValue,
  onAltChange,
  flipValue,
  onFlipChange,
  onClose,
}: {
  title: string;
  srcValue: string;
  onSrcChange: (v: string) => void;
  srcPlaceholder: string;
  srcError?: string;
  altLabel?: string;
  altValue?: string;
  onAltChange?: (v: string) => void;
  flipValue?: boolean;
  onFlipChange?: (v: boolean) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-full w-[min(520px,92vw)] border-l border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            <p className="text-xs text-gray-500">
              Upload an image or paste a URL/path.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-[calc(100%-56px)] overflow-y-auto p-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <Label required>Image source</Label>
            <div className="mt-2">
              <ImageInput
                value={srcValue}
                onChange={onSrcChange}
                placeholder={srcPlaceholder}
                invalid={Boolean(srcError)}
                required
              />
            </div>
            {srcError ? (
              <p className="mt-2 text-xs text-red-600">{srcError}</p>
            ) : null}

            {altLabel && onAltChange ? (
              <div className="mt-4">
                <Label>{altLabel}</Label>
                <Input
                  value={altValue ?? ""}
                  onChange={(e) => onAltChange(e.target.value)}
                  placeholder="Describe the image for accessibility"
                />
              </div>
            ) : null}

            {onFlipChange !== undefined ? (
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(flipValue)}
                  onChange={(e) => onFlipChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                />
                Flip horizontally
              </label>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Floating numbered section label                              */
/* ─────────────────────────────────────────────────────────── */
function SectionLabel({
  index,
  label,
  optional,
  light,
  floating,
  rightSlot,
}: {
  index: number;
  label: string;
  optional?: boolean;
  light?: boolean;
  floating?: boolean;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-4 top-4 z-20 flex w-[calc(100%-2rem)] items-center justify-between sm:left-6 sm:w-[calc(100%-3rem)]",
        floating && "left-4 top-4"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium shadow-sm",
          light
            ? "border-white/20 bg-white/10 text-white backdrop-blur-sm"
            : "border-gray-200 bg-white text-gray-500"
        )}
      >
        <span
          className={cn(
            "grid h-4 w-4 place-items-center rounded-full text-[9px] font-bold",
            light ? "bg-white/30 text-white" : "bg-primary text-white"
          )}
        >
          {index}
        </span>
        {label}
        {optional && (
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[9px]",
              light ? "bg-white/10 text-white/70" : "bg-gray-100 text-gray-500"
            )}
          >
            Optional
          </span>
        )}
      </div>
      {rightSlot && <div className="pointer-events-auto">{rightSlot}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Image container with hover-reveal edit panel                 */
/* ─────────────────────────────────────────────────────────── */
function HoverImageEditor({
  value,
  alt,
  invalid,
  className,
  flipX,
  onRequestChange,
}: {
  value: string;
  alt?: string;
  invalid?: boolean;
  className?: string;
  flipX?: boolean;
  onRequestChange?: () => void;
}) {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const resolvedSrc = value
    ? value.startsWith("http")
      ? value
      : `${base}${value}`
    : "";

  return (
    <div
      className={cn(
        "group relative",
        className,
        invalid && "ring-2 ring-red-400"
      )}
    >
      {resolvedSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={alt || ""}
          className={cn(
            "h-full w-full object-cover",
            flipX && "scale-x-[-1]"
          )}
          onError={(e) => {
            // If the URL is wrong/missing, fade instead of hard-breaking the layout
            (e.currentTarget as HTMLImageElement).style.opacity = "0.25";
          }}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-100 text-gray-400">
          <ImageIcon className="h-10 w-10" />
          <p className="text-xs">Add an image</p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-end">
        <button
          type="button"
          className="pointer-events-auto rounded-full border border-white/30 bg-white/85 px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm backdrop-blur transition hover:bg-white"
          onClick={onRequestChange}
        >
          Change image
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Tiny helpers                                                 */
/* ─────────────────────────────────────────────────────────── */
function OptionalToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onToggle(!enabled)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1 text-[11px] font-semibold shadow-sm transition",
        enabled
          ? "border-primary/30 text-primary"
          : "border-gray-200 text-gray-500 hover:border-gray-300"
      )}
    >
      <span
        className={cn(
          "relative inline-flex h-4 w-7 items-center rounded-full transition-colors",
          enabled ? "bg-primary" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "inline-block h-3 w-3 translate-x-0 rounded-full bg-white shadow transition-transform",
            enabled ? "translate-x-3.5" : "translate-x-0.5"
          )}
        />
      </span>
      <span>{enabled ? "Included" : "Hidden"}</span>
    </button>
  );
}

function EmptySectionPlaceholder({ label }: { label: string }) {
  return (
    <div className="mx-auto my-8 max-w-[90vw] px-4">
      <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400">
        {label}
      </div>
    </div>
  );
}

function MetaField({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label required={required}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}
