import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";

// ── Constants ──────────────────────────────────────────────
const OTP_EXPIRY_SECONDS = 180;   // 3 min
const RESEND_COOLDOWN    = 60;    // 60 s
const MAX_REQUESTS       = 3;
const WINDOW_HOURS       = 12;
const STORAGE_PREFIX     = "aidla_otp_v3__";

// ── Rate-limit helpers (per email) ────────────────────────
const eKey  = (e) => STORAGE_PREFIX + e.trim().toLowerCase();
const lMeta = (e) => { try { const r = localStorage.getItem(eKey(e)); return r ? JSON.parse(r) : { count:0, windowStart:null }; } catch { return { count:0, windowStart:null }; } };
const sMeta = (e, m) => { try { localStorage.setItem(eKey(e), JSON.stringify(m)); } catch {} };
const cMeta = (e) => { try { localStorage.removeItem(eKey(e)); } catch {} };

function getStatus(email) {
  if (!email) return { remaining: MAX_REQUESTS, resetMs: 0 };
  const meta = lMeta(email);
  const now  = Date.now();
  const win  = WINDOW_HOURS * 3600_000;
  if (!meta.windowStart || now - meta.windowStart > win) {
    sMeta(email, { count: 0, windowStart: now });
    return { remaining: MAX_REQUESTS, resetMs: 0 };
  }
  return {
    remaining: Math.max(0, MAX_REQUESTS - meta.count),
    resetMs:   Math.max(0, win - (now - meta.windowStart)),
  };
}

function recordReq(email) {
  const meta = lMeta(email);
  const now  = Date.now();
  const win  = WINDOW_HOURS * 3600_000;
  if (!meta.windowStart || now - meta.windowStart > win)
    sMeta(email, { count: 1, windowStart: now });
  else
    sMeta(email, { count: meta.count + 1, windowStart: meta.windowStart });
}

// ── Email regex ────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fmtSec(s) { return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; }
function fmtMs(ms) {
  const m = Math.ceil(ms / 60_000);
  return m >= 60 ? `${Math.ceil(m/60)}h ${m%60 ? m%60+"m" : ""}`.trim() : `${m}m`;
}

