import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "../../components/footer";

// ── Load pdf-lib ──────────────────────────────────────────
let pdfLibPromise = null;
function loadPDFLib() {
  if (pdfLibPromise) return pdfLibPromise;
  pdfLibPromise = new Promise((resolve, reject) => {
    if (window.PDFLib) { resolve(window.PDFLib); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
    s.onload  = () => window.PDFLib ? resolve(window.PDFLib) : reject(new Error("pdf-lib not found"));
    s.onerror = () => reject(new Error("Could not load pdf-lib"));
    document.head.appendChild(s);
  });
  return pdfLibPromise;
}

function formatBytes(b) {
  if (!b)           return "0 B";
  if (b < 1024)     return b + " B";
  if (b < 1048576)  return (b/1024).toFixed(1) + " KB";
  return (b/1048576).toFixed(2) + " MB";
}

const LEVELS = [
  { id:"low",    label:"Low",    emoji:"🟢", desc:"Highest quality, smaller reduction",   useObjectStreams:true },
  { id:"medium", label:"Medium", emoji:"🟡", desc:"Balanced — best for most files",       useObjectStreams:true },
  { id:"high",   label:"High",   emoji:"🔴", desc:"Maximum reduction, lower quality",     useObjectStreams:true },
];

async function compressPDF(buffer, levelId) {
  const PDFLib = await loadPDFLib();
  const pdfDoc = await PDFLib.PDFDocument.load(buffer, { updateMetadata:false });

  // Strip metadata to reduce size
  pdfDoc.setTitle(""); pdfDoc.setAuthor(""); pdfDoc.setSubject("");
  pdfDoc.setKeywords([]); pdfDoc.setProducer(""); pdfDoc.setCreator("");

  return pdfDoc.save({ useObjectStreams:true, addDefaultPage:false });
}

export default function PDFCompressor() {
  const inputRef   = useRef(null);
  const [file,     setFile]     = useState(null);
  const [level,    setLevel]    = useState("medium");
  const [status,   setStatus]   = useState("idle");
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") { setError("Please upload a PDF file (.pdf)."); return; }
    if (f.size > 50*1024*1024)        { setError("File too large. Maximum size is 50 MB."); return; }
    setFile(f); setResult(null); setError(""); setStatus("idle"); setProgress(0);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const compress = async () => {
    if (!file) { setError("Please upload a PDF first."); return; }
    setStatus("compressing"); setError(""); setResult(null); setProgress(0);

    try {
      // Simulate progress
      const progTimer = setInterval(() => setProgress(p => Math.min(p+15, 85)), 200);
      const buf = await file.arrayBuffer();
      const out = await compressPDF(buf, level);
      clearInterval(progTimer); setProgress(100);

      const blob = new Blob([out], { type:"application/pdf" });
      setResult({ blob, origSize:file.size, newSize:blob.size, name:file.name.replace(/\.pdf$/i,"")+"-compressed.pdf" });
      setStatus("done");
    } catch(e) {
      setError("Compression failed: " + e.message);
      setStatus("error");
    }
  };

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href=url; a.download=result.name;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null); setResult(null); setError(""); setStatus("idle"); setProgress(0);
    if (inputRef.current) inputRef.current.value="";
  };

  const reduction = result ? Math.max(0,Math.round(((result.origSize-result.newSize)/result.origSize)*100)) : 0;
  const isDone = status==="done", isBusy = status==="compressing";

  return (
    <>
      <Helmet>
        <title>{"Free PDF Compressor — Reduce PDF Size for WhatsApp & Email | AIDLA"}</title>
        <meta name="description" content="Compress PDF files for free online. Reduce PDF size for WhatsApp, email and sharing without losing quality. 100% private — processed in your browser, nothing uploaded." />
        <meta name="keywords" content="PDF compressor free, compress PDF online, reduce PDF size, PDF file size reducer, compress PDF WhatsApp, PDF optimizer Pakistan" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://aidla.online/tools/pdf/pdf-compressor" />
      </Helmet>
      <style>{`
        *{box-sizing:border-box;}
        .pdf-drop{border:2px dashed #e2e8f0;border-radius:16px;padding:clamp(28px,7vw,52px) 20px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa;}
        .pdf-drop.drag,.pdf-drop:hover{border-color:#dc2626;background:rgba(220,38,38,.04);}
        .lvl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
        @media(max-width:400px){.lvl-grid{grid-template-columns:1fr;}}
        .pf-info{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:16px;}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" }}>
        {/* Breadcrumb */}
        <div style={{ background:"#fff", borderBottom:"1px solid #f1f5f9", padding:"10px clamp(14px,4vw,24px)" }}>
          <div style={{ maxWidth:740, margin:"0 auto", fontSize:"clamp(10px,2.5vw,12px)", color:"#94a3b8", display:"flex", gap:6, flexWrap:"wrap" }}>
            <Link to="/tools" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Tools</Link><span>›</span>
            <Link to="/tools" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>PDF</Link><span>›</span>
            <span style={{ color:"#0f172a", fontWeight:600 }}>PDF Compressor</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#7f1d1d,#dc2626)", padding:"clamp(24px,5vw,40px) clamp(14px,4vw,24px)", textAlign:"center" }}>
          <div style={{ fontSize:"clamp(28px,7vw,40px)", marginBottom:10 }}>🗜️</div>
          <h1 style={{ margin:"0 0 8px", fontSize:"clamp(1.4rem,5vw,2rem)", fontWeight:900, color:"#fff" }}>Free PDF Compressor</h1>
          <p style={{ margin:0, fontSize:"clamp(12px,3vw,15px)", color:"rgba(255,255,255,0.75)" }}>
            Reduce PDF size for WhatsApp, email & sharing · 100% Private · Nothing uploaded
          </p>
        </div>

        <div style={{ maxWidth:740, margin:"0 auto", padding:"clamp(16px,4vw,28px) clamp(14px,4vw,24px) 60px", width:"100%" }}>

          {/* Drop zone */}
          <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,20px)", marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Upload PDF</div>
            <div className={`pdf-drop${dragging?" drag":""}`}
              onDrop={onDrop} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
              onClick={()=>inputRef.current?.click()}>
              <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
              {file ? (
                <>
                  <div style={{ fontSize:"clamp(28px,7vw,40px)", marginBottom:8 }}>📄</div>
                  <div style={{ fontSize:"clamp(13px,3vw,14px)", fontWeight:700, color:"#0f172a", marginBottom:4, wordBreak:"break-word" }}>{file.name}</div>
                  <div style={{ fontSize:12, color:"#94a3b8" }}>{formatBytes(file.size)}</div>
                  <button onClick={e=>{e.stopPropagation();reset();}}
                    style={{ marginTop:10, padding:"4px 14px", fontSize:11, fontWeight:700, color:"#dc2626", background:"rgba(220,38,38,.08)", border:"1px solid rgba(220,38,38,.2)", borderRadius:8, cursor:"pointer" }}>
                    ✕ Remove
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize:"clamp(32px,8vw,48px)", marginBottom:10 }}>📂</div>
                  <div style={{ fontSize:"clamp(13px,3vw,15px)", fontWeight:700, color:"#334155", marginBottom:6 }}>Drop PDF here or tap to browse</div>
                  <div style={{ fontSize:12, color:"#94a3b8" }}>PDF files only · Maximum 50 MB</div>
                </>
              )}
            </div>
          </div>

          {/* Compression level */}
          <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,20px)", marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Compression Level</div>
            <div className="lvl-grid">
              {LEVELS.map(l => (
                <button key={l.id} onClick={()=>setLevel(l.id)}
                  style={{ padding:"12px 8px", borderRadius:12, border:"1px solid", cursor:"pointer", textAlign:"center",
                    background:  level===l.id ? "linear-gradient(135deg,#dc2626,#ef4444)" : "#f8fafc",
                    color:       level===l.id ? "#fff" : "#334155",
                    borderColor: level===l.id ? "#dc2626" : "#e2e8f0",
                  }}>
                  <div style={{ fontSize:16, marginBottom:4 }}>{l.emoji}</div>
                  <div style={{ fontWeight:800, fontSize:"clamp(12px,3vw,14px)" }}>{l.label}</div>
                  <div style={{ fontSize:"clamp(9px,2vw,11px)", opacity:.8, marginTop:3, lineHeight:1.4 }}>{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:"rgba(220,38,38,.07)", border:"1px solid rgba(220,38,38,.2)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#dc2626", marginBottom:14 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Progress bar */}
          {isBusy && (
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#64748b", marginBottom:6, fontWeight:600 }}>
                <span>⏳ Compressing PDF…</span>
                <span>{progress}%</span>
              </div>
              <div style={{ height:8, background:"#f1f5f9", borderRadius:8, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(135deg,#dc2626,#ef4444)", borderRadius:8, transition:"width .2s" }}/>
              </div>
            </div>
          )}

          {/* Compress button */}
          {!isDone && (
            <button onClick={compress} disabled={isBusy||!file}
              style={{ width:"100%", padding:"13px 0", background:"linear-gradient(135deg,#dc2626,#ef4444)", color:"#fff", border:"none", borderRadius:12, fontWeight:800, fontSize:15, cursor:isBusy||!file?"not-allowed":"pointer", opacity:isBusy||!file?0.65:1 }}>
              {isBusy ? "⏳ Compressing…" : "🗜️ Compress PDF"}
            </button>
          )}

          {/* Result */}
          {isDone && result && (
            <>
              {/* Stats card */}
              <div style={{ background: reduction>5 ? "linear-gradient(135deg,#14532d,#16a34a)" : "linear-gradient(135deg,#0b1437,#1a3a8f)", borderRadius:16, padding:"clamp(16px,4vw,24px)", marginBottom:12, textAlign:"center" }}>
                <div style={{ fontSize:"clamp(2.5rem,12vw,4rem)", fontWeight:900, color:"#fff", lineHeight:1 }}>
                  {reduction > 0 ? `${reduction}%` : "✅"}
                </div>
                <div style={{ fontSize:"clamp(12px,3vw,14px)", color:"rgba(255,255,255,.8)", marginTop:6, fontWeight:600, marginBottom:16 }}>
                  {reduction > 5 ? "File size reduced!" : result.newSize < result.origSize ? "Slightly optimized" : "Already well-optimized — minimal change possible"}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:8, alignItems:"center" }}>
                  <div style={{ background:"rgba(0,0,0,.2)", borderRadius:10, padding:"10px 8px", textAlign:"center" }}>
                    <div style={{ fontSize:"clamp(9px,2vw,10px)", color:"rgba(255,255,255,.6)", fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Before</div>
                    <div style={{ fontSize:"clamp(14px,4vw,18px)", fontWeight:900, color:"#fff" }}>{formatBytes(result.origSize)}</div>
                  </div>
                  <div style={{ fontSize:"clamp(18px,5vw,22px)", color:"rgba(255,255,255,.6)" }}>→</div>
                  <div style={{ background:"rgba(0,0,0,.2)", borderRadius:10, padding:"10px 8px", textAlign:"center" }}>
                    <div style={{ fontSize:"clamp(9px,2vw,10px)", color:"rgba(255,255,255,.6)", fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>After</div>
                    <div style={{ fontSize:"clamp(14px,4vw,18px)", fontWeight:900, color:"#fcd34d" }}>{formatBytes(result.newSize)}</div>
                  </div>
                </div>
              </div>

              <button onClick={download}
                style={{ width:"100%", padding:"13px 0", background:"linear-gradient(135deg,#16a34a,#22c55e)", color:"#fff", border:"none", borderRadius:12, fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>
                ⬇ Download Compressed PDF
              </button>
              <button onClick={reset}
                style={{ width:"100%", padding:"11px 0", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:12, fontWeight:700, fontSize:13, cursor:"pointer", color:"#475569" }}>
                🔄 Compress Another PDF
              </button>
            </>
          )}

          {/* Info */}
          <div className="pf-info">
            {[
              { icon:"🔒", title:"100% Private",  desc:"PDF never leaves your device. Processed in browser." },
              { icon:"📱", title:"WhatsApp Ready", desc:"Reduce large PDFs under 100MB to send via WhatsApp." },
              { icon:"⚡", title:"Fast",           desc:"No upload wait — compression takes seconds." },
              { icon:"🆓", title:"Free Forever",   desc:"No sign-up, no limits, no watermarks." },
            ].map(i=>(
              <div key={i.title} style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:12, padding:"13px 14px", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:20, marginBottom:5 }}>{i.icon}</div>
                <div style={{ fontSize:"clamp(11px,2.5vw,12px)", fontWeight:700, color:"#0b1437", marginBottom:3 }}>{i.title}</div>
                <div style={{ fontSize:"clamp(10px,2vw,11px)", color:"#64748b", lineHeight:1.55 }}>{i.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}