"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  DEFAULT_PALETTE,
  PALETTE_IDS,
  Palette,
  PALETTES,
  themeColor,
} from "@/lib/palettes";

type Mode = "dark" | "light";

const THEME_KEY = "rohani-theme";
const PALETTE_KEY = "rohani-palette";

const ThemeContext = createContext<{
  theme: Mode;
  palette: string;
  palettes: Palette[];
  toggle: () => void;
  setPalette: (id: string) => void;
}>({
  theme: "dark",
  palette: DEFAULT_PALETTE,
  palettes: PALETTES,
  toggle: () => {},
  setPalette: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function syncChrome(paletteId: string, mode: Mode) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", themeColor(paletteId, mode));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // The inline script in layout.tsx has already set both attributes by the
  // time this mounts, so read from the DOM rather than guessing and re-flashing.
  const [theme, setTheme] = useState<Mode>("dark");
  const [palette, setPaletteState] = useState<string>(DEFAULT_PALETTE);

  useEffect(() => {
    const el = document.documentElement;
    const t = el.getAttribute("data-theme");
    const p = el.getAttribute("data-palette");
    if (t === "light" || t === "dark") setTheme(t);
    if (p && PALETTE_IDS.includes(p)) setPaletteState(p);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Mode = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* private browsing — the choice just won't persist */
      }
      syncChrome(
        document.documentElement.getAttribute("data-palette") || DEFAULT_PALETTE,
        next
      );
      return next;
    });
  }, []);

  const setPalette = useCallback((id: string) => {
    if (!PALETTE_IDS.includes(id)) return;
    setPaletteState(id);
    document.documentElement.setAttribute("data-palette", id);
    try {
      localStorage.setItem(PALETTE_KEY, id);
    } catch {
      /* ignore */
    }
    const mode =
      (document.documentElement.getAttribute("data-theme") as Mode) || "dark";
    syncChrome(id, mode);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, palette, palettes: PALETTES, toggle, setPalette }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
