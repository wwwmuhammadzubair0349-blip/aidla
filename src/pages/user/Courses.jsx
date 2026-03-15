// Courses.jsx — Production-Ready Course Catalog
// Mobile-first, zero horizontal scroll, universal screen friendly
// Features: AI Recommendations, Analytics, Leaderboard, Filter, Search
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

// ─── Tokens ──────────────────────────────────────────────────────────────────
const C = {
  blue:      '#0056D2',
  blueDark:  '#003A8C',
  blueLight: '#EBF2FF',
  blueMid:   '#C7DCFF',
  teal:      '#00BFA5',
  amber:     '#F5A623',
  red:       '#E8453C',
  ink:       '#1A1A2E',
  slate:     '#475569',
  muted:     '#94A3B8',
  border:    '#E8EDF5',
  bg:        '#F7F9FC',
  white:     '#FFFFFF',
  success:   '#12B76A',
  successBg: '#ECFDF3',
};

const levelMeta = {
  beginner:     { label: 'Beginner',     color: C.success, bg: C.successBg },
  intermediate: { label: 'Intermediate', color: C.amber,   bg: '#FFF8EC'   },
  advanced:     { label: 'Advanced',     color: C.red,     bg: '#FEF2F1'   },
  'all-levels': { label: 'All Levels',   color: C.blue,    bg: C.blueLight },
};

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ═══════════════════════════════════════════
   GLOBAL OVERFLOW LOCK — same pattern as
   VerifyCertificate / Certificate pages
═══════════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; max-width: 100%; }
html, body { overflow-x: hidden; width: 100%; }
body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${C.bg}; color: ${C.ink}; }
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
  background:${C.blue}; color:#fff;
  border:none; border-radius:8px;
  padding:11px 20px; font-weight:700; font-size:14px; line-height:1;
  cursor:pointer; transition:background .15s, transform .1s;
  white-space:nowrap;
}
.btn-primary:hover  { background:${C.blueDark}; }
.btn-primary:active { transform:translateY(1px); }
.btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }

.btn-outline {
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  background:transparent; color:${C.blue};
  border:1.5px solid ${C.blue}; border-radius:8px;
  padding:10px 20px; font-weight:700; font-size:14px; line-height:1;
  cursor:pointer; transition:background .15s;
  white-space:nowrap;
}
.btn-outline:hover { background:${C.blueLight}; }

