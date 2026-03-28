// ══════════════════════════════════════════════════════════════
//  AutoTube Studio v4 ULTRA — by AIDLA
//  14 Tools · Global Prompt · Section Sidebar · AIDLA Theme
//  Mobile-First · Universal Screen Support
// ══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AutoTubeStudio.css";

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
    catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(id);
    setTimeout(() => setCopied(""), 2200);
  };
  return { copied, copy };
}

// ── Color constants (used inline for dynamic values only) ──────
const C = {
  navy:  "#0b1437",
  royal: "#1a3a8f",
  sky:   "#3b82f6",
  gold:  "#f59e0b",
  goldL: "#fcd34d",
  slate: "#64748b",
  white: "#ffffff",
};

const TOOLS = [
  { id: "quick_generator",  icon: "⚡", label: "Quick Generator",     sub: "Titles · Desc · Tags",       color: "#3b82f6", glow: "rgba(59,130,246,0.2)" },
  { id: "full_video_az",    icon: "🎬", label: "Full Video A–Z",      sub: "Script · SEO · Checklist",   color: "#ef4444", glow: "rgba(239,68,68,0.2)" },
  { id: "content_calendar", icon: "📅", label: "Content Calendar",    sub: "30-Day Plan",                color: "#1a3a8f", glow: "rgba(26,58,143,0.2)" },
  { id: "idea_to_video",    icon: "💡", label: "Idea → Full Video",   sub: "Complete Package",           color: "#f59e0b", glow: "rgba(245,158,11,0.2)" },
  { id: "title_optimizer",  icon: "🔤", label: "Title Optimizer",     sub: "A/B · CTR Boost",            color: "#06b6d4", glow: "rgba(6,182,212,0.2)" },
  { id: "comment_replier",  icon: "💬", label: "Comment Replier",     sub: "3 Reply Styles",             color: "#10b981", glow: "rgba(16,185,129,0.2)" },
  { id: "niche_analyzer",   icon: "📊", label: "Niche Analyzer",      sub: "Deep Market Intel",          color: "#f97316", glow: "rgba(249,115,22,0.2)" },
  { id: "youtube_shorts",   icon: "🩳", label: "YouTube Shorts",      sub: "60-sec · Captions · Hooks",  color: "#ec4899", glow: "rgba(236,72,153,0.2)" },
  { id: "competitor_spy",   icon: "🕵️", label: "Competitor Spy",     sub: "URL · Title · Channel",      color: "#8b5cf6", glow: "rgba(139,92,246,0.2)" },
  { id: "hook_library",     icon: "🔥", label: "Hook Library",        sub: "50+ Proven Hooks",           color: "#ef4444", glow: "rgba(239,68,68,0.2)" },
  { id: "multilang_batch",  icon: "🌍", label: "Multi-Language",      sub: "EN + Urdu + Arabic",         color: "#059669", glow: "rgba(5,150,105,0.2)" },
  { id: "next_boom",        icon: "🚀", label: "Next Boom Predictor", sub: "Pattern → Viral Prediction", color: "#f59e0b", glow: "rgba(245,158,11,0.2)" },
  { id: "trending_radar",   icon: "📡", label: "Trending Radar",      sub: "10 Hot Topics Now",          color: "#ef4444", glow: "rgba(239,68,68,0.2)" },
  { id: "channel_audit",    icon: "🏆", label: "Channel Audit",       sub: "Score Your Strategy",        color: "#1a3a8f", glow: "rgba(26,58,143,0.2)" },
];

const HOOK_CATEGORIES = [
  { label: "😱 Shock", hooks: ["99% of people don't know this about {topic}...", "I can't believe nobody is talking about {topic}", "This will completely change how you think about {topic}", "The truth about {topic} that experts hide from you", "Warning: If you do {topic} this way, stop immediately"] },
  { label: "❓ Question", hooks: ["What if everything you know about {topic} is wrong?", "Have you ever wondered why {topic} never works for you?", "What would you do if you knew the secret to {topic}?", "Is {topic} actually worth your time? Here's the truth.", "Why do 95% of people fail at {topic}?"] },
  { label: "📊 Stat", hooks: ["In just 30 days doing {topic}, I went from 0 to 100K", "This one {topic} trick increased my results by 340%", "3 years ago I knew nothing about {topic} — here's what happened", "I tested {topic} for 90 days. The results shocked me.", "After analyzing 500 {topic} cases, I found the pattern"] },
  { label: "🚨 Urgency", hooks: ["You need to stop doing {topic} this way — right now", "If you don't learn {topic} today, you'll regret it in 2025", "This is your last chance to understand {topic} before it's too late", "Everyone doing {topic} the old way is getting left behind", "The {topic} strategy that's about to die — use it now"] },
  { label: "🎭 Story", hooks: ["3 years ago I was completely broke, then I discovered {topic}...", "I almost quit {topic} forever. Then this happened.", "My biggest {topic} failure taught me this expensive lesson", "Nobody believed I could {topic} — until I did this", "The day everything changed for me with {topic}"] },
  { label: "🔄 Myth-Bust", hooks: ["Everything you've been told about {topic} is a lie", "The {topic} advice that's actually destroying your results", "Stop following this popular {topic} advice — it doesn't work", "I believed the {topic} myth for 2 years. Here's what actually works.", "Unpopular opinion: {topic} doesn't work the way you think"] },
  { label: "💰 Result", hooks: ["This one {topic} change made me $10,000 in 30 days", "How I grew from 0 to 100K using just {topic}", "The exact {topic} system that generated 1 million views", "Copy my {topic} formula — it's working right now", "I used {topic} to quit my job. Here's exactly how."] },
  { label: "🇵🇰 Pakistani", hooks: ["Pakistani students: the {topic} secret nobody teaches in school", "How to {topic} in Pakistan with zero investment", "Ye {topic} ka tarika Pakistan mein bilkul kaam karta hai", "Pakistani {topic} guide — step by step for beginners", "Pakistan mein {topic} se paise kamane ka sahi tarika"] },
];

