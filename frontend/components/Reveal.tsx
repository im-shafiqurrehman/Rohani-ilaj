"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

type Variant = "up" | "fade" | "left" | "right" | "scale";

const FAILSAFE_MS = 1600;

export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as: Tag = "div",
  once = true,
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  /** Milliseconds. Use with an index to stagger a grid. */
  delay?: number;
  className?: string;
  as?: any;
  once?: boolean;
  [key: string]: any;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Old browsers, or a test environment without the API.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const failsafe = setTimeout(() => setVisible(true), FAILSAFE_MS);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            clearTimeout(failsafe);
            setVisible(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      // Fires slightly before the element is fully on screen, so the motion
      // finishes as the reader arrives rather than starting then.
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => {
      clearTimeout(failsafe);
      io.disconnect();
    };
  }, [once]);

  return (
    <Tag
      ref={ref}
      data-reveal={variant === "up" ? "" : variant}
      className={`${className}${visible ? " is-visible" : ""}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
