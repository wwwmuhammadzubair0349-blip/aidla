import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async"; // or react-helmet
import { supabase } from "../lib/supabase";
import Footer from "../pages/components/footer"; // adjust path if needed
import "./contact.css"; // external CSS
import { FaTrashAlt, FaMinus } from 'react-icons/fa';
// ============================================================
// AIDLA HELP BOT - KNOWLEDGE BASE
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
  { keywords: ["contact", "support", "help", "email"], answer: "You can reach AIDLA support at support@aidla.online or use the contact form on this page!" },
  { keywords: ["delete account", "remove account", "deactivate"], answer: "To delete your account, email support@aidla.online with your registered email. We will process it within 3-5 business days." },
  { keywords: ["redeem", "withdraw", "exchange coins"], answer: "Coin redemption details vary by event and promotion. Check active events or contact support for options." },
  { keywords: ["coin balance", "my coins", "check coins"], answer: "You can check your coin balance in your Profile or Dashboard after logging in. Coins update in real time!" },
];

function getBotAnswer(message) {
  const lower = message.toLowerCase();
  for (const entry of BOT_KB) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.answer;
    }
  }
  return "I'm not sure about that yet. For detailed help, please use the contact form or email support@aidla.online and a human will assist you shortly!";
}

const QUICK_REPLIES = [
  "What is AIDLA?",
  "How to earn coins?",
  "Lucky Wheel help",
  "Reset password",
  "Contact support",
];

// ============================================================
// CONTACT FORM (unchanged)
// ============================================================
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
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
        <input className="ct-input" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required />
      </div>
      <div className="ct-field">
        <label className="ct-label">Email Address</label>
        <input className="ct-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
      </div>
      <div className="ct-field">
        <label className="ct-label">Subject</label>
        <select className="ct-select" name="subject" value={form.subject} onChange={handleChange}>
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
        <textarea className="ct-textarea" name="message" value={form.message} onChange={handleChange}
          placeholder="Describe your question or issue..." rows={4} required />
      </div>
      <button className="ct-btn" onClick={handleSubmit}
        disabled={status === "sending" || !form.name || !form.email || !form.message}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}

// ============================================================
// HELP BOT (unchanged)
// ============================================================
function HelpBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: "bot", text: "Assalamu Alaikum! I am the AIDLA Help Bot. Ask me anything about the platform - coins, tests, lucky draw, or anything else!" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typing, isOpen]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text: msg }]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const answer = getBotAnswer(msg);
    setTyping(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: "bot", text: answer }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    setMessages([
      { id: 1, role: "bot", text: "Assalamu Alaikum! I am the AIDLA Help Bot. Ask me anything about the platform - coins, tests, lucky draw, or anything else!" }
    ]);
  };

  // Collapsed state – small widget
  if (!isOpen) {
    return (
      <motion.div 
        className="bot-collapsed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsOpen(true)}
      >
        <div className="bot-collapsed-icon">🤖</div>
        <div className="bot-collapsed-text">Need help? Tap here.</div>
      </motion.div>
    );
  }

  // Expanded state – full chat interface
  return (
    <motion.div 
      className="bot-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bot-hd">
        <div className="bot-hd-left">
          <div className="bot-av">AI</div>
          <div>
            <div className="bot-title">AIDLA Help Bot</div>
            <div className="bot-online"><span className="bot-dot"></span>Online - Always here to help</div>
          </div>
        </div>
<div className="bot-hd-actions">
  <button className="bot-clear-btn" onClick={clearChat} aria-label="Clear chat">
    <FaTrashAlt />
  </button>
  <button className="bot-close-btn" onClick={() => setIsOpen(false)} aria-label="Minimize">
    <FaMinus />
  </button>
</div>
      </div>

      <div className="bot-msgs">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id} className={`bot-msg ${msg.role}`}
              initial={{ opacity: 0, y: 7, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22 }}>
              <div className="bot-msg-av">{msg.role === "bot" ? "AI" : "U"}</div>
              <div className="bot-bubble">{msg.text}</div>
            </motion.div>
          ))}
          {typing && (
            <motion.div key="typing" className="bot-typing-wrap"
              initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bot-msg-av bot">AI</div>
              <div className="bot-typing"><span /><span /><span /></div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="bot-quick">
        {QUICK_REPLIES.map(q => (
          <button key={q} className="bot-qbtn" onClick={() => send(q)}>{q}</button>
        ))}
      </div>

      <div className="bot-input-row">
        <input className="bot-inp" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown} placeholder="Ask a question..." disabled={typing} />
        <button className="bot-send" onClick={() => send()} disabled={typing || !input.trim()}>
          &gt;
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact AIDLA | Support, Help & Inquiries</title>
        <meta name="description" content="Get in touch with AIDLA support. Ask questions, report issues, or partner with us. We're here to help you learn and earn!" />
        <meta name="keywords" content="AIDLA contact, support, help, customer service, education platform, Pakistan" />
        <meta property="og:title" content="Contact AIDLA Support" />
        <meta property="og:description" content="Reach out to AIDLA for any questions or support. We're here 24/7 to assist you." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidla.online/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact AIDLA" />
        <meta name="twitter:description" content="Get help from AIDLA support team." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="ct-root">
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
                  { icon: "@", label: "Email", val: "support@aidla.online" },
                  { icon: "W", label: "Platform", val: "AIDLA Learning & Rewards" },
                  { icon: "T", label: "Response Time", val: "Within 24-48 hours" },
                  { icon: "H", label: "Support Hours", val: "Daily, 9 AM - 9 PM" },
                ].map(item => (
                  <div key={item.label} className="ct-info-row">
                    <div className="ct-info-icon">{item.icon}</div>
                    <div>
                      <div className="ct-info-lbl">{item.label}</div>
                      <div className="ct-info-val">{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
            <HelpBot />
          </motion.div>
        </div>

        {/* Replace inline footer with imported Footer */}
        <Footer />
      </div>
    </>
  );
}