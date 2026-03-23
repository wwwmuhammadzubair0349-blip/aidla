import { useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function callLinkedInBio(payload) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/linkedin-bio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data?.ok) throw new Error(data?.error || "Generation failed");
  return data.result;
}

const TONES = [
  { id:"professional", label:"💼 Professional", desc:"Formal, achievement-focused" },
  { id:"conversational",label:"😊 Conversational",desc:"Warm, approachable, human" },
  { id:"bold",         label:"🔥 Bold",          desc:"Confident, direct, impactful" },
  { id:"creative",     label:"🎨 Creative",       desc:"Unique, storytelling style" },
];

const LENGTHS = [
  { id:"short",  label:"Short",  sub:"~100 words" },
  { id:"medium", label:"Medium", sub:"~200 words" },
  { id:"long",   label:"Long",   sub:"~300 words" },
];

export default function LinkedInBio() {
  const [name,      setName]      = useState("");
  const [title,     setTitle]     = useState("");
  const [industry,  setIndustry]  = useState("");
  const [experience,setExperience]= useState("");
  const [skills,    setSkills]    = useState("");
  const [achievements,setAchievements] = useState("");
  const [goal,      setGoal]      = useState("");
  const [tone,      setTone]      = useState("professional");
  const [length,    setLength]    = useState("medium");
  const [loading,   setLoading]   = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState("");
  const [copied,    setCopied]    = useState(false);
  const [regenNote, setRegenNote] = useState("");
  const resultRef = useRef(null);

  const generate = useCallback(async (isRegen = false) => {
    if (!title.trim()) return;
    setLoading(true); setError(""); if(!isRegen)setResult(null); setProgress(0);
    const tick = setInterval(() => setProgress(p => Math.min(p + 10, 88)), 500);
    try {
      const res = await callLinkedInBio({ name, title, industry, experience, skills, achievements, goal, tone, length, isRegen, regenNote: isRegen ? regenNote : "" });
      clearInterval(tick); setProgress(100);
      setTimeout(() => {
        setResult(res);
        setRegenNote("");
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 150);
      }, 200);
    } catch (e) {
      clearInterval(tick); setProgress(0);
      setError(e.message || "Generation failed — please try again.");
    }
    setTimeout(() => setLoading(false), 300);
  }, [name, title, industry, experience, skills, achievements, goal, tone, length, regenNote]);

  const copy = async () => {
    if (!result?.bio) return;
    try { await navigator.clipboard.writeText(result.bio); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2200);
  };

  const charCount = result?.bio?.length || 0;

  return (
    <>
      <Helmet>
        <title>AI LinkedIn Bio Generator — Write a Powerful About Section | AIDLA</title>
        <meta name="description" content="Free AI LinkedIn bio generator. Create a powerful LinkedIn About section in seconds. Choose your tone, length and style. Powered by AIDLA AI." />
        <meta name="keywords" content="LinkedIn bio generator, AI LinkedIn profile, LinkedIn About section, LinkedIn summary generator, professional bio writer, AIDLA AI LinkedIn" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/ai/linkedin-bio" />
        <meta property="og:title" content="AI LinkedIn Bio Generator | AIDLA" />
        <meta property="og:description" content="Generate a powerful LinkedIn About section in seconds with AIDLA AI." />
        <meta property="og:url" content="https://www.aidla.online/tools/ai/linkedin-bio" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"AI LinkedIn Bio Generator by AIDLA","url":"https://www.aidla.online/tools/ai/linkedin-bio",
          "description":"Free AI LinkedIn bio and About section generator.",
          "applicationCategory":"ProductivityApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .lb-root*{box-sizing:border-box;margin:0;padding:0}
        .lb-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .lb-wrap{max-width:640px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .lb-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .lb-crumb a{color:#94a3b8;text-decoration:none}.lb-crumb a:hover{color:#0a66c2}
        .lb-hero{text-align:center;margin-bottom:24px}
        .lb-badge{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,#0a66c2,#0077b5);color:#fff;padding:5px 16px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px;box-shadow:0 4px 16px rgba(10,102,194,.3)}
        .lb-h1{font-family:'Playfair Display',serif;font-size:clamp(1.7rem,6vw,2.5rem);font-weight:900;color:#0b1437;line-height:1.1;margin-bottom:8px}
        .lb-accent{background:linear-gradient(135deg,#0a66c2,#0077b5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .lb-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:460px;margin:0 auto}
        .lb-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .lb-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .lb-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .lb-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:14px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .lb-input:focus{border-color:rgba(10,102,194,.4);box-shadow:0 0 0 3px rgba(10,102,194,.07)}
        .lb-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .lb-textarea{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:14px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;resize:vertical;min-height:80px;line-height:1.6}
        .lb-textarea:focus{border-color:rgba(10,102,194,.4);box-shadow:0 0 0 3px rgba(10,102,194,.07)}
        .lb-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .lb-tones{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .lb-tone-btn{padding:10px 10px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:left}
        .lb-tone-btn.active{background:rgba(10,102,194,.06);border-color:rgba(10,102,194,.3)}
        .lb-tone-title{font-size:12px;font-weight:800;color:#0b1437}
        .lb-tone-btn.active .lb-tone-title{color:#0a66c2}
        .lb-tone-desc{font-size:10px;color:#94a3b8;margin-top:2px}
        .lb-lengths{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .lb-len-btn{padding:10px 6px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:center}
        .lb-len-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .lb-len-label{font-size:12px;font-weight:800;color:inherit}
        .lb-len-sub{font-size:10px;color:#94a3b8;margin-top:2px}
        .lb-len-btn.active .lb-len-sub{color:rgba(255,255,255,.6)}
        /* Progress + button */
        .lb-prog-wrap{margin-bottom:11px}
        .lb-prog-row{display:flex;justify-content:space-between;font-size:11px;color:#94a3b8;margin-bottom:5px;font-weight:600}
        .lb-prog-track{height:4px;background:#f1f5f9;border-radius:99px;overflow:hidden}
        .lb-prog-bar{height:100%;border-radius:99px;background:linear-gradient(90deg,#0a66c288,#0a66c2);transition:width .5s ease}
        .lb-gen-btn{width:100%;padding:14px;border:none;border-radius:14px;font-weight:800;font-size:15px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;color:#fff;background:linear-gradient(135deg,#0a66c2,#0077b5);box-shadow:0 4px 16px rgba(10,102,194,.3)}
        .lb-gen-btn:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.07)}
        .lb-gen-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
        .lb-error{font-size:13px;color:#dc2626;background:rgba(220,38,38,.06);border:1px solid rgba(220,38,38,.15);border-radius:10px;padding:10px 13px;margin-bottom:12px}
        /* Result */
        .lb-result-card{background:#fff;border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 8px 28px rgba(11,20,55,.08);overflow:hidden;margin-bottom:14px}
        .lb-result-hdr{padding:13px 16px;background:#f8faff;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
        .lb-result-meta{display:flex;align-items:center;gap:8px}
        .lb-li-icon{width:32px;height:32px;border-radius:8px;background:#0a66c2;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:900;flex-shrink:0}
        .lb-result-name{font-size:12px;font-weight:800;color:#0b1437}
        .lb-result-sub{font-size:10px;color:#94a3b8;margin-top:1px}
        .lb-result-btns{display:flex;gap:6px;flex-wrap:wrap}
        .lb-result-btn{padding:6px 12px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;font-size:11px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;white-space:nowrap}
        .lb-result-btn:hover{background:#f8faff}
        .lb-result-btn.copied{background:rgba(5,150,105,.08);border-color:rgba(5,150,105,.2);color:#059669}
        .lb-bio-body{padding:20px}
        .lb-bio-text{font-size:14px;color:#374151;line-height:1.85;white-space:pre-wrap;word-break:break-word;font-family:'DM Sans',sans-serif}
        .lb-char-count{font-size:11px;color:#94a3b8;margin-top:10px;text-align:right}
        .lb-char-count span{font-weight:700;color:charCount>2600?"#dc2626":charCount>2000?"#d97706":"#059669"}
        /* Regen */
        .lb-regen-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:18px;padding:18px;margin-bottom:14px}
        .lb-regen-input{width:100%;padding:10px 13px;border:1.5px solid #e2e8f0;border-radius:11px;font-size:13px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;margin:8px 0;transition:border-color .15s;-webkit-appearance:none}
        .lb-regen-input:focus{border-color:rgba(10,102,194,.4)}
        .lb-regen-btn{width:100%;padding:11px;border:none;border-radius:12px;background:linear-gradient(135deg,#0a66c244,#0a66c288);color:#fff;font-size:13px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .lb-regen-btn:hover:not(:disabled){filter:brightness(1.1)}
        .lb-regen-btn:disabled{opacity:.55;cursor:not-allowed}
        .lb-cta{background:linear-gradient(135deg,#0b1437,#0a66c2);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .lb-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .lb-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .lb-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:420px){.lb-tones{grid-template-columns:1fr 1fr}.lb-grid2{grid-template-columns:1fr}.lb-cta{flex-direction:column;text-align:center}.lb-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="lb-root">
        <div className="lb-wrap">
          <nav className="lb-crumb"><Link to="/tools">Tools</Link><span>›</span><Link to="/tools">AI Tools</Link><span>›</span><span style={{color:"#475569"}}>LinkedIn Bio</span></nav>

          <motion.div className="lb-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="lb-badge">💼 AIDLA AI — LinkedIn Bio</div>
            <h1 className="lb-h1"><span className="lb-accent">AI LinkedIn</span> Bio Generator</h1>
            <p className="lb-sub">Generate a powerful LinkedIn About section that gets noticed. Choose your tone and style.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            {/* Profile info */}
            <div className="lb-card">
              <span className="lb-sec">Your Profile</span>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div className="lb-grid2">
                  <div><label className="lb-label">Your Name</label><input className="lb-input" placeholder="e.g. Ahmed Ali" value={name} onChange={e=>setName(e.target.value)} /></div>
                  <div><label className="lb-label">Current Job Title *</label><input className="lb-input" placeholder="e.g. Software Engineer" value={title} onChange={e=>setTitle(e.target.value)} /></div>
                </div>
                <div className="lb-grid2">
                  <div><label className="lb-label">Industry</label><input className="lb-input" placeholder="e.g. FinTech, Healthcare" value={industry} onChange={e=>setIndustry(e.target.value)} /></div>
                  <div><label className="lb-label">Years of Experience</label><input className="lb-input" placeholder="e.g. 5 years" value={experience} onChange={e=>setExperience(e.target.value)} /></div>
                </div>
                <div>
                  <label className="lb-label">Top Skills</label>
                  <input className="lb-input" placeholder="e.g. React, Python, AWS, Team Leadership" value={skills} onChange={e=>setSkills(e.target.value)} />
                </div>
                <div>
                  <label className="lb-label">Key Achievements (optional)</label>
                  <textarea className="lb-textarea" placeholder="e.g. Led team of 10, increased revenue by 30%, published 3 research papers…" value={achievements} onChange={e=>setAchievements(e.target.value)} />
                </div>
                <div>
                  <label className="lb-label">What You're Looking For (optional)</label>
                  <input className="lb-input" placeholder="e.g. Open to remote roles, seeking leadership positions" value={goal} onChange={e=>setGoal(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Tone + Length */}
            <div className="lb-card">
              <span className="lb-sec">Tone</span>
              <div className="lb-tones" style={{marginBottom:18}}>
                {TONES.map(t=>(
                  <button key={t.id} className={`lb-tone-btn${tone===t.id?" active":""}`} onClick={()=>setTone(t.id)}>
                    <div className="lb-tone-title">{t.label}</div>
                    <div className="lb-tone-desc">{t.desc}</div>
                  </button>
                ))}
              </div>
              <span className="lb-sec">Length</span>
              <div className="lb-lengths">
                {LENGTHS.map(l=>(
                  <button key={l.id} className={`lb-len-btn${length===l.id?" active":""}`} onClick={()=>setLength(l.id)}>
                    <div className="lb-len-label">{l.label}</div>
                    <div className="lb-len-sub">{l.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="lb-error">⚠️ {error}</div>}
            {loading && (
              <div className="lb-prog-wrap">
                <div className="lb-prog-row"><span>✍️ Writing your LinkedIn bio…</span><span>{Math.round(progress)}%</span></div>
                <div className="lb-prog-track"><div className="lb-prog-bar" style={{width:`${progress}%`}}/></div>
              </div>
            )}
            <button className="lb-gen-btn" onClick={()=>generate(false)} disabled={loading || !title.trim()}>
              {loading ? "✍️ Writing Your Bio…" : "💼 Generate LinkedIn Bio"}
            </button>
          </motion.div>

          {/* Result */}
          <div ref={resultRef}>
            <AnimatePresence>
              {result?.bio && (
                <motion.div key="result" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.4,ease:[.22,1,.36,1]}}>
                  <div className="lb-result-card">
                    <div className="lb-result-hdr">
                      <div className="lb-result-meta">
                        <div className="lb-li-icon">in</div>
                        <div>
                          <div className="lb-result-name">LinkedIn About Section <span style={{fontSize:9,fontWeight:800,color:"#059669",background:"rgba(5,150,105,.08)",border:"1px solid rgba(5,150,105,.2)",borderRadius:99,padding:"1px 7px",marginLeft:6}}>✨ AI</span></div>
                          <div className="lb-result-sub">{tone} · {length} · {charCount} characters</div>
                        </div>
                      </div>
                      <div className="lb-result-btns">
                        <button className={`lb-result-btn${copied?" copied":""}`} onClick={copy}>
                          {copied ? "✅ Copied!" : "📋 Copy Bio"}
                        </button>
                      </div>
                    </div>
                    <div className="lb-bio-body">
                      <pre className="lb-bio-text">{result.bio}</pre>
                      <div className="lb-char-count">
                        <span>{charCount}</span> / 2,600 LinkedIn characters
                        {charCount > 2600 && " ⚠️ Exceeds limit — regenerate with 'Short'"}
                      </div>
                    </div>
                  </div>

                  {/* Regenerate */}
                  <div className="lb-regen-card">
                    <div style={{fontSize:13,fontWeight:800,color:"#0b1437",marginBottom:4}}>🔄 Tweak It</div>
                    <div style={{fontSize:11,color:"#94a3b8",marginBottom:6}}>Tell AI what to change</div>
                    <input className="lb-regen-input" placeholder="e.g. Make it shorter, add more about leadership, less formal…" value={regenNote} onChange={e=>setRegenNote(e.target.value)} />
                    <button className="lb-regen-btn" onClick={()=>generate(true)} disabled={loading}>
                      {loading ? "✍️ Rewriting…" : regenNote.trim() ? "✨ Apply & Rewrite" : "🔄 New Variation"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="lb-cta">
              <div><h3>More AI Tools 🚀</h3><p>AI Email Writer, Interview Prep, Cover Letter and more.</p></div>
              <Link to="/tools" className="lb-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}