import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet"; // or "react-helmet-async"
import Footer from "../components/footer"; // adjust path if needed
import "./tools.css"; // external CSS

// Tool definitions with descriptions for SEO
const tools = [
  {
    to: "/tools/pdf/word-to-pdf",
    emoji: "📄",
    label: "Word → PDF",
    desc: "Convert Word documents to PDF with perfect layout, images, and certificates preserved. No upload, 100% private.",
  },
  {
    to: "/tools/pdf/image-to-pdf",
    emoji: "🖼️",
    label: "Image → PDF",
    desc: "Combine JPG, PNG, WebP images into a single PDF. Choose page size, margins, orientation – all in your browser.",
  },
  {
    to: "/tools/image/jpg-to-png",
    emoji: "🧩",
    label: "JPG → PNG",
    desc: "Convert JPG/JPEG to lossless PNG with custom background. Batch convert, same dimensions, private and free.",
  },
  {
    to: "/tools/career/cv-maker",
    emoji: "🧑‍💼",
    label: "CV Maker",
    desc: "Create a professional CV in minutes. Choose from 20+ templates across 5 regions. Print to PDF, no sign-up.",
  },
  {
    to: "/tools/career/cover-letter-maker",
    emoji: "✉️",
    label: "Cover Letter Maker",
    desc: "Craft a tailored cover letter with 4 templates, adjustable tone and length. Live preview, print to PDF.",
  },
];

export default function ToolsHome() {
  // Generate a rich description for the page
  const toolListDescription = tools.map(t => `${t.label}: ${t.desc}`).join(" ");

  return (
    <>
      <Helmet>
        <title>Free Online Tools – PDF, Image & Career Tools | AIDLA</title>
        <meta
          name="description"
          content={`Free online tools for PDF conversion, image processing, and career documents. No sign-up, 100% private. ${toolListDescription}`}
        />
        <meta
          name="keywords"
          content="PDF tools, image converter, CV maker, cover letter generator, JPG to PNG, Word to PDF, free online tools, AIDLA"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content="Free Online Tools – AIDLA" />
        <meta
          property="og:description"
          content="Free PDF, image, and career tools. Convert, create, and download – all in your browser, no upload."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidla.online/tools" />
        <meta property="og:image" content="https://aidla.online/og-tools.jpg" />
        <meta property="og:site_name" content="AIDLA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Online Tools by AIDLA" />
        <meta
          name="twitter:description"
          content="PDF, image conversion, CV and cover letter tools – all free and private."
        />
        <meta name="twitter:image" content="https://aidla.online/twitter-tools.jpg" />

        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="tools-root">
        <div className="bg-orbs">
          <div className="bg-orb-1" />
          <div className="bg-orb-2" />
        </div>

        <div className="tools-wrap">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <span className="tools-badge">⚡ Free utilities</span>
            <h1 className="tools-title">
              Productivity <span className="tools-title-accent">Tools</span>
            </h1>
            <p className="tools-sub">
              Free online tools for PDF, Images, and Career documents. No sign‑up required.
            </p>
          </motion.div>

          <motion.div
            className="tools-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            {tools.map((tool, i) => (
              <motion.div
                key={tool.to}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to={tool.to} className="tools-card">
                  <span>{tool.emoji}</span> {tool.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="tools-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h3>Earn while you learn 🚀</h3>
              <p>Join AIDLA today and start earning rewards as you build your skills.</p>
            </div>
            <Link to="/signup" className="tools-cta-btn">
              Join now ✨
            </Link>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
}