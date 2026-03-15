// VerifyCertificate.jsx — Public Certificate Verification Page
// Mobile-first · Zero horizontal scroll guaranteed
// Escapes App.jsx public wrapper via negative-margin reset
// Footer imported from /components/footer.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useParams } from 'react-router-dom';
import Footer from './components/footer';

const C = {
  blue:       '#0056D2',
  blueDark:   '#003A8C',
  ink:        '#1A1A2E',
  slate:      '#475569',
  muted:      '#94A3B8',
  border:     '#E8EDF5',
  bg:         '#F4F7FC',
  white:      '#FFFFFF',
  success:    '#059669',
  successBg:  '#ECFDF5',
  successBdr: '#6EE7B7',
  red:        '#DC2626',
  redBg:      '#FEF2F2',
  redBdr:     '#FECACA',
};

function SealBadge({ size = 46 }) {
  return (
    <svg viewBox="0 0 90 90" width={size} height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <radialGradient id="vsg2" cx="38%" cy="36%" r="65%">
          <stop offset="0%"   stopColor="#FFD85C"/>
          <stop offset="55%"  stopColor="#F5A623"/>
          <stop offset="100%" stopColor="#D4860A"/>
        </radialGradient>
      </defs>
      <circle cx="45" cy="46" r="43" fill="rgba(0,0,0,0.07)"/>
      <circle cx="45" cy="45" r="43" fill="url(#vsg2)"/>
      <circle cx="45" cy="45" r="43" fill="none" stroke="white"   strokeWidth="3"  opacity="0.85"/>
      <circle cx="45" cy="45" r="40" fill="none" stroke="#D4860A" strokeWidth="1"/>
      <circle cx="45" cy="45" r="33" fill="none" stroke="#78350F" strokeWidth="1"  strokeDasharray="3 2.5" opacity="0.4"/>
      <text x="45" y="37" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="8"  fontWeight="900" fill="#78350F" letterSpacing="1.5">AIDLA</text>
      <text x="45" y="50" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="900" fill="#78350F">✓</text>
      <text x="45" y="61" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="7"  fontWeight="900" fill="#78350F" letterSpacing="2">CERT</text>
      <circle cx="45" cy="4"  r="2.2" fill="#D4860A"/>
      <circle cx="45" cy="86" r="2.2" fill="#D4860A"/>
      <circle cx="4"  cy="45" r="2.2" fill="#D4860A"/>
      <circle cx="86" cy="45" r="2.2" fill="#D4860A"/>
    </svg>
  );
}

