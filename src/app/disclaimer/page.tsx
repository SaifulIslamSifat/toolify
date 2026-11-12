import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - Toolify",
  description: "General disclaimers regarding calculations, medical indicators, and network utilities on Toolify.",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Legal Disclaimer</h1>
        <p className="text-xs text-slate-400 mt-2">Effective: November 2026</p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Health & Fitness Calculators</h2>
          <p>
            Calculators on this website (including the BMI Calculator and Calorie estimators) are provided for general
            informational and screening purposes only. They do not constitute professional medical advice, clinical
            diagnoses, or treatment plans. Always consult a licensed healthcare practitioner for medical determinations.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Financial Calculators</h2>
          <p>
            Loan, mortgage, and discount calculators provide mathematical estimates based on user inputs. They do not
            account for individual lender fees, fluctuating escrow amounts, or specialized municipal taxes.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Network & Internet Utilities</h2>
          <p>
            Network diagnostic tools (such as IP lookup, HTTP header checkers, and website status testers) are designed for
            legitimate troubleshooting and administrative evaluation of publicly reachable resources.
          </p>
        </div>
      </div>
    </div>
  );
}
