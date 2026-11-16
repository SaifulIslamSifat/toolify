"use client";

import { useState } from "react";
import {
  Search,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  FileText,
  Printer,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Globe,
  Clock,
  Zap,
  Image as ImageIcon,
  Copy,
  Check,
  Layers,
  ArrowRight,
  Info,
  RefreshCw,
  Eye,
  Sliders,
} from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface AuditScores {
  overall: number;
  performance: number;
  seo: number;
  security: number;
  mobile: number;
}

interface WebVitalItem {
  value: string;
  status: "good" | "warning" | "poor";
}

interface WebVitals {
  lcp: WebVitalItem;
  fid: WebVitalItem;
  cls: WebVitalItem;
  fcp: WebVitalItem;
  speedIndex: WebVitalItem;
  ttfb: WebVitalItem;
}

interface PageWeight {
  totalKb: number;
  htmlKb: number;
  jsKb: number;
  cssKb: number;
  imagesKb: number;
}

interface AuditIssue {
  id: string;
  category: "performance" | "seo" | "security" | "mobile";
  severity: "critical" | "warning" | "good";
  title: string;
  description: string;
  recommendation: string;
  codeSnippet?: string;
}

interface AuditResponse {
  url: string;
  domain: string;
  auditTimestamp: string;
  statusCode: number;
  responseTimeMs: number;
  scores: AuditScores;
  webVitals: WebVitals;
  pageWeight: PageWeight;
  meta: {
    title: string;
    titleLength: number;
    description: string;
    descriptionLength: number;
    canonical: string;
    robots: string;
    lang: string;
    charset: string;
    viewport: string;
    isHttps: boolean;
  };
  social: {
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    ogSiteName: string;
    twitterCard: string;
    twitterTitle: string;
    twitterImage: string;
  };
  headings: {
    h1Count: number;
    h1Items: string[];
    h2Count: number;
    h2Items: string[];
    h3Count: number;
  };
  images: {
    total: number;
    withAlt: number;
    missingAlt: number;
    altPercentage: number;
    sampleList: { src: string; alt: string; hasAlt: boolean }[];
  };
  links: {
    total: number;
    internal: number;
    external: number;
    emptyAnchors: number;
  };
  content: {
    wordCount: number;
    textToHtmlRatio: number;
    schemas: string[];
  };
  headers: {
    contentEncoding: string;
    server: string;
    contentType: string;
    strictTransportSecurity: string | null;
    contentSecurityPolicy: string | null;
    xFrameOptions: string | null;
    xContentTypeOptions: string | null;
    cacheControl: string | null;
  };
  issues: AuditIssue[];
}

