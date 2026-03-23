import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const ACTIVITY_LEVELS = [
  { id: "sedentary",  label: "Sedentary",       desc: "Little or no exercise",         mult: 1.2  },
  { id: "light",      label: "Lightly Active",  desc: "Light exercise 1–3 days/week",  mult: 1.375},
  { id: "moderate",   label: "Moderately Active",desc: "Moderate exercise 3–5 days/week",mult:1.55 },
  { id: "active",     label: "Very Active",      desc: "Hard exercise 6–7 days/week",   mult: 1.725},
  { id: "extreme",    label: "Extra Active",     desc: "Very hard exercise, physical job",mult:1.9  },
];

const GOALS = [
  { id: "lose2",   label: "Lose 1 kg/week",    adj: -1000, color: "#dc2626" },
  { id: "lose1",   label: "Lose 0.5 kg/week",  adj: -500,  color: "#ea580c" },
  { id: "maintain",label: "Maintain Weight",   adj: 0,     color: "#059669" },
  { id: "gain1",   label: "Gain 0.5 kg/week",  adj: 500,   color: "#0284c7" },
  { id: "gain2",   label: "Gain 1 kg/week",    adj: 1000,  color: "#7c3aed" },
];

function calcBMR(weight, height, age, gender, unit) {
  let w = parseFloat(weight), h = parseFloat(height), a = parseFloat(age);
  if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) return null;
  if (unit === "imperial") { w = w * 0.453592; h = h * 2.54; }
  // Mifflin-St Jeor
  if (gender === "male")   return 10 * w + 6.25 * h - 5 * a + 5;
  return 10 * w + 6.25 * h - 5 * a - 161;
}

const fmt = (n) => Math.round(n).toLocaleString();