.btn-ghost {
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  background:transparent; color:${C.slate};
  border:1.5px solid ${C.border}; border-radius:8px;
  padding:9px 16px; font-weight:600; font-size:13px; line-height:1;
  cursor:pointer; transition:background .15s, border-color .15s;
  white-space:nowrap;
}
.btn-ghost:hover { background:${C.bg}; border-color:#C4CDD6; }

input:focus, select:focus {
  outline:none; border-color:${C.blue} !important;
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
  background:${C.white};
  border-bottom:1px solid ${C.border};
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
  color:${C.blue}; letter-spacing:-.3px;
  flex-shrink:0; white-space:nowrap;
}
.co-nav-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.co-nav-avatar {
  width:32px; height:32px; border-radius:50%;
  background:${C.blueLight};
  display:flex; align-items:center; justify-content:center;
  font-weight:700; font-size:12px; color:${C.blue};
  flex-shrink:0;
}
@media(min-width:480px) {
  .co-nav-inner { padding:0 24px; height:60px; }
  .co-nav-brand { font-size:22px; }
}

/* ── Hero ── */
.co-hero {
  background:linear-gradient(135deg,#EBF2FF 0%,#F0F7FF 50%,#EBF6FF 100%);
  border-bottom:1px solid ${C.border};
  padding:36px 16px 32px;
  overflow:hidden;
}
.co-hero-inner { max-width:1200px; margin:0 auto; }
.co-hero-eyebrow {
  font-size:10px; font-weight:700; letter-spacing:2px;
  text-transform:uppercase; color:${C.blue}; margin-bottom:10px;
}
.co-hero-h1 {
  font-family:'Instrument Serif',serif;
  font-weight:400; font-size:clamp(1.7rem,6vw,3.2rem);
  color:${C.ink}; line-height:1.15; margin-bottom:12px;
}
.co-hero-sub {
  font-size:clamp(13px,3.5vw,15px);
  color:${C.slate}; line-height:1.65; margin-bottom:22px;
  max-width:460px;
}
/* Search bar */
.co-search {
  display:flex; align-items:center; gap:10px;
  background:${C.white}; border:1.5px solid ${C.border};
  border-radius:10px; padding:10px 14px;
  max-width:520px;
  box-shadow:0 3px 12px rgba(0,86,210,.07);
  width:100%;
}
.co-search-icon { font-size:15px; color:${C.muted}; flex-shrink:0; }
.co-search input {
  flex:1; border:none; outline:none;
  font-size:14px; color:${C.ink}; background:transparent;
  min-width:0;
}
.co-search-clear {
  background:none; border:none; color:${C.muted};
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
  border:1.5px solid ${C.border}; background:${C.white};
  color:${C.slate}; cursor:pointer; transition:all .14s;
  flex-shrink:0; white-space:nowrap;
}
.co-filter-pill.active {
  background:${C.blue}; color:#fff; border-color:${C.blue};
  box-shadow:0 2px 8px rgba(0,86,210,.22);
}
.co-sort-select {
  margin-left:auto; flex-shrink:0;
  padding:7px 12px; border-radius:8px;
  border:1.5px solid ${C.border}; font-size:12.5px;
  font-weight:600; color:${C.slate}; cursor:pointer;
  background:${C.white}; white-space:nowrap;
}

/* ── Section title ── */
.co-section-h {
  font-family:'Instrument Serif',serif;
  font-weight:400; font-size:clamp(18px,4vw,22px);
  color:${C.ink}; margin-bottom:16px;
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
  background:${C.white}; border-radius:12px;
  border:1px solid ${C.border};
  box-shadow:0 2px 8px rgba(0,0,0,.04);
  display:flex; flex-direction:column;
  overflow:hidden;
}
.co-card-thumb {
  position:relative; height:0; padding-bottom:56.25%; /* 16:9 */
  background:${C.bg}; overflow:hidden; flex-shrink:0;
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
  background:${C.success}; color:#fff;
  padding:5px 14px; border-radius:100px;
  font-weight:700; font-size:12px;
}
.co-card-body {
  padding:14px 14px 16px;
  display:flex; flex-direction:column; flex-grow:1;
}
.co-card-meta {
  font-size:10.5px; font-weight:600; color:${C.muted};
  text-transform:uppercase; letter-spacing:.7px; margin-bottom:5px;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.co-card-title {
  font-size:14px; font-weight:700; color:${C.ink};
  line-height:1.4; margin-bottom:7px; flex-grow:1;
  display:-webkit-box; -webkit-line-clamp:2;
  -webkit-box-orient:vertical; overflow:hidden;
}
.co-card-desc {
  font-size:12px; color:${C.slate}; line-height:1.6;
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
  background:${C.bg}; border-radius:100px;
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
  background:${C.white}; border-radius:11px;
  border:1px solid ${C.border};
  box-shadow:0 1px 4px rgba(0,0,0,.04);
  padding:14px 12px;
}
.co-stat-icon  { font-size:22px; margin-bottom:8px; }
.co-stat-value { font-size:clamp(20px,5vw,26px); font-weight:800; line-height:1; }
.co-stat-label { font-size:10.5px; color:${C.muted}; font-weight:600; margin-top:5px; }

/* ── AI Recs ── */
.co-ai-cta {
  background:${C.white}; border:1.5px dashed ${C.blueMid};
  border-radius:14px; padding:18px 16px;
  display:flex; align-items:center; gap:14px;
  margin-bottom:32px; cursor:pointer; overflow:hidden;
  flex-wrap:wrap; gap:12px;
}
.co-ai-icon {
  width:44px; height:44px; border-radius:11px;
  background:${C.blueLight};
  display:flex; align-items:center; justify-content:center;
  font-size:22px; flex-shrink:0;
}
.co-ai-text { flex:1; min-width:0; }
.co-ai-title { font-weight:700; font-size:14px; color:${C.ink}; margin-bottom:3px; }
.co-ai-sub   { font-size:12px; color:${C.muted}; line-height:1.5; }
.co-ai-recs-grid {
  display:grid; grid-template-columns:1fr; gap:12px;
  margin-bottom:32px;
}
@media(min-width:480px){ .co-ai-recs-grid { grid-template-columns:repeat(2,1fr); } }
@media(min-width:768px){ .co-ai-recs-grid { grid-template-columns:repeat(3,1fr); } }
.co-ai-rec-card {
  background:${C.blueLight}; border-radius:12px;
  padding:16px; border:1px solid ${C.blueMid};
}
.co-ai-rec-level {
  font-size:10px; font-weight:700; text-transform:uppercase;
  letter-spacing:.6px; color:${C.blue}; margin-bottom:6px;
}
.co-ai-rec-title { font-weight:700; font-size:14px; color:${C.ink}; line-height:1.35; margin-bottom:6px; }
.co-ai-rec-reason { font-size:11.5px; color:${C.slate}; line-height:1.55; margin-bottom:14px; }

/* ── Leaderboard ── */
.co-lb-panel {
  background:${C.white}; border-radius:14px;
  border:1px solid ${C.border};
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
  border-bottom:1px solid ${C.border};
}
.co-lb-row:last-child { border-bottom:none; }
.co-lb-medal { font-size:16px; width:24px; flex-shrink:0; }
.co-lb-bar-wrap {
  flex:1; background:${C.bg}; border-radius:100px;
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
.co-empty-h { font-family:'Instrument Serif',serif; font-weight:400; font-size:20px; color:${C.ink}; }
.co-empty-p { color:${C.muted}; margin-top:7px; font-size:13px; }

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
`;

// ─── Analytics ───────────────────────────────────────────────────────────────
function AnalyticsDashboard({ enrollments, certificates }) {
  const total = Object.keys(enrollments).length;
  if (total === 0) return null;
  const completed     = Object.values(enrollments).filter(e => e.progress_percent === 100).length;
  const certCount     = Object.keys(certificates).length;
  const avgProgress   = Math.round(Object.values(enrollments).reduce((s,e) => s+(e.progress_percent||0),0)/total);
  const hours         = Object.values(enrollments).reduce((s,e) => s+Math.round((e.progress_percent||0)*0.5),0);
  const stats = [
    { label:'Enrolled',       value:total,            icon:'📚', accent:C.blue    },
    { label:'Completed',      value:completed,        icon:'🎓', accent:C.success },
    { label:'Certificates',   value:certCount,        icon:'🏆', accent:C.amber   },
    { label:'Avg Progress',   value:`${avgProgress}%`,icon:'📈', accent:C.teal    },
    { label:'Est. Hours',     value:`${hours}h`,      icon:'⏱', accent:'#8B5CF6' },
  ];
  return (
    <section style={{ marginBottom:28 }} className="fade-up">
      <h2 className="co-section-h">Your Learning Summary</h2>
      <div className="co-analytics-grid">
        {stats.map((s,i) => (
          <div key={s.label} className="co-stat-card fade-up" style={{ animationDelay:`${i*55}ms` }}>
            <div className="co-stat-icon">{s.icon}</div>
            <div className="co-stat-value" style={{ color:s.accent }}>{s.value}</div>
            <div className="co-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────
function LeaderboardPanel({ enrollments }) {
  const sorted = [...enrollments]
    .filter(e => (e.progress_percent||0)>0)
    .sort((a,b) => (b.progress_percent||0)-(a.progress_percent||0))
    .slice(0,8);
  const medals = ['🥇','🥈','🥉'];
  return (
    <div className="co-lb-panel">
      <div className="co-lb-header">
        <span style={{ fontSize:18 }}>🏆</span>
        <h3 style={{ fontFamily:"'Instrument Serif',serif", fontWeight:400, fontSize:17, color:C.ink }}>
          Leaderboard
        </h3>
      </div>
      {sorted.length === 0
        ? <p style={{ color:C.muted, fontSize:12.5 }}>Start learning to appear here!</p>
        : sorted.map((e,i) => (
          <div key={i} className="co-lb-row">
            <span className="co-lb-medal">{medals[i]||`#${i+1}`}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11.5, fontWeight:600, color:C.ink, marginBottom:4,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {e.user_name||`Learner ${String(e.user_id).slice(0,4)}…`}
              </div>
              <div className="co-lb-bar-wrap">
                <div style={{
                  width:`${e.progress_percent||0}%`, height:'100%', borderRadius:100,
                  background: i===0?C.amber:i===1?'#94A3B8':i===2?'#C87533':C.blue,
                  transition:'width .4s',
                }}/>
              </div>
            </div>
            <span className="co-lb-pct"
              style={{ color:e.progress_percent===100?C.success:C.blue }}>
              {e.progress_percent||0}%
            </span>
          </div>
        ))
      }
    </div>
  );
}

