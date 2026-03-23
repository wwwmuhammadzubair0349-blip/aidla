import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

function calcBMI(weight, height, unit) {
  if (!weight || !height) return null;
  const w = parseFloat(weight), h = parseFloat(height);
  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
  if (unit === "metric") {
    const hm = h / 100;
    return w / (hm * hm);
  } else {
    // imperial: weight in lbs, height in inches
    return (w / (h * h)) * 703;
  }
}

function getCategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "#0284c7", bg: "rgba(2,132,199,0.1)", icon: "⚠️", tip: "Consider consulting a doctor or nutritionist." };
  if (bmi < 25)   return { label: "Normal Weight", color: "#059669", bg: "rgba(5,150,105,0.1)", icon: "✅", tip: "Great! Maintain your healthy lifestyle." };
  if (bmi < 30)   return { label: "Overweight", color: "#d97706", bg: "rgba(217,119,6,0.1)", icon: "⚠️", tip: "Consider increasing physical activity." };
  return           { label: "Obese", color: "#dc2626", bg: "rgba(220,38,38,0.1)", icon: "🔴", tip: "Consult a healthcare professional." };
}

function idealWeight(height, unit) {
  if (!height) return null;
  const h = parseFloat(height);
  if (isNaN(h) || h <= 0) return null;
  if (unit === "metric") {
    const hm = h / 100;
    const low = (18.5 * hm * hm).toFixed(1);
    const high = (24.9 * hm * hm).toFixed(1);
    return `${low} – ${high} kg`;
  } else {
    const low = ((18.5 * h * h) / 703).toFixed(1);
    const high = ((24.9 * h * h) / 703).toFixed(1);
    return `${low} – ${high} lbs`;
  }
}

