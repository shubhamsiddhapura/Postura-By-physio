import Link from "next/link";
import { Suspense } from "react";
import { Pencil, Plus } from "lucide-react";
import type { BlogDto } from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeleteBlogButton } from "@/components/blogs/DeleteBlogButton";
import { blogsApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { BlogsFilters } from "./BlogsFilters";

export const dynamic = "force-dynamic";

type SearchParams = {
  page?: string;
  search?: string;
  published?: "true" | "false" | "all";
};

export default async function BlogsListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = 10;
  const search = searchParams.search?.trim() || undefined;
  const publishedFilter = searchParams.published ?? "all";

  return (
    <>
      <PageHeader
        title="Blogs"
        description="Create, publish, and manage articles."
        actions={
          <Link href="/blogs/new">
            <Button>
              <Plus className="h-4 w-4" />
              New blog
            </Button>
          </Link>
        }
      />

      <div className="mx-auto w-full space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <BlogsFilters
          initialSearch={search ?? ""}
          initialPublished={publishedFilter}
        />

        <Suspense
          key={`${page}-${search ?? ""}-${publishedFilter}`}
          fallback={<BlogsListSkeleton />}
        >
          <BlogsList
            page={page}
            limit={limit}
            search={search}
            publishedFilter={publishedFilter}
          />
        </Suspense>
      </div>
    </>
  );
}

async function BlogsList({
  page,
  limit,
  search,
  publishedFilter,
}: {
  page: number;
  limit: number;
  search?: string;
  publishedFilter: "true" | "false" | "all";
}) {
  let blogs: BlogDto[] = [];
  let total = 0;
  let totalPages = 1;
  let loadError: string | null = null;

  try {
    const res = await blogsApi.list({
      page,
      limit,
      search,
      published:
        publishedFilter === "true"
          ? true
          : publishedFilter === "false"
            ? false
            : undefined,
    });
    blogs = res.data;
    total = res.meta?.total ?? 0;
    totalPages = res.meta?.totalPages ?? 1;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load blogs";
  }

  if (loadError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p className="font-medium">Could not load blogs</p>
        <p className="mt-1">{loadError}</p>
        <p className="mt-2 text-xs text-red-600">
          Is the web app running on{" "}
          <code className="rounded bg-red-100 px-1">
            {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"}
          </code>
          ?
        </p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-sm font-medium text-gray-700">No blogs found</p>
        <p className="mt-1 text-sm text-gray-500">
          {search ? "Try clearing your filters." : "Get started by creating your first blog post."}
        </p>
        <Link href="/blogs/new" className="mt-4 inline-block">
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            New blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-3 text-left">Title</th>
              <th className="px-5 py-3 text-left">Author</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50/50">
                <td className="max-w-xl px-5 py-3">
                  <div className="flex flex-col">
                    <span className="line-clamp-1 font-medium text-gray-900">
                      {blog.title}
                    </span>
                    <span className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                      /{blog.slug}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-gray-700">
                  {blog.author}
                </td>
                <td className="px-5 py-3">
                  {blog.published ? (
                    <Badge tone="green">Published</Badge>
                  ) : (
                    <Badge tone="amber">Draft</Badge>
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                  {blog.date || "—"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/blogs/${blog.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteBlogButton id={blog.id} title={blog.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          search={search}
          published={publishedFilter}
        />
      ) : null}
    </>
  );
}

function BlogsListSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5">
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  search,
  published,
}: {
  page: number;
  totalPages: number;
  total: number;
  search?: string;
  published: string;
}) {
  const make = (p: number) => {
    const params = new URLSearchParams();
    params.set("page", String(p));
    if (search) params.set("search", search);
    if (published && published !== "all") params.set("published", published);
    return `/blogs?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
      <p className="text-gray-500">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link href={make(page - 1)}>
            <Button variant="outline" size="sm">
              Previous
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
        )}
        {page < totalPages ? (
          <Link href={make(page + 1)}>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
