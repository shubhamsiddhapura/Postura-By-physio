"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError, uploadsApi } from "@/lib/api";

/**
 * Dual-mode image field: paste an existing URL/path OR upload a file.
 *
 * On successful upload the returned public URL is written straight into
 * `value` via `onChange`, so the rest of the form treats it like any other
 * image path.
 */
export function ImageInput({
  value,
  onChange,
  placeholder = "/cover.jpg or https://…",
  invalid,
  required,
  disabled,
  id,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      // Reset the file input so the same file can be picked again if needed.
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          invalid={invalid}
          required={required}
          disabled={disabled || isUploading}
          className="flex-1"
        />
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            disabled={disabled || isUploading}
            aria-label="Clear image"
            className="h-9 w-9 flex-shrink-0 text-gray-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={disabled || isUploading}
          className="h-9 flex-shrink-0"
        >
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {isUploading ? "Uploading…" : "Upload"}
        </Button>
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
      </div>

      {uploadError ? (
        <p className="text-xs text-red-600">{uploadError}</p>
      ) : null}

      <ImagePreview src={value} />

      <p className="text-[11px] text-gray-400">
        Paste a URL, type a local path like <code>/image.jpg</code>, or upload
        a file (≤ 5MB — png, jpg, webp, gif, svg, avif).
      </p>
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
