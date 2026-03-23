import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const SCALES = {
  pakistan: {
    label: "🇵🇰 Pakistan (HEC)",
    grades: [
      { min: 90, max: 100, grade: "A+", gpa: 4.0, color: "#059669" },
      { min: 85, max: 89,  grade: "A",  gpa: 4.0, color: "#059669" },
      { min: 80, max: 84,  grade: "A-", gpa: 3.7, color: "#10b981" },
      { min: 75, max: 79,  grade: "B+", gpa: 3.3, color: "#0284c7" },
      { min: 70, max: 74,  grade: "B",  gpa: 3.0, color: "#0284c7" },
      { min: 65, max: 69,  grade: "B-", gpa: 2.7, color: "#7c3aed" },
      { min: 60, max: 64,  grade: "C+", gpa: 2.3, color: "#d97706" },
      { min: 55, max: 59,  grade: "C",  gpa: 2.0, color: "#d97706" },
      { min: 50, max: 54,  grade: "C-", gpa: 1.7, color: "#ea580c" },
      { min: 45, max: 49,  grade: "D",  gpa: 1.0, color: "#ef4444" },
      { min: 0,  max: 44,  grade: "F",  gpa: 0.0, color: "#dc2626" },
    ],
  },
  usa: {
    label: "🇺🇸 USA Standard",
    grades: [
      { min: 93, max: 100, grade: "A",  gpa: 4.0, color: "#059669" },
      { min: 90, max: 92,  grade: "A-", gpa: 3.7, color: "#10b981" },
      { min: 87, max: 89,  grade: "B+", gpa: 3.3, color: "#0284c7" },
      { min: 83, max: 86,  grade: "B",  gpa: 3.0, color: "#0284c7" },
      { min: 80, max: 82,  grade: "B-", gpa: 2.7, color: "#7c3aed" },
      { min: 77, max: 79,  grade: "C+", gpa: 2.3, color: "#d97706" },
      { min: 73, max: 76,  grade: "C",  gpa: 2.0, color: "#d97706" },
      { min: 70, max: 72,  grade: "C-", gpa: 1.7, color: "#ea580c" },
      { min: 60, max: 69,  grade: "D",  gpa: 1.0, color: "#ef4444" },
      { min: 0,  max: 59,  grade: "F",  gpa: 0.0, color: "#dc2626" },
    ],
  },
  uk: {
    label: "🇬🇧 UK System",
    grades: [
      { min: 70, max: 100, grade: "First Class",       gpa: 4.0, color: "#059669" },
      { min: 60, max: 69,  grade: "Upper Second (2:1)", gpa: 3.3, color: "#0284c7" },
      { min: 50, max: 59,  grade: "Lower Second (2:2)", gpa: 2.7, color: "#d97706" },
      { min: 40, max: 49,  grade: "Third Class",        gpa: 2.0, color: "#ea580c" },
      { min: 0,  max: 39,  grade: "Fail",               gpa: 0.0, color: "#dc2626" },
    ],
  },
};

function getGrade(pct, scale) {
  const grades = SCALES[scale].grades;
  return grades.find(g => pct >= g.min && pct <= g.max) || grades[grades.length - 1];
}

