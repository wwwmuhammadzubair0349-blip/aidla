import { useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // or "react-helmet-async"
import Footer from "../../components/footer"; // adjust path if needed
import "./image-to-pdf.css"; // external CSS

// ─── Utility functions (unchanged) ─────────────────────────────────────────────
function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  const units = ["B","KB","MB","GB"];
  let v = bytes, i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

async function fileToImageInfo(file) {
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();
  img.decoding = "async"; img.loading = "eager";
  const dims = await new Promise((resolve, reject) => {
    img.onload  = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error("Failed to read image: " + file.name));
    img.src = objectUrl;
  });
  return { id: uid(), file, name: file.name, size: file.size, type: file.type, src: objectUrl, width: dims.w, height: dims.h };
}

async function imageFileToJpegDataUrl(file, maxDim = 2200, quality = 0.9) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    const { w, h } = await new Promise((resolve, reject) => {
      img.onload  = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => reject(new Error("Failed to load image for PDF: " + file.name));
      img.src = objectUrl;
    });
    let targetW = w, targetH = h;
    const maxSide = Math.max(w, h);
    if (maxSide > maxDim) { const s = maxDim / maxSide; targetW = Math.round(w*s); targetH = Math.round(h*s); }
    const canvas = document.createElement("canvas");
    canvas.width = targetW; canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported.");
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);
    return { dataUrl: canvas.toDataURL("image/jpeg", quality), pixelW: targetW, pixelH: targetH };
  } finally { URL.revokeObjectURL(objectUrl); }
}

function computeFitRect(imgW, imgH, pageW, pageH, margin) {
  const aW = pageW - margin*2, aH = pageH - margin*2;
  const ir = imgW/imgH, br = aW/aH;
  let drawW, drawH;
  if (ir > br) { drawW = aW; drawH = aW/ir; } else { drawH = aH; drawW = aH*ir; }
  return { x:(pageW-drawW)/2, y:(pageH-drawH)/2, w:drawW, h:drawH };
}

