// Learning.jsx — AIDLA Learning Main Shell
// Clean rewrite: ChatGPT/Claude style UI
// Learning.jsx is the ONLY place that renders messages
// Mode components = welcome screen only (no internal state, no message rendering)

import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '../../lib/supabase';

import ChatMode,       { CHAT_SYSTEM_PROMPT }       from './learning-components/ChatMode.jsx';
import CareerCounseling, { CAREER_SYSTEM_PROMPT }   from './learning-components/CareerCounseling.jsx';
import RoadmapMode,    { ROADMAP_SYSTEM_PROMPT }     from './learning-components/RoadmapMode.jsx';
import SkillsMode,     { SKILLS_SYSTEM_PROMPT }      from './learning-components/SkillsMode.jsx';
import InterviewMode,  { INTERVIEW_SYSTEM_PROMPT }   from './learning-components/InterviewMode.jsx';
import ResumeMode,     { RESUME_SYSTEM_PROMPT }      from './learning-components/ResumeMode.jsx';
import UniMode,        { UNI_SYSTEM_PROMPT }         from './learning-components/UniMode.jsx';
import SalaryMode,     { SALARY_SYSTEM_PROMPT }      from './learning-components/SalaryMode.jsx';
import JobsMode,       { JOBS_SYSTEM_PROMPT }        from './learning-components/JobsMode.jsx';
import FreelanceMode,  { FREELANCE_SYSTEM_PROMPT }   from './learning-components/FreelanceMode.jsx';
import StartupMode,    { STARTUP_SYSTEM_PROMPT }     from './learning-components/StartupMode.jsx';
import BrandingMode,   { BRANDING_SYSTEM_PROMPT }    from './learning-components/BrandingMode.jsx';

// ─────────────────────────────────────────────
// MODE REGISTRY
// ─────────────────────────────────────────────
const MODES = [
  { key: 'chat',      icon: '💬', label: 'Chat',              prompt: CHAT_SYSTEM_PROMPT,       Component: ChatMode },
  { key: 'career',    icon: '🧠', label: 'Career Counseling', prompt: CAREER_SYSTEM_PROMPT,     Component: CareerCounseling },
  { key: 'roadmap',   icon: '🗺️', label: 'Roadmap',           prompt: ROADMAP_SYSTEM_PROMPT,    Component: RoadmapMode },
  { key: 'skills',    icon: '⚡', label: 'Skills',            prompt: SKILLS_SYSTEM_PROMPT,     Component: SkillsMode },
  { key: 'interview', icon: '🎯', label: 'Interview',         prompt: INTERVIEW_SYSTEM_PROMPT,  Component: InterviewMode },
  { key: 'resume',    icon: '📄', label: 'Resume',            prompt: RESUME_SYSTEM_PROMPT,     Component: ResumeMode },
  { key: 'uni',       icon: '🎓', label: 'Uni',               prompt: UNI_SYSTEM_PROMPT,        Component: UniMode },
  { key: 'salary',    icon: '💰', label: 'Salary',            prompt: SALARY_SYSTEM_PROMPT,     Component: SalaryMode },
  { key: 'jobs',      icon: '🔍', label: 'Jobs',              prompt: JOBS_SYSTEM_PROMPT,       Component: JobsMode },
  { key: 'freelance', icon: '💻', label: 'Freelance',         prompt: FREELANCE_SYSTEM_PROMPT,  Component: FreelanceMode },
  { key: 'startup',   icon: '🚀', label: 'Startup',           prompt: STARTUP_SYSTEM_PROMPT,    Component: StartupMode },
  { key: 'branding',  icon: '🌐', label: 'Branding',          prompt: BRANDING_SYSTEM_PROMPT,   Component: BrandingMode },
];

function getModeData(key) {
  return MODES.find(m => m.key === key) || MODES[0];
}

// ─────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────
const C = {
  bg:           '#ffffff',
  sidebar:      '#f9f9f9',
  border:       'rgba(0,0,0,0.08)',
  borderMed:    'rgba(0,0,0,0.12)',
  text:         '#0d0d0d',
  textSoft:     '#555',
  textMute:     '#999',
  accent:       '#10a37f',
  accentHover:  '#0d8f6e',
  userBubble:   '#f0f0f0',
  hover:        'rgba(0,0,0,0.04)',
  hoverMed:     'rgba(0,0,0,0.07)',
  danger:       '#ef4444',
  dangerBg:     'rgba(239,68,68,0.08)',
};

