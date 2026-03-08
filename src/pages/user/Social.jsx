import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

// ── Social links config ───────────────────────────────────────────────────
const SOCIAL_LINKS = [
  {
    id: "facebook",
    label: "Facebook",
    handle: "@AIDLA Official",
    desc: "Follow us for daily updates, prize announcements & community highlights.",
    url: "https://www.facebook.com/profile.php?id=61586195563121",
    color: "#1877f2",
    bg: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.2)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@aidla_official",
    desc: "Behind the scenes, winner celebrations & student success stories.",
    url: "https://www.instagram.com/aidla_official/",
    color: "#e1306c",
    bg: "rgba(225,48,108,0.08)",
    border: "rgba(225,48,108,0.2)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@aidla_official",
    desc: "Short study tips, quiz challenges & viral education content.",
    url: "https://www.tiktok.com/@aidla_official",
    color: "#010101",
    bg: "rgba(1,1,1,0.06)",
    border: "rgba(1,1,1,0.15)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/>
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "AIDLA",
    desc: "Career tips, professional development & AIDLA company updates.",
    url: "https://www.linkedin.com/company/aidla",
    color: "#0a66c2",
    bg: "rgba(10,102,194,0.08)",
    border: "rgba(10,102,194,0.2)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp Channel",
    handle: "AIDLA Official",
    desc: "Instant notifications for new prizes, draws & platform updates.",
    url: "https://whatsapp.com/channel/0029VbC6yju0rGiV5JaCqj42",
    color: "#25d366",
    bg: "rgba(37,211,102,0.08)",
    border: "rgba(37,211,102,0.2)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    handle: "@AIDLA",
    desc: "Quick updates, education threads & community discussions.",
    url: "https://twitter.com",
    color: "#000000",
    bg: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.12)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

