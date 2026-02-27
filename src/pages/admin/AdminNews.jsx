import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function News() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // post object or null

  // form
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const [coverUrl, setCoverUrl] = useState("");
  const [coverPath, setCoverPath] = useState("");
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setStatus("draft");
    setMetaTitle("");
    setMetaDescription("");
    setCanonicalUrl("");
    setCoverUrl("");
    setCoverPath("");
  };

  const load = async () => {
    setLoading(true);
    setMsg("");

    const { data, error } = await supabase
      .from("news_posts")
      .select("id,title,slug,status,excerpt,cover_image_url,published_at,updated_at,deleted_at")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      setPosts([]);
      setLoading(false);
      return;
    }

    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // auto create slug from title when creating new
  useEffect(() => {
    if (editing) return;
    setSlug(slugify(title));
  }, [title, editing]);

  const onPickEdit = async (row) => {
    setMsg("");
    const { data, error } = await supabase
      .from("news_posts")
      .select("*")
      .eq("id", row.id)
      .maybeSingle();

    if (error) return setMsg(error.message);
    if (!data) return setMsg("Blog not found");

    setEditing(data);
    setTitle(data.title || "");
    setSlug(data.slug || "");
    setExcerpt(data.excerpt || "");
    setContent(data.content || "");
    setStatus(data.status || "draft");

    setMetaTitle(data.meta_title || "");
    setMetaDescription(data.meta_description || "");
    setCanonicalUrl(data.canonical_url || "");

    setCoverUrl(data.cover_image_url || "");
    setCoverPath(data.cover_image_path || "");
  };

  const onDelete = async (row) => {
    if (!confirm("Delete this blog?")) return;
    setMsg("");

    const { data, error } = await supabase.rpc("news_admin_delete_post", { p_id: row.id });
    if (error) return setMsg(error.message);
    if (!data?.ok) return setMsg(data?.error || "Delete failed");

    resetForm();
    await load();
    setMsg("Deleted ✅");
  };

  const onSave = async () => {
    setMsg("");

    if (!title.trim()) return setMsg("Title required");
    if (!slug.trim()) return setMsg("Slug required");
    if (!content.trim()) return setMsg("Content required");

    const payload = {
      p_id: editing?.id || null,
      p_title: title.trim(),
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
    if (error) return setMsg(error.message);
    if (!data?.ok) return setMsg(data?.error || "Save failed");

    await load();
    setMsg(editing ? "Updated ✅" : "Created ✅");
    resetForm();
  };

const onUploadCover = async (file) => {
  setMsg("");
  if (!file) return;

  setUploading(true);
  try {
    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr) throw authErr;
    if (!auth?.user) throw new Error("Not logged in");

    const uid = auth.user.id;

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";

    const filePath = `covers/${uid}/${Date.now()}.${safeExt}`;

    // ✅ upload
    const { data: upData, error: upErr } = await supabase.storage
      .from("news")
      .upload(filePath, file, { upsert: true });

    if (upErr) throw upErr;

    // ✅ get public url
    const { data: pubData } = supabase.storage.from("news").getPublicUrl(filePath);
    const publicUrl = pubData?.publicUrl;

    if (!publicUrl) throw new Error("Public URL not generated");

    setCoverPath(filePath);
    setCoverUrl(publicUrl);
    setMsg("Image uploaded ✅ Now click Create/Update to save blog.");
  } catch (e) {
    // ✅ You will SEE the exact reason here
    setMsg("Upload failed: " + (e?.message || String(e)));
  } finally {
    setUploading(false);
  }
};

  const previewUrl = useMemo(() => {
    const s = slugify(slug);
    if (!s) return "";
    return `/news/${s}`;
  }, [slug]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ marginTop: 0 }}>News Management</h2>
          <p style={{ color: "var(--muted)", marginTop: 4 }}>
            Add / edit / delete. Image is optional.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="btn" onClick={resetForm}>New Blog</button>
          <button className="btn" onClick={load}>Refresh</button>
        </div>
      </div>

      {msg ? (
        <div className="card" style={{ padding: 10 }}>{msg}</div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 12 }}>
        {/* LEFT: LIST */}
        <div className="card" style={{ padding: 12 }}>
          <b>All News</b>
          {loading ? <p>Loading...</p> : null}

          <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
            {posts.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: 10,
                  background: editing?.id === p.id ? "#eff6ff" : "#fff",
                  cursor: "pointer",
                }}
                onClick={() => onPickEdit(p)}
              >
                <div style={{ fontWeight: 800 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                  {p.status} • /news/{p.slug}
                </div>
              </div>
            ))}

            {!loading && posts.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>No news yet.</p>
            ) : null}
          </div>
        </div>

        {/* RIGHT: EDITOR */}
        <div className="card" style={{ padding: 12 }}>
          <b>{editing ? "Edit Blog" : "New Blog"}</b>

          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            <label>
              <div style={label}>Title</div>
              <input value={title} onChange={(e) => setTitle(e.target.value)} style={input} />
            </label>

            <label>
              <div style={label}>Slug (SEO URL)</div>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} style={input} />
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                Preview URL: <b>{previewUrl}</b>
              </div>
            </label>

            <label>
              <div style={label}>Excerpt (short preview)</div>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} style={textarea} rows={3} />
            </label>

            <label>
              <div style={label}>Content (full blog)</div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} style={textarea} rows={10} />
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <label style={{ minWidth: 180 }}>
                <div style={label}>Status</div>
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={input}>
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </label>

              <label style={{ flex: 1, minWidth: 220 }}>
                <div style={label}>Meta Title (optional)</div>
                <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} style={input} />
              </label>

              <label style={{ flex: 1, minWidth: 220 }}>
                <div style={label}>Meta Description (optional)</div>
                <input value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} style={input} />
              </label>
            </div>

            <label>
              <div style={label}>Canonical URL (optional)</div>
              <input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} style={input} />
            </label>

            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 800 }}>Cover Image (optional)</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    Upload image → shown in public blog.
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => onUploadCover(e.target.files?.[0])}
                />
              </div>

              {coverUrl ? (
                <div style={{ marginTop: 10 }}>
                  <img
                    src={coverUrl}
                    alt="cover"
                    style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 10 }}
                  />
                  <button
                    className="btn"
                    style={{ marginTop: 8, borderColor: "#fecaca", color: "#b91c1c" }}
                    onClick={() => {
                      setCoverUrl("");
                      setCoverPath("");
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 12 }}>No image uploaded.</div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
              {editing ? (
                <button
                  className="btn"
                  style={{ borderColor: "#fecaca", color: "#b91c1c" }}
                  onClick={() => onDelete(editing)}
                >
                  Delete
                </button>
              ) : null}

              <button className="btn" onClick={onSave} disabled={uploading}>
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const label = { fontSize: 12, color: "var(--muted)", marginBottom: 6 };
const input = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb" };
const textarea = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e5e7eb", resize: "vertical" };