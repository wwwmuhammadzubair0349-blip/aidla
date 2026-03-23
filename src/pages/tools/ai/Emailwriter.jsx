/**
 * EmailWriter.jsx — AI Email Writer
 * ✅ Mobile-first (320px → ∞)
 * ✅ Zero horizontal overflow
 * ✅ SEO: Helmet, canonical, OG, Twitter, JSON-LD
 * ✅ Accessibility: labels, roles, aria, focus-visible
 * ✅ AutoTubePublic theme: DM Sans + Playfair, #fafbff bg
 * ✅ Footer imported same as AutoTubePublic
 * ✅ Supabase edge function (same pattern as AutoTube)
 */
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Footer from "../../components/footer";

/* ── Supabase ──────────────────────────────────────────── */
const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function callEmailWriter(payload) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/email-writer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data?.ok) throw new Error(data?.error || "Generation failed");
  return data.result;
}

/* ── Static data ───────────────────────────────────────── */
const CATEGORIES = [
  {
    id: "professional", icon: "💼", label: "Professional",
    color: "#1a3a8f", light: "rgba(26,58,143,0.08)", border: "rgba(26,58,143,0.22)",
    types: [
      { id: "job_application",   label: "Job Application",  icon: "📋" },
      { id: "follow_up",         label: "Follow Up",        icon: "🔄" },
      { id: "resignation",       label: "Resignation",      icon: "🚪" },
      { id: "promotion_request", label: "Promotion Ask",    icon: "📈" },
      { id: "meeting_request",   label: "Meeting Request",  icon: "📅" },
      { id: "project_update",    label: "Project Update",   icon: "📊" },
    ],
  },
  {
    id: "business", icon: "🏢", label: "Business",
    color: "#0369a1", light: "rgba(3,105,161,0.08)", border: "rgba(3,105,161,0.22)",
    types: [
      { id: "sales_pitch",      label: "Sales Pitch",       icon: "💰" },
      { id: "partnership",      label: "Partnership",       icon: "🤝" },
      { id: "cold_outreach",    label: "Cold Outreach",     icon: "📡" },
      { id: "invoice_followup", label: "Invoice Follow-Up", icon: "🧾" },
      { id: "client_update",    label: "Client Update",     icon: "📬" },
      { id: "complaint",        label: "Complaint",         icon: "⚠️" },
    ],
  },
  {
    id: "personal", icon: "💌", label: "Personal",
    color: "#be123c", light: "rgba(190,18,60,0.08)", border: "rgba(190,18,60,0.22)",
    types: [
      { id: "thank_you",       label: "Thank You",       icon: "🙏" },
      { id: "apology",         label: "Apology",         icon: "💙" },
      { id: "congratulations", label: "Congratulations", icon: "🎉" },
      { id: "introduction",    label: "Introduction",    icon: "👋" },
      { id: "request_favor",   label: "Request a Favor", icon: "🌟" },
      { id: "reconnect",       label: "Reconnect",       icon: "🔗" },
    ],
  },
  {
    id: "academic", icon: "🎓", label: "Academic",
    color: "#6d28d9", light: "rgba(109,40,217,0.08)", border: "rgba(109,40,217,0.22)",
    types: [
      { id: "professor_email", label: "Email to Professor", icon: "📚" },
      { id: "scholarship",     label: "Scholarship Ask",    icon: "🏆" },
      { id: "internship",      label: "Internship Apply",   icon: "🔬" },
      { id: "recommendation",  label: "Recommendation",     icon: "✍️" },
      { id: "thesis_guidance", label: "Thesis Guidance",    icon: "📄" },
      { id: "admission",       label: "Admission Inquiry",  icon: "🏫" },
    ],
  },
];

const TONES = [
  { id: "formal",       label: "Formal",       icon: "🎩" },
  { id: "professional", label: "Professional", icon: "💼" },
  { id: "friendly",     label: "Friendly",     icon: "😊" },
  { id: "persuasive",   label: "Persuasive",   icon: "🎯" },
  { id: "empathetic",   label: "Empathetic",   icon: "💙" },
  { id: "concise",      label: "Concise",      icon: "⚡" },
];

const LENGTHS = [
  { id: "short",  label: "Short",  sub: "~100 words", icon: "📝" },
  { id: "medium", label: "Medium", sub: "~200 words", icon: "📃" },
  { id: "long",   label: "Long",   sub: "~350 words", icon: "📜" },
];

const LANGUAGES = [
  "English","Arabic (عربي)","Urdu (اردو)","French","Spanish",
  "German","Hindi","Portuguese","Turkish","Chinese","Japanese",
];

const QUICK_CHIPS = [
  "Make it shorter","More formal","More confident",
  "Add more details","Stronger opening","Better CTA",
  "More friendly","Translate to Arabic","Translate to Urdu","More persuasive",
];

/* ── Email open helpers ─────────────────────────────────── */
const enc = encodeURIComponent;
const openGmail   = (d) => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${enc(d.to||"")}&su=${enc(d.subject||"")}&body=${enc(d.body||"")}`, "_blank", "noopener");
const openOutlook = (d) => window.open(`https://outlook.live.com/mail/0/deeplink/compose?to=${enc(d.to||"")}&subject=${enc(d.subject||"")}&body=${enc(d.body||"")}`, "_blank", "noopener");
const openYahoo   = (d) => window.open(`https://compose.mail.yahoo.com/?to=${enc(d.to||"")}&subject=${enc(d.subject||"")}&body=${enc(d.body||"")}`, "_blank", "noopener");
const openMailto  = (d) => { window.location.href = `mailto:${enc(d.to||"")}?subject=${enc(d.subject||"")}&body=${enc(d.body||"")}`; };

