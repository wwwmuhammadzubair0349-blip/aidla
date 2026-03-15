// Learning.jsx — AIDLA Career Counselor
// 100% Mobile-First · Production Ready · Delete Chat · PDF.js · Groq AI
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  blue:      '#0056D2',
  blueDark:  '#003A8C',
  blueLight: '#EBF2FF',
  blueMid:   '#C7DCFF',
  ink:       '#0F172A',
  slate:     '#475569',
  muted:     '#94A3B8',
  border:    '#E2E8F4',
  bg:        '#F4F7FB',
  surface:   '#FFFFFF',
  success:   '#12B76A',
  successBg: '#ECFDF3',
  amber:     '#F59E0B',
  red:       '#EF4444',
  redLight:  '#FEF2F2',
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{height:100%;-webkit-text-size-adjust:100%;text-size-adjust:100%;}
body{font-family:'DM Sans',sans-serif;background:${C.bg};color:${C.ink};-webkit-font-smoothing:antialiased;height:100%;}
button,input,textarea,select{font-family:'DM Sans',sans-serif;-webkit-appearance:none;appearance:none;}
img{display:block;max-width:100%;}
button{border:none;background:none;cursor:pointer;padding:0;}

@keyframes fadeUp {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn {from{opacity:0}to{opacity:1}}
@keyframes spin   {to{transform:rotate(360deg)}}
@keyframes blink  {0%,100%{opacity:1}50%{opacity:0}}
@keyframes dots   {0%,100%{opacity:1}50%{opacity:.25}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes slideL {from{opacity:0;transform:translateX(-100%)}to{opacity:1;transform:translateX(0)}}

.fu{animation:fadeUp .25s ease both;}
.fi{animation:fadeIn .2s ease both;}

/* ══════════════════════════
   SHELL — fills whatever space the parent gives it
   Works inside any router outlet / layout wrapper
══════════════════════════ */

/* Stop the parent outlet from scrolling while this page is mounted */
.cc-page-active{overflow:hidden !important;height:100%;}

.shell{
  display:flex;
  width:100%;
  height:calc(100dvh - 56px);
  overflow:hidden;
  background:${C.bg};
  /* Fallback for browsers without dvh */
  height:calc(100vh - 56px);
  height:calc(100dvh - 56px);
}
@media(min-width:768px){
  .shell{
    height:calc(100vh - 64px);
    height:calc(100dvh - 64px);
  }
}

/* ══════════════════════════
   SIDEBAR
══════════════════════════ */
.sb{
  width:260px;
  background:${C.surface};
  border-right:1.5px solid ${C.border};
  display:flex;flex-direction:column;
  flex-shrink:0;
  overflow:hidden;
}
/* mobile: off-canvas drawer */
@media(max-width:767px){
  .sb{
    position:fixed;
    top:0;left:0;bottom:0;
    width:min(280px,88vw);
    z-index:300;
    transform:translateX(-110%);
    transition:transform .28s cubic-bezier(.4,0,.2,1);
    box-shadow:none;
    border-right:none;
  }
  .sb.open{
    transform:translateX(0);
    box-shadow:6px 0 24px rgba(0,0,0,.18);
  }
}
/* desktop: always visible */
@media(min-width:768px){
  .sb{display:flex !important;}
}

/* Sidebar sections */
.sb-head{padding:14px 12px 11px;border-bottom:1.5px solid ${C.border};flex-shrink:0;}
.sb-profile{padding:10px 12px;border-bottom:1.5px solid ${C.border};flex-shrink:0;display:flex;align-items:center;gap:8px;}
.sb-list{flex:1;overflow-y:auto;overflow-x:hidden;padding:6px 5px;-webkit-overflow-scrolling:touch;}

/* History item */
.hi{
  padding:8px 10px;border-radius:9px;
  cursor:pointer;border:1.5px solid transparent;
  transition:background .12s;
  display:flex;align-items:flex-start;gap:8px;
  -webkit-tap-highlight-color:transparent;
  margin-bottom:2px;
}
.hi:hover{background:${C.blueLight};border-color:${C.blueMid};}
.hi:active{background:${C.blueMid};}
.hi-text{flex:1;min-width:0;}
.hi-del{
  opacity:0;width:24px;height:24px;border-radius:6px;
  display:flex;align-items:center;justify-content:center;
  color:${C.red};font-size:14px;flex-shrink:0;
  transition:all .15s;background:none;border:none;cursor:pointer;
  padding:0;margin-top:1px;
}
.hi:hover .hi-del{opacity:1;}
.hi-del:hover{background:${C.redLight};}
/* always show on mobile */
@media(max-width:767px){.hi-del{opacity:0.6;}}

/* ══════════════════════════
   OVERLAY
══════════════════════════ */
.ov{
  display:none;position:fixed;inset:0;
  background:rgba(0,0,0,.52);z-index:290;
  animation:fadeIn .2s ease;
}
@media(max-width:767px){.ov.show{display:block;}}

/* ══════════════════════════
   MAIN PANEL
══════════════════════════ */
.main{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden;}

/* Top bar */
.topbar{
  background:${C.surface};
  border-bottom:1.5px solid ${C.border};
  padding:0 12px;
  display:flex;align-items:center;gap:9px;
  flex-shrink:0;height:50px;
}
@media(min-width:768px){.topbar{height:54px;padding:0 16px;gap:12px;}}

/* Mode tabs */
.tabs{
  background:${C.surface};
  border-bottom:1.5px solid ${C.border};
  display:flex;flex-shrink:0;
  overflow-x:auto;overflow-y:hidden;
  scrollbar-width:none;
  -webkit-overflow-scrolling:touch;
  padding:0 4px;
}
.tabs::-webkit-scrollbar{display:none;}
.tab{
  padding:0 10px;height:42px;
  border:none;border-bottom:2.5px solid transparent;
  font-weight:600;font-size:11px;letter-spacing:.1px;
  cursor:pointer;background:transparent;color:${C.muted};
  transition:all .15s;white-space:nowrap;
  display:flex;align-items:center;gap:4px;
  flex-shrink:0;
  -webkit-tap-highlight-color:transparent;
}
.tab.on{color:${C.blue};border-bottom-color:${C.blue};}
.tab:hover:not(.on){color:${C.slate};}
@media(min-width:480px){.tab{padding:0 13px;font-size:12px;}}

/* ══════════════════════════
   CHAT AREA
══════════════════════════ */
.chat{
  flex:1;overflow-y:auto;overflow-x:hidden;
  padding:14px 10px 6px;
  -webkit-overflow-scrolling:touch;
  scroll-behavior:smooth;
}
@media(min-width:480px){.chat{padding:18px 14px 8px;}}
@media(min-width:768px){.chat{padding:20px 20px 10px;}}

.chat-in{
  max-width:660px;margin:0 auto;
  display:flex;flex-direction:column;gap:10px;
}

/* Bubbles */
.row{display:flex;align-items:flex-end;gap:6px;}
.row.u{flex-direction:row-reverse;}

.av{
  width:26px;height:26px;border-radius:7px;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;flex-shrink:0;background:${C.blue};
}
.av.u{background:${C.blueLight};}

.bu{
  background:${C.blue};color:#fff;
  border-radius:16px 16px 3px 16px;
  padding:10px 13px;font-size:13.5px;line-height:1.65;
  max-width:min(80%,500px);
  box-shadow:0 2px 8px rgba(0,86,210,.2);
  word-break:break-word;
}
.ba{
  background:${C.surface};color:${C.ink};
  border-radius:16px 16px 16px 3px;
  padding:11px 13px;font-size:13.5px;line-height:1.72;
  max-width:min(90%,540px);
  border:1.5px solid ${C.border};
  box-shadow:0 1px 3px rgba(0,0,0,.04);
  word-break:break-word;
}
.ba strong{color:${C.blue};}
.ba ul,.ba ol{padding-left:15px;margin:5px 0;}
.ba li{margin-bottom:3px;font-size:13px;}
.ba p{margin-bottom:5px;}
.ba p:last-child{margin-bottom:0;}
.ba h3,.ba h4{font-size:13px;font-weight:700;margin:7px 0 3px;}
.ba code{background:${C.bg};padding:1px 5px;border-radius:4px;font-size:11.5px;font-family:monospace;}
.ba hr{border:none;border-top:1px solid ${C.border};margin:8px 0;}

/* typing dots */
.d{width:6px;height:6px;border-radius:50%;background:${C.muted};animation:dots 1.4s infinite;}
.d:nth-child(2){animation-delay:.2s;}
.d:nth-child(3){animation-delay:.4s;}

/* cursor */
.cur{display:inline-block;width:2px;height:12px;background:${C.blue};margin-left:1px;vertical-align:middle;animation:blink .75s infinite;}

/* image in bubble */
.bimg{max-width:180px;border-radius:8px;margin-top:6px;}

/* ══════════════════════════
   INPUT BAR
══════════════════════════ */
.ibar{
  background:${C.surface};
  border-top:1.5px solid ${C.border};
  padding:8px 10px;
  flex-shrink:0;
}
/* safe area for notched phones */
@supports(padding:max(0px)){
  .ibar{padding-bottom:max(8px,env(safe-area-inset-bottom));}
}
@media(min-width:480px){.ibar{padding:10px 14px;}}
@media(min-width:768px){.ibar{padding:12px 16px;}}

.ibar-in{max-width:660px;margin:0 auto;}

/* file strip */
.fstrip{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:7px;}
.fchip{
  display:flex;align-items:center;gap:5px;
  padding:4px 8px;border-radius:7px;
  background:${C.blueLight};border:1.5px solid ${C.blueMid};
  font-size:11px;font-weight:600;color:${C.blue};
  max-width:160px;
}
.fchip-n{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.fchip-rm{color:${C.blue};font-size:13px;flex-shrink:0;padding:0;background:none;border:none;cursor:pointer;line-height:1;}
.ithumb{width:44px;height:44px;border-radius:7px;object-fit:cover;border:1.5px solid ${C.blueMid};flex-shrink:0;}

/* input row */
.irow{display:flex;align-items:flex-end;gap:6px;}
.ta{
  flex:1;padding:10px 12px;border-radius:11px;
  border:1.5px solid ${C.border};
  font-size:16px; /* 16px prevents iOS zoom */
  color:${C.ink};resize:none;
  min-height:42px;max-height:110px;
  overflow-y:auto;line-height:1.5;
  background:${C.bg};
  transition:border-color .15s,box-shadow .15s;
  -webkit-overflow-scrolling:touch;
  width:100%;
}
.ta:focus{outline:none;border-color:${C.blue};box-shadow:0 0 0 3px rgba(0,86,210,.1);background:${C.surface};}
.ta::placeholder{color:${C.muted};font-size:14px;}

.abtn{
  width:38px;height:38px;border-radius:10px;
  border:1.5px solid ${C.border};background:${C.surface};color:${C.slate};
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;flex-shrink:0;font-size:16px;
  transition:all .14s;
  -webkit-tap-highlight-color:transparent;
}
.abtn:hover,.abtn:active{border-color:${C.blue};color:${C.blue};background:${C.blueLight};}

.sbtn{
  width:42px;height:42px;border-radius:11px;border:none;
  background:${C.blue};color:#fff;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;flex-shrink:0;font-size:20px;
  box-shadow:0 2px 8px rgba(0,86,210,.28);
  transition:all .14s;
  -webkit-tap-highlight-color:transparent;
}
.sbtn:hover{background:${C.blueDark};}
.sbtn:disabled{background:${C.border};color:${C.muted};box-shadow:none;cursor:not-allowed;}
.sbtn:active:not(:disabled){transform:scale(.94);}

/* hint row */
.hint{display:flex;justify-content:space-between;margin-top:5px;gap:6px;flex-wrap:wrap;}
.hint span{font-size:10px;color:${C.muted};}

/* chips */
.chips{display:flex;gap:5px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding-bottom:2px;}
.chips::-webkit-scrollbar{display:none;}
.chip{
  padding:6px 12px;border-radius:20px;font-size:11.5px;font-weight:600;
  border:1.5px solid ${C.border};background:${C.surface};color:${C.slate};
  cursor:pointer;white-space:nowrap;transition:all .13s;flex-shrink:0;
  -webkit-tap-highlight-color:transparent;
}
.chip:hover,.chip:active{border-color:${C.blue};color:${C.blue};background:${C.blueLight};}

/* ══════════════════════════
   WELCOME SCREEN
══════════════════════════ */
.wlc{max-width:600px;margin:0 auto;padding:2px 0 14px;width:100%;}

.hero{
  text-align:center;
  padding:20px 14px 18px;
  background:${C.surface};
  border-radius:14px;
  border:1.5px solid ${C.border};
  margin-bottom:12px;
  box-shadow:0 2px 10px rgba(0,0,0,.05);
}
.hero-ic{
  width:56px;height:56px;border-radius:14px;
  background:linear-gradient(135deg,${C.blue},${C.blueDark});
  display:flex;align-items:center;justify-content:center;
  font-size:26px;margin:0 auto 11px;
  box-shadow:0 5px 18px rgba(0,86,210,.28);
}

/* mode grid */
.mgrid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:7px;margin-bottom:12px;
}
@media(min-width:380px){.mgrid{grid-template-columns:repeat(3,1fr);}}
@media(min-width:560px){.mgrid{grid-template-columns:repeat(4,1fr);}}

.mcard{
  background:${C.surface};border:1.5px solid ${C.border};
  border-radius:10px;padding:11px 10px;
  cursor:pointer;transition:all .16s;
  display:flex;flex-direction:column;gap:5px;
  -webkit-tap-highlight-color:transparent;
  text-align:left;
}
.mcard:hover{border-color:${C.blueMid};box-shadow:0 3px 12px rgba(0,86,210,.09);}
.mcard:active{transform:scale(.97);}

/* ══════════════════════════
   ROADMAP + SKILLS CARDS
══════════════════════════ */
.rw{
  background:${C.surface};border:1.5px solid ${C.border};
  border-radius:10px;padding:11px 12px;margin-bottom:7px;
  cursor:pointer;transition:border-color .13s;
}
.rw.op{border-color:${C.blue};}
.sb-track{height:5px;border-radius:100px;background:${C.border};overflow:hidden;margin-top:3px;}
.sb-fill{height:100%;border-radius:100px;transition:width .7s ease;}

/* ══════════════════════════
   MISC
══════════════════════════ */
.sl{font-size:10px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.8px;margin-bottom:5px;}
.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:10.5px;font-weight:700;}
.skel{
  background:linear-gradient(90deg,${C.border} 25%,#eef1f6 50%,${C.border} 75%);
  background-size:200% 100%;animation:shimmer 1.6s infinite;border-radius:7px;
}
/* delete confirm */
.del-confirm{
  background:${C.redLight};border:1.5px solid #FECACA;
  border-radius:9px;padding:10px 12px;margin:4px 5px;
  display:flex;align-items:center;gap:8px;flex-wrap:wrap;
}
`;

// ─── API ──────────────────────────────────────────────────────────────────────
async function callGroq(messages, onWord) {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/grok-proxy`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ messages }),
    }
  );
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data  = await res.json();
  const reply = data?.choices?.[0]?.message?.content || '';
  if (onWord && reply) {
    const words = reply.split(' ');
    let built = '';
    for (const w of words) {
      built += (built ? ' ' : '') + w;
      onWord(built);
      await new Promise(r => setTimeout(r, 14));
    }
  }
  return reply;
}

