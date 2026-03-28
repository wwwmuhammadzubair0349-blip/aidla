// ══════════════════════════════════════════════════════════════
//  AutoTube Studio v5 ULTRA — by AIDLA
//  Fully Universal · Mobile-First · Fully Automated YouTube API
// ══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function callAutotube(tool, input) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/autotube`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ tool, input }),
  });
  const data = await res.json();
  if (!data?.ok) throw new Error(data?.error || "Generation failed");
  return data.result;
}

function useCopy() {
  const [copied, setCopied] = useState("");
  const copy = async (text, id) => {
    try { await navigator.clipboard.writeText(text); }
    catch { const el = document.createElement("textarea"); el.value = text; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(id); setTimeout(() => setCopied(""), 2200);
  };
  return { copied, copy };
}

const C = {
  navy: "#0b1437", royal: "#1a3a8f", sky: "#3b82f6",
  gold: "#f59e0b", goldL: "#fcd34d", slate: "#64748b",
  white: "#ffffff", cardBg: "rgba(255,255,255,0.97)",
  shadow: "0 2px 12px rgba(11,20,55,0.07)",
  shadowM: "0 4px 20px rgba(11,20,55,0.10)",
  r: "12px", rL: "16px",
};

const TOOLS =[
  { id: "quick_generator",  icon: "⚡", label: "Quick Generator",   sub: "Titles · Desc · Tags",      color: C.sky,     glow: "rgba(59,130,246,0.15)" },
  { id: "full_video_az",    icon: "🎬", label: "Full Video A–Z",    sub: "Script · SEO · Checklist",  color: "#ef4444", glow: "rgba(239,68,68,0.15)"  },
  { id: "content_calendar", icon: "📅", label: "Content Calendar",  sub: "30-Day Plan",               color: C.royal,   glow: "rgba(26,58,143,0.15)"  },
  { id: "idea_to_video",    icon: "💡", label: "Idea → Video",      sub: "Complete Package",          color: C.gold,    glow: "rgba(245,158,11,0.15)" },
  { id: "title_optimizer",  icon: "🔤", label: "Title Optimizer",   sub: "A/B · CTR Boost",           color: "#06b6d4", glow: "rgba(6,182,212,0.15)"  },
  { id: "comment_replier",  icon: "💬", label: "Comment Replier",   sub: "3 Reply Styles",            color: "#10b981", glow: "rgba(16,185,129,0.15)" },
  { id: "niche_analyzer",   icon: "📊", label: "Niche Analyzer",    sub: "Deep Market Intel",         color: "#f97316", glow: "rgba(249,115,22,0.15)" },
  { id: "youtube_shorts",   icon: "🩳", label: "YT Shorts",         sub: "60-sec · Captions",         color: "#ec4899", glow: "rgba(236,72,153,0.15)" },
  { id: "competitor_spy",   icon: "🕵️", label: "Competitor Spy",   sub: "URL · Title · Channel",     color: "#8b5cf6", glow: "rgba(139,92,246,0.15)" },
  { id: "hook_library",     icon: "🔥", label: "Hook Library",      sub: "50+ Proven Hooks",          color: "#ef4444", glow: "rgba(239,68,68,0.15)"  },
  { id: "multilang_batch",  icon: "🌍", label: "Multi-Language",    sub: "EN + Urdu + Arabic",        color: "#059669", glow: "rgba(5,150,105,0.15)"  },
  { id: "next_boom",        icon: "🚀", label: "Next Boom",         sub: "Pattern → Viral",           color: C.gold,    glow: "rgba(245,158,11,0.15)" },
  { id: "trending_radar",   icon: "📡", label: "Trending Radar",    sub: "10 Hot Topics",             color: "#ef4444", glow: "rgba(239,68,68,0.15)"  },
  { id: "channel_audit",    icon: "🏆", label: "Channel Audit",     sub: "Score Your Strategy",       color: C.royal,   glow: "rgba(26,58,143,0.15)"  },
];

const HOOK_CATEGORIES =[
  { label: "😱 Shock",    hooks:["99% of people don't know this about {topic}...", "I can't believe nobody talks about {topic}", "This will change how you think about {topic}", "The truth about {topic} that experts hide", "Warning: Stop doing {topic} this way immediately"] },
  { label: "❓ Question", hooks:["What if everything you know about {topic} is wrong?", "Why does {topic} never work for you?", "What would you do if you knew the secret to {topic}?", "Is {topic} worth your time? Here's the real answer.", "Why do 95% of people fail at {topic}?"] },
  { label: "📊 Stat",     hooks:["In 30 days of {topic} I went from 0 to 100K", "This one {topic} trick increased my results by 340%", "I tested {topic} for 90 days — the results shocked me.", "After analysing 500 {topic} cases, I found the pattern", "3 years ago I knew nothing about {topic} — here's what changed"] },
  { label: "🚨 Urgency",  hooks:["You need to stop doing {topic} this way — right now", "Don't learn {topic} the old way — it's dying", "Everyone doing {topic} the wrong way is getting left behind", "The {topic} strategy that's about to die — use it now", "Last chance to understand {topic} before it's too late"] },
  { label: "🎭 Story",    hooks:["3 years ago I was broke, then I discovered {topic}...", "I almost quit {topic} forever. Then this happened.", "My biggest {topic} failure taught me this lesson", "Nobody believed I could {topic} — until I did this", "The day everything changed for me with {topic}"] },
  { label: "🔄 Myth-Bust",hooks:["Everything you've been told about {topic} is wrong", "The {topic} advice that's actually destroying you", "Stop following this {topic} advice — it doesn't work", "I believed the {topic} myth for 2 years. Here's reality.", "Unpopular opinion: {topic} doesn't work the way you think"] },
  { label: "💰 Result",   hooks:["This one {topic} change made me $10,000 in 30 days", "How I grew from 0 to 100K using just {topic}", "Copy my {topic} formula — it's working right now", "I used {topic} to quit my job. Here's how.", "The exact {topic} system that generated 1 million views"] },
  { label: "🇵🇰 Urdu",   hooks:["Pakistani students: {topic} ka ye secret koi nahi batata", "Pakistan mein {topic} se paise kamane ka sahi tarika", "Ye {topic} ka tarika Pakistan mein bilkul kaam karta hai", "Zero investment se {topic} kaise start karein Pakistan mein", "{topic} seekhne ka sabse aasan tarika — Urdu mein"] },
];

/* ── Tiny helpers ─────────────────────────────────────────── */
function ScoreRing({ score, size = 64 }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const c = score >= 85 ? "#10b981" : score >= 65 ? C.gold : "#ef4444";
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(11,20,55,0.08)" strokeWidth={5}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 1s ease" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:size>60?15:11, fontWeight:900, color:C.navy, lineHeight:1 }}>{score}</span>
        <span style={{ fontSize:7, color:C.slate, fontWeight:700 }}>SCORE</span>
      </div>
    </div>
  );
}

