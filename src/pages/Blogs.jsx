import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { supabase } from "../lib/supabase";
import Footer from "../pages/components/footer";
import "./Blogs.css";

const fadeUp = {
  initial:{opacity:0,y:20}, whileInView:{opacity:1,y:0},
  viewport:{once:true,margin:"-20px"}, transition:{duration:0.5}
};
const stagger = (i) => ({ ...fadeUp, transition:{ duration:0.4, delay:i*0.08 } });

function formatDate(d) {
  if (!d) return "New";
  return new Date(d).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" });
}

const CANONICAL_URL = "https://aidla.online/blogs";
const OG_IMAGE      = "https://aidla.online/og-blogs.jpg";
const TWITTER_IMAGE = "https://aidla.online/twitter-blogs.jpg";

// Collapsed height constant — 3 rows of tags
// tag height (32px) + gap (8px) = 40px/row × 3 rows = 120px + 12px padding-bottom = 132px
const COLLAPSED_H = 132;

/* ─── Collapsible Tag Filter ─── */
function TagFilter({ allTags, activeTag, onTagChange }) {
  const [expanded, setExpanded] = useState(false);
  const innerRef = useRef(null);
  // Start with a known fullHeight of 0 — measured after render
  // collapsedHeight is a constant, not measured, so it's always available immediately
  const [fullHeight, setFullHeight] = useState(0);

  // Measure full (expanded) height after tags render
  useEffect(() => {
    if (!innerRef.current) return;

    const measure = () => {
      const inner = innerRef.current;
      if (!inner) return;
      // Temporarily remove constraints to measure natural height
      inner.style.maxHeight = "none";
      inner.style.overflow  = "visible";
      const full = inner.scrollHeight;
      // Restore — the CSS class handles the actual constraint
      inner.style.maxHeight = "";
      inner.style.overflow  = "";
      setFullHeight(full);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [allTags]);

  const isOverflowing = fullHeight > COLLAPSED_H;
  const hasActiveTag  = activeTag !== "all";

  const handleTagClick = (tag) => {
    onTagChange(tag);
    // Don't auto-collapse on select — user may want to change tag
  };

  const handleClear = () => {
    onTagChange("all");
    setExpanded(false);
  };

  return (
    <motion.div className="bl-tagfilter-root" {...fadeUp}>
      {/* Header row */}
      <div className="bl-tagfilter-header">
        <div className="bl-tagfilter-left">
          <span className="bl-tag-filter-label">🏷️ Filter by Tag</span>
          {hasActiveTag && (
            <span className="bl-active-tag-badge">
              #{activeTag}
              <button
                className="bl-active-tag-clear"
                onClick={handleClear}
                aria-label={`Remove tag filter: ${activeTag}`}
              >
                ✕
              </button>
            </span>
          )}
        </div>
        <div className="bl-tagfilter-right">
          {hasActiveTag && (
            <button className="bl-clear-tag-btn" onClick={handleClear}>
              Clear
            </button>
          )}
          {isOverflowing && (
            <button
              className={`bl-expand-btn ${expanded ? "expanded" : ""}`}
              onClick={() => setExpanded(e => !e)}
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse tags" : "Show all tags"}
            >
              {expanded ? (
                <><span>Collapse</span> <span className="bl-expand-icon">↑</span></>
              ) : (
                <><span>Show all</span> <span className="bl-expand-icon">↓</span></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tag pills container — animated height */}
      <div
        ref={innerRef}
        className={`bl-tags-inner ${expanded ? "expanded" : "collapsed"}`}
        style={{
          maxHeight: expanded
            ? (fullHeight > 0 ? `${fullHeight}px` : "none")
            : `${COLLAPSED_H}px`,
        }}
      >
        <button
          className={`bl-tag-btn${activeTag === "all" ? " active" : ""}`}
          onClick={() => handleTagClick("all")}
          aria-pressed={activeTag === "all"}
        >
          All
        </button>
        {allTags.map(t => (
          <button
            key={t}
            className={`bl-tag-btn${activeTag === t ? " active" : ""}`}
            onClick={() => handleTagClick(t)}
            aria-pressed={activeTag === t}
          >
            #{t}
          </button>
        ))}

        {/* Fade-out gradient shown only when collapsed and overflowing */}
        {isOverflowing && !expanded && (
          <div className="bl-tags-fade" aria-hidden="true" />
        )}
      </div>

      {/* Collapsed "tap to expand" hint — only shown when not expanded */}
      {isOverflowing && !expanded && (
        <button
          className="bl-tap-expand"
          onClick={() => setExpanded(true)}
          aria-label="Show all tags"
        >
          <span className="bl-tap-dots">
            {[...Array(3)].map((_, i) => <span key={i} className="bl-dot" />)}
          </span>
          <span>+{allTags.length - 1} more tags</span>
          <span className="bl-expand-icon-sm">›</span>
        </button>
      )}
    </motion.div>
  );
}

export default function Blogs() {
  const [loading, setLoading]     = useState(true);
  const [posts, setPosts]         = useState([]);
  const [msg, setMsg]             = useState("");
  const [search, setSearch]       = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [sort, setSort]           = useState("newest");

  useEffect(() => {
    const load = async () => {
      setLoading(true); setMsg("");
      const { data, error } = await supabase
        .from("blogs_posts")
        .select("id,title,slug,excerpt,cover_image_url,published_at,tags,view_count")
        .is("deleted_at", null)
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) { setMsg("Unable to load insights right now. Please try again later."); setPosts([]); }
      else setPosts(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const allTags = useMemo(() => {
    const set = new Set();
    posts.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);

  const popularPosts = useMemo(() =>
    [...posts].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5)
  , [posts]);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeTag !== "all") result = result.filter(p => (p.tags || []).includes(activeTag));
    if (sort === "newest") result.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    else if (sort === "most_viewed") result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    return result;
  }, [posts, search, activeTag, sort]);

  const clearFilters = () => { setSearch(""); setActiveTag("all"); setSort("newest"); };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AIDLA Insights – Educational Blog",
    "description": "Discover educational strategies, app updates, and tips to maximize your learning and earnings on AIDLA.",
    "url": CANONICAL_URL,
    "inLanguage": "en",
    "isPartOf": { "@type": "WebSite", "name": "AIDLA", "url": "https://aidla.online" }
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
        <meta name="twitter:image" content={TWITTER_IMAGE} />
        <meta name="twitter:image:alt" content="AIDLA Insights Blog" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="blogs-root">
        <div className="bg-orbs" aria-hidden="true">
          <div className="bg-orb-1"/><div className="bg-orb-2"/>
        </div>

        <div className="blogs-container">

          {/* Header */}
          <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <span className="sec-label">Latest Updates</span>
            <h1 className="sec-title">AIDLA <span>Insights</span></h1>
            <p className="sec-desc">Discover educational strategies, app updates, and tips to maximize your learning and earnings.</p>
          </motion.div>

          {msg && (
            <div role="alert" style={{background:"rgba(254,226,226,0.9)",border:"1px solid #fca5a5",color:"#991b1b",padding:"12px",borderRadius:"12px",marginBottom:"20px",fontSize:"0.85rem",fontWeight:600}}>
              {msg}
            </div>
          )}

          {/* Popular Posts */}
          {!loading && popularPosts.length > 0 && (
            <motion.div className="bl-popular-section" {...fadeUp}>
              <div className="bl-popular-title" aria-label="Popular posts">🔥 Popular Posts</div>
              <div className="bl-popular-list" role="list">
                {popularPosts.map((p, i) => (
                  <Link to={`/blogs/${p.slug}`} key={p.id} className="bl-popular-card" role="listitem">
                    {p.cover_image_url ? (
                      <img
                        src={p.cover_image_url} alt={p.title} className="bl-popular-img"
                        width="145" height="80"
                        loading={i === 0 ? "eager" : "lazy"}
                        fetchpriority={i === 0 ? "high" : undefined}
                        decoding="async"
                      />
                    ) : (
                      <div className="bl-popular-img-ph" aria-hidden="true">📰</div>
                    )}
                    <div className="bl-popular-info">
                      <p className="bl-popular-card-title">{p.title}</p>
                      <div className="bl-popular-stat">👁 {(p.view_count||0).toLocaleString()} views</div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search */}
          <motion.div {...fadeUp}>
            <div className="bl-search-wrap">
              <label htmlFor="blog-search" className="sr-only">Search articles</label>
              <input
                id="blog-search"
                className="bl-search-input"
                placeholder="Search articles, topics, tags…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search articles, topics, tags"
              />
              {search
                ? <button className="bl-search-clear" onClick={() => setSearch("")} aria-label="Clear search">✕</button>
                : <span className="bl-search-icon" aria-hidden="true">🔍</span>
              }
            </div>
          </motion.div>

          {/* ── Collapsible Tag Filter ── */}
          {allTags.length > 0 && (
            <TagFilter
              allTags={allTags}
              activeTag={activeTag}
              onTagChange={setActiveTag}
            />
          )}

          {/* Sort + Count */}
          {!loading && (
            <div className="bl-sort-wrap">
              <span className="bl-result-count" aria-live="polite" aria-atomic="true">
                {filtered.length} {filtered.length===1?"article":"articles"}{activeTag!=="all"?` tagged #${activeTag}`:""}
              </span>
              <div className="bl-sort-btns" role="group" aria-label="Sort articles">
                <button className={`bl-sort-btn${sort==="newest"?" active":""}`} onClick={() => setSort("newest")} aria-pressed={sort==="newest"}>🕐 Newest</button>
                <button className={`bl-sort-btn${sort==="most_viewed"?" active":""}`} onClick={() => setSort("most_viewed")} aria-pressed={sort==="most_viewed"}>👁 Most Viewed</button>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="blogs-list" role="list">
            {loading ? (
              [1,2,3,4].map((n,i) => (
                <motion.div key={n} className="blog-card" {...stagger(i)} aria-hidden="true">
                  <div className="blog-img-wrap skel-bg" style={{background:"none"}}/>
                  <div className="blog-content">
                    <div className="skel-bg" style={{height:"18px",width:"80%",borderRadius:"4px",marginBottom:"6px"}}/>
                    <div className="skel-bg" style={{height:"12px",width:"100%",borderRadius:"4px",marginBottom:"12px"}}/>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div className="skel-bg" style={{height:"20px",width:"70px",borderRadius:"10px"}}/>
                      <div className="skel-bg" style={{height:"14px",width:"40px",borderRadius:"4px"}}/>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((p,i) => (
                <motion.div key={p.id} {...stagger(i)} role="listitem">
                  <Link to={`/blogs/${p.slug}`} className="blog-card">
                    <div className="blog-img-wrap">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} width="120" height="120" loading="lazy" decoding="async" />
                      ) : (
                        <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}} aria-hidden="true">
                          <span style={{fontSize:"1.5rem"}}>📰</span>
                        </div>
                      )}
                    </div>
                    <div className="blog-content">
                      <h2 className="blog-title">{p.title}</h2>
                      {p.tags?.length > 0 && (
                        <div className="blog-tags-row" aria-label="Tags">
                          {p.tags.slice(0,3).map(t => <span key={t} className="blog-tag-pill">#{t}</span>)}
                        </div>
                      )}
                      <p className="blog-excerpt">{p.excerpt || "Click to read this full article..."}</p>
                      <div className="blog-meta">
                        <span className="blog-date-pill">
                          <time dateTime={p.published_at}>{formatDate(p.published_at)}</time>
                        </span>
                        <div className="blog-stats">
                          <span className="blog-stat">👁 {(p.view_count||0).toLocaleString()}</span>
                          <span className="blog-read-more" aria-hidden="true">Read ›</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <AnimatePresence>
                {search || activeTag !== "all" ? (
                  <motion.div className="bl-no-results" {...fadeUp} role="status">
                    <span style={{fontSize:"2.2rem",display:"block",marginBottom:"10px"}} aria-hidden="true">🔍</span>
                    <h2 className="bl-no-results-title">No results found</h2>
                    <p>Try a different search term or clear the filters.</p>
                    <button className="bl-clear-btn" onClick={clearFilters}>Clear Filters</button>
                  </motion.div>
                ) : !msg && (
                  <motion.div className="bl-empty-state" {...fadeUp} role="status">
                    <span style={{fontSize:"2.5rem",display:"block",marginBottom:"12px"}} aria-hidden="true">📚</span>
                    <h2 className="bl-empty-title">No Insights Yet</h2>
                    <p style={{color:"var(--slate)",margin:0,fontSize:"0.85rem"}}>We're cooking up some great content. Check back soon!</p>
                  </motion.div>
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