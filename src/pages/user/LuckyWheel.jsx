import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../lib/supabase"; // adjust path

const typeToNice = (t) => {
  switch (t) {
    case "try_again_free":
      return "🔄 Try Again";
    case "plus1_chance":
      return "🍀 +1 Chance";
    case "gift":
      return "🎁 Gift";
    case "coins":
      return "💰 Coins";
    default:
      return t;
  }
};

function utcDayStartISO() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}T00:00:00.000Z`;
}

function msToHMS(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// Updated to match the cool blue 2060 theme
const SLICE_COLORS =["#1E3A8A", "#3B82F6", "#0EA5E9", "#8B5CF6"];

export default function LuckyWheel() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // States for UI
  const[spinning, setSpinning] = useState(false);
  const spinningRef = useRef(false);

  const[msg, setMsg] = useState("");

  const [settings, setSettings] = useState(null);
  const [profile, setProfile] = useState(null);
  const[drawsToday, setDrawsToday] = useState(0);

  const [rotation, setRotation] = useState(0);
  const[lastResult, setLastResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [history, setHistory] = useState([]);
  const[showAllHistory, setShowAllHistory] = useState(false); // NEW: toggle history visibility

  const [tick, setTick] = useState(0);
  const intervalRef = useRef(null);

  const slices = useMemo(() => {
    const s = settings?.slices;
    if (Array.isArray(s) && s.length === 4) return s;
    return[
      { label: "Slice 1", type: "try_again_free", value: 0 },
      { label: "Slice 2", type: "plus1_chance", value: 0 },
      { label: "Slice 3", type: "gift", value: 0 },
      { label: "Slice 4", type: "coins", value: 10 },
    ];
  }, [settings]);

  const entryText = useMemo(() => {
    if (!settings) return "";
    if (settings.entry_type === "paid") return `Paid entry: ${settings.entry_cost} coins`;
    return "Free entry";
  }, [settings]);

  const canClaim = (profile?.lw_earned_coins ?? 0) > 0;
  const drawsLeft = profile?.lw_draws_remaining ?? 0;

  const nextUtcMidnightMs = useMemo(() => {
    const now = new Date();
    const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
    return next.getTime() - now.getTime();
  }, [tick]);

  const loadAll = async () => {
    setMsg((m) => m);

    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      setMsg("Please login first.");
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    await supabase.rpc("lw_sync_remaining");

    const[settingsRes, profileRes, historyCountRes, historyListRes] = await Promise.all([
      supabase.from("luckywheel_settings").select("*").eq("id", 1).single(),
      supabase.from("users_profiles").select("*").eq("user_id", userId).single(),
      supabase
        .from("luckywheel_history")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", utcDayStartISO()),
      supabase
        .from("luckywheel_history")
        .select("id, created_at, result_type, coins_won, entry_type, entry_cost, slice_index")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    if (settingsRes.data) setSettings(settingsRes.data);
    if (profileRes.data) setProfile(profileRes.data);
    setDrawsToday(historyCountRes.count || 0);
    setHistory(historyListRes.data ||[]);

    setLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    setLoading(true);
    loadAll();

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTick((x) => x + 1);
      if (!spinningRef.current) {
        loadAll();
      }
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  },[]);

  useEffect(() => {
    let timer;
    if (showModal) {
      timer = setTimeout(() => setShowModal(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [showModal]);

  const spinToSlice = (sliceIndex) => {
    const sliceAngle = 360 / slices.length;
    const targetCenter = sliceIndex * sliceAngle + sliceAngle / 2;
    const targetAngle = 360 - targetCenter;

    const currentMod = rotation % 360;
    let angleDiff = targetAngle - currentMod;
    if (angleDiff < 0) angleDiff += 360;

    const spins = 15; 
    const newRotation = rotation + angleDiff + spins * 360;
    setRotation(newRotation);
  };

  const onDraw = async () => {
    setMsg("");
    setLastResult(null);
    setShowModal(false);

    if (!settings || !profile) return;

    if (drawsLeft <= 0) {
      setMsg("Daily limit reached.");
      return;
    }

    if (settings.entry_type === "paid") {
      const cost = Number(settings.entry_cost || 0);
      const bal = Number(profile.total_aidla_coins || 0);
      if (bal < cost) {
        setMsg("Insufficient coins for paid entry.");
        return;
      }
    }

    setSpinning(true);
    spinningRef.current = true;

    const { data, error } = await supabase.rpc("lw_draw");
    if (error) {
      setSpinning(false);
      spinningRef.current = false;
      setMsg(`Draw failed: ${error.message}`);
      return;
    }
    if (!data?.ok) {
      setSpinning(false);
      spinningRef.current = false;
      setMsg(data?.error || "Draw failed");
      return;
    }

    const sliceIndex = data.slice_index ?? 0;
    spinToSlice(sliceIndex);
    setLastResult(data);

    setTimeout(async () => {
      await loadAll(); 
      setSpinning(false);
      spinningRef.current = false;
      setShowModal(true);
    }, 10200);
  };

  const onClaim = async () => {
    setMsg("");
    const { data, error } = await supabase.rpc("lw_claim");
    if (error) {
      setMsg(`Claim failed: ${error.message}`);
      return;
    }
    if (!data?.ok) {
      setMsg(data?.error || "Nothing to claim");
      return;
    }
    setMsg(`🎉 Claimed ${data.claimed} coins successfully!`);
    await loadAll();
  };

  const drawDisabled = spinning || loading || drawsLeft <= 0;
  const displayedHistory = showAllHistory ? history : history.slice(0, 1);

  const renderModal = () => {
    if (!showModal || !lastResult || !mounted) return null;

    return createPortal(
      <div className="lw-modal-overlay fadeIn" onClick={() => setShowModal(false)}>
        <div className="lw-modal-content bounce-in" onClick={(e) => e.stopPropagation()}>
          <button className="lw-modal-close" onClick={() => setShowModal(false)}>×</button>
          <h2 className="lw-modal-title">🎉 Congratulations! 🎉</h2>
          <div className="lw-modal-result-text">
            {typeToNice(lastResult.result_type)}
            {lastResult.result_type === "coins" ? ` (+${lastResult.coins_won})` : ""}
          </div>
          <div className="lw-modal-footer">Closing automatically in 5 seconds...</div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="fullscreen-wrapper">
      <style>{styles}</style>
      {renderModal()}

      {/* 2060 Animated Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <div className="lw-container">
        <div className="lw-header">
          <h2 className="lw-title">Lucky Wheel</h2>
          <div className="lw-badge">{entryText}</div>
        </div>

        {loading ? (
          <div className="lw-loader-container">
            <div className="lw-spinner"></div>
            <p>Loading your luck...</p>
          </div>
        ) : (
          <>
            <div className="lw-grid">
              {/* LEFT COLUMN: STATS & CONTROLS */}
              <div className="lw-col">
                <div className="lw-card">
                  <div className={`lw-draws-focus ${spinning ? 'pulse-fast' : 'pulse-soft'}`}>
                    <span>Chances Left</span>
                    <div className="lw-draws-number">{drawsLeft}</div>
                  </div>

                  <div className="lw-stat-grid">
                    <div className="lw-stat-box">
                      <span>Draws today</span>
                      <strong>{drawsToday}</strong>
                    </div>
                    <div className="lw-stat-box">
                      <span>Daily limit</span>
                      <strong>{Number(settings?.daily_limit ?? 0)}</strong>
                    </div>
                    <div className="lw-stat-box">
                      <span>Your balance</span>
                      <strong>{Number(profile?.total_aidla_coins ?? 0)}</strong>
                    </div>
                    <div className="lw-stat-box">
                      <span>Total earned</span>
                      <strong>{Number(profile?.total_lw_earned ?? 0)}</strong>
                    </div>
                  </div>

                  <div className="lw-claim-section">
                    <div className="lw-stat-row">
                      <span>Claimable Coins</span>
                      <strong className="lw-claim-value">
                        {Number(profile?.lw_earned_coins ?? 0)}
                      </strong>
                    </div>
                    <button
                      onClick={onClaim}
                      disabled={!canClaim || spinning}
                      className="btn-2060"
                      title={canClaim ? "Transfer earned coins to main balance" : "No coins to claim"}
                    >
                      {canClaim ? "CLAIM COINS" : "NOTHING TO CLAIM"}
                    </button>
                  </div>

                  {drawsLeft <= 0 ? (
                    <div className="lw-countdown-box">
                      <div style={{ fontWeight: 800 }}>Next draws available in</div>
                      <div className="lw-countdown-time">{msToHMS(nextUtcMidnightMs)}</div>
                      <div style={{ color: "#94a3b8", fontSize: 12 }}>Resets at 00:00 UTC</div>
                    </div>
                  ) : null}

                  {msg && (
                    <div className={`lw-msg-box ${msg.toLowerCase().includes("fail") || msg.toLowerCase().includes("insufficient") || msg.toLowerCase().includes("limit") ? "error" : "success"}`}>
                      {msg}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: THE WHEEL */}
              <div className="lw-col lw-center-content">
                <div className="lw-card lw-wheel-card">
                  <Wheel slices={slices} rotation={rotation} onDraw={onDraw} drawDisabled={drawDisabled} spinning={spinning} />
                  
                  <div className="lw-legend">
                    {slices.map((s, i) => (
                      <div key={i} className="lw-legend-item">
                        <div className="lw-legend-color" style={{ background: SLICE_COLORS[i] }}></div>
                        <span>
                          {typeToNice(s.type)} {s.type === "coins" ? `(${s.value})` : ""}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="lw-wheel-tip">
                    💡 <strong>Tip:</strong> Try Again consumes 1 draw. +1 Chance keeps your draws the same.
                  </div>
                </div>
              </div>
            </div>

            {/* HISTORY SECTION */}
            <div className="lw-card lw-history-card">
              <h3 className="lw-history-title">My Lucky History</h3>
              {history.length === 0 ? (
                <div className="lw-empty-history">No spins yet. Spin the wheel to get started!</div>
              ) : (
                <div className="lw-table-responsive">
                  <table className="lw-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Result</th>
                        <th>Prize Won</th>
                        <th>Entry</th>
                        <th>Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedHistory.map((h) => (
                        <tr key={h.id}>
                          <td>{new Date(h.created_at).toLocaleString()}</td>
                          <td style={{ fontWeight: 600 }}>{typeToNice(h.result_type)}</td>
                          <td style={{ color: h.result_type === "coins" ? "#3b82f6" : "inherit", fontWeight: "bold" }}>
                            {h.result_type === "coins" ? `+${h.coins_won} Coins` : "Prize"}
                          </td>
                          <td>
                            <span className={`lw-entry-badge ${h.entry_type === "paid" ? "paid" : "free"}`}>
                              {h.entry_type === "paid" ? "Paid" : "Free"}
                            </span>
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                             {h.entry_type === "paid" ? `${h.entry_cost} C` : "Free"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {history.length > 1 && (
                <div className="lw-history-actions">
                  <button
                    className="lw-btn-seemore"
                    onClick={() => setShowAllHistory(!showAllHistory)}
                  >
                    {showAllHistory ? "See Less" : "See More History"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// WHEEL COMPONENT
// ----------------------------------------------------
function Wheel({ slices, rotation, onDraw, drawDisabled, spinning }) {
  const bg = `conic-gradient(
    ${SLICE_COLORS[0]} 0deg 90deg, 
    ${SLICE_COLORS[1]} 90deg 180deg, 
    ${SLICE_COLORS[2]} 180deg 270deg, 
    ${SLICE_COLORS[3]} 270deg 360deg
  )`;

  return (
    <div className="lw-wheel-outer-wrapper">
      <div className="lw-wheel-rim">
        <div className="lw-pointer">
          <svg width="40" height="50" viewBox="0 0 40 50">
            <path d="M20 50 L0 10 Q10 0 20 0 Q30 0 40 10 Z" fill="url(#gradPointer)" stroke="#fff" strokeWidth="2" />
            <defs>
              <linearGradient id="gradPointer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div
          className="lw-wheel-spin-area"
          style={{
            background: bg,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {slices.map((s, i) => (
            <div
              key={i}
              className="lw-slice-text"
              style={{
                transform: `rotate(${i * 90 + 45}deg)`,
              }}
            >
              <div className="lw-slice-text-inner">
                {typeToNice(s.type)}
                {s.type === "coins" && <div className="lw-slice-value">{s.value}</div>}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onDraw}
          disabled={drawDisabled}
          className={`btn-2060-wheel ${spinning ? "spinning" : ""}`}
          title={drawDisabled ? "Draw not available" : "Draw Now!"}
        >
          {spinning ? "🤞" : "DRAW"}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// CSS STYLES (2060 Next-Gen + Enhanced Mobile Fixes)
// ----------------------------------------------------
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  * { box-sizing: border-box; }

  /* --- FULLSCREEN & BACKGROUND ORBS --- */
  .fullscreen-wrapper {
    min-height: 100vh;
    background: #f0f4f8; overflow-y: auto; overflow-x: hidden;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    padding: 40px 20px; position: relative;
    color: #0f172a;
  }
  .bg-orb {
    position: fixed; border-radius: 50%; filter: blur(80px);
    z-index: 0; animation: float 20s infinite alternate ease-in-out; pointer-events: none;
  }
  .orb-1 { width: 400px; height: 400px; background: rgba(30, 58, 138, 0.15); top: -100px; left: -100px; }
  .orb-2 { width: 300px; height: 300px; background: rgba(59, 130, 246, 0.15); bottom: -50px; right: -50px; animation-duration: 25s; }

  @keyframes float {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(50px, 50px) scale(1.1); }
  }

  .lw-container { max-width: 900px; margin: 0 auto; position: relative; z-index: 1; display: flex; flex-direction: column; gap: 24px; }

  /* --- 2060 3D NEUMORPHIC CARDS --- */
  .lw-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 28px; padding: 24px;
    box-shadow: 20px 20px 60px rgba(15, 23, 42, 0.08), -20px -20px 60px rgba(255, 255, 255, 0.9), inset 0 0 0 2px rgba(255, 255, 255, 0.5);
    position: relative; width: 100%;
  }

  /* --- HEADER --- */
  .lw-header { text-align: center; margin-bottom: 5px; }
  .lw-title {
    font-size: 2.8rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 8px; margin-top: 0;
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(2px 4px 6px rgba(30, 58, 138, 0.2));
    text-transform: uppercase;
  }
  .lw-badge {
    display: inline-block; background: #e0f2fe; color: #0284c7; padding: 6px 18px;
    border-radius: 20px; font-weight: 800; font-size: 0.9rem; box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2);
  }

  .lw-loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; font-weight: 600; color: #64748b; }
  .lw-spinner {
    width: 50px; height: 50px; border: 5px solid #e0f2fe; border-top: 5px solid #3b82f6;
    border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px;
  }

  /* --- LAYOUT GRID --- */
  .lw-grid { display: flex; flex-wrap: wrap; gap: 24px; }
  .lw-col { flex: 1 1 340px; display: flex; flex-direction: column; gap: 24px; }
  .lw-center-content { align-items: center; justify-content: center; }

  /* --- STATS BOXES --- */
  .lw-draws-focus {
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: white; border-radius: 20px; padding: 20px; text-align: center;
    box-shadow: 0 10px 25px rgba(30, 58, 138, 0.3), inset 0 2px 0 rgba(255,255,255,0.2); margin-bottom: 20px;
  }
  .lw-draws-focus span { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9; }
  .lw-draws-number { font-size: 3.5rem; font-weight: 900; line-height: 1; margin-top: 8px; text-shadow: 0 4px 10px rgba(0,0,0,0.3); }

  .lw-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .lw-stat-box {
    background: #f8fafc; border: 2px solid transparent; border-radius: 16px; padding: 12px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
    box-shadow: inset 4px 4px 8px rgba(15, 23, 42, 0.05), inset -4px -4px 8px rgba(255, 255, 255, 1);
  }
  .lw-stat-box span { font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase; }
  .lw-stat-box strong { font-size: 1.1rem; color: #0f172a; margin-top: 4px; font-weight: 800; }

  /* --- CLAIM SECTION & MAIN BUTTONS --- */
  .lw-claim-section {
    background: #f0f4f8; border-radius: 16px; padding: 16px; margin-bottom: 20px;
    box-shadow: inset 4px 4px 8px rgba(15,23,42,0.05), inset -4px -4px 8px rgba(255,255,255,1);
    border: 1px solid rgba(255,255,255,0.5);
  }
  .lw-stat-row { display: flex; justify-content: space-between; align-items: center; font-weight: 700; margin-bottom: 12px; color: #334155;}
  .lw-claim-value { font-size: 1.2rem; color: #3b82f6; }

  .btn-2060 {
    width: 100%; padding: 16px; border-radius: 16px; border: none; background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #ffffff; font-size: 1.1rem; font-weight: 800; letter-spacing: 1px; cursor: pointer;
    box-shadow: 0 8px 0 #0f172a, 0 15px 25px rgba(30, 58, 138, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); position: relative;
  }
  .btn-2060:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 10px 0 #0f172a, 0 20px 30px rgba(30, 58, 138, 0.4), inset 0 2px 0 rgba(255,255,255,0.2); }
  .btn-2060:active:not(:disabled) { transform: translateY(8px); box-shadow: 0 0px 0 #0f172a, 0 5px 10px rgba(30, 58, 138, 0.3), inset 0 2px 0 rgba(255,255,255,0.2); }
  .btn-2060:disabled { background: #94a3b8; box-shadow: 0 8px 0 #64748b; cursor: not-allowed; opacity: 0.8; }

  .lw-countdown-box {
    background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 16px;
    text-align: center; margin-top: 10px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1), 0 10px 20px rgba(15,23,42,0.2);
  }
  .lw-countdown-time { font-size: 2rem; font-weight: 900; font-family: monospace; color: #3b82f6; margin: 8px 0; }

  .lw-msg-box { padding: 12px 16px; border-radius: 12px; margin-top: 12px; font-weight: 700; font-size: 0.95rem; text-align: center; }
  .lw-msg-box.success { background: #dcfce7; color: #15803d; box-shadow: inset 0 0 0 2px #4ade80; }
  .lw-msg-box.error { background: #fee2e2; color: #b91c1c; box-shadow: inset 0 0 0 2px #f87171; }

  /* --- WHEEL 3D STYLES --- */
  .lw-wheel-outer-wrapper { width: 100%; max-width: 360px; margin: 0 auto; position: relative; display: flex; flex-direction: column; align-items: center; }
  .lw-wheel-rim {
    width: 100%; aspect-ratio: 1; border-radius: 50%; padding: 12px;
    background: linear-gradient(135deg, #f8fafc, #cbd5e1, #94a3b8, #f8fafc);
    box-shadow: 0 25px 50px rgba(15, 23, 42, 0.25), inset 0 4px 12px rgba(255,255,255,0.8); position: relative; z-index: 1;
    border: 4px solid #fff;
  }
  .lw-pointer { position: absolute; top: -18px; left: 50%; transform: translateX(-50%); z-index: 20; filter: drop-shadow(0px 6px 6px rgba(0,0,0,0.4)); }
  
  .lw-wheel-spin-area {
    width: 100%; height: 100%; border-radius: 50%; border: 3px solid #fff; box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
    transition: transform 10s cubic-bezier(0.1, 0, 0.1, 1.035);
    position: relative; overflow: hidden;
  }

  .lw-slice-text {
    position: absolute; top: 0; left: 50%; width: 100px; height: 50%; margin-left: -50px;
    transform-origin: bottom center; display: flex; flex-direction: column; align-items: center; padding-top: 25px; z-index: 5;
  }
  .lw-slice-text-inner { color: #fff; font-weight: 800; font-size: 0.9rem; text-align: center; text-shadow: 0 2px 5px rgba(0,0,0,0.8); line-height: 1.2; }
  .lw-slice-value { font-size: 1.3rem; margin-top: 4px; font-weight: 900; color: #f8fafc; text-shadow: 0 2px 6px rgba(0,0,0,0.9); }

  /* Circular Center 3D Button */
  .btn-2060-wheel {
    position: absolute; inset: 32%; border-radius: 50%; border: 4px solid #fff;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #ffffff; font-weight: 900; font-size: 1.2rem; letter-spacing: 1px;
    box-shadow: 0 8px 0 #0f172a, 0 15px 20px rgba(30, 58, 138, 0.4), inset 0 2px 0 rgba(255,255,255,0.2);
    cursor: pointer; display: grid; place-items: center; z-index: 15; transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); padding: 0;
  }
  .btn-2060-wheel:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 0 #0f172a, 0 20px 25px rgba(30, 58, 138, 0.5), inset 0 2px 0 rgba(255,255,255,0.2); filter: brightness(1.1); }
  .btn-2060-wheel:active:not(:disabled) { transform: translateY(6px); box-shadow: 0 2px 0 #0f172a, 0 5px 10px rgba(30, 58, 138, 0.3), inset 0 2px 0 rgba(255,255,255,0.2); }
  .btn-2060-wheel:disabled { background: #94a3b8; box-shadow: 0 8px 0 #64748b; cursor: not-allowed; transform: none; }
  .btn-2060-wheel.spinning { animation: pulseBtn 0.5s infinite; background: linear-gradient(135deg, #3b82f6, #60a5fa); box-shadow: 0 4px 0 #0f172a, 0 10px 15px rgba(30, 58, 138, 0.3); }

  .lw-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 24px; padding: 12px; background: #f8fafc; border-radius: 16px; width: 100%; box-shadow: inset 4px 4px 8px rgba(15, 23, 42, 0.05), inset -4px -4px 8px rgba(255, 255, 255, 1); }
  .lw-legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: #475569; }
  .lw-legend-color { width: 14px; height: 14px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

  .lw-wheel-tip { margin-top: 16px; padding: 12px; background: #eff6ff; color: #1e3a8a; border-radius: 12px; font-size: 0.85rem; text-align: center; border: 1px dashed #93c5fd; }

  /* --- HISTORY TABLE --- */
  .lw-history-card { margin-top: 10px; }
  .lw-history-title { margin: 0 0 16px 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
  .lw-empty-history { text-align: center; padding: 30px; color: #64748b; font-weight: 600; background: #f8fafc; border-radius: 16px; }
  .lw-table-responsive { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 12px; }
  .lw-table { width: 100%; border-collapse: collapse; min-width: 480px; }
  .lw-table th { text-align: left; background: #f1f5f9; color: #475569; padding: 12px 16px; font-size: 0.85rem; text-transform: uppercase; }
  .lw-table th:first-child { border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
  .lw-table th:last-child { border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
  .lw-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #334155; }
  .lw-table tr:hover td { background: #f8fafc; }
  
  .lw-entry-badge { padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; text-transform: capitalize; }
  .lw-entry-badge.free { background: #e0f2fe; color: #0284c7; }
  .lw-entry-badge.paid { background: #ede9fe; color: #6d28d9; }

  .lw-history-actions { text-align: center; margin-top: 16px; }
  .lw-btn-seemore {
    background: #f8fafc; border: 2px solid #3b82f6; color: #1e3a8a;
    padding: 10px 24px; border-radius: 12px; font-weight: 800; font-size: 0.9rem;
    cursor: pointer; transition: all 0.2s; box-shadow: 4px 4px 10px rgba(15, 23, 42, 0.05), -4px -4px 10px rgba(255, 255, 255, 1);
  }
  .lw-btn-seemore:hover {
    background: #3b82f6; color: #fff; transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(59, 130, 246, 0.3);
  }

  /* --- MODAL (3D NEUMORPHIC) --- */
  .lw-modal-overlay {
    position: fixed !important; top: 0; left: 0; right: 0; bottom: 0;
    width: 100vw; height: 100vh;
    background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px);
    display: flex; justify-content: center; align-items: center;
    z-index: 999999 !important; margin: 0; padding: 0;
  }
  .lw-modal-content {
    background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    padding: 40px; border-radius: 28px; text-align: center;
    box-shadow: 20px 20px 60px rgba(15, 23, 42, 0.2), -20px -20px 60px rgba(255, 255, 255, 0.9), inset 0 0 0 2px rgba(255, 255, 255, 0.5);
    position: relative; width: 90%; max-width: 420px; border: 1px solid #fff;
  }
  .lw-modal-close {
    position: absolute; top: 15px; right: 20px; background: transparent; border: none;
    font-size: 28px; font-weight: 700; color: #94a3b8; cursor: pointer; line-height: 1; transition: color 0.2s;
  }
  .lw-modal-close:hover { color: #1e3a8a; }
  .lw-modal-title { margin: 0 0 16px 0; font-size: 1.8rem; color: #1e3a8a; font-weight: 900; }
  .lw-modal-result-text {
    font-size: 2.2rem; font-weight: 900; color: #3b82f6; margin-bottom: 24px;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
  }
  .lw-modal-footer { font-size: 0.85rem; color: #64748b; font-weight: 600; }

  /* --- ANIMATIONS --- */
  @keyframes spin { 100% { transform: rotate(360deg); } }
  
  @keyframes pulseFocus { 0% { transform: scale(1); box-shadow: 0 10px 25px rgba(30,58,138,0.3); } 50% { transform: scale(0.98); box-shadow: 0 5px 15px rgba(30,58,138,0.2); } 100% { transform: scale(1); box-shadow: 0 10px 25px rgba(30,58,138,0.3); } }
  .pulse-soft { animation: pulseFocus 3s infinite ease-in-out; }
  .pulse-fast { animation: pulseFocus 0.6s infinite ease-in-out; }
  
  @keyframes pulseBtn { 0% { transform: scale(1); } 50% { transform: scale(0.95); box-shadow: 0 2px 0 #0f172a, 0 5px 10px rgba(30, 58, 138, 0.3); } 100% { transform: scale(1); } }
  
  @keyframes bounceIn { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
  .bounce-in { animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .fadeIn { animation: fadeIn 0.3s ease-out forwards; }

  /* --- MASSIVE MOBILE RESPONSIVENESS OVERHAUL --- */
  @media (max-width: 600px) {
    .fullscreen-wrapper { padding: 20px 10px; }
    .lw-card { padding: 16px; border-radius: 20px; }
    .lw-grid { gap: 16px; }
    .lw-col { flex: 1 1 100%; gap: 16px; }

    /* Header Shrink */
    .lw-title { font-size: 2.2rem; }
    .lw-badge { padding: 5px 14px; font-size: 0.8rem; }

    /* Left Stats Column Shrink */
    .lw-draws-focus { padding: 12px; margin-bottom: 12px; border-radius: 16px; }
    .lw-draws-focus span { font-size: 0.85rem; }
    .lw-draws-number { font-size: 2.8rem; margin-top: 4px; }
    
    .lw-stat-grid { gap: 8px; margin-bottom: 16px; }
    .lw-stat-box { padding: 10px 6px; border-radius: 12px; }
    .lw-stat-box span { font-size: 0.65rem; }
    .lw-stat-box strong { font-size: 1rem; }

    .lw-claim-section { padding: 12px; margin-bottom: 16px; }
    .lw-stat-row span { font-size: 0.85rem; }
    .lw-claim-value { font-size: 1.1rem; }
    .btn-2060 { padding: 14px; font-size: 1rem; border-radius: 14px; box-shadow: 0 6px 0 #0f172a, 0 10px 15px rgba(30, 58, 138, 0.3); }

    /* WHEEL SHRINK (Fixes the giant wheel issue) */
    .lw-wheel-outer-wrapper { max-width: 250px; } /* CRITICAL */
    .lw-wheel-rim { padding: 8px; border-width: 3px; }
    .lw-pointer { top: -12px; transform: translateX(-50%) scale(0.7); }
    .btn-2060-wheel { font-size: 1rem; border-width: 3px; inset: 30%; box-shadow: 0 6px 0 #0f172a, 0 10px 15px rgba(30, 58, 138, 0.3); }
    .lw-slice-text { padding-top: 15px; font-size: 0.75rem; }
    .lw-slice-value { font-size: 1.1rem; }

    /* Wheel Legend Shrink */
    .lw-legend { margin-top: 16px; padding: 10px; gap: 8px; }
    .lw-legend-item { font-size: 0.75rem; }
    .lw-legend-color { width: 12px; height: 12px; }

    /* History Table Shrink */
    .lw-history-card { margin-top: 6px; padding: 16px 12px; }
    .lw-history-title { font-size: 1.2rem; margin-bottom: 12px; }
    .lw-table { min-width: 380px; }
    .lw-table th, .lw-table td { padding: 10px 8px; font-size: 0.75rem; }
    .lw-entry-badge { padding: 2px 6px; font-size: 0.65rem; }
    .lw-btn-seemore { padding: 8px 16px; font-size: 0.85rem; }
  }
`;