import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy:#0b1437;--amber:#d97706;--amber-light:#f59e0b;--amber-pale:#fef3c7;
    --slate:#64748b;--card-bg:rgba(255,255,255,0.97);
  }
  *{box-sizing:border-box;}

  .news-root{
    min-height:100vh;
    background:linear-gradient(160deg,#fffbf0 0%,#fff7ed 50%,#fef3c7 100%);
    font-family:'DM Sans',sans-serif;overflow-x:hidden;position:relative;display:flex;flex-direction:column;
  }

  .news-bg-orbs{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
  .news-orb-1{position:absolute;width:600px;height:600px;border-radius:50%;background:rgba(217,119,6,0.06);filter:blur(80px);top:-200px;left:-200px;}
  .news-orb-2{position:absolute;width:500px;height:500px;border-radius:50%;background:rgba(245,158,11,0.05);filter:blur(80px);top:300px;right:-250px;}

  .news-container{width:100%;max-width:860px;margin:0 auto;padding:24px 16px 48px;position:relative;z-index:2;flex:1;}

  .sec-label{display:inline-block;background:linear-gradient(135deg,var(--amber),var(--amber-light));color:#fff;padding:6px 14px;border-radius:30px;font-size:0.7rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 12px rgba(217,119,6,0.25);}
  .sec-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:var(--navy);line-height:1.15;margin-bottom:10px;}
  .sec-title span{background:linear-gradient(135deg,var(--amber),var(--amber-light));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .sec-desc{color:var(--slate);font-size:0.9rem;line-height:1.5;margin-bottom:24px;}

  /* Breaking ticker */
  .news-breaking-bar{background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;padding:10px 16px;border-radius:14px;margin-bottom:18px;display:flex;align-items:center;gap:10px;overflow:hidden;}
  .news-breaking-label{font-size:0.65rem;font-weight:900;background:rgba(255,255,255,0.2);padding:3px 8px;border-radius:6px;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;flex-shrink:0;}
  .news-breaking-scroll{overflow:hidden;flex:1;}
  .news-breaking-text{font-size:0.82rem;font-weight:700;white-space:nowrap;animation:nBScroll 18s linear infinite;}
  @keyframes nBScroll{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}

  /* Popular strip */
  .news-popular-section{margin-bottom:24px;width:100%;}
  .news-popular-title{font-size:0.75rem;font-weight:800;color:var(--slate);text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;display:flex;align-items:center;gap:6px;}
  .news-popular-list{display:flex;gap:12px;overflow-x:auto;padding-bottom:10px;scrollbar-width:none;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;}
  .news-popular-list::-webkit-scrollbar{display:none;}
  .news-popular-card{flex-shrink:0;width:145px;scroll-snap-align:start;border-radius:14px;overflow:hidden;text-decoration:none;background:#fff;border:1px solid rgba(217,119,6,0.1);transition:transform 0.2s,box-shadow 0.2s;}
  .news-popular-card:active{transform:scale(0.97);}
  .news-popular-img{width:100%;height:80px;object-fit:cover;display:block;}
  .news-popular-img-ph{width:100%;height:80px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#d97706,#f59e0b);font-size:1.4rem;}
  .news-popular-info{padding:10px;}
  .news-popular-info h4{font-size:0.8rem;font-weight:700;color:var(--navy);margin:0 0 6px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .news-popular-stat{font-size:0.65rem;color:var(--slate);font-weight:600;display:flex;align-items:center;gap:4px;}

  /* Search */
  .news-search-wrap{position:relative;margin-bottom:16px;width:100%;}
  .news-search-input{width:100%;padding:14px 44px 14px 18px;border:1.5px solid rgba(217,119,6,0.15);border-radius:30px;font-size:1rem;color:#0f172a;background:#fff;outline:none;font-family:inherit;transition:border-color 0.2s,box-shadow 0.2s;box-shadow:0 2px 10px rgba(217,119,6,0.04);appearance:none;}
  .news-search-input:focus{border-color:rgba(217,119,6,0.4);box-shadow:0 0 0 3px rgba(217,119,6,0.07);}
  .news-search-icon{position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:1.1rem;opacity:0.4;pointer-events:none;}
  .news-search-clear{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:rgba(100,116,139,0.15);border:none;border-radius:50%;width:26px;height:26px;cursor:pointer;font-size:0.8rem;color:#475569;display:flex;align-items:center;justify-content:center;}

  /* Category filter */
  .news-cat-wrap{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;align-items:center;}
  .news-cat-btn{padding:6px 14px;border-radius:20px;border:1.5px solid rgba(217,119,6,0.15);background:#fff;font-size:0.75rem;font-weight:700;color:var(--slate);cursor:pointer;transition:all 0.15s;touch-action:manipulation;}
  .news-cat-btn.active{background:var(--amber);color:#fff;border-color:var(--amber);box-shadow:0 3px 10px rgba(217,119,6,0.25);}

  /* Tag filter */
  .news-tags-wrap{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;}
  .news-tag-btn{padding:5px 12px;border-radius:20px;border:1.5px solid rgba(217,119,6,0.12);background:#fff;font-size:0.72rem;font-weight:700;color:var(--slate);cursor:pointer;transition:all 0.15s;touch-action:manipulation;}
  .news-tag-btn.active{background:var(--navy);color:#fff;border-color:var(--navy);}

  /* Sort bar */
  .news-sort-wrap{display:flex;flex-direction:column;align-items:flex-start;margin-bottom:16px;gap:10px;width:100%;}
  .news-result-count{font-size:0.8rem;color:var(--slate);font-weight:600;}
  .news-sort-btns{display:flex;gap:8px;width:100%;overflow-x:auto;padding-bottom:4px;}
  .news-sort-btn{padding:8px 14px;border-radius:20px;border:1.5px solid rgba(217,119,6,0.12);background:#fff;font-size:0.75rem;font-weight:700;color:var(--slate);cursor:pointer;transition:all 0.15s;white-space:nowrap;}
  .news-sort-btn.active{background:rgba(217,119,6,0.08);color:var(--amber);border-color:rgba(217,119,6,0.3);}

  /* News cards */
  .news-list{display:flex;flex-direction:column;gap:16px;}
  .news-card{display:flex;flex-direction:row;align-items:center;gap:12px;background:var(--card-bg);backdrop-filter:blur(12px);border-radius:20px;padding:12px;text-decoration:none;box-shadow:0 4px 20px rgba(11,20,55,0.04);border:1px solid rgba(217,119,6,0.08);transition:transform 0.2s,box-shadow 0.2s;position:relative;overflow:hidden;}
  .news-card::before{content:'';position:absolute;top:0;left:0;bottom:0;width:4px;background:linear-gradient(180deg,var(--amber),var(--amber-light));border-radius:20px 0 0 20px;opacity:0;transition:opacity 0.25s;}
  .news-card:active{transform:scale(0.98);}

  .news-img-wrap{width:80px;aspect-ratio:1;border-radius:14px;overflow:hidden;flex-shrink:0;box-shadow:0 2px 10px rgba(11,20,55,0.06);position:relative;background:linear-gradient(135deg,#d97706,#f59e0b);}
  .news-img-wrap img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s;}

  .news-content{display:flex;flex-direction:column;justify-content:center;flex:1;min-width:0;}
  .news-title{font-family:'Playfair Display',serif;font-weight:800;font-size:1.05rem;color:var(--navy);line-height:1.2;margin:0 0 6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;}
  .news-excerpt{color:var(--slate);font-size:0.8rem;line-height:1.4;margin:0 0 8px;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;}

  .news-badges{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:7px;align-items:center;}
  .news-breaking-badge{display:inline-flex;align-items:center;gap:3px;background:rgba(239,68,68,0.9);color:#fff;padding:2px 7px;border-radius:6px;font-size:0.58rem;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;animation:nBreathePulse 1.5s ease-in-out infinite;}
  @keyframes nBreathePulse{0%,100%{opacity:1}50%{opacity:0.65}}
  .news-cat-badge{display:inline-flex;padding:2px 8px;border-radius:10px;font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;}
  .news-tag-pill{background:rgba(217,119,6,0.07);color:var(--amber);border:1px solid rgba(217,119,6,0.15);padding:3px 8px;border-radius:10px;font-size:0.6rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;}

  .news-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;}
  .news-date-pill{background:rgba(217,119,6,0.1);color:var(--amber);padding:4px 10px;border-radius:10px;font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;}
  .news-stats{display:flex;align-items:center;gap:8px;}
  .news-stat{font-size:0.65rem;color:var(--slate);font-weight:600;display:flex;align-items:center;gap:3px;}
  .news-read-more{color:var(--amber);display:flex;align-items:center;gap:4px;font-weight:800;font-size:0.75rem;text-transform:uppercase;}

  /* No results */
  .news-no-results{text-align:center;padding:40px 20px;background:var(--card-bg);border-radius:20px;border:1px dashed rgba(217,119,6,0.2);}
  .news-no-results h3{font-family:'Playfair Display',serif;color:var(--navy);font-size:1.25rem;margin:0 0 8px;}
  .news-no-results p{color:var(--slate);margin:0 0 20px;font-size:0.9rem;}
  .news-clear-btn{padding:10px 24px;border:none;border-radius:30px;background:linear-gradient(135deg,var(--amber),var(--amber-light));color:#fff;font-size:0.85rem;font-weight:800;cursor:pointer;}

  .skel-bg{background:linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);background-size:400% 100%;animation:skelLoad 1.5s ease-in-out infinite;}
  @keyframes skelLoad{0%{background-position:200% 0}100%{background-position:-200% 0}}

  .site-footer{background:var(--navy);color:rgba(255,255,255,0.6);padding:32px 16px;text-align:center;font-size:0.8rem;margin-top:auto;}
  .site-footer strong{color:#fcd34d;}
  .footer-links{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:16px;}
  .site-footer a{color:rgba(255,255,255,0.4);text-decoration:none;padding:4px 8px;transition:color 0.2s;}

  @media(min-width:640px){
    .news-container{padding:40px 24px 60px;}
    .sec-title{font-size:2.2rem;}
    .news-sort-wrap{flex-direction:row;align-items:center;justify-content:space-between;}
    .news-sort-btns{width:auto;padding-bottom:0;}
    .news-card{padding:16px;gap:16px;}
    .news-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(11,20,55,0.08);}
    .news-card:hover::before{opacity:1;}
    .news-card:hover .news-img-wrap img{transform:scale(1.05);}
    .news-card:active{transform:none;}
    .news-img-wrap{width:100px;}
    .news-title{font-size:1.2rem;}
    .site-footer{padding:40px 24px;font-size:0.9rem;}
    .site-footer a:hover{color:#fff;}
  }
  @media(min-width:1024px){
    .news-container{padding:60px 32px 80px;}
    .sec-title{font-size:2.6rem;}
    .news-img-wrap{width:120px;}
  }
`;

const CAT_COLORS = {
  general:"#3b82f6",politics:"#8b5cf6",education:"#0891b2",
  technology:"#0f766e",community:"#16a34a",events:"#d97706",announcements:"#dc2626",
};
const CAT_LABELS = {
  general:"🌐 General",politics:"🏛️ Politics",education:"📚 Education",
  technology:"💻 Technology",community:"🤝 Community",events:"🎯 Events",announcements:"📢 Announcements",
};
const KNOWN_CATS = Object.keys(CAT_COLORS);

const fadeUp = {
  initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},
  viewport:{once:true,margin:"-20px"},transition:{duration:0.5}
};
const stagger = i=>({...fadeUp,transition:{duration:0.4,delay:i*0.08}});

function formatDate(d) {
  if (!d) return "New";
  return new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
}

export default function News() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts]     = useState([]);
  const [msg, setMsg]         = useState("");
  const [search, setSearch]   = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [activeCat, setActiveCat] = useState("all");
  const [sort, setSort]       = useState("newest");

  useEffect(()=>{
    const load = async () => {
      setLoading(true); setMsg("");
      const { data, error } = await supabase
        .from("news_posts")
        .select("id,title,slug,excerpt,cover_image_url,published_at,tags,view_count")
        .is("deleted_at",null).eq("status","published")
        .order("published_at",{ascending:false});
      if (error) { setMsg("Unable to load news right now. Please try again."); setPosts([]); }
      else setPosts(data||[]);
      setLoading(false);
    };
    load();
  },[]);

  // Breaking posts
  const breakingPosts = useMemo(()=>posts.filter(p=>(p.tags||[]).includes("breaking")),[posts]);

  // All unique non-system tags
  const allTags = useMemo(()=>{
    const set = new Set();
    posts.forEach(p=>(p.tags||[]).forEach(t=>{ if(!KNOWN_CATS.includes(t)&&t!=="breaking") set.add(t); }));
    return Array.from(set).sort();
  },[posts]);

  // Categories present
  const allCats = useMemo(()=>{
    const set = new Set();
    posts.forEach(p=>(p.tags||[]).forEach(t=>{ if(KNOWN_CATS.includes(t)) set.add(t); }));
    return Array.from(set);
  },[posts]);

  // Popular
  const popularPosts = useMemo(()=>[...posts].sort((a,b)=>(b.view_count||0)-(a.view_count||0)).slice(0,5),[posts]);

  // Filtered
  const filtered = useMemo(()=>{
    let r = [...posts];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(p=>p.title?.toLowerCase().includes(q)||p.excerpt?.toLowerCase().includes(q)||(p.tags||[]).some(t=>t.toLowerCase().includes(q)));
    }
    if (activeCat!=="all") r = r.filter(p=>(p.tags||[]).includes(activeCat));
    if (activeTag!=="all") r = r.filter(p=>(p.tags||[]).includes(activeTag));
    if (sort==="newest") r.sort((a,b)=>new Date(b.published_at)-new Date(a.published_at));
    else if (sort==="most_viewed") r.sort((a,b)=>(b.view_count||0)-(a.view_count||0));
    return r;
  },[posts,search,activeCat,activeTag,sort]);

  const clearFilters = () => { setSearch(""); setActiveTag("all"); setActiveCat("all"); setSort("newest"); };

  return (
    <div className="news-root">
      <style>{styles}</style>
      <div className="news-bg-orbs"><div className="news-orb-1"/><div className="news-orb-2"/></div>

      <div className="news-container">
        {/* Header */}
        <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
          <span className="sec-label">Latest News</span>
          <h2 className="sec-title">AIDLA <span>News</span></h2>
          <p className="sec-desc">Stay updated with the latest announcements, events, and community news from AIDLA.</p>
        </motion.div>

        {msg && (
          <div style={{background:"rgba(254,226,226,0.9)",border:"1px solid #fca5a5",color:"#991b1b",padding:"12px",borderRadius:"12px",marginBottom:"20px",fontSize:"0.85rem",fontWeight:600}}>
            {msg}
          </div>
        )}

        {/* Breaking News Ticker */}
        {!loading && breakingPosts.length>0 && (
          <motion.div className="news-breaking-bar" {...fadeUp}>
            <span className="news-breaking-label">🔴 Breaking</span>
            <div className="news-breaking-scroll">
              <div className="news-breaking-text">
                {breakingPosts.map(p=>p.title).join("  •  ")}
              </div>
            </div>
          </motion.div>
        )}

        {/* Popular Posts Strip */}
        {!loading && popularPosts.length>0 && (
          <motion.div className="news-popular-section" {...fadeUp}>
            <div className="news-popular-title">🔥 Most Read</div>
            <div className="news-popular-list">
              {popularPosts.map(p=>(
                <Link to={`/news/${p.slug}`} key={p.id} className="news-popular-card">
                  {p.cover_image_url
                    ? <img src={p.cover_image_url} alt={p.title} className="news-popular-img" loading="lazy"/>
                    : <div className="news-popular-img-ph">📰</div>
                  }
                  <div className="news-popular-info">
                    <h4>{p.title}</h4>
                    <div className="news-popular-stat">👁 {(p.view_count||0).toLocaleString()} views</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search */}
        <motion.div {...fadeUp}>
          <div className="news-search-wrap">
            <input className="news-search-input" placeholder="Search news, topics, tags…" value={search} onChange={e=>setSearch(e.target.value)}/>
            {search
              ? <button className="news-search-clear" onClick={()=>setSearch("")}>✕</button>
              : <span className="news-search-icon">🔍</span>
            }
          </div>
        </motion.div>

        {/* Category Filter */}
        {allCats.length>0 && (
          <motion.div {...fadeUp}>
            <div className="news-cat-wrap">
              <button className={`news-cat-btn${activeCat==="all"?" active":""}`} onClick={()=>setActiveCat("all")}>All</button>
              {allCats.map(c=>(
                <button key={c} className={`news-cat-btn${activeCat===c?" active":""}`}
                  style={activeCat===c?{}:{}}
                  onClick={()=>setActiveCat(c)}>{CAT_LABELS[c]||c}</button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tag Filter */}
        {allTags.length>0 && (
          <motion.div {...fadeUp}>
            <div className="news-tags-wrap">
              <button className={`news-tag-btn${activeTag==="all"?" active":""}`} onClick={()=>setActiveTag("all")}>All Tags</button>
              {allTags.map(t=>(
                <button key={t} className={`news-tag-btn${activeTag===t?" active":""}`} onClick={()=>setActiveTag(t)}>#{t}</button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sort + Count */}
        {!loading && (
          <div className="news-sort-wrap">
            <span className="news-result-count">
              {filtered.length} {filtered.length===1?"article":"articles"}
              {activeCat!=="all"?` in ${CAT_LABELS[activeCat]||activeCat}`:""}
              {activeTag!=="all"?` tagged #${activeTag}`:""}
            </span>
            <div className="news-sort-btns">
              <button className={`news-sort-btn${sort==="newest"?" active":""}`} onClick={()=>setSort("newest")}>🕐 Newest</button>
              <button className={`news-sort-btn${sort==="most_viewed"?" active":""}`} onClick={()=>setSort("most_viewed")}>👁 Most Viewed</button>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="news-list">
          {loading ? (
            [1,2,3,4].map((n,i)=>(
              <motion.div key={n} className="news-card" {...stagger(i)}>
                <div className="news-img-wrap skel-bg" style={{background:"none"}}/>
                <div className="news-content">
                  <div className="skel-bg" style={{height:18,width:"80%",borderRadius:4,marginBottom:6}}/>
                  <div className="skel-bg" style={{height:12,width:"100%",borderRadius:4,marginBottom:12}}/>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div className="skel-bg" style={{height:20,width:70,borderRadius:10}}/>
                    <div className="skel-bg" style={{height:14,width:40,borderRadius:4}}/>
                  </div>
                </div>
              </motion.div>
            ))
          ) : filtered.length>0 ? (
            filtered.map((p,i)=>{
              const pTags = p.tags||[];
              const pCat = pTags.find(t=>KNOWN_CATS.includes(t));
              const pBreaking = pTags.includes("breaking");
              const displayTags = pTags.filter(t=>!KNOWN_CATS.includes(t)&&t!=="breaking").slice(0,2);
              return (
                <motion.div key={p.id} {...stagger(i)}>
                  <Link to={`/news/${p.slug}`} className="news-card">
                    <div className="news-img-wrap">
                      {p.cover_image_url
                        ? <img src={p.cover_image_url} alt={p.title} loading="lazy"/>
                        : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:"1.5rem"}}>📰</span></div>
                      }
                    </div>
                    <div className="news-content">
                      <h3 className="news-title">{p.title}</h3>
                      <div className="news-badges">
                        {pBreaking && <span className="news-breaking-badge">🔴 Breaking</span>}
                        {pCat && (
                          <span className="news-cat-badge" style={{background:`${CAT_COLORS[pCat]}18`,color:CAT_COLORS[pCat],border:`1px solid ${CAT_COLORS[pCat]}30`}}>
                            {CAT_LABELS[pCat]||pCat}
                          </span>
                        )}
                        {displayTags.map(t=><span key={t} className="news-tag-pill">#{t}</span>)}
                      </div>
                      <p className="news-excerpt">{p.excerpt||"Click to read this article…"}</p>
                      <div className="news-meta">
                        <span className="news-date-pill">{formatDate(p.published_at)}</span>
                        <div className="news-stats">
                          <span className="news-stat">👁 {(p.view_count||0).toLocaleString()}</span>
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
              {search||activeCat!=="all"||activeTag!=="all" ? (
                <motion.div className="news-no-results" {...fadeUp}>
                  <span style={{fontSize:"2.2rem",display:"block",marginBottom:10}}>🔍</span>
                  <h3>No results found</h3>
                  <p>Try a different search term or clear the filters.</p>
                  <button className="news-clear-btn" onClick={clearFilters}>Clear Filters</button>
                </motion.div>
              ) : !msg && (
                <motion.div style={{textAlign:"center",padding:"40px 20px",background:"var(--card-bg)",borderRadius:20,border:"1px dashed rgba(217,119,6,0.2)"}} {...fadeUp}>
                  <span style={{fontSize:"2.5rem",display:"block",marginBottom:12}}>📰</span>
                  <h3 style={{fontFamily:"'Playfair Display',serif",color:"var(--navy)",fontSize:"1.25rem",margin:"0 0 8px"}}>No News Yet</h3>
                  <p style={{color:"var(--slate)",margin:0,fontSize:"0.85rem"}}>We're preparing the latest news. Check back soon!</p>
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