// ─────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────
const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ls {
  display: flex;
  width: 100%;
  height: calc(100dvh - 56px);
  background: ${C.bg};
  color: ${C.text};
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .ls { height: calc(100dvh - 64px); }
}

/* ── SIDEBAR ── */
.ls-sidebar {
  width: 240px;
  min-width: 240px;
  height: 100%;
  background: ${C.sidebar};
  border-right: 1px solid ${C.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.22s ease;
}

.ls-sidebar-head {
  padding: 14px 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid ${C.border};
}

.ls-brand {
  display: flex;
  align-items: center;
  gap: 9px;
}

.ls-brand-dot {
  width: 32px; height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, ${C.accent}, ${C.accentHover});
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; color: white; flex-shrink: 0;
}

.ls-brand-name {
  font-size: 13px; font-weight: 700; color: ${C.text};
}

.ls-brand-sub {
  font-size: 11px; color: ${C.textMute};
}

.ls-new-btn {
  width: 100%; height: 36px;
  background: white;
  border: 1px solid ${C.borderMed};
  border-radius: 8px;
  display: flex; align-items: center; gap: 8px;
  padding: 0 12px;
  font-size: 13px; font-weight: 600; color: ${C.text};
  cursor: pointer; transition: background 0.15s;
}

.ls-new-btn:hover { background: ${C.hoverMed}; }

.ls-history {
  flex: 1; overflow-y: auto; padding: 10px 6px 14px;
}

.ls-history-label {
  font-size: 10px; font-weight: 600; letter-spacing: 0.09em;
  text-transform: uppercase; color: ${C.textMute};
  padding: 4px 8px 8px;
}

.ls-chat-item {
  position: relative;
  width: 100%; border: none;
  background: transparent; color: ${C.text};
  border-radius: 8px;
  padding: 8px 32px 8px 10px;
  text-align: left; cursor: pointer;
  transition: background 0.15s; margin-bottom: 2px;
}

.ls-chat-item:hover { background: ${C.hoverMed}; }
.ls-chat-item.active { background: ${C.hover}; }

.ls-chat-title {
  font-size: 13px; font-weight: 500;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.ls-chat-meta {
  font-size: 11px; color: ${C.textMute};
  margin-top: 2px; display: flex; gap: 6px; align-items: center;
}

.ls-del-btn {
  position: absolute; right: 5px; top: 50%; transform: translateY(-50%);
  width: 24px; height: 24px; border: none; background: transparent;
  color: ${C.textMute}; border-radius: 6px; cursor: pointer;
  opacity: 0; transition: opacity 0.15s, background 0.15s;
  display: flex; align-items: center; justify-content: center; font-size: 13px;
}

.ls-chat-item:hover .ls-del-btn { opacity: 1; }
.ls-del-btn:hover { background: ${C.dangerBg}; color: ${C.danger}; }

.ls-empty { padding: 20px 12px; text-align: center; font-size: 12px; color: ${C.textMute}; }

/* ── MAIN ── */
.ls-main {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; height: 100%;
  background: ${C.bg};
}

/* ── TOPBAR ── */
.ls-topbar {
  height: 46px; min-height: 46px;
  border-bottom: 1px solid ${C.border};
  display: flex; align-items: center; gap: 10px;
  padding: 0 14px;
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(8px);
}

.ls-menu-btn {
  display: none;
  width: 34px; height: 34px;
  border: 1px solid ${C.border}; background: transparent;
  border-radius: 8px; cursor: pointer;
  align-items: center; justify-content: center;
  font-size: 16px; color: ${C.text};
  transition: background 0.15s; flex-shrink: 0;
}

.ls-menu-btn:hover { background: ${C.hover}; }

.ls-topbar-title {
  font-size: 14px; font-weight: 700; color: ${C.text};
  flex: 1; min-width: 0;
}

.ls-mode-pill {
  display: inline-flex; align-items: center; gap: 5px;
  background: ${C.hover}; border: 1px solid ${C.border};
  border-radius: 999px; height: 30px; padding: 0 11px;
  font-size: 12px; font-weight: 600; color: ${C.text};
  white-space: nowrap; flex-shrink: 0;
}

/* ── CONTENT ── */
.ls-content {
  flex: 1; min-height: 0;
  overflow-y: auto; padding: 24px 16px 8px;
}

.ls-inner {
  width: 100%; max-width: 720px; margin: 0 auto;
}

/* ── WELCOME (mode panel) ── */
.mode-welcome {
  display: flex; flex-direction: column;
  align-items: flex-start;
  padding: 32px 0 24px;
  min-height: 60vh;
  justify-content: center;
}

.mode-icon-badge {
  font-size: 26px; margin-bottom: 10px;
}

.mode-title {
  font-size: clamp(20px, 3.5vw, 28px);
  font-weight: 700; letter-spacing: -0.02em;
  color: ${C.text}; margin-bottom: 4px;
}

.mode-subtitle {
  font-size: 13px; color: ${C.textSoft};
  margin-bottom: 18px; max-width: 480px;
  line-height: 1.5;
}

.suggestion-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  max-width: 600px;
}

