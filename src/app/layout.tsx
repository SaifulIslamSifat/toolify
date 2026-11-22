import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/effects/ParticleBackground";
import CustomCursor from "@/components/effects/CustomCursor";

export const metadata: Metadata = {
  title: "Toolify - Free, Fast & Privacy-Focused Online Utilities",
  description:
    "An all-in-one suite of free online utilities for image editing, PDF manipulation, calculators, unit converters, text formatting, and developer tools. 100% private and processed in your browser.",
  keywords: [
    "online tools",
    "free utilities",
    "pdf tools",
    "image compressor",
    "bmi calculator",
    "developer utilities",
    "json formatter",
    "unit converter",
  ],
  authors: [{ name: "Toolify Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://toolify.local",
    siteName: "Toolify",
    title: "Toolify - All-in-One Online Utilities Platform",
    description:
      "Modern, fast, and free online utilities with zero fake progress. Process images, PDFs, text, and calculations securely in your browser.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolify - All-in-One Online Utilities",
    description: "Free, client-side, zero-fake online utilities platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-white dark:bg-black text-slate-900 dark:text-[#f4f5f2] antialiased selection:bg-brand-400 selection:text-black relative">
        <ParticleBackground />
        <CustomCursor />
        <Header />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
