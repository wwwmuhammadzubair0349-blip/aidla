import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{a as t,l as n,o as r}from"./vendor-helmet-D-cMCI9i.js";import{tr as i}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as a}from"./supabase-CXCPPx9q.js";import{r as o}from"./vendor-motion-DyarDpDD.js";var s=e(n(),1),c=o();r();var l=`https://eyhpcztyznrpwnytvakw.supabase.co/functions/v1/chat`;function u(e){return e?new Date(e).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}):``}function d(e){if(!e)return``;let t=new Date(e),n=new Date,r=new Date(n);return r.setDate(r.getDate()-1),t.toDateString()===n.toDateString()?`Today`:t.toDateString()===r.toDateString()?`Yesterday`:t.toLocaleDateString([],{weekday:`long`,month:`short`,day:`numeric`})}function f(e){let n=[],r=null;for(let i of e){let e=d(i.created_at||new Date().toISOString());e!==r&&(n.push({type:`date`,label:e,id:`date-`+e}),r=e),n.push(t({type:`message`},i))}return n}function p(e,t){let n=e.split(`
`),r=[],i=0,a=0,o=()=>a++;for(;i<n.length;){let e=n[i];if(e.startsWith("```")){let t=e.slice(3).trim()||`code`,a=[];for(i++;i<n.length&&!n[i].startsWith("```");)a.push(n[i]),i++;i++;let s=a.join(`
`);r.push((0,c.jsxs)(`div`,{className:`bot-code-block`,children:[(0,c.jsxs)(`div`,{className:`bot-code-header`,children:[(0,c.jsx)(`span`,{className:`bot-code-lang`,children:t}),(0,c.jsx)(h,{code:s})]}),(0,c.jsx)(`pre`,{className:`bot-code-pre`,children:(0,c.jsx)(`code`,{children:s})})]},o()));continue}if(/^(-{3,}|\*{3,}|_{3,})$/.test(e.trim())){r.push((0,c.jsx)(`hr`,{className:`bot-hr`},o())),i++;continue}let a=e.match(/^(#{1,4})\s+(.+)/);if(a){let e=a[1].length,n=`h${Math.min(e+2,6)}`;r.push((0,c.jsx)(n,{className:`bot-heading bot-h${e}`,children:m(a[2],t)},o())),i++;continue}if(e.startsWith(`> `)){let e=[];for(;i<n.length&&n[i].startsWith(`> `);)e.push(n[i].slice(2)),i++;r.push((0,c.jsx)(`blockquote`,{className:`bot-blockquote`,children:e.map((e,n)=>(0,c.jsx)(`p`,{children:m(e,t)},n))},o()));continue}if(/^(\s*[-*+]\s)/.test(e)){let e=[];for(;i<n.length&&/^(\s*[-*+]\s)/.test(n[i]);)e.push(n[i].replace(/^\s*[-*+]\s/,``)),i++;r.push((0,c.jsx)(`ul`,{className:`bot-ul`,children:e.map((e,n)=>(0,c.jsx)(`li`,{children:m(e,t)},n))},o()));continue}if(/^\d+\.\s/.test(e)){let e=[];for(;i<n.length&&/^\d+\.\s/.test(n[i]);)e.push(n[i].replace(/^\d+\.\s/,``)),i++;r.push((0,c.jsx)(`ol`,{className:`bot-ol`,children:e.map((e,n)=>(0,c.jsx)(`li`,{children:m(e,t)},n))},o()));continue}if(e.trim()===``){r.push((0,c.jsx)(`div`,{className:`bot-spacer`},o())),i++;continue}r.push((0,c.jsx)(`p`,{className:`bot-p`,children:m(e,t)},o())),i++}return r}function m(e,t){let n=/(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\)]+)\)|(https?:\/\/[^\s\)\]\>"']+))/g,r=[],i=0,a,o=0;for(;(a=n.exec(e))!==null;)a.index>i&&r.push((0,c.jsx)(`span`,{children:e.slice(i,a.index)},o++)),a[2]?r.push((0,c.jsx)(`strong`,{children:a[2]},o++)):a[3]?r.push((0,c.jsx)(`em`,{children:a[3]},o++)):a[4]?r.push((0,c.jsx)(`code`,{className:`bot-inline-code ${t?`bot-inline-code-user`:``}`,children:a[4]},o++)):a[5]&&a[6]?r.push((0,c.jsx)(`a`,{href:a[6],target:`_blank`,rel:`noopener noreferrer`,className:`bot-link ${t?`bot-link-user`:`bot-link-bot`}`,children:a[5]},o++)):a[7]&&r.push((0,c.jsx)(`a`,{href:a[7],target:`_blank`,rel:`noopener noreferrer`,className:`bot-link ${t?`bot-link-user`:`bot-link-bot`}`,children:a[7]},o++)),i=a.index+a[0].length;return i<e.length&&r.push((0,c.jsx)(`span`,{children:e.slice(i)},o++)),r.length===0?e:r}function h({code:e}){let[t,n]=(0,s.useState)(!1);return(0,c.jsx)(`button`,{className:`bot-code-copy`,onClick:()=>{navigator.clipboard.writeText(e).catch(()=>{}),n(!0),setTimeout(()=>n(!1),1800)},children:t?`✓ Copied`:`Copy`})}function g(){return(0,c.jsxs)(`div`,{className:`bot-typing-wrap`,children:[(0,c.jsx)(`div`,{className:`bot-avatar-sm`,children:`🤖`}),(0,c.jsxs)(`div`,{className:`bot-typing-bubble`,children:[(0,c.jsx)(`span`,{className:`bot-dot`,style:{animationDelay:`0ms`}}),(0,c.jsx)(`span`,{className:`bot-dot`,style:{animationDelay:`160ms`}}),(0,c.jsx)(`span`,{className:`bot-dot`,style:{animationDelay:`320ms`}})]})]})}function _({text:e}){let[t,n]=(0,s.useState)(!1);return(0,c.jsx)(`button`,{className:`bot-copy-btn`,onClick:()=>{navigator.clipboard.writeText(e).catch(()=>{}),n(!0),setTimeout(()=>n(!1),1800)},title:`Copy message`,children:t?(0,c.jsx)(`svg`,{width:`13`,height:`13`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:(0,c.jsx)(`polyline`,{points:`20 6 9 17 4 12`})}):(0,c.jsxs)(`svg`,{width:`13`,height:`13`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,c.jsx)(`rect`,{x:`9`,y:`9`,width:`13`,height:`13`,rx:`2`,ry:`2`}),(0,c.jsx)(`path`,{d:`M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1`})]})})}function v({msg:e}){let t=e.role===`user`;return(0,c.jsxs)(`div`,{className:`bot-msg-row ${t?`bot-msg-row-user`:`bot-msg-row-bot`}`,children:[!t&&(0,c.jsx)(`div`,{className:`bot-avatar-sm`,children:`🤖`}),(0,c.jsxs)(`div`,{className:`bot-bubble ${t?`bot-bubble-user`:`bot-bubble-bot`}`,children:[(0,c.jsx)(`div`,{className:`bot-bubble-text`,children:t?m(e.content,!0):p(e.content,!1)}),(0,c.jsxs)(`div`,{className:`bot-bubble-footer`,children:[(0,c.jsx)(`span`,{className:`bot-bubble-time`,children:u(e.created_at)}),(0,c.jsx)(_,{text:e.content})]})]}),t&&(0,c.jsx)(`div`,{className:`bot-avatar-sm bot-avatar-user`,children:`👤`})]})}var y=[`Write me a Python function to reverse a string 🐍`,`Help me write a professional CV 📄`,`How do I earn coins on AIDLA? 🪙`,`Explain photosynthesis simply 🌿`,`Write an Instagram caption for a study post 📱`,`How to prepare for a job interview? 💼`];function b(){let[e,t]=(0,s.useState)(null),[n,r]=(0,s.useState)(``),[o,u]=(0,s.useState)([]),[d,p]=(0,s.useState)(``),[m,h]=(0,s.useState)(!1),[_,b]=(0,s.useState)(!0),[S,C]=(0,s.useState)(!1),[w,T]=(0,s.useState)(!1),[E,D]=(0,s.useState)(``),O=(0,s.useRef)(null),k=(0,s.useRef)(null),A=(0,s.useRef)([]);A.current=o,(0,s.useEffect)(()=>{i(function*(){let{data:{user:e}}=yield a.auth.getUser();if(!e)return;t(e.id);let{data:n}=yield a.from(`users_profiles`).select(`full_name`).eq(`user_id`,e.id).single();n!=null&&n.full_name&&r(n.full_name.split(` `)[0]);let{data:i,error:o}=yield a.from(`bot_chat_messages`).select(`id, role, content, created_at`).eq(`user_id`,e.id).order(`created_at`,{ascending:!0}).limit(200);!o&&i&&u(i),b(!1)})()},[]),(0,s.useEffect)(()=>{var e;(e=O.current)==null||e.scrollIntoView({behavior:`smooth`})},[o,m]);let j=e=>{p(e.target.value),e.target.style.height=`auto`,e.target.style.height=Math.min(e.target.scrollHeight,120)+`px`},M=(0,s.useCallback)(i(function*(){let t=d.trim();if(!t||m||!e)return;p(``),D(``),h(!0),k.current&&(k.current.style.height=`auto`);let n={id:`local-u-`+Date.now(),role:`user`,content:t,created_at:new Date().toISOString()};u(e=>[...e,n]);try{yield a.from(`bot_chat_messages`).insert({user_id:e,role:`user`,content:t});let n=A.current.slice(-10).map(e=>({role:e.role,content:e.content})),r=yield(yield fetch(l,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({message:t,user_id:e,history:n})})).json();if(r.error)D(`Bot error: `+r.error);else{let t=r.reply,n={id:`local-b-`+Date.now(),role:`assistant`,content:t,created_at:new Date().toISOString()};u(e=>[...e,n]),yield a.from(`bot_chat_messages`).insert({user_id:e,role:`assistant`,content:t})}}catch(e){D(`Connection error. Please check your internet and try again.`)}finally{var r;h(!1),(r=k.current)==null||r.focus()}}),[d,m,e]),N=e=>{e.key===`Enter`&&!e.shiftKey&&(e.preventDefault(),M())},P=function(){var t=i(function*(){e&&(C(!0),yield a.from(`bot_chat_messages`).delete().eq(`user_id`,e),u([]),C(!1),T(!1))});return function(){return t.apply(this,arguments)}}(),F=f(o);return(0,c.jsxs)(`div`,{className:`bot-root`,children:[(0,c.jsx)(`style`,{children:x}),(0,c.jsxs)(`div`,{className:`bot-header`,children:[(0,c.jsxs)(`div`,{className:`bot-header-left`,children:[(0,c.jsx)(`div`,{className:`bot-header-avatar`,children:`🤖`}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`div`,{className:`bot-header-name`,children:`AIDLA Bot`}),(0,c.jsxs)(`div`,{className:`bot-header-status`,children:[(0,c.jsx)(`span`,{className:`bot-status-dot`}),`Always online · Coding · Writing · Research · Education`]})]})]}),(0,c.jsx)(`div`,{className:`bot-header-actions`,children:(0,c.jsxs)(`button`,{className:`bot-clear-btn`,onClick:()=>T(!0),title:`Clear chat history`,disabled:o.length===0||S,children:[(0,c.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.2`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,c.jsx)(`polyline`,{points:`3 6 5 6 21 6`}),(0,c.jsx)(`path`,{d:`M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6`}),(0,c.jsx)(`path`,{d:`M10 11v6M14 11v6`}),(0,c.jsx)(`path`,{d:`M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2`})]}),(0,c.jsx)(`span`,{children:`Clear Chat`})]})})]}),w&&(0,c.jsx)(`div`,{className:`bot-confirm-overlay`,onClick:()=>T(!1),children:(0,c.jsxs)(`div`,{className:`bot-confirm-box`,onClick:e=>e.stopPropagation(),children:[(0,c.jsx)(`div`,{className:`bot-confirm-icon`,children:`🗑️`}),(0,c.jsx)(`div`,{className:`bot-confirm-title`,children:`Clear all messages?`}),(0,c.jsx)(`div`,{className:`bot-confirm-sub`,children:`This action cannot be undone. All chat history will be permanently deleted.`}),(0,c.jsxs)(`div`,{className:`bot-confirm-actions`,children:[(0,c.jsx)(`button`,{className:`bot-confirm-cancel`,onClick:()=>T(!1),children:`Cancel`}),(0,c.jsx)(`button`,{className:`bot-confirm-delete`,onClick:P,disabled:S,children:S?`Clearing…`:`Yes, Clear All`})]})]})}),(0,c.jsxs)(`div`,{className:`bot-messages`,children:[_?(0,c.jsxs)(`div`,{className:`bot-history-loading`,children:[(0,c.jsx)(`div`,{className:`bot-spinner`}),(0,c.jsx)(`span`,{children:`Loading chat history…`})]}):o.length===0?(0,c.jsxs)(`div`,{className:`bot-empty`,children:[(0,c.jsx)(`div`,{className:`bot-empty-icon`,children:`🤖`}),(0,c.jsxs)(`div`,{className:`bot-empty-title`,children:[`Hi`,n?`, ${n}`:``,`! I'm AIDLA Bot 👋`]}),(0,c.jsx)(`div`,{className:`bot-empty-sub`,children:`Your all-in-one AI assistant. Ask me anything — coding, writing, research, study help, career advice, social media, and more. I speak all languages! 🌍`}),(0,c.jsx)(`div`,{className:`bot-empty-chips`,children:y.map(e=>(0,c.jsx)(`button`,{className:`bot-suggestion-chip`,onClick:()=>{var t;p(e),(t=k.current)==null||t.focus()},children:e},e))})]}):(0,c.jsxs)(c.Fragment,{children:[F.map(e=>e.type===`date`?(0,c.jsx)(`div`,{className:`bot-date-divider`,children:(0,c.jsx)(`span`,{children:e.label})},e.id):(0,c.jsx)(v,{msg:e},e.id)),m&&(0,c.jsx)(g,{})]}),(0,c.jsx)(`div`,{ref:O})]}),E&&(0,c.jsxs)(`div`,{className:`bot-error`,children:[`⚠️ `,E,(0,c.jsx)(`button`,{onClick:()=>D(``),children:`×`})]}),(0,c.jsxs)(`div`,{className:`bot-input-wrap`,children:[(0,c.jsxs)(`div`,{className:`bot-input-box`,children:[(0,c.jsx)(`textarea`,{ref:k,className:`bot-textarea`,value:d,onChange:j,onKeyDown:N,placeholder:`Ask me anything — coding, writing, study help, career advice…`,rows:1,disabled:m||_}),(0,c.jsx)(`button`,{className:`bot-send-btn ${d.trim()&&!m?`bot-send-btn-active`:``}`,onClick:M,disabled:!d.trim()||m,title:`Send (Enter)`,children:m?(0,c.jsx)(`div`,{className:`bot-send-spinner`}):(0,c.jsxs)(`svg`,{width:`18`,height:`18`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,c.jsx)(`line`,{x1:`22`,y1:`2`,x2:`11`,y2:`13`}),(0,c.jsx)(`polygon`,{points:`22 2 15 22 11 13 2 9 22 2`})]})})]}),(0,c.jsx)(`div`,{className:`bot-input-hint`,children:`Press Enter to send · Shift+Enter for new line`})]})]})}var x=`
  .bot-root {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 140px);
    min-height: 480px;
    max-width: 820px;
    margin: 0 auto;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: rgba(255,255,255,0.6);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.9);
    box-shadow: 12px 12px 40px rgba(15,23,42,0.07), -8px -8px 30px rgba(255,255,255,0.8);
    overflow: hidden;
  }

  /* ── Header ── */
  .bot-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: rgba(255,255,255,0.85);
    border-bottom: 1px solid rgba(30,58,138,0.08);
    flex-shrink: 0;
    gap: 10px;
  }
  .bot-header-left { display: flex; align-items: center; gap: 12px; }
  .bot-header-avatar {
    width: 42px; height: 42px;
    border-radius: 14px;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(59,130,246,0.3);
    flex-shrink: 0;
  }
  .bot-header-name { font-weight: 800; font-size: 1rem; color: #0f172a; letter-spacing: -0.3px; }
  .bot-header-status {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; color: #64748b; margin-top: 1px;
  }
  .bot-status-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
    animation: botPulse 2s ease infinite; flex-shrink: 0;
  }
  @keyframes botPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
    50%       { box-shadow: 0 0 0 4px rgba(34,197,94,0); }
  }
  .bot-header-actions { display: flex; gap: 8px; }
  .bot-clear-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 13px; border-radius: 10px;
    border: 1px solid rgba(239,68,68,0.18);
    background: rgba(239,68,68,0.05);
    color: #dc2626; font-size: 0.78rem; font-weight: 700;
    cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .bot-clear-btn:hover:not(:disabled) {
    background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); transform: translateY(-1px);
  }
  .bot-clear-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Messages area ── */
  .bot-messages {
    flex: 1; overflow-y: auto; padding: 16px;
    display: flex; flex-direction: column; gap: 4px; scroll-behavior: smooth;
  }
  .bot-messages::-webkit-scrollbar { width: 4px; }
  .bot-messages::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.25); border-radius: 100px; }

  /* ── Date divider ── */
  .bot-date-divider {
    display: flex; align-items: center; gap: 10px;
    margin: 10px 0 6px; font-size: 11px; font-weight: 700;
    color: #94a3b8; letter-spacing: 0.5px;
    text-align: center; justify-content: center;
  }
  .bot-date-divider span {
    padding: 3px 12px;
    background: rgba(30,58,138,0.06);
    border-radius: 100px;
    border: 1px solid rgba(30,58,138,0.08);
  }

  /* ── Message rows ── */
  .bot-msg-row {
    display: flex; align-items: flex-end; gap: 8px; margin-bottom: 6px;
    animation: botMsgIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes botMsgIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: none; }
  }
  .bot-msg-row-user { flex-direction: row-reverse; }
  .bot-msg-row-bot  { flex-direction: row; }

  /* ── Avatars ── */
  .bot-avatar-sm {
    width: 30px; height: 30px; border-radius: 10px;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(59,130,246,0.2);
  }
  .bot-avatar-user {
    background: linear-gradient(135deg, #475569, #64748b);
    box-shadow: 0 2px 8px rgba(71,85,105,0.2);
  }

  /* ── Bubbles ── */
  .bot-bubble {
    max-width: min(78%, 600px);
    padding: 10px 13px 8px;
    border-radius: 16px;
    line-height: 1.55;
    font-size: 0.9rem;
    position: relative;
  }
  .bot-bubble-bot {
    background: #ffffff;
    border: 1px solid rgba(30,58,138,0.1);
    border-bottom-left-radius: 4px;
    box-shadow: 4px 4px 14px rgba(15,23,42,0.06), -2px -2px 8px rgba(255,255,255,0.9);
    color: #1e293b;
  }
  .bot-bubble-user {
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 16px rgba(59,130,246,0.25);
  }
  .bot-bubble-text { font-weight: 500; word-break: break-word; }
  .bot-bubble-footer {
    display: flex; align-items: center; justify-content: flex-end;
    gap: 6px; margin-top: 5px;
  }
  .bot-bubble-time { font-size: 10px; font-weight: 600; opacity: 0.55; }

  /* ── Copy button ── */
  .bot-copy-btn {
    background: transparent; border: none; cursor: pointer;
    padding: 2px; opacity: 0.45; color: inherit;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.15s; border-radius: 4px;
  }
  .bot-copy-btn:hover { opacity: 1; }

  /* ── Markdown elements ── */
  .bot-p { margin: 0 0 4px 0; line-height: 1.6; }
  .bot-spacer { height: 6px; }
  .bot-ul, .bot-ol {
    margin: 4px 0 6px 0;
    padding-left: 20px;
    display: flex; flex-direction: column; gap: 3px;
  }
  .bot-ul li, .bot-ol li { line-height: 1.55; }
  .bot-heading { margin: 6px 0 3px 0; font-weight: 800; color: #0f172a; line-height: 1.3; }
  .bot-h1 { font-size: 1.05rem; }
  .bot-h2 { font-size: 0.98rem; }
  .bot-h3 { font-size: 0.93rem; }
  .bot-h4 { font-size: 0.9rem; }
  .bot-hr { border: none; border-top: 1px solid rgba(30,58,138,0.12); margin: 8px 0; }
  .bot-blockquote {
    border-left: 3px solid rgba(59,130,246,0.4);
    margin: 4px 0; padding: 4px 10px;
    background: rgba(59,130,246,0.04);
    border-radius: 0 6px 6px 0;
    font-style: italic; color: #475569;
  }
  .bot-blockquote p { margin: 0; }

  /* ── Inline code ── */
  .bot-inline-code {
    font-family: 'Courier New', Consolas, monospace;
    font-size: 0.82em;
    background: rgba(30,58,138,0.08);
    border: 1px solid rgba(30,58,138,0.12);
    border-radius: 5px;
    padding: 1px 5px;
    color: #1e3a8a;
    font-style: normal;
  }
  .bot-inline-code-user {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.3);
    color: #fff;
  }

  /* ── Code block ── */
  .bot-code-block {
    margin: 6px 0;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid rgba(30,58,138,0.12);
    background: #0f172a;
    font-size: 0.82rem;
  }
  .bot-code-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 7px 12px;
    background: rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .bot-code-lang {
    font-size: 0.72rem; font-weight: 700;
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;
    font-family: 'Courier New', monospace;
  }
  .bot-code-copy {
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    color: #cbd5e1; font-size: 0.72rem; font-weight: 600;
    padding: 3px 9px; border-radius: 6px; cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }
  .bot-code-copy:hover { background: rgba(255,255,255,0.18); color: #fff; }
  .bot-code-pre {
    margin: 0; padding: 12px 14px; overflow-x: auto;
    font-family: 'Courier New', Consolas, 'Fira Code', monospace;
    font-size: 0.82rem; line-height: 1.6;
    color: #e2e8f0; white-space: pre;
  }
  .bot-code-pre::-webkit-scrollbar { height: 4px; }
  .bot-code-pre::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }

  /* ── Links ── */
  .bot-link {
    text-decoration: underline; text-underline-offset: 2px;
    word-break: break-all; transition: opacity 0.15s;
  }
  .bot-link:hover { opacity: 0.75; }
  .bot-link-bot  { color: #2563eb; }
  .bot-link-user { color: #bfdbfe; }

  /* ── Typing indicator ── */
  .bot-typing-wrap {
    display: flex; align-items: flex-end; gap: 8px;
    animation: botMsgIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .bot-typing-bubble {
    display: flex; align-items: center; gap: 4px;
    background: #ffffff; border: 1px solid rgba(30,58,138,0.1);
    border-bottom-left-radius: 4px; border-radius: 16px;
    padding: 12px 16px;
    box-shadow: 4px 4px 14px rgba(15,23,42,0.06);
  }
  .bot-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    animation: botDotBounce 1.2s ease infinite; display: block;
  }
  @keyframes botDotBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
    30%            { transform: translateY(-6px); opacity: 1; }
  }

  /* ── Empty state ── */
  .bot-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; flex: 1; padding: 30px 20px;
    text-align: center; gap: 10px;
  }
  .bot-empty-icon { font-size: 52px; animation: botFloat 3s ease-in-out infinite; }
  @keyframes botFloat {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }
  .bot-empty-title { font-size: 1.1rem; font-weight: 800; color: #1e3a8a; margin-top: 4px; }
  .bot-empty-sub {
    font-size: 0.85rem; color: #64748b; font-weight: 500;
    max-width: 400px; line-height: 1.5;
  }
  .bot-empty-chips {
    display: flex; flex-wrap: wrap; gap: 8px;
    justify-content: center; margin-top: 6px;
  }
  .bot-suggestion-chip {
    padding: 8px 14px; border-radius: 100px;
    border: 1px solid rgba(30,58,138,0.15);
    background: rgba(30,58,138,0.05);
    color: #1e3a8a; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; transition: all 0.15s; text-align: left;
  }
  .bot-suggestion-chip:hover {
    background: rgba(30,58,138,0.1); border-color: rgba(30,58,138,0.3);
    transform: translateY(-1px); box-shadow: 0 4px 10px rgba(30,58,138,0.1);
  }

  /* ── History loading ── */
  .bot-history-loading {
    display: flex; align-items: center; gap: 10px;
    color: #64748b; font-size: 0.85rem; font-weight: 600;
    padding: 20px; justify-content: center;
  }
  .bot-spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(59,130,246,0.2);
    border-top-color: #3b82f6;
    border-radius: 50%; animation: botSpin 0.7s linear infinite;
  }
  @keyframes botSpin { to { transform: rotate(360deg); } }

  /* ── Error bar ── */
  .bot-error {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px;
    background: rgba(239,68,68,0.07);
    border-top: 1px solid rgba(239,68,68,0.15);
    color: #dc2626; font-size: 0.82rem; font-weight: 600; flex-shrink: 0;
  }
  .bot-error button {
    background: transparent; border: none; color: #dc2626;
    font-size: 18px; cursor: pointer; font-weight: 700; padding: 0 4px;
  }

  /* ── Input area ── */
  .bot-input-wrap {
    padding: 12px 14px 10px;
    background: rgba(255,255,255,0.85);
    border-top: 1px solid rgba(30,58,138,0.08);
    flex-shrink: 0;
  }
  .bot-input-box {
    display: flex; align-items: flex-end; gap: 10px;
    background: #f8fafc;
    border: 1.5px solid rgba(30,58,138,0.12);
    border-radius: 16px; padding: 8px 10px 8px 16px;
    box-shadow: inset 3px 3px 6px rgba(15,23,42,0.04), inset -3px -3px 6px rgba(255,255,255,1);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .bot-input-box:focus-within {
    border-color: rgba(59,130,246,0.4); background: #fff;
    box-shadow: inset 2px 2px 4px rgba(15,23,42,0.03), inset -2px -2px 4px rgba(255,255,255,1), 0 0 0 3px rgba(59,130,246,0.08);
  }
  .bot-textarea {
    flex: 1; background: transparent; border: none; outline: none;
    resize: none; font-size: 0.92rem; font-weight: 500; color: #0f172a;
    line-height: 1.5; max-height: 120px; overflow-y: auto;
    font-family: inherit; padding: 4px 0;
  }
  .bot-textarea::placeholder { color: #94a3b8; }
  .bot-textarea:disabled { opacity: 0.6; cursor: not-allowed; }

  .bot-send-btn {
    width: 38px; height: 38px; border-radius: 12px; border: none;
    background: #e2e8f0; color: #94a3b8;
    display: flex; align-items: center; justify-content: center;
    cursor: not-allowed; flex-shrink: 0; transition: all 0.2s;
  }
  .bot-send-btn-active {
    background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: #fff;
    cursor: pointer; box-shadow: 0 3px 10px rgba(59,130,246,0.3);
  }
  .bot-send-btn-active:hover {
    filter: brightness(1.1); transform: translateY(-1px);
    box-shadow: 0 5px 14px rgba(59,130,246,0.4);
  }
  .bot-send-btn-active:active {
    transform: translateY(1px); box-shadow: 0 2px 6px rgba(59,130,246,0.2);
  }
  .bot-send-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%;
    animation: botSpin 0.7s linear infinite;
  }
  .bot-input-hint {
    text-align: center; font-size: 10px; color: #94a3b8;
    font-weight: 600; margin-top: 6px; letter-spacing: 0.3px;
  }

  /* ── Clear confirm modal ── */
  .bot-confirm-overlay {
    position: fixed; inset: 0;
    background: rgba(2,6,23,0.55); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 99999; padding: 16px;
  }
  .bot-confirm-box {
    background: #fff; border-radius: 22px; padding: 30px 28px;
    text-align: center; max-width: 380px; width: 100%;
    box-shadow: 0 30px 80px rgba(2,6,23,0.25), inset 0 1px 0 rgba(255,255,255,0.6);
    animation: botConfirmIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes botConfirmIn {
    from { opacity: 0; transform: scale(0.88) translateY(20px); }
    to   { opacity: 1; transform: none; }
  }
  .bot-confirm-icon { font-size: 44px; margin-bottom: 10px; }
  .bot-confirm-title { font-size: 1.15rem; font-weight: 900; color: #0f172a; margin-bottom: 8px; }
  .bot-confirm-sub { font-size: 0.84rem; color: #64748b; line-height: 1.5; margin-bottom: 22px; }
  .bot-confirm-actions { display: flex; gap: 10px; justify-content: center; }
  .bot-confirm-cancel {
    padding: 10px 22px; border-radius: 12px;
    border: 1.5px solid #e2e8f0; background: transparent;
    color: #475569; font-size: 0.88rem; font-weight: 700;
    cursor: pointer; transition: all 0.15s;
  }
  .bot-confirm-cancel:hover { background: #f8fafc; }
  .bot-confirm-delete {
    padding: 10px 22px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #dc2626, #ef4444); color: #fff;
    font-size: 0.88rem; font-weight: 700; cursor: pointer;
    box-shadow: 0 3px 0 #b91c1c, 0 6px 14px rgba(239,68,68,0.25);
    transition: all 0.15s;
  }
  .bot-confirm-delete:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
  .bot-confirm-delete:disabled { opacity: 0.7; cursor: not-allowed; }

  /* ── Mobile ── */
  @media (max-width: 640px) {
    .bot-root { height: calc(100vh - 100px); border-radius: 14px; }
    .bot-header { padding: 11px 13px; }
    .bot-header-avatar { width: 36px; height: 36px; font-size: 17px; border-radius: 11px; }
    .bot-header-name { font-size: 0.9rem; }
    .bot-header-status { font-size: 10px; }
    .bot-clear-btn span { display: none; }
    .bot-clear-btn { padding: 7px 10px; }
    .bot-messages { padding: 12px; gap: 3px; }
    .bot-bubble { font-size: 0.85rem; padding: 9px 11px 7px; max-width: 88%; }
    .bot-code-block { font-size: 0.78rem; }
    .bot-code-pre { padding: 10px 12px; }
    .bot-empty-icon { font-size: 40px; }
    .bot-empty-title { font-size: 0.95rem; }
    .bot-empty-sub { font-size: 0.8rem; }
    .bot-suggestion-chip { font-size: 0.74rem; padding: 6px 11px; }
    .bot-input-wrap { padding: 10px 11px 8px; }
    .bot-input-box { border-radius: 13px; padding: 7px 8px 7px 13px; }
    .bot-textarea { font-size: 0.86rem; }
    .bot-send-btn { width: 34px; height: 34px; border-radius: 10px; }
    .bot-input-hint { font-size: 9px; }
    .bot-confirm-box { padding: 24px 20px; border-radius: 18px; }
    .bot-confirm-icon { font-size: 36px; }
    .bot-confirm-title { font-size: 1rem; }
  }
`;export{b as default};