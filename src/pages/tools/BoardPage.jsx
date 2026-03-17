import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../../lib/supabase";
import Footer from "../components/footer";
import {
  getBoardById, PROVINCE_COLORS, getBoardsByProvince,
  getMergedStatus, getCountdown, CURRENT_YEAR,
} from "../../data/boardsData";

// ── Live countdown component ──────────────────────────────
function LiveCountdown({ date, label, color }) {
  const [cd, setCd] = useState(null);

  useEffect(() => {
    if (!date) return;
    const update = () => setCd(getCountdown(date));
    update();
    const iv = setInterval(update, 1000); // live seconds
    return () => clearInterval(iv);
  }, [date]);

  if (!cd) return null;

  if (cd.days > 60) {
    return (
      <div style={{ background:`${color}08`, border:`1px solid ${color}20`, borderRadius:12, padding:"12px 16px" }}>
        <div style={{ fontSize:"clamp(9px,2vw,11px)", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{label} Expected</div>
        <div style={{ fontSize:"clamp(14px,3.5vw,18px)", fontWeight:800, color }}>
          {date.toLocaleDateString("en-PK",{ month:"long", year:"numeric" })}
        </div>
        <div style={{ fontSize:"clamp(9px,2vw,11px)", color:"#64748b", marginTop:3 }}>~{cd.days} days away</div>
      </div>
    );
  }

  return (
    <div style={{ background:`${color}08`, border:`2px solid ${color}30`, borderRadius:12, padding:"12px 16px" }}>
      <div style={{ fontSize:"clamp(9px,2vw,11px)", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>{label} Countdown</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, textAlign:"center" }}>
        {[{ v:cd.days, l:"Days" }, { v:cd.hours, l:"Hours" }, { v:cd.minutes, l:"Mins" }].map(u => (
          <div key={u.l} style={{ background:"#fff", borderRadius:8, padding:"8px 4px", border:`1px solid ${color}20` }}>
            <div style={{ fontSize:"clamp(18px,5vw,28px)", fontWeight:900, color, lineHeight:1 }}>{String(u.v).padStart(2,"0")}</div>
            <div style={{ fontSize:"clamp(8px,2vw,10px)", color:"#94a3b8", fontWeight:600, marginTop:3 }}>{u.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
export default function BoardPage() {
  const { boardId } = useParams();
  const board = getBoardById(boardId);

  const [ann,     setAnn]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!boardId) return;
    supabase
      .rpc("board_announcement_get", { p_board_id: boardId })
      .then(({ data }) => {
        if (data && data.length > 0) setAnn(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [boardId]);

  if (!board) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:20, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:14 }}>🏫</div>
        <h1 style={{ fontSize:"clamp(16px,5vw,20px)", fontWeight:800, color:"#0f172a", marginBottom:8 }}>Board Not Found</h1>
        <p style={{ color:"#64748b", marginBottom:20, fontSize:14 }}>This board page doesn't exist.</p>
        <Link to="/tools/results" style={{ padding:"11px 24px", background:"linear-gradient(135deg,#1a3a8f,#3b82f6)", color:"#fff", borderRadius:10, textDecoration:"none", fontWeight:700, fontSize:14 }}>
          ← All Boards
        </Link>
        <Footer/>
      </div>
    );
  }

  const accent   = PROVINCE_COLORS[board.province] || "#1a3a8f";
  const related  = getBoardsByProvince(board.province).filter(b => b.id !== board.id).slice(0, 4);
  const pageUrl  = `https://www.aidla.online/tools/results/${board.id}`;
  const metaTitle = `${board.name} Result ${CURRENT_YEAR} — Matric & Inter Online | AIDLA`;
  const metaDesc  = `Check ${board.name} Matric and Intermediate result ${CURRENT_YEAR} online. ${board.fullName} covers ${board.districts.slice(0,3).join(", ")}. Live result status, countdown and step-by-step guide.`;

  const mStatus = getMergedStatus(board.id, "matric", ann);
  const iStatus = getMergedStatus(board.id, "inter",  ann);

  // Direct result URL — use AI-found URL or fallback to board homepage
  const mResultUrl = mStatus.resultUrl || board.url;
  const iResultUrl = iStatus.resultUrl || board.url;

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description"        content={metaDesc} />
        <meta name="keywords"           content={`${board.name} result ${CURRENT_YEAR}, ${board.city} board result, matric result ${board.city} ${CURRENT_YEAR}, inter result ${board.city} ${CURRENT_YEAR}, BISE ${board.city}`} />
        <meta name="robots"             content="index, follow" />
        <meta name="viewport"           content="width=device-width, initial-scale=1" />
        <meta property="og:title"       content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={pageUrl} />
        <link rel="canonical"           href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebPage",
          "name":metaTitle,"description":metaDesc,"url":pageUrl,
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"},
          "breadcrumb":{"@type":"BreadcrumbList","itemListElement":[
            {"@type":"ListItem","position":1,"name":"Home","item":"https://www.aidla.online"},
            {"@type":"ListItem","position":2,"name":"Tools","item":"https://www.aidla.online/tools"},
            {"@type":"ListItem","position":3,"name":"Results","item":"https://www.aidla.online/tools/results"},
            {"@type":"ListItem","position":4,"name":board.name,"item":pageUrl},
          ]},
          "mainEntity":{"@type":"FAQPage","mainEntity":board.faqs.map(f=>({
            "@type":"Question","name":f.q,
            "acceptedAnswer":{"@type":"Answer","text":f.a},
          }))},
        })}</script>
      </Helmet>

      <style>{`
        *{box-sizing:border-box;}
        .bp-wrap{overflow-x:hidden;}
        .bp-layout{display:grid;grid-template-columns:1fr;gap:14px;}
        @media(min-width:860px){.bp-layout{grid-template-columns:1fr 280px;align-items:start;}}
        .bp-sidebar{order:-1;}
        @media(min-width:860px){.bp-sidebar{order:0;position:sticky;top:20px;}}
        .bp-result-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .bp-detail-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 16px;}
        @media(min-width:480px){.bp-detail-grid{grid-template-columns:repeat(3,1fr);}}
        .bp-card{background:#fff;border:1px solid #f1f5f9;border-radius:16px;padding:clamp(14px,3vw,20px);margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.04);}
        .bp-section-title{font-size:clamp(9px,2vw,11px);font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;}
      `}</style>

      <div className="bp-wrap" style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif" }}>

        {/* Breadcrumb */}
        <div style={{ background:"#fff", borderBottom:"1px solid #f1f5f9", padding:"10px clamp(12px,3vw,20px)" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", gap:"clamp(4px,1.5vw,8px)", fontSize:"clamp(10px,2.5vw,12px)", color:"#94a3b8", flexWrap:"wrap" }}>
            <Link to="/"              style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Home</Link><span>›</span>
            <Link to="/tools"         style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Tools</Link><span>›</span>
            <Link to="/tools/results" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Results</Link><span>›</span>
            <span style={{ color:"#0f172a", fontWeight:600, maxWidth:"35vw", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{board.name}</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background:`linear-gradient(135deg,#0b1437 0%,${accent} 70%,#3b82f6 100%)`, padding:"clamp(20px,5vw,36px) clamp(14px,4vw,24px) clamp(24px,6vw,40px)" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:12 }}>
              <span style={{ fontSize:"clamp(9px,2vw,11px)", fontWeight:700, padding:"3px 10px", borderRadius:20, background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.9)" }}>📍 {board.province}</span>
              <span style={{ fontSize:"clamp(9px,2vw,11px)", fontWeight:700, padding:"3px 10px", borderRadius:20, background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.9)" }}>🏛️ Est. {board.established}</span>
              {/* Live status from DB */}
              {!loading && mStatus.status === "announced" && (
                <span style={{ fontSize:"clamp(9px,2vw,11px)", fontWeight:800, padding:"3px 10px", borderRadius:20, background:"rgba(220,38,38,0.3)", color:"#fca5a5", border:"1px solid rgba(220,38,38,0.4)" }}>🔴 Results Announced!</span>
              )}
              {!loading && ann?.last_checked && (
                <span style={{ fontSize:"clamp(8px,2vw,9px)", fontWeight:600, padding:"3px 10px", borderRadius:20, background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)" }}>
                  🤖 Auto-updated {new Date(ann.last_checked).toLocaleDateString("en-PK",{day:"numeric",month:"short"})}
                </span>
              )}
            </div>
            <h1 style={{ margin:"0 0 8px", fontSize:"clamp(1.3rem,5vw,2.2rem)", fontWeight:900, color:"#fff", lineHeight:1.2, wordBreak:"break-word" }}>
              {board.name} Result {CURRENT_YEAR}
            </h1>
            <p style={{ margin:"0 0 18px", fontSize:"clamp(11px,2.8vw,14px)", color:"rgba(255,255,255,0.72)", lineHeight:1.6, maxWidth:560 }}>
              {board.fullName}
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              <a href={mResultUrl} target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"clamp(10px,3vw,13px) clamp(14px,4vw,24px)", background:"linear-gradient(135deg,#f59e0b,#fcd34d)", color:"#0b1437", borderRadius:12, textDecoration:"none", fontWeight:800, fontSize:"clamp(12px,3vw,14px)", boxShadow:"0 6px 20px rgba(245,158,11,0.3)" }}>
                📋 Matric Result {CURRENT_YEAR} →
              </a>
              <a href={iResultUrl} target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"clamp(10px,3vw,13px) clamp(14px,4vw,24px)", background:"rgba(255,255,255,0.15)", color:"#fff", borderRadius:12, textDecoration:"none", fontWeight:700, fontSize:"clamp(12px,3vw,14px)", border:"1px solid rgba(255,255,255,0.3)" }}>
                🎓 Inter Result {CURRENT_YEAR} →
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"clamp(14px,3vw,24px) clamp(12px,3vw,20px) clamp(40px,8vw,60px)", width:"100%" }}>
          <div className="bp-layout">

            {/* LEFT */}
            <div style={{ minWidth:0 }}>

              {/* Live countdowns */}
              {!loading && (
                <div className="bp-card">
                  <div className="bp-section-title">⏱️ Result Status {CURRENT_YEAR}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {mStatus.status === "announced" ? (
                      <div style={{ background:"rgba(22,163,74,.06)", border:"2px solid rgba(22,163,74,.3)", borderRadius:12, padding:"14px 16px" }}>
                        <div style={{ fontSize:"clamp(9px,2vw,11px)", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", marginBottom:6 }}>Matric Result</div>
                        <div style={{ fontSize:"clamp(14px,3.5vw,18px)", fontWeight:900, color:"#15803d" }}>✅ Results Announced!</div>
                        {mStatus.announcedDate && <div style={{ fontSize:"clamp(11px,2.5vw,13px)", color:"#64748b", marginTop:4 }}>Announced: {new Date(mStatus.announcedDate).toLocaleDateString("en-PK",{day:"numeric",month:"long",year:"numeric"})}</div>}
                        <a href={mResultUrl} target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", marginTop:10, padding:"8px 18px", background:"linear-gradient(135deg,#16a34a,#22c55e)", color:"#fff", borderRadius:8, textDecoration:"none", fontWeight:700, fontSize:"clamp(11px,2.5vw,13px)" }}>
                          Check Matric Result Now →
                        </a>
                      </div>
                    ) : (
                      <LiveCountdown date={mStatus.expectedDate} label="Matric" color="#15803d"/>
                    )}
                    {iStatus.status === "announced" ? (
                      <div style={{ background:"rgba(59,130,246,.06)", border:"2px solid rgba(59,130,246,.3)", borderRadius:12, padding:"14px 16px" }}>
                        <div style={{ fontSize:"clamp(9px,2vw,11px)", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", marginBottom:6 }}>Inter Result</div>
                        <div style={{ fontSize:"clamp(14px,3.5vw,18px)", fontWeight:900, color:"#1d4ed8" }}>✅ Results Announced!</div>
                        {iStatus.announcedDate && <div style={{ fontSize:"clamp(11px,2.5vw,13px)", color:"#64748b", marginTop:4 }}>Announced: {new Date(iStatus.announcedDate).toLocaleDateString("en-PK",{day:"numeric",month:"long",year:"numeric"})}</div>}
                        <a href={iResultUrl} target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", marginTop:10, padding:"8px 18px", background:"linear-gradient(135deg,#2563eb,#3b82f6)", color:"#fff", borderRadius:8, textDecoration:"none", fontWeight:700, fontSize:"clamp(11px,2.5vw,13px)" }}>
                          Check Inter Result Now →
                        </a>
                      </div>
                    ) : (
                      <LiveCountdown date={iStatus.expectedDate} label="Inter" color="#1d4ed8"/>
                    )}
                    {ann?.last_checked && (
                      <div style={{ fontSize:"clamp(9px,2vw,10px)", color:"#94a3b8", textAlign:"center" }}>
                        🤖 Status auto-updated by AI · Last checked: {new Date(ann.last_checked).toLocaleString("en-PK",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* How to check */}
              <div className="bp-card">
                <div className="bp-section-title">📋 How to Check {board.name} Result {CURRENT_YEAR}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {board.howToCheck.map((step, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                      <div style={{ width:24, height:24, borderRadius:"50%", background:`${accent}15`, border:`2px solid ${accent}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"clamp(9px,2vw,11px)", fontWeight:800, color:accent, flexShrink:0, marginTop:1 }}>
                        {i+1}
                      </div>
                      <div style={{ fontSize:"clamp(12px,3vw,13px)", color:"#334155", lineHeight:1.6 }}>{step}</div>
                    </div>
                  ))}
                </div>
                <a href={board.url} target="_blank" rel="noopener noreferrer"
                  style={{ display:"block", marginTop:16, padding:"12px 0", background:`linear-gradient(135deg,${accent},#3b82f6)`, color:"#fff", borderRadius:12, textDecoration:"none", fontWeight:700, fontSize:"clamp(12px,3vw,14px)", textAlign:"center" }}>
                  🌐 Go to Official {board.name} Website →
                </a>
              </div>

              {/* Districts */}
              <div className="bp-card">
                <div className="bp-section-title">📍 Districts Covered</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                  {board.districts.map(d => (
                    <span key={d} style={{ fontSize:"clamp(10px,2.5vw,12px)", fontWeight:600, padding:"4px 10px", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:20, color:"#334155" }}>{d}</span>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="bp-card">
                <div className="bp-section-title">📚 Board Details</div>
                <div className="bp-detail-grid">
                  {[
                    { label:"Province",  value:board.province },
                    { label:"City",      value:board.city },
                    { label:"Est.",      value:board.established },
                    { label:"Districts", value:board.districts.length },
                    { label:"Classes",   value:board.classes.length+" levels" },
                    { label:"Subjects",  value:board.subjects.length+" streams" },
                  ].map(row => (
                    <div key={row.label} style={{ display:"flex", flexDirection:"column", gap:2 }}>
                      <span style={{ fontSize:"clamp(8px,2vw,10px)", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em" }}>{row.label}</span>
                      <span style={{ fontSize:"clamp(11px,2.5vw,13px)", fontWeight:700, color:"#334155" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="bp-card" style={{ marginBottom:0 }}>
                <div className="bp-section-title">❓ Frequently Asked Questions</div>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {board.faqs.map((faq, i) => (
                    <div key={i} style={{ borderBottom:i<board.faqs.length-1?"1px solid #f8fafc":"none", paddingBottom:i<board.faqs.length-1?14:0 }}>
                      <div style={{ fontSize:"clamp(12px,3vw,13px)", fontWeight:700, color:"#0f172a", marginBottom:5 }}>Q: {faq.q}</div>
                      <div style={{ fontSize:"clamp(11px,2.5vw,12px)", color:"#64748b", lineHeight:1.7 }}>A: {faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="bp-sidebar" style={{ display:"flex", flexDirection:"column", gap:12, minWidth:0 }}>

              {/* Quick check */}
              <div style={{ background:"#fff", border:`1px solid ${accent}22`, borderRadius:16, padding:"clamp(14px,3vw,20px)", boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                <div className="bp-section-title">Quick Check</div>
                <p style={{ fontSize:"clamp(11px,2.5vw,13px)", color:"#64748b", lineHeight:1.6, marginBottom:14 }}>
                  Enter your Roll Number on the official website to check your result instantly.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <a href={mResultUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display:"block", padding:"11px 0", background:`linear-gradient(135deg,${accent},#3b82f6)`, color:"#fff", borderRadius:10, textDecoration:"none", fontWeight:700, fontSize:"clamp(12px,3vw,13px)", textAlign:"center" }}>
                    📋 Matric Result →
                  </a>
                  <a href={iResultUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display:"block", padding:"11px 0", background:"linear-gradient(135deg,#334155,#475569)", color:"#fff", borderRadius:10, textDecoration:"none", fontWeight:700, fontSize:"clamp(12px,3vw,13px)", textAlign:"center" }}>
                    🎓 Inter Result →
                  </a>
                </div>
                <div style={{ marginTop:8, fontSize:"clamp(9px,2vw,10px)", color:"#94a3b8", textAlign:"center" }}>
                  Opens official {board.name} website
                </div>
              </div>

              {/* Subjects */}
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,18px)", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div className="bp-section-title">Subjects</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {board.subjects.map(s => (
                    <span key={s} style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:600, padding:"3px 10px", background:`${accent}10`, border:`1px solid ${accent}22`, borderRadius:20, color:accent }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Related boards */}
              {related.length > 0 && (
                <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,18px)", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                  <div className="bp-section-title">Other {board.province} Boards</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                    {related.map(b => (
                      <Link key={b.id} to={`/tools/results/${b.id}`}
                        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 12px", background:"#f8fafc", borderRadius:10, textDecoration:"none", border:"1px solid #f1f5f9", transition:"all .15s", minWidth:0 }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="#c7d7f7";e.currentTarget.style.background="#f0f7ff";}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="#f1f5f9";e.currentTarget.style.background="#f8fafc";}}>
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontSize:"clamp(11px,2.5vw,13px)", fontWeight:700, color:"#0b1437", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.name}</div>
                          <div style={{ fontSize:"clamp(9px,2vw,10px)", color:"#94a3b8" }}>{b.city}</div>
                        </div>
                        <span style={{ fontSize:"clamp(11px,2.5vw,12px)", color:"#1a3a8f", fontWeight:700, flexShrink:0 }}>→</span>
                      </Link>
                    ))}
                  </div>
                  <Link to="/tools/results" style={{ display:"block", textAlign:"center", marginTop:10, fontSize:"clamp(11px,2.5vw,12px)", fontWeight:700, color:"#1a3a8f", textDecoration:"none" }}>
                    All boards →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
}