import { Link, Route, Routes, Navigate, useLocation, NavLink } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { supabase } from "./lib/supabase.js";
import { registerPushToken, listenForNotifications } from "./lib/notifications";


// ─────────────────────────────────────────────────────────────
//  LAZY IMPORTS
//  FIX — EmailConfirmed was a static import (bloated initial bundle).
//  Now lazy like every other page.
// ─────────────────────────────────────────────────────────────
import SchemaMarkup from "./pages/components/SchemaMarkup.jsx";
const Home             = lazy(() => import("./pages/Home.jsx"));
const About            = lazy(() => import("./pages/About.jsx"));
const Blogs            = lazy(() => import("./pages/Blogs.jsx"));
const BlogPost         = lazy(() => import("./pages/BlogPost.jsx"));
const News             = lazy(() => import("./pages/News.jsx"));
const NewsPost         = lazy(() => import("./pages/NewsPost.jsx"));
const Leaderboard      = lazy(() => import("./pages/Leaderboard.jsx"));
const Contact          = lazy(() => import("./pages/contact.jsx"));
const PrivacyPolicy    = lazy(() => import("./pages/privacy-policy.jsx"));
const Terms            = lazy(() => import("./pages/terms.jsx"));
const FAQs             = lazy(() => import("./pages/faqs.jsx"));
const FAQPage          = lazy(() => import("./pages/FAQPage.jsx"));
const EmailConfirmed   = lazy(() => import("./pages/EmailConfirmed")); // FIX: was static import
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate.jsx"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage.jsx"));
const ResourceDetailPage = lazy(() => import("./pages/ResourceDetailPage.jsx"));
const AutoTubePublic = lazy(() => import("./pages/AutoTubePublic.jsx"));
const PDFCompressor    = lazy(() => import("./pages/tools/pdf/PDFCompressor.jsx"));
const BackgroundRemover= lazy(() => import("./pages/tools/image/BackgroundRemover.jsx"));
const EmailWriter        = lazy(() => import("./pages/tools/ai/Emailwriter.jsx"));

const PublicCourses      = lazy(() => import("./pages/PublicCourses.jsx"));
const PublicCourseDetail = lazy(() => import("./pages/PublicCourseDetail.jsx"));
// AI Tools
const InterviewPrep     = lazy(() => import("./pages/tools/ai/interview-prep/interview-prep.jsx"));
const LinkedInBio       = lazy(() => import("./pages/tools/ai/linkedin-bio/linkedin-bio.jsx"));
 
// Education Tools
const PercentageCalculator  = lazy(() => import("./pages/tools/education/percentage-calculator/percentage-calculator.jsx"));
const GradeCalculator       = lazy(() => import("./pages/tools/education/grade-calculator/grade-calculator.jsx"));
const AttendanceCalc        = lazy(() => import("./pages/tools/education/attendance-calculator/attendance-calculator.jsx"));
const MarksToGrade          = lazy(() => import("./pages/tools/education/marks-to-grade/marks-to-grade.jsx"));
const StudyPlanner          = lazy(() => import("./pages/tools/education/study-planner/study-planner.jsx"));
const PomodoroTimer         = lazy(() => import("./pages/tools/education/pomodoro-timer/pomodoro-timer.jsx"));
const AssignmentTracker     = lazy(() => import("./pages/tools/education/assignment-tracker/assignment-tracker.jsx"));
const FlashcardMaker        = lazy(() => import("./pages/tools/education/flashcard-maker/flashcard-maker.jsx"));
const ScholarshipCheck      = lazy(() => import("./pages/tools/education/scholarship-eligibility/scholarship-eligibility.jsx"));
 
// Finance Tools
const SalaryCalculator  = lazy(() => import("./pages/tools/finance/salary-calculator/salary-calculator.jsx"));
const ZakatCalculator   = lazy(() => import("./pages/tools/finance/zakat-calculator/zakat-calculator.jsx"));
const LoanEMICalculator = lazy(() => import("./pages/tools/finance/loan-emi-calculator/loan-emi-calculator.jsx"));
const TipCalculator     = lazy(() => import("./pages/tools/finance/tip-calculator/tip-calculator.jsx"));
 
// Health Tools
const BMICalculator     = lazy(() => import("./pages/tools/health/bmi-calculator/bmi-calculator.jsx"));
const CalorieCalculator = lazy(() => import("./pages/tools/health/calorie-calculator/calorie-calculator.jsx"));
const WaterIntakeCalc   = lazy(() => import("./pages/tools/health/water-intake-calculator/water-intake-calculator.jsx"));
const SleepCalculator   = lazy(() => import("./pages/tools/health/sleep-calculator/sleep-calculator.jsx"));
 