/* ── Copy hook ──────────────────────────────────────────── */
function useCopy() {
  const [copied, setCopied] = useState("");
  const copy = async (text, id = "x") => {
    try { await navigator.clipboard.writeText(text); }
    catch { const el = document.createElement("textarea"); el.value = text; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(id);
    setTimeout(() => setCopied(""), 2200);
  };
  return { copied, copy };
}

/* ════════════════════════════════════════════════════════ */
export default function EmailWriter() {
  const { copied, copy } = useCopy();
  const resultRef = useRef(null);

  /* form */
  const [activeCat,      setActiveCat]      = useState("professional");
  const [emailType,      setEmailType]      = useState("job_application");
  const [tone,           setTone]           = useState("professional");
  const [length,         setLength]         = useState("medium");
  const [language,       setLanguage]       = useState("English");
  const [senderName,     setSenderName]     = useState("");
  const [recipientName,  setRecipientName]  = useState("");
  const [recipientRole,  setRecipientRole]  = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [context,        setContext]        = useState("");

  /* result */
  const [loading,      setLoading]      = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [regenProg,    setRegenProg]    = useState(0);
  const [result,       setResult]       = useState(null);
  const [error,        setError]        = useState("");
  const [regenError,   setRegenError]   = useState("");

  /* edit */
  const [editMode,    setEditMode]    = useState(false);
  const [editSubject, setEditSubject] = useState("");
  const [editBody,    setEditBody]    = useState("");
  const [regenInstr,  setRegenInstr]  = useState("");

  const cat = CATEGORIES.find(c => c.id === activeCat);

  const basePayload = useCallback(() => ({
    type: emailType, tone, length, language,
    senderName, recipientName, recipientRole, context,
  }), [emailType, tone, length, language, senderName, recipientName, recipientRole, context]);

  const handleGenerate = useCallback(async () => {
    if (loading || regenLoading) return;
    setLoading(true); setError(""); setResult(null);
    setProgress(0); setEditMode(false); setRegenInstr("");
    const tick = setInterval(() => setProgress(p => Math.min(p + 10, 88)), 500);
    try {
      const res = await callEmailWriter(basePayload());
      clearInterval(tick); setProgress(100);
      setTimeout(() => {
        setResult(res);
        setEditSubject(res.subject);
        setEditBody(res.body);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
      }, 200);
    } catch (e) {
      clearInterval(tick); setProgress(0);
      setError(e.message || "Generation failed — please try again.");
    }
    setTimeout(() => setLoading(false), 300);
  }, [loading, regenLoading, basePayload]);

  const handleRegen = useCallback(async () => {
    if (regenLoading || loading || !result) return;
    setRegenLoading(true); setRegenError(""); setRegenProg(0); setEditMode(false);
    const tick = setInterval(() => setRegenProg(p => Math.min(p + 10, 88)), 500);
    try {
      const res = await callEmailWriter({
        ...basePayload(),
        isRegen: true,
        previousEmail: `SUBJECT: ${result.subject}\n---\n${result.body}`,
        regenInstructions: regenInstr.trim() || "Write a fresh variation with the same intent",
      });
      clearInterval(tick); setRegenProg(100);
      setTimeout(() => { setResult(res); setEditSubject(res.subject); setEditBody(res.body); setRegenInstr(""); }, 200);
    } catch (e) {
      clearInterval(tick); setRegenProg(0);
      setRegenError(e.message || "Regeneration failed.");
    }
    setTimeout(() => setRegenLoading(false), 300);
  }, [regenLoading, loading, result, basePayload, regenInstr]);

  const saveEdit = () => { setResult({ subject: editSubject, body: editBody }); setEditMode(false); };
  const emailData = { to: recipientEmail, subject: result?.subject || "", body: result?.body || "" };

  return (
    <>
      <Helmet>
        <title>AI Email Writer — Write Professional Emails Instantly | AIDLA</title>
        <meta name="description" content="AI email writer that crafts professional, business, personal and academic emails in seconds. 24 email types, 6 tones, 11 languages. Open directly in Gmail, Outlook or Mail app — free." />
        <meta name="keywords" content="AI email writer, professional email generator, email writing tool, job application email, business email AI, Gmail draft, Outlook email writer, free email tool, AIDLA" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.aidla.online/tools/career/email-writer" />
        <meta property="og:title" content="AI Email Writer — Write Professional Emails Instantly | AIDLA" />
        <meta property="og:description" content="AI writes professional emails in seconds. 24 types, 6 tones, 11 languages. Opens directly in Gmail or Outlook. Free." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.aidla.online/tools/career/email-writer" />
        <meta property="og:image" content="https://www.aidla.online/og-email-writer.jpg" />
        <meta property="og:site_name" content="AIDLA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Email Writer — AIDLA" />
        <meta name="twitter:description" content="AI writes professional emails in seconds. Opens directly in Gmail, Outlook or Mail app." />
        <meta name="twitter:image" content="https://www.aidla.online/og-email-writer.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "AI Email Writer by AIDLA",
          "url": "https://www.aidla.online/tools/career/email-writer",
          "description": "AI-powered email writer. Generate professional, business, personal and academic emails instantly. Opens in Gmail, Outlook or Mail app.",
          "applicationCategory": "ProductivityApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "publisher": { "@type": "Organization", "name": "AIDLA", "url": "https://www.aidla.online" }
        })}</script>
      </Helmet>

      {/* ── ALL CSS — mobile-first, zero overflow ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap');

        /* ── Reset & base ── */
        .ew-root *, .ew-root *::before, .ew-root *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .ew-root {
          /* CRITICAL: contain all overflow inside here */
          overflow-x: hidden;
          max-width: 100vw;
          width: 100%;
        }

        /* ── Page wrapper ── */
        .ew-page {
          min-height: 100vh;
          background: linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }

        /* ── Container ── */
        .ew-wrap {
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
          padding: clamp(20px,5vw,56px) clamp(14px,4vw,28px) 0;
          /* prevent children from escaping */
          overflow-x: hidden;
        }

        /* ── Main grid: single column mobile → 2 col desktop ── */
        .ew-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          width: 100%;
        }
        @media (min-width: 900px) {
          .ew-grid {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }

        /* ── Card ── */
        .ew-card {
          background: rgba(255,255,255,0.92);
          border-radius: 18px;
          border: 1px solid rgba(59,130,246,0.1);
          box-shadow: 0 4px 16px rgba(11,20,55,0.06);
          padding: 16px;
          margin-bottom: 12px;
          width: 100%;
          /* CRITICAL: prevent content from expanding beyond card */
          overflow: hidden;
          word-break: break-word;
          overflow-wrap: anywhere;
        }
        @media (min-width: 640px) { .ew-card { padding: 20px; } }

        /* ── Section label ── */
        .ew-sec {
          font-size: 10px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 12px;
          display: block;
        }

        /* ── Category grid: 2 col always ── */
        .ew-cats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          width: 100%;
        }
        .ew-cat-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1.5px solid rgba(59,130,246,0.1);
          background: #fff;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.18s;
          min-width: 0;
          overflow: hidden;
          width: 100%;
          text-align: left;
        }
        .ew-cat-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(11,20,55,0.08); }
        .ew-cat-btn.active { border-color: var(--cat-color); background: var(--cat-light); box-shadow: 0 4px 14px var(--cat-glow); }
        .ew-cat-label { font-size: 12px; font-weight: 700; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; }
        .ew-cat-btn.active .ew-cat-label { color: var(--cat-color); }
        .ew-cat-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cat-color); flex-shrink: 0; animation: ewPulse 2s ease infinite; }
        @keyframes ewPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

        /* ── Type chips: wrap freely ── */
        .ew-types {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          width: 100%;
        }
        .ew-type {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 11px;
          border-radius: 99px;
          border: 1px solid rgba(59,130,246,0.1);
          background: #fff;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .ew-type:hover { transform: translateY(-1px); }
        .ew-type.active { border-color: var(--cat-color); background: var(--cat-light); color: var(--cat-color); }

        /* ── Tone chips ── */
        .ew-tones { display: flex; flex-wrap: wrap; gap: 7px; width: 100%; }
        .ew-tone {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 6px 11px; border-radius: 99px;
          border: 1px solid rgba(59,130,246,0.1);
          background: #fff; font-size: 12px; font-weight: 700;
          color: #64748b; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.13s; white-space: nowrap;
        }
        .ew-tone.active { border-color: rgba(11,20,55,0.25); background: #0b1437; color: #fff; }

        /* ── Length grid: 3 col ── */
        .ew-lengths {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          width: 100%;
        }
        .ew-len {
          padding: 10px 6px;
          border: 1px solid rgba(59,130,246,0.1);
          border-radius: 10px;
          cursor: pointer;
          background: #fff;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.13s;
        }
        .ew-len.active { border-color: rgba(11,20,55,0.22); background: #f8fafc; box-shadow: 0 2px 8px rgba(11,20,55,0.06); }
        .ew-len-icon { font-size: 15px; margin-bottom: 2px; }
        .ew-len-lbl { font-size: 12px; font-weight: 800; color: #64748b; }
        .ew-len.active .ew-len-lbl { color: #0b1437; }
        .ew-len-sub { font-size: 10px; color: #94a3b8; margin-top: 1px; }

        /* ── People grid: responsive ── */
        .ew-people {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          width: 100%;
        }
        @media (min-width: 480px) { .ew-people { grid-template-columns: 1fr 1fr; } }

        /* ── Form fields ── */
        .ew-label {
          font-size: 11px; font-weight: 700; color: #64748b;
          text-transform: uppercase; letter-spacing: 0.07em;
          display: block; margin-bottom: 5px;
        }
        .ew-input, .ew-textarea, .ew-select {
          width: 100%;
          padding: 10px 13px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #0f172a;
          background: #fff;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s;
          /* prevent overflow */
          max-width: 100%;
          box-sizing: border-box;
          -webkit-appearance: none;
          appearance: none;
        }
        .ew-input::placeholder, .ew-textarea::placeholder { color: rgba(100,116,139,0.45); }
        .ew-input:focus, .ew-textarea:focus, .ew-select:focus {
          border-color: rgba(239,68,68,0.35);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.07);
          outline: none;
        }
        .ew-input:focus-visible, .ew-textarea:focus-visible, .ew-select:focus-visible,
        button:focus-visible {
          outline: 3px solid rgba(239,68,68,0.5);
          outline-offset: 2px;
        }
        .ew-textarea { min-height: 90px; resize: vertical; line-height: 1.65; }
        .ew-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
        }

        /* ── Progress bar ── */
        .ew-prog-wrap { margin-bottom: 11px; }
        .ew-prog-row { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; margin-bottom: 5px; font-weight: 600; }
        .ew-prog-track { height: 4px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
        .ew-prog-bar { height: 100%; border-radius: 99px; transition: width 0.5s ease; }

        /* ── Generate button ── */
        .ew-gen-btn {
          width: 100%;
          padding: 14px 16px;
          border: none;
          border-radius: 14px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          color: #fff;
          /* ensure it doesn't overflow on small screens */
          max-width: 100%;
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ew-gen-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.07); }
        .ew-gen-btn:active:not(:disabled) { transform: none; }
        .ew-gen-btn:disabled { cursor: not-allowed; opacity: 0.65; }

        /* ── Error box ── */
        .ew-error { font-size: 13px; color: #dc2626; background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15); border-radius: 10px; padding: 10px 13px; margin-bottom: 11px; }

        /* ── Result card ── */
        .ew-result-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid rgba(59,130,246,0.1);
          box-shadow: 0 8px 28px rgba(11,20,55,0.08);
          overflow: hidden;
          margin-bottom: 12px;
          width: 100%;
        }
        .ew-result-header {
          padding: 13px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ew-result-meta { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
        .ew-result-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
        .ew-result-btns { display: flex; gap: 6px; flex-wrap: wrap; }
        .ew-result-btn {
          padding: 6px 11px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #fff;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .ew-result-btn:hover { background: #f8fafc; }
        .ew-result-btn.copied { background: rgba(5,150,105,0.08); border-color: rgba(5,150,105,0.25); color: #059669; }
        .ew-result-btn.active-edit { border-color: var(--cat-border,rgba(26,58,143,0.22)); background: var(--cat-light,rgba(26,58,143,0.08)); color: var(--cat-color,#1a3a8f); }

        .ew-section-row { padding: 13px 16px; border-bottom: 1px solid #f8fafc; }
        .ew-body-row { padding: 16px; }

        .ew-pre {
          font-size: 13.5px;
          color: #374151;
          line-height: 1.82;
          white-space: pre-wrap;
          font-family: 'DM Sans', sans-serif;
          margin: 0;
          word-break: break-word;
          overflow-wrap: anywhere;
          /* prevent pre from causing overflow */
          max-width: 100%;
          overflow-x: auto;
        }

        /* ── Send buttons grid ── */
        .ew-send-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          width: 100%;
        }
        .ew-send-btn {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 12px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.18s;
          min-width: 0;
          overflow: hidden;
          width: 100%;
          text-align: left;
        }
        .ew-send-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(11,20,55,0.1); }
        .ew-send-name { font-size: 12px; font-weight: 800; color: #0f172a; }
        .ew-send-sub  { font-size: 10px; color: #94a3b8; }

        /* ── Quick chips for regen ── */
        .ew-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 11px 0; width: 100%; }
        .ew-chip {
          padding: 4px 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.13s;
          white-space: nowrap;
        }
        .ew-chip:hover { background: rgba(26,58,143,0.08); color: #1a3a8f; border-color: rgba(26,58,143,0.2); }

        /* ── Regen btn row ── */
        .ew-regen-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .ew-regen-row.has-clear { grid-template-columns: 1fr auto; }

        .ew-regen-btn {
          width: 100%;
          padding: 12px 14px;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.18s;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ew-regen-btn:disabled { cursor: not-allowed; opacity: 0.55; }
        .ew-clear-btn {
          padding: 12px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 12px;
          color: #94a3b8;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.13s;
        }
        .ew-clear-btn:hover { color: #64748b; background: #f1f5f9; }

        /* ── AI badge ── */
        .ew-ai-badge {
          font-size: 9px; font-weight: 800;
          color: #059669; background: rgba(5,150,105,0.08);
          border: 1px solid rgba(5,150,105,0.2);
          border-radius: 99px; padding: 1px 7px;
          white-space: nowrap; flex-shrink: 0;
        }
        .ew-copy-sub-btn {
          margin-top: 6px; padding: 3px 10px;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 10px; font-weight: 700;
          color: #94a3b8; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.13s;
        }
        .ew-copy-sub-btn.copied { background: rgba(5,150,105,0.07); border-color: rgba(5,150,105,0.2); color: #059669; }

        /* ── Empty state ── */
        .ew-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 340px; text-align: center; padding: 28px 16px;
        }
        @media (min-width: 900px) { .ew-empty { min-height: 480px; } }
        .ew-empty-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: #f8fafc; border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; margin-bottom: 18px;
          animation: ewFloat 3s ease-in-out infinite;
        }
        @keyframes ewFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .ew-feat-list { display: flex; flex-direction: column; gap: 7px; width: 100%; max-width: 320px; margin-top: 22px; }
        .ew-feat-item { display: flex; align-items: center; gap: 9px; padding: 9px 12px; background: #fff; border-radius: 10px; border: 1px solid rgba(59,130,246,0.08); box-shadow: 0 1px 4px rgba(11,20,55,0.04); }
        .ew-feat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .ew-feat-text { font-size: 12px; color: #64748b; font-weight: 600; }

        /* ── CTA banner ── */
        .ew-cta {
          background: linear-gradient(135deg,#0b1437 0%,#1a3a8f 60%,#0b1437 100%);
          border-radius: 28px;
          padding: clamp(24px,5vw,44px) clamp(20px,4vw,40px);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin: 44px 0 0;
          border: 1px solid rgba(245,158,11,0.12);
          box-shadow: 0 16px 40px rgba(11,20,55,0.22);
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        .ew-cta-link {
          padding: 13px 30px;
          background: linear-gradient(135deg,#f59e0b,#fcd34d);
          color: #0b1437;
          border-radius: 99px;
          font-weight: 900;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 5px 20px rgba(245,158,11,0.38);
          white-space: nowrap;
          display: inline-block;
          flex-shrink: 0;
        }
        @media (max-width: 520px) {
          .ew-cta { flex-direction: column; text-align: center; }
          .ew-cta-link { width: 100%; text-align: center; }
        }

        /* ── Hero pills ── */
        .ew-pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; }
        .ew-pill { font-size: 11px; font-weight: 700; color: #475569; background: rgba(255,255,255,0.8); border: 1px solid rgba(11,20,55,0.07); border-radius: 99px; padding: 4px 11px; }

        /* ── Edit form ── */
        .ew-edit-btns { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
        .ew-save-btn { flex: 1; min-width: 100px; padding: 10px 14px; border: none; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; color: #fff; transition: all 0.15s; }
        .ew-cancel-btn { padding: 10px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-weight: 700; font-size: 13px; color: #64748b; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.13s; white-space: nowrap; }
        .ew-cancel-btn:hover { background: #f1f5f9; }

        /* ── Subtle scrollbar ── */
        .ew-root ::-webkit-scrollbar { width: 4px; height: 4px; }
        .ew-root ::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.25); border-radius: 99px; }

        /* ── Top accent line on result card ── */
        .ew-accent-line { height: 3px; width: 100%; }
      `}</style>

      <div className="ew-root">
        <div className="ew-page">

          {/* ── Fixed background ── */}
          <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
            <div style={{ position: "absolute", width: "min(700px,130vw)", height: "min(700px,130vw)", borderRadius: "50%", background: "radial-gradient(circle,rgba(239,68,68,0.07) 0%,transparent 65%)", filter: "blur(60px)", top: "-25%", left: "-15%" }}/>
            <div style={{ position: "absolute", width: "min(500px,110vw)", height: "min(500px,110vw)", borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,0.06) 0%,transparent 70%)", filter: "blur(60px)", top: "30%", right: "-15%" }}/>
            <div style={{ position: "absolute", width: "min(400px,100vw)", height: "min(400px,100vw)", borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 70%)", filter: "blur(60px)", bottom: "-10%", left: "20%" }}/>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(11,20,55,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(11,20,55,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }}/>
          </div>

          <div className="ew-wrap" style={{ position: "relative", zIndex: 1, paddingBottom: "60px" }}>

            {/* ══ HERO ══ */}
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }} style={{ textAlign: "center", marginBottom: 40 }}>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#1a3a8f,#3b82f6)", color: "#fff", padding: "5px 16px", borderRadius: 99, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18, boxShadow: "0 5px 18px rgba(26,58,143,0.28)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.7)", animation: "ewPulse 1.6s ease infinite" }}/>
                ✉️ AI Email Writer — AIDLA AI
              </motion.div>

              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,6vw,3.2rem)", fontWeight: 900, color: "#0b1437", lineHeight: 1.1, marginBottom: 12, letterSpacing: "-0.02em", wordBreak: "break-word" }}>
                Write{" "}
                <span style={{ position: "relative", display: "inline-block" }}>
                  <span style={{ background: "linear-gradient(135deg,#ef4444 20%,#f97316 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>perfect emails</span>
                  <svg style={{ position: "absolute", bottom: -5, left: 0, width: "100%", overflow: "visible" }} height="7" viewBox="0 0 100 7" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 5 Q50 0 100 5" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.45"/>
                  </svg>
                </span>
                {" "}instantly
              </h1>

              <p style={{ fontSize: "clamp(13px,2.5vw,16px)", color: "#475569", maxWidth: 520, margin: "0 auto 18px", lineHeight: 1.75 }}>
                AI crafts your email in seconds — professional, business, personal or academic. Open directly in Gmail, Outlook, or your mail app.
              </p>

              <div className="ew-pills">
                {["✅ 24 email types","✅ 6 tones","✅ 11 languages","✅ Gmail · Outlook · Mail","✅ Regenerate with instructions"].map(p => (
                  <span key={p} className="ew-pill">{p}</span>
                ))}
              </div>
            </motion.div>

            {/* ══ MAIN GRID ══ */}
            <div className="ew-grid">

              {/* ═══ FORM COLUMN ═══ */}
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>

                {/* Category */}
                <div className="ew-card" style={{ "--cat-color": cat?.color, "--cat-light": cat?.light, "--cat-border": cat?.border, "--cat-glow": cat?.light }}>
                  <span className="ew-sec">Email Category</span>
                  <div className="ew-cats">
                    {CATEGORIES.map(c => (
                      <button key={c.id} className={`ew-cat-btn${activeCat === c.id ? " active" : ""}`}
                        style={{ "--cat-color": c.color, "--cat-light": c.light, "--cat-glow": c.light }}
                        onClick={() => { setActiveCat(c.id); setEmailType(c.types[0].id); }}
                        aria-pressed={activeCat === c.id}>
                        <span aria-hidden="true" style={{ fontSize: 17, flexShrink: 0 }}>{c.icon}</span>
                        <span className="ew-cat-label">{c.label}</span>
                        {activeCat === c.id && <span className="ew-cat-dot" aria-hidden="true"/>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div className="ew-card" style={{ "--cat-color": cat?.color, "--cat-light": cat?.light, "--cat-border": cat?.border }}>
                  <span className="ew-sec">Email Type</span>
                  <div className="ew-types" role="group" aria-label="Email type">
                    {cat?.types.map(t => (
                      <button key={t.id} className={`ew-type${emailType === t.id ? " active" : ""}`}
                        style={{ "--cat-color": cat.color, "--cat-light": cat.light }}
                        onClick={() => setEmailType(t.id)}
                        aria-pressed={emailType === t.id}>
                        <span aria-hidden="true">{t.icon}</span> {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone + Length + Language */}
                <div className="ew-card">
                  <div style={{ marginBottom: 16 }}>
                    <span className="ew-sec">Tone</span>
                    <div className="ew-tones" role="group" aria-label="Email tone">
                      {TONES.map(t => (
                        <button key={t.id} className={`ew-tone${tone === t.id ? " active" : ""}`}
                          onClick={() => setTone(t.id)} aria-pressed={tone === t.id}>
                          <span aria-hidden="true">{t.icon}</span> {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <span className="ew-sec">Length</span>
                    <div className="ew-lengths" role="group" aria-label="Email length">
                      {LENGTHS.map(l => (
                        <button key={l.id} className={`ew-len${length === l.id ? " active" : ""}`}
                          onClick={() => setLength(l.id)} aria-pressed={length === l.id}>
                          <div className="ew-len-icon" aria-hidden="true">{l.icon}</div>
                          <div className="ew-len-lbl">{l.label}</div>
                          <div className="ew-len-sub">{l.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ew-lang" className="ew-label">Language</label>
                    <select id="ew-lang" className="ew-select" value={language} onChange={e => setLanguage(e.target.value)}>
                      {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                {/* People */}
                <div className="ew-card">
                  <span className="ew-sec">People</span>
                  <div className="ew-people">
                    <div>
                      <label htmlFor="ew-sender" className="ew-label">Your Name</label>
                      <input id="ew-sender" className="ew-input" value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Ahmed Ali" autoComplete="name"/>
                    </div>
                    <div>
                      <label htmlFor="ew-recip" className="ew-label">Recipient Name</label>
                      <input id="ew-recip" className="ew-input" value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="John Smith"/>
                    </div>
                    <div>
                      <label htmlFor="ew-role" className="ew-label">Recipient Role</label>
                      <input id="ew-role" className="ew-input" value={recipientRole} onChange={e => setRecipientRole(e.target.value)} placeholder="Hiring Manager"/>
                    </div>
                    <div>
                      <label htmlFor="ew-email" className="ew-label">To: Email (optional)</label>
                      <input id="ew-email" className="ew-input" type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} placeholder="john@company.com" autoComplete="email"/>
                    </div>
                  </div>
                </div>

                {/* Context */}
                <div className="ew-card">
                  <label htmlFor="ew-context" className="ew-sec" style={{ display: "block", marginBottom: 5 }}>Context &amp; Key Points</label>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, lineHeight: 1.5 }}>What should the AI include? Specific details, requirements, key points.</p>
                  <textarea id="ew-context" className="ew-textarea" value={context} onChange={e => setContext(e.target.value)}
                    placeholder="e.g. Applying for Senior Frontend Dev. 5 years React. Previously at XYZ Corp. Highlight open-source work..."/>
                </div>

                {/* Error */}
                {error && <div className="ew-error" role="alert">⚠️ {error}</div>}

                {/* Progress */}
                {loading && (
                  <div className="ew-prog-wrap" aria-live="polite" aria-label={`Generating email: ${Math.round(progress)}%`}>
                    <div className="ew-prog-row"><span>✍️ AI is writing your email…</span><span>{Math.round(progress)}%</span></div>
                    <div className="ew-prog-track"><div className="ew-prog-bar" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${cat?.color}88,${cat?.color})`, boxShadow: `0 0 8px ${cat?.color}55` }}/></div>
                  </div>
                )}

                {/* Generate button */}
                <button className="ew-gen-btn" onClick={handleGenerate} disabled={loading || regenLoading}
                  style={{ background: loading ? "#f1f5f9" : `linear-gradient(135deg,${cat?.color},${cat?.color}cc)`, color: loading ? "#94a3b8" : "#fff", boxShadow: loading ? "none" : `0 4px 20px ${cat?.light}` }}
                  aria-label={loading ? "Generating email" : `Write ${cat?.label} email with AI`}>
                  {loading ? "✍️ AI is writing…" : `${cat?.icon}  Write Email with AI`}
                </button>

              </motion.div>

              {/* ═══ RESULT COLUMN ═══ */}
              <div ref={resultRef}>
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div key="result" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}>

                      {/* Email card */}
                      <div className="ew-result-card"
                        style={{ "--cat-color": cat?.color, "--cat-light": cat?.light, "--cat-border": cat?.border }}>
                        <div className="ew-accent-line" style={{ background: `linear-gradient(90deg,${cat?.color},${cat?.color}88,transparent)` }}/>

                        {/* Header */}
                        <div className="ew-result-header">
                          <div className="ew-result-meta">
                            <div className="ew-result-icon" style={{ background: cat?.light, border: `1px solid ${cat?.border}` }} aria-hidden="true">{cat?.icon}</div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: "#0b1437" }}>AI-Generated Email</span>
                                <span className="ew-ai-badge">✨ AI</span>
                              </div>
                              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>
                                {cat?.types.find(t => t.id === emailType)?.label} · {tone} · {length}
                              </div>
                            </div>
                          </div>
                          <div className="ew-result-btns">
                            <button className={`ew-result-btn${copied === "all" ? " copied" : ""}`}
                              onClick={() => copy(`Subject: ${result.subject}\n\n${result.body}`, "all")}
                              aria-label="Copy full email">
                              {copied === "all" ? "✅ Copied!" : "📋 Copy All"}
                            </button>
                            <button className={`ew-result-btn${editMode ? " active-edit" : ""}`}
                              onClick={() => { setEditMode(!editMode); setEditSubject(result.subject); setEditBody(result.body); }}
                              aria-pressed={editMode}>
                              {editMode ? "💾 Editing…" : "✏️ Edit"}
                            </button>
                          </div>
                        </div>

                        {/* Subject */}
                        <div className="ew-section-row">
                          <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Subject</div>
                          {editMode
                            ? <input className="ew-input" value={editSubject} onChange={e => setEditSubject(e.target.value)} style={{ fontWeight: 700 }} aria-label="Email subject"/>
                            : <>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.4, wordBreak: "break-word" }}>{result.subject}</div>
                                <button className={`ew-copy-sub-btn${copied === "subj" ? " copied" : ""}`}
                                  onClick={() => copy(result.subject, "subj")}
                                  aria-label="Copy subject line">
                                  {copied === "subj" ? "✅ Copied" : "📋 Copy subject"}
                                </button>
                              </>
                          }
                        </div>

                        {/* To */}
                        {recipientEmail && (
                          <div className="ew-section-row" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>To</span>
                            <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 600, wordBreak: "break-all" }}>{recipientEmail}</span>
                          </div>
                        )}

                        {/* Body */}
                        <div className="ew-body-row">
                          <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 11 }}>Body</div>
                          {editMode
                            ? <>
                                <textarea className="ew-textarea" value={editBody} onChange={e => setEditBody(e.target.value)} style={{ minHeight: 240 }} aria-label="Email body"/>
                                <div className="ew-edit-btns">
                                  <button className="ew-save-btn" onClick={saveEdit}
                                    style={{ background: `linear-gradient(135deg,${cat?.color},${cat?.color}cc)`, boxShadow: `0 3px 12px ${cat?.light}` }}>
                                    💾 Save Changes
                                  </button>
                                  <button className="ew-cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                                </div>
                              </>
                            : <>
                                <pre className="ew-pre">{result.body}</pre>
                                <button className={`ew-copy-sub-btn${copied === "body" ? " copied" : ""}`}
                                  style={{ marginTop: 11 }}
                                  onClick={() => copy(result.body, "body")}
                                  aria-label="Copy email body">
                                  {copied === "body" ? "✅ Copied" : "📋 Copy body"}
                                </button>
                              </>
                          }
                        </div>
                      </div>

                      {/* Send actions */}
                      <div className="ew-card">
                        <span className="ew-sec">📤 Open &amp; Send Directly</span>
                        <div className="ew-send-grid">

                          <button className="ew-send-btn" onClick={() => openGmail(emailData)} aria-label="Open in Gmail"
                            style={{ background: "rgba(234,67,53,0.05)", borderColor: "rgba(234,67,53,0.2)" }}>
                            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" focusable="false" style={{ flexShrink: 0 }}>
                              <path d="M6 36h6V22.8L6 18v18zm30 0h6V18l-6 4.8V36z" fill="#EA4335"/>
                              <path d="M6 18l18 13.2L42 18 24 6 6 18z" fill="#FBBC05"/>
                              <path d="M6 18l6 4.8V36H6V18zm30 4.8L42 18v18h-6V22.8z" fill="#34A853"/>
                              <path d="M12 22.8L6 18l18 13.2L42 18l-6 4.8L24 31.2 12 22.8z" fill="#4285F4"/>
                            </svg>
                            <div style={{ minWidth: 0 }}><div className="ew-send-name">Gmail</div><div className="ew-send-sub">Open draft</div></div>
                          </button>

                          <button className="ew-send-btn" onClick={() => openOutlook(emailData)} aria-label="Open in Outlook"
                            style={{ background: "rgba(0,120,212,0.05)", borderColor: "rgba(0,120,212,0.2)" }}>
                            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" focusable="false" style={{ flexShrink: 0 }}>
                              <rect width="48" height="48" rx="6" fill="#0078D4"/>
                              <path d="M10 12h16v24H10z" fill="#50D9FF"/>
                              <path d="M10 12l8 12-8 12V12z" fill="rgba(0,0,0,0.15)"/>
                              <path d="M26 12h12v8L26 28V12z" fill="#fff" opacity=".9"/>
                              <path d="M26 28l12-8v16H26V28z" fill="#fff" opacity=".7"/>
                            </svg>
                            <div style={{ minWidth: 0 }}><div className="ew-send-name">Outlook</div><div className="ew-send-sub">Open draft</div></div>
                          </button>

                          <button className="ew-send-btn" onClick={() => openYahoo(emailData)} aria-label="Open in Yahoo Mail"
                            style={{ background: "rgba(99,2,211,0.05)", borderColor: "rgba(99,2,211,0.2)" }}>
                            <div style={{ width: 20, height: 20, borderRadius: 5, background: "#6002d3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#fff", flexShrink: 0 }} aria-hidden="true">Y!</div>
                            <div style={{ minWidth: 0 }}><div className="ew-send-name">Yahoo Mail</div><div className="ew-send-sub">Open draft</div></div>
                          </button>

                          <button className="ew-send-btn" onClick={() => openMailto(emailData)} aria-label="Open in default mail app">
                            <div style={{ width: 20, height: 20, borderRadius: 5, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }} aria-hidden="true">✉️</div>
                            <div style={{ minWidth: 0 }}><div className="ew-send-name">Mail App</div><div className="ew-send-sub">Default app</div></div>
                          </button>
                        </div>
                        {!recipientEmail && <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 9, textAlign: "center" }}>💡 Add recipient email above to pre-fill the To field</p>}
                      </div>

                      {/* Regenerate with instructions */}
                      <div className="ew-card">
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 4 }}>
                          <span aria-hidden="true" style={{ fontSize: 18, flexShrink: 0 }}>🔄</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: "#0b1437" }}>Regenerate with Instructions</div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1, lineHeight: 1.5 }}>Tell the AI what to change — it rewrites keeping the best parts</div>
                          </div>
                        </div>

                        <div className="ew-chips" role="group" aria-label="Quick instruction suggestions">
                          {QUICK_CHIPS.map(chip => (
                            <button key={chip} className="ew-chip"
                              onClick={() => setRegenInstr(prev => prev ? prev + ". " + chip : chip)}
                              aria-label={`Add instruction: ${chip}`}>
                              + {chip}
                            </button>
                          ))}
                        </div>

                        <label htmlFor="ew-regen-instr" className="ew-label">Your Instructions</label>
                        <textarea id="ew-regen-instr" className="ew-textarea"
                          value={regenInstr} onChange={e => setRegenInstr(e.target.value)}
                          placeholder={"Type your instructions or click chips above, e.g.:\n• Make it shorter and more direct\n• Add specific React skills details\n• Translate to Arabic\n• More powerful opening line"}/>

                        {regenError && <div className="ew-error" role="alert" style={{ marginTop: 8 }}>⚠️ {regenError}</div>}

                        {regenLoading && (
                          <div className="ew-prog-wrap" style={{ marginTop: 8 }} aria-live="polite">
                            <div className="ew-prog-row"><span>✍️ Rewriting…</span><span>{Math.round(regenProg)}%</span></div>
                            <div className="ew-prog-track"><div className="ew-prog-bar" style={{ width: `${regenProg}%`, background: `linear-gradient(90deg,${cat?.color}88,${cat?.color})` }}/></div>
                          </div>
                        )}

                        <div className={`ew-regen-row${regenInstr ? " has-clear" : ""}`} style={{ marginTop: 10 }}>
                          <button className="ew-regen-btn" onClick={handleRegen} disabled={regenLoading || loading}
                            style={{ background: regenLoading ? "#f1f5f9" : `linear-gradient(135deg,${cat?.color}99,${cat?.color}66)`, color: regenLoading ? "#94a3b8" : "#fff", boxShadow: regenLoading ? "none" : `0 3px 14px ${cat?.light}` }}>
                            {regenLoading ? "✍️ Rewriting…" : regenInstr.trim() ? "✨ Apply & Rewrite" : "🔄 New Variation"}
                          </button>
                          {regenInstr && <button className="ew-clear-btn" onClick={() => setRegenInstr("")} aria-label="Clear instructions">Clear</button>}
                        </div>
                      </div>

                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="ew-empty">
                        <div className="ew-empty-icon" aria-hidden="true">✉️</div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: "#334155", marginBottom: 7 }}>Your AI email will appear here</div>
                        <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65, maxWidth: 260 }}>Pick a category, fill in the details, and click Write Email with AI.</div>
                        <div className="ew-feat-list" aria-label="Features">
                          {[["📤 Open in Gmail, Outlook, Yahoo or Mail","#2563eb"],["✏️ Edit inline before sending","#7c3aed"],["🔄 Regenerate with custom instructions","#059669"],["🌍 Write in 11 languages","#d97706"]].map(([t, c]) => (
                            <div key={t} className="ew-feat-item">
                              <div className="ew-feat-dot" style={{ background: c }} aria-hidden="true"/>
                              <span className="ew-feat-text">{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ══ CTA BANNER ══ */}
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
              <div className="ew-cta" aria-label="More AIDLA tools">
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(245,158,11,0.5),transparent)", pointerEvents: "none" }} aria-hidden="true"/>
                <div style={{ position: "relative" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 99, padding: "3px 11px", fontSize: 10, fontWeight: 800, color: "#fbbf24", marginBottom: 10 }}>
                    ✨ FREE · NO ACCOUNT NEEDED
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem,4vw,1.8rem)", fontWeight: 900, color: "#fff", marginBottom: 6, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                    More AI Tools by AIDLA
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "clamp(12px,2.5vw,14px)", lineHeight: 1.6, maxWidth: 380 }}>
                    YouTube automation, board results, PDF tools and more — all free.
                  </p>
                </div>
                <a href="/tools" className="ew-cta-link">Explore All Tools ✨</a>
              </div>
            </motion.div>

          </div>

          {/* ── Footer — same as AutoTubePublic ── */}
          <Footer/>
        </div>
      </div>
    </>
  );
}