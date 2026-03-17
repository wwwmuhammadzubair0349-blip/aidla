import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "../../components/footer";

const FORMULAS = {
  mdcat: {
    label:  "MDCAT (Medical)",
    emoji:  "🏥",
    color:  "#dc2626",
    fields: [
      { id:"matric",   label:"Matric Marks",      max:1100, weight:10,  placeholder:"e.g. 1025" },
      { id:"fsc",      label:"FSc Marks",          max:1100, weight:40,  placeholder:"e.g. 1050" },
      { id:"mdcat",    label:"MDCAT Score",        max:200,  weight:50,  placeholder:"e.g. 150"  },
    ],
    note: "Formula: Matric(10%) + FSc(40%) + MDCAT(50%)",
    unis: ["KEMU Lahore","UHS Lahore","AKU Karachi","DUHS Karachi","NUMS Rawalpindi","Bolan Medical Quetta"],
  },
  ecat: {
    label:  "ECAT (Engineering)",
    emoji:  "⚙️",
    color:  "#1a3a8f",
    fields: [
      { id:"matric", label:"Matric Marks", max:1100, weight:10,  placeholder:"e.g. 1025" },
      { id:"fsc",    label:"FSc Marks",    max:1100, weight:40,  placeholder:"e.g. 1050" },
      { id:"ecat",   label:"ECAT Score",   max:400,  weight:50,  placeholder:"e.g. 300"  },
    ],
    note: "Formula: Matric(10%) + FSc(40%) + ECAT(50%)",
    unis: ["UET Lahore","UET Taxila","NUST Islamabad","GIKI","NED Karachi","MUET Jamshoro"],
  },
  nust: {
    label:  "NUST NET",
    emoji:  "🔬",
    color:  "#7c3aed",
    fields: [
      { id:"matric", label:"Matric Marks", max:1100, weight:10,  placeholder:"e.g. 1025" },
      { id:"fsc",    label:"FSc Marks",    max:1100, weight:15,  placeholder:"e.g. 1050" },
      { id:"net",    label:"NET Score",    max:200,  weight:75,  placeholder:"e.g. 160"  },
    ],
    note: "Formula: Matric(10%) + FSc(15%) + NET(75%)",
    unis: ["NUST Islamabad — Main Campus","NUST H-12"],
  },
  agha: {
    label:  "AKU (Aga Khan)",
    emoji:  "🏛️",
    color:  "#d97706",
    fields: [
      { id:"matric", label:"Matric Marks",    max:1100, weight:20,  placeholder:"e.g. 1025" },
      { id:"fsc",    label:"FSc / A-Level",   max:1100, weight:40,  placeholder:"e.g. 1050" },
      { id:"aku",    label:"AKU-EB Score",    max:800,  weight:40,  placeholder:"e.g. 600"  },
    ],
    note: "Formula: Matric(20%) + FSc(40%) + AKU-EB(40%)",
    unis: ["Aga Khan University Karachi"],
  },
};

function calcAggregate(formula, values) {
  let total = 0;
  for (const field of formula.fields) {
    const val = parseFloat(values[field.id]);
    if (isNaN(val) || val < 0) return null;
    if (val > field.max) return null;
    total += (val / field.max) * field.weight;
  }
  return total;
}

