export default function PatternDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-deep/70" />
      <svg width="28" height="28" viewBox="0 0 28 28" className="text-gold-deep">
        <path
          d="M14 2 L16 12 L26 14 L16 16 L14 26 L12 16 L2 14 L12 12 Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-deep/70" />
    </div>
  );
}
