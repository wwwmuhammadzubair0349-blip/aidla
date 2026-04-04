// career/cv/Print.jsx
import React, { useState, useEffect, useRef } from 'react';

/* ================================================================
   PAPER DIMENSIONS (Physical Print Sizes)
================================================================ */
const PAPER_SIZES = {
  a4: { w: 794, h: 1123, label: 'A4', mm_w: 210, mm_h: 297 },
  letter: { w: 816, h: 1056, label: 'Letter', mm_w: 216, mm_h: 279 },
  legal: { w: 816, h: 1344, label: 'Legal', mm_w: 216, mm_h: 356 },
};

/* ================================================================
   DETECT MOBILE
================================================================ */
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent)); // iPad
}

/* ================================================================
   CLEANUP OLD PRINT ARTIFACTS
================================================================ */
function cleanupExistingPrintArtifacts() {
  document.getElementById('__cv_print_wrapper__')?.remove();
  document.getElementById('__cv_print_style__')?.remove();
  document.body.classList.remove('cv-printing');
}

/* ================================================================
   VIP ATS-FRIENDLY PRINT CSS ENGINE
================================================================ */
function buildPrintCss(paper) {
  const { mm_w, mm_h } = PAPER_SIZES[paper] || PAPER_SIZES.a4;

  return `
    @page {
      size: ${mm_w}mm ${mm_h}mm;
      margin: 12mm 0mm; 
    }
    
    @page :first {
      margin-top: 12mm; 
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
    }

    body.cv-printing > *:not(#__cv_print_wrapper__) {
      display: none !important;
    }

    body.cv-printing #__cv_print_wrapper__ {
      display: block !important;
      width: ${mm_w}mm !important;
      margin: 0 auto !important;
      padding: 0 !important;
      background: #ffffff !important;
    }

    body.cv-printing .cv-doc {
      width: 100% !important;
      min-height: 100vh !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 8mm !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
    }

    body.cv-printing .layout-swiss-clean .cv-doc,
    body.cv-printing .layout-sidebar-dark .cv-doc,
    body.cv-printing .layout-infographic .cv-doc,
    body.cv-printing .layout-gulf-premium .cv-doc {
      padding: 0 !important; 
    }
    
    body.cv-printing .layout-sidebar-dark .cv-sidebar {
      background: #0b1120 !important;
      color: #ffffff !important;
    }

    body.cv-printing .cv-item {
      page-break-inside: avoid !important;
      break-inside: avoid-page !important;
      display: block !important; 
      margin-bottom: 12px;
    }

    body.cv-printing .cv-photo-wrapper,
    body.cv-printing .cv-sec-title,
    body.cv-printing .cv-info-card,
    body.cv-printing .cv-lang-item {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    body.cv-printing .cv-sec-title {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    body.cv-printing .cv-item-header {
      page-break-after: avoid !important;
      break-after: avoid !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    body.cv-printing .cv-bullets {
      page-break-inside: auto !important;
      break-inside: auto !important;
    }
    
    body.cv-printing .cv-bullets li {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    body.cv-printing .layout-gulf-premium.cv-doc {
      border-top: 12mm solid var(--ac) !important;
    }

    body.cv-printing [data-print-ignore="true"],
    body.cv-printing .cv-modal-backdrop {
      display: none !important;
    }
  `;
}

/* ================================================================
   DESKTOP: NATIVE PRINT DIALOG
================================================================ */
function executePrint({ paperRef, paper, fullName, filename, toast }) {
  const src = paperRef?.current;

  if (!src) {
    toast?.('Preview not ready — please wait a moment.', 'err');
    return;
  }

  cleanupExistingPrintArtifacts();

  const clone = src.cloneNode(true);
  clone.removeAttribute('id');
  clone.style.cssText = `
    display: block !important;
    transform: none !important;
    position: static !important;
    width: 100% !important;
    height: auto !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
  `;

  const wrapper = document.createElement('div');
  wrapper.id = '__cv_print_wrapper__';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  const styleEl = document.createElement('style');
  styleEl.id = '__cv_print_style__';
  styleEl.media = 'print';
  styleEl.textContent = buildPrintCss(paper || 'a4');
  document.head.appendChild(styleEl);

  const prevTitle = document.title;
  const safeFilename = (filename || fullName || 'CV').replace(/\s+/g, '_').replace(/[^\w\-_.]/g, '');
  document.title = safeFilename;

  document.body.classList.add('cv-printing');

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    document.title = prevTitle;
    cleanupExistingPrintArtifacts();
  };

  window.addEventListener('afterprint', cleanup, { once: true });

  requestAnimationFrame(() => {
    setTimeout(() => {
      window.print();
      setTimeout(cleanup, 3000);
    }, 250);
  });
}

/* ================================================================
   MOBILE: html2canvas + jsPDF GENERATION
================================================================ */
async function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(s);
  });
}

