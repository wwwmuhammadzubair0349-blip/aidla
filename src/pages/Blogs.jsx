import React, {
  useEffect, useState, useMemo, useRef, useCallback
} from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";
import Footer from "../pages/components/footer";
import "./Blogs.css";

/* ══════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════ */
const PAGE_SIZE      = 10;   // posts per infinite-scroll batch
const MAX_TAGS       = 15;   // top N tags to show (by frequency)
const CANONICAL_URL  = "https://www.aidla.online/blogs";
const OG_IMAGE       = "https://www.aidla.online/og-home.jpg";

/* ══════════════════════════════════════════════
   PURE HELPERS
══════════════════════════════════════════════ */
function formatDate(d) {
  if (!d) return "New";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });
}

/** Estimate reading time from excerpt word count (avg 200 wpm) */
function readTime(text = "") {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Normalize tag: lowercase + trim */
const normalizeTag = (t) => t.toLowerCase().trim();

/** Web Share API → fallback copy link */
async function sharePost(title, slug) {
  const url = `${window.location.origin}/blogs/${slug}`;
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch (_) { /* user cancelled */ }
  }
  try {
    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  } catch (_) {
    prompt("Copy this link:", url);
  }
}

/** localStorage bookmarks */
const BOOKMARK_KEY = "aidla_bookmarks";
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
   DARK MODE TOGGLE BUTTON
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
        <span className="dm-toggle-knob">
          {dark ? "🌙" : "☀️"}
        </span>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAG FILTER
   - Top 15 tags by frequency
   - Collapsed to 1 row by default (CSS only, no JS measurement)
   - Expand shows all 15 with wrap
