import type { ApiResponse, BlogDto } from "@repo/types";

/**
 * Server-side fetcher for the public web pages.
 *
 * We could call Prisma directly here, but going through the API keeps a
 * single source of truth for shaping (formatted `date`, serialization,
 * filters) and matches exactly what the admin dashboard sees.
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

type Meta = { total: number; page: number; limit: number; totalPages: number };

async function fetchJson<T>(
  path: string
): Promise<{ data: T; meta?: Meta } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
    if (!res.ok && res.status !== 404) {
      console.error("[web] API request failed", path, res.status);
      return null;
    }
    const body = (await res.json()) as ApiResponse<T> & { meta?: Meta };
    if (body.success === false) return null;
    return { data: body.data, meta: body.meta };
  } catch (err) {
    console.error("[web] API fetch error", path, err);
    return null;
  }
}

export async function getPublishedBlogs(): Promise<BlogDto[]> {
  const res = await fetchJson<BlogDto[]>("/api/blogs?published=true&limit=100");
  return res?.data ?? [];
}

export async function getBlogByIdOrSlug(
  idOrSlug: string
): Promise<BlogDto | null> {
  const res = await fetchJson<BlogDto>(
    `/api/blogs/${encodeURIComponent(idOrSlug)}`
  );
  return res?.data ?? null;
}
