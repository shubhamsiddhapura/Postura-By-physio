import { NextRequest } from "next/server";
import { fail, handleError, ok } from "@/lib/api/response";
import {
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_UPLOAD_BYTES,
  uploadVideo,
} from "@/lib/storage";

// Buffer/crypto require the Node.js runtime.
export const runtime = "nodejs";

/**
 * POST /api/uploads/video
 *
 * multipart/form-data with a single `file` field. Used by the public
 * share-your-story page so patients can attach short clips to their
 * testimonial. Returns a public URL to persist on the testimonial row.
 *
 * The 50MB cap matches the bucket's `fileSizeLimit` and is generous
 * enough for ~30s of HD phone footage; longer clips should be trimmed
 * client-side before upload.
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return fail("Expected multipart/form-data with a `file` field", 415);
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return fail("Missing file. Add a `file` field to the form data.", 400);
    }

    if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
      return fail(
        `Unsupported video type: ${file.type || "unknown"}. Allowed: mp4, mov, webm, ogg.`,
        415
      );
    }

    if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
      return fail(
        `Video too large. Max size is ${Math.round(
          MAX_VIDEO_UPLOAD_BYTES / (1024 * 1024)
        )}MB. Trim the clip and try again.`,
        413
      );
    }

    if (file.size === 0) {
      return fail("File is empty.", 400);
    }

    const bytes = await file.arrayBuffer();
    const result = await uploadVideo({
      bytes,
      mime: file.type,
      originalName: file.name,
    });

    return ok(result, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
