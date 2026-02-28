import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

/* ─────────────────────── Global Styles ─────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy: #0b1437;
    --royal: #1a3a8f;
    --sky: #3b82f6;
    --gold: #f59e0b;
    --gold-light: #fcd34d;
    --slate: #64748b;
    --light: #f0f4ff;
    --card-bg: rgba(255, 255, 255, 0.97);
  }

  .blogs-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* ── Background Orbs ── */
  .bg-orbs {
    position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
  }
  .bg-orb-1 {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: rgba(59,130,246,0.06); filter: blur(80px); top: -200px; left: -200px;
  }
  .bg-orb-2 {
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: rgba(245,158,11,0.05); filter: blur(80px); top: 300px; right: -250px;
  }

  /* ── Main Container (OPTIMIZED SPACING) ── */
  .blogs-container {
    max-width: 860px;
    margin: 0 auto;
    /* Dramatically reduced top padding for mobile */
    padding: clamp(20px, 5vw, 60px) clamp(16px, 4vw, 32px) clamp(40px, 8vw, 80px);
    position: relative;
    z-index: 2;
    flex: 1; 
  }
  
  .sec-label {
    display: inline-block;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: var(--navy);
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 10px; /* Reduced space */
    box-shadow: 0 4px 12px rgba(245,158,11,0.25);
  }
  
  .sec-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 6vw, 2.5rem); /* Reduced size for mobile */
    font-weight: 900;
    color: var(--navy);
    line-height: 1.15;
    margin-bottom: 8px; /* Reduced space */
  }
  
  .sec-title span {
    background: linear-gradient(135deg, var(--royal), var(--sky));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .sec-desc {
    color: var(--slate);
    font-size: clamp(0.85rem, 2vw, 1.05rem);
    line-height: 1.5;
    max-width: 500px;
    margin-bottom: 24px; /* Reduced drastically from 40px */
  }

  /* ── Compact Blog List ── */
  .blogs-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .blog-card {
    display: flex;
    align-items: center;
    gap: clamp(12px, 3vw, 16px);
    background: var(--card-bg);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    padding: clamp(10px, 3vw, 14px);
    text-decoration: none;
    box-shadow: 0 4px 20px rgba(11,20,55,0.04);
    border: 1px solid rgba(59,130,246,0.08);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }

  .blog-card::before {
    content: ''; 
    position: absolute; 
    top: 0; left: 0; bottom: 0; width: 4px;
    background: linear-gradient(180deg, var(--royal), var(--sky)); 
    border-radius: 20px 0 0 20px;
    opacity: 0;
    transition: opacity 0.25s;
  }

  .blog-card:hover, .blog-card:active {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(11,20,55,0.08);
  }

  .blog-card:hover::before, .blog-card:active::before {
    opacity: 1;
  }

  /* Compact Image Handling */
  .blog-img-wrap {
    width: clamp(76px, 20vw, 96px);
    aspect-ratio: 1;
    border-radius: 14px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(11,20,55,0.06);
    position: relative;
    background: linear-gradient(135deg, var(--navy), var(--royal));
  }

  .blog-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  .blog-card:hover .blog-img-wrap img {
    transform: scale(1.05);
  }

  .blog-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    min-width: 0;
  }

  .blog-title {
    font-family: 'Playfair Display', serif;
    font-weight: 800;
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    color: var(--navy);
    line-height: 1.2;
    margin: 0 0 4px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-excerpt {
    color: var(--slate);
    font-size: clamp(0.75rem, 1.8vw, 0.85rem);
    line-height: 1.4;
    margin: 0 0 8px 0;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* Truncated tighter for small screens */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .blog-date-pill {
    background: rgba(59,130,246,0.1);
    color: var(--royal);
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .blog-read-more {
    color: var(--sky);
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 800;
    font-size: 0.7rem;
    text-transform: uppercase;
  }

  .skel-bg {
    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
    background-size: 400% 100%;
    animation: skel-load 1.5s ease-in-out infinite;
  }
  @keyframes skel-load {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Site Footer ── */
  .site-footer {
    background: var(--navy);
    color: rgba(255,255,255,0.6);
    padding: 36px 24px;
    text-align: center;
    font-size: 0.85rem;
    margin-top: 40px;
  }
  .site-footer strong { color: var(--gold-light); }

  @media (max-width: 640px) {
    .site-footer { padding: 18px 14px; font-size: 0.72rem; margin-top: 24px; }
  }
`;

export default function Blogs() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setMsg("");

    const { data, error } = await supabase
      .from("blogs_posts")
      .select("id,title,slug,excerpt,cover_image_url,published_at")
      .is("deleted_at", null)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      setMsg("Unable to load insights right now. Please try again later.");
      setPosts([]);
      setLoading(false);
      return;
    }

    setPosts(data ||[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  },[]);

  const formatDate = (dateString) => {
    if (!dateString) return "New";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Framer Motion Variants
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-20px" },
    transition: { duration: 0.5 }
  };
  
  const stagger = (i) => ({
    ...fadeUp,
    transition: { duration: 0.4, delay: i * 0.08 }
  });

  return (
    <div className="blogs-root">
      <style>{styles}</style>

      {/* Subtle Background Orbs */}
      <div className="bg-orbs">
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
      </div>

      <div className="blogs-container">
        
        {/* Header Section (Optimized for space) */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="sec-label">Latest Updates</span>
          <h2 className="sec-title">AIDLA <span>Insights</span></h2>
          <p className="sec-desc">
            Discover educational strategies, app updates, and tips to maximize your learning and earnings.
          </p>
        </motion.div>

        {msg && (
          <motion.div style={{ background: "rgba(254, 226, 226, 0.9)", border: "1px solid #fca5a5", color: "#991b1b", padding: "12px", borderRadius: "12px", marginBottom: "20px", fontSize: "0.85rem", fontWeight: 600 }}>
            {msg}
          </motion.div>
        )}

        <div className="blogs-list">
          {loading ? (
            /* Premium Skeleton Loaders */[1, 2, 3, 4].map((n, i) => (
              <motion.div key={n} className="blog-card" {...stagger(i)}>
                <div className="blog-img-wrap skel-bg" style={{ background: "none" }} />
                <div className="blog-content">
                  <div className="skel-bg" style={{ height: "18px", width: "80%", borderRadius: "4px", marginBottom: "6px" }} />
                  <div className="skel-bg" style={{ height: "12px", width: "100%", borderRadius: "4px", marginBottom: "12px" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                     <div className="skel-bg" style={{ height: "20px", width: "70px", borderRadius: "10px" }} />
                     <div className="skel-bg" style={{ height: "14px", width: "40px", borderRadius: "4px" }} />
                  </div>
                </div>
              </motion.div>
            ))
          ) : posts.length > 0 ? (
            posts.map((p, i) => (
              /* FIX 1: Wrap Link in motion.div instead of using motion.Link to fix broken routing */
              <motion.div key={p.id} {...stagger(i)}>
                <Link to={`/blogs/${p.slug}`} className="blog-card">
                  <div className="blog-img-wrap">
                    {p.cover_image_url ? (
                      <img src={p.cover_image_url} alt={p.title} loading="lazy" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "1.5rem" }}>📰</span>
                      </div>
                    )}
                  </div>

                  <div className="blog-content">
                    <h3 className="blog-title">{p.title}</h3>
                    <p className="blog-excerpt">{p.excerpt || "Click to read this full article..."}</p>
                    
                    <div className="blog-meta">
                      <span className="blog-date-pill">{formatDate(p.published_at)}</span>
                      <span className="blog-read-more">
                        Read <span style={{ fontSize: "1.2rem", lineHeight: 0, marginLeft: 2 }}>›</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            /* Empty State */
            !msg && (
              <motion.div style={{ textAlign: "center", padding: "40px 20px", background: "var(--card-bg)", borderRadius: "20px", border: "1px dashed rgba(59,130,246,0.2)" }} {...fadeUp}>
                <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "12px" }}>📚</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", fontSize: "1.25rem", margin: "0 0 8px 0" }}>
                  No Insights Yet
                </h3>
                <p style={{ color: "var(--slate)", margin: 0, fontSize: "0.85rem" }}>
                  We're cooking up some great content. Check back soon!
                </p>
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="site-footer">
        <div style={{ marginBottom: 10, fontSize: "1.1rem" }}>🕌</div>
        <p>© 2025 <strong>AIDLA</strong>. All rights reserved. Designed with ❤️ for learners everywhere.</p>
        <p style={{ marginTop: 8 }}>
          <Link to="/privacy-policy" style={{ color: "rgba(255,255,255,0.4)", marginRight: 16, textDecoration: "none" }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: "rgba(255,255,255,0.4)", marginRight: 16, textDecoration: "none" }}>Terms</Link>
          <Link to="/contact" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Contact</Link>
        </p>
      </footer>
    </div>
  );
}