import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t,n}from"./vendor-helmet-D-cMCI9i.js";import{tr as r}from"./vendor-misc-DjQaoctO.js";import{l as i,n as a}from"./vendor-router-BeHthcJc.js";import"./vendor-supabase-DTLzbyhy.js";import{t as o}from"./supabase-CXCPPx9q.js";import{r as s}from"./vendor-motion-DyarDpDD.js";import{n as c}from"./index-CPLV-0JN.js";var l=e(t(),1),u=s();function d(e=``){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/(^-|-$)/g,``)}var f={beginner:{label:`Beginner`,color:`#059669`,bg:`#ECFDF5`},intermediate:{label:`Intermediate`,color:`#D97706`,bg:`#FFFBEB`},advanced:{label:`Advanced`,color:`#DC2626`,bg:`#FEF2F2`},"all-levels":{label:`All Levels`,color:`#1a3a8f`,bg:`#EBF2FF`}},p=[{key:`all`,label:`All Courses`},{key:`beginner`,label:`Beginner`},{key:`intermediate`,label:`Intermediate`},{key:`advanced`,label:`Advanced`},{key:`all-levels`,label:`All Levels`}],m=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { overflow-x: hidden; width: 100%; }

.pc-root {
  min-height: 100vh;
  background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 55%, #e8f4fd 100%);
  font-family: 'DM Sans', sans-serif;
  color: #0b1437;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
}

/* ── Orbs ── */
.pc-orb1, .pc-orb2, .pc-orb3 {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
}
.pc-orb1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%);
  top: -200px; left: -200px;
}
.pc-orb2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%);
  top: 40%; right: -180px;
}
.pc-orb3 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%);
  bottom: 10%; left: 20%;
}

