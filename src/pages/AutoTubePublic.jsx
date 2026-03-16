import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import Footer from "./components/footer";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const TOOLS = [
  { icon:"⚡", label:"Quick Generator",      desc:"Instant title, description & 30 tags from just a topic" },
  { icon:"🎬", label:"Full Video A-Z",        desc:"Complete script, hook, intro, outro, CTA, checklist & more" },
  { icon:"📅", label:"30-Day Calendar",       desc:"Pick ideas + get full content calendar for your niche" },
  { icon:"💡", label:"Idea → Full Video",     desc:"Select from AI ideas and generate the complete package" },
  { icon:"🔤", label:"Title Optimizer",       desc:"Paste your title — AI rewrites it 5 ways with SEO scores" },
  { icon:"💬", label:"Comment Replier",       desc:"Generate 3 smart reply options for any YouTube comment" },
  { icon:"📊", label:"Niche Analyzer",        desc:"Deep keyword & competitor analysis for your niche" },
];

export default function AutoTubePublic() {
  const navigate = useNavigate();
  const [topic,     setTopic]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [preview,   setPreview]   = useState(null);
  const [error,     setError]     = useState("");

  const handlePreview = async () => {
    if (!topic.trim()) return;
    setLoading(true); setError(""); setPreview(null);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/autotube`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ tool: "quick_generator", input: { topic: topic.trim() } }),
      });
      const data = await res.json();
      if (data?.ok && data?.result) setPreview(data.result);
      else setError("Could not generate preview. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>AutoTube by AIDLA — Free YouTube SEO & Automation Tool</title>
        <meta name="description" content="Generate SEO-optimized YouTube titles, descriptions, tags, scripts and full video packages with AI. Free preview — login for complete A-Z automation." />
        <meta name="keywords" content="YouTube SEO tool, YouTube automation, video title generator, YouTube description generator, tags generator, YouTube script generator, AutoTube AIDLA" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="AutoTube by AIDLA — YouTube Automation Platform" />
        <meta property="og:description" content="AI-powered YouTube SEO tool. Generate titles, scripts, tags, descriptions and full video packages in seconds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidla.online/autotube" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#f0f4ff 0%,#fffbf0 60%,#e8f4fd 100%)", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden", position:"relative" }}>

        {/* BG orbs */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
          <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"rgba(239,68,68,0.06)", filter:"blur(80px)", top:-200, left:-200 }}/>
          <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"rgba(245,158,11,0.05)", filter:"blur(80px)", top:300, right:-250 }}/>
        </div>

        <div style={{ maxWidth:1100, margin:"0 auto", padding:"clamp(24px,5vw,64px) clamp(14px,4vw,32px) 80px", position:"relative", zIndex:2 }}>

          {/* ── Hero ── */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }} style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#ef4444,#f97316)", color:"#fff", padding:"5px 16px", borderRadius:30, fontSize:11, fontWeight:800, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:16, boxShadow:"0 4px 14px rgba(239,68,68,0.3)" }}>
              🎬 YouTube Automation Platform
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,6vw,3.2rem)", fontWeight:900, color:"#0b1437", lineHeight:1.15, marginBottom:14 }}>
              AutoTube <span style={{ background:"linear-gradient(135deg,#ef4444,#f97316)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>by AIDLA</span>
            </h1>
            <p style={{ fontSize:"clamp(14px,3vw,17px)", color:"#64748b", maxWidth:580, margin:"0 auto 32px", lineHeight:1.7 }}>
              Generate SEO-optimized titles, full scripts, tags, descriptions, thumbnails and complete video packages with AI — in seconds.
            </p>

            {/* Quick preview input */}
            <div style={{ maxWidth:620, margin:"0 auto", background:"rgba(255,255,255,0.95)", borderRadius:20, padding:24, border:"1px solid rgba(239,68,68,0.15)", boxShadow:"0 8px 32px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#64748b", marginBottom:10, textAlign:"left" }}>
                🚀 Try it free — enter your video topic:
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <input
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handlePreview()}
                  placeholder="e.g. How to make money online in Pakistan..."
                  style={{ flex:"1 1 200px", padding:"12px 16px", border:"1px solid #e2e8f0", borderRadius:12, fontSize:14, outline:"none", minWidth:0 }}
                />
                <button onClick={handlePreview} disabled={loading || !topic.trim()}
                  style={{ padding:"12px 22px", background:"linear-gradient(135deg,#ef4444,#f97316)", color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:14, cursor:loading||!topic.trim()?"not-allowed":"pointer", opacity:loading||!topic.trim()?0.6:1, whiteSpace:"nowrap" }}>
                  {loading ? "⏳ Generating…" : "✨ Preview"}
                </button>
              </div>
              {error && <div style={{ marginTop:10, fontSize:12, color:"#dc2626" }}>{error}</div>}
            </div>
          </motion.div>

          {/* ── Preview Results ── */}
          {(loading || preview) && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ maxWidth:720, margin:"0 auto 48px" }}>
              <div style={{ background:"#fff", borderRadius:20, border:"1px solid #f1f5f9", overflow:"hidden", boxShadow:"0 8px 24px rgba(0,0,0,0.07)" }}>

                {/* Titles — shown clearly */}
                <div style={{ padding:"20px 24px", borderBottom:"1px solid #f8fafc" }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>
                    ✅ Title Suggestions (Free Preview)
                  </div>
                  {loading ? (
                    [1,2,3].map(i => <div key={i} style={{ height:16, background:"#f1f5f9", borderRadius:6, marginBottom:8, width:`${90-i*10}%` }}/>)
                  ) : (
                    preview?.titles?.slice(0,3).map((t,i) => (
                      <div key={i} style={{ padding:"10px 14px", background:"#f8fafc", borderRadius:10, marginBottom:8, fontSize:14, fontWeight:600, color:"#0f172a", border:"1px solid #f1f5f9" }}>
                        {i+1}. {t}
                      </div>
                    ))
                  )}
                </div>

                {/* Tags — shown clearly */}
                <div style={{ padding:"20px 24px", borderBottom:"1px solid #f8fafc" }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>
                    🏷️ Tags Preview
                  </div>
                  {loading ? (
                    <div style={{ height:40, background:"#f1f5f9", borderRadius:8 }}/>
                  ) : (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {preview?.tags?.slice(0,8).map(t => (
                        <span key={t} style={{ fontSize:11, fontWeight:600, padding:"3px 10px", background:"rgba(239,68,68,0.07)", color:"#dc2626", border:"1px solid rgba(239,68,68,0.15)", borderRadius:20 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description — blurred */}
                <div style={{ padding:"20px 24px", borderBottom:"1px solid #f8fafc", position:"relative" }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>
                    📝 Full Description
                  </div>
                  <div style={{ filter:"blur(6px)", userSelect:"none", pointerEvents:"none", fontSize:13, color:"#475569", lineHeight:1.7 }}>
                    {loading ? "Generating description..." : (preview?.description?.slice(0,300) || "Lorem ipsum dolor sit amet consectetur adipisicing elit. The complete description with SEO keywords and call to action is available for logged-in users only.")}...
                  </div>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.5)" }}>
                    <div style={{ background:"#fff", border:"1px solid rgba(239,68,68,0.2)", borderRadius:14, padding:"14px 22px", textAlign:"center", boxShadow:"0 8px 24px rgba(0,0,0,0.1)" }}>
                      <div style={{ fontSize:20, marginBottom:6 }}>🔐</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#0f172a", marginBottom:4 }}>Login to unlock full results</div>
                      <div style={{ fontSize:11, color:"#64748b" }}>Description, all 30 tags, hashtags + 6 more tools</div>
                    </div>
                  </div>
                </div>

                {/* Hashtags + Script — blurred */}
                <div style={{ padding:"20px 24px", position:"relative" }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>
                    🎬 Full Script + All Tools
                  </div>
                  <div style={{ filter:"blur(8px)", userSelect:"none", pointerEvents:"none" }}>
                    <div style={{ height:12, background:"#f1f5f9", borderRadius:6, marginBottom:8, width:"90%" }}/>
                    <div style={{ height:12, background:"#f1f5f9", borderRadius:6, marginBottom:8, width:"75%" }}/>
                    <div style={{ height:12, background:"#f1f5f9", borderRadius:6, marginBottom:8, width:"85%" }}/>
                    <div style={{ height:12, background:"#f1f5f9", borderRadius:6, width:"60%" }}/>
                  </div>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Link to="/login?redirect=/autotube/studio"
                      style={{ background:"linear-gradient(135deg,#ef4444,#f97316)", color:"#fff", padding:"12px 28px", borderRadius:12, textDecoration:"none", fontWeight:800, fontSize:14, boxShadow:"0 6px 20px rgba(239,68,68,0.3)" }}>
                      🚀 Unlock Full Studio — Free
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── 7 Tools Grid ── */}
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:8 }}>What's Inside AutoTube Studio</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.4rem,4vw,2rem)", fontWeight:800, color:"#0b1437" }}>
                7 Powerful AI Tools
              </h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14, marginBottom:40 }}>
              {TOOLS.map((t,i) => (
                <motion.div key={i} whileHover={{ y:-4 }} transition={{ type:"spring", stiffness:300 }}
                  style={{ background:"rgba(255,255,255,0.9)", borderRadius:20, padding:"22px 20px", border:"1px solid rgba(59,130,246,0.1)", boxShadow:"0 4px 16px rgba(11,20,55,0.06)", cursor:"pointer" }}
                  onClick={() => navigate("/login?redirect=/autotube/studio")}>
                  <div style={{ fontSize:28, marginBottom:10 }}>{t.icon}</div>
                  <div style={{ fontSize:15, fontWeight:800, color:"#0b1437", marginBottom:6 }}>{t.label}</div>
                  <div style={{ fontSize:12, color:"#64748b", lineHeight:1.6 }}>{t.desc}</div>
                  <div style={{ marginTop:12, fontSize:11, fontWeight:700, color:"#ef4444" }}>Login to use →</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── CTA Banner ── */}
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ background:"linear-gradient(135deg,#0b1437,#1a3a8f)", borderRadius:32, padding:"clamp(24px,5vw,44px)", color:"#fff", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:20, boxShadow:"0 16px 40px rgba(11,20,55,0.2)", border:"1px solid rgba(255,215,0,0.15)" }}>
            <div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.2rem,4vw,1.9rem)", fontWeight:800, marginBottom:8 }}>
                Start Automating Your YouTube Channel 🚀
              </h2>
              <p style={{ opacity:0.8, fontSize:15, lineHeight:1.6 }}>
                Free account. Complete A-Z video packages. 7 tools. Unlimited use.
              </p>
            </div>
            <Link to="/login?redirect=/autotube/studio"
              style={{ padding:"14px 32px", background:"linear-gradient(135deg,#f59e0b,#fcd34d)", color:"#0b1437", borderRadius:40, fontWeight:800, fontSize:15, textDecoration:"none", boxShadow:"0 6px 18px rgba(245,158,11,0.4)", whiteSpace:"nowrap" }}>
              Open Studio Free ✨
            </Link>
          </motion.div>

        </div>
        <Footer />
      </div>
    </>
  );
}