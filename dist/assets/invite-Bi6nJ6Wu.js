import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t}from"./vendor-helmet-D-cMCI9i.js";import{tr as n}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as r}from"./supabase-CXCPPx9q.js";import{r as i}from"./vendor-motion-DyarDpDD.js";var a=e(t(),1),o=i();function s(){let[e,t]=(0,a.useState)(!0),[i,s]=(0,a.useState)(``),[c,l]=(0,a.useState)(0),[u,d]=(0,a.useState)(``),[f,p]=(0,a.useState)(null),[m,h]=(0,a.useState)([]),[g,_]=(0,a.useState)(!0),v=(0,a.useMemo)(()=>i?`${window.location.origin}/signup?ref=${encodeURIComponent(i)}`:``,[i]),y=(0,a.useMemo)(()=>i?`Join AIDLA 🚀\n\nMy Invite Code: ${i}\nSignup Link: ${v}`:``,[i,v]);(0,a.useEffect)(()=>{n(function*(){var e;d(``),t(!0);let{data:n,error:i}=yield r.auth.getUser(),a=n==null||(e=n.user)==null?void 0:e.id;if(i||!a){d(`Not logged in.`),t(!1);return}let{data:o,error:c}=yield r.from(`users_profiles`).select(`my_refer_code, full_name, my_referals`).eq(`user_id`,a).single();if(c&&c.code===`PGRST116`){var u;let e=(n.user.email||``).toLowerCase(),i=((u=n.user.user_metadata)==null?void 0:u.full_name)||`User`,{error:s}=yield r.from(`users_profiles`).insert([{user_id:a,email:e,full_name:i}]);if(s){d(s.message),t(!1);return}let l=yield r.from(`users_profiles`).select(`my_refer_code, my_referals`).eq(`user_id`,a).single();o=l.data,c=l.error}if(c){d(c.message),t(!1);return}if(o!=null&&o.my_refer_code)s(o.my_refer_code),l(o.my_referals||0);else{yield r.from(`users_profiles`).update({my_refer_code:null}).eq(`user_id`,a);let{data:e,error:n}=yield r.from(`users_profiles`).select(`my_refer_code, my_referals`).eq(`user_id`,a).single();if(n){d(n.message),t(!1);return}s(e.my_refer_code||``),l(e.my_referals||0)}t(!1)})()},[]),(0,a.useEffect)(()=>{i&&n(function*(){_(!0);let{data:e,error:t}=yield r.from(`users_profiles`).select(`full_name, email, created_at`).eq(`referral_code_used`,i).order(`created_at`,{ascending:!1});!t&&e?h(e):console.error(`Referrals error:`,t==null?void 0:t.message),_(!1)})()},[i]);function b(e,t){return x.apply(this,arguments)}function x(){return x=n(function*(e,t){try{yield navigator.clipboard.writeText(e),p(t),setTimeout(()=>p(null),2500)}catch(e){d(`Copy failed. Please copy manually.`)}}),x.apply(this,arguments)}function S(){return C.apply(this,arguments)}function C(){return C=n(function*(){if(navigator.share)try{yield navigator.share({title:`Join AIDLA 🚀`,text:`Join AIDLA with my invite code: ${i}`,url:v})}catch(e){e.name!==`AbortError`&&d(`Share failed.`)}else yield b(v,`link`),d(`✅ Link copied! (Native share not supported on this browser)`),setTimeout(()=>d(``),3e3)}),C.apply(this,arguments)}function w(e){return e?new Date(e).toLocaleDateString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`}):`—`}return(0,o.jsxs)(`div`,{className:`invite-wrapper`,children:[(0,o.jsx)(`style`,{children:`
    * { box-sizing: border-box; }

    .invite-wrapper {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      animation: fadeIn 0.3s ease forwards;
      padding-bottom: 30px;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #1e3a8a;
      margin: 0 0 18px 0;
    }

    /* ── Stats Bar ── */
    .stats-bar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
    }

    .stat-card {
      background: #fff;
      border-radius: 14px;
      padding: 14px;
      text-align: center;
      box-shadow: 4px 4px 12px rgba(15,23,42,0.06), -4px -4px 12px rgba(255,255,255,0.9);
    }

    .stat-val {
      font-size: 1.8rem;
      font-weight: 900;
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
    }

    .stat-lbl {
      font-size: 0.65rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-top: 5px;
    }

    /* ── Code Card ── */
    .code-card {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      border-radius: 18px;
      padding: 20px;
      margin-bottom: 12px;
      color: #fff;
      position: relative;
      overflow: hidden;
    }

    .code-card::before {
      content: '';
      position: absolute;
      top: -30px; right: -30px;
      width: 120px; height: 120px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
    }

    .code-card::after {
      content: '';
      position: absolute;
      bottom: -20px; left: -20px;
      width: 80px; height: 80px;
      border-radius: 50%;
      background: rgba(255,255,255,0.06);
    }

    .code-label {
      font-size: 0.65rem;
      font-weight: 800;
      opacity: 0.75;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }

    .code-value {
      font-size: 2rem;
      font-weight: 900;
      font-family: monospace;
      letter-spacing: 3px;
      margin-bottom: 16px;
    }

    .code-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      position: relative;
      z-index: 1;
    }

    .code-btn {
      padding: 11px;
      border-radius: 11px;
      border: none;
      font-size: 0.78rem;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: all 0.15s;
    }

    .code-btn:active { transform: scale(0.97); }
    .code-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-white { background: rgba(255,255,255,0.95); color: #1e3a8a; }
    .btn-white.done { background: #d1fae5; color: #15803d; }
    .btn-outline { background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3); }
    .btn-outline:hover { background: rgba(255,255,255,0.25); }

    /* ── Link Card ── */
    .link-card {
      background: #fff;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 4px 4px 12px rgba(15,23,42,0.06), -4px -4px 12px rgba(255,255,255,0.9);
    }

    .link-card-label {
      font-size: 0.65rem;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
    }

    .link-text {
      font-size: 0.7rem;
      font-weight: 600;
      color: #3b82f6;
      word-break: break-all;
      line-height: 1.5;
      background: #f0f7ff;
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 10px;
    }

    .link-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .action-btn {
      padding: 11px;
      border-radius: 11px;
      border: none;
      font-size: 0.78rem;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: all 0.15s;
    }

    .action-btn:active { transform: scale(0.97); }
    .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-primary {
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: #fff;
      box-shadow: 0 3px 0 #1e3a8a;
    }
    .btn-primary:active { transform: translateY(3px); box-shadow: 0 0 0 #1e3a8a; }
    .btn-primary.done { background: linear-gradient(135deg, #15803d, #22c55e); box-shadow: 0 3px 0 #15803d; }

    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      box-shadow: 0 3px 0 #cbd5e1;
    }
    .btn-secondary:active { transform: translateY(3px); box-shadow: 0 0 0 #cbd5e1; }
    .btn-secondary.done { background: #d1fae5; color: #15803d; box-shadow: 0 3px 0 #86efac; }

    /* ── Referrals ── */
    .ref-section { margin-top: 20px; }

    .ref-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .ref-title {
      font-size: 1rem;
      font-weight: 800;
      color: #1e3a8a;
      margin: 0;
    }

    .ref-count-badge {
      background: #e0e7ff;
      color: #1e3a8a;
      font-size: 0.7rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 20px;
    }

    .ref-empty {
      text-align: center;
      padding: 28px 20px;
      background: #f8fafc;
      border-radius: 16px;
      color: #94a3b8;
      font-weight: 600;
      font-size: 0.85rem;
      border: 1px dashed #e2e8f0;
      line-height: 1.7;
    }

    .ref-list { display: flex; flex-direction: column; gap: 8px; }

    .ref-card {
      background: #fff;
      border-radius: 14px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 11px;
      box-shadow: 3px 3px 10px rgba(15,23,42,0.05), -3px -3px 10px rgba(255,255,255,0.9);
      border: 1px solid #f1f5f9;
    }

    .ref-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: #fff;
      font-weight: 900;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .ref-info { flex: 1; min-width: 0; }

    .ref-name {
      font-size: 0.8rem;
      font-weight: 800;
      color: #1e3a8a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ref-email {
      font-size: 0.65rem;
      color: #94a3b8;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .ref-right { text-align: right; flex-shrink: 0; }

    .ref-coins {
      font-size: 0.75rem;
      font-weight: 800;
      color: #3b82f6;
    }

    .ref-date {
      font-size: 0.6rem;
      color: #94a3b8;
      margin-top: 2px;
    }

    /* ── Loader ── */
    .loader-wrap {
      display: flex; flex-direction: column;
      align-items: center; padding: 40px;
      color: #64748b; font-weight: 700;
      font-size: 0.9rem; gap: 12px;
    }

    .spinner {
      width: 32px; height: 32px;
      border: 3px solid rgba(59,130,246,0.2);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .msg-box {
      padding: 11px 15px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.82rem;
      margin-bottom: 14px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  `}),(0,o.jsx)(`h2`,{className:`page-title`,children:`🎁 Invite & Earn`}),u&&(0,o.jsx)(`div`,{className:`msg-box`,style:{color:u.includes(`✅`)?`#047857`:`#b91c1c`,background:u.includes(`✅`)?`#d1fae5`:`#fee2e2`},children:u}),e?(0,o.jsxs)(`div`,{className:`loader-wrap`,children:[(0,o.jsx)(`div`,{className:`spinner`}),`Loading invite details…`]}):(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`div`,{className:`stats-bar`,children:[(0,o.jsxs)(`div`,{className:`stat-card`,children:[(0,o.jsx)(`div`,{className:`stat-val`,children:c}),(0,o.jsx)(`div`,{className:`stat-lbl`,children:`Total Referrals`})]}),(0,o.jsxs)(`div`,{className:`stat-card`,children:[(0,o.jsx)(`div`,{className:`stat-val`,style:{fontSize:`1.2rem`},children:i||`—`}),(0,o.jsx)(`div`,{className:`stat-lbl`,children:`Your Code`})]})]}),(0,o.jsxs)(`div`,{className:`code-card`,children:[(0,o.jsx)(`div`,{className:`code-label`,children:`Your Invite Code`}),(0,o.jsx)(`div`,{className:`code-value`,children:i||`—`}),(0,o.jsxs)(`div`,{className:`code-actions`,children:[(0,o.jsx)(`button`,{className:`code-btn btn-white${f===`code`?` done`:``}`,onClick:()=>b(i,`code`),disabled:!i,children:f===`code`?`✅ Copied!`:`📋 Copy Code`}),(0,o.jsx)(`button`,{className:`code-btn btn-outline`,onClick:S,disabled:!i,children:`📤 Share Now`})]})]}),(0,o.jsxs)(`div`,{className:`link-card`,children:[(0,o.jsx)(`div`,{className:`link-card-label`,children:`Invite Link`}),(0,o.jsx)(`div`,{className:`link-text`,children:v||`—`}),(0,o.jsxs)(`div`,{className:`link-actions`,children:[(0,o.jsx)(`button`,{className:`action-btn btn-primary${f===`link`?` done`:``}`,onClick:()=>b(v,`link`),disabled:!v,children:f===`link`?`✅ Copied!`:`🔗 Copy Link`}),(0,o.jsx)(`button`,{className:`action-btn btn-secondary${f===`msg`?` done`:``}`,onClick:()=>b(y,`msg`),disabled:!y,children:f===`msg`?`✅ Copied!`:`📨 Copy Msg`})]})]}),(0,o.jsxs)(`div`,{className:`ref-section`,children:[(0,o.jsxs)(`div`,{className:`ref-header`,children:[(0,o.jsx)(`h3`,{className:`ref-title`,children:`👥 My Referrals`}),(0,o.jsxs)(`span`,{className:`ref-count-badge`,children:[m.length,` joined`]})]}),g?(0,o.jsxs)(`div`,{className:`loader-wrap`,style:{padding:`20px`},children:[(0,o.jsx)(`div`,{className:`spinner`}),`Loading referrals…`]}):m.length===0?(0,o.jsxs)(`div`,{className:`ref-empty`,children:[(0,o.jsx)(`div`,{style:{fontSize:`2rem`,marginBottom:8},children:`🤝`}),`No referrals yet.`,(0,o.jsx)(`br`,{}),`Share your code to start earning!`]}):(0,o.jsx)(`div`,{className:`ref-list`,children:m.map((e,t)=>(0,o.jsxs)(`div`,{className:`ref-card`,children:[(0,o.jsx)(`div`,{className:`ref-avatar`,children:(e.full_name||e.email||`?`)[0].toUpperCase()}),(0,o.jsxs)(`div`,{className:`ref-info`,children:[(0,o.jsx)(`div`,{className:`ref-name`,children:e.full_name||`Unknown`}),(0,o.jsx)(`div`,{className:`ref-email`,children:e.email?e.email.replace(/^(.{2})(.*)(@.*)$/,(e,t,n,r)=>t+`*`.repeat(n.length)+r):`—`})]}),(0,o.jsx)(`div`,{className:`ref-right`,children:(0,o.jsx)(`div`,{className:`ref-date`,children:w(e.created_at)})})]},t))})]})]})]})}export{s as default};