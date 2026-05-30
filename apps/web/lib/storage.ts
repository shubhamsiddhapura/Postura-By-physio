import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Supabase Storage helpers for image uploads.
 *
 * Bucket name defaults to `blog-images` and is created on demand as a
 * PUBLIC bucket the first time a file is uploaded. Setting the env var
 * `SUPABASE_STORAGE_BUCKET` lets you override this.
 *
 * Only the web app (server-side) uses these helpers — the service-role
 * key never leaves the backend.
 */

export const BUCKET_NAME =
  process.env.SUPABASE_STORAGE_BUCKET ?? "blog-images";

/**
 * Videos live in their own bucket because (a) they need a much higher
 * per-file size limit than images and (b) it keeps thumbnails and listing
 * queries against `blog-images` cheap. Override with
 * `SUPABASE_VIDEO_BUCKET` if your Supabase project uses a different name.
 */
export const VIDEO_BUCKET_NAME =
  process.env.SUPABASE_VIDEO_BUCKET ?? "testimonial-videos";

/** Allowed image MIME types. Matches browser `<input accept>` below. */
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

/**
 * Allowed video MIME types for testimonial story uploads. Browser
 * `<input accept="video/*">` will surface anything in this list
 * natively; we keep it conservative so the bucket only stores codecs
 * that play in modern browsers without a transcoding step.
 */
export const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/quicktime", // iPhone .mov files
  "video/webm",
  "video/ogg",
]);

/** 5 MB cap. Bump later if you need larger assets. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * Videos are naturally larger than stills — 50 MB keeps us well under
 * Vercel's serverless body limit while accommodating ~30s of HD phone
 * footage. Patient testimonial clips should be brief regardless.
 */
export const MAX_VIDEO_UPLOAD_BYTES = 50 * 1024 * 1024;

/** Derive a safe extension from either the MIME type or the original name. */
export function extensionFor(mime: string, fallbackName?: string): string {
  const fromMime: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/avif": "avif",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
    "video/webm": "webm",
    "video/ogg": "ogv",
  };
  if (fromMime[mime]) return fromMime[mime];
  if (fallbackName) {
    const match = /\.([a-zA-Z0-9]{2,5})$/.exec(fallbackName);
    if (match) return match[1].toLowerCase();
  }
  return "bin";
}

const bucketReady: Record<string, boolean> = {};

/**
 * Make sure the target bucket exists, creating it as PUBLIC on first run.
 * Result is cached per-process per bucket so we only hit the Storage
 * admin API once for each bucket we touch.
 */
async function ensureBucket(
  bucket: string,
  fileSizeLimit: number
): Promise<void> {
  if (bucketReady[bucket]) return;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.storage.getBucket(bucket);
  if (!error && data) {
    bucketReady[bucket] = true;
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit,
  });
  // Treat "already exists" as success in case of a race.
  if (createError && !/already exists/i.test(createError.message)) {
    throw new Error(`Failed to create bucket: ${createError.message}`);
  }
  bucketReady[bucket] = true;
}

export type UploadResult = {
  url: string;
  path: string;
  size: number;
  mime: string;
};

/**
 * Upload a single buffer to a Supabase Storage bucket and return its
 * public URL. Generates a year/month scoped path with a random filename
 * so collisions are effectively impossible.
 */
async function uploadToBucket({
  bucket,
  fileSizeLimit,
  bytes,
  mime,
  originalName,
}: {
  bucket: string;
  fileSizeLimit: number;
  bytes: ArrayBuffer | Uint8Array;
  mime: string;
  originalName?: string;
}): Promise<UploadResult> {
  await ensureBucket(bucket, fileSizeLimit);
  const supabase = getSupabaseAdmin();

  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const ext = extensionFor(mime, originalName);
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  const path = `${yyyy}/${mm}/${id}.${ext}`;

  const buffer = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const size = buffer.byteLength;

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: mime,
    upsert: false,
    cacheControl: "31536000",
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path, size, mime };
}

/**
 * Upload a single image buffer to the `blog-images` bucket and return its
 * public URL.
 */
export function uploadImage({
  bytes,
  mime,
  originalName,
}: {
  bytes: ArrayBuffer | Uint8Array;
  mime: string;
  originalName?: string;
}): Promise<UploadResult> {
  return uploadToBucket({
    bucket: BUCKET_NAME,
    fileSizeLimit: MAX_UPLOAD_BYTES,
    bytes,
    mime,
    originalName,
  });
}

/**
 * Upload a single video buffer to the `testimonial-videos` bucket and
 * return its public URL. Used by the public share-your-story page so
 * patients can include short clips alongside their written review.
 */
export function uploadVideo({
  bytes,
  mime,
  originalName,
}: {
  bytes: ArrayBuffer | Uint8Array;
  mime: string;
  originalName?: string;
}): Promise<UploadResult> {
  return uploadToBucket({
    bucket: VIDEO_BUCKET_NAME,
    fileSizeLimit: MAX_VIDEO_UPLOAD_BYTES,
    bytes,
    mime,
    originalName,
  });
}
