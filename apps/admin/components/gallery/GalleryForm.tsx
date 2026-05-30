"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import type {
  CreateGalleryImageDto,
  GalleryCategory,
  GalleryImageDto,
  UpdateGalleryImageDto,
} from "@repo/types";
import { GALLERY_CATEGORIES, GALLERY_CATEGORY_LABELS } from "@repo/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { ApiError, galleryApi, type FieldErrors } from "@/lib/api";
import { ImageInput } from "@/components/blogs/ImageInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

type Mode = "create" | "edit";

type FormState = {
  url: string;
  alt: string;
  category: GalleryCategory;
  order: string;
};

function emptyForm(initialCategory?: GalleryCategory): FormState {
  return {
    url: "",
    alt: "",
    category: initialCategory ?? "physiotherapy",
    order: "",
  };
}

function formFromImage(image: GalleryImageDto): FormState {
  return {
    url: image.url,
    alt: image.alt,
    category: image.category,
    order: String(image.order),
  };
}

export function GalleryForm({
  mode,
  initial,
  defaultCategory,
}: {
  mode: Mode;
  initial?: GalleryImageDto;
  defaultCategory?: GalleryCategory;
}) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(
    initial ? formFromImage(initial) : emptyForm(defaultCategory)
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

    const trimmedOrder = state.order.trim();
    const parsedOrder = trimmedOrder === "" ? undefined : Number(trimmedOrder);

    const payload: CreateGalleryImageDto | UpdateGalleryImageDto = {
      url: state.url.trim(),
      alt: state.alt.trim(),
      category: state.category,
      order: parsedOrder,
    };

    startTransition(async () => {
      try {
        if (isEdit && initial) {
          await galleryApi.update(initial.id, payload as UpdateGalleryImageDto);
        } else {
          await galleryApi.create(payload as CreateGalleryImageDto);
        }
        router.push("/gallery");
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
          href="/gallery"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to gallery
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/gallery">
            <Button variant="ghost" size="sm" type="button">
              Cancel
            </Button>
          </Link>
          <Button size="sm" type="submit" disabled={isPending}>
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : isEdit ? "Save changes" : "Add image"}
          </Button>
        </div>
      </div>

      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <Card>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label required>Image</Label>
            <ImageInput
              value={state.url}
              onChange={(v) => updateField("url", v)}
              placeholder="/gallery/physio-new.jpg"
              invalid={Boolean(err("url"))}
              required
            />
            {err("url") ? (
              <p className="text-xs text-red-600">{err("url")}</p>
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label required>Category</Label>
              <Select
                value={state.category}
                onValueChange={(v) => updateField("category", v as GalleryCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {GALLERY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {GALLERY_CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err("category") ? (
                <p className="text-xs text-red-600">{err("category")}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label>Order</Label>
              <Input
                type="number"
                min={0}
                value={state.order}
                onChange={(e) => updateField("order", e.target.value)}
                placeholder="auto"
                invalid={Boolean(err("order"))}
              />
              {err("order") ? (
                <p className="text-xs text-red-600">{err("order")}</p>
              ) : (
                <p className="text-xs text-gray-500">
                  Lower numbers show first. Leave blank to append to the end.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label required>Alt text</Label>
            <Input
              value={state.alt}
              onChange={(e) => updateField("alt", e.target.value)}
              placeholder="Physiotherapy session on treatment table"
              invalid={Boolean(err("alt"))}
              required
            />
            {err("alt") ? (
              <p className="text-xs text-red-600">{err("alt")}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Short description for accessibility and SEO.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-6">
        <Link href="/gallery">
          <Button variant="ghost" size="sm" type="button">
            Cancel
          </Button>
        </Link>
        <Button size="sm" type="submit" disabled={isPending}>
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : isEdit ? "Save changes" : "Add image"}
        </Button>
      </div>
    </form>
  );
}
