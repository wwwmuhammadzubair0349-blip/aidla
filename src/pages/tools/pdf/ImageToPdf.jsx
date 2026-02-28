import { useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy: #0b1437;
    --royal: #1a3a8f;
    --sky: #3b82f6;
    --gold: #f59e0b;
    --gold-l: #fcd34d;
    --slate: #64748b;
    --ok: #059669;
    --red: #dc2626;
    --bg: linear-gradient(160deg,#f0f4ff 0%,#fffbf0 60%,#e8f4fd 100%);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .i2p-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--navy);
    position: relative;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  .i2p-orbs { position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
  .i2p-orb { position:absolute;border-radius:50%;filter:blur(80px); }
  .i2p-orb1 { width:400px;height:400px;background:rgba(59,130,246,0.07);top:-100px;left:-100px; }
  .i2p-orb2 { width:340px;height:340px;background:rgba(245,158,11,0.06);top:40%;right:-120px; }
  .i2p-orb3 { width:280px;height:280px;background:rgba(5,150,105,0.05);bottom:-60px;left:30%; }

  .i2p-wrap {
    flex: 1;
    max-width: 1060px;
    width: 100%;
    margin: 0 auto;
    padding: clamp(16px,4vw,48px) clamp(12px,4vw,28px) clamp(24px,5vw,48px);
    position: relative;
    z-index: 2;
  }

  /* ── Header ── */
  .i2p-hero { margin-bottom: 16px; }
  .i2p-badge {
    display: inline-block;
    background: linear-gradient(135deg,#f59e0b,#fcd34d);
    color: var(--navy);
    padding: 4px 12px;
    border-radius: 30px;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 8px;
    box-shadow: 0 4px 12px rgba(245,158,11,0.28);
  }
  .i2p-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.5rem,6vw,2.6rem);
    font-weight: 900;
    line-height: 1.12;
    margin-bottom: 6px;
  }
  .i2p-title-acc {
    background: linear-gradient(135deg,#1a3a8f,#3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .i2p-sub { color: var(--slate); font-size: clamp(0.8rem,3vw,0.95rem); line-height: 1.5; }

  /* ── Pills ── */
  .i2p-pills { display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px; }
  .i2p-pill {
    background: rgba(59,130,246,0.06);
    border: 1px solid rgba(59,130,246,0.15);
    border-radius: 30px;
    padding: 3px 9px;
    font-size: clamp(0.6rem,2.5vw,0.7rem);
    font-weight: 600;
    color: var(--royal);
    white-space: nowrap;
  }

  /* ── Card shell ── */
  .i2p-card {
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(6px);
    border-radius: 18px;
    border: 1px solid rgba(59,130,246,0.11);
    box-shadow: 0 4px 20px rgba(11,20,55,0.07);
    padding: clamp(14px,3.5vw,28px);
    margin-bottom: 12px;
  }
  .i2p-card-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(0.9rem,3.5vw,1rem);
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Drop zone ── */
  .i2p-dz {
    border: 2px dashed rgba(59,130,246,0.28);
    border-radius: 16px;
    padding: clamp(20px,5vw,32px) 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.22s;
    background: rgba(255,255,255,0.5);
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .i2p-dz:hover, .i2p-dz:active, .i2p-dz.on {
    border-color: var(--gold);
    background: rgba(245,158,11,0.04);
    box-shadow: 0 0 0 4px rgba(245,158,11,0.1);
  }
  .i2p-dz-icon {
    font-size: clamp(2rem,8vw,2.8rem);
    display: block;
    margin-bottom: 8px;
    transition: transform 0.22s;
  }
  .i2p-dz:hover .i2p-dz-icon, .i2p-dz.on .i2p-dz-icon { transform: scale(1.1) rotate(-4deg); }
  .i2p-dz-title { font-weight: 700; font-size: clamp(0.88rem,3.5vw,1rem); color: var(--navy); margin-bottom: 4px; }
  .i2p-dz-sub { font-size: clamp(0.68rem,2.5vw,0.78rem); color: var(--slate); }

  /* ── Stats strip ── */
  .i2p-stats {
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
  .i2p-stat { font-size: clamp(0.68rem,2.5vw,0.76rem); font-weight: 700; color: var(--navy); display:flex;align-items:center;gap:4px; }
  .i2p-stat.g { color: var(--ok); }
  .i2p-stat-div { width:1px;height:13px;background:rgba(0,0,0,0.1); }

  /* ── Settings grid ── */
  .i2p-settings {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media(min-width:600px) { .i2p-settings { grid-template-columns: repeat(4,1fr); } }

  .i2p-field { display: flex; flex-direction: column; gap: 5px; }
  .i2p-field label {
    font-size: clamp(0.6rem,2vw,0.7rem);
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--slate);
  }
  .i2p-select, .i2p-input-text, .i2p-input-num {
    padding: 9px 10px;
    border-radius: 10px;
    border: 1px solid rgba(59,130,246,0.2);
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.78rem,3vw,0.85rem);
    font-weight: 600;
    color: var(--navy);
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    -webkit-appearance: none;
  }
  .i2p-select:focus, .i2p-input-text:focus, .i2p-input-num:focus { border-color: var(--gold); }

  .i2p-toggle { display: flex; gap: 5px; }
  .i2p-tog-btn {
    flex: 1;
    padding: 8px 6px;
    border-radius: 10px;
    border: 1px solid rgba(59,130,246,0.2);
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.7rem,2.5vw,0.78rem);
    font-weight: 700;
    color: var(--slate);
    cursor: pointer;
    transition: 0.15s;
    text-align: center;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .i2p-tog-btn:active, .i2p-tog-btn:hover { border-color: var(--gold); color: var(--navy); }
  .i2p-tog-btn.active {
    background: linear-gradient(135deg,var(--gold),var(--gold-l));
    border-color: transparent;
    color: var(--navy);
    box-shadow: 0 2px 8px rgba(245,158,11,0.3);
  }

  /* ── Image grid ── */
  .i2p-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  @media(min-width:480px) { .i2p-grid { grid-template-columns: repeat(3,1fr); } }
  @media(min-width:700px) { .i2p-grid { grid-template-columns: repeat(4,1fr); } }
  @media(min-width:900px) { .i2p-grid { grid-template-columns: repeat(5,1fr); } }

  .i2p-img-card {
    border-radius: 14px;
    border: 1px solid rgba(15,23,42,0.08);
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(11,20,55,0.06);
    position: relative;
    transition: box-shadow 0.18s, transform 0.18s;
  }
  .i2p-img-card:hover {
    box-shadow: 0 6px 20px rgba(11,20,55,0.12);
    transform: translateY(-2px);
  }
  .i2p-img-thumb-wrap {
    height: clamp(100px,25vw,140px);
    background: #f8fafc;
    overflow: hidden;
    position: relative;
  }
  .i2p-img-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.22s;
  }
  .i2p-img-card:hover .i2p-img-thumb { transform: scale(1.04); }

  .i2p-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgba(11,20,55,0.55), rgba(26,58,143,0.45));
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.18s;
  }
  .i2p-img-card:hover .i2p-img-overlay { opacity: 1; }
  @media (hover: none) { .i2p-img-overlay { opacity: 1; background: linear-gradient(160deg,rgba(11,20,55,0.38),rgba(26,58,143,0.28)); } }

  .i2p-ov-btn {
    width: clamp(30px,8vw,36px);
    height: clamp(30px,8vw,36px);
    border-radius: 50%;
    border: none;
    font-size: clamp(0.85rem,3vw,1rem);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    transition: transform 0.12s, opacity 0.12s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .i2p-ov-btn:hover, .i2p-ov-btn:active { transform: scale(1.15); }
  .i2p-ov-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .i2p-ov-up   { background: rgba(255,255,255,0.9); color: var(--navy); }
  .i2p-ov-down { background: rgba(255,255,255,0.9); color: var(--navy); }
  .i2p-ov-del  { background: rgba(220,38,38,0.9);   color: #fff; }

  .i2p-page-num {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg,var(--royal),var(--sky));
    color: #fff;
    border-radius: 50%;
    font-size: 0.58rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(11,20,55,0.3);
  }

  .i2p-img-info { padding: 7px 9px 9px; }
  .i2p-img-name {
    font-size: clamp(0.62rem,2.2vw,0.72rem);
    font-weight: 700;
    color: var(--navy);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 1px;
  }
  .i2p-img-meta { font-size: clamp(0.58rem,2vw,0.66rem); color: var(--slate); font-weight: 600; }

  /* ── Empty state ── */
  .i2p-empty {
    text-align: center;
    padding: clamp(24px,6vw,40px) 16px;
    color: var(--slate);
  }
  .i2p-empty-icon { font-size: clamp(1.8rem,7vw,2.5rem); margin-bottom: 8px; display: block; opacity: 0.4; }
  .i2p-empty-text { font-size: clamp(0.8rem,3vw,0.9rem); font-weight: 600; }

  /* ── Progress ── */
  .i2p-prog { margin-top: 12px; }
  .i2p-prog-lbl { display:flex;justify-content:space-between;font-size:clamp(0.68rem,2.5vw,0.78rem);color:var(--slate);margin-bottom:5px;font-weight:700; }
  .i2p-prog-bg { height: 7px; background: rgba(59,130,246,0.1); border-radius: 30px; overflow: hidden; }
  .i2p-prog-fill { height: 100%; background: linear-gradient(90deg,var(--gold),var(--gold-l)); border-radius: 30px; transition: width 0.3s ease; }
  .i2p-prog-step { font-size: clamp(0.62rem,2.2vw,0.72rem); color: var(--slate); margin-top: 4px; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ── Toast / alert ── */
  .i2p-toast {
    border-radius: 12px;
    padding: 10px 12px;
    font-weight: 700;
    font-size: clamp(0.78rem,3vw,0.84rem);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    animation: slideIn 0.2s ease;
  }
  .i2p-toast.success { background:rgba(5,150,105,0.08);border:1px solid rgba(5,150,105,0.25);color:#065f46; }
  .i2p-toast.error   { background:rgba(220,38,38,0.07); border:1px solid rgba(220,38,38,0.2);  color:#991b1b; }
  .i2p-toast.info    { background:rgba(59,130,246,0.07);border:1px solid rgba(59,130,246,0.2); color:#1e40af; }
  .i2p-toast-close { background:none;border:none;cursor:pointer;font-weight:900;color:inherit;font-size:1rem;line-height:1;padding:2px 4px;flex-shrink:0; }
  @keyframes slideIn { from { opacity:0;transform:translateY(-6px); } to { opacity:1;transform:translateY(0); } }

  /* ── Inline action buttons (replaces sticky bar) ── */
  .i2p-action-inline {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
    padding: 14px 16px;
    background: linear-gradient(135deg, var(--navy), var(--royal));
    border-radius: 16px;
  }
  .i2p-action-inline-info {
    flex: 1;
    min-width: 0;
  }
  .i2p-action-label { font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.45); letter-spacing: 0.06em; text-transform: uppercase; display: block; }
  .i2p-action-value {
    font-size: clamp(0.78rem,3vw,0.88rem);
    font-weight: 700;
    color: rgba(255,255,255,0.9);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
  .i2p-action-btns { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }

  .i2p-btn-clear {
    padding: 9px 14px;
    border-radius: 30px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.6);
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.78rem,3vw,0.85rem);
    font-weight: 700;
    cursor: pointer;
    transition: 0.15s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .i2p-btn-clear:active, .i2p-btn-clear:hover { background: rgba(255,255,255,0.1); color: #fff; }
  .i2p-btn-clear:disabled { opacity: 0.3; cursor: not-allowed; }

  .i2p-btn-add {
    padding: 9px 14px;
    border-radius: 30px;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.85);
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.78rem,3vw,0.85rem);
    font-weight: 700;
    cursor: pointer;
    transition: 0.15s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .i2p-btn-add:active, .i2p-btn-add:hover { background: rgba(255,255,255,0.14); color: #fff; }
  .i2p-btn-add:disabled { opacity: 0.4; cursor: not-allowed; }

  .i2p-btn-download {
    padding: 10px clamp(14px,4vw,22px);
    border-radius: 30px;
    border: none;
    background: linear-gradient(135deg,var(--gold),var(--gold-l));
    color: var(--navy);
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.78rem,3vw,0.9rem);
    font-weight: 800;
    cursor: pointer;
    transition: 0.15s;
    box-shadow: 0 4px 16px rgba(245,158,11,0.35);
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .i2p-btn-download:active, .i2p-btn-download:hover { transform: scale(1.03); box-shadow: 0 6px 20px rgba(245,158,11,0.5); }
  .i2p-btn-download:disabled { background: #e2e8f0; color: #94a3b8; box-shadow: none; cursor: not-allowed; transform: none; }

  /* ── Add more button ── */
  .i2p-add-more-btn {
    padding: 7px 16px;
    border-radius: 30px;
    border: 1px dashed rgba(59,130,246,0.3);
    background: rgba(59,130,246,0.04);
    color: var(--royal);
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: clamp(0.75rem,3vw,0.82rem);
    cursor: pointer;
    transition: 0.15s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .i2p-add-more-btn:active, .i2p-add-more-btn:hover { border-color: var(--gold); color: var(--navy); }
  .i2p-add-more-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Other tools ── */
  .i2p-suggest { display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:12px; }
  @media(min-width:540px){ .i2p-suggest { grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); } }
  .i2p-suggest a {
    display:flex;align-items:center;gap:7px;padding:9px 12px;
    background:rgba(255,255,255,0.6);border-radius:30px;
    border:1px solid rgba(59,130,246,0.1);
    color:var(--navy);text-decoration:none;font-weight:600;transition:0.1s;
    font-size:clamp(0.75rem,3vw,0.86rem);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    -webkit-tap-highlight-color: transparent;
  }
  .i2p-suggest a:active, .i2p-suggest a:hover { background:#fff;border-color:var(--gold); }

  /* ── CTA ── */
  .i2p-cta {
    margin-top:14px;
    background:linear-gradient(135deg,var(--navy),var(--royal));
    border-radius:18px;padding:clamp(16px,4vw,24px) clamp(14px,4vw,28px);color:#fff;
    display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;
  }
  .i2p-cta h3 { font-family:'Playfair Display',serif;font-size:clamp(0.95rem,4vw,1.1rem);margin-bottom:2px; }
  .i2p-cta p { opacity:0.82;font-size:clamp(0.78rem,3vw,0.86rem); }
  .i2p-cta-link {
    background:linear-gradient(135deg,var(--gold),var(--gold-l));
    color:var(--navy);padding:9px 20px;border-radius:40px;
    font-weight:800;text-decoration:none;white-space:nowrap;
    font-family:'DM Sans',sans-serif;font-size:clamp(0.82rem,3vw,0.9rem);
    -webkit-tap-highlight-color: transparent;
  }

  /* ── Footer ── */
  .i2p-footer {
    background:var(--navy);color:rgba(255,255,255,0.55);
    padding:clamp(16px,4vw,28px) 20px;text-align:center;
    font-size:clamp(0.75rem,2.5vw,0.82rem);
    position:relative;z-index:2;
  }
  .i2p-footer strong { color:var(--gold-l); }
  .i2p-footer a { color:rgba(255,255,255,0.4);text-decoration:none;margin:0 8px; }
  .i2p-footer a:active, .i2p-footer a:hover { color:#fff; }
`;

// ─── Utility functions ─────────────────────────────────────────────
function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  const units = ["B","KB","MB","GB"];
  let v = bytes, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

async function fileToImageInfo(file) {
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();
  img.decoding = "async"; img.loading = "eager";
  const dims = await new Promise((resolve, reject) => {
    img.onload  = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error("Failed to read image: " + file.name));
    img.src = objectUrl;
  });
  return { id: uid(), file, name: file.name, size: file.size, type: file.type, src: objectUrl, width: dims.w, height: dims.h };
}

async function imageFileToJpegDataUrl(file, maxDim = 2200, quality = 0.9) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    const { w, h } = await new Promise((resolve, reject) => {
      img.onload  = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => reject(new Error("Failed to load image for PDF: " + file.name));
      img.src = objectUrl;
    });
    let targetW = w, targetH = h;
    const maxSide = Math.max(w, h);
    if (maxSide > maxDim) { const s = maxDim / maxSide; targetW = Math.round(w*s); targetH = Math.round(h*s); }
    const canvas = document.createElement("canvas");
    canvas.width = targetW; canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported.");
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);
    return { dataUrl: canvas.toDataURL("image/jpeg", quality), pixelW: targetW, pixelH: targetH };
  } finally { URL.revokeObjectURL(objectUrl); }
}

function computeFitRect(imgW, imgH, pageW, pageH, margin) {
  const aW = pageW - margin*2, aH = pageH - margin*2;
  const ir = imgW/imgH, br = aW/aH;
  let drawW, drawH;
  if (ir > br) { drawW = aW; drawH = aW/ir; } else { drawH = aH; drawW = aH*ir; }
  return { x:(pageW-drawW)/2, y:(pageH-drawH)/2, w:drawW, h:drawH };
}

// ─── Component ───────────────────────────────────────────────────
export default function ImageToPdf() {
  const inputRef    = useRef(null);
  const addMoreRef  = useRef(null);

  const [items,       setItems]       = useState([]);
  const [msg,         setMsg]         = useState("");
  const [msgType,     setMsgType]     = useState("info");
  const [busy,        setBusy]        = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [progStep,    setProgStep]     = useState("");
  const [dzActive,    setDzActive]    = useState(false);

  const [pageSize,    setPageSize]    = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [margin,      setMargin]      = useState(10);
  const [fileName,    setFileName]    = useState("images-to-pdf");

  const totalSize = useMemo(() => items.reduce((s,it) => s + (it.size||0), 0), [items]);

  const showMsg = (text, type = "info") => { setMsg(text); setMsgType(type); };

  useEffect(() => () => { items.forEach(it => { try { URL.revokeObjectURL(it.src); } catch {} }); }, []); // eslint-disable-line

  const addFiles = async (fileList) => {
    const files = Array.from(fileList||[]).filter(f => f && /^image\//.test(f.type));
    if (!files.length) { showMsg("Please select image files (JPG / PNG / WebP).", "error"); return; }
    setBusy(true); showMsg("", "info");
    try {
      const infos = [];
      for (const f of files) infos.push(await fileToImageInfo(f));
      setItems(p => [...p, ...infos]);
      showMsg(`Added ${infos.length} image${infos.length!==1?"s":""} ✅`, "success");
    } catch (e) { showMsg(e?.message || "Failed to add images.", "error"); }
    finally { setBusy(false); }
  };

  const onPick    = async (e) => { await addFiles(e.target.files); if (inputRef.current) inputRef.current.value = ""; };
  const onPickAdd = async (e) => { await addFiles(e.target.files); if (addMoreRef.current) addMoreRef.current.value = ""; };

  const onDrop = async (e) => {
    e.preventDefault(); e.stopPropagation(); setDzActive(false);
    if (e.dataTransfer?.files?.length) await addFiles(e.dataTransfer.files);
  };

  const removeItem = (id) => {
    setItems(p => {
      const rem = p.find(it => it.id === id);
      if (rem?.src) try { URL.revokeObjectURL(rem.src); } catch {}
      return p.filter(it => it.id !== id);
    });
  };

  const moveItem = (id, dir) => {
    setItems(p => {
      const idx = p.findIndex(it => it.id === id);
      if (idx < 0) return p;
      const ni = idx + dir;
      if (ni < 0 || ni >= p.length) return p;
      const copy = [...p];
      const [s] = copy.splice(idx, 1);
      copy.splice(ni, 0, s);
      return copy;
    });
  };

  const clearAll = () => {
    items.forEach(it => { try { URL.revokeObjectURL(it.src); } catch {} });
    setItems([]); showMsg("Cleared ✅", "success");
  };

  const generatePdf = async () => {
    showMsg("", "info");
    if (!items.length) { showMsg("Add at least 1 image first.", "error"); return; }
    const safeName = (fileName||"images-to-pdf").trim().replace(/[\\/:*?"<>|]+/g,"-");
    const finalName = safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`;
    const m = Number(margin);
    const safeMargin = Number.isFinite(m) ? Math.min(Math.max(m,0),30) : 10;
    setBusy(true); setProgress(2); setProgStep("Initialising…");

    try {
      const pdf = new jsPDF({ orientation, unit:"mm", format:pageSize, compress:true });

      for (let i = 0; i < items.length; i++) {
        const pct = 4 + Math.round((i / items.length) * 90);
        setProgress(pct);
        setProgStep(`Processing ${i+1} / ${items.length}: ${items[i].name}`);

        if (i > 0) pdf.addPage();
        const { dataUrl, pixelW, pixelH } = await imageFileToJpegDataUrl(items[i].file);
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const rect  = computeFitRect(pixelW, pixelH, pageW, pageH, safeMargin);
        pdf.addImage(dataUrl, "JPEG", rect.x, rect.y, rect.w, rect.h, undefined, "FAST");
        await new Promise(r => setTimeout(r, 8));
      }

      setProgress(97); setProgStep("Saving…");
      pdf.save(finalName);
      setProgress(100); setProgStep("");
      showMsg(`PDF downloaded: ${finalName} ✅`, "success");
    } catch (e) {
      showMsg(e?.message || "Failed to generate PDF.", "error");
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 1200);
    }
  };

  return (
    <div className="i2p-root">
      <style>{G}</style>

      <div className="i2p-orbs">
        <div className="i2p-orb i2p-orb1"/>
        <div className="i2p-orb i2p-orb2"/>
        <div className="i2p-orb i2p-orb3"/>
      </div>

      <div className="i2p-wrap">

        {/* ── Hero ── */}
        <motion.div className="i2p-hero" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
          <span className="i2p-badge">🖼️ PDF Tool</span>
          <h1 className="i2p-title">
            Image <span className="i2p-title-acc">→ PDF</span>
          </h1>
          <p className="i2p-sub">Convert JPG, PNG, WebP & more into a single PDF. Runs entirely in your browser — nothing uploaded.</p>
        </motion.div>

        <motion.div className="i2p-pills" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
          {["✓ All formats","✓ Page size","✓ Margins","✓ Reorder","✓ 100% private"].map(p => (
            <span className="i2p-pill" key={p}>{p}</span>
          ))}
        </motion.div>

        {/* ── Toast ── */}
        <AnimatePresence>
          {msg && (
            <motion.div
              className={`i2p-toast ${msgType}`}
              initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
            >
              <span>{msg}</span>
              <button className="i2p-toast-close" onClick={() => setMsg("")}>×</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Drop zone ── */}
        <motion.div className="i2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}>
          <div
            className={`i2p-dz${dzActive ? " on" : ""}`}
            onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDzActive(true); }}
            onDragLeave={() => setDzActive(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
            aria-label="Upload images"
          >
            <input ref={inputRef} type="file" accept="image/*" multiple onChange={onPick} style={{ display:"none" }} />
            <span className="i2p-dz-icon">{dzActive ? "📥" : "🖼️"}</span>
            <p className="i2p-dz-title">{dzActive ? "Drop images here!" : "Drag & drop or tap to browse"}</p>
            <p className="i2p-dz-sub">PNG · JPG · WebP · GIF · BMP</p>
          </div>

          {items.length > 0 && (
            <div className="i2p-stats">
              <div className="i2p-stat g">🖼 {items.length} image{items.length!==1?"s":""}</div>
              <div className="i2p-stat-div"/>
              <div className="i2p-stat">{formatBytes(totalSize)}</div>
              <div className="i2p-stat-div"/>
              <div className="i2p-stat" style={{ color:"#94a3b8", fontWeight:500 }}>Tap cards to reorder</div>
            </div>
          )}

          {busy && (
            <div className="i2p-prog">
              <div className="i2p-prog-lbl"><span>Generating PDF…</span><span>{progress}%</span></div>
              <div className="i2p-prog-bg"><div className="i2p-prog-fill" style={{ width:`${progress}%` }}/></div>
              {progStep && <p className="i2p-prog-step">{progStep}</p>}
            </div>
          )}
        </motion.div>

        {/* ── Settings ── */}
        <motion.div className="i2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.17 }}>
          <div className="i2p-card-title">⚙️ PDF Settings</div>
          <div className="i2p-settings">

            <div className="i2p-field">
              <label>Page Size</label>
              <div className="i2p-toggle">
                {["a4","letter"].map(k => (
                  <button key={k} className={`i2p-tog-btn${pageSize===k?" active":""}`} onClick={() => setPageSize(k)}>
                    {k === "a4" ? "A4" : "Letter"}
                  </button>
                ))}
              </div>
            </div>

            <div className="i2p-field">
              <label>Orientation</label>
              <div className="i2p-toggle">
                {["portrait","landscape"].map(k => (
                  <button key={k} className={`i2p-tog-btn${orientation===k?" active":""}`} onClick={() => setOrientation(k)}>
                    {k === "portrait" ? "⬆ Port." : "➡ Land."}
                  </button>
                ))}
              </div>
            </div>

            <div className="i2p-field">
              <label>Margin (mm)</label>
              <input
                type="number" min={0} max={30}
                value={margin}
                onChange={e => setMargin(e.target.value)}
                className="i2p-input-num"
              />
            </div>

            <div className="i2p-field">
              <label>File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                placeholder="images-to-pdf"
                className="i2p-input-text"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Image grid ── */}
        <motion.div className="i2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.21 }}>
          <div className="i2p-card-title">
            📄 Pages
            <span style={{ marginLeft:"auto", fontSize:"0.68rem", fontWeight:600, color:"#94a3b8", fontFamily:"DM Sans" }}>
              {items.length > 0 ? `${items.length} page${items.length!==1?"s":""}` : "No images yet"}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="i2p-empty">
              <span className="i2p-empty-icon">🖼️</span>
              <p className="i2p-empty-text">No images added yet. Drop some above to get started.</p>
            </div>
          ) : (
            <>
              <div className="i2p-grid">
                <AnimatePresence>
                  {items.map((it, idx) => (
                    <motion.div
                      key={it.id}
                      className="i2p-img-card"
                      layout
                      initial={{ opacity:0, scale:0.9 }}
                      animate={{ opacity:1, scale:1 }}
                      exit={{ opacity:0, scale:0.85 }}
                      transition={{ duration:0.2 }}
                    >
                      <div className="i2p-img-thumb-wrap">
                        <img src={it.src} alt={it.name} className="i2p-img-thumb" draggable={false} />
                        <div className="i2p-page-num">{idx+1}</div>
                        <div className="i2p-img-overlay">
                          <button className="i2p-ov-btn i2p-ov-up" onClick={() => moveItem(it.id,-1)} disabled={busy || idx===0} title="Move up">↑</button>
                          <button className="i2p-ov-btn i2p-ov-down" onClick={() => moveItem(it.id,1)} disabled={busy || idx===items.length-1} title="Move down">↓</button>
                          <button className="i2p-ov-btn i2p-ov-del" onClick={() => removeItem(it.id)} disabled={busy} title="Remove">✕</button>
                        </div>
                      </div>
                      <div className="i2p-img-info">
                        <div className="i2p-img-name" title={it.name}>{it.name}</div>
                        <div className="i2p-img-meta">{formatBytes(it.size)}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div style={{ marginTop:12, display:"flex", justifyContent:"flex-end" }}>
                <input ref={addMoreRef} type="file" accept="image/*" multiple onChange={onPickAdd} style={{ display:"none" }} />
                <button className="i2p-add-more-btn" onClick={() => addMoreRef.current?.click()} disabled={busy}>
                  ➕ Add more images
                </button>
              </div>
            </>
          )}

          {/* ── Inline action bar (replaces sticky bar) ── */}
          <div className="i2p-action-inline">
            <div className="i2p-action-inline-info">
              <span className="i2p-action-label">Ready to convert</span>
              <span className="i2p-action-value">
                {items.length} image{items.length!==1?"s":""} · {pageSize.toUpperCase()} · {orientation === "portrait" ? "Portrait" : "Landscape"}
                {totalSize > 0 && <> · {formatBytes(totalSize)}</>}
              </span>
            </div>
            <div className="i2p-action-btns">
              <input ref={addMoreRef} type="file" accept="image/*" multiple onChange={onPickAdd} style={{ display:"none" }} />
              <button className="i2p-btn-add" onClick={() => inputRef.current?.click()} disabled={busy}>➕</button>
              <button className="i2p-btn-clear" onClick={clearAll} disabled={busy || !items.length}>Clear</button>
              <button className="i2p-btn-download" onClick={generatePdf} disabled={busy || !items.length}>
                {busy ? `${progress}%…` : "⬇ Download PDF"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Other tools ── */}
        <motion.div className="i2p-card" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.26 }}>
          <p style={{ fontSize:"clamp(0.72rem,2.5vw,0.78rem)", color:"#64748b", marginBottom:10, fontWeight:600 }}>Need something else?</p>
          <div className="i2p-suggest">
            <Link to="/tools/pdf/word-to-pdf"><span>📄</span> Word → PDF</Link>
            <Link to="/tools/image/jpg-to-png"><span>🧩</span> JPG → PNG</Link>
            <Link to="/tools/career/cv-maker"><span>🧑‍💼</span> CV Maker</Link>
            <Link to="/tools/career/cover-letter-maker"><span>✉️</span> Cover Letter</Link>
          </div>

          <div className="i2p-cta">
            <div>
              <h3>Earn while you learn 🚀</h3>
              <p>Join AIDLA today and start earning rewards as you build your skills.</p>
            </div>
            <Link to="/signup" className="i2p-cta-link">Join now ✨</Link>
          </div>
        </motion.div>

      </div>

      <footer className="i2p-footer">
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