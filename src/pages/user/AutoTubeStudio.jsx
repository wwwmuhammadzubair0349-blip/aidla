import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function callAutotube(tool, input) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/autotube`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ tool, input }),
  });
  const data = await res.json();
  if (!data?.ok) throw new Error(data?.error || "Generation failed");
  return data.result;
}

function useCopy() {
  const [copied, setCopied] = useState("");
  const copy = async (text, id) => {
    try { await navigator.clipboard.writeText(text); }
    catch { const el = document.createElement("textarea"); el.value = text; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(id);
    setTimeout(() => setCopied(""), 2200);
  };
  return { copied, copy };
}

const TOOLS = [
  { id: "quick_generator",  icon: "⚡", label: "Quick Generator",   sub: "Titles · Desc · Tags",     color: "#3b82f6", glow: "rgba(59,130,246,0.35)" },
  { id: "full_video_az",    icon: "🎬", label: "Full Video A–Z",    sub: "Script · SEO · Checklist", color: "#ef4444", glow: "rgba(239,68,68,0.35)" },
  { id: "content_calendar", icon: "📅", label: "Content Calendar",  sub: "30-Day Plan",              color: "#8b5cf6", glow: "rgba(139,92,246,0.35)" },
  { id: "idea_to_video",    icon: "💡", label: "Idea → Full Video", sub: "Complete Package",         color: "#f59e0b", glow: "rgba(245,158,11,0.35)" },
  { id: "title_optimizer",  icon: "🔤", label: "Title Optimizer",   sub: "A/B · CTR Boost",          color: "#06b6d4", glow: "rgba(6,182,212,0.35)" },
  { id: "comment_replier",  icon: "💬", label: "Comment Replier",   sub: "3 Reply Styles",           color: "#10b981", glow: "rgba(16,185,129,0.35)" },
  { id: "niche_analyzer",   icon: "📊", label: "Niche Analyzer",    sub: "Deep Market Intel",        color: "#f97316", glow: "rgba(249,115,22,0.35)" },
];

/* ── Animated score ring ─────────────────────────────────── */
function ScoreRing({ score, size = 80, color }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const c = color || (score >= 85 ? "#22c55e" : score >= 65 ? "#f59e0b" : "#ef4444");
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 6px ${c})` }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize: size > 70 ? 20 : 14, fontWeight: 900, color: "#fff", lineHeight:1 }}>{score}</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontWeight: 700, letterSpacing:"0.05em" }}>SCORE</span>
      </div>
    </div>
  );
}

/* ── Mini score bar ──────────────────────────────────────── */
function ScoreBar({ score, label }) {
  const c = score >= 85 ? "#22c55e" : score >= 65 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontWeight:700, marginBottom:5 }}>
        <span style={{ color:"rgba(255,255,255,0.55)" }}>{label}</span>
        <span style={{ color: c }}>{score}/100</span>
      </div>
      <div style={{ height:5, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${score}%`, background:`linear-gradient(90deg,${c}88,${c})`, borderRadius:99, transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 8px ${c}` }}/>
      </div>
    </div>
  );
}

/* ── Copy button ─────────────────────────────────────────── */
function CopyBtn({ text, id, copied, copy, small, full }) {
  const ok = copied === id;
  return (
    <button onClick={() => copy(text, id)} style={{
      padding: small ? "5px 12px" : "7px 16px",
      fontSize: small ? 11 : 12,
      fontWeight: 700,
      border: `1px solid ${ok ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.12)"}`,
      borderRadius: 8, cursor: "pointer",
      background: ok ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
      color: ok ? "#4ade80" : "rgba(255,255,255,0.7)",
      transition: "all 0.15s", whiteSpace: "nowrap",
      width: full ? "100%" : undefined,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    }}>
      {ok ? "✅ Copied!" : "📋 Copy"}
    </button>
  );
}

/* ── Section card ────────────────────────────────────────── */
function Card({ title, icon, accent, children, copyAll, copyId, copied, copy }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "20px 22px",
      marginBottom: 14,
      backdropFilter: "blur(10px)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accent || "#ef4444"}, transparent)`,
        opacity: 0.6,
      }}/>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {icon && <span style={{ fontSize:16 }}>{icon}</span>}
          <span style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.12em" }}>{title}</span>
        </div>
        {copyAll && <CopyBtn text={copyAll} id={copyId} copied={copied} copy={copy} small/>}
      </div>
      {children}
    </div>
  );
}

