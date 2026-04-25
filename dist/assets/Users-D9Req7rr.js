import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t}from"./vendor-helmet-D-cMCI9i.js";import{a as n,c as r,i,n as a,o,r as s,s as c}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as l}from"./supabase-CXCPPx9q.js";import{n as u,r as d,t as f}from"./vendor-motion-DyarDpDD.js";var p=e(t(),1),m=d(),h=`
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
    --pink: #ec4899;
  }

  * { box-sizing: border-box; }

  .usr-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    position: relative;
  }

  .bg-orbs { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .bg-orb-1 { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: rgba(59,130,246,0.06); filter: blur(80px); top: -200px; left: -200px; }
  .bg-orb-2 { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: rgba(245,158,11,0.05); filter: blur(80px); top: 300px; right: -250px; }
  .bg-orb-3 { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: rgba(16,185,129,0.04); filter: blur(80px); bottom: 200px; left: 20%; }

  .usr-container {
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
  .sec-desc { color: var(--slate); font-size: clamp(0.85rem,2vw,1rem); line-height: 1.5; max-width: 520px; margin-bottom: 28px; }

  .usr-tabs { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
  .usr-tab {
    padding: 9px 20px; border-radius: 30px; font-size: 0.75rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer;
    background: var(--card-bg); color: var(--slate);
    box-shadow: 0 2px 10px rgba(11,20,55,0.06);
    border: 1px solid rgba(59,130,246,0.08); transition: all 0.2s;
  }
  .usr-tab:hover { color: var(--navy); box-shadow: 0 4px 16px rgba(11,20,55,0.1); }
  .usr-tab.active {
    background: linear-gradient(135deg, var(--royal), var(--sky));
    color: #fff; box-shadow: 0 4px 16px rgba(26,58,143,0.28); border-color: transparent;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(200px,100%),1fr));
    gap: 14px; margin-bottom: 20px;
  }
  .stat-card {
    background: var(--card-bg); border-radius: 18px;
    border: 1px solid rgba(59,130,246,0.08);
    box-shadow: 0 4px 20px rgba(11,20,55,0.05);
    padding: 20px 22px; display: flex; align-items: center; gap: 14px;
  }
  .stat-icon {
    width: 46px; height: 46px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0;
  }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 900; color: var(--navy); }
  .stat-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--slate); margin-top: 2px; }

  .usr-section {
    background: var(--card-bg); border-radius: 24px;
    box-shadow: 0 8px 40px rgba(11,20,55,0.06);
    border: 1px solid rgba(59,130,246,0.08); overflow: hidden; margin-bottom: 20px;
  }
  .usr-section-header {
    padding: clamp(14px,3.5vw,20px) clamp(16px,4vw,28px);
    border-bottom: 1px solid rgba(59,130,246,0.08);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  }
  .usr-section-title {
    font-family: 'Playfair Display', serif; font-size: clamp(1rem,3vw,1.2rem);
    font-weight: 800; color: var(--navy); margin: 0;
  }

  .search-bar {
    display: flex; align-items: center; gap: 10px;
    margin: clamp(14px,3vw,20px) clamp(16px,4vw,28px);
    background: rgba(59,130,246,0.04); border: 1px solid rgba(59,130,246,0.12);
    border-radius: 12px; padding: 10px 16px;
  }
  .search-icon { font-size: 0.9rem; color: var(--slate); flex-shrink: 0; }
  .search-input {
    border: none; outline: none; background: transparent;
    font-size: 0.88rem; color: var(--navy); flex: 1; font-family: 'DM Sans', sans-serif;
  }
  .search-input::placeholder { color: var(--slate); }
  .search-clear {
    background: none; border: none; cursor: pointer; color: var(--slate);
    font-size: 1.1rem; padding: 0; line-height: 1; transition: color 0.15s;
  }
  .search-clear:hover { color: var(--navy); }

  .usr-table-wrap { overflow-x: auto; }
  .usr-table { width: 100%; border-collapse: collapse; }
  .usr-th {
    padding: 10px clamp(14px,3vw,20px); text-align: left;
    font-size: 0.65rem; font-weight: 800; color: var(--slate);
    text-transform: uppercase; letter-spacing: 0.06em;
    background: rgba(59,130,246,0.03);
    border-bottom: 1px solid rgba(59,130,246,0.08);
  }
  .usr-th.right { text-align: right; }
  .usr-td {
    padding: 12px clamp(14px,3vw,20px); font-size: 0.85rem; color: var(--navy);
    border-bottom: 1px solid rgba(59,130,246,0.05); vertical-align: middle;
  }
  .usr-td.muted { color: var(--slate); }
  .usr-td.right { text-align: right; }
  .usr-tr:last-child .usr-td { border-bottom: none; }
  .usr-tr:hover .usr-td { background: rgba(59,130,246,0.02); }

  .user-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 0.8rem; font-weight: 800; flex-shrink: 0;
  }
  .user-cell { display: flex; align-items: center; gap: 10px; }
  .user-name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }

  .badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 0.65rem; font-weight: 700; white-space: nowrap;
  }
  .badge-blue { background: rgba(59,130,246,0.1); color: var(--royal); }
  .badge-gold { background: rgba(245,158,11,0.12); color: #92400e; }

  .bar-list { padding: clamp(14px,3vw,20px) clamp(16px,4vw,28px); display: flex; flex-direction: column; gap: 12px; }
  .bar-meta { display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 5px; }
  .bar-name { font-weight: 600; color: var(--navy); }
  .bar-count { color: var(--slate); font-weight: 600; }
  .bar-track { height: 5px; border-radius: 4px; background: rgba(59,130,246,0.08); overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; transition: width 0.7s cubic-bezier(0.4,0,0.2,1); }

  .skel-bg {
    background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);
    background-size: 400% 100%; animation: skel-load 1.5s ease-in-out infinite; border-radius: 6px;
  }
  @keyframes skel-load { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .usr-empty { text-align: center; padding: clamp(28px,6vw,48px) 20px; color: var(--slate); font-size: 0.88rem; }
  .usr-empty-icon { font-size: 2rem; display: block; margin-bottom: 10px; }
  .usr-error {
    background: rgba(254,226,226,0.9); border: 1px solid #fca5a5; color: #991b1b;
    padding: 10px 16px; border-radius: 12px; font-size: 0.82rem; font-weight: 600;
    margin-bottom: 16px;
  }
  .table-footer {
    padding: 10px clamp(16px,4vw,28px); font-size: 0.7rem; color: var(--slate);
    border-top: 1px solid rgba(59,130,246,0.06); font-weight: 600;
  }
  .two-col {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(min(320px,100%),1fr));
    gap: 14px; margin-bottom: 20px;
  }

  @media (max-width:640px) {
    .stat-grid { grid-template-columns: 1fr 1fr; }
    .hide-mobile { display: none; }
  }
  @media (max-width:400px) {
    .stat-grid { grid-template-columns: 1fr; }
  }
`;function g(e){let t=Number(e);return!t&&t!==0?`0`:Math.floor(t).toLocaleString()}function _(e){return e?new Date(e).toLocaleDateString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`}):`—`}function v(e){let t=[`#6366f1`,`#10b981`,`#f59e0b`,`#3b82f6`,`#ec4899`,`#8b5cf6`,`#14b8a6`,`#f97316`],n=0;for(let t=0;t<(e||``).length;t++)n=e.charCodeAt(t)+((n<<5)-n);return t[Math.abs(n)%t.length]}function y(e,t){return e.reduce((e,n)=>{let r=n[t]||`Unknown`;return e[r]=(e[r]||0)+1,e},{})}function b(e){let t={};e.forEach(e=>{var n;let r=(n=e.created_at)==null?void 0:n.slice(0,10);r&&(t[r]=(t[r]||0)+1)});let n=Object.entries(t).sort(([e],[t])=>e.localeCompare(t)),r=0;return n.map(([e,t])=>(r+=t,{date:e,"New Users":t,"Total Users":r}))}function x({emoji:e,label:t,value:n,bg:r}){return(0,m.jsxs)(`div`,{className:`stat-card`,children:[(0,m.jsx)(`div`,{className:`stat-icon`,style:{background:r},children:e}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`div`,{className:`stat-value`,children:n}),(0,m.jsx)(`div`,{className:`stat-label`,children:t})]})]})}function S({title:e,data:t,color:n}){var r;let i=Object.entries(t).sort(([,e],[,t])=>t-e).slice(0,10),a=((r=i[0])==null?void 0:r[1])||1;return(0,m.jsxs)(`div`,{className:`usr-section`,children:[(0,m.jsxs)(`div`,{className:`usr-section-header`,children:[(0,m.jsx)(`h3`,{className:`usr-section-title`,children:e}),(0,m.jsxs)(`span`,{style:{fontSize:`0.7rem`,color:`var(--slate)`,fontWeight:600},children:[i.length,` entries`]})]}),(0,m.jsxs)(`div`,{className:`bar-list`,children:[i.length===0&&(0,m.jsxs)(`div`,{className:`usr-empty`,children:[(0,m.jsx)(`span`,{className:`usr-empty-icon`,children:`🌍`}),`No data yet`]}),i.map(([e,t],r)=>(0,m.jsxs)(f.div,{initial:{opacity:0,x:-10},animate:{opacity:1,x:0},transition:{delay:r*.04},children:[(0,m.jsxs)(`div`,{className:`bar-meta`,children:[(0,m.jsx)(`span`,{className:`bar-name`,children:e}),(0,m.jsx)(`span`,{className:`bar-count`,children:t})]}),(0,m.jsx)(`div`,{className:`bar-track`,children:(0,m.jsx)(`div`,{className:`bar-fill`,style:{width:`${t/a*100}%`,background:n}})})]},e))]})]})}function C({rows:e=6}){return(0,m.jsx)(`div`,{style:{padding:`12px 0`},children:Array.from({length:e}).map((e,t)=>(0,m.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:14,padding:`12px 24px`,borderBottom:`1px solid rgba(59,130,246,0.05)`},children:[(0,m.jsx)(`div`,{className:`skel-bg`,style:{width:34,height:34,borderRadius:`50%`,flexShrink:0}}),(0,m.jsxs)(`div`,{style:{flex:1},children:[(0,m.jsx)(`div`,{className:`skel-bg`,style:{height:13,width:130,marginBottom:6}}),(0,m.jsx)(`div`,{className:`skel-bg`,style:{height:10,width:180}})]}),(0,m.jsx)(`div`,{className:`skel-bg`,style:{height:13,width:60}}),(0,m.jsx)(`div`,{className:`skel-bg`,style:{height:13,width:80}}),(0,m.jsx)(`div`,{className:`skel-bg`,style:{height:13,width:70}})]},t))})}function w({users:e}){let t=(0,p.useMemo)(()=>y(e,`country`),[e]),l=(0,p.useMemo)(()=>y(e,`city`),[e]),u=(0,p.useMemo)(()=>b(e),[e]),d=(0,p.useMemo)(()=>e.reduce((e,t)=>e+(parseFloat(t.total_aidla_coins)||0),0),[e]);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(`div`,{className:`stat-grid`,children:[(0,m.jsx)(x,{emoji:`👥`,label:`Total Users`,value:e.length.toLocaleString(),bg:`rgba(99,102,241,0.1)`}),(0,m.jsx)(x,{emoji:`🌍`,label:`Countries`,value:Object.keys(t).length,bg:`rgba(16,185,129,0.1)`}),(0,m.jsx)(x,{emoji:`🏙️`,label:`Cities`,value:Object.keys(l).length,bg:`rgba(245,158,11,0.1)`}),(0,m.jsx)(x,{emoji:`🪙`,label:`Total AIDLA Coins`,value:g(d),bg:`rgba(236,72,153,0.1)`})]}),(0,m.jsxs)(`div`,{className:`usr-section`,style:{marginBottom:20},children:[(0,m.jsx)(`div`,{className:`usr-section-header`,children:(0,m.jsx)(`h3`,{className:`usr-section-title`,children:`📈 User Growth Over Time`})}),(0,m.jsx)(`div`,{style:{padding:`20px 16px 12px`},children:u.length===0?(0,m.jsxs)(`div`,{className:`usr-empty`,children:[(0,m.jsx)(`span`,{className:`usr-empty-icon`,children:`📈`}),`No data yet`]}):(0,m.jsx)(r,{width:`100%`,height:220,children:(0,m.jsxs)(a,{data:u,margin:{top:5,right:10,bottom:0,left:0},children:[(0,m.jsxs)(`defs`,{children:[(0,m.jsxs)(`linearGradient`,{id:`grad-total`,x1:`0`,y1:`0`,x2:`0`,y2:`1`,children:[(0,m.jsx)(`stop`,{offset:`5%`,stopColor:`#1a3a8f`,stopOpacity:.2}),(0,m.jsx)(`stop`,{offset:`95%`,stopColor:`#1a3a8f`,stopOpacity:0})]}),(0,m.jsxs)(`linearGradient`,{id:`grad-new`,x1:`0`,y1:`0`,x2:`0`,y2:`1`,children:[(0,m.jsx)(`stop`,{offset:`5%`,stopColor:`#10b981`,stopOpacity:.15}),(0,m.jsx)(`stop`,{offset:`95%`,stopColor:`#10b981`,stopOpacity:0})]})]}),(0,m.jsx)(o,{strokeDasharray:`3 3`,stroke:`rgba(59,130,246,0.08)`}),(0,m.jsx)(i,{dataKey:`date`,tick:{fontSize:10,fill:`#94a3b8`},tickLine:!1,axisLine:!1}),(0,m.jsx)(s,{tick:{fontSize:10,fill:`#94a3b8`},tickLine:!1,axisLine:!1}),(0,m.jsx)(c,{contentStyle:{borderRadius:10,border:`1px solid rgba(59,130,246,0.12)`,fontSize:12,fontFamily:`DM Sans, sans-serif`},labelStyle:{fontWeight:700,color:`#0b1437`}}),(0,m.jsx)(n,{type:`monotone`,dataKey:`Total Users`,stroke:`#1a3a8f`,strokeWidth:2,fill:`url(#grad-total)`,dot:!1}),(0,m.jsx)(n,{type:`monotone`,dataKey:`New Users`,stroke:`#10b981`,strokeWidth:2,fill:`url(#grad-new)`,dot:!1})]})})})]}),(0,m.jsxs)(`div`,{className:`two-col`,children:[(0,m.jsx)(S,{title:`🌍 Users by Country`,data:t,color:`linear-gradient(90deg,#1a3a8f,#3b82f6)`}),(0,m.jsx)(S,{title:`🏙️ Users by City`,data:l,color:`linear-gradient(90deg,#10b981,#34d399)`})]})]})}function T({users:e,loading:t}){let[n,r]=(0,p.useState)(``),i=(0,p.useMemo)(()=>{let t=n.toLowerCase();return t?e.filter(e=>{var n,r,i,a;return((n=e.full_name)==null?void 0:n.toLowerCase().includes(t))||((r=e.email)==null?void 0:r.toLowerCase().includes(t))||((i=e.city)==null?void 0:i.toLowerCase().includes(t))||((a=e.country)==null?void 0:a.toLowerCase().includes(t))}):e},[e,n]);return(0,m.jsxs)(`div`,{className:`usr-section`,children:[(0,m.jsxs)(`div`,{className:`usr-section-header`,children:[(0,m.jsx)(`h3`,{className:`usr-section-title`,children:`👤 All Users`}),(0,m.jsxs)(`span`,{style:{fontSize:`0.7rem`,color:`var(--slate)`,fontWeight:600},children:[e.length,` total`]})]}),(0,m.jsxs)(`div`,{className:`search-bar`,children:[(0,m.jsx)(`span`,{className:`search-icon`,children:`🔍`}),(0,m.jsx)(`input`,{className:`search-input`,placeholder:`Search by name, email, city or country…`,value:n,onChange:e=>r(e.target.value)}),n&&(0,m.jsx)(`button`,{className:`search-clear`,onClick:()=>r(``),children:`×`})]}),t?(0,m.jsx)(C,{rows:8}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(`div`,{className:`usr-table-wrap`,children:(0,m.jsxs)(`table`,{className:`usr-table`,children:[(0,m.jsx)(`thead`,{children:(0,m.jsxs)(`tr`,{children:[(0,m.jsx)(`th`,{className:`usr-th`,children:`Name`}),(0,m.jsx)(`th`,{className:`usr-th`,children:`Email`}),(0,m.jsx)(`th`,{className:`usr-th hide-mobile`,children:`City`}),(0,m.jsx)(`th`,{className:`usr-th hide-mobile`,children:`Country`}),(0,m.jsx)(`th`,{className:`usr-th right`,children:`AIDLA Coins`}),(0,m.jsx)(`th`,{className:`usr-th hide-mobile`,children:`Joined`})]})}),(0,m.jsx)(`tbody`,{children:i.length===0?(0,m.jsx)(`tr`,{children:(0,m.jsx)(`td`,{colSpan:6,children:(0,m.jsxs)(`div`,{className:`usr-empty`,children:[(0,m.jsx)(`span`,{className:`usr-empty-icon`,children:`🔍`}),`No users match your search.`]})})}):i.map((e,t)=>{var n;let r=v(e.full_name),i=((n=e.full_name)==null||(n=n[0])==null?void 0:n.toUpperCase())||`?`;return(0,m.jsxs)(f.tr,{className:`usr-tr`,initial:{opacity:0,y:6},animate:{opacity:1,y:0},transition:{delay:Math.min(t*.03,.3)},children:[(0,m.jsx)(`td`,{className:`usr-td`,children:(0,m.jsxs)(`div`,{className:`user-cell`,children:[(0,m.jsx)(`div`,{className:`user-avatar`,style:{background:r},children:i}),(0,m.jsx)(`span`,{className:`user-name`,children:e.full_name||`—`})]})}),(0,m.jsx)(`td`,{className:`usr-td muted`,style:{fontSize:`0.8rem`},children:e.email}),(0,m.jsx)(`td`,{className:`usr-td muted hide-mobile`,children:e.city||`—`}),(0,m.jsx)(`td`,{className:`usr-td hide-mobile`,children:e.country?(0,m.jsx)(`span`,{className:`badge badge-blue`,children:e.country}):`—`}),(0,m.jsx)(`td`,{className:`usr-td right`,children:Number(e.total_aidla_coins)>0?(0,m.jsxs)(`span`,{className:`badge badge-gold`,children:[`🪙 `,g(e.total_aidla_coins)]}):(0,m.jsx)(`span`,{style:{color:`var(--slate)`},children:`0`})}),(0,m.jsx)(`td`,{className:`usr-td muted hide-mobile`,style:{fontSize:`0.78rem`},children:_(e.created_at)})]},e.user_id)})})]})}),(0,m.jsxs)(`div`,{className:`table-footer`,children:[`Showing `,i.length,` of `,e.length,` users`]})]})]})}var E=[{id:`dashboard`,label:`📊 Dashboard`},{id:`list`,label:`👥 All Users`}];function D(){let[e,t]=(0,p.useState)([]),[n,r]=(0,p.useState)(!0),[i,a]=(0,p.useState)(``),[o,s]=(0,p.useState)(`dashboard`);return(0,p.useEffect)(()=>{l.from(`users_profiles`).select(`user_id,full_name,email,city,country,total_aidla_coins,created_at`).order(`created_at`,{ascending:!1}).then(({data:e,error:n})=>{n?a(n.message):t(e||[]),r(!1)})},[]),(0,m.jsxs)(`div`,{className:`usr-root`,children:[(0,m.jsx)(`style`,{children:h}),(0,m.jsxs)(`div`,{className:`bg-orbs`,children:[(0,m.jsx)(`div`,{className:`bg-orb-1`}),(0,m.jsx)(`div`,{className:`bg-orb-2`}),(0,m.jsx)(`div`,{className:`bg-orb-3`})]}),(0,m.jsxs)(`div`,{className:`usr-container`,children:[(0,m.jsxs)(f.div,{initial:{opacity:0,y:15},animate:{opacity:1,y:0},transition:{duration:.5},children:[(0,m.jsx)(`span`,{className:`sec-label`,children:`Admin`}),(0,m.jsxs)(`h2`,{className:`sec-title`,children:[`User `,(0,m.jsx)(`span`,{children:`Management`})]}),(0,m.jsx)(`p`,{className:`sec-desc`,children:`Overview and management of all registered AIDLA platform members.`})]}),(0,m.jsx)(f.div,{className:`usr-tabs`,initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{delay:.15},children:E.map(e=>(0,m.jsx)(`button`,{className:`usr-tab ${o===e.id?`active`:``}`,onClick:()=>s(e.id),children:e.label},e.id))}),i&&(0,m.jsxs)(`div`,{className:`usr-error`,children:[`⚠️ `,i]}),(0,m.jsx)(u,{mode:`wait`,children:(0,m.jsxs)(f.div,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.22},children:[o===`dashboard`&&(n?(0,m.jsxs)(`div`,{className:`usr-empty`,children:[(0,m.jsx)(`span`,{className:`usr-empty-icon`,children:`⏳`}),`Loading dashboard…`]}):(0,m.jsx)(w,{users:e})),o===`list`&&(0,m.jsx)(T,{users:e,loading:n})]},o)})]})]})}export{D as default};