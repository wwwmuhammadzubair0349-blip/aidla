import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "../../components/footer";

// ── Grade scales ──────────────────────────────────────────
const GRADE_SCALES = {
  "4.0": [
    { grade:"A+", points:4.0, min:90 }, { grade:"A",  points:4.0, min:85 },
    { grade:"A-", points:3.7, min:80 }, { grade:"B+", points:3.3, min:75 },
    { grade:"B",  points:3.0, min:71 }, { grade:"B-", points:2.7, min:68 },
    { grade:"C+", points:2.3, min:64 }, { grade:"C",  points:2.0, min:60 },
    { grade:"C-", points:1.7, min:57 }, { grade:"D+", points:1.3, min:53 },
    { grade:"D",  points:1.0, min:50 }, { grade:"F",  points:0.0, min:0  },
  ],
  "5.0": [
    { grade:"A+", points:5.0, min:90 }, { grade:"A",  points:5.0, min:85 },
    { grade:"A-", points:4.5, min:80 }, { grade:"B+", points:4.0, min:75 },
    { grade:"B",  points:3.5, min:70 }, { grade:"B-", points:3.0, min:65 },
    { grade:"C+", points:2.5, min:60 }, { grade:"C",  points:2.0, min:55 },
    { grade:"D",  points:1.0, min:50 }, { grade:"F",  points:0.0, min:0  },
  ],
};

function getStatus(cgpa, scale) {
  const pct = (cgpa / parseFloat(scale)) * 100;
  if (pct >= 90) return { label:"🏆 Distinction",    color:"#d97706" };
  if (pct >= 80) return { label:"🌟 First Division",  color:"#1a3a8f" };
  if (pct >= 66) return { label:"✅ Second Division", color:"#16a34a" };
  if (pct >= 50) return { label:"📋 Third Division",  color:"#64748b" };
  return             { label:"❌ Fail",               color:"#dc2626" };
}

const emptySubject = () => ({ id:Date.now()+Math.random(), subject:"", creditHours:"3", grade:"A", marks:"", manualGPA:"" });
const emptySemester = (n) => ({ id:n, label:`Semester ${n}`, gpa:"", creditHours:"18" });

// ── Shared UI ─────────────────────────────────────────────
const inputStyle = { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:9, fontSize:13, color:"#0f172a", outline:"none", boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif" };
const selectStyle = { ...inputStyle, background:"#fff", cursor:"pointer" };
const labelStyle = { fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:6 };
const cardStyle = { background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,20px)", marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,.04)" };
const btnStyle = { width:"100%", padding:"13px 0", background:"linear-gradient(135deg,#1a3a8f,#3b82f6)", color:"#fff", border:"none", borderRadius:12, fontWeight:800, fontSize:14, cursor:"pointer" };

