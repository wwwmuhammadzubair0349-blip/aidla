import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Footer from "../pages/components/footer"; // adjust path if needed
import "./Home.css";

/* ─────────────────────────────── Quotes ─────────────────────────────── */
const QUOTES = [
  {
    text: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    translation: "Seeking knowledge is an obligation upon every Muslim.",
    source: "Prophet Muhammad ﷺ (Ibn Majah)",
    lang: "ar",
    bg: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=900&q=80&auto=format&fit=crop",
  },
  {
    text: "خِيرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    translation: "The best of people are those most beneficial to others.",
    source: "Prophet Muhammad ﷺ",
    lang: "ar",
    bg: "https://images.unsplash.com/photo-1579547621309-5e57ab324182?w=900&q=80&auto=format&fit=crop",
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    source: "Nelson Mandela",
    lang: "en",
    bg: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&q=80&auto=format&fit=crop",
  },
  {
    text: "علم کی شمع جلاؤ، جہالت کا اندھیرا مٹاؤ",
    translation: "Light the candle of knowledge, erase the darkness of ignorance.",
    source: "Allama Iqbal",
    lang: "ur",
    bg: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&q=80&auto=format&fit=crop",
  },
  {
    text: "خود کو کر بلند اتنا کہ ہر تقدیر سے پہلے خدا بندے سے خود پوچھے — بتا تیری رضا کیا ہے",
    translation: "Raise yourself so high that before every decree, God Himself asks: what is your desire?",
    source: "Allama Iqbal",
    lang: "ur",
    bg: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=900&q=80&auto=format&fit=crop",
  },
  {
    text: "The ink of the scholar is more sacred than the blood of the martyr.",
    source: "Prophet Muhammad ﷺ",
    lang: "en",
    bg: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=900&q=80&auto=format&fit=crop",
  },
  {
    text: "وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا",
    translation: "Whoever is given wisdom has been given much good.",
    source: "Quran 2:269",
    lang: "ar",
    bg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&auto=format&fit=crop",
  },
];


/* ─────────────────────────── Helpers ──────────────────────────── */
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
}

function WheelBadge({ type, coins }) {
  if (type === "coins") return <span className="wheel-badge wb-coins">💰 {coins} Coins</span>;
  if (type === "gift") return <span className="wheel-badge wb-gift">🎁 Gift Won!</span>;
  return null;
}

function RankBadge({ rank }) {
  const cls = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "rank-other";
  return <span className={`rank-badge ${cls}`}>#{rank}</span>;
}

