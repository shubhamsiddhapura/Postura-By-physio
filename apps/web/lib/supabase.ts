import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the service-role key.
 *
 * NOTE: The `service_role` key bypasses Row Level Security and must NEVER be
 * exposed to the browser. Only import this module from server files
 * (route handlers, server actions, or server components).
 *
 * Currently the API routes use Prisma against the Supabase Postgres DB for
 * CRUD. This client is available for features that need the Supabase SDK
 * directly (Storage uploads, Auth admin, Realtime, RPC, etc.).
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Accept either the new `sb_secret_...` key or the legacy service_role JWT.
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Supabase server client is not configured. Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY."
    );
  }

  cached = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cached;
}
