import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t}from"./vendor-helmet-D-cMCI9i.js";import{tr as n}from"./vendor-misc-DjQaoctO.js";import{d as r,l as i,n as a}from"./vendor-router-BeHthcJc.js";import"./vendor-supabase-DTLzbyhy.js";import{t as o}from"./supabase-CXCPPx9q.js";import{r as s}from"./vendor-motion-DyarDpDD.js";var c=e(t(),1),l=s();function u(){let e=i(),[t]=r(),[s,u]=(0,c.useState)(``),[d,f]=(0,c.useState)(``),[p,m]=(0,c.useState)(t.get(`ref`)||``),[h,g]=(0,c.useState)(``),[_,v]=(0,c.useState)(``),[y,b]=(0,c.useState)(!1),[x,S]=(0,c.useState)(``),[C,w]=(0,c.useState)(``),[T,E]=(0,c.useState)(``),[D,O]=(0,c.useState)(``),[k,A]=(0,c.useState)(!1),[j,M]=(0,c.useState)(``),[N,P]=(0,c.useState)(!1),[F,I]=(0,c.useState)(0);(0,c.useEffect)(()=>{s.trim()?w(``):w(`Please enter your name`)},[s]),(0,c.useEffect)(()=>{let e=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if(!d){O(``),E(``);return}if(!e.test(d)){O(`Please enter a valid email`);return}O(``);let t=function(){var e=n(function*(){try{let{data:e}=yield o.from(`users_profiles`).select(`email`).eq(`email`,d.toLowerCase()).maybeSingle();E(e?`This email is already registered. Please login.`:``)}catch(e){console.error(`Email check error:`,e)}});return function(){return e.apply(this,arguments)}}(),r=setTimeout(t,500);return()=>clearTimeout(r)},[d]),(0,c.useEffect)(()=>{let e=0;h.length>5&&(e+=1),h.length>7&&(e+=1),/[A-Z]/.test(h)&&(e+=1),/[0-9]/.test(h)&&(e+=1),/[^A-Za-z0-9]/.test(h)&&(e+=1),I(Math.min(e,4))},[h]),(0,c.useEffect)(()=>{A(!!(_&&h!==_))},[h,_]),(0,c.useEffect)(()=>{if(!p.trim()){M(``);return}if(!/^AIDLA-\d{6}$/.test(p.trim())){M(`Invalid format. Use AIDLA-XXXXXX (6 digits)`);return}let e=function(){var e=n(function*(){try{let{data:e,error:t}=yield o.from(`users_profiles`).select(`user_id`).eq(`my_refer_code`,p.trim()).maybeSingle();if(t)throw t;M(e?``:`Invalid code or does not exist`)}catch(e){console.error(`Referral code check error:`,e),M(`Error verifying code`)}});return function(){return e.apply(this,arguments)}}(),t=setTimeout(e,500);return()=>clearTimeout(t)},[p]);function L(e){return R.apply(this,arguments)}function R(){return R=n(function*(t){if(t.preventDefault(),S(``),!T){if(p&&j){S(`Please enter a valid referral code`);return}if(h!==_){S(`Passwords do not match.`);return}if(h.length<6){S(`Password must be at least 6 characters.`);return}b(!0);try{var n;let{data:t,error:r}=yield o.auth.signUp({email:d,password:h,options:{emailRedirectTo:`https://www.aidla.online/email-confirmed`,data:{full_name:s}}});if(r)throw r;let i=(n=t.user)==null?void 0:n.id;if(i){let e,t=!1;for(;!t;){e=`AIDLA-${String(Math.floor(Math.random()*1e6)).padStart(6,`0`)}`;let{data:n}=yield o.from(`users_profiles`).select(`user_id`).eq(`my_refer_code`,e).maybeSingle();n||(t=!0)}let{error:n}=yield o.from(`users_profiles`).insert([{user_id:i,full_name:s,email:d.toLowerCase(),referral_code_used:p.trim()||null,my_refer_code:e}]);if(n)throw n}S(`Signup successful. Check your email for confirmation, then login.`),setTimeout(()=>e(`/login`),2e3)}catch(e){S(e.message||`Signup failed`)}finally{b(!1)}}}),R.apply(this,arguments)}return(0,l.jsxs)(`div`,{className:`fullscreen-wrapper`,children:[(0,l.jsx)(`style`,{children:`
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .fullscreen-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #f0f4f8;
      overflow-y: auto;
      overflow-x: hidden;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      z-index: 99999;
      padding: 50px 20px; 
    }

    .bg-orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      z-index: -1;
      animation: float 20s infinite alternate ease-in-out;
    }
    .orb-1 {
      width: 400px;
      height: 400px;
      background: rgba(30, 58, 138, 0.15);
      top: -100px;
      left: -100px;
    }
    .orb-2 {
      width: 300px;
      height: 300px;
      background: rgba(59, 130, 246, 0.15);
      bottom: -50px;
      right: -50px;
      animation-duration: 25s;
    }

    @keyframes float {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(50px, 50px) scale(1.1); }
    }

    .card-2060 {
      width: 100%;
      max-width: 480px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 1);
      border-radius: 28px;
      padding: 40px;
      box-shadow: 
        20px 20px 60px rgba(15, 23, 42, 0.08), 
        -20px -20px 60px rgba(255, 255, 255, 0.9),
        inset 0 0 0 2px rgba(255, 255, 255, 0.5);
      animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
      transform: translateY(30px) scale(0.95);
      position: relative;
    }

    @keyframes popIn {
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      margin-bottom: 10px;
      background: #ffffff;
      color: #1e3a8a;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.85rem;
      border-radius: 12px;
      box-shadow: 
        4px 4px 10px rgba(15, 23, 42, 0.05), 
        -4px -4px 10px rgba(255, 255, 255, 1);
      transition: all 0.2s ease;
    }
    .back-btn:hover { color: #3b82f6; transform: translateY(-2px); }
    .back-btn:active {
      transform: translateY(1px);
      box-shadow: inset 2px 2px 5px rgba(15,23,42,0.05), inset -2px -2px 5px rgba(255,255,255,1);
    }
    .back-btn svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 3; fill: none; }

    .brand-header { text-align: center; margin-bottom: 30px; margin-top: 10px; }
    .brand-title {
      font-size: 3rem;
      font-weight: 900;
      letter-spacing: -1px;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(2px 4px 6px rgba(30, 58, 138, 0.2));
      margin-bottom: 5px;
    }
    .brand-subtitle { font-size: 0.9rem; color: #64748b; font-weight: 600; letter-spacing: 0.5px; }

    .eco-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 20px;
    }
    .eco-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 5px;
      background: #ffffff;
      border-radius: 14px;
      font-size: 0.65rem;
      font-weight: 700;
      color: #1e3a8a;
      box-shadow: 5px 5px 15px rgba(15, 23, 42, 0.05), -5px -5px 15px rgba(255, 255, 255, 0.8);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .eco-badge:hover { transform: translateY(-4px) scale(1.05); }
    .eco-badge svg { width: 18px; height: 18px; margin-bottom: 4px; stroke: #3b82f6; stroke-width: 2; fill: none; }

    .input-group { margin-bottom: 20px; position: relative; }
    .label-3d { display: block; margin-bottom: 8px; font-weight: 700; color: #334155; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .input-wrapper { position: relative; width: 100%; }
    .input-3d {
      width: 100%;
      padding: 16px 20px;
      border-radius: 16px;
      border: 2px solid transparent;
      background: #f8fafc;
      color: #0f172a;
      font-size: 1rem;
      font-weight: 600;
      box-shadow: inset 5px 5px 10px rgba(15, 23, 42, 0.06), inset -5px -5px 10px rgba(255, 255, 255, 1);
      transition: all 0.3s ease;
    }
    .input-3d::placeholder { color: #cbd5e1; font-weight: 500; }
    .input-3d:focus {
      outline: none;
      background: #ffffff;
      border-color: rgba(59, 130, 246, 0.4);
      box-shadow: 
        inset 2px 2px 5px rgba(15, 23, 42, 0.03), 
        inset -2px -2px 5px rgba(255, 255, 255, 1),
        0 0 15px rgba(59, 130, 246, 0.2);
    }

    .input-error { border-color: rgba(239, 68, 68, 0.5); box-shadow: 0 0 15px rgba(239, 68, 68, 0.1); }
    .error-text { color: #ef4444; font-size: 0.75rem; font-weight: 600; margin-top: 6px; display: block; animation: fadeIn 0.3s ease; }

    .eye-btn {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    }
    .eye-btn:hover { color: #1e3a8a; }
    
    .strength-meter { display: flex; gap: 4px; margin-top: 8px; height: 4px; border-radius: 2px; overflow: hidden; }
    .strength-bar { flex: 1; background: #e2e8f0; transition: all 0.4s ease; border-radius: 2px; }
    .strength-1 { background: #ef4444; }
    .strength-2 { background: #f59e0b; }
    .strength-3 { background: #3b82f6; }
    .strength-4 { background: #10b981; }

    .btn-2060 {
      width: 100%;
      padding: 18px;
      margin-top: 10px;
      border-radius: 16px;
      border: none;
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: #ffffff;
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: 1px;
      cursor: pointer;
      box-shadow: 
        0 10px 0 #1e3a8a, 
        0 20px 25px rgba(30, 58, 138, 0.3),
        inset 0 2px 0 rgba(255, 255, 255, 0.2);
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .btn-2060:hover:not(:disabled) {
      filter: brightness(1.1);
      transform: translateY(-2px);
      box-shadow: 0 12px 0 #1e3a8a, 0 25px 30px rgba(30, 58, 138, 0.4), inset 0 2px 0 rgba(255,255,255,0.2);
    }
    .btn-2060:active:not(:disabled) {
      transform: translateY(10px);
      box-shadow: 0 0px 0 #1e3a8a, 0 5px 10px rgba(30, 58, 138, 0.3), inset 0 2px 0 rgba(255,255,255,0.2);
    }
    .btn-2060:disabled {
      background: #94a3b8; box-shadow: 0 10px 0 #64748b; cursor: not-allowed; opacity: 0.8;
    }

    .login-link {
      display: block;
      text-align: center;
      margin-top: 25px;
      color: #64748b;
      font-weight: 600;
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 0.2s;
    }
    .login-link span { color: #3b82f6; font-weight: 800; }
    .login-link:hover span { color: #1e3a8a; text-decoration: underline; }

    .msg-box {
      margin-top: 20px; padding: 16px; border-radius: 14px; text-align: center; font-weight: 700; font-size: 0.95rem;
      animation: fadeIn 0.4s ease;
    }

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
  `}),(0,l.jsx)(`div`,{className:`bg-orb orb-1`}),(0,l.jsx)(`div`,{className:`bg-orb orb-2`}),(0,l.jsxs)(`div`,{className:`card-2060`,children:[(0,l.jsxs)(a,{to:`/home`,className:`back-btn`,children:[(0,l.jsx)(`svg`,{viewBox:`0 0 24 24`,children:(0,l.jsx)(`polyline`,{points:`15 18 9 12 15 6`,strokeLinecap:`round`,strokeLinejoin:`round`})}),`Back`]}),(0,l.jsxs)(`div`,{className:`brand-header`,children:[(0,l.jsx)(`h1`,{className:`brand-title`,children:`AIDLA`}),(0,l.jsx)(`p`,{className:`brand-subtitle`,children:`The Ecosystem of Tomorrow`}),(0,l.jsxs)(`div`,{className:`eco-grid`,children:[(0,l.jsxs)(`div`,{className:`eco-badge`,children:[(0,l.jsxs)(`svg`,{viewBox:`0 0 24 24`,children:[(0,l.jsx)(`path`,{d:`M4 19.5A2.5 2.5 0 0 1 6.5 17H20`}),(0,l.jsx)(`path`,{d:`M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z`})]}),`Education`]}),(0,l.jsxs)(`div`,{className:`eco-badge`,children:[(0,l.jsxs)(`svg`,{viewBox:`0 0 24 24`,children:[(0,l.jsx)(`polygon`,{points:`12 2 2 7 12 12 22 7 12 2`}),(0,l.jsx)(`polyline`,{points:`2 17 12 22 22 17`}),(0,l.jsx)(`polyline`,{points:`2 12 12 17 22 12`})]}),`Mining`]}),(0,l.jsxs)(`div`,{className:`eco-badge`,children:[(0,l.jsxs)(`svg`,{viewBox:`0 0 24 24`,children:[(0,l.jsx)(`polyline`,{points:`23 6 13.5 15.5 8.5 10.5 1 18`}),(0,l.jsx)(`polyline`,{points:`17 6 23 6 23 12`})]}),`Earning`]}),(0,l.jsxs)(`div`,{className:`eco-badge`,children:[(0,l.jsxs)(`svg`,{viewBox:`0 0 24 24`,children:[(0,l.jsx)(`circle`,{cx:`9`,cy:`21`,r:`1`}),(0,l.jsx)(`circle`,{cx:`20`,cy:`21`,r:`1`}),(0,l.jsx)(`path`,{d:`M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6`})]}),`Shop`]})]})]}),(0,l.jsxs)(`form`,{onSubmit:L,children:[(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Full Name`}),(0,l.jsx)(`input`,{className:`input-3d ${C?`input-error`:``}`,value:s,onChange:e=>u(e.target.value),required:!0,placeholder:`Enter your name`}),C&&(0,l.jsx)(`span`,{className:`error-text`,children:C})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Email Address`}),(0,l.jsx)(`input`,{className:`input-3d ${D||T?`input-error`:``}`,value:d,onChange:e=>f(e.target.value),type:`email`,required:!0,placeholder:`name@example.com`}),D&&(0,l.jsx)(`span`,{className:`error-text`,children:D}),!D&&T&&(0,l.jsx)(`span`,{className:`error-text`,children:T})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsxs)(`label`,{className:`label-3d`,children:[`Referral Code `,(0,l.jsx)(`span`,{style:{color:`#94a3b8`,textTransform:`none`},children:`(Optional)`})]}),(0,l.jsx)(`input`,{className:`input-3d ${j?`input-error`:``}`,value:p,onChange:e=>m(e.target.value.toUpperCase()),placeholder:`e.g. AIDLA-123456`}),j&&(0,l.jsx)(`span`,{className:`error-text`,children:j})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Password`}),(0,l.jsxs)(`div`,{className:`input-wrapper`,children:[(0,l.jsx)(`input`,{className:`input-3d`,value:h,onChange:e=>g(e.target.value),type:N?`text`:`password`,required:!0,placeholder:`Create a strong password`,style:{paddingRight:`45px`}}),(0,l.jsx)(`button`,{type:`button`,className:`eye-btn`,onClick:()=>P(!N),tabIndex:`-1`,children:N?(0,l.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,l.jsx)(`path`,{d:`M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24`}),(0,l.jsx)(`line`,{x1:`1`,y1:`1`,x2:`23`,y2:`23`})]}):(0,l.jsxs)(`svg`,{width:`20`,height:`20`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,l.jsx)(`path`,{d:`M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z`}),(0,l.jsx)(`circle`,{cx:`12`,cy:`12`,r:`3`})]})})]}),h.length>0&&(0,l.jsx)(`div`,{className:`strength-meter`,children:[1,2,3,4].map(e=>(0,l.jsx)(`div`,{className:`strength-bar ${F>=e?`strength-${F}`:``}`},e))})]}),(0,l.jsxs)(`div`,{className:`input-group`,children:[(0,l.jsx)(`label`,{className:`label-3d`,children:`Confirm Password`}),(0,l.jsx)(`input`,{className:`input-3d ${k?`input-error`:``}`,value:_,onChange:e=>v(e.target.value),type:N?`text`:`password`,required:!0,placeholder:`Confirm your password`}),k&&(0,l.jsx)(`span`,{className:`error-text`,children:`Passwords do not match`})]}),(0,l.jsx)(`button`,{disabled:y||!!C||!!D||!!T||!!j||k||!s.trim()||!d.trim(),className:`btn-2060`,children:y?`INITIALIZING...`:`SECURE ACCOUNT`}),(0,l.jsxs)(a,{to:`/login`,className:`login-link`,children:[`Already have an account? `,(0,l.jsx)(`span`,{children:`Login`})]}),x&&(0,l.jsx)(`div`,{className:`msg-box`,style:{color:x.includes(`successful`)?`#047857`:`#b91c1c`,background:x.includes(`successful`)?`#d1fae5`:`#fee2e2`,boxShadow:x.includes(`successful`)?`inset 0 0 0 2px #34d399`:`inset 0 0 0 2px #f87171`},children:x})]})]})]})}export{u as default};