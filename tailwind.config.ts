import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0C",
        surface: "#16171B",
        surface2: "#1F2025",
        gold: {
          DEFAULT: "#C9A227",
          bright: "#E9C567",
          dim: "#8A7220",
        },
        silver: {
          DEFAULT: "#C7CBD1",
          bright: "#EDEEF0",
        },
        paper: "#F3F1EC",
        muted: "#8B8D93",
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      letterSpacing: {
        tightish: "-0.01em",
      },
    },
  },
  plugins: [],
};

export default config;
