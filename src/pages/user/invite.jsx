import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase.js";

export default function Invite() {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const inviteLink = useMemo(() => {
    if (!code) return "";
    return `${window.location.origin}/signup?ref=${encodeURIComponent(code)}`;
  }, [code]);

  const shareText = useMemo(() => {
    if (!code) return "";
    return `Join AIDLA 🚀\n\nMy Invite Code: ${code}\nSignup Link: ${inviteLink}`;
  }, [code, inviteLink]);

  useEffect(() => {
    (async () => {
      setMsg("");
      setLoading(true);

      const { data: u, error: uErr } = await supabase.auth.getUser();
      const userId = u?.user?.id;

      if (uErr || !userId) {
        setMsg("Not logged in.");
        setLoading(false);
        return;
      }

      let { data: prof, error } = await supabase
        .from("users_profiles")
        .select("my_refer_code, full_name")
        .eq("user_id", userId)
        .single();

      if (error && error.code === "PGRST116") {
        const email = (u.user.email || "").toLowerCase();
        const fullName = u.user.user_metadata?.full_name || "User";

        const { error: insErr } = await supabase.from("users_profiles").insert([
          { user_id: userId, email, full_name: fullName },
        ]);
        if (insErr) {
          setMsg(insErr.message);
          setLoading(false);
          return;
        }

        const res2 = await supabase
          .from("users_profiles")
          .select("my_refer_code")
          .eq("user_id", userId)
          .single();

        prof = res2.data;
        error = res2.error;
      }

      if (error) {
        setMsg(error.message);
        setLoading(false);
        return;
      }

      if (!prof?.my_refer_code) {
        const { error: upErr } = await supabase
          .from("users_profiles")
          .update({ my_refer_code: null })
          .eq("user_id", userId);

        if (upErr) {
          setMsg(upErr.message);
          setLoading(false);
          return;
        }

        const { data: prof2, error: e2 } = await supabase
          .from("users_profiles")
          .select("my_refer_code")
          .eq("user_id", userId)
          .single();

        if (e2) {
          setMsg(e2.message);
          setLoading(false);
          return;
        }

        setCode(prof2.my_refer_code || "");
      } else {
        setCode(prof.my_refer_code);
      }

      setLoading(false);
    })();
  }, []);

  async function copy(text) {
    setMsg("");
    try {
      await navigator.clipboard.writeText(text);
      setMsg("Copied ✅");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("Copy failed. Please copy manually.");
    }
  }

  const css = `
    * { box-sizing: border-box; }

    .invite-wrapper {
      animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .page-title {
      font-size: 2.2rem;
      font-weight: 900;
      letter-spacing: -1px;
      color: #1e3a8a;
      margin-top: 0;
      margin-bottom: 25px;
      text-shadow: 2px 2px 4px rgba(30, 58, 138, 0.1);
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
    }

    .card-2060 {
      background: #ffffff;
      border-radius: 20px;
      padding: 25px;
      display: flex;
      flex-direction: column;
      box-shadow: 
        10px 10px 25px rgba(15, 23, 42, 0.05), 
        -10px -10px 25px rgba(255, 255, 255, 0.9),
        inset 0 0 0 1px rgba(255, 255, 255, 1);
      transition: transform 0.2s ease;
    }
    .card-2060:hover {
      transform: translateY(-2px);
    }

    .card-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
    }

    .code-display {
      font-size: 2.5rem;
      font-weight: 900;
      font-family: monospace;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 20px;
      text-align: center;
      padding: 20px;
      background-color: #f8fafc;
      border-radius: 16px;
      box-shadow: inset 4px 4px 8px rgba(15, 23, 42, 0.05), inset -4px -4px 8px rgba(255, 255, 255, 1);
    }

    .link-display {
      font-size: 1rem;
      font-weight: 600;
      color: #1e3a8a;
      word-break: break-all;
      background: #f8fafc;
      padding: 16px;
      border-radius: 14px;
      margin-bottom: 20px;
      box-shadow: inset 4px 4px 8px rgba(15, 23, 42, 0.05), inset -4px -4px 8px rgba(255, 255, 255, 1);
      flex-grow: 1;
    }

    .input-3d {
      width: 100%;
      padding: 16px;
      border-radius: 14px;
      border: 2px solid transparent;
      background: #f8fafc;
      color: #0f172a;
      font-size: 0.95rem;
      font-weight: 600;
      box-shadow: inset 4px 4px 8px rgba(15, 23, 42, 0.05), inset -4px -4px 8px rgba(255, 255, 255, 1);
      margin-bottom: 20px;
      resize: vertical;
      font-family: inherit;
      flex-grow: 1;
    }
    .input-3d:focus { outline: none; }

    .btn-3d {
      width: 100%;
      padding: 16px;
      border-radius: 14px;
      border: none;
      background: linear-gradient(135deg, #1e3a8a, #3b82f6);
      color: #ffffff;
      font-size: 1.05rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      cursor: pointer;
      box-shadow: 0 8px 0 #1e3a8a, 0 15px 20px rgba(30, 58, 138, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.2);
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: auto;
    }
    .btn-3d:hover:not(:disabled) {
      filter: brightness(1.1);
      transform: translateY(-2px);
      box-shadow: 0 10px 0 #1e3a8a, 0 20px 25px rgba(30, 58, 138, 0.3), inset 0 2px 0 rgba(255,255,255,0.2);
    }
    .btn-3d:active:not(:disabled) {
      transform: translateY(8px);
      box-shadow: 0 0px 0 #1e3a8a, 0 5px 10px rgba(30, 58, 138, 0.3), inset 0 2px 0 rgba(255,255,255,0.2);
    }
    .btn-3d:disabled {
      background: #94a3b8;
      box-shadow: 0 8px 0 #64748b;
      cursor: not-allowed;
      opacity: 0.8;
      transform: translateY(0);
    }

    .msg-box {
      margin-bottom: 20px;
      padding: 14px 20px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      animation: fadeIn 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #1e3a8a;
      font-weight: 700;
    }
    .spinner {
      width: 40px; height: 40px; border: 4px solid rgba(59, 130, 246, 0.2); border-top-color: #3b82f6; border-radius: 50%;
      animation: spin 1s linear infinite; margin-bottom: 15px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 600px) {
      .grid-container { grid-template-columns: 1fr; gap: 20px; }
      .card-2060 { padding: 20px; }
      .code-display { font-size: 2rem; padding: 15px; }
      .page-title { font-size: 1.8rem; text-align: center; }
    }
  `;

  return (
    <div className="invite-wrapper">
      <style>{css}</style>

      <h2 className="page-title">Invite a Friend</h2>

      {msg && (
        <div
          className="msg-box"
          style={{
            color: msg.includes("✅") ? "#047857" : "#b91c1c",
            background: msg.includes("✅") ? "#d1fae5" : "#fee2e2",
            boxShadow: msg.includes("✅") ? "inset 0 0 0 2px #34d399" : "inset 0 0 0 2px #f87171"
          }}
        >
          {msg.includes("✅") && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          )}
          {msg}
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <div>Loading Invite Details...</div>
        </div>
      ) : (
        <div className="grid-container">
          <div className="card-2060">
            <div className="card-title">Your Invite Code</div>
            <div className="code-display">{code || "—"}</div>

            <button className="btn-3d" onClick={() => copy(code)} disabled={!code}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy Code
            </button>
          </div>

          <div className="card-2060">
            <div className="card-title">Direct Invite Link</div>
            <div className="link-display">{inviteLink || "—"}</div>

            <button className="btn-3d" onClick={() => copy(inviteLink)} disabled={!inviteLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Copy Link
            </button>
          </div>

          <div className="card-2060">
            <div className="card-title">Message to Share</div>
            <textarea className="input-3d" value={shareText} readOnly rows={4} />

            <button className="btn-3d" onClick={() => copy(shareText)} disabled={!shareText}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Copy Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}