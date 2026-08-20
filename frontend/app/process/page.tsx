import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Process from "@/components/Process";

export const metadata: Metadata = {
  title: "How it works",
  description: "Booking, payment and confirmation, step by step.",
};

export default function ProcessPage() {
  return (
    <PageShell>
      <Process />
    </PageShell>
  );
}
