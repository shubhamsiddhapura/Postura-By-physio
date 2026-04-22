import { PageSkeleton } from "@/components/ui/Skeleton";

export default function GalleryLoading() {
  return <PageSkeleton rows={6} variant="cards" />;
}
