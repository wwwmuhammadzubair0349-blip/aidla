import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t}from"./vendor-helmet-D-cMCI9i.js";import{tr as n}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as r}from"./supabase-CXCPPx9q.js";import{r as i}from"./vendor-motion-DyarDpDD.js";var a=e(t(),1),o=i();function s(){let[e,t]=(0,a.useState)(!0),[i,s]=(0,a.useState)([]),[c,l]=(0,a.useState)(``),[u,d]=(0,a.useState)(null),[f,p]=(0,a.useState)(null);(0,a.useEffect)(()=>{n(function*(){var e;l(``),t(!0);let{data:n}=yield r.auth.getUser(),i=n==null||(e=n.user)==null?void 0:e.id;if(!i){l(`Not logged in.`),t(!1);return}let{data:a,error:o}=yield r.from(`users_transactions`).select(`txn_no, txn_type, direction, amount, balance_before, balance_after, note, created_at`).eq(`user_id`,i).order(`created_at`,{ascending:!1}).limit(100);o?l(o.message):s(a||[]),t(!1)})()},[]);let m=i.reduce((e,t)=>{let n=new Date(t.created_at).toLocaleDateString(`en-US`,{weekday:`short`,year:`numeric`,month:`short`,day:`numeric`});return e[n]||(e[n]=[]),e[n].push(t),e},{});function h(e){navigator.clipboard.writeText(e).then(()=>{p(e),setTimeout(()=>p(null),2e3)})}function g(e){d(t=>t===e?null:e)}return(0,o.jsxs)(`div`,{className:`transactions-wrapper`,children:[(0,o.jsx)(`style`,{children:`
    .transactions-wrapper {
      padding-bottom: 20px;
    }

    .transactions-wrapper h3 {
      margin-top: 0;
      font-size: 1.1rem;
      color: #1e3a8a;
      font-weight: 800;
      margin-bottom: 16px;
    }

    .txn-msg { color: #b91c1c; font-weight: 600; font-size: 0.85rem; }
    .txn-empty { color: #64748b; font-weight: 600; font-size: 0.85rem; padding: 20px 0; text-align: center; }
    .txn-loading { color: #64748b; font-weight: 600; font-size: 0.85rem; padding: 20px 0; text-align: center; }

    /* Date Group Header */
    .txn-date-group { margin-bottom: 18px; }

    .txn-date-label {
      font-size: 0.7rem;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 6px 10px;
      background: #e2e8f0;
      border-radius: 8px;
      margin-bottom: 6px;
      display: inline-block;
    }

    /* Transaction Row */
    .txn-row-wrap {
      background: #ffffff;
      border-radius: 12px;
      margin-bottom: 6px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }

    .txn-row-wrap:hover {
      box-shadow: 0 2px 10px rgba(15,23,42,0.08);
    }

    .txn-row-main {
      display: grid;
      grid-template-columns: 1fr 1fr auto auto;
      align-items: center;
      gap: 8px;
      padding: 11px 12px;
      cursor: pointer;
      user-select: none;
    }

    .txn-type-text {
      font-size: 0.75rem;
      font-weight: 700;
      color: #334155;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .txn-type-sub {
      font-size: 0.62rem;
      color: #94a3b8;
      font-weight: 500;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .txn-amount-col {
      text-align: right;
    }

    .txn-amount {
      font-size: 0.85rem;
      font-weight: 800;
      white-space: nowrap;
    }

    .txn-balance {
      font-size: 0.65rem;
      color: #94a3b8;
      font-weight: 600;
      text-align: right;
      margin-top: 2px;
    }

    .txn-balance-col {
      text-align: right;
      min-width: 42px;
    }

    .txn-balance-val {
      font-size: 0.72rem;
      font-weight: 700;
      color: #475569;
      white-space: nowrap;
    }

    .txn-balance-lbl {
      font-size: 0.58rem;
      color: #94a3b8;
      margin-top: 2px;
    }

    .txn-chevron {
      font-size: 0.65rem;
      color: #94a3b8;
      transition: transform 0.2s;
      margin-left: 4px;
      flex-shrink: 0;
    }

    .txn-chevron.open { transform: rotate(180deg); }

    /* Expanded Detail Panel */
    .txn-detail {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .txn-detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .txn-detail-label {
      font-size: 0.65rem;
      color: #94a3b8;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      flex-shrink: 0;
    }

    .txn-detail-value {
      font-size: 0.72rem;
      font-weight: 700;
      color: #334155;
      text-align: right;
      word-break: break-all;
      font-family: monospace;
    }

    .txn-copy-btn {
      background: #e0e7ff;
      color: #1e3a8a;
      border: none;
      border-radius: 7px;
      padding: 4px 10px;
      font-size: 0.65rem;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s;
      flex-shrink: 0;
    }

    .txn-copy-btn:hover { background: #c7d2fe; }
    .txn-copy-btn.copied { background: #dcfce7; color: #15803d; }

    .txn-detail-note {
      font-size: 0.7rem;
      color: #64748b;
      font-style: italic;
      font-family: inherit;
    }

    .amount-in  { color: #15803d; }
    .amount-out { color: #b91c1c; }

    @media (max-width: 380px) {
      .txn-row-main { gap: 5px; padding: 10px 10px; }
      .txn-type-text { font-size: 0.7rem; }
      .txn-amount { font-size: 0.8rem; }
    }
  `}),(0,o.jsx)(`h3`,{children:`Transactions`}),e&&(0,o.jsx)(`div`,{className:`txn-loading`,children:`Loading...`}),c&&(0,o.jsx)(`div`,{className:`txn-msg`,children:c}),!e&&!i.length&&(0,o.jsx)(`div`,{className:`txn-empty`,children:`No transactions yet.`}),Object.entries(m).map(([e,t])=>(0,o.jsxs)(`div`,{className:`txn-date-group`,children:[(0,o.jsxs)(`div`,{className:`txn-date-label`,children:[`📅 `,e]}),t.map(e=>{var t,n;let r=((t=e.direction)==null?void 0:t.toLowerCase())===`in`,i=u===e.txn_no,a=new Date(e.created_at).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),s=new Date(e.created_at).toLocaleString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`,hour:`2-digit`,minute:`2-digit`,second:`2-digit`});return(0,o.jsxs)(`div`,{className:`txn-row-wrap`,children:[(0,o.jsxs)(`div`,{className:`txn-row-main`,onClick:()=>g(e.txn_no),children:[(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`div`,{className:`txn-type-text`,children:(n=e.txn_type)==null?void 0:n.replace(/_/g,` `)}),(0,o.jsx)(`div`,{className:`txn-type-sub`,children:a})]}),(0,o.jsxs)(`div`,{className:`txn-amount-col`,children:[(0,o.jsxs)(`div`,{className:`txn-amount ${r?`amount-in`:`amount-out`}`,children:[r?`+`:`-`,Number(e.amount).toLocaleString()]}),(0,o.jsx)(`div`,{className:`txn-balance`,children:`AIDLA`})]}),(0,o.jsxs)(`div`,{className:`txn-balance-col`,children:[(0,o.jsx)(`div`,{className:`txn-balance-val`,children:Number(e.balance_after).toLocaleString()}),(0,o.jsx)(`div`,{className:`txn-balance-lbl`,children:`Balance`})]}),(0,o.jsx)(`span`,{className:`txn-chevron${i?` open`:``}`,children:`▼`})]}),i&&(0,o.jsxs)(`div`,{className:`txn-detail`,children:[(0,o.jsxs)(`div`,{className:`txn-detail-row`,children:[(0,o.jsx)(`span`,{className:`txn-detail-label`,children:`TXN No`}),(0,o.jsx)(`span`,{className:`txn-detail-value`,children:e.txn_no}),(0,o.jsx)(`button`,{className:`txn-copy-btn${f===e.txn_no?` copied`:``}`,onClick:t=>{t.stopPropagation(),h(e.txn_no)},children:f===e.txn_no?`✅ Copied`:`📋 Copy`})]}),(0,o.jsxs)(`div`,{className:`txn-detail-row`,children:[(0,o.jsx)(`span`,{className:`txn-detail-label`,children:`Date & Time`}),(0,o.jsx)(`span`,{className:`txn-detail-value`,style:{fontFamily:`inherit`},children:s})]}),e.note&&(0,o.jsxs)(`div`,{className:`txn-detail-row`,children:[(0,o.jsx)(`span`,{className:`txn-detail-label`,children:`Note`}),(0,o.jsx)(`span`,{className:`txn-detail-note`,children:e.note})]})]})]},e.txn_no)})]},e))]})}export{s as default};