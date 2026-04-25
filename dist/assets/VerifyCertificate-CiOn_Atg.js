import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{a as t,l as n,o as r}from"./vendor-helmet-D-cMCI9i.js";import{tr as i}from"./vendor-misc-DjQaoctO.js";import{u as a}from"./vendor-router-BeHthcJc.js";import"./vendor-supabase-DTLzbyhy.js";import{t as o}from"./supabase-CXCPPx9q.js";import{r as s}from"./vendor-motion-DyarDpDD.js";import{n as c}from"./index-CPLV-0JN.js";var l=e(n(),1),u=s();r();var d={blue:`#0056D2`,blueDark:`#003A8C`,ink:`#1A1A2E`,slate:`#475569`,muted:`#94A3B8`,border:`#E8EDF5`,bg:`#F4F7FC`,white:`#FFFFFF`,success:`#059669`,successBg:`#ECFDF5`,successBdr:`#6EE7B7`,red:`#DC2626`,redBg:`#FEF2F2`,redBdr:`#FECACA`};function f({size:e=46}){return(0,u.jsxs)(`svg`,{viewBox:`0 0 90 90`,width:e,height:e,xmlns:`http://www.w3.org/2000/svg`,style:{display:`block`,flexShrink:0},children:[(0,u.jsx)(`defs`,{children:(0,u.jsxs)(`radialGradient`,{id:`vsg2`,cx:`38%`,cy:`36%`,r:`65%`,children:[(0,u.jsx)(`stop`,{offset:`0%`,stopColor:`#FFD85C`}),(0,u.jsx)(`stop`,{offset:`55%`,stopColor:`#F5A623`}),(0,u.jsx)(`stop`,{offset:`100%`,stopColor:`#D4860A`})]})}),(0,u.jsx)(`circle`,{cx:`45`,cy:`46`,r:`43`,fill:`rgba(0,0,0,0.07)`}),(0,u.jsx)(`circle`,{cx:`45`,cy:`45`,r:`43`,fill:`url(#vsg2)`}),(0,u.jsx)(`circle`,{cx:`45`,cy:`45`,r:`43`,fill:`none`,stroke:`white`,strokeWidth:`3`,opacity:`0.85`}),(0,u.jsx)(`circle`,{cx:`45`,cy:`45`,r:`40`,fill:`none`,stroke:`#D4860A`,strokeWidth:`1`}),(0,u.jsx)(`circle`,{cx:`45`,cy:`45`,r:`33`,fill:`none`,stroke:`#78350F`,strokeWidth:`1`,strokeDasharray:`3 2.5`,opacity:`0.4`}),(0,u.jsx)(`text`,{x:`45`,y:`37`,textAnchor:`middle`,fontFamily:`Arial,sans-serif`,fontSize:`8`,fontWeight:`900`,fill:`#78350F`,letterSpacing:`1.5`,children:`AIDLA`}),(0,u.jsx)(`text`,{x:`45`,y:`50`,textAnchor:`middle`,fontFamily:`Arial,sans-serif`,fontSize:`12`,fontWeight:`900`,fill:`#78350F`,children:`✓`}),(0,u.jsx)(`text`,{x:`45`,y:`61`,textAnchor:`middle`,fontFamily:`Arial,sans-serif`,fontSize:`7`,fontWeight:`900`,fill:`#78350F`,letterSpacing:`2`,children:`CERT`}),(0,u.jsx)(`circle`,{cx:`45`,cy:`4`,r:`2.2`,fill:`#D4860A`}),(0,u.jsx)(`circle`,{cx:`45`,cy:`86`,r:`2.2`,fill:`#D4860A`}),(0,u.jsx)(`circle`,{cx:`4`,cy:`45`,r:`2.2`,fill:`#D4860A`}),(0,u.jsx)(`circle`,{cx:`86`,cy:`45`,r:`2.2`,fill:`#D4860A`})]})}function p(){let{certId:e}=a(),[n,r]=(0,l.useState)(null),[s,p]=(0,l.useState)(!0),[m,h]=(0,l.useState)(!1);(0,l.useEffect)(()=>{g()},[e]);let g=function(){var n=i(function*(){try{let{data:n,error:i}=yield o.from(`course_certificates`).select(`*`).eq(`id`,e).single();if(i||!n){h(!1),p(!1);return}let{data:a}=yield o.from(`course_courses`).select(`title,level,category`).eq(`id`,n.course_id).single(),{data:s}=yield o.from(`users_profiles`).select(`full_name`).eq(`user_id`,n.user_id).single();r(t(t({},n),{},{course_title:(a==null?void 0:a.title)||`—`,course_level:(a==null?void 0:a.level)||``,course_category:(a==null?void 0:a.category)||``,student_name:(s==null?void 0:s.full_name)||`Learner`})),h(!0)}catch(e){h(!1)}p(!1)});return function(){return n.apply(this,arguments)}}(),_=n?new Date(n.issued_at).toLocaleDateString(`en-US`,{year:`numeric`,month:`long`,day:`numeric`}):``;return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`style`,{children:`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        /* ═══════════════════════════════════════════════════════
           NUCLEAR OVERFLOW RESET
           The verify page lives inside App.jsx's public wrapper:
             <main class="container">
               <div class="card page">  ← this div has its own padding/margin
           We must escape that wrapper completely.
        ═══════════════════════════════════════════════════════ */

        /* Lock the whole document — two sources to cover all browsers */
        html { overflow-x: hidden !important; }
        body { overflow-x: hidden !important; max-width: 100vw !important; }

        /* The App.jsx public wrapper adds padding/margin — neutralise it */
        .vp-escape-wrapper {
          /* Pull out of any parent padding by using negative margins */
          margin-left:  calc(-1 * var(--app-pad, 0px));
          margin-right: calc(-1 * var(--app-pad, 0px));
          /* Safety: never let THIS element be wider than the viewport */
          width: 100vw;
          max-width: 100vw;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        /* ── Inner page layout ── */
        .vp-page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          background: ${d.bg};
          box-sizing: border-box;
          /* Reset any inherited font */
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Make every child respect the box */
        .vp-page *, .vp-page *::before, .vp-page *::after {
          box-sizing: border-box;
          max-width: 100%;
        }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        /* ── Top bar ── */
        .vp-topbar {
          width: 100%;
          max-width: 100%;
          background: ${d.white};
          border-bottom: 1px solid ${d.border};
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          overflow: hidden;       /* clip children that might bleed */
        }
        .vp-topbar-brand {
          font-weight: 900;
          font-size: 15px;
          letter-spacing: 2px;   /* small — large spacing adds phantom width */
          color: ${d.blueDark};
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .vp-topbar-label {
          font-size: 9px;
          font-weight: 700;
          color: ${d.muted};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: right;
          min-width: 0;
          flex-shrink: 1;
        }

        /* ── Content area ── */
        .vp-main {
          flex: 1;
          width: 100%;
          /* Centred column, never wider than 560px */
          max-width: 560px;
          margin: 0 auto;
          padding: 20px 16px 44px;
          overflow: hidden;
        }

        /* ── Verified banner ── */
        .vp-hero {
          background: ${d.successBg};
          border: 2px solid ${d.successBdr};
          border-radius: 14px;
          padding: 18px 14px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
          animation: fadeUp .4s ease both;
        }
        .vp-check-ring {
          width: 48px; height: 48px;
          min-width: 48px;
          border-radius: 50%;
          background: ${d.success};
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 5px rgba(5,150,105,.12);
        }
        .vp-check-icon {
          font-size: 20px; color: white; display: block;
          animation: checkPop .5s cubic-bezier(.34,1.56,.64,1) .1s both;
        }
        .vp-hero-body {
          flex: 1;
          min-width: 0;       /* ← required for text truncation in flex children */
          overflow: hidden;
        }
        .vp-hero-title {
          font-weight: 900;
          font-size: clamp(15px, 4vw, 19px);
          color: #064E3B;
          margin-bottom: 3px;
          line-height: 1.2;
        }
        .vp-hero-sub {
          font-size: clamp(11px, 2.8vw, 12.5px);
          color: #047857;
          line-height: 1.5;
        }

        /* ── Details card ── */
        .vp-card {
          background: ${d.white};
          border-radius: 14px;
          border: 1px solid ${d.border};
          box-shadow: 0 3px 16px rgba(0,0,0,.06);
          overflow: hidden;       /* clips the ghost watermark absolutely */
          margin-bottom: 12px;
          animation: fadeUp .45s ease .07s both;
        }
        .vp-card-head {
          background: linear-gradient(135deg, ${d.blueDark}, ${d.blue});
          padding: 16px 18px;
          position: relative;
          overflow: hidden;
        }
        /* Ghost watermark — contained inside overflow:hidden parent */
        .vp-card-head::after {
          content: 'AIDLA';
          position: absolute;
          right: -6px; top: 50%;
          transform: translateY(-50%);
          font-size: 56px; font-weight: 900;
          color: rgba(255,255,255,0.05);
          letter-spacing: 3px;
          pointer-events: none; user-select: none;
          white-space: nowrap;
        }
        .vp-card-eyebrow {
          font-size: 8.5px; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,0.5); margin-bottom: 4px;
        }
        .vp-card-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-style: italic; font-size: clamp(16px, 4vw, 21px);
          color: ${d.white}; font-weight: 400; line-height: 1.2;
        }
        .vp-card-body { padding: 16px 18px; }

        /* ── Data rows ── */
        .vp-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px solid ${d.border};
        }
        .vp-row:last-child { padding-bottom: 0; margin-bottom: 0; border-bottom: none; }

        .vp-row-label {
          font-size: 9.5px; font-weight: 700;
          color: ${d.muted}; text-transform: uppercase;
          letter-spacing: .7px; flex-shrink: 0;
          padding-top: 2px; min-width: 62px;
        }
        .vp-row-val {
          font-size: 13px; font-weight: 600; color: ${d.slate};
          text-align: right;
          /* Long cert IDs / UUIDs MUST wrap — never overflow */
          word-break: break-all;
          overflow-wrap: anywhere;
          min-width: 0;
          line-height: 1.4;
        }
        .vp-row-val.large {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(13px, 3.8vw, 16px);
          font-weight: 800; font-style: italic;
          color: ${d.ink};
          word-break: normal;
          overflow-wrap: break-word;
        }
        .vp-row-val.mono {
          font-family: 'Courier New', monospace;
          font-size: 10px; line-height: 1.6;
          word-break: break-all;
          overflow-wrap: anywhere;
        }

        /* ── Issuer strip ── */
        .vp-issuer {
          background: ${d.white};
          border: 1px solid ${d.border};
          border-radius: 12px;
          padding: 13px 14px;
          display: flex;
          align-items: center;
          gap: 11px;
          overflow: hidden;
          margin-bottom: 10px;
          animation: fadeUp .45s ease .14s both;
        }
        .vp-issuer-text {
          flex: 1;
          min-width: 0;   /* flex child needs this to respect overflow */
          overflow: hidden;
        }
        .vp-issuer-name {
          font-size: 12.5px; font-weight: 700; color: ${d.ink};
          margin-bottom: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .vp-issuer-sub {
          font-size: 10.5px; color: ${d.muted};
          line-height: 1.4;
          /* wrap rather than overflow on small screens */
          word-break: break-word;
        }
        .vp-valid-chip {
          flex-shrink: 0;
          background: ${d.successBg};
          border: 1.5px solid ${d.successBdr};
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 10.5px; font-weight: 800;
          color: ${d.success};
          white-space: nowrap;
        }

        /* ── Cert ID chip ── */
        .vp-id-chip {
          background: ${d.bg};
          border: 1px solid ${d.border};
          border-radius: 9px;
          padding: 10px 14px;
          overflow: hidden;
          animation: fadeUp .45s ease .2s both;
        }
        .vp-id-chip-label {
          font-size: 9px; font-weight: 700;
          color: ${d.muted}; text-transform: uppercase;
          letter-spacing: .8px; margin-bottom: 5px;
        }
        .vp-id-chip-val {
          font-family: 'Courier New', monospace;
          font-size: 10.5px; color: ${d.slate};
          word-break: break-all;
          overflow-wrap: anywhere;
          line-height: 1.55;
        }

        /* ── Invalid state ── */
        .vp-invalid {
          background: ${d.redBg};
          border: 2px solid ${d.redBdr};
          border-radius: 14px;
          padding: 28px 18px;
          text-align: center;
          overflow: hidden;
          animation: fadeUp .4s ease both;
        }
        .vp-invalid-icon  { font-size: 44px; display: block; margin-bottom: 12px; }
        .vp-invalid-title { font-weight: 900; font-size: clamp(16px,4.5vw,20px); color: ${d.red}; margin-bottom: 9px; }
        .vp-invalid-body  { font-size: clamp(11.5px,3vw,13px); color: #7F1D1D; line-height: 1.6; }
        .vp-invalid-id {
          display: block; margin-top: 14px;
          background: ${d.white}; border: 1px solid ${d.redBdr};
          border-radius: 6px; padding: 7px 12px;
          font-family: 'Courier New', monospace;
          font-size: 10px; color: ${d.red};
          word-break: break-all; overflow-wrap: anywhere;
          text-align: center;
        }

        /* ── Loading ── */
        .vp-loading {
          display: flex; flex-direction: column;
          align-items: center; gap: 13px;
          padding: 60px 0;
          animation: fadeIn .3s ease both;
        }
        .vp-spinner {
          width: 40px; height: 40px; flex-shrink: 0;
          border: 3.5px solid ${d.border};
          border-top-color: ${d.blue};
          border-radius: 50%;
          animation: spin .75s linear infinite;
        }
        .vp-loading-txt {
          font-size: 12.5px; font-weight: 600; color: ${d.muted};
          background: linear-gradient(90deg, ${d.muted} 25%, ${d.border} 50%, ${d.muted} 75%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 1.8s linear infinite;
        }

        /* ── Footer override — stop footer from causing scroll ──
           The footer's .ft-inner has padding:40px 24px which is fine
           on desktop but its .ft-grid gap can push things on mobile.
           We clamp the footer inside our escape wrapper too. */
        .vp-escape-wrapper .ft-root {
          max-width: 100%;
          overflow-x: hidden;
        }
        .vp-escape-wrapper .ft-inner {
          padding-left: 16px !important;
          padding-right: 16px !important;
          max-width: 100% !important;
          overflow-x: hidden;
        }
        .vp-escape-wrapper .ft-grid {
          overflow-x: hidden;
        }
        .vp-escape-wrapper .ft-nl-row {
          max-width: 100%;
        }
        @media(min-width: 480px) {
          .vp-topbar { padding: 13px 20px; }
          .vp-main   { padding: 24px 20px 52px; }
          .vp-hero   { padding: 20px 18px; gap: 14px; }
          .vp-card-head  { padding: 18px 22px; }
          .vp-card-body  { padding: 18px 22px; }
          .vp-issuer     { padding: 14px 18px; gap: 13px; }
          .vp-id-chip    { padding: 12px 16px; }
        }
        @media(min-width: 640px) {
          .vp-main { padding: 36px 24px 60px; }
          .vp-escape-wrapper .ft-inner {
            padding-left: 40px !important;
            padding-right: 40px !important;
          }
        }
      `}),(0,u.jsx)(`div`,{className:`vp-escape-wrapper`,children:(0,u.jsxs)(`div`,{className:`vp-page`,children:[(0,u.jsxs)(`div`,{className:`vp-topbar`,children:[(0,u.jsx)(`span`,{className:`vp-topbar-brand`,children:`AIDLA`}),(0,u.jsxs)(`span`,{className:`vp-topbar-label`,children:[`Certificate`,(0,u.jsx)(`br`,{}),`Verification`]})]}),(0,u.jsx)(`main`,{className:`vp-main`,children:s?(0,u.jsxs)(`div`,{className:`vp-loading`,children:[(0,u.jsx)(`div`,{className:`vp-spinner`}),(0,u.jsx)(`span`,{className:`vp-loading-txt`,children:`Verifying certificate authenticity…`})]}):m&&n?(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(`div`,{className:`vp-hero`,children:[(0,u.jsx)(`div`,{className:`vp-check-ring`,children:(0,u.jsx)(`span`,{className:`vp-check-icon`,children:`✓`})}),(0,u.jsxs)(`div`,{className:`vp-hero-body`,children:[(0,u.jsx)(`div`,{className:`vp-hero-title`,children:`Certificate Verified`}),(0,u.jsx)(`div`,{className:`vp-hero-sub`,children:`Authentic, unmodified AIDLA certificate.`})]})]}),(0,u.jsxs)(`div`,{className:`vp-card`,children:[(0,u.jsxs)(`div`,{className:`vp-card-head`,children:[(0,u.jsx)(`div`,{className:`vp-card-eyebrow`,children:`AIDLA · Verified`}),(0,u.jsx)(`div`,{className:`vp-card-title`,children:`Certificate of Completion`})]}),(0,u.jsxs)(`div`,{className:`vp-card-body`,children:[(0,u.jsxs)(`div`,{className:`vp-row`,children:[(0,u.jsx)(`span`,{className:`vp-row-label`,children:`Awarded To`}),(0,u.jsx)(`span`,{className:`vp-row-val large`,children:n.student_name})]}),(0,u.jsxs)(`div`,{className:`vp-row`,children:[(0,u.jsx)(`span`,{className:`vp-row-label`,children:`Course`}),(0,u.jsx)(`span`,{className:`vp-row-val`,children:n.course_title})]}),n.course_level&&(0,u.jsxs)(`div`,{className:`vp-row`,children:[(0,u.jsx)(`span`,{className:`vp-row-label`,children:`Level`}),(0,u.jsx)(`span`,{className:`vp-row-val`,children:n.course_level})]}),n.course_category&&(0,u.jsxs)(`div`,{className:`vp-row`,children:[(0,u.jsx)(`span`,{className:`vp-row-label`,children:`Category`}),(0,u.jsx)(`span`,{className:`vp-row-val`,children:n.course_category})]}),(0,u.jsxs)(`div`,{className:`vp-row`,children:[(0,u.jsx)(`span`,{className:`vp-row-label`,children:`Date Issued`}),(0,u.jsx)(`span`,{className:`vp-row-val`,children:_})]}),(0,u.jsxs)(`div`,{className:`vp-row`,children:[(0,u.jsx)(`span`,{className:`vp-row-label`,children:`Cert No`}),(0,u.jsx)(`span`,{className:`vp-row-val mono`,children:n.certificate_number})]}),(0,u.jsxs)(`div`,{className:`vp-row`,children:[(0,u.jsx)(`span`,{className:`vp-row-label`,children:`Cert ID`}),(0,u.jsx)(`span`,{className:`vp-row-val mono`,children:n.id})]})]})]}),(0,u.jsxs)(`div`,{className:`vp-issuer`,children:[(0,u.jsx)(f,{size:44}),(0,u.jsxs)(`div`,{className:`vp-issuer-text`,children:[(0,u.jsx)(`div`,{className:`vp-issuer-name`,children:`Issued by AIDLA`}),(0,u.jsx)(`div`,{className:`vp-issuer-sub`,children:`AI Digital Learning Academy · aidla.com`})]}),(0,u.jsx)(`div`,{className:`vp-valid-chip`,children:`✓ Valid`})]}),(0,u.jsxs)(`div`,{className:`vp-id-chip`,children:[(0,u.jsx)(`div`,{className:`vp-id-chip-label`,children:`Certificate ID`}),(0,u.jsx)(`div`,{className:`vp-id-chip-val`,children:e})]})]}):(0,u.jsxs)(`div`,{className:`vp-invalid`,children:[(0,u.jsx)(`span`,{className:`vp-invalid-icon`,children:`❌`}),(0,u.jsx)(`div`,{className:`vp-invalid-title`,children:`Certificate Not Found`}),(0,u.jsx)(`div`,{className:`vp-invalid-body`,children:`This certificate ID does not exist in our records, or may have been revoked. Contact AIDLA support if you believe this is an error.`}),(0,u.jsx)(`code`,{className:`vp-invalid-id`,children:e})]})}),(0,u.jsx)(c,{})]})})]})}export{p as default};