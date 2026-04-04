import React, {
  useEffect, useState, useMemo, useRef, useCallback
} from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";
import Footer from "../pages/components/footer";
import "./news.css";

/* ══════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════ */
const PAGE_SIZE     = 10;
const MAX_TAGS      = 15;
const CANONICAL_URL = "https://www.aidla.online/news";
const OG_IMAGE      = "https://www.aidla.online/og-home.jpg";

const CAT_COLORS = {
  general:       "#3b82f6",
  politics:      "#8b5cf6",
  education:     "#0891b2",
  technology:    "#0f766e",
  community:     "#16a34a",
  events:        "#d97706",
  announcements: "#dc2626",
};

const CAT_LABELS = {
  general:       "🌐 General",
  politics:      "🏛️ Politics",
  education:     "📚 Education",
  technology:    "💻 Technology",
  community:     "🤝 Community",
  events:        "🎯 Events",
  announcements: "📢 Announcements",
};

const KNOWN_CATS = Object.keys(CAT_COLORS);

/* ══════════════════════════════════════════════
   PURE HELPERS
══════════════════════════════════════════════ */
function formatDate(d) {
  if (!d) return "New";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });
}

function readTime(text = "") {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const normalizeTag = (t) => t.toLowerCase().trim();

async function sharePost(title, slug) {
  const url = `${window.location.origin}/news/${slug}`;
  if (navigator.share) {
    try { await navigator.share({ title, url }); return; } catch (_) {}
  }
  try {
    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  } catch (_) {
    prompt("Copy this link:", url);
  }
}

const BOOKMARK_KEY = "aidla_news_bookmarks";
function getBookmarks() {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]"); }
  catch { return []; }
}
function toggleBookmark(id) {
  const current = getBookmarks();
  const next = current.includes(id)
    ? current.filter(b => b !== id)
    : [...current, id];
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
  return next;
}

/* ══════════════════════════════════════════════
   DARK MODE HOOK
══════════════════════════════════════════════ */
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("aidla_theme") === "dark"; }
    catch { return false; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    try { localStorage.setItem("aidla_theme", dark ? "dark" : "light"); } catch (_) {}
  }, [dark]);

  return [dark, () => setDark(d => !d)];
}

/* ══════════════════════════════════════════════
   DEBOUNCE HOOK
══════════════════════════════════════════════ */
function useDebounce(value, delay = 300) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

