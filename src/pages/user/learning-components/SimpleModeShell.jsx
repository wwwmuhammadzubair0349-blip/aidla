import { useEffect, useMemo, useRef, useState } from 'react';

const C = {
  text: '#ECECEC',
  textSoft: '#B4B4B4',
  textMute: '#8E8E8E',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  cardSoft: '#242424',
  hover: 'rgba(255,255,255,0.06)',
  userBubble: '#2f2f2f',
  botBubble: '#262626',
  accent: '#10A37F',
  accentHover: '#0E8F70',
  shadow: '0 10px 30px rgba(0,0,0,0.35)',
};

const CSS = `
.sm-wrap {
  width: 100%;
}

.sm-welcome {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 0 70px;
}

.sm-badge {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, #14b8a6, #0f766e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 18px;
  box-shadow: ${C.shadow};
}

.sm-title {
  font-size: clamp(28px, 5vw, 42px);
  line-height: 1.1;
  margin: 0 0 10px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${C.text};
}

.sm-sub {
  margin: 0;
  color: ${C.textSoft};
  font-size: 15px;
  line-height: 1.7;
  max-width: 700px;
}

.sm-grid {
  margin-top: 26px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 12px;
}

.sm-card {
  border: 1px solid ${C.border};
  background: ${C.cardSoft};
  border-radius: 16px;
  padding: 14px;
  color: ${C.text};
  cursor: pointer;
  transition: 0.18s ease;
  text-align: left;
}

.sm-card:hover {
  background: ${C.hover};
  border-color: ${C.borderStrong};
}

.sm-card-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}

.sm-card-desc {
  font-size: 12px;
  color: ${C.textMute};
  line-height: 1.6;
}

.sm-messages {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 18px;
}

.sm-row {
  display: flex;
  width: 100%;
}

.sm-row.user {
  justify-content: flex-end;
}

.sm-row.assistant {
  justify-content: flex-start;
}

.sm-msg-wrap {
  max-width: 100%;
}

.sm-msg-label {
  font-size: 11px;
  color: ${C.textMute};
  margin-bottom: 6px;
}

.sm-bubble {
  max-width: min(100%, 760px);
  border-radius: 20px;
  padding: 14px 16px;
  line-height: 1.75;
  font-size: 14px;
  word-break: break-word;
  white-space: pre-wrap;
  color: ${C.text};
}

.sm-row.user .sm-bubble {
  background: ${C.userBubble};
  border-top-right-radius: 6px;
}

.sm-row.assistant .sm-bubble {
  background: ${C.botBubble};
  border: 1px solid ${C.border};
  border-top-left-radius: 6px;
}

.sm-panel {
  border: 1px solid ${C.border};
  background: ${C.cardSoft};
  border-radius: 18px;
  padding: 18px;
  margin-top: 18px;
}

.sm-panel-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${C.text};
}

.sm-panel-text {
  font-size: 14px;
  color: ${C.textSoft};
  line-height: 1.7;
}

.sm-composer-wrap {
  border-top: 1px solid ${C.border};
  padding-top: 14px;
  margin-top: 8px;
}

.sm-composer-box {
  border: 1px solid ${C.borderStrong};
  background: #1e1e1e;
  border-radius: 24px;
  padding: 10px 10px 10px 12px;
  box-shadow: ${C.shadow};
}

.sm-composer-top {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.sm-textarea {
  flex: 1;
  min-height: 24px;
  max-height: 180px;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: ${C.text};
  font-size: 15px;
  line-height: 1.65;
  padding: 8px 2px;
}

.sm-textarea::placeholder {
  color: ${C.textMute};
}

.sm-send {
  width: 38px;
  height: 38px;
  border: none;
  background: ${C.accent};
  color: white;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.18s ease;
  flex-shrink: 0;
}

.sm-send:hover {
  background: ${C.accentHover};
}

.sm-send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.sm-meta {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 9px;
  padding: 0 2px;
  font-size: 11px;
  color: ${C.textMute};
}

@media (max-width: 767px) {
  .sm-grid {
    grid-template-columns: 1fr;
  }
}
`;

function buildAssistantReply(text, profile, modeLabel, extraText) {
  const name = profile?.full_name?.split(' ')?.[0] || 'there';

  return `Absolutely ${name} 🙂  
You are in **${modeLabel}** mode now.

This separate component is ready.  
Next, we will connect it to your real edge function so it gives proper AI answers.

For now, I received your message:

"${text}"

${extraText}

Send the next mode and I’ll keep building the system step by step.`;
}

export default function SimpleModeShell({
  profile,
  initialMessages = [],
  onMessagesChange,
  modeLabel,
  modeIcon,
  description,
  suggestions = [],
  placeholder,
  extraText,
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
  }, [input]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  function updateMessages(next) {
    setMessages(next);
    onMessagesChange?.(next);
  }

  async function sendMessage(overrideText) {
    const text = String(overrideText ?? input).trim();
    if (!text || sending) return;

    setSending(true);

    const userMsg = {
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    const assistantMsg = {
      role: 'assistant',
      content: buildAssistantReply(text, profile, modeLabel, extraText),
      created_at: new Date().toISOString(),
    };

    const next = [...messages, userMsg, assistantMsg];
    updateMessages(next);
    setInput('');
    setSending(false);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const hasMessages = useMemo(() => messages.length > 0, [messages]);

  return (
    <>
      <style>{CSS}</style>

      <div className="sm-wrap">
        {!hasMessages ? (
          <div className="sm-welcome">
            <div className="sm-badge">{modeIcon}</div>
            <h1 className="sm-title">{modeLabel}</h1>
            <p className="sm-sub">{description}</p>

            <div className="sm-grid">
              {suggestions.map((item, i) => (
                <button
                  key={i}
                  className="sm-card"
                  onClick={() => sendMessage(item.prompt)}
                >
                  <div className="sm-card-title">{item.title}</div>
                  <div className="sm-card-desc">{item.desc}</div>
                </button>
              ))}
            </div>

            <div className="sm-panel">
              <div className="sm-panel-title">About this mode</div>
              <div className="sm-panel-text">{extraText}</div>
            </div>
          </div>
        ) : (
          <div className="sm-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`sm-row ${m.role === 'user' ? 'user' : 'assistant'}`}
              >
                <div className="sm-msg-wrap">
                  <div className="sm-msg-label">
                    {m.role === 'user' ? 'You' : `AIDLA • ${modeLabel}`}
                  </div>
                  <div className="sm-bubble">{m.content}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        <div className="sm-composer-wrap">
          <div className="sm-composer-box">
            <div className="sm-composer-top">
              <textarea
                ref={textareaRef}
                className="sm-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder || `Message ${modeLabel}...`}
                rows={1}
              />

              <button
                className="sm-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || sending}
                aria-label="Send"
                title="Send"
              >
                ↑
              </button>
            </div>

            <div className="sm-meta">
              <span>Enter to send • Shift+Enter for new line</span>
              <span>{modeIcon} {modeLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}