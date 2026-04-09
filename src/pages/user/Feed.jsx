import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../lib/supabase";

// ── Constants ─────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "zkafridi317@gmail.com";
const PAGE_SIZE   = 10;

const FEELINGS = [
  "😊 Happy","😂 Laughing","😍 Loved","🥳 Celebrating","😎 Cool",
  "😢 Sad","😡 Angry","😴 Tired","🤔 Thinking","🙏 Grateful",
  "💪 Motivated","📚 Studying","🎉 Excited","❤️ Thankful","😤 Frustrated",
];

const BANNED_WORDS = [
  "fuck","shit","ass","bitch","bastard","dick","pussy","cock","nigger","faggot",
  "whore","slut","rape","kill yourself","kys","sex","nude","naked","porn",
  "xxx","boobs","penis","vagina","harassment","abuse",
  "madarchod","bhenchod","gaand","lund","chutiya","harami","kamina","randi",
];

function containsBanned(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return BANNED_WORDS.some(w => lower.includes(w));
}
function containsPhone(text) {
  if (!text) return false;
  return /(\+?92|0)?[\s.-]?3[0-9]{2}[\s.-]?[0-9]{7}|(\d[\s.-]?){10,}/.test(text);
}
function validateContent(text) {
  if (containsBanned(text)) return "Your message contains inappropriate content.";
  if (containsPhone(text))  return "Phone numbers are not allowed in posts or comments.";
  return null;
}

