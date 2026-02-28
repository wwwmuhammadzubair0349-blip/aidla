import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ─────────────────────── Global Styles ─────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&family=Noto+Nastaliq+Urdu&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0b1437;
    --royal: #1a3a8f;
    --sky: #3b82f6;
    --gold: #f59e0b;
    --gold-light: #fcd34d;
    --slate: #64748b;
    --light: #f0f4ff;
    --card-bg: rgba(255,255,255,0.97);
    font-family: 'DM Sans', sans-serif;
  }

  .about-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    overflow-x: hidden;
  }

  /* ── Clean Hero Section ── */
  .about-hero-clean {
    text-align: center;
    padding: clamp(60px, 8vw, 100px) 20px clamp(30px, 5vw, 50px);
    max-width: 860px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }
  .about-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(59,130,246,0.1);
    color: var(--royal);
    padding: 8px 22px;
    border-radius: 30px;
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 24px;
    border: 1px solid rgba(59,130,246,0.2);
    box-shadow: 0 4px 12px rgba(59,130,246,0.06);
  }
  .about-hero-clean h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 5vw, 4.2rem);
    font-weight: 900;
    color: var(--navy);
    line-height: 1.1;
    margin-bottom: 24px;
  }
  .about-hero-clean h1 span {
    background: linear-gradient(135deg, var(--royal), var(--sky));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .about-hero-clean p {
    color: var(--slate);
    font-size: clamp(1rem, 2vw, 1.15rem);
    line-height: 1.7;
    margin: 0 auto;
    max-width: 680px;
  }

  /* ── Hero Banner Image & Floating Stats ── */
  .about-hero-banner-wrapper {
    position: relative;
    max-width: 1140px;
    margin: 0 auto clamp(60px, 10vw, 100px);
    padding: 0 20px;
    z-index: 2;
  }
  .about-hero-banner-img {
    width: 100%;
    height: clamp(280px, 40vw, 480px);
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(11,20,55,0.12);
    position: relative;
  }
  .about-hero-banner-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
  }
  .about-hero-banner-img::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 60%, rgba(11,20,55,0.15) 100%);
  }

  /* Floating Stats Card */
  .about-stats-floating {
    background: var(--card-bg);
    backdrop-filter: blur(16px);
    border-radius: 24px;
    padding: 36px 24px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
    box-shadow: 0 16px 50px rgba(11,20,55,0.08);
    border: 1px solid rgba(255,255,255,0.8);
    max-width: 960px;
    margin: -50px auto 0;
    position: relative;
    z-index: 10;
  }
  .stat-card {
    text-align: center;
    flex: 1;
    min-width: 140px;
    position: relative;
  }
  .stat-card:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0; top: 20%; bottom: 20%;
    width: 1px;
    background: rgba(11,20,55,0.08);
  }
  .stat-card-num {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    font-weight: 900;
    background: linear-gradient(135deg, var(--navy), var(--royal));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
  }
  .stat-card-label {
    color: var(--slate);
    font-size: clamp(0.75rem, 1.5vw, 0.85rem);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 6px;
  }

  /* ── Background Orbs ── */
  .bg-orbs {
    position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
  }
  .bg-orb-1 {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: rgba(59,130,246,0.05); filter: blur(80px); top: -200px; left: -200px;
  }
  .bg-orb-2 {
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: rgba(245,158,11,0.05); filter: blur(80px); top: 300px; right: -250px;
  }

  /* ── Page wrapper ── */
  .about-body { max-width: 1140px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 32px); position: relative; z-index: 2; }

  /* ── Section headings ── */
  .sec-label {
    display: inline-block;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: var(--navy);
    padding: 5px 16px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 12px;
    box-shadow: 0 4px 12px rgba(245,158,11,0.25);
  }
  .sec-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 3.5vw, 2.6rem);
    font-weight: 900;
    color: var(--navy);
    line-height: 1.15;
    margin-bottom: 16px;
  }
  .sec-title span {
    background: linear-gradient(135deg, var(--royal), var(--sky));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .sec-desc { color: var(--slate); font-size: clamp(0.9rem, 1.5vw, 1.05rem); line-height: 1.75; max-width: 560px; }

  /* ── Mission section ── */
  .mission-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: center;
    margin-bottom: clamp(60px, 8vw, 100px);
  }
  .mission-img-wrap {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    aspect-ratio: 4/4.5;
    box-shadow: 0 20px 50px rgba(11,20,55,0.15);
  }
  .mission-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .mission-img-badge {
    position: absolute;
    bottom: 24px; left: 24px; right: 24px;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 16px 20px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .mission-img-badge span { font-size: 1.8rem; }
  .mission-img-badge strong { font-size: 0.95rem; color: var(--navy); display: block; line-height: 1.2; }
  .mission-img-badge small { font-size: 0.75rem; color: var(--slate); }
  .mission-pillars { display: flex; flex-direction: column; gap: 16px; margin-top: 32px; }
  .pillar {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: var(--card-bg);
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 6px 24px rgba(11,20,55,0.05);
    border: 1px solid rgba(59,130,246,0.06);
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .pillar:hover { transform: translateX(5px); box-shadow: 0 10px 30px rgba(11,20,55,0.08); }
  .pillar-icon {
    width: 46px; height: 46px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem;
    flex-shrink: 0;
  }
  .pillar h4 { font-weight: 700; color: var(--navy); font-size: 1rem; margin-bottom: 4px; }
  .pillar p { color: var(--slate); font-size: 0.85rem; line-height: 1.5; }

  /* ── How coins work ── */
  .coins-section {
    background: linear-gradient(135deg, var(--navy), var(--royal));
    border-radius: 32px;
    padding: clamp(40px, 6vw, 64px) clamp(24px, 5vw, 56px);
    margin-bottom: clamp(60px, 8vw, 100px);
    position: relative;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(11,20,55,0.18);
  }
  .coins-section::before {
    content: ''; position: absolute; width: 400px; height: 400px;
    border-radius: 50%; background: rgba(245,158,11,0.1); top: -200px; right: -100px;
  }
  .coins-section .sec-title { color: #fff; margin-bottom: 12px; }
  .coins-section .sec-title span { background: linear-gradient(135deg, var(--gold), var(--gold-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .coins-section .sec-desc { color: rgba(255,255,255,0.75); }
  .coins-flow {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 40px;
    position: relative; z-index: 1;
  }
  .coin-step {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 28px 20px;
    text-align: center;
    position: relative;
    transition: background 0.25s, transform 0.25s;
  }
  .coin-step:hover { background: rgba(255,255,255,0.12); transform: translateY(-4px); }
  .coin-step-num {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: var(--navy);
    font-weight: 900;
    font-size: 0.95rem;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    font-family: 'Playfair Display', serif;
  }
  .coin-step-icon { font-size: 2rem; margin-bottom: 12px; display: block; }
  .coin-step h4 { color: #fff; font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; }
  .coin-step p { color: rgba(255,255,255,0.65); font-size: 0.8rem; line-height: 1.6; }

  /* ── Values grid ── */
  .values-section { margin-bottom: clamp(60px, 8vw, 100px); }
  .values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 40px;
  }
  .value-card {
    background: var(--card-bg);
    border-radius: 20px;
    padding: 32px 24px;
    box-shadow: 0 8px 30px rgba(11,20,55,0.06);
    border: 1px solid rgba(59,130,246,0.08);
    transition: transform 0.25s, box-shadow 0.25s;
    position: relative;
    overflow: hidden;
  }
  .value-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, var(--royal), var(--sky)); border-radius: 20px 20px 0 0;
  }
  .value-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(11,20,55,0.12); }
  .value-icon { font-size: 2.2rem; margin-bottom: 16px; display: block; }
  .value-card h3 { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: var(--navy); font-weight: 800; margin-bottom: 10px; }
  .value-card p { color: var(--slate); font-size: 0.9rem; line-height: 1.65; }

  /* ── FAQ ── */
  .faq-section { margin-bottom: clamp(60px, 8vw, 100px); }
  .faq-list { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; }
  .faq-item {
    background: var(--card-bg);
    border-radius: 16px;
    border: 1px solid rgba(59,130,246,0.08);
    box-shadow: 0 4px 20px rgba(11,20,55,0.05);
    overflow: hidden;
  }
  .faq-item details { width: 100%; }
  .faq-item summary {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; cursor: pointer; font-weight: 700; color: var(--navy);
    font-size: clamp(0.9rem, 1.5vw, 1rem); gap: 12px; list-style: none; transition: background 0.2s;
  }
  .faq-item summary::-webkit-details-marker { display: none; }
  .faq-item summary:hover { background: #f8faff; }
  .faq-chevron {
    width: 28px; height: 28px; border-radius: 50%; background: var(--light);
    display: flex; align-items: center; justify-content: center; font-size: 0.75rem;
    flex-shrink: 0; transition: transform 0.3s, background 0.2s; color: var(--royal); font-weight: 800;
  }
  .faq-item details[open] summary .faq-chevron { transform: rotate(180deg); background: var(--royal); color: #fff; }
  .faq-item details[open] summary { background: #f8faff; }
  .faq-answer {
    padding: 0 24px 24px; color: var(--slate); font-size: clamp(0.85rem, 1.4vw, 0.95rem);
    line-height: 1.8; border-top: 1px solid #f1f5f9; padding-top: 16px;
  }

  /* ── CTA ── */
  .about-cta {
    background: linear-gradient(135deg, var(--navy), var(--royal), #1e5abf);
    border-radius: 32px;
    padding: clamp(48px, 6vw, 72px) clamp(24px, 4vw, 48px);
    text-align: center;
    position: relative;
    overflow: hidden;
    margin-bottom: 80px;
    box-shadow: 0 24px 60px rgba(11,20,55,0.22);
  }
  .about-cta::before { content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; background: rgba(245,158,11,0.12); top: -200px; right: -100px; }
  .about-cta h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 3.5vw, 2.8rem); color: #fff; font-weight: 900; margin-bottom: 16px; position: relative; z-index: 1; }
  .about-cta p { color: rgba(255,255,255,0.75); font-size: clamp(0.9rem, 1.5vw, 1.05rem); max-width: 500px; margin: 0 auto 32px; line-height: 1.7; position: relative; z-index: 1; }
  .about-cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
  .btn-gold { display: inline-block; padding: clamp(12px, 2vw, 16px) clamp(28px, 3vw, 44px); border-radius: 50px; background: linear-gradient(135deg, var(--gold), var(--gold-light)); color: var(--navy); font-weight: 800; font-size: clamp(0.9rem, 1.5vw, 1.05rem); text-decoration: none; box-shadow: 0 10px 28px rgba(245,158,11,0.35); transition: transform 0.2s; white-space: nowrap; }
  .btn-gold:hover { transform: translateY(-2px); }
  .btn-outline-white { display: inline-block; padding: clamp(12px, 2vw, 16px) clamp(24px, 3vw, 40px); border-radius: 50px; border: 1.5px solid rgba(255,255,255,0.4); color: #fff; font-weight: 700; font-size: clamp(0.9rem, 1.5vw, 1.05rem); text-decoration: none; background: transparent; transition: background 0.2s, transform 0.2s; white-space: nowrap; }
  .btn-outline-white:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }

  /* ── Footer ── */
  .site-footer {
    background: var(--navy);
    color: rgba(255,255,255,0.6);
    padding: 36px 24px;
    text-align: center;
    font-size: 0.85rem;
    margin-top: 60px;
  }
  .site-footer strong { color: var(--gold-light); }

  /* ── Mobile Responsive ── */
  @media (max-width: 768px) {
    .about-stats-floating { flex-direction: column; padding: 24px 20px; gap: 20px; margin: -30px 16px 0; max-width: none; border-radius: 20px; }
    .stat-card:not(:last-child)::after { right: 10%; left: 10%; top: auto; bottom: -10px; height: 1px; width: auto; background: rgba(11,20,55,0.06); }
    .mission-grid { grid-template-columns: 1fr; gap: 32px; }
    .coins-flow { grid-template-columns: 1fr 1fr; gap: 16px; }
    .values-grid { grid-template-columns: 1fr; gap: 16px; }
    .mission-img-badge { left: 16px; right: 16px; bottom: 16px; padding: 12px 16px; }
    .value-card { padding: 24px 20px; }
  }
  @media (max-width: 480px) {
    .coins-flow { grid-template-columns: 1fr; }
    .about-hero-clean { padding-top: 50px; }
    .about-eyebrow { font-size: 0.75rem; padding: 6px 16px; margin-bottom: 20px; }
  }
`;

/* ─────────────────────── FAQ Component ─────────────────────── */
const FAQS =[
  {
    q: "What is AIDLA and how does it work?",
    a: "AIDLA is an educational rewards platform. You create a free account, complete quizzes and learning challenges, and earn AIDLA Coins for every achievement. Those coins can be redeemed in our shop or converted to cash — real value for real learning.",
  },
  {
    q: "How do I earn AIDLA Coins?",
    a: "You earn coins by completing quizzes, participating in lucky draws, spinning the daily lucky wheel, climbing leaderboards, and achieving top ranks in tests. The more you learn, the more you earn.",
  },
  {
    q: "How do I redeem my coins?",
    a: "Head to the Rewards Shop inside your dashboard. Choose from gift cards, gadgets, vouchers, or exclusive merchandise. You can also convert your coins directly to cash and withdraw to your bank account.",
  },
  {
    q: "Is AIDLA free to join?",
    a: "Yes — completely free. No subscription, no hidden fees. Sign up, start learning, and start earning. Premium features may be introduced in the future, but the core earning experience remains free.",
  },
  {
    q: "Are the lucky draws and wheel spins fair?",
    a: "Absolutely. Our draw and wheel systems use verified random selection. Every participant has an equal chance based on their entries. Results are logged transparently so users can verify outcomes.",
  },
  {
    q: "What subjects and topics are covered?",
    a: "AIDLA covers a wide range of subjects including science, mathematics, languages, general knowledge, Islamic studies, history, and more. Our content library is constantly growing based on community feedback.",
  },
  {
    q: "Can I use AIDLA on my phone?",
    a: "Yes — AIDLA is designed mobile-first. The entire experience — quizzes, wheel spins, draws, shop — works seamlessly on any smartphone browser without needing to install an app.",
  },
];

function FAQItem({ q, a }) {
  return (
    <div className="faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
      <details>
        <summary>
          <span itemProp="name">{q}</span>
          <span className="faq-chevron">▼</span>
        </summary>
        <div className="faq-answer" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
          <span itemProp="text">{a}</span>
        </div>
      </details>
    </div>
  );
}

/* ─────────────────────── Main Component ─────────────────────── */
export default function About() {
  const fadeUp = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.6 } };
  const stagger = (i) => ({ ...fadeUp, transition: { duration: 0.5, delay: i * 0.08 } });

  return (
    <div className="about-root">
      <style>{styles}</style>

      {/* Subtle Background Orbs matching Home Page */}
      <div className="bg-orbs">
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
      </div>

      {/* ═══════════ CLEAN HERO BANNER ═══════════ */}
      <motion.section 
        className="about-hero-clean"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.span 
          className="about-eyebrow"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          ✨ Discover AIDLA
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          Education That<br />
          <span>Rewards You</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          AIDLA was built on a simple belief — learning should be rewarding, engaging, and accessible to everyone. We combine quality education with a real coin-based rewards system so your effort always pays off.
        </motion.p>
      </motion.section>

      {/* ═══════════ HERO WIDE IMAGE & STATS ═══════════ */}
      <motion.div 
        className="about-hero-banner-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        <div className="about-hero-banner-img">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80"
            alt="Students learning and collaborating together"
          />
        </div>

        {/* Floating Glassmorphism Stats */}
        <div className="about-stats-floating">
          {[
            { n: "50K+", l: "Learners Joined" },
            { n: "120K+", l: "Coins Earned" },
            { n: "1,200+", l: "Monthly Winners" },
            { n: "500+", l: "Daily Active" },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-card-num">{s.n}</div>
              <div className="stat-card-label">{s.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="about-body">
        {/* ═══════════ MISSION ═══════════ */}
        <motion.div className="mission-grid" {...fadeUp}>
          <div className="mission-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80"
              alt="Student focused on studying"
            />
            <div className="mission-img-badge">
              <span>🎯</span>
              <div>
                <strong>Our Purpose</strong>
                <small>Making learning intrinsically rewarding</small>
              </div>
            </div>
          </div>

          <div>
            <span className="sec-label">Our Mission</span>
            <h2 className="sec-title">Why We Built <span>AIDLA</span></h2>
            <p className="sec-desc">
              Millions of students study hard every day but feel unseen and unrewarded. AIDLA changes that. Every quiz completed, every test topped, every spin of the wheel — it all translates into real coins, real rewards, and real motivation to keep going.
            </p>
            <div className="mission-pillars">
              {[
                { icon: "📚", color: "#dbeafe", title: "Quality Learning", desc: "Carefully crafted quizzes and tests built around real curriculum and life skills." },
                { icon: "🪙", color: "#fef3c7", title: "Real Rewards", desc: "AIDLA Coins are redeemable for real products, gift cards, or cash withdrawals." },
                { icon: "🌍", color: "#d1fae5", title: "Open to Everyone", desc: "No barriers, no paywalls. Education and rewards for every learner, everywhere." },
              ].map((p, i) => (
                <motion.div key={i} className="pillar" {...stagger(i)}>
                  <div className="pillar-icon" style={{ background: p.color }}>{p.icon}</div>
                  <div>
                    <h4>{p.title}</h4>
                    <p>{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══════════ HOW COINS WORK ═══════════ */}
        <motion.div className="coins-section" {...fadeUp}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="sec-label">The Coin System</span>
            <h2 className="sec-title" style={{ color: "#fff" }}>How <span>AIDLA Coins</span> Work</h2>
            <p className="sec-desc">From learning to earning — a transparent, simple, powerful cycle.</p>
            <div className="coins-flow">
              {[
                { icon: "📝", num: "01", title: "Learn", desc: "Complete quizzes, tests, and educational challenges at your own pace." },
                { icon: "🪙", num: "02", title: "Earn Coins", desc: "Every completed quiz, top rank, and lucky spin rewards you with AIDLA Coins." },
                { icon: "🛍️", num: "03", title: "Redeem", desc: "Use coins in the Rewards Shop for gadgets, gift cards, and merchandise." },
                { icon: "💵", num: "04", title: "Cash Out", desc: "Convert coins to real money and withdraw directly to your bank account." },
              ].map((s, i) => (
                <motion.div key={i} className="coin-step" {...stagger(i)}>
                  <div className="coin-step-num">{s.num}</div>
                  <span className="coin-step-icon">{s.icon}</span>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ═══════════ VALUES ═══════════ */}
        <motion.div className="values-section" {...fadeUp}>
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <span className="sec-label">What We Stand For</span>
          </div>
          <h2 className="sec-title" style={{ textAlign: "center" }}>Our Core <span>Values</span></h2>
          <p className="sec-desc" style={{ textAlign: "center", margin: "0 auto" }}>
            Everything we build, every feature we add — guided by these principles.
          </p>
          <div className="values-grid">
            {[
              { icon: "🔍", title: "Transparency", desc: "Every draw, every result, every coin transaction is openly logged. No smoke, no mirrors — just honest, verifiable outcomes." },
              { icon: "🤝", title: "Inclusivity", desc: "We build for every learner — regardless of background, language, or location. Knowledge belongs to everyone." },
              { icon: "⚡", title: "Motivation", desc: "Learning is hard. We make it rewarding. Tangible prizes and real coins keep students engaged and coming back." },
              { icon: "🎓", title: "Academic Quality", desc: "Our quiz content is reviewed by educators. We don't compromise on quality — fun and rigorous can coexist." },
              { icon: "🔒", title: "Trust & Safety", desc: "Your data, your coins, your privacy — protected. We operate with the highest standards of security and fair play." },
              { icon: "🚀", title: "Constant Growth", desc: "We listen to our community and ship improvements weekly. AIDLA today is better than yesterday." },
            ].map((v, i) => (
              <motion.div key={i} className="value-card" {...stagger(i)}>
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══════════ FAQ ═══════════ */}
        <motion.section
          className="faq-section"
          {...fadeUp}
          aria-label="Frequently Asked Questions"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": FAQS.map(f => ({
                  "@type": "Question",
                  "name": f.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.a,
                  },
                })),
              }),
            }}
          />
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <span className="sec-label">Got Questions?</span>
          </div>
          <h2 className="sec-title" style={{ textAlign: "center" }}>Frequently Asked <span>Questions</span></h2>
          <p className="sec-desc" style={{ textAlign: "center", margin: "0 auto" }}>Everything you need to know about AIDLA.</p>
          <div className="faq-list" style={{ maxWidth: 800, margin: "32px auto 0" }}>
            {FAQS.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </motion.section>

        {/* ═══════════ CTA ═══════════ */}
        <motion.div className="about-cta" {...fadeUp}>
          <h2>Ready to Start<br />Your Journey?</h2>
          <p>Join thousands of learners who are already earning real rewards for their hard work. It's free, it's fun, and it's worth it.</p>
          <div className="about-cta-btns">
            <Link to="/signup" className="btn-gold">✨ Create Free Account</Link>
            <Link to="/" className="btn-outline-white">← Back to Home</Link>
          </div>
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