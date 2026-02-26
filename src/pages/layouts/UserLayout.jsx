import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

// ── Animated SVG white cat ──
function CatPet({ mood }) {
  // mood: 'happy' | 'playful' | 'relaxed' | 'sleepy'
  const isSleepy   = mood === 'sleepy';
  const isPlayful  = mood === 'playful';
  const isRelaxed  = mood === 'relaxed';

  return (
    <svg
      className={`ul-cat-svg mood-${mood}`}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .ul-cat-svg { width:40px; height:40px; flex-shrink:0; overflow:visible; }

        /* Body bounce based on mood */
        .mood-happy   { animation: catHappyBob  0.9s infinite alternate ease-in-out; }
        .mood-playful { animation: catPlayfulWig 1.4s infinite ease-in-out; }
        .mood-relaxed { animation: catRelaxFloat 3s   infinite ease-in-out; }
        .mood-sleepy  { animation: catSleepBrth  4s   infinite ease-in-out; }

        @keyframes catHappyBob  { from{transform:translateY(0)}              to{transform:translateY(-4px)} }
        @keyframes catPlayfulWig{ 0%,100%{transform:rotate(-6deg)}           50%{transform:rotate(6deg)} }
        @keyframes catRelaxFloat{ 0%,100%{transform:translateY(0) scale(1)}  50%{transform:translateY(-3px) scale(1.02)} }
        @keyframes catSleepBrth { 0%,100%{transform:scale(1)}                50%{transform:scale(1.04)} }

        /* Tail wag */
        .cat-tail { transform-origin: 8px 6px; animation: tailWag 1.6s infinite ease-in-out; }
        @keyframes tailWag { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} }

        /* Ear twitch */
        .cat-ear-l { transform-origin: 10px 14px; animation: earL 3s infinite ease-in-out; }
        .cat-ear-r { transform-origin: 54px 14px; animation: earR 3s 0.4s infinite ease-in-out; }
        @keyframes earL { 0%,80%,100%{transform:rotate(0)}  90%{transform:rotate(-12deg)} }
        @keyframes earR { 0%,80%,100%{transform:rotate(0)}  90%{transform:rotate(12deg)} }

        /* Eye blink */
        .cat-eye-l, .cat-eye-r { animation: eyeBlink 4s 1.5s infinite; }
        @keyframes eyeBlink { 0%,94%,100%{transform:scaleY(1)} 96%{transform:scaleY(0.05)} }

        /* Sleepy Z */
        .cat-zzz { animation: floatZ 2s infinite ease-in-out; opacity:0; }
        .cat-zzz.show { animation: floatZShow 2s infinite ease-in-out; }
        @keyframes floatZShow { 0%{opacity:0;transform:translateY(0)scale(0.6)} 30%{opacity:1} 100%{opacity:0;transform:translateY(-12px)scale(1)} }

        /* Playful sparkle */
        .cat-spark { opacity:0; }
        .cat-spark.show { animation: sparkPop 1.4s 0.6s infinite ease-out; }
        @keyframes sparkPop { 0%,100%{opacity:0;transform:scale(0)} 40%{opacity:1;transform:scale(1.2)} 70%{opacity:0.6;transform:scale(0.8)} }
      `}</style>

      {/* Shadow */}
      <ellipse cx="32" cy="60" rx="14" ry="3" fill="rgba(0,0,0,0.08)" />

      {/* Tail */}
      <g className="cat-tail" style={{transformOrigin:'20px 52px'}}>
        <path d="M20 52 Q6 50 8 40 Q10 34 16 38" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M20 52 Q6 50 8 40 Q10 34 16 38" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </g>

      {/* Body */}
      <ellipse cx="32" cy="46" rx="16" ry="13" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
      {/* Belly spot */}
      <ellipse cx="32" cy="48" rx="8" ry="7" fill="#fafafa" stroke="#f1f5f9" strokeWidth="1"/>

      {/* Left ear */}
      <g className="cat-ear-l">
        <polygon points="12,18 8,6 20,14" fill="white" stroke="#e2e8f0" strokeWidth="1.5" strokeLinejoin="round"/>
        <polygon points="13,17 10,8 19,14" fill="#fecdd3" opacity="0.6"/>
      </g>

      {/* Right ear */}
      <g className="cat-ear-r">
        <polygon points="52,18 56,6 44,14" fill="white" stroke="#e2e8f0" strokeWidth="1.5" strokeLinejoin="round"/>
        <polygon points="51,17 54,8 45,14" fill="#fecdd3" opacity="0.6"/>
      </g>

      {/* Head */}
      <circle cx="32" cy="26" r="17" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>

      {/* Eyes */}
      {isSleepy ? (
        <>
          <path d="M23 25 Q26 22 29 25" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M35 25 Q38 22 41 25" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </>
      ) : (
        <>
          <g className="cat-eye-l" style={{transformOrigin:'26px 25px'}}>
            <circle cx="26" cy="25" r="4.5" fill="#1e293b"/>
            <circle cx="26" cy="25" r="3"   fill="#334155"/>
            <circle cx="24.5" cy="23.5" r="1.2" fill="white" opacity="0.9"/>
          </g>
          <g className="cat-eye-r" style={{transformOrigin:'38px 25px'}}>
            <circle cx="38" cy="25" r="4.5" fill="#1e293b"/>
            <circle cx="38" cy="25" r="3"   fill="#334155"/>
            <circle cx="36.5" cy="23.5" r="1.2" fill="white" opacity="0.9"/>
          </g>
        </>
      )}

      {/* Nose */}
      <polygon points="32,30 30,32 34,32" fill="#fda4af" />

      {/* Mouth */}
      <path d="M30 32 Q32 35 34 32" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" fill="none"/>

      {/* Whiskers left */}
      <line x1="14" y1="29" x2="26" y2="31" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
      <line x1="14" y1="32" x2="26" y2="32" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
      <line x1="15" y1="35" x2="26" y2="33" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>

      {/* Whiskers right */}
      <line x1="50" y1="29" x2="38" y2="31" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
      <line x1="50" y1="32" x2="38" y2="32" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
      <line x1="49" y1="35" x2="38" y2="33" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>

      {/* Front paws */}
      <ellipse cx="24" cy="58" rx="5" ry="3.5" fill="white" stroke="#e2e8f0" strokeWidth="1.2"/>
      <ellipse cx="40" cy="58" rx="5" ry="3.5" fill="white" stroke="#e2e8f0" strokeWidth="1.2"/>

      {/* Sleepy Z */}
      <text className={`cat-zzz ${isSleepy ? 'show' : ''}`} x="46" y="16" fontSize="9" fill="#94a3b8" fontWeight="bold">z</text>
      <text className={`cat-zzz ${isSleepy ? 'show' : ''}`} x="50" y="9"  fontSize="7" fill="#94a3b8" fontWeight="bold" style={{animationDelay:'0.8s'}}>z</text>

      {/* Playful sparkle ✦ */}
      <text className={`cat-spark ${isPlayful ? 'show' : ''}`} x="48" y="12" fontSize="10" fill="#fbbf24">✦</text>
    </svg>
  );
}

const TABS = [
  { to: "/user",         label: "Dashboard", icon: "⚡" },
  { to: "/user/feed",    label: "Feed",       icon: "📡" },
  { to: "/user/wallet",  label: "Wallet",     icon: "💎" },
  { to: "/user/profile", label: "Profile",    icon: "👤" },
];

export default function UserLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [userName, setUserName] = useState("");
  const [time, setTime]         = useState(new Date());
  const [navOpen, setNavOpen]   = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close dropdown when route changes
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
  const [greetWord, catAnim] =
    hour >= 5  && hour < 12 ? ["Morning",   "cat-bounce"]  :
    hour >= 12 && hour < 17 ? ["Afternoon", "cat-wiggle"]  :
    hour >= 17 && hour < 21 ? ["Evening",   "cat-float"]   :
                              ["Night",     "cat-breathe"];

  const dateFull  = time.toLocaleString(undefined, { weekday: "long",  month: "long",  day: "numeric", year: "numeric" });
  const dateShort = time.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const timeStr   = time.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  const activeTab = TABS.find(t =>
    t.to === "/user" ? location.pathname === "/user" : location.pathname.startsWith(t.to)
  ) || TABS[0];

  return (
    <div className="ul-wrap">
      <style>{CSS}</style>

      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <header className="ul-header">
        <div className="ul-inner">

          {/* ── TOP ROW: Brand · Greeting · Logout ── */}
          <div className="ul-top">

            <h1 className="ul-brand">AIDLA</h1>

            <div className="ul-greeting">
              <CatPet mood={
                catAnim === 'cat-bounce'  ? 'happy'   :
                catAnim === 'cat-wiggle'  ? 'playful' :
                catAnim === 'cat-float'   ? 'relaxed' : 'sleepy'
              } />
              <div className="ul-greet-text">
                <strong>Good {greetWord}{userName ? `, ${userName}` : ""}!</strong>
                <span className="ul-datetime">
                  <span className="dt-full">{dateFull} • {timeStr}</span>
                  <span className="dt-short">{dateShort} · {timeStr}</span>
                </span>
              </div>
            </div>

            {/* Logout — icon+text on desktop, icon-only on mobile */}
            <button onClick={logout} className="ul-logout" title="Logout">
              <svg className="ul-logout-icon" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="ul-logout-text">Logout</span>
            </button>
          </div>

          {/* ── NAV ROW ── */}
          <div className="ul-nav-wrap">

            {/* Mobile trigger (hidden on desktop) */}
            <button
              className={`ul-trigger ${navOpen ? "open" : ""}`}
              onClick={() => setNavOpen(v => !v)}
              aria-expanded={navOpen}
            >
              <span className="ul-trigger-left">
                <span className="ul-trigger-icon">{activeTab.icon}</span>
                <span className="ul-trigger-label">{activeTab.label}</span>
              </span>
              <svg
                className={`ul-chevron ${navOpen ? "flipped" : ""}`}
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.8"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* Desktop: full tab row | Mobile: dropdown */}
            <nav className={`ul-tabs ${navOpen ? "ul-open" : ""}`}>
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
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ul-wrap {
    min-height: 100vh; background: #f0f4f8;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: #0f172a; overflow-x: hidden; position: relative;
  }

  /* Orbs */
  .bg-orb { position:fixed; border-radius:50%; filter:blur(90px); z-index:0; pointer-events:none; animation:floatOrb 20s infinite alternate ease-in-out; }
  .orb-1  { width:500px; height:500px; background:rgba(30,58,138,0.12); top:-150px; left:-150px; }
  .orb-2  { width:400px; height:400px; background:rgba(59,130,246,0.12); bottom:-100px; right:-100px; animation-duration:25s; }
  @keyframes floatOrb { 0%{transform:translate(0,0)scale(1)} 100%{transform:translate(50px,50px)scale(1.1)} }

  /* Header */
  .ul-header {
    position:sticky; top:0; z-index:100;
    background:rgba(255,255,255,0.88); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(255,255,255,0.9); box-shadow:0 4px 24px rgba(15,23,42,0.06);
  }
  .ul-inner { max-width:1200px; margin:0 auto; padding:12px 24px; display:flex; flex-direction:column; gap:12px; }

  /* Top row */
  .ul-top { display:flex; align-items:center; gap:12px; }

  /* Brand */
  .ul-brand {
    font-size:2rem; font-weight:900; letter-spacing:-1px; line-height:1; flex-shrink:0;
    background:linear-gradient(135deg,#1e3a8a,#3b82f6);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  }

  /* Greeting */
  .ul-greeting {
    flex:1; min-width:0; overflow:hidden;
    display:flex; align-items:center; gap:12px;
    background:#f8fafc; padding:8px 16px; border-radius:16px;
    box-shadow:inset 3px 3px 6px rgba(15,23,42,0.04),inset -3px -3px 6px rgba(255,255,255,1);
  }
  /* .ul-cat-svg sizing is handled inside the SVG component itself */
  .ul-greet-text { display:flex; flex-direction:column; min-width:0; overflow:hidden; }
  .ul-greet-text strong { color:#1e3a8a; font-size:0.95rem; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .ul-datetime { color:#64748b; font-size:0.75rem; font-weight:600; }
  .dt-short { display:none; }
  .dt-full  { display:inline; }

  /* Cat animations */
  .cat-bounce  { animation:catBounce  1s   infinite alternate cubic-bezier(.5,0,.5,1); }
  .cat-wiggle  { animation:catWiggle  2s   infinite; }
  .cat-float   { animation:catFloat   3s   infinite ease-in-out; }
  .cat-breathe { animation:catBreathe 4s   infinite ease-in-out; }
  @keyframes catBounce  { from{transform:translateY(0)}             to{transform:translateY(-5px)} }
  @keyframes catWiggle  { 0%,100%{transform:rotate(0)}              25%{transform:rotate(-10deg)} 75%{transform:rotate(10deg)} }
  @keyframes catFloat   { 0%,100%{transform:translateY(0)scale(1)}  50%{transform:translateY(-4px)scale(1.05)} }
  @keyframes catBreathe { 0%,100%{transform:scale(1);opacity:.8}    50%{transform:scale(1.1);opacity:1} }

  /* Logout */
  .ul-logout {
    display:inline-flex; align-items:center; gap:6px; flex-shrink:0;
    padding:10px 16px; border-radius:12px; border:none;
    background:#f1f5f9; color:#ef4444; font-weight:700; font-size:0.85rem;
    box-shadow:4px 4px 10px rgba(15,23,42,0.06),-4px -4px 10px rgba(255,255,255,1);
    cursor:pointer; transition:all 0.2s; white-space:nowrap;
  }
  .ul-logout:hover  { color:#dc2626; transform:translateY(-1px); box-shadow:6px 6px 12px rgba(15,23,42,0.08),-6px -6px 12px rgba(255,255,255,1); }
  .ul-logout:active { transform:translateY(1px); box-shadow:inset 2px 2px 5px rgba(15,23,42,0.06),inset -2px -2px 5px rgba(255,255,255,1); }

  /* Nav wrapper */
  .ul-nav-wrap { position:relative; }

  /* Trigger — hidden on desktop */
  .ul-trigger { display:none; }

  /* Desktop tabs */
  .ul-tabs { display:flex; gap:12px; }
  .ul-tab {
    flex:1; display:flex; align-items:center; justify-content:center; gap:7px;
    padding:11px 10px; border-radius:14px; text-decoration:none;
    font-weight:600; font-size:0.95rem; color:#64748b; background:#f8fafc;
    box-shadow:4px 4px 8px rgba(15,23,42,0.05),-4px -4px 8px rgba(255,255,255,1);
    transition:all 0.2s; white-space:nowrap;
  }
  .ul-tab:hover  { color:#1e3a8a; transform:translateY(-1px); }
  .ul-tab.active {
    background:#e0e7ff; color:#1e3a8a; font-weight:800;
    box-shadow:inset 3px 3px 6px rgba(15,23,42,0.08),inset -3px -3px 6px rgba(255,255,255,1);
    transform:translateY(1px);
  }
  .ul-tab-icon { font-size:1rem; }

  /* Main */
  .ul-main { position:relative; z-index:10; max-width:1200px; margin:0 auto; padding:30px 20px; }
  .ul-outlet {
    background:rgba(255,255,255,0.7); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,1); border-radius:24px; padding:30px;
    box-shadow:15px 15px 40px rgba(15,23,42,0.05),-15px -15px 40px rgba(255,255,255,0.8),inset 0 0 0 1px rgba(255,255,255,0.5);
    animation:popIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes popIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

  /* ═══════════════════════════════════
     MOBILE  ≤ 640px
  ═══════════════════════════════════ */
  @media (max-width: 640px) {
    .ul-inner { padding:8px 12px; gap:7px; }

    /* Smaller brand */
    .ul-brand { font-size:1.3rem; letter-spacing:-0.5px; }

    /* Compact greeting */
    .ul-greeting { padding:5px 10px; border-radius:12px; gap:7px; }
    .ul-cat-svg { width:32px; height:32px; }
    .ul-greet-text strong { font-size:0.76rem; }
    .ul-datetime { font-size:0.6rem; }
    .dt-full  { display:none; }
    .dt-short { display:inline; }

    /* Logout: icon only */
    .ul-logout { padding:8px 9px; border-radius:10px; gap:0; }
    .ul-logout-text { display:none; }

    /* Show trigger, hide desktop tabs */
    .ul-trigger {
      display:flex; align-items:center; justify-content:space-between;
      width:100%; padding:10px 14px; border-radius:12px; border:none;
      background:#f8fafc; cursor:pointer;
      box-shadow:3px 3px 8px rgba(15,23,42,0.05),-3px -3px 8px rgba(255,255,255,1);
      transition:all 0.15s;
    }
    .ul-trigger.open {
      border-radius:12px 12px 0 0;
      box-shadow:inset 2px 2px 5px rgba(15,23,42,0.06),inset -2px -2px 5px rgba(255,255,255,1);
    }
    .ul-trigger-left { display:flex; align-items:center; gap:8px; }
    .ul-trigger-icon  { font-size:1rem; }
    .ul-trigger-label { font-size:0.85rem; font-weight:700; color:#1e3a8a; }
    .ul-chevron { color:#94a3b8; display:block; transition:transform 0.22s cubic-bezier(0.16,1,0.3,1); }
    .ul-chevron.flipped { transform:rotate(180deg); }

    /* Dropdown panel */
    .ul-tabs {
      display:none;
      position:absolute; top:100%; left:0; right:0; z-index:200;
      flex-direction:column; gap:0;
      background:rgba(248,250,252,0.98);
      backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
      border:1px solid rgba(255,255,255,0.9); border-top:none;
      border-radius:0 0 14px 14px;
      box-shadow:0 14px 30px rgba(15,23,42,0.1);
      overflow:hidden;
    }
    .ul-tabs.ul-open {
      display:flex;
      animation:dropDown 0.22s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    @keyframes dropDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }

    /* Tab rows in dropdown */
    .ul-tab {
      flex:none; border-radius:0; padding:13px 16px;
      justify-content:flex-start; box-shadow:none; background:transparent;
      font-size:0.88rem; border-bottom:1px solid rgba(15,23,42,0.05);
      transition:background 0.12s;
    }
    .ul-tab:last-child  { border-bottom:none; }
    .ul-tab:hover       { transform:none; background:rgba(30,58,138,0.04); }
    .ul-tab.active      {
      background:rgba(224,231,255,0.7); box-shadow:none; transform:none;
      border-left:3px solid #3b82f6; color:#1e3a8a;
    }
    .ul-tab-icon { width:24px; flex-shrink:0; font-size:1rem; }

    /* Tighter main */
    .ul-main   { padding:12px 10px; }
    .ul-outlet { padding:14px 12px; border-radius:16px; }
  }

  /* ═══════════════════════════════════
     EXTRA SMALL  ≤ 380px
  ═══════════════════════════════════ */
  @media (max-width: 380px) {
    .ul-brand { font-size:1.1rem; }
    .ul-cat-svg { width:28px; height:28px; }
    .ul-greet-text strong { font-size:0.68rem; }
    .ul-datetime { font-size:0.58rem; }
    .dt-short { display:inline; }
    .dt-full  { display:none; }
    .ul-logout { padding:7px 8px; }
    .ul-main   { padding:10px 8px; }
    .ul-outlet { padding:11px 10px; border-radius:13px; }
  }
`;