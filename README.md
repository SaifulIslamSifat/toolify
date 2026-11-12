# Toolify - All-in-One Online Productivity Tools

Toolify is a modern, high-performance, SaaS-style online utility platform built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Lucide Icons.

## 🚀 Key Highlights & Philosophy
- **100% Genuine Functionality**: Zero simulated progress, fake loaders, or dummy downloads.
- **Client-Side First**: Image editing (Canvas), PDF operations (`pdf-lib`), calculations, and text transformations execute in the browser. Zero server file uploads, ensuring total privacy.
- **SSRF-Protected Server Handlers**: For network diagnostics (Website Status Checker, HTTP Header Inspector, IP Lookup), server-side route handlers filter out private/internal IP ranges (127.0.0.1, 10.x, 192.168.x, 169.254.x AWS metadata).
- **SEO & Discovery**: Every tool has a dedicated URL (`/tools/[slug]`), rich Open Graph metadata, step-by-step guides, FAQs, and a dynamic XML sitemap (`/sitemap.xml`).
- **Centralized Registry**: `src/lib/tools-registry.ts` manages metadata, keywords, synonyms, and categories.

---

## 🛠 Included Tool Directory

### 🖼️ Image Tools
- **Image Compressor**: Canvas and WebP/JPEG compression with quality slider, file size comparison, and % saved metrics.
- **Image Resizer**: Resize by exact pixel dimensions or percentage scaling with aspect ratio lock.
- **Image Cropper**: Crop to 1:1, 16:9, 4:3, or custom freeform dimensions.
- **JPG to PNG Converter**: Lossless PNG conversion with transparency support.
- **PNG to JPG Converter**: Convert to compressed JPG with white background fill.
- **WebP to JPG Converter**: Universal format conversion.
- **Image to Base64**: Instant Data URI, HTML `<img>`, and CSS background snippet generation.
- **Image Rotator & Flipper**: Rotate 90°/180°/270° and mirror horizontally/vertically.
- **Image Color Picker**: Eyedropper pixel sampler with HEX, RGB, and HSL values.
- **AI Background Remover**: Foreground contour isolation and transparent PNG cutout export.

### 📄 PDF Utilities
- **Merge PDF**: Combine multiple PDFs into a single organized document with drag-and-drop reordering.
- **Split PDF**: Extract specific page ranges (e.g. `1-3, 5`) into a new PDF.
- **Rotate PDF**: Permanently rotate all or specific pages.
- **JPG to PDF**: Compile multiple photos into a standardized multi-page PDF.
- **PDF Metadata Viewer**: Inspect author, creator, page counts, and modification timestamps.
- **Word to PDF**: Convert DOCX, TXT, and Markdown documents into cleanly formatted PDFs.

### 🔢 Calculators
- **BMI Calculator**: Metric (cm/kg) and Imperial (ft, in/lbs) modes with WHO category visual gauge and health disclaimer.
- **Age Calculator**: Exact years, months, days, total days lived, and next birthday countdown.
- **Percentage Calculator**: 3 modes (percentage of a number, proportion, percentage increase/decrease).
- **Loan & Mortgage Calculator**: Monthly repayment, total interest, and loan cost calculation.
- **Discount Calculator**: Sale price, money saved, and optional tax calculation.

### 🔄 Unit Converters
- **Temperature Converter**: Bidirectional sync between Celsius, Fahrenheit, and Kelvin.
- **Length Converter**: Metric and Imperial distance conversion (cm, m, km, in, ft, yd, mi).
- **Weight Converter**: Mass conversions (kg, lbs, g, oz, stone).
- **Storage Converter**: Digital data sizes across Bytes, KB, MB, GB, and TB (1024 binary or 1000 decimal).

### ✍️ Text Tools
- **Word & Character Counter**: Real-time word, character, sentence, paragraph, reading and speaking time counts.
- **Case Converter**: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, kebab-case, snake_case.
- **Text Diff Checker**: Side-by-side and line-by-line comparison highlighting additions and deletions.
- **Text to Slug**: SEO-friendly URL slug generator with custom separators.
- **Lorem Ipsum Generator**: Customizable dummy text by paragraphs, sentences, or words.

### 💻 Developer Utilities
- **JSON Formatter & Validator**: Beautifier, minifier, indentation selector, and syntax error pointers.
- **Password Generator**: Cryptographically secure (`crypto.getRandomValues`) with entropy score and rule toggles.
- **QR Code Generator**: Pure client-side PNG/SVG QR code generation with custom colors.
- **UUID / GUID Generator**: RFC-4122 v4 UUID generator with bulk creation.
- **Base64 Encoder / Decoder**: UTF-8 safe text-to-base64 converter.
- **Hash Generator**: MD5, SHA-1, SHA-256, and SHA-512 cryptographic digests.
- **Unix Timestamp Converter**: Epoch seconds/milliseconds to human-readable UTC/Local dates.
- **Regex Tester**: Pattern tester with flags (`g`, `i`, `m`, `s`) and real-time highlighted match preview.

### 🌐 SEO & Internet Utilities
- **Robots.txt Generator**: Crawler configuration, disallow rules, and sitemap URL compiler.
- **Meta Tag & Open Graph Generator**: Live Google Search snippet and social card previews.
- **My IP Address Inspector**: Client IP, protocol, user-agent, and HTTP request headers.
- **Website Status & Response Time Checker**: SSRF-protected server uptime and latency tester.

---

## 🏃 Running the Application

### 1. Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### 2. Production Build
```bash
npm run build
npm run start
```
Runs the optimized standalone production build on port 3000.
