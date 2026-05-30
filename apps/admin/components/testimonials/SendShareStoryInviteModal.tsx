"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

type InviteOkPayload = {
  delivered?: boolean;
  skippedReason?: string;
  messageId?: string | null;
};

export function SendShareStoryInviteModal() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InviteOkPayload | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
    setResult(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/testimonials/send-share-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = (await res.json().catch(() => null)) as
        | { success?: boolean; error?: string; data?: InviteOkPayload }
        | null;

      if (!res.ok || !json || json.success === false) {
        setError(
          typeof json?.error === "string"
            ? json.error
            : `Request failed (${res.status})`
        );
        return;
      }

      setResult((json.data as InviteOkPayload) ?? {});
      setEmail("");
    } catch {
      setError("Network error — try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Mail className="h-4 w-4" />
        Invite feedback
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/40"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
          >
            <h2 id={titleId} className="text-lg font-semibold text-gray-900">
              Email testimonial form link
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              We&apos;ll send the Share Your Story link so they can submit feedback in their own time.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="invite-email" required>
                  Recipient email
                </Label>
                <Input
                  id="invite-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="patient@example.com"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  disabled={pending}
                  required
                />
              </div>

              {error ? (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}

              {result ? (
                <div
                  className={`rounded-md border px-3 py-2 text-sm ${
                    result.delivered
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-amber-200 bg-amber-50 text-amber-900"
                  }`}
                  role="status"
                >
                  {result.delivered ? (
                    <p>The invite email was sent.</p>
                  ) : (
                    <p>
                      The invite was processed but not delivered via SMTP.
                      {result.skippedReason ? (
                        <>
                          {" "}
                          <span className="font-medium">{result.skippedReason}</span>
                        </>
                      ) : null}{" "}
                      Check web server logs or SMTP configuration on the web app.
                    </p>
                  )}
                </div>
              ) : null}

              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" onClick={close} disabled={pending}>
                  Close
                </Button>
                <Button type="submit" disabled={pending || !email.trim()}>
                  {pending ? "Sending…" : "Send email"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