/* ── Nav ── */
.pc-nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(59,130,246,0.1);
  width: 100%;
}
.pc-nav-inner {
  max-width: 1200px; margin: 0 auto;
  padding: 0 clamp(16px,4vw,32px);
  height: 60px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.pc-nav-brand {
  font-family: 'Playfair Display', serif;
  font-style: italic; font-size: clamp(1.1rem,3vw,1.4rem);
  color: #1a3a8f; letter-spacing: -0.3px; text-decoration: none;
  flex-shrink: 0;
}
.pc-nav-actions { display: flex; gap: 10px; align-items: center; }
.pc-nav-link {
  font-size: 0.83rem; font-weight: 600; color: #475569;
  text-decoration: none; padding: 7px 14px; border-radius: 30px;
  transition: background 0.18s, color 0.18s;
}
.pc-nav-link:hover { background: rgba(26,58,143,0.06); color: #1a3a8f; }
.pc-nav-btn {
  font-size: 0.83rem; font-weight: 700;
  padding: 8px 20px; border-radius: 30px; border: none; cursor: pointer;
  background: linear-gradient(135deg, #1a3a8f, #3b82f6);
  color: #fff;
  box-shadow: 0 3px 12px rgba(26,58,143,0.25);
  transition: transform 0.18s, box-shadow 0.18s;
  text-decoration: none; display: inline-flex; align-items: center;
}
.pc-nav-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(26,58,143,0.3); }

/* ── Hero ── */
.pc-hero {
  position: relative; z-index: 1;
  padding: clamp(48px,8vw,96px) clamp(16px,4vw,32px) clamp(40px,6vw,72px);
  text-align: center;
  overflow: hidden;
}
.pc-hero-inner { max-width: 700px; margin: 0 auto; }
.pc-hero-badge {
  display: inline-block;
  background: linear-gradient(135deg, #f59e0b, #fcd34d);
  color: #0b1437; padding: 5px 16px; border-radius: 30px;
  font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em;
  text-transform: uppercase; margin-bottom: 18px;
  box-shadow: 0 4px 14px rgba(245,158,11,0.28);
}
.pc-hero-h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 6vw, 3.6rem);
  font-weight: 900; line-height: 1.1; margin-bottom: 16px; color: #0b1437;
}
.pc-hero-h1 em { font-style: italic; color: #1a3a8f; }
.pc-hero-sub {
  font-size: clamp(0.9rem, 2.5vw, 1.05rem);
  color: #64748b; line-height: 1.65; margin-bottom: 32px; max-width: 540px; margin-left: auto; margin-right: auto;
}

/* ── Search ── */
.pc-search-wrap {
  max-width: 520px; margin: 0 auto 12px;
  display: flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,0.95);
  border: 1.5px solid rgba(59,130,246,0.15);
  border-radius: 50px; padding: 10px 18px;
  box-shadow: 0 4px 24px rgba(26,58,143,0.1);
  backdrop-filter: blur(8px);
}
.pc-search-icon { color: #94a3b8; font-size: 16px; flex-shrink: 0; }
.pc-search-wrap input {
  flex: 1; border: none; outline: none; background: transparent;
  font-family: 'DM Sans', sans-serif; font-size: 0.92rem; color: #0b1437; min-width: 0;
}
.pc-search-wrap input::placeholder { color: #94a3b8; }
.pc-search-clear {
  background: none; border: none; color: #94a3b8; font-size: 20px;
  cursor: pointer; line-height: 1; padding: 0; flex-shrink: 0;
}

/* ── Stats bar ── */
.pc-stats {
  display: flex; align-items: center; justify-content: center; gap: 24px;
  flex-wrap: wrap; margin-top: 28px;
}
.pc-stat { text-align: center; }
.pc-stat-val {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.4rem,4vw,2rem); font-weight: 700; color: #1a3a8f; line-height: 1;
}
.pc-stat-lbl { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; margin-top: 3px; }
.pc-stat-div { width: 1px; height: 36px; background: rgba(59,130,246,0.15); }

/* ── Main ── */
.pc-main {
  position: relative; z-index: 1;
  max-width: 1200px; margin: 0 auto; width: 100%;
  padding: 0 clamp(16px,4vw,32px) clamp(48px,8vw,80px);
  flex: 1;
}

/* ── Filter bar ── */
.pc-filters {
  display: flex; gap: 8px; align-items: center;
  overflow-x: auto; padding-bottom: 4px; margin-bottom: 32px;
  scrollbar-width: none; -ms-overflow-style: none;
}
.pc-filters::-webkit-scrollbar { display: none; }
.pc-filter-pill {
  padding: 8px 18px; border-radius: 100px;
  font-size: 0.8rem; font-weight: 700; line-height: 1;
  border: 1.5px solid rgba(59,130,246,0.15);
  background: rgba(255,255,255,0.8);
  color: #475569; cursor: pointer;
  transition: all 0.15s; flex-shrink: 0; white-space: nowrap;
  backdrop-filter: blur(6px);
}
.pc-filter-pill:hover { border-color: #3b82f6; color: #1a3a8f; background: rgba(235,242,255,0.9); }
.pc-filter-pill.active {
  background: linear-gradient(135deg, #1a3a8f, #3b82f6);
  color: #fff; border-color: transparent;
  box-shadow: 0 3px 12px rgba(26,58,143,0.28);
}
.pc-sort {
  margin-left: auto; flex-shrink: 0;
  padding: 8px 14px; border-radius: 10px;
  border: 1.5px solid rgba(59,130,246,0.15);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem; font-weight: 600; color: #475569;
  background: rgba(255,255,255,0.8); cursor: pointer; outline: none;
}

/* ── Section heading ── */
.pc-section-h {
  font-family: 'Playfair Display', serif;
  font-weight: 700; font-size: clamp(1.1rem,3vw,1.4rem);
  color: #0b1437; margin-bottom: 20px;
  display: flex; align-items: center; gap: 10px;
}
.pc-section-count {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem; font-weight: 700; color: #94a3b8;
}

/* ── Grid ── */
.pc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* ── Card ── */
.pc-card {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  border: 1px solid rgba(59,130,246,0.09);
  box-shadow: 0 4px 20px rgba(11,20,55,0.06);
  overflow: hidden;
  display: flex; flex-direction: column;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  text-decoration: none; color: inherit;
}
.pc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(26,58,143,0.13);
}

/* Thumbnail */
.pc-card-thumb {
  position: relative; height: 0; padding-bottom: 56.25%;
  background: linear-gradient(135deg, #EBF2FF, #dbeafe);
  overflow: hidden; flex-shrink: 0;
}
.pc-card-thumb img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.4s ease;
}
.pc-card:hover .pc-card-thumb img { transform: scale(1.04); }
.pc-card-level {
  position: absolute; top: 10px; left: 10px;
  padding: 3px 10px; border-radius: 100px;
  font-size: 0.65rem; font-weight: 800;
  letter-spacing: 0.04em; text-transform: uppercase;
  backdrop-filter: blur(6px);
}
.pc-card-price {
  position: absolute; top: 10px; right: 10px;
  padding: 4px 11px; border-radius: 100px;
  font-size: 0.72rem; font-weight: 800; color: #fff;
  backdrop-filter: blur(6px);
}

/* Body */
.pc-card-body {
  padding: 18px 18px 20px;
  display: flex; flex-direction: column; flex: 1;
}
.pc-card-meta {
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: #94a3b8; margin-bottom: 7px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.pc-card-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(0.95rem,2.5vw,1.05rem); font-weight: 700;
  color: #0b1437; line-height: 1.35; margin-bottom: 10px;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.pc-card-desc {
  font-size: 0.82rem; color: #64748b; line-height: 1.65;
  flex: 1; margin-bottom: 16px;
  display: -webkit-box; -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
}
.pc-card-footer {
  display: flex; gap: 8px; align-items: center; margin-top: auto;
}
.pc-card-info {
  flex: 1; font-size: 0.72rem; color: #94a3b8; font-weight: 600;
}
.pc-btn-view {
  padding: 9px 16px; border-radius: 10px;
  font-size: 0.78rem; font-weight: 700;
  border: 1.5px solid rgba(26,58,143,0.2);
  background: transparent; color: #1a3a8f; cursor: pointer;
  transition: all 0.15s; text-decoration: none;
  display: inline-flex; align-items: center; gap: 5px;
  white-space: nowrap;
}
.pc-btn-view:hover { background: #EBF2FF; border-color: #1a3a8f; }
.pc-btn-enroll {
  padding: 9px 16px; border-radius: 10px;
  font-size: 0.78rem; font-weight: 700; border: none; cursor: pointer;
  background: linear-gradient(135deg, #1a3a8f, #3b82f6);
  color: #fff; transition: all 0.15s;
  box-shadow: 0 3px 10px rgba(26,58,143,0.22);
  text-decoration: none; display: inline-flex; align-items: center;
  white-space: nowrap;
}
.pc-btn-enroll:hover { box-shadow: 0 6px 18px rgba(26,58,143,0.3); transform: translateY(-1px); }

/* ── Skeleton ── */
.pc-skeleton {
  background: linear-gradient(90deg, #e8edf5 25%, #dde3ee 50%, #e8edf5 75%);
  background-size: 200% 100%;
  animation: pc-shimmer 1.4s infinite;
  border-radius: 20px;
  height: 320px;
}
@keyframes pc-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── Empty ── */
.pc-empty {
  text-align: center; padding: 80px 20px; grid-column: 1/-1;
}
.pc-empty-icon { font-size: 52px; margin-bottom: 16px; }
.pc-empty-h {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem; color: #0b1437; margin-bottom: 8px;
}
.pc-empty-p { color: #94a3b8; font-size: 0.88rem; }

/* ── Fade in ── */
@keyframes pc-fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
.pc-fade { animation: pc-fadeUp 0.42s ease both; }

/* ── Mobile ── */
@media (max-width: 480px) {
  .pc-hero { padding: 40px 16px 32px; }
  .pc-stats { gap: 16px; }
  .pc-grid { grid-template-columns: 1fr; gap: 14px; }
  .pc-card-body { padding: 14px 14px 16px; }
}
`;function h(){i();let[e,t]=(0,l.useState)([]),[a,s]=(0,l.useState)(!0),[d,f]=(0,l.useState)(`all`),[h,_]=(0,l.useState)(`newest`),[v,y]=(0,l.useState)(``);(0,l.useEffect)(()=>{r(function*(){s(!0);let{data:e}=yield o.from(`course_courses`).select(`*`).eq(`status`,`published`).order(`created_at`,{ascending:!1});t(e||[]),s(!1)})()},[]),(0,l.useEffect)(()=>{let e=o.channel(`public-courses-realtime`).on(`postgres_changes`,{event:`*`,schema:`public`,table:`course_courses`},()=>{o.from(`course_courses`).select(`*`).eq(`status`,`published`).order(`created_at`,{ascending:!1}).then(({data:e})=>t(e||[]))}).subscribe();return()=>o.removeChannel(e)},[]);let b=e.filter(e=>d===`all`||e.level===d).filter(e=>!v||[e.title,e.description,e.category].some(e=>e==null?void 0:e.toLowerCase().includes(v.toLowerCase()))).sort((e,t)=>h===`newest`?new Date(t.created_at)-new Date(e.created_at):h===`price-asc`?(e.price||0)-(t.price||0):h===`price-desc`?(t.price||0)-(e.price||0):h===`az`?e.title.localeCompare(t.title):0),x=b.filter(e=>!e.price||e.price===0),S=b.filter(e=>e.price>0);return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(n,{children:[(0,u.jsx)(`title`,{children:`Online Courses | AIDLA — Learn, Earn & Grow`}),(0,u.jsx)(`meta`,{name:`description`,content:`Browse free and paid online courses on AIDLA. Learn Mathematics, Science, English, Computer Science and more. Earn coins and certificates as you learn.`}),(0,u.jsx)(`meta`,{name:`keywords`,content:`AIDLA courses, free online courses Pakistan, learn online, earn coins, certificates, mathematics, science, English`}),(0,u.jsx)(`meta`,{property:`og:title`,content:`Online Courses — AIDLA`}),(0,u.jsx)(`meta`,{property:`og:description`,content:`Browse expert-led courses, earn coins, and get verified certificates on AIDLA — Pakistan's #1 educational rewards platform.`}),(0,u.jsx)(`meta`,{property:`og:type`,content:`website`}),(0,u.jsx)(`meta`,{property:`og:url`,content:`https://www.aidla.online/courses`}),(0,u.jsx)(`meta`,{property:`og:image`,content:`https://www.aidla.online/og-home.jpg`}),(0,u.jsx)(`meta`,{name:`twitter:card`,content:`summary_large_image`}),(0,u.jsx)(`link`,{rel:`canonical`,href:`https://www.aidla.online/courses`})]}),(0,u.jsx)(`style`,{children:m}),(0,u.jsxs)(`div`,{className:`pc-root`,children:[(0,u.jsx)(`div`,{className:`pc-orb1`}),(0,u.jsx)(`div`,{className:`pc-orb2`}),(0,u.jsx)(`div`,{className:`pc-orb3`}),(0,u.jsx)(`header`,{className:`pc-hero`,children:(0,u.jsxs)(`div`,{className:`pc-hero-inner`,children:[(0,u.jsx)(`span`,{className:`pc-hero-badge`,children:`📚 Online Learning Platform`}),(0,u.jsxs)(`h1`,{className:`pc-hero-h1`,children:[`Learn Something`,(0,u.jsx)(`br`,{}),(0,u.jsx)(`em`,{children:`Extraordinary`}),` Today.`]}),(0,u.jsx)(`p`,{className:`pc-hero-sub`,children:`Expert-led courses across Mathematics, Science, English, Computer Science and more. Earn real coins as you learn. Get verified certificates. 100% free to join.`}),(0,u.jsxs)(`div`,{className:`pc-search-wrap`,children:[(0,u.jsx)(`span`,{className:`pc-search-icon`,children:`🔍`}),(0,u.jsx)(`input`,{placeholder:`Search courses, topics, skills…`,value:v,onChange:e=>y(e.target.value)}),v&&(0,u.jsx)(`button`,{className:`pc-search-clear`,onClick:()=>y(``),children:`×`})]}),!a&&e.length>0&&(0,u.jsxs)(`div`,{className:`pc-stats pc-fade`,children:[(0,u.jsxs)(`div`,{className:`pc-stat`,children:[(0,u.jsx)(`div`,{className:`pc-stat-val`,children:e.length}),(0,u.jsx)(`div`,{className:`pc-stat-lbl`,children:`Courses`})]}),(0,u.jsx)(`div`,{className:`pc-stat-div`}),(0,u.jsxs)(`div`,{className:`pc-stat`,children:[(0,u.jsx)(`div`,{className:`pc-stat-val`,children:e.filter(e=>!e.price||e.price===0).length}),(0,u.jsx)(`div`,{className:`pc-stat-lbl`,children:`Free`})]}),(0,u.jsx)(`div`,{className:`pc-stat-div`}),(0,u.jsxs)(`div`,{className:`pc-stat`,children:[(0,u.jsx)(`div`,{className:`pc-stat-val`,children:[...new Set(e.map(e=>e.category).filter(Boolean))].length||`10+`}),(0,u.jsx)(`div`,{className:`pc-stat-lbl`,children:`Subjects`})]}),(0,u.jsx)(`div`,{className:`pc-stat-div`}),(0,u.jsxs)(`div`,{className:`pc-stat`,children:[(0,u.jsx)(`div`,{className:`pc-stat-val`,children:`🏆`}),(0,u.jsx)(`div`,{className:`pc-stat-lbl`,children:`Certificates`})]})]})]})}),(0,u.jsxs)(`main`,{className:`pc-main`,children:[(0,u.jsxs)(`div`,{className:`pc-filters`,children:[p.map(e=>(0,u.jsx)(`button`,{className:`pc-filter-pill${d===e.key?` active`:``}`,onClick:()=>f(e.key),children:e.label},e.key)),(0,u.jsxs)(`select`,{className:`pc-sort`,value:h,onChange:e=>_(e.target.value),children:[(0,u.jsx)(`option`,{value:`newest`,children:`Newest First`}),(0,u.jsx)(`option`,{value:`az`,children:`A → Z`}),(0,u.jsx)(`option`,{value:`price-asc`,children:`Price: Low → High`}),(0,u.jsx)(`option`,{value:`price-desc`,children:`Price: High → Low`})]})]}),a?(0,u.jsx)(`div`,{className:`pc-grid`,children:[1,2,3,4,5,6].map(e=>(0,u.jsx)(`div`,{className:`pc-skeleton`},e))}):(0,u.jsxs)(u.Fragment,{children:[x.length>0&&(0,u.jsxs)(`section`,{style:{marginBottom:44},children:[(0,u.jsxs)(`h2`,{className:`pc-section-h`,children:[`🎓 Free Courses`,(0,u.jsxs)(`span`,{className:`pc-section-count`,children:[x.length,` available`]})]}),(0,u.jsx)(`div`,{className:`pc-grid`,children:x.map((e,t)=>(0,u.jsx)(g,{course:e,delay:t*50},e.id))})]}),S.length>0&&(0,u.jsxs)(`section`,{style:{marginBottom:44},children:[(0,u.jsxs)(`h2`,{className:`pc-section-h`,children:[`💎 Premium Courses`,(0,u.jsxs)(`span`,{className:`pc-section-count`,children:[S.length,` available`]})]}),(0,u.jsx)(`div`,{className:`pc-grid`,children:S.map((e,t)=>(0,u.jsx)(g,{course:e,delay:t*50},e.id))})]}),b.length===0&&(0,u.jsx)(`div`,{className:`pc-grid`,children:(0,u.jsxs)(`div`,{className:`pc-empty`,children:[(0,u.jsx)(`div`,{className:`pc-empty-icon`,children:`🔍`}),(0,u.jsx)(`h3`,{className:`pc-empty-h`,children:`No courses found`}),(0,u.jsx)(`p`,{className:`pc-empty-p`,children:`Try a different keyword or filter`})]})})]})]}),(0,u.jsx)(c,{})]})]})}function g({course:e,delay:t=0}){let n=f[e.level]||f.beginner,r=d(e.title),i=!e.price||e.price===0;return(0,u.jsxs)(`article`,{className:`pc-card pc-fade`,style:{animationDelay:`${t}ms`},children:[(0,u.jsxs)(`div`,{className:`pc-card-thumb`,children:[(0,u.jsx)(`img`,{src:e.thumbnail_url||`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80`,alt:e.title,onError:e=>{e.target.src=`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80`},loading:`lazy`}),(0,u.jsx)(`span`,{className:`pc-card-level`,style:{background:n.bg,color:n.color},children:n.label}),(0,u.jsx)(`span`,{className:`pc-card-price`,style:{background:i?`#059669`:`#0b1437`},children:i?`FREE`:`$${Number(e.price).toFixed(0)}`})]}),(0,u.jsxs)(`div`,{className:`pc-card-body`,children:[(0,u.jsxs)(`div`,{className:`pc-card-meta`,children:[e.category||`General`,e.duration_estimate?` · ${e.duration_estimate}`:``]}),(0,u.jsx)(`h3`,{className:`pc-card-title`,children:e.title}),(0,u.jsx)(`p`,{className:`pc-card-desc`,children:e.description||`Explore this course to discover what you'll learn.`}),(0,u.jsxs)(`div`,{className:`pc-card-footer`,children:[(0,u.jsx)(`div`,{className:`pc-card-info`,children:e.certificate_price>0?`🏆 Certificate available`:``}),(0,u.jsx)(a,{to:`/courses/${r}`,className:`pc-btn-view`,children:`Details →`}),(0,u.jsx)(a,{to:`/signup`,className:`pc-btn-enroll`,children:i?`Enroll Free`:`Enroll`})]})]})]})}export{h as default,d as toSlug};