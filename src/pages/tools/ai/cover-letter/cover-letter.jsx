import { useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer";

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function callCoverLetter(payload) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/cover-letter-ai`, {
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
  { id:"professional", label:"💼 Professional" },
  { id:"enthusiastic", label:"🔥 Enthusiastic" },
  { id:"confident",    label:"🎯 Confident"    },
  { id:"formal",       label:"🎩 Formal"       },
];

const LENGTHS = [
  { id:"short",  label:"Short",  sub:"~200 words" },
  { id:"medium", label:"Medium", sub:"~350 words" },
  { id:"long",   label:"Long",   sub:"~500 words" },
];

const QUICK_CHIPS = [
  "Make it shorter","More confident opening","Highlight leadership",
  "Add more enthusiasm","Stronger closing","More formal",
  "Emphasize technical skills","Focus on achievements",
];

export default function CoverLetterAI() {
  const [applicantName, setApplicantName] = useState("");
  const [jobTitle,      setJobTitle]      = useState("");
  const [company,       setCompany]       = useState("");
  const [hiringMgr,     setHiringMgr]     = useState("");
  const [experience,    setExperience]    = useState("");
  const [skills,        setSkills]        = useState("");
  const [whyCompany,    setWhyCompany]    = useState("");
  const [tone,          setTone]          = useState("professional");
  const [length,        setLength]        = useState("medium");
  const [loading,       setLoading]       = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [result,        setResult]        = useState(null);
  const [error,         setError]         = useState("");
  const [regenNote,     setRegenNote]     = useState("");
  const [regenLoading,  setRegenLoading]  = useState(false);
  const [regenProgress, setRegenProgress] = useState(0);
  const [copied,        setCopied]        = useState("");
  const resultRef = useRef(null);

  const generate = useCallback(async () => {
    if (!jobTitle.trim()) return;
    setLoading(true); setError(""); setResult(null); setProgress(0); setRegenNote("");
    const tick = setInterval(() => setProgress(p => Math.min(p + 9, 88)), 550);
    try {
      const res = await callCoverLetter({ applicantName, jobTitle, company, hiringMgr, experience, skills, whyCompany, tone, length });
      clearInterval(tick); setProgress(100);
      setTimeout(() => {
        setResult(res);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 150);
      }, 200);
    } catch (e) {
      clearInterval(tick); setProgress(0);
      setError(e.message || "Generation failed — please try again.");
    }
    setTimeout(() => setLoading(false), 300);
  }, [applicantName, jobTitle, company, hiringMgr, experience, skills, whyCompany, tone, length]);

  const regen = useCallback(async () => {
    if (!result || regenLoading) return;
    setRegenLoading(true); setRegenProgress(0);
    const tick = setInterval(() => setRegenProgress(p => Math.min(p + 10, 88)), 500);
    try {
      const res = await callCoverLetter({
        applicantName, jobTitle, company, hiringMgr, experience, skills, whyCompany, tone, length,
        isRegen: true,
        previousLetter: result.letter,
        regenInstructions: regenNote.trim() || "Write a fresh variation",
      });
      clearInterval(tick); setRegenProgress(100);
      setTimeout(() => { setResult(res); setRegenNote(""); }, 200);
    } catch {}
    setTimeout(() => setRegenLoading(false), 300);
  }, [result, regenLoading, applicantName, jobTitle, company, hiringMgr, experience, skills, whyCompany, tone, length, regenNote]);

  const copy = async (text, id) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(id); setTimeout(() => setCopied(""), 2200);
  };

  return (
    <>
      <Helmet>
        <title>AI Cover Letter Generator — Tailored Cover Letters Instantly | AIDLA</title>
        <meta name="description" content="Free AI cover letter generator. Write a tailored, professional cover letter for any job in seconds. Choose tone, length and style. Powered by AIDLA AI." />
        <meta name="keywords" content="AI cover letter generator, cover letter writer, job application cover letter, professional cover letter AI, free cover letter maker, AIDLA AI" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.aidla.online/tools/ai/cover-letter" />
        <meta property="og:title" content="AI Cover Letter Generator | AIDLA" />
        <meta property="og:description" content="Write a tailored cover letter for any job in seconds with AIDLA AI." />
        <meta property="og:url" content="https://www.aidla.online/tools/ai/cover-letter" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context":"https://schema.org","@type":"WebApplication",
          "name":"AI Cover Letter Generator by AIDLA","url":"https://www.aidla.online/tools/ai/cover-letter",
          "description":"Free AI cover letter generator — tailored, professional, instant.",
          "applicationCategory":"ProductivityApplication","operatingSystem":"Web",
          "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
          "publisher":{"@type":"Organization","name":"AIDLA","url":"https://www.aidla.online"}
        })}</script>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .cl-root*{box-sizing:border-box;margin:0;padding:0}
        .cl-root{min-height:100vh;background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden}
        .cl-wrap{max-width:700px;margin:0 auto;padding:clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;width:100%}
        .cl-crumb{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:18px;flex-wrap:wrap}
        .cl-crumb a{color:#94a3b8;text-decoration:none}.cl-crumb a:hover{color:#1a3a8f}
        .cl-hero{text-align:center;margin-bottom:24px}
        .cl-badge{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;padding:5px 16px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px;box-shadow:0 4px 16px rgba(220,38,38,.28)}
        .cl-h1{font-family:'Playfair Display',serif;font-size:clamp(1.7rem,6vw,2.5rem);font-weight:900;color:#0b1437;line-height:1.1;margin-bottom:8px}
        .cl-accent{background:linear-gradient(135deg,#dc2626,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .cl-sub{font-size:clamp(13px,3vw,15px);color:#64748b;line-height:1.65;max-width:460px;margin:0 auto}
        .cl-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 4px 20px rgba(11,20,55,.07);padding:clamp(18px,4vw,26px);margin-bottom:14px}
        .cl-sec{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin-bottom:12px;display:block}
        .cl-label{display:block;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .cl-input{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:14px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;-webkit-appearance:none}
        .cl-input:focus{border-color:rgba(220,38,38,.35);box-shadow:0 0 0 3px rgba(220,38,38,.06)}
        .cl-input::placeholder{color:#94a3b8;font-weight:500;font-size:13px}
        .cl-textarea{width:100%;padding:11px 13px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:14px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .15s;resize:vertical;min-height:80px;line-height:1.6}
        .cl-textarea:focus{border-color:rgba(220,38,38,.35);box-shadow:0 0 0 3px rgba(220,38,38,.06)}
        .cl-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .cl-tones{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
        .cl-tone-btn{padding:9px 6px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;font-size:11px;font-weight:800;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:center}
        .cl-tone-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .cl-lengths{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .cl-len-btn{padding:10px 6px;border-radius:12px;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;text-align:center}
        .cl-len-btn.active{background:#0b1437;border-color:#0b1437;color:#fff}
        .cl-len-label{font-size:12px;font-weight:800;color:inherit}
        .cl-len-sub{font-size:10px;color:#94a3b8;margin-top:2px}
        .cl-len-btn.active .cl-len-sub{color:rgba(255,255,255,.6)}
        /* Progress + button */
        .cl-prog-wrap{margin-bottom:11px}
        .cl-prog-row{display:flex;justify-content:space-between;font-size:11px;color:#94a3b8;margin-bottom:5px;font-weight:600}
        .cl-prog-track{height:4px;background:#f1f5f9;border-radius:99px;overflow:hidden}
        .cl-prog-bar{height:100%;border-radius:99px;background:linear-gradient(90deg,#dc262688,#dc2626);transition:width .5s ease}
        .cl-gen-btn{width:100%;padding:14px;border:none;border-radius:14px;font-weight:800;font-size:15px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;color:#fff;background:linear-gradient(135deg,#dc2626,#ef4444);box-shadow:0 4px 16px rgba(220,38,38,.28)}
        .cl-gen-btn:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.07)}
        .cl-gen-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
        .cl-error{font-size:13px;color:#dc2626;background:rgba(220,38,38,.06);border:1px solid rgba(220,38,38,.15);border-radius:10px;padding:10px 13px;margin-bottom:12px}
        /* Result */
        .cl-result-card{background:#fff;border:1px solid rgba(59,130,246,.1);border-radius:20px;box-shadow:0 8px 28px rgba(11,20,55,.08);overflow:hidden;margin-bottom:14px}
        .cl-accent-line{height:3px;width:100%;background:linear-gradient(90deg,#dc2626,#f97316,transparent)}
        .cl-result-hdr{padding:13px 16px;background:#f8faff;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
        .cl-result-icon{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#dc2626,#ef4444);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
        .cl-result-name{font-size:12px;font-weight:800;color:#0b1437}
        .cl-result-sub{font-size:10px;color:#94a3b8;margin-top:1px}
        .cl-result-btns{display:flex;gap:6px;flex-wrap:wrap}
        .cl-result-btn{padding:6px 12px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;font-size:11px;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s;white-space:nowrap}
        .cl-result-btn:hover{background:#f8faff}
        .cl-result-btn.copied{background:rgba(5,150,105,.08);border-color:rgba(5,150,105,.2);color:#059669}
        .cl-letter-body{padding:22px}
        .cl-letter-text{font-size:14px;color:#374151;line-height:1.85;white-space:pre-wrap;word-break:break-word;font-family:'DM Sans',sans-serif}
        /* Regen */
        .cl-regen-card{background:rgba(255,255,255,.95);border:1px solid rgba(59,130,246,.1);border-radius:18px;padding:18px;margin-bottom:14px}
        .cl-chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
        .cl-chip{padding:4px 10px;background:#f8faff;border:1px solid #e2e8f0;border-radius:99px;font-size:11px;font-weight:600;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s;white-space:nowrap}
        .cl-chip:hover{background:rgba(220,38,38,.06);color:#dc2626;border-color:rgba(220,38,38,.2)}
        .cl-regen-input{width:100%;padding:10px 13px;border:1.5px solid #e2e8f0;border-radius:11px;font-size:13px;font-weight:600;color:#0b1437;background:#fff;outline:none;font-family:'DM Sans',sans-serif;margin:8px 0;transition:border-color .15s;-webkit-appearance:none}
        .cl-regen-input:focus{border-color:rgba(220,38,38,.35)}
        .cl-regen-row{display:grid;grid-template-columns:1fr auto;gap:8px}
        .cl-regen-btn{padding:11px 14px;border:none;border-radius:12px;background:linear-gradient(135deg,#dc262666,#ef444488);color:#fff;font-size:13px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .cl-regen-btn:disabled{opacity:.55;cursor:not-allowed}
        .cl-clear-btn{padding:11px 14px;border:1.5px solid #e2e8f0;border-radius:12px;background:#fff;font-size:12px;font-weight:700;color:#94a3b8;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:all .13s}
        .cl-cta{background:linear-gradient(135deg,#0b1437,#dc2626);border-radius:20px;padding:22px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border:1px solid rgba(245,158,11,.15);box-shadow:0 8px 24px rgba(11,20,55,.15);margin-top:8px}
        .cl-cta h3{font-family:'Playfair Display',serif;font-size:clamp(1rem,4vw,1.3rem);font-weight:900;color:#fff;margin-bottom:3px}
        .cl-cta p{font-size:12px;color:rgba(255,255,255,.6)}
        .cl-cta-btn{padding:10px 22px;background:linear-gradient(135deg,#f59e0b,#fcd34d);color:#0b1437;border-radius:99px;font-weight:900;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0;display:inline-block}
        @media(max-width:480px){.cl-tones{grid-template-columns:1fr 1fr}.cl-grid2{grid-template-columns:1fr}.cl-regen-row{grid-template-columns:1fr}.cl-cta{flex-direction:column;text-align:center}.cl-cta-btn{width:100%;text-align:center}}
      `}</style>

      <div className="cl-root">
        <div className="cl-wrap">
          <nav className="cl-crumb"><Link to="/tools">Tools</Link><span>›</span><Link to="/tools">AI Tools</Link><span>›</span><span style={{color:"#475569"}}>Cover Letter</span></nav>

          <motion.div className="cl-hero" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.4}}>
            <div className="cl-badge">✉️ AIDLA AI — Cover Letter</div>
            <h1 className="cl-h1"><span className="cl-accent">AI Cover Letter</span> Generator</h1>
            <p className="cl-sub">Write a tailored, professional cover letter for any job in seconds. Regenerate with custom instructions.</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.35,delay:.08}}>
            {/* Job details */}
            <div className="cl-card">
              <span className="cl-sec">Job Details</span>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div className="cl-grid2">
                  <div><label className="cl-label">Your Name</label><input className="cl-input" placeholder="e.g. Ahmed Ali" value={applicantName} onChange={e=>setApplicantName(e.target.value)} /></div>
                  <div><label className="cl-label">Job Title Applying For *</label><input className="cl-input" placeholder="e.g. Senior Frontend Developer" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} /></div>
                </div>
                <div className="cl-grid2">
                  <div><label className="cl-label">Company Name</label><input className="cl-input" placeholder="e.g. Google, Systems Ltd" value={company} onChange={e=>setCompany(e.target.value)} /></div>
                  <div><label className="cl-label">Hiring Manager Name</label><input className="cl-input" placeholder="e.g. Mr. John / Dear Hiring Team" value={hiringMgr} onChange={e=>setHiringMgr(e.target.value)} /></div>
                </div>
              </div>
            </div>

            {/* Your background */}
            <div className="cl-card">
              <span className="cl-sec">Your Background</span>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div>
                  <label className="cl-label">Experience & Background</label>
                  <textarea className="cl-textarea" placeholder="e.g. 5 years in frontend development, previously at XYZ Corp, led team of 4 developers…" value={experience} onChange={e=>setExperience(e.target.value)} />
                </div>
                <div>
                  <label className="cl-label">Key Skills & Achievements</label>
                  <textarea className="cl-textarea" placeholder="e.g. React, TypeScript, increased app performance by 40%, built dashboard used by 50k users…" value={skills} onChange={e=>setSkills(e.target.value)} />
                </div>
                <div>
                  <label className="cl-label">Why This Company? (optional)</label>
                  <input className="cl-input" placeholder="e.g. Admire their innovation in AI, want to work on meaningful products…" value={whyCompany} onChange={e=>setWhyCompany(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Style */}
            <div className="cl-card">
              <span className="cl-sec">Tone</span>
              <div className="cl-tones" style={{marginBottom:18}}>
                {TONES.map(t=>(
                  <button key={t.id} className={`cl-tone-btn${tone===t.id?" active":""}`} onClick={()=>setTone(t.id)}>{t.label}</button>
                ))}
              </div>
              <span className="cl-sec">Length</span>
              <div className="cl-lengths">
                {LENGTHS.map(l=>(
                  <button key={l.id} className={`cl-len-btn${length===l.id?" active":""}`} onClick={()=>setLength(l.id)}>
                    <div className="cl-len-label">{l.label}</div>
                    <div className="cl-len-sub">{l.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="cl-error">⚠️ {error}</div>}
            {loading && (
              <div className="cl-prog-wrap">
                <div className="cl-prog-row"><span>✍️ Writing your cover letter…</span><span>{Math.round(progress)}%</span></div>
                <div className="cl-prog-track"><div className="cl-prog-bar" style={{width:`${progress}%`}}/></div>
              </div>
            )}
            <button className="cl-gen-btn" onClick={generate} disabled={loading||!jobTitle.trim()}>
              {loading ? "✍️ Writing Your Cover Letter…" : "✉️ Generate Cover Letter"}
            </button>
          </motion.div>

          {/* Result */}
          <div ref={resultRef}>
            <AnimatePresence>
              {result?.letter && (
                <motion.div key="result" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.4,ease:[.22,1,.36,1]}}>
                  <div className="cl-result-card">
                    <div className="cl-accent-line"/>
                    <div className="cl-result-hdr">
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div className="cl-result-icon">✉️</div>
                        <div>
                          <div className="cl-result-name">
                            AI Cover Letter
                            <span style={{fontSize:9,fontWeight:800,color:"#059669",background:"rgba(5,150,105,.08)",border:"1px solid rgba(5,150,105,.2)",borderRadius:99,padding:"1px 7px",marginLeft:6}}>✨ AI</span>
                          </div>
                          <div className="cl-result-sub">{tone} · {length} · {jobTitle}{company?` at ${company}`:""}</div>
                        </div>
                      </div>
                      <div className="cl-result-btns">
                        <button className={`cl-result-btn${copied==="letter"?" copied":""}`} onClick={()=>copy(result.letter,"letter")}>
                          {copied==="letter"?"✅ Copied!":"📋 Copy Letter"}
                        </button>
                      </div>
                    </div>
                    <div className="cl-letter-body">
                      <pre className="cl-letter-text">{result.letter}</pre>
                    </div>
                  </div>

                  {/* Regen */}
                  <div className="cl-regen-card">
                    <div style={{fontSize:13,fontWeight:800,color:"#0b1437",marginBottom:3}}>🔄 Regenerate with Instructions</div>
                    <div style={{fontSize:11,color:"#94a3b8",marginBottom:4}}>Click chips or type your instructions</div>
                    <div className="cl-chips">
                      {QUICK_CHIPS.map(c=>(
                        <button key={c} className="cl-chip" onClick={()=>setRegenNote(n=>n?`${n}. ${c}`:c)}>+ {c}</button>
                      ))}
                    </div>
                    <input className="cl-regen-input" placeholder="Type instructions e.g. 'Shorter and more direct'" value={regenNote} onChange={e=>setRegenNote(e.target.value)} />
                    {regenLoading && (
                      <div className="cl-prog-wrap" style={{marginBottom:8}}>
                        <div className="cl-prog-row"><span>✍️ Rewriting…</span><span>{Math.round(regenProgress)}%</span></div>
                        <div className="cl-prog-track"><div className="cl-prog-bar" style={{width:`${regenProgress}%`}}/></div>
                      </div>
                    )}
                    <div className="cl-regen-row">
                      <button className="cl-regen-btn" onClick={regen} disabled={regenLoading||loading}>
                        {regenLoading?"✍️ Rewriting…":regenNote.trim()?"✨ Apply & Rewrite":"🔄 New Variation"}
                      </button>
                      {regenNote && <button className="cl-clear-btn" onClick={()=>setRegenNote("")}>Clear</button>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.38}}>
            <div className="cl-cta">
              <div><h3>More AI Tools 🚀</h3><p>AI Email Writer, LinkedIn Bio, Interview Prep and more.</p></div>
              <Link to="/tools" className="cl-cta-btn">Explore Tools ✨</Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
}