import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

function Tab({ to, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => (isActive ? "tab-3d active" : "tab-3d")}
    >
      {label}
    </NavLink>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();

  function goBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/admin");
  }

  function switchToUser() {
    navigate("/user");
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  // --- 2060 3D ADMIN LAYOUT CSS ---
  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .admin-layout-wrapper {
      min-height: 100vh;
      background: #f0f4f8; /* Soft white/gray base */
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      overflow-x: hidden;
      position: relative;
    }

    /* Ambient Background Orbs */
    .bg-orb {
      position: fixed; border-radius: 50%; filter: blur(90px);
      z-index: 0; animation: float 20s infinite alternate ease-in-out;
      pointer-events: none;
    }
    .orb-1 { width: 500px; height: 500px; background: rgba(30, 58, 138, 0.12); top: -150px; left: -150px; }
    .orb-2 { width: 400px; height: 400px; background: rgba(59, 130, 246, 0.12); bottom: -100px; right: -100px; animation-duration: 25s; }

    @keyframes float {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(50px, 50px) scale(1.1); }
    }

    /* 3D Glass Header */
    .admin-header-2060 {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 1);
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
      padding: 15px 20px 0 20px;
    }

    .header-top {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
      padding-bottom: 15px;
    }

    .brand-title {
      font-size: 1.8rem;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(2px 2px 4px rgba(30, 58, 138, 0.15));
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }
    
    .brand-title span {
      font-weight: 500;
      color: #64748b;
      -webkit-text-fill-color: #64748b;
      font-size: 1.4rem;
    }

    /* 3D Action Buttons */
    .header-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .action-btn-3d {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      background: #f8fafc;
      color: #1e3a8a;
      font-weight: 700;
      font-size: 0.85rem;
      border: none;
      border-radius: 12px;
      box-shadow: 
        4px 4px 10px rgba(15, 23, 42, 0.06), 
        -4px -4px 10px rgba(255, 255, 255, 1);
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .action-btn-3d:hover { color: #3b82f6; transform: translateY(-2px); box-shadow: 6px 6px 12px rgba(15, 23, 42, 0.08), -6px -6px 12px rgba(255, 255, 255, 1); }
    .action-btn-3d:active { transform: translateY(1px); box-shadow: inset 2px 2px 5px rgba(15,23,42,0.06), inset -2px -2px 5px rgba(255,255,255,1); }
    .action-btn-3d svg { width: 14px; height: 14px; stroke: currentColor; stroke-width: 2.5; fill: none; }

    .btn-logout { color: #ef4444; }
    .btn-logout:hover { color: #dc2626; }

    /* Tabs Container – now wrapping into two rows on desktop */
    .tabs-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      padding: 5px 0 15px 0;
    }
    
    .tabs-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }

    .tab-3d {
      padding: 10px 16px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      color: #64748b;
      background: #f1f5f9;
      box-shadow: 4px 4px 8px rgba(15, 23, 42, 0.05), -4px -4px 8px rgba(255, 255, 255, 1);
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .tab-3d:hover { color: #1e3a8a; transform: translateY(-1px); }
    
    .tab-3d.active {
      background: #e0e7ff;
      color: #1e3a8a;
      font-weight: 800;
      box-shadow: inset 3px 3px 6px rgba(15, 23, 42, 0.08), inset -3px -3px 6px rgba(255, 255, 255, 1);
      transform: translateY(1px);
    }

    /* Main Content Area */
    .admin-main {
      position: relative;
      z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px 20px;
    }

    /* 3D Glass Card wrapper for Outlets */
    .outlet-card-2060 {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 1);
      border-radius: 24px;
      padding: 30px;
      box-shadow: 
        15px 15px 40px rgba(15, 23, 42, 0.05), 
        -15px -15px 40px rgba(255, 255, 255, 0.8),
        inset 0 0 0 1px rgba(255, 255, 255, 0.5);
      animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes popIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Mobile Responsive Adjustments */
    @media (max-width: 768px) {
      .header-top { justify-content: center; text-align: center; gap: 12px; }
      .header-actions { justify-content: center; width: 100%; gap: 8px; }
      
      .action-btn-3d {
        padding: 8px 12px;
        font-size: 0.75rem;
      }
      .action-btn-3d svg {
        width: 12px;
        height: 12px;
      }

      /* Tabs already wrap, but we can tighten spacing */
      .tabs-container {
        gap: 8px;
      }
      .tab-3d {
        padding: 8px 12px;
        font-size: 0.8rem;
      }

      .admin-main { padding: 20px 10px; }
      .outlet-card-2060 { padding: 15px; border-radius: 18px; }
    }
  `;

  return (
    <div className="admin-layout-wrapper">
      <style>{css}</style>
      
      {/* 3D Background Orbs */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <header className="admin-header-2060">
        <div className="header-top">
          <h1 className="brand-title">
            AIDLA <span>Admin</span>
          </h1>

          <div className="header-actions">
            <button onClick={goBack} className="action-btn-3d">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </button>

            <button onClick={switchToUser} className="action-btn-3d">
              <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Switch to User
            </button>

            <button onClick={logout} className="action-btn-3d btn-logout">
              <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-wrapper">
          <nav className="tabs-container">
            <Tab to="/admin" label="Admin Pool" />
            <Tab to="/admin/tests" label="Test Mgmt" />
            <Tab to="/admin/lucky-wheel" label="Lucky Wheel" />
            <Tab to="/admin/lucky-draw" label="Lucky Draw" />
            <Tab to="/admin/shop" label="Shop" />
            <Tab to="/admin/blogs" label="Blogs" />
            <Tab to="/admin/news" label="News" />
            <Tab to="/admin/mining" label="Mining" />
            <Tab to="/admin/invite" label="Invite Friend" />
            <Tab to="/admin/courses" label="Courses" />
            <Tab to="/admin/deposits" label="Deposits" />
            <Tab to="/admin/withdraws" label="Withdraws" />
            <Tab to="/admin/users" label="Users" />
            <Tab to="/admin/leaderboard" label="Leaderboard" />
            <Tab to="/admin/homepage" label=" Post Generator" />
            <Tab to="/admin/AdminHome" label="AdminHome" />
            <Tab to="/admin/adminfaqs" label="FAQs" />
            <Tab to="/admin/feedadmin" label="Feed Admin" />
          </nav>
        </div>
      </header>

      <main className="admin-main">
        {/* Child pages injected here */}
        <div className="outlet-card-2060">
          <Outlet />
        </div>
      </main>
    </div>
  );
}