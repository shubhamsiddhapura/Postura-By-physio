import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Load the single monorepo-root `.env` so both Prisma and Next use the
// same secrets. App-local `.env.local` / `.env` still win over it.
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
};

export default nextConfig;
