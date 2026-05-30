import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import type { CertificationDto } from "@repo/types";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeleteCertificationButton } from "@/components/certifications/DeleteCertificationButton";
import { certificationsApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CertificationsListPage() {
  let items: CertificationDto[] = [];
  let loadError: string | null = null;

  try {
    const res = await certificationsApi.list({ limit: 200 });
    items = res.data;
  } catch (err) {
    loadError =
      err instanceof Error ? err.message : "Failed to load certifications";
  }

  return (
    <>
      <PageHeader
        title="Certifications"
        description="Manage the certifications shown in the About page marquee."
        actions={
          <Link href="/certifications/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add certification
            </Button>
          </Link>
        }
      />

      <div className="space-y-6 px-8 py-6">
        {loadError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Could not load certifications</p>
            <p className="mt-1">{loadError}</p>
            <p className="mt-2 text-xs text-red-600">
              Is the web app running on{" "}
              <code className="rounded bg-red-100 px-1">
                {process.env.NEXT_PUBLIC_API_BASE_URL ??
                  "http://localhost:3000"}
              </code>
              ?
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-sm font-medium text-gray-700">
              No certifications yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Add the first certification to populate the About page marquee.
            </p>
            <Link href="/certifications/new" className="mt-4 inline-block">
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4" />
                Add certification
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((c) => (
              <CertificationCard key={c.id} cert={c} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function CertificationCard({ cert }: { cert: CertificationDto }) {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const src = cert.imageUrl.startsWith("http")
    ? cert.imageUrl
    : `${base}${cert.imageUrl}`;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={cert.alt}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm">
          #{cert.order}
        </div>
        {!cert.published ? (
          <div className="absolute right-2 top-2">
            <Badge tone="gray">Hidden</Badge>
          </div>
        ) : null}
      </div>
      <div className="space-y-2 p-3">
        <p className="line-clamp-2 text-xs font-semibold text-gray-900">
          {cert.title}
        </p>
        <p className="line-clamp-2 text-xs text-gray-500">{cert.alt}</p>
        <div className="flex items-center justify-between gap-2">
          <Link href={`/certifications/${cert.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
          <DeleteCertificationButton id={cert.id} label={cert.title} />
        </div>
      </div>
    </div>
  );
}
