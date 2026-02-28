import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

// ============================================================
// AIDLA HELP BOT - KNOWLEDGE BASE
// To add new answers: add an entry to BOT_KB with keywords[] and answer
// To upgrade to AI: replace getBotAnswer() with an API call
// To load from DB: fetch from a bot_faqs Supabase table on mount
// ============================================================
const BOT_KB = [
  { keywords: ["hello", "hi", "hey", "salam"], answer: "Welcome to AIDLA support! How can I help you today?" },
  { keywords: ["what is aidla", "about aidla", "aidla platform"], answer: "AIDLA is an educational platform where you can learn, take tests, participate in lucky draws and wheel spins, and earn digital coin rewards!" },
  { keywords: ["register", "signup", "sign up", "create account", "join"], answer: "To register:\n1. Click Sign Up on the home page\n2. Enter your name, email, and password\n3. Verify your email\n4. Start learning and earning!" },
  { keywords: ["login", "log in", "sign in", "cant login", "login problem"], answer: "Having trouble logging in? Try:\n1. Check your email and password\n2. Use Forgot Password to reset\n3. Make sure your email is verified\n4. Contact support if the issue persists" },
  { keywords: ["coins", "earn coins", "how to earn", "rewards"], answer: "You can earn coins on AIDLA by:\n- Completing tests and quizzes\n- Spinning the Lucky Wheel\n- Winning Lucky Draws\n- Participating in events\nCoins can be redeemed for prizes!" },
  { keywords: ["lucky wheel", "wheel", "spin"], answer: "The Lucky Wheel gives you a chance to win coins, gifts, or bonus spins!\n- Free spin available daily\n- Paid spins available anytime\n- Results are instant" },
  { keywords: ["lucky draw", "draw", "raffle"], answer: "Lucky Draws are special events where participants can win big prizes!\n- Eligibility varies per draw\n- Winners are announced officially\n- Check the Leaderboard for results" },
  { keywords: ["test", "quiz", "exam", "assessment"], answer: "AIDLA tests are scored by correct answers and speed.\n- Faster and more accurate = higher rank\n- Live leaderboard updates in real time\n- Results and winners are posted on the Leaderboard page" },
  { keywords: ["leaderboard", "ranking", "rank", "top users"], answer: "The AIDLA Leaderboard shows:\n- Live Board: real-time test rankings\n- Test Results: official winners\n- Lucky Draw: draw winners\n- Lucky Wheel: recent wins" },
  { keywords: ["prize", "prizes", "winning", "what can i win"], answer: "Prizes on AIDLA include:\n- Digital coins\n- Physical gifts\n- Special rewards like phones and vouchers\nPrize details are shown per event." },
  { keywords: ["password", "forgot password", "reset password"], answer: "To reset your password:\n1. Go to the login page\n2. Click Forgot Password\n3. Enter your registered email\n4. Check your inbox for a reset link" },
  { keywords: ["profile", "account", "settings", "edit profile"], answer: "You can manage your AIDLA profile from Settings after logging in. Update your name, picture, and preferences there." },
  { keywords: ["blog", "blogs", "articles", "news"], answer: "Stay updated through:\n- Blogs: educational tips and strategies\n- News: platform updates and announcements\nBoth are accessible from the main navigation." },
  { keywords: ["contact", "support", "help", "email"], answer: "You can reach AIDLA support at support@aidla.netlify.app or use the contact form on this page!" },
  { keywords: ["delete account", "remove account", "deactivate"], answer: "To delete your account, email support@aidla.netlify.app with your registered email. We will process it within 3-5 business days." },
  { keywords: ["redeem", "withdraw", "exchange coins"], answer: "Coin redemption details vary by event and promotion. Check active events or contact support for options." },
  { keywords: ["coin balance", "my coins", "check coins"], answer: "You can check your coin balance in your Profile or Dashboard after logging in. Coins update in real time!" },
];

// Replace this function body to upgrade the bot to AI or DB-powered
function getBotAnswer(message) {
  const lower = message.toLowerCase();
  for (const entry of BOT_KB) {
    if (entry.keywords.some(function(k) { return lower.includes(k); })) {
      return entry.answer;
    }
  }
  return "I'm not sure about that yet. For detailed help, please use the contact form or email support@aidla.netlify.app and a human will assist you shortly!";
}

