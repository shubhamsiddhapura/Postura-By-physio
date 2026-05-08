import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        switzer: ["var(--font-switzer)", "sans-serif"],
        cabinet: ["var(--font-cabinet)", "sans-serif"],
      },
      colors: {
        primary: "#008080",
        secondary: "#BE6C25",
      },
      // Custom screen for tablet-portrait range only (e.g., iPad Mini 768,
      // iPad Air 820, iPad Pro 11" 834). The upper bound (1023px) means
      // these utilities never apply on desktop or tablet-landscape, so the
      // existing `md:` and `lg:` desktop/mobile styles are preserved.
      screens: {
        tab: { min: "768px", max: "1023px" },
      },
    },
  },
  plugins: [],
};
export default config;
