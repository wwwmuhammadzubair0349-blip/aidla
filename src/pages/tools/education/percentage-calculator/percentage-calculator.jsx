import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const toNum = (v) => parseFloat(v);
const fmt = (n) => {
  if (isNaN(n) || !isFinite(n)) return null;
  const r = Math.round(n * 10000) / 10000;
  return r % 1 === 0 ? r.toLocaleString() : parseFloat(r.toFixed(4)).toLocaleString();
};

/* ─────────────────────────────────────────────────────────────
   CALCULATOR TABS
───────────────────────────────────────────────────────────── */
const TABS = [
  { id: "marks",    icon: "📝", label: "Marks %",       short: "Marks" },
  { id: "whatpct",  icon: "🔢", label: "X% of Number",  short: "X% of Y" },
  { id: "iswhat",   icon: "❓", label: "X is what % of Y", short: "X of Y" },
  { id: "increase", icon: "📈", label: "% Increase",    short: "Increase" },
  { id: "decrease", icon: "📉", label: "% Decrease",    short: "Decrease" },
  { id: "addpct",   icon: "➕", label: "Add %",          short: "Add %" },
  { id: "subpct",   icon: "➖", label: "Subtract %",     short: "Sub %" },
];

/* ─────────────────────────────────────────────────────────────
   COMPUTE LOGIC
───────────────────────────────────────────────────────────── */
function compute(tab, fields) {
  const [a, b] = [toNum(fields[0]), toNum(fields[1])];
  if (isNaN(a) || isNaN(b)) return null;
  if (b === 0) return null;

  switch (tab) {
    case "marks":    return { value: fmt((a / b) * 100), unit: "%", label: `${fields[0]} out of ${fields[1]}` };
    case "whatpct":  return { value: fmt((a / 100) * b), unit: "",  label: `${fields[0]}% of ${fields[1]}` };
    case "iswhat":   return { value: fmt((a / b) * 100), unit: "%", label: `${fields[0]} out of ${fields[1]}` };
    case "increase": {
      const pct = ((b - a) / a) * 100;
      return { value: fmt(Math.abs(pct)), unit: pct >= 0 ? "% increase" : "% decrease", label: `${fields[0]} → ${fields[1]}` };
    }
    case "decrease": {
      const pct = ((a - b) / a) * 100;
      return { value: fmt(Math.abs(pct)), unit: pct >= 0 ? "% decrease" : "% increase", label: `${fields[0]} → ${fields[1]}` };
    }
    case "addpct":   return { value: fmt(b + (b * a / 100)), unit: "", label: `${fields[1]} + ${fields[0]}%` };
    case "subpct":   return { value: fmt(b - (b * a / 100)), unit: "", label: `${fields[1]} − ${fields[0]}%` };
    default: return null;
  }
}

/* ─────────────────────────────────────────────────────────────
   FIELD CONFIGS PER TAB
───────────────────────────────────────────────────────────── */
const FIELDS = {
  marks:    [{ label: "Marks Obtained", ph: "e.g. 455" }, { label: "Total Marks",    ph: "e.g. 550" }],
  whatpct:  [{ label: "Percentage (%)", ph: "e.g. 25"  }, { label: "Of Number",      ph: "e.g. 200" }],
  iswhat:   [{ label: "Number (X)",     ph: "e.g. 45"  }, { label: "Total (Y)",      ph: "e.g. 180" }],
  increase: [{ label: "Original Value", ph: "e.g. 500" }, { label: "New Value",      ph: "e.g. 650" }],
  decrease: [{ label: "Original Value", ph: "e.g. 800" }, { label: "New Value",      ph: "e.g. 600" }],
  addpct:   [{ label: "Percentage (%)", ph: "e.g. 18"  }, { label: "Base Value",     ph: "e.g. 1000"}],
  subpct:   [{ label: "Percentage (%)", ph: "e.g. 10"  }, { label: "Base Value",     ph: "e.g. 500" }],
};

const EXAMPLES = {
  marks:    "455 ÷ 550 × 100 = 82.73%",
  whatpct:  "25% of 200 = 50",
  iswhat:   "45 out of 180 = 25%",
  increase: "500 → 650 = 30% increase",
  decrease: "800 → 600 = 25% decrease",
  addpct:   "1000 + 18% = 1180",
  subpct:   "500 − 10% = 450",
};

