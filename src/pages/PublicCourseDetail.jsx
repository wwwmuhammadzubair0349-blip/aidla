// PublicCourseDetail.jsx — Public Course Detail Page
// Route: /courses/:slug
// Full description, all course info, Enroll → /signup. SEO per course.

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Footer from "./components/footer";
import { Helmet } from "react-helmet-async";
import { toSlug } from "./PublicCourses"; // shared slug generator

// ── Level config ──────────────────────────────────────────────────────────
const LEVELS = {
  beginner:     { label: "Beginner",     color: "#059669", bg: "#ECFDF5", icon: "🌱" },
  intermediate: { label: "Intermediate", color: "#D97706", bg: "#FFFBEB", icon: "🔥" },
  advanced:     { label: "Advanced",     color: "#DC2626", bg: "#FEF2F2", icon: "⚡" },
  "all-levels": { label: "All Levels",   color: "#1a3a8f", bg: "#EBF2FF", icon: "🎯" },
};

// ── CSS ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { overflow-x: hidden; width: 100%; }

.pcd-root {
  min-height: 100vh;
  background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 55%, #e8f4fd 100%);
  font-family: 'DM Sans', sans-serif;
  color: #0b1437;
  display: flex; flex-direction: column;
  overflow-x: hidden; position: relative;
}

/* ── Orbs ── */
.pcd-orb1, .pcd-orb2 {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
}
.pcd-orb1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%);
  top: -150px; left: -150px;
}
.pcd-orb2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%);
  bottom: 5%; right: -180px;
}

