import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

// Pakistan FY 2024-25 tax slabs (salaried)
const TAX_SLABS = [
  { min: 0,       max: 600000,   rate: 0,    fixed: 0       },
  { min: 600001,  max: 1200000,  rate: 5,    fixed: 0       },
  { min: 1200001, max: 2200000,  rate: 15,   fixed: 30000   },
  { min: 2200001, max: 3200000,  rate: 25,   fixed: 180000  },
  { min: 3200001, max: 4100000,  rate: 30,   fixed: 430000  },
  { min: 4100001, max: Infinity, rate: 35,   fixed: 700000  },
];

function calcTax(annualIncome) {
  const slab = TAX_SLABS.find(s => annualIncome <= s.max);
  if (!slab || slab.rate === 0) return 0;
  return slab.fixed + ((annualIncome - TAX_SLABS[TAX_SLABS.indexOf(slab) - 0].min + 1) * slab.rate / 100);
}

// Simpler correct approach
function calcPKTax(annual) {
  if (annual <= 600000)  return 0;
  if (annual <= 1200000) return (annual - 600000) * 0.05;
  if (annual <= 2200000) return 30000 + (annual - 1200000) * 0.15;
  if (annual <= 3200000) return 180000 + (annual - 2200000) * 0.25;
  if (annual <= 4100000) return 430000 + (annual - 3200000) * 0.30;
  return 700000 + (annual - 4100000) * 0.35;
}

const fmt = (n) => Math.round(n).toLocaleString();

