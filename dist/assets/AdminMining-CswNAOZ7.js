import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{a as t,l as n,o as r}from"./vendor-helmet-D-cMCI9i.js";import{tr as i}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as a}from"./supabase-CXCPPx9q.js";import{r as o}from"./vendor-motion-DyarDpDD.js";var s=e(n(),1),c=o();r();function l(e){return Number(e||0).toFixed(2)}var u=[{label:`6 hours`,value:6},{label:`12 hours`,value:12},{label:`18 hours`,value:18},{label:`24 hours`,value:24},{label:`Custom`,value:`custom`}];function d(){let[e,n]=(0,s.useState)(!0),[r,o]=(0,s.useState)(!1),[d,m]=(0,s.useState)({text:``,type:``}),[h,g]=(0,s.useState)(!0),[_,v]=(0,s.useState)(10),[y,b]=(0,s.useState)(12),[x,S]=(0,s.useState)(12),[C,w]=(0,s.useState)(0),[T,E]=(0,s.useState)(0),[D,O]=(0,s.useState)([]),[k,A]=(0,s.useState)({name:``,icon:`⚡`,multiplier:1.5,duration_hours:24,price_coins:50,description:``}),[j,M]=(0,s.useState)(!1),[N,P]=(0,s.useState)(null),[F,I]=(0,s.useState)(null),[L,R]=(0,s.useState)({activeToday:0,claimedToday:0,coinsToday:0}),z=(e,t=`ok`,n=4e3)=>{m({text:e,type:t}),setTimeout(()=>m({text:``,type:``}),n)},B=(0,s.useCallback)(i(function*(){var e,t;let[r,i,o,s]=yield Promise.all([a.from(`mining_settings`).select(`*`).eq(`id`,1).single(),a.from(`mining_boosters`).select(`*`).order(`price_coins`),a.from(`mining_sessions`).select(`id,status,actual_coins,created_at`).gte(`created_at`,new Date(Date.now()-864e5).toISOString()),a.from(`admin_pool`).select(`total_aidla_coins`).eq(`id`,1).single()]);if(r.data){var c,l,d,f;let e=r.data;g((c=e.enabled)==null?!0:c),v((l=e.base_rate_per_hour)==null?10:l);let t=(d=e.session_duration_hours)==null?12:d;b(t),S(u.some(e=>e.value===t)?t:`custom`),w((f=e.cooldown_hours)==null?0:f)}E((e=(t=s.data)==null?void 0:t.total_aidla_coins)==null?0:e),O(i.data||[]);let p=o.data||[];R({activeToday:p.filter(e=>e.status===`active`).length,claimedToday:p.filter(e=>e.status===`claimed`).length,coinsToday:p.filter(e=>e.status===`claimed`).reduce((e,t)=>e+Number(t.actual_coins||0),0)}),n(!1)}),[]);(0,s.useEffect)(()=>{n(!0),B()},[B]);let V=function(){var e=i(function*(){o(!0);let{error:e}=yield a.from(`mining_settings`).update({enabled:h,base_rate_per_hour:Number(_),session_duration_hours:Number(y),cooldown_hours:Number(C),updated_at:new Date().toISOString()}).eq(`id`,1);if(o(!1),e){z(`Save failed: ${e.message}`,`err`);return}z(`Settings saved ✅`,`ok`)});return function(){return e.apply(this,arguments)}}(),H=function(){var e=i(function*(){let e=F||k;if(!e.name.trim()){z(`Booster name required.`,`err`);return}M(!0);let t={name:e.name.trim(),icon:e.icon||`⚡`,multiplier:Number(e.multiplier),duration_hours:e.duration_hours?Number(e.duration_hours):null,price_coins:Number(e.price_coins),description:e.description||``,enabled:!0},n;if(F!=null&&F.id?{error:n}=yield a.from(`mining_boosters`).update(t).eq(`id`,F.id):{error:n}=yield a.from(`mining_boosters`).insert([t]),M(!1),n){z(`Failed: ${n.message}`,`err`);return}z(F?`Booster updated ✅`:`Booster added ✅`,`ok`),I(null),A({name:``,icon:`⚡`,multiplier:1.5,duration_hours:24,price_coins:50,description:``}),yield B()});return function(){return e.apply(this,arguments)}}(),U=function(){var e=i(function*(e,t){yield a.from(`mining_boosters`).update({enabled:!t}).eq(`id`,e),yield B()});return function(t,n){return e.apply(this,arguments)}}(),W=function(){var e=i(function*(e){P(e),yield a.from(`mining_boosters`).delete().eq(`id`,e),P(null),yield B()});return function(t){return e.apply(this,arguments)}}(),G=F||k,K=F?I:A;return(0,c.jsxs)(`div`,{className:`adm-page`,children:[(0,c.jsx)(`style`,{children:p}),(0,c.jsxs)(`div`,{className:`adm-header`,children:[(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`h2`,{className:`adm-title`,children:`⛏️ Mining Management`}),(0,c.jsx)(`p`,{className:`adm-sub`,children:`Configure mining sessions, pool, and boosters.`})]}),(0,c.jsxs)(`div`,{className:`adm-header-right`,children:[d.text&&(0,c.jsx)(`span`,{className:`adm-msg ${d.type===`err`?`adm-msg-err`:`adm-msg-ok`}`,children:d.text}),(0,c.jsx)(`button`,{onClick:V,disabled:r||e,className:`adm-btn-primary`,children:r?`Saving…`:`Save Settings`})]})]}),e?(0,c.jsx)(`div`,{className:`adm-loader`,children:`Loading configuration…`}):(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)(`div`,{className:`adm-stats-row`,children:[(0,c.jsx)(f,{icon:`⛏️`,label:`Active Sessions (24h)`,value:L.activeToday,color:`#0ea5e9`}),(0,c.jsx)(f,{icon:`✅`,label:`Claimed (24h)`,value:L.claimedToday,color:`#22c55e`}),(0,c.jsx)(f,{icon:`💰`,label:`Coins Distributed (24h)`,value:l(L.coinsToday),color:`#f59e0b`}),(0,c.jsx)(f,{icon:T<=100?`⚠️`:`🏦`,label:`Pool Balance`,value:l(T),color:T<=100?`#ef4444`:`#6366f1`,warn:T<=100})]}),(0,c.jsxs)(`div`,{className:`adm-grid`,children:[(0,c.jsxs)(`div`,{className:`adm-col`,children:[(0,c.jsxs)(`div`,{className:`adm-card`,children:[(0,c.jsx)(`h3`,{className:`adm-card-title`,children:`⚙️ General Settings`}),(0,c.jsxs)(`div`,{className:`adm-form-grid`,children:[(0,c.jsxs)(`div`,{className:`adm-form-group adm-span-2`,children:[(0,c.jsx)(`label`,{children:`Mining Status`}),(0,c.jsxs)(`div`,{className:`adm-toggle-row`,children:[(0,c.jsx)(`button`,{onClick:()=>g(!0),className:`adm-toggle-btn ${h?`adm-toggle-on`:``}`,children:`✅ Enabled`}),(0,c.jsx)(`button`,{onClick:()=>g(!1),className:`adm-toggle-btn ${h?``:`adm-toggle-off`}`,children:`🚫 Disabled`})]})]}),(0,c.jsxs)(`div`,{className:`adm-form-group`,children:[(0,c.jsx)(`label`,{children:`Base Rate (coins/hour)`}),(0,c.jsx)(`input`,{type:`number`,min:0,step:.1,value:_,onChange:e=>v(e.target.value),className:`adm-input`})]}),(0,c.jsxs)(`div`,{className:`adm-form-group`,children:[(0,c.jsx)(`label`,{children:`Cooldown Between Sessions (hours)`}),(0,c.jsx)(`input`,{type:`number`,min:0,value:C,onChange:e=>w(e.target.value),className:`adm-input`}),(0,c.jsx)(`span`,{className:`adm-hint`,children:`0 = no cooldown`})]}),(0,c.jsxs)(`div`,{className:`adm-form-group adm-span-2`,children:[(0,c.jsx)(`label`,{children:`Session Duration`}),(0,c.jsx)(`div`,{className:`adm-preset-row`,children:u.map(e=>(0,c.jsx)(`button`,{onClick:()=>{S(e.value),e.value!==`custom`&&b(e.value)},className:`adm-preset-btn ${x===e.value?`adm-preset-active`:``}`,children:e.label},e.value))}),x===`custom`&&(0,c.jsx)(`input`,{type:`number`,min:1,value:y,onChange:e=>b(e.target.value),className:`adm-input`,style:{marginTop:8},placeholder:`Custom hours…`})]})]}),(0,c.jsxs)(`div`,{className:`adm-projection`,children:[(0,c.jsxs)(`div`,{className:`adm-proj-item`,children:[(0,c.jsx)(`span`,{children:`Est. per session`}),(0,c.jsxs)(`strong`,{children:[l(Number(_)*Number(y)),` coins`]})]}),(0,c.jsxs)(`div`,{className:`adm-proj-item`,children:[(0,c.jsx)(`span`,{children:`Est. per day (1 session)`}),(0,c.jsxs)(`strong`,{children:[l(Number(_)*24),` coins`]})]}),(0,c.jsxs)(`div`,{className:`adm-proj-item`,children:[(0,c.jsx)(`span`,{children:`Pool covers ~`}),(0,c.jsxs)(`strong`,{children:[l(Number(_)*Number(y))>0?Math.floor(Number(T)/(Number(_)*Number(y))):`∞`,` sessions`]})]})]})]}),(0,c.jsxs)(`div`,{className:`adm-card`,children:[(0,c.jsx)(`h3`,{className:`adm-card-title`,children:`🏦 Coin Pool Status`}),(0,c.jsxs)(`p`,{className:`adm-help`,children:[`Pool is shared across all features. Manage it from the `,(0,c.jsx)(`strong`,{children:`Admin Pool`}),` page. Mining claims deduct from this pool. Booster purchases add back to it.`]}),(0,c.jsxs)(`div`,{className:`adm-pool-display`,style:{borderColor:T<=100?`#fca5a5`:`#bae6fd`},children:[(0,c.jsx)(`div`,{className:`adm-pool-label`,children:`Current Pool Balance`}),(0,c.jsxs)(`div`,{className:`adm-pool-value`,style:{color:T<=100?`#dc2626`:`#0369a1`},children:[Number(T).toLocaleString(),(0,c.jsx)(`span`,{className:`adm-pool-unit`,children:`coins`})]}),T<=100&&(0,c.jsx)(`div`,{className:`adm-pool-warn`,children:`⚠️ Pool critically low — go to Admin Pool to refill!`})]}),(0,c.jsx)(`a`,{href:`/admin/pool`,className:`adm-pool-link`,children:`→ Go to Admin Pool & Logistics to refill`})]})]}),(0,c.jsxs)(`div`,{className:`adm-col`,children:[(0,c.jsxs)(`div`,{className:`adm-card`,children:[(0,c.jsx)(`h3`,{className:`adm-card-title`,children:F?`✏️ Edit Booster`:`➕ Add Booster`}),(0,c.jsxs)(`div`,{className:`adm-form-grid`,children:[(0,c.jsxs)(`div`,{className:`adm-form-group`,children:[(0,c.jsx)(`label`,{children:`Icon (emoji)`}),(0,c.jsx)(`input`,{value:G.icon,onChange:e=>K(n=>t(t({},n),{},{icon:e.target.value})),className:`adm-input adm-icon-input`,maxLength:4})]}),(0,c.jsxs)(`div`,{className:`adm-form-group`,children:[(0,c.jsx)(`label`,{children:`Name`}),(0,c.jsx)(`input`,{value:G.name,onChange:e=>K(n=>t(t({},n),{},{name:e.target.value})),className:`adm-input`,placeholder:`e.g. Speed Boost`})]}),(0,c.jsxs)(`div`,{className:`adm-form-group`,children:[(0,c.jsx)(`label`,{children:`Multiplier (e.g. 1.5 = +50%)`}),(0,c.jsx)(`input`,{type:`number`,min:1,step:.1,value:G.multiplier,onChange:e=>K(n=>t(t({},n),{},{multiplier:e.target.value})),className:`adm-input`})]}),(0,c.jsxs)(`div`,{className:`adm-form-group`,children:[(0,c.jsx)(`label`,{children:`Price (coins)`}),(0,c.jsx)(`input`,{type:`number`,min:0,value:G.price_coins,onChange:e=>K(n=>t(t({},n),{},{price_coins:e.target.value})),className:`adm-input`})]}),(0,c.jsxs)(`div`,{className:`adm-form-group`,children:[(0,c.jsx)(`label`,{children:`Duration (hours, blank = permanent)`}),(0,c.jsx)(`input`,{type:`number`,min:1,value:G.duration_hours||``,onChange:e=>K(n=>t(t({},n),{},{duration_hours:e.target.value})),className:`adm-input`,placeholder:`Leave blank for permanent`})]}),(0,c.jsxs)(`div`,{className:`adm-form-group adm-span-2`,children:[(0,c.jsx)(`label`,{children:`Description (optional)`}),(0,c.jsx)(`input`,{value:G.description,onChange:e=>K(n=>t(t({},n),{},{description:e.target.value})),className:`adm-input`,placeholder:`e.g. Doubles your mining speed for 24 hours`})]})]}),(0,c.jsxs)(`div`,{className:`adm-booster-form-actions`,children:[(0,c.jsx)(`button`,{onClick:H,disabled:j,className:`adm-btn-primary`,children:j?`Saving…`:F?`Update Booster`:`Add Booster`}),F&&(0,c.jsx)(`button`,{onClick:()=>I(null),className:`adm-btn-ghost`,children:`Cancel`})]})]}),(0,c.jsxs)(`div`,{className:`adm-card`,children:[(0,c.jsxs)(`h3`,{className:`adm-card-title`,children:[`⚡ Boosters Catalog (`,D.length,`)`]}),D.length===0?(0,c.jsx)(`div`,{className:`adm-empty`,children:`No boosters yet. Add one above.`}):(0,c.jsx)(`div`,{className:`adm-boosters-list`,children:D.map(e=>(0,c.jsxs)(`div`,{className:`adm-booster-row ${e.enabled?``:`adm-booster-disabled`}`,children:[(0,c.jsx)(`div`,{className:`adm-booster-icon`,children:e.icon||`⚡`}),(0,c.jsxs)(`div`,{className:`adm-booster-info`,children:[(0,c.jsx)(`div`,{className:`adm-booster-name`,children:e.name}),(0,c.jsxs)(`div`,{className:`adm-booster-meta`,children:[(0,c.jsxs)(`span`,{children:[e.multiplier,`× rate`]}),(0,c.jsx)(`span`,{children:`·`}),(0,c.jsx)(`span`,{children:e.duration_hours?`${e.duration_hours}h`:`Permanent`}),(0,c.jsx)(`span`,{children:`·`}),(0,c.jsxs)(`span`,{className:`adm-booster-price`,children:[`💰 `,e.price_coins]})]}),e.description&&(0,c.jsx)(`div`,{className:`adm-booster-desc`,children:e.description})]}),(0,c.jsxs)(`div`,{className:`adm-booster-actions`,children:[(0,c.jsx)(`button`,{onClick:()=>U(e.id,e.enabled),className:`adm-toggle-sm ${e.enabled?`adm-toggle-sm-on`:`adm-toggle-sm-off`}`,title:e.enabled?`Disable`:`Enable`,children:e.enabled?`ON`:`OFF`}),(0,c.jsx)(`button`,{onClick:()=>I(t({},e)),className:`adm-icon-btn`,title:`Edit`,children:`✏️`}),(0,c.jsx)(`button`,{onClick:()=>W(e.id),disabled:N===e.id,className:`adm-icon-btn adm-icon-del`,title:`Delete`,children:N===e.id?`…`:`🗑️`})]})]},e.id))})]})]})]})]})]})}function f({icon:e,label:t,value:n,color:r,warn:i}){return(0,c.jsxs)(`div`,{className:`adm-stat-card ${i?`adm-stat-warn`:``}`,style:{borderTopColor:r},children:[(0,c.jsx)(`div`,{className:`adm-stat-icon`,children:e}),(0,c.jsx)(`div`,{className:`adm-stat-val`,style:{color:r},children:n}),(0,c.jsx)(`div`,{className:`adm-stat-label`,children:t})]})}var p=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

