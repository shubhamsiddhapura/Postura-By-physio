import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

// Load the single monorepo-root `.env` so both Prisma and Next use the
// same secrets. App-local `.env.local` / `.env` still win over it. On
// Vercel this file isn't present and dotenv becomes a no-op — env vars
// come from the Vercel project settings instead.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    // Allow any https image host. Blog content is author-controlled via the
    // admin, so the list of CDNs can't be known ahead of time. `**` matches
    // any hostname while still requiring https.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  transpilePackages: ["@repo/db", "@repo/types"],

  // Keep Prisma out of the webpack bundle so it's loaded at runtime via
  // a plain `require("@prisma/client")` against node_modules. Needed for
  // the engine binary to resolve on Vercel serverless.
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },

  // Prisma's own plugin for Next.js + pnpm monorepos. It copies the
  // native query-engine binary (libquery_engine-*.so.node) into the
  // serverless function output so the runtime can find it. Without this,
  // `@repo/db` re-exporting `@prisma/client` through `transpilePackages`
  // leaves the engine behind and every API route 500s.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...(config.plugins ?? []), new PrismaPlugin()];
    }
    return config;
  },

  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|ico|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
