import { Suspense } from "react";
import ResourcesClient from "./ResourcesClient";

export const metadata = {
  title: "Study Materials & Resources — AIDLA | Notes, Past Papers, Books",
  description:
    "Download free study materials, notes, past papers, thesis, templates and books. Organized by subject, university and class level.",
  keywords:
    "study materials Pakistan, notes, past papers, thesis, templates, books, AIDLA resources",
  robots: "index, follow",
  alternates: { canonical: "https://www.aidla.online/resources" },
  openGraph: {
    title: "Study Materials & Resources — AIDLA | Notes, Past Papers, Books",
    description:
      "Download free study materials, notes, past papers, thesis, templates and books. Organized by subject, university and class level.",
    type: "website",
    url: "https://www.aidla.online/resources",
    images: [{ url: "https://www.aidla.online/og-home.jpg" }],
    siteName: "AIDLA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Materials & Resources — AIDLA | Notes, Past Papers, Books",
    description:
      "Download free study materials, notes, past papers, thesis, templates and books. Organized by subject, university and class level.",
    images: ["https://www.aidla.online/og-home.jpg"],
  },
};

export default function ResourcesPage() {
  return (
    // useSearchParams() inside ResourcesClient requires a Suspense boundary
    <Suspense fallback={null}>
      <ResourcesClient />
    </Suspense>
  );
}