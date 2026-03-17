import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Footer from "../pages/components/footer";
import { Helmet } from "react-helmet-async";
// ── Constants ─────────────────────────────────────────────
const CATEGORIES = {
  notes:         { label:"Notes",          icon:"📝" },
  past_papers:   { label:"Past Papers",    icon:"📋" },
  thesis:        { label:"Thesis",         icon:"🎓" },
  templates:     { label:"Templates",      icon:"📐" },
  books:         { label:"Books",          icon:"📚" },
  video_link:    { label:"Video Link",     icon:"🎥" },
  external_link: { label:"External Link",  icon:"🔗" },
  other:         { label:"Other",          icon:"📦" },
};

const FILE_ICONS = {
  pdf:  { icon:"📄", color:"#dc2626", bg:"rgba(239,68,68,0.1)"  },
  doc:  { icon:"📝", color:"#2563eb", bg:"rgba(59,130,246,0.1)" },
  ppt:  { icon:"📊", color:"#d97706", bg:"rgba(245,158,11,0.1)" },
  xls:  { icon:"📈", color:"#059669", bg:"rgba(16,185,129,0.1)" },
  zip:  { icon:"🗜️", color:"#7c3aed", bg:"rgba(139,92,246,0.1)" },
  mp4:  { icon:"🎥", color:"#db2777", bg:"rgba(236,72,153,0.1)" },
  link: { icon:"🔗", color:"#0284c7", bg:"rgba(14,165,233,0.1)" },
};

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes/1024).toFixed(1) + " KB";
  return (bytes/1048576).toFixed(1) + " MB";
}

// ── Login required modal ──────────────────────────────────
function LoginModal({ slug, onClose }) {
  const navigate = useNavigate();
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:20, padding:28, width:"min(420px,95vw)", boxShadow:"0 24px 60px rgba(0,0,0,0.2)", textAlign:"center" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ fontSize:44, marginBottom:12 }}>🔐</div>
        <h2 style={{ margin:"0 0 8px", fontSize:20, color:"#0f172a", fontWeight:800 }}>Login Required</h2>
        <p style={{ margin:"0 0 24px", color:"#64748b", fontSize:14, lineHeight:1.6 }}>
          This resource requires a free account to download. Sign up or log in to access all protected materials instantly.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button
            onClick={() => navigate(`/login?redirect=/resources/${slug}`)}
            style={{ padding:"13px 0", background:"linear-gradient(135deg,#1a3a8f,#3b82f6)", color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:15, cursor:"pointer" }}>
            🔑 Login
          </button>
          <button
            onClick={() => navigate(`/signup?redirect=/resources/${slug}`)}
            style={{ padding:"13px 0", background:"rgba(26,58,143,0.06)", color:"#1a3a8f", border:"1px solid rgba(26,58,143,0.2)", borderRadius:12, fontWeight:700, fontSize:15, cursor:"pointer" }}>
            ✨ Create Free Account
          </button>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:13, padding:"6px 0" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Related card ──────────────────────────────────────────
