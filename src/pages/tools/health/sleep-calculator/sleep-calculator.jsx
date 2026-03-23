import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const CYCLE_MIN = 90; // each sleep cycle ~90 minutes
const FALL_ASLEEP = 14; // average time to fall asleep

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

function addMinutes(date, mins) {
  return new Date(date.getTime() + mins * 60000);
}

function getWakeUpTimes(bedtime) {
  const sleep = addMinutes(bedtime, FALL_ASLEEP);
  return [4, 5, 6].map(cycles => ({
    cycles,
    hours: (cycles * CYCLE_MIN) / 60,
    time: formatTime(addMinutes(sleep, cycles * CYCLE_MIN)),
    quality: cycles === 6 ? "Ideal" : cycles === 5 ? "Good" : "Minimum",
    color: cycles === 6 ? "#059669" : cycles === 5 ? "#0284c7" : "#d97706",
  }));
}

function getBedtimes(wakeup) {
  const wakeDate = new Date(`2000-01-01T${wakeup}`);
  return [4, 5, 6].map(cycles => {
    const sleepStart = new Date(wakeDate.getTime() - cycles * CYCLE_MIN * 60000);
    const bedtime    = new Date(sleepStart.getTime() - FALL_ASLEEP * 60000);
    return {
      cycles,
      hours: (cycles * CYCLE_MIN) / 60,
      time: formatTime(bedtime),
      quality: cycles === 6 ? "Ideal" : cycles === 5 ? "Good" : "Minimum",
      color: cycles === 6 ? "#059669" : cycles === 5 ? "#0284c7" : "#d97706",
    };
  });
}

const AGE_REC = [
  { label: "Infant (0–1)", rec: "12–16 hrs" },
  { label: "Toddler (1–2)", rec: "11–14 hrs" },
  { label: "Preschool (3–5)", rec: "10–13 hrs" },
  { label: "School Age (6–12)", rec: "9–12 hrs" },
  { label: "Teen (13–17)", rec: "8–10 hrs" },
  { label: "Adult (18–60)", rec: "7–9 hrs" },
  { label: "Senior (61+)", rec: "7–8 hrs" },
];

