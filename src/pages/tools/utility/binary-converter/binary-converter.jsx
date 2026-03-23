import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const BASES = [
  { id: "decimal", label: "Decimal",     base: 10, prefix: "",   placeholder: "e.g. 255",      color: "#1a3a8f" },
  { id: "binary",  label: "Binary",      base: 2,  prefix: "0b", placeholder: "e.g. 11111111", color: "#059669" },
  { id: "octal",   label: "Octal",       base: 8,  prefix: "0o", placeholder: "e.g. 377",      color: "#d97706" },
  { id: "hex",     label: "Hexadecimal", base: 16, prefix: "0x", placeholder: "e.g. FF",       color: "#7c3aed" },
];

function convert(value, fromBase) {
  if (!value || value.trim() === "") return null;
  const clean = value.trim().replace(/^0[bBoOxX]/, "");
  const num = parseInt(clean, fromBase);
  if (isNaN(num)) return null;
  return {
    decimal: num.toString(10),
    binary:  num.toString(2),
    octal:   num.toString(8),
    hex:     num.toString(16).toUpperCase(),
  };
}

function useCopy() {
  const [copied, setCopied] = useState("");
  const copy = async (text, id) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(id); setTimeout(() => setCopied(""), 2000);
  };
  return { copied, copy };
}

