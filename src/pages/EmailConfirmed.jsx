import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo.jpg";
import Footer from "../pages/components/footer";
import "./email-confirmed.css";

const CIRC = 2 * Math.PI * 22; // ≈ 138.2
const REDIRECT_SECS = 5;

export default function EmailConfirmed() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [seconds, setSeconds] = useState(REDIRECT_SECS);
  const [status, setStatus] = useState("loading"); // 'loading', 'confirmed', 'error', 'no_access'
  const [errorMsg, setErrorMsg] = useState("");

  // --- Access control & data fetching ---
  useEffect(() => {
    let isMounted = true;

    async function checkAccess() {
      // 1. Check URL hash for tokens (present in confirmation link)
      const hash = window.location.hash;

      // 2. Try to get session (Supabase automatically processes the token)
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (session?.user) {
        // User is logged in → confirmation successful
        const userEmail = session.user.email ?? "";
        setEmail(userEmail);

        // Fetch profile name if available
        if (session.user.id) {
          const { data: profile } = await supabase
            .from("users_profiles")
            .select("full_name")
            .eq("id", session.user.id)
            .single();
          if (profile?.full_name) setName(profile.full_name);
        }

        setStatus("confirmed");
      } else {
        // No session – check if there was a token in the URL
        if (hash && hash.includes("access_token")) {
          // Token present but session missing → likely expired or invalid
          setErrorMsg("The confirmation link is invalid or has expired.");
          setStatus("error");
        } else {
          // No token, no session → direct access
          setStatus("no_access");
          // Redirect after a short delay
          setTimeout(() => navigate("/"), 2000);
        }
      }
    }

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // --- Countdown for redirect after confirmation ---
  useEffect(() => {
    if (status !== "confirmed") return;
    if (seconds <= 0) {
      navigate("/login", { state: { email } });
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, email, navigate, status]);

  const dashOffset = CIRC - (CIRC * seconds) / REDIRECT_SECS;
  const firstName = name ? name.split(" ")[0] : null;

  // --- Render different states ---
  if (status === "loading") {
    return (
      <div className="ec-root">
        <Helmet>
          <title>Verifying… | AIDLA</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="ec-orb-1" />
        <div className="ec-orb-2" />
        <main className="ec-main">
          <div className="ec-card">
            <div className="ec-bar" />
            <div className="ec-inner" style={{ paddingBottom: 40 }}>
              <div className="skel-bg" style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 22px" }} />
              <div className="skel-bg" style={{ width: 120, height: 20, margin: "0 auto 14px" }} />
              <div className="skel-bg" style={{ width: 200, height: 28, margin: "0 auto 20px" }} />
              <div className="skel-bg" style={{ width: 280, height: 48, margin: "0 auto" }} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === "no_access") {
    return (
      <div className="ec-root">
        <Helmet>
          <title>Access Denied | AIDLA</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="ec-orb-1" />
        <div className="ec-orb-2" />
        <main className="ec-main">
          <div className="ec-card">
            <div className="ec-bar" />
            <div className="ec-inner">
              <span className="ec-badge" style={{ background: "#ef4444", color: "#fff" }}>⛔ Access Denied</span>
              <h1 className="ec-title">Not Allowed</h1>
              <p className="ec-sub">
                This page is only accessible through a valid email confirmation link.
                You will be redirected to the homepage shortly.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="ec-root">
        <Helmet>
          <title>Link Expired | AIDLA</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="ec-orb-1" />
        <div className="ec-orb-2" />
        <main className="ec-main">
          <div className="ec-card">
            <div className="ec-bar" />
            <div className="ec-inner">
              <span className="ec-badge" style={{ background: "#ef4444", color: "#fff" }}>❌ Error</span>
              <h1 className="ec-title">Invalid Link</h1>
              <p className="ec-sub">{errorMsg}</p>
              <button className="ec-btn" onClick={() => navigate("/")}>
                Go to Home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- status === "confirmed" (success) ---
  return (
    <>
      <Helmet>
        <title>Email Confirmed | AIDLA</title>
        <meta
          name="description"
          content="Your email has been confirmed. You can now sign in to AIDLA and start learning, winning, and earning."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://aidla.com/email-confirmed" />
        <meta property="og:title" content="Email Confirmed | AIDLA" />
        <meta property="og:description" content="Your email has been confirmed. You can now sign in to AIDLA." />
        <meta property="og:url" content="https://aidla.com/email-confirmed" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Helmet>

      <div className="ec-root">
        <div className="ec-orb-1" />
        <div className="ec-orb-2" />

        <main className="ec-main">
          <motion.div
            className="ec-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="ec-bar" />

            <div className="ec-inner">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                style={{ marginBottom: 22 }}
              >
                <img
                  src={logo}
                  alt="AIDLA Logo"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                    margin: "0 auto",
                    boxShadow: "0 8px 28px rgba(11,20,55,0.18)",
                    border: "2px solid rgba(59,130,246,0.12)",
                  }}
                />
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="ec-badge">Email Verified</span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                className="ec-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                You're <span className="ec-title-accent">All Set!</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                className="ec-sub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {firstName ? (
                  <>
                    Welcome aboard, <span className="ec-name">{firstName}</span>! Your email has been confirmed.
                  </>
                ) : (
                  "Your email has been confirmed."
                )}{" "}
                You can now sign in and start learning, winning, and earning on AIDLA.
              </motion.p>

              {/* Countdown ring */}
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
                        <stop offset="0%" stopColor="#1a3a8f" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <circle className="ec-ring-track" cx="26" cy="26" r="22" />
                    <circle
                      className="ec-ring-fill"
                      cx="26"
                      cy="26"
                      r="22"
                      strokeDasharray={CIRC}
                      strokeDashoffset={dashOffset}
                    />
                  </svg>
                  <div className="ec-ring-num">{seconds}</div>
                </div>
                <div className="ec-countdown-label">
                  <strong>Redirecting to login</strong>
                  <br />
                  in {seconds} second{seconds !== 1 ? "s" : ""}…
                </div>
              </motion.div>

              {/* Manual CTA */}
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

            {/* Info strip */}
            <div className="ec-strip">
              <div className="ec-strip-icon">🔒</div>
              <p>
                Your email <strong>{email || "address"}</strong> will be pre‑filled on the login
                page so you can sign in instantly.
              </p>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}