/* ── Nav ── */
.pcd-nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(59,130,246,0.1);
}
.pcd-nav-inner {
  max-width: 1100px; margin: 0 auto;
  padding: 0 clamp(16px,4vw,32px); height: 60px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.pcd-nav-brand {
  font-family: 'Playfair Display', serif;
  font-style: italic; font-size: clamp(1.1rem,3vw,1.4rem);
  color: #1a3a8f; text-decoration: none; flex-shrink: 0;
}
.pcd-nav-actions { display: flex; gap: 10px; align-items: center; }
.pcd-nav-link {
  font-size: 0.83rem; font-weight: 600; color: #475569;
  text-decoration: none; padding: 7px 14px; border-radius: 30px;
  transition: background 0.18s, color 0.18s;
}
.pcd-nav-link:hover { background: rgba(26,58,143,0.06); color: #1a3a8f; }
.pcd-nav-btn {
  font-size: 0.83rem; font-weight: 700;
  padding: 8px 20px; border-radius: 30px; border: none; cursor: pointer;
  background: linear-gradient(135deg, #1a3a8f, #3b82f6); color: #fff;
  box-shadow: 0 3px 12px rgba(26,58,143,0.25);
  transition: transform 0.18s, box-shadow 0.18s;
  text-decoration: none; display: inline-flex; align-items: center;
}
.pcd-nav-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(26,58,143,0.3); }

/* ── Breadcrumb ── */
.pcd-breadcrumb {
  position: relative; z-index: 1;
  max-width: 1100px; margin: 0 auto;
  padding: 16px clamp(16px,4vw,32px) 0;
  display: flex; align-items: center; gap: 6px;
  font-size: 0.75rem; font-weight: 600; color: #94a3b8;
  flex-wrap: wrap;
}
.pcd-breadcrumb a {
  color: #1a3a8f; text-decoration: none;
  transition: opacity 0.15s;
}
.pcd-breadcrumb a:hover { opacity: 0.7; }
.pcd-breadcrumb-sep { color: #cbd5e1; }

/* ── Hero ── */
.pcd-hero {
  position: relative; z-index: 1;
  padding: clamp(24px,4vw,44px) clamp(16px,4vw,32px) 0;
}
.pcd-hero-inner {
  max-width: 1100px; margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: start;
}
@media (min-width: 860px) {
  .pcd-hero-inner { grid-template-columns: 1fr 360px; }
}

/* ── Left: course info ── */
.pcd-hero-left {}
.pcd-hero-badges {
  display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;
}
.pcd-badge-level {
  padding: 4px 12px; border-radius: 100px;
  font-size: 0.68rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.06em;
}
.pcd-badge-cat {
  padding: 4px 12px; border-radius: 100px;
  font-size: 0.68rem; font-weight: 700;
  background: rgba(59,130,246,0.08); color: #1a3a8f;
  border: 1px solid rgba(59,130,246,0.15);
}
.pcd-hero-h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.6rem,4vw,2.6rem);
  font-weight: 900; line-height: 1.15;
  color: #0b1437; margin-bottom: 16px;
}
.pcd-hero-desc-intro {
  font-size: clamp(0.9rem,2vw,1rem);
  color: #475569; line-height: 1.7;
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pcd-hero-meta {
  display: flex; gap: 18px; flex-wrap: wrap;
  margin-bottom: 28px;
}
.pcd-meta-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.8rem; font-weight: 600; color: #64748b;
}
.pcd-meta-icon { font-size: 14px; }

/* Mobile CTA (hidden on desktop) */
.pcd-mobile-cta {
  margin-bottom: 24px;
}
@media (min-width: 860px) {
  .pcd-mobile-cta { display: none; }
}

/* ── Right: enroll card ── */
.pcd-enroll-card {
  background: rgba(255,255,255,0.97);
  border-radius: 22px;
  border: 1px solid rgba(59,130,246,0.1);
  box-shadow: 0 8px 40px rgba(11,20,55,0.09);
  overflow: hidden;
  position: sticky; top: 76px;
}
.pcd-enroll-thumb {
  width: 100%; height: 0; padding-bottom: 56.25%;
  position: relative; background: linear-gradient(135deg, #EBF2FF, #dbeafe);
  overflow: hidden;
}
.pcd-enroll-thumb img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
}
.pcd-enroll-body { padding: 22px 22px 24px; }
.pcd-price-row {
  display: flex; align-items: baseline; gap: 10px;
  margin-bottom: 18px;
}
.pcd-price {
  font-family: 'Playfair Display', serif;
  font-size: 2rem; font-weight: 900; color: #0b1437; line-height: 1;
}
.pcd-price-free { color: #059669; }
.pcd-price-sub { font-size: 0.78rem; color: #94a3b8; font-weight: 600; }

.pcd-enroll-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 14px 20px; border-radius: 14px; border: none;
  background: linear-gradient(135deg, #1a3a8f, #3b82f6);
  color: #fff; font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem; font-weight: 800; cursor: pointer;
  box-shadow: 0 4px 18px rgba(26,58,143,0.28);
  transition: transform 0.18s, box-shadow 0.18s;
  text-decoration: none; margin-bottom: 12px;
}
.pcd-enroll-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(26,58,143,0.35); }

.pcd-enroll-note {
  text-align: center; font-size: 0.72rem; color: #94a3b8;
  font-weight: 600; margin-bottom: 20px;
}

.pcd-enroll-features { display: flex; flex-direction: column; gap: 10px; }
.pcd-enroll-feat {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.82rem; font-weight: 600; color: #475569;
}
.pcd-enroll-feat-icon { font-size: 16px; flex-shrink: 0; width: 24px; text-align: center; }

/* ── Main content ── */
.pcd-main {
  position: relative; z-index: 1;
  max-width: 1100px; margin: 0 auto; width: 100%;
  padding: clamp(28px,4vw,44px) clamp(16px,4vw,32px) clamp(48px,8vw,80px);
  flex: 1;
}
.pcd-layout {
  display: grid; grid-template-columns: 1fr;
  gap: 32px; align-items: start;
}
@media (min-width: 860px) {
  .pcd-layout { grid-template-columns: 1fr 360px; }
}

/* ── Description section ── */
.pcd-desc-card {
  background: rgba(255,255,255,0.95);
  border-radius: 20px;
  border: 1px solid rgba(59,130,246,0.09);
  box-shadow: 0 4px 20px rgba(11,20,55,0.06);
  padding: clamp(20px,4vw,32px);
  margin-bottom: 20px;
}
.pcd-section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.1rem,3vw,1.3rem); font-weight: 700;
  color: #0b1437; margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.pcd-desc-text {
  font-size: clamp(0.88rem,2vw,0.95rem);
  color: #334155; line-height: 1.8;
  white-space: pre-line;
}
.pcd-desc-text p { margin-bottom: 12px; }
.pcd-desc-text p:last-child { margin-bottom: 0; }

