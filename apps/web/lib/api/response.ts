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
  extra?: { issues?: unknown }
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

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target)
        ? (err.meta?.target as string[]).join(", ")
        : (err.meta?.target as string | undefined);
      return fail(
        `A record with this ${target ?? "value"} already exists`,
        409
      );
    }
    if (err.code === "P2025") {
      return fail("Record not found", 404);
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return fail("Invalid data sent to database", 400);
  }

  console.error("[API] Unhandled error:", err);
  return fail("Internal server error", 500);
}
