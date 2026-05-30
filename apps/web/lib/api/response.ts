import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@repo/db";

/**
 * Standard success response wrapper.
 */
export function ok<T>(data: T, init?: { status?: number; meta?: Record<string, unknown> }) {
  const body = init?.meta
    ? { success: true as const, data, meta: init.meta }
    : { success: true as const, data };
  return NextResponse.json(body, { status: init?.status ?? 200 });
}

/**
 * Standard error response wrapper.
 */
export function fail(
  error: string,
  status = 400,
  extra?: { issues?: unknown; details?: string }
) {
  return NextResponse.json(
    { success: false as const, error, ...(extra ?? {}) },
    { status }
  );
}

/**
 * Centralised error handler: converts Zod + Prisma errors into friendly JSON responses.
 * Use in every route inside a try/catch.
 */
export function handleError(err: unknown) {
  if (err instanceof ZodError) {
    // Zod v4: `issues` is the public error list; include a compact field-error map too.
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "_";
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return fail("Validation failed", 422, {
      issues: { fieldErrors, raw: err.issues },
    });
  }

  // Next.js dev mode can load `@prisma/client` across multiple webpack
  // contexts, which makes `instanceof` unreliable. Fall back to shape /
  // code duck-typing so P2002/P2025 still map to 409/404 cleanly.
  const knownErr = isPrismaKnownError(err);
  if (knownErr) {
    if (knownErr.code === "P2002") {
      const target = Array.isArray(knownErr.meta?.target)
        ? (knownErr.meta.target as string[]).join(", ")
        : (knownErr.meta?.target as string | undefined);
      return fail(
        `A record with this ${target ?? "value"} already exists`,
        409
      );
    }
    if (knownErr.code === "P2025") {
      return fail("Record not found", 404);
    }
    // Column/table missing — deploy ran before `prisma db push` / migrate on Supabase.
    if (knownErr.code === "P2022") {
      console.error("[API] Prisma P2022 (schema drift):", knownErr.meta);
      return fail(
        "Database schema is out of sync. Apply the latest Prisma schema to your database (e.g. pnpm db:push from the repo root), then redeploy.",
        500
      );
    }
  }

  if (
    err instanceof Prisma.PrismaClientValidationError ||
    (err instanceof Error && err.name === "PrismaClientValidationError")
  ) {
    const msg =
      err instanceof Error ? err.message : "PrismaClientValidationError";
    console.error("[API] PrismaClientValidationError:", msg);
    // Helps debug stale `prisma generate` on Vercel (e.g. unknown arg `service`)
    // or invalid enum / Date values — safe to expose; no secrets in these messages.
    return fail("Invalid data sent to database", 400, { details: msg });
  }

  console.error("[API] Unhandled error:", err);
  return fail("Internal server error", 500);
}

/**
 * Duck-type check for Prisma's `PrismaClientKnownRequestError`. Safer than
 * `instanceof` under Next.js dev-mode hot reload because the class can be
 * re-imported across webpack chunks and fail identity checks.
 */
type PrismaKnownShape = {
  code: string;
  clientVersion: string;
  meta?: Record<string, unknown>;
};

function isPrismaKnownError(err: unknown): PrismaKnownShape | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return { code: err.code, clientVersion: err.clientVersion, meta: err.meta };
  }
  if (
    err instanceof Error &&
    err.name === "PrismaClientKnownRequestError" &&
    typeof (err as unknown as { code?: unknown }).code === "string"
  ) {
    const e = err as unknown as PrismaKnownShape;
    return { code: e.code, clientVersion: e.clientVersion, meta: e.meta };
  }
  return null;
}
