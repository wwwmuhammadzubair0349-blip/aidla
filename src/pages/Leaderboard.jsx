import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

/* ═══════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --navy: #0b1437;
    --royal: #1a3a8f;
    --sky: #3b82f6;
    --gold: #f59e0b;
    --gold-light: #fcd34d;
    --slate: #64748b;
    --card-bg: rgba(255,255,255,0.97);
    --green: #10b981;
    --red: #ef4444;
  }

  * { box-sizing: border-box; }

  .lb-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .bg-orbs { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .bg-orb-1 { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: rgba(59,130,246,0.06); filter: blur(80px); top: -200px; left: -200px; }
  .bg-orb-2 { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: rgba(245,158,11,0.05); filter: blur(80px); top: 300px; right: -250px; }
  .bg-orb-3 { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: rgba(16,185,129,0.04); filter: blur(80px); bottom: 200px; left: 20%; }

  .lb-container {
    flex: 1; max-width: 900px; margin: 0 auto;
    padding: clamp(20px, 5vw, 60px) clamp(14px, 4vw, 32px) clamp(40px, 8vw, 80px);
    position: relative; z-index: 2; width: 100%;
  }

  .sec-label {
    display: inline-block;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: var(--navy); padding: 6px 14px; border-radius: 30px;
    font-size: 0.7rem; font-weight: 800; letter-spacing: 0.06em;
    text-transform: uppercase; margin-bottom: 10px;
    box-shadow: 0 4px 12px rgba(245,158,11,0.25);
  }
  .sec-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.6rem, 6vw, 2.5rem); font-weight: 900;
    color: var(--navy); line-height: 1.15; margin-bottom: 8px;
  }
  .sec-title span {
    background: linear-gradient(135deg, var(--royal), var(--sky));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sec-desc {
    color: var(--slate); font-size: clamp(0.85rem, 2vw, 1rem);
    line-height: 1.5; max-width: 520px; margin-bottom: 32px;
  }

  .lb-tabs { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
  .lb-tab {
    padding: 9px 18px; border-radius: 30px; font-size: 0.75rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer;
    background: var(--card-bg); color: var(--slate);
    box-shadow: 0 2px 10px rgba(11,20,55,0.06);
    border: 1px solid rgba(59,130,246,0.08); transition: all 0.2s;
  }
  .lb-tab:hover { color: var(--navy); box-shadow: 0 4px 16px rgba(11,20,55,0.1); }
  .lb-tab.active {
    background: linear-gradient(135deg, var(--royal), var(--sky));
    color: #fff; box-shadow: 0 4px 16px rgba(26,58,143,0.28); border-color: transparent;
  }

  .lb-section {
    background: var(--card-bg); border-radius: 24px;
    box-shadow: 0 8px 40px rgba(11,20,55,0.06);
    border: 1px solid rgba(59,130,246,0.08); overflow: hidden; margin-bottom: 24px;
  }
  .lb-section-header {
    padding: clamp(14px, 3.5vw, 20px) clamp(16px, 4vw, 28px);
    border-bottom: 1px solid rgba(59,130,246,0.08);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  }
  .lb-section-title {
    font-family: 'Playfair Display', serif; font-size: clamp(1rem, 3vw, 1.25rem);
    font-weight: 800; color: var(--navy); margin: 0;
    display: flex; align-items: center; gap: 8px;
  }

  /* Event name strip */
  .event-strip {
    padding: 8px clamp(16px, 4vw, 28px);
    background: rgba(26,58,143,0.04);
    border-bottom: 1px solid rgba(59,130,246,0.07);
    font-size: 0.7rem; font-weight: 700; color: var(--royal);
    display: flex; align-items: center; gap: 6px;
  }

  /* Live badge */
  .live-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(239,68,68,0.1); color: var(--red);
    padding: 4px 10px; border-radius: 20px;
    font-size: 0.62rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
  }
  .live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--red);
    animation: pulse-dot 1s ease-in-out infinite;
  }
  @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.7); } }

  /* Rank rows */
  .rank-list { padding: 0; margin: 0; list-style: none; }
  .rank-row {
    display: grid; grid-template-columns: 44px 1fr auto auto;
    align-items: center; gap: clamp(8px,2vw,14px);
    padding: clamp(10px,2.5vw,14px) clamp(16px,4vw,28px);
    border-bottom: 1px solid rgba(59,130,246,0.05);
    transition: background 0.15s; position: relative;
  }
  .rank-row:last-child { border-bottom: none; }
  .rank-row:hover { background: rgba(59,130,246,0.025); }
  .rank-row.rank-1 { background: linear-gradient(90deg, rgba(245,158,11,0.06), transparent); }
  .rank-row.rank-2 { background: linear-gradient(90deg, rgba(148,163,184,0.06), transparent); }
  .rank-row.rank-3 { background: linear-gradient(90deg, rgba(205,127,50,0.06), transparent); }
  .rank-row.moved-up   { animation: flash-green 0.6s ease; }
  .rank-row.moved-down { animation: flash-red 0.6s ease; }
  @keyframes flash-green { 0%,100% { background:inherit; } 30% { background:rgba(16,185,129,0.12); } }
  @keyframes flash-red   { 0%,100% { background:inherit; } 30% { background:rgba(239,68,68,0.08); } }

  .rank-badge {
    width: 36px; height: 36px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; font-weight: 900; flex-shrink: 0;
  }
  .rank-badge.r1 { background: linear-gradient(135deg,#f59e0b,#fcd34d); color:var(--navy); box-shadow:0 3px 10px rgba(245,158,11,0.3); }
  .rank-badge.r2 { background: linear-gradient(135deg,#94a3b8,#cbd5e1); color:#fff; }
  .rank-badge.r3 { background: linear-gradient(135deg,#cd7f32,#e8a45a); color:#fff; }
  .rank-badge.rn { background: rgba(59,130,246,0.08); color:var(--slate); font-size:0.85rem; }

  .rank-name { font-weight:700; font-size:clamp(0.82rem,2vw,0.95rem); color:var(--navy); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .rank-sub  { font-size:0.65rem; color:var(--slate); font-weight:500; margin-top:2px; }
  .rank-score { font-family:'Playfair Display',serif; font-size:clamp(0.95rem,2.5vw,1.1rem); font-weight:900; color:var(--navy); text-align:right; }
  .rank-score-label { font-size:0.6rem; color:var(--slate); font-weight:600; text-transform:uppercase; text-align:right; margin-top:1px; }
  .rank-time { font-size:0.68rem; color:var(--slate); font-weight:600; text-align:right; min-width:50px; }
  .rank-arrow { font-size:0.7rem; font-weight:900; position:absolute; right:clamp(16px,4vw,28px); }
  .rank-arrow.up { color:var(--green); }
  .rank-arrow.down { color:var(--red); }

  /* Selector pills */
  .test-selector, .draw-selector {
    display:flex; gap:8px; flex-wrap:wrap;
    padding: clamp(12px,3vw,16px) clamp(16px,4vw,28px);
    border-bottom: 1px solid rgba(59,130,246,0.08);
    background: rgba(59,130,246,0.02);
  }
  .test-pill {
    padding: 6px 14px; border-radius: 20px; font-size: 0.68rem; font-weight: 700;
    cursor: pointer; border: 1px solid rgba(59,130,246,0.15);
    background: transparent; color: var(--slate); transition: all 0.2s;
    white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis;
  }
  .test-pill:hover { border-color: var(--sky); color: var(--royal); }
  .test-pill.active {
    background: linear-gradient(135deg, var(--royal), var(--sky));
    color: #fff; border-color: transparent;
    box-shadow: 0 3px 10px rgba(26,58,143,0.2);
  }

  /* Winner cards */
  .winners-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(200px,100%),1fr));
    gap: 14px;
    padding: clamp(16px,4vw,24px) clamp(16px,4vw,28px);
  }
  .winner-card {
    background: linear-gradient(135deg,rgba(11,20,55,0.03),rgba(59,130,246,0.04));
    border: 1px solid rgba(59,130,246,0.1);
    border-radius: 18px; padding: 18px 16px; text-align: center; overflow: hidden;
  }
  .winner-card.rank-1-card { background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(252,211,77,0.05)); border-color:rgba(245,158,11,0.2); }
  .winner-card.rank-2-card { background:linear-gradient(135deg,rgba(148,163,184,0.08),rgba(203,213,225,0.05)); border-color:rgba(148,163,184,0.2); }
  .winner-card.rank-3-card { background:linear-gradient(135deg,rgba(205,127,50,0.08),rgba(232,164,90,0.05)); border-color:rgba(205,127,50,0.2); }
  .winner-emoji { font-size:2rem; display:block; margin-bottom:8px; }
  .winner-rank-label { font-size:0.6rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:var(--slate); margin-bottom:4px; }
  .winner-name { font-family:'Playfair Display',serif; font-size:1rem; font-weight:800; color:var(--navy); margin-bottom:4px; word-break:break-word; }
  .winner-event { font-size:0.65rem; color:var(--slate); margin-bottom:6px; font-weight:500; }
  .winner-prize { background:rgba(245,158,11,0.1); color:#92400e; padding:4px 10px; border-radius:20px; font-size:0.68rem; font-weight:700; display:inline-block; margin-bottom:4px; }
  .winner-date { font-size:0.65rem; color:var(--slate); margin-top:6px; }
  .winner-note { font-size:0.68rem; color:var(--slate); margin-top:4px; }

  /* Result rows (draw / wheel) */
  .result-row {
    display: flex; align-items: center; gap: 12px;
    padding: clamp(10px,2.5vw,14px) clamp(16px,4vw,28px);
    border-bottom: 1px solid rgba(59,130,246,0.05);
  }
  .result-row:last-child { border-bottom: none; }
  .result-seq {
    width:32px; height:32px; border-radius:50%;
    background:linear-gradient(135deg,var(--gold),var(--gold-light));
    color:var(--navy); display:flex; align-items:center; justify-content:center;
    font-size:0.72rem; font-weight:900; flex-shrink:0;
    box-shadow:0 2px 8px rgba(245,158,11,0.25);
  }
  .result-icon {
    width:34px; height:34px; border-radius:50%;
    background:linear-gradient(135deg,var(--royal),var(--sky));
    color:#fff; display:flex; align-items:center; justify-content:center;
    font-size:0.9rem; flex-shrink:0; box-shadow:0 2px 8px rgba(26,58,143,0.2);
  }
  .result-info { flex:1; min-width:0; }
  .result-name { font-weight:700; font-size:clamp(0.82rem,2vw,0.92rem); color:var(--navy); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .result-sub  { font-size:0.65rem; color:var(--slate); margin-top:2px; }
  .result-prize {
    padding:4px 10px; border-radius:20px; font-size:0.65rem; font-weight:700;
    text-align:right; max-width:160px; word-break:break-word; flex-shrink:0;
  }
  .result-prize.gold { background:rgba(245,158,11,0.1); color:#92400e; }
  .result-prize.blue { background:rgba(59,130,246,0.1); color:var(--royal); }

  /* Skeleton */
  .skel-bg {
    background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);
    background-size:400% 100%; animation:skel-load 1.5s ease-in-out infinite; border-radius:6px;
  }
  @keyframes skel-load { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .lb-empty { text-align:center; padding:clamp(28px,6vw,48px) 20px; color:var(--slate); font-size:0.88rem; }
  .lb-empty-icon { font-size:2rem; display:block; margin-bottom:10px; }
  .lb-error {
    background:rgba(254,226,226,0.9); border:1px solid #fca5a5; color:#991b1b;
    padding:10px 16px; border-radius:12px; font-size:0.82rem; font-weight:600;
    margin:12px clamp(16px,4vw,28px);
  }

  .site-footer {
    background:var(--navy); color:rgba(255,255,255,0.6);
    padding:36px 24px; text-align:center; font-size:0.85rem;
    margin-top:40px; position:relative; z-index:2;
  }
  .site-footer strong { color:var(--gold-light); }
  .site-footer a { color:rgba(255,255,255,0.4); text-decoration:none; margin:0 10px; }
  .site-footer a:hover { color:#fff; }

  @media (max-width:640px) {
    .site-footer { padding:18px 14px; font-size:0.72rem; margin-top:24px; }
    .rank-row { grid-template-columns:36px 1fr auto; }
    .rank-time { display:none; }
    .winners-grid { grid-template-columns:1fr 1fr; }
  }
  @media (max-width:380px) {
    .lb-container { padding:16px 12px 40px; }
    .winners-grid { grid-template-columns:1fr; }
    .rank-badge { width:30px; height:30px; font-size:0.85rem; border-radius:9px; }
  }
`;

/* ═══════════════════════════════════════════════════════════════
   HELPERS
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

// Coins as plain integer — no decimals
function fmtCoins(val) {
  const n = Number(val);
  if (!n && n !== 0) return null;
  return Math.floor(n).toLocaleString();
}

// Smart prize formatter — cleans raw decimal strings like "1000.00000 coins"
function fmtDrawPrize(r) {
  const coins = Number(r.coins_amount);
  if (coins > 0) return `🪙 ${fmtCoins(coins)}`;
  if (r.prize_text) {
    // If prize_text looks like a number (with optional decimals + optional " coins"), reformat it
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
   SECTION 1 — LIVE LEADERBOARD
   Only shows tests where status is NOT 'finished' or 'out'
═══════════════════════════════════════════════════════════════ */
function LiveLeaderboard() {
  const [tests, setTests]             = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [rows, setRows]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const channelRef                    = useRef(null);
  const prevPositions                 = useRef({});

  // Only active (non-finished) tests
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
   SECTION 2 — TEST RESULTS (test_winners)
   Shows: test name, user name, prize, coins as integer, date
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
   SECTION 3 — LUCKY DRAW RESULTS
   Shows: draw title, user name, prize, coins as integer, date
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
   SECTION 4 — LUCKY WHEEL HISTORY
   Excludes try_again_free. Joins users_profiles.full_name.
   Event title = "Lucky Wheel" (same for all). Coins as integer.
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
      // Try matching on user_id column first, fallback to id column
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

      {/* Fixed event name — all wheel entries share the same title */}
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
   MAIN PAGE
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
    <div className="lb-root">
      <style>{styles}</style>
      <div className="bg-orbs">
        <div className="bg-orb-1" /><div className="bg-orb-2" /><div className="bg-orb-3" />
      </div>

      <div className="lb-container">
        <motion.div initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <span className="sec-label">Community</span>
          <h2 className="sec-title">AIDLA <span>Leaderboard</span></h2>
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

      <footer className="site-footer">
        <div style={{ marginBottom:10, fontSize:"1.1rem" }}>🕌</div>
        <p>© 2025 <strong>AIDLA</strong>. All rights reserved. Designed with ❤️ for learners everywhere.</p>
        <p style={{ marginTop:8 }}>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </p>
      </footer>
    </div>
  );
}