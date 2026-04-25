import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t}from"./vendor-helmet-D-cMCI9i.js";import{tr as n}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as r}from"./supabase-CXCPPx9q.js";import{n as i,r as a,t as o}from"./vendor-motion-DyarDpDD.js";var s=e(t(),1),c=a(),l=`aidla.online`,u=`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy: #0b1437;
    --royal: #1a3a8f;
    --sky: #3b82f6;
    --gold: #f59e0b;
    --gold-light: #fcd34d;
    --slate: #64748b;
    --card-bg: rgba(255,255,255,0.97);
    --green: #10b981;
    --red: #ef4444;
  }
  * { box-sizing: border-box; }

  .hp-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    font-family: 'DM Sans', sans-serif;
    position: relative; overflow-x: hidden;
  }
  .bg-orbs { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .bg-orb-1 { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: rgba(59,130,246,0.06); filter: blur(80px); top: -200px; left: -200px; }
  .bg-orb-2 { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: rgba(245,158,11,0.05); filter: blur(80px); top: 300px; right: -250px; }

  .hp-container {
    max-width: 1000px; margin: 0 auto;
    padding: clamp(20px,5vw,60px) clamp(14px,4vw,32px) clamp(40px,8vw,80px);
    position: relative; z-index: 2; width: 100%;
  }

  .sec-label {
    display: inline-block;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: var(--navy); padding: 6px 14px; border-radius: 30px;
    font-size: 0.7rem; font-weight: 800; letter-spacing: 0.06em;
    text-transform: uppercase; margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(245,158,11,0.25);
  }
  .sec-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem,6vw,2.5rem); font-weight: 900;
    color: var(--navy); line-height: 1.15; margin-bottom: 8px;
  }
  .sec-title span {
    background: linear-gradient(135deg, var(--royal), var(--sky));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sec-desc { color: var(--slate); font-size: clamp(0.85rem,2vw,1rem); line-height: 1.5; margin-bottom: 32px; }

  /* ── Test Grid ── */
  .test-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(280px,100%),1fr));
    gap: 16px; margin-bottom: 32px;
  }
  .test-card {
    background: var(--card-bg); border-radius: 20px;
    border: 1px solid rgba(59,130,246,0.1);
    box-shadow: 0 4px 20px rgba(11,20,55,0.06);
    padding: 20px 22px 18px; cursor: pointer; transition: all 0.22s;
    position: relative; overflow: hidden;
  }
  .test-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--royal), var(--sky));
    opacity: 0; transition: opacity 0.2s;
  }
  .test-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(11,20,55,0.12); }
  .test-card:hover::before, .test-card.selected::before { opacity: 1; }
  .test-card.selected { border-color: var(--sky); box-shadow: 0 0 0 3px rgba(59,130,246,0.15), 0 12px 36px rgba(11,20,55,0.1); }

  .test-card-title {
    font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 800;
    color: var(--navy); margin-bottom: 6px; line-height: 1.3;
  }
  .test-card-desc {
    font-size: 0.73rem; color: var(--slate); line-height: 1.4; margin-bottom: 10px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .test-card-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .test-badge {
    padding: 3px 9px; border-radius: 20px; font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .badge-draft    { background: rgba(100,116,139,0.1); color: var(--slate); }
  .badge-active   { background: rgba(16,185,129,0.1);  color: #065f46; }
  .badge-live     { background: rgba(239,68,68,0.1);   color: #991b1b; }
  .badge-finished { background: rgba(59,130,246,0.1);  color: var(--royal); }
  .badge-free     { background: rgba(16,185,129,0.1);  color: #065f46; }
  .badge-paid     { background: rgba(245,158,11,0.1);  color: #92400e; }
  .badge-open     { background: rgba(99,102,241,0.1);  color: #3730a3; }

  /* Prize pills inside test card */
  .prize-pills { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 6px; }
  .prize-pill {
    display: flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 20px; font-size: 0.6rem; font-weight: 700;
  }
  .prize-pill-1 { background: rgba(245,158,11,0.12); color: #92400e; border: 1px solid rgba(245,158,11,0.2); }
  .prize-pill-2 { background: rgba(148,163,184,0.12); color: #475569; border: 1px solid rgba(148,163,184,0.2); }
  .prize-pill-3 { background: rgba(205,127,50,0.12);  color: #78350f; border: 1px solid rgba(205,127,50,0.2); }
  .prize-pill-n { background: rgba(59,130,246,0.08);  color: var(--royal); border: 1px solid rgba(59,130,246,0.15); }

  .test-card-arrow {
    position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
    font-size: 1.1rem; opacity: 0.25; transition: all 0.2s;
  }
  .test-card:hover .test-card-arrow { opacity: 1; transform: translateY(-50%) translateX(3px); }

  /* ── Post Panel ── */
  .post-panel {
    background: var(--card-bg); border-radius: 24px;
    box-shadow: 0 8px 40px rgba(11,20,55,0.08);
    border: 1px solid rgba(59,130,246,0.1); overflow: hidden;
  }
  .post-panel-header {
    padding: 20px 28px; border-bottom: 1px solid rgba(59,130,246,0.08);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  }
  .post-panel-title {
    font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 800; color: var(--navy);
    display: flex; align-items: center; gap: 10px;
  }
  .back-btn {
    background: rgba(59,130,246,0.08); border: none; border-radius: 10px;
    padding: 7px 14px; font-size: 0.75rem; font-weight: 700; color: var(--royal);
    cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .back-btn:hover { background: rgba(59,130,246,0.15); }

  /* Prize row inside panel header */
  .panel-prizes {
    display: flex; gap: 8px; flex-wrap: wrap;
    padding: 10px 28px; background: rgba(245,158,11,0.03);
    border-bottom: 1px solid rgba(59,130,246,0.07);
  }
  .panel-prize-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.72rem; font-weight: 700; color: var(--navy);
    background: var(--card-bg); border: 1px solid rgba(245,158,11,0.2);
    border-radius: 20px; padding: 4px 10px;
  }

  .post-tabs { display: flex; gap: 8px; padding: 16px 28px; border-bottom: 1px solid rgba(59,130,246,0.07); flex-wrap: wrap; }
  .post-tab {
    padding: 8px 16px; border-radius: 20px; font-size: 0.72rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer;
    background: transparent; color: var(--slate); border: 1px solid rgba(59,130,246,0.12);
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .post-tab:hover { color: var(--navy); border-color: var(--sky); }
  .post-tab.active {
    background: linear-gradient(135deg, var(--royal), var(--sky));
    color: #fff; border-color: transparent; box-shadow: 0 3px 12px rgba(26,58,143,0.25);
  }

  .post-content { padding: 24px 28px; }

  .canvas-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-bottom: 20px; }
  .canvas-preview {
    border-radius: 14px; overflow: hidden; display: block;
    box-shadow: 0 8px 40px rgba(11,20,55,0.15); max-width: 100%;
    border: 1px solid rgba(59,130,246,0.1);
  }

  .action-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 24px; }
  .action-btn {
    padding: 10px 22px; border-radius: 30px; font-size: 0.78rem; font-weight: 800;
    cursor: pointer; border: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 7px;
  }
  .btn-download { background: linear-gradient(135deg, var(--royal), var(--sky)); color: #fff; box-shadow: 0 4px 14px rgba(26,58,143,0.3); }
  .btn-download:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,58,143,0.4); }
  .btn-copy { background: rgba(16,185,129,0.1); color: #065f46; border: 1px solid rgba(16,185,129,0.2); }
  .btn-copy:hover { background: rgba(16,185,129,0.18); }

  .caption-section { margin-bottom: 18px; }
  .caption-label { font-size: 0.67rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--slate); margin-bottom: 7px; }
  .caption-box {
    background: rgba(59,130,246,0.03); border: 1px solid rgba(59,130,246,0.1);
    border-radius: 14px; padding: 14px 16px 14px 16px; font-size: 0.84rem; color: var(--navy);
    line-height: 1.65; white-space: pre-wrap; font-family: 'DM Sans', sans-serif; position: relative;
  }
  .caption-copy-btn {
    position: absolute; top: 10px; right: 10px;
    background: rgba(59,130,246,0.08); border: none; border-radius: 8px;
    padding: 5px 10px; font-size: 0.65rem; font-weight: 700; color: var(--royal);
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .caption-copy-btn:hover { background: rgba(59,130,246,0.15); }

  .skel-bg {
    background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);
    background-size: 400% 100%; animation: skel-load 1.5s ease-in-out infinite; border-radius: 8px;
  }
  @keyframes skel-load { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .hp-empty { text-align: center; padding: 48px 20px; color: var(--slate); font-size: 0.88rem; }
  .hp-empty-icon { font-size: 2.2rem; display: block; margin-bottom: 10px; }
  .hp-error {
    background: rgba(254,226,226,0.9); border: 1px solid #fca5a5; color: #991b1b;
    padding: 10px 16px; border-radius: 12px; font-size: 0.82rem; font-weight: 600; margin-bottom: 16px;
  }

  @media (max-width: 600px) {
    .post-panel-header, .panel-prizes, .post-tabs, .post-content { padding-left: 14px; padding-right: 14px; }
    .test-card-arrow { display: none; }
  }
`;function d(e){return e?new Date(e).toLocaleString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`,hour:`2-digit`,minute:`2-digit`,hour12:!0}):null}function f(e){return{draft:`badge-draft`,active:`badge-active`,live:`badge-live`,finished:`badge-finished`,out:`badge-finished`}[e]||`badge-draft`}function p(e){if(!e)return null;let t=Number(e.coins_amount);return t>0?`🪙 ${Math.floor(t).toLocaleString()} Coins`:e.prize_text?`🎁 ${e.prize_text}`:`🎁 Prize`}function m(e){return e===1?`🥇`:e===2?`🥈`:e===3?`🥉`:`#${e}`}function h(e){return e===1?`prize-pill prize-pill-1`:e===2?`prize-pill prize-pill-2`:e===3?`prize-pill prize-pill-3`:`prize-pill prize-pill-n`}function g(e,t,n,r){let i=e.getContext(`2d`),a=e.width,o=e.height,s=r===`facebook`,c=r===`story`;i.clearRect(0,0,a,o);let u=i.createLinearGradient(0,0,a,o);u.addColorStop(0,`#0b1437`),u.addColorStop(.5,`#1a3a8f`),u.addColorStop(1,`#0b1437`),i.fillStyle=u,i.fillRect(0,0,a,o);let f=(e,t,n,r)=>{i.beginPath(),i.arc(e,t,n,0,Math.PI*2),i.fillStyle=r,i.fill()};f(a*.85,o*.1,a*.24,`rgba(59,130,246,0.1)`),f(a*.1,o*.9,a*.18,`rgba(245,158,11,0.08)`),f(a*.5,o*.5,a*.45,`rgba(255,255,255,0.015)`);let h=c?8:5,g=i.createLinearGradient(0,0,a,0);g.addColorStop(0,`#f59e0b`),g.addColorStop(1,`#fcd34d`),i.fillStyle=g,i.fillRect(0,0,a,h),i.fillRect(0,o-h,a,h);let _=c?140:s?68:98,v=c?52:s?30:38;i.font=`900 ${v}px Arial`,i.fillStyle=`#f59e0b`,i.textAlign=`center`,i.fillText(`AIDLA`,a/2,_),i.font=`700 ${c?22:s?13:17}px Arial`,i.fillStyle=`rgba(255,255,255,0.45)`,i.fillText(`◆  TEST COMPETITION  ◆`,a/2,_+v*1.1);let y=t.title||`Untitled Test`,b=c?66:s?42:54;i.font=`900 ${b}px Georgia`,i.fillStyle=`#fff`,i.textAlign=`center`;let x=a*.82,S=y.split(` `),C=[],w=``;S.forEach(e=>{let t=w?w+` `+e:e;i.measureText(t).width>x&&w?(C.push(w),w=e):w=t}),w&&C.push(w);let T=c?o*.36:o*.4,E=b*1.2,D=T-(C.length-1)*E/2;C.forEach((e,t)=>i.fillText(e,a/2,D+t*E));let O=D+C.length*E+(c?32:20),k=a*.22,A=i.createLinearGradient(a/2-k,0,a/2+k,0);A.addColorStop(0,`transparent`),A.addColorStop(.5,`#f59e0b`),A.addColorStop(1,`transparent`),i.fillStyle=A,i.fillRect(a/2-k,O,k*2,2);let j=c?26:s?15:19;i.font=`600 ${j}px Arial`,i.fillStyle=`rgba(255,255,255,0.72)`,i.textAlign=`center`;let M=[];t.entry_type===`free`?M.push(`✅ Free Entry`):t.entry_cost>0&&M.push(`🪙 ${t.entry_cost} Coins to Enter`),t.questions_per_user&&M.push(`📝 ${t.questions_per_user} Questions  ⏱ ${t.time_per_question_sec}s each`),t.registration_open_at&&t.registration_close_at?M.push(`📋 Reg: ${d(t.registration_open_at)} → ${d(t.registration_close_at)}`):t.registration_open_at?M.push(`📋 Reg opens: ${d(t.registration_open_at)}`):t.registration_close_at&&M.push(`📋 Reg closes: ${d(t.registration_close_at)}`),t.test_start_at&&t.test_end_at?M.push(`🏁 Test: ${d(t.test_start_at)} → ${d(t.test_end_at)}`):t.test_start_at?M.push(`🏁 Test starts: ${d(t.test_start_at)}`):t.test_end_at&&M.push(`🏁 Test ends: ${d(t.test_end_at)}`),t.results_announce_at&&M.push(`📢 Results: ${d(t.results_announce_at)}`);let N=O+(c?52:34),P=j*1.65;M.forEach((e,t)=>i.fillText(e,a/2,N+t*P));let F=n.filter(e=>e.enabled).sort((e,t)=>e.rank_no-t.rank_no);if(F.length>0){let e=N+M.length*P+(c?40:26),t=c?22:s?13:17;i.font=`800 ${t}px Arial`,i.fillStyle=`#f59e0b`,i.textAlign=`center`,i.fillText(`🏆  PRIZES`,a/2,e);let n=c?24:s?14:18;i.font=`600 ${n}px Arial`,i.fillStyle=`rgba(255,255,255,0.82)`;let r=n*1.7;F.slice(0,4).forEach((n,o)=>{let s=`${m(n.rank_no)}  ${p(n)}`;i.fillText(s,a/2,e+t*1.6+o*r)})}let I=o-(c?220:s?95:145),L=a*.52,R=c?78:s?42:56,z=(a-L)/2,B=R/2,V=i.createLinearGradient(z,0,z+L,0);V.addColorStop(0,`#f59e0b`),V.addColorStop(1,`#fcd34d`),i.beginPath(),i.moveTo(z+B,I),i.lineTo(z+L-B,I),i.arcTo(z+L,I,z+L,I+R,B),i.lineTo(z+B,I+R),i.arcTo(z,I+R,z,I,B),i.closePath(),i.fillStyle=V,i.fill();let H=c?30:s?17:22;i.font=`900 ${H}px Arial`,i.fillStyle=`#0b1437`,i.textAlign=`center`,i.fillText(`JOIN NOW →`,a/2,I+R/2+H*.36),i.font=`500 ${c?22:s?13:17}px Arial`,i.fillStyle=`rgba(255,255,255,0.3)`,i.textAlign=`center`,i.fillText(l,a/2,o-(c?58:28))}var _=[{id:`facebook`,label:`📘 Facebook Post`,w:1200,h:630},{id:`whatsapp`,label:`💚 WhatsApp Status`,w:1080,h:1080},{id:`story`,label:`📱 Story / Reel`,w:1080,h:1920}];function v(e,t,n){let r=`https://${l}/tests/${e.id}`,i=e.entry_type===`free`,[a,o,s,c,u]=n===`facebook`?[`📣`,`🎓`,`🏆`,`✨`,`🔗`]:n===`whatsapp`?[`🔥`,`🎯`,`🧠`,`💪`,`📲`]:[`⚡`,`🚀`,`🎉`,`🌟`,`👇`],f=t.filter(e=>e.enabled).sort((e,t)=>e.rank_no-t.rank_no),h=e.description||`New test competition on AIDLA. Prove your knowledge and win!`,g=h.length>100?h.slice(0,97).trimEnd()+`…`:h;return[`${a} *${e.title}*`,``,`${o} ${g}`,``,`${s} *Details:*`,`• Entry: ${i?`FREE 🎁`:`${e.entry_cost} AIDLA Coins 🪙`}`,`• Questions: ${e.questions_per_user} per participant`,`• Time per question: ${e.time_per_question_sec}s`,`• Winners: Top ${e.max_winners}`,e.registration_open_at?`• Reg opens: ${d(e.registration_open_at)}`:null,e.registration_close_at?`• Reg closes: ${d(e.registration_close_at)}`:null,e.test_start_at?`• Test starts: ${d(e.test_start_at)}`:null,e.test_end_at?`• Test ends: ${d(e.test_end_at)}`:null,e.results_announce_at?`• Results: ${d(e.results_announce_at)}`:null,e.max_participants?`• Limited to ${e.max_participants} participants`:null,``,f.length>0?`🏆 *Prize Pool:*`:null,...f.map(e=>`  ${m(e.rank_no)} Rank ${e.rank_no}: ${p(e)}`),f.length>0?``:null,`${c} *Don't miss your chance to win!*`,``,`${u} Register now 👇`,r,``,`#AIDLA #TestCompetition #OnlineQuiz #WinPrizes #KnowledgeTest`].filter(e=>e!==null).join(`
`)}function y({test:e,prizes:t,onBack:n}){let[r,i]=(0,s.useState)(`facebook`),[a,u]=(0,s.useState)(!1),[d,f]=(0,s.useState)(!1),h=(0,s.useRef)(null),y=_.find(e=>e.id===r),b=v(e,t,r),x=`https://${l}/tests/${e.id}`;(0,s.useEffect)(()=>{let n=h.current;n&&(n.width=y.w,n.height=y.h,g(n,e,t,r))},[r,e,t,y]);let S=()=>{let t=h.current;if(!t)return;let n=document.createElement(`a`);n.href=t.toDataURL(`image/png`),n.download=`aidla-${e.title.replace(/\s+/g,`-`).toLowerCase()}-${r}.png`,n.click()},C=()=>navigator.clipboard.writeText(b).then(()=>{u(!0),setTimeout(()=>u(!1),2200)}),w=()=>navigator.clipboard.writeText(x).then(()=>{f(!0),setTimeout(()=>f(!1),2200)}),T=Math.min(580/y.w,1),E=Math.round(y.w*T),D=Math.round(y.h*T),O=t.filter(e=>e.enabled).sort((e,t)=>e.rank_no-t.rank_no);return(0,c.jsxs)(o.div,{className:`post-panel`,initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.3},children:[(0,c.jsxs)(`div`,{className:`post-panel-header`,children:[(0,c.jsxs)(`div`,{className:`post-panel-title`,children:[`📣 `,e.title]}),(0,c.jsx)(`button`,{className:`back-btn`,onClick:n,children:`← All Tests`})]}),O.length>0&&(0,c.jsxs)(`div`,{className:`panel-prizes`,children:[(0,c.jsx)(`span`,{style:{fontSize:`0.65rem`,fontWeight:800,color:`var(--slate)`,textTransform:`uppercase`,letterSpacing:`0.05em`,alignSelf:`center`},children:`Prizes:`}),O.map(e=>(0,c.jsxs)(`div`,{className:`panel-prize-item`,children:[m(e.rank_no),` `,p(e)]},e.id))]}),(0,c.jsx)(`div`,{className:`post-tabs`,children:_.map(e=>(0,c.jsx)(`button`,{className:`post-tab ${r===e.id?`active`:``}`,onClick:()=>i(e.id),children:e.label},e.id))}),(0,c.jsxs)(`div`,{className:`post-content`,children:[(0,c.jsxs)(`div`,{className:`canvas-wrap`,children:[(0,c.jsx)(`canvas`,{ref:h,className:`canvas-preview`,style:{width:E,height:D}}),(0,c.jsxs)(`p`,{style:{fontSize:`0.67rem`,color:`var(--slate)`,margin:0},children:[y.w,` × `,y.h,`px · Full resolution PNG download`]})]}),(0,c.jsxs)(`div`,{className:`action-row`,children:[(0,c.jsx)(`button`,{className:`action-btn btn-download`,onClick:S,children:`⬇️ Download Image`}),(0,c.jsx)(`button`,{className:`action-btn btn-copy`,onClick:w,children:d?`✅ Copied!`:`🔗 Copy Link`})]}),(0,c.jsxs)(`div`,{className:`caption-section`,children:[(0,c.jsx)(`div`,{className:`caption-label`,children:`📝 Auto-Generated Caption`}),(0,c.jsxs)(`div`,{className:`caption-box`,children:[b,(0,c.jsx)(`button`,{className:`caption-copy-btn`,onClick:C,children:a?`✅ Copied!`:`📋 Copy`})]})]}),(0,c.jsxs)(`div`,{className:`caption-section`,children:[(0,c.jsx)(`div`,{className:`caption-label`,children:`🔗 Direct Test Link`}),(0,c.jsxs)(`div`,{className:`caption-box`,style:{fontSize:`0.8rem`,wordBreak:`break-all`,paddingRight:80},children:[x,(0,c.jsx)(`button`,{className:`caption-copy-btn`,onClick:w,children:d?`✅ Copied!`:`📋 Copy`})]})]})]})]})}function b(){let[e,t]=(0,s.useState)([]),[a,l]=(0,s.useState)({}),[g,_]=(0,s.useState)(!0),[v,b]=(0,s.useState)(``),[x,S]=(0,s.useState)(null);(0,s.useEffect)(()=>{(function(){var e=n(function*(){let{data:e,error:n}=yield r.from(`test_tests`).select(`id,title,description,status,entry_type,entry_cost,registration_open_at,registration_close_at,test_start_at,test_end_at,results_announce_at,questions_per_user,time_per_question_sec,max_participants,max_winners,created_at`).is(`deleted_at`,null).order(`created_at`,{ascending:!1});if(n){b(n.message),_(!1);return}let i=e||[];if(t(i),i.length===0){_(!1);return}let a=i.map(e=>e.id),{data:o,error:s}=yield r.from(`test_prizes`).select(`id,test_id,rank_no,prize_type,prize_text,coins_amount,enabled`).in(`test_id`,a).order(`rank_no`,{ascending:!0});if(s)b(s.message);else{let e={};(o||[]).forEach(t=>{e[t.test_id]||(e[t.test_id]=[]),e[t.test_id].push(t)}),l(e)}_(!1)});return function(){return e.apply(this,arguments)}})()()},[]);let C=x&&a[x.id]||[];return(0,c.jsxs)(`div`,{className:`hp-root`,children:[(0,c.jsx)(`style`,{children:u}),(0,c.jsxs)(`div`,{className:`bg-orbs`,children:[(0,c.jsx)(`div`,{className:`bg-orb-1`}),(0,c.jsx)(`div`,{className:`bg-orb-2`})]}),(0,c.jsxs)(`div`,{className:`hp-container`,children:[(0,c.jsxs)(o.div,{initial:{opacity:0,y:15},animate:{opacity:1,y:0},transition:{duration:.5},children:[(0,c.jsx)(`span`,{className:`sec-label`,children:`Admin`}),(0,c.jsxs)(`h2`,{className:`sec-title`,children:[`Post `,(0,c.jsx)(`span`,{children:`Generator`})]}),(0,c.jsx)(`p`,{className:`sec-desc`,children:`Generate ready-to-share promotional images and captions for every test — Facebook banners, WhatsApp statuses & Stories — with prizes, entry details and your direct link.`})]}),v&&(0,c.jsxs)(`div`,{className:`hp-error`,children:[`⚠️ `,v]}),(0,c.jsx)(i,{mode:`wait`,children:x?(0,c.jsx)(y,{test:x,prizes:C,onBack:()=>S(null)},`panel`):(0,c.jsx)(o.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.22},children:g?(0,c.jsx)(`div`,{className:`test-grid`,children:Array.from({length:6}).map((e,t)=>(0,c.jsx)(`div`,{style:{borderRadius:20,overflow:`hidden`,border:`1px solid rgba(59,130,246,0.08)`},children:(0,c.jsx)(`div`,{className:`skel-bg`,style:{height:140}})},t))}):e.length===0?(0,c.jsxs)(`div`,{className:`hp-empty`,children:[(0,c.jsx)(`span`,{className:`hp-empty-icon`,children:`📋`}),`No tests found. Create a test first.`]}):(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)(`p`,{style:{fontSize:`0.8rem`,color:`var(--slate)`,marginBottom:16,fontWeight:600},children:[e.length,` test`,e.length===1?``:`s`,` — click any to generate posts`]}),(0,c.jsx)(`div`,{className:`test-grid`,children:e.map((e,t)=>{let n=(a[e.id]||[]).filter(e=>e.enabled).sort((e,t)=>e.rank_no-t.rank_no);return(0,c.jsxs)(o.div,{className:`test-card ${(x==null?void 0:x.id)===e.id?`selected`:``}`,initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{delay:Math.min(t*.05,.4)},onClick:()=>S(e),children:[(0,c.jsx)(`div`,{className:`test-card-title`,children:e.title}),e.description&&(0,c.jsx)(`div`,{className:`test-card-desc`,children:e.description}),(0,c.jsxs)(`div`,{className:`test-card-meta`,children:[(0,c.jsx)(`span`,{className:`test-badge ${f(e.status)}`,children:e.status}),(0,c.jsx)(`span`,{className:`test-badge ${e.entry_type===`free`?`badge-free`:`badge-paid`}`,children:e.entry_type===`free`?`Free`:`🪙 ${e.entry_cost}`}),e.registration_open_at&&(0,c.jsxs)(`span`,{className:`test-badge badge-open`,children:[`📅 `,d(e.registration_open_at)]})]}),n.length>0&&(0,c.jsxs)(`div`,{className:`prize-pills`,children:[n.slice(0,4).map(e=>(0,c.jsxs)(`span`,{className:h(e.rank_no),children:[m(e.rank_no),` `,p(e)]},e.id)),n.length>4&&(0,c.jsxs)(`span`,{className:`prize-pill prize-pill-n`,children:[`+`,n.length-4,` more`]})]}),(0,c.jsx)(`span`,{className:`test-card-arrow`,children:`→`})]},e.id)})})]})},`grid`)})]})]})}export{b as default};