/* ── Tag pill ────────────────────────────────────────────── */
function Tag({ text, color = "#ef4444" }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "3px 10px",
      background: `${color}14`, color,
      border: `1px solid ${color}33`, borderRadius: 20, whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

/* ── Input ───────────────────────────────────────────────── */
function Input({ label, value, onChange, placeholder, type = "input", rows, hint }) {
  const base = {
    width:"100%", padding:"11px 14px",
    border:"1px solid rgba(255,255,255,0.1)",
    borderRadius:10, fontSize:14,
    color:"rgba(255,255,255,0.9)",
    background:"rgba(255,255,255,0.05)",
    outline:"none", boxSizing:"border-box",
    transition:"border-color 0.15s",
    fontFamily:"inherit",
  };
  return (
    <div>
      {label && <label style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>{label}</label>}
      {type === "textarea"
        ? <textarea style={{ ...base, minHeight: rows ? rows * 24 : 88, resize:"vertical", lineHeight:1.6 }} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>
        : <input style={base} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>
      }
      {hint && <div style={{ fontSize:11, color:"rgba(255,255,255,0.28)", marginTop:4 }}>{hint}</div>}
    </div>
  );
}

/* ── Loading skeleton ────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
      {[100, 75, 85, 60, 90].map((w, i) => (
        <div key={i} style={{ height:12, background:"rgba(255,255,255,0.06)", borderRadius:6, marginBottom:10, width:`${w}%` }}/>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function AutoTubeStudio() {
  const navigate = useNavigate();
  const { copied, copy } = useCopy();
  const resultRef = useRef(null);

  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTool,  setActiveTool]  = useState("quick_generator");
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState("");
  const [history,     setHistory]     = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [savingName,  setSavingName]  = useState("");
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [renamingId,  setRenamingId]  = useState(null);
  const [renameVal,   setRenameVal]   = useState("");
  const [progress,    setProgress]    = useState(0);

  const [topic,       setTopic]       = useState("");
  const [keywords,    setKeywords]    = useState("");
  const [audience,    setAudience]    = useState("");
  const [niche,       setNiche]       = useState("");
  const [existTitle,  setExistTitle]  = useState("");
  const [comment,     setComment]     = useState("");
  const [context,     setContext]     = useState("");
  const [idea,        setIdea]        = useState("");
  const [channelSize, setChannelSize] = useState("");
  const [language,    setLanguage]    = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { navigate("/login?redirect=/autotube/studio"); return; }
      setUser(data.user); setAuthLoading(false);
    });
  }, [navigate]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.rpc("autotube_get_history", { p_user_id: user.id });
    setHistory(data || []);
  }, [user]);

  useEffect(() => { if (user) loadHistory(); }, [user, loadHistory]);

  const handleGenerate = async () => {
    setLoading(true); setError(""); setResult(null); setSaved(false); setProgress(0);

    // Fake progress for UX
    const tick = setInterval(() => setProgress(p => Math.min(p + Math.random() * 12, 88)), 800);

    try {
      let input = { language };
      if (activeTool === "quick_generator")  input = { ...input, topic, keywords, audience };
      if (activeTool === "full_video_az")    input = { ...input, topic, keywords, audience };
      if (activeTool === "content_calendar") input = { ...input, niche, audience };
      if (activeTool === "idea_to_video")    input = { ...input, idea, audience };
      if (activeTool === "title_optimizer")  input = { ...input, title: existTitle, topic };
      if (activeTool === "comment_replier")  input = { ...input, comment, context };
      if (activeTool === "niche_analyzer")   input = { ...input, niche, channel_size: channelSize };

      const res = await callAutotube(activeTool, input);
      clearInterval(tick); setProgress(100);
      setTimeout(() => {
        setResult(res);
        const toolObj = TOOLS.find(t => t.id === activeTool);
        setSavingName(`${toolObj?.label} — ${topic || niche || existTitle || idea || comment || "Result"}`);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
      }, 300);
    } catch(e) {
      clearInterval(tick); setProgress(0);
      setError(e.message || "Generation failed. Please try again.");
    }
    setTimeout(() => setLoading(false), 400);
  };

  const handleSave = async () => {
    if (!result || !user) return;
    setSaving(true);
    let input = {};
    if (activeTool === "quick_generator")  input = { topic, keywords, audience };
    if (activeTool === "full_video_az")    input = { topic, keywords, audience };
    if (activeTool === "content_calendar") input = { niche, audience };
    if (activeTool === "idea_to_video")    input = { idea, audience };
    if (activeTool === "title_optimizer")  input = { title: existTitle, topic };
    if (activeTool === "comment_replier")  input = { comment, context };
    if (activeTool === "niche_analyzer")   input = { niche, channel_size: channelSize };
    await supabase.rpc("autotube_save_history", { p_user_id: user.id, p_name: savingName, p_tool: activeTool, p_input: input, p_output: result });
    setSaved(true); setSaving(false); await loadHistory();
  };

  const handleDeleteHistory = async (id) => {
    await supabase.rpc("autotube_delete_history", { p_id: id, p_user_id: user.id });
    await loadHistory();
  };

  const handleRename = async (id) => {
    await supabase.rpc("autotube_rename_history", { p_id: id, p_user_id: user.id, p_name: renameVal });
    setRenamingId(null); setRenameVal(""); await loadHistory();
  };

  const loadHistoryItem = (item) => {
    setActiveTool(item.tool); setResult(item.output);
    const inp = item.input || {};
    setTopic(inp.topic||""); setKeywords(inp.keywords||""); setAudience(inp.audience||"");
    setNiche(inp.niche||""); setExistTitle(inp.title||""); setComment(inp.comment||"");
    setContext(inp.context||""); setIdea(inp.idea||""); setShowHistory(false);
  };

  const activeTool_ = TOOLS.find(t => t.id === activeTool);

  if (authLoading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0a0f", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12, animation:"spin 1s linear infinite", display:"inline-block" }}>🎬</div>
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>Loading Studio…</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
        body { background:#0a0a0f; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
        input:focus, textarea:focus { border-color: rgba(255,255,255,0.25) !important; background: rgba(255,255,255,0.07) !important; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius:99px; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes glow { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .studio-layout { display:grid; grid-template-columns:260px 1fr; gap:20px; align-items:start; }
        .tool-btn { transition: all 0.2s; }
        .tool-btn:hover { transform: translateX(3px); }
        .result-section { animation: fadeUp 0.4s ease forwards; }
        .gen-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
        .gen-btn:active:not(:disabled) { transform: translateY(0); }
        @media (max-width:900px) {
          .studio-layout { grid-template-columns:1fr !important; }
          .studio-sidebar-inner { display:flex !important; flex-wrap:wrap; flex-direction:row !important; gap:8px; }
          .tool-btn { flex:1 1 140px; }
        }
        @media (max-width:520px) {
          .tool-btn { flex:1 1 120px; font-size:11px !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'DM Sans',sans-serif", color:"#fff" }}>

        {/* ── Ambient background ── */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-20%", left:"-10%", width:"50vw", height:"50vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(239,68,68,0.06) 0%,transparent 70%)", filter:"blur(40px)" }}/>
          <div style={{ position:"absolute", bottom:"-15%", right:"-10%", width:"40vw", height:"40vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)", filter:"blur(40px)" }}/>
        </div>

        {/* ── Header ── */}
        <header style={{ position:"sticky", top:0, zIndex:100, background:"rgba(10,10,15,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 20px" }}>
          <div style={{ maxWidth:1240, margin:"0 auto", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <Link to="/autotube" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:6, opacity:0.5, fontSize:12, color:"rgba(255,255,255,0.6)", fontWeight:600, transition:"opacity 0.15s" }}>
                ← AutoTube
              </Link>
              <div style={{ width:1, height:20, background:"rgba(255,255,255,0.1)" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#ef4444,#f97316)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow:"0 0 20px rgba(239,68,68,0.4)" }}>🎬</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:900, letterSpacing:"-0.02em", color:"#fff" }}>AutoTube <span style={{ color:"#ef4444" }}>Studio</span></div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontWeight:600 }}>PRO SEO ENGINE</div>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", display:"none", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}
                className="user-email">{user?.email}</div>
              <button onClick={() => setShowHistory(v => !v)}
                style={{ padding:"8px 16px", background:showHistory?"rgba(239,68,68,0.15)":"rgba(255,255,255,0.07)", color:showHistory?"#ef4444":"rgba(255,255,255,0.7)", border:`1px solid ${showHistory?"rgba(239,68,68,0.3)":"rgba(255,255,255,0.1)"}`, borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all 0.15s" }}>
                📂 History {history.length > 0 && <span style={{ background:"rgba(239,68,68,0.2)", color:"#ef4444", borderRadius:99, padding:"1px 7px", fontSize:10, fontWeight:800 }}>{history.length}</span>}
              </button>
              <button onClick={() => supabase.auth.signOut().then(() => navigate("/login"))}
                style={{ padding:"8px 14px", background:"transparent", color:"rgba(255,255,255,0.35)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, fontSize:12, cursor:"pointer", transition:"all 0.15s" }}>
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <div style={{ maxWidth:1240, margin:"0 auto", padding:"24px 16px 64px", position:"relative", zIndex:1 }}>

          {/* ── History Drawer ── */}
          {showHistory && (
            <div style={{ background:"rgba(15,15,22,0.95)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:22, marginBottom:22, backdropFilter:"blur(20px)", boxShadow:"0 20px 60px rgba(0,0,0,0.4)", animation:"fadeUp 0.25s ease" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>📂 Saved Results</div>
                <button onClick={() => setShowHistory(false)} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, width:32, height:32, cursor:"pointer", color:"rgba(255,255,255,0.5)", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
              </div>
              {history.length === 0 ? (
                <div style={{ textAlign:"center", color:"rgba(255,255,255,0.25)", padding:"28px 0", fontSize:13 }}>No saved results yet. Generate something and save it!</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:320, overflowY:"auto", paddingRight:4 }}>
                  {history.map(h => {
                    const t = TOOLS.find(x => x.id === h.tool);
                    return (
                      <div key={h.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", background:"rgba(255,255,255,0.03)", borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", flexWrap:"wrap", transition:"background 0.15s" }}>
                        <div style={{ width:34, height:34, borderRadius:9, background:`${t?.color || "#ef4444"}18`, border:`1px solid ${t?.color || "#ef4444"}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{t?.icon}</div>
                        <div style={{ flex:1, minWidth:120 }}>
                          {renamingId === h.id ? (
                            <div style={{ display:"flex", gap:6 }}>
                              <input value={renameVal} onChange={e => setRenameVal(e.target.value)}
                                style={{ padding:"5px 10px", fontSize:12, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:7, color:"#fff", flex:1, fontFamily:"inherit" }}
                                autoFocus/>
                              <button onClick={() => handleRename(h.id)} style={{ padding:"5px 12px", background:"#ef4444", color:"#fff", border:"none", borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:700 }}>Save</button>
                              <button onClick={() => setRenamingId(null)} style={{ padding:"5px 10px", background:"rgba(255,255,255,0.07)", border:"none", borderRadius:7, cursor:"pointer", fontSize:11, color:"rgba(255,255,255,0.6)" }}>✕</button>
                            </div>
                          ) : (
                            <>
                              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.88)" }}>{h.name}</div>
                              <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:1 }}>{t?.label} · {new Date(h.created_at).toLocaleDateString()}</div>
                            </>
                          )}
                        </div>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => loadHistoryItem(h)} style={{ padding:"5px 14px", background:`${t?.color || "#ef4444"}18`, color:t?.color||"#ef4444", border:`1px solid ${t?.color||"#ef4444"}33`, borderRadius:7, cursor:"pointer", fontSize:11, fontWeight:700 }}>Load</button>
                          <button onClick={() => { setRenamingId(h.id); setRenameVal(h.name); }} style={{ padding:"5px 10px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:7, cursor:"pointer", fontSize:11, color:"rgba(255,255,255,0.5)" }}>✏️</button>
                          <button onClick={() => handleDeleteHistory(h.id)} style={{ padding:"5px 10px", background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:7, cursor:"pointer", fontSize:11, color:"#ef4444" }}>🗑</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="studio-layout">

            {/* ══ SIDEBAR ══ */}
            <aside style={{ position:"sticky", top:84 }}>
              <div className="studio-sidebar-inner" style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {TOOLS.map(t => (
                  <button key={t.id} className="tool-btn"
                    onClick={() => { setActiveTool(t.id); setResult(null); setError(""); setSaved(false); }}
                    style={{
                      padding:"13px 14px",
                      border:`1px solid ${activeTool === t.id ? `${t.color}44` : "rgba(255,255,255,0.06)"}`,
                      borderRadius:14,
                      cursor:"pointer",
                      textAlign:"left",
                      background: activeTool === t.id ? `linear-gradient(135deg,${t.color}18,${t.color}08)` : "rgba(255,255,255,0.02)",
                      boxShadow: activeTool === t.id ? `0 0 24px ${t.glow}, inset 0 1px 0 ${t.color}22` : "none",
                      display:"flex", alignItems:"center", gap:12,
                    }}>
                    <div style={{
                      width:38, height:38, borderRadius:10, flexShrink:0,
                      background: activeTool === t.id ? `${t.color}22` : "rgba(255,255,255,0.04)",
                      border:`1px solid ${activeTool === t.id ? `${t.color}44` : "rgba(255,255,255,0.08)"}`,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
                      boxShadow: activeTool === t.id ? `0 0 12px ${t.glow}` : "none",
                      transition:"all 0.2s",
                    }}>{t.icon}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:800, color: activeTool === t.id ? "#fff" : "rgba(255,255,255,0.6)", lineHeight:1.2 }}>{t.label}</div>
                      <div style={{ fontSize:10, color: activeTool === t.id ? `${t.color}` : "rgba(255,255,255,0.25)", fontWeight:600, marginTop:2 }}>{t.sub}</div>
                    </div>
                    {activeTool === t.id && <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:t.color, boxShadow:`0 0 8px ${t.color}`, flexShrink:0, animation:"glow 2s ease infinite" }}/>}
                  </button>
                ))}
              </div>

              {/* Credits badge */}
              <div style={{ marginTop:16, padding:"12px 14px", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:14, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>🏆</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:800, color:"#ef4444" }}>PRO SEO ENGINE</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:1 }}>Llama 3.3 70B · YouTube-grade</div>
                </div>
              </div>
            </aside>

            {/* ══ MAIN AREA ══ */}
            <main>

              {/* ── Tool header ── */}
              <div style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${activeTool_?.color}22`, borderRadius:20, padding:"22px 24px", marginBottom:16, position:"relative", overflow:"hidden", backdropFilter:"blur(10px)" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${activeTool_?.color}88,transparent)` }}/>
                <div style={{ position:"absolute", top:"-50%", right:"-10%", width:"300px", height:"300px", borderRadius:"50%", background:`radial-gradient(circle,${activeTool_?.color}08 0%,transparent 70%)`, pointerEvents:"none" }}/>

                <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:22 }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg,${activeTool_?.color}22,${activeTool_?.color}08)`, border:`1px solid ${activeTool_?.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0, boxShadow:`0 0 24px ${activeTool_?.glow}` }}>{activeTool_?.icon}</div>
                  <div>
                    <div style={{ fontSize:20, fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>{activeTool_?.label}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:3 }}>Fill in details below · AI generates premium YouTube-grade SEO content</div>
                  </div>
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

                  {/* Language selector - shown for all tools */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <Input label="🌐 Output Language (optional)" value={language} onChange={setLanguage} placeholder="Auto-detect from topic (recommended)"/>
                    {/* spacer or extra field */}
                    <div/>
                  </div>

                  {(activeTool === "quick_generator" || activeTool === "full_video_az") && (<>
                    <Input label="📹 Video Topic *" value={topic} onChange={setTopic} placeholder="e.g. How to grow a YouTube channel from 0 to 100K subscribers" hint="Be specific — more detail = better SEO output"/>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <Input label="🔑 Primary Keywords" value={keywords} onChange={setKeywords} placeholder="youtube growth, subscribers, viral"/>
                      <Input label="👥 Target Audience" value={audience} onChange={setAudience} placeholder="Beginners, Students, Entrepreneurs"/>
                    </div>
                  </>)}

                  {activeTool === "content_calendar" && (<>
                    <Input label="📺 Channel Niche *" value={niche} onChange={setNiche} placeholder="e.g. Tech reviews, Online earning, Cooking, Fitness"/>
                    <Input label="👥 Target Audience" value={audience} onChange={setAudience} placeholder="Pakistani students, Young professionals, Beginners"/>
                  </>)}

                  {activeTool === "idea_to_video" && (<>
                    <Input label="💡 Your Video Idea *" value={idea} onChange={setIdea} placeholder="e.g. 10 ways to earn $500/month as a student in 2025 with zero investment" type="textarea" rows={3}/>
                    <Input label="👥 Target Audience" value={audience} onChange={setAudience} placeholder="Students, Beginners, Job seekers"/>
                  </>)}

                  {activeTool === "title_optimizer" && (<>
                    <Input label="📝 Your Current Title *" value={existTitle} onChange={setExistTitle} placeholder="Paste your existing YouTube title here for optimization"/>
                    <Input label="📹 Video Topic (context)" value={topic} onChange={setTopic} placeholder="Brief description of what your video is about"/>
                  </>)}

                  {activeTool === "comment_replier" && (<>
                    <Input label="💬 YouTube Comment *" value={comment} onChange={setComment} placeholder="Paste the comment you want to reply to here..." type="textarea" rows={3}/>
                    <Input label="🎬 Video Context" value={context} onChange={setContext} placeholder="Brief description of your video (helps AI craft a relevant reply)"/>
                  </>)}

                  {activeTool === "niche_analyzer" && (<>
                    <Input label="📊 Your Channel Niche *" value={niche} onChange={setNiche} placeholder="e.g. Online earning, Tech unboxing, Education, Cooking, Finance"/>
                    <Input label="📈 Channel Size" value={channelSize} onChange={setChannelSize} placeholder="New channel / 1K subs / 10K subs / 100K subs"/>
                  </>)}

                  {error && (
                    <div style={{ fontSize:13, color:"#fca5a5", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"11px 14px", display:"flex", gap:8, alignItems:"center" }}>
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Progress bar when loading */}
                  {loading && (
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:6, fontWeight:600 }}>
                        <span>⚡ Generating premium content…</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${activeTool_?.color}88,${activeTool_?.color})`, borderRadius:99, transition:"width 0.6s ease", boxShadow:`0 0 10px ${activeTool_?.color}` }}/>
                      </div>
                      <div style={{ marginTop:8 }}><Skeleton/></div>
                    </div>
                  )}

                  <button className="gen-btn" onClick={handleGenerate} disabled={loading}
                    style={{
                      padding:"15px 0",
                      background: loading ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg,${activeTool_?.color},${activeTool_?.color}cc)`,
                      color: loading ? "rgba(255,255,255,0.3)" : "#fff",
                      border: `1px solid ${loading ? "rgba(255,255,255,0.1)" : activeTool_?.color + "66"}`,
                      borderRadius:14, fontWeight:800, fontSize:15,
                      cursor: loading ? "not-allowed" : "pointer",
                      letterSpacing:"-0.01em",
                      boxShadow: loading ? "none" : `0 4px 24px ${activeTool_?.glow}`,
                      transition:"all 0.2s",
                    }}>
                    {loading ? "⏳ Generating… this takes 10–20 seconds" : `${activeTool_?.icon}  Generate ${activeTool_?.label}`}
                  </button>
                </div>
              </div>

              {/* ══ RESULTS ══ */}
              {result && (
                <div ref={resultRef} className="result-section">

                  {/* Save bar */}
                  <div style={{ background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:14, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                    <span style={{ fontSize:16 }}>💾</span>
                    <input value={savingName} onChange={e => setSavingName(e.target.value)}
                      style={{ flex:"1 1 180px", padding:"8px 12px", fontSize:13, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#fff", fontFamily:"inherit", outline:"none" }}
                      placeholder="Name this result…"/>
                    <button onClick={handleSave} disabled={saving || saved}
                      style={{ padding:"9px 22px", background: saved ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg,#16a34a,#22c55e)", color: saved ? "#4ade80" : "#fff", border: saved ? "1px solid rgba(34,197,94,0.3)" : "none", borderRadius:10, fontWeight:800, fontSize:13, cursor:"pointer", transition:"all 0.15s", boxShadow: saved ? "none" : "0 4px 16px rgba(34,197,94,0.3)", whiteSpace:"nowrap" }}>
                      {saved ? "✅ Saved!" : saving ? "Saving…" : "💾 Save Result"}
                    </button>
                  </div>

                  {/* SEO Score — always at top if available */}
                  {result.seo_score && (
                    <Card title="SEO Score" icon="📊" accent="#22c55e">
                      <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
                        <ScoreRing score={result.seo_score}/>
                        <div style={{ flex:1, minWidth:200 }}>
                          <div style={{ fontSize:14, color:"rgba(255,255,255,0.7)", lineHeight:1.7, marginBottom:12 }}>
                            {result.seo_score >= 85 ? "🟢 Excellent — your content is highly optimized for YouTube search and discovery." : result.seo_score >= 65 ? "🟡 Good — a few tweaks can significantly boost your visibility and CTR." : "🔴 Needs improvement — apply the recommendations below to improve ranking."}
                          </div>
                          {result.seo_breakdown && Object.entries(result.seo_breakdown).map(([k,v]) => (
                            <ScoreBar key={k} score={v} label={k.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}/>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* ─── Quick / Full A-Z / Idea results ─── */}
                  {["quick_generator","full_video_az","idea_to_video"].includes(activeTool) && (<>

                    {result.titles && (
                      <Card title="Title Suggestions" icon="🎯" accent="#3b82f6" copyAll={result.titles.join("\n")} copyId="all-titles" copied={copied} copy={copy}>
                        {result.titles.map((t,i) => (
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", background:"rgba(255,255,255,0.03)", borderRadius:10, marginBottom:8, border:"1px solid rgba(255,255,255,0.06)", transition:"background 0.15s" }}>
                            <span style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.25)", minWidth:18 }}>#{i+1}</span>
                            <span style={{ flex:1, fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.9)", lineHeight:1.4 }}>{t}</span>
                            <span style={{ fontSize:10, color:t.length>70?"#ef4444":"rgba(255,255,255,0.25)", fontWeight:700, flexShrink:0 }}>{t.length}</span>
                            <CopyBtn text={t} id={`title-${i}`} copied={copied} copy={copy} small/>
                          </div>
                        ))}
                      </Card>
                    )}

                    {result.hook && (
                      <Card title="Opening Hook (first 15 seconds)" icon="🎣" accent="#f59e0b">
                        <div style={{ fontSize:14, color:"rgba(255,255,255,0.78)", lineHeight:1.8, marginBottom:12, fontStyle:"italic", borderLeft:"2px solid #f59e0b44", paddingLeft:14 }}>{result.hook}</div>
                        <CopyBtn text={result.hook} id="hook" copied={copied} copy={copy}/>
                      </Card>
                    )}

                    {result.script_sections && (
                      <Card title="Full Video Script" icon="📜" accent="#8b5cf6" copyAll={[result.intro, ...result.script_sections.map(s=>`${s.heading}\n${s.content}`), result.outro].filter(Boolean).join("\n\n")} copyId="full-script" copied={copied} copy={copy}>
                        {result.intro && (
                          <div style={{ marginBottom:18 }}>
                            <div style={{ fontSize:10, fontWeight:800, color:"#ef4444", letterSpacing:"0.1em", marginBottom:8 }}>INTRO</div>
                            <pre style={{ fontSize:13, color:"rgba(255,255,255,0.72)", lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0 }}>{result.intro}</pre>
                            <div style={{ marginTop:8 }}><CopyBtn text={result.intro} id="intro" copied={copied} copy={copy} small/></div>
                          </div>
                        )}
                        {result.script_sections.map((s,i) => (
                          <div key={i} style={{ marginBottom:18, paddingBottom:18, borderBottom: i < result.script_sections.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <span style={{ width:22, height:22, borderRadius:6, background:"rgba(139,92,246,0.2)", border:"1px solid rgba(139,92,246,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"#a78bfa", flexShrink:0 }}>{i+1}</span>
                                <span style={{ fontSize:14, fontWeight:800, color:"rgba(255,255,255,0.9)" }}>{s.heading}</span>
                              </div>
                              <CopyBtn text={s.content} id={`sec-${i}`} copied={copied} copy={copy} small/>
                            </div>
                            <pre style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0 }}>{s.content}</pre>
                          </div>
                        ))}
                        {result.outro && (
                          <div>
                            <div style={{ fontSize:10, fontWeight:800, color:"#ef4444", letterSpacing:"0.1em", marginBottom:8 }}>OUTRO</div>
                            <pre style={{ fontSize:13, color:"rgba(255,255,255,0.72)", lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0 }}>{result.outro}</pre>
                            <div style={{ marginTop:8 }}><CopyBtn text={result.outro} id="outro" copied={copied} copy={copy} small/></div>
                          </div>
                        )}
                      </Card>
                    )}

                    {result.cta && (
                      <Card title="Call-to-Action Lines" icon="📣" accent="#06b6d4">
                        <div style={{ fontSize:14, color:"rgba(255,255,255,0.78)", lineHeight:1.8, marginBottom:12, whiteSpace:"pre-wrap" }}>{result.cta}</div>
                        <CopyBtn text={result.cta} id="cta" copied={copied} copy={copy}/>
                      </Card>
                    )}

                    {result.description && (
                      <Card title="Full SEO Description" icon="📝" accent="#10b981" copyAll={result.description} copyId="desc" copied={copied} copy={copy}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, flexWrap:"wrap" }}>
                          <span style={{ fontSize:11, color: result.description.length > 4500 ? "#ef4444" : result.description.length > 3000 ? "#f59e0b" : "#22c55e", fontWeight:700, padding:"3px 10px", background:result.description.length > 4500 ? "rgba(239,68,68,0.1)" : result.description.length > 3000 ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)", border:`1px solid ${result.description.length > 4500 ? "rgba(239,68,68,0.3)" : result.description.length > 3000 ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)"}`, borderRadius:20 }}>{result.description.length} chars</span>
                          <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>Optimal: 300–500 words</span>
                        </div>
                        <pre style={{ fontSize:13, color:"rgba(255,255,255,0.68)", lineHeight:1.85, whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0, background:"rgba(255,255,255,0.02)", padding:"16px", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)" }}>{result.description}</pre>
                      </Card>
                    )}

                    {result.tags && (
                      <Card title={`Tags (${result.tags.length})`} icon="🏷️" accent="#ef4444" copyAll={result.tags.join(",")} copyId="tags" copied={copied} copy={copy}>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {result.tags.map(t => <Tag key={t} text={t} color="#ef4444"/>)}
                        </div>
                      </Card>
                    )}

                    {result.hashtags && (
                      <Card title="Hashtags" icon="#️⃣" accent="#3b82f6" copyAll={result.hashtags.join(" ")} copyId="hash" copied={copied} copy={copy}>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {result.hashtags.map(h => <Tag key={h} text={h} color="#3b82f6"/>)}
                        </div>
                      </Card>
                    )}

                    {result.thumbnail_texts && (
                      <Card title="Thumbnail Text Ideas" icon="🖼️" accent="#f59e0b">
                        {result.thumbnail_texts.map((t,i) => (
                          <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.15)", borderRadius:12, marginBottom:8 }}>
                            <span style={{ fontSize:16, fontWeight:900, color:"#fff", letterSpacing:"-0.01em" }}>{t}</span>
                            <CopyBtn text={t} id={`thumb-${i}`} copied={copied} copy={copy} small/>
                          </div>
                        ))}
                      </Card>
                    )}

                    {result.first_comment && (
                      <Card title="Pinned First Comment" icon="📌" accent="#8b5cf6" copyAll={result.first_comment} copyId="firstcomment" copied={copied} copy={copy}>
                        <pre style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.85, whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0, background:"rgba(139,92,246,0.05)", padding:14, borderRadius:10, border:"1px solid rgba(139,92,246,0.15)" }}>{result.first_comment}</pre>
                      </Card>
                    )}

                    {result.upload_checklist && (
                      <Card title="Upload Checklist" icon="✅" accent="#22c55e">
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:6 }}>
                          {result.upload_checklist.map((item,i) => (
                            <label key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", background:"rgba(255,255,255,0.02)", borderRadius:10, cursor:"pointer", border:"1px solid rgba(255,255,255,0.05)", transition:"background 0.15s" }}>
                              <input type="checkbox" style={{ width:16, height:16, accentColor:"#22c55e", flexShrink:0 }}/>
                              <span style={{ fontSize:13, color:"rgba(255,255,255,0.68)" }}>{item}</span>
                            </label>
                          ))}
                        </div>
                      </Card>
                    )}

                    {result.monetization_tips && (
                      <Card title="Monetization Tips" icon="💰" accent="#f59e0b">
                        {result.monetization_tips.map((t,i) => (
                          <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom: i < result.monetization_tips.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems:"flex-start" }}>
                            <span style={{ width:22, height:22, borderRadius:6, background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"#fbbf24", flexShrink:0, marginTop:1 }}>{i+1}</span>
                            <span style={{ fontSize:13, color:"rgba(255,255,255,0.72)", lineHeight:1.6 }}>{t}</span>
                          </div>
                        ))}
                      </Card>
                    )}
                  </>)}

                  {/* ─── Content Calendar ─── */}
                  {activeTool === "content_calendar" && result.days && (<>
                    {result.niche_analysis && <Card title="Niche Analysis" icon="🔍" accent="#8b5cf6"><p style={{ fontSize:14, color:"rgba(255,255,255,0.72)", lineHeight:1.75 }}>{result.niche_analysis}</p></Card>}
                    {result.posting_strategy && <Card title="Posting Strategy" icon="📅" accent="#06b6d4"><p style={{ fontSize:14, color:"rgba(255,255,255,0.72)", lineHeight:1.75 }}>{result.posting_strategy}</p></Card>}
                    <Card title="30-Day Content Calendar" icon="📆" accent="#8b5cf6" copyAll={result.days.map(d=>`Day ${d.day}: ${d.title}`).join("\n")} copyId="calendar" copied={copied} copy={copy}>
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {result.days.map((d,i) => (
                          <div key={i} style={{ background:"rgba(255,255,255,0.02)", borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,255,255,0.06)", transition:"background 0.15s" }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, flexWrap:"wrap", gap:8 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <span style={{ fontSize:10, fontWeight:900, color:"#fff", background:"#ef4444", borderRadius:6, padding:"2px 8px", minWidth:42, textAlign:"center" }}>Day {d.day}</span>
                                <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.35)", background:"rgba(255,255,255,0.05)", padding:"2px 8px", borderRadius:6, border:"1px solid rgba(255,255,255,0.08)" }}>{d.type}</span>
                                {d.best_time && <span style={{ fontSize:10, color:"rgba(255,255,255,0.28)" }}>⏰ {d.best_time}</span>}
                              </div>
                              <CopyBtn text={d.title} id={`cal-${i}`} copied={copied} copy={copy} small/>
                            </div>
                            <div style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.88)", marginBottom:5 }}>{d.title}</div>
                            <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.65 }}>{d.outline}</div>
                            {d.hook_idea && <div style={{ marginTop:8, fontSize:11, color:"#ef4444", fontWeight:700, display:"flex", alignItems:"center", gap:5 }}><span>🎣</span> {d.hook_idea}</div>}
                          </div>
                        ))}
                      </div>
                    </Card>
                    {result.growth_tips && <Card title="Growth Tips" icon="🚀" accent="#22c55e">{result.growth_tips.map((t,i)=><div key={i} style={{ fontSize:13, color:"rgba(255,255,255,0.68)", padding:"8px 0", borderBottom:i<result.growth_tips.length-1?"1px solid rgba(255,255,255,0.04)":"none", display:"flex", gap:10, alignItems:"flex-start" }}><span style={{ color:"#4ade80", fontWeight:800, flexShrink:0 }}>{i+1}.</span>{t}</div>)}</Card>}
                  </>)}

                  {/* ─── Title Optimizer ─── */}
                  {activeTool === "title_optimizer" && (<>
                    {result.original_analysis && (
                      <Card title="Analysis of Your Title" icon="🔍" accent="#06b6d4">
                        <p style={{ fontSize:14, color:"rgba(255,255,255,0.72)", lineHeight:1.75, marginBottom:14 }}>{result.original_analysis}</p>
                        {result.original_score && <ScoreBar score={result.original_score} label="Original Score"/>}
                      </Card>
                    )}
                    {result.optimized_titles && (
                      <Card title="Optimized Titles" icon="✨" accent="#3b82f6" copyAll={result.optimized_titles.map(t=>t.title).join("\n")} copyId="all-opt" copied={copied} copy={copy}>
                        {result.optimized_titles.map((t,i) => (
                          <div key={i} style={{ background:"rgba(255,255,255,0.02)", borderRadius:14, padding:"16px", marginBottom:10, border:"1px solid rgba(255,255,255,0.07)" }}>
                            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:10 }}>
                              <div style={{ fontSize:15, fontWeight:700, color:"rgba(255,255,255,0.9)", flex:1, lineHeight:1.4 }}>{t.title}</div>
                              <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                                <ScoreRing score={t.score} size={52}/>
                                <CopyBtn text={t.title} id={`opt-${i}`} copied={copied} copy={copy} small/>
                              </div>
                            </div>
                            <div style={{ fontSize:12, color:"rgba(255,255,255,0.38)", lineHeight:1.5 }}>{t.why}</div>
                          </div>
                        ))}
                      </Card>
                    )}
                    {result.tips && <Card title="Title Optimization Tips" icon="💡" accent="#f59e0b">{result.tips.map((t,i)=><div key={i} style={{ fontSize:13, color:"rgba(255,255,255,0.68)", padding:"8px 0", borderBottom:i<result.tips.length-1?"1px solid rgba(255,255,255,0.04)":"none", display:"flex", gap:10 }}><span style={{ color:"#fbbf24", fontWeight:800, flexShrink:0 }}>{i+1}.</span>{t}</div>)}</Card>}
                  </>)}

                  {/* ─── Comment Replier ─── */}
                  {activeTool === "comment_replier" && result.replies && (<>
                    <Card title="Reply Options" icon="💬" accent="#10b981">
                      {result.replies.map((r,i) => (
                        <div key={i} style={{ background:"rgba(255,255,255,0.02)", borderRadius:14, padding:"16px", marginBottom:10, border:"1px solid rgba(255,255,255,0.07)" }}>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                            <span style={{ fontSize:11, fontWeight:800, color:"#10b981", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:20, padding:"3px 12px" }}>{r.style}</span>
                            <CopyBtn text={r.text} id={`reply-${i}`} copied={copied} copy={copy} small/>
                          </div>
                          <p style={{ fontSize:14, color:"rgba(255,255,255,0.78)", lineHeight:1.75, margin:0 }}>{r.text}</p>
                        </div>
                      ))}
                    </Card>
                    {result.tip && <Card title="Pro Community Tip" icon="💡" accent="#f59e0b"><p style={{ fontSize:14, color:"rgba(255,255,255,0.72)", lineHeight:1.75 }}>{result.tip}</p></Card>}
                  </>)}

                  {/* ─── Niche Analyzer ─── */}
                  {activeTool === "niche_analyzer" && (<>
                    {result.niche_overview && (
                      <Card title="Niche Overview" icon="🔍" accent="#f97316">
                        <p style={{ fontSize:14, color:"rgba(255,255,255,0.72)", lineHeight:1.75, marginBottom:14 }}>{result.niche_overview}</p>
                        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                          {result.competition_level && <span style={{ fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:20, background:"rgba(245,158,11,0.1)", color:"#fbbf24", border:"1px solid rgba(245,158,11,0.25)" }}>⚔️ Competition: {result.competition_level}</span>}
                          {result.monetization_potential && <span style={{ fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:20, background:"rgba(34,197,94,0.1)", color:"#4ade80", border:"1px solid rgba(34,197,94,0.25)" }}>💰 Monetization: {result.monetization_potential}</span>}
                        </div>
                      </Card>
                    )}
                    {result.top_keywords && (
                      <Card title="Top Keywords" icon="🔑" accent="#3b82f6" copyAll={result.top_keywords.map(k=>k.keyword).join("\n")} copyId="kw-all" copied={copied} copy={copy}>
                        {result.top_keywords.map((k,i) => (
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:i<result.top_keywords.length-1?"1px solid rgba(255,255,255,0.04)":"none", flexWrap:"wrap" }}>
                            <span style={{ flex:1, fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)", minWidth:120 }}>{k.keyword}</span>
                            <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                              <Tag text={k.search_intent} color="#3b82f6"/>
                              <Tag text={k.difficulty} color={k.difficulty==="easy"?"#22c55e":k.difficulty==="medium"?"#f59e0b":"#ef4444"}/>
                              <CopyBtn text={k.keyword} id={`kw-${i}`} copied={copied} copy={copy} small/>
                            </div>
                          </div>
                        ))}
                      </Card>
                    )}
                    {result.content_gaps && <Card title="Content Gaps (Untapped Opportunities)" icon="💡" accent="#10b981" copyAll={result.content_gaps.join("\n")} copyId="gaps" copied={copied} copy={copy}>{result.content_gaps.map((g,i)=><div key={i} style={{ fontSize:13, color:"rgba(255,255,255,0.68)", padding:"8px 0", borderBottom:i<result.content_gaps.length-1?"1px solid rgba(255,255,255,0.04)":"none", display:"flex", gap:10, alignItems:"flex-start" }}><span style={{ color:"#4ade80", fontWeight:800, flexShrink:0 }}>→</span>{g}</div>)}</Card>}
                    {result.video_ideas && <Card title="Video Ideas" icon="🎬" accent="#ef4444" copyAll={result.video_ideas.join("\n")} copyId="vi-all" copied={copied} copy={copy}>{result.video_ideas.map((v,i)=><div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 0", borderBottom:i<result.video_ideas.length-1?"1px solid rgba(255,255,255,0.04)":"none", gap:10 }}><span style={{ fontSize:13, color:"rgba(255,255,255,0.72)", flex:1 }}>{i+1}. {v}</span><CopyBtn text={v} id={`vi-${i}`} copied={copied} copy={copy} small/></div>)}</Card>}
                    {result.growth_strategy && <Card title="Growth Strategy" icon="🚀" accent="#8b5cf6">{result.growth_strategy.map((s,i)=><div key={i} style={{ fontSize:13, color:"rgba(255,255,255,0.68)", padding:"8px 0", borderBottom:i<result.growth_strategy.length-1?"1px solid rgba(255,255,255,0.04)":"none", display:"flex", gap:10 }}><span style={{ color:"#a78bfa", fontWeight:800, flexShrink:0 }}>{i+1}.</span>{s}</div>)}</Card>}
                    {result.monetization_methods && <Card title="Monetization Methods" icon="💰" accent="#f59e0b">{result.monetization_methods.map((m,i)=><div key={i} style={{ fontSize:13, color:"rgba(255,255,255,0.68)", padding:"8px 0", borderBottom:i<result.monetization_methods.length-1?"1px solid rgba(255,255,255,0.04)":"none", display:"flex", gap:8 }}><span style={{ color:"#fbbf24", flexShrink:0 }}>•</span>{m}</div>)}</Card>}
                    {result.thumbnail_style && <Card title="Thumbnail Style Guide" icon="🖼️" accent="#06b6d4"><p style={{ fontSize:14, color:"rgba(255,255,255,0.72)", lineHeight:1.75 }}>{result.thumbnail_style}</p></Card>}
                    {result.posting_frequency && <Card title="Posting Schedule" icon="📅" accent="#10b981"><p style={{ fontSize:14, color:"rgba(255,255,255,0.72)", lineHeight:1.75 }}>{result.posting_frequency}</p></Card>}
                  </>)}

                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}