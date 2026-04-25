import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{a as t,l as n,o as r}from"./vendor-helmet-D-cMCI9i.js";import{tr as i}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as a}from"./supabase-CXCPPx9q.js";import{r as o}from"./vendor-motion-DyarDpDD.js";var s=e(n(),1),c=o();r();var l=[{value:`try_again_free`,label:`Try Again`},{value:`plus1_chance`,label:`+1 Chance`},{value:`gift`,label:`Gift`},{value:`coins`,label:`Coins`}],u=[`#1E3A8A`,`#3B82F6`,`#0EA5E9`,`#8B5CF6`],d=[{label:`Slice 1`,type:`try_again_free`,value:0},{label:`Slice 2`,type:`plus1_chance`,value:0},{label:`Slice 3`,type:`gift`,value:0},{label:`Slice 4`,type:`coins`,value:10}],f={try_again_free:999999,plus1_chance:999999,gift:999999,coins:5};function p(){let[e,n]=(0,s.useState)(!0),[r,o]=(0,s.useState)(!1),[p,h]=(0,s.useState)(``),[g,_]=(0,s.useState)(3),[v,y]=(0,s.useState)(`free`),[b,x]=(0,s.useState)(0),[S,C]=(0,s.useState)(d),[w,T]=(0,s.useState)(!1),[E,D]=(0,s.useState)(null),[O,k]=(0,s.useState)(f),A=(0,s.useMemo)(()=>S.map((e,n)=>{var r;return t(t({},e),{},{label:((r=e.label)==null?void 0:r.trim())||`Slice ${n+1}`,value:Number.isFinite(Number(e.value))?Number(e.value):0,type:l.some(t=>t.value===e.type)?e.type:`try_again_free`})}),[S]),j=(0,s.useMemo)(()=>{let e={};for(let t of l){let n=O==null?void 0:O[t.value],r=Number.isFinite(Number(n))?parseInt(n,10):0;e[t.value]=Math.max(0,r)}return e},[O]);(0,s.useEffect)(()=>{let e=!0;return i(function*(){var r,i,o,s;n(!0),h(``);let{data:c,error:l}=yield a.from(`luckywheel_settings`).select(`*`).eq(`id`,1).single();if(!e)return;if(l){h(`Error loading settings: ${l.message}`),n(!1);return}_((r=c.daily_limit)==null?3:r),y((i=c.entry_type)==null?`free`:i),x((o=c.entry_cost)==null?0:o);let u=Array.isArray(c.slices)?c.slices:null;C(u&&u.length===4?u:d),T(!!((s=c.forced_enabled)!=null&&s)),D(Number.isInteger(c.forced_slice_index)?c.forced_slice_index:null);let p=c.daily_caps&&typeof c.daily_caps==`object`?c.daily_caps:null;k(t(t({},f),p||{})),n(!1)})(),()=>{e=!1}},[]);let M=(e,n)=>{C(r=>{let i=[...r];return i[e]=t(t({},i[e]),n),i})},N=(e,n)=>{k(r=>t(t({},r),{},{[e]:n}))},P=function(){var e=i(function*(){o(!0),h(``);let e=Math.max(1,parseInt(g||1,10)),t=Math.max(0,parseInt(b||0,10)),n=A.map((e,t)=>({label:e.label||`Slice ${t+1}`,type:l.some(t=>t.value===e.type)?e.type:`try_again_free`,value:Math.max(0,parseInt(e.value||0,10))})),r=w&&Number.isInteger(Number(E))?Math.min(3,Math.max(0,parseInt(E,10))):null,{error:i}=yield a.from(`luckywheel_settings`).update({daily_limit:e,entry_type:v,entry_cost:v===`paid`?t:0,slices:n,forced_enabled:w,forced_slice_index:r,daily_caps:j,updated_at:new Date().toISOString()}).eq(`id`,1);i?h(`Save failed: ${i.message}`):(h(`Settings saved successfully! ✅`),setTimeout(()=>h(``),4e3)),o(!1)});return function(){return e.apply(this,arguments)}}();return(0,c.jsxs)(`div`,{className:`admin-lw-container`,children:[(0,c.jsx)(`style`,{children:m}),(0,c.jsxs)(`div`,{className:`admin-header-row`,children:[(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`h2`,{className:`admin-title`,children:`Lucky Wheel Settings`}),(0,c.jsx)(`p`,{className:`admin-subtitle`,children:`Configure entries, slices, quotas, and forced outcomes.`})]}),(0,c.jsxs)(`div`,{className:`admin-header-actions`,children:[p&&(0,c.jsx)(`span`,{className:`admin-msg ${p.includes(`failed`)?`error`:`success`}`,children:p}),(0,c.jsx)(`button`,{onClick:P,disabled:r||e,className:`admin-btn-primary`,children:r?`Saving...`:`Save Settings`})]})]}),e?(0,c.jsx)(`div`,{className:`admin-loader`,children:`Loading configuration...`}):(0,c.jsxs)(`div`,{className:`admin-grid-layout`,children:[(0,c.jsxs)(`div`,{className:`admin-col`,children:[(0,c.jsxs)(`div`,{className:`admin-card`,children:[(0,c.jsx)(`h3`,{className:`admin-card-title`,children:`General Entry Settings`}),(0,c.jsxs)(`div`,{className:`admin-form-grid`,children:[(0,c.jsxs)(`div`,{className:`admin-form-group`,children:[(0,c.jsx)(`label`,{children:`Daily Limit (per user)`}),(0,c.jsx)(`input`,{type:`number`,min:1,value:g,onChange:e=>_(e.target.value),className:`admin-input`})]}),(0,c.jsxs)(`div`,{className:`admin-form-group`,children:[(0,c.jsx)(`label`,{children:`Entry Type`}),(0,c.jsxs)(`select`,{value:v,onChange:e=>y(e.target.value),className:`admin-input`,children:[(0,c.jsx)(`option`,{value:`free`,children:`Free`}),(0,c.jsx)(`option`,{value:`paid`,children:`Paid`})]})]}),(0,c.jsxs)(`div`,{className:`admin-form-group`,children:[(0,c.jsx)(`label`,{children:`Entry Cost (Coins)`}),(0,c.jsx)(`input`,{type:`number`,min:0,value:b,onChange:e=>x(e.target.value),className:`admin-input`,disabled:v!==`paid`})]})]})]}),(0,c.jsxs)(`div`,{className:`admin-card`,children:[(0,c.jsx)(`h3`,{className:`admin-card-title`,children:`Wheel Slices (4 Required)`}),(0,c.jsx)(`div`,{className:`admin-slices-list`,children:S.map((e,t)=>{var n,r,i;return(0,c.jsxs)(`div`,{className:`admin-slice-row`,children:[(0,c.jsxs)(`div`,{className:`admin-slice-badge`,style:{backgroundColor:u[t]},children:[`#`,t+1]}),(0,c.jsxs)(`div`,{className:`admin-form-group`,children:[(0,c.jsx)(`label`,{children:`Label`}),(0,c.jsx)(`input`,{value:(n=e.label)==null?`Slice ${t+1}`:n,onChange:e=>M(t,{label:e.target.value}),className:`admin-input`,placeholder:`Slice ${t+1}`})]}),(0,c.jsxs)(`div`,{className:`admin-form-group`,children:[(0,c.jsx)(`label`,{children:`Outcome Type`}),(0,c.jsx)(`select`,{value:(r=e.type)==null?`try_again_free`:r,onChange:e=>M(t,{type:e.target.value}),className:`admin-input`,children:l.map(e=>(0,c.jsx)(`option`,{value:e.value,children:e.label},e.value))})]}),(0,c.jsxs)(`div`,{className:`admin-form-group`,children:[(0,c.jsxs)(`label`,{children:[`Value `,e.type===`coins`?`(Coins)`:``]}),(0,c.jsx)(`input`,{type:`number`,min:0,value:(i=e.value)==null?0:i,onChange:e=>M(t,{value:e.target.value}),className:`admin-input`,disabled:e.type!==`coins`&&e.type!==`gift`})]})]},t)})})]})]}),(0,c.jsxs)(`div`,{className:`admin-col`,children:[(0,c.jsxs)(`div`,{className:`admin-card preview-card`,children:[(0,c.jsx)(`h3`,{className:`admin-card-title`,children:`Live Preview`}),(0,c.jsxs)(`div`,{className:`preview-layout`,children:[(0,c.jsxs)(`div`,{className:`preview-wheel-container`,children:[(0,c.jsx)(`div`,{className:`mini-wheel`}),(0,c.jsx)(`div`,{className:`mini-wheel-center`}),(0,c.jsx)(`div`,{className:`mini-wheel-pointer`})]}),(0,c.jsxs)(`div`,{className:`preview-stats`,children:[(0,c.jsxs)(`div`,{className:`preview-stat-badge`,children:[(0,c.jsx)(`span`,{children:`Entry`}),(0,c.jsx)(`strong`,{children:v===`paid`?`${b} Coins`:`Free`})]}),(0,c.jsxs)(`div`,{className:`preview-stat-badge`,children:[(0,c.jsx)(`span`,{children:`Daily Limit`}),(0,c.jsxs)(`strong`,{children:[g,` Draws`]})]}),(0,c.jsxs)(`div`,{className:`preview-stat-badge`,children:[(0,c.jsx)(`span`,{children:`Forced Outcome`}),(0,c.jsx)(`strong`,{children:w&&E!==null?`Slice ${E+1}`:`Random`})]})]})]}),(0,c.jsx)(`div`,{className:`preview-slice-legend`,children:A.map((e,t)=>{var n;return(0,c.jsxs)(`div`,{className:`legend-item`,children:[(0,c.jsx)(`div`,{className:`legend-color`,style:{backgroundColor:u[t]}}),(0,c.jsx)(`span`,{className:`legend-label`,children:e.label}),(0,c.jsxs)(`span`,{className:`legend-desc`,children:[`(`,e.type===`coins`?`${e.value} Coins`:(n=l.find(t=>t.value===e.type))==null?void 0:n.label,`)`]})]},t)})})]}),(0,c.jsxs)(`div`,{className:`admin-card`,children:[(0,c.jsx)(`h3`,{className:`admin-card-title`,children:`Daily Win Quotas (Global Caps)`}),(0,c.jsx)(`p`,{className:`admin-help-text`,children:`Max unique users per day allowed to win each type. (999999 = unlimited)`}),(0,c.jsx)(`div`,{className:`admin-form-grid 2-col`,children:l.map(e=>{var t;return(0,c.jsxs)(`div`,{className:`admin-form-group`,children:[(0,c.jsxs)(`label`,{children:[e.label,` Cap`]}),(0,c.jsx)(`input`,{type:`number`,min:0,value:(t=O==null?void 0:O[e.value])==null?0:t,onChange:t=>N(e.value,t.target.value),className:`admin-input`})]},e.value)})})]}),(0,c.jsxs)(`div`,{className:`admin-card`,children:[(0,c.jsx)(`h3`,{className:`admin-card-title`,children:`Forced Outcome`}),(0,c.jsx)(`p`,{className:`admin-help-text`,children:`Rig the wheel to land on a specific slice (if quota permits).`}),(0,c.jsxs)(`div`,{className:`admin-form-grid 2-col`,children:[(0,c.jsxs)(`div`,{className:`admin-form-group`,children:[(0,c.jsx)(`label`,{children:`Status`}),(0,c.jsxs)(`select`,{value:w?`yes`:`no`,onChange:e=>T(e.target.value===`yes`),className:`admin-input`,children:[(0,c.jsx)(`option`,{value:`no`,children:`Disabled (Random)`}),(0,c.jsx)(`option`,{value:`yes`,children:`Enabled (Forced)`})]})]}),(0,c.jsxs)(`div`,{className:`admin-form-group`,children:[(0,c.jsx)(`label`,{children:`Target Slice`}),(0,c.jsxs)(`select`,{value:E===null?``:String(E),onChange:e=>D(e.target.value===``?null:parseInt(e.target.value,10)),className:`admin-input`,disabled:!w,children:[(0,c.jsx)(`option`,{value:``,children:`Select Target...`}),S.map((e,t)=>(0,c.jsxs)(`option`,{value:t,children:[`Slice `,t+1]},t))]})]})]})]})]})]})]})}var m=`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .admin-lw-container {
    font-family: 'Inter', system-ui, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #0f172a;
    animation: fadeIn 0.4s ease;
  }

  .admin-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
    gap: 16px;
    flex-wrap: wrap;
  }
  .admin-title { margin: 0 0 4px 0; font-size: 1.8rem; font-weight: 700; color: #1e293b; letter-spacing: -0.5px; }
  .admin-subtitle { margin: 0; color: #64748b; font-size: 0.95rem; }

  .admin-header-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  
  .admin-btn-primary {
    background: #3b82f6; color: #fff; border: none; padding: 10px 20px; border-radius: 8px;
    font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2);
  }
  .admin-btn-primary:hover:not(:disabled) { background: #2563eb; transform: translateY(-1px); }
  .admin-btn-primary:active:not(:disabled) { transform: translateY(1px); box-shadow: none; }
  .admin-btn-primary:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }

  .admin-msg { font-size: 0.85rem; font-weight: 600; padding: 6px 12px; border-radius: 6px; }
  .admin-msg.success { background: #dcfce7; color: #166534; }
  .admin-msg.error { background: #fee2e2; color: #991b1b; }

  .admin-loader { text-align: center; padding: 40px; color: #64748b; font-weight: 500; }

  /* GRID LAYOUT */
  .admin-grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
  .admin-col { display: flex; flex-direction: column; gap: 20px; }

  /* CARDS */
  .admin-card {
    background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 20px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  }
  .admin-card-title { margin: 0 0 16px 0; font-size: 1.1rem; font-weight: 600; color: #334155; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
  .admin-help-text { font-size: 0.8rem; color: #64748b; margin: -10px 0 14px 0; line-height: 1.4; }

  /* FORMS */
  .admin-form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; }
  .admin-form-grid.2-col { grid-template-columns: 1fr 1fr; }
  
  .admin-form-group { display: flex; flex-direction: column; gap: 6px; }
  .admin-form-group label { font-size: 0.8rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
  
  .admin-input {
    width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1;
    background: #f8fafc; font-family: inherit; font-size: 0.9rem; color: #0f172a;
    transition: all 0.2s; outline: none;
  }
  .admin-input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
  .admin-input:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; border-color: #e2e8f0; }

  /* SLICES LIST */
  .admin-slices-list { display: flex; flex-direction: column; gap: 12px; }
  .admin-slice-row {
    display: grid; grid-template-columns: auto 2fr 1.5fr 1fr; gap: 12px; align-items: end;
    background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #f1f5f9;
  }
  .admin-slice-badge {
    width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 700; font-size: 0.8rem; align-self: end; margin-bottom: 2px;
  }

  /* VISUAL PREVIEW WIDGET */
  .preview-card { background: linear-gradient(180deg, #ffffff, #f8fafc); }
  .preview-layout { display: flex; align-items: center; gap: 24px; margin-bottom: 20px; }
  
  .preview-wheel-container { position: relative; width: 100px; height: 100px; flex-shrink: 0; }
  .mini-wheel {
    width: 100%; height: 100%; border-radius: 50%;
    background: conic-gradient(#1E3A8A 0deg 90deg, #3B82F6 90deg 180deg, #0EA5E9 180deg 270deg, #8B5CF6 270deg 360deg);
    border: 4px solid #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .mini-wheel-center {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 24px; height: 24px; background: #fff; border-radius: 50%; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  }
  .mini-wheel-pointer {
    position: absolute; top: -6px; left: 50%; transform: translateX(-50%);
    width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 12px solid #ef4444;
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
  }

  .preview-stats { display: flex; flex-direction: column; gap: 10px; width: 100%; }
  .preview-stat-badge {
    display: flex; justify-content: space-between; align-items: center;
    background: #fff; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.85rem;
  }
  .preview-stat-badge span { color: #64748b; font-weight: 500; }
  .preview-stat-badge strong { color: #0f172a; font-weight: 700; }

  .preview-slice-legend { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #fff; padding: 12px; border-radius: 10px; border: 1px dashed #cbd5e1; }
  .legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; }
  .legend-color { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
  .legend-label { font-weight: 600; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .legend-desc { color: #94a3b8; font-size: 0.75rem; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

  /* RESPONSIVE OPTIMIZATION */
  @media (max-width: 900px) {
    .admin-grid-layout { grid-template-columns: 1fr; }
    .admin-card { padding: 16px; }
  }

  @media (max-width: 600px) {
    .admin-header-row { flex-direction: column; align-items: flex-start; gap: 12px; }
    .admin-slice-row { grid-template-columns: 1fr; gap: 10px; position: relative; padding-top: 36px; }
    .admin-slice-badge { position: absolute; top: 12px; left: 12px; margin: 0; width: auto; padding: 2px 8px; }
    .preview-layout { flex-direction: column; align-items: center; text-align: center; }
    .preview-stats { width: 100%; }
    .preview-slice-legend { grid-template-columns: 1fr; }
    .admin-form-grid.2-col { grid-template-columns: 1fr; }
  }
`;export{p as default};