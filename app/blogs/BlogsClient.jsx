// app/blogs/BlogsClient.jsx
"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import "./Blogs.css";

/* ══════════════════════════════════════════════
   CONSTANTS & HELPERS
══════════════════════════════════════════════ */
const PAGE_SIZE = 10;
const MAX_TAGS = 15;

function formatDate(d) {
  if (!d) return "New";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function readTime(text = "") {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const normalizeTag = (t) => t.toLowerCase().trim();

async function sharePost(title, slug) {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/blogs/${slug}`;
  if (navigator.share) {
    try { await navigator.share({ title, url }); return; } catch (_) {}
  }
  try { await navigator.clipboard.writeText(url); alert("Link copied to clipboard!"); } 
  catch (_) { prompt("Copy this link:", url); }
}

const BOOKMARK_KEY = "aidla_bookmarks";
function getBookmarks() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]"); } catch { return []; }
}
function toggleBookmark(id) {
  const current = getBookmarks();
  const next = current.includes(id) ? current.filter(b => b !== id) : [...current, id];
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
  return next;
}

/* ══════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════ */
function useDarkMode() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = localStorage.getItem("aidla_theme") === "dark";
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  const toggle = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.setAttribute("data-theme", nextDark ? "dark" : "light");
    localStorage.setItem("aidla_theme", nextDark ? "dark" : "light");
  };

  return [dark, toggle, mounted];
}

function useDebounce(value, delay = 300) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

/* ══════════════════════════════════════════════
   UI COMPONENTS
══════════════════════════════════════════════ */
function DarkModeToggle({ dark, onToggle, mounted }) {
  if (!mounted) return <div className="dm-toggle" style={{ width: 80, height: 24 }} />;
  return (
    <div className="dm-toggle">
      <span className="dm-toggle-label">{dark ? "Dark" : "Light"}</span>
      <button className="dm-toggle-track" onClick={onToggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={dark}>
        <span className="dm-toggle-knob">{dark ? "🌙" : "☀️"}</span>
      </button>
    </div>
  );
}

function TagFilter({ allTags, activeTag, onTagChange }) {
  const [expanded, setExpanded] = useState(false);
  const hasActive = activeTag !== "all";
  const handleClear = () => { onTagChange("all"); setExpanded(false); };

  return (
    <div className="bl-tagfilter-root">
      <div className="bl-tagfilter-header">
        <div className="bl-tagfilter-left">
          <span className="bl-tag-filter-label">🏷 Filter</span>
          {hasActive && (
            <span className="bl-active-tag-badge">
              #{activeTag}
              <button className="bl-active-tag-clear" onClick={handleClear} aria-label={`Remove tag filter: ${activeTag}`}>✕</button>
            </span>
          )}
          {hasActive && <button className="bl-clear-tag-btn" onClick={handleClear}>Clear</button>}
        </div>
        <div className="bl-tagfilter-right">
          <button className={`bl-expand-btn${expanded ? " expanded" : ""}`} onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
            <span>{expanded ? "Less" : "More"}</span>
            <span className="bl-expand-icon">↓</span>
          </button>
        </div>
      </div>
      <div className={`bl-tags-row${expanded ? " expanded" : ""}`}>
        <button className={`bl-tag-btn${activeTag === "all" ? " active" : ""}`} onClick={() => onTagChange("all")} aria-pressed={activeTag === "all"}>All</button>
        {allTags.map(t => (
          <button key={t} className={`bl-tag-btn${activeTag === t ? " active" : ""}`} onClick={() => onTagChange(t)} aria-pressed={activeTag === t}>#{t}</button>
        ))}
      </div>
    </div>
  );
}

function HeroCard({ post, bookmarks, onBookmark, onShare }) {
  const isBookmarked = bookmarks.includes(post.id);
  const rt = readTime(post.excerpt);

  return (
    <article className="blog-hero-card">
      <Link href={`/blogs/${post.slug}`} aria-label={post.title} tabIndex={-1}>
        <div className="blog-hero-img-wrap">
          {post.cover_image_url ? (
            <Image src={post.cover_image_url} alt={post.title} fill priority sizes="(max-width: 900px) 100vw, 900px" style={{ objectFit: "cover" }} />
          ) : (
            <div className="blog-hero-ph" aria-hidden="true">📰</div>
          )}
          <div className="blog-hero-overlay" aria-hidden="true" />
        </div>
      </Link>
      <div className="blog-hero-body">
        <div className="blog-hero-eyebrow">
          <span className="blog-hero-featured-badge">⭐ Featured</span>
          {post.tags?.[0] && <span className="blog-hero-tag-pill">#{normalizeTag(post.tags[0])}</span>}
        </div>
        <Link href={`/blogs/${post.slug}`} style={{ textDecoration: "none" }}>
          <h2 className="blog-hero-title">{post.title}</h2>
        </Link>
        {post.excerpt && <p className="blog-hero-excerpt">{post.excerpt}</p>}
        <div className="blog-hero-meta">
          <div className="blog-hero-meta-left">
            <span className="blog-date-pill"><time dateTime={post.published_at}>{formatDate(post.published_at)}</time></span>
            <span className="blog-read-time">⏱ {rt} min read</span>
            <span className="blog-views">👁 {(post.view_count || 0).toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button className={`blog-action-btn${isBookmarked ? " bookmarked" : ""}`} onClick={(e) => { e.preventDefault(); onBookmark(post.id); }} aria-label="Bookmark">
              {isBookmarked ? "🔖" : "🏷"}
            </button>
            <button className="blog-action-btn share-btn" onClick={(e) => { e.preventDefault(); onShare(post.title, post.slug); }} aria-label="Share">📤</button>
            <Link href={`/blogs/${post.slug}`} className="blog-hero-read-more" aria-label={`Read ${post.title}`}>
              Read
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function BlogCard({ post, index, bookmarks, onBookmark, onShare }) {
  const isBookmarked = bookmarks.includes(post.id);
  const rt = readTime(post.excerpt);

  return (
    <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, delay: Math.min(index * 0.06, 0.4) }}>
      <div className="blog-card">
        <Link href={`/blogs/${post.slug}`} tabIndex={-1} aria-hidden="true">
          <div className="blog-img-wrap">
            {post.cover_image_url ? (
              <Image src={post.cover_image_url} alt={post.title} fill sizes="100px" style={{ objectFit: "cover" }} />
            ) : (
              <div className="blog-img-placeholder" aria-hidden="true"><span style={{ fontSize: "1.5rem" }}>📰</span></div>
            )}
          </div>
        </Link>
        <Link href={`/blogs/${post.slug}`} className="blog-content" style={{ textDecoration: "none" }}>
          <h2 className="blog-title">{post.title}</h2>
          {post.tags?.length > 0 && (
            <div className="blog-tags-row" aria-label="Tags">
              {post.tags.slice(0, 2).map(t => <span key={t} className="blog-tag-pill">#{normalizeTag(t)}</span>)}
            </div>
          )}
          <div className="blog-meta">
            <div className="blog-meta-left">
              <span className="blog-date-pill"><time dateTime={post.published_at}>{formatDate(post.published_at)}</time></span>
              <span className="blog-read-time">⏱ {rt}m</span>
            </div>
            <div className="blog-stats">
              <span className="blog-stat">👁 {(post.view_count || 0).toLocaleString()}</span>
              <span className="blog-read-more" aria-hidden="true">Read
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </div>
        </Link>
        <div className="blog-card-actions">
          <button className={`blog-action-btn${isBookmarked ? " bookmarked" : ""}`} onClick={() => onBookmark(post.id)} aria-label="Bookmark">{isBookmarked ? "🔖" : "🏷"}</button>
          <button className="blog-action-btn share-btn" onClick={() => onShare(post.title, post.slug)} aria-label="Share">📤</button>
        </div>
      </div>
    </motion.article>
  );
}

/* ══════════════════════════════════════════════
   MAIN CLIENT COMPONENT
══════════════════════════════════════════════ */
export default function BlogsClient({ initialPosts, fetchError }) {
  const [dark, toggleDark, mounted] = useDarkMode();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  // Fetch bookmarks on client to avoid hydration error
  useEffect(() => { setBookmarks(getBookmarks()); }, []);

  const debouncedSearch = useDebounce(search, 300);
  const sentinelRef = useRef(null);

  useEffect(() => { setPage(1); }, [debouncedSearch, activeTag, sort]);

  const allTags = useMemo(() => {
    const freq = {};
    initialPosts.forEach(p => (p.tags || []).forEach(t => {
      const n = normalizeTag(t);
      if (n) freq[n] = (freq[n] || 0) + 1;
    }));
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, MAX_TAGS).map(([tag]) => tag);
  }, [initialPosts]);

  const popularPosts = useMemo(() => [...initialPosts].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5), [initialPosts]);

  const filtered = useMemo(() => {
    let result = [...initialPosts];
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(p => p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q) || (p.tags || []).some(t => normalizeTag(t).includes(q)));
    }
    if (activeTag !== "all") result = result.filter(p => (p.tags || []).map(normalizeTag).includes(activeTag));
    if (sort === "newest") result.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    else if (sort === "most_viewed") result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    return result;
  }, [initialPosts, debouncedSearch, activeTag, sort]);

  const heroPost = filtered[0];
  const listPosts = filtered.slice(1);
  const visibleList = listPosts.slice(0, page * PAGE_SIZE);
  const hasMore = visibleList.length < listPosts.length;

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore) {
        setLoadingMore(true);
        setTimeout(() => { setPage(p => p + 1); setLoadingMore(false); }, 400);
      }
    }, { rootMargin: "200px" });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, visibleList.length]);

  const handleBookmark = useCallback((id) => { setBookmarks(toggleBookmark(id)); }, []);
  const handleShare = useCallback((title, slug) => { sharePost(title, slug); }, []);
  const clearFilters = () => { setSearch(""); setActiveTag("all"); setSort("newest"); };

  return (
    <main className="blogs-root">
      <div className="bg-orbs" aria-hidden="true"><div className="bg-orb-1" /><div className="bg-orb-2" /></div>
      <div className="blogs-container">
        
        <header className="blogs-page-header">
          <div className="blogs-header-text">
            <span className="sec-label">✦ Latest Updates</span>
            <h1 className="sec-title">AIDLA <span>Insights</span></h1>
            <p className="sec-desc">Educational strategies, platform updates, and tips to maximize your learning.</p>
          </div>
          <DarkModeToggle dark={dark} onToggle={toggleDark} mounted={mounted} />
        </header>

        {fetchError && <div className="bl-error-alert" role="alert">Unable to load insights right now. Please try again later.</div>}

        {popularPosts.length > 0 && (
          <section className="bl-popular-section">
            <h2 className="bl-popular-title">🔥 Popular Posts</h2>
            <div className="bl-popular-list" role="list">
              {popularPosts.map((p, i) => (
                <Link href={`/blogs/${p.slug}`} key={p.id} className="bl-popular-card" role="listitem">
                  {p.cover_image_url ? (
                     <div style={{ position: "relative", width: "100%", height: "82px" }}>
                       <Image src={p.cover_image_url} alt={p.title} fill sizes="150px" style={{ objectFit: "cover" }} priority={i === 0} />
                     </div>
                  ) : <div className="bl-popular-img-ph" aria-hidden="true">📰</div>}
                  <div className="bl-popular-info">
                    <p className="bl-popular-card-title">{p.title}</p>
                    <div className="bl-popular-stat">👁 {(p.view_count || 0).toLocaleString()} views</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <nav aria-label="Blog filters">
          <div className="bl-search-wrap">
            <label htmlFor="blog-search" className="sr-only">Search articles</label>
            <input id="blog-search" className="bl-search-input" placeholder="Search articles, topics, tags…" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search articles, topics, tags" autoComplete="off" spellCheck="false" />
            {search ? <button className="bl-search-clear" onClick={() => setSearch("")} aria-label="Clear search">✕</button> : <span className="bl-search-icon" aria-hidden="true">🔍</span>}
          </div>

          {allTags.length > 0 && <TagFilter allTags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />}

          <div className="bl-sort-wrap">
            <span className="bl-result-count" aria-live="polite" aria-atomic="true">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"} {activeTag !== "all" ? ` tagged #${activeTag}` : ""}
            </span>
            <div className="bl-sort-btns" role="group" aria-label="Sort articles">
              <button className={`bl-sort-btn${sort === "newest" ? " active" : ""}`} onClick={() => setSort("newest")} aria-pressed={sort === "newest"}>🕐 Newest</button>
              <button className={`bl-sort-btn${sort === "most_viewed" ? " active" : ""}`} onClick={() => setSort("most_viewed")} aria-pressed={sort === "most_viewed"}>👁 Most Viewed</button>
            </div>
          </div>
        </nav>

        {filtered.length > 0 ? (
          <section>
            {heroPost && <HeroCard post={heroPost} bookmarks={bookmarks} onBookmark={handleBookmark} onShare={handleShare} />}
            
            <div className="blogs-list" role="list">
              {visibleList.map((p, i) => (
                <BlogCard key={p.id} post={p} index={i} bookmarks={bookmarks} onBookmark={handleBookmark} onShare={handleShare} />
              ))}
            </div>
            
            {hasMore && (
              <>
                <div ref={sentinelRef} className="bl-load-sentinel" aria-hidden="true" />
                {loadingMore && <div className="bl-loading-more" aria-live="polite"><div className="bl-spinner" /><span>Loading more…</span></div>}
              </>
            )}
            {!hasMore && filtered.length > 1 && (
              <div className="bl-end-message" aria-live="polite"><div className="bl-end-line" /><span>You've read everything ✦</span><div className="bl-end-line" /></div>
            )}
          </section>
        ) : (
          <AnimatePresence>
            <motion.div className="bl-no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status">
              <span style={{ fontSize: "2.2rem", display: "block", marginBottom: "10px" }} aria-hidden="true">🔍</span>
              <h2 className="bl-no-results-title">No results found</h2>
              <p>Try a different search term or clear the filters.</p>
              <button className="bl-clear-btn" onClick={clearFilters}>Clear Filters</button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}