import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const ROMAN_MAP = [
  [1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],
  [100,"C"],[90,"XC"],[50,"L"],[40,"XL"],
  [10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"],
];

function toRoman(n) {
  if (n < 1 || n > 3999 || !Number.isInteger(n)) return null;
  let result = "";
  for (const [val, sym] of ROMAN_MAP) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}

function fromRoman(s) {
  const str = s.toUpperCase().trim();
  if (!str) return null;
  const vals = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 };
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const cur  = vals[str[i]];
    const next = vals[str[i+1]];
    if (!cur) return null;
    if (next && cur < next) result -= cur;
    else result += cur;
  }
  return result > 0 && result <= 3999 ? result : null;
}

function useCopy() {
  const [copied, setCopied] = useState("");
  const copy = async (text, id) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(id); setTimeout(() => setCopied(""), 2000);
  };
  return { copied, copy };
}

const EXAMPLES = [
  {dec:1,rom:"I"},{dec:4,rom:"IV"},{dec:9,rom:"IX"},{dec:14,rom:"XIV"},
  {dec:40,rom:"XL"},{dec:50,rom:"L"},{dec:90,rom:"XC"},{dec:100,rom:"C"},
  {dec:399,rom:"CCCXCIX"},{dec:400,rom:"CD"},{dec:500,rom:"D"},
  {dec:900,rom:"CM"},{dec:1000,rom:"M"},{dec:2024,rom:"MMXXIV"},
  {dec:1999,rom:"MCMXCIX"},{dec:3999,rom:"MMMCMXCIX"},
];

