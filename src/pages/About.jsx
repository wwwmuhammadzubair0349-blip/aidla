import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../pages/components/footer";
import "./About.css";

const SITE_URL = "https://aidla.online";

const FAQ_TEASER = [
  { q: "What is AIDLA and how does it work?", a: "AIDLA is Pakistan's #1 educational rewards platform. Create a free account, complete quizzes and tests, earn AIDLA Coins for every achievement, then redeem them for real prizes or cash withdrawals." },
  { q: "How do I earn AIDLA Coins?", a: "Earn coins by completing quizzes, topping leaderboards, spinning the daily Lucky Wheel, entering Lucky Draws, and achieving high ranks in tests. The more you learn, the more you earn." },
  { q: "Is AIDLA completely free to join?", a: "Yes — 100% free. No subscription, no hidden fees. Sign up, start learning, and start earning real rewards from day one." },
  { q: "How do I withdraw my earnings?", a: "Once you hit the minimum withdrawal threshold, convert your AIDLA Coins to cash and withdraw directly to your bank account or via EasyPaisa/JazzCash." },
  { q: "Are the Lucky Draws and Wheel spins fair?", a: "Absolutely. Our draw and wheel systems use verified random selection. Every participant has an equal, transparent chance. Results are logged so you can verify outcomes any time." },
];

const FREE_TOOLS = [
  { icon:"📄", title:"Free CV Maker",          desc:"Build a professional, ATS-friendly CV in minutes — no design skills needed. Pick a template, fill in your details, and download a polished PDF resume instantly. Completely free.",                              badge:"Live",  color:"#dbeafe", link:"/tools/career/cv-maker" },
  { icon:"✉️", title:"Cover Letter Maker",     desc:"Generate a tailored, professional cover letter for any job in seconds. Our AI-assisted builder helps you write compelling cover letters that hiring managers actually read.",                              badge:"Live",  color:"#d1fae5", link:"/tools/career/cover-letter-maker" },
  { icon:"🖼️", title:"Image to PDF",           desc:"Convert JPG, PNG, or any image file into a clean, shareable PDF document instantly. No account required, no watermarks — completely free every time.",                                                  badge:"Live",  color:"#fef3c7", link:"/tools/pdf/image-to-pdf" },
  { icon:"📝", title:"Word to PDF",            desc:"Upload your .docx Word document and convert it to a perfectly formatted PDF file in one click. Fast, free, and fully secure — your files are never stored.",                                             badge:"Live",  color:"#ede9fe", link:"/tools/pdf/word-to-pdf" },
  { icon:"🎨", title:"JPG to PNG Converter",   desc:"Convert JPG images to transparent-background PNG files instantly. Perfect for logos, profile pictures, and any design work. Free, fast, and requires no account.",                                      badge:"Live",  color:"#fce7f3", link:"/tools/image/jpg-to-png" },
  { icon:"🔧", title:"More Tools Coming Soon", desc:"We're constantly building new free tools — PDF compressor, background remover, QR code generator, image resizer, text to PDF, and much more. Follow AIDLA to be first to know when they launch.", badge:"Soon",  color:"#f1f5f9", link:"/tools" },
];

const DASHBOARD_FEATURES = [
  { icon:"🎓", title:"Courses",          desc:"Access structured online courses across Mathematics, Science, English, Islamiat, Computer Science, and more. Learn at your own pace and earn AIDLA Coins for every course you complete." },
  { icon:"🤖", title:"AI Learning",      desc:"Personalised AI-powered learning paths that adapt to your strengths and weaknesses. Get smart explanations, instant feedback, and topic recommendations tailored to your exact level." },
  { icon:"💬", title:"Free AI Chatbot",  desc:"AIDLA's built-in AI chatbot is available 24/7 to help you understand difficult topics, solve problems, get homework help, and answer any question — completely free, no limits." },
  { icon:"🎲", title:"Lucky Draw",       desc:"Enter daily and weekly Lucky Draws using your AIDLA Coins for a chance to win real cash, gadgets, and exclusive prizes. Every draw is fully transparent, fair, and verified." },
  { icon:"🎡", title:"Lucky Wheel",      desc:"Spin the daily Lucky Wheel to instantly win bonus coins, discount vouchers, and surprise rewards. A new spin resets every 24 hours — and it's always free." },
  { icon:"📝", title:"Tests & Quizzes",  desc:"Challenge yourself with thousands of topic-based quizzes and timed tests. Earn coins for every correct answer, top the leaderboard, and track your improvement over time." },
  { icon:"🛍️", title:"Rewards Shop",    desc:"Spend your hard-earned AIDLA Coins in our Rewards Shop. Choose from gift cards, branded merchandise, gadgets, or convert your coins directly to cash in seconds." },
  { icon:"🏆", title:"Leaderboard",      desc:"Compete with thousands of learners across Pakistan on our real-time leaderboard. Top rankers earn special bonus coins, exclusive badges, and featured recognition on the platform." },
];

