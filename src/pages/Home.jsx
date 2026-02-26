import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase"; // adjust path

// Animation CSS
const animationStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.floating { animation: float 3s ease-in-out infinite; }
.pulse { animation: pulse-glow 2s infinite; }
.spin-slow { animation: spin-slow 8s linear infinite; }
`;

// Helper to format date
function formatDate(isoString) {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

// Badge for wheel result
function WheelBadge({ type, coins }) {
  const config = {
    coins: { bg: "#10b981", text: `💰 ${coins} Coins` },
    gift: { bg: "#f59e0b", text: "🎁 Gift" },
    plus1_chance: { bg: "#3b82f6", text: "✨ +1 Chance" },
    try_again_free: { bg: "#ef4444", text: "🔄 Try Again" },
  };
  const { bg, text } = config[type] || { bg: "#64748b", text: type };
  return <span style={{ background: bg, color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600 }}>{text}</span>;
}

export default function Home() {
  const [drawResults, setDrawResults] = useState([]);
  const [wheelHistory, setWheelHistory] = useState([]);
  const [testWinners, setTestWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // 1. Lucky Draw Results (latest 5)
        const { data: draws, error: drawsErr } = await supabase
          .from("luckydraw_results")
          .select("id, winner_name, draw_title, prize_text, announced_at")
          .order("announced_at", { ascending: false })
          .limit(5);
        if (drawsErr) throw drawsErr;
        setDrawResults(draws || []);

        // 2. Lucky Wheel History (latest 5)
        const { data: wheel, error: wheelErr } = await supabase
          .from("luckywheel_history")
          .select("id, user_id, result_type, coins_won, created_at")
          .order("created_at", { ascending: false })
          .limit(5);
        if (wheelErr) throw wheelErr;

        // Enrich wheel data with user names (join with auth.users or profiles)
        // For simplicity, we'll fetch profiles separately
        const userIds = wheel?.map(w => w.user_id) || [];
        let userMap = {};
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("users_profiles")
            .select("id, full_name")
            .in("id", userIds);
          if (profiles) {
            userMap = Object.fromEntries(profiles.map(p => [p.id, p.full_name || "Anonymous"]));
          }
        }
        const enrichedWheel = wheel?.map(w => ({
          ...w,
          user_name: userMap[w.user_id] || "Anonymous",
        })) || [];
        setWheelHistory(enrichedWheel);

        // 3. Test Winners (latest 5) with test title
        const { data: winners, error: winnersErr } = await supabase
          .from("test_winners")
          .select(`
            id,
            user_name,
            rank_no,
            approved_at,
            test_id,
            test_tests ( title )
          `)
          .order("approved_at", { ascending: false })
          .limit(5);
        if (winnersErr) throw winnersErr;
        setTestWinners(winners || []);

      } catch (err) {
        console.error("Home data fetch error:", err);
        setError("Failed to load recent winners. Please refresh.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", position: "relative", overflow: "hidden" }}>
      <style>{animationStyles}</style>

      {/* Background Orbs */}
      <div style={{ position: "fixed", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(59,130,246,0.1)", filter: "blur(80px)", top: "-200px", left: "-200px", zIndex: 0, animation: "float 20s infinite alternate" }} />
      <div style={{ position: "fixed", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(30,58,138,0.1)", filter: "blur(80px)", bottom: "-150px", right: "-150px", zIndex: 0, animation: "float 25s infinite alternate-reverse" }} />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", marginBottom: 60 }}
        >
          <div>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", margin: 0, lineHeight: 1.2, background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Learn, Play & Earn
            </h1>
            <p style={{ fontSize: "1.2rem", color: "#475569", margin: "24px 0" }}>
              Join the UAE's most rewarding educational platform. Earn <strong>AIDLA Coins</strong> while you learn, then redeem them in our shop for amazing products – or withdraw directly to cash.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", display: "inline-block", padding: "14px 32px", borderRadius: 40, background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", color: "#fff", fontWeight: 700, fontSize: "1.1rem", boxShadow: "0 10px 20px rgba(59,130,246,0.3)" }}
                >
                  🚀 Start earning
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/about"
                  style={{ textDecoration: "none", display: "inline-block", padding: "14px 32px", borderRadius: 40, border: "2px solid #3b82f6", background: "transparent", color: "#1e3a8a", fontWeight: 700, fontSize: "1.1rem" }}
                >
                  Learn more
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Image collage */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <motion.img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Students learning"
              style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 20, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              whileHover={{ scale: 1.02 }}
            />
            <motion.img
              src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Rewards"
              style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 20, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              whileHover={{ scale: 1.02 }}
            />
            <motion.img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Learning"
              style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 20, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              whileHover={{ scale: 1.02 }}
            />
            <motion.img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Shopping"
              style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 20, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              whileHover={{ scale: 1.02 }}
            />
          </div>
        </motion.div>

        {/* Coin Ecosystem */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", borderRadius: 30, padding: 40, marginBottom: 60, border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}
        >
          <h2 style={{ textAlign: "center", fontSize: "2.2rem", margin: "0 0 30px", background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            The AIDLA Coin Ecosystem
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 30 }}>
            {[
              { icon: "📚", title: "Earn while you learn", desc: "Complete quizzes, participate in draws, spin the wheel – earn coins every day." },
              { icon: "🛍️", title: "Redeem in shop", desc: "Exchange your coins for gadgets, gift cards, and exclusive merchandise." },
              { icon: "💵", title: "Withdraw to cash", desc: "Convert your coins to real money and withdraw to your bank account." },
              { icon: "⚡", title: "Instant rewards", desc: "Winners are announced in real time – no waiting." },
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} style={{ textAlign: "center" }}>
                <span style={{ fontSize: "3rem", display: "block", marginBottom: 10 }}>{item.icon}</span>
                <h3 style={{ color: "#1e3a8a", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Winners - Three Columns */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 style={{ fontSize: "2.2rem", textAlign: "center", marginBottom: 30, background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Recent Winners
          </h2>

          {loading && (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ width: 50, height: 50, border: "4px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", margin: "0 auto", animation: "spin-slow 1s linear infinite" }} />
            </div>
          )}

          {error && (
            <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 16, borderRadius: 12, textAlign: "center", marginBottom: 20 }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {/* Lucky Draws */}
              <motion.div whileHover={{ y: -5 }} style={{ background: "#ffffff", borderRadius: 24, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: "2rem" }}>🎲</span>
                  <h3 style={{ margin: 0, color: "#1e3a8a" }}>Lucky Draws</h3>
                </div>
                {drawResults.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center" }}>No draws yet</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #eef2f6" }}>
                          <th style={{ textAlign: "left", padding: "8px", color: "#64748b" }}>Winner</th>
                          <th style={{ textAlign: "left", padding: "8px", color: "#64748b" }}>Draw</th>
                          <th style={{ textAlign: "left", padding: "8px", color: "#64748b" }}>Prize</th>
                          <th style={{ textAlign: "left", padding: "8px", color: "#64748b" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drawResults.map((row, i) => (
                          <motion.tr key={row.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "10px 8px", fontWeight: 600 }}>{row.winner_name}</td>
                            <td style={{ padding: "10px 8px", color: "#475569" }}>{row.draw_title}</td>
                            <td style={{ padding: "10px 8px", color: "#3b82f6", fontWeight: 600 }}>{row.prize_text}</td>
                            <td style={{ padding: "10px 8px", color: "#64748b", fontSize: "0.8rem" }}>{formatDate(row.announced_at)}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              {/* Lucky Wheel */}
              <motion.div whileHover={{ y: -5 }} style={{ background: "#ffffff", borderRadius: 24, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: "2rem" }}>🎡</span>
                  <h3 style={{ margin: 0, color: "#1e3a8a" }}>Lucky Wheel</h3>
                </div>
                {wheelHistory.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center" }}>No spins yet</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #eef2f6" }}>
                          <th style={{ textAlign: "left", padding: "8px", color: "#64748b" }}>User</th>
                          <th style={{ textAlign: "left", padding: "8px", color: "#64748b" }}>Result</th>
                          <th style={{ textAlign: "left", padding: "8px", color: "#64748b" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wheelHistory.map((row, i) => (
                          <motion.tr key={row.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "10px 8px", fontWeight: 600 }}>{row.user_name}</td>
                            <td style={{ padding: "10px 8px" }}><WheelBadge type={row.result_type} coins={row.coins_won} /></td>
                            <td style={{ padding: "10px 8px", color: "#64748b", fontSize: "0.8rem" }}>{formatDate(row.created_at)}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              {/* Test Winners */}
              <motion.div whileHover={{ y: -5 }} style={{ background: "#ffffff", borderRadius: 24, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: "2rem" }}>📝</span>
                  <h3 style={{ margin: 0, color: "#1e3a8a" }}>Test Toppers</h3>
                </div>
                {testWinners.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center" }}>No test winners yet</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #eef2f6" }}>
                          <th style={{ textAlign: "left", padding: "8px", color: "#64748b" }}>Rank</th>
                          <th style={{ textAlign: "left", padding: "8px", color: "#64748b" }}>User</th>
                          <th style={{ textAlign: "left", padding: "8px", color: "#64748b" }}>Test</th>
                          <th style={{ textAlign: "left", padding: "8px", color: "#64748b" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testWinners.map((row, i) => (
                          <motion.tr key={row.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "10px 8px", fontWeight: 700, color: "#f59e0b" }}>#{row.rank_no}</td>
                            <td style={{ padding: "10px 8px", fontWeight: 600 }}>{row.user_name}</td>
                            <td style={{ padding: "10px 8px", color: "#475569" }}>{row.test_tests?.title || "Untitled"}</td>
                            <td style={{ padding: "10px 8px", color: "#64748b", fontSize: "0.8rem" }}>{formatDate(row.approved_at)}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: 60, textAlign: "center" }}
        >
          <Link
            to="/signup"
            style={{ display: "inline-block", padding: "18px 50px", borderRadius: 50, background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", color: "#fff", fontWeight: 800, fontSize: "1.3rem", textDecoration: "none", boxShadow: "0 20px 30px rgba(59,130,246,0.4)" }}
          >
            ✨ Start earning now ✨
          </Link>
        </motion.div>
      </div>

      {/* Simple footer (layout already has one, but we keep minimal) */}
      <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "30px 24px", marginTop: 60, textAlign: "center" }}>
        <p>© 2025 AIDLA. All rights reserved.</p>
      </footer>
    </div>
  );
}