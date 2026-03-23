import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const fmt  = (n) => Math.round(n).toLocaleString();
const fmtD = (n) => parseFloat(n.toFixed(2)).toLocaleString();

function calcEMI(principal, rate, months) {
  if (!principal || !rate || !months) return null;
  const p = parseFloat(principal), r = parseFloat(rate) / 100 / 12, n = parseInt(months);
  if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) return null;
  if (r === 0) return { emi: p / n, total: p, interest: 0 };
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  return { emi, total, interest: total - p };
}

const LOAN_TYPES = [
  { id: "home",     label: "🏠 Home Loan",     rate: "12",  years: "20" },
  { id: "car",      label: "🚗 Car Loan",       rate: "14",  years: "5"  },
  { id: "personal", label: "💳 Personal Loan",  rate: "18",  years: "3"  },
  { id: "custom",   label: "✏️ Custom",          rate: "",    years: ""   },
];

export default function LoanEMICalculator() {
  const [loanType, setLoanType] = useState("home");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate]       = useState("12");
  const [tenure, setTenure]   = useState("20");
  const [tenureType, setTenureType] = useState("years");
  const [currency, setCurrency] = useState("PKR");

  const SYM = currency === "PKR" ? "₨" : "$";

  const months = tenureType === "years" ? parseInt(tenure) * 12 : parseInt(tenure);
  const result = useMemo(() => calcEMI(principal, rate, months), [principal, rate, months]);

  const principalPct = result ? ((parseFloat(principal) / result.total) * 100).toFixed(1) : 0;
  const interestPct  = result ? (100 - principalPct).toFixed(1) : 0;

  const handleTypeChange = (t) => {
    setLoanType(t);
    const found = LOAN_TYPES.find(l => l.id === t);
    if (found && t !== "custom") { setRate(found.rate); setTenure(found.years); setTenureType("years"); }
  };

  return (
    <>
      <Helmet>
        <title>Loan & EMI Calculator — Home, Car, Personal Loan | AIDLA</title>
        <meta name="description" content="Free loan EMI calculator. Calculate monthly instalments for home, car and personal loans. Shows total interest, total payment and amortization breakdown. Pakistan & international." />
        <meta name="keywords" content="EMI calculator, loan calculator, home loan EMI, car loan calculator, personal loan EMI, bank loan Pakistan, monthly installment calculator, AIDLA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/finance/loan-emi-calculator" />
        <meta property="og:title" content="Loan & EMI Calculator | AIDLA" />
        <meta property="og:description" content="Calculate monthly EMI for home, car and personal loans instantly." />
        <meta property="og:url" content="https://www.aidla.online/tools/finance/loan-emi-calculator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Loan EMI Calculator by AIDLA","url":"https://www.aidla.online/tools/finance/loan-emi-calculator",
          "description":"Free EMI calculator for home, car and personal loans.",
          "applicationCategory":"FinanceApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .emi-root*{box-sizing:border-box;margin:0;padding:0}
        .emi-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .emi-wrap{max-width:580px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .emi-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .emi-crumb a{color:#94a3b8;text-decoration:none}.emi-crumb a:hover{color:#1a3a8f}
        .emi-hero{text-align:center;margin-bottom:24px}
        .emi-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#0284c7,#38bdf8);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(2,132,199,.25)}
        .emi-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .emi-accent{background:linear-gradient(135deg,#0284c7,#0b1437);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .emi-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .emi-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .emi-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .emi-types{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:4px}
        .emi-type-btn{padding:10px 8px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;text-align:center}
        .emi-type-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .emi-currency{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
        .emi-cur-btn{padding:9px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;font-size:13px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .emi-cur-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .emi-fields{display:flex;flex-direction:column;gap:12px}
        .emi-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .emi-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none}
        .emi-input:focus{border-color:rgba(2,132,199,.4);box-shadow:0 0 0 3px rgba(2,132,199,.07)}
        .emi-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .emi-tenure-row{display:grid;grid-template-columns:1fr auto;gap:8px}
        .emi-tenure-toggle{display:flex;flex-direction:column;gap:4px}
        .emi-tt-btn{padding:5px 10px;border-radius:8px;border:1.5px solid #e2e8f0;background:#fff;font-size:11px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .emi-tt-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        /* Result */
        .emi-result{background:linear-gradient(135deg,#0b1437,#0284c7);border-radius:20px;padding:24px 20px;text-align:center;margin-bottom:14px}
        .emi-result-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
        .emi-emi-val{font-family:'Playfair Display',serif;font-size:clamp(2rem,8vw,3rem);font-weight:900;color:#fff;line-height:1}
        .emi-per-month{font-size:12px;color:rgba(255,255,255,.6);margin-top:4px}
        .emi-rows{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:16px;overflow:hidden;margin-bottom:14px}
        .emi-row{display:flex;justify-content:space-between;align-items:center;padding:11px 16px;border-bottom:1px solid #f1f5f9;font-size:13px}
        .emi-row:last-child{border-bottom:none}
        .emi-row-l{color:#64748b;font-weight:600}.emi-row-v{font-weight:800;color:#0b1437}
        /* Donut */
        .emi-donut-wrap{display:flex;align-items:center;gap:20px;padding:16px;background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:16px;margin-bottom:14px;flex-wrap:wrap}
        .emi-donut-legend{display:flex;flex-direction:column;gap:8px;flex:1}
        .emi-legend-item{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700}
        .emi-legend-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
        .emi-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .emi-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .emi-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .emi-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.emi-types{grid-template-columns:1fr 1fr}.emi-cta{flex-direction:column;text-align:center}.emi-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="emi-root">
        <div className="emi-wrap">
          <nav className="emi-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Loan / EMI Calculator</span></nav>

          <motion.div className="emi-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="emi-badge">🏦 Finance Tool</div>
            <h1 className="emi-h1"><span className="emi-accent">Loan / EMI</span> Calculator</h1>
            <p className="emi-sub">Calculate monthly installments for home, car and personal loans. Includes total interest breakdown.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="emi-card">
              <span className="emi-sec">Loan Type</span>
              <div className="emi-types">
                {LOAN_TYPES.map(t=>(
                  <button key={t.id} className={`emi-type-btn${loanType===t.id?" active":""}`} onClick={()=>handleTypeChange(t.id)}>{t.label}</button>
                ))}
              </div>
            </div>

            <div className="emi-card">
              <span className="emi-sec">Currency</span>
              <div className="emi-currency">
                {["PKR","USD"].map(c=>(
                  <button key={c} className={`emi-cur-btn${currency===c?" active":""}`} onClick={()=>setCurrency(c)}>{c==="PKR"?"🇵🇰 PKR":"🇺🇸 USD"}</button>
                ))}
              </div>

              <span className="emi-sec">Loan Details</span>
              <div className="emi-fields">
                <div>
                  <label className="emi-label">Loan Amount ({SYM})</label>
                  <input className="emi-input" type="number" inputMode="decimal" placeholder={currency==="PKR"?"e.g. 5,000,000":"e.g. 50,000"} value={principal} onChange={e=>setPrincipal(e.target.value)} />
                </div>
                <div>
                  <label className="emi-label">Annual Interest Rate (%)</label>
                  <input className="emi-input" type="number" inputMode="decimal" placeholder="e.g. 12" value={rate} onChange={e=>setRate(e.target.value)} />
                </div>
                <div>
                  <label className="emi-label">Loan Tenure</label>
                  <div className="emi-tenure-row">
                    <input className="emi-input" type="number" inputMode="numeric" placeholder={tenureType==="years"?"e.g. 20":"e.g. 240"} value={tenure} onChange={e=>setTenure(e.target.value)} />
                    <div className="emi-tenure-toggle">
                      {["years","months"].map(t=>(
                        <button key={t} className={`emi-tt-btn${tenureType===t?" active":""}`} onClick={()=>setTenureType(t)}>{t}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div key="res" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="emi-result">
                  <div className="emi-result-label">Monthly EMI</div>
                  <div className="emi-emi-val">{SYM} {fmt(result.emi)}</div>
                  <div className="emi-per-month">per month for {months} months</div>
                </div>

                <div className="emi-rows">
                  <div className="emi-row"><span className="emi-row-l">Principal Amount</span><span className="emi-row-v">{SYM} {fmt(parseFloat(principal))}</span></div>
                  <div className="emi-row"><span className="emi-row-l">Total Interest</span><span className="emi-row-v" style={{color:"#dc2626"}}>{SYM} {fmt(result.interest)}</span></div>
                  <div className="emi-row"><span className="emi-row-l">Total Payment</span><span className="emi-row-v">{SYM} {fmt(result.total)}</span></div>
                  <div className="emi-row"><span className="emi-row-l">Loan Tenure</span><span className="emi-row-v">{months} months ({tenure} {tenureType})</span></div>
                  <div className="emi-row"><span className="emi-row-l">Interest Rate</span><span className="emi-row-v">{rate}% per annum</span></div>
                </div>

                {/* Visual breakdown */}
                <div className="emi-donut-wrap">
                  <svg width="90" height="90" viewBox="0 0 90 90" style={{flexShrink:0}}>
                    <circle cx="45" cy="45" r="35" fill="none" stroke="#e2e8f0" strokeWidth="14"/>
                    <circle cx="45" cy="45" r="35" fill="none" stroke="#0284c7" strokeWidth="14"
                      strokeDasharray={`${2*Math.PI*35*principalPct/100} ${2*Math.PI*35}`}
                      transform="rotate(-90 45 45)" strokeLinecap="round"/>
                    <circle cx="45" cy="45" r="35" fill="none" stroke="#dc2626" strokeWidth="14"
                      strokeDasharray={`${2*Math.PI*35*interestPct/100} ${2*Math.PI*35}`}
                      strokeDashoffset={`-${2*Math.PI*35*principalPct/100}`}
                      transform="rotate(-90 45 45)" strokeLinecap="round"/>
                  </svg>
                  <div className="emi-donut-legend">
                    <div className="emi-legend-item"><div className="emi-legend-dot" style={{background:"#0284c7"}}/><span>Principal — {principalPct}%</span></div>
                    <div className="emi-legend-item"><div className="emi-legend-dot" style={{background:"#dc2626"}}/><span>Interest — {interestPct}%</span></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="emi-cta">
              <div><h3>More Finance Tools 🚀</h3><p>Zakat calculator, Salary tax, Tip calculator and more.</p></div>
              <Link to="/tools" className="emi-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}