export default function CalorieCalculator() {
  const [unit,     setUnit]     = useState("metric");
  const [gender,   setGender]   = useState("male");
  const [weight,   setWeight]   = useState("");
  const [height,   setHeight]   = useState("");
  const [age,      setAge]      = useState("");
  const [activity, setActivity] = useState("moderate");
  const [goal,     setGoal]     = useState("maintain");

  const bmr  = calcBMR(weight, height, age, gender, unit);
  const actMult = ACTIVITY_LEVELS.find(a => a.id === activity)?.mult || 1.55;
  const tdee = bmr ? bmr * actMult : null;
  const goalAdj = GOALS.find(g => g.id === goal)?.adj || 0;
  const targetCalories = tdee ? Math.max(1200, tdee + goalAdj) : null;
  const goalColor = GOALS.find(g => g.id === goal)?.color || "#059669";

  const macros = targetCalories ? {
    protein: Math.round(targetCalories * 0.30 / 4),
    carbs:   Math.round(targetCalories * 0.45 / 4),
    fat:     Math.round(targetCalories * 0.25 / 9),
  } : null;

  return (
    <>
      <Helmet>
        <title>Calorie Calculator — Daily Calorie Needs & Macros | AIDLA</title>
        <meta name="description" content="Free calorie calculator. Calculate your daily calorie needs based on age, weight, height and activity level. Shows TDEE, goal calories and macro breakdown for weight loss, maintenance or gain." />
        <meta name="keywords" content="calorie calculator, TDEE calculator, daily calories, weight loss calories, calorie intake calculator, macros calculator, BMR calculator, AIDLA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/health/calorie-calculator" />
        <meta property="og:title" content="Calorie Calculator | AIDLA" />
        <meta property="og:description" content="Calculate daily calorie needs and macros for your fitness goal." />
        <meta property="og:url" content="https://www.aidla.online/tools/health/calorie-calculator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Calorie Calculator by AIDLA","url":"https://www.aidla.online/tools/health/calorie-calculator",
          "description":"Free TDEE and calorie calculator with macro breakdown.",
          "applicationCategory":"HealthApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .cc-root*{box-sizing:border-box;margin:0;padding:0}
        .cc-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .cc-wrap{max-width:580px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .cc-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .cc-crumb a{color:#94a3b8;text-decoration:none}.cc-crumb a:hover{color:#1a3a8f}
        .cc-hero{text-align:center;margin-bottom:24px}
        .cc-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#ea580c,#f97316);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(234,88,12,.25)}
        .cc-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .cc-accent{background:linear-gradient(135deg,#ea580c,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .cc-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .cc-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .cc-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .cc-toggle{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px}
        .cc-tog-btn{padding:10px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:13px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .cc-tog-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .cc-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px}
        .cc-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .cc-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .cc-input:focus{border-color:rgba(234,88,12,.4);box-shadow:0 0 0 3px rgba(234,88,12,.07)}
        .cc-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .cc-activity-list{display:flex;flex-direction:column;gap:7px}
        .cc-act-btn{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 13px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:left;width:100%}
        .cc-act-btn.active{border-color:rgba(234,88,12,.3);background:rgba(234,88,12,.05)}
        .cc-act-name{font-size:13px;font-weight:800;color:#0b1437}
        .cc-act-desc{font-size:11px;color:#94a3b8;margin-top:1px}
        .cc-act-dot{width:8px;height:8px;border-radius:50%;background:#e2e8f0;flex-shrink:0;transition:background .13s}
        .cc-act-btn.active .cc-act-dot{background:#ea580c}
        .cc-goals{display:flex;flex-direction:column;gap:7px}
        .cc-goal-btn{display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:left;width:100%}
        .cc-goal-btn.active{border-color:var(--gc);background:color-mix(in srgb,var(--gc) 8%,white)}
        .cc-goal-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
        .cc-goal-label{font-size:13px;font-weight:800;color:#0b1437}
        /* Result */
        .cc-result{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:24px 20px;margin-bottom:14px}
        .cc-result-top{text-align:center;margin-bottom:18px}
        .cc-result-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
        .cc-result-val{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,8vw,3rem);font-weight:900;color:#fff;line-height:1}
        .cc-result-sub{font-size:12px;color:rgba(255,255,255,.6);margin-top:4px}
        .cc-result-rows{display:flex;flex-direction:column;gap:8px}
        .cc-rrow{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(255,255,255,.08);border-radius:10px;font-size:13px}
        .cc-rrow-l{color:rgba(255,255,255,.65);font-weight:600}
        .cc-rrow-v{font-weight:800;color:#fff}
        /* Macros */
        .cc-macros{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}
        .cc-macro{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:14px;padding:14px;text-align:center}
        .cc-macro-val{font-size:22px;font-weight:900;color:#0b1437;margin-bottom:3px}
        .cc-macro-lbl{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em}
        .cc-macro-sub{font-size:10px;color:#cbd5e1;margin-top:1px}
        .cc-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .cc-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .cc-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .cc-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.cc-macros{grid-template-columns:repeat(3,1fr)}.cc-cta{flex-direction:column;text-align:center}.cc-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="cc-root">
        <div className="cc-wrap">
          <nav className="cc-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Calorie Calculator</span></nav>

          <motion.div className="cc-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="cc-badge">🔥 Health Tool</div>
            <h1 className="cc-h1"><span className="cc-accent">Calorie</span> Calculator</h1>
            <p className="cc-sub">Calculate your daily calorie needs based on age, weight, height and activity level.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="cc-card">
              <span className="cc-sec">Unit & Gender</span>
              <div className="cc-toggle" style={{marginBottom:10}}>
                {["metric","imperial"].map(u=><button key={u} className={`cc-tog-btn${unit===u?" active":""}`} onClick={()=>setUnit(u)}>{u==="metric"?"📏 Metric (kg/cm)":"🇺🇸 Imperial (lbs/in)"}</button>)}
              </div>
              <div className="cc-toggle">
                {["male","female"].map(g=><button key={g} className={`cc-tog-btn${gender===g?" active":""}`} onClick={()=>setGender(g)}>{g==="male"?"👨 Male":"👩 Female"}</button>)}
              </div>
              <div className="cc-fields" style={{marginTop:14}}>
                {[
                  {label:`Age (years)`,ph:"e.g. 25",val:age,set:setAge},
                  {label:`Weight (${unit==="metric"?"kg":"lbs"})`,ph:unit==="metric"?"e.g. 70":"e.g. 154",val:weight,set:setWeight},
                  {label:`Height (${unit==="metric"?"cm":"inches"})`,ph:unit==="metric"?"e.g. 175":"e.g. 69",val:height,set:setHeight},
                ].map(f=>(
                  <div key={f.label}>
                    <label className="cc-label">{f.label}</label>
                    <input className="cc-input" type="number" inputMode="decimal" placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="cc-card">
              <span className="cc-sec">Activity Level</span>
              <div className="cc-activity-list">
                {ACTIVITY_LEVELS.map(a=>(
                  <button key={a.id} className={`cc-act-btn${activity===a.id?" active":""}`} onClick={()=>setActivity(a.id)}>
                    <div><div className="cc-act-name">{a.label}</div><div className="cc-act-desc">{a.desc}</div></div>
                    <div className="cc-act-dot"/>
                  </button>
                ))}
              </div>
            </div>

            <div className="cc-card">
              <span className="cc-sec">Goal</span>
              <div className="cc-goals">
                {GOALS.map(g=>(
                  <button key={g.id} className={`cc-goal-btn${goal===g.id?" active":""}`} style={{"--gc":g.color}} onClick={()=>setGoal(g.id)}>
                    <div className="cc-goal-dot" style={{background:g.color}}/>
                    <span className="cc-goal-label">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {targetCalories && (
              <motion.div key="result" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="cc-result">
                  <div className="cc-result-top">
                    <div className="cc-result-label">Daily Calorie Target</div>
                    <div className="cc-result-val">{fmt(targetCalories)}</div>
                    <div className="cc-result-sub">calories per day</div>
                  </div>
                  <div className="cc-result-rows">
                    <div className="cc-rrow"><span className="cc-rrow-l">BMR (Base Metabolic Rate)</span><span className="cc-rrow-v">{fmt(bmr)} kcal</span></div>
                    <div className="cc-rrow"><span className="cc-rrow-l">TDEE (Maintenance)</span><span className="cc-rrow-v">{fmt(tdee)} kcal</span></div>
                    <div className="cc-rrow"><span className="cc-rrow-l">Your Goal Calories</span><span className="cc-rrow-v" style={{color:"#fbbf24"}}>{fmt(targetCalories)} kcal</span></div>
                  </div>
                </div>

                {macros && (
                  <div className="cc-macros">
                    <div className="cc-macro"><div className="cc-macro-val" style={{color:"#dc2626"}}>{macros.protein}g</div><div className="cc-macro-lbl">Protein</div><div className="cc-macro-sub">30% of calories</div></div>
                    <div className="cc-macro"><div className="cc-macro-val" style={{color:"#d97706"}}>{macros.carbs}g</div><div className="cc-macro-lbl">Carbs</div><div className="cc-macro-sub">45% of calories</div></div>
                    <div className="cc-macro"><div className="cc-macro-val" style={{color:"#7c3aed"}}>{macros.fat}g</div><div className="cc-macro-lbl">Fat</div><div className="cc-macro-sub">25% of calories</div></div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="cc-cta">
              <div><h3>More Health Tools 🚀</h3><p>BMI calculator, Water intake, Sleep calculator and more.</p></div>
              <Link to="/tools" className="cc-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}