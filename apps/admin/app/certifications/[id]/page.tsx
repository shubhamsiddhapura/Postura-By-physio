import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { CertificationForm } from "@/components/certifications/CertificationForm";
import { DeleteCertificationButton } from "@/components/certifications/DeleteCertificationButton";
import { ApiError, certificationsApi } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function EditCertificationPage({
  params,
}: {
  params: { id: string };
}) {
  let cert;
  try {
    const res = await certificationsApi.get(params.id);
    cert = res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <>
      <PageHeader
        title="Edit certification"
        description={cert.title}
        actions={
          <div className="flex items-center gap-2">
            <Badge tone={cert.published ? "green" : "gray"}>
              {cert.published ? "Published" : "Hidden"}
            </Badge>
            <DeleteCertificationButton
              id={cert.id}
              label={cert.title}
              redirectTo="/certifications"
            />
          </div>
        }
      />
      <div className="px-8 py-6">
        <CertificationForm mode="edit" initial={cert} />
      </div>
    </>
  );
}
