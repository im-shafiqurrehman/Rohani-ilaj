import { ReactNode } from "react";

/*
 * The document body defaults to font-urdu (Noto Nastaliq Urdu) because the
 * public site is Urdu-first. The admin panel is entirely English, and Nastaliq
 * renders Latin text as heavily sloped calligraphy with enormous line spacing —
 * which is what made these screens look broken.
 *
 * Setting the base font and direction once here covers every admin route,
 * including any added later, instead of each page remembering to do it.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div dir="ltr" className="font-body">
      {children}
    </div>
  );
}