function RelatedCard({ item }) {
  const cat = CATEGORIES[item.category] || { label:"Other", icon:"📦" };
  const ft  = FILE_ICONS[item.file_type] || FILE_ICONS.link;
  return (
    <Link to={`/resources/${item.slug}`} style={{ textDecoration:"none" }}>
      <div style={{
        background:"#fff", border:"1px solid #f1f5f9", borderRadius:12,
        padding:"12px 14px", cursor:"pointer", transition:"all 0.18s",
        display:"flex", alignItems:"center", gap:12,
      }}
        onMouseEnter={e=>{ e.currentTarget.style.borderColor="#c7d7f7"; e.currentTarget.style.boxShadow="0 4px 12px rgba(26,58,143,0.1)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor="#f1f5f9"; e.currentTarget.style.boxShadow="none"; }}
      >
        <div style={{ width:36, height:36, borderRadius:8, background:ft.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>
          {cat.icon}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#0f172a", lineHeight:1.3,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {item.title}
          </div>
          <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>
            {cat.label} · ⬇ {item.download_count||0}
          </div>
        </div>
        <span style={{ fontSize:11, color:"#1a3a8f", fontWeight:700, flexShrink:0 }}>→</span>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────
export default function ResourceDetailPage() {
  const { slug }    = useParams();
  const navigate    = useNavigate();

  const [material,    setMaterial]    = useState(null);
  const [related,     setRelated]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [notFound,    setNotFound]    = useState(false);
  const [showLogin,   setShowLogin]   = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded,  setDownloaded]  = useState(false);
  const [showPdf,     setShowPdf]     = useState(false);
  const [user,        setUser]        = useState(null);
  const [copied,      setCopied]      = useState(false);

  // Check auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);

  // Load material
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    supabase.rpc("study_materials_get_by_slug", { p_slug: slug }).then(({ data, error }) => {
      if (error || !data || data.length === 0) {
        setNotFound(true); setLoading(false); return;
      }
      const m = data[0];
      setMaterial(m);
      setLoading(false);

      // Increment view count
      supabase.rpc("study_materials_increment_view", { p_slug: slug });

      // Load related
      supabase.rpc("study_materials_get_related", {
        p_id:      m.id,
        p_category: m.category,
        p_subject:  m.subject || null,
        p_limit:    4,
      }).then(({ data: rel }) => setRelated(rel || []));
    });
  }, [slug]);

  // Handle download
  const handleDownload = useCallback(async () => {
    if (!material) return;

    // Check access
    if (material.access === "login_required" && !user) {
      setShowLogin(true); return;
    }

    setDownloading(true);

    // Increment download count
    await supabase.rpc("study_materials_increment_download", {
      p_material_id: material.id,
      p_user_id:     user?.id || null,
    });

    // Trigger download
    const url = material.file_url || material.external_url;
    if (url) {
      const a = document.createElement("a");
      a.href    = url;
      a.target  = "_blank";
      a.rel     = "noopener noreferrer";
      if (material.file_url) a.download = material.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    setDownloading(false);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  }, [material, user]);

  // Copy link
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share
  const handleShare = (platform) => {
    const url  = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${material?.title} — Free Study Material on AIDLA`);
    const urls = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter:  `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    };
    window.open(urls[platform], "_blank");
  };

  // ── Loading state ──────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight:"100vh", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>⏳</div>
          <div style={{ color:"#64748b", fontSize:15 }}>Loading resource…</div>
        </div>
      </div>
    );
  }

  // ── 404 state ──────────────────────────────────────────
  if (notFound) {
    return (
      <div style={{ minHeight:"100vh", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:16 }}>
        <div style={{ textAlign:"center", maxWidth:400 }}>
          <div style={{ fontSize:56, marginBottom:16 }}>📭</div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#0f172a", marginBottom:8 }}>Resource Not Found</h1>
          <p style={{ color:"#64748b", marginBottom:24, lineHeight:1.6 }}>This material may have been removed or the link is incorrect.</p>
          <Link to="/resources" style={{ padding:"12px 28px", background:"linear-gradient(135deg,#1a3a8f,#3b82f6)", color:"#fff", borderRadius:12, textDecoration:"none", fontWeight:700, fontSize:14 }}>
            ← Browse All Materials
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const m        = material;
  const cat      = CATEGORIES[m.category] || { label:"Other", icon:"📦" };
  const ft       = FILE_ICONS[m.file_type] || FILE_ICONS.link;
  const isPdf    = m.file_type === "pdf";
  const isVideo  = m.category === "video_link";
  const isExternal = m.category === "external_link";
  const fileUrl  = m.file_url || m.external_url;

  return (
    <>
    <Helmet>
  <title>{material ? `${material.title} — Download Free | AIDLA` : "Loading…"}</title>
  <meta
    name="description"
    content={material?.description || `Download ${material?.title || ""} — free study material on AIDLA`}
  />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={`https://www.aidla.online/resources/${slug}`} />

  <meta property="og:title" content={material ? `${material.title} — Download Free | AIDLA` : "Loading…"} />
  <meta
    property="og:description"
    content={material?.description || `Download ${material?.title || ""} — free study material on AIDLA`}
  />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`https://www.aidla.online/resources/${slug}`} />
  <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
  <meta property="og:site_name" content="AIDLA" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={material ? `${material.title} — Download Free | AIDLA` : "Loading…"} />
  <meta
    name="twitter:description"
    content={material?.description || `Download ${material?.title || ""} — free study material on AIDLA`}
  />
  <meta name="twitter:image" content="https://www.aidla.online/og-home.jpg" />

  {material && (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DigitalDocument",
        "name": `${material.title} — Download Free | AIDLA`,
        "description": material?.description || `Download ${material?.title || ""} — free study material on AIDLA`,
        "url": `https://www.aidla.online/resources/${slug}`,
        "fileFormat": material?.file_type ? `application/${material.file_type}` : undefined,
        "about": material?.subject ? { "@type": "Thing", "name": material.subject } : undefined,
        "sourceOrganization": material?.university ? { "@type": "Organization", "name": material.university } : undefined,
        "publisher": {
          "@type": "Organization",
          "name": "AIDLA",
          "url": "https://www.aidla.online"
        },
        "inLanguage": "en",
        "isAccessibleForFree": true
      })}
    </script>
  )}

  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.aidla.online" },
        { "@type": "ListItem", "position": 2, "name": "Resources", "item": "https://www.aidla.online/resources" },
        { "@type": "ListItem", "position": 3, "name": material ? `${material.title} — Download Free | AIDLA` : "Loading…", "item": `https://www.aidla.online/resources/${slug}` }
      ]
    })}
  </script>
