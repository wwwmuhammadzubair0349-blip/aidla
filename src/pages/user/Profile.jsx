import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase.js";
import MyCertificates from './MyCertificates';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'certificates'
  const [msg, setMsg] = useState("");

  const [userId, setUserId] = useState(null);

  const [form, setForm] = useState({
    avatar_url: "",
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    city: "",
    country: "",
    educational_level: "",
    profession: "",
    institute_company: "",
    interests: "", // comma separated in UI
    bio: "",
  });

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  // Load profile
  useEffect(() => {
    (async () => {
      setMsg("");
      setLoading(true);
      setIsEditMode(false);

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData?.user) {
        setMsg("Not logged in.");
        setLoading(false);
        return;
      }

      const u = userData.user;
      setUserId(u.id);

      // Try to get profile row
      const { data: profile, error: profErr } = await supabase
        .from("users_profiles")
        .select("*")
        .eq("user_id", u.id)
        .single();

      // If missing, create it
      if (profErr && profErr.code === "PGRST116") {
        await supabase.from("users_profiles").insert([{
          user_id: u.id,
          full_name: u.user_metadata?.full_name || "",
          email: (u.email || "").toLowerCase(),
        }]);
        
        // Fetch the newly created profile
        const { data: newProfile } = await supabase
          .from("users_profiles")
          .select("*")
          .eq("user_id", u.id)
          .single();
        
        if (newProfile) {
          setFormFromData(newProfile, u.email);
        }
      } else if (profile) {
        setFormFromData(profile, u.email);
      } else if (profErr) {
        setMsg(profErr.message);
      }

      setLoading(false);
    })();
  }, []);

  function setFormFromData(profileData, userEmail) {
    setForm({
      avatar_url: profileData.avatar_url || "",
      full_name: profileData.full_name || "",
      email: profileData.email || (userEmail || "").toLowerCase(),
      phone: profileData.phone || "",
      date_of_birth: profileData.date_of_birth || "",
      city: profileData.city || "",
      country: profileData.country || "",
      educational_level: profileData.educational_level || "",
      profession: profileData.profession || "",
      institute_company: profileData.institute_company || "",
      interests: Array.isArray(profileData.interests) ? profileData.interests.join(", ") : "",
      bio: profileData.bio || "",
    });
  }

  async function uploadAvatar(file) {
    if (!file || !userId) {
      setMsg("No file selected or user not authenticated");
      return;
    }

    setMsg("");
    setUploading(true);
    
    try {
      // Validate file
      const maxMB = 3;
      if (file.size > maxMB * 1024 * 1024) {
        throw new Error(`File too large. Maximum size is ${maxMB}MB`);
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file");
      }

      // Create unique filename structured inside a user folder for RLS policies
      const timestamp = Date.now();
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${userId}/avatar_${timestamp}.${ext}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Update database with new avatar URL
      const { error: dbError } = await supabase
        .from("users_profiles")
        .update({ avatar_url: imageUrl })
        .eq("user_id", userId);

      if (dbError) {
        throw new Error(`Failed to save avatar: ${dbError.message}`);
      }

      // Update local state
      setField("avatar_url", imageUrl);
      setMsg("Avatar uploaded successfully! ✅");
      
    } catch (error) {
      setMsg(error.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  }

  async function deleteAvatar() {
    if (!userId || !form.avatar_url) return;

    setMsg("");
    setUploading(true);
    try {
      // Extract file path from URL
      const pathMatch = form.avatar_url.match(/avatars\/([^?]+)/);
      if (pathMatch) {
        const filePath = pathMatch[1];
        const { error: delErr } = await supabase.storage.from("avatars").remove([filePath]);
        if (delErr && delErr.message !== "The resource was not found") throw delErr;
      }

      // Update profile table to remove avatar_url
      const { error: updateErr } = await supabase
        .from("users_profiles")
        .update({ avatar_url: null })
        .eq("user_id", userId);

      if (updateErr) throw updateErr;

      setField("avatar_url", "");
      setMsg("Avatar deleted successfully!");
    } catch (e) {
      setMsg(e.message || "Avatar deletion failed");
    } finally {
      setUploading(false);
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    if (!userId) return;

    setMsg("");
    setSaving(true);

    try {
      const interestsArray = form.interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        full_name: form.full_name.trim(),
        phone: form.phone.trim() || null,
        date_of_birth: form.date_of_birth || null,
        city: form.city.trim() || null,
        country: form.country.trim() || null,
        educational_level: form.educational_level.trim() || null,
        profession: form.profession.trim() || null,
        institute_company: form.institute_company.trim() || null,
        interests: interestsArray.length ? interestsArray : null,
        bio: form.bio.trim() || null,
      };

      const { error } = await supabase.from("users_profiles").update(payload).eq("user_id", userId);
      if (error) throw error;

      setMsg("Profile saved successfully!");
      setIsEditMode(false);
    } catch (e) {
      setMsg(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  // --- 2060 3D DASHBOARD CSS ---
  const css = `
    * { box-sizing: border-box; }

    .profile-wrapper {
      padding: 14px;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      max-width: 700px;
      margin: 0 auto;
      color: #0f172a;
    }

    .page-title {
      font-size: 1.4rem;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 14px 0;
      filter: drop-shadow(1px 1px 2px rgba(30,58,138,0.1));
    }

    .card-2060 {
      background: rgba(255,255,255,0.95);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 14px;
      box-shadow:
        8px 8px 20px rgba(15,23,42,0.06),
        -8px -8px 20px rgba(255,255,255,0.9),
        inset 0 0 0 1px rgba(255,255,255,0.5);
    }

    .section-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: #1e3a8a;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 8px;
      margin-bottom: 14px;
    }

    /* Avatar */
    .avatar-section {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .avatar-3d-frame {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #f8fafc;
      box-shadow:
        inset 4px 4px 8px rgba(15,23,42,0.08),
        inset -4px -4px 8px rgba(255,255,255,1),
        4px 4px 10px rgba(15,23,42,0.05);
      display: grid;
      place-items: center;
      overflow: hidden;
      border: 3px solid #fff;
      flex-shrink: 0;
    }

    .avatar-3d-frame img {
      width: 100%; height: 100%; object-fit: cover;
    }

    .avatar-placeholder {
      color: #94a3b8;
      font-weight: 600;
      font-size: 0.7rem;
      text-align: center;
    }

    .btn-upload-3d {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 14px;
      background: #f1f5f9;
      color: #1e3a8a;
      font-weight: 700;
      font-size: 0.78rem;
      border: none;
      border-radius: 10px;
      box-shadow: 3px 3px 8px rgba(15,23,42,0.05), -3px -3px 8px rgba(255,255,255,1);
      transition: all 0.2s;
      cursor: pointer;
    }
    .btn-upload-3d:hover:not(.disabled) { color: #3b82f6; transform: translateY(-1px); }
    .btn-upload-3d.disabled { opacity: 0.7; cursor: not-allowed; }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .full-width { grid-column: 1 / -1; }

    .input-group { position: relative; }

    .label-3d {
      display: block;
      margin-bottom: 5px;
      font-weight: 700;
      color: #334155;
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .input-3d {
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      border: 2px solid transparent;
      background: #f8fafc;
      color: #0f172a;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: inset 3px 3px 7px rgba(15,23,42,0.06), inset -3px -3px 7px rgba(255,255,255,1);
      transition: all 0.2s;
      font-family: inherit;
    }
    .input-3d:read-only {
      background: #e2e8f0;
      color: #64748b;
      cursor: not-allowed;
      box-shadow: inset 1px 1px 4px rgba(15,23,42,0.03);
    }
    .input-3d::placeholder { color: #cbd5e1; font-weight: 500; font-size: 0.8rem; }
    .input-3d:not(:read-only):focus {
      outline: none;
      background: #fff;
      border-color: rgba(59,130,246,0.4);
      box-shadow: inset 2px 2px 5px rgba(15,23,42,0.03), inset -2px -2px 5px rgba(255,255,255,1), 0 0 0 3px rgba(59,130,246,0.1);
    }

    textarea.input-3d {
      resize: vertical;
      min-height: 80px;
    }

    /* Buttons */
    .btn-2060 {
      padding: 11px 18px;
      border-radius: 11px;
      border: none;
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: #fff;
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      cursor: pointer;
      box-shadow: 0 5px 0 #1e3a8a, 0 8px 14px rgba(30,58,138,0.2), inset 0 2px 0 rgba(255,255,255,0.2);
      transition: all 0.12s;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      min-width: 100px;
    }
    .btn-2060:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 7px 0 #1e3a8a, 0 12px 18px rgba(30,58,138,0.25), inset 0 2px 0 rgba(255,255,255,0.2); }
    .btn-2060:active:not(:disabled) { transform: translateY(5px); box-shadow: 0 0 0 #1e3a8a, 0 2px 6px rgba(30,58,138,0.2), inset 0 2px 0 rgba(255,255,255,0.2); }
    .btn-2060:disabled { background: #94a3b8; box-shadow: 0 5px 0 #64748b; cursor: not-allowed; opacity: 0.8; }

    .btn-cancel {
      background: linear-gradient(135deg, #94a3b8, #cbd5e1);
      box-shadow: 0 5px 0 #64748b, 0 8px 14px rgba(15,23,42,0.1), inset 0 2px 0 rgba(255,255,255,0.2);
    }
    .btn-cancel:hover:not(:disabled) { box-shadow: 0 7px 0 #64748b, 0 12px 18px rgba(15,23,42,0.15), inset 0 2px 0 rgba(255,255,255,0.2); }
    .btn-cancel:active:not(:disabled) { box-shadow: 0 0 0 #64748b; }

    .btn-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      gap: 10px;
      flex-wrap: wrap;
    }

    .header-row .section-title { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }

    .msg-box {
      margin-bottom: 14px;
      padding: 11px 14px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.82rem;
      animation: fadeIn 0.3s ease;
      display: block;
      width: 100%;
    }

    .loader-container {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      height: 40vh; color: #1e3a8a; font-weight: 700;
      font-size: 0.9rem; gap: 12px;
    }

    .spinner {
      width: 32px; height: 32px;
      border: 3px solid rgba(59,130,246,0.2);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

    /* Tablet */
    @media (max-width: 768px) {
      .profile-wrapper { padding: 12px; }
      .form-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    }

    /* Mobile */
    @media (max-width: 540px) {
      .profile-wrapper { padding: 10px; }
      .page-title { font-size: 1.2rem; }
      .card-2060 { padding: 13px; border-radius: 14px; }
      .form-grid { grid-template-columns: 1fr; gap: 9px; }
      .avatar-section { flex-direction: row; align-items: center; }
      .avatar-3d-frame { width: 68px; height: 68px; }
      .btn-2060 { width: 100%; font-size: 0.82rem; padding: 10px; }
      .btn-container { flex-direction: column; }
      .header-row { flex-direction: row; }
      .input-3d { padding: 9px 11px; font-size: 0.82rem; }
    }

    /* Very small */
    @media (max-width: 360px) {
      .form-grid { grid-template-columns: 1fr; }
      .avatar-3d-frame { width: 60px; height: 60px; }
      .page-title { font-size: 1.1rem; }
    }
      .avatar-section {
  display: flex;
  align-items: center;
  gap: 14px;
}
  `;

  if (loading) {
    return (
      <div className="profile-wrapper">
        <style>{css}</style>
        <div className="loader-container">
          <div className="spinner"></div>
          <div>Loading Profile Data...</div>
        </div>
      </div>
    );
  }

return (
    <div className="profile-wrapper">
      <style>{css}</style>

      <h2 className="page-title">My Profile</h2>

      <div style={{ display:'flex', gap:8, marginBottom:20, background:'#f1f5f9', padding:5, borderRadius:12, width:'fit-content' }}>
        <button onClick={() => setActiveTab('profile')} style={{ padding:'9px 22px', borderRadius:9, border:'none', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:'inherit', background: activeTab==='profile' ? '#1e3a8a' : 'transparent', color: activeTab==='profile' ? 'white' : '#64748b' }}>
          👤 Profile
        </button>
        <button onClick={() => setActiveTab('certificates')} style={{ padding:'9px 22px', borderRadius:9, border:'none', cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:'inherit', background: activeTab==='certificates' ? '#1e3a8a' : 'transparent', color: activeTab==='certificates' ? 'white' : '#64748b' }}>
          🎓 Certificates
        </button>
      </div>

      {activeTab === 'certificates' && <MyCertificates />}

      {activeTab === 'profile' && <>

      {msg && (
        <div
          className="msg-box"
          style={{
            color: msg.includes("success") || msg.includes("✅") ? "#047857" : "#b91c1c",
            background: msg.includes("success") || msg.includes("✅") ? "#d1fae5" : "#fee2e2",
            boxShadow: msg.includes("success") || msg.includes("✅") ? "inset 0 0 0 2px #34d399" : "inset 0 0 0 2px #f87171"
          }}
        >
          {msg}
        </div>
      )}

      {/* Avatar Section */}
<div className="card-2060">
  <div className="section-title">Profile Picture</div>
  <div className="avatar-section">

    <div className="avatar-3d-frame">
      {form.avatar_url ? (
        <img src={form.avatar_url} alt="User Avatar" />
      ) : (
        <span className="avatar-placeholder">No Photo</span>
      )}
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "7px", flex: 1 }}>
      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>

        <label className={`btn-upload-3d ${uploading ? "disabled" : ""}`}>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                uploadAvatar(e.target.files[0]);
                e.target.value = "";
              }
            }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {uploading ? "Uploading..." : "Change Avatar"}
        </label>

        {form.avatar_url && (
          <button
            type="button"
            disabled={uploading}
            onClick={deleteAvatar}
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "9px 14px", background: "#fee2e2", color: "#b91c1c",
              fontWeight: "700", fontSize: "0.78rem", border: "none",
              borderRadius: "10px", cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.6 : 1, transition: "all 0.2s",
              boxShadow: "3px 3px 8px rgba(15,23,42,0.05), -3px -3px 8px rgba(255,255,255,1)"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            {uploading ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      <p style={{ color: "#94a3b8", fontSize: "0.65rem", margin: 0, fontWeight: "500" }}>
        Max 3MB · JPG, PNG
      </p>
    </div>

  </div>
</div>

      {/* Form Details Section */}
      <div className="card-2060">
<div className="header-row">
  {!isEditMode ? (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" }}>
      <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#1e3a8a" }}>Personal Details</span>
      <button
        type="button"
        onClick={() => setIsEditMode(true)}
        style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          padding: "6px 12px", background: "#f1f5f9", color: "#1e3a8a",
          fontWeight: 700, fontSize: "0.72rem", border: "none",
          borderRadius: "8px", cursor: "pointer",
          boxShadow: "3px 3px 8px rgba(15,23,42,0.05), -3px -3px 8px rgba(255,255,255,1)",
          transition: "all 0.2s"
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Edit
      </button>
    </div>
  ) : (
    <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#1e3a8a", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px", width: "100%" }}>
      Personal Details
    </div>
  )}
</div>

        <form onSubmit={saveProfile} className="form-grid">
          
          <div className="input-group">
            <label className="label-3d">Full Name</label>
            <input 
              className="input-3d" 
              value={form.full_name} 
              onChange={(e) => setField("full_name", e.target.value)} 
              required 
              placeholder="Enter your full name"
              readOnly={!isEditMode}
            />
          </div>

          <div className="input-group">
            <label className="label-3d">Email Address</label>
            <input 
              className="input-3d" 
              value={form.email} 
              readOnly 
              title="Email cannot be changed here"
            />
          </div>

          <div className="input-group">
            <label className="label-3d">Phone Number</label>
            <input 
              className="input-3d" 
              value={form.phone} 
              onChange={(e) => setField("phone", e.target.value)} 
              placeholder="+971 50 123 4567"
              readOnly={!isEditMode}
            />
          </div>

          <div className="input-group">
            <label className="label-3d">Date of Birth</label>
            <input 
              className="input-3d" 
              type="date" 
              value={form.date_of_birth} 
              onChange={(e) => setField("date_of_birth", e.target.value)}
              readOnly={!isEditMode}
            />
          </div>

          <div className="input-group">
            <label className="label-3d">City</label>
            <input 
              className="input-3d" 
              value={form.city} 
              onChange={(e) => setField("city", e.target.value)} 
              placeholder="e.g. Dubai"
              readOnly={!isEditMode}
            />
          </div>

          <div className="input-group">
            <label className="label-3d">Country</label>
            <input 
              className="input-3d" 
              value={form.country} 
              onChange={(e) => setField("country", e.target.value)} 
              placeholder="e.g. UAE"
              readOnly={!isEditMode}
            />
          </div>

          <div className="input-group">
            <label className="label-3d">Educational Level</label>
            <input 
              className="input-3d" 
              value={form.educational_level} 
              onChange={(e) => setField("educational_level", e.target.value)} 
              placeholder="e.g. Bachelor's Degree"
              readOnly={!isEditMode}
            />
          </div>

          <div className="input-group">
            <label className="label-3d">Profession</label>
            <input 
              className="input-3d" 
              value={form.profession} 
              onChange={(e) => setField("profession", e.target.value)} 
              placeholder="e.g. Software Engineer"
              readOnly={!isEditMode}
            />
          </div>

          <div className="input-group">
            <label className="label-3d">Institute / Company</label>
            <input 
              className="input-3d" 
              value={form.institute_company} 
              onChange={(e) => setField("institute_company", e.target.value)} 
              placeholder="e.g. Tech Corp LLC"
              readOnly={!isEditMode}
            />
          </div>

          <div className="input-group">
            <label className="label-3d">Interests <span style={{textTransform:"none", color:"#94a3b8"}}>(Comma separated)</span></label>
            <input 
              className="input-3d" 
              value={form.interests} 
              onChange={(e) => setField("interests", e.target.value)} 
              placeholder="e.g. AI, Web3, Clean Energy"
              readOnly={!isEditMode}
            />
          </div>

          <div className="input-group full-width">
            <label className="label-3d">Bio</label>
            <textarea 
              className="input-3d" 
              value={form.bio} 
              onChange={(e) => setField("bio", e.target.value)} 
              placeholder="Tell us a little bit about yourself..."
              rows={4}
              readOnly={!isEditMode}
            />
          </div>

          {isEditMode && (
            <div className="full-width btn-container">
              <button disabled={saving} className="btn-2060 btn-cancel" type="button" onClick={() => setIsEditMode(false)}>
                CANCEL
              </button>
              <button disabled={saving} className="btn-2060 btn-edit">
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </div>
          )}

        </form>
      </div>
</>}

    </div>
  );
}