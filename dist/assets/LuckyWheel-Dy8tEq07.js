import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t}from"./vendor-helmet-D-cMCI9i.js";import{nr as n,tr as r}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as i}from"./supabase-CXCPPx9q.js";import{r as a}from"./vendor-motion-DyarDpDD.js";var o=e(t(),1),s=e(n(),1),c=a(),l=e=>{switch(e){case`try_again_free`:return`🔄 Try Again`;case`plus1_chance`:return`🍀 +1 Chance`;case`gift`:return`🎁 Gift`;case`coins`:return`💰 Coins`;default:return e}},u=14400*1e3;function d(){let e=new Date(Date.now()+u),t=e.getUTCFullYear(),n=e.getUTCMonth(),r=e.getUTCDate();return new Date(Date.UTC(t,n,r,0,0,0)-u).toISOString()}function f(){let e=new Date(Date.now()+u),t=e.getUTCFullYear(),n=e.getUTCMonth(),r=e.getUTCDate();return Date.UTC(t,n,r+1,0,0,0)-u}function ee(e){let t=Math.max(0,Math.floor(e/1e3));return`${String(Math.floor(t/3600)).padStart(2,`0`)}:${String(Math.floor(t%3600/60)).padStart(2,`0`)}:${String(t%60).padStart(2,`0`)}`}var p=[`#1E3A8A`,`#3B82F6`,`#0EA5E9`,`#8B5CF6`];function m(){var e,t,n,a,u,m;let[v,y]=(0,o.useState)(!1),[b,x]=(0,o.useState)(!0),[S,C]=(0,o.useState)(!1),w=(0,o.useRef)(!1),[T,E]=(0,o.useState)(``),[D,O]=(0,o.useState)(null),[k,A]=(0,o.useState)(null),[j,M]=(0,o.useState)(0),[N,P]=(0,o.useState)(0),[F,I]=(0,o.useState)(null),[L,R]=(0,o.useState)(!1),[z,B]=(0,o.useState)([]),[V,H]=(0,o.useState)(!1),[U,W]=(0,o.useState)(()=>Date.now()),G=(0,o.useRef)(null),K=(0,o.useCallback)(()=>{W(Date.now()),G.current=requestAnimationFrame(K)},[]);(0,o.useEffect)(()=>(G.current=requestAnimationFrame(K),()=>cancelAnimationFrame(G.current)),[K]);let q=(0,o.useRef)(null),J=(0,o.useMemo)(()=>{let e=D==null?void 0:D.slices;return Array.isArray(e)&&e.length===4?e:[{label:`Slice 1`,type:`try_again_free`,value:0},{label:`Slice 2`,type:`plus1_chance`,value:0},{label:`Slice 3`,type:`gift`,value:0},{label:`Slice 4`,type:`coins`,value:10}]},[D]),Y=(0,o.useMemo)(()=>D?D.entry_type===`paid`?`Paid entry: ${D.entry_cost} coins`:`Free entry`:``,[D]),X=((e=k==null?void 0:k.lw_earned_coins)==null?0:e)>0,Z=(t=k==null?void 0:k.lw_draws_remaining)==null?0:t,Q=(0,o.useMemo)(()=>Math.max(0,f()-U),[U]),$=(0,o.useCallback)(r(function*(){let{data:e,error:t}=yield i.auth.getUser();if(t||!(e!=null&&e.user)){E(`Please login first.`),x(!1);return}let n=e.user.id;yield i.rpc(`lw_sync_remaining`);let[r,a,o,s]=yield Promise.all([i.from(`luckywheel_settings`).select(`*`).eq(`id`,1).single(),i.from(`users_profiles`).select(`*`).eq(`user_id`,n).single(),i.from(`luckywheel_history`).select(`id`,{count:`exact`,head:!0}).eq(`user_id`,n).gte(`created_at`,d()),i.from(`luckywheel_history`).select(`id, created_at, result_type, coins_won, entry_type, entry_cost, slice_index`).eq(`user_id`,n).order(`created_at`,{ascending:!1}).limit(50)]);r.data&&O(r.data),a.data&&A(a.data),M(o.count||0),B(s.data||[]),x(!1)}),[]);(0,o.useEffect)(()=>(y(!0),x(!0),$(),q.current=setInterval(()=>{w.current||$()},3e3),()=>clearInterval(q.current)),[$]),(0,o.useEffect)(()=>{let e;return L&&(e=setTimeout(()=>R(!1),5e3)),()=>clearTimeout(e)},[L]);let te=e=>{let t=360/J.length,n=360-(e*t+t/2)-N%360;n<0&&(n+=360),P(N+n+15*360)},ne=function(){var e=r(function*(){var e;if(E(``),I(null),R(!1),!D||!k)return;if(Z<=0){E(`Daily limit reached.`);return}if(D.entry_type===`paid`){let e=Number(D.entry_cost||0);if(Number(k.total_aidla_coins||0)<e){E(`Insufficient coins for paid entry.`);return}}C(!0),w.current=!0;let{data:t,error:n}=yield i.rpc(`lw_draw`);if(n){C(!1),w.current=!1,E(`Draw failed: ${n.message}`);return}if(!(t!=null&&t.ok)){C(!1),w.current=!1,E((t==null?void 0:t.error)||`Draw failed`);return}te((e=t.slice_index)==null?0:e),I(t),setTimeout(r(function*(){yield $(),C(!1),w.current=!1,R(!0)}),10200)});return function(){return e.apply(this,arguments)}}(),re=function(){var e=r(function*(){E(``);let{data:e,error:t}=yield i.rpc(`lw_claim`);if(t){E(`Claim failed: ${t.message}`);return}if(!(e!=null&&e.ok)){E((e==null?void 0:e.error)||`Nothing to claim`);return}E(`🎉 Claimed ${e.claimed} coins!`),yield $()});return function(){return e.apply(this,arguments)}}(),ie=S||b||Z<=0,ae=V?z:z.slice(0,3);return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`style`,{children:_}),!L||!F||!v?null:(0,s.createPortal)((0,c.jsx)(`div`,{className:`lw-modal-overlay`,onClick:()=>R(!1),children:(0,c.jsxs)(`div`,{className:`lw-modal-content`,onClick:e=>e.stopPropagation(),children:[(0,c.jsx)(`button`,{className:`lw-modal-close`,onClick:()=>R(!1),children:`×`}),(0,c.jsx)(`div`,{className:`lw-modal-emoji`,children:`🎉`}),(0,c.jsx)(`h2`,{className:`lw-modal-title`,children:`Congratulations!`}),(0,c.jsxs)(`div`,{className:`lw-modal-result-text`,children:[l(F.result_type),F.result_type===`coins`?` +${F.coins_won}`:``]}),(0,c.jsx)(`div`,{className:`lw-modal-footer`,children:`Closes in 5 seconds`})]})}),document.body),(0,c.jsxs)(`div`,{className:`lw-page`,children:[(0,c.jsx)(`div`,{className:`lw-header`,children:(0,c.jsxs)(`div`,{className:`lw-header-left`,children:[(0,c.jsx)(`span`,{className:`lw-header-icon`,children:`🎡`}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`h1`,{className:`lw-title`,children:`Lucky Wheel`}),(0,c.jsx)(`div`,{className:`lw-entry-badge`,children:Y})]})]})}),b?(0,c.jsxs)(`div`,{className:`lw-loader`,children:[(0,c.jsx)(`div`,{className:`lw-spin-ring`}),(0,c.jsx)(`span`,{children:`Loading your luck…`})]}):(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)(`div`,{className:`lw-grid`,children:[(0,c.jsx)(`div`,{className:`lw-col-wheel`,children:(0,c.jsxs)(`div`,{className:`lw-card lw-wheel-card`,children:[(0,c.jsx)(g,{slices:J,rotation:N,onDraw:ne,drawDisabled:ie,spinning:S}),(0,c.jsx)(`div`,{className:`lw-legend`,children:J.map((e,t)=>(0,c.jsxs)(`div`,{className:`lw-legend-item`,children:[(0,c.jsx)(`div`,{className:`lw-legend-dot`,style:{background:p[t]}}),(0,c.jsxs)(`span`,{children:[l(e.type),e.type===`coins`?` (${e.value})`:``]})]},t))}),(0,c.jsx)(`div`,{className:`lw-tip`,children:`💡 Try Again costs 1 draw · +1 Chance keeps draws the same`})]})}),(0,c.jsx)(`div`,{className:`lw-col-stats`,children:(0,c.jsxs)(`div`,{className:`lw-card`,children:[(0,c.jsxs)(`div`,{className:`lw-chances-hero ${S?`lw-pulse-fast`:`lw-pulse-soft`}`,children:[(0,c.jsx)(`span`,{className:`lw-chances-label`,children:`Chances Left`}),(0,c.jsx)(`div`,{className:`lw-chances-num`,children:Z})]}),(0,c.jsxs)(`div`,{className:`lw-stat-grid`,children:[(0,c.jsx)(h,{label:`Draws today`,value:j}),(0,c.jsx)(h,{label:`Daily limit`,value:Number((n=D==null?void 0:D.daily_limit)==null?0:n)}),(0,c.jsx)(h,{label:`Your balance`,value:Number((a=k==null?void 0:k.total_aidla_coins)==null?0:a)}),(0,c.jsx)(h,{label:`Total earned`,value:Number((u=k==null?void 0:k.total_lw_earned)==null?0:u)})]}),(0,c.jsxs)(`div`,{className:`lw-claim-box`,children:[(0,c.jsxs)(`div`,{className:`lw-claim-row`,children:[(0,c.jsx)(`span`,{children:`Claimable Coins`}),(0,c.jsx)(`strong`,{className:`lw-claim-val`,children:Number((m=k==null?void 0:k.lw_earned_coins)==null?0:m)})]}),(0,c.jsx)(`button`,{onClick:re,disabled:!X||S,className:`lw-btn`,children:X?`CLAIM COINS`:`NOTHING TO CLAIM`})]}),Z<=0&&(0,c.jsxs)(`div`,{className:`lw-countdown-box`,children:[(0,c.jsx)(`div`,{className:`lw-countdown-label`,children:`Next draws in`}),(0,c.jsx)(`div`,{className:`lw-countdown-time`,children:ee(Q)}),(0,c.jsx)(`div`,{className:`lw-countdown-sub`,children:`Resets at 00:00 UAE time`})]}),T&&(0,c.jsx)(`div`,{className:`lw-msg ${T.toLowerCase().includes(`fail`)||T.toLowerCase().includes(`insufficient`)||T.toLowerCase().includes(`limit`)?`lw-msg-err`:`lw-msg-ok`}`,children:T})]})})]}),(0,c.jsxs)(`div`,{className:`lw-card lw-history-card`,children:[(0,c.jsxs)(`div`,{className:`lw-history-hdr`,children:[(0,c.jsx)(`h3`,{className:`lw-history-title`,children:`My Spin History`}),z.length>3&&(0,c.jsx)(`button`,{className:`lw-seemore-btn`,onClick:()=>H(e=>!e),children:V?`See Less`:`See More`})]}),z.length===0?(0,c.jsx)(`div`,{className:`lw-empty`,children:`No spins yet. Hit DRAW to get started!`}):(0,c.jsx)(`div`,{className:`lw-table-wrap`,children:(0,c.jsxs)(`table`,{className:`lw-table`,children:[(0,c.jsx)(`thead`,{children:(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`th`,{children:`Date`}),(0,c.jsx)(`th`,{children:`Result`}),(0,c.jsx)(`th`,{children:`Prize`}),(0,c.jsx)(`th`,{children:`Entry`}),(0,c.jsx)(`th`,{children:`Fee`})]})}),(0,c.jsx)(`tbody`,{children:ae.map(e=>(0,c.jsxs)(`tr`,{children:[(0,c.jsx)(`td`,{className:`lw-td-date`,children:new Date(e.created_at).toLocaleString()}),(0,c.jsx)(`td`,{className:`lw-td-result`,children:l(e.result_type)}),(0,c.jsx)(`td`,{className:`lw-td-prize`,style:{color:e.result_type===`coins`?`#3b82f6`:`inherit`},children:e.result_type===`coins`?`+${e.coins_won}`:`—`}),(0,c.jsx)(`td`,{children:(0,c.jsx)(`span`,{className:`lw-entry-tag ${e.entry_type===`paid`?`paid`:`free`}`,children:e.entry_type===`paid`?`Paid`:`Free`})}),(0,c.jsx)(`td`,{children:e.entry_type===`paid`?`${e.entry_cost}C`:`—`})]},e.id))})]})})]})]})]})]})}function h({label:e,value:t}){return(0,c.jsxs)(`div`,{className:`lw-stat-box`,children:[(0,c.jsx)(`span`,{children:e}),(0,c.jsx)(`strong`,{children:t})]})}function g({slices:e,rotation:t,onDraw:n,drawDisabled:r,spinning:i}){let a=`conic-gradient(
    ${p[0]} 0deg 90deg,
    ${p[1]} 90deg 180deg,
    ${p[2]} 180deg 270deg,
    ${p[3]} 270deg 360deg
  )`;return(0,c.jsxs)(`div`,{className:`lw-wheel-wrap`,children:[(0,c.jsx)(`div`,{className:`lw-pointer`,"aria-hidden":`true`,children:(0,c.jsxs)(`svg`,{width:`32`,height:`42`,viewBox:`0 0 40 50`,children:[(0,c.jsx)(`defs`,{children:(0,c.jsxs)(`linearGradient`,{id:`ptrGrad`,x1:`0%`,y1:`0%`,x2:`100%`,y2:`100%`,children:[(0,c.jsx)(`stop`,{offset:`0%`,stopColor:`#3b82f6`}),(0,c.jsx)(`stop`,{offset:`100%`,stopColor:`#1e3a8a`})]})}),(0,c.jsx)(`path`,{d:`M20 50 L0 10 Q10 0 20 0 Q30 0 40 10 Z`,fill:`url(#ptrGrad)`,stroke:`#fff`,strokeWidth:`2`})]})}),(0,c.jsxs)(`div`,{className:`lw-rim`,children:[(0,c.jsx)(`div`,{className:`lw-disc`,style:{background:a,transform:`rotate(${t}deg)`},children:e.map((e,t)=>(0,c.jsx)(`div`,{className:`lw-slice-label`,style:{transform:`rotate(${t*90+45}deg)`},children:(0,c.jsxs)(`div`,{className:`lw-slice-inner`,children:[l(e.type),e.type===`coins`&&(0,c.jsx)(`div`,{className:`lw-slice-val`,children:e.value})]})},t))}),(0,c.jsx)(`button`,{onClick:n,disabled:r,className:`lw-center-btn${i?` lw-center-spinning`:``}`,children:i?`🤞`:`DRAW`})]})]})}var _=`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');

/* ── Page: top-level element, matches LuckyDraw pattern exactly ── */
/* No overflow, no position, no height — dashboard shell owns the scroll */
.lw-page *{box-sizing:border-box;}
.lw-page{
  font-family:'Plus Jakarta Sans',system-ui,sans-serif;
  color:#0f172a;
  padding:12px;
  max-width:900px;
  margin:0 auto;
  display:flex;flex-direction:column;gap:16px;
}

/* ── Header ── */
.lw-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding:10px 0 4px;animation:lwIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards;}
@keyframes lwIn{from{opacity:0;transform:translateY(-14px);}to{opacity:1;transform:none;}}
.lw-header-left{display:flex;align-items:center;gap:10px;}
.lw-header-icon{font-size:2rem;line-height:1;}
.lw-title{
  font-size:clamp(1.5rem,5vw,2.2rem);font-weight:900;letter-spacing:-1px;
  background:linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  filter:drop-shadow(1px 2px 4px rgba(30,58,138,0.15));
}
.lw-entry-badge{
  display:inline-block;background:#e0f2fe;color:#0284c7;
  padding:3px 12px;border-radius:20px;font-weight:700;font-size:0.75rem;margin-top:3px;
}

/* ── Card ── */
.lw-card{
  background:rgba(255,255,255,0.88);
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
  border:1px solid rgba(255,255,255,1);
  border-radius:22px;padding:18px;
  box-shadow:
    16px 16px 48px rgba(15,23,42,0.07),
    -10px -10px 36px rgba(255,255,255,0.9),
    inset 0 0 0 1.5px rgba(255,255,255,0.6);
}

/* ── Loader ── */
.lw-loader{display:flex;align-items:center;gap:12px;padding:48px;justify-content:center;color:#64748b;font-weight:600;}
.lw-spin-ring{width:32px;height:32px;border:4px solid #e0f2fe;border-top:4px solid #3b82f6;border-radius:50%;animation:lwSpin 0.9s linear infinite;flex-shrink:0;}
@keyframes lwSpin{to{transform:rotate(360deg);}}

/* ── Main 2-column grid ── */
.lw-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
  align-items:start;
}
/* Mobile: stack, wheel first */
@media(max-width:640px){
  .lw-grid{grid-template-columns:1fr;}
  .lw-col-wheel{order:1;}
  .lw-col-stats{order:2;}
}

/* ── Wheel card ── */
.lw-wheel-card{display:flex;flex-direction:column;align-items:center;gap:14px;padding:16px;}

/* ── Wheel ── */
.lw-wheel-wrap{
  width:100%;
  max-width:min(280px,80vw);
  position:relative;
  display:flex;flex-direction:column;align-items:center;
}
.lw-pointer{
  position:absolute;top:-14px;left:50%;transform:translateX(-50%);
  z-index:10;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.35));
}
.lw-rim{
  width:100%;aspect-ratio:1;border-radius:50%;
  padding:10px;
  background:linear-gradient(135deg,#f8fafc,#cbd5e1,#94a3b8,#f8fafc);
  box-shadow:
    0 18px 40px rgba(15,23,42,0.22),
    inset 0 3px 10px rgba(255,255,255,0.8);
  border:3px solid #fff;
  position:relative;
}
.lw-disc{
  width:100%;height:100%;border-radius:50%;
  border:3px solid #fff;
  box-shadow:inset 0 0 18px rgba(0,0,0,0.28);
  transition:transform 10s cubic-bezier(0.1,0,0.1,1.035);
  position:relative;overflow:hidden;
}
.lw-slice-label{
  position:absolute;top:0;left:50%;width:90px;height:50%;
  margin-left:-45px;transform-origin:bottom center;
  display:flex;flex-direction:column;align-items:center;
  padding-top:14px;z-index:5;
}
.lw-slice-inner{
  color:#fff;font-weight:800;font-size:clamp(0.65rem,2vw,0.85rem);
  text-align:center;text-shadow:0 2px 5px rgba(0,0,0,0.9);line-height:1.2;
}
.lw-slice-val{font-size:1.1rem;font-weight:900;margin-top:3px;text-shadow:0 2px 6px rgba(0,0,0,0.9);}

/* Center button */
.lw-center-btn{
  position:absolute;inset:28%;border-radius:50%;
  border:3px solid #fff;
  background:linear-gradient(135deg,#1e3a8a,#3b82f6);
  color:#fff;font-weight:900;font-size:clamp(0.85rem,2.5vw,1.1rem);letter-spacing:1px;
  box-shadow:0 6px 0 #0f172a,0 12px 18px rgba(30,58,138,0.4),inset 0 2px 0 rgba(255,255,255,0.2);
  cursor:pointer;display:grid;place-items:center;
  z-index:15;transition:all 0.15s cubic-bezier(0.4,0,0.2,1);
}
.lw-center-btn:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-2px);box-shadow:0 8px 0 #0f172a,0 16px 22px rgba(30,58,138,0.5),inset 0 2px 0 rgba(255,255,255,0.2);}
.lw-center-btn:active:not(:disabled){transform:translateY(6px);box-shadow:0 1px 0 #0f172a,0 3px 8px rgba(30,58,138,0.3);}
.lw-center-btn:disabled{background:#94a3b8;box-shadow:0 6px 0 #64748b;cursor:not-allowed;}
.lw-center-spinning{animation:lwCenterPulse 0.5s infinite;background:linear-gradient(135deg,#3b82f6,#60a5fa)!important;}
@keyframes lwCenterPulse{0%,100%{transform:scale(1);}50%{transform:scale(0.94);}}

/* ── Legend ── */
.lw-legend{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;width:100%;}
.lw-legend-item{display:flex;align-items:center;gap:6px;font-size:0.78rem;font-weight:600;color:#475569;}
.lw-legend-dot{width:10px;height:10px;border-radius:3px;flex-shrink:0;}

/* ── Tip ── */
.lw-tip{
  padding:10px 12px;background:#eff6ff;color:#1e3a8a;
  border-radius:10px;font-size:0.78rem;text-align:center;
  border:1px dashed #93c5fd;line-height:1.4;width:100%;
}

/* ── Stats column ── */
.lw-chances-hero{
  background:linear-gradient(135deg,#1e3a8a,#3b82f6);
  color:#fff;border-radius:16px;padding:16px;text-align:center;
  box-shadow:0 8px 20px rgba(30,58,138,0.28),inset 0 2px 0 rgba(255,255,255,0.18);
  margin-bottom:14px;
}
.lw-chances-label{font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.88;}
.lw-chances-num{font-size:clamp(2.2rem,8vw,3rem);font-weight:900;line-height:1;margin-top:4px;text-shadow:0 3px 8px rgba(0,0,0,0.25);}

.lw-pulse-soft{animation:lwPulse 3s ease-in-out infinite;}
.lw-pulse-fast{animation:lwPulse 0.7s ease-in-out infinite;}
@keyframes lwPulse{0%,100%{transform:scale(1);}50%{transform:scale(0.97);}}

.lw-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;}
.lw-stat-box{
  background:#f8fafc;border-radius:12px;padding:10px;
  display:flex;flex-direction:column;align-items:center;text-align:center;
  box-shadow:inset 3px 3px 7px rgba(15,23,42,0.05),inset -3px -3px 7px rgba(255,255,255,1);
}
.lw-stat-box span{font-size:0.68rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.3px;}
.lw-stat-box strong{font-size:1rem;color:#0f172a;margin-top:3px;font-weight:800;}

.lw-claim-box{
  background:#f0f4f8;border-radius:14px;padding:14px;margin-bottom:12px;
  box-shadow:inset 3px 3px 7px rgba(15,23,42,0.05),inset -3px -3px 7px rgba(255,255,255,1);
}
.lw-claim-row{display:flex;justify-content:space-between;align-items:center;font-weight:700;margin-bottom:10px;color:#334155;font-size:0.88rem;}
.lw-claim-val{font-size:1.1rem;color:#3b82f6;}

/* Main button */
.lw-btn{
  width:100%;padding:13px;border-radius:12px;border:none;
  background:linear-gradient(135deg,#1e3a8a,#3b82f6);
  color:#fff;font-size:0.95rem;font-weight:800;letter-spacing:0.8px;cursor:pointer;
  box-shadow:0 6px 0 #0f172a,0 12px 20px rgba(30,58,138,0.28),inset 0 2px 0 rgba(255,255,255,0.18);
  transition:all 0.15s cubic-bezier(0.4,0,0.2,1);
}
.lw-btn:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-2px);box-shadow:0 8px 0 #0f172a,0 16px 22px rgba(30,58,138,0.38);}
.lw-btn:active:not(:disabled){transform:translateY(6px);box-shadow:0 0px 0 #0f172a;}
.lw-btn:disabled{background:#94a3b8;box-shadow:0 6px 0 #64748b;cursor:not-allowed;opacity:0.85;}

/* Countdown — driven by rAF, no stutter */
.lw-countdown-box{
  background:#0f172a;color:#f8fafc;padding:14px;border-radius:14px;
  text-align:center;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.08),0 8px 16px rgba(15,23,42,0.2);
  margin-bottom:12px;
}
.lw-countdown-label{font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.7;margin-bottom:4px;}
.lw-countdown-time{font-size:clamp(1.4rem,5vw,1.9rem);font-weight:900;font-family:'Courier New',monospace;color:#3b82f6;letter-spacing:2px;}
.lw-countdown-sub{color:#475569;font-size:0.7rem;margin-top:4px;}

/* Messages */
.lw-msg{padding:10px 14px;border-radius:10px;margin-top:8px;font-weight:700;font-size:0.85rem;text-align:center;}
.lw-msg-ok{background:#dcfce7;color:#15803d;box-shadow:inset 0 0 0 1.5px #4ade80;}
.lw-msg-err{background:#fee2e2;color:#b91c1c;box-shadow:inset 0 0 0 1.5px #f87171;}

/* ── History ── */
.lw-history-card{padding:16px 18px;}
.lw-history-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.lw-history-title{font-size:1.1rem;font-weight:800;color:#0f172a;}
.lw-empty{text-align:center;padding:24px;color:#64748b;font-weight:600;background:#f8fafc;border-radius:12px;font-size:0.88rem;}
.lw-table-wrap{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:10px;}
.lw-table{width:100%;border-collapse:collapse;min-width:400px;}
.lw-table th{
  text-align:left;background:#f1f5f9;color:#475569;padding:9px 12px;
  font-size:0.72rem;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;
}
.lw-table th:first-child{border-radius:10px 0 0 10px;}
.lw-table th:last-child{border-radius:0 10px 10px 0;}
.lw-table td{padding:11px 12px;border-bottom:1px solid #f1f5f9;font-size:0.85rem;color:#334155;}
.lw-table tr:hover td{background:#f8fafc;}
.lw-td-date{font-size:0.75rem;color:#64748b;white-space:nowrap;}
.lw-td-result{font-weight:700;}
.lw-td-prize{font-weight:800;}
.lw-entry-tag{padding:3px 8px;border-radius:10px;font-size:0.68rem;font-weight:700;}
.lw-entry-tag.free{background:#e0f2fe;color:#0284c7;}
.lw-entry-tag.paid{background:#ede9fe;color:#6d28d9;}
.lw-seemore-btn{
  background:#f8fafc;border:1.5px solid #3b82f6;color:#1e3a8a;
  padding:7px 16px;border-radius:10px;font-weight:800;font-size:0.8rem;
  cursor:pointer;transition:all 0.18s;
  box-shadow:3px 3px 8px rgba(15,23,42,0.05),-3px -3px 8px rgba(255,255,255,1);
}
.lw-seemore-btn:hover{background:#3b82f6;color:#fff;transform:translateY(-1px);box-shadow:0 6px 12px rgba(59,130,246,0.28);}

/* ── Modal ── */
.lw-modal-overlay{
  position:fixed!important;inset:0;width:100vw;height:100vh;
  background:rgba(15,23,42,0.55);backdrop-filter:blur(8px);
  display:flex;justify-content:center;align-items:center;
  z-index:999999!important;padding:16px;
}
.lw-modal-content{
  background:rgba(255,255,255,0.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  padding:36px 28px 28px;border-radius:24px;text-align:center;
  box-shadow:
    16px 16px 50px rgba(15,23,42,0.18),
    -16px -16px 50px rgba(255,255,255,0.9),
    inset 0 0 0 1.5px rgba(255,255,255,0.6);
  position:relative;width:min(400px,90vw);
  animation:lwModalIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
}
@keyframes lwModalIn{0%{opacity:0;transform:scale(0.8);}50%{transform:scale(1.04);}100%{opacity:1;transform:scale(1);}}
.lw-modal-emoji{font-size:3rem;display:block;margin-bottom:6px;}
.lw-modal-close{position:absolute;top:12px;right:14px;background:none;border:none;font-size:24px;font-weight:700;color:#94a3b8;cursor:pointer;line-height:1;}
.lw-modal-close:hover{color:#1e3a8a;}
.lw-modal-title{font-size:1.4rem;font-weight:900;color:#1e3a8a;margin-bottom:10px;}
.lw-modal-result-text{font-size:1.8rem;font-weight:900;color:#3b82f6;margin-bottom:18px;text-shadow:1px 1px 3px rgba(0,0,0,0.08);}
.lw-modal-footer{font-size:0.78rem;color:#94a3b8;font-weight:600;}

/* ── Fine-tune for very small screens ── */
@media(max-width:380px){
  .lw-page{padding:12px 10px 32px;}
  .lw-card{padding:14px 12px;border-radius:18px;}
  .lw-stat-grid{gap:6px;}
  .lw-stat-box{padding:8px 4px;}
  .lw-stat-box span{font-size:0.6rem;}
  .lw-chances-num{font-size:2rem;}
}
`;export{m as default};