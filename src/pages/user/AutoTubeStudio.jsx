import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ── Call edge function ────────────────────────────────────
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

// ── Copy helper ───────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState("");
  const copy = async (text, id) => {
    try { await navigator.clipboard.writeText(text); }
    catch { const el = document.createElement("textarea"); el.value=text; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };
  return { copied, copy };
}

// ── SEO score bar ─────────────────────────────────────────
function ScoreBar({ score, label }) {
  const color = score >= 85 ? "#16a34a" : score >= 65 ? "#d97706" : "#dc2626";
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontWeight:600, color:"#64748b", marginBottom:4 }}>
        <span>{label}</span><span style={{ color }}>{score}</span>
      </div>
      <div style={{ height:6, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${score}%`, background:color, borderRadius:3, transition:"width 0.6s ease" }}/>
      </div>
    </div>
  );
}

// ── Copy button ───────────────────────────────────────────
function CopyBtn({ text, id, copied, copy, small }) {
  const ok = copied === id;
  return (
    <button onClick={() => copy(text, id)}
      style={{
        padding: small ? "4px 10px" : "6px 14px",
        fontSize: small ? 11 : 12,
        fontWeight:700, border:"1px solid",
        borderColor: ok ? "rgba(22,163,74,0.3)" : "rgba(239,68,68,0.2)",
        borderRadius:8, cursor:"pointer",
        background: ok ? "rgba(22,163,74,0.07)" : "rgba(239,68,68,0.06)",
        color: ok ? "#15803d" : "#dc2626",
        transition:"all 0.15s", whiteSpace:"nowrap",
      }}>
      {ok ? "✅ Copied!" : "📋 Copy"}
    </button>
  );
}

// ── Section card ──────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"18px 20px", marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize:11, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>{title}</div>
      {children}
    </div>
  );
}

// ── Tool definitions ──────────────────────────────────────
const TOOLS = [
  { id:"quick_generator",  icon:"⚡", label:"Quick Generator",   color:"#3b82f6" },
  { id:"full_video_az",    icon:"🎬", label:"Full Video A-Z",    color:"#ef4444" },
  { id:"content_calendar", icon:"📅", label:"Content Calendar",  color:"#8b5cf6" },
  { id:"idea_to_video",    icon:"💡", label:"Idea → Full Video", color:"#f59e0b" },
  { id:"title_optimizer",  icon:"🔤", label:"Title Optimizer",   color:"#06b6d4" },
  { id:"comment_replier",  icon:"💬", label:"Comment Replier",   color:"#10b981" },
  { id:"niche_analyzer",   icon:"📊", label:"Niche Analyzer",    color:"#f97316" },
];

// ─────────────────────────────────────────────────────────
export default function AutoTubeStudio() {
  const navigate = useNavigate();
  const { copied, copy } = useCopy();

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

  // ── Inputs per tool ──────────────────────────────────
  const [topic,       setTopic]       = useState("");
  const [keywords,    setKeywords]    = useState("");
  const [audience,    setAudience]    = useState("");
  const [niche,       setNiche]       = useState("");
  const [existTitle,  setExistTitle]  = useState("");
  const [comment,     setComment]     = useState("");
  const [context,     setContext]     = useState("");
  const [idea,        setIdea]        = useState("");
  const [channelSize, setChannelSize] = useState("");

  // ── Auth ─────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { navigate("/login?redirect=/autotube/studio"); return; }
      setUser(data.user); setAuthLoading(false);
    });
  }, [navigate]);

  // ── Load history ─────────────────────────────────────
  const loadHistory = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.rpc("autotube_get_history", { p_user_id: user.id });
    setHistory(data || []);
  }, [user]);

  useEffect(() => { if (user) loadHistory(); }, [user, loadHistory]);

  // ── Generate ─────────────────────────────────────────
  const handleGenerate = async () => {
    setLoading(true); setError(""); setResult(null); setSaved(false);
    try {
      let input = {};
      if (activeTool === "quick_generator")  input = { topic, keywords, audience };
      if (activeTool === "full_video_az")    input = { topic, keywords, audience };
      if (activeTool === "content_calendar") input = { niche, audience };
      if (activeTool === "idea_to_video")    input = { idea, audience };
      if (activeTool === "title_optimizer")  input = { title: existTitle, topic };
      if (activeTool === "comment_replier")  input = { comment, context };
      if (activeTool === "niche_analyzer")   input = { niche, channel_size: channelSize };

      const res = await callAutotube(activeTool, input);
      setResult(res);
      const toolObj = TOOLS.find(t => t.id === activeTool);
      setSavingName(`${toolObj?.label} — ${topic || niche || existTitle || idea || comment || "Result"}`);
    } catch(e) {
      setError(e.message || "Generation failed. Please try again.");
    }
    setLoading(false);
  };

  // ── Save to history ───────────────────────────────────
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

    await supabase.rpc("autotube_save_history", {
      p_user_id: user.id, p_name: savingName,
      p_tool: activeTool, p_input: input, p_output: result,
    });
    setSaved(true); setSaving(false);
    await loadHistory();
  };

  // ── Delete history ────────────────────────────────────
  const handleDeleteHistory = async (id) => {
    await supabase.rpc("autotube_delete_history", { p_id: id, p_user_id: user.id });
    await loadHistory();
  };

  // ── Rename history ────────────────────────────────────
  const handleRename = async (id) => {
    await supabase.rpc("autotube_rename_history", { p_id: id, p_user_id: user.id, p_name: renameVal });
    setRenamingId(null); setRenameVal(""); await loadHistory();
  };

  // ── Load history item ─────────────────────────────────
  const loadHistoryItem = (item) => {
    setActiveTool(item.tool);
    setResult(item.output);
    const inp = item.input || {};
    setTopic(inp.topic || ""); setKeywords(inp.keywords || "");
    setAudience(inp.audience || ""); setNiche(inp.niche || "");
    setExistTitle(inp.title || ""); setComment(inp.comment || "");
    setContext(inp.context || ""); setIdea(inp.idea || "");
    setShowHistory(false);
  };

  const inputStyle = { width:"100%", padding:"10px 14px", border:"1px solid #e2e8f0", borderRadius:10, fontSize:14, color:"#0f172a", background:"#fff", outline:"none", boxSizing:"border-box" };
  const taStyle   = { ...inputStyle, minHeight:80, resize:"vertical", lineHeight:1.6, fontFamily:"inherit" };
  const labelStyle = { fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 };
  const activeTool_ = TOOLS.find(t => t.id === activeTool);

  if (authLoading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}><div style={{ fontSize:36, marginBottom:10 }}>🎬</div><div style={{ color:"#64748b" }}>Loading Studio…</div></div>
    </div>
  );

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .studio-layout { display: grid; grid-template-columns: 240px 1fr; gap: 20px; align-items: start; }
        .studio-sidebar { display: block; }
        @media (max-width: 860px) {
          .studio-layout { grid-template-columns: 1fr !important; }
          .studio-sidebar { display: flex !important; flex-wrap: wrap; gap: 8px; flex-direction: row !important; }
          .studio-tool-btn { flex: 1 1 120px !important; }
        }
        @media (max-width: 520px) {
          .studio-tool-btn { flex: 1 1 100px !important; font-size: 11px !important; }
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif" }}>

        {/* ── Header ── */}
        <div style={{ background:"linear-gradient(135deg,#0b1437,#1a3a8f)", padding:"18px 20px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <Link to="/autotube" style={{ textDecoration:"none" }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginBottom:2 }}>← AutoTube</div>
              </Link>
              <div>
                <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>🎬 AutoTube Studio</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.55)" }}>{user?.email}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <button onClick={() => setShowHistory(v => !v)}
                style={{ padding:"8px 16px", background:"rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.9)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                📂 History {history.length > 0 && `(${history.length})`}
              </button>
              <button onClick={() => supabase.auth.signOut().then(() => navigate("/login"))}
                style={{ padding:"8px 14px", background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, fontSize:12, cursor:"pointer" }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"20px 14px 48px" }}>

          {/* ── History panel ── */}
          {showHistory && (
            <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:20, marginBottom:20, boxShadow:"0 4px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ fontSize:14, fontWeight:800, color:"#0b1437" }}>📂 Saved Results</div>
                <button onClick={() => setShowHistory(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#94a3b8" }}>✕</button>
              </div>
              {history.length === 0 ? (
                <div style={{ textAlign:"center", color:"#94a3b8", padding:"20px 0", fontSize:13 }}>No saved results yet. Generate something and save it!</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:320, overflowY:"auto" }}>
                  {history.map(h => {
                    const t = TOOLS.find(x => x.id === h.tool);
                    return (
                      <div key={h.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#f8fafc", borderRadius:10, border:"1px solid #f1f5f9", flexWrap:"wrap" }}>
                        <span style={{ fontSize:18 }}>{t?.icon}</span>
                        <div style={{ flex:1, minWidth:120 }}>
                          {renamingId === h.id ? (
                            <div style={{ display:"flex", gap:6 }}>
                              <input value={renameVal} onChange={e=>setRenameVal(e.target.value)} style={{ ...inputStyle, padding:"4px 8px", fontSize:12 }} autoFocus/>
                              <button onClick={() => handleRename(h.id)} style={{ padding:"4px 10px", background:"#1a3a8f", color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:700 }}>Save</button>
                              <button onClick={() => setRenamingId(null)} style={{ padding:"4px 10px", background:"#f1f5f9", border:"none", borderRadius:6, cursor:"pointer", fontSize:11 }}>Cancel</button>
                            </div>
                          ) : (
                            <>
                              <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{h.name}</div>
                              <div style={{ fontSize:11, color:"#94a3b8" }}>{t?.label} · {new Date(h.created_at).toLocaleDateString()}</div>
                            </>
                          )}
                        </div>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => loadHistoryItem(h)} style={{ padding:"5px 12px", background:"rgba(26,58,143,0.07)", color:"#1a3a8f", border:"1px solid rgba(26,58,143,0.15)", borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:700 }}>Load</button>
                          <button onClick={() => { setRenamingId(h.id); setRenameVal(h.name); }} style={{ padding:"5px 10px", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:6, cursor:"pointer", fontSize:11 }}>✏️</button>
                          <button onClick={() => handleDeleteHistory(h.id)} style={{ padding:"5px 10px", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:6, cursor:"pointer", fontSize:11, color:"#dc2626" }}>🗑</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="studio-layout">

            {/* ── Tool Sidebar ── */}
            <div className="studio-sidebar" style={{ position:"sticky", top:20, display:"flex", flexDirection:"column", gap:6 }}>
              {TOOLS.map(t => (
                <button key={t.id} className="studio-tool-btn"
                  onClick={() => { setActiveTool(t.id); setResult(null); setError(""); setSaved(false); }}
                  style={{
                    padding:"12px 14px", border:"none", borderRadius:12, cursor:"pointer", textAlign:"left",
                    background: activeTool === t.id ? `linear-gradient(135deg,${t.color}22,${t.color}11)` : "#fff",
                    borderLeft: activeTool === t.id ? `3px solid ${t.color}` : "3px solid transparent",
                    boxShadow: activeTool === t.id ? `0 4px 16px ${t.color}22` : "0 1px 4px rgba(0,0,0,0.04)",
                    display:"flex", alignItems:"center", gap:10, transition:"all 0.15s",
                  }}>
                  <span style={{ fontSize:20 }}>{t.icon}</span>
                  <span style={{ fontSize:13, fontWeight:700, color: activeTool === t.id ? t.color : "#334155" }}>{t.label}</span>
                </button>
              ))}
            </div>

            {/* ── Main Area ── */}
            <div>

              {/* Input form */}
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:24, marginBottom:16, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                  <span style={{ fontSize:26 }}>{activeTool_?.icon}</span>
                  <div>
                    <div style={{ fontSize:16, fontWeight:800, color:"#0b1437" }}>{activeTool_?.label}</div>
                    <div style={{ fontSize:12, color:"#94a3b8" }}>Fill in details below and click Generate</div>
                  </div>
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

                  {/* Quick Generator */}
                  {(activeTool === "quick_generator" || activeTool === "full_video_az") && (
                    <>
                      <div><label style={labelStyle}>Video Topic *</label><input style={inputStyle} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. How to start a YouTube channel in Pakistan"/></div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                        <div><label style={labelStyle}>Keywords (optional)</label><input style={inputStyle} value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="youtube, grow channel, tips"/></div>
                        <div><label style={labelStyle}>Target Audience (optional)</label><input style={inputStyle} value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Students, Freelancers, Beginners"/></div>
                      </div>
                    </>
                  )}

                  {/* Content Calendar */}
                  {activeTool === "content_calendar" && (
                    <>
                      <div><label style={labelStyle}>Channel Niche *</label><input style={inputStyle} value={niche} onChange={e=>setNiche(e.target.value)} placeholder="e.g. Tech reviews, Online earning, Cooking"/></div>
                      <div><label style={labelStyle}>Target Audience</label><input style={inputStyle} value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Pakistani students, Young professionals"/></div>
                    </>
                  )}

                  {/* Idea to Video */}
                  {activeTool === "idea_to_video" && (
                    <>
                      <div><label style={labelStyle}>Your Video Idea *</label><textarea style={taStyle} value={idea} onChange={e=>setIdea(e.target.value)} placeholder="e.g. 10 ways to earn money online as a student in 2025"/></div>
                      <div><label style={labelStyle}>Target Audience</label><input style={inputStyle} value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Students, Beginners"/></div>
                    </>
                  )}

                  {/* Title Optimizer */}
                  {activeTool === "title_optimizer" && (
                    <>
                      <div><label style={labelStyle}>Your Current Title *</label><input style={inputStyle} value={existTitle} onChange={e=>setExistTitle(e.target.value)} placeholder="Paste your current YouTube title here"/></div>
                      <div><label style={labelStyle}>Video Topic (optional)</label><input style={inputStyle} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Brief topic description"/></div>
                    </>
                  )}

                  {/* Comment Replier */}
                  {activeTool === "comment_replier" && (
                    <>
                      <div><label style={labelStyle}>YouTube Comment *</label><textarea style={taStyle} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Paste the comment here..."/></div>
                      <div><label style={labelStyle}>Video Context (optional)</label><input style={inputStyle} value={context} onChange={e=>setContext(e.target.value)} placeholder="Brief description of your video"/></div>
                    </>
                  )}

                  {/* Niche Analyzer */}
                  {activeTool === "niche_analyzer" && (
                    <>
                      <div><label style={labelStyle}>Your Channel Niche *</label><input style={inputStyle} value={niche} onChange={e=>setNiche(e.target.value)} placeholder="e.g. Online earning, Tech, Education, Cooking"/></div>
                      <div><label style={labelStyle}>Channel Size (optional)</label><input style={inputStyle} value={channelSize} onChange={e=>setChannelSize(e.target.value)} placeholder="e.g. New channel, 1K subs, 10K subs"/></div>
                    </>
                  )}

                  {error && <div style={{ fontSize:13, color:"#dc2626", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:8, padding:"10px 14px" }}>{error}</div>}

                  <button onClick={handleGenerate} disabled={loading}
                    style={{ padding:"13px 0", background:`linear-gradient(135deg,${activeTool_?.color || "#ef4444"},${activeTool_?.color || "#ef4444"}dd)`, color:"#fff", border:"none", borderRadius:12, fontWeight:800, fontSize:15, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
                    {loading ? "⏳ Generating… (this may take 10-20 seconds)" : `${activeTool_?.icon} Generate ${activeTool_?.label}`}
                  </button>
                </div>
              </div>

              {/* ── RESULTS ── */}
              {result && (
                <div>
                  {/* Save bar */}
                  <div style={{ background:"rgba(22,163,74,0.06)", border:"1px solid rgba(22,163,74,0.2)", borderRadius:12, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                    <input value={savingName} onChange={e=>setSavingName(e.target.value)}
                      style={{ ...inputStyle, flex:"1 1 200px", padding:"7px 12px", fontSize:13 }}
                      placeholder="Name this result…"/>
                    <button onClick={handleSave} disabled={saving || saved}
                      style={{ padding:"8px 20px", background: saved ? "rgba(22,163,74,0.1)" : "linear-gradient(135deg,#16a34a,#22c55e)", color: saved ? "#15803d" : "#fff", border: saved ? "1px solid rgba(22,163,74,0.3)" : "none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer" }}>
                      {saved ? "✅ Saved!" : saving ? "Saving…" : "💾 Save"}
                    </button>
                  </div>

                  {/* ─── Quick Generator + Full A-Z + Idea to Video results ─── */}
                  {["quick_generator","full_video_az","idea_to_video"].includes(activeTool) && (
                    <>
                      {/* Titles */}
                      {result.titles && (
                        <Section title="🎯 Title Suggestions">
                          {result.titles.map((t,i) => (
                            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"#f8fafc", borderRadius:10, marginBottom:8, border:"1px solid #f1f5f9" }}>
                              <span style={{ fontSize:12, fontWeight:700, color:"#94a3b8", minWidth:20 }}>{i+1}.</span>
                              <span style={{ flex:1, fontSize:14, fontWeight:600, color:"#0f172a" }}>{t}</span>
                              <CopyBtn text={t} id={`title-${i}`} copied={copied} copy={copy} small/>
                            </div>
                          ))}
                        </Section>
                      )}

                      {/* Hook */}
                      {result.hook && (
                        <Section title="🎣 Opening Hook">
                          <p style={{ fontSize:14, color:"#374151", lineHeight:1.7, marginBottom:10 }}>{result.hook}</p>
                          <CopyBtn text={result.hook} id="hook" copied={copied} copy={copy}/>
                        </Section>
                      )}

                      {/* Script sections */}
                      {result.script_sections && (
                        <Section title="📜 Video Script">
                          {result.intro && (
                            <div style={{ marginBottom:16 }}>
                              <div style={{ fontSize:12, fontWeight:700, color:"#ef4444", marginBottom:6 }}>INTRO</div>
                              <p style={{ fontSize:13, color:"#374151", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{result.intro}</p>
                              <div style={{ marginTop:8 }}><CopyBtn text={result.intro} id="intro" copied={copied} copy={copy} small/></div>
                            </div>
                          )}
                          {result.script_sections.map((s,i) => (
                            <div key={i} style={{ marginBottom:16, paddingBottom:16, borderBottom: i < result.script_sections.length-1 ? "1px solid #f8fafc" : "none" }}>
                              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                                <div style={{ fontSize:13, fontWeight:800, color:"#0b1437" }}>{s.heading}</div>
                                <CopyBtn text={s.content} id={`sec-${i}`} copied={copied} copy={copy} small/>
                              </div>
                              <p style={{ fontSize:13, color:"#374151", lineHeight:1.8, whiteSpace:"pre-wrap", margin:0 }}>{s.content}</p>
                            </div>
                          ))}
                          {result.outro && (
                            <div>
                              <div style={{ fontSize:12, fontWeight:700, color:"#ef4444", marginBottom:6 }}>OUTRO</div>
                              <p style={{ fontSize:13, color:"#374151", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{result.outro}</p>
                              <div style={{ marginTop:8 }}><CopyBtn text={result.outro} id="outro" copied={copied} copy={copy} small/></div>
                            </div>
                          )}
                        </Section>
                      )}

                      {/* CTA */}
                      {result.cta && (
                        <Section title="📣 Call to Action Lines">
                          <p style={{ fontSize:14, color:"#374151", lineHeight:1.7, marginBottom:10 }}>{result.cta}</p>
                          <CopyBtn text={result.cta} id="cta" copied={copied} copy={copy}/>
                        </Section>
                      )}

                      {/* Description */}
                      {result.description && (
                        <Section title="📝 Full Description">
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                            <span style={{ fontSize:11, color:"#94a3b8" }}>{result.description.length} chars</span>
                            <CopyBtn text={result.description} id="desc" copied={copied} copy={copy}/>
                          </div>
                          <pre style={{ fontSize:13, color:"#374151", lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0, background:"#f8fafc", padding:14, borderRadius:10 }}>{result.description}</pre>
                        </Section>
                      )}

                      {/* Tags */}
                      {result.tags && (
                        <Section title="🏷️ Tags (30)">
                          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
                            <CopyBtn text={result.tags.join(",")} id="tags" copied={copied} copy={copy}/>
                          </div>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                            {result.tags.map(t => (
                              <span key={t} style={{ fontSize:11, fontWeight:600, padding:"3px 10px", background:"rgba(239,68,68,0.07)", color:"#dc2626", border:"1px solid rgba(239,68,68,0.15)", borderRadius:20 }}>{t}</span>
                            ))}
                          </div>
                        </Section>
                      )}

                      {/* Hashtags */}
                      {result.hashtags && (
                        <Section title="# Hashtags">
                          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
                            <CopyBtn text={result.hashtags.join(" ")} id="hash" copied={copied} copy={copy}/>
                          </div>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                            {result.hashtags.map(h => (
                              <span key={h} style={{ fontSize:12, fontWeight:600, padding:"3px 12px", background:"rgba(59,130,246,0.07)", color:"#1a3a8f", border:"1px solid rgba(59,130,246,0.15)", borderRadius:20 }}>{h}</span>
                            ))}
                          </div>
                        </Section>
                      )}

                      {/* Thumbnail texts */}
                      {result.thumbnail_texts && (
                        <Section title="🖼️ Thumbnail Text Ideas">
                          {result.thumbnail_texts.map((t,i) => (
                            <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"#f8fafc", borderRadius:10, marginBottom:8, border:"1px solid #f1f5f9" }}>
                              <span style={{ fontSize:15, fontWeight:800, color:"#0b1437" }}>{t}</span>
                              <CopyBtn text={t} id={`thumb-${i}`} copied={copied} copy={copy} small/>
                            </div>
                          ))}
                        </Section>
                      )}

                      {/* First comment */}
                      {result.first_comment && (
                        <Section title="💬 First Comment (Pin This)">
                          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
                            <CopyBtn text={result.first_comment} id="firstcomment" copied={copied} copy={copy}/>
                          </div>
                          <pre style={{ fontSize:13, color:"#374151", lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0, background:"#f8fafc", padding:14, borderRadius:10 }}>{result.first_comment}</pre>
                        </Section>
                      )}

                      {/* Monetization */}
                      {result.monetization_tips && (
                        <Section title="💰 Monetization Tips">
                          {result.monetization_tips.map((t,i) => (
                            <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom: i < result.monetization_tips.length-1 ? "1px solid #f8fafc" : "none" }}>
                              <span style={{ color:"#f59e0b", fontWeight:800, fontSize:14 }}>{i+1}.</span>
                              <span style={{ fontSize:13, color:"#374151", lineHeight:1.6 }}>{t}</span>
                            </div>
                          ))}
                        </Section>
                      )}

                      {/* Upload checklist */}
                      {result.upload_checklist && (
                        <Section title="✅ Upload Checklist">
                          {result.upload_checklist.map((item,i) => (
                            <label key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom: i < result.upload_checklist.length-1 ? "1px solid #f8fafc" : "none", cursor:"pointer" }}>
                              <input type="checkbox" style={{ width:16, height:16, accentColor:"#ef4444" }}/>
                              <span style={{ fontSize:13, color:"#374151" }}>{item}</span>
                            </label>
                          ))}
                        </Section>
                      )}

                      {/* SEO Score */}
                      {result.seo_score && (
                        <Section title="📊 SEO Score">
                          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                            <div style={{ width:72, height:72, borderRadius:"50%", background:`conic-gradient(${result.seo_score >= 85 ? "#16a34a" : result.seo_score >= 65 ? "#d97706" : "#dc2626"} ${result.seo_score * 3.6}deg, #f1f5f9 0deg)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <div style={{ width:54, height:54, borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#0b1437" }}>{result.seo_score}</div>
                            </div>
                            <div style={{ fontSize:13, color:"#64748b", lineHeight:1.6 }}>
                              {result.seo_score >= 85 ? "🟢 Excellent! Your content is well-optimized for YouTube search." : result.seo_score >= 65 ? "🟡 Good. A few improvements can boost your visibility." : "🔴 Needs work. Follow the tips above to improve your SEO."}
                            </div>
                          </div>
                          {result.seo_breakdown && Object.entries(result.seo_breakdown).map(([k,v]) => (
                            <ScoreBar key={k} score={v} label={k.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}/>
                          ))}
                        </Section>
                      )}
                    </>
                  )}

                  {/* ─── Content Calendar results ─── */}
                  {activeTool === "content_calendar" && result.days && (
                    <>
                      {result.niche_analysis && <Section title="🔍 Niche Analysis"><p style={{ fontSize:14, color:"#374151", lineHeight:1.7 }}>{result.niche_analysis}</p></Section>}
                      {result.posting_strategy && <Section title="📅 Posting Strategy"><p style={{ fontSize:14, color:"#374151", lineHeight:1.7 }}>{result.posting_strategy}</p></Section>}
                      <Section title="📆 30-Day Content Calendar">
                        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                          {result.days.map((d,i) => (
                            <div key={i} style={{ background:"#f8fafc", borderRadius:12, padding:"14px 16px", border:"1px solid #f1f5f9" }}>
                              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6, flexWrap:"wrap", gap:6 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <span style={{ fontSize:11, fontWeight:800, color:"#fff", background:"#1a3a8f", borderRadius:6, padding:"2px 8px" }}>Day {d.day}</span>
                                  <span style={{ fontSize:11, fontWeight:700, color:"#64748b" }}>{d.type}</span>
                                </div>
                                <div style={{ display:"flex", gap:6 }}>
                                  <span style={{ fontSize:11, color:"#94a3b8" }}>{d.best_time}</span>
                                  <CopyBtn text={d.title} id={`cal-${i}`} copied={copied} copy={copy} small/>
                                </div>
                              </div>
                              <div style={{ fontSize:14, fontWeight:700, color:"#0b1437", marginBottom:4 }}>{d.title}</div>
                              <div style={{ fontSize:12, color:"#475569", lineHeight:1.6 }}>{d.outline}</div>
                              {d.hook_idea && <div style={{ marginTop:6, fontSize:11, color:"#ef4444", fontWeight:600 }}>Hook: {d.hook_idea}</div>}
                            </div>
                          ))}
                        </div>
                      </Section>
                      {result.growth_tips && <Section title="🚀 Growth Tips">{result.growth_tips.map((t,i)=><div key={i} style={{ fontSize:13, color:"#374151", padding:"6px 0", borderBottom:i<result.growth_tips.length-1?"1px solid #f8fafc":"none" }}>{i+1}. {t}</div>)}</Section>}
                    </>
                  )}

                  {/* ─── Title Optimizer results ─── */}
                  {activeTool === "title_optimizer" && (
                    <>
                      {result.original_analysis && <Section title="🔍 Analysis of Your Title"><p style={{ fontSize:14, color:"#374151", lineHeight:1.7 }}>{result.original_analysis}</p><div style={{ marginTop:10 }}><ScoreBar score={result.original_score || 50} label="Original Score"/></div></Section>}
                      {result.optimized_titles && (
                        <Section title="✨ Optimized Titles">
                          {result.optimized_titles.map((t,i) => (
                            <div key={i} style={{ background:"#f8fafc", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #f1f5f9" }}>
                              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:6 }}>
                                <div style={{ fontSize:14, fontWeight:700, color:"#0b1437", flex:1 }}>{t.title}</div>
                                <CopyBtn text={t.title} id={`opt-${i}`} copied={copied} copy={copy} small/>
                              </div>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <ScoreBar score={t.score} label="Score"/>
                              </div>
                              <div style={{ fontSize:11, color:"#64748b", marginTop:4 }}>{t.why}</div>
                            </div>
                          ))}
                        </Section>
                      )}
                    </>
                  )}

                  {/* ─── Comment Replier results ─── */}
                  {activeTool === "comment_replier" && result.replies && (
                    <>
                      <Section title="💬 Reply Options">
                        {result.replies.map((r,i) => (
                          <div key={i} style={{ background:"#f8fafc", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #f1f5f9" }}>
                            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                              <span style={{ fontSize:11, fontWeight:800, color:"#1a3a8f", background:"rgba(26,58,143,0.08)", border:"1px solid rgba(26,58,143,0.15)", borderRadius:20, padding:"2px 10px" }}>{r.style}</span>
                              <CopyBtn text={r.text} id={`reply-${i}`} copied={copied} copy={copy} small/>
                            </div>
                            <p style={{ fontSize:14, color:"#374151", lineHeight:1.7, margin:0 }}>{r.text}</p>
                          </div>
                        ))}
                      </Section>
                      {result.tip && <Section title="💡 Pro Tip"><p style={{ fontSize:14, color:"#374151", lineHeight:1.7 }}>{result.tip}</p></Section>}
                    </>
                  )}

                  {/* ─── Niche Analyzer results ─── */}
                  {activeTool === "niche_analyzer" && (
                    <>
                      {result.niche_overview && <Section title="🔍 Niche Overview"><p style={{ fontSize:14, color:"#374151", lineHeight:1.7 }}>{result.niche_overview}</p>
                        <div style={{ display:"flex", gap:10, marginTop:12, flexWrap:"wrap" }}>
                          {result.competition_level && <span style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, background:"rgba(245,158,11,0.1)", color:"#d97706", border:"1px solid rgba(245,158,11,0.2)" }}>Competition: {result.competition_level}</span>}
                          {result.monetization_potential && <span style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, background:"rgba(22,163,74,0.1)", color:"#15803d", border:"1px solid rgba(22,163,74,0.2)" }}>Monetization: {result.monetization_potential}</span>}
                        </div>
                      </Section>}
                      {result.top_keywords && <Section title="🔑 Top Keywords">
                        {result.top_keywords.map((k,i) => (
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<result.top_keywords.length-1?"1px solid #f8fafc":"none" }}>
                            <span style={{ flex:1, fontSize:13, fontWeight:600, color:"#0f172a" }}>{k.keyword}</span>
                            <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"rgba(59,130,246,0.08)", color:"#1a3a8f", border:"1px solid rgba(59,130,246,0.15)" }}>{k.search_intent}</span>
                            <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background: k.difficulty==="easy"?"rgba(22,163,74,0.08)":k.difficulty==="medium"?"rgba(245,158,11,0.08)":"rgba(239,68,68,0.08)", color:k.difficulty==="easy"?"#15803d":k.difficulty==="medium"?"#d97706":"#dc2626", border:`1px solid ${k.difficulty==="easy"?"rgba(22,163,74,0.2)":k.difficulty==="medium"?"rgba(245,158,11,0.2)":"rgba(239,68,68,0.2)"}` }}>{k.difficulty}</span>
                            <CopyBtn text={k.keyword} id={`kw-${i}`} copied={copied} copy={copy} small/>
                          </div>
                        ))}
                      </Section>}
                      {result.content_gaps && <Section title="💡 Content Gaps (Opportunities)">{result.content_gaps.map((g,i)=><div key={i} style={{ fontSize:13, color:"#374151", padding:"7px 0", borderBottom:i<result.content_gaps.length-1?"1px solid #f8fafc":"none" }}><span style={{ color:"#ef4444", fontWeight:700 }}>→</span> {g}</div>)}</Section>}
                      {result.video_ideas && <Section title="🎬 Video Ideas">{result.video_ideas.map((v,i)=>(
                        <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:i<result.video_ideas.length-1?"1px solid #f8fafc":"none" }}>
                          <span style={{ fontSize:13, color:"#374151", flex:1 }}>{i+1}. {v}</span>
                          <CopyBtn text={v} id={`vi-${i}`} copied={copied} copy={copy} small/>
                        </div>
                      ))}</Section>}
                      {result.growth_strategy && <Section title="🚀 Growth Strategy">{result.growth_strategy.map((s,i)=><div key={i} style={{ fontSize:13, color:"#374151", padding:"7px 0", borderBottom:i<result.growth_strategy.length-1?"1px solid #f8fafc":"none" }}>{i+1}. {s}</div>)}</Section>}
                      {result.monetization_methods && <Section title="💰 Monetization Methods">{result.monetization_methods.map((m,i)=><div key={i} style={{ fontSize:13, color:"#374151", padding:"7px 0", borderBottom:i<result.monetization_methods.length-1?"1px solid #f8fafc":"none" }}>• {m}</div>)}</Section>}
                      {result.thumbnail_style && <Section title="🖼️ Thumbnail Style"><p style={{ fontSize:14, color:"#374151", lineHeight:1.7 }}>{result.thumbnail_style}</p></Section>}
                      {result.posting_frequency && <Section title="📅 Posting Frequency"><p style={{ fontSize:14, color:"#374151", lineHeight:1.7 }}>{result.posting_frequency}</p></Section>}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}