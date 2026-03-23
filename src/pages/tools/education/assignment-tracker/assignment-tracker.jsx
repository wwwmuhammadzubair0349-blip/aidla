import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const PRIORITIES = [
  { id:"high",   label:"High",   color:"#dc2626", bg:"rgba(220,38,38,.1)"   },
  { id:"medium", label:"Medium", color:"#d97706", bg:"rgba(217,119,6,.1)"   },
  { id:"low",    label:"Low",    color:"#059669", bg:"rgba(5,150,105,.1)"   },
];
const SUBJECTS = ["Math","Physics","Chemistry","Biology","English","Urdu","Computer","History","Other"];

function useCopy(){const [c,s]=useState("");const copy=async(t,id)=>{try{await navigator.clipboard.writeText(t);}catch{}s(id);setTimeout(()=>s(""),2000);};return{copied:c,copy};}

const DEFAULT = { title:"", subject:"Math", due:"", priority:"medium", notes:"", done:false };

function daysUntil(date){
  if(!date)return null;
  const diff=new Date(date)-new Date();
  return Math.ceil(diff/86400000);
}

function getDueLabel(date){
  const d=daysUntil(date);
  if(d===null)return null;
  if(d<0)return{text:"Overdue",color:"#dc2626",bg:"rgba(220,38,38,.1)"};
  if(d===0)return{text:"Due Today",color:"#ea580c",bg:"rgba(234,88,12,.1)"};
  if(d===1)return{text:"Due Tomorrow",color:"#d97706",bg:"rgba(217,119,6,.1)"};
  if(d<=3)return{text:`Due in ${d} days`,color:"#d97706",bg:"rgba(217,119,6,.08)"};
  return{text:`Due in ${d} days`,color:"#059669",bg:"rgba(5,150,105,.08)"};
}

