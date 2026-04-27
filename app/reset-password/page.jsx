"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // Ensure this matches your Next.js path

export default function ResetPassword() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
      setChecking(false);
    })();
  }, []);

  async function onSubmit(e) {
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
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setMsg("Password updated successfully! Redirecting to login...");
      await supabase.auth.signOut();
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setMsg(err.message || "Failed to update password");
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
      transition: all 0.2s ease;
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

    .eco-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 20px; }
    .eco-badge {
      display: flex; flex-direction: column; align-items: center; padding: 10px 5px;
      background: #ffffff; border-radius: 14px; font-size: 0.65rem; font-weight: 700; color: #1e3a8a;
      box-shadow: 5px 5px 15px rgba(15, 23, 42, 0.05), -5px -5px 15px rgba(255, 255, 255, 0.8);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .eco-badge:hover { transform: translateY(-4px) scale(1.05); }
    .eco-badge svg { width: 18px; height: 18px; margin-bottom: 4px; stroke: #3b82f6; stroke-width: 2; fill: none; }

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
    
    .loading-state { text-align: center; color: #64748b; font-weight: 600; font-size: 1.1rem; padding: 40px 0; }
    .error-state { text-align: center; padding: 20px 0; }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 500px) {
      .fullscreen-wrapper { padding: 30px 15px; }
      .card-2060 { padding: 30px 20px; border-radius: 20px; }
      .brand-title { font-size: 2.4rem; }
      .input-3d { padding: 14px 16px; font-size: 0.95rem; }
      .btn-2060 { padding: 16px; font-size: 1.05rem; }
      .eco-grid { gap: 6px; }
      .eco-badge { padding: 8px 2px; font-size: 0.55rem; }
    }
  `;

  if (checking) return null;

  return (
    <div className="fullscreen-wrapper">
      <style>{css}</style>
      
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <div className="card-2060">
        
        <Link href="/login" className="back-btn">
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to Login
        </Link>
        
        <div className="brand-header">
          <h1 className="brand-title">AIDLA</h1>
          <p className="brand-subtitle">Set New Password</p>
          
          <div className="eco-grid">
            <div className="eco-badge">
              <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              Education
            </div>
            <div className="eco-badge">
              <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
              Mining
            </div>
            <div className="eco-badge">
              <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
              Earning
            </div>
            <div className="eco-badge">
              <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
              Shop
            </div>
          </div>
        </div>

        {!hasSession ? (
          <div className="error-state">
            <div
              className="msg-box"
              style={{
                color: "#b91c1c",
                background: "#fee2e2",
                boxShadow: "inset 0 0 0 2px #f87171"
              }}
            >
              Session not found or link expired. Please go back to login and request a new password reset.
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            
            <div className="input-group">
              <label className="label-3d">New Password</label>
              <div className="input-wrapper">
                <input
                  className="input-3d"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter a new strong password"
                  style={{ paddingRight: "45px" }}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
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
                placeholder="Confirm your new password"
              />
            </div>

            <button disabled={loading} className="btn-2060">
              {loading ? "SAVING..." : "UPDATE PASSWORD"}
            </button>

            {msg && (
              <div
                className="msg-box"
                style={{
                  color: msg.includes("success") ? "#047857" : "#b91c1c",
                  background: msg.includes("success") ? "#d1fae5" : "#fee2e2",
                  boxShadow: msg.includes("success") ? "inset 0 0 0 2px #34d399" : "inset 0 0 0 2px #f87171"
                }}
              >
                {msg}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}