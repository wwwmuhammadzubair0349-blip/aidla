import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "../../components/footer";

function analyze(text) {
  if (!text.trim()) return { words:0, chars:0, charsNoSpace:0, sentences:0, paragraphs:0, readTime:0, speakTime:0, uniqueWords:0, topWords:[] };
  const words      = text.trim().split(/\s+/).filter(Boolean);
  const sentences  = text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
  const paragraphs = text.split(/\n{2,}/).filter(p=>p.trim().length>0).length || 1;
  const readTime   = Math.ceil(words.length / 200);
  const speakTime  = Math.ceil(words.length / 130);
  const uniqueWords= new Set(words.map(w=>w.toLowerCase().replace(/[^a-z0-9]/g,""))).size;

  // Top words
  const freq = {};
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g,"");
    if (clean.length > 3) freq[clean] = (freq[clean]||0) + 1;
  });
  const topWords = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return {
    words:       words.length,
    chars:       text.length,
    charsNoSpace:text.replace(/\s/g,"").length,
    sentences, paragraphs, readTime, speakTime, uniqueWords, topWords,
  };
}

export default function WordCounter() {
  const [text,   setText]  = useState("");
  const [copied, setCopied]= useState(false);
  const stats = analyze(text);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };

  const S = {
    page:  { minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" },
    wrap:  { maxWidth:900, margin:"0 auto", padding:"clamp(16px,4vw,32px) clamp(14px,4vw,24px) 60px", width:"100%" },
    card:  { background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,20px)", marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,.04)" },
    label: { fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", display:"block", marginBottom:8 },
  };

  return (
    <>
      <Helmet>
        <title>Free Word Counter — Count Words, Characters & Reading Time | AIDLA</title>
        <meta name="description" content="Free online word counter tool. Count words, characters, sentences, paragraphs and reading time instantly. Perfect for essays, assignments and social media posts." />
        <meta name="keywords" content="word counter, character counter, word count online, count words free, essay word counter, reading time calculator" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.aidla.online/tools/utility/word-counter" />
      </Helmet>
      <style>{`* { box-sizing: border-box; }`}</style>

      <div style={S.page}>
        <div style={{ background:"#fff", borderBottom:"1px solid #f1f5f9", padding:"10px clamp(14px,4vw,24px)" }}>
          <div style={{ maxWidth:900, margin:"0 auto", fontSize:"clamp(10px,2.5vw,12px)", color:"#94a3b8", display:"flex", gap:6, flexWrap:"wrap" }}>
            <Link to="/tools" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Tools</Link><span>›</span>
            <span style={{ color:"#0f172a", fontWeight:600 }}>Word Counter</span>
          </div>
        </div>

        <div style={{ background:"linear-gradient(135deg,#0b1437,#1a3a8f)", padding:"clamp(24px,5vw,40px) clamp(14px,4vw,24px)", textAlign:"center" }}>
          <div style={{ fontSize:"clamp(28px,7vw,40px)", marginBottom:10 }}>🔢</div>
          <h1 style={{ margin:"0 0 8px", fontSize:"clamp(1.4rem,5vw,2rem)", fontWeight:900, color:"#fff" }}>Word Counter</h1>
          <p style={{ margin:0, fontSize:"clamp(12px,3vw,15px)", color:"rgba(255,255,255,0.72)" }}>Words · Characters · Sentences · Reading Time · All instant</p>
        </div>

        <div style={S.wrap}>
          {/* Stats bar */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginBottom:14 }}>
            {[
              { label:"Words",        value:stats.words.toLocaleString(),         color:"#1a3a8f" },
              { label:"Characters",   value:stats.chars.toLocaleString(),          color:"#7c3aed" },
              { label:"Sentences",    value:stats.sentences.toLocaleString(),      color:"#dc2626" },
              { label:"Paragraphs",   value:stats.paragraphs.toLocaleString(),     color:"#d97706" },
              { label:"Read Time",    value:`~${stats.readTime} min`,             color:"#16a34a" },
              { label:"Speak Time",   value:`~${stats.speakTime} min`,            color:"#0284c7" },
            ].map(s => (
              <div key={s.label} style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:12, padding:"12px 10px", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:"clamp(18px,5vw,22px)", fontWeight:900, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:"clamp(9px,2vw,11px)", color:"#94a3b8", fontWeight:600, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Textarea */}
          <div style={S.card}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10, flexWrap:"wrap", gap:8 }}>
              <span style={S.label}>Paste or type your text</span>
              <div style={{ display:"flex", gap:7 }}>
                {text && (
                  <>
                    <button onClick={handleCopy}
                      style={{ padding:"5px 12px", fontSize:11, fontWeight:700, border:`1px solid ${copied?"rgba(22,163,74,.3)":"#e2e8f0"}`, borderRadius:8, cursor:"pointer", background:copied?"rgba(22,163,74,.07)":"#f8fafc", color:copied?"#15803d":"#475569" }}>
                      {copied?"✅ Copied":"📋 Copy"}
                    </button>
                    <button onClick={()=>setText("")}
                      style={{ padding:"5px 12px", fontSize:11, fontWeight:700, border:"1px solid rgba(239,68,68,.2)", borderRadius:8, cursor:"pointer", background:"rgba(239,68,68,.06)", color:"#dc2626" }}>
                      ✕ Clear
                    </button>
                  </>
                )}
              </div>
            </div>
            <textarea
              value={text}
              onChange={e=>setText(e.target.value)}
              placeholder="Start typing or paste your text here… Word count updates instantly as you type."
              style={{ width:"100%", minHeight:"clamp(180px,40vw,300px)", padding:"12px 14px", border:"1px solid #e2e8f0", borderRadius:10, fontSize:14, color:"#0f172a", outline:"none", resize:"vertical", lineHeight:1.7, fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box" }}
            />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"clamp(10px,2.5vw,11px)", color:"#94a3b8", marginTop:8, flexWrap:"wrap", gap:4 }}>
              <span>Chars without spaces: {stats.charsNoSpace.toLocaleString()}</span>
              <span>Unique words: {stats.uniqueWords.toLocaleString()}</span>
            </div>
          </div>

          {/* Top words */}
          {stats.topWords.length > 0 && (
            <div style={S.card}>
              <span style={S.label}>Most Used Words</span>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {stats.topWords.map(([word, count]) => (
                  <div key={word} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(26,58,143,.07)", border:"1px solid rgba(26,58,143,.15)", borderRadius:20, padding:"4px 12px" }}>
                    <span style={{ fontSize:13, fontWeight:700, color:"#1a3a8f" }}>{word}</span>
                    <span style={{ fontSize:11, color:"#94a3b8" }}>×{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Limits reference */}
          <div style={S.card}>
            <span style={S.label}>Common Word Limits</span>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:8 }}>
              {[
                { platform:"Twitter/X",    limit:280,   unit:"chars" },
                { platform:"Instagram",    limit:2200,  unit:"chars" },
                { platform:"LinkedIn Post",limit:3000,  unit:"chars" },
                { platform:"Essay (Short)",limit:500,   unit:"words" },
                { platform:"Essay (Long)", limit:1000,  unit:"words" },
                { platform:"Thesis",       limit:80000, unit:"words" },
              ].map(p => {
                const current = p.unit==="words" ? stats.words : stats.chars;
                const pct     = Math.min((current/p.limit)*100, 100);
                const over    = current > p.limit;
                return (
                  <div key={p.platform} style={{ background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:10, padding:"10px 12px" }}>
                    <div style={{ fontSize:"clamp(10px,2.5vw,12px)", fontWeight:700, color:"#334155", marginBottom:4 }}>{p.platform}</div>
                    <div style={{ fontSize:"clamp(9px,2vw,10px)", color:over?"#dc2626":"#94a3b8", marginBottom:6 }}>
                      {current.toLocaleString()} / {p.limit.toLocaleString()} {p.unit}
                    </div>
                    <div style={{ height:4, background:"#e2e8f0", borderRadius:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:over?"#dc2626":"#1a3a8f", borderRadius:4, transition:"width .3s" }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}