export default function VerifyCertificate() {
  const { certId }            = useParams();
  const [cert, setCert]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid]     = useState(false);

  useEffect(() => { verify(); }, [certId]);

  const verify = async () => {
    try {
      const { data, error } = await supabase
        .from('course_certificates').select('*').eq('id', certId).single();
      if (error || !data) { setValid(false); setLoading(false); return; }

      const { data: course  } = await supabase.from('course_courses')
        .select('title,level,category').eq('id', data.course_id).single();
      const { data: profile } = await supabase.from('users_profiles')
        .select('full_name').eq('user_id', data.user_id).single();

      setCert({
        ...data,
        course_title:    course?.title    || '—',
        course_level:    course?.level    || '',
        course_category: course?.category || '',
        student_name:    profile?.full_name || 'Learner',
      });
      setValid(true);
    } catch { setValid(false); }
    setLoading(false);
  };

  const issued = cert
    ? new Date(cert.issued_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
    : '';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        /* ═══════════════════════════════════════════════════════
           NUCLEAR OVERFLOW RESET
           The verify page lives inside App.jsx's public wrapper:
             <main class="container">
               <div class="card page">  ← this div has its own padding/margin
           We must escape that wrapper completely.
        ═══════════════════════════════════════════════════════ */

        /* Lock the whole document — two sources to cover all browsers */
        html { overflow-x: hidden !important; }
        body { overflow-x: hidden !important; max-width: 100vw !important; }

        /* The App.jsx public wrapper adds padding/margin — neutralise it */
        .vp-escape-wrapper {
          /* Pull out of any parent padding by using negative margins */
          margin-left:  calc(-1 * var(--app-pad, 0px));
          margin-right: calc(-1 * var(--app-pad, 0px));
          /* Safety: never let THIS element be wider than the viewport */
          width: 100vw;
          max-width: 100vw;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        /* ── Inner page layout ── */
        .vp-page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          background: ${C.bg};
          box-sizing: border-box;
          /* Reset any inherited font */
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Make every child respect the box */
        .vp-page *, .vp-page *::before, .vp-page *::after {
          box-sizing: border-box;
          max-width: 100%;
        }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        /* ── Top bar ── */
        .vp-topbar {
          width: 100%;
          max-width: 100%;
          background: ${C.white};
          border-bottom: 1px solid ${C.border};
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          overflow: hidden;       /* clip children that might bleed */
        }
        .vp-topbar-brand {
          font-weight: 900;
          font-size: 15px;
          letter-spacing: 2px;   /* small — large spacing adds phantom width */
          color: ${C.blueDark};
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .vp-topbar-label {
          font-size: 9px;
          font-weight: 700;
          color: ${C.muted};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: right;
          min-width: 0;
          flex-shrink: 1;
        }

        /* ── Content area ── */
        .vp-main {
          flex: 1;
          width: 100%;
          /* Centred column, never wider than 560px */
          max-width: 560px;
          margin: 0 auto;
          padding: 20px 16px 44px;
          overflow: hidden;
        }

        /* ── Verified banner ── */
        .vp-hero {
          background: ${C.successBg};
          border: 2px solid ${C.successBdr};
          border-radius: 14px;
          padding: 18px 14px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
          animation: fadeUp .4s ease both;
        }
        .vp-check-ring {
          width: 48px; height: 48px;
          min-width: 48px;
          border-radius: 50%;
          background: ${C.success};
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 5px rgba(5,150,105,.12);
        }
        .vp-check-icon {
          font-size: 20px; color: white; display: block;
          animation: checkPop .5s cubic-bezier(.34,1.56,.64,1) .1s both;
        }
        .vp-hero-body {
          flex: 1;
          min-width: 0;       /* ← required for text truncation in flex children */
          overflow: hidden;
        }
        .vp-hero-title {
          font-weight: 900;
          font-size: clamp(15px, 4vw, 19px);
          color: #064E3B;
          margin-bottom: 3px;
          line-height: 1.2;
        }
        .vp-hero-sub {
          font-size: clamp(11px, 2.8vw, 12.5px);
          color: #047857;
          line-height: 1.5;
        }

        /* ── Details card ── */
        .vp-card {
          background: ${C.white};
          border-radius: 14px;
          border: 1px solid ${C.border};
          box-shadow: 0 3px 16px rgba(0,0,0,.06);
          overflow: hidden;       /* clips the ghost watermark absolutely */
          margin-bottom: 12px;
          animation: fadeUp .45s ease .07s both;
        }
        .vp-card-head {
          background: linear-gradient(135deg, ${C.blueDark}, ${C.blue});
          padding: 16px 18px;
          position: relative;
          overflow: hidden;
        }
        /* Ghost watermark — contained inside overflow:hidden parent */
        .vp-card-head::after {
          content: 'AIDLA';
          position: absolute;
          right: -6px; top: 50%;
          transform: translateY(-50%);
          font-size: 56px; font-weight: 900;
          color: rgba(255,255,255,0.05);
          letter-spacing: 3px;
          pointer-events: none; user-select: none;
          white-space: nowrap;
        }
        .vp-card-eyebrow {
          font-size: 8.5px; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,0.5); margin-bottom: 4px;
        }
        .vp-card-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-style: italic; font-size: clamp(16px, 4vw, 21px);
          color: ${C.white}; font-weight: 400; line-height: 1.2;
        }
        .vp-card-body { padding: 16px 18px; }

        /* ── Data rows ── */
        .vp-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px solid ${C.border};
        }
        .vp-row:last-child { padding-bottom: 0; margin-bottom: 0; border-bottom: none; }

        .vp-row-label {
          font-size: 9.5px; font-weight: 700;
          color: ${C.muted}; text-transform: uppercase;
          letter-spacing: .7px; flex-shrink: 0;
          padding-top: 2px; min-width: 62px;
        }
        .vp-row-val {
          font-size: 13px; font-weight: 600; color: ${C.slate};
          text-align: right;
          /* Long cert IDs / UUIDs MUST wrap — never overflow */
          word-break: break-all;
          overflow-wrap: anywhere;
          min-width: 0;
          line-height: 1.4;
        }
        .vp-row-val.large {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(13px, 3.8vw, 16px);
          font-weight: 800; font-style: italic;
          color: ${C.ink};
          word-break: normal;
          overflow-wrap: break-word;
        }
        .vp-row-val.mono {
          font-family: 'Courier New', monospace;
          font-size: 10px; line-height: 1.6;
          word-break: break-all;
          overflow-wrap: anywhere;
        }

        /* ── Issuer strip ── */
        .vp-issuer {
          background: ${C.white};
          border: 1px solid ${C.border};
          border-radius: 12px;
          padding: 13px 14px;
          display: flex;
          align-items: center;
          gap: 11px;
          overflow: hidden;
          margin-bottom: 10px;
          animation: fadeUp .45s ease .14s both;
        }
        .vp-issuer-text {
          flex: 1;
          min-width: 0;   /* flex child needs this to respect overflow */
          overflow: hidden;
        }
        .vp-issuer-name {
          font-size: 12.5px; font-weight: 700; color: ${C.ink};
          margin-bottom: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .vp-issuer-sub {
          font-size: 10.5px; color: ${C.muted};
          line-height: 1.4;
          /* wrap rather than overflow on small screens */
          word-break: break-word;
        }
        .vp-valid-chip {
          flex-shrink: 0;
          background: ${C.successBg};
          border: 1.5px solid ${C.successBdr};
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 10.5px; font-weight: 800;
          color: ${C.success};
          white-space: nowrap;
        }

        /* ── Cert ID chip ── */
        .vp-id-chip {
          background: ${C.bg};
          border: 1px solid ${C.border};
          border-radius: 9px;
          padding: 10px 14px;
          overflow: hidden;
          animation: fadeUp .45s ease .2s both;
        }
        .vp-id-chip-label {
          font-size: 9px; font-weight: 700;
          color: ${C.muted}; text-transform: uppercase;
          letter-spacing: .8px; margin-bottom: 5px;
        }
        .vp-id-chip-val {
          font-family: 'Courier New', monospace;
          font-size: 10.5px; color: ${C.slate};
          word-break: break-all;
          overflow-wrap: anywhere;
          line-height: 1.55;
        }

        /* ── Invalid state ── */
        .vp-invalid {
          background: ${C.redBg};
          border: 2px solid ${C.redBdr};
          border-radius: 14px;
          padding: 28px 18px;
          text-align: center;
          overflow: hidden;
          animation: fadeUp .4s ease both;
        }
        .vp-invalid-icon  { font-size: 44px; display: block; margin-bottom: 12px; }
        .vp-invalid-title { font-weight: 900; font-size: clamp(16px,4.5vw,20px); color: ${C.red}; margin-bottom: 9px; }
        .vp-invalid-body  { font-size: clamp(11.5px,3vw,13px); color: #7F1D1D; line-height: 1.6; }
        .vp-invalid-id {
          display: block; margin-top: 14px;
          background: ${C.white}; border: 1px solid ${C.redBdr};
          border-radius: 6px; padding: 7px 12px;
          font-family: 'Courier New', monospace;
          font-size: 10px; color: ${C.red};
          word-break: break-all; overflow-wrap: anywhere;
          text-align: center;
        }

        /* ── Loading ── */
        .vp-loading {
          display: flex; flex-direction: column;
          align-items: center; gap: 13px;
          padding: 60px 0;
          animation: fadeIn .3s ease both;
        }
        .vp-spinner {
          width: 40px; height: 40px; flex-shrink: 0;
          border: 3.5px solid ${C.border};
          border-top-color: ${C.blue};
          border-radius: 50%;
          animation: spin .75s linear infinite;
        }
        .vp-loading-txt {
          font-size: 12.5px; font-weight: 600; color: ${C.muted};
          background: linear-gradient(90deg, ${C.muted} 25%, ${C.border} 50%, ${C.muted} 75%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 1.8s linear infinite;
        }

        /* ── Footer override — stop footer from causing scroll ──
           The footer's .ft-inner has padding:40px 24px which is fine
           on desktop but its .ft-grid gap can push things on mobile.
           We clamp the footer inside our escape wrapper too. */
        .vp-escape-wrapper .ft-root {
          max-width: 100%;
          overflow-x: hidden;
        }
        .vp-escape-wrapper .ft-inner {
          padding-left: 16px !important;
          padding-right: 16px !important;
          max-width: 100% !important;
          overflow-x: hidden;
        }
        .vp-escape-wrapper .ft-grid {
          overflow-x: hidden;
        }
        .vp-escape-wrapper .ft-nl-row {
          max-width: 100%;
        }
        @media(min-width: 480px) {
          .vp-topbar { padding: 13px 20px; }
          .vp-main   { padding: 24px 20px 52px; }
          .vp-hero   { padding: 20px 18px; gap: 14px; }
          .vp-card-head  { padding: 18px 22px; }
          .vp-card-body  { padding: 18px 22px; }
          .vp-issuer     { padding: 14px 18px; gap: 13px; }
          .vp-id-chip    { padding: 12px 16px; }
        }
        @media(min-width: 640px) {
          .vp-main { padding: 36px 24px 60px; }
          .vp-escape-wrapper .ft-inner {
            padding-left: 40px !important;
            padding-right: 40px !important;
          }
        }
      `}</style>

      {/*
        .vp-escape-wrapper breaks out of App.jsx's
        <main class="container"><div class="card page"> wrapper
        by filling 100vw regardless of what padding the parent has.
      */}
      <div className="vp-escape-wrapper">
        <div className="vp-page">

          {/* Top bar */}
          <div className="vp-topbar">
            <span className="vp-topbar-brand">AIDLA</span>
            <span className="vp-topbar-label">Certificate<br/>Verification</span>
          </div>

          {/* Main */}
          <main className="vp-main">

            {loading ? (
              <div className="vp-loading">
                <div className="vp-spinner"/>
                <span className="vp-loading-txt">Verifying certificate authenticity…</span>
              </div>

            ) : valid && cert ? (
              <>
                {/* Verified banner */}
                <div className="vp-hero">
                  <div className="vp-check-ring">
                    <span className="vp-check-icon">✓</span>
                  </div>
                  <div className="vp-hero-body">
                    <div className="vp-hero-title">Certificate Verified</div>
                    <div className="vp-hero-sub">
                      Authentic, unmodified AIDLA certificate.
                    </div>
                  </div>
                </div>

                {/* Details card */}
                <div className="vp-card">
                  <div className="vp-card-head">
                    <div className="vp-card-eyebrow">AIDLA · Verified</div>
                    <div className="vp-card-title">Certificate of Completion</div>
                  </div>
                  <div className="vp-card-body">
                    <div className="vp-row">
                      <span className="vp-row-label">Awarded To</span>
                      <span className="vp-row-val large">{cert.student_name}</span>
                    </div>
                    <div className="vp-row">
                      <span className="vp-row-label">Course</span>
                      <span className="vp-row-val">{cert.course_title}</span>
                    </div>
                    {cert.course_level && (
                      <div className="vp-row">
                        <span className="vp-row-label">Level</span>
                        <span className="vp-row-val">{cert.course_level}</span>
                      </div>
                    )}
                    {cert.course_category && (
                      <div className="vp-row">
                        <span className="vp-row-label">Category</span>
                        <span className="vp-row-val">{cert.course_category}</span>
                      </div>
                    )}
                    <div className="vp-row">
                      <span className="vp-row-label">Date Issued</span>
                      <span className="vp-row-val">{issued}</span>
                    </div>
                    <div className="vp-row">
                      <span className="vp-row-label">Cert No</span>
                      <span className="vp-row-val mono">{cert.certificate_number}</span>
                    </div>
                    <div className="vp-row">
                      <span className="vp-row-label">Cert ID</span>
                      <span className="vp-row-val mono">{cert.id}</span>
                    </div>
                  </div>
                </div>

                {/* Issuer strip */}
                <div className="vp-issuer">
                  <SealBadge size={44}/>
                  <div className="vp-issuer-text">
                    <div className="vp-issuer-name">Issued by AIDLA</div>
                    <div className="vp-issuer-sub">AI Digital Learning Academy · aidla.com</div>
                  </div>
                  <div className="vp-valid-chip">✓ Valid</div>
                </div>

                {/* Cert ID chip */}
                <div className="vp-id-chip">
                  <div className="vp-id-chip-label">Certificate ID</div>
                  <div className="vp-id-chip-val">{certId}</div>
                </div>
              </>

            ) : (
              <div className="vp-invalid">
                <span className="vp-invalid-icon">❌</span>
                <div className="vp-invalid-title">Certificate Not Found</div>
                <div className="vp-invalid-body">
                  This certificate ID does not exist in our records, or may have been revoked.
                  Contact AIDLA support if you believe this is an error.
                </div>
                <code className="vp-invalid-id">{certId}</code>
              </div>
            )}

          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
}