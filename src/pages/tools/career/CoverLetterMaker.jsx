import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet"; // or "react-helmet-async"
import { supabase } from "../../../lib/supabase";
import Footer from "../../components/footer"; // adjust path if needed
import "./cover-letter.css";

// ─── Utilities (copied from CvMaker for consistency) ─────────────
function safeText(v) { return String(v ?? "").trim(); }
function splitLines(v) { return safeText(v).split("\n").map(s => s.replace(/^[•\s]+/, "").trim()).filter(Boolean); }
function uid() { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36); }

// ─── Constants ────────────────────────────────────────────────────
const TONES = [
  { key: "formal",    name: "Formal (Corporate)" },
  { key: "confident", name: "Confident (Results‑driven)" },
  { key: "friendly",  name: "Friendly (Warm)" },
];
const LENGTHS = [
  { key: "short",  name: "Short (≈ ½ page)" },
  { key: "normal", name: "Normal (≈ 1 page)" },
  { key: "long",   name: "Long (≈ 1+ page)" },
];
const SIGNOFFS = ["Sincerely", "Best regards", "Kind regards", "Respectfully"];

const STYLES = ["classic", "professional", "corporate", "modern"];
const STYLE_LABELS = {
  classic: "Classic", professional: "Professional",
  corporate: "Corporate", modern: "Modern",
};
const ACCENT_PALETTES = ["#1e3a8a", "#0f766e", "#7c2d12", "#334155"];

// Paper size (same as CvMaker)
const PAPER_SIZES = { a4: { w: 794, h: 1123 } };

const DEFAULT = {
  fullName: "", title: "", phone: "", email: "", location: "", linkedin: "", website: "",
  company: "", hiringManager: "", jobTitle: "", jobLocation: "", reference: "",
  date: new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
  tone: "formal", length: "normal",
  highlights: "• 2–3 key strengths (one per line)\n• 1 achievement with numbers\n• Relevant tools/skills",
  jobDescription: "", customParagraph: "", signOff: "Sincerely",
};

// ─── Letter Builders ──────────────────────────────────────────────
function compressJd(jd) {
  const one = jd.replace(/\s+/g, " ").replace(/[•\u2022]/g, "").trim();
  if (!one) return "support key responsibilities effectively";
  const cut = one.slice(0, 160);
  const end = cut.lastIndexOf(" ");
  return ((end > 80 ? cut.slice(0, end) : cut).trim()).toLowerCase();
}