export default function BMICalculator() {
  const [unit,   setUnit]   = useState("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age,    setAge]    = useState("");
  const [gender, setGender] = useState("male");

  const bmi = calcBMI(weight, height, unit);
  const cat = bmi ? getCategory(bmi) : null;
  const ideal = idealWeight(height, unit);

  return (
    <>
      <Helmet>
        <title>BMI Calculator — Body Mass Index for Men & Women | AIDLA</title>
        <meta name="description" content="Free BMI calculator. Calculate your Body Mass Index instantly — metric or imperial. Shows weight category, ideal weight range and health tips." />
        <meta name="keywords" content="BMI calculator, body mass index, healthy weight calculator, BMI for men, BMI for women, BMI Pakistan, overweight calculator, AIDLA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/health/bmi-calculator" />
        <meta property="og:title" content="BMI Calculator | AIDLA" />
        <meta property="og:description" content="Calculate your BMI instantly. Shows weight category and ideal weight range." />
        <meta property="og:url" content="https://www.aidla.online/tools/health/bmi-calculator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"BMI Calculator by AIDLA","url":"https://www.aidla.online/tools/health/bmi-calculator",
          "description":"Free BMI calculator — metric and imperial, with weight category and ideal weight.",
          "applicationCategory":"HealthApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .bmi-root*{box-sizing:border-box;margin:0;padding:0}
        .bmi-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .bmi-wrap{max-width:560px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .bmi-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .bmi-crumb a{color:#94a3b8;text-decoration:none}.bmi-crumb a:hover{color:#1a3a8f}
        .bmi-hero{text-align:center;margin-bottom:24px}
        .bmi-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(220,38,38,.25)}
        .bmi-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .bmi-accent{background:linear-gradient(135deg,#dc2626,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .bmi-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:400px;margin:0 auto}
        .bmi-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .bmi-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .bmi-toggle{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px}
        .bmi-tog-btn{padding:9px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;font-size:13px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .bmi-tog-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .bmi-gender{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .bmi-gen-btn{padding:10px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;font-size:13px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:6px}
        .bmi-gen-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .bmi-fields{display:flex;flex-direction:column;gap:11px;margin-top:14px}
        .bmi-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .bmi-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none}
        .bmi-input:focus{border-color:rgba(220,38,38,.4);box-shadow:0 0 0 3px rgba(220,38,38,.07)}
        .bmi-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        /* BMI meter */
        .bmi-meter-wrap{margin:18px 0 4px}
        .bmi-meter-track{height:10px;border-radius:99px;background:linear-gradient(90deg,#0284c7 0%,#059669 30%,#d97706 65%,#dc2626 100%);position:relative;overflow:visible}
        .bmi-meter-thumb{position:absolute;top:50%;transform:translate(-50%,-50%);width:18px;height:18px;border-radius:50%;background:#fff;border:3px solid #0b1437;box-shadow:0 2px 8px rgba(11,20,55,.2);transition:left .4s cubic-bezier(.22,1,.36,1)}
        .bmi-meter-labels{display:flex;justify-content:space-between;font-size:9px;font-weight:700;color:#94a3b8;margin-top:6px}
        /* Result */
        .bmi-result{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;text-align:center;margin-bottom:14px}
        .bmi-result-label{font-size:11px;font-weight:700;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
        .bmi-result-value{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,8vw,3.2rem);font-weight:900;color:#fff;line-height:1}
        .bmi-cat-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:99px;font-size:12px;font-weight:800;margin-top:10px}
        .bmi-rows{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:16px;overflow:hidden;margin-bottom:14px}
        .bmi-row{display:flex;justify-content:space-between;align-items:center;padding:11px 16px;border-bottom:1px solid #f1f5f9;font-size:13px}
        .bmi-row:last-child{border-bottom:none}
        .bmi-row-l{color:#64748b;font-weight:600}.bmi-row-v{font-weight:800;color:#0b1437}
        .bmi-tip{background:rgba(26,58,143,.06);border:1px solid rgba(26,58,143,.12);border-radius:12px;padding:12px 14px;font-size:12px;color:#1a3a8f;line-height:1.6}
        .bmi-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:28px}
        .bmi-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .bmi-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .bmi-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.bmi-cta{flex-direction:column;text-align:center}.bmi-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="bmi-root">
        <div className="bmi-wrap">
          <nav className="bmi-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>BMI Calculator</span></nav>

          <motion.div className="bmi-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="bmi-badge">❤️ Health Tool</div>
            <h1 className="bmi-h1"><span className="bmi-accent">BMI</span> Calculator</h1>
            <p className="bmi-sub">Calculate your Body Mass Index instantly — metric or imperial, with ideal weight range.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="bmi-card">
              <span className="bmi-sec">Unit System</span>
              <div className="bmi-toggle">
                {[{id:"metric",label:"📏 Metric (kg/cm)"},{id:"imperial",label:"🇺🇸 Imperial (lbs/in)"}].map(u=>(
                  <button key={u.id} className={`bmi-tog-btn${unit===u.id?" active":""}`} onClick={()=>{setUnit(u.id);setWeight("");setHeight("")}}>{u.label}</button>
                ))}
              </div>

              <span className="bmi-sec" style={{marginTop:16,display:"block"}}>Gender</span>
              <div className="bmi-gender">
                {[{id:"male",label:"👨 Male"},{id:"female",label:"👩 Female"}].map(g=>(
                  <button key={g.id} className={`bmi-gen-btn${gender===g.id?" active":""}`} onClick={()=>setGender(g.id)}>{g.label}</button>
                ))}
              </div>

              <div className="bmi-fields">
                <div>
                  <label className="bmi-label">Weight ({unit==="metric"?"kg":"lbs"})</label>
                  <input className="bmi-input" type="number" inputMode="decimal" placeholder={unit==="metric"?"e.g. 70":"e.g. 154"} value={weight} onChange={e=>setWeight(e.target.value)} />
                </div>
                <div>
                  <label className="bmi-label">Height ({unit==="metric"?"cm":"inches"})</label>
                  <input className="bmi-input" type="number" inputMode="decimal" placeholder={unit==="metric"?"e.g. 175":"e.g. 69"} value={height} onChange={e=>setHeight(e.target.value)} />
                </div>
                <div>
                  <label className="bmi-label">Age (optional)</label>
                  <input className="bmi-input" type="number" inputMode="numeric" placeholder="e.g. 25" value={age} onChange={e=>setAge(e.target.value)} />
                </div>
              </div>

              {bmi && (
                <div className="bmi-meter-wrap">
                  <div className="bmi-meter-track">
                    <div className="bmi-meter-thumb" style={{left:`${Math.min(Math.max((bmi-10)/30*100,2),98)}%`}}/>
                  </div>
                  <div className="bmi-meter-labels">
                    <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {bmi && cat && (
              <motion.div key="res" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="bmi-result">
                  <div className="bmi-result-label">Your BMI</div>
                  <div className="bmi-result-value">{bmi.toFixed(1)}</div>
                  <div className="bmi-cat-badge" style={{background:cat.bg.replace("rgba","rgba").replace(/0\.\d+\)$/,"0.25)"),color:cat.color,border:`1px solid ${cat.color}40`}}>
                    {cat.icon} {cat.label}
                  </div>
                </div>

                <div className="bmi-rows">
                  <div className="bmi-row"><span className="bmi-row-l">BMI Score</span><span className="bmi-row-v">{bmi.toFixed(2)}</span></div>
                  <div className="bmi-row"><span className="bmi-row-l">Category</span><span className="bmi-row-v" style={{color:cat.color}}>{cat.label}</span></div>
                  {ideal && <div className="bmi-row"><span className="bmi-row-l">Ideal Weight Range</span><span className="bmi-row-v">{ideal}</span></div>}
                  {age && <div className="bmi-row"><span className="bmi-row-l">Age</span><span className="bmi-row-v">{age} years</span></div>}
                </div>

                <div className="bmi-tip">💡 {cat.tip}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="bmi-cta">
              <div><h3>More Free Tools 🚀</h3><p>Calorie calculator, Water intake, Sleep and 30+ more.</p></div>
              <Link to="/tools" className="bmi-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}