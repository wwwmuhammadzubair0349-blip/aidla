import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const QUICK_TIPS = [5, 10, 15, 18, 20, 25];

export default function TipCalculator() {
  const [bill,       setBill]       = useState("");
  const [tipPct,     setTipPct]     = useState(15);
  const [customTip,  setCustomTip]  = useState("");
  const [people,     setPeople]     = useState(1);
  const [useCustom,  setUseCustom]  = useState(false);
  const [currency,   setCurrency]   = useState("PKR");

  const SYM = currency === "PKR" ? "₨" : currency === "USD" ? "$" : "AED";

  const pct      = useCustom ? (parseFloat(customTip) || 0) : tipPct;
  const billNum  = parseFloat(bill) || 0;
  const tipAmt   = billNum * pct / 100;
  const total    = billNum + tipAmt;
  const perPerson = people > 0 ? total / people : total;
  const tipPerPerson = people > 0 ? tipAmt / people : tipAmt;

  const fmt = (n) => n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <Helmet>
        <title>Tip Calculator — Split Bill & Calculate Tip | AIDLA</title>
        <meta name="description" content="Free tip calculator. Calculate tip amount and split bills between any number of people. Choose tip percentage or enter custom tip. Works in PKR, USD and AED." />
        <meta name="keywords" content="tip calculator, bill splitter, split bill calculator, how much to tip, restaurant tip calculator, tip percentage calculator, AIDLA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/finance/tip-calculator" />
        <meta property="og:title" content="Tip Calculator | AIDLA" />
        <meta property="og:description" content="Calculate tip and split bills between any number of people." />
        <meta property="og:url" content="https://www.aidla.online/tools/finance/tip-calculator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Tip Calculator by AIDLA","url":"https://www.aidla.online/tools/finance/tip-calculator",
          "description":"Free tip and bill splitting calculator.",
          "applicationCategory":"FinanceApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .tc-root*{box-sizing:border-box;margin:0;padding:0}
        .tc-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .tc-wrap{max-width:520px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .tc-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .tc-crumb a{color:#94a3b8;text-decoration:none}.tc-crumb a:hover{color:#1a3a8f}
        .tc-hero{text-align:center;margin-bottom:24px}
        .tc-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(217,119,6,.25)}
        .tc-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .tc-accent{background:linear-gradient(135deg,#d97706,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .tc-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:380px;margin:0 auto}
        .tc-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .tc-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .tc-cur{display:flex;gap:7px;margin-bottom:16px;flex-wrap:wrap}
        .tc-cur-btn{padding:7px 14px;border-radius:99px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .tc-cur-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .tc-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .tc-input-wrap{position:relative;margin-bottom:4px}
        .tc-prefix{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:14px;font-weight:800;color:#94a3b8;pointer-events:none}
        .tc-input{width:100%;padding:12px 13px 12px 30px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .tc-input:focus{border-color:rgba(217,119,6,.4);box-shadow:0 0 0 3px rgba(217,119,6,.07)}
        .tc-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .tc-plain-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .tc-plain-input:focus{border-color:rgba(217,119,6,.4);box-shadow:0 0 0 3px rgba(217,119,6,.07)}
        /* Tip % buttons */
        .tc-tips{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:10px}
        .tc-tip-btn{padding:8px 4px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:center}
        .tc-tip-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        /* People counter */
        .tc-people-row{display:flex;align-items:center;gap:12px}
        .tc-ppl-btn{width:36px;height:36px;border-radius:50%;border:1.5px solid #e2e8f0;background:#fff;font-size:18px;font-weight:800;color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .13s;flex-shrink:0;line-height:1}
        .tc-ppl-btn:hover{background:#f0f4ff;border-color:rgba(217,119,6,.3)}
        .tc-ppl-val{font-size:22px;font-weight:900;color:#0b1437;min-width:32px;text-align:center}
        /* Result */
        .tc-result{background:linear-gradient(135deg,#0b1437,#d97706);border-radius:20px;padding:24px 20px;margin-bottom:14px}
        .tc-result-main{text-align:center;margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid rgba(255,255,255,.15)}
        .tc-result-lbl{font-size:11px;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
        .tc-result-val{font-family:'Playfair Display',serif;font-size:clamp(2rem,8vw,3rem);font-weight:900;color:#fff;line-height:1}
        .tc-result-sub{font-size:12px;color:rgba(255,255,255,.6);margin-top:4px}
        .tc-result-rows{display:flex;flex-direction:column;gap:8px}
        .tc-rrow{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:13px}
        .tc-rrow:last-child{border-bottom:none}
        .tc-rrow-l{color:rgba(255,255,255,.65);font-weight:600}
        .tc-rrow-v{font-weight:800;color:#fff}
        .tc-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .tc-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .tc-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .tc-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.tc-tips{grid-template-columns:repeat(3,1fr)}.tc-cta{flex-direction:column;text-align:center}.tc-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="tc-root">
        <div className="tc-wrap">
          <nav className="tc-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Tip Calculator</span></nav>

          <motion.div className="tc-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="tc-badge">🧾 Finance Tool</div>
            <h1 className="tc-h1"><span className="tc-accent">Tip</span> Calculator</h1>
            <p className="tc-sub">Calculate tip and split the bill between any number of people instantly.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="tc-card">
              <span className="tc-sec">Currency</span>
              <div className="tc-cur">
                {["PKR","USD","AED"].map(c=>(
                  <button key={c} className={`tc-cur-btn${currency===c?" active":""}`} onClick={()=>setCurrency(c)}>
                    {c==="PKR"?"🇵🇰":c==="USD"?"🇺🇸":"🇦🇪"} {c}
                  </button>
                ))}
              </div>

              <span className="tc-sec">Bill Amount</span>
              <div className="tc-input-wrap">
                <span className="tc-prefix">{SYM}</span>
                <input className="tc-input" type="number" inputMode="decimal"
                  placeholder={currency==="PKR"?"e.g. 5,000":currency==="USD"?"e.g. 50":"e.g. 180"}
                  value={bill} onChange={e=>setBill(e.target.value)} />
              </div>
            </div>

            <div className="tc-card">
              <span className="tc-sec">Tip Percentage</span>
              <div className="tc-tips">
                {QUICK_TIPS.map(t=>(
                  <button key={t}
                    className={`tc-tip-btn${!useCustom && tipPct===t?" active":""}`}
                    onClick={()=>{setTipPct(t);setUseCustom(false);}}>
                    {t}%
                  </button>
                ))}
              </div>
              <label className="tc-label">Custom Tip %</label>
              <input className="tc-plain-input" type="number" inputMode="decimal"
                placeholder="Enter custom %"
                value={customTip}
                onChange={e=>{setCustomTip(e.target.value);setUseCustom(true);}}
                onFocus={()=>setUseCustom(true)} />
            </div>

            <div className="tc-card">
              <span className="tc-sec">Split Between</span>
              <div className="tc-people-row">
                <button className="tc-ppl-btn" onClick={()=>setPeople(p=>Math.max(1,p-1))} aria-label="Remove person">−</button>
                <span className="tc-ppl-val">{people}</span>
                <button className="tc-ppl-btn" onClick={()=>setPeople(p=>Math.min(50,p+1))} aria-label="Add person">+</button>
                <span style={{fontSize:13,color:"#64748b",fontWeight:600}}>{people===1?"person":"people"}</span>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {billNum > 0 && (
              <motion.div key="result" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="tc-result">
                  <div className="tc-result-main">
                    <div className="tc-result-lbl">{people > 1 ? "Each Person Pays" : "Total with Tip"}</div>
                    <div className="tc-result-val">{SYM} {fmt(perPerson)}</div>
                    {people > 1 && <div className="tc-result-sub">split {people} ways</div>}
                  </div>
                  <div className="tc-result-rows">
                    <div className="tc-rrow"><span className="tc-rrow-l">Bill Amount</span><span className="tc-rrow-v">{SYM} {fmt(billNum)}</span></div>
                    <div className="tc-rrow"><span className="tc-rrow-l">Tip ({pct}%)</span><span className="tc-rrow-v">{SYM} {fmt(tipAmt)}</span></div>
                    <div className="tc-rrow"><span className="tc-rrow-l">Total Bill</span><span className="tc-rrow-v">{SYM} {fmt(total)}</span></div>
                    {people > 1 && <>
                      <div className="tc-rrow"><span className="tc-rrow-l">Tip Per Person</span><span className="tc-rrow-v">{SYM} {fmt(tipPerPerson)}</span></div>
                      <div className="tc-rrow"><span className="tc-rrow-l">Each Pays</span><span className="tc-rrow-v" style={{color:"#fbbf24",fontSize:15}}>{SYM} {fmt(perPerson)}</span></div>
                    </>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="tc-cta">
              <div><h3>More Finance Tools 🚀</h3><p>Zakat calculator, Loan EMI and more.</p></div>
              <Link to="/tools" className="tc-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}