// ─────────────────────────────────────────────────────────
export default function CGPACalculator() {
  const [scale,   setScale]  = useState("4.0");
  const [mode,    setMode]   = useState("grade");
  // mode: "grade" | "manual" | "semester"

  // Subject rows (grade + manual modes)
  const [rows,    setRows]   = useState([emptySubject(), emptySubject(), emptySubject()]);

  // Semester mode
  const [semCount,    setSemCount]    = useState(4);
  const [semesters,   setSemesters]   = useState(() => Array.from({length:4},(_,i)=>emptySemester(i+1)));
  const [semCreditMode, setSemCreditMode] = useState("equal"); // equal | custom

  const [result,  setResult] = useState(null);
  const [error,   setError]  = useState("");

  const grades = GRADE_SCALES[scale];

  // ── Subject rows helpers ──────────────────────────────
  const updateRow = (id, field, value) => setRows(prev => prev.map(r => r.id===id ? {...r,[field]:value} : r));
  const addRow    = () => setRows(prev => [...prev, emptySubject()]);
  const removeRow = (id) => setRows(prev => prev.length > 1 ? prev.filter(r => r.id!==id) : prev);

  // ── Semester count change ─────────────────────────────
  const handleSemCountChange = (n) => {
    setSemCount(n);
    setSemesters(prev => {
      const next = [...prev];
      while (next.length < n) next.push(emptySemester(next.length+1));
      return next.slice(0, n);
    });
  };

  const updateSem = (id, field, value) => setSemesters(prev => prev.map(s => s.id===id ? {...s,[field]:value} : s));

  // ── Calculate ─────────────────────────────────────────
  const calculate = () => {
    setError(""); setResult(null);

    // ── Semester mode ──
    if (mode === "semester") {
      let totalQP = 0, totalCH = 0;
      const details = [];
      for (const sem of semesters) {
        const gpa = parseFloat(sem.gpa);
        const ch  = parseFloat(sem.creditHours);
        if (isNaN(gpa) || gpa < 0 || gpa > parseFloat(scale)) {
          setError(`${sem.label}: GPA must be between 0 and ${scale}.`); return;
        }
        if (isNaN(ch) || ch <= 0) { setError(`${sem.label}: Credit hours must be > 0.`); return; }
        totalQP += gpa * ch;
        totalCH += ch;
        details.push({ label:sem.label, gpa, ch });
      }
      if (totalCH === 0) { setError("Please fill in all semester data."); return; }
      const cgpa = totalQP / totalCH;
      setResult({ cgpa, totalCH, status:getStatus(cgpa, scale), semDetails:details, mode:"semester" });
      return;
    }

    // ── Grade / Manual mode ──
    let totalQP = 0, totalCH = 0;
    const details = [];

    for (const row of rows) {
      const ch = parseFloat(row.creditHours);
      if (!ch || ch <= 0) continue;

      let pts;

      if (mode === "manual") {
        // Manual GPA input
        const mg = parseFloat(row.manualGPA);
        if (row.manualGPA === "" || row.manualGPA === undefined) continue;
        if (isNaN(mg) || mg < 0 || mg > parseFloat(scale)) {
          setError(`"${row.subject||"A subject"}" GPA must be between 0 and ${scale}.`); return;
        }
        pts = mg;
      } else if (mode === "grade") {
        // Grade dropdown
        const g = grades.find(g => g.grade === row.grade);
        if (!g) continue;
        pts = g.points;
      }

      totalQP += pts * ch;
      totalCH += ch;
      details.push({ subject:row.subject||`Subject ${details.length+1}`, pts, ch, grade:mode==="grade"?row.grade:null, gpa:pts });
    }

    if (totalCH === 0) { setError("Please fill in at least one subject with valid data."); return; }
    const cgpa = totalQP / totalCH;
    setResult({ cgpa, totalCH, totalQP, status:getStatus(cgpa,scale), subjectDetails:details, mode });
  };

  const reset = () => { setResult(null); setError(""); };

  return (
    <>
      <Helmet>
        <title>{"CGPA Calculator Pakistan — 4.0 & 5.0 Scale | AIDLA"}</title>
        <meta name="description" content="Free CGPA calculator for Pakistani universities. Calculate on 4.0 and 5.0 scale by grade, manual GPA, or semester-wise. Instant results." />
        <meta name="keywords" content="CGPA calculator Pakistan, GPA calculator, 4.0 scale, 5.0 scale, semester CGPA, university GPA calculator" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.aidla.online/tools/education/cgpa-calculator" />
      </Helmet>

      <style>{`
        * { box-sizing: border-box; }
        .cgpa-row { display: grid; grid-template-columns: 1fr 72px 100px 34px; gap: 8px; align-items: center; }
        .cgpa-row-manual { display: grid; grid-template-columns: 1fr 72px 100px 34px; gap: 8px; align-items: center; }
        .sem-row { display: grid; grid-template-columns: 120px 1fr 1fr; gap: 10px; align-items: center; }
        @media (max-width: 480px) {
          .cgpa-row, .cgpa-row-manual { grid-template-columns: 1fr 60px 80px 30px; gap: 6px; }
          .sem-row { grid-template-columns: 90px 1fr 1fr; gap: 7px; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" }}>

        {/* Breadcrumb */}
        <div style={{ background:"#fff", borderBottom:"1px solid #f1f5f9", padding:"10px clamp(14px,4vw,24px)" }}>
          <div style={{ maxWidth:900, margin:"0 auto", fontSize:"clamp(10px,2.5vw,12px)", color:"#94a3b8", display:"flex", gap:6, flexWrap:"wrap" }}>
            <Link to="/tools" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Tools</Link>
            <span>›</span>
            <span style={{ color:"#0f172a", fontWeight:600 }}>CGPA Calculator</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#0b1437,#1a3a8f)", padding:"clamp(24px,5vw,40px) clamp(14px,4vw,24px)", textAlign:"center" }}>
          <div style={{ fontSize:"clamp(28px,7vw,40px)", marginBottom:10 }}>🧮</div>
          <h1 style={{ margin:"0 0 8px", fontSize:"clamp(1.4rem,5vw,2rem)", fontWeight:900, color:"#fff" }}>CGPA Calculator</h1>
          <p style={{ margin:0, fontSize:"clamp(12px,3vw,15px)", color:"rgba(255,255,255,0.72)" }}>
            4.0 & 5.0 Scale · Grade / Manual GPA / Semester-wise
          </p>
        </div>

        <div style={{ maxWidth:900, margin:"0 auto", padding:"clamp(16px,4vw,28px) clamp(14px,4vw,24px) 60px", width:"100%" }}>

          {/* ── Settings: Scale + Mode ── */}
          <div style={cardStyle}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {/* Scale */}
              <div>
                <span style={labelStyle}>Grading Scale</span>
                <div style={{ display:"flex", gap:8 }}>
                  {["4.0","5.0"].map(s => (
                    <button key={s} onClick={()=>{ setScale(s); setResult(null); }}
                      style={{ flex:1, padding:"9px 0", borderRadius:10, border:"1px solid", fontWeight:700, fontSize:14, cursor:"pointer",
                        background: scale===s ? "linear-gradient(135deg,#1a3a8f,#3b82f6)" : "#f8fafc",
                        color: scale===s ? "#fff" : "#475569",
                        borderColor: scale===s ? "#1a3a8f" : "#e2e8f0",
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Mode */}
              <div>
                <span style={labelStyle}>Input Mode</span>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {[
                    { id:"grade",    label:"Grade",    emoji:"🔤" },
                    { id:"manual",   label:"Manual GPA",emoji:"✏️" },
                    { id:"semester", label:"Semester",  emoji:"📅" },
                  ].map(m => (
                    <button key={m.id} onClick={()=>{ setMode(m.id); setResult(null); setError(""); }}
                      style={{ flex:"1 1 80px", padding:"7px 4px", borderRadius:9, border:"1px solid", fontWeight:700, fontSize:"clamp(10px,2vw,12px)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                        background: mode===m.id ? "linear-gradient(135deg,#1a3a8f,#3b82f6)" : "#f8fafc",
                        color: mode===m.id ? "#fff" : "#475569",
                        borderColor: mode===m.id ? "#1a3a8f" : "#e2e8f0",
                      }}>
                      <span style={{ fontSize:14 }}>{m.emoji}</span>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── SEMESTER MODE ── */}
          {mode === "semester" && (
            <div style={cardStyle}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
                <span style={labelStyle}>Semester-wise GPA</span>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:12, color:"#64748b", fontWeight:600 }}>No. of Semesters:</span>
                  <select style={{ ...selectStyle, width:80 }} value={semCount} onChange={e=>handleSemCountChange(parseInt(e.target.value))}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              {/* Credit hours mode toggle */}
              <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                {[{id:"equal",label:"Equal Credits (all same)"},{id:"custom",label:"Custom Credits per Semester"}].map(m=>(
                  <button key={m.id} onClick={()=>setSemCreditMode(m.id)}
                    style={{ flex:1, padding:"7px 8px", borderRadius:9, border:"1px solid", fontWeight:600, fontSize:"clamp(10px,2vw,12px)", cursor:"pointer",
                      background: semCreditMode===m.id ? "rgba(26,58,143,.1)" : "#f8fafc",
                      color: semCreditMode===m.id ? "#1a3a8f" : "#475569",
                      borderColor: semCreditMode===m.id ? "#1a3a8f" : "#e2e8f0",
                    }}>
                    {m.label}
                  </button>
                ))}
              </div>

              {semCreditMode === "equal" && (
                <div style={{ marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:12, color:"#64748b", fontWeight:600 }}>Credit Hours per Semester:</span>
                  <input type="number" min="1" max="30" style={{ ...inputStyle, width:80 }}
                    value={semesters[0]?.creditHours||"18"}
                    onChange={e => setSemesters(prev => prev.map(s=>({...s,creditHours:e.target.value})))}
                  />
                </div>
              )}

              {/* Header */}
              <div className="sem-row" style={{ marginBottom:6 }}>
                {["Semester","GPA Obtained", semCreditMode==="custom"?"Credit Hours":""].filter(Boolean).map((h,i)=>(
                  <div key={i} style={{ fontSize:"clamp(9px,2vw,10px)", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</div>
                ))}
              </div>

              {semesters.map(sem => (
                <div key={sem.id} className="sem-row" style={{ marginBottom:8 }}>
                  <div style={{ fontSize:"clamp(11px,2.5vw,13px)", fontWeight:700, color:"#334155" }}>{sem.label}</div>
                  <input type="number" min="0" max={scale} step="0.01" style={inputStyle}
                    value={sem.gpa} onChange={e=>updateSem(sem.id,"gpa",e.target.value)}
                    placeholder={`0.00 – ${scale}`}
                  />
                  {semCreditMode === "custom" && (
                    <input type="number" min="1" max="30" style={inputStyle}
                      value={sem.creditHours} onChange={e=>updateSem(sem.id,"creditHours",e.target.value)}
                      placeholder="e.g. 18"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── GRADE / MANUAL MODE ── */}
          {(mode === "grade" || mode === "manual") && (
            <div style={cardStyle}>
              <span style={{ ...labelStyle, marginBottom:14 }}>
                {mode==="grade" ? "Subjects (Grade)" : "Subjects (Manual GPA per Subject)"}
              </span>
              {mode === "manual" && (
                <div style={{ background:"rgba(26,58,143,.05)", border:"1px solid rgba(26,58,143,.1)", borderRadius:8, padding:"8px 12px", marginBottom:14, fontSize:"clamp(10px,2.5vw,12px)", color:"#334155" }}>
                  💡 Enter the GPA points you achieved per subject (e.g. 3.5, 2.5, 4.0). Use the scale: 0 – {scale}
                </div>
              )}

              {/* Header */}
              <div className={mode==="grade"?"cgpa-row":"cgpa-row-manual"} style={{ marginBottom:6 }}>
                {["Subject","Credits", mode==="grade"?"Grade":"GPA (0–"+scale+")", ""].map((h,i) => (
                  <div key={i} style={{ fontSize:"clamp(9px,2vw,10px)", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</div>
                ))}
              </div>

              {rows.map(row => (
                <div key={row.id} className={mode==="grade"?"cgpa-row":"cgpa-row-manual"} style={{ marginBottom:8 }}>
                  <input style={inputStyle} value={row.subject}
                    onChange={e=>updateRow(row.id,"subject",e.target.value)}
                    placeholder="Subject name"/>
                  <input type="number" min="1" max="6" style={inputStyle}
                    value={row.creditHours}
                    onChange={e=>updateRow(row.id,"creditHours",e.target.value)}
                    placeholder="3"/>
                  {mode === "grade" ? (
                    <select style={selectStyle} value={row.grade}
                      onChange={e=>updateRow(row.id,"grade",e.target.value)}>
                      {grades.map(g=>(
                        <option key={g.grade} value={g.grade}>{g.grade} ({g.points})</option>
                      ))}
                    </select>
                  ) : (
                    <input type="number" min="0" max={scale} step="0.01" style={inputStyle}
                      value={row.manualGPA}
                      onChange={e=>updateRow(row.id,"manualGPA",e.target.value)}
                      placeholder={`0 – ${scale}`}/>
                  )}
                  <button onClick={()=>removeRow(row.id)}
                    style={{ width:34, height:34, border:"1px solid rgba(239,68,68,.2)", borderRadius:8, background:"rgba(239,68,68,.06)", color:"#dc2626", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    ✕
                  </button>
                </div>
              ))}

              <button onClick={addRow}
                style={{ marginTop:10, padding:"7px 16px", border:"1px solid rgba(26,58,143,.2)", borderRadius:8, background:"rgba(26,58,143,.06)", color:"#1a3a8f", cursor:"pointer", fontWeight:700, fontSize:13 }}>
                + Add Subject
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#dc2626", marginBottom:14 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Calculate button */}
          <button style={btnStyle} onClick={calculate}>🧮 Calculate CGPA</button>

          {/* ── RESULT ── */}
          {result && (
            <div style={{ marginTop:16 }}>
              {/* Main result */}
              <div style={{ ...cardStyle, textAlign:"center", background:"linear-gradient(135deg,#0b1437,#1a3a8f)", border:"none" }}>
                <div style={{ fontSize:"clamp(11px,3vw,13px)", fontWeight:700, color:"rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
                  {result.mode==="semester" ? "Cumulative GPA (CGPA)" : "Your CGPA"} · {scale} Scale
                </div>
                <div style={{ fontSize:"clamp(3rem,15vw,5rem)", fontWeight:900, color:"#fff", lineHeight:1 }}>
                  {result.cgpa.toFixed(2)}
                </div>
                <div style={{ fontSize:"clamp(14px,3.5vw,18px)", fontWeight:700, color:"#fcd34d", marginTop:8 }}>
                  {result.status.label}
                </div>
                <div style={{ display:"flex", justifyContent:"center", gap:24, marginTop:10, fontSize:"clamp(11px,3vw,13px)", color:"rgba(255,255,255,.65)", flexWrap:"wrap" }}>
                  <span>Total Credits: {result.totalCH}</span>
                  {result.totalQP && <span>Quality Points: {result.totalQP.toFixed(2)}</span>}
                  <span>Percentage: ~{((result.cgpa/parseFloat(scale))*100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Semester breakdown */}
              {result.mode === "semester" && result.semDetails && (
                <div style={cardStyle}>
                  <span style={{ ...labelStyle, marginBottom:12 }}>Semester Breakdown</span>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {result.semDetails.map((s,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"#f8fafc", borderRadius:10, border:"1px solid #f1f5f9" }}>
                        <span style={{ fontSize:13, fontWeight:700, color:"#334155" }}>{s.label}</span>
                        <div style={{ display:"flex", gap:16, fontSize:12, color:"#64748b" }}>
                          <span>Credits: {s.ch}</span>
                          <span style={{ fontWeight:800, color:"#1a3a8f" }}>GPA: {s.gpa.toFixed(2)}</span>
                          <span>QP: {(s.gpa*s.ch).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject breakdown */}
              {result.subjectDetails && result.subjectDetails.length > 0 && (
                <div style={cardStyle}>
                  <span style={{ ...labelStyle, marginBottom:12 }}>Subject Breakdown</span>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"clamp(11px,2.5vw,13px)" }}>
                      <thead>
                        <tr style={{ background:"#f8fafc" }}>
                          {["Subject","Grade/GPA","Credits","Quality Points"].map(h=>(
                            <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontWeight:700, color:"#64748b", fontSize:"clamp(9px,2vw,10px)", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.subjectDetails.map((d,i)=>(
                          <tr key={i} style={{ borderTop:"1px solid #f1f5f9" }}>
                            <td style={{ padding:"9px 10px", fontWeight:600, color:"#0f172a" }}>{d.subject}</td>
                            <td style={{ padding:"9px 10px", fontWeight:700, color:"#1a3a8f" }}>{d.grade||d.gpa.toFixed(2)}</td>
                            <td style={{ padding:"9px 10px", color:"#334155" }}>{d.ch}</td>
                            <td style={{ padding:"9px 10px", fontWeight:700, color:"#16a34a" }}>{(d.pts*d.ch).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <button onClick={reset}
                style={{ width:"100%", padding:"11px 0", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:12, fontWeight:700, fontSize:13, cursor:"pointer", color:"#475569", marginTop:4 }}>
                🔄 Reset & Calculate Again
              </button>
            </div>
          )}

          {/* Grade scale reference */}
          <div style={{ ...cardStyle, marginTop:result?16:0 }}>
            <span style={{ ...labelStyle, marginBottom:12 }}>{scale} Grade Scale Reference</span>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:6 }}>
              {GRADE_SCALES[scale].map(g=>(
                <div key={g.grade} style={{ background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:8, padding:"7px 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontWeight:800, color:"#1a3a8f", fontSize:13 }}>{g.grade}</span>
                  <span style={{ fontSize:11, color:"#64748b" }}>{g.points} · ≥{g.min}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}