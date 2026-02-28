import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/*
  REQUIRED CDN SCRIPTS in index.html (add before </body>):
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
*/

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy: #0b1437; --royal: #1a3a8f; --sky: #3b82f6;
    --gold: #f59e0b; --gold-light: #fcd34d; --slate: #64748b; --ok: #059669;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .tool-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .bg-orbs { position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
  .bg-orb-1 { position:absolute;width:400px;height:400px;border-radius:50%;background:rgba(59,130,246,0.06);filter:blur(80px);top:-120px;left:-120px; }
  .bg-orb-2 { position:absolute;width:340px;height:340px;border-radius:50%;background:rgba(245,158,11,0.05);filter:blur(80px);top:300px;right:-160px; }

  .tool-wrap {
    flex: 1;
    max-width: 920px;
    width: 100%;
    margin: 0 auto;
    padding: clamp(14px,4vw,52px) clamp(12px,4vw,28px) clamp(24px,6vw,60px);
    position: relative;
    z-index: 2;
  }

  /* ── Header ── */
  .tool-badge {
    display: inline-block;
    background: linear-gradient(135deg,#f59e0b,#fcd34d);
    color: #0b1437;
    padding: 4px 12px;
    border-radius: 30px;
    font-size: clamp(0.6rem,2vw,0.68rem);
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 8px;
    box-shadow: 0 4px 12px rgba(245,158,11,0.25);
  }
  .tool-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.5rem,6vw,2.5rem);
    font-weight: 900;
    color: #0b1437;
    line-height: 1.15;
    margin-bottom: 6px;
  }
  .tool-title-accent {
    background: linear-gradient(135deg,#1a3a8f,#3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .tool-sub { color: #64748b; font-size: clamp(0.82rem,3vw,0.95rem); line-height: 1.5; }
  .quality-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(5,150,105,0.08);
    border: 1px solid rgba(5,150,105,0.25);
    color: #059669;
    padding: 3px 10px;
    border-radius: 30px;
    font-size: clamp(0.64rem,2vw,0.72rem);
    font-weight: 700;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  /* ── Feature pills ── */
  .feature-pills { display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px; }
  .pill {
    background: rgba(59,130,246,0.06);
    border: 1px solid rgba(59,130,246,0.15);
    border-radius: 30px;
    padding: 3px 9px;
    font-size: clamp(0.6rem,2.2vw,0.72rem);
    font-weight: 600;
    color: #1a3a8f;
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }

  /* ── Card ── */
  .tool-card {
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(4px);
    border-radius: 20px;
    border: 1px solid rgba(59,130,246,0.12);
    box-shadow: 0 6px 24px rgba(11,20,55,0.06);
    padding: clamp(14px,4vw,32px);
    margin-bottom: 14px;
  }

  /* ── Drop zone ── */
  .dropzone {
    border: 2px dashed rgba(59,130,246,0.3);
    border-radius: 16px;
    padding: clamp(22px,5vw,40px) clamp(12px,4vw,20px);
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: rgba(255,255,255,0.5);
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .dropzone:hover, .dropzone:active, .dropzone.active {
    border-color: #f59e0b;
    background: rgba(245,158,11,0.04);
    box-shadow: 0 0 0 4px rgba(245,158,11,0.1);
  }
  .dropzone-icon {
    font-size: clamp(2rem,8vw,3rem);
    display: block;
    margin-bottom: 8px;
    transition: transform 0.2s;
  }
  .dropzone:hover .dropzone-icon { transform: scale(1.1) rotate(-4deg); }
  .dropzone-title { font-weight: 700; font-size: clamp(0.88rem,3.5vw,1rem); color: #0b1437; margin-bottom: 5px; }
  .dropzone-sub { font-size: clamp(0.7rem,2.5vw,0.8rem); color: #64748b; }

  /* ── File info ── */
  .file-info {
    background: rgba(245,158,11,0.05);
    border-radius: 14px;
    padding: clamp(12px,3vw,16px) clamp(12px,3vw,20px);
    margin-top: 14px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-left: 4px solid #f59e0b;
  }
  .file-info-left { flex: 1; min-width: 0; }
  .file-name {
    font-weight: 700;
    color: #0b1437;
    font-size: clamp(0.8rem,3vw,0.9rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .file-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 3px; }
  .file-size { font-size: clamp(0.68rem,2.5vw,0.75rem); color: #64748b; }
  .img-count { font-size: clamp(0.68rem,2.5vw,0.75rem); color: #059669; font-weight: 700; }

  /* ── Progress ── */
  .progress-wrap { margin-top: 14px; }
  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: clamp(0.7rem,2.5vw,0.8rem);
    color: #64748b;
    margin-bottom: 5px;
    font-weight: 700;
  }
  .progress-bar-bg { height: 7px; background: rgba(59,130,246,0.1); border-radius: 30px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: linear-gradient(90deg,#f59e0b,#fcd34d); border-radius: 30px; transition: width 0.3s ease; }
  .progress-step {
    font-size: clamp(0.62rem,2.2vw,0.75rem);
    color: #64748b;
    margin-top: 5px;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Error ── */
  .error-box {
    color: #b91c1c;
    margin-top: 12px;
    font-size: clamp(0.78rem,3vw,0.85rem);
    background: rgba(185,28,28,0.05);
    padding: 10px 14px;
    border-radius: 12px;
    border-left: 3px solid #b91c1c;
  }

  /* ── Success ── */
  .success-box { text-align: center; padding: clamp(12px,3vw,20px) 0; }
  .success-icon { font-size: clamp(2.5rem,8vw,3.5rem); margin-bottom: 10px; display: block; }
  .success-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.1rem,5vw,1.4rem);
    font-weight: 700;
    color: #0b1437;
    margin-bottom: 5px;
  }
  .success-meta { font-size: clamp(0.72rem,2.5vw,0.8rem); color: #64748b; margin-bottom: 18px; }

  /* ── Preview ── */
  .preview-panel {
    margin-top: 16px;
    border: 1px solid rgba(59,130,246,0.12);
    border-radius: 14px;
    overflow: hidden;
  }
  .preview-header {
    background: rgba(59,130,246,0.05);
    padding: 9px 14px;
    font-size: clamp(0.65rem,2.5vw,0.75rem);
    font-weight: 700;
    color: #1a3a8f;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(59,130,246,0.1);
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .preview-scroll { max-height: clamp(280px,60vw,460px); overflow-y: auto; background: #f8f8f8; }

  /* ── Buttons ── */
  .btn {
    background: white;
    border: 1px solid rgba(59,130,246,0.2);
    padding: clamp(8px,2.5vw,10px) clamp(14px,4vw,20px);
    border-radius: 30px;
    font-weight: 700;
    color: #0b1437;
    cursor: pointer;
    transition: 0.15s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.78rem,3vw,0.9rem);
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    white-space: nowrap;
  }
  .btn:active, .btn:hover { background: #f8faff; }
  .btn-primary {
    background: linear-gradient(135deg,#f59e0b,#fcd34d);
    border: none;
    color: #0b1437;
    font-weight: 800;
    box-shadow: 0 4px 12px rgba(245,158,11,0.3);
  }
  .btn-primary:active, .btn-primary:hover { transform: scale(1.02); box-shadow: 0 6px 16px rgba(245,158,11,0.5); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
  .btn-group { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }

  /* ── Tools suggest ── */
  .tools-suggest {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: 12px;
  }
  @media(min-width:480px) { .tools-suggest { grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); } }
  .tools-suggest a {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 12px;
    background: rgba(255,255,255,0.6);
    border-radius: 30px;
    border: 1px solid rgba(59,130,246,0.1);
    color: #0b1437;
    text-decoration: none;
    font-weight: 600;
    transition: 0.1s;
    font-size: clamp(0.75rem,3vw,0.88rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-tap-highlight-color: transparent;
  }
  .tools-suggest a:active, .tools-suggest a:hover { background: white; border-color: #f59e0b; }

  /* ── CTA ── */
  .tool-cta {
    margin-top: 14px;
    background: linear-gradient(135deg, var(--navy), var(--royal));
    border-radius: 18px;
    padding: clamp(14px,4vw,22px) clamp(14px,4vw,26px);
    color: #fff;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .tool-cta h3 { font-family:'Playfair Display',serif; font-size:clamp(0.92rem,4vw,1.1rem); margin-bottom:2px; }
  .tool-cta p { opacity:0.82; font-size:clamp(0.76rem,3vw,0.86rem); }
  .tool-cta-link {
    background: linear-gradient(135deg,#f59e0b,#fcd34d);
    color: #0b1437;
    padding: 9px 18px;
    border-radius: 40px;
    font-weight: 800;
    text-decoration: none;
    white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.8rem,3vw,0.9rem);
    -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }

  /* ── Footer ── */
  .site-footer {
    background: #0b1437;
    color: rgba(255,255,255,0.6);
    padding: clamp(16px,4vw,30px) 20px;
    text-align: center;
    font-size: clamp(0.75rem,2.5vw,0.85rem);
    position: relative;
    z-index: 2;
  }
  .site-footer strong { color: #fcd34d; }
  .site-footer a { color:rgba(255,255,255,0.4);text-decoration:none;margin:0 8px; }
  .site-footer a:active, .site-footer a:hover { color: #fff; }

  /* ── Hidden render stage ── */
  #word-render-stage {
    position: fixed;
    left: -99999px;
    top: 0;
    width: 794px;
    background: #ffffff;
  }

  /* ── Word-faithful document styles ── */
  .word-doc {
    font-family: 'Calibri', 'Segoe UI', 'Arial', sans-serif;
    font-size: 11pt;
    line-height: 1.15;
    color: #000000;
    padding: 72px 72px;
    width: 794px;
    background: #fff;
  }
  .word-doc .cv-header { display:flex;flex-direction:row;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:16px; }
  .word-doc .cv-header-left { flex:1;text-align:center; }
  .word-doc .cv-header-right { width:110px;flex-shrink:0; }
  .word-doc .cv-header-right img { width:110px;height:135px;object-fit:cover;object-position:top center;display:block; }
  .word-doc .cv-name { font-size:16pt;font-weight:700;letter-spacing:0.04em;margin-bottom:2px;text-align:center; }
  .word-doc .cv-subtitle { font-size:10.5pt;font-weight:600;font-style:italic;text-align:center;margin-bottom:4px; }
  .word-doc .cv-contact-row { font-size:9.5pt;text-align:center;margin-bottom:2px;line-height:1.4; }
  .word-doc .cv-contact-row a { color:#1155CC;text-decoration:underline; }
  .word-doc .cv-section-heading { font-size:11pt;font-weight:700;text-decoration:underline;text-transform:uppercase;margin-top:11px;margin-bottom:4px;display:block; }
  .word-doc .cv-job-row { display:flex;justify-content:space-between;align-items:center;background-color:#D9D9D9;padding:2px 6px;margin-top:5px;margin-bottom:3px; }
  .word-doc .cv-job-title { font-weight:700;font-size:10.5pt; }
  .word-doc .cv-job-date { font-size:10.5pt;white-space:nowrap; }
  .word-doc .cv-arrow-heading { display:flex;align-items:flex-start;gap:4px;font-weight:700;font-size:10.5pt;margin-top:4px;margin-bottom:2px; }
  .word-doc .cv-arrow-heading .arr { flex-shrink:0; }
  .word-doc .cv-bullet { display:flex;align-items:flex-start;gap:6px;margin-bottom:2px;font-size:10.5pt;line-height:1.35;padding-left:10px; }
  .word-doc .cv-bullet .bd { flex-shrink:0;margin-top:3px;font-size:7pt;line-height:1; }
  .word-doc .cv-sub-bullet { display:flex;align-items:flex-start;gap:6px;margin-bottom:2px;font-size:10.5pt;line-height:1.35;padding-left:26px; }
  .word-doc .cv-sub-bullet .bd { flex-shrink:0;margin-top:3px;font-size:6pt;line-height:1; }
  .word-doc .cv-para { font-size:10.5pt;line-height:1.35;margin-bottom:3px; }
  .word-doc .cv-img-block { display:block;width:100%;margin:8px 0;text-align:center; }
  .word-doc .cv-img-block img { max-width:100%;height:auto;display:inline-block; }
  .word-doc strong,.word-doc b { font-weight:700; }
  .word-doc em,.word-doc i { font-style:italic; }
  .word-doc u { text-decoration:underline; }
  .word-doc a { color:#1155CC;text-decoration:underline; }
  .word-doc table { border-collapse:collapse;width:100%;margin:4px 0; }
  .word-doc td,.word-doc th { border:1px solid #999;padding:4px 6px;font-size:10pt;vertical-align:top; }
  .word-doc th { background:#f0f0f0;font-weight:700; }
`;

// ─── Constants ───────────────────────────────────────────────────
const STORAGE_KEY = "word2pdf_v4";
const EXPIRY_MS   = 60 * 60 * 1000;
const A4_W_PX     = 794;
const A4_H_PX     = 1123;
const PDF_W_MM    = 210;
const PDF_H_MM    = 297;
const SCALE       = 2;

const fmtBytes = (b) =>
  b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";

// ─── Layout Reconstructor ────────────────────────────────────────
function reconstructLayout(rawHtml) {
  const parser = new DOMParser();
  const dom    = parser.parseFromString(`<body>${rawHtml}</body>`, "text/html");
  const nodes  = Array.from(dom.body.childNodes).filter((n) => n.nodeType === 1);

  const t  = (el) => (el.textContent || "").trim();
  const ih = (el) => el.innerHTML || "";

  const isSectionHeading = (el) => {
    const s = t(el);
    if (!s || s.length > 100) return false;
    const hasU   = !!el.querySelector("u");
    const isCaps = s === s.toUpperCase() && s.endsWith(":") && /[A-Z]{2}/.test(s);
    return hasU || isCaps;
  };

  const isJobRow = (el) => {
    const s = t(el);
    if (!s || s.length > 220) return false;
    const hasDate = /\(\w+\s+\d{4}/.test(s) || /\d{4}\s*[-–]\s*(\d{4}|Current|Present)/i.test(s);
    const hasBold = !!el.querySelector("strong, b");
    return hasDate && hasBold;
  };

  const isArrowHeading = (el) => /^[➤➢►▶»]/.test(t(el));

  const hasImage = (el) =>
    el.nodeName === "IMG" || !!el.querySelector?.("img");

  let profileImg  = null;
  let seenSection = false;
  for (const node of nodes) {
    if (!seenSection && isSectionHeading(node)) { seenSection = true; break; }
    if (!seenSection && hasImage(node)) {
      profileImg = node.nodeName === "IMG" ? node : node.querySelector("img");
      break;
    }
  }

  let headerNodes = [];
  let bodyNodes   = [];
  seenSection = false;

  for (const node of nodes) {
    if (!seenSection && isSectionHeading(node)) seenSection = true;
    if (!seenSection) {
      const isProfileNode = profileImg && (node === profileImg || node.contains?.(profileImg));
      if (!isProfileNode) headerNodes.push(node);
    } else {
      bodyNodes.push(node);
    }
  }

  let out = `<div class="cv-header"><div class="cv-header-left">`;
  headerNodes.forEach((node, i) => {
    const s = t(node);
    if (!s) return;
    if (i === 0) out += `<div class="cv-name">${ih(node)}</div>`;
    else if (i === 1) out += `<div class="cv-subtitle">${ih(node)}</div>`;
    else out += `<div class="cv-contact-row">${ih(node)}</div>`;
  });
  out += `</div><div class="cv-header-right">`;
  if (profileImg) out += `<img src="${profileImg.src}" alt="Profile" />`;
  out += `</div></div>`;

  const renderList = (listEl, depth = 0) => {
    let s = "";
    Array.from(listEl.children)
      .filter((c) => c.nodeName === "LI")
      .forEach((li) => {
        const clone = li.cloneNode(true);
        clone.querySelectorAll("ul,ol").forEach((nl) => nl.remove());
        const liHtml = clone.innerHTML;
        const cls    = depth > 0 ? "cv-sub-bullet" : "cv-bullet";
        s += `<div class="${cls}"><span class="bd">•</span><span>${liHtml}</span></div>`;
        li.querySelectorAll(":scope > ul, :scope > ol").forEach((nl) => {
          s += renderList(nl, depth + 1);
        });
      });
    return s;
  };

  for (const node of bodyNodes) {
    const s = t(node);

    if (hasImage(node)) {
      const imgs = node.nodeName === "IMG" ? [node] : Array.from(node.querySelectorAll("img"));
      imgs.forEach((img) => {
        if (img.src) out += `<div class="cv-img-block"><img src="${img.src}" alt="Document image" /></div>`;
      });
      if (node.nodeName !== "IMG" && s) {
        const clone = node.cloneNode(true);
        clone.querySelectorAll("img").forEach((i) => i.remove());
        const rest = (clone.textContent || "").trim();
        if (rest) out += `<div class="cv-para">${rest}</div>`;
      }
      continue;
    }

    if (!s && node.nodeName !== "TABLE") continue;

    if (isSectionHeading(node)) { out += `<span class="cv-section-heading">${s}</span>`; continue; }

    if (isJobRow(node)) {
      const dateRe = /(\(\w+\s+\d{4}[^)]*\)|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–]\s*(?:\w+\s*\d{0,4}|Current|Present))/i;
      const m = s.match(dateRe);
      let titleHtml = ih(node);
      let dateText  = "";
      if (m) { dateText = m[0]; titleHtml = titleHtml.replace(m[0], "").trim(); }
      out += `<div class="cv-job-row"><div class="cv-job-title">${titleHtml}</div>${dateText ? `<div class="cv-job-date">${dateText}</div>` : ""}</div>`;
      continue;
    }

    if (isArrowHeading(node)) {
      out += `<div class="cv-arrow-heading"><span class="arr">➤</span><span>${ih(node).replace(/^[➤➢►▶»]\s*/, "")}</span></div>`;
      continue;
    }

    if (node.nodeName === "UL" || node.nodeName === "OL") { out += renderList(node, 0); continue; }
    if (/^[•·\-]\s/.test(s)) {
      out += `<div class="cv-bullet"><span class="bd">•</span><span>${ih(node).replace(/^[•·\-]\s*/, "")}</span></div>`;
      continue;
    }
    if (node.nodeName === "TABLE") { out += node.outerHTML; continue; }
    if (s) out += `<div class="cv-para">${ih(node)}</div>`;
  }

  return `<div class="word-doc">${out}</div>`;
}

// ─── Page boundaries ─────────────────────────────────────────────
async function computePageBoundaries(stageEl) {
  const docEl = stageEl.querySelector(".word-doc");
  if (!docEl) return [0];

  const blocks = Array.from(docEl.querySelectorAll(
    ".cv-header, .cv-section-heading, .cv-job-row, .cv-arrow-heading, " +
    ".cv-bullet, .cv-sub-bullet, .cv-para, .cv-img-block, table, .cv-contact-row, " +
    ".cv-name, .cv-subtitle"
  ));

  const stageTop   = stageEl.getBoundingClientRect().top + window.scrollY;
  const totalH     = stageEl.scrollHeight;
  const boundaries = [0];

  let nominalY = A4_H_PX;
  while (nominalY < totalH) {
    let snapY = nominalY;
    for (let i = blocks.length - 1; i >= 0; i--) {
      const rect        = blocks[i].getBoundingClientRect();
      const blockBottom = rect.bottom + window.scrollY - stageTop;
      if (blockBottom <= nominalY - 20) { snapY = Math.ceil(blockBottom) + 1; break; }
    }
    boundaries.push(snapY);
    nominalY = snapY + A4_H_PX;
  }
  boundaries.push(totalH);
  return boundaries;
}

// ─── Component ───────────────────────────────────────────────────
export default function WordToPdf() {
  const [file,             setFile]             = useState(null);
  const [converting,       setConverting]       = useState(false);
  const [progress,         setProgress]         = useState(0);
  const [progressStep,     setProgressStep]     = useState("");
  const [previewHtml,      setPreviewHtml]      = useState("");
  const [convertedPdfData, setConvertedPdfData] = useState(null);
  const [fileName,         setFileName]         = useState("");
  const [pdfSizeKb,        setPdfSizeKb]        = useState(0);
  const [pageCount,        setPageCount]        = useState(0);
  const [imageCount,       setImageCount]       = useState(0);
  const [error,            setError]            = useState("");
  const [dragActive,       setDragActive]       = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (Date.now() - data.timestamp < EXPIRY_MS) {
          setConvertedPdfData(data.pdfBase64);
          setFileName(data.fileName);
          setPdfSizeKb(data.pdfSizeKb || 0);
          setPageCount(data.pageCount || 0);
        } else localStorage.removeItem(STORAGE_KEY);
      }
    } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);

  const runMammoth = async (f) => {
    const mammoth = window.mammoth;
    if (!mammoth) throw new Error("Mammoth library not loaded. Add CDN script to index.html.");
    const ab = await f.arrayBuffer();
    let imgCount = 0;
    const result = await mammoth.convertToHtml(
      { arrayBuffer: ab },
      {
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Title']     => p.wtitle:fresh",
        ],
        includeDefaultStyleMap: true,
        convertImage: mammoth.images.imgElement((image) =>
          image.read("base64").then((b64) => {
            imgCount++;
            return { src: `data:${image.contentType || "image/jpeg"};base64,${b64}` };
          })
        ),
      }
    );
    return { html: result.value, imgCount };
  };

  const handleFile = useCallback(async (f) => {
    if (!f.name.toLowerCase().endsWith(".docx")) { setError("Please upload a .docx file."); return; }
    if (f.size > 30 * 1024 * 1024) { setError("File too large — max 30 MB."); return; }
    setError(""); setFile(f); setFileName(f.name);
    setConvertedPdfData(null); setPreviewHtml(""); setProgress(0); setProgressStep("");
    try {
      const { html, imgCount } = await runMammoth(f);
      setImageCount(imgCount);
      setPreviewHtml(reconstructLayout(html));
    } catch (e) { console.warn("Preview:", e); }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault(); setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const convertToPdf = async () => {
    if (!file) return;
    setConverting(true); setError("");
    setProgress(5); setProgressStep("Reading document…");
    try {
      const html2canvas = window.html2canvas;
      const { jsPDF }   = window.jspdf;
      if (!html2canvas) throw new Error("html2canvas not loaded. Add CDN script.");
      if (!jsPDF)       throw new Error("jsPDF not loaded. Add CDN script.");

      setProgress(15); setProgressStep("Extracting content & all images…");
      const { html, imgCount } = await runMammoth(file);
      setImageCount(imgCount);

      setProgress(32); setProgressStep("Reconstructing layout…");
      const layoutHtml = reconstructLayout(html);
      setPreviewHtml(layoutHtml);

      const stage = stageRef.current;
      stage.innerHTML = layoutHtml;

      setProgress(42); setProgressStep(`Waiting for ${imgCount} image(s) to render…`);
      const imgs = Array.from(stage.querySelectorAll("img"));
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = res; img.onerror = res;
                setTimeout(res, 3000);
              })
        )
      );
      await new Promise((r) => setTimeout(r, 600));

      setProgress(52); setProgressStep("Calculating smart page boundaries…");
      const boundaries = await computePageBoundaries(stage);
      const pages = boundaries.length - 1;
      setPageCount(pages);

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      for (let p = 0; p < pages; p++) {
        const yStart = boundaries[p];
        const yEnd   = boundaries[p + 1];
        const sliceH = yEnd - yStart;

        setProgress(52 + Math.round(((p + 0.5) / pages) * 40));
        setProgressStep(`Rendering page ${p + 1} of ${pages}…`);

        const canvas = await html2canvas(stage, {
          scale: SCALE, useCORS: true, allowTaint: true,
          backgroundColor: "#ffffff", scrollY: -yStart,
          windowWidth: A4_W_PX, windowHeight: sliceH,
          height: sliceH, y: yStart, logging: false,
        });

        const sliceRatio  = sliceH / A4_H_PX;
        const imgHeightMM = PDF_H_MM * sliceRatio;
        const imgData     = canvas.toDataURL("image/jpeg", 0.97);
        if (p > 0) doc.addPage();
        doc.addImage(imgData, "JPEG", 0, 0, PDF_W_MM, imgHeightMM, undefined, "FAST");
        await new Promise((r) => setTimeout(r, 10));
      }

      setProgress(97); setProgressStep("Finalising PDF…");
      stage.innerHTML = "";

      const pdfBase64 = doc.output("datauristring").split(",")[1];
      const kbSize    = Math.round(atob(pdfBase64).length / 1024);
      setPdfSizeKb(kbSize);

      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        fileName: file.name, pdfBase64, pdfSizeKb: kbSize,
        pageCount: pages, timestamp: Date.now(),
      }));

      setConvertedPdfData(pdfBase64);
      setProgress(100); setProgressStep("Done!");
    } catch (err) {
      console.error(err);
      setError(
        err.message.includes("not loaded")
          ? err.message
          : "Conversion failed. Check console for details."
      );
    } finally { setConverting(false); }
  };

  const handleDownload = () => {
    if (!convertedPdfData) return;
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${convertedPdfData}`;
    link.download = fileName.replace(/\.docx$/i, ".pdf") || "converted.pdf";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    localStorage.removeItem(STORAGE_KEY);
    setConvertedPdfData(null); setFile(null); setFileName(""); setPreviewHtml(""); setProgress(0);
  };

  const handleConvertAnother = () => {
    setFile(null); setFileName(""); setConvertedPdfData(null);
    setPreviewHtml(""); setError(""); setProgress(0); setProgressStep("");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="tool-root">
      <style>{styles}</style>
      <div id="word-render-stage" ref={stageRef} aria-hidden="true" />

      <div className="bg-orbs">
        <div className="bg-orb-1" /><div className="bg-orb-2" />
      </div>

      <div className="tool-wrap">
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
          <span className="tool-badge">📄 PDF Tool</span>
          <h1 className="tool-title">
            Word <span className="tool-title-accent">→ PDF</span>
          </h1>
          <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:8, marginBottom:14 }}>
            <p className="tool-sub">Convert .docx → PDF with full layout, images & certificates preserved.</p>
            <span className="quality-badge">✦ Pixel-faithful</span>
          </div>
        </motion.div>

        <div className="feature-pills">
          {["✓ Profile photo","✓ Certificates","✓ Transcripts","✓ 2-col header","✓ Smart breaks","✓ 100% private"].map((p) => (
            <span className="pill" key={p}>{p}</span>
          ))}
        </div>

        <motion.div className="tool-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.1 }}>
          <AnimatePresence mode="wait">
            {/* ── SUCCESS ── */}
            {convertedPdfData ? (
              <motion.div
                key="success"
                initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                className="success-box"
              >
                <span className="success-icon">✅</span>
                <div className="success-title">Conversion complete!</div>
                <p className="success-meta">
                  {fileName.replace(/\.docx$/i, ".pdf")}
                  {pageCount > 0 && <> · {pageCount} pages</>}
                  {pdfSizeKb > 0 && <> · {pdfSizeKb} KB</>}
                </p>
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={handleDownload}>⬇ Download PDF</button>
                  <button className="btn" onClick={handleConvertAnother}>↻ Convert another</button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="upload" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

                {/* Drop zone */}
                <div
                  className={`dropzone${dragActive ? " active" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("fileInput").click()}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && document.getElementById("fileInput").click()}
                >
                  <input
                    id="fileInput" type="file" accept=".docx"
                    onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
                    style={{ display:"none" }}
                  />
                  <span className="dropzone-icon">📂</span>
                  <p className="dropzone-title">
                    {dragActive ? "Drop it here!" : "Drag & drop or tap to browse"}
                  </p>
                  <p className="dropzone-sub">.docx only · max 30 MB · all images preserved</p>
                </div>

                {/* Error */}
                {error && <p className="error-box">⚠ {error}</p>}

                {/* File info */}
                {file && !converting && (
                  <motion.div className="file-info" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}>
                    <div className="file-info-left">
                      <div className="file-name">{file.name}</div>
                      <div className="file-meta">
                        <span className="file-size">{fmtBytes(file.size)}</span>
                        {imageCount > 0 && (
                          <span className="img-count">🖼 {imageCount} image{imageCount > 1 ? "s" : ""}</span>
                        )}
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={convertToPdf} disabled={converting}>
                      Convert to PDF
                    </button>
                  </motion.div>
                )}

                {/* Progress */}
                {converting && (
                  <motion.div className="progress-wrap" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                    <div className="progress-label">
                      <span>Converting…</span><span>{progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
                    </div>
                    <p className="progress-step">{progressStep}</p>
                  </motion.div>
                )}

                {/* Preview */}
                {previewHtml && !converting && (
                  <motion.div
                    className="preview-panel"
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
                  >
                    <div className="preview-header">
                      <span>👁</span> Live preview
                      {imageCount > 0 && (
                        <span style={{ marginLeft:"auto", color:"#059669", textTransform:"none", letterSpacing:0 }}>
                          🖼 {imageCount} image{imageCount !== 1 ? "s" : ""} included
                        </span>
                      )}
                    </div>
                    <div className="preview-scroll">
                      <div style={{ transform:"scale(0.72)", transformOrigin:"top left", width:"138.9%" }}>
                        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                      </div>
                    </div>
                  </motion.div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

          {/* Other tools */}
          <div style={{ marginTop:24 }}>
            <p style={{ fontSize:"clamp(0.72rem,2.5vw,0.8rem)", color:"#64748b", marginBottom:10, fontWeight:600 }}>Need something else?</p>
            <div className="tools-suggest">
              <Link to="/tools/pdf/image-to-pdf"><span>🖼️</span> Image → PDF</Link>
              <Link to="/tools/image/jpg-to-png"><span>🧩</span> JPG → PNG</Link>
              <Link to="/tools/career/cv-maker"><span>🧑‍💼</span> CV Maker</Link>
              <Link to="/tools/career/cover-letter-maker"><span>✉️</span> Cover Letter</Link>
            </div>

            <div className="tool-cta">
              <div>
                <h3>Earn while you learn 🚀</h3>
                <p>Join AIDLA today and start earning rewards as you build your skills.</p>
              </div>
              <Link to="/signup" className="tool-cta-link">Join now ✨</Link>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="site-footer">
        <div style={{ marginBottom:8, fontSize:"1.1rem" }}>🕌</div>
        <p>&copy; 2025 <strong>AIDLA</strong>. All rights reserved. Designed with ❤️ for learners everywhere.</p>
        <p style={{ marginTop:8 }}>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </p>
      </footer>
    </div>
  );
}