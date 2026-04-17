import type { GalleryCategory } from "@repo/types";
import { GALLERY_CATEGORIES } from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { GalleryForm } from "@/components/gallery/GalleryForm";

export const metadata = {
  title: "Add image — Admin",
};

function isValidCategory(v: string | undefined): v is GalleryCategory {
  return (
    typeof v === "string" &&
    (GALLERY_CATEGORIES as readonly string[]).includes(v)
  );
}

export default function NewGalleryImagePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const defaultCategory = isValidCategory(searchParams.category)
    ? searchParams.category
    : undefined;

  return (
    <>
      <PageHeader
        title="Add image"
        description="Upload or link an image and assign it to one of the gallery sections."
      />
      <div className="px-8 py-6">
        <GalleryForm mode="create" defaultCategory={defaultCategory} />
      </div>
    </>
  );
}
