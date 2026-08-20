import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Services from "@/components/Services";

export const metadata: Metadata = {
  title: "Services",
  description: "Initial call and physical session — fees, duration and format.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <Services />
    </PageShell>
  );
}
