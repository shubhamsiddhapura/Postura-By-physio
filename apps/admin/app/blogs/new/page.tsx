import { PageHeader } from "@/components/PageHeader";
import { BlogForm } from "@/components/blogs/BlogForm";

export const metadata = {
  title: "New Blog — Admin",
};

export default function NewBlogPage() {
  return (
    <>
      <PageHeader
        title="New blog"
        description="Create a new article. It won't appear on the public site until you mark it as published."
      />
      <div className="px-8 py-6">
        <BlogForm mode="create" />
      </div>
    </>
  );
}
