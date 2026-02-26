import { useNavigate } from "react-router-dom";

function CardLink({ title, subtitle, to, icon, isSoon }) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(to)} className="card-3d">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-subtitle">{subtitle}</div>
      </div>
      {isSoon && <span className="badge-soon">Coming Soon</span>}
    </button>
  );
}

export default function Dashboard() {
  const css = `
    .dashboard-container {
      animation: fadeIn 0.4s ease-out;
    }

    .dashboard-header {
      margin-bottom: 24px;
    }

    .dashboard-title {
      font-size: 1.8rem;
      font-weight: 900;
      color: #1e3a8a;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }

    .dashboard-subtitle {
      color: #64748b;
      font-size: 0.95rem;
      font-weight: 500;
    }

    /* Universal Responsive Grid */
    .cards-grid {
      display: grid;
      /* Adapts from 1 column on small phones to multiple on desktops */
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    @media (max-width: 768px) {
      .cards-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    }

    /* 3D Neumorphic Card Styles */
    .card-3d {
      background: #f8fafc;
      border: none;
      border-radius: 20px;
      padding: 24px 20px;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      box-shadow: 6px 6px 14px rgba(15, 23, 42, 0.05), -6px -6px 14px rgba(255, 255, 255, 1);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
      width: 100%;
    }

    .card-3d:hover {
      transform: translateY(-5px);
      box-shadow: 10px 10px 20px rgba(15, 23, 42, 0.08), -10px -10px 20px rgba(255, 255, 255, 1);
    }

    .card-3d:active {
      transform: translateY(1px);
      box-shadow: inset 4px 4px 10px rgba(15, 23, 42, 0.06), inset -4px -4px 10px rgba(255, 255, 255, 1);
    }

    /* Icon Container */
    .card-icon {
      font-size: 1.8rem;
      background: #e0e7ff;
      min-width: 54px;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 1), 2px 2px 5px rgba(15, 23, 42, 0.05);
    }

    .card-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 4px;
    }

    .card-title {
      font-weight: 800;
      font-size: 1.1rem;
      color: #0f172a;
      margin-bottom: 6px;
    }

    .card-subtitle {
      color: #64748b;
      font-size: 0.85rem;
      line-height: 1.4;
      padding-right: 10px;
    }

    /* Neumorphic "Coming Soon" Badge */
    .badge-soon {
      position: absolute;
      top: 14px;
      right: 14px;
      background: #f1f5f9;
      color: #94a3b8;
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      padding: 5px 10px;
      border-radius: 20px;
      box-shadow: inset 2px 2px 4px rgba(15,23,42,0.04), inset -2px -2px 4px rgba(255,255,255,1);
      letter-spacing: 0.5px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Mobile Adjustments */
    @media (max-width: 600px) {
      .cards-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      .dashboard-header {
        margin-bottom: 16px;
      }
      .dashboard-title {
        font-size: 1.5rem;
        margin-bottom: 4px;
      }
      .dashboard-subtitle {
        font-size: 0.85rem;
      }
      .card-3d {
        padding: 12px 10px;
        gap: 8px;
        border-radius: 14px;
      }
      .card-icon {
        min-width: 38px;
        height: 38px;
        font-size: 1.2rem;
        border-radius: 10px;
      }
      .card-content {
        margin-top: 0px;
      }
      .card-title {
        font-size: 0.85rem;
        margin-bottom: 3px;
        font-weight: 700;
      }
      .card-subtitle {
        font-size: 0.65rem;
        line-height: 1.2;
        padding-right: 0px;
      }
    }
  `;

  return (
    <div className="dashboard-container">
      <style>{css}</style>

      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">
          Welcome to your AIDLA user area. Use the modules below to explore features.
        </p>
      </div>

      <div className="cards-grid">
        <CardLink 
          title="Test" 
          subtitle="Testing & assessments" 
          to="/user/test" 
          icon="✅" 
          isSoon={false} 
        />
        <CardLink 
          title="Learning" 
          subtitle="Guides & learning resources" 
          to="/user/learning" 
          icon="📖" 
          isSoon={false} 
        />
        <CardLink 
          title="Courses" 
          subtitle="Paid & free specialized courses" 
          to="/user/courses" 
          icon="🎓" 
          isSoon={false} 
        />
        <CardLink 
          title="Mining" 
          subtitle="Start mining AIDLA coins" 
          to="/user/mining" 
          icon="💎" 
          isSoon={false} 
        />
        <CardLink 
          title="Lucky Draw" 
          subtitle="Scheduled draws & big prizes" 
          to="/user/lucky-draw" 
          icon="🎟️" 
          isSoon={false} 
        />
        <CardLink 
          title="Lucky Wheel" 
          subtitle="Spin the wheel & win rewards" 
          to="/user/lucky-wheel" 
          icon="🎡" 
          isSoon={false} 
        />
        <CardLink 
          title="Shop" 
          subtitle="Buy products with AIDLA coins" 
          to="/user/shop" 
          icon="🛍️" 
          isSoon={false} 
        />
        <CardLink 
          title="AIDLA Bot" 
          subtitle="Ask anything about AIDLA" 
          to="/user/bot" 
          icon="🤖" 
          isSoon={false} 
        />
        <CardLink 
          title="Follow Us" 
          subtitle="Join our social media channels" 
          to="/user/social" 
          icon="📱" 
          isSoon={false} 
        />
      </div>
    </div>
  );
}