export default function RomanNumeralConverter() {
  const [mode,    setMode]    = useState("to");   // to = decimal→roman, from = roman→decimal
  const [decVal,  setDecVal]  = useState("");
  const [romVal,  setRomVal]  = useState("");
  const { copied, copy }      = useCopy();

  const romanResult  = decVal  ? toRoman(parseInt(decVal))   : null;
  const decimalResult = romVal ? fromRoman(romVal)            : null;

  return (
    <>
      <Helmet>
        <title>Roman Numeral Converter — Decimal to Roman & Back | AIDLA</title>
        <meta name="description" content="Free Roman numeral converter. Convert decimal numbers to Roman numerals and Roman numerals to decimal. Supports 1 to 3999. Instant, accurate, mobile-friendly." />
        <meta name="keywords" content="roman numeral converter, decimal to roman, roman to decimal, roman numerals, MDCXLIV converter, AIDLA roman numerals" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/utility/roman-numeral-converter" />
        <meta property="og:title" content="Roman Numeral Converter | AIDLA" />
        <meta property="og:description" content="Convert decimal numbers to Roman numerals and back instantly." />
        <meta property="og:url" content="https://www.aidla.online/tools/utility/roman-numeral-converter" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Roman Numeral Converter by AIDLA","url":"https://www.aidla.online/tools/utility/roman-numeral-converter",
          "description":"Free Roman numeral converter — decimal to Roman and Roman to decimal.",
          "applicationCategory":"EducationApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .rn-root*{box-sizing:border-box;margin:0;padding:0}
        .rn-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .rn-wrap{max-width:560px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .rn-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .rn-crumb a{color:#94a3b8;text-decoration:none}.rn-crumb a:hover{color:#1a3a8f}
        .rn-hero{text-align:center;margin-bottom:24px}
        .rn-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#d97706,#92400e);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(217,119,6,.25)}
        .rn-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .rn-accent{background:linear-gradient(135deg,#d97706,#92400e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .rn-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .rn-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .rn-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .rn-mode-toggle{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
        .rn-mode-btn{padding:11px 8px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;text-align:center}
        .rn-mode-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .rn-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .rn-input{width:100%;padding:12px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:18px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none;letter-spacing:.05em}
        .rn-input:focus{border-color:rgba(217,119,6,.4);box-shadow:0 0 0 3px rgba(217,119,6,.07)}
        .rn-input::placeholder{color:#94a3b8;font-weight:500;font-size:14px}
        /* Result */
        .rn-result{background:linear-gradient(135deg,#0b1437,#92400e);border-radius:16px;padding:22px 20px;text-align:center;margin-top:14px}
        .rn-result-lbl{font-size:11px;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
        .rn-result-val{font-family:'Playfair Display',serif;font-size:clamp(2rem,9vw,3.2rem);font-weight:900;color:#fff;line-height:1;word-break:break-all;letter-spacing:.05em}
        .rn-copy-btn{margin-top:12px;padding:7px 16px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:99px;font-size:11px;font-weight:700;color:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .rn-copy-btn:hover{background:rgba(255,255,255,.2)}
        .rn-copy-btn.copied{background:rgba(5,150,105,.3);border-color:rgba(5,150,105,.5)}
        .rn-error{font-size:12px;color:#dc2626;background:rgba(220,38,38,.06);border:1px solid rgba(220,38,38,.15);border-radius:10px;padding:10px 13px;margin-top:12px}
        /* Symbol table */
        .rn-sym-table{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:4px}
        .rn-sym{padding:9px 6px;background:#f8faff;border:1px solid rgba(59,130,246,.1);border-radius:10px;text-align:center}
        .rn-sym-roman{font-family:'Playfair Display',serif;font-size:16px;font-weight:900;color:#0b1437}
        .rn-sym-dec{font-size:10px;font-weight:700;color:#94a3b8;margin-top:2px}
        /* Examples */
        .rn-examples{display:flex;flex-wrap:wrap;gap:6px}
        .rn-ex{padding:5px 10px;background:#fff;border:1.5px solid #e2e8f0;border-radius:8px;font-size:11px;font-weight:700;color:#475569;cursor:pointer;transition:all .13s;display:flex;align-items:center;gap:5px}
        .rn-ex:hover{border-color:rgba(217,119,6,.3);color:#d97706;background:rgba(217,119,6,.04)}
        .rn-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .rn-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .rn-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .rn-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.rn-sym-table{grid-template-columns:repeat(4,1fr)}.rn-cta{flex-direction:column;text-align:center}.rn-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="rn-root">
        <div className="rn-wrap">
          <nav className="rn-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Roman Numeral Converter</span></nav>

          <motion.div className="rn-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="rn-badge">🏛️ History Tool</div>
            <h1 className="rn-h1"><span className="rn-accent">Roman Numeral</span> Converter</h1>
            <p className="rn-sub">Convert decimal numbers to Roman numerals and back instantly. Range: 1 to 3,999.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="rn-card">
              <span className="rn-sec">Mode</span>
              <div className="rn-mode-toggle">
                <button className={`rn-mode-btn${mode==="to"?" active":""}`} onClick={()=>setMode("to")}>🔢 → 🏛️ Decimal → Roman</button>
                <button className={`rn-mode-btn${mode==="from"?" active":""}`} onClick={()=>setMode("from")}>🏛️ → 🔢 Roman → Decimal</button>
              </div>

              {mode === "to" ? (
                <>
                  <label className="rn-label">Decimal Number (1–3999)</label>
                  <input className="rn-input" type="number" inputMode="numeric" min={1} max={3999}
                    placeholder="e.g. 2024" value={decVal} onChange={e=>setDecVal(e.target.value)} />
                  {decVal && !romanResult && <div className="rn-error">⚠️ Enter a whole number between 1 and 3999</div>}
                  {romanResult && (
                    <motion.div className="rn-result" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.2}}>
                      <div className="rn-result-lbl">Roman Numeral</div>
                      <div className="rn-result-val">{romanResult}</div>
                      <button className={`rn-copy-btn${copied==="rom"?" copied":""}`} onClick={()=>copy(romanResult,"rom")}>
                        {copied==="rom"?"✅ Copied":"📋 Copy"}
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <>
                  <label className="rn-label">Roman Numeral</label>
                  <input className="rn-input" type="text" placeholder="e.g. MMXXIV"
                    value={romVal} onChange={e=>setRomVal(e.target.value.toUpperCase())}
                    autoCapitalize="characters" spellCheck="false" />
                  {romVal && !decimalResult && <div className="rn-error">⚠️ Enter a valid Roman numeral (e.g. XIV, MMXXIV)</div>}
                  {decimalResult && (
                    <motion.div className="rn-result" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.2}}>
                      <div className="rn-result-lbl">Decimal Number</div>
                      <div className="rn-result-val">{decimalResult.toLocaleString()}</div>
                      <button className={`rn-copy-btn${copied==="dec"?" copied":""}`} onClick={()=>copy(String(decimalResult),"dec")}>
                        {copied==="dec"?"✅ Copied":"📋 Copy"}
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Quick examples */}
            <div className="rn-card">
              <span className="rn-sec">Quick Examples</span>
              <div className="rn-examples">
                {EXAMPLES.map(e=>(
                  <button key={e.dec} className="rn-ex"
                    onClick={()=>{
                      if(mode==="to"){setDecVal(String(e.dec));}
                      else{setRomVal(e.rom);}
                    }}>
                    <span style={{color:"#94a3b8"}}>{e.dec}</span>
                    <span>→</span>
                    <span style={{fontFamily:"Georgia,serif"}}>{e.rom}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Symbol reference */}
            <div className="rn-card">
              <span className="rn-sec">Roman Numeral Symbols</span>
              <div className="rn-sym-table">
                {[{r:"I",d:1},{r:"V",d:5},{r:"X",d:10},{r:"L",d:50},{r:"C",d:100},{r:"D",d:500},{r:"M",d:1000},
                  {r:"IV",d:4},{r:"IX",d:9},{r:"XL",d:40},{r:"XC",d:90},{r:"CD",d:400}].map(s=>(
                  <div key={s.r} className="rn-sym">
                    <div className="rn-sym-roman">{s.r}</div>
                    <div className="rn-sym-dec">{s.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="rn-cta">
              <div><h3>More Utility Tools 🚀</h3><p>Binary converter, Unit converter and more.</p></div>
              <Link to="/tools" className="rn-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}