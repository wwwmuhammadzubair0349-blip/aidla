import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet"; // or "react-helmet-async"
import Footer from "../../components/footer"; // adjust path if needed
import "./cv-maker.css";

// ─── Utilities ────────────────────────────────────────────────────
function safeText(v) { return String(v ?? "").trim(); }
function splitLines(v) { return safeText(v).split("\n").map(s => s.trim()).filter(Boolean); }
function uid() { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36); }
async function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Failed to read file"));
    r.readAsDataURL(file);
  });
}

// ─── Template registry ────────────────────────────────────────────
const REGIONS = [
  { key: "europe",   label: "🇪🇺 European",  styles: ["classic","premium","professional","academic"] },
  { key: "gulf",     label: "🌙 Gulf",        styles: ["classic","premium","professional","corporate"] },
  { key: "pakistan", label: "🇵🇰 Pakistan",   styles: ["classic","premium","professional","modern"] },
  { key: "uae",      label: "🇦🇪 UAE",        styles: ["classic","premium","professional","executive"] },
  { key: "global",   label: "🌍 Global",      styles: ["classic","premium","professional","creative"] },
];
const STYLE_LABELS = {
  classic:"Classic", premium:"Premium", professional:"Professional",
  academic:"Academic", corporate:"Corporate", modern:"Modern",
  executive:"Executive", creative:"Creative",
};
const REGION_PALETTES = {
  europe:   ["#1e3a8a","#065f46","#7c2d12","#4c1d95"],
  gulf:     ["#78350f","#1e3a8a","#064e3b","#1e1b4b"],
  pakistan: ["#166534","#1e3a8a","#7c2d12","#064e3b"],
  uae:      ["#78350f","#1e3a8a","#064e3b","#374151"],
  global:   ["#1e3a8a","#0f766e","#7c2d12","#1e1b4b"],
};
const FONT_SIZES = { small:"11px", medium:"12.5px", large:"14px" };
const PAPER_SIZES = { a4:{ w:794, h:1123 }, letter:{ w:816, h:1056 } };

const EMPTY_DATA = {
  fullName:"", title:"", email:"", phone:"", location:"",
  linkedin:"", website:"", summary:"", skills:"", languages:"",
  photoDataUrl:"", experience:[], education:[], projects:[],
  certifications:[], hobbies:"",
};

