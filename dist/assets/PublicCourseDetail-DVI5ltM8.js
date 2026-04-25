import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t,n}from"./vendor-helmet-D-cMCI9i.js";import{tr as r}from"./vendor-misc-DjQaoctO.js";import{l as i,n as a,u as o}from"./vendor-router-BeHthcJc.js";import"./vendor-supabase-DTLzbyhy.js";import{t as s}from"./supabase-CXCPPx9q.js";import{r as c}from"./vendor-motion-DyarDpDD.js";import{n as l}from"./index-CPLV-0JN.js";import{toSlug as u}from"./PublicCourses-BjS8p61T.js";var d=e(t(),1),f=c(),p={beginner:{label:`Beginner`,color:`#059669`,bg:`#ECFDF5`,icon:`🌱`},intermediate:{label:`Intermediate`,color:`#D97706`,bg:`#FFFBEB`,icon:`🔥`},advanced:{label:`Advanced`,color:`#DC2626`,bg:`#FEF2F2`,icon:`⚡`},"all-levels":{label:`All Levels`,color:`#1a3a8f`,bg:`#EBF2FF`,icon:`🎯`}},m=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { overflow-x: hidden; width: 100%; }

.pcd-root {
  min-height: 100vh;
  background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 55%, #e8f4fd 100%);
  font-family: 'DM Sans', sans-serif;
  color: #0b1437;
  display: flex; flex-direction: column;
  overflow-x: hidden; position: relative;
}

/* ── Orbs ── */
.pcd-orb1, .pcd-orb2 {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
}
.pcd-orb1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%);
  top: -150px; left: -150px;
}
.pcd-orb2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%);
  bottom: 5%; right: -180px;
}

