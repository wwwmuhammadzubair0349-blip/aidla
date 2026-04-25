import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{a as t,l as n,o as r}from"./vendor-helmet-D-cMCI9i.js";import{tr as i}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as a}from"./supabase-CXCPPx9q.js";import{r as o}from"./vendor-motion-DyarDpDD.js";var s=e(n(),1),c=o();r();var l=`zkafridi317@gmail.com`,u=10,d=[`😊 Happy`,`😂 Laughing`,`😍 Loved`,`🥳 Celebrating`,`😎 Cool`,`😢 Sad`,`😡 Angry`,`😴 Tired`,`🤔 Thinking`,`🙏 Grateful`,`💪 Motivated`,`📚 Studying`,`🎉 Excited`,`❤️ Thankful`,`😤 Frustrated`],f=`fuck.shit.ass.bitch.bastard.dick.pussy.cock.nigger.faggot.whore.slut.rape.kill yourself.kys.sex.nude.naked.porn.xxx.boobs.penis.vagina.harassment.abuse.madarchod.bhenchod.gaand.lund.chutiya.harami.kamina.randi`.split(`.`);function p(e){if(!e)return!1;let t=e.toLowerCase();return f.some(e=>t.includes(e))}function m(e){return e?/(\+?92|0)?[\s.-]?3[0-9]{2}[\s.-]?[0-9]{7}|(\d[\s.-]?){10,}/.test(e):!1}function h(e){return p(e)?`Your message contains inappropriate content.`:m(e)?`Phone numbers are not allowed in posts or comments.`:null}function g(e){if(!e)return``;let t=Math.floor((Date.now()-new Date(e))/1e3);return t<60?`just now`:t<3600?`${Math.floor(t/60)}m ago`:t<86400?`${Math.floor(t/3600)}h ago`:t<604800?`${Math.floor(t/86400)}d ago`:new Date(e).toLocaleDateString(`en-GB`,{day:`numeric`,month:`short`,year:`numeric`})}function _({profile:e,size:t=38}){var n;let r=(e==null||(n=e.full_name)==null?void 0:n.split(` `).map(e=>e[0]).join(``).slice(0,2).toUpperCase())||`?`;return e!=null&&e.avatar_url?(0,c.jsx)(`img`,{src:e.avatar_url,alt:e.full_name,style:{width:t,height:t,borderRadius:`50%`,objectFit:`cover`,flexShrink:0}}):(0,c.jsx)(`div`,{style:{width:t,height:t,borderRadius:`50%`,flexShrink:0,background:`linear-gradient(135deg,#1e3a8a,#3b82f6)`,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`#fff`,fontWeight:800,fontSize:t*.35},children:r})}function v(){return(0,c.jsx)(`span`,{title:`AIDLA Official`,style:{display:`inline-flex`,alignItems:`center`,justifyContent:`center`,width:16,height:16,borderRadius:`50%`,background:`#1d9bf0`,marginLeft:4,flexShrink:0,boxShadow:`0 1px 4px rgba(29,155,240,0.4)`},children:(0,c.jsx)(`svg`,{width:`9`,height:`9`,viewBox:`0 0 24 24`,fill:`white`,children:(0,c.jsx)(`path`,{d:`M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z`})})})}var y=[`Spam or misleading`,`Harassment or bullying`,`Hate speech`,`Sexual content`,`Violence`,`Misinformation`,`Other`];function b({onClose:e,onSubmit:t}){let[n,r]=(0,s.useState)(``),[i,a]=(0,s.useState)(``);return(0,c.jsx)(`div`,{className:`fd-overlay`,onClick:e,children:(0,c.jsxs)(`div`,{className:`fd-modal`,onClick:e=>e.stopPropagation(),children:[(0,c.jsx)(`div`,{className:`fd-modal-title`,children:`🚩 Report Content`}),(0,c.jsx)(`p`,{className:`fd-modal-sub`,children:`Select a reason for your report. Our team will review it.`}),(0,c.jsx)(`div`,{className:`fd-report-reasons`,children:y.map(e=>(0,c.jsx)(`button`,{className:`fd-reason-btn ${n===e?`active`:``}`,onClick:()=>r(e),children:e},e))}),n===`Other`&&(0,c.jsx)(`textarea`,{className:`fd-modal-textarea`,placeholder:`Describe the issue…`,value:i,onChange:e=>a(e.target.value),rows:3,maxLength:300}),(0,c.jsxs)(`div`,{className:`fd-modal-actions`,children:[(0,c.jsx)(`button`,{className:`fd-modal-cancel`,onClick:e,children:`Cancel`}),(0,c.jsx)(`button`,{className:`fd-modal-confirm fd-modal-report`,disabled:!n||n===`Other`&&!i.trim(),onClick:()=>t(n===`Other`?i.trim():n),children:`Submit Report`})]})]})})}function x({c:e,currentUserId:t,isAdmin:n,postOwnerId:r,onDelete:i,onReport:a}){var o,u;let[d,f]=(0,s.useState)(!1),p=n||t===e.user_id||t===r,m=((o=e.profiles)==null?void 0:o.email)===l;return(0,c.jsxs)(`div`,{className:`fd-comment`,children:[(0,c.jsx)(_,{profile:e.profiles,size:30}),(0,c.jsxs)(`div`,{className:`fd-comment-body`,children:[(0,c.jsxs)(`div`,{className:`fd-comment-header`,children:[(0,c.jsxs)(`span`,{className:`fd-comment-name`,children:[m?`AIDLA_Official`:((u=e.profiles)==null?void 0:u.full_name)||`User`,m&&(0,c.jsx)(v,{})]}),(0,c.jsx)(`span`,{className:`fd-comment-time`,children:g(e.created_at)}),(0,c.jsxs)(`div`,{className:`fd-comment-menu-wrap`,children:[(0,c.jsx)(`button`,{className:`fd-dot-btn`,onClick:()=>f(e=>!e),children:`⋯`}),d&&(0,c.jsxs)(`div`,{className:`fd-dropdown`,children:[p&&(0,c.jsx)(`button`,{onClick:()=>{f(!1),i(e.id)},children:`🗑 Delete`}),t!==e.user_id&&(0,c.jsx)(`button`,{onClick:()=>{f(!1),a(e.id,`comment`)},children:`🚩 Report`})]})]})]}),(0,c.jsx)(`p`,{className:`fd-comment-text`,children:e.content})]})]})}function S({post:e,currentUserId:n,currentEmail:r,currentUserProfile:o,isAdmin:u,onDelete:d,onReport:f,onCommentDelete:p,onRepost:m}){var y,S,C;let[w,T]=(0,s.useState)([]),[E,D]=(0,s.useState)(!1),[O,k]=(0,s.useState)(``),[A,j]=(0,s.useState)(e.user_liked),[M,N]=(0,s.useState)(e.like_count||0),[P,F]=(0,s.useState)(e.comment_count||0),[I,L]=(0,s.useState)(!1),[R,z]=(0,s.useState)(!1),[B,V]=(0,s.useState)(null),[H,U]=(0,s.useState)(!1),W=(0,s.useRef)(null),G=n===e.user_id,K=((y=e.profiles)==null?void 0:y.email)===l,q=K?`AIDLA_Official`:((S=e.profiles)==null?void 0:S.full_name)||`User`;(0,s.useEffect)(()=>{let e=e=>{W.current&&!W.current.contains(e.target)&&z(!1)};return document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[]);let J=function(){var n=i(function*(){let{data:n}=yield a.from(`feed_comments`).select(`*`).eq(`post_id`,e.id).eq(`is_deleted`,!1).order(`created_at`,{ascending:!0});if(!n||n.length===0){T([]);return}let r=[...new Set(n.map(e=>e.user_id))],{data:i}=yield a.from(`users_profiles`).select(`user_id,full_name,avatar_url,email`).in(`user_id`,r),o=Object.fromEntries((i||[]).map(e=>[e.user_id,e]));T(n.map(e=>t(t({},e),{},{profiles:o[e.user_id]||null})))});return function(){return n.apply(this,arguments)}}(),Y=function(){var e=i(function*(){!E&&w.length===0&&(yield J()),D(e=>!e)});return function(){return e.apply(this,arguments)}}(),X=function(){var t=i(function*(){if(!n)return;let t=!A;j(t),N(e=>t?e+1:Math.max(e-1,0)),t?yield a.from(`feed_likes`).insert({post_id:e.id,user_id:n}):yield a.from(`feed_likes`).delete().eq(`post_id`,e.id).eq(`user_id`,n)});return function(){return t.apply(this,arguments)}}(),Z=function(){var r=i(function*(){if(!O.trim()||I)return;let r=h(O);if(r){alert(r);return}L(!0);let{data:i,error:s}=yield a.from(`feed_comments`).insert({post_id:e.id,user_id:n,content:O.trim()}).select(`*`).single();if(!s&&i){let e=t(t({},i),{},{profiles:o});T(t=>[...t,e]),F(e=>e+1),k(``),D(!0)}L(!1)});return function(){return r.apply(this,arguments)}}(),Q=function(){var e=i(function*(e){yield a.from(`feed_comments`).delete().eq(`id`,e),T(t=>t.filter(t=>t.id!==e)),F(e=>Math.max(e-1,0)),p&&p(e)});return function(t){return e.apply(this,arguments)}}(),ee=function(){var e=i(function*(e){let{type:t,id:r}=B;yield a.from(`feed_reports`).insert({reporter_id:n,post_id:t===`post`?r:null,comment_id:t===`comment`?r:null,reason:e}),V(null),U(!0),setTimeout(()=>U(!1),3e3)});return function(t){return e.apply(this,arguments)}}(),te=`${window.location.origin}/feed/post/${e.id}`,$=()=>{navigator.clipboard.writeText(te).catch(()=>{}),alert(`Post link copied! Share it anywhere 🔗`)};return(0,c.jsxs)(`div`,{className:`fd-post-card ${e.is_pinned?`fd-pinned`:``}`,children:[e.is_pinned&&(0,c.jsx)(`div`,{className:`fd-pin-badge`,children:`📌 Pinned`}),B&&(0,c.jsx)(b,{onClose:()=>V(null),onSubmit:ee}),H&&(0,c.jsx)(`div`,{className:`fd-report-toast`,children:`✅ Report submitted. Thank you!`}),(0,c.jsxs)(`div`,{className:`fd-post-header`,children:[(0,c.jsx)(_,{profile:e.profiles,size:42}),(0,c.jsxs)(`div`,{className:`fd-post-meta`,children:[(0,c.jsxs)(`div`,{className:`fd-post-author`,children:[q,K&&(0,c.jsx)(v,{})]}),(0,c.jsxs)(`div`,{className:`fd-post-info`,children:[(0,c.jsx)(`span`,{children:g(e.created_at)}),e.location&&(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`span`,{className:`fd-dot`,children:`·`}),(0,c.jsxs)(`span`,{children:[`📍 `,e.location]})]}),e.feeling&&(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`span`,{className:`fd-dot`,children:`·`}),(0,c.jsx)(`span`,{children:e.feeling})]})]})]}),(0,c.jsxs)(`div`,{className:`fd-post-menu-wrap`,ref:W,children:[(0,c.jsx)(`button`,{className:`fd-dot-btn fd-dot-btn-lg`,onClick:()=>z(e=>!e),children:`⋯`}),R&&(0,c.jsxs)(`div`,{className:`fd-dropdown fd-dropdown-right`,children:[(G||u)&&(0,c.jsx)(`button`,{onClick:()=>{z(!1),d(e.id)},children:`🗑 Delete Post`}),!G&&(0,c.jsx)(`button`,{onClick:()=>{z(!1),V({id:e.id,type:`post`})},children:`🚩 Report Post`}),(0,c.jsx)(`button`,{onClick:()=>{z(!1),$()},children:`🔗 Copy Link`})]})]})]}),e.repost_of&&e.original&&(0,c.jsxs)(`div`,{className:`fd-repost-badge`,children:[`🔁 Reposted from `,(0,c.jsx)(`strong`,{children:((C=e.original.profiles)==null?void 0:C.full_name)||`User`})]}),(0,c.jsx)(`div`,{className:`fd-post-content`,children:e.content}),(0,c.jsxs)(`div`,{className:`fd-post-actions`,children:[(0,c.jsxs)(`button`,{className:`fd-action-btn ${A?`fd-liked`:``}`,onClick:X,children:[(0,c.jsx)(`span`,{className:`fd-action-icon`,children:A?`❤️`:`🤍`}),(0,c.jsxs)(`span`,{children:[M>0?M:``,` Like`]})]}),(0,c.jsxs)(`button`,{className:`fd-action-btn`,onClick:Y,children:[(0,c.jsx)(`span`,{className:`fd-action-icon`,children:`💬`}),(0,c.jsxs)(`span`,{children:[P>0?P:``,` Comment`]})]}),(0,c.jsxs)(`button`,{className:`fd-action-btn`,onClick:()=>m(e),children:[(0,c.jsx)(`span`,{className:`fd-action-icon`,children:`🔁`}),(0,c.jsxs)(`span`,{children:[e.repost_count>0?e.repost_count:``,` Repost`]})]}),(0,c.jsxs)(`button`,{className:`fd-action-btn`,onClick:$,children:[(0,c.jsx)(`span`,{className:`fd-action-icon`,children:`📤`}),(0,c.jsx)(`span`,{children:`Share`})]})]}),E&&(0,c.jsxs)(`div`,{className:`fd-comments-section`,children:[w.map(t=>(0,c.jsx)(x,{c:t,currentUserId:n,isAdmin:u,postOwnerId:e.user_id,onDelete:Q,onReport:e=>V({id:e,type:`comment`})},t.id)),(0,c.jsx)(`div`,{className:`fd-comment-input-row`,children:(0,c.jsxs)(`div`,{className:`fd-comment-input-wrap`,children:[(0,c.jsx)(`input`,{className:`fd-comment-input`,placeholder:`Write a comment…`,value:O,onChange:e=>k(e.target.value),onKeyDown:e=>e.key===`Enter`&&!e.shiftKey&&Z(),maxLength:500}),(0,c.jsx)(`button`,{className:`fd-comment-send`,onClick:Z,disabled:!O.trim()||I,children:I?`…`:`➤`})]})})]})]})}function C({profile:e,userId:n,isAdmin:r,onPosted:o,repostOf:l=null,onCancelRepost:u}){var f,p;let[m,g]=(0,s.useState)(``),[y,b]=(0,s.useState)(``),[x,S]=(0,s.useState)(``),[C,w]=(0,s.useState)(!1),[T,E]=(0,s.useState)(!1),[D,O]=(0,s.useState)(``),k=r?`AIDLA_Official`:(e==null?void 0:e.full_name)||`You`,A=function(){var r=i(function*(){var r;let i=l?m.trim()||`Reposted from @${((r=l.profiles)==null?void 0:r.full_name)||`User`}`:m.trim();if(!i)return;let s=h(i);if(s){O(s);return}E(!0),O(``);let c={user_id:n,content:i,feeling:y||null,location:x.trim()||null,repost_of:(l==null?void 0:l.id)||null},{data:d,error:f}=yield a.from(`feed_posts`).insert(c).select(`*`).single();if(f)O(f.message||`Failed to post. Please try again.`);else{let n=t(t({},d),{},{profiles:e,user_liked:!1,repost_count:0});g(``),b(``),S(``),w(!1),o&&o(n),u&&u()}E(!1)});return function(){return r.apply(this,arguments)}}();return(0,c.jsxs)(`div`,{className:`fd-compose`,children:[(0,c.jsxs)(`div`,{className:`fd-compose-header`,children:[(0,c.jsx)(_,{profile:e,size:40}),(0,c.jsxs)(`div`,{className:`fd-compose-name`,children:[k,r&&(0,c.jsx)(v,{})]})]}),l&&(0,c.jsxs)(`div`,{className:`fd-repost-preview`,children:[(0,c.jsx)(`div`,{className:`fd-rp-label`,children:`🔁 Reposting:`}),(0,c.jsxs)(`div`,{className:`fd-rp-content`,children:[`"`,(f=l.content)==null?void 0:f.slice(0,120),((p=l.content)==null?void 0:p.length)>120?`…`:``,`"`]}),(0,c.jsx)(`button`,{className:`fd-rp-cancel`,onClick:u,children:`✕ Cancel`})]}),(0,c.jsx)(`textarea`,{className:`fd-compose-textarea`,placeholder:l?`Add a comment to this repost… (optional)`:`What's on your mind, ${k.split(` `)[0]}?`,value:m,onChange:e=>{g(e.target.value),O(``)},maxLength:2e3,rows:3}),D&&(0,c.jsxs)(`div`,{className:`fd-compose-error`,children:[`⚠️ `,D]}),(0,c.jsxs)(`div`,{className:`fd-compose-extras`,children:[(0,c.jsxs)(`div`,{className:`fd-compose-tags`,children:[(0,c.jsxs)(`div`,{className:`fd-feelings-wrap`,children:[(0,c.jsx)(`button`,{className:`fd-tag-btn`,onClick:()=>w(e=>!e),children:y||`😊 Feeling`}),C&&(0,c.jsxs)(`div`,{className:`fd-feelings-dropdown`,children:[d.map(e=>(0,c.jsx)(`button`,{className:`fd-feeling-item`,onClick:()=>{b(e),w(!1)},children:e},e)),y&&(0,c.jsx)(`button`,{className:`fd-feeling-item fd-feeling-clear`,onClick:()=>{b(``),w(!1)},children:`✕ Clear`})]})]}),(0,c.jsx)(`input`,{className:`fd-location-input`,placeholder:`📍 Location`,value:x,onChange:e=>S(e.target.value),maxLength:80})]}),(0,c.jsxs)(`div`,{className:`fd-compose-footer`,children:[(0,c.jsxs)(`span`,{className:`fd-char-count`,children:[m.length,`/2000`]}),(0,c.jsx)(`button`,{className:`fd-post-btn`,onClick:A,disabled:T||!m.trim()&&!l,children:T?`Posting…`:l?`🔁 Repost`:`Post`})]})]})]})}function w(){let[e,n]=(0,s.useState)(null),[r,o]=(0,s.useState)(null),[d,f]=(0,s.useState)(null),[p,m]=(0,s.useState)([]),[h,g]=(0,s.useState)(!1),[_,y]=(0,s.useState)(!1),[b,x]=(0,s.useState)(0),[w,E]=(0,s.useState)(null),[D,O]=(0,s.useState)(!1),k=(0,s.useRef)(null),A=(0,s.useRef)(null),j=d===l;(0,s.useEffect)(()=>{i(function*(){let{data:{user:e}}=yield a.auth.getUser();if(!e)return;o(e.id),f(e.email),A.current=e.id;let{data:t}=yield a.from(`users_profiles`).select(`full_name,avatar_url,email`).eq(`user_id`,e.id).single();t&&n(t),M(0,!0,e.id)})()},[]);let M=function(){var e=i(function*(e,n,r){n?g(!0):O(!0);let i=e*u,o=i+u-1,{data:s,error:c}=yield a.from(`feed_posts`).select(`*`).eq(`is_deleted`,!1).order(`is_pinned`,{ascending:!1}).order(`created_at`,{ascending:!1}).range(i,o);if(!c&&s&&s.length>0){let i=s.map(e=>e.id),o=[...new Set(s.map(e=>e.user_id))],c=s.map(e=>e.repost_of).filter(Boolean),{data:l}=yield a.from(`users_profiles`).select(`user_id,full_name,avatar_url,email`).in(`user_id`,o),d=Object.fromEntries((l||[]).map(e=>[e.user_id,e])),f={};if(c.length>0){let{data:e}=yield a.from(`feed_posts`).select(`id,content,user_id`).in(`id`,c);if(e){let n=[...new Set(e.map(e=>e.user_id))],{data:r}=yield a.from(`users_profiles`).select(`user_id,full_name,avatar_url`).in(`user_id`,n),i=Object.fromEntries((r||[]).map(e=>[e.user_id,e]));e.forEach(e=>{f[e.id]=t(t({},e),{},{profiles:i[e.user_id]})})}}let{data:p}=yield a.from(`feed_likes`).select(`post_id`).eq(`user_id`,r).in(`post_id`,i),h=new Set((p||[]).map(e=>e.post_id)),g=s.map(e=>t(t({},e),{},{profiles:d[e.user_id]||null,original:e.repost_of&&f[e.repost_of]||null,user_liked:h.has(e.id)}));m(e=>n?g:[...e,...g]),y(s.length===u),x(e)}else c||(n&&m([]),y(!1));n?g(!1):O(!1)});return function(t,n,r){return e.apply(this,arguments)}}(),N=(0,s.useCallback)((e,t)=>{let n=A.current;n&&M(e,t,n)},[]);(0,s.useEffect)(()=>{let e=new IntersectionObserver(e=>{e[0].isIntersecting&&(F.current||!P.current||N(I.current+1,!1))},{rootMargin:`200px`,threshold:0});return k.current&&e.observe(k.current),()=>e.disconnect()},[N]);let P=(0,s.useRef)(_),F=(0,s.useRef)(D),I=(0,s.useRef)(b);(0,s.useEffect)(()=>{P.current=_},[_]),(0,s.useEffect)(()=>{F.current=D},[D]),(0,s.useEffect)(()=>{I.current=b},[b]);let L=e=>{m(n=>[t(t({},e),{},{user_liked:!1}),...n])},R=function(){var e=i(function*(e){if(!window.confirm(`Delete this post?`))return;m(t=>t.filter(t=>t.id!==e));let{error:t}=yield a.from(`feed_posts`).update({is_deleted:!0}).eq(`id`,e);if(!t)return;let{error:n}=yield a.from(`feed_posts`).delete().eq(`id`,e);n&&(console.error(`Delete failed — soft:`,t,`hard:`,n),alert(`Could not delete this post. You may not have permission.`),N(0,!0))});return function(t){return e.apply(this,arguments)}}(),z=function(){var e=i(function*(){});return function(){return e.apply(this,arguments)}}();return(0,c.jsxs)(`div`,{className:`fd-root`,children:[(0,c.jsx)(`style`,{children:T}),(0,c.jsxs)(`div`,{className:`fd-feed-header`,children:[(0,c.jsx)(`h2`,{className:`fd-feed-title`,children:j?`📡 AIDLA Feed — Admin View`:`📡 Community Feed`}),j&&(0,c.jsxs)(`span`,{className:`fd-admin-badge`,children:[`Admin Mode `,(0,c.jsx)(v,{})]})]}),r&&(0,c.jsx)(C,{profile:e,userId:r,isAdmin:j,onPosted:L,repostOf:w,onCancelRepost:()=>E(null)}),(0,c.jsx)(`div`,{className:`fd-posts-list`,children:p.map(t=>(0,c.jsx)(S,{post:t,currentUserId:r,currentEmail:d,currentUserProfile:e,isAdmin:j,onDelete:R,onReport:z,onCommentDelete:()=>{},onRepost:e=>{E(e),window.scrollTo({top:0,behavior:`smooth`})}},t.id))}),h&&(0,c.jsxs)(`div`,{className:`fd-loading`,children:[(0,c.jsx)(`div`,{className:`fd-spinner`}),(0,c.jsx)(`span`,{children:`Loading posts…`})]}),!h&&p.length===0&&(0,c.jsxs)(`div`,{className:`fd-empty`,children:[(0,c.jsx)(`div`,{style:{fontSize:48},children:`💬`}),(0,c.jsx)(`p`,{children:`No posts yet. Be the first to post!`})]}),D&&(0,c.jsxs)(`div`,{className:`fd-loading`,children:[(0,c.jsx)(`div`,{className:`fd-spinner`}),(0,c.jsx)(`span`,{children:`Loading more…`})]}),!h&&!D&&!_&&p.length>0&&(0,c.jsx)(`div`,{className:`fd-end`,children:`You've seen all posts ✓`}),_&&(0,c.jsx)(`div`,{ref:k,style:{height:20}})]})}var T=`
  .fd-root {
    max-width: 680px;
    margin: 0 auto;
    font-family: 'Inter', system-ui, sans-serif;
    padding-bottom: 40px;
  }

  .fd-feed-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 18px;
  }
  .fd-feed-title {
    font-size: 1.25rem; font-weight: 900; color: #0f172a;
    letter-spacing: -0.4px; margin: 0;
  }
  .fd-admin-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 100px;
    background: rgba(29,155,240,0.1); border: 1px solid rgba(29,155,240,0.25);
    color: #0369a1; font-size: 0.78rem; font-weight: 700;
  }

  .fd-compose {
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(30,58,138,0.1);
    border-radius: 18px; padding: 18px;
    margin-bottom: 16px;
    box-shadow: 4px 4px 16px rgba(15,23,42,0.05), -4px -4px 12px rgba(255,255,255,0.8);
  }
  .fd-compose-header {
    display: flex; align-items: center; gap: 11px; margin-bottom: 12px;
  }
  .fd-compose-name {
    font-weight: 700; font-size: 0.9rem; color: #0f172a;
    display: flex; align-items: center; gap: 3px;
  }
  .fd-compose-textarea {
    width: 100%; padding: 12px 14px; border-radius: 13px;
    border: 1.5px solid rgba(30,58,138,0.1);
    background: #f8fafc; font-family: inherit;
    font-size: 0.92rem; color: #0f172a; line-height: 1.55;
    resize: none; box-sizing: border-box; transition: all 0.2s;
  }
  .fd-compose-textarea:focus {
    outline: none; background: #fff;
    border-color: rgba(59,130,246,0.35);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.07);
  }
  .fd-compose-error {
    font-size: 0.8rem; color: #dc2626; font-weight: 600;
    margin: 6px 0; padding: 8px 12px; background: rgba(239,68,68,0.07);
    border-radius: 8px;
  }
  .fd-compose-extras { margin-top: 10px; }
  .fd-compose-tags {
    display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;
  }
  .fd-tag-btn {
    padding: 6px 13px; border-radius: 100px;
    border: 1.5px solid rgba(30,58,138,0.12);
    background: rgba(30,58,138,0.04);
    color: #475569; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .fd-tag-btn:hover { background: rgba(30,58,138,0.09); }
  .fd-feelings-wrap { position: relative; }
  .fd-feelings-dropdown {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 100;
    background: #fff; border: 1px solid rgba(30,58,138,0.12);
    border-radius: 14px; padding: 8px;
    box-shadow: 0 12px 32px rgba(15,23,42,0.12);
    display: grid; grid-template-columns: 1fr 1fr; gap: 3px;
    min-width: 220px;
  }
  .fd-feeling-item {
    padding: 7px 10px; border-radius: 9px; border: none;
    background: transparent; text-align: left;
    font-size: 0.82rem; font-weight: 600; color: #334155;
    cursor: pointer; transition: background 0.12s;
  }
  .fd-feeling-item:hover { background: rgba(30,58,138,0.07); }
  .fd-feeling-clear { color: #ef4444; grid-column: span 2; }
  .fd-location-input {
    flex: 1; min-width: 120px; padding: 6px 12px; border-radius: 100px;
    border: 1.5px solid rgba(30,58,138,0.12);
    background: rgba(30,58,138,0.04);
    font-size: 0.8rem; font-family: inherit; color: #475569;
    outline: none; transition: all 0.15s;
  }
  .fd-location-input:focus { border-color: rgba(59,130,246,0.3); background: #fff; }
  .fd-compose-footer {
    display: flex; align-items: center; justify-content: space-between;
  }
  .fd-char-count { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
  .fd-post-btn {
    padding: 9px 24px; border-radius: 100px; border: none;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #fff; font-size: 0.88rem; font-weight: 800;
    cursor: pointer; transition: all 0.15s;
    box-shadow: 0 3px 0 #1e40af;
  }
  .fd-post-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
  .fd-post-btn:active:not(:disabled) { transform: translateY(3px); box-shadow: none; }
  .fd-post-btn:disabled { background: #cbd5e1; box-shadow: 0 3px 0 #94a3b8; cursor: not-allowed; }

  .fd-repost-preview {
    background: rgba(59,130,246,0.05); border: 1.5px solid rgba(59,130,246,0.15);
    border-radius: 12px; padding: 11px 14px; margin-bottom: 10px;
    display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap;
  }
  .fd-rp-label { font-size: 0.78rem; font-weight: 700; color: #3b82f6; white-space: nowrap; }
  .fd-rp-content { flex: 1; font-size: 0.84rem; color: #475569; font-style: italic; min-width: 0; }
  .fd-rp-cancel {
    font-size: 0.75rem; color: #ef4444; font-weight: 700;
    border: none; background: none; cursor: pointer; white-space: nowrap;
  }

  .fd-post-card {
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(30,58,138,0.08);
    border-radius: 18px; padding: 18px;
    margin-bottom: 14px; position: relative;
    box-shadow: 4px 4px 16px rgba(15,23,42,0.05), -4px -4px 12px rgba(255,255,255,0.8);
    animation: fdCardIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes fdCardIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
  .fd-pinned {
    border-color: rgba(245,158,11,0.3);
    box-shadow: 4px 4px 16px rgba(245,158,11,0.08), -4px -4px 12px rgba(255,255,255,0.8);
  }
  .fd-pin-badge {
    display: inline-block; margin-bottom: 10px; padding: 3px 10px; border-radius: 100px;
    background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25);
    font-size: 0.74rem; font-weight: 700; color: #b45309;
  }

  .fd-post-header {
    display: flex; align-items: flex-start; gap: 11px; margin-bottom: 12px;
  }
  .fd-post-meta { flex: 1; min-width: 0; }
  .fd-post-author {
    font-weight: 800; font-size: 0.93rem; color: #0f172a;
    display: flex; align-items: center; gap: 3px;
  }
  .fd-post-info {
    font-size: 0.76rem; color: #94a3b8; font-weight: 500; margin-top: 2px;
    display: flex; flex-wrap: wrap; align-items: center; gap: 3px;
  }
  .fd-dot { color: #cbd5e1; }

  .fd-post-menu-wrap, .fd-comment-menu-wrap { position: relative; }
  .fd-dot-btn {
    background: none; border: none; cursor: pointer;
    color: #94a3b8; font-size: 1.1rem; padding: 4px 8px;
    border-radius: 8px; transition: all 0.15s; line-height: 1;
  }
  .fd-dot-btn:hover { background: rgba(30,58,138,0.07); color: #475569; }
  .fd-dot-btn-lg { font-size: 1.3rem; padding: 4px 10px; }
  .fd-dropdown {
    position: absolute; top: calc(100% + 4px); right: 0; z-index: 50;
    background: #fff; border: 1px solid rgba(30,58,138,0.1);
    border-radius: 13px; padding: 6px;
    box-shadow: 0 12px 32px rgba(15,23,42,0.13); min-width: 160px;
    animation: fdDropIn 0.18s ease;
  }
  @keyframes fdDropIn { from { opacity:0; transform:scale(0.95) translateY(-6px); } to { opacity:1; transform:none; } }
  .fd-dropdown button {
    display: block; width: 100%; text-align: left;
    padding: 9px 13px; border: none; background: transparent;
    font-size: 0.83rem; font-weight: 600; color: #334155;
    border-radius: 9px; cursor: pointer; transition: background 0.12s;
  }
  .fd-dropdown button:hover { background: rgba(30,58,138,0.07); }

  .fd-repost-badge {
    font-size: 0.79rem; color: #64748b; margin-bottom: 8px;
    padding: 5px 10px; background: rgba(59,130,246,0.05);
    border-radius: 8px; border-left: 3px solid #3b82f6;
  }

  .fd-post-content {
    font-size: 0.95rem; color: #1e293b; line-height: 1.65;
    white-space: pre-wrap; word-break: break-word; margin-bottom: 14px;
  }

  .fd-post-actions {
    display: flex; gap: 2px; flex-wrap: wrap;
    padding-top: 10px; border-top: 1px solid rgba(30,58,138,0.06);
  }
  .fd-action-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 6px; border: none; background: transparent; border-radius: 10px;
    font-size: 0.8rem; font-weight: 600; color: #64748b; cursor: pointer;
    transition: all 0.15s; white-space: nowrap;
  }
  .fd-action-btn:hover { background: rgba(30,58,138,0.06); color: #1e3a8a; }
  .fd-liked { color: #e11d48; }
  .fd-liked:hover { color: #e11d48; }
  .fd-action-icon { font-size: 1rem; }

  .fd-comments-section {
    margin-top: 12px; padding-top: 12px;
    border-top: 1px solid rgba(30,58,138,0.06);
    display: flex; flex-direction: column; gap: 10px;
  }
  .fd-comment {
    display: flex; gap: 9px; align-items: flex-start;
  }
  .fd-comment-body { flex: 1; min-width: 0; }
  .fd-comment-header {
    display: flex; align-items: center; gap: 7px; flex-wrap: wrap;
  }
  .fd-comment-name {
    font-weight: 700; font-size: 0.83rem; color: #0f172a;
    display: flex; align-items: center; gap: 3px;
  }
  .fd-comment-time { font-size: 0.72rem; color: #94a3b8; font-weight: 500; }
  .fd-comment-text {
    font-size: 0.87rem; color: #334155; line-height: 1.5; margin: 3px 0 0;
    word-break: break-word;
  }
  .fd-comment-input-row { margin-top: 6px; }
  .fd-comment-input-wrap {
    display: flex; gap: 8px; align-items: center;
  }
  .fd-comment-input {
    flex: 1; padding: 9px 14px; border-radius: 100px;
    border: 1.5px solid rgba(30,58,138,0.12);
    background: #f8fafc; font-family: inherit;
    font-size: 0.86rem; color: #0f172a; outline: none; transition: all 0.15s;
  }
  .fd-comment-input:focus {
    border-color: rgba(59,130,246,0.3); background: #fff;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.06);
  }
  .fd-comment-send {
    width: 36px; height: 36px; border-radius: 50%; border: none;
    background: linear-gradient(135deg,#1e3a8a,#3b82f6);
    color: #fff; font-size: 0.85rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; flex-shrink: 0;
  }
  .fd-comment-send:hover:not(:disabled) { filter: brightness(1.1); transform: scale(1.05); }
  .fd-comment-send:disabled { background: #cbd5e1; cursor: not-allowed; }

  .fd-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(2,6,23,0.55);
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .fd-modal {
    background: #fff; border-radius: 22px; padding: 28px 24px;
    max-width: 420px; width: 100%;
    box-shadow: 0 30px 80px rgba(2,6,23,0.2);
    animation: fdModalIn 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes fdModalIn { from{opacity:0;transform:scale(0.9) translateY(16px);} to{opacity:1;transform:none;} }
  .fd-modal-title { font-size: 1.05rem; font-weight: 900; color: #0f172a; margin-bottom: 6px; }
  .fd-modal-sub { font-size: 0.83rem; color: #64748b; margin-bottom: 16px; }
  .fd-report-reasons { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
  .fd-reason-btn {
    padding: 7px 14px; border-radius: 100px;
    border: 1.5px solid rgba(30,58,138,0.15);
    background: transparent; font-size: 0.8rem; font-weight: 600;
    color: #475569; cursor: pointer; transition: all 0.15s;
  }
  .fd-reason-btn.active, .fd-reason-btn:hover {
    background: rgba(30,58,138,0.08); border-color: rgba(30,58,138,0.3); color: #1e3a8a;
  }
  .fd-modal-textarea {
    width: 100%; padding: 10px 13px; border-radius: 12px;
    border: 1.5px solid rgba(30,58,138,0.12);
    background: #f8fafc; font-family: inherit;
    font-size: 0.86rem; resize: none; box-sizing: border-box;
    outline: none; margin-bottom: 14px;
  }
  .fd-modal-actions { display: flex; gap: 9px; justify-content: flex-end; }
  .fd-modal-cancel {
    padding: 9px 20px; border-radius: 11px;
    border: 1.5px solid #e2e8f0; background: transparent;
    font-size: 0.86rem; font-weight: 700; color: #64748b; cursor: pointer;
  }
  .fd-modal-confirm {
    padding: 9px 20px; border-radius: 11px; border: none;
    font-size: 0.86rem; font-weight: 800; cursor: pointer; transition: all 0.15s;
  }
  .fd-modal-report {
    background: linear-gradient(135deg,#dc2626,#ef4444);
    color: #fff; box-shadow: 0 3px 0 #b91c1c;
  }
  .fd-modal-report:disabled { background: #cbd5e1; box-shadow: none; cursor: not-allowed; }
  .fd-report-toast {
    position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
    background: #15803d; color: #fff; padding: 7px 16px; border-radius: 100px;
    font-size: 0.8rem; font-weight: 700; white-space: nowrap; z-index: 10;
    animation: fdToastIn 0.3s ease;
  }
  @keyframes fdToastIn { from{opacity:0;transform:translateX(-50%) translateY(-8px);} to{opacity:1;transform:translateX(-50%) translateY(0);} }

  .fd-loading {
    display: flex; align-items: center; gap: 10px; justify-content: center;
    padding: 24px; color: #64748b; font-size: 0.85rem; font-weight: 600;
  }
  .fd-spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2.5px solid rgba(59,130,246,0.2); border-top-color: #3b82f6;
    animation: fdSpin 0.7s linear infinite;
  }
  @keyframes fdSpin { to { transform: rotate(360deg); } }
  .fd-empty {
    text-align: center; padding: 40px 20px;
    color: #94a3b8; font-size: 0.9rem; font-weight: 600;
  }
  .fd-end {
    text-align: center; padding: 20px;
    color: #cbd5e1; font-size: 0.8rem; font-weight: 600;
  }

  @media (max-width: 580px) {
    .fd-post-card, .fd-compose { padding: 14px; border-radius: 15px; }
    .fd-action-btn span:last-child { display: none; }
    .fd-action-btn { min-width: 0; }
    .fd-feelings-dropdown { grid-template-columns: 1fr; min-width: 160px; }
    .fd-modal { padding: 22px 18px; border-radius: 18px; }
  }
`;export{w as default};