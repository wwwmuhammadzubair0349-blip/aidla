import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Footer from "../components/footer";

// ─────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────
const FEATURED = {
  to:    "/autotube",
  emoji: "🎬",
  label: "AutoTube by AIDLA",
  desc:  "AI YouTube automation — titles, scripts, tags, descriptions & full video packages in seconds.",
  badge: "🔥 New AI Tool",
};

const CATEGORIES = [
  {
    id:         "results",
    title:      "📋 Pakistan Board Results",
    badge:      "🔥 Trending",
    badgeColor: "#ef4444",
    desc:       "Matric & Inter results for all BISE boards across Pakistan",
    tools: [
      { to:"/tools/results",                    emoji:"🏛️", label:"All Board Results",  desc:"All 26 BISE boards — Punjab, KPK, Sindh, Balochistan, FBISE, AJK & GB.", badge:"26 Boards", badgeColor:"#1a3a8f" },
      { to:"/tools/results/bise-lahore",        emoji:"📋", label:"BISE Lahore",         desc:"Matric & Inter results — Lahore, Sheikhupura, Nankana Sahib." },
      { to:"/tools/results/fbise-islamabad",    emoji:"📋", label:"FBISE Islamabad",     desc:"Federal Board results for Islamabad & cantonment areas." },
      { to:"/tools/results/bise-karachi",       emoji:"📋", label:"BISE Karachi",        desc:"Matric & Inter results for all Karachi districts." },
      { to:"/tools/results/bise-peshawar",      emoji:"📋", label:"BISE Peshawar",       desc:"KPK board results — Peshawar, Charsadda, Nowshera." },
      { to:"/tools/results/bise-gujranwala",    emoji:"📋", label:"BISE Gujranwala",     desc:"Results for Gujranwala, Sialkot, Gujrat & more." },
      { to:"/tools/results/bise-rawalpindi",    emoji:"📋", label:"BISE Rawalpindi",     desc:"Results for Rawalpindi, Attock, Chakwal & Jhelum." },
      { to:"/tools/results/bise-faisalabad",    emoji:"📋", label:"BISE Faisalabad",     desc:"Results for Faisalabad, Jhang, Toba Tek Singh & Chiniot." },
    ],
    viewAll: { to:"/tools/results", label:"View all 26 boards →" },
  },
  {
    id:         "ai",
    title:      "🤖 AI-Powered Tools",
    badge:      "⚡ Groq AI",
    badgeColor: "#7c3aed",
    desc:       "Smart AI tools — 3 free uses, login for unlimited",
    tools: [
      { to:"/tools/ai/summarizer",  emoji:"📝", label:"AI Summarizer",  desc:"Paste any article and get a smart AI summary in seconds.", badge:"3 Free", badgeColor:"#16a34a" },
      { to:"/tools/ai/paraphraser", emoji:"🔄", label:"AI Paraphraser", desc:"Rewrite text in academic, casual, formal or creative styles.",  badge:"3 Free", badgeColor:"#16a34a" },
    ],
  },
  {
    id:         "education",
    title:      "🎓 Education Calculators",
    badge:      "🇵🇰 Pakistan",
    badgeColor: "#166534",
    desc:       "Calculators built for Pakistani students",
    tools: [
      { to:"/tools/education/cgpa-calculator",       emoji:"🧮", label:"CGPA Calculator",       desc:"Calculate CGPA/GPA for Pakistani universities — 4.0 & 5.0 scale." },
      { to:"/tools/education/mdcat-ecat-calculator", emoji:"🏥", label:"MDCAT / ECAT Calculator", desc:"Calculate medical & engineering admission aggregate in Pakistan." },
    ],
  },
  {
    id:         "utility",
    title:      "⚙️ Utility Tools",
    badge:      "✅ No Login",
    badgeColor: "#0284c7",
    desc:       "Everyday tools — instant, free, no sign-up",
    tools: [
      { to:"/tools/utility/qr-code-generator", emoji:"📱", label:"QR Code Generator", desc:"Generate QR codes for URLs, text, WhatsApp, WiFi & more. Download as PNG." },
      { to:"/tools/utility/age-calculator",    emoji:"🎂", label:"Age Calculator",    desc:"Calculate exact age in years, months and days from any date of birth." },
      { to:"/tools/utility/word-counter",      emoji:"🔢", label:"Word Counter",      desc:"Count words, characters, sentences, paragraphs and reading time." },
    ],
  },
  {
    id:         "pdf",
    title:      "📄 PDF Tools",
    badge:      "🔒 100% Private",
    badgeColor: "#dc2626",
    desc:       "All processing in your browser — nothing uploaded to servers",
    tools: [
      { to:"/tools/pdf/word-to-pdf",    emoji:"📄", label:"Word → PDF",       desc:"Convert Word docs to PDF with perfect layout and formatting." },
      { to:"/tools/pdf/image-to-pdf",   emoji:"🖼️", label:"Image → PDF",      desc:"Combine JPG, PNG, WebP images into a single PDF." },
      { to:"/tools/pdf/pdf-compressor", emoji:"🗜️", label:"PDF Compressor",   desc:"Reduce PDF file size for email and WhatsApp without losing quality.", badge:"New", badgeColor:"#7c3aed" },
    ],
  },
  {
    id:         "image",
    title:      "🖼️ Image Tools",
    badge:      "🔒 100% Private",
    badgeColor: "#0284c7",
    desc:       "Image editing in your browser — private and instant",
    tools: [
      { to:"/tools/image/jpg-to-png",          emoji:"🧩", label:"JPG → PNG",            desc:"Convert JPG to PNG with transparent or custom background." },
      { to:"/tools/image/background-remover",  emoji:"✂️", label:"Background Remover",   desc:"Remove image background instantly with AI. Download transparent PNG.", badge:"New", badgeColor:"#7c3aed" },
    ],
  },
  {
    id:         "career",
    title:      "💼 Career Tools",
    badge:      "🚀 Job Ready",
    badgeColor: "#d97706",
    desc:       "Professional career documents ready in minutes",
    tools: [
      { to:"/tools/career/cv-maker",             emoji:"🧑‍💼", label:"CV Maker",             desc:"Create a professional CV with 20+ templates. Print to PDF, no sign-up." },
      { to:"/tools/career/cover-letter-maker",   emoji:"✉️",  label:"Cover Letter Maker",  desc:"Tailored cover letters with 4 templates, adjustable tone. Live preview." },
    ],
  },
];