// Utility Tools
const PasswordGenerator = lazy(() => import("./pages/tools/utility/password-generator/password-generator.jsx"));
const UnitConverter     = lazy(() => import("./pages/tools/utility/unit-converter/unit-converter.jsx"));
const CountdownTimer    = lazy(() => import("./pages/tools/utility/countdown-timer/countdown-timer.jsx"));
const PercentageChange  = lazy(() => import("./pages/tools/utility/percentage-change/percentage-change.jsx"));
const RomanNumeral      = lazy(() => import("./pages/tools/utility/roman-numeral-converter/roman-numeral-converter.jsx"));
const BinaryConverter   = lazy(() => import("./pages/tools/utility/binary-converter/binary-converter.jsx"));
const ColorPicker       = lazy(() => import("./pages/tools/utility/color-picker/color-picker.jsx"));
const TextCaseConverter = lazy(() => import("./pages/tools/utility/text-case-converter/text-case-converter.jsx"));

// Footer stays static — it's used in UserLayout/AdminLayout too, tiny file
import Footer from "./pages/components/footer.jsx";
import CoursePlayer from "./pages/user/CoursePlayer.jsx";

// Tools
const ToolsHome          = lazy(() => import("./pages/tools/toolshome.jsx"));
const WordToPdf          = lazy(() => import("./pages/tools/pdf/WordToPdf"));
const ImageToPdf         = lazy(() => import("./pages/tools/pdf/ImageToPdf"));
const JpgToPng           = lazy(() => import("./pages/tools/image/JpgToPng"));
const CvMaker            = lazy(() => import("./pages/tools/career/CvMaker"));
const CoverLetterMaker   = lazy(() => import("./pages/tools/career/CoverLetterMaker"));
const ResultsHub = lazy(() => import("./pages/tools/ResultsHub.jsx"));
const BoardPage  = lazy(() => import("./pages/tools/BoardPage.jsx"));
const QRCodeGenerator  = lazy(() => import("./pages/tools/utility/QRCodeGenerator.jsx"));
const AgeCalculator    = lazy(() => import("./pages/tools/utility/AgeCalculator.jsx"));
const WordCounter      = lazy(() => import("./pages/tools/utility/WordCounter.jsx"));
const CGPACalculator   = lazy(() => import("./pages/tools/education/CGPACalculator.jsx"));
const MDCATCalculator  = lazy(() => import("./pages/tools/education/MDCATCalculator.jsx"));
const AISummarizer     = lazy(() => import("./pages/tools/ai/AISummarizer.jsx"));
const AIParaphraser    = lazy(() => import("./pages/tools/ai/AIParaphraser.jsx"));

// Auth
const Login              = lazy(() => import("./pages/Login.jsx"));
const Signup             = lazy(() => import("./pages/Signup.jsx"));
const ForgotPassword     = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword      = lazy(() => import("./pages/ResetPassword.jsx"));

// Layouts
const UserLayout         = lazy(() => import("./pages/layouts/UserLayout.jsx"));
const AdminLayout        = lazy(() => import("./pages/layouts/AdminLayout.jsx"));

// User pages
const UserDashboard      = lazy(() => import("./pages/user/Dashboard.jsx"));
const UserFeed           = lazy(() => import("./pages/user/Feed.jsx"));
const UserWallet         = lazy(() => import("./pages/user/Wallet.jsx"));
const UserProfile        = lazy(() => import("./pages/user/Profile.jsx"));
const UserInvite         = lazy(() => import("./pages/user/invite.jsx"));
const Learning           = lazy(() => import("./pages/user/Learning.jsx"));
const Courses            = lazy(() => import("./pages/user/Courses.jsx"));
const Mining             = lazy(() => import("./pages/user/Mining.jsx"));
const LuckyDraw          = lazy(() => import("./pages/user/LuckyDraw.jsx"));
const LuckyWheel         = lazy(() => import("./pages/user/LuckyWheel.jsx"));
const Shop               = lazy(() => import("./pages/user/Shop.jsx"));
const Bot                = lazy(() => import("./pages/user/Bot.jsx"));
const Social             = lazy(() => import("./pages/user/Social.jsx"));
const Test               = lazy(() => import("./pages/user/test.jsx"));
const Certificate        = lazy(() => import("./pages/user/Certificate.jsx"));
const courseplayer       = lazy(() => import("./pages/user/CoursePlayer.jsx"));
const UserResources = lazy(() => import("./pages/user/UserResources.jsx"));
const AutoTubeStudio = lazy(() => import("./pages/user/AutoTubeStudio.jsx"));
// Wallet sub pages
const WalletOverview     = lazy(() => import("./pages/user/wallet/Overview.jsx"));
const WalletTransactions = lazy(() => import("./pages/user/wallet/Transactions.jsx"));
const WalletDeposit      = lazy(() => import("./pages/user/wallet/Deposit.jsx"));
const WalletWithdraw     = lazy(() => import("./pages/user/wallet/Withdraw.jsx"));

