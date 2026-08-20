import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd from "@/components/JsonLd";
import Reviews from "@/components/Reviews";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Client Feedback",
  description: "Feedback from people who have used our consultations, published with their permission.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Client Feedback",
    description: "Feedback from people who have used our consultations, published with their permission.",
    url: "/reviews",
    type: "website",
  },
};

export default function ReviewsPage() {
  return (
    <PageShell>
      <JsonLd data={breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "Reviews", "path": "/reviews"}])} />
      <Reviews />
    </PageShell>
  );
}
