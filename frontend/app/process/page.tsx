import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd from "@/components/JsonLd";
import Process from "@/components/Process";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How Booking Works",
  description: "Choose a service, pick a time, pay by card, upload the receipt, and receive confirmation. Five steps.",
  alternates: { canonical: "/process" },
  openGraph: {
    title: "How Booking Works",
    description: "Choose a service, pick a time, pay by card, upload the receipt, and receive confirmation. Five steps.",
    url: "/process",
    type: "website",
  },
};

export default function ProcessPage() {
  return (
    <PageShell>
      <JsonLd data={breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "How it works", "path": "/process"}])} />
      <Process />
    </PageShell>
  );
}