// Admin pages
const AdminPool          = lazy(() => import("./pages/admin/AdminPool.jsx"));
const AdminTests         = lazy(() => import("./pages/admin/AdminTests.jsx"));
const AdminLuckyWheel    = lazy(() => import("./pages/admin/AdminLuckyWheel.jsx"));
const AdminLuckyDraw     = lazy(() => import("./pages/admin/AdminLuckyDraw.jsx"));
const AdminShop          = lazy(() => import("./pages/admin/AdminShop.jsx"));
const AdminBlogs         = lazy(() => import("./pages/admin/AdminBlogs.jsx"));
const AdminNews          = lazy(() => import("./pages/admin/AdminNews.jsx"));
const AdminMining        = lazy(() => import("./pages/admin/AdminMining.jsx"));
const AdminInvite        = lazy(() => import("./pages/admin/Invite.jsx"));
const AdminCourses       = lazy(() => import("./pages/admin/Courses.jsx"));
const AdminDeposits      = lazy(() => import("./pages/admin/Deposits.jsx"));
const AdminWithdraws     = lazy(() => import("./pages/admin/Withdraws.jsx"));
const AdminUsers         = lazy(() => import("./pages/admin/Users.jsx"));
const AdminLeaderboard   = lazy(() => import("./pages/admin/Leaderboard.jsx"));
const AdminHomepage      = lazy(() => import("./pages/admin/Homepage.jsx"));
const AdminHome          = lazy(() => import("./pages/admin/Adminhome.jsx"));
const AdminFAQs          = lazy(() => import("./pages/admin/adminfaqs.jsx"));
const FeedAdmin          = lazy(() => import("./pages/admin/FeedAdmin.jsx"));
const SocialAutoPost     = lazy(() => import("./pages/admin/SocialAutoPost.jsx"));
const AdminStudyMaterials = lazy(() => import("./pages/admin/AdminStudyMaterials.jsx"));
const  AutoBlogTab       = lazy(() => import("./pages/admin/AutoBlogTab.jsx"));
const AutoNewsTab       = lazy(() => import("./pages/admin/AutoNewsTab.jsx"));



