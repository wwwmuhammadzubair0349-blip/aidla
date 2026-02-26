import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Step 1: Request OTP | Step 2: Verify OTP & Reset
  const [step, setStep] = useState(1);

  // Form State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- STEP 1: Send OTP to Email ---
  async function handleSendOtp(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      setMsg("OTP sent! Please check your email for the 6-digit code.");
      setStep(2); // Move to OTP Verification Step
    } catch (err) {
      setMsg(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  // --- STEP 2: Verify OTP and Update Password ---
  async function handleVerifyAndReset(e) {
    e.preventDefault();
    setMsg("");

    if (newPassword !== confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // 1) Verify the OTP (Type 'recovery' is specific to password resets)
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "recovery",
      });
      if (verifyError) throw verifyError;

      // 2) OTP valid -> User session created. Now update password.
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      setMsg("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.message || "Failed to reset password. Invalid OTP or expired.");
    } finally {
      setLoading(false);
    }
  }

  // --- 2060 3D NEXT-GEN CSS ---
  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .fullscreen-wrapper {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: #f0f4f8; overflow-y: auto; overflow-x: hidden;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      z-index: 99999; padding: 50px 20px; 
    }

    .bg-orb {
      position: fixed; border-radius: 50%; filter: blur(80px);
      z-index: -1; animation: float 20s infinite alternate ease-in-out;
    }
    .orb-1 { width: 400px; height: 400px; background: rgba(30, 58, 138, 0.15); top: -100px; left: -100px; }
    .orb-2 { width: 300px; height: 300px; background: rgba(59, 130, 246, 0.15); bottom: -50px; right: -50px; animation-duration: 25s; }

    @keyframes float {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(50px, 50px) scale(1.1); }
    }

    .card-2060 {
      width: 100%; max-width: 480px; margin: 0 auto; 
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 1);
      border-radius: 28px; padding: 40px;
      box-shadow: 20px 20px 60px rgba(15, 23, 42, 0.08), -20px -20px 60px rgba(255, 255, 255, 0.9), inset 0 0 0 2px rgba(255, 255, 255, 0.5);
      animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0; transform: translateY(30px) scale(0.95); position: relative;
    }

    @keyframes popIn { to { opacity: 1; transform: translateY(0) scale(1); } }

    .back-btn {
      display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; margin-bottom: 10px;
      background: #ffffff; color: #1e3a8a; text-decoration: none; font-weight: 700; font-size: 0.85rem; border-radius: 12px;
      box-shadow: 4px 4px 10px rgba(15, 23, 42, 0.05), -4px -4px 10px rgba(255, 255, 255, 1);
      transition: all 0.2s ease; cursor: pointer; border: none;
    }
    .back-btn:hover { color: #3b82f6; transform: translateY(-2px); }
    .back-btn:active { transform: translateY(1px); box-shadow: inset 2px 2px 5px rgba(15,23,42,0.05), inset -2px -2px 5px rgba(255,255,255,1); }
    .back-btn svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 3; fill: none; }

    .brand-header { text-align: center; margin-bottom: 30px; margin-top: 10px; }
    .brand-title {
      font-size: 3rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 5px;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(2px 4px 6px rgba(30, 58, 138, 0.2));
    }
    .brand-subtitle { font-size: 0.95rem; color: #64748b; font-weight: 600; letter-spacing: 0.5px; }

    .input-group { margin-bottom: 24px; position: relative; }
    .label-3d { display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .input-wrapper { position: relative; width: 100%; }
    
    .input-3d {
      width: 100%; padding: 16px 20px; border-radius: 16px; border: 2px solid transparent;
      background: #f8fafc; color: #0f172a; font-size: 1rem; font-weight: 600;
      box-shadow: inset 5px 5px 10px rgba(15, 23, 42, 0.06), inset -5px -5px 10px rgba(255, 255, 255, 1);
      transition: all 0.3s ease;
    }
    .input-3d::placeholder { color: #cbd5e1; font-weight: 500; }
    .input-3d:focus { outline: none; background: #ffffff; border-color: rgba(59, 130, 246, 0.4); box-shadow: inset 2px 2px 5px rgba(15, 23, 42, 0.03), inset -2px -2px 5px rgba(255, 255, 255, 1), 0 0 15px rgba(59, 130, 246, 0.2); }
    
    .input-otp { text-align: center; letter-spacing: 4px; font-size: 1.2rem; font-weight: 800; }

    .eye-btn {
      position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8;
      display: flex; align-items: center; justify-content: center; transition: color 0.2s;
    }
    .eye-btn:hover { color: #1e3a8a; }

    .btn-2060 {
      width: 100%; padding: 18px; border-radius: 16px; border: none; background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: #ffffff; font-size: 1.15rem; font-weight: 800; letter-spacing: 1px; cursor: pointer;
      box-shadow: 0 10px 0 #1e3a8a, 0 20px 25px rgba(30, 58, 138, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2);
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); position: relative;
    }
    .btn-2060:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 12px 0 #1e3a8a, 0 25px 30px rgba(30, 58, 138, 0.4), inset 0 2px 0 rgba(255,255,255,0.2); }
    .btn-2060:active:not(:disabled) { transform: translateY(10px); box-shadow: 0 0px 0 #1e3a8a, 0 5px 10px rgba(30, 58, 138, 0.3), inset 0 2px 0 rgba(255,255,255,0.2); }
    .btn-2060:disabled { background: #94a3b8; box-shadow: 0 10px 0 #64748b; cursor: not-allowed; opacity: 0.8; }

    .msg-box { margin-top: 20px; padding: 16px; border-radius: 14px; text-align: center; font-weight: 700; font-size: 0.95rem; animation: fadeIn 0.4s ease; line-height: 1.4;}
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 500px) {
      .fullscreen-wrapper { padding: 30px 15px; }
      .card-2060 { padding: 30px 20px; border-radius: 20px; }
      .brand-title { font-size: 2.4rem; }
      .input-3d { padding: 14px 16px; font-size: 0.95rem; }
      .btn-2060 { padding: 16px; font-size: 1.05rem; }
    }
  `;

  return (
    <div className="fullscreen-wrapper">
      <style>{css}</style>
      
      {/* Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <div className="card-2060">
        
        {/* Back Button Handling based on Step */}
        {step === 1 ? (
          <Link to="/login" className="back-btn">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Login
          </Link>
        ) : (
          <button onClick={() => { setStep(1); setMsg(""); }} className="back-btn">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Change Email
          </button>
        )}
        
        <div className="brand-header">
          <h1 className="brand-title">AIDLA</h1>
          <p className="brand-subtitle">Secure Account Recovery</p>
        </div>

        {/* --- STEP 1 FORM: EMAIL --- */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="input-group">
              <label className="label-3d">Registered Email</label>
              <input
                className="input-3d"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Enter your email"
              />
            </div>

            <button disabled={loading} className="btn-2060">
              {loading ? "PROCESSING..." : "SEND OTP CODE"}
            </button>
          </form>
        )}

        {/* --- STEP 2 FORM: OTP & NEW PASSWORD --- */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndReset}>
            <div className="input-group">
              <label className="label-3d">6-Digit OTP Code</label>
              <input
                className="input-3d input-otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                required
                maxLength={6}
                placeholder="• • • • • •"
              />
            </div>

            <div className="input-group">
              <label className="label-3d">New Password</label>
              <div className="input-wrapper">
                <input
                  className="input-3d"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter new password"
                  style={{ paddingRight: "45px" }}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="label-3d">Confirm New Password</label>
              <input
                className="input-3d"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                placeholder="Confirm new password"
              />
            </div>

            <button disabled={loading} className="btn-2060">
              {loading ? "VERIFYING..." : "RESET PASSWORD"}
            </button>
          </form>
        )}

        {/* Global Message Display */}
        {msg && (
          <div
            className="msg-box"
            style={{
              color: msg.includes("sent") || msg.includes("successfully") ? "#047857" : "#b91c1c",
              background: msg.includes("sent") || msg.includes("successfully") ? "#d1fae5" : "#fee2e2",
              boxShadow: msg.includes("sent") || msg.includes("successfully") ? "inset 0 0 0 2px #34d399" : "inset 0 0 0 2px #f87171"
            }}
          >
            {msg}
          </div>
        )}

      </div>
    </div>
  );
}