/* ══════════════════════════════════════════════
   DARK MODE TOGGLE
══════════════════════════════════════════════ */
function DarkModeToggle({ dark, onToggle }) {
  return (
    <div className="dm-toggle">
      <span className="dm-toggle-label">{dark ? "Dark" : "Light"}</span>
      <button
        className="dm-toggle-track"
        onClick={onToggle}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={dark}
      >
        <span className="dm-toggle-knob">{dark ? "🌙" : "☀️"}</span>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAG FILTER — 1 row collapsed, CSS only
══════════════════════════════════════════════ */
function TagFilter({ allTags, activeTag, onTagChange }) {
  const [expanded, setExpanded] = useState(false);
  const hasActive = activeTag !== "all";

  const handleClear = () => { onTagChange("all"); setExpanded(false); };

  return (
    <div className="news-tagfilter-root">
      <div className="news-tagfilter-header">
        <div className="news-tagfilter-left">
          <span className="news-tag-filter-label">🏷 Tags</span>
          {hasActive && (
            <span className="news-active-tag-badge">
              #{activeTag}
              <button
                className="news-active-tag-clear"
                onClick={handleClear}
                aria-label={`Remove tag: ${activeTag}`}
              >✕</button>
            </span>
          )}
          {hasActive && (
            <button className="news-clear-tag-btn" onClick={handleClear}>Clear</button>
          )}
        </div>
        <div className="news-tagfilter-right">
          <button
            className={`news-expand-btn${expanded ? " expanded" : ""}`}
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
          >
            <span>{expanded ? "Less" : "More"}</span>
            <span className="news-expand-icon">↓</span>
          </button>
        </div>
      </div>

      <div className={`news-tags-row${expanded ? " expanded" : ""}`}>
        <button
          className={`news-tag-btn${activeTag === "all" ? " active" : ""}`}
          onClick={() => onTagChange("all")}
          aria-pressed={activeTag === "all"}
        >All</button>

        {allTags.map(t => (
          <button
            key={t}
            className={`news-tag-btn${activeTag === t ? " active" : ""}`}
            onClick={() => onTagChange(t)}
            aria-pressed={activeTag === t}
          >#{t}</button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   HERO CARD
══════════════════════════════════════════════ */
function HeroCard({ post, bookmarks, onBookmark, onShare }) {
  const isBookmarked = bookmarks.includes(post.id);
  const pTags = post.tags || [];
  const pCat  = pTags.find(t => KNOWN_CATS.includes(t));
  const isBreaking = pTags.includes("breaking");
  const rt = readTime(post.excerpt);

  return (
    <div className="news-hero-card">
      <Link to={`/news/${post.slug}`} tabIndex={-1} aria-label={post.title}>
        <div className="news-hero-img-wrap">
          {post.cover_image_url ? (
            <img
              src={post.cover_image_url}
              alt={post.title}
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          ) : (
            <div className="news-hero-ph" aria-hidden="true">📰</div>
          )}
          <div className="news-hero-overlay" aria-hidden="true" />
        </div>
      </Link>

      <div className="news-hero-body">
        <div className="news-hero-eyebrow">
          <span className="news-hero-featured-badge">⭐ Top Story</span>
          {isBreaking && (
            <span className="news-hero-breaking-badge">🔴 Breaking</span>
          )}
          {pCat && (
            <span
              className="news-hero-cat-badge"
              style={{
                background: `${CAT_COLORS[pCat]}18`,
                color: CAT_COLORS[pCat],
                border: `1px solid ${CAT_COLORS[pCat]}30`,
              }}
            >{CAT_LABELS[pCat]}</span>
          )}
        </div>

        <Link to={`/news/${post.slug}`} style={{ textDecoration: "none" }}>
          <h2 className="news-hero-title">{post.title}</h2>
        </Link>

        {post.excerpt && (
          <p className="news-hero-excerpt">{post.excerpt}</p>
        )}

        <div className="news-hero-meta">
          <div className="news-hero-meta-left">
            <span className="news-date-pill">
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </span>
            <span className="news-read-time">⏱ {rt} min read</span>
            <span className="news-views">👁 {(post.view_count || 0).toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className={`news-action-btn${isBookmarked ? " bookmarked" : ""}`}
              onClick={(e) => { e.preventDefault(); onBookmark(post.id); }}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              title={isBookmarked ? "Bookmarked" : "Bookmark"}
            >{isBookmarked ? "🔖" : "🏷"}</button>

            <button
              className="news-action-btn share-btn"
              onClick={(e) => { e.preventDefault(); onShare(post.title, post.slug); }}
              aria-label="Share"
              title="Share"
            >📤</button>

            <Link to={`/news/${post.slug}`} className="news-hero-read-more">
              Read
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NEWS CARD
══════════════════════════════════════════════ */
function NewsCard({ post, index, bookmarks, onBookmark, onShare }) {
  const isBookmarked = bookmarks.includes(post.id);
  const pTags      = post.tags || [];
  const pCat       = pTags.find(t => KNOWN_CATS.includes(t));
  const isBreaking = pTags.includes("breaking");
  const displayTags = pTags
    .filter(t => !KNOWN_CATS.includes(t) && t !== "breaking")
    .slice(0, 2);
  const rt = readTime(post.excerpt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.06, 0.4) }}
    >
      <div className="news-card">
        {/* Image */}
        <Link to={`/news/${post.slug}`} tabIndex={-1} aria-hidden="true">
          <div className="news-img-wrap">
            {post.cover_image_url ? (
              <img
                src={post.cover_image_url}
                alt={post.title}
                width="100" height="100"
                loading="lazy" decoding="async"
              />
            ) : (
              <div className="news-img-placeholder" aria-hidden="true">
                <span style={{ fontSize: "1.5rem" }}>📰</span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <Link to={`/news/${post.slug}`} className="news-content" style={{ textDecoration: "none" }}>
          <h3 className="news-title">{post.title}</h3>

          <div className="news-badges">
            {isBreaking && <span className="news-breaking-badge">🔴 Breaking</span>}
            {pCat && (
              <span
                className="news-cat-badge"
                style={{
                  background: `${CAT_COLORS[pCat]}18`,
                  color: CAT_COLORS[pCat],
                  border: `1px solid ${CAT_COLORS[pCat]}30`,
                }}
              >{CAT_LABELS[pCat]}</span>
            )}
            {displayTags.map(t => (
              <span key={t} className="news-tag-pill">#{t}</span>
            ))}
          </div>

          <div className="news-meta">
            <div className="news-meta-left">
              <span className="news-date-pill">
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </span>
              <span className="news-read-time">⏱ {rt}m</span>
            </div>
            <div className="news-stats">
              <span className="news-stat">👁 {(post.view_count || 0).toLocaleString()}</span>
              <span className="news-read-more" aria-hidden="true">
                Read
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {/* Actions */}
        <div className="news-card-actions">
          <button
            className={`news-action-btn${isBookmarked ? " bookmarked" : ""}`}
            onClick={() => onBookmark(post.id)}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
            title={isBookmarked ? "Bookmarked" : "Bookmark"}
          >{isBookmarked ? "🔖" : "🏷"}</button>

          <button
            className="news-action-btn share-btn"
            onClick={() => onShare(post.title, post.slug)}
            aria-label="Share" title="Share"
          >📤</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   SKELETON
══════════════════════════════════════════════ */
function SkeletonCard() {
  return (
    <div className="news-card" aria-hidden="true">
      <div className="news-img-wrap skel-bg" style={{ background: "none" }} />
      <div className="news-content">
        <div className="skel-bg" style={{ height: "16px", width: "80%", marginBottom: "8px" }} />
        <div className="skel-bg" style={{ height: "12px", width: "100%", marginBottom: "6px" }} />
        <div className="skel-bg" style={{ height: "12px", width: "60%", marginBottom: "12px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="skel-bg" style={{ height: "20px", width: "70px", borderRadius: "10px" }} />
          <div className="skel-bg" style={{ height: "14px", width: "35px" }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function News() {
  const [dark, toggleDark]       = useDarkMode();
  const [loading, setLoading]    = useState(true);
  const [posts, setPosts]        = useState([]);
  const [msg, setMsg]            = useState("");
  const [search, setSearch]      = useState("");
  const [activeTag, setActiveTag]  = useState("all");
  const [activeCat, setActiveCat]  = useState("all");
  const [sort, setSort]          = useState("newest");
  const [page, setPage]          = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bookmarks, setBookmarks]  = useState(getBookmarks);

  const debouncedSearch = useDebounce(search, 300);
  const sentinelRef     = useRef(null);

  /* Load posts */
  useEffect(() => {
    const load = async () => {
      setLoading(true); setMsg("");
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

  /* Reset page on filter change */
  useEffect(() => { setPage(1); }, [debouncedSearch, activeTag, activeCat, sort]);

  /* Breaking news */
  const breakingPosts = useMemo(
    () => posts.filter(p => (p.tags || []).includes("breaking")),
    [posts]
  );

  /* Popular */
  const popularPosts = useMemo(
    () => [...posts].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5),
    [posts]
  );

  /* Categories present */
  const allCats = useMemo(() => {
    const set = new Set();
    posts.forEach(p => (p.tags || []).forEach(t => {
      if (KNOWN_CATS.includes(t)) set.add(t);
    }));
    return Array.from(set);
  }, [posts]);

  /* Top 15 non-system tags by frequency, normalized & deduplicated */
  const allTags = useMemo(() => {
    const freq = {};
    posts.forEach(p => (p.tags || []).forEach(t => {
      if (KNOWN_CATS.includes(t) || t === "breaking") return;
      const n = normalizeTag(t);
      if (n) freq[n] = (freq[n] || 0) + 1;
    }));
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_TAGS)
      .map(([tag]) => tag);
  }, [posts]);

  /* Filtered list */
  const filtered = useMemo(() => {
    let r = [...posts];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      r = r.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        (p.tags || []).some(t => normalizeTag(t).includes(q))
      );
    }
    if (activeCat !== "all") {
      r = r.filter(p => (p.tags || []).includes(activeCat));
    }
    if (activeTag !== "all") {
      r = r.filter(p => (p.tags || []).map(normalizeTag).includes(activeTag));
    }
    if (sort === "newest") {
      r.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    } else if (sort === "most_viewed") {
      r.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }
    return r;
  }, [posts, debouncedSearch, activeCat, activeTag, sort]);

  /* Pagination */
  const heroPost    = filtered[0];
  const listPosts   = filtered.slice(1);
  const visibleList = listPosts.slice(0, page * PAGE_SIZE);
  const hasMore     = visibleList.length < listPosts.length;

  /* Infinite scroll */
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setPage(p => p + 1);
            setLoadingMore(false);
          }, 400);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, visibleList.length]);

  const handleBookmark = useCallback((id) => {
    setBookmarks(toggleBookmark(id));
  }, []);

  const handleShare = useCallback((title, slug) => {
    sharePost(title, slug);
  }, []);

  const clearFilters = () => {
    setSearch(""); setActiveTag("all"); setActiveCat("all"); setSort("newest");
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AIDLA News",
    "description": "Stay updated with the latest announcements, events, and community news from AIDLA.",
    "url": CANONICAL_URL,
    "inLanguage": "en",
    "isPartOf": { "@type": "WebSite", "name": "AIDLA", "url": "https://www.aidla.online" }
  };

  return (
    <>
      <Helmet>
        <title>AIDLA News – Latest Updates, Announcements & Events</title>
        <meta name="description" content="Read the latest news from AIDLA: platform updates, community events, educational tips, and winner announcements." />
        <meta name="keywords" content="AIDLA news, platform updates, community events, educational news, Pakistan edtech" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={CANONICAL_URL} />
        <meta property="og:title" content="AIDLA News – Latest Updates & Announcements" />
        <meta property="og:description" content="Stay informed with AIDLA's latest news, events, and winner announcements." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="AIDLA News" />
        <meta property="og:site_name" content="AIDLA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIDLA News" />
        <meta name="twitter:description" content="Catch up on the latest from AIDLA." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="news-root">
        <div className="news-bg-orbs" aria-hidden="true">
          <div className="news-orb-1" /><div className="news-orb-2" />
        </div>

        <div className="news-container">

          {/* Header */}
          <motion.div
            className="news-page-header"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="news-header-text">
              <span className="sec-label">✦ Latest News</span>
              <h1 className="sec-title">AIDLA <span>News</span></h1>
              <p className="sec-desc">
                Stay updated with the latest announcements, events, and community news.
              </p>
            </div>
            <DarkModeToggle dark={dark} onToggle={toggleDark} />
          </motion.div>

          {/* Error */}
          {msg && <div className="news-error-alert" role="alert">{msg}</div>}

          {/* Breaking ticker */}
          {!loading && breakingPosts.length > 0 && (
            <motion.div
              className="news-breaking-bar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38 }}
            >
              <span className="news-breaking-label">🔴 Breaking</span>
              <div className="news-breaking-scroll">
                <div className="news-breaking-text">
                  {breakingPosts.map(p => p.title).join("  •  ")}
                </div>
              </div>
            </motion.div>
          )}

          {/* Popular strip */}
          {!loading && popularPosts.length > 0 && (
            <motion.div
              className="news-popular-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              <div className="news-popular-title">🔥 Most Read</div>
              <div className="news-popular-list" role="list">
                {popularPosts.map((p, i) => (
                  <Link to={`/news/${p.slug}`} key={p.id} className="news-popular-card" role="listitem">
                    {p.cover_image_url ? (
                      <img
                        src={p.cover_image_url} alt={p.title}
                        className="news-popular-img"
                        width="150" height="82"
                        loading={i === 0 ? "eager" : "lazy"}
                        fetchpriority={i === 0 ? "high" : undefined}
                        decoding="async"
                      />
                    ) : (
                      <div className="news-popular-img-ph" aria-hidden="true">📰</div>
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.12 }}
          >
            <div className="news-search-wrap">
              <label htmlFor="news-search" className="sr-only">Search news</label>
              <input
                id="news-search"
                className="news-search-input"
                placeholder="Search news, topics, tags…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoComplete="off"
                spellCheck="false"
              />
              {search
                ? <button className="news-search-clear" onClick={() => setSearch("")} aria-label="Clear search">✕</button>
                : <span className="news-search-icon" aria-hidden="true">🔍</span>
              }
            </div>
          </motion.div>

          {/* Category filter */}
          {!loading && allCats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, delay: 0.16 }}
            >
              <div className="news-cat-section">
                <div className="news-cat-wrap" role="group" aria-label="Filter by category">
                  <button
                    className={`news-cat-btn${activeCat === "all" ? " active" : ""}`}
                    onClick={() => setActiveCat("all")}
                    aria-pressed={activeCat === "all"}
                  >All</button>
                  {allCats.map(c => (
                    <button
                      key={c}
                      className={`news-cat-btn${activeCat === c ? " active" : ""}`}
                      onClick={() => setActiveCat(c)}
                      aria-pressed={activeCat === c}
                    >{CAT_LABELS[c] || c}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tag filter */}
          {!loading && allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, delay: 0.20 }}
            >
              <TagFilter
                allTags={allTags}
                activeTag={activeTag}
                onTagChange={setActiveTag}
              />
            </motion.div>
          )}

          {/* Sort + count */}
          {!loading && (
            <div className="news-sort-wrap">
              <span className="news-result-count" aria-live="polite" aria-atomic="true">
                {filtered.length} {filtered.length === 1 ? "article" : "articles"}
                {activeCat !== "all" ? ` in ${CAT_LABELS[activeCat] || activeCat}` : ""}
                {activeTag !== "all" ? ` tagged #${activeTag}` : ""}
              </span>
              <div className="news-sort-btns" role="group" aria-label="Sort articles">
                <button
                  className={`news-sort-btn${sort === "newest" ? " active" : ""}`}
                  onClick={() => setSort("newest")}
                  aria-pressed={sort === "newest"}
                >🕐 Newest</button>
                <button
                  className={`news-sort-btn${sort === "most_viewed" ? " active" : ""}`}
                  onClick={() => setSort("most_viewed")}
                  aria-pressed={sort === "most_viewed"}
                >👁 Most Viewed</button>
              </div>
            </div>
          )}

          {/* Posts */}
          {loading ? (
            <div>
              <div className="news-card" style={{ marginBottom: "16px" }} aria-hidden="true">
                <div className="skel-bg" style={{ width: "100%", aspectRatio: "16/7", borderRadius: "16px", background: "none" }} />
              </div>
              <div className="news-list">
                {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
              </div>
            </div>
          ) : filtered.length > 0 ? (
            <div>
              {/* Hero */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <HeroCard
                  post={heroPost}
                  bookmarks={bookmarks}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                />
              </motion.div>

              {/* List */}
              <div className="news-list" role="list">
                {visibleList.map((p, i) => (
                  <NewsCard
                    key={p.id}
                    post={p}
                    index={i}
                    bookmarks={bookmarks}
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                  />
                ))}
              </div>

              {/* Sentinel */}
              {hasMore && (
                <>
                  <div ref={sentinelRef} className="news-load-sentinel" aria-hidden="true" />
                  {loadingMore && (
                    <div className="news-loading-more" aria-live="polite">
                      <div className="news-spinner" />
                      <span>Loading more…</span>
                    </div>
                  )}
                </>
              )}

              {/* End */}
              {!hasMore && filtered.length > 1 && (
                <div className="news-end-message" aria-live="polite">
                  <div className="news-end-line" />
                  <span>You're all caught up ✦</span>
                  <div className="news-end-line" />
                </div>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {debouncedSearch || activeCat !== "all" || activeTag !== "all" ? (
                <motion.div
                  className="news-no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  role="status"
                >
                  <span style={{ fontSize: "2.2rem", display: "block", marginBottom: "10px" }} aria-hidden="true">🔍</span>
                  <h3>No results found</h3>
                  <p>Try a different search term or clear the filters.</p>
                  <button className="news-clear-btn" onClick={clearFilters}>Clear Filters</button>
                </motion.div>
              ) : !msg && (
                <motion.div
                  className="news-empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  role="status"
                >
                  <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "12px" }} aria-hidden="true">📰</span>
                  <h2 className="news-empty-title">No News Yet</h2>
                  <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.85rem" }}>
                    We're preparing the latest news. Check back soon!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}