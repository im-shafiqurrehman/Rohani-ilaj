"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * Colour-family switcher. Sits next to the light/dark toggle: the toggle picks
 * the mode, this picks the palette, and the two combine — five palettes × two
 * modes = ten themes, all generated from lib/palettes.ts.
 */
export default function PalettePicker() {
  const { palette, palettes, setPalette } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = palettes.find((p) => p.id === palette) ?? palettes[0];

  return (
    <div ref={ref} className="relative" dir="ltr">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Colour theme: ${active.name}`}
        title={`Colour theme: ${active.name}`}
        className="grid h-9 w-9 place-items-center rounded-full border border-line transition-colors duration-300 hover:border-accent/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
      >
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-fg/20"
          style={{ backgroundColor: active.swatch }}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Colour theme"
          className="absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-lg border border-line bg-surface py-1.5 shadow-lift"
        >
          {palettes.map((p) => {
            const selected = p.id === palette;
            return (
              <li key={p.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    setPalette(p.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left font-body text-sm transition-colors duration-200 hover:bg-surface-2 ${
                    selected ? "text-accent" : "text-muted"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="flex shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-fg/20"
                  >
                    {/* Ink, surface and accent — enough to read the family at a glance. */}
                    {[p.dark.ink, p.dark.surface2, p.swatch].map((c) => (
                      <span
                        key={c}
                        className="h-3.5 w-3.5"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </span>
                  <span className="flex-1">{p.name}</span>
                  {selected && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
