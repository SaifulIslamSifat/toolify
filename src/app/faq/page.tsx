import { HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Toolify",
  description: "Common questions and detailed answers about Toolify's utilities, privacy policy, and browser-side processing.",
};

export default function FaqPage() {
  const faqs = [
    {
      q: "How does Toolify process files without uploading them to a server?",
      a: "Toolify leverages modern web standards including the HTML5 File API, Web Workers, Canvas API, and pure JavaScript WebAssembly libraries (such as pdf-lib). When you select a file, your browser loads the binary data directly into local memory and manipulates it right on your CPU/GPU, never sending the file across the network.",
    },
    {
      q: "Can I use Toolify completely offline?",
      a: "Yes! Once you have loaded the page for a client-side tool (like Image Compressor, Word Counter, or BMI Calculator), you can disconnect from the internet and the tool will continue working flawlessly.",
    },
    {
      q: "Are there any file size or conversion limits?",
      a: "No artificial account-tier limits exist. You can convert or compress files as often as you want. Limits are dictated purely by your computer's RAM and browser capabilities (typically files under 50MB work best).",
    },
    {
      q: "Does Toolify sell or share my data with advertisers?",
      a: "Never. We do not require sign-up, do not track personal identifying information, and do not sell user data. See our Privacy Policy for full legal details.",
    },
    {
      q: "How can I suggest a new tool?",
      a: "Visit our Contact page and tell us what tool you'd like to see! We continuously add new utilities requested by our community.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Help & Guidance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Everything you need to know about Toolify, data security, and file conversions.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