export default function GradeCalculator() {
  const [scale,    setScale]    = useState("pakistan");
  const [obtained, setObtained] = useState("");
  const [total,    setTotal]    = useState("");
  const [subjects, setSubjects] = useState([
    { name: "Subject 1", obtained: "", total: "100" },
    { name: "Subject 2", obtained: "", total: "100" },
  ]);
  const [mode, setMode] = useState("single"); // single | multi

  // Single mode
  const pct = obtained && total ? (parseFloat(obtained) / parseFloat(total)) * 100 : null;
  const result = pct !== null && !isNaN(pct) ? getGrade(pct, scale) : null;

  // Multi mode
  const validSubs = subjects.filter(s => s.obtained && s.total && parseFloat(s.total) > 0);
  const totalObt  = validSubs.reduce((a, s) => a + parseFloat(s.obtained), 0);
  const totalMax  = validSubs.reduce((a, s) => a + parseFloat(s.total), 0);
  const overallPct = totalMax > 0 ? (totalObt / totalMax) * 100 : null;
  const overallGrade = overallPct !== null ? getGrade(overallPct, scale) : null;
  const avgGPA = validSubs.length > 0
    ? validSubs.reduce((a, s) => a + getGrade((parseFloat(s.obtained) / parseFloat(s.total)) * 100, scale).gpa, 0) / validSubs.length
    : null;

  const addSubject = () => setSubjects(s => [...s, { name: `Subject ${s.length + 1}`, obtained: "", total: "100" }]);
  const removeSubject = (i) => setSubjects(s => s.filter((_, idx) => idx !== i));
  const updateSubject = (i, key, val) => setSubjects(s => s.map((sub, idx) => idx === i ? { ...sub, [key]: val } : sub));

  return (
    <>
      <Helmet>
        <title>Grade Calculator — Marks to Letter Grade & GPA | AIDLA</title>
        <meta name="description" content="Free grade calculator. Convert marks to letter grades and GPA — Pakistan HEC, USA and UK grading scales. Single subject or multi-subject average grade calculator." />
        <meta name="keywords" content="grade calculator, marks to grade, GPA calculator, letter grade calculator, HEC grading scale, Pakistan grade calculator, A+ B+ grade, AIDLA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/education/grade-calculator" />
        <meta property="og:title" content="Grade Calculator — Marks to Letter Grade | AIDLA" />
        <meta property="og:description" content="Convert marks to letter grades and GPA. Pakistan, USA and UK grading scales." />
        <meta property="og:url" content="https://www.aidla.online/tools/education/grade-calculator" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Grade Calculator by AIDLA","url":"https://www.aidla.online/tools/education/grade-calculator",
          "description":"Free grade calculator — marks to letter grade and GPA for Pakistan, USA and UK.",
          "applicationCategory":"EducationApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .gc-root*{box-sizing:border-box;margin:0;padding:0}
        .gc-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .gc-wrap{max-width:580px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .gc-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .gc-crumb a{color:#94a3b8;text-decoration:none}.gc-crumb a:hover{color:#1a3a8f}
        .gc-hero{text-align:center;margin-bottom:24px}
        .gc-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(124,58,237,.25)}
        .gc-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .gc-accent{background:linear-gradient(135deg,#7c3aed,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .gc-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .gc-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .gc-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .gc-mode-toggle{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
        .gc-mode-btn{padding:10px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .gc-mode-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .gc-scales{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
        .gc-scale-btn{padding:9px 12px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;text-align:left}
        .gc-scale-btn.active{background:rgba(124,58,237,.07);border-color:rgba(124,58,237,.3);color:#7c3aed}
        .gc-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px}
        .gc-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .gc-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:15px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .gc-input:focus{border-color:rgba(124,58,237,.4);box-shadow:0 0 0 3px rgba(124,58,237,.07)}
        .gc-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        /* Result */
        .gc-result{border-radius:20px;overflow:hidden;margin-bottom:14px}
        .gc-result-top{padding:24px 20px;text-align:center}
        .gc-result-pct{font-size:13px;font-weight:700;color:rgba(255,255,255,.65);margin-bottom:4px}
        .gc-result-grade{font-family:'Playfair Display',serif;font-size:clamp(2.8rem,10vw,4rem);font-weight:900;color:#fff;line-height:1}
        .gc-result-gpa{font-size:14px;font-weight:800;color:rgba(255,255,255,.8);margin-top:6px}
        .gc-result-pct-val{font-size:13px;color:rgba(255,255,255,.6);margin-top:2px}
        /* Grade table */
        .gc-table{border-radius:16px;overflow:hidden;border:1px solid rgba(59,130,246,.1);margin-bottom:14px}
        .gc-table-hdr{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;padding:9px 14px;background:#f8faff;font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #f1f5f9}
        .gc-table-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;padding:9px 14px;border-bottom:1px solid #f1f5f9;font-size:12px;align-items:center;background:#fff;transition:background .13s}
        .gc-table-row:last-child{border-bottom:none}
        .gc-table-row:hover{background:#f8faff}
        .gc-table-row.highlight{background:rgba(124,58,237,.05)!important;border-left:3px solid #7c3aed}
        .gc-grade-pill{display:inline-flex;align-items:center;justify-content:center;width:36px;height:24px;border-radius:6px;font-size:11px;font-weight:800}
        /* Multi subject */
        .gc-sub-row{display:grid;grid-template-columns:1fr auto auto auto;gap:8px;align-items:center;margin-bottom:8px}
        .gc-sub-input{width:100%;padding:9px 10px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;-webkit-appearance:none}
        .gc-sub-input:focus{border-color:rgba(124,58,237,.4)}
        .gc-sub-del{width:30px;height:30px;border:1.5px solid #fecaca;border-radius:8px;background:#fff;color:#dc2626;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .13s}
        .gc-sub-del:hover{background:#fee2e2}
        .gc-add-btn{width:100%;padding:10px;border:1.5px dashed #e2e8f0;border-radius:12px;background:transparent;font-size:13px;font-weight:700;color:#94a3b8;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;margin-top:4px}
        .gc-add-btn:hover{border-color:rgba(124,58,237,.3);color:#7c3aed;background:rgba(124,58,237,.03)}
        .gc-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .gc-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .gc-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .gc-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.gc-cta{flex-direction:column;text-align:center}.gc-cta-btn{width:100%;text-align:center}.gc-table-hdr,.gc-table-row{grid-template-columns:1.5fr 1fr 1fr 1fr;font-size:11px;padding:8px 10px}}
      `}</style>

      <div className="gc-root">
        <div className="gc-wrap">
          <nav className="gc-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Grade Calculator</span></nav>

          <motion.div className="gc-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="gc-badge">🅰️ Education Tool</div>
            <h1 className="gc-h1">Grade <span className="gc-accent">Calculator</span></h1>
            <p className="gc-sub">Convert marks to letter grades and GPA — Pakistan HEC, USA and UK grading systems.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            {/* Mode */}
            <div className="gc-card">
              <span className="gc-sec">Mode</span>
              <div className="gc-mode-toggle">
                <button className={`gc-mode-btn${mode==="single"?" active":""}`} onClick={()=>setMode("single")}>📖 Single Subject</button>
                <button className={`gc-mode-btn${mode==="multi"?" active":""}`} onClick={()=>setMode("multi")}>📚 Multiple Subjects</button>
              </div>
              <span className="gc-sec">Grading Scale</span>
              <div className="gc-scales">
                {Object.entries(SCALES).map(([key,s])=>(
                  <button key={key} className={`gc-scale-btn${scale===key?" active":""}`} onClick={()=>setScale(key)}>{s.label}</button>
                ))}
              </div>
            </div>

            {/* Single mode */}
            {mode === "single" && (
              <div className="gc-card">
                <span className="gc-sec">Enter Marks</span>
                <div className="gc-fields">
                  <div>
                    <label className="gc-label">Marks Obtained</label>
                    <input className="gc-input" type="number" inputMode="decimal" placeholder="e.g. 78" value={obtained} onChange={e=>setObtained(e.target.value)} />
                  </div>
                  <div>
                    <label className="gc-label">Total Marks</label>
                    <input className="gc-input" type="number" inputMode="decimal" placeholder="e.g. 100" value={total} onChange={e=>setTotal(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Multi mode */}
            {mode === "multi" && (
              <div className="gc-card">
                <span className="gc-sec">Subjects</span>
                {subjects.map((s,i)=>(
                  <div key={i} className="gc-sub-row">
                    <input className="gc-sub-input" placeholder={`Subject ${i+1}`} value={s.name} onChange={e=>updateSubject(i,"name",e.target.value)} />
                    <input className="gc-sub-input" style={{width:70}} type="number" placeholder="Got" value={s.obtained} onChange={e=>updateSubject(i,"obtained",e.target.value)} />
                    <input className="gc-sub-input" style={{width:70}} type="number" placeholder="Max" value={s.total} onChange={e=>updateSubject(i,"total",e.target.value)} />
                    {subjects.length > 1 && <button className="gc-sub-del" onClick={()=>removeSubject(i)}>✕</button>}
                  </div>
                ))}
                <button className="gc-add-btn" onClick={addSubject}>+ Add Subject</button>
              </div>
            )}
          </motion.div>

          {/* Single result */}
          <AnimatePresence>
            {mode === "single" && result && (
              <motion.div key="single-res" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="gc-result">
                  <div className="gc-result-top" style={{background:`linear-gradient(135deg,${result.color},${result.color}aa)`}}>
                    <div className="gc-result-pct">Your Percentage</div>
                    <div className="gc-result-grade">{result.grade}</div>
                    <div className="gc-result-gpa">GPA: {result.gpa.toFixed(1)}</div>
                    <div className="gc-result-pct-val">{pct.toFixed(2)}%</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multi result */}
          <AnimatePresence>
            {mode === "multi" && overallGrade && (
              <motion.div key="multi-res" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="gc-result">
                  <div className="gc-result-top" style={{background:`linear-gradient(135deg,${overallGrade.color},${overallGrade.color}aa)`}}>
                    <div className="gc-result-pct">Overall Grade</div>
                    <div className="gc-result-grade">{overallGrade.grade}</div>
                    <div className="gc-result-gpa">Avg GPA: {avgGPA?.toFixed(2)}</div>
                    <div className="gc-result-pct-val">{overallPct?.toFixed(2)}%</div>
                  </div>
                </div>
                {/* Per subject */}
                <div className="gc-table">
                  <div className="gc-table-hdr"><span>Subject</span><span>Marks</span><span>%</span><span>Grade</span></div>
                  {validSubs.map((s,i)=>{
                    const sp = (parseFloat(s.obtained)/parseFloat(s.total))*100;
                    const sg = getGrade(sp, scale);
                    return (
                      <div key={i} className="gc-table-row">
                        <span style={{fontSize:12,fontWeight:700,color:"#0b1437",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span>
                        <span style={{fontSize:12,color:"#64748b"}}>{s.obtained}/{s.total}</span>
                        <span style={{fontSize:12,fontWeight:700,color:"#475569"}}>{sp.toFixed(1)}%</span>
                        <span className="gc-grade-pill" style={{background:`${sg.color}18`,color:sg.color}}>{sg.grade}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grade scale reference */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.2}}>
            <div className="gc-table">
              <div className="gc-table-hdr"><span>Range</span><span>Grade</span><span>GPA</span><span>Status</span></div>
              {SCALES[scale].grades.map((g,i)=>(
                <div key={i} className={`gc-table-row${(mode==="single"&&result&&result.grade===g.grade)||(mode==="multi"&&overallGrade&&overallGrade.grade===g.grade)?" highlight":""}`}>
                  <span style={{fontSize:12,color:"#64748b"}}>{g.min}–{g.max}%</span>
                  <span className="gc-grade-pill" style={{background:`${g.color}18`,color:g.color}}>{g.grade}</span>
                  <span style={{fontSize:12,fontWeight:700,color:"#475569"}}>{g.gpa.toFixed(1)}</span>
                  <span style={{fontSize:11,fontWeight:700,color:g.grade==="F"?"#dc2626":"#059669"}}>{g.grade==="F"?"Fail":"Pass"}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="gc-cta">
              <div><h3>More Education Tools 🚀</h3><p>CGPA calculator, Percentage calculator and more.</p></div>
              <Link to="/tools" className="gc-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}