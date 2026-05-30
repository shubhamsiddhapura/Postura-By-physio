import { PageSkeleton } from "@/components/ui/Skeleton";

export default function BookingsLoading() {
  return <PageSkeleton rows={8} variant="table" />;
}
