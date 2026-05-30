import { PageHeader } from "@/components/PageHeader";
import { CertificationForm } from "@/components/certifications/CertificationForm";

export const metadata = {
  title: "Add certification — Admin",
};

export default function NewCertificationPage() {
  return (
    <>
      <PageHeader
        title="Add certification"
        description="Upload the certificate image and fill in its caption."
      />
      <div className="px-8 py-6">
        <CertificationForm mode="create" />
      </div>
    </>
  );
}
