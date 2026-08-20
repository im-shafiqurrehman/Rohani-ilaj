
export type Tokens = {
  ink: string;
  surface: string;
  surface2: string;
  line: string;
  fg: string;
  muted: string;
  accent: string;
  accent2: string;
  accentFg: string;
  danger: string;
};

export type Palette = {
  id: string;
  name: string;
  /** Shown in the picker — the accent is what the eye actually picks out. */
  swatch: string;
  dark: Tokens;
  light: Tokens;
};

export const PALETTES: Palette[] = [
  {
    id: "terminal",
    name: "Midnight Cyan",
    swatch: "#28BCF6",
    dark: {
      // Lifted from shafiqurrehman.vercel.app's :root.
      // hsl(222 47% …) ramp and the hsl(197 92% 56%) cyan primary.
      ink: "#05080F",
      surface: "#080C16",
      surface2: "#0E1525",
      line: "#10192D",
      fg: "#F8FAFC",
      muted: "#94A3B8",
      accent: "#28BCF6",
      accent2: "#7DE8E8",
      accentFg: "#05080F",
      danger: "#EF4343",
    },
    light: {
      // No light mode exists on the portfolio, so this is the same hue family
      ink: "#F6F9FC",
      surface: "#FFFFFF",
      surface2: "#EAF2F9",
      line: "#D3E1ED",
      fg: "#0B1B2B",
      muted: "#4A6076",
      accent: "#036AA3",
      accent2: "#036AA3",
      accentFg: "#FFFFFF",
      danger: "#B4232A",
    },
  },
  {
    id: "sapphire",
    name: "Sapphire",
    swatch: "#F2C14E",
    dark: {
      ink: "#102A56",
      surface: "#17376B",
      surface2: "#1F4585",
      line: "#2C5596",
      fg: "#EEF4FF",
      muted: "#A9C2EA",
      accent: "#F2C14E",
      accent2: "#FFE08A",
      accentFg: "#102A56",
      danger: "#FF9BA1",
    },
    light: {
      ink: "#F3F7FE",
      surface: "#FFFFFF",
      surface2: "#E7EFFC",
      line: "#CFE0F7",
      fg: "#0F2A5C",
      muted: "#4E70A6",
      accent: "#8B5E0D",
      accent2: "#8B5E0D",
      accentFg: "#FFFFFF",
      danger: "#A81E24",
    },
  },
  {
    id: "cobalt",
    name: "Cobalt",
    swatch: "#E9B949",
    dark: {
      ink: "#0B2149",
      surface: "#122E63",
      surface2: "#1A3C7C",
      line: "#254B8E",
      fg: "#EAF1FF",
      muted: "#9FB9E2",
      accent: "#E9B949",
      accent2: "#FFDC84",
      accentFg: "#0B2149",
      danger: "#FF9BA1",
    },
    light: {
      ink: "#F1F5FD",
      surface: "#FFFFFF",
      surface2: "#E4EDFA",
      line: "#CBDCF4",
      fg: "#0B2149",
      muted: "#47679C",
      accent: "#8F6410",
      accent2: "#8F6410",
      accentFg: "#FFFFFF",
      danger: "#A81E24",
    },
  },
  {
    id: "azure",
    name: "Azure",
    swatch: "#FFD166",
    dark: {
      ink: "#123566",
      surface: "#1A4480",
      surface2: "#23539A",
      line: "#3064AE",
      fg: "#F0F6FF",
      muted: "#B0CBEE",
      accent: "#FFD166",
      accent2: "#FFE9A8",
      accentFg: "#123566",
      danger: "#FF9BA1",
    },
    light: {
      ink: "#EFF6FF",
      surface: "#FFFFFF",
      surface2: "#DFEDFC",
      line: "#C3DDF8",
      fg: "#0E3160",
      muted: "#46709F",
      accent: "#0B5FA5",
      accent2: "#0B5FA5",
      accentFg: "#FFFFFF",
      danger: "#A81E24",
    },
  },
  {
    id: "teal",
    name: "Deep Teal",
    swatch: "#F0B429",
    dark: {
      ink: "#0C2E42",
      surface: "#12405B",
      surface2: "#185273",
      line: "#226A93",
      fg: "#EAF6FB",
      muted: "#9CC4D8",
      accent: "#F0B429",
      accent2: "#FFD97A",
      accentFg: "#0C2E42",
      danger: "#FF9BA1",
    },
    light: {
      ink: "#EFF8FB",
      surface: "#FFFFFF",
      surface2: "#DDEFF6",
      line: "#BFE2EF",
      fg: "#0A2A3B",
      muted: "#3F6E88",
      accent: "#0D6B8A",
      accent2: "#0D6B8A",
      accentFg: "#FFFFFF",
      danger: "#A81E24",
    },
  },
  {
    id: "indigo",
    name: "Indigo",
    swatch: "#FFC857",
    dark: {
      ink: "#171A45",
      surface: "#21255C",
      surface2: "#2C3175",
      line: "#3B4090",
      fg: "#EEEFFC",
      muted: "#AFB2E0",
      accent: "#FFC857",
      accent2: "#FFE3A0",
      accentFg: "#171A45",
      danger: "#FF9BA1",
    },
    light: {
      ink: "#F4F4FD",
      surface: "#FFFFFF",
      surface2: "#E9E9FA",
      line: "#D6D6F2",
      fg: "#1A1C4E",
      muted: "#5A5D9B",
      accent: "#4C3BC4",
      accent2: "#4C3BC4",
      accentFg: "#FFFFFF",
      danger: "#A81E24",
    },
  },
];

export const DEFAULT_PALETTE = "teal";

/** First-time visitors always land on dark, regardless of their OS setting.
 *  A stored choice still wins on later visits. */
export const DEFAULT_THEME: "dark" | "light" = "dark";
export const PALETTE_IDS = PALETTES.map((p) => p.id);

function rgb(hex: string) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
}

function block(selector: string, t: Tokens, scheme: "dark" | "light") {
  return `${selector}{--ink:${rgb(t.ink)};--surface:${rgb(t.surface)};--surface-2:${rgb(
    t.surface2
  )};--line:${rgb(t.line)};--fg:${rgb(t.fg)};--muted:${rgb(t.muted)};--accent:${rgb(
    t.accent
  )};--accent-2:${rgb(t.accent2)};--accent-fg:${rgb(t.accentFg)};--danger:${rgb(t.danger)};color-scheme:${scheme};}`;
}

export function paletteCss() {
  const fallback = PALETTES.find((p) => p.id === DEFAULT_PALETTE) ?? PALETTES[0];

  return [
    // Applies before the no-flash script runs, and if JS is disabled entirely.
    block(":root", fallback.dark, "dark"),
    ...PALETTES.flatMap((p) => [
      block(`[data-palette="${p.id}"][data-theme="dark"]`, p.dark, "dark"),
      block(`[data-palette="${p.id}"][data-theme="light"]`, p.light, "light"),
    ]),
  ].join("");
}

export const ACCENT_GRADIENT: Record<string, string> = {
  terminal: "linear-gradient(135deg, #28BCF6 0%, #66FFFF 100%)",
};

/** Browser chrome colour, so the mobile address bar matches the page. */
export function themeColor(paletteId: string, theme: "dark" | "light") {
  const p = PALETTES.find((x) => x.id === paletteId) ?? PALETTES[0];
  return p[theme].ink;
}
