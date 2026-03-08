import React, { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Footer from "./components/footer";
import "./Faqs.css";

/* ─────────────────────── Constants ─────────────────────── */
const SITE_URL = "https://aidla.online";

const CATEGORIES = [
  { id: "all",             label: "All",              icon: "◎",  desc: "Browse all frequently asked questions" },
  { id: "general",         label: "General",          icon: "🌐", desc: "General questions about AIDLA platform" },
  { id: "coins_rewards",   label: "Coins & Rewards",  icon: "🪙", desc: "How to earn and redeem AIDLA Coins" },
  { id: "tests_quizzes",   label: "Tests & Quizzes",  icon: "📝", desc: "Quizzes, scoring and leaderboards" },
  { id: "lucky_draw",      label: "Lucky Draw",       icon: "🎲", desc: "Lucky Draw and Lucky Wheel prizes" },
  { id: "account_profile", label: "Account",          icon: "👤", desc: "Account settings and profile management" },
  { id: "withdrawals",     label: "Withdrawals",      icon: "💵", desc: "Withdrawing earnings and payments" },
  { id: "education",       label: "Education",        icon: "🎓", desc: "Pakistan education system questions" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

/* ─────────────────────── Fingerprint ───────────────────── */
function getFingerprint() {
  const key = "aidla_fp";
  let fp = localStorage.getItem(key);
  if (!fp) {
    fp = "fp_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9);
    localStorage.setItem(key, fp);
  }
  return fp;
}

/* ─────────────────── Structured Data (JSON-LD) ─────────── */
function buildFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer,
      },
    })),
  };
}

function buildBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "FAQs", "item": SITE_URL + "/faqs" },
    ],
  };
}

/* ─────────────────────── Highlight helper ──────────────── */
function highlight(text, query) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="faq-highlight">{p}</mark>
      : p
  );
}