/* ─────────────────────────── Quote Slider ──────────────────────── */
function QuoteSlider() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setIdx(i);
    timerRef.current = setInterval(() => setIdx(p => (p + 1) % QUOTES.length), 6000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setIdx(p => (p + 1) % QUOTES.length), 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const q = QUOTES[idx];

  return (
    <div className="quote-slider-outer" role="region" aria-label="Inspirational quotes">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="quote-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="quote-slide-bg"
            style={{ backgroundImage: `url(${q.bg})` }}
            role="img"
            aria-label="Quote background"
          />
          <div className="quote-slide-content">
            <div className={`quote-text-${q.lang}`}>"{q.text}"</div>
            {q.translation && <div className="quote-translation">{q.translation}</div>}
            <span className="quote-source">{q.source}</span>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="quote-dots" role="tablist" aria-label="Quote navigation">
        {QUOTES.map((_, i) => (
          <button
            key={i}
            className={`quote-dot ${i === idx ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Quote ${i + 1}`}
            aria-selected={i === idx}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── Mask email helper ──────────────────── */
function maskEmail(email) {
  if (!email || !email.includes("@")) return "";
  const [local, domain] = email.split("@");
  return local.slice(0, 2) + "***@" + domain;
}

/* ─────────────────────────── Review Slider ─────────────────── */
function ReviewSlider({ reviews }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const startX = useRef(null);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setIdx(i);
    timerRef.current = setInterval(() => setIdx(p => (p + 1) % reviews.length), 5000);
  };
  const prev = () => goTo((idx - 1 + reviews.length) % reviews.length);
  const next = () => goTo((idx + 1) % reviews.length);

  useEffect(() => {
    if (reviews.length < 2) return;
    timerRef.current = setInterval(() => setIdx(p => (p + 1) % reviews.length), 5000);
    return () => clearInterval(timerRef.current);
  }, [reviews.length]);

  if (!reviews.length) return null;
  const r = reviews[idx];

  return (
    <div
      className="review-slider"
      onTouchStart={e => { startX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (startX.current === null) return;
        const diff = startX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
        startX.current = null;
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="review-slide-card"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
        >
          <div className="review-stars" aria-label={`${r.rating} out of 5 stars`}>
            {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
          </div>
          <p className="review-text">"{r.review_text}"</p>
          <div className="review-author-row">
            <div className="review-avatar" aria-hidden="true">{r.full_name?.[0]?.toUpperCase() || "A"}</div>
            <div>
              <div className="review-name">{r.full_name}</div>
              <div className="review-date">{maskEmail(r.email)} · {formatDate(r.created_at)}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {reviews.length > 1 && (
        <div className="review-nav">
          <button className="review-nav-btn" onClick={prev} aria-label="Previous review">‹</button>
          <div className="review-dots">
            {reviews.map((_, i) => (
              <button
                key={i}
                className={`review-dot${i === idx ? " active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Review ${i + 1}`}
              />
            ))}
          </div>
          <button className="review-nav-btn" onClick={next} aria-label="Next review">›</button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Review Form ──────────────────────── */
function ReviewForm({ onSubmitted }) {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [text, setText]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus]   = useState(null);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !email.includes("@") || rating === 0 || text.trim().length < 20) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("user_reviews").insert({
        full_name:   name.trim(),
        email:       email.trim().toLowerCase(),
        rating,
        review_text: text.trim(),
        is_approved: true,
      });
      if (error?.code === "23505") setStatus("duplicate");
      else if (error) setStatus("error");
      else {
        setStatus("success");
        setName(""); setEmail(""); setText(""); setRating(0);
        if (onSubmitted) onSubmitted(); // triggers parent to re-fetch reviews
      }
    } catch { setStatus("error"); }
    finally { setSubmitting(false); }
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="review-form-box">
      <h3>✍️ Share Your Experience</h3>
      <p>No login needed. Your review will appear after admin approval.</p>

      {status === "success"   && <div className="rv-msg rv-ok">✅ Your review is live! Thank you.</div>}
      {status === "duplicate" && <div className="rv-msg rv-warn">ℹ️ This email already has a review. Thank you!</div>}
      {status === "error"     && <div className="rv-msg rv-err">❌ Something went wrong. Please try again.</div>}

      <div className="rv-row">
        <input className="rv-input" placeholder="Your name *" value={name}  onChange={e => setName(e.target.value)}  aria-label="Name" />
        <input className="rv-input" placeholder="Your email *" type="email" value={email} onChange={e => setEmail(e.target.value)} aria-label="Email" />
      </div>

      <div className="star-picker" role="group" aria-label="Rating">
        {[1,2,3,4,5].map(s => (
          <button key={s} className="star-btn"
            onClick={() => setRating(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${s} star${s > 1 ? "s" : ""}`}
          >
            {s <= (hover || rating) ? "⭐" : "☆"}
          </button>
        ))}
        {rating > 0 && <span className="rv-rating-label">{ratingLabels[rating]}</span>}
      </div>

      <textarea
        className="review-textarea"
        placeholder="Share your experience with AIDLA (min. 20 characters)..."
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={500}
        aria-label="Review text"
      />
      <div className="rv-char">{text.length}/500</div>

      <button
        className="review-submit-btn"
        onClick={handleSubmit}
        disabled={submitting || !name.trim() || !email.includes("@") || rating === 0 || text.trim().length < 20}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}

/* ─────────────────────────── Fingerprint helper ──────────────── */
function getFingerprint() {
  // Stable device fingerprint stored in localStorage — no email needed
  const KEY = "aidla_fp";
  let fp = localStorage.getItem(KEY);
  if (!fp) {
    fp = "fp_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9);
    localStorage.setItem(KEY, fp);
  }
  return fp;
}

/* ─────────────────────────── Upcoming Features (Supabase) ──── */
const STATUS_META = {
  voting:   { cls: "sb-voting",   label: "🗳️ Voting" },
  selected: { cls: "sb-selected", label: "⭐ Shortlisted" },
  soon:     { cls: "sb-soon",     label: "📅 Soon" },
  live:     { cls: "sb-live",     label: "🚀 Live" },
};

function UpcomingFeatures() {
  const [items, setItems]         = useState([]);
  const [userVoted, setUserVoted] = useState({});
  const [voting, setVoting]       = useState({});   // per-item loading state
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    // Load which items this device has already voted for
    const saved = localStorage.getItem("aidla_voted_fp");
    if (saved) { try { setUserVoted(JSON.parse(saved)); } catch {} }

    supabase.from("announcements")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  const handleVote = async (item) => {
    if (userVoted[item.id] || item.status !== "voting" || voting[item.id]) return;

    const fp = getFingerprint();

    // Optimistic update — show voted immediately
    setVoting(v => ({ ...v, [item.id]: true }));
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, vote_count: (i.vote_count || 0) + 1 } : i));
    const newVoted = { ...userVoted, [item.id]: true };
    setUserVoted(newVoted);
    localStorage.setItem("aidla_voted_fp", JSON.stringify(newVoted));

    const { error } = await supabase.from("announcement_votes").insert({
      announcement_id: item.id,
      voter_email: fp,   // store fingerprint in the voter_email column
    });

    if (error?.code === "23505") {
      // Already voted from another path — that's fine, keep it voted
    } else if (error) {
      // Rollback on real error
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, vote_count: Math.max(0, (i.vote_count || 1) - 1) } : i));
      const rolled = { ...newVoted };
      delete rolled[item.id];
      setUserVoted(rolled);
      localStorage.setItem("aidla_voted_fp", JSON.stringify(rolled));
    } else {
      // Sync real count from DB
      await supabase.from("announcements")
        .update({ vote_count: item.vote_count + 1 })
        .eq("id", item.id);
    }
    setVoting(v => ({ ...v, [item.id]: false }));
  };

  const maxVotes = Math.max(...items.map(i => i.vote_count || 0), 1);

  if (loading) return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div className="spinner" style={{ width: 28, height: 28, margin: "0 auto" }} />
    </div>
  );
  if (!items.length) return null;

  return (
    <div className="upcoming-section">
      <h2 className="section-heading" style={{ textAlign: "left", marginBottom: 4 }}>🗳️ You Decide What We Build</h2>
      <p style={{ color: "var(--slate)", fontSize: "0.85rem", marginBottom: 18 }}>
        Tap to vote instantly — no sign-up needed.
      </p>
      {items.map(f => {
        const pct    = Math.round(((f.vote_count || 0) / maxVotes) * 100);
        const voted  = userVoted[f.id];
        const busy   = voting[f.id];
        const s      = STATUS_META[f.status] || STATUS_META.voting;
        return (
          <div key={f.id} className="feature-vote-card">
            <div className="feature-vote-top">
              <div className="feature-vote-name">
                <span className="fv-icon">{f.icon}</span>
                <div className="fv-text">
                  <span className="fv-title">{f.title}</span>
                  <div className="fv-badges">
                    <span className={`status-badge ${s.cls}`}>{s.label}</span>
                    {f.launch_date && <span className="fv-date">📅 {f.launch_date}</span>}
                  </div>
                </div>
              </div>
              {f.status === "voting" && (
                <button
                  className={`vote-btn ${voted ? "voted" : ""} ${busy ? "voting" : ""}`}
                  onClick={() => handleVote(f)}
                  disabled={voted || busy}
                  aria-label={`Vote for ${f.title}`}
                  aria-pressed={voted}
                >
                  {busy ? (
                    <span className="vote-spinner" />
                  ) : voted ? (
                    <><span>✅</span><span>Voted</span></>
                  ) : (
                    <><span>👍</span><span>Vote</span></>
                  )}
                </button>
              )}
            </div>
            {f.description && (
              <p className="fv-desc">{f.description}</p>
            )}
            <div className="vote-bar-wrap">
              <div className="vote-progress-bar">
                <div
                  className={`vote-progress-fill ${voted ? "voted-fill" : ""}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="vote-count-label">
                <strong>{(f.vote_count || 0).toLocaleString()}</strong> votes
              </span>
            </div>
          </div>
        );
      })}
      <div className="fv-how-it-works">
        💡 <strong>Vote → Shortlist → Launch →</strong> We build most-voted first
      </div>
    </div>
  );
}

/* ─────────────────── Content Slider (Blogs & News) ────────────── */
function ContentSlider({ items, type, viewAllTo, viewAllLabel, emptyMsg }) {
  const [idx, setIdx]     = useState(0);
  const timerRef          = useRef(null);
  const startX            = useRef(null);
  const total             = items.length;

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setIdx(i);
    if (total > 1) timerRef.current = setInterval(() => setIdx(p => (p + 1) % total), 4500);
  };

  useEffect(() => {
    setIdx(0); // reset when items load
    if (total > 1) {
      timerRef.current = setInterval(() => setIdx(p => (p + 1) % total), 4500);
    }
    return () => clearInterval(timerRef.current);
  }, [total]);

  if (total === 0) {
    return (
      <div className="cs-empty">
        <span>{type === "news" ? "📰" : "📚"}</span>
        <p>{emptyMsg}</p>
      </div>
    );
  }

  const item    = items[idx];
  const isNews  = type === "news";
  const linkBase = isNews ? "/news" : "/blogs";

  const dateStr = item.published_at
    ? new Date(item.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "New";

  return (
    <div
      className="cs-wrap"
      onTouchStart={e => { startX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (startX.current === null) return;
        const diff = startX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? (idx + 1) % total : (idx - 1 + total) % total);
        startX.current = null;
      }}
    >
      {/* ── Card — matches Blogs page blog-card style ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <Link to={`${linkBase}/${item.slug}`} className="cs-card">
            {/* Image — square thumbnail left */}
            <div className="cs-img-wrap">
              {item.cover_image_url
                ? <img src={item.cover_image_url} alt={item.title} className="cs-img" loading="lazy" />
                : <div className="cs-img-ph">{isNews ? "📰" : "📝"}</div>
              }
            </div>

            {/* Body */}
            <div className="cs-body">
              {/* Tags row */}
              {item.tags?.length > 0 && (
                <div className="cs-tags-row">
                  {item.tags.slice(0, 3).map(t => (
                    <span key={t} className="cs-tag-pill">#{t}</span>
                  ))}
                </div>
              )}

              <div className="cs-title">{item.title}</div>

              {item.excerpt && (
                <div className="cs-excerpt">{item.excerpt}</div>
              )}

              {/* Meta row */}
              <div className="cs-meta">
                <span className="cs-date-pill">{dateStr}</span>
                <div className="cs-stats">
                  <span className="cs-stat">👁 {(item.view_count || 0).toLocaleString()}</span>
                  <span className="cs-read-more" style={{ color: isNews ? "#059669" : "var(--sky)" }}>
                    Read ›
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation ── */}
      {total > 1 && (
        <div className="cs-nav">
          <button className="cs-nav-btn" onClick={() => goTo((idx - 1 + total) % total)} aria-label="Previous">‹</button>
          <div className="cs-dots">
            {items.map((_, i) => (
              <button
                key={i}
                className={`cs-dot${i === idx ? " active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Item ${i + 1}`}
              />
            ))}
          </div>
          <button className="cs-nav-btn" onClick={() => goTo((idx + 1) % total)} aria-label="Next">›</button>
          <span className="cs-counter">{idx + 1} / {total}</span>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Link to={viewAllTo} className="view-all-btn">{viewAllLabel} →</Link>
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Component ─────────────────────── */
export default function Home() {
  const [drawResults, setDrawResults]   = useState([]);
  const [wheelHistory, setWheelHistory] = useState([]);
  const [testWinners, setTestWinners]   = useState([]);
  const [blogs, setBlogs]               = useState([]);
  const [news, setNews]                 = useState([]);
  const [reviews, setReviews]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [nlEmail, setNlEmail]           = useState("");
  const [nlStatus, setNlStatus]         = useState(null);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("user_reviews")
      .select("id,full_name,email,rating,review_text,created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setReviews(data);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [
          { data: draws },
          { data: wheel },
          { data: winners },
          { data: blogsData },
          { data: newsData },
          { data: reviewsData },
        ] = await Promise.all([
          supabase.from("luckydraw_results")
            .select("id,winner_name,draw_title,prize_text,announced_at")
            .order("announced_at", { ascending: false }).limit(5),
          supabase.from("luckywheel_history")
            .select("id,user_id,result_type,coins_won,created_at")
            .in("result_type", ["coins", "gift"])
            .order("created_at", { ascending: false }).limit(5),
          supabase.from("test_winners")
            .select("id,user_name,rank_no,approved_at,test_id,test_tests(title)")
            .order("approved_at", { ascending: false }).limit(5),
          // Adjust table/column names to match your actual blogs table
          supabase.from("blogs_posts")
            .select("id,title,excerpt,cover_image_url,tags,published_at,slug,view_count")
            .is("deleted_at", null)
            .eq("status", "published")
            .order("published_at", { ascending: false }).limit(5),
          supabase.from("news_posts")
            .select("id,title,excerpt,cover_image_url,tags,published_at,slug,view_count")
            .is("deleted_at", null)
            .eq("status", "published")
            .order("published_at", { ascending: false }).limit(5),
          supabase.from("user_reviews")
            .select("id,full_name,email,rating,review_text,created_at")
            .eq("is_approved", true)
            .order("created_at", { ascending: false }).limit(20),
        ]);

        setDrawResults(draws || []);
        setBlogs(blogsData || []);
        setNews(newsData || []);
        setReviews(reviewsData || []);

        // Resolve wheel user names
        const userIds = wheel?.map(w => w.user_id) || [];
        let userMap = {};
        if (userIds.length) {
          const { data: profiles } = await supabase
            .from("users_profiles").select("id,full_name").in("id", userIds);
          if (profiles) userMap = Object.fromEntries(profiles.map(p => [p.id, p.full_name || "Anonymous"]));
        }
        setWheelHistory(wheel?.map(w => ({ ...w, user_name: userMap[w.user_id] || "Anonymous" })) || []);
        setTestWinners(winners || []);
      } catch (err) {
        console.error("Home fetch error:", err);
        setError("Could not load data. Please refresh.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    const val = nlEmail.trim().toLowerCase();
    if (!val || !val.includes("@")) return;
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: val });
      if (error?.code === "23505") { setNlStatus("exists"); }
      else if (error) { setNlStatus("error"); }
      else { setNlStatus("success"); setNlEmail(""); }
    } catch { setNlStatus("error"); }
    setTimeout(() => setNlStatus(null), 5000);
  };

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://aidla.com/#website",
        "url": "https://aidla.com",
        "name": "AIDLA — Learn, Earn & Grow",
        "description": "Pakistan's #1 education platform. Complete quizzes, earn coins, win prizes and access free learning resources.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": "https://aidla.com/search?q={search_term_string}" },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://aidla.com/#organization",
        "name": "AIDLA",
        "url": "https://aidla.com",
        "logo": { "@type": "ImageObject", "url": "https://aidla.com/logo.png" },
        "sameAs": [
          "https://facebook.com/aidla",
          "https://instagram.com/aidla",
          "https://youtube.com/aidla"
        ]
      }
    ]
  };

  return (
    <div className="page-root">
      {/* ── SEO Meta Tags ── */}
      <Helmet>
        <html lang="en" />
        <title>AIDLA — Learn, Earn Coins & Win Prizes | Pakistan's #1 Education Platform</title>
        <meta name="description" content="Join AIDLA — Pakistan's top education platform. Take quizzes, earn AIDLA Coins, spin the lucky wheel, win real prizes and access free blogs, news and education resources." />
        <meta name="keywords" content="education Pakistan, learn and earn, AIDLA coins, quizzes Pakistan, scholarships Pakistan, education news, free learning, online education" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="AIDLA" />
        <link rel="canonical" href="https://aidla.com/" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidla.com/" />
        <meta property="og:title" content="AIDLA — Learn, Earn Coins & Win Prizes" />
        <meta property="og:description" content="Pakistan's #1 education platform. Take quizzes, earn coins, win real prizes. Free education resources, blogs, news and tools." />
        <meta property="og:image" content="https://aidla.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="AIDLA" />
        <meta property="og:locale" content="en_PK" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@aidla" />
        <meta name="twitter:title" content="AIDLA — Learn, Earn Coins & Win Prizes" />
        <meta name="twitter:description" content="Pakistan's #1 education platform. Take quizzes, earn coins, win real prizes." />
        <meta name="twitter:image" content="https://aidla.com/og-image.jpg" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      {/* ── Background orbs ── */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", background: "rgba(59,130,246,0.05)", filter: "blur(80px)", top: -200, left: -200 }} />
        <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "rgba(245,158,11,0.06)", filter: "blur(80px)", bottom: -150, right: -100 }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1140, margin: "0 auto", padding: "24px 14px" }}>

        {/* ══════════════ HERO ══════════════ */}
        <motion.section
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          aria-label="Hero section"
        >
          <div className="hero-text-col">
            <span className="coin-badge" aria-label="AIDLA Coins feature">🪙 AIDLA Coins — Learn & Earn</span>
            <h1 className="hero-h1">
              Learn.<br />
              <span style={{ background: "linear-gradient(135deg, var(--royal), var(--sky))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Earn Coins.</span>
              <br />Redeem Rewards.
            </h1>
            <p className="hero-para">
              Pakistan's #1 education platform. Complete quizzes, spin the lucky wheel, and win real prizes. Convert your <strong style={{ color: "var(--navy)" }}>AIDLA Coins</strong> to products or cash.
            </p>
            <div className="hero-btn-row">
              <Link to="/signup" className="hero-btn-primary">🚀 Start Free</Link>
              <Link to="/about" className="hero-btn-secondary">Learn More</Link>
            </div>
            <div className="trust-strip" aria-label="Trust indicators">
              {["✅ Free to Join", "🏆 Daily Prizes", "🇵🇰 Made in Pakistan"].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          <motion.div
            className="hero-img-wrap"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.55 }}
          >
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80&auto=format&fit=crop"
              alt="Students learning and earning coins on AIDLA education platform"
              loading="eager"
              width="600"
              height="400"
            />
            <div className="hero-img-overlay" aria-hidden="true" />
            <div className="hero-floating-badge" aria-label="Winners badge">
              <span className="badge-icon" aria-hidden="true">🏅</span>
              <div>
                <div className="badge-title">Active Winners</div>
                <div className="badge-sub">Prizes claimed every day</div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ══════════════ QUOTE SLIDER ══════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "clamp(28px, 4vw, 52px)" }}
          aria-label="Inspirational quotes"
        >
          <h2 className="section-heading">Words of Wisdom</h2>
          <p className="section-sub">Inspired by the Quran, Hadith, great thinkers & poets across languages</p>
          <QuoteSlider />
        </motion.section>

        {/* ══════════════ HOW IT WORKS ══════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "clamp(28px, 4vw, 52px)" }}
          aria-label="How AIDLA works"
        >
          <h2 className="section-heading">How It Works</h2>
          <p className="section-sub">Four simple steps from sign-up to cash in hand</p>
          <div className="steps-row">
            {[
              { icon: "📝", title: "Sign Up Free", desc: "Create your account in under 30 seconds." },
              { icon: "📚", title: "Learn & Play", desc: "Take quizzes, enter draws, spin the wheel." },
              { icon: "🪙", title: "Earn Coins", desc: "Collect AIDLA Coins for every achievement." },
              { icon: "💵", title: "Cash Out", desc: "Redeem rewards or withdraw to your bank." },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="step-item"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="step-circle" aria-hidden="true">{step.icon}</div>
                <h3 style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.87rem", marginBottom: 4 }}>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ══════════════ FEATURES ══════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "clamp(28px, 4vw, 52px)" }}
          aria-label="AIDLA features"
        >
          <h2 className="section-heading">The AIDLA Ecosystem</h2>
          <p className="section-sub">Everything you need to learn, play and earn in one place</p>
          <div className="features-grid">
            {[
              { icon: "📚", color: "#dbeafe", label: "Smart Quizzes", desc: "Curriculum-aligned tests designed to maximise learning outcomes." },
              { icon: "🎲", color: "#fef3c7", label: "Lucky Draws", desc: "Enter exclusive prize draws with your coins and win weekly." },
              { icon: "🎡", color: "#d1fae5", label: "Lucky Wheel", desc: "Spin daily for bonus coins, gifts, and extra draw chances." },
              { icon: "🛍️", color: "#ede9fe", label: "Rewards Shop", desc: "Redeem coins for gadgets, gift cards and vouchers." },
              { icon: "💵", color: "#fee2e2", label: "Cash Withdrawals", desc: "Transfer your coin balance directly to your bank account." },
              { icon: "📊", color: "#e0f2fe", label: "Leaderboards", desc: "Compete with thousands and climb the global rankings." },
              { icon: "📰", color: "#fce7f3", label: "Education News", desc: "Stay updated with latest Pakistan education news daily." },
            ].map((f, i) => (
              <motion.article
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="feature-icon" style={{ background: f.color }} aria-hidden="true">{f.icon}</div>
                <h3>{f.label}</h3>
                <p>{f.desc}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* ══════════════ LATEST BLOGS ══════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "clamp(28px, 4vw, 52px)" }}
          aria-label="Latest blog posts"
        >
          <h2 className="section-heading">📝 Latest Blogs</h2>
          <p className="section-sub">Expert education insights, tips and guides</p>
          <ContentSlider items={blogs} type="blog" viewAllTo="/blogs" viewAllLabel="View All Blogs" emptyMsg="Blogs coming soon — check back daily!" />
        </motion.section>

        {/* ══════════════ LATEST NEWS ══════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "clamp(28px, 4vw, 52px)" }}
          aria-label="Latest education news"
        >
          <h2 className="section-heading">📰 Latest Education News</h2>
          <p className="section-sub">Stay updated with Pakistan's education sector</p>
          <ContentSlider items={news} type="news" viewAllTo="/news" viewAllLabel="View All News" emptyMsg="News coming soon — check back daily!" />
        </motion.section>

        {/* ══════════════ UPCOMING FEATURES ══════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "clamp(28px, 4vw, 52px)" }}
          aria-label="Upcoming features voting"
        >
          <UpcomingFeatures />
        </motion.section>

        {/* ══════════════ NEWSLETTER ══════════════ */}
        <motion.section
          className="newsletter-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          aria-label="Newsletter signup"
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "clamp(1.3rem, 3.5vw, 2rem)", fontWeight: 900, marginBottom: 8 }}>
              📬 Never Miss an Update
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(0.82rem, 2vw, 0.95rem)" }}>
              Get daily education news, prize alerts, and new feature announcements.
            </p>
            {nlStatus === "success" ? (
              <div style={{ marginTop: 20, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", color: "#6ee7b7", padding: "12px 24px", borderRadius: 50, display: "inline-block", fontWeight: 700 }}>
                ✅ Subscribed! Welcome to the AIDLA family.
              </div>
            ) : nlStatus === "exists" ? (
              <div style={{ marginTop: 20, color: "#fcd34d", fontWeight: 700, fontSize: "0.9rem" }}>
                ℹ️ Already subscribed — you're good!
              </div>
            ) : (
              <div className="newsletter-input-row">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={nlEmail}
                  onChange={e => setNlEmail(e.target.value)}
                  aria-label="Email for newsletter"
                  onKeyDown={e => e.key === "Enter" && handleNewsletter(e)}
                />
                <button onClick={handleNewsletter}>Subscribe 🚀</button>
              </div>
            )}
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", marginTop: 12 }}>
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </motion.section>

        {/* ══════════════ RECENT WINNERS ══════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "clamp(28px, 4vw, 52px)" }}
          aria-label="Recent winners"
        >
          <h2 className="section-heading">🏆 Recent Winners</h2>
          <p className="section-sub">Real people. Real rewards. Updated live.</p>

          {loading && <div className="spinner" role="status" aria-label="Loading winners" />}
          {error && (
            <div role="alert" style={{ background: "#fee2e2", color: "#b91c1c", padding: 14, borderRadius: 12, textAlign: "center", marginBottom: 16 }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="winners-grid">
              <motion.div className="winner-card" whileHover={{ y: -3 }}>
                <div className="winner-card-header">
                  <span aria-hidden="true" style={{ fontSize: "1.4rem" }}>🎲</span>
                  <h3>Lucky Draw Winners</h3>
                </div>
                {drawResults.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center", padding: 20, fontSize: "0.85rem" }}>No draws yet — check back soon!</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="winner-table">
                      <thead><tr><th>Winner</th><th>Prize</th><th>When</th></tr></thead>
                      <tbody>
                        {drawResults.map((row, i) => (
                          <tr key={row.id}>
                            <td>
                              <div style={{ fontWeight: 700, color: "var(--navy)" }}>{row.winner_name}</div>
                              <div style={{ fontSize: "0.72rem", color: "var(--slate)" }}>{row.draw_title}</div>
                            </td>
                            <td style={{ fontWeight: 700, color: "#059669" }}>{row.prize_text}</td>
                            <td style={{ color: "var(--slate)", fontSize: "0.77rem" }}>{formatDate(row.announced_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              <motion.div className="winner-card" whileHover={{ y: -3 }}>
                <div className="winner-card-header">
                  <span aria-hidden="true" style={{ fontSize: "1.4rem" }}>🎡</span>
                  <h3>Wheel Winners</h3>
                </div>
                {wheelHistory.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center", padding: 20, fontSize: "0.85rem" }}>No wheel wins yet</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="winner-table">
                      <thead><tr><th>User</th><th>Reward</th><th>When</th></tr></thead>
                      <tbody>
                        {wheelHistory.map(row => (
                          <tr key={row.id}>
                            <td style={{ fontWeight: 700, color: "var(--navy)" }}>{row.user_name}</td>
                            <td><WheelBadge type={row.result_type} coins={row.coins_won} /></td>
                            <td style={{ color: "var(--slate)", fontSize: "0.77rem" }}>{formatDate(row.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              <motion.div className="winner-card" whileHover={{ y: -3 }}>
                <div className="winner-card-header">
                  <span aria-hidden="true" style={{ fontSize: "1.4rem" }}>📝</span>
                  <h3>Test Toppers</h3>
                </div>
                {testWinners.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center", padding: 20, fontSize: "0.85rem" }}>No test winners yet</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="winner-table">
                      <thead><tr><th>Rank</th><th>Student</th><th>Test</th><th>When</th></tr></thead>
                      <tbody>
                        {testWinners.map(row => (
                          <tr key={row.id}>
                            <td><RankBadge rank={row.rank_no} /></td>
                            <td style={{ fontWeight: 700, color: "var(--navy)" }}>{row.user_name}</td>
                            <td style={{ color: "var(--slate)" }}>{row.test_tests?.title || "Untitled"}</td>
                            <td style={{ color: "var(--slate)", fontSize: "0.77rem" }}>{formatDate(row.approved_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.section>

        {/* ══════════════ USER REVIEWS ══════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: "clamp(28px, 4vw, 52px)" }}
          aria-label="User reviews"
        >
          <h2 className="section-heading">⭐ What Our Learners Say</h2>
          <p className="section-sub">Real reviews from real students — verified and approved</p>
          <ReviewSlider reviews={reviews} />
          <ReviewForm onSubmitted={fetchReviews} />
        </motion.section>

        {/* ══════════════ CTA ══════════════ */}
        <motion.div
          className="cta-section"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          aria-label="Call to action"
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <span style={{ display: "inline-block", background: "rgba(245,158,11,0.18)", color: "#fcd34d", padding: "5px 16px", borderRadius: 30, fontSize: "0.82rem", fontWeight: 700, marginBottom: 18, border: "1px solid rgba(245,158,11,0.28)" }}>
              🌟 Join Thousands of Learners Today
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 4vw, 2.8rem)", color: "#fff", fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
              Your Knowledge is<br />Your Greatest Asset
            </h2>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(0.82rem, 2.2vw, 1rem)", maxWidth: 460, margin: "0 auto 24px" }}>
              Every quiz you complete earns real, redeemable AIDLA Coins. Start your journey today — it's completely free.
            </p>
            <Link
              to="/signup"
              style={{ display: "inline-block", padding: "13px 36px", borderRadius: 50, background: "linear-gradient(135deg, #f59e0b, #fcd34d)", color: "#0b1437", fontWeight: 800, fontSize: "clamp(0.88rem, 2.2vw, 1.1rem)", textDecoration: "none", boxShadow: "0 12px 28px rgba(245,158,11,0.38)", transition: "transform 0.2s", whiteSpace: "nowrap" }}
            >
              ✨ Get Started — It's Free
            </Link>
          </div>
        </motion.div>

      </div>

      <Footer />
    </div>
  );
}