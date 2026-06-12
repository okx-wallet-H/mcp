import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "#1f2028",
        "bg-card": "#12131a",
        ink: {
          DEFAULT: "#0a0b0f",
          soft: "#0f1015",
          card: "#12131a",
          line: "#1f2028",
        },
        brand: {
          DEFAULT: "#ffffff",
          accent: "#1cc8a6",
          blue: "#4b6fff",
          gold: "#f0b90b",
        },
        up: "#1cc8a6",
        down: "#ef4444",
        warn: "#f0b90b",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.03) inset, 0 2px 8px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
