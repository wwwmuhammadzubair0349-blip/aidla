import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import Footer from "../components/footer";
import {
  BOARDS, PROVINCES, PROVINCE_COLORS, PROVINCE_EMOJIS,
  getBoardsByProvince, getMergedStatus, getCountdown, CURRENT_YEAR,
} from "../../data/boardsData";

const PROVINCE_DESCS = {
  "Punjab":           "9 boards covering all Punjab districts",
  "KPK":              "8 boards covering Khyber Pakhtunkhwa",
  "Sindh":            "5 boards covering all Sindh districts",
  "Balochistan":      "1 board covering Balochistan province",
  "Federal":          "FBISE covering Islamabad & cantonments",
  "AJK":              "BISE AJK covering Azad Kashmir",
  "Gilgit-Baltistan": "BISE GB covering Gilgit-Baltistan",
};

// ── Countdown display ─────────────────────────────────────
function CountdownPill({ date, label }) {
  const [cd, setCd] = useState(null);

  useEffect(() => {
    if (!date) return;
    const update = () => setCd(getCountdown(date));
    update();
    const iv = setInterval(update, 60000); // update every minute
    return () => clearInterval(iv);
  }, [date]);

  if (!cd) return null;
  if (cd.days > 60) {
    // Show month estimate instead of countdown
    return (
      <span style={{ fontSize:"clamp(8px,2vw,9px)", fontWeight:700, color:"#d97706", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:20, padding:"2px 7px", whiteSpace:"nowrap" }}>
        {label}: {date.toLocaleDateString("en-PK",{month:"short",year:"numeric"})}
      </span>
    );
  }
  return (
    <span style={{ fontSize:"clamp(8px,2vw,9px)", fontWeight:700, color:"#dc2626", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:20, padding:"2px 7px", whiteSpace:"nowrap" }}>
      {label}: {cd.days}d {cd.hours}h left
    </span>
  );
}

// ── Status badge ──────────────────────────────────────────
function StatusBadge({ status, label, color }) {
  if (!status) return null;
  return (
    <span style={{ fontSize:"clamp(7px,1.8vw,9px)", fontWeight:800, padding:"2px 7px", borderRadius:20, whiteSpace:"nowrap",
      background:`${color}15`, color, border:`1px solid ${color}28`,
      textTransform:"uppercase", letterSpacing:"0.04em",
    }}>{label}</span>
  );
}

