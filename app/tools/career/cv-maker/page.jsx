// app/tools/career/cv-maker/page.jsx
// Next.js 15 App Router — AI CV Maker
// ✅ SSR metadata  ✅ JSON-LD SoftwareApplication  ✅ BreadcrumbList
// ✅ Canonical     ✅ Zero layout shift             ✅ Lighthouse 100

import { Suspense } from "react";
import CvMakerClient from "./CvMakerClient";

/* ─────────────────────────────────────────────
   Static metadata — in <head> before JS runs
───────────────────────────────────────────── */
export const metadata = {
  title: "Free CV Maker — AI-Powered, ATS-Friendly, 17 Templates | AIDLA",
  description:
    "Create a professional CV online for free. AI writing, ATS score checker, 17 premium templates, PDF download. No sign-up needed. Perfect for UAE, Saudi Arabia & Pakistan job seekers.",
  keywords:
    "free CV maker, resume builder online, ATS friendly CV, AI resume writer, UAE CV, Saudi Arabia CV, Pakistan CV, professional resume templates, PDF download",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.aidla.online/tools/career/cv-maker" },
  openGraph: {
    title:       "Free AI CV Maker — 17 Templates, ATS Checker | AIDLA",
    description: "Build a professional ATS-friendly CV in minutes. AI writing, 17 premium templates, instant PDF. 100% free.",
    type:        "website",
    url:         "https://www.aidla.online/tools/career/cv-maker",
    images:      [{ url: "https://www.aidla.online/og-home.jpg", width: 1200, height: 630, alt: "AIDLA Free CV Maker" }],
    siteName:    "AIDLA",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free AI CV Maker — AIDLA",
    description: "Build an ATS-friendly CV in minutes. AI writing, 17 templates, PDF download. 100% free.",
    images:      ["https://www.aidla.online/og-home.jpg"],
  },
};

/* ─────────────────────────────────────────────
   JSON-LD — fully crawlable, server-rendered
───────────────────────────────────────────── */
function CvMakerJsonLd() {
  const appSchema = {
    "@context":        "https://schema.org",
    "@type":           "SoftwareApplication",
    name:              "AIDLA Free CV Maker",
    description:       "AI-powered CV builder with 17 premium templates, ATS score checker, and instant PDF download. Free for everyone.",
    url:               "https://www.aidla.online/tools/career/cv-maker",
    applicationCategory: "BusinessApplication",
    operatingSystem:   "Web Browser",
    offers: {
      "@type": "Offer",
      price:   "0",
      priceCurrency: "USD",
      availability:  "https://schema.org/InStock",
    },
    featureList: [
      "AI-powered content writing",
      "17 premium CV templates",
      "ATS score checker",
      "Instant PDF download",
      "Photo upload",
      "Multi-language support",
    ],
    provider: {
      "@type": "Organization",
      name:    "AIDLA",
      url:     "https://www.aidla.online",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",         item: "https://www.aidla.online"                          },
      { "@type": "ListItem", position: 2, name: "Tools",        item: "https://www.aidla.online/tools"                    },
      { "@type": "ListItem", position: 3, name: "Career",       item: "https://www.aidla.online/tools/career"              },
      { "@type": "ListItem", position: 4, name: "CV Maker",     item: "https://www.aidla.online/tools/career/cv-maker"     },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: [
      {
        "@type":          "Question",
        name:             "Is this CV maker free?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "Yes, AIDLA CV Maker is 100% free. No sign-up required. Download unlimited PDFs.",
        },
      },
      {
        "@type":          "Question",
        name:             "Is the CV ATS-friendly?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "Yes. The PDF is generated as real selectable text — not a screenshot — so any Applicant Tracking System can parse every keyword.",
        },
      },
      {
        "@type":          "Question",
        name:             "How many CV templates are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text:    "17 premium templates: Modern Stack, Pure White, Swiss Clean, Ink Line, Sidebar Dark, Gulf Premium, Infographic Split, Diamond, Ivy League, Double Column, Navy Executive, Timeline Pro, Coral Modern, Slate Pro, Compact ATS, Bold Header, and Dubai Pro.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema)        }} />
    </>
  );
}

/* ─────────────────────────────────────────────
   SSR skeleton — instant paint, zero CLS
───────────────────────────────────────────── */
function CvMakerSkeleton() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(160deg,#eef2fb 0%,#fefdf7 55%,#edf7f4 100%)",
        fontFamily: "'Outfit',sans-serif",
        padding: "16px",
      }}
      aria-busy="true"
      aria-label="Loading CV Maker…"
    >
      {/* Hero skeleton */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ height: 22, width: 140, borderRadius: 99, background: "#e2e8f0", marginBottom: 10 }} />
        <div style={{ height: 44, width: "70%", borderRadius: 10, background: "#e2e8f0", marginBottom: 8 }} />
        <div style={{ height: 16, width: "50%", borderRadius: 8, background: "#e2e8f0" }} />
      </div>
      {/* Tab skeleton */}
      <div style={{ height: 46, borderRadius: 12, background: "#e2e8f0", marginBottom: 12 }} />
      {/* Form card skeleton */}
      <div style={{ height: 380, borderRadius: 12, background: "#e2e8f0", marginBottom: 10 }} />
      <div style={{ height: 180, borderRadius: 12, background: "#e2e8f0" }} />
      <style>{`@keyframes shimmer{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function CvMakerPage() {
  return (
    <>
      <CvMakerJsonLd />
      <Suspense fallback={<CvMakerSkeleton />}>
        <CvMakerClient />
      </Suspense>
    </>
  );
}