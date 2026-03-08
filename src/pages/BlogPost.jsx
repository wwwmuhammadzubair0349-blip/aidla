import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet"; // or "react-helmet-async"
import { supabase } from "../lib/supabase";
import Footer from "../pages/components/footer"; // adjust path if needed
import "./BlogPost.css";

/* ─── Helpers (unchanged) ─── */
function isUrdu(t) { return t ? /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(t) : false; }

function getFingerprint() {
  let fp = localStorage.getItem("bp_fp");
  if (!fp) { fp = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("bp_fp", fp); }
  return fp;
}

function sanitizeHtml(html) {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;["script","style","iframe","object","embed","form","input","button","meta"].forEach(tag =>
    tmp.querySelectorAll(tag).forEach(el => el.remove())
  );
  tmp.querySelectorAll("a").forEach(a => {
    a.setAttribute("target","_blank"); a.setAttribute("rel","noopener noreferrer");
    const href = a.getAttribute("href") || "";
    if (href.toLowerCase().startsWith("javascript:")) a.removeAttribute("href");
    else if (href && !href.startsWith("http") && !href.startsWith("/") && !href.startsWith("#") && !href.startsWith("mailto:"))
      a.setAttribute("href",`https://${href}`);
  });
  return tmp.innerHTML;
}

