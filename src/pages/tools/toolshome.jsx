import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Footer from "../components/footer";
import "./tools.css";

/* ─────────────────────────────────────────────────────────────
   ALL TOOLS DATA
───────────────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: "results",
    icon: "📋",
    title: "Pakistan Board Results",
    badge: "🔥 Trending",
    badgeColor: "#e11d48",
    tools: [
      { to: "/tools/results",                   emoji: "🏛️", label: "All Board Results",       desc: "All 26 BISE boards — Punjab, KPK, Sindh, Balochistan, FBISE, AJK & GB.", badge: "26 Boards", badgeColor: "#1a3a8f" },
      { to: "/tools/results/bise-lahore",       emoji: "📋", label: "BISE Lahore",              desc: "Matric & Inter results — Lahore, Sheikhupura, Nankana Sahib." },
      { to: "/tools/results/fbise-islamabad",   emoji: "📋", label: "FBISE Islamabad",          desc: "Federal Board results for Islamabad & cantonment areas." },
      { to: "/tools/results/bise-karachi",      emoji: "📋", label: "BISE Karachi",             desc: "Matric & Inter results for all Karachi districts." },
      { to: "/tools/results/bise-peshawar",     emoji: "📋", label: "BISE Peshawar",            desc: "KPK board results — Peshawar, Charsadda, Nowshera." },
      { to: "/tools/results/bise-gujranwala",   emoji: "📋", label: "BISE Gujranwala",          desc: "Results for Gujranwala, Sialkot, Gujrat & more." },
      { to: "/tools/results/bise-rawalpindi",   emoji: "📋", label: "BISE Rawalpindi",          desc: "Results for Rawalpindi, Attock, Chakwal & Jhelum." },
      { to: "/tools/results/bise-faisalabad",   emoji: "📋", label: "BISE Faisalabad",          desc: "Results for Faisalabad, Jhang, Toba Tek Singh & Chiniot." },
    ],
    viewAll: { to: "/tools/results", label: "View all 26 boards →" },
  },
  {
    id: "ai",
    icon: "🤖",
    title: "AI-Powered Tools",
    badge: "✨ AIDLA AI",
    badgeColor: "#7c3aed",
    tools: [
      { to: "/tools/ai/summarizer",     emoji: "📝", label: "AI Summarizer",     desc: "Paste any article and get a smart AI summary in seconds.",           badge: "AI", badgeColor: "#7c3aed" },
      { to: "/tools/ai/paraphraser",    emoji: "🔄", label: "AI Paraphraser",    desc: "Rewrite text in academic, casual, formal or creative styles.",       badge: "AI", badgeColor: "#7c3aed" },
      { to: "/tools/ai/email-writer",   emoji: "📧", label: "AI Email Writer",   desc: "AI writes professional emails — open directly in Gmail or Outlook.", badge: "AI", badgeColor: "#7c3aed" },
      { to: "/tools/ai/interview-prep", emoji: "🎯", label: "AI Interview Prep", desc: "Enter a job title — get interview questions with ideal answers.",    badge: "AI", badgeColor: "#7c3aed" },
      { to: "/tools/ai/linkedin-bio",   emoji: "💼", label: "AI LinkedIn Bio",   desc: "Generate a powerful LinkedIn About section in seconds.",             badge: "AI", badgeColor: "#7c3aed" },
      { to: "/tools/ai/cover-letter",   emoji: "✉️", label: "AI Cover Letter",   desc: "AI writes a tailored cover letter for any job in seconds.",          badge: "AI", badgeColor: "#7c3aed" },
    ],
  },
  {
    id: "education",
    icon: "🎓",
    title: "Education Calculators",
    badge: "🇵🇰 Pakistan",
    badgeColor: "#0891b2",
    tools: [
      { to: "/tools/education/cgpa-calculator",         emoji: "🧮", label: "CGPA / GPA Calculator",    desc: "Calculate CGPA for Pakistani universities — 4.0 & 5.0 scale."              },
      { to: "/tools/education/mdcat-ecat-calculator",   emoji: "🏥", label: "MDCAT / ECAT Calculator",  desc: "Calculate medical & engineering admission aggregate in Pakistan."            },
      { to: "/tools/education/percentage-calculator",   emoji: "📊", label: "Percentage Calculator",    desc: "Marks to %, increase/decrease, what % of a number — all in one.",          badge: "New", badgeColor: "#059669" },
      { to: "/tools/education/grade-calculator",        emoji: "🅰️", label: "Grade Calculator",         desc: "Convert marks to letter grades — A+, A, B, C based on any grading scale.", badge: "New", badgeColor: "#059669" },
      { to: "/tools/education/attendance-calculator",   emoji: "📅", label: "Attendance Calculator",    desc: "Check if your attendance meets the required % for exams.",                  badge: "New", badgeColor: "#059669" },
      { to: "/tools/education/marks-to-grade",          emoji: "📈", label: "Marks to Grade Converter", desc: "Convert raw marks to GPA, percentage and letter grade instantly.",          badge: "New", badgeColor: "#059669" },
      { to: "/tools/education/study-planner",           emoji: "📚", label: "Study Planner",            desc: "Plan your study sessions across subjects before exams.",                    badge: "New", badgeColor: "#059669" },
      { to: "/tools/education/pomodoro-timer",          emoji: "⏱️", label: "Pomodoro Study Timer",     desc: "Focus timer with work/break intervals to boost study productivity.",        badge: "New", badgeColor: "#059669" },
      { to: "/tools/education/assignment-tracker",      emoji: "✅", label: "Assignment Tracker",       desc: "Track all your assignments, deadlines and completion status.",               badge: "New", badgeColor: "#059669" },
      { to: "/tools/education/flashcard-maker",         emoji: "🗂️", label: "Flashcard Maker",          desc: "Create digital flashcards to memorize concepts faster.",                    badge: "New", badgeColor: "#059669" },
      { to: "/tools/education/scholarship-eligibility", emoji: "🏆", label: "Scholarship Eligibility",  desc: "Check if your marks qualify for HEC, govt and private scholarships.",       badge: "New", badgeColor: "#059669" },
    ],
  },
  {
    id: "finance",
    icon: "💰",
    title: "Finance Calculators",
    badge: "🇵🇰 + 🇦🇪",
    badgeColor: "#059669",
    tools: [
      { to: "/tools/finance/salary-calculator",   emoji: "💵", label: "Salary / Tax Calculator", desc: "Calculate net salary after Pakistan income tax deductions.",    badge: "New", badgeColor: "#059669" },
      { to: "/tools/finance/zakat-calculator",    emoji: "🌙", label: "Zakat Calculator",         desc: "Calculate your Zakat on savings, gold, silver and assets.",     badge: "New", badgeColor: "#059669" },
      { to: "/tools/finance/loan-emi-calculator", emoji: "🏦", label: "Loan / EMI Calculator",    desc: "Calculate monthly EMI for home, car or personal loans.",         badge: "New", badgeColor: "#059669" },
      { to: "/tools/finance/tip-calculator",      emoji: "🧾", label: "Tip Calculator",           desc: "Split bills and calculate tips for groups easily.",              badge: "New", badgeColor: "#059669" },
    ],
  },
  {
    id: "health",
    icon: "❤️",
    title: "Health Calculators",
    badge: "🏥 Wellness",
    badgeColor: "#dc2626",
    tools: [
      { to: "/tools/health/bmi-calculator",          emoji: "⚖️", label: "BMI Calculator",         desc: "Calculate your Body Mass Index and healthy weight range.",         badge: "New", badgeColor: "#059669" },
      { to: "/tools/health/calorie-calculator",      emoji: "🔥", label: "Calorie Calculator",      desc: "Calculate daily calorie needs based on age, weight and activity.", badge: "New", badgeColor: "#059669" },
      { to: "/tools/health/water-intake-calculator", emoji: "💧", label: "Water Intake Calculator", desc: "Find out how much water you should drink daily.",                  badge: "New", badgeColor: "#059669" },
      { to: "/tools/health/sleep-calculator",        emoji: "😴", label: "Sleep Calculator",        desc: "Find the best bedtime or wake-up time based on sleep cycles.",     badge: "New", badgeColor: "#059669" },
    ],
  },
  {
    id: "career",
    icon: "💼",
    title: "Career Tools",
    badge: "🚀 Job Ready",
    badgeColor: "#d97706",
    tools: [
      { to: "/tools/career/cv-maker",           emoji: "🧑‍💼", label: "CV Maker",           desc: "Create a professional CV with 20+ templates. Print to PDF, no sign-up." },
      { to: "/tools/career/cover-letter-maker", emoji: "✉️",  label: "Cover Letter Maker", desc: "Tailored cover letters with 4 templates, adjustable tone. Live preview." },
    ],
  },
  {
    id: "utility",
    icon: "⚙️",
    title: "Utility Tools",
    badge: "✅ No Login",
    badgeColor: "#2563eb",
    tools: [
      { to: "/tools/utility/qr-code-generator",      emoji: "📱", label: "QR Code Generator",      desc: "Generate QR codes for URLs, text, WhatsApp, WiFi & more."             },
      { to: "/tools/utility/age-calculator",          emoji: "🎂", label: "Age Calculator",          desc: "Calculate exact age in years, months and days from any date."         },
      { to: "/tools/utility/word-counter",            emoji: "🔢", label: "Word Counter",            desc: "Count words, characters, sentences and reading time."                 },
      { to: "/tools/utility/password-generator",      emoji: "🔐", label: "Password Generator",      desc: "Generate strong, secure random passwords instantly.",                 badge: "New", badgeColor: "#059669" },
      { to: "/tools/utility/unit-converter",          emoji: "📏", label: "Unit Converter",          desc: "Convert length, weight, temperature, speed and more.",                badge: "New", badgeColor: "#059669" },
      { to: "/tools/utility/countdown-timer",         emoji: "⏳", label: "Countdown Timer",         desc: "Count down to any date — exams, events, deadlines.",                  badge: "New", badgeColor: "#059669" },
      { to: "/tools/utility/percentage-change",       emoji: "📉", label: "Percentage Change",       desc: "Calculate percentage increase or decrease between two values.",        badge: "New", badgeColor: "#059669" },
      { to: "/tools/utility/roman-numeral-converter", emoji: "🏛️", label: "Roman Numeral Converter", desc: "Convert numbers to Roman numerals and back.",                         badge: "New", badgeColor: "#059669" },
      { to: "/tools/utility/binary-converter",        emoji: "💻", label: "Binary Converter",        desc: "Convert decimal, binary, octal and hexadecimal numbers.",             badge: "New", badgeColor: "#059669" },
      { to: "/tools/utility/color-picker",            emoji: "🎨", label: "Color Picker",            desc: "Pick colors and get HEX, RGB, HSL values instantly.",                 badge: "New", badgeColor: "#059669" },
      { to: "/tools/utility/text-case-converter",     emoji: "🔡", label: "Text Case Converter",     desc: "Convert text to UPPERCASE, lowercase, Title Case and more.",          badge: "New", badgeColor: "#059669" },
    ],
  },
  {
    id: "pdf",
    icon: "📄",
    title: "PDF Tools",
    badge: "🔒 Private",
    badgeColor: "#db2777",
    tools: [
      { to: "/tools/pdf/word-to-pdf",  emoji: "📄", label: "Word → PDF",  desc: "Convert Word docs to PDF with perfect layout and formatting." },
      { to: "/tools/pdf/image-to-pdf", emoji: "🖼️", label: "Image → PDF", desc: "Combine JPG, PNG, WebP images into a single PDF."            },
    ],
  },
];

const ALL_TOOLS = CATEGORIES.flatMap(c =>
  c.tools.map(t => ({ ...t, categoryTitle: c.title, categoryId: c.id }))
);

const CAT_FILTERS = [
  { id: "all",       label: "All",       icon: "◎" },
  { id: "results",   label: "Results",   icon: "📋" },
  { id: "ai",        label: "AI",        icon: "🤖" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "finance",   label: "Finance",   icon: "💰" },
  { id: "health",    label: "Health",    icon: "❤️" },
  { id: "career",    label: "Career",    icon: "💼" },
  { id: "utility",   label: "Utility",   icon: "⚙️" },
  { id: "pdf",       label: "PDF",       icon: "📄" },
];

/* ─────────────────────────────────────────────────────────────
   RECENTLY VIEWED
───────────────────────────────────────────────────────────── */
const RECENT_KEY = "aidla_recent_tools";
const MAX_RECENT = 6;

