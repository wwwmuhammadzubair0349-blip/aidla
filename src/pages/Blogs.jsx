import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet"; // or "react-helmet-async"
import { supabase } from "../lib/supabase";
import Footer from "../pages/components/footer"; // adjust path if needed
import "./blogs.css";

const fadeUp = {
  initial:{opacity:0,y:20}, whileInView:{opacity:1,y:0},
  viewport:{once:true,margin:"-20px"}, transition:{duration:0.5}
};
const stagger = (i) => ({ ...fadeUp, transition:{ duration:0.4, delay:i*0.08 } });

function formatDate(d) {
  if (!d) return "New";
  return new Date(d).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" });
}

// Canonical URL – replace with your actual domain
const CANONICAL_URL = "https://aidla.online/blogs";
const OG_IMAGE = "https://aidla.online/og-blogs.jpg";
const TWITTER_IMAGE = "https://aidla.online/twitter-blogs.jpg";

export default function Blogs() {
  const[loading, setLoading]   = useState(true);
  const [posts, setPosts]       = useState([]);
  const[msg, setMsg]           = useState("");
  const [search, setSearch]     = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [sort, setSort]         = useState("newest");

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
  },[]);

  // All unique tags
  const allTags = useMemo(() => {
    const set = new Set();
    posts.forEach(p => (p.tags ||[]).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);

  // Top 5 most viewed
  const popularPosts = useMemo(() =>
    [...posts].sort((a,b) => (b.view_count||0) - (a.view_count||0)).slice(0,5)
  , [posts]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let result = [...posts];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        (p.tags ||[]).some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeTag !== "all") result = result.filter(p => (p.tags||[]).includes(activeTag));
    if (sort === "newest") result.sort((a,b) => new Date(b.published_at) - new Date(a.published_at));
    else if (sort === "most_viewed") result.sort((a,b) => (b.view_count||0) - (a.view_count||0));
    return result;
  },[posts, search, activeTag, sort]);

  const clearFilters = () => { setSearch(""); setActiveTag("all"); setSort("newest"); };

  // JSON-LD structured data for the blog listing page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AIDLA Insights – Educational Blog",
    "description": "Discover educational strategies, app updates, and tips to maximize your learning and earnings on AIDLA.",
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
        <title>AIDLA Insights – Educational Blog & Updates</title>
        <meta
          name="description"
          content="Explore AIDLA's blog for learning strategies, platform updates, and tips to earn more coins. Stay informed and maximize your experience."
        />
        <meta
          name="keywords"
          content="AIDLA blog, educational insights, learning tips, platform updates, Pakistan edtech"
        />
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href={CANONICAL_URL} />

        {/* Open Graph */}
        <meta property="og:title" content="AIDLA Insights – Educational Blog" />
        <meta property="og:description" content="Learn, earn, and stay updated with AIDLA's official blog." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="AIDLA Insights Blog" />
        <meta property="og:site_name" content="AIDLA" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIDLA Insights" />
        <meta name="twitter:description" content="Educational blog by AIDLA – tips, updates, and more." />
        <meta name="twitter:image" content={TWITTER_IMAGE} />
        <meta name="twitter:image:alt" content="AIDLA Insights Blog" />

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

      <div className="blogs-root">
        <div className="bg-orbs"><div className="bg-orb-1"/><div className="bg-orb-2"/></div>

        <div className="blogs-container">

          {/* Header */}
          <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <span className="sec-label">Latest Updates</span>
            <h2 className="sec-title">AIDLA <span>Insights</span></h2>
            <p className="sec-desc">Discover educational strategies, app updates, and tips to maximize your learning and earnings.</p>
          </motion.div>

          {msg && (
            <div style={{background:"rgba(254,226,226,0.9)",border:"1px solid #fca5a5",color:"#991b1b",padding:"12px",borderRadius:"12px",marginBottom:"20px",fontSize:"0.85rem",fontWeight:600}}>
              {msg}
            </div>
          )}

          {/* Popular Posts Strip */}
          {!loading && popularPosts.length > 0 && (
            <motion.div className="bl-popular-section" {...fadeUp}>
              <div className="bl-popular-title">🔥 Popular Posts</div>
              <div className="bl-popular-list">
                {popularPosts.map(p => (
                  <Link to={`/blogs/${p.slug}`} key={p.id} className="bl-popular-card">
                    {p.cover_image_url
                      ? <img src={p.cover_image_url} alt={p.title} className="bl-popular-img" loading="lazy"/>
                      : <div className="bl-popular-img-ph">📰</div>
                    }
                    <div className="bl-popular-info">
                      <h4>{p.title}</h4>
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
              <input
                className="bl-search-input"
                placeholder="Search articles, topics, tags…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search
                ? <button className="bl-search-clear" onClick={() => setSearch("")}>✕</button>
                : <span className="bl-search-icon">🔍</span>
              }
            </div>
          </motion.div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <motion.div {...fadeUp}>
              <div className="bl-tags-wrap">
                <span className="bl-tag-filter-label">Filter:</span>
                <button className={`bl-tag-btn${activeTag==="all"?" active":""}`} onClick={() => setActiveTag("all")}>All</button>
                {allTags.map(t => (
                  <button key={t} className={`bl-tag-btn${activeTag===t?" active":""}`} onClick={() => setActiveTag(t)}>#{t}</button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sort + Count */}
          {!loading && (
            <div className="bl-sort-wrap">
              <span className="bl-result-count">
                {filtered.length} {filtered.length===1?"article":"articles"}{activeTag!=="all"?` tagged #${activeTag}`:""}
              </span>
              <div className="bl-sort-btns">
                <button className={`bl-sort-btn${sort==="newest"?" active":""}`} onClick={() => setSort("newest")}>🕐 Newest</button>
                <button className={`bl-sort-btn${sort==="most_viewed"?" active":""}`} onClick={() => setSort("most_viewed")}>👁 Most Viewed</button>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="blogs-list">
            {loading ? (
              [1,2,3,4].map((n,i) => (
                <motion.div key={n} className="blog-card" {...stagger(i)}>
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
                <motion.div key={p.id} {...stagger(i)}>
                  <Link to={`/blogs/${p.slug}`} className="blog-card">
                    <div className="blog-img-wrap">
                      {p.cover_image_url
                        ? <img src={p.cover_image_url} alt={p.title} loading="lazy"/>
                        : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:"1.5rem"}}>📰</span></div>
                      }
                    </div>
                    <div className="blog-content">
                      <h3 className="blog-title">{p.title}</h3>
                      {p.tags?.length > 0 && (
                        <div className="blog-tags-row">
                          {p.tags.slice(0,3).map(t => <span key={t} className="blog-tag-pill">#{t}</span>)}
                        </div>
                      )}
                      <p className="blog-excerpt">{p.excerpt || "Click to read this full article..."}</p>
                      <div className="blog-meta">
                        <span className="blog-date-pill">{formatDate(p.published_at)}</span>
                        <div className="blog-stats">
                          <span className="blog-stat">👁 {(p.view_count||0).toLocaleString()}</span>
                          <span className="blog-read-more">Read ›</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <AnimatePresence>
                {search || activeTag !== "all" ? (
                  <motion.div className="bl-no-results" {...fadeUp}>
                    <span style={{fontSize:"2.2rem",display:"block",marginBottom:"10px"}}>🔍</span>
                    <h3>No results found</h3>
                    <p>Try a different search term or clear the filters.</p>
                    <button className="bl-clear-btn" onClick={clearFilters}>Clear Filters</button>
                  </motion.div>
                ) : !msg && (
                  <motion.div style={{textAlign:"center",padding:"40px 20px",background:"var(--card-bg)",borderRadius:"20px",border:"1px dashed rgba(59,130,246,0.2)"}} {...fadeUp}>
                    <span style={{fontSize:"2.5rem",display:"block",marginBottom:"12px"}}>📚</span>
                    <h3 style={{fontFamily:"'Playfair Display',serif",color:"var(--navy)",fontSize:"1.25rem",margin:"0 0 8px"}}>No Insights Yet</h3>
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