async function executeMobilePdf({ paperRef, paper, fullName, filename, toast, setProgress }) {
  const src = paperRef?.current;
  if (!src) {
    toast?.('Preview not ready — please wait a moment.', 'err');
    return;
  }

  try {
    setProgress('Loading PDF engine…');

    // Load libraries sequentially (jsPDF depends on nothing; html2canvas is standalone)
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

    setProgress('Rendering pages…');

    const paperKey = paper || 'a4';
    const { mm_w, mm_h } = PAPER_SIZES[paperKey];

    // Scale factor: render at 2× for sharpness
    const SCALE = 2;

    // Temporarily expand the element so it's fully visible for canvas capture
    const prevTransform = src.style.transform;
    const prevPosition = src.style.position;
    src.style.transform = 'none';
    src.style.position = 'static';

    const canvas = await window.html2canvas(src, {
      scale: SCALE,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (doc) => {
        // Hide print-ignore elements inside the clone
        doc.querySelectorAll('[data-print-ignore="true"], .cv-modal-backdrop').forEach(el => {
          el.style.display = 'none';
        });
      },
    });

    src.style.transform = prevTransform;
    src.style.position = prevPosition;

    setProgress('Building PDF…');

    const { jsPDF } = window.jspdf;

    // Orientation: portrait for all standard sizes
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [mm_w, mm_h],
      compress: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const imgWidth = mm_w;
    const imgHeight = (canvas.height * mm_w) / canvas.width; // preserve aspect ratio

    let yOffset = 0;
    let pageIndex = 0;

    while (yOffset < imgHeight) {
      if (pageIndex > 0) pdf.addPage([mm_w, mm_h], 'portrait');

      // Crop section for this page using a temp canvas
      const pageCanvas = document.createElement('canvas');
      const pageHeightPx = (mm_h / mm_w) * canvas.width;
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(pageHeightPx, canvas.height - pageIndex * pageHeightPx);

      const ctx = pageCanvas.getContext('2d');
      ctx.drawImage(
        canvas,
        0, pageIndex * pageHeightPx,         // source x, y
        canvas.width, pageCanvas.height,      // source w, h
        0, 0,                                  // dest x, y
        canvas.width, pageCanvas.height        // dest w, h
      );

      const pageData = pageCanvas.toDataURL('image/jpeg', 0.92);
      const sliceHeight = (pageCanvas.height / canvas.width) * mm_w;

      pdf.addImage(pageData, 'JPEG', 0, 0, mm_w, sliceHeight);

      yOffset += mm_h;
      pageIndex++;
    }

    const safeFilename = (filename || fullName || 'CV')
      .replace(/\s+/g, '_')
      .replace(/[^\w\-_.]/g, '') + '.pdf';

    pdf.save(safeFilename);
    setProgress(null);
    toast?.('PDF downloaded successfully!', 'ok');

  } catch (err) {
    setProgress(null);
    console.error('Mobile PDF generation failed:', err);
    toast?.('PDF generation failed. Try on a desktop browser for best results.', 'err');
  }
}

/* ================================================================
   VIP DOWNLOAD MODAL UI
================================================================ */
function PrintModal({ defaultName, paper, onConfirm, onCancel, isMobile }) {
  const [name, setName] = useState(defaultName);
  const inp = useRef(null);

  useEffect(() => {
    inp.current?.focus();
    inp.current?.select();
  }, []);

  const confirm = () => onConfirm(name?.trim() || defaultName);

  return (
    <div
      className="cv-modal-backdrop"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999,
        padding: '16px',
      }}
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="cv-modal"
        style={{
          background: '#fff', padding: '24px', borderRadius: '16px',
          width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}
        role="dialog"
      >
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
          📥 Save Document as PDF
        </h3>

        <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
          Your CV has been formatted for <strong>Applicant Tracking Systems (ATS)</strong>. Name your file below before downloading.
        </p>

        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
          File Name
        </label>
        <input
          ref={inp}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && confirm()}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '8px',
            border: '2px solid #e2e8f0', fontSize: '0.9rem', marginBottom: '16px',
            outline: 'none', transition: '0.2s', boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />

        {/* Show different tips based on device */}
        {isMobile ? (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px',
            padding: '12px', marginBottom: '20px', fontSize: '0.75rem', color: '#166534'
          }}>
            <strong>📱 Mobile Download:</strong><br />
            The PDF will be generated and downloaded directly to your device. Check your Downloads folder after tapping "Save Document".
          </div>
        ) : (
          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
            padding: '12px', marginBottom: '20px', fontSize: '0.75rem', color: '#334155'
          }}>
            <strong>💡 Pro Tip for Chrome/Edge:</strong><br />
            In the print window, make sure to <strong>UNCHECK "Headers and footers"</strong> so the web URL doesn't print at the top of Page 2.
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569',
              border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            style={{
              flex: 2, padding: '10px', background: '#0f172a', color: '#fff',
              border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15,23,42,0.2)'
            }}
          >
            Save Document
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   PROGRESS OVERLAY (mobile PDF generation)
================================================================ */
function ProgressOverlay({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 999999, gap: '16px',
    }}>
      {/* Spinner */}
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        border: '4px solid rgba(255,255,255,0.2)',
        borderTopColor: '#ffffff',
        animation: 'cv-spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes cv-spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>
        {message}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: 0 }}>
        Please don't close this page…
      </p>
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
================================================================ */
export default function Print({ paperRef, paper, fullName, toast }) {
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(null); // null = hidden
  const mobile = isMobileDevice();

  const handleClick = () => {
    if (!fullName?.trim()) {
      toast?.('Please enter your full name before downloading.', 'err');
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = (filename) => {
    setShowModal(false);

    if (mobile) {
      executeMobilePdf({ paperRef, paper, fullName, filename, toast, setProgress });
    } else {
      executePrint({ paperRef, paper, fullName, filename, toast });
    }
  };

  const defaultFilename = (fullName || 'My_CV')
    .replace(/\s+/g, '_')
    .replace(/[^\w\-_.]/g, '') + '_CV';

  return (
    <>
      {/* Progress overlay for mobile rendering */}
      <ProgressOverlay message={progress} />

      {showModal && (
        <PrintModal
          defaultName={defaultFilename}
          paper={paper || 'a4'}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
          isMobile={mobile}
        />
      )}

      <div className="cv-prev-print" data-print-ignore="true">
        <button
          onClick={handleClick}
          style={{
            width: '100%', padding: '14px', background: '#2563eb', color: '#fff',
            border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer',
            fontSize: '0.9rem', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"
            viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download PDF
        </button>
      </div>
    </>
  );
}