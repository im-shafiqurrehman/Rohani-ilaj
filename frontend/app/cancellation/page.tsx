import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Cancellation & Rescheduling",
  description: "How to cancel or move an appointment.",
  alternates: { canonical: "/cancellation" },
};

export default function CancellationPage() {
  return <PolicyPage policy="cancellation" />;
}