.adm-page *{box-sizing:border-box;}
.adm-page{
  font-family:'DM Sans',system-ui,sans-serif;
  color:#0f172a;
  max-width:1100px;
  margin:0 auto;
  padding:16px;
  display:flex;flex-direction:column;gap:16px;
  animation:admIn 0.4s ease;
}
@keyframes admIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}

/* ── Header ── */
.adm-header{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;}
.adm-title{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;margin:0 0 3px;color:#0f172a;}
.adm-sub{margin:0;color:#64748b;font-size:0.88rem;}
.adm-header-right{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.adm-msg{padding:6px 12px;border-radius:8px;font-size:0.82rem;font-weight:700;}
.adm-msg-ok{background:#dcfce7;color:#15803d;}
.adm-msg-err{background:#fee2e2;color:#b91c1c;}
.adm-loader{padding:40px;text-align:center;color:#64748b;font-weight:600;}

/* ── Buttons ── */
.adm-btn-primary{padding:9px 18px;border-radius:9px;border:none;background:#1e3a8a;color:#fff;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all 0.15s;box-shadow:0 3px 0 #0f172a;}
.adm-btn-primary:hover:not(:disabled){background:#2563eb;transform:translateY(-1px);}
.adm-btn-primary:active:not(:disabled){transform:translateY(2px);box-shadow:none;}
.adm-btn-primary:disabled{background:#94a3b8;box-shadow:0 3px 0 #64748b;cursor:not-allowed;}
.adm-btn-ghost{padding:9px 16px;border-radius:9px;border:1.5px solid #e2e8f0;background:transparent;color:#64748b;font-weight:600;font-size:0.88rem;cursor:pointer;transition:all 0.15s;}
.adm-btn-ghost:hover{background:#f8fafc;color:#334155;}

/* ── Stats row ── */
.adm-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
@media(max-width:700px){.adm-stats-row{grid-template-columns:repeat(2,1fr);}}
.adm-stat-card{background:#fff;border:1px solid #e2e8f0;border-top:3px solid;border-radius:14px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,0.04);transition:transform 0.2s;}
.adm-stat-card:hover{transform:translateY(-2px);}
.adm-stat-warn{animation:admWarn 1.5s ease-in-out infinite;}
@keyframes admWarn{0%,100%{box-shadow:none;}50%{box-shadow:0 0 0 3px rgba(239,68,68,0.15);}}
.adm-stat-icon{font-size:1.3rem;margin-bottom:6px;}
.adm-stat-val{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;line-height:1;margin-bottom:4px;}
.adm-stat-label{font-size:0.72rem;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;}

/* ── Grid ── */
.adm-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start;}
@media(max-width:800px){.adm-grid{grid-template-columns:1fr;}}
.adm-col{display:flex;flex-direction:column;gap:16px;}

/* ── Card ── */
.adm-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 1px 4px rgba(0,0,0,0.04);}
.adm-card-title{font-family:'Syne',sans-serif;font-size:0.95rem;font-weight:700;margin:0 0 14px;color:#334155;padding-bottom:10px;border-bottom:1px solid #f1f5f9;}
.adm-help{font-size:0.78rem;color:#94a3b8;margin:-8px 0 14px;line-height:1.5;}

/* ── Forms ── */
.adm-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.adm-form-group{display:flex;flex-direction:column;gap:5px;}
.adm-form-group label{font-size:0.72rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;}
.adm-span-2{grid-column:1/-1;}
.adm-input{padding:9px 11px;border-radius:8px;border:1px solid #e2e8f0;background:#f8fafc;font-family:inherit;font-size:0.88rem;color:#0f172a;transition:all 0.15s;outline:none;}
.adm-input:focus{border-color:#0ea5e9;background:#fff;box-shadow:0 0 0 3px rgba(14,165,233,0.1);}
.adm-icon-input{font-size:1.2rem;text-align:center;max-width:80px;}
.adm-hint{font-size:0.7rem;color:#94a3b8;}

/* ── Toggle ── */
.adm-toggle-row{display:flex;gap:8px;}
.adm-toggle-btn{flex:1;padding:9px;border-radius:9px;border:1.5px solid #e2e8f0;background:#f8fafc;font-weight:600;font-size:0.85rem;cursor:pointer;transition:all 0.15s;color:#64748b;}
.adm-toggle-on{background:#dcfce7;border-color:#4ade80;color:#15803d;}
.adm-toggle-off{background:#fee2e2;border-color:#fca5a5;color:#dc2626;}

/* ── Duration presets ── */
.adm-preset-row{display:flex;flex-wrap:wrap;gap:6px;}
.adm-preset-btn{padding:7px 14px;border-radius:8px;border:1.5px solid #e2e8f0;background:#f8fafc;font-size:0.82rem;font-weight:600;color:#64748b;cursor:pointer;transition:all 0.15s;}
.adm-preset-btn:hover{border-color:#0ea5e9;color:#0369a1;}
.adm-preset-active{background:#e0f2fe;border-color:#0ea5e9;color:#0369a1;}

/* ── Projection ── */
.adm-projection{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid #f1f5f9;}
.adm-proj-item{background:#f8fafc;border-radius:10px;padding:10px;text-align:center;border:1px solid #f1f5f9;}
.adm-proj-item span{display:block;font-size:0.65rem;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:3px;}
.adm-proj-item strong{font-size:0.9rem;font-weight:800;color:#0f172a;}

/* ── Pool ── */
.adm-pool-display{border:1.5px solid;border-radius:14px;padding:16px;text-align:center;margin-bottom:14px;background:#f8fafc;}
.adm-pool-label{font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:6px;}
.adm-pool-value{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;}
.adm-pool-unit{font-size:0.9rem;font-weight:600;margin-left:6px;opacity:0.7;}
.adm-pool-warn{font-size:0.78rem;font-weight:700;color:#dc2626;margin-top:6px;}
.adm-refill-row{display:flex;gap:10px;}
.adm-refill-row .adm-input{flex:1;}

/* ── Booster form actions ── */
.adm-booster-form-actions{display:flex;gap:8px;margin-top:14px;}

/* ── Boosters list ── */
.adm-boosters-list{display:flex;flex-direction:column;gap:8px;}
.adm-booster-row{display:flex;align-items:flex-start;gap:12px;padding:12px;background:#f8fafc;border:1px solid #f1f5f9;border-radius:12px;transition:all 0.15s;}
.adm-booster-row:hover{border-color:#e2e8f0;box-shadow:0 2px 8px rgba(15,23,42,0.04);}
.adm-booster-disabled{opacity:0.55;}
.adm-booster-icon{font-size:1.5rem;flex-shrink:0;margin-top:1px;}
.adm-booster-info{flex:1;min-width:0;}
.adm-booster-name{font-weight:700;font-size:0.92rem;color:#0f172a;margin-bottom:3px;}
.adm-booster-meta{display:flex;gap:6px;font-size:0.75rem;color:#64748b;flex-wrap:wrap;margin-bottom:2px;}
.adm-booster-price{color:#b45309;font-weight:600;}
.adm-booster-desc{font-size:0.72rem;color:#94a3b8;margin-top:2px;}
.adm-booster-actions{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.adm-toggle-sm{padding:4px 10px;border-radius:6px;border:none;font-size:0.72rem;font-weight:800;cursor:pointer;letter-spacing:0.5px;}
.adm-toggle-sm-on{background:#dcfce7;color:#15803d;}
.adm-toggle-sm-off{background:#f1f5f9;color:#94a3b8;}
.adm-icon-btn{padding:5px 7px;border-radius:7px;border:1px solid #f1f5f9;background:#fff;font-size:0.9rem;cursor:pointer;transition:all 0.15s;}
.adm-icon-btn:hover{background:#f8fafc;border-color:#e2e8f0;}
.adm-icon-del:hover{background:#fee2e2;border-color:#fca5a5;}

/* ── Empty ── */
.adm-empty{text-align:center;padding:20px;color:#94a3b8;font-size:0.85rem;background:#f8fafc;border-radius:10px;}

.adm-pool-link{display:inline-block;margin-top:10px;color:#0369a1;font-size:0.82rem;font-weight:700;text-decoration:none;}
.adm-pool-link:hover{text-decoration:underline;}
/* ── Responsive ── */
@media(max-width:600px){
  .adm-page{padding:10px;}
  .adm-form-grid{grid-template-columns:1fr;}
  .adm-projection{grid-template-columns:1fr 1fr;}
  .adm-refill-row{flex-direction:column;}
  .adm-booster-form-actions{flex-direction:column;}
  .adm-header{flex-direction:column;align-items:flex-start;}
}
`;export{d as default};