import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t,n}from"./vendor-helmet-D-cMCI9i.js";import{tr as r}from"./vendor-misc-DjQaoctO.js";import{n as i}from"./vendor-router-BeHthcJc.js";import"./vendor-supabase-DTLzbyhy.js";import"./supabase-CXCPPx9q.js";import{n as a,r as o,t as s}from"./vendor-motion-DyarDpDD.js";import{n as c}from"./index-CPLV-0JN.js";var l=e(t(),1),u=o(),d=e=>parseFloat(e),f=e=>{if(isNaN(e)||!isFinite(e))return null;let t=Math.round(e*1e4)/1e4;return t%1==0?t.toLocaleString():parseFloat(t.toFixed(4)).toLocaleString()},p=[{id:`marks`,icon:`📝`,label:`Marks %`,short:`Marks`},{id:`whatpct`,icon:`🔢`,label:`X% of Number`,short:`X% of Y`},{id:`iswhat`,icon:`❓`,label:`X is what % of Y`,short:`X of Y`},{id:`increase`,icon:`📈`,label:`% Increase`,short:`Increase`},{id:`decrease`,icon:`📉`,label:`% Decrease`,short:`Decrease`},{id:`addpct`,icon:`➕`,label:`Add %`,short:`Add %`},{id:`subpct`,icon:`➖`,label:`Subtract %`,short:`Sub %`}];function m(e,t){let[n,r]=[d(t[0]),d(t[1])];if(isNaN(n)||isNaN(r)||r===0)return null;switch(e){case`marks`:return{value:f(n/r*100),unit:`%`,label:`${t[0]} out of ${t[1]}`};case`whatpct`:return{value:f(n/100*r),unit:``,label:`${t[0]}% of ${t[1]}`};case`iswhat`:return{value:f(n/r*100),unit:`%`,label:`${t[0]} out of ${t[1]}`};case`increase`:{let e=(r-n)/n*100;return{value:f(Math.abs(e)),unit:e>=0?`% increase`:`% decrease`,label:`${t[0]} → ${t[1]}`}}case`decrease`:{let e=(n-r)/n*100;return{value:f(Math.abs(e)),unit:e>=0?`% decrease`:`% increase`,label:`${t[0]} → ${t[1]}`}}case`addpct`:return{value:f(r+r*n/100),unit:``,label:`${t[1]} + ${t[0]}%`};case`subpct`:return{value:f(r-r*n/100),unit:``,label:`${t[1]} − ${t[0]}%`};default:return null}}var h={marks:[{label:`Marks Obtained`,ph:`e.g. 455`},{label:`Total Marks`,ph:`e.g. 550`}],whatpct:[{label:`Percentage (%)`,ph:`e.g. 25`},{label:`Of Number`,ph:`e.g. 200`}],iswhat:[{label:`Number (X)`,ph:`e.g. 45`},{label:`Total (Y)`,ph:`e.g. 180`}],increase:[{label:`Original Value`,ph:`e.g. 500`},{label:`New Value`,ph:`e.g. 650`}],decrease:[{label:`Original Value`,ph:`e.g. 800`},{label:`New Value`,ph:`e.g. 600`}],addpct:[{label:`Percentage (%)`,ph:`e.g. 18`},{label:`Base Value`,ph:`e.g. 1000`}],subpct:[{label:`Percentage (%)`,ph:`e.g. 10`},{label:`Base Value`,ph:`e.g. 500`}]},g={marks:`455 ÷ 550 × 100 = 82.73%`,whatpct:`25% of 200 = 50`,iswhat:`45 out of 180 = 25%`,increase:`500 → 650 = 30% increase`,decrease:`800 → 600 = 25% decrease`,addpct:`1000 + 18% = 1180`,subpct:`500 − 10% = 450`};function _(e){return e>=90?{grade:`A+`,color:`#059669`,bg:`rgba(5,150,105,0.1)`}:e>=80?{grade:`A`,color:`#0284c7`,bg:`rgba(2,132,199,0.1)`}:e>=70?{grade:`B`,color:`#7c3aed`,bg:`rgba(124,58,237,0.1)`}:e>=60?{grade:`C`,color:`#d97706`,bg:`rgba(217,119,6,0.1)`}:e>=50?{grade:`D`,color:`#ea580c`,bg:`rgba(234,88,12,0.1)`}:{grade:`F`,color:`#dc2626`,bg:`rgba(220,38,38,0.1)`}}function v(){let[e,t]=(0,l.useState)(!1);return{copied:e,copy:function(){var e=r(function*(e){try{yield navigator.clipboard.writeText(e)}catch(t){let n=document.createElement(`textarea`);n.value=e,document.body.appendChild(n),n.select(),document.execCommand(`copy`),document.body.removeChild(n)}t(!0),setTimeout(()=>t(!1),2e3)});return function(t){return e.apply(this,arguments)}}()}}function y(){let[e,t]=(0,l.useState)(`marks`),[r,o]=(0,l.useState)([``,``]),{copied:d,copy:f}=v(),y=m(e,r),b=(e===`marks`||e===`iswhat`)&&y?_(parseFloat(y.value)):null,x=e=>{t(e),o([``,``])},S=y?`${y.value}${y.unit?` `+y.unit:``}`:``;return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(n,{children:[(0,u.jsx)(`title`,{children:`Percentage Calculator — Marks, Increase, Decrease & More | AIDLA`}),(0,u.jsx)(`meta`,{name:`description`,content:`Free percentage calculator — convert marks to percentage, find percentage increase or decrease, calculate X% of a number, add or subtract percentage. Fast, accurate, mobile-friendly.`}),(0,u.jsx)(`meta`,{name:`keywords`,content:`percentage calculator, marks to percentage, percentage increase calculator, percentage decrease, what percent of number, AIDLA percentage tool, Pakistan student calculator`}),(0,u.jsx)(`meta`,{name:`robots`,content:`index, follow`}),(0,u.jsx)(`meta`,{name:`viewport`,content:`width=device-width, initial-scale=1`}),(0,u.jsx)(`link`,{rel:`canonical`,href:`https://www.aidla.online/tools/education/percentage-calculator`}),(0,u.jsx)(`meta`,{property:`og:title`,content:`Percentage Calculator — Marks, Increase, Decrease & More | AIDLA`}),(0,u.jsx)(`meta`,{property:`og:description`,content:`Convert marks to percentage, calculate percentage increase or decrease, find X% of any number — all in one free tool.`}),(0,u.jsx)(`meta`,{property:`og:type`,content:`website`}),(0,u.jsx)(`meta`,{property:`og:url`,content:`https://www.aidla.online/tools/education/percentage-calculator`}),(0,u.jsx)(`meta`,{property:`og:image`,content:`https://www.aidla.online/og-home.jpg`}),(0,u.jsx)(`meta`,{property:`og:site_name`,content:`AIDLA`}),(0,u.jsx)(`meta`,{name:`twitter:card`,content:`summary_large_image`}),(0,u.jsx)(`meta`,{name:`twitter:title`,content:`Percentage Calculator | AIDLA`}),(0,u.jsx)(`meta`,{name:`twitter:description`,content:`Free percentage calculator — marks, increase, decrease, X% of Y and more.`}),(0,u.jsx)(`script`,{type:`application/ld+json`,children:JSON.stringify({"@context":`https://schema.org`,"@type":`WebApplication`,name:`Percentage Calculator by AIDLA`,url:`https://www.aidla.online/tools/education/percentage-calculator`,description:`Free percentage calculator for students — marks to percentage, increase, decrease and more.`,applicationCategory:`EducationApplication`,operatingSystem:`Web`,offers:{"@type":`Offer`,price:`0`,priceCurrency:`USD`},publisher:{"@type":`Organization`,name:`AIDLA`,url:`https://www.aidla.online`}})})]}),(0,u.jsx)(`style`,{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap');

        .pc-root *, .pc-root *::before, .pc-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pc-root {
          min-height: 100vh;
          background: linear-gradient(160deg,#f0f4ff 0%,#fffbf0 55%,#e8f4fd 100%);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }
        .pc-wrap {
          max-width: 580px;
          margin: 0 auto;
          padding: clamp(20px,5vw,48px) clamp(14px,4vw,24px) 60px;
          width: 100%;
        }

        /* ── Breadcrumb ── */
        .pc-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; color: #94a3b8;
          margin-bottom: 18px; flex-wrap: wrap;
        }
        .pc-breadcrumb a { color: #94a3b8; text-decoration: none; transition: color 0.13s; }
        .pc-breadcrumb a:hover { color: #1a3a8f; }
        .pc-breadcrumb span { color: #cbd5e1; }

        /* ── Hero ── */
        .pc-hero { text-align: center; margin-bottom: 28px; }
        .pc-hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg,#1a3a8f,#3b82f6);
          color: #fff; padding: 4px 14px; border-radius: 99px;
          font-size: 10px; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 12px;
          box-shadow: 0 4px 14px rgba(26,58,143,0.25);
        }
        .pc-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem,6vw,2.4rem);
          font-weight: 900; color: #0b1437; line-height: 1.15;
          margin-bottom: 8px;
        }
        .pc-hero-accent {
          background: linear-gradient(135deg,#ef4444,#f97316);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pc-hero p {
          font-size: clamp(13px,3vw,15px); color: #64748b;
          line-height: 1.65; max-width: 420px; margin: 0 auto;
        }

        /* ── Tab scroll row ── */
        .pc-tabs-wrap {
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none; margin-bottom: 16px;
          padding-bottom: 2px;
        }
        .pc-tabs-wrap::-webkit-scrollbar { display: none; }
        .pc-tabs {
          display: flex; gap: 6px;
          width: max-content; padding: 2px 1px;
        }
        .pc-tab {
          display: flex; align-items: center; gap: 5px;
          padding: 7px 13px; border-radius: 99px;
          border: 1.5px solid #e2e8f0; background: #fff;
          font-size: 12px; font-weight: 700; color: #64748b;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.15s; white-space: nowrap;
        }
        .pc-tab:hover { border-color: rgba(26,58,143,0.3); color: #1a3a8f; }
        .pc-tab.active {
          background: #0b1437; border-color: #0b1437;
          color: #fff; box-shadow: 0 4px 12px rgba(11,20,55,0.2);
        }

        /* ── Card ── */
        .pc-card {
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(59,130,246,0.1);
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(11,20,55,0.07);
          padding: clamp(18px,4vw,28px);
          margin-bottom: 14px;
        }

        /* ── Example pill ── */
        .pc-example {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(26,58,143,0.06); border: 1px solid rgba(26,58,143,0.12);
          border-radius: 8px; padding: 5px 10px;
          font-size: 11px; font-weight: 700; color: #1a3a8f;
          margin-bottom: 18px;
        }

        /* ── Fields ── */
        .pc-fields { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .pc-field-label {
          display: block; font-size: 11px; font-weight: 800;
          color: #64748b; text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 5px;
        }
        .pc-input {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          font-size: 16px; font-weight: 700; color: #0b1437;
          background: #fff; outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s;
          -webkit-appearance: none; appearance: none;
        }
        .pc-input:focus {
          border-color: rgba(26,58,143,0.4);
          box-shadow: 0 0 0 3px rgba(26,58,143,0.07);
        }
        .pc-input::placeholder { color: #94a3b8; font-weight: 500; font-size: 14px; }

        /* ── Result ── */
        .pc-result {
          background: linear-gradient(135deg,#0b1437,#1a3a8f);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          margin-top: 4px;
        }
        .pc-result-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
        .pc-result-eq { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
        .pc-result-value {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem,8vw,3rem);
          font-weight: 900; color: #fff; line-height: 1.1;
        }
        .pc-result-unit { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.7); margin-top: 4px; }
        .pc-result-actions { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
        .pc-copy-btn {
          padding: 7px 16px; background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2); border-radius: 99px;
          font-size: 11px; font-weight: 700; color: #fff;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.13s;
        }
        .pc-copy-btn:hover { background: rgba(255,255,255,0.2); }
        .pc-copy-btn.copied { background: rgba(5,150,105,0.3); border-color: rgba(5,150,105,0.5); }

        /* ── Grade badge ── */
        .pc-grade {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 14px; border-radius: 99px; margin-top: 10px;
          font-size: 13px; font-weight: 800;
        }

        /* ── Empty state ── */
        .pc-empty {
          text-align: center; padding: 28px 16px;
          color: #94a3b8; font-size: 13px; line-height: 1.6;
        }
        .pc-empty-icon { font-size: 32px; margin-bottom: 8px; }

        /* ── How it works ── */
        .pc-how { margin-bottom: 14px; }
        .pc-how-title {
          font-size: 11px; font-weight: 800; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
        }
        .pc-how-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 10px 0; border-bottom: 1px solid #f1f5f9;
        }
        .pc-how-item:last-child { border-bottom: none; padding-bottom: 0; }
        .pc-how-num {
          width: 24px; height: 24px; border-radius: 50%;
          background: #0b1437; color: #fff;
          font-size: 10px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }
        .pc-how-text { font-size: 13px; color: #475569; line-height: 1.55; }
        .pc-how-formula {
          display: inline-block; background: #f8faff;
          border: 1px solid rgba(26,58,143,0.12);
          border-radius: 6px; padding: 2px 8px;
          font-size: 12px; font-weight: 700; color: #1a3a8f;
          margin-top: 4px;
        }

        /* ── CTA ── */
        .pc-cta {
          background: linear-gradient(135deg,#0b1437,#1a3a8f);
          border-radius: 20px; padding: 22px 20px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 14px; flex-wrap: wrap;
          border: 1px solid rgba(245,158,11,0.15);
          box-shadow: 0 8px 24px rgba(11,20,55,0.15);
          margin-top: 28px;
        }
        .pc-cta h3 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1rem,4vw,1.3rem); font-weight: 900;
          color: #fff; margin-bottom: 3px;
        }
        .pc-cta p { font-size: 12px; color: rgba(255,255,255,0.6); }
        .pc-cta-btn {
          padding: 10px 22px;
          background: linear-gradient(135deg,#f59e0b,#fcd34d);
          color: #0b1437; border-radius: 99px; font-weight: 900;
          font-size: 13px; text-decoration: none;
          box-shadow: 0 4px 14px rgba(245,158,11,0.35);
          white-space: nowrap; flex-shrink: 0;
          display: inline-block;
        }
        @media (max-width: 420px) {
          .pc-cta { flex-direction: column; text-align: center; }
          .pc-cta-btn { width: 100%; text-align: center; }
        }

        .pc-root ::-webkit-scrollbar { width: 4px; }
        .pc-root ::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.2); border-radius: 99px; }
      `}),(0,u.jsxs)(`div`,{className:`pc-root`,children:[(0,u.jsxs)(`div`,{className:`pc-wrap`,children:[(0,u.jsxs)(`nav`,{className:`pc-breadcrumb`,"aria-label":`Breadcrumb`,children:[(0,u.jsx)(i,{to:`/tools`,children:`Tools`}),(0,u.jsx)(`span`,{children:`›`}),(0,u.jsx)(i,{to:`/tools`,children:`Education`}),(0,u.jsx)(`span`,{children:`›`}),(0,u.jsx)(`span`,{style:{color:`#475569`},children:`Percentage Calculator`})]}),(0,u.jsxs)(s.div,{className:`pc-hero`,initial:{opacity:0,y:14},animate:{opacity:1,y:0},transition:{duration:.4},children:[(0,u.jsxs)(`div`,{className:`pc-hero-badge`,children:[(0,u.jsx)(`span`,{children:`📊`}),` Education Tool`]}),(0,u.jsxs)(`h1`,{children:[(0,u.jsx)(`span`,{className:`pc-hero-accent`,children:`Percentage`}),` Calculator`]}),(0,u.jsx)(`p`,{children:`Marks to %, increase/decrease, add/subtract percentage — 7 calculators in one free tool.`})]}),(0,u.jsx)(s.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.35,delay:.08},children:(0,u.jsx)(`div`,{className:`pc-tabs-wrap`,role:`tablist`,"aria-label":`Percentage calculator types`,children:(0,u.jsx)(`div`,{className:`pc-tabs`,children:p.map(t=>(0,u.jsxs)(`button`,{role:`tab`,"aria-selected":e===t.id,className:`pc-tab${e===t.id?` active`:``}`,onClick:()=>x(t.id),children:[(0,u.jsx)(`span`,{"aria-hidden":`true`,children:t.icon}),(0,u.jsx)(`span`,{children:t.short})]},t.id))})})}),(0,u.jsx)(a,{mode:`wait`,children:(0,u.jsx)(s.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},exit:{opacity:0,y:-6},transition:{duration:.2},children:(0,u.jsxs)(`div`,{className:`pc-card`,children:[(0,u.jsxs)(`div`,{className:`pc-example`,children:[(0,u.jsx)(`span`,{"aria-hidden":`true`,children:`💡`}),`Example: `,g[e]]}),(0,u.jsx)(`div`,{className:`pc-fields`,children:h[e].map((e,t)=>(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`label`,{className:`pc-field-label`,htmlFor:`pc-field-${t}`,children:e.label}),(0,u.jsx)(`input`,{id:`pc-field-${t}`,className:`pc-input`,type:`number`,inputMode:`decimal`,placeholder:e.ph,value:r[t],onChange:e=>{let n=[...r];n[t]=e.target.value,o(n)},"aria-label":e.label})]},t))}),y?(0,u.jsxs)(s.div,{className:`pc-result`,initial:{opacity:0,scale:.97},animate:{opacity:1,scale:1},transition:{duration:.2},children:[(0,u.jsx)(`div`,{className:`pc-result-label`,children:`Result`}),(0,u.jsx)(`div`,{className:`pc-result-eq`,children:y.label}),(0,u.jsx)(`div`,{className:`pc-result-value`,children:y.value}),y.unit&&(0,u.jsx)(`div`,{className:`pc-result-unit`,children:y.unit}),b&&(0,u.jsxs)(`div`,{className:`pc-grade`,style:{background:b.bg,color:b.color,border:`1px solid ${b.color}30`},children:[(0,u.jsx)(`span`,{style:{fontSize:16},children:`🎓`}),`Grade: `,(0,u.jsx)(`strong`,{children:b.grade})]}),(0,u.jsx)(`div`,{className:`pc-result-actions`,children:(0,u.jsx)(`button`,{className:`pc-copy-btn${d?` copied`:``}`,onClick:()=>f(S),"aria-label":`Copy result`,children:d?`✅ Copied!`:`📋 Copy Result`})})]}):(0,u.jsxs)(`div`,{className:`pc-empty`,children:[(0,u.jsx)(`div`,{className:`pc-empty-icon`,"aria-hidden":`true`,children:`📊`}),`Enter both values above to see your result`]})]})},e)}),(0,u.jsx)(s.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.35,delay:.15},children:(0,u.jsxs)(`div`,{className:`pc-card pc-how`,children:[(0,u.jsx)(`div`,{className:`pc-how-title`,children:`📐 Formulas Used`}),(0,u.jsxs)(`div`,{className:`pc-how-item`,children:[(0,u.jsx)(`div`,{className:`pc-how-num`,children:`1`}),(0,u.jsxs)(`div`,{className:`pc-how-text`,children:[(0,u.jsx)(`strong`,{children:`Marks to Percentage`}),(0,u.jsx)(`br`,{}),(0,u.jsx)(`span`,{className:`pc-how-formula`,children:`(Obtained ÷ Total) × 100`})]})]}),(0,u.jsxs)(`div`,{className:`pc-how-item`,children:[(0,u.jsx)(`div`,{className:`pc-how-num`,children:`2`}),(0,u.jsxs)(`div`,{className:`pc-how-text`,children:[(0,u.jsx)(`strong`,{children:`X% of a Number`}),(0,u.jsx)(`br`,{}),(0,u.jsx)(`span`,{className:`pc-how-formula`,children:`(X ÷ 100) × Number`})]})]}),(0,u.jsxs)(`div`,{className:`pc-how-item`,children:[(0,u.jsx)(`div`,{className:`pc-how-num`,children:`3`}),(0,u.jsxs)(`div`,{className:`pc-how-text`,children:[(0,u.jsx)(`strong`,{children:`Percentage Increase / Decrease`}),(0,u.jsx)(`br`,{}),(0,u.jsx)(`span`,{className:`pc-how-formula`,children:`((New − Old) ÷ Old) × 100`})]})]}),(0,u.jsxs)(`div`,{className:`pc-how-item`,children:[(0,u.jsx)(`div`,{className:`pc-how-num`,children:`4`}),(0,u.jsxs)(`div`,{className:`pc-how-text`,children:[(0,u.jsx)(`strong`,{children:`Add / Subtract Percentage`}),(0,u.jsx)(`br`,{}),(0,u.jsx)(`span`,{className:`pc-how-formula`,children:`Value ± (Value × % ÷ 100)`})]})]})]})}),(0,u.jsx)(s.div,{initial:{opacity:0,y:14},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.38},children:(0,u.jsxs)(`div`,{className:`pc-cta`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`h3`,{children:`More Free Tools 🚀`}),(0,u.jsx)(`p`,{children:`CGPA Calculator, MDCAT Aggregate, Grade Calculator & 30+ more.`})]}),(0,u.jsx)(i,{to:`/tools`,className:`pc-cta-btn`,children:`Explore Tools ✨`})]})})]}),(0,u.jsx)(c,{})]})]})}export{y as default};