// ─── CV Paper / Document CSS (kept for dynamic injection) ─────────
const CV_DOC_CSS = `
  .cv-paper {
    background: #fff; border-radius: 12px; overflow: hidden;
    margin: 0 auto; box-shadow: 0 4px 24px rgba(15,23,42,0.12);
    border: 1px solid rgba(15,23,42,0.07);
  }
  .cv-doc { font-family:'Calibri','Segoe UI',Arial,sans-serif; color:#0f172a; line-height:1.5; background:#fff; height:100%; }
  .doc-two { display:grid;grid-template-columns:1.5fr 1fr;gap:18px;margin-top:10px;align-items:start; }
  .doc-header { display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:12px; }
  .doc-contact { font-size:11px;color:#475569;margin-top:5px;line-height:1.8; }
  .doc-header .doc-contact { display:flex;flex-wrap:wrap;gap:5px 12px;align-items:center;margin-top:6px; }
  .doc-header .doc-contact div { display:flex;align-items:center;font-size:11px;color:inherit; }
  .doc-header .doc-contact div:not(:last-child)::after { content:"•";margin-left:12px;color:inherit;opacity:0.5; }
  .doc-side .doc-contact { display:flex;flex-direction:column;gap:6px;color:rgba(255,255,255,0.85); }
  .doc-photo { width:95px;height:115px;object-fit:cover;object-position:top;border-radius:8px;border:2px solid rgba(15,23,42,0.1);flex-shrink:0; }
  .doc-photo-circle { width:95px;height:95px;object-fit:cover;object-position:top;border-radius:50%;border:3px solid rgba(255,255,255,0.5);flex-shrink:0; }

  .europe-classic .cv-doc-inner { padding:18mm 16mm; }
  .europe-classic .doc-name { font-size:26px;font-weight:900;letter-spacing:-0.5px; }
  .europe-classic .doc-role { font-size:14px;font-weight:700;color:var(--daccent);margin-top:2px; }
  .europe-classic .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:var(--daccent);border-bottom:2px solid var(--daccent);padding-bottom:3px;margin:14px 0 8px; }

  .europe-premium .cv-doc-inner { padding:0;display:grid;grid-template-columns:72mm 1fr;min-height:inherit; }
  .europe-premium .doc-side { background:var(--daccent);color:#fff;padding:18mm 12mm; }
  .europe-premium .doc-side .doc-name { font-size:22px;font-weight:900; }
  .europe-premium .doc-side-sec-title { font-size:10px;font-weight:900;letter-spacing:1.2px;text-transform:uppercase;color:rgba(255,255,255,0.6);border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:4px;margin:14px 0 8px; }
  .europe-premium .doc-main { padding:18mm 16mm; }
  .europe-premium .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;color:var(--daccent);border-bottom:1px solid rgba(0,0,0,0.1);padding-bottom:3px;margin:14px 0 8px; }

  .europe-professional .cv-doc-inner { padding:16mm 15mm; }
  .europe-professional .doc-header { border-bottom:3px solid var(--daccent);padding-bottom:12px; }
  .europe-professional .doc-name { font-size:26px;font-weight:900; }
  .europe-professional .doc-role { font-size:14px;font-weight:700;color:var(--daccent); }
  .europe-professional .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:var(--daccent);margin:14px 0 8px; }

  .europe-academic .cv-doc { font-family:'Playfair Display',serif; }
  .europe-academic .cv-doc-inner { padding:20mm 18mm; }
  .europe-academic .doc-name { font-size:26px;font-weight:900;letter-spacing:1px;text-transform:uppercase; }
  .europe-academic .doc-role { font-size:14px;font-weight:600;color:var(--daccent); }
  .europe-academic .doc-sec-title { font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #000;padding-bottom:3px;margin:14px 0 8px; }

  .gulf-classic .cv-doc-inner { padding:16mm 15mm; }
  .gulf-classic .doc-name { font-size:26px;font-weight:900; }
  .gulf-classic .doc-role { font-size:14px;font-weight:700;color:var(--daccent); }
  .gulf-classic .doc-sec-title { font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:1px;background:var(--daccent);color:#fff;padding:5px 12px;border-radius:4px;margin:14px 0 8px;display:inline-block; }

  .gulf-premium .cv-doc-inner { padding:0;display:grid;grid-template-columns:70mm 1fr;min-height:inherit; }
  .gulf-premium .doc-side { background:var(--daccent);color:#fff;padding:16mm 12mm; }
  .gulf-premium .doc-side .doc-name { font-size:20px;font-weight:900; }
  .gulf-premium .doc-side-sec-title { font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.6);border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:4px;margin:14px 0 8px; }
  .gulf-premium .doc-main { padding:16mm 14mm; }
  .gulf-premium .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;color:var(--daccent);border-bottom:1px solid rgba(0,0,0,0.1);padding-bottom:3px;margin:14px 0 8px; }

  .gulf-professional .cv-doc-inner { padding:16mm 15mm; }
  .gulf-professional .doc-header { padding:14px;background:rgba(0,0,0,0.03);border-radius:8px;border-left:5px solid var(--daccent); }
  .gulf-professional .doc-name { font-size:26px;font-weight:900; }
  .gulf-professional .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:var(--daccent);border-left:3px solid var(--daccent);padding-left:8px;margin:14px 0 8px; }

  .gulf-corporate .cv-doc-inner { padding:16mm 15mm; }
  .gulf-corporate .doc-header { background:var(--daccent);color:#fff;padding:18mm 15mm 14mm;margin:-16mm -15mm 16px;align-items:center; }
  .gulf-corporate .doc-name { color:#fff;font-size:26px;font-weight:900;letter-spacing:0.5px; }
  .gulf-corporate .doc-role { color:rgba(255,255,255,0.9);font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px; }
  .gulf-corporate .doc-contact { color:rgba(255,255,255,0.85); }
  .gulf-corporate .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid var(--daccent);padding-bottom:3px;color:var(--daccent);margin:14px 0 8px; }

  .pakistan-classic .cv-doc-inner { padding:16mm 15mm; }
  .pakistan-classic .doc-name { font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:0.5px; }
  .pakistan-classic .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid var(--daccent);padding-bottom:3px;color:var(--daccent);margin:14px 0 8px; }

  .pakistan-premium .cv-doc-inner { padding:0;display:grid;grid-template-columns:70mm 1fr;min-height:inherit; }
  .pakistan-premium .doc-side { background:var(--daccent);color:#fff;padding:16mm 12mm;text-align:center; }
  .pakistan-premium .doc-side .doc-name { font-size:20px;font-weight:900; }
  .pakistan-premium .doc-side-sec-title { font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.6);border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:4px;margin:14px 0 8px; }
  .pakistan-premium .doc-main { padding:16mm 14mm; }
  .pakistan-premium .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;color:var(--daccent);border-bottom:1px solid rgba(0,0,0,0.1);padding-bottom:3px;margin:14px 0 8px; }

  .pakistan-professional .cv-doc-inner { padding:16mm 15mm; }
  .pakistan-professional .doc-header { border-bottom:2px solid var(--daccent);padding-bottom:12px; }
  .pakistan-professional .doc-name { font-size:26px;font-weight:900; }
  .pakistan-professional .doc-sec-title { font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:var(--daccent);background:rgba(0,0,0,0.03);padding:5px 10px;border-left:3px solid var(--daccent);margin:14px 0 8px; }

  .pakistan-modern .cv-doc-inner { padding:16mm 15mm; }
  .pakistan-modern .doc-header { background:linear-gradient(135deg,var(--daccent),rgba(0,0,0,0.6));border-radius:10px;padding:16px;color:#fff;margin-bottom:14px; }
  .pakistan-modern .doc-name { font-size:26px;font-weight:900;color:#fff; }
  .pakistan-modern .doc-role { color:rgba(255,255,255,0.9);font-size:14px;font-weight:700; }
  .pakistan-modern .doc-contact { color:rgba(255,255,255,0.85); }
  .pakistan-modern .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid var(--daccent);padding-bottom:3px;color:var(--daccent);margin:14px 0 8px; }

  .uae-classic .cv-doc-inner { padding:16mm 15mm; }
  .uae-classic .doc-header { border-bottom:3px double var(--daccent);padding-bottom:12px; }
  .uae-classic .doc-name { font-size:26px;font-weight:900; }
  .uae-classic .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:var(--daccent);border-bottom:1px solid var(--daccent);padding-bottom:3px;margin:14px 0 8px; }

  .uae-premium .cv-doc-inner { padding:0;display:grid;grid-template-columns:74mm 1fr;min-height:inherit; }
  .uae-premium .doc-side { background:var(--daccent);color:#fff;padding:18mm 12mm; }
  .uae-premium .doc-side .doc-name { font-size:22px;font-weight:900; }
  .uae-premium .doc-side-sec-title { font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.6);border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:4px;margin:14px 0 8px; }
  .uae-premium .doc-main { padding:18mm 14mm; }
  .uae-premium .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;color:var(--daccent);border-bottom:1px solid rgba(0,0,0,0.1);padding-bottom:3px;margin:14px 0 8px; }

  .uae-professional .cv-doc-inner { padding:16mm 15mm; }
  .uae-professional .doc-header { background:var(--daccent);color:#fff;padding:18mm 15mm 14mm;margin:-16mm -15mm 16px; }
  .uae-professional .doc-name { font-size:26px;font-weight:900; }
  .uae-professional .doc-role { color:rgba(255,255,255,0.9);font-size:14px;font-weight:700; }
  .uae-professional .doc-contact { color:rgba(255,255,255,0.85); }
  .uae-professional .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:var(--daccent);border-left:4px solid var(--daccent);padding-left:8px;margin:14px 0 8px; }

  .uae-executive .cv-doc-inner { padding:16mm 15mm; }
  .uae-executive .doc-header { background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.1);border-radius:8px;padding:16px; }
  .uae-executive .doc-name { font-family:'Playfair Display',serif;font-size:28px;font-weight:900;letter-spacing:-0.3px; }
  .uae-executive .doc-sec-title { font-family:'Playfair Display',serif;font-size:13px;font-weight:900;text-transform:uppercase;border-bottom:1px solid rgba(0,0,0,0.2);padding-bottom:4px;color:var(--daccent);margin:14px 0 8px; }

  .global-classic .cv-doc-inner { padding:18mm 16mm; }
  .global-classic .doc-name { font-size:26px;font-weight:900; }
  .global-classic .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:var(--daccent);border-bottom:2px solid var(--daccent);padding-bottom:3px;margin:14px 0 8px; }

  .global-premium .cv-doc-inner { padding:0;display:grid;grid-template-columns:70mm 1fr;min-height:inherit; }
  .global-premium .doc-side { background:var(--daccent);color:#fff;padding:18mm 12mm; }
  .global-premium .doc-side .doc-name { font-size:22px;font-weight:900; }
  .global-premium .doc-side-sec-title { font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.6);border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:4px;margin:14px 0 8px; }
  .global-premium .doc-main { padding:18mm 14mm; }
  .global-premium .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;color:var(--daccent);border-bottom:1px solid rgba(0,0,0,0.1);padding-bottom:3px;margin:14px 0 8px; }

  .global-professional .cv-doc-inner { padding:16mm 15mm; }
  .global-professional .doc-header { border-bottom:2px solid var(--daccent);padding-bottom:12px; }
  .global-professional .doc-name { font-size:26px;font-weight:900; }
  .global-professional .doc-sec-title { font-size:11px;font-weight:900;text-transform:uppercase;color:var(--daccent);border-bottom:1px solid rgba(0,0,0,0.08);padding-bottom:3px;margin:14px 0 8px; }

  .global-creative .cv-doc-inner { padding:16mm 15mm; }
  .global-creative .doc-header { background:linear-gradient(135deg,rgba(59,130,246,0.08),rgba(14,165,233,0.05));border-radius:12px;padding:18px; }
  .global-creative .doc-name { font-family:'DM Sans',sans-serif;font-size:28px;font-weight:900;letter-spacing:-0.5px; }
  .global-creative .doc-sec-title { font-family:'DM Sans',sans-serif;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:var(--daccent);display:flex;align-items:center;margin:14px 0 8px; }
  .global-creative .doc-sec-title::after { content:"";flex:1;height:2px;background:var(--daccent);opacity:0.2;margin-left:10px;border-radius:2px; }

  .doc-item { margin-bottom:10px; }
  .doc-item-top { display:flex;justify-content:space-between;gap:10px;align-items:flex-start; }
  .doc-item-head { font-weight:800;font-size:12.5px; }
  .doc-item-meta { font-size:10.8px;color:#64748b;font-weight:700;text-align:right;min-width:100px; }
  .doc-bullets { margin:5px 0 0;padding-left:16px; }
  .doc-bullets li { margin:3px 0;font-size:11.5px; }
  .doc-list { margin:5px 0 0;padding-left:16px; }
  .doc-list li { margin:3px 0;font-size:11.5px; }
  .doc-chips { margin:6px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px; }
  .doc-chip { padding:3px 8px;border-radius:999px;background:rgba(0,0,0,0.05);border:1px solid rgba(0,0,0,0.1);font-weight:700;font-size:10.5px; }
  .doc-p { font-size:11.5px;line-height:1.6; }
`;

