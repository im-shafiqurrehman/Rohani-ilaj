import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Reviews from "@/components/Reviews";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Feedback from clients who have used our services.",
};

export default function ReviewsPage() {
  return (
    <PageShell>
      <Reviews />
    </PageShell>
  );
}
