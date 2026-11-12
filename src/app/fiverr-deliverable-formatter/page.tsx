import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/tools-registry";
import ToolLayout from "@/components/ToolLayout";
import FiverrDeliverableFormatter from "@/components/tools/FiverrDeliverableFormatter";

export const metadata: Metadata = {
  title: "Fiverr Deliverable Formatter - Clean Custom Offer Lists | Toolify",
  description:
    "Automatically format custom-offer deliverables into clean, professional lists using Roman numerals (I-3999), bullet points, standard numbering, or hyphens.",
  keywords: [
    "fiverr deliverable formatter",
    "fiverr custom offer list",
    "fiverr proposal scope",
    "roman numeral list maker",
    "fiverr gig deliverables",
  ],
  openGraph: {
    title: "Fiverr Deliverable Formatter - Custom Offer Lists | Toolify",
    description:
      "Transform messy notes into structured custom offer deliverables for Fiverr clients with Roman numerals, bullet points, or numbering.",
    url: "https://toolify.local/fiverr-deliverable-formatter",
    type: "website",
  },
};

export default function FiverrDeliverableFormatterPage() {
  const tool = getToolBySlug("fiverr-deliverable-formatter");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <FiverrDeliverableFormatter />
    </ToolLayout>
  );
}
