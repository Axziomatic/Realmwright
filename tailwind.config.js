/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: "#020617",      // Main BG
          card: "#0F172A",      // Cards / modals
          muted: "#1E293B",     // Inputs, hover, sekundära ytor
        },

        border: {
          primary: "#1E293B",
          secondary: "#334155",
        },

        text: {
          primary: "#F1F5F9",
          secondary: "#E2E8F0",
          tertiary: "#E2E8F0",
        },

        accent: {
          highlight: "#FBBF24", // hover states, ikoner, highlights
          primary: "#F59E0B",   // primär knapp
          secondary: "#D97706", // sekundär knapp
        },
      },

      fontFamily: {
        // Dessa kommer vi kopppla till next/font variabler
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],

        // Extra alias för headings
        heading: ["var(--font-serif)", "serif"],
      },

      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
