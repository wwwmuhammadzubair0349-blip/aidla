import React, { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Footer from "../pages/components/footer";
import "./FAQPage.css";

/* ─────────────────────── Constants ─────────────────────── */
const SITE_URL = "https://aidla.online";

const CATEGORIES = [
  { id: "general",         label: "General",         icon: "🌐" },
  { id: "coins_rewards",   label: "Coins & Rewards",  icon: "🪙" },
  { id: "tests_quizzes",   label: "Tests & Quizzes",  icon: "📝" },
  { id: "lucky_draw",      label: "Lucky Draw",       icon: "🎲" },
  { id: "account_profile", label: "Account",          icon: "👤" },
  { id: "withdrawals",     label: "Withdrawals",      icon: "💵" },
  { id: "education",       label: "Education",        icon: "🎓" },
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

/* ─────────────────── JSON-LD builders ──────────────────── */
/*
  FIX: Use QAPage (not FAQPage) for individual slug pages.
  FAQPage is only for the listing page (/faqs).
  Each /faqs/:slug page is a QAPage with a single Question.
  This prevents "Duplicate field 'FAQPage'" across pages.
*/
function buildQASchema(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": faq.question,
      "text": faq.question,
      "dateCreated": faq.created_at,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
        "dateCreated": faq.updated_at || faq.created_at,
        "upvoteCount": faq.helpful_yes,
        "url": `${SITE_URL}/faqs/${faq.slug}`,
        "author": {
          "@type": "Organization",
          "name": "AIDLA",
          "url": SITE_URL,
        },
      },
    },
  };
}

function buildBreadcrumbSchema(faq) {
  const cat = CAT_MAP[faq.category];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",  "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "FAQs",  "item": `${SITE_URL}/faqs` },
      { "@type": "ListItem", "position": 3, "name": cat ? `${cat.label}` : "FAQ", "item": `${SITE_URL}/faqs#${faq.category}` },
      { "@type": "ListItem", "position": 4, "name": faq.question, "item": `${SITE_URL}/faqs/${faq.slug}` },
    ],
  };
}

