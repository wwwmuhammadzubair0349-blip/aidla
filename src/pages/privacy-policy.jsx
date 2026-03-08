import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet"; // or "react-helmet-async"
import Footer from "../pages/components/footer";
import "./privacy.css";

// You can set this dynamically from a CMS or environment variable
const LAST_UPDATED = "February 15, 2026";

// Replace these with your actual image paths
const OG_IMAGE = "https://aidla.online/og-privacy.jpg";      // 1200×630 recommended
const TWITTER_IMAGE = "https://aidla.online/twitter-privacy.jpg"; // 800×418 or square

// Canonical URL – change if different
const CANONICAL_URL = "https://aidla.online/privacy-policy";

const sections = [
  { n: 1, title: "Introduction", body: "Welcome to AIDLA. Your privacy is important to us. This Privacy Policy explains how AIDLA collects, uses, and protects your information when you use our website and services." },
  { n: 2, title: "Information We Collect", list: ["Name and email address during signup", "Account activity and learning progress", "Device information and IP address", "Cookies and usage analytics"] },
  { n: 3, title: "How We Use Your Information", body: "We use collected data to provide learning services, improve user experience, manage accounts, prevent fraud, and develop new features." },
  { n: 4, title: "Cookies", body: "AIDLA uses cookies to enhance user experience and analyze website traffic. You can disable cookies through your browser settings at any time." },
  { n: 5, title: "Data Sharing", body: "We do not sell user data. Information may be shared with trusted service providers such as authentication, hosting, or analytics partners." },
  { n: 6, title: "Data Security", body: "We implement industry-standard security measures including encryption, secure servers, and access control to protect user data." },
  { n: 7, title: "User Rights", body: "Users may request access, correction, or deletion of their personal data by contacting us at any time." },
  { n: 8, title: "Third-Party Links", body: "Our website may contain external links. AIDLA is not responsible for the privacy practices of third-party websites." },
  { n: 9, title: "Changes to Policy", body: "We may update this Privacy Policy periodically. Continued use of the platform constitutes acceptance of any updates." },
  { n: 10, title: "Contact Us", email: true },
];

// JSON-LD structured data for a WebPage
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "AIDLA Privacy Policy",
  "description": "Learn how AIDLA collects, uses, and protects your personal information.",
  "url": CANONICAL_URL,
  "lastReviewed": LAST_UPDATED,
  "inLanguage": "en",
  "isPartOf": {
    "@type": "WebSite",
    "name": "AIDLA",
    "url": "https://aidla.online"
  }
};

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        {/* Basic SEO */}
        <title>Privacy Policy | AIDLA – Your Data, Our Commitment</title>
        <meta name="description" content="AIDLA's Privacy Policy explains how we collect, use, and protect your personal information. Learn about your rights and our data practices." />
        <meta name="keywords" content="AIDLA privacy policy, data protection, user rights, cookies, information collection, Pakistan edtech" />
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href={CANONICAL_URL} />

        {/* Open Graph */}
        <meta property="og:title" content="AIDLA Privacy Policy" />
        <meta property="og:description" content="Read how AIDLA safeguards your data and respects your privacy." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="AIDLA Privacy Policy" />
        <meta property="og:site_name" content="AIDLA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIDLA Privacy Policy" />
        <meta name="twitter:description" content="Your privacy matters to us. Read our full policy." />
        <meta name="twitter:image" content={TWITTER_IMAGE} />
        <meta name="twitter:image:alt" content="AIDLA Privacy Policy" />

        {/* Font preconnect (already in CSS import, but kept for speed) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <div className="pp-root">
        <div className="bg-orbs">
          <div className="bg-orb-1" />
          <div className="bg-orb-2" />
        </div>

        <div className="pp-wrap">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <span className="pp-badge">Legal</span>
            <h1 className="pp-title">Privacy <span className="pp-title-accent">Policy</span></h1>
            <p className="pp-meta">Last Updated: {LAST_UPDATED}</p>
          </motion.div>

          <motion.div className="pp-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
            {sections.map((s, i) => (
              <motion.div key={s.n} className="pp-sec"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <div className="pp-sec-head">
                  <div className="pp-num">{s.n}</div>
                  <div className="pp-sec-title">{s.title}</div>
                </div>
                {s.body && <p>{s.body}</p>}
                {s.list && (
                  <ul className="pp-list">
                    {s.list.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                )}
                {s.email && (
                  <a className="pp-email-link" href="mailto:support@aidla.online">
                    support@aidla.online
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
}