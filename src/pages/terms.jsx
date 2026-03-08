import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet"; // or "react-helmet-async"
import Footer from "../pages/components/footer";
import "./terms.css";

// You can set this dynamically from a CMS or environment variable
const LAST_UPDATED = "February 15, 2026";

// Replace these with your actual image paths
const OG_IMAGE = "https://aidla.online/og-terms.jpg";      // 1200×630 recommended
const TWITTER_IMAGE = "https://aidla.online/twitter-terms.jpg"; // 800×418 or square

// Canonical URL – change if different
const CANONICAL_URL = "https://aidla.online/terms";

const sections = [
  { n: 1, title: "Acceptance", body: "By accessing AIDLA, you agree to comply with these Terms and Conditions. If you do not agree, please do not use our platform." },
  { n: 2, title: "Platform Description", body: "AIDLA is an educational platform allowing users to learn, participate in activities, and earn digital rewards." },
  { n: 3, title: "User Accounts", list: ["You must provide accurate and truthful information.", "You are solely responsible for your account security.", "Multiple fraudulent accounts are strictly prohibited."] },
  { n: 4, title: "Rewards & Coins", highlight: "Rewards earned through AIDLA activities have no guaranteed monetary value and may change at any time without prior notice." },
  { n: 5, title: "Prohibited Use", list: ["No cheating or automated abuse of any kind", "No illegal or fraudulent activity", "No harmful, offensive, or disruptive content"] },
  { n: 6, title: "Intellectual Property", body: "All platform content, logos, branding, and materials are the exclusive property of AIDLA and may not be reproduced without permission." },
  { n: 7, title: "Limitation of Liability", body: "AIDLA provides services on an as-is basis without warranties of any kind, express or implied." },
  { n: 8, title: "Termination", body: "Accounts that violate these terms may be suspended or permanently terminated at AIDLA's sole discretion." },
  { n: 9, title: "Changes to Terms", body: "These Terms may change at any time. Continued use of the platform after changes constitutes your acceptance." },
  { n: 10, title: "Contact Us", email: true },
];

// JSON-LD structured data for a WebPage
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "AIDLA Terms and Conditions",
  "description": "Read the terms and conditions for using AIDLA's educational platform, including user responsibilities, rewards, and prohibited activities.",
  "url": CANONICAL_URL,
  "lastReviewed": LAST_UPDATED,
  "inLanguage": "en",
  "isPartOf": {
    "@type": "WebSite",
    "name": "AIDLA",
    "url": "https://aidla.online"
  }
};

export default function Terms() {
  return (
    <>
      <Helmet>
        {/* Basic SEO */}
        <title>Terms & Conditions | AIDLA – User Agreement</title>
        <meta name="description" content="Read AIDLA's Terms and Conditions. Learn about user responsibilities, rewards, prohibited activities, and your legal agreement with our platform." />
        <meta name="keywords" content="AIDLA terms, terms and conditions, user agreement, legal, educational platform, Pakistan" />
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href={CANONICAL_URL} />

        {/* Open Graph */}
        <meta property="og:title" content="AIDLA Terms & Conditions" />
        <meta property="og:description" content="Understand the rules and guidelines for using AIDLA's learning and rewards platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="AIDLA Terms and Conditions" />
        <meta property="og:site_name" content="AIDLA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIDLA Terms & Conditions" />
        <meta name="twitter:description" content="Read our user agreement before using AIDLA." />
        <meta name="twitter:image" content={TWITTER_IMAGE} />
        <meta name="twitter:image:alt" content="AIDLA Terms and Conditions" />

        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <div className="tc-root">
        <div className="bg-orbs">
          <div className="bg-orb-1" />
          <div className="bg-orb-2" />
        </div>

        <div className="tc-wrap">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <span className="tc-badge">Legal</span>
            <h1 className="tc-title">Terms <span className="tc-title-accent">&amp; Conditions</span></h1>
            <p className="tc-meta">Last Updated: {LAST_UPDATED}</p>
          </motion.div>

          <motion.div className="tc-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
            {sections.map((s, i) => (
              <motion.div key={s.n} className="tc-sec"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <div className="tc-sec-head">
                  <div className="tc-num">{s.n}</div>
                  <div className="tc-sec-title">{s.title}</div>
                </div>
                {s.body && <p>{s.body}</p>}
                {s.highlight && <div className="tc-highlight">{s.highlight}</div>}
                {s.list && (
                  <ul className="tc-list">
                    {s.list.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                )}
                {s.email && (
                  <a className="tc-email-link" href="mailto:support@aidla.online">
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