// Plain text version (for copy)
function buildLetterText(d) {
  const tData = buildLetterData(d);
  const contactLine = tData.contact.join(" · ");
  const parts = [
    tData.date, "",
    tData.reference ? `Reference: ${tData.reference}` : null, "",
    tData.salutation, "",
    ...tData.paragraphs.flatMap(p => [p, ""]),
    tData.signOff, "",
    tData.name,
    tData.title || null,
    contactLine || null,
  ].filter(x => x !== null);
  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

// Rich data object for rendering
function buildLetterData(d) {
  const name = safeText(d.fullName) || "Your Name";
  const contactLine = [
    safeText(d.email),
    safeText(d.phone),
    safeText(d.location),
    safeText(d.linkedin) || safeText(d.website)
  ].filter(Boolean);
  const company = safeText(d.company) || "Company Name";
  const jobTitle = safeText(d.jobTitle) || "the position";
  const roleLine = safeText(d.jobLocation) ? `${jobTitle} (${safeText(d.jobLocation)})` : jobTitle;
  const salutation = safeText(d.hiringManager) ? `Dear ${safeText(d.hiringManager)},` : "Dear Hiring Manager,";

  const t = {
    formal: {
      opener: "I am writing to express my interest in",
      vibe: "I would welcome the opportunity to contribute my skills and experience to your team.",
      close: "Thank you for your time and consideration. I look forward to the possibility of discussing my application."
    },
    confident: {
      opener: "I'm excited to apply for",
      vibe: "I'm confident I can deliver strong results from day one and contribute measurable impact.",
      close: "I'd appreciate the chance to discuss how I can help your team achieve its goals."
    },
    friendly: {
      opener: "I'm reaching out because I'd love to be considered for",
      vibe: "I'd be genuinely happy to support your team and bring a positive, reliable working style.",
      close: "Thanks so much for considering my application — I'd love to connect and discuss next steps."
    }
  }[d.tone || "formal"];

  const wantMore = d.length === "long";
  const wantLess = d.length === "short";

  const highlights = splitLines(d.highlights);
  const bulletBlock = highlights.length
    ? `Here are a few highlights that align well with your needs:\n${highlights.map(h => `• ${h}`).join("\n")}`
    : "";
  const jdBlock = safeText(d.jobDescription)
    ? `From your job description, I understand you are looking for someone who can ${compressJd(safeText(d.jobDescription))}. My background matches these requirements through hands‑on delivery, clear communication, and a strong focus on quality and outcomes.`
    : "";
  const customBlock = safeText(d.customParagraph);
  const midExtra = wantMore
    ? `In addition, I'm comfortable working cross‑functionally, documenting work clearly, and maintaining a high standard of safety and compliance. I value ownership, continuous improvement, and reliability — especially in fast‑paced environments.`
    : "";
  const conciseTrim = wantLess
    ? `I bring strong execution, attention to detail, and a practical problem‑solving approach.`
    : `I bring strong execution, attention to detail, and a practical problem‑solving approach — from planning and implementation to reporting and stakeholder coordination.`;

  const paragraphs = [
    `${t.opener} the ${roleLine} at ${company}.`,
    conciseTrim,
    bulletBlock || null,
    jdBlock || null,
    customBlock || null,
    midExtra || null,
    `${t.vibe} ${t.close}`
  ].filter(Boolean);

  return {
    name,
    title: safeText(d.title),
    contact: contactLine,
    date: safeText(d.date),
    reference: safeText(d.reference),
    salutation,
    paragraphs,
    signOff: safeText(d.signOff) || "Sincerely,",
  };
}

// This is the print-specific style block (kept as a string for dynamic injection)
const LETTER_DOC_STYLES = `
  /* ── FORCE COLOR PRINTING ON ALL ELEMENTS ── */
  .cl-paper-wrap,
  .cl-paper-wrap *,
  .cl-paper-inner,
  .cl-doc,
  .cl-doc * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  .cl-paper-wrap {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    margin: 0 auto;
    box-shadow: 0 4px 24px rgba(15,23,42,0.12);
    border: 1px solid rgba(15,23,42,0.07);
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .cl-paper-inner { padding: 22mm 18mm; height: 100%; }

  .cl-doc { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; color: #0f172a; line-height: 1.6; font-size: 14px; height: 100%; }
  .doc-p { margin-bottom: 16px; text-align: justify; }
  .doc-bullets { margin: 8px 0 16px 24px; }
  .doc-bullets li { margin-bottom: 4px; }
  .doc-meta { margin-bottom: 24px; color: #334155; }
  .doc-salutation { margin-bottom: 16px; font-weight: 700; font-size: 15px; }
  .doc-signoff { margin-top: 36px; }
  .doc-signoff-name { font-weight: 700; margin-top: 30px; font-size: 16px; color: #0f172a; }
  .doc-contact span { display: inline-block; }
  .doc-contact span:not(:last-child)::after { content: "•"; margin: 0 8px; opacity: 0.5; }

  /* Templates */
  .tpl-classic .doc-header { margin-bottom: 36px; }
  .tpl-classic .doc-name { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; color: var(--accent); letter-spacing: -0.5px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .tpl-classic .doc-role { font-size: 16px; font-weight: 700; color: #475569; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
  .tpl-classic .doc-contact { font-size: 13px; color: #64748b; margin-top: 10px; }

  .tpl-professional .doc-header { margin-bottom: 36px; border-bottom: 3px solid var(--accent); padding-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .tpl-professional .doc-name { font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
  .tpl-professional .doc-role { font-size: 15px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .tpl-professional .doc-contact { font-size: 12px; color: #475569; text-align: right; display: flex; flex-direction: column; gap: 4px; }
  .tpl-professional .doc-contact span:not(:last-child)::after { display: none; }

  .tpl-corporate .doc-header { margin: -22mm -18mm 36px; padding: 22mm 18mm 18mm; background: var(--accent); color: #fff; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .tpl-corporate .doc-name { font-size: 36px; font-weight: 900; letter-spacing: -0.5px; color: #fff; }
  .tpl-corporate .doc-role { font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.9); margin-top: 6px; text-transform: uppercase; letter-spacing: 1px; }
  .tpl-corporate .doc-contact { font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 14px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .tpl-corporate .doc-contact span:not(:last-child)::after { color: rgba(255,255,255,0.4); }

  .tpl-modern .doc-header { margin-bottom: 36px; border-left: 6px solid var(--accent); padding-left: 18px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .tpl-modern .doc-name { font-size: 34px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
  .tpl-modern .doc-role { font-size: 15px; font-weight: 700; color: var(--accent); margin-top: 6px; text-transform: uppercase; letter-spacing: 1px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .tpl-modern .doc-contact { font-size: 13px; color: #64748b; margin-top: 10px; }

  @media print {
    body > *:not(#cvm-print-root) { display: none !important; }

    #cvm-print-root {
      display: block !important;
      position: fixed !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      z-index: 99999 !important;
    }

    #cvm-print-root .cl-paper-wrap {
      width: 100% !important;
      min-height: 100vh !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      margin: 0 !important;
      transform: none !important;
    }

    @page { margin: 0; size: A4; }
  }
`;

// ─── Main Component ───────────────────────────────────────────────
export default function CoverLetterMaker() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem("aidla_cover_letter_v2");
      return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
    } catch {
      return DEFAULT;
    }
  });

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [tplStyle, setTplStyle] = useState("classic");
  const [accent, setAccent] = useState(ACCENT_PALETTES[0]);
  const [mobileTab, setMobileTab] = useState("form");

  const previewScrollRef = useRef(null);
  const [scale, setScale] = useState(1);
  const paperW = PAPER_SIZES.a4.w;
  const paperH = PAPER_SIZES.a4.h;

  useEffect(() => {
    const el = previewScrollRef.current;
    if (!el) return;
    const calc = () => {
      const cw = el.clientWidth - 28;
      setScale(cw < paperW ? cw / paperW : 1);
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [paperW]);

  useEffect(() => {
    try {
      localStorage.setItem("aidla_cover_letter_v2", JSON.stringify(data));
    } catch {}
  }, [data]);

  const showMsg = (text, type = "info") => {
    setMsg(text);
    setMsgType(type);
  };

  const update = (patch) => setData(prev => ({ ...prev, ...patch }));

  const letterData = useMemo(() => buildLetterData(data), [data]);
  const letterPlainText = useMemo(() => buildLetterText(data), [data]);

  const validate = () => {
    if (!safeText(data.fullName)) return "Full name is required.";
    if (!safeText(data.company)) return "Company name is required.";
    if (!safeText(data.jobTitle)) return "Job title is required.";
    return "";
  };

  // ── Print — fully resolves CSS variables before cloning ──
  const onPrint = useCallback(() => {
    const err = validate();
    if (err) return showMsg(err, "error");

    const previewPaper = document.querySelector(".cvm-preview-scroll .cl-paper-wrap");
    if (!previewPaper) return showMsg("Preview not found. Please try again.", "error");

    // ── 1. Build self-contained print styles that inline the accent colour ──
    const accentColor = accent; // e.g. "#1e3a8a"

    let styleEl = document.getElementById("cvm-print-style");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "cvm-print-style";
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

      /* ── FORCE COLOR ON EVERYTHING ── */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      ${LETTER_DOC_STYLES}

      /* Resolve --accent to a real colour for print */
      #cvm-print-root .cl-paper-wrap { --accent: ${accentColor}; }

      /* Classic */
      #cvm-print-root .tpl-classic .doc-name { color: ${accentColor} !important; }

      /* Professional */
      #cvm-print-root .tpl-professional .doc-header { border-bottom-color: ${accentColor} !important; }
      #cvm-print-root .tpl-professional .doc-role   { color: ${accentColor} !important; }

      /* Corporate — coloured header block */
      #cvm-print-root .tpl-corporate .doc-header {
        background-color: ${accentColor} !important;
        background: ${accentColor} !important;
        color: #fff !important;
      }
      #cvm-print-root .tpl-corporate .doc-name  { color: #fff !important; }
      #cvm-print-root .tpl-corporate .doc-role  { color: rgba(255,255,255,0.9) !important; }
      #cvm-print-root .tpl-corporate .doc-contact { color: rgba(255,255,255,0.8) !important; }

      /* Modern */
      #cvm-print-root .tpl-modern .doc-header { border-left-color: ${accentColor} !important; }
      #cvm-print-root .tpl-modern .doc-role   { color: ${accentColor} !important; }

      @media print {
        body > *:not(#cvm-print-root) { display: none !important; }

        #cvm-print-root {
          display: block !important;
          position: fixed !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          z-index: 99999 !important;
        }

        #cvm-print-root .cl-paper-wrap {
          width: 100% !important;
          min-height: 100vh !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
          transform: none !important;
          --accent: ${accentColor};
        }

        /* Re-apply corporate bg in print context */
        #cvm-print-root .tpl-corporate .doc-header {
          background-color: ${accentColor} !important;
          background: ${accentColor} !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        @page { margin: 0; size: A4; }
      }
    `;

    // ── 2. Clone the preview and inject into the print root ──
    let printRoot = document.getElementById("cvm-print-root");
    if (!printRoot) {
      printRoot = document.createElement("div");
      printRoot.id = "cvm-print-root";
      document.body.appendChild(printRoot);
    }

    const clone = previewPaper.cloneNode(true);

    // Inline the accent variable directly on the clone's style attribute
    clone.style.cssText = `
      --accent: ${accentColor};
      width: ${paperW}px;
      min-height: ${paperH}px;
      transform: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      border: none !important;
      margin: 0 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    `;

    // ── 3. Walk clone and inline computed background/color on key elements ──
    // This defeats any browser stripping of CSS-variable-based backgrounds
    const liveEl = previewPaper;
    const pairs = [
      [".doc-header", clone.querySelector(".doc-header")],
      [".doc-name",   clone.querySelector(".doc-name")],
      [".doc-role",   clone.querySelector(".doc-role")],
    ];
    pairs.forEach(([selector, cloneNode]) => {
      if (!cloneNode) return;
      const liveNode = liveEl.querySelector(selector);
      if (!liveNode) return;
      const cs = window.getComputedStyle(liveNode);
      // Copy computed background & color inline
      const bg = cs.getPropertyValue("background-color");
      const col = cs.getPropertyValue("color");
      const bl = cs.getPropertyValue("border-left-color");
      const bb = cs.getPropertyValue("border-bottom-color");
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        cloneNode.style.setProperty("background-color", bg, "important");
        cloneNode.style.setProperty("background", bg, "important");
      }
      if (col) cloneNode.style.setProperty("color", col, "important");
      if (bl && bl !== "rgba(0, 0, 0, 0)") cloneNode.style.setProperty("border-left-color", bl, "important");
      if (bb && bb !== "rgba(0, 0, 0, 0)") cloneNode.style.setProperty("border-bottom-color", bb, "important");
    });

    // Also inline all child text colours inside corporate header
    if (tplStyle === "corporate") {
      const hdr = clone.querySelector(".doc-header");
      if (hdr) {
        hdr.style.setProperty("background-color", accentColor, "important");
        hdr.style.setProperty("background", accentColor, "important");
        hdr.style.setProperty("-webkit-print-color-adjust", "exact", "important");
        hdr.style.setProperty("print-color-adjust", "exact", "important");
        // Make all text inside white
        Array.from(hdr.querySelectorAll("*")).forEach(el => {
          el.style.setProperty("-webkit-print-color-adjust", "exact", "important");
          el.style.setProperty("print-color-adjust", "exact", "important");
        });
      }
    }

    printRoot.innerHTML = "";
    printRoot.appendChild(clone);

    setTimeout(() => {
      window.print();
    }, 200);
  }, [data, accent, tplStyle, paperW, paperH]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(letterPlainText);
      showMsg("Plain text copied to clipboard ✅", "success");
    } catch {
      showMsg("Copy failed.", "error");
    }
  };

  const onReset = () => {
    if (!confirm("Reset all fields?")) return;
    localStorage.removeItem("aidla_cover_letter_v2");
    setData(DEFAULT);
    setTplStyle("classic");
    setAccent(ACCENT_PALETTES[0]);
    showMsg("Reset ✅", "success");
  };

  const fieldCount = [
    data.fullName, data.title, data.email, data.phone,
    data.company, data.jobTitle
  ].filter(Boolean).length;

  // Canonical URL – adjust as needed
  const canonicalUrl = "https://aidla.online/tools/cover-letter";

  return (
    <>
      <Helmet>
        <title>Cover Letter Maker – Create Professional Cover Letters | AIDLA</title>
        <meta
          name="description"
          content="Free online cover letter maker. Choose from 4 templates, adjust tone and length, and print or download your letter. No sign-up required."
        />
        <meta
          name="keywords"
          content="cover letter maker, cover letter generator, professional cover letter, job application, career tools, AIDLA"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content="Cover Letter Maker – AIDLA" />
        <meta property="og:description" content="Craft a professional cover letter in minutes with our free tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://aidla.online/og-cover-letter.jpg" />
        <meta property="og:site_name" content="AIDLA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cover Letter Maker by AIDLA" />
        <meta name="twitter:description" content="Create a standout cover letter with our easy-to-use tool." />
        <meta name="twitter:image" content="https://aidla.online/twitter-cover-letter.jpg" />

        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="cvm-root">
        <div className="cvm-orbs">
          <div className="cvm-orb cvm-orb1" />
          <div className="cvm-orb cvm-orb2" />
          <div className="cvm-orb cvm-orb3" />
        </div>

        <div className="cvm-wrap">
          <motion.div className="cvm-hero" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="cvm-badge">✉️ Cover Letter</span>
            <h1 className="cvm-title">
              Cover Letter <span className="cvm-title-acc">Maker</span>
            </h1>
            <p className="cvm-sub">Craft a professional cover letter in minutes. Fill your details, pick a style, and print — no account needed.</p>
          </motion.div>

          <motion.div className="cvm-pills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {["✓ 4 Templates", "✓ Tone & Length", "✓ Live Preview", "✓ Print to PDF", "✓ 100% Free", "✓ Auto‑saved"].map(p => (
              <span className="cvm-pill" key={p}>{p}</span>
            ))}
          </motion.div>

          <AnimatePresence>
            {msg && (
              <motion.div
                className={`cvm-toast ${msgType}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <span>{msg}</span>
                <button className="cvm-toast-close" onClick={() => setMsg("")}>×</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="cvm-tab-bar">
            <button className={`cvm-tog-btn${mobileTab === "form" ? " active" : ""}`} onClick={() => setMobileTab("form")}>✍️ Edit</button>
            <button className={`cvm-tog-btn${mobileTab === "preview" ? " active" : ""}`} onClick={() => setMobileTab("preview")}>👁 Preview</button>
            <button className="cvm-btn cvm-btn-primary" style={{ marginLeft: "auto", padding: "7px 14px", fontSize: "0.78rem" }} onClick={onPrint}>🖨️ Print PDF</button>
          </div>

          {fieldCount > 0 && (
            <div className="cvm-stats" style={{ marginBottom: 12 }}>
              <div className="cvm-stat g">✅ {fieldCount} field{fieldCount !== 1 ? "s" : ""} filled</div>
              {data.tone && (
                <>
                  <div className="cvm-stat-div" />
                  <div className="cvm-stat">🎙️ {TONES.find(t => t.key === data.tone)?.name.split(" ")[0]}</div>
                </>
              )}
              {data.length && (
                <>
                  <div className="cvm-stat-div" />
                  <div className="cvm-stat">📏 {LENGTHS.find(l => l.key === data.length)?.name.split(" ")[0]}</div>
                </>
              )}
            </div>
          )}

          <div className="cvm-layout">
            {/* ══ LEFT: FORM ══ */}
            <div className={`cvm-col-form${mobileTab === "preview" ? " cvm-col-hidden" : ""}`}>
              <motion.div className="cvm-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                <div className="cvm-card-title">✍️ Personal Details</div>
                <div className="cvm-form-grid">
                  <Field label="Full Name *"><input className="cvm-input" value={data.fullName} onChange={e => update({ fullName: e.target.value })} placeholder="John Smith" /></Field>
                  <Field label="Your Title"><input className="cvm-input" value={data.title} onChange={e => update({ title: e.target.value })} placeholder="Marketing Manager" /></Field>
                  <Field label="Email"><input className="cvm-input" value={data.email} onChange={e => update({ email: e.target.value })} placeholder="you@email.com" /></Field>
                  <Field label="Phone"><input className="cvm-input" value={data.phone} onChange={e => update({ phone: e.target.value })} placeholder="+1 234 567 890" /></Field>
                  <Field label="Location"><input className="cvm-input" value={data.location} onChange={e => update({ location: e.target.value })} placeholder="New York, NY" /></Field>
                  <Field label="LinkedIn / Website"><input className="cvm-input" value={data.linkedin} onChange={e => update({ linkedin: e.target.value })} placeholder="linkedin.com/in/..." /></Field>
                </div>
              </motion.div>

              <motion.div className="cvm-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
                <div className="cvm-card-title">🏢 Job & Company</div>
                <div className="cvm-form-grid">
                  <Field label="Company *"><input className="cvm-input" value={data.company} onChange={e => update({ company: e.target.value })} placeholder="Acme Corp" /></Field>
                  <Field label="Job Title *"><input className="cvm-input" value={data.jobTitle} onChange={e => update({ jobTitle: e.target.value })} placeholder="Product Designer" /></Field>
                  <Field label="Hiring Manager"><input className="cvm-input" value={data.hiringManager} onChange={e => update({ hiringManager: e.target.value })} placeholder="Jane Doe" /></Field>
                  <Field label="Job Location"><input className="cvm-input" value={data.jobLocation} onChange={e => update({ jobLocation: e.target.value })} placeholder="Remote / Austin, TX" /></Field>
                  <Field label="Reference ID"><input className="cvm-input" value={data.reference} onChange={e => update({ reference: e.target.value })} placeholder="REF-123" /></Field>
                  <Field label="Date"><input className="cvm-input" value={data.date} onChange={e => update({ date: e.target.value })} /></Field>
                </div>
              </motion.div>

              <motion.div className="cvm-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                <div className="cvm-card-title">💡 Content Helpers</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <Field label="Tone">
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
                        {TONES.map(t => (
                          <button key={t.key} className={`cvm-tog-btn${data.tone === t.key ? " active" : ""}`} onClick={() => update({ tone: t.key })}>{t.name.split(" ")[0]}</button>
                        ))}
                      </div>
                    </Field>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Field label="Length">
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 4 }}>
                        {LENGTHS.map(l => (
                          <button key={l.key} className={`cvm-tog-btn${data.length === l.key ? " active" : ""}`} onClick={() => update({ length: l.key })}>{l.name.split(" ")[0]}</button>
                        ))}
                      </div>
                    </Field>
                  </div>
                </div>

                <Field label="Highlights (one per line)">
                  <textarea className="cvm-input cvm-textarea" value={data.highlights} onChange={e => update({ highlights: e.target.value })} placeholder="• 2–3 key strengths&#10;• Achievement with numbers&#10;• Relevant tools/skills" />
                </Field>
                <div style={{ marginTop: 10 }}>
                  <Field label="Job Description (optional)">
                    <textarea className="cvm-input cvm-textarea" value={data.jobDescription} onChange={e => update({ jobDescription: e.target.value })} placeholder="Paste job description here to tailor your letter..." />
                  </Field>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Field label="Custom Paragraph (optional)">
                    <textarea className="cvm-input cvm-textarea" value={data.customParagraph} onChange={e => update({ customParagraph: e.target.value })} placeholder="Add anything else you'd like to mention..." />
                  </Field>
                </div>
              </motion.div>

              <div className="cvm-action">
                <div className="cvm-action-info">
                  <span className="cvm-action-label">Ready to export</span>
                  <span className="cvm-action-value">{safeText(data.fullName) || "Your Name"} · {tplStyle} · A4</span>
                </div>
                <div className="cvm-action-btns">
                  <button className="cvm-btn cvm-btn-danger" onClick={onReset}>Clear</button>
                  <button className="cvm-btn cvm-btn-primary" onClick={onPrint}>🖨️ Print PDF</button>
                  <button className="cvm-btn cvm-btn-ghost" onClick={onCopy} title="Copy plain text">📋</button>
                </div>
              </div>
            </div>

            {/* ══ RIGHT: PREVIEW ══ */}
            <div className={`cvm-preview-panel${mobileTab === "form" ? " cvm-col-hidden" : ""}`}>
              <div className="cvm-preview-header">
                <div className="cvm-preview-header-title">Live Preview</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <button className="cvm-btn" style={{ padding: "6px 12px", fontSize: "0.76rem", background: "rgba(59,130,246,0.06)", border: "1.5px solid rgba(59,130,246,0.15)", color: "var(--royal)", fontWeight: 700, borderRadius: 20 }} onClick={onReset}>Reset</button>
                  <button className="cvm-btn cvm-btn-primary" style={{ padding: "7px 14px", fontSize: "0.78rem" }} onClick={onPrint}>🖨️ Print PDF</button>
                  <button className="cvm-btn cvm-btn-ghost" style={{ padding: "7px 14px", fontSize: "0.78rem", background: "rgba(59,130,246,0.06)", border: "1.5px solid rgba(59,130,246,0.15)", color: "var(--royal)" }} onClick={onCopy} title="Copy plain text">📋</button>
                </div>
              </div>

              <div className="cvm-controls">
                <div className="cvm-style-grid">
                  {STYLES.map(s => (
                    <div key={s} className={`cvm-style-card${tplStyle === s ? " active" : ""}`} onClick={() => setTplStyle(s)}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: tplStyle === s ? "var(--navy)" : "var(--slate)" }}>{STYLE_LABELS[s]}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--slate)" }}>Accent</span>
                  {ACCENT_PALETTES.map(p => (
                    <div key={p} className={`cvm-dot${accent === p ? " selected" : ""}`} style={{ background: p }} onClick={() => setAccent(p)} title={p} />
                  ))}
                </div>
              </div>

              <div className="cvm-preview-scroll" ref={previewScrollRef}>
                <div style={{ width: paperW * scale, height: paperH * scale, position: "relative", flexShrink: 0 }}>
                  <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", position: "absolute", left: 0, top: 0, width: paperW, minHeight: paperH }}>
                    <div className="cl-paper-wrap" style={{ "--accent": accent }}>
                      <div className="cl-paper-inner">
                        <LetterDoc templateKey={tplStyle} data={letterData} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div className="cvm-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <p style={{ fontSize: "clamp(0.72rem,2.5vw,0.78rem)", color: "#64748b", marginBottom: 10, fontWeight: 600 }}>Need something else?</p>
            <div className="cvm-suggest">
              <Link to="/tools/career/cv-maker"><span>📄</span> CV Maker</Link>
              <Link to="/tools/pdf/image-to-pdf"><span>🖼️</span> Image → PDF</Link>
              <Link to="/tools/pdf/word-to-pdf"><span>📝</span> Word → PDF</Link>
              <Link to="/tools/image/jpg-to-png"><span>🔄</span> JPG → PNG</Link>
            </div>
            <div className="cvm-cta">
              <div>
                <h3>Earn while you learn 🚀</h3>
                <p>Join AIDLA today and start earning rewards as you build your skills.</p>
              </div>
              <Link to="/signup" className="cvm-cta-link">Join now ✨</Link>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
}

