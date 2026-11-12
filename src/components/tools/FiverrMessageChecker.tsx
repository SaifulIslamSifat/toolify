"use client";

import { useState, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Trash2,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

interface PolicyRule {
  id: string;
  category: "Email & Address" | "Phone & WhatsApp" | "External Payment" | "Outside Communication" | "Review Policy" | "Academic Integrity";
  severity: "high" | "medium";
  pattern: RegExp;
  label: string;
  explanation: string;
  suggestedReplacement: string;
}

const POLICY_RULES: PolicyRule[] = [
  // Emails
  {
    id: "email_address",
    category: "Email & Address",
    severity: "high",
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi,
    label: "Email Address Detected",
    explanation:
      "Fiverr's automated filters immediately flag email addresses. Sharing personal emails can result in an account warning or temporary restriction.",
    suggestedReplacement: "via the Fiverr attachment tool",
  },
  {
    id: "email_mention",
    category: "Email & Address",
    severity: "high",
    pattern: /\b(my email|send me your email|email me|e-mail me|what is your email|share your email|inbox me at)\b/gi,
    label: "Email Request",
    explanation:
      "Requesting a buyer's email address triggers Fiverr's automated compliance warning.",
    suggestedReplacement: "send the project requirements and files directly here in the Fiverr order chat",
  },
  {
    id: "email_provider",
    category: "Email & Address",
    severity: "medium",
    pattern: /\b(gmail|yahoo mail|outlook\.com|hotmail)\b/gi,
    label: "Email Provider Mention",
    explanation:
      "Referencing email providers often alerts automated moderation scanners to possible off-platform communication.",
    suggestedReplacement: "the Fiverr message inbox",
  },

  // Phone / WhatsApp
  {
    id: "whatsapp",
    category: "Phone & WhatsApp",
    severity: "high",
    pattern: /\b(whatsapp|whats app|whatapp|wa\.me)\b/gi,
    label: "WhatsApp Mention",
    explanation:
      "WhatsApp is explicitly restricted on Fiverr. Requesting or providing WhatsApp details is one of the most common causes of account suspensions.",
    suggestedReplacement: "our Fiverr conversation",
  },
  {
    id: "phone_number",
    category: "Phone & WhatsApp",
    severity: "high",
    pattern: /\b(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/gi,
    label: "Phone Number Pattern",
    explanation:
      "Direct phone numbers trigger strict automated policy filters on Fiverr.",
    suggestedReplacement: "Fiverr messaging",
  },
  {
    id: "phone_call",
    category: "Phone & WhatsApp",
    severity: "high",
    pattern: /\b(call me|phone number|call on my phone|give me your number|text my number|my phone)\b/gi,
    label: "Phone Call Request",
    explanation:
      "Phone calls outside Fiverr are strictly prohibited. Voice communication is only permitted through Fiverr's official built-in Zoom order feature when required.",
    suggestedReplacement: "discuss the project details right here in chat",
  },

  // External Payment
  {
    id: "payment_processors",
    category: "External Payment",
    severity: "high",
    pattern: /\b(paypal|pay pal|crypto|bitcoin|btc|usdt|ethereum|venmo|zelle|cashapp|cash app|wire transfer|bank transfer|western union|payoneer)\b/gi,
    label: "External Payment Processor",
    explanation:
      "Accepting or soliciting payment outside of Fiverr is a severe violation of the Terms of Service and results in immediate account banning.",
    suggestedReplacement: "a standard Fiverr Custom Offer",
  },
  {
    id: "pay_outside",
    category: "External Payment",
    severity: "high",
    pattern: /\b(pay outside|pay me outside|pay directly|direct payment|pay me off-site|transfer money directly|pay cash)\b/gi,
    label: "Off-Platform Payment Proposal",
    explanation:
      "All transactions must occur strictly within Fiverr's escrow checkout system to protect both buyer and seller.",
    suggestedReplacement: "process the order securely through Fiverr's milestone checkout",
  },

  // Outside Communication
  {
    id: "outside_apps",
    category: "Outside Communication",
    severity: "high",
    pattern: /\b(skype|telegram|discord|wechat|google meet|talk outside|contact outside|reach me at|connect outside)\b/gi,
    label: "External Communication Platform",
    explanation:
      "Communicating outside Fiverr removes buyer/seller protections and violates the communication policy.",
    suggestedReplacement: "keep all communication in this official Fiverr order workspace",
  },
  {
    id: "zoom_unapproved",
    category: "Outside Communication",
    severity: "medium",
    pattern: /\b(zoom link|join my zoom|schedule a zoom)\b/gi,
    label: "Private Zoom Meeting Link",
    explanation:
      "External Zoom links are prohibited. If video consultation is part of your gig scope, schedule it exclusively using Fiverr's official integrated Zoom button on the order page.",
    suggestedReplacement: "schedule an official video consultation through our active Fiverr order page",
  },

  // Review / Feedback Manipulation
  {
    id: "review_rating",
    category: "Review Policy",
    severity: "high",
    pattern: /\b(5 star|5 stars|give me 5 stars|leave 5 star|positive review|good review|5-star rating|give a 5-star)\b/gi,
    label: "Review / 5-Star Solicitation",
    explanation:
      "Asking buyers specifically for a 5-star rating or positive review is strictly forbidden under Fiverr's Review Manipulation policy.",
    suggestedReplacement: "share your honest feedback and thoughts on the delivered work",
  },
  {
    id: "review_exchange",
    category: "Review Policy",
    severity: "high",
    pattern: /\b(review exchange|swap reviews|trade reviews)\b/gi,
    label: "Review Exchange",
    explanation:
      "Review trading or artificial rating manipulation is considered fraud on Fiverr and leads to permanent profile closure.",
    suggestedReplacement: "complete genuine client projects to earn authentic feedback",
  },

  // Academic Integrity
  {
    id: "academic_work",
    category: "Academic Integrity",
    severity: "high",
    pattern: /\b(do my homework|write my thesis|take my exam|academic paper for school|solve my test)\b/gi,
    label: "Academic Cheating Violation",
    explanation:
      "Completing graded academic coursework, exams, or theses on behalf of students is strictly prohibited on Fiverr.",
    suggestedReplacement: "provide tutoring guidance, editorial proofreading, and research assistance",
  },
];

interface DetectedIssue {
  ruleId: string;
  matchedText: string;
  index: number;
  length: number;
  category: PolicyRule["category"];
  severity: PolicyRule["severity"];
  label: string;
  explanation: string;
  suggestedReplacement: string;
}

export default function FiverrMessageChecker() {
  const [text, setText] = useState<string>(
    "Hi there! Thanks for reaching out. Yes, I can do this project for you. Could you please send me your email or whatsapp number so we can talk outside? Also, I can offer a discount if you pay directly via paypal. Once completed, please make sure to give me 5 stars!"
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Scan text for issues
  const detectedIssues: DetectedIssue[] = useMemo(() => {
    if (!text.trim()) return [];
    const issues: DetectedIssue[] = [];

    POLICY_RULES.forEach((rule) => {
      const regex = new RegExp(rule.pattern.source, "gi");
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        issues.push({
          ruleId: rule.id,
          matchedText: match[0],
          index: match.index,
          length: match[0].length,
          category: rule.category,
          severity: rule.severity,
          label: rule.label,
          explanation: rule.explanation,
          suggestedReplacement: rule.suggestedReplacement,
        });
      }
    });

    // Sort by position in text
    return issues.sort((a, b) => a.index - b.index);
  }, [text]);

  // Statistics
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;

  // Replace single issue with its suggested compliant wording
  const replaceIssue = (issue: DetectedIssue) => {
    const before = text.slice(0, issue.index);
    const after = text.slice(issue.index + issue.length);
    setText(before + issue.suggestedReplacement + after);
  };

  // Replace all detected issues with their compliant replacements
  const applyAllReplacements = () => {
    let updated = text;
    // Process backwards so indices remain valid
    const sortedDescending = [...detectedIssues].sort((a, b) => b.index - a.index);
    sortedDescending.forEach((issue) => {
      const before = updated.slice(0, issue.index);
      const after = updated.slice(issue.index + issue.length);
      updated = before + issue.suggestedReplacement + after;
    });
    setText(updated);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setText("");
  };

  // Visual text preview with highlighted terms
  const renderHighlightedPreview = () => {
    if (!text) {
      return (
        <span className="text-slate-400 italic">
          Type or paste your message above to see a real-time compliance scan...
        </span>
      );
    }

    if (detectedIssues.length === 0) {
      return <span className="text-slate-700 dark:text-slate-300">{text}</span>;
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    detectedIssues.forEach((issue, idx) => {
      if (issue.index > lastIndex) {
        segments.push(
          <span key={`clean-${idx}`}>{text.slice(lastIndex, issue.index)}</span>
        );
      }

      segments.push(
        <mark
          key={`issue-${idx}`}
          title={`${issue.label}: ${issue.explanation}`}
          className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-b-2 border-rose-500 font-bold px-1 py-0.5 rounded cursor-help"
        >
          {text.slice(issue.index, issue.index + issue.length)}
        </mark>
      );

      lastIndex = issue.index + issue.length;
    });

    if (lastIndex < text.length) {
      segments.push(<span key="clean-end">{text.slice(lastIndex)}</span>);
    }

    return segments;
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Safety Status Banner */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          detectedIssues.length === 0
            ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200"
            : "border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {detectedIssues.length === 0 ? (
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
          )}
          <div>
            <h3 className="text-base font-extrabold">
              {detectedIssues.length === 0
                ? "Safe & Policy-Compliant Message"
                : `${detectedIssues.length} Potential Policy ${
                    detectedIssues.length === 1 ? "Issue" : "Issues"
                  } Detected`}
            </h3>
            <p className="text-xs opacity-90 mt-0.5">
              {detectedIssues.length === 0
                ? "No sensitive external contact, payment, or TOS-restricted phrases detected. Ready to send!"
                : "Your message contains phrases that may trigger automated moderation flags or account warnings."}
            </p>
          </div>
        </div>

        {detectedIssues.length > 0 && (
          <button
            onClick={applyAllReplacements}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex-shrink-0 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply All Safe Fixes</span>
          </button>
        )}
      </div>

      {/* Editor & Scan Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Message Input Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Draft Fiverr Client Message
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} characters</span>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={11}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or write your Fiverr message here..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm leading-relaxed focus:outline-none focus:border-brand-500 shadow-inner resize-y font-sans"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleClear}
              disabled={!text}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-500 disabled:opacity-40 text-xs font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Text</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={!text}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied Message!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Message</span>
                </>
              )}
            </button>
          </div>

          {/* Live Highlighted Preview */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
              Visual Flag Inspection
            </span>
            <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {renderHighlightedPreview()}
            </div>
          </div>
        </div>

        {/* Right Column: Detected Issues & Safe Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Policy Analysis & Suggested Alternatives
            </h4>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {detectedIssues.length} Flags
            </span>
          </div>

          {detectedIssues.length === 0 ? (
            <div className="p-8 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/10 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h5 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                100% Policy-Safe Content
              </h5>
              <p className="text-xs text-emerald-700 dark:text-emerald-300/80 max-w-sm mx-auto leading-relaxed">
                No off-platform contact attempts, prohibited payment processors, or review solicitations found. You can
                send this safely to your client!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {detectedIssues.map((issue, idx) => (
                <div
                  key={`${issue.ruleId}-${idx}`}
                  className="p-4 rounded-2xl border border-rose-200/90 dark:border-rose-900/80 bg-white dark:bg-slate-900 shadow-sm space-y-3 hover:border-rose-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                      {issue.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Position: {issue.index}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-medium">Flagged Phrase:</span>
                    <div className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 p-2 rounded-lg mt-0.5 break-all">
                      &quot;{issue.matchedText}&quot;
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {issue.explanation}
                  </p>

                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Compliant Alternative:
                    </span>
                    <p className="text-xs text-emerald-900 dark:text-emerald-100 italic">
                      &quot;{issue.suggestedReplacement}&quot;
                    </p>
                    <button
                      onClick={() => replaceIssue(issue)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
                    >
                      <Check className="w-3 h-3" />
                      <span>Use This Alternative</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