export default function AssignmentTracker() {
  const [assignments, setAssignments] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aidla_assignments") || "[]"); } catch { return []; }
  });
  const [form,      setForm]      = useState({ ...DEFAULT });
  const [showForm,  setShowForm]  = useState(false);
  const [filter,    setFilter]    = useState("all"); // all | pending | done
  const [editId,    setEditId]    = useState(null);

  useEffect(() => {
    try { localStorage.setItem("aidla_assignments", JSON.stringify(assignments)); } catch {}
  }, [assignments]);

  const save = () => {
    if (!form.title.trim()) return;
    if (editId !== null) {
      setAssignments(a => a.map(x => x.id === editId ? { ...form, id: editId } : x));
      setEditId(null);
    } else {
      setAssignments(a => [{ ...form, id: Date.now() }, ...a]);
    }
    setForm({ ...DEFAULT }); setShowForm(false);
  };

  const toggle = (id) => setAssignments(a => a.map(x => x.id===id ? {...x,done:!x.done} : x));
  const remove = (id) => setAssignments(a => a.filter(x => x.id!==id));
  const startEdit = (a) => { setForm({...a}); setEditId(a.id); setShowForm(true); };

  const filtered = assignments.filter(a => filter==="all" || (filter==="done"?a.done:!a.done));
  const pending  = assignments.filter(a=>!a.done).length;
  const done     = assignments.filter(a=>a.done).length;
  const overdue  = assignments.filter(a=>!a.done && daysUntil(a.due)<0).length;

  return (
    <>
      <Helmet>
        <title>Assignment Tracker — Track Homework & Deadlines | AIDLA</title>
        <meta name="description" content="Free assignment tracker for students. Track all your homework, assignments and deadlines. Set priorities, due dates and mark complete. Works offline, saves locally." />
        <meta name="keywords" content="assignment tracker, homework tracker, student planner, deadline tracker, assignment due date, school assignment app, AIDLA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/education/assignment-tracker" />
        <meta property="og:title" content="Assignment Tracker | AIDLA" />
        <meta property="og:description" content="Track assignments, homework and deadlines. Free student planner." />
        <meta property="og:url" content="https://www.aidla.online/tools/education/assignment-tracker" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Assignment Tracker by AIDLA","url":"https://www.aidla.online/tools/education/assignment-tracker",
          "description":"Free assignment and homework tracker for students.",
          "applicationCategory":"EducationApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .at-root*{box-sizing:border-box;margin:0;padding:0}
        .at-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .at-wrap{max-width:600px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .at-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .at-crumb a{color:#94a3b8;text-decoration:none}.at-crumb a:hover{color:#1a3a8f}
        .at-hero{text-align:center;margin-bottom:24px}
        .at-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#1a3a8f,#3b82f6);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(26,58,143,.25)}
        .at-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .at-accent{background:linear-gradient(135deg,#1a3a8f,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .at-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:400px;margin:0 auto}
        .at-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(16px,4vw,24px);margin-bottom:12px}
        .at-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        /* Stats */
        .at-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}
        .at-stat{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:14px;padding:13px;text-align:center}
        .at-stat-val{font-size:22px;font-weight:900;color:#0b1437;margin-bottom:2px}
        .at-stat-lbl{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em}
        /* Add button */
        .at-add-btn{width:100%;padding:13px;border:none;border-radius:14px;background:linear-gradient(135deg,#0b1437,#1a3a8f);color:#fff;font-size:14px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;box-shadow:0 4px 14px rgba(11,20,55,.2);margin-bottom:12px}
        .at-add-btn:hover{transform:translateY(-2px);filter:brightness(1.08)}
        /* Form */
        .at-form-fields{display:flex;flex-direction:column;gap:10px}
        .at-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px}
        .at-input,.at-select,.at-textarea{width:100%;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:11px;font-size:14px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .at-input:focus,.at-select:focus,.at-textarea:focus{border-color:rgba(26,58,143,.4);box-shadow:0 0 0 3px rgba(26,58,143,.07)}
        .at-select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;cursor:pointer}
        .at-textarea{resize:vertical;min-height:70px;line-height:1.55}
        .at-priority-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
        .at-pri-btn{padding:9px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:center}
        .at-form-actions{display:flex;gap:8px;margin-top:4px}
        .at-save-btn{flex:1;padding:11px;border:none;border-radius:12px;background:linear-gradient(135deg,#0b1437,#1a3a8f);color:#fff;font-size:13px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .at-cancel-btn{padding:11px 16px;border:1.5px solid #e2e8f0;border-radius:12px;background:#fff;font-size:13px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .at-cancel-btn:hover{background:#f8faff}
        /* Filter */
        .at-filters{display:flex;gap:7px;margin-bottom:12px;flex-wrap:wrap}
        .at-filter-btn{padding:6px 14px;border-radius:99px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .at-filter-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        /* Assignment item */
        .at-item{display:flex;align-items:flex-start;gap:11px;padding:13px 14px;border-radius:14px;background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.08);margin-bottom:8px;transition:all .13s}
        .at-item.done-item{opacity:.6}
        .at-item:hover{box-shadow:0 4px 14px rgba(11,20,55,.08)}
        .at-check{width:22px;height:22px;border-radius:6px;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;margin-top:1px;transition:all .13s;font-size:12px}
        .at-check.done-check{background:#059669;border-color:#059669;color:#fff}
        .at-item-body{flex:1;min-width:0}
        .at-item-title{font-size:14px;font-weight:800;color:#0b1437;line-height:1.3;word-break:break-word}
        .at-item-title.done-title{text-decoration:line-through;color:#94a3b8}
        .at-item-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:5px}
        .at-item-subject{font-size:10px;font-weight:700;color:#64748b;background:#f1f5f9;padding:2px 7px;border-radius:99px}
        .at-item-due{font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px}
        .at-item-pri{font-size:9px;font-weight:800;padding:2px 7px;border-radius:99px;text-transform:uppercase;letter-spacing:.06em}
        .at-item-notes{font-size:11px;color:#94a3b8;margin-top:4px;line-height:1.5}
        .at-item-actions{display:flex;gap:5px;flex-shrink:0}
        .at-edit-btn,.at-del-btn{width:28px;height:28px;border-radius:7px;border:1px solid #e2e8f0;background:#fff;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .13s}
        .at-edit-btn:hover{background:#f0f4ff;border-color:rgba(26,58,143,.2)}
        .at-del-btn:hover{background:#fee2e2;border-color:rgba(220,38,38,.2)}
        .at-empty{text-align:center;padding:32px 16px;color:#94a3b8}
        .at-empty-icon{font-size:36px;margin-bottom:10px}
        .at-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .at-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .at-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .at-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.at-cta{flex-direction:column;text-align:center}.at-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="at-root">
        <div className="at-wrap">
          <nav className="at-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Assignment Tracker</span></nav>

          <motion.div className="at-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="at-badge">✅ Education Tool</div>
            <h1 className="at-h1">Assignment <span className="at-accent">Tracker</span></h1>
            <p className="at-sub">Track all your assignments, homework and deadlines. Saves locally in your browser.</p>
          </motion.div>

          {/* Stats */}
          <div className="at-stats">
            <div className="at-stat"><div className="at-stat-val" style={{color:"#d97706"}}>{pending}</div><div className="at-stat-lbl">Pending</div></div>
            <div className="at-stat"><div className="at-stat-val" style={{color:"#059669"}}>{done}</div><div className="at-stat-lbl">Completed</div></div>
            <div className="at-stat"><div className="at-stat-val" style={{color:overdue>0?"#dc2626":"#94a3b8"}}>{overdue}</div><div className="at-stat-lbl">Overdue</div></div>
          </div>

          {/* Add button */}
          {!showForm && (
            <button className="at-add-btn" onClick={()=>{setForm({...DEFAULT});setEditId(null);setShowForm(true);}}>
              + Add Assignment
            </button>
          )}

          {/* Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.22}}>
                <div className="at-card">
                  <span className="at-sec">{editId?"Edit":"New"} Assignment</span>
                  <div className="at-form-fields">
                    <div>
                      <label className="at-label">Assignment Title *</label>
                      <input className="at-input" placeholder="e.g. Chapter 5 Exercise" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <div>
                        <label className="at-label">Subject</label>
                        <select className="at-select" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}>
                          {SUBJECTS.map(s=><option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="at-label">Due Date</label>
                        <input className="at-input" type="date" value={form.due} onChange={e=>setForm(f=>({...f,due:e.target.value}))} />
                      </div>
                    </div>
                    <div>
                      <label className="at-label">Priority</label>
                      <div className="at-priority-grid">
                        {PRIORITIES.map(p=>(
                          <button key={p.id} className="at-pri-btn"
                            style={form.priority===p.id?{background:p.bg,borderColor:p.color,color:p.color}:{}}
                            onClick={()=>setForm(f=>({...f,priority:p.id}))}>
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="at-label">Notes (optional)</label>
                      <textarea className="at-textarea" placeholder="Any details, pages, instructions…" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
                    </div>
                    <div className="at-form-actions">
                      <button className="at-save-btn" onClick={save}>💾 {editId?"Update":"Save"} Assignment</button>
                      <button className="at-cancel-btn" onClick={()=>{setShowForm(false);setEditId(null);}}>Cancel</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          {assignments.length > 0 && (
            <div className="at-filters">
              {[{id:"all",label:`All (${assignments.length})`},{id:"pending",label:`Pending (${pending})`},{id:"done",label:`Done (${done})`}].map(f=>(
                <button key={f.id} className={`at-filter-btn${filter===f.id?" active":""}`} onClick={()=>setFilter(f.id)}>{f.label}</button>
              ))}
            </div>
          )}

          {/* Assignment list */}
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div className="at-empty" initial={{opacity:0}} animate={{opacity:1}}>
                <div className="at-empty-icon">📋</div>
                <div style={{fontWeight:700,color:"#475569",marginBottom:4}}>
                  {filter==="done"?"No completed assignments yet":"No assignments yet"}
                </div>
                <div style={{fontSize:12}}>
                  {filter==="all"?"Click '+ Add Assignment' to get started.":""}
                </div>
              </motion.div>
            ) : filtered.map(a=>{
              const pri = PRIORITIES.find(p=>p.id===a.priority);
              const dueLabel = getDueLabel(a.due);
              return (
                <motion.div key={a.id} layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-20}} transition={{duration:.22}}>
                  <div className={`at-item${a.done?" done-item":""}`}>
                    <div className={`at-check${a.done?" done-check":""}`} onClick={()=>toggle(a.id)} role="checkbox" aria-checked={a.done}>
                      {a.done?"✓":""}
                    </div>
                    <div className="at-item-body">
                      <div className={`at-item-title${a.done?" done-title":""}`}>{a.title}</div>
                      <div className="at-item-meta">
                        <span className="at-item-subject">{a.subject}</span>
                        {dueLabel && <span className="at-item-due" style={{background:dueLabel.bg,color:dueLabel.color}}>{dueLabel.text}</span>}
                        {pri && <span className="at-item-pri" style={{background:pri.bg,color:pri.color}}>{pri.label}</span>}
                      </div>
                      {a.notes && <div className="at-item-notes">{a.notes}</div>}
                    </div>
                    <div className="at-item-actions">
                      <button className="at-edit-btn" onClick={()=>startEdit(a)} aria-label="Edit">✏️</button>
                      <button className="at-del-btn" onClick={()=>remove(a.id)} aria-label="Delete">🗑️</button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="at-cta">
              <div><h3>More Study Tools 🚀</h3><p>Pomodoro timer, Flashcard maker and more.</p></div>
              <Link to="/tools" className="at-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}