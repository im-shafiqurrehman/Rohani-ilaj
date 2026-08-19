import { ReactNode } from "react";

/**
 * The signature shape of the site: a rounded mihrab/arch frame with a thin
 * gold border, echoing the arch used on the print banner. Used for service
 * cards, process steps, reviews, and forms so the digital brand visibly
 * continues the physical one.
 *
 * On the white theme the frame is the logo's gold gradient and the fill is
 * white, so the card reads the same way the logo does on paper.
 */
export default function ArchCard({
  children,
  className = "",
  archHeight = 64,
}: {
  children: ReactNode;
  className?: string;
  archHeight?: number;
}) {
  const radius = `50% 50% 10px 10px / ${archHeight}px ${archHeight}px 10px 10px`;

  return (
    <div
      className="p-[1.5px] bg-gradient-to-b from-gold-light via-gold to-gold-deep shadow-card"
      style={{ borderRadius: radius }}
    >
      <div
        className={`h-full bg-white ${className}`}
        style={{ borderRadius: radius }}
      >
        {children}
      </div>
    </div>
  );
}
