import { NavLink, Outlet } from "react-router-dom";

function Tab({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => (isActive ? "tab-3d active" : "tab-3d")}
    >
      {label}
    </NavLink>
  );
}

export default function Wallet() {
  const css = `
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
  `;

  return (
    <div className="wallet-wrapper">
      <style>{css}</style>

      <div className="wallet-header">
        <h2 className="wallet-title">My Wallet</h2>
      </div>

      <div className="wallet-tabs">
        <Tab to="/user/wallet" label="Overview" end />
        <Tab to="/user/wallet/transactions" label="Transactions" />
       {/* <Tab to="/user/wallet/deposit" label="Deposit" /> */}

        <Tab to="/user/wallet/withdraw" label="Withdraw" />
        <Tab to="/user/wallet/invite" label="Invite" />
      </div>

      <div className="outlet-container">
        <Outlet />
      </div>
    </div>
  );
}