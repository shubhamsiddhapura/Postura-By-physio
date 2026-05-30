import { notFound } from "next/navigation";
import { GALLERY_CATEGORY_LABELS } from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { GalleryForm } from "@/components/gallery/GalleryForm";
import { DeleteGalleryButton } from "@/components/gallery/DeleteGalleryButton";
import { ApiError, galleryApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function EditGalleryImagePage({
  params,
}: {
  params: { id: string };
}) {
  let image;
  try {
    const res = await galleryApi.get(params.id);
    image = res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <>
      <PageHeader
        title="Edit image"
        description={image.alt}
        actions={
          <div className="flex items-center gap-2">
            <Badge tone="gray">
              {GALLERY_CATEGORY_LABELS[image.category]}
            </Badge>
            <DeleteGalleryButton
              id={image.id}
              label={image.alt}
              redirectTo="/gallery"
            />
          </div>
        }
      />
      <div className="px-8 py-6">
        <GalleryForm mode="edit" initial={image} />
      </div>
    </>
  );
}
