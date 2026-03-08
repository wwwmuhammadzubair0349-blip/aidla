import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet"; // or "react-helmet-async"
import Footer from "../../components/Footer"; // adjust path if needed
import "./word-to-pdf.css"; // external CSS

/*
  REQUIRED CDN SCRIPTS in index.html (add before </body>):
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
*/

// ─── Constants ───────────────────────────────────────────────────
const STORAGE_KEY = "word2pdf_v4";
const EXPIRY_MS   = 60 * 60 * 1000;
const A4_W_PX     = 794;
const A4_H_PX     = 1123;
const PDF_W_MM    = 210;
const PDF_H_MM    = 297;
const SCALE       = 2;

const fmtBytes = (b) =>
  b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";

// ─── Layout Reconstructor (unchanged) ───────────────────────────
function reconstructLayout(rawHtml) {
  const parser = new DOMParser();
  const dom    = parser.parseFromString(`<body>${rawHtml}</body>`, "text/html");
  const nodes  = Array.from(dom.body.childNodes).filter((n) => n.nodeType === 1);

  const t  = (el) => (el.textContent || "").trim();
  const ih = (el) => el.innerHTML || "";

  const isSectionHeading = (el) => {
    const s = t(el);
    if (!s || s.length > 100) return false;
    const hasU   = !!el.querySelector("u");
    const isCaps = s === s.toUpperCase() && s.endsWith(":") && /[A-Z]{2}/.test(s);
    return hasU || isCaps;
  };

  const isJobRow = (el) => {
    const s = t(el);
    if (!s || s.length > 220) return false;
    const hasDate = /\(\w+\s+\d{4}/.test(s) || /\d{4}\s*[-–]\s*(\d{4}|Current|Present)/i.test(s);
    const hasBold = !!el.querySelector("strong, b");
    return hasDate && hasBold;
  };

  const isArrowHeading = (el) => /^[➤➢►▶»]/.test(t(el));

  const hasImage = (el) =>
    el.nodeName === "IMG" || !!el.querySelector?.("img");

  let profileImg  = null;
  let seenSection = false;
  for (const node of nodes) {
    if (!seenSection && isSectionHeading(node)) { seenSection = true; break; }
    if (!seenSection && hasImage(node)) {
      profileImg = node.nodeName === "IMG" ? node : node.querySelector("img");
      break;
    }
  }

  let headerNodes = [];
  let bodyNodes   = [];
  seenSection = false;

  for (const node of nodes) {
    if (!seenSection && isSectionHeading(node)) seenSection = true;
    if (!seenSection) {
      const isProfileNode = profileImg && (node === profileImg || node.contains?.(profileImg));
      if (!isProfileNode) headerNodes.push(node);
    } else {
      bodyNodes.push(node);
    }
  }

  let out = `<div class="cv-header"><div class="cv-header-left">`;
  headerNodes.forEach((node, i) => {
    const s = t(node);
    if (!s) return;
    if (i === 0) out += `<div class="cv-name">${ih(node)}</div>`;
    else if (i === 1) out += `<div class="cv-subtitle">${ih(node)}</div>`;
    else out += `<div class="cv-contact-row">${ih(node)}</div>`;
  });
  out += `</div><div class="cv-header-right">`;
  if (profileImg) out += `<img src="${profileImg.src}" alt="Profile" />`;
  out += `</div></div>`;

  const renderList = (listEl, depth = 0) => {
    let s = "";
    Array.from(listEl.children)
      .filter((c) => c.nodeName === "LI")
      .forEach((li) => {
        const clone = li.cloneNode(true);
        clone.querySelectorAll("ul,ol").forEach((nl) => nl.remove());
        const liHtml = clone.innerHTML;
        const cls    = depth > 0 ? "cv-sub-bullet" : "cv-bullet";
        s += `<div class="${cls}"><span class="bd">•</span><span>${liHtml}</span></div>`;
        li.querySelectorAll(":scope > ul, :scope > ol").forEach((nl) => {
          s += renderList(nl, depth + 1);
        });
      });
    return s;
  };

  for (const node of bodyNodes) {
    const s = t(node);

    if (hasImage(node)) {
      const imgs = node.nodeName === "IMG" ? [node] : Array.from(node.querySelectorAll("img"));
      imgs.forEach((img) => {
        if (img.src) out += `<div class="cv-img-block"><img src="${img.src}" alt="Document image" /></div>`;
      });
      if (node.nodeName !== "IMG" && s) {
        const clone = node.cloneNode(true);
        clone.querySelectorAll("img").forEach((i) => i.remove());
        const rest = (clone.textContent || "").trim();
        if (rest) out += `<div class="cv-para">${rest}</div>`;
      }
      continue;
    }

    if (!s && node.nodeName !== "TABLE") continue;

    if (isSectionHeading(node)) { out += `<span class="cv-section-heading">${s}</span>`; continue; }

    if (isJobRow(node)) {
      const dateRe = /(\(\w+\s+\d{4}[^)]*\)|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–]\s*(?:\w+\s*\d{0,4}|Current|Present))/i;
      const m = s.match(dateRe);
      let titleHtml = ih(node);
      let dateText  = "";
      if (m) { dateText = m[0]; titleHtml = titleHtml.replace(m[0], "").trim(); }
      out += `<div class="cv-job-row"><div class="cv-job-title">${titleHtml}</div>${dateText ? `<div class="cv-job-date">${dateText}</div>` : ""}</div>`;
      continue;
    }

    if (isArrowHeading(node)) {
      out += `<div class="cv-arrow-heading"><span class="arr">➤</span><span>${ih(node).replace(/^[➤➢►▶»]\s*/, "")}</span></div>`;
      continue;
    }

    if (node.nodeName === "UL" || node.nodeName === "OL") { out += renderList(node, 0); continue; }
    if (/^[•·\-]\s/.test(s)) {
      out += `<div class="cv-bullet"><span class="bd">•</span><span>${ih(node).replace(/^[•·\-]\s*/, "")}</span></div>`;
      continue;
    }
    if (node.nodeName === "TABLE") { out += node.outerHTML; continue; }
    if (s) out += `<div class="cv-para">${ih(node)}</div>`;
  }

  return `<div class="word-doc">${out}</div>`;
}

