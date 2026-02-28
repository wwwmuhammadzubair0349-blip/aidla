import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

function slugify(str) {
  return String(str || "")
    .toLowerCase().trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const statusColors = {
  draft:     { bg: "rgba(100,116,139,0.1)", color: "#475569", border: "rgba(100,116,139,0.2)" },
  published: { bg: "rgba(22,163,74,0.1)",   color: "#15803d", border: "rgba(22,163,74,0.25)" },
};

export default function News() {
  const [loading, setLoading]           = useState(true);
  const [msg, setMsg]                   = useState("");
  const [msgType, setMsgType]           = useState("info");
  const [posts, setPosts]               = useState([]);
  const [editing, setEditing]           = useState(null);
  const [title, setTitle]               = useState("");
  const [authorName, setAuthorName]     = useState("");
  const [slug, setSlug]                 = useState("");
  const [excerpt, setExcerpt]           = useState("");
  const [content, setContent]           = useState("");
  const [status, setStatus]             = useState("draft");
  const [metaTitle, setMetaTitle]       = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [coverUrl, setCoverUrl]         = useState("");
  const [coverPath, setCoverPath]       = useState("");
  const [uploading, setUploading]       = useState(false);

  const showMsg = (text, type = "info") => { setMsg(text); setMsgType(type); };

  const resetForm = () => {
    setEditing(null);
setTitle(""); setAuthorName(""); setSlug(""); setExcerpt(""); setContent("");
    setStatus("draft"); setMetaTitle(""); setMetaDescription("");
    setCanonicalUrl(""); setCoverUrl(""); setCoverPath("");
    showMsg("", "info");
  };

  const load = async () => {
    setLoading(true); showMsg("", "info");
    const { data, error } = await supabase
      .from("news_posts")
      .select("id,title,slug,status,excerpt,cover_image_url,published_at,updated_at,deleted_at")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });
    if (error) { showMsg(error.message, "error"); setPosts([]); setLoading(false); return; }
    setPosts(data || []); setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (editing) return; setSlug(slugify(title)); }, [title, editing]);

  const onPickEdit = async (row) => {
    showMsg("", "info");
    const { data, error } = await supabase.from("news_posts").select("*").eq("id", row.id).maybeSingle();
    if (error) return showMsg(error.message, "error");
    if (!data)  return showMsg("News post not found", "error");
    setEditing(data);
setTitle(data.title || ""); setAuthorName(data.author_name || ""); setSlug(data.slug || ""); setExcerpt(data.excerpt || "");
    setContent(data.content || ""); setStatus(data.status || "draft");
    setMetaTitle(data.meta_title || ""); setMetaDescription(data.meta_description || "");
    setCanonicalUrl(data.canonical_url || ""); setCoverUrl(data.cover_image_url || "");
    setCoverPath(data.cover_image_path || "");
  };

  const onDelete = async (row) => {
    if (!confirm("Delete this news post?")) return;
    showMsg("", "info");
    const { data, error } = await supabase.rpc("news_admin_delete_post", { p_id: row.id });
    if (error) return showMsg(error.message, "error");
    if (!data?.ok) return showMsg(data?.error || "Delete failed", "error");
    resetForm(); await load(); showMsg("Deleted ✅", "success");
  };

  const onSave = async () => {
    showMsg("", "info");
    if (!title.trim())   return showMsg("Title required", "error");
    if (!slug.trim())    return showMsg("Slug required", "error");
    if (!content.trim()) return showMsg("Content required", "error");
const payload = {
  p_id: editing?.id || null,
  p_title: title.trim(),
  p_author_name: authorName.trim(),
  p_slug: slugify(slug),
  p_excerpt: excerpt.trim(),
  p_content: content,
  p_cover_image_url: coverUrl || "",
  p_cover_image_path: coverPath || "",
  p_status: status,
  p_meta_title: metaTitle.trim(),
  p_meta_description: metaDescription.trim(),
  p_canonical_url: canonicalUrl.trim(),
};
    const { data, error } = await supabase.rpc("news_admin_upsert_post", payload);
    if (error) return showMsg(error.message, "error");
    if (!data?.ok) return showMsg(data?.error || "Save failed", "error");
    await load(); showMsg(editing ? "Updated ✅" : "Created ✅", "success"); resetForm();
  };

  const onUploadCover = async (file) => {
    showMsg("", "info"); if (!file) return; setUploading(true);
    try {
      const { data: auth, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr; if (!auth?.user) throw new Error("Not logged in");
      const uid = auth.user.id;
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const safeExt = ["jpg","jpeg","png","webp"].includes(ext) ? ext : "jpg";
      const filePath = `covers/${uid}/${Date.now()}.${safeExt}`;
      const { error: upErr } = await supabase.storage.from("news").upload(filePath, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pubData } = supabase.storage.from("news").getPublicUrl(filePath);
      if (!pubData?.publicUrl) throw new Error("Public URL not generated");
      setCoverPath(filePath); setCoverUrl(pubData.publicUrl);
      showMsg("Image uploaded ✅  Now click Save to publish.", "success");
    } catch (e) { showMsg("Upload failed: " + (e?.message || String(e)), "error"); }
    finally { setUploading(false); }
  };

  const previewUrl = useMemo(() => { const s = slugify(slug); return s ? `/news/${s}` : ""; }, [slug]);
  const sc = statusColors[status] || statusColors.draft;

  return (
    <div style={{ padding: 16, maxWidth: 1300, margin: "0 auto" }}>
      <style>{css}</style>

      <div className="an-header">
        <div className="an-header-icon">📰</div>
        <div>
          <h1 className="an-title">News Management</h1>
          <div className="an-sub">Create, edit and publish news articles</div>
        </div>
      </div>

      {msg && (
        <div className={`an-msg an-msg-${msgType}`}>
          <span>{msg}</span>
          <button className="an-msg-close" onClick={() => setMsg("")}>×</button>
        </div>
      )}

      <div className="an-grid">
        {/* LEFT: LIST */}
        <div className="an-card an-list-card">
          <div className="an-list-header">
            <span className="an-card-title">All Articles <span className="an-count">{posts.length}</span></span>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={load} className="an-btn an-btn-ghost" title="Refresh">↻</button>
              <button onClick={resetForm} className="an-btn an-btn-primary">+ New Article</button>
            </div>
          </div>

          {loading ? (
            <div className="an-loading"><div className="an-spinner" /> Loading…</div>
          ) : posts.length === 0 ? (
            <div className="an-empty">No news articles yet.<br />Create one!</div>
          ) : (
            <div className="an-list-scroll">
              {posts.map(p => {
                const psc = statusColors[p.status] || statusColors.draft;
                return (
                  <div key={p.id} className={`an-post-item ${editing?.id === p.id ? "an-post-item-active" : ""}`} onClick={() => onPickEdit(p)}>
                    {p.cover_image_url && <div className="an-post-thumb"><img src={p.cover_image_url} alt="" /></div>}
                    <div className="an-post-body">
                      <div className="an-post-top">
                        <span className="an-post-name">{p.title}</span>
                        <span className="an-status-pill" style={{ background:psc.bg, color:psc.color, border:`1px solid ${psc.border}` }}>{p.status}</span>
                      </div>
                      <div className="an-post-slug">/news/{p.slug}</div>
                      {p.excerpt && <div className="an-post-excerpt">{p.excerpt}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: EDITOR */}
        <div className="an-card an-editor-card">
          <div className="an-editor-header">
            <div>
              <div className="an-card-title">{editing ? "Edit Article" : "New Article"}</div>
              {editing && <div className="an-id-badge">ID: {editing.id}</div>}
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {editing && <button className="an-btn an-btn-danger" onClick={() => onDelete(editing)}>🗑 Delete</button>}
              <button className="an-btn an-btn-save" onClick={onSave} disabled={uploading}>💾 {editing ? "Update" : "Create"}</button>
            </div>
          </div>

          <div className="an-form">
            <div className="an-section-title">📝 Basic Info</div>
            <div className="an-grid2">
<div className="an-field">
  <label className="an-label">Title *</label>
  <input
    className="an-input"
    value={title}
    onChange={e => setTitle(e.target.value)}
    placeholder="Enter article title…"
  />
</div>

<div className="an-field">
  <label className="an-label">Author Name <span className="an-label-opt">(optional)</span></label>
  <input
    className="an-input"
    value={authorName}
    onChange={e => setAuthorName(e.target.value)}
    placeholder="e.g., Muhammad Zubair Afridi"
  />
</div>
              <div className="an-field">
                <label className="an-label">Slug (SEO URL)</label>
                <input className="an-input" value={slug} onChange={e => setSlug(e.target.value)} />
                {previewUrl && <div className="an-hint">Preview: <strong>{previewUrl}</strong></div>}
              </div>
              <div className="an-field">
                <label className="an-label">Status</label>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <select className="an-input" value={status} onChange={e => setStatus(e.target.value)} style={{ flex:1 }}>
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                  </select>
                  <span className="an-status-pill" style={{ background:sc.bg, color:sc.color, border:`1px solid ${sc.border}`, flexShrink:0 }}>{status}</span>
                </div>
              </div>
              <div className="an-field an-col-2">
                <label className="an-label">Excerpt <span className="an-label-opt">(short preview)</span></label>
                <textarea className="an-input an-textarea" value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} placeholder="Brief summary shown in listings…" />
              </div>
              <div className="an-field an-col-2">
                <label className="an-label">Content *</label>
                <textarea className="an-input an-textarea" value={content} onChange={e => setContent(e.target.value)} rows={12} placeholder="Full article content…" />
              </div>
            </div>

            <div className="an-section-title" style={{ marginTop:20 }}>🔍 SEO Settings</div>
            <div className="an-grid2">
              <div className="an-field">
                <label className="an-label">Meta Title <span className="an-label-opt">(optional)</span></label>
                <input className="an-input" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Defaults to article title" />
              </div>
              <div className="an-field">
                <label className="an-label">Meta Description <span className="an-label-opt">(optional)</span></label>
                <input className="an-input" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder="Defaults to excerpt" />
              </div>
              <div className="an-field an-col-2">
                <label className="an-label">Canonical URL <span className="an-label-opt">(optional)</span></label>
                <input className="an-input" value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)} placeholder="https://…" />
              </div>
            </div>

            <div className="an-section-title" style={{ marginTop:20 }}>🖼 Cover Image</div>
            <div className="an-cover-zone">
              {coverUrl ? (
                <div className="an-cover-preview">
                  <img src={coverUrl} alt="cover" />
                  <div className="an-cover-actions">
                    <label className="an-btn an-btn-ghost" style={{ cursor:"pointer" }}>
                      ↑ Replace
                      <input type="file" accept="image/*" disabled={uploading} style={{ display:"none" }} onChange={e => onUploadCover(e.target.files?.[0])} />
                    </label>
                    <button className="an-btn an-btn-danger" onClick={() => { setCoverUrl(""); setCoverPath(""); }}>✕ Remove</button>
                  </div>
                </div>
              ) : (
                <label className={`an-upload-area ${uploading ? "an-upload-area-busy" : ""}`}>
                  <div className="an-upload-icon">📷</div>
                  <div className="an-upload-text">{uploading ? "Uploading…" : "Click to upload cover image"}</div>
                  <div className="an-upload-hint">JPG, PNG, WebP supported</div>
                  <input type="file" accept="image/*" disabled={uploading} style={{ display:"none" }} onChange={e => onUploadCover(e.target.files?.[0])} />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
  .an-header{display:flex;align-items:center;gap:10px;margin-bottom:16px;padding:8px 0 4px;animation:anIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards}
  @keyframes anIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}
  .an-header-icon{font-size:clamp(24px,4vw,34px)}
  .an-title{font-size:clamp(1.2rem,3vw,1.7rem);font-weight:900;letter-spacing:-0.5px;margin:0;background:linear-gradient(135deg,#d97706,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .an-sub{color:#64748b;font-size:0.72rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase}
  .an-msg{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:12px;font-size:0.85rem;font-weight:600;margin-bottom:12px;animation:anMsgIn 0.3s ease}
  @keyframes anMsgIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
  .an-msg-info{background:rgba(217,119,6,0.07);border:1px solid rgba(217,119,6,0.2);color:#d97706}
  .an-msg-success{background:rgba(22,163,74,0.08);border:1px solid rgba(22,163,74,0.25);color:#15803d}
  .an-msg-error{background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);color:#dc2626}
  .an-msg-close{background:none;border:none;font-size:18px;cursor:pointer;color:#64748b;padding:0 0 0 8px;font-weight:700;line-height:1}
  .an-grid{display:grid;grid-template-columns:300px 1fr;gap:14px;align-items:start}
  @media(max-width:800px){.an-grid{grid-template-columns:1fr}}
  .an-card{background:rgba(255,255,255,0.88);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.9);border-radius:16px;padding:16px;box-shadow:10px 10px 36px rgba(15,23,42,0.07),-6px -6px 24px rgba(255,255,255,0.8),inset 0 0 0 1px rgba(255,255,255,0.5);animation:anCardIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0}
  @keyframes anCardIn{to{opacity:1}}
  .an-list-card{position:sticky;top:12px}
  .an-editor-card{min-width:0}
  .an-card-title{font-weight:800;font-size:0.85rem;letter-spacing:0.5px;color:#334155;display:flex;align-items:center;gap:6px}
  .an-count{display:inline-flex;padding:1px 7px;border-radius:100px;font-size:10px;font-weight:700;background:rgba(217,119,6,0.1);color:#d97706;border:1px solid rgba(217,119,6,0.2)}
  .an-id-badge{font-size:10px;color:#64748b;margin-top:3px;font-family:monospace}
  .an-list-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
  .an-list-scroll{display:flex;flex-direction:column;gap:8px;max-height:74vh;overflow-y:auto;padding-right:2px}
  .an-list-scroll::-webkit-scrollbar{width:4px}
  .an-list-scroll::-webkit-scrollbar-thumb{background:rgba(217,119,6,0.3);border-radius:100px}
  .an-post-item{border-radius:12px;border:1px solid rgba(217,119,6,0.1);background:#fff;overflow:hidden;cursor:pointer;transition:all 0.15s;box-shadow:2px 2px 6px rgba(15,23,42,0.04)}
  .an-post-item:hover{border-color:rgba(217,119,6,0.3);transform:translateX(2px)}
  .an-post-item-active{background:linear-gradient(135deg,rgba(217,119,6,0.05),rgba(245,158,11,0.08))!important;border-color:rgba(217,119,6,0.35)!important;box-shadow:0 0 14px rgba(217,119,6,0.12)!important}
  .an-post-thumb{height:72px;overflow:hidden}
  .an-post-thumb img{width:100%;height:100%;object-fit:cover;display:block}
  .an-post-body{padding:10px 12px}
  .an-post-top{display:flex;justify-content:space-between;align-items:flex-start;gap:6px;margin-bottom:3px}
  .an-post-name{font-weight:800;font-size:0.84rem;color:#0f172a;word-break:break-word;line-height:1.3}
  .an-post-slug{font-size:10px;color:#64748b;font-weight:600;margin-bottom:3px;font-family:monospace}
  .an-post-excerpt{font-size:11px;color:#94a3b8;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-top:3px}
  .an-status-pill{padding:2px 8px;border-radius:100px;font-size:10px;font-weight:700;white-space:nowrap}
  .an-editor-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;gap:10px}
  .an-section-title{font-size:0.72rem;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;color:#64748b;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(217,119,6,0.07);display:flex;align-items:center;gap:8px}
  .an-grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}
  .an-col-2{grid-column:1 / -1}
  .an-field{display:flex;flex-direction:column}
  .an-label{font-size:11px;font-weight:700;color:#64748b;margin-bottom:5px;letter-spacing:0.3px}
  .an-label-opt{font-weight:400;opacity:0.7}
  .an-hint{font-size:11px;color:#64748b;margin-top:4px}
  .an-hint strong{color:#d97706}
  .an-input{padding:9px 12px;border-radius:10px;border:1px solid rgba(217,119,6,0.15);background:#fff;font-size:0.85rem;color:#0f172a;width:100%;box-sizing:border-box;transition:border-color 0.15s,box-shadow 0.15s;outline:none;font-family:inherit}
  .an-input:focus{border-color:rgba(217,119,6,0.45);box-shadow:0 0 0 3px rgba(217,119,6,0.08)}
  .an-textarea{resize:vertical;min-height:60px;line-height:1.6}
  .an-btn{padding:9px 16px;border-radius:10px;border:none;font-size:0.83rem;font-weight:700;cursor:pointer;transition:all 0.15s;white-space:nowrap;display:inline-flex;align-items:center;gap:4px}
  .an-btn-primary{background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;box-shadow:0 3px 0 #b45309}
  .an-btn-primary:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px)}
  .an-btn-save{background:linear-gradient(135deg,#0f766e,#14b8a6);color:#fff;box-shadow:0 3px 0 #0f766e}
  .an-btn-save:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px)}
  .an-btn-save:disabled{background:#e2e8f0;color:#94a3b8;box-shadow:none;cursor:not-allowed}
  .an-btn-danger{background:rgba(239,68,68,0.08);color:#dc2626;border:1px solid rgba(239,68,68,0.2)}
  .an-btn-danger:hover{background:rgba(239,68,68,0.14)}
  .an-btn-ghost{background:rgba(100,116,139,0.08);color:#475569;border:1px solid rgba(100,116,139,0.2)}
  .an-btn-ghost:hover{background:rgba(100,116,139,0.14)}
  .an-cover-zone{margin-top:4px}
  .an-upload-area{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:32px 20px;border:2px dashed rgba(217,119,6,0.25);border-radius:14px;cursor:pointer;transition:all 0.2s;background:rgba(217,119,6,0.02);width:100%;box-sizing:border-box}
  .an-upload-area:hover{border-color:rgba(217,119,6,0.5);background:rgba(217,119,6,0.05)}
  .an-upload-area-busy{opacity:0.6;cursor:wait}
  .an-upload-icon{font-size:28px}
  .an-upload-text{font-weight:700;font-size:0.85rem;color:#334155}
  .an-upload-hint{font-size:11px;color:#94a3b8}
  .an-cover-preview{border-radius:14px;overflow:hidden;border:1px solid rgba(217,119,6,0.15)}
  .an-cover-preview img{width:100%;max-height:280px;object-fit:cover;display:block}
  .an-cover-actions{display:flex;gap:8px;padding:10px 12px;background:rgba(248,250,252,0.9)}
  .an-loading{display:flex;align-items:center;gap:8px;padding:20px;color:#64748b;font-size:0.85rem;font-weight:600;justify-content:center}
  .an-spinner{width:18px;height:18px;border:2px solid rgba(217,119,6,0.2);border-top-color:#d97706;border-radius:50%;animation:anSpin 0.7s linear infinite;flex-shrink:0}
  @keyframes anSpin{to{transform:rotate(360deg)}}
  .an-empty{color:#64748b;font-size:0.83rem;padding:20px 0;font-weight:600;text-align:center;line-height:1.8}
`;