export default function SleepCalculator() {
  const [mode,    setMode]    = useState("bedtime"); // bedtime | wakeup | now
  const [bedtime, setBedtime] = useState("22:30");
  const [wakeup,  setWakeup]  = useState("06:30");

  const wakeupTimes = mode === "bedtime" || mode === "now"
    ? getWakeUpTimes(mode === "now" ? new Date() : new Date(`2000-01-01T${bedtime}`))
    : null;

  const bedtimes = mode === "wakeup" ? getBedtimes(wakeup) : null;

  return (
    <>
      <Helmet>
        <title>Sleep Calculator — Best Bedtime & Wake-Up Time | AIDLA</title>
        <meta name="description" content="Free sleep calculator. Find the best time to go to sleep or wake up based on 90-minute sleep cycles. Calculate optimal bedtime for any wake-up time. Science-based sleep tool." />
        <meta name="keywords" content="sleep calculator, bedtime calculator, wake up time calculator, sleep cycle calculator, best time to sleep, 90 minute sleep cycle, AIDLA sleep tool" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/health/sleep-calculator" />
        <meta property="og:title" content="Sleep Calculator | AIDLA" />
        <meta property="og:description" content="Find the best bedtime or wake-up time based on 90-minute sleep cycles." />
        <meta property="og:url" content="https://www.aidla.online/tools/health/sleep-calculator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Sleep Calculator by AIDLA","url":"https://www.aidla.online/tools/health/sleep-calculator",
          "description":"Free sleep cycle calculator — optimal bedtime and wake-up times.",
          "applicationCategory":"HealthApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .sl-root*{box-sizing:border-box;margin:0;padding:0}
        .sl-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .sl-wrap{max-width:560px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .sl-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .sl-crumb a{color:#94a3b8;text-decoration:none}.sl-crumb a:hover{color:#1a3a8f}
        .sl-hero{text-align:center;margin-bottom:24px}
        .sl-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#1a3a8f,#3b82f6);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(26,58,143,.25)}
        .sl-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .sl-accent{background:linear-gradient(135deg,#1a3a8f,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sl-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .sl-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .sl-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .sl-modes{display:flex;flex-direction:column;gap:8px;margin-bottom:4px}
        .sl-mode-btn{display:flex;align-items:center;gap:10px;padding:11px 13px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:left;width:100%}
        .sl-mode-btn.active{border-color:rgba(26,58,143,.3);background:rgba(26,58,143,.06)}
        .sl-mode-dot{width:8px;height:8px;border-radius:50%;background:#e2e8f0;flex-shrink:0;transition:background .13s}
        .sl-mode-btn.active .sl-mode-dot{background:#1a3a8f}
        .sl-mode-title{font-size:13px;font-weight:800;color:#0b1437}
        .sl-mode-desc{font-size:11px;color:#94a3b8;margin-top:1px}
        .sl-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .sl-input{width:100%;padding:12px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .sl-input:focus{border-color:rgba(26,58,143,.4);box-shadow:0 0 0 3px rgba(26,58,143,.07)}
        /* Results */
        .sl-results{display:flex;flex-direction:column;gap:10px;margin-bottom:14px}
        .sl-result-item{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-radius:14px;border:1.5px solid #e2e8f0;background:#fff;transition:all .13s}
        .sl-result-time{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900}
        .sl-result-detail{text-align:right;flex-shrink:0}
        .sl-result-cycles{font-size:11px;font-weight:700;color:#64748b}
        .sl-result-badge{display:inline-block;font-size:9px;font-weight:800;padding:2px 8px;border-radius:99px;margin-top:3px}
        .sl-science{background:rgba(26,58,143,.06);border:1px solid rgba(26,58,143,.12);border-radius:12px;padding:13px 14px;font-size:12px;color:#1a3a8f;line-height:1.7;margin-bottom:14px}
        /* Age table */
        .sl-age-table{border-radius:14px;overflow:hidden;border:1px solid rgba(59,130,246,.1);margin-bottom:14px}
        .sl-age-hdr{display:grid;grid-template-columns:1.5fr 1fr;padding:9px 14px;background:#f8faff;font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #f1f5f9}
        .sl-age-row{display:grid;grid-template-columns:1.5fr 1fr;padding:9px 14px;border-bottom:1px solid #f1f5f9;font-size:12px;background:#fff}
        .sl-age-row:last-child{border-bottom:none}
        .sl-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .sl-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .sl-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .sl-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.sl-cta{flex-direction:column;text-align:center}.sl-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="sl-root">
        <div className="sl-wrap">
          <nav className="sl-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Sleep Calculator</span></nav>

          <motion.div className="sl-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="sl-badge">😴 Health Tool</div>
            <h1 className="sl-h1"><span className="sl-accent">Sleep</span> Calculator</h1>
            <p className="sl-sub">Find the best time to wake up or go to sleep based on 90-minute sleep cycles.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="sl-card">
              <span className="sl-sec">What do you want to calculate?</span>
              <div className="sl-modes">
                {[
                  {id:"bedtime", title:"I'm going to bed now / at a specific time",   desc:"→ Tell me the best times to wake up"},
                  {id:"wakeup",  title:"I need to wake up at a specific time",          desc:"→ Tell me the best times to go to sleep"},
                  {id:"now",     title:"I want to sleep RIGHT NOW",                      desc:"→ Best wake-up times from this moment"},
                ].map(m=>(
                  <button key={m.id} className={`sl-mode-btn${mode===m.id?" active":""}`} onClick={()=>setMode(m.id)}>
                    <div className="sl-mode-dot"/>
                    <div><div className="sl-mode-title">{m.title}</div><div className="sl-mode-desc">{m.desc}</div></div>
                  </button>
                ))}
              </div>

              {mode === "bedtime" && (
                <div style={{marginTop:14}}>
                  <label className="sl-label">Bedtime</label>
                  <input className="sl-input" type="time" value={bedtime} onChange={e=>setBedtime(e.target.value)} />
                </div>
              )}
              {mode === "wakeup" && (
                <div style={{marginTop:14}}>
                  <label className="sl-label">Wake-Up Time</label>
                  <input className="sl-input" type="time" value={wakeup} onChange={e=>setWakeup(e.target.value)} />
                </div>
              )}
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {(wakeupTimes || bedtimes) && (
              <motion.div key="result" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="sl-card">
                  <span className="sl-sec">{wakeupTimes ? "💡 Best Wake-Up Times" : "🌙 Best Bedtimes"}</span>
                  <div className="sl-results">
                    {(wakeupTimes || bedtimes).reverse().map(r=>(
                      <div key={r.cycles} className="sl-result-item" style={{borderColor:`${r.color}30`}}>
                        <div>
                          <div className="sl-result-time" style={{color:r.color}}>{r.time}</div>
                          <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{r.cycles} cycles · {r.hours} hours of sleep</div>
                        </div>
                        <div className="sl-result-detail">
                          <div className="sl-result-badge" style={{background:`${r.color}15`,color:r.color,border:`1px solid ${r.color}25`}}>{r.quality}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize:11,color:"#94a3b8",textAlign:"center"}}>Includes ~{FALL_ASLEEP} min to fall asleep</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Science note */}
          <div className="sl-science">
            🧠 <strong>How it works:</strong> Each sleep cycle lasts ~90 minutes and includes light sleep, deep sleep and REM. Waking mid-cycle causes grogginess. Waking at the END of a cycle = refreshed. This calculator times your alarm to the end of a cycle.
          </div>

          {/* Age recommendations */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.15}}>
            <div className="sl-card">
              <span className="sl-sec">Recommended Sleep by Age (WHO)</span>
              <div className="sl-age-table">
                <div className="sl-age-hdr"><span>Age Group</span><span>Recommended</span></div>
                {AGE_REC.map(a=>(
                  <div key={a.label} className="sl-age-row">
                    <span style={{fontWeight:600,color:"#475569"}}>{a.label}</span>
                    <span style={{fontWeight:800,color:"#0b1437"}}>{a.rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="sl-cta">
              <div><h3>More Health Tools 🚀</h3><p>BMI, Calorie, Water intake and more.</p></div>
              <Link to="/tools" className="sl-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}