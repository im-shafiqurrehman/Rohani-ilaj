import Image from "next/image";
import { resolveBanner } from "@/lib/banner";
import HeroCopy from "./HeroCopy";

/*
 * The logo lives in the header now, not here. This section is the banner (once
 * one is supplied) with the Urdu headline set over it; until then it degrades
 * to a type-only editorial hero rather than an empty frame.
 */
export default function Hero() {
  const banner = resolveBanner();

  return (
    <section className="relative isolate overflow-hidden">
      {banner && (
        <>
          <Image
            src={banner}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
          />
          {/* Scrim keeps the headline readable over any banner that gets
              uploaded, and keeps the section on-theme in both light and dark. */}
          <div className="absolute inset-0 -z-10 bg-ink/78" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
        </>
      )}
      {!banner && (
        <>
          <div className="grid-bg grid-fade absolute inset-0 -z-10" />
          <div className="vignette absolute inset-0 -z-10" />
        </>
      )}

      <HeroCopy hasBanner={Boolean(banner)} />
    </section>
  );
}
