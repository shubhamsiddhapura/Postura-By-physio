import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { BlogForm } from "@/components/blogs/BlogForm";
import { DeleteBlogButton } from "@/components/blogs/DeleteBlogButton";
import { ApiError, blogsApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  let blog;
  try {
    const res = await blogsApi.get(params.id);
    blog = res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <>
      <PageHeader
        title="Edit blog"
        description={blog.title}
        actions={
          <div className="flex items-center gap-2">
            {blog.published ? (
              <Badge tone="green">Published</Badge>
            ) : (
              <Badge tone="amber">Draft</Badge>
            )}
            <DeleteBlogButton id={blog.id} title={blog.title} redirectTo="/blogs" />
          </div>
        }
      />
      <BlogForm mode="edit" initial={blog} />
    </>
  );
}