// ── Component ──────────────────────────────────────────────
export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step,           setStep]           = useState(1);
  const [email,          setEmail]          = useState("");
  const [emailTouched,   setEmailTouched]   = useState(false);
  const [emailChecking,  setEmailChecking]  = useState(false);
  const [emailValid,     setEmailValid]     = useState(null); // null | true | false
  const [emailStatus,    setEmailStatus]    = useState(""); // "found" | "notfound" | ""

  const [otp,            setOtp]            = useState("");
  const [newPwd,         setNewPwd]         = useState("");
  const [confirmPwd,     setConfirmPwd]     = useState("");
  const [showPwd,        setShowPwd]        = useState(false);

  const [loading,        setLoading]        = useState(false);
  const [msg,            setMsg]            = useState({ text:"", type:"" });

  const [resendCD,       setResendCD]       = useState(0);
  const [otpExpiry,      setOtpExpiry]      = useState(0);
  const [otpSentAt,      setOtpSentAt]      = useState(null);

  const [remaining,      setRemaining]      = useState(MAX_REQUESTS);
  const [resetMs,        setResetMs]        = useState(0);

  const resendRef  = useRef(null);
  const expiryRef  = useRef(null);
  const resetRef   = useRef(null);
  const debounceRef = useRef(null);

  // ── Refresh rate-limit whenever email changes ──
  useEffect(() => {
    if (!email) { setRemaining(MAX_REQUESTS); setResetMs(0); return; }
    const { remaining: r, resetMs: ms } = getStatus(email);
    setRemaining(r); setResetMs(ms);
  }, [email]);

  useEffect(() => {
    clearInterval(resetRef.current);
    if (resetMs > 0) {
      resetRef.current = setInterval(() => {
        const { remaining: r, resetMs: ms } = getStatus(email);
        setRemaining(r); setResetMs(ms);
      }, 60_000);
    }
    return () => clearInterval(resetRef.current);
  }, [resetMs, email]);

  useEffect(() => () => {
    clearInterval(resendRef.current);
    clearInterval(expiryRef.current);
    clearInterval(resetRef.current);
    clearTimeout(debounceRef.current);
  }, []);

  // ── Check email in DB (debounced 600ms after user stops typing) ──
  useEffect(() => {
    clearTimeout(debounceRef.current);
    setEmailValid(null);
    setEmailStatus("");

    if (!EMAIL_RE.test(email)) return; // not a complete email yet

    debounceRef.current = setTimeout(async () => {
      setEmailChecking(true);
      try {
        // Same table & column as Signup.jsx
        const { data, error } = await supabase
          .from("users_profiles")
          .select("email")
          .eq("email", email.trim().toLowerCase())
          .maybeSingle();

        if (error) throw error;
        if (data) { setEmailValid(true);  setEmailStatus("found"); }
        else      { setEmailValid(false); setEmailStatus("notfound"); }
      } catch {
        // If profiles table doesn't exist or query fails, allow proceed
        setEmailValid(false); setEmailStatus("error");
      } finally {
        setEmailChecking(false);
      }
    }, 500); // match Signup debounce
  }, [email]);

  // ── Timers ──
  function startResendTimer() {
    setResendCD(RESEND_COOLDOWN);
    clearInterval(resendRef.current);
    resendRef.current = setInterval(() => setResendCD(p => { if (p<=1){clearInterval(resendRef.current);return 0;} return p-1; }), 1000);
  }

  function startExpiryTimer() {
    clearInterval(expiryRef.current);
    setOtpExpiry(OTP_EXPIRY_SECONDS);
    expiryRef.current = setInterval(() => setOtpExpiry(p => {
      if (p<=1) { clearInterval(expiryRef.current); setMsg({ text:"OTP expired. Request a new code.", type:"error" }); return 0; }
      return p-1;
    }), 1000);
  }

  // ── Send OTP ──
  async function handleSendOtp(e) {
    e.preventDefault();
    setMsg({ text:"", type:"" });
    if (!emailValid) return;
    const { remaining: r } = getStatus(email);
    if (r <= 0) { setMsg({ text:`Limit reached. Try again in ${fmtMs(resetMs)}.`, type:"error" }); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: undefined });
      if (error) throw error;
      recordReq(email);
      const s = getStatus(email); setRemaining(s.remaining); setResetMs(s.resetMs);
      setOtpSentAt(Date.now()); startResendTimer(); startExpiryTimer();
      setStep(2);
      setMsg({ text:"6-digit OTP sent! Check your email. Expires in 3 minutes.", type:"success" });
    } catch (err) {
      setMsg({ text: err.message || "Failed to send OTP.", type:"error" });
    } finally { setLoading(false); }
  }

  // ── Resend ──
  async function handleResend() {
    if (resendCD > 0) return;
    const { remaining: r, resetMs: ms } = getStatus(email);
    if (r <= 0) { setMsg({ text:`Limit reached. Try again in ${fmtMs(ms)}.`, type:"error" }); return; }
    setMsg({ text:"", type:"" }); setOtp(""); setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: undefined });
      if (error) throw error;
      recordReq(email);
      const s = getStatus(email); setRemaining(s.remaining); setResetMs(s.resetMs);
      setOtpSentAt(Date.now()); startResendTimer(); startExpiryTimer();
      setMsg({ text:"New OTP sent! Previous code is now invalid.", type:"success" });
    } catch (err) {
      setMsg({ text: err.message || "Failed to resend.", type:"error" });
    } finally { setLoading(false); }
  }

  // ── Verify + Reset ──
  async function handleVerifyAndReset(e) {
    e.preventDefault(); setMsg({ text:"", type:"" });
    if (otpExpiry === 0) { setMsg({ text:"OTP expired. Request a new code.", type:"error" }); return; }
    if (otp.length !== 6) { setMsg({ text:"Please enter the full 6-digit OTP.", type:"error" }); return; }
    if (newPwd !== confirmPwd) { setMsg({ text:"Passwords do not match.", type:"error" }); return; }
    if (newPwd.length < 6) { setMsg({ text:"Password must be at least 6 characters.", type:"error" }); return; }

    setLoading(true);
    try {
      const { error: ve } = await supabase.auth.verifyOtp({ email, token: otp, type:"recovery" });
      if (ve) throw ve;
      const { error: ue } = await supabase.auth.updateUser({ password: newPwd });
      if (ue) throw ue;
      cMeta(email);
      clearInterval(resendRef.current); clearInterval(expiryRef.current);
      setMsg({ text:"Password updated! Redirecting to login…", type:"success" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg({ text: err.message || "Invalid or expired OTP.", type:"error" });
    } finally { setLoading(false); }
  }

  function goBack() {
    setStep(1); setMsg({ text:"",type:"" }); setOtp("");
    clearInterval(expiryRef.current); clearInterval(resendRef.current);
  }

  // ── Derived ──
  const emailComplete = EMAIL_RE.test(email);
  const otpExpired    = step === 2 && otpSentAt && otpExpiry === 0;
  const expiryUrgent  = otpExpiry > 0 && otpExpiry <= 60;
  const limitReached  = remaining <= 0;

  // Email field border color
  const emailBorder = !emailComplete
    ? "transparent"
    : emailChecking
      ? "rgba(251,191,36,.6)"
      : emailValid === true
        ? "rgba(16,185,129,.5)"
        : emailValid === false
          ? "rgba(239,68,68,.5)"
          : "transparent";

  // ── Inline styles (no CSS classname conflicts with app layout) ──
  const S = {
    overlay: {
      position: "fixed", inset: 0, zIndex: 99999,
      background: "linear-gradient(135deg,#e8eef8 0%,#f0f4f8 50%,#e8f0fb 100%)",
      overflowY: "auto", overflowX: "hidden",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "60px 20px 40px", fontFamily: "'Inter',system-ui,sans-serif",
    },
    orb1: { position:"fixed", width:420, height:420, borderRadius:"50%", filter:"blur(80px)", background:"rgba(30,58,138,0.14)", top:-120, left:-120, zIndex:-1, pointerEvents:"none" },
    orb2: { position:"fixed", width:320, height:320, borderRadius:"50%", filter:"blur(80px)", background:"rgba(59,130,246,0.13)", bottom:-80, right:-80, zIndex:-1, pointerEvents:"none" },
    card: {
      width:"100%", maxWidth:460,
      background:"rgba(255,255,255,0.9)",
      backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
      border:"1px solid rgba(255,255,255,0.95)",
      borderRadius:28, padding:"36px 36px 32px",
      boxShadow:"20px 20px 60px rgba(15,23,42,0.09),-20px -20px 60px rgba(255,255,255,0.95),inset 0 0 0 1.5px rgba(255,255,255,0.6)",
    },
    backBtn: {
      display:"inline-flex", alignItems:"center", gap:6,
      padding:"7px 14px", marginBottom:14,
      background:"#fff", color:"#1e3a8a", border:"none", borderRadius:12,
      fontWeight:700, fontSize:"0.84rem", textDecoration:"none", cursor:"pointer",
      boxShadow:"4px 4px 10px rgba(15,23,42,0.05),-4px -4px 10px rgba(255,255,255,1)",
      transition:"all .2s",
    },
    brandWrap: { textAlign:"center", marginBottom:20 },
    brandTitle: {
      fontSize:"2.8rem", fontWeight:900, letterSpacing:-1, marginBottom:4,
      background:"linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%)",
      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
      filter:"drop-shadow(2px 4px 6px rgba(30,58,138,0.2))", display:"block",
    },
    brandSub: { fontSize:"0.88rem", color:"#64748b", fontWeight:600 },

    // Rate dots row
    rateBar: { display:"flex", alignItems:"center", justifyContent:"center", gap:7, marginBottom:18, flexWrap:"wrap" },
    rateDotUsed:  { width:11, height:11, borderRadius:"50%", background:"#fca5a5", transition:"background .3s" },
    rateDotAvail: { width:11, height:11, borderRadius:"50%", background:"#6ee7b7", transition:"background .3s" },
    rateLabel: { fontSize:"0.72rem", color:"#64748b", fontWeight:600 },
    rateReset: { fontSize:"0.68rem", color:"#b45309", fontWeight:700, background:"#fef3c7", padding:"2px 9px", borderRadius:10 },

    fieldWrap: { marginBottom:16 },
    label: { display:"block", marginBottom:7, fontWeight:700, color:"#334155", fontSize:"0.8rem", textTransform:"uppercase", letterSpacing:"0.5px" },
    inputWrap: { position:"relative" },
    inp: (extra={}) => ({
      width:"100%", padding:"14px 17px", borderRadius:13, border:"2px solid transparent",
      background:"#f8fafc", color:"#0f172a", fontSize:"0.98rem", fontWeight:600,
      boxShadow:"inset 4px 4px 8px rgba(15,23,42,.06),inset -4px -4px 8px rgba(255,255,255,1)",
      outline:"none", transition:"all .25s", fontFamily:"inherit", ...extra,
    }),
    inpOtp: { textAlign:"center", letterSpacing:10, fontSize:"1.55rem", fontWeight:900, paddingLeft:22 },
    eyeBtn: { position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", alignItems:"center" },

    // Email status badge
    emailStatusBadge: (type) => ({
      display:"inline-flex", alignItems:"center", gap:5,
      marginTop:6, padding:"4px 11px", borderRadius:20,
      fontSize:"0.75rem", fontWeight:700,
      ...(type==="found"    ? { background:"#d1fae5", color:"#047857" } :
          type==="notfound" ? { background:"#fee2e2", color:"#b91c1c" } :
          type==="checking" ? { background:"#fef3c7", color:"#92400e" } :
          type==="error"    ? { background:"#fee2e2", color:"#b91c1c" } :
                              { background:"#f1f5f9", color:"#64748b" }),
    }),

    // Rate limit warning (shown before clicking send)
    rateLimitWarn: {
      display:"flex", alignItems:"flex-start", gap:10,
      background:"#fff7ed", border:"1.5px solid #fed7aa",
      borderRadius:12, padding:"11px 14px", marginBottom:16,
      fontSize:"0.8rem", color:"#9a3412", fontWeight:600, lineHeight:1.5,
    },

    btn: (disabled) => ({
      width:"100%", padding:"16px", borderRadius:13, border:"none",
      background: disabled ? "#94a3b8" : "linear-gradient(135deg,#1e3a8a,#3b82f6)",
      color:"#fff", fontSize:"1.05rem", fontWeight:800, letterSpacing:"1px",
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.8 : 1,
      boxShadow: disabled ? "0 10px 0 #64748b" : "0 10px 0 #1e3a8a,0 18px 22px rgba(30,58,138,.28),inset 0 2px 0 rgba(255,255,255,.2)",
      transition:"all .15s",
    }),

    otpMeta: { display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:11, flexWrap:"wrap" },
    expiryBadge: (type) => ({
      display:"inline-flex", alignItems:"center", gap:4,
      padding:"4px 11px", borderRadius:18, fontSize:"0.76rem", fontWeight:700,
      ...(type==="ok"     ? { background:"#d1fae5", color:"#047857" } :
          type==="urgent" ? { background:"#fee2e2", color:"#b91c1c" } :
                            { background:"#f1f5f9", color:"#94a3b8" }),
    }),
    resendBtn: (disabled) => ({
      background:"none", border:"none", cursor: disabled?"not-allowed":"pointer",
      fontSize:"0.8rem", fontWeight:700, color: disabled?"#94a3b8":"#3b82f6",
      padding:"4px 10px", borderRadius:8, textDecoration: disabled?"none":"underline",
      textUnderlineOffset:3,
    }),
    resendHint: { fontSize:"0.7rem", color:"#64748b", textAlign:"center", marginBottom:13 },

    msg: (type) => ({
      marginTop:15, padding:"12px 15px", borderRadius:12,
      textAlign:"center", fontWeight:700, fontSize:"0.86rem", lineHeight:1.5,
      ...(type==="success" ? { color:"#047857", background:"#d1fae5", boxShadow:"inset 0 0 0 2px #34d399" } :
          type==="error"   ? { color:"#b91c1c", background:"#fee2e2", boxShadow:"inset 0 0 0 2px #f87171" } :
                             { color:"#1e40af", background:"#dbeafe", boxShadow:"inset 0 0 0 2px #93c5fd" }),
    }),

    blockedBox: { textAlign:"center", padding:"6px 0 2px" },
    blockedIcon: { fontSize:"2.6rem", display:"block", marginBottom:6 },
    blockedHint: { color:"#64748b", fontSize:"0.8rem", marginTop:10, lineHeight:1.55 },
  };

  // ── Render via portal to escape app layout completely ──
  return createPortal(
    <div style={S.overlay}>
      {/* background orbs */}
      <div style={S.orb1} />
      <div style={S.orb2} />

      <div style={S.card}>
        {/* Back button */}
        {step === 1 ? (
          <Link to="/login" style={S.backBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Login
          </Link>
        ) : (
          <button onClick={goBack} style={S.backBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Change Email
          </button>
        )}

        {/* Brand */}
        <div style={S.brandWrap}>
          <span style={S.brandTitle}>AIDLA</span>
          <p style={S.brandSub}>{step===1 ? "Secure Account Recovery" : "Enter OTP & Set New Password"}</p>
        </div>

        {/* Rate-limit dots — only after valid email */}
        {emailComplete && emailValid === true && (
          <div style={S.rateBar}>
            {Array.from({ length: MAX_REQUESTS }).map((_, i) => (
              <div key={i} style={i < MAX_REQUESTS - remaining ? S.rateDotUsed : S.rateDotAvail} />
            ))}
            <span style={S.rateLabel}>{remaining}/{MAX_REQUESTS} OTP requests left</span>
            {limitReached && resetMs > 0 && (
              <span style={S.rateReset}>⏳ resets in {fmtMs(resetMs)}</span>
            )}
          </div>
        )}

        {/* ═══ STEP 1 ═══ */}
        {step === 1 && (
          <>
            {/* Show rate-limit block BEFORE send if limit already reached */}
            {emailComplete && emailValid === true && limitReached ? (
              <div style={S.blockedBox}>
                <span style={S.blockedIcon}>🔒</span>
                <div style={S.msg("error")}>
                  Too many OTP requests for <b>{email}</b>.<br/>
                  {resetMs > 0 ? `Please wait ${fmtMs(resetMs)} before trying again.` : "Please try again later."}
                </div>
                <p style={S.blockedHint}>Each email address has its own independent limit. You can try a different email.</p>
              </div>
            ) : (
              <form onSubmit={handleSendOtp}>
                <div style={S.fieldWrap}>
                  <label style={S.label}>Registered Email</label>
                  <div style={S.inputWrap}>
                    <input
                      style={{ ...S.inp(), borderColor: emailBorder }}
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailTouched(true); }}
                      onBlur={() => setEmailTouched(true)}
                      type="email"
                      required
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </div>

                  {/* Email validation feedback */}
                  {emailTouched && !emailComplete && email.length > 0 && (
                    <div style={S.emailStatusBadge("error")}>⚠ Enter a valid email address</div>
                  )}
                  {emailComplete && emailChecking && (
                    <div style={S.emailStatusBadge("checking")}>⏳ Checking email…</div>
                  )}
                  {emailComplete && !emailChecking && emailStatus === "found" && (
                    <div style={S.emailStatusBadge("found")}>✓ Email found — {remaining}/{MAX_REQUESTS} requests available</div>
                  )}
                  {emailComplete && !emailChecking && emailStatus === "notfound" && (
                    <div style={S.emailStatusBadge("notfound")}>✗ No account found with this email</div>
                  )}
                  {emailComplete && !emailChecking && emailStatus === "error" && (
                    <div style={S.emailStatusBadge("error")}>⚠ Could not verify email. Check connection.</div>
                  )}
                </div>

                {/* Show rate limit warning inline before they click */}
                {emailComplete && emailValid === true && remaining > 0 && remaining < MAX_REQUESTS && (
                  <div style={S.rateLimitWarn}>
                    ⚠️ You have used {MAX_REQUESTS - remaining} of {MAX_REQUESTS} attempts for this email.
                    {" "}{remaining} attempt{remaining!==1?"s":""} remaining.
                    {resetMs > 0 && ` Resets in ${fmtMs(resetMs)}.`}
                  </div>
                )}

                <button
                  type="submit"
                  style={S.btn(loading || !emailValid || emailChecking || limitReached || emailStatus === "error")}
                  disabled={loading || !emailValid || emailChecking || limitReached || emailStatus === "error"}
                >
                  {loading ? "SENDING…" : "SEND 6-DIGIT OTP"}
                </button>
              </form>
            )}
          </>
        )}

        {/* ═══ STEP 2 ═══ */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndReset}>
            {/* Expiry + resend */}
            <div style={S.otpMeta}>
              <span style={S.expiryBadge(otpExpired?"dead":expiryUrgent?"urgent":"ok")}>
                ⏱ {otpExpired ? "Expired" : `Expires ${fmtSec(otpExpiry)}`}
              </span>
              <button type="button" style={S.resendBtn(resendCD>0||loading||limitReached)}
                onClick={handleResend} disabled={resendCD>0||loading||limitReached}>
                {limitReached ? "Limit reached" : resendCD>0 ? `Resend in ${resendCD}s` : "Resend OTP"}
              </button>
            </div>
            <div style={S.resendHint}>
              New OTP <b>invalidates</b> previous · <b>{remaining}/{MAX_REQUESTS}</b> requests left
            </div>

            <div style={S.fieldWrap}>
              <label style={S.label}>6-Digit OTP Code</label>
              <input
                style={{ ...S.inp(), ...S.inpOtp }}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
                type="text" inputMode="numeric" pattern="[0-9]*"
                required maxLength={6} placeholder="••••••"
                disabled={otpExpired} autoComplete="one-time-code"
              />
            </div>

            <div style={S.fieldWrap}>
              <label style={S.label}>New Password</label>
              <div style={S.inputWrap}>
                <input
                  style={{ ...S.inp({ paddingRight:44 }) }}
                  value={newPwd} onChange={e=>setNewPwd(e.target.value)}
                  type={showPwd?"text":"password"} required placeholder="Enter new password"
                />
                <button type="button" style={S.eyeBtn} onClick={()=>setShowPwd(p=>!p)} tabIndex="-1">
                  {showPwd
                    ? <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <div style={S.fieldWrap}>
              <label style={S.label}>Confirm New Password</label>
              <input
                style={S.inp()}
                value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)}
                type={showPwd?"text":"password"} required placeholder="Confirm new password"
              />
            </div>

            <button type="submit"
              style={S.btn(loading||otpExpired||otp.length!==6)}
              disabled={loading||otpExpired||otp.length!==6}>
              {loading?"VERIFYING…":"RESET PASSWORD"}
            </button>
          </form>
        )}

        {msg.text && <div style={S.msg(msg.type)}>{msg.text}</div>}
      </div>
    </div>,
    document.body  // ← portal renders directly into body, escaping ALL app layouts
  );
}