const QUICK_REPLIES = [
  "What is AIDLA?",
  "How to earn coins?",
  "Lucky Wheel help",
  "Reset password",
  "Contact support",
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy: #0b1437;
    --royal: #1a3a8f;
    --sky: #3b82f6;
    --gold: #f59e0b;
    --gold-light: #fcd34d;
    --slate: #64748b;
    --green: #10b981;
    --red: #ef4444;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ct-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .bg-orbs { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .bg-orb-1 { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: rgba(59,130,246,0.06); filter: blur(80px); top: -200px; left: -200px; }
  .bg-orb-2 { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: rgba(245,158,11,0.05); filter: blur(80px); top: 300px; right: -250px; }

  .ct-wrap {
    flex: 1;
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    padding: clamp(20px, 5vw, 60px) clamp(14px, 4vw, 32px) clamp(40px, 8vw, 80px);
    position: relative;
    z-index: 2;
  }

  .ct-badge {
    display: inline-block;
    background: linear-gradient(135deg, #f59e0b, #fcd34d);
    color: #0b1437;
    padding: 5px 14px;
    border-radius: 30px;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(245,158,11,0.25);
  }

  .ct-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 6vw, 2.5rem);
    font-weight: 900;
    color: #0b1437;
    line-height: 1.15;
    margin-bottom: 6px;
  }

  .ct-title-accent {
    background: linear-gradient(135deg, #1a3a8f, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ct-desc {
    color: #64748b;
    font-size: clamp(0.85rem, 2vw, 1rem);
    line-height: 1.55;
    max-width: 500px;
    margin-bottom: clamp(22px, 5vw, 36px);
  }

  .ct-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-bottom: 20px;
  }
  @media (max-width: 620px) { .ct-grid { grid-template-columns: 1fr; } }

  .ct-card {
    background: rgba(255,255,255,0.97);
    border-radius: 22px;
    box-shadow: 0 8px 40px rgba(11,20,55,0.07);
    border: 1px solid rgba(59,130,246,0.09);
    overflow: hidden;
  }

  .ct-card-hd {
    padding: clamp(13px,3vw,18px) clamp(16px,4vw,22px);
    border-bottom: 1px solid rgba(59,130,246,0.08);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ct-card-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #1a3a8f, #3b82f6);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .ct-card-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(0.9rem, 2.5vw, 1.05rem);
    font-weight: 800;
    color: #0b1437;
  }

  .ct-card-body { padding: clamp(14px,3.5vw,22px) clamp(16px,4vw,22px); }

  .ct-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 13px; }
  .ct-label { font-size: 0.7rem; font-weight: 700; color: #0b1437; text-transform: uppercase; letter-spacing: 0.05em; }

  .ct-input, .ct-textarea, .ct-select {
    width: 100%;
    padding: 10px 13px;
    background: rgba(59,130,246,0.04);
    border: 1.5px solid rgba(59,130,246,0.13);
    border-radius: 11px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    color: #0b1437;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ct-textarea { resize: none; }
  .ct-input:focus, .ct-textarea:focus, .ct-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }
  .ct-input::placeholder, .ct-textarea::placeholder { color: #94a3b8; }

  .ct-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #1a3a8f, #3b82f6);
    color: #fff;
    border: none;
    border-radius: 30px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(26,58,143,0.25);
    margin-top: 4px;
  }
  .ct-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,58,143,0.3); }
  .ct-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

  .ct-success {
    text-align: center;
    padding: 30px 20px;
  }
  .ct-success-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10b981, #34d399);
    color: #fff;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    box-shadow: 0 5px 18px rgba(16,185,129,0.28);
  }
  .ct-success h3 {
    font-family: 'Playfair Display', serif;
    color: #0b1437;
    font-size: clamp(1rem, 3vw, 1.2rem);
    margin-bottom: 7px;
  }
  .ct-success p { color: #64748b; font-size: 0.87rem; line-height: 1.6; }

  .ct-err {
    background: rgba(254,226,226,0.9);
    border: 1px solid #fca5a5;
    color: #991b1b;
    padding: 9px 13px;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .ct-info-row {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 11px 0;
    border-bottom: 1px solid rgba(59,130,246,0.07);
  }
  .ct-info-row:last-child { border-bottom: none; }
  .ct-info-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: rgba(59,130,246,0.08);
    color: #1a3a8f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
  .ct-info-lbl { font-size: 0.63rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
  .ct-info-val { font-size: 0.86rem; font-weight: 600; color: #0b1437; margin-top: 1px; word-break: break-all; }

  /* BOT */
  .bot-card {
    background: rgba(255,255,255,0.97);
    border-radius: 22px;
    box-shadow: 0 8px 40px rgba(11,20,55,0.07);
    border: 1px solid rgba(59,130,246,0.09);
    overflow: hidden;
  }

  .bot-hd {
    padding: clamp(13px,3vw,18px) clamp(16px,4vw,22px);
    border-bottom: 1px solid rgba(59,130,246,0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }
  .bot-hd-left { display: flex; align-items: center; gap: 10px; }
  .bot-av {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0b1437, #1a3a8f);
    color: #fcd34d;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(11,20,55,0.2);
  }
  .bot-title { font-family: 'Playfair Display', serif; font-size: clamp(0.9rem,2.5vw,1.05rem); font-weight: 800; color: #0b1437; }
  .bot-online { font-size: 0.6rem; color: #10b981; font-weight: 700; display: flex; align-items: center; gap: 4px; margin-top: 1px; }
  .bot-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; animation: bot-pulse 1.5s ease-in-out infinite; }
  @keyframes bot-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }

  .bot-msgs {
    height: 270px;
    overflow-y: auto;
    padding: clamp(10px,2.5vw,14px) clamp(13px,3.5vw,18px);
    display: flex;
    flex-direction: column;
    gap: 9px;
    scroll-behavior: smooth;
  }
  .bot-msgs::-webkit-scrollbar { width: 4px; }
  .bot-msgs::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius: 4px; }

  .bot-msg { display: flex; gap: 7px; align-items: flex-end; max-width: 88%; }
  .bot-msg.user { align-self: flex-end; flex-direction: row-reverse; }
  .bot-msg.bot  { align-self: flex-start; }

  .bot-msg-av {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    flex-shrink: 0;
  }
  .bot-msg.bot  .bot-msg-av { background: linear-gradient(135deg, #0b1437, #1a3a8f); color: #fcd34d; }
  .bot-msg.user .bot-msg-av { background: linear-gradient(135deg, #1a3a8f, #3b82f6); color: #fff; }

  .bot-bubble {
    padding: 8px 12px;
    border-radius: 15px;
    font-size: clamp(0.77rem,2vw,0.86rem);
    line-height: 1.55;
    white-space: pre-line;
    word-break: break-word;
  }
  .bot-msg.bot  .bot-bubble { background: rgba(59,130,246,0.07); color: #0b1437; border-bottom-left-radius: 4px; }
  .bot-msg.user .bot-bubble { background: linear-gradient(135deg, #1a3a8f, #3b82f6); color: #fff; border-bottom-right-radius: 4px; }

  .bot-typing-wrap { display: flex; gap: 7px; align-items: flex-end; align-self: flex-start; }
  .bot-typing { display: flex; align-items: center; gap: 4px; padding: 10px 14px; background: rgba(59,130,246,0.07); border-radius: 15px; border-bottom-left-radius: 4px; }
  .bot-typing span { width: 5px; height: 5px; border-radius: 50%; background: #3b82f6; opacity: 0.6; animation: typing-b 1.2s ease-in-out infinite; }
  .bot-typing span:nth-child(2) { animation-delay: 0.2s; }
  .bot-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing-b { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

  .bot-quick {
    padding: 7px clamp(13px,3.5vw,18px);
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    border-top: 1px solid rgba(59,130,246,0.06);
    background: rgba(59,130,246,0.02);
  }
  .bot-qbtn {
    padding: 5px 11px;
    border-radius: 18px;
    font-size: 0.67rem;
    font-weight: 700;
    cursor: pointer;
    border: 1px solid rgba(59,130,246,0.18);
    background: transparent;
    color: #1a3a8f;
    transition: all 0.18s;
    white-space: nowrap;
  }
  .bot-qbtn:hover { background: rgba(59,130,246,0.08); }

  .bot-input-row {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: clamp(11px,2.5vw,14px) clamp(13px,3.5vw,18px);
    border-top: 1px solid rgba(59,130,246,0.08);
  }
  .bot-inp {
    flex: 1;
    padding: 9px 13px;
    background: rgba(59,130,246,0.04);
    border: 1.5px solid rgba(59,130,246,0.13);
    border-radius: 28px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.86rem;
    color: #0b1437;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .bot-inp:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .bot-inp::placeholder { color: #94a3b8; }
  .bot-send {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #1a3a8f, #3b82f6);
    color: #fff;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 3px 10px rgba(26,58,143,0.24);
    flex-shrink: 0;
  }
  .bot-send:hover { transform: scale(1.08); }
  .bot-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .site-footer {
    background: #0b1437;
    color: rgba(255,255,255,0.6);
    padding: clamp(18px,4vw,36px) 24px;
    text-align: center;
    font-size: 0.85rem;
    margin-top: 40px;
    position: relative;
    z-index: 2;
  }
  .site-footer strong { color: #fcd34d; }
  .site-footer a { color: rgba(255,255,255,0.4); text-decoration: none; margin: 0 10px; }
  .site-footer a:hover { color: #fff; }

  @media (max-width: 480px) {
    .ct-card-body { padding: 14px 14px; }
    .bot-msgs { height: 230px; }
    .site-footer { font-size: 0.72rem; }
  }
`;

// ============================================================
// CONTACT FORM
// ============================================================
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  const set = function(e) { setForm(function(f) { return Object.assign({}, f, { [e.target.name]: e.target.value }); }); };

  const submit = async function(e) {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    const { error } = await supabase.from("contact_messages").insert([{
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject || "General",
      message: form.message.trim(),
    }]);
    if (error) { setErrMsg(error.message); setStatus("error"); }
    else setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="ct-success">
        <div className="ct-success-icon">OK</div>
        <h3>Message Received!</h3>
        <p>Thank you for reaching out. Our team will reply to <strong>{form.email}</strong> within 24-48 hours.</p>
      </div>
    );
  }

  return (
    <div className="ct-card-body">
      {status === "error" && <div className="ct-err">{errMsg || "Something went wrong. Please try again."}</div>}
      <div className="ct-field">
        <label className="ct-label">Your Name</label>
        <input className="ct-input" name="name" value={form.name} onChange={set} placeholder="Enter your name" required />
      </div>
      <div className="ct-field">
        <label className="ct-label">Email Address</label>
        <input className="ct-input" type="email" name="email" value={form.email} onChange={set} placeholder="you@example.com" required />
      </div>
      <div className="ct-field">
        <label className="ct-label">Subject</label>
        <select className="ct-select" name="subject" value={form.subject} onChange={set}>
          <option value="">Select a subject...</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Account Issue">Account Issue</option>
          <option value="Reward / Prize">Reward / Prize</option>
          <option value="Technical Problem">Technical Problem</option>
          <option value="Partnership">Partnership</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="ct-field">
        <label className="ct-label">Message</label>
        <textarea className="ct-textarea" name="message" value={form.message} onChange={set}
          placeholder="Describe your question or issue..." rows={4} required />
      </div>
      <button className="ct-btn" onClick={submit}
        disabled={status === "sending" || !form.name || !form.email || !form.message}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}

// ============================================================
// HELP BOT
// ============================================================
function HelpBot() {
  const [messages, setMessages] = useState([
    { id: 1, role: "bot", text: "Assalamu Alaikum! I am the AIDLA Help Bot. Ask me anything about the platform - coins, tests, lucky draw, or anything else!" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(function() { endRef.current && endRef.current.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = async function(text) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    setMessages(function(m) { return [...m, { id: Date.now(), role: "user", text: msg }]; });
    setTyping(true);
    await new Promise(function(r) { setTimeout(r, 800 + Math.random() * 600); });
    const answer = getBotAnswer(msg);
    setTyping(false);
    setMessages(function(m) { return [...m, { id: Date.now() + 1, role: "bot", text: answer }]; });
  };

  const handleKey = function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="bot-card">
      <div className="bot-hd">
        <div className="bot-hd-left">
          <div className="bot-av">AI</div>
          <div>
            <div className="bot-title">AIDLA Help Bot</div>
            <div className="bot-online"><span className="bot-dot"></span>Online - Always here to help</div>
          </div>
        </div>
      </div>

      <div className="bot-msgs">
        <AnimatePresence initial={false}>
          {messages.map(function(msg) {
            return (
              <motion.div key={msg.id} className={"bot-msg " + msg.role}
                initial={{ opacity: 0, y: 7, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.22 }}>
                <div className="bot-msg-av">{msg.role === "bot" ? "AI" : "U"}</div>
                <div className="bot-bubble">{msg.text}</div>
              </motion.div>
            );
          })}
          {typing && (
            <motion.div key="typing" className="bot-typing-wrap"
              initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bot-msg-av bot" style={{ background:"linear-gradient(135deg,#0b1437,#1a3a8f)", color:"#fcd34d", width:24, height:24, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem" }}>AI</div>
              <div className="bot-typing"><span /><span /><span /></div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="bot-quick">
        {QUICK_REPLIES.map(function(q) {
          return <button key={q} className="bot-qbtn" onClick={function() { send(q); }}>{q}</button>;
        })}
      </div>

      <div className="bot-input-row">
        <input className="bot-inp" value={input} onChange={function(e) { setInput(e.target.value); }}
          onKeyDown={handleKey} placeholder="Ask a question..." disabled={typing} />
        <button className="bot-send" onClick={function() { send(); }} disabled={typing || !input.trim()}>
          &gt;
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function Contact() {
  return (
    <div className="ct-root">
      <style>{styles}</style>
      <div className="bg-orbs">
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
      </div>

      <div className="ct-wrap">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <span className="ct-badge">Get In Touch</span>
          <h1 className="ct-title">Contact <span className="ct-title-accent">AIDLA</span></h1>
          <p className="ct-desc">Have questions, suggestions, or partnership inquiries? We would love to hear from you.</p>
        </motion.div>

        <div className="ct-grid">
          <motion.div className="ct-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="ct-card-hd">
              <div className="ct-card-icon">@</div>
              <div className="ct-card-title">Send a Message</div>
            </div>
            <ContactForm />
          </motion.div>

          <motion.div className="ct-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <div className="ct-card-hd">
              <div className="ct-card-icon" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>i</div>
              <div className="ct-card-title">Official Contact</div>
            </div>
            <div className="ct-card-body">
              {[
                { icon: "@", label: "Email", val: "support@aidla.netlify.app" },
                { icon: "W", label: "Platform", val: "AIDLA Learning & Rewards" },
                { icon: "T", label: "Response Time", val: "Within 24-48 hours" },
                { icon: "H", label: "Support Hours", val: "Daily, 9 AM - 9 PM" },
              ].map(function(item) {
                return (
                  <div key={item.label} className="ct-info-row">
                    <div className="ct-info-icon">{item.icon}</div>
                    <div>
                      <div className="ct-info-lbl">{item.label}</div>
                      <div className="ct-info-val">{item.val}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <HelpBot />
        </motion.div>
      </div>

   {/* ─── Footer ─── */}
         <footer className="site-footer">
           <div style={{ marginBottom: 10, fontSize: "1.1rem" }}>🕌</div>
           <p>© 2025 <strong>AIDLA</strong>. All rights reserved. Designed with ❤️ for learners everywhere.</p>
           <p style={{ marginTop: 8 }}>
             <Link to="/privacy-policy" style={{ color: "rgba(255,255,255,0.4)", marginRight: 16, textDecoration: "none" }}>Privacy Policy</Link>
             <Link to="/terms" style={{ color: "rgba(255,255,255,0.4)", marginRight: 16, textDecoration: "none" }}>Terms</Link>
             <Link to="/contact" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Contact</Link>
           </p>
         </footer>
    </div>
  );
}