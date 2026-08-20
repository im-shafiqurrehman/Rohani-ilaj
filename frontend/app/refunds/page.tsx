import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "When Rohani Ilaj Center issues refunds, and how to request one.",
  alternates: { canonical: "/refunds" },
};

export default function RefundsPage() {
  return <PolicyPage policy="refunds" />;
}
