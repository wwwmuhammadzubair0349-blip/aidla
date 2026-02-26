import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || "");
    });
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  function switchToUser() {
    navigate("/user");
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p style={{ color: "var(--muted)" }}>Admin: {email}</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <button
          onClick={switchToUser}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.08)",
            color: "var(--text)",
            cursor: "pointer",
          }}
        >
          Switch to User Side
        </button>

        <button
          onClick={logout}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.08)",
            color: "var(--text)",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}