import PrivacyPolicyClient from "./PrivacyPolicyClient";
import Footer from "@/components/Footer";

// Metadata must be in Server Component
export const metadata = {
  title: "Privacy Policy | AIDLA – Your Data, Our Commitment",
  description: "AIDLA's Privacy Policy explains how we collect, use, and protect your personal information. Learn about your rights and our data practices.",
  keywords: "AIDLA privacy policy, data protection, user rights, cookies, information collection, Pakistan edtech",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.aidla.online/privacy-policy",
  },
  openGraph: {
    title: "AIDLA Privacy Policy",
    description: "Read how AIDLA safeguards your data and respects your privacy.",
    type: "website",
    url: "https://www.aidla.online/privacy-policy",
    images: [
      {
        url: "https://www.aidla.online/og-home.jpg",
        alt: "AIDLA Privacy Policy",
      },
    ],
    siteName: "AIDLA",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIDLA Privacy Policy",
    description: "Your privacy matters to us. Read our full policy.",
    images: ["https://www.aidla.online/og-home.jpg"],
  },
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyClient />;
}