// ─────────────────────────────────────────────────────────
//  TOOL CARD
// ─────────────────────────────────────────────────────────
function ToolCard({ tool }) {
  return (
    <Link to={tool.to} style={{ textDecoration:"none", display:"block" }}>
      <div style={{
        background:"rgba(255,255,255,0.92)",
        backdropFilter:"blur(4px)",
        border:"1px solid rgba(59,130,246,0.1)",
        borderRadius:18,
        padding:"16px 16px 14px",
        boxShadow:"0 4px 16px rgba(11,20,55,0.06)",
        transition:"all 0.2s ease",
        height:"100%",
        display:"flex",
        flexDirection:"column",
        gap:8,
        minWidth:0,
        wordBreak:"break-word",
      }}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(11,20,55,0.12)";e.currentTarget.style.borderColor="rgba(245,158,11,0.3)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 16px rgba(11,20,55,0.06)";e.currentTarget.style.borderColor="rgba(59,130,246,0.1)";}}
      >
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:6, minWidth:0 }}>
          <span style={{ fontSize:"1.6rem", lineHeight:1, flexShrink:0 }}>{tool.emoji}</span>
          {tool.badge && (
            <span style={{
              fontSize:8, fontWeight:800, padding:"2px 7px", borderRadius:20, flexShrink:0,
              background:`${tool.badgeColor}18`, color:tool.badgeColor,
              border:`1px solid ${tool.badgeColor}30`,
              textTransform:"uppercase", letterSpacing:"0.04em", whiteSpace:"nowrap",
            }}>{tool.badge}</span>
          )}
        </div>
        <div style={{ fontWeight:800, fontSize:"0.88rem", color:"#0b1437", lineHeight:1.3 }}>{tool.label}</div>
        <div style={{ fontSize:"0.75rem", color:"#64748b", lineHeight:1.55, flex:1 }}>{tool.desc}</div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────
