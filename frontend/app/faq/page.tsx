import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd from "@/components/JsonLd";
import Faq from "@/components/Faq";
import { breadcrumbJsonLd } from "@/lib/seo";
import { FAQS } from "@/lib/faqs";
import { faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about Shariah-compliant treatment, fees, payment, privacy, and what happens after you book.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Frequently Asked Questions",
    description: "Answers about Shariah-compliant treatment, fees, payment, privacy, and what happens after you book.",
    url: "/faq",
    type: "website",
  },
};

export default function FaqPage() {
  return (
    <PageShell>
      <JsonLd data={[breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "FAQ", "path": "/faq"}]), faqJsonLd(FAQS.ur.map((f) => ({ q: f.q, a: f.a })))]} />
      <Faq />
    </PageShell>
  );
}
