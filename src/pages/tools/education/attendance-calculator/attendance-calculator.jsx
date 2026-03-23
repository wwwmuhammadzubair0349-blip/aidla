import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

export default function AttendanceCalculator() {
  const [total,    setTotal]    = useState("");
  const [attended, setAttended] = useState("");
  const [required, setRequired] = useState("75");
  const [mode,     setMode]     = useState("check"); // check | howmany

  const t = parseFloat(total),   a = parseFloat(attended), r = parseFloat(required);
  const pct = (!isNaN(t) && !isNaN(a) && t > 0) ? (a / t) * 100 : null;
  const isEligible = pct !== null ? pct >= r : null;

  // How many more classes to attend to reach required %
  const classesNeeded = useMemo(() => {
    if (isNaN(t) || isNaN(a) || isNaN(r) || t <= 0) return null;
    if (pct >= r) return 0;
    // (a + x) / (t + x) >= r/100  => x >= (r*t - 100*a) / (100 - r)
    const x = (r * t - 100 * a) / (100 - r);
    return Math.ceil(x);
  }, [t, a, r, pct]);

  // How many classes can be skipped while staying above required %
  const canSkip = useMemo(() => {
    if (isNaN(t) || isNaN(a) || isNaN(r) || t <= 0 || pct < r) return null;
    // a / (t + x) >= r/100  => x <= (100*a/r) - t
    const x = Math.floor((100 * a / r) - t);
    return Math.max(0, x);
  }, [t, a, r, pct]);

  const getColor = () => {
    if (pct === null) return "#64748b";
    if (pct >= r + 10) return "#059669";
    if (pct >= r)       return "#0284c7";
    if (pct >= r - 10)  return "#d97706";
    return "#dc2626";
  };
  const color = getColor();

  return (
    <>
      <Helmet>
        <title>Attendance Calculator — Check Eligibility & Classes Needed | AIDLA</title>
        <meta name="description" content="Free attendance calculator for students. Check if you meet the required attendance percentage, see how many classes you can skip, or how many you need to attend. Pakistan university tool." />
        <meta name="keywords" content="attendance calculator, attendance percentage calculator, classes needed calculator, can I skip class, university attendance Pakistan, 75% attendance calculator, AIDLA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/education/attendance-calculator" />
        <meta property="og:title" content="Attendance Calculator | AIDLA" />
        <meta property="og:description" content="Check attendance eligibility, calculate classes to attend or skip." />
        <meta property="og:url" content="https://www.aidla.online/tools/education/attendance-calculator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Attendance Calculator by AIDLA","url":"https://www.aidla.online/tools/education/attendance-calculator",
          "description":"Free attendance calculator for students — eligibility check and projection.",
          "applicationCategory":"EducationApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .ac-root*{box-sizing:border-box;margin:0;padding:0}
        .ac-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .ac-wrap{max-width:560px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .ac-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .ac-crumb a{color:#94a3b8;text-decoration:none}.ac-crumb a:hover{color:#1a3a8f}
        .ac-hero{text-align:center;margin-bottom:24px}
        .ac-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#0284c7,#38bdf8);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(2,132,199,.25)}
        .ac-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .ac-accent{background:linear-gradient(135deg,#0284c7,#0b1437);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ac-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .ac-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .ac-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .ac-toggle{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
        .ac-tog-btn{padding:10px 8px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;text-align:center}
        .ac-tog-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .ac-fields{display:flex;flex-direction:column;gap:11px}
        .ac-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .ac-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none}
        .ac-input:focus{border-color:rgba(2,132,199,.4);box-shadow:0 0 0 3px rgba(2,132,199,.07)}
        .ac-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .ac-req-btns{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
        .ac-req-btn{padding:5px 12px;border-radius:99px;border:1.5px solid #e2e8f0;background:#fff;font-size:11px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .ac-req-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        /* Progress circle */
        .ac-progress{display:flex;justify-content:center;margin:18px 0 6px}
        /* Result cards */
        .ac-result-main{border-radius:16px;padding:22px 20px;text-align:center;margin-bottom:12px}
        .ac-result-pct{font-family:'Playfair Display',serif;font-size:clamp(2.5rem,10vw,3.5rem);font-weight:900;color:#fff;line-height:1}
        .ac-result-lbl{font-size:11px;font-weight:700;color:rgba(255,255,255,.65);text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}
        .ac-result-status{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:99px;font-size:12px;font-weight:800;margin-top:10px;background:rgba(255,255,255,.15);color:#fff}
        .ac-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
        .ac-info-box{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:14px;padding:14px;text-align:center}
        .ac-info-val{font-size:22px;font-weight:900;color:#0b1437;margin-bottom:3px}
        .ac-info-lbl{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em}
        .ac-warn{background:rgba(220,38,38,.06);border:1px solid rgba(220,38,38,.15);border-radius:12px;padding:12px 14px;font-size:12px;color:#dc2626;line-height:1.6}
        .ac-good{background:rgba(5,150,105,.06);border:1px solid rgba(5,150,105,.15);border-radius:12px;padding:12px 14px;font-size:12px;color:#059669;line-height:1.6}
        .ac-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .ac-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .ac-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .ac-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.ac-info-grid{grid-template-columns:1fr 1fr}.ac-cta{flex-direction:column;text-align:center}.ac-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="ac-root">
        <div className="ac-wrap">
          <nav className="ac-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Attendance Calculator</span></nav>

          <motion.div className="ac-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="ac-badge">📅 Education Tool</div>
            <h1 className="ac-h1"><span className="ac-accent">Attendance</span> Calculator</h1>
            <p className="ac-sub">Check if you meet the required attendance, see how many classes you can skip, or need to attend.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="ac-card">
              <span className="ac-sec">Calculator Mode</span>
              <div className="ac-toggle">
                <button className={`ac-tog-btn${mode==="check"?" active":""}`} onClick={()=>setMode("check")}>✅ Check Status</button>
                <button className={`ac-tog-btn${mode==="project"?" active":""}`} onClick={()=>setMode("project")}>🔮 Projection</button>
              </div>

              <div className="ac-fields">
                <div>
                  <label className="ac-label">Total Classes Held</label>
                  <input className="ac-input" type="number" inputMode="numeric" placeholder="e.g. 60" value={total} onChange={e=>setTotal(e.target.value)} />
                </div>
                <div>
                  <label className="ac-label">Classes Attended</label>
                  <input className="ac-input" type="number" inputMode="numeric" placeholder="e.g. 48" value={attended} onChange={e=>setAttended(e.target.value)} />
                </div>
                <div>
                  <label className="ac-label">Required Attendance (%)</label>
                  <input className="ac-input" type="number" inputMode="numeric" placeholder="e.g. 75" value={required} onChange={e=>setRequired(e.target.value)} />
                  <div className="ac-req-btns">
                    {["60","75","80","85"].map(v=>(
                      <button key={v} className={`ac-req-btn${required===v?" active":""}`} onClick={()=>setRequired(v)}>{v}%</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {pct !== null && (
              <motion.div key="result" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                {/* Main result */}
                <div className="ac-result-main" style={{background:`linear-gradient(135deg,${color},${color}bb)`}}>
                  <div className="ac-result-lbl">Your Attendance</div>
                  <div className="ac-result-pct">{pct.toFixed(1)}%</div>
                  <div className="ac-result-status">
                    {isEligible ? "✅ Eligible for Exam" : "❌ Not Eligible"}
                  </div>
                </div>

                {/* Info grid */}
                <div className="ac-info-grid">
                  <div className="ac-info-box">
                    <div className="ac-info-val">{attended || 0}</div>
                    <div className="ac-info-lbl">Attended</div>
                  </div>
                  <div className="ac-info-box">
                    <div className="ac-info-val">{total && attended ? Math.round(parseFloat(total) - parseFloat(attended)) : 0}</div>
                    <div className="ac-info-lbl">Missed</div>
                  </div>
                  {mode === "project" && canSkip !== null && (
                    <div className="ac-info-box">
                      <div className="ac-info-val" style={{color:"#059669"}}>{canSkip}</div>
                      <div className="ac-info-lbl">Can Skip</div>
                    </div>
                  )}
                  {mode === "project" && classesNeeded !== null && classesNeeded > 0 && (
                    <div className="ac-info-box">
                      <div className="ac-info-val" style={{color:"#dc2626"}}>{classesNeeded}</div>
                      <div className="ac-info-lbl">Need to Attend</div>
                    </div>
                  )}
                </div>

                {/* Message */}
                {isEligible
                  ? <div className="ac-good">✅ You have <strong>{pct.toFixed(1)}%</strong> attendance — above the required <strong>{required}%</strong>.{canSkip !== null && canSkip > 0 ? ` You can miss up to ${canSkip} more class${canSkip > 1 ? "es" : ""} and still remain eligible.` : ""}</div>
                  : <div className="ac-warn">⚠️ Your attendance is <strong>{pct.toFixed(1)}%</strong> — below the required <strong>{required}%</strong>. You need to attend <strong>{classesNeeded} more class{classesNeeded > 1 ? "es" : ""}</strong> consecutively to become eligible.</div>
                }
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="ac-cta">
              <div><h3>More Education Tools 🚀</h3><p>Grade calculator, CGPA calculator and more.</p></div>
              <Link to="/tools" className="ac-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}