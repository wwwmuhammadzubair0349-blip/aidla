import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../lib/supabase.js";

const SUPABASE_FUNC_URL = "https://eyhpcztyznrpwnytvakw.supabase.co/functions/v1/chat";

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

// Group messages by date
function groupByDate(messages) {
  const groups = [];
  let lastDate = null;
  for (const msg of messages) {
    const dateLabel = fmtDate(msg.created_at || new Date().toISOString());
    if (dateLabel !== lastDate) {
      groups.push({ type: "date", label: dateLabel, id: "date-" + dateLabel });
      lastDate = dateLabel;
    }
    groups.push({ type: "message", ...msg });
  }
  return groups;
}

// ── Typing indicator ───────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="bot-typing-wrap">
      <div className="bot-avatar-sm">🤖</div>
      <div className="bot-typing-bubble">
        <span className="bot-dot" style={{ animationDelay: "0ms" }} />
        <span className="bot-dot" style={{ animationDelay: "160ms" }} />
        <span className="bot-dot" style={{ animationDelay: "320ms" }} />
      </div>
    </div>
  );
}

// ── Copy toast ─────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button className="bot-copy-btn" onClick={copy} title="Copy message">
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
      )}
    </button>
  );
}

// ── Render text with clickable hyperlinks ─────────────────────────────────
const URL_REGEX = /(https?:\/\/[^\s\)\]\>"']+)/g;
function renderTextWithLinks(text, isUser) {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer"
        className={`bot-link ${isUser ? "bot-link-user" : "bot-link-bot"}`}>
        {part}
      </a>
    ) : part
  );
}