// ─── AI Recommendations ───────────────────────────────────────────────────────
function AIRecommendations({ courses, enrollments }) {
  const [recs, setRecs]       = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const enrolled       = Object.keys(enrollments);
    const notEnrolled    = courses.filter(c => !enrolled.includes(c.id));
    const enrolledTitles = courses.filter(c => enrolled.includes(c.id)).map(c=>c.title).join(', ');
    try {
      const res  = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:600,
          messages:[{ role:'user', content:
            `You are a learning advisor. Student is enrolled in: ${enrolledTitles||'nothing yet'}.
Available (id|||title|||level): ${notEnrolled.map(c=>`${c.id}|||${c.title}|||${c.level}`).join('\n')||'none'}
Pick top 3. Reply ONLY raw JSON array: [{"id":"...","reason":"one sentence"}]` }],
        }),
      });
      const data   = await res.json();
      const parsed = JSON.parse((data.content?.[0]?.text||'[]').replace(/```json|```/g,'').trim());
      setRecs(parsed.map(r=>({ ...notEnrolled.find(c=>c.id===r.id), reason:r.reason })).filter(Boolean).slice(0,3));
    } catch {
      setRecs(notEnrolled.slice(0,3).map(c=>({ ...c, reason:'Highly rated by learners at your level.' })));
    }
    setLoading(false);
  };

  if (recs === null) return (
    <div className="co-ai-cta" onClick={load}>
      <div className="co-ai-icon">✨</div>
      <div className="co-ai-text">
        <div className="co-ai-title">Get AI-Powered Recommendations</div>
        <div className="co-ai-sub">Claude analyses your history and suggests what to study next</div>
      </div>
      <button className="btn-primary" style={{ fontSize:13, padding:'9px 16px' }}>
        Recommend for me
      </button>
    </div>
  );

  return (
    <section style={{ marginBottom:28 }} className="fade-up">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div className="co-ai-icon" style={{ width:30, height:30, borderRadius:8, fontSize:14 }}>✨</div>
          <h2 className="co-section-h" style={{ margin:0 }}>Recommended For You</h2>
        </div>
        <button className="btn-ghost" style={{ fontSize:12 }} onClick={()=>setRecs(null)}>Dismiss</button>
      </div>
      {loading ? (
        <div className="co-ai-recs-grid">
          {[1,2,3].map(i=><div key={i} className="skeleton" style={{ height:130 }}/>)}
        </div>
      ) : recs.length===0 ? (
        <div style={{ background:C.successBg, border:`1px solid #A7F3D0`, borderRadius:10,
          padding:'14px 18px', color:'#065F46', fontWeight:600, fontSize:13 }}>
          🎉 You're enrolled in all available courses!
        </div>
      ) : (
        <div className="co-ai-recs-grid">
          {recs.map((c,i)=>c&&(
            <div key={c.id} className="co-ai-rec-card fade-up" style={{ animationDelay:`${i*80}ms` }}>
              <div className="co-ai-rec-level">{(levelMeta[c.level]||levelMeta.beginner).label}</div>
              <div className="co-ai-rec-title">{c.title}</div>
              <div className="co-ai-rec-reason">✨ {c.reason}</div>
              <button className="btn-primary" style={{ fontSize:12, padding:'7px 14px', width:'100%' }}>
                {c.price===0?'Enroll Free':`Enroll · $${Number(c.price).toFixed(2)}`}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────
function CourseCard({ course, enroll, cert, onEnroll, navigate }) {
  const lm       = levelMeta[course.level]||levelMeta.beginner;
  const progress = enroll?.progress_percent||0;
  const isDone   = progress===100;
  return (
    <div className="co-card card-lift">
      {/* Thumbnail */}
      <div className="co-card-thumb">
        <img
          src={course.thumbnail_url||`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80`}
          alt={course.title}
          onError={e=>{ e.target.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'; }}
        />
        <span className="co-card-level-badge" style={{ background:lm.bg, color:lm.color }}>{lm.label}</span>
        {!enroll&&(
          <span className="co-card-price-badge"
            style={{ background:course.price===0?C.success:C.ink }}>
            {course.price===0?'FREE':`$${Number(course.price).toFixed(0)}`}
          </span>
        )}
        {isDone&&(
          <div className="co-card-complete-overlay">
            <span className="co-card-complete-badge">✓ Completed</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="co-card-body">
        <div className="co-card-meta">
          {course.category||'General'}{course.duration_estimate?` · ${course.duration_estimate}`:''}
        </div>
        <h3 className="co-card-title">{course.title}</h3>
        <p className="co-card-desc">{course.description}</p>

        {enroll&&(
          <>
            <div className="co-progress-label">
              <span style={{ color:C.muted }}>Progress</span>
              <span style={{ color:isDone?C.success:C.blue }}>{progress}%</span>
            </div>
            <div className="co-progress-bar">
              <div className="co-progress-fill"
                style={{ width:`${progress}%`, background:isDone?C.success:C.blue }}/>
            </div>
          </>
        )}

        <div className="co-card-cta">
          {enroll ? (
            isDone ? (
              <>
                <button className="btn-ghost" onClick={()=>navigate(`/user/course/${course.id}`)}>Review</button>
                {cert
                  ? <button className="btn-primary" style={{ background:C.amber }}
                      onClick={()=>navigate(`/user/certificate/${cert.id}`)}>🏆 Cert</button>
                  : course.certificate_price>0
                    ? <button className="btn-primary" onClick={()=>onEnroll(course,true)}>Get Cert</button>
                    : null
                }
              </>
            ) : (
              <button className="btn-primary" style={{ flex:1 }}
                onClick={()=>navigate(`/user/course/${course.id}`)}>
                {progress>0?'▶ Continue':'▶ Start'}
              </button>
            )
          ) : (
            <button className="btn-primary" style={{ flex:1 }} onClick={()=>onEnroll(course)}>
              {course.price===0?'Enroll Free':`Buy · $${Number(course.price).toFixed(2)}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="co-toast"
      style={{ background:toast.type==='error'?C.red:C.success }}>
      {toast.msg}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Courses() {
  const navigate = useNavigate();
  const [user, setUser]                   = useState(null);
  const [courses, setCourses]             = useState([]);
  const [enrollments, setEnrollments]     = useState({});
  const [certificates, setCertificates]   = useState({});
  const [allEnrollments, setAllEnrollments] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState('all');
  const [sortBy, setSortBy]               = useState('newest');
  const [search, setSearch]               = useState('');
  const [toast, setToast]                 = useState(null);
  const [showLB, setShowLB]               = useState(false);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(()=>setToast(null), 4000);
  };

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUser(data.user));
    fetchCourses();
    fetchLeaderboard();
  },[]);

  useEffect(()=>{ if (user){ fetchEnrollments(); fetchCertificates(); } },[user]);

  const fetchCourses = async () => {
    setLoading(true);
    const { data } = await supabase.from('course_courses').select('*').eq('status','published').order('created_at',{ascending:false});
    setCourses(data||[]);
    setLoading(false);
  };
  const fetchEnrollments = async () => {
    const { data } = await supabase.from('course_enrollments').select('*').eq('user_id',user.id);
    const map={}; data?.forEach(e=>map[e.course_id]=e); setEnrollments(map);
  };
  const fetchCertificates = async () => {
    const { data } = await supabase.from('course_certificates').select('*').eq('user_id',user.id);
    const map={}; data?.forEach(c=>map[c.course_id]=c); setCertificates(map);
  };
  const fetchLeaderboard = async () => {
    const { data } = await supabase.from('course_enrollments')
      .select('user_id,progress_percent,course_id').gt('progress_percent',0)
      .order('progress_percent',{ascending:false}).limit(20);
    setAllEnrollments(data||[]);
  };
  const handleEnroll = async (course) => {
    if (!user){ navigate('/login'); return; }
    if (enrollments[course.id]){ navigate(`/user/course/${course.id}`); return; }
    const { error } = await supabase.from('course_enrollments').insert({
      user_id:user.id, course_id:course.id,
      has_paid_course:course.price>0, has_paid_certificate:false,
    });
    if (error) showToast(error.message,'error');
    else { showToast(`Enrolled in "${course.title}"! 🎉`); fetchEnrollments(); fetchLeaderboard(); }
  };

  const filtered = courses
    .filter(c=>filter==='all'||c.level===filter)
    .filter(c=>!search||[c.title,c.description,c.category].some(f=>f?.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b)=>{
      if (sortBy==='newest')     return new Date(b.created_at)-new Date(a.created_at);
      if (sortBy==='price-asc')  return (a.price||0)-(b.price||0);
      if (sortBy==='price-desc') return (b.price||0)-(a.price||0);
      return 0;
    });

  const myLearning = filtered.filter(c=>enrollments[c.id]);
  const discover   = filtered.filter(c=>!enrollments[c.id]);

  return (
    <>
      <style>{CSS}</style>
      <Toast toast={toast}/>

      <div className="co-page">

        {/* ── Nav ── */}
        <nav className="co-nav">
          <div className="co-nav-inner">
            <span className="co-nav-brand">LearnHub</span>
            <div className="co-nav-right">
              <button className="btn-ghost" style={{ fontSize:12, padding:'7px 12px' }}
                onClick={()=>setShowLB(v=>!v)}>
                🏆 <span style={{ display:'none' }} className="lb-label">Leaderboard</span>
              </button>
              {/* Show label on wider screens */}
              <style>{`@media(min-width:400px){.lb-label{display:inline !important}}`}</style>
              {user&&(
                <div className="co-nav-avatar">
                  {(user.email||'?')[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="co-hero">
          <div className="co-hero-inner">
            <p className="co-hero-eyebrow">Online Learning Platform</p>
            <h1 className="co-hero-h1">
              Learn Without Limits.<br/>
              <em style={{ color:C.blue }}>Grow Every Day.</em>
            </h1>
            <p className="co-hero-sub">
              Expert-led courses, live quizzes, and verified certificates — beautifully simple.
            </p>
            <div className="co-search">
              <span className="co-search-icon">🔍</span>
              <input
                placeholder="Search courses, topics, skills…"
                value={search} onChange={e=>setSearch(e.target.value)}
              />
              {search&&(
                <button className="co-search-clear" onClick={()=>setSearch('')}>×</button>
              )}
            </div>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="co-main">
          <div className={`co-layout${showLB?' with-lb':''}`}>

            {/* ── LEFT: content ── */}
            <div style={{ minWidth:0 }}>

              {/* Mobile leaderboard (inline, above content) */}
              {showLB && (
                <div className="fade-up" style={{ marginBottom:24, display:'block' }}>
                  <style>{`@media(min-width:900px){.co-lb-mobile{display:none!important}}`}</style>
                  <div className="co-lb-mobile">
                    <LeaderboardPanel enrollments={allEnrollments}/>
                  </div>
                </div>
              )}

              <AnalyticsDashboard enrollments={enrollments} certificates={certificates}/>

              {user&&<AIRecommendations courses={courses} enrollments={enrollments}/>}

              {/* Filters */}
              <div style={{ marginBottom:24 }}>
                <div className="co-filters">
                  {['all','beginner','intermediate','advanced','all-levels'].map(lvl=>(
                    <button key={lvl}
                      className={`co-filter-pill${filter===lvl?' active':''}`}
                      onClick={()=>setFilter(lvl)}>
                      {lvl==='all'?'All Courses':(levelMeta[lvl]?.label||lvl)}
                    </button>
                  ))}
                  <select className="co-sort-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price ↑</option>
                    <option value="price-desc">Price ↓</option>
                  </select>
                </div>
              </div>

              {/* Grids */}
              {loading ? (
                <div className="co-grid">
                  {[1,2,3,4,5,6].map(i=>(
                    <div key={i} className="skeleton" style={{ height:300 }}/>
                  ))}
                </div>
              ) : (
                <>
                  {myLearning.length>0&&(
                    <section style={{ marginBottom:36 }}>
                      <h2 className="co-section-h">My Learning</h2>
                      <div className="co-grid">
                        {myLearning.map(c=>(
                          <CourseCard key={c.id} course={c}
                            enroll={enrollments[c.id]} cert={certificates[c.id]}
                            onEnroll={handleEnroll} navigate={navigate}/>
                        ))}
                      </div>
                    </section>
                  )}

                  {discover.length>0&&(
                    <section>
                      <h2 className="co-section-h">
                        {myLearning.length>0?'Explore More':'All Courses'}
                      </h2>
                      <div className="co-grid">
                        {discover.map(c=>(
                          <CourseCard key={c.id} course={c}
                            enroll={enrollments[c.id]} cert={certificates[c.id]}
                            onEnroll={handleEnroll} navigate={navigate}/>
                        ))}
                      </div>
                    </section>
                  )}

                  {filtered.length===0&&(
                    <div className="co-empty">
                      <div className="co-empty-icon">🔍</div>
                      <h3 className="co-empty-h">No courses found</h3>
                      <p className="co-empty-p">Try a different keyword or filter</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── RIGHT: desktop leaderboard sidebar ── */}
            {showLB&&(
              <aside className="co-lb-sticky" style={{ minWidth:0 }}>
                {/* Hidden on mobile (shown above instead) */}
                <style>{`.co-lb-desktop{display:none}@media(min-width:900px){.co-lb-desktop{display:block}}`}</style>
                <div className="co-lb-desktop">
                  <LeaderboardPanel enrollments={allEnrollments}/>
                </div>
              </aside>
            )}
          </div>
        </div>

      </div>
    </>
  );
}