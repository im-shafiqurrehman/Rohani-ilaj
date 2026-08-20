import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd from "@/components/JsonLd";
import Services from "@/components/Services";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services and Fees",
  description: "Initial call at PKR 2,000 and a physical session in Lahore at PKR 5,000. Both 30 minutes, by appointment.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services and Fees",
    description: "Initial call at PKR 2,000 and a physical session in Lahore at PKR 5,000. Both 30 minutes, by appointment.",
    url: "/services",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <PageShell>
      <JsonLd data={breadcrumbJsonLd([{"name": "Home", "path": "/"}, {"name": "Services", "path": "/services"}])} />
      <Services />
    </PageShell>
  );
}