export default function MDCATCalculator() {
  const [type,   setType]   = useState("mdcat");
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState("");

  const formula = FORMULAS[type];

  const calculate = () => {
    setError(""); setResult(null);
    for (const f of formula.fields) {
      const v = parseFloat(values[f.id]);
      if (!values[f.id] || isNaN(v)) { setError(`Please enter ${f.label}.`); return; }
      if (v < 0 || v > f.max)        { setError(`${f.label} must be between 0 and ${f.max}.`); return; }
    }
    const agg = calcAggregate(formula, values);
    if (agg === null) { setError("Please check all values."); return; }

    const pct     = agg.toFixed(2);
    let status, statusColor;
    if (agg >= 85) { status="🏆 Excellent — High Chance"; statusColor="#16a34a"; }
    else if (agg >= 75) { status="✅ Good — Eligible";       statusColor="#1a3a8f"; }
    else if (agg >= 65) { status="⚠️ Average — Limited Seats";statusColor="#d97706"; }
    else { status="❌ Below Merit — Try Next Year"; statusColor="#dc2626"; }

    setResult({ pct, status, statusColor });
  };

  const S = {
    page:  { minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" },
    wrap:  { maxWidth:800, margin:"0 auto", padding:"clamp(16px,4vw,32px) clamp(14px,4vw,24px) 60px", width:"100%" },
    card:  { background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,20px)", marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,.04)" },
    label: { fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 },
    input: { width:"100%", padding:"11px 14px", border:"1px solid #e2e8f0", borderRadius:10, fontSize:15, color:"#0f172a", outline:"none", boxSizing:"border-box" },
    btn:   { width:"100%", padding:"13px 0", background:"linear-gradient(135deg,#1a3a8f,#3b82f6)", color:"#fff", border:"none", borderRadius:12, fontWeight:800, fontSize:15, cursor:"pointer" },
  };

  return (
    <>
      <Helmet>
        <title>MDCAT ECAT Aggregate Calculator Pakistan 2025 | AIDLA</title>
        <meta name="description" content="Free MDCAT and ECAT aggregate calculator for Pakistan medical and engineering university admissions. Calculate your merit percentage for UHS, KEMU, UET, NUST, NED and more." />
        <meta name="keywords" content="MDCAT aggregate calculator, ECAT aggregate calculator, UHS merit calculator, UET merit, NUST NET calculator, medical admission Pakistan, engineering admission Pakistan" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.aidla.online/tools/education/mdcat-ecat-calculator" />
      </Helmet>
      <style>{`* { box-sizing: border-box; }`}</style>

      <div style={S.page}>
        <div style={{ background:"#fff", borderBottom:"1px solid #f1f5f9", padding:"10px clamp(14px,4vw,24px)" }}>
          <div style={{ maxWidth:800, margin:"0 auto", fontSize:"clamp(10px,2.5vw,12px)", color:"#94a3b8", display:"flex", gap:6, flexWrap:"wrap" }}>
            <Link to="/tools" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Tools</Link><span>›</span>
            <span style={{ color:"#0f172a", fontWeight:600 }}>MDCAT / ECAT Calculator</span>
          </div>
        </div>

        <div style={{ background:"linear-gradient(135deg,#0b1437,#1a3a8f)", padding:"clamp(24px,5vw,40px) clamp(14px,4vw,24px)", textAlign:"center" }}>
          <div style={{ fontSize:"clamp(28px,7vw,40px)", marginBottom:10 }}>🏥⚙️</div>
          <h1 style={{ margin:"0 0 8px", fontSize:"clamp(1.3rem,5vw,2rem)", fontWeight:900, color:"#fff" }}>MDCAT / ECAT Calculator</h1>
          <p style={{ margin:0, fontSize:"clamp(12px,3vw,15px)", color:"rgba(255,255,255,0.72)" }}>Calculate your aggregate for medical &amp; engineering admissions in Pakistan</p>
        </div>

        <div style={S.wrap}>
          {/* Type selector */}
          <div style={S.card}>
            <span style={S.label}>Select Admission Test</span>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
              {Object.entries(FORMULAS).map(([key, f]) => (
                <button key={key} onClick={()=>{ setType(key); setValues({}); setResult(null); setError(""); }}
                  style={{ padding:"clamp(10px,3vw,14px)", borderRadius:12, border:"1px solid", fontWeight:700, fontSize:"clamp(12px,3vw,14px)", cursor:"pointer", display:"flex", alignItems:"center", gap:8,
                    background: type===key ? `${f.color}15` : "#f8fafc",
                    color:      type===key ? f.color : "#475569",
                    borderColor: type===key ? f.color : "#e2e8f0",
                  }}>
                  <span style={{ fontSize:"clamp(16px,4vw,20px)" }}>{f.emoji}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div style={S.card}>
            <div style={{ fontSize:"clamp(10px,2.5vw,11px)", color:"#94a3b8", background:"rgba(26,58,143,.05)", border:"1px solid rgba(26,58,143,.1)", borderRadius:8, padding:"8px 12px", marginBottom:16 }}>
              📊 {formula.note}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {formula.fields.map(f => (
                <div key={f.id}>
                  <label style={S.label}>
                    {f.label} <span style={{ color:"#94a3b8", fontWeight:400, textTransform:"none" }}>(Max: {f.max} · Weight: {f.weight}%)</span>
                  </label>
                  <input style={S.input} type="number" min="0" max={f.max}
                    value={values[f.id]||""} onChange={e=>setValues(v=>({...v,[f.id]:e.target.value}))}
                    placeholder={f.placeholder}/>
                </div>
              ))}
            </div>
          </div>

          {error && <div style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#dc2626", marginBottom:14 }}>{error}</div>}

          <button style={S.btn} onClick={calculate}>📊 Calculate Aggregate</button>

          {/* Result */}
          {result && (
            <div style={{ marginTop:16 }}>
              <div style={{ ...S.card, textAlign:"center", background:"linear-gradient(135deg,#0b1437,#1a3a8f)", border:"none" }}>
                <div style={{ fontSize:"clamp(11px,3vw,13px)", fontWeight:700, color:"rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Your Aggregate</div>
                <div style={{ fontSize:"clamp(3rem,15vw,5rem)", fontWeight:900, color:"#fff", lineHeight:1 }}>{result.pct}%</div>
                <div style={{ fontSize:"clamp(13px,3.5vw,16px)", fontWeight:700, marginTop:10, color:"#fcd34d" }}>{result.status}</div>
              </div>

              {/* Unis */}
              <div style={S.card}>
                <span style={S.label}>Universities Using This Formula</span>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:4 }}>
                  {formula.unis.map(u => (
                    <span key={u} style={{ fontSize:"clamp(10px,2.5vw,12px)", fontWeight:600, padding:"4px 12px", background:"rgba(26,58,143,.07)", border:"1px solid rgba(26,58,143,.15)", borderRadius:20, color:"#1a3a8f" }}>{u}</span>
                  ))}
                </div>
                <div style={{ marginTop:12, fontSize:"clamp(10px,2.5vw,12px)", color:"#94a3b8", lineHeight:1.6 }}>
                  ⚠️ Merit varies yearly. Always verify exact formula on the official university website before applying.
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div style={S.card}>
            <span style={S.label}>Admission Tips</span>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:4 }}>
              {[
                "Improving FSc marks has the biggest impact (40% weight in most formulas).",
                "MDCAT/ECAT score carries 50% weight — retaking the test can significantly improve your aggregate.",
                "Merit cutoffs vary each year depending on seat availability and applicant pool.",
                "Apply to multiple universities to maximize your chances.",
                "Always double-check the formula on the official university admission portal.",
              ].map((tip, i) => (
                <div key={i} style={{ display:"flex", gap:10, fontSize:"clamp(11px,2.5vw,13px)", color:"#475569", lineHeight:1.6 }}>
                  <span style={{ color:"#1a3a8f", fontWeight:700, flexShrink:0 }}>{i+1}.</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}