// ── Star picker ────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const labels = ["", "Poor 😔", "Fair 😐", "Good 🙂", "Very Good 😊", "Excellent 🤩"];
  return (
    <div className="sc-star-row">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          className={`sc-star ${s <= (hover || value) ? "sc-star-on" : ""}`}
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${s} star${s > 1 ? "s" : ""}`}
        >★</button>
      ))}
      {(hover || value) > 0 && (
        <span className="sc-star-label">{labels[hover || value]}</span>
      )}
    </div>
  );
}

// ── Review card ────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const initials = review.full_name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso);
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 2592000000) return `${Math.floor(diff / 86400000)}d ago`;
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };
  return (
    <div className="sc-review-card">
      <div className="sc-review-top">
        <div className="sc-review-avatar">{initials}</div>
        <div className="sc-review-meta">
          <div className="sc-review-name">{review.full_name}</div>
          <div className="sc-review-time">{timeAgo(review.created_at)}</div>
        </div>
        <div className="sc-review-stars">
          {"★".repeat(review.rating)}
          <span style={{ opacity: 0.25 }}>{"★".repeat(5 - review.rating)}</span>
        </div>
      </div>
      <p className="sc-review-text">"{review.review_text}"</p>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Social() {
  const [user, setUser]           = useState(null);
  const [profile, setProfile]     = useState(null);
  const [reviews, setReviews]     = useState([]);
  const [myReview, setMyReview]   = useState(null);

  // form state
  const [rating, setRating]       = useState(0);
  const [text, setText]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus]       = useState(null); // "ok" | "err" | "dup"

  // edit / delete state
  const [editing, setEditing]         = useState(false);
  const [editRating, setEditRating]   = useState(0);
  const [editText, setEditText]       = useState("");
  const [editSaving, setEditSaving]   = useState(false);
  const [editStatus, setEditStatus]   = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting]       = useState(false);

  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [copied, setCopied]       = useState(null);

  // ── Load user + reviews ────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return;
      setUser(u);

      // profile
      const { data: p } = await supabase
        .from("users_profiles")
        .select("full_name, email")
        .eq("user_id", u.id)
        .single();
      if (p) setProfile(p);

      // all approved reviews
      const { data: rv } = await supabase
        .from("user_reviews")
        .select("id, full_name, email, rating, review_text, created_at")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(50);
      setReviews(rv || []);

      // check if user already reviewed
      const email = p?.email || u.email;
      if (email) {
        const { data: mine } = await supabase
          .from("user_reviews")
          .select("id, rating, review_text")
          .eq("email", email.toLowerCase())
          .maybeSingle();
        if (mine) setMyReview(mine);
      }

      setReviewsLoading(false);
    })();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("user_reviews")
      .select("id, full_name, email, rating, review_text, created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setReviews(data);
  };

  // ── Edit review ───────────────────────────────────────────────────────
  const startEdit = () => {
    setEditRating(myReview.rating);
    setEditText(myReview.review_text);
    setEditStatus(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditStatus(null);
  };

  const saveEdit = async () => {
    if (editRating === 0 || editText.trim().length < 20 || editSaving) return;
    setEditSaving(true);
    setEditStatus(null);
    const userEmail = (profile?.email || user?.email || "").toLowerCase();
    try {
      console.log("[saveEdit] updating email:", userEmail, "id:", myReview?.id);
      // Try update by id first (most reliable), fallback to email
      const { data, error } = await supabase
        .from("user_reviews")
        .update({ rating: editRating, review_text: editText.trim() })
        .eq("id", myReview.id)
        .select();
      console.log("[saveEdit] result:", { data, error });
      if (error) {
        console.error("[saveEdit] error:", error);
        setEditStatus("err");
      } else if (!data || data.length === 0) {
        // RLS blocked it — try matching by email instead
        console.log("[saveEdit] no rows updated by id, trying email...");
        const { data: data2, error: error2 } = await supabase
          .from("user_reviews")
          .update({ rating: editRating, review_text: editText.trim() })
          .eq("email", userEmail)
          .select();
        console.log("[saveEdit] email result:", { data2, error2 });
        if (error2 || !data2?.length) {
          setEditStatus("err");
        } else {
          const updated = { ...myReview, rating: editRating, review_text: editText.trim() };
          setMyReview(updated);
          setEditing(false);
          await fetchReviews();
        }
      } else {
        const updated = { ...myReview, rating: editRating, review_text: editText.trim() };
        setMyReview(updated);
        setEditing(false);
        await fetchReviews();
      }
    } catch(e) { console.error("[saveEdit] catch:", e); setEditStatus("err"); }
    finally { setEditSaving(false); }
  };

  // ── Delete review ──────────────────────────────────────────────────────
  const deleteReview = async () => {
    if (!myReview || deleting) return;
    setDeleting(true);
    const userEmail = (profile?.email || user?.email || "").toLowerCase();
    try {
      console.log("[deleteReview] id:", myReview?.id, "email:", userEmail);
      // Try by id first
      const { data, error } = await supabase
        .from("user_reviews")
        .delete()
        .eq("id", myReview.id)
        .select();
      console.log("[deleteReview] by id result:", { data, error });
      if (error) {
        console.error("[deleteReview] id error:", error);
        // Fallback: try by email
        const { data: data2, error: error2 } = await supabase
          .from("user_reviews")
          .delete()
          .eq("email", userEmail)
          .select();
        console.log("[deleteReview] by email result:", { data2, error2 });
        if (!error2) {
          setMyReview(null);
          setShowDeleteConfirm(false);
          setEditing(false);
          setRating(0); setText("");
          await fetchReviews();
        }
      } else {
        setMyReview(null);
        setShowDeleteConfirm(false);
        setEditing(false);
        setRating(0); setText("");
        await fetchReviews();
      }
    } catch(e) { console.error("[deleteReview] catch:", e); }
    finally { setDeleting(false); }
  };

  // ── Submit review ──────────────────────────────────────────────────────
  const submitReview = async () => {
    if (rating === 0 || text.trim().length < 20 || submitting) return;
    setSubmitting(true);
    setStatus(null);

    const email = profile?.email || user?.email || "";
    const fullName = profile?.full_name || user?.email?.split("@")[0] || "User";

    try {
      const { error } = await supabase.from("user_reviews").insert({
        full_name:   fullName,
        email:       email.toLowerCase(),
        rating,
        review_text: text.trim(),
        is_approved: true,
      });

      if (error?.code === "23505") {
        setStatus("dup");
      } else if (error) {
        setStatus("err");
      } else {
        setStatus("ok");
        setMyReview({ rating, review_text: text.trim() });
        setText(""); setRating(0);
        await fetchReviews();
      }
    } catch {
      setStatus("err");
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = (url, id) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const fullName = profile?.full_name || user?.email?.split("@")[0] || "You";

  return (
    <div className="sc-root">
      <style>{CSS}</style>

      {/* ── Page header ── */}
      <div className="sc-page-header">
        <div className="sc-page-header-icon">🌐</div>
        <div>
          <h1 className="sc-page-title">Community & Social</h1>
          <p className="sc-page-sub">Connect · Share · Celebrate with AIDLA</p>
        </div>
      </div>

      {/* ══════════════ SOCIAL LINKS ══════════════ */}
      <section className="sc-section">
        <div className="sc-section-header">
          <span className="sc-section-badge">📡 Follow Us</span>
          <h2 className="sc-section-title">Find AIDLA Everywhere</h2>
          <p className="sc-section-sub">Stay connected — get prize alerts, learning tips & community highlights</p>
        </div>

        <div className="sc-socials-grid">
          {SOCIAL_LINKS.map(s => (
            <div key={s.id} className="sc-social-card" style={{ "--s-color": s.color, "--s-bg": s.bg, "--s-border": s.border }}>
              <div className="sc-social-top">
                <div className="sc-social-icon-wrap" style={{ color: s.color, background: s.bg }}>
                  {s.icon}
                </div>
                <div className="sc-social-info">
                  <div className="sc-social-name">{s.label}</div>
                  <div className="sc-social-handle">{s.handle}</div>
                </div>
              </div>
              <p className="sc-social-desc">{s.desc}</p>
              <div className="sc-social-actions">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sc-follow-btn"
                  style={{ background: s.color }}
                >
                  Follow →
                </a>
                <button
                  className="sc-copy-btn"
                  onClick={() => copyLink(s.url, s.id)}
                  title="Copy link"
                >
                  {copied === s.id ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  )}
                  {copied === s.id ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ REVIEWS ══════════════ */}
      <section className="sc-section">
        <div className="sc-section-header">
          <span className="sc-section-badge">⭐ Reviews</span>
          <h2 className="sc-section-title">What Learners Say</h2>
          {avgRating && (
            <div className="sc-avg-rating">
              <span className="sc-avg-num">{avgRating}</span>
              <span className="sc-avg-stars">{"★".repeat(Math.round(avgRating))}</span>
              <span className="sc-avg-count">({reviews.length} reviews)</span>
            </div>
          )}
        </div>

        {/* ── Write review ── */}
        <div className="sc-review-form-card">
          {myReview ? (
            <div className="sc-already-reviewed">
              {/* ── Delete confirm modal ── */}
              {showDeleteConfirm && (
                <div className="sc-del-overlay" onClick={() => setShowDeleteConfirm(false)}>
                  <div className="sc-del-box" onClick={e => e.stopPropagation()}>
                    <div className="sc-del-icon">🗑️</div>
                    <div className="sc-del-title">Delete your review?</div>
                    <div className="sc-del-sub">This cannot be undone. You can write a new one after.</div>
                    <div className="sc-del-actions">
                      <button className="sc-del-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                      <button className="sc-del-confirm" onClick={deleteReview} disabled={deleting}>
                        {deleting ? "Deleting…" : "Yes, Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {editing ? (
                /* ── Edit mode ── */
                <div style={{ width: "100%" }}>
                  <div className="sc-edit-header">
                    <span className="sc-edit-title">✏️ Edit Your Review</span>
                    <button className="sc-edit-cancel-btn" onClick={cancelEdit}>Cancel</button>
                  </div>

                  <div className="sc-form-label">Your Rating *</div>
                  <StarPicker value={editRating} onChange={setEditRating} />

                  <div className="sc-form-label" style={{ marginTop: 14 }}>
                    Your Review * <span className="sc-form-hint">(min. 20 characters)</span>
                  </div>
                  <textarea
                    className="sc-textarea"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="Update your experience…"
                  />
                  <div className="sc-char-count">{editText.length}/500</div>

                  {editStatus === "err" && (
                    <div className="sc-status sc-status-err">❌ Something went wrong. Please try again.</div>
                  )}

                  <button
                    className="sc-submit-btn"
                    onClick={saveEdit}
                    disabled={editSaving || editRating === 0 || editText.trim().length < 20}
                  >
                    {editSaving ? <><span className="sc-submit-spinner" /> Saving…</> : "💾 Save Changes"}
                  </button>
                </div>
              ) : (
                /* ── View mode ── */
                <>
                  <div className="sc-ar-top">
                    <div className="sc-ar-icon">✅</div>
                    <div className="sc-ar-body">
                      <div className="sc-ar-title">Your Review</div>
                      <div className="sc-ar-stars">{"★".repeat(myReview.rating)}<span style={{opacity:0.2}}>{"★".repeat(5 - myReview.rating)}</span></div>
                      <p className="sc-ar-text">"{myReview.review_text}"</p>
                    </div>
                  </div>
                  <div className="sc-ar-actions">
                    <button className="sc-ar-edit-btn" onClick={startEdit}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </button>
                    <button className="sc-ar-delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="sc-form-header">
                <div className="sc-form-avatar">
                  {fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="sc-form-name">{fullName}</div>
                  <div className="sc-form-email">{profile?.email || user?.email}</div>
                </div>
              </div>

              <div className="sc-form-label">Your Rating *</div>
              <StarPicker value={rating} onChange={setRating} />

              <div className="sc-form-label" style={{ marginTop: 16 }}>
                Your Review * <span className="sc-form-hint">(min. 20 characters)</span>
              </div>
              <textarea
                className="sc-textarea"
                placeholder="Share your experience with AIDLA — what do you love most? How has it helped you?"
                value={text}
                onChange={e => setText(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <div className="sc-char-count">{text.length}/500</div>

              {status === "ok"  && <div className="sc-status sc-status-ok">✅ Review submitted! Thank you, {fullName.split(" ")[0]}! 🎉</div>}
              {status === "dup" && <div className="sc-status sc-status-warn">ℹ️ You've already submitted a review.</div>}
              {status === "err" && <div className="sc-status sc-status-err">❌ Something went wrong. Please try again.</div>}

              <button
                className="sc-submit-btn"
                onClick={submitReview}
                disabled={submitting || rating === 0 || text.trim().length < 20}
              >
                {submitting ? (
                  <><span className="sc-submit-spinner" /> Submitting…</>
                ) : (
                  "⭐ Submit Review"
                )}
              </button>
            </>
          )}
        </div>

        {/* ── Reviews list ── */}
        {reviewsLoading ? (
          <div className="sc-loading">
            <div className="sc-spinner" />
            <span>Loading reviews…</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="sc-empty-reviews">
            <div style={{ fontSize: 40 }}>💬</div>
            <p>No reviews yet — be the first!</p>
          </div>
        ) : (
          <div className="sc-reviews-grid">
            {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}

// ── CSS ────────────────────────────────────────────────────────────────────
const CSS = `
  .sc-root {
    max-width: 900px;
    margin: 0 auto;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: #0f172a;
    padding-bottom: 40px;
  }

  /* ── Page header ── */
  .sc-page-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(30,58,138,0.08);
    animation: scFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes scFadeIn { from { opacity:0; transform:translateY(-14px); } to { opacity:1; transform:none; } }
  .sc-page-header-icon {
    width: 50px; height: 50px; border-radius: 16px;
    background: linear-gradient(135deg,#1e3a8a,#3b82f6);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; flex-shrink: 0;
    box-shadow: 0 6px 18px rgba(59,130,246,0.3);
  }
  .sc-page-title {
    font-size: clamp(1.2rem,3vw,1.6rem);
    font-weight: 900; letter-spacing: -0.5px;
    background: linear-gradient(135deg,#1e3a8a,#3b82f6);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin: 0 0 2px;
  }
  .sc-page-sub { font-size: 0.82rem; color: #64748b; font-weight: 600; margin: 0; }

  /* ── Sections ── */
  .sc-section { margin-bottom: 40px; }
  .sc-section-header { text-align: center; margin-bottom: 22px; }
  .sc-section-badge {
    display: inline-block; padding: 4px 14px; border-radius: 100px;
    background: rgba(30,58,138,0.07); border: 1px solid rgba(30,58,138,0.12);
    font-size: 0.75rem; font-weight: 700; color: #1e3a8a;
    letter-spacing: 0.5px; margin-bottom: 8px;
  }
  .sc-section-title {
    font-size: clamp(1.1rem,2.5vw,1.4rem); font-weight: 900;
    color: #0f172a; margin: 0 0 6px; letter-spacing: -0.3px;
  }
  .sc-section-sub { font-size: 0.84rem; color: #64748b; font-weight: 500; margin: 0; }

  /* ── Average rating ── */
  .sc-avg-rating {
    display: inline-flex; align-items: center; gap: 7px;
    margin-top: 10px; padding: 7px 16px; border-radius: 100px;
    background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25);
  }
  .sc-avg-num { font-size: 1.2rem; font-weight: 900; color: #b45309; }
  .sc-avg-stars { font-size: 1rem; color: #f59e0b; letter-spacing: 1px; }
  .sc-avg-count { font-size: 0.8rem; color: #78716c; font-weight: 600; }

  /* ── Social grid ── */
  .sc-socials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px;
  }
  .sc-social-card {
    background: rgba(255,255,255,0.85);
    border: 1px solid var(--s-border);
    border-radius: 18px;
    padding: 18px;
    display: flex; flex-direction: column; gap: 12px;
    box-shadow: 4px 4px 16px rgba(15,23,42,0.05), -4px -4px 12px rgba(255,255,255,0.8);
    transition: transform 0.2s, box-shadow 0.2s;
    animation: scCardIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }
  .sc-social-card:hover {
    transform: translateY(-3px);
    box-shadow: 6px 8px 24px rgba(15,23,42,0.09), -4px -4px 12px rgba(255,255,255,0.9);
  }
  @keyframes scCardIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }

  .sc-social-top { display: flex; align-items: center; gap: 12px; }
  .sc-social-icon-wrap {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .sc-social-name { font-weight: 800; font-size: 0.95rem; color: #0f172a; }
  .sc-social-handle { font-size: 0.78rem; color: #64748b; font-weight: 600; margin-top: 1px; }
  .sc-social-desc { font-size: 0.82rem; color: #475569; line-height: 1.5; flex: 1; }
  .sc-social-actions { display: flex; gap: 8px; align-items: center; }

  .sc-follow-btn {
    flex: 1; text-align: center;
    padding: 9px 16px; border-radius: 10px; border: none;
    color: #fff; font-weight: 700; font-size: 0.82rem;
    text-decoration: none; cursor: pointer;
    transition: all 0.15s; opacity: 0.92;
    display: block;
  }
  .sc-follow-btn:hover { opacity: 1; transform: translateY(-1px); }

  .sc-copy-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 9px 12px; border-radius: 10px;
    border: 1px solid rgba(30,58,138,0.12);
    background: rgba(30,58,138,0.05);
    color: #475569; font-size: 0.78rem; font-weight: 600;
    cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .sc-copy-btn:hover { background: rgba(30,58,138,0.1); color: #1e3a8a; }

  /* ── Review form card ── */
  .sc-review-form-card {
    background: rgba(255,255,255,0.9);
    border: 1px solid rgba(30,58,138,0.1);
    border-radius: 20px;
    padding: 22px;
    margin-bottom: 22px;
    box-shadow: 6px 6px 20px rgba(15,23,42,0.06), -6px -6px 16px rgba(255,255,255,0.9);
  }

  .sc-form-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
    padding-bottom: 16px; border-bottom: 1px solid rgba(30,58,138,0.07);
  }
  .sc-form-avatar {
    width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 0.95rem; font-weight: 800;
    box-shadow: 0 3px 10px rgba(59,130,246,0.25);
  }
  .sc-form-name { font-weight: 800; font-size: 0.95rem; color: #0f172a; }
  .sc-form-email { font-size: 0.78rem; color: #64748b; margin-top: 2px; }

  .sc-form-label {
    font-size: 0.78rem; font-weight: 700; color: #334155;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;
  }
  .sc-form-hint { text-transform: none; font-weight: 500; color: #94a3b8; }

  /* ── Stars ── */
  .sc-star-row { display: flex; align-items: center; gap: 5px; }
  .sc-star {
    font-size: 2rem; background: none; border: none; cursor: pointer;
    color: #cbd5e1; transition: all 0.12s; padding: 0; line-height: 1;
  }
  .sc-star-on { color: #f59e0b; transform: scale(1.15); }
  .sc-star:hover { transform: scale(1.2); }
  .sc-star-label {
    font-size: 0.82rem; font-weight: 700; color: #f59e0b;
    margin-left: 8px; animation: scFadeIn 0.2s ease;
  }

  /* ── Textarea ── */
  .sc-textarea {
    width: 100%; padding: 13px 15px; border-radius: 13px;
    border: 1.5px solid rgba(30,58,138,0.12);
    background: #f8fafc; font-family: inherit;
    font-size: 0.9rem; color: #0f172a; line-height: 1.55;
    resize: vertical; min-height: 100px;
    box-shadow: inset 3px 3px 6px rgba(15,23,42,0.04), inset -3px -3px 6px rgba(255,255,255,1);
    transition: all 0.2s; box-sizing: border-box;
  }
  .sc-textarea:focus {
    outline: none; background: #fff;
    border-color: rgba(59,130,246,0.4);
    box-shadow: inset 2px 2px 4px rgba(15,23,42,0.03), inset -2px -2px 4px rgba(255,255,255,1), 0 0 0 3px rgba(59,130,246,0.08);
  }
  .sc-char-count {
    text-align: right; font-size: 0.75rem; color: #94a3b8;
    font-weight: 600; margin-top: 5px;
  }

  /* ── Status messages ── */
  .sc-status {
    padding: 10px 14px; border-radius: 11px;
    font-size: 0.84rem; font-weight: 600; margin: 10px 0;
  }
  .sc-status-ok   { background: rgba(22,163,74,0.08); color: #15803d; border: 1px solid rgba(22,163,74,0.2); }
  .sc-status-warn { background: rgba(245,158,11,0.08); color: #b45309; border: 1px solid rgba(245,158,11,0.2); }
  .sc-status-err  { background: rgba(239,68,68,0.08); color: #dc2626; border: 1px solid rgba(239,68,68,0.2); }

  /* ── Submit button ── */
  .sc-submit-btn {
    width: 100%; padding: 13px; border-radius: 13px; border: none;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #fff; font-size: 0.95rem; font-weight: 800;
    cursor: pointer; margin-top: 14px;
    box-shadow: 0 4px 0 #1e40af, 0 8px 20px rgba(30,58,138,0.25);
    transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .sc-submit-btn:hover:not(:disabled) {
    filter: brightness(1.08); transform: translateY(-1px);
    box-shadow: 0 6px 0 #1e40af, 0 12px 24px rgba(30,58,138,0.3);
  }
  .sc-submit-btn:active:not(:disabled) {
    transform: translateY(4px);
    box-shadow: 0 0 0 #1e40af, 0 4px 10px rgba(30,58,138,0.2);
  }
  .sc-submit-btn:disabled { background: #cbd5e1; box-shadow: 0 4px 0 #94a3b8; cursor: not-allowed; }
  .sc-submit-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
    animation: scSpin 0.7s linear infinite;
  }
  @keyframes scSpin { to { transform: rotate(360deg); } }

  /* ── Already reviewed ── */
  .sc-already-reviewed {
    display: flex; gap: 14px; align-items: flex-start;
    padding: 4px 0;
  }
  .sc-ar-icon { font-size: 2rem; flex-shrink: 0; }
  .sc-ar-title { font-weight: 800; font-size: 0.95rem; color: #15803d; margin-bottom: 5px; }
  .sc-ar-stars { font-size: 1.1rem; color: #f59e0b; margin-bottom: 6px; }
  .sc-ar-text { font-size: 0.85rem; color: #475569; line-height: 1.5; font-style: italic; }

  /* ── Reviews grid ── */
  .sc-reviews-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 12px;
  }
  .sc-review-card {
    background: rgba(255,255,255,0.85);
    border: 1px solid rgba(30,58,138,0.09);
    border-radius: 16px; padding: 16px;
    box-shadow: 3px 3px 12px rgba(15,23,42,0.04), -3px -3px 8px rgba(255,255,255,0.9);
    animation: scCardIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
    display: flex; flex-direction: column; gap: 10px;
  }
  .sc-review-top { display: flex; align-items: center; gap: 10px; }
  .sc-review-avatar {
    width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 0.82rem; font-weight: 800;
  }
  .sc-review-name { font-weight: 700; font-size: 0.88rem; color: #0f172a; }
  .sc-review-time { font-size: 0.72rem; color: #94a3b8; font-weight: 600; margin-top: 1px; }
  .sc-review-stars { margin-left: auto; font-size: 0.85rem; color: #f59e0b; white-space: nowrap; }
  .sc-review-text {
    font-size: 0.84rem; color: #475569; line-height: 1.55;
    font-style: italic; margin: 0;
    display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
  }

  /* ── Loading / empty ── */
  .sc-loading {
    display: flex; align-items: center; gap: 10px;
    color: #64748b; font-size: 0.85rem; font-weight: 600;
    padding: 20px; justify-content: center;
  }
  .sc-spinner {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2.5px solid rgba(59,130,246,0.2); border-top-color: #3b82f6;
    animation: scSpin 0.7s linear infinite;
  }
  .sc-empty-reviews {
    text-align: center; padding: 30px; color: #94a3b8;
    font-size: 0.88rem; font-weight: 600;
  }

  /* ── Already reviewed view/edit ── */
  .sc-already-reviewed {
    display: flex; flex-direction: column; gap: 14px; width: 100%;
  }
  .sc-ar-top { display: flex; gap: 13px; align-items: flex-start; }
  .sc-ar-icon { font-size: 1.8rem; flex-shrink: 0; margin-top: 2px; }
  .sc-ar-body { flex: 1; min-width: 0; }
  .sc-ar-title { font-weight: 800; font-size: 0.92rem; color: #15803d; margin-bottom: 4px; }
  .sc-ar-stars { font-size: 1.05rem; color: #f59e0b; margin-bottom: 6px; }
  .sc-ar-text { font-size: 0.85rem; color: #475569; line-height: 1.55; font-style: italic; margin: 0; }
  .sc-ar-actions {
    display: flex; gap: 9px;
    padding-top: 12px; border-top: 1px solid rgba(30,58,138,0.07);
  }
  .sc-ar-edit-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 10px;
    border: 1.5px solid rgba(30,58,138,0.18);
    background: rgba(30,58,138,0.05); color: #1e3a8a;
    font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .sc-ar-edit-btn:hover { background: rgba(30,58,138,0.1); transform: translateY(-1px); }
  .sc-ar-delete-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 10px;
    border: 1.5px solid rgba(239,68,68,0.2);
    background: rgba(239,68,68,0.05); color: #dc2626;
    font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .sc-ar-delete-btn:hover { background: rgba(239,68,68,0.1); transform: translateY(-1px); }

  /* ── Edit header ── */
  .sc-edit-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 14px; padding-bottom: 12px;
    border-bottom: 1px solid rgba(30,58,138,0.07);
  }
  .sc-edit-title { font-weight: 800; font-size: 0.95rem; color: #0f172a; }
  .sc-edit-cancel-btn {
    padding: 6px 14px; border-radius: 9px;
    border: 1.5px solid rgba(100,116,139,0.2);
    background: transparent; color: #64748b;
    font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .sc-edit-cancel-btn:hover { background: #f1f5f9; }

  /* ── Delete confirm modal ── */
  .sc-del-overlay {
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(2,6,23,0.5); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .sc-del-box {
    background: #fff; border-radius: 22px; padding: 30px 26px;
    text-align: center; max-width: 360px; width: 100%;
    box-shadow: 0 30px 80px rgba(2,6,23,0.22);
    animation: scConfirmIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes scConfirmIn { from { opacity:0; transform:scale(0.88) translateY(16px); } to { opacity:1; transform:none; } }
  .sc-del-icon { font-size: 42px; margin-bottom: 10px; }
  .sc-del-title { font-size: 1.1rem; font-weight: 900; color: #0f172a; margin-bottom: 8px; }
  .sc-del-sub { font-size: 0.83rem; color: #64748b; line-height: 1.5; margin-bottom: 22px; }
  .sc-del-actions { display: flex; gap: 10px; justify-content: center; }
  .sc-del-cancel {
    padding: 10px 22px; border-radius: 12px;
    border: 1.5px solid #e2e8f0; background: transparent;
    color: #475569; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .sc-del-cancel:hover { background: #f8fafc; }
  .sc-del-confirm {
    padding: 10px 22px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: #fff; font-size: 0.88rem; font-weight: 700; cursor: pointer;
    box-shadow: 0 3px 0 #b91c1c;
    transition: all 0.15s;
  }
  .sc-del-confirm:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
  .sc-del-confirm:disabled { opacity: 0.7; cursor: not-allowed; }

  /* ── Mobile ── */
  @media (max-width: 600px) {
    .sc-page-header { gap: 10px; margin-bottom: 20px; }
    .sc-page-header-icon { width: 42px; height: 42px; font-size: 20px; border-radius: 13px; }
    .sc-socials-grid { grid-template-columns: 1fr; gap: 10px; }
    .sc-social-card { padding: 14px; gap: 10px; border-radius: 15px; }
    .sc-social-icon-wrap { width: 42px; height: 42px; border-radius: 12px; }
    .sc-review-form-card { padding: 16px; border-radius: 16px; }
    .sc-star { font-size: 1.7rem; }
    .sc-reviews-grid { grid-template-columns: 1fr; gap: 10px; }
    .sc-review-card { padding: 13px; border-radius: 14px; }
  }
`;