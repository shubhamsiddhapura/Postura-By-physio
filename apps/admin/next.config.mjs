import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Load the single monorepo-root `.env` so admin + web share one source of
// truth. App-local `.env.local` still wins over it.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  transpilePackages: ["@repo/types"],
};

export default nextConfig;
