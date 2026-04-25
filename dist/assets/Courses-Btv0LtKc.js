import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{a as t,l as n,o as r}from"./vendor-helmet-D-cMCI9i.js";import{tr as i}from"./vendor-misc-DjQaoctO.js";import{l as a}from"./vendor-router-BeHthcJc.js";import"./vendor-supabase-DTLzbyhy.js";import{t as o}from"./supabase-CXCPPx9q.js";import{r as s}from"./vendor-motion-DyarDpDD.js";var c=e(n(),1),l=s();r();var u={blue:`#0056D2`,blueDark:`#003A8C`,blueLight:`#EBF2FF`,blueMid:`#C7DCFF`,teal:`#00BFA5`,amber:`#F5A623`,red:`#E8453C`,ink:`#1A1A2E`,slate:`#475569`,muted:`#94A3B8`,border:`#E8EDF5`,bg:`#F7F9FC`,white:`#FFFFFF`,success:`#12B76A`,successBg:`#ECFDF3`},d={beginner:{label:`Beginner`,color:u.success,bg:u.successBg},intermediate:{label:`Intermediate`,color:u.amber,bg:`#FFF8EC`},advanced:{label:`Advanced`,color:u.red,bg:`#FEF2F1`},"all-levels":{label:`All Levels`,color:u.blue,bg:u.blueLight}},f=`
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ═══════════════════════════════════════════
   GLOBAL OVERFLOW LOCK — same pattern as
   VerifyCertificate / Certificate pages
═══════════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; max-width: 100%; }
html, body { overflow-x: hidden; width: 100%; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${u.bg}; color: ${u.ink}; }
button, input, select, textarea { font-family: 'Plus Jakarta Sans', sans-serif; }
a { text-decoration: none; color: inherit; }
img { display: block; max-width: 100%; }

@keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
@keyframes spin    { to { transform:rotate(360deg); } }
@keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
@keyframes checkIn { from { opacity:0; transform:scale(.7); } to { opacity:1; transform:scale(1); } }

.fade-up  { animation: fadeUp  .42s ease both; }
.slide-in { animation: slideIn .32s ease both; }

/* ── Shared button styles ── */
.btn-primary {
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  background:${u.blue}; color:#fff;
  border:none; border-radius:8px;
  padding:11px 20px; font-weight:700; font-size:14px; line-height:1;
  cursor:pointer; transition:background .15s, transform .1s;
  white-space:nowrap;
}
.btn-primary:hover  { background:${u.blueDark}; }
.btn-primary:active { transform:translateY(1px); }
.btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }

.btn-outline {
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  background:transparent; color:${u.blue};
  border:1.5px solid ${u.blue}; border-radius:8px;
  padding:10px 20px; font-weight:700; font-size:14px; line-height:1;
  cursor:pointer; transition:background .15s;
  white-space:nowrap;
}
.btn-outline:hover { background:${u.blueLight}; }

.btn-ghost {
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  background:transparent; color:${u.slate};
  border:1.5px solid ${u.border}; border-radius:8px;
  padding:9px 16px; font-weight:600; font-size:13px; line-height:1;
  cursor:pointer; transition:background .15s, border-color .15s;
  white-space:nowrap;
}
.btn-ghost:hover { background:${u.bg}; border-color:#C4CDD6; }

input:focus, select:focus {
  outline:none; border-color:${u.blue} !important;
  box-shadow:0 0 0 3px rgba(0,86,210,.12) !important;
}

/* ── Skeleton loader ── */
.skeleton {
  background:linear-gradient(90deg,#EEF1F6 25%,#E3E8EF 50%,#EEF1F6 75%);
  background-size:200% 100%;
  animation:shimmer 1.4s infinite;
  border-radius:10px;
}

/* ── Card hover lift ── */
.card-lift {
  transition:transform .2s ease, box-shadow .2s ease;
}
.card-lift:hover {
  transform:translateY(-3px);
  box-shadow:0 14px 36px rgba(0,86,210,.10) !important;
}

/* ══════════════════════════════════════════
   PAGE SHELL
══════════════════════════════════════════ */
.co-page {
  width:100%;
  overflow-x:hidden;
}

/* ── Sticky nav ── */
.co-nav {
  background:${u.white};
  border-bottom:1px solid ${u.border};
  position:sticky; top:0; z-index:200;
  width:100%; overflow:hidden;
}
.co-nav-inner {
  max-width:1200px; margin:0 auto;
  padding:0 16px; height:56px;
  display:flex; align-items:center; justify-content:space-between; gap:10px;
}
.co-nav-brand {
  font-family:'Instrument Serif',serif;
  font-style:italic; font-size:20px;
  color:${u.blue}; letter-spacing:-.3px;
  flex-shrink:0; white-space:nowrap;
}
.co-nav-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.co-nav-avatar {
  width:32px; height:32px; border-radius:50%;
  background:${u.blueLight};
  display:flex; align-items:center; justify-content:center;
  font-weight:700; font-size:12px; color:${u.blue};
  flex-shrink:0;
}
@media(min-width:480px) {
  .co-nav-inner { padding:0 24px; height:60px; }
  .co-nav-brand { font-size:22px; }
}

/* ── Hero ── */
.co-hero {
  background:linear-gradient(135deg,#EBF2FF 0%,#F0F7FF 50%,#EBF6FF 100%);
  border-bottom:1px solid ${u.border};
  padding:36px 16px 32px;
  overflow:hidden;
}
.co-hero-inner { max-width:1200px; margin:0 auto; }
.co-hero-eyebrow {
  font-size:10px; font-weight:700; letter-spacing:2px;
  text-transform:uppercase; color:${u.blue}; margin-bottom:10px;
}
.co-hero-h1 {
  font-family:'Instrument Serif',serif;
  font-weight:400; font-size:clamp(1.7rem,6vw,3.2rem);
  color:${u.ink}; line-height:1.15; margin-bottom:12px;
}
.co-hero-sub {
  font-size:clamp(13px,3.5vw,15px);
  color:${u.slate}; line-height:1.65; margin-bottom:22px;
  max-width:460px;
}
/* Search bar */
.co-search {
  display:flex; align-items:center; gap:10px;
  background:${u.white}; border:1.5px solid ${u.border};
  border-radius:10px; padding:10px 14px;
  max-width:520px;
  box-shadow:0 3px 12px rgba(0,86,210,.07);
  width:100%;
}
.co-search-icon { font-size:15px; color:${u.muted}; flex-shrink:0; }
.co-search input {
  flex:1; border:none; outline:none;
  font-size:14px; color:${u.ink}; background:transparent;
  min-width:0;
}
.co-search-clear {
  background:none; border:none; color:${u.muted};
  font-size:18px; line-height:1; cursor:pointer; flex-shrink:0;
}
@media(min-width:480px) {
  .co-hero { padding:48px 24px 44px; }
}

/* ── Main layout ── */
.co-main {
  max-width:1200px; margin:0 auto;
  padding:24px 16px 60px;
  overflow:hidden;
}
@media(min-width:480px) { .co-main { padding:32px 24px 72px; } }

/* ── Filter bar ── */
.co-filters {
  display:flex; gap:8px; align-items:center;
  overflow-x:auto;
  /* hide scrollbar but allow scroll on mobile */
  scrollbar-width:none; -ms-overflow-style:none;
  padding-bottom:4px; margin-bottom:24px;
}
.co-filters::-webkit-scrollbar { display:none; }
.co-filter-pill {
  padding:7px 16px; border-radius:100px;
  font-weight:600; font-size:12.5px; line-height:1;
  border:1.5px solid ${u.border}; background:${u.white};
  color:${u.slate}; cursor:pointer; transition:all .14s;
  flex-shrink:0; white-space:nowrap;
}
.co-filter-pill.active {
  background:${u.blue}; color:#fff; border-color:${u.blue};
  box-shadow:0 2px 8px rgba(0,86,210,.22);
}
.co-sort-select {
  margin-left:auto; flex-shrink:0;
  padding:7px 12px; border-radius:8px;
  border:1.5px solid ${u.border}; font-size:12.5px;
  font-weight:600; color:${u.slate}; cursor:pointer;
  background:${u.white}; white-space:nowrap;
}

/* ── Section title ── */
.co-section-h {
  font-family:'Instrument Serif',serif;
  font-weight:400; font-size:clamp(18px,4vw,22px);
  color:${u.ink}; margin-bottom:16px;
}

/* ── Course grid ── */
.co-grid {
  display:grid;
  grid-template-columns:1fr;
  gap:16px;
}
@media(min-width:500px) { .co-grid { grid-template-columns:repeat(2,1fr); } }
@media(min-width:900px) { .co-grid { grid-template-columns:repeat(3,1fr); } }
@media(min-width:1100px){ .co-grid { grid-template-columns:repeat(4,1fr); } }

/* ── Course card ── */
.co-card {
  background:${u.white}; border-radius:12px;
  border:1px solid ${u.border};
  box-shadow:0 2px 8px rgba(0,0,0,.04);
  display:flex; flex-direction:column;
  overflow:hidden;
}
.co-card-thumb {
  position:relative; height:0; padding-bottom:56.25%; /* 16:9 */
  background:${u.bg}; overflow:hidden; flex-shrink:0;
}
.co-card-thumb img {
  position:absolute; inset:0;
  width:100%; height:100%; object-fit:cover;
}
.co-card-level-badge {
  position:absolute; top:8px; left:8px;
  padding:3px 9px; border-radius:100px;
  font-size:10px; font-weight:700;
}
.co-card-price-badge {
  position:absolute; top:8px; right:8px;
  padding:3px 10px; border-radius:100px;
  font-size:11px; font-weight:800; color:#fff;
}
.co-card-complete-overlay {
  position:absolute; inset:0;
  background:rgba(18,183,106,.15);
  display:flex; align-items:center; justify-content:center;
}
.co-card-complete-badge {
  background:${u.success}; color:#fff;
  padding:5px 14px; border-radius:100px;
  font-weight:700; font-size:12px;
}
.co-card-body {
  padding:14px 14px 16px;
  display:flex; flex-direction:column; flex-grow:1;
}
.co-card-meta {
  font-size:10.5px; font-weight:600; color:${u.muted};
  text-transform:uppercase; letter-spacing:.7px; margin-bottom:5px;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.co-card-title {
  font-size:14px; font-weight:700; color:${u.ink};
  line-height:1.4; margin-bottom:7px; flex-grow:1;
  display:-webkit-box; -webkit-line-clamp:2;
  -webkit-box-orient:vertical; overflow:hidden;
}
.co-card-desc {
  font-size:12px; color:${u.slate}; line-height:1.6;
  margin-bottom:14px;
  display:-webkit-box; -webkit-line-clamp:2;
  -webkit-box-orient:vertical; overflow:hidden;
}
/* Progress */
.co-progress-label {
  display:flex; justify-content:space-between;
  font-size:10.5px; font-weight:700; margin-bottom:5px;
}
.co-progress-bar {
  background:${u.bg}; border-radius:100px;
  height:4px; overflow:hidden; margin-bottom:12px;
}
.co-progress-fill {
  height:100%; border-radius:100px;
  transition:width .4s ease;
}
/* CTA row */
.co-card-cta { display:flex; gap:7px; }
.co-card-cta .btn-primary,
.co-card-cta .btn-ghost { flex:1; font-size:12.5px; padding:9px 10px; border-radius:7px; }

/* ── Analytics dashboard ── */
.co-analytics-grid {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:10px;
  margin-bottom:32px;
}
@media(min-width:480px) { .co-analytics-grid { grid-template-columns:repeat(3,1fr); gap:12px; } }
@media(min-width:768px) { .co-analytics-grid { grid-template-columns:repeat(5,1fr); gap:14px; } }

.co-stat-card {
  background:${u.white}; border-radius:11px;
  border:1px solid ${u.border};
  box-shadow:0 1px 4px rgba(0,0,0,.04);
  padding:14px 12px;
}
.co-stat-icon  { font-size:22px; margin-bottom:8px; }
.co-stat-value { font-size:clamp(20px,5vw,26px); font-weight:800; line-height:1; }
.co-stat-label { font-size:10.5px; color:${u.muted}; font-weight:600; margin-top:5px; }

/* ── AI Recs ── */
.co-ai-cta {
  background:${u.white}; border:1.5px dashed ${u.blueMid};
  border-radius:14px; padding:18px 16px;
  display:flex; align-items:center; gap:14px;
  margin-bottom:32px; cursor:pointer; overflow:hidden;
  flex-wrap:wrap; gap:12px;
}
.co-ai-icon {
  width:44px; height:44px; border-radius:11px;
  background:${u.blueLight};
  display:flex; align-items:center; justify-content:center;
  font-size:22px; flex-shrink:0;
}
.co-ai-text { flex:1; min-width:0; }
.co-ai-title { font-weight:700; font-size:14px; color:${u.ink}; margin-bottom:3px; }
.co-ai-sub   { font-size:12px; color:${u.muted}; line-height:1.5; }
.co-ai-recs-grid {
  display:grid; grid-template-columns:1fr; gap:12px;
  margin-bottom:32px;
}
@media(min-width:480px){ .co-ai-recs-grid { grid-template-columns:repeat(2,1fr); } }
@media(min-width:768px){ .co-ai-recs-grid { grid-template-columns:repeat(3,1fr); } }
.co-ai-rec-card {
  background:${u.blueLight}; border-radius:12px;
  padding:16px; border:1px solid ${u.blueMid};
}
.co-ai-rec-level {
  font-size:10px; font-weight:700; text-transform:uppercase;
  letter-spacing:.6px; color:${u.blue}; margin-bottom:6px;
}
.co-ai-rec-title { font-weight:700; font-size:14px; color:${u.ink}; line-height:1.35; margin-bottom:6px; }
.co-ai-rec-reason { font-size:11.5px; color:${u.slate}; line-height:1.55; margin-bottom:14px; }

/* ── Leaderboard ── */
.co-lb-panel {
  background:${u.white}; border-radius:14px;
  border:1px solid ${u.border};
  padding:18px 16px;
  box-shadow:0 1px 4px rgba(0,0,0,.04);
  margin-bottom:24px;
}
/* On desktop, shown in sidebar. On mobile, shown inline full-width */
.co-layout {
  display:grid; grid-template-columns:1fr; gap:24px;
}
@media(min-width:900px) {
  .co-layout.with-lb { grid-template-columns:1fr 240px; align-items:start; }
}
.co-lb-sticky { position:static; }
@media(min-width:900px) {
  .co-lb-sticky { position:sticky; top:72px; }
}
.co-lb-header {
  display:flex; align-items:center; gap:8px; margin-bottom:16px;
}
.co-lb-row {
  display:flex; align-items:center; gap:10px;
  padding:9px 0;
  border-bottom:1px solid ${u.border};
}
.co-lb-row:last-child { border-bottom:none; }
.co-lb-medal { font-size:16px; width:24px; flex-shrink:0; }
.co-lb-bar-wrap {
  flex:1; background:${u.bg}; border-radius:100px;
  height:4px; overflow:hidden; min-width:0;
}
.co-lb-pct {
  font-size:11px; font-weight:800;
  flex-shrink:0;
}

/* ── Empty state ── */
.co-empty {
  text-align:center; padding:64px 20px;
}
.co-empty-icon { font-size:48px; margin-bottom:14px; }
.co-empty-h { font-family:'Instrument Serif',serif; font-weight:400; font-size:20px; color:${u.ink}; }
.co-empty-p { color:${u.muted}; margin-top:7px; font-size:13px; }

/* ── Toast ── */
.co-toast {
  position:fixed; top:16px; right:16px; left:16px;
  z-index:9999; padding:12px 18px;
  border-radius:10px; font-weight:700; font-size:13.5px; color:#fff;
  box-shadow:0 8px 24px rgba(0,0,0,.18);
  animation:slideIn .3s ease both;
  text-align:center;
}
@media(min-width:480px) {
  .co-toast { left:auto; max-width:360px; text-align:left; }
}
`;function p({enrollments:e,certificates:t}){let n=Object.keys(e).length;if(n===0)return null;let r=Object.values(e).filter(e=>e.progress_percent===100).length,i=Object.keys(t).length,a=Math.round(Object.values(e).reduce((e,t)=>e+(t.progress_percent||0),0)/n),o=Object.values(e).reduce((e,t)=>e+Math.round((t.progress_percent||0)*.5),0),s=[{label:`Enrolled`,value:n,icon:`📚`,accent:u.blue},{label:`Completed`,value:r,icon:`🎓`,accent:u.success},{label:`Certificates`,value:i,icon:`🏆`,accent:u.amber},{label:`Avg Progress`,value:`${a}%`,icon:`📈`,accent:u.teal},{label:`Est. Hours`,value:`${o}h`,icon:`⏱`,accent:`#8B5CF6`}];return(0,l.jsxs)(`section`,{style:{marginBottom:28},className:`fade-up`,children:[(0,l.jsx)(`h2`,{className:`co-section-h`,children:`Your Learning Summary`}),(0,l.jsx)(`div`,{className:`co-analytics-grid`,children:s.map((e,t)=>(0,l.jsxs)(`div`,{className:`co-stat-card fade-up`,style:{animationDelay:`${t*55}ms`},children:[(0,l.jsx)(`div`,{className:`co-stat-icon`,children:e.icon}),(0,l.jsx)(`div`,{className:`co-stat-value`,style:{color:e.accent},children:e.value}),(0,l.jsx)(`div`,{className:`co-stat-label`,children:e.label})]},e.label))})]})}function m({enrollments:e}){let t=[...e].filter(e=>(e.progress_percent||0)>0).sort((e,t)=>(t.progress_percent||0)-(e.progress_percent||0)).slice(0,8),n=[`🥇`,`🥈`,`🥉`];return(0,l.jsxs)(`div`,{className:`co-lb-panel`,children:[(0,l.jsxs)(`div`,{className:`co-lb-header`,children:[(0,l.jsx)(`span`,{style:{fontSize:18},children:`🏆`}),(0,l.jsx)(`h3`,{style:{fontFamily:`'Instrument Serif',serif`,fontWeight:400,fontSize:17,color:u.ink},children:`Leaderboard`})]}),t.length===0?(0,l.jsx)(`p`,{style:{color:u.muted,fontSize:12.5},children:`Start learning to appear here!`}):t.map((e,t)=>(0,l.jsxs)(`div`,{className:`co-lb-row`,children:[(0,l.jsx)(`span`,{className:`co-lb-medal`,children:n[t]||`#${t+1}`}),(0,l.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,l.jsx)(`div`,{style:{fontSize:11.5,fontWeight:600,color:u.ink,marginBottom:4,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:e.user_name||`Learner ${String(e.user_id).slice(0,4)}…`}),(0,l.jsx)(`div`,{className:`co-lb-bar-wrap`,children:(0,l.jsx)(`div`,{style:{width:`${e.progress_percent||0}%`,height:`100%`,borderRadius:100,background:t===0?u.amber:t===1?`#94A3B8`:t===2?`#C87533`:u.blue,transition:`width .4s`}})})]}),(0,l.jsxs)(`span`,{className:`co-lb-pct`,style:{color:e.progress_percent===100?u.success:u.blue},children:[e.progress_percent||0,`%`]})]},t))]})}function h({courses:e,enrollments:n}){let[r,a]=(0,c.useState)(null),[o,s]=(0,c.useState)(!1),f=function(){var r=i(function*(){s(!0);let r=Object.keys(n),i=e.filter(e=>!r.includes(e.id)),o=e.filter(e=>r.includes(e.id)).map(e=>e.title).join(`, `);try{var c;let e=yield(yield fetch(`https://api.anthropic.com/v1/messages`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({model:`claude-sonnet-4-20250514`,max_tokens:600,messages:[{role:`user`,content:`You are a learning advisor. Student is enrolled in: ${o||`nothing yet`}.
Available (id|||title|||level): ${i.map(e=>`${e.id}|||${e.title}|||${e.level}`).join(`
`)||`none`}
Pick top 3. Reply ONLY raw JSON array: [{"id":"...","reason":"one sentence"}]`}]})})).json();a(JSON.parse((((c=e.content)==null||(c=c[0])==null?void 0:c.text)||`[]`).replace(/```json|```/g,``).trim()).map(e=>t(t({},i.find(t=>t.id===e.id)),{},{reason:e.reason})).filter(Boolean).slice(0,3))}catch(e){a(i.slice(0,3).map(e=>t(t({},e),{},{reason:`Highly rated by learners at your level.`})))}s(!1)});return function(){return r.apply(this,arguments)}}();return r===null?(0,l.jsxs)(`div`,{className:`co-ai-cta`,onClick:f,children:[(0,l.jsx)(`div`,{className:`co-ai-icon`,children:`✨`}),(0,l.jsxs)(`div`,{className:`co-ai-text`,children:[(0,l.jsx)(`div`,{className:`co-ai-title`,children:`Get AI-Powered Recommendations`}),(0,l.jsx)(`div`,{className:`co-ai-sub`,children:`Claude analyses your history and suggests what to study next`})]}),(0,l.jsx)(`button`,{className:`btn-primary`,style:{fontSize:13,padding:`9px 16px`},children:`Recommend for me`})]}):(0,l.jsxs)(`section`,{style:{marginBottom:28},className:`fade-up`,children:[(0,l.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,marginBottom:14,flexWrap:`wrap`,gap:8},children:[(0,l.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:9},children:[(0,l.jsx)(`div`,{className:`co-ai-icon`,style:{width:30,height:30,borderRadius:8,fontSize:14},children:`✨`}),(0,l.jsx)(`h2`,{className:`co-section-h`,style:{margin:0},children:`Recommended For You`})]}),(0,l.jsx)(`button`,{className:`btn-ghost`,style:{fontSize:12},onClick:()=>a(null),children:`Dismiss`})]}),o?(0,l.jsx)(`div`,{className:`co-ai-recs-grid`,children:[1,2,3].map(e=>(0,l.jsx)(`div`,{className:`skeleton`,style:{height:130}},e))}):r.length===0?(0,l.jsx)(`div`,{style:{background:u.successBg,border:`1px solid #A7F3D0`,borderRadius:10,padding:`14px 18px`,color:`#065F46`,fontWeight:600,fontSize:13},children:`🎉 You're enrolled in all available courses!`}):(0,l.jsx)(`div`,{className:`co-ai-recs-grid`,children:r.map((e,t)=>e&&(0,l.jsxs)(`div`,{className:`co-ai-rec-card fade-up`,style:{animationDelay:`${t*80}ms`},children:[(0,l.jsx)(`div`,{className:`co-ai-rec-level`,children:(d[e.level]||d.beginner).label}),(0,l.jsx)(`div`,{className:`co-ai-rec-title`,children:e.title}),(0,l.jsxs)(`div`,{className:`co-ai-rec-reason`,children:[`✨ `,e.reason]}),(0,l.jsx)(`button`,{className:`btn-primary`,style:{fontSize:12,padding:`7px 14px`,width:`100%`},children:e.price===0?`Enroll Free`:`Enroll · $${Number(e.price).toFixed(2)}`})]},e.id))})]})}function g({course:e,enroll:t,cert:n,onEnroll:r,navigate:i}){let a=d[e.level]||d.beginner,o=(t==null?void 0:t.progress_percent)||0,s=o===100;return(0,l.jsxs)(`div`,{className:`co-card card-lift`,children:[(0,l.jsxs)(`div`,{className:`co-card-thumb`,children:[(0,l.jsx)(`img`,{src:e.thumbnail_url||`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80`,alt:e.title,onError:e=>{e.target.src=`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80`}}),(0,l.jsx)(`span`,{className:`co-card-level-badge`,style:{background:a.bg,color:a.color},children:a.label}),!t&&(0,l.jsx)(`span`,{className:`co-card-price-badge`,style:{background:e.price===0?u.success:u.ink},children:e.price===0?`FREE`:`$${Number(e.price).toFixed(0)}`}),s&&(0,l.jsx)(`div`,{className:`co-card-complete-overlay`,children:(0,l.jsx)(`span`,{className:`co-card-complete-badge`,children:`✓ Completed`})})]}),(0,l.jsxs)(`div`,{className:`co-card-body`,children:[(0,l.jsxs)(`div`,{className:`co-card-meta`,children:[e.category||`General`,e.duration_estimate?` · ${e.duration_estimate}`:``]}),(0,l.jsx)(`h3`,{className:`co-card-title`,children:e.title}),(0,l.jsx)(`p`,{className:`co-card-desc`,children:e.description}),t&&(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)(`div`,{className:`co-progress-label`,children:[(0,l.jsx)(`span`,{style:{color:u.muted},children:`Progress`}),(0,l.jsxs)(`span`,{style:{color:s?u.success:u.blue},children:[o,`%`]})]}),(0,l.jsx)(`div`,{className:`co-progress-bar`,children:(0,l.jsx)(`div`,{className:`co-progress-fill`,style:{width:`${o}%`,background:s?u.success:u.blue}})})]}),(0,l.jsx)(`div`,{className:`co-card-cta`,children:t?s?(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(`button`,{className:`btn-ghost`,onClick:()=>i(`/user/course/${e.id}`),children:`Review`}),n?(0,l.jsx)(`button`,{className:`btn-primary`,style:{background:u.amber},onClick:()=>i(`/user/certificate/${n.id}`),children:`🏆 Cert`}):e.certificate_price>0?(0,l.jsx)(`button`,{className:`btn-primary`,onClick:()=>r(e,!0),children:`Get Cert`}):null]}):(0,l.jsx)(`button`,{className:`btn-primary`,style:{flex:1},onClick:()=>i(`/user/course/${e.id}`),children:o>0?`▶ Continue`:`▶ Start`}):(0,l.jsx)(`button`,{className:`btn-primary`,style:{flex:1},onClick:()=>r(e),children:e.price===0?`Enroll Free`:`Buy · $${Number(e.price).toFixed(2)}`})})]})]})}function _({toast:e}){return e?(0,l.jsx)(`div`,{className:`co-toast`,style:{background:e.type===`error`?u.red:u.success},children:e.msg}):null}function v(){let e=a(),[t,n]=(0,c.useState)(null),[r,s]=(0,c.useState)([]),[v,y]=(0,c.useState)({}),[b,x]=(0,c.useState)({}),[S,C]=(0,c.useState)([]),[w,T]=(0,c.useState)(!0),[E,D]=(0,c.useState)(`all`),[O,k]=(0,c.useState)(`newest`),[A,j]=(0,c.useState)(``),[M,N]=(0,c.useState)(null),[P,F]=(0,c.useState)(!1),I=(e,t=`success`)=>{N({msg:e,type:t}),setTimeout(()=>N(null),4e3)};(0,c.useEffect)(()=>{o.auth.getUser().then(({data:e})=>n(e.user)),L(),B()},[]),(0,c.useEffect)(()=>{t&&(R(),z())},[t]);let L=function(){var e=i(function*(){T(!0);let{data:e}=yield o.from(`course_courses`).select(`*`).eq(`status`,`published`).order(`created_at`,{ascending:!1});s(e||[]),T(!1)});return function(){return e.apply(this,arguments)}}(),R=function(){var e=i(function*(){let{data:e}=yield o.from(`course_enrollments`).select(`*`).eq(`user_id`,t.id),n={};e==null||e.forEach(e=>n[e.course_id]=e),y(n)});return function(){return e.apply(this,arguments)}}(),z=function(){var e=i(function*(){let{data:e}=yield o.from(`course_certificates`).select(`*`).eq(`user_id`,t.id),n={};e==null||e.forEach(e=>n[e.course_id]=e),x(n)});return function(){return e.apply(this,arguments)}}(),B=function(){var e=i(function*(){let{data:e}=yield o.from(`course_enrollments`).select(`user_id,progress_percent,course_id`).gt(`progress_percent`,0).order(`progress_percent`,{ascending:!1}).limit(20);C(e||[])});return function(){return e.apply(this,arguments)}}(),V=function(){var n=i(function*(n){if(!t){e(`/login`);return}if(v[n.id]){e(`/user/course/${n.id}`);return}let{error:r}=yield o.from(`course_enrollments`).insert({user_id:t.id,course_id:n.id,has_paid_course:n.price>0,has_paid_certificate:!1});r?I(r.message,`error`):(I(`Enrolled in "${n.title}"! 🎉`),R(),B())});return function(e){return n.apply(this,arguments)}}(),H=r.filter(e=>E===`all`||e.level===E).filter(e=>!A||[e.title,e.description,e.category].some(e=>e==null?void 0:e.toLowerCase().includes(A.toLowerCase()))).sort((e,t)=>O===`newest`?new Date(t.created_at)-new Date(e.created_at):O===`price-asc`?(e.price||0)-(t.price||0):O===`price-desc`?(t.price||0)-(e.price||0):0),U=H.filter(e=>v[e.id]),W=H.filter(e=>!v[e.id]);return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(`style`,{children:f}),(0,l.jsx)(_,{toast:M}),(0,l.jsxs)(`div`,{className:`co-page`,children:[(0,l.jsx)(`nav`,{className:`co-nav`,children:(0,l.jsxs)(`div`,{className:`co-nav-inner`,children:[(0,l.jsx)(`span`,{className:`co-nav-brand`,children:`LearnHub`}),(0,l.jsxs)(`div`,{className:`co-nav-right`,children:[(0,l.jsxs)(`button`,{className:`btn-ghost`,style:{fontSize:12,padding:`7px 12px`},onClick:()=>F(e=>!e),children:[`🏆 `,(0,l.jsx)(`span`,{style:{display:`none`},className:`lb-label`,children:`Leaderboard`})]}),(0,l.jsx)(`style`,{children:`@media(min-width:400px){.lb-label{display:inline !important}}`}),t&&(0,l.jsx)(`div`,{className:`co-nav-avatar`,children:(t.email||`?`)[0].toUpperCase()})]})]})}),(0,l.jsx)(`div`,{className:`co-hero`,children:(0,l.jsxs)(`div`,{className:`co-hero-inner`,children:[(0,l.jsx)(`p`,{className:`co-hero-eyebrow`,children:`Online Learning Platform`}),(0,l.jsxs)(`h1`,{className:`co-hero-h1`,children:[`Learn Without Limits.`,(0,l.jsx)(`br`,{}),(0,l.jsx)(`em`,{style:{color:u.blue},children:`Grow Every Day.`})]}),(0,l.jsx)(`p`,{className:`co-hero-sub`,children:`Expert-led courses, live quizzes, and verified certificates — beautifully simple.`}),(0,l.jsxs)(`div`,{className:`co-search`,children:[(0,l.jsx)(`span`,{className:`co-search-icon`,children:`🔍`}),(0,l.jsx)(`input`,{placeholder:`Search courses, topics, skills…`,value:A,onChange:e=>j(e.target.value)}),A&&(0,l.jsx)(`button`,{className:`co-search-clear`,onClick:()=>j(``),children:`×`})]})]})}),(0,l.jsx)(`div`,{className:`co-main`,children:(0,l.jsxs)(`div`,{className:`co-layout${P?` with-lb`:``}`,children:[(0,l.jsxs)(`div`,{style:{minWidth:0},children:[P&&(0,l.jsxs)(`div`,{className:`fade-up`,style:{marginBottom:24,display:`block`},children:[(0,l.jsx)(`style`,{children:`@media(min-width:900px){.co-lb-mobile{display:none!important}}`}),(0,l.jsx)(`div`,{className:`co-lb-mobile`,children:(0,l.jsx)(m,{enrollments:S})})]}),(0,l.jsx)(p,{enrollments:v,certificates:b}),t&&(0,l.jsx)(h,{courses:r,enrollments:v}),(0,l.jsx)(`div`,{style:{marginBottom:24},children:(0,l.jsxs)(`div`,{className:`co-filters`,children:[[`all`,`beginner`,`intermediate`,`advanced`,`all-levels`].map(e=>{var t;return(0,l.jsx)(`button`,{className:`co-filter-pill${E===e?` active`:``}`,onClick:()=>D(e),children:e===`all`?`All Courses`:((t=d[e])==null?void 0:t.label)||e},e)}),(0,l.jsxs)(`select`,{className:`co-sort-select`,value:O,onChange:e=>k(e.target.value),children:[(0,l.jsx)(`option`,{value:`newest`,children:`Newest`}),(0,l.jsx)(`option`,{value:`price-asc`,children:`Price ↑`}),(0,l.jsx)(`option`,{value:`price-desc`,children:`Price ↓`})]})]})}),w?(0,l.jsx)(`div`,{className:`co-grid`,children:[1,2,3,4,5,6].map(e=>(0,l.jsx)(`div`,{className:`skeleton`,style:{height:300}},e))}):(0,l.jsxs)(l.Fragment,{children:[U.length>0&&(0,l.jsxs)(`section`,{style:{marginBottom:36},children:[(0,l.jsx)(`h2`,{className:`co-section-h`,children:`My Learning`}),(0,l.jsx)(`div`,{className:`co-grid`,children:U.map(t=>(0,l.jsx)(g,{course:t,enroll:v[t.id],cert:b[t.id],onEnroll:V,navigate:e},t.id))})]}),W.length>0&&(0,l.jsxs)(`section`,{children:[(0,l.jsx)(`h2`,{className:`co-section-h`,children:U.length>0?`Explore More`:`All Courses`}),(0,l.jsx)(`div`,{className:`co-grid`,children:W.map(t=>(0,l.jsx)(g,{course:t,enroll:v[t.id],cert:b[t.id],onEnroll:V,navigate:e},t.id))})]}),H.length===0&&(0,l.jsxs)(`div`,{className:`co-empty`,children:[(0,l.jsx)(`div`,{className:`co-empty-icon`,children:`🔍`}),(0,l.jsx)(`h3`,{className:`co-empty-h`,children:`No courses found`}),(0,l.jsx)(`p`,{className:`co-empty-p`,children:`Try a different keyword or filter`})]})]})]}),P&&(0,l.jsxs)(`aside`,{className:`co-lb-sticky`,style:{minWidth:0},children:[(0,l.jsx)(`style`,{children:`.co-lb-desktop{display:none}@media(min-width:900px){.co-lb-desktop{display:block}}`}),(0,l.jsx)(`div`,{className:`co-lb-desktop`,children:(0,l.jsx)(m,{enrollments:S})})]})]})})]})]})}export{v as default};