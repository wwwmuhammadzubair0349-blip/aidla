import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";
import Footer from "../pages/components/footer"; // Imported footer
import "./leaderboard.css";                       // Extracted styles

/* ═══════════════════════════════════════════════════════════════
   HELPERS (unchanged)
═══════════════════════════════════════════════════════════════ */
function fmtTime(ms) {
  if (!ms) return "—";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtCoins(val) {
  const n = Number(val);
  if (!n && n !== 0) return null;
  return Math.floor(n).toLocaleString();
}

function fmtDrawPrize(r) {
  const coins = Number(r.coins_amount);
  if (coins > 0) return `🪙 ${fmtCoins(coins)}`;
  if (r.prize_text) {
    const numMatch = r.prize_text.trim().match(/^([\d.]+)(\s*coins?)?$/i);
    if (numMatch) return `🪙 ${fmtCoins(numMatch[1])}`;
    return `🎁 ${r.prize_text}`;
  }
  return "Prize";
}

function rankEmoji(r) {
  if (r === 1) return "🥇";
  if (r === 2) return "🥈";
  if (r === 3) return "🥉";
  return `#${r}`;
}

function RankBadge({ rank }) {
  const cls   = rank === 1 ? "r1" : rank === 2 ? "r2" : rank === 3 ? "r3" : "rn";
  const label = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;
  return <div className={`rank-badge ${cls}`}>{label}</div>;
}

function SkeletonRows({ n = 5 }) {
  return Array.from({ length: n }).map((_, i) => (
    <div key={i} className="rank-row">
      <div className="skel-bg" style={{ width:36, height:36, borderRadius:12, flexShrink:0 }} />
      <div>
        <div className="skel-bg" style={{ height:13, width:120, marginBottom:5 }} />
        <div className="skel-bg" style={{ height:10, width:70 }} />
      </div>
      <div className="skel-bg" style={{ height:18, width:40 }} />
      <div className="skel-bg" style={{ height:12, width:36 }} />
    </div>
  ));
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — LIVE LEADERBOARD (unchanged logic)
═══════════════════════════════════════════════════════════════ */
function LiveLeaderboard() {
  const [tests, setTests]             = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [rows, setRows]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const channelRef                    = useRef(null);
  const prevPositions                 = useRef({});

  useEffect(() => {
    supabase
      .from("test_tests")
      .select("id,title,status")
      .not("status", "in", '("finished","out")')
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) { setError(error.message); setLoading(false); return; }
        const list = data || [];
        setTests(list);
        if (list.length > 0) setSelectedTest(list[0]);
        else setLoading(false);
      });
  }, []);

  const fetchRows = useCallback(async (testId) => {
    const { data, error } = await supabase
      .from("test_leaderboard")
      .select("user_id,user_name,score,correct_count,total_time_ms,status")
      .eq("test_id", testId)
      .order("score", { ascending: false })
      .order("total_time_ms", { ascending: true });
    if (error) { setError(error.message); return; }
    const newPos = {};
    (data || []).forEach((r, i) => { newPos[r.user_id] = i; });
    prevPositions.current = newPos;
    setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!selectedTest) return;
    setLoading(true);
    setError("");
    fetchRows(selectedTest.id);

    if (channelRef.current) supabase.removeChannel(channelRef.current);
    const ch = supabase
      .channel(`lb-live:${selectedTest.id}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "test_leaderboard",
        filter: `test_id=eq.${selectedTest.id}`,
      }, () => fetchRows(selectedTest.id))
      .subscribe();
    channelRef.current = ch;

    return () => {
      if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null; }
    };
  }, [selectedTest, fetchRows]);

  const getMove = (userId, idx) => {
    const prev = prevPositions.current[userId];
    if (prev === undefined || prev === idx) return null;
    return prev > idx ? "up" : "down";
  };

  if (!loading && tests.length === 0 && !error) {
    return (
      <div className="lb-section">
        <div className="lb-section-header">
          <h3 className="lb-section-title">
            🏁 Live Leaderboard
            <span className="live-badge"><span className="live-dot" />Live</span>
          </h3>
        </div>
        <div className="lb-empty">
          <span className="lb-empty-icon">🏁</span>
          No live tests running right now. Check back soon!
        </div>
      </div>
    );
  }

  return (
    <div className="lb-section">
      <div className="lb-section-header">
        <h3 className="lb-section-title">
          🏁 Live Leaderboard
          <span className="live-badge"><span className="live-dot" />Live</span>
        </h3>
      </div>

      {tests.length > 1 && (
        <div className="test-selector">
          {tests.map(t => (
            <button key={t.id} className={`test-pill ${selectedTest?.id === t.id ? "active" : ""}`}
              onClick={() => setSelectedTest(t)}>
              {t.title || "Untitled Test"}
            </button>
          ))}
        </div>
      )}

      {selectedTest && <div className="event-strip">📋 {selectedTest.title || "Untitled Test"}</div>}
      {error && <div className="lb-error">{error}</div>}

      <ul className="rank-list">
        {loading ? <SkeletonRows n={5} /> :
         rows.length === 0 ? (
          <li className="lb-empty">
            <span className="lb-empty-icon">⏳</span>
            Waiting for participants to join...
          </li>
         ) : (
          <AnimatePresence initial={false}>
            {rows.map((r, i) => {
              const move = getMove(r.user_id, i);
              return (
                <motion.li key={r.user_id} layout
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  transition={{ type:"spring", stiffness:300, damping:30 }}
                  className={`rank-row rank-${i+1} ${move === "up" ? "moved-up" : move === "down" ? "moved-down" : ""}`}
                >
                  <RankBadge rank={i + 1} />
                  <div>
                    <div className="rank-name">{r.user_name}</div>
                    <div className="rank-sub">{r.correct_count} correct · {r.status === "finished" ? "Finished" : "In Progress"}</div>
                  </div>
                  <div>
                    <div className="rank-score">{r.score}</div>
                    <div className="rank-score-label">pts</div>
                  </div>
                  <div className="rank-time">{fmtTime(r.total_time_ms)}</div>
                  {move && <span className={`rank-arrow ${move}`}>{move === "up" ? "▲" : "▼"}</span>}
                </motion.li>
              );
            })}
          </AnimatePresence>
        )}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — TEST RESULTS (unchanged)
═══════════════════════════════════════════════════════════════ */
function TestResults() {
  const [tests, setTests]               = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [winners, setWinners]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  useEffect(() => {
    supabase.from("test_tests").select("id,title")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const list = data || [];
        setTests(list);
        if (list.length > 0) setSelectedTest(list[0]);
        else setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedTest) return;
    setLoading(true); setError("");
    supabase.from("test_winners").select("*")
      .eq("test_id", selectedTest.id)
      .order("rank_no", { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setWinners(data || []);
        setLoading(false);
      });
  }, [selectedTest]);

  const rankCardClass = (r) =>
    r === 1 ? "winner-card rank-1-card" :
    r === 2 ? "winner-card rank-2-card" :
    r === 3 ? "winner-card rank-3-card" : "winner-card";

  return (
    <div className="lb-section">
      <div className="lb-section-header">
        <h3 className="lb-section-title">🏆 Test Results</h3>
      </div>

      {tests.length > 0 && (
        <div className="test-selector">
          {tests.map(t => (
            <button key={t.id} className={`test-pill ${selectedTest?.id === t.id ? "active" : ""}`}
              onClick={() => setSelectedTest(t)}>
              {t.title || "Untitled Test"}
            </button>
          ))}
        </div>
      )}

      {selectedTest && <div className="event-strip">📋 {selectedTest.title || "Untitled Test"}</div>}
      {error && <div className="lb-error">{error}</div>}

      {loading ? (
        <div style={{ padding:"20px 28px", display:"flex", gap:12 }}>
          {[1,2,3].map(n => <div key={n} style={{ flex:1 }}><div className="skel-bg" style={{ height:130, borderRadius:18 }} /></div>)}
        </div>
      ) : winners.length === 0 ? (
        <div className="lb-empty">
          <span className="lb-empty-icon">🏆</span>
          No winners announced yet for this test.
        </div>
      ) : (
        <div className="winners-grid">
          {winners.map((w, i) => (
            <motion.div key={w.id} className={rankCardClass(w.rank_no)}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.08 }}>
              <span className="winner-emoji">{rankEmoji(w.rank_no)}</span>
              <div className="winner-rank-label">Rank #{w.rank_no}</div>
              <div className="winner-name">{w.user_name}</div>
              <div className="winner-event">📋 {selectedTest?.title || "Test"}</div>
              {w.prize_text && <div className="winner-prize">🎁 {w.prize_text}</div>}
              {Number(w.coins_amount) > 0 && (
                <div className="winner-prize" style={{ background:"rgba(59,130,246,0.1)", color:"var(--royal)", marginTop:4 }}>
                  🪙 {fmtCoins(w.coins_amount)} coins
                </div>
              )}
              {w.note && <div className="winner-note">{w.note}</div>}
              <div className="winner-date">{fmtDate(w.approved_at)}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — LUCKY DRAW RESULTS (unchanged)
═══════════════════════════════════════════════════════════════ */
function LuckyDrawResults() {
  const [draws, setDraws]             = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    supabase.from("luckydraw_results").select("draw_id,draw_title")
      .order("announced_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) { setError(error.message); setLoading(false); return; }
        const seen = new Set();
        const unique = (data || []).filter(d => {
          if (seen.has(d.draw_id)) return false;
          seen.add(d.draw_id); return true;
        });
        setDraws(unique);
        if (unique.length > 0) setSelectedDraw(unique[0]);
        else setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedDraw) return;
    setLoading(true); setError("");
    supabase.from("luckydraw_results").select("*")
      .eq("draw_id", selectedDraw.draw_id)
      .order("seq_no", { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setResults(data || []);
        setLoading(false);
      });
  }, [selectedDraw]);

  return (
    <div className="lb-section">
      <div className="lb-section-header">
        <h3 className="lb-section-title">🎰 Lucky Draw Results</h3>
      </div>

      {draws.length > 0 && (
        <div className="draw-selector">
          {draws.map(d => (
            <button key={d.draw_id} className={`test-pill ${selectedDraw?.draw_id === d.draw_id ? "active" : ""}`}
              onClick={() => setSelectedDraw(d)}>
              {d.draw_title || "Draw"}
            </button>
          ))}
        </div>
      )}

      {selectedDraw && <div className="event-strip">🎰 {selectedDraw.draw_title || "Lucky Draw"}</div>}
      {error && <div className="lb-error">{error}</div>}

      {loading ? (
        <div style={{ padding:"12px 0" }}><SkeletonRows n={4} /></div>
      ) : results.length === 0 ? (
        <div className="lb-empty">
          <span className="lb-empty-icon">🎰</span>
          No lucky draw results yet.
        </div>
      ) : results.map((r, i) => (
        <motion.div key={r.id} className="result-row"
          initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
          transition={{ delay: i * 0.05 }}>
          <div className="result-seq">{r.seq_no}</div>
          <div className="result-info">
            <div className="result-name">{r.winner_name}</div>
            <div className="result-sub">
              🎰 {r.draw_title || selectedDraw?.draw_title || "Lucky Draw"} · {fmtDate(r.announced_at)}
            </div>
          </div>
          <div className="result-prize gold">
            {fmtDrawPrize(r)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — LUCKY WHEEL HISTORY (unchanged)
═══════════════════════════════════════════════════════════════ */
function LuckyWheelHistory() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: wheelData, error: wheelErr } = await supabase
        .from("luckywheel_history")
        .select("id,user_id,created_at,result_type,coins_won,entry_type")
        .neq("result_type", "try_again_free")
        .order("created_at", { ascending: false })
        .limit(50);

      if (wheelErr) { setError(wheelErr.message); setLoading(false); return; }
      if (!wheelData || wheelData.length === 0) { setResults([]); setLoading(false); return; }

      const userIds = [...new Set(wheelData.map(r => r.user_id))];
      const { data: profileData } = await supabase
        .from("users_profiles")
        .select("user_id,id,full_name")
        .in("user_id", userIds);

      const nameMap = {};
      (profileData || []).forEach(p => {
        const key = p.user_id || p.id;
        if (key) nameMap[key] = p.full_name;
      });

      setResults(wheelData.map(r => ({ ...r, full_name: nameMap[r.user_id] || "—" })));
      setLoading(false);
    };
    load();
  }, []);

  const resultLabel = (type) => {
    if (type === "coins")       return "🪙 Coins";
    if (type === "gift")        return "🎁 Gift";
    if (type === "plus1_chance") return "➕ Bonus Spin";
    return type;
  };
  const wheelIcon = (type) => {
    if (type === "coins")       return "🪙";
    if (type === "gift")        return "🎁";
    if (type === "plus1_chance") return "🔄";
    return "🎡";
  };

  return (
    <div className="lb-section">
      <div className="lb-section-header">
        <h3 className="lb-section-title">🎡 Lucky Wheel Winners</h3>
        <span style={{ fontSize:"0.7rem", color:"var(--slate)", fontWeight:600 }}>Last 50 wins</span>
      </div>

      <div className="event-strip">🎡 Lucky Wheel</div>

      {error && <div className="lb-error">{error}</div>}

      {loading ? (
        <div style={{ padding:"12px 0" }}><SkeletonRows n={5} /></div>
      ) : results.length === 0 ? (
        <div className="lb-empty">
          <span className="lb-empty-icon">🎡</span>
          No lucky wheel wins yet.
        </div>
      ) : results.map((r, i) => {
        const name = r.full_name || "—";
        return (
          <motion.div key={r.id} className="result-row"
            initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: Math.min(i * 0.04, 0.4) }}>
            <div className="result-icon">{wheelIcon(r.result_type)}</div>
            <div className="result-info">
              <div className="result-name">{name}</div>
              <div className="result-sub">
                🎡 Lucky Wheel · {fmtDate(r.created_at)} · {r.entry_type === "paid" ? "Paid Spin" : "Free Spin"}
              </div>
            </div>
            <div className="result-prize blue">
              {resultLabel(r.result_type)}
              {r.result_type === "coins" && Number(r.coins_won) > 0 ? ` · ${fmtCoins(r.coins_won)}` : ""}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TABS & MAIN PAGE (with SEO)
═══════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "live",    label: "🏁 Live Board" },
  { id: "results", label: "🏆 Test Results" },
  { id: "draw",    label: "🎰 Lucky Draw" },
  { id: "wheel",   label: "🎡 Lucky Wheel" },
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("live");

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>AIDLA Leaderboard – Test Champions & Lucky Winners</title>
        <meta name="title" content="AIDLA Leaderboard – Test Champions & Lucky Winners" />
        <meta name="description" content="Celebrate top learners, test champions, lucky draw winners, and lucky wheel winners on the AIDLA platform. Real‑time leaderboard and results." />
        <meta name="keywords" content="AIDLA, leaderboard, test results, lucky draw, lucky wheel, winners, rankings" />
        <meta name="author" content="AIDLA" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <link rel="canonical" href="https://www.aidla.online/leaderboard" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.aidla.online/leaderboard" />
        <meta property="og:title" content="AIDLA Leaderboard – Test Champions & Lucky Winners" />
        <meta property="og:description" content="Celebrate top learners, test champions, lucky draw winners, and lucky wheel winners on the AIDLA platform." />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.aidla.online/leaderboard" />
        <meta property="twitter:title" content="AIDLA Leaderboard – Test Champions & Lucky Winners" />
        <meta property="twitter:description" content="Celebrate top learners, test champions, lucky draw winners, and lucky wheel winners on the AIDLA platform." />
        <meta property="twitter:image" content="https://www.aidla.online/og-home.jpg" />

      </Helmet>

      <div className="lb-root">
        <div className="bg-orbs">
          <div className="bg-orb-1" /><div className="bg-orb-2" /><div className="bg-orb-3" />
        </div>

        <div className="lb-container">
          <motion.div initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <span className="sec-label">Community</span>
            <h1 className="sec-title">AIDLA <span>Leaderboard</span></h1>
            <p className="sec-desc">
              Celebrate our top learners, test champions, lucky draw winners, and lucky wheel winners.
            </p>
          </motion.div>

          <motion.div className="lb-tabs" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
            {TABS.map(t => (
              <button key={t.id} className={`lb-tab ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }} transition={{ duration:0.25 }}>
              {activeTab === "live"    && <LiveLeaderboard />}
              {activeTab === "results" && <TestResults />}
              {activeTab === "draw"    && <LuckyDrawResults />}
              {activeTab === "wheel"   && <LuckyWheelHistory />}
            </motion.div>
          </AnimatePresence>
        </div>

        <Footer />  {/* Imported footer component */}
      </div>
    </>
  );
}