/* ─────────────────────────────────────────────────────────────
   GRADE HELPER
───────────────────────────────────────────────────────────── */
function getGrade(pct) {
  if (pct >= 90) return { grade: "A+", color: "#059669", bg: "rgba(5,150,105,0.1)" };
  if (pct >= 80) return { grade: "A",  color: "#0284c7", bg: "rgba(2,132,199,0.1)" };
  if (pct >= 70) return { grade: "B",  color: "#7c3aed", bg: "rgba(124,58,237,0.1)" };
  if (pct >= 60) return { grade: "C",  color: "#d97706", bg: "rgba(217,119,6,0.1)" };
  if (pct >= 50) return { grade: "D",  color: "#ea580c", bg: "rgba(234,88,12,0.1)" };
  return { grade: "F", color: "#dc2626", bg: "rgba(220,38,38,0.1)" };
}

/* ─────────────────────────────────────────────────────────────
   COPY HOOK
───────────────────────────────────────────────────────────── */
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); }
    catch { const el = document.createElement("textarea"); el.value = text; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function PercentageCalculator() {
  const [activeTab, setActiveTab] = useState("marks");
  const [vals, setVals] = useState(["", ""]);
  const { copied, copy } = useCopy();

  const result = compute(activeTab, vals);
  const isMarksPct = activeTab === "marks" || activeTab === "iswhat";
  const grade = isMarksPct && result ? getGrade(parseFloat(result.value)) : null;

  const handleTabChange = (id) => {
    setActiveTab(id);
    setVals(["", ""]);
  };

  const resultText = result ? `${result.value}${result.unit ? " " + result.unit : ""}` : "";

  return (
    <>
      <Helmet>
        <title>Percentage Calculator — Marks, Increase, Decrease & More | AIDLA</title>
        <meta name="description" content="Free percentage calculator — convert marks to percentage, find percentage increase or decrease, calculate X% of a number, add or subtract percentage. Fast, accurate, mobile-friendly." />
        <meta name="keywords" content="percentage calculator, marks to percentage, percentage increase calculator, percentage decrease, what percent of number, AIDLA percentage tool, Pakistan student calculator" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.aidla.online/tools/education/percentage-calculator" />
        <meta property="og:title" content="Percentage Calculator — Marks, Increase, Decrease & More | AIDLA" />
        <meta property="og:description" content="Convert marks to percentage, calculate percentage increase or decrease, find X% of any number — all in one free tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.aidla.online/tools/education/percentage-calculator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <meta property="og:site_name" content="AIDLA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Percentage Calculator | AIDLA" />
        <meta name="twitter:description" content="Free percentage calculator — marks, increase, decrease, X% of Y and more." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Percentage Calculator by AIDLA",
          "url": "https://www.aidla.online/tools/education/percentage-calculator",
          "description": "Free percentage calculator for students — marks to percentage, increase, decrease and more.",
          "applicationCategory": "EducationApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "publisher": { "@type": "Organization", "name": "AIDLA", "url": "https://www.aidla.online" }
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap');

        .pc-root *, .pc-root *::before, .pc-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pc-root {
          min-height: 100vh;
          background: linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }
        .pc-wrap {
          max-width: 580px;
          margin: 0 auto;
          padding: clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;
          width: 100%;
        }

        /* ── Breadcrumb ── */
        .pc-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; color: #94a3b8;
          margin-bottom: 18px; flex-wrap: wrap;
        }
        .pc-breadcrumb a { color: #94a3b8; text-decoration: none; transition: color 0.13s; }
        .pc-breadcrumb a:hover { color: #1a3a8f; }
        .pc-breadcrumb span { color: #cbd5e1; }

        /* ── Hero ── */
        .pc-hero { text-align: center; margin-bottom: 28px; }
        .pc-hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg,#1a3a8f,#3b82f6);
          color: #fff; padding: 4px 14px; border-radius: 99px;
          font-size: 10px; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 12px;
          box-shadow: 0 4px 14px rgba(26,58,143,0.25);
        }
        .pc-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem,6vw,2.4rem);
          font-weight: 900; color: #0b1437; line-height: 1.15;
          margin-bottom: 8px;
        }
        .pc-hero-accent {
          background: linear-gradient(135deg,#ef4444,#f97316);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pc-hero p {
          font-size: clamp(13px,3vw,15px); color: #64748b;
          line-height: 1.65; max-width: 420px; margin: 0 auto;
        }

        /* ── Tab scroll row ── */
        .pc-tabs-wrap {
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none; margin-bottom: 16px;
          padding-bottom: 2px;
        }
        .pc-tabs-wrap::-webkit-scrollbar { display: none; }
        .pc-tabs {
          display: flex; gap: 6px;
          width: max-content; padding: 2px 1px;
        }
        .pc-tab {
          display: flex; align-items: center; gap: 5px;
          padding: 7px 13px; border-radius: 99px;
          border: 1.5px solid #e2e8f0; background: #fff;
          font-size: 12px; font-weight: 700; color: #64748b;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.15s; white-space: nowrap;
        }
        .pc-tab:hover { border-color: rgba(26,58,143,0.3); color: #1a3a8f; }
        .pc-tab.active {
          background: #0b1437; border-color: #0b1437;
          color: #fff; box-shadow: 0 4px 12px rgba(11,20,55,0.2);
        }

        /* ── Card ── */
        .pc-card {
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(59,130,246,0.1);
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(11,20,55,0.07);
          padding: clamp(18px,4vw,28px);
          margin-bottom: 14px;
        }

        /* ── Example pill ── */
        .pc-example {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(26,58,143,0.06); border: 1px solid rgba(26,58,143,0.12);
          border-radius: 8px; padding: 5px 10px;
          font-size: 11px; font-weight: 700; color: #1a3a8f;
          margin-bottom: 18px;
        }

        /* ── Fields ── */
        .pc-fields { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .pc-field-label {
          display: block; font-size: 11px; font-weight: 800;
          color: #64748b; text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 5px;
        }
        .pc-input {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 16px; font-weight: 700; color: #0b1437;
          background: #fff; outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s;
          -webkit-appearance: none; appearance: none;
        }
        .pc-input:focus {
          border-color: rgba(26,58,143,0.4);
          box-shadow: 0 0 0 3px rgba(26,58,143,0.07);
        }
        .pc-input::placeholder { color: #94a3b8; font-weight: 500; font-size: 14px; }

        /* ── Result ── */
        .pc-result {
          background: linear-gradient(135deg,#0b1437,#1a3a8f);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          margin-top: 4px;
        }
        .pc-result-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
        .pc-result-eq { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
        .pc-result-value {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem,8vw,3rem);
          font-weight: 900; color: #fff; line-height: 1.1;
        }
        .pc-result-unit { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.7); margin-top: 4px; }
        .pc-result-actions { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
        .pc-copy-btn {
          padding: 7px 16px; background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2); border-radius: 99px;
          font-size: 11px; font-weight: 700; color: #fff;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.13s;
        }
        .pc-copy-btn:hover { background: rgba(255,255,255,0.2); }
        .pc-copy-btn.copied { background: rgba(5,150,105,0.3); border-color: rgba(5,150,105,0.5); }

        /* ── Grade badge ── */
        .pc-grade {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 14px; border-radius: 99px; margin-top: 10px;
          font-size: 13px; font-weight: 800;
        }

        /* ── Empty state ── */
        .pc-empty {
          text-align: center; padding: 28px 16px;
          color: #94a3b8; font-size: 13px; line-height: 1.6;
        }
        .pc-empty-icon { font-size: 32px; margin-bottom: 8px; }

        /* ── How it works ── */
        .pc-how { margin-bottom: 14px; }
        .pc-how-title {
          font-size: 11px; font-weight: 800; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
        }
        .pc-how-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 10px 0; border-bottom: 1px solid #f1f5f9;
        }
        .pc-how-item:last-child { border-bottom: none; padding-bottom: 0; }
        .pc-how-num {
          width: 24px; height: 24px; border-radius: 50%;
          background: #0b1437; color: #fff;
          font-size: 10px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }
        .pc-how-text { font-size: 13px; color: #475569; line-height: 1.55; }
        .pc-how-formula {
          display: inline-block; background: #f8faff;
          border: 1px solid rgba(26,58,143,0.12);
          border-radius: 6px; padding: 2px 8px;
          font-size: 12px; font-weight: 700; color: #1a3a8f;
          margin-top: 4px;
        }

        /* ── CTA ── */
        .pc-cta {
          background: linear-gradient(135deg,#0b1437,#1a3a8f);
          border-radius: 20px; padding: 22px 20px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 14px; flex-wrap: wrap;
          border: 1px solid rgba(245,158,11,0.15);
          box-shadow: 0 8px 24px rgba(11,20,55,0.15);
          margin-top: 28px;
        }
        .pc-cta h3 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1rem,4vw,1.3rem); font-weight: 900;
          color: #fff; margin-bottom: 3px;
        }
        .pc-cta p { font-size: 12px; color: rgba(255,255,255,0.6); }
        .pc-cta-btn {
          padding: 10px 22px;
          background: linear-gradient(135deg,#f59e0b,#fcd34d);
          color: #0b1437; border-radius: 99px; font-weight: 900;
          font-size: 13px; text-decoration: none;
          box-shadow: 0 4px 14px rgba(245,158,11,0.35);
          white-space: nowrap; flex-shrink: 0;
          display: inline-block;
        }
        @media (max-width: 420px) {
          .pc-cta { flex-direction: column; text-align: center; }
          .pc-cta-btn { width: 100%; text-align: center; }
        }

        .pc-root ::-webkit-scrollbar { width: 4px; }
        .pc-root ::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.2); border-radius: 99px; }
      `}</style>

      <div className="pc-root">
        <div className="pc-wrap">

          {/* Breadcrumb */}
          <nav className="pc-breadcrumb" aria-label="Breadcrumb">
            <Link to="/tools">Tools</Link>
            <span>›</span>
            <Link to="/tools">Education</Link>
            <span>›</span>
            <span style={{ color: "#475569" }}>Percentage Calculator</span>
          </nav>

          {/* Hero */}
          <motion.div className="pc-hero" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="pc-hero-badge">
              <span>📊</span> Education Tool
            </div>
            <h1>
              <span className="pc-hero-accent">Percentage</span> Calculator
            </h1>
            <p>Marks to %, increase/decrease, add/subtract percentage — 7 calculators in one free tool.</p>
          </motion.div>

          {/* Tabs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>
            <div className="pc-tabs-wrap" role="tablist" aria-label="Percentage calculator types">
              <div className="pc-tabs">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={activeTab === t.id}
                    className={`pc-tab${activeTab === t.id ? " active" : ""}`}
                    onClick={() => handleTabChange(t.id)}
                  >
                    <span aria-hidden="true">{t.icon}</span>
                    <span>{t.short}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Calculator Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div className="pc-card">

                {/* Example */}
                <div className="pc-example">
                  <span aria-hidden="true">💡</span>
                  Example: {EXAMPLES[activeTab]}
                </div>

                {/* Fields */}
                <div className="pc-fields">
                  {FIELDS[activeTab].map((f, i) => (
                    <div key={i}>
                      <label className="pc-field-label" htmlFor={`pc-field-${i}`}>{f.label}</label>
                      <input
                        id={`pc-field-${i}`}
                        className="pc-input"
                        type="number"
                        inputMode="decimal"
                        placeholder={f.ph}
                        value={vals[i]}
                        onChange={e => {
                          const next = [...vals];
                          next[i] = e.target.value;
                          setVals(next);
                        }}
                        aria-label={f.label}
                      />
                    </div>
                  ))}
                </div>

                {/* Result */}
                {result ? (
                  <motion.div
                    className="pc-result"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="pc-result-label">Result</div>
                    <div className="pc-result-eq">{result.label}</div>
                    <div className="pc-result-value">{result.value}</div>
                    {result.unit && <div className="pc-result-unit">{result.unit}</div>}

                    {/* Grade badge for marks/iswhat */}
                    {grade && (
                      <div
                        className="pc-grade"
                        style={{ background: grade.bg, color: grade.color, border: `1px solid ${grade.color}30` }}
                      >
                        <span style={{ fontSize: 16 }}>🎓</span>
                        Grade: <strong>{grade.grade}</strong>
                      </div>
                    )}

                    <div className="pc-result-actions">
                      <button
                        className={`pc-copy-btn${copied ? " copied" : ""}`}
                        onClick={() => copy(resultText)}
                        aria-label="Copy result"
                      >
                        {copied ? "✅ Copied!" : "📋 Copy Result"}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="pc-empty">
                    <div className="pc-empty-icon" aria-hidden="true">📊</div>
                    Enter both values above to see your result
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* How it works */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
            <div className="pc-card pc-how">
              <div className="pc-how-title">📐 Formulas Used</div>

              <div className="pc-how-item">
                <div className="pc-how-num">1</div>
                <div className="pc-how-text">
                  <strong>Marks to Percentage</strong><br />
                  <span className="pc-how-formula">(Obtained ÷ Total) × 100</span>
                </div>
              </div>

              <div className="pc-how-item">
                <div className="pc-how-num">2</div>
                <div className="pc-how-text">
                  <strong>X% of a Number</strong><br />
                  <span className="pc-how-formula">(X ÷ 100) × Number</span>
                </div>
              </div>

              <div className="pc-how-item">
                <div className="pc-how-num">3</div>
                <div className="pc-how-text">
                  <strong>Percentage Increase / Decrease</strong><br />
                  <span className="pc-how-formula">((New − Old) ÷ Old) × 100</span>
                </div>
              </div>

              <div className="pc-how-item">
                <div className="pc-how-num">4</div>
                <div className="pc-how-text">
                  <strong>Add / Subtract Percentage</strong><br />
                  <span className="pc-how-formula">Value ± (Value × % ÷ 100)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38 }}>
            <div className="pc-cta">
              <div>
                <h3>More Free Tools 🚀</h3>
                <p>CGPA Calculator, MDCAT Aggregate, Grade Calculator & 30+ more.</p>
              </div>
              <Link to="/tools" className="pc-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>

        </div>
        <Footer />
      </div>
    </>
  );
}