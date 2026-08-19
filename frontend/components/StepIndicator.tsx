const URDU_NUMERALS = ["۱", "۲", "۳", "۴"];

/**
 * A visible "you are here" bar. The audience for this site is often not
 * comfortable with multi-step web forms, so the number of remaining steps is
 * always on screen rather than implied.
 */
export default function StepIndicator({
  current,
  labels,
}: {
  current: number; // 1-based
  labels: string[];
}) {
  return (
    <ol className="mb-10 flex items-center justify-center gap-2" aria-label="بکنگ کے مراحل">
      {labels.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;

        return (
          <li key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={active ? "step" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full border font-display text-sm transition ${
                  active
                    ? "border-navy bg-navy text-white"
                    : done
                    ? "border-gold-deep bg-gradient-to-b from-gold-light to-gold text-navy"
                    : "border-navy/20 text-navy/40"
                }`}
              >
                {done ? "✓" : URDU_NUMERALS[i]}
              </span>
              <span
                className={`font-body text-[11px] ${
                  active ? "font-semibold text-navy" : "text-navy/50"
                }`}
              >
                {label}
              </span>
            </div>
            {step < labels.length && (
              <span
                aria-hidden="true"
                className={`mb-5 h-px w-6 sm:w-10 ${
                  done ? "bg-gold-deep" : "bg-navy/20"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
