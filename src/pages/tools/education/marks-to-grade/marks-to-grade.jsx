import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

/* ── Grading scales ── */
const SCALES = {
  hec:  { label:"🇵🇰 HEC Pakistan", grades:[
    {min:90,grade:"A+",gpa:4.0,points:"Distinction"},{min:85,grade:"A",gpa:4.0,points:"Excellent"},
    {min:80,grade:"A-",gpa:3.7,points:"Very Good"},{min:75,grade:"B+",gpa:3.3,points:"Good"},
    {min:70,grade:"B",gpa:3.0,points:"Good"},{min:65,grade:"B-",gpa:2.7,points:"Above Average"},
    {min:60,grade:"C+",gpa:2.3,points:"Average"},{min:55,grade:"C",gpa:2.0,points:"Average"},
    {min:50,grade:"C-",gpa:1.7,points:"Below Average"},{min:45,grade:"D",gpa:1.0,points:"Pass"},
    {min:0,grade:"F",gpa:0.0,points:"Fail"},
  ]},
  matric:{ label:"🏫 Pakistan Matric/Inter", grades:[
    {min:80,grade:"A1",gpa:4.0,points:"Outstanding"},{min:70,grade:"A",gpa:3.7,points:"Excellent"},
    {min:60,grade:"B",gpa:3.0,points:"Good"},{min:50,grade:"C",gpa:2.3,points:"Satisfactory"},
    {min:40,grade:"D",gpa:1.7,points:"Pass"},{min:33,grade:"E",gpa:1.0,points:"Minimum Pass"},
    {min:0,grade:"F",gpa:0.0,points:"Fail"},
  ]},
  usa:{ label:"🇺🇸 USA Standard", grades:[
    {min:93,grade:"A",gpa:4.0,points:"Excellent"},{min:90,grade:"A-",gpa:3.7,points:"Excellent"},
    {min:87,grade:"B+",gpa:3.3,points:"Good"},{min:83,grade:"B",gpa:3.0,points:"Good"},
    {min:80,grade:"B-",gpa:2.7,points:"Good"},{min:77,grade:"C+",gpa:2.3,points:"Average"},
    {min:73,grade:"C",gpa:2.0,points:"Average"},{min:70,grade:"C-",gpa:1.7,points:"Average"},
    {min:60,grade:"D",gpa:1.0,points:"Pass"},{min:0,grade:"F",gpa:0.0,points:"Fail"},
  ]},
};

function getGrade(pct, scale) {
  const list = SCALES[scale].grades;
  return list.find(g => pct >= g.min) || list[list.length-1];
}

const COLORS = {
  "A+":"#059669","A1":"#059669","A":"#059669","A-":"#10b981",
  "B+":"#0284c7","B":"#0284c7","B-":"#3b82f6",
  "C+":"#d97706","C":"#d97706","C-":"#ea580c",
  "D":"#ef4444","E":"#ef4444","F":"#dc2626",
};

function useCopy(){
  const [c,s]=useState(false);
  const copy=async t=>{try{await navigator.clipboard.writeText(t);}catch{}s(true);setTimeout(()=>s(false),2000);};
  return{copied:c,copy};
}

