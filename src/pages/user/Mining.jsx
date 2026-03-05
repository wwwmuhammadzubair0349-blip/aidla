import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// ─────────────────────────────────────────────────────────────────
// 🔧 SETTINGS (unchanged)
// ─────────────────────────────────────────────────────────────────
const COIN_DECIMALS = 2;
const TRUCK_INTERVAL_SEC = 30;
const fmtCoins = (n) => Number(n).toFixed(COIN_DECIMALS);
const fmtShort = (n) => Number(n).toFixed(2);

function msToHMS(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sc = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}h ${m}m ${sc}s` : `${m}m ${sc}s`;
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: "Asia/Dubai", day: "2-digit", month: "short",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

// ── Odometer Digit (simplified, but kept) ─────────────────────────
function OdometerDigit({ digit }) {
  const digits = [0,1,2,3,4,5,6,7,8,9];
  return (
    <span className="od-col">
      <span className="od-reel" style={{ transform: `translateY(-${digit * 10}%)` }}>
        {digits.map(d => <span key={d} className="od-d">{d}</span>)}
      </span>
    </span>
  );
}

function OdometerCounter({ value, className = "" }) {
  const str = String(Math.floor(Math.abs(value))).padStart(4, "0");
  const dec = fmtCoins(value).split(".")[1] || "00";
  return (
    <div className={`od-wrap ${className}`}>
      <div className="od-int">
        {str.split("").map((d, i) => <OdometerDigit key={i} digit={parseInt(d)} />)}
      </div>
      <span className="od-dot">.</span>
      <div className="od-dec">
        {dec.split("").map((d, i) => <OdometerDigit key={i} digit={parseInt(d)} />)}
      </div>
    </div>
  );
}

// ── New Minimal Cat Scene (redesigned) ────────────────────────────
function MinimalCatScene({ isMining, isDone }) {
  const [phase, setPhase] = useState("hidden");
  const [coinArcs, setCoinArcs] = useState([]);
  const [grassOffset, setGrassOffset] = useState(0);
  const cycleRef = useRef(null);
  const firstRef = useRef(null);
  const arcRef = useRef(null);
  const arcIdRef = useRef(0);

  const dubaiHour = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dubai", hour: "numeric", hour12: false });
  const hour = parseInt(dubaiHour);
  const isNight = hour < 6 || hour >= 20;
  const isSunset = (hour >= 17 && hour < 20) || (hour >= 5 && hour < 7);

  const skyGrad = isNight
    ? "linear-gradient(180deg, #0b1120 0%, #1a2639 100%)"
    : isSunset
    ? "linear-gradient(180deg, #f97316 0%, #fdba74 50%, #fef9c3 100%)"
    : "linear-gradient(180deg, #0ea5e9 0%, #7dd3fc 60%, #f0f9ff 100%)";

  // Grass sway
  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.04;
      setGrassOffset(Math.sin(t) * 2);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Coin arc spawner
  const spawnArc = useCallback(() => {
    if (!isMining || isDone) return;
    const id = arcIdRef.current++;
    const arc = {
      id, x: 45 + Math.random() * 12, startY: 55,
      vx: (Math.random() - 0.5) * 4, vy: -8 - Math.random() * 5,
      rot: Math.random() * 360, size: 0.6 + Math.random() * 0.5
    };
    setCoinArcs(prev => [...prev.slice(-12), arc]);
    setTimeout(() => setCoinArcs(prev => prev.filter(c => c.id !== id)), 1400);
  }, [isMining, isDone]);

  useEffect(() => {
    if (!isMining || isDone) { clearInterval(arcRef.current); return; }
    arcRef.current = setInterval(spawnArc, 280);
    return () => clearInterval(arcRef.current);
  }, [isMining, isDone, spawnArc]);

  // Truck cycle
  const runCycle = useCallback(() => {
    setPhase("arriving");
    setTimeout(() => setPhase("loading"), 1300);
    setTimeout(() => setPhase("leaving"), 3800);
    setTimeout(() => setPhase("hidden"), 6200);
  }, []);

  useEffect(() => {
    if (!isMining || isDone) {
      setPhase("hidden");
      clearTimeout(firstRef.current);
      clearInterval(cycleRef.current);
      return;
    }
    firstRef.current = setTimeout(() => {
      runCycle();
      cycleRef.current = setInterval(runCycle, TRUCK_INTERVAL_SEC * 1000);
    }, 8000);
    return () => { clearTimeout(firstRef.current); clearInterval(cycleRef.current); };
  }, [isMining, isDone, runCycle]);

  const truckVisible = phase !== "hidden";
  const catState = isDone ? "idle" : phase === "loading" ? "loading" : "mining";

  return (
    <div className="mcs-wrap" style={{ background: skyGrad }}>
      {/* Minimal horizon line */}
      <div className="mcs-horizon" />

      {/* Stars (night only) */}
      {isNight && (
        <div className="mcs-stars">
          {Array.from({length: 16}).map((_,i) => (
            <div key={i} className="mcs-star" style={{
              left: `${5 + (i * 7) % 90}%`,
              top: `${5 + (i * 5) % 40}%`,
              animationDelay: `${(i * 0.2) % 2}s`,
            }} />
          ))}
        </div>
      )}

      {/* Sun / Moon */}
      {!isNight && <div className="mcs-sun" style={{ top: isSunset ? "30%" : "12%", background: isSunset ? "#f97316" : "#fbbf24" }} />}
      {isNight && <div className="mcs-moon">🌙</div>}

      {/* Ground */}
      <div className="mcs-ground">
        <div className="mcs-ground-fill" style={{ transform: `translateX(${grassOffset}px)` }} />
      </div>

      {/* Coin arcs */}
      {coinArcs.map(arc => (
        <div key={arc.id} className="mcs-arc-coin" style={{
  left: `${arc.x}%`, bottom: "35%",
  fontSize: `${arc.size}rem`,
  animation: `mcsCoinArc 1.3s cubic-bezier(0.25,0.46,0.45,0.94) forwards`,
  '--vx': `${arc.vx * 18}px`,
  '--rot': `${arc.rot}deg`
}}>🪙</div>
      ))}

      {/* Coin pile */}
      {isMining && (
        <div className="mcs-pile">
          <span>🪙🪙🪙</span>
          <div className="mcs-pile-glow" />
        </div>
      )}

      {/* Truck (minimal) */}
      {truckVisible && (
        <div className={`mcs-truck mcs-truck-${phase}`}>
          <div className="mcs-truck-body">
            <span className="mcs-truck-emoji">🚛</span>
            <div className="mcs-truck-wheels">
              <div className={`mcs-wheel ${phase !== "hidden" ? "mcs-wheel-spin" : ""}`} />
              <div className={`mcs-wheel ${phase !== "hidden" ? "mcs-wheel-spin" : ""}`} />
            </div>
            {phase === "loading" && (
              <div className="mcs-truck-coins">
                <span>🪙</span><span>🪙</span><span>🪙</span>
              </div>
            )}
          </div>
          {(phase === "arriving" || phase === "leaving") && (
            <div className="mcs-exhaust">
              <div className="mcs-puff" />
              <div className="mcs-puff" />
            </div>
          )}
          {phase === "loading" && <div className="mcs-bubble">Loading...</div>}
        </div>
      )}

      {/* Cat (minimal SVG) */}
      <div className={`mcs-cat mcs-cat-${catState}`}>
        <MinimalCatSVG state={catState} />
        {catState === "mining"  && <span className="mcs-tool mcs-pickaxe">⛏️</span>}
        {catState === "loading" && <span className="mcs-tool mcs-shovel">🪣</span>}
        {catState === "idle"    && <span className="mcs-zzz">💤</span>}
      </div>

      {/* Dust */}
      {isMining && !isDone && (
        <div className="mcs-dust">
          <div className="mcs-dust-puff" />
          <div className="mcs-dust-puff" />
        </div>
      )}
    </div>
  );
}

function MinimalCatSVG({ state }) {
  const happy  = state === "loading";
  const sleepy = state === "idle";
  return (
    <svg viewBox="0 0 80 76" className="mcs-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="30" r="16" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
      <ellipse cx="40" cy="56" rx="20" ry="16" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
      <polygon points="25,20 20,7 33,17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
      <polygon points="55,20 60,7 47,17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
      <rect x="25" y="9" width="30" height="9" rx="4" fill="#f59e0b" />
      <circle cx="35" cy="30" r="3" fill="#1e293b" />
      <circle cx="45" cy="30" r="3" fill="#1e293b" />
      {happy && <path d="M32 34 Q40 38 48 34" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />}
      {sleepy && <line x1="32" y1="34" x2="48" y2="34" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />}
      {!happy && !sleepy && <circle cx="36" cy="29" r="1" fill="white" />}
      {!happy && !sleepy && <circle cx="46" cy="29" r="1" fill="white" />}
      <ellipse cx="40" cy="35" rx="2" ry="1.4" fill="#fda4af" />
      <path d="M38 36 Q40 37 42 36" stroke="#94a3b8" strokeWidth="1" />
    </svg>
  );
}

// ── Ferrari Cinematic (sleeker version) ──────────────────────────
function FerrariCinematic({ data, onDone }) {
  const [phase, setPhase] = useState("enter");
  const sparks = useRef(
    Array.from({ length: 12 }, () => ({
      left: `${20 + Math.random() * 60}%`,
      top: `${20 + Math.random() * 50}%`,
      delay: `${(Math.random() * 1).toFixed(2)}s`,
    }))
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 1200);
    const t2 = setTimeout(() => setPhase("exit"), 4200);
    const t3 = setTimeout(() => onDone(), 5000);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={`fc-overlay fc-phase-${phase}`} onClick={onDone}>
      <div className="fc-vignette" />
      <div className="fc-speed-lines">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="fc-line" style={{ top: `${3 + i * 4}%`, animationDelay: `${(i * 0.04).toFixed(2)}s` }} />
        ))}
      </div>
      <div className="fc-road">
        <div className="fc-road-line" />
        <div className="fc-road-line" />
        <div className="fc-road-line" />
      </div>
      <div className={`fc-car-wrap fc-car-${phase}`}>
        <FerrariSVG />
        {(phase === "enter" || phase === "exit") && (
          <>
            <div className="fc-wheel-blur fc-wheel-blur-rear" />
            <div className="fc-wheel-blur fc-wheel-blur-front" />
          </>
        )}
      </div>
      {phase === "show" && (
        <div className="fc-text-wrap">
          <div className="fc-badge">BOOSTER ACTIVATED</div>
          <div className="fc-mult">{data?.multiplier}×</div>
          <div className="fc-boost-name">{data?.icon} {data?.name}</div>
          <div className="fc-tap-hint">tap anywhere</div>
        </div>
      )}
      {phase === "show" && sparks.current.map((s, i) => (
        <div key={i} className="fc-spark" style={{ left: s.left, top: s.top, animationDelay: s.delay }}>✨</div>
      ))}
      <div className={`fc-countdown ${phase === "show" ? "fc-countdown-run" : ""}`} />
    </div>
  );
}

// FerrariSVG (simplified, same visual but cleaner)
function FerrariSVG() {
  return (
    <svg viewBox="0 0 520 160" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="ferrariGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e11d48" />
          <stop offset="50%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
      </defs>
      <path d="M70,120 L70,80 Q90,40 150,30 L370,30 Q430,40 450,80 L450,120 Z" fill="url(#ferrariGrad)" stroke="#881337" strokeWidth="2" />
      <circle cx="150" cy="120" r="25" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
      <circle cx="370" cy="120" r="25" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
      <circle cx="150" cy="120" r="10" fill="#cbd5e1" />
      <circle cx="370" cy="120" r="10" fill="#cbd5e1" />
      <rect x="200" y="80" width="120" height="20" fill="#334155" rx="4" />
    </svg>
  );
}

// ── Streak Badge (modern) ─────────────────────────────────────────
function StreakBadge({ count }) {
  if (!count || count < 1) return null;
  const hot = count >= 7;
  const warm = count >= 3;
  return (
    <div className={`streak-badge ${hot ? "streak-hot" : warm ? "streak-warm" : "streak-cool"}`}>
      <span className="streak-fire">{hot ? "🔥" : warm ? "🌟" : "⚡"}</span>
      <span className="streak-num">{count}</span>
      <span className="streak-label">day streak</span>
    </div>
  );
}

// ── Floating Claim Button (sleek) ─────────────────────────────────
function FloatingClaimBtn({ show, earned, claiming, onClick }) {
  if (!show) return null;
  return (
    <div className="fcb-wrap">
      <button className="fcb-btn" onClick={onClick} disabled={claiming}>
        <span className="fcb-icon">🎁</span>
        <div className="fcb-text">
          <span className="fcb-action">{claiming ? "Processing..." : "Claim Now"}</span>
          <span className="fcb-amount">+{fmtShort(earned)} coins</span>
        </div>
        <span className="fcb-arrow">→</span>
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function Mining() {
  const navigate = useNavigate();

  const [mounted, setMounted]           = useState(false);
  const [loading, setLoading]           = useState(true);
  const [msg, setMsg]                   = useState({ text: "", type: "" });
  const [modalData, setModalData]       = useState(null);
  const [ferrariData, setFerrariData]   = useState(null);

  const [settings, setSettings]         = useState(null);
  const [session, setSession]           = useState(null);
  const [profile, setProfile]           = useState(null);
  const [history, setHistory]           = useState([]);
  const [boosters, setBoosters]         = useState([]);
  const [myBoosters, setMyBoosters]     = useState([]);
  const [streak, setStreak]             = useState(0);
  const [showShop, setShowShop]         = useState(false);
  const [showHistory, setShowHistory]   = useState(false);

  const [buying, setBuying]             = useState(null);
  const [claiming, setClaiming]         = useState(false);
  const [starting, setStarting]         = useState(false);

  const [nowMs, setNowMs] = useState(Date.now());
  const rafRef = useRef(null);
  const tick = useCallback(() => { setNowMs(Date.now()); rafRef.current = requestAnimationFrame(tick); }, []);
  useEffect(() => { rafRef.current = requestAnimationFrame(tick); return () => cancelAnimationFrame(rafRef.current); }, [tick]);

  const loadAll = useCallback(async (silent = false) => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) { setMsg({ text: "Please login first.", type: "err" }); setLoading(false); return; }
    const uid = auth.user.id;

    const [settRes, profRes, sessRes, histRes, boostCatRes, myBoostRes] = await Promise.all([
      supabase.from("mining_settings").select("*").eq("id", 1).single(),
      supabase.from("users_profiles").select("*").eq("user_id", uid).single(),
      supabase.from("mining_sessions").select("*").eq("user_id", uid)
        .in("status", ["active","completed"]).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("mining_sessions")
        .select("id,started_at,actual_coins,effective_rate,duration_hours,status,claimed_at")
        .eq("user_id", uid).eq("status","claimed").order("claimed_at", { ascending: false }).limit(10),
      supabase.from("mining_boosters").select("*").eq("enabled", true).order("price_coins"),
      supabase.from("mining_user_boosters").select("*, mining_boosters(name,multiplier,icon)")
        .eq("user_id", uid).or("expires_at.is.null,expires_at.gt." + new Date().toISOString()),
    ]);

    if (settRes.data)  setSettings(settRes.data);
    if (profRes.data)  setProfile(profRes.data);
    setSession(sessRes.data || null);
    setHistory(histRes.data || []);
    setBoosters(boostCatRes.data || []);
    setMyBoosters(myBoostRes.data || []);

    if (histRes.data) {
      let s = 0;
      const now = Date.now();
      for (let i = 0; i < histRes.data.length; i++) {
        const claimedAt = new Date(histRes.data[i].claimed_at).getTime();
        const hoursSince = (now - claimedAt) / 3600000;
        if (i === 0 && hoursSince < 48) s++;
        else if (i > 0) s++;
        else break;
      }
      setStreak(s);
    }

    if (!silent) setLoading(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    setLoading(true);
    loadAll();
    const iv = setInterval(() => loadAll(true), 5000);
    return () => clearInterval(iv);
  }, [loadAll]);

  useEffect(() => {
    let timer;
    if (modalData) timer = setTimeout(() => setModalData(null), 5000);
    return () => clearTimeout(timer);
  }, [modalData]);

  const effectiveRate = useMemo(() => {
    if (!settings) return 0;
    const base = Number(settings.base_rate_per_hour || 0);
    const mult = myBoosters.reduce((a, b) => a * Number(b.mining_boosters?.multiplier || 1), 1);
    return base * mult;
  }, [settings, myBoosters]);

  const liveDur = settings?.session_duration_hours ?? 12;

  const sd = useMemo(() => {
    if (!session || session.status === "claimed") return null;
    const startMs    = new Date(session.started_at).getTime();
    const durationMs = liveDur * 3600 * 1000;
    const elapsed    = Math.min(nowMs - startMs, durationMs);
    const earned     = (effectiveRate / 3600) * (elapsed / 1000);
    const remaining  = Math.max((startMs + durationMs) - nowMs, 0);
    const pct        = Math.min((elapsed / durationMs) * 100, 100);
    const done       = nowMs >= startMs + durationMs;
    return { earned, remaining, pct, done };
  }, [session, nowMs, effectiveRate, liveDur]);

  const showMsg = (text, type = "ok", ms = 4000) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), ms);
  };

  const onStart = async () => {
    setStarting(true);
    const { data, error } = await supabase.rpc("mining_start");
    setStarting(false);
    if (error || !data?.ok) { showMsg(error?.message || data?.error || "Failed", "err"); return; }
    await loadAll();
  };

  const onClaim = async () => {
    setClaiming(true);
    setMsg({ text: "", type: "" });
    const { data, error } = await supabase.rpc("mining_claim", { p_session_id: session.id });
    setClaiming(false);
    if (error || !data?.ok) { showMsg(error?.message || data?.error || "Claim failed", "err"); return; }
    await loadAll();
    setModalData({ type: "claim", amount: data.coins_claimed });
  };

  const onBuyBooster = async (b) => {
    if (Number(profile?.total_aidla_coins || 0) < b.price_coins) { showMsg("Insufficient coins.", "err"); return; }
    setBuying(b.id);
    setMsg({ text: "", type: "" });
    const { data, error } = await supabase.rpc("mining_buy_booster", { p_booster_id: b.id });
    setBuying(null);
    if (error || !data?.ok) { showMsg(error?.message || data?.error || "Purchase failed", "err"); return; }
    await loadAll();
    setFerrariData({ name: b.name, icon: b.icon, multiplier: b.multiplier });
    setModalData({ type: "booster", name: b.name, icon: b.icon });
  };

  const balance   = Number(profile?.total_aidla_coins || 0);
  const hasActive = !!session && session.status === "active";
  const isDone    = sd?.done ?? false;

  // Claim modal
  const renderModal = () => {
    if (!modalData || modalData.type !== "claim" || !mounted) return null;
    return createPortal(
      <div className="mn-modal-overlay" onClick={() => setModalData(null)}>
        <div className="mn-modal-content" onClick={e => e.stopPropagation()}>
          <button className="mn-modal-close" onClick={() => setModalData(null)}>×</button>
          <div className="mn-modal-emoji">🎁</div>
          <h2 className="mn-modal-title">Claimed!</h2>
          <div className="mn-modal-result-text">+{fmtShort(modalData.amount)} coins</div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <style>{CSS}</style>

      {ferrariData && mounted && createPortal(
        <FerrariCinematic data={ferrariData} onDone={() => setFerrariData(null)} />,
        document.body
      )}

      {renderModal()}

      {mounted && isDone && hasActive && createPortal(
        <FloatingClaimBtn show={isDone && hasActive} earned={sd?.earned ?? 0} claiming={claiming} onClick={onClaim} />,
        document.body
      )}

      <div className="mn-page">
        {/* Header */}
        <header className="mn-header">
          <div className="mn-header-left">
            <div className="mn-logo">⛏️</div>
            <div>
              <h1 className="mn-title">Mining</h1>
              <div className="mn-subtitle">Earn while you wait</div>
            </div>
          </div>
          <div className="mn-header-right">
            <StreakBadge count={streak} />
            <div className="mn-balance">
              <span>💰</span>
              <strong>{fmtShort(balance)}</strong>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="mn-loader">Loading…</div>
        ) : !settings?.enabled ? (
          <div className="mn-offline">Mining is currently offline.</div>
        ) : (
          <>
            {/* Main Mining Card */}
            <div className="mn-card mn-card-main">
              <MinimalCatScene isMining={hasActive} isDone={isDone} />
              <div className="mn-card-content">
                {!hasActive ? (
                  <div className="mn-idle">
                    <div className="mn-stats">
                      <div className="mn-stat">
                        <span className="mn-stat-label">Duration</span>
                        <span className="mn-stat-value">{liveDur}h</span>
                      </div>
                      <div className="mn-stat">
                        <span className="mn-stat-label">Rate</span>
                        <span className="mn-stat-value">{fmtShort(effectiveRate)}/hr</span>
                      </div>
                      <div className="mn-stat">
                        <span className="mn-stat-label">Est. total</span>
                        <span className="mn-stat-value">~{fmtShort(effectiveRate * liveDur)}</span>
                      </div>
                    </div>
                    {myBoosters.length > 0 && (
                      <div className="mn-booster-tag">
                        ⚡ {myBoosters.map(b => b.mining_boosters?.name).join(", ")}
                      </div>
                    )}
                    <button onClick={onStart} disabled={starting} className="mn-btn mn-btn-primary">
                      {starting ? "Starting..." : "Start Mining"}
                    </button>
                  </div>
                ) : (
                  <div className="mn-active">
                    <div className="mn-status">
                      <span className={`mn-status-badge ${isDone ? "done" : "live"}`}>
                        {isDone ? "Completed" : "Mining"}
                      </span>
                      <span className="mn-rate">{fmtShort(effectiveRate)}/hr</span>
                    </div>

                    <OdometerCounter value={sd?.earned ?? 0} className={isDone ? "od-done" : ""} />

                    <div className="mn-progress">
                      <div className="mn-progress-bar">
                        <div className="mn-progress-fill" style={{ width: `${sd?.pct ?? 0}%` }} />
                      </div>
                      <div className="mn-progress-info">
                        <span>{Math.floor(sd?.pct ?? 0)}%</span>
                        <span>{isDone ? "Ready to claim!" : msToHMS(sd?.remaining ?? 0)}</span>
                      </div>
                    </div>

                    <div className="mn-meta">
                      <div>Started {fmtDate(session.started_at)}</div>
                      <div>{liveDur}h session</div>
                    </div>

                    {isDone && (
                      <button onClick={onClaim} disabled={claiming} className="mn-btn mn-btn-claim">
                        {claiming ? "Processing..." : `Claim ${fmtShort(sd?.earned ?? 0)} coins`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {msg.text && (
              <div className={`mn-message ${msg.type === "err" ? "error" : "success"}`}>
                {msg.type === "err" ? "⚠️" : "✅"} {msg.text}
              </div>
            )}

            {/* Active Boosters */}
            {myBoosters.length > 0 && (
              <div className="mn-card">
                <div className="mn-card-header">
                  <h3>Active Boosters</h3>
                  <span className="mn-badge">{myBoosters.length}</span>
                </div>
                <div className="mn-booster-list">
                  {myBoosters.map(b => (
                    <div key={b.id} className="mn-booster-item">
                      <div className="mn-booster-info">
                        <span className="mn-booster-icon">{b.mining_boosters?.icon || "⚡"}</span>
                        <div>
                          <div className="mn-booster-name">{b.mining_boosters?.name}</div>
                          <div className="mn-booster-expiry">{b.expires_at ? `Expires ${fmtDate(b.expires_at)}` : "Permanent"}</div>
                        </div>
                      </div>
                      <span className="mn-booster-mult">{b.mining_boosters?.multiplier}×</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booster Shop */}
            <div className="mn-card">
              <div className="mn-card-header">
                <h3>Booster Shop</h3>
                <button onClick={() => navigate("/user/wallet/invite")} className="mn-btn mn-btn-ghost">
                  Invite & Earn
                </button>
              </div>
              {boosters.length === 0 ? (
                <div className="mn-empty">No boosters available.</div>
              ) : (
                <div className="mn-shop-grid">
                  {boosters.map(b => {
                    const owned = myBoosters.some(mb => mb.booster_id === b.id);
                    const canAfford = balance >= b.price_coins;
                    return (
                      <div key={b.id} className={`mn-shop-item ${owned ? "owned" : ""} ${!canAfford && !owned ? "poor" : ""}`}>
                        <div className="mn-shop-icon">{b.icon || "⚡"}</div>
                        <div className="mn-shop-name">{b.name}</div>
                        <div className="mn-shop-tags">
                          <span className="mn-tag">{b.multiplier}×</span>
                          <span className="mn-tag">{b.duration_hours ? `${b.duration_hours}h` : "∞"}</span>
                        </div>
                        <div className="mn-shop-price">💰 {b.price_coins}</div>
                        {owned ? (
                          <div className="mn-shop-owned-badge">Active</div>
                        ) : (
                          <button
                            onClick={() => onBuyBooster(b)}
                            disabled={buying === b.id || !canAfford}
                            className={`mn-btn mn-btn-shop ${!canAfford ? "disabled" : ""}`}
                          >
                            {buying === b.id ? "Buying..." : canAfford ? "Buy" : "Need coins"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mn-card">
                <button className="mn-card-header mn-card-toggle" onClick={() => setShowHistory(p => !p)}>
                  <h3>Mining History</h3>
                  <span className="mn-chevron" style={{ transform: showHistory ? "rotate(180deg)" : "none" }}>▼</span>
                </button>
                {showHistory && (
                  <div className="mn-history-list">
                    {history.map(h => (
                      <div key={h.id} className="mn-history-item">
                        <div>
                          <div className="mn-history-date">{fmtDate(h.claimed_at)}</div>
                          <div className="mn-history-meta">{h.duration_hours}h · {fmtShort(h.effective_rate)}/hr</div>
                        </div>
                        <div className="mn-history-amount">+{fmtShort(h.actual_coins)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isDone && <div style={{ height: 80 }} />}
          </>
        )}
      </div>
    </>
  );
}

// ── New CSS (clean, modern, professional) ─────────────────────────
const CSS = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.mn-page {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8fafc;
  min-height: 100vh;
  padding: 16px 12px 24px;
  max-width: 500px;
  margin: 0 auto;
  color: #0f172a;
}
/* Allow header to wrap on small screens */
.mn-header {
  flex-wrap: wrap;
  row-gap: 8px;
}

/* Let streak and balance wrap inside the right container */
.mn-header-right {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

/* Prevent balance text from breaking layout */
.mn-balance {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Header */
.mn-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.mn-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.mn-logo {
  font-size: 2rem;
  line-height: 1;
}
.mn-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
}
.mn-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 2px;
}
.mn-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mn-balance {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  padding: 6px 14px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}

/* Streak badge */
.streak-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 40px;
  font-size: 0.7rem;
  font-weight: 700;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}
.streak-cool { color: #2563eb; }
.streak-warm { color: #b45309; }
.streak-hot { color: #dc2626; }
.streak-fire { font-size: 0.8rem; }
.streak-num { font-size: 0.8rem; }
.streak-label { font-size: 0.6rem; opacity: 0.7; margin-left: 2px; }

/* Loader */
.mn-loader {
  text-align: center;
  padding: 60px 0;
  color: #64748b;
}

/* Offline */
.mn-offline {
  text-align: center;
  padding: 60px 0;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

/* Cards */
.mn-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}
.mn-card-main {
  padding: 0;
}
.mn-card-content {
  padding: 20px 16px;
}
.mn-card-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
  font-weight: 600;
}
.mn-card-header h3 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: #64748b;
}
.mn-card-toggle {
  width: 100%;
  cursor: pointer;
  background: none;
  border: none;
  font: inherit;
  text-align: left;
}
.mn-chevron {
  transition: transform 0.2s;
  font-size: 0.7rem;
  color: #94a3b8;
}

/* Minimal Cat Scene */
.mcs-wrap {
  position: relative;
  height: 170px;
  overflow: hidden;
  background: linear-gradient(180deg, #0ea5e9 0%, #7dd3fc 100%);
}
.mcs-horizon {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255,255,255,0.3);
}
.mcs-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.mcs-star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle 2s infinite;
}
@keyframes twinkle {
  0%,100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}
.mcs-sun, .mcs-moon {
  position: absolute;
  right: 10%;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 20px #fbbf24;
}
.mcs-moon {
  background: transparent;
  font-size: 1.5rem;
  line-height: 1;
}
.mcs-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: #16a34a;
}
.mcs-ground-fill {
  height: 100%;
  background: repeating-linear-gradient(90deg, #15803d 0px, #15803d 20px, #16a34a 20px, #16a34a 40px);
  width: 200%;
  transition: transform 0.05s linear;
}
.mcs-arc-coin {
  position: absolute;
  z-index: 5;
  animation: mcsCoinArc 1.3s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
}
@keyframes mcsCoinArc {
  0% { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translate(var(--vx, 20px), -50px) rotate(var(--rot, 360deg)) scale(0.3); opacity: 0; }
}
.mcs-pile {
  position: absolute;
  bottom: 30px;
  right: 16px;
  font-size: 1.2rem;
  filter: drop-shadow(0 4px 4px rgba(0,0,0,0.1));
}
.mcs-pile-glow {
  position: absolute;
  inset: -4px;
  background: radial-gradient(circle, rgba(245,158,11,0.2), transparent);
  border-radius: 50%;
}
.mcs-truck {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  transition: left 0.3s;
}
.mcs-truck-arriving { animation: truckIn 1.3s forwards; }
@keyframes truckIn { from{ left: 110%; } to{ left: 56%; } }
.mcs-truck-loading { left: 56%; }
.mcs-truck-leaving { animation: truckOut 2s forwards; }
@keyframes truckOut { from{ left: 56%; } to{ left: 110%; } }
.mcs-truck-body {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.mcs-truck-emoji { font-size: 2rem; }
.mcs-truck-wheels {
  display: flex;
  gap: 8px;
  margin-top: -4px;
}
.mcs-wheel {
  width: 10px; height: 10px;
  background: #1e293b;
  border-radius: 50%;
}
.mcs-wheel-spin { animation: spin 0.4s linear infinite; }
@keyframes spin { to{ transform: rotate(360deg); } }
.mcs-truck-coins {
  position: absolute;
  top: -16px;
  left: 20px;
  display: flex;
  gap: 2px;
  font-size: 0.8rem;
  animation: bounce 0.3s infinite alternate;
}
@keyframes bounce { from{ transform: translateY(0); } to{ transform: translateY(-5px); } }
.mcs-exhaust {
  position: absolute;
  left: -12px;
  bottom: 8px;
  display: flex;
  gap: 4px;
}
.mcs-puff {
  width: 8px; height: 8px;
  background: rgba(148,163,184,0.4);
  border-radius: 50%;
  animation: puff 0.8s infinite;
}
@keyframes puff {
  0% { transform: scale(0.5) translate(0,0); opacity: 0.6; }
  100% { transform: scale(2) translate(-6px, -4px); opacity: 0; }
}
.mcs-bubble {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 0.65rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.mcs-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: white;
}
.mcs-cat {
  position: absolute;
  bottom: 28px;
  left: 44%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
}
.mcs-svg {
  width: 60px;
  height: 60px;
}
.mcs-cat-mining { animation: catMine 0.4s infinite alternate; }
@keyframes catMine { from{ transform: translateX(-50%) translateY(0); } to{ transform: translateX(-50%) translateY(-3px); } }
.mcs-cat-loading { animation: catLoad 0.3s infinite alternate; }
@keyframes catLoad { from{ transform: translateX(-50%) translateY(0); } to{ transform: translateX(-50%) translateY(-5px); } }
.mcs-cat-idle { animation: catIdle 2s infinite; }
@keyframes catIdle { 0%,100%{ transform: translateX(-50%) translateY(0); } 50%{ transform: translateX(-50%) translateY(-2px); } }
.mcs-tool {
  position: absolute;
  font-size: 1.2rem;
  bottom: 12px;
  right: -16px;
}
.mcs-pickaxe { animation: pickSwing 0.4s infinite alternate; transform-origin: bottom left; }
@keyframes pickSwing { from{ transform: rotate(-20deg); } to{ transform: rotate(10deg); } }
.mcs-shovel { animation: shovelToss 0.3s infinite alternate; }
@keyframes shovelToss { from{ transform: rotate(-10deg) translateY(0); } to{ transform: rotate(15deg) translateY(-5px); } }
.mcs-zzz {
  position: absolute;
  bottom: 40px;
  right: -12px;
  font-size: 0.9rem;
  animation: zzz 2s infinite;
}
@keyframes zzz { 0%,100%{ transform: translateY(0); opacity: 0.6; } 50%{ transform: translateY(-6px); opacity: 1; } }
.mcs-dust {
  position: absolute;
  bottom: 30px;
  left: 44%;
  display: flex;
  gap: 8px;
}
.mcs-dust-puff {
  width: 8px; height: 8px;
  background: rgba(180,160,120,0.3);
  border-radius: 50%;
  animation: dust 0.6s infinite;
}
@keyframes dust {
  0% { transform: scale(0.5) translateY(0); opacity: 0.5; }
  100% { transform: scale(2) translateY(-10px); opacity: 0; }
}

/* Idle state */
.mn-idle .mn-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}
.mn-stat {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px 8px;
  text-align: center;
}
.mn-stat-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.02em;
}
.mn-stat-value {
  font-size: 1rem;
  font-weight: 700;
  margin-top: 4px;
  color: #0f172a;
}
.mn-booster-tag {
  background: #fef9c3;
  border: 1px solid #fde047;
  border-radius: 40px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #854d0e;
  margin-bottom: 16px;
  text-align: center;
}
.mn-btn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.15s;
}
.mn-btn-primary {
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: white;
  box-shadow: 0 4px 0 #1e40af;
}
.mn-btn-primary:active { transform: translateY(2px); box-shadow: 0 2px 0 #1e40af; }
.mn-btn-primary:disabled { opacity: 0.6; transform: none; box-shadow: none; }
.mn-btn-claim {
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: white;
  box-shadow: 0 4px 0 #15803d;
}
.mn-btn-claim:active { transform: translateY(2px); box-shadow: 0 2px 0 #15803d; }
.mn-btn-ghost {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  padding: 8px 12px;
  width: auto;
  font-size: 0.8rem;
}

/* Active state */
.mn-active {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mn-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mn-status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 40px;
  background: #f1f5f9;
  color: #334155;
}
.mn-status-badge.live { background: #dbeafe; color: #1e40af; }
.mn-status-badge.done { background: #dcfce7; color: #166534; }
.mn-rate {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}
.od-wrap {
  font-family: 'Inter', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2563eb;
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 2px;
}
.od-int, .od-dec { display: flex; }
.od-col {
  display: inline-block;
  width: 0.6em;
  height: 1em;
  overflow: hidden;
}
.od-reel {
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
}
.od-d { height: 1em; display: flex; align-items: center; justify-content: center; }
.od-dot { font-size: inherit; margin: 0 2px; }
.od-done { color: #16a34a; }
.mn-progress {
  margin: 8px 0;
}
.mn-progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}
.mn-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #0ea5e9);
  border-radius: 8px;
  transition: width 0.3s;
}
.mn-progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 4px;
}
.mn-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #94a3b8;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

/* Message */
.mn-message {
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 16px;
}
.mn-message.success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
.mn-message.error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

/* Boosters list */
.mn-booster-list {
  padding: 8px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mn-booster-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px;
}
.mn-booster-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mn-booster-icon { font-size: 1.2rem; }
.mn-booster-name { font-weight: 600; font-size: 0.85rem; }
.mn-booster-expiry { font-size: 0.65rem; color: #64748b; }
.mn-booster-mult { font-weight: 700; color: #2563eb; }

/* Shop grid */
.mn-shop-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 16px;
}
.mn-shop-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mn-shop-item.owned { background: #f0fdf4; border-color: #86efac; }
.mn-shop-item.poor { opacity: 0.7; }
.mn-shop-icon { font-size: 1.5rem; }
.mn-shop-name { font-weight: 700; font-size: 0.85rem; }
.mn-shop-tags { display: flex; gap: 4px; }
.mn-tag { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: 600; color: #334155; }
.mn-shop-price { font-weight: 600; color: #b45309; font-size: 0.8rem; }
.mn-btn-shop {
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: white;
  padding: 8px;
  font-size: 0.75rem;
  border-radius: 10px;
}
.mn-btn-shop.disabled { background: #e2e8f0; color: #94a3b8; pointer-events: none; }
.mn-shop-owned-badge {
  text-align: center;
  padding: 6px;
  background: #16a34a20;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #166534;
}
.mn-empty { padding: 20px; text-align: center; color: #94a3b8; }

/* History */
.mn-history-list { padding: 8px 16px 16px; }
.mn-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}
.mn-history-item:last-child { border: none; }
.mn-history-date { font-size: 0.75rem; font-weight: 600; color: #0f172a; }
.mn-history-meta { font-size: 0.65rem; color: #94a3b8; }
.mn-history-amount { font-weight: 700; color: #16a34a; }

/* Modals */
.mn-modal-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 99998;
}
.mn-modal-content {
  background: white; border-radius: 32px; padding: 32px 24px;
  text-align: center; position: relative; width: 300px;
}
.mn-modal-close {
  position: absolute; top: 16px; right: 16px;
  background: none; border: none; font-size: 20px; cursor: pointer;
}
.mn-modal-emoji { font-size: 2.5rem; margin-bottom: 12px; }
.mn-modal-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; }
.mn-modal-result-text { font-size: 1.5rem; font-weight: 700; color: #2563eb; }

/* Floating claim button */
.fcb-wrap {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  width: calc(100% - 24px); max-width: 500px; z-index: 9990;
}
.fcb-btn {
  width: 100%; background: linear-gradient(135deg, #16a34a, #22c55e);
  border: none; border-radius: 40px; padding: 16px 20px;
  color: white; font-weight: 700; font-size: 1rem;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 8px 24px rgba(34,197,94,0.3);
  cursor: pointer;
}
.fcb-btn:active { transform: translateY(2px); box-shadow: 0 4px 12px rgba(34,197,94,0.3); }
.fcb-icon { font-size: 1.3rem; }
.fcb-text { flex: 1; text-align: left; }
.fcb-action { font-size: 0.9rem; }
.fcb-amount { font-size: 0.7rem; opacity: 0.8; }
.fcb-arrow { font-size: 1.2rem; }

/* Ferrari cinematic */
.fc-overlay {
  position: fixed; inset: 0; background: #0b1120; z-index: 999999;
  overflow: hidden; cursor: pointer;
}
.fc-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.7) 100%);
}
.fc-speed-lines { position: absolute; inset: 0; pointer-events: none; }
.fc-line {
  position: absolute; left: 0; height: 1px; width: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: fcSpeed 0.3s linear infinite;
}
@keyframes fcSpeed {
  0% { transform: translateX(-100%); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}
.fc-road {
  position: absolute; bottom: 0; left: 0; right: 0; height: 30%;
  background: #1a1a2e;
  border-top: 2px solid #f97316;
  overflow: hidden;
}
.fc-road-line {
  position: absolute; top: 45%; width: 15%; height: 2px;
  background: rgba(255,255,255,0.2);
  animation: fcRoad 0.4s linear infinite;
}
@keyframes fcRoad {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
.fc-car-wrap {
  position: absolute; bottom: 20%; left: 50%;
  width: min(400px, 80vw);
  transform: translateX(-50%);
}
.fc-car-enter { animation: fcEnter 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }
@keyframes fcEnter {
  0% { transform: translateX(150vw); }
  70% { transform: translateX(calc(-50% + 10px)); }
  100% { transform: translateX(-50%); }
}
.fc-car-show { animation: fcRumble 0.2s infinite alternate; }
@keyframes fcRumble { from{ transform: translateX(-50%) translateY(0); } to{ transform: translateX(-50%) translateY(-2px); } }
.fc-car-exit { animation: fcExit 0.7s cubic-bezier(0.55,0,1,0.45) forwards; }
@keyframes fcExit {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(-200vw); filter: blur(8px); }
}
.fc-wheel-blur {
  position: absolute; bottom: 0; width: 40px; height: 40px;
  background: rgba(0,0,0,0.3); border-radius: 50%;
  filter: blur(6px); animation: spin 0.1s linear infinite;
}
.fc-wheel-blur-rear { left: 22%; }
.fc-wheel-blur-front { left: 62%; }
.fc-text-wrap {
  position: absolute; top: 12%; left: 50%; transform: translateX(-50%);
  text-align: center; color: white;
}
.fc-badge {
  background: rgba(249,115,22,0.2); border: 1px solid #f97316;
  border-radius: 40px; padding: 4px 16px; font-size: 0.7rem;
  text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;
}
.fc-mult {
  font-size: 5rem; font-weight: 800;
  background: linear-gradient(135deg, #f97316, #fbbf24);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.fc-boost-name { font-size: 1.2rem; font-weight: 600; margin: 8px 0; }
.fc-tap-hint { font-size: 0.6rem; opacity: 0.5; }
.fc-spark {
  position: absolute; font-size: 1.5rem;
  animation: spark 1s forwards;
}
@keyframes spark {
  0% { transform: scale(0) rotate(0); opacity: 1; }
  100% { transform: scale(1.5) rotate(360deg) translateY(-30px); opacity: 0; }
}
.fc-countdown {
  position: absolute; bottom: 0; left: 0; height: 3px;
  background: #f97316; width: 100%; transform-origin: left;
}
.fc-countdown-run { animation: countdown 3s linear forwards; }
@keyframes countdown { 0%{ transform: scaleX(1); } 100%{ transform: scaleX(0); } }
`;