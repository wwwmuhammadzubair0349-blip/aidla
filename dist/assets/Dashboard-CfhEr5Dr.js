import"./vendor-helmet-D-cMCI9i.js";import"./vendor-misc-DjQaoctO.js";import{l as e}from"./vendor-router-BeHthcJc.js";import{r as t}from"./vendor-motion-DyarDpDD.js";var n=t();function r({onClick:e}){return(0,n.jsxs)(`div`,{className:`bot-wrap`,onClick:e,title:`Ask AIDLA Bot`,children:[(0,n.jsx)(`div`,{className:`bot-ring ring-1`}),(0,n.jsx)(`div`,{className:`bot-ring ring-2`}),(0,n.jsx)(`button`,{className:`bot-fab`,children:(0,n.jsx)(`span`,{className:`bot-icon`,children:`🤖`})}),(0,n.jsx)(`div`,{className:`bot-tooltip`,children:`Ask AIDLA Bot`})]})}function i({title:t,subtitle:r,icon:i,to:a,accentClass:o,badgeColor:s}){let c=e();return(0,n.jsxs)(`button`,{className:`hero-card ${o}`,onClick:()=>c(a),children:[(0,n.jsx)(`span`,{className:`hero-badge ${s}`,children:`✦ Featured`}),(0,n.jsx)(`span`,{className:`hero-icon`,children:i}),(0,n.jsx)(`div`,{className:`hero-title`,children:t}),(0,n.jsx)(`div`,{className:`hero-sub`,children:r}),(0,n.jsx)(`span`,{className:`hero-arrow`,children:`→`})]})}function a({title:t,subtitle:r,icon:i,to:a,iconClass:o,isSoon:s}){let c=e();return(0,n.jsxs)(`button`,{className:`reg-card`,onClick:()=>c(a),disabled:s,children:[(0,n.jsx)(`div`,{className:`reg-icon ${o}`,children:(0,n.jsx)(`span`,{className:`reg-icon-inner`,children:i})}),(0,n.jsxs)(`div`,{className:`reg-text`,children:[(0,n.jsx)(`div`,{className:`reg-title`,children:t}),(0,n.jsx)(`div`,{className:`reg-sub`,children:r})]}),s&&(0,n.jsx)(`span`,{className:`badge-soon`,children:`Soon`})]})}function o({label:e,labelClass:t,children:r}){return(0,n.jsxs)(`div`,{className:`section-block`,children:[(0,n.jsx)(`div`,{className:`section-label ${t}`,children:e}),(0,n.jsx)(`div`,{className:`cards-grid`,children:r})]})}function s(){let t=e();return(0,n.jsxs)(`div`,{className:`dashboard`,children:[(0,n.jsx)(`style`,{children:c}),(0,n.jsxs)(`div`,{className:`dash-header`,children:[(0,n.jsx)(`h2`,{className:`dash-title`,children:`Dashboard`}),(0,n.jsx)(`p`,{className:`dash-sub`,children:`Welcome to your AIDLA user area. Explore your features below.`})]}),(0,n.jsxs)(`div`,{className:`hero-row`,children:[(0,n.jsx)(i,{title:`AI Career Coach`,subtitle:`Your personalized AI-powered career advisor, always ready.`,icon:`📖`,to:`/user/learning`,accentClass:`hero-blue`,badgeColor:`badge-blue`}),(0,n.jsx)(i,{title:`Courses`,subtitle:`Paid & free specialized courses tailored for your growth.`,icon:`🎓`,to:`/user/courses`,accentClass:`hero-emerald`,badgeColor:`badge-emerald`})]}),(0,n.jsxs)(o,{label:`📘 Learn`,labelClass:`label-blue`,children:[(0,n.jsx)(a,{title:`Test`,subtitle:`Testing & assessments`,icon:`✅`,to:`/user/test`,iconClass:`ic-blue`}),(0,n.jsx)(a,{title:`Resources`,subtitle:`Study materials & past papers`,icon:`📚`,to:`/user/UserResources`,iconClass:`ic-blue`}),(0,n.jsx)(a,{title:`Mining`,subtitle:`Start mining AIDLA coins`,icon:`💎`,to:`/user/mining`,iconClass:`ic-blue`})]}),(0,n.jsxs)(o,{label:`🏆 Earn & Play`,labelClass:`label-amber`,children:[(0,n.jsx)(a,{title:`Lucky Draw`,subtitle:`Scheduled draws & big prizes`,icon:`🎟️`,to:`/user/lucky-draw`,iconClass:`ic-amber`}),(0,n.jsx)(a,{title:`Lucky Wheel`,subtitle:`Spin the wheel & win rewards`,icon:`🎡`,to:`/user/lucky-wheel`,iconClass:`ic-amber`}),(0,n.jsx)(a,{title:`Shop`,subtitle:`Buy products with AIDLA coins`,icon:`🛍️`,to:`/user/shop`,iconClass:`ic-amber`})]}),(0,n.jsxs)(o,{label:`🛠️ Tools`,labelClass:`label-purple`,children:[(0,n.jsx)(a,{title:`AutoTube`,subtitle:`Full YouTube automation assistant`,icon:`🎬`,to:`/user/AutoTubeStudio`,iconClass:`ic-purple`}),(0,n.jsx)(a,{title:`Follow Us`,subtitle:`Join our social media channels`,icon:`📱`,to:`/user/social`,iconClass:`ic-coral`})]}),(0,n.jsx)(r,{onClick:()=>t(`/user/bot`)})]})}var c=`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');

  .dashboard {
    font-family: 'DM Sans', system-ui, sans-serif;
    position: relative;
    min-height: 60vh;
    animation: dashIn 0.45s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes dashIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: none; }
  }

  /* ── Frosted background mesh ── */
  .dashboard::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 20%, rgba(219,234,254,0.55) 0%, transparent 70%),
      radial-gradient(ellipse 50% 60% at 80% 80%, rgba(209,250,229,0.45) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 60% 30%, rgba(237,233,254,0.35) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
  .dashboard > * { position: relative; z-index: 1; }

  /* ── Header ── */
  .dash-header { margin-bottom: 22px; }
  .dash-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem; font-weight: 400;
    color: #0f172a; letter-spacing: -0.5px; line-height: 1.1;
    margin-bottom: 6px;
  }
  .dash-sub { font-size: 0.88rem; color: #64748b; font-weight: 500; }

  /* ── Hero Row ── */
  .hero-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 28px;
  }

  .hero-card {
    border: none; border-radius: 22px;
    padding: 22px 20px 20px;
    cursor: pointer; text-align: left;
    position: relative; overflow: hidden;
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s;
    display: flex; flex-direction: column;
    box-shadow: 0 2px 0 rgba(255,255,255,0.8) inset, 0 8px 32px rgba(15,23,42,0.07);
  }
  .hero-card::before {
    content: '';
    position: absolute; inset: 0;
    border-radius: 22px;
    border: 1px solid rgba(255,255,255,0.75);
    pointer-events: none;
  }
  .hero-card:hover  { transform: translateY(-4px); box-shadow: 0 2px 0 rgba(255,255,255,0.8) inset, 0 16px 40px rgba(15,23,42,0.10); }
  .hero-card:active { transform: scale(0.98); }

  .hero-blue    { background: rgba(219,234,254,0.62); }
  .hero-emerald { background: rgba(209,250,229,0.62); }

  .hero-badge {
    font-size: 9px; font-weight: 800;
    letter-spacing: 0.8px; text-transform: uppercase;
    padding: 4px 10px; border-radius: 20px;
    display: inline-block; margin-bottom: 14px;
    backdrop-filter: blur(8px); width: fit-content;
  }
  .badge-blue    { background: rgba(219,234,254,0.9); color: #1e40af; border: 1px solid rgba(147,197,253,0.5); }
  .badge-emerald { background: rgba(209,250,229,0.9); color: #065f46; border: 1px solid rgba(110,231,183,0.5); }

  .hero-icon  { font-size: 2rem; margin-bottom: 10px; display: block; }
  .hero-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 5px; letter-spacing: -0.3px; }
  .hero-sub   { font-size: 0.78rem; color: #475569; line-height: 1.5; flex: 1; }
  .hero-arrow {
    position: absolute; bottom: 18px; right: 20px;
    font-size: 1rem; color: rgba(15,23,42,0.2);
    transition: color 0.2s, transform 0.2s;
  }
  .hero-card:hover .hero-arrow { color: rgba(15,23,42,0.5); transform: translateX(3px); }

  /* ── Section ── */
  .section-block { margin-bottom: 22px; }
  .section-label {
    font-size: 10px; font-weight: 800;
    letter-spacing: 1.2px; text-transform: uppercase;
    margin-bottom: 10px; padding: 0 2px;
  }
  .label-blue   { color: #1e40af; }
  .label-amber  { color: #92400e; }
  .label-purple { color: #5b21b6; }

  /* ── Cards Grid ── */
  .cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  /* ── Regular Card ── */
  .reg-card {
    background: rgba(255,255,255,0.58);
    border: 1px solid rgba(255,255,255,0.85);
    border-radius: 16px;
    padding: 13px 13px;
    cursor: pointer; text-align: left;
    display: flex; align-items: center; gap: 11px;
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    transition: transform 0.18s cubic-bezier(0.16,1,0.3,1), background 0.18s, box-shadow 0.18s;
    position: relative; overflow: hidden;
    box-shadow: 0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 8px rgba(15,23,42,0.04);
    width: 100%;
  }
  .reg-card:hover {
    background: rgba(255,255,255,0.78);
    transform: translateY(-2px);
    box-shadow: 0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 20px rgba(15,23,42,0.07);
  }
  .reg-card:active  { transform: scale(0.97); }
  .reg-card:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .reg-icon {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    backdrop-filter: blur(8px);
  }
  .reg-icon-inner { font-size: 18px; line-height: 1; }

  .ic-blue   { background: rgba(219,234,254,0.8);  border: 1px solid rgba(147,197,253,0.35); }
  .ic-amber  { background: rgba(254,243,199,0.8);  border: 1px solid rgba(252,211,77,0.35); }
  .ic-purple { background: rgba(237,233,254,0.8);  border: 1px solid rgba(196,181,253,0.35); }
  .ic-coral  { background: rgba(254,226,226,0.8);  border: 1px solid rgba(252,165,165,0.35); }

  .reg-title { font-size: 0.82rem; font-weight: 700; color: #0f172a; margin-bottom: 2px; letter-spacing: -0.15px; }
  .reg-sub   { font-size: 0.7rem; color: #64748b; line-height: 1.3; }

  .badge-soon {
    position: absolute; top: 9px; right: 9px;
    background: rgba(241,245,249,0.85);
    color: #94a3b8; font-size: 0.6rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.4px;
    padding: 3px 7px; border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.8);
  }

  /* ── Floating Bot ── */
  .bot-wrap {
    position: fixed;
    bottom: 28px; right: 24px;
    z-index: 9999;
    cursor: pointer;
  }

  .bot-ring {
    position: absolute;
    border-radius: 50%;
    background: rgba(59,130,246,0.2);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }
  .ring-1 {
    width: 58px; height: 58px;
    animation: botPulse 2.4s infinite ease-out;
  }
  .ring-2 {
    width: 58px; height: 58px;
    animation: botPulse 2.4s 0.8s infinite ease-out;
  }
  @keyframes botPulse {
    0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.7; }
    100% { transform: translate(-50%,-50%) scale(2);   opacity: 0; }
  }

  .bot-fab {
    position: relative; z-index: 2;
    width: 54px; height: 54px; border-radius: 50%;
    background: rgba(255,255,255,0.75);
    border: 1px solid rgba(255,255,255,0.95);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 4px 20px rgba(59,130,246,0.25), 0 1px 0 rgba(255,255,255,0.9) inset;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s;
  }
  .bot-fab:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 28px rgba(59,130,246,0.35), 0 1px 0 rgba(255,255,255,0.9) inset;
  }
  .bot-fab:active { transform: scale(0.93); }
  .bot-icon { font-size: 22px; line-height: 1; }

  .bot-tooltip {
    position: absolute;
    bottom: 62px; right: 0;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.95);
    border-radius: 10px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 700; color: #1e3a8a;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(15,23,42,0.08);
    opacity: 0; pointer-events: none;
    transform: translateY(4px);
    transition: opacity 0.2s, transform 0.2s;
  }
  .bot-wrap:hover .bot-tooltip {
    opacity: 1;
    transform: translateY(0);
  }

  /* ══════════════════════════════
     MOBILE  ≤ 640px
  ══════════════════════════════ */
  @media (max-width: 640px) {
    .dash-title { font-size: 1.55rem; }
    .dash-sub   { font-size: 0.8rem; }
    .dash-header { margin-bottom: 16px; }

    .hero-row { grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
    .hero-card { padding: 14px 13px 30px; border-radius: 17px; }
    .hero-icon  { font-size: 1.6rem; margin-bottom: 7px; }
    .hero-title { font-size: 0.82rem; }
    .hero-sub   { font-size: 0.68rem; }
    .hero-badge { font-size: 8px; padding: 3px 8px; margin-bottom: 10px; }

    .cards-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
    .reg-card   { padding: 11px 10px; border-radius: 13px; gap: 9px; }
    .reg-icon   { width: 34px; height: 34px; border-radius: 9px; }
    .reg-icon-inner { font-size: 15px; }
    .reg-title  { font-size: 0.75rem; }
    .reg-sub    { font-size: 0.62rem; }

    .section-block  { margin-bottom: 16px; }
    .section-label  { font-size: 9px; }

    .bot-wrap { bottom: 18px; right: 16px; }
    .bot-fab  { width: 48px; height: 48px; }
    .bot-icon { font-size: 20px; }
  }

  /* ══════════════════════════════
     EXTRA SMALL  ≤ 380px
  ══════════════════════════════ */
  @media (max-width: 380px) {
    .hero-row { grid-template-columns: 1fr 1fr; gap: 8px; }
    .hero-card { padding: 12px 10px 28px; border-radius: 14px; }
    .hero-title { font-size: 0.76rem; }
    .hero-sub   { font-size: 0.62rem; }
    .hero-icon  { font-size: 1.4rem; }

    .reg-card  { padding: 9px 8px; gap: 7px; }
    .reg-icon  { width: 30px; height: 30px; border-radius: 8px; }
    .reg-icon-inner { font-size: 13px; }
    .reg-title { font-size: 0.7rem; }
    .reg-sub   { font-size: 0.58rem; }
  }
`;export{s as default};