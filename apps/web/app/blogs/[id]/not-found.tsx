import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="min-h-[50vh] bg-white px-4 py-20 text-center">
      <h1 className="font-cabinet text-2xl font-bold text-gray-900">
        Article not found
      </h1>
      <p className="mt-3 text-sm text-gray-600">
        This blog post does not exist or has been removed.
      </p>
      <Link
        href="/blogs"
        className="mt-8 inline-block text-sm font-semibold text-primary underline"
      >
        Back to all articles
      </Link>
    </div>
  );
}
