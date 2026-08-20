import { ReactNode } from "react";
import Reveal from "./Reveal";

/*
 * The editorial kit. Every surface on the site is built from these four
 * pieces so spacing, rules, and the gold budget stay consistent:
 *   Section — vertical rhythm + the eyebrow/title/lede block
 *   Panel   — a hairline-bordered surface, never a drop-shadowed "card"
 *   Button  — exactly one gold fill per view; everything else is outline
 *   Field   — form input with a hairline underline rather than a box
 */

export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  align = "center",
  tone = "ink",
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  align?: "center" | "start";
  tone?: "ink" | "surface";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <section
      id={id}
      className={`${tone === "surface" ? "bg-surface" : "bg-ink"} px-6 py-24 sm:py-32 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title || lede) && (
          <header
            className={`flex flex-col ${centered ? "items-center text-center" : "items-start text-start"}`}
          >
            {/* Eyebrow, rule, title and lede arrive in sequence rather than
                together — the small delay is what makes it read as composed
                instead of as one block sliding in. */}
            {eyebrow && (
              <Reveal as="p" className="eyebrow font-body" dir="ltr">
                {eyebrow}
              </Reveal>
            )}
            {eyebrow && (
              <Reveal delay={90} variant="left">
                <span className="rule-accent mt-4 block" />
              </Reveal>
            )}
            {title && (
              <Reveal
                as="h2"
                delay={150}
                className="mt-6 text-title font-light leading-tight text-fg"
              >
                {title}
              </Reveal>
            )}
            {/* Section titles stay plain — the glowing gradient is reserved for
                the hero, so it keeps its impact instead of becoming wallpaper. */}
            {lede && (
              <Reveal
                as="p"
                delay={220}
                className="mt-5 max-w-measure font-body text-base leading-8 text-muted"
              >
                {lede}
              </Reveal>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function Panel({
  children,
  className = "",
  interactive = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: any;
}) {
  return (
    <Tag
      className={`rounded-lg border border-line bg-surface transition-colors duration-500 ease-editorial ${
        interactive ? "hover:border-accent/40" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  [key: string]: any;
};

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-body text-sm tracking-wide transition-all duration-500 ease-editorial focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50 disabled:pointer-events-none";

const BUTTON_VARIANTS = {
  // The one gold fill. Use at most once per viewport.
  primary: "glow-button bg-accent text-accent-fg hover:brightness-110",
  outline: "border border-line text-fg hover:border-accent/60 hover:text-accent",
  ghost: "text-muted hover:text-fg",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  as: Tag = "button",
  ...rest
}: ButtonProps & { as?: any }) {
  return (
    <Tag className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function Field({
  label,
  hint,
  name,
  type = "text",
  as = "input",
  error,
  className = "",
  ...rest
}: {
  label: string;
  hint?: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  error?: string;
  className?: string;
  [key: string]: any;
}) {
  // Underlined rather than boxed — fewer competing borders is most of what
  // makes a long form feel considered instead of assembled.
  const control =
    "w-full border-0 border-b border-line bg-transparent px-0 py-2.5 font-body text-sm text-fg placeholder:text-muted/50 outline-none transition-colors duration-300 focus:border-accent";

  return (
    <div className={className}>
      <label htmlFor={name} className="block font-body text-xs tracking-wide text-muted">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea id={name} name={name} className={`${control} resize-y leading-7`} {...rest} />
      ) : (
        <input id={name} name={name} type={type} className={control} {...rest} />
      )}
      {hint && !error && (
        <p className="mt-1.5 font-body text-[11px] text-muted/70">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 font-body text-[11px] text-danger">{error}</p>
      )}
    </div>
  );
}

export function Alert({ children, tone = "danger" }: { children: ReactNode; tone?: "danger" | "accent" }) {
  return (
    <p
      role="alert"
      className={`rounded-md border px-4 py-3 font-body text-sm leading-6 ${
        tone === "danger"
          ? "border-danger/40 bg-danger/10 text-danger"
          : "border-accent/40 bg-accent/10 text-accent"
      }`}
    >
      {children}
    </p>
  );
}