// ─── Main Component ───────────────────────────────────────────────────
export default function ImageToPdf() {
  const inputRef    = useRef(null);
  const addMoreRef  = useRef(null);

  const [items,       setItems]       = useState([]);
  const [msg,         setMsg]         = useState("");
  const [msgType,     setMsgType]     = useState("info");
  const [busy,        setBusy]        = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [progStep,    setProgStep]     = useState("");
  const [dzActive,    setDzActive]    = useState(false);

  const [pageSize,    setPageSize]    = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [margin,      setMargin]      = useState(10);
  const [fileName,    setFileName]    = useState("images-to-pdf");

  const totalSize = useMemo(() => items.reduce((s,it) => s + (it.size||0), 0), [items]);

  const showMsg = (text, type = "info") => { setMsg(text); setMsgType(type); };

  useEffect(() => () => { items.forEach(it => { try { URL.revokeObjectURL(it.src); } catch {} }); }, []); // eslint-disable-line

  const addFiles = async (fileList) => {
    const files = Array.from(fileList||[]).filter(f => f && /^image\//.test(f.type));
    if (!files.length) { showMsg("Please select image files (JPG / PNG / WebP).", "error"); return; }
    setBusy(true); showMsg("", "info");
    try {
      const infos = [];
      for (const f of files) infos.push(await fileToImageInfo(f));
      setItems(p => [...p, ...infos]);
      showMsg(`Added ${infos.length} image${infos.length!==1?"s":""} ✅`, "success");
    } catch (e) { showMsg(e?.message || "Failed to add images.", "error"); }
    finally { setBusy(false); }
  };

  const onPick    = async (e) => { await addFiles(e.target.files); if (inputRef.current) inputRef.current.value = ""; };
  const onPickAdd = async (e) => { await addFiles(e.target.files); if (addMoreRef.current) addMoreRef.current.value = ""; };

  const onDrop = async (e) => {
    e.preventDefault(); e.stopPropagation(); setDzActive(false);
    if (e.dataTransfer?.files?.length) await addFiles(e.dataTransfer.files);
  };

  const removeItem = (id) => {
    setItems(p => {
      const rem = p.find(it => it.id === id);
      if (rem?.src) try { URL.revokeObjectURL(rem.src); } catch {}
      return p.filter(it => it.id !== id);
    });
  };

  const moveItem = (id, dir) => {
    setItems(p => {
      const idx = p.findIndex(it => it.id === id);
      if (idx < 0) return p;
      const ni = idx + dir;
      if (ni < 0 || ni >= p.length) return p;
      const copy = [...p];
      const [s] = copy.splice(idx, 1);
      copy.splice(ni, 0, s);
      return copy;
    });
  };

  const clearAll = () => {
    items.forEach(it => { try { URL.revokeObjectURL(it.src); } catch {} });
    setItems([]); showMsg("Cleared ✅", "success");
  };

  const generatePdf = async () => {
    showMsg("", "info");
    if (!items.length) { showMsg("Add at least 1 image first.", "error"); return; }
    const safeName = (fileName||"images-to-pdf").trim().replace(/[\\/:*?"<>|]+/g,"-");
    const finalName = safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`;
    const m = Number(margin);
    const safeMargin = Number.isFinite(m) ? Math.min(Math.max(m,0),30) : 10;
    setBusy(true); setProgress(2); setProgStep("Initialising…");

    try {
      const pdf = new jsPDF({ orientation, unit:"mm", format:pageSize, compress:true });

      for (let i = 0; i < items.length; i++) {
        const pct = 4 + Math.round((i / items.length) * 90);
        setProgress(pct);
        setProgStep(`Processing ${i+1} / ${items.length}: ${items[i].name}`);

        if (i > 0) pdf.addPage();
        const { dataUrl, pixelW, pixelH } = await imageFileToJpegDataUrl(items[i].file);
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const rect  = computeFitRect(pixelW, pixelH, pageW, pageH, safeMargin);
        pdf.addImage(dataUrl, "JPEG", rect.x, rect.y, rect.w, rect.h, undefined, "FAST");
        await new Promise(r => setTimeout(r, 8));
      }

      setProgress(97); setProgStep("Saving…");
      pdf.save(finalName);
      setProgress(100); setProgStep("");
      showMsg(`PDF downloaded: ${finalName} ✅`, "success");
    } catch (e) {
      showMsg(e?.message || "Failed to generate PDF.", "error");
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 1200);
    }
  };

  // Canonical URL – adjust as needed
  const canonicalUrl = "https://www.aidla.online/tools/pdf/image-to-pdf";

  return (
    <>
      <Helmet>
        <title>Image to PDF Converter – Free Online Tool | AIDLA</title>
        <meta
          name="description"
          content="Convert JPG, PNG, WebP images to PDF instantly in your browser. Choose page size, margins, orientation. 100% private, no upload."
        />
        <meta
          name="keywords"
          content="image to PDF, JPG to PDF, PNG to PDF, convert images to PDF, PDF creator, AIDLA"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content="Image to PDF Converter – AIDLA" />
        <meta property="og:description" content="Turn your images into a PDF in seconds – free, private, no sign-up." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.aidla.online/og-image-to-pdf.jpg" />
        <meta property="og:site_name" content="AIDLA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Image to PDF Converter by AIDLA" />
        <meta name="twitter:description" content="Convert any image to PDF online – free and private." />
        <meta name="twitter:image" content="https://www.aidla.online/twitter-image-to-pdf.jpg" />

        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="i2p-root">
        <div className="i2p-orbs">
          <div className="i2p-orb i2p-orb1"/>
          <div className="i2p-orb i2p-orb2"/>
          <div className="i2p-orb i2p-orb3"/>
        </div>

        <div className="i2p-wrap">

          {/* ── Hero ── */}
          <motion.div className="i2p-hero" initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
            <span className="i2p-badge">🖼️ PDF Tool</span>
            <h1 className="i2p-title">
              Image <span className="i2p-title-acc">→ PDF</span>
            </h1>
            <p className="i2p-sub">Convert JPG, PNG, WebP & more into a single PDF. Runs entirely in your browser — nothing uploaded.</p>
          </motion.div>

          <motion.div className="i2p-pills" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
            {["✓ All formats","✓ Page size","✓ Margins","✓ Reorder","✓ 100% private"].map(p => (
              <span className="i2p-pill" key={p}>{p}</span>
            ))}
          </motion.div>

          {/* ── Toast ── */}
          <AnimatePresence>
            {msg && (
              <motion.div
                className={`i2p-toast ${msgType}`}
                initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
              >
                <span>{msg}</span>
                <button className="i2p-toast-close" onClick={() => setMsg("")}>×</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Drop zone ── */}
          <motion.div className="i2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}>
            <div
              className={`i2p-dz${dzActive ? " on" : ""}`}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDzActive(true); }}
              onDragLeave={() => setDzActive(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
              aria-label="Upload images"
            >
              <input ref={inputRef} type="file" accept="image/*" multiple onChange={onPick} style={{ display:"none" }} />
              <span className="i2p-dz-icon">{dzActive ? "📥" : "🖼️"}</span>
              <p className="i2p-dz-title">{dzActive ? "Drop images here!" : "Drag & drop or tap to browse"}</p>
              <p className="i2p-dz-sub">PNG · JPG · WebP · GIF · BMP</p>
            </div>

            {items.length > 0 && (
              <div className="i2p-stats">
                <div className="i2p-stat g">🖼 {items.length} image{items.length!==1?"s":""}</div>
                <div className="i2p-stat-div"/>
                <div className="i2p-stat">{formatBytes(totalSize)}</div>
                <div className="i2p-stat-div"/>
                <div className="i2p-stat" style={{ color:"#94a3b8", fontWeight:500 }}>Tap cards to reorder</div>
              </div>
            )}

            {busy && (
              <div className="i2p-prog">
                <div className="i2p-prog-lbl"><span>Generating PDF…</span><span>{progress}%</span></div>
                <div className="i2p-prog-bg"><div className="i2p-prog-fill" style={{ width:`${progress}%` }}/></div>
                {progStep && <p className="i2p-prog-step">{progStep}</p>}
              </div>
            )}
          </motion.div>

          {/* ── Settings ── */}
          <motion.div className="i2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.17 }}>
            <div className="i2p-card-title">⚙️ PDF Settings</div>
            <div className="i2p-settings">

              <div className="i2p-field">
                <label>Page Size</label>
                <div className="i2p-toggle">
                  {["a4","letter"].map(k => (
                    <button key={k} className={`i2p-tog-btn${pageSize===k?" active":""}`} onClick={() => setPageSize(k)}>
                      {k === "a4" ? "A4" : "Letter"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="i2p-field">
                <label>Orientation</label>
                <div className="i2p-toggle">
                  {["portrait","landscape"].map(k => (
                    <button key={k} className={`i2p-tog-btn${orientation===k?" active":""}`} onClick={() => setOrientation(k)}>
                      {k === "portrait" ? "⬆ Port." : "➡ Land."}
                    </button>
                  ))}
                </div>
              </div>

              <div className="i2p-field">
                <label>Margin (mm)</label>
                <input
                  type="number" min={0} max={30}
                  value={margin}
                  onChange={e => setMargin(e.target.value)}
                  className="i2p-input-num"
                />
              </div>

              <div className="i2p-field">
                <label>File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  placeholder="images-to-pdf"
                  className="i2p-input-text"
                />
              </div>
            </div>
          </motion.div>

          {/* ── Image grid ── */}
          <motion.div className="i2p-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.21 }}>
            <div className="i2p-card-title">
              📄 Pages
              <span style={{ marginLeft:"auto", fontSize:"0.68rem", fontWeight:600, color:"#94a3b8", fontFamily:"DM Sans" }}>
                {items.length > 0 ? `${items.length} page${items.length!==1?"s":""}` : "No images yet"}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="i2p-empty">
                <span className="i2p-empty-icon">🖼️</span>
                <p className="i2p-empty-text">No images added yet. Drop some above to get started.</p>
              </div>
            ) : (
              <>
                <div className="i2p-grid">
                  <AnimatePresence>
                    {items.map((it, idx) => (
                      <motion.div
                        key={it.id}
                        className="i2p-img-card"
                        layout
                        initial={{ opacity:0, scale:0.9 }}
                        animate={{ opacity:1, scale:1 }}
                        exit={{ opacity:0, scale:0.85 }}
                        transition={{ duration:0.2 }}
                      >
                        <div className="i2p-img-thumb-wrap">
                          <img src={it.src} alt={it.name} className="i2p-img-thumb" draggable={false} />
                          <div className="i2p-page-num">{idx+1}</div>
                          <div className="i2p-img-overlay">
                            <button className="i2p-ov-btn i2p-ov-up" onClick={() => moveItem(it.id,-1)} disabled={busy || idx===0} title="Move up">↑</button>
                            <button className="i2p-ov-btn i2p-ov-down" onClick={() => moveItem(it.id,1)} disabled={busy || idx===items.length-1} title="Move down">↓</button>
                            <button className="i2p-ov-btn i2p-ov-del" onClick={() => removeItem(it.id)} disabled={busy} title="Remove">✕</button>
                          </div>
                        </div>
                        <div className="i2p-img-info">
                          <div className="i2p-img-name" title={it.name}>{it.name}</div>
                          <div className="i2p-img-meta">{formatBytes(it.size)}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div style={{ marginTop:12, display:"flex", justifyContent:"flex-end" }}>
                  <input ref={addMoreRef} type="file" accept="image/*" multiple onChange={onPickAdd} style={{ display:"none" }} />
                  <button className="i2p-add-more-btn" onClick={() => addMoreRef.current?.click()} disabled={busy}>
                    ➕ Add more images
                  </button>
                </div>
              </>
            )}

            {/* ── Inline action bar (replaces sticky bar) ── */}
            <div className="i2p-action-inline">
              <div className="i2p-action-inline-info">
                <span className="i2p-action-label">Ready to convert</span>
                <span className="i2p-action-value">
                  {items.length} image{items.length!==1?"s":""} · {pageSize.toUpperCase()} · {orientation === "portrait" ? "Portrait" : "Landscape"}
                  {totalSize > 0 && <> · {formatBytes(totalSize)}</>}
                </span>
              </div>
              <div className="i2p-action-btns">
                <input ref={addMoreRef} type="file" accept="image/*" multiple onChange={onPickAdd} style={{ display:"none" }} />
                <button className="i2p-btn-add" onClick={() => inputRef.current?.click()} disabled={busy}>➕</button>
                <button className="i2p-btn-clear" onClick={clearAll} disabled={busy || !items.length}>Clear</button>
                <button className="i2p-btn-download" onClick={generatePdf} disabled={busy || !items.length}>
                  {busy ? `${progress}%…` : "⬇ Download PDF"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Other tools ── */}
          <motion.div className="i2p-card" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.26 }}>
            <p style={{ fontSize:"clamp(0.72rem,2.5vw,0.78rem)", color:"#64748b", marginBottom:10, fontWeight:600 }}>Need something else?</p>
            <div className="i2p-suggest">
              <Link to="/tools/pdf/word-to-pdf"><span>📄</span> Word → PDF</Link>
              <Link to="/tools/image/jpg-to-png"><span>🧩</span> JPG → PNG</Link>
              <Link to="/tools/career/cv-maker"><span>🧑‍💼</span> CV Maker</Link>
              <Link to="/tools/career/cover-letter-maker"><span>✉️</span> Cover Letter</Link>
            </div>

            <div className="i2p-cta">
              <div>
                <h3>Earn while you learn 🚀</h3>
                <p>Join AIDLA today and start earning rewards as you build your skills.</p>
              </div>
              <Link to="/signup" className="i2p-cta-link">Join now ✨</Link>
            </div>
          </motion.div>

        </div>

        <Footer />
      </div>
    </>
  );
}