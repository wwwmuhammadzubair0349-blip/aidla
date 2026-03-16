import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// ─────────────────────────────────────────────────────────
// ⚙️ CONFIG
// ─────────────────────────────────────────────────────────
const COIN_DECIMALS  = 2;
const TRUCK_INTERVAL = 30; // seconds

const fmt   = (n) => Number(n).toFixed(COIN_DECIMALS);
const fmtS  = (n) => Number(n).toFixed(2);

function msToHMS(ms) {
  const s  = Math.max(0, Math.floor(ms / 1000));
  const h  = Math.floor(s / 3600);
  const m  = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
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

// ─────────────────────────────────────────────────────────
// 🔢 ODOMETER (unchanged logic)
// ─────────────────────────────────────────────────────────
function OdometerDigit({ digit }) {
  return (
    <span style={{ display:"inline-block", width:"0.6em", height:"1em", overflow:"hidden", verticalAlign:"top" }}>
      <span style={{ display:"flex", flexDirection:"column", transform:`translateY(-${digit * 10}%)`, transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
        {[0,1,2,3,4,5,6,7,8,9].map(d => (
          <span key={d} style={{ height:"1em", display:"flex", alignItems:"center", justifyContent:"center" }}>{d}</span>
        ))}
      </span>
    </span>
  );
}

function OdometerCounter({ value, color = "#2563eb" }) {
  const str = String(Math.floor(Math.abs(value))).padStart(4, "0");
  const dec = fmt(value).split(".")[1] || "00";
  return (
    <div style={{ fontFamily:"'Inter',monospace", fontSize:"2.4rem", fontWeight:800, color, display:"flex", justifyContent:"center", alignItems:"baseline", gap:2, letterSpacing:"-0.02em" }}>
      <div style={{ display:"flex" }}>{str.split("").map((d,i) => <OdometerDigit key={i} digit={parseInt(d)}/>)}</div>
      <span style={{ margin:"0 2px" }}>.</span>
      <div style={{ display:"flex" }}>{dec.split("").map((d,i) => <OdometerDigit key={i} digit={parseInt(d)}/>)}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 🐱 SIMPLE MINING SCENE (simplified visuals, same logic)
// ─────────────────────────────────────────────────────────
function MiningScene({ isMining, isDone }) {
  const [phase,       setPhase]       = useState("hidden");
  const [coinArcs,    setCoinArcs]    = useState([]);
  const [arcId,       setArcId]       = useState(0);
  const cycleRef  = useRef(null);
  const firstRef  = useRef(null);
  const arcRef    = useRef(null);

  // Time of day
  const hour = parseInt(new Date().toLocaleString("en-GB", { timeZone:"Asia/Dubai", hour:"numeric", hour12:false }));
  const isNight  = hour < 6 || hour >= 20;
  const isSunset = (hour >= 17 && hour < 20) || (hour >= 5 && hour < 7);
  const skyBg    = isNight   ? "linear-gradient(180deg,#0b1120 0%,#1a2639 100%)"
                 : isSunset  ? "linear-gradient(180deg,#f97316 0%,#fdba74 50%,#fef9c3 100%)"
                 :             "linear-gradient(180deg,#38bdf8 0%,#7dd3fc 60%,#f0f9ff 100%)";

  // Coin arc spawner
  useEffect(() => {
    if (!isMining || isDone) { clearInterval(arcRef.current); return; }
    arcRef.current = setInterval(() => {
      const id = arcId + 1;
      setArcId(id);
      const coin = { id, x: 44 + Math.random() * 10, vx: (Math.random() - 0.5) * 4, vy: -8 - Math.random() * 4, rot: Math.random() * 360 };
      setCoinArcs(prev => [...prev.slice(-10), coin]);
      setTimeout(() => setCoinArcs(prev => prev.filter(c => c.id !== id)), 1300);
    }, 300);
    return () => clearInterval(arcRef.current);
  }, [isMining, isDone]);

  // Truck cycle (unchanged)
  const runCycle = useCallback(() => {
    setPhase("arriving");
    setTimeout(() => setPhase("loading"),  1300);
    setTimeout(() => setPhase("leaving"),  3800);
    setTimeout(() => setPhase("hidden"),   6200);
  }, []);

  useEffect(() => {
    if (!isMining || isDone) { setPhase("hidden"); clearTimeout(firstRef.current); clearInterval(cycleRef.current); return; }
    firstRef.current = setTimeout(() => {
      runCycle();
      cycleRef.current = setInterval(runCycle, TRUCK_INTERVAL * 1000);
    }, 8000);
    return () => { clearTimeout(firstRef.current); clearInterval(cycleRef.current); };
  }, [isMining, isDone, runCycle]);

  const truckVisible = phase !== "hidden";
  const catState     = isDone ? "idle" : phase === "loading" ? "loading" : "mining";

  return (
    <div style={{ position:"relative", height:160, background:skyBg, overflow:"hidden", borderRadius:"16px 16px 0 0" }}>

      {/* Stars */}
      {isNight && [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i => (
        <div key={i} style={{ position:"absolute", width:2, height:2, background:"white", borderRadius:"50%", left:`${5+(i*7)%90}%`, top:`${5+(i*5)%40}%`, opacity:0.6, animation:`twinkle ${1+i%3}s infinite alternate` }}/>
      ))}

      {/* Sun / Moon */}
      {!isNight && <div style={{ position:"absolute", right:"10%", top:isSunset?"28%":"10%", width:22, height:22, borderRadius:"50%", background:isSunset?"#f97316":"#fbbf24", boxShadow:`0 0 18px ${isSunset?"#f97316":"#fbbf24"}` }}/>}
      {isNight  && <div style={{ position:"absolute", right:"10%", top:"10%", fontSize:"1.4rem" }}>🌙</div>}

      {/* Ground */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:28, background:"#16a34a" }}>
        <div style={{ height:"100%", background:"repeating-linear-gradient(90deg,#15803d 0,#15803d 20px,#16a34a 20px,#16a34a 40px)" }}/>
      </div>

      {/* Coin arcs */}
      {coinArcs.map(c => (
        <div key={c.id} style={{ position:"absolute", left:`${c.x}%`, bottom:"28%", fontSize:"0.9rem", animation:"coinArc 1.3s ease-out forwards", "--vx":`${c.vx*16}px`, "--rot":`${c.rot}deg` }}>🪙</div>
      ))}

      {/* Coin pile */}
      {isMining && <div style={{ position:"absolute", bottom:28, right:14, fontSize:"1.1rem" }}>🪙🪙🪙</div>}

      {/* Truck */}
      {truckVisible && (
        <div style={{ position:"absolute", bottom:28, animation: phase==="arriving"?"truckIn 1.3s forwards" : phase==="leaving"?"truckOut 2s forwards" : "none", left: phase==="loading"?"56%":"auto" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
            <span style={{ fontSize:"1.8rem" }}>🚛</span>
            {phase==="loading" && (
              <>
                <div style={{ position:"absolute", top:-22, left:16, display:"flex", gap:2, fontSize:"0.75rem", animation:"bounce 0.3s infinite alternate" }}>🪙🪙🪙</div>
                <div style={{ position:"absolute", top:-34, left:"50%", transform:"translateX(-50%)", background:"white", border:"1px solid #e2e8f0", borderRadius:12, padding:"3px 10px", fontSize:"0.6rem", fontWeight:600, whiteSpace:"nowrap" }}>Loading...</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cat */}
      <div style={{ position:"absolute", bottom:26, left:"43%", transform:"translateX(-50%)", display:"flex", alignItems:"flex-end",
        animation: catState==="mining"?"catMine 0.4s infinite alternate" : catState==="loading"?"catLoad 0.3s infinite alternate" : "catIdle 2s infinite" }}>
        {/* Simple cat SVG */}
        <svg viewBox="0 0 80 76" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="30" r="16" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
          <ellipse cx="40" cy="56" rx="20" ry="16" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
          <polygon points="25,20 20,7 33,17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2"/>
          <polygon points="55,20 60,7 47,17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2"/>
          <rect x="25" y="9" width="30" height="9" rx="4" fill="#f59e0b"/>
          <circle cx="35" cy="30" r="3" fill="#1e293b"/>
          <circle cx="45" cy="30" r="3" fill="#1e293b"/>
          {catState==="loading"  && <path d="M32 34 Q40 38 48 34" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>}
          {catState!=="loading"  && <line x1="32" y1="34" x2="48" y2="34" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>}
          <ellipse cx="40" cy="35" rx="2" ry="1.4" fill="#fda4af"/>
        </svg>
        {/* Tool */}
        <span style={{ position:"absolute", bottom:10, right:-16, fontSize:"1.1rem",
          animation: catState==="mining"?"pickSwing 0.4s infinite alternate" : catState==="loading"?"shovelToss 0.3s infinite alternate" : "none" }}>
          {catState==="mining" ? "⛏️" : catState==="loading" ? "🪣" : null}
        </span>
        {catState==="idle" && <span style={{ position:"absolute", bottom:38, right:-12, fontSize:"0.8rem", animation:"zzz 2s infinite" }}>💤</span>}
      </div>

      {/* Dust (mining) */}
      {isMining && !isDone && (
        <div style={{ position:"absolute", bottom:28, left:"43%", display:"flex", gap:6 }}>
          {[0,1].map(i => <div key={i} style={{ width:7, height:7, background:"rgba(180,160,120,0.3)", borderRadius:"50%", animation:`dust 0.6s ${i*0.15}s infinite` }}/>)}
        </div>
      )}

      {/* CSS keyframes injected */}
      <style>{`
        @keyframes twinkle { from{opacity:0.2} to{opacity:0.9} }
        @keyframes coinArc { 0%{transform:translate(0,0) rotate(0deg) scale(1);opacity:1} 100%{transform:translate(var(--vx,20px),-46px) rotate(var(--rot,360deg)) scale(0.3);opacity:0} }
        @keyframes truckIn  { from{left:110%} to{left:56%} }
        @keyframes truckOut { from{left:56%}  to{left:110%} }
        @keyframes bounce   { from{transform:translateY(0)} to{transform:translateY(-5px)} }
        @keyframes catMine  { from{transform:translateX(-50%) translateY(0)} to{transform:translateX(-50%) translateY(-3px)} }
        @keyframes catLoad  { from{transform:translateX(-50%) translateY(0)} to{transform:translateX(-50%) translateY(-5px)} }
        @keyframes catIdle  { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-2px)} }
        @keyframes pickSwing { from{transform:rotate(-20deg)} to{transform:rotate(10deg)} }
        @keyframes shovelToss { from{transform:rotate(-10deg) translateY(0)} to{transform:rotate(15deg) translateY(-5px)} }
        @keyframes zzz      { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes dust     { 0%{transform:scale(0.5) translateY(0);opacity:0.5} 100%{transform:scale(2) translateY(-10px);opacity:0} }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 🏎️ FERRARI CINEMATIC (unchanged logic, slightly cleaner)
// ─────────────────────────────────────────────────────────
function FerrariCinematic({ data, onDone }) {
  const [phase, setPhase] = useState("enter");
  const sparks = useRef(Array.from({length:12}, () => ({
    left:`${20+Math.random()*60}%`, top:`${20+Math.random()*50}%`, delay:`${(Math.random()).toFixed(2)}s`
  })));

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"),  1200);
    const t2 = setTimeout(() => setPhase("exit"),  4200);
    const t3 = setTimeout(() => onDone(),           5000);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div onClick={onDone} style={{ position:"fixed", inset:0, background:"#0b1120", zIndex:999999, overflow:"hidden", cursor:"pointer" }}>
      <style>{`
        @keyframes fcEnter { from{transform:translateX(150vw)} to{transform:translateX(-50%)} }
        @keyframes fcRumble { from{transform:translateX(-50%) translateY(0)} to{transform:translateX(-50%) translateY(-2px)} }
        @keyframes fcExit { from{transform:translateX(-50%)} to{transform:translateX(-200vw);filter:blur(8px)} }
        @keyframes fcLine { 0%{transform:translateX(-100%);opacity:0} 20%{opacity:1} 100%{transform:translateX(100%);opacity:0} }
        @keyframes fcSpark { 0%{transform:scale(0) rotate(0);opacity:1} 100%{transform:scale(1.5) rotate(360deg) translateY(-30px);opacity:0} }
        @keyframes fcCountdown { 0%{transform:scaleX(1)} 100%{transform:scaleX(0)} }
        @keyframes fcSpin { to{transform:rotate(360deg)} }
      `}</style>

      {/* Vignette */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle, transparent 30%, rgba(0,0,0,0.7) 100%)", pointerEvents:"none" }}/>

      {/* Speed lines */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
        {Array.from({length:20}).map((_,i) => (
          <div key={i} style={{ position:"absolute", left:0, height:1, width:"100%", top:`${4+i*4.8}%`, background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)", animation:`fcLine 0.3s ${(i*0.04).toFixed(2)}s linear infinite` }}/>
        ))}
      </div>

      {/* Road */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"28%", background:"#1a1a2e", borderTop:"2px solid #f97316" }}/>

      {/* Car */}
      <div style={{ position:"absolute", bottom:"20%", left:"50%", width:"min(400px,80vw)",
        animation: phase==="enter"?"fcEnter 1.2s cubic-bezier(0.16,1,0.3,1) forwards" : phase==="show"?"fcRumble 0.2s infinite alternate" : "fcExit 0.7s cubic-bezier(0.55,0,1,0.45) forwards" }}>
        <svg viewBox="0 0 520 160" style={{ width:"100%", height:"auto" }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ferrG" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d48"/>
              <stop offset="50%" stopColor="#be123c"/>
              <stop offset="100%" stopColor="#9f1239"/>
            </linearGradient>
          </defs>
          <path d="M70,120 L70,80 Q90,40 150,30 L370,30 Q430,40 450,80 L450,120 Z" fill="url(#ferrG)" stroke="#881337" strokeWidth="2"/>
          <circle cx="150" cy="120" r="25" fill="#1e293b" stroke="#0f172a" strokeWidth="3"/>
          <circle cx="370" cy="120" r="25" fill="#1e293b" stroke="#0f172a" strokeWidth="3"/>
          <circle cx="150" cy="120" r="10" fill="#cbd5e1"/>
          <circle cx="370" cy="120" r="10" fill="#cbd5e1"/>
          <rect x="200" y="80" width="120" height="20" fill="#334155" rx="4"/>
        </svg>
      </div>

      {/* Text */}
      {phase === "show" && (
        <div style={{ position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)", textAlign:"center", color:"white" }}>
          <div style={{ background:"rgba(249,115,22,0.2)", border:"1px solid #f97316", borderRadius:40, padding:"3px 16px", fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>BOOSTER ACTIVATED</div>
          <div style={{ fontSize:"4.5rem", fontWeight:900, background:"linear-gradient(135deg,#f97316,#fbbf24)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{data?.multiplier}×</div>
          <div style={{ fontSize:"1.1rem", fontWeight:600, marginTop:4 }}>{data?.icon} {data?.name}</div>
          <div style={{ fontSize:"0.6rem", opacity:0.45, marginTop:8 }}>tap anywhere to dismiss</div>
        </div>
      )}

      {/* Sparks */}
      {phase === "show" && sparks.current.map((s,i) => (
        <div key={i} style={{ position:"absolute", fontSize:"1.4rem", left:s.left, top:s.top, animation:`fcSpark 1s ${s.delay} forwards` }}>✨</div>
      ))}

      {/* Countdown bar */}
      <div style={{ position:"absolute", bottom:0, left:0, height:3, background:"#f97316", width:"100%", transformOrigin:"left",
        animation: phase==="show" ? "fcCountdown 3s linear forwards" : "none" }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 🔥 STREAK BADGE
// ─────────────────────────────────────────────────────────
function StreakBadge({ count }) {
  if (!count || count < 1) return null;
  const hot = count >= 7, warm = count >= 3;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, background:"#fff", border:"1px solid #e2e8f0", borderRadius:40, padding:"4px 10px", fontSize:"0.7rem", fontWeight:700, boxShadow:"0 2px 6px rgba(0,0,0,0.04)" }}>
      <span>{hot?"🔥":warm?"🌟":"⚡"}</span>
      <span style={{ color:hot?"#dc2626":warm?"#b45309":"#2563eb" }}>{count}</span>
      <span style={{ opacity:0.55, fontSize:"0.6rem" }}>day streak</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 🎁 FLOATING CLAIM BUTTON
// ─────────────────────────────────────────────────────────
function FloatingClaimBtn({ show, earned, claiming, onClick }) {
  if (!show) return null;
  return (
    <div style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", width:"calc(100% - 24px)", maxWidth:500, zIndex:9990 }}>
      <button onClick={onClick} disabled={claiming}
        style={{ width:"100%", background:"linear-gradient(135deg,#16a34a,#22c55e)", border:"none", borderRadius:40, padding:"15px 20px", color:"white", fontWeight:700, fontSize:"0.95rem", display:"flex", alignItems:"center", gap:12, boxShadow:"0 8px 24px rgba(34,197,94,0.3)", cursor:claiming?"not-allowed":"pointer" }}>
        <span style={{ fontSize:"1.2rem" }}>🎁</span>
        <div style={{ flex:1, textAlign:"left" }}>
          <div style={{ fontSize:"0.85rem" }}>{claiming?"Processing…":"Claim Rewards"}</div>
          <div style={{ fontSize:"0.68rem", opacity:0.8 }}>+{fmtS(earned)} coins ready</div>
        </div>
        <span style={{ fontSize:"1.1rem" }}>→</span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 🧩 SMALL REUSABLE UI BITS
// ─────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:20, overflow:"hidden", marginBottom:14, boxShadow:"0 2px 8px rgba(0,0,0,0.03)", ...style }}>
      {children}
    </div>
  );
}

function CardHeader({ title, right }) {
  return (
    <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ fontSize:"0.7rem", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em" }}>{title}</div>
      {right}
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div style={{ background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:14, padding:"11px 8px", textAlign:"center", flex:1 }}>
      <div style={{ fontSize:"0.58rem", textTransform:"uppercase", color:"#94a3b8", letterSpacing:"0.06em", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:"0.95rem", fontWeight:700, color:"#0f172a" }}>{value}</div>
    </div>
  );
}

function Btn({ children, onClick, disabled, variant="primary", style={} }) {
  const base = { width:"100%", padding:"13px", borderRadius:14, border:"none", fontWeight:700, fontSize:"0.9rem", cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.6:1, transition:"all 0.15s", ...style };
  const variants = {
    primary: { background:"linear-gradient(135deg,#2563eb,#0ea5e9)", color:"white", boxShadow:"0 4px 0 #1e40af" },
    claim:   { background:"linear-gradient(135deg,#16a34a,#22c55e)", color:"white", boxShadow:"0 4px 0 #15803d" },
    ghost:   { background:"transparent", border:"1px solid #e2e8f0", color:"#334155", padding:"8px 14px", width:"auto", fontSize:"0.8rem", boxShadow:"none" },
    shop:    { background:"linear-gradient(135deg,#2563eb,#0ea5e9)", color:"white", padding:"8px", fontSize:"0.75rem", borderRadius:10, boxShadow:"none" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
}

// ─────────────────────────────────────────────────────────
// 🏠 MAIN COMPONENT
// ─────────────────────────────────────────────────────────
export default function Mining() {
  const navigate = useNavigate();

  const [mounted,      setMounted]      = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [msg,          setMsg]          = useState({ text:"", type:"" });
  const [modalData,    setModalData]    = useState(null);
  const [ferrariData,  setFerrariData]  = useState(null);

  const [settings,     setSettings]     = useState(null);
  const [session,      setSession]      = useState(null);
  const [profile,      setProfile]      = useState(null);
  const [history,      setHistory]      = useState([]);
  const [boosters,     setBoosters]     = useState([]);
  const [myBoosters,   setMyBoosters]   = useState([]);
  const [streak,       setStreak]       = useState(0);
  const [showHistory,  setShowHistory]  = useState(false);

  const [buying,       setBuying]       = useState(null);
  const [claiming,     setClaiming]     = useState(false);
  const [starting,     setStarting]     = useState(false);

  const [nowMs, setNowMs] = useState(Date.now());
  const rafRef = useRef(null);
  const tick = useCallback(() => { setNowMs(Date.now()); rafRef.current = requestAnimationFrame(tick); }, []);
  useEffect(() => { rafRef.current = requestAnimationFrame(tick); return () => cancelAnimationFrame(rafRef.current); }, [tick]);

  // ── Load all data ─────────────────────────────────────
  const loadAll = useCallback(async (silent = false) => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) { setMsg({ text:"Please login first.", type:"err" }); setLoading(false); return; }
    const uid = auth.user.id;

    const [settRes, profRes, sessRes, histRes, boostCatRes, myBoostRes] = await Promise.all([
      supabase.from("mining_settings").select("*").eq("id",1).single(),
      supabase.from("users_profiles").select("*").eq("user_id",uid).single(),
      supabase.from("mining_sessions").select("*").eq("user_id",uid).in("status",["active","completed"]).order("created_at",{ascending:false}).limit(1).maybeSingle(),
      supabase.from("mining_sessions").select("id,started_at,actual_coins,effective_rate,duration_hours,status,claimed_at").eq("user_id",uid).eq("status","claimed").order("claimed_at",{ascending:false}).limit(10),
      supabase.from("mining_boosters").select("*").eq("enabled",true).order("price_coins"),
      supabase.from("mining_user_boosters").select("*, mining_boosters(name,multiplier,icon)").eq("user_id",uid).or("expires_at.is.null,expires_at.gt."+new Date().toISOString()),
    ]);

    if (settRes.data)  setSettings(settRes.data);
    if (profRes.data)  setProfile(profRes.data);
    setSession(sessRes.data || null);
    setHistory(histRes.data || []);
    setBoosters(boostCatRes.data || []);
    setMyBoosters(myBoostRes.data || []);

    // Streak calc (unchanged)
    if (histRes.data) {
      let s = 0;
      const now = Date.now();
      for (let i = 0; i < histRes.data.length; i++) {
        const hoursSince = (now - new Date(histRes.data[i].claimed_at).getTime()) / 3600000;
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
    loadAll();
    const iv = setInterval(() => loadAll(true), 5000);
    return () => clearInterval(iv);
  }, [loadAll]);

  useEffect(() => {
    let t;
    if (modalData) t = setTimeout(() => setModalData(null), 5000);
    return () => clearTimeout(t);
  }, [modalData]);

  // ── Derived values ────────────────────────────────────
  const effectiveRate = useMemo(() => {
    if (!settings) return 0;
    const base = Number(settings.base_rate_per_hour || 0);
    const mult = myBoosters.reduce((a,b) => a * Number(b.mining_boosters?.multiplier || 1), 1);
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

  const showMsg_ = (text, type="ok", ms=4000) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text:"", type:"" }), ms);
  };

  // ── Actions ───────────────────────────────────────────
  const onStart = async () => {
    setStarting(true);
    const { data, error } = await supabase.rpc("mining_start");
    setStarting(false);
    if (error || !data?.ok) { showMsg_(error?.message || data?.error || "Failed", "err"); return; }
    await loadAll();
  };

  const onClaim = async () => {
    setClaiming(true);
    const { data, error } = await supabase.rpc("mining_claim", { p_session_id: session.id });
    setClaiming(false);
    if (error || !data?.ok) { showMsg_(error?.message || data?.error || "Claim failed", "err"); return; }
    await loadAll();
    setModalData({ type:"claim", amount: data.coins_claimed });
  };

  const onBuyBooster = async (b) => {
    if (Number(profile?.total_aidla_coins || 0) < b.price_coins) { showMsg_("Insufficient coins.", "err"); return; }
    setBuying(b.id);
    const { data, error } = await supabase.rpc("mining_buy_booster", { p_booster_id: b.id });
    setBuying(null);
    if (error || !data?.ok) { showMsg_(error?.message || data?.error || "Purchase failed", "err"); return; }
    await loadAll();
    setFerrariData({ name:b.name, icon:b.icon, multiplier:b.multiplier });
  };

  const balance   = Number(profile?.total_aidla_coins || 0);
  const hasActive = !!session && session.status === "active";
  const isDone    = sd?.done ?? false;

  // ─────────────────────────────────────────────────────
  // 🖥️ RENDER
  // ─────────────────────────────────────────────────────
  return (
    <>
      {/* Ferrari cinematic portal */}
      {ferrariData && mounted && createPortal(
        <FerrariCinematic data={ferrariData} onDone={() => setFerrariData(null)}/>,
        document.body
      )}

      {/* Claim success modal */}
      {modalData?.type === "claim" && mounted && createPortal(
        <div onClick={() => setModalData(null)} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99998 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:28, padding:"32px 24px", textAlign:"center", width:280, position:"relative", boxShadow:"0 24px 60px rgba(0,0,0,0.15)" }}>
            <button onClick={() => setModalData(null)} style={{ position:"absolute", top:14, right:14, background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#94a3b8" }}>✕</button>
            <div style={{ fontSize:"2.5rem", marginBottom:10 }}>🎁</div>
            <div style={{ fontSize:"1.1rem", fontWeight:800, color:"#0f172a", marginBottom:6 }}>Coins Claimed!</div>
            <div style={{ fontSize:"1.6rem", fontWeight:800, color:"#2563eb" }}>+{fmtS(modalData.amount)}</div>
          </div>
        </div>,
        document.body
      )}

      {/* Floating claim button */}
      {isDone && hasActive && mounted && createPortal(
        <FloatingClaimBtn show={true} earned={sd?.earned??0} claiming={claiming} onClick={onClaim}/>,
        document.body
      )}

      {/* Page */}
      <div style={{ fontFamily:"'Inter',system-ui,-apple-system,sans-serif", background:"#f8fafc", minHeight:"100vh", padding:"16px 14px 32px", maxWidth:500, margin:"0 auto", color:"#0f172a" }}>

        {/* ── Header ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:"1.8rem" }}>⛏️</div>
            <div>
              <div style={{ fontSize:"1.3rem", fontWeight:800, letterSpacing:"-0.02em" }}>Mining</div>
              <div style={{ fontSize:"0.7rem", color:"#64748b", marginTop:1 }}>Earn while you wait</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <StreakBadge count={streak}/>
            <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:40, padding:"6px 14px", fontSize:"0.85rem", fontWeight:600, display:"flex", alignItems:"center", gap:6, boxShadow:"0 2px 6px rgba(0,0,0,0.03)" }}>
              💰 <strong>{fmtS(balance)}</strong>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#94a3b8" }}>Loading…</div>
        ) : !settings?.enabled ? (
          <Card><div style={{ padding:"48px 20px", textAlign:"center", color:"#64748b" }}>Mining is currently offline.</div></Card>
        ) : (
          <>
            {/* ── Main Mining Card ── */}
            <Card>
              <MiningScene isMining={hasActive} isDone={isDone}/>

              <div style={{ padding:"18px 16px" }}>
                {!hasActive ? (
                  /* ─ Idle ─ */
                  <div>
                    <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                      <StatPill label="Duration"  value={`${liveDur}h`}/>
                      <StatPill label="Rate/hr"   value={fmtS(effectiveRate)}/>
                      <StatPill label="Est. Total" value={`~${fmtS(effectiveRate*liveDur)}`}/>
                    </div>
                    {myBoosters.length > 0 && (
                      <div style={{ background:"#fef9c3", border:"1px solid #fde047", borderRadius:40, padding:"6px 14px", fontSize:"0.72rem", fontWeight:600, color:"#854d0e", marginBottom:14, textAlign:"center" }}>
                        ⚡ {myBoosters.map(b => b.mining_boosters?.name).join(", ")}
                      </div>
                    )}
                    <Btn variant="primary" onClick={onStart} disabled={starting}>
                      {starting ? "Starting…" : "⛏️ Start Mining"}
                    </Btn>
                  </div>
                ) : (
                  /* ─ Active ─ */
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {/* Status row */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:"0.72rem", fontWeight:700, padding:"3px 12px", borderRadius:40, background:isDone?"#dcfce7":"#dbeafe", color:isDone?"#166534":"#1e40af" }}>
                        {isDone ? "✅ Complete" : "🔴 Mining"}
                      </span>
                      <span style={{ fontSize:"0.72rem", color:"#64748b", fontWeight:600 }}>{fmtS(effectiveRate)}/hr</span>
                    </div>

                    {/* Odometer */}
                    <OdometerCounter value={sd?.earned??0} color={isDone?"#16a34a":"#2563eb"}/>

                    {/* Progress */}
                    <div>
                      <div style={{ height:8, background:"#e2e8f0", borderRadius:8, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${sd?.pct??0}%`, background:isDone?"linear-gradient(90deg,#16a34a,#22c55e)":"linear-gradient(90deg,#2563eb,#0ea5e9)", borderRadius:8, transition:"width 0.4s" }}/>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.68rem", color:"#94a3b8", marginTop:4 }}>
                        <span>{Math.floor(sd?.pct??0)}%</span>
                        <span>{isDone ? "Ready to claim!" : msToHMS(sd?.remaining??0)}</span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.68rem", color:"#94a3b8", background:"#f8fafc", padding:"8px 12px", borderRadius:10, border:"1px solid #f1f5f9" }}>
                      <span>Started {fmtDate(session.started_at)}</span>
                      <span>{liveDur}h session</span>
                    </div>

                    {/* Claim button */}
                    {isDone && <Btn variant="claim" onClick={onClaim} disabled={claiming}>{claiming?"Processing…":`Claim ${fmtS(sd?.earned??0)} coins`}</Btn>}
                  </div>
                )}
              </div>
            </Card>

            {/* ── Message ── */}
            {msg.text && (
              <div style={{ padding:"11px 16px", borderRadius:12, fontSize:"0.83rem", fontWeight:600, marginBottom:14, background:msg.type==="err"?"#fee2e2":"#dcfce7", color:msg.type==="err"?"#991b1b":"#166534", border:`1px solid ${msg.type==="err"?"#fecaca":"#86efac"}` }}>
                {msg.type==="err"?"⚠️":"✅"} {msg.text}
              </div>
            )}

            {/* ── Active Boosters ── */}
            {myBoosters.length > 0 && (
              <Card>
                <CardHeader title="Active Boosters" right={<span style={{ background:"#dbeafe", color:"#1e40af", borderRadius:20, padding:"2px 8px", fontSize:"0.68rem", fontWeight:700 }}>{myBoosters.length}</span>}/>
                <div style={{ padding:"10px 16px 16px", display:"flex", flexDirection:"column", gap:8 }}>
                  {myBoosters.map(b => (
                    <div key={b.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#f8fafc", border:"1px solid #f1f5f9", borderRadius:12, padding:"10px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:"1.1rem" }}>{b.mining_boosters?.icon||"⚡"}</span>
                        <div>
                          <div style={{ fontWeight:700, fontSize:"0.82rem" }}>{b.mining_boosters?.name}</div>
                          <div style={{ fontSize:"0.62rem", color:"#94a3b8" }}>{b.expires_at?`Expires ${fmtDate(b.expires_at)}`:"Permanent"}</div>
                        </div>
                      </div>
                      <span style={{ fontWeight:800, color:"#2563eb", fontSize:"0.9rem" }}>{b.mining_boosters?.multiplier}×</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ── Booster Shop ── */}
            <Card>
              <CardHeader title="Booster Shop" right={<Btn variant="ghost" onClick={() => navigate("/user/wallet/invite")}>Invite & Earn</Btn>}/>
              {boosters.length === 0 ? (
                <div style={{ padding:"28px 20px", textAlign:"center", color:"#94a3b8", fontSize:"0.85rem" }}>No boosters available.</div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:14 }}>
                  {boosters.map(b => {
                    const owned     = myBoosters.some(mb => mb.booster_id === b.id);
                    const canAfford = balance >= b.price_coins;
                    return (
                      <div key={b.id} style={{ background:owned?"#f0fdf4":"#f8fafc", border:`1px solid ${owned?"#86efac":"#e2e8f0"}`, borderRadius:16, padding:14, display:"flex", flexDirection:"column", gap:8, opacity:(!owned&&!canAfford)?0.7:1 }}>
                        <span style={{ fontSize:"1.4rem" }}>{b.icon||"⚡"}</span>
                        <div style={{ fontWeight:700, fontSize:"0.82rem" }}>{b.name}</div>
                        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                          <span style={{ background:"#e2e8f0", padding:"2px 6px", borderRadius:4, fontSize:"0.6rem", fontWeight:600 }}>{b.multiplier}×</span>
                          <span style={{ background:"#e2e8f0", padding:"2px 6px", borderRadius:4, fontSize:"0.6rem", fontWeight:600 }}>{b.duration_hours?`${b.duration_hours}h`:"∞"}</span>
                        </div>
                        <div style={{ fontSize:"0.78rem", fontWeight:600, color:"#b45309" }}>💰 {b.price_coins}</div>
                        {owned ? (
                          <div style={{ textAlign:"center", padding:"6px", background:"rgba(22,163,74,0.1)", borderRadius:8, fontSize:"0.68rem", fontWeight:600, color:"#166534" }}>✅ Active</div>
                        ) : (
                          <Btn variant="shop" onClick={() => onBuyBooster(b)} disabled={buying===b.id||!canAfford}>
                            {buying===b.id?"Buying…":canAfford?"Buy Now":"Need coins"}
                          </Btn>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* ── History ── */}
            {history.length > 0 && (
              <Card>
                <button onClick={() => setShowHistory(p=>!p)}
                  style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", font:"inherit" }}>
                  <span style={{ fontSize:"0.7rem", fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em" }}>Mining History</span>
                  <span style={{ color:"#94a3b8", fontSize:"0.68rem", transition:"transform 0.2s", transform:showHistory?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
                </button>
                {showHistory && (
                  <div style={{ padding:"0 16px 14px" }}>
                    {history.map((h,i) => (
                      <div key={h.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<history.length-1?"1px solid #f8fafc":"none" }}>
                        <div>
                          <div style={{ fontSize:"0.75rem", fontWeight:600, color:"#0f172a" }}>{fmtDate(h.claimed_at)}</div>
                          <div style={{ fontSize:"0.62rem", color:"#94a3b8", marginTop:2 }}>{h.duration_hours}h · {fmtS(h.effective_rate)}/hr</div>
                        </div>
                        <div style={{ fontWeight:700, color:"#16a34a", fontSize:"0.9rem" }}>+{fmtS(h.actual_coins)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Space for floating button */}
            {isDone && <div style={{ height:80 }}/>}
          </>
        )}
      </div>
    </>
  );
}