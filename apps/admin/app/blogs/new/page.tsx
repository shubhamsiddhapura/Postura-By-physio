import { BlogForm } from "@/components/blogs/BlogForm";

export const metadata = {
  title: "New Blog — Admin",
};

export default function NewBlogPage() {
  return <BlogForm mode="create" />;
}
