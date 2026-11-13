"use client";

import { useState, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export interface PolicyRule {
  id: string;
  category:
    | "Payment Terms"
    | "Direct Contact"
    | "Email & Messaging"
    | "External Platforms"
    | "Review Policy"
    | "Academic Integrity";
  severity: "high" | "medium";
  pattern: RegExp;
  label: string;
  explanation: string;
  compliantPhrase: string;
  customSafeWord?: string;
}

// Configurable keyword and phrase rules dictionary
export const POLICY_RULES: PolicyRule[] = [
  // 1. Payment Terms & Phrases
  {
    id: "pay_word",
    category: "Payment Terms",
    severity: "high",
    pattern: /(payments?|paying|paid|(?<!pa)pay(?!a))/gi,
    label: "Payment Keyword",
    explanation:
      "Direct mentions of 'pay' or 'payment' trigger Fiverr's payment filter. Off-platform payment solicitation violates Fiverr TOS.",
    compliantPhrase: "complete the order via Fiverr",
  },
  {
    id: "payment_processors",
    category: "Payment Terms",
    severity: "high",
    pattern:
      /(paypal|pay\s*pal|crypto|cryptocurrency|bitcoin|btc|usdt|ethereum|venmo|(?<!ga)zelle|cash\s*app|cashapp|wire\s*transfer|bank\s*transfer|western\s*union|payoneer|(?<!other|like|step|clock)wise|moneygram)/gi,
    label: "External Payment Method",
    explanation:
      "Explicit payment processor names will immediately trigger automated account flags.",
    compliantPhrase: "a standard Fiverr Custom Offer",
  },
  {
    id: "offplatform_payment",
    category: "Payment Terms",
    severity: "high",
    pattern:
      /(pay\s*outside|pay\s*me\s*outside|pay\s*directly|direct\s*payment|pay\s*me\s*off-?site|transfer\s*money\s*directly|pay\s*cash|off-?platform\s*payment)/gi,
    label: "Direct Payment Request",
    explanation:
      "Asking buyers to pay directly outside Fiverr's escrow checkout leads to permanent account suspension.",
    compliantPhrase: "process everything safely through Fiverr checkout",
  },

  // 2. Email Mentions & Addresses
  {
    id: "email_word",
    category: "Email & Messaging",
    severity: "high",
    pattern: /(emails?|e-mails?)/gi,
    label: "Email Mention",
    explanation:
      "Mentioning 'email' alerts Fiverr's automated compliance monitors to potential off-platform communication.",
    compliantPhrase: "Fiverr inbox message",
    customSafeWord: "e-mail",
  },
  {
    id: "email_address",
    category: "Email & Messaging",
    severity: "high",
    pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/gi,
    label: "Email Address",
    explanation:
      "Sharing raw email addresses is strictly flagged by Fiverr's automated inbox scanners.",
    compliantPhrase: "via Fiverr order attachments",
  },
  {
    id: "email_phrases",
    category: "Email & Messaging",
    severity: "high",
    pattern:
      /(send\s*me\s*your\s*email|my\s*email\s*is|email\s*me\s*at|share\s*your\s*email|what\s*is\s*your\s*email|inbox\s*me\s*at)/gi,
    label: "Email Solicitation Phrase",
    explanation:
      "Requesting a buyer's email address is flagged as an attempt to bypass Fiverr communication.",
    compliantPhrase: "share the project details directly here",
  },
  {
    id: "email_providers",
    category: "Email & Messaging",
    severity: "medium",
    pattern: /(gmail(\.com)?|yahoo\s*mail|hotmail(\.com)?|outlook\.com)/gi,
    label: "Email Provider Mention",
    explanation:
      "Referring to specific email service providers is often flagged by content moderation.",
    compliantPhrase: "the Fiverr messaging system",
  },

  // 3. Direct Contact & Phone
  {
    id: "whatsapp",
    category: "Direct Contact",
    severity: "high",
    pattern: /(whats[ -]?app|whatapp|wa\.me)/gi,
    label: "WhatsApp Mention",
    explanation:
      "WhatsApp communication is strictly banned on Fiverr and is a top cause of instant account bans.",
    compliantPhrase: "our Fiverr conversation",
  },
  {
    id: "contact_me",
    category: "Direct Contact",
    severity: "high",
    pattern:
      /(contact\s*me|contact\s*us|reach\s*me|reach\s*out\s*to\s*me|talk\s*outside|communicate\s*outside|outside\s*fiverr|off-?platform|offsite)/gi,
    label: "Outside Communication Phrase",
    explanation:
      "Asking a client to contact you outside Fiverr violates the Terms of Service.",
    compliantPhrase: "message me directly here on Fiverr",
  },
  {
    id: "phone_phrase",
    category: "Direct Contact",
    severity: "high",
    pattern:
      /(phone\s*number|phone\s*no\.?|cell\s*number|mobile\s*number|call\s*me|call\s*on\s*my\s*phone|give\s*me\s*your\s*number|text\s*my\s*number|my\s*phone|my\s*number|(?<!micro|head|ear|mega|saxo)phones?)/gi,
    label: "Phone Contact Request",
    explanation:
      "Direct phone calls and exchanging phone numbers are prohibited on Fiverr.",
    compliantPhrase: "discuss details right here in chat",
  },
  {
    id: "phone_digits",
    category: "Direct Contact",
    severity: "high",
    pattern: /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/gi,
    label: "Phone Number Pattern",
    explanation:
      "Numerical telephone formats are automatically caught by pattern filters.",
    compliantPhrase: "Fiverr messaging",
  },

  // 4. External Platforms
  {
    id: "external_platforms",
    category: "External Platforms",
    severity: "high",
    pattern:
      /(skype|telegram|discord|wechat|viber|\bsignal\b|google\s*meet|teams\s*link)/gi,
    label: "External Chat App",
    explanation:
      "Exchanging external communication channels removes order tracking and client protection.",
    compliantPhrase: "official Fiverr order chat",
  },
  {
    id: "zoom_unapproved",
    category: "External Platforms",
    severity: "medium",
    pattern: /(zoom\s*(link|meeting|call|session)|join\s*my\s*zoom|schedule\s*a\s*zoom|private\s*zoom)/gi,
    label: "Private Zoom Meeting",
    explanation:
      "Third-party video links are prohibited. Use Fiverr's official integrated Zoom meeting feature on the order page if video is required.",
    compliantPhrase: "schedule an official video meeting via the Fiverr order page",
  },

  // 5. Review & Rating Policy
  {
    id: "review_solicitation",
    category: "Review Policy",
    severity: "high",
    pattern:
      /(5[- ]?stars?|five[- ]?stars?|positive\s*review|leave\s*5\s*star|good\s*review|5-star\s*rating|give\s*5\s*star)/gi,
    label: "Review Solicitation",
    explanation:
      "Asking specifically for 5 stars or positive ratings violates Fiverr's Feedback Manipulation policy.",
    compliantPhrase: "share your honest feedback on the delivered work",
  },
  {
    id: "review_exchange",
    category: "Review Policy",
    severity: "high",
    pattern: /(review\s*exchange|swap\s*reviews?|trade\s*reviews?)/gi,
    label: "Review Exchange",
    explanation:
      "Review swapping is classified as fraudulent manipulation and results in permanent ban.",
    compliantPhrase: "deliver authentic client work",
  },

  // 6. Academic Integrity
  {
    id: "academic_work",
    category: "Academic Integrity",
    severity: "high",
    pattern:
      /(do\s*my\s*homework|write\s*my\s*thesis|take\s*my\s*exam|solve\s*my\s*test|academic\s*paper\s*for\s*school|write\s*my\s*essay)/gi,
    label: "Academic Integrity Violation",
    explanation:
      "Completing graded academic homework or university exams on behalf of students is prohibited.",
    compliantPhrase: "provide editorial proofreading and tutoring guidance",
  },
];

export interface DetectedIssue {
  id: string;
  matchedText: string;
  startIndex: number;
  endIndex: number;
  category: PolicyRule["category"];
  severity: PolicyRule["severity"];
  label: string;
  explanation: string;
  compliantPhrase: string;
  safeReplacement: string;
}

/**
 * Transforms a detected sensitive word or phrase into its safe hyphenated form,
 * preserving exact casing (e.g. "pay" -> "p-ay", "PAY" -> "P-AY", "email" -> "e-mail").
 */
export function generateSafeWord(word: string, customOverride?: string): string {
  if (customOverride) {
    if (word === word.toUpperCase()) return customOverride.toUpperCase();
    if (word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()) {
      return customOverride[0].toUpperCase() + customOverride.slice(1);
    }
    return customOverride;
  }

  // Email address with @: example@example.com -> example [at] example [dot] com
  if (word.includes("@")) {
    return word.replace("@", " [at] ").replace(/\./g, " [dot] ");
  }

  // Multi-word phrase: e.g. "contact me", "outside fiverr", "phone number"
  if (word.includes(" ")) {
    return word
      .split(" ")
      .map((part) => (part.length >= 3 ? generateSafeWord(part) : part))
      .join(" ");
  }

  // Single word: insert hyphen after the first character (e.g. pay -> p-ay, email -> e-mail, payment -> p-ayment)
  if (word.length >= 3) {
    if (word.includes("-")) return word;
    return word[0] + "-" + word.slice(1);
  }

  return word;
}

export default function FiverrMessageChecker() {
  const [text, setText] = useState<string>(
    "please pay in fiverr then we will talk in email."
  );
  const [safeTextOutput, setSafeTextOutput] = useState<string>("");
  const [copiedOriginal, setCopiedOriginal] = useState<boolean>(false);
  const [copiedSafe, setCopiedSafe] = useState<boolean>(false);
  const [safeGenerated, setSafeGenerated] = useState<boolean>(false);

  // Scan text for policy matches with robust de-duplication and boundary handling
  const detectedIssues: DetectedIssue[] = useMemo(() => {
    if (!text.trim()) return [];
    const allMatches: DetectedIssue[] = [];

    POLICY_RULES.forEach((rule) => {
      const regex = new RegExp(rule.pattern.source, "gi");
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        const rawMatched = match[0];
        allMatches.push({
          id: rule.id,
          matchedText: rawMatched,
          startIndex: match.index,
          endIndex: match.index + rawMatched.length,
          category: rule.category,
          severity: rule.severity,
          label: rule.label,
          explanation: rule.explanation,
          compliantPhrase: rule.compliantPhrase,
          safeReplacement: generateSafeWord(rawMatched, rule.customSafeWord),
        });
      }
    });

    // Sort by starting index, then longest match first to avoid nested collision
    allMatches.sort((a, b) => {
      if (a.startIndex !== b.startIndex) return a.startIndex - b.startIndex;
      return (b.endIndex - b.startIndex) - (a.endIndex - a.startIndex);
    });

    // Remove overlapping matches cleanly
    const nonOverlapping: DetectedIssue[] = [];
    for (const item of allMatches) {
      const hasOverlap = nonOverlapping.some(
        (existing) =>
          item.startIndex < existing.endIndex && item.endIndex > existing.startIndex
      );
      if (!hasOverlap) {
        nonOverlapping.push(item);
      }
    }

    return nonOverlapping.sort((a, b) => a.startIndex - b.startIndex);
  }, [text]);

  // Compute the safe text string based on current text and detected issues
  const computedSafeText = useMemo(() => {
    if (!text) return "";
    if (detectedIssues.length === 0) return text;

    let result = text;
    // Replace backwards so earlier indices remain strictly valid
    const descending = [...detectedIssues].sort((a, b) => b.startIndex - a.startIndex);
    descending.forEach((issue) => {
      result =
        result.slice(0, issue.startIndex) +
        issue.safeReplacement +
        result.slice(issue.endIndex);
    });
    return result;
  }, [text, detectedIssues]);

  // Handler for the prominent "Safe Text" button
  const handleGenerateSafeText = () => {
    setSafeTextOutput(computedSafeText);
    setSafeGenerated(true);
  };

  // Copy Original Message
  const handleCopyOriginal = async () => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    }
  };

  // Copy Safe Text
  const handleCopySafeText = async () => {
    const textToCopy = safeTextOutput || computedSafeText;
    if (!textToCopy) return;
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopiedSafe(true);
      setTimeout(() => setCopiedSafe(false), 2000);
    }
  };

  // Clear all text and outputs
  const handleClear = () => {
    setText("");
    setSafeTextOutput("");
    setSafeGenerated(false);
  };

  // Quick preset loader for testing and user guidance
  const loadExample = (exampleText: string) => {
    setText(exampleText);
    setSafeTextOutput("");
    setSafeGenerated(false);
  };

  // Text statistics
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;

  // Visual highlight preview
  const renderHighlightedPreview = () => {
    if (!text) {
      return (
        <span className="text-slate-400 italic">
          Type or paste a message above to inspect flagged terms...
        </span>
      );
    }

    if (detectedIssues.length === 0) {
      return (
        <span className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
          {text}
        </span>
      );
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    detectedIssues.forEach((issue, idx) => {
      if (issue.startIndex > lastIndex) {
        segments.push(
          <span key={`clean-${idx}`}>
            {text.slice(lastIndex, issue.startIndex)}
          </span>
        );
      }

      segments.push(
        <mark
          key={`issue-${idx}`}
          title={`${issue.label}: ${issue.explanation} → Safe: ${issue.safeReplacement}`}
          className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-b-2 border-rose-500 font-semibold px-1 py-0.5 rounded cursor-help"
        >
          {text.slice(issue.startIndex, issue.endIndex)}
        </mark>
      );

      lastIndex = issue.endIndex;
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
            ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
            : "border-amber-200 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {detectedIssues.length === 0 ? (
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
          )}
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2">
              {detectedIssues.length === 0
                ? "No Problematic Terms Detected"
                : `${detectedIssues.length} Potentially Problematic ${
                    detectedIssues.length === 1 ? "Term" : "Terms"
                  } Detected`}
            </h3>
            <p className="text-xs opacity-90 mt-0.5">
              {detectedIssues.length === 0
                ? "Your message does not trigger any of the restricted payment, external contact, or policy rules."
                : "The terms highlighted below may trigger Fiverr's automated compliance warnings or moderation review."}
            </p>
          </div>
        </div>

        {/* Prominent Safe Text button in the banner */}
        {detectedIssues.length > 0 && (
          <button
            onClick={handleGenerateSafeText}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Safe Text</span>
          </button>
        )}
      </div>

      {/* Quick Test Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Quick Test Examples
          </span>
          <span className="text-[11px] text-slate-400">Click to test instant scan</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "please pay in fiverr then we will talk in email.",
            "iampay and sendtoemail please.",
            "PAY through Fiverr.",
            "Please contact me on WhatsApp.",
            "My EMAIL address is example@example.com.",
            "I will send the payment through Fiverr.",
          ].map((example, i) => (
            <button
              key={i}
              onClick={() => loadExample(example)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-brand-600 hover:border-brand-300 transition-colors truncate max-w-[280px]"
              title={example}
            >
              Ex {i + 1}: &quot;{example}&quot;
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input / Original vs Safe Text Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Original Message Input */}
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span>Original Message</span>
              {detectedIssues.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                  {detectedIssues.length} Matches
                </span>
              )}
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={15}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setSafeGenerated(false);
              }}
              placeholder="Paste or write your Fiverr message here..."
              className="w-full min-h-[380px] sm:min-h-[420px] p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm leading-relaxed focus:outline-none focus:border-brand-500 shadow-inner resize-y font-sans transition-all"
            />
          </div>

          {/* Action Toolbar for Original Message */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                disabled={!text}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-500 disabled:opacity-40 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>

              <button
                onClick={handleCopyOriginal}
                disabled={!text}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 disabled:opacity-40 text-xs font-bold transition-colors shadow-sm"
              >
                {copiedOriginal ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Original</span>
                  </>
                )}
              </button>
            </div>

            {/* Prominent Safe Text button */}
            <button
              onClick={handleGenerateSafeText}
              disabled={!text}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Safe Text</span>
            </button>
          </div>

          {/* Visual Highlight Inspection Area */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-600 dark:text-slate-300 tracking-wider">
                Visual Highlight of Detected Terms
              </span>
              <span className="text-[11px] text-slate-400">
                {detectedIssues.length === 0
                  ? "Clean text"
                  : "Orange/Red marks = policy risks"}
              </span>
            </div>
            <div className="text-sm leading-relaxed min-h-[260px] max-h-[440px] overflow-y-auto font-sans p-4 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              {renderHighlightedPreview()}
            </div>
          </div>
        </div>

        {/* Right Column: Suggested Safe Text & Output */}
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suggested Safe Text</span>
            </label>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
              {safeGenerated || safeTextOutput ? "Safe Revision Ready" : "Click Safe Text"}
            </span>
          </div>

          {/* Safe Text Output Box */}
          <div className="relative">
            <textarea
              rows={15}
              readOnly
              value={safeTextOutput || (safeGenerated ? computedSafeText : "")}
              placeholder="Click the 'Safe Text' button to generate a revised message with safe wording..."
              className="w-full min-h-[380px] sm:min-h-[420px] p-5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10 text-slate-900 dark:text-white text-sm leading-relaxed focus:outline-none shadow-inner resize-y font-sans font-medium transition-all"
            />
          </div>

          {/* Safe Text Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-xs text-slate-500 max-w-xs sm:max-w-md">
              Problematic words rewritten with safe separators (e.g. <code>pay</code> &rarr; <code>p-ay</code>, <code>email</code> &rarr; <code>e-mail</code>)
            </span>

            <button
              onClick={handleCopySafeText}
              disabled={!(safeTextOutput || (safeGenerated && computedSafeText))}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex-shrink-0"
            >
              {copiedSafe ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Copied Safe Text!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Safe Text</span>
                </>
              )}
            </button>
          </div>

          {/* List of Detected Terms */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Detected Terms & Revisions
              </h4>
              <span className="text-xs font-mono text-slate-400">
                {detectedIssues.length} found
              </span>
            </div>

            {detectedIssues.length === 0 ? (
              <div className="min-h-[260px] p-6 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/10 text-center flex flex-col items-center justify-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-1" />
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  All clear! No policy-sensitive terms found.
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-sm">
                  The current message does not contain flagged payment or off-platform communication terms.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 min-h-[260px] max-h-[440px] overflow-y-auto pr-1">
                {detectedIssues.map((issue, idx) => (
                  <div
                    key={`${issue.id}-${idx}`}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                          {issue.matchedText}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          pos: {issue.startIndex}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {issue.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {issue.explanation}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Safe:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {issue.safeReplacement}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>Disclaimer:</strong> This tool provides guidance only. It does not guarantee Fiverr approval or replace Fiverr&apos;s official policies.
        </p>
      </div>
    </div>
  );
}
