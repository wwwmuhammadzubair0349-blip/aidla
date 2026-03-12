import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "../components/footer.css";
import logo from "/logo.png";
// Import professional icons
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaTiktok, FaInstagram, FaWhatsappSquare } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubscribe = async () => {
    const val = email.trim().toLowerCase();
    if (!val || !val.includes("@")) return;
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: val });
      if (error?.code === "23505") setStatus("exists");
      else if (error) setStatus("err");
      else { setStatus("ok"); setEmail(""); }
    } catch { setStatus("err"); }
    setTimeout(() => setStatus(null), 4000);
  };

  const pageLinks =[
    { label: "Home",          to: "/" },
    { label: "Blogs",         to: "/blogs" },
    { label: "News",          to: "/news" },
    { label: "FAQs",          to: "/faqs" },
    { label: "Leaderboard",   to: "/leaderboard" },
    { label: "About Us",      to: "/about" },
    { label: "Privacy Policy",to: "/privacy-policy" },
    { label: "Login",         to: "/login" },
    { label: "Sign Up",       to: "/signup" },
  ];

  const featureLinks =[
    { label: "Tests",       to: "/user/test" },
    { label: "Lucky Draw",  to: "/user/lucky-draw" },
    { label: "Lucky Wheel", to: "/user/lucky-wheel" },
    { label: "Mining",      to: "/user/Mining" },
  ];

  const supportLinks =[
    { label: "Help & Support", to: "/contact" },
    { label: "Terms of Use",   to: "/terms" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Contact Us",     to: "/contact" },
  ];

  return (
    <>
      {/* Non-blocking Font Loading for 100% Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Mulish:wght@300;400;500;600&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Mulish:wght@300;400;500;600&display=swap" />

      <footer className="ft-root">
        <div className="ft-accent" aria-hidden="true" />
        <div className="ft-inner">

          {/* Main grid */}
          <div className="ft-grid">

            {/* Brand column */}
            <div className="ft-brand">
              <div className="ft-logo">
                <span className="ft-logo-icon">
                  <img src={logo} alt="AIDLA Logo" width="34" height="34" loading="lazy" decoding="async" />
                </span>
                AIDLA
              </div>
              <p className="ft-tagline">
                Pakistan's #1 education platform. Learn, earn coins &amp; win real prizes.
              </p>
              <div className="ft-badge">🇵🇰 Made in Pakistan</div>

              <div className="ft-nl-label">Newsletter</div>
              {status === "ok" ? (
                <div className="ft-nl-ok" role="alert">✅ Subscribed successfully!</div>
              ) : (
                <div className="ft-nl-row">
                  <input
                    type="email"
                    id="newsletter-email"
                    name="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                    aria-label="Email for newsletter"
                    autoComplete="email"
                  />
                  <button onClick={handleSubscribe} aria-label="Subscribe to newsletter">Subscribe</button>
                </div>
              )}
              {status === "exists" && <p className="ft-nl-note" role="alert">Already subscribed.</p>}
              {status === "err"    && <p className="ft-nl-note ft-nl-err" role="alert">Something went wrong.</p>}
            </div>

            {/* Pages column */}
            <nav className="ft-col" aria-label="Footer Pages">
              <div className="ft-col-h">Pages</div>
              <ul>
                {pageLinks.map(l => (
                  <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
                ))}
              </ul>
            </nav>

            {/* Features column */}
            <nav className="ft-col" aria-label="Footer Features">
              <div className="ft-col-h">Features</div>
              <ul>
                {featureLinks.map(l => (
                  <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
                ))}
              </ul>

              <div className="ft-socials-h">Follow Us</div>
              <div className="ft-socials">
                <a href="https://www.facebook.com/profile.php?id=61586195563121" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Follow us on Facebook">
                  <FaFacebookF />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" title="Follow us on X (Twitter)">
                  <FaTwitter />
                </a>
                <a href="https://www.linkedin.com/company/aidla" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="Follow us on LinkedIn">
                  <FaLinkedinIn />
                </a>
                <a href="https://www.tiktok.com/@aidla_official" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="Follow us on TikTok">
                  <FaTiktok />
                </a>
                <a href="https://www.instagram.com/aidla_official/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Follow us on Instagram">
                  <FaInstagram />
                </a>
                <a href="https://whatsapp.com/channel/0029VbC6yju0rGiV5JaCqj42" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="Join our WhatsApp Channel">
                  <FaWhatsappSquare />
                </a>
              </div>
            </nav>

            {/* Support column */}
            <nav className="ft-col" aria-label="Footer Support">
              <div className="ft-col-h">Support</div>
              <ul>
                {supportLinks.map(l => (
                  <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
                ))}
              </ul>
            </nav>

          </div>

          {/* Bottom bar */}
          <div className="ft-bottom">
            <span>© {new Date().getFullYear()} <strong>AIDLA</strong>. All Rights Reserved. Made with ❤️ in Pakistan.</span>
            <div className="ft-bottom-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms">Terms &amp; Conditions</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}