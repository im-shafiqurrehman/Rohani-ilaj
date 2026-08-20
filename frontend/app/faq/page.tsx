import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to the questions people ask most often.",
};

export default function FaqPage() {
  return (
    <PageShell>
      <Faq />
    </PageShell>
  );
}
