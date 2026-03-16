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
        bg: "#0a0f1a",
        card: "#111827",
        border: "#1e293b",
        accent: "#10b981",
        "accent-dim": "#065f46",
        warning: "#f59e0b",
        danger: "#ef4444",
        "text-primary": "#f1f5f9",
        "text-dim": "#94a3b8",
        "text-muted": "#64748b",
        purple: "#8b5cf6",
        blue: "#3b82f6",
        orange: "#f97316",
        pink: "#ec4899",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
