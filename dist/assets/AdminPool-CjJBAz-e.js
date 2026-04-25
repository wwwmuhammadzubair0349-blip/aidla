import{a as e}from"./rolldown-runtime-COnpUsM8.js";import{l as t}from"./vendor-helmet-D-cMCI9i.js";import{tr as n}from"./vendor-misc-DjQaoctO.js";import"./vendor-supabase-DTLzbyhy.js";import{t as r}from"./supabase-CXCPPx9q.js";import{r as i}from"./vendor-motion-DyarDpDD.js";var a=e(t(),1),o=i();function s(){let[e,t]=(0,a.useState)(`transfer`),[i,s]=(0,a.useState)(null),[c,l]=(0,a.useState)(``),[u,d]=(0,a.useState)(null),[f,p]=(0,a.useState)(``),[m,h]=(0,a.useState)(``),[g,_]=(0,a.useState)(!1),[v,y]=(0,a.useState)(!1),[b,x]=(0,a.useState)(``),[S,C]=(0,a.useState)([]),[w,T]=(0,a.useState)(!1);function E(){return D.apply(this,arguments)}function D(){return D=n(function*(){var e;let{data:t,error:n}=yield r.from(`admin_pool`).select(`total_aidla_coins`).eq(`id`,1).single();n||s((e=t==null?void 0:t.total_aidla_coins)==null?null:e)}),D.apply(this,arguments)}function O(){return k.apply(this,arguments)}function k(){return k=n(function*(){T(!0);let{data:e,error:t}=yield r.from(`admin_pool_transactions`).select(`*`).order(`created_at`,{ascending:!1});!t&&e&&C(e),T(!1)}),k.apply(this,arguments)}(0,a.useEffect)(()=>{E(),O()},[]);function A(){return j.apply(this,arguments)}function j(){return j=n(function*(){x(``),d(null),_(!0);try{let e=c.trim().toLowerCase();if(!e)throw Error(`Enter user email`);let{data:t,error:n}=yield r.from(`users_profiles`).select(`full_name,email,total_aidla_coins,user_id`).eq(`email`,e).single();if(n)throw n.code===`PGRST116`?Error(`❌ No account found on this email. User not available.`):n;d(t)}catch(e){x(e.message||`User not available on this email`)}finally{_(!1)}}),j.apply(this,arguments)}function M(e){return N.apply(this,arguments)}function N(){return N=n(function*(e){x(``),y(!0);try{if(!(u!=null&&u.email))throw Error(`Find a user first`);let t=Number(f);if(!t||t<=0)throw Error(`Enter a valid amount`);let{data:n,error:i}=yield r.rpc(`admin_transfer_coins`,{target_email:u.email,amount:t,mode:e,note:m||null});if(i)throw i;x(`Success ✅ Transaction: ${(Array.isArray(n)?n[0]:n).txn_no}`),p(``),h(``),yield E(),yield A(),yield O()}catch(e){x(e.message||`Transfer failed`)}finally{y(!1)}}),N.apply(this,arguments)}function P(e){return new Date(e).toLocaleString(void 0,{year:`numeric`,month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`})}return(0,o.jsxs)(`div`,{className:`admin-pool-wrapper`,children:[(0,o.jsx)(`style`,{children:`
    * { box-sizing: border-box; }

    .admin-pool-wrapper {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      animation: fadeIn 0.4s ease forwards;
    }

    .page-title {
      font-size: 2.2rem;
      font-weight: 900;
      letter-spacing: -1px;
      color: #1e3a8a;
      margin-bottom: 25px;
      margin-top: 0;
      text-shadow: 2px 2px 4px rgba(30, 58, 138, 0.1);
    }

    /* Inner Tabs System */
    .tab-container {
      display: flex; gap: 10px; margin-bottom: 30px; flex-wrap: wrap;
    }
    .pill-tab {
      padding: 12px 20px; border-radius: 14px; font-weight: 700; font-size: 0.95rem;
      cursor: pointer; transition: all 0.2s ease; border: none; outline: none;
      background: #f1f5f9; color: #64748b;
      box-shadow: 4px 4px 8px rgba(15, 23, 42, 0.05), -4px -4px 8px rgba(255, 255, 255, 1);
    }
    .pill-tab:hover { color: #1e3a8a; transform: translateY(-2px); }
    .pill-tab.active {
      background: #e0e7ff; color: #1e3a8a; font-weight: 800;
      box-shadow: inset 3px 3px 6px rgba(15, 23, 42, 0.08), inset -3px -3px 6px rgba(255, 255, 255, 1);
      transform: translateY(1px);
    }

    /* 3D Glass Cards */
    .grid-layout { display: grid; gap: 25px; grid-template-columns: 1fr; }
    
    .card-2060 {
      background: #ffffff;
      border-radius: 20px;
      padding: 25px;
      box-shadow: 
        10px 10px 25px rgba(15, 23, 42, 0.05), 
        -10px -10px 25px rgba(255, 255, 255, 0.9),
        inset 0 0 0 1px rgba(255, 255, 255, 1);
    }

    .section-title { font-weight: 800; font-size: 1.1rem; color: #1e3a8a; margin-bottom: 15px; }

    /* Pool Balance Highlight */
    .balance-highlight {
      font-size: 2.8rem; font-weight: 900; color: #3b82f6;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      margin-top: 5px; filter: drop-shadow(1px 2px 3px rgba(30,58,138,0.2));
    }

    /* 3D Inputs */
    .input-3d {
      width: 100%; padding: 14px 16px; border-radius: 14px; border: 2px solid transparent;
      background: #f8fafc; color: #0f172a; font-size: 1rem; font-weight: 600;
      box-shadow: inset 4px 4px 8px rgba(15, 23, 42, 0.06), inset -4px -4px 8px rgba(255, 255, 255, 1);
      transition: all 0.2s ease; font-family: inherit; margin-bottom: 15px;
    }
    .input-3d::placeholder { color: #94a3b8; font-weight: 500; }
    .input-3d:focus { outline: none; background: #ffffff; border-color: rgba(59, 130, 246, 0.3); box-shadow: inset 2px 2px 5px rgba(15, 23, 42, 0.03), inset -2px -2px 5px rgba(255, 255, 255, 1), 0 0 0 4px rgba(59, 130, 246, 0.1); }

    /* Buttons */
    .btn-3d {
      padding: 14px 24px; border-radius: 12px; border: none; font-size: 1rem; font-weight: 700; cursor: pointer;
      box-shadow: 0 6px 0 #1e3a8a, 0 10px 15px rgba(30, 58, 138, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.2);
      transition: all 0.1s ease; display: inline-flex; justify-content: center; align-items: center; gap: 8px;
    }
    .btn-3d:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 0 #1e3a8a, 0 15px 20px rgba(30, 58, 138, 0.3), inset 0 2px 0 rgba(255,255,255,0.2); }
    .btn-3d:active:not(:disabled) { transform: translateY(6px); box-shadow: 0 0px 0 #1e3a8a, 0 2px 5px rgba(30, 58, 138, 0.3), inset 0 2px 0 rgba(255,255,255,0.2); }
    .btn-3d:disabled { background: #94a3b8; box-shadow: 0 6px 0 #64748b; cursor: not-allowed; opacity: 0.8; transform: translateY(0); }

    .btn-primary { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: #fff; }
    .btn-secondary { background: linear-gradient(135deg, #475569, #64748b); color: #fff; box-shadow: 0 6px 0 #334155, 0 10px 15px rgba(15, 23, 42, 0.2); }
    .btn-secondary:hover:not(:disabled) { box-shadow: 0 8px 0 #334155, 0 15px 20px rgba(15, 23, 42, 0.3); }
    .btn-secondary:active:not(:disabled) { box-shadow: 0 0px 0 #334155, 0 2px 5px rgba(15, 23, 42, 0.3); }

    /* Flex Row Groups */
    .input-row { display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 15px; }
    .input-row > input { margin-bottom: 0; flex: 1; min-width: 200px; }

    /* User Found Card */
    .user-card {
      margin-top: 15px; padding: 15px 20px; border-radius: 14px;
      background: #f8fafc; border: 1px solid #e2e8f0;
      box-shadow: inset 2px 2px 5px rgba(15, 23, 42, 0.03);
    }
    .user-card div { margin-bottom: 8px; font-size: 0.95rem; }
    .user-card b { color: #1e3a8a; display: inline-block; width: 70px; }

    /* Messages */
    .msg-box { margin-top: 15px; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; width: 100%; text-align: center; }

    /* Transactions Table */
    .table-container {
      width: 100%; overflow-x: auto; border-radius: 16px;
      box-shadow: inset 4px 4px 8px rgba(15, 23, 42, 0.05), inset -4px -4px 8px rgba(255, 255, 255, 1);
      background: #f8fafc; padding: 2px;
      -webkit-overflow-scrolling: touch;
    }
    .table-2060 { width: 100%; border-collapse: collapse; min-width: 900px; font-size: 0.85rem; }
    @media (max-width: 768px) {
      .table-2060 { font-size: 0.8rem; }
      .table-2060 th, .table-2060 td { padding: 10px 12px; }
    }
    @media (max-width: 600px) {
      .table-container { border-radius: 12px; padding: 1px; }
      .table-2060 { font-size: 0.75rem; min-width: 800px; }
      .table-2060 th, .table-2060 td { padding: 8px 10px; }
    }
    .table-2060 th { background: #e2e8f0; color: #1e3a8a; font-weight: 800; text-align: left; padding: 14px 16px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #cbd5e1; }
    .table-2060 td { padding: 14px 16px; border-bottom: 1px solid #e2e8f0; color: #334155; font-weight: 500; }
    .table-2060 tr:last-child td { border-bottom: none; }
    .table-2060 tr:hover td { background: rgba(59, 130, 246, 0.05); }

    /* Badges */
    .badge { padding: 6px 10px; border-radius: 8px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
    .badge-send { background: #fee2e2; color: #b91c1c; box-shadow: inset 1px 1px 3px rgba(185, 28, 28, 0.2); }
    .badge-receive { background: #dcfce7; color: #15803d; box-shadow: inset 1px 1px 3px rgba(21, 128, 61, 0.2); }
    .amount-text { font-weight: 800; font-size: 0.95rem; color: #0f172a; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `}),(0,o.jsx)(`h2`,{className:`page-title`,children:`Admin Pool & Logistics`}),(0,o.jsxs)(`div`,{className:`tab-container`,children:[(0,o.jsxs)(`button`,{className:`pill-tab ${e===`transfer`?`active`:``}`,onClick:()=>t(`transfer`),children:[(0,o.jsxs)(`svg`,{style:{width:16,height:16,marginRight:6,verticalAlign:`-3px`},viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,children:[(0,o.jsx)(`path`,{d:`M17 3v18`}),(0,o.jsx)(`path`,{d:`M10 14 3 21l7 7`}),(0,o.jsx)(`path`,{d:`M7 3v18`}),(0,o.jsx)(`path`,{d:`M14 10l7-7-7-7`})]}),`Transfers & Dashboard`]}),(0,o.jsxs)(`button`,{className:`pill-tab ${e===`history`?`active`:``}`,onClick:()=>t(`history`),children:[(0,o.jsxs)(`svg`,{style:{width:16,height:16,marginRight:6,verticalAlign:`-3px`},viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,children:[(0,o.jsx)(`circle`,{cx:`12`,cy:`12`,r:`10`}),(0,o.jsx)(`polyline`,{points:`12 6 12 12 16 14`})]}),`Transaction History`]})]}),e===`transfer`&&(0,o.jsxs)(`div`,{className:`grid-layout`,children:[(0,o.jsxs)(`div`,{className:`card-2060`,style:{textAlign:`center`,padding:`35px 20px`},children:[(0,o.jsx)(`div`,{style:{color:`#64748b`,fontSize:`1rem`,fontWeight:700,textTransform:`uppercase`,letterSpacing:`1px`},children:`Total Admin Pool Balance`}),(0,o.jsx)(`div`,{className:`balance-highlight`,children:i===null?`Loading...`:`${Number(i).toLocaleString()} AIDLA`})]}),(0,o.jsxs)(`div`,{className:`card-2060`,children:[(0,o.jsx)(`div`,{className:`section-title`,children:`Step 1: Locate Target User`}),(0,o.jsxs)(`div`,{className:`input-row`,children:[(0,o.jsx)(`input`,{className:`input-3d`,value:c,onChange:e=>l(e.target.value),placeholder:`Enter user email (e.g. name@example.com)`}),(0,o.jsx)(`button`,{className:`btn-3d btn-primary`,onClick:A,disabled:g,children:g?`Searching...`:`🔍 Search User`})]}),u&&(0,o.jsxs)(`div`,{className:`user-card`,children:[(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`b`,{children:`Name:`}),` `,u.full_name]}),(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`b`,{children:`Email:`}),` `,u.email]}),(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`b`,{children:`Balance:`}),` `,(0,o.jsxs)(`span`,{style:{fontWeight:800,color:`#1e3a8a`},children:[Number(u.total_aidla_coins).toLocaleString(),` AIDLA`]})]})]})]}),(0,o.jsxs)(`div`,{className:`card-2060`,children:[(0,o.jsx)(`div`,{className:`section-title`,children:`Step 2: Execute Transaction`}),(0,o.jsxs)(`div`,{className:`input-row`,children:[(0,o.jsx)(`input`,{className:`input-3d`,type:`number`,value:f,onChange:e=>p(e.target.value),placeholder:`Amount to transfer (e.g. 1500)`}),(0,o.jsx)(`input`,{className:`input-3d`,value:m,onChange:e=>h(e.target.value),placeholder:`Reference Note (Optional)`})]}),(0,o.jsxs)(`div`,{className:`input-row`,style:{marginTop:`20px`},children:[(0,o.jsxs)(`button`,{className:`btn-3d btn-primary`,onClick:()=>M(`SEND`),disabled:v||!u,children:[(0,o.jsxs)(`svg`,{style:{width:18,height:18},viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,o.jsx)(`line`,{x1:`22`,y1:`2`,x2:`11`,y2:`13`}),(0,o.jsx)(`polygon`,{points:`22 2 15 22 11 13 2 9 22 2`})]}),`Send to User`]}),(0,o.jsxs)(`button`,{className:`btn-3d btn-secondary`,onClick:()=>M(`RECEIVE`),disabled:v||!u,children:[(0,o.jsxs)(`svg`,{style:{width:18,height:18},viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2.5`,strokeLinecap:`round`,strokeLinejoin:`round`,children:[(0,o.jsx)(`polyline`,{points:`15 10 20 15 15 20`}),(0,o.jsx)(`path`,{d:`M4 4v7a4 4 0 0 0 4 4h12`})]}),`Receive from User`]})]}),b&&(0,o.jsx)(`div`,{className:`msg-box`,style:{color:b.includes(`✅`)?`#047857`:`#b91c1c`,background:b.includes(`✅`)?`#d1fae5`:`#fee2e2`,boxShadow:b.includes(`✅`)?`inset 0 0 0 2px #34d399`:`inset 0 0 0 2px #f87171`},children:b})]})]}),e===`history`&&(0,o.jsxs)(`div`,{className:`card-2060`,children:[(0,o.jsx)(`div`,{className:`section-title`,style:{marginBottom:`20px`},children:`Transaction Ledger`}),w?(0,o.jsx)(`div`,{style:{padding:`40px`,textAlign:`center`,fontWeight:600,color:`#64748b`},children:`Loading transactions...`}):S.length===0?(0,o.jsx)(`div`,{style:{padding:`40px`,textAlign:`center`,fontWeight:600,color:`#64748b`},children:`No transactions found in the database.`}):(0,o.jsx)(`div`,{className:`table-container`,children:(0,o.jsxs)(`table`,{className:`table-2060`,children:[(0,o.jsx)(`thead`,{children:(0,o.jsxs)(`tr`,{children:[(0,o.jsx)(`th`,{children:`Date`}),(0,o.jsx)(`th`,{children:`Txn ID`}),(0,o.jsx)(`th`,{children:`Action`}),(0,o.jsx)(`th`,{children:`User Email`}),(0,o.jsx)(`th`,{children:`Amount`}),(0,o.jsx)(`th`,{children:`Pool Bal After`}),(0,o.jsx)(`th`,{children:`User Bal After`}),(0,o.jsx)(`th`,{children:`Note`})]})}),(0,o.jsx)(`tbody`,{children:S.map(e=>{let t=typeof e.txn_type==`string`&&e.txn_type.toUpperCase().includes(`SEND`);return(0,o.jsxs)(`tr`,{children:[(0,o.jsx)(`td`,{style:{whiteSpace:`nowrap`},children:P(e.created_at)}),(0,o.jsx)(`td`,{style:{fontFamily:`monospace`,fontSize:`0.8rem`,color:`#64748b`},children:e.txn_no}),(0,o.jsx)(`td`,{children:(0,o.jsx)(`span`,{className:`badge ${t?`badge-send`:`badge-receive`}`,children:t?`Send`:`Received`})}),(0,o.jsxs)(`td`,{children:[(0,o.jsx)(`div`,{style:{fontWeight:700,color:`#1e3a8a`},children:e.target_user_name||`Unknown`}),(0,o.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`#64748b`},children:e.target_user_email})]}),(0,o.jsxs)(`td`,{className:`amount-text`,style:{color:t?`#b91c1c`:`#15803d`,fontWeight:800},children:[t?`-`:`+`,Number(e.amount).toLocaleString(),` AIDLA`]}),(0,o.jsx)(`td`,{children:Number(e.pool_balance_after).toLocaleString()}),(0,o.jsx)(`td`,{children:e.user_balance_after===null?`-`:Number(e.user_balance_after).toLocaleString()}),(0,o.jsx)(`td`,{style:{fontStyle:e.note?`normal`:`italic`,color:e.note?`inherit`:`#94a3b8`},children:e.note||`No note`})]},e.id)})})]})})]})]})}export{s as default};