function ScoreBar({ score, label }) {
  const c = score >= 85 ? "#10b981" : score >= 65 ? C.gold : "#ef4444";
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, fontWeight:700, marginBottom:3 }}>
        <span style={{ color:C.slate }}>{label}</span>
        <span style={{ color:c }}>{score}/100</span>
      </div>
      <div style={{ height:4, background:"rgba(11,20,55,0.07)", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${score}%`, background:`linear-gradient(90deg,${c}88,${c})`, borderRadius:99, transition:"width 0.8s ease" }}/>
      </div>
    </div>
  );
}

function TrafficLight({ value, label }) {
  const color = value==="green"||value==="high" ? "#10b981" : value==="yellow"||value==="medium" ? C.gold : "#ef4444";
  const emoji = value==="green"||value==="high" ? "🟢" : value==="yellow"||value==="medium" ? "🟡" : "🔴";
  return (
    <div style={{ padding:"5px 9px", background:"rgba(11,20,55,0.03)", borderRadius:7, border:"1px solid rgba(11,20,55,0.06)", display:"flex", alignItems:"center", gap:5 }}>
      <span style={{ fontSize:12 }}>{emoji}</span>
      <div>
        <div style={{ fontSize:9, color:C.slate, fontWeight:600 }}>{label}</div>
        <div style={{ fontSize:10, fontWeight:800, color }}>{(value||"").toUpperCase()}</div>
      </div>
    </div>
  );
}

function CopyBtn({ text, id, copied, copy, small }) {
  const ok = copied === id;
  return (
    <button onClick={() => copy(text, id)} style={{
      padding: small ? "3px 8px" : "5px 11px", fontSize:10, fontWeight:700,
      border:`1px solid ${ok?"rgba(16,185,129,0.4)":"rgba(11,20,55,0.1)"}`,
      borderRadius:6, cursor:"pointer",
      background: ok ? "rgba(16,185,129,0.08)" : "rgba(11,20,55,0.03)",
      color: ok ? "#059669" : C.slate, whiteSpace:"nowrap",
      display:"flex", alignItems:"center", gap:4, flexShrink:0,
    }}>
      {ok ? "✅" : "📋"} {ok ? "Copied" : "Copy"}
    </button>
  );
}

function Tag({ text, color = C.sky }) {
  return (
    <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", background:`${color}12`, color, border:`1px solid ${color}28`, borderRadius:20, whiteSpace:"nowrap", display:"inline-block" }}>{text}</span>
  );
}

function Inp({ label, value, onChange, placeholder, type="input", rows, hint }) {
  const base = { width:"100%", padding:"8px 11px", border:"1.5px solid rgba(59,130,246,0.15)", borderRadius:8, fontSize:13, color:C.navy, background:"#fafbff", outline:"none", boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif", transition:"border-color 0.15s" };
  return (
    <div style={{ width:"100%" }}>
      {label && <label style={{ fontSize:10, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:"0.07em", display:"block", marginBottom:4 }}>{label}</label>}
      {type==="textarea"
        ? <textarea style={{ ...base, minHeight:rows?rows*22:72, resize:"vertical", lineHeight:1.55 }} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={e=>e.target.style.borderColor=C.sky} onBlur={e=>e.target.style.borderColor="rgba(59,130,246,0.15)"}/>
        : <input style={base} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} onFocus={e=>e.target.style.borderColor=C.sky} onBlur={e=>e.target.style.borderColor="rgba(59,130,246,0.15)"}/>
      }
      {hint && <div style={{ fontSize:10, color:C.slate, marginTop:3, opacity:0.7 }}>{hint}</div>}
    </div>
  );
}

function Skeleton() {
  return (
    <div>
      {[100,75,85,60,90].map((w,i)=>(
        <div key={i} style={{ height:9, background:"rgba(11,20,55,0.05)", borderRadius:5, marginBottom:7, width:`${w}%`, animation:"shimmer 1.5s infinite" }}/>
      ))}
    </div>
  );
}

function RadarChart({ videos }) {
  if (!videos?.length) return null;
  const size = 160, cx=80, cy=80, r=60;
  const metrics =["Views","CTR","Retention","Likes","Comments"];
  const pts = (vals) => metrics.map((_,i)=>{ const a=(i/metrics.length)*Math.PI*2-Math.PI/2,v=(vals[i]||0)/100; return[cx+r*v*Math.cos(a),cy+r*v*Math.sin(a)]; });
  const colors=[C.sky,C.gold,"#10b981"];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow:"visible", maxWidth:"100%" }}>
      {[0.25,0.5,0.75,1].map(l=>(
        <polygon key={l} points={metrics.map((_,i)=>{ const a=(i/metrics.length)*Math.PI*2-Math.PI/2; return `${cx+r*l*Math.cos(a)},${cy+r*l*Math.sin(a)}`; }).join(" ")} fill="none" stroke="rgba(11,20,55,0.07)" strokeWidth={1}/>
      ))}
      {metrics.map((_,i)=>{ const a=(i/metrics.length)*Math.PI*2-Math.PI/2; return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(a)} y2={cy+r*Math.sin(a)} stroke="rgba(11,20,55,0.08)" strokeWidth={1}/>; })}
      {videos.slice(0,3).map((v,vi)=>{ const p=pts(v.scores||[50,50,50,50,50]); return <polygon key={vi} points={p.map(x=>x.join(",")).join(" ")} fill={`${colors[vi]}20`} stroke={colors[vi]} strokeWidth={1.5} strokeLinejoin="round"/>; })}
      {metrics.map((m,i)=>{ const a=(i/metrics.length)*Math.PI*2-Math.PI/2,x=cx+(r+12)*Math.cos(a),y=cy+(r+12)*Math.sin(a); return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={8} fontWeight={700} fill={C.slate}>{m}</text>; })}
    </svg>
  );
}

/* ══ INLINE REFINE PANEL ══════════════ */
function RefinePanel({ sectionTitle, sectionContent, onRegenerate, regenerating, onClose }) {
  const[instruction, setInstruction] = useState("");
  const [tone, setTone] = useState("same");
  const [length, setLength] = useState("same");

  return (
    <div style={{ background:`linear-gradient(135deg,rgba(11,20,55,0.04),rgba(26,58,143,0.04))`, border:`1.5px solid ${C.sky}30`, borderRadius:C.r, padding:"14px", marginTop:8, animation:"fadeUp 0.2s ease" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ fontSize:11, fontWeight:800, color:C.royal }}>✏️ Refine: {sectionTitle}</div>
        <button onClick={onClose} style={{ background:"rgba(11,20,55,0.07)", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:C.slate, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
      </div>
      {sectionContent && (
        <div style={{ fontSize:11, color:C.slate, lineHeight:1.5, background:"rgba(11,20,55,0.03)", border:"1px solid rgba(11,20,55,0.07)", borderRadius:7, padding:"7px 9px", marginBottom:9, maxHeight:60, overflow:"hidden" }}>
          {typeof sectionContent==="string" ? sectionContent.slice(0,120)+"..." : "Current content"}
        </div>
      )}
      <textarea value={instruction} onChange={e=>setInstruction(e.target.value)}
        placeholder="Your instruction... e.g. Make more aggressive, add Urdu phrases, focus on MDCAT students..."
        style={{ width:"100%", padding:"7px 10px", border:"1.5px solid rgba(59,130,246,0.18)", borderRadius:8, fontSize:12, color:C.navy, background:"#fafbff", outline:"none", resize:"vertical", minHeight:60, fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", marginBottom:9 }}
        onFocus={e=>e.target.style.borderColor=C.sky} onBlur={e=>e.target.style.borderColor="rgba(59,130,246,0.18)"}
      />
      <div style={{ display:"flex", gap:8, marginBottom:9, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:140 }}>
          <div style={{ fontSize:9, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Tone</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {["same","professional","casual","funny","urdu","arabic","aggressive"].map(t=>(
              <button key={t} onClick={()=>setTone(t)} style={{ padding:"3px 8px", fontSize:10, fontWeight:700, border:`1px solid ${tone===t?C.sky:"rgba(11,20,55,0.1)"}`, borderRadius:20, cursor:"pointer", background:tone===t?`${C.sky}14`:"transparent", color:tone===t?C.sky:C.slate, transition:"all 0.15s", textTransform:"capitalize" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize:9, fontWeight:700, color:C.slate, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Length</div>
          <div style={{ display:"flex", gap:4 }}>
            {["shorter","same","longer"].map(l=>(
              <button key={l} onClick={()=>setLength(l)} style={{ padding:"3px 8px", fontSize:10, fontWeight:700, border:`1px solid ${length===l?C.royal:"rgba(11,20,55,0.1)"}`, borderRadius:20, cursor:"pointer", background:length===l?`${C.royal}12`:"transparent", color:length===l?C.royal:C.slate, transition:"all 0.15s", textTransform:"capitalize" }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={()=>onRegenerate({instruction,tone,length})} disabled={regenerating}
        style={{ width:"100%", padding:"8px", background:`linear-gradient(135deg,${C.navy},${C.royal})`, color:"#fff", border:"none", borderRadius:8, fontWeight:800, fontSize:12, cursor:regenerating?"not-allowed":"pointer", opacity:regenerating?0.7:1, fontFamily:"'DM Sans',sans-serif" }}>
        {regenerating ? "⏳ Regenerating…" : "🔄 Regenerate This Section"}
      </button>
    </div>
  );
}

/* ══ CARD with inline refine ══════════════════════════════════ */
function Card({ title, icon, accent, children, copyAll, copyId, copied, copy, sectionContent, onRefine }) {
  const[refineOpen, setRefineOpen] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);

  const handleRegen = async (opts) => {
    if (!onRefine) return;
    setRegenLoading(true);
    try {
      await onRefine(opts);
      setRefineOpen(false);
    } finally {
      setRegenLoading(false);
    }
  };

  return (
    <div style={{ background:C.cardBg, border:"1px solid rgba(11,20,55,0.07)", borderRadius:C.r, padding:"clamp(11px,2.5vw,16px)", marginBottom:10, boxShadow:C.shadow, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${accent||C.sky},transparent)`, opacity:0.6 }}/>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:11, flexWrap:"wrap", gap:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {icon && <span style={{ fontSize:13 }}>{icon}</span>}
          <span style={{ fontSize:10, fontWeight:800, color:C.slate, textTransform:"uppercase", letterSpacing:"0.1em" }}>{title}</span>
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {onRefine && (
            <button onClick={()=>setRefineOpen(v=>!v)} style={{ padding:"3px 8px", fontSize:10, fontWeight:700, border:`1px solid ${refineOpen?C.sky+"60":"rgba(11,20,55,0.1)"}`, borderRadius:6, cursor:"pointer", background:refineOpen?`${C.sky}12`:"rgba(11,20,55,0.03)", color:refineOpen?C.sky:C.slate, display:"flex", alignItems:"center", gap:3 }}>
              ✏️ {refineOpen?"Close":"Refine"}
            </button>
          )}
          {copyAll && <CopyBtn text={copyAll} id={copyId} copied={copied} copy={copy} small/>}
        </div>
      </div>
      {children}
      {refineOpen && onRefine && (
        <RefinePanel
          sectionTitle={title}
          sectionContent={sectionContent}
          onRegenerate={handleRegen}
          regenerating={regenLoading}
          onClose={()=>setRefineOpen(false)}
        />
      )}
    </div>
  );
}

