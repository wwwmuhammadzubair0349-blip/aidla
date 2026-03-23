import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const MODES = [
  { id:"change",    icon:"📊", label:"% Change",          desc:"How much did a value change?" },
  { id:"new",       icon:"➕", label:"Find New Value",     desc:"Original + percentage = what?" },
  { id:"original",  icon:"🔍", label:"Find Original",     desc:"Know the new value & change?" },
  { id:"difference",icon:"↔️", label:"% Difference",      desc:"Compare two values (no direction)" },
  { id:"error",     icon:"🎯", label:"% Error",           desc:"Approximate vs exact value" },
];

function compute(mode, a, b) {
  const va = parseFloat(a), vb = parseFloat(b);
  if (isNaN(va) || isNaN(vb) || vb === 0) return null;
  switch(mode) {
    case "change":
      { const pct = ((vb - va) / Math.abs(va)) * 100;
        return { value: Math.abs(pct).toFixed(4), dir: pct >= 0 ? "increase" : "decrease", color: pct >= 0 ? "#059669" : "#dc2626", icon: pct >= 0 ? "📈" : "📉" }; }
    case "new":
      { const result = va * (1 + vb/100);
        return { value: result.toFixed(4), dir: vb >= 0 ? "result (increased)" : "result (decreased)", color: "#0284c7", icon: "🔢" }; }
    case "original":
      { const orig = va / (1 + vb/100);
        return { value: orig.toFixed(4), dir: "original value", color: "#7c3aed", icon: "🔍" }; }
    case "difference":
      { const diff = (Math.abs(vb - va) / ((Math.abs(va) + Math.abs(vb)) / 2)) * 100;
        return { value: diff.toFixed(4), dir: "difference", color: "#d97706", icon: "↔️" }; }
    case "error":
      { const err = (Math.abs(va - vb) / Math.abs(vb)) * 100;
        return { value: err.toFixed(4), dir: "error", color: "#dc2626", icon: "🎯" }; }
    default: return null;
  }
}

const FIELD_CONFIG = {
  change:     [{ label:"Original Value",   ph:"e.g. 500"  }, { label:"New Value",            ph:"e.g. 650"  }],
  new:        [{ label:"Original Value",   ph:"e.g. 200"  }, { label:"Percentage Change (%)", ph:"e.g. 15"   }],
  original:   [{ label:"New Value",        ph:"e.g. 230"  }, { label:"Percentage Change (%)", ph:"e.g. 15"   }],
  difference: [{ label:"Value A",          ph:"e.g. 100"  }, { label:"Value B",               ph:"e.g. 120"  }],
  error:      [{ label:"Approx. Value",    ph:"e.g. 9.5"  }, { label:"Exact Value",           ph:"e.g. 10"   }],
};

function useCopy(){
  const [copied,setCopied]=useState(false);
  const copy=async(t)=>{try{await navigator.clipboard.writeText(t);}catch{}setCopied(true);setTimeout(()=>setCopied(false),2000);};
  return{copied,copy};
}

