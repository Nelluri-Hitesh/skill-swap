import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // App shell background
        canvas: "#0f1117",
        sidebar: "#13161e",
        // Content cards
        card: {
          DEFAULT: "#ffffff",
          dark: "#1a1d27",
        },
        // Primary accent
        accent: {
          DEFAULT: "#3b82f6",
          light: "#eff6ff",
          dark: "#1d4ed8",
          muted: "#dbeafe",
        },
        // Borders
        border: {
          DEFAULT: "#e5e7eb",
          dark: "#2a2d3a",
          subtle: "#f3f4f6",
        },
        // Text
        text: {
          primary: "#111827",
          secondary: "#6b7280",
          muted: "#9ca3af",
          inverse: "#f9fafb",
        },
        // Status
        success: {
          DEFAULT: "#10b981",
          light: "#d1fae5",
          muted: "#ecfdf5",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fef3c7",
        },
        danger: {
          DEFAULT: "#ef4444",
          light: "#fee2e2",
        },
        purple: {
          DEFAULT: "#8b5cf6",
          light: "#ede9fe",
        },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 16px 0 rgba(0,0,0,0.10)",
        sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.2s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-4px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