/* ── Helpers ─────────────────────────────────────────────────── */
function ScoreRing({ score, size = 80 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const c = score >= 85 ? "#10b981" : score >= 65 ? C.gold : "#ef4444";
  return (
    <div className="ats-score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(11,20,55,0.08)" strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease", filter: `drop-shadow(0 0 4px ${c}88)` }}/>
      </svg>
      <div className="ats-score-ring__text">
        <span className="ats-score-ring__num" style={{ fontSize: size > 70 ? 18 : 13 }}>{score}</span>
        <span className="ats-score-ring__label">SCORE</span>
      </div>
    </div>
  );
}

function ScoreBar({ score, label }) {
  const c = score >= 85 ? "#10b981" : score >= 65 ? C.gold : "#ef4444";
  return (
    <div className="ats-score-bar">
      <div className="ats-score-bar__row">
        <span style={{ color: C.slate }}>{label}</span>
        <span style={{ color: c }}>{score}/100</span>
      </div>
      <div className="ats-score-bar__track">
        <div className="ats-score-bar__fill" style={{ width: `${score}%`, background: `linear-gradient(90deg,${c}88,${c})` }}/>
      </div>
    </div>
  );
}

function TrafficLight({ value, label }) {
  const color = value === "high" || value === "green" ? "#10b981"
    : value === "medium" || value === "yellow" ? C.gold : "#ef4444";
  const emoji = value === "high" || value === "green" ? "🟢"
    : value === "medium" || value === "yellow" ? "🟡" : "🔴";
  return (
    <div className="ats-traffic-light">
      <span style={{ fontSize: 14 }}>{emoji}</span>
      <div>
        <div className="ats-traffic-light__label">{label}</div>
        <div className="ats-traffic-light__value" style={{ color }}>{value?.toUpperCase()}</div>
      </div>
    </div>
  );
}

function CopyBtn({ text, id, copied, copy, small, full }) {
  const ok = copied === id;
  return (
    <button
      onClick={() => copy(text, id)}
      className={`ats-copy-btn ${small ? "ats-copy-btn--sm" : "ats-copy-btn--md"} ${full ? "ats-copy-btn--full" : ""}`}
      style={{
        border: `1px solid ${ok ? "rgba(16,185,129,0.4)" : "rgba(11,20,55,0.12)"}`,
        background: ok ? "rgba(16,185,129,0.1)" : "rgba(11,20,55,0.04)",
        color: ok ? "#059669" : C.slate,
      }}
    >
      {ok ? "✅ Copied!" : "📋 Copy"}
    </button>
  );
}

function Card({ title, icon, accent, children, copyAll, copyId, copied, copy, onSectionEdit }) {
  return (
    <div className="ats-card" style={{ border: `1px solid rgba(11,20,55,0.08)` }}>
      <div className="ats-card__top-bar" style={{ background: `linear-gradient(90deg, transparent, ${accent || C.sky}, transparent)` }}/>
      <div className="ats-card__header">
        <div className="ats-card__title-row">
          {icon && <span style={{ fontSize: 15 }}>{icon}</span>}
          <span className="ats-card__title">{title}</span>
        </div>
        <div className="ats-card__actions">
          {onSectionEdit && (
            <button onClick={onSectionEdit} className="ats-refine-btn">✏️ Refine</button>
          )}
          {copyAll && <CopyBtn text={copyAll} id={copyId} copied={copied} copy={copy} small/>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Tag({ text, color = C.sky }) {
  return (
    <span className="ats-tag" style={{ background: `${color}14`, color, border: `1px solid ${color}30` }}>
      {text}
    </span>
  );
}

function FieldInput({ label, value, onChange, placeholder, type = "input", rows, hint }) {
  const baseStyle = {
    width: "100%", padding: "10px 13px",
    border: "1.5px solid rgba(59,130,246,0.18)",
    borderRadius: 10, fontSize: 14, color: C.navy, background: "#fafbff",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
    fontFamily: "'DM Sans',sans-serif",
  };
  return (
    <div>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>{label}</label>}
      {type === "textarea"
        ? <textarea style={{ ...baseStyle, minHeight: rows ? rows * 24 : 88, resize: "vertical", lineHeight: 1.6 }} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={e => e.target.style.borderColor = C.sky} onBlur={e => e.target.style.borderColor = "rgba(59,130,246,0.18)"}/>
        : <input style={baseStyle} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={e => e.target.style.borderColor = C.sky} onBlur={e => e.target.style.borderColor = "rgba(59,130,246,0.18)"}/>
      }
      {hint && <div style={{ fontSize: 11, color: C.slate, marginTop: 4, opacity: 0.7 }}>{hint}</div>}
    </div>
  );
}

function Skeleton() {
  return (
    <div>
      {[100, 75, 85, 60, 90].map((w, i) => (
        <div key={i} className="ats-skeleton-line" style={{ width: `${w}%` }}/>
      ))}
    </div>
  );
}

function RadarChart({ videos }) {
  if (!videos?.length) return null;
  const size = 200;
  const cx = size / 2, cy = size / 2, r = 75;
  const metrics = ["Views", "CTR", "Retention", "Likes", "Comments"];
  const points = (vals) => metrics.map((_, i) => {
    const angle = (i / metrics.length) * Math.PI * 2 - Math.PI / 2;
    const v = (vals[i] || 0) / 100;
    return [cx + r * v * Math.cos(angle), cy + r * v * Math.sin(angle)];
  });
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const colors = [C.sky, C.gold, "#10b981", "#ef4444", "#8b5cf6"];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {gridLevels.map(lvl => (
        <polygon key={lvl} points={metrics.map((_, i) => {
          const a = (i / metrics.length) * Math.PI * 2 - Math.PI / 2;
          return `${cx + r * lvl * Math.cos(a)},${cy + r * lvl * Math.sin(a)}`;
        }).join(" ")} fill="none" stroke="rgba(11,20,55,0.08)" strokeWidth={1}/>
      ))}
      {metrics.map((_, i) => {
        const a = (i / metrics.length) * Math.PI * 2 - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="rgba(11,20,55,0.1)" strokeWidth={1}/>;
      })}
      {videos.slice(0, 3).map((v, vi) => {
        const pts = points(v.scores || [50, 50, 50, 50, 50]);
        return <polygon key={vi} points={pts.map(p => p.join(",")).join(" ")} fill={`${colors[vi]}22`} stroke={colors[vi]} strokeWidth={2} strokeLinejoin="round"/>;
      })}
      {metrics.map((m, i) => {
        const a = (i / metrics.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + (r + 16) * Math.cos(a), y = cy + (r + 16) * Math.sin(a);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={700} fill={C.slate}>{m}</text>;
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   SECTION SIDEBAR DRAWER
══════════════════════════════════════════════════════════════ */
function SectionSidebar({ open, onClose, sectionTitle, sectionContent, onRegenerate, regenerating }) {
  const [instruction, setInstruction] = useState("");
  const [tone, setTone] = useState("same");
  const [length, setLength] = useState("same");
  return (
    <>
      {open && <div className="ats-section-sidebar-overlay" onClick={onClose}/>}
      <div className={`ats-section-sidebar ${open ? "ats-section-sidebar--open" : "ats-section-sidebar--closed"}`}>
        <div className="ats-section-sidebar__header">
          <div className="ats-section-sidebar__header-row">
            <div>
              <div className="ats-section-sidebar__meta">Refine Section</div>
              <div className="ats-section-sidebar__title">{sectionTitle}</div>
            </div>
            <button onClick={onClose} className="ats-section-sidebar__close">✕</button>
          </div>
        </div>
        <div className="ats-section-sidebar__body">
          {sectionContent && (
            <div style={{ marginBottom: 14 }}>
              <span className="ats-section-sidebar__section-label">Current Content</span>
              <div className="ats-section-sidebar__preview">
                {typeof sectionContent === "string" ? sectionContent.slice(0, 300) + "..." : JSON.stringify(sectionContent).slice(0, 200) + "..."}
              </div>
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label className="ats-section-sidebar__section-label">Your Instruction</label>
            <textarea
              className="ats-section-sidebar__textarea"
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              placeholder="e.g. Make it more aggressive and urgent... Add Pakistani cultural context... Focus on MDCAT students..."
              onFocus={e => e.target.style.borderColor = C.sky}
              onBlur={e => e.target.style.borderColor = "rgba(59,130,246,0.18)"}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div className="ats-section-sidebar__tone-label">Tone</div>
            <div className="ats-section-sidebar__tone-chips">
              {["same", "professional", "casual", "funny", "urdu", "arabic", "aggressive", "gentle"].map(t => (
                <button key={t} onClick={() => setTone(t)}
                  className="ats-section-sidebar__chip"
                  style={{ border: `1.5px solid ${tone === t ? C.sky : "rgba(11,20,55,0.12)"}`, background: tone === t ? `${C.sky}14` : "transparent", color: tone === t ? C.sky : C.slate }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div className="ats-section-sidebar__len-label">Length</div>
            <div className="ats-section-sidebar__len-row">
              {["shorter", "same", "longer"].map(l => (
                <button key={l} onClick={() => setLength(l)}
                  className="ats-section-sidebar__len-btn"
                  style={{ border: `1.5px solid ${length === l ? C.royal : "rgba(11,20,55,0.12)"}`, background: length === l ? `${C.royal}12` : "transparent", color: length === l ? C.royal : C.slate }}>
                  {l === "shorter" ? "📉 Shorter" : l === "same" ? "⏸ Same" : "📈 Longer"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="ats-section-sidebar__footer">
          <button onClick={() => onRegenerate({ instruction, tone, length })} disabled={regenerating} className="ats-section-sidebar__regen-btn">
            {regenerating ? "⏳ Regenerating…" : "🔄 Regenerate This Section"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOOK LIBRARY MODAL
══════════════════════════════════════════════════════════════ */
function HookLibraryModal({ open, onClose, onSelect, topicValue }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  if (!open) return null;
  const filtered = search
    ? HOOK_CATEGORIES.map(c => ({ ...c, hooks: c.hooks.filter(h => h.toLowerCase().includes(search.toLowerCase())) })).filter(c => c.hooks.length)
    : HOOK_CATEGORIES;
  return (
    <div className="ats-modal-overlay">
      <div className="ats-modal">
        <div className="ats-modal__header">
          <div className="ats-modal__title-row">
            <div>
              <div className="ats-modal__meta">🔥 Hook Formula Library</div>
              <div className="ats-modal__title">50+ Proven YouTube Hooks</div>
            </div>
            <button onClick={onClose} className="ats-modal__close">✕</button>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search hooks..." className="ats-modal__search"/>
        </div>
        {!search && (
          <div className="ats-modal__tabs">
            {HOOK_CATEGORIES.map((c, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className="ats-modal__tab"
                style={{ borderBottomColor: activeTab === i ? C.sky : "transparent", color: activeTab === i ? C.sky : C.slate }}>
                {c.label}
              </button>
            ))}
          </div>
        )}
        <div className="ats-modal__body">
          {(search ? filtered : [HOOK_CATEGORIES[activeTab]]).map((cat, ci) => (
            <div key={ci}>
              {search && <div style={{ fontSize: 11, fontWeight: 800, color: C.slate, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, marginTop: ci > 0 ? 14 : 0 }}>{cat.label}</div>}
              {cat.hooks.map((h, i) => (
                <div key={i} className="ats-hook-item">
                  <span className="ats-hook-item__text">{h.replace("{topic}", topicValue || "your topic")}</span>
                  <button onClick={() => { onSelect(h); onClose(); }} className="ats-hook-item__use">Use This</button>
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
   TOOL SIDEBAR (shared between desktop & mobile)
══════════════════════════════════════════════════════════════ */
function ToolList({ activeTool, onSelect }) {
  return (
    <>
      {TOOLS.map(t => (
        <button key={t.id} className={`ats-tool-btn ${activeTool === t.id ? "ats-tool-btn--active" : ""}`}
          onClick={() => onSelect(t.id)}
          style={{
            border: `1px solid ${activeTool === t.id ? `${t.color}40` : "rgba(11,20,55,0.07)"}`,
            background: activeTool === t.id ? `${t.color}10` : "rgba(255,255,255,0.7)",
            boxShadow: activeTool === t.id ? `0 4px 16px ${t.glow}` : "none",
          }}>
          <div className="ats-tool-btn__icon"
            style={{ background: activeTool === t.id ? `${t.color}18` : "rgba(11,20,55,0.04)", border: `1px solid ${activeTool === t.id ? `${t.color}40` : "rgba(11,20,55,0.08)"}` }}>
            {t.icon}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="ats-tool-btn__label" style={{ color: activeTool === t.id ? t.color : C.navy }}>{t.label}</div>
            <div className="ats-tool-btn__sub" style={{ color: activeTool === t.id ? t.color : C.slate }}>{t.sub}</div>
          </div>
          {activeTool === t.id && <div className="ats-tool-btn__dot" style={{ background: t.color }}/>}
        </button>
      ))}
      <div className="ats-sidebar__badge">
        <div className="ats-sidebar__badge-label">🏆 AIDLA PRO</div>
        <div className="ats-sidebar__badge-sub">YouTube-grade AI Engine</div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN AUTOTUBE STUDIO
══════════════════════════════════════════════════════════════ */
export default function AutoTubeStudio() {
  const navigate = useNavigate();
  const { copied, copy } = useCopy();
  const resultRef = useRef(null);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTool, setActiveTool] = useState("quick_generator");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [savingName, setSavingName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarSection, setSidebarSection] = useState({ title: "", content: "" });
  const [sidebarRegen, setSidebarRegen] = useState(false);
  const [hookLibOpen, setHookLibOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  // Global prompt
  const [globalPrompt, setGlobalPrompt] = useState("");
  const [globalPromptExpanded, setGlobalPromptExpanded] = useState(false);
  const [globalTags, setGlobalTags] = useState([]);

  // Tool inputs
  const [topic, setTopic] = useState("");
  const [topicPrompt, setTopicPrompt] = useState("");
  const [showTopicPrompt, setShowTopicPrompt] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [audience, setAudience] = useState("");
  const [niche, setNiche] = useState("");
  const [existTitle, setExistTitle] = useState("");
  const [comment, setComment] = useState("");
  const [context, setContext] = useState("");
  const [idea, setIdea] = useState("");
  const [channelSize, setChannelSize] = useState("");
  const [language, setLanguage] = useState("");
  const [perToolPrompt, setPerToolPrompt] = useState("");
  const [spyMode, setSpyMode] = useState("title");
  const [spyInput, setSpyInput] = useState("");
  const [boomVideos, setBoomVideos] = useState(Array.from({ length: 5 }, () => ({ title: "", script: "", performance: "" })));
  const [auditTitles, setAuditTitles] = useState(["", "", "", "", ""]);
  const [auditData, setAuditData] = useState("");
  const [radarNiche, setRadarNiche] = useState("");
  const [mlTopic, setMlTopic] = useState("");
  const [mlKeywords, setMlKeywords] = useState("");
  const [mlAudience, setMlAudience] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { navigate("/login?redirect=/autotube/studio"); return; }
      setUser(data.user);
      setAuthLoading(false);
    });
  }, [navigate]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.rpc("autotube_get_history", { p_user_id: user.id });
    setHistory(data || []);
  }, [user]);

  useEffect(() => { if (user) loadHistory(); }, [user, loadHistory]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setShowMobileSidebar(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const addGlobalTag = () => {
    if (!globalPrompt.trim()) return;
    setGlobalTags(t => [...t, globalPrompt.trim()]);
    setGlobalPrompt("");
  };

  const switchTool = (toolId) => {
    setActiveTool(toolId);
    setResult(null);
    setError("");
    setSaved(false);
    setPerToolPrompt("");
    setShowMobileSidebar(false);
  };

  const handleGenerate = async () => {
    setLoading(true); setError(""); setResult(null); setSaved(false); setProgress(0);
    const tick = setInterval(() => setProgress(p => Math.min(p + Math.random() * 10, 88)), 700);
    try {
      const combinedPrompt = [...globalTags, perToolPrompt, topicPrompt].filter(Boolean).join(". ");
      let input = { language, global_prompt: combinedPrompt };

      if (activeTool === "quick_generator" || activeTool === "full_video_az")
        input = { ...input, topic, keywords, audience };
      else if (activeTool === "content_calendar")
        input = { ...input, niche, audience };
      else if (activeTool === "idea_to_video")
        input = { ...input, idea, audience };
      else if (activeTool === "title_optimizer")
        input = { ...input, title: existTitle, topic };
      else if (activeTool === "comment_replier")
        input = { ...input, comment, context };
      else if (activeTool === "niche_analyzer")
        input = { ...input, niche, channel_size: channelSize };
      else if (activeTool === "youtube_shorts")
        input = { ...input, topic, audience, niche };
      else if (activeTool === "competitor_spy")
        input = { ...input, spy_mode: spyMode, spy_input: spyInput };
      else if (activeTool === "hook_library")
        input = { ...input, topic, niche };
      else if (activeTool === "multilang_batch")
        input = { ...input, topic: mlTopic, keywords: mlKeywords, audience: mlAudience };
      else if (activeTool === "next_boom")
        input = { ...input, videos: boomVideos };
      else if (activeTool === "trending_radar")
        input = { ...input, niche: radarNiche };
      else if (activeTool === "channel_audit")
        input = { ...input, titles: auditTitles.filter(Boolean), performance_data: auditData };

      const res = await callAutotube(activeTool, input);
      clearInterval(tick); setProgress(100);
      setTimeout(() => {
        setResult(res);
        const toolObj = TOOLS.find(t => t.id === activeTool);
        setSavingName(`${toolObj?.label} — ${topic || niche || existTitle || idea || mlTopic || radarNiche || spyInput || "Result"}`);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }, 300);
    } catch (e) {
      clearInterval(tick); setProgress(0);
      setError(e.message || "Generation failed. Please try again.");
    }
    setTimeout(() => setLoading(false), 400);
  };

  const handleSave = async () => {
    if (!result || !user) return;
    setSaving(true);
    await supabase.rpc("autotube_save_history", { p_user_id: user.id, p_name: savingName, p_tool: activeTool, p_input: {}, p_output: result });
    setSaved(true); setSaving(false); await loadHistory();
  };

  const handleDeleteHistory = async (id) => {
    await supabase.rpc("autotube_delete_history", { p_id: id, p_user_id: user.id });
    await loadHistory();
  };

  const handleRename = async (id) => {
    await supabase.rpc("autotube_rename_history", { p_id: id, p_user_id: user.id, p_name: renameVal });
    setRenamingId(null); setRenameVal(""); await loadHistory();
  };

  const loadHistoryItem = (item) => {
    setActiveTool(item.tool); setResult(item.output); setShowHistory(false);
  };

  const openSectionEdit = (title, content) => {
    setSidebarSection({ title, content });
    setSidebarOpen(true);
  };

  const handleSectionRegenerate = async ({ instruction, tone, length }) => {
    setSidebarRegen(true);
    await new Promise(r => setTimeout(r, 1500));
    setSidebarRegen(false);
    setSidebarOpen(false);
  };

  const activeTool_ = TOOLS.find(t => t.id === activeTool);

  if (authLoading) return (
    <div className="ats-loading">
      <div style={{ textAlign: "center" }}>
        <span className="ats-loading__icon">🎬</span>
        <div className="ats-loading__text">Loading Studio…</div>
      </div>
    </div>
  );

  return (
    <div className="ats-page">
      <div className="ats-orb ats-orb--blue" aria-hidden="true"/>
      <div className="ats-orb ats-orb--gold" aria-hidden="true"/>

      {/* ── HEADER ── */}
      <header className="ats-header">
        <div className="ats-header__inner">
          <div className="ats-header__left">
            {/* Mobile hamburger */}
            <button className="ats-menu-btn" onClick={() => setShowMobileSidebar(v => !v)} aria-label="Open tools menu">☰</button>
            <Link to="/autotube" className="ats-header__back">← AutoTube</Link>
            <div className="ats-header__divider"/>
            <div className="ats-header__brand">
              <div className="ats-header__logo">🎬</div>
              <div>
                <div className="ats-header__title">AutoTube <span>Studio</span></div>
                <div className="ats-header__sub">PRO · 14 AI TOOLS</div>
              </div>
            </div>
          </div>
          <div className="ats-header__right">
            <button
              onClick={() => setShowHistory(v => !v)}
              className="ats-header-btn"
              style={{
                background: showHistory ? `${C.sky}14` : "rgba(11,20,55,0.05)",
                color: showHistory ? C.sky : C.slate,
                border: `1px solid ${showHistory ? `${C.sky}40` : "rgba(11,20,55,0.1)"}`,
              }}
            >
              📂 <span>History</span>
              {history.length > 0 && <span className="ats-history-badge">{history.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ── GLOBAL PROMPT BAR ── */}
      <div className="ats-global-bar">
        <div className="ats-global-bar__inner">
          <button onClick={() => setGlobalPromptExpanded(v => !v)} className="ats-global-bar__toggle">
            <span className="ats-global-bar__toggle-label">🧠 Global AI Instruction</span>
            <div className="ats-global-bar__tags">
              {globalTags.map((t, i) => (
                <span key={i} className="ats-global-bar__tag">
                  {t}
                  <button onClick={e => { e.stopPropagation(); setGlobalTags(g => g.filter((_, j) => j !== i)); }} className="ats-global-bar__tag-remove">✕</button>
                </span>
              ))}
            </div>
            <span className={`ats-global-bar__chevron ${globalPromptExpanded ? "ats-global-bar__chevron--open" : ""}`}>▼</span>
          </button>
          {globalPromptExpanded && (
            <div className="ats-global-bar__expanded">
              <div className="ats-global-bar__input-row">
                <input
                  value={globalPrompt}
                  onChange={e => setGlobalPrompt(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addGlobalTag()}
                  placeholder='"Always write in Urdu" / "Focus on Pakistani students" / "Make it funny"'
                  className="ats-global-bar__input"
                />
                <button onClick={addGlobalTag} className="ats-global-bar__add-btn">+ Add Tag</button>
              </div>
              <div className="ats-global-bar__hint">Press Enter or click Add Tag. Applies to all generations in this session.</div>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <div className={`ats-mobile-overlay ${showMobileSidebar ? "is-open" : ""}`} onClick={() => setShowMobileSidebar(false)}/>
      <div className={`ats-mobile-sidebar ${showMobileSidebar ? "is-open" : ""}`}>
        <div className="ats-mobile-sidebar__header">
          <span className="ats-mobile-sidebar__title">🎬 Tools</span>
          <button onClick={() => setShowMobileSidebar(false)} className="ats-mobile-sidebar__close">✕</button>
        </div>
        <ToolList activeTool={activeTool} onSelect={switchTool}/>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="ats-content">

        {/* ── HISTORY DRAWER ── */}
        {showHistory && (
          <div className="ats-history">
            <div className="ats-history__header">
              <div className="ats-history__title">📂 Saved Results</div>
              <button onClick={() => setShowHistory(false)} className="ats-history__close">✕</button>
            </div>
            {history.length === 0 ? (
              <div className="ats-history__empty">No saved results yet.</div>
            ) : (
              <div className="ats-history__list">
                {history.map(h => {
                  const t = TOOLS.find(x => x.id === h.tool);
                  return (
                    <div key={h.id} className="ats-history-item">
                      <div className="ats-history-item__icon" style={{ background: `${t?.color || C.sky}14`, border: `1px solid ${t?.color || C.sky}30` }}>{t?.icon}</div>
                      <div className="ats-history-item__info">
                        {renamingId === h.id ? (
                          <div className="ats-history-item__rename">
                            <input value={renameVal} onChange={e => setRenameVal(e.target.value)} className="ats-history-item__rename-input" autoFocus/>
                            <button onClick={() => handleRename(h.id)} className="btn btn--sm btn--sky">Save</button>
                            <button onClick={() => setRenamingId(null)} className="btn btn--sm btn--ghost">✕</button>
                          </div>
                        ) : (
                          <>
                            <div className="ats-history-item__name">{h.name}</div>
                            <div className="ats-history-item__meta">{t?.label} · {new Date(h.created_at).toLocaleDateString()}</div>
                          </>
                        )}
                      </div>
                      <div className="ats-history-item__actions">
                        <button onClick={() => loadHistoryItem(h)} className="btn btn--sm" style={{ background: `${t?.color || C.sky}14`, color: t?.color || C.sky, border: `1px solid ${t?.color || C.sky}30` }}>Load</button>
                        <button onClick={() => { setRenamingId(h.id); setRenameVal(h.name); }} className="btn btn--sm btn--ghost">✏️</button>
                        <button onClick={() => handleDeleteHistory(h.id)} className="btn btn--sm btn--danger">🗑</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── LAYOUT GRID ── */}
        <div className="ats-layout">

          {/* ══ DESKTOP SIDEBAR ══ */}
          <aside className="ats-sidebar">
            <ToolList activeTool={activeTool} onSelect={switchTool}/>
          </aside>

          {/* ══ MAIN AREA ══ */}
          <main>

            {/* ── TOOL INPUT PANEL ── */}
            <div className="ats-tool-panel"
              style={{ border: `1px solid ${activeTool_?.color}28`, boxShadow: `0 4px 24px ${activeTool_?.glow}` }}>
              <div className="ats-tool-panel__top-bar" style={{ background: `linear-gradient(90deg,transparent,${activeTool_?.color},transparent)` }}/>

              {/* Tool Header */}
              <div className="ats-tool-panel__header">
                <div className="ats-tool-panel__icon-wrap"
                  style={{ background: `linear-gradient(135deg,${activeTool_?.color}20,${activeTool_?.color}08)`, border: `1.5px solid ${activeTool_?.color}40`, boxShadow: `0 4px 16px ${activeTool_?.glow}` }}>
                  {activeTool_?.icon}
                </div>
                <div>
                  <div className="ats-tool-panel__title">{activeTool_?.label}</div>
                  <div className="ats-tool-panel__sub">Fill in details · AI generates premium YouTube content</div>
                </div>
              </div>

              <div className="ats-fields">
                {/* Language */}
                <div className="ats-grid-2">
                  <FieldInput label="🌐 Output Language" value={language} onChange={setLanguage} placeholder="Auto-detect (recommended)"/>
                  <div/>
                </div>

                {/* ── TOOL-SPECIFIC INPUTS ── */}
                {(activeTool === "quick_generator" || activeTool === "full_video_az") && (<>
                  <div style={{ position: "relative" }}>
                    <FieldInput label="📹 Video Topic *" value={topic} onChange={setTopic} placeholder="" hint="Be specific for better SEO output"/>
                    <button onClick={() => setHookLibOpen(true)} style={{ position: "absolute", right: 10, top: 28, padding: "3px 9px", fontSize: 10, fontWeight: 700, border: `1px solid ${C.sky}40`, borderRadius: 6, cursor: "pointer", background: `${C.sky}10`, color: C.sky }}>🔥 Hooks</button>
                  </div>
                  <div className="ats-grid-2">
                    <FieldInput label="🔑 Keywords" value={keywords} onChange={setKeywords} placeholder="youtube growth, viral"/>
                    <FieldInput label="👥 Audience" value={audience} onChange={setAudience} placeholder="Beginners, Students"/>
                  </div>
                  <div>
                    <button onClick={() => setShowTopicPrompt(v => !v)} className="btn btn--sm btn--ghost">
                      {showTopicPrompt ? "✕ Hide" : "🎯 Add Topic Prompt"}
                    </button>
                    {showTopicPrompt && (
                      <div style={{ marginTop: 8 }}>
                        <FieldInput label="Topic-Specific Instruction" value={topicPrompt} onChange={setTopicPrompt} placeholder="e.g. Focus on Pakistani students, include Urdu phrases, add MDCAT context"/>
                      </div>
                    )}
                  </div>
                </>)}

                {activeTool === "content_calendar" && (<>
                  <FieldInput label="📺 Channel Niche *" value={niche} onChange={setNiche} placeholder="e.g. Tech reviews, Online earning, Cooking"/>
                  <FieldInput label="👥 Target Audience" value={audience} onChange={setAudience} placeholder="Pakistani students, Young professionals"/>
                </>)}

                {activeTool === "idea_to_video" && (<>
                  <FieldInput label="💡 Your Video Idea *" value={idea} onChange={setIdea} placeholder="e.g. 10 ways to earn $500/month as a student in Pakistan" type="textarea" rows={3}/>
                  <FieldInput label="👥 Target Audience" value={audience} onChange={setAudience} placeholder="Students, Beginners"/>
                </>)}

                {activeTool === "title_optimizer" && (<>
                  <FieldInput label="📝 Your Current Title *" value={existTitle} onChange={setExistTitle} placeholder="Paste your existing YouTube title here"/>
                  <FieldInput label="📹 Video Topic (context)" value={topic} onChange={setTopic} placeholder="Brief description of your video"/>
                </>)}

                {activeTool === "comment_replier" && (<>
                  <FieldInput label="💬 YouTube Comment *" value={comment} onChange={setComment} placeholder="Paste the comment here..." type="textarea" rows={3}/>
                  <FieldInput label="🎬 Video Context" value={context} onChange={setContext} placeholder="Brief description of your video"/>
                </>)}

                {activeTool === "niche_analyzer" && (<>
                  <FieldInput label="📊 Your Channel Niche *" value={niche} onChange={setNiche} placeholder="e.g. Online earning, Tech, Education, Finance"/>
                  <FieldInput label="📈 Channel Size" value={channelSize} onChange={setChannelSize} placeholder="New / 1K subs / 10K subs / 100K subs"/>
                </>)}

                {activeTool === "youtube_shorts" && (<>
                  <div style={{ position: "relative" }}>
                    <FieldInput label="🩳 Short Topic *" value={topic} onChange={setTopic} placeholder="e.g. 3 quick tips to grow YouTube in 60 seconds"/>
                    <button onClick={() => setHookLibOpen(true)} style={{ position: "absolute", right: 10, top: 28, padding: "3px 9px", fontSize: 10, fontWeight: 700, border: "1px solid #ec489940", borderRadius: 6, cursor: "pointer", background: "#ec489910", color: "#ec4899" }}>🔥 Hooks</button>
                  </div>
                  <div className="ats-grid-2">
                    <FieldInput label="👥 Audience" value={audience} onChange={setAudience} placeholder="Students, Creators"/>
                    <FieldInput label="📺 Niche" value={niche} onChange={setNiche} placeholder="Education, Tech, Lifestyle"/>
                  </div>
                </>)}

                {activeTool === "competitor_spy" && (<>
                  <div className="ats-spy-mode-row">
                    {[{ id: "title", label: "✏️ Title" }, { id: "url", label: "🔗 URL" }, { id: "channel", label: "📺 Channel" }].map(m => (
                      <button key={m.id} onClick={() => setSpyMode(m.id)}
                        className="ats-spy-mode-btn"
                        style={{ border: `1.5px solid ${spyMode === m.id ? C.royal : "rgba(11,20,55,0.12)"}`, background: spyMode === m.id ? `${C.royal}14` : "transparent", color: spyMode === m.id ? C.royal : C.slate }}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <FieldInput
                    label={spyMode === "title" ? "Competitor Title *" : spyMode === "url" ? "YouTube Video URL *" : "Channel URL *"}
                    value={spyInput} onChange={setSpyInput}
                    placeholder={spyMode === "title" ? "Paste their exact video title..." : spyMode === "url" ? "https://youtube.com/watch?v=..." : "https://youtube.com/@channelname"}
                  />
                </>)}

                {activeTool === "hook_library" && (<>
                  <FieldInput label="📹 Your Topic (for personalization)" value={topic} onChange={setTopic} placeholder="e.g. YouTube growth, making money online, MDCAT"/>
                  <FieldInput label="📺 Channel Niche" value={niche} onChange={setNiche} placeholder="e.g. Education, Tech, Lifestyle"/>
                  <div className="ats-info-box" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", color: "#b91c1c" }}>
                    💡 Or browse hooks directly below by clicking <strong>🔥 Browse Hook Library</strong>
                  </div>
                  <button onClick={() => setHookLibOpen(true)} className="btn btn--full" style={{ padding: 11, background: "linear-gradient(135deg,#ef4444,#f97316)", color: "#fff", borderRadius: 11, fontWeight: 800, fontSize: 14, border: "none" }}>
                    🔥 Browse Hook Library (50+ Hooks)
                  </button>
                </>)}

                {activeTool === "multilang_batch" && (<>
                  <div className="ats-info-box" style={{ background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)", color: "#047857" }}>
                    🌍 Generates complete SEO package in English + اردو + العربية simultaneously
                  </div>
                  <FieldInput label="📹 Video Topic *" value={mlTopic} onChange={setMlTopic} placeholder="e.g. How to study smarter and get better grades"/>
                  <div className="ats-grid-2">
                    <FieldInput label="🔑 Keywords" value={mlKeywords} onChange={setMlKeywords} placeholder="study tips, grades, students"/>
                    <FieldInput label="👥 Audience" value={mlAudience} onChange={setMlAudience} placeholder="Students, Beginners"/>
                  </div>
                </>)}

                {activeTool === "next_boom" && (<>
                  <div className="ats-info-box" style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", color: "#92400e" }}>
                    🚀 Enter your last 5 videos. AI analyzes patterns and predicts your next viral hit.
                  </div>
                  {boomVideos.map((v, i) => (
                    <div key={i} className="ats-boom-video">
                      <div className="ats-boom-video__label">Video {i + 1}</div>
                      <input value={v.title} onChange={e => { const n = [...boomVideos]; n[i] = { ...n[i], title: e.target.value }; setBoomVideos(n); }} placeholder={`Video ${i + 1} title *`}/>
                      <input value={v.performance} onChange={e => { const n = [...boomVideos]; n[i] = { ...n[i], performance: e.target.value }; setBoomVideos(n); }} placeholder="Performance: e.g. 45K views, 8.2% CTR, 62% retention"/>
                      <textarea value={v.script} onChange={e => { const n = [...boomVideos]; n[i] = { ...n[i], script: e.target.value }; setBoomVideos(n); }} placeholder="Script excerpt (optional)" rows={2}/>
                    </div>
                  ))}
                </>)}

                {activeTool === "trending_radar" && (
                  <FieldInput label="📺 Channel Niche *" value={radarNiche} onChange={setRadarNiche} placeholder="e.g. Pakistani education, Tech reviews, Online earning, Cooking"/>
                )}

                {activeTool === "channel_audit" && (<>
                  <div className="ats-info-box" style={{ background: "rgba(26,58,143,0.05)", border: "1px solid rgba(26,58,143,0.15)", color: C.royal }}>
                    🏆 Paste your 5 video titles. AI scores your full channel strategy.
                  </div>
                  {auditTitles.map((t, i) => (
                    <input key={i} value={t} onChange={e => { const n = [...auditTitles]; n[i] = e.target.value; setAuditTitles(n); }}
                      placeholder={`Video title ${i + 1}${i === 0 ? " *" : ""}`}
                      className="ats-audit-input"/>
                  ))}
                  <FieldInput label="📊 Performance Notes (optional)" value={auditData} onChange={setAuditData} type="textarea" rows={2} placeholder="e.g. Avg 5K views, 4% CTR, main audience is Pakistani students, posted weekly..."/>
                </>)}

                {/* Per-tool custom prompt */}
                <div className="ats-prompt-divider">
                  <FieldInput label={`🎯 Custom Prompt for ${activeTool_?.label} (optional)`} value={perToolPrompt} onChange={setPerToolPrompt} placeholder={`Override or extend AI for this tool only. e.g. "Make it more aggressive" / "Add Pakistani context" / "Use Urdu phrases"`}/>
                </div>

                {error && <div className="ats-error">⚠️ {error}</div>}

                {loading && (
                  <div>
                    <div className="ats-progress__row">
                      <span>⚡ Generating premium content…</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="ats-progress__bar-track">
                      <div className="ats-progress__bar-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${activeTool_?.color}88,${activeTool_?.color})` }}/>
                    </div>
                    <div style={{ marginTop: 10 }}><Skeleton/></div>
                  </div>
                )}

                <button className="ats-gen-btn" onClick={handleGenerate} disabled={loading}
                  style={{
                    background: loading ? "rgba(11,20,55,0.05)" : `linear-gradient(135deg,${activeTool_?.color},${activeTool_?.color}bb)`,
                    color: loading ? C.slate : "#fff",
                    border: `1px solid ${loading ? "rgba(11,20,55,0.1)" : activeTool_?.color + "55"}`,
                    boxShadow: loading ? "none" : `0 4px 20px ${activeTool_?.glow}`,
                  }}>
                  {loading ? "⏳ Generating… (10–30 seconds)" : `${activeTool_?.icon}  Generate ${activeTool_?.label}`}
                </button>
              </div>
            </div>

            {/* ══ RESULTS ══ */}
            {result && (
              <div ref={resultRef} className="ats-result">

                {/* Save bar */}
                <div className="ats-save-bar">
                  <span style={{ fontSize: 15 }}>💾</span>
                  <input value={savingName} onChange={e => setSavingName(e.target.value)} className="ats-save-bar__input" placeholder="Name this result…"/>
                  <button onClick={handleSave} disabled={saving || saved}
                    className="ats-save-bar__btn"
                    style={{ background: saved ? "rgba(16,185,129,0.12)" : "linear-gradient(135deg,#059669,#10b981)", color: saved ? "#059669" : "#fff", border: saved ? "1px solid rgba(16,185,129,0.3)" : "none", boxShadow: saved ? "none" : "0 4px 14px rgba(16,185,129,0.3)" }}>
                    {saved ? "✅ Saved!" : saving ? "Saving…" : "💾 Save Result"}
                  </button>
                </div>

                {/* SEO Score */}
                {result.seo_score && (
                  <Card title="SEO Score" icon="📊" accent="#10b981" onSectionEdit={() => openSectionEdit("SEO Score", result.seo_score)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                      <ScoreRing score={result.seo_score}/>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.7, marginBottom: 10 }}>
                          {result.seo_score >= 85 ? "🟢 Excellent — highly optimised for YouTube." : result.seo_score >= 65 ? "🟡 Good — a few tweaks can boost visibility." : "🔴 Needs improvement — apply recommendations below."}
                        </div>
                        {result.seo_breakdown && Object.entries(result.seo_breakdown).map(([k, v]) => (
                          <ScoreBar key={k} score={v} label={k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}/>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                {/* ── Quick / Full / Idea Results ── */}
                {["quick_generator", "full_video_az", "idea_to_video"].includes(activeTool) && (<>
                  {result.titles && (
                    <Card title="Title Suggestions" icon="🎯" accent={C.sky} copyAll={result.titles.join("\n")} copyId="all-titles" copied={copied} copy={copy} onSectionEdit={() => openSectionEdit("Titles", result.titles)}>
                      {result.titles.map((t, i) => (
                        <div key={i} className="ats-title-row">
                          <span className="ats-title-row__num">#{i + 1}</span>
                          <span className="ats-title-row__text">{t}</span>
                          <span className="ats-title-row__len" style={{ color: t.length > 70 ? "#ef4444" : C.slate }}>{t.length}</span>
                          <CopyBtn text={t} id={`title-${i}`} copied={copied} copy={copy} small/>
                        </div>
                      ))}
                    </Card>
                  )}

                  {result.hook && (
                    <Card title="Opening Hook (first 15s)" icon="🎣" accent={C.gold} onSectionEdit={() => openSectionEdit("Hook", result.hook)}>
                      <div className="ats-hook-box">{result.hook}</div>
                      <CopyBtn text={result.hook} id="hook" copied={copied} copy={copy}/>
                    </Card>
                  )}

                  {result.script_sections && (
                    <Card title="Full Video Script" icon="📜" accent={C.royal}
                      copyAll={[result.intro, ...(result.script_sections || []).map(s => `${s.heading}\n${s.content}`), result.outro].filter(Boolean).join("\n\n")}
                      copyId="full-script" copied={copied} copy={copy} onSectionEdit={() => openSectionEdit("Script", result.script_sections)}>
                      {result.intro && (
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 9, fontWeight: 800, color: "#ef4444", letterSpacing: "0.1em", marginBottom: 7, textTransform: "uppercase" }}>INTRO</div>
                          <pre className="ats-pre">{result.intro}</pre>
                          <div style={{ marginTop: 7 }}><CopyBtn text={result.intro} id="intro" copied={copied} copy={copy} small/></div>
                        </div>
                      )}
                      {(result.script_sections || []).map((s, i) => (
                        <div key={i} className="ats-script-section" style={{ borderBottom: i < result.script_sections.length - 1 ? "1px solid rgba(11,20,55,0.06)" : "none" }}>
                          <div className="ats-script-section__header">
                            <div className="ats-script-section__title-row">
                              <span className="ats-script-section__num" style={{ background: `${C.royal}18`, border: `1px solid ${C.royal}30`, color: C.royal }}>{i + 1}</span>
                              <span style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>{s.heading}</span>
                            </div>
                            <div className="ats-script-section__actions">
                              <button onClick={() => openSectionEdit(s.heading, s.content)} className="btn btn--sm btn--ghost">✏️ Refine</button>
                              <CopyBtn text={s.content} id={`sec-${i}`} copied={copied} copy={copy} small/>
                            </div>
                          </div>
                          <pre style={{ fontSize: 12, color: C.slate, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", margin: 0, wordBreak: "break-word" }}>{s.content}</pre>
                        </div>
                      ))}
                      {result.outro && (
                        <div>
                          <div style={{ fontSize: 9, fontWeight: 800, color: "#ef4444", letterSpacing: "0.1em", marginBottom: 7, textTransform: "uppercase" }}>OUTRO</div>
                          <pre className="ats-pre">{result.outro}</pre>
                          <div style={{ marginTop: 7 }}><CopyBtn text={result.outro} id="outro" copied={copied} copy={copy} small/></div>
                        </div>
                      )}
                    </Card>
                  )}

                  {result.description && (
                    <Card title="Full SEO Description" icon="📝" accent="#10b981" copyAll={result.description} copyId="desc" copied={copied} copy={copy} onSectionEdit={() => openSectionEdit("Description", result.description)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: result.description.length > 4500 ? "#ef4444" : result.description.length > 3000 ? C.gold : "#10b981", fontWeight: 700, padding: "2px 9px", background: result.description.length > 4500 ? "rgba(239,68,68,0.08)" : result.description.length > 3000 ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)", border: `1px solid ${result.description.length > 4500 ? "rgba(239,68,68,0.2)" : result.description.length > 3000 ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"}`, borderRadius: 20 }}>{result.description.length} chars</span>
                        <span style={{ fontSize: 11, color: C.slate }}>Optimal: 300–500 words</span>
                      </div>
                      <pre className="ats-pre">{result.description}</pre>
                    </Card>
                  )}

                  {result.tags && (
                    <Card title={`Tags (${result.tags.length})`} icon="🏷️" accent="#ef4444" copyAll={result.tags.join(",")} copyId="tags" copied={copied} copy={copy} onSectionEdit={() => openSectionEdit("Tags", result.tags)}>
                      <div className="ats-tags-wrap">{result.tags.map(t => <Tag key={t} text={t} color="#ef4444"/>)}</div>
                    </Card>
                  )}

                  {result.hashtags && (
                    <Card title="Hashtags" icon="#️⃣" accent={C.sky} copyAll={result.hashtags.join(" ")} copyId="hash" copied={copied} copy={copy}>
                      <div className="ats-tags-wrap">{result.hashtags.map(h => <Tag key={h} text={h} color={C.sky}/>)}</div>
                    </Card>
                  )}

                  {result.thumbnail_texts && (
                    <Card title="Thumbnail Text Ideas" icon="🖼️" accent={C.gold} onSectionEdit={() => openSectionEdit("Thumbnail Texts", result.thumbnail_texts)}>
                      {result.thumbnail_texts.map((t, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 11, marginBottom: 7, gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 15, fontWeight: 900, color: C.navy, flex: 1, minWidth: 0, wordBreak: "break-word" }}>{t}</span>
                          <CopyBtn text={t} id={`thumb-${i}`} copied={copied} copy={copy} small/>
                        </div>
                      ))}
                    </Card>
                  )}

                  {result.cta && (
                    <Card title="Call-to-Action Lines" icon="📣" accent="#06b6d4" onSectionEdit={() => openSectionEdit("CTA", result.cta)}>
                      <div style={{ fontSize: 13, color: C.navy, lineHeight: 1.8, marginBottom: 10, whiteSpace: "pre-wrap" }}>{result.cta}</div>
                      <CopyBtn text={result.cta} id="cta" copied={copied} copy={copy}/>
                    </Card>
                  )}

                  {result.first_comment && (
                    <Card title="Pinned First Comment" icon="📌" accent={C.royal} copyAll={result.first_comment} copyId="firstcomment" copied={copied} copy={copy} onSectionEdit={() => openSectionEdit("First Comment", result.first_comment)}>
                      <pre className="ats-pre">{result.first_comment}</pre>
                    </Card>
                  )}

                  {result.upload_checklist && (
                    <Card title="Upload Checklist" icon="✅" accent="#10b981">
                      <div className="ats-checklist-grid">
                        {result.upload_checklist.map((item, i) => (
                          <label key={i} className="ats-checklist-item">
                            <input type="checkbox" style={{ width: 15, height: 15, accentColor: "#10b981", flexShrink: 0 }}/>
                            <span style={{ fontSize: 12, color: C.slate }}>{item}</span>
                          </label>
                        ))}
                      </div>
                    </Card>
                  )}

                  {result.monetization_tips && (
                    <Card title="Monetization Tips" icon="💰" accent={C.gold}>
                      {result.monetization_tips.map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < result.monetization_tips.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", alignItems: "flex-start" }}>
                          <span style={{ width: 20, height: 20, borderRadius: 5, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: C.gold, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                          <span style={{ fontSize: 12, color: C.slate, lineHeight: 1.6 }}>{t}</span>
                        </div>
                      ))}
                    </Card>
                  )}
                </>)}

                {/* ── Content Calendar ── */}
                {activeTool === "content_calendar" && result.days && (<>
                  {result.niche_analysis && <Card title="Niche Analysis" icon="🔍" accent={C.royal} onSectionEdit={() => openSectionEdit("Niche Analysis", result.niche_analysis)}><p style={{ fontSize: 13, color: C.slate, lineHeight: 1.75 }}>{result.niche_analysis}</p></Card>}
                  {result.posting_strategy && <Card title="Posting Strategy" icon="📅" accent="#06b6d4" onSectionEdit={() => openSectionEdit("Posting Strategy", result.posting_strategy)}><p style={{ fontSize: 13, color: C.slate, lineHeight: 1.75 }}>{result.posting_strategy}</p></Card>}
                  <Card title="30-Day Content Calendar" icon="📆" accent={C.royal} copyAll={result.days.map(d => `Day ${d.day}: ${d.title}`).join("\n")} copyId="calendar" copied={copied} copy={copy}>
                    {result.days.map((d, i) => (
                      <div key={i} className="ats-cal-item">
                        <div className="ats-cal-item__header">
                          <div className="ats-cal-item__tags">
                            <span style={{ fontSize: 9, fontWeight: 900, color: "#fff", background: `linear-gradient(135deg,${C.navy},${C.royal})`, borderRadius: 5, padding: "2px 7px" }}>Day {d.day}</span>
                            <span style={{ fontSize: 9, fontWeight: 700, color: C.slate, background: "rgba(11,20,55,0.06)", padding: "2px 7px", borderRadius: 5 }}>{d.type}</span>
                            {d.best_time && <span style={{ fontSize: 9, color: C.slate }}>⏰ {d.best_time}</span>}
                          </div>
                          <CopyBtn text={d.title} id={`cal-${i}`} copied={copied} copy={copy} small/>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{d.title}</div>
                        <div style={{ fontSize: 11, color: C.slate, lineHeight: 1.6 }}>{d.outline}</div>
                        {d.hook_idea && <div style={{ marginTop: 7, fontSize: 10, color: "#ef4444", fontWeight: 700 }}>🎣 {d.hook_idea}</div>}
                      </div>
                    ))}
                  </Card>
                  {result.growth_tips && <Card title="Growth Tips" icon="🚀" accent="#10b981">{result.growth_tips.map((t, i) => <div key={i} style={{ fontSize: 12, color: C.slate, padding: "7px 0", borderBottom: i < result.growth_tips.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", display: "flex", gap: 9 }}><span style={{ color: "#10b981", fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span>{t}</div>)}</Card>}
                </>)}

                {/* ── Title Optimizer ── */}
                {activeTool === "title_optimizer" && (<>
                  {result.original_analysis && (
                    <Card title="Analysis" icon="🔍" accent="#06b6d4" onSectionEdit={() => openSectionEdit("Analysis", result.original_analysis)}>
                      <p style={{ fontSize: 13, color: C.slate, lineHeight: 1.75, marginBottom: 12 }}>{result.original_analysis}</p>
                      {result.original_score && <ScoreBar score={result.original_score} label="Original Score"/>}
                      {result.weaknesses && result.weaknesses.map((w, i) => <div key={i} style={{ fontSize: 11, color: "#b91c1c", padding: "4px 0", display: "flex", gap: 7 }}><span>⚠️</span>{w}</div>)}
                    </Card>
                  )}
                  {result.optimized_titles && (
                    <Card title="Optimized Titles" icon="✨" accent={C.sky} copyAll={result.optimized_titles.map(t => t.title).join("\n")} copyId="all-opt" copied={copied} copy={copy} onSectionEdit={() => openSectionEdit("Optimized Titles", result.optimized_titles)}>
                      {result.optimized_titles.map((t, i) => (
                        <div key={i} style={{ background: "rgba(11,20,55,0.02)", borderRadius: 12, padding: "clamp(12px,2vw,15px)", marginBottom: 9, border: "1px solid rgba(11,20,55,0.07)" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 9, marginBottom: 9, flexWrap: "wrap" }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, flex: 1, lineHeight: 1.4, minWidth: 0, wordBreak: "break-word" }}>{t.title}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
                              <ScoreRing score={t.score} size={46}/>
                              <CopyBtn text={t.title} id={`opt-${i}`} copied={copied} copy={copy} small/>
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: C.slate, lineHeight: 1.5 }}>{t.why}</div>
                        </div>
                      ))}
                    </Card>
                  )}
                  {result.tips && <Card title="Optimization Tips" icon="💡" accent={C.gold}>{result.tips.map((t, i) => <div key={i} style={{ fontSize: 12, color: C.slate, padding: "7px 0", borderBottom: i < result.tips.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", display: "flex", gap: 9 }}><span style={{ color: C.gold, fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span>{t}</div>)}</Card>}
                </>)}

                {/* ── Comment Replier ── */}
                {activeTool === "comment_replier" && result.replies && (<>
                  <Card title="Reply Options" icon="💬" accent="#10b981" onSectionEdit={() => openSectionEdit("Replies", result.replies)}>
                    {result.replies.map((r, i) => (
                      <div key={i} style={{ background: "rgba(11,20,55,0.02)", borderRadius: 12, padding: "clamp(12px,2vw,15px)", marginBottom: 9, border: "1px solid rgba(11,20,55,0.07)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9, flexWrap: "wrap", gap: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "#059669", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.22)", borderRadius: 20, padding: "2px 10px" }}>{r.style}</span>
                          <CopyBtn text={r.text} id={`reply-${i}`} copied={copied} copy={copy} small/>
                        </div>
                        <p style={{ fontSize: 13, color: C.navy, lineHeight: 1.75, margin: 0 }}>{r.text}</p>
                      </div>
                    ))}
                  </Card>
                  {result.tip && <Card title="Pro Community Tip" icon="💡" accent={C.gold}><p style={{ fontSize: 13, color: C.slate, lineHeight: 1.75 }}>{result.tip}</p></Card>}
                </>)}

                {/* ── Niche Analyzer ── */}
                {activeTool === "niche_analyzer" && (<>
                  {result.niche_overview && (
                    <Card title="Niche Overview" icon="🔍" accent="#f97316" onSectionEdit={() => openSectionEdit("Niche Overview", result.niche_overview)}>
                      <p style={{ fontSize: 13, color: C.slate, lineHeight: 1.75, marginBottom: 12 }}>{result.niche_overview}</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {result.competition_level && <Tag text={`⚔️ Competition: ${result.competition_level}`} color="#f97316"/>}
                        {result.monetization_potential && <Tag text={`💰 Monetization: ${result.monetization_potential}`} color="#10b981"/>}
                        {result.estimated_rpm && <Tag text={`📊 RPM: ${result.estimated_rpm}`} color={C.gold}/>}
                      </div>
                    </Card>
                  )}
                  {result.top_keywords && (
                    <Card title="Top Keywords" icon="🔑" accent={C.sky} copyAll={result.top_keywords.map(k => k.keyword).join("\n")} copyId="kw-all" copied={copied} copy={copy}>
                      {result.top_keywords.map((k, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderBottom: i < result.top_keywords.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", flexWrap: "wrap" }}>
                          <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: C.navy, minWidth: 100 }}>{k.keyword}</span>
                          <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
                            <Tag text={k.search_intent} color={C.sky}/>
                            <Tag text={k.difficulty} color={k.difficulty === "easy" ? "#10b981" : k.difficulty === "medium" ? C.gold : "#ef4444"}/>
                            <CopyBtn text={k.keyword} id={`kw-${i}`} copied={copied} copy={copy} small/>
                          </div>
                        </div>
                      ))}
                    </Card>
                  )}
                  {result.content_gaps && <Card title="Content Gaps" icon="💡" accent="#10b981" copyAll={result.content_gaps.join("\n")} copyId="gaps" copied={copied} copy={copy}>{result.content_gaps.map((g, i) => <div key={i} style={{ fontSize: 12, color: C.slate, padding: "7px 0", borderBottom: i < result.content_gaps.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", display: "flex", gap: 9 }}><span style={{ color: "#10b981", fontWeight: 800, flexShrink: 0 }}>→</span>{g}</div>)}</Card>}
                  {result.video_ideas && <Card title="Video Ideas" icon="🎬" accent="#ef4444" copyAll={result.video_ideas.join("\n")} copyId="vi-all" copied={copied} copy={copy}>{result.video_ideas.map((v, i) => <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: i < result.video_ideas.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", gap: 9, flexWrap: "wrap" }}><span style={{ fontSize: 12, color: C.slate, flex: 1, minWidth: 0 }}>{i + 1}. {v}</span><CopyBtn text={v} id={`vi-${i}`} copied={copied} copy={copy} small/></div>)}</Card>}
                  {result.growth_strategy && <Card title="Growth Strategy" icon="🚀" accent={C.royal}>{result.growth_strategy.map((s, i) => <div key={i} style={{ fontSize: 12, color: C.slate, padding: "7px 0", borderBottom: i < result.growth_strategy.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", display: "flex", gap: 9 }}><span style={{ color: C.royal, fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span>{s}</div>)}</Card>}
                  {result.monetization_methods && <Card title="Monetization Methods" icon="💰" accent={C.gold}>{result.monetization_methods.map((m, i) => <div key={i} style={{ fontSize: 12, color: C.slate, padding: "7px 0", borderBottom: i < result.monetization_methods.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", display: "flex", gap: 7 }}><span style={{ color: C.gold, flexShrink: 0 }}>•</span>{m}</div>)}</Card>}
                  {result.thumbnail_style && <Card title="Thumbnail Style" icon="🖼️" accent="#06b6d4" onSectionEdit={() => openSectionEdit("Thumbnail Style", result.thumbnail_style)}><p style={{ fontSize: 13, color: C.slate, lineHeight: 1.75 }}>{result.thumbnail_style}</p></Card>}
                  {result.posting_frequency && <Card title="Posting Schedule" icon="📅" accent="#10b981"><p style={{ fontSize: 13, color: C.slate, lineHeight: 1.75 }}>{result.posting_frequency}</p></Card>}
                </>)}

                {/* ── YouTube Shorts ── */}
                {activeTool === "youtube_shorts" && (<>
                  {result.short_titles && (
                    <Card title="Shorts Titles" icon="🩳" accent="#ec4899" copyAll={result.short_titles.join("\n")} copyId="short-titles" copied={copied} copy={copy} onSectionEdit={() => openSectionEdit("Shorts Titles", result.short_titles)}>
                      {result.short_titles.map((t, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", background: "rgba(236,72,153,0.04)", borderRadius: 9, marginBottom: 6, border: "1px solid rgba(236,72,153,0.12)", flexWrap: "wrap" }}>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: C.navy, minWidth: 0, wordBreak: "break-word" }}>{t}</span>
                          <span style={{ fontSize: 9, color: t.length > 50 ? "#ef4444" : "#10b981", fontWeight: 700, flexShrink: 0 }}>{t.length}/50</span>
                          <CopyBtn text={t} id={`st-${i}`} copied={copied} copy={copy} small/>
                        </div>
                      ))}
                    </Card>
                  )}
                  {result.script && (
                    <Card title="60-Second Script" icon="⏱️" accent="#ec4899" onSectionEdit={() => openSectionEdit("Shorts Script", result.script)}>
                      {Object.entries(result.script || {}).map(([timeKey, text], i) => (
                        <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < Object.entries(result.script || {}).length - 1 ? "1px solid rgba(236,72,153,0.1)" : "none" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                            <span style={{ fontSize: 9, fontWeight: 800, background: "linear-gradient(135deg,#ec4899,#f97316)", color: "#fff", padding: "2px 8px", borderRadius: 5, letterSpacing: "0.05em" }}>{timeKey.replace(/_/g, " ").toUpperCase()}</span>
                            <CopyBtn text={text} id={`shorts-${i}`} copied={copied} copy={copy} small/>
                          </div>
                          <div style={{ fontSize: 13, color: C.navy, lineHeight: 1.7 }}>{text}</div>
                        </div>
                      ))}
                    </Card>
                  )}
                  {result.captions && (
                    <Card title="On-Screen Captions" icon="💬" accent="#f97316" copyAll={result.captions.map(c => `${c.time}: ${c.text}`).join("\n")} copyId="captions" copied={copied} copy={copy}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 7 }}>
                        {result.captions.map((c, i) => (
                          <div key={i} style={{ padding: "8px 11px", background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 9 }}>
                            <div style={{ fontSize: 9, fontWeight: 800, color: "#f97316", marginBottom: 3 }}>{c.time}</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, wordBreak: "break-word" }}>{c.text}</div>
                            {c.style && <div style={{ fontSize: 9, color: C.slate, marginTop: 2 }}>{c.style}</div>}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                  {result.cover_frame_text && (
                    <Card title="Cover Frame Text" icon="🖼️" accent={C.gold} onSectionEdit={() => openSectionEdit("Cover Text", result.cover_frame_text)}>
                      <div style={{ padding: 14, background: "rgba(245,158,11,0.08)", borderRadius: 10, border: "1px solid rgba(245,158,11,0.2)", marginBottom: 9 }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: C.navy, textAlign: "center", wordBreak: "break-word" }}>{result.cover_frame_text}</div>
                      </div>
                      <CopyBtn text={result.cover_frame_text} id="cover" copied={copied} copy={copy}/>
                    </Card>
                  )}
                  {result.hashtags && (
                    <Card title="Shorts Hashtags" icon="#️⃣" accent="#ec4899" copyAll={result.hashtags.join(" ")} copyId="shorts-hash" copied={copied} copy={copy}>
                      <div className="ats-tags-wrap">{result.hashtags.map(h => <Tag key={h} text={h} color="#ec4899"/>)}</div>
                    </Card>
                  )}
                  {result.best_post_time && <Card title="Best Posting Time" icon="⏰" accent="#10b981"><p style={{ fontSize: 13, color: C.slate, lineHeight: 1.75 }}>{result.best_post_time}</p></Card>}
                  {result.hook_score && <div style={{ marginBottom: 12 }}><ScoreBar score={result.hook_score} label="Hook Score"/></div>}
                </>)}

                {/* ── Competitor Spy ── */}
                {activeTool === "competitor_spy" && (<>
                  {result.title_score !== undefined && (
                    <Card title="SEO Score Analysis" icon="🕵️" accent="#8b5cf6">
                      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                        <ScoreRing score={result.title_score} size={70}/>
                        <div style={{ flex: 1, minWidth: 160 }}><div style={{ fontSize: 13, color: C.slate, lineHeight: 1.7 }}>{result.analysis}</div></div>
                      </div>
                    </Card>
                  )}
                  {result.what_they_did_right && <Card title="✅ What They Did Right" icon="💡" accent="#10b981">{result.what_they_did_right.map((r, i) => <div key={i} style={{ fontSize: 12, color: C.slate, padding: "7px 0", borderBottom: i < result.what_they_did_right.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", display: "flex", gap: 9 }}><span style={{ color: "#10b981", flexShrink: 0 }}>✅</span>{r}</div>)}</Card>}
                  {result.what_they_did_wrong && <Card title="❌ Their Weaknesses" icon="🎯" accent="#ef4444">{result.what_they_did_wrong.map((r, i) => <div key={i} style={{ fontSize: 12, color: C.slate, padding: "7px 0", borderBottom: i < result.what_they_did_wrong.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", display: "flex", gap: 9 }}><span style={{ color: "#ef4444", flexShrink: 0 }}>❌</span>{r}</div>)}</Card>}
                  {result.likely_tags && <Card title="Tags They're Likely Using" icon="🏷️" accent="#8b5cf6" copyAll={result.likely_tags.join(",")} copyId="spy-tags" copied={copied} copy={copy}><div className="ats-tags-wrap">{result.likely_tags.map(t => <Tag key={t} text={t} color="#8b5cf6"/>)}</div></Card>}
                  {result.better_alternatives && (
                    <Card title="5 Better Title Alternatives" icon="✨" accent={C.sky} copyAll={result.better_alternatives.join("\n")} copyId="better" copied={copied} copy={copy} onSectionEdit={() => openSectionEdit("Better Titles", result.better_alternatives)}>
                      {result.better_alternatives.map((t, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", background: "rgba(59,130,246,0.04)", borderRadius: 9, marginBottom: 6, border: "1px solid rgba(59,130,246,0.12)", flexWrap: "wrap" }}>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.navy, minWidth: 0, wordBreak: "break-word" }}>{t}</span>
                          <CopyBtn text={t} id={`better-${i}`} copied={copied} copy={copy} small/>
                        </div>
                      ))}
                    </Card>
                  )}
                  {result.keyword_strategy && <Card title="Keyword Strategy" icon="🔑" accent={C.gold} onSectionEdit={() => openSectionEdit("Keyword Strategy", result.keyword_strategy)}><p style={{ fontSize: 13, color: C.slate, lineHeight: 1.75 }}>{result.keyword_strategy}</p></Card>}
                </>)}

                {/* ── Hook Library Results ── */}
                {activeTool === "hook_library" && result.personalized_hooks && (
                  <Card title="Your Personalised Hooks" icon="🔥" accent="#ef4444" copyAll={result.personalized_hooks.map(h => h.hook).join("\n\n")} copyId="hooks-all" copied={copied} copy={copy}>
                    {result.personalized_hooks.map((h, i) => (
                      <div key={i} style={{ padding: "clamp(10px,2vw,13px)", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 11, marginBottom: 9 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 9, marginBottom: 7, flexWrap: "wrap" }}>
                          <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
                            <Tag text={h.category} color="#ef4444"/>
                          </div>
                          <CopyBtn text={h.hook} id={`hook-${i}`} copied={copied} copy={copy} small/>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, lineHeight: 1.6, wordBreak: "break-word" }}>{h.hook}</div>
                        {h.why && <div style={{ fontSize: 11, color: C.slate, marginTop: 6 }}>💡 {h.why}</div>}
                      </div>
                    ))}
                  </Card>
                )}

                {/* ── Multi-Language Batch ── */}
                {activeTool === "multilang_batch" && (<>
                  {["english", "urdu", "arabic"].map(lang => result[lang] && (
                    <Card key={lang} title={lang === "english" ? "🇬🇧 English Package" : lang === "urdu" ? "🇵🇰 اردو Package" : "🌍 عربي Package"}
                      icon={lang === "english" ? "🇬🇧" : lang === "urdu" ? "🇵🇰" : "🌍"}
                      accent={lang === "english" ? C.sky : lang === "urdu" ? "#10b981" : "#f97316"}
                      onSectionEdit={() => openSectionEdit(`${lang} Package`, result[lang])}>
                      {result[lang].title && <div style={{ fontSize: 14, fontWeight: 800, color: C.navy, marginBottom: 8, direction: lang !== "english" ? "rtl" : "ltr", wordBreak: "break-word" }}>{result[lang].title}</div>}
                      {result[lang].description && <pre style={{ fontSize: 11, color: C.slate, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", margin: "0 0 9px", direction: lang !== "english" ? "rtl" : "ltr", wordBreak: "break-word" }}>{result[lang].description.slice(0, 400)}…</pre>}
                      {result[lang].tags && <div className="ats-tags-wrap">{result[lang].tags.slice(0, 10).map(t => <Tag key={t} text={t} color={lang === "english" ? C.sky : lang === "urdu" ? "#10b981" : "#f97316"}/>)}</div>}
                      <div style={{ marginTop: 9 }}><CopyBtn text={JSON.stringify(result[lang], null, 2)} id={`ml-${lang}`} copied={copied} copy={copy}/></div>
                    </Card>
                  ))}
                </>)}

                {/* ── Next Boom Predictor ── */}
                {activeTool === "next_boom" && (<>
                  {result.pattern_detected && (
                    <Card title="Pattern Detected" icon="🔍" accent={C.gold} onSectionEdit={() => openSectionEdit("Pattern", result.pattern_detected)}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 8, lineHeight: 1.5 }}>{result.pattern_detected}</div>
                      {result.traffic_lights && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                          {Object.entries(result.traffic_lights).map(([k, v]) => (
                            <TrafficLight key={k} value={v} label={k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}/>
                          ))}
                        </div>
                      )}
                    </Card>
                  )}
                  {result.videos_analysis && (
                    <Card title="Your Videos Performance Radar" icon="📊" accent={C.royal}>
                      <div className="ats-radar-wrap"><RadarChart videos={result.videos_analysis}/></div>
                      <div className="ats-radar-legend">
                        {result.videos_analysis.slice(0, 3).map((v, i) => (
                          <div key={i} className="ats-radar-legend-item">
                            <div className="ats-radar-legend-dot" style={{ background: [C.sky, C.gold, "#10b981"][i] }}/>
                            <span style={{ fontSize: 10, color: C.slate, fontWeight: 600 }}>V{i + 1}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                  {result.next_boom_prediction && (
                    <Card title="🚀 Predicted Next Boom Video" icon="🎯" accent="#ef4444" onSectionEdit={() => openSectionEdit("Boom Prediction", result.next_boom_prediction)}>
                      <div style={{ padding: 13, background: "linear-gradient(135deg,rgba(11,20,55,0.04),rgba(26,58,143,0.04))", borderRadius: 11, border: `1px solid rgba(26,58,143,0.12)`, marginBottom: 11 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, lineHeight: 1.4, marginBottom: 8, wordBreak: "break-word" }}>{result.next_boom_prediction.title}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                          {result.next_boom_prediction.risk_score && <Tag text={`Risk: ${result.next_boom_prediction.risk_score}`} color={result.next_boom_prediction.risk_score === "Low" ? "#10b981" : result.next_boom_prediction.risk_score === "Medium" ? C.gold : "#ef4444"}/>}
                          {result.next_boom_prediction.optimal_publish_time && <Tag text={`⏰ ${result.next_boom_prediction.optimal_publish_time}`} color={C.royal}/>}
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.7, marginBottom: 10 }}>{result.next_boom_prediction.why_it_will_work}</div>
                      {result.next_boom_prediction.title_options && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 800, color: C.slate, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 7 }}>Title Options</div>
                          {result.next_boom_prediction.title_options.map((t, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 11px", background: "rgba(11,20,55,0.03)", borderRadius: 8, marginBottom: 5, flexWrap: "wrap" }}>
                              <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: C.navy, minWidth: 0, wordBreak: "break-word" }}>{t}</span>
                              <CopyBtn text={t} id={`boom-title-${i}`} copied={copied} copy={copy} small/>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  )}
                </>)}

                {/* ── Trending Radar ── */}
                {activeTool === "trending_radar" && result.trending_topics && (
                  <Card title="🔥 Trending Topics Right Now" icon="📡" accent="#ef4444" copyAll={result.trending_topics.map(t => t.topic).join("\n")} copyId="trending" copied={copied} copy={copy}>
                    {result.trending_topics.map((t, i) => (
                      <div key={i} className="ats-trending-item"
                        style={{ background: i === 0 ? "rgba(239,68,68,0.05)" : "rgba(11,20,55,0.02)", border: `1px solid ${i === 0 ? "rgba(239,68,68,0.15)" : "rgba(11,20,55,0.06)"}` }}>
                        <div className="ats-trending-item__icon"
                          style={{ background: i === 0 ? "linear-gradient(135deg,#ef4444,#f97316)" : `${C.royal}14`, color: i === 0 ? "#fff" : C.royal, fontSize: i === 0 ? 14 : 12 }}>
                          {i === 0 ? "🔥" : i + 1}
                        </div>
                        <div className="ats-trending-item__body">
                          <div className="ats-trending-item__header">
                            <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, minWidth: 0, wordBreak: "break-word" }}>{t.topic}</div>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                              {t.trend_direction && <Tag text={t.trend_direction} color={t.trend_direction.includes("↑") ? "#10b981" : C.gold}/>}
                              {t.urgency && <Tag text={`⚡ ${t.urgency}`} color="#ef4444"/>}
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: C.slate, lineHeight: 1.55 }}>{t.why_trending}</div>
                          {t.best_angle && <div style={{ marginTop: 5, fontSize: 11, color: C.royal, fontWeight: 700 }}>💡 Angle: {t.best_angle}</div>}
                        </div>
                        <CopyBtn text={t.topic} id={`trend-${i}`} copied={copied} copy={copy} small/>
                      </div>
                    ))}
                  </Card>
                )}

                {/* ── Channel Audit ── */}
                {activeTool === "channel_audit" && (<>
                  {result.overall_score !== undefined && (
                    <Card title="Channel Strategy Score" icon="🏆" accent={C.royal}>
                      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: 14 }}>
                        <ScoreRing score={result.overall_score} size={80}/>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{result.channel_grade} — {result.summary}</div>
                          {result.score_breakdown && Object.entries(result.score_breakdown).map(([k, v]) => (
                            <ScoreBar key={k} score={v} label={k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}/>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}
                  {result.whats_working && <Card title="✅ What's Working" icon="💪" accent="#10b981">{result.whats_working.map((w, i) => <div key={i} style={{ fontSize: 12, color: C.slate, padding: "7px 0", borderBottom: i < result.whats_working.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", display: "flex", gap: 9 }}><span style={{ color: "#10b981", flexShrink: 0 }}>✅</span>{w}</div>)}</Card>}
                  {result.what_to_fix && <Card title="🔴 What to Fix" icon="⚠️" accent="#ef4444">{result.what_to_fix.map((w, i) => <div key={i} style={{ fontSize: 12, color: C.slate, padding: "7px 0", borderBottom: i < result.what_to_fix.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", display: "flex", gap: 9 }}><span style={{ color: "#ef4444", flexShrink: 0 }}>🔴</span>{w}</div>)}</Card>}
                  {result.action_items && (
                    <Card title="5 Action Items" icon="📋" accent={C.gold}>
                      {result.action_items.map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < result.action_items.length - 1 ? "1px solid rgba(11,20,55,0.05)" : "none", alignItems: "flex-start" }}>
                          <span style={{ width: 22, height: 22, borderRadius: 6, background: `linear-gradient(135deg,${C.navy},${C.royal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#fff", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                          <span style={{ fontSize: 12, color: C.slate, lineHeight: 1.6 }}>{a}</span>
                        </div>
                      ))}
                    </Card>
                  )}
                  {result.title_consistency && <Card title="Title Consistency Analysis" icon="🔤" accent="#06b6d4" onSectionEdit={() => openSectionEdit("Title Analysis", result.title_consistency)}><p style={{ fontSize: 13, color: C.slate, lineHeight: 1.75 }}>{result.title_consistency}</p></Card>}
                  {result.channel_positioning && <Card title="Channel Positioning Statement" icon="🎯" accent={C.royal} onSectionEdit={() => openSectionEdit("Positioning", result.channel_positioning)}><div style={{ fontSize: 13, fontWeight: 700, color: C.navy, lineHeight: 1.6, padding: "11px 13px", background: `rgba(26,58,143,0.06)`, borderRadius: 10, border: `1px solid rgba(26,58,143,0.15)`, wordBreak: "break-word" }}>{result.channel_positioning}</div></Card>}
                </>)}

              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Section Sidebar Drawer ── */}
      <SectionSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sectionTitle={sidebarSection.title}
        sectionContent={sidebarSection.content}
        onRegenerate={handleSectionRegenerate}
        regenerating={sidebarRegen}
      />

      {/* ── Hook Library Modal ── */}
      <HookLibraryModal
        open={hookLibOpen}
        onClose={() => setHookLibOpen(false)}
        onSelect={(hook) => { setTopic(hook); }}
        topicValue={topic}
      />
    </div>
  );
}