.suggestion-btn {
  border: 1px solid ${C.border};
  background: white; color: ${C.text};
  border-radius: 999px;
  padding: 6px 13px;
  font-size: 12.5px; font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
  line-height: 1.5;
}

.suggestion-btn:hover {
  background: ${C.hover}; border-color: ${C.borderMed};
}

/* ── MESSAGES ── */
.ls-messages {
  display: flex; flex-direction: column;
  gap: 6px; padding-bottom: 8px;
}

.ls-msg-row {
  display: flex; width: 100%;
}

.ls-msg-row.user { justify-content: flex-end; }
.ls-msg-row.assistant { justify-content: flex-start; }

.ls-msg-wrap { max-width: 85%; }

.ls-msg-label {
  font-size: 11px; color: ${C.textMute};
  margin-bottom: 4px; padding: 0 4px;
}

.ls-msg-row.user .ls-msg-label { text-align: right; }

.ls-bubble {
  border-radius: 14px; padding: 9px 13px;
  font-size: 13.5px; line-height: 1.65;
  word-break: break-word; white-space: pre-wrap;
}

.ls-msg-row.user .ls-bubble {
  background: ${C.userBubble}; color: ${C.text};
  border-bottom-right-radius: 4px;
}

.ls-msg-row.assistant .ls-bubble {
  background: ${C.bg}; color: ${C.text};
  border: 1px solid ${C.border};
  border-bottom-left-radius: 4px;
}

.ls-typing {
  display: flex; align-items: center; gap: 4px;
  padding: 12px 14px;
  background: ${C.bg}; border: 1px solid ${C.border};
  border-radius: 16px; border-bottom-left-radius: 4px;
  width: fit-content;
}

.ls-typing span {
  width: 6px; height: 6px; border-radius: 50%;
  background: ${C.textMute};
  animation: ls-bounce 1.2s infinite;
}

.ls-typing span:nth-child(2) { animation-delay: 0.2s; }
.ls-typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes ls-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-5px); opacity: 1; }
}

/* ── COMPOSER ── */
.ls-composer {
  border-top: 1px solid ${C.border};
  background: rgba(255,255,255,0.97);
  padding: 10px 14px 12px;
}

.ls-composer-inner {
  width: 100%; max-width: 720px; margin: 0 auto;
}

.ls-composer-box {
  border: 1px solid ${C.borderMed};
  background: white; border-radius: 14px;
  padding: 8px 8px 8px 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  display: flex; align-items: flex-end; gap: 8px;
}

.ls-plus-wrap { position: relative; flex-shrink: 0; }

.ls-plus-btn {
  width: 34px; height: 34px;
  border: 1px solid ${C.border}; background: ${C.hover};
  border-radius: 9px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: ${C.textSoft}; font-weight: 300;
  transition: background 0.15s; line-height: 1;
}

.ls-plus-btn:hover { background: ${C.hoverMed}; color: ${C.text}; }

.ls-textarea {
  flex: 1; min-height: 22px; max-height: 180px;
  resize: none; border: none; outline: none;
  background: transparent; color: ${C.text};
  font-size: 14px; line-height: 1.65;
  padding: 6px 0; font-family: inherit;
}

