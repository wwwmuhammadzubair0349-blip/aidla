import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  .blogpost-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* ── Background Orbs ── */
  .bp-orbs {
    position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
  }
  .bp-orb-1 {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: rgba(59,130,246,0.06); filter: blur(80px); top: -200px; left: -200px;
  }
  .bp-orb-2 {
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: rgba(245,158,11,0.05); filter: blur(80px); top: 300px; right: -250px;
  }
  .bp-orb-3 {
    position: absolute; width: 400px; height: 400px; border-radius: 50%;
    background: rgba(26,58,143,0.04); filter: blur(80px); bottom: 100px; left: 30%;
  }

  /* ── Container ── */
  .blogpost-container {
    flex: 1;
    max-width: 860px;
    margin: 0 auto;
    padding: clamp(20px, 5vw, 60px) clamp(14px, 4vw, 32px) clamp(40px, 8vw, 80px);
    position: relative;
    z-index: 2;
    width: 100%;
    box-sizing: border-box;
  }

  /* ── Back Link ── */
  .bp-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--royal);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-decoration: none;
    background: rgba(59,130,246,0.08);
    padding: 6px 12px;
    border-radius: 30px;
    margin-bottom: clamp(16px, 4vw, 28px);
    transition: background 0.2s, transform 0.2s;
  }
  .bp-back:hover { background: rgba(59,130,246,0.15); transform: translateX(-2px); }
  .bp-back-arrow { font-size: 1rem; line-height: 1; }

  /* ── Article Card Shell ── */
  .bp-article-card {
    background: var(--card-bg);
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(11,20,55,0.07);
    border: 1px solid rgba(59,130,246,0.08);
    overflow: hidden;
  }

  /* ── Cover Image ── */
  .bp-cover-wrap {
    width: 100%;
    aspect-ratio: 16/7;
    overflow: hidden;
    position: relative;
    background: linear-gradient(135deg, var(--navy), var(--royal));
  }
  .bp-cover-wrap img {
    width: 100%; height: 100%; object-fit: cover;
    display: block;
    transition: transform 6s ease;
  }
  .bp-cover-wrap::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(11,20,55,0.25) 100%);
  }
  .bp-cover-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: clamp(2rem, 8vw, 3.5rem);
  }

  /* ── Article Body Padding ── */
  .bp-body {
    padding: clamp(18px, 5vw, 40px) clamp(16px, 5vw, 44px);
  }

  /* ── Label / Badge ── */
  .bp-label {
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

  /* ── Title ── */
  .bp-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.4rem, 5.5vw, 2.6rem);
    font-weight: 900;
    color: var(--navy);
    line-height: 1.15;
    margin: 0 0 16px 0;
    word-break: break-word;
  }

  /* ── Meta Row ── */
  .bp-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: clamp(16px, 4vw, 28px);
    padding-bottom: clamp(14px, 3.5vw, 22px);
    border-bottom: 1px solid rgba(59,130,246,0.1);
  }
  .bp-date-pill {
    background: rgba(59,130,246,0.1);
    color: var(--royal);
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .bp-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--slate); opacity: 0.4;
  }
  .bp-read-time {
    color: var(--slate);
    font-size: 0.7rem;
    font-weight: 600;
  }

  /* ── Excerpt / Pull Quote ── */
  .bp-excerpt {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    color: var(--royal);
    font-style: italic;
    line-height: 1.65;
    margin: 0 0 clamp(16px, 4vw, 28px) 0;
    padding: clamp(10px, 3vw, 16px) clamp(14px, 3.5vw, 22px);
    border-left: 3px solid var(--sky);
    background: rgba(59,130,246,0.04);
    border-radius: 0 12px 12px 0;
  }

  /* ── Content Body ── */
  .bp-content {
    color: #2d3748;
    font-size: clamp(0.88rem, 2.2vw, 1.02rem);
    line-height: 1.85;
    word-break: break-word;
  }

  .bp-content p {
    margin: 0 0 16px 0;
  }

  .bp-content h1, .bp-content h2, .bp-content h3,
  .bp-content h4, .bp-content h5, .bp-content h6 {
    font-family: 'Playfair Display', serif;
    color: var(--navy);
    margin: clamp(20px, 4vw, 32px) 0 10px;
    line-height: 1.2;
    font-weight: 800;
  }

  .bp-content h2 { font-size: clamp(1.2rem, 4vw, 1.7rem); }
  .bp-content h3 { font-size: clamp(1.05rem, 3.5vw, 1.4rem); }

  .bp-content img {
    max-width: 100%;
    border-radius: 14px;
    margin: 20px 0;
    box-shadow: 0 6px 24px rgba(11,20,55,0.1);
    display: block;
  }

  .bp-content a {
    color: var(--sky);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .bp-content ul, .bp-content ol {
    padding-left: clamp(16px, 4vw, 24px);
    margin: 0 0 16px;
  }

  .bp-content li {
    margin-bottom: 6px;
  }

  .bp-content blockquote {
    margin: 20px 0;
    padding: 12px 18px;
    border-left: 3px solid var(--gold);
    background: rgba(245,158,11,0.05);
    border-radius: 0 10px 10px 0;
    font-style: italic;
    color: var(--slate);
  }

  .bp-content pre {
    background: var(--navy);
    color: #e2e8f0;
    padding: 16px;
    border-radius: 12px;
    overflow-x: auto;
    font-size: 0.8rem;
    line-height: 1.6;
    margin: 16px 0;
  }

  .bp-content code {
    background: rgba(59,130,246,0.1);
    color: var(--royal);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.85em;
  }

  .bp-content pre code {
    background: none;
    color: inherit;
    padding: 0;
  }

  /* ── Divider ── */
  .bp-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent);
    margin: clamp(18px, 4vw, 28px) 0;
  }

  /* ── Footer CTA ── */
  .bp-footer-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: clamp(14px, 3.5vw, 20px) clamp(16px, 5vw, 44px);
    background: rgba(59,130,246,0.03);
    border-top: 1px solid rgba(59,130,246,0.09);
  }
  .bp-footer-cta-text {
    color: var(--slate);
    font-size: 0.8rem;
    font-weight: 500;
  }
  .bp-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, var(--royal), var(--sky));
    color: #fff;
    text-decoration: none;
    padding: 9px 18px;
    border-radius: 30px;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    box-shadow: 0 4px 14px rgba(26,58,143,0.25);
    transition: transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .bp-back-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(26,58,143,0.32); }

  /* ── Loading Skeleton ── */
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

  .bp-skeleton-cover {
    width: 100%; aspect-ratio: 16/7;
    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
    background-size: 400% 100%;
    animation: skel-load 1.5s ease-in-out infinite;
  }

  /* ── Error Card ── */
  .bp-error {
    background: rgba(254,226,226,0.9);
    border: 1px solid #fca5a5;
    color: #991b1b;
    padding: clamp(14px, 4vw, 20px);
    border-radius: 16px;
    margin-bottom: 20px;
    font-size: 0.88rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* ── Not Found ── */
  .bp-not-found {
    text-align: center;
    padding: clamp(30px, 8vw, 60px) 20px;
    background: var(--card-bg);
    border-radius: 24px;
    border: 1px dashed rgba(59,130,246,0.2);
    box-shadow: 0 4px 20px rgba(11,20,55,0.04);
  }
  .bp-not-found h2 {
    font-family: 'Playfair Display', serif;
    color: var(--navy);
    font-size: clamp(1.2rem, 4vw, 1.6rem);
    margin: 12px 0 8px;
  }
  .bp-not-found p {
    color: var(--slate);
    font-size: clamp(0.8rem, 2vw, 0.95rem);
    margin: 0 0 20px;
  }

  /* ── Site Footer ── */
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
  .site-footer a {
    color: rgba(255,255,255,0.4);
    text-decoration: none;
    margin: 0 10px;
    transition: color 0.2s;
  }
  .site-footer a:hover { color: #fff; }

  @media (max-width: 640px) {
    .site-footer { padding: 18px 14px; font-size: 0.72rem; margin-top: 24px; }
    .bp-footer-cta { justify-content: center; text-align: center; }
  }

  /* ── 320px specific tweaks ── */
  @media (max-width: 360px) {
    .bp-title { font-size: 1.25rem; }
    .bp-body { padding: 14px 12px; }
    .bp-footer-cta { padding: 12px; }
    .bp-back { font-size: 0.68rem; padding: 5px 10px; }
  }
`;

function setMeta({ title, description, canonical }) {
  if (title) document.title = title;
  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement("meta");
    descTag.setAttribute("name", "description");
    document.head.appendChild(descTag);
  }
  descTag.setAttribute("content", description || "");
  let canon = document.querySelector('link[rel="canonical"]');
  if (!canon) {
    canon = document.createElement("link");
    canon.setAttribute("rel", "canonical");
    document.head.appendChild(canon);
  }
  canon.setAttribute("href", canonical || window.location.href);
}

function estimateReadTime(text) {
  if (!text) return null;
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function BlogPost() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMsg("");

      const { data, error } = await supabase
        .from("blogs_posts")
        .select("*")
        .is("deleted_at", null)
        .eq("status", "published")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        setMsg(error.message);
        setPost(null);
        setLoading(false);
        return;
      }
      if (!data) {
        setMsg("");
        setPost(null);
        setLoading(false);
        return;
      }

      setPost(data);

      const siteUrl = "https://aidla.netlify.app";
      const canonical = data.canonical_url || `${siteUrl}/blogs/${slug}`;
      const metaTitle = data.meta_title || data.title || "Blog";
      const metaDesc = data.meta_description || data.excerpt || "";
      setMeta({ title: metaTitle, description: metaDesc, canonical });
      setLoading(false);
    };

    load();
  }, [slug]);

  const formatDate = (dateString) => {
    if (!dateString) return "New";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="blogpost-root">
      <style>{styles}</style>

      {/* Background Orbs */}
      <div className="bp-orbs">
        <div className="bp-orb-1" />
        <div className="bp-orb-2" />
        <div className="bp-orb-3" />
      </div>

      <div className="blogpost-container">

        {/* Back Navigation */}
        <motion.div {...fadeUp}>
          <Link to="/blogs" className="bp-back">
            <span className="bp-back-arrow">‹</span>
            All Insights
          </Link>
        </motion.div>

        {/* Error */}
        {msg && (
          <motion.div className="bp-error" {...fadeUp}>
            <span style={{ fontSize: "1.1rem" }}>⚠️</span>
            {msg}
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <motion.div
            className="bp-article-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bp-skeleton-cover" />
            <div className="bp-body">
              <div className="skel-bg" style={{ height: "13px", width: "80px", marginBottom: "14px" }} />
              <div className="skel-bg" style={{ height: "30px", width: "90%", marginBottom: "10px" }} />
              <div className="skel-bg" style={{ height: "22px", width: "60%", marginBottom: "22px" }} />
              <div className="skel-bg" style={{ height: "13px", width: "100%", marginBottom: "8px" }} />
              <div className="skel-bg" style={{ height: "13px", width: "100%", marginBottom: "8px" }} />
              <div className="skel-bg" style={{ height: "13px", width: "78%", marginBottom: "8px" }} />
              <div style={{ height: "20px" }} />
              <div className="skel-bg" style={{ height: "13px", width: "100%", marginBottom: "8px" }} />
              <div className="skel-bg" style={{ height: "13px", width: "95%", marginBottom: "8px" }} />
              <div className="skel-bg" style={{ height: "13px", width: "82%" }} />
            </div>
          </motion.div>
        )}

        {/* Not Found */}
        {!loading && !post && !msg && (
          <motion.div className="bp-not-found" {...fadeUp}>
            <span style={{ fontSize: "2.5rem", display: "block" }}>📭</span>
            <h2>Insight Not Found</h2>
            <p>This article may have been moved or unpublished.</p>
            <Link to="/blogs" className="bp-back-btn">
              ‹ Back to Insights
            </Link>
          </motion.div>
        )}

        {/* Article */}
        {post && (
          <motion.div
            className="bp-article-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {/* Cover Image */}
            {post.cover_image_url ? (
              <div className="bp-cover-wrap">
                <img src={post.cover_image_url} alt={post.title} loading="lazy" />
              </div>
            ) : (
              <div className="bp-cover-wrap">
                <div className="bp-cover-placeholder">📰</div>
              </div>
            )}

            {/* Body */}
            <div className="bp-body">
              {/* Label */}
              <span className="bp-label">AIDLA Insights</span>

              {/* Title */}
              <h1 className="bp-title">{post.title}</h1>

              {/* Meta Row */}
              <div className="bp-meta">
                <span className="bp-date-pill">{formatDate(post.published_at)}</span>
                {post.content && (
                  <>
                    <span className="bp-dot" />
                    <span className="bp-read-time">{estimateReadTime(post.content)}</span>
                  </>
                )}
              </div>

              {/* Excerpt Pull Quote */}
              {post.excerpt && (
                <p className="bp-excerpt">{post.excerpt}</p>
              )}

              {/* Divider */}
              <div className="bp-divider" />

              {/* Content */}
              <div
                className="bp-content"
                dangerouslySetInnerHTML={
                  post.content_html
                    ? { __html: post.content_html }
                    : undefined
                }
              >
                {!post.content_html && post.content
                  ? post.content.split("\n").map((line, i) =>
                      line.trim() === "" ? (
                        <br key={i} />
                      ) : (
                        <p key={i}>{line}</p>
                      )
                    )
                  : null}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="bp-footer-cta">
              <span className="bp-footer-cta-text">
                Thanks for reading this insight ✨
              </span>
              <Link to="/blogs" className="bp-back-btn">
                ‹ More Insights
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Site Footer */}
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