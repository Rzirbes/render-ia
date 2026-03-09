import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        surface: "#18181b",
        border: "#27272a",
        text: {
          primary: "#ffffff",
          secondary: "#a1a1aa",
          muted: "#71717a",
        },
        brand: {
          DEFAULT: "#7c3aed",
          hover: "#6d28d9",
        },
      },
    },
  },
  plugins: [],
};

export default config;
