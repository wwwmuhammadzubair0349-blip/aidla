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

  .tools-root {
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

  .tools-wrap {
    flex: 1;
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
    padding: clamp(20px, 5vw, 60px) clamp(14px, 4vw, 32px) clamp(40px, 8vw, 80px);
    position: relative;
    z-index: 2;
  }

  .tools-badge {
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

  .tools-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 6vw, 2.5rem);
    font-weight: 900;
    color: #0b1437;
    line-height: 1.15;
    margin-bottom: 6px;
  }

  .tools-title-accent {
    background: linear-gradient(135deg, #1a3a8f, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tools-sub {
    color: #64748b;
    font-size: 0.95rem;
    margin-bottom: 24px;
    max-width: 600px;
    line-height: 1.5;
  }

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
    margin-top: 24px;
  }

  .tools-card {
    display: block;
    padding: 24px 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(59,130,246,0.12);
    box-shadow: 0 8px 20px rgba(11,20,55,0.06);
    font-weight: 700;
    color: #0f172a;
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tools-card:hover {
    transform: translateY(-4px);
    border-color: rgba(245,158,11,0.3);
    box-shadow: 0 14px 28px rgba(11,20,55,0.12);
    background: white;
  }

  .tools-card span {
    font-size: 1.8rem;
    line-height: 1;
  }

  .tools-cta {
    margin-top: 40px;
    background: linear-gradient(135deg, #0b1437, #1a3a8f);
    border-radius: 32px;
    padding: clamp(24px, 5vw, 40px);
    color: white;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    box-shadow: 0 16px 32px rgba(11,20,55,0.2);
    border: 1px solid rgba(255,215,0,0.2);
  }

  .tools-cta h3 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.2rem, 4vw, 1.8rem);
    font-weight: 700;
    margin-bottom: 6px;
  }

  .tools-cta p {
    opacity: 0.9;
    font-size: 0.95rem;
  }

  .tools-cta-btn {
    background: linear-gradient(135deg, #f59e0b, #fcd34d);
    color: #0b1437;
    padding: 12px 28px;
    border-radius: 40px;
    font-weight: 800;
    font-size: 1rem;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 6px 14px rgba(245,158,11,0.4);
    transition: all 0.2s;
    border: none;
    cursor: pointer;
    white-space: nowrap;
  }

  .tools-cta-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 18px rgba(245,158,11,0.6);
  }

  .site-footer {
    background: #0b1437;
    color: rgba(255,255,255,0.6);
    padding: clamp(18px,4vw,36px) 24px;
    text-align: center;
    font-size: 0.85rem;
    margin-top: 0;
    position: relative;
    z-index: 2;
  }
  .site-footer strong { color: #fcd34d; }
  .site-footer a { color: rgba(255,255,255,0.4); text-decoration: none; margin: 0 10px; }
  .site-footer a:hover { color: #fff; }

  @media (max-width: 480px) {
    .tools-card { padding: 18px 16px; font-size: 1rem; }
    .tools-cta { flex-direction: column; text-align: center; }
    .tools-cta-btn { width: 100%; justify-content: center; }
    .site-footer { font-size: 0.72rem; }
  }
`;

const tools = [
  { href: "/tools/pdf/word-to-pdf", emoji: "📄", label: "Word → PDF" },
  { href: "/tools/pdf/image-to-pdf", emoji: "🖼️", label: "Image → PDF" },
  { href: "/tools/image/jpg-to-png", emoji: "🧩", label: "JPG → PNG" },
  { href: "/tools/career/cv-maker", emoji: "🧑‍💼", label: "CV Maker" },
  { href: "/tools/career/cover-letter-maker", emoji: "✉️", label: "Cover Letter Maker" },
];

export default function ToolsHome() {
  return (
    <div className="tools-root">
      <style>{styles}</style>
      <div className="bg-orbs">
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
      </div>

      <div className="tools-wrap">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <span className="tools-badge">⚡ Free utilities</span>
          <h1 className="tools-title">
            Productivity <span className="tools-title-accent">Tools</span>
          </h1>
          <p className="tools-sub">
            Free online tools for PDF, Images, and Career documents. No sign‑up required.
          </p>
        </motion.div>

        <motion.div
          className="tools-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {tools.map((tool, i) => (
            <motion.a
              key={tool.href}
              href={tool.href}
              className="tools-card"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span>{tool.emoji}</span> {tool.label}
            </motion.a>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="tools-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h3>Earn while you learn 🚀</h3>
            <p>Join AIDLA today and start earning rewards as you build your skills.</p>
          </div>
          <Link to="/signup" className="tools-cta-btn">
            Join now ✨
          </Link>
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