import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/tools-registry";
import ToolLayout from "@/components/ToolLayout";
import FiverrMessageChecker from "@/components/tools/FiverrMessageChecker";

export const metadata: Metadata = {
  title: "Fiverr Message Compliance Checker - Avoid Account Warnings | Toolify",
  description:
    "Scan your Fiverr client messages in real-time for restricted terms, external contact info, and Terms of Service violations. Get safe, compliant alternatives instantly.",
  keywords: [
    "fiverr message checker",
    "fiverr compliance tool",
    "fiverr warning words",
    "fiverr communication policy",
    "avoid fiverr warning",
    "fiverr email checker",
  ],
  openGraph: {
    title: "Fiverr Message Compliance Checker - Avoid Warnings | Toolify",
    description:
      "Check your Fiverr client messages before sending. Identifies restricted words, emails, WhatsApp, and external payment mentions.",
    url: "https://toolify.local/fiverr-message-checker",
    type: "website",
  },
};

export default function FiverrMessageCheckerPage() {
  const tool = getToolBySlug("fiverr-message-checker");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <FiverrMessageChecker />
    </ToolLayout>
  );
}