export default function SeoPerformanceChecker() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "seo" | "security" | "recommendations">("overview");
  const [issueFilter, setIssueFilter] = useState<"all" | "critical" | "warning" | "good">("all");
  const [devicePreview, setDevicePreview] = useState<"desktop" | "mobile">("desktop");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDoc, setIsExportingDoc] = useState(false);

  const PRESETS = [
    { label: "Google", domain: "google.com" },
    { label: "GitHub", domain: "github.com" },
    { label: "Wikipedia", domain: "wikipedia.org" },
    { label: "Vercel", domain: "vercel.com" },
    { label: "Apple", domain: "apple.com" },
  ];

  const handleAudit = async (targetUrl?: string) => {
    const inputUrl = (targetUrl || url).trim();
    if (!inputUrl) {
      setError("Please enter a website link or domain name to audit.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAuditData(null);
    setLoadingStep("Connecting to target server and verifying DNS...");

    try {
      const step1 = setTimeout(() => setLoadingStep("Fetching HTML payload and measuring TTFB latency..."), 600);
      const step2 = setTimeout(() => setLoadingStep("Analyzing on-page SEO, meta tags, and headings..."), 1300);
      const step3 = setTimeout(() => setLoadingStep("Evaluating Core Web Vitals, images, and security headers..."), 2000);

      const res = await fetch("/api/seo/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });

      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to audit website.");
      }

      setAuditData(data);
      setUrl(inputUrl);
    } catch (err: any) {
      setError(err.message || "Failed to reach website. Please check the URL syntax and make sure the site is publicly accessible.");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const copyCode = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // --- EXPORT TO WORD DOC ---
  const handleExportDoc = () => {
    if (!auditData) return;
    setIsExportingDoc(true);

    try {
      const { domain, url: finalUrl, auditTimestamp, scores, webVitals, pageWeight, meta, headings, images, issues } = auditData;

      const docHtml = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>SEO Performance Audit Report - ${domain}</title>
  <style>
    body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1e293b; padding: 24pt; }
    h1 { font-size: 24pt; color: #4338ca; margin-bottom: 4pt; }
    h2 { font-size: 16pt; color: #1e1b4b; border-bottom: 2pt solid #e0e7ff; padding-bottom: 4pt; margin-top: 18pt; }
    h3 { font-size: 13pt; color: #3730a3; margin-top: 12pt; }
    p { margin: 4pt 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 14pt; font-size: 10pt; }
    th { background-color: #f1f5f9; color: #334155; font-weight: bold; text-align: left; padding: 6pt 8pt; border: 1pt solid #cbd5e1; }
    td { padding: 6pt 8pt; border: 1pt solid #cbd5e1; }
    .badge { display: inline-block; padding: 2pt 6pt; border-radius: 4pt; font-weight: bold; font-size: 9pt; }
    .badge-good { background-color: #dcfce7; color: #166534; }
    .badge-warning { background-color: #fef3c7; color: #92400e; }
    .badge-critical { background-color: #fee2e2; color: #991b1b; }
    .score-card { background-color: #f8fafc; border: 1pt solid #e2e8f0; padding: 12pt; border-radius: 6pt; margin-bottom: 12pt; }
  </style>
</head>
<body>
  <h1>SEO & Performance Audit Report</h1>
  <p><strong>Target URL:</strong> <a href="${finalUrl}">${finalUrl}</a></p>
  <p><strong>Audited Domain:</strong> ${domain}</p>
  <p><strong>Audit Date:</strong> ${new Date(auditTimestamp).toLocaleString()}</p>
  <p><strong>Generated By:</strong> Toolify Online Utilities (https://toolify.local)</p>

  <div class="score-card">
    <h2>Executive Performance Summary</h2>
    <table>
      <tr>
        <th>Category</th>
        <th>Score</th>
        <th>Rating</th>
      </tr>
      <tr>
        <td><strong>Overall Health Score</strong></td>
        <td><strong>${scores.overall} / 100</strong></td>
        <td><span class="badge ${scores.overall >= 85 ? "badge-good" : scores.overall >= 70 ? "badge-warning" : "badge-critical"}">${scores.overall >= 85 ? "Excellent (Grade A)" : scores.overall >= 70 ? "Good (Grade B)" : "Needs Optimization"}</span></td>
      </tr>
      <tr>
        <td>Performance & Speed</td>
        <td>${scores.performance} / 100</td>
        <td>${scores.performance >= 80 ? "Fast" : "Moderate"}</td>
      </tr>
      <tr>
        <td>On-Page SEO</td>
        <td>${scores.seo} / 100</td>
        <td>${scores.seo >= 80 ? "Optimized" : "Suboptimal"}</td>
      </tr>
      <tr>
        <td>Security & Best Practices</td>
        <td>${scores.security} / 100</td>
        <td>${scores.security >= 80 ? "Secure" : "Vulnerable"}</td>
      </tr>
      <tr>
        <td>Mobile Readiness</td>
        <td>${scores.mobile} / 100</td>
        <td>${scores.mobile >= 80 ? "Mobile Friendly" : "Desktop Oriented"}</td>
      </tr>
    </table>
  </div>

  <h2>Core Web Vitals & Latency</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Value</th>
      <th>Target Status</th>
      <th>Explanation</th>
    </tr>
    <tr>
      <td><strong>Largest Contentful Paint (LCP)</strong></td>
      <td>${webVitals.lcp.value}</td>
      <td><span class="badge ${webVitals.lcp.status === "good" ? "badge-good" : "badge-warning"}">${webVitals.lcp.status.toUpperCase()}</span></td>
      <td>Measures main content render speed (Good: &lt; 2.5s)</td>
    </tr>
    <tr>
      <td><strong>Interaction to Next Paint (INP/FID)</strong></td>
      <td>${webVitals.fid.value}</td>
      <td><span class="badge ${webVitals.fid.status === "good" ? "badge-good" : "badge-warning"}">${webVitals.fid.status.toUpperCase()}</span></td>
      <td>Measures page interactivity responsiveness (Good: &lt; 100ms)</td>
    </tr>
    <tr>
      <td><strong>Cumulative Layout Shift (CLS)</strong></td>
      <td>${webVitals.cls.value}</td>
      <td><span class="badge ${webVitals.cls.status === "good" ? "badge-good" : "badge-warning"}">${webVitals.cls.status.toUpperCase()}</span></td>
      <td>Measures visual layout stability (Good: &lt; 0.1)</td>
    </tr>
    <tr>
      <td><strong>First Contentful Paint (FCP)</strong></td>
      <td>${webVitals.fcp.value}</td>
      <td><span class="badge ${webVitals.fcp.status === "good" ? "badge-good" : "badge-warning"}">${webVitals.fcp.status.toUpperCase()}</span></td>
      <td>Time until first DOM content is painted (Good: &lt; 1.8s)</td>
    </tr>
    <tr>
      <td><strong>Server TTFB Latency</strong></td>
      <td>${webVitals.ttfb.value}</td>
      <td><span class="badge ${webVitals.ttfb.status === "good" ? "badge-good" : "badge-warning"}">${webVitals.ttfb.status.toUpperCase()}</span></td>
      <td>Time to First Byte from origin server (Good: &lt; 600ms)</td>
    </tr>
  </table>

  <h2>Page Weight & Asset Breakdown</h2>
  <p><strong>Total Estimated Page Weight:</strong> ${pageWeight.totalKb} KB</p>
  <ul>
    <li>HTML Document: ${pageWeight.htmlKb} KB</li>
    <li>JavaScript Payloads: ${pageWeight.jsKb} KB</li>
    <li>CSS Stylesheets: ${pageWeight.cssKb} KB</li>
    <li>Images & Media: ${pageWeight.imagesKb} KB</li>
  </ul>

  <h2>On-Page SEO Factors</h2>
  <table>
    <tr><th>Parameter</th><th>Value</th><th>Status</th></tr>
    <tr>
      <td>Page Title</td>
      <td>${meta.title || "(None)"}</td>
      <td>${meta.titleLength >= 40 && meta.titleLength <= 65 ? "Optimal (40-65 chars)" : "Needs Review (" + meta.titleLength + " chars)"}</td>
    </tr>
    <tr>
      <td>Meta Description</td>
      <td>${meta.description || "(None)"}</td>
      <td>${meta.descriptionLength >= 120 && meta.descriptionLength <= 160 ? "Optimal (120-160 chars)" : "Needs Review (" + meta.descriptionLength + " chars)"}</td>
    </tr>
    <tr>
      <td>H1 Headings</td>
      <td>${headings.h1Count} found: ${headings.h1Items.join(" | ") || "(None)"}</td>
      <td>${headings.h1Count === 1 ? "Perfect (1 H1)" : headings.h1Count === 0 ? "Missing H1" : "Multiple H1s"}</td>
    </tr>
    <tr>
      <td>Image Alt Attributes</td>
      <td>${images.withAlt} of ${images.total} images have alt tags (${images.altPercentage}%)</td>
      <td>${images.altPercentage >= 90 ? "Excellent" : "Needs Optimization"}</td>
    </tr>
    <tr>
      <td>Canonical Tag</td>
      <td>${meta.canonical || "(None)"}</td>
      <td>${meta.canonical ? "Present" : "Missing"}</td>
    </tr>
    <tr>
      <td>HTTPS Security</td>
      <td>${meta.isHttps ? "Enabled (HTTPS)" : "Insecure (HTTP)"}</td>
      <td>${meta.isHttps ? "Secure" : "Critical Issue"}</td>
    </tr>
  </table>

  <h2>Prioritized Action Plan & Fixes</h2>
  <table>
    <tr>
      <th>Severity</th>
      <th>Issue</th>
      <th>Recommended Remediation</th>
    </tr>
    ${issues
      .map(
        (iss) => `
    <tr>
      <td><span class="badge ${iss.severity === "critical" ? "badge-critical" : iss.severity === "warning" ? "badge-warning" : "badge-good"}">${iss.severity.toUpperCase()}</span></td>
      <td><strong>${iss.title}</strong><br><small>${iss.description}</small></td>
      <td>${iss.recommendation}</td>
    </tr>`
      )
      .join("")}
  </table>

  <hr>
  <p><small>&copy; ${new Date().getFullYear()} Toolify. All rights reserved. Free client-side productivity utilities.</small></p>
</body>
</html>`;

      const blob = new Blob([docHtml], { type: "application/msword;charset=utf-8" });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `seo-performance-report-${domain}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert("Failed to export Word DOC: " + err.message);
    } finally {
      setIsExportingDoc(false);
    }
  };

  // --- EXPORT TO PDF REPORT ---
  const handleExportPdf = async () => {
    if (!auditData) return;
    setIsExportingPdf(true);

    try {
      const { domain, url: finalUrl, auditTimestamp, scores, webVitals, meta, headings, images, issues } = auditData;

      const pdfDoc = await PDFDocument.create();
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Page 1: Overview & Performance
      let page = pdfDoc.addPage([595.28, 841.89]); // A4
      const { width, height } = page.getSize();
      let y = height - 50;

      // Header Banner
      page.drawRectangle({
        x: 40,
        y: y - 55,
        width: width - 80,
        height: 65,
        color: rgb(0.26, 0.22, 0.79), // Brand Indigo
      });

      page.drawText("TOOLIFY SEO & PERFORMANCE AUDIT", {
        x: 55,
        y: y - 18,
        size: 16,
        font: fontBold,
        color: rgb(1, 1, 1),
      });

      page.drawText(`Domain: ${domain}  •  Date: ${new Date(auditTimestamp).toLocaleDateString()}`, {
        x: 55,
        y: y - 38,
        size: 10,
        font: fontRegular,
        color: rgb(0.85, 0.88, 1),
      });

      y -= 85;

      // Overall Score Box
      page.drawRectangle({
        x: 40,
        y: y - 75,
        width: width - 80,
        height: 75,
        color: rgb(0.96, 0.97, 1),
        borderColor: rgb(0.8, 0.84, 0.98),
        borderWidth: 1,
      });

      page.drawText("OVERALL HEALTH SCORE", {
        x: 60,
        y: y - 24,
        size: 11,
        font: fontBold,
        color: rgb(0.26, 0.22, 0.79),
      });

      page.drawText(`${scores.overall} / 100`, {
        x: 60,
        y: y - 56,
        size: 26,
        font: fontBold,
        color: scores.overall >= 80 ? rgb(0.09, 0.55, 0.24) : rgb(0.8, 0.45, 0.05),
      });

      page.drawText(`Status: ${scores.overall >= 85 ? "Excellent (Grade A)" : scores.overall >= 70 ? "Good (Grade B)" : "Action Required"}`, {
        x: 210,
        y: y - 32,
        size: 10,
        font: fontBold,
        color: rgb(0.2, 0.25, 0.35),
      });

      page.drawText(`Full URL: ${finalUrl.slice(0, 55)}${finalUrl.length > 55 ? "..." : ""}`, {
        x: 210,
        y: y - 50,
        size: 9,
        font: fontRegular,
        color: rgb(0.4, 0.45, 0.55),
      });

      y -= 105;

      // Category Breakdown Table
      page.drawText("Score Breakdown by Category", {
        x: 40,
        y,
        size: 13,
        font: fontBold,
        color: rgb(0.12, 0.15, 0.25),
      });
      y -= 20;

      const catScores = [
        { label: "Performance & PageSpeed", score: `${scores.performance} / 100` },
        { label: "On-Page SEO Factors", score: `${scores.seo} / 100` },
        { label: "Security & Best Practices", score: `${scores.security} / 100` },
        { label: "Mobile Optimization", score: `${scores.mobile} / 100` },
      ];

      for (const cat of catScores) {
        page.drawRectangle({
          x: 40,
          y: y - 18,
          width: width - 80,
          height: 24,
          color: rgb(0.98, 0.98, 1),
          borderColor: rgb(0.9, 0.92, 0.96),
          borderWidth: 0.5,
        });
        page.drawText(cat.label, { x: 55, y: y - 12, size: 10, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
        page.drawText(cat.score, { x: width - 130, y: y - 12, size: 10, font: fontBold, color: rgb(0.26, 0.22, 0.79) });
        y -= 28;
      }

      y -= 15;

      // Core Web Vitals
      page.drawText("Core Web Vitals & Real-Time Latency", {
        x: 40,
        y,
        size: 13,
        font: fontBold,
        color: rgb(0.12, 0.15, 0.25),
      });
      y -= 20;

      const vitalsList = [
        { name: "Largest Contentful Paint (LCP)", val: webVitals.lcp.value, status: webVitals.lcp.status },
        { name: "Interaction to Next Paint (INP)", val: webVitals.fid.value, status: webVitals.fid.status },
        { name: "Cumulative Layout Shift (CLS)", val: webVitals.cls.value, status: webVitals.cls.status },
        { name: "First Contentful Paint (FCP)", val: webVitals.fcp.value, status: webVitals.fcp.status },
        { name: "Server Latency (TTFB)", val: webVitals.ttfb.value, status: webVitals.ttfb.status },
      ];

      for (const v of vitalsList) {
        page.drawRectangle({
          x: 40,
          y: y - 18,
          width: width - 80,
          height: 24,
          color: rgb(1, 1, 1),
          borderColor: rgb(0.9, 0.92, 0.96),
          borderWidth: 0.5,
        });
        page.drawText(v.name, { x: 55, y: y - 12, size: 9.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
        page.drawText(v.val, { x: width - 170, y: y - 12, size: 9.5, font: fontBold, color: rgb(0.1, 0.15, 0.25) });
        page.drawText(v.status.toUpperCase(), {
          x: width - 90,
          y: y - 12,
          size: 8.5,
          font: fontBold,
          color: v.status === "good" ? rgb(0.09, 0.55, 0.24) : rgb(0.8, 0.45, 0.05),
        });
        y -= 26;
      }

      y -= 15;

      // On-Page Checklist
      page.drawText("On-Page SEO Factors Summary", {
        x: 40,
        y,
        size: 13,
        font: fontBold,
        color: rgb(0.12, 0.15, 0.25),
      });
      y -= 20;

      const onPageItems = [
        { label: "Title Tag", val: meta.title ? `Present (${meta.titleLength} chars)` : "Missing" },
        { label: "Meta Description", val: meta.description ? `Present (${meta.descriptionLength} chars)` : "Missing" },
        { label: "H1 Heading Structure", val: `${headings.h1Count} found (${headings.h1Count === 1 ? "Ideal" : "Needs Review"})` },
        { label: "Image Alt Tags", val: `${images.altPercentage}% covered (${images.withAlt}/${images.total} images)` },
        { label: "Canonical URL", val: meta.canonical ? "Present" : "Missing" },
        { label: "HTTPS Encryption", val: meta.isHttps ? "Active (Secure)" : "Insecure (HTTP)" },
      ];

      for (const item of onPageItems) {
        page.drawRectangle({
          x: 40,
          y: y - 18,
          width: width - 80,
          height: 24,
          color: rgb(0.98, 0.99, 1),
          borderColor: rgb(0.9, 0.92, 0.96),
          borderWidth: 0.5,
        });
        page.drawText(item.label, { x: 55, y: y - 12, size: 9.5, font: fontRegular, color: rgb(0.2, 0.25, 0.35) });
        page.drawText(item.val, { x: width - 210, y: y - 12, size: 9.5, font: fontBold, color: rgb(0.15, 0.2, 0.3) });
        y -= 26;
      }

      // Page 1 Footer
      page.drawText("Page 1 of 2  •  Toolify SEO Performance Suite (https://toolify.local)", {
        x: 40,
        y: 25,
        size: 8,
        font: fontRegular,
        color: rgb(0.5, 0.55, 0.65),
      });

      // Page 2: Prioritized Action Items
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - 50;

      page.drawText("PRIORITIZED ACTION PLAN & RECOMMENDATIONS", {
        x: 40,
        y,
        size: 15,
        font: fontBold,
        color: rgb(0.26, 0.22, 0.79),
      });
      y -= 20;

      page.drawText("Actionable fixes ordered by impact on search rankings and Core Web Vitals.", {
        x: 40,
        y,
        size: 9.5,
        font: fontRegular,
        color: rgb(0.4, 0.45, 0.55),
      });
      y -= 25;

      const topIssues = issues.slice(0, 10);
      for (const iss of topIssues) {
        if (y < 90) break;

        const sevColor =
          iss.severity === "critical"
            ? rgb(0.85, 0.15, 0.15)
            : iss.severity === "warning"
            ? rgb(0.8, 0.45, 0.05)
            : rgb(0.09, 0.55, 0.24);

        page.drawRectangle({
          x: 40,
          y: y - 48,
          width: width - 80,
          height: 52,
          color: rgb(0.99, 0.99, 1),
          borderColor: rgb(0.88, 0.9, 0.95),
          borderWidth: 0.5,
        });

        page.drawText(`[${iss.severity.toUpperCase()}] ${iss.title}`, {
          x: 52,
          y: y - 14,
          size: 10,
          font: fontBold,
          color: sevColor,
        });

        const recClean = iss.recommendation.slice(0, 95);
        page.drawText(recClean, {
          x: 52,
          y: y - 30,
          size: 8.5,
          font: fontRegular,
          color: rgb(0.25, 0.3, 0.4),
        });

        const descClean = iss.description.slice(0, 105);
        page.drawText(descClean, {
          x: 52,
          y: y - 42,
          size: 7.5,
          font: fontRegular,
          color: rgb(0.5, 0.55, 0.65),
        });

        y -= 58;
      }

      // Page 2 Footer
      page.drawText("Page 2 of 2  •  Toolify SEO Performance Suite (https://toolify.local)", {
        x: 40,
        y: 25,
        size: 8,
        font: fontRegular,
        color: rgb(0.5, 0.55, 0.65),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `seo-performance-report-${domain}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert("Failed to export PDF: " + err.message);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 dark:text-emerald-400 stroke-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
    if (score >= 70) return "text-amber-600 dark:text-amber-400 stroke-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
    return "text-rose-600 dark:text-rose-400 stroke-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
  };

  const filteredIssues = auditData?.issues.filter((iss) => {
    if (issueFilter === "all") return true;
    return iss.severity === issueFilter;
  }) || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Header & URL Input Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-elevated backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Gauge className="w-3.5 h-3.5" />
              <span>Full Website Auditor & Core Web Vitals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Website SEO & Performance Checker
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Analyze any website URL in real time. Inspect Core Web Vitals, on-page SEO, security, and export complete reports in PDF and Word DOC.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAudit()}
              placeholder="Paste website link (e.g., https://example.com or apple.com)..."
              disabled={isLoading}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm sm:text-base font-medium shadow-sm"
            />
          </div>

          <button
            onClick={() => handleAudit()}
            disabled={isLoading}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-glow flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 flex-shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Audit Website</span>
              </>
            )}
          </button>
        </div>

        {/* Example Presets */}
        <div className="flex items-center gap-2 flex-wrap mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-400">Try quick sample:</span>
          {PRESETS.map((p) => (
            <button
              key={p.domain}
              type="button"
              onClick={() => {
                setUrl(p.domain);
                handleAudit(p.domain);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/60 dark:hover:text-brand-400 transition-colors border border-slate-200/80 dark:border-slate-700 font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Loading Progress State */}
        {isLoading && (
          <div className="mt-6 p-5 rounded-2xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/60 dark:bg-brand-950/30 flex items-center gap-4">
            <RefreshCw className="w-6 h-6 text-brand-600 dark:text-brand-400 animate-spin flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-brand-900 dark:text-brand-200">
                Running Comprehensive Audit
              </p>
              <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5 animate-pulse">
                {loadingStep || "Inspecting website architecture and performance..."}
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-6 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
            <div>
              <p className="font-bold">Audit Failed</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Audit Results Dashboard */}
      {auditData && (
        <div className="space-y-8">
          {/* Action Ribbon: Export PDF, DOC, Print */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{auditData.domain}</span>
                  <a
                    href={auditData.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-brand-600 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </h3>
                <p className="text-xs text-slate-500">
                  HTTP {auditData.statusCode} • Latency {auditData.responseTimeMs}ms • {new Date(auditData.auditTimestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
              {/* PDF Button */}
              <button
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingPdf ? "Generating..." : "Download PDF Report"}</span>
              </button>

              {/* Word DOC Button */}
              <button
                onClick={handleExportDoc}
                disabled={isExportingDoc}
                className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>{isExportingDoc ? "Generating..." : "Download Word DOC"}</span>
              </button>

              {/* Print Button */}
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print Audit Report"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>

          {/* Top Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Overall Score Master Card */}
            <div className="md:col-span-2 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/80 shadow-elevated flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl pointer-events-none" />

              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Overall SEO Health
              </span>

              {/* Big Circular Dial */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={`fill-none transition-all duration-1000 ${
                      auditData.scores.overall >= 85
                        ? "stroke-emerald-500"
                        : auditData.scores.overall >= 70
                        ? "stroke-amber-500"
                        : "stroke-rose-500"
                    }`}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - auditData.scores.overall / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">
                    {auditData.scores.overall}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    / 100
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    auditData.scores.overall >= 85
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                      : auditData.scores.overall >= 70
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {auditData.scores.overall >= 85
                      ? "Grade A • Excellent"
                      : auditData.scores.overall >= 70
                      ? "Grade B • Good"
                      : "Grade C • Needs Improvement"}
                  </span>
                </span>
              </div>
            </div>

            {/* 3 Pillar Score Cards */}
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-2 gap-4">
              {/* Performance */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Performance
                  </span>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {auditData.scores.performance}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${auditData.scores.performance >= 80 ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${auditData.scores.performance}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2">TTFB {auditData.responseTimeMs}ms • Gzip/Brotli active</span>
              </div>

              {/* On-Page SEO */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    On-Page SEO
                  </span>
                  <Search className="w-4 h-4 text-brand-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {auditData.scores.seo}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${auditData.scores.seo >= 80 ? "bg-emerald-500" : "bg-brand-500"}`}
                    style={{ width: `${auditData.scores.seo}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2">Title, meta, H1 & alts checked</span>
              </div>

              {/* Security */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Security
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {auditData.scores.security}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${auditData.scores.security >= 80 ? "bg-emerald-500" : "bg-rose-500"}`}
                    style={{ width: `${auditData.scores.security}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2">{auditData.meta.isHttps ? "HTTPS SSL verified" : "Insecure HTTP"}</span>
              </div>

              {/* Mobile */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Mobile Readiness
                  </span>
                  <Smartphone className="w-4 h-4 text-cyan-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {auditData.scores.mobile}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${auditData.scores.mobile >= 80 ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${auditData.scores.mobile}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-2">Viewport & responsive tags verified</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Performance & Web Vitals</span>
            </button>

            <button
              onClick={() => setActiveTab("seo")}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "seo"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>On-Page SEO & Content</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "security"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Security & Headers</span>
            </button>

            <button
              onClick={() => setActiveTab("recommendations")}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "recommendations"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Action Plan ({auditData.issues.length})</span>
            </button>
          </div>

          {/* TAB 1: Performance & Web Vitals */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Core Web Vitals Metric Grid */}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                  Google Core Web Vitals Metrics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* LCP */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Largest Contentful Paint</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {auditData.webVitals.lcp.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {auditData.webVitals.lcp.value}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Target: &lt; 2.5s for fast hero render</p>
                  </div>

                  {/* FID / INP */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Interaction to Next Paint</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {auditData.webVitals.fid.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {auditData.webVitals.fid.value}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Target: &lt; 100ms for smooth interactivity</p>
                  </div>

                  {/* CLS */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Cumulative Layout Shift</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {auditData.webVitals.cls.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {auditData.webVitals.cls.value}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Target: &lt; 0.1 for visual stability</p>
                  </div>

                  {/* FCP */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">First Contentful Paint</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {auditData.webVitals.fcp.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {auditData.webVitals.fcp.value}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Target: &lt; 1.8s for initial paint</p>
                  </div>

                  {/* TTFB */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Time to First Byte (TTFB)</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {auditData.webVitals.ttfb.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {auditData.webVitals.ttfb.value}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Target: &lt; 600ms origin response</p>
                  </div>

                  {/* Speed Index */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Speed Index</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {auditData.webVitals.speedIndex.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {auditData.webVitals.speedIndex.value}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Target: &lt; 3.4s perceived visual load</p>
                  </div>
                </div>
              </div>

              {/* Page Weight Breakdown Bar */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Page Weight & Transfer Breakdown
                    </h4>
                    <p className="text-xs text-slate-500">
                      Estimated payload distribution for {auditData.domain}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {auditData.pageWeight.totalKb} KB
                    </span>
                    <p className="text-[10px] text-slate-400 uppercase">Total Weight</p>
                  </div>
                </div>

                {/* Stacked Colored Bar */}
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${Math.max(5, (auditData.pageWeight.htmlKb / auditData.pageWeight.totalKb) * 100)}%` }}
                    className="bg-brand-500"
                    title={`HTML: ${auditData.pageWeight.htmlKb} KB`}
                  />
                  <div
                    style={{ width: `${Math.max(5, (auditData.pageWeight.jsKb / auditData.pageWeight.totalKb) * 100)}%` }}
                    className="bg-amber-500"
                    title={`JavaScript: ${auditData.pageWeight.jsKb} KB`}
                  />
                  <div
                    style={{ width: `${Math.max(5, (auditData.pageWeight.cssKb / auditData.pageWeight.totalKb) * 100)}%` }}
                    className="bg-cyan-500"
                    title={`CSS: ${auditData.pageWeight.cssKb} KB`}
                  />
                  <div
                    style={{ width: `${Math.max(5, (auditData.pageWeight.imagesKb / auditData.pageWeight.totalKb) * 100)}%` }}
                    className="bg-emerald-500"
                    title={`Images: ${auditData.pageWeight.imagesKb} KB`}
                  />
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-brand-500" />
                    <span className="text-slate-600 dark:text-slate-300">HTML ({auditData.pageWeight.htmlKb} KB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-slate-600 dark:text-slate-300">JS Scripts ({auditData.pageWeight.jsKb} KB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-500" />
                    <span className="text-slate-600 dark:text-slate-300">CSS ({auditData.pageWeight.cssKb} KB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-300">Images ({auditData.pageWeight.imagesKb} KB)</span>
                  </div>
                </div>
              </div>

              {/* Device Visual Mockup Snapshot */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Simulated Device Visual Preview
                    </h4>
                    <p className="text-xs text-slate-500">
                      Visual presentation of your site title, metadata, and social cards
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <button
                      onClick={() => setDevicePreview("desktop")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        devicePreview === "desktop" ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm" : "text-slate-500"
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setDevicePreview("mobile")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        devicePreview === "mobile" ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm" : "text-slate-500"
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                {/* Mockup Frame */}
                <div className={`mx-auto rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-900 overflow-hidden shadow-2xl transition-all ${
                  devicePreview === "desktop" ? "max-w-2xl" : "max-w-xs"
                }`}>
                  {/* Browser Bar */}
                  <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1 mx-2 px-3 py-0.5 rounded-md bg-slate-900/80 text-[11px] font-mono text-slate-400 truncate">
                      {auditData.url}
                    </div>
                  </div>

                  {/* Browser Content Simulated */}
                  <div className="p-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-white min-h-[220px] flex flex-col justify-center">
                    <div className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-semibold mb-2">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{auditData.domain}</span>
                    </div>
                    <h5 className="text-lg sm:text-xl font-bold leading-tight line-clamp-2">
                      {auditData.meta.title || auditData.domain}
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
                      {auditData.meta.description || "No meta description provided."}
                    </p>

                    {auditData.social.ogImage && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-40 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={auditData.social.ogImage}
                          alt="Open Graph preview"
                          className="w-full h-36 object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: On-Page SEO & Content */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              {/* Google SERP Snippet Preview */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Google Search Snippet Preview
                </span>
                <div className="mt-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px]">G</span>
                    <span className="truncate">{auditData.url}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer leading-tight">
                    {auditData.meta.title || auditData.domain}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {auditData.meta.description || "No description provided for search snippets."}
                  </p>
                </div>
              </div>

              {/* Title & Description Detailed Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Page Title Tag</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      auditData.meta.titleLength >= 40 && auditData.meta.titleLength <= 65
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                    }`}>
                      {auditData.meta.titleLength} chars (Target: 50-60)
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white break-words mt-1">
                    {auditData.meta.title || "(Missing Title Tag)"}
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Meta Description</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      auditData.meta.descriptionLength >= 120 && auditData.meta.descriptionLength <= 160
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                    }`}>
                      {auditData.meta.descriptionLength} chars (Target: 120-160)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 break-words mt-1 leading-relaxed">
                    {auditData.meta.description || "(Missing Meta Description)"}
                  </p>
                </div>
              </div>

              {/* Headings Hierarchy (H1, H2, H3) */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                  Heading Hierarchy & Outline Structure
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
                    <span className="text-xs text-slate-400 font-bold uppercase">H1 Headings</span>
                    <p className={`text-2xl font-black mt-1 ${auditData.headings.h1Count === 1 ? "text-emerald-600" : "text-amber-600"}`}>
                      {auditData.headings.h1Count}
                    </p>
                    <span className="text-[10px] text-slate-400">Target: exactly 1</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
                    <span className="text-xs text-slate-400 font-bold uppercase">H2 Headings</span>
                    <p className="text-2xl font-black text-brand-600 mt-1">
                      {auditData.headings.h2Count}
                    </p>
                    <span className="text-[10px] text-slate-400">Sub-topic sections</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
                    <span className="text-xs text-slate-400 font-bold uppercase">H3 Headings</span>
                    <p className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">
                      {auditData.headings.h3Count}
                    </p>
                    <span className="text-[10px] text-slate-400">Sub-level points</span>
                  </div>
                </div>

                {auditData.headings.h1Items.length > 0 && (
                  <div className="mt-3 p-3.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/60">
                    <span className="text-xs font-bold text-brand-800 dark:text-brand-300 uppercase">Primary &lt;h1&gt;:</span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                      &quot;{auditData.headings.h1Items[0]}&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Images Audit */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Image Optimization & Alt Attributes
                    </h4>
                    <p className="text-xs text-slate-500">
                      Found {auditData.images.total} images on page ({auditData.images.withAlt} with alt, {auditData.images.missingAlt} missing alt)
                    </p>
                  </div>
                  <span className={`text-sm font-extrabold px-3 py-1 rounded-full ${
                    auditData.images.altPercentage >= 90
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                  }`}>
                    {auditData.images.altPercentage}% Alt Coverage
                  </span>
                </div>

                {auditData.images.sampleList.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {auditData.images.sampleList.map((img, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs">
                        <div className="truncate flex-1">
                          <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
                            {img.src}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            alt: {img.alt || "(empty)"}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                          img.hasAlt ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                        }`}>
                          {img.hasAlt ? "ALT OK" : "NO ALT"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Security & Headers */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* HTTPS */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-start gap-3">
                  {auditData.meta.isHttps ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      SSL/HTTPS Protocol
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {auditData.meta.isHttps ? "Secure encrypted transmission active." : "Insecure HTTP connection."}
                    </p>
                  </div>
                </div>

                {/* HSTS */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-start gap-3">
                  {auditData.headers.strictTransportSecurity ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Strict-Transport-Security (HSTS)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {auditData.headers.strictTransportSecurity || "Not configured (recommended)."}
                    </p>
                  </div>
                </div>

                {/* Content-Security-Policy */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-start gap-3">
                  {auditData.headers.contentSecurityPolicy ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Content-Security-Policy (CSP)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {auditData.headers.contentSecurityPolicy ? "Configured" : "None detected"}
                    </p>
                  </div>
                </div>

                {/* Compression */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-start gap-3">
                  {auditData.headers.contentEncoding !== "none" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      HTTP Transfer Compression
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Active encoding: {auditData.headers.contentEncoding.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Action Plan & Issues */}
          {activeTab === "recommendations" && (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <button
                  onClick={() => setIssueFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    issueFilter === "all" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                  }`}
                >
                  All ({auditData.issues.length})
                </button>
                <button
                  onClick={() => setIssueFilter("critical")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    issueFilter === "critical" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                  }`}
                >
                  Critical ({auditData.issues.filter((i) => i.severity === "critical").length})
                </button>
                <button
                  onClick={() => setIssueFilter("warning")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    issueFilter === "warning" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                  }`}
                >
                  Warnings ({auditData.issues.filter((i) => i.severity === "warning").length})
                </button>
                <button
                  onClick={() => setIssueFilter("good")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    issueFilter === "good" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  }`}
                >
                  Passed ({auditData.issues.filter((i) => i.severity === "good").length})
                </button>
              </div>

              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    issue.severity === "critical"
                      ? "border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20"
                      : issue.severity === "warning"
                      ? "border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {issue.severity === "critical" && (
                      <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    )}
                    {issue.severity === "warning" && (
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                    {issue.severity === "good" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {issue.title}
                        </h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          issue.severity === "critical"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
                            : issue.severity === "warning"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                        }`}>
                          {issue.severity}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {issue.description}
                      </p>

                      <div className="mt-2.5 p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Recommended Fix: </span>
                        <span className="text-slate-600 dark:text-slate-300">{issue.recommendation}</span>
                      </div>

                      {issue.codeSnippet && (
                        <div className="mt-2 relative">
                          <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto">
                            <code>{issue.codeSnippet}</code>
                          </pre>
                          <button
                            onClick={() => copyCode(issue.codeSnippet!, issue.id)}
                            className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-medium flex items-center gap-1 cursor-pointer"
                          >
                            {copiedSnippet === issue.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedSnippet === issue.id ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
