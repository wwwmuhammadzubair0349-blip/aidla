import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
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

  .newspost-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .np-orbs { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .np-orb-1 {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: rgba(59,130,246,0.06); filter: blur(80px); top: -200px; left: -200px;
  }
  .np-orb-2 {
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: rgba(245,158,11,0.05); filter: blur(80px); top: 300px; right: -250px;
  }
  .np-orb-3 {
    position: absolute; width: 400px; height: 400px; border-radius: 50%;
    background: rgba(26,58,143,0.04); filter: blur(80px); bottom: 100px; left: 30%;
  }

  .newspost-container {
    flex: 1;
    max-width: 860px;
    margin: 0 auto;
    padding: clamp(20px, 5vw, 60px) clamp(14px, 4vw, 32px) clamp(40px, 8vw, 80px);
    position: relative;
    z-index: 2;
    width: 100%;
    box-sizing: border-box;
  }

  /* Back link */
  .np-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #92400e;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-decoration: none;
    background: rgba(245,158,11,0.1);
    padding: 6px 12px;
    border-radius: 30px;
    margin-bottom: clamp(16px, 4vw, 28px);
    transition: background 0.2s, transform 0.2s;
  }
  .np-back:hover { background: rgba(245,158,11,0.18); transform: translateX(-2px); }

  /* Article card */
  .np-article-card {
    background: var(--card-bg);
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(11,20,55,0.07);
    border: 1px solid rgba(245,158,11,0.1);
    overflow: hidden;
  }

  /* Cover */
  .np-cover-wrap {
    width: 100%;
    aspect-ratio: 16/7;
    overflow: hidden;
    position: relative;
    background: linear-gradient(135deg, var(--navy), #2d1a00);
  }
  .np-cover-wrap img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  .np-cover-wrap::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(11,20,55,0.25) 100%);
  }
  .np-cover-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: clamp(2rem, 8vw, 3.5rem);
  }

  /* Body */
  .np-body {
    padding: clamp(18px, 5vw, 40px) clamp(16px, 5vw, 44px);
  }

  /* Label */
  .np-label {
    display: inline-block;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: var(--navy);
    padding: 5px 12px;
    border-radius: 30px;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 12px;
    box-shadow: 0 4px 12px rgba(245,158,11,0.25);
  }

  /* Category tag */
  .np-category {
    display: inline-block;
    background: rgba(245,158,11,0.12);
    color: #92400e;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-left: 8px;
    vertical-align: middle;
  }

  .np-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.4rem, 5.5vw, 2.6rem);
    font-weight: 900;
    color: var(--navy);
    line-height: 1.15;
    margin: 0 0 16px 0;
    word-break: break-word;
  }

  .np-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: clamp(16px, 4vw, 28px);
    padding-bottom: clamp(14px, 3.5vw, 22px);
    border-bottom: 1px solid rgba(245,158,11,0.12);
  }

  .np-date-pill {
    background: rgba(245,158,11,0.1);
    color: #92400e;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .np-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--slate); opacity: 0.4;
  }

  .np-read-time {
    color: var(--slate);
    font-size: 0.7rem;
    font-weight: 600;
  }

  .np-excerpt {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    color: #92400e;
    font-style: italic;
    line-height: 1.65;
    margin: 0 0 clamp(16px, 4vw, 28px) 0;
    padding: clamp(10px, 3vw, 16px) clamp(14px, 3.5vw, 22px);
    border-left: 3px solid var(--gold);
    background: rgba(245,158,11,0.05);
    border-radius: 0 12px 12px 0;
  }

  .np-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245,158,11,0.25), transparent);
    margin: clamp(18px, 4vw, 28px) 0;
  }

  /* Content */
  .np-content {
    color: #2d3748;
    font-size: clamp(0.88rem, 2.2vw, 1.02rem);
    line-height: 1.85;
    word-break: break-word;
  }
  .np-content p { margin: 0 0 16px 0; }
  .np-content h1,.np-content h2,.np-content h3,
  .np-content h4,.np-content h5,.np-content h6 {
    font-family: 'Playfair Display', serif;
    color: var(--navy);
    margin: clamp(20px, 4vw, 32px) 0 10px;
    line-height: 1.2; font-weight: 800;
  }
  .np-content h2 { font-size: clamp(1.2rem, 4vw, 1.7rem); }
  .np-content h3 { font-size: clamp(1.05rem, 3.5vw, 1.4rem); }
  .np-content img {
    max-width: 100%; border-radius: 14px; margin: 20px 0;
    box-shadow: 0 6px 24px rgba(11,20,55,0.1); display: block;
  }
  .np-content a { color: var(--gold); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
  .np-content ul,.np-content ol { padding-left: clamp(16px, 4vw, 24px); margin: 0 0 16px; }
  .np-content li { margin-bottom: 6px; }
  .np-content blockquote {
    margin: 20px 0; padding: 12px 18px;
    border-left: 3px solid var(--gold);
    background: rgba(245,158,11,0.05); border-radius: 0 10px 10px 0;
    font-style: italic; color: var(--slate);
  }
  .np-content pre {
    background: var(--navy); color: #e2e8f0;
    padding: 16px; border-radius: 12px; overflow-x: auto;
    font-size: 0.8rem; line-height: 1.6; margin: 16px 0;
  }
  .np-content code {
    background: rgba(245,158,11,0.1); color: #92400e;
    padding: 2px 6px; border-radius: 4px; font-size: 0.85em;
  }
  .np-content pre code { background: none; color: inherit; padding: 0; }

  /* Footer CTA */
  .np-footer-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: clamp(14px, 3.5vw, 20px) clamp(16px, 5vw, 44px);
    background: rgba(245,158,11,0.03);
    border-top: 1px solid rgba(245,158,11,0.1);
  }
  .np-footer-cta-text { color: var(--slate); font-size: 0.8rem; font-weight: 500; }
  .np-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, var(--gold), #d97706);
    color: var(--navy);
    text-decoration: none;
    padding: 9px 18px;
    border-radius: 30px;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    box-shadow: 0 4px 14px rgba(245,158,11,0.3);
    transition: transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .np-back-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(245,158,11,0.4); }

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
  .np-skeleton-cover {
    width: 100%; aspect-ratio: 16/7;
    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
    background-size: 400% 100%;
    animation: skel-load 1.5s ease-in-out infinite;
  }

  /* Error */
  .np-error {
    background: rgba(254,226,226,0.9);
    border: 1px solid #fca5a5;
    color: #991b1b;
    padding: clamp(12px, 3vw, 18px);
    border-radius: 16px;
    margin-bottom: 20px;
    font-size: 0.88rem;
    font-weight: 600;
    display: flex; align-items: center; gap: 10px;
  }

  /* Not found */
  .np-not-found {
    text-align: center;
    padding: clamp(30px, 8vw, 60px) 20px;
    background: var(--card-bg);
    border-radius: 24px;
    border: 1px dashed rgba(245,158,11,0.25);
    box-shadow: 0 4px 20px rgba(11,20,55,0.04);
  }
  .np-not-found h2 {
    font-family: 'Playfair Display', serif;
    color: var(--navy);
    font-size: clamp(1.2rem, 4vw, 1.6rem);
    margin: 12px 0 8px;
  }
  .np-not-found p { color: var(--slate); font-size: clamp(0.8rem, 2vw, 0.95rem); margin: 0 0 20px; }

  /* Footer */
  .site-footer {
    background: var(--navy);
    color: rgba(255,255,255,0.6);
    padding: 36px 24px;
    text-align: center;
    font-size: 0.85rem;
    margin-top: 40px;
    position: relative; z-index: 2;
  }
  .site-footer strong { color: var(--gold-light); }
  .site-footer a { color: rgba(255,255,255,0.4); text-decoration: none; margin: 0 10px; }
  .site-footer a:hover { color: #fff; }

  @media (max-width: 640px) {
    .site-footer { padding: 18px 14px; font-size: 0.72rem; margin-top: 24px; }
    .np-footer-cta { justify-content: center; text-align: center; }
  }

  @media (max-width: 360px) {
    .newspost-container { padding: 16px 12px 40px; }
    .np-title { font-size: 1.25rem; }
    .np-body { padding: 14px 12px; }
    .np-footer-cta { padding: 12px; }
  }
`;

function estimateReadTime(text) {
  if (!text) return null;
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function NewsPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMsg("");

      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .is("deleted_at", null)
        .maybeSingle();

      if (error) {
        setMsg(error.message);
        setPost(null);
        setLoading(false);
        return;
      }

      if (!data) {
        setPost(null);
        setLoading(false);
        return;
      }

      setPost(data);

      // SEO meta
      document.title = data.meta_title || data.title || "News";

      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement("meta");
        descTag.setAttribute("name", "description");
        document.head.appendChild(descTag);
      }
      descTag.setAttribute("content", data.meta_description || data.excerpt || "");

      const siteUrl = "https://aidla.netlify.app";
      let canon = document.querySelector('link[rel="canonical"]');
      if (!canon) {
        canon = document.createElement("link");
        canon.setAttribute("rel", "canonical");
        document.head.appendChild(canon);
      }
      canon.setAttribute("href", data.canonical_url || `${siteUrl}/news/${slug}`);

      setLoading(false);
    };

    load();
  }, [slug]);

  const formatDate = (d) => {
    if (!d) return "New";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <div className="newspost-root">
      <style>{styles}</style>

      <div className="np-orbs">
        <div className="np-orb-1" />
        <div className="np-orb-2" />
        <div className="np-orb-3" />
      </div>

      <div className="newspost-container">

        {/* Back nav */}
        <motion.div {...fadeUp}>
          <Link to="/news" className="np-back">
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>‹</span>
            All News
          </Link>
        </motion.div>

        {/* Error */}
        {msg && (
          <div className="np-error">
            <span>⚠️</span> {msg}
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <motion.div
            className="np-article-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="np-skeleton-cover" />
            <div className="np-body">
              <div className="skel-bg" style={{ height: "13px", width: "80px", marginBottom: "14px" }} />
              <div className="skel-bg" style={{ height: "30px", width: "90%", marginBottom: "10px" }} />
              <div className="skel-bg" style={{ height: "22px", width: "60%", marginBottom: "22px" }} />
              <div className="skel-bg" style={{ height: "13px", width: "100%", marginBottom: "8px" }} />
              <div className="skel-bg" style={{ height: "13px", width: "100%", marginBottom: "8px" }} />
              <div className="skel-bg" style={{ height: "13px", width: "75%", marginBottom: "8px" }} />
              <div style={{ height: "20px" }} />
              <div className="skel-bg" style={{ height: "13px", width: "100%", marginBottom: "8px" }} />
              <div className="skel-bg" style={{ height: "13px", width: "88%" }} />
            </div>
          </motion.div>
        )}

        {/* Not found */}
        {!loading && !post && !msg && (
          <motion.div className="np-not-found" {...fadeUp}>
            <span style={{ fontSize: "2.5rem", display: "block" }}>📭</span>
            <h2>Story Not Found</h2>
            <p>This article may have been moved or is no longer available.</p>
            <Link to="/news" className="np-back-btn">‹ Back to News</Link>
          </motion.div>
        )}

        {/* Article */}
        {post && (
          <motion.div
            className="np-article-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {/* Cover */}
            <div className="np-cover-wrap">
              {post.cover_image_url ? (
                <img src={post.cover_image_url} alt={post.title} loading="lazy" />
              ) : (
                <div className="np-cover-placeholder">📡</div>
              )}
            </div>

            {/* Body */}
            <div className="np-body">
              <div>
                <span className="np-label">AIDLA News</span>
                {post.category && <span className="np-category">{post.category}</span>}
              </div>

              <h1 className="np-title">{post.title}</h1>

              <div className="np-meta">
                <span className="np-date-pill">{formatDate(post.created_at)}</span>
                {post.content && (
                  <>
                    <span className="np-dot" />
                    <span className="np-read-time">{estimateReadTime(post.content)}</span>
                  </>
                )}
              </div>

              {post.excerpt && <p className="np-excerpt">{post.excerpt}</p>}

              <div className="np-divider" />

              <div className="np-content"
                dangerouslySetInnerHTML={
                  post.content_html ? { __html: post.content_html } : undefined
                }
              >
                {!post.content_html && post.content
                  ? post.content.split("\n").map((line, i) =>
                      line.trim() === "" ? <br key={i} /> : <p key={i}>{line}</p>
                    )
                  : null}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="np-footer-cta">
              <span className="np-footer-cta-text">Thanks for reading ✨</span>
              <Link to="/news" className="np-back-btn">‹ More News</Link>
            </div>
          </motion.div>
        )}
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