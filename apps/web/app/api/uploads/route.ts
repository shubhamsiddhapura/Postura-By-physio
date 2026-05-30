import { NextRequest } from "next/server";
import { fail, handleError, ok } from "@/lib/api/response";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  uploadImage,
} from "@/lib/storage";

// Allow the Node.js runtime so Buffer/crypto work the same across platforms.
export const runtime = "nodejs";

/**
 * POST /api/uploads
 *
 * multipart/form-data with a single `file` field.
 * Returns the public URL to paste into any image field in the admin form.
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return fail(
        "Expected multipart/form-data with a `file` field",
        415
      );
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return fail("Missing file. Add a `file` field to the form data.", 400);
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return fail(
        `Unsupported image type: ${file.type || "unknown"}. Allowed: png, jpg, webp, gif, svg, avif.`,
        415
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return fail(
        `File too large. Max size is ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))}MB.`,
        413
      );
    }

    if (file.size === 0) {
      return fail("File is empty.", 400);
    }

    const bytes = await file.arrayBuffer();
    const result = await uploadImage({
      bytes,
      mime: file.type,
      originalName: file.name,
    });

    return ok(result, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