export default function ToolsHome() {
  const totalTools = CATEGORIES.reduce((s, c) => s + c.tools.length, 0);

  return (
    <>
      <Helmet>
        <title>Free Online Tools — Board Results, AI, PDF, Image & Career | AIDLA</title>
        <meta name="description" content="Free online tools for Pakistani students — Pakistan board results, AI summarizer, CGPA calculator, MDCAT aggregate, PDF compressor, background remover, QR code generator, age calculator and more. No sign-up needed." />
        <meta name="keywords" content="free online tools Pakistan, BISE result 2025, CGPA calculator, MDCAT calculator, AI summarizer, PDF compressor, background remover, QR code, age calculator, word counter, CV maker, AIDLA" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Free Online Tools — AIDLA" />
        <meta property="og:description" content="Pakistan board results, AI tools, PDF, image & career tools — all free." />
        <meta property="og:site_name" content="AIDLA" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.aidla.online/tools" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <link rel="canonical" href="https://www.aidla.online/tools" />
        <meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Free Online Tools — AIDLA" />
<meta name="twitter:description" content="Pakistan board results, AI tools, PDF, image & career tools — all free." />
<meta name="twitter:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org",
          "@type":"WebPage",
          "name":"Free Online Tools — AIDLA",
          "description":"Free online tools for Pakistani students — board results, AI, PDF, image, education and career tools.",
          "url":"https://www.aidla.online/tools",
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"},
        })}</script>
      </Helmet>

      {/* Global style reset for this page */}
      <style>{`
        .tools-page-wrap * { box-sizing: border-box; }
        .tools-page-wrap { overflow-x: hidden; }
        .tcat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (min-width: 600px)  { .tcat-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; } }
        @media (min-width: 900px)  { .tcat-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; } }
        @media (min-width: 1200px) { .tcat-grid { grid-template-columns: repeat(5, 1fr); gap: 16px; } }
        .featured-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 18px;
          border-radius: 20px;
          background: linear-gradient(135deg,#0b1437,#1a3a8f);
          color: #fff;
          text-decoration: none;
          border: 1px solid rgba(239,68,68,0.3);
          box-shadow: 0 8px 28px rgba(11,20,55,0.2);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s;
        }
        .featured-card:hover { transform: translateY(-3px); }
        .tools-cta-section {
          background: linear-gradient(135deg,#0b1437,#1a3a8f);
          border-radius: 24px;
          padding: clamp(20px,5vw,40px);
          color: white;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 40px;
          border: 1px solid rgba(255,215,0,0.15);
          box-shadow: 0 16px 32px rgba(11,20,55,0.2);
        }
        @media (max-width: 520px) {
          .tools-cta-section { flex-direction: column; text-align: center; }
          .tools-cta-section a { width: 100%; justify-content: center; }
          .featured-card { flex-direction: column; align-items: flex-start; gap: 10px; }
        }
      `}</style>

      <div className="tools-page-wrap" style={{
        minHeight:"100vh",
        background:"linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%)",
        fontFamily:"'DM Sans',sans-serif",
        overflowX:"hidden",
        position:"relative",
      }}>

        {/* BG orbs — pointer-events none so they don't block touch */}
        <div aria-hidden="true" style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
          <div style={{ position:"absolute", width:"min(600px,130vw)", height:"min(600px,130vw)", borderRadius:"50%", background:"rgba(59,130,246,0.06)", filter:"blur(80px)", top:"-30%", left:"-20%" }}/>
          <div style={{ position:"absolute", width:"min(500px,110vw)", height:"min(500px,110vw)", borderRadius:"50%", background:"rgba(245,158,11,0.05)", filter:"blur(80px)", top:"40%", right:"-20%" }}/>
        </div>

        <div style={{ position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto", padding:"clamp(20px,5vw,60px) clamp(14px,4vw,32px) clamp(40px,8vw,80px)", width:"100%" }}>

          {/* ── Header ── */}
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"linear-gradient(135deg,#f59e0b,#fcd34d)", color:"#0b1437", padding:"4px 14px", borderRadius:30, fontSize:"0.65rem", fontWeight:800, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:10, boxShadow:"0 4px 12px rgba(245,158,11,0.25)" }}>
              ⚡ {totalTools}+ Free Tools
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,6vw,2.6rem)", fontWeight:900, color:"#0b1437", lineHeight:1.15, marginBottom:8, wordBreak:"break-word" }}>
              Free Online{" "}
              <span style={{ background:"linear-gradient(135deg,#1a3a8f,#3b82f6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Tools
              </span>
            </h1>
            <p style={{ color:"#64748b", fontSize:"clamp(0.82rem,3vw,0.95rem)", marginBottom:0, maxWidth:580, lineHeight:1.6 }}>
              Pakistan board results, AI tools, PDF, image editing and career documents — all free, no sign‑up for most tools.
            </p>
          </motion.div>

          {/* ── Featured: AutoTube ── */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.08 }} style={{ marginTop:24, marginBottom:32 }}>
            <Link to={FEATURED.to} className="featured-card">
              <div aria-hidden="true" style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at top right, rgba(239,68,68,0.15), transparent 65%)", pointerEvents:"none" }}/>
              <span style={{ fontSize:"clamp(1.8rem,5vw,2.2rem)", flexShrink:0 }}>{FEATURED.emoji}</span>
              <div style={{ flex:1, minWidth:0, position:"relative" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                  <span style={{ fontSize:"clamp(0.88rem,3vw,1rem)", fontWeight:800 }}>{FEATURED.label}</span>
                  <span style={{ fontSize:8, fontWeight:800, background:"linear-gradient(135deg,#ef4444,#f97316)", color:"#fff", padding:"2px 9px", borderRadius:20, whiteSpace:"nowrap" }}>{FEATURED.badge}</span>
                </div>
                <p style={{ margin:0, fontSize:"clamp(0.72rem,2.5vw,0.82rem)", opacity:0.78, lineHeight:1.5 }}>{FEATURED.desc}</p>
              </div>
              <span style={{ fontSize:"clamp(0.75rem,2vw,0.85rem)", fontWeight:700, color:"rgba(255,255,255,0.7)", flexShrink:0, display:"none" }} className="featured-arrow">Try Free →</span>
            </Link>
          </motion.div>

          {/* ── Categories ── */}
          {CATEGORIES.map((cat, ci) => (
            <motion.section
              key={cat.id}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:"-40px" }}
              transition={{ duration:0.35, delay:ci * 0.04 }}
              style={{ marginBottom:36 }}
              aria-label={cat.title}
            >
              {/* Category header */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(0.9rem,3.5vw,1.05rem)", fontWeight:800, color:"#0b1437", margin:0 }}>
                  {cat.title}
                </h2>
                <span style={{
                  fontSize:8, fontWeight:800, padding:"2px 9px", borderRadius:20,
                  background:`${cat.badgeColor}15`, color:cat.badgeColor,
                  border:`1px solid ${cat.badgeColor}28`,
                  textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap",
                }}>{cat.badge}</span>
              </div>
              <p style={{ fontSize:"clamp(0.72rem,2.5vw,0.82rem)", color:"#64748b", marginBottom:12, lineHeight:1.5 }}>{cat.desc}</p>

              {/* Tool cards grid */}
              <div className="tcat-grid">
                {cat.tools.map(tool => <ToolCard key={tool.to} tool={tool}/>)}
              </div>

              {/* View all link */}
              {cat.viewAll && (
                <div style={{ marginTop:10, textAlign:"right" }}>
                  <Link to={cat.viewAll.to} style={{ fontSize:"0.8rem", fontWeight:700, color:"#1a3a8f", textDecoration:"none" }}>
                    {cat.viewAll.label}
                  </Link>
                </div>
              )}
            </motion.section>
          ))}

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.4 }}
            className="tools-cta-section"
          >
            <div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.1rem,4vw,1.7rem)", fontWeight:700, marginBottom:6 }}>
                Earn while you learn 🚀
              </h3>
              <p style={{ opacity:0.85, fontSize:"clamp(0.82rem,3vw,0.95rem)" }}>
                Join AIDLA today and start earning rewards as you build your skills.
              </p>
            </div>
            <Link to="/signup" style={{
              background:"linear-gradient(135deg,#f59e0b,#fcd34d)", color:"#0b1437",
              padding:"12px 28px", borderRadius:40, fontWeight:800,
              fontSize:"clamp(0.85rem,3vw,1rem)", textDecoration:"none",
              display:"inline-flex", alignItems:"center", gap:8,
              boxShadow:"0 6px 14px rgba(245,158,11,0.4)",
              whiteSpace:"nowrap",
            }}>
              Join now ✨
            </Link>
          </motion.div>

        </div>

        <Footer />
      </div>
    </>
  );
}