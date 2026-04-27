// app/tools/ai/email-writer/page.jsx
import { Suspense } from "react";
import EmailWriterClient from "./EmailWriterClient";

export const metadata = {
  title: "AI Email Writer — Write Professional Emails Instantly | AIDLA",
  description: "AI email writer that crafts professional, business, personal and academic emails in seconds. 24 email types, 6 tones, 11 languages. Open directly in Gmail, Outlook or Mail app — free.",
  keywords: "AI email writer, professional email generator, email writing tool, job application email, business email AI, Gmail draft, Outlook email writer, free email tool, AIDLA",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.aidla.online/tools/ai/email-writer" },
  openGraph: {
    title: "AI Email Writer — Write Professional Emails Instantly | AIDLA",
    description: "AI writes professional emails in seconds. 24 types, 6 tones, 11 languages. Opens directly in Gmail or Outlook. Free.",
    type: "website",
    url: "https://www.aidla.online/tools/ai/email-writer",
    images: [{ url: "https://www.aidla.online/og-email-writer.jpg", width: 1200, height: 630 }],
    siteName: "AIDLA",
  },
  twitter: { card: "summary_large_image", title: "AI Email Writer — AIDLA", description: "AI writes professional emails in seconds. Opens directly in Gmail, Outlook or Mail app.", images: ["https://www.aidla.online/og-email-writer.jpg"] },
};

function JsonLd() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org", "@type": "WebApplication",
      name: "AI Email Writer by AIDLA", url: "https://www.aidla.online/tools/ai/email-writer",
      description: "AI-powered email writer. Generate professional, business, personal and academic emails instantly.",
      applicationCategory: "ProductivityApplication", operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: "AIDLA", url: "https://www.aidla.online" },
    })}} />
  );
}

export default function EmailWriterPage() {
  return (
    <>
      <JsonLd />
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%)" }} />}>
        <EmailWriterClient />
      </Suspense>
    </>
  );
}