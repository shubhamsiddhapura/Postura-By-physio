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
    },
  },
  plugins: [],
};
export default config;
