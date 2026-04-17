"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import type {
  CreateTestimonialDto,
  TestimonialDto,
  UpdateTestimonialDto,
} from "@repo/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { ApiError, testimonialsApi, type FieldErrors } from "@/lib/api";
import { ImageInput } from "@/components/blogs/ImageInput";

type Mode = "create" | "edit";

type FormState = {
  tag: string;
  quote: string;
  name: string;
  age: string;
  avatar: string;
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
    order: "",
    published: true,
  };
}

function formFromDto(t: TestimonialDto): FormState {
  return {
    tag: t.tag,
    quote: t.quote,
    name: t.name,
    age: String(t.age),
    avatar: t.avatar,
    order: String(t.order),
    published: t.published,
  };
}

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

      <Card>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-[1fr,160px]">
            <div className="space-y-1.5">
              <Label required>Name</Label>
              <Input
                value={state.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Rahul Shah"
                invalid={Boolean(err("name"))}
                required
              />
              {err("name") ? (
                <p className="text-xs text-red-600">{err("name")}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label required>Age</Label>
              <Input
                type="number"
                min={1}
                max={120}
                value={state.age}
                onChange={(e) => updateField("age", e.target.value)}
                placeholder="30"
                invalid={Boolean(err("age"))}
                required
              />
              {err("age") ? (
                <p className="text-xs text-red-600">{err("age")}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label required>Tag</Label>
            <Input
              value={state.tag}
              onChange={(e) => updateField("tag", e.target.value)}
              placeholder="IT Professional"
              invalid={Boolean(err("tag"))}
              required
            />
            {err("tag") ? (
              <p className="text-xs text-red-600">{err("tag")}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Shown as a pill in the top-right of the card
                (e.g. &ldquo;Student&rdquo;, &ldquo;Senior Citizen&rdquo;).
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label required>Quote</Label>
            <Textarea
              value={state.quote}
              onChange={(e) => updateField("quote", e.target.value)}
              rows={4}
              placeholder="Write the review in the patient's own voice..."
              invalid={Boolean(err("quote"))}
              required
            />
            {err("quote") ? (
              <p className="text-xs text-red-600">{err("quote")}</p>
            ) : (
              <p className="text-xs text-gray-500">
                10–1000 characters. Will be rendered wrapped in quotes.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label required>Avatar</Label>
            <ImageInput
              value={state.avatar}
              onChange={(v) => updateField("avatar", v)}
              placeholder="/avatars/rahul.jpg"
              invalid={Boolean(err("avatar"))}
              required
            />
            {err("avatar") ? (
              <p className="text-xs text-red-600">{err("avatar")}</p>
            ) : null}
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
                  Lower shows first. Leave blank to append to the end.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Visibility</Label>
              <label className="flex h-9 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm">
                <input
                  type="checkbox"
                  checked={state.published}
                  onChange={(e) => updateField("published", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-gray-700">
                  Published (shown on public page)
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

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