// ── Helpers ───────────────────────────────────────────────────────────────
function timeAgo(iso) {
  if (!iso) return "";
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  if (s < 604800)return `${Math.floor(s/86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
}

function Avatar({ profile, size = 38 }) {
  const initials = profile?.full_name?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() || "?";
  if (profile?.avatar_url) return (
    <img src={profile.avatar_url} alt={profile.full_name}
      style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
  );
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:"linear-gradient(135deg,#1e3a8a,#3b82f6)",
      display:"flex", alignItems:"center", justifyContent:"center",
      color:"#fff", fontWeight:800, fontSize: size * 0.35,
    }}>{initials}</div>
  );
}

function BlueTick() {
  return (
    <span title="AIDLA Official" style={{
      display:"inline-flex", alignItems:"center", justifyContent:"center",
      width:16, height:16, borderRadius:"50%",
      background:"#1d9bf0", marginLeft:4, flexShrink:0,
      boxShadow:"0 1px 4px rgba(29,155,240,0.4)",
    }}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
      </svg>
    </span>
  );
}

// ── Report Modal ──────────────────────────────────────────────────────────
const REPORT_REASONS = [
  "Spam or misleading","Harassment or bullying","Hate speech",
  "Sexual content","Violence","Misinformation","Other",
];
function ReportModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [custom, setCustom]  = useState("");
  return (
    <div className="fd-overlay" onClick={onClose}>
      <div className="fd-modal" onClick={e=>e.stopPropagation()}>
        <div className="fd-modal-title">🚩 Report Content</div>
        <p className="fd-modal-sub">Select a reason for your report. Our team will review it.</p>
        <div className="fd-report-reasons">
          {REPORT_REASONS.map(r=>(
            <button key={r} className={`fd-reason-btn ${reason===r?"active":""}`}
              onClick={()=>setReason(r)}>{r}</button>
          ))}
        </div>
        {reason === "Other" && (
          <textarea className="fd-modal-textarea" placeholder="Describe the issue…"
            value={custom} onChange={e=>setCustom(e.target.value)} rows={3} maxLength={300}/>
        )}
        <div className="fd-modal-actions">
          <button className="fd-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="fd-modal-confirm fd-modal-report"
            disabled={!reason || (reason==="Other" && !custom.trim())}
            onClick={()=>onSubmit(reason==="Other" ? custom.trim() : reason)}>
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Comment ───────────────────────────────────────────────────────────────
function Comment({ c, currentUserId, isAdmin, postOwnerId, onDelete, onReport }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const canDelete = isAdmin || currentUserId === c.user_id || currentUserId === postOwnerId;
  const isAdminComment = c.profiles?.email === ADMIN_EMAIL;

  return (
    <div className="fd-comment">
      <Avatar profile={c.profiles} size={30} />
      <div className="fd-comment-body">
        <div className="fd-comment-header">
          <span className="fd-comment-name">
            {isAdminComment ? "AIDLA_Official" : (c.profiles?.full_name || "User")}
            {isAdminComment && <BlueTick />}
          </span>
          <span className="fd-comment-time">{timeAgo(c.created_at)}</span>
          <div className="fd-comment-menu-wrap">
            <button className="fd-dot-btn" onClick={()=>setMenuOpen(p=>!p)}>⋯</button>
            {menuOpen && (
              <div className="fd-dropdown">
                {canDelete && (
                  <button onClick={()=>{setMenuOpen(false); onDelete(c.id);}}>🗑 Delete</button>
                )}
                {currentUserId !== c.user_id && (
                  <button onClick={()=>{setMenuOpen(false); onReport(c.id,"comment");}}>🚩 Report</button>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="fd-comment-text">{c.content}</p>
      </div>
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────────────────
function PostCard({ post, currentUserId, currentEmail, currentUserProfile, isAdmin, onDelete, onReport, onCommentDelete, onRepost }) {
  const [comments,    setComments]    = useState([]);
  const [showComments,setShowComments]= useState(false);
  const [commentText, setCommentText] = useState("");
  const [liked,       setLiked]       = useState(post.user_liked);
  const [likeCount,   setLikeCount]   = useState(post.like_count || 0);
  const [commentCount,setCommentCount]= useState(post.comment_count || 0);
  const [posting,     setPosting]     = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [reportTarget,setReportTarget]= useState(null);
  const [reportDone,  setReportDone]  = useState(false);
  const menuRef = useRef(null);

  const isOwner    = currentUserId === post.user_id;
  const isAdminPost= post.profiles?.email === ADMIN_EMAIL;
  const displayName= isAdminPost ? "AIDLA_Official" : (post.profiles?.full_name || "User");

  useEffect(() => {
    const handler = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const loadComments = async () => {
    const { data } = await supabase
      .from("feed_comments")
      .select("*")
      .eq("post_id", post.id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });
    if (!data || data.length === 0) { setComments([]); return; }
    const userIds = [...new Set(data.map(c => c.user_id))];
    const { data: profileRows } = await supabase
      .from("users_profiles").select("user_id,full_name,avatar_url,email").in("user_id", userIds);
    const profileMap = Object.fromEntries((profileRows||[]).map(p=>[p.user_id,p]));
    setComments(data.map(c => ({ ...c, profiles: profileMap[c.user_id] || null })));
  };

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) await loadComments();
    setShowComments(p => !p);
  };

  const handleLike = async () => {
    if (!currentUserId) return;
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(c => newLiked ? c+1 : Math.max(c-1,0));
    if (newLiked) {
      await supabase.from("feed_likes").insert({ post_id: post.id, user_id: currentUserId });
    } else {
      await supabase.from("feed_likes").delete()
        .eq("post_id", post.id).eq("user_id", currentUserId);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || posting) return;
    const err = validateContent(commentText);
    if (err) { alert(err); return; }
    setPosting(true);
    const { data, error } = await supabase.from("feed_comments")
      .insert({ post_id: post.id, user_id: currentUserId, content: commentText.trim() })
      .select("*").single();
    if (!error && data) {
      const withProfile = { ...data, profiles: currentUserProfile };
      setComments(p => [...p, withProfile]);
      setCommentCount(c => c+1);
      setCommentText("");
      setShowComments(true);
    }
    setPosting(false);
  };

  const handleDeleteComment = async (commentId) => {
    await supabase.from("feed_comments").delete().eq("id", commentId);
    setComments(p => p.filter(c => c.id !== commentId));
    setCommentCount(c => Math.max(c-1,0));
    if (onCommentDelete) onCommentDelete(commentId);
  };

  const handleReport = async (reason) => {
    const { type, id } = reportTarget;
    await supabase.from("feed_reports").insert({
      reporter_id: currentUserId,
      post_id:    type === "post"    ? id : null,
      comment_id: type === "comment" ? id : null,
      reason,
    });
    setReportTarget(null);
    setReportDone(true);
    setTimeout(() => setReportDone(false), 3000);
  };

  const shareLink = `${window.location.origin}/feed/post/${post.id}`;
  const handleShare = () => {
    navigator.clipboard.writeText(shareLink).catch(()=>{});
    alert("Post link copied! Share it anywhere 🔗");
  };

  return (
    <div className={`fd-post-card ${post.is_pinned ? "fd-pinned" : ""}`}>
      {post.is_pinned && <div className="fd-pin-badge">📌 Pinned</div>}

      {reportTarget && (
        <ReportModal
          onClose={() => setReportTarget(null)}
          onSubmit={handleReport}
        />
      )}
      {reportDone && (
        <div className="fd-report-toast">✅ Report submitted. Thank you!</div>
      )}

      <div className="fd-post-header">
        <Avatar profile={post.profiles} size={42} />
        <div className="fd-post-meta">
          <div className="fd-post-author">
            {displayName}
            {isAdminPost && <BlueTick />}
          </div>
          <div className="fd-post-info">
            <span>{timeAgo(post.created_at)}</span>
            {post.location && <><span className="fd-dot">·</span><span>📍 {post.location}</span></>}
            {post.feeling  && <><span className="fd-dot">·</span><span>{post.feeling}</span></>}
          </div>
        </div>
        <div className="fd-post-menu-wrap" ref={menuRef}>
          <button className="fd-dot-btn fd-dot-btn-lg" onClick={() => setMenuOpen(p=>!p)}>⋯</button>
          {menuOpen && (
            <div className="fd-dropdown fd-dropdown-right">
              {(isOwner || isAdmin) && (
                <button onClick={() => { setMenuOpen(false); onDelete(post.id); }}>🗑 Delete Post</button>
              )}
              {!isOwner && (
                <button onClick={() => { setMenuOpen(false); setReportTarget({id: post.id, type:"post"}); }}>
                  🚩 Report Post
                </button>
              )}
              <button onClick={() => { setMenuOpen(false); handleShare(); }}>🔗 Copy Link</button>
            </div>
          )}
        </div>
      </div>

      {post.repost_of && post.original && (
        <div className="fd-repost-badge">
          🔁 Reposted from <strong>{post.original.profiles?.full_name || "User"}</strong>
        </div>
      )}

      <div className="fd-post-content">{post.content}</div>

      <div className="fd-post-actions">
        <button className={`fd-action-btn ${liked?"fd-liked":""}`} onClick={handleLike}>
          <span className="fd-action-icon">{liked ? "❤️" : "🤍"}</span>
          <span>{likeCount > 0 ? likeCount : ""} Like</span>
        </button>
        <button className="fd-action-btn" onClick={toggleComments}>
          <span className="fd-action-icon">💬</span>
          <span>{commentCount > 0 ? commentCount : ""} Comment</span>
        </button>
        <button className="fd-action-btn" onClick={() => onRepost(post)}>
          <span className="fd-action-icon">🔁</span>
          <span>{post.repost_count > 0 ? post.repost_count : ""} Repost</span>
        </button>
        <button className="fd-action-btn" onClick={handleShare}>
          <span className="fd-action-icon">📤</span>
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className="fd-comments-section">
          {comments.map(c => (
            <Comment key={c.id} c={c}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              postOwnerId={post.user_id}
              onDelete={handleDeleteComment}
              onReport={(id) => setReportTarget({id, type:"comment"})}
            />
          ))}
          <div className="fd-comment-input-row">
            <div className="fd-comment-input-wrap">
              <input
                className="fd-comment-input"
                placeholder="Write a comment…"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleComment()}
                maxLength={500}
              />
              <button className="fd-comment-send" onClick={handleComment} disabled={!commentText.trim() || posting}>
                {posting ? "…" : "➤"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Compose Box ───────────────────────────────────────────────────────────
function ComposeBox({ profile, userId, isAdmin, onPosted, repostOf = null, onCancelRepost }) {
  const [content,  setContent]  = useState("");
  const [feeling,  setFeeling]  = useState("");
  const [location, setLocation] = useState("");
  const [showFeelings, setShowFeelings] = useState(false);
  const [posting,  setPosting]  = useState(false);
  const [error,    setError]    = useState("");

  const displayName = isAdmin ? "AIDLA_Official" : (profile?.full_name || "You");

  const handlePost = async () => {
    const text = repostOf
      ? (content.trim() || `Reposted from @${repostOf.profiles?.full_name || "User"}`)
      : content.trim();
    if (!text) return;
    const contentErr = validateContent(text);
    if (contentErr) { setError(contentErr); return; }
    setPosting(true); setError("");
    const payload = {
      user_id:    userId,
      content:    text,
      feeling:    feeling || null,
      location:   location.trim() || null,
      repost_of:  repostOf?.id || null,
    };
    const { data, error: err } = await supabase.from("feed_posts")
      .insert(payload).select("*").single();
    if (err) {
      setError(err.message || "Failed to post. Please try again.");
    } else {
      const newPost = { ...data, profiles: profile, user_liked: false, repost_count: 0 };
      setContent(""); setFeeling(""); setLocation(""); setShowFeelings(false);
      if (onPosted) onPosted(newPost);
      if (onCancelRepost) onCancelRepost();
    }
    setPosting(false);
  };

  return (
    <div className="fd-compose">
      <div className="fd-compose-header">
        <Avatar profile={profile} size={40} />
        <div className="fd-compose-name">
          {displayName}{isAdmin && <BlueTick />}
        </div>
      </div>

      {repostOf && (
        <div className="fd-repost-preview">
          <div className="fd-rp-label">🔁 Reposting:</div>
          <div className="fd-rp-content">"{repostOf.content?.slice(0,120)}{repostOf.content?.length>120?"…":""}"</div>
          <button className="fd-rp-cancel" onClick={onCancelRepost}>✕ Cancel</button>
        </div>
      )}

      <textarea
        className="fd-compose-textarea"
        placeholder={repostOf ? "Add a comment to this repost… (optional)" : `What's on your mind, ${displayName.split(" ")[0]}?`}
        value={content}
        onChange={e => { setContent(e.target.value); setError(""); }}
        maxLength={2000}
        rows={3}
      />
      {error && <div className="fd-compose-error">⚠️ {error}</div>}

      <div className="fd-compose-extras">
        <div className="fd-compose-tags">
          <div className="fd-feelings-wrap">
            <button className="fd-tag-btn" onClick={() => setShowFeelings(p=>!p)}>
              {feeling || "😊 Feeling"}
            </button>
            {showFeelings && (
              <div className="fd-feelings-dropdown">
                {FEELINGS.map(f => (
                  <button key={f} className="fd-feeling-item"
                    onClick={() => { setFeeling(f); setShowFeelings(false); }}>
                    {f}
                  </button>
                ))}
                {feeling && (
                  <button className="fd-feeling-item fd-feeling-clear"
                    onClick={() => { setFeeling(""); setShowFeelings(false); }}>
                    ✕ Clear
                  </button>
                )}
              </div>
            )}
          </div>
          <input
            className="fd-location-input"
            placeholder="📍 Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            maxLength={80}
          />
        </div>

        <div className="fd-compose-footer">
          <span className="fd-char-count">{content.length}/2000</span>
          <button
            className="fd-post-btn"
            onClick={handlePost}
            disabled={posting || (!content.trim() && !repostOf)}
          >
            {posting ? "Posting…" : repostOf ? "🔁 Repost" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Feed ─────────────────────────────────────────────────────────────
export default function Feed() {
  const [profile,    setProfile]    = useState(null);
  const [userId,     setUserId]     = useState(null);
  const [userEmail,  setUserEmail]  = useState(null);
  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [hasMore,    setHasMore]    = useState(false);
  const [page,       setPage]       = useState(0);
  const [repostOf,   setRepostOf]   = useState(null);
  const [fetchingMore, setFetchingMore] = useState(false);
  const loaderRef   = useRef(null);
  const userIdRef   = useRef(null);

  const isAdmin = userEmail === ADMIN_EMAIL;

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setUserEmail(user.email);
      userIdRef.current = user.id;
      const { data: p } = await supabase.from("users_profiles")
        .select("full_name,avatar_url,email").eq("user_id", user.id).single();
      if (p) setProfile(p);
      doLoadPosts(0, true, user.id);
    })();
  }, []); // eslint-disable-line

  const doLoadPosts = async (pageNum, replace, uid) => {
    if (replace) setLoading(true);
    else setFetchingMore(true);

    const from = pageNum * PAGE_SIZE;
    const to   = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("feed_posts")
      .select("*")
      .eq("is_deleted", false)
      .order("is_pinned", { ascending: false })
      .order("created_at",  { ascending: false })
      .range(from, to);

    if (!error && data && data.length > 0) {
      const postIds   = data.map(p => p.id);
      const userIds   = [...new Set(data.map(p => p.user_id))];
      const repostIds = data.map(p => p.repost_of).filter(Boolean);

      const { data: profileRows } = await supabase
        .from("users_profiles")
        .select("user_id,full_name,avatar_url,email")
        .in("user_id", userIds);
      const profileMap = Object.fromEntries((profileRows||[]).map(p => [p.user_id, p]));

      let originalMap = {};
      if (repostIds.length > 0) {
        const { data: origRows } = await supabase
          .from("feed_posts").select("id,content,user_id").in("id", repostIds);
        if (origRows) {
          const origUserIds = [...new Set(origRows.map(r => r.user_id))];
          const { data: origProfiles } = await supabase
            .from("users_profiles").select("user_id,full_name,avatar_url").in("user_id", origUserIds);
          const origProfMap = Object.fromEntries((origProfiles||[]).map(p=>[p.user_id,p]));
          origRows.forEach(r => { originalMap[r.id] = { ...r, profiles: origProfMap[r.user_id] }; });
        }
      }

      const { data: likedRows } = await supabase
        .from("feed_likes").select("post_id").eq("user_id", uid).in("post_id", postIds);
      const likedSet = new Set((likedRows||[]).map(r => r.post_id));

      const enriched = data.map(p => ({
        ...p,
        profiles:   profileMap[p.user_id] || null,
        original:   p.repost_of ? (originalMap[p.repost_of] || null) : null,
        user_liked: likedSet.has(p.id),
      }));

      setPosts(prev => replace ? enriched : [...prev, ...enriched]);
      setHasMore(data.length === PAGE_SIZE);
      setPage(pageNum);
    } else if (!error) {
      if (replace) setPosts([]);
      setHasMore(false);
    }

    if (replace) setLoading(false);
    else setFetchingMore(false);
  };

  const loadPosts = useCallback((pageNum, replace) => {
    const uid = userIdRef.current;
    if (!uid) return;
    doLoadPosts(pageNum, replace, uid);
  }, []); // eslint-disable-line

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      if (isFetchingMoreRef.current || !hasMoreRef.current) return;
      loadPosts(pageRef.current + 1, false);
    }, { rootMargin: "200px", threshold: 0 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadPosts]);

  const hasMoreRef        = useRef(hasMore);
  const isFetchingMoreRef = useRef(fetchingMore);
  const pageRef           = useRef(page);
  useEffect(() => { hasMoreRef.current = hasMore; },              [hasMore]);
  useEffect(() => { isFetchingMoreRef.current = fetchingMore; },  [fetchingMore]);
  useEffect(() => { pageRef.current = page; },                    [page]);

  const handlePosted = (newPost) => {
    setPosts(prev => [{ ...newPost, user_liked: false }, ...prev]);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // THE FIX: robust delete — tries soft delete first, falls back to hard
  // delete, and reverts optimistic removal if both fail.
  // ─────────────────────────────────────────────────────────────────────────
  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    // 1. Optimistically remove from UI immediately
    setPosts(prev => prev.filter(p => p.id !== postId));

    // 2. Try soft delete first (update is_deleted = true)
    const { error: softErr } = await supabase
      .from("feed_posts")
      .update({ is_deleted: true })
      .eq("id", postId);

    if (!softErr) return; // ✅ soft delete succeeded, we're done

    // 3. Soft delete failed (e.g. column missing or RLS blocks UPDATE)
    //    Fall back to hard delete
    const { error: hardErr } = await supabase
      .from("feed_posts")
      .delete()
      .eq("id", postId);

    if (!hardErr) return; // ✅ hard delete succeeded

    // 4. Both failed — revert the optimistic removal and tell the user
    console.error("Delete failed — soft:", softErr, "hard:", hardErr);
    alert("Could not delete this post. You may not have permission.");
    // Re-fetch to restore the post in UI
    loadPosts(0, true);
  };

  const handleReport = async () => {
    // handled inside PostCard
  };

  return (
    <div className="fd-root">
      <style>{CSS}</style>

      <div className="fd-feed-header">
        <h2 className="fd-feed-title">
          {isAdmin ? "📡 AIDLA Feed — Admin View" : "📡 Community Feed"}
        </h2>
        {isAdmin && (
          <span className="fd-admin-badge">Admin Mode <BlueTick /></span>
        )}
      </div>

      {userId && (
        <ComposeBox
          profile={profile}
          userId={userId}
          isAdmin={isAdmin}
          onPosted={handlePosted}
          repostOf={repostOf}
          onCancelRepost={() => setRepostOf(null)}
        />
      )}

      <div className="fd-posts-list">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={userId}
            currentEmail={userEmail}
            currentUserProfile={profile}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onReport={handleReport}
            onCommentDelete={() => {}}
            onRepost={(p) => { setRepostOf(p); window.scrollTo({top:0,behavior:"smooth"}); }}
          />
        ))}
      </div>

      {loading && (
        <div className="fd-loading">
          <div className="fd-spinner" />
          <span>Loading posts…</span>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="fd-empty">
          <div style={{ fontSize:48 }}>💬</div>
          <p>No posts yet. Be the first to post!</p>
        </div>
      )}

      {fetchingMore && (
        <div className="fd-loading">
          <div className="fd-spinner" />
          <span>Loading more…</span>
        </div>
      )}

      {!loading && !fetchingMore && !hasMore && posts.length > 0 && (
        <div className="fd-end">You've seen all posts ✓</div>
      )}

      {hasMore && <div ref={loaderRef} style={{ height: 20 }} />}
    </div>
  );
}