</Helmet>
      <style>{`
        * { box-sizing: border-box; }
        .rd-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
        .rd-sidebar { display: block; }
        @media (max-width: 900px) {
          .rd-layout { grid-template-columns: 1fr !important; }
          .rd-sidebar { order: -1; }
        }
        .rd-share-btn:hover { opacity: 0.85; }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif" }}>

        {/* ── Breadcrumb bar ── */}
        <div style={{ background:"#fff", borderBottom:"1px solid #f1f5f9", padding:"10px 16px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#94a3b8", flexWrap:"wrap" }}>
            <Link to="/" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Home</Link>
            <span>›</span>
            <Link to="/resources" style={{ color:"#64748b", textDecoration:"none", fontWeight:600 }}>Resources</Link>
            <span>›</span>
            <span style={{ color:"#0f172a", fontWeight:600, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.title}</span>
          </div>
        </div>

        {/* ── Hero banner ── */}
        <div style={{ background:"linear-gradient(135deg,#0b1437 0%,#1a3a8f 70%,#3b82f6 100%)", padding:"28px 16px 32px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto" }}>
            {/* Category + type */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" }}>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.9)", border:"1px solid rgba(255,255,255,0.2)" }}>
                {cat.icon} {cat.label}
              </span>
              {m.file_type && (
                <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:ft.bg, color:ft.color }}>
                  {m.file_type.toUpperCase()}
                </span>
              )}
              <span style={{
                fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20,
                background: m.access==="free" ? "rgba(22,163,74,0.2)" : "rgba(139,92,246,0.2)",
                color: m.access==="free" ? "#86efac" : "#c4b5fd",
                border: `1px solid ${m.access==="free" ? "rgba(22,163,74,0.3)" : "rgba(139,92,246,0.3)"}`,
              }}>
                {m.access==="free" ? "🌐 Free Download" : "🔐 Login Required"}
              </span>
            </div>

            {/* Title */}
            <h1 style={{ margin:"0 0 10px", fontSize:"clamp(1.2rem,4vw,2rem)", fontWeight:900, color:"#fff", lineHeight:1.3 }}>
              {m.title}
            </h1>

            {/* Meta row */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:14, fontSize:13, color:"rgba(255,255,255,0.7)" }}>
              {m.subject     && <span>📖 {m.subject}</span>}
              {m.university  && <span>🏛 {m.university}</span>}
              {m.class_level && <span>🎓 {m.class_level}</span>}
              {m.year        && <span>📅 {m.year}</span>}
              {m.language    && <span>🌐 {m.language === "ur" ? "اردو" : m.language === "en" ? "English" : "Multi-language"}</span>}
            </div>

            {/* Stats */}
            <div style={{ display:"flex", gap:18, marginTop:12, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
              <span>⬇ {(m.download_count||0).toLocaleString()} downloads</span>
              <span>👁 {(m.view_count||0).toLocaleString()} views</span>
              {m.file_size_bytes && <span>💾 {formatBytes(m.file_size_bytes)}</span>}
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"22px 14px 48px" }}>
          <div className="rd-layout">

            {/* ── LEFT: Main content ── */}
            <div>

              {/* Description card */}
              {m.description && (
                <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"20px 22px", marginBottom:20, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:12, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>About This Material</div>
                  <p style={{ margin:0, color:"#374151", fontSize:14, lineHeight:1.8 }}>{m.description}</p>

                  {/* Tags */}
                  {m.tags?.length > 0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:14 }}>
                      {m.tags.map(t => (
                        <Link key={t} to={`/resources?q=${encodeURIComponent(t)}`}
                          style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:"rgba(26,58,143,0.07)", color:"#1a3a8f", border:"1px solid rgba(26,58,143,0.15)", textDecoration:"none" }}>
                          #{t}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PDF Viewer */}
              {isPdf && fileUrl && (
                <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, overflow:"hidden", marginBottom:20, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                  <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>📄 Preview</div>
                    <button
                      onClick={() => setShowPdf(v => !v)}
                      style={{ fontSize:12, fontWeight:700, color:"#1a3a8f", background:"rgba(26,58,143,0.07)", border:"1px solid rgba(26,58,143,0.15)", borderRadius:8, padding:"5px 12px", cursor:"pointer" }}>
                      {showPdf ? "Hide Preview" : "Show Preview"}
                    </button>
                  </div>
                  {showPdf && (
                    <div style={{ height:"clamp(300px,60vh,700px)", background:"#f8fafc" }}>
                      <iframe
                        src={`${fileUrl}#toolbar=1&navpanes=0`}
                        style={{ width:"100%", height:"100%", border:"none" }}
                        title={m.title}
                        loading="lazy"
                      />
                    </div>
                  )}
                  {!showPdf && (
                    <div style={{ padding:"20px 18px", textAlign:"center", color:"#94a3b8", fontSize:13 }}>
                      Click "Show Preview" to view the PDF in your browser
                    </div>
                  )}
                </div>
              )}

              {/* Video embed */}
              {isVideo && fileUrl && (
                <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, overflow:"hidden", marginBottom:20, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                  <div style={{ padding:"14px 18px", borderBottom:"1px solid #f1f5f9" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>🎥 Video</div>
                  </div>
                  <div style={{ position:"relative", paddingBottom:"56.25%", height:0, overflow:"hidden" }}>
                    {fileUrl.includes("youtube.com") || fileUrl.includes("youtu.be") ? (
                      <iframe
                        src={fileUrl.replace("watch?v=","embed/").replace("youtu.be/","www.youtube.com/embed/")}
                        style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={m.title}
                        loading="lazy"
                      />
                    ) : (
                      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#f8fafc" }}>
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer"
                          style={{ padding:"14px 28px", background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", borderRadius:12, textDecoration:"none", fontWeight:700, fontSize:15 }}>
                          ▶ Watch Video
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Details table */}
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"20px 22px", marginBottom:20, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:12, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Details</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 20px" }}>
                  {[
                    { label:"Type",        value: cat.label },
                    { label:"Format",      value: m.file_type?.toUpperCase() },
                    { label:"Subject",     value: m.subject },
                    { label:"Level",       value: m.class_level },
                    { label:"University",  value: m.university },
                    { label:"Year",        value: m.year },
                    { label:"Language",    value: m.language === "ur" ? "Urdu" : m.language === "en" ? "English" : "Multiple" },
                    { label:"File Size",   value: formatBytes(m.file_size_bytes) },
                    { label:"Access",      value: m.access === "free" ? "Free" : "Login Required" },
                    { label:"Downloads",   value: (m.download_count||0).toLocaleString() },
                  ].filter(r => r.value).map(row => (
                    <div key={row.label} style={{ display:"flex", flexDirection:"column", gap:2 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.06em" }}>{row.label}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:"#334155" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related materials */}
              {related.length > 0 && (
                <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:"20px 22px", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:12, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Related Materials</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {related.map(r => <RelatedCard key={r.id} item={r}/>)}
                  </div>
                  <Link to="/resources" style={{ display:"block", textAlign:"center", marginTop:14, fontSize:13, fontWeight:700, color:"#1a3a8f", textDecoration:"none" }}>
                    Browse all materials →
                  </Link>
                </div>
              )}
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <div className="rd-sidebar">

              {/* Download card */}
              <div style={{ background:"#fff", border:"1px solid #f1f5f9", borderRadius:16, padding:20, marginBottom:16, boxShadow:"0 1px 6px rgba(0,0,0,0.04)", position:"sticky", top:20 }}>

                {/* File info */}
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"#f8fafc", borderRadius:10, marginBottom:16 }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:ft.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                    {ft.icon}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{m.title}</div>
                    <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>
                      {m.file_type?.toUpperCase()}
                      {m.file_size_bytes ? ` · ${formatBytes(m.file_size_bytes)}` : ""}
                    </div>
                  </div>
                </div>

                {/* Download button */}
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  style={{
                    width:"100%", padding:"14px 0",
                    background: downloaded
                      ? "linear-gradient(135deg,#16a34a,#22c55e)"
                      : "linear-gradient(135deg,#1a3a8f,#3b82f6)",
                    color:"#fff", border:"none", borderRadius:12,
                    fontWeight:800, fontSize:16, cursor:downloading?"not-allowed":"pointer",
                    opacity:downloading?0.7:1, transition:"all 0.2s", marginBottom:10,
                  }}>
                  {downloading ? "⏳ Preparing…" : downloaded ? "✅ Download Started!" : isVideo ? "▶ Watch Video" : isExternal ? "🔗 Open Link" : "⬇ Download Free"}
                </button>

                {/* Access note */}
                <div style={{
                  fontSize:11, textAlign:"center", padding:"8px 10px", borderRadius:8,
                  background: m.access==="free" ? "rgba(22,163,74,0.06)" : "rgba(139,92,246,0.06)",
                  color: m.access==="free" ? "#15803d" : "#7c3aed",
                  border: `1px solid ${m.access==="free" ? "rgba(22,163,74,0.15)" : "rgba(139,92,246,0.15)"}`,
                  marginBottom:16,
                }}>
                  {m.access==="free"
                    ? "✅ No login required — download instantly"
                    : "🔐 Free account required to download"}
                </div>

                {/* Share section */}
                <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:14 }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Share</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {[
                      { id:"whatsapp", label:"WhatsApp",  bg:"#25D366", icon:"💬" },
                      { id:"facebook", label:"Facebook",  bg:"#1877F2", icon:"👍" },
                      { id:"twitter",  label:"Twitter/X", bg:"#000",    icon:"🐦" },
                      { id:"telegram", label:"Telegram",  bg:"#26A5E4", icon:"✈️" },
                    ].map(s => (
                      <button key={s.id} className="rd-share-btn"
                        onClick={() => handleShare(s.id)}
                        style={{ padding:"8px 6px", background:s.bg, color:"#fff", border:"none", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4, transition:"opacity 0.15s" }}>
                        {s.icon} {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Copy link */}
                  <button onClick={handleCopyLink}
                    style={{ width:"100%", marginTop:8, padding:"9px 0", background:copied?"rgba(22,163,74,0.07)":"#f8fafc", color:copied?"#15803d":"#64748b", border:`1px solid ${copied?"rgba(22,163,74,0.25)":"#e2e8f0"}`, borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
                    {copied ? "✅ Link Copied!" : "🔗 Copy Link"}
                  </button>
                </div>
              </div>

              {/* Browse more */}
              <div style={{ background:"linear-gradient(135deg,#1a3a8f,#3b82f6)", borderRadius:16, padding:20, textAlign:"center" }}>
                <div style={{ fontSize:28, marginBottom:8 }}>📚</div>
                <div style={{ fontWeight:800, color:"#fff", fontSize:14, marginBottom:6 }}>Find More Resources</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginBottom:14, lineHeight:1.5 }}>
                  Browse hundreds of free study materials
                </div>
                <Link to="/resources"
                  style={{ display:"block", padding:"10px 0", background:"rgba(255,255,255,0.15)", color:"#fff", borderRadius:10, textDecoration:"none", fontWeight:700, fontSize:13, border:"1px solid rgba(255,255,255,0.25)" }}>
                  Browse Library →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Login modal */}
      {showLogin && <LoginModal slug={slug} onClose={() => setShowLogin(false)} />}
    </>
  );
}