// ─── System prompts ───────────────────────────────────────────────────────────
const SYS = {
  chat:       p => `You are AIDLA Career Counselor, an elite AI career advisor. Be warm, professional, concise, and actionable. Use **bold** for key points and bullet lists for clarity. Keep responses focused and mobile-friendly (not too long).${p ? ` User: ${p.full_name}, ${p.profession || ''}, ${p.educational_level || ''}, ${p.city || ''}.` : ''}`,
  roadmap:    p => `You are AIDLA Career Counselor. Generate a week-by-week roadmap as PURE JSON ONLY — absolutely no text before or after the JSON. Format: {"title":"...","duration":"X weeks","goal":"...","weeks":[{"week":1,"theme":"...","tasks":["..."],"resources":["..."],"milestone":"..."}]}${p ? ` For: ${p.full_name}, ${p.profession}.` : ''}`,
  skills:     p => `You are AIDLA Career Counselor. Respond ONLY in pure JSON, no other text: {"current_level":"...","target_role":"...","match_percent":65,"strong_skills":[{"skill":"...","level":80}],"gap_skills":[{"skill":"...","priority":"high","time_to_learn":"2 weeks"}],"top_courses":["..."]}${p ? ` For: ${p.full_name}.` : ''}`,
  interview:  p => `You are AIDLA Career Counselor acting as expert interview coach. Ask ONE realistic interview question at a time. After each answer give brief feedback (2-3 sentences: strengths + improvement) then ask the next question. Be warm and encouraging.${p ? ` Candidate: ${p.full_name}, ${p.profession}.` : ''}`,
  resume:     p => `You are AIDLA Career Counselor specializing in CV/resume review. Provide specific ATS-optimized feedback with before/after examples. If a document was uploaded and you see raw text, analyze it fully. If the user attached an image instead of a PDF, kindly tell them: "I can see your image but I'm a text-based AI — I can't extract text from images. Please either: (1) upload it as a PDF, or (2) copy-paste the text directly here."${p ? ` For: ${p.full_name}.` : ''}`,
  university: ()  => `You are AIDLA Career Counselor specializing in global education guidance. Help find the best universities, programs, admission requirements, costs, and scholarships. Use comparison format when listing multiple options. Be specific and practical.`,
  salary:     p => `You are AIDLA Career Counselor providing salary intelligence. Give precise benchmarks by location, experience, and company size. Include specific negotiation tactics and scripts.${p ? ` User in: ${p.city}, ${p.country}. Role: ${p.profession}.` : ''}`,
};

