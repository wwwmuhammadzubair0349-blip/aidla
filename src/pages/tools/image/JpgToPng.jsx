import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── Utility functions (unchanged) ───────────────────────────────
function safeBaseName(name) {
  const base = String(name || "image")
    .replace(/\.(jpg|jpeg|png|webp|gif|bmp)$/i, "")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .trim();
  return (base || "image").slice(0, 120);
}

function bytes(n) {
  if (!Number.isFinite(n)) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0, v = n;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i += 1; }
  return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

async function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Failed to read file"));
    r.readAsDataURL(file);
  });
}

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload   = () => resolve(img);
    img.onerror  = () => reject(new Error("Failed to load image"));
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}

function isJpg(file) {
  const n = file?.name?.toLowerCase?.() || "";
  const t = file?.type || "";
  return n.endsWith(".jpg") || n.endsWith(".jpeg") || t === "image/jpeg";
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

// ─── Styles ──────────────────────────────────────────────────────
const G = `
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

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .j2p-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--navy);
    position: relative;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  /* ── Orbs ── */
  .j2p-orbs { position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
  .j2p-orb  { position:absolute;border-radius:50%;filter:blur(80px); }
  .j2p-orb1 { width:420px;height:420px;background:rgba(59,130,246,0.07);top:-120px;left:-120px; }
  .j2p-orb2 { width:360px;height:360px;background:rgba(245,158,11,0.06);top:40%;right:-140px; }
  .j2p-orb3 { width:300px;height:300px;background:rgba(5,150,105,0.05);bottom:-60px;left:30%; }

  .j2p-wrap {
    flex: 1;
    max-width: 1060px;
    width: 100%;
    margin: 0 auto;
    padding: clamp(14px,4vw,52px) clamp(12px,4vw,28px) clamp(24px,6vw,60px);
    position: relative;
    z-index: 2;
  }

  /* ── Hero ── */
  .j2p-hero { margin-bottom: 14px; }
  .j2p-badge {
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
  .j2p-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.5rem,6vw,2.6rem);
    font-weight: 900;
    line-height: 1.12;
    margin-bottom: 6px;
  }
  .j2p-title-acc {
    background: linear-gradient(135deg,var(--royal),var(--sky));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .j2p-sub { color: var(--slate); font-size: clamp(0.82rem,3vw,0.95rem); line-height: 1.5; }

  /* ── Pills ── */
  .j2p-pills { display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px; }
  .j2p-pill {
    background: rgba(59,130,246,0.06);
    border: 1px solid rgba(59,130,246,0.15);
    border-radius: 30px;
    padding: 3px 9px;
    font-size: clamp(0.6rem,2.2vw,0.7rem);
    font-weight: 600;
    color: var(--royal);
    white-space: nowrap;
  }

  /* ── Toast ── */
  .j2p-toast {
    border-radius: 12px;
    padding: 10px 12px;
    font-weight: 700;
    font-size: clamp(0.78rem,3vw,0.84rem);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    animation: j2p-slide 0.2s ease;
  }
  .j2p-toast.success { background:rgba(5,150,105,0.08);border:1px solid rgba(5,150,105,0.25);color:#065f46; }
  .j2p-toast.error   { background:rgba(220,38,38,0.07); border:1px solid rgba(220,38,38,0.2); color:#991b1b; }
  .j2p-toast.info    { background:rgba(59,130,246,0.07);border:1px solid rgba(59,130,246,0.2);color:#1e40af; }
  .j2p-toast-close { background:none;border:none;cursor:pointer;font-weight:900;color:inherit;font-size:1rem;line-height:1;padding:2px 4px;flex-shrink:0; }
  @keyframes j2p-slide { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }

  /* ── Card ── */
  .j2p-card {
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(6px);
    border-radius: 20px;
    border: 1px solid rgba(59,130,246,0.11);
    box-shadow: 0 6px 24px rgba(11,20,55,0.07);
    padding: clamp(14px,3.5vw,28px);
    margin-bottom: 12px;
  }
  .j2p-card-title {
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
  .j2p-dz {
    border: 2px dashed rgba(59,130,246,0.28);
    border-radius: 16px;
    padding: clamp(22px,5vw,36px) clamp(12px,4vw,20px);
    text-align: center;
    cursor: pointer;
    transition: all 0.22s;
    background: rgba(255,255,255,0.5);
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .j2p-dz:hover, .j2p-dz:active, .j2p-dz.on {
    border-color: var(--gold);
    background: rgba(245,158,11,0.04);
    box-shadow: 0 0 0 4px rgba(245,158,11,0.1);
  }
  .j2p-dz-icon {
    font-size: clamp(2rem,8vw,2.8rem);
    display: block;
    margin-bottom: 8px;
    transition: transform 0.22s;
  }
  .j2p-dz:hover .j2p-dz-icon, .j2p-dz.on .j2p-dz-icon { transform: scale(1.1) rotate(-4deg); }
  .j2p-dz-title { font-weight: 700; font-size: clamp(0.88rem,3.5vw,1rem); color: var(--navy); margin-bottom: 4px; }
  .j2p-dz-sub   { font-size: clamp(0.68rem,2.5vw,0.78rem); color: var(--slate); }

  /* ── Stats strip ── */
  .j2p-stats {
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
  .j2p-stat   { font-size: clamp(0.68rem,2.5vw,0.76rem); font-weight: 700; color: var(--navy); display:flex;align-items:center;gap:4px; }
  .j2p-stat.g { color: var(--ok); }
  .j2p-stat-div { width:1px;height:13px;background:rgba(0,0,0,0.1); }

  /* ── Settings grid ── */
  .j2p-settings {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media(min-width:580px) { .j2p-settings { grid-template-columns: repeat(3,1fr); } }

  .j2p-field { display:flex;flex-direction:column;gap:5px; }
  .j2p-field label {
    font-size: clamp(0.6rem,2vw,0.7rem);
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--slate);
  }
  .j2p-field-note {
    font-size: clamp(0.65rem,2.2vw,0.72rem);
    color: var(--slate);
    font-weight: 600;
    line-height: 1.5;
  }

  /* Toggle pills */
  .j2p-toggle { display:flex;gap:5px;flex-wrap:wrap; }
  .j2p-tog-btn {
    flex: 1;
    min-width: 56px;
    padding: 8px 8px;
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
  .j2p-tog-btn:hover, .j2p-tog-btn:active { border-color: var(--gold); color: var(--navy); }
  .j2p-tog-btn.active {
    background: linear-gradient(135deg,var(--gold),var(--gold-l));
    border-color: transparent;
    color: var(--navy);
    box-shadow: 0 2px 8px rgba(245,158,11,0.3);
  }
  .j2p-tog-btn:disabled { opacity:0.4;cursor:not-allowed; }

  /* Color picker row */
  .j2p-color-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
  }
  .j2p-color-input {
    width: 42px;
    height: 34px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    padding: 0;
  }
  .j2p-color-hex {
    font-weight: 700;
    font-size: clamp(0.72rem,2.5vw,0.8rem);
    color: var(--navy);
    background: rgba(59,130,246,0.06);
    border: 1px solid rgba(59,130,246,0.15);
    border-radius: 8px;
    padding: 4px 10px;
  }

  /* ── Image grid ── */
  .j2p-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }
  @media(min-width:420px) { .j2p-grid { grid-template-columns: repeat(2,1fr); } }
  @media(min-width:700px) { .j2p-grid { grid-template-columns: repeat(3,1fr); } }
  @media(min-width:900px) { .j2p-grid { grid-template-columns: repeat(4,1fr); } }

  .j2p-img-card {
    border-radius: 14px;
    border: 1px solid rgba(15,23,42,0.08);
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(11,20,55,0.06);
    transition: box-shadow 0.18s, transform 0.18s;
  }
  .j2p-img-card:hover { box-shadow: 0 6px 20px rgba(11,20,55,0.12); transform: translateY(-2px); }

  /* Preview halves */
  .j2p-preview-halves {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid rgba(15,23,42,0.07);
  }
  .j2p-preview-half {
    position: relative;
    overflow: hidden;
  }
  .j2p-preview-half:first-child {
    border-right: 1px solid rgba(15,23,42,0.07);
  }
  .j2p-preview-label {
    position: absolute;
    top: 5px; left: 5px;
    background: rgba(11,20,55,0.65);
    color: #fff;
    font-size: 0.55rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 2px 6px;
    border-radius: 6px;
    pointer-events: none;
    z-index: 1;
  }
  .j2p-preview-img-wrap {
    height: clamp(90px,22vw,130px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 6px;
  }
  .j2p-preview-img-wrap img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
  .j2p-preview-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    gap: 4px;
  }
  .j2p-preview-placeholder-icon {
    font-size: 1.4rem;
    opacity: 0.25;
  }
  .j2p-preview-placeholder-text {
    font-size: clamp(0.58rem,2vw,0.65rem);
    color: var(--slate);
    font-weight: 700;
    text-align: center;
    opacity: 0.7;
  }

  .j2p-img-info { padding: 8px 10px 10px; }
  .j2p-img-name {
    font-size: clamp(0.62rem,2.2vw,0.72rem);
    font-weight: 700;
    color: var(--navy);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  .j2p-img-meta { font-size: clamp(0.58rem,2vw,0.65rem); color: var(--slate); font-weight: 600; }

  .j2p-img-actions { display:flex;gap:6px;padding:0 10px 10px; }

  /* ── Action panel (inline, dark) ── */
  .j2p-action {
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
  .j2p-action-info {
    flex: 1;
    min-width: 0;
    display: none;
  }
  @media(min-width:520px) { .j2p-action-info { display: block; } }
  .j2p-action-label { font-size:0.62rem;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:0.06em;text-transform:uppercase;display:block;white-space:nowrap; }
  .j2p-action-value { font-size:clamp(0.75rem,2.5vw,0.85rem);font-weight:700;color:rgba(255,255,255,0.9);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
  .j2p-action-btns { display:flex;gap:7px;align-items:center;flex-shrink:0;flex-wrap:nowrap; }

  /* ── Buttons ── */
  .j2p-btn {
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
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .j2p-btn:disabled { opacity:0.4;cursor:not-allowed;transform:none!important; }

  .j2p-btn-primary {
    background: linear-gradient(135deg,var(--gold),var(--gold-l));
    color: var(--navy);
    box-shadow: 0 4px 14px rgba(245,158,11,0.35);
  }
  .j2p-btn-primary:hover:not(:disabled), .j2p-btn-primary:active:not(:disabled) {
    transform: scale(1.03);
    box-shadow: 0 6px 18px rgba(245,158,11,0.5);
  }
  .j2p-btn-ghost {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.18);
    color: rgba(255,255,255,0.85);
  }
  .j2p-btn-ghost:hover:not(:disabled), .j2p-btn-ghost:active:not(:disabled) { background:rgba(255,255,255,0.15);color:#fff; }

  .j2p-btn-danger {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.55);
  }
  .j2p-btn-danger:hover:not(:disabled), .j2p-btn-danger:active:not(:disabled) { background:rgba(220,38,38,0.2);color:#fff;border-color:rgba(220,38,38,0.4); }

  /* Small card-level buttons */
  .j2p-btn-sm {
    flex: 1;
    padding: 7px 8px;
    border-radius: 10px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.65rem,2.5vw,0.72rem);
    font-weight: 800;
    cursor: pointer;
    transition: 0.15s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    text-align: center;
  }
  .j2p-btn-sm:disabled { opacity:0.4;cursor:not-allowed; }
  .j2p-btn-dl {
    background: linear-gradient(135deg,var(--royal),var(--sky));
    color: #fff;
  }
  .j2p-btn-dl:hover:not(:disabled), .j2p-btn-dl:active:not(:disabled) { opacity:0.88; }
  .j2p-btn-rm {
    flex: 0 0 auto;
    padding: 7px 10px;
    border-radius: 10px;
    border: 1px solid rgba(15,23,42,0.1);
    background: #fff;
    color: var(--navy);
    font-size: 0.75rem;
    font-weight: 900;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .j2p-btn-rm:hover:not(:disabled) { border-color:var(--red);color:var(--red); }
  .j2p-btn-rm:disabled { opacity:0.4;cursor:not-allowed; }

  /* ── Empty state ── */
  .j2p-empty { text-align:center;padding:clamp(24px,6vw,40px) 16px;color:var(--slate); }
  .j2p-empty-icon { font-size:clamp(1.8rem,7vw,2.5rem);margin-bottom:8px;display:block;opacity:0.4; }
  .j2p-empty-text { font-size:clamp(0.8rem,3vw,0.9rem);font-weight:600; }

  /* ── Suggest / CTA ── */
  .j2p-suggest { display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:12px; }
  @media(min-width:480px){ .j2p-suggest { grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); } }
  .j2p-suggest a {
    display:flex;align-items:center;gap:7px;padding:9px 12px;
    background:rgba(255,255,255,0.6);border-radius:30px;
    border:1px solid rgba(59,130,246,0.1);
    color:var(--navy);text-decoration:none;font-weight:600;transition:0.1s;
    font-size:clamp(0.75rem,3vw,0.86rem);
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    -webkit-tap-highlight-color:transparent;
  }
  .j2p-suggest a:active, .j2p-suggest a:hover { background:#fff;border-color:var(--gold); }

  .j2p-cta {
    margin-top:14px;
    background:linear-gradient(135deg,var(--navy),var(--royal));
    border-radius:18px;padding:clamp(14px,4vw,22px) clamp(14px,4vw,26px);color:#fff;
    display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;
  }
  .j2p-cta h3 { font-family:'Playfair Display',serif;font-size:clamp(0.92rem,4vw,1.1rem);margin-bottom:2px; }
  .j2p-cta p  { opacity:0.82;font-size:clamp(0.76rem,3vw,0.86rem); }
  .j2p-cta-link {
    background:linear-gradient(135deg,var(--gold),var(--gold-l));
    color:var(--navy);padding:9px 18px;border-radius:40px;
    font-weight:800;text-decoration:none;white-space:nowrap;
    font-family:'DM Sans',sans-serif;font-size:clamp(0.8rem,3vw,0.9rem);
    -webkit-tap-highlight-color:transparent;flex-shrink:0;
  }

  /* ── Footer ── */
  .j2p-footer {
    background: var(--navy);
    color: rgba(255,255,255,0.55);
    padding: clamp(16px,4vw,28px) 20px;
    text-align: center;
    font-size: clamp(0.75rem,2.5vw,0.82rem);
    position: relative;
    z-index: 2;
  }
  .j2p-footer strong { color: var(--gold-l); }
  .j2p-footer a { color:rgba(255,255,255,0.4);text-decoration:none;margin:0 8px; }
  .j2p-footer a:active, .j2p-footer a:hover { color:#fff; }
`;

// ─── Component ───────────────────────────────────────────────────
export default function JpgToPng() {
  const inputRef    = useRef(null);
  const addMoreRef  = useRef(null);

  const [busy,      setBusy]      = useState(false);
  const [msg,       setMsg]       = useState("");
  const [msgType,   setMsgType]   = useState("info");
  const [dzActive,  setDzActive]  = useState(false);

  const [items,     setItems]     = useState([]);
  const [bgMode,    setBgMode]    = useState("white");
  const [bgCustom,  setBgCustom]  = useState("#ffffff");
  const [keepSize]                = useState(true); // always true, display only

  const showMsg = (t, type = "info") => { setMsg(t); setMsgType(type); };

  const bgColor = bgMode === "custom" ? bgCustom : (bgMode === "black" ? "#000000" : "#ffffff");

  const totalInSize  = useMemo(() => items.reduce((a, it) => a + (it.file?.size  || 0), 0), [items]);
  const totalOutSize = useMemo(() => items.reduce((a, it) => a + (it.outSize     || 0), 0), [items]);
  const convertedCount = items.filter(it => it.outBlob).length;

  // ── Add files ──
  const addFiles = async (fileList) => {
    const files    = Array.from(fileList || []);
    const onlyJpg  = files.filter(isJpg);
    const rejected = files.length - onlyJpg.length;
    if (!onlyJpg.length) return showMsg("Please upload JPG/JPEG images only.", "error");

    setBusy(true); showMsg("", "info");
    try {
      const newOnes = [];
      for (const f of onlyJpg) {
        const src = await fileToDataURL(f);
        const img = await loadImage(src);
        newOnes.push({
          id: `${f.name}-${f.size}-${f.lastModified}`,
          file: f, src,
          w: img.naturalWidth, h: img.naturalHeight,
          outBlob: null, outUrl: "", outSize: 0,
        });
      }
      setItems(prev => {
        const seen = new Set(prev.map(x => x.id));
        const merged = [...prev];
        for (const it of newOnes) if (!seen.has(it.id)) merged.push(it);
        return merged;
      });
      showMsg(rejected
        ? `Loaded ✅  (Ignored ${rejected} non-JPG file${rejected > 1 ? "s" : ""})`
        : `Added ${onlyJpg.length} image${onlyJpg.length !== 1 ? "s" : ""} ✅`,
        "success");
    } catch (e) {
      showMsg(e?.message || "Failed to read images.", "error");
    } finally {
      setBusy(false);
      if (inputRef.current)   inputRef.current.value   = "";
      if (addMoreRef.current) addMoreRef.current.value = "";
    }
  };

  const onDrop = async (e) => {
    e.preventDefault(); e.stopPropagation(); setDzActive(false);
    await addFiles(e.dataTransfer?.files);
  };

  const clearAll = () => {
    items.forEach(it => { if (it.outUrl) URL.revokeObjectURL(it.outUrl); });
    setItems([]); showMsg("Cleared ✅", "success");
  };

  // ── Convert ──
  const convertOne = async (it) => {
    const img    = await loadImage(it.src);
    const canvas = document.createElement("canvas");
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Canvas not supported in this browser.");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(res => canvas.toBlob(b => res(b), "image/png", 1));
    if (!blob) throw new Error("Failed to export PNG.");
    return { blob, outUrl: URL.createObjectURL(blob), outSize: blob.size };
  };

  const convertAll = async () => {
    if (!items.length) return showMsg("Upload JPG files first.", "error");
    setBusy(true); showMsg("Converting…", "info");
    try {
      items.forEach(it => { if (it.outUrl) URL.revokeObjectURL(it.outUrl); });
      const next = [];
      for (const it of items) {
        const { blob, outUrl, outSize } = await convertOne(it);
        next.push({ ...it, outBlob: blob, outUrl, outSize });
      }
      setItems(next);
      showMsg(`Converted ${next.length} image${next.length !== 1 ? "s" : ""} ✅`, "success");
    } catch (e) {
      showMsg(e?.message || "Conversion failed.", "error");
    } finally { setBusy(false); }
  };

  const downloadOne = (it) => {
    if (!it.outBlob) return showMsg("Convert first.", "error");
    downloadBlob(it.outBlob, `${safeBaseName(it.file?.name)}.png`);
  };

  const downloadAll = () => {
    const ready = items.filter(it => it.outBlob);
    if (!ready.length) return showMsg("Convert first.", "error");
    ready.forEach((it, idx) => setTimeout(() => downloadOne(it), idx * 350));
    showMsg(`Downloading ${ready.length} file${ready.length !== 1 ? "s" : ""}… ✅`, "success");
  };

  const removeOne = (id) => {
    setItems(prev => {
      const rem = prev.find(it => it.id === id);
      if (rem?.outUrl) URL.revokeObjectURL(rem.outUrl);
      return prev.filter(it => it.id !== id);
    });
  };

  return (
    <div className="j2p-root">
      <style>{G}</style>

      <div className="j2p-orbs">
        <div className="j2p-orb j2p-orb1"/>
        <div className="j2p-orb j2p-orb2"/>
        <div className="j2p-orb j2p-orb3"/>
      </div>

      <div className="j2p-wrap">

        {/* ── Hero ── */}
        <motion.div className="j2p-hero" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
          <span className="j2p-badge">🖼️ Image Tool</span>
          <h1 className="j2p-title">
            JPG <span className="j2p-title-acc">→ PNG</span>
          </h1>
          <p className="j2p-sub">Convert JPG/JPEG to lossless PNG instantly in your browser — nothing uploaded to any server.</p>
        </motion.div>

        <motion.div className="j2p-pills" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
          {["✓ Lossless PNG","✓ Batch convert","✓ Custom background","✓ Same dimensions","✓ 100% private"].map(p => (
            <span className="j2p-pill" key={p}>{p}</span>
          ))}
        </motion.div>

        {/* ── Toast ── */}
        <AnimatePresence>
          {msg && (
            <motion.div
              className={`j2p-toast ${msgType}`}
              initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
            >
              <span>{msg}</span>
              <button className="j2p-toast-close" onClick={() => setMsg("")}>×</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Drop zone ── */}
        <motion.div className="j2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}>
          <div
            className={`j2p-dz${dzActive ? " on" : ""}`}
            onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDzActive(true); }}
            onDragLeave={() => setDzActive(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
            aria-label="Upload JPG images"
          >
            <input ref={inputRef} type="file" accept="image/jpeg,.jpg,.jpeg" multiple
              onChange={e => addFiles(e.target.files)} style={{ display:"none" }} />
            <span className="j2p-dz-icon">{dzActive ? "📥" : "🖼️"}</span>
            <p className="j2p-dz-title">{dzActive ? "Drop images here!" : "Drag & drop or tap to browse"}</p>
            <p className="j2p-dz-sub">JPG / JPEG only · multiple files welcome</p>
          </div>

          {items.length > 0 && (
            <div className="j2p-stats">
              <div className="j2p-stat g">🖼 {items.length} file{items.length !== 1 ? "s" : ""}</div>
              <div className="j2p-stat-div"/>
              <div className="j2p-stat">{bytes(totalInSize)}</div>
              {convertedCount > 0 && <>
                <div className="j2p-stat-div"/>
                <div className="j2p-stat g">✅ {convertedCount} converted · {bytes(totalOutSize)}</div>
              </>}
            </div>
          )}
        </motion.div>

        {/* ── Settings ── */}
        <motion.div className="j2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.17 }}>
          <div className="j2p-card-title">⚙️ Options</div>
          <div className="j2p-settings">

            <div className="j2p-field">
              <label>Background</label>
              <div className="j2p-toggle">
                {[["white","⬜ White"],["black","⬛ Black"],["custom","🎨 Custom"]].map(([k, lbl]) => (
                  <button key={k}
                    className={`j2p-tog-btn${bgMode === k ? " active" : ""}`}
                    onClick={() => setBgMode(k)} disabled={busy}>
                    {lbl}
                  </button>
                ))}
              </div>
              {bgMode === "custom" && (
                <div className="j2p-color-row">
                  <input type="color" value={bgCustom}
                    onChange={e => setBgCustom(e.target.value)}
                    disabled={busy} className="j2p-color-input" />
                  <span className="j2p-color-hex">{bgCustom.toUpperCase()}</span>
                </div>
              )}
            </div>

            <div className="j2p-field">
              <label>Quality</label>
              <p className="j2p-field-note">PNG output is <strong>lossless</strong>. Full quality preserved, no compression artefacts.</p>
            </div>

            <div className="j2p-field">
              <label>Dimensions</label>
              <p className="j2p-field-note">Output keeps the <strong>exact same resolution</strong> as the original JPG.</p>
            </div>
          </div>
        </motion.div>

        {/* ── Image grid ── */}
        <motion.div className="j2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.21 }}>
          <div className="j2p-card-title">
            🖼️ Images
            <span style={{ marginLeft:"auto", fontSize:"0.68rem", fontWeight:600, color:"#94a3b8", fontFamily:"DM Sans" }}>
              {items.length > 0 ? `${items.length} file${items.length !== 1 ? "s" : ""}` : "None yet"}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="j2p-empty">
              <span className="j2p-empty-icon">🖼️</span>
              <p className="j2p-empty-text">No images added yet. Drop some JPGs above to get started.</p>
            </div>
          ) : (
            <>
              <div className="j2p-grid">
                <AnimatePresence>
                  {items.map(it => (
                    <motion.div key={it.id} className="j2p-img-card"
                      layout
                      initial={{ opacity:0, scale:0.9 }}
                      animate={{ opacity:1, scale:1 }}
                      exit={{ opacity:0, scale:0.85 }}
                      transition={{ duration:0.2 }}
                    >
                      {/* Before / after preview */}
                      <div className="j2p-preview-halves">
                        <div className="j2p-preview-half" style={{ background:"#f8fafc" }}>
                          <div className="j2p-preview-label">JPG</div>
                          <div className="j2p-preview-img-wrap">
                            <img src={it.src} alt={it.file?.name} />
                          </div>
                        </div>
                        <div className="j2p-preview-half" style={{ background: bgColor }}>
                          <div className="j2p-preview-label">PNG</div>
                          <div className="j2p-preview-img-wrap">
                            {it.outUrl
                              ? <img src={it.outUrl} alt="converted" />
                              : <div className="j2p-preview-placeholder">
                                  <span className="j2p-preview-placeholder-icon">🖼️</span>
                                  <span className="j2p-preview-placeholder-text">Convert<br/>to preview</span>
                                </div>
                            }
                          </div>
                        </div>
                      </div>

                      <div className="j2p-img-info">
                        <div className="j2p-img-name" title={it.file?.name}>{it.file?.name}</div>
                        <div className="j2p-img-meta">
                          {it.w}×{it.h} · {bytes(it.file?.size)}
                          {it.outSize ? ` → ${bytes(it.outSize)}` : ""}
                        </div>
                      </div>

                      <div className="j2p-img-actions">
                        <button className="j2p-btn-sm j2p-btn-dl"
                          onClick={() => downloadOne(it)}
                          disabled={!it.outBlob || busy}>
                          ⬇ Download
                        </button>
                        <button className="j2p-btn-rm"
                          onClick={() => removeOne(it.id)}
                          disabled={busy} title="Remove">
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add more */}
              <div style={{ marginTop:12, display:"flex", justifyContent:"flex-end" }}>
                <input ref={addMoreRef} type="file" accept="image/jpeg,.jpg,.jpeg" multiple
                  onChange={e => addFiles(e.target.files)} style={{ display:"none" }} />
                <button
                  onClick={() => addMoreRef.current?.click()} disabled={busy}
                  style={{ padding:"7px 16px", borderRadius:30, border:"1px dashed rgba(59,130,246,0.3)", background:"rgba(59,130,246,0.04)", color:"var(--royal)", fontFamily:"DM Sans,sans-serif", fontWeight:700, fontSize:"clamp(0.75rem,3vw,0.82rem)", cursor:"pointer", transition:"0.15s" }}
                >
                  ➕ Add more
                </button>
              </div>
            </>
          )}

          {/* ── Inline action bar ── */}
          <div className="j2p-action">
            <div className="j2p-action-info">
              <span className="j2p-action-label">Ready to convert</span>
              <span className="j2p-action-value">
                {items.length} file{items.length !== 1 ? "s" : ""} · {bgMode === "custom" ? bgCustom.toUpperCase() : bgMode.charAt(0).toUpperCase() + bgMode.slice(1)} bg
                {totalInSize > 0 && ` · ${bytes(totalInSize)}`}
              </span>
            </div>
            <div className="j2p-action-btns">
              <button className="j2p-btn j2p-btn-danger" onClick={clearAll} disabled={busy || !items.length}>
                Clear
              </button>
              <button className="j2p-btn j2p-btn-ghost" onClick={downloadAll} disabled={busy || !items.some(x => x.outBlob)}>
                ⬇ All
              </button>
              <button className="j2p-btn j2p-btn-primary" onClick={convertAll} disabled={busy || !items.length}>
                {busy ? "Working…" : "⚡ Convert"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Other tools + CTA ── */}
        <motion.div className="j2p-card" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.26 }}>
          <p style={{ fontSize:"clamp(0.72rem,2.5vw,0.78rem)", color:"#64748b", marginBottom:10, fontWeight:600 }}>Need something else?</p>
          <div className="j2p-suggest">
            <Link to="/tools/pdf/image-to-pdf"><span>📄</span> Image → PDF</Link>
            <Link to="/tools/pdf/word-to-pdf"><span>📝</span> Word → PDF</Link>
            <Link to="/tools/career/cv-maker"><span>🧑‍💼</span> CV Maker</Link>
            <Link to="/tools/career/cover-letter-maker"><span>✉️</span> Cover Letter</Link>
          </div>

          <div className="j2p-cta">
            <div>
              <h3>Earn while you learn 🚀</h3>
              <p>Join AIDLA today and start earning rewards as you build your skills.</p>
            </div>
            <Link to="/signup" className="j2p-cta-link">Join now ✨</Link>
          </div>
        </motion.div>

      </div>

      <footer className="j2p-footer">
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