"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, Save, Trash2 } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/Card";
import { ApiError, blogsApi, type FieldErrors } from "@/lib/api";
import { iconFor } from "@/lib/icons";

type Mode = "create" | "edit";

type FormState = {
  // Hero
  title: string;
  slug: string;
  eyebrow: string;
  excerpt: string;
  imageSrc: string;
  author: string;
  tagsInput: string;
  published: boolean;

  // Introduction
  introEyebrow: string;
  introTitle: string;
  introDescription: string;
  introDescription2: string;
  introImageSrc: string;
  introImageAlt: string;

  // Causes (optional)
  causesEnabled: boolean;
  causesEyebrow: string;
  causesTitle: string;
  causesDescription: string;
  causesColumns: number;
  causesItems: SectionItem[];

  // Symptoms
  symptomsEyebrow: string;
  symptomsTitle: string;
  symptomsDescription: string;
  symptomsBullets: string[];
  symptomsImageSrc: string;
  symptomsImageAlt: string;
  symptomsFlipImage: boolean;

  // Solutions (optional)
  solutionsEnabled: boolean;
  solutionsEyebrow: string;
  solutionsTitle: string;
  solutionsDescription: string;
  solutionsItems: SectionItem[];

  // Conclusion (optional)
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
      blog.causesEyebrow && blog.causesTitle && (blog.causesItems?.length ?? 0) > 0
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

  const isEdit = mode === "edit";

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function updateArrayItem<T>(
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
      // Hero
      title: state.title.trim(),
      slug: state.slug.trim() || undefined,
      eyebrow: state.eyebrow.trim(),
      excerpt: state.excerpt.trim(),
      imageSrc: state.imageSrc.trim(),
      author: state.author.trim() || undefined,
      tags,
      published: state.published,

      // Intro
      introEyebrow: state.introEyebrow.trim(),
      introTitle: state.introTitle.trim(),
      introDescription: state.introDescription.trim(),
      introDescription2: state.introDescription2.trim() || null,
      introImageSrc: state.introImageSrc.trim(),
      introImageAlt: state.introImageAlt.trim() || null,

      // Causes (optional)
      causesEyebrow: state.causesEnabled ? state.causesEyebrow.trim() : null,
      causesTitle: state.causesEnabled ? state.causesTitle.trim() : null,
      causesDescription: state.causesEnabled
        ? state.causesDescription.trim()
        : null,
      causesColumns: state.causesEnabled ? state.causesColumns : null,
      causesItems: state.causesEnabled ? cleanItems(state.causesItems) : null,

      // Symptoms
      symptomsEyebrow: state.symptomsEyebrow.trim(),
      symptomsTitle: state.symptomsTitle.trim(),
      symptomsDescription: state.symptomsDescription.trim(),
      symptomsBullets: trimmedBullets,
      symptomsImageSrc: state.symptomsImageSrc.trim(),
      symptomsImageAlt: state.symptomsImageAlt.trim() || null,
      symptomsFlipImage: state.symptomsFlipImage,

      // Solutions (optional)
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

      // Conclusion (optional)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to blogs
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/blogs">
            <Button variant="ghost" size="sm" type="button">
              Cancel
            </Button>
          </Link>
          <Button size="sm" type="submit" disabled={isPending}>
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : isEdit ? "Save changes" : "Create blog"}
          </Button>
        </div>
      </div>

      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      {/* ------------------------------------------------ */}
      {/* 1. Hero */}
      {/* ------------------------------------------------ */}
      <SectionCard
        index={1}
        title="Hero"
        description="Top of the page: eyebrow, headline, cover image, author, date."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title" required error={err("title")}>
            <Input
              value={state.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Neck Pain in IT Professionals"
              invalid={Boolean(err("title"))}
              required
            />
          </Field>
          <Field
            label="Slug"
            hint="Auto-generated from title if left blank."
            error={err("slug")}
          >
            <Input
              value={state.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="neck-pain-in-it-professionals"
              invalid={Boolean(err("slug"))}
            />
          </Field>
          <Field label="Eyebrow" required error={err("eyebrow")}>
            <Input
              value={state.eyebrow}
              onChange={(e) => updateField("eyebrow", e.target.value)}
              placeholder="Postura Insights"
              invalid={Boolean(err("eyebrow"))}
              required
            />
          </Field>
          <Field
            label="Author"
            hint="Defaults to Dr. Priyanshi Pandya."
            error={err("author")}
          >
            <Input
              value={state.author}
              onChange={(e) => updateField("author", e.target.value)}
              placeholder="Dr. Priyanshi Pandya"
              invalid={Boolean(err("author"))}
            />
          </Field>
        </div>
        <Field
          label="Excerpt"
          hint="10-500 chars. Shown in the list + meta description."
          required
          error={err("excerpt")}
        >
          <Textarea
            value={state.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
            rows={3}
            invalid={Boolean(err("excerpt"))}
            required
          />
        </Field>
        <Field
          label="Cover image path"
          hint="/image.jpg for public assets, or full https:// URL."
          required
          error={err("imageSrc")}
        >
          <Input
            value={state.imageSrc}
            onChange={(e) => updateField("imageSrc", e.target.value)}
            placeholder="/blog1-details.jpg"
            invalid={Boolean(err("imageSrc"))}
            required
          />
        </Field>
        <ImagePreview src={state.imageSrc} />
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Tags"
            hint="Comma-separated. Example: neck-pain, ergonomics."
            error={err("tags")}
          >
            <Input
              value={state.tagsInput}
              onChange={(e) => updateField("tagsInput", e.target.value)}
              placeholder="neck-pain, ergonomics"
              invalid={Boolean(err("tags"))}
            />
          </Field>
          <label className="flex cursor-pointer items-start gap-3 pt-7">
            <input
              type="checkbox"
              checked={state.published}
              onChange={(e) => updateField("published", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/20"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900">
                Published
              </span>
              <p className="text-xs text-gray-500">
                Visible on the public site. Sets publish date automatically.
              </p>
            </div>
          </label>
        </div>
      </SectionCard>

      {/* ------------------------------------------------ */}
      {/* 2. Introduction */}
      {/* ------------------------------------------------ */}
      <SectionCard
        index={2}
        title="Introduction"
        description="Opening section: eyebrow, title, one or two paragraphs, and an illustration."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Eyebrow" required error={err("introEyebrow")}>
            <Input
              value={state.introEyebrow}
              onChange={(e) => updateField("introEyebrow", e.target.value)}
              placeholder="Intro"
              invalid={Boolean(err("introEyebrow"))}
              required
            />
          </Field>
          <Field label="Title" required error={err("introTitle")}>
            <Input
              value={state.introTitle}
              onChange={(e) => updateField("introTitle", e.target.value)}
              placeholder="Introduction"
              invalid={Boolean(err("introTitle"))}
              required
            />
          </Field>
        </div>
        <Field
          label="Primary paragraph"
          required
          error={err("introDescription")}
        >
          <Textarea
            value={state.introDescription}
            onChange={(e) => updateField("introDescription", e.target.value)}
            rows={4}
            invalid={Boolean(err("introDescription"))}
            required
          />
        </Field>
        <Field
          label="Secondary paragraph"
          hint="Optional."
          error={err("introDescription2")}
        >
          <Textarea
            value={state.introDescription2}
            onChange={(e) => updateField("introDescription2", e.target.value)}
            rows={3}
            invalid={Boolean(err("introDescription2"))}
          />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Image path"
            required
            error={err("introImageSrc")}
          >
            <Input
              value={state.introImageSrc}
              onChange={(e) => updateField("introImageSrc", e.target.value)}
              placeholder="/blog-intro.jpg"
              invalid={Boolean(err("introImageSrc"))}
              required
            />
          </Field>
          <Field label="Image alt" error={err("introImageAlt")}>
            <Input
              value={state.introImageAlt}
              onChange={(e) => updateField("introImageAlt", e.target.value)}
              placeholder="blog introduction"
              invalid={Boolean(err("introImageAlt"))}
            />
          </Field>
        </div>
        <ImagePreview src={state.introImageSrc} />
      </SectionCard>

      {/* ------------------------------------------------ */}
      {/* 3. Causes (optional) */}
      {/* ------------------------------------------------ */}
      <OptionalSection
        index={3}
        title="Causes"
        description="Grid of cards explaining root causes (e.g. 'Common Causes of Neck Pain')."
        enabled={state.causesEnabled}
        onToggle={(v) => updateField("causesEnabled", v)}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Eyebrow" required error={err("causesEyebrow")}>
            <Input
              value={state.causesEyebrow}
              onChange={(e) => updateField("causesEyebrow", e.target.value)}
              placeholder="Why Neck Pain is Common..."
              invalid={Boolean(err("causesEyebrow"))}
            />
          </Field>
          <Field label="Title" required error={err("causesTitle")}>
            <Input
              value={state.causesTitle}
              onChange={(e) => updateField("causesTitle", e.target.value)}
              placeholder="Common Causes of Neck Pain in Desk Jobs"
              invalid={Boolean(err("causesTitle"))}
            />
          </Field>
        </div>
        <Field
          label="Description"
          required
          error={err("causesDescription")}
        >
          <Textarea
            value={state.causesDescription}
            onChange={(e) => updateField("causesDescription", e.target.value)}
            rows={3}
            invalid={Boolean(err("causesDescription"))}
          />
        </Field>
        <Field label="Columns on desktop" error={err("causesColumns")}>
          <select
            value={state.causesColumns}
            onChange={(e) =>
              updateField("causesColumns", Number(e.target.value))
            }
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900/20"
          >
            {[2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} columns
              </option>
            ))}
          </select>
        </Field>
        <SectionItemsEditor
          items={state.causesItems}
          onUpdate={(i, patch) => updateSectionItem("causesItems", i, patch)}
          onAdd={() => addSectionItem("causesItems")}
          onRemove={(i) => removeSectionItem("causesItems", i)}
          errorFor={(i, f) => err(`causesItems.${i}.${f}`)}
        />
      </OptionalSection>

      {/* ------------------------------------------------ */}
      {/* 4. Symptoms */}
      {/* ------------------------------------------------ */}
      <SectionCard
        index={4}
        title="Symptoms"
        description="Bulleted list of warning signs + an illustration."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Eyebrow" required error={err("symptomsEyebrow")}>
            <Input
              value={state.symptomsEyebrow}
              onChange={(e) => updateField("symptomsEyebrow", e.target.value)}
              placeholder="Symptoms"
              invalid={Boolean(err("symptomsEyebrow"))}
              required
            />
          </Field>
          <Field label="Title" required error={err("symptomsTitle")}>
            <Input
              value={state.symptomsTitle}
              onChange={(e) => updateField("symptomsTitle", e.target.value)}
              placeholder="Common Symptoms to Watch"
              invalid={Boolean(err("symptomsTitle"))}
              required
            />
          </Field>
        </div>
        <Field
          label="Description"
          required
          error={err("symptomsDescription")}
        >
          <Textarea
            value={state.symptomsDescription}
            onChange={(e) =>
              updateField("symptomsDescription", e.target.value)
            }
            rows={3}
            invalid={Boolean(err("symptomsDescription"))}
            required
          />
        </Field>

        <div>
          <div className="flex items-center justify-between">
            <Label required>Bullets</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("symptomsBullets")}
            >
              <Plus className="h-3.5 w-3.5" />
              Add bullet
            </Button>
          </div>
          {err("symptomsBullets") ? (
            <p className="mt-1 text-xs text-red-600">
              {err("symptomsBullets")}
            </p>
          ) : null}
          <div className="mt-2 space-y-2">
            {state.symptomsBullets.map((b, idx) => {
              const bErr = err(`symptomsBullets.${idx}`);
              return (
                <div key={idx} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={b}
                      onChange={(e) =>
                        updateArrayItem("symptomsBullets", idx, e.target.value)
                      }
                      placeholder={`Bullet ${idx + 1}`}
                      invalid={Boolean(bErr)}
                    />
                    {bErr ? (
                      <p className="mt-1 text-xs text-red-600">{bErr}</p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem("symptomsBullets", idx)}
                    disabled={state.symptomsBullets.length === 1}
                    className="h-9 w-9 flex-shrink-0 text-gray-400 hover:text-red-600"
                    aria-label={`Remove bullet ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Image path"
            required
            error={err("symptomsImageSrc")}
          >
            <Input
              value={state.symptomsImageSrc}
              onChange={(e) =>
                updateField("symptomsImageSrc", e.target.value)
              }
              placeholder="/blog-symptoms.jpg"
              invalid={Boolean(err("symptomsImageSrc"))}
              required
            />
          </Field>
          <Field label="Image alt" error={err("symptomsImageAlt")}>
            <Input
              value={state.symptomsImageAlt}
              onChange={(e) =>
                updateField("symptomsImageAlt", e.target.value)
              }
              placeholder="common symptoms"
              invalid={Boolean(err("symptomsImageAlt"))}
            />
          </Field>
        </div>
        <ImagePreview src={state.symptomsImageSrc} />
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={state.symptomsFlipImage}
            onChange={(e) =>
              updateField("symptomsFlipImage", e.target.checked)
            }
            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/20"
          />
          <span className="text-sm text-gray-900">
            Flip image horizontally
          </span>
        </label>
      </SectionCard>

      {/* ------------------------------------------------ */}
      {/* 5. Solutions (optional) */}
      {/* ------------------------------------------------ */}
      <OptionalSection
        index={5}
        title="Solutions"
        description="How physiotherapy helps. Displayed as a stacked list alongside the title."
        enabled={state.solutionsEnabled}
        onToggle={(v) => updateField("solutionsEnabled", v)}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Eyebrow" required error={err("solutionsEyebrow")}>
            <Input
              value={state.solutionsEyebrow}
              onChange={(e) =>
                updateField("solutionsEyebrow", e.target.value)
              }
              placeholder="How Helps"
              invalid={Boolean(err("solutionsEyebrow"))}
            />
          </Field>
          <Field
            label="Title"
            hint="Use line breaks (Enter) to split the heading across lines."
            required
            error={err("solutionsTitle")}
          >
            <Textarea
              value={state.solutionsTitle}
              onChange={(e) =>
                updateField("solutionsTitle", e.target.value)
              }
              rows={3}
              placeholder={"Physiotherapy\nSolutions for\nNeck Pain"}
              invalid={Boolean(err("solutionsTitle"))}
            />
          </Field>
        </div>
        <Field
          label="Description"
          required
          error={err("solutionsDescription")}
        >
          <Textarea
            value={state.solutionsDescription}
            onChange={(e) =>
              updateField("solutionsDescription", e.target.value)
            }
            rows={3}
            invalid={Boolean(err("solutionsDescription"))}
          />
        </Field>
        <SectionItemsEditor
          items={state.solutionsItems}
          onUpdate={(i, patch) =>
            updateSectionItem("solutionsItems", i, patch)
          }
          onAdd={() => addSectionItem("solutionsItems")}
          onRemove={(i) => removeSectionItem("solutionsItems", i)}
          errorFor={(i, f) => err(`solutionsItems.${i}.${f}`)}
        />
      </OptionalSection>

      {/* ------------------------------------------------ */}
      {/* 6. Conclusion (optional) */}
      {/* ------------------------------------------------ */}
      <OptionalSection
        index={6}
        title="Conclusion"
        description="Closing paragraphs under a single heading."
        enabled={state.conclusionEnabled}
        onToggle={(v) => updateField("conclusionEnabled", v)}
      >
        <Field label="Title" error={err("conclusionTitle")}>
          <Input
            value={state.conclusionTitle}
            onChange={(e) => updateField("conclusionTitle", e.target.value)}
            placeholder="Conclusion"
            invalid={Boolean(err("conclusionTitle"))}
          />
        </Field>
        <div>
          <div className="flex items-center justify-between">
            <Label>Paragraphs</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem("conclusionParagraphs")}
            >
              <Plus className="h-3.5 w-3.5" />
              Add paragraph
            </Button>
          </div>
          <div className="mt-2 space-y-2">
            {state.conclusionParagraphs.map((p, idx) => {
              const pErr = err(`conclusionParagraphs.${idx}`);
              return (
                <div key={idx} className="flex gap-2">
                  <div className="flex-1">
                    <Textarea
                      value={p}
                      onChange={(e) =>
                        updateArrayItem(
                          "conclusionParagraphs",
                          idx,
                          e.target.value
                        )
                      }
                      rows={3}
                      placeholder={`Paragraph ${idx + 1}`}
                      invalid={Boolean(pErr)}
                    />
                    {pErr ? (
                      <p className="mt-1 text-xs text-red-600">{pErr}</p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      removeArrayItem("conclusionParagraphs", idx)
                    }
                    disabled={state.conclusionParagraphs.length === 1}
                    className="h-9 w-9 flex-shrink-0 text-gray-400 hover:text-red-600"
                    aria-label={`Remove paragraph ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </OptionalSection>

      <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-6">
        <Link href="/blogs">
          <Button variant="ghost" size="sm" type="button">
            Cancel
          </Button>
        </Link>
        <Button size="sm" type="submit" disabled={isPending}>
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : isEdit ? "Save changes" : "Create blog"}
        </Button>
      </div>
    </form>
  );
}

/* ----------------------------------------------------------------
 * Small presentational helpers (kept in-file so the form is
 * self-contained and easy to reason about).
 * --------------------------------------------------------------*/

function SectionCard({
  index,
  title,
  description,
  children,
}: {
  index: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-gray-900 text-xs font-semibold text-white">
            {index}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {description ? (
              <p className="text-xs text-gray-500">{description}</p>
            ) : null}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function OptionalSection({
  index,
  title,
  description,
  enabled,
  onToggle,
  children,
}: {
  index: number;
  title: string;
  description?: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-gray-900 text-xs font-semibold text-white">
              {index}
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {title}{" "}
                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  Optional
                </span>
              </h3>
              {description ? (
                <p className="text-xs text-gray-500">{description}</p>
              ) : null}
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/20"
            />
            <span className="text-xs font-medium text-gray-700">
              {enabled ? "Included" : "Hidden"}
            </span>
          </label>
        </div>

        {enabled ? (
          <div className="space-y-5">{children}</div>
        ) : (
          <p className="rounded-md bg-gray-50 p-3 text-xs text-gray-500">
            This section is hidden and won't render on the blog page.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function SectionItemsEditor({
  items,
  onUpdate,
  onAdd,
  onRemove,
  errorFor,
}: {
  items: SectionItem[];
  onUpdate: (index: number, patch: Partial<SectionItem>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  errorFor: (index: number, field: keyof SectionItem) => string | undefined;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label>Items</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
          Add item
        </Button>
      </div>

      <div className="mt-2 space-y-3">
        {items.map((it, idx) => {
          const titleErr = errorFor(idx, "title");
          const descErr = errorFor(idx, "description");
          const iconErr = errorFor(idx, "icon");
          const Icon = iconFor(it.icon);
          return (
            <div
              key={idx}
              className="rounded-md border border-gray-200 p-3 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gray-900 text-white">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    Item {idx + 1}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(idx)}
                  disabled={items.length === 1}
                  className="h-8 w-8 text-gray-400 hover:text-red-600"
                  aria-label={`Remove item ${idx + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label required>Item title</Label>
                  <Input
                    value={it.title}
                    onChange={(e) =>
                      onUpdate(idx, { title: e.target.value })
                    }
                    placeholder="Prolonged Sitting & Poor Posture"
                    invalid={Boolean(titleErr)}
                  />
                  {titleErr ? (
                    <p className="mt-1 text-xs text-red-600">{titleErr}</p>
                  ) : null}
                </div>
                <div>
                  <Label required>Icon</Label>
                  <select
                    value={it.icon}
                    onChange={(e) =>
                      onUpdate(idx, { icon: e.target.value as IconName })
                    }
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900/20"
                  >
                    {ICON_NAMES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  {iconErr ? (
                    <p className="mt-1 text-xs text-red-600">{iconErr}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <Label required>Description</Label>
                <Textarea
                  value={it.description}
                  onChange={(e) =>
                    onUpdate(idx, { description: e.target.value })
                  }
                  rows={2}
                  placeholder="Continuous screen use often leads to forward head posture..."
                  invalid={Boolean(descErr)}
                />
                {descErr ? (
                  <p className="mt-1 text-xs text-red-600">{descErr}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImagePreview({ src }: { src: string }) {
  if (!src) return null;
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const url = src.startsWith("http") ? src : `${base}${src}`;
  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="preview"
        className="aspect-[16/9] w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0.25";
        }}
      />
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
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