function Field({ label, children, style }) {
  return (
    <div className="cvm-field" style={style}>
      <label>{label}</label>
      {children}
    </div>
  );
}

function LetterDoc({ templateKey, data }) {
  return (
    <div className={`cl-doc tpl-${templateKey}`}>
      <div className="doc-header">
        <div className="doc-header-left">
          <div className="doc-name">{data.name}</div>
          {data.title && <div className="doc-role">{data.title}</div>}
        </div>
        {data.contact.length > 0 && (
          <div className="doc-contact">
            {data.contact.map((c, i) => <span key={i}>{c}</span>)}
          </div>
        )}
      </div>

      <div className="doc-body">
        <div className="doc-meta">
          {data.date && <div>{data.date}</div>}
          {data.reference && <div style={{ marginTop: 4 }}>Reference: {data.reference}</div>}
        </div>

        <div className="doc-salutation">{data.salutation}</div>

        <div className="doc-paragraphs">
          {data.paragraphs.map((p, i) => {
            if (p.includes("•")) {
              const lines = p.split("\n");
              const intro = lines[0];
              const bullets = lines.slice(1).map(l => l.replace("•", "").trim());
              return (
                <div key={i} className="doc-p">
                  {intro}
                  <ul className="doc-bullets">
                    {bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              );
            }
            return <p key={i} className="doc-p">{p}</p>;
          })}
        </div>

        <div className="doc-signoff">
          <div>{data.signOff}</div>
          <div className="doc-signoff-name">{data.name}</div>
        </div>
      </div>
    </div>
  );
}