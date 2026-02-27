import { useEffect, useState } from "react";
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
    --card-bg: rgba(255, 255, 255, 0.97);
  }

  .news-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .bg-orbs { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .bg-orb-1 {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: rgba(59,130,246,0.06); filter: blur(80px); top: -200px; left: -200px;
  }
  .bg-orb-2 {
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: rgba(245,158,11,0.05); filter: blur(80px); top: 300px; right: -250px;
  }

  .news-container {
    max-width: 860px;
    margin: 0 auto;
    padding: clamp(20px, 5vw, 60px) clamp(14px, 4vw, 32px) clamp(40px, 8vw, 80px);
    position: relative;
    z-index: 2;
    flex: 1;
    box-sizing: border-box;
    width: 100%;
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
    margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(245,158,11,0.25);
  }

  .sec-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 6vw, 2.5rem);
    font-weight: 900;
    color: var(--navy);
    line-height: 1.15;
    margin-bottom: 8px;
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
    margin-bottom: 24px;
  }

  /* ── News List ── */
  .news-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .news-card {
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

  .news-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; bottom: 0; width: 4px;
    background: linear-gradient(180deg, var(--gold), var(--gold-light));
    border-radius: 20px 0 0 20px;
    opacity: 0;
    transition: opacity 0.25s;
  }

  .news-card:hover, .news-card:active {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(11,20,55,0.08);
  }

  .news-card:hover::before, .news-card:active::before { opacity: 1; }

  .news-img-wrap {
    width: clamp(76px, 20vw, 96px);
    aspect-ratio: 1;
    border-radius: 14px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(11,20,55,0.06);
    background: linear-gradient(135deg, var(--navy), var(--royal));
  }

  .news-img-wrap img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s;
    display: block;
  }

  .news-card:hover .news-img-wrap img { transform: scale(1.05); }

  .news-img-wrap .news-img-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
  }

  .news-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    min-width: 0;
  }

  .news-title {
    font-family: 'Playfair Display', serif;
    font-weight: 800;
    font-size: clamp(0.95rem, 2.5vw, 1.15rem);
    color: var(--navy);
    line-height: 1.2;
    margin: 0 0 4px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .news-excerpt {
    color: var(--slate);
    font-size: clamp(0.75rem, 1.8vw, 0.85rem);
    line-height: 1.4;
    margin: 0 0 8px 0;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .news-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .news-date-pill {
    background: rgba(245,158,11,0.1);
    color: #92400e;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .news-read-more {
    color: var(--gold);
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 800;
    font-size: 0.7rem;
    text-transform: uppercase;
  }

  /* Skeleton */
  .skel-bg {
    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
    background-size: 400% 100%;
    animation: skel-load 1.5s ease-in-out infinite;
    border-radius: 6px;
  }
  @keyframes skel-load {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Error */
  .news-error {
    background: rgba(254,226,226,0.9);
    border: 1px solid #fca5a5;
    color: #991b1b;
    padding: 12px 16px;
    border-radius: 12px;
    margin-bottom: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Empty */
  .news-empty {
    text-align: center;
    padding: 40px 20px;
    background: var(--card-bg);
    border-radius: 20px;
    border: 1px dashed rgba(245,158,11,0.25);
  }

  /* Footer */
  .site-footer {
    background: var(--navy);
    color: rgba(255,255,255,0.6);
    padding: 36px 24px;
    text-align: center;
    font-size: 0.85rem;
    margin-top: 40px;
    position: relative;
    z-index: 2;
  }
  .site-footer strong { color: var(--gold-light); }
  .site-footer a { color: rgba(255,255,255,0.4); text-decoration: none; margin: 0 10px; }
  .site-footer a:hover { color: #fff; }

  @media (max-width: 640px) {
    .site-footer { padding: 18px 14px; font-size: 0.72rem; margin-top: 24px; }
  }

  @media (max-width: 360px) {
    .news-container { padding: 16px 12px 40px; }
  }
`;

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .is("deleted_at", null)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        setMsg("Unable to load news right now. Please try again later.");
      } else {
        setNews(data || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const formatDate = (d) => {
    if (!d) return "New";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  const stagger = (i) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-20px" },
    transition: { duration: 0.4, delay: i * 0.08 },
  });

  return (
    <div className="news-root">
      <style>{styles}</style>

      <div className="bg-orbs">
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
      </div>

      <div className="news-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="sec-label">Breaking Updates</span>
          <h2 className="sec-title">AIDLA <span>News</span></h2>
          <p className="sec-desc">
            Stay informed with the latest announcements, updates, and community highlights from AIDLA.
          </p>
        </motion.div>

        {msg && (
          <div className="news-error">
            <span>⚠️</span> {msg}
          </div>
        )}

        <div className="news-list">
          {loading ? (
            [1, 2, 3].map((n, i) => (
              <motion.div key={n} className="news-card" {...stagger(i)}>
                <div className="news-img-wrap skel-bg" style={{ background: "none" }} />
                <div className="news-content">
                  <div className="skel-bg" style={{ height: "11px", width: "60px", marginBottom: "6px" }} />
                  <div className="skel-bg" style={{ height: "18px", width: "80%", marginBottom: "6px" }} />
                  <div className="skel-bg" style={{ height: "12px", width: "100%", marginBottom: "12px" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="skel-bg" style={{ height: "20px", width: "70px", borderRadius: "10px" }} />
                    <div className="skel-bg" style={{ height: "14px", width: "40px" }} />
                  </div>
                </div>
              </motion.div>
            ))
          ) : news.length > 0 ? (
            news.map((n, i) => (
              <motion.div key={n.id} {...stagger(i)}>
                <Link to={`/news/${n.slug}`} className="news-card">
                  <div className="news-img-wrap">
                    {n.cover_image_url ? (
                      <img src={n.cover_image_url} alt={n.title} loading="lazy" />
                    ) : (
                      <div className="news-img-placeholder">📡</div>
                    )}
                  </div>
                  <div className="news-content">
                    <h3 className="news-title">{n.title}</h3>
                    <p className="news-excerpt">{n.excerpt || "Click to read the full story..."}</p>
                    <div className="news-meta">
                      <span className="news-date-pill">{formatDate(n.created_at)}</span>
                      <span className="news-read-more">
                        Read <span style={{ fontSize: "1.2rem", lineHeight: 0, marginLeft: 2 }}>›</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : !msg && (
            <motion.div
              className="news-empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "12px" }}>📡</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", fontSize: "1.25rem", margin: "0 0 8px" }}>
                No News Yet
              </h3>
              <p style={{ color: "var(--slate)", margin: 0, fontSize: "0.85rem" }}>
                Big things are coming. Stay tuned!
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <footer className="site-footer">
        <div style={{ marginBottom: 10, fontSize: "1.1rem" }}>🕌</div>
        <p>© 2025 <strong>AIDLA</strong>. All rights reserved. Designed with ❤️ for learners everywhere.</p>
        <p style={{ marginTop: 8 }}>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </p>
      </footer>
    </div>
  );
}