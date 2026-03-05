import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

/* ─────────────────────── Global Styles (Mobile First) ─────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy: #0b1437; --royal: #1a3a8f; --sky: #3b82f6;
    --gold: #f59e0b; --gold-light: #fcd34d; --slate: #64748b;
    --light: #f0f4ff; --card-bg: rgba(255,255,255,0.97);
  }

  * {
    box-sizing: border-box;
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

  /* Background Effects */
  .bg-orbs { position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
  .bg-orb-1 { position:absolute;width:600px;height:600px;border-radius:50%;background:rgba(59,130,246,0.06);filter:blur(80px);top:-200px;left:-200px; }
  .bg-orb-2 { position:absolute;width:500px;height:500px;border-radius:50%;background:rgba(245,158,11,0.05);filter:blur(80px);top:300px;right:-250px; }

  /* Container: Mobile base padding */
  .blogs-container {
    width: 100%;
    max-width: 860px; 
    margin: 0 auto;
    padding: 24px 16px 48px;
    position: relative; 
    z-index: 2; 
    flex: 1;
  }

  /* Typography: Mobile base */
  .sec-label { display:inline-block;background:linear-gradient(135deg,var(--gold),var(--gold-light));color:var(--navy);padding:6px 14px;border-radius:30px;font-size:0.7rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 12px rgba(245,158,11,0.25); }
  .sec-title { font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:var(--navy);line-height:1.15;margin-bottom:10px; }
  .sec-title span { background:linear-gradient(135deg,var(--royal),var(--sky));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
  .sec-desc { color:var(--slate);font-size:0.9rem;line-height:1.5;margin-bottom:24px; }

  /* ── Popular Posts (Mobile Scroll Snap) ── */
  .bl-popular-section { margin-bottom:24px; width:100%; }
  .bl-popular-title { font-size:0.75rem;font-weight:800;color:var(--slate);text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;display:flex;align-items:center;gap:6px; }
  .bl-popular-list { display:flex;gap:12px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none;scroll-snap-type:x mandatory; -webkit-overflow-scrolling: touch; }
  .bl-popular-list::-webkit-scrollbar { display:none; }
  .bl-popular-card { flex-shrink:0;width:145px;scroll-snap-align:start;border-radius:14px;overflow:hidden;text-decoration:none;background:#fff;border:1px solid rgba(59,130,246,0.08);transition:transform 0.2s,box-shadow 0.2s; }
  .bl-popular-card:active { transform:scale(0.98); }
  .bl-popular-img { width:100%;height:80px;object-fit:cover;display:block; }
  .bl-popular-img-ph { width:100%;height:80px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--navy),var(--royal));font-size:1.4rem; }
  .bl-popular-info { padding:10px; }
  .bl-popular-info h4 { font-size:0.8rem;font-weight:700;color:var(--navy);margin:0 0 6px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
  .bl-popular-stat { font-size:0.65rem;color:var(--slate);font-weight:600;display:flex;align-items:center;gap:4px; }

  /* ── Search (Mobile Touch Target) ── */
  .bl-search-wrap { position:relative;margin-bottom:16px; width:100%; }
  /* font-size: 1rem (16px) is strictly required to prevent iOS zoom on focus */
  .bl-search-input { width:100%;padding:14px 44px 14px 18px;border:1.5px solid rgba(26,58,143,0.15);border-radius:30px;font-size:1rem;color:#0f172a;background:#fff;outline:none;font-family:inherit;transition:border-color 0.2s,box-shadow 0.2s;box-shadow:0 2px 10px rgba(11,20,55,0.04); appearance: none; }
  .bl-search-input:focus { border-color:rgba(26,58,143,0.4);box-shadow:0 0 0 3px rgba(26,58,143,0.07); }
  .bl-search-icon { position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:1.1rem;opacity:0.4;pointer-events:none; }
  .bl-search-clear { position:absolute;right:14px;top:50%;transform:translateY(-50%);background:rgba(100,116,139,0.15);border:none;border-radius:50%;width:26px;height:26px;cursor:pointer;font-size:0.8rem;color:#475569;display:flex;align-items:center;justify-content:center; }

  /* ── Tag Filter ── */
  .bl-tags-wrap { display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;align-items:center; }
  .bl-tag-filter-label { font-size:0.7rem;font-weight:800;color:var(--slate);text-transform:uppercase;letter-spacing:0.08em; width:100%; margin-bottom: 2px;}
  .bl-tag-btn { padding:6px 14px;border-radius:20px;border:1.5px solid rgba(26,58,143,0.15);background:#fff;font-size:0.75rem;font-weight:700;color:var(--slate);cursor:pointer;transition:all 0.15s; touch-action: manipulation; }
  .bl-tag-btn.active { background:var(--royal);color:#fff;border-color:var(--royal);box-shadow:0 3px 10px rgba(26,58,143,0.2); }

  /* ── Sort Bar (Stacked on Mobile) ── */
  .bl-sort-wrap { display:flex;flex-direction:column;align-items:flex-start;margin-bottom:16px;gap:12px; width:100%; }
  .bl-result-count { font-size:0.8rem;color:var(--slate);font-weight:600; }
  .bl-sort-btns { display:flex;gap:8px; width:100%; overflow-x:auto; padding-bottom:4px; }
  .bl-sort-btn { padding:8px 14px;border-radius:20px;border:1.5px solid rgba(26,58,143,0.12);background:#fff;font-size:0.75rem;font-weight:700;color:var(--slate);cursor:pointer;transition:all 0.15s; white-space:nowrap; }
  .bl-sort-btn.active { background:rgba(26,58,143,0.08);color:var(--royal);border-color:rgba(26,58,143,0.3); }

  /* ── Blog Cards ── */
  .blogs-list { display:flex;flex-direction:column;gap:16px; }
  .blog-card { display:flex;flex-direction:row;align-items:center;gap:12px;background:var(--card-bg);backdrop-filter:blur(12px);border-radius:20px;padding:12px;text-decoration:none;box-shadow:0 4px 20px rgba(11,20,55,0.04);border:1px solid rgba(59,130,246,0.08);transition:transform 0.2s,box-shadow 0.2s;position:relative;overflow:hidden; }
  .blog-card::before { content:'';position:absolute;top:0;left:0;bottom:0;width:4px;background:linear-gradient(180deg,var(--royal),var(--sky));border-radius:20px 0 0 20px;opacity:0;transition:opacity 0.25s; }
  .blog-card:active { transform:scale(0.98); }
  
  .blog-img-wrap { width:80px;aspect-ratio:1;border-radius:14px;overflow:hidden;flex-shrink:0;box-shadow:0 2px 10px rgba(11,20,55,0.06);position:relative;background:linear-gradient(135deg,var(--navy),var(--royal)); }
  .blog-img-wrap img { width:100%;height:100%;object-fit:cover;transition:transform 0.5s; }

  .blog-content { display:flex;flex-direction:column;justify-content:center;flex:1;min-width:0; }
  .blog-title { font-family:'Playfair Display',serif;font-weight:800;font-size:1.05rem;color:var(--navy);line-height:1.2;margin:0 0 6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; word-break: break-word; }
  .blog-excerpt { color:var(--slate);font-size:0.8rem;line-height:1.4;margin:0 0 8px;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden; }

  .blog-tags-row { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px; }
  .blog-tag-pill { background:rgba(26,58,143,0.07);color:var(--royal);border:1px solid rgba(26,58,143,0.12);padding:3px 8px;border-radius:10px;font-size:0.6rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase; }

  .blog-meta { display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap; }
  .blog-date-pill { background:rgba(59,130,246,0.1);color:var(--royal);padding:4px 10px;border-radius:10px;font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em; }
  .blog-stats { display:flex;align-items:center;gap:10px; }
  .blog-stat { font-size:0.65rem;color:var(--slate);font-weight:600;display:flex;align-items:center;gap:4px; }
  .blog-read-more { color:var(--sky);display:flex;align-items:center;gap:4px;font-weight:800;font-size:0.75rem;text-transform:uppercase; }

  /* ── No Results ── */
  .bl-no-results { text-align:center;padding:40px 20px;background:var(--card-bg);border-radius:20px;border:1px dashed rgba(59,130,246,0.2); }
  .bl-no-results h3 { font-family:'Playfair Display',serif;color:var(--navy);font-size:1.25rem;margin:0 0 8px; }
  .bl-no-results p { color:var(--slate);margin:0 0 20px;font-size:0.9rem; }
  .bl-clear-btn { padding:10px 24px;border:none;border-radius:30px;background:linear-gradient(135deg,var(--royal),var(--sky));color:#fff;font-size:0.85rem;font-weight:800;cursor:pointer; }

  /* Skeleton */
  .skel-bg { background:linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);background-size:400% 100%;animation:skel-load 1.5s ease-in-out infinite; }
  @keyframes skel-load { 0%{background-position:200% 0}100%{background-position:-200% 0} }

  /* Footer (Mobile First) */
  .site-footer { background:var(--navy);color:rgba(255,255,255,0.6);padding:32px 16px;text-align:center;font-size:0.8rem;margin-top:auto; }
  .site-footer strong { color:var(--gold-light); }
  .footer-links { display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:16px; }
  .site-footer a { color:rgba(255,255,255,0.4);text-decoration:none;padding:4px 8px;transition:color 0.2s; }

  /* ─────────────────────── MEDIA QUERIES (Tablet & Desktop Up) ─────────────────────── */
  
  @media(min-width: 640px) {
    .blogs-container { padding: 40px 24px 60px; }
    
    .sec-title { font-size: 2.2rem; }
    .sec-desc { font-size: 1.05rem; }
    
    .bl-tag-filter-label { width: auto; margin-bottom: 0; margin-right: 4px; }
    
    .bl-sort-wrap { flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .bl-sort-btns { width: auto; padding-bottom: 0; }
    
    .blog-card { padding: 16px; gap: 16px; }
    .blog-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(11,20,55,0.08); }
    .blog-card:hover::before { opacity: 1; }
    .blog-card:hover .blog-img-wrap img { transform: scale(1.05); }
    .blog-card:active { transform: none; }
    
    .blog-img-wrap { width: 100px; }
    .blog-title { font-size: 1.25rem; }
    .blog-excerpt { font-size: 0.9rem; }
    
    .site-footer { padding: 40px 24px; font-size: 0.9rem; margin-top: 40px; }
    .footer-links { gap: 20px; }
    .site-footer a:hover { color: #fff; }
  }

  @media(min-width: 1024px) {
    .blogs-container { padding: 60px 32px 80px; }
    .sec-title { font-size: 2.8rem; }
    .blog-img-wrap { width: 120px; }
  }
`;

const fadeUp = {
  initial:{opacity:0,y:20}, whileInView:{opacity:1,y:0},
  viewport:{once:true,margin:"-20px"}, transition:{duration:0.5}
};
const stagger = (i) => ({ ...fadeUp, transition:{ duration:0.4, delay:i*0.08 } });

function formatDate(d) {
  if (!d) return "New";
  return new Date(d).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" });
}

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

  return (
    <div className="blogs-root">
      <style>{styles}</style>
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

      <footer className="site-footer">
        <div style={{marginBottom:10,fontSize:"1.2rem"}}>🕌</div>
        <p>© 2025 <strong>AIDLA</strong>. All rights reserved. Designed with ❤️ for learners everywhere.</p>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}