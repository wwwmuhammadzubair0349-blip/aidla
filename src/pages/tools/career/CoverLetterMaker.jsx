import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

// ─── Global Styles ────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy:   #0b1437;
    --royal:  #1a3a8f;
    --sky:    #3b82f6;
    --gold:   #f59e0b;
    --gold-l: #fcd34d;
    --slate:  #64748b;
    --ok:     #059669;
    --red:    #dc2626;
    --bg: linear-gradient(160deg,#f0f4ff 0%,#fffbf0 60%,#e8f4fd 100%);
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  .cvm-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--navy);
    position: relative;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  .cvm-orbs { position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
  .cvm-orb  { position:absolute;border-radius:50%;filter:blur(80px); }
  .cvm-orb1 { width:420px;height:420px;background:rgba(59,130,246,0.07);top:-120px;left:-120px; }
  .cvm-orb2 { width:360px;height:360px;background:rgba(245,158,11,0.06);top:40%;right:-140px; }
  .cvm-orb3 { width:300px;height:300px;background:rgba(5,150,105,0.05);bottom:-60px;left:30%; }

  .cvm-wrap {
    flex: 1;
    max-width: 1120px;
    width: 100%;
    margin: 0 auto;
    padding: clamp(14px,4vw,52px) clamp(12px,4vw,28px) clamp(24px,6vw,60px);
    position: relative;
    z-index: 2;
  }

  .cvm-hero { margin-bottom: 14px; }
  .cvm-badge {
    display: inline-block;
    background: linear-gradient(135deg,var(--gold),var(--gold-l));
    color: var(--navy);
    padding: 4px 12px;
    border-radius: 30px;
    font-size: clamp(0.6rem,2vw,0.68rem);
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 8px;
    box-shadow: 0 4px 12px rgba(245,158,11,0.28);
  }
  .cvm-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.5rem,6vw,2.6rem);
    font-weight: 900;
    line-height: 1.12;
    margin-bottom: 6px;
  }
  .cvm-title-acc {
    background: linear-gradient(135deg,var(--royal),var(--sky));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .cvm-sub { color:var(--slate); font-size:clamp(0.82rem,3vw,0.95rem); line-height:1.5; }

  .cvm-pills { display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px; }
  .cvm-pill {
    background: rgba(59,130,246,0.06);
    border: 1px solid rgba(59,130,246,0.15);
    border-radius: 30px;
    padding: 3px 9px;
    font-size: clamp(0.6rem,2.2vw,0.7rem);
    font-weight: 600;
    color: var(--royal);
    white-space: nowrap;
  }

  .cvm-toast {
    border-radius: 12px;
    padding: 10px 12px;
    font-weight: 700;
    font-size: clamp(0.78rem,3vw,0.84rem);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    animation: cvm-slide 0.2s ease;
  }
  .cvm-toast.success { background:rgba(5,150,105,0.08);border:1px solid rgba(5,150,105,0.25);color:#065f46; }
  .cvm-toast.error   { background:rgba(220,38,38,0.07); border:1px solid rgba(220,38,38,0.2); color:#991b1b; }
  .cvm-toast.info    { background:rgba(59,130,246,0.07);border:1px solid rgba(59,130,246,0.2);color:#1e40af; }
  .cvm-toast-close { background:none;border:none;cursor:pointer;font-weight:900;color:inherit;font-size:1rem;line-height:1;padding:2px 4px;flex-shrink:0; }
  @keyframes cvm-slide { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }

  .cvm-card {
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(6px);
    border-radius: 20px;
    border: 1px solid rgba(59,130,246,0.11);
    box-shadow: 0 6px 24px rgba(11,20,55,0.07);
    padding: clamp(14px,3.5vw,24px);
    margin-bottom: 12px;
  }
  .cvm-card-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(0.9rem,3.5vw,1rem);
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cvm-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    align-items: start;
  }
  @media(min-width:960px) {
    .cvm-layout { grid-template-columns: 420px 1fr; }
  }

  .cvm-tab-bar {
    display: flex;
    gap: 7px;
    margin-bottom: 12px;
    flex-wrap: wrap;
    align-items: center;
  }
  @media(min-width:960px) { .cvm-tab-bar { display:none; } }

  .cvm-col-hidden { display: none !important; }
  @media(min-width:960px) {
    .cvm-col-form,
    .cvm-col-hidden { display: block !important; }
  }

  .cvm-form-grid {
    display: grid;
    grid-template-columns: repeat(2,1fr);
    gap: 9px;
    margin-top: 10px;
  }
  @media(min-width:480px) {
    .cvm-form-grid { grid-template-columns: repeat(auto-fit,minmax(140px,1fr)); }
  }
  .cvm-field { display:flex;flex-direction:column;gap:4px; }
  .cvm-field label {
    font-size: clamp(0.6rem,2vw,0.68rem);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--slate);
  }
  .cvm-input {
    width: 100%;
    padding: 8px 10px;
    border-radius: 10px;
    border: 1.5px solid rgba(59,130,246,0.18);
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.78rem,3vw,0.84rem);
    font-weight: 600;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    color: var(--navy);
  }
  .cvm-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(245,158,11,0.1); }
  .cvm-textarea { resize:vertical; line-height:1.55; min-height:72px; }

  .cvm-section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 800;
    font-size: clamp(0.8rem,3vw,0.88rem);
    color: var(--navy);
    margin-bottom: 4px;
  }

  .cvm-preview-panel {
    border-radius: 20px;
    border: 1px solid rgba(59,130,246,0.11);
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(6px);
    box-shadow: 0 6px 24px rgba(11,20,55,0.07);
    overflow: hidden;
  }
  @media(min-width:960px) { .cvm-preview-panel { position:sticky;top:12px; } }

  .cvm-preview-header {
    padding: 10px 14px;
    border-bottom: 1px solid rgba(59,130,246,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .cvm-preview-header-title {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: clamp(0.88rem,3vw,1rem);
  }

  .cvm-controls {
    padding: 10px 12px;
    border-bottom: 1px solid rgba(59,130,246,0.08);
  }

  .cvm-style-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:8px; }
  @media(max-width:440px) { .cvm-style-grid { grid-template-columns:repeat(2,1fr); } }
  .cvm-style-card {
    padding: 7px 4px;
    border-radius: 9px;
    border: 1.5px solid rgba(59,130,246,0.14);
    text-align: center;
    cursor: pointer;
    transition: 0.12s;
    background: #fff;
  }
  .cvm-style-card:hover { border-color:var(--gold); }
  .cvm-style-card.active { border-color:var(--gold);background:rgba(245,158,11,0.07);box-shadow:0 0 0 2px rgba(245,158,11,0.2); }

  .cvm-dot {
    width:22px;height:22px;border-radius:50%;cursor:pointer;
    transition:transform 0.1s;flex-shrink:0;
    border:2px solid transparent;
  }
  .cvm-dot:hover { transform:scale(1.15); }
  .cvm-dot.selected { outline:3px solid var(--navy);outline-offset:2px; }

  .cvm-preview-scroll {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 72vh;
    background: #dde3ef;
    padding: 14px 10px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .cvm-stats {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding: 10px 14px;
    background: rgba(245,158,11,0.06);
    border-radius: 12px;
    border-left: 4px solid var(--gold);
  }
  .cvm-stat     { font-size:clamp(0.68rem,2.5vw,0.76rem);font-weight:700;color:var(--navy);display:flex;align-items:center;gap:4px; }
  .cvm-stat.g   { color:var(--ok); }
  .cvm-stat-div { width:1px;height:13px;background:rgba(0,0,0,0.1); }

  .cvm-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 14px;
    padding: 12px 14px;
    background: linear-gradient(135deg, var(--navy), var(--royal));
    border-radius: 16px;
    flex-wrap: nowrap;
  }
  .cvm-action-info { flex:1;min-width:0;display:none; }
  @media(min-width:520px) { .cvm-action-info { display:block; } }
  .cvm-action-label { font-size:0.62rem;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:0.06em;text-transform:uppercase;display:block;white-space:nowrap; }
  .cvm-action-value { font-size:clamp(0.75rem,2.5vw,0.85rem);font-weight:700;color:rgba(255,255,255,0.9);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
  .cvm-action-btns  { display:flex;gap:7px;align-items:center;flex-shrink:0;flex-wrap:nowrap; }

  .cvm-btn {
    padding: clamp(8px,2.5vw,10px) clamp(12px,3.5vw,18px);
    border-radius: 30px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.76rem,3vw,0.86rem);
    font-weight: 800;
    cursor: pointer;
    transition: 0.15s;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    touch-action: manipulation;
  }
  .cvm-btn:disabled { opacity:0.4;cursor:not-allowed;transform:none!important; }

  .cvm-btn-primary {
    background: linear-gradient(135deg,var(--gold),var(--gold-l));
    color: var(--navy);
    box-shadow: 0 4px 14px rgba(245,158,11,0.35);
  }
  .cvm-btn-primary:hover:not(:disabled),.cvm-btn-primary:active:not(:disabled) {
    transform:scale(1.03);
    box-shadow:0 6px 18px rgba(245,158,11,0.5);
  }
  .cvm-btn-ghost {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.18);
    color: rgba(255,255,255,0.85);
  }
  .cvm-btn-ghost:hover:not(:disabled),.cvm-btn-ghost:active:not(:disabled) { background:rgba(255,255,255,0.15);color:#fff; }

  .cvm-btn-danger {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.55);
  }
  .cvm-btn-danger:hover:not(:disabled),.cvm-btn-danger:active:not(:disabled) { background:rgba(220,38,38,0.2);color:#fff;border-color:rgba(220,38,38,0.4); }

  .cvm-tog-btn {
    padding: 5px 9px;
    border-radius: 20px;
    border: 1.5px solid rgba(59,130,246,0.2);
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.62rem,2vw,0.7rem);
    font-weight: 700;
    color: var(--slate);
    cursor: pointer;
    transition: 0.12s;
  }
  .cvm-tog-btn:hover { border-color:var(--gold);color:var(--navy); }
  .cvm-tog-btn.active {
    background: linear-gradient(135deg,var(--gold),var(--gold-l));
    border-color: transparent;
    color: var(--navy);
    box-shadow: 0 2px 8px rgba(245,158,11,0.25);
  }

  .cvm-suggest { display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:12px; }
  @media(min-width:480px) { .cvm-suggest { grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); } }
  .cvm-suggest a {
    display:flex;align-items:center;gap:7px;padding:9px 12px;
    background:rgba(255,255,255,0.6);border-radius:30px;
    border:1px solid rgba(59,130,246,0.1);
    color:var(--navy);text-decoration:none;font-weight:600;transition:0.1s;
    font-size:clamp(0.75rem,3vw,0.86rem);
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }
  .cvm-suggest a:active,.cvm-suggest a:hover { background:#fff;border-color:var(--gold); }

  .cvm-cta {
    margin-top:14px;
    background:linear-gradient(135deg,var(--navy),var(--royal));
    border-radius:18px;padding:clamp(14px,4vw,22px) clamp(14px,4vw,26px);color:#fff;
    display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;
  }
  .cvm-cta h3 { font-family:'Playfair Display',serif;font-size:clamp(0.92rem,4vw,1.1rem);margin-bottom:2px; }
  .cvm-cta p  { opacity:0.82;font-size:clamp(0.76rem,3vw,0.86rem); }
  .cvm-cta-link {
    background:linear-gradient(135deg,var(--gold),var(--gold-l));
    color:var(--navy);padding:9px 18px;border-radius:40px;
    font-weight:800;text-decoration:none;white-space:nowrap;
    font-family:'DM Sans',sans-serif;font-size:clamp(0.8rem,3vw,0.9rem);
    flex-shrink:0;
  }

  .cvm-footer {
    background: var(--navy);
    color: rgba(255,255,255,0.55);
    padding: clamp(16px,4vw,28px) 20px;
    text-align: center;
    font-size: clamp(0.75rem,2.5vw,0.82rem);
    position: relative; z-index: 2;
  }
  .cvm-footer strong { color:var(--gold-l); }
  .cvm-footer a { color:rgba(255,255,255,0.4);text-decoration:none;margin:0 8px; }
  .cvm-footer a:active,.cvm-footer a:hover { color:#fff; }

  @media print {
    html, body { margin:0!important; padding:0!important; background:#fff!important; }
    .cvm-root { display:none!important; }
    #cvm-print-root { display:block!important; }
    #cvm-print-root .cl-paper-wrap { box-shadow:none!important; border:none!important; border-radius:0!important; margin:0!important; width:100%!important; min-height:auto!important; transform:none!important; }
    @page { margin:0; size:A4; }
  }
  #cvm-print-root { display:none; }
`;

// ─── Letter Document Styles ───────────────────────────────────────
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

  return (
    <div className="cvm-root">
      <style>{GLOBAL_STYLES + LETTER_DOC_STYLES}</style>

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

      <footer className="cvm-footer">
        <div style={{ marginBottom: 8, fontSize: "1.1rem" }}>✉️</div>
        <p>&copy; 2025 <strong>AIDLA</strong>. All rights reserved. Designed with ❤️ for learners everywhere.</p>
        <p style={{ marginTop: 8 }}>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </p>
      </footer>
    </div>
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