/* ── Details grid ── */
.pcd-details-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  margin-bottom: 20px;
}
@media (max-width: 480px) {
  .pcd-details-grid { grid-template-columns: 1fr; }
}
.pcd-detail-card {
  background: rgba(255,255,255,0.95);
  border-radius: 14px;
  border: 1px solid rgba(59,130,246,0.09);
  box-shadow: 0 2px 12px rgba(11,20,55,0.04);
  padding: 16px 18px;
  display: flex; align-items: center; gap: 12px;
}
.pcd-detail-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: linear-gradient(135deg, #EBF2FF, #dbeafe);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.pcd-detail-lbl { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; }
.pcd-detail-val { font-size: 0.88rem; font-weight: 700; color: #0b1437; margin-top: 2px; }

/* ── Certificate callout ── */
.pcd-cert-card {
  background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(252,211,77,0.06));
  border: 1.5px solid rgba(245,158,11,0.2);
  border-radius: 16px; padding: 20px 22px;
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 20px; flex-wrap: wrap; gap: 14px;
}
.pcd-cert-icon { font-size: 36px; flex-shrink: 0; }
.pcd-cert-text { flex: 1; min-width: 200px; }
.pcd-cert-title { font-weight: 800; font-size: 0.95rem; color: #0b1437; margin-bottom: 4px; }
.pcd-cert-sub { font-size: 0.8rem; color: #64748b; line-height: 1.5; }

/* ── Sticky CTA bottom (mobile) ── */
.pcd-sticky-cta {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
  padding: 12px 16px;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(59,130,246,0.1);
  box-shadow: 0 -4px 20px rgba(11,20,55,0.1);
  display: flex; align-items: center; gap: 12px;
}
.pcd-sticky-price {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem; font-weight: 900; color: #0b1437; flex-shrink: 0;
}
.pcd-sticky-price.free { color: #059669; }
.pcd-sticky-btn {
  flex: 1; padding: 12px 16px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, #1a3a8f, #3b82f6); color: #fff;
  font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 800;
  cursor: pointer; box-shadow: 0 3px 14px rgba(26,58,143,0.28);
  transition: transform 0.15s; text-decoration: none;
  display: flex; align-items: center; justify-content: center;
}
.pcd-sticky-btn:hover { transform: scale(1.01); }
@media (min-width: 860px) {
  .pcd-sticky-cta { display: none; }
}

/* ── Related courses ── */
.pcd-related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.pcd-related-card {
  background: rgba(255,255,255,0.95);
  border-radius: 14px; border: 1px solid rgba(59,130,246,0.09);
  box-shadow: 0 2px 12px rgba(11,20,55,0.05);
  overflow: hidden; text-decoration: none; color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex; flex-direction: column;
}
.pcd-related-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(26,58,143,0.12); }
.pcd-related-thumb {
  height: 110px; background: linear-gradient(135deg, #EBF2FF, #dbeafe);
  position: relative; overflow: hidden;
}
.pcd-related-thumb img { width: 100%; height: 100%; object-fit: cover; }
.pcd-related-body { padding: 12px 13px 14px; }
.pcd-related-level {
  font-size: 0.6rem; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.05em; margin-bottom: 5px;
}
.pcd-related-title {
  font-family: 'Playfair Display', serif;
  font-size: 0.85rem; font-weight: 700; color: #0b1437; line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}

/* ── Not found ── */
.pcd-not-found {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; flex: 1; padding: 80px 20px; text-align: center; z-index: 1;
}
.pcd-nf-icon { font-size: 64px; margin-bottom: 20px; }
.pcd-nf-h {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem; font-weight: 900; color: #0b1437; margin-bottom: 10px;
}
.pcd-nf-p { color: #64748b; font-size: 0.9rem; margin-bottom: 24px; }
.pcd-nf-btn {
  padding: 12px 28px; border-radius: 30px; border: none;
  background: linear-gradient(135deg, #1a3a8f, #3b82f6);
  color: #fff; font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem; font-weight: 800; cursor: pointer;
  text-decoration: none; display: inline-block;
  box-shadow: 0 4px 16px rgba(26,58,143,0.28);
}

/* ── Skeleton ── */
.pcd-skeleton {
  background: linear-gradient(90deg, #e8edf5 25%, #dde3ee 50%, #e8edf5 75%);
  background-size: 200% 100%;
  animation: pcd-shimmer 1.4s infinite; border-radius: 20px;
}
@keyframes pcd-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── Fade ── */
@keyframes pcd-fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
.pcd-fade { animation: pcd-fadeUp 0.42s ease both; }

/* ── Mobile bottom padding ── */
@media (max-width: 859px) {
  .pcd-main { padding-bottom: 90px; }
}
`;

// ── Component ─────────────────────────────────────────────────────────────
export default function PublicCourseDetail() {
  const { slug }     = useParams();
  const navigate     = useNavigate();
  const [course, setCourse]   = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      // Fetch all published courses, find by slug
      const { data } = await supabase
        .from("course_courses")
        .select("*")
        .eq("status", "published");

      if (!data || data.length === 0) { setNotFound(true); setLoading(false); return; }

      const found = data.find(c => toSlug(c.title) === slug);
      if (!found) { setNotFound(true); setLoading(false); return; }

      setCourse(found);

      // Related: same category or level, exclude self, up to 4
      const rel = data
        .filter(c => c.id !== found.id && (c.category === found.category || c.level === found.level))
        .slice(0, 4);
      setRelated(rel);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return (
    <>
      <style>{CSS}</style>
      <div className="pcd-root">
        <div className="pcd-orb1" /><div className="pcd-orb2" />
        <nav className="pcd-nav">
          <div className="pcd-nav-inner">
            <Link to="/" className="pcd-nav-brand">AIDLA</Link>
          </div>
        </nav>
        <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
          <div>
            <div className="pcd-skeleton" style={{ height: 48, marginBottom: 16 }} />
            <div className="pcd-skeleton" style={{ height: 24, marginBottom: 10, width: "70%" }} />
            <div className="pcd-skeleton" style={{ height: 280, marginTop: 24 }} />
          </div>
          <div className="pcd-skeleton" style={{ height: 420 }} />
        </div>
      </div>
    </>
  );

  if (notFound) return (
    <>
      <style>{CSS}</style>
      <div className="pcd-root">
        <div className="pcd-orb1" /><div className="pcd-orb2" />
        <nav className="pcd-nav">
          <div className="pcd-nav-inner">
            <Link to="/" className="pcd-nav-brand">AIDLA</Link>
            <div className="pcd-nav-actions">
              <Link to="/courses" className="pcd-nav-link">← All Courses</Link>
            </div>
          </div>
        </nav>
        <div className="pcd-not-found">
          <div className="pcd-nf-icon">🔍</div>
          <h1 className="pcd-nf-h">Course Not Found</h1>
          <p className="pcd-nf-p">This course may have been removed or the link is incorrect.</p>
          <Link to="/courses" className="pcd-nf-btn">Browse All Courses</Link>
        </div>
        <Footer />
      </div>
    </>
  );

  const lm     = LEVELS[course.level] || LEVELS.beginner;
  const isFree = !course.price || course.price === 0;
  const hasCert = course.certificate_price > 0 || course.certificate_price === 0;

  // Split description into paragraphs for richer rendering
  const descParagraphs = (course.description || "")
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  const details = [
    { icon: "📊", label: "Level",    val: lm.label },
    { icon: "🗂️", label: "Category", val: course.category || "General" },
    { icon: "⏱️", label: "Duration", val: course.duration_estimate || "Self-paced" },
    { icon: "💰", label: "Price",    val: isFree ? "Free" : `$${Number(course.price).toFixed(2)}` },
  ].filter(d => d.val);

  return (
    <>
      <Helmet>
        <title>{course.title} | AIDLA Online Courses</title>
        <meta name="description" content={
          (course.description || "").slice(0, 155).replace(/\n/g, " ") +
          " — Enroll free on AIDLA, Pakistan's #1 educational rewards platform."
        } />
        <meta name="keywords" content={`${course.title}, ${course.category || ""}, online course, AIDLA, free course, Pakistan`} />
        <meta property="og:title" content={`${course.title} — AIDLA`} />
        <meta property="og:description" content={(course.description || "").slice(0, 155)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.aidla.online/courses/${slug}`} />
        <meta property="og:image" content={course.thumbnail_url || "https://www.aidla.online/og-home.jpg"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={course.title} />
        <meta name="twitter:description" content={(course.description || "").slice(0, 155)} />
        <meta name="twitter:image" content={course.thumbnail_url || "https://www.aidla.online/og-home.jpg"} />
        <link rel="canonical" href={`https://www.aidla.online/courses/${slug}`} />
        {/* JSON-LD for Google rich results */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": course.title,
          "description": course.description || "",
          "provider": { "@type": "Organization", "name": "AIDLA", "url": "https://www.aidla.online" },
          "url": `https://www.aidla.online/courses/${slug}`,
          "image": course.thumbnail_url || "",
          "courseLevel": lm.label,
          "offers": {
            "@type": "Offer",
            "price": course.price || 0,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": `https://www.aidla.online/signup`,
          },
        })}</script>
      </Helmet>

      <style>{CSS}</style>

      <div className="pcd-root">
        <div className="pcd-orb1" /><div className="pcd-orb2" />

        {/* ── Nav ── */}
        <nav className="pcd-nav">
          <div className="pcd-nav-inner">
            <Link to="/" className="pcd-nav-brand">AIDLA</Link>
            <div className="pcd-nav-actions">
              <Link to="/courses" className="pcd-nav-link">← All Courses</Link>
              <Link to="/signup" className="pcd-nav-btn">Get Started Free</Link>
            </div>
          </div>
        </nav>

        {/* ── Breadcrumb ── */}
        <div className="pcd-breadcrumb pcd-fade">
          <Link to="/">Home</Link>
          <span className="pcd-breadcrumb-sep">›</span>
          <Link to="/courses">Courses</Link>
          <span className="pcd-breadcrumb-sep">›</span>
          <span style={{ color: "#475569" }}>{course.title}</span>
        </div>

        {/* ── Hero ── */}
        <header className="pcd-hero">
          <div className="pcd-hero-inner">

            {/* Left */}
            <div className="pcd-fade">
              <div className="pcd-hero-badges">
                <span className="pcd-badge-level" style={{ background: lm.bg, color: lm.color }}>
                  {lm.icon} {lm.label}
                </span>
                {course.category && (
                  <span className="pcd-badge-cat">{course.category}</span>
                )}
                {isFree && (
                  <span style={{ background: "#ECFDF5", color: "#059669", padding: "4px 12px", borderRadius: 100, fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Free
                  </span>
                )}
              </div>

              <h1 className="pcd-hero-h1">{course.title}</h1>

              <p className="pcd-hero-desc-intro">
                {(course.description || "").split("\n")[0]}
              </p>

              <div className="pcd-hero-meta">
                {course.duration_estimate && (
                  <div className="pcd-meta-item">
                    <span className="pcd-meta-icon">⏱️</span>
                    {course.duration_estimate}
                  </div>
                )}
                <div className="pcd-meta-item">
                  <span className="pcd-meta-icon">📊</span>
                  {lm.label}
                </div>
                {course.certificate_price >= 0 && hasCert && (
                  <div className="pcd-meta-item">
                    <span className="pcd-meta-icon">🏆</span>
                    Certificate Available
                  </div>
                )}
                <div className="pcd-meta-item">
                  <span className="pcd-meta-icon">🌍</span>
                  Online · Self-paced
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="pcd-mobile-cta">
                <Link to="/signup" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", padding: "14px 20px", borderRadius: 14,
                  background: "linear-gradient(135deg, #1a3a8f, #3b82f6)", color: "#fff",
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 800,
                  textDecoration: "none", boxShadow: "0 4px 18px rgba(26,58,143,0.28)",
                }}>
                  {isFree ? "🎓 Enroll for Free" : `Enroll · $${Number(course.price).toFixed(2)}`}
                </Link>
              </div>
            </div>

            {/* Right: enroll card (desktop) */}
            <div className="pcd-fade" style={{ animationDelay: "80ms" }}>
              <div className="pcd-enroll-card">
                <div className="pcd-enroll-thumb">
                  <img
                    src={course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"}
                    alt={course.title}
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"; }}
                  />
                </div>
                <div className="pcd-enroll-body">
                  <div className="pcd-price-row">
                    <div className={`pcd-price${isFree ? " pcd-price-free" : ""}`}>
                      {isFree ? "Free" : `$${Number(course.price).toFixed(2)}`}
                    </div>
                    {!isFree && <div className="pcd-price-sub">One-time payment</div>}
                  </div>

                  <Link to="/signup" className="pcd-enroll-btn">
                    {isFree ? "🎓 Enroll for Free" : "Enroll Now →"}
                  </Link>
                  <p className="pcd-enroll-note">
                    {isFree ? "No credit card required" : "Secure checkout · Instant access"}
                  </p>

                  <div className="pcd-enroll-features">
                    <div className="pcd-enroll-feat"><span className="pcd-enroll-feat-icon">📱</span>Mobile-friendly learning</div>
                    <div className="pcd-enroll-feat"><span className="pcd-enroll-feat-icon">🕐</span>Learn at your own pace</div>
                    <div className="pcd-enroll-feat"><span className="pcd-enroll-feat-icon">🪙</span>Earn AIDLA Coins as you learn</div>
                    {hasCert && (
                      <div className="pcd-enroll-feat">
                        <span className="pcd-enroll-feat-icon">🏆</span>
                        {course.certificate_price === 0
                          ? "Free certificate on completion"
                          : `Certificate · $${Number(course.certificate_price).toFixed(2)}`}
                      </div>
                    )}
                    <div className="pcd-enroll-feat"><span className="pcd-enroll-feat-icon">🤖</span>AI-powered support 24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="pcd-main">
          <div className="pcd-layout">

            {/* Left column: description + details */}
            <div>
              {/* Full description */}
              <div className="pcd-desc-card pcd-fade" style={{ animationDelay: "120ms" }}>
                <h2 className="pcd-section-title">📖 About This Course</h2>
                <div className="pcd-desc-text">
                  {descParagraphs.length > 0
                    ? descParagraphs.map((para, i) => <p key={i}>{para}</p>)
                    : <p>{course.description || "No description available."}</p>
                  }
                </div>
              </div>

              {/* Details grid */}
              <div className="pcd-details-grid pcd-fade" style={{ animationDelay: "160ms" }}>
                {details.map(d => (
                  <div key={d.label} className="pcd-detail-card">
                    <div className="pcd-detail-icon">{d.icon}</div>
                    <div>
                      <div className="pcd-detail-lbl">{d.label}</div>
                      <div className="pcd-detail-val">{d.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Certificate callout */}
              {hasCert && (
                <div className="pcd-cert-card pcd-fade" style={{ animationDelay: "200ms" }}>
                  <div className="pcd-cert-icon">🏆</div>
                  <div className="pcd-cert-text">
                    <div className="pcd-cert-title">Verified Certificate of Completion</div>
                    <div className="pcd-cert-sub">
                      {course.certificate_price === 0
                        ? "Complete this course and earn a free verified certificate you can share on LinkedIn and your CV."
                        : `Earn a verified certificate for just $${Number(course.certificate_price).toFixed(2)} — a powerful addition to your CV and LinkedIn profile.`}
                    </div>
                  </div>
                  <Link to="/signup" style={{
                    padding: "10px 20px", borderRadius: 30, border: "none",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff",
                    fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: 800,
                    cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap",
                    boxShadow: "0 3px 12px rgba(245,158,11,0.3)", display: "inline-block",
                  }}>
                    Get Certificate
                  </Link>
                </div>
              )}

              {/* Why AIDLA */}
              <div className="pcd-desc-card pcd-fade" style={{ animationDelay: "240ms" }}>
                <h2 className="pcd-section-title">🚀 Why Learn on AIDLA?</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { icon: "🪙", title: "Earn Real Coins", desc: "Every quiz, test, and course completion rewards you with AIDLA Coins — redeemable for real prizes and cash." },
                    { icon: "🤖", title: "AI-Powered Learning", desc: "Personalised learning paths that adapt to your pace and style. Get instant explanations from our AI tutor 24/7." },
                    { icon: "🏆", title: "Compete & Win", desc: "Rise on the leaderboard, enter Lucky Draws, and spin the Lucky Wheel for bonus rewards." },
                    { icon: "💸", title: "100% Free to Join", desc: "No subscription, no hidden fees. Create your free account in 60 seconds and start learning today." },
                  ].map(item => (
                    <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: "linear-gradient(135deg, #EBF2FF, #dbeafe)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                      }}>{item.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0b1437", marginBottom: 3 }}>{item.title}</div>
                        <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.6 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related courses */}
              {related.length > 0 && (
                <div className="pcd-fade" style={{ animationDelay: "280ms" }}>
                  <h2 className="pcd-section-title" style={{ marginBottom: 14 }}>📚 You Might Also Like</h2>
                  <div className="pcd-related-grid">
                    {related.map(c => {
                      const rlm  = LEVELS[c.level] || LEVELS.beginner;
                      const rSlug = toSlug(c.title);
                      return (
                        <Link key={c.id} to={`/courses/${rSlug}`} className="pcd-related-card">
                          <div className="pcd-related-thumb">
                            <img
                              src={c.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=70"}
                              alt={c.title}
                              onError={e => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=70"; }}
                              loading="lazy"
                            />
                          </div>
                          <div className="pcd-related-body">
                            <div className="pcd-related-level" style={{ color: rlm.color }}>{rlm.label}</div>
                            <div className="pcd-related-title">{c.title}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: empty on mobile (card is in hero), spacer on desktop */}
            <div />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}