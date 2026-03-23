// AutoBlogTab.jsx
// Drop this into your admin Blogs component as the "🤖 Auto" tab
// Import: import AutoBlogTab from "./AutoBlogTab.jsx";
// Usage:  {activeTab === "auto" && <AutoBlogTab />}
// Add tab button: <TabBtn id="auto" label="🤖 Auto" />

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase"; // adjust path if needed

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-blog`;
const CRON_SECRET  = import.meta.env.VITE_AUTO_BLOG_SECRET || "change_me_secret";

/* ─── Helpers ─── */
function formatRelativeTime(iso) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PK", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

/* ─── Stat Card ─── */
function StatCard({ icon, label, value, sub, color = "#1a3a8f" }) {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${color}22`,
      borderRadius: 14,
      padding: "14px 16px",
      flex: 1,
      minWidth: 130,
    }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: "1.4rem", fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", marginTop: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

/* ─── Preview Modal ─── */
function PreviewModal({ preview, onPublish, onDiscard, publishing }) {
  const wordCount = preview.blog.content_html
    .replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "min(780px,95vw)",
        maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div style={{ fontSize: "0.62rem", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 5 }}>
              🤖 AI Generated Preview
            </div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0b1437", lineHeight: 1.35 }}>
              {preview.blog.title}
            </h3>
          </div>
          <button onClick={onDiscard} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8", flexShrink: 0 }}>✕</button>
        </div>

        {/* Meta row */}
        <div style={{ padding: "10px 22px", background: "#f8faff", borderBottom: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[
            { icon: "📅", label: `Scheduled: ${formatDateTime(preview.blog.scheduled_for)}` },
            { icon: "📝", label: `~${wordCount} words` },
            { icon: "🏷️", label: preview.blog.tags?.slice(0,4).join(", ") },
          ].map((m, i) => (
            <span key={i} style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              {m.icon} {m.label}
            </span>
          ))}
        </div>

        {/* Cover + excerpt */}
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 14, alignItems: "flex-start" }}>
          {preview.blog.cover_image_url && (
            <img src={preview.blog.cover_image_url} alt="cover"
              style={{ width: 140, height: 80, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
          )}
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>EXCERPT</div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151", lineHeight: 1.6 }}>{preview.blog.excerpt}</p>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", marginBottom: 3 }}>META DESCRIPTION</div>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b" }}>{preview.blog.meta_description}</p>
            </div>
          </div>
        </div>

        {/* Content preview */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 22px" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", marginBottom: 10, textTransform: "uppercase", letterSpacing: "1px" }}>
            Content Preview (first 600 chars)
          </div>
          <div
            style={{ fontSize: "0.84rem", color: "#374151", lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{
              __html: preview.blog.content_html.slice(0, 900) + (preview.blog.content_html.length > 900 ? "…" : ""),
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onDiscard}
            style={{ padding: "9px 18px", border: "1px solid #e2e8f0", borderRadius: 10, background: "#f8fafc", cursor: "pointer", fontWeight: 700, fontSize: "0.82rem" }}>
            🗑 Discard
          </button>
          <button onClick={onPublish} disabled={publishing}
            style={{ padding: "9px 22px", border: "none", borderRadius: 10, background: "linear-gradient(135deg,#1a3a8f,#3b82f6)", color: "#fff", cursor: publishing ? "not-allowed" : "pointer", fontWeight: 800, fontSize: "0.82rem", opacity: publishing ? 0.7 : 1 }}>
            {publishing ? "⏳ Scheduling…" : "✅ Schedule & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Recent Auto Posts ─── */
function RecentAutoPosts({ posts, onView }) {
  if (!posts.length) return (
    <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: "0.83rem" }}>
      No auto-generated posts yet. Generate your first one! 🚀
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {posts.map(p => (
        <div key={p.id} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 14px", background: "#fff",
          border: "1px solid rgba(26,58,143,0.08)", borderRadius: 12,
          cursor: "pointer", transition: "all 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#f8faff"}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          onClick={() => onView(p)}
        >
          {p.cover_image_url && (
            <img src={p.cover_image_url} alt=""
              style={{ width: 52, height: 36, objectFit: "cover", borderRadius: 7, flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "#0b1437", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: 2 }}>
              {p.status === "scheduled" ? `🕐 Scheduled: ${formatDateTime(p.scheduled_at)}` : `✅ Published: ${formatDateTime(p.published_at)}`}
            </div>
          </div>
          <span style={{
            fontSize: "0.65rem", fontWeight: 800, padding: "2px 8px", borderRadius: 20,
            background: p.status === "published" ? "rgba(22,163,74,0.1)" : "rgba(245,158,11,0.1)",
            color: p.status === "published" ? "#15803d" : "#b45309",
            border: `1px solid ${p.status === "published" ? "rgba(22,163,74,0.2)" : "rgba(245,158,11,0.25)"}`,
            flexShrink: 0,
          }}>
            {p.status}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN AUTO BLOG TAB
════════════════════════════════════════════════════════════ */
export default function AutoBlogTab({ onEditPost }) {
  const [settings, setSettings]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [toggling, setToggling]     = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg]               = useState("");
  const [msgType, setMsgType]       = useState("info");
  const [recentPosts, setRecentPosts] = useState([]);
  const [preview, setPreview]       = useState(null);
  const [customTopic, setCustomTopic] = useState("");
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [totalAutoPosts, setTotalAutoPosts] = useState(0);

  const showMsg = useCallback((text, type = "info") => {
    setMsg(text);
    setMsgType(type);
    if (type !== "error") setTimeout(() => setMsg(""), 4000);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ data: settingsData }, { data: postsData }, { count }] = await Promise.all([
      supabase.from("auto_blog_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("blogs_posts")
        .select("id,title,slug,status,cover_image_url,published_at,scheduled_at,created_at")
        .eq("author_name", "AIDLA AI")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase.from("blogs_posts")
        .select("*", { count: "exact", head: true })
        .eq("author_name", "AIDLA AI")
        .is("deleted_at", null),
    ]);
    if (settingsData) setSettings(settingsData);
    if (postsData)    setRecentPosts(postsData);
    setTotalAutoPosts(count || 0);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Toggle ON/OFF ── */
  const handleToggle = async () => {
    if (!settings || toggling) return;
    setToggling(true);
    const newVal = !settings.enabled;
    const { error } = await supabase
      .from("auto_blog_settings")
      .update({ enabled: newVal, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) { showMsg(error.message, "error"); }
    else {
      setSettings(s => ({ ...s, enabled: newVal }));
      showMsg(newVal ? "✅ Auto-blog enabled! Posts daily at 8am Pakistan time." : "⏸ Auto-blog paused.", newVal ? "success" : "info");
    }
    setToggling(false);
  };

  /* ── Generate (preview first) ── */
  const handleGenerate = async (publish = false) => {
    setGenerating(true);
    setPreview(null);
    showMsg("", "info");

    try {
const body = {
  secret: CRON_SECRET,
  preview: !publish,
  force: true,
};
if (customTopic.trim()) body.topic = customTopic.trim();

      const res = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.ok) {
        showMsg(data.error || data.reason || "Generation failed", "error");
        return;
      }

      if (data.preview) {
        setPreview(data);
        showMsg("Preview ready — review before scheduling.", "info");
      } else {
        showMsg(`✅ Scheduled! "${data.post.title}" — publishes ${formatDateTime(data.post.scheduled_for)}`, "success");
        setCustomTopic("");
        setShowTopicInput(false);
        await loadData();
      }
    } catch (err) {
      showMsg(`Error: ${err?.message}`, "error");
    } finally {
      setGenerating(false);
    }
  };

  /* ── Publish from preview ── */
  const handlePublishPreview = async () => {
    if (!preview?.blog) return;
    setPublishing(true);
    try {
      const res = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: CRON_SECRET,
          preview: false,
          force: true,
          topic: preview.blog.title,
        }),
      });
      const data = await res.json();
      if (!data.ok) { showMsg(data.error || "Publish failed", "error"); return; }
      showMsg(`✅ Scheduled! Publishes ${formatDateTime(data.post.scheduled_for)}`, "success");
      setPreview(null);
      await loadData();
    } catch (err) {
      showMsg(`Error: ${err?.message}`, "error");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🤖</div>
        Loading auto-blog settings…
      </div>
    );
  }

  const isEnabled = settings?.enabled || false;

  return (
    <div style={{ maxWidth: 720 }}>

      {/* ── Message ── */}
      {msg && (
        <div style={{
          marginBottom: 16, padding: "11px 16px",
          borderRadius: 12, fontSize: "0.84rem", fontWeight: 600,
          background: msgType === "error" ? "rgba(239,68,68,0.08)" : msgType === "success" ? "rgba(22,163,74,0.08)" : "rgba(59,130,246,0.08)",
          color: msgType === "error" ? "#dc2626" : msgType === "success" ? "#15803d" : "#1e40af",
          border: `1px solid ${msgType === "error" ? "rgba(239,68,68,0.2)" : msgType === "success" ? "rgba(22,163,74,0.2)" : "rgba(59,130,246,0.15)"}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {msg}
          <button onClick={() => setMsg("")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, opacity: 0.5 }}>✕</button>
        </div>
      )}

      {/* ── Master Toggle ── */}
      <div style={{
        background: isEnabled
          ? "linear-gradient(135deg, #0b1437, #1a3a8f)"
          : "#fff",
        border: isEnabled ? "none" : "1.5px solid #e2e8f0",
        borderRadius: 18,
        padding: "20px 22px",
        marginBottom: 16,
        transition: "all 0.3s",
        boxShadow: isEnabled ? "0 8px 24px rgba(11,20,55,0.18)" : "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 800, color: isEnabled ? "rgba(255,255,255,0.6)" : "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 5 }}>
              AUTO-BLOG ENGINE
            </div>
            <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 800, color: isEnabled ? "#fff" : "#0b1437" }}>
              {isEnabled ? "🟢 Running — 1 post/day" : "⏸ Paused"}
            </h3>
            <p style={{ margin: 0, fontSize: "0.78rem", color: isEnabled ? "rgba(255,255,255,0.65)" : "#64748b", lineHeight: 1.5 }}>
              {isEnabled
                ? "AI researches topics, writes premium human-quality blogs & auto-schedules at optimal Pakistan time."
                : "Enable to auto-generate and publish 1 SEO-optimised blog per day at the best time for Pakistani readers."}
            </p>
          </div>

          {/* Toggle switch */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            title={isEnabled ? "Disable auto-blog" : "Enable auto-blog"}
            style={{
              position: "relative",
              width: 58, height: 30, flexShrink: 0,
              background: isEnabled ? "#22c55e" : "#cbd5e1",
              borderRadius: 99, border: "none", cursor: "pointer",
              transition: "background 0.25s",
              boxShadow: isEnabled ? "0 0 0 3px rgba(34,197,94,0.25)" : "none",
            }}
          >
            <span style={{
              position: "absolute",
              top: 3, left: isEnabled ? 30 : 3,
              width: 24, height: 24,
              background: "#fff",
              borderRadius: "50%",
              transition: "left 0.25s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12,
            }}>
              {toggling ? "⌛" : isEnabled ? "✓" : ""}
            </span>
          </button>
        </div>

        {/* Status row when enabled */}
        {isEnabled && settings?.last_run_at && (
          <div style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.12)",
            display: "flex", flexWrap: "wrap", gap: 16,
          }}>
            {[
              { label: "Last run",   value: formatRelativeTime(settings.last_run_at) },
              { label: "Last topic", value: settings.last_topic ? settings.last_topic.slice(0, 45) + (settings.last_topic.length > 45 ? "…" : "") : "—" },
              { label: "Next run",   value: "Tomorrow 8am PKT" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.9)", fontWeight: 600, marginTop: 2 }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <StatCard icon="📝" label="Total AI Posts" value={totalAutoPosts} color="#1a3a8f" />
        <StatCard icon="🕐" label="Scheduled" value={recentPosts.filter(p => p.status === "scheduled").length} color="#d97706" />
        <StatCard icon="✅" label="Published" value={recentPosts.filter(p => p.status === "published").length} color="#059669" />
        <StatCard icon="📅" label="Today's Posts" value={settings?.posts_today || 0} sub="resets midnight" color="#7c3aed" />
      </div>

      {/* ── Manual Generate ── */}
      <div style={{
        background: "#fff", border: "1px solid rgba(26,58,143,0.1)",
        borderRadius: 16, padding: "18px 20px", marginBottom: 16,
      }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1a3a8f", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>
          ⚡ Manual Generate
        </div>

        {/* Custom topic toggle */}
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setShowTopicInput(v => !v)}
            style={{
              fontSize: "0.76rem", fontWeight: 700, color: "#475569",
              background: "#f1f5f9", border: "1px solid #e2e8f0",
              borderRadius: 8, padding: "6px 12px", cursor: "pointer",
            }}
          >
            {showTopicInput ? "✕ Use auto topic" : "✏️ Enter custom topic"}
          </button>
        </div>

        {showTopicInput && (
          <div style={{ marginBottom: 12 }}>
            <input
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="e.g. MDCAT 2025 preparation guide for Pakistani students"
              style={{
                width: "100%", padding: "10px 14px",
                border: "1.5px solid rgba(26,58,143,0.2)", borderRadius: 10,
                fontSize: "0.88rem", color: "#0b1437", outline: "none",
                fontFamily: "inherit", boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(26,58,143,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(26,58,143,0.2)"}
            />
            <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: 4 }}>
              Leave empty to let AI pick the best trending topic automatically.
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {/* Preview first */}
          <button
            onClick={() => handleGenerate(false)}
            disabled={generating}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "#fff", border: "none", borderRadius: 10,
              fontWeight: 800, fontSize: "0.84rem", cursor: generating ? "not-allowed" : "pointer",
              opacity: generating ? 0.7 : 1, display: "flex", alignItems: "center", gap: 7,
              transition: "all 0.2s",
            }}
          >
            {generating ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⚙️</span>
                Generating…
              </>
            ) : "🔍 Preview First"}
          </button>

          {/* Generate & schedule immediately */}
          <button
            onClick={() => handleGenerate(true)}
            disabled={generating}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #059669, #10b981)",
              color: "#fff", border: "none", borderRadius: 10,
              fontWeight: 800, fontSize: "0.84rem", cursor: generating ? "not-allowed" : "pointer",
              opacity: generating ? 0.7 : 1,
            }}
          >
            ⚡ Generate & Schedule
          </button>
        </div>

        {generating && (
          <div style={{
            marginTop: 14, padding: "12px 16px",
            background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)",
            borderRadius: 10, fontSize: "0.8rem", color: "#6d28d9",
          }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>🤖 AI is working…</div>
            <div style={{ color: "#7c3aed", opacity: 0.8 }}>
              Researching topic → Finding optimal publish time → Writing 2000+ word blog → Fetching cover image → Scheduling
            </div>
            <div style={{ marginTop: 8, height: 3, background: "#e9d5ff", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: "100%",
                background: "linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
                borderRadius: 99,
              }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Recent AI Posts ── */}
      <div style={{
        background: "#fff", border: "1px solid rgba(26,58,143,0.1)",
        borderRadius: 16, padding: "18px 20px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1a3a8f", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            📋 Recent AI Posts
          </div>
          <button onClick={loadData} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>↻ Refresh</button>
        </div>
        <RecentAutoPosts posts={recentPosts} onView={p => onEditPost?.(p)} />
      </div>

      {/* ── How it works ── */}
      <div style={{
        marginTop: 16,
        background: "rgba(245,158,11,0.04)",
        border: "1px solid rgba(245,158,11,0.15)",
        borderRadius: 14, padding: "14px 18px",
      }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#92400e", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }}>
          ⚙️ How it works
        </div>
        {[
          ["🔍", "Topic research", "AI picks from 28 rotating Pakistani education topics, avoiding repeats from last 30 days"],
          ["⏰", "Smart scheduling", "Publish time chosen based on topic (exams → 8am PKT, career → 1pm PKT, lifestyle → 8pm PKT)"],
          ["✍️", "Human-quality writing", "2000+ word blogs with storytelling, real data, Urdu phrases, Pakistani cultural context — zero AI smell"],
          ["🖼️", "Auto cover image", "Relevant photo from Unsplash auto-selected based on topic keywords"],
          ["📈", "SEO optimised", "Meta title, description, structured H2/H3 headings, internal linking hints, keyword density"],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <div>
              <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#0b1437" }}>{title} — </span>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{desc}</span>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, fontSize: "0.72rem", color: "#dc2626", fontWeight: 600 }}>
          ⚠️ Requires <code>AUTO_BLOG_SECRET</code> in both your <code>.env</code> and Supabase Edge Function secrets. Cron schedule: <code>0 3 * * *</code> (3am UTC = 8am PKT)
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes spin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      {/* ── Preview Modal ── */}
      {preview && (
        <PreviewModal
          preview={preview}
          onPublish={handlePublishPreview}
          onDiscard={() => setPreview(null)}
          publishing={publishing}
        />
      )}
    </div>
  );
}