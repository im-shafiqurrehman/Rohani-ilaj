"use client";

import { ReactNode } from "react";

/**
 * Re-mounts on every navigation, so the animation below runs once per route
 * change. Since the nav moved from in-page anchors to real routes, without
 * this a page swap is an abrupt cut.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