// ─────────────────────────────────────────
//  PAGE LOADING FALLBACK
//  FIX — Old fallback was: <div style={{padding:24,fontWeight:800}}>Loading...</div>
//
//  Why that was bad:
//  1. CLS — tiny "Loading..." div rendered then was replaced by a full
//     page causing a massive layout jump every route change.
//  2. Ugly — plain text flash on your polished site.
//
//  New: full-screen fixed overlay, no layout shift, matches your
//  site gradient + brand colour spinner.
// ─────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(160deg,#f0f4ff 0%,#fffbf0 60%,#e8f4fd 100%)",
      zIndex: 9999,
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "3px solid rgba(26,58,143,0.12)",
          borderTopColor: "#1a3a8f",
          animation: "ps-spin 0.65s linear infinite",
        }} />
        <span style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: "0.78rem",
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          AIDLA
        </span>
      </div>
      <style>{`@keyframes ps-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}


// ─────────────────────────────────────────
// Animated SVG White Cat (unchanged)
// ─────────────────────────────────────────
function CatPet({ mood, size = 40 }) {
  const isSleepy  = mood === "sleepy";
  const isPlayful = mood === "playful";
  return (
    <svg
      className={`pub-cat-svg mood-${mood}`}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, flexShrink: 0, overflow: "visible" }}
    >
      <style>{`
        .mood-happy   { animation: catHappyBob  0.9s infinite alternate ease-in-out; }
        .mood-playful { animation: catPlayWig    1.4s infinite ease-in-out; }
        .mood-relaxed { animation: catRelaxFloat 3s   infinite ease-in-out; }
        .mood-sleepy  { animation: catSleepBrth  4s   infinite ease-in-out; }
        @keyframes catHappyBob  { from{transform:translateY(0)}             to{transform:translateY(-4px)} }
        @keyframes catPlayWig   { 0%,100%{transform:rotate(-6deg)}          50%{transform:rotate(6deg)} }
        @keyframes catRelaxFloat{ 0%,100%{transform:translateY(0)scale(1)}  50%{transform:translateY(-3px)scale(1.02)} }
        @keyframes catSleepBrth { 0%,100%{transform:scale(1)}               50%{transform:scale(1.04)} }
        .pub-cat-tail { transform-origin:20px 52px; animation:tailWag 1.6s infinite ease-in-out; }
        @keyframes tailWag { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} }
        .pub-ear-l { transform-origin:10px 14px; animation:earL 3s infinite ease-in-out; }
        .pub-ear-r { transform-origin:54px 14px; animation:earR 3s 0.4s infinite ease-in-out; }
        @keyframes earL { 0%,80%,100%{transform:rotate(0)} 90%{transform:rotate(-12deg)} }
        @keyframes earR { 0%,80%,100%{transform:rotate(0)} 90%{transform:rotate(12deg)} }
        .pub-eye-l,.pub-eye-r { animation:eyeBlink 4s 1.5s infinite; }
        @keyframes eyeBlink { 0%,94%,100%{transform:scaleY(1)} 96%{transform:scaleY(0.05)} }
        .pub-zzz { opacity:0; }
        .pub-zzz.show  { animation:floatZShow 2s infinite ease-in-out; }
        .pub-zzz.show2 { animation:floatZShow 2s 0.8s infinite ease-in-out; }
        @keyframes floatZShow { 0%{opacity:0;transform:translateY(0)scale(0.6)} 30%{opacity:1} 100%{opacity:0;transform:translateY(-12px)scale(1)} }
        .pub-spark { opacity:0; }
        .pub-spark.show { animation:sparkPop 1.4s 0.6s infinite ease-out; }
        @keyframes sparkPop { 0%,100%{opacity:0;transform:scale(0)} 40%{opacity:1;transform:scale(1.2)} 70%{opacity:0.6;transform:scale(0.8)} }
      `}</style>
      <ellipse cx="32" cy="60" rx="14" ry="3" fill="rgba(0,0,0,0.07)" />
      <g className="pub-cat-tail">
        <path d="M20 52 Q6 50 8 40 Q10 34 16 38" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M20 52 Q6 50 8 40 Q10 34 16 38" stroke="white"   strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </g>
      <ellipse cx="32" cy="46" rx="16" ry="13" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
      <ellipse cx="32" cy="48" rx="8"  ry="7"  fill="#fafafa" stroke="#f1f5f9" strokeWidth="1"/>
      <g className="pub-ear-l">
        <polygon points="12,18 8,6 20,14"  fill="white" stroke="#e2e8f0" strokeWidth="1.5" strokeLinejoin="round"/>
        <polygon points="13,17 10,8 19,14" fill="#fecdd3" opacity="0.6"/>
      </g>
      <g className="pub-ear-r">
        <polygon points="52,18 56,6 44,14"  fill="white" stroke="#e2e8f0" strokeWidth="1.5" strokeLinejoin="round"/>
        <polygon points="51,17 54,8 45,14"  fill="#fecdd3" opacity="0.6"/>
      </g>
      <circle cx="32" cy="26" r="17" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
      {isSleepy ? (
        <>
          <path d="M23 25 Q26 22 29 25" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M35 25 Q38 22 41 25" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </>
      ) : (
        <>
          <g className="pub-eye-l" style={{transformOrigin:"26px 25px"}}>
            <circle cx="26" cy="25" r="4.5" fill="#1e293b"/>
            <circle cx="26" cy="25" r="3"   fill="#334155"/>
            <circle cx="24.5" cy="23.5" r="1.2" fill="white" opacity="0.9"/>
          </g>
          <g className="pub-eye-r" style={{transformOrigin:"38px 25px"}}>
            <circle cx="38" cy="25" r="4.5" fill="#1e293b"/>
            <circle cx="38" cy="25" r="3"   fill="#334155"/>
            <circle cx="36.5" cy="23.5" r="1.2" fill="white" opacity="0.9"/>
          </g>
        </>
      )}
      <polygon points="32,30 30,32 34,32" fill="#fda4af"/>
      <path d="M30 32 Q32 35 34 32" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <line x1="14" y1="29" x2="26" y2="31" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
      <line x1="14" y1="32" x2="26" y2="32" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
      <line x1="15" y1="35" x2="26" y2="33" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
      <line x1="50" y1="29" x2="38" y2="31" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
      <line x1="50" y1="32" x2="38" y2="32" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
      <line x1="49" y1="35" x2="38" y2="33" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round"/>
      <ellipse cx="24" cy="58" rx="5" ry="3.5" fill="white" stroke="#e2e8f0" strokeWidth="1.2"/>
      <ellipse cx="40" cy="58" rx="5" ry="3.5" fill="white" stroke="#e2e8f0" strokeWidth="1.2"/>
      <text className={`pub-zzz  ${isSleepy ? "show"  : ""}`} x="46" y="16" fontSize="9" fill="#94a3b8" fontWeight="bold">z</text>
      <text className={`pub-zzz  ${isSleepy ? "show2" : ""}`} x="50" y="9"  fontSize="7" fill="#94a3b8" fontWeight="bold">z</text>
      <text className={`pub-spark ${isPlayful ? "show" : ""}`} x="48" y="12" fontSize="10" fill="#fbbf24">✦</text>
    </svg>
  );
}

// ─────────────────────────────────────────
// Nav links config (unchanged)
// ─────────────────────────────────────────
const NAV_LINKS = [
  { to: "/",            label: "Home",        icon: "🏠" },
  { to: "/about",       label: "About",       icon: "💡" },
  { to: "/blogs",       label: "Blogs",       icon: "📝" },
  { to: "/news",        label: "News",        icon: "📰" },
  { to: "/faqs",        label: "FAQs",        icon: "❓" },
  { to: "/tools",       label: "Tools",       icon: "🧰" },
  { to: "/courses",     label: "Courses",     icon: "🎓" },
  { to: "/resources",   label: "Resources",   icon: "📚" },
  { to: "/leaderboard", label: "Leaderboard", icon: "🏆" },
];

// ─────────────────────────────────────────
// Protected Route (unchanged)
// ─────────────────────────────────────────
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session?.user) {
        registerPushToken();
        listenForNotifications();
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

// ─────────────────────────────────────────
// Public Header (unchanged except aria improvements)
// ─────────────────────────────────────────
function PublicHeader() {
  const location = useLocation();
  const [time, setTime]         = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const hour = time.getHours();
  const mood =
    hour >= 5  && hour < 12 ? "happy"   :
    hour >= 12 && hour < 17 ? "playful" :
    hour >= 17 && hour < 21 ? "relaxed" : "sleepy";
  const greetWord =
    hour >= 5  && hour < 12 ? "Morning"   :
    hour >= 12 && hour < 17 ? "Afternoon" :
    hour >= 17 && hour < 21 ? "Evening"   : "Night";
  const dateStr = time.toLocaleString(undefined, { weekday:"short", month:"short", day:"numeric" });
  const timeStr = time.toLocaleString(undefined, { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:true });

  return (
    <>
      <style>{PH_CSS}</style>
      <header className="ph-header">
        <div className="ph-inner">
          <div className="ph-top">
            <Link to="/" className="ph-logo">AIDLA</Link>
            <div className="ph-cat-widget">
              <CatPet mood={mood} size={38} />
              <div className="ph-datetime">
                <span className="ph-greet">Good {greetWord}!</span>
                <span className="ph-dt">
                  <span className="ph-dt-date">{dateStr}</span>
                  <span className="ph-dt-sep">·</span>
                  <span className="ph-dt-time">{timeStr}</span>
                </span>
              </div>
            </div>
            <div className="ph-auth">
              <Link to="/signup" className="ph-btn-ghost">Sign up</Link>
              <Link to="/login"  className="ph-btn-solid">Login</Link>
            </div>
            <button
              className={`ph-burger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="ph-mobile-menu"
            >
              <span /><span /><span />
            </button>
          </div>

          <nav className="ph-nav-desktop" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to} to={to} end={to === "/"}
                className={({ isActive }) => `ph-nav-link${isActive ? " active" : ""}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div
          id="ph-mobile-menu"
          className={`ph-mobile-menu ${menuOpen ? "open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <div className="ph-mob-auth">
            <Link to="/signup" className="ph-btn-ghost full">Sign up</Link>
            <Link to="/login"  className="ph-btn-solid full">Login</Link>
          </div>
          <nav className="ph-mob-nav" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ to, label, icon }) => (
              <NavLink
                key={to} to={to} end={to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `ph-mob-link${isActive ? " active" : ""}`}
              >
                <span className="ph-mob-icon" aria-hidden="true">{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

// CSS (unchanged from your original)
const PH_CSS = `
  .ph-header {
    position: sticky; top: 0; z-index: 200;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(203,213,225,0.35);
    box-shadow: 0 2px 20px rgba(15,23,42,0.06);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  .ph-inner { max-width:1200px;margin:0 auto;padding:10px 24px 0;display:flex;flex-direction:column;gap:0; }
  .ph-top { display:flex;align-items:center;gap:14px;padding-bottom:10px; }
  .ph-logo { text-decoration:none;font-size:1.9rem;font-weight:900;letter-spacing:-1px;line-height:1;flex-shrink:0;background:linear-gradient(135deg,#1e3a8a,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(1px 1px 3px rgba(30,58,138,0.15)); }
  .ph-cat-widget { flex:1;min-width:0;display:flex;align-items:center;gap:10px;background:#f8fafc;padding:6px 14px;border-radius:50px;box-shadow:inset 2px 2px 5px rgba(15,23,42,0.04),inset -2px -2px 5px rgba(255,255,255,1);overflow:hidden; }
  .ph-datetime { display:flex;flex-direction:column;min-width:0;overflow:hidden; }
  .ph-greet { font-size:0.8rem;font-weight:800;color:#1e3a8a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
  .ph-dt { display:flex;align-items:center;gap:4px;flex-wrap:nowrap; }
  .ph-dt-date { font-size:0.68rem;font-weight:600;color:#64748b;white-space:nowrap; }
  .ph-dt-sep  { font-size:0.68rem;color:#cbd5e1; }
  .ph-dt-time { font-size:0.68rem;font-weight:600;color:#94a3b8;white-space:nowrap;font-family:'Courier New',monospace; }
  .ph-auth { display:flex;gap:8px;flex-shrink:0; }
  .ph-btn-ghost { padding:7px 14px;border-radius:30px;border:1.5px solid #e2e8f0;background:transparent;color:#334155;font-weight:600;font-size:0.85rem;text-decoration:none;transition:border-color 0.2s,color 0.2s;white-space:nowrap; }
  .ph-btn-ghost:hover { border-color:#3b82f6;color:#3b82f6; }
  .ph-btn-solid { padding:7px 18px;border-radius:30px;border:none;background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:#fff;font-weight:700;font-size:0.85rem;text-decoration:none;transition:filter 0.2s,transform 0.2s,box-shadow 0.2s;white-space:nowrap;box-shadow:0 3px 10px rgba(59,130,246,0.3); }
  .ph-btn-solid:hover { filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 5px 14px rgba(59,130,246,0.4); }
  .ph-btn-ghost.full,.ph-btn-solid.full { flex:1;text-align:center; }
  .ph-burger { display:none; }
  .ph-nav-desktop { display:flex;gap:4px;border-top:1px solid rgba(203,213,225,0.25);padding:6px 0; }
  .ph-nav-link { padding:6px 14px;border-radius:30px;text-decoration:none;font-size:0.88rem;font-weight:600;color:#475569;transition:color 0.18s,background 0.18s; }
  .ph-nav-link:hover  { color:#1e3a8a;background:rgba(30,58,138,0.05); }
  .ph-nav-link.active { color:#1e3a8a;background:#e0e7ff;font-weight:700; }
  .ph-mobile-menu { display:none;flex-direction:column;background:rgba(255,255,255,0.98);backdrop-filter:blur(16px);border-top:1px solid rgba(203,213,225,0.3);overflow:hidden;max-height:0;transition:max-height 0.3s cubic-bezier(0.16,1,0.3,1),opacity 0.2s;opacity:0; }
  .ph-mobile-menu.open { max-height:420px;opacity:1; }
  .ph-mob-auth { display:flex;gap:8px;padding:12px 16px 8px; }
  .ph-mob-nav  { display:flex;flex-direction:column;padding:4px 10px 12px; }
  .ph-mob-link { display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:12px;text-decoration:none;font-size:0.9rem;font-weight:600;color:#475569;transition:all 0.15s; }
  .ph-mob-link:hover  { background:rgba(30,58,138,0.05);color:#1e3a8a; }
  .ph-mob-link.active { background:rgba(224,231,255,0.8);color:#1e3a8a;font-weight:700;border-left:3px solid #3b82f6;padding-left:9px; }
  .ph-mob-icon { font-size:1.1rem;width:26px;flex-shrink:0; }

  @media (max-width: 640px) {
    .ph-inner { padding:4px 10px 0; }
    .ph-top { gap:6px;padding-bottom:5px; }
    .ph-logo { font-size:1.4rem; }
    .ph-cat-widget { padding:5px 10px;border-radius:40px;gap:7px; }
    .ph-cat-widget .pub-cat-svg { width:30px !important;height:30px !important; }
    .ph-greet { font-size:0.72rem; }
    .ph-dt-date,.ph-dt-sep,.ph-dt-time { font-size:0.6rem; }
    .ph-auth { display:none; }
    .ph-nav-desktop { display:none; }
    .ph-burger { display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4.5px;width:38px;height:38px;border-radius:10px;border:none;flex-shrink:0;background:#f1f5f9;cursor:pointer;box-shadow:3px 3px 7px rgba(15,23,42,0.07),-3px -3px 7px rgba(255,255,255,1);transition:background 0.2s,box-shadow 0.2s; }
    .ph-burger span { display:block;width:18px;height:2px;background:#334155;border-radius:2px;transition:all 0.25s cubic-bezier(0.16,1,0.3,1);transform-origin:center; }
    .ph-burger.open { background:#e0e7ff;box-shadow:inset 2px 2px 5px rgba(15,23,42,0.08),inset -2px -2px 5px rgba(255,255,255,0.8); }
    .ph-burger.open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg);background:#1e3a8a; }
    .ph-burger.open span:nth-child(2) { transform:scaleX(0);opacity:0; }
    .ph-burger.open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg);background:#1e3a8a; }
    .ph-mobile-menu { display:flex; }
  }
  @media (max-width: 380px) {
    .ph-logo { font-size:1.2rem; }
    .ph-cat-widget { padding:4px 8px;gap:5px; }
    .ph-cat-widget .pub-cat-svg { width:26px !important;height:26px !important; }
    .ph-greet { font-size:0.66rem; }
    .ph-dt-date { display:none; }
    .ph-dt-sep  { display:none; }
  }
`;

// ─────────────────────────────────────────
//  App (unchanged structure, improved Suspense)
// ─────────────────────────────────────────
export default function App() {
  const location = useLocation();
  const hidePublicHeader =
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/admin");

  const AppRoutes = (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/"                                element={<Home />} />
        <Route path="/about"                           element={<About />} />
        <Route path="/blogs"                           element={<Blogs />} />
        <Route path="/blogs/:slug"                     element={<BlogPost />} />
        <Route path="/news"                            element={<News />} />
        <Route path="/news/:slug"                      element={<NewsPost />} />

        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/contact"                         element={<Contact />} />
        <Route path="/privacy-policy"                  element={<PrivacyPolicy />} />
        <Route path="/terms"                           element={<Terms />} />
        <Route path="/faqs"                            element={<FAQs />} />
        <Route path="/faqs/:slug"                      element={<FAQPage />} />
        <Route path="/tools"                           element={<ToolsHome />} />
        <Route path="/tools/pdf/word-to-pdf"           element={<WordToPdf />} />
        <Route path="/tools/pdf/image-to-pdf"          element={<ImageToPdf />} />
        <Route path="/tools/image/jpg-to-png"          element={<JpgToPng />} />
        <Route path="/tools/career/cv-maker"           element={<CvMaker />} />
        <Route path="/tools/career/cover-letter-maker" element={<CoverLetterMaker />} />
        <Route path="/email-confirmed"                 element={<EmailConfirmed />} />
        <Route path="/verify/:certId" element={<VerifyCertificate />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/:slug" element={<ResourceDetailPage />} />

<Route path="/courses"       element={<PublicCourses />} />
<Route path="/courses/:slug" element={<PublicCourseDetail />} />

        <Route path="/autotube" element={<AutoTubePublic />} />
        <Route path="/tools/results"     element={<ResultsHub />} />
        <Route path="/tools/results/:boardId" element={<BoardPage />} />
        <Route path="/tools/utility/qr-code-generator"       element={<QRCodeGenerator />} />
<Route path="/tools/utility/age-calculator"           element={<AgeCalculator />} />
<Route path="/tools/utility/word-counter"             element={<WordCounter />} />
<Route path="/tools/education/cgpa-calculator"        element={<CGPACalculator />} />
<Route path="/tools/education/mdcat-ecat-calculator"  element={<MDCATCalculator />} />
<Route path="/tools/ai/summarizer"                    element={<AISummarizer />} />
<Route path="/tools/ai/paraphraser"                   element={<AIParaphraser />} />
<Route path="/tools/pdf/pdf-compressor"          element={<PDFCompressor />} />
<Route path="/tools/image/background-remover"     element={<BackgroundRemover />} />
<Route path="/tools/ai/email-writer"              element={<EmailWriter />} />

// AI Tools
<Route path="/tools/ai/interview-prep"                element={<InterviewPrep />} />
<Route path="/tools/ai/linkedin-bio" element={<LinkedInBio />} />
 
// Education Tools
<Route path="/tools/education/percentage-calculator"  element={<PercentageCalculator />} />
<Route path="/tools/education/grade-calculator"       element={<GradeCalculator />} />
<Route path="/tools/education/attendance-calculator"  element={<AttendanceCalc />} />
<Route path="/tools/education/marks-to-grade"         element={<MarksToGrade />} />
<Route path="/tools/education/study-planner"          element={<StudyPlanner />} />
<Route path="/tools/education/pomodoro-timer"         element={<PomodoroTimer />} />
<Route path="/tools/education/assignment-tracker"     element={<AssignmentTracker />} />
<Route path="/tools/education/flashcard-maker"        element={<FlashcardMaker />} />
<Route path="/tools/education/scholarship-eligibility" element={<ScholarshipCheck />} />
 
// Finance Tools
<Route path="/tools/finance/salary-calculator"        element={<SalaryCalculator />} />
<Route path="/tools/finance/zakat-calculator"         element={<ZakatCalculator />} />
<Route path="/tools/finance/loan-emi-calculator"      element={<LoanEMICalculator />} />
<Route path="/tools/finance/tip-calculator"           element={<TipCalculator />} />
 
// Health Tools
<Route path="/tools/health/bmi-calculator"            element={<BMICalculator />} />
<Route path="/tools/health/calorie-calculator"        element={<CalorieCalculator />} />
<Route path="/tools/health/water-intake-calculator"   element={<WaterIntakeCalc />} />
<Route path="/tools/health/sleep-calculator"          element={<SleepCalculator />} />
 
// Utility Tools (new)
<Route path="/tools/utility/password-generator"       element={<PasswordGenerator />} />
<Route path="/tools/utility/unit-converter"           element={<UnitConverter />} />
<Route path="/tools/utility/countdown-timer"          element={<CountdownTimer />} />
<Route path="/tools/utility/percentage-change"        element={<PercentageChange />} />
<Route path="/tools/utility/roman-numeral-converter"  element={<RomanNumeral />} />
<Route path="/tools/utility/binary-converter"         element={<BinaryConverter />} />
<Route path="/tools/utility/color-picker"             element={<ColorPicker />} />
<Route path="/tools/utility/text-case-converter"      element={<TextCaseConverter />} />
 

        {/* Auth */}
        <Route path="/signup"                          element={<Signup />} />
        <Route path="/login"                           element={<Login />} />
        <Route path="/forgot-password"                 element={<ForgotPassword />} />
        <Route path="/reset-password"                  element={<ResetPassword />} />

        <Route path="/footer"                          element={<Footer />} />

        {/* User area */}
        <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
          <Route index                                 element={<UserDashboard />} />
          <Route path="feed"                           element={<UserFeed />} />
          <Route path="test"                           element={<Test />} />
          <Route path="wallet"                         element={<UserWallet />}>
            <Route index                               element={<WalletOverview />} />
            <Route path="transactions"                 element={<WalletTransactions />} />
            <Route path="deposit"                      element={<WalletDeposit />} />
            <Route path="withdraw"                     element={<WalletWithdraw />} />
            <Route path="invite"                       element={<UserInvite />} />
          </Route>
          <Route path="profile"                        element={<UserProfile />} />
          <Route path="learning"                       element={<Learning />} />
          <Route path="courses"                        element={<Courses />} />
          <Route path="course/:id"                      element={<CoursePlayer />} />
          <Route path="certificate/:certId" element={<Certificate />} />
          <Route path="mining"                         element={<Mining />} />
          <Route path="lucky-draw"                     element={<LuckyDraw />} />
          <Route path="lucky-wheel"                    element={<LuckyWheel />} />
          <Route path="shop"                           element={<Shop />} />
          <Route path="bot"                            element={<Bot />} />
          <Route path="social"                         element={<Social />} />
          <Route path="UserResources" element={<UserResources />} />
          <Route path="autotubestudio"  element={<AutoTubeStudio />} />
        </Route>

        {/* Admin area */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index                                 element={<AdminPool />} />
          <Route path="tests"                          element={<AdminTests />} />
          <Route path="lucky-wheel"                    element={<AdminLuckyWheel />} />
          <Route path="lucky-draw"                     element={<AdminLuckyDraw />} />
          <Route path="shop"                           element={<AdminShop />} />
          <Route path="blogs"                          element={<AdminBlogs />} />
          <Route path="news"                           element={<AdminNews />} />
          <Route path="mining"                         element={<AdminMining />} />
          <Route path="invite"                         element={<AdminInvite />} />
          <Route path="courses"                        element={<AdminCourses />} />
          <Route path="deposits"                       element={<AdminDeposits />} />
          <Route path="withdraws"                      element={<AdminWithdraws />} />
          <Route path="users"                          element={<AdminUsers />} />
          <Route path="leaderboard"                    element={<AdminLeaderboard />} />
          <Route path="homepage"                       element={<AdminHomepage />} />
          <Route path="AdminHome"                      element={<AdminHome />} />
          <Route path="AdminFAQs"                      element={<AdminFAQs />} />
          <Route path="FeedAdmin"                      element={<FeedAdmin />} />
          <Route path="SocialAutoPost"                 element={<SocialAutoPost />} />
          <Route path="AdminStudyMaterials" element={<AdminStudyMaterials />} />
          <Route path="autoBlogTab" element={<AutoBlogTab />} />
          <Route path="autoNewsTab" element={<AutoNewsTab />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );

  return (
    <div>
      <SchemaMarkup />
      {!hidePublicHeader && <PublicHeader />}
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