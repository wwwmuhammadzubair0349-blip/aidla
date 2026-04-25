import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{a as t,l as n,o as r}from"./vendor-helmet-D-cMCI9i.js";import{nr as i,tr as a}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import"./supabase-CXCPPx9q.js";import{r as o}from"./vendor-motion-DyarDpDD.js";import{n as s}from"./index-CPLV-0JN.js";var c=e(n(),1),l=o(),u=`
/* ============================================================
   TEMPLATES PANEL — inlined
============================================================ */
.cv-tmpl-panel {
  background: rgba(255,255,255,.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.6);
  box-shadow: 0 10px 40px -10px rgba(15,23,42,.08);
  padding: 16px;
  width: 100%;
}
@media (min-width: 640px) { .cv-tmpl-panel { padding: 20px; } }

.cv-panel-h {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  gap: 8px;
  flex-wrap: wrap;
}
.cv-panel-t {
  font-family: 'Sora', sans-serif;
  font-size: .95rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -.02em;
}
.cv-cur-lbl {
  font-size: .72rem;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 99px;
  padding: 4px 12px;
  box-shadow: 0 4px 12px rgba(37,99,235,.25);
  white-space: nowrap;
}

/* Category filter */
.cv-cat-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.cv-cat-btn {
  padding: 5px 13px;
  border-radius: 99px;
  border: 1px solid rgba(15,23,42,.1);
  background: #fff;
  color: #475569;
  font-size: .72rem;
  font-weight: 700;
  transition: all .18s;
  cursor: pointer;
  min-height: 32px;
  -webkit-tap-highlight-color: transparent;
}
.cv-cat-btn:hover { background: #f8fafc; transform: translateY(-1px); }
.cv-cat-btn.on {
  background: #0f172a;
  color: #fff;
  border-color: #0f172a;
  box-shadow: 0 4px 12px rgba(15,23,42,.2);
}

/* Template grid */
.cv-tmpl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}
@media (min-width: 400px) {
  .cv-tmpl-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px; }
}

.cv-tmpl-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 14px 10px;
  border-radius: 14px;
  border: 2px solid transparent;
  background: linear-gradient(to bottom, #fff, #f8fafc);
  box-shadow: 0 4px 15px rgba(0,0,0,.04);
  transition: all .22s cubic-bezier(.4,0,.2,1);
  cursor: pointer;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}
.cv-tmpl-card:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 24px rgba(15,23,42,.08);
}
.cv-tmpl-card:active { transform: scale(.97); }
.cv-tmpl-card.on {
  background: #fff;
  border-color: transparent;
  box-shadow: 0 0 0 3px var(--ac, #3b82f6), 0 8px 22px rgba(59,130,246,.18);
}
.cv-tmpl-thumb svg {
  display: block;
  height: 62px;
  width: auto;
  filter: drop-shadow(0 3px 5px rgba(0,0,0,.06));
  transition: transform .28s ease;
}
.cv-tmpl-card:hover .cv-tmpl-thumb svg { transform: scale(1.07); }
.cv-tmpl-lbl {
  font-size: .66rem;
  font-weight: 800;
  color: #1e293b;
  text-align: center;
  line-height: 1.3;
}
`;function d(e,t){return`<svg viewBox="0 0 62 82" xmlns="http://www.w3.org/2000/svg" height="62" aria-hidden="true" focusable="false">
    ${(typeof e.thumb==`function`?e.thumb(t):``)||`
      <rect width="62" height="82" rx="4" fill="#fff"/>
      <rect x="0" y="0" width="62" height="6" fill="${t}"/>
      <rect x="8" y="14" width="26" height="4" rx="2" fill="#0f172a"/>
      <rect x="8" y="22" width="18" height="2" rx="1" fill="#94a3b8"/>
      <rect x="8" y="34" width="46" height="1.5" rx=".75" fill="#e2e8f0"/>
      <rect x="8" y="40" width="38" height="1.5" rx=".75" fill="#e2e8f0"/>
      <rect x="8" y="52" width="20" height="2" rx="1" fill="#0f172a"/>
      <rect x="8" y="58" width="46" height="1.5" rx=".75" fill="#e2e8f0"/>
    `}
  </svg>`}function f({currentTemplate:e,setTemplate:t,accent:n,activeCat:r,setActiveCat:i,TEMPLATES:a,CATS:o}){let s=r===`All`?a:a.filter(e=>e.cat===r),c=(a.find(t=>t.id===e)||{l:e}).l;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(`style`,{children:u}),(0,l.jsxs)(`div`,{className:`cv-tmpl-panel`,children:[(0,l.jsxs)(`div`,{className:`cv-panel-h`,children:[(0,l.jsx)(`span`,{className:`cv-panel-t`,children:`🌟 Premium Templates`}),(0,l.jsx)(`span`,{className:`cv-cur-lbl`,children:c})]}),(0,l.jsx)(`div`,{className:`cv-cat-row`,role:`group`,"aria-label":`Filter templates by category`,children:o.map(e=>(0,l.jsx)(`button`,{type:`button`,className:`cv-cat-btn${r===e?` on`:``}`,"aria-pressed":r===e,onClick:()=>i(e),children:e},e))}),(0,l.jsx)(`div`,{className:`cv-tmpl-grid`,role:`list`,children:s.map(r=>(0,l.jsxs)(`button`,{type:`button`,role:`listitem`,className:`cv-tmpl-card${e===r.id?` on`:``}`,style:{"--ac":n},"aria-pressed":e===r.id,"aria-label":`Select ${r.l} template`,onClick:()=>t(r.id),children:[(0,l.jsx)(`span`,{className:`cv-tmpl-thumb`,dangerouslySetInnerHTML:{__html:d(r,n)}}),(0,l.jsx)(`span`,{className:`cv-tmpl-lbl`,children:r.l})]},r.id))})]})]})}var p=e(i(),1),m={a4:{mm_w:210,mm_h:297,label:`A4`},letter:{mm_w:216,mm_h:279,label:`Letter`},legal:{mm_w:216,mm_h:356,label:`Legal`}};function h(){return/Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent)||navigator.maxTouchPoints>1&&/Macintosh/i.test(navigator.userAgent)}function g(e){let{mm_w:t,mm_h:n}=m[e]||m.a4;return`
    @page {
      size: ${t}mm ${n}mm;
      margin: 10mm 0mm;
    }
    @page :first {
      margin-top: 12mm;
    }
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
      width: ${t}mm;
    }
    .cv-doc {
      width: ${t}mm !important;
      min-height: ${n}mm !important;
      margin: 0 !important;
      padding: 0 8mm !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
    }
    .layout-swiss-clean .cv-doc,
    .layout-sidebar-dark .cv-doc,
    .layout-infographic .cv-doc,
    .layout-gulf-premium .cv-doc,
    .layout-double-col .cv-doc,
    .layout-slate-pro .cv-doc,
    .layout-dubai-pro .cv-doc,
    .layout-bold-header .cv-doc,
    .layout-coral-modern .cv-doc,
    .layout-navy-exec .cv-doc {
      padding: 0 !important;
    }
    .layout-gulf-premium .cv-doc {
      border-top: 12mm solid var(--ac) !important;
    }
    .layout-sidebar-dark .cv-sidebar {
      background: #0b1120 !important;
      color: #ffffff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .cv-item {
      page-break-inside: avoid !important;
      break-inside: avoid-page !important;
      display: block !important;
      margin-bottom: 12px;
    }
    .cv-photo-wrapper,
    .cv-sec-title,
    .cv-info-card,
    .cv-lang-item {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .cv-sec-title {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    .cv-item-header {
      page-break-after: avoid !important;
      break-after: avoid !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .cv-bullets li {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .cv-body.has-right { display: grid !important; }
    .cv-body.has-sidebar { display: block !important; }
    .cv-body.has-sidebar::after { content: ""; display: table; clear: both; }
  `}function _({paperRef:e,paper:t,filename:n,toast:r}){let i=e==null?void 0:e.current;if(!i){r==null||r(`Preview not ready — please wait.`,`err`);return}let a=i.innerHTML,{mm_w:o}=m[t]||m.a4,s=g(t),c=(n||`CV`).replace(/\s+/g,`_`).replace(/[^\w\-_.]/g,``),l=window.open(``,`_blank`,`width=960,height=700`);if(!l){r==null||r(`Please allow popups for this site to download your PDF.`,`err`);return}l.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${c}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Sora:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background: #c5cfe0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: system-ui, sans-serif;
    }
    .banner {
      width: 100%; background: #0f172a; color: #fff;
      padding: 12px 20px;
      display: flex; align-items: center;
      justify-content: space-between; gap: 12px;
      flex-wrap: wrap; position: sticky; top: 0; z-index: 100;
    }
    .banner-text { font-size: 13px; font-weight: 600; line-height: 1.5; }
    .banner-text strong { color: #fcd34d; }
    .save-btn {
      background: #2563eb; color: #fff; border: none;
      padding: 10px 22px; border-radius: 8px;
      font-size: 14px; font-weight: 800; cursor: pointer;
      white-space: nowrap; box-shadow: 0 4px 12px rgba(37,99,235,.4);
      display: flex; align-items: center; gap: 8px; flex-shrink: 0;
      font-family: system-ui, sans-serif;
    }
    .mobile-steps {
      width: 100%; background: #1e293b;
      padding: 10px 20px; display: none;
    }
    .steps-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .step { display: flex; align-items: flex-start; gap: 8px;
      font-size: 12px; color: #94a3b8; line-height: 1.4; }
    .step-num {
      background: #2563eb; color: #fff;
      width: 20px; height: 20px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; flex-shrink: 0; margin-top: 1px;
    }
    .cv-wrap {
      margin: 24px auto; width: ${o}mm;
      background: #fff;
      box-shadow: 0 8px 40px rgba(0,0,0,.25);
    }
    @media print {
      html, body { background: #fff !important; display: block !important; min-height: auto !important; }
      .banner, .mobile-steps { display: none !important; }
      .cv-wrap { margin: 0 !important; box-shadow: none !important; width: 100% !important; }
      ${s}
    }
  </style>
</head>
<body>
  <div class="banner">
    <div class="banner-text">
      📄 Your CV is ready — <strong>ATS-friendly real text PDF</strong>.
      <span id="dtip"> Set Destination → <strong>Save as PDF</strong> and uncheck <strong>Headers and footers</strong>.</span>
    </div>
    <button class="save-btn" onclick="window.print()">⬇ Save as PDF</button>
  </div>
  <div class="mobile-steps" id="msteps">
    <div class="steps-row">
      <div class="step"><div class="step-num">1</div><div><strong style="color:#e2e8f0">iOS Safari:</strong> Tap Share → Print → Pinch out → Save as PDF</div></div>
      <div class="step"><div class="step-num">2</div><div><strong style="color:#e2e8f0">Android Chrome:</strong> Tap Save as PDF above → Done</div></div>
      <div class="step"><div class="step-num">3</div><div><strong style="color:#e2e8f0">Samsung:</strong> Menu (⋮) → Print → Save as PDF</div></div>
    </div>
  </div>
  <div class="cv-wrap">${a}</div>
  <script>
    var mob = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent));
    if (mob) {
      document.getElementById('msteps').style.display = 'block';
      document.getElementById('dtip').style.display = 'none';
    } else {
      // Auto-open print dialog on desktop after fonts load
      window.addEventListener('load', function() {
        setTimeout(function() { window.print(); }, 600);
      });
    }
  <\/script>
</body>
</html>`),l.document.close()}function v({defaultName:e,paper:t,onConfirm:n,onCancel:r}){let[i,a]=(0,c.useState)(e),o=(0,c.useRef)(null),s=h();(0,c.useEffect)(()=>{var e,t;(e=o.current)==null||e.focus(),(t=o.current)==null||t.select()},[]);let u=()=>n((i==null?void 0:i.trim())||e);return(0,p.createPortal)((0,l.jsx)(`div`,{onClick:e=>e.target===e.currentTarget&&r(),style:{position:`fixed`,inset:0,zIndex:999999,background:`rgba(15,23,42,0.65)`,backdropFilter:`blur(6px)`,display:`flex`,alignItems:`center`,justifyContent:`center`,padding:`16px`},children:(0,l.jsxs)(`div`,{style:{background:`#fff`,borderRadius:`20px`,width:`100%`,maxWidth:`440px`,boxShadow:`0 24px 60px rgba(0,0,0,0.25)`,overflow:`hidden`,maxHeight:`calc(100vh - 32px)`,display:`flex`,flexDirection:`column`},children:[(0,l.jsxs)(`div`,{style:{background:`linear-gradient(135deg,#0f172a,#1e3a8a)`,padding:`20px 24px`,display:`flex`,alignItems:`center`,gap:`12px`,flexShrink:0},children:[(0,l.jsx)(`div`,{style:{width:`40px`,height:`40px`,borderRadius:`10px`,background:`rgba(255,255,255,0.12)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:`1.2rem`,flexShrink:0},children:`📄`}),(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`div`,{style:{color:`#fff`,fontWeight:800,fontSize:`1rem`},children:`Save CV as PDF`}),(0,l.jsx)(`div`,{style:{color:`rgba(255,255,255,0.6)`,fontSize:`0.75rem`,marginTop:`2px`},children:`ATS-friendly · Real text · Works everywhere`})]})]}),(0,l.jsxs)(`div`,{style:{padding:`20px 24px`,overflowY:`auto`,flex:1},children:[(0,l.jsxs)(`div`,{style:{background:`#f0fdf4`,border:`1px solid #86efac`,borderRadius:`10px`,padding:`10px 14px`,marginBottom:`16px`,fontSize:`0.78rem`,color:`#166534`,display:`flex`,alignItems:`flex-start`,gap:`8px`,lineHeight:1.55},children:[(0,l.jsx)(`span`,{style:{fontSize:`1rem`,flexShrink:0},children:`✅`}),(0,l.jsxs)(`span`,{children:[(0,l.jsx)(`strong`,{children:`100% ATS-Friendly.`}),` Real text PDF — recruiters' systems can read every word. Not a screenshot.`]})]}),(0,l.jsx)(`label`,{style:{display:`block`,fontSize:`0.72rem`,fontWeight:800,color:`#334155`,marginBottom:`6px`,textTransform:`uppercase`,letterSpacing:`0.06em`},children:`File Name`}),(0,l.jsxs)(`div`,{style:{position:`relative`,marginBottom:`16px`},children:[(0,l.jsx)(`input`,{ref:o,value:i,onChange:e=>a(e.target.value),onKeyDown:e=>e.key===`Enter`&&u(),style:{width:`100%`,padding:`11px 48px 11px 14px`,borderRadius:`10px`,border:`2px solid #e2e8f0`,fontSize:`0.9rem`,outline:`none`,boxSizing:`border-box`,fontWeight:600,color:`#0f172a`,transition:`border-color 0.2s`},onFocus:e=>e.target.style.borderColor=`#2563eb`,onBlur:e=>e.target.style.borderColor=`#e2e8f0`}),(0,l.jsx)(`span`,{style:{position:`absolute`,right:`14px`,top:`50%`,transform:`translateY(-50%)`,fontSize:`0.72rem`,color:`#94a3b8`,fontWeight:700},children:`.pdf`})]}),s?(0,l.jsxs)(`div`,{style:{background:`#eff6ff`,border:`1px solid #bfdbfe`,borderRadius:`10px`,padding:`12px 14px`,marginBottom:`20px`,fontSize:`0.75rem`,color:`#1e40af`,lineHeight:1.6},children:[(0,l.jsx)(`strong`,{children:`📱 Mobile:`}),` A preview opens in a new tab. Tap `,(0,l.jsx)(`strong`,{children:`"Save as PDF"`}),` at the top, or use your browser's Share / Print menu.`]}):(0,l.jsxs)(`div`,{style:{background:`#f8fafc`,border:`1px solid #e2e8f0`,borderRadius:`10px`,padding:`12px 14px`,marginBottom:`20px`,fontSize:`0.75rem`,color:`#334155`,lineHeight:1.6},children:[(0,l.jsx)(`strong`,{children:`💡 Tip:`}),` The print dialog opens automatically. Set `,(0,l.jsx)(`strong`,{children:`Destination → Save as PDF`}),` and uncheck `,(0,l.jsx)(`strong`,{children:`"Headers and footers"`}),`.`]}),(0,l.jsxs)(`div`,{style:{display:`flex`,gap:`10px`},children:[(0,l.jsx)(`button`,{onClick:r,style:{flex:1,padding:`12px`,background:`#f1f5f9`,color:`#475569`,border:`none`,borderRadius:`10px`,fontWeight:700,cursor:`pointer`,fontSize:`0.88rem`},children:`Cancel`}),(0,l.jsxs)(`button`,{onClick:u,style:{flex:2,padding:`12px`,background:`linear-gradient(135deg,#1e3a8a,#2563eb)`,color:`#fff`,border:`none`,borderRadius:`10px`,fontWeight:800,cursor:`pointer`,fontSize:`0.88rem`,boxShadow:`0 4px 14px rgba(37,99,235,0.35)`,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:`8px`},children:[(0,l.jsxs)(`svg`,{width:`16`,height:`16`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,viewBox:`0 0 24 24`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,l.jsx)(`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`}),(0,l.jsx)(`polyline`,{points:`7 10 12 15 17 10`}),(0,l.jsx)(`line`,{x1:`12`,y1:`15`,x2:`12`,y2:`3`})]}),`Save as PDF`]})]})]})]})}),document.body)}function y({paperRef:e,paper:t,fullName:n,toast:r}){let[i,a]=(0,c.useState)(!1),o=()=>{if(!(n!=null&&n.trim())){r==null||r(`Please enter your full name before downloading.`,`err`);return}a(!0)},s=n=>{a(!1),_({paperRef:e,paper:t,filename:n,toast:r})},u=(n||`My_CV`).replace(/\s+/g,`_`).replace(/[^\w\-_.]/g,``)+`_CV`;return(0,l.jsxs)(l.Fragment,{children:[i&&(0,l.jsx)(v,{defaultName:u,paper:t||`a4`,onConfirm:s,onCancel:()=>a(!1)}),(0,l.jsx)(`div`,{"data-print-ignore":`true`,style:{width:`100%`},children:(0,l.jsxs)(`button`,{onClick:o,style:{width:`100%`,padding:`14px`,background:`linear-gradient(135deg,#1e3a8a,#2563eb)`,color:`#fff`,border:`none`,borderRadius:`12px`,fontWeight:800,cursor:`pointer`,fontSize:`0.9rem`,boxShadow:`0 6px 20px rgba(37,99,235,0.35)`,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:`8px`,transition:`all 0.2s`},onMouseOver:e=>e.currentTarget.style.transform=`translateY(-2px)`,onMouseOut:e=>e.currentTarget.style.transform=`translateY(0)`,children:[(0,l.jsxs)(`svg`,{width:`18`,height:`18`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,viewBox:`0 0 24 24`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,l.jsx)(`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`}),(0,l.jsx)(`polyline`,{points:`7 10 12 15 17 10`}),(0,l.jsx)(`line`,{x1:`12`,y1:`15`,x2:`12`,y2:`3`})]}),`Download PDF`]})})]})}var b=`
/* ============================================================
   PREVIEW PANEL — inlined
============================================================ */

/* ── Controls strip above preview ── */
.cv-prev-ctrls {
  background: rgba(255,255,255,.94);
  border: 1px solid var(--border);
  border-radius: var(--r) var(--r) 0 0;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cv-ctrl-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.cv-ctrl-lbl {
  font-size: .6rem;
  font-weight: 800;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: .06em;
  min-width: 46px;
  flex-shrink: 0;
}

/* Accent dots */
.cv-dots { display: flex; gap: 7px; align-items: center; flex-wrap: wrap; }
.cv-dot {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,.15);
  cursor: pointer;
  transition: transform .18s;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
}
.cv-dot:hover { transform: scale(1.25); }
.cv-dot.on { outline: 3px solid #0f172a; outline-offset: 2px; }

/* Toggle buttons (font / paper / size) */
.cv-tog-g { display: flex; gap: 5px; flex-wrap: wrap; }
.cv-tog {
  padding: 5px 11px;
  background: #f1f5f9;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: .68rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: .16s;
  min-height: 30px;
  -webkit-tap-highlight-color: transparent;
}
.cv-tog:hover { background: #e2e8f0; }
.cv-tog.on { background: #0f172a; color: #fff; box-shadow: 0 3px 9px rgba(15,23,42,.18); }

/* ── Preview header bar ── */
.cv-prev-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 11px;
  background: rgba(255,255,255,.92);
  border: 1px solid var(--border);
  border-top: none;
  border-bottom: none;
  font-size: .7rem;
  font-weight: 700;
  color: #1e3a8a;
}
.cv-prev-zoom {
  display: flex;
  gap: 4px;
  align-items: center;
}
.cv-prev-zoom-value {
  font-size: .65rem;
  font-weight: 700;
  min-width: 32px;
  text-align: center;
  color: #0f172a;
}
.cv-zoom-btn {
  width: 28px; height: 28px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: #fff;
  font-size: .85rem;
  font-weight: 700;
  color: #1e3a8a;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .12s;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
}
.cv-zoom-btn:hover { background: #eff6ff; }

/* ── Scrollable canvas ── */
.cv-prev-scroll {
  background: #c5cfe0;
  padding: 10px;
  border: 1px solid var(--border);
  border-top: none;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  /* mobile: comfortable height */
  max-height: 52vh;
  width: 100%;
  scrollbar-width: thin;
  scrollbar-color: rgba(37,99,235,.3) transparent;
}
@media (min-width: 640px) { .cv-prev-scroll { max-height: 60vh; } }
@media (min-width: 960px) { .cv-prev-scroll { max-height: 70vh; } }
.cv-prev-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
.cv-prev-scroll::-webkit-scrollbar-thumb { background: rgba(37,99,235,.3); border-radius: 99px; }

.cv-prev-scale {
  position: relative;
  flex-shrink: 0;
  display: inline-block;
}
#cv-paper {
  background: #fff;
  box-shadow: 0 3px 20px rgba(15,23,42,.16);
  transform-origin: top left;
}

/* ── Download strip below preview ── */
.cv-prev-download {
  background: rgba(255,255,255,.94);
  border: 1px solid var(--border);
  border-top: none;
  border-radius: 0 0 var(--r) var(--r);
  padding: 10px 12px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}
`;function x({cvHtml:e,zoom:t,setZoom:n,fitZoom:r,paperRef:i,prevScrollRef:a,accent:o,setAccent:s,fontId:u,setFontId:d,fontSize:f,setFontSize:p,paper:m,setPaper:h,ACCENTS:g,FONTS:_,FSIZES:v,PAPERS:x,fullName:S,toast:C}){let w=(0,c.useRef)(!1),T=(0,c.useCallback)(()=>{let e=a==null?void 0:a.current,r=i==null?void 0:i.current;if(!e||!r)return;let o=e.clientWidth-20,s=e.clientHeight-20,c=r.offsetWidth,l=r.offsetHeight;if(!c||!l)return;let u=+Math.min(1.4,Math.max(.25,Math.min(o/c,s/l))).toFixed(2);u!==t&&n(u),w.current=!0},[a,i,t,n]);return(0,c.useEffect)(()=>{let e=()=>{w.current&&T()};return window.addEventListener(`resize`,e),()=>window.removeEventListener(`resize`,e)},[T]),(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(`style`,{children:b}),(0,l.jsxs)(`div`,{className:`cv-prev-ctrls`,children:[(0,l.jsxs)(`div`,{className:`cv-ctrl-row`,children:[(0,l.jsx)(`span`,{className:`cv-ctrl-lbl`,children:`Colour`}),(0,l.jsx)(`div`,{className:`cv-dots`,children:g.map(e=>(0,l.jsx)(`button`,{type:`button`,className:`cv-dot${o===e?` on`:``}`,style:{background:e},"aria-label":`Accent colour ${e}`,"aria-pressed":o===e,onClick:()=>s(e)},e))})]}),(0,l.jsxs)(`div`,{className:`cv-ctrl-row`,children:[(0,l.jsx)(`span`,{className:`cv-ctrl-lbl`,children:`Font`}),(0,l.jsx)(`div`,{className:`cv-tog-g`,children:_.map(e=>(0,l.jsx)(`button`,{type:`button`,className:`cv-tog${u===e.id?` on`:``}`,"aria-pressed":u===e.id,onClick:()=>d(e.id),children:e.l},e.id))})]}),(0,l.jsxs)(`div`,{className:`cv-ctrl-row`,children:[(0,l.jsx)(`span`,{className:`cv-ctrl-lbl`,children:`Size`}),(0,l.jsx)(`div`,{className:`cv-tog-g`,children:Object.keys(v).map(e=>(0,l.jsx)(`button`,{type:`button`,className:`cv-tog${f===e?` on`:``}`,"aria-pressed":f===e,onClick:()=>p(e),children:e.charAt(0).toUpperCase()+e.slice(1)},e))})]}),(0,l.jsxs)(`div`,{className:`cv-ctrl-row`,children:[(0,l.jsx)(`span`,{className:`cv-ctrl-lbl`,children:`Paper`}),(0,l.jsx)(`div`,{className:`cv-tog-g`,children:Object.entries(x).map(([e,t])=>(0,l.jsx)(`button`,{type:`button`,className:`cv-tog${m===e?` on`:``}`,"aria-pressed":m===e,onClick:()=>h(e),children:t.l},e))})]})]}),(0,l.jsxs)(`div`,{className:`cv-prev-header`,children:[(0,l.jsx)(`span`,{children:`Live Preview`}),(0,l.jsxs)(`div`,{className:`cv-prev-zoom`,children:[(0,l.jsx)(`button`,{className:`cv-zoom-btn`,onClick:()=>n(e=>Math.max(.25,+(e-.1).toFixed(2))),"aria-label":`Zoom out`,children:`−`}),(0,l.jsxs)(`span`,{className:`cv-prev-zoom-value`,"aria-live":`polite`,"aria-label":`Zoom ${Math.round(t*100)}%`,children:[Math.round(t*100),`%`]}),(0,l.jsx)(`button`,{className:`cv-zoom-btn`,onClick:()=>n(e=>Math.min(1.4,+(e+.1).toFixed(2))),"aria-label":`Zoom in`,children:`+`}),(0,l.jsx)(`button`,{className:`cv-zoom-btn`,style:{fontSize:`.58rem`,width:`auto`,padding:`0 7px`},onClick:r,"aria-label":`Fit to window`,children:`Fit`})]})]}),(0,l.jsx)(`div`,{className:`cv-prev-scroll`,ref:a,children:(0,l.jsx)(`div`,{className:`cv-prev-scale`,children:(0,l.jsx)(`div`,{id:`cv-paper`,ref:i,style:{transform:`scale(${t})`,transformOrigin:`top left`},dangerouslySetInnerHTML:{__html:e}})})}),(0,l.jsx)(`div`,{className:`cv-prev-download`,children:(0,l.jsx)(y,{paperRef:i,paper:m,fullName:S,toast:C})})]})}var S={modernStack:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="62" height="4" fill="${e}"/>
    <rect x="8" y="10" width="28" height="4" rx="2" fill="#0f172a"/>
    <rect x="8" y="17" width="18" height="2" rx="1" fill="${e}"/>
    <circle cx="46" cy="15" r="8" fill="${e}" opacity="0.15"/>
    <rect x="8" y="30" width="46" height="1" fill="#e2e8f0"/>
    <rect x="8" y="36" width="20" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="42" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="46" width="38" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="56" width="16" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="62" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
  `,pureWhite:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="25" y="8" width="12" height="12" rx="3" fill="#e5e7eb"/>
    <rect x="11" y="24" width="40" height="3" rx="1.5" fill="#0f172a"/>
    <rect x="19" y="30" width="24" height="1.5" rx="0.75" fill="${e}"/>
    <rect x="8" y="42" width="46" height="1" fill="#e2e8f0"/>
    <rect x="23" y="48" width="16" height="1.5" rx="0.75" fill="#0f172a"/>
    <rect x="15" y="54" width="32" height="1" rx="0.5" fill="#94a3b8"/>
  `,swissClean:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="20" height="82" fill="#f8fafc"/>
    <rect x="19" y="0" width="1" height="82" fill="#e2e8f0"/>
    <rect x="4" y="8" width="12" height="12" rx="2" fill="#e2e8f0"/>
    <rect x="26" y="8" width="26" height="4" rx="1" fill="#0f172a"/>
    <rect x="26" y="16" width="14" height="1.5" rx="0.75" fill="${e}"/>
    <rect x="26" y="30" width="18" height="2" rx="1" fill="#0f172a"/>
    <rect x="26" y="36" width="28" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="26" y="41" width="22" height="1.5" rx="0.75" fill="#e2e8f0"/>
  `,inkLine:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="8" y="10" width="26" height="3" rx="1" fill="#0f172a"/>
    <circle cx="48" cy="14" r="7" fill="#e5e7eb"/>
    <rect x="8" y="26" width="46" height="1" fill="#e2e8f0"/>
    <rect x="8" y="34" width="2" height="12" fill="${e}"/>
    <rect x="14" y="34" width="16" height="1.5" fill="#0f172a"/>
    <rect x="14" y="39" width="36" height="1.5" fill="#e2e8f0"/>
    <rect x="14" y="44" width="30" height="1.5" fill="#e2e8f0"/>
  `,sidebarDark:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="22" height="82" fill="#0f172a"/>
    <circle cx="11" cy="14" r="6" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <rect x="5" y="26" width="12" height="1.5" rx="0.5" fill="rgba(255,255,255,0.8)"/>
    <rect x="5" y="30" width="8" height="1" rx="0.5" fill="${e}"/>
    <rect x="28" y="10" width="24" height="3" rx="1" fill="#0f172a"/>
    <rect x="28" y="24" width="16" height="1.5" rx="0.5" fill="#0f172a"/>
    <rect x="28" y="30" width="26" height="1.5" rx="0.5" fill="#e2e8f0"/>
    <rect x="28" y="35" width="20" height="1.5" rx="0.5" fill="#e2e8f0"/>
  `,gulfPremium:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="62" height="6" fill="${e}"/>
    <rect x="8" y="14" width="28" height="4" rx="1" fill="#0f172a"/>
    <rect x="8" y="21" width="16" height="1.5" rx="0.75" fill="#94a3b8"/>
    <circle cx="48" cy="18" r="8" fill="#f1f5f9"/>
    <rect x="8" y="34" width="24" height="1.5" fill="${e}"/>
    <rect x="8" y="40" width="26" height="1.5" rx="0.5" fill="#e2e8f0"/>
    <rect x="38" y="34" width="16" height="1.5" fill="${e}"/>
    <rect x="38" y="40" width="16" height="1.5" rx="0.5" fill="#e2e8f0"/>
  `,infographic:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="24" height="82" fill="#f8fafc"/>
    <rect x="0" y="0" width="24" height="28" fill="${e}"/>
    <rect x="4" y="6" width="16" height="16" rx="4" fill="rgba(255,255,255,0.2)"/>
    <rect x="4" y="36" width="16" height="4" rx="1" fill="#fff" stroke="#e2e8f0" stroke-width="0.5"/>
    <rect x="4" y="42" width="16" height="4" rx="1" fill="#fff" stroke="#e2e8f0" stroke-width="0.5"/>
    <rect x="30" y="10" width="24" height="3" rx="1.5" fill="#0f172a"/>
    <rect x="30" y="24" width="16" height="2" rx="1" fill="#0f172a"/>
    <rect x="30" y="30" width="24" height="1.5" rx="0.5" fill="#e2e8f0"/>
    <rect x="30" y="35" width="18" height="1.5" rx="0.5" fill="#e2e8f0"/>
  `,diamond:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="62" height="2" fill="${e}"/>
    <rect x="0" y="80" width="62" height="2" fill="${e}"/>
    <rect x="22" y="8" width="18" height="18" rx="9" fill="#f1f5f9"/>
    <rect x="10" y="30" width="42" height="3" rx="1.5" fill="#0f172a"/>
    <rect x="18" y="36" width="26" height="1.5" rx="0.75" fill="${e}"/>
    <rect x="8" y="44" width="46" height="0.75" fill="#e2e8f0"/>
    <rect x="8" y="50" width="14" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="55" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="59" width="38" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="67" width="14" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="72" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
  `,ivyLeague:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="8" y="8" width="30" height="4" rx="1" fill="#0f172a"/>
    <rect x="8" y="15" width="18" height="1.5" rx="0.75" fill="${e}"/>
    <rect x="8" y="20" width="26" height="1" rx="0.5" fill="#94a3b8"/>
    <rect x="8" y="28" width="46" height="0.75" fill="#0f172a"/>
    <rect x="8" y="34" width="26" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="39" width="26" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="43" width="26" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="38" y="34" width="16" height="2" rx="1" fill="${e}"/>
    <rect x="38" y="39" width="16" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="38" y="43" width="16" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="38" y="50" width="16" height="2" rx="1" fill="${e}"/>
    <rect x="38" y="55" width="16" height="1.5" rx="0.75" fill="#e2e8f0"/>
  `,doubleCol:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="62" height="20" fill="${e}"/>
    <rect x="8" y="6" width="28" height="4" rx="1" fill="#fff"/>
    <rect x="8" y="13" width="16" height="1.5" rx="0.75" fill="rgba(255,255,255,0.7)"/>
    <circle cx="50" cy="12" r="6" fill="rgba(255,255,255,0.2)"/>
    <rect x="8" y="26" width="24" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="31" width="24" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="35" width="24" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="35" y="26" width="19" height="2" rx="1" fill="#0f172a"/>
    <rect x="35" y="31" width="19" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="35" y="35" width="14" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="45" width="24" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="50" width="24" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="35" y="45" width="19" height="2" rx="1" fill="${e}" opacity="0.8"/>
    <rect x="35" y="50" width="14" height="1.5" rx="0.75" fill="#e2e8f0"/>
  `,navyExec:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="5" height="82" fill="#0b1437"/>
    <rect x="10" y="8" width="32" height="4" rx="1" fill="#0f172a"/>
    <rect x="10" y="16" width="20" height="1.5" rx="0.75" fill="${e}"/>
    <rect x="10" y="21" width="28" height="1" rx="0.5" fill="#94a3b8"/>
    <rect x="10" y="30" width="44" height="0.75" fill="#e2e8f0"/>
    <rect x="10" y="36" width="18" height="2" rx="1" fill="#0f172a"/>
    <rect x="10" y="41" width="44" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="10" y="45" width="36" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="10" y="55" width="18" height="2" rx="1" fill="#0f172a"/>
    <rect x="10" y="60" width="44" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="10" y="64" width="30" height="1.5" rx="0.75" fill="#e2e8f0"/>
  `,timelinePro:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="8" y="8" width="30" height="4" rx="1" fill="#0f172a"/>
    <rect x="8" y="15" width="20" height="1.5" rx="0.75" fill="${e}"/>
    <rect x="8" y="24" width="46" height="0.75" fill="#e2e8f0"/>
    <rect x="8" y="30" width="14" height="2" rx="1" fill="#0f172a"/>
    <line x1="14" y1="37" x2="14" y2="70" stroke="#e2e8f0" stroke-width="1"/>
    <circle cx="14" cy="37" r="2.5" fill="${e}"/>
    <rect x="20" y="35" width="22" height="1.5" rx="0.75" fill="#0f172a"/>
    <rect x="20" y="39" width="30" height="1" rx="0.5" fill="#e2e8f0"/>
    <circle cx="14" cy="50" r="2.5" fill="${e}" opacity="0.5"/>
    <rect x="20" y="48" width="22" height="1.5" rx="0.75" fill="#0f172a"/>
    <rect x="20" y="52" width="30" height="1" rx="0.5" fill="#e2e8f0"/>
    <circle cx="14" cy="63" r="2.5" fill="${e}" opacity="0.3"/>
    <rect x="20" y="61" width="22" height="1.5" rx="0.75" fill="#0f172a"/>
    <rect x="20" y="65" width="26" height="1" rx="0.5" fill="#e2e8f0"/>
  `,coralModern:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="62" height="22" fill="${e}" opacity="0.12"/>
    <rect x="0" y="0" width="62" height="3" fill="${e}"/>
    <rect x="8" y="8" width="28" height="4" rx="1" fill="#0f172a"/>
    <rect x="8" y="15" width="18" height="1.5" rx="0.75" fill="${e}"/>
    <rect x="8" y="29" width="46" height="0.75" fill="#e2e8f0"/>
    <rect x="8" y="35" width="16" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="41" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="45" width="38" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="55" width="16" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="61" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="65" width="32" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="72" width="22" height="3" rx="1.5" fill="${e}" opacity="0.15"/>
    <rect x="32" y="72" width="14" height="3" rx="1.5" fill="${e}" opacity="0.15"/>
  `,slatePro:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="62" height="28" fill="#1e293b"/>
    <rect x="8" y="7" width="28" height="4" rx="1" fill="#fff"/>
    <rect x="8" y="14" width="16" height="1.5" rx="0.75" fill="${e}"/>
    <rect x="8" y="19" width="30" height="1" rx="0.5" fill="rgba(255,255,255,0.3)"/>
    <circle cx="50" cy="14" r="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <rect x="8" y="35" width="16" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="41" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="45" width="38" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="55" width="16" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="61" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="65" width="28" height="1.5" rx="0.75" fill="#e2e8f0"/>
  `,compactAts:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="8" y="8" width="34" height="5" rx="1" fill="#0f172a"/>
    <rect x="8" y="16" width="20" height="1.5" rx="0.75" fill="${e}"/>
    <rect x="8" y="20" width="46" height="1" rx="0.5" fill="#94a3b8"/>
    <rect x="8" y="27" width="46" height="0.5" fill="#0f172a"/>
    <rect x="8" y="31" width="12" height="1.5" rx="0.75" fill="#0f172a"/>
    <rect x="8" y="35" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="39" width="40" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="46" width="12" height="1.5" rx="0.75" fill="#0f172a"/>
    <rect x="8" y="50" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="54" width="36" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="61" width="12" height="1.5" rx="0.75" fill="#0f172a"/>
    <rect x="8" y="65" width="20" height="2" rx="1" fill="${e}" opacity="0.15"/>
    <rect x="30" y="65" width="14" height="2" rx="1" fill="${e}" opacity="0.15"/>
  `,boldHeader:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="62" height="32" fill="#f8fafc"/>
    <rect x="4" y="8" width="54" height="6" rx="1" fill="#0f172a"/>
    <rect x="4" y="17" width="30" height="2" rx="1" fill="${e}"/>
    <rect x="4" y="22" width="54" height="1" rx="0.5" fill="#94a3b8"/>
    <rect x="4" y="38" width="3" height="14" rx="1" fill="${e}"/>
    <rect x="10" y="38" width="18" height="2" rx="1" fill="#0f172a"/>
    <rect x="10" y="43" width="44" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="10" y="47" width="38" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="4" y="58" width="3" height="14" rx="1" fill="${e}" opacity="0.5"/>
    <rect x="10" y="58" width="18" height="2" rx="1" fill="#0f172a"/>
    <rect x="10" y="63" width="44" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="10" y="67" width="32" height="1.5" rx="0.75" fill="#e2e8f0"/>
  `,dubaiPro:e=>`
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="62" height="5" fill="${e}"/>
    <rect x="0" y="5" width="62" height="18" fill="#f8fafc"/>
    <rect x="8" y="9" width="26" height="4" rx="1" fill="#0f172a"/>
    <rect x="8" y="16" width="14" height="1.5" rx="0.75" fill="${e}"/>
    <circle cx="50" cy="14" r="7" fill="#e2e8f0"/>
    <rect x="8" y="28" width="33" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="33" width="33" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="37" width="33" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="44" width="33" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="49" width="33" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="53" width="33" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="44" y="28" width="14" height="2" rx="1" fill="${e}"/>
    <rect x="44" y="33" width="14" height="2" rx="1" fill="#e2e8f0"/>
    <rect x="44" y="37" width="14" height="2" rx="1" fill="#e2e8f0"/>
    <rect x="44" y="42" width="14" height="2" rx="1" fill="#e2e8f0"/>
    <rect x="44" y="47" width="14" height="2" rx="1" fill="${e}" opacity="0.4"/>
    <rect x="44" y="52" width="14" height="2" rx="1" fill="#e2e8f0"/>
  `};const C=[{id:`modern-stack`,l:`Modern Stack`,cat:`Corporate`,thumb:S.modernStack},{id:`pure-white`,l:`Pure White`,cat:`Minimal`,thumb:S.pureWhite},{id:`swiss-clean`,l:`Swiss Clean`,cat:`Corporate`,thumb:S.swissClean},{id:`ink-line`,l:`Ink Line`,cat:`Minimal`,thumb:S.inkLine},{id:`sidebar-dark`,l:`Sidebar Dark`,cat:`Executive`,thumb:S.sidebarDark},{id:`gulf-premium`,l:`Gulf Premium`,cat:`Premium`,thumb:S.gulfPremium},{id:`infographic`,l:`Infographic Split`,cat:`Creative`,thumb:S.infographic},{id:`diamond`,l:`Diamond`,cat:`Minimal`,thumb:S.diamond},{id:`ivy-league`,l:`Ivy League`,cat:`Academic`,thumb:S.ivyLeague},{id:`double-col`,l:`Double Column`,cat:`Corporate`,thumb:S.doubleCol},{id:`navy-exec`,l:`Navy Executive`,cat:`Executive`,thumb:S.navyExec},{id:`timeline-pro`,l:`Timeline Pro`,cat:`Corporate`,thumb:S.timelinePro},{id:`coral-modern`,l:`Coral Modern`,cat:`Creative`,thumb:S.coralModern},{id:`slate-pro`,l:`Slate Pro`,cat:`Executive`,thumb:S.slatePro},{id:`compact-ats`,l:`Compact ATS`,cat:`Minimal`,thumb:S.compactAts},{id:`bold-header`,l:`Bold Header`,cat:`Premium`,thumb:S.boldHeader},{id:`dubai-pro`,l:`Dubai Pro`,cat:`Premium`,thumb:S.dubaiPro}],w=[`All`,...new Set(C.map(e=>e.cat))];var T={"modern-stack":{header:[`profile`,`photo`],main:[`summary`,`exp`,`edu`,`projects`,`skills`,`certs`,`langs`,`awards`,`refs`,`hobbies`]},"pure-white":{header:[`photo`,`profile`],main:[`summary`,`exp`,`edu`,`projects`,`skills`,`certs`,`langs`,`awards`,`refs`]},"swiss-clean":{sidebar:[`photo`,`profile`,`skills`,`langs`,`certs`],main:[`summary`,`exp`,`edu`,`projects`,`awards`,`refs`,`hobbies`]},"ink-line":{header:[`profile`,`photo`],main:[`summary`,`exp`,`edu`,`projects`,`skills`,`certs`,`langs`,`awards`]},"sidebar-dark":{sidebar:[`photo`,`profile`,`skills`,`langs`],main:[`summary`,`exp`,`edu`,`projects`,`certs`,`awards`,`refs`,`hobbies`]},"gulf-premium":{header:[`profile`,`photo`],main:[`summary`,`exp`,`edu`,`projects`],right:[`skills`,`certs`,`langs`,`awards`,`refs`]},infographic:{sidebar:[`<div class="cv-info-card">`,`photo`,`profile`,`</div>`,`<div class="cv-info-pad">`,`skills`,`langs`,`</div>`],main:[`summary`,`exp`,`edu`,`projects`,`certs`,`awards`,`refs`]},diamond:{header:[`photo`,`profile`],main:[`summary`,`exp`,`edu`,`projects`,`skills`,`certs`,`langs`,`awards`,`refs`,`hobbies`]},"ivy-league":{header:[`profile`],main:[`summary`,`exp`,`edu`,`projects`,`awards`],right:[`skills`,`certs`,`langs`,`refs`,`hobbies`]},"double-col":{header:[`profile`,`photo`],main:[`summary`,`exp`,`edu`,`projects`],right:[`skills`,`langs`,`certs`,`awards`,`refs`,`hobbies`]},"navy-exec":{header:[`profile`,`photo`],main:[`summary`,`exp`,`edu`,`projects`,`skills`,`certs`,`langs`,`awards`,`refs`,`hobbies`]},"timeline-pro":{header:[`profile`,`photo`],main:[`summary`,`exp`,`edu`,`projects`,`skills`,`certs`,`langs`,`awards`,`refs`]},"coral-modern":{header:[`profile`,`photo`],main:[`summary`,`exp`,`edu`,`projects`,`skills`,`certs`,`langs`,`awards`,`refs`,`hobbies`]},"slate-pro":{header:[`profile`,`photo`],main:[`summary`,`exp`,`edu`,`projects`],right:[`skills`,`langs`,`certs`,`awards`,`refs`,`hobbies`]},"compact-ats":{header:[`profile`],main:[`summary`,`exp`,`edu`,`skills`,`projects`,`certs`,`langs`,`awards`,`refs`,`hobbies`]},"bold-header":{header:[`profile`,`photo`],main:[`summary`,`exp`,`edu`,`projects`,`skills`,`certs`,`langs`,`awards`,`refs`,`hobbies`]},"dubai-pro":{header:[`profile`,`photo`],main:[`summary`,`exp`,`edu`,`projects`,`awards`],right:[`skills`,`langs`,`certs`,`refs`,`hobbies`]}},ee={"modern-stack":`
    .cv-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid var(--ac); padding-bottom: 20px; margin-bottom: 24px; }
    .cv-profile-text { flex: 1; padding-right: 20px; }
    .cv-photo-wrapper { width: 95px; height: 95px; border-radius: 50%; border: 3px solid rgba(var(--ac-rgb), 0.15); }
    .cv-sec-title { border-bottom: 1.5px solid rgba(var(--ac-rgb), 0.2); padding-bottom: 6px; margin-bottom: 14px; color: var(--text); page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
  `,"pure-white":`
    .cv-doc { padding: 45px; }
    .cv-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; margin-bottom: 35px; }
    .cv-contact-row { justify-content: center; }
    .cv-photo-wrapper { width: 90px; height: 90px; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .cv-sec-title { text-align: center; letter-spacing: 0.2em; color: var(--muted); border-bottom: 1px solid var(--line); padding-bottom: 10px; margin-bottom: 20px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-item-header { flex-direction: column; align-items: center; text-align: center; gap: 4px; }
    .cv-item-date { text-align: center; }
  `,"swiss-clean":`
    .cv-doc { padding: 0; }
    .cv-body { display: block; }
    .cv-body::after { content: ""; display: table; clear: both; }
    .cv-sidebar { float: left; width: 260px; box-sizing: border-box; background: #f8fafc; padding: 35px 25px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); border-bottom-right-radius: 24px; margin: 0 35px 20px 0; min-height: 92vh; }
    .cv-main { display: block; padding: 35px; }
    .cv-photo-wrapper { width: 140px; height: 140px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 6px 16px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.05); }
    .cv-name { font-size: 2.2em; color: var(--text); }
    .cv-role { color: var(--ac); }
    .cv-contact-row { flex-direction: column; gap: 10px; margin-top: 15px; }
    .cv-sidebar .cv-sec-title { margin-top: 30px; font-size: 0.85em; }
    .cv-skills-list li { background: rgba(var(--ac-rgb), 0.08); width: 100%; border-radius: 6px; padding: 8px 12px; }
    .cv-sec-title { page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
  `,"ink-line":`
    .cv-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 25px; margin-bottom: 25px; }
    .cv-name { font-weight: 300; letter-spacing: -0.02em; }
    .cv-photo-wrapper { width: 85px; height: 85px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .cv-sec-title { color: var(--ac); display: flex; align-items: center; gap: 10px; margin-bottom: 16px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title::after { content: ""; flex: 1; height: 1px; background: var(--line); }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-section { border-left: 2px solid rgba(var(--ac-rgb), 0.2); padding-left: 18px; margin-left: 4px; }
  `,"sidebar-dark":`
    .cv-doc { padding: 0; background: #ffffff; }
    .cv-body { display: block; }
    .cv-body::after { content: ""; display: table; clear: both; }
    .cv-sidebar { float: left; width: 260px; box-sizing: border-box; background: #0b1120; color: #f8fafc; padding: 35px 25px; margin: 0 35px 25px 0; border-bottom-right-radius: 32px; min-height: 92vh; }
    .cv-main { display: block; padding: 35px; }
    .cv-photo-wrapper { width: 120px; height: 120px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.15); margin-bottom: 25px; }
    .cv-name { color: #ffffff; font-size: 2em; }
    .cv-role { color: var(--ac); filter: brightness(1.3); }
    .cv-contact-row { flex-direction: column; gap: 12px; margin-top: 20px; color: #94a3b8; }
    .cv-sidebar .cv-sec-title { color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); margin-top: 35px; }
    .cv-skills-list li { background: rgba(255,255,255,0.1); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.05); }
    .cv-lang-name { color: #cbd5e1; }
    .cv-lang-bar { background: rgba(255,255,255,0.1); }
    .cv-sec-title { page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
  `,"gulf-premium":`
    .cv-doc { border-top: 16px solid var(--ac); padding-top: 30px; }
    .cv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 35px; }
    .cv-name { font-size: 2.6em; font-weight: 800; letter-spacing: -0.03em; color: var(--text); }
    .cv-role { font-weight: 600; color: var(--muted); letter-spacing: 0.15em; }
    .cv-photo-wrapper { width: 100px; height: 100px; border-radius: 50%; box-shadow: 0 10px 25px rgba(var(--ac-rgb), 0.2); border: 2px solid #fff; }
    .cv-body.has-right { display: grid; grid-template-columns: 1fr 230px; gap: 40px; }
    .cv-sec-title { font-weight: 800; color: var(--ac); border-bottom: 2px solid rgba(var(--ac-rgb), 0.1); padding-bottom: 6px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-exp-item { position: relative; padding-left: 20px; border-left: 1px solid rgba(var(--ac-rgb), 0.2); }
    .cv-exp-item::before { content: ""; position: absolute; left: -5px; top: 6px; width: 9px; height: 9px; border-radius: 50%; background: var(--ac); box-shadow: 0 0 0 3px rgba(var(--ac-rgb), 0.2); }
  `,infographic:`
    .cv-doc { padding: 0; }
    .cv-body { display: block; }
    .cv-body::after { content: ""; display: table; clear: both; }
    .cv-sidebar { float: left; width: 280px; box-sizing: border-box; background: #f8fafc; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); border-bottom-right-radius: 40px; margin: 0 35px 25px 0; padding-bottom: 20px; min-height: 92vh; }
    .cv-main { display: block; padding: 35px; }
    .cv-info-card { background: var(--ac); color: #ffffff; padding: 40px 25px 30px; border-bottom-right-radius: 40px; box-shadow: 0 15px 30px rgba(var(--ac-rgb), 0.15); margin-bottom: 25px; }
    .cv-info-pad { padding: 0 25px 30px; }
    .cv-photo-wrapper { width: 110px; height: 110px; border-radius: 24px; border: 4px solid rgba(255,255,255,0.25); margin-bottom: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
    .cv-name { color: #ffffff; font-size: 2em; line-height: 1.1; }
    .cv-role { color: rgba(255,255,255,0.85); margin-top: 8px; font-size: 0.9em; }
    .cv-contact-row { flex-direction: column; gap: 12px; margin-top: 18px; color: rgba(255,255,255,0.9); }
    .cv-sec-title { font-weight: 900; letter-spacing: 0.1em; color: var(--text); page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-skills-list li { background: #ffffff; border: 1px solid var(--line); width: 100%; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
  `,diamond:`
    .cv-doc { padding: 50px 55px; border-top: 2px solid var(--ac); border-bottom: 2px solid var(--ac); }
    .cv-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; margin-bottom: 32px; padding-bottom: 28px; border-bottom: 1px solid var(--line); }
    .cv-photo-wrapper { width: 90px; height: 90px; border-radius: 50%; border: 3px solid rgba(var(--ac-rgb), 0.2); box-shadow: 0 6px 18px rgba(var(--ac-rgb), 0.15); }
    .cv-name { font-size: 2.4em; font-weight: 900; letter-spacing: -0.03em; }
    .cv-role { color: var(--ac); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; font-size: 0.9em; }
    .cv-contact-row { justify-content: center; }
    .cv-sec-title { text-align: center; font-size: 0.8em; letter-spacing: 0.25em; text-transform: uppercase; color: var(--ac); border-bottom: none; position: relative; margin-bottom: 18px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title::before, .cv-sec-title::after { content: "—"; margin: 0 10px; opacity: 0.4; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
  `,"ivy-league":`
    .cv-doc { padding: 40px; border-top: 4px solid #1a1a1a; }
    .cv-header { margin-bottom: 28px; border-bottom: 2px solid #1a1a1a; padding-bottom: 18px; }
    .cv-name { font-size: 2.6em; font-weight: 900; letter-spacing: -0.03em; color: #1a1a1a; }
    .cv-role { color: var(--ac); font-weight: 700; font-size: 1em; margin-top: 4px; }
    .cv-contact-row { font-size: 0.82em; color: var(--muted); gap: 8px 18px; margin-top: 8px; }
    .cv-body.has-right { display: grid; grid-template-columns: 1fr 210px; gap: 36px; }
    .cv-main .cv-sec-title { font-size: 0.88em; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 4px; margin-bottom: 14px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-right .cv-sec-title { font-size: 0.78em; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ac); border-bottom: 1px solid rgba(var(--ac-rgb), 0.25); padding-bottom: 4px; margin-bottom: 12px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-skills-list li { background: rgba(var(--ac-rgb), 0.08); color: var(--ac); font-weight: 700; }
    .cv-item-title { font-weight: 800; }
    .cv-item-sub { font-style: italic; }
  `,"double-col":`
    .cv-doc { padding: 0; }
    .cv-header { background: var(--ac); color: #fff; padding: 32px 40px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; }
    .cv-profile-text { flex: 1; padding-right: 24px; }
    .cv-name { color: #fff; font-size: 2.4em; font-weight: 900; }
    .cv-role { color: rgba(255,255,255,0.85); font-weight: 600; margin-top: 5px; letter-spacing: 0.08em; }
    .cv-contact-row { color: rgba(255,255,255,0.85); margin-top: 10px; font-size: 0.82em; gap: 5px 14px; }
    .cv-personal-meta { color: rgba(255,255,255,0.7); margin-top: 5px; }
    .cv-photo-wrapper { width: 88px; height: 88px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.3); flex-shrink: 0; }
    .cv-body.has-right { display: grid; grid-template-columns: 1fr 220px; gap: 0; }
    .cv-main { padding: 30px 35px; }
    .cv-right { padding: 30px 25px; background: #f8fafc; border-left: 1px solid var(--line); }
    .cv-main .cv-sec-title { font-weight: 900; color: var(--ac); border-bottom: 2px solid rgba(var(--ac-rgb), 0.15); padding-bottom: 6px; margin-bottom: 14px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-right .cv-sec-title { font-weight: 900; font-size: 0.8em; letter-spacing: 0.12em; color: var(--muted); border-bottom: 1px solid var(--line); padding-bottom: 5px; margin-bottom: 12px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-skills-list { gap: 5px; }
    .cv-skills-list li { padding: 3px 10px; font-size: 0.8em; }
  `,"navy-exec":`
    .cv-doc { padding: 0 0 0 5px; border-left: 5px solid #0b1437; }
    .cv-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 35px 40px 28px; border-bottom: 1px solid var(--line); margin-bottom: 0; }
    .cv-profile-text { flex: 1; padding-right: 24px; }
    .cv-name { font-size: 2.5em; font-weight: 900; letter-spacing: -0.03em; color: #0b1437; }
    .cv-role { color: var(--ac); font-weight: 700; font-size: 1em; margin-top: 5px; letter-spacing: 0.05em; }
    .cv-contact-row { margin-top: 10px; gap: 6px 16px; }
    .cv-photo-wrapper { width: 90px; height: 90px; border-radius: 12px; border: 2px solid var(--line); }
    .cv-main { padding: 28px 40px; }
    .cv-sec-title { font-weight: 900; font-size: 0.85em; letter-spacing: 0.15em; text-transform: uppercase; color: #0b1437; border-bottom: 2px solid #0b1437; padding-bottom: 5px; margin-bottom: 14px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-item-title { font-weight: 800; color: #0b1437; }
    .cv-item-date { color: var(--ac); font-weight: 800; }
    .cv-exp-item { padding-left: 16px; border-left: 2px solid rgba(var(--ac-rgb), 0.2); position: relative; }
    .cv-exp-item::before { content: ""; position: absolute; left: -5px; top: 7px; width: 8px; height: 8px; border-radius: 50%; background: var(--ac); }
  `,"timeline-pro":`
    .cv-doc { padding: 40px; }
    .cv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 24px; border-bottom: 2px solid var(--line); }
    .cv-profile-text { flex: 1; padding-right: 20px; }
    .cv-name { font-size: 2.3em; font-weight: 800; }
    .cv-role { color: var(--ac); font-weight: 700; margin-top: 5px; }
    .cv-photo-wrapper { width: 88px; height: 88px; border-radius: 50%; border: 3px solid var(--line); }
    .cv-sec-title { font-weight: 900; font-size: 0.85em; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ac); margin-bottom: 18px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-exp-item { position: relative; padding-left: 28px; margin-bottom: 20px; }
    .cv-exp-item::before { content: ""; position: absolute; left: 0; top: 6px; width: 10px; height: 10px; border-radius: 50%; background: var(--ac); box-shadow: 0 0 0 3px rgba(var(--ac-rgb), 0.15); z-index: 1; }
    .cv-exp-item::after { content: ""; position: absolute; left: 4px; top: 18px; width: 2px; bottom: -14px; background: rgba(var(--ac-rgb), 0.15); }
    .cv-exp-item:last-child::after { display: none; }
    .cv-item-title { font-weight: 800; }
    .cv-item-date { background: rgba(var(--ac-rgb), 0.08); color: var(--ac); padding: 2px 8px; border-radius: 99px; font-weight: 800; font-size: 0.8em; }
    .cv-skills-list li { background: rgba(var(--ac-rgb), 0.08); color: var(--ac); font-weight: 700; }
  `,"coral-modern":`
    .cv-doc { padding: 0; }
    .cv-header { display: flex; justify-content: space-between; align-items: flex-start; background: rgba(var(--ac-rgb), 0.06); border-top: 3px solid var(--ac); padding: 32px 40px 28px; margin-bottom: 0; }
    .cv-profile-text { flex: 1; padding-right: 24px; }
    .cv-name { font-size: 2.4em; font-weight: 900; letter-spacing: -0.02em; }
    .cv-role { color: var(--ac); font-weight: 700; margin-top: 5px; }
    .cv-photo-wrapper { width: 90px; height: 90px; border-radius: 18px; box-shadow: 0 8px 20px rgba(var(--ac-rgb), 0.18); border: 2px solid rgba(var(--ac-rgb), 0.15); }
    .cv-main { padding: 30px 40px; }
    .cv-sec-title { font-weight: 900; font-size: 0.88em; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text); position: relative; padding-left: 14px; margin-bottom: 16px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title::before { content: ""; position: absolute; left: 0; top: 2px; bottom: 2px; width: 4px; border-radius: 2px; background: var(--ac); }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-skills-list li { background: rgba(var(--ac-rgb), 0.09); color: var(--ac); font-weight: 700; border: 1px solid rgba(var(--ac-rgb), 0.15); }
    .cv-item-title { font-weight: 800; }
    .cv-item-date { color: var(--ac); font-weight: 800; }
  `,"slate-pro":`
    .cv-doc { padding: 0; }
    .cv-header { background: #1e293b; padding: 36px 40px 30px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; }
    .cv-profile-text { flex: 1; padding-right: 24px; }
    .cv-name { color: #f8fafc; font-size: 2.5em; font-weight: 900; letter-spacing: -0.03em; }
    .cv-role { color: var(--ac); filter: brightness(1.4); font-weight: 700; margin-top: 6px; letter-spacing: 0.06em; }
    .cv-contact-row { color: #94a3b8; margin-top: 10px; gap: 6px 14px; font-size: 0.82em; }
    .cv-personal-meta { color: #64748b; }
    .cv-photo-wrapper { width: 90px; height: 90px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.15); flex-shrink: 0; }
    .cv-body.has-right { display: grid; grid-template-columns: 1fr 220px; gap: 0; }
    .cv-main { padding: 30px 35px; }
    .cv-right { padding: 30px 25px; background: #f8fafc; border-left: 1px solid var(--line); }
    .cv-main .cv-sec-title { font-weight: 900; font-size: 0.85em; letter-spacing: 0.12em; text-transform: uppercase; color: #1e293b; border-bottom: 2px solid #1e293b; padding-bottom: 5px; margin-bottom: 14px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-right .cv-sec-title { font-weight: 900; font-size: 0.78em; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ac); border-bottom: 1px solid rgba(var(--ac-rgb), 0.2); padding-bottom: 5px; margin-bottom: 12px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-skills-list li { font-size: 0.8em; padding: 3px 10px; }
  `,"compact-ats":`
    .cv-doc { padding: 36px 44px; font-size: 0.92em; }
    .cv-header { margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid #0f172a; }
    .cv-name { font-size: 2em; font-weight: 900; letter-spacing: -0.02em; color: #0f172a; }
    .cv-role { font-size: 1em; font-weight: 600; color: var(--ac); margin-top: 3px; }
    .cv-contact-row { margin-top: 6px; gap: 4px 14px; font-size: 0.82em; }
    .cv-personal-meta { margin-top: 4px; font-size: 0.78em; }
    .cv-sec-title { font-weight: 900; font-size: 0.82em; letter-spacing: 0.2em; text-transform: uppercase; color: #0f172a; border-bottom: 0.5px solid #0f172a; padding-bottom: 4px; margin-bottom: 12px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-section { margin-bottom: 18px; }
    .cv-item { margin-bottom: 12px; }
    .cv-item-title { font-weight: 800; font-size: 0.95em; }
    .cv-item-sub { font-size: 0.85em; }
    .cv-item-date { font-size: 0.8em; font-weight: 700; color: var(--muted); }
    .cv-bullets { font-size: 0.88em; }
    .cv-bullets li { margin-bottom: 2px; }
    .cv-skills-list li { background: rgba(var(--ac-rgb), 0.07); color: var(--text); font-weight: 600; font-size: 0.82em; padding: 3px 9px; }
    .cv-summary { font-size: 0.9em; }
  `,"bold-header":`
    .cv-doc { padding: 0; }
    .cv-header { background: #f8fafc; padding: 36px 44px 28px; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--line); margin-bottom: 0; }
    .cv-profile-text { flex: 1; padding-right: 24px; }
    .cv-name { font-size: 3em; font-weight: 900; letter-spacing: -0.04em; color: #0f172a; line-height: 1; }
    .cv-role { color: var(--ac); font-weight: 700; font-size: 1.05em; margin-top: 8px; letter-spacing: 0.06em; }
    .cv-contact-row { margin-top: 10px; gap: 5px 16px; font-size: 0.83em; }
    .cv-photo-wrapper { width: 95px; height: 95px; border-radius: 50%; border: 3px solid rgba(var(--ac-rgb), 0.2); box-shadow: 0 8px 20px rgba(var(--ac-rgb), 0.15); }
    .cv-main { padding: 32px 44px; }
    .cv-section { border-left: 3px solid var(--ac); padding-left: 18px; margin-bottom: 28px; }
    .cv-sec-title { font-weight: 900; font-size: 0.85em; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ac); margin-bottom: 14px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-item-title { font-weight: 800; font-size: 1em; }
    .cv-item-date { background: rgba(var(--ac-rgb), 0.08); color: var(--ac); padding: 2px 8px; border-radius: 99px; font-weight: 800; }
    .cv-skills-list li { background: rgba(var(--ac-rgb), 0.09); color: var(--ac); font-weight: 700; border: 1px solid rgba(var(--ac-rgb), 0.12); }
  `,"dubai-pro":`
    .cv-doc { padding: 0; border-top: 5px solid var(--ac); }
    .cv-header { background: #f8fafc; padding: 28px 40px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); }
    .cv-profile-text { flex: 1; padding-right: 24px; }
    .cv-name { font-size: 2.5em; font-weight: 900; letter-spacing: -0.03em; color: #0b1437; }
    .cv-role { color: var(--ac); font-weight: 700; margin-top: 5px; letter-spacing: 0.08em; }
    .cv-contact-row { margin-top: 8px; gap: 5px 14px; font-size: 0.82em; }
    .cv-photo-wrapper { width: 88px; height: 88px; border-radius: 50%; border: 3px solid rgba(var(--ac-rgb), 0.2); box-shadow: 0 6px 18px rgba(var(--ac-rgb), 0.18); flex-shrink: 0; }
    .cv-body.has-right { display: grid; grid-template-columns: 1fr 225px; gap: 0; }
    .cv-main { padding: 28px 35px; }
    .cv-right { padding: 28px 22px; background: #f8fafc; border-left: 1px solid var(--line); }
    .cv-main .cv-sec-title { font-weight: 900; font-size: 0.85em; letter-spacing: 0.1em; text-transform: uppercase; color: #0b1437; border-bottom: 2px solid var(--ac); padding-bottom: 5px; margin-bottom: 14px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-right .cv-sec-title { font-weight: 900; font-size: 0.78em; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ac); border-bottom: 1px solid rgba(var(--ac-rgb), 0.25); padding-bottom: 4px; margin-bottom: 12px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-exp-item { position: relative; padding-left: 18px; border-left: 2px solid rgba(var(--ac-rgb), 0.2); }
    .cv-exp-item::before { content: ""; position: absolute; left: -5px; top: 7px; width: 8px; height: 8px; border-radius: 50%; background: var(--ac); }
    .cv-skills-list { gap: 5px; }
    .cv-skills-list li { width: 100%; border-radius: 6px; padding: 5px 10px; background: rgba(var(--ac-rgb), 0.08); color: var(--ac); font-weight: 700; font-size: 0.82em; }
    .cv-lang-bar { height: 4px; }
  `};function E(e,t,n,r,i,a,o,s,c,l=null){let u=e||{},d=(o.find(e=>e.id===r)||o[0]).s,f=s[i]||s.medium,{h:p=1123}=c[a]||c.a4,m=e=>String(e||``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]),h=e=>String(e||``).split(`
`).map(e=>e.trim()).filter(Boolean),g=e=>Array.isArray(e)?e:[],_=e=>e&&String(e).trim().length>0,v=m(u.fullName||`Your Name`),y=m(u.title||``),b=u.phoneCode&&u.phoneNum?`${u.phoneCode} ${u.phoneNum}`:u.phoneNum||``,x=m(u.summary||``),S=g(u.experience).filter(e=>_(e.role)||_(e.company)),C=g(u.education).filter(e=>_(e.degree)||_(e.school)),w=g(u.projects).filter(e=>_(e.name)),E=g(u.certifications).filter(e=>_(e.name)),D=g(u.languages).filter(e=>_(e.lang)),O=g(u.awards).filter(e=>_(e.title)),k=g(u.references).filter(e=>_(e.name)),A=h(u.skills),j=h(u.hobbies),te=[u.email&&`<span>✉ ${m(u.email)}</span>`,b&&`<span>📞 ${m(b)}</span>`,u.location&&`<span>📍 ${m(u.location)}</span>`,u.linkedin&&`<span>🔗 ${m(u.linkedin.replace(/^https?:\/\//,``))}</span>`,u.github&&`<span>💻 ${m(u.github.replace(/^https?:\/\//,``))}</span>`,u.website&&`<span>🌐 ${m(u.website.replace(/^https?:\/\//,``))}</span>`].filter(Boolean).join(``),M=[_(u.nationality)&&`${m(u.nationality)}`,_(u.dob)&&`DOB: ${m(u.dob)}`,_(u.marital)&&m(u.marital),_(u.gender)&&m(u.gender),_(u.drivingLicense)&&`🚗 ${m(u.drivingLicense)}`,_(u.notice)&&`⏱ ${m(u.notice)}`].filter(Boolean),N=(e,t,n=``)=>t?`<section class="cv-section ${n}"><h3 class="cv-sec-title">${e}</h3><div class="cv-sec-body">${t}</div></section>`:``,ne=(e=>{let t=(e||`#1e3a8a`).replace(`#`,``);return t.length===3&&(t=t.split(``).map(e=>e+e).join(``)),`${parseInt(t.slice(0,2),16)}, ${parseInt(t.slice(2,4),16)}, ${parseInt(t.slice(4,6),16)}`})(n),P={photo:u.photoDataUrl?`<div class="cv-photo-wrapper"><img src="${u.photoDataUrl}" alt="Profile" class="cv-photo-img" /></div>`:``,profile:`
      <div class="cv-profile-text">
        <h1 class="cv-name">${v}</h1>
        ${y?`<h2 class="cv-role">${y}</h2>`:``}
        <div class="cv-contact-row">${te}</div>
        ${M.length?`<div class="cv-personal-meta">${M.join(`<span class="cv-meta-dot">·</span>`)}</div>`:``}
      </div>`,summary:N(`Professional Summary`,x?`<p class="cv-summary">${x}</p>`:``),exp:N(`Experience`,S.map(e=>{let t=[e.start,e.current?`Present`:e.end].filter(Boolean).join(` – `),n=[_(e.company)&&m(e.company),_(e.city)&&m(e.city),_(e.empType)&&e.empType!==`Full-time`&&`<em>${m(e.empType)}</em>`,_(e.industry)&&m(e.industry)].filter(Boolean).join(` · `);return`
        <article class="cv-item cv-exp-item">
          <div class="cv-item-header">
            <div>
              <div class="cv-item-title">${m(e.role)}</div>
              ${n?`<div class="cv-item-sub">${n}</div>`:``}
            </div>
            ${t?`<div class="cv-item-date">${m(t)}</div>`:``}
          </div>
          ${e.bullets?`<ul class="cv-bullets">${h(e.bullets).map(e=>`<li>${m(e)}</li>`).join(``)}</ul>`:``}
        </article>`}).join(``)),edu:N(`Education`,C.map(e=>{let t=[e.start,e.end].filter(Boolean).join(` – `),n=[e.degType,e.degree].filter(Boolean).join(` in `),r=[_(e.school)&&m(e.school),_(e.city)&&m(e.city)].filter(Boolean).join(` · `);return`
        <article class="cv-item">
          <div class="cv-item-header">
            <div>
              <div class="cv-item-title">${m(n)}</div>
              ${r?`<div class="cv-item-sub">${r}</div>`:``}
            </div>
            ${t?`<div class="cv-item-date">${m(t)}</div>`:``}
          </div>
          ${_(e.gpa)?`<div class="cv-edu-meta">GPA / Grade: <strong>${m(e.gpa)}</strong></div>`:``}
          ${_(e.notes)?`<p class="cv-edu-notes">${m(e.notes)}</p>`:``}
        </article>`}).join(``)),projects:N(`Projects`,w.map(e=>`
        <article class="cv-item">
          <div class="cv-item-header">
            <div>
              <div class="cv-item-title">${m(e.name)}${_(e.status)?` <span class="cv-proj-status">${m(e.status)}</span>`:``}</div>
              ${_(e.tech)?`<div class="cv-item-sub">${m(e.tech)}</div>`:``}
            </div>
            ${_(e.url)?`<div class="cv-item-date"><a href="${m(e.url)}" class="cv-link" target="_blank">${m(e.url.replace(/^https?:\/\//,``))}</a></div>`:``}
          </div>
          ${e.bullets?`<ul class="cv-bullets">${h(e.bullets).map(e=>`<li>${m(e)}</li>`).join(``)}</ul>`:``}
        </article>`).join(``)),skills:A.length?N(`Skills`,`<ul class="cv-skills-list">${A.map(e=>`<li>${m(e)}</li>`).join(``)}</ul>`):``,langs:D.length?N(`Languages`,`
      <div class="cv-langs-list">
        ${D.map(e=>{let t={Native:100,Fluent:85,Professional:70,Conversational:50,Elementary:30}[e.level]||60;return`
            <div class="cv-lang-item">
              <div class="cv-lang-top">
                <span class="cv-lang-name">${m(e.lang)}</span>
                <span class="cv-lang-lvl">${m(e.level)}</span>
              </div>
              <div class="cv-lang-bar"><div class="cv-lang-fill" style="width:${t}%"></div></div>
            </div>`}).join(``)}
      </div>`):``,certs:E.length?N(`Certifications`,`
      <ul class="cv-cert-list">
        ${E.map(e=>{let t=[_(e.issuer)&&m(e.issuer),_(e.year)&&m(e.year),_(e.expiry)&&`Exp: ${m(e.expiry)}`].filter(Boolean).join(` · `);return`
            <li class="cv-cert-item">
              <div class="cv-item-title">${m(e.name)}</div>
              ${t?`<div class="cv-item-sub">${t}</div>`:``}
              ${_(e.credId)?`<div class="cv-cert-cred">ID: ${m(e.credId)}</div>`:``}
            </li>`}).join(``)}
      </ul>`):``,awards:O.length?N(`Awards`,O.map(e=>`
      <article class="cv-item">
        <div class="cv-item-header">
          <div>
            <div class="cv-item-title">${m(e.title)}</div>
            ${_(e.issuer)?`<div class="cv-item-sub">${m(e.issuer)}</div>`:``}
          </div>
          ${_(e.year)?`<div class="cv-item-date">${m(e.year)}</div>`:``}
        </div>
        ${_(e.desc)?`<p class="cv-award-desc">${m(e.desc)}</p>`:``}
      </article>`).join(``)):``,refs:k.length?N(`References`,`
      <div class="cv-refs-grid">
        ${k.map(e=>{let t=[e.refTitle,e.relationship?`(${m(e.relationship)})`:``].filter(Boolean).join(` `);return`
            <div class="cv-ref-item">
              <div class="cv-item-title">${m(e.name)}</div>
              ${t?`<div class="cv-item-sub">${t}</div>`:``}
              ${_(e.company)?`<div class="cv-ref-detail">🏢 ${m(e.company)}</div>`:``}
              ${_(e.email)?`<div class="cv-ref-detail">✉ ${m(e.email)}</div>`:``}
              ${_(e.phone)?`<div class="cv-ref-detail">📞 ${m(e.phone)}</div>`:``}
            </div>`}).join(``)}
      </div>`):``,hobbies:j.length?N(`Hobbies & Interests`,`<p class="cv-summary">${m(j.join(` · `))}</p>`):``},F=(l==null?void 0:l.layout)||T[t]||T[`modern-stack`],I=(l==null?void 0:l.css)||ee[t]||``,L=e=>(e||[]).map(e=>P[e]===void 0?e:P[e]).join(``);return`
    <style>${`
    * { box-sizing: border-box; }
    .cv-doc {
      --ac: ${n};
      --ac-rgb: ${ne};
      --text: #0f172a;
      --muted: #475569;
      --line: #e2e8f0;
      --bg: #ffffff;
      font-family: ${d};
      font-size: ${f};
      line-height: 1.6;
      color: var(--text);
      background: var(--bg);
      min-height: ${p}px;
      padding: 35px;
      overflow: hidden;
    }
    h1, h2, h3 { margin: 0; }
    .cv-name { font-size: 2.2em; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
    .cv-role { font-size: 1.05em; font-weight: 700; color: var(--ac); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 6px; }
    .cv-contact-row { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-top: 10px; font-size: 0.84em; color: var(--muted); font-weight: 500; }
    .cv-contact-row span { display: flex; align-items: center; gap: 5px; word-break: break-word; }
    .cv-personal-meta { display: flex; flex-wrap: wrap; gap: 4px 10px; margin-top: 6px; font-size: 0.78em; color: var(--muted); font-weight: 500; }
    .cv-meta-dot { opacity: 0.4; margin: 0 2px; }
    .cv-photo-wrapper { position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center; flex-shrink: 0; background-color: rgba(var(--ac-rgb), 0.05); z-index: 1; }
    .cv-photo-wrapper .cv-photo-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 15%; display: block; z-index: 0; }
    .cv-section { margin-bottom: 22px; }
    .cv-sec-title { font-size: 1em; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text); margin-bottom: 12px; }
    .cv-item { margin-bottom: 16px; }
    .cv-item:last-child { margin-bottom: 0; }
    .cv-item-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 4px; }
    .cv-item-title { font-weight: 700; color: var(--text); }
    .cv-item-sub { font-size: 0.88em; color: var(--muted); font-weight: 600; margin-top: 2px; }
    .cv-item-date { font-size: 0.83em; font-weight: 700; color: var(--ac); white-space: nowrap; flex-shrink: 0; }
    .cv-bullets { margin: 6px 0 0; padding-left: 18px; color: var(--muted); font-size: 0.93em; }
    .cv-bullets li { margin-bottom: 4px; line-height: 1.5; }
    .cv-summary { margin: 0; color: var(--muted); line-height: 1.7; }
    .cv-edu-meta { font-size: 0.82em; color: var(--ac); font-weight: 700; margin-top: 4px; }
    .cv-edu-notes { margin: 4px 0 0; font-size: 0.88em; color: var(--muted); line-height: 1.55; }
    .cv-proj-status { display: inline-block; margin-left: 6px; padding: 1px 7px; border-radius: 99px; font-size: 0.72em; font-weight: 700; background: rgba(var(--ac-rgb), 0.1); color: var(--ac); vertical-align: middle; }
    .cv-link { color: var(--ac); text-decoration: none; font-size: 0.82em; font-weight: 600; word-break: break-all; }
    .cv-skills-list { display: flex; flex-wrap: wrap; gap: 7px; list-style: none; padding: 0; margin: 0; }
    .cv-skills-list li { background: rgba(var(--ac-rgb), 0.1); color: var(--ac); padding: 4px 11px; border-radius: 99px; font-size: 0.84em; font-weight: 700; }
    .cv-lang-item { margin-bottom: 9px; }
    .cv-lang-top { display: flex; justify-content: space-between; font-size: 0.84em; font-weight: 600; margin-bottom: 4px; }
    .cv-lang-name { color: var(--text); }
    .cv-lang-lvl { color: var(--ac); font-weight: 700; }
    .cv-lang-bar { height: 5px; background: var(--line); border-radius: 99px; overflow: hidden; }
    .cv-lang-fill { height: 100%; background: var(--ac); border-radius: 99px; }
    .cv-cert-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    .cv-cert-item { padding: 8px 12px; background: rgba(var(--ac-rgb), 0.04); border-left: 3px solid var(--ac); border-radius: 0 6px 6px 0; }
    .cv-cert-cred { font-size: 0.78em; color: var(--muted); margin-top: 2px; font-style: italic; }
    .cv-award-desc { margin: 4px 0 0; font-size: 0.88em; color: var(--muted); line-height: 1.55; }
    .cv-refs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
    .cv-ref-item { padding: 12px 14px; border: 1px solid var(--line); border-radius: 8px; background: rgba(var(--ac-rgb), 0.02); }
    .cv-ref-detail { font-size: 0.82em; color: var(--muted); margin-top: 3px; word-break: break-word; }
    .cv-simple-list { margin: 0; padding-left: 18px; color: var(--muted); font-size: 0.93em; }
  `}${I}</style>
    <div class="cv-doc layout-${t}">
      ${F.header?`<header class="cv-header">${L(F.header)}</header>`:``}
      <div class="cv-body ${F.sidebar?`has-sidebar`:``} ${F.right?`has-right`:``}">
        ${F.sidebar?`<aside class="cv-sidebar">${L(F.sidebar)}</aside>`:``}
        ${F.main?`<main class="cv-main">${L(F.main)}</main>`:``}
        ${F.right?`<aside class="cv-right">${L(F.right)}</aside>`:``}
      </div>
    </div>
  `}r();var D=`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Sora:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --navy:   #0b1437;
  --royal:  #1a3a8f;
  --sky:    #2563eb;
  --gold:   #d97706;
  --gold-l: #f59e0b;
  --gold-bg:#fef3c7;
  --slate:  #4b5563;
  --ok:     #047857;
  --red:    #b91c1c;
  --border: rgba(37,99,235,.15);
  --sh:     0 1px 6px rgba(11,20,55,.07);
  --sh-md:  0 3px 14px rgba(11,20,55,.10);
  --sh-lg:  0 6px 28px rgba(11,20,55,.14);
  --r:      12px;
  --r-sm:   8px;
  --touch:  44px;
}

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
body {
  font-family: 'Outfit', sans-serif;
  color: var(--navy);
  background: #eef2fb;
  min-height: 100dvh;
  overflow-x: hidden;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  width: 100%;
  max-width: 100vw;
}
input,textarea,select,button { font-family: inherit; font-size: inherit; color: inherit; }
button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
img    { display: block; max-width: 100%; }

/* ── Background ── */
.cv-bg {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background: linear-gradient(160deg,#eef2fb 0%,#fefdf7 55%,#edf7f4 100%);
}
.cv-bg::before {
  content:'';
  position: absolute;
  width: min(60vw,400px); height: min(60vw,400px);
  background: radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%);
  top:-10%; left:-10%;
}
.cvapp {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow-x: hidden;
}

/* ── Wrap ── */
.cv-wrap {
  width: 100%; max-width: 100vw; margin: 0 auto;
  padding: 12px 12px 24px;
  overflow-x: hidden;
}
@media (min-width: 640px) { .cv-wrap { padding: 16px 16px 24px; } }
@media (min-width: 960px) { .cv-wrap { max-width: 1320px; padding: 24px 20px 28px; } }

/* ── Toasts ── */
.cv-toasts {
  position: fixed; top: 10px; right: 10px; z-index: 9999;
  display: flex; flex-direction: column; gap: 6px;
  max-width: min(280px, calc(100vw - 20px));
  pointer-events: none;
}
.cv-toast {
  pointer-events: all;
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px; border-radius: 10px;
  font-size: .8rem; font-weight: 700;
  box-shadow: var(--sh-lg);
  animation: toastIn .2s ease;
}
.cv-toast button {
  background: none; border: none; margin-left: auto;
  padding: 0 2px; font-size: 1rem; font-weight: 900; opacity: .65;
  min-width: var(--touch); min-height: var(--touch);
  display: flex; align-items: center; justify-content: center;
}
.t-ok  { background:#ecfdf5; border:1px solid #6ee7b7; color:#064e3b; }
.t-err { background:#fef2f2; border:1px solid #fca5a5; color:#7f1d1d; }
.t-inf { background:#eff6ff; border:1px solid #93c5fd; color:#1e3a8a; }
@keyframes toastIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:none} }

/* ── Hero ── */
.cv-hero {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 10px;
  margin-bottom: 12px; flex-wrap: wrap;
  width: 100%; overflow: hidden;
}
.cv-hero-l { flex: 1; min-width: 0; }
.cv-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: linear-gradient(135deg,var(--gold),var(--gold-l));
  color: #1c1917;
  padding: 3px 10px; border-radius: 99px;
  font-size: .58rem; font-weight: 800;
  letter-spacing: .08em; text-transform: uppercase;
  margin-bottom: 6px;
  box-shadow: 0 2px 8px rgba(217,119,6,.25);
}
.cv-hero h1 {
  font-family: 'Sora', sans-serif;
  font-size: clamp(1.2rem,5.5vw,2.3rem);
  font-weight: 900; line-height: 1.1; margin-bottom: 4px;
  word-break: break-word;
}
.cv-grad {
  background: linear-gradient(135deg,#1a3a8f,#2563eb 60%,#0ea5e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.cv-hero-sub { color: var(--slate); font-size: clamp(.74rem,2.2vw,.86rem); line-height: 1.6; margin-bottom: 8px; }
.cv-pills { display: flex; flex-wrap: wrap; gap: 4px; }
.cv-pill {
  background: rgba(37,99,235,.07); border: 1px solid rgba(37,99,235,.18);
  border-radius: 99px; padding: 2px 7px;
  font-size: .58rem; font-weight: 700; color: #1e3a8a;
}

/* ── ATS Ring ── */
.cv-ats-wrap { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.cv-ats-ring {
  width: 72px; height: 72px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: background .5s;
  box-shadow: 0 2px 10px rgba(217,119,6,.18);
}
.cv-ats-inner {
  width: 56px; height: 56px; border-radius: 50%;
  background: #fff;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: inset 0 2px 5px rgba(0,0,0,.07);
}
.cv-ats-score { font-family:'Sora',sans-serif; font-size: 1.25rem; font-weight: 900; line-height: 1; }
.cv-ats-lbl { font-size: .44rem; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: .06em; }
.cv-ats-btn {
  background: none; border: none; font-size: .65rem; font-weight: 700; color: var(--sky);
  min-height: var(--touch); display: flex; align-items: center;
}
.cv-ats-panel {
  display: none;
  grid-template-columns: repeat(auto-fill, minmax(180px,1fr));
  gap: 4px; margin-bottom: 10px;
  background: #fff; border: 1px solid var(--border);
  border-radius: 10px; padding: 10px;
}
.cv-ats-panel.open { display: grid; }
.cv-ck { display:flex; align-items:center; gap:6px; padding:5px 8px; border-radius:7px; font-size:.68rem; font-weight:600; }
.cv-ck.ok   { background:rgba(4,120,87,.08); color:#064e3b; }
.cv-ck.fail { background:rgba(185,28,28,.07); color:#7f1d1d; }

/* ── Toolbar ── */
.cv-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px; margin-bottom: 10px; flex-wrap: wrap; width: 100%;
}
.cv-tbr { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }

/* ── Mobile 3-tab nav ── */
.cv-main-tabs {
  display: flex; gap: 0;
  border-radius: var(--r); overflow: hidden;
  border: 1.5px solid var(--border);
  background: rgba(255,255,255,.9);
  margin-bottom: 12px; width: 100%;
  position: sticky; top: 0; z-index: 50;
  box-shadow: var(--sh);
}
.cv-main-tab {
  flex: 1; height: 46px;
  border: none; border-right: 1px solid var(--border);
  background: transparent;
  font-size: clamp(.62rem,2.5vw,.76rem);
  font-weight: 700; color: var(--slate);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 2px; cursor: pointer; transition: background .15s,color .15s; padding: 0 4px;
}
.cv-main-tab:last-child { border-right: none; }
.cv-main-tab .tab-ico { font-size: 1rem; }
.cv-main-tab.on {
  background: linear-gradient(135deg,var(--gold),var(--gold-l));
  color: #1c1917;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,.1);
}

/* ── Panels ── */
.cv-panel { display: none; width: 100%; }
.cv-panel.on { display: block; }

/* ── Form sub-tabs ── */
.cv-ftabs {
  display: flex; gap: 2px; overflow-x: auto;
  -webkit-overflow-scrolling: touch; scrollbar-width: none;
  margin-bottom: 10px;
  background: rgba(255,255,255,.85);
  border-radius: 10px; padding: 4px;
  border: 1px solid var(--border); width: 100%;
}
.cv-ftabs::-webkit-scrollbar { display: none; }
.cv-ftab {
  flex: 1; min-width: 44px; height: 46px; padding: 0 4px;
  border-radius: 8px; border: none; background: transparent;
  font-size: clamp(.52rem,1.8vw,.64rem);
  font-weight: 700; color: var(--slate); transition: .12s;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 2px; white-space: nowrap; flex-shrink: 0; cursor: pointer;
}
.cv-ftab .ico { font-size: .9rem; }
.cv-ftab.on { background: #fff; color: var(--navy); box-shadow: 0 2px 7px rgba(11,20,55,.09); }
.cv-tpanel { display: none; }
.cv-tpanel.on { display: block; }

/* ── Cards ── */
.cv-card {
  background: rgba(255,255,255,.94);
  border-radius: var(--r); border: 1px solid var(--border);
  box-shadow: var(--sh); padding: 13px; margin-bottom: 10px;
  width: 100%; overflow: hidden; word-break: break-word;
}
@media (min-width: 640px) { .cv-card { padding: 16px; } }
.cv-card-h { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:8px; flex-wrap:wrap; }
.cv-card-t { font-family:'Sora',sans-serif; font-size:clamp(.8rem,2.8vw,.88rem); font-weight:700; color:var(--navy); margin:0; }

/* ── Form grid ── */
.cv-g2 { display:grid; grid-template-columns:1fr; gap:8px; }
@media (min-width:380px) { .cv-g2 { grid-template-columns:repeat(2,1fr); } }
.cv-span2 { grid-column:1/-1; }

/* ── Fields ── */
.cv-field { display:flex; flex-direction:column; gap:4px; min-width:0; }
.cv-lbl { font-size:.58rem; font-weight:800; text-transform:uppercase; letter-spacing:.07em; color:#374151; }
.cv-inp {
  width:100%; min-width:0;
  padding:0 11px; height:var(--touch);
  border-radius:var(--r-sm);
  border:1.5px solid rgba(37,99,235,.2);
  background:#fff; font-size:.85rem; font-weight:500;
  outline:none; transition:border-color .15s,box-shadow .15s; color:var(--navy);
  -webkit-appearance:none; appearance:none; max-width:100%;
}
.cv-inp:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(217,119,6,.15); }
.cv-inp:focus-visible,button:focus-visible,[tabindex]:focus-visible { outline:3px solid var(--gold); outline-offset:2px; }
select.cv-inp {
  cursor:pointer;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234b5563' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:right 10px center; padding-right:28px;
}
textarea.cv-inp { height:auto; min-height:80px; padding:10px 11px; resize:vertical; line-height:1.6; }

/* ── Phone ── */
.cv-phone-row { display:grid; grid-template-columns:95px 1fr; gap:6px; }

/* ── Photo ── */
.cv-photo-row {
  display:flex; align-items:center; gap:11px; margin-top:10px; padding:11px;
  background:#f8fafc; border-radius:10px; border:1px solid var(--border); flex-wrap:wrap;
}
.cv-photo-thumb {
  width:52px; height:52px; border-radius:50%; border:2px solid var(--border);
  overflow:hidden; background:#f1f5f9;
  display:flex; align-items:center; justify-content:center;
  font-size:1.3rem; flex-shrink:0;
}
.cv-photo-thumb img { width:100%; height:100%; object-fit:cover; object-position:top center; }
.cv-photo-btns { display:flex; flex-wrap:wrap; gap:6px; align-items:center; }

/* ── Skill chips ── */
.cv-chips { display:flex; flex-wrap:wrap; gap:4px; margin-top:8px; }
.cv-chip {
  padding:2px 8px; border-radius:99px;
  background:rgba(37,99,235,.07); border:1px solid rgba(37,99,235,.16);
  font-size:.62rem; font-weight:700; color:#1e3a8a;
}

/* ── Shells ── */
.cv-shell {
  margin-top:8px; padding:12px;
  background:#f8fafc; border-radius:10px; border:1px solid var(--border);
  transition:box-shadow .15s; width:100%; overflow:hidden; word-break:break-word;
}
.cv-shell:focus-within { box-shadow:0 0 0 2px rgba(217,119,6,.2); }
.cv-shell-h { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:8px; }
.cv-shell-t { font-size:.72rem; font-weight:700; color:var(--slate); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0; }
.cv-empty {
  display:flex; align-items:center; gap:8px; padding:13px; color:var(--slate);
  font-size:.76rem; font-weight:600; border-radius:10px; background:#f8fafc;
  border:1.5px dashed rgba(37,99,235,.18);
}

/* ── Buttons ── */
.cv-btn {
  display:inline-flex; align-items:center; justify-content:center; gap:5px;
  min-height:var(--touch); padding:0 16px;
  border-radius:99px; border:none; font-size:.8rem; font-weight:800;
  cursor:pointer; transition:transform .12s,box-shadow .12s,background .1s;
  white-space:nowrap; -webkit-tap-highlight-color:transparent; text-decoration:none;
}
.cv-btn:disabled { opacity:.4; cursor:not-allowed; transform:none!important; }
.cv-btn-primary {
  background:linear-gradient(135deg,var(--gold),var(--gold-l));
  color:#1c1917; box-shadow:0 3px 12px rgba(217,119,6,.3);
}
.cv-btn-primary:hover:not(:disabled) { transform:scale(1.03); box-shadow:0 5px 16px rgba(217,119,6,.4); }
.cv-btn-ghost {
  background:rgba(255,255,255,.92); border:1.5px solid var(--border); color:#1e3a8a;
}
.cv-btn-ghost:hover:not(:disabled) { background:rgba(37,99,235,.06); }
.cv-btn-danger {
  background:rgba(185,28,28,.07); border:1px solid rgba(185,28,28,.22); color:#7f1d1d;
  font-size:.72rem; padding:0 11px; min-height:36px;
}
.cv-btn-sm { font-size:.75rem; padding:0 12px; min-height:36px; }
.cv-btn-add {
  display:inline-flex; align-items:center; gap:4px;
  min-height:36px; padding:0 12px; border-radius:99px; border:none;
  background:linear-gradient(135deg,var(--gold),var(--gold-l));
  color:#1c1917; font-size:.68rem; font-weight:800;
  cursor:pointer; box-shadow:0 2px 7px rgba(217,119,6,.22);
  transition:transform .12s; -webkit-tap-highlight-color:transparent;
}
.cv-btn-add:hover { transform:scale(1.04); }
.cv-btn-rm {
  display:inline-flex; align-items:center; justify-content:center;
  min-height:32px; min-width:32px; padding:0 7px;
  background:#fff; border:1px solid rgba(185,28,28,.25); color:#7f1d1d;
  border-radius:7px; font-size:.67rem; font-weight:700;
  cursor:pointer; flex-shrink:0; transition:background .1s;
  -webkit-tap-highlight-color:transparent;
}
.cv-btn-rm:hover { background:rgba(185,28,28,.07); }
.cv-ai-btn {
  display:inline-flex; align-items:center; gap:4px;
  min-height:32px; padding:0 10px; border-radius:99px;
  border:1.5px solid rgba(217,119,6,.35);
  background:rgba(217,119,6,.07); color:#78350f;
  font-size:.68rem; font-weight:700; cursor:pointer; transition:background .12s;
  white-space:nowrap; -webkit-tap-highlight-color:transparent;
}
.cv-ai-btn:hover:not(:disabled) { background:rgba(217,119,6,.14); }
.cv-ai-btn:disabled { opacity:.4; cursor:not-allowed; }
.cv-file-btn { cursor:pointer; }
.cv-file-btn input[type="file"] { display:none; }
.cv-spinner {
  width:11px; height:11px;
  border:2px solid currentColor; border-top-color:transparent;
  border-radius:50%; animation:spin .6s linear infinite;
  display:inline-block; flex-shrink:0;
}
@keyframes spin { to{transform:rotate(360deg)} }

/* ── Desktop layout ── */
@media (min-width:960px) {
  .cv-main-tabs { display:none; }
  .cv-panel { display:block!important; }
  .cv-grid { display:grid; grid-template-columns:440px 1fr; gap:14px; align-items:start; }
  /* On desktop always show both Templates and Preview */
  .cv-desktop-only { display:block!important; }
}
@media (max-width:959px) {
  .cv-grid { display:block; }
  /* On mobile, hide the "wrong" panel based on active tab */
  .cv-desktop-only { display:none!important; }
}

/* ── Print modal ── */
.cv-modal-backdrop {
  position:fixed; inset:0; z-index:999;
  background:rgba(0,0,0,.48);
  display:flex; align-items:flex-end; padding:0;
}
@media (min-width:560px) { .cv-modal-backdrop { align-items:center; padding:20px; } }
.cv-modal {
  background:#fff; border-radius:16px 16px 0 0;
  padding:20px 16px; width:100%;
  animation:slideUp .22s ease;
  box-shadow:0 -6px 28px rgba(0,0,0,.18);
}
@media (min-width:560px) { .cv-modal { border-radius:16px; max-width:420px; margin:0 auto; animation:fadeScl .18s ease; } }
@keyframes slideUp { from{transform:translateY(100%)} to{transform:none} }
@keyframes fadeScl { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:none} }
.cv-modal-title { font-family:'Sora',sans-serif; font-size:.96rem; font-weight:700; margin-bottom:4px; }
.cv-modal-sub { font-size:.76rem; color:var(--slate); margin-bottom:14px; line-height:1.5; }
.cv-modal-row { display:flex; gap:8px; align-items:stretch; }
`,O=`cvmk_v11`,k=[{id:`outfit`,l:`Outfit`,s:`'Outfit',sans-serif`},{id:`sora`,l:`Sora`,s:`'Sora',sans-serif`},{id:`jakarta`,l:`Jakarta`,s:`'Plus Jakarta Sans',sans-serif`},{id:`lora`,l:`Lora`,s:`'Lora','Georgia',serif`},{id:`garamond`,l:`Garamond`,s:`'Cormorant Garamond','Georgia',serif`},{id:`playfair`,l:`Playfair`,s:`'Playfair Display','Georgia',serif`}],A={small:`10.5px`,medium:`12px`,large:`13.5px`},j={a4:{w:794,h:1123,l:`A4`},letter:{w:816,h:1056,l:`Letter`},legal:{w:816,h:1344,l:`Legal`}},te=[`#1e3a8a`,`#0f766e`,`#7c2d12`,`#4c1d95`,`#065f46`,`#1f2937`,`#be123c`,`#0369a1`,`#92400e`,`#166534`,`#0c4a6e`,`#3b0764`],M=C,N=w,ne=[`Native`,`Fluent`,`Professional`,`Conversational`,`Elementary`],P=[`Manager`,`Supervisor`,`Colleague`,`Professor`,`Client`,`Mentor`,`HR`],F=[`Full-time`,`Part-time`,`Contract`,`Freelance`,`Internship`,`Apprenticeship`,`Temporary`],I=[`High School`,`Diploma`,`Associate Degree`,`Bachelor's Degree`,`Master's Degree`,`PhD`,`MBA`,`Professional Certification`,`Short Course`,`Online Certificate`],L=[`Completed`,`In Progress`,`Open Source`,`Personal`,`Academic`,`Client Work`],re=[{c:`+971`,l:`🇦🇪 UAE`},{c:`+966`,l:`🇸🇦 KSA`},{c:`+974`,l:`🇶🇦 Qatar`},{c:`+973`,l:`🇧🇭 Bahrain`},{c:`+968`,l:`🇴🇲 Oman`},{c:`+965`,l:`🇰🇼 Kuwait`},{c:`+44`,l:`🇬🇧 UK`},{c:`+1`,l:`🇺🇸 USA`},{c:`+91`,l:`🇮🇳 India`},{c:`+92`,l:`🇵🇰 Pakistan`},{c:`+20`,l:`🇪🇬 Egypt`},{c:`+880`,l:`🇧🇩 Bangladesh`},{c:`+94`,l:`🇱🇰 Sri Lanka`},{c:`+63`,l:`🇵🇭 Philippines`},{c:`+60`,l:`🇲🇾 Malaysia`},{c:`+62`,l:`🇮🇩 Indonesia`},{c:`+49`,l:`🇩🇪 Germany`},{c:`+33`,l:`🇫🇷 France`},{c:`+39`,l:`🇮🇹 Italy`},{c:`+34`,l:`🇪🇸 Spain`},{c:`+7`,l:`🇷🇺 Russia`},{c:`+86`,l:`🇨🇳 China`},{c:`+81`,l:`🇯🇵 Japan`},{c:`+82`,l:`🇰🇷 Korea`},{c:`+55`,l:`🇧🇷 Brazil`},{c:`+27`,l:`🇿🇦 S.Africa`},{c:`+234`,l:`🇳🇬 Nigeria`},{c:`+254`,l:`🇰🇪 Kenya`},{c:`+212`,l:`🇲🇦 Morocco`},{c:`+213`,l:`🇩🇿 Algeria`}],ie=`Afghan.Albanian.Algerian.American.Argentine.Australian.Austrian.Bahraini.Bangladeshi.Belgian.Brazilian.British.Bulgarian.Cameroonian.Canadian.Chilean.Chinese.Colombian.Croatian.Czech.Danish.Dutch.Egyptian.Emirati.Ethiopian.Filipino.Finnish.French.German.Ghanaian.Greek.Hungarian.Indian.Indonesian.Iranian.Iraqi.Irish.Italian.Ivorian.Japanese.Jordanian.Kenyan.Korean.Kuwaiti.Lebanese.Libyan.Malaysian.Moroccan.Mexican.Nepali.New Zealander.Nigerian.Norwegian.Omani.Pakistani.Palestinian.Polish.Portuguese.Qatari.Romanian.Russian.Saudi.Serbian.Singaporean.South African.Spanish.Sri Lankan.Sudanese.Swedish.Swiss.Syrian.Taiwanese.Thai.Tunisian.Turkish.Ugandan.Ukrainian.Uzbek.Venezuelan.Vietnamese.Yemeni.Zimbabwean`.split(`.`),ae=[``,`Single`,`Married`,`Divorced`,`Widowed`,`Prefer not to say`],oe=[``,`Male`,`Female`,`Non-binary`,`Other`,`Prefer not to say`],se=[``,`Immediately Available`,`1 Week`,`2 Weeks`,`1 Month`,`2 Months`,`3 Months`,`6 Months`],ce=[``,`UAE Light Vehicle`,`UAE Heavy Vehicle`,`Saudi Arabia`,`Kuwait`,`Qatar`,`Bahrain`,`Oman`,`UK Full`,`US Driver's License`,`European`,`International`,`Class A`,`Class B`,`Class C`],R=()=>Math.random().toString(36).slice(2,9),z=e=>String(e||``).split(`
`).map(e=>e.trim()).filter(Boolean),le=()=>({fullName:``,title:``,email:``,phoneCode:`+971`,phoneNum:``,location:``,linkedin:``,github:``,website:``,nationality:``,dob:``,drivingLicense:``,marital:``,gender:``,notice:``,summary:``,skills:``,hobbies:``,photoDataUrl:``,experience:[],education:[],projects:[],certifications:[],languages:[],awards:[],publications:[],volunteer:[],references:[]});function ue({toasts:e,onDismiss:t}){return(0,l.jsx)(`div`,{className:`cv-toasts`,role:`status`,"aria-live":`polite`,children:e.map(e=>(0,l.jsxs)(`div`,{className:`cv-toast t-${e.type}`,role:`alert`,children:[(0,l.jsx)(`span`,{children:e.msg}),(0,l.jsx)(`button`,{onClick:()=>t(e.id),"aria-label":`Dismiss`,children:`×`})]},e.id))})}function B({label:e,id:t,children:n,span2:r}){return(0,l.jsxs)(`div`,{className:`cv-field${r?` cv-span2`:``}`,children:[(0,l.jsx)(`label`,{className:`cv-lbl`,htmlFor:t,children:e}),n]})}function de({item:e,onUpdate:n,onRemove:r}){let[i,a]=(0,c.useState)(t({},e)),o=(e,r)=>{let o=t(t({},i),{},{[e]:r});a(o),n(o)},s=`exp-${i.id}`;return(0,c.useEffect)(()=>{a(t({},e))},[e.bullets]),(0,l.jsxs)(`div`,{className:`cv-shell`,children:[(0,l.jsxs)(`div`,{className:`cv-shell-h`,children:[(0,l.jsxs)(`span`,{className:`cv-shell-t`,children:[i.role||`New Role`,i.company?` @ `+i.company:``]}),(0,l.jsx)(`button`,{className:`cv-btn-rm`,onClick:r,"aria-label":`Remove ${i.role||`role`}`,children:`✕`})]}),(0,l.jsxs)(`div`,{className:`cv-g2`,children:[(0,l.jsx)(B,{label:`Role / Position *`,id:`${s}-role`,children:(0,l.jsx)(`input`,{id:`${s}-role`,className:`cv-inp`,value:i.role,placeholder:`Senior Engineer`,onChange:e=>o(`role`,e.target.value)})}),(0,l.jsx)(B,{label:`Employment Type`,id:`${s}-emptype`,children:(0,l.jsx)(`select`,{id:`${s}-emptype`,className:`cv-inp`,value:i.empType,onChange:e=>o(`empType`,e.target.value),children:F.map(e=>(0,l.jsx)(`option`,{children:e},e))})}),(0,l.jsx)(B,{label:`Company`,id:`${s}-company`,span2:!0,children:(0,l.jsx)(`input`,{id:`${s}-company`,className:`cv-inp`,value:i.company,placeholder:`Company name`,onChange:e=>o(`company`,e.target.value)})}),(0,l.jsx)(B,{label:`City`,id:`${s}-city`,children:(0,l.jsx)(`input`,{id:`${s}-city`,className:`cv-inp`,value:i.city,placeholder:`Dubai, UAE`,onChange:e=>o(`city`,e.target.value)})}),(0,l.jsx)(B,{label:`Industry`,id:`${s}-industry`,children:(0,l.jsx)(`select`,{id:`${s}-industry`,className:`cv-inp`,value:i.industry||``,onChange:e=>o(`industry`,e.target.value),children:[``,`Construction`,`Engineering`,`IT & Software`,`Finance`,`Healthcare`,`Education`,`Hospitality`,`Marketing`,`Legal`,`Manufacturing`,`Oil & Gas`,`Real Estate`,`Retail`,`Telecom`,`Transport`,`Other`].map(e=>(0,l.jsx)(`option`,{value:e,children:e||`— Select —`},e))})}),(0,l.jsx)(B,{label:`Start Date`,id:`${s}-start`,children:(0,l.jsx)(`input`,{id:`${s}-start`,className:`cv-inp`,value:i.start,placeholder:`Jan 2022`,onChange:e=>o(`start`,e.target.value)})}),(0,l.jsx)(B,{label:`End Date`,id:`${s}-end`,children:(0,l.jsx)(`input`,{id:`${s}-end`,className:`cv-inp`,value:i.current?`Present`:i.end,placeholder:`Present`,disabled:i.current,onChange:e=>o(`end`,e.target.value)})}),(0,l.jsx)(`div`,{className:`cv-field cv-span2`,children:(0,l.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:7,fontSize:`.8rem`,fontWeight:600,cursor:`pointer`,minHeight:`44px`},children:[(0,l.jsx)(`input`,{type:`checkbox`,checked:!!i.current,onChange:e=>{let r=t(t({},i),{},{current:e.target.checked});a(r),n(r)}}),` `,`Currently working here`]})})]}),(0,l.jsxs)(`div`,{style:{marginTop:10},children:[(0,l.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:5,flexWrap:`wrap`,gap:6},children:[(0,l.jsx)(`label`,{className:`cv-lbl`,htmlFor:`${s}-bullets`,children:`Key Achievements (one per line)`}),(0,l.jsx)(`button`,{className:`cv-ai-btn`,onClick:()=>n(t(t({},i),{},{_aiBullets:!0})),children:`✨ AI Write`})]}),(0,l.jsx)(`textarea`,{id:`${s}-bullets`,className:`cv-inp`,rows:4,placeholder:`Led a team of 8 engineers delivering $2M project on time
Reduced operational costs by 23% through automation`,value:i.bullets,onChange:e=>o(`bullets`,e.target.value)})]})]})}function fe({item:e,onUpdate:n,onRemove:r,onAiNotes:i}){let[a,o]=(0,c.useState)(t({},e)),s=(e,r)=>{let i=t(t({},a),{},{[e]:r});o(i),n(i)},u=`edu-${a.id}`;return(0,c.useEffect)(()=>{o(t({},e))},[e.notes]),(0,l.jsxs)(`div`,{className:`cv-shell`,children:[(0,l.jsxs)(`div`,{className:`cv-shell-h`,children:[(0,l.jsxs)(`span`,{className:`cv-shell-t`,children:[a.degree||`New Education`,a.school?` — `+a.school:``]}),(0,l.jsx)(`button`,{className:`cv-btn-rm`,onClick:r,"aria-label":`Remove ${a.degree||`education`}`,children:`✕`})]}),(0,l.jsxs)(`div`,{className:`cv-g2`,children:[(0,l.jsx)(B,{label:`Degree Type`,id:`${u}-degtype`,children:(0,l.jsx)(`select`,{id:`${u}-degtype`,className:`cv-inp`,value:a.degType,onChange:e=>s(`degType`,e.target.value),children:I.map(e=>(0,l.jsx)(`option`,{children:e},e))})}),(0,l.jsx)(B,{label:`Subject / Major *`,id:`${u}-degree`,children:(0,l.jsx)(`input`,{id:`${u}-degree`,className:`cv-inp`,value:a.degree,placeholder:`Mechanical Engineering`,onChange:e=>s(`degree`,e.target.value)})}),(0,l.jsx)(B,{label:`University / School`,id:`${u}-school`,span2:!0,children:(0,l.jsx)(`input`,{id:`${u}-school`,className:`cv-inp`,value:a.school,placeholder:`University name`,onChange:e=>s(`school`,e.target.value)})}),(0,l.jsx)(B,{label:`City`,id:`${u}-city`,children:(0,l.jsx)(`input`,{id:`${u}-city`,className:`cv-inp`,value:a.city,placeholder:`London, UK`,onChange:e=>s(`city`,e.target.value)})}),(0,l.jsx)(B,{label:`GPA / Grade`,id:`${u}-gpa`,children:(0,l.jsx)(`input`,{id:`${u}-gpa`,className:`cv-inp`,value:a.gpa,placeholder:`3.8/4.0 or First Class`,onChange:e=>s(`gpa`,e.target.value)})}),(0,l.jsx)(B,{label:`Start Year`,id:`${u}-start`,children:(0,l.jsx)(`input`,{id:`${u}-start`,className:`cv-inp`,value:a.start,placeholder:`2018`,onChange:e=>s(`start`,e.target.value)})}),(0,l.jsx)(B,{label:`End Year`,id:`${u}-end`,children:(0,l.jsx)(`input`,{id:`${u}-end`,className:`cv-inp`,value:a.end,placeholder:`2022`,onChange:e=>s(`end`,e.target.value)})})]}),(0,l.jsxs)(`div`,{className:`cv-field`,style:{marginTop:8},children:[(0,l.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:5},children:[(0,l.jsx)(`label`,{className:`cv-lbl`,htmlFor:`${u}-notes`,children:`Achievements / Notes`}),(0,l.jsx)(`button`,{className:`cv-ai-btn`,onClick:()=>i(a),children:`✨ AI Write`})]}),(0,l.jsx)(`textarea`,{id:`${u}-notes`,className:`cv-inp`,rows:2,placeholder:`Dean's List · Thesis: Renewable Energy Systems`,value:a.notes,onChange:e=>s(`notes`,e.target.value)})]})]})}function V({item:e,onUpdate:n,onRemove:r,onAiDesc:i,onAiNotes:a,children:o}){let[s,l]=(0,c.useState)(t({},e));return(0,c.useEffect)(()=>{l(t({},e))},[e.bullets,e.notes]),o(s,(e,r)=>{let i=t(t({},s),{},{[e]:r});l(i),n(i)},r,i,a)}function pe(){let[e,n]=(0,c.useState)(le),[r,i]=(0,c.useState)(`executive-pro`),[o,u]=(0,c.useState)(`#1e3a8a`),[d,p]=(0,c.useState)(`outfit`),[m,h]=(0,c.useState)(`medium`),[g,_]=(0,c.useState)(`a4`),[v,y]=(0,c.useState)(1),[b,S]=(0,c.useState)(`personal`),[C,w]=(0,c.useState)(`edit`),[T,ee]=(0,c.useState)(`All`),[F,I]=(0,c.useState)(!1),[pe,H]=(0,c.useState)([]),[U,W]=(0,c.useState)({}),G=(0,c.useRef)(null),me=(0,c.useRef)(null),he=(0,c.useRef)(null),K=(0,c.useCallback)((e,t=`inf`,n=3200)=>{let r=R();H(n=>[...n,{id:r,msg:e,type:t}]),setTimeout(()=>H(e=>e.filter(e=>e.id!==r)),n)},[]),ge=e=>H(t=>t.filter(t=>t.id!==e));(0,c.useEffect)(()=>{try{let e=localStorage.getItem(O);if(!e)return;let r=JSON.parse(e);r.data&&n(e=>t(t({},e),r.data)),r.tmpl&&i(r.tmpl),r.accent&&u(r.accent),r.fontId&&p(r.fontId),r.fontSize&&h(r.fontSize),r.paper&&_(r.paper)}catch(e){}},[]),(0,c.useEffect)(()=>{clearTimeout(he.current),he.current=setTimeout(()=>{try{localStorage.setItem(O,JSON.stringify({data:e,tmpl:r,accent:o,fontId:d,fontSize:m,paper:g}))}catch(e){}},400)},[e,r,o,d,m,g]);let q=(0,c.useCallback)(()=>{if(!G.current)return;let e=G.current.clientWidth-20;y(Math.min(1,+(e/j[g].w).toFixed(3)))},[g]);(0,c.useEffect)(()=>{q()},[q,g]),(0,c.useEffect)(()=>(window.addEventListener(`resize`,q),()=>window.removeEventListener(`resize`,q)),[q]),(0,c.useEffect)(()=>{let e=me.current;if(!e)return;let{w:t,h:n}=j[g];e.style.width=`${t}px`,e.style.minHeight=`${n}px`,e.style.transform=`scale(${v})`,e.style.transformOrigin=`top left`,e.style.position=`absolute`,e.style.left=`0`,e.style.top=`0`;let r=e.parentElement;r&&(r.style.width=`${t*v}px`,r.style.minHeight=`${n*v}px`,r.style.height=`auto`)},[v,g]),(0,c.useEffect)(()=>{C===`preview`&&setTimeout(q,50)},[C,q]);let J=(e,r)=>n(n=>t(t({},n),{},{[e]:r})),Y=(e,r)=>n(n=>t(t({},n),{},{[e]:[...n[e]||[],t({id:R()},r)]})),X=(e,r)=>n(n=>t(t({},n),{},{[e]:n[e].filter(e=>e.id!==r)})),Z=(e,r)=>n(n=>t(t({},n),{},{[e]:n[e].map(e=>e.id===r.id?r:e)})),_e=e=>{var t;let n=(t=e.target.files)==null?void 0:t[0];if(!n)return;if(!n.type.startsWith(`image/`))return K(`Pick an image file`,`err`);if(n.size>5e6)return K(`Max 5MB`,`err`);let r=new FileReader;r.onload=e=>{J(`photoDataUrl`,e.target.result),K(`Photo uploaded ✅`,`ok`)},r.readAsDataURL(n)},ve=()=>{let t=new Blob([JSON.stringify({data:e,tmpl:r,accent:o,fontId:d,fontSize:m,paper:g},null,2)],{type:`application/json`}),n=document.createElement(`a`);n.href=URL.createObjectURL(t),n.download=(e.fullName||`cv`).replace(/\s+/g,`_`)+`_cv.json`,n.click(),K(`CV saved as JSON ✅`,`ok`)},ye=e=>{var r;let a=(r=e.target.files)==null?void 0:r[0];if(!a)return;let o=new FileReader;o.onload=e=>{try{let r=JSON.parse(e.target.result);r.data&&n(e=>t(t({},e),r.data)),r.tmpl&&i(r.tmpl),r.accent&&u(r.accent),r.fontId&&p(r.fontId),r.fontSize&&h(r.fontSize),r.paper&&_(r.paper),K(`CV loaded ✅`,`ok`)}catch(e){K(`Invalid JSON file`,`err`)}},o.readAsText(a),e.target.value=``},be=()=>{window.confirm(`Reset all CV data?`)&&(localStorage.removeItem(O),n(le()),i(`executive-pro`),u(`#1e3a8a`),p(`outfit`),h(`medium`),_(`a4`),K(`Reset complete ✅`,`ok`))},Q=function(){var e=a(function*(e){return(yield(yield fetch(`https://eyhpcztyznrpwnytvakw.supabase.co//functions/v1/cv-ai`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({prompt:e})})).json()).result||``});return function(t){return e.apply(this,arguments)}}(),xe=function(){var n=a(function*(){W(e=>t(t({},e),{},{summary:!0})),K(`AI writing summary…`,`inf`,8e3);try{var n;let t=z(e.skills).slice(0,6).join(`, `)||`various skills`,r=(e.experience||[]).slice(0,2).map(e=>`${e.role} at ${e.company}`).join(`; `),i=(n=e.summary)==null?void 0:n.trim(),a=yield Q(`You are an expert CV writer. ${i?`Improve and expand this existing summary: "${i}"\n\nUse this additional context:`:`Write a punchy 2-3 sentence professional CV summary using this context:`}
Job Title: ${e.title||`Professional`}
Skills: ${t}
Experience: ${r||`Not specified`}
Rules:
- 2-3 sentences maximum
- Start with a strong action word
- Quantify impact where logical
- Output only the summary text, no labels or preamble`);a&&(J(`summary`,a),K(`Summary written ✅`,`ok`))}catch(e){K(`AI error — check console`,`err`)}finally{W(e=>t(t({},e),{},{summary:!1}))}});return function(){return n.apply(this,arguments)}}(),Se=function(){var n=a(function*(){W(e=>t(t({},e),{},{skills:!0}));try{let t=(e.experience||[]).slice(0,3).map(e=>`${e.role} at ${e.company}`).join(`, `),n=yield Q(`You are an expert CV writer. Generate exactly 12 ATS-optimized professional skills for:
Name: ${e.fullName||`Professional`}
Job Title: ${e.title||`Professional`}
Experience: ${t||`Not specified`}
Summary: ${e.summary||`Not specified`}
Rules:
- One skill per line
- Mix technical and soft skills relevant to their role
- No bullets, numbers, or preamble
- Just the skill names, one per line`);n&&(J(`skills`,n),K(`Skills added ✅`,`ok`))}catch(e){K(`AI error`,`err`)}finally{W(e=>t(t({},e),{},{skills:!1}))}});return function(){return n.apply(this,arguments)}}(),Ce=function(){var n=a(function*(n){K(`AI writing project description…`,`inf`,8e3);try{var r;let i=(r=n.bullets)==null?void 0:r.trim(),a=yield Q(`You are an expert CV writer. ${i?`Improve and expand these existing project bullet points: "${i}"\n\nUse this additional context:`:`Write 2-3 impressive bullet points using this context:`}
Person: ${e.fullName||`Developer`} | Title: ${e.title||`Professional`}
Project: ${n.name||`Project`} | Tech: ${n.tech||`Not specified`} | Status: ${n.status||`Completed`}
Rules:
- 2-3 short powerful bullet points
- Start each with a strong action verb
- Mention technologies used
- Quantify impact where logical
- One bullet per line, no bullet characters or numbers`);a&&(Z(`projects`,t(t({},n),{},{bullets:a})),K(`Project description written ✅`,`ok`))}catch(e){K(`AI error`,`err`)}});return function(e){return n.apply(this,arguments)}}(),we=function(){var e=a(function*(e){K(`AI writing education notes…`,`inf`,8e3);try{var n;let r=(n=e.notes)==null?void 0:n.trim(),i=yield Q(`You are an expert CV writer. ${r?`Improve and expand these existing education notes: "${r}"\n\nUse this additional context:`:`Write 2-3 impressive achievement notes using this context:`}
Degree: ${e.degType||``} in ${e.degree||``} | University: ${e.school||``} | GPA: ${e.gpa||`N/A`}
Rules:
- 2-3 short achievement notes
- Include thesis, projects, awards, dean's list if relevant
- One note per line, no bullet characters`);i&&(Z(`education`,t(t({},e),{},{notes:i})),K(`Education notes written ✅`,`ok`))}catch(e){K(`AI error`,`err`)}});return function(t){return e.apply(this,arguments)}}(),Te=function(){var n=a(function*(n){K(`AI writing bullets…`,`inf`,8e3);try{var r;let i=(r=n.bullets)==null?void 0:r.trim(),a=yield Q(`You are an expert CV writer. ${i?`Improve and expand these existing bullet points: "${i}"\n\nUse this additional context:`:`Write 3 powerful achievement bullet points using this context:`}
Person: ${e.fullName||`Professional`} | Title: ${e.title||`Professional`}
Role: ${n.role||`Professional`} at ${n.company||`Company`} | Industry: ${n.industry||`N/A`}
Duration: ${n.start||``}${n.current?` - Present`:n.end?` - `+n.end:``}
Rules:
- Start each bullet with a strong past-tense action verb
- Quantify impact with numbers/percentages where logical
- Keep each bullet under 20 words
- One bullet per line, no bullet characters or numbers`);a&&(Z(`experience`,t(t({},n),{},{bullets:a,_aiBullets:!1})),K(`Bullets written ✅`,`ok`))}catch(e){K(`AI error`,`err`)}});return function(e){return n.apply(this,arguments)}}();(0,c.useEffect)(()=>{let t=(e.experience||[]).find(e=>e._aiBullets);t&&Te(t)},[e.experience]);let{score:$,checks:Ee}=(0,c.useMemo)(()=>{var t,n,r,i,a;let o=e,s=0,c=[],l=(e,t,n)=>{e&&(s+=n),c.push({ok:e,msg:t})};l((t=o.fullName)==null?void 0:t.trim(),`Full name present`,8),l((n=o.email)==null?void 0:n.trim(),`Email address`,8),l((r=o.phoneNum)==null?void 0:r.trim(),`Phone number`,5),l((i=o.location)==null?void 0:i.trim(),`Location present`,5),l((o.summary||``).length>60,`Professional summary (60+ chars)`,15);let u=z(o.skills).length;l(u>=6,`${u} skills listed (aim 6+)`,12);let d=(o.experience||[]).filter(e=>(e.role||e.company||``).trim()).length;return l(d>=1,`${d} experience entr${d===1?`y`:`ies`}`,18),l((o.education||[]).filter(e=>(e.degree||e.school||``).trim()).length>=1,`Education section`,10),l((a=o.linkedin)==null?void 0:a.trim(),`LinkedIn URL added`,5),l((o.certifications||[]).filter(e=>{var t;return(t=e.name)==null?void 0:t.trim()}).length>=1,`Certifications added`,5),l((o.experience||[]).some(e=>(e.bullets||``).trim().length>10),`Achievement bullets in experience`,9),{score:Math.min(s,100),checks:c}},[e]),De=$>=80?`#047857`:$>=50?`#d97706`:`#b91c1c`,Oe=(0,c.useMemo)(()=>E(e,r,o,d,m,g,k,A,j),[e,r,o,d,m,g]);return(M.find(e=>e.id===r)||{l:r}).l,(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(`style`,{children:D}),(0,l.jsx)(`div`,{className:`cv-bg`,"aria-hidden":`true`}),(0,l.jsx)(ue,{toasts:pe,onDismiss:ge}),(0,l.jsx)(`div`,{className:`cvapp`,children:(0,l.jsxs)(`div`,{className:`cv-wrap`,children:[(0,l.jsxs)(`header`,{className:`cv-hero`,children:[(0,l.jsxs)(`div`,{className:`cv-hero-l`,children:[(0,l.jsx)(`span`,{className:`cv-badge`,children:`🧑‍💼 Career Tools`}),(0,l.jsxs)(`h1`,{children:[`Professional `,(0,l.jsx)(`span`,{className:`cv-grad`,children:`CV Maker`})]}),(0,l.jsx)(`p`,{className:`cv-hero-sub`,children:`AI-powered · 7 premium templates · ATS checker · perfect PDF. 100% free.`}),(0,l.jsx)(`div`,{className:`cv-pills`,children:[`7 Templates`,`AI Writing`,`ATS Score`,`PDF Print`].map(e=>(0,l.jsxs)(`span`,{className:`cv-pill`,children:[`✓ `,e]},e))})]}),(0,l.jsxs)(`div`,{className:`cv-ats-wrap`,children:[(0,l.jsx)(`div`,{className:`cv-ats-ring`,style:{background:`conic-gradient(${De} ${$}%, #e2e8f0 ${$}%)`},role:`meter`,"aria-valuenow":$,"aria-valuemin":0,"aria-valuemax":100,"aria-label":`ATS score: ${$} out of 100`,children:(0,l.jsxs)(`div`,{className:`cv-ats-inner`,children:[(0,l.jsx)(`span`,{className:`cv-ats-score`,"aria-hidden":`true`,children:$}),(0,l.jsx)(`span`,{className:`cv-ats-lbl`,"aria-hidden":`true`,children:`ATS Score`})]})}),(0,l.jsx)(`button`,{className:`cv-ats-btn`,onClick:()=>I(e=>!e),"aria-expanded":F,children:F?`Hide ↑`:`Checks ↓`})]})]}),(0,l.jsx)(`div`,{className:`cv-ats-panel${F?` open`:``}`,"aria-hidden":!F,children:Ee.map((e,t)=>(0,l.jsxs)(`div`,{className:`cv-ck ${e.ok?`ok`:`fail`}`,children:[(0,l.jsx)(`b`,{"aria-hidden":`true`,children:e.ok?`✓`:`✗`}),(0,l.jsx)(`span`,{children:e.msg})]},t))}),(0,l.jsx)(`nav`,{className:`cv-toolbar`,"aria-label":`CV file actions`,children:(0,l.jsxs)(`div`,{className:`cv-tbr`,children:[(0,l.jsxs)(`label`,{className:`cv-btn cv-btn-ghost cv-btn-sm cv-file-btn`,title:`Load saved CV`,children:[(0,l.jsx)(`span`,{"aria-hidden":`true`,children:`📂`}),` Load`,(0,l.jsx)(`input`,{type:`file`,accept:`.json`,onChange:ye,"aria-label":`Load CV from JSON file`})]}),(0,l.jsxs)(`button`,{className:`cv-btn cv-btn-ghost cv-btn-sm`,onClick:ve,children:[(0,l.jsx)(`span`,{"aria-hidden":`true`,children:`💾`}),` Save`]})]})}),(0,l.jsx)(`nav`,{className:`cv-main-tabs`,role:`tablist`,"aria-label":`CV editor sections`,children:[{id:`edit`,ico:`✍️`,lbl:`Edit`},{id:`templates`,ico:`🎨`,lbl:`Templates`},{id:`preview`,ico:`👁`,lbl:`Preview`}].map(e=>(0,l.jsxs)(`button`,{className:`cv-main-tab${C===e.id?` on`:``}`,role:`tab`,"aria-selected":C===e.id,onClick:()=>w(e.id),children:[(0,l.jsx)(`span`,{className:`tab-ico`,"aria-hidden":`true`,children:e.ico}),(0,l.jsx)(`span`,{children:e.lbl})]},e.id))}),(0,l.jsxs)(`div`,{className:`cv-grid`,children:[(0,l.jsxs)(`section`,{className:`cv-col-form cv-panel${C===`edit`?` on`:``}`,id:`panel-edit`,role:`tabpanel`,"aria-label":`Edit CV content`,children:[(0,l.jsx)(`nav`,{className:`cv-ftabs`,role:`tablist`,"aria-label":`CV form sections`,children:[[`personal`,`👤`,`Personal`],[`experience`,`💼`,`Work`],[`education`,`🎓`,`Education`],[`skills`,`🛠`,`Skills`],[`extras`,`⭐`,`Extras`]].map(([e,t,n])=>(0,l.jsxs)(`button`,{className:`cv-ftab${b===e?` on`:``}`,role:`tab`,"aria-selected":b===e,onClick:()=>S(e),children:[(0,l.jsx)(`span`,{className:`ico`,"aria-hidden":`true`,children:t}),(0,l.jsx)(`span`,{children:n})]},e))}),(0,l.jsxs)(`div`,{className:`cv-tpanel${b===`personal`?` on`:``}`,role:`tabpanel`,children:[(0,l.jsxs)(`div`,{className:`cv-card`,children:[(0,l.jsx)(`h2`,{className:`cv-card-t`,style:{marginBottom:12},children:`👤 Personal Details`}),(0,l.jsxs)(`div`,{className:`cv-g2`,children:[(0,l.jsx)(B,{label:`Full Name *`,id:`p-fullname`,children:(0,l.jsx)(`input`,{id:`p-fullname`,className:`cv-inp`,value:e.fullName||``,placeholder:`John Smith`,autoComplete:`name`,onChange:e=>J(`fullName`,e.target.value)})}),(0,l.jsx)(B,{label:`Job Title`,id:`p-title`,children:(0,l.jsx)(`input`,{id:`p-title`,className:`cv-inp`,value:e.title||``,placeholder:`Senior Engineer`,onChange:e=>J(`title`,e.target.value)})}),(0,l.jsx)(B,{label:`Email *`,id:`p-email`,children:(0,l.jsx)(`input`,{id:`p-email`,className:`cv-inp`,type:`email`,value:e.email||``,placeholder:`you@email.com`,autoComplete:`email`,onChange:e=>J(`email`,e.target.value)})}),(0,l.jsxs)(`div`,{className:`cv-field`,children:[(0,l.jsx)(`label`,{className:`cv-lbl`,htmlFor:`p-phonenum`,children:`Phone Number`}),(0,l.jsxs)(`div`,{className:`cv-phone-row`,children:[(0,l.jsx)(`select`,{id:`p-phonecode`,className:`cv-inp`,"aria-label":`Phone country code`,value:e.phoneCode||`+971`,onChange:e=>J(`phoneCode`,e.target.value),children:re.map(e=>(0,l.jsxs)(`option`,{value:e.c,children:[e.l,` `,e.c]},e.c))}),(0,l.jsx)(`input`,{id:`p-phonenum`,className:`cv-inp`,type:`tel`,value:e.phoneNum||``,placeholder:`50 123 4567`,onChange:e=>J(`phoneNum`,e.target.value)})]})]}),(0,l.jsx)(B,{label:`Location`,id:`p-location`,children:(0,l.jsx)(`input`,{id:`p-location`,className:`cv-inp`,value:e.location||``,placeholder:`Dubai, UAE`,onChange:e=>J(`location`,e.target.value)})}),(0,l.jsx)(B,{label:`LinkedIn URL`,id:`p-linkedin`,children:(0,l.jsx)(`input`,{id:`p-linkedin`,className:`cv-inp`,value:e.linkedin||``,placeholder:`linkedin.com/in/you`,onChange:e=>J(`linkedin`,e.target.value)})}),(0,l.jsx)(B,{label:`GitHub`,id:`p-github`,children:(0,l.jsx)(`input`,{id:`p-github`,className:`cv-inp`,value:e.github||``,placeholder:`github.com/user`,onChange:e=>J(`github`,e.target.value)})}),(0,l.jsx)(B,{label:`Website / Portfolio`,id:`p-website`,children:(0,l.jsx)(`input`,{id:`p-website`,className:`cv-inp`,value:e.website||``,placeholder:`yoursite.com`,onChange:e=>J(`website`,e.target.value)})}),(0,l.jsx)(B,{label:`Nationality`,id:`p-nationality`,children:(0,l.jsxs)(`select`,{id:`p-nationality`,className:`cv-inp`,value:e.nationality||``,onChange:e=>J(`nationality`,e.target.value),children:[(0,l.jsx)(`option`,{value:``,children:`— Select nationality —`}),ie.map(e=>(0,l.jsx)(`option`,{value:e,children:e},e))]})}),(0,l.jsx)(B,{label:`Date of Birth`,id:`p-dob`,children:(0,l.jsx)(`input`,{id:`p-dob`,className:`cv-inp`,type:`date`,value:e.dob||``,onChange:e=>J(`dob`,e.target.value)})}),(0,l.jsx)(B,{label:`Driving License`,id:`p-driving`,children:(0,l.jsx)(`select`,{id:`p-driving`,className:`cv-inp`,value:e.drivingLicense||``,onChange:e=>J(`drivingLicense`,e.target.value),children:ce.map(e=>(0,l.jsx)(`option`,{value:e,children:e||`— None —`},e))})}),(0,l.jsx)(B,{label:`Notice Period`,id:`p-notice`,children:(0,l.jsx)(`select`,{id:`p-notice`,className:`cv-inp`,value:e.notice||``,onChange:e=>J(`notice`,e.target.value),children:se.map(e=>(0,l.jsx)(`option`,{value:e,children:e||`— Not specified —`},e))})}),(0,l.jsx)(B,{label:`Marital Status`,id:`p-marital`,children:(0,l.jsx)(`select`,{id:`p-marital`,className:`cv-inp`,value:e.marital||``,onChange:e=>J(`marital`,e.target.value),children:ae.map(e=>(0,l.jsx)(`option`,{value:e,children:e||`— Prefer not to say —`},e))})}),(0,l.jsx)(B,{label:`Gender`,id:`p-gender`,children:(0,l.jsx)(`select`,{id:`p-gender`,className:`cv-inp`,value:e.gender||``,onChange:e=>J(`gender`,e.target.value),children:oe.map(e=>(0,l.jsx)(`option`,{value:e,children:e||`— Prefer not to say —`},e))})})]}),(0,l.jsxs)(`div`,{className:`cv-photo-row`,children:[(0,l.jsx)(`div`,{className:`cv-photo-thumb`,"aria-hidden":`true`,children:e.photoDataUrl?(0,l.jsx)(`img`,{src:e.photoDataUrl,alt:`Profile preview`}):`👤`}),(0,l.jsxs)(`div`,{className:`cv-photo-btns`,children:[(0,l.jsxs)(`label`,{className:`cv-btn cv-btn-ghost cv-btn-sm cv-file-btn`,children:[(0,l.jsx)(`span`,{"aria-hidden":`true`,children:`📷`}),` Upload Photo`,(0,l.jsx)(`input`,{type:`file`,accept:`image/*`,onChange:_e,"aria-label":`Upload profile photo`})]}),e.photoDataUrl&&(0,l.jsx)(`button`,{className:`cv-btn cv-btn-danger`,onClick:()=>J(`photoDataUrl`,``),children:`✕ Remove`}),(0,l.jsx)(`span`,{style:{fontSize:`.63rem`,color:`#4b5563`},children:`Max 5MB · JPG/PNG`})]})]})]}),(0,l.jsxs)(`div`,{className:`cv-card`,children:[(0,l.jsxs)(`div`,{className:`cv-card-h`,children:[(0,l.jsx)(`h2`,{className:`cv-card-t`,children:`📝 Professional Summary`}),(0,l.jsx)(`button`,{className:`cv-ai-btn`,disabled:!!U.summary,onClick:xe,children:U.summary?(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(`span`,{className:`cv-spinner`,"aria-hidden":`true`}),` Writing…`]}):`✨ AI Write`})]}),(0,l.jsx)(`label`,{className:`cv-lbl`,htmlFor:`p-summary`,style:{marginBottom:4},children:`Summary text`}),(0,l.jsx)(`textarea`,{id:`p-summary`,className:`cv-inp`,rows:4,placeholder:`Results-driven engineer with 8+ years delivering complex projects on time and under budget…`,value:e.summary||``,onChange:e=>J(`summary`,e.target.value)})]})]}),(0,l.jsx)(`div`,{className:`cv-tpanel${b===`experience`?` on`:``}`,role:`tabpanel`,children:(0,l.jsxs)(`div`,{className:`cv-card`,children:[(0,l.jsxs)(`div`,{className:`cv-card-h`,children:[(0,l.jsx)(`h2`,{className:`cv-card-t`,children:`💼 Work Experience`}),(0,l.jsx)(`button`,{className:`cv-btn-add`,onClick:()=>Y(`experience`,{role:``,company:``,companyLogo:``,empType:`Full-time`,industry:``,city:``,start:``,end:``,current:!1,bullets:``}),children:`+ Add`})]}),!(e.experience||[]).length&&(0,l.jsx)(`div`,{className:`cv-empty`,role:`status`,children:`💼 No experience added. Click + Add to start.`}),(e.experience||[]).map(e=>(0,l.jsx)(de,{item:e,onUpdate:e=>Z(`experience`,e),onRemove:()=>X(`experience`,e.id)},e.id))]})}),(0,l.jsxs)(`div`,{className:`cv-tpanel${b===`education`?` on`:``}`,role:`tabpanel`,children:[(0,l.jsxs)(`div`,{className:`cv-card`,children:[(0,l.jsxs)(`div`,{className:`cv-card-h`,children:[(0,l.jsx)(`h2`,{className:`cv-card-t`,children:`🎓 Education`}),(0,l.jsx)(`button`,{className:`cv-btn-add`,onClick:()=>Y(`education`,{degree:``,degType:`Bachelor's Degree`,school:``,schoolLogo:``,city:``,start:``,end:``,gpa:``,notes:``}),children:`+ Add`})]}),!(e.education||[]).length&&(0,l.jsx)(`div`,{className:`cv-empty`,role:`status`,children:`🎓 No education added yet.`}),(e.education||[]).map(e=>(0,l.jsx)(fe,{item:e,onUpdate:e=>Z(`education`,e),onRemove:()=>X(`education`,e.id),onAiNotes:we},e.id))]}),(0,l.jsxs)(`div`,{className:`cv-card`,children:[(0,l.jsxs)(`div`,{className:`cv-card-h`,children:[(0,l.jsx)(`h2`,{className:`cv-card-t`,children:`🛠 Projects`}),(0,l.jsx)(`button`,{className:`cv-btn-add`,onClick:()=>Y(`projects`,{name:``,tech:``,url:``,status:`Completed`,bullets:``}),children:`+ Add`})]}),!(e.projects||[]).length&&(0,l.jsx)(`div`,{className:`cv-empty`,role:`status`,children:`🛠 No projects yet.`}),(e.projects||[]).map(e=>(0,l.jsx)(V,{item:e,onUpdate:e=>Z(`projects`,e),onRemove:()=>X(`projects`,e.id),onAiDesc:Ce,children:(e,t,n,r)=>{let i=`proj-${e.id}`;return(0,l.jsxs)(`div`,{className:`cv-shell`,children:[(0,l.jsxs)(`div`,{className:`cv-shell-h`,children:[(0,l.jsx)(`span`,{className:`cv-shell-t`,children:e.name||`New Project`}),(0,l.jsx)(`button`,{className:`cv-btn-rm`,onClick:n,"aria-label":`Remove ${e.name||`project`}`,children:`✕`})]}),(0,l.jsxs)(`div`,{className:`cv-g2`,children:[(0,l.jsx)(B,{label:`Name *`,id:`${i}-name`,children:(0,l.jsx)(`input`,{id:`${i}-name`,className:`cv-inp`,value:e.name,placeholder:`Smart Dashboard`,onChange:e=>t(`name`,e.target.value)})}),(0,l.jsx)(B,{label:`Status`,id:`${i}-status`,children:(0,l.jsx)(`select`,{id:`${i}-status`,className:`cv-inp`,value:e.status,onChange:e=>t(`status`,e.target.value),children:L.map(e=>(0,l.jsx)(`option`,{children:e},e))})}),(0,l.jsx)(B,{label:`Tech / Year`,id:`${i}-tech`,children:(0,l.jsx)(`input`,{id:`${i}-tech`,className:`cv-inp`,value:e.tech,placeholder:`React, Python · 2024`,onChange:e=>t(`tech`,e.target.value)})}),(0,l.jsx)(B,{label:`URL`,id:`${i}-url`,children:(0,l.jsx)(`input`,{id:`${i}-url`,className:`cv-inp`,value:e.url,placeholder:`github.com/…`,onChange:e=>t(`url`,e.target.value)})})]}),(0,l.jsxs)(`div`,{className:`cv-field`,style:{marginTop:8},children:[(0,l.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:5},children:[(0,l.jsx)(`label`,{className:`cv-lbl`,htmlFor:`${i}-desc`,children:`Description`}),(0,l.jsx)(`button`,{className:`cv-ai-btn`,onClick:()=>r(e),children:`✨ AI Write`})]}),(0,l.jsx)(`textarea`,{id:`${i}-desc`,className:`cv-inp`,rows:2,value:e.bullets,onChange:e=>t(`bullets`,e.target.value)})]})]})}},e.id))]}),(0,l.jsxs)(`div`,{className:`cv-card`,children:[(0,l.jsxs)(`div`,{className:`cv-card-h`,children:[(0,l.jsx)(`h2`,{className:`cv-card-t`,children:`✅ Certifications`}),(0,l.jsx)(`button`,{className:`cv-btn-add`,onClick:()=>Y(`certifications`,{name:``,issuer:``,year:``,credId:``,expiry:``}),children:`+ Add`})]}),!(e.certifications||[]).length&&(0,l.jsx)(`div`,{className:`cv-empty`,role:`status`,children:`✅ No certifications yet.`}),(e.certifications||[]).map(e=>(0,l.jsx)(V,{item:e,onUpdate:e=>Z(`certifications`,e),onRemove:()=>X(`certifications`,e.id),children:(e,t,n)=>{let r=`cert-${e.id}`;return(0,l.jsxs)(`div`,{className:`cv-shell`,children:[(0,l.jsxs)(`div`,{className:`cv-shell-h`,children:[(0,l.jsx)(`span`,{className:`cv-shell-t`,children:e.name||`New Cert`}),(0,l.jsx)(`button`,{className:`cv-btn-rm`,onClick:n,"aria-label":`Remove ${e.name||`cert`}`,children:`✕`})]}),(0,l.jsxs)(`div`,{className:`cv-g2`,children:[(0,l.jsx)(B,{label:`Name *`,id:`${r}-name`,children:(0,l.jsx)(`input`,{id:`${r}-name`,className:`cv-inp`,value:e.name,placeholder:`AWS Solutions Architect`,onChange:e=>t(`name`,e.target.value)})}),(0,l.jsx)(B,{label:`Issuer`,id:`${r}-issuer`,children:(0,l.jsx)(`input`,{id:`${r}-issuer`,className:`cv-inp`,value:e.issuer,placeholder:`Amazon Web Services`,onChange:e=>t(`issuer`,e.target.value)})}),(0,l.jsx)(B,{label:`Year`,id:`${r}-year`,children:(0,l.jsx)(`input`,{id:`${r}-year`,className:`cv-inp`,value:e.year,placeholder:`2024`,onChange:e=>t(`year`,e.target.value)})}),(0,l.jsx)(B,{label:`Expiry`,id:`${r}-expiry`,children:(0,l.jsx)(`input`,{id:`${r}-expiry`,className:`cv-inp`,value:e.expiry,placeholder:`2027 / No Expiry`,onChange:e=>t(`expiry`,e.target.value)})}),(0,l.jsx)(B,{label:`Credential ID`,id:`${r}-credid`,span2:!0,children:(0,l.jsx)(`input`,{id:`${r}-credid`,className:`cv-inp`,value:e.credId,placeholder:`ABC-12345`,onChange:e=>t(`credId`,e.target.value)})})]})]})}},e.id))]})]}),(0,l.jsxs)(`div`,{className:`cv-tpanel${b===`skills`?` on`:``}`,role:`tabpanel`,children:[(0,l.jsxs)(`div`,{className:`cv-card`,children:[(0,l.jsxs)(`div`,{className:`cv-card-h`,children:[(0,l.jsx)(`h2`,{className:`cv-card-t`,children:`🛠 Skills`}),(0,l.jsx)(`button`,{className:`cv-ai-btn`,disabled:!!U.skills,onClick:Se,children:U.skills?(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(`span`,{className:`cv-spinner`,"aria-hidden":`true`}),`…`]}):`✨ AI Suggest`})]}),(0,l.jsx)(`p`,{style:{fontSize:`.7rem`,color:`#4b5563`,marginBottom:6},children:`One skill per line — ATS reads each keyword individually`}),(0,l.jsx)(`label`,{className:`cv-lbl`,htmlFor:`p-skills`,style:{marginBottom:4},children:`Skills list`}),(0,l.jsx)(`textarea`,{id:`p-skills`,className:`cv-inp`,rows:9,placeholder:`AutoCAD
Project Management
Python
MS Excel
Leadership
HVAC Design`,value:e.skills||``,onChange:e=>J(`skills`,e.target.value)}),(0,l.jsx)(`div`,{className:`cv-chips`,"aria-label":`Skill chips preview`,children:z(e.skills).map((e,t)=>(0,l.jsx)(`span`,{className:`cv-chip`,children:e},t))})]}),(0,l.jsxs)(`div`,{className:`cv-card`,children:[(0,l.jsx)(`h2`,{className:`cv-card-t`,style:{marginBottom:10},children:`🌐 Languages`}),!(e.languages||[]).length&&(0,l.jsx)(`div`,{className:`cv-empty`,role:`status`,children:`🌐 No languages added.`}),(e.languages||[]).map(e=>(0,l.jsx)(V,{item:e,onUpdate:e=>Z(`languages`,e),onRemove:()=>X(`languages`,e.id),children:(e,t,n)=>{let r=`lang-${e.id}`;return(0,l.jsx)(`div`,{className:`cv-shell`,style:{padding:`10px 11px`,marginTop:6},children:(0,l.jsxs)(`div`,{style:{display:`flex`,gap:7,alignItems:`center`},children:[(0,l.jsx)(`input`,{id:`${r}-lang`,className:`cv-inp`,value:e.lang,placeholder:`e.g. Arabic`,style:{flex:1},"aria-label":`Language name`,onChange:e=>t(`lang`,e.target.value)}),(0,l.jsx)(`select`,{id:`${r}-level`,className:`cv-inp`,value:e.level,style:{flex:1},"aria-label":`Language proficiency level`,onChange:e=>t(`level`,e.target.value),children:ne.map(e=>(0,l.jsx)(`option`,{children:e},e))}),(0,l.jsx)(`button`,{className:`cv-btn-rm`,onClick:n,"aria-label":`Remove ${e.lang||`language`}`,children:`✕`})]})})}},e.id)),(0,l.jsx)(`button`,{className:`cv-btn-add`,style:{marginTop:9},onClick:()=>Y(`languages`,{lang:``,level:`Professional`}),children:`+ Add Language`})]}),(0,l.jsxs)(`div`,{className:`cv-card`,children:[(0,l.jsx)(`h2`,{className:`cv-card-t`,style:{marginBottom:8},children:`🎯 Hobbies & Interests`}),(0,l.jsx)(`p`,{style:{fontSize:`.7rem`,color:`#4b5563`,marginBottom:6},children:`One per line or comma-separated`}),(0,l.jsx)(`label`,{className:`cv-lbl`,htmlFor:`p-hobbies`,style:{marginBottom:4},children:`Hobbies`}),(0,l.jsx)(`textarea`,{id:`p-hobbies`,className:`cv-inp`,rows:3,placeholder:`Photography · Cricket · Reading · Travel`,value:e.hobbies||``,onChange:e=>J(`hobbies`,e.target.value)})]})]}),(0,l.jsxs)(`div`,{className:`cv-tpanel${b===`extras`?` on`:``}`,role:`tabpanel`,children:[(0,l.jsxs)(`div`,{className:`cv-card`,children:[(0,l.jsxs)(`div`,{className:`cv-card-h`,children:[(0,l.jsx)(`h2`,{className:`cv-card-t`,children:`🏆 Awards`}),(0,l.jsx)(`button`,{className:`cv-btn-add`,onClick:()=>Y(`awards`,{title:``,issuer:``,year:``,desc:``}),children:`+ Add`})]}),!(e.awards||[]).length&&(0,l.jsx)(`div`,{className:`cv-empty`,role:`status`,children:`🏆 No awards yet.`}),(e.awards||[]).map(e=>(0,l.jsx)(V,{item:e,onUpdate:e=>Z(`awards`,e),onRemove:()=>X(`awards`,e.id),children:(e,t,n)=>{let r=`award-${e.id}`;return(0,l.jsxs)(`div`,{className:`cv-shell`,children:[(0,l.jsxs)(`div`,{className:`cv-shell-h`,children:[(0,l.jsx)(`span`,{className:`cv-shell-t`,children:e.title||`New Award`}),(0,l.jsx)(`button`,{className:`cv-btn-rm`,onClick:n,"aria-label":`Remove award`,children:`✕`})]}),(0,l.jsxs)(`div`,{className:`cv-g2`,children:[(0,l.jsx)(B,{label:`Title *`,id:`${r}-title`,children:(0,l.jsx)(`input`,{id:`${r}-title`,className:`cv-inp`,value:e.title,placeholder:`Employee of the Year`,onChange:e=>t(`title`,e.target.value)})}),(0,l.jsx)(B,{label:`Issuer`,id:`${r}-issuer`,children:(0,l.jsx)(`input`,{id:`${r}-issuer`,className:`cv-inp`,value:e.issuer,placeholder:`Organization`,onChange:e=>t(`issuer`,e.target.value)})}),(0,l.jsx)(B,{label:`Year`,id:`${r}-year`,children:(0,l.jsx)(`input`,{id:`${r}-year`,className:`cv-inp`,value:e.year,placeholder:`2024`,onChange:e=>t(`year`,e.target.value)})})]}),(0,l.jsxs)(`div`,{className:`cv-field`,style:{marginTop:8},children:[(0,l.jsx)(`label`,{className:`cv-lbl`,htmlFor:`${r}-desc`,children:`Description`}),(0,l.jsx)(`textarea`,{id:`${r}-desc`,className:`cv-inp`,rows:2,value:e.desc,onChange:e=>t(`desc`,e.target.value)})]})]})}},e.id))]}),(0,l.jsxs)(`div`,{className:`cv-card`,children:[(0,l.jsxs)(`div`,{className:`cv-card-h`,children:[(0,l.jsx)(`h2`,{className:`cv-card-t`,children:`📋 References`}),(0,l.jsx)(`button`,{className:`cv-btn-add`,onClick:()=>Y(`references`,{name:``,refTitle:``,company:``,email:``,phone:``,relationship:`Manager`}),children:`+ Add`})]}),!(e.references||[]).length&&(0,l.jsx)(`div`,{className:`cv-empty`,role:`status`,children:`📋 No references added.`}),(e.references||[]).map(e=>(0,l.jsx)(V,{item:e,onUpdate:e=>Z(`references`,e),onRemove:()=>X(`references`,e.id),children:(e,t,n)=>{let r=`ref-${e.id}`;return(0,l.jsxs)(`div`,{className:`cv-shell`,children:[(0,l.jsxs)(`div`,{className:`cv-shell-h`,children:[(0,l.jsx)(`span`,{className:`cv-shell-t`,children:e.name||`New Reference`}),(0,l.jsx)(`button`,{className:`cv-btn-rm`,onClick:n,"aria-label":`Remove reference`,children:`✕`})]}),(0,l.jsxs)(`div`,{className:`cv-g2`,children:[(0,l.jsx)(B,{label:`Name *`,id:`${r}-name`,children:(0,l.jsx)(`input`,{id:`${r}-name`,className:`cv-inp`,value:e.name,placeholder:`Dr. Sarah Johnson`,onChange:e=>t(`name`,e.target.value)})}),(0,l.jsx)(B,{label:`Relationship`,id:`${r}-rel`,children:(0,l.jsx)(`select`,{id:`${r}-rel`,className:`cv-inp`,value:e.relationship,onChange:e=>t(`relationship`,e.target.value),children:P.map(e=>(0,l.jsx)(`option`,{children:e},e))})}),(0,l.jsx)(B,{label:`Job Title`,id:`${r}-reftitle`,children:(0,l.jsx)(`input`,{id:`${r}-reftitle`,className:`cv-inp`,value:e.refTitle,placeholder:`Head of Engineering`,onChange:e=>t(`refTitle`,e.target.value)})}),(0,l.jsx)(B,{label:`Company`,id:`${r}-company`,children:(0,l.jsx)(`input`,{id:`${r}-company`,className:`cv-inp`,value:e.company,placeholder:`Tech Corp`,onChange:e=>t(`company`,e.target.value)})}),(0,l.jsx)(B,{label:`Email`,id:`${r}-email`,children:(0,l.jsx)(`input`,{id:`${r}-email`,className:`cv-inp`,value:e.email,placeholder:`s@company.com`,onChange:e=>t(`email`,e.target.value)})}),(0,l.jsx)(B,{label:`Phone`,id:`${r}-phone`,children:(0,l.jsx)(`input`,{id:`${r}-phone`,className:`cv-inp`,value:e.phone,placeholder:`+971…`,onChange:e=>t(`phone`,e.target.value)})})]})]})}},e.id))]}),(0,l.jsx)(`button`,{className:`cv-btn cv-btn-danger cv-btn-sm`,style:{marginTop:8,width:`100%`,justifyContent:`center`,borderRadius:`var(--r)`},onClick:be,children:`🗑️ Reset All Data`})]})]}),(0,l.jsxs)(`section`,{className:`cv-col-prev cv-panel${C===`templates`||C===`preview`?` on`:``}`,id:`panel-right`,role:`tabpanel`,"aria-label":`Templates and CV preview`,children:[(0,l.jsx)(`div`,{className:C===`preview`?`cv-desktop-only`:``,children:(0,l.jsx)(f,{currentTemplate:r,setTemplate:i,accent:o,activeCat:T,setActiveCat:ee,TEMPLATES:M,CATS:N})}),(0,l.jsx)(`div`,{className:C===`templates`?`cv-desktop-only`:``,style:{marginTop:C===`preview`?0:14},children:(0,l.jsx)(x,{cvHtml:Oe,zoom:v,setZoom:y,fitZoom:q,paperRef:me,prevScrollRef:G,accent:o,setAccent:u,fontId:d,setFontId:p,fontSize:m,setFontSize:h,paper:g,setPaper:_,ACCENTS:te,FONTS:k,FSIZES:A,PAPERS:j,fullName:e.fullName,toast:K})})]})]})]})}),(0,l.jsx)(`div`,{style:{position:`relative`,zIndex:2},children:(0,l.jsx)(s,{})})]})}export{pe as default};