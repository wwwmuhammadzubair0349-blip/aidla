import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const HOURS = Array.from({length:16},(_,i)=>i+7); // 7am to 10pm
const COLORS = ["#1a3a8f","#059669","#dc2626","#d97706","#7c3aed","#0284c7","#ea580c","#0b1437"];

const fmtHour = h => h<=12?`${h}:00 AM`:`${h-12}:00 PM`;

export default function StudyPlanner() {
  const [subjects,  setSubjects]  = useState([
    {id:1,name:"Mathematics",color:"#1a3a8f",target:2},
    {id:2,name:"Physics",color:"#059669",target:1.5},
    {id:3,name:"English",color:"#d97706",target:1},
  ]);
  const [slots,     setSlots]     = useState({}); // key: `${day}-${hour}` => subjectId
  const [dragging,  setDragging]  = useState(null);
  const [newSubj,   setNewSubj]   = useState("");
  const [newTarget, setNewTarget] = useState("1");
  const [selColor,  setSelColor]  = useState(COLORS[3]);
  const [showAdd,   setShowAdd]   = useState(false);
  const [activeSubj,setActiveSubj]= useState(null); // selected subject for placing

  const addSubject = () => {
    if (!newSubj.trim()) return;
    setSubjects(s=>[...s,{id:Date.now(),name:newSubj.trim(),color:selColor,target:parseFloat(newTarget)||1}]);
    setNewSubj(""); setShowAdd(false);
  };

  const removeSubject = (id) => {
    setSubjects(s=>s.filter(x=>x.id!==id));
    setSlots(s=>{const n={...s};Object.keys(n).forEach(k=>{if(n[k]===id)delete n[k];});return n;});
    if(activeSubj===id) setActiveSubj(null);
  };

  const toggleSlot = (day, hour) => {
    const key = `${day}-${hour}`;
    setSlots(s=>{
      const n={...s};
      if(n[key]===activeSubj){delete n[key];}
      else if(activeSubj){n[key]=activeSubj;}
      else {delete n[key];}
      return n;
    });
  };

  const getSubject = id => subjects.find(s=>s.id===id);

  const hoursPlanned = subjects.map(s=>{
    const h = Object.values(slots).filter(v=>v===s.id).length * 0.5;
    return {...s, planned:h};
  });

  const totalHours = Object.keys(slots).length * 0.5;

  const clearAll = () => setSlots({});

  return (
    <>
      <Helmet>
        <title>Study Planner — Weekly Study Schedule for Students | AIDLA</title>
        <meta name="description" content="Free study planner for students. Create a weekly study schedule by subject. Plan study sessions, set targets and track hours. Mobile-friendly timetable maker." />
        <meta name="keywords" content="study planner, weekly study schedule, student timetable, study schedule maker, exam planner, study hours tracker, AIDLA study planner" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/education/study-planner" />
        <meta property="og:title" content="Study Planner | AIDLA" />
        <meta property="og:description" content="Create a weekly study schedule by subject. Free student planner." />
        <meta property="og:url" content="https://www.aidla.online/tools/education/study-planner" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Study Planner by AIDLA","url":"https://www.aidla.online/tools/education/study-planner",
          "description":"Free weekly study planner and schedule maker for students.",
          "applicationCategory":"EducationApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .sp-root*{box-sizing:border-box;margin:0;padding:0}
        .sp-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .sp-wrap{max-width:900px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .sp-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .sp-crumb a{color:#94a3b8;text-decoration:none}.sp-crumb a:hover{color:#1a3a8f}
        .sp-hero{text-align:center;margin-bottom:24px}
        .sp-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#1a3a8f,#3b82f6);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(26,58,143,.25)}
        .sp-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .sp-accent{background:linear-gradient(135deg,#1a3a8f,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sp-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .sp-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(16px,4vw,24px);margin-bottom:12px}
        .sp-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        /* Subjects */
        .sp-subjects{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:10px}
        .sp-subj-chip{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:99px;border:2px solid transparent;font-size:12px;font-weight:800;cursor:pointer;transition:all .15s;user-select:none}
        .sp-subj-chip.selected{border-color:#0b1437;box-shadow:0 2px 8px rgba(11,20,55,.15)}
        .sp-subj-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .sp-subj-del{width:16px;height:16px;border-radius:50%;border:none;background:rgba(0,0,0,.15);color:#fff;font-size:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;margin-left:2px;flex-shrink:0}
        /* Add subject form */
        .sp-add-form{display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;margin-top:8px}
        .sp-add-input{flex:1;min-width:120px;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;-webkit-appearance:none}
        .sp-add-input:focus{border-color:rgba(26,58,143,.4)}
        .sp-add-target{width:70px;padding:9px 10px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;text-align:center;-webkit-appearance:none}
        .sp-colors{display:flex;gap:5px;align-items:center}
        .sp-color-dot{width:20px;height:20px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all .13s;flex-shrink:0}
        .sp-color-dot.selected{border-color:#0b1437;transform:scale(1.15)}
        .sp-add-btn{padding:9px 14px;border:none;border-radius:10px;background:#0b1437;color:#fff;font-size:12px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap}
        /* Stats */
        .sp-stats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
        .sp-stat{background:#f8faff;border:1px solid rgba(59,130,246,.08);border-radius:10px;padding:8px 12px;font-size:12px;font-weight:700;color:#475569;white-space:nowrap}
        .sp-stat strong{color:#0b1437}
        /* Grid */
        .sp-grid-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:4px}
        .sp-grid{display:grid;min-width:500px}
        .sp-grid-hdr{display:grid;grid-template-columns:50px repeat(7,1fr);gap:3px;margin-bottom:3px}
        .sp-day-hdr{text-align:center;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;padding:5px 2px}
        .sp-grid-row{display:grid;grid-template-columns:50px repeat(7,1fr);gap:3px;margin-bottom:3px}
        .sp-hour-label{font-size:9px;font-weight:700;color:#94a3b8;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;white-space:nowrap}
        .sp-slot{height:32px;border-radius:7px;border:1.5px solid #f1f5f9;background:#fafafa;cursor:pointer;transition:all .13s;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:#fff;overflow:hidden;user-select:none}
        .sp-slot:hover{border-color:#cbd5e1;background:#f1f5f9}
        .sp-slot.filled{border-color:transparent}
        .sp-slot.active-target{border-color:#0b1437;border-style:dashed}
        /* Progress bars */
        .sp-progress{display:flex;flex-direction:column;gap:8px}
        .sp-prog-row{display:flex;align-items:center;gap:10px}
        .sp-prog-name{font-size:12px;font-weight:700;color:#0b1437;width:100px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .sp-prog-track{flex:1;height:8px;background:#f1f5f9;border-radius:99px;overflow:hidden}
        .sp-prog-bar{height:100%;border-radius:99px;transition:width .4s ease}
        .sp-prog-val{font-size:11px;font-weight:700;color:#64748b;white-space:nowrap;width:70px;text-align:right;flex-shrink:0}
        .sp-hint{font-size:11px;color:#94a3b8;text-align:center;margin-top:8px;line-height:1.5}
        .sp-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .sp-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .sp-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .sp-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.sp-cta{flex-direction:column;text-align:center}.sp-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="sp-root">
        <div className="sp-wrap">
          <nav className="sp-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Study Planner</span></nav>

          <motion.div className="sp-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="sp-badge">📚 Education Tool</div>
            <h1 className="sp-h1">Weekly <span className="sp-accent">Study Planner</span></h1>
            <p className="sp-sub">Plan your weekly study sessions by subject. Click a subject then tap time slots to schedule.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            {/* Subjects */}
            <div className="sp-card">
              <span className="sp-sec">Subjects — Select one, then click time slots</span>
              <div className="sp-subjects">
                {subjects.map(s=>(
                  <div key={s.id} className={`sp-subj-chip${activeSubj===s.id?" selected":""}`}
                    style={{background:`${s.color}18`,color:s.color,borderColor:activeSubj===s.id?s.color:"transparent"}}
                    onClick={()=>setActiveSubj(a=>a===s.id?null:s.id)}>
                    <div className="sp-subj-dot" style={{background:s.color}}/>
                    {s.name}
                    <button className="sp-subj-del" onClick={e=>{e.stopPropagation();removeSubject(s.id);}}>✕</button>
                  </div>
                ))}
                <div className="sp-subj-chip" style={{background:"#f1f5f9",color:"#64748b",borderColor:"transparent"}}
                  onClick={()=>setShowAdd(s=>!s)}>+ Add</div>
              </div>

              <AnimatePresence>
                {showAdd&&(
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{overflow:"hidden"}}>
                    <div className="sp-add-form">
                      <input className="sp-add-input" placeholder="Subject name" value={newSubj} onChange={e=>setNewSubj(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSubject()} autoFocus />
                      <input className="sp-add-target" type="number" min=".5" max="8" step=".5" placeholder="hrs/day" value={newTarget} onChange={e=>setNewTarget(e.target.value)} title="Target hours per day" />
                      <div className="sp-colors">
                        {COLORS.map(c=><div key={c} className={`sp-color-dot${selColor===c?" selected":""}`} style={{background:c}} onClick={()=>setSelColor(c)}/>)}
                      </div>
                      <button className="sp-add-btn" onClick={addSubject}>Add</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stats */}
            <div className="sp-stats">
              <div className="sp-stat">📅 Total planned: <strong>{totalHours}h</strong></div>
              {activeSubj&&<div className="sp-stat" style={{background:`${subjects.find(s=>s.id===activeSubj)?.color}15`,color:subjects.find(s=>s.id===activeSubj)?.color}}>
                ✏️ Placing: <strong>{subjects.find(s=>s.id===activeSubj)?.name}</strong>
              </div>}
              {activeSubj&&<div className="sp-stat">Click slots to add · Click again to remove</div>}
            </div>

            {/* Timetable grid */}
            <div className="sp-card" style={{padding:"16px 10px"}}>
              <span className="sp-sec">Weekly Timetable (each slot = 30 min)</span>
              <div className="sp-grid-wrap">
                <div className="sp-grid">
                  <div className="sp-grid-hdr">
                    <div/>
                    {DAYS.map(d=><div key={d} className="sp-day-hdr">{d}</div>)}
                  </div>
                  {HOURS.map(h=>(
                    <div key={h} className="sp-grid-row">
                      <div className="sp-hour-label">{fmtHour(h)}</div>
                      {DAYS.map(d=>{
                        const key=`${d}-${h}`;
                        const sid=slots[key];
                        const subj=sid?getSubject(sid):null;
                        return(
                          <div key={d}
                            className={`sp-slot${sid?" filled":""}${!sid&&activeSubj?" active-target":""}`}
                            style={subj?{background:subj.color,borderColor:subj.color}:{}}
                            onClick={()=>toggleSlot(d,h)}
                            title={subj?subj.name:activeSubj?`Add ${subjects.find(s=>s.id===activeSubj)?.name}`:"Select a subject first"}
                          >
                            {subj&&<span style={{fontSize:8,fontWeight:800,textAlign:"center",lineHeight:1.2,padding:"0 2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%"}}>{subj.name.slice(0,4)}</span>}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="sp-hint">Tap a subject chip above → then tap time slots to schedule study time</div>
              {Object.keys(slots).length>0&&<button style={{marginTop:10,padding:"7px 14px",border:"1.5px solid #fecaca",borderRadius:9,background:"#fff",color:"#dc2626",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={clearAll}>🗑️ Clear All</button>}
            </div>

            {/* Progress bars */}
            {hoursPlanned.some(s=>s.planned>0)&&(
              <div className="sp-card">
                <span className="sp-sec">Hours Planned vs Target</span>
                <div className="sp-progress">
                  {hoursPlanned.filter(s=>s.planned>0||s.target>0).map(s=>{
                    const pct=Math.min(100,(s.planned/(s.target*7))*100);
                    return(
                      <div key={s.id} className="sp-prog-row">
                        <span className="sp-prog-name">{s.name}</span>
                        <div className="sp-prog-track">
                          <div className="sp-prog-bar" style={{width:`${pct}%`,background:s.color}}/>
                        </div>
                        <span className="sp-prog-val" style={{color:pct>=100?"#059669":"#64748b"}}>
                          {s.planned}h / {s.target*7}h
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="sp-cta">
              <div><h3>More Study Tools 🚀</h3><p>Pomodoro timer, Flashcard maker, Assignment tracker.</p></div>
              <Link to="/tools" className="sp-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}