.ls-textarea::placeholder { color: ${C.textMute}; }

.ls-send-btn {
  width: 34px; height: 34px; flex-shrink: 0;
  border: none; background: ${C.accent}; color: white;
  border-radius: 9px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; transition: background 0.15s;
}

.ls-send-btn:hover { background: ${C.accentHover}; }
.ls-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.ls-hint {
  font-size: 11px; color: ${C.textMute};
  text-align: center; margin-top: 7px;
}

/* ── MODE PICKER ── */
.ls-mode-picker {
  position: absolute; bottom: calc(100% + 8px); left: 0;
  width: 300px;
  background: white;
  border: 1px solid ${C.borderMed};
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  padding: 10px; z-index: 100;
}

.ls-mode-picker-title {
  font-size: 11px; font-weight: 600; color: ${C.textMute};
  text-transform: uppercase; letter-spacing: 0.08em;
  padding: 2px 4px 10px;
}

.ls-mode-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 6px;
}

.ls-mode-btn {
  border: 1px solid ${C.border}; background: transparent;
  border-radius: 9px; padding: 8px 4px;
  cursor: pointer; transition: background 0.15s, border-color 0.15s;
  display: flex; flex-direction: column;
  align-items: center; gap: 4px;
  text-align: center;
}

.ls-mode-btn:hover { background: ${C.hover}; border-color: ${C.borderMed}; }
.ls-mode-btn.active { background: rgba(16,163,127,0.08); border-color: rgba(16,163,127,0.35); }

.ls-mode-btn-icon { font-size: 17px; line-height: 1; }
.ls-mode-btn-label { font-size: 9.5px; font-weight: 600; color: ${C.text}; line-height: 1.2; }

/* ── OVERLAY ── */
.ls-overlay {
  display: none; position: fixed; inset: 0;
  background: rgba(0,0,0,0.4); z-index: 70;
  opacity: 0; transition: opacity 0.2s;
  pointer-events: none;
}

