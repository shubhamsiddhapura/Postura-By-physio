import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Load the single monorepo-root `.env` so both Prisma and Next use the
// same secrets. App-local `.env.local` / `.env` still win over it. On
// Vercel this file isn't present and dotenv becomes a no-op — env vars
// come from the Vercel project settings instead.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow any https image host. Blog content is author-controlled via the
    // admin, so the list of CDNs can't be known ahead of time. `**` matches
    // any hostname while still requiring https.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  transpilePackages: ["@repo/db", "@repo/types"],

  // Prisma ships a native query-engine binary (libquery_engine-*.so.node)
  // that Next.js can't webpack into the function bundle. Mark the package
  // as external so it stays a runtime `require` against node_modules,
  // which keeps the engine file next to it on disk.
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },

  // pnpm monorepo: Vercel's file-tracer starts from this app's folder by
  // default, which misses `@prisma/client` since it lives up the tree in
  // `<repo>/node_modules/.pnpm/…`. Point the tracer at the workspace root
  // so the hoisted store (and the engine binary) gets copied into the
  // serverless function bundle.
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