/* ══ HOOK LIBRARY MODAL ══════════════════════════════════════ */
function HookModal({ open, onClose, onSelect, topicValue }) {
  const [search, setSearch] = useState("");
  const[tab, setTab] = useState(0);
  if (!open) return null;
  const filtered = search ? HOOK_CATEGORIES.map(c=>({...c,hooks:c.hooks.filter(h=>h.toLowerCase().includes(search.toLowerCase()))})).filter(c=>c.hooks.length) : HOOK_CATEGORIES;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(11,20,55,0.55)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:12, backdropFilter:"blur(4px)" }}>
      <div style={{ background:C.white, borderRadius:C.rL, width:"min(660px,98vw)", maxHeight:"85vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 24px 60px rgba(11,20,55,0.22)" }}>
        <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(11,20,55,0.07)", background:`linear-gradient(135deg,${C.navy},${C.royal})` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>🔥 Hook Library — 50+ Proven Hooks</div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:7, width:28, height:28, cursor:"pointer", color:"rgba(255,255,255,0.7)", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search hooks..."
            style={{ width:"100%", padding:"7px 11px", border:"none", borderRadius:7, fontSize:12, color:C.navy, background:"rgba(255,255,255,0.95)", outline:"none", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box" }}/>
        </div>
        {!search && (
          <div style={{ display:"flex", overflowX:"auto", borderBottom:"1px solid rgba(11,20,55,0.07)", scrollbarWidth:"none" }}>
            {HOOK_CATEGORIES.map((c,i)=>(
              <button key={i} onClick={()=>setTab(i)} style={{ padding:"8px 12px", fontSize:10, fontWeight:700, border:"none", borderBottom:`2px solid ${tab===i?C.sky:"transparent"}`, cursor:"pointer", background:"transparent", color:tab===i?C.sky:C.slate, whiteSpace:"nowrap", flexShrink:0 }}>{c.label}</button>
            ))}
          </div>
        )}
        <div style={{ flex:1, overflow:"auto", padding:"12px 14px" }}>
          {(search?filtered:[HOOK_CATEGORIES[tab]]).map((cat,ci)=>(
            <div key={ci}>
              {search && <div style={{ fontSize:9, fontWeight:800, color:C.slate, textTransform:"uppercase", marginBottom:6, marginTop:ci>0?12:0 }}>{cat.label}</div>}
              {cat.hooks.map((h,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", background:"rgba(11,20,55,0.02)", border:"1px solid rgba(11,20,55,0.06)", borderRadius:8, marginBottom:6, cursor:"pointer" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${C.sky}08`;e.currentTarget.style.borderColor=`${C.sky}28`;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(11,20,55,0.02)";e.currentTarget.style.borderColor="rgba(11,20,55,0.06)";}}>
                  <span style={{ flex:1, fontSize:12, color:C.navy, lineHeight:1.45 }}>{h.replace("{topic}",topicValue||"your topic")}</span>
                  <button onClick={()=>{onSelect(h);onClose();}} style={{ padding:"4px 10px", fontSize:10, fontWeight:700, border:`1px solid ${C.sky}`, borderRadius:6, cursor:"pointer", background:`${C.sky}10`, color:C.sky, flexShrink:0 }}>Use</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function AutoTubeStudio() {
  const navigate = useNavigate();
  const { copied, copy } = useCopy();
  const resultRef = useRef(null);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const[activeTool, setActiveTool] = useState("quick_generator");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [savingName, setSavingName] = useState("");
  const[saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hookOpen, setHookOpen] = useState(false);
  const[renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  // Global AI variables
  const [globalPrompt, setGlobalPrompt] = useState("");
  const [globalExpanded, setGlobalExpanded] = useState(false);
  const[globalTags, setGlobalTags] = useState([]);
  const [language, setLanguage] = useState("");
  const[perToolPrompt, setPerToolPrompt] = useState("");

  // API Automation Context (Global across tools)
  const[spyInput, setSpyInput] = useState(""); // Used for mandatory API inputs (URLs)
  const[spyMode, setSpyMode] = useState("url"); // 'url' or 'channel'
  const[optionalUrl, setOptionalUrl] = useState("");
  const [apiContextOpen, setApiContextOpen] = useState(false);
  const[optMode, setOptMode] = useState("url"); // specific to Title Optimizer

  // Topic/Specific Fields
  const [topic, setTopic] = useState("");
  const [topicPrompt, setTopicPrompt] = useState("");
  const [showTopicPrompt, setShowTopicPrompt] = useState(false);
  const[keywords, setKeywords] = useState("");
  const [audience, setAudience] = useState("");
  const[niche, setNiche] = useState("");
  const [existTitle, setExistTitle] = useState("");
  const [comment, setComment] = useState("");
  const [context, setContext] = useState("");
  const [idea, setIdea] = useState("");
  const [channelSize, setChannelSize] = useState("");
  const [mlTopic, setMlTopic] = useState("");
  const [mlKeywords, setMlKeywords] = useState("");
  const [mlAudience, setMlAudience] = useState("");
  const[radarNiche, setRadarNiche] = useState("");
  const [auditData, setAuditData] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { navigate("/login?redirect=/autotube/studio"); return; }
      setUser(data.user); setAuthLoading(false);
    });
  }, [navigate]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.rpc("autotube_get_history", { p_user_id: user.id });
    setHistory(data || []);
  }, [user]);

  useEffect(() => { if (user) loadHistory(); }, [user, loadHistory]);

  const addGlobalTag = () => {
    if (!globalPrompt.trim()) return;
    setGlobalTags(t => [...t, globalPrompt.trim()]);
    setGlobalPrompt("");
  };

  const resetState = () => {
    setResult(null); setError(""); setSaved(false); setPerToolPrompt(""); 
    setSpyInput(""); setOptionalUrl(""); setApiContextOpen(false);
  };

  const handleSectionRefine = async (sectionKey, currentContent, opts) => {
    try {
      const refined = await callAutotube("refine_section", {
        active_tool: activeTool,
        section_key: sectionKey,
        current_content: currentContent,
        instruction: opts.instruction || "",
        tone: opts.tone || "same",
        length: opts.length || "same",
        language,
        global_prompt:[...globalTags, perToolPrompt, topicPrompt].filter(Boolean).join(". "),
      });
      const newContent = refined?.refined_content !== undefined ? refined.refined_content : refined;
      setResult(prev => {
        if (!prev) return prev;
        return { ...prev, [sectionKey]: newContent };
      });
    } catch (error) {
      console.error("Refine error:", error);
      alert("Failed to refine. Please try again.");
    }
  };

  const handleGenerate = async () => {
    setLoading(true); setError(""); setResult(null); setSaved(false); setProgress(0);
    const tick = setInterval(() => setProgress(p => Math.min(p + Math.random() * 10, 88)), 700);
    try {
      const combinedPrompt =[...globalTags, perToolPrompt, topicPrompt].filter(Boolean).join(". ");
      let inputPayload = { language, global_prompt: combinedPrompt };

      // Unified API URL Resolution
      let finalSpyMode = null;
      let finalSpyInput = null;

      if (activeTool === "competitor_spy") {
        finalSpyMode = spyMode; // url or channel
        finalSpyInput = spyInput;
      } else if (["channel_audit", "next_boom"].includes(activeTool)) {
        finalSpyMode = "channel";
        finalSpyInput = spyInput; // we use spyInput for the channel URL
      } else if (activeTool === "title_optimizer" && optMode === "url") {
        finalSpyMode = "url";
        finalSpyInput = spyInput;
      } else if (optionalUrl) {
        // AI Context optional URL for any other tool
        finalSpyMode = (optionalUrl.includes("@") || optionalUrl.includes("/channel/") || optionalUrl.includes("/c/")) ? "channel" : "url";
        finalSpyInput = optionalUrl;
      }

      if (finalSpyMode && finalSpyInput) {
        inputPayload.spy_mode = finalSpyMode;
        inputPayload.spy_input = finalSpyInput;
      }

      // Appending specific fields based on tool
      if (activeTool==="quick_generator"||activeTool==="full_video_az") inputPayload={...inputPayload,topic,keywords,audience};
      else if (activeTool==="content_calendar") inputPayload={...inputPayload,niche,audience};
      else if (activeTool==="idea_to_video") inputPayload={...inputPayload,idea,audience};
      else if (activeTool==="title_optimizer" && optMode==="manual") inputPayload={...inputPayload,title:existTitle,topic};
      else if (activeTool==="comment_replier") inputPayload={...inputPayload,comment,context};
      else if (activeTool==="niche_analyzer") inputPayload={...inputPayload,niche,channel_size:channelSize};
      else if (activeTool==="youtube_shorts") inputPayload={...inputPayload,topic,audience,niche};
      else if (activeTool==="hook_library") inputPayload={...inputPayload,topic,niche};
      else if (activeTool==="multilang_batch") inputPayload={...inputPayload,topic:mlTopic,keywords:mlKeywords,audience:mlAudience};
      else if (activeTool==="trending_radar") inputPayload={...inputPayload,niche:radarNiche};
      else if (activeTool==="channel_audit") inputPayload={...inputPayload,performance_data:auditData};

      const res = await callAutotube(activeTool, inputPayload);
      clearInterval(tick); setProgress(100);
      
      setTimeout(() => {
        setResult(res);
        const t = TOOLS.find(t=>t.id===activeTool);
        setSavingName(`${t?.label} — ${topic||niche||existTitle||idea||mlTopic||radarNiche||spyInput||"Result"}`);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
      }, 300);
    } catch(e) {
      clearInterval(tick); setProgress(0);
      setError(e.message || "Generation failed. Try again.");
    }
    setTimeout(() => setLoading(false), 400);
  };

  const handleSave = async () => {
    if (!result||!user) return;
    setSaving(true);
    await supabase.rpc("autotube_save_history", { p_user_id:user.id, p_name:savingName, p_tool:activeTool, p_input:{}, p_output:result });
    setSaved(true); setSaving(false); await loadHistory();
  };

  const handleDeleteHistory = async (id) => {
    await supabase.rpc("autotube_delete_history", { p_id:id, p_user_id:user.id });
    await loadHistory();
  };

  const handleRename = async (id) => {
    await supabase.rpc("autotube_rename_history", { p_id:id, p_user_id:user.id, p_name:renameVal });
    setRenamingId(null); setRenameVal(""); await loadHistory();
  };

  const T = TOOLS.find(t=>t.id===activeTool);

  if (authLoading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(160deg,#f0f4ff,#fffbf0,#e8f4fd)", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:10, display:"inline-block", animation:"spin 1s linear infinite" }}>🎬</div>
        <div style={{ color:C.slate, fontSize:13 }}>Loading Studio…</div>
      </div>
    </div>
  );

  /* ── Result renderers ── */
  const renderTitles = () => result?.titles && (
    <Card title="Title Suggestions" icon="🎯" accent={C.sky} copyAll={result.titles.join("\n")} copyId="all-titles" copied={copied} copy={copy} sectionContent={result.titles} onRefine={(opts) => handleSectionRefine("titles", result.titles, opts)}>
      {result.titles.map((t,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 10px", background:"rgba(11,20,55,0.02)", borderRadius:8, marginBottom:6, border:"1px solid rgba(11,20,55,0.05)" }}>
          <span style={{ fontSize:9, fontWeight:900, color:C.slate, minWidth:16 }}>#{i+1}</span>
          <span style={{ flex:1, fontSize:12, fontWeight:600, color:C.navy, lineHeight:1.35, wordBreak:"break-word" }}>{t}</span>
          <span style={{ fontSize:8, color:t.length>70?"#ef4444":C.slate, fontWeight:700, flexShrink:0 }}>{t.length}</span>
          <CopyBtn text={t} id={`title-${i}`} copied={copied} copy={copy} small/>
        </div>
      ))}
    </Card>
  );

  const renderDesc = () => result?.description && (
    <Card title="SEO Description" icon="📝" accent="#10b981" copyAll={result.description} copyId="desc" copied={copied} copy={copy} sectionContent={result.description} onRefine={(opts) => handleSectionRefine("description", result.description, opts)}>
      <div style={{ fontSize:12, color:C.navy, lineHeight:1.7, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{result.description}</div>
    </Card>
  );

  const renderTags = () => result?.tags && (
    <Card title={`Tags (${result.tags.length})`} icon="🏷️" accent="#ef4444" copyAll={result.tags.join(",")} copyId="tags" copied={copied} copy={copy} sectionContent={result.tags} onRefine={(opts) => handleSectionRefine("tags", result.tags, opts)}>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{result.tags.map(t=><Tag key={t} text={t} color="#ef4444"/>)}</div>
    </Card>
  );

  const renderHashtags = () => result?.hashtags && (
    <Card title="Hashtags" icon="#️⃣" accent={C.sky} copyAll={result.hashtags.join(" ")} copyId="hash" copied={copied} copy={copy} sectionContent={result.hashtags} onRefine={(opts) => handleSectionRefine("hashtags", result.hashtags, opts)}>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{result.hashtags.map(h=><Tag key={h} text={h} color={C.sky}/>)}</div>
    </Card>
  );

  const renderSeoScore = () => result?.seo_score && (
    <Card title="SEO Score" icon="📊" accent="#10b981">
      <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <ScoreRing score={result.seo_score}/>
        <div style={{ flex:1, minWidth:140 }}>
          <div style={{ fontSize:12, color:C.slate, lineHeight:1.6, marginBottom:9 }}>
            {result.seo_score>=85?"🟢 Excellent":result.seo_score>=65?"🟡 Good — needs a few tweaks":"🔴 Needs improvement"}
          </div>
          {result.seo_breakdown && Object.entries(result.seo_breakdown).map(([k,v])=>(
            <ScoreBar key={k} score={v} label={k.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}/>
          ))}
        </div>
      </div>
    </Card>
  );

  const renderScript = () => result?.script_sections && (
    <Card title="Full Script" icon="📜" accent={C.royal} copyAll={[result.intro,...(result.script_sections||[]).map(s=>`${s.heading}\n${s.content}`),result.outro].filter(Boolean).join("\n\n")} copyId="full-script" copied={copied} copy={copy} sectionContent={result.script_sections} onRefine={(opts) => handleSectionRefine("script_sections", result.script_sections, opts)}>
      {result.hook && (
        <div style={{ marginBottom:12, paddingBottom:12, borderBottom:"1px solid rgba(11,20,55,0.06)" }}>
          <div style={{ fontSize:9, fontWeight:800, color:"#f59e0b", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>🎣 HOOK</div>
          <div style={{ fontSize:12, color:C.navy, lineHeight:1.7, fontStyle:"italic", borderLeft:`3px solid ${C.gold}`, paddingLeft:9, wordBreak:"break-word" }}>{result.hook}</div>
        </div>
      )}
      {result.intro && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:9, fontWeight:800, color:"#ef4444", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>INTRO</div>
          <pre style={{ fontSize:11, color:C.navy, lineHeight:1.7, whiteSpace:"pre-wrap", fontFamily:"'DM Sans',sans-serif", margin:0, wordBreak:"break-word" }}>{result.intro}</pre>
        </div>
      )}
      {(result.script_sections||[]).map((s,i)=>(
        <div key={i} style={{ marginBottom:12, paddingBottom:12, borderBottom:i<result.script_sections.length-1?"1px solid rgba(11,20,55,0.05)":"none" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7, gap:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, flex:1, minWidth:0 }}>
              <span style={{ width:18, height:18, borderRadius:4, background:`${C.royal}18`, border:`1px solid ${C.royal}28`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:900, color:C.royal, flexShrink:0 }}>{i+1}</span>
              <span style={{ fontSize:12, fontWeight:800, color:C.navy, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.heading}</span>
            </div>
            <CopyBtn text={s.content} id={`sec-${i}`} copied={copied} copy={copy} small/>
          </div>
          <pre style={{ fontSize:11, color:C.slate, lineHeight:1.7, whiteSpace:"pre-wrap", fontFamily:"'DM Sans',sans-serif", margin:0, wordBreak:"break-word" }}>{s.content}</pre>
        </div>
      ))}
      {result.outro && (
        <div>
          <div style={{ fontSize:9, fontWeight:800, color:"#ef4444", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>OUTRO</div>
          <pre style={{ fontSize:11, color:C.navy, lineHeight:1.7, whiteSpace:"pre-wrap", fontFamily:"'DM Sans',sans-serif", margin:0, wordBreak:"break-word" }}>{result.outro}</pre>
        </div>
      )}
    </Card>
  );

  const renderChecklist = () => result?.upload_checklist && (
    <Card title="Upload Checklist" icon="✅" accent="#10b981" sectionContent={result.upload_checklist} onRefine={(opts) => handleSectionRefine("upload_checklist", result.upload_checklist, opts)}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:5 }}>
        {result.upload_checklist.map((item,i)=>(
          <label key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 9px", background:"rgba(11,20,55,0.02)", borderRadius:7, cursor:"pointer", border:"1px solid rgba(11,20,55,0.04)" }}>
            <input type="checkbox" style={{ width:13, height:13, accentColor:"#10b981", flexShrink:0 }}/>
            <span style={{ fontSize:11, color:C.slate, lineHeight:1.4 }}>{item}</span>
          </label>
        ))}
      </div>
    </Card>
  );

  const renderApiContextDropdown = () => (
    <div style={{ marginTop: 10, background: "rgba(11,20,55,0.02)", border: "1px solid rgba(11,20,55,0.06)", borderRadius: 8, padding: "8px 10px" }}>
       <button onClick={()=>setApiContextOpen(!apiContextOpen)} style={{ background: "none", border: "none", width: "100%", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.navy, cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
         <span>🔗 Advanced: Add YouTube Context (Optional)</span>
         <span>{apiContextOpen ? "▼" : "▶"}</span>
       </button>
       {apiContextOpen && (
         <div style={{ marginTop: 10, animation: "fadeUp 0.2s ease" }}>
            <div style={{ fontSize:10, color:C.sky, background:`${C.sky}08`, padding:"7px 10px", borderRadius:7, border:`1px solid ${C.sky}22`, marginBottom: 8 }}>
              ✨ <strong>YouTube API Enabled:</strong> Paste a competitor's Video or Channel URL. The AI will analyze their real data and use it to inspire your generation!
            </div>
            <Inp value={optionalUrl} onChange={setOptionalUrl} placeholder="https://youtube.com/watch?v=... or @channelname" />
         </div>
       )}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{max-width:100vw;overflow-x:hidden;}
        body{background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 60%,#e8f4fd 100%);min-height:100vh;font-family:'DM Sans',sans-serif;}
        ::placeholder{color:rgba(11,20,55,0.28)!important;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:rgba(11,20,55,0.15);border-radius:99px;}
        select,input,textarea,button{font-family:'DM Sans',sans-serif;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .gen-btn:hover:not(:disabled){filter:brightness(1.06);}
        .tool-btn:hover{background:rgba(11,20,55,0.04)!important;}
        .result-wrap{animation:fadeUp 0.3s ease forwards;}
      `}</style>

      <div style={{ minHeight:"100vh", maxWidth:"100vw", overflowX:"hidden", fontFamily:"'DM Sans',sans-serif" }}>

        {/* ── BG orbs ── */}
        <div aria-hidden="true" style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
          <div style={{ position:"absolute", width:"40vw", height:"40vw", maxWidth:320, maxHeight:320, borderRadius:"50%", background:"rgba(59,130,246,0.05)", filter:"blur(60px)", top:-100, left:-100 }}/>
          <div style={{ position:"absolute", width:"35vw", height:"35vw", maxWidth:280, maxHeight:280, borderRadius:"50%", background:"rgba(245,158,11,0.05)", filter:"blur(60px)", bottom:-80, right:-80 }}/>
        </div>

        {/* ── HEADER ── */}
        <header style={{ position:"sticky", top:0, zIndex:100, background:"rgba(255,255,255,0.93)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(11,20,55,0.07)", padding:"0 clamp(10px,3vw,18px)" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
              {/* Hamburger — shows on mobile */}
              <button onClick={()=>setSidebarOpen(v=>!v)} aria-label="Menu"
                style={{ background:"none", border:"1px solid rgba(11,20,55,0.1)", borderRadius:7, padding:"5px 7px", cursor:"pointer", color:C.navy, lineHeight:1, display:"flex", flexDirection:"column", gap:3.5, alignItems:"center", justifyContent:"center", width:34, height:34, flexShrink:0 }}>
                <span style={{ width:16, height:2, background:sidebarOpen?C.sky:C.navy, borderRadius:2, display:"block", transition:"all 0.2s", transform:sidebarOpen?"rotate(45deg) translate(3px,3px)":"none" }}/>
                <span style={{ width:16, height:2, background:sidebarOpen?C.sky:C.navy, borderRadius:2, display:"block", transition:"all 0.2s", opacity:sidebarOpen?0:1 }}/>
                <span style={{ width:16, height:2, background:sidebarOpen?C.sky:C.navy, borderRadius:2, display:"block", transition:"all 0.2s", transform:sidebarOpen?"rotate(-45deg) translate(3px,-3px)":"none" }}/>
              </button>
              <Link to="/user/autotube" style={{ textDecoration:"none", color:C.slate, fontWeight:600, fontSize:11, whiteSpace:"nowrap" }}>← AutoTube</Link>
              <div style={{ width:1, height:16, background:"rgba(11,20,55,0.1)", flexShrink:0 }}/>
              <div style={{ display:"flex", alignItems:"center", gap:7, minWidth:0 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:`linear-gradient(135deg,${C.navy},${C.royal})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>🎬</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:900, color:C.navy, letterSpacing:"-0.01em", whiteSpace:"nowrap" }}>AutoTube <span style={{ color:C.sky }}>Studio</span></div>
                  <div style={{ fontSize:8, color:C.slate, fontWeight:700, letterSpacing:"0.05em" }}>14 AI TOOLS</div>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
              <button onClick={()=>setShowHistory(v=>!v)}
                style={{ padding:"5px 10px", background:showHistory?`${C.sky}12`:"rgba(11,20,55,0.04)", color:showHistory?C.sky:C.slate, border:`1px solid ${showHistory?`${C.sky}35`:"rgba(11,20,55,0.09)"}`, borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                📂
                {history.length>0 && <span style={{ background:`${C.sky}18`, color:C.sky, borderRadius:99, padding:"0px 5px", fontSize:9, fontWeight:800 }}>{history.length}</span>}
              </button>
            </div>
          </div>
        </header>

        {/* ── GLOBAL PROMPT BAR ── */}
        <div style={{ background:`linear-gradient(135deg,${C.navy},${C.royal})`, position:"sticky", top:52, zIndex:99, padding:"0 clamp(10px,3vw,18px)" }}>
          <div style={{ maxWidth:1280, margin:"0 auto" }}>
            <button onClick={()=>setGlobalExpanded(v=>!v)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:7, width:"100%", padding:"8px 0", color:"rgba(255,255,255,0.85)", fontSize:11, fontWeight:700 }}>
              <span style={{ fontSize:12 }}>🧠</span>
              <span>Global AI Instruction</span>
              {globalTags.length>0 && (
                <div style={{ display:"flex", gap:4, flex:1, flexWrap:"wrap", overflow:"hidden" }}>
                  {globalTags.map((t,i)=>(
                    <span key={i} style={{ background:"rgba(255,255,255,0.15)", color:"#fff", borderRadius:20, padding:"1px 7px", fontSize:9, fontWeight:700, display:"flex", alignItems:"center", gap:3, whiteSpace:"nowrap" }}>
                      {t.slice(0,20)}{t.length>20?"…":""}
                      <button onClick={e=>{e.stopPropagation();setGlobalTags(g=>g.filter((_,j)=>j!==i));}} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.6)", fontSize:10, padding:0, lineHeight:1 }}>✕</button>
                    </span>
                  ))}
                </div>
              )}
              <span style={{ marginLeft:"auto", fontSize:10, transition:"transform 0.2s", transform:globalExpanded?"rotate(180deg)":"none", flexShrink:0 }}>▼</span>
            </button>
            {globalExpanded && (
              <div style={{ paddingBottom:10 }}>
                <div style={{ display:"flex", gap:6 }}>
                  <input value={globalPrompt} onChange={e=>setGlobalPrompt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addGlobalTag()}
                    placeholder='"Write in Urdu" / "Focus on Pakistani students" / "Make it funny"...'
                    style={{ flex:1, padding:"7px 10px", border:"1px solid rgba(255,255,255,0.2)", borderRadius:7, fontSize:12, color:C.navy, background:"rgba(255,255,255,0.95)", outline:"none", minWidth:0 }}/>
                  <button onClick={addGlobalTag} style={{ padding:"7px 12px", background:`linear-gradient(135deg,${C.gold},${C.goldL})`, color:C.navy, border:"none", borderRadius:7, fontWeight:800, fontSize:11, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>+ Add</button>
                </div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", marginTop:4 }}>Press Enter or Add. Applies to ALL generations.</div>
              </div>
            )}
          </div>
        </div>

        {/* ── MOBILE SIDEBAR OVERLAY ── */}
        {sidebarOpen && (
          <div style={{ position:"fixed", inset:0, zIndex:200 }}>
            <div onClick={()=>setSidebarOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(11,20,55,0.45)", backdropFilter:"blur(2px)" }}/>
            <div style={{ position:"absolute", top:0, left:0, bottom:0, width:"min(260px,82vw)", background:C.white, boxShadow:"6px 0 30px rgba(11,20,55,0.14)", overflow:"auto", display:"flex", flexDirection:"column" }}>
              <div style={{ padding:"12px 12px 8px", borderBottom:"1px solid rgba(11,20,55,0.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ fontSize:12, fontWeight:800, color:C.navy }}>🎬 Tools</div>
                <button onClick={()=>setSidebarOpen(false)} style={{ background:"rgba(11,20,55,0.05)", border:"none", borderRadius:6, width:26, height:26, cursor:"pointer", fontSize:14, color:C.slate }}>✕</button>
              </div>
              <div style={{ padding:"8px 8px", flex:1, overflow:"auto" }}>
                {TOOLS.map(t=>(
                  <button key={t.id} onClick={()=>{setActiveTool(t.id); resetState(); setSidebarOpen(false);}}
                    style={{ width:"100%", padding:"8px 10px", border:`1px solid ${activeTool===t.id?`${t.color}35`:"rgba(11,20,55,0.06)"}`, borderRadius:9, textAlign:"left", background:activeTool===t.id?`${t.color}0d`:"transparent", display:"flex", alignItems:"center", gap:8, marginBottom:4, cursor:"pointer" }}>
                    <div style={{ width:28, height:28, borderRadius:7, background:activeTool===t.id?`${t.color}18`:"rgba(11,20,55,0.04)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{t.icon}</div>
                    <div style={{ minWidth:0, flex:1 }}>
                      <div style={{ fontSize:11, fontWeight:800, color:activeTool===t.id?t.color:C.navy, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.label}</div>
                      <div style={{ fontSize:9, color:C.slate, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.sub}</div>
                    </div>
                    {activeTool===t.id && <div style={{ width:5, height:5, borderRadius:"50%", background:t.color, flexShrink:0 }}/>}
                  </button>
                ))}
              </div>
              <div style={{ margin:"8px", padding:"9px 11px", background:`linear-gradient(135deg,${C.navy},${C.royal})`, borderRadius:10 }}>
                <div style={{ fontSize:9, fontWeight:800, color:C.gold }}>🏆 AIDLA PRO ENGINE</div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", marginTop:1 }}>YouTube-grade AI</div>
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {showHistory && (
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"10px clamp(10px,3vw,18px) 0", position:"relative", zIndex:1 }}>
            <div style={{ background:C.cardBg, border:"1px solid rgba(11,20,55,0.07)", borderRadius:C.r, padding:"clamp(12px,3vw,16px)", boxShadow:C.shadowM, animation:"fadeUp 0.2s ease" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.navy }}>📂 Saved Results</div>
                <button onClick={()=>setShowHistory(false)} style={{ background:"rgba(11,20,55,0.05)", border:"1px solid rgba(11,20,55,0.09)", borderRadius:7, width:26, height:26, cursor:"pointer", color:C.slate, fontSize:14 }}>✕</button>
              </div>
              {history.length===0 ? (
                <div style={{ textAlign:"center", color:C.slate, padding:"16px 0", fontSize:12 }}>No saved results yet.</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:260, overflowY:"auto" }}>
                  {history.map(h=>{
                    const t=TOOLS.find(x=>x.id===h.tool);
                    return (
                      <div key={h.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 11px", background:"rgba(11,20,55,0.02)", borderRadius:9, border:"1px solid rgba(11,20,55,0.05)", flexWrap:"wrap" }}>
                        <div style={{ width:28, height:28, borderRadius:7, background:`${t?.color||C.sky}12`, border:`1px solid ${t?.color||C.sky}28`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>{t?.icon}</div>
                        <div style={{ flex:1, minWidth:80 }}>
                          {renamingId===h.id ? (
                            <div style={{ display:"flex", gap:5 }}>
                              <input value={renameVal} onChange={e=>setRenameVal(e.target.value)} style={{ padding:"3px 7px", fontSize:11, background:"#fafbff", border:"1px solid rgba(11,20,55,0.12)", borderRadius:5, color:C.navy, flex:1 }} autoFocus/>
                              <button onClick={()=>handleRename(h.id)} style={{ padding:"3px 8px", background:C.sky, color:"#fff", border:"none", borderRadius:5, cursor:"pointer", fontSize:10, fontWeight:700 }}>Save</button>
                              <button onClick={()=>setRenamingId(null)} style={{ padding:"3px 7px", background:"rgba(11,20,55,0.05)", border:"none", borderRadius:5, cursor:"pointer", fontSize:10 }}>✕</button>
                            </div>
                          ) : (
                            <>
                              <div style={{ fontSize:11, fontWeight:700, color:C.navy, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h.name}</div>
                              <div style={{ fontSize:9, color:C.slate }}>{t?.label} · {new Date(h.created_at).toLocaleDateString()}</div>
                            </>
                          )}
                        </div>
                        <div style={{ display:"flex", gap:4 }}>
                          <button onClick={()=>{setActiveTool(h.tool);setResult(h.output);setShowHistory(false);}} style={{ padding:"3px 9px", background:`${t?.color||C.sky}12`, color:t?.color||C.sky, border:`1px solid ${t?.color||C.sky}28`, borderRadius:6, cursor:"pointer", fontSize:10, fontWeight:700 }}>Load</button>
                          <button onClick={()=>{setRenamingId(h.id);setRenameVal(h.name);}} style={{ padding:"3px 7px", background:"rgba(11,20,55,0.04)", border:"1px solid rgba(11,20,55,0.07)", borderRadius:6, cursor:"pointer", fontSize:10 }}>✏️</button>
                          <button onClick={()=>handleDeleteHistory(h.id)} style={{ padding:"3px 7px", background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.18)", borderRadius:6, cursor:"pointer", fontSize:10, color:"#ef4444" }}>🗑</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"clamp(10px,2.5vw,16px) clamp(10px,3vw,18px) 60px", position:"relative", zIndex:1 }}>

          {/* ── TOOL HEADER ── */}
          <div style={{ background:C.cardBg, border:`1px solid ${T?.color}25`, borderRadius:C.rL, padding:"clamp(12px,3vw,18px)", marginBottom:10, boxShadow:`0 3px 16px ${T?.glow}`, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${T?.color},transparent)`, opacity:0.6 }}/>

            {/* Tool selector strip */}
            <div style={{ display:"flex", gap:5, overflowX:"auto", marginBottom:14, scrollbarWidth:"none", paddingBottom:2 }}>
              {TOOLS.map(t=>(
                <button key={t.id} onClick={()=>{setActiveTool(t.id); resetState();}}
                  style={{ padding:"5px 10px", border:`1px solid ${activeTool===t.id?`${t.color}45`:"rgba(11,20,55,0.08)"}`, borderRadius:8, background:activeTool===t.id?`${t.color}12`:"rgba(11,20,55,0.02)", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:5, boxShadow:activeTool===t.id?`0 2px 10px ${t.glow}`:"none" }}>
                  <span style={{ fontSize:13 }}>{t.icon}</span>
                  <span style={{ fontSize:10, fontWeight:800, color:activeTool===t.id?t.color:C.slate, whiteSpace:"nowrap" }}>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Tool title */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:`linear-gradient(135deg,${T?.color}20,${T?.color}08)`, border:`1.5px solid ${T?.color}38`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{T?.icon}</div>
              <div>
                <div style={{ fontSize:15, fontWeight:900, color:C.navy }}>{T?.label}</div>
                <div style={{ fontSize:11, color:C.slate }}>Fill in details · AI generates premium content</div>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {/* Language */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <Inp label="🌐 Output Language" value={language} onChange={setLanguage} placeholder="Auto-detect"/>
                <div/>
              </div>

              {/* Tool inputs */}
              {(activeTool==="quick_generator"||activeTool==="full_video_az") && (<>
                <div style={{ position:"relative" }}>
                  <Inp label="📹 Video Topic *" value={topic} onChange={setTopic} placeholder="e.g. How to grow YouTube from 0 to 100K" hint="Specific topic = better output"/>
                  <button onClick={()=>setHookOpen(true)} style={{ position:"absolute", right:8, top:22, padding:"2px 7px", fontSize:9, fontWeight:700, border:`1px solid ${C.sky}35`, borderRadius:5, cursor:"pointer", background:`${C.sky}0d`, color:C.sky }}>🔥 Hooks</button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <Inp label="🔑 Keywords" value={keywords} onChange={setKeywords} placeholder="youtube, viral, growth"/>
                  <Inp label="👥 Audience" value={audience} onChange={setAudience} placeholder="Students, Beginners"/>
                </div>
                <div>
                  <button onClick={()=>setShowTopicPrompt(v=>!v)} style={{ fontSize:10, fontWeight:700, color:C.slate, background:"rgba(11,20,55,0.04)", border:"1px solid rgba(11,20,55,0.09)", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>
                    {showTopicPrompt?"✕ Hide":"🎯 Topic Prompt"}
                  </button>
                  {showTopicPrompt && <div style={{ marginTop:7 }}><Inp label="Topic-Specific Instruction" value={topicPrompt} onChange={setTopicPrompt} placeholder="e.g. Focus on Pakistani students, add Urdu phrases..."/></div>}
                </div>
                {renderApiContextDropdown()}
              </>)}

              {activeTool==="content_calendar" && (<>
                <Inp label="📺 Channel Niche *" value={niche} onChange={setNiche} placeholder="e.g. Tech reviews, Online earning, Cooking"/>
                <Inp label="👥 Target Audience" value={audience} onChange={setAudience} placeholder="Pakistani students, Young professionals"/>
                {renderApiContextDropdown()}
              </>)}

              {activeTool==="idea_to_video" && (<>
                <Inp label="💡 Your Video Idea *" value={idea} onChange={setIdea} placeholder="e.g. 10 ways to earn $500/month as a student in Pakistan" type="textarea" rows={3}/>
                <Inp label="👥 Target Audience" value={audience} onChange={setAudience} placeholder="Students, Beginners"/>
                {renderApiContextDropdown()}
              </>)}

              {activeTool==="title_optimizer" && (<>
                <div style={{ display:"flex", gap:5, marginBottom: 5 }}>
                  <button onClick={()=>setOptMode("url")} style={{ padding:"5px 11px", fontSize:11, fontWeight:700, border:`1.5px solid ${optMode==="url"?C.royal:"rgba(11,20,55,0.1)"}`, borderRadius:7, cursor:"pointer", background:optMode==="url"?`${C.royal}12`:"transparent", color:optMode==="url"?C.royal:C.slate }}>🔗 Paste Video Link</button>
                  <button onClick={()=>setOptMode("manual")} style={{ padding:"5px 11px", fontSize:11, fontWeight:700, border:`1.5px solid ${optMode==="manual"?C.royal:"rgba(11,20,55,0.1)"}`, borderRadius:7, cursor:"pointer", background:optMode==="manual"?`${C.royal}12`:"transparent", color:optMode==="manual"?C.royal:C.slate }}>✍️ Manual Entry</button>
                </div>
                {optMode === "url" ? (
                  <>
                    <div style={{ padding:"8px 10px", background:`${C.sky}12`, borderRadius:8, fontSize:11, color:C.sky, fontWeight:600, border:`1px solid ${C.sky}25`, marginBottom:4 }}>
                      ✨ <strong>YouTube API Enabled:</strong> AI will fetch the real title, views, and data.
                    </div>
                    <Inp label="🔗 YouTube Video URL *" value={spyInput} onChange={setSpyInput} placeholder="https://youtube.com/watch?v=..." />
                  </>
                ) : (
                  <Inp label="📝 Your Current Title *" value={existTitle} onChange={setExistTitle} placeholder="Paste your existing YouTube title here"/>
                )}
                <Inp label="📹 Video Topic (Context)" value={topic} onChange={setTopic} placeholder="Brief description of your video"/>
              </>)}

              {activeTool==="comment_replier" && (<>
                <Inp label="💬 YouTube Comment *" value={comment} onChange={setComment} placeholder="Paste the comment here..." type="textarea" rows={3}/>
                <Inp label="🎬 Video Context" value={context} onChange={setContext} placeholder="Brief description of your video"/>
                {renderApiContextDropdown()}
              </>)}

              {activeTool==="niche_analyzer" && (<>
                <Inp label="📊 Channel Niche *" value={niche} onChange={setNiche} placeholder="e.g. Online earning, Tech, Education, Finance"/>
                <Inp label="📈 Channel Size" value={channelSize} onChange={setChannelSize} placeholder="New / 1K / 10K / 100K subs"/>
                {renderApiContextDropdown()}
              </>)}

              {activeTool==="youtube_shorts" && (<>
                <div style={{ position:"relative" }}>
                  <Inp label="🩳 Short Topic *" value={topic} onChange={setTopic} placeholder="e.g. 3 quick YouTube growth tips"/>
                  <button onClick={()=>setHookOpen(true)} style={{ position:"absolute", right:8, top:22, padding:"2px 7px", fontSize:9, fontWeight:700, border:"1px solid #ec489935", borderRadius:5, cursor:"pointer", background:"#ec48990d", color:"#ec4899" }}>🔥</button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <Inp label="👥 Audience" value={audience} onChange={setAudience} placeholder="Students, Creators"/>
                  <Inp label="📺 Niche" value={niche} onChange={setNiche} placeholder="Education, Tech"/>
                </div>
                {renderApiContextDropdown()}
              </>)}

              {activeTool==="competitor_spy" && (<>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {[{id:"title",label:"✏️ Title Mode"},{id:"url",label:"🔗 Video URL"},{id:"channel",label:"📺 Channel URL"}].map(m=>(
                    <button key={m.id} onClick={()=>setSpyMode(m.id)} style={{ padding:"5px 11px", fontSize:11, fontWeight:700, border:`1.5px solid ${spyMode===m.id?C.royal:"rgba(11,20,55,0.1)"}`, borderRadius:7, cursor:"pointer", background:spyMode===m.id?`${C.royal}12`:"transparent", color:spyMode===m.id?C.royal:C.slate }}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <Inp 
                  label={spyMode==="title" ? "Competitor Title *" : spyMode==="url" ? "YouTube Video URL *" : "YouTube Channel URL *"} 
                  value={spyInput} 
                  onChange={setSpyInput} 
                  placeholder={
                    spyMode==="title" 
                      ? "Paste their exact video title..." 
                      : spyMode==="url" 
                      ? "https://youtube.com/watch?v=... or https://youtu.be/..." 
                      : "https://youtube.com/@channelname or https://youtube.com/c/channelname"
                  }
                />
                {spyMode === "url" && (
                  <div style={{ fontSize:10, color:C.sky, background:`${C.sky}08`, padding:"7px 10px", borderRadius:7, border:`1px solid ${C.sky}22` }}>
                    ✨ <strong>YouTube API Enabled:</strong> Will fetch real video data (title, tags, views, engagement)
                  </div>
                )}
                {spyMode === "channel" && (
                  <div style={{ fontSize:10, color:C.royal, background:`${C.royal}08`, padding:"7px 10px", borderRadius:7, border:`1px solid ${C.royal}22` }}>
                    ✨ <strong>YouTube API Enabled:</strong> Will analyze channel strategy + recent 10 videos
                  </div>
                )}
              </>)}

              {activeTool==="hook_library" && (<>
                <Inp label="📹 Your Topic" value={topic} onChange={setTopic} placeholder="e.g. YouTube growth, MDCAT, Online earning"/>
                <Inp label="📺 Channel Niche" value={niche} onChange={setNiche} placeholder="e.g. Education, Tech, Lifestyle"/>
                <button onClick={()=>setHookOpen(true)} style={{ padding:"9px", background:"linear-gradient(135deg,#ef4444,#f97316)", color:"#fff", border:"none", borderRadius:9, fontWeight:800, fontSize:12, cursor:"pointer" }}>🔥 Browse Hook Library (50+ Hooks)</button>
                {renderApiContextDropdown()}
              </>)}

              {activeTool==="multilang_batch" && (<>
                <div style={{ padding:"8px 10px", background:"rgba(5,150,105,0.07)", border:"1px solid rgba(5,150,105,0.18)", borderRadius:8, fontSize:11, color:"#047857", fontWeight:600 }}>
                  🌍 Generates full SEO package in English + اردو + العربية
                </div>
                <Inp label="📹 Video Topic *" value={mlTopic} onChange={setMlTopic} placeholder="e.g. How to study smarter and get better grades"/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <Inp label="🔑 Keywords" value={mlKeywords} onChange={setMlKeywords} placeholder="study tips, grades"/>
                  <Inp label="👥 Audience" value={mlAudience} onChange={setMlAudience} placeholder="Students, Beginners"/>
                </div>
                {renderApiContextDropdown()}
              </>)}

              {/* AUTOMATED NEXT BOOM & AUDIT */}
              {["next_boom", "channel_audit"].includes(activeTool) && (<>
                <div style={{ padding:"8px 10px", background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.18)", borderRadius:8, fontSize:11, color:"#92400e", fontWeight:600, marginBottom:4 }}>
                  ✨ <strong>YouTube API Enabled:</strong> Enter a Channel URL. AI will automatically fetch their subscriber count, total views, and recent video history to run a mathematical predictive analysis!
                </div>
                <Inp label="📺 YouTube Channel URL *" value={spyInput} onChange={setSpyInput} placeholder="e.g. https://youtube.com/@channelname" />
                {activeTool === "channel_audit" && <Inp label="📊 Additional Notes (optional)" value={auditData} onChange={setAuditData} type="textarea" rows={2} placeholder="Any specific goals or context?"/>}
              </>)}

              {activeTool==="trending_radar" && (<>
                <Inp label="📺 Channel Niche *" value={radarNiche} onChange={setRadarNiche} placeholder="e.g. Pakistani education, Tech reviews, Online earning"/>
                {renderApiContextDropdown()}
              </>)}

              {/* Per-tool prompt */}
              <div style={{ borderTop:"1px solid rgba(11,20,55,0.06)", paddingTop:10 }}>
                <Inp label={`🎯 Custom Prompt for ${T?.label} (optional)`} value={perToolPrompt} onChange={setPerToolPrompt} placeholder={`Override AI for this tool only — e.g. "Make more aggressive" / "Add Pakistani context"`}/>
              </div>

              {/* Error */}
              {error && (
                <div style={{ fontSize:12, color:"#b91c1c", background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.18)", borderRadius:8, padding:"9px 12px" }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Progress */}
              {loading && (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.slate, marginBottom:4, fontWeight:600 }}>
                    <span>⚡ Generating…</span><span>{Math.round(progress)}%</span>
                  </div>
                  <div style={{ height:4, background:"rgba(11,20,55,0.07)", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${T?.color}88,${T?.color})`, borderRadius:99, transition:"width 0.5s ease" }}/>
                  </div>
                  <div style={{ marginTop:8 }}><Skeleton/></div>
                </div>
              )}

              {/* Generate button */}
              <button className="gen-btn" onClick={handleGenerate} disabled={loading} style={{
                padding:"clamp(10px,2vw,13px) 0", width:"100%",
                background: loading?"rgba(11,20,55,0.05)":`linear-gradient(135deg,${T?.color},${T?.color}cc)`,
                color: loading?C.slate:"#fff",
                border:`1px solid ${loading?"rgba(11,20,55,0.09)":T?.color+"50"}`,
                borderRadius:11, fontWeight:800, fontSize:"clamp(12px,2.5vw,14px)",
                cursor:loading?"not-allowed":"pointer",
                boxShadow:loading?"none":`0 4px 16px ${T?.glow}`, transition:"all 0.2s",
              }}>
                {loading ? "⏳ Generating… (10–30s)" : `${T?.icon}  Generate ${T?.label}`}
              </button>
            </div>
          </div>

          {/* ══ RESULTS ══ */}
          {result && (
            <div ref={resultRef} className="result-wrap">

              {/* Save bar */}
              <div style={{ background:C.cardBg, border:"1px solid rgba(16,185,129,0.22)", borderRadius:C.r, padding:"9px 12px", marginBottom:10, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", boxShadow:C.shadow }}>
                <span>💾</span>
                <input value={savingName} onChange={e=>setSavingName(e.target.value)} style={{ flex:"1 1 130px", padding:"6px 9px", fontSize:12, background:"rgba(11,20,55,0.03)", border:"1px solid rgba(11,20,55,0.09)", borderRadius:7, color:C.navy, outline:"none", minWidth:0 }} placeholder="Name this result…"/>
                <button onClick={handleSave} disabled={saving||saved} style={{ padding:"7px 16px", background:saved?"rgba(16,185,129,0.12)":`linear-gradient(135deg,#059669,#10b981)`, color:saved?"#059669":"#fff", border:saved?"1px solid rgba(16,185,129,0.28)":"none", borderRadius:8, fontWeight:800, fontSize:12, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                  {saved?"✅ Saved!":saving?"Saving…":"💾 Save"}
                </button>
              </div>

              {/* SEO score (Math stat, no refine) */}
              {renderSeoScore()}

              {/* Quick / Full / Idea */}
              {["quick_generator","full_video_az","idea_to_video"].includes(activeTool) && (<>
                {renderTitles()}
                {renderScript()}
                {result?.cta && <Card title="Call-to-Action Lines" icon="📣" accent="#06b6d4" sectionContent={result.cta} onRefine={(opts) => handleSectionRefine("cta", result.cta, opts)}><div style={{ fontSize:12, color:C.navy, lineHeight:1.8, whiteSpace:"pre-wrap", marginBottom:8 }}>{result.cta}</div><CopyBtn text={result.cta} id="cta" copied={copied} copy={copy}/></Card>}
                {renderDesc()}
                {renderTags()}
                {renderHashtags()}
                {result?.thumbnail_texts && <Card title="Thumbnail Text Ideas" icon="🖼️" accent={C.gold} sectionContent={result.thumbnail_texts} onRefine={(opts) => handleSectionRefine("thumbnail_texts", result.thumbnail_texts, opts)}>{result.thumbnail_texts.map((t,i)=><div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 11px", background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.15)", borderRadius:9, marginBottom:6 }}><span style={{ fontSize:13, fontWeight:900, color:C.navy, wordBreak:"break-word", flex:1 }}>{t}</span><CopyBtn text={t} id={`thumb-${i}`} copied={copied} copy={copy} small/></div>)}</Card>}
                {result?.first_comment && <Card title="Pinned First Comment" icon="📌" accent={C.royal} copyAll={result.first_comment} copyId="fc" copied={copied} copy={copy} sectionContent={result.first_comment} onRefine={(opts) => handleSectionRefine("first_comment", result.first_comment, opts)}><pre style={{ fontSize:11, color:C.slate, lineHeight:1.8, whiteSpace:"pre-wrap", fontFamily:"'DM Sans',sans-serif", margin:0, wordBreak:"break-word", background:`rgba(26,58,143,0.04)`, padding:10, borderRadius:8 }}>{result.first_comment}</pre></Card>}
                {renderChecklist()}
                {result?.monetization_tips && <Card title="Monetization Tips" icon="💰" accent={C.gold} sectionContent={result.monetization_tips} onRefine={(opts) => handleSectionRefine("monetization_tips", result.monetization_tips, opts)}>{result.monetization_tips.map((t,i)=><div key={i} style={{ display:"flex", gap:8, padding:"7px 0", borderBottom:i<result.monetization_tips.length-1?"1px solid rgba(11,20,55,0.04)":"none" }}><span style={{ width:18, height:18, borderRadius:4, background:"rgba(245,158,11,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:900, color:C.gold, flexShrink:0, marginTop:1 }}>{i+1}</span><span style={{ fontSize:11, color:C.slate, lineHeight:1.55 }}>{t}</span></div>)}</Card>}
              </>)}

              {/* Content Calendar */}
              {activeTool==="content_calendar" && result?.days && (<>
                {result.niche_analysis && <Card title="Niche Analysis" icon="🔍" accent={C.royal} sectionContent={result.niche_analysis} onRefine={(opts) => handleSectionRefine("niche_analysis", result.niche_analysis, opts)}><p style={{ fontSize:12, color:C.slate, lineHeight:1.7 }}>{result.niche_analysis}</p></Card>}
                {result.posting_strategy && <Card title="Posting Strategy" icon="📅" accent="#06b6d4" sectionContent={result.posting_strategy} onRefine={(opts) => handleSectionRefine("posting_strategy", result.posting_strategy, opts)}><p style={{ fontSize:12, color:C.slate, lineHeight:1.7 }}>{result.posting_strategy}</p></Card>}
                <Card title="30-Day Calendar" icon="📆" accent={C.royal} copyAll={result.days.map(d=>`Day ${d.day}: ${d.title}`).join("\n")} copyId="calendar" copied={copied} copy={copy} sectionContent={result.days} onRefine={(opts) => handleSectionRefine("days", result.days, opts)}>
                  {result.days.map((d,i)=>(
                    <div key={i} style={{ background:"rgba(11,20,55,0.02)", borderRadius:9, padding:"10px 12px", border:"1px solid rgba(11,20,55,0.05)", marginBottom:7 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5, flexWrap:"wrap" }}>
                        <span style={{ fontSize:8, fontWeight:900, color:"#fff", background:`linear-gradient(135deg,${C.navy},${C.royal})`, borderRadius:4, padding:"2px 6px" }}>Day {d.day}</span>
                        <span style={{ fontSize:8, fontWeight:700, color:C.slate, background:"rgba(11,20,55,0.06)", padding:"2px 6px", borderRadius:4 }}>{d.type}</span>
                        {d.best_time && <span style={{ fontSize:8, color:C.slate }}>⏰ {d.best_time}</span>}
                        <CopyBtn text={d.title} id={`cal-${i}`} copied={copied} copy={copy} small/>
                      </div>
                      <div style={{ fontSize:12, fontWeight:700, color:C.navy, marginBottom:3, wordBreak:"break-word" }}>{d.title}</div>
                      <div style={{ fontSize:10, color:C.slate, lineHeight:1.55, wordBreak:"break-word" }}>{d.outline}</div>
                      {d.hook_idea && <div style={{ marginTop:5, fontSize:10, color:"#ef4444", fontWeight:700 }}>🎣 {d.hook_idea}</div>}
                    </div>
                  ))}
                </Card>
                {result.growth_tips && <Card title="Growth Tips" icon="🚀" accent="#10b981" sectionContent={result.growth_tips} onRefine={(opts) => handleSectionRefine("growth_tips", result.growth_tips, opts)}>{result.growth_tips.map((t,i)=><div key={i} style={{ fontSize:11, color:C.slate, padding:"6px 0", borderBottom:i<result.growth_tips.length-1?"1px solid rgba(11,20,55,0.04)":"none", display:"flex", gap:7 }}><span style={{ color:"#10b981", fontWeight:800, flexShrink:0 }}>{i+1}.</span>{t}</div>)}</Card>}
              </>)}

              {/* Title Optimizer */}
              {activeTool==="title_optimizer" && (<>
                {result.original_analysis && <Card title="Analysis" icon="🔍" accent="#06b6d4" sectionContent={result.original_analysis} onRefine={(opts) => handleSectionRefine("original_analysis", result.original_analysis, opts)}><p style={{ fontSize:12, color:C.slate, lineHeight:1.7, marginBottom:10 }}>{result.original_analysis}</p>{result.original_score && <ScoreBar score={result.original_score} label="Original Score"/>}{result.weaknesses && result.weaknesses.map((w,i)=><div key={i} style={{ fontSize:10, color:"#b91c1c", padding:"3px 0", display:"flex", gap:6 }}><span>⚠️</span>{w}</div>)}</Card>}
                {result.optimized_titles && <Card title="Optimized Titles" icon="✨" accent={C.sky} copyAll={result.optimized_titles.map(t=>t.title).join("\n")} copyId="opt" copied={copied} copy={copy} sectionContent={result.optimized_titles} onRefine={(opts) => handleSectionRefine("optimized_titles", result.optimized_titles, opts)}>
                  {result.optimized_titles.map((t,i)=>(
                    <div key={i} style={{ background:"rgba(11,20,55,0.02)", borderRadius:10, padding:"11px 12px", marginBottom:8, border:"1px solid rgba(11,20,55,0.06)" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:7 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:C.navy, flex:1, lineHeight:1.4, wordBreak:"break-word" }}>{t.title}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}><ScoreRing score={t.score} size={42}/><CopyBtn text={t.title} id={`opt-${i}`} copied={copied} copy={copy} small/></div>
                      </div>
                      <div style={{ fontSize:10, color:C.slate, lineHeight:1.5 }}>{t.why}</div>
                    </div>
                  ))}
                </Card>}
                {result.tips && <Card title="Tips" icon="💡" accent={C.gold} sectionContent={result.tips} onRefine={(opts) => handleSectionRefine("tips", result.tips, opts)}>{result.tips.map((t,i)=><div key={i} style={{ fontSize:11, color:C.slate, padding:"6px 0", borderBottom:i<result.tips.length-1?"1px solid rgba(11,20,55,0.04)":"none", display:"flex", gap:7 }}><span style={{ color:C.gold, fontWeight:800, flexShrink:0 }}>{i+1}.</span>{t}</div>)}</Card>}
              </>)}

              {/* Comment Replier */}
              {activeTool==="comment_replier" && result.replies && (<>
                <Card title="Reply Options" icon="💬" accent="#10b981" sectionContent={result.replies} onRefine={(opts) => handleSectionRefine("replies", result.replies, opts)}>
                  {result.replies.map((r,i)=>(
                    <div key={i} style={{ background:"rgba(11,20,55,0.02)", borderRadius:9, padding:"11px 12px", marginBottom:8, border:"1px solid rgba(11,20,55,0.06)" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                        <span style={{ fontSize:9, fontWeight:800, color:"#059669", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:20, padding:"2px 9px" }}>{r.style}</span>
                        <CopyBtn text={r.text} id={`reply-${i}`} copied={copied} copy={copy} small/>
                      </div>
                      <p style={{ fontSize:12, color:C.navy, lineHeight:1.7, margin:0, wordBreak:"break-word" }}>{r.text}</p>
                    </div>
                  ))}
                </Card>
                {result.tip && <Card title="Pro Tip" icon="💡" accent={C.gold} sectionContent={result.tip} onRefine={(opts) => handleSectionRefine("tip", result.tip, opts)}><p style={{ fontSize:12, color:C.slate, lineHeight:1.7 }}>{result.tip}</p></Card>}
              </>)}

              {/* Niche Analyzer */}
              {activeTool==="niche_analyzer" && (<>
                {result.niche_overview && <Card title="Niche Overview" icon="🔍" accent="#f97316" sectionContent={result.niche_overview} onRefine={(opts) => handleSectionRefine("niche_overview", result.niche_overview, opts)}><p style={{ fontSize:12, color:C.slate, lineHeight:1.7, marginBottom:10 }}>{result.niche_overview}</p><div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{result.competition_level && <Tag text={`⚔️ ${result.competition_level}`} color="#f97316"/>}{result.monetization_potential && <Tag text={`💰 ${result.monetization_potential}`} color="#10b981"/>}{result.estimated_rpm && <Tag text={`📊 ${result.estimated_rpm}`} color={C.gold}/>}</div></Card>}
                {result.top_keywords && <Card title="Top Keywords" icon="🔑" accent={C.sky} copyAll={result.top_keywords.map(k=>k.keyword).join("\n")} copyId="kw-all" copied={copied} copy={copy} sectionContent={result.top_keywords} onRefine={(opts) => handleSectionRefine("top_keywords", result.top_keywords, opts)}>{result.top_keywords.map((k,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 0", borderBottom:i<result.top_keywords.length-1?"1px solid rgba(11,20,55,0.04)":"none", flexWrap:"wrap" }}><span style={{ flex:1, fontSize:11, fontWeight:700, color:C.navy, minWidth:80, wordBreak:"break-word" }}>{k.keyword}</span><div style={{ display:"flex", gap:4, flexWrap:"wrap" }}><Tag text={k.search_intent} color={C.sky}/><Tag text={k.difficulty} color={k.difficulty==="easy"?"#10b981":k.difficulty==="medium"?C.gold:"#ef4444"}/><CopyBtn text={k.keyword} id={`kw-${i}`} copied={copied} copy={copy} small/></div></div>)}</Card>}
                {result.content_gaps && <Card title="Content Gaps" icon="💡" accent="#10b981" copyAll={result.content_gaps.join("\n")} copyId="gaps" copied={copied} copy={copy} sectionContent={result.content_gaps} onRefine={(opts) => handleSectionRefine("content_gaps", result.content_gaps, opts)}>{result.content_gaps.map((g,i)=><div key={i} style={{ fontSize:11, color:C.slate, padding:"6px 0", borderBottom:i<result.content_gaps.length-1?"1px solid rgba(11,20,55,0.04)":"none", display:"flex", gap:7, wordBreak:"break-word" }}><span style={{ color:"#10b981", fontWeight:800, flexShrink:0 }}>→</span>{g}</div>)}</Card>}
                {result.video_ideas && <Card title="Video Ideas" icon="🎬" accent="#ef4444" copyAll={result.video_ideas.join("\n")} copyId="vi" copied={copied} copy={copy} sectionContent={result.video_ideas} onRefine={(opts) => handleSectionRefine("video_ideas", result.video_ideas, opts)}>{result.video_ideas.map((v,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 0", borderBottom:i<result.video_ideas.length-1?"1px solid rgba(11,20,55,0.04)":"none" }}><span style={{ fontSize:11, color:C.slate, flex:1, wordBreak:"break-word" }}>{i+1}. {v}</span><CopyBtn text={v} id={`vi-${i}`} copied={copied} copy={copy} small/></div>)}</Card>}
                {result.growth_strategy && <Card title="Growth Strategy" icon="🚀" accent={C.royal} sectionContent={result.growth_strategy} onRefine={(opts) => handleSectionRefine("growth_strategy", result.growth_strategy, opts)}>{result.growth_strategy.map((s,i)=><div key={i} style={{ fontSize:11, color:C.slate, padding:"6px 0", borderBottom:i<result.growth_strategy.length-1?"1px solid rgba(11,20,55,0.04)":"none", display:"flex", gap:7, wordBreak:"break-word" }}><span style={{ color:C.royal, fontWeight:800, flexShrink:0 }}>{i+1}.</span>{s}</div>)}</Card>}
                {result.monetization_methods && <Card title="Monetization" icon="💰" accent={C.gold} sectionContent={result.monetization_methods} onRefine={(opts) => handleSectionRefine("monetization_methods", result.monetization_methods, opts)}>{result.monetization_methods.map((m,i)=><div key={i} style={{ fontSize:11, color:C.slate, padding:"6px 0", borderBottom:i<result.monetization_methods.length-1?"1px solid rgba(11,20,55,0.04)":"none", display:"flex", gap:6, wordBreak:"break-word" }}><span style={{ color:C.gold, flexShrink:0 }}>•</span>{m}</div>)}</Card>}
                {result.thumbnail_style && <Card title="Thumbnail Style" icon="🖼️" accent="#06b6d4" sectionContent={result.thumbnail_style} onRefine={(opts) => handleSectionRefine("thumbnail_style", result.thumbnail_style, opts)}><p style={{ fontSize:12, color:C.slate, lineHeight:1.7 }}>{result.thumbnail_style}</p></Card>}
                {result.posting_frequency && <Card title="Posting Schedule" icon="📅" accent="#10b981" sectionContent={result.posting_frequency} onRefine={(opts) => handleSectionRefine("posting_frequency", result.posting_frequency, opts)}><p style={{ fontSize:12, color:C.slate, lineHeight:1.7 }}>{result.posting_frequency}</p></Card>}
              </>)}

              {/* YouTube Shorts */}
              {activeTool==="youtube_shorts" && (<>
                {result.short_titles && <Card title="Shorts Titles" icon="🩳" accent="#ec4899" copyAll={result.short_titles.join("\n")} copyId="st" copied={copied} copy={copy} sectionContent={result.short_titles} onRefine={(opts) => handleSectionRefine("short_titles", result.short_titles, opts)}>{result.short_titles.map((t,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 10px", background:"rgba(236,72,153,0.04)", borderRadius:8, marginBottom:5, border:"1px solid rgba(236,72,153,0.1)" }}><span style={{ flex:1, fontSize:12, fontWeight:700, color:C.navy, wordBreak:"break-word" }}>{t}</span><span style={{ fontSize:8, color:t.length>50?"#ef4444":"#10b981", fontWeight:700, flexShrink:0 }}>{t.length}/50</span><CopyBtn text={t} id={`st-${i}`} copied={copied} copy={copy} small/></div>)}</Card>}
                {result.script && <Card title="60-Second Script" icon="⏱️" accent="#ec4899" sectionContent={result.script} onRefine={(opts) => handleSectionRefine("script", result.script, opts)}>{Object.entries(result.script||{}).map(([k,text],i)=><div key={i} style={{ marginBottom:10, paddingBottom:10, borderBottom:i<Object.entries(result.script||{}).length-1?"1px solid rgba(236,72,153,0.08)":"none" }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}><span style={{ fontSize:8, fontWeight:800, background:"linear-gradient(135deg,#ec4899,#f97316)", color:"#fff", padding:"2px 7px", borderRadius:4 }}>{k.replace(/_/g," ").toUpperCase()}</span><CopyBtn text={text} id={`shorts-${i}`} copied={copied} copy={copy} small/></div><div style={{ fontSize:12, color:C.navy, lineHeight:1.65, wordBreak:"break-word" }}>{text}</div></div>)}</Card>}
                {result.captions && <Card title="On-Screen Captions" icon="💬" accent="#f97316" copyAll={result.captions.map(c=>`${c.time}: ${c.text}`).join("\n")} copyId="caps" copied={copied} copy={copy} sectionContent={result.captions} onRefine={(opts) => handleSectionRefine("captions", result.captions, opts)}><div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:6 }}>{result.captions.map((c,i)=><div key={i} style={{ padding:"6px 9px", background:"rgba(249,115,22,0.06)", border:"1px solid rgba(249,115,22,0.14)", borderRadius:7 }}><div style={{ fontSize:8, fontWeight:800, color:"#f97316", marginBottom:2 }}>{c.time}</div><div style={{ fontSize:11, fontWeight:700, color:C.navy, wordBreak:"break-word" }}>{c.text}</div></div>)}</div></Card>}
                {result.cover_frame_text && <Card title="Cover Frame Text" icon="🖼️" accent={C.gold} sectionContent={result.cover_frame_text} onRefine={(opts) => handleSectionRefine("cover_frame_text", result.cover_frame_text, opts)}><div style={{ padding:"12px", background:"rgba(245,158,11,0.07)", borderRadius:9, border:"1px solid rgba(245,158,11,0.18)", marginBottom:8, textAlign:"center" }}><div style={{ fontSize:16, fontWeight:900, color:C.navy }}>{result.cover_frame_text}</div></div><CopyBtn text={result.cover_frame_text} id="cover" copied={copied} copy={copy}/></Card>}
                {result.hashtags && <Card title="Shorts Hashtags" icon="#️⃣" accent="#ec4899" copyAll={result.hashtags.join(" ")} copyId="sh" copied={copied} copy={copy} sectionContent={result.hashtags} onRefine={(opts) => handleSectionRefine("hashtags", result.hashtags, opts)}><div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{result.hashtags.map(h=><Tag key={h} text={h} color="#ec4899"/>)}</div></Card>}
                {result.best_post_time && <Card title="Best Post Time" icon="⏰" accent="#10b981" sectionContent={result.best_post_time} onRefine={(opts) => handleSectionRefine("best_post_time", result.best_post_time, opts)}><p style={{ fontSize:12, color:C.slate, lineHeight:1.7 }}>{result.best_post_time}</p></Card>}
              </>)}

              {/* Competitor Spy */}
              {activeTool==="competitor_spy" && (<>
                {result.title_score!==undefined && <Card title="SEO Analysis" icon="🕵️" accent="#8b5cf6" sectionContent={result.analysis} onRefine={(opts) => handleSectionRefine("analysis", result.analysis, opts)}><div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}><ScoreRing score={result.title_score} size={60}/><div style={{ flex:1, minWidth:120 }}><div style={{ fontSize:12, color:C.slate, lineHeight:1.7, marginBottom:9 }}>{result.analysis}</div></div></div></Card>}
                {result.what_they_did_right && <Card title="✅ What They Did Right" icon="💡" accent="#10b981" sectionContent={result.what_they_did_right} onRefine={(opts) => handleSectionRefine("what_they_did_right", result.what_they_did_right, opts)}>{result.what_they_did_right.map((r,i)=><div key={i} style={{ fontSize:11, color:C.slate, padding:"6px 0", borderBottom:i<result.what_they_did_right.length-1?"1px solid rgba(11,20,55,0.04)":"none", display:"flex", gap:7, wordBreak:"break-word" }}><span style={{ color:"#10b981", flexShrink:0 }}>✅</span>{r}</div>)}</Card>}
                {result.what_they_did_wrong && <Card title="❌ Their Weaknesses" icon="🎯" accent="#ef4444" sectionContent={result.what_they_did_wrong} onRefine={(opts) => handleSectionRefine("what_they_did_wrong", result.what_they_did_wrong, opts)}>{result.what_they_did_wrong.map((r,i)=><div key={i} style={{ fontSize:11, color:C.slate, padding:"6px 0", borderBottom:i<result.what_they_did_wrong.length-1?"1px solid rgba(11,20,55,0.04)":"none", display:"flex", gap:7, wordBreak:"break-word" }}><span style={{ color:"#ef4444", flexShrink:0 }}>❌</span>{r}</div>)}</Card>}
                {result.likely_tags && <Card title="Their Likely Tags" icon="🏷️" accent="#8b5cf6" copyAll={(result.likely_tags||[]).join(",")} copyId="spy-tags" copied={copied} copy={copy} sectionContent={result.likely_tags} onRefine={(opts) => handleSectionRefine("likely_tags", result.likely_tags, opts)}><div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{(result.likely_tags||[]).map(t=><Tag key={t} text={t} color="#8b5cf6"/>)}</div></Card>}
                {result.better_alternatives && <Card title="5 Better Titles" icon="✨" accent={C.sky} copyAll={result.better_alternatives.join("\n")} copyId="better" copied={copied} copy={copy} sectionContent={result.better_alternatives} onRefine={(opts) => handleSectionRefine("better_alternatives", result.better_alternatives, opts)}>{result.better_alternatives.map((t,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 9px", background:`${C.sky}06`, borderRadius:8, marginBottom:5, border:`1px solid ${C.sky}14` }}><span style={{ flex:1, fontSize:12, fontWeight:600, color:C.navy, wordBreak:"break-word" }}>{t}</span><CopyBtn text={t} id={`better-${i}`} copied={copied} copy={copy} small/></div>)}</Card>}
                {result.keyword_strategy && <Card title="Keyword Strategy" icon="🔑" accent={C.gold} sectionContent={result.keyword_strategy} onRefine={(opts) => handleSectionRefine("keyword_strategy", result.keyword_strategy, opts)}><p style={{ fontSize:12, color:C.slate, lineHeight:1.7 }}>{result.keyword_strategy}</p></Card>}
                {result.counter_strategy && <Card title="Counter Strategy" icon="🎯" accent={C.royal} sectionContent={result.counter_strategy} onRefine={(opts) => handleSectionRefine("counter_strategy", result.counter_strategy, opts)}><p style={{ fontSize:12, color:C.slate, lineHeight:1.7 }}>{result.counter_strategy}</p></Card>}
              </>)}

              {/* Hook Library */}
              {activeTool==="hook_library" && result.personalized_hooks && (
                <Card title="Your Personalised Hooks" icon="🔥" accent="#ef4444" copyAll={result.personalized_hooks.map(h=>h.hook).join("\n\n")} copyId="hooks-all" copied={copied} copy={copy} sectionContent={result.personalized_hooks} onRefine={(opts) => handleSectionRefine("personalized_hooks", result.personalized_hooks, opts)}>
                  {result.personalized_hooks.map((h,i)=>(
                    <div key={i} style={{ padding:"10px", background:"rgba(239,68,68,0.04)", border:"1px solid rgba(239,68,68,0.1)", borderRadius:9, marginBottom:8 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6, gap:7 }}>
                        <Tag text={h.category} color="#ef4444"/>
                        <CopyBtn text={h.hook} id={`hook-${i}`} copied={copied} copy={copy} small/>
                      </div>
                      <div style={{ fontSize:12, fontWeight:600, color:C.navy, lineHeight:1.55, wordBreak:"break-word" }}>{h.hook}</div>
                      {h.why && <div style={{ fontSize:10, color:C.slate, marginTop:5 }}>💡 {h.why}</div>}
                    </div>
                  ))}
                </Card>
              )}

              {/* Multi-Language */}
              {activeTool==="multilang_batch" && ["english","urdu","arabic"].map(lang => result[lang] && (
                <Card key={lang} title={lang==="english"?"🇬🇧 English":lang==="urdu"?"🇵🇰 Urdu / اردو":"🌍 Arabic / عربي"} icon={lang==="english"?"🇬🇧":lang==="urdu"?"🇵🇰":"🌍"} accent={lang==="english"?C.sky:lang==="urdu"?"#10b981":"#f97316"} sectionContent={result[lang]} onRefine={(opts) => handleSectionRefine(lang, result[lang], opts)}>
                  {result[lang].title && <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:7, direction:lang!=="english"?"rtl":"ltr", wordBreak:"break-word" }}>{result[lang].title}</div>}
                  {result[lang].description && <pre style={{ fontSize:10, color:C.slate, lineHeight:1.65, whiteSpace:"pre-wrap", fontFamily:"'DM Sans',sans-serif", margin:"0 0 8px", direction:lang!=="english"?"rtl":"ltr", wordBreak:"break-word", maxHeight:120, overflow:"auto" }}>{result[lang].description.slice(0,300)}…</pre>}
                  {result[lang].tags && <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:8 }}>{result[lang].tags.slice(0,8).map(t=><Tag key={t} text={t} color={lang==="english"?C.sky:lang==="urdu"?"#10b981":"#f97316"}/>)}</div>}
                  <CopyBtn text={JSON.stringify(result[lang],null,2)} id={`ml-${lang}`} copied={copied} copy={copy}/>
                </Card>
              ))}

              {/* Next Boom Predictor */}
              {activeTool==="next_boom" && (<>
                {result.pattern_detected && <Card title="Pattern Detected" icon="🔍" accent={C.gold} sectionContent={result.pattern_detected} onRefine={(opts) => handleSectionRefine("pattern_detected", result.pattern_detected, opts)}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.navy, marginBottom:9, lineHeight:1.5, wordBreak:"break-word" }}>{result.pattern_detected}</div>
                  {result.traffic_lights && <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{Object.entries(result.traffic_lights).map(([k,v])=><TrafficLight key={k} value={v} label={k.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}/>)}</div>}
                </Card>}
                {result.videos_analysis && <Card title="Video Radar" icon="📊" accent={C.royal}>
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}><RadarChart videos={result.videos_analysis}/></div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" }}>
                    {result.videos_analysis.slice(0,3).map((v,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:4 }}><div style={{ width:9, height:9, borderRadius:2, background:[C.sky,C.gold,"#10b981"][i] }}/><span style={{ fontSize:9, color:C.slate, fontWeight:600 }}>V{i+1}</span></div>)}
                  </div>
                </Card>}
                {result.next_boom_prediction && <Card title="🚀 Predicted Boom Video" icon="🎯" accent="#ef4444" sectionContent={result.next_boom_prediction} onRefine={(opts) => handleSectionRefine("next_boom_prediction", result.next_boom_prediction, opts)}>
                  <div style={{ padding:"11px", background:`linear-gradient(135deg,rgba(11,20,55,0.04),rgba(26,58,143,0.04))`, borderRadius:9, border:`1px solid rgba(26,58,143,0.1)`, marginBottom:10 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:7, wordBreak:"break-word" }}>{result.next_boom_prediction.title}</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {result.next_boom_prediction.risk_score && <Tag text={`Risk: ${result.next_boom_prediction.risk_score}`} color={result.next_boom_prediction.risk_score==="Low"?"#10b981":result.next_boom_prediction.risk_score==="Medium"?C.gold:"#ef4444"}/>}
                      {result.next_boom_prediction.optimal_publish_time && <Tag text={`⏰ ${result.next_boom_prediction.optimal_publish_time}`} color={C.royal}/>}
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:C.slate, lineHeight:1.7, marginBottom:9, wordBreak:"break-word" }}>{result.next_boom_prediction.why_it_will_work}</div>
                  {result.next_boom_prediction.title_options && result.next_boom_prediction.title_options.map((t,i)=><div key={i} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 9px", background:"rgba(11,20,55,0.03)", borderRadius:7, marginBottom:5 }}><span style={{ flex:1, fontSize:11, fontWeight:600, color:C.navy, wordBreak:"break-word" }}>{t}</span><CopyBtn text={t} id={`boom-${i}`} copied={copied} copy={copy} small/></div>)}
                </Card>}
                {result.key_insights && <Card title="Key Insights" icon="💡" accent={C.sky} sectionContent={result.key_insights} onRefine={(opts) => handleSectionRefine("key_insights", result.key_insights, opts)}>{result.key_insights.map((s,i)=><div key={i} style={{ fontSize:11, color:C.slate, padding:"6px 0", borderBottom:i<result.key_insights.length-1?"1px solid rgba(11,20,55,0.04)":"none", display:"flex", gap:7, wordBreak:"break-word" }}><span style={{ color:C.sky, fontWeight:800, flexShrink:0 }}>→</span>{s}</div>)}</Card>}
              </>)}

              {/* Trending Radar */}
              {activeTool==="trending_radar" && result.trending_topics && (
                <Card title="🔥 Trending Topics" icon="📡" accent="#ef4444" copyAll={result.trending_topics.map(t=>t.topic).join("\n")} copyId="trending" copied={copied} copy={copy} sectionContent={result.trending_topics} onRefine={(opts) => handleSectionRefine("trending_topics", result.trending_topics, opts)}>
                  {result.trending_topics.map((t,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:9, padding:"10px", background:i===0?"rgba(239,68,68,0.05)":"rgba(11,20,55,0.02)", border:`1px solid ${i===0?"rgba(239,68,68,0.14)":"rgba(11,20,55,0.05)"}`, borderRadius:9, marginBottom:7 }}>
                      <div style={{ width:24, height:24, borderRadius:6, background:i===0?`linear-gradient(135deg,#ef4444,#f97316)`:`${C.royal}12`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:i===0?12:10, fontWeight:900, color:i===0?"#fff":C.royal, flexShrink:0 }}>{i===0?"🔥":i+1}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:5, marginBottom:3, flexWrap:"wrap" }}>
                          <div style={{ fontSize:12, fontWeight:800, color:C.navy, wordBreak:"break-word" }}>{t.topic}</div>
                          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                            {t.trend_direction && <Tag text={t.trend_direction} color={t.trend_direction.includes("↑")?"#10b981":C.gold}/>}
                            {t.urgency && <Tag text={t.urgency} color="#ef4444"/>}
                          </div>
                        </div>
                        <div style={{ fontSize:10, color:C.slate, lineHeight:1.5, wordBreak:"break-word" }}>{t.why_trending}</div>
                        {t.best_angle && <div style={{ marginTop:4, fontSize:10, color:C.royal, fontWeight:700, wordBreak:"break-word" }}>💡 {t.best_angle}</div>}
                      </div>
                      <CopyBtn text={t.topic} id={`trend-${i}`} copied={copied} copy={copy} small/>
                    </div>
                  ))}
                  {result.niche_momentum && <div style={{ padding:"8px 10px", background:"rgba(11,20,55,0.03)", borderRadius:8, fontSize:11, color:C.slate, marginTop:4 }}>📈 {result.niche_momentum}</div>}
                </Card>
              )}

              {/* Channel Audit */}
              {activeTool==="channel_audit" && (<>
                {result.overall_score!==undefined && <Card title="Channel Score" icon="🏆" accent={C.royal}>
                  <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", marginBottom:12 }}>
                    <ScoreRing score={result.overall_score} size={70}/>
                    <div style={{ flex:1, minWidth:130 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:C.navy, marginBottom:7, wordBreak:"break-word" }}>{result.channel_grade} — {result.summary}</div>
                      {result.score_breakdown && Object.entries(result.score_breakdown).map(([k,v])=><ScoreBar key={k} score={v} label={k.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}/>)}
                    </div>
                  </div>
                </Card>}
                {result.whats_working && <Card title="✅ What's Working" icon="💪" accent="#10b981" sectionContent={result.whats_working} onRefine={(opts) => handleSectionRefine("whats_working", result.whats_working, opts)}>{result.whats_working.map((w,i)=><div key={i} style={{ fontSize:11, color:C.slate, padding:"6px 0", borderBottom:i<result.whats_working.length-1?"1px solid rgba(11,20,55,0.04)":"none", display:"flex", gap:7, wordBreak:"break-word" }}><span style={{ color:"#10b981", flexShrink:0 }}>✅</span>{w}</div>)}</Card>}
                {result.what_to_fix && <Card title="🔴 What to Fix" icon="⚠️" accent="#ef4444" sectionContent={result.what_to_fix} onRefine={(opts) => handleSectionRefine("what_to_fix", result.what_to_fix, opts)}>{result.what_to_fix.map((w,i)=><div key={i} style={{ fontSize:11, color:C.slate, padding:"6px 0", borderBottom:i<result.what_to_fix.length-1?"1px solid rgba(11,20,55,0.04)":"none", display:"flex", gap:7, wordBreak:"break-word" }}><span style={{ color:"#ef4444", flexShrink:0 }}>🔴</span>{w}</div>)}</Card>}
                {result.action_items && <Card title="5 Action Items" icon="📋" accent={C.gold} sectionContent={result.action_items} onRefine={(opts) => handleSectionRefine("action_items", result.action_items, opts)}>{result.action_items.map((a,i)=><div key={i} style={{ display:"flex", gap:8, padding:"7px 0", borderBottom:i<result.action_items.length-1?"1px solid rgba(11,20,55,0.04)":"none" }}><span style={{ width:18, height:18, borderRadius:4, background:`linear-gradient(135deg,${C.navy},${C.royal})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:900, color:"#fff", flexShrink:0, marginTop:1 }}>{i+1}</span><span style={{ fontSize:11, color:C.slate, lineHeight:1.55, wordBreak:"break-word" }}>{a}</span></div>)}</Card>}
                {result.channel_positioning && <Card title="Channel Positioning" icon="🎯" accent={C.royal} sectionContent={result.channel_positioning} onRefine={(opts) => handleSectionRefine("channel_positioning", result.channel_positioning, opts)}><div style={{ fontSize:12, fontWeight:700, color:C.navy, lineHeight:1.6, padding:"10px 12px", background:`rgba(26,58,143,0.05)`, borderRadius:8, wordBreak:"break-word" }}>{result.channel_positioning}</div></Card>}
                {result.title_consistency && <Card title="Title Analysis" icon="🔤" accent="#06b6d4" sectionContent={result.title_consistency} onRefine={(opts) => handleSectionRefine("title_consistency", result.title_consistency, opts)}><p style={{ fontSize:12, color:C.slate, lineHeight:1.7 }}>{result.title_consistency}</p></Card>}
              </>)}

            </div>
          )}
        </div>
      </div>

      <HookModal open={hookOpen} onClose={()=>setHookOpen(false)} onSelect={h=>setTopic(h)} topicValue={topic}/>
    </>
  );
}
