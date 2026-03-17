import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "../../components/footer";

// ── QR Library loader ─────────────────────────────────────
let qrLibPromise = null;
function loadQRLib() {
  if (qrLibPromise) return qrLibPromise;
  qrLibPromise = new Promise((resolve, reject) => {
    if (window.QRCode) { resolve(window.QRCode); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload  = () => window.QRCode ? resolve(window.QRCode) : reject(new Error("QRCode not found"));
    s.onerror = () => {
      const s2 = document.createElement("script");
      s2.src = "https://unpkg.com/qrcodejs@1.0.0/qrcode.min.js";
      s2.onload  = () => window.QRCode ? resolve(window.QRCode) : reject(new Error("Failed"));
      s2.onerror = () => reject(new Error("QR library could not load"));
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  });
  return qrLibPromise;
}

// ── Convert img element to canvas ────────────────────────
function imgToCanvas(img, size) {
  return new Promise((res, rej) => {
    const c   = document.createElement("canvas");
    c.width   = size; c.height = size;
    const ctx = c.getContext("2d");
    const i   = new Image();
    i.crossOrigin = "anonymous";
    i.onload  = () => { ctx.drawImage(i, 0, 0, size, size); res(c); };
    i.onerror = rej;
    i.src     = img.src;
  });
}

// ── Smart icon based on QR type + user input ─────────────
function getSmartIcon(type, input) {
  if (type === "whatsapp") return "💬";
  if (type === "email")    return "📧";
  if (type === "phone")    return "📞";
  if (type === "wifi")     return "📶";
  if (type === "text")     return "📝";
  // URL — detect common services
  const v = input.toLowerCase();
  if (v.includes("youtube.com") || v.includes("youtu.be")) return "▶️";
  if (v.includes("facebook.com"))  return "👍";
  if (v.includes("instagram.com")) return "📸";
  if (v.includes("twitter.com") || v.includes("x.com")) return "🐦";
  if (v.includes("linkedin.com"))  return "💼";
  if (v.includes("tiktok.com"))    return "🎵";
  if (v.includes("github.com"))    return "💻";
  if (v.includes("wa.me") || v.includes("whatsapp")) return "💬";
  if (v.includes("maps.google") || v.includes("goo.gl/maps")) return "📍";
  if (v.includes("play.google"))   return "▶";
  if (v.includes("apple.com"))     return "🍎";
  return "🔗"; // generic URL
}

// ── Icon picker options ───────────────────────────────────
const ICON_OPTIONS = [
  "🔗","📱","🌐","💬","📧","📞","📶","📝","💼","🛒",
  "🎵","📸","▶️","📍","💻","🏠","⭐","❤️","🎯","✅",
];

// ── Draw branded QR canvas ────────────────────────────────
async function drawBrandedQR({ rawCanvas, size, fgColor, showIcon, icon, showBar }) {
  const BAR_H = showBar ? Math.round(size * 0.10) : 0;
  const out   = document.createElement("canvas");
  out.width   = size;
  out.height  = size + BAR_H;
  const ctx   = out.getContext("2d");

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size + BAR_H);

  // Draw raw QR
  ctx.drawImage(rawCanvas, 0, 0, size, size);

  // Center icon overlay
  if (showIcon && icon) {
    const iconBoxSize = Math.round(size * 0.17);
    const ix = (size - iconBoxSize) / 2;
    const iy = (size - iconBoxSize) / 2;
    const pad = Math.round(iconBoxSize * 0.18);
    const bgSize = iconBoxSize + pad * 2;
    const bgX = ix - pad, bgY = iy - pad;
    const r = Math.round(bgSize * 0.22);

    // White rounded square
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(bgX + r, bgY);
    ctx.lineTo(bgX + bgSize - r, bgY);
    ctx.quadraticCurveTo(bgX + bgSize, bgY, bgX + bgSize, bgY + r);
    ctx.lineTo(bgX + bgSize, bgY + bgSize - r);
    ctx.quadraticCurveTo(bgX + bgSize, bgY + bgSize, bgX + bgSize - r, bgY + bgSize);
    ctx.lineTo(bgX + r, bgY + bgSize);
    ctx.quadraticCurveTo(bgX, bgY + bgSize, bgX, bgY + bgSize - r);
    ctx.lineTo(bgX, bgY + r);
    ctx.quadraticCurveTo(bgX, bgY, bgX + r, bgY);
    ctx.closePath();
    ctx.fill();

    // Thin border using QR color
    ctx.strokeStyle = fgColor + "33";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw emoji icon
    const emojiFontSize = Math.round(iconBoxSize * 0.72);
    ctx.font = `${emojiFontSize}px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText(icon, size / 2, size / 2);
  }

  // Bottom branding bar
  if (showBar) {
    // Solid bar using QR color
    ctx.fillStyle = fgColor;
    ctx.fillRect(0, size, size, BAR_H);

    const textY    = size + BAR_H / 2;
    const fontSize = Math.round(BAR_H * 0.40);

    // Left: small scan hint
    ctx.fillStyle    = "rgba(255,255,255,0.7)";
    ctx.font         = `600 ${Math.round(fontSize * 0.85)}px 'Inter', Arial, sans-serif`;
    ctx.textAlign    = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Scan me 📱", Math.round(size * 0.04), textY);

    // Right: tool link
    ctx.fillStyle    = "rgba(255,255,255,0.9)";
    ctx.font         = `700 ${fontSize}px 'Inter', Arial, sans-serif`;
    ctx.textAlign    = "right";
    ctx.fillText("aidla.online/tools", size - Math.round(size * 0.04), textY);
  }

  return out;
}

// ── Constants ─────────────────────────────────────────────
const QR_TYPES = [
  { id:"url",      label:"🔗 URL",      placeholder:"https://www.aidla.online" },
  { id:"text",     label:"📝 Text",     placeholder:"Type any text…" },
  { id:"whatsapp", label:"💬 WhatsApp", placeholder:"923001234567" },
  { id:"email",    label:"📧 Email",    placeholder:"you@example.com" },
  { id:"phone",    label:"📞 Phone",    placeholder:"+92 300 1234567" },
  { id:"wifi",     label:"📶 WiFi",     placeholder:"WiFi network name" },
];
const QR_SIZES  = [128, 200, 256, 300, 400];
const QR_COLORS = [
  "#1a3a8f","#000000","#dc2626","#166534",
  "#7c3aed","#0284c7","#d97706","#0f172a","#db2777",
];

function buildValue(type, input, wifiPass) {
  switch (type) {
    case "url":      return /^https?:\/\//i.test(input) ? input : `https://${input}`;
    case "whatsapp": return `https://wa.me/${input.replace(/\D/g,"")}`;
    case "email":    return `mailto:${input.trim()}`;
    case "phone":    return `tel:${input.replace(/\s/g,"")}`;
    case "wifi":     return `WIFI:T:WPA;S:${input};P:${wifiPass};H:false;;`;
    default:         return input;
  }
}

// ─────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────
export default function QRCodeGenerator() {
  const rawDivRef  = useRef(null);   // hidden — QRCodeJS renders here
  const previewRef = useRef(null);   // visible canvas preview
  const finalRef   = useRef(null);   // branded canvas for download

  const [type,       setType]       = useState("url");
  const [input,      setInput]      = useState("");
  const [wifiPass,   setWifiPass]   = useState("");
  const [size,       setSize]       = useState(256);
  const [fgColor,    setFgColor]    = useState("#1a3a8f");
  const [status,     setStatus]     = useState("idle");
  const [errorMsg,   setErrorMsg]   = useState("");
  const [libReady,   setLibReady]   = useState(false);
  const [copied,     setCopied]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Branding state
  const [showIcon,  setShowIcon]  = useState(true);   // center icon — ON by default
  const [showBar,   setShowBar]   = useState(true);   // bottom bar — ON by default
  const [icon,      setIcon]      = useState("🔗");   // current center icon

  const isDone    = status === "done";
  const isLoading = status === "loading";

  // Auto-set smart icon when type or input changes
  useEffect(() => {
    setIcon(getSmartIcon(type, input));
  }, [type, input]);

  // Load QR library
  useEffect(() => {
    loadQRLib()
      .then(() => setLibReady(true))
      .catch(e => setErrorMsg("Could not load QR library. " + e.message));
  }, []);

  // ── Generate ──────────────────────────────────────────
  const generate = useCallback(async () => {
    setErrorMsg("");
    if (!input.trim()) { setErrorMsg("Please enter a value first."); return; }
    if (!rawDivRef.current) return;

    setStatus("loading");
    setShowPicker(false);

    try {
      const QRCode = await loadQRLib();

      // Clear previous
      rawDivRef.current.innerHTML = "";

      new QRCode(rawDivRef.current, {
        text:         buildValue(type, input.trim(), wifiPass),
        width:        size,
        height:       size,
        colorDark:    fgColor,
        colorLight:   "#ffffff",
        correctLevel: QRCode.CorrectLevel?.H ?? 3,
      });

      await new Promise(r => setTimeout(r, 350));

      let rawCanvas = rawDivRef.current.querySelector("canvas");
      if (!rawCanvas) {
        const img = rawDivRef.current.querySelector("img");
        if (!img) throw new Error("QR did not render. Please try again.");
        rawCanvas = await imgToCanvas(img, size);
      }

      const branded = await drawBrandedQR({
        rawCanvas, size, fgColor,
        showIcon, icon, showBar,
      });

      finalRef.current = branded;

      if (previewRef.current) {
        previewRef.current.width  = branded.width;
        previewRef.current.height = branded.height;
        previewRef.current.getContext("2d").drawImage(branded, 0, 0);
      }

      setStatus("done");
    } catch (e) {
      setErrorMsg("Failed: " + e.message);
      setStatus("error");
    }
  }, [type, input, wifiPass, size, fgColor, showIcon, icon, showBar]);

  // Re-render when branding options change
  useEffect(() => {
    if (status === "done") generate();
  }, [showIcon, icon, showBar, fgColor]);

  // ── Download ──────────────────────────────────────────
  const download = useCallback(() => {
    const c = finalRef.current;
    if (!c) { setErrorMsg("Generate a QR code first."); return; }
    const a = document.createElement("a");
    a.href     = c.toDataURL("image/png");
    a.download = `qr-${type}-aidla.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [type]);

  // ── Save ──────────────────────────────────────────────
  const save = useCallback(() => {
    download();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [download]);

  // ── Share ─────────────────────────────────────────────
  const share = useCallback(async () => {
    const toolUrl  = "https://www.aidla.online/tools/utility/qr-code-generator";
    const shareMsg = `Hey! 👋 I found this awesome FREE QR Code Generator tool — you can generate QR codes for any URL, WhatsApp, WiFi, email and more in seconds. No sign-up needed!\n\nCheck it out 👉 ${toolUrl}`;
    const c = finalRef.current;

    // Try native share with image
    if (c && navigator.canShare) {
      try {
        const blob = await new Promise(res => c.toBlob(res, "image/png"));
        const file = new File([blob], "qr-code.png", { type:"image/png" });
        if (navigator.canShare({ files:[file] })) {
          await navigator.share({ files:[file], title:"Free QR Code Generator — AIDLA", text:shareMsg });
          return;
        }
      } catch {}
    }

    // Fallback — native share without image
    if (navigator.share) {
      try {
        await navigator.share({ title:"Free QR Code Generator — AIDLA", text:shareMsg, url:toolUrl });
        return;
      } catch {}
    }

    // Fallback — copy message to clipboard
    try {
      await navigator.clipboard.writeText(shareMsg);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setErrorMsg("Sharing not supported. Please copy the link manually.");
    }
  }, []);

  // ── Copy tool link ────────────────────────────────────
  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("https://www.aidla.online/tools/utility/qr-code-generator");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { setErrorMsg("Could not copy."); }
  }, []);

  const currentType = QR_TYPES.find(t => t.id === type);

  return (
    <>
      <Helmet>
        <title>{"Free QR Code Generator — URL, WhatsApp, WiFi, Email | AIDLA"}</title>
        <meta name="description" content="Generate free QR codes for URLs, WhatsApp, WiFi, email, phone and text. Smart center icon, custom color, download PNG, share. No sign-up needed." />
        <meta name="keywords" content="free QR code generator, QR code maker online, WhatsApp QR code, WiFi QR code, URL QR code Pakistan, download QR PNG" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.aidla.online/tools/utility/qr-code-generator" />
      </Helmet>

      <style>{`
        * { box-sizing: border-box; }
        .qr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
        @media (max-width: 660px) { .qr-grid { grid-template-columns: 1fr; } }
        .qr-types { display: grid; grid-template-columns: repeat(2,1fr); gap: 7px; }
        .qr-act { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
        .qr-act2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
        @media (max-width: 340px) { .qr-act, .qr-act2 { grid-template-columns: 1fr; } }
        .icon-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f8fafc; }
        .toggle-row:last-child { border-bottom: none; padding-bottom: 0; }
        .tog { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
        .tog input { opacity: 0; width: 0; height: 0; }
        .tog-slider { position: absolute; inset: 0; background: #e2e8f0; border-radius: 22px; cursor: pointer; transition: background .2s; }
        .tog-slider:before { content:''; position: absolute; width: 16px; height: 16px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.15); }
        .tog input:checked + .tog-slider { background: #1a3a8f; }
        .tog input:checked + .tog-slider:before { transform: translateX(18px); }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif", overflowX:"hidden" }}>

        {/* Breadcrumb */}
        <div style={{ background:"#fff", borderBottom:"1px solid #f1f5f9", padding:"10px clamp(14px,4vw,24px)" }}>
          <div style={{ maxWidth:920, margin:"0 auto", fontSize:"clamp(10px,2.5vw,12px)", color:"#94a3b8", display:"flex", gap:6, flexWrap:"wrap" }}>
            <Link to="/tools" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Tools</Link>
            <span>›</span>
            <span style={{ color:"#0f172a", fontWeight:600 }}>QR Code Generator</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#0b1437,#1a3a8f)", padding:"clamp(24px,5vw,40px) clamp(14px,4vw,24px)", textAlign:"center" }}>
          <div style={{ fontSize:"clamp(28px,7vw,40px)", marginBottom:10 }}>📱</div>
          <h1 style={{ margin:"0 0 8px", fontSize:"clamp(1.4rem,5vw,2rem)", fontWeight:900, color:"#fff" }}>Free QR Code Generator</h1>
          <p style={{ margin:0, fontSize:"clamp(12px,3vw,15px)", color:"rgba(255,255,255,0.72)" }}>
            Smart icon · Custom color · Download & Share · No sign-up
          </p>
        </div>

        <div style={{ maxWidth:920, margin:"0 auto", padding:"clamp(16px,4vw,28px) clamp(14px,4vw,24px) 60px", width:"100%" }}>
          <div className="qr-grid">

            {/* ── LEFT ── */}
            <div>

              {/* Type */}
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,18px)", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>QR Code Type</div>
                <div className="qr-types">
                  {QR_TYPES.map(t => (
                    <button key={t.id}
                      onClick={() => { setType(t.id); setStatus("idle"); setInput(""); setErrorMsg(""); }}
                      style={{ padding:"9px 8px", borderRadius:10, border:"1px solid", fontSize:"clamp(10px,2.5vw,13px)", fontWeight:600, cursor:"pointer", textAlign:"left",
                        background:  type===t.id ? "linear-gradient(135deg,#1a3a8f,#3b82f6)" : "#f8fafc",
                        color:       type===t.id ? "#fff" : "#334155",
                        borderColor: type===t.id ? "#1a3a8f" : "#e2e8f0",
                      }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,18px)", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
                  {currentType?.label}
                </div>
                <input
                  style={{ width:"100%", padding:"11px 14px", border:"1px solid #e2e8f0", borderRadius:10, fontSize:14, color:"#0f172a", outline:"none", boxSizing:"border-box" }}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && generate()}
                  placeholder={currentType?.placeholder}
                />
                {type === "wifi" && (
                  <input type="password"
                    style={{ width:"100%", padding:"11px 14px", border:"1px solid #e2e8f0", borderRadius:10, fontSize:14, color:"#0f172a", outline:"none", boxSizing:"border-box", marginTop:8 }}
                    value={wifiPass} onChange={e=>setWifiPass(e.target.value)} placeholder="WiFi Password"
                  />
                )}
              </div>

              {/* Size + Color */}
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,18px)", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Size</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                  {QR_SIZES.map(s => (
                    <button key={s} onClick={() => { setSize(s); setStatus("idle"); }}
                      style={{ padding:"5px 13px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer", border:"1px solid",
                        background:  size===s ? "#1a3a8f" : "#f8fafc",
                        color:       size===s ? "#fff"    : "#475569",
                        borderColor: size===s ? "#1a3a8f" : "#e2e8f0",
                      }}>
                      {s}px
                    </button>
                  ))}
                </div>
                <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Color</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
                  {QR_COLORS.map(c => (
                    <button key={c} onClick={() => setFgColor(c)}
                      style={{ width:28, height:28, borderRadius:"50%", background:c, cursor:"pointer", padding:0, flexShrink:0,
                        border:`3px solid ${fgColor===c?"#3b82f6":"transparent"}`,
                        boxShadow: fgColor===c?"0 0 0 1px #3b82f6":"0 1px 3px rgba(0,0,0,.15)",
                      }}
                    />
                  ))}
                  <div style={{ position:"relative", width:28, height:28, borderRadius:"50%", overflow:"hidden", cursor:"pointer", background:"conic-gradient(red,yellow,lime,aqua,blue,magenta,red)", border:"2px solid #e2e8f0", flexShrink:0 }}>
                    <input type="color" value={fgColor} onChange={e=>setFgColor(e.target.value)}
                      style={{ position:"absolute", inset:"-4px", opacity:0, cursor:"pointer", width:"200%", height:"200%" }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Branding / Icon settings ── */}
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,18px)", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>
                  ✨ Customization
                </div>

                {/* Toggle: Center Icon */}
                <div className="toggle-row">
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>Center Icon</div>
                    <div style={{ fontSize:11, color:"#94a3b8" }}>
                      Auto-detected: <strong>{icon}</strong>
                      {input && ` (${type === "url" ? "URL" : currentType?.label})`}
                    </div>
                  </div>
                  <label className="tog">
                    <input type="checkbox" checked={showIcon} onChange={e=>setShowIcon(e.target.checked)}/>
                    <span className="tog-slider"/>
                  </label>
                </div>

                {/* Icon picker */}
                {showIcon && (
                  <div style={{ marginBottom:10 }}>
                    <button onClick={() => setShowPicker(v=>!v)}
                      style={{ fontSize:12, fontWeight:600, color:"#1a3a8f", background:"rgba(26,58,143,.07)", border:"1px solid rgba(26,58,143,.15)", borderRadius:8, padding:"5px 12px", cursor:"pointer", marginTop:6 }}>
                      {showPicker ? "▲ Close picker" : "🎨 Change icon"}
                    </button>
                    {showPicker && (
                      <div className="icon-grid">
                        {ICON_OPTIONS.map(em => (
                          <button key={em} onClick={() => { setIcon(em); setShowPicker(false); }}
                            style={{ width:36, height:36, borderRadius:8, border:"1px solid", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                              background:  icon===em ? "rgba(26,58,143,.1)" : "#f8fafc",
                              borderColor: icon===em ? "#1a3a8f" : "#e2e8f0",
                            }}>
                            {em}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Toggle: Bottom bar */}
                <div className="toggle-row">
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>Bottom Bar</div>
                    <div style={{ fontSize:11, color:"#94a3b8" }}>Shows "Scan me 📱  aidla.online/tools"</div>
                  </div>
                  <label className="tog">
                    <input type="checkbox" checked={showBar} onChange={e=>setShowBar(e.target.checked)}/>
                    <span className="tog-slider"/>
                  </label>
                </div>
              </div>

              {/* Error */}
              {errorMsg && (
                <div style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#dc2626", marginBottom:12, lineHeight:1.6 }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Generate */}
              <button
                onClick={generate} disabled={isLoading}
                style={{ width:"100%", padding:"13px 0", background:"linear-gradient(135deg,#1a3a8f,#3b82f6)", color:"#fff", border:"none", borderRadius:12, fontWeight:800, fontSize:15, cursor:isLoading?"not-allowed":"pointer", opacity:isLoading?0.7:1 }}>
                {isLoading ? "⏳ Generating…" : libReady ? "✨ Generate QR Code" : "⏳ Loading…"}
              </button>
            </div>

            {/* ── RIGHT: Preview ── */}
            <div>
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,20px)", boxShadow:"0 1px 4px rgba(0,0,0,.04)", marginBottom:12 }}>
                <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>Preview</div>

                {/* Empty state */}
                {status === "idle" && (
                  <div style={{ textAlign:"center", padding:"clamp(24px,6vw,48px) 20px", color:"#94a3b8" }}>
                    <div style={{ fontSize:"clamp(40px,10vw,60px)", marginBottom:10 }}>📱</div>
                    <div style={{ fontSize:13, fontWeight:600, marginBottom:5 }}>QR code appears here</div>
                    <div style={{ fontSize:11, lineHeight:1.6 }}>Fill in details and click Generate</div>
                  </div>
                )}

                {/* Loading */}
                {isLoading && (
                  <div style={{ textAlign:"center", padding:"48px 20px", color:"#94a3b8" }}>
                    <div style={{ width:36, height:36, border:"3px solid rgba(26,58,143,.15)", borderTopColor:"#1a3a8f", borderRadius:"50%", animation:"qrspin .7s linear infinite", margin:"0 auto 12px" }}/>
                    <div style={{ fontSize:13, fontWeight:600 }}>Generating…</div>
                    <style>{`@keyframes qrspin{to{transform:rotate(360deg)}}`}</style>
                  </div>
                )}

                {/* Preview canvas */}
                <div style={{ display: isDone ? "flex" : "none", flexDirection:"column", alignItems:"center", gap:8 }}>
                  <canvas ref={previewRef}
                    style={{ maxWidth:"100%", borderRadius:10, border:"1px solid #f1f5f9", boxShadow:"0 2px 12px rgba(0,0,0,.07)" }}
                  />
                  <div style={{ fontSize:11, color:"#94a3b8" }}>{size}×{size + (showBar ? Math.round(size * 0.10) : 0)}px · PNG</div>
                </div>
              </div>

              {/* Action buttons */}
              {isDone && (
                <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"clamp(14px,3vw,18px)", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                  <div style={{ fontSize:"clamp(10px,2.5vw,11px)", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Actions</div>

                  {/* Download + Save */}
                  <div className="qr-act">
                    <button onClick={download}
                      style={{ padding:"12px 0", background:"linear-gradient(135deg,#16a34a,#22c55e)", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:"clamp(12px,3vw,13px)", cursor:"pointer" }}>
                      ⬇ Download PNG
                    </button>
                    <button onClick={save}
                      style={{ padding:"12px 0", background: saved?"rgba(22,163,74,.08)":"rgba(26,58,143,.07)", color: saved?"#15803d":"#1a3a8f", border:`1px solid ${saved?"rgba(22,163,74,.25)":"rgba(26,58,143,.2)"}`, borderRadius:10, fontWeight:700, fontSize:"clamp(12px,3vw,13px)", cursor:"pointer", transition:"all .2s" }}>
                      {saved ? "✅ Saved!" : "💾 Save"}
                    </button>
                  </div>

                  {/* Share + Copy */}
                  <div className="qr-act2">
                    <button onClick={share}
                      style={{ padding:"11px 0", background:"linear-gradient(135deg,#0b1437,#1a3a8f)", color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:"clamp(11px,2.5vw,13px)", cursor:"pointer" }}>
                      📤 Share Tool
                    </button>
                    <button onClick={copyLink}
                      style={{ padding:"11px 0", background: copied?"rgba(22,163,74,.07)":"#f8fafc", color: copied?"#15803d":"#475569", border:`1px solid ${copied?"rgba(22,163,74,.25)":"#e2e8f0"}`, borderRadius:10, fontWeight:700, fontSize:"clamp(11px,2.5vw,13px)", cursor:"pointer", transition:"all .2s" }}>
                      {copied ? "✅ Copied!" : "🔗 Copy Link"}
                    </button>
                  </div>

                </div>
              )}

              {/* Feature pills */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
                {[
                  { icon:"🔒", title:"100% Private", desc:"Browser-only. Nothing uploaded." },
                  { icon:"⚡", title:"Instant",      desc:"Ready in under 1 second." },
                  { icon:"🎨", title:"Smart Icon",   desc:"Auto-detects WhatsApp, URL etc." },
                  { icon:"🆓", title:"Free Forever", desc:"No sign-up, no watermarks." },
                ].map(f => (
                  <div key={f.title} style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:12, padding:"11px 13px", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                    <div style={{ fontSize:18, marginBottom:4 }}>{f.icon}</div>
                    <div style={{ fontSize:"clamp(11px,2.5vw,12px)", fontWeight:700, color:"#0b1437", marginBottom:2 }}>{f.title}</div>
                    <div style={{ fontSize:"clamp(9px,2vw,11px)", color:"#64748b", lineHeight:1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hidden div for QRCodeJS to render into */}
          <div ref={rawDivRef} style={{ position:"absolute", left:"-9999px", top:"-9999px", visibility:"hidden" }}/>
        </div>
        <Footer />
      </div>
    </>
  );
}