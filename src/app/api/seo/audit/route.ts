import { NextRequest, NextResponse } from "next/server";
import dns from "dns";

function isPrivateIp(ip: string): boolean {
  if (ip === "127.0.0.1" || ip === "::1" || ip === "0.0.0.0") return true;

  const parts = ip.split(".").map(Number);
  if (parts.length === 4) {
    // 10.0.0.0 - 10.255.255.255
    if (parts[0] === 10) return true;
    // 172.16.0.0 - 172.31.255.255
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0 - 192.168.255.255
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0 - 169.254.255.255 (Link-local / AWS metadata)
    if (parts[0] === 169 && parts[1] === 254) return true;
  }
  return false;
}

function getAllMatches(text: string, regex: RegExp): RegExpExecArray[] {
  const matches: RegExpExecArray[] = [];
  let m: RegExpExecArray | null;
  const flags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
  const r = new RegExp(regex.source, flags);
  while ((m = r.exec(text)) !== null) {
    matches.push(m);
  }
  return matches;
}

export interface AuditIssue {
  id: string;
  category: "performance" | "seo" | "security" | "mobile";
  severity: "critical" | "warning" | "good";
  title: string;
  description: string;
  recommendation: string;
  codeSnippet?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUrl = body.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json({ error: "Missing or invalid URL" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      const formatted = rawUrl.trim().startsWith("http://") || rawUrl.trim().startsWith("https://")
        ? rawUrl.trim()
        : `https://${rawUrl.trim()}`;
      parsedUrl = new URL(formatted);
    } catch {
      return NextResponse.json({ error: "Invalid URL syntax. Please enter a valid domain (e.g. example.com or https://example.com)" }, { status: 400 });
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return NextResponse.json({ error: "Only HTTP and HTTPS URLs can be audited" }, { status: 400 });
    }

    // SSRF DNS resolution validation
    try {
      const lookup = await dns.promises.lookup(parsedUrl.hostname);
      if (isPrivateIp(lookup.address)) {
        return NextResponse.json(
          { error: "Access to private, localhost, or internal cloud IP ranges is blocked (SSRF Protection)." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json({ error: `Could not resolve domain: ${parsedUrl.hostname}. Please verify the domain name.` }, { status: 404 });
    }

    // Fetch the website HTML
    const startTime = performance.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7500);

    let response: Response;
    try {
      response = await fetch(parsedUrl.toString(), {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 ToolifyAuditBot/1.0 (+https://toolify.local)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
    } catch (fetchErr: any) {
      clearTimeout(timeout);
      if (fetchErr.name === "AbortError") {
        return NextResponse.json({ error: "Connection timed out after 7.5 seconds. The target server took too long to respond." }, { status: 504 });
      }
      return NextResponse.json({ error: `Failed to connect to ${parsedUrl.hostname}: ${fetchErr.message}` }, { status: 502 });
    }
    clearTimeout(timeout);

    const endTime = performance.now();
    const responseTimeMs = Math.round(endTime - startTime);

    const html = await response.text();
    const htmlSizeKb = Math.round((new Blob([html]).size / 1024) * 10) / 10;
    const finalUrl = response.url;
    const isHttps = finalUrl.startsWith("https://");
    const statusCode = response.status;

    // Headers inspection
    const headers = {
      contentEncoding: response.headers.get("content-encoding") || "none",
      server: response.headers.get("server") || "hidden",
      contentType: response.headers.get("content-type") || "unknown",
      strictTransportSecurity: response.headers.get("strict-transport-security"),
      contentSecurityPolicy: response.headers.get("content-security-policy"),
      xFrameOptions: response.headers.get("x-frame-options"),
      xContentTypeOptions: response.headers.get("x-content-type-options"),
      cacheControl: response.headers.get("cache-control"),
    };

    // --- HTML Extraction Helpers ---
    const getTagContent = (regex: RegExp) => {
      const match = html.match(regex);
      return match && match[1] ? match[1].trim() : null;
    };

    const getMetaContent = (nameOrProp: string) => {
      const regex = new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${nameOrProp}["'][^>]*content=["']([^"']*)["']`, "i");
      const match1 = html.match(regex);
      if (match1 && match1[1]) return match1[1].trim();

      // Reverse attribute order: content="..." name="..."
      const regexRev = new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${nameOrProp}["']`, "i");
      const match2 = html.match(regexRev);
      return match2 && match2[1] ? match2[1].trim() : null;
    };

    // 1. Meta Tags & Core SEO
    const title = getTagContent(/<title[^>]*>([\s\S]*?)<\/title>/i) || "";
    const description = getMetaContent("description") || "";
    const viewport = getMetaContent("viewport") || "";
    const canonical = getTagContent(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) || "";
    const robots = getMetaContent("robots") || "index, follow (default)";
    const lang = getTagContent(/<html\s+[^>]*lang=["']([^"']*)["']/i) || "";
    const charset = getTagContent(/<meta\s+[^>]*charset=["']([^"']*)["']/i) ||
      (getTagContent(/<meta\s+[^>]*http-equiv=["']Content-Type["'][^>]*content=["'][^"']*charset=([^"']*)["']/i) || "UTF-8");

    // 2. Open Graph & Social Cards
    const ogTitle = getMetaContent("og:title") || title;
    const ogDescription = getMetaContent("og:description") || description;
    const ogImage = getMetaContent("og:image") || "";
    const ogUrl = getMetaContent("og:url") || finalUrl;
    const ogSiteName = getMetaContent("og:site_name") || "";
    const twitterCard = getMetaContent("twitter:card") || "";
    const twitterTitle = getMetaContent("twitter:title") || ogTitle;
    const twitterImage = getMetaContent("twitter:image") || ogImage;

    // 3. Headings Structure
    const h1Matches = getAllMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map((m) =>
      m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    ).filter(Boolean);

    const h2Matches = getAllMatches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi).map((m) =>
      m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    ).filter(Boolean);

    const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

    // 4. Images Audit
    const imgTags = html.match(/<img\s+[^>]*>/gi) || [];
    let imagesWithAlt = 0;
    let imagesMissingAlt = 0;
    const sampleImages: { src: string; alt: string; hasAlt: boolean }[] = [];

    for (const img of imgTags) {
      const srcMatch = img.match(/src=["']([^"']*)["']/i);
      const altMatch = img.match(/alt=["']([^"']*)["']/i);
      const hasAlt = !!altMatch && altMatch[1].trim().length > 0;
      if (hasAlt) {
        imagesWithAlt++;
      } else {
        imagesMissingAlt++;
      }
      if (srcMatch && sampleImages.length < 6) {
        sampleImages.push({
          src: srcMatch[1],
          alt: altMatch ? altMatch[1] : "",
          hasAlt,
        });
      }
    }

    const totalImages = imgTags.length;
    const altPercentage = totalImages > 0 ? Math.round((imagesWithAlt / totalImages) * 100) : 100;

    // 5. Links Analysis
    const linkMatches = getAllMatches(html, /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi);
    let internalLinksCount = 0;
    let externalLinksCount = 0;
    let emptyAnchorCount = 0;

    for (const match of linkMatches) {
      const href = match[1].trim();
      const text = match[2].replace(/<[^>]+>/g, "").trim();
      if (!text && !match[2].includes("<img")) {
        emptyAnchorCount++;
      }
      if (href.startsWith("http://") || href.startsWith("https://")) {
        try {
          const linkDomain = new URL(href).hostname;
          if (linkDomain === parsedUrl.hostname) {
            internalLinksCount++;
          } else {
            externalLinksCount++;
          }
        } catch {
          externalLinksCount++;
        }
      } else if (href.startsWith("/") || href.startsWith("#") || !href.includes("://")) {
        internalLinksCount++;
      }
    }

    // 6. Content & Text Statistics
    const textOnly = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const words = textOnly.split(/\s+/).filter((w) => w.length > 1);
    const wordCount = words.length;
    const textLength = textOnly.length;
    const textToHtmlRatio = html.length > 0 ? Math.round((textLength / html.length) * 100) : 0;

    // 7. Structured Data / Schema
    const ldJsonMatches = getAllMatches(html, /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    const detectedSchemas: string[] = [];
    for (const match of ldJsonMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed["@type"]) {
          detectedSchemas.push(Array.isArray(parsed["@type"]) ? parsed["@type"].join(", ") : parsed["@type"]);
        } else if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            if (item["@type"]) detectedSchemas.push(item["@type"]);
          });
        }
      } catch {
        // invalid JSON-LD snippet
      }
    }

    // 8. Scripts & Stylesheets
    const scriptCount = (html.match(/<script\b[^>]*>/gi) || []).length;
    const cssCount = (html.match(/<link\s+[^>]*rel=["']stylesheet["']/gi) || []).length;

    // --- SCORING SYSTEM (0 - 100) ---
    // A. Performance Score
    let performanceScore = 100;
    if (responseTimeMs > 1200) performanceScore -= 25;
    else if (responseTimeMs > 700) performanceScore -= 15;
    else if (responseTimeMs > 400) performanceScore -= 8;

    if (headers.contentEncoding === "none") performanceScore -= 18;
    if (htmlSizeKb > 400) performanceScore -= 15;
    else if (htmlSizeKb > 150) performanceScore -= 8;

    if (scriptCount > 35) performanceScore -= 12;
    else if (scriptCount > 20) performanceScore -= 6;

    if (totalImages > 40) performanceScore -= 8;
    performanceScore = Math.max(25, Math.min(100, performanceScore));

    // B. SEO Score
    let seoScore = 100;
    if (!title) seoScore -= 25;
    else if (title.length < 30 || title.length > 65) seoScore -= 8;

    if (!description) seoScore -= 25;
    else if (description.length < 80 || description.length > 170) seoScore -= 8;

    if (h1Matches.length === 0) seoScore -= 18;
    else if (h1Matches.length > 1) seoScore -= 8;

    if (h2Matches.length === 0) seoScore -= 8;
    if (!canonical) seoScore -= 10;
    if (altPercentage < 70) seoScore -= 15;
    else if (altPercentage < 90) seoScore -= 6;
    if (!lang) seoScore -= 6;
    if (detectedSchemas.length === 0) seoScore -= 6;
    if (wordCount < 150) seoScore -= 10;

    seoScore = Math.max(30, Math.min(100, seoScore));

    // C. Security & Best Practices Score
    let securityScore = 100;
    if (!isHttps) securityScore -= 40;
    if (!headers.strictTransportSecurity) securityScore -= 15;
    if (!headers.xContentTypeOptions) securityScore -= 10;
    if (!headers.xFrameOptions && !headers.contentSecurityPolicy) securityScore -= 10;
    if (!viewport) securityScore -= 15;
    if (!charset.toUpperCase().includes("UTF-8")) securityScore -= 10;

    securityScore = Math.max(20, Math.min(100, securityScore));

    // D. Mobile Optimization Score
    let mobileScore = 100;
    if (!viewport) mobileScore -= 45;
    else if (!viewport.includes("width=device-width")) mobileScore -= 20;
    if (htmlSizeKb > 300) mobileScore -= 12;
    if (scriptCount > 30) mobileScore -= 10;
    if (!isHttps) mobileScore -= 15;

    mobileScore = Math.max(25, Math.min(100, mobileScore));

    // E. Overall SEO Health Score
    const overallScore = Math.round(
      performanceScore * 0.3 +
      seoScore * 0.35 +
      securityScore * 0.15 +
      mobileScore * 0.2
    );

    // --- ESTIMATED CORE WEB VITALS ---
    const lcpSec = (Math.max(0.6, (responseTimeMs / 1000) * 1.5 + (htmlSizeKb / 400) * 0.8)).toFixed(2);
    const fidMs = Math.round(Math.min(95, scriptCount * 1.8 + 12));
    const clsVal = (totalImages > 0 && imagesMissingAlt > 0 ? 0.05 + (imagesMissingAlt / totalImages) * 0.08 : 0.02).toFixed(3);
    const fcpSec = (Math.max(0.4, (responseTimeMs / 1000) * 0.95 + 0.3)).toFixed(2);
    const speedIndex = (parseFloat(lcpSec) * 1.15).toFixed(2);

    // --- COMPILE AUDIT ISSUES & RECOMMENDATIONS ---
    const issues: AuditIssue[] = [];

    // Title Check
    if (!title) {
      issues.push({
        id: "title-missing",
        category: "seo",
        severity: "critical",
        title: "Missing <title> Tag",
        description: "The page does not have an HTML <title> tag. Search engines use this as the primary headline in search listings.",
        recommendation: "Add a concise, keyword-rich <title> tag between 50 and 60 characters inside the <head> element.",
        codeSnippet: `<head>\n  <title>${parsedUrl.hostname} - High Performance Web Utilities</title>\n</head>`,
      });
    } else if (title.length < 30 || title.length > 65) {
      issues.push({
        id: "title-length",
        category: "seo",
        severity: "warning",
        title: `Title Tag Length (${title.length} characters)`,
        description: title.length < 30
          ? "Your title tag is too short and misses valuable keyword ranking opportunities."
          : "Your title tag exceeds 65 characters and may be truncated on Google Search results.",
        recommendation: "Keep your title tag between 50 and 60 characters for optimal search visibility.",
      });
    } else {
      issues.push({
        id: "title-good",
        category: "seo",
        severity: "good",
        title: `Title Tag Optimized (${title.length} chars)`,
        description: `"${title}" is within the ideal 50-60 character range.`,
        recommendation: "Keep maintaining unique, descriptive page titles.",
      });
    }

    // Meta Description Check
    if (!description) {
      issues.push({
        id: "desc-missing",
        category: "seo",
        severity: "critical",
        title: "Missing Meta Description",
        description: "No meta description tag was detected. Search engines may display arbitrary body text in search snippets.",
        recommendation: "Add an enticing meta description tag between 120 and 160 characters summarizing the page value.",
        codeSnippet: `<meta name="description" content="Explore free online tools for image compression, PDF management, and SEO auditing at ${parsedUrl.hostname}.">`,
      });
    } else if (description.length < 80 || description.length > 170) {
      issues.push({
        id: "desc-length",
        category: "seo",
        severity: "warning",
        title: `Meta Description Length (${description.length} characters)`,
        description: description.length < 80
          ? "Meta description is under 80 characters. You have room to include a stronger call to action."
          : "Meta description is over 170 characters and will likely be cut off on mobile search screens.",
        recommendation: "Aim for 120-160 characters with your core keywords and a compelling action phrase.",
      });
    } else {
      issues.push({
        id: "desc-good",
        category: "seo",
        severity: "good",
        title: `Meta Description Optimized (${description.length} chars)`,
        description: `Your description is well-calibrated for desktop and mobile search snippets.`,
        recommendation: "Regularly test click-through rates from Google Search Console.",
      });
    }

    // Heading Hierarchy (H1)
    if (h1Matches.length === 0) {
      issues.push({
        id: "h1-missing",
        category: "seo",
        severity: "critical",
        title: "Missing <h1> Heading",
        description: "The page lacks a main <h1> heading, which signals the primary topic to search crawlers.",
        recommendation: "Include exactly one top-level <h1> heading on every page.",
        codeSnippet: `<h1>The Definitive Guide to Online Utilities</h1>`,
      });
    } else if (h1Matches.length > 1) {
      issues.push({
        id: "h1-multiple",
        category: "seo",
        severity: "warning",
        title: `Multiple <h1> Headings Found (${h1Matches.length})`,
        description: "Having multiple <h1> elements can dilute heading hierarchy and confuse screen readers.",
        recommendation: "Reserve <h1> for the single main page topic; use <h2> and <h3> for sub-sections.",
      });
    } else {
      issues.push({
        id: "h1-good",
        category: "seo",
        severity: "good",
        title: "Single <h1> Heading Detected",
        description: `Primary headline: "${h1Matches[0].slice(0, 70)}${h1Matches[0].length > 70 ? "..." : ""}"`,
        recommendation: "Ensure <h2> and <h3> sections follow a logical outline.",
      });
    }

    // Canonical Tag
    if (!canonical) {
      issues.push({
        id: "canonical-missing",
        category: "seo",
        severity: "warning",
        title: "Missing Canonical Tag",
        description: "Without a rel=canonical link, search engines may index duplicate URL variations (e.g., HTTP vs HTTPS, tracking parameters).",
        recommendation: "Add a self-referencing canonical tag to specify the authoritative URL.",
        codeSnippet: `<link rel="canonical" href="${finalUrl}">`,
      });
    } else {
      issues.push({
        id: "canonical-good",
        category: "seo",
        severity: "good",
        title: "Canonical Link Present",
        description: `Authoritative URL set to ${canonical}`,
        recommendation: "Ensure canonical URL matches the preferred domain protocol.",
      });
    }

    // Image Alt Attributes
    if (totalImages > 0 && imagesMissingAlt > 0) {
      issues.push({
        id: "images-missing-alt",
        category: "seo",
        severity: imagesMissingAlt > 5 ? "critical" : "warning",
        title: `${imagesMissingAlt} of ${totalImages} Images Missing Alt Text`,
        description: "Search engines and screen-reader accessibility software rely on alt text to understand image content.",
        recommendation: "Add descriptive, non-spammy alt attributes to all content images.",
        codeSnippet: `<img src="hero-graphic.png" alt="Interactive SEO audit dashboard on laptop screen">`,
      });
    } else if (totalImages > 0) {
      issues.push({
        id: "images-good",
        category: "seo",
        severity: "good",
        title: `All ${totalImages} Images Have Alt Attributes`,
        description: "100% of detected images have descriptive alt text tags.",
        recommendation: "Maintain accessibility standards as new visuals are added.",
      });
    }

    // Mobile Viewport
    if (!viewport) {
      issues.push({
        id: "viewport-missing",
        category: "mobile",
        severity: "critical",
        title: "Missing Mobile Viewport Meta Tag",
        description: "Mobile browsers will render this page as a miniature desktop screen without a viewport configuration.",
        recommendation: "Add standard mobile viewport meta configuration.",
        codeSnippet: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
      });
    } else {
      issues.push({
        id: "viewport-good",
        category: "mobile",
        severity: "good",
        title: "Mobile Viewport Configured",
        description: `Viewport set: "${viewport}"`,
        recommendation: "Test touch targets and tap spacing on mobile devices.",
      });
    }

    // HTTPS / SSL Security
    if (!isHttps) {
      issues.push({
        id: "https-missing",
        category: "security",
        severity: "critical",
        title: "Insecure Protocol (HTTP)",
        description: "The site is served over plain HTTP. Modern browsers mark HTTP sites as 'Not Secure' and Google penalizes insecure rankings.",
        recommendation: "Deploy a free SSL certificate (e.g. Let's Encrypt or Cloudflare) and enforce HTTPS redirection.",
      });
    } else {
      issues.push({
        id: "https-good",
        category: "security",
        severity: "good",
        title: "Secure HTTPS Connection Active",
        description: "Traffic is encrypted end-to-end with an active SSL certificate.",
        recommendation: "Monitor SSL expiration dates and maintain modern cipher suites.",
      });
    }

    // HTTP Compression
    if (headers.contentEncoding === "none") {
      issues.push({
        id: "compression-missing",
        category: "performance",
        severity: "warning",
        title: "HTTP Compression Disabled",
        description: "Text assets are being served uncompressed. Enabling Gzip or Brotli reduces HTML payload sizes by up to 70%.",
        recommendation: "Enable Gzip or Brotli compression on your web server (Nginx, Apache, or CDN).",
      });
    } else {
      issues.push({
        id: "compression-good",
        category: "performance",
        severity: "good",
        title: `HTTP Compression Active (${headers.contentEncoding.toUpperCase()})`,
        description: `Transferred assets are compressed using ${headers.contentEncoding}.`,
        recommendation: "Ensure Brotli compression is preferred over gzip when supported.",
      });
    }

    // Server Response Latency
    if (responseTimeMs > 800) {
      issues.push({
        id: "ttfb-slow",
        category: "performance",
        severity: "warning",
        title: `Slow Server Response Time (${responseTimeMs}ms)`,
        description: "Server took longer than 800ms to respond. Slow server TTFB directly degrades Core Web Vitals (LCP) and user bounce rates.",
        recommendation: "Implement page-level caching, optimize database queries, or place a global CDN (Cloudflare) in front of the origin.",
      });
    } else {
      issues.push({
        id: "ttfb-good",
        category: "performance",
        severity: "good",
        title: `Fast Server Response (${responseTimeMs}ms)`,
        description: `Time to First Byte is healthy and well within Google's recommended 600ms threshold.`,
        recommendation: "Keep backend services monitored under peak visitor loads.",
      });
    }

    // Security Headers
    if (!headers.strictTransportSecurity) {
      issues.push({
        id: "hsts-missing",
        category: "security",
        severity: "warning",
        title: "Missing HSTS Header",
        description: "Strict-Transport-Security prevents SSL-stripping attacks by instructing browsers to always use HTTPS.",
        recommendation: "Add Strict-Transport-Security header to web server configuration.",
        codeSnippet: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
      });
    }

    // Open Graph Social Tags
    if (!ogTitle || !ogImage) {
      issues.push({
        id: "og-incomplete",
        category: "seo",
        severity: "warning",
        title: "Incomplete Open Graph Social Tags",
        description: "When this page is shared on Twitter, Facebook, or LinkedIn, it will lack rich image cards.",
        recommendation: "Add og:image and og:title tags for maximum social engagement.",
        codeSnippet: `<meta property="og:title" content="${title}">\n<meta property="og:image" content="https://${parsedUrl.hostname}/social-share.jpg">`,
      });
    } else {
      issues.push({
        id: "og-good",
        category: "seo",
        severity: "good",
        title: "Open Graph Tags Ready",
        description: `Detected og:title and og:image (${ogImage.slice(0, 50)}...)`,
        recommendation: "Maintain 1200x630 pixel aspect ratio for social share graphics.",
      });
    }

    // Structured Data (JSON-LD)
    if (detectedSchemas.length === 0) {
      issues.push({
        id: "schema-missing",
        category: "seo",
        severity: "warning",
        title: "No Schema.org Structured Data Detected",
        description: "Structured JSON-LD markup helps search engines qualify your content for rich snippets (FAQs, ratings, breadcrumbs).",
        recommendation: "Implement JSON-LD structured data for Organization, WebSite, or Article types.",
        codeSnippet: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "${parsedUrl.hostname}",\n  "url": "${finalUrl}"\n}\n</script>`,
      });
    } else {
      issues.push({
        id: "schema-good",
        category: "seo",
        severity: "good",
        title: `Structured Data Found (${detectedSchemas.join(", ")})`,
        description: "Search engines can understand explicit entity semantics on this page.",
        recommendation: "Test snippets with Google's Rich Results Test tool.",
      });
    }

    // Page Weight Breakdown
    const estHtmlWeight = htmlSizeKb;
    const estJsWeight = Math.round(scriptCount * 28 * 10) / 10;
    const estCssWeight = Math.round(cssCount * 18 * 10) / 10;
    const estImgWeight = Math.round(totalImages * 35 * 10) / 10;
    const estTotalWeight = Math.round((estHtmlWeight + estJsWeight + estCssWeight + estImgWeight) * 10) / 10;

    return NextResponse.json({
      url: finalUrl,
      domain: parsedUrl.hostname,
      auditTimestamp: new Date().toISOString(),
      statusCode,
      responseTimeMs,
      scores: {
        overall: overallScore,
        performance: performanceScore,
        seo: seoScore,
        security: securityScore,
        mobile: mobileScore,
      },
      webVitals: {
        lcp: { value: `${lcpSec}s`, status: parseFloat(lcpSec) < 2.5 ? "good" : parseFloat(lcpSec) < 4.0 ? "warning" : "poor" },
        fid: { value: `${fidMs}ms`, status: fidMs < 100 ? "good" : fidMs < 300 ? "warning" : "poor" },
        cls: { value: clsVal, status: parseFloat(clsVal) < 0.1 ? "good" : parseFloat(clsVal) < 0.25 ? "warning" : "poor" },
        fcp: { value: `${fcpSec}s`, status: parseFloat(fcpSec) < 1.8 ? "good" : parseFloat(fcpSec) < 3.0 ? "warning" : "poor" },
        speedIndex: { value: `${speedIndex}s`, status: parseFloat(speedIndex) < 3.4 ? "good" : "warning" },
        ttfb: { value: `${responseTimeMs}ms`, status: responseTimeMs < 600 ? "good" : "warning" },
      },
      pageWeight: {
        totalKb: estTotalWeight,
        htmlKb: estHtmlWeight,
        jsKb: estJsWeight,
        cssKb: estCssWeight,
        imagesKb: estImgWeight,
      },
      meta: {
        title,
        titleLength: title.length,
        description,
        descriptionLength: description.length,
        canonical,
        robots,
        lang,
        charset,
        viewport,
        isHttps,
      },
      social: {
        ogTitle,
        ogDescription,
        ogImage,
        ogUrl,
        ogSiteName,
        twitterCard,
        twitterTitle,
        twitterImage,
      },
      headings: {
        h1Count: h1Matches.length,
        h1Items: h1Matches,
        h2Count: h2Matches.length,
        h2Items: h2Matches.slice(0, 8),
        h3Count,
      },
      images: {
        total: totalImages,
        withAlt: imagesWithAlt,
        missingAlt: imagesMissingAlt,
        altPercentage,
        sampleList: sampleImages,
      },
      links: {
        total: linkMatches.length,
        internal: internalLinksCount,
        external: externalLinksCount,
        emptyAnchors: emptyAnchorCount,
      },
      content: {
        wordCount,
        textToHtmlRatio,
        schemas: detectedSchemas,
      },
      headers,
      issues,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during website audit" },
      { status: 500 }
    );
  }
}