export default function PercentageChange() {
  const [mode,  setMode]  = useState("change");
  const [vals,  setVals]  = useState(["",""]);
  const { copied, copy }  = useCopy();

  const result = compute(mode, vals[0], vals[1]);
  const fields = FIELD_CONFIG[mode];

  const handleMode = (m) => { setMode(m); setVals(["",""]); };

  return (
    <>
      <Helmet>
        <title>Percentage Change Calculator — Increase, Decrease & Difference | AIDLA</title>
        <meta name="description" content="Free percentage change calculator. Calculate percentage increase, decrease, difference, error and find new or original values. Fast, accurate, mobile-friendly." />
        <meta name="keywords" content="percentage change calculator, percentage increase, percentage decrease, percentage difference, percentage error, AIDLA percentage change" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/utility/percentage-change" />
        <meta property="og:title" content="Percentage Change Calculator | AIDLA" />
        <meta property="og:description" content="Calculate percentage increase, decrease, difference and error instantly." />
        <meta property="og:url" content="https://www.aidla.online/tools/utility/percentage-change" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Percentage Change Calculator by AIDLA","url":"https://www.aidla.online/tools/utility/percentage-change",
          "description":"Free percentage change, increase, decrease, difference and error calculator.",
          "applicationCategory":"UtilitiesApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .pch-root*{box-sizing:border-box;margin:0;padding:0}
        .pch-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .pch-wrap{max-width:560px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .pch-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .pch-crumb a{color:#94a3b8;text-decoration:none}.pch-crumb a:hover{color:#1a3a8f}
        .pch-hero{text-align:center;margin-bottom:24px}
        .pch-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#1a3a8f,#3b82f6);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(26,58,143,.25)}
        .pch-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .pch-accent{background:linear-gradient(135deg,#ef4444,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .pch-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .pch-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .pch-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .pch-modes{display:flex;flex-direction:column;gap:7px;margin-bottom:4px}
        .pch-mode-btn{display:flex;align-items:center;gap:10px;padding:11px 13px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:left;width:100%}
        .pch-mode-btn.active{border-color:rgba(26,58,143,.3);background:rgba(26,58,143,.05)}
        .pch-mode-icon{font-size:18px;flex-shrink:0;width:28px;text-align:center}
        .pch-mode-title{font-size:13px;font-weight:800;color:#0b1437}
        .pch-mode-desc{font-size:11px;color:#94a3b8;margin-top:1px}
        .pch-mode-dot{width:8px;height:8px;border-radius:50%;background:#e2e8f0;flex-shrink:0;margin-left:auto;transition:background .13s}
        .pch-mode-btn.active .pch-mode-dot{background:#1a3a8f}
        .pch-fields{display:flex;flex-direction:column;gap:11px}
        .pch-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .pch-input{width:100%;padding:12px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .pch-input:focus{border-color:rgba(26,58,143,.4);box-shadow:0 0 0 3px rgba(26,58,143,.07)}
        .pch-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .pch-result{border-radius:20px;padding:24px 20px;text-align:center;margin-bottom:14px}
        .pch-result-lbl{font-size:11px;font-weight:700;color:rgba(255,255,255,.65);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
        .pch-result-val{font-family:'Playfair Display',serif;font-size:clamp(2.5rem,10vw,3.5rem);font-weight:900;color:#fff;line-height:1}
        .pch-result-dir{font-size:14px;font-weight:700;color:rgba(255,255,255,.75);margin-top:8px}
        .pch-result-icon{font-size:28px;margin-bottom:6px}
        .pch-copy-btn{margin-top:12px;padding:7px 16px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:99px;font-size:11px;font-weight:700;color:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .pch-copy-btn:hover{background:rgba(255,255,255,.2)}
        .pch-copy-btn.copied{background:rgba(5,150,105,.3);border-color:rgba(5,150,105,.5)}
        .pch-formula{background:rgba(26,58,143,.06);border:1px solid rgba(26,58,143,.12);border-radius:12px;padding:12px 14px;font-size:12px;color:#1a3a8f;line-height:1.7}
        .pch-formula code{font-family:'Courier New',monospace;background:rgba(26,58,143,.08);padding:1px 5px;border-radius:4px;font-size:11px}
        .pch-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .pch-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .pch-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .pch-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.pch-cta{flex-direction:column;text-align:center}.pch-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="pch-root">
        <div className="pch-wrap">
          <nav className="pch-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Percentage Change</span></nav>

          <motion.div className="pch-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="pch-badge">📊 Utility Tool</div>
            <h1 className="pch-h1">Percentage <span className="pch-accent">Change</span></h1>
            <p className="pch-sub">Calculate percentage increase, decrease, difference, error and more — 5 calculators in one.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="pch-card">
              <span className="pch-sec">Calculator Type</span>
              <div className="pch-modes">
                {MODES.map(m=>(
                  <button key={m.id} className={`pch-mode-btn${mode===m.id?" active":""}`} onClick={()=>handleMode(m.id)}>
                    <span className="pch-mode-icon">{m.icon}</span>
                    <div><div className="pch-mode-title">{m.label}</div><div className="pch-mode-desc">{m.desc}</div></div>
                    <div className="pch-mode-dot"/>
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.18}}>
                <div className="pch-card">
                  <span className="pch-sec">Enter Values</span>
                  <div className="pch-fields">
                    {fields.map((f,i)=>(
                      <div key={i}>
                        <label className="pch-label">{f.label}</label>
                        <input className="pch-input" type="number" inputMode="decimal" placeholder={f.ph}
                          value={vals[i]} onChange={e=>{const n=[...vals];n[i]=e.target.value;setVals(n);}} />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div key="result" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="pch-result" style={{background:`linear-gradient(135deg,#0b1437,${result.color}99)`}}>
                  <div className="pch-result-icon">{result.icon}</div>
                  <div className="pch-result-lbl">Result</div>
                  <div className="pch-result-val">{parseFloat(result.value).toFixed(2)}%</div>
                  <div className="pch-result-dir">{result.dir}</div>
                  <button className={`pch-copy-btn${copied?" copied":""}`} onClick={()=>copy(`${parseFloat(result.value).toFixed(2)}% ${result.dir}`)}>
                    {copied?"✅ Copied":"📋 Copy Result"}
                  </button>
                </div>

                <div className="pch-formula">
                  {mode==="change" && <span>📐 Formula: <code>((New − Old) ÷ |Old|) × 100</code></span>}
                  {mode==="new" && <span>📐 Formula: <code>Original × (1 + % ÷ 100)</code></span>}
                  {mode==="original" && <span>📐 Formula: <code>New Value ÷ (1 + % ÷ 100)</code></span>}
                  {mode==="difference" && <span>📐 Formula: <code>|A − B| ÷ ((|A| + |B|) ÷ 2) × 100</code></span>}
                  {mode==="error" && <span>📐 Formula: <code>|Approx − Exact| ÷ |Exact| × 100</code></span>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="pch-cta">
              <div><h3>More Utility Tools 🚀</h3><p>Percentage calculator, Unit converter and more.</p></div>
              <Link to="/tools" className="pch-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}