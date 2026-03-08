import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet"; // or "react-helmet-async"
import { supabase } from "../lib/supabase";
import Footer from "../pages/components/Footer"; // adjust path if needed
import "./news.css";

const CAT_COLORS = {
  general: "#3b82f6",
  politics: "#8b5cf6",
  education: "#0891b2",
  technology: "#0f766e",
  community: "#16a34a",
  events: "#d97706",
  announcements: "#dc2626",
};

const CAT_LABELS = {
  general: "🌐 General",
  politics: "🏛️ Politics",
  education: "📚 Education",
  technology: "💻 Technology",
  community: "🤝 Community",
  events: "🎯 Events",
  announcements: "📢 Announcements",
};

const KNOWN_CATS = Object.keys(CAT_COLORS);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-20px" },
  transition: { duration: 0.5 },
};

const stagger = (i) => ({
  ...fadeUp,
  transition: { duration: 0.4, delay: i * 0.08 },
});

function formatDate(d) {
  if (!d) return "New";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Canonical URL – replace with your actual domain
const CANONICAL_URL = "https://aidla.online/news";
const OG_IMAGE = "https://aidla.online/og-news.jpg";
const TWITTER_IMAGE = "https://aidla.online/twitter-news.jpg";

export default function News() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [activeCat, setActiveCat] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMsg("");
      const { data, error } = await supabase
        .from("news_posts")
        .select("id,title,slug,excerpt,cover_image_url,published_at,tags,view_count")
        .is("deleted_at", null)
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) {
        setMsg("Unable to load news right now. Please try again.");
        setPosts([]);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Breaking posts
  const breakingPosts = useMemo(
    () => posts.filter((p) => (p.tags || []).includes("breaking")),
    [posts]
  );

  // All unique non-system tags
  const allTags = useMemo(() => {
    const set = new Set();
    posts.forEach((p) =>
      (p.tags || []).forEach((t) => {
        if (!KNOWN_CATS.includes(t) && t !== "breaking") set.add(t);
      })
    );
    return Array.from(set).sort();
  }, [posts]);

  // Categories present
  const allCats = useMemo(() => {
    const set = new Set();
    posts.forEach((p) =>
      (p.tags || []).forEach((t) => {
        if (KNOWN_CATS.includes(t)) set.add(t);
      })
    );
    return Array.from(set);
  }, [posts]);

  // Popular
  const popularPosts = useMemo(
    () => [...posts].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5),
    [posts]
  );

  // Filtered
  const filtered = useMemo(() => {
    let r = [...posts];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeCat !== "all") r = r.filter((p) => (p.tags || []).includes(activeCat));
    if (activeTag !== "all") r = r.filter((p) => (p.tags || []).includes(activeTag));
    if (sort === "newest") {
      r.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    } else if (sort === "most_viewed") {
      r.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }
    return r;
  }, [posts, search, activeCat, activeTag, sort]);

  const clearFilters = () => {
    setSearch("");
    setActiveTag("all");
    setActiveCat("all");
    setSort("newest");
  };

  // JSON-LD structured data for the news listing page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AIDLA News",
    "description": "Stay updated with the latest announcements, events, and community news from AIDLA.",
    "url": CANONICAL_URL,
    "inLanguage": "en",
    "isPartOf": {
      "@type": "WebSite",
      "name": "AIDLA",
      "url": "https://aidla.online"
    }
  };

  return (
    <>
      <Helmet>
        {/* Basic SEO */}
        <title>AIDLA News – Latest Updates, Announcements & Events</title>
        <meta
          name="description"
          content="Read the latest news from AIDLA: platform updates, community events, educational tips, and winner announcements."
        />
        <meta
          name="keywords"
          content="AIDLA news, platform updates, community events, educational news, Pakistan edtech, learning platform"
        />
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href={CANONICAL_URL} />

        {/* Open Graph */}
        <meta property="og:title" content="AIDLA News – Latest Updates & Announcements" />
        <meta property="og:description" content="Stay informed with AIDLA's latest news, events, and winner announcements." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="AIDLA News" />
        <meta property="og:site_name" content="AIDLA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIDLA News" />
        <meta name="twitter:description" content="Catch up on the latest from AIDLA." />
        <meta name="twitter:image" content={TWITTER_IMAGE} />
        <meta name="twitter:image:alt" content="AIDLA News" />

        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <div className="news-root">
        <div className="news-bg-orbs">
          <div className="news-orb-1" />
          <div className="news-orb-2" />
        </div>

        <div className="news-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="sec-label">Latest News</span>
            <h2 className="sec-title">
              AIDLA <span>News</span>
            </h2>
            <p className="sec-desc">
              Stay updated with the latest announcements, events, and community news from AIDLA.
            </p>
          </motion.div>

          {msg && (
            <div
              style={{
                background: "rgba(254,226,226,0.9)",
                border: "1px solid #fca5a5",
                color: "#991b1b",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "20px",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {msg}
            </div>
          )}

          {/* Breaking News Ticker */}
          {!loading && breakingPosts.length > 0 && (
            <motion.div className="news-breaking-bar" {...fadeUp}>
              <span className="news-breaking-label">🔴 Breaking</span>
              <div className="news-breaking-scroll">
                <div className="news-breaking-text">
                  {breakingPosts.map((p) => p.title).join("  •  ")}
                </div>
              </div>
            </motion.div>
          )}

          {/* Popular Posts Strip */}
          {!loading && popularPosts.length > 0 && (
            <motion.div className="news-popular-section" {...fadeUp}>
              <div className="news-popular-title">🔥 Most Read</div>
              <div className="news-popular-list">
                {popularPosts.map((p) => (
                  <Link to={`/news/${p.slug}`} key={p.id} className="news-popular-card">
                    {p.cover_image_url ? (
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        className="news-popular-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="news-popular-img-ph">📰</div>
                    )}
                    <div className="news-popular-info">
                      <h4>{p.title}</h4>
                      <div className="news-popular-stat">
                        👁 {(p.view_count || 0).toLocaleString()} views
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search */}
          <motion.div {...fadeUp}>
            <div className="news-search-wrap">
              <input
                className="news-search-input"
                placeholder="Search news, topics, tags…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search ? (
                <button className="news-search-clear" onClick={() => setSearch("")}>
                  ✕
                </button>
              ) : (
                <span className="news-search-icon">🔍</span>
              )}
            </div>
          </motion.div>

          {/* Category Filter */}
          {allCats.length > 0 && (
            <motion.div {...fadeUp}>
              <div className="news-cat-wrap">
                <button
                  className={`news-cat-btn${activeCat === "all" ? " active" : ""}`}
                  onClick={() => setActiveCat("all")}
                >
                  All
                </button>
                {allCats.map((c) => (
                  <button
                    key={c}
                    className={`news-cat-btn${activeCat === c ? " active" : ""}`}
                    onClick={() => setActiveCat(c)}
                  >
                    {CAT_LABELS[c] || c}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <motion.div {...fadeUp}>
              <div className="news-tags-wrap">
                <button
                  className={`news-tag-btn${activeTag === "all" ? " active" : ""}`}
                  onClick={() => setActiveTag("all")}
                >
                  All Tags
                </button>
                {allTags.map((t) => (
                  <button
                    key={t}
                    className={`news-tag-btn${activeTag === t ? " active" : ""}`}
                    onClick={() => setActiveTag(t)}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sort + Count */}
          {!loading && (
            <div className="news-sort-wrap">
              <span className="news-result-count">
                {filtered.length} {filtered.length === 1 ? "article" : "articles"}
                {activeCat !== "all" ? ` in ${CAT_LABELS[activeCat] || activeCat}` : ""}
                {activeTag !== "all" ? ` tagged #${activeTag}` : ""}
              </span>
              <div className="news-sort-btns">
                <button
                  className={`news-sort-btn${sort === "newest" ? " active" : ""}`}
                  onClick={() => setSort("newest")}
                >
                  🕐 Newest
                </button>
                <button
                  className={`news-sort-btn${sort === "most_viewed" ? " active" : ""}`}
                  onClick={() => setSort("most_viewed")}
                >
                  👁 Most Viewed
                </button>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="news-list">
            {loading ? (
              [1, 2, 3, 4].map((n, i) => (
                <motion.div key={n} className="news-card" {...stagger(i)}>
                  <div className="news-img-wrap skel-bg" style={{ background: "none" }} />
                  <div className="news-content">
                    <div
                      className="skel-bg"
                      style={{ height: 18, width: "80%", borderRadius: 4, marginBottom: 6 }}
                    />
                    <div
                      className="skel-bg"
                      style={{ height: 12, width: "100%", borderRadius: 4, marginBottom: 12 }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div className="skel-bg" style={{ height: 20, width: 70, borderRadius: 10 }} />
                      <div className="skel-bg" style={{ height: 14, width: 40, borderRadius: 4 }} />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((p, i) => {
                const pTags = p.tags || [];
                const pCat = pTags.find((t) => KNOWN_CATS.includes(t));
                const pBreaking = pTags.includes("breaking");
                const displayTags = pTags
                  .filter((t) => !KNOWN_CATS.includes(t) && t !== "breaking")
                  .slice(0, 2);
                return (
                  <motion.div key={p.id} {...stagger(i)}>
                    <Link to={`/news/${p.slug}`} className="news-card">
                      <div className="news-img-wrap">
                        {p.cover_image_url ? (
                          <img src={p.cover_image_url} alt={p.title} loading="lazy" />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span style={{ fontSize: "1.5rem" }}>📰</span>
                          </div>
                        )}
                      </div>
                      <div className="news-content">
                        <h3 className="news-title">{p.title}</h3>
                        <div className="news-badges">
                          {pBreaking && <span className="news-breaking-badge">🔴 Breaking</span>}
                          {pCat && (
                            <span
                              className="news-cat-badge"
                              style={{
                                background: `${CAT_COLORS[pCat]}18`,
                                color: CAT_COLORS[pCat],
                                border: `1px solid ${CAT_COLORS[pCat]}30`,
                              }}
                            >
                              {CAT_LABELS[pCat] || pCat}
                            </span>
                          )}
                          {displayTags.map((t) => (
                            <span key={t} className="news-tag-pill">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <p className="news-excerpt">
                          {p.excerpt || "Click to read this article…"}
                        </p>
                        <div className="news-meta">
                          <span className="news-date-pill">{formatDate(p.published_at)}</span>
                          <div className="news-stats">
                            <span className="news-stat">👁 {(p.view_count || 0).toLocaleString()}</span>
                            <span className="news-read-more">Read ›</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <AnimatePresence>
                {search || activeCat !== "all" || activeTag !== "all" ? (
                  <motion.div className="news-no-results" {...fadeUp}>
                    <span style={{ fontSize: "2.2rem", display: "block", marginBottom: 10 }}>🔍</span>
                    <h3>No results found</h3>
                    <p>Try a different search term or clear the filters.</p>
                    <button className="news-clear-btn" onClick={clearFilters}>
                      Clear Filters
                    </button>
                  </motion.div>
                ) : (
                  !msg && (
                    <motion.div
                      style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        background: "var(--card-bg)",
                        borderRadius: 20,
                        border: "1px dashed rgba(217,119,6,0.2)",
                      }}
                      {...fadeUp}
                    >
                      <span style={{ fontSize: "2.5rem", display: "block", marginBottom: 12 }}>📰</span>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: "var(--navy)",
                          fontSize: "1.25rem",
                          margin: "0 0 8px",
                        }}
                      >
                        No News Yet
                      </h3>
                      <p style={{ color: "var(--slate)", margin: 0, fontSize: "0.85rem" }}>
                        We're preparing the latest news. Check back soon!
                      </p>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}