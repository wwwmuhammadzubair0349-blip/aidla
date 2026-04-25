import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t}from"./vendor-helmet-D-cMCI9i.js";import{nr as n,tr as r}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as i}from"./supabase-CXCPPx9q.js";import{r as a}from"./vendor-motion-DyarDpDD.js";var o=e(t(),1),s=e(n(),1),c=a(),l=`Asia/Dubai`;function u(e){let t=Math.max(0,Math.floor(e/1e3)),n=Math.floor(t/86400),r=String(Math.floor(t%86400/3600)).padStart(2,`0`),i=String(Math.floor(t%3600/60)).padStart(2,`0`),a=String(t%60).padStart(2,`0`);return n>0?`${n}d ${r}:${i}:${a}`:`${r}:${i}:${a}`}function d(e){return e?e.type===`coins`?`${Number(e.coins||0)} coins`:e.type===`item`?e.name||`Item`:e.name||`Prize`:`-`}function f(e){return e?new Date(e).toLocaleString(`en-GB`,{timeZone:l}):`-`}function p(e){if(!e)return{date:`-`,time:``};let t=new Date(e);return{date:t.toLocaleDateString(`en-GB`,{timeZone:l,day:`2-digit`,month:`short`,year:`numeric`}),time:t.toLocaleTimeString(`en-GB`,{timeZone:l,hour:`2-digit`,minute:`2-digit`})}}function m(){let e=(0,o.useRef)(null),t=(0,o.useRef)(null);return(0,o.useEffect)(()=>{let n=e.current;if(!n)return;let r=n.getContext(`2d`);n.width=window.innerWidth,n.height=window.innerHeight;let i=[],a=[`#3b82f6`,`#1e3a8a`,`#60a5fa`,`#fbbf24`,`#f59e0b`,`#fff`,`#93c5fd`,`#fde68a`,`#f472b6`,`#a78bfa`];function o(e,t){for(let n=0;n<90;n++){let r=Math.PI*2*n/90+(Math.random()-.5)*.4,o=2+Math.random()*9;i.push({x:e,y:t,vx:Math.cos(r)*o,vy:Math.sin(r)*o,alpha:1,color:a[Math.floor(Math.random()*a.length)],size:1.5+Math.random()*4,gravity:.1+Math.random()*.1,trail:[]})}}let s=0,c=setInterval(()=>{o(80+Math.random()*(n.width-160),60+Math.random()*(n.height*.55)),++s>28&&clearInterval(c)},280);function l(){r.clearRect(0,0,n.width,n.height);for(let e=i.length-1;e>=0;e--){let t=i[e];t.trail.push({x:t.x,y:t.y}),t.trail.length>7&&t.trail.shift();for(let e=0;e<t.trail.length;e++)r.beginPath(),r.arc(t.trail[e].x,t.trail[e].y,t.size*(e/t.trail.length)*.5,0,Math.PI*2),r.fillStyle=t.color,r.globalAlpha=t.alpha*(e/t.trail.length)*.3,r.fill();r.beginPath(),r.arc(t.x,t.y,t.size,0,Math.PI*2),r.fillStyle=t.color,r.globalAlpha=t.alpha,r.fill(),r.globalAlpha=1,t.x+=t.vx,t.y+=t.vy,t.vy+=t.gravity,t.vx*=.98,t.alpha-=.013,t.alpha<=0&&i.splice(e,1)}t.current=requestAnimationFrame(l)}return l(),()=>{clearInterval(c),cancelAnimationFrame(t.current)}},[]),(0,c.jsx)(`canvas`,{ref:e,style:{position:`fixed`,inset:0,zIndex:1e6,pointerEvents:`none`,width:`100%`,height:`100%`}})}function h({participants:e,drawsCount:t,winners:n,onDrawComplete:r,onAllDone:i,onClose:a}){let[l,u]=(0,o.useState)(`countdown`),[d,f]=(0,o.useState)(null),[p,m]=(0,o.useState)(`Are you ready?`),[h,_]=(0,o.useState)(`● ● ●`),[v,y]=(0,o.useState)(0),[b,x]=(0,o.useState)([]),[S,C]=(0,o.useState)({left:`50vw`,top:`110vh`,opacity:0}),[ee,w]=(0,o.useState)(!1),T=(0,o.useRef)(null),E=(0,o.useRef)(null),D=(0,o.useRef)(0),O=e.length>=3?e:[...e,...[`Ahmed`,`Sara`,`Mohammed`,`Fatima`,`Omar`,`Layla`,`Hassan`,`Nour`,`Zaid`,`Mia`].filter(t=>!e.includes(t)).slice(0,Math.max(0,5-e.length))];(0,o.useEffect)(()=>{D.current=v},[v]),(0,o.useEffect)(()=>{if(l!==`countdown`)return;let e=[setTimeout(()=>{m(null),f(3)},1200),setTimeout(()=>f(2),2300),setTimeout(()=>f(1),3400),setTimeout(()=>{f(null),m(`🎰 DRAW!`)},4500),setTimeout(()=>u(`showBtn`),5400)];return()=>e.forEach(clearTimeout)},[l]),(0,o.useEffect)(()=>{if(l!==`showBtn`)return;m(null),f(null),C({left:`50vw`,top:`110vh`,opacity:0});let e=[setTimeout(()=>C({left:`50vw`,top:`110vh`,opacity:1}),100),setTimeout(()=>{if(T.current){let e=T.current.getBoundingClientRect();C({left:e.left+e.width/2+`px`,top:e.top+e.height/2+`px`,opacity:1})}},650),setTimeout(()=>w(!0),1450),setTimeout(()=>{w(!1),u(`shuffling`)},1850)];return()=>e.forEach(clearTimeout)},[l]),(0,o.useEffect)(()=>{var e;if(l!==`shuffling`)return;let a=D.current,o=((e=n[a])==null?void 0:e.winner_name)||null,s=!!o,c=0,d=55;function f(){if(_(O[Math.floor(Math.random()*O.length)]),c+=d,c>7e3?d=Math.min(d+22,480):c>5e3?d=Math.min(d+10,220):c>3e3&&(d=Math.min(d+4,120)),c>=10500){clearTimeout(E.current),s?(_(o),x(e=>{var t;return[...e,{name:o,prize:((t=n[a])==null?void 0:t.prize_text)||``,num:a+1,noWinner:!1}]})):(_(`—`),x(e=>[...e,{name:null,prize:``,num:a+1,noWinner:!0}])),setTimeout(()=>r(a),800),setTimeout(()=>{a+1<t?(y(a+1),u(`between`)):(u(`finished`),setTimeout(()=>i(),2e3))},3400);return}E.current=setTimeout(f,d)}return E.current=setTimeout(f,d),()=>clearTimeout(E.current)},[l]),(0,o.useEffect)(()=>{if(l!==`between`)return;_(`● ● ●`);let e=setTimeout(()=>u(`showBtn`),2200);return()=>clearTimeout(e)},[l]);let k=b[b.length-1],A=(l===`between`||l===`finished`)&&k,j=A&&(k==null?void 0:k.noWinner),M=A&&!(k!=null&&k.noWinner);return(0,s.createPortal)((0,c.jsxs)(`div`,{style:{position:`fixed`,inset:0,zIndex:99998,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`},children:[(0,c.jsx)(`style`,{children:g}),(0,c.jsx)(`div`,{className:`lda-bg`}),(0,c.jsx)(`div`,{className:`lda-stars`}),(0,c.jsx)(`button`,{onClick:a,style:{position:`fixed`,top:12,right:12,zIndex:9999999,padding:`7px 14px`,borderRadius:10,border:`1px solid rgba(255,255,255,0.2)`,background:`rgba(255,255,255,0.1)`,color:`#fff`,cursor:`pointer`,fontSize:12,fontWeight:700,backdropFilter:`blur(10px)`,letterSpacing:1},children:`✕ Close`}),l===`countdown`&&(0,c.jsx)(`div`,{className:`lda-center`,children:d===null?p?(0,c.jsx)(`div`,{className:p.includes(`DRAW`)?`lda-draw-label`:`lda-ready-label`,children:p},p):null:(0,c.jsx)(`div`,{className:`lda-big-num`,children:d},d)}),(l===`showBtn`||l===`shuffling`||l===`between`||l===`finished`)&&(0,c.jsxs)(`div`,{className:`lda-center`,children:[(0,c.jsxs)(`div`,{className:`lda-draw-pill`,children:[`Draw `,v+1,` of `,t]}),(0,c.jsxs)(`div`,{className:`lda-name-box ${l===`shuffling`?`lda-shuffling`:``} ${M?`lda-winner-box`:``} ${j?`lda-no-winner-box`:``}`,children:[(0,c.jsx)(`div`,{className:`lda-name-eyebrow`,children:M?`🏆 WINNER`:j?`😔 NO WINNER`:l===`shuffling`?`SELECTING...`:`READY`}),(0,c.jsx)(`div`,{className:`lda-name-text`,children:j?`—`:h}),M&&(0,c.jsxs)(`div`,{className:`lda-winner-prize`,children:[`🎁 `,k.prize||`Prize`]}),M&&(0,c.jsx)(`div`,{className:`lda-winner-sub`,children:`Congratulations! 🎉`}),j&&(0,c.jsx)(`div`,{className:`lda-no-winner-sub`,children:`Unfortunately no one was selected for this draw.`})]}),l===`showBtn`&&(0,c.jsxs)(`button`,{ref:T,className:`lda-draw-btn`,disabled:!0,children:[(0,c.jsx)(`span`,{style:{marginRight:8,fontSize:`1.2rem`},children:`🎲`}),`DRAW`]}),l===`shuffling`&&(0,c.jsxs)(`div`,{className:`lda-dots`,children:[(0,c.jsx)(`span`,{}),(0,c.jsx)(`span`,{}),(0,c.jsx)(`span`,{}),(0,c.jsx)(`span`,{}),(0,c.jsx)(`span`,{})]}),l===`finished`&&(0,c.jsx)(`div`,{className:`lda-done-msg`,children:`All draws completed! 🎊`})]}),l===`showBtn`&&(0,c.jsx)(`div`,{className:`lda-cursor ${ee?`lda-cursor-active`:``}`,style:S}),b.length>0&&(0,c.jsx)(`div`,{className:`lda-winners-strip`,children:b.map((e,t)=>(0,c.jsx)(`div`,{className:`lda-w-chip ${e.noWinner?`lda-w-chip-none`:``}`,children:e.noWinner?`😔 Draw #${e.num}: No winner`:(0,c.jsxs)(c.Fragment,{children:[`🏆 Draw #`,e.num,`: `,(0,c.jsx)(`strong`,{children:e.name}),e.prize?(0,c.jsxs)(`span`,{style:{opacity:.7},children:[` · `,e.prize]}):``]})},t))})]}),document.body)}var g=`
.lda-bg{position:fixed;inset:0;z-index:-2;background:linear-gradient(135deg,#020617 0%,#0f172a 45%,#1e1b4b 100%);}
.lda-stars{
  position:fixed;inset:0;z-index:-1;pointer-events:none;
  background-image:
    radial-gradient(1.5px 1.5px at 8% 12%,rgba(255,255,255,0.7) 0%,transparent 100%),
    radial-gradient(1px 1px at 22% 55%,rgba(255,255,255,0.5) 0%,transparent 100%),
    radial-gradient(1px 1px at 38% 8%,rgba(147,197,253,0.7) 0%,transparent 100%),
    radial-gradient(2px 2px at 52% 40%,rgba(255,255,255,0.4) 0%,transparent 100%),
    radial-gradient(1.5px 1.5px at 66% 78%,rgba(255,255,255,0.6) 0%,transparent 100%),
    radial-gradient(1px 1px at 78% 22%,rgba(147,197,253,0.5) 0%,transparent 100%),
    radial-gradient(1px 1px at 90% 60%,rgba(255,255,255,0.4) 0%,transparent 100%),
    radial-gradient(2px 2px at 14% 85%,rgba(147,197,253,0.4) 0%,transparent 100%),
    radial-gradient(1px 1px at 44% 92%,rgba(255,255,255,0.5) 0%,transparent 100%),
    radial-gradient(1.5px 1.5px at 72% 5%,rgba(255,255,255,0.6) 0%,transparent 100%);
  animation:ldaStarsTwinkle 3s ease-in-out infinite alternate;
}
@keyframes ldaStarsTwinkle{0%{opacity:0.6}100%{opacity:1}}
.lda-bg::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 55% 40% at 18% 28%,rgba(59,130,246,0.2) 0%,transparent 70%),
             radial-gradient(ellipse 50% 40% at 82% 72%,rgba(30,58,138,0.25) 0%,transparent 70%);
  animation:ldaBgBreath 5s ease-in-out infinite alternate;
}
@keyframes ldaBgBreath{0%{opacity:0.5}100%{opacity:1}}

.lda-center{display:flex;flex-direction:column;align-items:center;gap:20px;position:relative;z-index:2;padding:0 16px;width:100%;max-width:600px;}

.lda-big-num{
  font-size:clamp(80px,20vw,200px);font-weight:900;color:#fff;line-height:1;font-family:Georgia,serif;
  text-shadow:0 0 80px rgba(59,130,246,1),0 0 160px rgba(59,130,246,0.5);
  animation:ldaNumPop 0.32s cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes ldaNumPop{from{opacity:0;transform:scale(2.8)}to{opacity:1;transform:scale(1)}}

.lda-ready-label{
  font-size:clamp(22px,6vw,60px);font-weight:900;color:#fff;text-align:center;letter-spacing:-1px;
  text-shadow:0 0 50px rgba(255,255,255,0.4);
  animation:ldaLabelUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards;
}
.lda-draw-label{
  font-size:clamp(38px,9vw,100px);font-weight:900;letter-spacing:-2px;text-align:center;
  background:linear-gradient(135deg,#fbbf24,#fde68a,#f59e0b);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  filter:drop-shadow(0 0 40px rgba(251,191,36,1));
  animation:ldaDrawBounce 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes ldaLabelUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes ldaDrawBounce{0%{opacity:0;transform:scale(0.25)rotate(-10deg)}70%{transform:scale(1.1)rotate(2deg)}100%{opacity:1;transform:scale(1)rotate(0)}}

.lda-draw-pill{padding:5px 18px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:rgba(59,130,246,0.18);border:1px solid rgba(59,130,246,0.4);color:#93c5fd;}

.lda-name-box{
  width:100%;max-width:480px;padding:22px 32px;border-radius:22px;text-align:center;
  background:rgba(255,255,255,0.04);border:2px solid rgba(59,130,246,0.35);
  backdrop-filter:blur(24px);
  box-shadow:0 0 60px rgba(59,130,246,0.18),inset 0 1px 0 rgba(255,255,255,0.07);
  transition:border-color 0.3s,box-shadow 0.4s,background 0.3s;
}
.lda-name-eyebrow{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#60a5fa;margin-bottom:10px;}
.lda-name-text{font-size:clamp(22px,6vw,52px);font-weight:900;color:#fff;letter-spacing:-0.5px;min-height:1.1em;text-shadow:0 2px 20px rgba(0,0,0,0.5);word-break:break-word;}
.lda-winner-prize{color:#93c5fd;font-size:clamp(12px,2.5vw,15px);font-weight:700;margin-top:8px;}
.lda-winner-sub{color:#fde68a;font-size:clamp(12px,2.5vw,15px);font-weight:700;margin-top:4px;letter-spacing:0.5px;}

.lda-shuffling{border-color:rgba(147,197,253,0.7)!important;box-shadow:0 0 80px rgba(59,130,246,0.6),inset 0 1px 0 rgba(255,255,255,0.1)!important;}
.lda-shuffling .lda-name-text{color:#93c5fd;}
.lda-winner-box{
  border-color:#fbbf24!important;background:rgba(251,191,36,0.07)!important;
  box-shadow:0 0 90px rgba(251,191,36,0.7),0 0 180px rgba(251,191,36,0.25),inset 0 1px 0 rgba(255,255,255,0.15)!important;
  animation:ldaWinPulse 0.8s ease infinite alternate;
}
.lda-winner-box .lda-name-text{color:#fde68a!important;}
@keyframes ldaWinPulse{from{transform:scale(1)}to{transform:scale(1.022)}}

.lda-no-winner-box{
  border-color:rgba(148,163,184,0.6)!important;
  background:rgba(148,163,184,0.06)!important;
  box-shadow:0 0 40px rgba(148,163,184,0.2),inset 0 1px 0 rgba(255,255,255,0.08)!important;
}
.lda-no-winner-box .lda-name-text{color:#94a3b8!important;font-size:3rem!important;}
.lda-no-winner-sub{color:#94a3b8;font-size:clamp(11px,2.2vw,14px);font-weight:600;margin-top:8px;letter-spacing:0.3px;}
.lda-w-chip-none{background:rgba(148,163,184,0.1)!important;border-color:rgba(148,163,184,0.3)!important;color:#94a3b8!important;}

.lda-draw-btn{
  padding:clamp(14px,2.5vw,20px) clamp(36px,8vw,64px);border-radius:16px;border:none;cursor:not-allowed;position:relative;overflow:hidden;
  background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:#fff;
  font-size:clamp(1rem,2.5vw,1.3rem);font-weight:900;letter-spacing:3px;
  box-shadow:0 5px 0 #1e40af,0 12px 30px rgba(30,58,138,0.5),0 0 70px rgba(59,130,246,0.7);
  animation:ldaBtnPulse 1s ease infinite alternate;
}
.lda-draw-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.18),transparent 60%);}
.lda-draw-btn::after{content:'';position:absolute;top:0;left:-100%;width:55%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent);animation:ldaShine 1.6s ease infinite;}
@keyframes ldaShine{0%{left:-100%}100%{left:220%}}
@keyframes ldaBtnPulse{from{box-shadow:0 5px 0 #1e40af,0 12px 30px rgba(30,58,138,0.5),0 0 40px rgba(59,130,246,0.5)}to{box-shadow:0 5px 0 #1e40af,0 12px 30px rgba(30,58,138,0.5),0 0 90px rgba(59,130,246,1)}}

.lda-dots{display:flex;gap:8px;}
.lda-dots span{width:9px;height:9px;border-radius:50%;background:#3b82f6;animation:ldaDot 0.55s ease-in-out infinite alternate;}
.lda-dots span:nth-child(2){animation-delay:0.1s;background:#60a5fa;}
.lda-dots span:nth-child(3){animation-delay:0.2s;background:#93c5fd;}
.lda-dots span:nth-child(4){animation-delay:0.3s;background:#60a5fa;}
.lda-dots span:nth-child(5){animation-delay:0.4s;background:#3b82f6;}
@keyframes ldaDot{from{transform:scale(0.5);opacity:0.4}to{transform:scale(1.5);opacity:1}}

.lda-done-msg{font-size:clamp(1rem,3.5vw,1.4rem);font-weight:900;color:#fde68a;text-align:center;text-shadow:0 0 30px rgba(251,191,36,0.8);animation:ldaLabelUp 0.4s ease forwards;}

.lda-cursor{
  position:fixed;width:28px;height:28px;z-index:9999999;pointer-events:none;
  transform:translate(-4px,-4px);
  transition:left 0.85s cubic-bezier(0.34,1.4,0.64,1),top 0.85s cubic-bezier(0.34,1.4,0.64,1),opacity 0.3s;
}
.lda-cursor::before{
  content:'';position:absolute;inset:0;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cpath d='M4 2L4 24L10 18L14 28L18 26.5L14 16.5L24 16.5Z' fill='white' stroke='%231e3a8a' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat;
  background-size:contain;filter:drop-shadow(0 2px 8px rgba(30,58,138,0.8));
}
.lda-cursor-active{transform:translate(-4px,-4px)scale(0.75);}
.lda-cursor-active::before{filter:drop-shadow(0 0 12px rgba(59,130,246,1));}

.lda-winners-strip{
  position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
  display:flex;gap:8px;flex-wrap:wrap;justify-content:center;z-index:3;max-width:92%;
}
.lda-w-chip{
  padding:7px 14px;border-radius:100px;
  background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.45);
  color:#fde68a;font-size:12px;font-weight:600;backdrop-filter:blur(14px);
  box-shadow:0 0 20px rgba(251,191,36,0.2);
  animation:ldaChipIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes ldaChipIn{from{opacity:0;transform:translateY(18px)scale(0.8)}to{opacity:1;transform:none}}
`;function _({winner:e,prize:t,onClose:n}){return(0,o.useEffect)(()=>{let e=setTimeout(n,7e3);return()=>clearTimeout(e)},[]),(0,s.createPortal)((0,c.jsxs)(`div`,{style:{position:`fixed`,top:0,left:0,right:0,zIndex:999997,display:`flex`,justifyContent:`center`,padding:`12px 16px`,pointerEvents:`none`},children:[(0,c.jsx)(`style`,{children:v}),(0,c.jsxs)(`div`,{className:`ldb-banner`,children:[(0,c.jsx)(`div`,{className:`ldb-icon`,children:`🏆`}),(0,c.jsxs)(`div`,{className:`ldb-content`,children:[(0,c.jsx)(`div`,{className:`ldb-eyebrow`,children:`Winner Announced`}),(0,c.jsxs)(`div`,{className:`ldb-body`,children:[(0,c.jsx)(`strong`,{children:e}),` won `,(0,c.jsx)(`strong`,{children:t})]})]}),(0,c.jsx)(`button`,{className:`ldb-close`,style:{pointerEvents:`all`},onClick:n,children:`×`})]})]}),document.body)}var v=`
.ldb-banner{display:flex;align-items:center;gap:12px;padding:12px 18px;border-radius:16px;background:rgba(10,16,30,0.94);backdrop-filter:blur(20px);border:1.5px solid rgba(251,191,36,0.5);box-shadow:0 8px 40px rgba(0,0,0,0.35),0 0 30px rgba(251,191,36,0.18);color:#fff;pointer-events:all;max-width:460px;animation:ldbIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;}
@keyframes ldbIn{from{opacity:0;transform:translateY(-44px)scale(0.88)}to{opacity:1;transform:none}}
.ldb-icon{font-size:26px;flex-shrink:0;}
.ldb-eyebrow{font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#fbbf24;margin-bottom:2px;}
.ldb-body{font-size:13px;font-weight:600;color:#e2e8f0;}
.ldb-close{background:rgba(255,255,255,0.1);border:none;color:#94a3b8;font-size:17px;cursor:pointer;border-radius:8px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;margin-left:auto;transition:all 0.15s;}
.ldb-close:hover{background:rgba(255,255,255,0.2);color:#fff}
`;function y({win:e,onClose:t}){return(0,o.useEffect)(()=>{let e=setTimeout(t,9e3);return()=>clearTimeout(e)},[]),(0,s.createPortal)((0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(m,{}),(0,c.jsx)(`style`,{children:b}),(0,c.jsx)(`div`,{className:`ldc-overlay`,onClick:t,children:(0,c.jsxs)(`div`,{className:`ldc-modal`,onClick:e=>e.stopPropagation(),children:[(0,c.jsx)(`div`,{className:`ldc-ring`}),[...Array(14)].map((e,t)=>(0,c.jsx)(`div`,{className:`ldc-sp`,style:{"--si":t}},t)),(0,c.jsx)(`button`,{className:`ldc-close`,onClick:t,children:`×`}),(0,c.jsx)(`div`,{className:`ldc-trophy`,children:`🏆`}),(0,c.jsx)(`div`,{className:`ldc-congrats`,children:`CONGRATULATIONS!`}),(0,c.jsx)(`div`,{className:`ldc-name`,children:e==null?void 0:e.winner_name}),(0,c.jsxs)(`div`,{className:`ldc-prize-box`,children:[(0,c.jsx)(`div`,{className:`ldc-prize-label`,children:`YOU WON`}),(0,c.jsx)(`div`,{className:`ldc-prize-val`,children:e==null?void 0:e.prize_text})]}),(e==null?void 0:e.announced_at)&&(0,c.jsxs)(`div`,{className:`ldc-date`,children:[`Announced: `,f(e.announced_at)]}),(0,c.jsx)(`div`,{className:`ldc-hint`,children:`Closing in 9 seconds…`})]})})]}),document.body)}var b=`
.ldc-overlay{position:fixed;inset:0;z-index:999998;background:rgba(8,14,28,0.78);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:16px;}
.ldc-modal{width:min(420px,92vw);background:rgba(255,255,255,0.97);border-radius:26px;padding:clamp(28px,5vw,44px) clamp(20px,4vw,32px) clamp(24px,4vw,36px);text-align:center;position:relative;overflow:hidden;border:2px solid rgba(251,191,36,0.5);box-shadow:0 0 0 4px rgba(251,191,36,0.1),0 0 80px rgba(251,191,36,0.4),0 30px 70px rgba(30,58,138,0.2);animation:ldcIn 0.65s cubic-bezier(0.16,1,0.3,1) forwards;}
@keyframes ldcIn{from{opacity:0;transform:scale(0.35)rotate(-7deg)}70%{transform:scale(1.04)rotate(1.5deg)}to{opacity:1;transform:none}}
.ldc-ring{position:absolute;inset:-30px;border-radius:50%;background:conic-gradient(from 0deg,rgba(251,191,36,0.15) 0%,transparent 20%,rgba(251,191,36,0.1) 40%,transparent 60%,rgba(59,130,246,0.1) 80%,transparent 100%);animation:ldcRing 8s linear infinite;}
@keyframes ldcRing{to{transform:rotate(360deg)}}
.ldc-sp{position:absolute;width:7px;height:7px;border-radius:50%;background:radial-gradient(circle,#fde68a,#f59e0b);left:calc(4%+var(--si)*7%);top:calc(6%+var(--si)*6%);animation:ldcSp calc(1.2s+var(--si)*0.17s) ease infinite;box-shadow:0 0 6px #fbbf24;}
@keyframes ldcSp{0%,100%{opacity:0;transform:scale(0)translateY(0)}50%{opacity:1;transform:scale(1.9)translateY(-16px)}}
.ldc-close{position:absolute;right:12px;top:10px;border:none;background:rgba(100,116,139,0.12);color:#64748b;font-size:18px;cursor:pointer;border-radius:9px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:700;transition:all 0.15s;}
.ldc-close:hover{background:rgba(100,116,139,0.22);color:#334155}
.ldc-trophy{font-size:clamp(52px,10vw,72px);display:block;margin:0 auto 4px;animation:ldcTrophy 0.8s cubic-bezier(0.16,1,0.3,1) forwards;filter:drop-shadow(0 8px 20px rgba(245,158,11,0.55));}
@keyframes ldcTrophy{0%{transform:scale(0)rotate(-35deg);opacity:0}65%{transform:scale(1.18)rotate(5deg)}85%{transform:scale(0.96)}100%{transform:none;opacity:1}}
.ldc-congrats{font-size:clamp(1.1rem,4vw,1.5rem);font-weight:900;letter-spacing:2px;margin-bottom:5px;background:linear-gradient(135deg,#b45309,#f59e0b,#fde68a,#f59e0b,#b45309);background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:ldcGold 2.5s linear infinite;}
@keyframes ldcGold{0%{background-position:100%}100%{background-position:-100%}}
.ldc-name{font-size:clamp(1.05rem,3.5vw,1.3rem);font-weight:900;color:#1e3a8a;margin-bottom:14px;animation:ldcUp 0.5s 0.35s ease both;}
@keyframes ldcUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.ldc-prize-box{background:linear-gradient(135deg,rgba(30,58,138,0.06),rgba(59,130,246,0.1));border:2px solid rgba(59,130,246,0.22);border-radius:16px;padding:13px 20px;margin:0 0 12px;animation:ldcUp 0.5s 0.5s ease both;}
.ldc-prize-label{font-size:9px;font-weight:800;letter-spacing:3px;color:#64748b;text-transform:uppercase;margin-bottom:4px}
.ldc-prize-val{font-size:clamp(1.15rem,3.5vw,1.4rem);font-weight:900;color:#3b82f6}
.ldc-date{font-size:11px;color:#94a3b8;margin-bottom:5px}
.ldc-hint{font-size:11px;color:#cbd5e1}
`;function x({draw:e,nowMs:t}){let n=[{field:`registration_open_at`,label:`Registration Opens`,icon:`🟢`,activeColor:`#16a34a`,dotGradient:`linear-gradient(135deg,#16a34a,#4ade80)`},{field:`registration_close_at`,label:`Registration Closes`,icon:`🔒`,activeColor:`#f97316`,dotGradient:`linear-gradient(135deg,#ea580c,#fb923c)`},{field:`draw_at`,label:`Lucky Draw`,icon:`🎰`,activeColor:`#3b82f6`,dotGradient:`linear-gradient(135deg,#1e3a8a,#3b82f6)`}];return(0,c.jsx)(`div`,{className:`ldtl-wrap`,children:n.map((r,i)=>{let a=e[r.field]?new Date(e[r.field]).getTime():0,o=a&&t>a,s=!o&&(i===0||new Date(e[n[i-1].field]).getTime()<t),{date:l,time:u}=p(e[r.field]);return(0,c.jsxs)(`div`,{className:`ldtl-step ${o?`ldtl-past`:s?`ldtl-active`:`ldtl-future`}`,children:[(0,c.jsxs)(`div`,{className:`ldtl-dot-wrap`,children:[(0,c.jsx)(`div`,{className:`ldtl-dot`,style:o||s?{background:r.dotGradient}:{},children:o?(0,c.jsx)(`span`,{style:{color:`#fff`,fontWeight:900,fontSize:13},children:`✓`}):(0,c.jsx)(`span`,{style:{fontSize:13},children:r.icon})}),s&&(0,c.jsx)(`div`,{className:`ldtl-pulse-ring`,style:{borderColor:r.activeColor}})]}),(0,c.jsxs)(`div`,{className:`ldtl-info`,children:[(0,c.jsx)(`div`,{className:`ldtl-label`,style:s?{color:r.activeColor}:{},children:r.label}),(0,c.jsx)(`div`,{className:`ldtl-date ${o?`ldtl-date-past`:``}`,children:l}),(0,c.jsxs)(`div`,{className:`ldtl-time`,children:[u,` `,(0,c.jsx)(`span`,{className:`ldtl-tz`,children:`UAE`})]})]})]},r.field)})})}function S({h:e,idx:t}){let{date:n,time:r}=p(e.announced_at||e.created_at);return(0,c.jsxs)(`div`,{className:`ldhc-card`,style:{"--hi":t},children:[(0,c.jsxs)(`div`,{className:`ldhc-seq`,children:[`#`,e.seq_no]}),(0,c.jsxs)(`div`,{className:`ldhc-mid`,children:[(0,c.jsx)(`div`,{className:`ldhc-draw-name`,children:e.draw_title}),(0,c.jsxs)(`div`,{className:`ldhc-winner`,children:[(0,c.jsx)(`span`,{className:`ldhc-avatar`,children:`👤`}),(0,c.jsx)(`span`,{className:`ldhc-winner-name`,children:e.winner_name})]})]}),(0,c.jsxs)(`div`,{className:`ldhc-right`,children:[(0,c.jsx)(`div`,{className:`ldhc-prize`,children:e.prize_text}),(0,c.jsxs)(`div`,{className:`ldhc-date-wrap`,children:[(0,c.jsx)(`span`,{className:`ldhc-date`,children:n}),(0,c.jsx)(`span`,{className:`ldhc-time-badge`,children:r})]})]})]})}function C(){let[e,t]=(0,o.useState)(!1),[n,a]=(0,o.useState)(!0),[s,l]=(0,o.useState)(``),[f,p]=(0,o.useState)(null),[m,g]=(0,o.useState)(!1),[v,b]=(0,o.useState)(0),[C,w]=(0,o.useState)([]),[T,E]=(0,o.useState)([]),[D,O]=(0,o.useState)(!1),[k,A]=(0,o.useState)(0),j=(0,o.useRef)(null),[M,N]=(0,o.useState)(!1),[P,F]=(0,o.useState)(null),[te,ne]=(0,o.useState)(null),[re,I]=(0,o.useState)(!1),L=(0,o.useRef)(!1),[ie,ae]=(0,o.useState)([]),[R,oe]=(0,o.useState)([]),[z,B]=(0,o.useState)(null),V=(0,o.useRef)(0),H=(0,o.useRef)(null),U=(0,o.useRef)(null),W=(0,o.useRef)(!1),G=(0,o.useRef)(new Set),K=Date.now();(0,o.useEffect)(()=>{try{let e=localStorage.getItem(`ld_shown_win_id`);e&&(H.current=e);let t=localStorage.getItem(`ld_last_draw_id`);t&&(U.current=t);let n=localStorage.getItem(`ld_announced_ids`);n&&(G.current=new Set(JSON.parse(n))),localStorage.getItem(`ld_draw_anim_shown`)===`true`&&(W.current=!0)}catch(e){}},[]);let q=(0,o.useCallback)(r(function*(){let{data:e,error:t}=yield i.auth.getUser();if(t||!(e!=null&&e.user)){l(`Please login first.`),a(!1);return}let n=e.user.id;ne(n);let r=yield i.from(`luckydraw_active`).select(`*`).eq(`id`,1).single();if(r.error){l(`Error: ${r.error.message}`),a(!1);return}let o=r.data||null;if(p(o),o!=null&&o.draw_id){let e=String(o.draw_id),t=U.current;if(!t||t!==e){U.current=e,H.current=null,W.current=!1,G.current=new Set;try{localStorage.setItem(`ld_last_draw_id`,e),localStorage.removeItem(`ld_shown_win_id`),localStorage.removeItem(`ld_announced_ids`),localStorage.removeItem(`ld_draw_anim_shown`)}catch(e){}}}if(o!=null&&o.draw_id&&o!=null&&o.draw_at){let e=new Date(o.draw_at).getTime();if(Date.now()>=e){let e=Date.now();if(e-V.current>1500){V.current=e;let{data:t,error:n}=yield i.rpc(`ld_run_due`);n?l(`Auto draw failed: ${n.message}`):(t==null?void 0:t.ok)===!1&&l((t==null?void 0:t.error)||`Auto draw failed.`)}}}if(o!=null&&o.draw_id?(b((yield i.from(`luckydraw_registrations`).select(`id`,{count:`exact`,head:!0}).eq(`draw_id`,o.draw_id)).count||0),g(!!(yield i.from(`luckydraw_registrations`).select(`id`).eq(`draw_id`,o.draw_id).eq(`user_id`,n).maybeSingle()).data),ae(((yield i.from(`luckydraw_registrations`).select(`users_profiles(full_name)`).eq(`draw_id`,o.draw_id)).data||[]).map(e=>{var t;return(t=e.users_profiles)==null?void 0:t.full_name}).filter(Boolean))):(g(!1),b(0)),E((yield i.from(`luckydraw_results`).select(`id,draw_title,winner_name,prize_text,created_at,seq_no,announced_at`).order(`created_at`,{ascending:!1}).limit(50)).data||[]),o!=null&&o.draw_id){let e=(yield i.from(`luckydraw_results`).select(`id,draw_title,winner_name,prize_text,created_at,seq_no,winner_user_id,announced_at`).eq(`draw_id`,o.draw_id).order(`seq_no`,{ascending:!0})).data||[];w(e);let t=o.draw_at?new Date(o.draw_at).getTime():0,r=t&&Date.now()>=t,a=e.length>0,s=!W.current;if(r&&a&&s){W.current=!0,L.current=!0;try{localStorage.setItem(`ld_draw_anim_shown`,`true`)}catch(e){}oe(e.filter(e=>{let t=e.announced_at?new Date(e.announced_at).getTime():0;return(!t||Date.now()>=t)&&!G.current.has(String(e.id))})),I(!0)}else r&&a&&W.current&&e.forEach(e=>{let t=e.announced_at?new Date(e.announced_at).getTime():0;if((!t||Date.now()>=t)&&!G.current.has(String(e.id))){G.current.add(String(e.id));try{localStorage.setItem(`ld_announced_ids`,JSON.stringify([...G.current]))}catch(e){}B({winner_name:e.winner_name,prize_text:e.prize_text})}});let c=e.find(e=>e.winner_user_id===n);if(c){let e=c.announced_at?new Date(c.announced_at).getTime():0,t=e?Date.now()>=e:!0;if(F(c),t&&H.current!==String(c.id)){H.current=String(c.id);try{localStorage.setItem(`ld_shown_win_id`,String(c.id))}catch(e){}L.current||N(!0)}}}else w([]),F(null);a(!1)}),[]);(0,o.useEffect)(()=>(t(!0),a(!0),q(),j.current=setInterval(()=>{A(e=>e+1),q()},2e3),()=>clearInterval(j.current)),[]);let se=(0,o.useCallback)(e=>{let t=R[e];if(t&&!G.current.has(String(t.id))){G.current.add(String(t.id));try{localStorage.setItem(`ld_announced_ids`,JSON.stringify([...G.current]))}catch(e){}t.winner_name&&B({winner_name:t.winner_name,prize_text:t.prize_text})}},[R]),ce=(0,o.useCallback)(()=>{L.current=!1,I(!1),P&&H.current===String(P.id)&&N(!0)},[P]),J=(0,o.useMemo)(()=>f!=null&&f.registration_open_at?new Date(f.registration_open_at).getTime():0,[f]),Y=(0,o.useMemo)(()=>f!=null&&f.registration_close_at?new Date(f.registration_close_at).getTime():0,[f]),X=(0,o.useMemo)(()=>f!=null&&f.draw_at?new Date(f.draw_at).getTime():0,[f]),Z=(0,o.useMemo)(()=>f!=null&&f.draw_id?K<J?`BEFORE_OPEN`:K>=J&&K<Y?`OPEN`:K>=Y&&K<X?`AFTER_CLOSE`:`DRAWING_OR_DONE`:`NO_DRAW`,[f,k,J,Y,X]),le=(0,o.useMemo)(()=>Z===`BEFORE_OPEN`?J-K:Z===`OPEN`?Y-K:Z===`AFTER_CLOSE`?X-K:0,[Z,J,Y,X,K]),Q=!!(f!=null&&f.draw_id)&&Z===`OPEN`&&!m,ue=function(){var e=r(function*(){l(``);let{data:e}=yield i.auth.getUser();if(!(e!=null&&e.user)){l(`Please login first.`);return}if(!(f!=null&&f.draw_id)){l(`No active draw.`);return}if(Z!==`OPEN`){l(`Registration not open.`);return}let{data:t,error:n}=yield i.rpc(`ld_register`,{p_draw_id:f.draw_id});if(n){l(`Register failed: ${n.message}`);return}if(!(t!=null&&t.ok)){l((t==null?void 0:t.error)||`Register failed`);return}l(`Registered ✅`),yield q()});return function(){return e.apply(this,arguments)}}(),$={BEFORE_OPEN:{label:`Registration opens in`,color:`#1e40af`,bg:`rgba(30,58,138,0.07)`,border:`rgba(30,58,138,0.2)`,icon:`⏳`},OPEN:{label:`Registration closes in`,color:`#15803d`,bg:`rgba(22,163,74,0.07)`,border:`rgba(22,163,74,0.22)`,icon:`🟢`},AFTER_CLOSE:{label:`Draw starts in`,color:`#b45309`,bg:`rgba(245,158,11,0.07)`,border:`rgba(245,158,11,0.25)`,icon:`⏱`}}[Z],[de,fe]=(0,o.useState)(typeof window<`u`&&window.innerWidth<600);(0,o.useEffect)(()=>{let e=()=>fe(window.innerWidth<600);return window.addEventListener(`resize`,e),()=>window.removeEventListener(`resize`,e)},[]);let pe=de?1:8,me=D?T:T.slice(0,pe);return(0,c.jsxs)(`div`,{style:{padding:`12px`,maxWidth:900,margin:`0 auto`,minHeight:`100vh`},children:[(0,c.jsx)(`style`,{children:ee}),re&&(0,c.jsx)(h,{participants:ie,drawsCount:Number((f==null?void 0:f.draws_count)||1),winners:C,onDrawComplete:se,onAllDone:ce,onClose:()=>{L.current=!1,I(!1)}}),M&&e&&(0,c.jsx)(y,{win:P,onClose:()=>N(!1)}),z&&e&&(0,c.jsx)(_,{winner:z.winner_name,prize:z.prize_text,onClose:()=>B(null)}),(0,c.jsxs)(`div`,{className:`ldp-header`,children:[(0,c.jsx)(`div`,{className:`ldp-header-icon`,children:`🎰`}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`h1`,{className:`ldp-title`,children:`Lucky Draw`}),(0,c.jsx)(`div`,{className:`ldp-sub`,children:`Live Raffle · UAE Time`})]})]}),n?(0,c.jsxs)(`div`,{className:`ldp-loading`,children:[(0,c.jsx)(`div`,{className:`ldp-spinner`}),(0,c.jsx)(`span`,{children:`Loading…`})]}):f!=null&&f.draw_id?(0,c.jsxs)(`div`,{className:`ldp-card`,children:[(0,c.jsxs)(`div`,{className:`ldp-top`,children:[(0,c.jsxs)(`div`,{className:`ldp-top-left`,children:[(0,c.jsxs)(`div`,{className:`ldp-draw-title-row`,children:[(0,c.jsx)(`span`,{className:`ldp-draw-title`,children:f.title}),(0,c.jsx)(`span`,{className:`ldp-phase-badge ldp-phase-${Z}`,children:Z===`OPEN`?`🟢 Open`:Z===`BEFORE_OPEN`?`⏳ Soon`:Z===`AFTER_CLOSE`?`🔒 Closed`:`🎰 Drawing`})]}),(0,c.jsxs)(`div`,{className:`ldp-meta-chips`,children:[(0,c.jsx)(`span`,{className:`ldp-chip`,children:f.entry_type===`paid`?`💰 Paid · ${Number(f.entry_cost||0)} coins`:`🆓 Free Entry`}),(0,c.jsxs)(`span`,{className:`ldp-chip`,children:[`🎯 `,Number(f.draws_count||1),` Draw`,Number(f.draws_count||1)>1?`s`:``]}),(0,c.jsxs)(`span`,{className:`ldp-chip`,children:[`👥 `,v,` Registered`]})]})]}),(0,c.jsxs)(`div`,{className:`ldp-actions`,children:[(0,c.jsx)(`button`,{disabled:!Q,onClick:ue,className:`ldp-btn ${Q?`ldp-btn-primary`:`ldp-btn-dim`}`,children:m?`✅ Registered`:`Register Now`}),P&&(0,c.jsx)(`button`,{onClick:()=>N(!0),className:`ldp-btn ldp-btn-gold`,children:`🏆 My Prize`}),Z===`DRAWING_OR_DONE`&&(0,c.jsx)(`button`,{onClick:()=>{W.current=!1,L.current=!0,I(!0)},className:`ldp-btn ldp-btn-outline`,children:`🎬 Replay Draw`})]})]}),$&&(0,c.jsxs)(`div`,{className:`ldp-cd-bar`,style:{background:$.bg,borderColor:$.border},children:[(0,c.jsx)(`span`,{style:{fontSize:`1rem`},children:$.icon}),(0,c.jsx)(`span`,{className:`ldp-cd-label`,style:{color:$.color},children:$.label}),(0,c.jsx)(`span`,{className:`ldp-cd-timer`,style:{color:$.color},children:u(le)})]}),(0,c.jsxs)(`div`,{className:`ldp-section`,children:[(0,c.jsx)(`div`,{className:`ldp-section-title`,children:`📅 Schedule`}),(0,c.jsx)(x,{draw:f,nowMs:K})]}),(0,c.jsxs)(`div`,{className:`ldp-section`,children:[(0,c.jsx)(`div`,{className:`ldp-section-title`,children:`🎁 Prizes`}),(0,c.jsx)(`div`,{className:`ldp-prizes`,children:(f.prizes||[]).slice(0,Number(f.draws_count||1)).map((e,t)=>(0,c.jsxs)(`div`,{className:`ldp-prize-card`,children:[(0,c.jsx)(`div`,{className:`ldp-prize-rank`,children:t+1}),(0,c.jsx)(`div`,{className:`ldp-prize-name`,children:d(e)})]},t))})]}),(0,c.jsxs)(`div`,{className:`ldp-section`,children:[(0,c.jsx)(`div`,{className:`ldp-section-title`,children:`🏆 Results`}),C.length===0?(0,c.jsx)(`div`,{className:`ldp-empty-note`,children:Z===`DRAWING_OR_DONE`?`Draw in progress…`:`Results will appear here after the draw.`}):(0,c.jsx)(`div`,{className:`ldp-results`,children:C.map(e=>{let t=e.announced_at?new Date(e.announced_at).getTime():0,n=t?K>=t:!0,r=e.winner_user_id===te;return(0,c.jsxs)(`div`,{className:`ldp-result-row ${r?`ldp-result-mine`:``}`,children:[(0,c.jsx)(`div`,{className:`ldp-result-num`,children:e.seq_no}),(0,c.jsxs)(`div`,{className:`ldp-result-winner`,children:[(0,c.jsx)(`span`,{className:`ldp-result-avatar`,children:r?`🌟`:`👤`}),(0,c.jsx)(`div`,{children:(0,c.jsxs)(`div`,{className:`ldp-result-name`,children:[e.winner_name,r&&(0,c.jsx)(`span`,{className:`ldp-you-tag`,children:`You`})]})})]}),(0,c.jsx)(`div`,{className:`ldp-result-prize`,children:e.prize_text}),(0,c.jsx)(`div`,{children:n?(0,c.jsx)(`span`,{className:`ldp-badge-green`,children:`✓ Announced`}):(0,c.jsxs)(`span`,{className:`ldp-badge-orange`,children:[`⏱ `,u(t-K)]})})]},e.id)})})]})]}):(0,c.jsxs)(`div`,{className:`ldp-card`,style:{textAlign:`center`,padding:`40px 20px`},children:[(0,c.jsx)(`div`,{style:{fontSize:44,marginBottom:10},children:`🎲`}),(0,c.jsx)(`div`,{style:{fontSize:`1.15rem`,fontWeight:800,color:`#334155`,marginBottom:5},children:`No Active Draw`}),(0,c.jsx)(`div`,{style:{color:`#94a3b8`,fontSize:`0.85rem`},children:`Stay tuned for the next lucky draw!`})]}),(0,c.jsxs)(`div`,{className:`ldp-card`,style:{marginTop:12},children:[(0,c.jsxs)(`div`,{className:`ldp-hist-hdr`,children:[(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`div`,{className:`ldp-section-title`,style:{margin:0},children:`📜 Draw History`}),(0,c.jsxs)(`div`,{style:{fontSize:11,color:`#94a3b8`,marginTop:2},children:[T.length,` records`]})]}),(0,c.jsx)(`button`,{onClick:()=>O(e=>!e),className:`ldp-btn ldp-btn-ghost`,children:D?`Less ↑`:`All ↓`})]}),me.length===0?(0,c.jsx)(`div`,{className:`ldp-empty-note`,children:`No draw history yet.`}):(0,c.jsx)(`div`,{className:`ldp-hist-list`,children:me.map((e,t)=>(0,c.jsx)(S,{h:e,idx:t},e.id))})]}),s&&(0,c.jsx)(`div`,{className:`ldp-msg`,children:s})]})}var ee=`
  :root{--ld-deep:#1e3a8a;--ld-blue:#3b82f6;--ld-light:#60a5fa;--ld-pale:#93c5fd;--ld-text:#0f172a;--ld-sub:#334155;--ld-muted:#64748b;}

  /* ── Page Header ── */
  .ldp-header{display:flex;align-items:center;gap:10px;margin-bottom:14px;padding:10px 0 4px;animation:ldpIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards;}
  @keyframes ldpIn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}
  .ldp-header-icon{font-size:clamp(28px,5vw,38px);animation:ldpSpin 1.5s ease-out;}
  @keyframes ldpSpin{from{transform:rotateY(0)}to{transform:rotateY(720deg)}}
  .ldp-title{font-size:clamp(1.4rem,4vw,1.9rem);font-weight:900;letter-spacing:-1px;margin:0;background:linear-gradient(135deg,#1e3a8a,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .ldp-sub{color:var(--ld-muted);font-size:clamp(0.62rem,1.5vw,0.78rem);font-weight:600;letter-spacing:1.5px;text-transform:uppercase;margin-top:1px;}

  /* ── Card ── */
  .ldp-card{background:rgba(255,255,255,0.88);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.9);border-radius:18px;padding:clamp(14px,3vw,20px);box-shadow:12px 12px 40px rgba(15,23,42,0.07),-8px -8px 30px rgba(255,255,255,0.8),inset 0 0 0 1px rgba(255,255,255,0.5);animation:ldpCardIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;transform:translateY(14px);}
  @keyframes ldpCardIn{to{opacity:1;transform:none}}

  /* ── Top row ── */
  .ldp-top{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:13px;}
  .ldp-top-left{flex:1;min-width:0;}
  .ldp-draw-title-row{display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap;margin-bottom:7px;}
  .ldp-draw-title{font-size:clamp(1rem,3vw,1.25rem);font-weight:900;color:var(--ld-text);letter-spacing:-0.5px;}
  .ldp-phase-badge{padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700;white-space:nowrap;flex-shrink:0;}
  .ldp-phase-OPEN{background:rgba(22,163,74,0.1);color:#15803d;border:1px solid rgba(22,163,74,0.25);}
  .ldp-phase-BEFORE_OPEN{background:rgba(59,130,246,0.1);color:#1e3a8a;border:1px solid rgba(59,130,246,0.25);}
  .ldp-phase-AFTER_CLOSE{background:rgba(249,115,22,0.1);color:#c2410c;border:1px solid rgba(249,115,22,0.25);}
  .ldp-phase-DRAWING_OR_DONE{background:rgba(30,58,138,0.1);color:#1e3a8a;border:1px solid rgba(30,58,138,0.25);animation:ldpPhasePulse 1.5s ease infinite;}
  @keyframes ldpPhasePulse{0%,100%{opacity:1}50%{opacity:0.55}}
  .ldp-meta-chips{display:flex;gap:6px;flex-wrap:wrap;}
  .ldp-chip{padding:4px 10px;border-radius:100px;font-size:11px;font-weight:600;color:var(--ld-sub);background:rgba(30,58,138,0.06);border:1px solid rgba(30,58,138,0.1);}

  .ldp-actions{display:flex;flex-direction:column;gap:7px;min-width:130px;}

  /* ── Buttons ── */
  .ldp-btn{padding:9px 14px;border-radius:11px;border:none;font-size:clamp(0.78rem,2vw,0.88rem);font-weight:700;cursor:pointer;transition:all 0.15s cubic-bezier(0.4,0,0.2,1);white-space:nowrap;}
  .ldp-btn-primary{background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:#fff;box-shadow:0 3px 0 #1e40af,0 6px 14px rgba(30,58,138,0.26);}
  .ldp-btn-primary:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-1px);}
  .ldp-btn-primary:active:not(:disabled){transform:translateY(3px);box-shadow:0 0 0 #1e40af;}
  .ldp-btn-dim{background:#e2e8f0;color:#94a3b8;cursor:not-allowed;}
  .ldp-btn-gold{background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;box-shadow:0 3px 0 #b45309,0 6px 14px rgba(245,158,11,0.28);animation:ldpGold 2s ease infinite;}
  @keyframes ldpGold{0%,100%{box-shadow:0 3px 0 #b45309,0 6px 14px rgba(245,158,11,0.28)}50%{box-shadow:0 3px 0 #b45309,0 6px 24px rgba(245,158,11,0.56)}}
  .ldp-btn-outline{background:transparent;color:var(--ld-blue);border:1.5px solid rgba(59,130,246,0.3);}
  .ldp-btn-outline:hover{background:rgba(59,130,246,0.06);transform:translateY(-1px);}
  .ldp-btn-ghost{background:transparent;color:var(--ld-muted);border:1px solid rgba(100,116,139,0.2);padding:7px 12px;}
  .ldp-btn-ghost:hover{background:rgba(100,116,139,0.06);color:var(--ld-sub);}

  /* ── Countdown bar ── */
  .ldp-cd-bar{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:12px;border:1px solid;margin-bottom:4px;flex-wrap:wrap;}
  .ldp-cd-label{font-weight:700;font-size:clamp(0.78rem,2vw,0.88rem);flex:1;}
  .ldp-cd-timer{font-family:'Courier New',monospace;font-size:clamp(0.88rem,2.5vw,1.05rem);font-weight:900;letter-spacing:1.5px;}

  /* ── Section ── */
  .ldp-section{margin-top:18px;}
  .ldp-section-title{font-weight:800;font-size:clamp(0.68rem,1.8vw,0.78rem);letter-spacing:1.8px;text-transform:uppercase;color:var(--ld-muted);margin-bottom:12px;}

  /* ── Timeline ── */
  .ldtl-wrap{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
  @media(max-width:500px){.ldtl-wrap{grid-template-columns:1fr;gap:8px;}}
  .ldtl-step{display:flex;align-items:flex-start;gap:10px;padding:10px;border-radius:13px;background:rgba(248,250,252,0.8);border:1px solid rgba(30,58,138,0.07);transition:all 0.2s;}
  .ldtl-active{background:rgba(255,255,255,0.95)!important;box-shadow:4px 4px 12px rgba(15,23,42,0.06),-4px -4px 12px rgba(255,255,255,0.9);}
  .ldtl-dot-wrap{position:relative;flex-shrink:0;}
  .ldtl-dot{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#f1f5f9;border:2px solid rgba(30,58,138,0.1);box-shadow:3px 3px 8px rgba(15,23,42,0.06),-3px -3px 8px rgba(255,255,255,0.9);transition:all 0.3s;flex-shrink:0;}
  .ldtl-pulse-ring{position:absolute;inset:-5px;border-radius:50%;border:2px solid;opacity:0.5;animation:ldtlPulse 1.4s ease infinite;}
  @keyframes ldtlPulse{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.18);opacity:0.15}}
  .ldtl-label{font-size:clamp(9px,1.5vw,11px);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:var(--ld-muted);margin-bottom:2px;}
  .ldtl-date{font-size:clamp(11px,2vw,13px);font-weight:800;color:var(--ld-text);}
  .ldtl-date-past{text-decoration:line-through;color:var(--ld-muted)!important;font-weight:600!important;}
  .ldtl-time{font-size:clamp(10px,1.5vw,12px);color:var(--ld-muted);font-weight:600;}
  .ldtl-tz{font-size:9px;letter-spacing:1px;font-weight:700;opacity:0.65;}

  /* ── Prizes ── */
  .ldp-prizes{display:flex;gap:8px;flex-wrap:wrap;}
  .ldp-prize-card{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:12px;flex:1;min-width:100px;background:#fff;border:1px solid rgba(30,58,138,0.09);box-shadow:3px 3px 10px rgba(15,23,42,0.05),-3px -3px 10px rgba(255,255,255,0.9);transition:transform 0.2s;}
  .ldp-prize-card:hover{transform:translateY(-2px);}
  .ldp-prize-rank{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .ldp-prize-name{font-weight:700;font-size:clamp(0.78rem,2vw,0.88rem);color:var(--ld-sub);}

  /* ── Results ── */
  .ldp-empty-note{color:var(--ld-muted);font-size:clamp(0.78rem,2vw,0.88rem);padding:8px 0;}
  .ldp-results{display:flex;flex-direction:column;gap:7px;}
  .ldp-result-row{display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:12px;background:#fff;border:1px solid rgba(30,58,138,0.07);box-shadow:3px 3px 7px rgba(15,23,42,0.04),-3px -3px 7px rgba(255,255,255,0.9);flex-wrap:wrap;transition:transform 0.2s;}
  .ldp-result-row:hover{transform:translateX(3px);}
  .ldp-result-mine{background:linear-gradient(135deg,rgba(245,158,11,0.07),rgba(251,191,36,0.04))!important;border-color:rgba(245,158,11,0.3)!important;box-shadow:0 0 18px rgba(245,158,11,0.1),3px 3px 7px rgba(15,23,42,0.04)!important;}
  .ldp-result-num{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .ldp-result-winner{display:flex;align-items:center;gap:7px;flex:1;min-width:90px;}
  .ldp-result-avatar{font-size:14px;}
  .ldp-result-name{font-weight:700;font-size:clamp(0.78rem,2vw,0.88rem);color:var(--ld-text);}
  .ldp-you-tag{background:rgba(245,158,11,0.15);color:#b45309;padding:1px 7px;border-radius:100px;font-size:10px;font-weight:800;margin-left:5px;letter-spacing:0.5px;}
  .ldp-result-prize{font-size:clamp(0.75rem,1.8vw,0.85rem);font-weight:600;color:var(--ld-muted);flex:1;}
  .ldp-badge-green{padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700;background:rgba(22,163,74,0.1);color:#15803d;}
  .ldp-badge-orange{padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700;background:rgba(249,115,22,0.1);color:#c2410c;font-family:'Courier New',monospace;}

  /* ── History ── */
  .ldp-hist-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:13px;}
  .ldp-hist-list{display:flex;flex-direction:column;gap:8px;}
  .ldhc-card{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:14px;background:#fff;border:1px solid rgba(30,58,138,0.07);box-shadow:3px 3px 10px rgba(15,23,42,0.05),-3px -3px 10px rgba(255,255,255,0.9);flex-wrap:wrap;opacity:0;transform:translateY(8px);animation:ldhcIn 0.4s calc(var(--hi)*0.05s) cubic-bezier(0.16,1,0.3,1) forwards;transition:transform 0.2s;}
  .ldhc-card:hover{transform:translateX(3px);}
  @keyframes ldhcIn{to{opacity:1;transform:none}}
  .ldhc-seq{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,rgba(30,58,138,0.1),rgba(59,130,246,0.16));color:#1e3a8a;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid rgba(30,58,138,0.1);}
  .ldhc-mid{flex:2;min-width:110px;}
  .ldhc-draw-name{font-size:clamp(0.78rem,2vw,0.88rem);font-weight:800;color:var(--ld-text);margin-bottom:3px;}
  .ldhc-winner{display:flex;align-items:center;gap:6px;}
  .ldhc-avatar{width:22px;height:22px;border-radius:50%;background:rgba(30,58,138,0.07);display:flex;align-items:center;justify-content:center;font-size:11px;border:1px solid rgba(30,58,138,0.08);}
  .ldhc-winner-name{font-size:clamp(0.75rem,1.8vw,0.85rem);font-weight:700;color:var(--ld-sub);}
  .ldhc-right{flex:1;text-align:right;}
  .ldhc-prize{font-size:clamp(0.78rem,2vw,0.88rem);font-weight:800;color:var(--ld-blue);margin-bottom:3px;}
  .ldhc-date-wrap{display:flex;justify-content:flex-end;align-items:center;gap:4px;flex-wrap:wrap;}
  .ldhc-date{font-size:11px;font-weight:600;color:var(--ld-muted);}
  .ldhc-time-badge{font-size:10px;font-weight:700;color:var(--ld-pale);background:rgba(30,58,138,0.06);padding:2px 6px;border-radius:100px;}

  /* ── Loading & Msg ── */
  .ldp-loading{display:flex;align-items:center;gap:10px;padding:36px;color:var(--ld-muted);font-weight:600;justify-content:center;font-size:0.88rem;}
  .ldp-spinner{width:20px;height:20px;border:3px solid rgba(59,130,246,0.2);border-top-color:var(--ld-blue);border-radius:50%;animation:ldpSpin2 0.7s linear infinite;}
  @keyframes ldpSpin2{to{transform:rotate(360deg)}}
  .ldp-msg{margin-top:12px;padding:12px 16px;border-radius:12px;background:rgba(59,130,246,0.07);border:1px solid rgba(59,130,246,0.18);color:#1e3a8a;font-weight:600;font-size:clamp(0.78rem,2vw,0.88rem);animation:ldpMsgIn 0.3s ease;}
  @keyframes ldpMsgIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}

  /* ── Responsive ── */
  @media(max-width:600px){
    .ldp-top{flex-direction:column;}
    .ldp-actions{flex-direction:row;flex-wrap:wrap;}
    .ldhc-card{flex-direction:column;align-items:flex-start;}
    .ldhc-right{text-align:left;}
    .ldhc-date-wrap{justify-content:flex-start;}
    .ldp-result-row{gap:7px;}
  }
  @media(max-width:380px){
    .ldp-meta-chips{gap:4px;}
    .ldp-chip{font-size:10px;padding:3px 8px;}
    .ldp-prizes{flex-direction:column;}
  }
`;export{C as default};