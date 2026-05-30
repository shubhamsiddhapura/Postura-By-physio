"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  LayoutDashboard,
  ImageIcon,
  Star,
} from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const features = [
  { icon: LayoutDashboard, label: "Manage services & programs" },
  { icon: ImageIcon, label: "Upload gallery & media" },
  { icon: Star, label: "Curate client testimonials" },
];

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || json.success === false) {
        setError(json.error || "Login failed");
        return;
      }
      setRedirecting(true);
      window.location.href = next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  const isLoading = submitting || redirecting;

  return (
    <div className="flex min-h-screen">
      {/* ── Left branding panel ── */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col items-center justify-center overflow-hidden p-12"
        style={{ background: "linear-gradient(135deg, #004d4d 0%, #008080 55%, #00a89a 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-36 -right-24 h-[28rem] w-[28rem] rounded-full bg-white/5" />
        <div className="pointer-events-none absolute top-1/2 -right-10 h-52 w-52 -translate-y-1/2 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute top-16 right-24 h-24 w-24 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute bottom-24 left-16 h-16 w-16 rounded-full bg-white/10" />

        {/* Main content */}
        <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
          {/* Logo card */}
          <div className="mb-8 rounded-2xl bg-white/10 p-6 backdrop-blur-sm ring-1 ring-white/20 shadow-xl">
            <Image
              src="/admin-logo.png"
              alt="Postura by Physio"
              width={180}
              height={90}
              className="h-auto w-44 object-contain"
              priority
            />
          </div>

          <h1 className="font-cabinet text-4xl font-bold text-white">
            Admin Portal
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-teal-100">
            Your command center for managing the Postura by Physio platform.
          </p>

          {/* Feature list */}
          <div className="mt-10 flex w-full flex-col gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-xl bg-white/10 px-4 py-3 text-left backdrop-blur-sm ring-1 ring-white/10"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white/90">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom watermark */}
        <p className="absolute bottom-6 text-xs text-teal-200/60">
          © {new Date().getFullYear()} Postura by Physio
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex w-full lg:w-1/2 xl:w-2/5 flex-col items-center justify-center bg-white px-8 py-12 sm:px-12">
        <div className="w-full max-w-sm">

          {/* Mobile-only logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image
              src="/favicon.png"
              alt="Postura"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl object-contain"
            />
            <span className="font-cabinet text-xl font-bold text-gray-900">
              Postura Admin
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-cabinet text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-500">
              Sign in to your admin account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-medium text-gray-700">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  disabled={isLoading}
                  required
                  className="h-11 pl-10 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-11 pl-10 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="mt-px shrink-0 font-bold">!</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {redirecting ? "Redirecting…" : "Signing in…"}
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Postura by Physio. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