/* ─────────────────────── FAQ Item ──────────────────────── */
function FAQItem({ faq, isOpen, onToggle, searchQuery, userVotes, onVote }) {
  const bodyRef    = useRef(null);
  const [copied, setCopied] = useState(false);
  const voted      = userVotes[faq.id];
  const totalVotes = faq.helpful_yes + faq.helpful_no;
  const pct = totalVotes > 0 ? Math.round((faq.helpful_yes / totalVotes) * 100) : null;

  const handleShare = () => {
    const url = faq.slug
      ? `${SITE_URL}/faqs/${faq.slug}`
      : `${SITE_URL}/faqs#faq-${faq.id}`;
    if (navigator.share) {
      navigator.share({ title: faq.question, url });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id={`faq-${faq.id}`}
      className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
      itemScope
      itemType="https://schema.org/Question"
    >
      {/* Question row — clicking anywhere opens/closes */}
      <button
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-body-${faq.id}`}
      >
        <span className="faq-q-icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
        <h3 className="faq-q-text" itemProp="name">
          {highlight(faq.question, searchQuery)}
        </h3>
      </button>

      {/* Expanded content */}
      <div
        id={`faq-body-${faq.id}`}
        className="faq-answer-wrap"
        style={{ maxHeight: isOpen ? bodyRef.current?.scrollHeight + "px" : "0" }}
        role="region"
        aria-labelledby={`faq-${faq.id}`}
      >
        <div
          ref={bodyRef}
          className="faq-answer-inner"
          itemScope
          itemType="https://schema.org/Answer"
          itemProp="acceptedAnswer"
        >
          {/* Answer */}
          <div className="faq-answer-text" itemProp="text">
            {highlight(faq.answer, searchQuery)}
          </div>

          {/* Meta row */}
          <div className="faq-meta-row">
            <span className="faq-views">👁 {faq.view_count} views</span>
            {faq.category !== "all" && (
              <span className="faq-cat-tag">
                {CAT_MAP[faq.category]?.icon} {CAT_MAP[faq.category]?.label}
              </span>
            )}
          </div>

          {/* Helpful votes + Share button row */}
          <div className="faq-helpful-row">
            <span className="faq-helpful-label">Was this helpful?</span>
            <button
              className={`faq-helpful-btn faq-helpful-yes ${voted === "yes" ? "faq-helpful-btn--active" : ""}`}
              onClick={() => onVote(faq.id, "yes")}
              aria-pressed={voted === "yes"}
            >
              👍 {faq.helpful_yes}
            </button>
            <button
              className={`faq-helpful-btn faq-helpful-no ${voted === "no" ? "faq-helpful-btn--active faq-helpful-btn--no" : ""}`}
              onClick={() => onVote(faq.id, "no")}
              aria-pressed={voted === "no"}
            >
              👎 {faq.helpful_no}
            </button>
            {pct !== null && (
              <span className="faq-helpful-pct">{pct}% found helpful</span>
            )}
            {/* Share button — inside expanded area, copies /faqs/slug */}
            <button
              className="faq-helpful-btn faq-share-inline"
              onClick={handleShare}
              style={{ marginLeft: "auto" }}
            >
              {copied ? "✅ Copied!" : "🔗 Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Ask Question Form ─────────────── */
function AskForm({ onSubmit }) {
  const [form, setForm]   = useState({ name: "", email: "", question: "" });
  const [state, setState] = useState("idle");
  const [msg, setMsg]     = useState("");
  const charLeft = 500 - form.question.length;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.question.trim()) {
      setState("err"); setMsg("Please fill in all fields."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setState("err"); setMsg("Please enter a valid email address."); return;
    }
    if (form.question.length < 10) {
      setState("err"); setMsg("Question must be at least 10 characters."); return;
    }
    setState("loading");
    const { error } = await supabase.from("user_questions").insert({
      name:     form.name.trim(),
      email:    form.email.trim().toLowerCase(),
      question: form.question.trim(),
    });
    if (error) {
      setState("err"); setMsg("Something went wrong. Please try again.");
    } else {
      setState("ok");
      setMsg("✅ Your question has been submitted! We'll email you when it's answered.");
      setForm({ name: "", email: "", question: "" });
      if (onSubmit) onSubmit();
    }
  };

  return (
    <div className="ask-form-wrap" id="ask-question">
      <div className="ask-form-header">
        <span className="ask-form-icon">💬</span>
        <div>
          <h2 className="ask-form-title">Can't find your answer?</h2>
          <p className="ask-form-sub">Ask us — our team will answer and publish it to help others.</p>
        </div>
      </div>

      {state === "ok"  && <div className="ask-msg ask-msg--ok">{msg}</div>}
      {state === "err" && <div className="ask-msg ask-msg--err">{msg}</div>}

      {state !== "ok" && (
        <div className="ask-form-body">
          <div className="ask-row-2">
            <div>
              <label className="ask-label" htmlFor="ask-name">Your Name *</label>
              <input
                id="ask-name"
                className="ask-input"
                placeholder="Muhammad Ali"
                value={form.name}
                onChange={e => set("name", e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="ask-label" htmlFor="ask-email">Email Address *</label>
              <input
                id="ask-email"
                className="ask-input"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>
          <label className="ask-label" htmlFor="ask-question">Your Question *</label>
          <textarea
            id="ask-question"
            className="ask-textarea"
            placeholder="Type your question clearly... the more detail you give, the better we can answer."
            value={form.question}
            onChange={e => set("question", e.target.value.slice(0, 500))}
            rows={4}
          />
          <div className="ask-char-count" aria-live="polite">{charLeft} characters left</div>
          <button
            className="ask-submit"
            onClick={handleSubmit}
            disabled={state === "loading"}
          >
            {state === "loading" ? <span className="ask-spinner" /> : "🚀 Submit Question"}
          </button>
          <p className="ask-privacy">🔒 Your email is only used to notify you — never shared publicly.</p>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════ */
export default function FAQs() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [faqs,      setFaqs]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [openIds,   setOpenIds]   = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const searchRef = useRef(null);
  const fp        = useRef(getFingerprint());

  /* ── Load FAQs ── */
  useEffect(() => {
    loadFAQs();
    loadVotes();
  }, []);

  const loadFAQs = async () => {
    setLoading(true);
    const { data, count } = await supabase
      .from("faqs")
      .select("*", { count: "exact" })
      .eq("status", "published")
      .eq("is_visible", true)
      .order("sort_order")
      .order("created_at");
    setFaqs(data || []);
    setTotalCount(count || 0);
    setLoading(false);
  };

  const loadVotes = async () => {
    const { data } = await supabase
      .from("faq_helpful_votes")
      .select("faq_id, vote")
      .eq("fingerprint", fp.current);
    if (data) {
      const map = {};
      data.forEach(v => { map[v.faq_id] = v.vote; });
      setUserVotes(map);
    }
  };

  /* ── Handle anchor hash on load ── */
  useEffect(() => {
    if (location.hash) {
      const cat = location.hash.replace("#", "");
      if (CATEGORIES.find(c => c.id === cat)) {
        setActiveCat(cat);
      } else if (cat.startsWith("faq-")) {
        const id = cat.replace("faq-", "");
        setTimeout(() => {
          setOpenIds(prev => ({ ...prev, [id]: true }));
          document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 600);
      }
    }
  }, [location.hash]);

  /* ── Category change → update URL hash ── */
  const handleCatChange = (catId) => {
    setActiveCat(catId);
    setOpenIds({});
    navigate(`/faqs${catId !== "all" ? "#" + catId : ""}`, { replace: true });
  };

  /* ── Toggle FAQ open/close + track view ── */
const handleToggle = useCallback(async (id) => {
  const isCurrentlyOpen = openIds[id];
  if (!isCurrentlyOpen) {
    // Try to update the database first
    const { error } = await supabase.rpc("faq_increment_view", { p_faq_id: id });
    if (error) {
      console.error("Failed to increment view count:", error);
      // Optionally show a user‑friendly message (e.g., toast)
    } else {
      // Only optimistically update if the RPC succeeded
      setFaqs(prev => prev.map(f =>
        f.id === id ? { ...f, view_count: f.view_count + 1 } : f
      ));
    }
  }
  setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
}, [openIds]);

  /* ── Helpful vote ── */
  const handleVote = useCallback(async (faqId, vote) => {
    const prev = userVotes[faqId];
    setUserVotes(p => ({ ...p, [faqId]: prev === vote ? undefined : vote }));
    const { data } = await supabase.rpc("faq_toggle_helpful", {
      p_faq_id:      faqId,
      p_fingerprint: fp.current,
      p_vote:        vote,
    });
    if (data) {
      setFaqs(p => p.map(f =>
        f.id === faqId ? { ...f, helpful_yes: data.helpful_yes, helpful_no: data.helpful_no } : f
      ));
    }
  }, [userVotes]);

  /* ── Search: expand all matches ── */
  useEffect(() => {
    if (search.trim().length >= 2) {
      const matches = {};
      filtered.forEach(f => { matches[f.id] = true; });
      setOpenIds(matches);
    } else if (!search.trim()) {
      setOpenIds({});
    }
  }, [search]);

  /* ── Filter logic ── */
  const filtered = faqs.filter(f => {
    const catMatch = activeCat === "all" || f.category === activeCat;
    if (!catMatch) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
  });

  /* ── Group by category (for "all" view) ── */
  const grouped = {};
  if (activeCat === "all") {
    CATEGORIES.slice(1).forEach(cat => {
      const items = filtered.filter(f => f.category === cat.id);
      if (items.length) grouped[cat.id] = items;
    });
  }

  /* ── SEO meta ── */
  const activeCatObj = CAT_MAP[activeCat];
  const pageTitle = activeCat === "all"
    ? "Frequently Asked Questions — AIDLA Pakistan Education Platform"
    : `${activeCatObj.label} FAQs — AIDLA`;
  const pageDesc = activeCat === "all"
    ? "Find answers to the most common questions about AIDLA — earn coins, tests, lucky draw, withdrawals, and Pakistan education system. Ask your own question!"
    : `${activeCatObj.desc}. Browse all AIDLA FAQs about ${activeCatObj.label.toLowerCase()}.`;

  const publishedFaqs = filtered.filter(f => f.status === "published" || !f.status);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content="AIDLA FAQ, AIDLA questions, Pakistan education FAQ, AIDLA coins help, lucky draw help, AIDLA withdrawals, online learning Pakistan" />
        <link rel="canonical" href={`${SITE_URL}/faqs${activeCat !== "all" ? "#" + activeCat : ""}`} />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={`${SITE_URL}/faqs`} />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image"       content={`${SITE_URL}/og-image.jpg`} />
        <meta property="og:site_name"   content="AIDLA" />
        <meta property="og:locale"      content="en_PK" />

        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}/og-image.jpg`} />

        {/* Indexing */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* JSON-LD structured data */}
        {publishedFaqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(buildFAQSchema(publishedFaqs))}
          </script>
        )}
        <script type="application/ld+json">
          {JSON.stringify(buildBreadcrumbSchema())}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": pageTitle,
            "description": pageDesc,
            "url": `${SITE_URL}/faqs`,
            "publisher": {
              "@type": "Organization",
              "name": "AIDLA",
              "url": SITE_URL,
              "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.png` }
            }
          })}
        </script>
      </Helmet>

      <main className="faq-page" itemScope itemType="https://schema.org/FAQPage">

        {/* ── Hero ── */}
        <section className="faq-hero" aria-label="FAQ page header">
          <div className="faq-hero-bg" aria-hidden="true" />
          <div className="faq-hero-inner">
            {/* Breadcrumb */}
            <nav className="faq-breadcrumb" aria-label="Breadcrumb">
              <ol itemScope itemType="https://schema.org/BreadcrumbList">
                <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                  <a href="/" itemProp="item"><span itemProp="name">Home</span></a>
                  <meta itemProp="position" content="1" />
                </li>
                <span aria-hidden="true">›</span>
                <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                  <span itemProp="name">FAQs</span>
                  <meta itemProp="position" content="2" />
                </li>
              </ol>
            </nav>

            <h1 className="faq-hero-title">
              Frequently Asked<br />
              <span className="faq-hero-accent">Questions</span>
            </h1>
            <p className="faq-hero-sub">
              {totalCount} answers — find yours instantly or ask a new question below.
            </p>

            {/* Search */}
            <div className="faq-search-wrap" role="search">
              <span className="faq-search-icon" aria-hidden="true">🔍</span>
              <input
                ref={searchRef}
                className="faq-search-input"
                type="search"
                placeholder="Search questions and answers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search FAQs"
              />
              {search && (
                <button
                  className="faq-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >✕</button>
              )}
            </div>

            {search && (
              <div className="faq-search-result-count" aria-live="polite">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "<strong>{search}</strong>"
              </div>
            )}
          </div>
        </section>

        {/* ── Category tabs ── */}
        <nav className="faq-cats-wrap" aria-label="FAQ Categories">
          <div className="faq-cats-inner">
            {CATEGORIES.map(cat => (
              <a
                key={cat.id}
                href={cat.id === "all" ? "/faqs" : `/faqs#${cat.id}`}
                className={`faq-cat-btn ${activeCat === cat.id ? "faq-cat-btn--active" : ""}`}
                onClick={e => { e.preventDefault(); handleCatChange(cat.id); }}
                aria-current={activeCat === cat.id ? "true" : undefined}
              >
                <span className="faq-cat-icon" aria-hidden="true">{cat.icon}</span>
                <span className="faq-cat-label">{cat.label}</span>
                <span className="faq-cat-count">
                  {cat.id === "all" ? faqs.length : faqs.filter(f => f.category === cat.id).length}
                </span>
              </a>
            ))}
          </div>
        </nav>

        {/* ── Main content ── */}
        <div className="faq-content-wrap">

          {loading && (
            <div className="faq-loading" aria-live="polite">
              {[1,2,3,4].map(i => (
                <div key={i} className="faq-skeleton">
                  <div className="faq-skeleton-line faq-skeleton-line--wide" />
                  <div className="faq-skeleton-line" />
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="faq-empty" role="status">
              <span className="faq-empty-icon">🤔</span>
              <h2 className="faq-empty-title">No results found</h2>
              <p className="faq-empty-sub">
                {search
                  ? `Nothing matched "${search}". Try different words or browse categories.`
                  : "No FAQs in this category yet. Check back soon!"}
              </p>
              {search && (
                <button
                  className="faq-empty-btn"
                  onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* All categories grouped */}
          {!loading && activeCat === "all" && !search && filtered.length > 0 && (
            Object.entries(grouped).map(([catId, items]) => (
              <section key={catId} id={catId} className="faq-group" aria-labelledby={`cat-heading-${catId}`}>
                <div className="faq-group-header">
                  <span className="faq-group-icon" aria-hidden="true">{CAT_MAP[catId]?.icon}</span>
                  <h2 className="faq-group-title" id={`cat-heading-${catId}`}>{CAT_MAP[catId]?.label}</h2>
                  <span className="faq-group-count">{items.length} question{items.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="faq-list">
                  {items.map(faq => (
                    <FAQItem
                      key={faq.id}
                      faq={faq}
                      isOpen={!!openIds[faq.id]}
                      onToggle={() => handleToggle(faq.id)}
                      searchQuery={search}
                      userVotes={userVotes}
                      onVote={handleVote}
                    />
                  ))}
                </div>
              </section>
            ))
          )}

          {/* Single category or search results */}
          {!loading && (activeCat !== "all" || search) && filtered.length > 0 && (
            <div className="faq-list faq-list--flat">
              {filtered.map(faq => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={!!openIds[faq.id]}
                  onToggle={() => handleToggle(faq.id)}
                  searchQuery={search}
                  userVotes={userVotes}
                  onVote={handleVote}
                />
              ))}
            </div>
          )}

          {/* Ask question form */}
          {!loading && <AskForm />}
        </div>
      </main>

      <Footer />
    </>
  );
}