// ── CSS ────────────────────────────────────────────────────────────────────
const CSS = `
  .fd-root {
    max-width: 680px;
    margin: 0 auto;
    font-family: 'Inter', system-ui, sans-serif;
    padding-bottom: 40px;
  }

  .fd-feed-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 18px;
  }
  .fd-feed-title {
    font-size: 1.25rem; font-weight: 900; color: #0f172a;
    letter-spacing: -0.4px; margin: 0;
  }
  .fd-admin-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 100px;
    background: rgba(29,155,240,0.1); border: 1px solid rgba(29,155,240,0.25);
    color: #0369a1; font-size: 0.78rem; font-weight: 700;
  }

  .fd-compose {
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(30,58,138,0.1);
    border-radius: 18px; padding: 18px;
    margin-bottom: 16px;
    box-shadow: 4px 4px 16px rgba(15,23,42,0.05), -4px -4px 12px rgba(255,255,255,0.8);
  }
  .fd-compose-header {
    display: flex; align-items: center; gap: 11px; margin-bottom: 12px;
  }
  .fd-compose-name {
    font-weight: 700; font-size: 0.9rem; color: #0f172a;
    display: flex; align-items: center; gap: 3px;
  }
  .fd-compose-textarea {
    width: 100%; padding: 12px 14px; border-radius: 13px;
    border: 1.5px solid rgba(30,58,138,0.1);
    background: #f8fafc; font-family: inherit;
    font-size: 0.92rem; color: #0f172a; line-height: 1.55;
    resize: none; box-sizing: border-box; transition: all 0.2s;
  }
  .fd-compose-textarea:focus {
    outline: none; background: #fff;
    border-color: rgba(59,130,246,0.35);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.07);
  }
  .fd-compose-error {
    font-size: 0.8rem; color: #dc2626; font-weight: 600;
    margin: 6px 0; padding: 8px 12px; background: rgba(239,68,68,0.07);
    border-radius: 8px;
  }
  .fd-compose-extras { margin-top: 10px; }
  .fd-compose-tags {
    display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;
  }
  .fd-tag-btn {
    padding: 6px 13px; border-radius: 100px;
    border: 1.5px solid rgba(30,58,138,0.12);
    background: rgba(30,58,138,0.04);
    color: #475569; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .fd-tag-btn:hover { background: rgba(30,58,138,0.09); }
  .fd-feelings-wrap { position: relative; }
  .fd-feelings-dropdown {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 100;
    background: #fff; border: 1px solid rgba(30,58,138,0.12);
    border-radius: 14px; padding: 8px;
    box-shadow: 0 12px 32px rgba(15,23,42,0.12);
    display: grid; grid-template-columns: 1fr 1fr; gap: 3px;
    min-width: 220px;
  }
  .fd-feeling-item {
    padding: 7px 10px; border-radius: 9px; border: none;
    background: transparent; text-align: left;
    font-size: 0.82rem; font-weight: 600; color: #334155;
    cursor: pointer; transition: background 0.12s;
  }
  .fd-feeling-item:hover { background: rgba(30,58,138,0.07); }
  .fd-feeling-clear { color: #ef4444; grid-column: span 2; }
  .fd-location-input {
    flex: 1; min-width: 120px; padding: 6px 12px; border-radius: 100px;
    border: 1.5px solid rgba(30,58,138,0.12);
    background: rgba(30,58,138,0.04);
    font-size: 0.8rem; font-family: inherit; color: #475569;
    outline: none; transition: all 0.15s;
  }
  .fd-location-input:focus { border-color: rgba(59,130,246,0.3); background: #fff; }
  .fd-compose-footer {
    display: flex; align-items: center; justify-content: space-between;
  }
  .fd-char-count { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
  .fd-post-btn {
    padding: 9px 24px; border-radius: 100px; border: none;
    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
    color: #fff; font-size: 0.88rem; font-weight: 800;
    cursor: pointer; transition: all 0.15s;
    box-shadow: 0 3px 0 #1e40af;
  }
  .fd-post-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
  .fd-post-btn:active:not(:disabled) { transform: translateY(3px); box-shadow: none; }
  .fd-post-btn:disabled { background: #cbd5e1; box-shadow: 0 3px 0 #94a3b8; cursor: not-allowed; }

  .fd-repost-preview {
    background: rgba(59,130,246,0.05); border: 1.5px solid rgba(59,130,246,0.15);
    border-radius: 12px; padding: 11px 14px; margin-bottom: 10px;
    display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap;
  }
  .fd-rp-label { font-size: 0.78rem; font-weight: 700; color: #3b82f6; white-space: nowrap; }
  .fd-rp-content { flex: 1; font-size: 0.84rem; color: #475569; font-style: italic; min-width: 0; }
  .fd-rp-cancel {
    font-size: 0.75rem; color: #ef4444; font-weight: 700;
    border: none; background: none; cursor: pointer; white-space: nowrap;
  }

  .fd-post-card {
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(30,58,138,0.08);
    border-radius: 18px; padding: 18px;
    margin-bottom: 14px; position: relative;
    box-shadow: 4px 4px 16px rgba(15,23,42,0.05), -4px -4px 12px rgba(255,255,255,0.8);
    animation: fdCardIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes fdCardIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
  .fd-pinned {
    border-color: rgba(245,158,11,0.3);
    box-shadow: 4px 4px 16px rgba(245,158,11,0.08), -4px -4px 12px rgba(255,255,255,0.8);
  }
  .fd-pin-badge {
    display: inline-block; margin-bottom: 10px; padding: 3px 10px; border-radius: 100px;
    background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25);
    font-size: 0.74rem; font-weight: 700; color: #b45309;
  }

  .fd-post-header {
    display: flex; align-items: flex-start; gap: 11px; margin-bottom: 12px;
  }
  .fd-post-meta { flex: 1; min-width: 0; }
  .fd-post-author {
    font-weight: 800; font-size: 0.93rem; color: #0f172a;
    display: flex; align-items: center; gap: 3px;
  }
  .fd-post-info {
    font-size: 0.76rem; color: #94a3b8; font-weight: 500; margin-top: 2px;
    display: flex; flex-wrap: wrap; align-items: center; gap: 3px;
  }
  .fd-dot { color: #cbd5e1; }

  .fd-post-menu-wrap, .fd-comment-menu-wrap { position: relative; }
  .fd-dot-btn {
    background: none; border: none; cursor: pointer;
    color: #94a3b8; font-size: 1.1rem; padding: 4px 8px;
    border-radius: 8px; transition: all 0.15s; line-height: 1;
  }
  .fd-dot-btn:hover { background: rgba(30,58,138,0.07); color: #475569; }
  .fd-dot-btn-lg { font-size: 1.3rem; padding: 4px 10px; }
  .fd-dropdown {
    position: absolute; top: calc(100% + 4px); right: 0; z-index: 50;
    background: #fff; border: 1px solid rgba(30,58,138,0.1);
    border-radius: 13px; padding: 6px;
    box-shadow: 0 12px 32px rgba(15,23,42,0.13); min-width: 160px;
    animation: fdDropIn 0.18s ease;
  }
  @keyframes fdDropIn { from { opacity:0; transform:scale(0.95) translateY(-6px); } to { opacity:1; transform:none; } }
  .fd-dropdown button {
    display: block; width: 100%; text-align: left;
    padding: 9px 13px; border: none; background: transparent;
    font-size: 0.83rem; font-weight: 600; color: #334155;
    border-radius: 9px; cursor: pointer; transition: background 0.12s;
  }
  .fd-dropdown button:hover { background: rgba(30,58,138,0.07); }

  .fd-repost-badge {
    font-size: 0.79rem; color: #64748b; margin-bottom: 8px;
    padding: 5px 10px; background: rgba(59,130,246,0.05);
    border-radius: 8px; border-left: 3px solid #3b82f6;
  }

  .fd-post-content {
    font-size: 0.95rem; color: #1e293b; line-height: 1.65;
    white-space: pre-wrap; word-break: break-word; margin-bottom: 14px;
  }

  .fd-post-actions {
    display: flex; gap: 2px; flex-wrap: wrap;
    padding-top: 10px; border-top: 1px solid rgba(30,58,138,0.06);
  }
  .fd-action-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 6px; border: none; background: transparent; border-radius: 10px;
    font-size: 0.8rem; font-weight: 600; color: #64748b; cursor: pointer;
    transition: all 0.15s; white-space: nowrap;
  }
  .fd-action-btn:hover { background: rgba(30,58,138,0.06); color: #1e3a8a; }
  .fd-liked { color: #e11d48; }
  .fd-liked:hover { color: #e11d48; }
  .fd-action-icon { font-size: 1rem; }

  .fd-comments-section {
    margin-top: 12px; padding-top: 12px;
    border-top: 1px solid rgba(30,58,138,0.06);
    display: flex; flex-direction: column; gap: 10px;
  }
  .fd-comment {
    display: flex; gap: 9px; align-items: flex-start;
  }
  .fd-comment-body { flex: 1; min-width: 0; }
  .fd-comment-header {
    display: flex; align-items: center; gap: 7px; flex-wrap: wrap;
  }
  .fd-comment-name {
    font-weight: 700; font-size: 0.83rem; color: #0f172a;
    display: flex; align-items: center; gap: 3px;
  }
  .fd-comment-time { font-size: 0.72rem; color: #94a3b8; font-weight: 500; }
  .fd-comment-text {
    font-size: 0.87rem; color: #334155; line-height: 1.5; margin: 3px 0 0;
    word-break: break-word;
  }
  .fd-comment-input-row { margin-top: 6px; }
  .fd-comment-input-wrap {
    display: flex; gap: 8px; align-items: center;
  }
  .fd-comment-input {
    flex: 1; padding: 9px 14px; border-radius: 100px;
    border: 1.5px solid rgba(30,58,138,0.12);
    background: #f8fafc; font-family: inherit;
    font-size: 0.86rem; color: #0f172a; outline: none; transition: all 0.15s;
  }
  .fd-comment-input:focus {
    border-color: rgba(59,130,246,0.3); background: #fff;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.06);
  }
  .fd-comment-send {
    width: 36px; height: 36px; border-radius: 50%; border: none;
    background: linear-gradient(135deg,#1e3a8a,#3b82f6);
    color: #fff; font-size: 0.85rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; flex-shrink: 0;
  }
  .fd-comment-send:hover:not(:disabled) { filter: brightness(1.1); transform: scale(1.05); }
  .fd-comment-send:disabled { background: #cbd5e1; cursor: not-allowed; }

  .fd-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(2,6,23,0.55);
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .fd-modal {
    background: #fff; border-radius: 22px; padding: 28px 24px;
    max-width: 420px; width: 100%;
    box-shadow: 0 30px 80px rgba(2,6,23,0.2);
    animation: fdModalIn 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes fdModalIn { from{opacity:0;transform:scale(0.9) translateY(16px);} to{opacity:1;transform:none;} }
  .fd-modal-title { font-size: 1.05rem; font-weight: 900; color: #0f172a; margin-bottom: 6px; }
  .fd-modal-sub { font-size: 0.83rem; color: #64748b; margin-bottom: 16px; }
  .fd-report-reasons { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
  .fd-reason-btn {
    padding: 7px 14px; border-radius: 100px;
    border: 1.5px solid rgba(30,58,138,0.15);
    background: transparent; font-size: 0.8rem; font-weight: 600;
    color: #475569; cursor: pointer; transition: all 0.15s;
  }
  .fd-reason-btn.active, .fd-reason-btn:hover {
    background: rgba(30,58,138,0.08); border-color: rgba(30,58,138,0.3); color: #1e3a8a;
  }
  .fd-modal-textarea {
    width: 100%; padding: 10px 13px; border-radius: 12px;
    border: 1.5px solid rgba(30,58,138,0.12);
    background: #f8fafc; font-family: inherit;
    font-size: 0.86rem; resize: none; box-sizing: border-box;
    outline: none; margin-bottom: 14px;
  }
  .fd-modal-actions { display: flex; gap: 9px; justify-content: flex-end; }
  .fd-modal-cancel {
    padding: 9px 20px; border-radius: 11px;
    border: 1.5px solid #e2e8f0; background: transparent;
    font-size: 0.86rem; font-weight: 700; color: #64748b; cursor: pointer;
  }
  .fd-modal-confirm {
    padding: 9px 20px; border-radius: 11px; border: none;
    font-size: 0.86rem; font-weight: 800; cursor: pointer; transition: all 0.15s;
  }
  .fd-modal-report {
    background: linear-gradient(135deg,#dc2626,#ef4444);
    color: #fff; box-shadow: 0 3px 0 #b91c1c;
  }
  .fd-modal-report:disabled { background: #cbd5e1; box-shadow: none; cursor: not-allowed; }
  .fd-report-toast {
    position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
    background: #15803d; color: #fff; padding: 7px 16px; border-radius: 100px;
    font-size: 0.8rem; font-weight: 700; white-space: nowrap; z-index: 10;
    animation: fdToastIn 0.3s ease;
  }
  @keyframes fdToastIn { from{opacity:0;transform:translateX(-50%) translateY(-8px);} to{opacity:1;transform:translateX(-50%) translateY(0);} }

  .fd-loading {
    display: flex; align-items: center; gap: 10px; justify-content: center;
    padding: 24px; color: #64748b; font-size: 0.85rem; font-weight: 600;
  }
  .fd-spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2.5px solid rgba(59,130,246,0.2); border-top-color: #3b82f6;
    animation: fdSpin 0.7s linear infinite;
  }
  @keyframes fdSpin { to { transform: rotate(360deg); } }
  .fd-empty {
    text-align: center; padding: 40px 20px;
    color: #94a3b8; font-size: 0.9rem; font-weight: 600;
  }
  .fd-end {
    text-align: center; padding: 20px;
    color: #cbd5e1; font-size: 0.8rem; font-weight: 600;
  }

  @media (max-width: 580px) {
    .fd-post-card, .fd-compose { padding: 14px; border-radius: 15px; }
    .fd-action-btn span:last-child { display: none; }
    .fd-action-btn { min-width: 0; }
    .fd-feelings-dropdown { grid-template-columns: 1fr; min-width: 160px; }
    .fd-modal { padding: 22px 18px; border-radius: 18px; }
  }
`;