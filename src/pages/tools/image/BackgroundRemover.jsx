import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "../../components/footer";

// ── We use remove.bg API — free tier: 50 calls/month ──────
// User can also use their own API key
// Fallback: canvas-based edge detection (basic, no AI)
const REMOVEBG_API = "https://api.remove.bg/v1.0/removebg";

function formatBytes(b) {
  if (!b)          return "0 B";
  if (b < 1024)    return b + " B";
  if (b < 1048576) return (b/1024).toFixed(1) + " KB";
  return (b/1048576).toFixed(2) + " MB";
}

// ── Canvas-based simple background removal (fallback) ─────
// Removes near-white or near-solid color backgrounds
async function canvasRemoveBG(file, bgColor) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data      = imageData.data;

      // Get background color from corner pixels
      const corners = [
        [data[0], data[1], data[2]],
        [data[(canvas.width-1)*4], data[(canvas.width-1)*4+1], data[(canvas.width-1)*4+2]],
        [data[(canvas.height-1)*canvas.width*4], data[(canvas.height-1)*canvas.width*4+1], data[(canvas.height-1)*canvas.width*4+2]],
      ];

      const avgBg = corners.reduce((a,c)=>([a[0]+c[0],a[1]+c[1],a[2]+c[2]]),
        [0,0,0]).map(v=>Math.round(v/corners.length));

      const tolerance = bgColor === "white" ? 30 : bgColor === "black" ? 30 : 45;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const diff = Math.sqrt(
          Math.pow(r - avgBg[0], 2) +
          Math.pow(g - avgBg[1], 2) +
          Math.pow(b - avgBg[2], 2)
        );
        if (diff < tolerance) {
          data[i+3] = 0; // transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob(blob => {
        URL.revokeObjectURL(url);
        resolve(blob);
      }, "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not load image")); };
    img.src = url;
  });
}

// ── Remove.bg API call ─────────────────────────────────────
async function removeBgAPI(file, apiKey) {
  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");

  const res = await fetch(REMOVEBG_API, {
    method:  "POST",
    headers: { "X-Api-Key": apiKey },
    body:    formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 402) throw new Error("API credits exhausted. Please use your own API key.");
    if (res.status === 403) throw new Error("Invalid API key.");
    throw new Error(err?.errors?.[0]?.title || `API error ${res.status}`);
  }

  return res.blob();
}

const BG_PREVIEW_COLORS = [
  { id:"checker",  label:"Transparent", style:{ backgroundImage:"linear-gradient(45deg,#e2e8f0 25%,transparent 25%),linear-gradient(-45deg,#e2e8f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e2e8f0 75%),linear-gradient(-45deg,transparent 75%,#e2e8f0 75%)", backgroundSize:"16px 16px", backgroundPosition:"0 0,0 8px,8px -8px,-8px 0" } },
  { id:"white",    label:"White",       style:{ background:"#ffffff" } },
  { id:"black",    label:"Black",       style:{ background:"#000000" } },
  { id:"navy",     label:"Navy",        style:{ background:"#1a3a8f" } },
  { id:"green",    label:"Green",       style:{ background:"#16a34a" } },
  { id:"red",      label:"Red",         style:{ background:"#dc2626" } },
];