══════════════════════════════════════════════ */
function TagFilter({ allTags, activeTag, onTagChange }) {
  const [expanded, setExpanded] = useState(false);
  const hasActive = activeTag !== "all";

  const handleClear = () => { onTagChange("all"); setExpanded(false); };

  return (
    <div className="bl-tagfilter-root">
      {/* Header */}
      <div className="bl-tagfilter-header">
        <div className="bl-tagfilter-left">
          <span className="bl-tag-filter-label">🏷 Filter</span>
          {hasActive && (
            <span className="bl-active-tag-badge">
              #{activeTag}
              <button
                className="bl-active-tag-clear"
                onClick={handleClear}
                aria-label={`Remove tag filter: ${activeTag}`}
              >✕</button>
            </span>
          )}
          {hasActive && (
            <button className="bl-clear-tag-btn" onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
        <div className="bl-tagfilter-right">
          <button
            className={`bl-expand-btn${expanded ? " expanded" : ""}`}
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
          >
            <span>{expanded ? "Less" : "More"}</span>
            <span className="bl-expand-icon">↓</span>
          </button>
        </div>
      </div>

      {/* Tag row — CSS handles 1-row collapse, no JS needed */}
      <div className={`bl-tags-row${expanded ? " expanded" : ""}`}>
        <button
          className={`bl-tag-btn${activeTag === "all" ? " active" : ""}`}
          onClick={() => onTagChange("all")}
          aria-pressed={activeTag === "all"}
        >All</button>

        {allTags.map(t => (
          <button
            key={t}
            className={`bl-tag-btn${activeTag === t ? " active" : ""}`}
            onClick={() => onTagChange(t)}
            aria-pressed={activeTag === t}
          >#{t}</button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   HERO CARD — First post, full-width editorial
══════════════════════════════════════════════ */
function HeroCard({ post, bookmarks, onBookmark, onShare }) {
  const isBookmarked = bookmarks.includes(post.id);
  const rt = readTime(post.excerpt);

  return (
    <div className="blog-hero-card">
      {/* Image */}
      <Link to={`/blogs/${post.slug}`} aria-label={post.title} tabIndex={-1}>
        <div className="blog-hero-img-wrap">
          {post.cover_image_url ? (
            <img
              src={post.cover_image_url}
              alt={post.title}
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          ) : (
            <div className="blog-hero-ph" aria-hidden="true">📰</div>
          )}
          <div className="blog-hero-overlay" aria-hidden="true" />
        </div>
      </Link>

      {/* Body */}
      <div className="blog-hero-body">
        <div className="blog-hero-eyebrow">
          <span className="blog-hero-featured-badge">⭐ Featured</span>
          {post.tags?.[0] && (
            <span className="blog-hero-tag-pill">#{normalizeTag(post.tags[0])}</span>
          )}
        </div>

        <Link to={`/blogs/${post.slug}`} style={{ textDecoration: "none" }}>
          <h2 className="blog-hero-title">{post.title}</h2>
        </Link>

        {post.excerpt && (
          <p className="blog-hero-excerpt">{post.excerpt}</p>
        )}

        <div className="blog-hero-meta">
          <div className="blog-hero-meta-left">
            <span className="blog-date-pill">
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </span>
            <span className="blog-read-time">⏱ {rt} min read</span>
            <span className="blog-views">👁 {(post.view_count || 0).toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Bookmark */}
            <button
              className={`blog-action-btn${isBookmarked ? " bookmarked" : ""}`}
              onClick={(e) => { e.preventDefault(); onBookmark(post.id); }}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this post"}
              title={isBookmarked ? "Bookmarked" : "Bookmark"}
            >
              {isBookmarked ? "🔖" : "🏷"}
            </button>

            {/* Share */}
            <button
              className="blog-action-btn share-btn"
              onClick={(e) => { e.preventDefault(); onShare(post.title, post.slug); }}
              aria-label="Share this post"
              title="Share"
            >
              📤
            </button>

            <Link to={`/blogs/${post.slug}`} className="blog-hero-read-more" aria-label={`Read ${post.title}`}>
              Read
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
   REGULAR BLOG CARD
══════════════════════════════════════════════ */
function BlogCard({ post, index, bookmarks, onBookmark, onShare }) {
  const isBookmarked = bookmarks.includes(post.id);
  const rt = readTime(post.excerpt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.06, 0.4) }}
    >
      <div className="blog-card">
        {/* Image */}
        <Link to={`/blogs/${post.slug}`} tabIndex={-1} aria-hidden="true">
          <div className="blog-img-wrap">
            {post.cover_image_url ? (
              <img
                src={post.cover_image_url}
                alt={post.title}
                width="100"
                height="100"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="blog-img-placeholder" aria-hidden="true">
                <span style={{ fontSize: "1.5rem" }}>📰</span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <Link to={`/blogs/${post.slug}`} className="blog-content" style={{ textDecoration: "none" }}>
          <h2 className="blog-title">{post.title}</h2>

          {post.tags?.length > 0 && (
            <div className="blog-tags-row" aria-label="Tags">
              {post.tags.slice(0, 2).map(t => (
                <span key={t} className="blog-tag-pill">#{normalizeTag(t)}</span>
              ))}
            </div>
          )}

          <div className="blog-meta">
            <div className="blog-meta-left">
              <span className="blog-date-pill">
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </span>
              <span className="blog-read-time">⏱ {rt}m</span>
            </div>
            <div className="blog-stats">
              <span className="blog-stat">👁 {(post.view_count || 0).toLocaleString()}</span>
              <span className="blog-read-more" aria-hidden="true">
                Read
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {/* Actions */}
        <div className="blog-card-actions">
          <button
            className={`blog-action-btn${isBookmarked ? " bookmarked" : ""}`}
            onClick={() => onBookmark(post.id)}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
            title={isBookmarked ? "Bookmarked" : "Bookmark"}
          >
            {isBookmarked ? "🔖" : "🏷"}
          </button>
          <button
            className="blog-action-btn share-btn"
            onClick={() => onShare(post.title, post.slug)}
            aria-label="Share"
            title="Share"
          >
            📤
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   SKELETON CARD
══════════════════════════════════════════════ */
function SkeletonCard() {
  return (
    <div className="blog-card" aria-hidden="true">
      <div className="blog-img-wrap skel-bg" style={{ background: "none" }} />
      <div className="blog-content">
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
export default function Blogs() {
  const [dark, toggleDark]     = useDarkMode();
  const [loading, setLoading]  = useState(true);
  const [posts, setPosts]      = useState([]);
  const [msg, setMsg]          = useState("");
  const [search, setSearch]    = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [sort, setSort]        = useState("newest");
  const [page, setPage]        = useState(1);        // how many batches loaded
  const [loadingMore, setLoadingMore] = useState(false);
  const [bookmarks, setBookmarks] = useState(getBookmarks);

  const debouncedSearch = useDebounce(search, 300);
  const sentinelRef     = useRef(null);

  /* ── Load posts from Supabase ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true); setMsg("");
      const { data, error } = await supabase
        .from("blogs_posts")
        .select("id,title,slug,excerpt,cover_image_url,published_at,tags,view_count")
        .is("deleted_at", null)
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) {
        setMsg("Unable to load insights right now. Please try again later.");
        setPosts([]);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  /* ── Reset page when filters change ── */
  useEffect(() => { setPage(1); }, [debouncedSearch, activeTag, sort]);

  /* ── Top 15 tags by frequency, normalized & deduplicated ── */
  const allTags = useMemo(() => {
    const freq = {};
    posts.forEach(p => (p.tags || []).forEach(t => {
      const n = normalizeTag(t);
      if (n) freq[n] = (freq[n] || 0) + 1;
    }));
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_TAGS)
      .map(([tag]) => tag);
  }, [posts]);

  /* ── Popular posts (top 5 by views) ── */
  const popularPosts = useMemo(() =>
    [...posts]
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 5)
  , [posts]);

  /* ── Filtered & sorted full list ── */
  const filtered = useMemo(() => {
    let result = [...posts];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        (p.tags || []).some(t => normalizeTag(t).includes(q))
      );
    }
    if (activeTag !== "all") {
      result = result.filter(p =>
        (p.tags || []).map(normalizeTag).includes(activeTag)
      );
    }
    if (sort === "newest") {
      result.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    } else if (sort === "most_viewed") {
      result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }
    return result;
  }, [posts, debouncedSearch, activeTag, sort]);

  /* ── Paginated slice (infinite scroll) ── */
  const heroPost   = filtered[0];
  const listPosts  = filtered.slice(1);             // cards (no hero)
  const visibleList = listPosts.slice(0, page * PAGE_SIZE);
  const hasMore    = visibleList.length < listPosts.length;

  /* ── Infinite scroll via IntersectionObserver ── */
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true);
          // Small delay so the spinner shows briefly (perceived performance)
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

  /* ── Bookmark handler ── */
  const handleBookmark = useCallback((id) => {
    setBookmarks(toggleBookmark(id));
  }, []);

  /* ── Share handler ── */
  const handleShare = useCallback((title, slug) => {
    sharePost(title, slug);
  }, []);

  /* ── Clear all filters ── */
  const clearFilters = () => { setSearch(""); setActiveTag("all"); setSort("newest"); };

  /* ── Structured data ── */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AIDLA Insights – Educational Blog",
    "description": "Discover educational strategies, app updates, and tips to maximize your learning and earnings on AIDLA.",
    "url": CANONICAL_URL,
    "inLanguage": "en",
    "isPartOf": { "@type": "WebSite", "name": "AIDLA", "url": "https://www.aidla.online" }
  };

  return (
    <>
      <Helmet>
        <title>AIDLA Insights – Educational Blog & Updates</title>
        <meta name="description" content="Explore AIDLA's blog for learning strategies, platform updates, and tips to earn more coins. Stay informed and maximize your experience." />
        <meta name="keywords" content="AIDLA blog, educational insights, learning tips, platform updates, Pakistan edtech" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={CANONICAL_URL} />
        <meta property="og:title" content="AIDLA Insights – Educational Blog" />
        <meta property="og:description" content="Learn, earn, and stay updated with AIDLA's official blog." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="AIDLA Insights Blog" />
        <meta property="og:site_name" content="AIDLA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIDLA Insights" />
        <meta name="twitter:description" content="Educational blog by AIDLA – tips, updates, and more." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="blogs-root">
        <div className="bg-orbs" aria-hidden="true">
          <div className="bg-orb-1" /><div className="bg-orb-2" />
        </div>

        <div className="blogs-container">

          {/* ── Page Header ── */}
          <motion.div
            className="blogs-page-header"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="blogs-header-text">
              <span className="sec-label">✦ Latest Updates</span>
              <h1 className="sec-title">AIDLA <span>Insights</span></h1>
              <p className="sec-desc">
                Educational strategies, platform updates, and tips to maximize your learning.
              </p>
            </div>
            <DarkModeToggle dark={dark} onToggle={toggleDark} />
          </motion.div>

          {/* ── Error ── */}
          {msg && (
            <div className="bl-error-alert" role="alert">{msg}</div>
          )}

          {/* ── Popular Posts ── */}
          {!loading && popularPosts.length > 0 && (
            <motion.div
              className="bl-popular-section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="bl-popular-title" aria-label="Popular posts">
                🔥 Popular Posts
              </div>
              <div className="bl-popular-list" role="list">
                {popularPosts.map((p, i) => (
                  <Link
                    to={`/blogs/${p.slug}`}
                    key={p.id}
                    className="bl-popular-card"
                    role="listitem"
                  >
                    {p.cover_image_url ? (
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        className="bl-popular-img"
                        width="150"
                        height="82"
                        loading={i === 0 ? "eager" : "lazy"}
                        fetchpriority={i === 0 ? "high" : undefined}
                        decoding="async"
                      />
                    ) : (
                      <div className="bl-popular-img-ph" aria-hidden="true">📰</div>
                    )}
                    <div className="bl-popular-info">
                      <p className="bl-popular-card-title">{p.title}</p>
                      <div className="bl-popular-stat">
                        👁 {(p.view_count || 0).toLocaleString()} views
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Search ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.15 }}
          >
            <div className="bl-search-wrap">
              <label htmlFor="blog-search" className="sr-only">Search articles</label>
              <input
                id="blog-search"
                className="bl-search-input"
                placeholder="Search articles, topics, tags…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search articles, topics, tags"
                autoComplete="off"
                spellCheck="false"
              />
              {search
                ? (
                  <button
                    className="bl-search-clear"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >✕</button>
                )
                : <span className="bl-search-icon" aria-hidden="true">🔍</span>
              }
            </div>
          </motion.div>

          {/* ── Tag Filter ── */}
          {!loading && allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, delay: 0.2 }}
            >
              <TagFilter
                allTags={allTags}
                activeTag={activeTag}
                onTagChange={setActiveTag}
              />
            </motion.div>
          )}

          {/* ── Sort + Count ── */}
          {!loading && (
            <div className="bl-sort-wrap">
              <span
                className="bl-result-count"
                aria-live="polite"
                aria-atomic="true"
              >
                {filtered.length} {filtered.length === 1 ? "article" : "articles"}
                {activeTag !== "all" ? ` tagged #${activeTag}` : ""}
              </span>
              <div className="bl-sort-btns" role="group" aria-label="Sort articles">
                <button
                  className={`bl-sort-btn${sort === "newest" ? " active" : ""}`}
                  onClick={() => setSort("newest")}
                  aria-pressed={sort === "newest"}
                >🕐 Newest</button>
                <button
                  className={`bl-sort-btn${sort === "most_viewed" ? " active" : ""}`}
                  onClick={() => setSort("most_viewed")}
                  aria-pressed={sort === "most_viewed"}
                >👁 Most Viewed</button>
              </div>
            </div>
          )}

          {/* ══ POSTS ══ */}
          {loading ? (
            /* Skeleton */
            <div>
              <div className="blog-card" style={{ marginBottom: "16px" }} aria-hidden="true">
                <div
                  className="skel-bg"
                  style={{
                    width: "100%", aspectRatio: "16/7", borderRadius: "16px",
                    marginBottom: "0", background: "none"
                  }}
                />
              </div>
              <div className="blogs-list">
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
              <div className="blogs-list" role="list">
                {visibleList.map((p, i) => (
                  <BlogCard
                    key={p.id}
                    post={p}
                    index={i}
                    bookmarks={bookmarks}
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                  />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              {hasMore && (
                <>
                  <div ref={sentinelRef} className="bl-load-sentinel" aria-hidden="true" />
                  {loadingMore && (
                    <div className="bl-loading-more" aria-live="polite">
                      <div className="bl-spinner" />
                      <span>Loading more…</span>
                    </div>
                  )}
                </>
              )}

              {/* End of list */}
              {!hasMore && filtered.length > 1 && (
                <div className="bl-end-message" aria-live="polite">
                  <div className="bl-end-line" />
                  <span>You've read everything ✦</span>
                  <div className="bl-end-line" />
                </div>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {debouncedSearch || activeTag !== "all" ? (
                <motion.div
                  className="bl-no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  role="status"
                >
                  <span style={{ fontSize: "2.2rem", display: "block", marginBottom: "10px" }} aria-hidden="true">🔍</span>
                  <h2 className="bl-no-results-title">No results found</h2>
                  <p>Try a different search term or clear the filters.</p>
                  <button className="bl-clear-btn" onClick={clearFilters}>Clear Filters</button>
                </motion.div>
              ) : !msg && (
                <motion.div
                  className="bl-empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  role="status"
                >
                  <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "12px" }} aria-hidden="true">📚</span>
                  <h2 className="bl-empty-title">No Insights Yet</h2>
                  <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.85rem" }}>
                    We're cooking up great content. Check back soon!
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