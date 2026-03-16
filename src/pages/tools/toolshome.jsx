import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Footer from "../components/footer";
import "./tools.css";

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

// ── Featured AI tool (AutoTube) ───────────────────────────
const featuredTool = {
  to:    "/autotube",
  emoji: "🎬",
  label: "AutoTube by AIDLA",
  desc:  "AI-powered YouTube automation — generate titles, scripts, tags, descriptions, thumbnails & full video packages in seconds.",
  badge: "🔥 New AI Tool",
};

export default function ToolsHome() {
  const toolListDescription = tools.map(t => `${t.label}: ${t.desc}`).join(" ");

  return (
    <>
      <Helmet>
        <title>Free Online Tools – PDF, Image, Career & YouTube AI Tools | AIDLA</title>
        <meta name="description" content={`Free online tools for PDF conversion, image processing, career documents, and YouTube SEO automation. No sign-up, 100% private. ${toolListDescription}`}/>
        <meta name="keywords" content="PDF tools, image converter, CV maker, cover letter generator, JPG to PNG, Word to PDF, YouTube SEO tool, YouTube automation, free online tools, AIDLA"/>
        <meta name="robots" content="index, follow"/>
        <meta property="og:title" content="Free Online Tools – AIDLA"/>
        <meta property="og:description" content="Free PDF, image, career, and YouTube AI tools. Convert, create, and download – all in your browser."/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://aidla.online/tools"/>
        <meta property="og:image" content="https://aidla.online/og-tools.jpg"/>
        <meta property="og:site_name" content="AIDLA"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="Free Online Tools by AIDLA"/>
        <meta name="twitter:description" content="PDF, image, career & YouTube AI tools – all free."/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      </Helmet>

      <div className="tools-root">
        <div className="bg-orbs">
          <div className="bg-orb-1"/>
          <div className="bg-orb-2"/>
        </div>

        <div className="tools-wrap">
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}>
            <span className="tools-badge">⚡ Free utilities</span>
            <h1 className="tools-title">
              Productivity <span className="tools-title-accent">Tools</span>
            </h1>
            <p className="tools-sub">
              Free online tools for PDF, Images, Career documents and YouTube AI automation. No sign‑up required for most tools.
            </p>
          </motion.div>

          {/* ── Featured: AutoTube ── */}
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45, delay:0.05 }}
            style={{ marginTop:24, marginBottom:8 }}
          >
            <motion.div whileHover={{ y:-4 }} transition={{ type:"spring", stiffness:300 }}>
              <Link to={featuredTool.to} style={{
                display:"flex", alignItems:"center", gap:16,
                padding:"22px 24px",
                borderRadius:24,
                background:"linear-gradient(135deg,#0b1437,#1a3a8f)",
                color:"#fff",
                textDecoration:"none",
                border:"1px solid rgba(239,68,68,0.3)",
                boxShadow:"0 8px 28px rgba(11,20,55,0.18)",
                position:"relative",
                overflow:"hidden",
              }}>
                {/* Glow */}
                <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at top right, rgba(239,68,68,0.15), transparent 70%)", pointerEvents:"none" }}/>

                <span style={{ fontSize:"2.4rem", flexShrink:0 }}>{featuredTool.emoji}</span>
                <div style={{ flex:1, minWidth:0, position:"relative" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:"1.1rem", fontWeight:800 }}>{featuredTool.label}</span>
                    <span style={{ fontSize:10, fontWeight:800, background:"linear-gradient(135deg,#ef4444,#f97316)", color:"#fff", padding:"2px 10px", borderRadius:20 }}>{featuredTool.badge}</span>
                  </div>
                  <p style={{ margin:0, fontSize:13, opacity:0.8, lineHeight:1.5 }}>{featuredTool.desc}</p>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.7)", flexShrink:0 }}>Try Free →</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Regular tools grid ── */}
          <motion.div
            className="tools-grid"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.45, delay:0.1 }}
          >
            {tools.map((tool) => (
              <motion.div key={tool.to} whileHover={{ y:-4 }} transition={{ type:"spring", stiffness:300 }}>
                <Link to={tool.to} className="tools-card">
                  <span>{tool.emoji}</span> {tool.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="tools-cta"
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.5 }}
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