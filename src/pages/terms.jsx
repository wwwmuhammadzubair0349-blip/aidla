import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy: #0b1437;
    --royal: #1a3a8f;
    --sky: #3b82f6;
    --gold: #f59e0b;
    --gold-light: #fcd34d;
    --slate: #64748b;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .tc-root {
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

  .tc-wrap {
    flex: 1;
    max-width: 860px;
    width: 100%;
    margin: 0 auto;
    padding: clamp(20px, 5vw, 60px) clamp(14px, 4vw, 32px) clamp(40px, 8vw, 80px);
    position: relative;
    z-index: 2;
  }

  .tc-badge {
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

  .tc-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 6vw, 2.5rem);
    font-weight: 900;
    color: #0b1437;
    line-height: 1.15;
    margin-bottom: 6px;
  }

  .tc-title-accent {
    background: linear-gradient(135deg, #1a3a8f, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tc-meta {
    color: #64748b;
    font-size: 0.85rem;
    margin-bottom: clamp(24px, 5vw, 40px);
  }

  .tc-card {
    background: rgba(255,255,255,0.97);
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(11,20,55,0.07);
    border: 1px solid rgba(59,130,246,0.09);
    overflow: hidden;
  }

  .tc-sec {
    padding: clamp(16px, 4vw, 26px) clamp(18px, 5vw, 38px);
    border-bottom: 1px solid rgba(59,130,246,0.07);
  }
  .tc-sec:last-child { border-bottom: none; }

  .tc-sec-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .tc-num {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f59e0b, #fcd34d);
    color: #0b1437;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.68rem;
    font-weight: 900;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(245,158,11,0.22);
  }

  .tc-sec-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    font-weight: 800;
    color: #0b1437;
  }

  .tc-sec p {
    color: #64748b;
    font-size: clamp(0.82rem, 2vw, 0.93rem);
    line-height: 1.75;
  }

  .tc-highlight {
    background: rgba(245,158,11,0.06);
    border-left: 3px solid #f59e0b;
    border-radius: 0 10px 10px 0;
    padding: 10px 14px;
    color: #64748b;
    font-size: clamp(0.82rem, 2vw, 0.93rem);
    line-height: 1.7;
  }

  .tc-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .tc-list li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    color: #64748b;
    font-size: clamp(0.82rem, 2vw, 0.93rem);
    line-height: 1.6;
  }
  .tc-list li::before {
    content: '>';
    color: #f59e0b;
    font-weight: 900;
    flex-shrink: 0;
  }

  .tc-email-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(245,158,11,0.09);
    color: #92400e;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 0.82rem;
    font-weight: 700;
    text-decoration: none;
    border: 1px solid rgba(245,158,11,0.2);
  }
  .tc-email-link:hover { background: rgba(245,158,11,0.15); }

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
    .tc-sec { padding: 14px 16px; }
    .site-footer { font-size: 0.72rem; }
  }
`;

const sections = [
  { n: 1, title: "Acceptance", body: "By accessing AIDLA, you agree to comply with these Terms and Conditions. If you do not agree, please do not use our platform." },
  { n: 2, title: "Platform Description", body: "AIDLA is an educational platform allowing users to learn, participate in activities, and earn digital rewards." },
  { n: 3, title: "User Accounts", list: ["You must provide accurate and truthful information.", "You are solely responsible for your account security.", "Multiple fraudulent accounts are strictly prohibited."] },
  { n: 4, title: "Rewards & Coins", highlight: "Rewards earned through AIDLA activities have no guaranteed monetary value and may change at any time without prior notice." },
  { n: 5, title: "Prohibited Use", list: ["No cheating or automated abuse of any kind", "No illegal or fraudulent activity", "No harmful, offensive, or disruptive content"] },
  { n: 6, title: "Intellectual Property", body: "All platform content, logos, branding, and materials are the exclusive property of AIDLA and may not be reproduced without permission." },
  { n: 7, title: "Limitation of Liability", body: "AIDLA provides services on an as-is basis without warranties of any kind, express or implied." },
  { n: 8, title: "Termination", body: "Accounts that violate these terms may be suspended or permanently terminated at AIDLA's sole discretion." },
  { n: 9, title: "Changes to Terms", body: "These Terms may change at any time. Continued use of the platform after changes constitutes your acceptance." },
  { n: 10, title: "Contact Us", email: true },
];

export default function Terms() {
  return (
    <div className="tc-root">
      <style>{styles}</style>
      <div className="bg-orbs">
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
      </div>

      <div className="tc-wrap">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <span className="tc-badge">Legal</span>
          <h1 className="tc-title">Terms <span className="tc-title-accent">&amp; Conditions</span></h1>
          <p className="tc-meta">Last Updated: February 2026</p>
        </motion.div>

        <motion.div className="tc-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
          {sections.map((s, i) => (
            <motion.div key={s.n} className="tc-sec"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <div className="tc-sec-head">
                <div className="tc-num">{s.n}</div>
                <div className="tc-sec-title">{s.title}</div>
              </div>
              {s.body && <p>{s.body}</p>}
              {s.highlight && <div className="tc-highlight">{s.highlight}</div>}
              {s.list && (
                <ul className="tc-list">
                  {s.list.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
              {s.email && (
                <a className="tc-email-link" href="mailto:support@aidla.netlify.app">
                  support@aidla.netlify.app
                </a>
              )}
            </motion.div>
          ))}
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