export default function BinaryConverter() {
  const [activeBase, setActiveBase] = useState("decimal");
  const [value, setValue] = useState("");
  const { copied, copy } = useCopy();

  const fromBase = BASES.find(b => b.id === activeBase)?.base || 10;
  const result   = convert(value, fromBase);

  const VALID = { decimal: /^[0-9]*$/, binary: /^[01]*$/, octal: /^[0-7]*$/, hex: /^[0-9a-fA-F]*$/ };

  const handleChange = (val) => {
    if (!val || VALID[activeBase].test(val.replace(/^0[bBoOxX]/, ""))) setValue(val);
  };

  return (
    <>
      <Helmet>
        <title>Binary Converter — Decimal, Binary, Octal, Hexadecimal | AIDLA</title>
        <meta name="description" content="Free binary converter. Convert between decimal, binary, octal and hexadecimal instantly. Perfect for computer science students and programmers." />
        <meta name="keywords" content="binary converter, decimal to binary, binary to decimal, hexadecimal converter, octal converter, number system converter, AIDLA binary" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/utility/binary-converter" />
        <meta property="og:title" content="Binary Converter | AIDLA" />
        <meta property="og:description" content="Convert between decimal, binary, octal and hexadecimal instantly." />
        <meta property="og:url" content="https://www.aidla.online/tools/utility/binary-converter" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Binary Converter by AIDLA","url":"https://www.aidla.online/tools/utility/binary-converter",
          "description":"Free number system converter — decimal, binary, octal, hexadecimal.",
          "applicationCategory":"EducationApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .bc-root*{box-sizing:border-box;margin:0;padding:0}
        .bc-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .bc-wrap{max-width:560px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .bc-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .bc-crumb a{color:#94a3b8;text-decoration:none}.bc-crumb a:hover{color:#1a3a8f}
        .bc-hero{text-align:center;margin-bottom:24px}
        .bc-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(5,150,105,.25)}
        .bc-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .bc-accent{background:linear-gradient(135deg,#059669,#1a3a8f);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .bc-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .bc-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .bc-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .bc-bases{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:16px}
        .bc-base-btn{padding:9px 4px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:11px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:center}
        .bc-base-btn.active{color:#fff;border-color:transparent}
        .bc-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .bc-input{width:100%;padding:12px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'Courier New',monospace;transition:border-color .15s;-webkit-appearance:none;letter-spacing:.05em}
        .bc-input:focus{border-color:rgba(5,150,105,.4);box-shadow:0 0 0 3px rgba(5,150,105,.07)}
        .bc-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px;font-family:'DM Sans',sans-serif}
        /* Result cards */
        .bc-results{display:flex;flex-direction:column;gap:10px;margin-bottom:14px}
        .bc-result-item{padding:14px 16px;border-radius:14px;border:1.5px solid #e2e8f0;background:#fff;position:relative}
        .bc-result-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px}
        .bc-result-label{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}
        .bc-copy-btn{padding:4px 10px;border-radius:6px;border:1px solid #e2e8f0;background:#f8faff;font-size:10px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .bc-copy-btn:hover{background:#f0f4ff;color:#1a3a8f}
        .bc-copy-btn.copied{background:rgba(5,150,105,.08);border-color:rgba(5,150,105,.2);color:#059669}
        .bc-result-value{font-family:'Courier New',monospace;font-size:clamp(13px,3vw,16px);font-weight:700;color:#0b1437;word-break:break-all;line-height:1.6;letter-spacing:.05em}
        /* Formula cards */
        .bc-formulas{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
        .bc-formula{padding:12px 13px;border-radius:14px;background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1)}
        .bc-formula-title{font-size:11px;font-weight:800;color:#64748b;margin-bottom:5px}
        .bc-formula-code{font-family:'Courier New',monospace;font-size:11px;color:#0b1437;line-height:1.6;background:#f8faff;border-radius:6px;padding:5px 8px}
        .bc-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .bc-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .bc-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .bc-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.bc-formulas{grid-template-columns:1fr}.bc-cta{flex-direction:column;text-align:center}.bc-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="bc-root">
        <div className="bc-wrap">
          <nav className="bc-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Binary Converter</span></nav>

          <motion.div className="bc-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="bc-badge">💻 CS Tool</div>
            <h1 className="bc-h1"><span className="bc-accent">Binary</span> Converter</h1>
            <p className="bc-sub">Convert between decimal, binary, octal and hexadecimal number systems instantly.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="bc-card">
              <span className="bc-sec">Convert From</span>
              <div className="bc-bases">
                {BASES.map(b=>(
                  <button key={b.id}
                    className={`bc-base-btn${activeBase===b.id?" active":""}`}
                    style={activeBase===b.id?{background:b.color}:{}}
                    onClick={()=>{setActiveBase(b.id);setValue("");}}>
                    {b.label}
                  </button>
                ))}
              </div>
              <label className="bc-label">
                Enter {BASES.find(b=>b.id===activeBase)?.label} Value
              </label>
              <input
                className="bc-input"
                type="text"
                inputMode={activeBase==="decimal"?"numeric":"text"}
                placeholder={BASES.find(b=>b.id===activeBase)?.placeholder}
                value={value}
                onChange={e=>handleChange(e.target.value)}
                autoCapitalize="characters"
                spellCheck="false"
              />
            </div>
          </motion.div>

          {result && (
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.3}}>
              <div className="bc-results">
                {BASES.map(b=>{
                  const val = result[b.id];
                  const display = b.prefix + val;
                  return (
                    <div key={b.id} className="bc-result-item" style={{borderColor:`${b.color}25`}}>
                      <div className="bc-result-header">
                        <span className="bc-result-label" style={{color:b.color}}>{b.label} (Base {b.base})</span>
                        <button className={`bc-copy-btn${copied===b.id?" copied":""}`} onClick={()=>copy(display,b.id)}>
                          {copied===b.id?"✅ Copied":"📋 Copy"}
                        </button>
                      </div>
                      <div className="bc-result-value">{display}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Quick reference */}
          <div className="bc-card">
            <span className="bc-sec">Quick Reference</span>
            <div className="bc-formulas">
              {[
                {title:"Decimal → Binary",code:"255 → 11111111\n10 → 1010"},
                {title:"Binary → Decimal",code:"1010 → 10\n11111111 → 255"},
                {title:"Decimal → Hex",code:"255 → FF\n16 → 10"},
                {title:"Hex → Decimal",code:"FF → 255\n1A → 26"},
              ].map(f=>(
                <div key={f.title} className="bc-formula">
                  <div className="bc-formula-title">{f.title}</div>
                  <pre className="bc-formula-code">{f.code}</pre>
                </div>
              ))}
            </div>
          </div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="bc-cta">
              <div><h3>More Utility Tools 🚀</h3><p>Unit converter, Roman numeral converter and more.</p></div>
              <Link to="/tools" className="bc-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}