/* ── Nav ── */
.pcd-nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(59,130,246,0.1);
}
.pcd-nav-inner {
  max-width: 1100px; margin: 0 auto;
  padding: 0 clamp(16px,4vw,32px); height: 60px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.pcd-nav-brand {
  font-family: 'Playfair Display', serif;
  font-style: italic; font-size: clamp(1.1rem,3vw,1.4rem);
  color: #1a3a8f; text-decoration: none; flex-shrink: 0;
}
.pcd-nav-actions { display: flex; gap: 10px; align-items: center; }
.pcd-nav-link {
  font-size: 0.83rem; font-weight: 600; color: #475569;
  text-decoration: none; padding: 7px 14px; border-radius: 30px;
  transition: background 0.18s, color 0.18s;
}
.pcd-nav-link:hover { background: rgba(26,58,143,0.06); color: #1a3a8f; }
.pcd-nav-btn {
  font-size: 0.83rem; font-weight: 700;
  padding: 8px 20px; border-radius: 30px; border: none; cursor: pointer;
  background: linear-gradient(135deg, #1a3a8f, #3b82f6); color: #fff;
  box-shadow: 0 3px 12px rgba(26,58,143,0.25);
  transition: transform 0.18s, box-shadow 0.18s;
  text-decoration: none; display: inline-flex; align-items: center;
}
.pcd-nav-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(26,58,143,0.3); }

/* ── Breadcrumb ── */
.pcd-breadcrumb {
  position: relative; z-index: 1;
  max-width: 1100px; margin: 0 auto;
  padding: 16px clamp(16px,4vw,32px) 0;
  display: flex; align-items: center; gap: 6px;
  font-size: 0.75rem; font-weight: 600; color: #94a3b8;
  flex-wrap: wrap;
}
.pcd-breadcrumb a {
  color: #1a3a8f; text-decoration: none;
  transition: opacity 0.15s;
}
.pcd-breadcrumb a:hover { opacity: 0.7; }
.pcd-breadcrumb-sep { color: #cbd5e1; }

/* ── Hero ── */
.pcd-hero {
  position: relative; z-index: 1;
  padding: clamp(24px,4vw,44px) clamp(16px,4vw,32px) 0;
}
.pcd-hero-inner {
  max-width: 1100px; margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: start;
}
@media (min-width: 860px) {
  .pcd-hero-inner { grid-template-columns: 1fr 360px; }
}

/* ── Left: course info ── */
.pcd-hero-left {}
.pcd-hero-badges {
  display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;
}
.pcd-badge-level {
  padding: 4px 12px; border-radius: 100px;
  font-size: 0.68rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.06em;
}
.pcd-badge-cat {
  padding: 4px 12px; border-radius: 100px;
  font-size: 0.68rem; font-weight: 700;
  background: rgba(59,130,246,0.08); color: #1a3a8f;
  border: 1px solid rgba(59,130,246,0.15);
}
.pcd-hero-h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.6rem,4vw,2.6rem);
  font-weight: 900; line-height: 1.15;
  color: #0b1437; margin-bottom: 16px;
}
.pcd-hero-desc-intro {
  font-size: clamp(0.9rem,2vw,1rem);
  color: #475569; line-height: 1.7;
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pcd-hero-meta {
  display: flex; gap: 18px; flex-wrap: wrap;
  margin-bottom: 28px;
}
.pcd-meta-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.8rem; font-weight: 600; color: #64748b;
}
.pcd-meta-icon { font-size: 14px; }

/* Mobile CTA (hidden on desktop) */
.pcd-mobile-cta {
  margin-bottom: 24px;
}
@media (min-width: 860px) {
  .pcd-mobile-cta { display: none; }
}

/* ── Right: enroll card ── */
.pcd-enroll-card {
  background: rgba(255,255,255,0.97);
  border-radius: 22px;
  border: 1px solid rgba(59,130,246,0.1);
  box-shadow: 0 8px 40px rgba(11,20,55,0.09);
  overflow: hidden;
  position: sticky; top: 76px;
}
.pcd-enroll-thumb {
  width: 100%; height: 0; padding-bottom: 56.25%;
  position: relative; background: linear-gradient(135deg, #EBF2FF, #dbeafe);
  overflow: hidden;
}
.pcd-enroll-thumb img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
}
.pcd-enroll-body { padding: 22px 22px 24px; }
.pcd-price-row {
  display: flex; align-items: baseline; gap: 10px;
  margin-bottom: 18px;
}
.pcd-price {
  font-family: 'Playfair Display', serif;
  font-size: 2rem; font-weight: 900; color: #0b1437; line-height: 1;
}
.pcd-price-free { color: #059669; }
.pcd-price-sub { font-size: 0.78rem; color: #94a3b8; font-weight: 600; }

.pcd-enroll-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 14px 20px; border-radius: 14px; border: none;
  background: linear-gradient(135deg, #1a3a8f, #3b82f6);
  color: #fff; font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem; font-weight: 800; cursor: pointer;
  box-shadow: 0 4px 18px rgba(26,58,143,0.28);
  transition: transform 0.18s, box-shadow 0.18s;
  text-decoration: none; margin-bottom: 12px;
}
.pcd-enroll-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(26,58,143,0.35); }

.pcd-enroll-note {
  text-align: center; font-size: 0.72rem; color: #94a3b8;
  font-weight: 600; margin-bottom: 20px;
}

.pcd-enroll-features { display: flex; flex-direction: column; gap: 10px; }
.pcd-enroll-feat {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.82rem; font-weight: 600; color: #475569;
}
.pcd-enroll-feat-icon { font-size: 16px; flex-shrink: 0; width: 24px; text-align: center; }

/* ── Main content ── */
.pcd-main {
  position: relative; z-index: 1;
  max-width: 1100px; margin: 0 auto; width: 100%;
  padding: clamp(28px,4vw,44px) clamp(16px,4vw,32px) clamp(48px,8vw,80px);
  flex: 1;
}
.pcd-layout {
  display: grid; grid-template-columns: 1fr;
  gap: 32px; align-items: start;
}
@media (min-width: 860px) {
  .pcd-layout { grid-template-columns: 1fr 360px; }
}

/* ── Description section ── */
.pcd-desc-card {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  border: 1px solid rgba(59,130,246,0.09);
  box-shadow: 0 4px 20px rgba(11,20,55,0.06);
  padding: clamp(20px,4vw,32px);
  margin-bottom: 20px;
}
.pcd-section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.1rem,3vw,1.3rem); font-weight: 700;
  color: #0b1437; margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.pcd-desc-text {
  font-size: clamp(0.88rem,2vw,0.95rem);
  color: #334155; line-height: 1.8;
  white-space: pre-line;
}
.pcd-desc-text p { margin-bottom: 12px; }
.pcd-desc-text p:last-child { margin-bottom: 0; }

