import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const SCHOLARSHIPS = [
  {
    id: "hec_need",
    name: "HEC Need-Based Scholarship",
    org: "Higher Education Commission",
    flag: "🇵🇰",
    type: "Need-Based",
    color: "#059669",
    minMarks: 60,
    level: ["undergraduate"],
    income: true,
    maxIncome: 45000,
    desc: "For financially needy students in public sector universities.",
    link: "https://www.hec.gov.pk",
    amount: "Up to PKR 200,000/year",
  },
  {
    id: "hec_merit",
    name: "HEC Merit Scholarship",
    org: "Higher Education Commission",
    flag: "🇵🇰",
    type: "Merit",
    color: "#1a3a8f",
    minMarks: 70,
    level: ["undergraduate","postgraduate"],
    income: false,
    desc: "For high-achieving students in HEC-recognized universities.",
    link: "https://www.hec.gov.pk",
    amount: "Full tuition fee",
  },
  {
    id: "pm_laptop",
    name: "PM Laptop Scheme",
    org: "Government of Pakistan",
    flag: "🇵🇰",
    type: "Government",
    color: "#0284c7",
    minMarks: 70,
    level: ["undergraduate","postgraduate"],
    income: false,
    desc: "Free laptop for high-achieving students in recognized universities.",
    link: "https://pmnls.hec.gov.pk",
    amount: "Free Laptop",
  },
  {
    id: "ehsaas",
    name: "Ehsaas Undergraduate Scholarship",
    org: "Ehsaas Programme",
    flag: "🇵🇰",
    type: "Need-Based",
    color: "#7c3aed",
    minMarks: 60,
    level: ["undergraduate"],
    income: true,
    maxIncome: 45000,
    desc: "For deserving students from low-income families.",
    link: "https://ehsaas.nadra.gov.pk",
    amount: "PKR 40,000 – 100,000/year",
  },
  {
    id: "fbise_talent",
    name: "FBISE Talent Scholarship",
    org: "Federal Board of Intermediate & Secondary Education",
    flag: "🇵🇰",
    type: "Merit",
    color: "#d97706",
    minMarks: 85,
    level: ["matric","intermediate"],
    income: false,
    desc: "For top performers in FBISE Matric and Intermediate exams.",
    link: "https://fbise.edu.pk",
    amount: "Cash Award + Certificate",
  },
  {
    id: "punjab_edu",
    name: "Punjab Educational Endowment Fund",
    org: "Government of Punjab",
    flag: "🏛️",
    type: "Need-Based",
    color: "#dc2626",
    minMarks: 60,
    level: ["undergraduate"],
    income: true,
    maxIncome: 30000,
    desc: "For deserving Punjab students enrolled in recognized institutions.",
    link: "https://peef.org.pk",
    amount: "Up to PKR 150,000/year",
  },
  {
    id: "sindh_merit",
    name: "Sindh Merit Scholarship",
    org: "Government of Sindh",
    flag: "🏛️",
    type: "Merit",
    color: "#059669",
    minMarks: 75,
    level: ["undergraduate"],
    income: false,
    desc: "For top-performing students from Sindh province.",
    link: "https://scholarship.sindh.gov.pk",
    amount: "Full tuition fee",
  },
  {
    id: "aga_khan",
    name: "Aga Khan Foundation Scholarship",
    org: "Aga Khan Development Network",
    flag: "🌍",
    type: "Need-Based + Merit",
    color: "#0b1437",
    minMarks: 70,
    level: ["undergraduate","postgraduate"],
    income: true,
    maxIncome: 60000,
    desc: "For high-achieving students with financial need. Competitive.",
    link: "https://www.akdn.org/our-agencies/aga-khan-foundation/scholarships",
    amount: "Up to 100% of costs",
  },
];

const LEVELS = [
  { id:"matric",        label:"Matric / O-Level" },
  { id:"intermediate",  label:"Intermediate / A-Level" },
  { id:"undergraduate", label:"Undergraduate (BS/BBA)" },
  { id:"postgraduate",  label:"Postgraduate (MS/MBA)" },
];