function estimateReadTime(html) {
  if (!html) return null;
  const tmp = document.createElement("div"); tmp.innerHTML = html;
  const words = (tmp.innerText||"").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1,Math.round(words/200))} min read`;
}

function buildTOC(html) {
  if (!html) return { toc:[], html:"" };
  const tmp = document.createElement("div"); tmp.innerHTML = html;
  const items =[];
  tmp.querySelectorAll("h2,h3,h4").forEach((h,i) => {
    const id = `bp-h-${i}`; h.setAttribute("id",id);
    items.push({ id, text:h.innerText||h.textContent||"", tag:h.tagName.toLowerCase() });
  });
  return { toc:items, html:tmp.innerHTML };
}

function getRenderedHtml(post) {
  const raw = post.content_html || (post.content ? post.content.split("\n").filter(l=>l.trim()).map(l=>`<p>${l}</p>`).join("") : "");
  return sanitizeHtml(raw);
}

function formatDate(d) {
  if (!d) return "New";
  return new Date(d).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" });
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100,(scrolled/total)*100) : 0);
    };
    window.addEventListener("scroll", update, { passive:true });
    return () => window.removeEventListener("scroll", update);
  },[]);
  return progress;
}

/* ─── Build comment tree (infinite nesting) ─── */
function buildTree(flat) {
  const map = {};
  flat.forEach(c => { map[c.id] = { ...c, replies:[] }; });
  const roots =[];
  flat.forEach(c => {
    if (c.parent_id && map[c.parent_id]) map[c.parent_id].replies.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  return roots;
}

/* ─── Confirm Dialog ─── */
function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div className="bp-confirm-overlay" onClick={onCancel}>
      <motion.div className="bp-confirm-box"
        initial={{opacity:0,scale:0.9,y:16}} animate={{opacity:1,scale:1,y:0}}
        exit={{opacity:0,scale:0.9,y:16}} transition={{duration:0.2}}
        onClick={e=>e.stopPropagation()}
      >
        <div className="bp-confirm-icon">🗑️</div>
        <div className="bp-confirm-title">Delete Comment?</div>
        <div className="bp-confirm-sub">This cannot be undone. The comment and all its replies will be removed.</div>
        <div className="bp-confirm-btns">
          <button className="bp-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="bp-confirm-delete" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Reply Form ─── */
function ReplyForm({ onSubmit, onCancel, loading }) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="bp-reply-form">
      <div className="bp-reply-form-title">↩ Write a Reply</div>
      <div className="bp-reply-row">
        <input className="bp-form-input" placeholder="Your name *" value={name} onChange={e=>setName(e.target.value)} />
        <input className="bp-form-input" placeholder="Email (optional)" value="" onChange={()=>{}} />
      </div>
      <textarea className="bp-reply-textarea" placeholder="Write your reply…" value={body} onChange={e=>setBody(e.target.value)}/>
      <div className="bp-reply-actions">
        <button className="bp-reply-submit" onClick={() => onSubmit(name, body)} disabled={loading||!name.trim()||!body.trim()}>
          {loading ? "Posting…" : "Post Reply →"}
        </button>
        <button className="bp-reply-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── Single Comment Node (recursive) ─── */
function CommentNode({ node, fp, depth=0, onDelete, onEdit, onReply, onLikeComment, commentLikes, postId }) {
  const [editing, setEditing]       = useState(false);
  const [editBody, setEditBody]     = useState(node.body);
  const [saving, setSaving]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReply, setShowReply]   = useState(false);
  const[replyLoading, setReplyLoading] = useState(false);
  const [flagged, setFlagged]       = useState(node.is_flagged);

  const isMine = node.fingerprint === fp;
  const likes = commentLikes[node.id] || { count:0, liked:false };

  const handleSave = async () => {
    if (!editBody.trim() || editBody.trim()===node.body) { setEditing(false); return; }
    setSaving(true); await onEdit(node.id, editBody.trim()); setSaving(false); setEditing(false);
  };

  const handleReplySubmit = async (name, body) => {
    setReplyLoading(true);
    await onReply({ parentId:node.id, name, body });
    setReplyLoading(false); setShowReply(false);
  };

  const handleFlag = async () => {
    if (flagged) return;
    const { error } = await supabase.rpc("blogs_flag_comment",{ p_comment_id:node.id });
    if (!error) setFlagged(true);
  };

  return (
    <>
      <div className={`bp-comment-item${isMine?" is-mine":""}${node.is_pinned?" is-pinned":""}${flagged?" is-flagged":""}`}>
        {/* Header */}
        <div className="bp-comment-header">
          <div className="bp-comment-author-row">
            <div className={`bp-comment-avatar${isMine?" mine":""}`}>{(node.author_name||"?")[0].toUpperCase()}</div>
            <span className="bp-comment-name">{node.author_name}</span>
            {isMine && <span className="bp-mine-badge">You</span>}
            {node.is_pinned && <span className="bp-pin-badge">📌 Pinned</span>}
            {node.edited_at && <span className="bp-comment-edited">(edited)</span>}
          </div>
          <span className="bp-comment-date">{formatDate(node.created_at)}</span>
        </div>

        {/* Body or Edit */}
        {editing ? (
          <>
            <textarea className="bp-comment-edit-area" value={editBody} onChange={e=>setEditBody(e.target.value)} autoFocus/>
            <div style={{display:"flex",gap:7}}>
              <button className="bp-cmt-action-btn bp-cmt-save-btn" onClick={handleSave} disabled={saving||!editBody.trim()}>{saving?"Saving…":"✅ Save"}</button>
              <button className="bp-cmt-action-btn bp-cmt-cancel-btn" onClick={()=>{setEditBody(node.body);setEditing(false);}}>Cancel</button>
            </div>
          </>
        ) : (
          <p className="bp-comment-body">{node.body}</p>
        )}

        {/* Actions Row */}
        {!editing && (
          <div className="bp-comment-actions-row">
            {/* Like comment */}
            <button className={`bp-cmt-like-btn${likes.liked?" liked":""}`} onClick={()=>onLikeComment(node.id)}>
              {likes.liked?"❤️":"🤍"} {likes.count > 0 ? likes.count : ""}
            </button>
            {/* Reply */}
            <button className="bp-cmt-reply-btn" onClick={()=>setShowReply(v=>!v)}>↩ Reply</button>
            {/* Own comment actions */}
            {isMine && (
              <>
                <button className="bp-cmt-action-btn bp-cmt-edit-btn" onClick={()=>{setEditBody(node.body);setEditing(true);}}>✏️ Edit</button>
                <button className="bp-cmt-action-btn bp-cmt-delete-btn" onClick={()=>setShowConfirm(true)}>🗑 Delete</button>
              </>
            )}
            {/* Flag (only for others' comments) */}
            {!isMine && (
              <button className={`bp-cmt-action-btn bp-cmt-flag-btn${flagged?" flagged":""}`} onClick={handleFlag} disabled={flagged}>
                {flagged?"🚩 Reported":"🚩 Report"}
              </button>
            )}
          </div>
        )}

        {/* Reply Form */}
        {showReply && (
          <ReplyForm
            onSubmit={handleReplySubmit}
            onCancel={()=>setShowReply(false)}
            loading={replyLoading}
          />
        )}
      </div>

      {/* Recursive Replies */}
      {node.replies?.length > 0 && (
        <div className="bp-comment-replies">
          {node.replies.map(child => (
            <CommentNode
              key={child.id} node={child} fp={fp} depth={depth+1}
              onDelete={onDelete} onEdit={onEdit} onReply={onReply}
              onLikeComment={onLikeComment} commentLikes={commentLikes} postId={postId}
            />
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      <AnimatePresence>
        {showConfirm && (
          <ConfirmDialog
            onConfirm={()=>{ setShowConfirm(false); onDelete(node.id); }}
            onCancel={()=>setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

const fadeUp = { initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:0.5} };

/* ══════════════════════════════════════════════════════ */
export default function BlogPost() {
  const { slug } = useParams();
  const progress = useReadingProgress();
  const fp = getFingerprint();
  const viewedRef = useRef(false);

  const [loading, setLoading]     = useState(true);
  const [post, setPost]           = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const[errorMsg, setErrorMsg]   = useState("");
  const [toc, setToc]             = useState([]);
  const [tocOpen, setTocOpen]     = useState(true);
  const[renderedHtml, setRenderedHtml] = useState("");

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked]         = useState(false);
  const[likeLoading, setLikeLoading] = useState(false);

  const [comments, setComments]   = useState([]); // flat list
  const [commentLikes, setCommentLikes] = useState({}); // { commentId: { count, liked } }
  const [cmtName, setCmtName]     = useState("");
  const[cmtEmail, setCmtEmail]   = useState("");
  const [cmtBody, setCmtBody]     = useState("");
  const [cmtLoading, setCmtLoading] = useState(false);

  const[copied, setCopied]       = useState(false);
  const [toast, setToast]         = useState("");
  const showToast = useCallback((m) => { setToast(m); setTimeout(()=>setToast(""),2800); },[]);

  useEffect(() => {
    window.scrollTo(0,0);
    viewedRef.current = false;
    const load = async () => {
      setLoading(true); setErrorMsg("");
      const { data, error } = await supabase.from("blogs_posts").select("*")
        .is("deleted_at",null).eq("status","published").eq("slug",slug).maybeSingle();
      if (error) { setErrorMsg(error.message); setPost(null); setLoading(false); return; }
      if (!data) { setPost(null); setLoading(false); return; }
      setPost(data);

      const rawHtml = getRenderedHtml(data);
      const { toc:tocItems, html:processedHtml } = buildTOC(rawHtml);
      setToc(tocItems); setRenderedHtml(processedHtml);

      // Related
      const { data:rel } = await supabase.from("blogs_posts")
        .select("id,title,slug,cover_image_url,published_at")
        .is("deleted_at",null).eq("status","published").neq("slug",slug).limit(4);
      if (rel) setRelatedPosts(rel);

      // Post likes
      const { count } = await supabase.from("blogs_likes")
        .select("*",{count:"exact",head:true}).eq("post_id",data.id);
      setLikeCount(count||0);
      const { data:myLike } = await supabase.from("blogs_likes")
        .select("id").eq("post_id",data.id).eq("fingerprint",fp).maybeSingle();
      setLiked(!!myLike);

      // Comments
      const { data:cmts } = await supabase.from("blogs_comments")
        .select("*").eq("post_id",data.id).order("created_at",{ascending:true});
      if (cmts) {
        setComments(cmts);
        await loadCommentLikes(cmts);
      }

      setLoading(false);

      // Increment view count once
      if (!viewedRef.current) {
        viewedRef.current = true;
        supabase.rpc("blogs_increment_view",{ p_post_id:data.id });
      }
    };
    load();
  }, [slug]);

  const loadCommentLikes = async (cmts) => {
    if (!cmts?.length) return;
    const ids = cmts.map(c => c.id);
    // Get all likes for these comments
    const { data } = await supabase.from("blogs_comment_likes")
      .select("comment_id,fingerprint").in("comment_id",ids);
    if (!data) return;
    const map = {};
    ids.forEach(id => { map[id] = { count:0, liked:false }; });
    data.forEach(l => {
      if (!map[l.comment_id]) map[l.comment_id] = { count:0, liked:false };
      map[l.comment_id].count++;
      if (l.fingerprint === fp) map[l.comment_id].liked = true;
    });
    setCommentLikes(map);
  };

  const handleLike = async () => {
    if (!post || likeLoading) return;
    setLikeLoading(true);
    const { data, error } = await supabase.rpc("blogs_toggle_like",{ p_post_id:post.id, p_fingerprint:fp });
    if (!error && data?.ok) { setLiked(data.liked); setLikeCount(data.count); }
    setLikeLoading(false);
  };

  const handleComment = async () => {
    if (!post||cmtLoading) return;
    setCmtLoading(true);
    const { data, error } = await supabase.rpc("blogs_add_comment",{
      p_post_id:post.id, p_author_name:cmtName,
      p_author_email:cmtEmail, p_body:cmtBody, p_fingerprint:fp, p_parent_id:null,
    });
    if (error||!data?.ok) showToast(data?.error||error?.message||"Failed to post");
    else {
      const newCmt = { id:data.id, post_id:post.id, author_name:cmtName, body:cmtBody,
        fingerprint:fp, created_at:new Date().toISOString(), edited_at:null,
        parent_id:null, is_pinned:false, is_flagged:false };
      setComments(prev => [...prev, newCmt]);
      setCommentLikes(prev => ({ ...prev, [data.id]:{ count:0, liked:false } }));
      setCmtName(""); setCmtEmail(""); setCmtBody("");
      showToast("Comment posted! 🎉");
    }
    setCmtLoading(false);
  };

  const handleReply = async ({ parentId, name, body }) => {
    if (!post) return;
    const { data, error } = await supabase.rpc("blogs_add_comment",{
      p_post_id:post.id, p_author_name:name, p_author_email:"", p_body:body,
      p_fingerprint:fp, p_parent_id:parentId,
    });
    if (error||!data?.ok) { showToast(data?.error||error?.message||"Failed"); return; }
    const newCmt = { id:data.id, post_id:post.id, author_name:name, body, fingerprint:fp,
      created_at:new Date().toISOString(), edited_at:null,
      parent_id:parentId, is_pinned:false, is_flagged:false };
    setComments(prev => [...prev, newCmt]);
    setCommentLikes(prev => ({ ...prev,[data.id]:{ count:0, liked:false } }));
    showToast("Reply posted! 💬");
  };

  const handleDeleteComment = async (id) => {
    const { error } = await supabase.from("blogs_comments").delete().eq("id",id).eq("fingerprint",fp);
    if (error) { showToast("Could not delete comment"); return; }
    // Remove comment and all its descendants
    const removeIds = new Set();
    const collectIds = (cid) => {
      removeIds.add(cid);
      comments.filter(c => c.parent_id===cid).forEach(c => collectIds(c.id));
    };
    collectIds(id);
    setComments(prev => prev.filter(c => !removeIds.has(c.id)));
    showToast("Comment deleted");
  };

  const handleEditComment = async (id, newBody) => {
    const { error } = await supabase.from("blogs_comments")
      .update({ body:newBody, edited_at:new Date().toISOString() }).eq("id",id).eq("fingerprint",fp);
    if (error) { showToast("Could not update"); return; }
    setComments(prev => prev.map(c => c.id===id ? { ...c, body:newBody, edited_at:new Date().toISOString() } : c));
    showToast("Comment updated ✅");
  };

  const handleLikeComment = async (commentId) => {
    const { data, error } = await supabase.rpc("blogs_toggle_comment_like",{ p_comment_id:commentId, p_fingerprint:fp });
    if (!error && data?.ok) {
      setCommentLikes(prev => ({ ...prev,[commentId]:{ count:data.count, liked:data.liked } }));
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = post?.title || "Check this out";
    if (platform==="wa") window.open(`https://wa.me/?text=${encodeURIComponent(text+" "+url)}`,"_blank");
    else if (platform==="tw") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,"_blank");
    else { navigator.clipboard.writeText(url).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); showToast("Link copied! 📋"); }); }
  };

  const handleDownload = async () => {
    if (!post?.cover_image_url) return;
    try {
      const res = await fetch(post.cover_image_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url; a.download=`${post.slug||"cover"}.jpg`; a.click();
      URL.revokeObjectURL(url);
      showToast("Downloading image... 📥");
    } catch { showToast("Download failed"); }
  };

  const urduTitle = post && isUrdu(post.title);
  const commentTree = buildTree(comments);
  const totalComments = comments.length;

  // Canonical URL – adjust as needed
  const canonicalUrl = post?.canonical_url || `https://aidla.online/blogs/${slug}`;

  // JSON-LD structured data
  const structuredData = post ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || "",
    "image": post.cover_image_url ? [post.cover_image_url] : undefined,
    "author": { "@type": "Person", "name": post.author_name || "AIDLA Team" },
    "publisher": { "@type": "Organization", "name": "AIDLA", "url": "https://aidla.online" },
    "datePublished": post.published_at,
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
    "keywords": post.tags?.join(", ")
  } : null;

  return (
    <>
      <Helmet>
        <title>{post?.meta_title || post?.title || "AIDLA Insights"}</title>
        <meta name="description" content={post?.meta_description || post?.excerpt || ""} />
        <meta name="keywords" content={post?.tags?.join(", ") || ""} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={post?.title} />
        <meta property="og:description" content={post?.excerpt || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        {post?.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <meta property="og:site_name" content="AIDLA" />
        <meta property="article:published_time" content={post?.published_at} />
        <meta property="article:author" content={post?.author_name || "AIDLA Team"} />
        {post?.tags?.map(tag => <meta property="article:tag" content={tag} key={tag} />)}

        {/* Twitter Card */}
        <meta name="twitter:card" content={post?.cover_image_url ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={post?.title} />
        <meta name="twitter:description" content={post?.excerpt || ""} />
        {post?.cover_image_url && <meta name="twitter:image" content={post.cover_image_url} />}

        {/* Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      <div className="blogpost-root">
        <div className="bp-progress-bar" style={{width:`${progress}%`}}/>

        <AnimatePresence>
          {toast && (
            <motion.div className="bp-toast"
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}} transition={{duration:0.25}}
            >{toast}</motion.div>
          )}
        </AnimatePresence>

        <div className="bp-orbs"><div className="bp-orb-1"/><div className="bp-orb-2"/><div className="bp-orb-3"/></div>

        <div className="blogpost-container">
          <motion.div {...fadeUp}><Link to="/blogs" className="bp-back">‹ All Insights</Link></motion.div>

          {errorMsg && <motion.div className="bp-error" {...fadeUp}><span>⚠️</span>{errorMsg}</motion.div>}

          {/* Skeleton */}
          {loading && (
            <motion.div className="bp-article-card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
              <div className="bp-skeleton-cover"/>
              <div className="bp-body">
                {[80,90,60,100,100,78,100,95,82].map((w,i)=>(
                  <div key={i} className="skel-bg" style={{height:i<2?22:13,width:`${w}%`,marginBottom:i===1?22:8}}/>
                ))}
              </div>
            </motion.div>
          )}

          {/* Not found */}
          {!loading && !post && !errorMsg && (
            <motion.div className="bp-not-found" {...fadeUp}>
              <span style={{fontSize:"2.5rem",display:"block"}}>📭</span>
              <h2>Insight Not Found</h2>
              <p>This article may have been moved or unpublished.</p>
              <Link to="/blogs" className="bp-back-btn">‹ Back to Insights</Link>
            </motion.div>
          )}

          {/* Article */}
          {post && (
            <motion.div className="bp-article-card" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.55}}>

              {/* Cover */}
              <div className="bp-cover-wrap">
                {post.cover_image_url
                  ? <img src={post.cover_image_url} alt={post.title} loading="lazy"/>
                  : <div className="bp-cover-placeholder">📰</div>
                }
                {post.cover_image_url && (
                  <button className="bp-cover-download" onClick={handleDownload}>⬇ Download Image</button>
                )}
              </div>

              {/* Body */}
              <div className="bp-body">
                <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:6,marginBottom:8}}>
                  <span className="bp-label">AIDLA Insights</span>
                  {(post.content_html||post.content) && (
                    <span className="bp-readtime-badge">⏱ {estimateReadTime(post.content_html||post.content)}</span>
                  )}
                </div>

                <h1 className={`bp-title${urduTitle?" urdu":""}`}>{post.title}</h1>

                <div className="bp-meta">
                  <div className="bp-author"><span className="bp-author-icon">✍️</span>{post.author_name||"AIDLA Team"}</div>
                  <span className="bp-dot"/>
                  <span className="bp-date-pill">{formatDate(post.published_at)}</span>
                  <span className="bp-dot"/>
                  <span className="bp-read-time">👁 {(post.view_count||0).toLocaleString()} views</span>
                  <span className="bp-dot"/>
                  <span className="bp-read-time">❤️ {likeCount} {likeCount===1?"like":"likes"}</span>
                </div>

                {post.tags?.length > 0 && (
                  <div className="bp-tags">{post.tags.map(t=><span key={t} className="bp-tag"># {t}</span>)}</div>
                )}

                {post.excerpt && <p className="bp-excerpt">{post.excerpt}</p>}

                {toc.length > 1 && (
                  <div className="bp-toc">
                    <div className="bp-toc-title" onClick={()=>setTocOpen(v=>!v)}>
                      📋 Table of Contents <span style={{marginLeft:"auto",fontSize:"0.8em"}}>{tocOpen?"▲":"▼"}</span>
                    </div>
                    {tocOpen && (
                      <ul className="bp-toc-list">
                        {toc.map(item=>(
                          <li key={item.id} className={`bp-toc-item ${item.tag}`}>
                            <a href={`#${item.id}`} onClick={e=>{e.preventDefault();document.getElementById(item.id)?.scrollIntoView({behavior:"smooth",block:"start"});}}>
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <div className="bp-divider"/>
                <div className="bp-content" dir={urduTitle?"rtl":"ltr"} dangerouslySetInnerHTML={{__html:renderedHtml}}/>

                {relatedPosts.length > 0 && (
                  <div className="bp-related-section">
                    <h3 className="bp-related-title">You might also like...</h3>
                    <div className="bp-related-grid">
                      {relatedPosts.map(rp=>(
                        <Link to={`/blogs/${rp.slug}`} key={rp.id} className="bp-related-card">
                          <div className="bp-related-img">
                            {rp.cover_image_url?<img src={rp.cover_image_url} alt={rp.title} loading="lazy"/>:<span>📰</span>}
                          </div>
                          <div className="bp-related-text">
                            <h4>{rp.title}</h4><span>{formatDate(rp.published_at)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Engagement Bar */}
              <div className="bp-engage">
                <span className="bp-engage-label">React & Share</span>
                <button className={`bp-like-btn${liked?" liked":""}`} onClick={handleLike} disabled={likeLoading}>
                  <span className="heart">{liked?"❤️":"🤍"}</span>
                  {likeCount} {likeCount===1?"Like":"Likes"}
                </button>
                <div className="bp-share-group">
                  <button className="bp-share-btn bp-share-wa" onClick={()=>handleShare("wa")}>💬 WhatsApp</button>
                  <button className="bp-share-btn bp-share-tw" onClick={()=>handleShare("tw")}>𝕏 Twitter</button>
                  <button className={`bp-share-btn bp-share-copy${copied?" copied":""}`} onClick={()=>handleShare("copy")}>
                    {copied?"✅ Copied!":"🔗 Copy Link"}
                  </button>
                </div>
              </div>

              {/* Comments */}
              <div className="bp-comments-section">
                <h3 className="bp-comments-title">
                  💬 Comments <span className="bp-comment-count">{totalComments}</span>
                </h3>

                {/* Post form */}
                <div className="bp-comment-form">
                  <div className="bp-comment-form-title">✍️ Leave a Comment</div>
                  <div className="bp-form-row">
                    <input className="bp-form-input" placeholder="Your name *" value={cmtName} onChange={e=>setCmtName(e.target.value)}/>
                    <input className="bp-form-input" placeholder="Email (optional)" type="email" value={cmtEmail} onChange={e=>setCmtEmail(e.target.value)}/>
                  </div>
                  <textarea className="bp-form-textarea" placeholder="Write your comment…" value={cmtBody} onChange={e=>setCmtBody(e.target.value)}/>
                  <button className="bp-comment-submit" onClick={handleComment} disabled={cmtLoading||!cmtName.trim()||!cmtBody.trim()}>
                    {cmtLoading?"Posting…":"Post Comment →"}
                  </button>
                </div>

                {/* Threaded comments */}
                {totalComments === 0
                  ? <div className="bp-no-comments">No comments yet. Be the first! 💭</div>
                  : (
                    <div className="bp-comment-list">
                      {commentTree.map(node=>(
                        <div key={node.id} className="bp-comment-thread">
                          <CommentNode
                            node={node} fp={fp} depth={0}
                            onDelete={handleDeleteComment}
                            onEdit={handleEditComment}
                            onReply={handleReply}
                            onLikeComment={handleLikeComment}
                            commentLikes={commentLikes}
                            postId={post.id}
                          />
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>

              {/* Footer CTA */}
              <div className="bp-footer-cta">
                <span className="bp-footer-cta-text">Thanks for reading ✨</span>
                <Link to="/blogs" className="bp-back-btn">‹ More Insights</Link>
              </div>
            </motion.div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}