import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const ACTIVITY = [
  { id: "low",      label: "Low",      desc: "Desk job, minimal exercise",   mult: 1.0  },
  { id: "moderate", label: "Moderate", desc: "Some exercise or outdoor work", mult: 1.15 },
  { id: "high",     label: "High",     desc: "Daily intense exercise",        mult: 1.3  },
];

const CLIMATE = [
  { id: "cool",    label: "🌤️ Cool / Indoor",   mult: 1.0  },
  { id: "hot",     label: "☀️ Hot / Humid",      mult: 1.15 },
  { id: "extreme", label: "🌡️ Extreme Heat",     mult: 1.25 },
];

export default function WaterIntakeCalculator() {
  const [weight,   setWeight]   = useState("");
  const [unit,     setUnit]     = useState("kg");
  const [activity, setActivity] = useState("moderate");
  const [climate,  setClimate]  = useState("cool");
  const [pregnant, setPregnant] = useState(false);
  const [nursing,  setNursing]  = useState(false);

  const w = parseFloat(weight);
  const weightKg = (!isNaN(w) && w > 0) ? (unit === "kg" ? w : w * 0.453592) : null;

  const base = weightKg ? weightKg * 0.033 : null; // 33ml per kg
  const actMult  = ACTIVITY.find(a => a.id === activity)?.mult || 1;
  const climMult = CLIMATE.find(c => c.id === climate)?.mult || 1;
  const extra    = (pregnant ? 0.3 : 0) + (nursing ? 0.5 : 0);
  const daily    = base ? (base * actMult * climMult + extra) : null;

  const glasses  = daily ? Math.ceil(daily / 0.25) : null; // 250ml per glass
  const bottles  = daily ? (daily / 1.5).toFixed(1) : null; // 1.5L bottles

  const pct = (level) => {
    if (!daily) return 0;
    const targets = [daily * 0.25, daily * 0.5, daily * 0.75, daily];
    return Math.min(100, (level / daily) * 100);
  };

  const hourly = daily ? (daily / 16).toFixed(2) : null; // spread over 16 waking hours

  return (
    <>
      <Helmet>
        <title>Water Intake Calculator — Daily Water Needs | AIDLA</title>
        <meta name="description" content="Free water intake calculator. Find out how much water you should drink daily based on weight, activity level and climate. Shows glasses, bottles and hourly intake tips." />
        <meta name="keywords" content="water intake calculator, daily water calculator, how much water should I drink, hydration calculator, water per day, 8 glasses water myth, AIDLA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/health/water-intake-calculator" />
        <meta property="og:title" content="Water Intake Calculator | AIDLA" />
        <meta property="og:description" content="How much water should you drink daily? Find out instantly." />
        <meta property="og:url" content="https://www.aidla.online/tools/health/water-intake-calculator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Water Intake Calculator by AIDLA","url":"https://www.aidla.online/tools/health/water-intake-calculator",
          "description":"Free daily water intake calculator based on weight and activity.",
          "applicationCategory":"HealthApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .wi-root*{box-sizing:border-box;margin:0;padding:0}
        .wi-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .wi-wrap{max-width:560px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .wi-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .wi-crumb a{color:#94a3b8;text-decoration:none}.wi-crumb a:hover{color:#1a3a8f}
        .wi-hero{text-align:center;margin-bottom:24px}
        .wi-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#0284c7,#38bdf8);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(2,132,199,.25)}
        .wi-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .wi-accent{background:linear-gradient(135deg,#0284c7,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .wi-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:400px;margin:0 auto}
        .wi-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .wi-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .wi-unit-toggle{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
        .wi-ut-btn{padding:9px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;font-size:13px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .wi-ut-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .wi-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .wi-input{width:100%;padding:12px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .wi-input:focus{border-color:rgba(2,132,199,.4);box-shadow:0 0 0 3px rgba(2,132,199,.07)}
        .wi-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .wi-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:4px}
        .wi-opt{padding:9px 6px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:11px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:center}
        .wi-opt.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .wi-opt-desc{font-size:9px;color:#94a3b8;margin-top:2px;font-weight:600}
        .wi-check-row{display:flex;align-items:center;gap:10px;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:12px;cursor:pointer;margin-bottom:6px;background:#fff;transition:all .13s;user-select:none}
        .wi-check-row.active{border-color:rgba(2,132,199,.3);background:rgba(2,132,199,.05)}
        .wi-check{width:18px;height:18px;border-radius:5px;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .13s;font-size:11px}
        .wi-check.on{background:#0284c7;border-color:#0284c7;color:#fff}
        .wi-check-label{font-size:13px;font-weight:700;color:#475569}
        /* Result */
        .wi-result{background:linear-gradient(135deg,#0b1437,#0284c7);border-radius:20px;padding:24px 20px;text-align:center;margin-bottom:14px}
        .wi-result-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
        .wi-result-val{font-family:'Playfair Display',serif;font-size:clamp(2.5rem,9vw,3.5rem);font-weight:900;color:#fff;line-height:1}
        .wi-result-sub{font-size:12px;color:rgba(255,255,255,.6);margin-top:4px}
        .wi-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}
        .wi-stat{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:14px;padding:13px;text-align:center}
        .wi-stat-val{font-size:20px;font-weight:900;color:#0b1437;margin-bottom:3px}
        .wi-stat-lbl{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em}
        /* Glasses visual */
        .wi-glasses{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;padding:16px;background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:16px;margin-bottom:14px}
        .wi-glass{font-size:20px;transition:all .2s}
        .wi-tip{background:rgba(2,132,199,.06);border:1px solid rgba(2,132,199,.15);border-radius:12px;padding:12px 14px;font-size:12px;color:#0284c7;line-height:1.7}
        .wi-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .wi-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .wi-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .wi-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.wi-stats-grid{grid-template-columns:repeat(3,1fr)}.wi-cta{flex-direction:column;text-align:center}.wi-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="wi-root">
        <div className="wi-wrap">
          <nav className="wi-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Water Intake Calculator</span></nav>

          <motion.div className="wi-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="wi-badge">💧 Health Tool</div>
            <h1 className="wi-h1"><span className="wi-accent">Water Intake</span> Calculator</h1>
            <p className="wi-sub">Find out exactly how much water you should drink daily based on your body and lifestyle.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="wi-card">
              <span className="wi-sec">Your Weight</span>
              <div className="wi-unit-toggle">
                {["kg","lbs"].map(u=><button key={u} className={`wi-ut-btn${unit===u?" active":""}`} onClick={()=>setUnit(u)}>{u==="kg"?"📏 Kilograms":"🇺🇸 Pounds"}</button>)}
              </div>
              <label className="wi-label">Body Weight ({unit})</label>
              <input className="wi-input" type="number" inputMode="decimal" placeholder={unit==="kg"?"e.g. 70":"e.g. 154"} value={weight} onChange={e=>setWeight(e.target.value)} />
            </div>

            <div className="wi-card">
              <span className="wi-sec">Activity Level</span>
              <div className="wi-grid3">
                {ACTIVITY.map(a=>(
                  <button key={a.id} className={`wi-opt${activity===a.id?" active":""}`} onClick={()=>setActivity(a.id)}>
                    {a.label}<div className="wi-opt-desc">{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="wi-card">
              <span className="wi-sec">Climate</span>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {CLIMATE.map(c=>(
                  <button key={c.id} className={`wi-opt${climate===c.id?" active":""}`} style={{textAlign:"left",padding:"10px 13px"}} onClick={()=>setClimate(c.id)}>{c.label}</button>
                ))}
              </div>
            </div>

            <div className="wi-card">
              <span className="wi-sec">Additional Factors</span>
              {[
                {label:"🤰 Pregnant",val:pregnant,set:setPregnant},
                {label:"🤱 Breastfeeding / Nursing",val:nursing,set:setNursing},
              ].map(f=>(
                <div key={f.label} className={`wi-check-row${f.val?" active":""}`} onClick={()=>f.set(v=>!v)}>
                  <div className={`wi-check${f.val?" on":""}`}>{f.val?"✓":""}</div>
                  <span className="wi-check-label">{f.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {daily && (
              <motion.div key="result" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="wi-result">
                  <div className="wi-result-label">Daily Water Intake</div>
                  <div className="wi-result-val">{daily.toFixed(1)} L</div>
                  <div className="wi-result-sub">{(daily * 1000).toFixed(0)} ml per day</div>
                </div>

                <div className="wi-stats-grid">
                  <div className="wi-stat"><div className="wi-stat-val" style={{color:"#0284c7"}}>{glasses}</div><div className="wi-stat-lbl">Glasses (250ml)</div></div>
                  <div className="wi-stat"><div className="wi-stat-val" style={{color:"#7c3aed"}}>{bottles}</div><div className="wi-stat-lbl">Bottles (1.5L)</div></div>
                  <div className="wi-stat"><div className="wi-stat-val" style={{color:"#059669"}}>{parseFloat(hourly).toFixed(2)}L</div><div className="wi-stat-lbl">Per Hour</div></div>
                </div>

                {glasses && (
                  <div className="wi-glasses" aria-label={`${glasses} glasses of water`}>
                    {Array.from({length:Math.min(glasses,16)}).map((_,i)=>(
                      <span key={i} className="wi-glass">🥤</span>
                    ))}
                    {glasses > 16 && <span style={{fontSize:12,color:"#94a3b8",alignSelf:"center"}}>+{glasses-16} more</span>}
                  </div>
                )}

                <div className="wi-tip">
                  💡 <strong>Hydration tips:</strong> Drink a glass of water when you wake up. Have a glass before each meal. Keep a water bottle at your desk. In hot weather ({climate==="hot"||climate==="extreme"?"like your current setting":"like Dubai summers"}), increase intake by 15–25%.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="wi-cta">
              <div><h3>More Health Tools 🚀</h3><p>BMI calculator, Calorie calculator, Sleep and more.</p></div>
              <Link to="/tools" className="wi-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}