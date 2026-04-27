import TermsClient from "./TermsClient";

// Metadata for SEO - must be in Server Component
export const metadata = {
  title: "Terms & Conditions | AIDLA – User Agreement",
  description: "Read AIDLA's Terms and Conditions. Learn about user responsibilities, rewards, prohibited activities, and your legal agreement with our platform.",
  keywords: "AIDLA terms, terms and conditions, user agreement, legal, educational platform, Pakistan",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.aidla.online/terms",
  },
  openGraph: {
    title: "AIDLA Terms & Conditions",
    description: "Understand the rules and guidelines for using AIDLA's learning and rewards platform.",
    type: "website",
    url: "https://www.aidla.online/terms",
    images: [
      {
        url: "https://www.aidla.online/og-home.jpg",
        alt: "AIDLA Terms and Conditions",
      },
    ],
    siteName: "AIDLA",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIDLA Terms & Conditions",
    description: "Read our user agreement before using AIDLA.",
    images: ["https://www.aidla.online/og-home.jpg"],
  },
};

export default function Terms() {
  return <TermsClient />;
}