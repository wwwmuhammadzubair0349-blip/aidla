import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{a as t,l as n,o as r}from"./vendor-helmet-D-cMCI9i.js";import{tr as i}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as a}from"./supabase-CXCPPx9q.js";import{r as o}from"./vendor-motion-DyarDpDD.js";var s=e(n(),1),c=o();r();var l=`zkafridi317@gmail.com`;function u(e){if(!e)return``;let t=Math.floor((Date.now()-new Date(e))/1e3);return t<60?`just now`:t<3600?`${Math.floor(t/60)}m ago`:t<86400?`${Math.floor(t/3600)}h ago`:new Date(e).toLocaleDateString(`en-GB`,{day:`numeric`,month:`short`,year:`numeric`})}function d({profile:e,size:t=34}){var n;let r=(e==null||(n=e.full_name)==null?void 0:n.split(` `).map(e=>e[0]).join(``).slice(0,2).toUpperCase())||`?`;return e!=null&&e.avatar_url?(0,c.jsx)(`img`,{src:e.avatar_url,alt:e.full_name,style:{width:t,height:t,borderRadius:`50%`,objectFit:`cover`,flexShrink:0}}):(0,c.jsx)(`div`,{style:{width:t,height:t,borderRadius:`50%`,flexShrink:0,background:`linear-gradient(135deg,#1e3a8a,#3b82f6)`,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`#fff`,fontWeight:800,fontSize:t*.35},children:r})}function f(){return(0,c.jsx)(`span`,{style:{display:`inline-flex`,alignItems:`center`,justifyContent:`center`,width:15,height:15,borderRadius:`50%`,background:`#1d9bf0`,marginLeft:4,flexShrink:0},children:(0,c.jsx)(`svg`,{width:`8`,height:`8`,viewBox:`0 0 24 24`,fill:`white`,children:(0,c.jsx)(`path`,{d:`M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z`})})})}function p({label:e,count:t,active:n,onClick:r}){return(0,c.jsxs)(`button`,{className:`fa-tab ${n?`fa-tab-active`:``}`,onClick:r,children:[e,t>0&&(0,c.jsx)(`span`,{className:`fa-tab-badge`,children:t})]})}function m({post:e,onDelete:t,onPin:n,onUnpin:r,onExpand:i,expanded:a,comments:o,onDeleteComment:s,loadComments:p}){var m,h;let g=((m=e.profiles)==null?void 0:m.email)===l,_=g?`AIDLA_Official`:((h=e.profiles)==null?void 0:h.full_name)||`Unknown`;return(0,c.jsxs)(`div`,{className:`fa-row ${e.is_pinned?`fa-row-pinned`:``}`,children:[(0,c.jsxs)(`div`,{className:`fa-row-header`,children:[(0,c.jsx)(d,{profile:e.profiles,size:36}),(0,c.jsxs)(`div`,{className:`fa-row-meta`,children:[(0,c.jsxs)(`div`,{className:`fa-row-name`,children:[_,g&&(0,c.jsx)(f,{}),e.is_pinned&&(0,c.jsx)(`span`,{className:`fa-pinned-label`,children:`📌 Pinned`})]}),(0,c.jsxs)(`div`,{className:`fa-row-time`,children:[u(e.created_at),` · `,e.like_count,` likes · `,e.comment_count,` comments · `,e.repost_count,` reposts`]})]}),(0,c.jsxs)(`div`,{className:`fa-row-actions`,children:[e.is_pinned?(0,c.jsx)(`button`,{className:`fa-btn fa-btn-warn`,onClick:()=>r(e.id),children:`📌 Unpin`}):(0,c.jsx)(`button`,{className:`fa-btn fa-btn-blue`,onClick:()=>n(e.id),children:`📌 Pin`}),(0,c.jsx)(`button`,{className:`fa-btn fa-btn-ghost`,onClick:()=>{i(e.id),a||p(e.id)},children:a?`▲ Hide`:`▼ Comments`}),(0,c.jsx)(`button`,{className:`fa-btn fa-btn-red`,onClick:()=>t(e.id),children:`🗑 Delete`})]})]}),(0,c.jsx)(`div`,{className:`fa-post-content`,children:e.content}),e.location&&(0,c.jsxs)(`div`,{className:`fa-post-tag`,children:[`📍 `,e.location]}),e.feeling&&(0,c.jsx)(`div`,{className:`fa-post-tag`,children:e.feeling}),a&&(0,c.jsxs)(`div`,{className:`fa-comments-list`,children:[(0,c.jsxs)(`div`,{className:`fa-comments-title`,children:[`Comments (`,o.length,`)`]}),o.length===0?(0,c.jsx)(`div`,{className:`fa-no-comments`,children:`No comments yet.`}):o.map(t=>{var n;return(0,c.jsxs)(`div`,{className:`fa-comment-row`,children:[(0,c.jsx)(d,{profile:t.profiles,size:28}),(0,c.jsxs)(`div`,{className:`fa-comment-body`,children:[(0,c.jsx)(`span`,{className:`fa-comment-name`,children:((n=t.profiles)==null?void 0:n.full_name)||`User`}),(0,c.jsx)(`span`,{className:`fa-comment-time`,children:u(t.created_at)}),(0,c.jsx)(`p`,{className:`fa-comment-text`,children:t.content})]}),(0,c.jsx)(`button`,{className:`fa-btn fa-btn-red fa-btn-sm`,onClick:()=>s(t.id,e.id),children:`🗑`})]},t.id)})]})]})}function h({report:e,onMarkReviewed:t,onDeleteTarget:n}){var r;return(0,c.jsxs)(`div`,{className:`fa-row ${e.is_reviewed?`fa-row-reviewed`:``}`,children:[(0,c.jsxs)(`div`,{className:`fa-row-header`,children:[(0,c.jsx)(`div`,{className:`fa-report-type`,children:e.post_id?`📝 Post Report`:`💬 Comment Report`}),(0,c.jsxs)(`div`,{className:`fa-row-meta`,children:[(0,c.jsxs)(`div`,{className:`fa-row-name`,children:[`Reported by: `,((r=e.reporter)==null?void 0:r.full_name)||`User`]}),(0,c.jsx)(`div`,{className:`fa-row-time`,children:u(e.created_at)})]}),e.is_reviewed&&(0,c.jsx)(`span`,{className:`fa-reviewed-badge`,children:`✓ Reviewed`})]}),(0,c.jsxs)(`div`,{className:`fa-report-reason`,children:[(0,c.jsx)(`strong`,{children:`Reason:`}),` `,e.reason]}),e.post_content&&(0,c.jsxs)(`div`,{className:`fa-report-content`,children:[(0,c.jsx)(`strong`,{children:`Post:`}),` "`,e.post_content,`"`]}),e.comment_content&&(0,c.jsxs)(`div`,{className:`fa-report-content`,children:[(0,c.jsx)(`strong`,{children:`Comment:`}),` "`,e.comment_content,`"`]}),!e.is_reviewed&&(0,c.jsxs)(`div`,{className:`fa-report-actions`,children:[(0,c.jsxs)(`button`,{className:`fa-btn fa-btn-red`,onClick:()=>n(e),children:[`🗑 Delete `,e.post_id?`Post`:`Comment`]}),(0,c.jsx)(`button`,{className:`fa-btn fa-btn-ghost`,onClick:()=>t(e.id),children:`✓ Mark Reviewed`})]})]})}function g(){let[e,n]=(0,s.useState)(null),[r,o]=(0,s.useState)(null),[u,d]=(0,s.useState)(`posts`),[g,v]=(0,s.useState)([]),[y,b]=(0,s.useState)([]),[x,S]=(0,s.useState)(!1),[C,w]=(0,s.useState)(null),[T,E]=(0,s.useState)({}),[D,O]=(0,s.useState)(!1),[k,A]=(0,s.useState)(null),j=(e,t=`ok`)=>{A({msg:e,type:t}),setTimeout(()=>A(null),3e3)};(0,s.useEffect)(()=>{i(function*(){let{data:{user:e}}=yield a.auth.getUser();if(!e){o(!1);return}n(e.email),o(e.email===l)})()},[]);let M=(0,s.useCallback)(i(function*(){S(!0);let{data:e}=yield a.from(`feed_posts`).select(`*`).eq(`is_deleted`,!1).order(`is_pinned`,{ascending:!1}).order(`created_at`,{ascending:!1}).limit(100);if(e&&e.length>0){let n=[...new Set(e.map(e=>e.user_id))],{data:r}=yield a.from(`users_profiles`).select(`user_id,full_name,avatar_url,email`).in(`user_id`,n),i=Object.fromEntries((r||[]).map(e=>[e.user_id,e]));v(e.map(e=>t(t({},e),{},{profiles:i[e.user_id]||null})))}else v([]);S(!1)}),[]),N=(0,s.useCallback)(i(function*(){S(!0);let{data:e}=yield a.from(`feed_reports`).select(`*`).order(`created_at`,{ascending:!1}).limit(200);if(!e||e.length===0){b([]),S(!1);return}let n=[...new Set(e.map(e=>e.reporter_id))],r=e.map(e=>e.post_id).filter(Boolean),i=e.map(e=>e.comment_id).filter(Boolean),[{data:o},{data:s},{data:c}]=yield Promise.all([a.from(`users_profiles`).select(`user_id,full_name`).in(`user_id`,n),r.length?a.from(`feed_posts`).select(`id,content`).in(`id`,r):{data:[]},i.length?a.from(`feed_comments`).select(`id,content`).in(`id`,i):{data:[]}]),l=Object.fromEntries((o||[]).map(e=>[e.user_id,e])),u=Object.fromEntries((s||[]).map(e=>[e.id,e])),d=Object.fromEntries((c||[]).map(e=>[e.id,e]));b(e.map(e=>{var n,r;return t(t({},e),{},{reporter:l[e.reporter_id]||null,post_content:e.post_id&&((n=u[e.post_id])==null?void 0:n.content)||null,comment_content:e.comment_id&&((r=d[e.comment_id])==null?void 0:r.content)||null})})),S(!1)}),[]);(0,s.useEffect)(()=>{r&&(M(),N())},[r,M,N]);let P=function(){var e=i(function*(e){let{data:n}=yield a.from(`feed_comments`).select(`*`).eq(`post_id`,e).eq(`is_deleted`,!1).order(`created_at`,{ascending:!0});if(n&&n.length>0){let r=[...new Set(n.map(e=>e.user_id))],{data:i}=yield a.from(`users_profiles`).select(`user_id,full_name,avatar_url,email`).in(`user_id`,r),o=Object.fromEntries((i||[]).map(e=>[e.user_id,e]));E(r=>t(t({},r),{},{[e]:n.map(e=>t(t({},e),{},{profiles:o[e.user_id]||null}))}))}else E(n=>t(t({},n),{},{[e]:[]}))});return function(t){return e.apply(this,arguments)}}(),F=function(){var e=i(function*(e){if(!window.confirm(`Delete this post? This cannot be undone.`))return;let{error:t}=yield a.from(`feed_posts`).delete().eq(`id`,e);if(t){console.error(`[admin deletePost]`,t),j(`Delete failed: `+(t.message||t.code),`err`);return}v(t=>t.filter(t=>t.id!==e)),j(`Post deleted.`)});return function(t){return e.apply(this,arguments)}}(),I=function(){var e=i(function*(e){let{error:n}=yield a.from(`feed_posts`).update({is_pinned:!0}).eq(`id`,e);if(n){j(`Pin failed: `+(n.message||n.code),`err`);return}v(n=>n.map(n=>n.id===e?t(t({},n),{},{is_pinned:!0}):n)),j(`Post pinned ✓`)});return function(t){return e.apply(this,arguments)}}(),L=function(){var e=i(function*(e){let{error:n}=yield a.from(`feed_posts`).update({is_pinned:!1}).eq(`id`,e);if(n){j(`Unpin failed: `+(n.message||n.code),`err`);return}v(n=>n.map(n=>n.id===e?t(t({},n),{},{is_pinned:!1}):n)),j(`Post unpinned.`)});return function(t){return e.apply(this,arguments)}}(),R=function(){var e=i(function*(e,n){yield a.from(`feed_comments`).delete().eq(`id`,e),E(r=>t(t({},r),{},{[n]:(r[n]||[]).filter(t=>t.id!==e)})),j(`Comment deleted.`)});return function(t,n){return e.apply(this,arguments)}}(),z=function(){var e=i(function*(e){yield a.from(`feed_reports`).update({is_reviewed:!0}).eq(`id`,e),b(n=>n.map(n=>n.id===e?t(t({},n),{},{is_reviewed:!0}):n)),j(`Marked as reviewed.`)});return function(t){return e.apply(this,arguments)}}(),B=function(){var e=i(function*(e){window.confirm(`Delete this ${e.post_id?`post`:`comment`}?`)&&(e.post_id?(yield a.from(`feed_posts`).update({is_deleted:!0}).eq(`id`,e.post_id),v(t=>t.filter(t=>t.id!==e.post_id))):yield a.from(`feed_comments`).delete().eq(`id`,e.comment_id),yield a.from(`feed_reports`).update({is_reviewed:!0}).eq(`id`,e.id),b(n=>n.map(n=>n.id===e.id?t(t({},n),{},{is_reviewed:!0}):n)),j(`Content deleted and report closed.`))});return function(t){return e.apply(this,arguments)}}(),V=y.filter(e=>!e.is_reviewed).length,H=D?y:y.filter(e=>!e.is_reviewed);return r===null?(0,c.jsxs)(`div`,{className:`fa-root`,children:[(0,c.jsx)(`style`,{children:_}),(0,c.jsx)(`div`,{className:`fa-loading`,children:(0,c.jsx)(`div`,{className:`fa-spinner`})})]}):r?(0,c.jsxs)(`div`,{className:`fa-root`,children:[(0,c.jsx)(`style`,{children:_}),k&&(0,c.jsx)(`div`,{className:`fa-toast ${k.type===`err`?`fa-toast-err`:``}`,children:k.msg}),(0,c.jsxs)(`div`,{className:`fa-header`,children:[(0,c.jsxs)(`div`,{className:`fa-header-left`,children:[(0,c.jsx)(`div`,{className:`fa-header-icon`,children:`🛡️`}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`h1`,{className:`fa-title`,children:`Feed Admin Panel`}),(0,c.jsxs)(`div`,{className:`fa-subtitle`,children:[`AIDLA_Official `,(0,c.jsx)(f,{}),` · Logged in as `,e]})]})]}),(0,c.jsx)(`button`,{className:`fa-refresh-btn`,onClick:()=>{M(),N()},children:`↻ Refresh`})]}),(0,c.jsx)(`div`,{className:`fa-stats`,children:[{label:`Total Posts`,val:g.length,icon:`📝`},{label:`Pinned`,val:g.filter(e=>e.is_pinned).length,icon:`📌`},{label:`Pending Reports`,val:V,icon:`🚩`,warn:V>0},{label:`Total Reports`,val:y.length,icon:`📋`}].map(e=>(0,c.jsxs)(`div`,{className:`fa-stat-card ${e.warn?`fa-stat-warn`:``}`,children:[(0,c.jsx)(`div`,{className:`fa-stat-icon`,children:e.icon}),(0,c.jsx)(`div`,{className:`fa-stat-val`,children:e.val}),(0,c.jsx)(`div`,{className:`fa-stat-label`,children:e.label})]},e.label))}),(0,c.jsxs)(`div`,{className:`fa-tabs`,children:[(0,c.jsx)(p,{label:`All Posts`,count:g.length,active:u===`posts`,onClick:()=>d(`posts`)}),(0,c.jsx)(p,{label:`Reports`,count:V,active:u===`reports`,onClick:()=>d(`reports`)})]}),x&&(0,c.jsxs)(`div`,{className:`fa-loading`,children:[(0,c.jsx)(`div`,{className:`fa-spinner`}),(0,c.jsx)(`span`,{children:`Loading…`})]}),u===`posts`&&!x&&(0,c.jsx)(`div`,{className:`fa-list`,children:g.length===0?(0,c.jsx)(`div`,{className:`fa-empty`,children:`No posts found.`}):g.map(e=>(0,c.jsx)(m,{post:e,onDelete:F,onPin:I,onUnpin:L,onExpand:e=>w(t=>t===e?null:e),expanded:C===e.id,comments:T[e.id]||[],onDeleteComment:R,loadComments:P},e.id))}),u===`reports`&&!x&&(0,c.jsxs)(`div`,{className:`fa-list`,children:[(0,c.jsxs)(`div`,{className:`fa-reports-toolbar`,children:[(0,c.jsxs)(`span`,{className:`fa-reports-count`,children:[V,` pending · `,y.length,` total`]}),(0,c.jsxs)(`label`,{className:`fa-toggle`,children:[(0,c.jsx)(`input`,{type:`checkbox`,checked:D,onChange:e=>O(e.target.checked)}),`Show reviewed`]})]}),H.length===0?(0,c.jsx)(`div`,{className:`fa-empty`,children:`🎉 No pending reports!`}):H.map(e=>(0,c.jsx)(h,{report:e,onMarkReviewed:z,onDeleteTarget:B},e.id))]})]}):(0,c.jsxs)(`div`,{className:`fa-root`,children:[(0,c.jsx)(`style`,{children:_}),(0,c.jsxs)(`div`,{className:`fa-denied`,children:[(0,c.jsx)(`div`,{style:{fontSize:48},children:`🔒`}),(0,c.jsx)(`h2`,{children:`Access Denied`}),(0,c.jsx)(`p`,{children:`This page is for AIDLA admins only.`})]})]})}var _=`
  .fa-root {
    max-width: 860px; margin: 0 auto;
    font-family: 'Inter', system-ui, sans-serif;
    color: #0f172a; padding-bottom: 40px;
  }

  /* ── Toast ── */
  .fa-toast {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: #15803d; color: #fff; padding: 9px 22px; border-radius: 100px;
    font-size: 0.84rem; font-weight: 700; z-index: 9999; white-space: nowrap;
    box-shadow: 0 8px 24px rgba(21,128,61,0.3);
    animation: faToast 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .fa-toast-err { background: #dc2626; box-shadow: 0 8px 24px rgba(220,38,38,0.3); }
  @keyframes faToast { from{opacity:0;transform:translateX(-50%) translateY(-12px);} to{opacity:1;transform:translateX(-50%) translateY(0);} }

  /* ── Header ── */
  .fa-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; padding-bottom: 18px;
    border-bottom: 1px solid rgba(30,58,138,0.08);
  }
  .fa-header-left { display: flex; align-items: center; gap: 13px; }
  .fa-header-icon {
    width: 48px; height: 48px; border-radius: 15px; font-size: 24px;
    background: linear-gradient(135deg,#1e3a8a,#3b82f6);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 5px 16px rgba(59,130,246,0.3); flex-shrink: 0;
  }
  .fa-title {
    font-size: clamp(1.1rem,2.5vw,1.4rem); font-weight: 900;
    letter-spacing: -0.4px; margin: 0 0 2px;
    background: linear-gradient(135deg,#1e3a8a,#3b82f6);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .fa-subtitle {
    font-size: 0.78rem; color: #64748b; font-weight: 600;
    display: flex; align-items: center; gap: 3px; flex-wrap: wrap;
  }
  .fa-refresh-btn {
    padding: 8px 18px; border-radius: 100px;
    border: 1.5px solid rgba(30,58,138,0.15);
    background: rgba(30,58,138,0.05); color: #1e3a8a;
    font-size: 0.83rem; font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .fa-refresh-btn:hover { background: rgba(30,58,138,0.12); }

  /* ── Stats ── */
  .fa-stats {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 20px;
  }
  .fa-stat-card {
    background: rgba(255,255,255,0.9); border: 1px solid rgba(30,58,138,0.09);
    border-radius: 14px; padding: 14px 12px; text-align: center;
    box-shadow: 3px 3px 10px rgba(15,23,42,0.04), -3px -3px 8px rgba(255,255,255,0.9);
  }
  .fa-stat-warn {
    border-color: rgba(239,68,68,0.25);
    background: rgba(239,68,68,0.03);
  }
  .fa-stat-icon { font-size: 1.3rem; margin-bottom: 5px; }
  .fa-stat-val { font-size: 1.5rem; font-weight: 900; color: #0f172a; }
  .fa-stat-label { font-size: 0.72rem; color: #64748b; font-weight: 600; margin-top: 2px; }

  /* ── Tabs ── */
  .fa-tabs { display: flex; gap: 6px; margin-bottom: 18px; }
  .fa-tab {
    padding: 9px 20px; border-radius: 100px;
    border: 1.5px solid rgba(30,58,138,0.12);
    background: transparent; font-size: 0.85rem; font-weight: 700;
    color: #475569; cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; gap: 7px;
  }
  .fa-tab:hover { background: rgba(30,58,138,0.06); }
  .fa-tab-active {
    background: linear-gradient(135deg,#1e3a8a,#3b82f6);
    border-color: transparent; color: #fff;
  }
  .fa-tab-active:hover { filter: brightness(1.08); }
  .fa-tab-badge {
    background: #ef4444; color: #fff; border-radius: 100px;
    padding: 1px 7px; font-size: 0.72rem; font-weight: 800;
  }
  .fa-tab-active .fa-tab-badge { background: rgba(255,255,255,0.3); }

  /* ── List ── */
  .fa-list { display: flex; flex-direction: column; gap: 12px; }

  /* ── Row ── */
  .fa-row {
    background: rgba(255,255,255,0.9); border: 1px solid rgba(30,58,138,0.08);
    border-radius: 16px; padding: 16px;
    box-shadow: 3px 3px 12px rgba(15,23,42,0.04), -3px -3px 8px rgba(255,255,255,0.9);
  }
  .fa-row-pinned { border-color: rgba(245,158,11,0.3); }
  .fa-row-reviewed { opacity: 0.55; }
  .fa-row-header {
    display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;
  }
  .fa-row-meta { flex: 1; min-width: 0; }
  .fa-row-name {
    font-weight: 700; font-size: 0.88rem; color: #0f172a;
    display: flex; align-items: center; gap: 5px; flex-wrap: wrap;
  }
  .fa-row-time { font-size: 0.74rem; color: #94a3b8; font-weight: 500; margin-top: 2px; }
  .fa-pinned-label {
    font-size: 0.72rem; color: #b45309; font-weight: 700;
    background: rgba(245,158,11,0.1); padding: 2px 8px; border-radius: 100px;
  }
  .fa-reviewed-badge {
    font-size: 0.72rem; color: #15803d; font-weight: 700;
    background: rgba(22,163,74,0.1); padding: 2px 8px; border-radius: 100px;
    white-space: nowrap;
  }
  .fa-row-actions { display: flex; gap: 6px; flex-wrap: wrap; flex-shrink: 0; }

  /* ── Buttons ── */
  .fa-btn {
    padding: 6px 13px; border-radius: 9px; border: none;
    font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.15s;
    white-space: nowrap;
  }
  .fa-btn-red    { background: rgba(239,68,68,0.08);  color:#dc2626; border: 1px solid rgba(239,68,68,0.2); }
  .fa-btn-red:hover { background: rgba(239,68,68,0.15); }
  .fa-btn-blue   { background: rgba(30,58,138,0.07); color:#1e3a8a; border: 1px solid rgba(30,58,138,0.18); }
  .fa-btn-blue:hover { background: rgba(30,58,138,0.13); }
  .fa-btn-warn   { background: rgba(245,158,11,0.08); color:#b45309; border: 1px solid rgba(245,158,11,0.2); }
  .fa-btn-warn:hover { background: rgba(245,158,11,0.15); }
  .fa-btn-ghost  { background: rgba(100,116,139,0.07); color:#475569; border: 1px solid rgba(100,116,139,0.15); }
  .fa-btn-ghost:hover { background: rgba(100,116,139,0.13); }
  .fa-btn-sm { padding: 4px 9px; font-size: 0.73rem; }

  /* ── Post content ── */
  .fa-post-content {
    font-size: 0.88rem; color: #334155; line-height: 1.6; margin-bottom: 8px;
    white-space: pre-wrap; word-break: break-word;
  }
  .fa-post-tag {
    display: inline-block; font-size: 0.76rem; color: #64748b;
    background: rgba(30,58,138,0.05); border-radius: 100px;
    padding: 2px 10px; margin-right: 6px; margin-bottom: 6px;
  }

  /* ── Comments ── */
  .fa-comments-list {
    margin-top: 12px; padding-top: 12px;
    border-top: 1px solid rgba(30,58,138,0.07);
    display: flex; flex-direction: column; gap: 8px;
  }
  .fa-comments-title { font-size: 0.78rem; font-weight: 800; color: #475569; margin-bottom: 6px; }
  .fa-no-comments { font-size: 0.82rem; color: #94a3b8; font-style: italic; padding: 6px 0; }
  .fa-comment-row {
    display: flex; gap: 8px; align-items: flex-start;
    padding: 8px; background: rgba(30,58,138,0.03); border-radius: 10px;
  }
  .fa-comment-body { flex: 1; min-width: 0; }
  .fa-comment-name { font-weight: 700; font-size: 0.8rem; color: #0f172a; margin-right: 7px; }
  .fa-comment-time { font-size: 0.72rem; color: #94a3b8; }
  .fa-comment-text { font-size: 0.83rem; color: #334155; margin: 3px 0 0; word-break: break-word; }

  /* ── Reports ── */
  .fa-report-type {
    font-size: 0.78rem; font-weight: 800; color: #dc2626;
    background: rgba(239,68,68,0.07); padding: 3px 10px; border-radius: 100px;
    white-space: nowrap; flex-shrink: 0;
  }
  .fa-report-reason {
    font-size: 0.83rem; color: #475569; margin-bottom: 6px;
  }
  .fa-report-content {
    font-size: 0.83rem; color: #334155;
    background: rgba(30,58,138,0.04); padding: 8px 12px; border-radius: 10px;
    margin-bottom: 8px; font-style: italic; word-break: break-word;
    border-left: 3px solid rgba(30,58,138,0.15);
  }
  .fa-report-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
  .fa-reports-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 12px;
  }
  .fa-reports-count { font-size: 0.82rem; font-weight: 700; color: #64748b; }
  .fa-toggle { display: flex; align-items: center; gap: 7px; font-size: 0.82rem; color: #64748b; cursor: pointer; }

  /* ── Loading / empty / denied ── */
  .fa-loading {
    display: flex; align-items: center; gap: 10px; justify-content: center;
    padding: 30px; color: #64748b; font-size: 0.86rem; font-weight: 600;
  }
  .fa-spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2.5px solid rgba(59,130,246,0.2); border-top-color: #3b82f6;
    animation: faSpin 0.7s linear infinite;
  }
  @keyframes faSpin { to { transform: rotate(360deg); } }
  .fa-empty { text-align: center; padding: 30px; color: #94a3b8; font-size: 0.88rem; font-weight: 600; }
  .fa-denied { text-align: center; padding: 60px 20px; color: #64748b; }
  .fa-denied h2 { font-size: 1.3rem; font-weight: 900; color: #0f172a; margin: 12px 0 8px; }

  /* ── Mobile ── */
  @media (max-width: 580px) {
    .fa-stats { grid-template-columns: repeat(2,1fr); }
    .fa-row-header { flex-direction: column; }
    .fa-row-actions { width: 100%; }
    .fa-header { flex-direction: column; gap: 12px; align-items: flex-start; }
  }
`;export{g as default};