export default function SalaryCalculator() {
  const [salary,   setSalary]   = useState("");
  const [period,   setPeriod]   = useState("monthly"); // monthly | annual
  const [showBreak, setShowBreak] = useState(false);

  const annual  = useMemo(() => {
    const s = parseFloat(salary);
    if (isNaN(s) || s <= 0) return null;
    return period === "monthly" ? s * 12 : s;
  }, [salary, period]);

  const monthly = annual ? annual / 12 : null;

  const annualTax  = annual ? calcPKTax(annual) : null;
  const monthlyTax = annualTax ? annualTax / 12 : null;
  const netMonthly = (monthly && monthlyTax !== null) ? monthly - monthlyTax : null;
  const effectiveRate = (annualTax && annual) ? (annualTax / annual) * 100 : null;

  const getSlab = (a) => {
    if (!a) return null;
    if (a <= 600000)  return { label: "Zero Tax Slab", color: "#059669" };
    if (a <= 1200000) return { label: "5% Tax Slab", color: "#0284c7" };
    if (a <= 2200000) return { label: "15% Tax Slab", color: "#7c3aed" };
    if (a <= 3200000) return { label: "25% Tax Slab", color: "#d97706" };
    if (a <= 4100000) return { label: "30% Tax Slab", color: "#ea580c" };
    return { label: "35% Tax Slab", color: "#dc2626" };
  };
  const slab = getSlab(annual);

  return (
    <>
      <Helmet>
        <title>Salary & Income Tax Calculator Pakistan 2024-25 | AIDLA</title>
        <meta name="description" content="Free Pakistan salary and income tax calculator for FY 2024-25. Calculate monthly net salary after income tax, see tax slab, effective tax rate and monthly deductions instantly." />
        <meta name="keywords" content="salary calculator Pakistan, income tax calculator Pakistan 2024, FBR tax calculator, net salary Pakistan, tax slab Pakistan 2024-25, monthly salary after tax, AIDLA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/finance/salary-calculator" />
        <meta property="og:title" content="Salary & Tax Calculator Pakistan 2024-25 | AIDLA" />
        <meta property="og:description" content="Calculate net salary after income tax — Pakistan FY 2024-25 slabs." />
        <meta property="og:url" content="https://www.aidla.online/tools/finance/salary-calculator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Salary Tax Calculator Pakistan by AIDLA","url":"https://www.aidla.online/tools/finance/salary-calculator",
          "description":"Pakistan income tax calculator for salaried individuals FY 2024-25.",
          "applicationCategory":"FinanceApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .sc-root*{box-sizing:border-box;margin:0;padding:0}
        .sc-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .sc-wrap{max-width:580px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .sc-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .sc-crumb a{color:#94a3b8;text-decoration:none}.sc-crumb a:hover{color:#1a3a8f}
        .sc-hero{text-align:center;margin-bottom:24px}
        .sc-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#166534,#15803d);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(22,101,52,.25)}
        .sc-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .sc-accent{background:linear-gradient(135deg,#166534,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sc-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .sc-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .sc-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .sc-period{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
        .sc-period-btn{padding:10px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:13px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .sc-period-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .sc-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .sc-input-wrap{position:relative}
        .sc-prefix{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:15px;font-weight:800;color:#94a3b8;pointer-events:none}
        .sc-input{width:100%;padding:11px 13px 11px 30px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none}
        .sc-input:focus{border-color:rgba(22,101,52,.4);box-shadow:0 0 0 3px rgba(22,101,52,.07)}
        .sc-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        /* Result */
        .sc-result{background:linear-gradient(135deg,#0b1437,#166534);border-radius:20px;padding:24px 20px;text-align:center;margin-bottom:14px}
        .sc-net-lbl{font-size:11px;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
        .sc-net-val{font-family:'Playfair Display',serif;font-size:clamp(2rem,8vw,3rem);font-weight:900;color:#fff;line-height:1}
        .sc-net-sub{font-size:12px;color:rgba(255,255,255,.6);margin-top:4px}
        .sc-slab-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:99px;font-size:11px;font-weight:800;margin-top:10px;background:rgba(255,255,255,.12);color:#fff}
        .sc-rows{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:16px;overflow:hidden;margin-bottom:14px}
        .sc-row{display:flex;justify-content:space-between;align-items:center;padding:11px 16px;border-bottom:1px solid #f1f5f9;font-size:13px}
        .sc-row:last-child{border-bottom:none}
        .sc-row-l{color:#64748b;font-weight:600}.sc-row-v{font-weight:800;color:#0b1437}
        /* Slab table */
        .sc-slab-toggle{width:100%;padding:10px;border:1.5px solid #e2e8f0;border-radius:12px;background:#fff;font-size:13px;font-weight:700;color:#1a3a8f;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;margin-bottom:10px}
        .sc-slab-toggle:hover{background:#f0f4ff}
        .sc-slab-table{border-radius:12px;overflow:hidden;border:1px solid rgba(59,130,246,.1)}
        .sc-slab-hdr{display:grid;grid-template-columns:2fr 1fr 1fr;padding:8px 12px;background:#f8faff;font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;border-bottom:1px solid #f1f5f9}
        .sc-slab-row{display:grid;grid-template-columns:2fr 1fr 1fr;padding:9px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;background:#fff;transition:background .13s}
        .sc-slab-row:last-child{border-bottom:none}
        .sc-slab-row.hl{background:rgba(22,101,52,.05);border-left:3px solid #16a34a}
        .sc-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .sc-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .sc-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .sc-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.sc-cta{flex-direction:column;text-align:center}.sc-cta-btn{width:100%;text-align:center}.sc-slab-hdr,.sc-slab-row{font-size:11px;padding:8px 10px}}
      `}</style>

      <div className="sc-root">
        <div className="sc-wrap">
          <nav className="sc-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Salary Calculator</span></nav>

          <motion.div className="sc-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="sc-badge">💵 Finance Tool</div>
            <h1 className="sc-h1"><span className="sc-accent">Salary & Tax</span> Calculator</h1>
            <p className="sc-sub">Pakistan income tax calculator for FY 2024-25. Calculate your net monthly salary after tax instantly.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="sc-card">
              <span className="sc-sec">Salary Period</span>
              <div className="sc-period">
                <button className={`sc-period-btn${period==="monthly"?" active":""}`} onClick={()=>setPeriod("monthly")}>📅 Monthly</button>
                <button className={`sc-period-btn${period==="annual"?" active":""}`} onClick={()=>setPeriod("annual")}>📆 Annual</button>
              </div>
              <label className="sc-label">Gross {period === "monthly" ? "Monthly" : "Annual"} Salary (₨)</label>
              <div className="sc-input-wrap">
                <span className="sc-prefix">₨</span>
                <input className="sc-input" type="number" inputMode="decimal"
                  placeholder={period==="monthly"?"e.g. 150,000":"e.g. 1,800,000"}
                  value={salary} onChange={e=>setSalary(e.target.value)} />
              </div>
              <p style={{fontSize:11,color:"#94a3b8",marginTop:6}}>Based on FBR salaried income tax slabs FY 2024-25</p>
            </div>
          </motion.div>

          <AnimatePresence>
            {netMonthly !== null && (
              <motion.div key="result" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="sc-result">
                  <div className="sc-net-lbl">Net Monthly Take-Home</div>
                  <div className="sc-net-val">₨ {fmt(netMonthly)}</div>
                  <div className="sc-net-sub">After income tax deduction</div>
                  {slab && <div className="sc-slab-badge">📊 {slab.label}</div>}
                </div>

                <div className="sc-rows">
                  <div className="sc-row"><span className="sc-row-l">Gross Monthly</span><span className="sc-row-v">₨ {fmt(monthly)}</span></div>
                  <div className="sc-row"><span className="sc-row-l">Gross Annual</span><span className="sc-row-v">₨ {fmt(annual)}</span></div>
                  <div className="sc-row"><span className="sc-row-l">Annual Tax</span><span className="sc-row-v" style={{color:"#dc2626"}}>₨ {fmt(annualTax)}</span></div>
                  <div className="sc-row"><span className="sc-row-l">Monthly Tax</span><span className="sc-row-v" style={{color:"#dc2626"}}>₨ {fmt(monthlyTax)}</span></div>
                  <div className="sc-row"><span className="sc-row-l">Effective Tax Rate</span><span className="sc-row-v">{effectiveRate?.toFixed(2)}%</span></div>
                  <div className="sc-row" style={{background:"rgba(22,101,52,.04)"}}><span className="sc-row-l" style={{fontWeight:800,color:"#059669"}}>Net Monthly</span><span className="sc-row-v" style={{color:"#059669",fontSize:15}}>₨ {fmt(netMonthly)}</span></div>
                </div>

                <div className="sc-card">
                  <button className="sc-slab-toggle" onClick={()=>setShowBreak(s=>!s)}>
                    📊 {showBreak?"Hide":"View"} Tax Slabs FY 2024-25
                  </button>
                  <AnimatePresence>
                    {showBreak && (
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.2}} style={{overflow:"hidden"}}>
                        <div className="sc-slab-table">
                          <div className="sc-slab-hdr"><span>Annual Income</span><span>Rate</span><span>Fixed Tax</span></div>
                          {[
                            {range:"Up to ₨600,000",rate:"0%",fixed:"0",min:0,max:600000},
                            {range:"₨600,001 – 1,200,000",rate:"5%",fixed:"₨0",min:600001,max:1200000},
                            {range:"₨1.2M – 2.2M",rate:"15%",fixed:"₨30,000",min:1200001,max:2200000},
                            {range:"₨2.2M – 3.2M",rate:"25%",fixed:"₨180,000",min:2200001,max:3200000},
                            {range:"₨3.2M – 4.1M",rate:"30%",fixed:"₨430,000",min:3200001,max:4100000},
                            {range:"Above ₨4.1M",rate:"35%",fixed:"₨700,000",min:4100001,max:Infinity},
                          ].map((s,i)=>(
                            <div key={i} className={`sc-slab-row${annual && annual >= s.min && annual <= s.max?" hl":""}`}>
                              <span style={{fontSize:11,color:"#475569"}}>{s.range}</span>
                              <span style={{fontWeight:800,color:"#0b1437"}}>{s.rate}</span>
                              <span style={{fontSize:11,color:"#64748b"}}>{s.fixed}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="sc-cta">
              <div><h3>More Finance Tools 🚀</h3><p>Zakat calculator, Loan EMI and more.</p></div>
              <Link to="/tools" className="sc-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}