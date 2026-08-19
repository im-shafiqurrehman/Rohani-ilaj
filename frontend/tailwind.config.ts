import type { Config } from "tailwindcss";

/*
 * Palette is sampled directly from public/asset/logo.png — the navy and gold
 * values below are the measured averages of the rose mark and wordmark, and
 * white is the logo's own background. Nothing outside these three colours is
 * used on the public site.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#051740", // sampled logo navy — body text, dark panels
          deep: "#03102E", // darkest logo navy — footer
          light: "#0B2358", // raised panels on navy
          soft: "#EEF1F7", // navy tinted to ~4% for alternating sections
        },
        gold: {
          DEFAULT: "#E6BD60", // sampled logo gold — borders, fills, accents
          light: "#F4D981", // gold highlight side of the logo gradient
          deep: "#D4A22F", // gold shadow side of the logo gradient
          dark: "#8A6413", // darkened gold that passes AA as text on white
          soft: "#FDF7EA", // gold tinted to ~6% for cards and chips
        },
      },
      fontFamily: {
        urdu: ["var(--font-nastaliq)", "serif"],
        display: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 0%, rgba(230,189,96,0.22), transparent 62%)",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(230,189,96,0.45), 0 10px 30px -12px rgba(212,162,47,0.45)",
        card: "0 1px 2px rgba(5,23,64,0.05), 0 12px 32px -18px rgba(5,23,64,0.28)",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.25", transform: "scale(0.9)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        twinkle: "twinkle 3.2s ease-in-out infinite",
        "rise-in": "rise-in 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