/* ── MOBILE ── */
@media (max-width: 767px) {
  .ls-menu-btn { display: flex; }

  .ls-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0;
    width: min(260px, 84vw); min-width: min(260px, 84vw);
    z-index: 80; transform: translateX(-100%);
  }

  .ls-sidebar.open { transform: translateX(0); }

  .ls-overlay {
    display: block;
  }

  .ls-overlay.show {
    opacity: 1; pointer-events: auto;
  }

  .ls-content { padding: 16px 12px 8px; }
  .ls-composer { padding: 8px 10px 10px; }

  .ls-mode-picker {
    width: calc(100vw - 32px);
    left: 50%; transform: translateX(-50%);
  }

  .ls-mode-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }

  .ls-msg-wrap { max-width: 92%; }
}
`;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function makeTitle(text, modeLabel) {
  const clean = String(text || '').trim();
  return clean ? clean.slice(0, 52) : `${modeLabel} chat`;
}

function fmt(dateStr) {
  try { return new Date(dateStr).toLocaleDateString(); }
  catch { return ''; }
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function Learning() {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);

  const [mode, setMode]           = useState('chat');
  const [sidebarOpen, setSidebar] = useState(false);
  const [modeMenuOpen, setModeMenu] = useState(false);

  const [sessionId, setSessionId]   = useState(null);
  const [sessions, setSessions]     = useState([]);
  const [messages, setMessages]     = useState([]);

  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const textareaRef  = useRef(null);
  const bottomRef    = useRef(null);
  const modeMenuRef  = useRef(null);

  const currentMode = useMemo(() => getModeData(mode), [mode]);

  // Lock parent scroll
  useEffect(() => {
    const targets = [
      document.querySelector('.ul-outlet'),
      document.querySelector('.ul-main'),
      document.querySelector('main'),
    ].filter(Boolean);
    const saved = targets.map(el => ({ el, overflow: el.style.overflow, height: el.style.height }));
    targets.forEach(el => { el.style.overflow = 'hidden'; el.style.height = '100%'; });
    return () => saved.forEach(({ el, overflow, height }) => { el.style.overflow = overflow; el.style.height = height; });
  }, []);

  // Boot
  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!active) return;
        const u = data?.user || null;
        setUser(u);
        if (u) {
          const { data: p } = await supabase.from('users_profiles').select('*').eq('user_id', u.id).single();
          if (!active) return;
          if (p) setProfile(p);
          await loadSessions(u.id);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => { active = false; };
  }, []);

  // Auto resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
  }, [input]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  // Close mode menu on outside click
  useEffect(() => {
    if (!modeMenuOpen) return;
    function handler(e) {
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target)) {
        setModeMenu(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [modeMenuOpen]);

  async function loadSessions(uid) {
    const { data, error } = await supabase
      .from('career_counselor_sessions')
      .select('id,title,mode,created_at,updated_at')
      .eq('user_id', uid)
      .order('updated_at', { ascending: false })
      .limit(100);
    if (!error) setSessions(data || []);
  }

  async function loadSingleSession(id) {
    const { data, error } = await supabase
      .from('career_counselor_sessions')
      .select('*').eq('id', id).single();
    if (!error && data) {
      setSessionId(data.id);
      setMode(data.mode || 'chat');
      setMessages(Array.isArray(data.messages) ? data.messages : []);
      setSidebar(false);
    }
  }

  function newChat(nextMode = mode) {
    setSessionId(null);
    setMessages([]);
    setInput('');
    setMode(nextMode);
    setSidebar(false);
    setModeMenu(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  async function saveSession(allMessages, curSessionId, firstText, curMode) {
    if (!user) return null;
    const title = makeTitle(firstText, getModeData(curMode).label);

    if (curSessionId) {
      await supabase
        .from('career_counselor_sessions')
        .update({ messages: allMessages, mode: curMode, title, updated_at: new Date().toISOString() })
        .eq('id', curSessionId);
      await loadSessions(user.id);
      return curSessionId;
    }

    const { data, error } = await supabase
      .from('career_counselor_sessions')
      .insert([{ user_id: user.id, title, mode: curMode, messages: allMessages }])
      .select().single();

    if (!error && data) {
      await loadSessions(user.id);
      return data.id;
    }
    return null;
  }

  async function deleteChat(id, e) {
    e?.stopPropagation?.();
    if (!window.confirm('Delete this chat?')) return;
    await supabase.from('career_counselor_sessions').delete().eq('id', id);
    if (sessionId === id) { setSessionId(null); setMessages([]); }
    if (user?.id) await loadSessions(user.id);
  }

  async function handleSend(overrideText) {
    const text = String(overrideText ?? input).trim();
    if (!text || sending) return;

    setSending(true);

    const userMsg = { role: 'user', content: text, created_at: new Date().toISOString() };
    const tempMessages = [...messages, userMsg];
    setMessages(tempMessages);
    setInput('');

    // capture mode at send time so it doesn't change mid-request
    const sendMode = mode;
    const modeData = getModeData(sendMode);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/grok-proxy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: tempMessages.map(m => ({ role: m.role, content: m.content })),
            mode: sendMode,
            systemPrompt: modeData.prompt, // pass the mode's own prompt
          }),
        }
      );

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || '⚠️ Something went wrong. Please try again.';

      const assistantMsg = { role: 'assistant', content: reply, created_at: new Date().toISOString() };
      const allMessages = [...tempMessages, assistantMsg];
      setMessages(allMessages);

      const savedId = await saveSession(allMessages, sessionId, text, sendMode);
      if (!sessionId && savedId) setSessionId(savedId);
    } catch {
      const assistantMsg = { role: 'assistant', content: '⚠️ Connection error. Please try again.', created_at: new Date().toISOString() };
      const allMessages = [...tempMessages, assistantMsg];
      setMessages(allMessages);
      const savedId = await saveSession(allMessages, sessionId, text, sendMode);
      if (!sessionId && savedId) setSessionId(savedId);
    }

    setSending(false);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function pickMode(key) {
    setMode(key);
    setModeMenu(false);
    // if there are messages, start a fresh chat in the new mode
    if (messages.length > 0) {
      newChat(key);
    }
  }

  const { Component: ModeComponent } = currentMode;

  return (
    <>
      <style>{CSS}</style>

      <div className="ls">
        {/* OVERLAY */}
        <div
          className={`ls-overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={() => setSidebar(false)}
        />

        {/* SIDEBAR */}
        <aside className={`ls-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="ls-sidebar-head">
            <div className="ls-brand">
              <div className="ls-brand-dot">🎓</div>
              <div>
                <div className="ls-brand-name">AIDLA Learning</div>
                <div className="ls-brand-sub">Career AI workspace</div>
              </div>
            </div>
            <button className="ls-new-btn" onClick={() => newChat()}>
              <span style={{ fontSize: 14 }}>✏️</span>
              <span>New chat</span>
            </button>
          </div>

          <div className="ls-history">
            <div className="ls-history-label">Chats</div>
            {loading ? (
              <div className="ls-empty">Loading...</div>
            ) : sessions.length === 0 ? (
              <div className="ls-empty">No chats yet</div>
            ) : sessions.map(s => {
              const m = getModeData(s.mode);
              return (
                <button
                  key={s.id}
                  className={`ls-chat-item ${sessionId === s.id ? 'active' : ''}`}
                  onClick={() => loadSingleSession(s.id)}
                >
                  <div className="ls-chat-title">{s.title || `${m.label} chat`}</div>
                  <div className="ls-chat-meta">
                    <span>{m.icon} {m.label}</span>
                    <span>·</span>
                    <span>{fmt(s.updated_at || s.created_at)}</span>
                  </div>
                  <button className="ls-del-btn" onClick={e => deleteChat(s.id, e)} title="Delete">🗑</button>
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN */}
        <div className="ls-main">

          {/* TOPBAR */}
          <div className="ls-topbar">
            <button className="ls-menu-btn" onClick={() => setSidebar(true)} aria-label="Menu">☰</button>
            <div className="ls-topbar-title">
              {profile?.full_name ? `Hi ${profile.full_name.split(' ')[0]} 👋` : 'AIDLA Learning'}
            </div>
            <div className="ls-mode-pill">
              <span>{currentMode.icon}</span>
              <span>{currentMode.label}</span>
            </div>
          </div>

          {/* CONTENT — Learning.jsx owns ALL message rendering */}
          <div className="ls-content">
            <div className="ls-inner">
              {messages.length === 0 ? (
                /* Welcome screen — rendered by mode component */
                <ModeComponent onSuggestionClick={handleSend} />
              ) : (
                /* Messages — rendered ONLY here, never in mode components */
                <div className="ls-messages">
                  {messages.map((m, i) => (
                    <div key={i} className={`ls-msg-row ${m.role}`}>
                      <div className="ls-msg-wrap">
                        <div className="ls-msg-label">
                          {m.role === 'user' ? 'You' : `AIDLA · ${currentMode.label}`}
                        </div>
                        <div className="ls-bubble">{m.content}</div>
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="ls-msg-row assistant">
                      <div className="ls-msg-wrap">
                        <div className="ls-msg-label">AIDLA · {currentMode.label}</div>
                        <div className="ls-typing">
                          <span /><span /><span />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>
          </div>

          {/* COMPOSER */}
          <div className="ls-composer">
            <div className="ls-composer-inner">
              <div className="ls-composer-box">

                {/* + MODE PICKER */}
                <div className="ls-plus-wrap" ref={modeMenuRef}>
                  <button
                    className="ls-plus-btn"
                    onClick={() => setModeMenu(v => !v)}
                    aria-label="Switch mode"
                    title="Switch mode"
                  >
                    +
                  </button>

                  {modeMenuOpen && (
                    <div className="ls-mode-picker">
                      <div className="ls-mode-picker-title">Switch mode</div>
                      <div className="ls-mode-grid">
                        {MODES.map(m => (
                          <button
                            key={m.key}
                            className={`ls-mode-btn ${mode === m.key ? 'active' : ''}`}
                            onClick={() => pickMode(m.key)}
                            title={m.label}
                          >
                            <span className="ls-mode-btn-icon">{m.icon}</span>
                            <span className="ls-mode-btn-label">{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <textarea
                  ref={textareaRef}
                  className="ls-textarea"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={`Message ${currentMode.label}...`}
                  rows={1}
                />

                <button
                  className="ls-send-btn"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || sending}
                  aria-label="Send"
                >
                  ↑
                </button>
              </div>
              <div className="ls-hint">Enter to send · Shift+Enter for new line · {currentMode.icon} {currentMode.label}</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}