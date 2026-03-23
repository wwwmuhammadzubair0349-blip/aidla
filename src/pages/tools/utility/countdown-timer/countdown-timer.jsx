import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

const PRESETS = [
  { label: "📚 Final Exams", days: 30 },
  { label: "🎓 Graduation",  days: 90 },
  { label: "🌙 Ramadan",     days: 45 },
  { label: "🎉 New Year",    days: 0, newYear: true },
  { label: "✈️ Vacation",    days: 14 },
  { label: "📋 Assignment",  days: 7  },
];

function getNewYearDate() {
  const now = new Date();
  const ny  = new Date(now.getFullYear() + 1, 0, 1);
  return ny.toISOString().slice(0, 10);
}

function getDateFromDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function calcDiff(target) {
  const now  = new Date().getTime();
  const end  = new Date(target).getTime();
  const diff = end - now;
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, done: true };
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs, done: false };
}

export default function CountdownTimer() {
  const [eventName, setEventName] = useState("My Event");
  const [targetDate, setTargetDate] = useState(() => getDateFromDays(30));
  const [time, setTime] = useState(() => calcDiff(getDateFromDays(30)));
  const [saved, setSaved] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTime(calcDiff(targetDate));
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setTime(calcDiff(targetDate)), 1000);
    return () => clearInterval(intervalRef.current);
  }, [targetDate]);

  const saveEvent = () => {
    if (!eventName.trim()) return;
    setSaved(s => [{ name: eventName, date: targetDate, id: Date.now() }, ...s.slice(0, 4)]);
  };

  const totalDays = Math.ceil((new Date(targetDate) - new Date()) / 86400000);
  const isPast    = totalDays < 0;

  return (
    <>
      <Helmet>
        <title>Countdown Timer — Count Down to Any Date or Event | AIDLA</title>
        <meta name="description" content="Free countdown timer. Count down to any date — exams, Ramadan, graduation, vacation, New Year. Shows days, hours, minutes and seconds live. Save multiple events." />
        <meta name="keywords" content="countdown timer, event countdown, exam countdown, days until calculator, date countdown, New Year countdown, Ramadan countdown, AIDLA timer" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/utility/countdown-timer" />
        <meta property="og:title" content="Countdown Timer | AIDLA" />
        <meta property="og:description" content="Count down to any date — exams, events, holidays. Live countdown with days, hours, minutes." />
        <meta property="og:url" content="https://www.aidla.online/tools/utility/countdown-timer" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Countdown Timer by AIDLA","url":"https://www.aidla.online/tools/utility/countdown-timer",
          "description":"Free countdown timer — count down to any date with live updates.",
          "applicationCategory":"UtilitiesApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .ct-root*{box-sizing:border-box;margin:0;padding:0}
        .ct-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .ct-wrap{max-width:560px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .ct-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .ct-crumb a{color:#94a3b8;text-decoration:none}.ct-crumb a:hover{color:#1a3a8f}
        .ct-hero{text-align:center;margin-bottom:24px}
        .ct-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#1a3a8f,#3b82f6);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(26,58,143,.25)}
        .ct-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .ct-accent{background:linear-gradient(135deg,#1a3a8f,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ct-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:400px;margin:0 auto}
        .ct-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .ct-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .ct-presets{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
        .ct-preset{padding:6px 12px;border-radius:99px;border:1.5px solid #e2e8f0;background:#fff;font-size:11px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;white-space:nowrap}
        .ct-preset:hover{border-color:rgba(26,58,143,.3);color:#1a3a8f;background:rgba(26,58,143,.04)}
        .ct-fields{display:flex;flex-direction:column;gap:10px}
        .ct-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .ct-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:14px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .ct-input:focus{border-color:rgba(26,58,143,.4);box-shadow:0 0 0 3px rgba(26,58,143,.07)}
        /* Countdown display */
        .ct-display{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:24px 16px;margin-bottom:14px;text-align:center}
        .ct-event-name{font-size:13px;font-weight:800;color:rgba(255,255,255,.7);margin-bottom:14px;text-transform:uppercase;letter-spacing:.08em}
        .ct-units{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
        .ct-unit{background:rgba(255,255,255,.1);border-radius:14px;padding:14px 6px;border:1px solid rgba(255,255,255,.1)}
        .ct-unit-val{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.4rem);font-weight:900;color:#fff;line-height:1}
        .ct-unit-lbl{font-size:9px;font-weight:800;color:rgba(255,255,255,.55);text-transform:uppercase;letter-spacing:.08em;margin-top:4px}
        .ct-done{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:#fbbf24;padding:20px 0}
        .ct-total-days{font-size:12px;color:rgba(255,255,255,.55);margin-top:12px}
        /* Save row */
        .ct-save-row{display:flex;gap:8px;margin-top:4px}
        .ct-save-btn{flex:1;padding:10px;border:none;border-radius:12px;background:linear-gradient(135deg,#1a3a8f,#3b82f6);color:#fff;font-size:13px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
        .ct-save-btn:hover{transform:translateY(-1px);filter:brightness(1.1)}
        /* Saved events */
        .ct-saved-list{display:flex;flex-direction:column;gap:8px}
        .ct-saved-item{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 13px;background:#f8faff;border:1px solid rgba(59,130,246,.1);border-radius:12px;cursor:pointer;transition:all .13s}
        .ct-saved-item:hover{background:#f0f4ff;border-color:rgba(26,58,143,.2)}
        .ct-saved-name{font-size:13px;font-weight:800;color:#0b1437}
        .ct-saved-date{font-size:11px;color:#94a3b8}
        .ct-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .ct-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .ct-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .ct-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.ct-cta{flex-direction:column;text-align:center}.ct-cta-btn{width:100%;text-align:center}.ct-unit-val{font-size:1.4rem}}
      `}</style>

      <div className="ct-root">
        <div className="ct-wrap">
          <nav className="ct-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Countdown Timer</span></nav>

          <motion.div className="ct-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="ct-badge">⏳ Utility Tool</div>
            <h1 className="ct-h1"><span className="ct-accent">Countdown</span> Timer</h1>
            <p className="ct-sub">Count down to any date — exams, Ramadan, graduation, New Year or any personal event.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="ct-card">
              <span className="ct-sec">Quick Presets</span>
              <div className="ct-presets">
                {PRESETS.map(p=>(
                  <button key={p.label} className="ct-preset" onClick={()=>{
                    setEventName(p.label);
                    setTargetDate(p.newYear ? getNewYearDate() : getDateFromDays(p.days));
                  }}>{p.label}</button>
                ))}
              </div>
              <div className="ct-fields">
                <div>
                  <label className="ct-label">Event Name</label>
                  <input className="ct-input" type="text" placeholder="e.g. Final Exams" value={eventName} onChange={e=>setEventName(e.target.value)} />
                </div>
                <div>
                  <label className="ct-label">Target Date</label>
                  <input className="ct-input" type="date" value={targetDate} onChange={e=>setTargetDate(e.target.value)} min={new Date().toISOString().slice(0,10)} />
                </div>
              </div>
              <div className="ct-save-row">
                <button className="ct-save-btn" onClick={saveEvent}>💾 Save Event</button>
              </div>
            </div>
          </motion.div>

          {/* Countdown display */}
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.1}}>
            <div className="ct-display">
              <div className="ct-event-name">{eventName || "Your Event"}</div>
              {isPast ? (
                <div className="ct-done">🎉 Event has passed!</div>
              ) : time.done ? (
                <div className="ct-done">🎉 Time's up!</div>
              ) : (
                <div className="ct-units">
                  {[
                    { val: time.days,  label: "Days"    },
                    { val: time.hours, label: "Hours"   },
                    { val: time.mins,  label: "Minutes" },
                    { val: time.secs,  label: "Seconds" },
                  ].map(u=>(
                    <div key={u.label} className="ct-unit">
                      <div className="ct-unit-val">{pad(u.val)}</div>
                      <div className="ct-unit-lbl">{u.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {!isPast && <div className="ct-total-days">{Math.max(0, totalDays)} days remaining · {new Date(targetDate).toLocaleDateString(undefined,{weekday:"short",year:"numeric",month:"long",day:"numeric"})}</div>}
            </div>
          </motion.div>

          {/* Saved events */}
          {saved.length > 0 && (
            <div className="ct-card">
              <span className="ct-sec">Saved Events</span>
              <div className="ct-saved-list">
                {saved.map(e=>(
                  <div key={e.id} className="ct-saved-item" onClick={()=>{setEventName(e.name);setTargetDate(e.date)}}>
                    <div>
                      <div className="ct-saved-name">{e.name}</div>
                      <div className="ct-saved-date">{new Date(e.date).toLocaleDateString()}</div>
                    </div>
                    <span style={{fontSize:13,color:"#94a3b8"}}>›</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="ct-cta">
              <div><h3>More Utility Tools 🚀</h3><p>Password generator, Unit converter and more.</p></div>
              <Link to="/tools" className="ct-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}