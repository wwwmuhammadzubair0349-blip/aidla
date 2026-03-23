import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const NISAB_GOLD_GRAMS  = 87.48;
const NISAB_SILVER_GRAMS = 612.36;
const GOLD_PRICE_PKR    = 21000; // per gram approx
const SILVER_PRICE_PKR  = 240;   // per gram approx

const fmt = (n) => isNaN(n) ? "0" : Math.round(n).toLocaleString();
const fmtDec = (n) => isNaN(n) ? "0.00" : parseFloat(n.toFixed(2)).toLocaleString();

export default function ZakatCalculator() {
  const [currency, setCurrency]   = useState("PKR");
  const [savings,  setSavings]    = useState("");
  const [gold,     setGold]       = useState("");
  const [silver,   setSilver]     = useState("");
  const [business, setBusiness]   = useState("");
  const [debts,    setDebts]      = useState("");
  const [showResult, setShowResult] = useState(false);

  const GOLD_PRICE   = currency === "PKR" ? GOLD_PRICE_PKR   : 90;   // USD per gram
  const SILVER_PRICE = currency === "PKR" ? SILVER_PRICE_PKR : 1.1;
  const SYM          = currency === "PKR" ? "₨" : "$";

  const n = (v) => parseFloat(v) || 0;

  const goldValue    = n(gold)     * GOLD_PRICE;
  const silverValue  = n(silver)   * SILVER_PRICE;
  const totalAssets  = n(savings) + goldValue + silverValue + n(business);
  const netWealth    = Math.max(0, totalAssets - n(debts));
  const nisabGold    = NISAB_GOLD_GRAMS   * GOLD_PRICE;
  const nisabSilver  = NISAB_SILVER_GRAMS * SILVER_PRICE;
  const nisab        = Math.min(nisabGold, nisabSilver); // use lower (silver) for obligation
  const zakatDue     = netWealth >= nisab ? netWealth * 0.025 : 0;
  const eligible     = netWealth >= nisab;

  const handleCalc = () => setShowResult(true);
  const handleReset = () => { setSavings(""); setGold(""); setSilver(""); setBusiness(""); setDebts(""); setShowResult(false); };

  return (
    <>
      <Helmet>
        <title>Zakat Calculator 2025 — Gold, Silver, Savings & Assets | AIDLA</title>
        <meta name="description" content="Free Zakat calculator for 2025. Calculate Zakat on savings, gold, silver, and business assets in PKR or USD. Includes Nisab threshold check. Accurate Islamic calculator." />
        <meta name="keywords" content="zakat calculator 2025, zakat on gold, zakat on savings, nisab calculator, zakat Pakistan, Islamic calculator, zakat PKR, AIDLA zakat" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/finance/zakat-calculator" />
        <meta property="og:title" content="Zakat Calculator 2025 | AIDLA" />
        <meta property="og:description" content="Calculate your Zakat on savings, gold, silver and business assets. Free, accurate, 2025 rates." />
        <meta property="og:url" content="https://www.aidla.online/tools/finance/zakat-calculator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Zakat Calculator by AIDLA","url":"https://www.aidla.online/tools/finance/zakat-calculator",
          "description":"Free Zakat calculator — savings, gold, silver, business assets.",
          "applicationCategory":"FinanceApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .zk-root*{box-sizing:border-box;margin:0;padding:0}
        .zk-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .zk-wrap{max-width:560px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .zk-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .zk-crumb a{color:#94a3b8;text-decoration:none}.zk-crumb a:hover{color:#1a3a8f}
        .zk-hero{text-align:center;margin-bottom:24px}
        .zk-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(5,150,105,.25)}
        .zk-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .zk-accent{background:linear-gradient(135deg,#059669,#10b981);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .zk-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .zk-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .zk-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .zk-currency{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px}
        .zk-cur-btn{padding:9px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;font-size:13px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .zk-cur-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .zk-fields{display:flex;flex-direction:column;gap:11px}
        .zk-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .zk-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none}
        .zk-input:focus{border-color:rgba(5,150,105,.4);box-shadow:0 0 0 3px rgba(5,150,105,.07)}
        .zk-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .zk-hint{font-size:10px;color:#94a3b8;margin-top:3px}
        .zk-calc-btn{width:100%;padding:14px;border:none;border-radius:14px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;font-size:15px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;box-shadow:0 4px 16px rgba(5,150,105,.3)}
        .zk-calc-btn:hover{transform:translateY(-2px);filter:brightness(1.05)}
        .zk-reset{width:100%;padding:11px;border:1.5px solid #e2e8f0;border-radius:12px;background:#fff;color:#64748b;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;margin-top:8px;transition:all .15s}
        .zk-reset:hover{background:#f8faff}
        .zk-result{border-radius:20px;overflow:hidden;margin-bottom:14px}
        .zk-result-top{padding:24px 20px;background:linear-gradient(135deg,#059669,#0b1437);text-align:center}
        .zk-result-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
        .zk-result-amount{font-family:'Playfair Display',serif;font-size:clamp(2rem,8vw,3rem);font-weight:900;color:#fff;line-height:1.1}
        .zk-result-sub{font-size:12px;color:rgba(255,255,255,.6);margin-top:4px}
        .zk-eligible{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:99px;font-size:12px;font-weight:800;margin-top:12px}
        .zk-result-rows{background:#fff;border:1px solid rgba(59,130,246,.1);border-top:none}
        .zk-row{display:flex;justify-content:space-between;align-items:center;padding:11px 16px;border-bottom:1px solid #f1f5f9;font-size:13px}
        .zk-row:last-child{border-bottom:none}
        .zk-row-label{color:#64748b;font-weight:600}
        .zk-row-val{font-weight:800;color:#0b1437}
        .zk-nisab-note{background:rgba(5,150,105,.06);border:1px solid rgba(5,150,105,.15);border-radius:12px;padding:12px 14px;font-size:12px;color:#059669;line-height:1.6;margin-top:4px}
        .zk-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:28px}
        .zk-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .zk-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .zk-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.zk-cta{flex-direction:column;text-align:center}.zk-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="zk-root">
        <div className="zk-wrap">
          <nav className="zk-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Zakat Calculator</span></nav>

          <motion.div className="zk-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="zk-badge">🌙 Islamic Finance</div>
            <h1 className="zk-h1"><span className="zk-accent">Zakat</span> Calculator 2025</h1>
            <p className="zk-sub">Calculate your Zakat on savings, gold, silver and business assets. Includes Nisab threshold check.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="zk-card">
              <span className="zk-sec">Currency</span>
              <div className="zk-currency">
                {["PKR","USD"].map(c=>(
                  <button key={c} className={`zk-cur-btn${currency===c?" active":""}`} onClick={()=>setCurrency(c)}>{c==="PKR"?"🇵🇰 Pakistani Rupee":"🇺🇸 US Dollar"}</button>
                ))}
              </div>
            </div>

            <div className="zk-card">
              <span className="zk-sec">Your Assets</span>
              <div className="zk-fields">
                {[
                  {label:"Cash & Savings",ph:`e.g. ${currency==="PKR"?"500,000":"5,000"}`,val:savings,set:setSavings,hint:"Bank balance + cash at home"},
                  {label:"Gold Value",ph:`e.g. ${currency==="PKR"?"200,000":"2,000"}`,val:gold,set:setGold,hint:`Enter weight in grams — we calculate value at ${SYM}${currency==="PKR"?GOLD_PRICE_PKR:90}/gram`},
                  {label:"Silver Value",ph:`e.g. ${currency==="PKR"?"50,000":"500"}`,val:silver,set:setSilver,hint:`Enter weight in grams — valued at ${SYM}${currency==="PKR"?SILVER_PRICE_PKR:1.1}/gram`},
                  {label:"Business / Investment Assets",ph:`e.g. ${currency==="PKR"?"100,000":"1,000"}`,val:business,set:setBusiness,hint:"Stock, inventory, receivables"},
                ].map(f=>(
                  <div key={f.label}>
                    <label className="zk-label">{f.label}</label>
                    <input className="zk-input" type="number" inputMode="decimal" placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)} />
                    <div className="zk-hint">{f.hint}</div>
                  </div>
                ))}

                <div>
                  <label className="zk-label">Debts / Liabilities</label>
                  <input className="zk-input" type="number" inputMode="decimal" placeholder="e.g. 50,000" value={debts} onChange={e=>setDebts(e.target.value)} />
                  <div className="zk-hint">Outstanding loans, bills due — deducted from total</div>
                </div>
              </div>
            </div>

            <button className="zk-calc-btn" onClick={handleCalc}>🌙 Calculate My Zakat</button>
          </motion.div>

          <AnimatePresence>
            {showResult && (
              <motion.div key="result" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="zk-result">
                  <div className="zk-result-top">
                    <div className="zk-result-label">Zakat Due</div>
                    <div className="zk-result-amount">{SYM} {fmt(zakatDue)}</div>
                    <div className="zk-result-sub">2.5% of net zakatable wealth</div>
                    <div className="zk-eligible" style={{background:eligible?"rgba(255,255,255,.15)":"rgba(220,38,38,.2)",color:eligible?"#fff":"#fca5a5"}}>
                      {eligible?"✅ Zakat is obligatory on you":"❌ Below Nisab — Zakat not obligatory"}
                    </div>
                  </div>
                  <div className="zk-result-rows">
                    <div className="zk-row"><span className="zk-row-label">Total Assets</span><span className="zk-row-val">{SYM} {fmt(totalAssets)}</span></div>
                    <div className="zk-row"><span className="zk-row-label">Total Debts</span><span className="zk-row-val">− {SYM} {fmt(n(debts))}</span></div>
                    <div className="zk-row"><span className="zk-row-label">Net Zakatable Wealth</span><span className="zk-row-val">{SYM} {fmt(netWealth)}</span></div>
                    <div className="zk-row"><span className="zk-row-label">Nisab (Silver)</span><span className="zk-row-val">{SYM} {fmt(nisabSilver)}</span></div>
                    <div className="zk-row"><span className="zk-row-label">Nisab (Gold)</span><span className="zk-row-val">{SYM} {fmt(nisabGold)}</span></div>
                    <div className="zk-row" style={{background:"rgba(5,150,105,.04)"}}><span className="zk-row-label" style={{fontWeight:800,color:"#059669"}}>Zakat (2.5%)</span><span className="zk-row-val" style={{color:"#059669",fontSize:15}}>{SYM} {fmt(zakatDue)}</span></div>
                  </div>
                </div>
                <div className="zk-nisab-note">
                  💡 <strong>Nisab</strong> is the minimum amount of wealth a Muslim must have before Zakat becomes obligatory. The lower of gold (87.48g) or silver (612.36g) Nisab is used — currently silver ({SYM} {fmt(nisabSilver)}).
                </div>
                <button className="zk-reset" onClick={handleReset}>🔄 Recalculate</button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="zk-cta">
              <div><h3>More Free Tools 🚀</h3><p>Salary calculator, Loan EMI, BMI and 30+ more tools.</p></div>
              <Link to="/tools" className="zk-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}