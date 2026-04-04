import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

// ── Animated SVG white cat ──
function CatPet({ mood }) {
  const isSleepy  = mood === "sleepy";
  const isPlayful = mood === "playful";

  return (
    <svg
      className={`ul-cat-svg mood-${mood}`}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .ul-cat-svg { width:40px; height:40px; flex-shrink:0; overflow:visible; }
        .mood-happy   { animation: catHappyBob  0.9s infinite alternate ease-in-out; }
        .mood-playful { animation: catPlayfulWig 1.4s infinite ease-in-out; }
        .mood-relaxed { animation: catRelaxFloat 3s   infinite ease-in-out; }
        .mood-sleepy  { animation: catSleepBrth  4s   infinite ease-in-out; }
        @keyframes catHappyBob  { from{transform:translateY(0)} to{transform:translateY(-4px)} }
        @keyframes catPlayfulWig{ 0%,100%{transform:rotate(-6deg)} 50%{transform:rotate(6deg)} }
        @keyframes catRelaxFloat{ 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-3px) scale(1.02)} }
        @keyframes catSleepBrth { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        .cat-tail { transform-origin: 8px 6px; animation: tailWag 1.6s infinite ease-in-out; }
        @keyframes tailWag { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} }
        .cat-ear-l { transform-origin: 10px 14px; animation: earL 3s infinite ease-in-out; }
        .cat-ear-r { transform-origin: 54px 14px; animation: earR 3s 0.4s infinite ease-in-out; }
        @keyframes earL { 0%,80%,100%{transform:rotate(0)} 90%{transform:rotate(-12deg)} }
        @keyframes earR { 0%,80%,100%{transform:rotate(0)} 90%{transform:rotate(12deg)} }
        .cat-eye-l, .cat-eye-r { animation: eyeBlink 4s 1.5s infinite; }
        @keyframes eyeBlink { 0%,94%,100%{transform:scaleY(1)} 96%{transform:scaleY(0.05)} }
        .cat-zzz { opacity:0; }
        .cat-zzz.show { animation: floatZShow 2s infinite ease-in-out; }
        @keyframes floatZShow { 0%{opacity:0;transform:translateY(0)scale(0.6)} 30%{opacity:1} 100%{opacity:0;transform:translateY(-12px)scale(1)} }
        .cat-spark { opacity:0; }
        .cat-spark.show { animation: sparkPop 1.4s 0.6s infinite ease-out; }
        @keyframes sparkPop { 0%,100%{opacity:0;transform:scale(0)} 40%{opacity:1;transform:scale(1.2)} 70%{opacity:0.6;transform:scale(0.8)} }
      `}</style>
      <ellipse cx="32" cy="60" rx="14" ry="3" fill="rgba(0,0,0,0.08)" />
      <g className="cat-tail" style={{ transformOrigin: "20px 52px" }}>
        <path d="M20 52 Q6 50 8 40 Q10 34 16 38" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M20 52 Q6 50 8 40 Q10 34 16 38" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
      <ellipse cx="32" cy="46" rx="16" ry="13" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <ellipse cx="32" cy="48" rx="8" ry="7" fill="#fafafa" stroke="#f1f5f9" strokeWidth="1" />
      <g className="cat-ear-l">
        <polygon points="12,18 8,6 20,14" fill="white" stroke="#e2e8f0" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="13,17 10,8 19,14" fill="#fecdd3" opacity="0.6" />
      </g>
      <g className="cat-ear-r">
        <polygon points="52,18 56,6 44,14" fill="white" stroke="#e2e8f0" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="51,17 54,8 45,14" fill="#fecdd3" opacity="0.6" />
      </g>
      <circle cx="32" cy="26" r="17" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      {isSleepy ? (
        <>
          <path d="M23 25 Q26 22 29 25" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M35 25 Q38 22 41 25" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <g className="cat-eye-l" style={{ transformOrigin: "26px 25px" }}>
            <circle cx="26" cy="25" r="4.5" fill="#1e293b" />
            <circle cx="26" cy="25" r="3" fill="#334155" />
            <circle cx="24.5" cy="23.5" r="1.2" fill="white" opacity="0.9" />
          </g>
          <g className="cat-eye-r" style={{ transformOrigin: "38px 25px" }}>
            <circle cx="38" cy="25" r="4.5" fill="#1e293b" />
            <circle cx="38" cy="25" r="3" fill="#334155" />
            <circle cx="36.5" cy="23.5" r="1.2" fill="white" opacity="0.9" />
          </g>
        </>
      )}
      <polygon points="32,30 30,32 34,32" fill="#fda4af" />
      <path d="M30 32 Q32 35 34 32" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <line x1="14" y1="29" x2="26" y2="31" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="32" x2="26" y2="32" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
      <line x1="15" y1="35" x2="26" y2="33" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
      <line x1="50" y1="29" x2="38" y2="31" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
      <line x1="50" y1="32" x2="38" y2="32" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
      <line x1="49" y1="35" x2="38" y2="33" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="24" cy="58" rx="5" ry="3.5" fill="white" stroke="#e2e8f0" strokeWidth="1.2" />
      <ellipse cx="40" cy="58" rx="5" ry="3.5" fill="white" stroke="#e2e8f0" strokeWidth="1.2" />
      <text className={`cat-zzz ${isSleepy ? "show" : ""}`} x="46" y="16" fontSize="9" fill="#94a3b8" fontWeight="bold">z</text>
      <text className={`cat-zzz ${isSleepy ? "show" : ""}`} x="50" y="9" fontSize="7" fill="#94a3b8" fontWeight="bold" style={{ animationDelay: "0.8s" }}>z</text>
      <text className={`cat-spark ${isPlayful ? "show" : ""}`} x="48" y="12" fontSize="10" fill="#fbbf24">✦</text>
    </svg>
  );
}

const TABS = [
  { to: "/user",         label: "Dashboard", icon: "⚡" },
  { to: "/user/feed",    label: "Feed",       icon: "📡" },
  { to: "/user/wallet",  label: "Wallet",     icon: "💎" },
  { to: "/user/profile", label: "Profile",    icon: "👤" },
];

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronIcon = ({ flipped }) => (
  <svg
    width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.8"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)", transform: flipped ? "rotate(180deg)" : "none", flexShrink: 0 }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function UserLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [userName, setUserName] = useState("");
  const [time, setTime]         = useState(new Date());
  const [navOpen, setNavOpen]   = useState(false);

  // For sliding pill on desktop
  const tabsRef   = useRef(null);
  const pillRef   = useRef(null);

  const activeIndex = (() => {
    const idx = TABS.findIndex(t =>
      t.to === "/user" ? location.pathname === "/user" : location.pathname.startsWith(t.to)
    );
    return idx === -1 ? 0 : idx;
  })();

  // Slide pill to active tab
  useEffect(() => {
    const nav = tabsRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const tabEls = nav.querySelectorAll(".ul-tab");
    const active = tabEls[activeIndex];
    if (!active) return;
    const navRect  = nav.getBoundingClientRect();
    const tabRect  = active.getBoundingClientRect();
    pill.style.left  = `${tabRect.left - navRect.left}px`;
    pill.style.width = `${tabRect.width}px`;
  }, [activeIndex, location.pathname]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { setNavOpen(false); }, [location.pathname]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("users_profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();
      if (data?.full_name) setUserName(data.full_name.split(" ")[0]);
    })();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const hour = time.getHours();
  const [greetWord, catMood] =
    hour >= 5  && hour < 12 ? ["Morning",   "happy"]   :
    hour >= 12 && hour < 17 ? ["Afternoon", "playful"] :
    hour >= 17 && hour < 21 ? ["Evening",   "relaxed"] :
                              ["Night",     "sleepy"];

  const dateFull  = time.toLocaleString(undefined, { weekday: "long",  month: "long",  day: "numeric", year: "numeric" });
  const dateShort = time.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const timeStr   = time.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  const activeTab = TABS[activeIndex];

  return (
    <div className="ul-wrap">
      <style>{CSS}</style>

      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <header className="ul-header">
        <div className="ul-inner">

          {/* ── TOP ROW ── */}
          <div className="ul-top">
            <h1 className="ul-brand">AIDLA</h1>

            <div className="ul-greeting">
              <CatPet mood={catMood} />
              <div className="ul-greet-text">
                <strong>Good {greetWord}{userName ? `, ${userName}` : ""}!</strong>
                <span className="ul-datetime">
                  <span className="dt-full">{dateFull} • {timeStr}</span>
                  <span className="dt-short">{dateShort} · {timeStr}</span>
                </span>
              </div>
            </div>

            <button onClick={logout} className="ul-logout" title="Logout">
              <LogoutIcon />
              <span className="ul-logout-text">Logout</span>
            </button>
          </div>

          {/* ── NAV ROW ── */}
          <div className="ul-nav-wrap">

            {/* Mobile trigger */}
            <button
              className={`ul-trigger ${navOpen ? "open" : ""}`}
              onClick={() => setNavOpen(v => !v)}
              aria-expanded={navOpen}
            >
              <span className="ul-trigger-left">
                <span className="ul-trigger-icon">{activeTab.icon}</span>
                <span className="ul-trigger-label">{activeTab.label}</span>
              </span>
              <ChevronIcon flipped={navOpen} />
            </button>

            {/* Desktop pill track */}
            <nav
              ref={tabsRef}
              className={`ul-tabs ${navOpen ? "ul-open" : ""}`}
            >
              {/* Sliding pill — desktop only */}
              <span ref={pillRef} className="ul-pill" aria-hidden="true" />

              {TABS.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/user"}
                  onClick={() => setNavOpen(false)}
                  className={({ isActive }) => `ul-tab${isActive ? " active" : ""}`}
                >
                  <span className="ul-tab-icon">{icon}</span>
                  <span className="ul-tab-label">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

        </div>
      </header>

      <main className="ul-main">
        <div className="ul-outlet">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ul-wrap {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: #0f172a;
    overflow-x: hidden;
    position: relative;
  }

  /* ── Orbs ── */
  .bg-orb {
    position: fixed; border-radius: 50%;
    filter: blur(90px); z-index: 0; pointer-events: none;
    animation: floatOrb 20s infinite alternate ease-in-out;
  }
  .orb-1 { width:500px; height:500px; background:rgba(30,58,138,0.10); top:-150px; left:-150px; }
  .orb-2 { width:400px; height:400px; background:rgba(59,130,246,0.10); bottom:-100px; right:-100px; animation-duration:25s; }
  @keyframes floatOrb {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(50px,50px) scale(1.1); }
  }

  /* ── Header ── */
  .ul-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.90);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(226,232,240,0.8);
    box-shadow: 0 1px 0 rgba(255,255,255,0.9), 0 4px 20px rgba(15,23,42,0.05);
  }
  .ul-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 12px 24px;
    display: flex; flex-direction: column; gap: 10px;
  }

  /* ── Top row ── */
  .ul-top { display: flex; align-items: center; gap: 12px; }

  /* Brand */
  .ul-brand {
    font-size: 1.9rem; font-weight: 900; letter-spacing: -1.5px;
    line-height: 1; flex-shrink: 0;
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Greeting card */
  .ul-greeting {
    flex: 1; min-width: 0; overflow: hidden;
    display: flex; align-items: center; gap: 11px;
    background: #f8fafc;
    border: 1px solid rgba(226,232,240,0.9);
    padding: 7px 14px; border-radius: 14px;
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(15,23,42,0.03);
  }
  .ul-greet-text {
    display: flex; flex-direction: column;
    min-width: 0; overflow: hidden;
  }
  .ul-greet-text strong {
    color: #1e3a8a; font-size: 0.9rem; font-weight: 800;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    letter-spacing: -0.2px;
  }
  .ul-datetime { color: #64748b; font-size: 0.72rem; font-weight: 500; margin-top: 1px; }
  .dt-short { display: none; }
  .dt-full  { display: inline; }

  /* Logout */
  .ul-logout {
    display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
    padding: 9px 15px; border-radius: 11px; border: 1px solid rgba(226,232,240,0.9);
    background: #f8fafc; color: #ef4444;
    font-weight: 700; font-size: 0.82rem;
    cursor: pointer; transition: all 0.18s cubic-bezier(0.16,1,0.3,1);
    white-space: nowrap; letter-spacing: -0.1px;
    box-shadow: 0 1px 2px rgba(15,23,42,0.04);
  }
  .ul-logout:hover {
    background: #fff1f2;
    border-color: rgba(252,165,165,0.6);
    color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(239,68,68,0.12);
  }
  .ul-logout:active {
    transform: scale(0.97);
    box-shadow: none;
  }

  /* ── Nav wrapper ── */
  .ul-nav-wrap { position: relative; }

  /* Mobile trigger — hidden on desktop */
  .ul-trigger { display: none; }

  /* ── Desktop tab strip ── */
  .ul-tabs {
    display: flex; gap: 4px; position: relative;
    background: #f1f5f9;
    border: 1px solid rgba(226,232,240,0.9);
    border-radius: 13px;
    padding: 4px;
  }

  /* Sliding pill */
  .ul-pill {
    position: absolute;
    top: 4px; height: calc(100% - 8px);
    background: #ffffff;
    border-radius: 9px;
    border: 1px solid rgba(226,232,240,0.9);
    box-shadow: 0 1px 4px rgba(15,23,42,0.07), 0 0 0 1px rgba(255,255,255,0.5);
    transition: left 0.3s cubic-bezier(0.16,1,0.3,1), width 0.3s cubic-bezier(0.16,1,0.3,1);
    pointer-events: none;
    z-index: 0;
  }

  .ul-tab {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px 10px; border-radius: 9px; text-decoration: none;
    font-weight: 600; font-size: 0.88rem; color: #64748b;
    transition: color 0.2s;
    white-space: nowrap; position: relative; z-index: 1;
    letter-spacing: -0.1px;
  }
  .ul-tab:hover:not(.active) { color: #334155; }
  .ul-tab.active {
    color: #1e3a8a;
    font-weight: 750;
  }
  .ul-tab-icon { font-size: 0.95rem; line-height: 1; }

  /* ── Main content ── */
  .ul-main {
    position: relative; z-index: 10;
    max-width: 1200px; margin: 0 auto;
    padding: 28px 20px;
  }
  .ul-outlet {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.95);
    border-radius: 22px; padding: 28px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.5) inset,
      0 20px 40px rgba(15,23,42,0.05),
      0 1px 0 rgba(255,255,255,0.8);
    animation: popIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes popIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: none; }
  }

  /* ════════════════════════════════
     MOBILE  ≤ 640px
  ════════════════════════════════ */
  @media (max-width: 640px) {
    .ul-inner { padding: 8px 12px; gap: 7px; }

    .ul-brand { font-size: 1.35rem; letter-spacing: -0.8px; }

    .ul-greeting { padding: 5px 10px; border-radius: 11px; gap: 8px; }
    .ul-cat-svg  { width: 30px !important; height: 30px !important; }
    .ul-greet-text strong { font-size: 0.75rem; }
    .ul-datetime { font-size: 0.62rem; }
    .dt-full  { display: none; }
    .dt-short { display: inline; }

    /* Logout — icon only */
    .ul-logout { padding: 8px 9px; border-radius: 9px; gap: 0; }
    .ul-logout-text { display: none; }

    /* Hide desktop tabs, show trigger */
    .ul-tabs { display: none; }

    .ul-trigger {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; padding: 10px 14px;
      border-radius: 11px; border: 1px solid rgba(226,232,240,0.9);
      background: #f8fafc; cursor: pointer; color: #64748b;
      box-shadow: 0 1px 2px rgba(15,23,42,0.04);
      transition: all 0.18s;
    }
    .ul-trigger.open {
      border-radius: 11px 11px 0 0;
      border-bottom-color: transparent;
      background: #f1f5f9;
    }
    .ul-trigger:active { transform: scale(0.99); }

    .ul-trigger-left { display: flex; align-items: center; gap: 8px; }
    .ul-trigger-icon  { font-size: 0.95rem; }
    .ul-trigger-label { font-size: 0.85rem; font-weight: 700; color: #1e3a8a; }

    /* Dropdown panel */
    .ul-tabs.ul-open {
      display: flex; flex-direction: column; gap: 0;
      position: absolute; top: 100%; left: 0; right: 0; z-index: 200;
      background: #f8fafc;
      border: 1px solid rgba(226,232,240,0.9); border-top: none;
      border-radius: 0 0 11px 11px;
      box-shadow: 0 12px 28px rgba(15,23,42,0.09);
      overflow: hidden;
      animation: dropDown 0.22s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    @keyframes dropDown {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: none; }
    }

    /* Hide the pill on mobile */
    .ul-pill { display: none; }

    /* Tab rows inside dropdown */
    .ul-tab {
      flex: none; border-radius: 0;
      padding: 13px 16px; justify-content: flex-start;
      font-size: 0.86rem; color: #64748b;
      border-left: 2.5px solid transparent;
      border-bottom: 1px solid rgba(226,232,240,0.7);
      background: transparent;
      transition: background 0.12s, color 0.12s;
    }
    .ul-tab:last-child { border-bottom: none; }
    .ul-tab:hover:not(.active) {
      background: rgba(15,23,42,0.02);
      color: #334155;
    }
    .ul-tab.active {
      color: #1e3a8a;
      font-weight: 700;
      background: rgba(30,58,138,0.05);
      border-left-color: #2563eb;
    }
    .ul-tab-icon { width: 22px; flex-shrink: 0; font-size: 0.95rem; }

    .ul-main   { padding: 12px 10px; }
    .ul-outlet { padding: 14px 12px; border-radius: 16px; }
  }

  /* ════════════════════════════════
     EXTRA SMALL  ≤ 380px
  ════════════════════════════════ */
  @media (max-width: 380px) {
    .ul-brand { font-size: 1.15rem; }
    .ul-cat-svg { width: 26px !important; height: 26px !important; }
    .ul-greet-text strong { font-size: 0.68rem; }
    .ul-datetime { font-size: 0.58rem; }
    .ul-logout { padding: 7px 8px; }
    .ul-main   { padding: 10px 8px; }
    .ul-outlet { padding: 11px 10px; border-radius: 13px; }
  }
`;