const CHIPS = {
  chat:       ['What career suits me?', 'How to switch careers?', 'Top skills for 2025', 'Get promoted fast', 'Best remote careers'],
  roadmap:    ['Become Full Stack Dev', 'Break into Data Science', 'Transition to Product', 'Digital Marketing path', 'Cybersecurity career'],
  skills:     ['Assess for Software Eng', 'Gap for Data Analyst', 'UX Design readiness', 'AI/ML Engineer path'],
  interview:  ['Software Engineer mock', 'HR behavioral Qs', 'Senior Manager prep', 'Technical interview'],
  resume:     ['Review my summary', 'Improve work section', 'ATS optimization tips', 'LinkedIn profile help'],
  university: ['Best CS unis in USA', 'MBA programs in UK', 'Affordable engineering', 'International scholarships'],
  salary:     ['Software eng in Dubai', 'Negotiate 30% raise', 'Freelance vs full-time', 'Highest paying tech jobs'],
};

const MODES = [
  { key: 'chat',       icon: '💬', label: 'Career Chat',  short: 'Chat'      },
  { key: 'roadmap',    icon: '🗺️', label: 'Roadmap',      short: 'Roadmap'   },
  { key: 'skills',     icon: '⚡', label: 'Skills Gap',   short: 'Skills'    },
  { key: 'interview',  icon: '🎯', label: 'Interview',    short: 'Interview' },
  { key: 'resume',     icon: '📄', label: 'Resume',       short: 'Resume'    },
  { key: 'university', icon: '🎓', label: 'Universities', short: 'Uni'       },
  { key: 'salary',     icon: '💰', label: 'Salary Intel', short: 'Salary'    },
];

