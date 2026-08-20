import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd from "@/components/JsonLd";
import ContactForm from "@/components/ContactForm";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Send a question, ask for help with a booking, or share your feedback. We usually reply the same day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us",
    description: "Send a question, ask for help with a booking, or share your feedback. We usually reply the same day.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactFormPage() {
  return (
    <PageShell>
      <JsonLd data={breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "Contact", "path": "/contact"}])} />
      <ContactForm />
    </PageShell>
  );
}