const fadeUp = { initial:{ opacity:0, y:28 }, whileInView:{ opacity:1, y:0 }, viewport:{ once:true, margin:"-60px" }, transition:{ duration:0.6 } };
const stagger = (i) => ({ ...fadeUp, transition:{ duration:0.5, delay:i * 0.07 } });

function FAQItem({ q, a }) {
  return (
    <div className="ab-faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
      <details>
        <summary><span itemProp="name">{q}</span><span className="ab-faq-chevron" aria-hidden="true">▼</span></summary>
        <div className="ab-faq-answer" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
          <span itemProp="text">{a}</span>
        </div>
      </details>
    </div>
  );
}

export default function About() {
  const pageTitle = "About AIDLA — Free Tools, AI Learning & Rewards Platform Pakistan";
  const pageDesc  = "AIDLA offers free CV maker, cover letter maker, image to PDF, Word to PDF, JPG to PNG converter tools, plus AI-powered courses, a free AI chatbot, lucky draws, lucky wheel, quizzes, and a rewards shop. Pakistan's #1 free education and rewards platform.";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description"  content={pageDesc} />
        <meta name="keywords"     content="AIDLA, free CV maker Pakistan, cover letter maker free, image to PDF online, word to PDF free, JPG to PNG converter, AI learning Pakistan, online quizzes Pakistan, lucky draw Pakistan, AIDLA coins, free AI chatbot Pakistan, education rewards Pakistan" />
        <link rel="canonical"     href={`${SITE_URL}/about`} />
        <meta property="og:type"         content="website" />
        <meta property="og:url"          content={`${SITE_URL}/about`} />
        <meta property="og:title"        content={pageTitle} />
        <meta property="og:description"  content={pageDesc} />
        <meta property="og:image"        content={`${SITE_URL}/og-image.jpg`} />
        <meta property="og:site_name"    content="AIDLA" />
        <meta property="og:locale"       content="en_PK" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content={`${SITE_URL}/og-image.jpg`} />
        <meta name="robots"              content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script type="application/ld+json">{JSON.stringify({ "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":SITE_URL},{"@type":"ListItem","position":2,"name":"About","item":`${SITE_URL}/about`}] })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context":"https://schema.org","@type":"Organization","name":"AIDLA","url":SITE_URL,"logo":{"@type":"ImageObject","url":`${SITE_URL}/logo.png`},"description":pageDesc,"foundingDate":"2024","areaServed":"PK" })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context":"https://schema.org","@type":"WebSite","name":"AIDLA Free Tools","url":`${SITE_URL}/tools`,"description":"Free online tools for Pakistani students — CV maker, cover letter maker, image to PDF, Word to PDF, JPG to PNG converter and more." })}</script>
        <script type="application/ld+json">{JSON.stringify({ "@context":"https://schema.org","@type":"FAQPage","mainEntity":FAQ_TEASER.map(f=>({ "@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a} })) })}</script>
      </Helmet>

      <div className="ab-root">
        <div className="ab-orbs" aria-hidden="true">
          <div className="ab-orb ab-orb-1" /><div className="ab-orb ab-orb-2" /><div className="ab-orb ab-orb-3" />
        </div>

        {/* ══ HERO ══ */}
        <motion.section className="ab-hero" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} aria-label="About AIDLA">
          <nav aria-label="Breadcrumb" style={{ marginBottom:18 }}>
            <ol itemScope itemType="https://schema.org/BreadcrumbList" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8,listStyle:"none",padding:0,margin:0,fontSize:"0.75rem",fontWeight:600,color:"#94a3b8" }}>
              <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                <Link to="/" itemProp="item" style={{ color:"#64748b",textDecoration:"none" }}><span itemProp="name">Home</span></Link>
                <meta itemProp="position" content="1" />
              </li>
              <span aria-hidden="true">›</span>
              <li><span style={{ color:"#1a3a8f",fontWeight:700 }}>About</span></li>
            </ol>
          </nav>
          <motion.span className="ab-eyebrow" initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }} transition={{ delay:0.1 }}>✨ Our Story</motion.span>
          <motion.h1 className="ab-hero-title" initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}>
            Education That<br /><span>Rewards You</span>
          </motion.h1>
          <motion.p className="ab-hero-sub" initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }}>
            AIDLA is Pakistan's all-in-one free learning platform — AI-powered courses, a free AI chatbot, free productivity tools like CV maker and PDF converters, daily lucky draws, quizzes, and a real rewards system where your coins convert to actual cash.
          </motion.p>
          <motion.div className="ab-hero-btns" initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4 }}>
            <Link to="/signup" className="ab-btn-gold">✨ Join Free Today</Link>
            <Link to="/tools"  className="ab-btn-ghost">🔧 Free Tools</Link>
            <Link to="/faqs"   className="ab-btn-ghost">💬 FAQs</Link>
          </motion.div>
        </motion.section>

        {/* ══ BANNER ══ */}
        <motion.div className="ab-banner-wrap" initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.45,duration:0.7 }}>
          <div className="ab-banner-img">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80" alt="Pakistani students collaborating and learning on AIDLA" loading="eager" width="1400" height="480" />
          </div>
        </motion.div>

        <div className="ab-body">

          {/* ══ MISSION ══ */}
          <motion.div className="ab-mission" {...fadeUp}>
            <div className="ab-mission-img">
              <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80" alt="Pakistani student studying online for free" loading="lazy" width="800" height="900" />
              <div className="ab-mission-badge">
                <span className="ab-mission-badge-icon">🎯</span>
                <div><strong>Our Purpose</strong><small>Making learning intrinsically rewarding</small></div>
              </div>
            </div>
            <div>
              <span className="ab-label">Our Mission</span>
              <h2 className="ab-title">Why We Built <span>AIDLA</span></h2>
              <p className="ab-desc">
                Millions of Pakistani students study hard every day but feel unseen and unrewarded. AIDLA changes that. Every quiz you complete, every test you top, every Lucky Wheel spin — it translates into real coins and real rewards. On top of that, we give you free professional tools — CV maker, cover letter builder, file converters — that you'd normally pay for elsewhere, all completely free.
              </p>
              <div className="ab-pillars">
                {[
                  { icon:"📚", color:"#dbeafe", title:"Quality Learning",  desc:"Structured courses and quizzes built for Pakistan's curriculum, from primary to professional level." },
                  { icon:"🪙", color:"#fef3c7", title:"Real Rewards",      desc:"AIDLA Coins are redeemable for products, gift cards, or direct bank / EasyPaisa / JazzCash withdrawals." },
                  { icon:"🔧", color:"#d1fae5", title:"Free Useful Tools", desc:"CV maker, cover letter builder, image to PDF, Word to PDF, JPG to PNG — all 100% free, no account needed." },
                ].map((p, i) => (
                  <motion.div key={i} className="ab-pillar" {...stagger(i)}>
                    <div className="ab-pillar-icon" style={{ background:p.color }}>{p.icon}</div>
                    <div><h4>{p.title}</h4><p>{p.desc}</p></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ══ FREE TOOLS ══ */}
          <motion.section className="ab-tools-section" {...fadeUp} aria-labelledby="tools-heading">
            <div style={{ textAlign:"center", marginBottom:6 }}>
              <span className="ab-label">100% Free — No Account Needed</span>
            </div>
            <h2 className="ab-title ab-title--center" id="tools-heading">
              Free Online <span>Tools for Everyone</span>
            </h2>
            <p className="ab-desc ab-desc--center">
              Powerful free tools built for Pakistani students and professionals. No hidden charges. No watermarks. Just free tools available right now on AIDLA.
            </p>
            <div className="ab-tools-grid">
              {FREE_TOOLS.map((tool, i) => (
                <motion.div key={i} className="ab-tool-card" {...stagger(i)}>
                  <div className="ab-tool-top">
                    <div className="ab-tool-icon" style={{ background:tool.color }}>{tool.icon}</div>
                    <span className={`ab-tool-badge ${tool.badge === "Soon" ? "ab-tool-badge--soon" : ""}`}>
                      {tool.badge === "Live" ? "✅ Live" : "🔜 Coming Soon"}
                    </span>
                  </div>
                  <h3>{tool.title}</h3>
                  <p>{tool.desc}</p>
                  {tool.badge === "Live"
                    ? <Link to={tool.link} className="ab-tool-link">Use Free Tool →</Link>
                    : <span className="ab-tool-link ab-tool-link--soon">Stay tuned →</span>
                  }
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:36 }}>
              <Link to="/tools" className="ab-btn-primary">🔧 Browse All Free Tools →</Link>
            </div>
          </motion.section>

          <div className="ab-divider" />

          {/* ══ DASHBOARD FEATURES ══ */}
          <motion.section className="ab-features-section" {...fadeUp} aria-labelledby="features-heading">
            <div style={{ textAlign:"center", marginBottom:6 }}>
              <span className="ab-label">Inside Your Dashboard</span>
            </div>
            <h2 className="ab-title ab-title--center" id="features-heading">
              Everything in <span>Your AIDLA Account</span>
            </h2>
            <p className="ab-desc ab-desc--center">
              Sign up free and unlock a full ecosystem of learning, earning, and winning. Here's exactly what's waiting inside your AIDLA dashboard.
            </p>
            <div className="ab-features-grid">
              {DASHBOARD_FEATURES.map((f, i) => (
                <motion.article key={i} className="ab-feature-card" {...stagger(i)}>
                  <div className="ab-feature-icon-wrap">
                    <span className="ab-feature-icon">{f.icon}</span>
                  </div>
                  <div className="ab-feature-body">
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </motion.article>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:36 }}>
              <Link to="/signup" className="ab-btn-gold">✨ Create Free Account &amp; Unlock All →</Link>
            </div>
          </motion.section>

          <div className="ab-divider" />

          {/* ══ STORY ══ */}
          <motion.div className="ab-story" {...fadeUp}>
            <div className="ab-story-text">
              <span className="ab-label">Our Story</span>
              <h2 className="ab-story-title">Born in <span>Pakistan</span>,<br />Built for Learners</h2>
              <p className="ab-story-body">
                AIDLA started with a simple question: why do Pakistani students work so hard with so little recognition? We built a platform where every correct answer, every quiz, every rank achieved earns something tangible. We then added free tools — CV builder, cover letter maker, PDF converters — because we believe every Pakistani student deserves access to professional resources for free. We're not just an app. We're a movement.
              </p>
              <Link to="/faqs" className="ab-btn-gold" style={{ display:"inline-flex",alignItems:"center",gap:8,fontSize:"0.88rem",padding:"11px 24px" }}>
                💬 Got questions? Read our FAQs →
              </Link>
            </div>
            <div className="ab-story-highlights">
              {[
                { icon:"🏆", title:"Top-Ranked Platform",   desc:"Trusted by Pakistani learners nationwide" },
                { icon:"💵", title:"Real Cash Withdrawals", desc:"EasyPaisa, JazzCash & direct bank transfers" },
                { icon:"🎲", title:"Verified Fair Draws",   desc:"Transparent random selection every draw" },
                { icon:"🔧", title:"Free Tools No Login",   desc:"CV maker, PDF tools — use without an account" },
                { icon:"🤖", title:"Free AI Chatbot",       desc:"24/7 homework & study help, completely free" },
                { icon:"📱", title:"Mobile First",          desc:"Works perfectly on any smartphone browser" },
              ].map((h, i) => (
                <motion.div key={i} className="ab-story-hl" {...stagger(i)}>
                  <div className="ab-story-hl-icon">{h.icon}</div>
                  <div><strong>{h.title}</strong><span>{h.desc}</span></div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ══ COINS ══ */}
          <motion.section className="ab-coins-section" {...fadeUp} aria-labelledby="coins-heading">
            <div className="ab-coins-header">
              <span className="ab-label">The Coin System</span>
              <h2 className="ab-title ab-title--center" id="coins-heading">How <span>AIDLA Coins</span> Work</h2>
              <p className="ab-desc ab-desc--center">From learning to earning — a transparent, simple, powerful cycle.</p>
            </div>
            <div className="ab-coins-flow">
              {[
                { icon:"📝", num:"01", title:"Learn",      desc:"Complete quizzes, tests, and challenges at your own pace." },
                { icon:"🪙", num:"02", title:"Earn Coins", desc:"Every quiz, top rank, and lucky spin rewards you with AIDLA Coins." },
                { icon:"🛍️", num:"03", title:"Redeem",    desc:"Use coins in the Rewards Shop for gadgets, gift cards, and more." },
                { icon:"💵", num:"04", title:"Cash Out",   desc:"Convert coins to real money and withdraw to your bank." },
              ].map((s, i) => (
                <motion.div key={i} className="ab-coin-step" {...stagger(i)}>
                  <div className="ab-coin-step-num">{s.num}</div>
                  <span className="ab-coin-step-icon" aria-hidden="true">{s.icon}</span>
                  <h4>{s.title}</h4><p>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ══ VALUES ══ */}
          <motion.section className="ab-values-section" {...fadeUp} aria-labelledby="values-heading">
            <div style={{ textAlign:"center" }}>
              <span className="ab-label">What We Stand For</span>
              <h2 className="ab-title ab-title--center" id="values-heading">Our Core <span>Values</span></h2>
              <p className="ab-desc ab-desc--center">Everything we build is guided by these principles.</p>
            </div>
            <div className="ab-values-grid">
              {[
                { icon:"🔍", title:"Transparency",     desc:"Every draw, result, and coin transaction is openly logged. No smoke, no mirrors — just honest outcomes." },
                { icon:"🤝", title:"Inclusivity",      desc:"We build for every learner — regardless of background, city, or device. Free for absolutely everyone." },
                { icon:"⚡", title:"Motivation",       desc:"Tangible prizes and real coins keep students engaged and coming back every single day of the year." },
                { icon:"🎓", title:"Academic Quality", desc:"Quiz content reviewed by educators. Fun and rigorous absolutely coexist here on AIDLA." },
                { icon:"🔒", title:"Trust & Safety",   desc:"Your data, your coins, your privacy — protected with the highest standards of security and fair play." },
                { icon:"🚀", title:"Constant Growth",  desc:"We listen to our community and ship improvements weekly. Tomorrow is always better than today." },
              ].map((v, i) => (
                <motion.div key={i} className="ab-value-card" {...stagger(i)}>
                  <span className="ab-value-icon" aria-hidden="true">{v.icon}</span>
                  <h3>{v.title}</h3><p>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ══ FAQ TEASER ══ */}
          <motion.section className="ab-faq-section" {...fadeUp} aria-labelledby="faq-heading" itemScope itemType="https://schema.org/FAQPage">
            <div className="ab-faq-inner">
              <div className="ab-faq-left">
                <span className="ab-label">Got Questions?</span>
                <h2 className="ab-title" id="faq-heading">Frequently Asked<br /><span>Questions</span></h2>
                <p className="ab-desc">Quick answers to what people ask us most. We have {FAQ_TEASER.length} here — many more on our full FAQ page.</p>
                <br />
                <Link to="/faqs" className="ab-faq-see-all">📚 Browse All FAQs →</Link>
                <div style={{ marginTop:16, padding:"14px 16px", background:"rgba(26,58,143,0.04)", borderRadius:12, border:"1px solid rgba(26,58,143,0.1)", fontSize:"0.82rem", color:"#64748b", lineHeight:1.6 }}>
                  💡 Can't find your answer?{" "}<Link to="/faqs#ask-question" style={{ color:"#1a3a8f",fontWeight:700,textDecoration:"none" }}>Ask us directly →</Link>
                </div>
              </div>
              <div>
                <div className="ab-faq-list">
                  {FAQ_TEASER.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
                </div>
                <Link to="/faqs" className="ab-faq-more">💬 See all questions &amp; answers on the FAQ page →</Link>
              </div>
            </div>
          </motion.section>

          {/* ══ CTA ══ */}
          <motion.div className="ab-cta" {...fadeUp}>
            <div className="ab-cta-inner">
              <h2>Ready to Start<br /><span>Your Journey?</span></h2>
              <p>Join thousands of Pakistani learners already earning real rewards, using free tools, and unlocking their full potential — all on one completely free platform.</p>
              <div className="ab-cta-btns">
                <Link to="/signup" className="ab-cta-btn-primary">✨ Create Free Account</Link>
                <Link to="/tools"  className="ab-cta-btn-ghost">🔧 Try Free Tools</Link>
                <Link to="/faqs"   className="ab-cta-btn-ghost">💬 Read FAQs</Link>
              </div>
            </div>
          </motion.div>

        </div>
        <Footer />
      </div>
    </>
  );
}