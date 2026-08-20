import fs from "node:fs";
import path from "node:path";

const CANDIDATES = ["banner.jpg", "banner.jpeg", "banner.png", "banner.webp"];

/**
 * Resolves the home-page banner at build time.
 *
 * The banner hasn't been supplied yet, so rather than shipping a broken image
 * the hero falls back to a type-only treatment. Drop any of banner.jpg /
 * .jpeg / .png / .webp into public/asset/ (or set NEXT_PUBLIC_BANNER_URL to a
 * remote one) and the banner layout takes over with no code change.
 */
export function resolveBanner(): string | null {
  const fromEnv = (process.env.NEXT_PUBLIC_BANNER_URL || "").trim();
  if (fromEnv) return fromEnv;

  const dir = path.join(process.cwd(), "public", "asset");
  for (const name of CANDIDATES) {
    if (fs.existsSync(path.join(dir, name))) return `/asset/${name}`;
  }
  return null;
}
