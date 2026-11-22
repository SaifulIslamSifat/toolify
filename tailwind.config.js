/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  safelist: [
    {
      pattern: /(from|to|via)-(lime|emerald|teal|cyan|amber|orange|rose|red|zinc|slate)-(400|500|600|700)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        // Signature Framer-inspired palette: Electric Lime on Deep Obsidian Black
        brand: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#b7f36b", // Reference electric lime #b7f36b
          500: "#a3e635",
          600: "#65a30d",
          700: "#4d7c0f",
          800: "#3f6212",
          900: "#365314",
          950: "#090d0f",
        },
        // Cyber Mint / Emerald Accent
        accent: {
          50: "#f0fdf4",
          100: "#dcfce7",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          950: "#052e16",
        },
        // Deep Charcoal Obsidian (never navy, never purple)
        charcoal: {
          700: "#323d44",
          800: "#242e34",
          850: "#1a2227",
          900: "#12171a",
          950: "#090d0f",
          1000: "#000000",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -1px rgba(0, 0, 0, 0.15)",
        elevated: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        glow: "0 0 25px -5px rgba(183, 243, 107, 0.35)",
        glowMint: "0 0 25px -5px rgba(52, 211, 153, 0.35)",
      },
    },
  },
  plugins: [],
};
