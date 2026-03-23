import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const CONVERSIONS = [
  { id:"upper",    label:"UPPERCASE",         fn: t => t.toUpperCase() },
  { id:"lower",    label:"lowercase",         fn: t => t.toLowerCase() },
  { id:"title",    label:"Title Case",        fn: t => t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { id:"sentence", label:"Sentence case",     fn: t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() },
  { id:"camel",    label:"camelCase",         fn: t => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_,c) => c.toUpperCase()) },
  { id:"pascal",   label:"PascalCase",        fn: t => t.replace(/\w+/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).replace(/\s+/g,"") },
  { id:"snake",    label:"snake_case",        fn: t => t.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"") },
  { id:"kebab",    label:"kebab-case",        fn: t => t.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"") },
  { id:"alternate",label:"aLtErNaTe CaSe",   fn: t => [...t].map((c,i) => i%2===0 ? c.toLowerCase() : c.toUpperCase()).join("") },
  { id:"reverse",  label:"esreveR",           fn: t => [...t].reverse().join("") },
];

function useCopy() {
  const [copied, setCopied] = useState("");
  const copy = async (text, id) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(id); setTimeout(() => setCopied(""), 2000);
  };
  return { copied, copy };
}

export default function TextCaseConverter() {
  const [input,  setInput]  = useState("");
  const [active, setActive] = useState("upper");
  const { copied, copy }    = useCopy();

  const output = input ? CONVERSIONS.find(c => c.id === active)?.fn(input) || input : "";

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;
  const charNoSpace = input.replace(/\s/g, "").length;
  const lines = input ? input.split(/\n/).length : 0;

  return (
    <>
      <Helmet>
        <title>Text Case Converter — UPPERCASE, lowercase, Title Case & More | AIDLA</title>
        <meta name="description" content="Free text case converter. Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more. Instant, free, no sign-up." />
        <meta name="keywords" content="text case converter, uppercase converter, lowercase converter, title case, camelCase converter, snake_case, kebab-case, text transformer, AIDLA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/utility/text-case-converter" />
        <meta property="og:title" content="Text Case Converter | AIDLA" />
        <meta property="og:description" content="Convert text to UPPERCASE, lowercase, Title Case, camelCase and more." />
        <meta property="og:url" content="https://www.aidla.online/tools/utility/text-case-converter" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Text Case Converter by AIDLA","url":"https://www.aidla.online/tools/utility/text-case-converter",
          "description":"Free text case converter — 10 conversion types including camelCase and snake_case.",
          "applicationCategory":"UtilitiesApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .tcc-root*{box-sizing:border-box;margin:0;padding:0}
        .tcc-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .tcc-wrap{max-width:620px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .tcc-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .tcc-crumb a{color:#94a3b8;text-decoration:none}.tcc-crumb a:hover{color:#1a3a8f}
        .tcc-hero{text-align:center;margin-bottom:24px}
        .tcc-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#1a3a8f,#3b82f6);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(26,58,143,.25)}
        .tcc-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .tcc-accent{background:linear-gradient(135deg,#1a3a8f,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .tcc-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .tcc-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .tcc-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        /* Case buttons */
        .tcc-cases{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:16px}
        .tcc-case-btn{padding:7px 12px;border-radius:99px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;white-space:nowrap}
        .tcc-case-btn:hover{border-color:rgba(26,58,143,.25);color:#1a3a8f}
        .tcc-case-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        /* Textarea */
        .tcc-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .tcc-textarea{width:100%;padding:13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:14px;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;resize:vertical;min-height:100px;line-height:1.65}
        .tcc-textarea:focus{border-color:rgba(26,58,143,.4);box-shadow:0 0 0 3px rgba(26,58,143,.07)}
        .tcc-textarea::placeholder{color:#94a3b8;font-size:13px}
        /* Stats row */
        .tcc-stats{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
        .tcc-stat{font-size:11px;font-weight:700;color:#94a3b8;background:#f8faff;border-radius:6px;padding:3px 8px}
        /* Output */
        .tcc-output-wrap{position:relative}
        .tcc-output{width:100%;padding:13px;border:1.5px solid rgba(26,58,143,.2);border-radius:12px;font-size:14px;color:#0b1437;background:rgba(26,58,143,.03);font-family:'DM Sans',sans-serif;resize:vertical;min-height:100px;line-height:1.65;outline:none}
        .tcc-output-actions{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
        .tcc-action-btn{padding:8px 16px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .tcc-action-btn:hover{background:#f0f4ff;border-color:rgba(26,58,143,.2);color:#1a3a8f}
        .tcc-action-btn.copied{background:rgba(5,150,105,.08);border-color:rgba(5,150,105,.2);color:#059669}
        .tcc-clear-btn{padding:8px 14px;border-radius:10px;border:1.5px solid #fecaca;background:#fff;font-size:12px;font-weight:700;color:#dc2626;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .tcc-clear-btn:hover{background:#fee2e2}
        .tcc-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .tcc-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .tcc-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .tcc-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.tcc-cta{flex-direction:column;text-align:center}.tcc-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="tcc-root">
        <div className="tcc-wrap">
          <nav className="tcc-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Text Case Converter</span></nav>

          <motion.div className="tcc-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="tcc-badge">🔡 Utility Tool</div>
            <h1 className="tcc-h1">Text <span className="tcc-accent">Case</span> Converter</h1>
            <p className="tcc-sub">Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case and 6 more formats.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="tcc-card">
              <span className="tcc-sec">Choose Conversion</span>
              <div className="tcc-cases">
                {CONVERSIONS.map(c=>(
                  <button key={c.id} className={`tcc-case-btn${active===c.id?" active":""}`} onClick={()=>setActive(c.id)}>
                    {c.label}
                  </button>
                ))}
              </div>

              <label className="tcc-label" htmlFor="tcc-input">Your Text</label>
              <textarea
                id="tcc-input"
                className="tcc-textarea"
                placeholder="Type or paste your text here…"
                value={input}
                onChange={e=>setInput(e.target.value)}
              />
              <div className="tcc-stats">
                <span className="tcc-stat">{wordCount} words</span>
                <span className="tcc-stat">{charCount} chars</span>
                <span className="tcc-stat">{charNoSpace} chars (no spaces)</span>
                <span className="tcc-stat">{lines} line{lines !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {output && (
              <motion.div className="tcc-card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.25}}>
                <span className="tcc-sec">Result — {CONVERSIONS.find(c=>c.id===active)?.label}</span>
                <div className="tcc-output-wrap">
                  <textarea
                    className="tcc-output"
                    readOnly
                    value={output}
                    aria-label="Converted text output"
                  />
                </div>
                <div className="tcc-output-actions">
                  <button className={`tcc-action-btn${copied==="out"?" copied":""}`} onClick={()=>copy(output,"out")}>
                    {copied==="out"?"✅ Copied!":"📋 Copy Result"}
                  </button>
                  <button className="tcc-action-btn" onClick={()=>setInput(output)}>↕ Use as Input</button>
                  <button className="tcc-clear-btn" onClick={()=>{setInput("");}} aria-label="Clear input">✕ Clear</button>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="tcc-cta">
              <div><h3>More Utility Tools 🚀</h3><p>Word counter, Unit converter and more.</p></div>
              <Link to="/tools" className="tcc-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}