export default function ScholarshipEligibility() {
  const [marks,     setMarks]     = useState("");
  const [total,     setTotal]     = useState("100");
  const [level,     setLevel]     = useState("undergraduate");
  const [income,    setIncome]    = useState("");
  const [checked,   setChecked]   = useState(false);

  const pct = marks && total ? (parseFloat(marks) / parseFloat(total)) * 100 : null;

  const results = SCHOLARSHIPS.filter(s => {
    if (!s.level.includes(level)) return false;
    if (pct === null || pct < s.minMarks) return false;
    if (s.income && income) {
      const inc = parseFloat(income);
      if (!isNaN(inc) && inc > s.maxIncome) return false;
    }
    return true;
  });

  const ineligible = SCHOLARSHIPS.filter(s => {
    if (!s.level.includes(level)) return false;
    return pct !== null && pct < s.minMarks;
  });

  return (
    <>
      <Helmet>
        <title>Scholarship Eligibility Checker Pakistan 2025 | AIDLA</title>
        <meta name="description" content="Free scholarship eligibility checker for Pakistan 2025. Check HEC, Ehsaas, PM Laptop Scheme, Punjab PEEF, Sindh and Aga Khan scholarships. Enter your marks and income to see which scholarships you qualify for." />
        <meta name="keywords" content="scholarship eligibility Pakistan, HEC scholarship, Ehsaas scholarship, PM laptop scheme, PEEF scholarship, Pakistan scholarship 2025, student scholarship checker, AIDLA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/education/scholarship-eligibility" />
        <meta property="og:title" content="Scholarship Eligibility Checker Pakistan | AIDLA" />
        <meta property="og:description" content="Check HEC, Ehsaas, PM Laptop and more scholarships you qualify for." />
        <meta property="og:url" content="https://www.aidla.online/tools/education/scholarship-eligibility" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Scholarship Eligibility Checker by AIDLA","url":"https://www.aidla.online/tools/education/scholarship-eligibility",
          "description":"Free Pakistan scholarship eligibility checker — HEC, Ehsaas, PM Laptop and more.",
          "applicationCategory":"EducationApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .se-root*{box-sizing:border-box;margin:0;padding:0}
        .se-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .se-wrap{max-width:620px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .se-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .se-crumb a{color:#94a3b8;text-decoration:none}.se-crumb a:hover{color:#1a3a8f}
        .se-hero{text-align:center;margin-bottom:24px}
        .se-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(217,119,6,.25)}
        .se-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .se-accent{background:linear-gradient(135deg,#d97706,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .se-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:440px;margin:0 auto}
        .se-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .se-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .se-levels{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:4px}
        .se-level-btn{padding:10px 8px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:center}
        .se-level-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .se-fields{display:flex;flex-direction:column;gap:11px}
        .se-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .se-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .se-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .se-input:focus{border-color:rgba(217,119,6,.4);box-shadow:0 0 0 3px rgba(217,119,6,.07)}
        .se-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .se-check-btn{width:100%;padding:14px;border:none;border-radius:14px;background:linear-gradient(135deg,#d97706,#f59e0b);color:#0b1437;font-size:15px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;box-shadow:0 4px 16px rgba(217,119,6,.3)}
        .se-check-btn:hover{transform:translateY(-2px);filter:brightness(1.05)}
        /* Result summary */
        .se-summary{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:16px;padding:18px 20px;display:flex;align-items:center;gap:14px;margin-bottom:14px;flex-wrap:wrap}
        .se-sum-val{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:#fff;flex-shrink:0}
        .se-sum-label{font-size:12px;font-weight:700;color:rgba(255,255,255,.65);margin-bottom:3px}
        .se-sum-pct{font-size:13px;font-weight:800;color:#fbbf24}
        /* Scholarship card */
        .se-item{padding:16px;border-radius:16px;border:1.5px solid #e2e8f0;background:#fff;margin-bottom:10px;transition:all .13s}
        .se-item:hover{box-shadow:0 4px 16px rgba(11,20,55,.08);transform:translateY(-2px)}
        .se-item-header{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px;flex-wrap:wrap}
        .se-item-name{font-size:14px;font-weight:800;color:#0b1437;line-height:1.3}
        .se-item-org{font-size:11px;color:#64748b;margin-top:2px}
        .se-item-badges{display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0}
        .se-type-badge{font-size:9px;font-weight:800;padding:2px 8px;border-radius:99px;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}
        .se-item-desc{font-size:12px;color:#64748b;line-height:1.55;margin-bottom:10px}
        .se-item-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
        .se-amount{font-size:12px;font-weight:800;color:#059669;background:rgba(5,150,105,.08);padding:3px 10px;border-radius:99px;border:1px solid rgba(5,150,105,.15)}
        .se-link{font-size:11px;font-weight:700;color:#1a3a8f;text-decoration:none;padding:4px 10px;border:1px solid rgba(26,58,143,.2);border-radius:7px;transition:all .13s}
        .se-link:hover{background:rgba(26,58,143,.06)}
        .se-none{text-align:center;padding:28px 16px}
        .se-none-icon{font-size:36px;margin-bottom:10px}
        .se-ineligible-item{display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:11px;border:1px solid #f1f5f9;background:#fafafa;margin-bottom:7px}
        .se-inelig-name{font-size:12px;font-weight:700;color:#94a3b8}
        .se-inelig-why{font-size:10px;color:#cbd5e1;margin-top:2px}
        .se-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .se-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .se-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .se-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.se-levels{grid-template-columns:1fr 1fr}.se-cta{flex-direction:column;text-align:center}.se-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="se-root">
        <div className="se-wrap">
          <nav className="se-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Scholarship Eligibility</span></nav>

          <motion.div className="se-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="se-badge">🏆 Education Tool</div>
            <h1 className="se-h1"><span className="se-accent">Scholarship</span> Eligibility</h1>
            <p className="se-sub">Check which Pakistan scholarships you qualify for — HEC, Ehsaas, PM Laptop, PEEF and more.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="se-card">
              <span className="se-sec">Education Level</span>
              <div className="se-levels" style={{marginBottom:16}}>
                {LEVELS.map(l=>(
                  <button key={l.id} className={`se-level-btn${level===l.id?" active":""}`} onClick={()=>{setLevel(l.id);setChecked(false);}}>
                    {l.label}
                  </button>
                ))}
              </div>

              <span className="se-sec">Your Marks</span>
              <div className="se-fields">
                <div className="se-row2">
                  <div>
                    <label className="se-label">Marks Obtained</label>
                    <input className="se-input" type="number" inputMode="decimal" placeholder="e.g. 870" value={marks} onChange={e=>{setMarks(e.target.value);setChecked(false);}} />
                  </div>
                  <div>
                    <label className="se-label">Total Marks</label>
                    <input className="se-input" type="number" inputMode="decimal" placeholder="e.g. 1100" value={total} onChange={e=>{setTotal(e.target.value);setChecked(false);}} />
                  </div>
                </div>
                <div>
                  <label className="se-label">Monthly Family Income (PKR) — optional</label>
                  <input className="se-input" type="number" inputMode="numeric" placeholder="e.g. 35,000 (leave blank to see all)" value={income} onChange={e=>{setIncome(e.target.value);setChecked(false);}} />
                  <p style={{fontSize:10,color:"#94a3b8",marginTop:4}}>Used to check need-based scholarship eligibility</p>
                </div>
              </div>
            </div>

            <button className="se-check-btn" onClick={()=>setChecked(true)} disabled={!marks||!total}>
              🏆 Check Scholarship Eligibility
            </button>
          </motion.div>

          <AnimatePresence>
            {checked && pct !== null && (
              <motion.div key="results" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>

                {/* Summary */}
                <div className="se-summary">
                  <div className="se-sum-val">{results.length}</div>
                  <div>
                    <div className="se-sum-label">Scholarships You May Qualify For</div>
                    <div className="se-sum-pct">📊 Your Score: {pct.toFixed(1)}% — {LEVELS.find(l=>l.id===level)?.label}</div>
                  </div>
                </div>

                {/* Eligible */}
                {results.length > 0 ? (
                  <>
                    <span style={{fontSize:11,fontWeight:800,color:"#059669",textTransform:"uppercase",letterSpacing:".08em",display:"block",marginBottom:10}}>
                      ✅ {results.length} Eligible Scholarship{results.length>1?"s":""}
                    </span>
                    {results.map(s=>(
                      <motion.div key={s.id} className="se-item" style={{borderColor:`${s.color}22`}}
                        initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.22}}>
                        <div className="se-item-header">
                          <div>
                            <div className="se-item-name">{s.flag} {s.name}</div>
                            <div className="se-item-org">{s.org}</div>
                          </div>
                          <div className="se-item-badges">
                            <span className="se-type-badge" style={{background:`${s.color}15`,color:s.color,border:`1px solid ${s.color}25`}}>{s.type}</span>
                            <span className="se-type-badge" style={{background:"rgba(5,150,105,.1)",color:"#059669",border:"1px solid rgba(5,150,105,.2)"}}>Min {s.minMarks}%</span>
                          </div>
                        </div>
                        <div className="se-item-desc">{s.desc}</div>
                        <div className="se-item-footer">
                          <span className="se-amount">💰 {s.amount}</span>
                          <a className="se-link" href={s.link} target="_blank" rel="noopener noreferrer">Apply →</a>
                        </div>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <div className="se-none">
                    <div className="se-none-icon">😕</div>
                    <div style={{fontWeight:700,color:"#475569",marginBottom:6}}>No scholarships matched your criteria</div>
                    <div style={{fontSize:12,color:"#94a3b8",maxWidth:320,margin:"0 auto"}}>
                      Try improving your marks or check if income-based scholarships are available. Some scholarships require 60%+ marks.
                    </div>
                  </div>
                )}

                {/* Ineligible (close misses) */}
                {ineligible.length > 0 && (
                  <div style={{marginTop:16}}>
                    <span style={{fontSize:11,fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".08em",display:"block",marginBottom:10}}>
                      📋 Other Scholarships (Marks Below Minimum)
                    </span>
                    {ineligible.map(s=>(
                      <div key={s.id} className="se-ineligible-item">
                        <span style={{fontSize:16,flexShrink:0}}>{s.flag}</span>
                        <div>
                          <div className="se-inelig-name">{s.name}</div>
                          <div className="se-inelig-why">Requires {s.minMarks}% — you have {pct.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="se-cta">
              <div><h3>More Education Tools 🚀</h3><p>Grade calculator, CGPA calculator and more.</p></div>
              <Link to="/tools" className="se-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}