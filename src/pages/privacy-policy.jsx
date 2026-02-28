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
    --card-bg: rgba(255,255,255,0.97);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pp-root {
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

  .pp-wrap {
    flex: 1;
    max-width: 860px;
    width: 100%;
    margin: 0 auto;
    padding: clamp(20px, 5vw, 60px) clamp(14px, 4vw, 32px) clamp(40px, 8vw, 80px);
    position: relative;
    z-index: 2;
  }

  .pp-badge {
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

  .pp-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 6vw, 2.5rem);
    font-weight: 900;
    color: #0b1437;
    line-height: 1.15;
    margin-bottom: 6px;
  }

  .pp-title-accent {
    background: linear-gradient(135deg, #1a3a8f, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .pp-meta {
    color: #64748b;
    font-size: 0.85rem;
    margin-bottom: clamp(24px, 5vw, 40px);
  }

  .pp-card {
    background: rgba(255,255,255,0.97);
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(11,20,55,0.07);
    border: 1px solid rgba(59,130,246,0.09);
    overflow: hidden;
  }

  .pp-sec {
    padding: clamp(16px, 4vw, 26px) clamp(18px, 5vw, 38px);
    border-bottom: 1px solid rgba(59,130,246,0.07);
  }
  .pp-sec:last-child { border-bottom: none; }

  .pp-sec-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .pp-num {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, #1a3a8f, #3b82f6);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.68rem;
    font-weight: 900;
    flex-shrink: 0;
  }

  .pp-sec-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    font-weight: 800;
    color: #0b1437;
  }

  .pp-sec p {
    color: #64748b;
    font-size: clamp(0.82rem, 2vw, 0.93rem);
    line-height: 1.75;
  }

  .pp-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .pp-list li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    color: #64748b;
    font-size: clamp(0.82rem, 2vw, 0.93rem);
    line-height: 1.6;
  }
  .pp-list li::before {
    content: '>';
    color: #3b82f6;
    font-weight: 900;
    flex-shrink: 0;
  }

  .pp-email-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(59,130,246,0.08);
    color: #1a3a8f;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 0.82rem;
    font-weight: 700;
    text-decoration: none;
    border: 1px solid rgba(59,130,246,0.15);
  }
  .pp-email-link:hover { background: rgba(59,130,246,0.14); }

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
    .pp-sec { padding: 14px 16px; }
    .site-footer { font-size: 0.72rem; }
  }
`;

const sections = [
  { n: 1, title: "Introduction", body: "Welcome to AIDLA. Your privacy is important to us. This Privacy Policy explains how AIDLA collects, uses, and protects your information when you use our website and services." },
  { n: 2, title: "Information We Collect", list: ["Name and email address during signup", "Account activity and learning progress", "Device information and IP address", "Cookies and usage analytics"] },
  { n: 3, title: "How We Use Your Information", body: "We use collected data to provide learning services, improve user experience, manage accounts, prevent fraud, and develop new features." },
  { n: 4, title: "Cookies", body: "AIDLA uses cookies to enhance user experience and analyze website traffic. You can disable cookies through your browser settings at any time." },
  { n: 5, title: "Data Sharing", body: "We do not sell user data. Information may be shared with trusted service providers such as authentication, hosting, or analytics partners." },
  { n: 6, title: "Data Security", body: "We implement industry-standard security measures including encryption, secure servers, and access control to protect user data." },
  { n: 7, title: "User Rights", body: "Users may request access, correction, or deletion of their personal data by contacting us at any time." },
  { n: 8, title: "Third-Party Links", body: "Our website may contain external links. AIDLA is not responsible for the privacy practices of third-party websites." },
  { n: 9, title: "Changes to Policy", body: "We may update this Privacy Policy periodically. Continued use of the platform constitutes acceptance of any updates." },
  { n: 10, title: "Contact Us", email: true },
];

export default function PrivacyPolicy() {
  return (
    <div className="pp-root">
      <style>{styles}</style>
      <div className="bg-orbs">
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
      </div>

      <div className="pp-wrap">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <span className="pp-badge">Legal</span>
          <h1 className="pp-title">Privacy <span className="pp-title-accent">Policy</span></h1>
          <p className="pp-meta">Last Updated: March 2026</p>
        </motion.div>

        <motion.div className="pp-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
          {sections.map((s, i) => (
            <motion.div key={s.n} className="pp-sec"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <div className="pp-sec-head">
                <div className="pp-num">{s.n}</div>
                <div className="pp-sec-title">{s.title}</div>
              </div>
              {s.body && <p>{s.body}</p>}
              {s.list && (
                <ul className="pp-list">
                  {s.list.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
              {s.email && (
                <a className="pp-email-link" href="mailto:support@aidla.netlify.app">
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