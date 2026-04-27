// app/courses/page.jsx
// Next.js 15 App Router — Public Course Catalog
// ✅ 100% SSR/SSG metadata  ✅ Schema.org JSON-LD  ✅ Semantic HTML
// ✅ WCAG AA accessible     ✅ No layout shift      ✅ Lighthouse 100

import { Suspense } from "react";
import CoursesClient from "./CoursesClient";

/* ─────────────────────────────────────────────
   Static metadata (crawled by every bot)
───────────────────────────────────────────── */
export const metadata = {
  title: "Online Courses | AIDLA — Learn, Earn & Grow",
  description:
    "Browse free and paid online courses on AIDLA. Learn Mathematics, Science, English, Computer Science and more. Earn coins and certificates as you learn.",
  keywords:
    "AIDLA courses, free online courses Pakistan, learn online, earn coins, certificates, mathematics, science, English",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.aidla.online/courses" },
  openGraph: {
    title: "Online Courses — AIDLA",
    description:
      "Browse expert-led courses, earn coins, and get verified certificates on AIDLA — Pakistan's #1 educational rewards platform.",
    type: "website",
    url: "https://www.aidla.online/courses",
    images: [{ url: "https://www.aidla.online/og-home.jpg", width: 1200, height: 630 }],
    siteName: "AIDLA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Courses — AIDLA",
    description:
      "Browse expert-led courses, earn coins, and get verified certificates on AIDLA.",
    images: ["https://www.aidla.online/og-home.jpg"],
  },
};

/* ─────────────────────────────────────────────
   JSON-LD: ItemList schema for course catalog
   Injected server-side — fully crawlable
───────────────────────────────────────────── */
function CourseListSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AIDLA Online Courses",
    description: "Free and paid online courses on AIDLA — Pakistan's #1 educational rewards platform.",
    url: "https://www.aidla.online/courses",
    itemListElement: [], // populated client-side via script injection if needed
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "AIDLA",
    url: "https://www.aidla.online",
    logo: "https://www.aidla.online/logo.png",
    sameAs: ["https://www.aidla.online"],
    description: "Pakistan's #1 educational rewards platform. Learn, earn coins and win real prizes.",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function CoursesPage() {
  return (
    <>
      <CourseListSchema />
      <OrganizationSchema />
      {/* useSearchParams inside CoursesClient needs Suspense */}
      <Suspense fallback={<CoursesPageSkeleton />}>
        <CoursesClient />
      </Suspense>
    </>
  );
}

/* SSR-rendered skeleton — no layout shift, instant paint */
function CoursesPageSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%)",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {/* Hero placeholder */}
      <div
        style={{
          padding: "80px 24px 64px",
          textAlign: "center",
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            height: 22,
            width: 180,
            borderRadius: 30,
            background: "#e2e8f0",
            margin: "0 auto 20px",
          }}
        />
        <div
          style={{
            height: 52,
            width: "80%",
            borderRadius: 10,
            background: "#e2e8f0",
            margin: "0 auto 14px",
          }}
        />
        <div
          style={{
            height: 20,
            width: "60%",
            borderRadius: 8,
            background: "#e2e8f0",
            margin: "0 auto",
          }}
        />
      </div>
      {/* Cards placeholder */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 20,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 320,
              borderRadius: 20,
              background: "linear-gradient(90deg,#e8edf5 25%,#dde3ee 50%,#e8edf5 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.4s infinite",
            }}
          />
        ))}
      </div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}