export default function MarksToGrade() {
  const [scale,    setScale]    = useState("hec");
  const [obtained, setObtained] = useState("");
  const [total,    setTotal]    = useState("100");
  const [subjects, setSubjects] = useState([
    {id:1,name:"Subject 1",obt:"",tot:"100"},
    {id:2,name:"Subject 2",obt:"",tot:"100"},
    {id:3,name:"Subject 3",obt:"",tot:"100"},
  ]);
  const [mode, setMode] = useState("single"); // single | multi
  const { copied, copy } = useCopy();

  const pct = obtained && total && parseFloat(total)>0
    ? (parseFloat(obtained)/parseFloat(total))*100 : null;
  const result = pct!==null && !isNaN(pct) ? getGrade(pct, scale) : null;

  const validSubs = subjects.filter(s=>s.obt&&s.tot&&parseFloat(s.tot)>0);
  const overallPct = validSubs.length
    ? (validSubs.reduce((a,s)=>a+parseFloat(s.obt),0)/validSubs.reduce((a,s)=>a+parseFloat(s.tot),0))*100
    : null;
  const overallGrade = overallPct!==null ? getGrade(overallPct,scale) : null;
  const avgGPA = validSubs.length
    ? validSubs.reduce((a,s)=>a+getGrade((parseFloat(s.obt)/parseFloat(s.tot))*100,scale).gpa,0)/validSubs.length
    : null;

  const addSub = () => setSubjects(s=>[...s,{id:Date.now(),name:`Subject ${s.length+1}`,obt:"",tot:"100"}]);
  const remSub = id => setSubjects(s=>s.filter(x=>x.id!==id));
  const updSub = (id,k,v) => setSubjects(s=>s.map(x=>x.id===id?{...x,[k]:v}:x));

  const resultColor = result ? (COLORS[result.grade]||"#64748b") : "#64748b";
  const multiColor  = overallGrade ? (COLORS[overallGrade.grade]||"#64748b") : "#64748b";

  return (
    <>
      <Helmet>
        <title>Marks to Grade Converter — GPA, Percentage & Letter Grade | AIDLA</title>
        <meta name="description" content="Free marks to grade converter. Convert obtained marks to letter grade, GPA and percentage instantly. Pakistan HEC, Matric/Inter and USA grading scales. Single and multi-subject." />
        <meta name="keywords" content="marks to grade converter, marks to GPA, marks to percentage, grade calculator Pakistan, HEC grading, matric grade calculator, AIDLA marks converter" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/education/marks-to-grade" />
        <meta property="og:title" content="Marks to Grade Converter | AIDLA" />
        <meta property="og:description" content="Convert marks to letter grade, GPA and percentage — Pakistan and USA scales." />
        <meta property="og:url" content="https://www.aidla.online/tools/education/marks-to-grade" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"Marks to Grade Converter by AIDLA","url":"https://www.aidla.online/tools/education/marks-to-grade",
          "description":"Free marks to grade, GPA and percentage converter.",
          "applicationCategory":"EducationApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .mg-root*{box-sizing:border-box;margin:0;padding:0}
        .mg-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .mg-wrap{max-width:600px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .mg-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .mg-crumb a{color:#94a3b8;text-decoration:none}.mg-crumb a:hover{color:#1a3a8f}
        .mg-hero{text-align:center;margin-bottom:24px}
        .mg-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#1a3a8f,#3b82f6);color:#fff;padding:4px 14px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 14px rgba(26,58,143,.25)}
        .mg-h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,6vw,2.3rem);font-weight:900;color:#0b1437;line-height:1.15;margin-bottom:8px}
        .mg-accent{background:linear-gradient(135deg,#1a3a8f,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .mg-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:420px;margin:0 auto}
        .mg-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .mg-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .mg-toggle{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}
        .mg-tog-btn{padding:10px 8px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .mg-tog-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .mg-scales{display:flex;flex-direction:column;gap:6px;margin-bottom:4px}
        .mg-scale-btn{padding:9px 12px;border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;font-size:12px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:left}
        .mg-scale-btn.active{border-color:rgba(26,58,143,.3);background:rgba(26,58,143,.06);color:#1a3a8f}
        .mg-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .mg-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:16px;font-weight:700;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .mg-input:focus{border-color:rgba(26,58,143,.4);box-shadow:0 0 0 3px rgba(26,58,143,.07)}
        .mg-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .mg-fields2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        /* Result */
        .mg-result{border-radius:20px;padding:24px 20px;text-align:center;margin-bottom:14px;position:relative;overflow:hidden}
        .mg-result-grade{font-family:'Playfair Display',serif;font-size:clamp(3rem,12vw,4.5rem);font-weight:900;color:#fff;line-height:1}
        .mg-result-gpa{font-size:14px;font-weight:800;color:rgba(255,255,255,.85);margin-top:6px}
        .mg-result-pct{font-size:12px;color:rgba(255,255,255,.65);margin-top:3px}
        .mg-result-points{display:inline-block;padding:4px 12px;background:rgba(255,255,255,.15);border-radius:99px;font-size:12px;font-weight:700;color:#fff;margin-top:8px}
        .mg-copy-btn{margin-top:12px;padding:7px 16px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:99px;font-size:11px;font-weight:700;color:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
        .mg-copy-btn:hover{background:rgba(255,255,255,.22)}
        .mg-copy-btn.copied{background:rgba(5,150,105,.3);border-color:rgba(5,150,105,.5)}
        /* Subject rows */
        .mg-sub-row{display:grid;grid-template-columns:1fr 70px 70px auto;gap:7px;align-items:center;margin-bottom:7px}
        .mg-sub-input{width:100%;padding:9px 10px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;-webkit-appearance:none}
        .mg-sub-input:focus{border-color:rgba(26,58,143,.35)}
        .mg-sub-del{width:28px;height:28px;border:1px solid #fecaca;border-radius:7px;background:#fff;color:#dc2626;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .mg-add-btn{width:100%;padding:9px;border:1.5px dashed #e2e8f0;border-radius:11px;background:transparent;font-size:12px;font-weight:700;color:#94a3b8;cursor:pointer;font-family:'DM Sans',sans-serif;margin-top:4px;transition:all .13s}
        .mg-add-btn:hover{border-color:rgba(26,58,143,.3);color:#1a3a8f}
        /* Grade table */
        .mg-table{border-radius:14px;overflow:hidden;border:1px solid rgba(59,130,246,.1)}
        .mg-table-hdr{display:grid;grid-template-columns:1fr 1fr 1fr 1.5fr;padding:8px 12px;background:#f8faff;font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;border-bottom:1px solid #f1f5f9}
        .mg-table-row{display:grid;grid-template-columns:1fr 1fr 1fr 1.5fr;padding:9px 12px;border-bottom:1px solid #f1f5f9;font-size:12px;background:#fff;transition:background .13s}
        .mg-table-row:last-child{border-bottom:none}
        .mg-table-row.hl{background:rgba(26,58,143,.04);border-left:3px solid #1a3a8f}
        .mg-table-row:hover{background:#f8faff}
        .mg-grade-pill{display:inline-flex;align-items:center;justify-content:center;width:34px;height:22px;border-radius:6px;font-size:11px;font-weight:800}
        .mg-cta{background:linear-gradient(135deg,#0b1437,#1a3a8f);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .mg-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .mg-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .mg-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.mg-sub-row{grid-template-columns:1fr 60px 60px auto}.mg-cta{flex-direction:column;text-align:center}.mg-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="mg-root">
        <div className="mg-wrap">
          <nav className="mg-crumb"><Link to="/tools">Tools</Link><span>›</span><span style={{color:"#475569"}}>Marks to Grade</span></nav>

          <motion.div className="mg-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="mg-badge">📈 Education Tool</div>
            <h1 className="mg-h1">Marks to <span className="mg-accent">Grade</span> Converter</h1>
            <p className="mg-sub">Convert marks to letter grade, GPA and percentage — Pakistan HEC, Matric and USA scales.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            <div className="mg-card">
              <span className="mg-sec">Mode</span>
              <div className="mg-toggle">
                <button className={`mg-tog-btn${mode==="single"?" active":""}`} onClick={()=>setMode("single")}>📖 Single Subject</button>
                <button className={`mg-tog-btn${mode==="multi"?" active":""}`} onClick={()=>setMode("multi")}>📚 Multiple Subjects</button>
              </div>
              <span className="mg-sec">Grading Scale</span>
              <div className="mg-scales">
                {Object.entries(SCALES).map(([k,s])=>(
                  <button key={k} className={`mg-scale-btn${scale===k?" active":""}`} onClick={()=>setScale(k)}>{s.label}</button>
                ))}
              </div>
            </div>

            {mode==="single"&&(
              <div className="mg-card">
                <span className="mg-sec">Enter Marks</span>
                <div className="mg-fields2">
                  <div><label className="mg-label">Marks Obtained</label><input className="mg-input" type="number" inputMode="decimal" placeholder="e.g. 78" value={obtained} onChange={e=>setObtained(e.target.value)} /></div>
                  <div><label className="mg-label">Total Marks</label><input className="mg-input" type="number" inputMode="decimal" placeholder="e.g. 100" value={total} onChange={e=>setTotal(e.target.value)} /></div>
                </div>
              </div>
            )}

            {mode==="multi"&&(
              <div className="mg-card">
                <span className="mg-sec">Subjects</span>
                {subjects.map(s=>(
                  <div key={s.id} className="mg-sub-row">
                    <input className="mg-sub-input" placeholder="Subject name" value={s.name} onChange={e=>updSub(s.id,"name",e.target.value)} />
                    <input className="mg-sub-input" type="number" placeholder="Got" value={s.obt} onChange={e=>updSub(s.id,"obt",e.target.value)} />
                    <input className="mg-sub-input" type="number" placeholder="Max" value={s.tot} onChange={e=>updSub(s.id,"tot",e.target.value)} />
                    {subjects.length>1&&<button className="mg-sub-del" onClick={()=>remSub(s.id)}>✕</button>}
                  </div>
                ))}
                <button className="mg-add-btn" onClick={addSub}>+ Add Subject</button>
              </div>
            )}
          </motion.div>

          {/* Single result */}
          <AnimatePresence>
            {mode==="single"&&result&&(
              <motion.div key="sr" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="mg-result" style={{background:`linear-gradient(135deg,${resultColor},${resultColor}99)`}}>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.65)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Your Grade</div>
                  <div className="mg-result-grade">{result.grade}</div>
                  <div className="mg-result-gpa">GPA: {result.gpa.toFixed(1)}</div>
                  <div className="mg-result-pct">{pct.toFixed(2)}% — {obtained}/{total} marks</div>
                  <div className="mg-result-points">{result.points}</div>
                  <button className={`mg-copy-btn${copied?" copied":""}`} onClick={()=>copy(`${result.grade} | GPA ${result.gpa.toFixed(1)} | ${pct.toFixed(2)}%`)}>
                    {copied?"✅ Copied":"📋 Copy Result"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multi result */}
          <AnimatePresence>
            {mode==="multi"&&overallGrade&&(
              <motion.div key="mr" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}>
                <div className="mg-result" style={{background:`linear-gradient(135deg,${multiColor},${multiColor}99)`}}>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.65)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Overall Grade</div>
                  <div className="mg-result-grade">{overallGrade.grade}</div>
                  <div className="mg-result-gpa">Avg GPA: {avgGPA?.toFixed(2)}</div>
                  <div className="mg-result-pct">{overallPct?.toFixed(2)}% overall</div>
                </div>
                {/* Per subject table */}
                <div className="mg-table" style={{marginBottom:14}}>
                  <div className="mg-table-hdr"><span>Subject</span><span>Marks</span><span>%</span><span>Grade</span></div>
                  {validSubs.map(s=>{
                    const sp=(parseFloat(s.obt)/parseFloat(s.tot))*100;
                    const sg=getGrade(sp,scale);
                    const sc=COLORS[sg.grade]||"#64748b";
                    return(
                      <div key={s.id} className="mg-table-row">
                        <span style={{fontSize:12,fontWeight:700,color:"#0b1437",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span>
                        <span style={{fontSize:12,color:"#64748b"}}>{s.obt}/{s.tot}</span>
                        <span style={{fontSize:12,fontWeight:700,color:"#475569"}}>{sp.toFixed(1)}%</span>
                        <span className="mg-grade-pill" style={{background:`${sc}18`,color:sc}}>{sg.grade}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grade scale reference */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.3,delay:.15}}>
            <div className="mg-table" style={{marginBottom:14}}>
              <div className="mg-table-hdr"><span>%</span><span>Grade</span><span>GPA</span><span>Description</span></div>
              {SCALES[scale].grades.map((g,i)=>{
                const gc=COLORS[g.grade]||"#64748b";
                const isHl=(mode==="single"&&result&&result.grade===g.grade)||(mode==="multi"&&overallGrade&&overallGrade.grade===g.grade);
                return(
                  <div key={i} className={`mg-table-row${isHl?" hl":""}`}>
                    <span style={{fontSize:11,color:"#64748b"}}>{g.min}%+</span>
                    <span className="mg-grade-pill" style={{background:`${gc}18`,color:gc}}>{g.grade}</span>
                    <span style={{fontSize:12,fontWeight:700,color:"#475569"}}>{g.gpa.toFixed(1)}</span>
                    <span style={{fontSize:11,color:"#64748b"}}>{g.points}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="mg-cta">
              <div><h3>More Education Tools 🚀</h3><p>CGPA calculator, Grade calculator and more.</p></div>
              <Link to="/tools" className="mg-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}