// ── Message bubble ─────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`bot-msg-row ${isUser ? "bot-msg-row-user" : "bot-msg-row-bot"}`}>
      {!isUser && <div className="bot-avatar-sm">🤖</div>}
      <div className={`bot-bubble ${isUser ? "bot-bubble-user" : "bot-bubble-bot"}`}>
        <div className="bot-bubble-text">{renderTextWithLinks(msg.content, isUser)}</div>
        <div className="bot-bubble-footer">
          <span className="bot-bubble-time">{fmtTime(msg.created_at)}</span>
          <CopyBtn text={msg.content} />
        </div>
      </div>
      {isUser && <div className="bot-avatar-sm bot-avatar-user">👤</div>}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Bot() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef([]);

  // Keep ref in sync with state (for access inside callbacks without stale closure)
  messagesRef.current = messages;

  // ── Auth + load history ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Get user name
      const { data: profile } = await supabase
        .from("users_profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();
      if (profile?.full_name) setUserName(profile.full_name.split(" ")[0]);

      // Load chat history
      const { data: history, error: histErr } = await supabase
        .from("bot_chat_messages")
        .select("id, role, content, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(200);

      if (!histErr && history) setMessages(history);
      setHistoryLoading(false);
    })();
  }, []);

  // ── Auto-scroll on new messages ───────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !userId) return;

    setInput("");
    setError("");
    setLoading(true);

    // 1. Append user message to UI immediately
    const userMsg = {
      id: "local-u-" + Date.now(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // 2. Save user message to DB directly from client
      await supabase.from("bot_chat_messages").insert({
        user_id: userId,
        role: "user",
        content: text,
      });

      // 3. Build history for context
      const historyForContext = messagesRef.current
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      // 4. Call edge function for AI reply only
      const res = await fetch(SUPABASE_FUNC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          user_id: userId,
          history: historyForContext,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError("Bot error: " + data.error);
      } else {
        const replyText = data.reply;

        // 5. Append bot reply to UI
        const botMsg = {
          id: "local-b-" + Date.now(),
          role: "assistant",
          content: replyText,
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botMsg]);

        // 6. Save bot reply to DB directly from client
        await supabase.from("bot_chat_messages").insert({
          user_id: userId,
          role: "assistant",
          content: replyText,
        });
      }
    } catch (err) {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, userId]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Clear chat ────────────────────────────────────────────────────────────
  const clearChat = async () => {
    if (!userId) return;
    setClearing(true);
    await supabase.from("bot_chat_messages").delete().eq("user_id", userId);
    setMessages([]);
    setClearing(false);
    setShowClearConfirm(false);
  };

  const grouped = groupByDate(messages);

  return (
    <div className="bot-root">
      <style>{CSS}</style>

      {/* ── Header ── */}
      <div className="bot-header">
        <div className="bot-header-left">
          <div className="bot-header-avatar">🤖</div>
          <div>
            <div className="bot-header-name">AIDLA Bot</div>
            <div className="bot-header-status">
              <span className="bot-status-dot" />
              Always online · Speaks all languages
            </div>
          </div>
        </div>
        <div className="bot-header-actions">
          <button
            className="bot-clear-btn"
            onClick={() => setShowClearConfirm(true)}
            title="Clear chat history"
            disabled={messages.length === 0 || clearing}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* ── Clear confirm modal ── */}
      {showClearConfirm && (
        <div className="bot-confirm-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="bot-confirm-box" onClick={e => e.stopPropagation()}>
            <div className="bot-confirm-icon">🗑️</div>
            <div className="bot-confirm-title">Clear all messages?</div>
            <div className="bot-confirm-sub">This action cannot be undone. All chat history will be permanently deleted.</div>
            <div className="bot-confirm-actions">
              <button className="bot-confirm-cancel" onClick={() => setShowClearConfirm(false)}>Cancel</button>
              <button className="bot-confirm-delete" onClick={clearChat} disabled={clearing}>
                {clearing ? "Clearing…" : "Yes, Clear All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="bot-messages">
        {historyLoading ? (
          <div className="bot-history-loading">
            <div className="bot-spinner" />
            <span>Loading chat history…</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="bot-empty">
            <div className="bot-empty-icon">🤖</div>
            <div className="bot-empty-title">Hi{userName ? `, ${userName}` : ""}! I'm AIDLA Bot 👋</div>
            <div className="bot-empty-sub">
              Ask me anything about AIDLA — coins, courses, free tools, lucky draws, withdrawals, and more! I speak all languages. 🌍
            </div>
            <div className="bot-empty-chips">
              {["How do I earn coins? 🪙", "What free tools are available? 🔧", "How to withdraw earnings? 💵", "Tell me about Lucky Draw 🎲"].map(q => (
                <button key={q} className="bot-suggestion-chip" onClick={() => { setInput(q); inputRef.current?.focus(); }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {grouped.map((item) =>
              item.type === "date" ? (
                <div key={item.id} className="bot-date-divider">
                  <span>{item.label}</span>
                </div>
              ) : (
                <MessageBubble key={item.id} msg={item} />
              )
            )}
            {loading && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bot-error">
          ⚠️ {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* ── Input ── */}
      <div className="bot-input-wrap">
        <div className="bot-input-box">
          <textarea
            ref={inputRef}
            className="bot-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask me anything about AIDLA…"
            rows={1}
            disabled={loading || historyLoading}
          />
          <button
            className={`bot-send-btn ${input.trim() && !loading ? "bot-send-btn-active" : ""}`}
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            title="Send (Enter)"
          >
            {loading ? (
              <div className="bot-send-spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
        <div className="bot-input-hint">Press Enter to send · Shift+Enter for new line</div>
      </div>
    </div>
  );
}

// ── CSS ────────────────────────────────────────────────────────────────────
const CSS = `
  .bot-root {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 140px);
    min-height: 480px;
    max-width: 820px;
    margin: 0 auto;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: rgba(255,255,255,0.6);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.9);
    box-shadow: 12px 12px 40px rgba(15,23,42,0.07), -8px -8px 30px rgba(255,255,255,0.8);
    overflow: hidden;
  }

  /* ── Header ── */
  .bot-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: rgba(255,255,255,0.85);
    border-bottom: 1px solid rgba(30,58,138,0.08);
    flex-shrink: 0;
    gap: 10px;
  }
  .bot-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .bot-header-avatar {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(59,130,246,0.3);
    flex-shrink: 0;
  }
  .bot-header-name {
    font-weight: 800;
    font-size: 1rem;
    color: #0f172a;
    letter-spacing: -0.3px;
  }
  .bot-header-status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    margin-top: 1px;
  }
  .bot-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
    animation: botPulse 2s ease infinite;
    flex-shrink: 0;
  }
  @keyframes botPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
    50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); }
  }

  .bot-header-actions {
    display: flex;
    gap: 8px;
  }
  .bot-clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 13px;
    border-radius: 10px;
    border: 1px solid rgba(239,68,68,0.18);
    background: rgba(239,68,68,0.05);
    color: #dc2626;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .bot-clear-btn:hover:not(:disabled) {
    background: rgba(239,68,68,0.1);
    border-color: rgba(239,68,68,0.3);
    transform: translateY(-1px);
  }
  .bot-clear-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Messages area ── */
  .bot-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    scroll-behavior: smooth;
  }
  .bot-messages::-webkit-scrollbar { width: 4px; }
  .bot-messages::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.25); border-radius: 100px; }

  /* ── Date divider ── */
  .bot-date-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 10px 0 6px;
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    letter-spacing: 0.5px;
    text-align: center;
    justify-content: center;
  }
  .bot-date-divider span {
    padding: 3px 12px;
    background: rgba(30,58,138,0.06);
    border-radius: 100px;
    border: 1px solid rgba(30,58,138,0.08);
  }

  /* ── Message rows ── */
  .bot-msg-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin-bottom: 6px;
    animation: botMsgIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes botMsgIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: none; }
  }
  .bot-msg-row-user { flex-direction: row-reverse; }
  .bot-msg-row-bot  { flex-direction: row; }

  /* ── Avatars ── */
  .bot-avatar-sm {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(59,130,246,0.2);
  }
  .bot-avatar-user {
    background: linear-gradient(135deg, #475569, #64748b);
    box-shadow: 0 2px 8px rgba(71,85,105,0.2);
  }

  /* ── Bubbles ── */
  .bot-bubble {
    max-width: min(75%, 560px);
    padding: 10px 13px 8px;
    border-radius: 16px;
    line-height: 1.55;
    font-size: 0.9rem;
    position: relative;
  }
  .bot-bubble-bot {
    background: #ffffff;
    border: 1px solid rgba(30,58,138,0.1);
    border-bottom-left-radius: 4px;
    box-shadow: 4px 4px 14px rgba(15,23,42,0.06), -2px -2px 8px rgba(255,255,255,0.9);
    color: #1e293b;
  }
  .bot-bubble-user {
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 16px rgba(59,130,246,0.25);
  }
  .bot-bubble-text {
    font-weight: 500;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .bot-bubble-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 5px;
  }
  .bot-bubble-time {
    font-size: 10px;
    font-weight: 600;
    opacity: 0.55;
  }

  /* ── Copy button ── */
  .bot-copy-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 2px;
    opacity: 0.45;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.15s;
    border-radius: 4px;
  }
  .bot-copy-btn:hover { opacity: 1; }

  /* ── Hyperlinks in messages ── */
  .bot-link {
    text-decoration: underline;
    text-underline-offset: 2px;
    word-break: break-all;
    transition: opacity 0.15s;
  }
  .bot-link:hover { opacity: 0.75; }
  .bot-link-bot { color: #2563eb; }
  .bot-link-user { color: #bfdbfe; }

  /* ── Typing indicator ── */
  .bot-typing-wrap {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    animation: botMsgIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .bot-typing-bubble {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #ffffff;
    border: 1px solid rgba(30,58,138,0.1);
    border-bottom-left-radius: 4px;
    border-radius: 16px;
    padding: 12px 16px;
    box-shadow: 4px 4px 14px rgba(15,23,42,0.06);
  }
  .bot-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    animation: botDotBounce 1.2s ease infinite;
    display: block;
  }
  @keyframes botDotBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  /* ── Empty state ── */
  .bot-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 30px 20px;
    text-align: center;
    gap: 10px;
  }
  .bot-empty-icon {
    font-size: 52px;
    animation: botFloat 3s ease-in-out infinite;
  }
  @keyframes botFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .bot-empty-title {
    font-size: 1.1rem;
    font-weight: 800;
    color: #1e3a8a;
    margin-top: 4px;
  }
  .bot-empty-sub {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 500;
    max-width: 360px;
    line-height: 1.5;
  }
  .bot-empty-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 6px;
  }
  .bot-suggestion-chip {
    padding: 8px 14px;
    border-radius: 100px;
    border: 1px solid rgba(30,58,138,0.15);
    background: rgba(30,58,138,0.05);
    color: #1e3a8a;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
  }
  .bot-suggestion-chip:hover {
    background: rgba(30,58,138,0.1);
    border-color: rgba(30,58,138,0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(30,58,138,0.1);
  }

  /* ── History loading ── */
  .bot-history-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #64748b;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 20px;
    justify-content: center;
  }
  .bot-spinner {
    width: 18px;
    height: 18px;
    border: 2.5px solid rgba(59,130,246,0.2);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: botSpin 0.7s linear infinite;
  }
  @keyframes botSpin { to { transform: rotate(360deg); } }

  /* ── Error bar ── */
  .bot-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: rgba(239,68,68,0.07);
    border-top: 1px solid rgba(239,68,68,0.15);
    color: #dc2626;
    font-size: 0.82rem;
    font-weight: 600;
    flex-shrink: 0;
  }
  .bot-error button {
    background: transparent;
    border: none;
    color: #dc2626;
    font-size: 18px;
    cursor: pointer;
    font-weight: 700;
    padding: 0 4px;
  }

  /* ── Input area ── */
  .bot-input-wrap {
    padding: 12px 14px 10px;
    background: rgba(255,255,255,0.85);
    border-top: 1px solid rgba(30,58,138,0.08);
    flex-shrink: 0;
  }
  .bot-input-box {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: #f8fafc;
    border: 1.5px solid rgba(30,58,138,0.12);
    border-radius: 16px;
    padding: 8px 10px 8px 16px;
    box-shadow: inset 3px 3px 6px rgba(15,23,42,0.04), inset -3px -3px 6px rgba(255,255,255,1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .bot-input-box:focus-within {
    border-color: rgba(59,130,246,0.4);
    background: #fff;
    box-shadow: inset 2px 2px 4px rgba(15,23,42,0.03), inset -2px -2px 4px rgba(255,255,255,1), 0 0 0 3px rgba(59,130,246,0.08);
  }
  .bot-textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    font-size: 0.92rem;
    font-weight: 500;
    color: #0f172a;
    line-height: 1.5;
    max-height: 120px;
    overflow-y: auto;
    font-family: inherit;
    padding: 4px 0;
  }
  .bot-textarea::placeholder { color: #94a3b8; }
  .bot-textarea:disabled { opacity: 0.6; cursor: not-allowed; }

  .bot-send-btn {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    border: none;
    background: #e2e8f0;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: not-allowed;
    flex-shrink: 0;
    transition: all 0.2s;
  }
  .bot-send-btn-active {
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #fff;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(59,130,246,0.3);
  }
  .bot-send-btn-active:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 5px 14px rgba(59,130,246,0.4);
  }
  .bot-send-btn-active:active {
    transform: translateY(1px);
    box-shadow: 0 2px 6px rgba(59,130,246,0.2);
  }
  .bot-send-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: botSpin 0.7s linear infinite;
  }

  .bot-input-hint {
    text-align: center;
    font-size: 10px;
    color: #94a3b8;
    font-weight: 600;
    margin-top: 6px;
    letter-spacing: 0.3px;
  }

  /* ── Clear confirm modal ── */
  .bot-confirm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(2,6,23,0.55);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    padding: 16px;
  }
  .bot-confirm-box {
    background: #fff;
    border-radius: 22px;
    padding: 30px 28px;
    text-align: center;
    max-width: 380px;
    width: 100%;
    box-shadow: 0 30px 80px rgba(2,6,23,0.25), inset 0 1px 0 rgba(255,255,255,0.6);
    animation: botConfirmIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes botConfirmIn {
    from { opacity: 0; transform: scale(0.88) translateY(20px); }
    to { opacity: 1; transform: none; }
  }
  .bot-confirm-icon { font-size: 44px; margin-bottom: 10px; }
  .bot-confirm-title {
    font-size: 1.15rem;
    font-weight: 900;
    color: #0f172a;
    margin-bottom: 8px;
  }
  .bot-confirm-sub {
    font-size: 0.84rem;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 22px;
  }
  .bot-confirm-actions { display: flex; gap: 10px; justify-content: center; }
  .bot-confirm-cancel {
    padding: 10px 22px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    background: transparent;
    color: #475569;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }
  .bot-confirm-cancel:hover { background: #f8fafc; }
  .bot-confirm-delete {
    padding: 10px 22px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: #fff;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 3px 0 #b91c1c, 0 6px 14px rgba(239,68,68,0.25);
    transition: all 0.15s;
  }
  .bot-confirm-delete:hover:not(:disabled) {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }
  .bot-confirm-delete:disabled { opacity: 0.7; cursor: not-allowed; }

  /* ── Mobile ── */
  @media (max-width: 640px) {
    .bot-root {
      height: calc(100vh - 100px);
      border-radius: 14px;
    }
    .bot-header { padding: 11px 13px; }
    .bot-header-avatar { width: 36px; height: 36px; font-size: 17px; border-radius: 11px; }
    .bot-header-name { font-size: 0.9rem; }
    .bot-header-status { font-size: 10px; }
    .bot-clear-btn span { display: none; }
    .bot-clear-btn { padding: 7px 10px; }
    .bot-messages { padding: 12px; gap: 3px; }
    .bot-bubble { font-size: 0.85rem; padding: 9px 11px 7px; max-width: 85%; }
    .bot-empty-icon { font-size: 40px; }
    .bot-empty-title { font-size: 0.95rem; }
    .bot-empty-sub { font-size: 0.8rem; }
    .bot-suggestion-chip { font-size: 0.74rem; padding: 6px 11px; }
    .bot-input-wrap { padding: 10px 11px 8px; }
    .bot-input-box { border-radius: 13px; padding: 7px 8px 7px 13px; }
    .bot-textarea { font-size: 0.86rem; }
    .bot-send-btn { width: 34px; height: 34px; border-radius: 10px; }
    .bot-input-hint { font-size: 9px; }
    .bot-confirm-box { padding: 24px 20px; border-radius: 18px; }
    .bot-confirm-icon { font-size: 36px; }
    .bot-confirm-title { font-size: 1rem; }
  }
`;