// ─── Page boundaries (unchanged) ─────────────────────────────────
async function computePageBoundaries(stageEl) {
  const docEl = stageEl.querySelector(".word-doc");
  if (!docEl) return [0];

  const blocks = Array.from(docEl.querySelectorAll(
    ".cv-header, .cv-section-heading, .cv-job-row, .cv-arrow-heading, " +
    ".cv-bullet, .cv-sub-bullet, .cv-para, .cv-img-block, table, .cv-contact-row, " +
    ".cv-name, .cv-subtitle"
  ));

  const stageTop   = stageEl.getBoundingClientRect().top + window.scrollY;
  const totalH     = stageEl.scrollHeight;
  const boundaries = [0];

  let nominalY = A4_H_PX;
  while (nominalY < totalH) {
    let snapY = nominalY;
    for (let i = blocks.length - 1; i >= 0; i--) {
      const rect        = blocks[i].getBoundingClientRect();
      const blockBottom = rect.bottom + window.scrollY - stageTop;
      if (blockBottom <= nominalY - 20) { snapY = Math.ceil(blockBottom) + 1; break; }
    }
    boundaries.push(snapY);
    nominalY = snapY + A4_H_PX;
  }
  boundaries.push(totalH);
  return boundaries;
}

// ─── Main Component ──────────────────────────────────────────────
export default function WordToPdf() {
  const [file,             setFile]             = useState(null);
  const [converting,       setConverting]       = useState(false);
  const [progress,         setProgress]         = useState(0);
  const [progressStep,     setProgressStep]     = useState("");
  const [previewHtml,      setPreviewHtml]      = useState("");
  const [convertedPdfData, setConvertedPdfData] = useState(null);
  const [fileName,         setFileName]         = useState("");
  const [pdfSizeKb,        setPdfSizeKb]        = useState(0);
  const [pageCount,        setPageCount]        = useState(0);
  const [imageCount,       setImageCount]       = useState(0);
  const [error,            setError]            = useState("");
  const [dragActive,       setDragActive]       = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (Date.now() - data.timestamp < EXPIRY_MS) {
          setConvertedPdfData(data.pdfBase64);
          setFileName(data.fileName);
          setPdfSizeKb(data.pdfSizeKb || 0);
          setPageCount(data.pageCount || 0);
        } else localStorage.removeItem(STORAGE_KEY);
      }
    } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);

  const runMammoth = async (f) => {
    const mammoth = window.mammoth;
    if (!mammoth) throw new Error("Mammoth library not loaded. Add CDN script to index.html.");
    const ab = await f.arrayBuffer();
    let imgCount = 0;
    const result = await mammoth.convertToHtml(
      { arrayBuffer: ab },
      {
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Title']     => p.wtitle:fresh",
        ],
        includeDefaultStyleMap: true,
        convertImage: mammoth.images.imgElement((image) =>
          image.read("base64").then((b64) => {
            imgCount++;
            return { src: `data:${image.contentType || "image/jpeg"};base64,${b64}` };
          })
        ),
      }
    );
    return { html: result.value, imgCount };
  };

  const handleFile = useCallback(async (f) => {
    if (!f.name.toLowerCase().endsWith(".docx")) { setError("Please upload a .docx file."); return; }
    if (f.size > 30 * 1024 * 1024) { setError("File too large — max 30 MB."); return; }
    setError(""); setFile(f); setFileName(f.name);
    setConvertedPdfData(null); setPreviewHtml(""); setProgress(0); setProgressStep("");
    try {
      const { html, imgCount } = await runMammoth(f);
      setImageCount(imgCount);
      setPreviewHtml(reconstructLayout(html));
    } catch (e) { console.warn("Preview:", e); }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault(); setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const convertToPdf = async () => {
    if (!file) return;
    setConverting(true); setError("");
    setProgress(5); setProgressStep("Reading document…");
    try {
      const html2canvas = window.html2canvas;
      const { jsPDF }   = window.jspdf;
      if (!html2canvas) throw new Error("html2canvas not loaded. Add CDN script.");
      if (!jsPDF)       throw new Error("jsPDF not loaded. Add CDN script.");

      setProgress(15); setProgressStep("Extracting content & all images…");
      const { html, imgCount } = await runMammoth(file);
      setImageCount(imgCount);

      setProgress(32); setProgressStep("Reconstructing layout…");
      const layoutHtml = reconstructLayout(html);
      setPreviewHtml(layoutHtml);

      const stage = stageRef.current;
      stage.innerHTML = layoutHtml;

      setProgress(42); setProgressStep(`Waiting for ${imgCount} image(s) to render…`);
      const imgs = Array.from(stage.querySelectorAll("img"));
      await Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = res; img.onerror = res;
                setTimeout(res, 3000);
              })
        )
      );
      await new Promise((r) => setTimeout(r, 600));

      setProgress(52); setProgressStep("Calculating smart page boundaries…");
      const boundaries = await computePageBoundaries(stage);
      const pages = boundaries.length - 1;
      setPageCount(pages);

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      for (let p = 0; p < pages; p++) {
        const yStart = boundaries[p];
        const yEnd   = boundaries[p + 1];
        const sliceH = yEnd - yStart;

        setProgress(52 + Math.round(((p + 0.5) / pages) * 40));
        setProgressStep(`Rendering page ${p + 1} of ${pages}…`);

        const canvas = await html2canvas(stage, {
          scale: SCALE, useCORS: true, allowTaint: true,
          backgroundColor: "#ffffff", scrollY: -yStart,
          windowWidth: A4_W_PX, windowHeight: sliceH,
          height: sliceH, y: yStart, logging: false,
        });

        const sliceRatio  = sliceH / A4_H_PX;
        const imgHeightMM = PDF_H_MM * sliceRatio;
        const imgData     = canvas.toDataURL("image/jpeg", 0.97);
        if (p > 0) doc.addPage();
        doc.addImage(imgData, "JPEG", 0, 0, PDF_W_MM, imgHeightMM, undefined, "FAST");
        await new Promise((r) => setTimeout(r, 10));
      }

      setProgress(97); setProgressStep("Finalising PDF…");
      stage.innerHTML = "";

      const pdfBase64 = doc.output("datauristring").split(",")[1];
      const kbSize    = Math.round(atob(pdfBase64).length / 1024);
      setPdfSizeKb(kbSize);

      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        fileName: file.name, pdfBase64, pdfSizeKb: kbSize,
        pageCount: pages, timestamp: Date.now(),
      }));

      setConvertedPdfData(pdfBase64);
      setProgress(100); setProgressStep("Done!");
    } catch (err) {
      console.error(err);
      setError(
        err.message.includes("not loaded")
          ? err.message
          : "Conversion failed. Check console for details."
      );
    } finally { setConverting(false); }
  };

  const handleDownload = () => {
    if (!convertedPdfData) return;
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${convertedPdfData}`;
    link.download = fileName.replace(/\.docx$/i, ".pdf") || "converted.pdf";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    localStorage.removeItem(STORAGE_KEY);
    setConvertedPdfData(null); setFile(null); setFileName(""); setPreviewHtml(""); setProgress(0);
  };

  const handleConvertAnother = () => {
    setFile(null); setFileName(""); setConvertedPdfData(null);
    setPreviewHtml(""); setError(""); setProgress(0); setProgressStep("");
    localStorage.removeItem(STORAGE_KEY);
  };

  // Canonical URL – adjust as needed
  const canonicalUrl = "https://aidla.online/tools/pdf/word-to-pdf";

  return (
    <>
      <Helmet>
        <title>Word to PDF Converter – Free Online Tool | AIDLA</title>
        <meta
          name="description"
          content="Convert Word (.docx) documents to PDF with full layout, images, and certificates preserved. 100% private, no upload."
        />
        <meta
          name="keywords"
          content="Word to PDF, DOCX to PDF, convert Word to PDF, document converter, PDF creator, AIDLA"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content="Word to PDF Converter – AIDLA" />
        <meta property="og:description" content="Convert Word documents to PDF with perfect layout and images – free, private, no sign-up." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://aidla.online/og-word-to-pdf.jpg" />
        <meta property="og:site_name" content="AIDLA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Word to PDF Converter by AIDLA" />
        <meta name="twitter:description" content="Word to PDF conversion done right – free and private." />
        <meta name="twitter:image" content="https://aidla.online/twitter-word-to-pdf.jpg" />

        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="tool-root">
        <div id="word-render-stage" ref={stageRef} aria-hidden="true" />

        <div className="bg-orbs">
          <div className="bg-orb-1" /><div className="bg-orb-2" />
        </div>

        <div className="tool-wrap">
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
            <span className="tool-badge">📄 PDF Tool</span>
            <h1 className="tool-title">
              Word <span className="tool-title-accent">→ PDF</span>
            </h1>
            <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              <p className="tool-sub">Convert .docx → PDF with full layout, images & certificates preserved.</p>
              <span className="quality-badge">✦ Pixel-faithful</span>
            </div>
          </motion.div>

          <div className="feature-pills">
            {["✓ Profile photo","✓ Certificates","✓ Transcripts","✓ 2-col header","✓ Smart breaks","✓ 100% private"].map((p) => (
              <span className="pill" key={p}>{p}</span>
            ))}
          </div>

          <motion.div className="tool-card" initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.1 }}>
            <AnimatePresence mode="wait">
              {/* ── SUCCESS ── */}
              {convertedPdfData ? (
                <motion.div
                  key="success"
                  initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                  className="success-box"
                >
                  <span className="success-icon">✅</span>
                  <div className="success-title">Conversion complete!</div>
                  <p className="success-meta">
                    {fileName.replace(/\.docx$/i, ".pdf")}
                    {pageCount > 0 && <> · {pageCount} pages</>}
                    {pdfSizeKb > 0 && <> · {pdfSizeKb} KB</>}
                  </p>
                  <div className="btn-group">
                    <button className="btn btn-primary" onClick={handleDownload}>⬇ Download PDF</button>
                    <button className="btn" onClick={handleConvertAnother}>↻ Convert another</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="upload" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

                  {/* Drop zone */}
                  <div
                    className={`dropzone${dragActive ? " active" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("fileInput").click()}
                    role="button" tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && document.getElementById("fileInput").click()}
                  >
                    <input
                      id="fileInput" type="file" accept=".docx"
                      onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
                      style={{ display:"none" }}
                    />
                    <span className="dropzone-icon">📂</span>
                    <p className="dropzone-title">
                      {dragActive ? "Drop it here!" : "Drag & drop or tap to browse"}
                    </p>
                    <p className="dropzone-sub">.docx only · max 30 MB · all images preserved</p>
                  </div>

                  {/* Error */}
                  {error && <p className="error-box">⚠ {error}</p>}

                  {/* File info */}
                  {file && !converting && (
                    <motion.div className="file-info" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}>
                      <div className="file-info-left">
                        <div className="file-name">{file.name}</div>
                        <div className="file-meta">
                          <span className="file-size">{fmtBytes(file.size)}</span>
                          {imageCount > 0 && (
                            <span className="img-count">🖼 {imageCount} image{imageCount > 1 ? "s" : ""}</span>
                          )}
                        </div>
                      </div>
                      <button className="btn btn-primary" onClick={convertToPdf} disabled={converting}>
                        Convert to PDF
                      </button>
                    </motion.div>
                  )}

                  {/* Progress */}
                  {converting && (
                    <motion.div className="progress-wrap" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                      <div className="progress-label">
                        <span>Converting…</span><span>{progress}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
                      </div>
                      <p className="progress-step">{progressStep}</p>
                    </motion.div>
                  )}

                  {/* Preview */}
                  {previewHtml && !converting && (
                    <motion.div
                      className="preview-panel"
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
                    >
                      <div className="preview-header">
                        <span>👁</span> Live preview
                        {imageCount > 0 && (
                          <span style={{ marginLeft:"auto", color:"#059669", textTransform:"none", letterSpacing:0 }}>
                            🖼 {imageCount} image{imageCount !== 1 ? "s" : ""} included
                          </span>
                        )}
                      </div>
                      <div className="preview-scroll">
                        <div style={{ transform:"scale(0.72)", transformOrigin:"top left", width:"138.9%" }}>
                          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

            {/* Other tools */}
            <div style={{ marginTop:24 }}>
              <p style={{ fontSize:"clamp(0.72rem,2.5vw,0.8rem)", color:"#64748b", marginBottom:10, fontWeight:600 }}>Need something else?</p>
              <div className="tools-suggest">
                <Link to="/tools/pdf/image-to-pdf"><span>🖼️</span> Image → PDF</Link>
                <Link to="/tools/image/jpg-to-png"><span>🧩</span> JPG → PNG</Link>
                <Link to="/tools/career/cv-maker"><span>🧑‍💼</span> CV Maker</Link>
                <Link to="/tools/career/cover-letter-maker"><span>✉️</span> Cover Letter</Link>
              </div>

              <div className="tool-cta">
                <div>
                  <h3>Earn while you learn 🚀</h3>
                  <p>Join AIDLA today and start earning rewards as you build your skills.</p>
                </div>
                <Link to="/signup" className="tool-cta-link">Join now ✨</Link>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  );
}