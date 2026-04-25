import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t}from"./vendor-helmet-D-cMCI9i.js";import{tr as n}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as r}from"./supabase-CXCPPx9q.js";import{r as i}from"./vendor-motion-DyarDpDD.js";var a=e(t(),1),o=i();function s(){let[e,t]=(0,a.useState)(!0),[i,s]=(0,a.useState)(!0),[c,l]=(0,a.useState)(null),[u,d]=(0,a.useState)([]),[f,p]=(0,a.useState)([]),[m,h]=(0,a.useState)(``),[g,_]=(0,a.useState)(``),[v,y]=(0,a.useState)(`all`);(0,a.useEffect)(()=>{n(function*(){var e,n;h(``),t(!0);let{data:i}=yield r.auth.getUser(),a=i==null||(e=i.user)==null?void 0:e.id;if(!a){h(`Not logged in.`),t(!1);return}let{data:o,error:s}=yield r.from(`users_profiles`).select(`total_aidla_coins`).eq(`user_id`,a).single();s?h(s.message):l((n=o==null?void 0:o.total_aidla_coins)==null?0:n),t(!1)})()},[]),(0,a.useEffect)(()=>{n(function*(){var e;s(!0);let{data:t}=yield r.auth.getUser(),n=t==null||(e=t.user)==null?void 0:e.id;if(!n){s(!1);return}let{data:i,error:a}=yield r.from(`users_transactions`).select(`txn_no, txn_type, direction, amount, balance_after, note, created_at`).eq(`user_id`,n).order(`created_at`,{ascending:!1}).limit(50);a?console.error(`Transaction error:`,a):d(i||[]),s(!1)})()},[]),(0,a.useEffect)(()=>{let e=u;if(v!==`all`&&(e=e.filter(e=>{var t;return((t=e.txn_type)==null?void 0:t.toLowerCase())===v.toLowerCase()})),g.trim()){let t=g.toLowerCase();e=e.filter(e=>{var n,r,i,a;return((n=e.txn_no)==null?void 0:n.toLowerCase().includes(t))||((r=e.txn_type)==null?void 0:r.toLowerCase().includes(t))||((i=e.direction)==null?void 0:i.toLowerCase().includes(t))||((a=e.note)==null?void 0:a.toLowerCase().includes(t))})}p(e)},[u,g,v]);let b=[...new Set(u.map(e=>e.txn_type).filter(Boolean))];return(0,o.jsxs)(`div`,{className:`overview-container`,children:[(0,o.jsx)(`style`,{children:`
    .overview-container {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .balance-card {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(30, 58, 138, 0.2);
    }

    .balance-label {
      font-size: 0.9rem;
      font-weight: 700;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .balance-amount {
      font-size: 2.8rem;
      font-weight: 900;
      margin-top: 10px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .transactions-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .section-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: #1e3a8a;
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .see-all-link {
      font-size: 0.9rem;
      color: #3b82f6;
      text-decoration: none;
      font-weight: 700;
      transition: color 0.2s;
    }

    .see-all-link:hover {
      color: #1e3a8a;
      text-decoration: underline;
    }

    .search-filter-container {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
      padding: 10px 16px;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      background: #f8fafc;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .filter-select {
      padding: 10px 14px;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      background: #f8fafc;
      font-size: 0.95rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-select:focus {
      outline: none;
      border-color: #3b82f6;
      background: #ffffff;
    }

    .transactions-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 15px;
      border-radius: 16px;
    }

    .txn-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .txn-card:hover {
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.1);
      transform: translateY(-2px);
    }

    .txn-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
    }

    .txn-card-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: #1e3a8a;
      word-break: break-all;
    }

    .txn-card-badge {
      flex-shrink: 0;
    }

    .txn-card-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .txn-card-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
    }

    .txn-card-label {
      color: #64748b;
      font-weight: 600;
    }

    .txn-card-value {
      color: #1e3a8a;
      font-weight: 700;
    }

    .txn-card-amount {
      font-size: 1.1rem;
      font-weight: 800;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
    }

    .txn-card-date {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
      text-align: right;
    }

    .transactions-table {
      width: 100%;
      overflow-x: auto;
      border-radius: 16px;
      background: #f8fafc;
      box-shadow: inset 2px 2px 5px rgba(15, 23, 42, 0.02);
      display: none;
    }

    @media (max-width: 900px) {
      .transactions-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 12px;
      }

      .txn-card {
        padding: 14px;
      }
    }

    @media (max-width: 768px) {
      .transactions-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 10px;
      }

      .txn-card {
        padding: 12px;
        gap: 10px;
      }

      .txn-card-title {
        font-size: 0.85rem;
      }

      .txn-card-row {
        font-size: 0.8rem;
      }

      .txn-card-amount {
        font-size: 1rem;
      }
    }

    @media (max-width: 600px) {
      .transactions-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .txn-card {
        padding: 12px;
      }

      .txn-card-title {
        font-size: 0.8rem;
      }

      .txn-card-row {
        font-size: 0.75rem;
      }

      .txn-card-amount {
        font-size: 0.95rem;
      }
    }

    .txn-type-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }

    .txn-type-deposit {
      background: #dcfce7;
      color: #15803d;
    }

    .txn-type-withdraw {
      background: #fee2e2;
      color: #b91c1c;
    }

    .txn-type-referral {
      background: #fef3c7;
      color: #92400e;
    }

    .txn-type-mining {
      background: #dbeafe;
      color: #0c4a6e;
    }

    .amount-positive {
      color: #15803d;
      font-weight: 800;
    }

    .amount-negative {
      color: #b91c1c;
      font-weight: 800;
    }

    .empty-state {
      text-align: center;
      padding: 30px;
      color: #64748b;
      font-weight: 600;
    }

    .loading-state {
      text-align: center;
      padding: 30px;
      color: #64748b;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .overview-container {
        gap: 20px;
      }

      .balance-card {
        padding: 20px;
        border-radius: 16px;
      }

      .balance-label {
        font-size: 0.85rem;
      }

      .balance-amount {
        font-size: 2rem;
      }

      .section-title {
        font-size: 1.2rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .see-all-link {
        font-size: 0.85rem;
      }

      .search-filter-container {
        flex-direction: column;
        gap: 10px;
        margin-bottom: 12px;
      }

      .search-input {
        min-width: 100%;
        padding: 9px 14px;
        font-size: 0.9rem;
        border-radius: 10px;
      }

      .filter-select {
        width: 100%;
        padding: 9px 12px;
        font-size: 0.9rem;
        border-radius: 10px;
      }

      .transactions-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 10px;
      }

      .txn-card {
        padding: 12px;
      }

      .empty-state {
        padding: 20px;
      }

      .loading-state {
        padding: 20px;
      }
    }

    @media (max-width: 600px) {
      .overview-container {
        gap: 15px;
      }

      .balance-card {
        padding: 16px;
        border-radius: 14px;
        box-shadow: 0 8px 20px rgba(30, 58, 138, 0.15);
      }

      .balance-label {
        font-size: 0.8rem;
      }

      .balance-amount {
        font-size: 1.8rem;
        margin-top: 8px;
      }

      .transactions-section {
        gap: 10px;
      }

      .section-title {
        font-size: 1rem;
        gap: 6px;
      }

      .see-all-link {
        font-size: 0.8rem;
      }

      .search-filter-container {
        gap: 8px;
        margin-bottom: 10px;
      }

      .search-input {
        padding: 8px 12px;
        font-size: 0.85rem;
        border-radius: 9px;
      }

      .filter-select {
        padding: 8px 12px;
        font-size: 0.85rem;
        border-radius: 9px;
      }

      .transactions-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .txn-card {
        padding: 12px;
      }

      .txn-card-title {
        font-size: 0.8rem;
      }

      .txn-card-row {
        font-size: 0.75rem;
      }

      .txn-card-amount {
        font-size: 0.95rem;
      }

      .amount-positive, .amount-negative {
        font-size: 0.85rem;
      }

      .empty-state {
        padding: 15px;
        font-size: 0.9rem;
      }

      .loading-state {
        padding: 15px;
        font-size: 0.9rem;
      }
    }
  `}),(0,o.jsxs)(`div`,{className:`balance-card`,children:[(0,o.jsx)(`div`,{className:`balance-label`,children:`Your Total Balance`}),(0,o.jsx)(`div`,{className:`balance-amount`,children:e?`Loading...`:`${Number(c||0).toLocaleString()} AIDLA`}),m&&(0,o.jsx)(`div`,{style:{color:`#fca5a5`,marginTop:12},children:m})]}),(0,o.jsxs)(`div`,{className:`transactions-section`,children:[(0,o.jsxs)(`h3`,{className:`section-title`,children:[`Latest Transactions`,(0,o.jsx)(`a`,{href:`/user/wallet/transactions`,className:`see-all-link`,children:`See All →`})]}),(0,o.jsxs)(`div`,{className:`search-filter-container`,children:[(0,o.jsx)(`input`,{type:`text`,className:`search-input`,placeholder:`Search transaction no, type, note...`,value:g,onChange:e=>_(e.target.value)}),(0,o.jsxs)(`select`,{className:`filter-select`,value:v,onChange:e=>y(e.target.value),children:[(0,o.jsx)(`option`,{value:`all`,children:`All Types`}),b.map(e=>(0,o.jsx)(`option`,{value:e,children:e},e))]})]}),i?(0,o.jsx)(`div`,{className:`loading-state`,children:`Loading transactions...`}):f.length===0?(0,o.jsx)(`div`,{className:`empty-state`,children:`No transactions found`}):(0,o.jsx)(`div`,{className:`transactions-grid`,children:f.slice(0,4).map(e=>{var t,n,r;return(0,o.jsxs)(`div`,{className:`txn-card`,children:[(0,o.jsxs)(`div`,{className:`txn-card-header`,children:[(0,o.jsx)(`div`,{className:`txn-card-title`,children:e.txn_no}),(0,o.jsx)(`span`,{className:`txn-type-badge txn-type-${(t=e.txn_type)==null?void 0:t.toLowerCase()}`,children:e.txn_type})]}),(0,o.jsxs)(`div`,{className:`txn-card-body`,children:[(0,o.jsxs)(`div`,{className:`txn-card-row`,children:[(0,o.jsx)(`span`,{className:`txn-card-label`,children:`Direction:`}),(0,o.jsx)(`span`,{className:`txn-card-value`,children:e.direction})]}),(0,o.jsxs)(`div`,{className:`txn-card-row`,children:[(0,o.jsx)(`span`,{className:`txn-card-label`,children:`Balance After:`}),(0,o.jsx)(`span`,{className:`txn-card-value`,children:Number(e.balance_after).toLocaleString()})]}),(0,o.jsxs)(`div`,{className:`txn-card-amount ${((n=e.direction)==null?void 0:n.toLowerCase())===`in`?`amount-positive`:`amount-negative`}`,children:[((r=e.direction)==null?void 0:r.toLowerCase())===`in`?`+`:`-`,Number(e.amount).toLocaleString(),` AIDLA`]}),(0,o.jsx)(`div`,{className:`txn-card-date`,children:new Date(e.created_at).toLocaleString()})]})]},e.txn_no)})})]})]})}export{s as default};