// ─────────────────────────────────────────────────────────
export default function ResultsHub() {
  const [activeProvince, setActiveProvince] = useState("Punjab");
  const [search,         setSearch]         = useState("");
  const [announcements,  setAnnouncements]  = useState({});
  const [loading,        setLoading]        = useState(true);

  // Load all announcements from DB
useEffect(() => {
    supabase
      .rpc("board_announcements_get_all", { p_year: CURRENT_YEAR })
      .then(({ data, error }) => {
        if (!error && data) {
          const map = {};
          data.forEach(a => { map[a.board_id] = a; });
          setAnnouncements(map);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const currentBoards = search.trim()
    ? BOARDS.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.city.toLowerCase().includes(search.toLowerCase()) ||
        b.province.toLowerCase().includes(search.toLowerCase()) ||
        b.districts.some(d => d.toLowerCase().includes(search.toLowerCase()))
      )
    : getBoardsByProvince(activeProvince);

  return (
    <>
      <Helmet>
        <title>{"Pakistan Board Results " + CURRENT_YEAR + " — All BISE Boards | AIDLA"}</title>
        <meta name="description" content={`Check Matric and Intermediate results ${CURRENT_YEAR} for all BISE boards in Pakistan — Punjab, KPK, Sindh, Balochistan, FBISE Islamabad, AJK and Gilgit-Baltistan. Live result status and countdowns.`} />
        <meta name="keywords" content={`BISE result ${CURRENT_YEAR}, matric result ${CURRENT_YEAR}, inter result ${CURRENT_YEAR}, SSC result, HSSC result, board result Pakistan, BISE Lahore, BISE Karachi, FBISE`} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`Pakistan Board Results ${CURRENT_YEAR} — All BISE Boards`} />
        <meta property="og:description" content={`Matric & Inter results ${CURRENT_YEAR} for all 26 BISE boards in Pakistan with live status.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.aidla.online/tools/results" />
        <link rel="canonical" href="https://www.aidla.online/tools/results" />
      </Helmet>

      <style>{`
        *{box-sizing:border-box;}
        .rh-wrap{overflow-x:hidden;}
        .rh-board-grid{display:grid;grid-template-columns:1fr;gap:10px;}
        @media(min-width:480px){.rh-board-grid{grid-template-columns:repeat(2,1fr);}}
        @media(min-width:800px){.rh-board-grid{grid-template-columns:repeat(3,1fr);gap:14px;}}
        @media(min-width:1100px){.rh-board-grid{grid-template-columns:repeat(4,1fr);}}
        .rh-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
        @media(min-width:600px){.rh-stats{grid-template-columns:repeat(5,1fr);}}
        .rh-info{display:grid;grid-template-columns:1fr;gap:12px;margin-top:32px;}
        @media(min-width:600px){.rh-info{grid-template-columns:repeat(2,1fr);}}
        @media(min-width:900px){.rh-info{grid-template-columns:repeat(4,1fr);}}
        .rh-tabs{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:16px;}
        .rh-tab{padding:7px 13px;border-radius:24px;border:1px solid #e2e8f0;background:#fff;color:#475569;font-weight:700;font-size:clamp(10px,2.5vw,13px);cursor:pointer;transition:all .15s;white-space:nowrap;font-family:'DM Sans',sans-serif;}
        .rh-card{background:#fff;border:1px solid #f1f5f9;border-radius:16px;overflow:hidden;transition:all .2s;box-shadow:0 1px 4px rgba(0,0,0,.04);height:100%;display:flex;flex-direction:column;}
        .rh-card:hover{box-shadow:0 8px 20px rgba(26,58,143,.1);border-color:#c7d7f7;transform:translateY(-2px);}
      `}</style>

      <div className="rh-wrap" style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif" }}>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#0b1437 0%,#1a3a8f 65%,#3b82f6 100%)", padding:"clamp(28px,6vw,52px) clamp(14px,4vw,24px) clamp(32px,7vw,60px)", textAlign:"center" }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:24, padding:"4px 13px", fontSize:"clamp(9px,2.5vw,11px)", color:"rgba(255,255,255,0.85)", marginBottom:14, fontWeight:700 }}>
              🎓 {BOARDS.length} Boards · All Pakistan · {CURRENT_YEAR}
            </div>
            <h1 style={{ margin:"0 0 10px", fontSize:"clamp(1.4rem,5.5vw,2.5rem)", fontWeight:900, color:"#fff", lineHeight:1.2, wordBreak:"break-word" }}>
              Pakistan Board Results {CURRENT_YEAR}
            </h1>
            <p style={{ margin:"0 0 22px", fontSize:"clamp(12px,3vw,15px)", color:"rgba(255,255,255,0.72)", lineHeight:1.7 }}>
              Live result status · Matric &amp; Inter · All BISE boards · Auto-updated daily
            </p>
            <div style={{ position:"relative", maxWidth:480, margin:"0 auto" }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, pointerEvents:"none" }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search board, city or district…"
                style={{ width:"100%", padding:"12px 14px 12px 42px", border:"none", borderRadius:12, fontSize:"clamp(13px,3vw,14px)", background:"rgba(255,255,255,0.95)", color:"#0f172a", outline:"none", boxShadow:"0 4px 20px rgba(0,0,0,.18)", boxSizing:"border-box" }}/>
              {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#94a3b8", padding:0 }}>✕</button>}
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"clamp(16px,4vw,28px) clamp(12px,3vw,20px) clamp(40px,8vw,60px)", width:"100%" }}>

          {/* Stats */}
          <div className="rh-stats" style={{ marginBottom:24 }}>
            {[
              { label:"Total Boards", value:BOARDS.length, icon:"🏛️" },
              { label:"Punjab",       value:getBoardsByProvince("Punjab").length, icon:"🟦" },
              { label:"KPK",          value:getBoardsByProvince("KPK").length, icon:"🟩" },
              { label:"Sindh",        value:getBoardsByProvince("Sindh").length, icon:"🟥" },
              { label:"Others",       value:BOARDS.length - getBoardsByProvince("Punjab").length - getBoardsByProvince("KPK").length - getBoardsByProvince("Sindh").length, icon:"🔵" },
            ].map(s => (
              <div key={s.label} style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:14, padding:"12px 10px", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:"clamp(16px,4vw,20px)", marginBottom:3 }}>{s.icon}</div>
                <div style={{ fontSize:"clamp(18px,5vw,22px)", fontWeight:900, color:"#0b1437" }}>{s.value}</div>
                <div style={{ fontSize:"clamp(9px,2vw,10px)", color:"#94a3b8", fontWeight:600, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Province tabs */}
          {!search && (
            <>
              <div className="rh-tabs">
                {PROVINCES.map(p => {
                  const active = activeProvince === p;
                  const color  = PROVINCE_COLORS[p];
                  return (
                    <button key={p} className="rh-tab" onClick={() => setActiveProvince(p)}
                      style={{ borderColor:active?color:"#e2e8f0", background:active?color:"#fff", color:active?"#fff":"#475569" }}>
                      {PROVINCE_EMOJIS[p]} {p} <span style={{ opacity:.65, fontSize:".75em" }}>({getBoardsByProvince(p).length})</span>
                    </button>
                  );
                })}
              </div>
              <div style={{ background:"rgba(26,58,143,.05)", border:"1px solid rgba(26,58,143,.1)", borderRadius:10, padding:"10px 14px", marginBottom:18, fontSize:"clamp(11px,2.5vw,13px)", color:"#334155" }}>
                📍 {PROVINCE_DESCS[activeProvince]}
              </div>
            </>
          )}

          {search && (
            <div style={{ marginBottom:14, fontSize:"clamp(12px,3vw,14px)", fontWeight:600, color:"#334155" }}>
              {currentBoards.length} result{currentBoards.length!==1?"s":""} for "<strong>{search}</strong>"
            </div>
          )}

          {/* Board cards */}
          {currentBoards.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 16px", border:"2px dashed #e2e8f0", borderRadius:16 }}>
              <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
              <div style={{ fontWeight:700, color:"#334155" }}>No boards found for "{search}"</div>
              <button onClick={()=>setSearch("")} style={{ marginTop:14, padding:"8px 20px", background:"linear-gradient(135deg,#1a3a8f,#3b82f6)", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:13 }}>Clear</button>
            </div>
          ) : (
            <div className="rh-board-grid">
              {currentBoards.map((board, i) => {
                const ann       = announcements[board.id];
                const mStatus   = getMergedStatus(board.id, "matric", ann);
                const iStatus   = getMergedStatus(board.id, "inter",  ann);
                const mCountdown = mStatus.expectedDate && mStatus.status === "expected" ? mStatus.expectedDate : null;
                const iCountdown = iStatus.expectedDate && iStatus.status === "expected" ? iStatus.expectedDate : null;

                return (
                  <motion.div key={board.id} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:.25, delay:i*.03 }}>
                    <Link to={`/tools/results/${board.id}`} style={{ textDecoration:"none", display:"block", height:"100%" }}>
                      <div className="rh-card">
                        <div style={{ height:4, background:PROVINCE_COLORS[board.province]||"#1a3a8f", flexShrink:0 }}/>
                        <div style={{ padding:"14px 14px 12px", flex:1, display:"flex", flexDirection:"column", gap:8, minWidth:0 }}>

                          {/* Header */}
                          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:6, minWidth:0 }}>
                            <div style={{ minWidth:0 }}>
                              <div style={{ fontSize:"clamp(12px,3vw,14px)", fontWeight:800, color:"#0b1437", wordBreak:"break-word" }}>{board.name}</div>
                              <div style={{ fontSize:"clamp(9px,2vw,10px)", color:"#94a3b8" }}>{board.city}</div>
                            </div>
                            <span style={{ fontSize:"clamp(8px,2vw,9px)", fontWeight:700, padding:"2px 7px", borderRadius:20, flexShrink:0,
                              background:`${PROVINCE_COLORS[board.province]}18`, color:PROVINCE_COLORS[board.province],
                              border:`1px solid ${PROVINCE_COLORS[board.province]}28` }}>
                              {board.province}
                            </span>
                          </div>

                          {/* Live status badges */}
                          {!loading && (
                            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                              <StatusBadge status={mStatus.status} label={mStatus.status==="announced"?"✅ Matric Out":"📋 Matric"} color={mStatus.color}/>
                              <StatusBadge status={iStatus.status} label={iStatus.status==="announced"?"✅ Inter Out":"📋 Inter"} color={iStatus.color}/>
                            </div>
                          )}

                          {/* Countdown or announced date */}
                          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                            {mStatus.status === "announced" && mStatus.announcedDate && (
                              <span style={{ fontSize:"clamp(8px,2vw,9px)", fontWeight:700, color:"#15803d", background:"rgba(22,163,74,.08)", border:"1px solid rgba(22,163,74,.2)", borderRadius:20, padding:"2px 7px", whiteSpace:"nowrap" }}>
                                Matric: {new Date(mStatus.announcedDate).toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"})}
                              </span>
                            )}
                            {mStatus.status === "expected" && mCountdown && (
                              <CountdownPill date={mCountdown} label="Matric"/>
                            )}
                            {iStatus.status === "announced" && iStatus.announcedDate && (
                              <span style={{ fontSize:"clamp(8px,2vw,9px)", fontWeight:700, color:"#1d4ed8", background:"rgba(59,130,246,.08)", border:"1px solid rgba(59,130,246,.2)", borderRadius:20, padding:"2px 7px", whiteSpace:"nowrap" }}>
                                Inter: {new Date(iStatus.announcedDate).toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"})}
                              </span>
                            )}
                            {iStatus.status === "expected" && iCountdown && (
                              <CountdownPill date={iCountdown} label="Inter"/>
                            )}
                          </div>

                          {/* Districts */}
                          <div style={{ fontSize:"clamp(9px,2vw,10px)", color:"#94a3b8", lineHeight:1.5 }}>
                            📍 {board.districts.slice(0,2).join(", ")}{board.districts.length>2?` +${board.districts.length-2}`:""}
                          </div>

                          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"auto" }}>
                            <span style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:700, color:"#1a3a8f" }}>Details →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Info section */}
          <div className="rh-info">
            {[
              { icon:"🤖", title:"Auto-Updated Daily", body:"Our AI checks Pakistani news RSS feeds every day and automatically updates result status for all boards." },
              { icon:"📅", title:"When are results out?", body:`Matric (SSC) typically July-August ${CURRENT_YEAR}. Intermediate (HSSC) October-November ${CURRENT_YEAR}. Sindh boards are 1-2 months later.` },
              { icon:"📋", title:"What do I need?", body:"Your Roll Number from your Admit Card. Enter it on the official board website to check your result." },
              { icon:"🔄", title:"Rechecking?", body:"Most boards allow rechecking within 15 days of result announcement. Visit the board's official website." },
            ].map(info => (
              <div key={info.title} style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:14, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:"clamp(18px,5vw,22px)", marginBottom:8 }}>{info.icon}</div>
                <div style={{ fontSize:"clamp(12px,3vw,13px)", fontWeight:700, color:"#0b1437", marginBottom:6 }}>{info.title}</div>
                <div style={{ fontSize:"clamp(11px,2.5vw,12px)", color:"#64748b", lineHeight:1.65 }}>{info.body}</div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}