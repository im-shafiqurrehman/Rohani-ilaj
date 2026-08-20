import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: token("ink"),
        surface: token("surface"),
        "surface-2": token("surface-2"),
        line: token("line"),
        fg: token("fg"),
        muted: token("muted"),
        accent: token("accent"),
        "accent-fg": token("accent-fg"),
        danger: token("danger"),
      },
      fontFamily: {
        urdu: ["var(--font-nastaliq)", "serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Editorial display scale — large, light, tightly tracked.
        display: ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        title: ["clamp(1.875rem, 3.5vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
      },
      maxWidth: {
        measure: "38rem", // ~66 characters, the comfortable reading width
      },
      boxShadow: {
        // Shadow is tinted with the palette ink rather than black, so panels sit
        // in the blue rather than having a grey hole punched under them.
        lift: "0 1px 0 rgb(var(--line)), 0 24px 60px -32px rgb(var(--ink) / 0.7)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
