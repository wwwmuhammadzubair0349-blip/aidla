import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async"; // or "react-helmet-async"
import Footer from "../../components/footer"; // adjust path if needed
import "./jpg-to-png.css"; // external CSS

// ─── Utility functions (unchanged) ───────────────────────────────
function safeBaseName(name) {
  const base = String(name || "image")
    .replace(/\.(jpg|jpeg|png|webp|gif|bmp)$/i, "")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .trim();
  return (base || "image").slice(0, 120);
}

function bytes(n) {
  if (!Number.isFinite(n)) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0, v = n;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i += 1; }
  return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

async function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Failed to read file"));
    r.readAsDataURL(file);
  });
}

async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload   = () => resolve(img);
    img.onerror  = () => reject(new Error("Failed to load image"));
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}

function isJpg(file) {
  const n = file?.name?.toLowerCase?.() || "";
  const t = file?.type || "";
  return n.endsWith(".jpg") || n.endsWith(".jpeg") || t === "image/jpeg";
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

// ─── Main Component ───────────────────────────────────────────────
export default function JpgToPng() {
  const inputRef    = useRef(null);
  const addMoreRef  = useRef(null);

  const [busy,      setBusy]      = useState(false);
  const [msg,       setMsg]       = useState("");
  const [msgType,   setMsgType]   = useState("info");
  const [dzActive,  setDzActive]  = useState(false);

  const [items,     setItems]     = useState([]);
  const [bgMode,    setBgMode]    = useState("white");
  const [bgCustom,  setBgCustom]  = useState("#ffffff");
  const [keepSize]                = useState(true); // always true, display only

  const showMsg = (t, type = "info") => { setMsg(t); setMsgType(type); };

  const bgColor = bgMode === "custom" ? bgCustom : (bgMode === "black" ? "#000000" : "#ffffff");

  const totalInSize  = useMemo(() => items.reduce((a, it) => a + (it.file?.size  || 0), 0), [items]);
  const totalOutSize = useMemo(() => items.reduce((a, it) => a + (it.outSize     || 0), 0), [items]);
  const convertedCount = items.filter(it => it.outBlob).length;

  // ── Add files ──
  const addFiles = async (fileList) => {
    const files    = Array.from(fileList || []);
    const onlyJpg  = files.filter(isJpg);
    const rejected = files.length - onlyJpg.length;
    if (!onlyJpg.length) return showMsg("Please upload JPG/JPEG images only.", "error");

    setBusy(true); showMsg("", "info");
    try {
      const newOnes = [];
      for (const f of onlyJpg) {
        const src = await fileToDataURL(f);
        const img = await loadImage(src);
        newOnes.push({
          id: `${f.name}-${f.size}-${f.lastModified}`,
          file: f, src,
          w: img.naturalWidth, h: img.naturalHeight,
          outBlob: null, outUrl: "", outSize: 0,
        });
      }
      setItems(prev => {
        const seen = new Set(prev.map(x => x.id));
        const merged = [...prev];
        for (const it of newOnes) if (!seen.has(it.id)) merged.push(it);
        return merged;
      });
      showMsg(rejected
        ? `Loaded ✅  (Ignored ${rejected} non-JPG file${rejected > 1 ? "s" : ""})`
        : `Added ${onlyJpg.length} image${onlyJpg.length !== 1 ? "s" : ""} ✅`,
        "success");
    } catch (e) {
      showMsg(e?.message || "Failed to read images.", "error");
    } finally {
      setBusy(false);
      if (inputRef.current)   inputRef.current.value   = "";
      if (addMoreRef.current) addMoreRef.current.value = "";
    }
  };

  const onDrop = async (e) => {
    e.preventDefault(); e.stopPropagation(); setDzActive(false);
    await addFiles(e.dataTransfer?.files);
  };

  const clearAll = () => {
    items.forEach(it => { if (it.outUrl) URL.revokeObjectURL(it.outUrl); });
    setItems([]); showMsg("Cleared ✅", "success");
  };

  // ── Convert ──
  const convertOne = async (it) => {
    const img    = await loadImage(it.src);
    const canvas = document.createElement("canvas");
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Canvas not supported in this browser.");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(res => canvas.toBlob(b => res(b), "image/png", 1));
    if (!blob) throw new Error("Failed to export PNG.");
    return { blob, outUrl: URL.createObjectURL(blob), outSize: blob.size };
  };

  const convertAll = async () => {
    if (!items.length) return showMsg("Upload JPG files first.", "error");
    setBusy(true); showMsg("Converting…", "info");
    try {
      items.forEach(it => { if (it.outUrl) URL.revokeObjectURL(it.outUrl); });
      const next = [];
      for (const it of items) {
        const { blob, outUrl, outSize } = await convertOne(it);
        next.push({ ...it, outBlob: blob, outUrl, outSize });
      }
      setItems(next);
      showMsg(`Converted ${next.length} image${next.length !== 1 ? "s" : ""} ✅`, "success");
    } catch (e) {
      showMsg(e?.message || "Conversion failed.", "error");
    } finally { setBusy(false); }
  };

  const downloadOne = (it) => {
    if (!it.outBlob) return showMsg("Convert first.", "error");
    downloadBlob(it.outBlob, `${safeBaseName(it.file?.name)}.png`);
  };

  const downloadAll = () => {
    const ready = items.filter(it => it.outBlob);
    if (!ready.length) return showMsg("Convert first.", "error");
    ready.forEach((it, idx) => setTimeout(() => downloadOne(it), idx * 350));
    showMsg(`Downloading ${ready.length} file${ready.length !== 1 ? "s" : ""}… ✅`, "success");
  };

  const removeOne = (id) => {
    setItems(prev => {
      const rem = prev.find(it => it.id === id);
      if (rem?.outUrl) URL.revokeObjectURL(rem.outUrl);
      return prev.filter(it => it.id !== id);
    });
  };

  // Canonical URL – adjust as needed
  const canonicalUrl = "https://www.aidla.online/tools/image/jpg-to-png";

  return (
    <>
      <Helmet>
        <title>JPG to PNG Converter – Free Online Image Converter | AIDLA</title>
        <meta
          name="description"
          content="Convert JPG/JPEG images to PNG losslessly in your browser. Batch convert, custom background, 100% private. No upload, no sign-up."
        />
        <meta
          name="keywords"
          content="JPG to PNG, image converter, convert JPEG to PNG, lossless PNG, batch image conversion, AIDLA"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content="JPG to PNG Converter – AIDLA" />
        <meta property="og:description" content="Convert JPG to PNG instantly in your browser – private, free, and batch support." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.aidla.online/og-jpg-to-png.jpg" />
        <meta property="og:site_name" content="AIDLA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JPG to PNG Converter by AIDLA" />
        <meta name="twitter:description" content="Free, private, browser‑based JPG to PNG converter." />
        <meta name="twitter:image" content="https://www.aidla.online/twitter-jpg-to-png.jpg" />

        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="j2p-root">
        <div className="j2p-orbs">
          <div className="j2p-orb j2p-orb1"/>
          <div className="j2p-orb j2p-orb2"/>
          <div className="j2p-orb j2p-orb3"/>
        </div>

        <div className="j2p-wrap">

          {/* ── Hero ── */}
          <motion.div className="j2p-hero" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
            <span className="j2p-badge">🖼️ Image Tool</span>
            <h1 className="j2p-title">
              JPG <span className="j2p-title-acc">→ PNG</span>
            </h1>
            <p className="j2p-sub">Convert JPG/JPEG to lossless PNG instantly in your browser — nothing uploaded to any server.</p>
          </motion.div>

          <motion.div className="j2p-pills" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
            {["✓ Lossless PNG","✓ Batch convert","✓ Custom background","✓ Same dimensions","✓ 100% private"].map(p => (
              <span className="j2p-pill" key={p}>{p}</span>
            ))}
          </motion.div>

          {/* ── Toast ── */}
          <AnimatePresence>
            {msg && (
              <motion.div
                className={`j2p-toast ${msgType}`}
                initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
              >
                <span>{msg}</span>
                <button className="j2p-toast-close" onClick={() => setMsg("")}>×</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Drop zone ── */}
          <motion.div className="j2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}>
            <div
              className={`j2p-dz${dzActive ? " on" : ""}`}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDzActive(true); }}
              onDragLeave={() => setDzActive(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
              aria-label="Upload JPG images"
            >
              <input ref={inputRef} type="file" accept="image/jpeg,.jpg,.jpeg" multiple
                onChange={e => addFiles(e.target.files)} style={{ display:"none" }} />
              <span className="j2p-dz-icon">{dzActive ? "📥" : "🖼️"}</span>
              <p className="j2p-dz-title">{dzActive ? "Drop images here!" : "Drag & drop or tap to browse"}</p>
              <p className="j2p-dz-sub">JPG / JPEG only · multiple files welcome</p>
            </div>

            {items.length > 0 && (
              <div className="j2p-stats">
                <div className="j2p-stat g">🖼 {items.length} file{items.length !== 1 ? "s" : ""}</div>
                <div className="j2p-stat-div"/>
                <div className="j2p-stat">{bytes(totalInSize)}</div>
                {convertedCount > 0 && <>
                  <div className="j2p-stat-div"/>
                  <div className="j2p-stat g">✅ {convertedCount} converted · {bytes(totalOutSize)}</div>
                </>}
              </div>
            )}
          </motion.div>

          {/* ── Settings ── */}
          <motion.div className="j2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.17 }}>
            <div className="j2p-card-title">⚙️ Options</div>
            <div className="j2p-settings">

              <div className="j2p-field">
                <label>Background</label>
                <div className="j2p-toggle">
                  {[["white","⬜ White"],["black","⬛ Black"],["custom","🎨 Custom"]].map(([k, lbl]) => (
                    <button key={k}
                      className={`j2p-tog-btn${bgMode === k ? " active" : ""}`}
                      onClick={() => setBgMode(k)} disabled={busy}>
                      {lbl}
                    </button>
                  ))}
                </div>
                {bgMode === "custom" && (
                  <div className="j2p-color-row">
                    <input type="color" value={bgCustom}
                      onChange={e => setBgCustom(e.target.value)}
                      disabled={busy} className="j2p-color-input" />
                    <span className="j2p-color-hex">{bgCustom.toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="j2p-field">
                <label>Quality</label>
                <p className="j2p-field-note">PNG output is <strong>lossless</strong>. Full quality preserved, no compression artefacts.</p>
              </div>

              <div className="j2p-field">
                <label>Dimensions</label>
                <p className="j2p-field-note">Output keeps the <strong>exact same resolution</strong> as the original JPG.</p>
              </div>
            </div>
          </motion.div>

          {/* ── Image grid ── */}
          <motion.div className="j2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.21 }}>
            <div className="j2p-card-title">
              🖼️ Images
              <span style={{ marginLeft:"auto", fontSize:"0.68rem", fontWeight:600, color:"#94a3b8", fontFamily:"DM Sans" }}>
                {items.length > 0 ? `${items.length} file${items.length !== 1 ? "s" : ""}` : "None yet"}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="j2p-empty">
                <span className="j2p-empty-icon">🖼️</span>
                <p className="j2p-empty-text">No images added yet. Drop some JPGs above to get started.</p>
              </div>
            ) : (
              <>
                <div className="j2p-grid">
                  <AnimatePresence>
                    {items.map(it => (
                      <motion.div key={it.id} className="j2p-img-card"
                        layout
                        initial={{ opacity:0, scale:0.9 }}
                        animate={{ opacity:1, scale:1 }}
                        exit={{ opacity:0, scale:0.85 }}
                        transition={{ duration:0.2 }}
                      >
                        {/* Before / after preview */}
                        <div className="j2p-preview-halves">
                          <div className="j2p-preview-half" style={{ background:"#f8fafc" }}>
                            <div className="j2p-preview-label">JPG</div>
                            <div className="j2p-preview-img-wrap">
                              <img src={it.src} alt={it.file?.name} />
                            </div>
                          </div>
                          <div className="j2p-preview-half" style={{ background: bgColor }}>
                            <div className="j2p-preview-label">PNG</div>
                            <div className="j2p-preview-img-wrap">
                              {it.outUrl
                                ? <img src={it.outUrl} alt="converted" />
                                : <div className="j2p-preview-placeholder">
                                    <span className="j2p-preview-placeholder-icon">🖼️</span>
                                    <span className="j2p-preview-placeholder-text">Convert<br/>to preview</span>
                                  </div>
                              }
                            </div>
                          </div>
                        </div>

                        <div className="j2p-img-info">
                          <div className="j2p-img-name" title={it.file?.name}>{it.file?.name}</div>
                          <div className="j2p-img-meta">
                            {it.w}×{it.h} · {bytes(it.file?.size)}
                            {it.outSize ? ` → ${bytes(it.outSize)}` : ""}
                          </div>
                        </div>

                        <div className="j2p-img-actions">
                          <button className="j2p-btn-sm j2p-btn-dl"
                            onClick={() => downloadOne(it)}
                            disabled={!it.outBlob || busy}>
                            ⬇ Download
                          </button>
                          <button className="j2p-btn-rm"
                            onClick={() => removeOne(it.id)}
                            disabled={busy} title="Remove">
                            ✕
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add more */}
                <div style={{ marginTop:12, display:"flex", justifyContent:"flex-end" }}>
                  <input ref={addMoreRef} type="file" accept="image/jpeg,.jpg,.jpeg" multiple
                    onChange={e => addFiles(e.target.files)} style={{ display:"none" }} />
                  <button
                    onClick={() => addMoreRef.current?.click()} disabled={busy}
                    style={{ padding:"7px 16px", borderRadius:30, border:"1px dashed rgba(59,130,246,0.3)", background:"rgba(59,130,246,0.04)", color:"var(--royal)", fontFamily:"DM Sans,sans-serif", fontWeight:700, fontSize:"clamp(0.75rem,3vw,0.82rem)", cursor:"pointer", transition:"0.15s" }}
                  >
                    ➕ Add more
                  </button>
                </div>
              </>
            )}

            {/* ── Inline action bar ── */}
            <div className="j2p-action">
              <div className="j2p-action-info">
                <span className="j2p-action-label">Ready to convert</span>
                <span className="j2p-action-value">
                  {items.length} file{items.length !== 1 ? "s" : ""} · {bgMode === "custom" ? bgCustom.toUpperCase() : bgMode.charAt(0).toUpperCase() + bgMode.slice(1)} bg
                  {totalInSize > 0 && ` · ${bytes(totalInSize)}`}
                </span>
              </div>
              <div className="j2p-action-btns">
                <button className="j2p-btn j2p-btn-danger" onClick={clearAll} disabled={busy || !items.length}>
                  Clear
                </button>
                <button className="j2p-btn j2p-btn-ghost" onClick={downloadAll} disabled={busy || !items.some(x => x.outBlob)}>
                  ⬇ All
                </button>
                <button className="j2p-btn j2p-btn-primary" onClick={convertAll} disabled={busy || !items.length}>
                  {busy ? "Working…" : "⚡ Convert"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Other tools + CTA ── */}
          <motion.div className="j2p-card" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.26 }}>
            <p style={{ fontSize:"clamp(0.72rem,2.5vw,0.78rem)", color:"#64748b", marginBottom:10, fontWeight:600 }}>Need something else?</p>
            <div className="j2p-suggest">
              <Link to="/tools/pdf/image-to-pdf"><span>📄</span> Image → PDF</Link>
              <Link to="/tools/pdf/word-to-pdf"><span>📝</span> Word → PDF</Link>
              <Link to="/tools/career/cv-maker"><span>🧑‍💼</span> CV Maker</Link>
              <Link to="/tools/career/cover-letter-maker"><span>✉️</span> Cover Letter</Link>
            </div>

            <div className="j2p-cta">
              <div>
                <h3>Earn while you learn 🚀</h3>
                <p>Join AIDLA today and start earning rewards as you build your skills.</p>
              </div>
              <Link to="/signup" className="j2p-cta-link">Join now ✨</Link>
            </div>
          </motion.div>

        </div>

        <Footer />
      </div>
    </>
  );
}