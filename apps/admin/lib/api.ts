import type {
  ApiResponse,
  AvailabilitySlotDto,
  BlockedDateDto,
  BlogDto,
  BookingDto,
  CertificationDto,
  CreateAvailabilitySlotDto,
  CreateBlockedDateDto,
  CreateBlogDto,
  CreateBookingDto,
  CreateCertificationDto,
  CreateGalleryImageDto,
  CreateTestimonialDto,
  GalleryImageDto,
  ListBlogsQuery,
  ListBookingsQuery,
  ListCertificationsQuery,
  ListGalleryQuery,
  ListTestimonialsQuery,
  TestimonialDto,
  UpdateBlogDto,
  UpdateBookingDto,
  UpdateCertificationDto,
  UpdateGalleryImageDto,
  UpdateTestimonialDto,
  UploadResultDto,
} from "@repo/types";

/**
 * Base URL of the web app that hosts the APIs. Comes from the shared
 * root-level .env (NEXT_PUBLIC_API_BASE_URL). Defaults to localhost:3000.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

// ---------- Shared ----------
export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  public readonly status: number;
  public readonly fieldErrors?: FieldErrors;

  constructor(message: string, status: number, fieldErrors?: FieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type ListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

async function request<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<{ data: T; meta?: ListMeta }> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const headers = new Headers(init?.headers);
  if (init?.json !== undefined) headers.set("Content-Type", "application/json");

  const res = await fetch(url, {
    ...init,
    headers,
    body:
      init?.json !== undefined
        ? JSON.stringify(init.json)
        : (init?.body as BodyInit | null | undefined),
    cache: "no-store",
  });

  const text = await res.text();
  let body: ApiResponse<T> & { meta?: ListMeta } & {
    issues?: { fieldErrors?: FieldErrors };
  };
  try {
    body = text ? JSON.parse(text) : ({} as never);
  } catch {
    throw new ApiError(`Unreadable response (${res.status})`, res.status);
  }

  if (!res.ok || body.success === false) {
    const errMsg =
      body && body.success === false ? body.error : `Request failed (${res.status})`;
    const fieldErrors =
      body && body.success === false && body.issues
        ? (body.issues as { fieldErrors?: FieldErrors }).fieldErrors
        : undefined;
    throw new ApiError(errMsg, res.status, fieldErrors);
  }

  return { data: body.data as T, meta: body.meta };
}

// ---------- Blogs ----------
function qs(params: Record<string, unknown> = {}): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    searchParams.set(key, String(value));
  }
  const s = searchParams.toString();
  return s ? `?${s}` : "";
}

export const blogsApi = {
  list: (query: ListBlogsQuery = {}) =>
    request<BlogDto[]>(
      `/api/blogs${qs(query as Record<string, unknown>)}`
    ),

  get: (idOrSlug: string) =>
    request<BlogDto>(`/api/blogs/${encodeURIComponent(idOrSlug)}`),

  create: (data: CreateBlogDto) =>
    request<BlogDto>("/api/blogs", { method: "POST", json: data }),

  update: (idOrSlug: string, data: UpdateBlogDto) =>
    request<BlogDto>(`/api/blogs/${encodeURIComponent(idOrSlug)}`, {
      method: "PATCH",
      json: data,
    }),

  remove: (idOrSlug: string) =>
    request<{ id: string; deleted: true }>(
      `/api/blogs/${encodeURIComponent(idOrSlug)}`,
      { method: "DELETE" }
    ),
};

// ---------- Bookings ----------
export const bookingsApi = {
  list: (query: ListBookingsQuery = {}) =>
    request<BookingDto[]>(
      `/api/bookings${qs(query as Record<string, unknown>)}`
    ),

  get: (id: string) =>
    request<BookingDto>(`/api/bookings/${encodeURIComponent(id)}`),

  create: (data: CreateBookingDto) =>
    request<BookingDto>("/api/bookings", { method: "POST", json: data }),

  update: (id: string, data: UpdateBookingDto) =>
    request<BookingDto>(`/api/bookings/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: data,
    }),

  remove: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/bookings/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),
};

// ---------- Testimonials ----------
export const testimonialsApi = {
  list: (query: ListTestimonialsQuery = {}) =>
    request<TestimonialDto[]>(
      `/api/testimonials${qs(query as Record<string, unknown>)}`
    ),

  get: (id: string) =>
    request<TestimonialDto>(`/api/testimonials/${encodeURIComponent(id)}`),

  create: (data: CreateTestimonialDto) =>
    request<TestimonialDto>("/api/testimonials", {
      method: "POST",
      json: data,
    }),

  update: (id: string, data: UpdateTestimonialDto) =>
    request<TestimonialDto>(`/api/testimonials/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: data,
    }),

  remove: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/testimonials/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),
};

// ---------- Gallery ----------
export const galleryApi = {
  list: (query: ListGalleryQuery = {}) =>
    request<GalleryImageDto[]>(
      `/api/gallery${qs(query as Record<string, unknown>)}`
    ),

  get: (id: string) =>
    request<GalleryImageDto>(`/api/gallery/${encodeURIComponent(id)}`),

  create: (data: CreateGalleryImageDto) =>
    request<GalleryImageDto>("/api/gallery", {
      method: "POST",
      json: data,
    }),

  update: (id: string, data: UpdateGalleryImageDto) =>
    request<GalleryImageDto>(`/api/gallery/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: data,
    }),

  remove: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/gallery/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),
};

// ---------- Certifications ----------
export const certificationsApi = {
  list: (query: ListCertificationsQuery = {}) =>
    request<CertificationDto[]>(
      `/api/certifications${qs(query as Record<string, unknown>)}`
    ),

  get: (id: string) =>
    request<CertificationDto>(`/api/certifications/${encodeURIComponent(id)}`),

  create: (data: CreateCertificationDto) =>
    request<CertificationDto>("/api/certifications", {
      method: "POST",
      json: data,
    }),

  update: (id: string, data: UpdateCertificationDto) =>
    request<CertificationDto>(`/api/certifications/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: data,
    }),

  remove: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/certifications/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),
};

// ---------- Availability ----------
export const availabilityApi = {
  listSlots: () => request<AvailabilitySlotDto[]>("/api/availability/slots"),

  createSlot: (data: CreateAvailabilitySlotDto) =>
    request<AvailabilitySlotDto>("/api/availability/slots", {
      method: "POST",
      json: data,
    }),

  removeSlot: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/availability/slots/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),

  listBlockedDates: () => request<BlockedDateDto[]>("/api/availability/blocked-dates"),

  createBlockedDate: (data: CreateBlockedDateDto) =>
    request<BlockedDateDto>("/api/availability/blocked-dates", {
      method: "POST",
      json: data,
    }),

  removeBlockedDate: (id: string) =>
    request<{ id: string; deleted: true }>(
      `/api/availability/blocked-dates/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    ),
};

// ---------- Uploads ----------
export const uploadsApi = {
  /**
   * Uploads a single image file and returns the public URL. Pass the result
   * of an `<input type="file">` change event's `files[0]`.
   */
  image: async (file: File): Promise<UploadResultDto> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await request<UploadResultDto>("/api/uploads", {
      method: "POST",
      body: form,
    });
    return data;
  },

  /**
   * Uploads a single video file and returns the public URL. Backed by
   * `/api/uploads/video` which writes to the dedicated `testimonial-videos`
   * bucket so the per-file size limit can be larger than the image bucket
   * allows. Mirror of `uploadsApi.image` — same calling convention, same
   * return shape — so callers can reuse upload UI patterns.
   */
  video: async (file: File): Promise<UploadResultDto> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await request<UploadResultDto>("/api/uploads/video", {
      method: "POST",
      body: form,
    });
    return data;
  },
};
