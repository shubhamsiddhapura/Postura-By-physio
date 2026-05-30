"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { certificationsApi } from "@/lib/api";

export function DeleteCertificationButton({
  id,
  label,
  redirectTo,
}: {
  id: string;
  label: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    const ok = window.confirm(
      `Delete "${label}"?\n\nThis removes the certification from the public site. This action cannot be undone.`
    );
    if (!ok) return;

    setError(null);
    startTransition(async () => {
      try {
        await certificationsApi.remove(id);
        if (redirectTo) router.push(redirectTo);
        else router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-end">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {isPending ? "Deleting..." : "Delete"}
      </Button>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
