import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Toolify",
  description: "Read Toolify's privacy policy and understand our client-side processing guarantees.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400 mt-2">Last updated: November 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Overview & Core Commitment</h2>
          <p>
            At Toolify, your privacy is our top priority. We believe that simple utility tasks—such as resizing a family
            photo, merging confidential PDF contracts, or calculating BMI—should not require uploading sensitive personal
            data to third-party cloud servers.
          </p>
        </section>

        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Local Browser Processing</h2>
          <p>
            The majority of our utilities run 100% within your client browser. When you select an image, PDF, or text
            document, the file is read into your browser&apos;s local volatile memory and processed via client-side JavaScript,
            Canvas API, and WebAssembly. Your files are never transmitted to or saved on our servers.
          </p>
        </section>

        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Server-Assisted Tools & Ephemeral Data</h2>
          <p>
            For tools that inherently require internet network connectivity (such as the Website Status Checker or IP
            Inspector), our server executes the requested network ping or DNS lookup. We do not store query parameters,
            visited domains, or user IP histories. All operations are ephemeral and destroyed upon HTTP response termination.
          </p>
        </section>

        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Cookies and Local Storage</h2>
          <p>
            Toolify uses your browser&apos;s `localStorage` solely to save your local UI preferences: dark/light theme choice
            and favorited tool shortcuts. No tracking cookies or advertising pixels are used to monitor you across other websites.
          </p>
        </section>

        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Contact Information</h2>
          <p>
            If you have questions regarding this Privacy Policy or our security model, please contact us through our
            Contact page.
          </p>
        </section>
      </div>
    </div>
  );
}
