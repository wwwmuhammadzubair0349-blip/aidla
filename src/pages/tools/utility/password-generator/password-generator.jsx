import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const UPPER  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER  = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMS   = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generate(len, opts) {
  let pool = "";
  if (opts.upper)   pool += UPPER;
  if (opts.lower)   pool += LOWER;
  if (opts.digits)  pool += DIGITS;
  if (opts.symbols) pool += SYMS;
  if (!pool) pool = LOWER + DIGITS;
  let pwd = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) pwd += pool[arr[i] % pool.length];
  return pwd;
}

function strength(pwd) {
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd))    score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { label: "Weak",    color: "#dc2626", bars: 1 };
  if (score <= 4) return { label: "Fair",    color: "#d97706", bars: 2 };
  if (score <= 5) return { label: "Good",    color: "#0284c7", bars: 3 };
  return               { label: "Strong",  color: "#059669", bars: 4 };
}

export default function PasswordGenerator() {
  const [length,  setLength]  = useState(16);
  const [opts,    setOpts]    = useState({ upper: true, lower: true, digits: true, symbols: true });
  const [pwd,     setPwd]     = useState(() => generate(16, { upper: true, lower: true, digits: true, symbols: true }));
  const [copied,  setCopied]  = useState(false);
  const [count,   setCount]   = useState(1);
  const [multis,  setMultis]  = useState([]);

  const toggle = (key) => setOpts(p => ({ ...p, [key]: !p[key] }));

  const regen = useCallback(() => {
    setPwd(generate(length, opts));
    setCopied(false);
  }, [length, opts]);

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); }
    catch { const el = document.createElement("textarea"); el.value = text; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const genMulti = () => {
    const arr = Array.from({ length: count }, () => generate(length, opts));
    setMultis(arr);
  };

  const str = strength(pwd);

  return (
    <>
      <Helmet>
        <title>Password Generator — Strong & Secure Random Passwords | AIDLA</title>
        <meta name="description" content="Free password generator. Generate strong, random, secure passwords instantly. Choose length, uppercase, lowercase, numbers and symbols. Generate multiple passwords at once." />
        <meta name="keywords" content="password generator, strong password, secure password generator, random password, online password maker, AIDLA password tool" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/utility/password-generator" />
        <meta property="og:title" content="Password Generator | AIDLA" />
        <meta property="og:description" content="Generate strong, secure random passwords instantly. Free, no sign-up." />
        <meta property="og:url" content="https://www.aidla.online/tools/utility/password-generator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Password Generator by AIDLA","url":"https://www.aidla.online/tools/utility/password-generator",
          "description":"Free strong password generator with custom length and character options.",
          "applicationCategory":"SecurityApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .pg-root*{box-sizing:border-box;margin:0;padding:0}
        .pg-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .pg-wrap{max-width:560px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .pg-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .pg-crumb a{color:#94a3b8;text-decoration:none}.pg-crumb a:hover{color:#1a3a8f}
        .pg-hero{text-align:center;margin-bottom:24px}
        .pg-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#1a3a8f,#3b82f6);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(26,58,143,.25)}
        .pg-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .pg-accent{background:linear-gradient(135deg,#1a3a8f,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .pg-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:400px;margin:0 auto}
        .pg-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .pg-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        /* Password display */
        .pg-pwd-box{background:#0b1437;border-radius:14px;padding:18px 16px;display:flex;align-items:center;gap:10px;margin-bottom:14px;min-width:0}
        .pg-pwd-text{flex:1;font-family:'Courier New',monospace;font-size:clamp(13px,3vw,16px);font-weight:700;color:#fff;word-break:break-all;line-height:1.5;min-width:0}
        .pg-copy-btn{flex-shrink:0;padding:8px 14px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:10px;color:#fff;font-size:11px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;white-space:nowrap}
        .pg-copy-btn:hover{background:rgba(255,255,255,.2)}
        .pg-copy-btn.copied{background:rgba(5,150,105,.3);border-color:rgba(5,150,105,.5)}
        /* Strength bar */
        .pg-strength{display:flex;align-items:center;gap:10px;margin-bottom:18px}
        .pg-bars{display:flex;gap:4px;flex:1}
        .pg-bar{height:5px;flex:1;border-radius:99px;background:#e2e8f0;transition:background .3s}
        .pg-bar.filled{background:var(--bar-color)}
        .pg-str-label{font-size:11px;font-weight:800;white-space:nowrap}
        /* Length slider */
        .pg-len-row{display:flex;align-items:center;gap:12px;margin-bottom:16px}
        .pg-len-val{font-size:22px;font-weight:900;color:#0b1437;min-width:36px;text-align:center}
        .pg-slider{flex:1;-webkit-appearance:none;height:5px;border-radius:99px;background:#e2e8f0;outline:none;cursor:pointer}
        .pg-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#0b1437;cursor:pointer;box-shadow:0 2px 8px rgba(11,20,55,.2)}
        /* Options */
        .pg-opts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
        .pg-opt{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;transition:all .13s;user-select:none}
        .pg-opt.on{border-color:rgba(26,58,143,.3);background:rgba(26,58,143,.05)}
        .pg-opt-check{width:18px;height:18px;border-radius:5px;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .13s;font-size:11px}
        .pg-opt.on .pg-opt-check{background:#0b1437;border-color:#0b1437;color:#fff}
        .pg-opt-label{font-size:12px;font-weight:700;color:#475569}
        .pg-opt.on .pg-opt-label{color:#0b1437}
        /* Buttons */
        .pg-regen{width:100%;padding:14px;border:none;border-radius:14px;background:linear-gradient(135deg,#0b1437,#1a3a8f);color:#fff;font-size:15px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;box-shadow:0 4px 16px rgba(11,20,55,.2)}
        .pg-regen:hover{transform:translateY(-2px);filter:brightness(1.1)}
        /* Multi */
        .pg-multi-row{display:flex;align-items:center;gap:10px;margin-top:8px}
        .pg-multi-input{width:70px;padding:9px 10px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;text-align:center;-webkit-appearance:none}
        .pg-multi-btn{flex:1;padding:10px;border:1.5px solid #e2e8f0;border-radius:10px;background:#fff;font-size:13px;font-weight:700;color:#1a3a8f;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .pg-multi-btn:hover{background:#f0f4ff}
        .pg-multi-list{margin-top:10px;display:flex;flex-direction:column;gap:6px}
        .pg-multi-item{display:flex;align-items:center;gap:8px;padding:9px 12px;background:#f8faff;border-radius:10px;border:1px solid #e2e8f0}
        .pg-multi-text{flex:1;font-family:'Courier New',monospace;font-size:12px;color:#0b1437;word-break:break-all}
        .pg-multi-copy{padding:4px 10px;background:#fff;border:1px solid #e2e8f0;border-radius:6px;font-size:10px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:all .13s}
        .pg-multi-copy:hover{background:#f0f4ff;color:#1a3a8f}
        .pg-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:28px}
        .pg-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .pg-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .pg-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.pg-cta{flex-direction:column;text-align:center}.pg-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="pg-root">
        <div className="pg-wrap">
          <nav className="pg-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Password Generator</span></nav>

          <motion.div className="pg-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="pg-badge">🔐 Security Tool</div>
            <h1 className="pg-h1"><span className="pg-accent">Password</span> Generator</h1>
            <p className="pg-sub">Generate strong, secure random passwords instantly. Customize length and character types.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="pg-card">
              {/* Password display */}
              <div className="pg-pwd-box">
                <span className="pg-pwd-text" aria-live="polite" aria-label="Generated password">{pwd}</span>
                <button className={`pg-copy-btn${copied?" copied":""}`} onClick={()=>copy(pwd)}>
                  {copied?"✅ Copied":"📋 Copy"}
                </button>
              </div>

              {/* Strength */}
              <div className="pg-strength">
                <div className="pg-bars">
                  {[1,2,3,4].map(i=>(
                    <div key={i} className={`pg-bar${i<=str.bars?" filled":""}`} style={{"--bar-color":str.color}}/>
                  ))}
                </div>
                <span className="pg-str-label" style={{color:str.color}}>{str.label}</span>
              </div>

              {/* Length */}
              <span className="pg-sec">Password Length</span>
              <div className="pg-len-row">
                <span className="pg-len-val">{length}</span>
                <input className="pg-slider" type="range" min={4} max={64} value={length}
                  onChange={e=>{setLength(+e.target.value);setPwd(generate(+e.target.value,opts));}} />
              </div>

              {/* Options */}
              <span className="pg-sec">Character Types</span>
              <div className="pg-opts">
                {[
                  {key:"upper",  label:"Uppercase A–Z"},
                  {key:"lower",  label:"Lowercase a–z"},
                  {key:"digits", label:"Numbers 0–9"},
                  {key:"symbols",label:"Symbols !@#$"},
                ].map(o=>(
                  <div key={o.key} className={`pg-opt${opts[o.key]?" on":""}`} onClick={()=>toggle(o.key)}>
                    <div className="pg-opt-check">{opts[o.key]?"✓":""}</div>
                    <span className="pg-opt-label">{o.label}</span>
                  </div>
                ))}
              </div>

              <button className="pg-regen" onClick={regen}>🔄 Generate New Password</button>
            </div>

            {/* Multi-generate */}
            <div className="pg-card">
              <span className="pg-sec">Generate Multiple Passwords</span>
              <div className="pg-multi-row">
                <input className="pg-multi-input" type="number" min={1} max={20} value={count} onChange={e=>setCount(Math.min(20,Math.max(1,+e.target.value)))} aria-label="Number of passwords" />
                <button className="pg-multi-btn" onClick={genMulti}>Generate {count} Password{count>1?"s":""}</button>
              </div>
              {multis.length > 0 && (
                <div className="pg-multi-list">
                  {multis.map((p,i)=>(
                    <div key={i} className="pg-multi-item">
                      <span className="pg-multi-text">{p}</span>
                      <button className="pg-multi-copy" onClick={()=>copy(p)}>Copy</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="pg-cta">
              <div><h3>More Free Tools 🚀</h3><p>Unit converter, Countdown timer and 30+ more.</p></div>
              <Link to="/tools" className="pg-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}