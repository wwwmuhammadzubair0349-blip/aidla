import"./vendor-helmet-D-cMCI9i.js";import"./vendor-misc-DjQaoctO.js";import{a as e,r as t}from"./vendor-router-BeHthcJc.js";import{r as n}from"./vendor-motion-DyarDpDD.js";var r=n();function i({to:e,label:n,end:i}){return(0,r.jsx)(t,{to:e,end:i,className:({isActive:e})=>e?`tab-3d active`:`tab-3d`,children:n})}function a(){return(0,r.jsxs)(`div`,{className:`wallet-wrapper`,children:[(0,r.jsx)(`style`,{children:`
    * { box-sizing: border-box; }

    .wallet-wrapper {
      animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .wallet-header {
      margin-bottom: 25px;
    }

    .wallet-title {
      font-size: 2.2rem;
      font-weight: 900;
      letter-spacing: -1px;
      color: #1e3a8a;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(30, 58, 138, 0.1);
    }

    .wallet-tabs {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      margin-bottom: 25px;
      background: rgba(255, 255, 255, 0.5);
      padding: 8px;
      border-radius: 18px;
      box-shadow: inset 2px 2px 5px rgba(15, 23, 42, 0.02);
    }

    .tab-3d {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 12px 15px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
      color: #64748b;
      background: #f8fafc;
      box-shadow: 4px 4px 8px rgba(15, 23, 42, 0.05), -4px -4px 8px rgba(255, 255, 255, 1);
      transition: all 0.2s ease;
      white-space: nowrap;
      user-select: none;
    }
    .tab-3d:hover {
      color: #1e3a8a;
      transform: translateY(-2px);
    }
    .tab-3d.active {
      background: #e0e7ff;
      color: #1e3a8a;
      font-weight: 800;
      box-shadow: inset 3px 3px 6px rgba(15, 23, 42, 0.08), inset -3px -3px 6px rgba(255, 255, 255, 1);
      transform: translateY(1px);
    }

    .outlet-container {
      position: relative;
      animation: fadeIn 0.3s ease forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .wallet-tabs {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .wallet-header {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
        gap: 15px;
      }
      .btn-invite {
        width: 100%;
      }
      .wallet-tabs {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        padding: 5px;
      }
      .tab-3d {
        padding: 10px;
        font-size: 0.85rem;
      }
    }
  `}),(0,r.jsx)(`div`,{className:`wallet-header`,children:(0,r.jsx)(`h2`,{className:`wallet-title`,children:`My Wallet`})}),(0,r.jsxs)(`div`,{className:`wallet-tabs`,children:[(0,r.jsx)(i,{to:`/user/wallet`,label:`Overview`,end:!0}),(0,r.jsx)(i,{to:`/user/wallet/transactions`,label:`Transactions`}),(0,r.jsx)(i,{to:`/user/wallet/withdraw`,label:`Withdraw`}),(0,r.jsx)(i,{to:`/user/wallet/invite`,label:`Invite`})]}),(0,r.jsx)(`div`,{className:`outlet-container`,children:(0,r.jsx)(e,{})})]})}export{a as default};