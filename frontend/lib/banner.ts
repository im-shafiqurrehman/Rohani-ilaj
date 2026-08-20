import fs from "node:fs";
import path from "node:path";

const CANDIDATES = ["banner.jpg", "banner.jpeg", "banner.png", "banner.webp"];

export function resolveBanner(): string | null {
  const fromEnv = (process.env.NEXT_PUBLIC_BANNER_URL || "").trim();
  if (fromEnv) return fromEnv;

  const dir = path.join(process.cwd(), "public", "asset");
  for (const name of CANDIDATES) {
    if (fs.existsSync(path.join(dir, name))) return `/asset/${name}`;
  }
  return null;
}
