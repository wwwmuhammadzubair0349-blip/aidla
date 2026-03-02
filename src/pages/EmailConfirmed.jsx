import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase"; // adjust path if needed

/* ─────────────────────────────────────────────
   Inline styles — same tokens as Terms / Email
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy:      #0b1437;
    --royal:     #1a3a8f;
    --sky:       #3b82f6;
    --gold:      #f59e0b;
    --gold-light:#fcd34d;
    --slate:     #64748b;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ec-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    position: relative;
  }

  /* decorative orbs */
  .ec-orb-1 {
    position: absolute; pointer-events: none;
    width: 600px; height: 600px; border-radius: 50%;
    background: rgba(59,130,246,0.06); filter: blur(80px);
    top: -200px; left: -200px; z-index: 0;
  }
  .ec-orb-2 {
    position: absolute; pointer-events: none;
    width: 500px; height: 500px; border-radius: 50%;
    background: rgba(245,158,11,0.05); filter: blur(80px);
    top: 300px; right: -250px; z-index: 0;
  }

  /* main content */
  .ec-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(40px, 8vw, 80px) 16px;
    position: relative;
    z-index: 2;
  }

  /* card */
  .ec-card {
    width: 100%;
    max-width: 520px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(11,20,55,0.10);
    border: 1px solid rgba(59,130,246,0.10);
    overflow: hidden;
  }

  /* top gradient bar */
  .ec-bar {
    height: 4px;
    background: linear-gradient(90deg, #1a3a8f, #3b82f6, #f59e0b, #fcd34d);
  }

  .ec-inner {
    padding: clamp(28px, 6vw, 48px) clamp(24px, 6vw, 48px) clamp(28px, 6vw, 40px);
    text-align: center;
  }

  /* success icon circle */
  .ec-icon-wrap {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0b1437, #1a3a8f);
    display: inline-flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 28px rgba(11,20,55,0.22);
    margin-bottom: 22px;
    position: relative;
  }
  .ec-icon-wrap::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid rgba(245,158,11,0.35);
  }
  .ec-check {
    font-size: 34px;
    line-height: 1;
  }

  /* badge */
  .ec-badge {
    display: inline-block;
    background: linear-gradient(135deg, #f59e0b, #fcd34d);
    color: #0b1437;
    padding: 5px 14px;
    border-radius: 30px;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px rgba(245,158,11,0.25);
  }

  /* heading */
  .ec-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 5vw, 2.1rem);
    font-weight: 900;
    color: #0b1437;
    line-height: 1.2;
    margin-bottom: 10px;
  }
  .ec-title-accent {
    background: linear-gradient(135deg, #1a3a8f, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* sub text */
  .ec-sub {
    color: #64748b;
    font-size: clamp(0.85rem, 2.2vw, 0.95rem);
    line-height: 1.7;
    margin-bottom: 28px;
  }
  .ec-name {
    font-weight: 700;
    color: #0b1437;
  }

  /* countdown ring */
  .ec-countdown-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 28px;
  }
  .ec-ring {
    position: relative;
    width: 52px; height: 52px;
  }
  .ec-ring svg {
    transform: rotate(-90deg);
  }
  .ec-ring-track { fill: none; stroke: rgba(59,130,246,0.12); stroke-width: 4; }
  .ec-ring-fill  { fill: none; stroke: url(#countGrad); stroke-width: 4;
                   stroke-linecap: round;
                   transition: stroke-dashoffset 1s linear; }
  .ec-ring-num {
    position: absolute;
    inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; font-weight: 800; color: #1a3a8f;
  }
  .ec-countdown-label {
    font-size: 0.82rem; color: #64748b; line-height: 1.4;
    text-align: left;
  }
  .ec-countdown-label strong { color: #0b1437; }

  /* CTA button */
  .ec-btn {
    display: inline-block;
    background: linear-gradient(135deg, #1a3a8f, #3b82f6);
    color: #fff;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 15px 40px;
    border-radius: 50px;
    box-shadow: 0 6px 20px rgba(26,58,143,0.30);
    cursor: pointer;
    border: none;
    transition: opacity 0.2s, transform 0.2s;
    width: 100%;
  }
  .ec-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  /* divider */
  .ec-divider {
    border: none;
    border-top: 1px solid rgba(59,130,246,0.10);
    margin: 24px 0;
  }

  /* info strip */
  .ec-strip {
    background: linear-gradient(135deg, rgba(11,20,55,0.03), rgba(59,130,246,0.04));
    border-top: 1px solid rgba(59,130,246,0.09);
    padding: 18px clamp(24px, 6vw, 48px);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ec-strip-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f59e0b, #fcd34d);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(245,158,11,0.22);
  }
  .ec-strip p {
    font-size: 0.78rem; color: #64748b; line-height: 1.5;
  }
  .ec-strip strong { color: #0b1437; }

  /* footer */
  .ec-footer {
    background: #0b1437;
    color: rgba(255,255,255,0.6);
    padding: clamp(18px, 4vw, 32px) 24px;
    text-align: center;
    font-size: 0.82rem;
    position: relative;
    z-index: 2;
  }
  .ec-footer strong { color: #fcd34d; }
  .ec-footer a { color: rgba(255,255,255,0.35); text-decoration: none; margin: 0 10px; }
  .ec-footer a:hover { color: #fff; }
  .ec-footer-links { margin-top: 10px; }

  @media (max-width: 480px) {
    .ec-inner { padding: 28px 20px 24px; }
    .ec-strip  { padding: 16px 20px; }
  }
`;

/* circumference for r=22 circle */
const CIRC = 2 * Math.PI * 22; // ≈ 138.2

const REDIRECT_SECS = 5;

export default function EmailConfirmed() {
  const navigate = useNavigate();
  const [email, setEmail]     = useState("");
  const [name, setName]       = useState("");
  const [seconds, setSeconds] = useState(REDIRECT_SECS);

  /* ── 1. Parse Supabase hash / query params & fetch profile name ── */
  useEffect(() => {
    async function init() {
      // Supabase puts tokens in the URL hash after email confirmation
      // supabase.auth.getSession() resolves them automatically
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email ?? "";
      setEmail(userEmail);

      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from("users_profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();
        if (profile?.full_name) setName(profile.full_name);
      }
    }
    init();
  }, []);

  /* ── 2. Countdown → redirect to /login with email prefilled ── */
  useEffect(() => {
    if (seconds <= 0) {
      navigate("/login", { state: { email } });
      return;
    }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, email, navigate]);

  /* ring progress */
  const dashOffset = CIRC - (CIRC * seconds) / REDIRECT_SECS;

  const firstName = name ? name.split(" ")[0] : null;

  return (
    <div className="ec-root">
      <style>{styles}</style>
      <div className="ec-orb-1" />
      <div className="ec-orb-2" />

      {/* ── Main ── */}
      <main className="ec-main">
        <motion.div
          className="ec-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* top bar */}
          <div className="ec-bar" />

          <div className="ec-inner">
            {/* success icon */}
            <motion.div
              className="ec-icon-wrap"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <span className="ec-check">✅</span>
            </motion.div>

            {/* badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="ec-badge">Email Verified</span>
            </motion.div>

            {/* heading */}
            <motion.h1
              className="ec-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              You're{" "}
              <span className="ec-title-accent">All Set!</span>
            </motion.h1>

            {/* sub */}
            <motion.p
              className="ec-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {firstName
                ? <>Welcome aboard, <span className="ec-name">{firstName}</span>! Your email has been confirmed.</>
                : "Your email has been confirmed."}{" "}
              You can now sign in and start learning, winning, and earning on AIDLA.
            </motion.p>

            {/* countdown ring */}
            <motion.div
              className="ec-countdown-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="ec-ring">
                <svg width="52" height="52" viewBox="0 0 52 52">
                  <defs>
                    <linearGradient id="countGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#1a3a8f" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <circle className="ec-ring-track" cx="26" cy="26" r="22" />
                  <circle
                    className="ec-ring-fill"
                    cx="26" cy="26" r="22"
                    strokeDasharray={CIRC}
                    strokeDashoffset={dashOffset}
                  />
                </svg>
                <div className="ec-ring-num">{seconds}</div>
              </div>
              <div className="ec-countdown-label">
                <strong>Redirecting to login</strong><br />
                in {seconds} second{seconds !== 1 ? "s" : ""}…
              </div>
            </motion.div>

            {/* manual CTA */}
            <motion.button
              className="ec-btn"
              onClick={() => navigate("/login", { state: { email } })}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              Go to Login →
            </motion.button>
          </div>

          {/* info strip */}
          <div className="ec-strip">
            <div className="ec-strip-icon">🔒</div>
            <p>
              Your email <strong>{email || "address"}</strong> will be pre-filled on the login
              page so you can sign in instantly.
            </p>
          </div>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="ec-footer">
        <div style={{ marginBottom: 8, fontSize: "1.2rem" }}>🕌</div>
        <p>© 2025 <strong>AIDLA</strong>. All rights reserved. Designed with ❤️ for learners everywhere.</p>
        <div className="ec-footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}