// ─── Main Component ───────────────────────────────────────────────
export default function CvMaker() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem("aidla_cv_v4");
      if (!raw) return EMPTY_DATA;
      return { ...EMPTY_DATA, ...JSON.parse(raw) };
    } catch { return EMPTY_DATA; }
  });

  const [region,   setRegion]   = useState("europe");
  const [style,    setStyle]    = useState("classic");
  const [accent,   setAccent]   = useState(REGION_PALETTES.europe[0]);
  const [fontSize, setFontSize] = useState("medium");
  const [paper,    setPaper]    = useState("a4");
  const [msg,      setMsg]      = useState("");
  const [msgType,  setMsgType]  = useState("info");
  const [mobileTab,setMobileTab]= useState("form"); // "form" | "preview"

  const showMsg = (t, type = "info") => { setMsg(t); setMsgType(type); };

  const previewScrollRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Scale preview to fit container
  useEffect(() => {
    const el = previewScrollRef.current;
    if (!el) return;
    const calc = () => {
      const cw = el.clientWidth - 28;
      const targetW = PAPER_SIZES[paper].w;
      setScale(cw < targetW ? cw / targetW : 1);
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [paper]);

  useEffect(() => {
    try { localStorage.setItem("aidla_cv_v4", JSON.stringify(data)); } catch {}
  }, [data]);

  useEffect(() => {
    setAccent(REGION_PALETTES[region][0]);
    setStyle(REGIONS.find(r => r.key === region)?.styles[0] || "classic");
  }, [region]);

  const update     = (p) => setData(prev => ({ ...prev, ...p }));
  const addItem    = (key, blank) => setData(p => ({ ...p, [key]: [...(p[key]||[]), { id:uid(), ...blank }] }));
  const removeItem = (key, id)    => setData(p => ({ ...p, [key]: (p[key]||[]).filter(x => x.id !== id) }));
  const updateItem = (key, id, patch) => setData(p => ({ ...p, [key]: (p[key]||[]).map(x => x.id===id ? {...x,...patch} : x) }));

  const onPickPhoto = async (file) => {
    if (!file) return;
    if (!file.type?.startsWith("image/")) return showMsg("Please choose an image file.", "error");
    try { update({ photoDataUrl: await fileToDataURL(file) }); showMsg("Photo added ✅", "success"); }
    catch { showMsg("Failed to load photo.", "error"); }
  };

  const templateKey = `${region}-${style}`;
  const computed = useMemo(() => ({
    skills:    splitLines(data.skills),
    languages: splitLines(data.languages),
    hobbies:   splitLines(data.hobbies),
  }), [data.skills, data.languages, data.hobbies]);

  const paperW = PAPER_SIZES[paper].w;
  const paperH = PAPER_SIZES[paper].h;

  // ── Print ──
  const onPrint = useCallback(() => {
    if (!safeText(data.fullName)) return showMsg("Enter your full name first.", "error");

    // Inject CV doc styles
    let styleEl = document.getElementById("cvm-print-style");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "cvm-print-style";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = CV_DOC_CSS;

    // Create or reuse print root
    let printRoot = document.getElementById("cvm-print-root");
    if (!printRoot) {
      printRoot = document.createElement("div");
      printRoot.id = "cvm-print-root";
      document.body.appendChild(printRoot);
    }

    // Clone preview paper into print root
    const previewPaper = document.querySelector(".cvm-preview-scroll .cv-paper");
    if (previewPaper) {
      const clone = previewPaper.cloneNode(true);
      clone.style.cssText = `width:${paperW}px!important;min-height:${paperH}px!important;transform:none!important;border-radius:0!important;box-shadow:none!important;border:none!important;margin:0!important;`;
      printRoot.innerHTML = "";
      printRoot.appendChild(clone);
    }

    window.print();
  }, [data, paperW, paperH]);

  const onReset = () => {
    if (!confirm("Reset all fields?")) return;
    localStorage.removeItem("aidla_cv_v4");
    setData(EMPTY_DATA); setRegion("europe"); setStyle("classic");
    setAccent(REGION_PALETTES.europe[0]); setFontSize("medium"); setPaper("a4");
    showMsg("Reset ✅", "success");
  };

  const currentRegion = REGIONS.find(r => r.key === region);
  const fieldCount = [data.fullName, data.title, data.email, data.phone].filter(Boolean).length;

  // Canonical URL – adjust as needed
  const canonicalUrl = "https://aidla.online/tools/cv-maker";

  return (
    <>
      <Helmet>
        <title>CV Maker – Create Professional CVs | AIDLA</title>
        <meta
          name="description"
          content="Free online CV maker. Choose from 20+ templates across 5 regions, add your details, and print to PDF. No sign-up required."
        />
        <meta
          name="keywords"
          content="CV maker, resume builder, professional CV, curriculum vitae, career tools, AIDLA"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content="CV Maker – AIDLA" />
        <meta property="og:description" content="Build a professional CV in minutes with our free tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://aidla.online/og-cv-maker.jpg" />
        <meta property="og:site_name" content="AIDLA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CV Maker by AIDLA" />
        <meta name="twitter:description" content="Create a standout CV with our easy-to-use tool." />
        <meta name="twitter:image" content="https://aidla.online/twitter-cv-maker.jpg" />

        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="cvm-root">
        {/* Orbs */}
        <div className="cvm-orbs">
          <div className="cvm-orb cvm-orb1"/>
          <div className="cvm-orb cvm-orb2"/>
          <div className="cvm-orb cvm-orb3"/>
        </div>

        <div className="cvm-wrap">

          {/* ── Hero ── */}
          <motion.div className="cvm-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
            <span className="cvm-badge">🧑‍💼 Career Tool</span>
            <h1 className="cvm-title">
              CV <span className="cvm-title-acc">Maker</span>
            </h1>
            <p className="cvm-sub">Build a professional CV in minutes. Fill your details, choose a style, and print to PDF — no account needed.</p>
          </motion.div>

          <motion.div className="cvm-pills" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}>
            {["✓ 20+ Templates","✓ 5 Regions","✓ Live Preview","✓ Print to PDF","✓ 100% Free","✓ Auto-saved"].map(p => (
              <span className="cvm-pill" key={p}>{p}</span>
            ))}
          </motion.div>

          {/* ── Toast ── */}
          <AnimatePresence>
            {msg && (
              <motion.div className={`cvm-toast ${msgType}`}
                initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}>
                <span>{msg}</span>
                <button className="cvm-toast-close" onClick={()=>setMsg("")}>×</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Mobile tab bar ── */}
          <div className="cvm-tab-bar">
            <button className={`cvm-tog-btn${mobileTab==="form"?" active":""}`} onClick={()=>setMobileTab("form")}>✍️ Edit</button>
            <button className={`cvm-tog-btn${mobileTab==="preview"?" active":""}`} onClick={()=>setMobileTab("preview")}>👁 Preview</button>
            <button className="cvm-btn cvm-btn-primary" style={{marginLeft:"auto",padding:"7px 14px",fontSize:"0.78rem"}} onClick={onPrint}>🖨️ Print PDF</button>
          </div>

          {/* ── Stats (if fields filled) ── */}
          {fieldCount > 0 && (
            <div className="cvm-stats" style={{marginBottom:12}}>
              <div className="cvm-stat g">✅ {fieldCount} field{fieldCount!==1?"s":""} filled</div>
              {(data.experience||[]).length > 0 && <><div className="cvm-stat-div"/><div className="cvm-stat">💼 {data.experience.length} exp</div></>}
              {(data.education||[]).length  > 0 && <><div className="cvm-stat-div"/><div className="cvm-stat">🎓 {data.education.length} edu</div></>}
              {computed.skills.length       > 0 && <><div className="cvm-stat-div"/><div className="cvm-stat">🛠 {computed.skills.length} skills</div></>}
            </div>
          )}

          <div className="cvm-layout">

            {/* ══ LEFT: FORM ══ */}
            <div className={`cvm-col-form${mobileTab==="preview" ? " cvm-col-hidden" : ""}`}>

              {/* Personal details */}
              <motion.div className="cvm-card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.12}}>
                <div className="cvm-card-title">✍️ Personal Details</div>
                <div className="cvm-form-grid">
                  <Field label="Full Name *"><input className="cvm-input" value={data.fullName||""} onChange={e=>update({fullName:e.target.value})} placeholder="e.g. John Smith"/></Field>
                  <Field label="Job Title"><input className="cvm-input" value={data.title||""} onChange={e=>update({title:e.target.value})} placeholder="e.g. Engineer"/></Field>
                  <Field label="Email"><input className="cvm-input" value={data.email||""} onChange={e=>update({email:e.target.value})} placeholder="you@email.com"/></Field>
                  <Field label="Phone"><input className="cvm-input" value={data.phone||""} onChange={e=>update({phone:e.target.value})} placeholder="+971..."/></Field>
                  <Field label="Location"><input className="cvm-input" value={data.location||""} onChange={e=>update({location:e.target.value})} placeholder="Dubai, UAE"/></Field>
                  <Field label="LinkedIn"><input className="cvm-input" value={data.linkedin||""} onChange={e=>update({linkedin:e.target.value})} placeholder="linkedin.com/in/..."/></Field>
                  <Field label="Photo" style={{gridColumn:"1 / -1"}}>
                    <input type="file" accept="image/*" className="cvm-input" style={{padding:6}} onChange={e=>onPickPhoto(e.target.files?.[0])}/>
                  </Field>
                </div>
                <div style={{marginTop:12}}>
                  <Field label="Professional Summary">
                    <textarea className="cvm-input cvm-textarea" value={data.summary||""} onChange={e=>update({summary:e.target.value})} placeholder="Brief overview of your experience and expertise..."/>
                  </Field>
                </div>
                <div style={{marginTop:10}}>
                  <Field label="Skills (one per line)">
                    <textarea className="cvm-input cvm-textarea" value={data.skills||""} onChange={e=>update({skills:e.target.value})} placeholder="AutoCAD&#10;HVAC&#10;Project Management"/>
                  </Field>
                </div>
                <div className="cvm-form-grid" style={{marginTop:10}}>
                  <Field label="Languages (one per line)">
                    <textarea className="cvm-input cvm-textarea" value={data.languages||""} onChange={e=>update({languages:e.target.value})} style={{minHeight:60}} placeholder="English&#10;Arabic&#10;Urdu"/>
                  </Field>
                  <Field label="Hobbies (one per line)">
                    <textarea className="cvm-input cvm-textarea" value={data.hobbies||""} onChange={e=>update({hobbies:e.target.value})} style={{minHeight:60}} placeholder="Reading&#10;Cricket"/>
                  </Field>
                </div>
              </motion.div>

              {/* Dynamic sections */}
              {[
                { key:"experience",     label:"🏢 Experience",     Item:ExpFormItem },
                { key:"education",      label:"🎓 Education",      Item:EduFormItem },
                { key:"projects",       label:"🛠 Projects",       Item:ProjFormItem },
                { key:"certifications", label:"✅ Certifications", Item:CertFormItem },
              ].map(({key,label,Item},i) => (
                <motion.div key={key} className="cvm-card" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.14+i*0.04}}>
                  <div className="cvm-section-head">
                    {label}
                    <button className="cvm-btn cvm-btn-add" onClick={()=>addItem(key,{id:undefined})}>+ Add</button>
                  </div>
                  {(data[key]||[]).map(x => <Item key={x.id} x={x} onUpdate={updateItem} onRemove={removeItem}/>)}
                  {(data[key]||[]).length === 0 && (
                    <p style={{fontSize:"0.72rem",color:"var(--slate)",marginTop:8,fontWeight:600}}>No {label.split(" ")[1].toLowerCase()} added yet.</p>
                  )}
                </motion.div>
              ))}

              {/* Action bar */}
              <div className="cvm-action">
                <div className="cvm-action-info">
                  <span className="cvm-action-label">Ready to export</span>
                  <span className="cvm-action-value">{safeText(data.fullName)||"Your Name"} · {templateKey} · {paper.toUpperCase()}</span>
                </div>
                <div className="cvm-action-btns">
                  <button className="cvm-btn cvm-btn-danger" onClick={onReset}>Clear</button>
                  <button className="cvm-btn cvm-btn-primary" onClick={onPrint}>🖨️ Print PDF</button>
                </div>
              </div>
            </div>

            {/* ══ RIGHT: PREVIEW ══ */}
            <div className={`cvm-preview-panel${mobileTab==="form" ? " cvm-col-hidden" : ""}`}>

              {/* Header */}
              <div className="cvm-preview-header">
                <div className="cvm-preview-header-title">Live Preview</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  <button className="cvm-btn" style={{padding:"6px 12px",fontSize:"0.76rem",background:"rgba(59,130,246,0.06)",border:"1.5px solid rgba(59,130,246,0.15)",color:"var(--royal)",fontWeight:700,borderRadius:20}} onClick={onReset}>Reset</button>
                </div>
              </div>

              {/* Controls */}
              <div className="cvm-controls">
                {/* Region tabs */}
                <div className="cvm-region-tabs">
                  {REGIONS.map(r => (
                    <button key={r.key} className={`cvm-region-tab${region===r.key?" active":""}`} onClick={()=>setRegion(r.key)}>{r.label}</button>
                  ))}
                </div>

                {/* Style cards */}
                <div className="cvm-style-grid">
                  {(currentRegion?.styles||[]).map(s => (
                    <div key={s} className={`cvm-style-card${style===s?" active":""}`} onClick={()=>setStyle(s)}>
                      <div style={{fontSize:"0.72rem",fontWeight:800,color:style===s?"var(--navy)":"var(--slate)"}}>{STYLE_LABELS[s]}</div>
                    </div>
                  ))}
                </div>

                {/* Options row: accent + font + paper */}
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  {/* Accent */}
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    {REGION_PALETTES[region].map(p => (
                      <div key={p} className={`cvm-dot${accent===p?" selected":""}`}
                        style={{background:p}} onClick={()=>setAccent(p)} title={p}/>
                    ))}
                  </div>

                  {/* Font */}
                  <div className="cvm-toggle">
                    {Object.keys(FONT_SIZES).map(s => (
                      <button key={s} className={`cvm-tog-btn${fontSize===s?" active":""}`} onClick={()=>setFontSize(s)}>
                        {s[0].toUpperCase()+s.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Paper */}
                  <div className="cvm-toggle">
                    {["a4","letter"].map(p => (
                      <button key={p} className={`cvm-tog-btn${paper===p?" active":""}`} onClick={()=>setPaper(p)}>
                        {p.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scaled CV preview */}
              <div className="cvm-preview-scroll" ref={previewScrollRef}>
                <div style={{width:`${paperW*scale}px`,height:`${paperH*scale}px`,position:"relative",flexShrink:0}}>
                  <div style={{
                    transform:`scale(${scale})`,
                    transformOrigin:"top left",
                    position:"absolute",left:0,top:0,
                    width:`${paperW}px`,minHeight:`${paperH}px`,
                  }}>
                    <div className={`cv-paper ${templateKey}`} style={{"--daccent":accent,width:`${paperW}px`,minHeight:`${paperH}px`}}>
                      <CvDoc templateKey={templateKey} data={data} computed={computed} fontSize={FONT_SIZES[fontSize]}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Other tools ── */}
          <motion.div className="cvm-card" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
            <p style={{fontSize:"clamp(0.72rem,2.5vw,0.78rem)",color:"#64748b",marginBottom:10,fontWeight:600}}>Need something else?</p>
            <div className="cvm-suggest">
              <Link to="/tools/career/cover-letter-maker"><span>✉️</span> Cover Letter</Link>
              <Link to="/tools/pdf/image-to-pdf"><span>📄</span> Image → PDF</Link>
              <Link to="/tools/pdf/word-to-pdf"><span>📝</span> Word → PDF</Link>
              <Link to="/tools/image/jpg-to-png"><span>🖼️</span> JPG → PNG</Link>
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

// ─── Form helpers ─────────────────────────────────────────────────
function Field({ label, children, style }) {
  return <div className="cvm-field" style={style}><label>{label}</label>{children}</div>;
}

function ItemBox({ title, onRemove, children }) {
  return (
    <div className="cvm-item-box">
      <div className="cvm-item-box-head">
        <span>{title||"New"}</span>
        <button className="cvm-btn-rm" onClick={onRemove}>✕</button>
      </div>
      {children}
    </div>
  );
}

function ExpFormItem({ x, onUpdate, onRemove }) {
  const u = p => onUpdate("experience", x.id, p);
  return (
    <ItemBox title={x.role||"Experience"} onRemove={()=>onRemove("experience",x.id)}>
      <div className="cvm-form-grid">
        <Field label="Role"><input className="cvm-input" value={x.role||""} onChange={e=>u({role:e.target.value})} placeholder="Engineer"/></Field>
        <Field label="Company"><input className="cvm-input" value={x.company||""} onChange={e=>u({company:e.target.value})} placeholder="Company Ltd"/></Field>
        <Field label="City"><input className="cvm-input" value={x.city||""} onChange={e=>u({city:e.target.value})} placeholder="Dubai"/></Field>
        <Field label="Start"><input className="cvm-input" value={x.start||""} onChange={e=>u({start:e.target.value})} placeholder="Jan 2023"/></Field>
        <Field label="End"><input className="cvm-input" value={x.end||""} onChange={e=>u({end:e.target.value})} placeholder="Present"/></Field>
      </div>
      <div style={{marginTop:8}}>
        <Field label="Bullets (one per line)">
          <textarea className="cvm-input cvm-textarea" value={x.bullets||""} onChange={e=>u({bullets:e.target.value})} placeholder="Achieved X by doing Y"/>
        </Field>
      </div>
    </ItemBox>
  );
}

function EduFormItem({ x, onUpdate, onRemove }) {
  const u = p => onUpdate("education", x.id, p);
  return (
    <ItemBox title={x.degree||"Education"} onRemove={()=>onRemove("education",x.id)}>
      <div className="cvm-form-grid">
        <Field label="Degree"><input className="cvm-input" value={x.degree||""} onChange={e=>u({degree:e.target.value})} placeholder="BSc Engineering"/></Field>
        <Field label="School"><input className="cvm-input" value={x.school||""} onChange={e=>u({school:e.target.value})} placeholder="University"/></Field>
        <Field label="City"><input className="cvm-input" value={x.city||""} onChange={e=>u({city:e.target.value})} placeholder="Dubai"/></Field>
        <Field label="Start"><input className="cvm-input" value={x.start||""} onChange={e=>u({start:e.target.value})} placeholder="2020"/></Field>
        <Field label="End"><input className="cvm-input" value={x.end||""} onChange={e=>u({end:e.target.value})} placeholder="2024"/></Field>
      </div>
      <div style={{marginTop:8}}>
        <Field label="Notes">
          <textarea className="cvm-input cvm-textarea" value={x.notes||""} onChange={e=>u({notes:e.target.value})} placeholder="GPA 3.8, Dean's List"/>
        </Field>
      </div>
    </ItemBox>
  );
}

function ProjFormItem({ x, onUpdate, onRemove }) {
  const u = p => onUpdate("projects", x.id, p);
  return (
    <ItemBox title={x.name||"Project"} onRemove={()=>onRemove("projects",x.id)}>
      <div className="cvm-form-grid">
        <Field label="Name"><input className="cvm-input" value={x.name||""} onChange={e=>u({name:e.target.value})} placeholder="Solar Robot"/></Field>
        <Field label="Meta"><input className="cvm-input" value={x.meta||""} onChange={e=>u({meta:e.target.value})} placeholder="React · 2024"/></Field>
      </div>
      <div style={{marginTop:8}}>
        <Field label="Bullets">
          <textarea className="cvm-input cvm-textarea" value={x.bullets||""} onChange={e=>u({bullets:e.target.value})} placeholder="Built X using Y, achieving Z"/>
        </Field>
      </div>
    </ItemBox>
  );
}

function CertFormItem({ x, onUpdate, onRemove }) {
  const u = p => onUpdate("certifications", x.id, p);
  return (
    <ItemBox title={x.name||"Certification"} onRemove={()=>onRemove("certifications",x.id)}>
      <div className="cvm-form-grid">
        <Field label="Name"><input className="cvm-input" value={x.name||""} onChange={e=>u({name:e.target.value})} placeholder="AWS Solutions Architect"/></Field>
        <Field label="Issuer"><input className="cvm-input" value={x.issuer||""} onChange={e=>u({issuer:e.target.value})} placeholder="Amazon"/></Field>
        <Field label="Year"><input className="cvm-input" value={x.year||""} onChange={e=>u({year:e.target.value})} placeholder="2024"/></Field>
      </div>
    </ItemBox>
  );
}

// ─── CV Document Renderer ─────────────────────────────────────────
function CvDoc({ templateKey, data, computed, fontSize }) {
  const c = computed;
  const contactParts = [safeText(data.email), safeText(data.phone), safeText(data.location)].filter(Boolean);
  const links = [safeText(data.linkedin), safeText(data.website)].filter(Boolean);
  const hasPhoto = !!safeText(data.photoDataUrl);

  const exp   = (data.experience||[]).filter(x => safeText(x.role)||safeText(x.company));
  const edu   = (data.education||[]).filter(x => safeText(x.degree)||safeText(x.school));
  const projs = (data.projects||[]).filter(x => safeText(x.name));
  const certs = (data.certifications||[]).filter(x => safeText(x.name));

  const isSidebar  = ["europe-premium","gulf-premium","pakistan-premium","uae-premium","global-premium"].includes(templateKey);
  const isFullHdr  = ["uae-professional","gulf-corporate","pakistan-modern","global-creative"].includes(templateKey);
  const isCentered = ["europe-academic","pakistan-classic"].includes(templateKey);

  const MainSections = ({s}) => (<>
    {safeText(data.summary) && <><div className={s}>Summary</div><p className="doc-p">{safeText(data.summary)}</p></>}
    {exp.length>0   && <><div className={s}>Experience</div>{exp.map(x=><ExpBlock key={x.id} x={x}/>)}</>}
    {edu.length>0   && <><div className={s}>Education</div>{edu.map(x=><EduBlock key={x.id} x={x}/>)}</>}
    {projs.length>0 && <><div className={s}>Projects</div>{projs.map(x=><ProjBlock key={x.id} x={x}/>)}</>}
    {certs.length>0 && <><div className={s}>Certifications</div><ul className="doc-list">{certs.map(x=><li key={x.id}><b>{x.name}</b>{x.issuer?` — ${x.issuer}`:""}{x.year?` (${x.year})`:""}</li>)}</ul></>}
  </>);

  const SideSections = ({s}) => (<>
    {c.skills.length>0    && <><div className={s}>Skills</div><ul className="doc-list">{c.skills.map((k,i)=><li key={i}>{k}</li>)}</ul></>}
    {c.languages.length>0 && <><div className={s}>Languages</div><ul className="doc-list">{c.languages.map((k,i)=><li key={i}>{k}</li>)}</ul></>}
    {c.hobbies.length>0   && <><div className={s}>Interests</div><ul className="doc-list">{c.hobbies.map((k,i)=><li key={i}>{k}</li>)}</ul></>}
  </>);

  const RightSections = ({s}) => (<>
    {c.skills.length>0    && <><div className={s}>Skills</div><ul className="doc-chips">{c.skills.map((k,i)=><li key={i} className="doc-chip">{k}</li>)}</ul></>}
    {edu.length>0         && <><div className={s}>Education</div>{edu.map(x=><EduBlock key={x.id} x={x}/>)}</>}
    {certs.length>0       && <><div className={s}>Certifications</div><ul className="doc-list">{certs.map(x=><li key={x.id}><b>{x.name}</b>{x.issuer?` — ${x.issuer}`:""}{x.year?` (${x.year})`:""}</li>)}</ul></>}
    {c.languages.length>0 && <><div className={s}>Languages</div><ul className="doc-list">{c.languages.map((k,i)=><li key={i}>{k}</li>)}</ul></>}
    {c.hobbies.length>0   && <><div className={s}>Interests</div><ul className="doc-list">{c.hobbies.map((k,i)=><li key={i}>{k}</li>)}</ul></>}
  </>);

  const ContactBlock = ({style:cs}) => (
    <div className="doc-contact" style={cs}>
      {contactParts.map((x,i)=><div key={i}>{x}</div>)}
      {links.map((x,i)=><div key={i} style={{wordBreak:"break-all"}}>{x}</div>)}
    </div>
  );

  if (isSidebar) return (
    <div className="cv-doc" style={{fontSize}}>
      <div className="cv-doc-inner">
        <div className="doc-side">
          {hasPhoto && <img src={data.photoDataUrl} alt="" className="doc-photo-circle" style={{marginBottom:14}}/>}
          <div className="doc-name">{safeText(data.fullName)||"Your Name"}</div>
          <div className="doc-role">{safeText(data.title)}</div>
          <ContactBlock/>
          <SideSections s="doc-side-sec-title"/>
        </div>
        <div className="doc-main"><MainSections s="doc-sec-title"/></div>
      </div>
    </div>
  );

  if (isFullHdr) return (
    <div className="cv-doc" style={{fontSize}}>
      <div className="cv-doc-inner">
        <div className="doc-header">
          <div style={{flex:1}}>
            <div className="doc-name">{safeText(data.fullName)||"Your Name"}</div>
            <div className="doc-role">{safeText(data.title)}</div>
            <ContactBlock/>
          </div>
          {hasPhoto && <img src={data.photoDataUrl} alt="" className="doc-photo" style={{borderColor:"rgba(255,255,255,0.4)"}}/>}
        </div>
        <div className="doc-two">
          <div>
            {safeText(data.summary) && <><div className="doc-sec-title">Summary</div><p className="doc-p">{safeText(data.summary)}</p></>}
            {exp.length>0   && <><div className="doc-sec-title">Experience</div>{exp.map(x=><ExpBlock key={x.id} x={x}/>)}</>}
            {projs.length>0 && <><div className="doc-sec-title">Projects</div>{projs.map(x=><ProjBlock key={x.id} x={x}/>)}</>}
          </div>
          <div><RightSections s="doc-sec-title"/></div>
        </div>
      </div>
    </div>
  );

  if (isCentered) return (
    <div className="cv-doc" style={{fontSize}}>
      <div className="cv-doc-inner">
        <div className="doc-header" style={{flexDirection:"column",alignItems:"center",textAlign:"center"}}>
          {hasPhoto && <img src={data.photoDataUrl} alt="" className="doc-photo-circle" style={{marginBottom:10}}/>}
          <div className="doc-name">{safeText(data.fullName)||"Your Name"}</div>
          <div className="doc-role">{safeText(data.title)}</div>
          <ContactBlock style={{justifyContent:"center"}}/>
        </div>
        <MainSections s="doc-sec-title"/>
        <RightSections s="doc-sec-title"/>
      </div>
    </div>
  );

  return (
    <div className="cv-doc" style={{fontSize}}>
      <div className="cv-doc-inner">
        <div className="doc-header">
          <div>
            <div className="doc-name">{safeText(data.fullName)||"Your Name"}</div>
            <div className="doc-role">{safeText(data.title)}</div>
            <ContactBlock/>
          </div>
          {hasPhoto && <img src={data.photoDataUrl} alt="" className="doc-photo"/>}
        </div>
        {safeText(data.summary) && <><div className="doc-sec-title">Summary</div><p className="doc-p">{safeText(data.summary)}</p></>}
        <div className="doc-two">
          <div>
            {exp.length>0   && <><div className="doc-sec-title">Experience</div>{exp.map(x=><ExpBlock key={x.id} x={x}/>)}</>}
            {projs.length>0 && <><div className="doc-sec-title">Projects</div>{projs.map(x=><ProjBlock key={x.id} x={x}/>)}</>}
          </div>
          <div><RightSections s="doc-sec-title"/></div>
        </div>
      </div>
    </div>
  );
}

function ExpBlock({ x }) {
  const b = splitLines(x.bullets);
  const m = [safeText(x.city),[safeText(x.start),safeText(x.end)].filter(Boolean).join("–")].filter(Boolean).join(" · ");
  return <div className="doc-item"><div className="doc-item-top"><div className="doc-item-head"><b>{safeText(x.role)}</b>{x.company?` — ${x.company}`:""}</div>{m&&<div className="doc-item-meta">{m}</div>}</div>{b.length>0&&<ul className="doc-bullets">{b.map((k,i)=><li key={i}>{k}</li>)}</ul>}</div>;
}
function EduBlock({ x }) {
  const b = splitLines(x.notes);
  const m = [safeText(x.city),[safeText(x.start),safeText(x.end)].filter(Boolean).join("–")].filter(Boolean).join(" · ");
  return <div className="doc-item"><div className="doc-item-top"><div className="doc-item-head"><b>{safeText(x.degree)}</b>{x.school?` — ${x.school}`:""}</div>{m&&<div className="doc-item-meta">{m}</div>}</div>{b.length>0&&<ul className="doc-bullets">{b.map((k,i)=><li key={i}>{k}</li>)}</ul>}</div>;
}
function ProjBlock({ x }) {
  const b = splitLines(x.bullets);
  return <div className="doc-item"><div className="doc-item-head"><b>{safeText(x.name)}</b>{x.meta?` — ${x.meta}`:""}</div>{b.length>0&&<ul className="doc-bullets">{b.map((k,i)=><li key={i}>{k}</li>)}</ul>}</div>;
}