function getRecentTools() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); }
  catch { return []; }
}

function addRecentTool(tool) {
  try {
    const prev = getRecentTools().filter(t => t.to !== tool.to);
    localStorage.setItem(RECENT_KEY, JSON.stringify(
      [{ to: tool.to, emoji: tool.emoji, label: tool.label }, ...prev].slice(0, MAX_RECENT)
    ));
  } catch { /* ignore */ }
}

/* ─────────────────────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────────────────────── */
function ToolRow({ tool, onVisit }) {
  return (
    <Link
      to={tool.to}
      className="tools-tool-row"
      onClick={() => onVisit(tool)}
      aria-label={`${tool.label} — ${tool.desc}`}
    >
      <div className="tools-tool-row-emoji" aria-hidden="true">{tool.emoji}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <span className="tools-tool-row-label">{tool.label}</span>
          {tool.badge && (
            <span className="tools-tool-row-badge" style={{
              background: `${tool.badgeColor}14`,
              color: tool.badgeColor,
              border: `1px solid ${tool.badgeColor}28`,
            }}>
              {tool.badge}
            </span>
          )}
        </div>
        <div className="tools-tool-row-desc">{tool.desc}</div>
      </div>
    </Link>
  );
}

function SearchRow({ tool, onVisit }) {
  return (
    <Link
      to={tool.to}
      className="tools-tool-row"
      onClick={() => onVisit(tool)}
      aria-label={`${tool.label} — ${tool.desc}`}
    >
      <div className="tools-tool-row-emoji" aria-hidden="true">{tool.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <span className="tools-tool-row-label">{tool.label}</span>
          {tool.badge && (
            <span className="tools-tool-row-badge" style={{
              background: `${tool.badgeColor}14`,
              color: tool.badgeColor,
              border: `1px solid ${tool.badgeColor}28`,
            }}>
              {tool.badge}
            </span>
          )}
        </div>
        <div className="tools-tool-row-desc">{tool.desc}</div>
      </div>
      <span aria-hidden="true" style={{ fontSize: 14, color: "#c8d0e8", flexShrink: 0 }}>›</span>
    </Link>
  );
}

function StatsStrip() {
  const stats = [
    { value: `${ALL_TOOLS.length}+`, label: "Free Tools" },
    { value: "No",                    label: "Ads" },
    { value: "8",                    label: "Categories" },
    { value: "100%",                 label: "Free" },
  ];
  return (
    <div className="tools-stats" role="list" aria-label="AIDLA highlights">
      {stats.map((s, i) => (
        <div key={i} className="tools-stat" role="listitem">
          <span className="tools-stat-value">{s.value}</span>
          <span className="tools-stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function ToolsHome() {
  const [search,       setSearch]       = useState("");
  const [openCats,     setOpenCats]     = useState(() => new Set());
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy,       setSortBy]       = useState("default");
  const [recentTools,  setRecentTools]  = useState(() => getRecentTools());

  const q = search.trim().toLowerCase();

  const handleVisit = useCallback((tool) => {
    addRecentTool(tool);
    setRecentTools(getRecentTools());
  }, []);

  const clearRecent = useCallback(() => {
    localStorage.removeItem(RECENT_KEY);
    setRecentTools([]);
  }, []);

  const filtered = useMemo(() => {
    if (!q && activeFilter === "all" && sortBy === "default") return null;
    let pool = [...ALL_TOOLS];
    if (activeFilter !== "all") pool = pool.filter(t => t.categoryId === activeFilter);
    if (q) pool = pool.filter(t =>
      t.label.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.categoryTitle.toLowerCase().includes(q)
    );
    if (sortBy === "new")
      pool = pool.filter(t => t.badge === "New").concat(pool.filter(t => t.badge !== "New"));
    else if (sortBy === "az")
      pool = [...pool].sort((a, b) => a.label.localeCompare(b.label));
    return pool;
  }, [q, activeFilter, sortBy]);

  const toggle = (id) =>
    setOpenCats(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const isFiltering = !!q || activeFilter !== "all" || sortBy !== "default";

  const visibleCategories = useMemo(() =>
    activeFilter === "all" ? CATEGORIES : CATEGORIES.filter(c => c.id === activeFilter),
    [activeFilter]
  );

  return (
    <>
      <Helmet>
        <title>Free Online Tools — Board Results, AI, Education, Finance &amp; More | AIDLA</title>
        <meta name="description" content="Free online tools for Pakistani students — Pakistan board results, AI email writer, CGPA calculator, MDCAT aggregate, percentage calculator, Zakat calculator, BMI, password generator, QR code and 60+ more tools. No sign-up needed." />
        <meta name="keywords" content="free online tools Pakistan, BISE result 2025, CGPA calculator, MDCAT calculator, AI email writer, percentage calculator, Zakat calculator, BMI calculator, password generator, QR code, AIDLA" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.aidla.online/tools" />
        <meta property="og:title" content="Free Online Tools — AIDLA" />
        <meta property="og:description" content="60+ free tools — Pakistan board results, AI, education, finance, health & utility. No sign-up." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.aidla.online/tools" />
        <meta property="og:image" content="https://www.aidla.online/og-home.jpg" />
        <meta property="og:site_name" content="AIDLA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Online Tools — AIDLA" />
        <meta name="twitter:description" content="60+ free tools — AI, education, finance, health & utility. No sign-up." />
        <meta name="twitter:image" content="https://www.aidla.online/og-home.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Free Online Tools — AIDLA",
          "description": "Free online tools — board results, AI, education, finance, health and utility.",
          "url": "https://www.aidla.online/tools",
          "publisher": { "@type": "Organization", "name": "AIDLA", "url": "https://www.aidla.online" },
        })}</script>
      </Helmet>

      <div className="tools-root">
        <div className="bg-orbs" aria-hidden="true">
          <div className="bg-orb-1" />
          <div className="bg-orb-2" />
          <div className="bg-orb-3" />
        </div>

        <div className="tools-wrap">

          {/* ── HERO ── */}
          <header className="tools-hero">
            <div className="tools-badge" aria-label={`${ALL_TOOLS.length} free tools`}>
              {ALL_TOOLS.length}+ Free Tools
            </div>
            <h1 className="tools-title">
              Free Online <span className="tools-title-accent">Tools</span>
            </h1>
            <p className="tools-sub">
              Board results, AI tools, education calculators, finance, health &amp; utility — all free, no sign-up required.
            </p>
            <div className="tools-pills" role="list" aria-label="Tool categories">
              {["📋 Board Results","🤖 AIDLA AI","🎓 Education","💰 Finance","❤️ Health","⚙️ Utility","📄 PDF"].map(p => (
                <span key={p} className="tools-pill" role="listitem">{p}</span>
              ))}
            </div>
          </header>

          {/* ── STATS STRIP ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <StatsStrip />
          </motion.div>

          {/* ── FEATURED ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link to="/autotube" className="tools-featured" aria-label="AutoTube by AIDLA — AI YouTube automation">
              <span style={{ fontSize: "clamp(1.5rem,5vw,1.9rem)", flexShrink: 0 }} aria-hidden="true">🎬</span>
              <div style={{ flex: 1, minWidth: 0, position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                  <span className="tools-featured-title">AutoTube by AIDLA</span>
                  <span className="tools-featured-badge">New AI Tool</span>
                </div>
                <p className="tools-featured-desc">
                  AI YouTube automation — titles, scripts, tags &amp; descriptions in seconds.
                </p>
              </div>
              <span aria-hidden="true" style={{ fontSize: 16, color: "rgba(255,255,255,0.25)", flexShrink: 0, position: "relative", zIndex: 1 }}>›</span>
            </Link>
          </motion.div>

          {/* ── SEARCH ── */}
          <motion.div
            className="tools-search-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.15 }}
          >
            <div className="tools-search-wrap" role="search">
              <span className="tools-search-icon" aria-hidden="true">🔍</span>
              <label htmlFor="tools-search-input" className="sr-only">Search tools</label>
              <input
                id="tools-search-input"
                className="tools-search"
                type="search"
                placeholder={`Search ${ALL_TOOLS.length}+ tools…`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label={`Search ${ALL_TOOLS.length}+ tools`}
                autoComplete="off"
                spellCheck="false"
              />
              {search && (
                <button className="tools-search-clear" onClick={() => setSearch("")} aria-label="Clear search">✕</button>
              )}
            </div>

            <div className="tools-filter-row" role="group" aria-label="Filter by category">
              <span className="tools-filter-label" aria-hidden="true">Filter:</span>
              <div className="tools-filter-chips">
                {CAT_FILTERS.map(f => (
                  <button
                    key={f.id}
                    className="tools-filter-chip"
                    aria-pressed={activeFilter === f.id}
                    onClick={() => setActiveFilter(f.id)}
                  >
                    <span aria-hidden="true">{f.icon}</span>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── SORT ROW ── */}
          {(isFiltering || filtered) && (
            <motion.div
              className="tools-sort-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="tools-sort-label" aria-live="polite">
                {filtered
                  ? `${filtered.length} tool${filtered.length !== 1 ? "s" : ""} found`
                  : `${ALL_TOOLS.length} tools`}
              </span>
              <div className="tools-sort-btns" role="group" aria-label="Sort tools">
                {[
                  { id: "default", label: "Default" },
                  { id: "new",     label: "🆕 New" },
                  { id: "az",      label: "A → Z" },
                ].map(s => (
                  <button
                    key={s.id}
                    className="tools-sort-btn"
                    aria-pressed={sortBy === s.id}
                    onClick={() => setSortBy(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── RECENTLY VIEWED ── */}
          {recentTools.length > 0 && !isFiltering && (
            <motion.div
              className="tools-recent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="tools-recent-header">
                <span className="tools-recent-title"><span aria-hidden="true">🕐</span> Recently Viewed</span>
                <button className="tools-recent-clear" onClick={clearRecent} aria-label="Clear recently viewed tools">Clear</button>
              </div>
              <div className="tools-recent-list" role="list" aria-label="Recently viewed tools">
                {recentTools.map(t => (
                  <Link
                    key={t.to} to={t.to}
                    className="tools-recent-chip"
                    onClick={() => handleVisit(t)}
                    role="listitem"
                    aria-label={t.label}
                  >
                    <span className="tools-recent-chip-emoji" aria-hidden="true">{t.emoji}</span>
                    <span className="tools-recent-chip-label">{t.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── SEARCH RESULTS ── */}
          <AnimatePresence>
            {isFiltering && filtered !== null && (
              <motion.div
                key="filtered"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="tools-results-box" role="region" aria-label="Search results">
                  <div className="tools-results-hdr" aria-live="polite">
                    {filtered.length > 0
                      ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}${q ? ` for "${search.trim()}"` : ""}`
                      : `No results${q ? ` for "${search.trim()}"` : ""}`}
                  </div>
                  {filtered.length > 0
                    ? filtered.map(t => <SearchRow key={t.to} tool={t} onVisit={handleVisit} />)
                    : <div className="tools-no-results">😕 Try a different keyword — e.g. "marks", "salary", "BMI", "CGPA"</div>
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── ACCORDIONS ── */}
          {!isFiltering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {visibleCategories.map((cat, ci) => {
                const isOpen = openCats.has(cat.id);
                return (
                  <motion.div
                    key={cat.id}
                    className="tools-accordion"
                    data-cat={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: ci * 0.05 }}
                  >
                    <button
                      className="tools-accordion-btn"
                      onClick={() => toggle(cat.id)}
                      aria-expanded={isOpen}
                      aria-controls={`cat-panel-${cat.id}`}
                      id={`cat-btn-${cat.id}`}
                    >
                      <span aria-hidden="true" style={{ fontSize: 17, flexShrink: 0 }}>{cat.icon}</span>
                      <div className="tools-accordion-title">
                        <span>{cat.title}</span>
                        <span className="tools-accordion-badge" style={{
                          background: `${cat.badgeColor}14`,
                          color: cat.badgeColor,
                          border: `1px solid ${cat.badgeColor}26`,
                        }}>
                          {cat.badge}
                        </span>
                      </div>
                      <span className="tools-accordion-count" aria-label={`${cat.tools.length} tools`}>
                        {cat.tools.length}
                      </span>
                      <span className={`tools-accordion-chevron${isOpen ? " open" : ""}`} aria-hidden="true">›</span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`cat-panel-${cat.id}`}
                          role="region"
                          aria-labelledby={`cat-btn-${cat.id}`}
                          key="panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.26, ease: [0.22,1,0.36,1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="tools-accordion-list">
                            {cat.tools.map(t => <ToolRow key={t.to} tool={t} onVisit={handleVisit} />)}
                            {cat.viewAll && (
                              <Link to={cat.viewAll.to} className="tools-accordion-viewall">
                                {cat.viewAll.label}
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="tools-cta" role="complementary" aria-label="Join AIDLA">
              <div className="tools-cta-inner-top" aria-hidden="true" />
              <div>
                <div className="tools-cta-free-badge">✦ Free · No Account Needed</div>
                <h2>Earn while you learn 🚀</h2>
                <p>Join AIDLA and start earning rewards as you build your skills.</p>
              </div>
              <Link to="/signup" className="tools-cta-btn">Join now ✦</Link>
            </div>
          </motion.div>

        </div>

        <style>{`.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}`}</style>

        <Footer />
      </div>
    </>
  );
}