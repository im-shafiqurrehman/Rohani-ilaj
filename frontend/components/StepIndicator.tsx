"use client";

import { useLang } from "./LanguageProvider";

export default function StepIndicator({
  current,
  labels,
}: {
  current: number; // 1-based
  labels: string[];
}) {
  const { t } = useLang();

  return (
    <ol className="flex items-stretch gap-2" aria-label={t.booking.eyebrow}>
      {labels.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;

        return (
          <li key={label} className="flex-1">
            {/* The rule itself carries the progress — no numbered circles. */}
            <span
              aria-hidden="true"
              className={`block h-px w-full transition-colors duration-700 ease-editorial ${
                done || active ? "bg-accent" : "bg-line"
              }`}
            />
            <span
              aria-current={active ? "step" : undefined}
              className={`mt-3 block font-body text-[11px] tracking-wide transition-colors duration-500 ${
                active ? "text-accent" : done ? "text-fg" : "text-muted/50"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
