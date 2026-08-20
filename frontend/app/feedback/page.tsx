import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ReviewForm from "@/components/ReviewForm";

export const metadata: Metadata = {
  title: "Share Your Experience",
  description:
    "Submit a review of your consultation with Rohani Ilaj Center. Nothing is published without your permission.",
  alternates: { canonical: "/feedback" },
  robots: { index: true, follow: true },
};

export default function FeedbackPage() {
  return (
    <PageShell>
      <ReviewForm />
    </PageShell>
  );
}
