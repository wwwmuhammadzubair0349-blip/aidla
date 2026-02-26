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

// ✅ Layouts (correct paths)
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

function PublicHeader() {
  return (
    <div className="header">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div style={{ fontWeight: 800, letterSpacing: 0.4 }}>AIDLA</div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>Public Area</div>
        </div>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/news">News</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/login">Login</Link>
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  // hide public header on user/admin areas
  const hidePublicHeader = location.pathname.startsWith("/user") || location.pathname.startsWith("/admin");

  // ✅ One single routes tree used for both cases (no missing routes)
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

        {/* ✅ Wallet nested routes (THIS FIXES YOUR ISSUE) */}
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