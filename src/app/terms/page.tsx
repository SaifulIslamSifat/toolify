import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - Toolify",
  description: "Terms of service and acceptable usage guidelines for Toolify.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Terms and Conditions</h1>
        <p className="text-xs text-slate-400 mt-2">Effective Date: November 2026</p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Toolify, you agree to comply with and be bound by these Terms and Conditions. If you do not
            agree, please refrain from using our services.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Lawful and Permitted Use</h2>
          <p>
            Toolify is provided for lawful personal, academic, and business purposes. You agree not to misuse our tools to
            distribute malicious code, probe private network infrastructure (SSRF), process content you lack rights to, or
            bypass copyright protections.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Disclaimer of Warranties</h2>
          <p>
            The services and tools are provided &quot;as is&quot; without warranties of any kind, whether express or implied.
            While we strive for 100% precision and stability, Toolify does not guarantee that conversions will be completely
            error-free or uninterrupted.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Limitation of Liability</h2>
          <p>
            In no event shall Toolify, its creators, or contributors be held liable for any direct, indirect, incidental, or
            consequential damages arising from the use of, or inability to use, our services.
          </p>
        </div>
      </div>
    </div>
  );
}
