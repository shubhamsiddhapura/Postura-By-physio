"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import type {
  CertificationDto,
  CreateCertificationDto,
  UpdateCertificationDto,
} from "@repo/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { ApiError, certificationsApi, type FieldErrors } from "@/lib/api";
import { ImageInput } from "@/components/blogs/ImageInput";

type Mode = "create" | "edit";

type FormState = {
  imageUrl: string;
  title: string;
  alt: string;
  order: string;
  published: boolean;
};

function emptyForm(): FormState {
  return {
    imageUrl: "",
    title: "",
    alt: "",
    order: "",
    published: true,
  };
}

function formFromCertification(c: CertificationDto): FormState {
  return {
    imageUrl: c.imageUrl,
    title: c.title,
    alt: c.alt,
    order: String(c.order),
    published: c.published,
  };
}

export function CertificationForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: CertificationDto;
}) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(
    initial ? formFromCertification(initial) : emptyForm()
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

    const payload: CreateCertificationDto | UpdateCertificationDto = {
      imageUrl: state.imageUrl.trim(),
      title: state.title.trim(),
      alt: state.alt.trim(),
      order: parsedOrder,
      published: state.published,
    };

    startTransition(async () => {
      try {
        if (isEdit && initial) {
          await certificationsApi.update(
            initial.id,
            payload as UpdateCertificationDto
          );
        } else {
          await certificationsApi.create(payload as CreateCertificationDto);
        }
        router.push("/certifications");
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
          href="/certifications"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to certifications
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/certifications">
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
                : "Add certification"}
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
            <Label required>Certificate image</Label>
            <ImageInput
              value={state.imageUrl}
              onChange={(v) => updateField("imageUrl", v)}
              placeholder="/certification-cupping.png"
              invalid={Boolean(err("imageUrl"))}
              required
            />
            {err("imageUrl") ? (
              <p className="text-xs text-red-600">{err("imageUrl")}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Upload the certificate scan/photo or paste a public URL.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label required>Title</Label>
            <Input
              value={state.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Certification of Cupping therapy"
              invalid={Boolean(err("title"))}
              required
            />
            {err("title") ? (
              <p className="text-xs text-red-600">{err("title")}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Caption shown below the image on the About page.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label required>Alt text</Label>
            <Input
              value={state.alt}
              onChange={(e) => updateField("alt", e.target.value)}
              placeholder="Certification of Cupping therapy"
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

          <div className="grid gap-5 md:grid-cols-2">
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
                  Lower numbers show first. Leave blank to append.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <label className="flex h-9 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm">
                <input
                  type="checkbox"
                  checked={state.published}
                  onChange={(e) =>
                    updateField("published", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-gray-700">
                  Published (shown on About page)
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-6">
        <Link href="/certifications">
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
              : "Add certification"}
        </Button>
      </div>
    </form>
  );
}