// ─── File helpers ─────────────────────────────────────────────────────────────
const readBase64 = f => new Promise((res, rej) => {
  const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f);
});
const readText = f => new Promise((res, rej) => {
  const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsText(f);
});
const fmtSz = b => b < 1024 ? `${b}B` : b < 1048576 ? `${(b / 1024).toFixed(0)}KB` : `${(b / 1048576).toFixed(1)}MB`;
const isImg = f => f.type.startsWith('image/');

// ─── PDF.js text extractor ────────────────────────────────────────────────────
const extractPdfText = async (file) => {
  try {
    if (!window.pdfjsLib) {
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    const ab  = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: ab }).promise;
    let text = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 12); i++) {
      const page    = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(s => s.str).join(' ') + '\n';
    }
    return text.trim() || '[PDF has no extractable text — may be a scanned image]';
  } catch (e) {
    return `[Could not read PDF: ${e.message}]`;
  }
};

// ─── Markdown → HTML ──────────────────────────────────────────────────────────
function md(t) {
  if (!t) return '';
  return t
    .replace(/\*\*(.+?)\*\*/g,  '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,      '<em>$1</em>')
    .replace(/`(.+?)`/g,        '<code>$1</code>')
    .replace(/^#### (.+)$/gm,   '<h4>$1</h4>')
    .replace(/^### (.+)$/gm,    '<h3>$1</h3>')
    .replace(/^---$/gm,         '<hr/>')
    .replace(/^- (.+)$/gm,      '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, m => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm,  '<li>$1</li>')
    .replace(/\n\n/g,            '</p><p>')
    .replace(/\n/g,              '<br/>');
}

// ─── Tiny components ──────────────────────────────────────────────────────────
const Spin = ({ s = 17, c = '#fff' }) => (
  <div style={{ width: s, height: s, border: `2.5px solid rgba(255,255,255,.25)`, borderTopColor: c, borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
);

// ─── Roadmap card ─────────────────────────────────────────────────────────────
function RoadmapCard({ data }) {
  const [open, setOpen] = useState(0);
  if (!data?.weeks?.length) return null;
  return (
    <div className="fu" style={{ marginTop: 6 }}>
      <div style={{ background: C.blueLight, borderRadius: 11, padding: '12px 13px', marginBottom: 9, border: `1.5px solid ${C.blueMid}` }}>
        <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 300, fontSize: 16, color: C.ink, marginBottom: 3 }}>{data.title}</div>
        <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 9 }}>{data.goal}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: C.surface, color: C.blue }}>📅 {data.duration}</span>
          <span className="badge" style={{ background: C.successBg, color: C.success }}>🎯 {data.weeks.length} milestones</span>
        </div>
      </div>
      {data.weeks.map((w, i) => (
        <div key={i} className={`rw${open === i ? ' op' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: open === i ? C.blue : C.blueLight, color: open === i ? '#fff' : C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 10, flexShrink: 0 }}>W{w.week}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: C.ink }}>{w.theme}</div>
              <div style={{ fontSize: 11, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🏆 {w.milestone}</div>
            </div>
            <span style={{ color: C.muted, fontSize: 13, transition: 'transform .2s', transform: open === i ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
          </div>
          {open === i && (
            <div className="fu" style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
                <div>
                  <div className="sl">Tasks</div>
                  {w.tasks?.map((t, j) => (
                    <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                      <span style={{ color: C.success, flexShrink: 0, fontSize: 11 }}>✓</span>
                      <span style={{ fontSize: 12, color: C.slate }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="sl">Resources</div>
                  {w.resources?.map((r, j) => (
                    <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                      <span style={{ color: C.blue, flexShrink: 0, fontSize: 11 }}>📖</span>
                      <span style={{ fontSize: 12, color: C.slate }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Skills card ──────────────────────────────────────────────────────────────
function SkillsCard({ data }) {
  if (!data?.gap_skills) return null;
  const pc = { high: C.red, medium: C.amber, low: C.success };
  return (
    <div className="fu" style={{ marginTop: 6 }}>
      <div style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 11, padding: 13, marginBottom: 9 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{data.target_role}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>Level: <strong style={{ color: C.ink }}>{data.current_level}</strong></div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: data.match_percent >= 70 ? C.success : data.match_percent >= 40 ? C.amber : C.red, lineHeight: 1 }}>{data.match_percent}%</div>
            <div style={{ fontSize: 10, color: C.muted }}>Match</div>
          </div>
        </div>
        <div className="sb-track">
          <div className="sb-fill" style={{ width: `${data.match_percent}%`, background: data.match_percent >= 70 ? C.success : data.match_percent >= 40 ? C.amber : C.red }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 8, marginBottom: 9 }}>
        <div style={{ background: C.successBg, borderRadius: 10, padding: 11, border: '1.5px solid #A7F3D0' }}>
          <div className="sl" style={{ color: C.success }}>✓ Strong Skills</div>
          {data.strong_skills?.map((s, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 2 }}>
                <span>{s.skill}</span><span style={{ color: C.success }}>{s.level}%</span>
              </div>
              <div className="sb-track" style={{ background: '#D1FAE5' }}>
                <div className="sb-fill" style={{ width: `${s.level}%`, background: C.success }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: '#FFFBEB', borderRadius: 10, padding: 11, border: '1.5px solid #FDE68A' }}>
          <div className="sl" style={{ color: C.amber }}>⚡ To Learn</div>
          {data.gap_skills?.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7, gap: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{s.skill}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <span className="badge" style={{ background: `${pc[s.priority]}18`, color: pc[s.priority], fontSize: 9.5 }}>{s.priority}</span>
                <span style={{ fontSize: 10, color: C.muted }}>{s.time_to_learn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {data.top_courses?.length > 0 && (
        <div style={{ background: C.blueLight, borderRadius: 10, padding: 11, border: `1.5px solid ${C.blueMid}` }}>
          <div className="sl">📚 Recommended</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {data.top_courses.map((c, i) => (
              <span key={i} style={{ fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: C.surface, color: C.blue, border: `1.5px solid ${C.blueMid}` }}>{c}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Learning() {
  const [user, setUser]         = useState(null);
  const [profile, setProfile]   = useState(null);
  const [mode, setMode]         = useState('chat');
  const [msgs, setMsgs]         = useState([]);
  const [input, setInput]       = useState('');
  const [busy, setBusy]         = useState(false);
  const [stream, setStream]     = useState('');
  const [history, setHistory]   = useState([]);
  const [sid, setSid]           = useState(null);
  const [drawer, setDrawer]     = useState(false);
  const [structured, setStruct] = useState(null);
  const [booting, setBooting]   = useState(true);
  const [files, setFiles]       = useState([]);
  const [delConfirm, setDelConf]= useState(null); // id to confirm delete

  const bottomRef = useRef(null);
  const taRef     = useRef(null);
  const fileRef   = useRef(null);
  const imgRef    = useRef(null);

  // ── Boot ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { setBooting(false); return; }
      setUser(data.user);
      supabase.from('users_profiles').select('*').eq('user_id', data.user.id).single()
        .then(({ data: p }) => { if (p) setProfile(p); });
      loadHist(data.user.id);
      setBooting(false);
    });
  }, []);

  // ── Scroll ────────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, stream]);

  // ── Textarea resize ───────────────────────────────────────────────────────
  useEffect(() => {
    const ta = taRef.current; if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 110) + 'px';
  }, [input]);

  // ── Close drawer on resize ────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setDrawer(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // ── Lock parent scrolling container so shell fills height ─────────────────
  useEffect(() => {
    // Target the router outlet that wraps page content
    const targets = [
      document.querySelector('.ul-outlet'),
      document.querySelector('.ul-main'),
      document.querySelector('main'),
    ].filter(Boolean);
    const saved = targets.map(el => ({ el, overflow: el.style.overflow, height: el.style.height }));
    targets.forEach(el => { el.style.overflow = 'hidden'; el.style.height = '100%'; });
    return () => saved.forEach(({ el, overflow, height }) => { el.style.overflow = overflow; el.style.height = height; });
  }, []);

  // ── History ───────────────────────────────────────────────────────────────
  const loadHist = async (uid) => {
    const { data } = await supabase.from('career_counselor_sessions')
      .select('id,title,mode,created_at')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(50);
    setHistory(data || []);
  };

  // ── Delete session ────────────────────────────────────────────────────────
  const deleteSession = async (id) => {
    await supabase.from('career_counselor_sessions').delete().eq('id', id);
    setHistory(p => p.filter(h => h.id !== id));
    if (sid === id) { newSession(); }
    setDelConf(null);
  };

  // ── New session ───────────────────────────────────────────────────────────
  const newSession = useCallback(() => {
    setMsgs([]); setStruct(null); setSid(null);
    setStream(''); setFiles([]); setDelConf(null);
    setTimeout(() => taRef.current?.focus(), 80);
  }, []);

  // ── Save session ──────────────────────────────────────────────────────────
  const saveSess = async (allMsgs, currentSid, firstMsg) => {
    if (!user) return currentSid;
    const title = (firstMsg || 'New session').slice(0, 55);
    if (currentSid) {
      await supabase.from('career_counselor_sessions')
        .update({ messages: allMsgs, updated_at: new Date() }).eq('id', currentSid);
      return currentSid;
    }
    const { data } = await supabase.from('career_counselor_sessions')
      .insert([{ user_id: user.id, title, mode, messages: allMsgs }]).select().single();
    if (data) { loadHist(user.id); return data.id; }
    return null;
  };

  // ── File handling ─────────────────────────────────────────────────────────
  const addFiles = async (fileList) => {
    const next = [];
    for (const f of Array.from(fileList)) {
      if (f.size > 10 * 1024 * 1024) { alert(`${f.name} exceeds 10MB`); continue; }
      const entry = { file: f, name: f.name, size: fmtSz(f.size), type: f.type };
      if (isImg(f)) {
        entry.preview = await readBase64(f);
      } else if (f.type === 'application/pdf') {
        entry.text = await extractPdfText(f);
      } else {
        try { entry.text = await readText(f); } catch { entry.text = `[${f.name}]`; }
      }
      next.push(entry);
    }
    setFiles(p => [...p, ...next].slice(0, 5));
  };

  const removeFile = (i) => setFiles(p => p.filter((_, j) => j !== i));

  // ── Send ──────────────────────────────────────────────────────────────────
  const send = async (override) => {
    const text = (override || input).trim();
    if ((!text && files.length === 0) || busy) return;
    setInput(''); setBusy(true); setStream(''); setStruct(null);

    const uFiles = files.map(f => ({ name: f.name, preview: f.preview || null, type: f.type }));
    const uMsg   = { role: 'user', content: text, files: uFiles.length ? uFiles : undefined };
    const newMsgs = [...msgs, uMsg];
    setMsgs(newMsgs);

    // Build prompt with file content
    let prompt = text;
    if (files.length > 0) {
      prompt += files.map(f => {
        if (f.text)    return `\n\n[Attached document: ${f.name}]\n${f.text.slice(0, 4500)}`;
        if (f.preview) return `\n\n[User attached an image named: ${f.name}. You CANNOT see this image as you are a text-based AI. Tell the user politely that you cannot read images directly, and ask them to either upload as PDF or copy-paste the text content.]`;
        return '';
      }).join('');
    }
    setFiles([]);

    try {
      const sys    = SYS[mode]?.(profile) || SYS.chat(profile);
      const histMsgs = newMsgs.slice(-16).map(m => ({ role: m.role, content: m.content }));
      histMsgs[histMsgs.length - 1].content = prompt || text;
      const apiMsgs = [{ role: 'system', content: sys }, ...histMsgs];

      let reply = '';
      await callGroq(apiMsgs, p => { reply = p; setStream(p); });

      if (['roadmap', 'skills'].includes(mode)) {
        try {
          const match = reply.match(/\{[\s\S]*\}/);
          if (match) setStruct(JSON.parse(match[0]));
        } catch {}
      }

      const aiMsg = { role: 'assistant', content: reply };
      const all   = [...newMsgs, aiMsg];
      setMsgs(all); setStream('');
      const newSid = await saveSess(all, sid, text || files[0]?.name || 'File upload');
      if (!sid && newSid) setSid(newSid);
    } catch (e) {
      setMsgs(p => [...p, { role: 'assistant', content: `⚠️ ${e.message}. Please try again.` }]);
      setStream('');
    }
    setBusy(false);
  };

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 600) {
      e.preventDefault(); send();
    }
  };

  const switchMode = m => { setMode(m); newSession(); setDrawer(false); };
  const loadSess   = item => {
    setMsgs(item.messages || []); setMode(item.mode || 'chat');
    setSid(item.id); setStruct(null); setDrawer(false); setDelConf(null);
  };
  const cur = MODES.find(m => m.key === mode);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="shell">

        {/* Overlay */}
        <div className={`ov${drawer ? ' show' : ''}`} onClick={() => setDrawer(false)} />

        {/* ══ SIDEBAR ══ */}
        <aside className={`sb${drawer ? ' open' : ''}`}>

          {/* Header */}
          <div className="sb-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>🎓</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: C.ink, lineHeight: 1 }}>AIDLA</div>
                <div style={{ fontSize: 9.5, color: C.muted, fontWeight: 500 }}>Career Counselor</div>
              </div>
              <button onClick={() => setDrawer(false)} style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 7, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.muted, fontSize: 15 }}>✕</button>
            </div>
            <button onClick={newSession} style={{ width: '100%', padding: '9px 0', background: C.blue, color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', boxShadow: `0 2px 8px rgba(0,86,210,.22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              + New Session
            </button>
          </div>

          {/* Profile snippet */}
          {profile && (
            <div className="sb-profile">
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.blueLight, border: `2px solid ${C.blueMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {profile.avatar_url
                  ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  : <span style={{ fontSize: 13 }}>👤</span>}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.full_name}</div>
                <div style={{ fontSize: 10.5, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.profession || 'Set your profession'}</div>
              </div>
            </div>
          )}

          {/* History */}
          <div className="sb-list">
            {booting ? (
              [1, 2, 3].map(i => <div key={i} className="skel" style={{ height: 48, margin: '0 4px 5px' }} />)
            ) : history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0', color: C.muted, fontSize: 12.5 }}>
                <div style={{ fontSize: 26, marginBottom: 7 }}>💬</div>No sessions yet
              </div>
            ) : (
              <>
                <div className="sl" style={{ padding: '6px 8px 4px' }}>Recent Sessions</div>
                {history.map(h => (
                  <div key={h.id}>
                    {/* Delete confirmation inline */}
                    {delConfirm === h.id ? (
                      <div className="del-confirm">
                        <span style={{ fontSize: 12, color: C.red, fontWeight: 600, flex: 1 }}>Delete this session?</span>
                        <button onClick={() => deleteSession(h.id)} style={{ padding: '4px 10px', background: C.red, color: '#fff', border: 'none', borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                        <button onClick={() => setDelConf(null)} style={{ padding: '4px 10px', background: C.bg, color: C.slate, border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                      </div>
                    ) : (
                      <div className="hi" onClick={() => loadSess(h)}>
                        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{MODES.find(m => m.key === h.mode)?.icon || '💬'}</span>
                        <div className="hi-text">
                          <div style={{ fontSize: 12, fontWeight: 600, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</div>
                          <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>{h.mode} · {new Date(h.created_at).toLocaleDateString()}</div>
                        </div>
                        <button
                          className="hi-del"
                          onClick={e => { e.stopPropagation(); setDelConf(h.id); }}
                          aria-label="Delete session"
                          title="Delete"
                        >🗑️</button>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <div className="main">

          {/* Top bar */}
          <div className="topbar">
            <button
              onClick={() => setDrawer(true)}
              style={{ width: 36, height: 36, border: `1.5px solid ${C.border}`, borderRadius: 9, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0, cursor: 'pointer' }}
              aria-label="Open menu"
            >☰</button>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{cur?.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 300, fontSize: 14.5, color: C.ink, letterSpacing: '-.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {cur?.label}
              </div>
              {profile && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>
                  Hi {profile.full_name?.split(' ')[0]} 👋
                </div>
              )}
            </div>
            <button
              onClick={newSession}
              style={{ background: C.blueLight, color: C.blue, border: `1.5px solid ${C.blueMid}`, borderRadius: 8, padding: '6px 10px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
            >+ New</button>
          </div>

          {/* Mode tabs — fully scrollable, no overflow cut */}
          <div className="tabs" role="tablist">
            {MODES.map(m => (
              <button
                key={m.key}
                role="tab"
                aria-selected={mode === m.key}
                className={`tab${mode === m.key ? ' on' : ''}`}
                onClick={() => switchMode(m.key)}
              >
                <span>{m.icon}</span>
                <span>{m.short}</span>
              </button>
            ))}
          </div>

          {/* Chat area */}
          <div className="chat" role="log" aria-live="polite">
            <div className="chat-in">

              {/* Welcome */}
              {msgs.length === 0 && !busy && (
                <div className="wlc fi">
                  {/* Hero card */}
                  <div className="hero">
                    <div className="hero-ic">{cur?.icon}</div>
                    <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 300, fontSize: 'clamp(16px,4.5vw,22px)', color: C.ink, letterSpacing: '-.02em', marginBottom: 7 }}>
                      {cur?.label}
                    </h2>
                    <p style={{ fontSize: 13, color: C.slate, lineHeight: 1.7, maxWidth: 340, margin: '0 auto' }}>
                      {mode === 'chat'       && 'Your personal AI career advisor. Ask anything about career paths, skills, and professional growth.'}
                      {mode === 'roadmap'    && 'Get a personalized week-by-week roadmap tailored to your goals and current level.'}
                      {mode === 'skills'     && 'Discover exactly what skills gap stands between you and your dream role.'}
                      {mode === 'interview'  && 'Practice with realistic mock interviews and get instant expert coaching feedback.'}
                      {mode === 'resume'     && 'Upload your CV (PDF) for expert ATS-optimized feedback with specific improvements.'}
                      {mode === 'university' && 'Find the best universities, programs, costs, and scholarships worldwide.'}
                      {mode === 'salary'     && 'Get precise salary benchmarks and powerful negotiation strategies for your role.'}
                    </p>
                    {profile && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 11, background: C.blueLight, border: `1.5px solid ${C.blueMid}`, borderRadius: 20, padding: '4px 12px', fontSize: 11.5, color: C.blue, fontWeight: 600 }}>
                        ✓ {profile.full_name}
                      </div>
                    )}
                  </div>

                  {/* Mode cards (chat only) */}
                  {mode === 'chat' && (
                    <>
                      <div className="sl" style={{ marginBottom: 7 }}>What can I help with?</div>
                      <div className="mgrid">
                        {MODES.filter(m => m.key !== 'chat').map(m => (
                          <div key={m.key} className="mcard" onClick={() => switchMode(m.key)}>
                            <span style={{ fontSize: 20 }}>{m.icon}</span>
                            <div style={{ fontWeight: 700, fontSize: 11.5, color: C.ink }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Suggestion chips */}
                  <div className="sl" style={{ marginBottom: 7 }}>Try asking…</div>
                  <div className="chips">
                    {CHIPS[mode]?.map((c, i) => (
                      <button key={i} className="chip" onClick={() => send(c)}>{c}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {msgs.map((m, i) => (
                <div key={i} className={`row fu${m.role === 'user' ? ' u' : ''}`}>
                  {m.role === 'assistant' && <div className="av">🎓</div>}
                  <div className={m.role === 'user' ? 'bu' : 'ba'}>
                    {m.role === 'user' ? (
                      <>
                        {m.content && <span>{m.content}</span>}
                        {m.files?.map((f, j) => (
                          <div key={j} style={{ marginTop: m.content ? 6 : 0 }}>
                            {f.preview
                              ? <img src={f.preview} alt={f.name} className="bimg" />
                              : <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, fontSize: 12, opacity: .8 }}>
                                  <span>📎</span><span>{f.name}</span>
                                </div>
                            }
                          </div>
                        ))}
                      </>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: md(m.content) }} />
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="av u" style={{ overflow: 'hidden' }}>
                      {profile?.avatar_url
                        ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }} alt="" />
                        : <span style={{ fontSize: 11 }}>👤</span>}
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming bubble */}
              {stream && (
                <div className="row">
                  <div className="av">🎓</div>
                  <div className="ba">
                    <div dangerouslySetInnerHTML={{ __html: md(stream) + '<span class="cur"></span>' }} />
                  </div>
                </div>
              )}

              {/* Typing dots */}
              {busy && !stream && (
                <div className="row">
                  <div className="av">🎓</div>
                  <div className="ba" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '12px 14px' }}>
                    <div className="d" /><div className="d" /><div className="d" />
                  </div>
                </div>
              )}

              {/* Structured renders */}
              {structured && mode === 'roadmap' && <RoadmapCard data={structured} />}
              {structured && mode === 'skills'  && <SkillsCard  data={structured} />}

              {/* Follow-up chips */}
              {msgs.length > 0 && msgs.length < 5 && !busy && (
                <div className="chips" style={{ paddingTop: 2 }}>
                  {CHIPS[mode]?.slice(0, 3).map((c, i) => (
                    <button key={i} className="chip" onClick={() => send(c)}>{c}</button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} style={{ height: 4 }} />
            </div>
          </div>

          {/* ══ INPUT BAR ══ */}
          <div className="ibar">
            <div className="ibar-in">

              {/* File previews */}
              {files.length > 0 && (
                <div className="fstrip">
                  {files.map((f, i) => (
                    <div key={i} className="fchip">
                      {f.preview
                        ? <img src={f.preview} className="ithumb" alt={f.name} />
                        : <span style={{ fontSize: 14 }}>{f.type === 'application/pdf' ? '📄' : '📎'}</span>
                      }
                      <span className="fchip-n">{f.name}</span>
                      <span style={{ fontSize: 9.5, color: C.muted, flexShrink: 0 }}>{f.size}</span>
                      <button className="fchip-rm" onClick={() => removeFile(i)} aria-label="Remove">✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input row */}
              <div className="irow">
                <button className="abtn" title="Upload image" onClick={() => imgRef.current?.click()} aria-label="Upload image">🖼️</button>
                <button className="abtn" title="Upload document" onClick={() => fileRef.current?.click()} aria-label="Upload document">📎</button>

                <input ref={imgRef}  type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt,.csv,.md,.rtf" multiple style={{ display: 'none' }} onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />

                <textarea
                  ref={taRef}
                  className="ta"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  rows={1}
                  disabled={busy}
                  aria-label="Type your message"
                  placeholder={
                    mode === 'chat'       ? 'Ask me about your career…' :
                    mode === 'roadmap'    ? 'What career goal? e.g. Become a Data Scientist' :
                    mode === 'skills'     ? 'Target role + your background…' :
                    mode === 'interview'  ? 'What role are you interviewing for?' :
                    mode === 'resume'     ? 'Upload CV as PDF 📎 or paste text here…' :
                    mode === 'university' ? 'Field + country you are interested in…' :
                    'Role + location for salary data…'
                  }
                />

                <button
                  className="sbtn"
                  onClick={() => send()}
                  disabled={(!input.trim() && files.length === 0) || busy}
                  aria-label="Send"
                >
                  {busy ? <Spin s={16} c="#fff" /> : '↑'}
                </button>
              </div>

              <div className="hint">
                <span>{window.innerWidth > 600 ? 'Enter to send · Shift+Enter for newline' : 'Tap ↑ to send'}</span>
                <span>PDF, images, docs · AIDLA AI</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}