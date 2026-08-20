import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd from "@/components/JsonLd";
import About from "@/components/About";
import { breadcrumbJsonLd, practitionerJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Rohani Ilaj Center operates under the guidance of Ibn Younas, a graduate in Islamic Studies trained under Saudi scholars, with 30 years of experience.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Rohani Ilaj Center",
    description:
      "Who is behind Rohani Ilaj Center: education, training and experience.",
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <PageShell>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          practitionerJsonLd(),
        ]}
      />
      <About />
    </PageShell>
  );
}