export default function BackgroundRemover() {
  const inputRef    = useRef(null);
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState(null); // original preview URL
  const [result,    setResult]    = useState(null); // { url, blob }
  const [status,    setStatus]    = useState("idle");
  const [error,     setError]     = useState("");
  const [dragging,  setDragging]  = useState(false);
  const [method,    setMethod]    = useState("canvas"); // canvas | api
  const [apiKey,    setApiKey]    = useState("");
  const [bgColor,   setBgColor]   = useState("checker");
  const [showApiKey,setShowApiKey]= useState(false);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setError("Please upload an image file (JPG, PNG, WebP)."); return; }
    if (f.size > 20*1024*1024)        { setError("File too large. Max 20 MB."); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null); setError(""); setStatus("idle");
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const removeBackground = async () => {
    if (!file) { setError("Please upload an image first."); return; }
    setStatus("processing"); setError(""); setResult(null);

    try {
      let blob;
      if (method === "api") {
        if (!apiKey.trim()) { setError("Please enter your remove.bg API key."); setStatus("idle"); return; }
        blob = await removeBgAPI(file, apiKey.trim());
      } else {
        blob = await canvasRemoveBG(file, bgColor);
      }

      const url = URL.createObjectURL(blob);
      setResult({ url, blob, name: file.name.replace(/\.[^.]+$/, "") + "-no-bg.png" });
      setStatus("done");
    } catch(e) {
      setError(e.message || "Failed to remove background. Please try again.");
      setStatus("error");
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url; a.download = result.name;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    if (result)  URL.revokeObjectURL(result.url);
    setFile(null); setPreview(null); setResult(null);
    setStatus("idle"); setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isDone    = status === "done";
  const isBusy    = status === "processing";
  const currentBg = BG_PREVIEW_COLORS.find(b => b.id === bgColor);

  return (
    <>
      <Helmet>
        <title>{"Free Background Remover — Remove Image Background Online | AIDLA"}</title>
        <meta name="description" content="Remove image background for free online. Download transparent PNG instantly. Works on photos, logos, products and portraits. 100% free, no sign-up needed." />
        <meta name="keywords" content="background remover free, remove background online, transparent background PNG, image background remover Pakistan, remove bg free" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.aidla.online/tools/image/background-remover" />
      </Helmet>
      <style>{`
        *{box-sizing:border-box;}
        .bg-drop{border:2px dashed #e2e8f0;border-radius:16px;padding:clamp(28px,7vw,52px) 20px;text-align:center;cursor:pointer;transition:all .2s;background:#fafafa;}
        .bg-drop.drag,.bg-drop:hover{border-color:#7c3aed;background:rgba(124,58,237,.04);}
        .bg-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start;}
        @media(max-width:580px){.bg-grid{grid-template-columns:1fr;}}
        .bg-colors{display:flex;flex-wrap:wrap;gap:7px;}
        .method-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .bg-spin{width:36px;height:36px;border:3px solid rgba(124,58,237,.15);border-top-color:#7c3aed;border-radius:50%;animation:bgspin .7s linear infinite;margin:0 auto 12px;}
        @keyframes bgspin{to{transform:rotate(360deg)}}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" }}>

        {/* Breadcrumb */}
        <div style={{ background:"#fff", borderBottom:"1px solid #f1f5f9", padding:"10px clamp(14px,4vw,24px)" }}>
          <div style={{ maxWidth:920, margin:"0 auto", fontSize:"clamp(10px,2.5vw,12px)", color:"#94a3b8", display:"flex", gap:6, flexWrap:"wrap" }}>
            <Link to="/tools" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Tools</Link><span>›</span>
            <Link to="/tools" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Image</Link><span>›</span>
            <span style={{ color:"#0f172a", fontWeight:600 }}>Background Remover</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#4c1d95,#7c3aed)", padding:"clamp(24px,5vw,40px) clamp(14px,4vw,24px)", textAlign:"center" }}>
          <div style={{ fontSize:"clamp(28px,7vw,40px)", marginBottom:10 }}>✂️</div>
          <h1 style={{ margin:"0 0 8px", fontSize:"clamp(1.4rem,5vw,2rem)", fontWeight:900, color:"#fff" }}>Background Remover</h1>
          <p style={{ margin:0, fontSize:"clamp(12px,3vw,15px)", color:"rgba(255,255,255,0.75)" }}>
            Remove image background · Download transparent PNG · Free & instant
          </p>
        </div>

        <div style={{ maxWidth:920, margin:"0 auto", padding:"clamp(16px,4vw,28px) clamp(14px,4vw,24px) 60px", width:"100%" }}>

          {/* Method selector */}
          <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,20px)", marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Removal Method</div>
            <div className="method-btns">
              <button onClick={()=>setMethod("canvas")}
                style={{ padding:"12px 10px", borderRadius:12, border:"1px solid", cursor:"pointer", textAlign:"left",
                  background:  method==="canvas" ? "rgba(124,58,237,.08)" : "#f8fafc",
                  color:       method==="canvas" ? "#7c3aed" : "#334155",
                  borderColor: method==="canvas" ? "#7c3aed" : "#e2e8f0",
                }}>
                <div style={{ fontWeight:800, fontSize:"clamp(12px,3vw,13px)", marginBottom:3 }}>🎨 Smart Canvas</div>
                <div style={{ fontSize:"clamp(9px,2vw,11px)", color:"#64748b", lineHeight:1.4 }}>Free · Works on solid color backgrounds (white, black, single color)</div>
              </button>
              <button onClick={()=>setMethod("api")}
                style={{ padding:"12px 10px", borderRadius:12, border:"1px solid", cursor:"pointer", textAlign:"left",
                  background:  method==="api" ? "rgba(124,58,237,.08)" : "#f8fafc",
                  color:       method==="api" ? "#7c3aed" : "#334155",
                  borderColor: method==="api" ? "#7c3aed" : "#e2e8f0",
                }}>
                <div style={{ fontWeight:800, fontSize:"clamp(12px,3vw,13px)", marginBottom:3 }}>🤖 AI Powered</div>
                <div style={{ fontSize:"clamp(9px,2vw,11px)", color:"#64748b", lineHeight:1.4 }}>Best quality · Requires free remove.bg API key</div>
              </button>
            </div>

            {/* API key input */}
            {method === "api" && (
              <div style={{ marginTop:12, background:"rgba(124,58,237,.05)", border:"1px solid rgba(124,58,237,.15)", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#4c1d95", marginBottom:8 }}>
                  🔑 remove.bg API Key
                  <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer"
                    style={{ marginLeft:8, fontSize:11, color:"#7c3aed", textDecoration:"none" }}>
                    Get free key →
                  </a>
                </div>
                <div style={{ position:"relative" }}>
                  <input
                    type={showApiKey?"text":"password"}
                    value={apiKey} onChange={e=>setApiKey(e.target.value)}
                    placeholder="Enter your remove.bg API key"
                    style={{ width:"100%", padding:"9px 44px 9px 12px", border:"1px solid rgba(124,58,237,.25)", borderRadius:9, fontSize:13, color:"#0f172a", outline:"none", boxSizing:"border-box" }}
                  />
                  <button onClick={()=>setShowApiKey(v=>!v)}
                    style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#94a3b8" }}>
                    {showApiKey?"🙈":"👁"}
                  </button>
                </div>
                <div style={{ fontSize:10, color:"#94a3b8", marginTop:5, lineHeight:1.5 }}>
                  Free tier: 50 images/month. Your key stays in your browser only — never sent to AIDLA servers.
                </div>
              </div>
            )}

            {/* BG hint for canvas */}
            {method === "canvas" && (
              <div style={{ marginTop:10, fontSize:11, color:"#64748b", background:"rgba(124,58,237,.04)", border:"1px solid rgba(124,58,237,.1)", borderRadius:8, padding:"8px 12px", lineHeight:1.6 }}>
                💡 <strong>Tips for best results:</strong> Works best on images with a plain white, black or single solid color background. For complex backgrounds (photos, gradients), use AI mode with a remove.bg key.
              </div>
            )}
          </div>

          <div className="bg-grid">
            {/* Upload */}
            <div>
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,20px)", marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Upload Image</div>
                <div className={`bg-drop${dragging?" drag":""}`}
                  onDrop={onDrop} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
                  onClick={()=>inputRef.current?.click()}>
                  <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" style={{ maxWidth:"100%", maxHeight:200, borderRadius:10, objectFit:"contain", marginBottom:8 }}/>
                      <div style={{ fontSize:11, color:"#94a3b8", marginBottom:6 }}>{file?.name} · {formatBytes(file?.size)}</div>
                      <button onClick={e=>{e.stopPropagation();reset();}}
                        style={{ padding:"4px 14px", fontSize:11, fontWeight:700, color:"#7c3aed", background:"rgba(124,58,237,.08)", border:"1px solid rgba(124,58,237,.2)", borderRadius:8, cursor:"pointer" }}>
                        ✕ Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize:"clamp(32px,8vw,48px)", marginBottom:10 }}>🖼️</div>
                      <div style={{ fontSize:"clamp(13px,3vw,15px)", fontWeight:700, color:"#334155", marginBottom:6 }}>Drop image or tap to browse</div>
                      <div style={{ fontSize:12, color:"#94a3b8" }}>JPG, PNG, WebP · Max 20 MB</div>
                    </>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ background:"rgba(220,38,38,.07)", border:"1px solid rgba(220,38,38,.2)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#dc2626", marginBottom:14, lineHeight:1.6 }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Remove button */}
              {!isDone && (
                <button onClick={removeBackground} disabled={isBusy||!file}
                  style={{ width:"100%", padding:"13px 0", background:"linear-gradient(135deg,#7c3aed,#8b5cf6)", color:"#fff", border:"none", borderRadius:12, fontWeight:800, fontSize:15, cursor:isBusy||!file?"not-allowed":"pointer", opacity:isBusy||!file?0.65:1 }}>
                  {isBusy ? "⏳ Removing Background…" : "✂️ Remove Background"}
                </button>
              )}

              {isDone && (
                <>
                  <button onClick={download}
                    style={{ width:"100%", padding:"13px 0", background:"linear-gradient(135deg,#16a34a,#22c55e)", color:"#fff", border:"none", borderRadius:12, fontWeight:800, fontSize:15, cursor:"pointer", marginBottom:10 }}>
                    ⬇ Download Transparent PNG
                  </button>
                  <button onClick={reset}
                    style={{ width:"100%", padding:"11px 0", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:12, fontWeight:700, fontSize:13, cursor:"pointer", color:"#475569" }}>
                    🔄 Remove Another Background
                  </button>
                </>
              )}
            </div>

            {/* Preview panel */}
            <div>
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,20px)", boxShadow:"0 1px 4px rgba(0,0,0,.04)", marginBottom:14 }}>
                <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Result Preview</div>

                {/* Background color picker */}
                <div style={{ marginBottom:10 }}>
                  <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginBottom:6 }}>Preview background:</div>
                  <div className="bg-colors">
                    {BG_PREVIEW_COLORS.map(b => (
                      <button key={b.id} onClick={()=>setBgColor(b.id)} title={b.label}
                        style={{ width:28, height:28, borderRadius:6, cursor:"pointer", flexShrink:0, border:`2px solid ${bgColor===b.id?"#7c3aed":"transparent"}`, boxShadow: bgColor===b.id?"0 0 0 1px #7c3aed":"0 1px 3px rgba(0,0,0,.12)", ...b.style }}>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview area */}
                <div style={{ borderRadius:12, overflow:"hidden", minHeight:200, display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid #f1f5f9", ...currentBg?.style }}>
                  {isBusy ? (
                    <div style={{ textAlign:"center", padding:32 }}>
                      <div className="bg-spin"/>
                      <div style={{ fontSize:13, fontWeight:600, color:"#64748b" }}>Removing background…</div>
                      <div style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>{method==="api"?"Using AI (remove.bg)…":"Analyzing image…"}</div>
                    </div>
                  ) : isDone && result ? (
                    <img src={result.url} alt="Result" style={{ maxWidth:"100%", maxHeight:280, objectFit:"contain" }}/>
                  ) : preview ? (
                    <img src={preview} alt="Original" style={{ maxWidth:"100%", maxHeight:280, objectFit:"contain", opacity:.5 }}/>
                  ) : (
                    <div style={{ textAlign:"center", padding:32, color:"#94a3b8" }}>
                      <div style={{ fontSize:36, marginBottom:8 }}>✂️</div>
                      <div style={{ fontSize:12, fontWeight:600 }}>Result will appear here</div>
                    </div>
                  )}
                </div>
                {isDone && (
                  <div style={{ marginTop:8, fontSize:11, color:"#64748b", textAlign:"center" }}>
                    ✅ Background removed · Transparent PNG ready
                  </div>
                )}
              </div>

              {/* Tips */}
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:14, padding:"14px 16px", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Use Cases</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {[
                    { icon:"🛍️", text:"Product photos for online shops" },
                    { icon:"🪪", text:"Profile pictures & ID photos" },
                    { icon:"🎨", text:"Logo & graphic design assets" },
                    { icon:"📄", text:"CV & document photos" },
                    { icon:"📱", text:"Social media posts & stories" },
                  ].map(u=>(
                    <div key={u.icon} style={{ display:"flex", gap:8, fontSize:"clamp(11px,2.5vw,12px)", color:"#475569", alignItems:"center" }}>
                      <span style={{ fontSize:14, flexShrink:0 }}>{u.icon}</span>
                      {u.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}