/* ─────────────────── Helpful Vote Button ────────────────── */
function VoteButton({ label, count, active, activeClass, onClick }) {
  return (
    <button
      className={`faqp-vote-btn ${active ? "faqp-vote-btn--active " + activeClass : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label} <span className="faqp-vote-count">{count}</span>
    </button>
  );
}

/* ─────────────────── Related FAQ Card ──────────────────── */
function RelatedCard({ faq }) {
  return (
    <Link to={`/faqs/${faq.slug}`} className="faqp-related-card">
      <span className="faqp-related-q">{faq.question}</span>
      <span className="faqp-related-arrow" aria-hidden="true">→</span>
    </Link>
  );
}

/* ─────────────────── Ask Question Form ─────────────────── */
function AskForm() {
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
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      question: form.question.trim(),
    });
    if (error) {
      setState("err"); setMsg("Something went wrong. Please try again.");
    } else {
      setState("ok");
      setMsg("✅ Question submitted! We'll email you when it's answered.");
      setForm({ name: "", email: "", question: "" });
    }
  };

  return (
    <div className="faqp-ask-wrap" id="ask">
      <div className="faqp-ask-header">
        <span className="faqp-ask-icon" aria-hidden="true">💬</span>
        <div>
          <h2 className="faqp-ask-title">Still have questions?</h2>
          <p className="faqp-ask-sub">Ask us — we'll answer and publish it to help others.</p>
        </div>
      </div>

      {state === "ok"  && <div className="faqp-msg faqp-msg--ok" role="alert">{msg}</div>}
      {state === "err" && <div className="faqp-msg faqp-msg--err" role="alert">{msg}</div>}

      {state !== "ok" && (
        <>
          <div className="faqp-ask-row2">
            <div>
              <label className="faqp-label" htmlFor="faqp-name">Your Name *</label>
              <input id="faqp-name" className="faqp-input" placeholder="Muhammad Ali" value={form.name} onChange={e => set("name", e.target.value)} autoComplete="name" />
            </div>
            <div>
              <label className="faqp-label" htmlFor="faqp-email">Email Address *</label>
              <input id="faqp-email" className="faqp-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => set("email", e.target.value)} autoComplete="email" />
            </div>
          </div>
          <label className="faqp-label" htmlFor="faqp-question">Your Question *</label>
          <textarea
            id="faqp-question"
            className="faqp-textarea"
            placeholder="Type your question clearly…"
            value={form.question}
            onChange={e => set("question", e.target.value.slice(0, 500))}
            rows={4}
          />
          <div className="faqp-char-count" aria-live="polite">{charLeft} characters left</div>
          <button className="faqp-submit" onClick={handleSubmit} disabled={state === "loading"}>
            {state === "loading" ? <span className="faqp-spinner" aria-label="Submitting..." /> : "🚀 Submit Question"}
          </button>
          <p className="faqp-privacy">🔒 Your email is only used to notify you — never shared publicly.</p>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function FAQPage() {
  const { slug }    = useParams();
  const navigate    = useNavigate();
  const fp          = useRef(getFingerprint());

  const [faq,      setFaq]      = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [shared,   setShared]   = useState(false);
  const viewTracked = useRef(false);

  /* ── Load FAQ ── */
  useEffect(() => {
    viewTracked.current = false;
    loadFAQ();
  }, [slug]);

  const loadFAQ = async () => {
    setLoading(true);
    setNotFound(false);

    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .eq("is_visible", true)
      .single();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setFaq(data);

    if (!viewTracked.current) {
      viewTracked.current = true;
      supabase.rpc("faq_increment_view", { p_faq_id: data.id });
    }

    const { data: rel } = await supabase
      .from("faqs")
      .select("id, slug, question")
      .eq("status", "published")
      .eq("is_visible", true)
      .eq("category", data.category)
      .neq("id", data.id)
      .order("sort_order")
      .limit(5);

    setRelated(rel || []);

    const { data: voteData } = await supabase
      .from("faq_helpful_votes")
      .select("vote")
      .eq("faq_id", data.id)
      .eq("fingerprint", fp.current)
      .maybeSingle();

    setUserVote(voteData?.vote || null);
    setLoading(false);
  };

  /* ── Handle vote ── */
  const handleVote = useCallback(async (vote) => {
    if (!faq) return;
    const prev = userVote;
    const newVote = prev === vote ? null : vote;

    setUserVote(newVote);
    setFaq(f => {
      if (!f) return f;
      let yes = f.helpful_yes;
      let no  = f.helpful_no;
      if (prev === "yes") yes--;
      if (prev === "no")  no--;
      if (newVote === "yes") yes++;
      if (newVote === "no")  no++;
      return { ...f, helpful_yes: Math.max(0, yes), helpful_no: Math.max(0, no) };
    });

    const { data } = await supabase.rpc("faq_toggle_helpful", {
      p_faq_id: faq.id,
      p_fingerprint: fp.current,
      p_vote: vote,
    });
    if (data) {
      setFaq(f => f ? { ...f, helpful_yes: data.helpful_yes, helpful_no: data.helpful_no } : f);
    }
  }, [faq, userVote]);

  /* ── Share ── */
  const handleShare = useCallback(() => {
    const url = `${SITE_URL}/faqs/${slug}`;
    if (navigator.share) {
      navigator.share({ title: faq?.question, url });
    } else {
      navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }, [slug, faq]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="faqp-page">
        <div className="faqp-skeleton-hero" aria-hidden="true" />
        <div className="faqp-content-wrap">
          <div className="faqp-skeleton-block faqp-skeleton-block--tall" aria-hidden="true" />
          <div className="faqp-skeleton-block" aria-hidden="true" />
          <div className="faqp-skeleton-block faqp-skeleton-block--short" aria-hidden="true" />
        </div>
      </div>
    );
  }

  /* ── 404 ── */
  if (notFound) {
    return (
      <>
        <div className="faqp-page">
          <div className="faqp-notfound">
            <span className="faqp-notfound-icon" aria-hidden="true">🤔</span>
            <h1 className="faqp-notfound-title">FAQ Not Found</h1>
            <p className="faqp-notfound-sub">This FAQ may have been removed or the link is incorrect.</p>
            <Link to="/faqs" className="faqp-back-btn">← Browse All FAQs</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const cat = CAT_MAP[faq.category];
  const totalVotes = faq.helpful_yes + faq.helpful_no;
  const helpfulPct = totalVotes > 0 ? Math.round((faq.helpful_yes / totalVotes) * 100) : null;
  const pageTitle  = `${faq.question} — AIDLA FAQ`;
  const pageDesc   = faq.answer.length > 155 ? faq.answer.slice(0, 152) + "…" : faq.answer;
  const canonicalUrl = `${SITE_URL}/faqs/${faq.slug}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

        {/* Open Graph */}
        <meta property="og:type"        content="article" />
        <meta property="og:url"         content={canonicalUrl} />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image"       content={`${SITE_URL}/og-image.jpg`} />
        <meta property="og:site_name"   content="AIDLA" />

        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}/og-image.jpg`} />

        {/* JSON-LD — QAPage (NOT FAQPage) for individual FAQ pages */}
        <script type="application/ld+json">{JSON.stringify(buildQASchema(faq))}</script>
        <script type="application/ld+json">{JSON.stringify(buildBreadcrumbSchema(faq))}</script>
      </Helmet>

      {/*
        FIX: Removed itemScope itemType="https://schema.org/QAPage" from <main>.
        JSON-LD in <Helmet> handles all structured data.
        Mixing Microdata + JSON-LD causes duplicate entity errors in Google.
      */}
      <main className="faqp-page">

        {/* ── Hero / Question Header ── */}
        <header className="faqp-hero">
          <div className="faqp-hero-bg" aria-hidden="true" />
          <div className="faqp-hero-inner">

            {/* Breadcrumb */}
            <nav className="faqp-breadcrumb" aria-label="Breadcrumb">
              <ol itemScope itemType="https://schema.org/BreadcrumbList">
                <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                  <Link to="/" itemProp="item"><span itemProp="name">Home</span></Link>
                  <meta itemProp="position" content="1" />
                </li>
                <span aria-hidden="true">›</span>
                <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                  <Link to="/faqs" itemProp="item"><span itemProp="name">FAQs</span></Link>
                  <meta itemProp="position" content="2" />
                </li>
                <span aria-hidden="true">›</span>
                <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                  <Link to={`/faqs#${faq.category}`} itemProp="item">
                    <span itemProp="name">{cat?.icon} {cat?.label}</span>
                  </Link>
                  <meta itemProp="position" content="3" />
                </li>
              </ol>
            </nav>

            {/* Category badge */}
            <div className="faqp-cat-badge">
              <span aria-hidden="true">{cat?.icon}</span>
              <span>{cat?.label}</span>
            </div>

            {/* The Question — H1 */}
            <h1 className="faqp-hero-title">
              {faq.question}
            </h1>

            {/* Meta */}
            <div className="faqp-hero-meta">
              <span>👁 {faq.view_count} views</span>
              <span className="faqp-meta-dot" aria-hidden="true">·</span>
              <span>👍 {faq.helpful_yes} found helpful</span>
              {faq.updated_at && (
                <>
                  <span className="faqp-meta-dot" aria-hidden="true">·</span>
                  <span>Updated {new Date(faq.updated_at).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="faqp-content-wrap">

          {/* Answer Card */}
          <article className="faqp-answer-card">
            <div className="faqp-answer-label">
              <span className="faqp-answer-label-dot" aria-hidden="true" />
              Official Answer
            </div>
            <div className="faqp-answer-text">
              {faq.answer}
            </div>

            {/* Author attribution */}
            <div className="faqp-answer-author">
              <div className="faqp-author-avatar" aria-hidden="true">A</div>
              <div>
                <div className="faqp-author-name">AIDLA Support Team</div>
                <div className="faqp-author-role">Official Answer · {new Date(faq.updated_at || faq.created_at).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}</div>
              </div>
            </div>
          </article>

          {/* Helpful + Share row */}
          <div className="faqp-actions-row">
            <div className="faqp-helpful-wrap">
              <span className="faqp-helpful-label">Was this helpful?</span>
              <div className="faqp-vote-btns">
                <VoteButton
                  label="👍 Yes"
                  count={faq.helpful_yes}
                  active={userVote === "yes"}
                  activeClass="faqp-vote-btn--yes"
                  onClick={() => handleVote("yes")}
                />
                <VoteButton
                  label="👎 No"
                  count={faq.helpful_no}
                  active={userVote === "no"}
                  activeClass="faqp-vote-btn--no"
                  onClick={() => handleVote("no")}
                />
              </div>
              {helpfulPct !== null && (
                <span className="faqp-helpful-pct">{helpfulPct}% found this helpful</span>
              )}
            </div>

            <button className="faqp-share-btn" onClick={handleShare} aria-label="Share this FAQ">
              {shared ? "✅ Copied!" : "🔗 Share"}
            </button>
          </div>

          {/* Related FAQs */}
          {related.length > 0 && (
            <section className="faqp-related" aria-labelledby="related-heading">
              <h2 className="faqp-related-title" id="related-heading">
                <span aria-hidden="true">{cat?.icon}</span> More {cat?.label} Questions
              </h2>
              <div className="faqp-related-list">
                {related.map(r => <RelatedCard key={r.id} faq={r} />)}
              </div>
              <Link to={`/faqs#${faq.category}`} className="faqp-see-all">
                See all {cat?.label} FAQs →
              </Link>
            </section>
          )}

          {/* Back link */}
          <div className="faqp-back-row">
            <Link to="/faqs" className="faqp-back-link">← Back to all FAQs</Link>
          </div>

          {/* Ask form */}
          <AskForm />
        </div>
      </main>

      <Footer />
    </>
  );
}