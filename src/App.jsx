import { Link, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase.js";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Blogs from "./pages/Blogs.jsx";
import News from "./pages/News.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// Layouts
import UserLayout from "./pages/layouts/UserLayout.jsx";
import AdminLayout from "./pages/layouts/AdminLayout.jsx";

// User pages
import UserDashboard from "./pages/user/Dashboard.jsx";
import UserFeed from "./pages/user/Feed.jsx";
import UserWallet from "./pages/user/Wallet.jsx";
import UserProfile from "./pages/user/Profile.jsx";
import UserInvite from "./pages/user/invite.jsx";
import Learning from "./pages/user/Learning.jsx";
import Courses from "./pages/user/Courses.jsx";
import Mining from "./pages/user/Mining.jsx";
import LuckyDraw from "./pages/user/LuckyDraw.jsx";
import LuckyWheel from "./pages/user/LuckyWheel.jsx";
import Shop from "./pages/user/Shop.jsx";
import Bot from "./pages/user/Bot.jsx";
import Social from "./pages/user/Social.jsx";
import Test from "./pages/user/test.jsx";

// Wallet sub pages
import WalletOverview from "./pages/user/wallet/Overview.jsx";
import WalletTransactions from "./pages/user/wallet/Transactions.jsx";
import WalletDeposit from "./pages/user/wallet/Deposit.jsx";
import WalletWithdraw from "./pages/user/wallet/Withdraw.jsx";

// Admin pages
import AdminPool from "./pages/admin/AdminPool.jsx";
import AdminTests from "./pages/admin/AdminTests.jsx";
import AdminLuckyWheel from "./pages/admin/AdminLuckyWheel.jsx";
import AdminLuckyDraw from "./pages/admin/AdminLuckyDraw.jsx";
import AdminShop from "./pages/admin/Shop.jsx";
import AdminBlogs from "./pages/admin/Blogs.jsx";
import AdminNews from "./pages/admin/News.jsx";
import AdminMining from "./pages/admin/Mining.jsx";
import AdminInvite from "./pages/admin/Invite.jsx";
import AdminCourses from "./pages/admin/Courses.jsx";
import AdminDeposits from "./pages/admin/Deposits.jsx";
import AdminWithdraws from "./pages/admin/Withdraws.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminLeaderboard from "./pages/admin/Leaderboard.jsx";
import AdminHomepage from "./pages/admin/Homepage.jsx";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

// Enhanced Public Header
function PublicHeader() {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality later
    console.log("Searching for:", search);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(203,213,225,0.3)",
        padding: "12px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontSize: "1.8rem",
            fontWeight: 900,
            background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AIDLA
        </Link>

        {/* Navigation */}
        <nav style={{ display: "flex", gap: 24, fontWeight: 600 }}>
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/blogs", label: "Blogs" },
            { to: "/news", label: "News" },
            { to: "/leaderboard", label: "Leaderboard" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                textDecoration: "none",
                color: "#334155",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Weather, Search, Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Weather widget */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#f1f5f9",
              padding: "6px 12px",
              borderRadius: 30,
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>☀️</span>
            <span style={{ fontWeight: 600 }}>24°C Sunny</span>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px 16px 8px 40px",
                borderRadius: 30,
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                width: 200,
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 12,
                top: 8,
                color: "#94a3b8",
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
          </form>

          {/* Auth buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <Link
              to="/signup"
              style={{
                padding: "8px 16px",
                borderRadius: 30,
                border: "none",
                background: "transparent",
                fontWeight: 600,
                color: "#334155",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
            >
              Signup
            </Link>
            <Link
              to="/login"
              style={{
                padding: "8px 24px",
                borderRadius: 30,
                border: "none",
                background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 4px 10px rgba(59,130,246,0.3)",
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const location = useLocation();

  // hide public header on user/admin areas
  const hidePublicHeader = location.pathname.startsWith("/user") || location.pathname.startsWith("/admin");

  const AppRoutes = (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/news" element={<News />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* USER AREA */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="feed" element={<UserFeed />} />
        <Route path="test" element={<Test />} />

        <Route path="wallet" element={<UserWallet />}>
          <Route index element={<WalletOverview />} />
          <Route path="transactions" element={<WalletTransactions />} />
          <Route path="deposit" element={<WalletDeposit />} />
          <Route path="withdraw" element={<WalletWithdraw />} />
          <Route path="invite" element={<UserInvite />} />
        </Route>

        <Route path="profile" element={<UserProfile />} />
        <Route path="learning" element={<Learning />} />
        <Route path="courses" element={<Courses />} />
        <Route path="mining" element={<Mining />} />
        <Route path="lucky-draw" element={<LuckyDraw />} />
        <Route path="lucky-wheel" element={<LuckyWheel />} />
        <Route path="shop" element={<Shop />} />
        <Route path="bot" element={<Bot />} />
        <Route path="social" element={<Social />} />
      </Route>

      {/* ADMIN AREA */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminPool />} />
        <Route path="tests" element={<AdminTests />} />
        <Route path="lucky-wheel" element={<AdminLuckyWheel />} />
        <Route path="lucky-draw" element={<AdminLuckyDraw />} />
        <Route path="shop" element={<AdminShop />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="mining" element={<AdminMining />} />
        <Route path="invite" element={<AdminInvite />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="deposits" element={<AdminDeposits />} />
        <Route path="withdraws" element={<AdminWithdraws />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="leaderboard" element={<AdminLeaderboard />} />
        <Route path="homepage" element={<AdminHomepage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return (
    <div>
      {!hidePublicHeader && <PublicHeader />}

      {/* Public pages get container, user/admin layouts already have their own container */}
      {!hidePublicHeader ? (
        <main className="container">
          <div className="card page">{AppRoutes}</div>
        </main>
      ) : (
        AppRoutes
      )}
    </div>
  );
}