/* ── Details grid ── */
.pcd-details-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  margin-bottom: 20px;
}
@media (max-width: 480px) {
  .pcd-details-grid { grid-template-columns: 1fr; }
}
.pcd-detail-card {
  background: rgba(255,255,255,0.95);
  border-radius: 14px;
  border: 1px solid rgba(59,130,246,0.09);
  box-shadow: 0 2px 12px rgba(11,20,55,0.04);
  padding: 16px 18px;
  display: flex; align-items: center; gap: 12px;
}
.pcd-detail-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: linear-gradient(135deg, #EBF2FF, #dbeafe);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.pcd-detail-lbl { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; }
.pcd-detail-val { font-size: 0.88rem; font-weight: 700; color: #0b1437; margin-top: 2px; }

/* ── Certificate callout ── */
.pcd-cert-card {
  background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(252,211,77,0.06));
  border: 1.5px solid rgba(245,158,11,0.2);
  border-radius: 16px; padding: 20px 22px;
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 20px; flex-wrap: wrap; gap: 14px;
}
.pcd-cert-icon { font-size: 36px; flex-shrink: 0; }
.pcd-cert-text { flex: 1; min-width: 200px; }
.pcd-cert-title { font-weight: 800; font-size: 0.95rem; color: #0b1437; margin-bottom: 4px; }
.pcd-cert-sub { font-size: 0.8rem; color: #64748b; line-height: 1.5; }

/* ── Sticky CTA bottom (mobile) ── */
.pcd-sticky-cta {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
  padding: 12px 16px;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(59,130,246,0.1);
  box-shadow: 0 -4px 20px rgba(11,20,55,0.1);
  display: flex; align-items: center; gap: 12px;
}
.pcd-sticky-price {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem; font-weight: 900; color: #0b1437; flex-shrink: 0;
}
.pcd-sticky-price.free { color: #059669; }
.pcd-sticky-btn {
  flex: 1; padding: 12px 16px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, #1a3a8f, #3b82f6); color: #fff;
  font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 800;
  cursor: pointer; box-shadow: 0 3px 14px rgba(26,58,143,0.28);
  transition: transform 0.15s; text-decoration: none;
  display: flex; align-items: center; justify-content: center;
}
.pcd-sticky-btn:hover { transform: scale(1.01); }
@media (min-width: 860px) {
  .pcd-sticky-cta { display: none; }
}

/* ── Related courses ── */
.pcd-related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.pcd-related-card {
  background: rgba(255,255,255,0.95);
  border-radius: 14px; border: 1px solid rgba(59,130,246,0.09);
  box-shadow: 0 2px 12px rgba(11,20,55,0.05);
  overflow: hidden; text-decoration: none; color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column;
}
.pcd-related-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(26,58,143,0.12); }
.pcd-related-thumb {
  height: 110px; background: linear-gradient(135deg, #EBF2FF, #dbeafe);
  position: relative; overflow: hidden;
}
.pcd-related-thumb img { width: 100%; height: 100%; object-fit: cover; }
.pcd-related-body { padding: 12px 13px 14px; }
.pcd-related-level {
  font-size: 0.6rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.05em; margin-bottom: 5px;
}
.pcd-related-title {
  font-family: 'Playfair Display', serif;
  font-size: 0.85rem; font-weight: 700; color: #0b1437; line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}

/* ── Not found ── */
.pcd-not-found {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; flex: 1; padding: 80px 20px; text-align: center; z-index: 1;
}
.pcd-nf-icon { font-size: 64px; margin-bottom: 20px; }
.pcd-nf-h {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem; font-weight: 900; color: #0b1437; margin-bottom: 10px;
}
.pcd-nf-p { color: #64748b; font-size: 0.9rem; margin-bottom: 24px; }
.pcd-nf-btn {
  padding: 12px 28px; border-radius: 30px; border: none;
  background: linear-gradient(135deg, #1a3a8f, #3b82f6);
  color: #fff; font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem; font-weight: 800; cursor: pointer;
  text-decoration: none; display: inline-block;
  box-shadow: 0 4px 16px rgba(26,58,143,0.28);
}

/* ── Skeleton ── */
.pcd-skeleton {
  background: linear-gradient(90deg, #e8edf5 25%, #dde3ee 50%, #e8edf5 75%);
  background-size: 200% 100%;
  animation: pcd-shimmer 1.4s infinite; border-radius: 20px;
}
@keyframes pcd-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── Fade ── */
@keyframes pcd-fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
.pcd-fade { animation: pcd-fadeUp 0.42s ease both; }

/* ── Mobile bottom padding ── */
@media (max-width: 859px) {
  .pcd-main { padding-bottom: 90px; }
}
`;function h(){let{slug:e}=o();i();let[t,c]=(0,d.useState)(null),[h,g]=(0,d.useState)([]),[_,v]=(0,d.useState)(!0),[y,b]=(0,d.useState)(!1);if((0,d.useEffect)(()=>{window.scrollTo(0,0),r(function*(){v(!0);let{data:t}=yield s.from(`course_courses`).select(`*`).eq(`status`,`published`);if(!t||t.length===0){b(!0),v(!1);return}let n=t.find(t=>u(t.title)===e);if(!n){b(!0),v(!1);return}c(n),g(t.filter(e=>e.id!==n.id&&(e.category===n.category||e.level===n.level)).slice(0,4)),v(!1)})()},[e]),_)return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`style`,{children:m}),(0,f.jsxs)(`div`,{className:`pcd-root`,children:[(0,f.jsx)(`div`,{className:`pcd-orb1`}),(0,f.jsx)(`div`,{className:`pcd-orb2`}),(0,f.jsx)(`nav`,{className:`pcd-nav`,children:(0,f.jsx)(`div`,{className:`pcd-nav-inner`,children:(0,f.jsx)(a,{to:`/`,className:`pcd-nav-brand`,children:`AIDLA`})})}),(0,f.jsxs)(`div`,{style:{maxWidth:1100,margin:`40px auto`,padding:`0 24px`,display:`grid`,gridTemplateColumns:`1fr 360px`,gap:32},children:[(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`div`,{className:`pcd-skeleton`,style:{height:48,marginBottom:16}}),(0,f.jsx)(`div`,{className:`pcd-skeleton`,style:{height:24,marginBottom:10,width:`70%`}}),(0,f.jsx)(`div`,{className:`pcd-skeleton`,style:{height:280,marginTop:24}})]}),(0,f.jsx)(`div`,{className:`pcd-skeleton`,style:{height:420}})]})]})]});if(y)return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`style`,{children:m}),(0,f.jsxs)(`div`,{className:`pcd-root`,children:[(0,f.jsx)(`div`,{className:`pcd-orb1`}),(0,f.jsx)(`div`,{className:`pcd-orb2`}),(0,f.jsx)(`nav`,{className:`pcd-nav`,children:(0,f.jsxs)(`div`,{className:`pcd-nav-inner`,children:[(0,f.jsx)(a,{to:`/`,className:`pcd-nav-brand`,children:`AIDLA`}),(0,f.jsx)(`div`,{className:`pcd-nav-actions`,children:(0,f.jsx)(a,{to:`/courses`,className:`pcd-nav-link`,children:`← All Courses`})})]})}),(0,f.jsxs)(`div`,{className:`pcd-not-found`,children:[(0,f.jsx)(`div`,{className:`pcd-nf-icon`,children:`🔍`}),(0,f.jsx)(`h1`,{className:`pcd-nf-h`,children:`Course Not Found`}),(0,f.jsx)(`p`,{className:`pcd-nf-p`,children:`This course may have been removed or the link is incorrect.`}),(0,f.jsx)(a,{to:`/courses`,className:`pcd-nf-btn`,children:`Browse All Courses`})]}),(0,f.jsx)(l,{})]})]});let x=p[t.level]||p.beginner,S=!t.price||t.price===0,C=t.certificate_price>0||t.certificate_price===0,w=(t.description||``).split(/\n{2,}/).map(e=>e.trim()).filter(Boolean),T=[{icon:`📊`,label:`Level`,val:x.label},{icon:`🗂️`,label:`Category`,val:t.category||`General`},{icon:`⏱️`,label:`Duration`,val:t.duration_estimate||`Self-paced`},{icon:`💰`,label:`Price`,val:S?`Free`:`$${Number(t.price).toFixed(2)}`}].filter(e=>e.val);return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(n,{children:[(0,f.jsxs)(`title`,{children:[t.title,` | AIDLA Online Courses`]}),(0,f.jsx)(`meta`,{name:`description`,content:(t.description||``).slice(0,155).replace(/\n/g,` `)+` — Enroll free on AIDLA, Pakistan's #1 educational rewards platform.`}),(0,f.jsx)(`meta`,{name:`keywords`,content:`${t.title}, ${t.category||``}, online course, AIDLA, free course, Pakistan`}),(0,f.jsx)(`meta`,{property:`og:title`,content:`${t.title} — AIDLA`}),(0,f.jsx)(`meta`,{property:`og:description`,content:(t.description||``).slice(0,155)}),(0,f.jsx)(`meta`,{property:`og:type`,content:`article`}),(0,f.jsx)(`meta`,{property:`og:url`,content:`https://www.aidla.online/courses/${e}`}),(0,f.jsx)(`meta`,{property:`og:image`,content:t.thumbnail_url||`https://www.aidla.online/og-home.jpg`}),(0,f.jsx)(`meta`,{name:`twitter:card`,content:`summary_large_image`}),(0,f.jsx)(`meta`,{name:`twitter:title`,content:t.title}),(0,f.jsx)(`meta`,{name:`twitter:description`,content:(t.description||``).slice(0,155)}),(0,f.jsx)(`meta`,{name:`twitter:image`,content:t.thumbnail_url||`https://www.aidla.online/og-home.jpg`}),(0,f.jsx)(`link`,{rel:`canonical`,href:`https://www.aidla.online/courses/${e}`}),(0,f.jsx)(`script`,{type:`application/ld+json`,children:JSON.stringify({"@context":`https://schema.org`,"@type":`Course`,name:t.title,description:t.description||``,provider:{"@type":`Organization`,name:`AIDLA`,url:`https://www.aidla.online`},url:`https://www.aidla.online/courses/${e}`,image:t.thumbnail_url||``,courseLevel:x.label,offers:{"@type":`Offer`,price:t.price||0,priceCurrency:`USD`,availability:`https://schema.org/InStock`,url:`https://www.aidla.online/signup`}})})]}),(0,f.jsx)(`style`,{children:m}),(0,f.jsxs)(`div`,{className:`pcd-root`,children:[(0,f.jsx)(`div`,{className:`pcd-orb1`}),(0,f.jsx)(`div`,{className:`pcd-orb2`}),(0,f.jsx)(`nav`,{className:`pcd-nav`,children:(0,f.jsxs)(`div`,{className:`pcd-nav-inner`,children:[(0,f.jsx)(a,{to:`/`,className:`pcd-nav-brand`,children:`AIDLA`}),(0,f.jsxs)(`div`,{className:`pcd-nav-actions`,children:[(0,f.jsx)(a,{to:`/courses`,className:`pcd-nav-link`,children:`← All Courses`}),(0,f.jsx)(a,{to:`/signup`,className:`pcd-nav-btn`,children:`Get Started Free`})]})]})}),(0,f.jsxs)(`div`,{className:`pcd-breadcrumb pcd-fade`,children:[(0,f.jsx)(a,{to:`/`,children:`Home`}),(0,f.jsx)(`span`,{className:`pcd-breadcrumb-sep`,children:`›`}),(0,f.jsx)(a,{to:`/courses`,children:`Courses`}),(0,f.jsx)(`span`,{className:`pcd-breadcrumb-sep`,children:`›`}),(0,f.jsx)(`span`,{style:{color:`#475569`},children:t.title})]}),(0,f.jsx)(`header`,{className:`pcd-hero`,children:(0,f.jsxs)(`div`,{className:`pcd-hero-inner`,children:[(0,f.jsxs)(`div`,{className:`pcd-fade`,children:[(0,f.jsxs)(`div`,{className:`pcd-hero-badges`,children:[(0,f.jsxs)(`span`,{className:`pcd-badge-level`,style:{background:x.bg,color:x.color},children:[x.icon,` `,x.label]}),t.category&&(0,f.jsx)(`span`,{className:`pcd-badge-cat`,children:t.category}),S&&(0,f.jsx)(`span`,{style:{background:`#ECFDF5`,color:`#059669`,padding:`4px 12px`,borderRadius:100,fontSize:`0.68rem`,fontWeight:800,textTransform:`uppercase`,letterSpacing:`0.06em`},children:`Free`})]}),(0,f.jsx)(`h1`,{className:`pcd-hero-h1`,children:t.title}),(0,f.jsx)(`p`,{className:`pcd-hero-desc-intro`,children:(t.description||``).split(`
`)[0]}),(0,f.jsxs)(`div`,{className:`pcd-hero-meta`,children:[t.duration_estimate&&(0,f.jsxs)(`div`,{className:`pcd-meta-item`,children:[(0,f.jsx)(`span`,{className:`pcd-meta-icon`,children:`⏱️`}),t.duration_estimate]}),(0,f.jsxs)(`div`,{className:`pcd-meta-item`,children:[(0,f.jsx)(`span`,{className:`pcd-meta-icon`,children:`📊`}),x.label]}),t.certificate_price>=0&&C&&(0,f.jsxs)(`div`,{className:`pcd-meta-item`,children:[(0,f.jsx)(`span`,{className:`pcd-meta-icon`,children:`🏆`}),`Certificate Available`]}),(0,f.jsxs)(`div`,{className:`pcd-meta-item`,children:[(0,f.jsx)(`span`,{className:`pcd-meta-icon`,children:`🌍`}),`Online · Self-paced`]})]}),(0,f.jsx)(`div`,{className:`pcd-mobile-cta`,children:(0,f.jsx)(a,{to:`/signup`,style:{display:`flex`,alignItems:`center`,justifyContent:`center`,gap:8,width:`100%`,padding:`14px 20px`,borderRadius:14,background:`linear-gradient(135deg, #1a3a8f, #3b82f6)`,color:`#fff`,fontFamily:`'DM Sans',sans-serif`,fontSize:`0.95rem`,fontWeight:800,textDecoration:`none`,boxShadow:`0 4px 18px rgba(26,58,143,0.28)`},children:S?`🎓 Enroll for Free`:`Enroll · $${Number(t.price).toFixed(2)}`})})]}),(0,f.jsx)(`div`,{className:`pcd-fade`,style:{animationDelay:`80ms`},children:(0,f.jsxs)(`div`,{className:`pcd-enroll-card`,children:[(0,f.jsx)(`div`,{className:`pcd-enroll-thumb`,children:(0,f.jsx)(`img`,{src:t.thumbnail_url||`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80`,alt:t.title,onError:e=>{e.target.src=`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80`}})}),(0,f.jsxs)(`div`,{className:`pcd-enroll-body`,children:[(0,f.jsxs)(`div`,{className:`pcd-price-row`,children:[(0,f.jsx)(`div`,{className:`pcd-price${S?` pcd-price-free`:``}`,children:S?`Free`:`$${Number(t.price).toFixed(2)}`}),!S&&(0,f.jsx)(`div`,{className:`pcd-price-sub`,children:`One-time payment`})]}),(0,f.jsx)(a,{to:`/signup`,className:`pcd-enroll-btn`,children:S?`🎓 Enroll for Free`:`Enroll Now →`}),(0,f.jsx)(`p`,{className:`pcd-enroll-note`,children:S?`No credit card required`:`Secure checkout · Instant access`}),(0,f.jsxs)(`div`,{className:`pcd-enroll-features`,children:[(0,f.jsxs)(`div`,{className:`pcd-enroll-feat`,children:[(0,f.jsx)(`span`,{className:`pcd-enroll-feat-icon`,children:`📱`}),`Mobile-friendly learning`]}),(0,f.jsxs)(`div`,{className:`pcd-enroll-feat`,children:[(0,f.jsx)(`span`,{className:`pcd-enroll-feat-icon`,children:`🕐`}),`Learn at your own pace`]}),(0,f.jsxs)(`div`,{className:`pcd-enroll-feat`,children:[(0,f.jsx)(`span`,{className:`pcd-enroll-feat-icon`,children:`🪙`}),`Earn AIDLA Coins as you learn`]}),C&&(0,f.jsxs)(`div`,{className:`pcd-enroll-feat`,children:[(0,f.jsx)(`span`,{className:`pcd-enroll-feat-icon`,children:`🏆`}),t.certificate_price===0?`Free certificate on completion`:`Certificate · $${Number(t.certificate_price).toFixed(2)}`]}),(0,f.jsxs)(`div`,{className:`pcd-enroll-feat`,children:[(0,f.jsx)(`span`,{className:`pcd-enroll-feat-icon`,children:`🤖`}),`AI-powered support 24/7`]})]})]})]})})]})}),(0,f.jsx)(`main`,{className:`pcd-main`,children:(0,f.jsxs)(`div`,{className:`pcd-layout`,children:[(0,f.jsxs)(`div`,{children:[(0,f.jsxs)(`div`,{className:`pcd-desc-card pcd-fade`,style:{animationDelay:`120ms`},children:[(0,f.jsx)(`h2`,{className:`pcd-section-title`,children:`📖 About This Course`}),(0,f.jsx)(`div`,{className:`pcd-desc-text`,children:w.length>0?w.map((e,t)=>(0,f.jsx)(`p`,{children:e},t)):(0,f.jsx)(`p`,{children:t.description||`No description available.`})})]}),(0,f.jsx)(`div`,{className:`pcd-details-grid pcd-fade`,style:{animationDelay:`160ms`},children:T.map(e=>(0,f.jsxs)(`div`,{className:`pcd-detail-card`,children:[(0,f.jsx)(`div`,{className:`pcd-detail-icon`,children:e.icon}),(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`div`,{className:`pcd-detail-lbl`,children:e.label}),(0,f.jsx)(`div`,{className:`pcd-detail-val`,children:e.val})]})]},e.label))}),C&&(0,f.jsxs)(`div`,{className:`pcd-cert-card pcd-fade`,style:{animationDelay:`200ms`},children:[(0,f.jsx)(`div`,{className:`pcd-cert-icon`,children:`🏆`}),(0,f.jsxs)(`div`,{className:`pcd-cert-text`,children:[(0,f.jsx)(`div`,{className:`pcd-cert-title`,children:`Verified Certificate of Completion`}),(0,f.jsx)(`div`,{className:`pcd-cert-sub`,children:t.certificate_price===0?`Complete this course and earn a free verified certificate you can share on LinkedIn and your CV.`:`Earn a verified certificate for just $${Number(t.certificate_price).toFixed(2)} — a powerful addition to your CV and LinkedIn profile.`})]}),(0,f.jsx)(a,{to:`/signup`,style:{padding:`10px 20px`,borderRadius:30,border:`none`,background:`linear-gradient(135deg, #f59e0b, #d97706)`,color:`#fff`,fontFamily:`'DM Sans',sans-serif`,fontSize:`0.82rem`,fontWeight:800,cursor:`pointer`,textDecoration:`none`,whiteSpace:`nowrap`,boxShadow:`0 3px 12px rgba(245,158,11,0.3)`,display:`inline-block`},children:`Get Certificate`})]}),(0,f.jsxs)(`div`,{className:`pcd-desc-card pcd-fade`,style:{animationDelay:`240ms`},children:[(0,f.jsx)(`h2`,{className:`pcd-section-title`,children:`🚀 Why Learn on AIDLA?`}),(0,f.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:14},children:[{icon:`🪙`,title:`Earn Real Coins`,desc:`Every quiz, test, and course completion rewards you with AIDLA Coins — redeemable for real prizes and cash.`},{icon:`🤖`,title:`AI-Powered Learning`,desc:`Personalised learning paths that adapt to your pace and style. Get instant explanations from our AI tutor 24/7.`},{icon:`🏆`,title:`Compete & Win`,desc:`Rise on the leaderboard, enter Lucky Draws, and spin the Lucky Wheel for bonus rewards.`},{icon:`💸`,title:`100% Free to Join`,desc:`No subscription, no hidden fees. Create your free account in 60 seconds and start learning today.`}].map(e=>(0,f.jsxs)(`div`,{style:{display:`flex`,gap:14,alignItems:`flex-start`},children:[(0,f.jsx)(`div`,{style:{width:40,height:40,borderRadius:10,flexShrink:0,background:`linear-gradient(135deg, #EBF2FF, #dbeafe)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontSize:18},children:e.icon}),(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`div`,{style:{fontWeight:700,fontSize:`0.9rem`,color:`#0b1437`,marginBottom:3},children:e.title}),(0,f.jsx)(`div`,{style:{fontSize:`0.82rem`,color:`#64748b`,lineHeight:1.6},children:e.desc})]})]},e.title))})]}),h.length>0&&(0,f.jsxs)(`div`,{className:`pcd-fade`,style:{animationDelay:`280ms`},children:[(0,f.jsx)(`h2`,{className:`pcd-section-title`,style:{marginBottom:14},children:`📚 You Might Also Like`}),(0,f.jsx)(`div`,{className:`pcd-related-grid`,children:h.map(e=>{let t=p[e.level]||p.beginner;return(0,f.jsxs)(a,{to:`/courses/${u(e.title)}`,className:`pcd-related-card`,children:[(0,f.jsx)(`div`,{className:`pcd-related-thumb`,children:(0,f.jsx)(`img`,{src:e.thumbnail_url||`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=70`,alt:e.title,onError:e=>{e.target.src=`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=70`},loading:`lazy`})}),(0,f.jsxs)(`div`,{className:`pcd-related-body`,children:[(0,f.jsx)(`div`,{className:`pcd-related-level`,style:{color:t.color},children:t.label}),(0,f.jsx)(`div`,{className:`pcd-related-title`,children:e.title})]})]},e.id)})})]})]}),(0,f.jsx)(`div`,{})]})}),(0,f.jsx)(l,{})]})]})}export{h as default};