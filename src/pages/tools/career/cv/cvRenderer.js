/* career/cv/cvRenderer.js
   ----------------------------------------------------------------
   UNIVERSAL PREMIUM CV RENDERER (VIP EDITION)
   - Data-driven Zone Layout Engine
   - Thumbnail lives inside template object
   - Add template once here -> shows automatically in Templates tab
   - Perfect Object-Fit Clipping for Photos (Circles/Squares)
   - ALL user fields rendered: GPA, edu notes, awards desc, full
     reference contacts, cert issuer/expiry/credId, project URL/status,
     personal meta (nationality, DOB, driving, notice, marital, gender)
   ---------------------------------------------------------------- */

const THUMBS = {
  modernStack: (c) => `
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="62" height="4" fill="${c}"/>
    <rect x="8" y="10" width="28" height="4" rx="2" fill="#0f172a"/>
    <rect x="8" y="17" width="18" height="2" rx="1" fill="${c}"/>
    <circle cx="46" cy="15" r="8" fill="${c}" opacity="0.15"/>
    <rect x="8" y="30" width="46" height="1" fill="#e2e8f0"/>
    <rect x="8" y="36" width="20" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="42" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="46" width="38" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="8" y="56" width="16" height="2" rx="1" fill="#0f172a"/>
    <rect x="8" y="62" width="46" height="1.5" rx="0.75" fill="#e2e8f0"/>
  `,
  pureWhite: (c) => `
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="25" y="8" width="12" height="12" rx="3" fill="#e5e7eb"/>
    <rect x="11" y="24" width="40" height="3" rx="1.5" fill="#0f172a"/>
    <rect x="19" y="30" width="24" height="1.5" rx="0.75" fill="${c}"/>
    <rect x="8" y="42" width="46" height="1" fill="#e2e8f0"/>
    <rect x="23" y="48" width="16" height="1.5" rx="0.75" fill="#0f172a"/>
    <rect x="15" y="54" width="32" height="1" rx="0.5" fill="#94a3b8"/>
  `,
  swissClean: (c) => `
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="20" height="82" fill="#f8fafc"/>
    <rect x="19" y="0" width="1" height="82" fill="#e2e8f0"/>
    <rect x="4" y="8" width="12" height="12" rx="2" fill="#e2e8f0"/>
    <rect x="26" y="8" width="26" height="4" rx="1" fill="#0f172a"/>
    <rect x="26" y="16" width="14" height="1.5" rx="0.75" fill="${c}"/>
    <rect x="26" y="30" width="18" height="2" rx="1" fill="#0f172a"/>
    <rect x="26" y="36" width="28" height="1.5" rx="0.75" fill="#e2e8f0"/>
    <rect x="26" y="41" width="22" height="1.5" rx="0.75" fill="#e2e8f0"/>
  `,
  inkLine: (c) => `
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="8" y="10" width="26" height="3" rx="1" fill="#0f172a"/>
    <circle cx="48" cy="14" r="7" fill="#e5e7eb"/>
    <rect x="8" y="26" width="46" height="1" fill="#e2e8f0"/>
    <rect x="8" y="34" width="2" height="12" fill="${c}"/>
    <rect x="14" y="34" width="16" height="1.5" fill="#0f172a"/>
    <rect x="14" y="39" width="36" height="1.5" fill="#e2e8f0"/>
    <rect x="14" y="44" width="30" height="1.5" fill="#e2e8f0"/>
  `,
  sidebarDark: (c) => `
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="22" height="82" fill="#0f172a"/>
    <circle cx="11" cy="14" r="6" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <rect x="5" y="26" width="12" height="1.5" rx="0.5" fill="rgba(255,255,255,0.8)"/>
    <rect x="5" y="30" width="8" height="1" rx="0.5" fill="${c}"/>
    <rect x="28" y="10" width="24" height="3" rx="1" fill="#0f172a"/>
    <rect x="28" y="24" width="16" height="1.5" rx="0.5" fill="#0f172a"/>
    <rect x="28" y="30" width="26" height="1.5" rx="0.5" fill="#e2e8f0"/>
    <rect x="28" y="35" width="20" height="1.5" rx="0.5" fill="#e2e8f0"/>
  `,
  gulfPremium: (c) => `
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="62" height="6" fill="${c}"/>
    <rect x="8" y="14" width="28" height="4" rx="1" fill="#0f172a"/>
    <rect x="8" y="21" width="16" height="1.5" rx="0.75" fill="#94a3b8"/>
    <circle cx="48" cy="18" r="8" fill="#f1f5f9"/>
    <rect x="8" y="34" width="24" height="1.5" fill="${c}"/>
    <rect x="8" y="40" width="26" height="1.5" rx="0.5" fill="#e2e8f0"/>
    <rect x="38" y="34" width="16" height="1.5" fill="${c}"/>
    <rect x="38" y="40" width="16" height="1.5" rx="0.5" fill="#e2e8f0"/>
  `,
  infographic: (c) => `
    <rect width="62" height="82" rx="4" fill="#fff"/>
    <rect x="0" y="0" width="24" height="82" fill="#f8fafc"/>
    <rect x="0" y="0" width="24" height="28" fill="${c}"/>
    <rect x="4" y="6" width="16" height="16" rx="4" fill="rgba(255,255,255,0.2)"/>
    <rect x="4" y="36" width="16" height="4" rx="1" fill="#fff" stroke="#e2e8f0" stroke-width="0.5"/>
    <rect x="4" y="42" width="16" height="4" rx="1" fill="#fff" stroke="#e2e8f0" stroke-width="0.5"/>
    <rect x="30" y="10" width="24" height="3" rx="1.5" fill="#0f172a"/>
    <rect x="30" y="24" width="16" height="2" rx="1" fill="#0f172a"/>
    <rect x="30" y="30" width="24" height="1.5" rx="0.5" fill="#e2e8f0"/>
    <rect x="30" y="35" width="18" height="1.5" rx="0.5" fill="#e2e8f0"/>
  `,
};

export const PREMIUM_TEMPLATES = [
  { id: 'modern-stack', l: 'Modern Stack', cat: 'Corporate', thumb: THUMBS.modernStack },
  { id: 'pure-white',   l: 'Pure White',   cat: 'Minimal',   thumb: THUMBS.pureWhite  },
  { id: 'swiss-clean',  l: 'Swiss Clean',  cat: 'Corporate', thumb: THUMBS.swissClean },
  { id: 'ink-line',     l: 'Ink Line',     cat: 'Minimal',   thumb: THUMBS.inkLine    },
  { id: 'sidebar-dark', l: 'Sidebar Dark', cat: 'Executive', thumb: THUMBS.sidebarDark},
  { id: 'gulf-premium', l: 'Gulf Premium', cat: 'Premium',   thumb: THUMBS.gulfPremium},
  { id: 'infographic',  l: 'Infographic Split', cat: 'Creative', thumb: THUMBS.infographic },
];

export const PREMIUM_CATS = ['All', ...new Set(PREMIUM_TEMPLATES.map(t => t.cat))];

/* --- BUILT-IN LAYOUT CONFIGURATIONS --- */
const BUILT_IN_LAYOUTS = {
  'modern-stack': {
    header: ['profile', 'photo'],
    main: ['summary', 'exp', 'edu', 'projects', 'skills', 'certs', 'langs', 'awards', 'refs', 'hobbies']
  },
  'pure-white': {
    header: ['photo', 'profile'],
    main: ['summary', 'exp', 'edu', 'projects', 'skills', 'certs', 'langs', 'awards', 'refs']
  },
  'swiss-clean': {
    sidebar: ['photo', 'profile', 'skills', 'langs', 'certs'],
    main: ['summary', 'exp', 'edu', 'projects', 'awards', 'refs', 'hobbies']
  },
  'ink-line': {
    header: ['profile', 'photo'],
    main: ['summary', 'exp', 'edu', 'projects', 'skills', 'certs', 'langs', 'awards']
  },
  'sidebar-dark': {
    sidebar: ['photo', 'profile', 'skills', 'langs'],
    main: ['summary', 'exp', 'edu', 'projects', 'certs', 'awards', 'refs', 'hobbies']
  },
  'gulf-premium': {
    header: ['profile', 'photo'],
    main: ['summary', 'exp', 'edu', 'projects'],
    right: ['skills', 'certs', 'langs', 'awards', 'refs']
  },
  'infographic': {
    sidebar: [
      '<div class="cv-info-card">', 'photo', 'profile', '</div>',
      '<div class="cv-info-pad">', 'skills', 'langs', '</div>'
    ],
    main: ['summary', 'exp', 'edu', 'projects', 'certs', 'awards', 'refs']
  }
};

/* --- BUILT-IN TEMPLATE CSS --- */
const BUILT_IN_CSS = {
  'modern-stack': `
    .cv-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid var(--ac); padding-bottom: 20px; margin-bottom: 24px; }
    .cv-profile-text { flex: 1; padding-right: 20px; }
    .cv-photo-wrapper { width: 95px; height: 95px; border-radius: 50%; border: 3px solid rgba(var(--ac-rgb), 0.15); }
    .cv-sec-title { border-bottom: 1.5px solid rgba(var(--ac-rgb), 0.2); padding-bottom: 6px; margin-bottom: 14px; color: var(--text); page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
  `,
  'pure-white': `
    .cv-doc { padding: 45px; }
    .cv-header { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; margin-bottom: 35px; }
    .cv-contact-row { justify-content: center; }
    .cv-photo-wrapper { width: 90px; height: 90px; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .cv-sec-title { text-align: center; letter-spacing: 0.2em; color: var(--muted); border-bottom: 1px solid var(--line); padding-bottom: 10px; margin-bottom: 20px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-item-header { flex-direction: column; align-items: center; text-align: center; gap: 4px; }
    .cv-item-date { text-align: center; }
  `,
  'swiss-clean': `
    .cv-doc { padding: 0; }
    .cv-body { display: block; }
    .cv-body::after { content: ""; display: table; clear: both; }
    .cv-sidebar { float: left; width: 260px; box-sizing: border-box; background: #f8fafc; padding: 35px 25px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); border-bottom-right-radius: 24px; margin: 0 35px 20px 0; min-height: 92vh; }
    .cv-main { display: block; padding: 35px; }
    .cv-photo-wrapper { width: 140px; height: 140px; border-radius: 20px; margin-bottom: 25px; box-shadow: 0 6px 16px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.05); }
    .cv-name { font-size: 2.2em; color: var(--text); }
    .cv-role { color: var(--ac); }
    .cv-contact-row { flex-direction: column; gap: 10px; margin-top: 15px; }
    .cv-sidebar .cv-sec-title { margin-top: 30px; font-size: 0.85em; }
    .cv-skills-list li { background: rgba(var(--ac-rgb), 0.08); width: 100%; border-radius: 6px; padding: 8px 12px; }
    .cv-sec-title { page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
  `,
  'ink-line': `
    .cv-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 25px; margin-bottom: 25px; }
    .cv-name { font-weight: 300; letter-spacing: -0.02em; }
    .cv-photo-wrapper { width: 85px; height: 85px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .cv-sec-title { color: var(--ac); display: flex; align-items: center; gap: 10px; margin-bottom: 16px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title::after { content: ""; flex: 1; height: 1px; background: var(--line); }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-section { border-left: 2px solid rgba(var(--ac-rgb), 0.2); padding-left: 18px; margin-left: 4px; }
  `,
  'sidebar-dark': `
    .cv-doc { padding: 0; background: #ffffff; }
    .cv-body { display: block; }
    .cv-body::after { content: ""; display: table; clear: both; }
    .cv-sidebar { float: left; width: 260px; box-sizing: border-box; background: #0b1120; color: #f8fafc; padding: 35px 25px; margin: 0 35px 25px 0; border-bottom-right-radius: 32px; min-height: 92vh; }
    .cv-main { display: block; padding: 35px; }
    .cv-photo-wrapper { width: 120px; height: 120px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.15); margin-bottom: 25px; }
    .cv-name { color: #ffffff; font-size: 2em; }
    .cv-role { color: var(--ac); filter: brightness(1.3); }
    .cv-contact-row { flex-direction: column; gap: 12px; margin-top: 20px; color: #94a3b8; }
    .cv-sidebar .cv-sec-title { color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); margin-top: 35px; }
    .cv-skills-list li { background: rgba(255,255,255,0.1); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.05); }
    .cv-lang-name { color: #cbd5e1; }
    .cv-lang-bar { background: rgba(255,255,255,0.1); }
    .cv-sec-title { page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
  `,
  'gulf-premium': `
    .cv-doc { border-top: 16px solid var(--ac); padding-top: 30px; }
    .cv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 35px; }
    .cv-name { font-size: 2.6em; font-weight: 800; letter-spacing: -0.03em; color: var(--text); }
    .cv-role { font-weight: 600; color: var(--muted); letter-spacing: 0.15em; }
    .cv-photo-wrapper { width: 100px; height: 100px; border-radius: 50%; box-shadow: 0 10px 25px rgba(var(--ac-rgb), 0.2); border: 2px solid #fff; }
    .cv-body.has-right { display: grid; grid-template-columns: 1fr 230px; gap: 40px; }
    .cv-sec-title { font-weight: 800; color: var(--ac); border-bottom: 2px solid rgba(var(--ac-rgb), 0.1); padding-bottom: 6px; page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-exp-item { position: relative; padding-left: 20px; border-left: 1px solid rgba(var(--ac-rgb), 0.2); }
    .cv-exp-item::before { content: ""; position: absolute; left: -5px; top: 6px; width: 9px; height: 9px; border-radius: 50%; background: var(--ac); box-shadow: 0 0 0 3px rgba(var(--ac-rgb), 0.2); }
  `,
  'infographic': `
    .cv-doc { padding: 0; }
    .cv-body { display: block; }
    .cv-body::after { content: ""; display: table; clear: both; }
    .cv-sidebar { float: left; width: 280px; box-sizing: border-box; background: #f8fafc; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); border-bottom-right-radius: 40px; margin: 0 35px 25px 0; padding-bottom: 20px; min-height: 92vh; }
    .cv-main { display: block; padding: 35px; }
    .cv-info-card { background: var(--ac); color: #ffffff; padding: 40px 25px 30px; border-bottom-right-radius: 40px; box-shadow: 0 15px 30px rgba(var(--ac-rgb), 0.15); margin-bottom: 25px; }
    .cv-info-pad { padding: 0 25px 30px; }
    .cv-photo-wrapper { width: 110px; height: 110px; border-radius: 24px; border: 4px solid rgba(255,255,255,0.25); margin-bottom: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
    .cv-name { color: #ffffff; font-size: 2em; line-height: 1.1; }
    .cv-role { color: rgba(255,255,255,0.85); margin-top: 8px; font-size: 0.9em; }
    .cv-contact-row { flex-direction: column; gap: 12px; margin-top: 18px; color: rgba(255,255,255,0.9); }
    .cv-sec-title { font-weight: 900; letter-spacing: 0.1em; color: var(--text); page-break-after: avoid !important; break-after: avoid !important; display: block; }
    .cv-sec-title + * { page-break-before: avoid !important; break-before: avoid !important; }
    .cv-skills-list li { background: #ffffff; border: 1px solid var(--line); width: 100%; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
  `
};

/* ================================================================
   MAIN RENDERER
================================================================ */
export function buildCvHtml(data, tmplId, accent, fontId, fontSize, paper, FONTS, FSIZES, PAPERS, customConfig = null) {
  const d = data || {};
  const font = (FONTS.find(f => f.id === fontId) || FONTS[0]).s;
  const fs   = FSIZES[fontSize] || FSIZES.medium;
  const { h: paperH = 1123 } = PAPERS[paper] || PAPERS.a4;

  /* ── helpers ─────────────────────────────────────────────── */
  const esc   = s => String(s || '').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]);
  const lines = v => String(v || '').split('\n').map(s => s.trim()).filter(Boolean);
  const arr   = v => Array.isArray(v) ? v : [];
  const has   = v => v && String(v).trim().length > 0;

  const fullName = esc(d.fullName || 'Your Name');
  const title    = esc(d.title   || '');
  const phone    = d.phoneCode && d.phoneNum ? `${d.phoneCode} ${d.phoneNum}` : (d.phoneNum || '');
  const summary  = esc(d.summary || '');

  /* ── filtered arrays ─────────────────────────────────────── */
  const exp   = arr(d.experience).filter(x => has(x.role) || has(x.company));
  const edu   = arr(d.education).filter(x => has(x.degree) || has(x.school));
  const projs = arr(d.projects).filter(x => has(x.name));
  const certs = arr(d.certifications).filter(x => has(x.name));
  const langs = arr(d.languages).filter(x => has(x.lang));
  const awards = arr(d.awards).filter(x => has(x.title));
  const refs  = arr(d.references).filter(x => has(x.name));
  const skills  = lines(d.skills);
  const hobbies = lines(d.hobbies);

  /* ── contact row ─────────────────────────────────────────── */
  const contactItems = [
    d.email    && `<span>✉ ${esc(d.email)}</span>`,
    phone      && `<span>📞 ${esc(phone)}</span>`,
    d.location && `<span>📍 ${esc(d.location)}</span>`,
    d.linkedin && `<span>🔗 ${esc(d.linkedin.replace(/^https?:\/\//, ''))}</span>`,
    d.github   && `<span>💻 ${esc(d.github.replace(/^https?:\/\//, ''))}</span>`,
    d.website  && `<span>🌐 ${esc(d.website.replace(/^https?:\/\//, ''))}</span>`,
  ].filter(Boolean).join('');

  /* ── personal meta row (nationality, DOB, driving, etc.) ─── */
  const personalMeta = [
    has(d.nationality)    && `${esc(d.nationality)}`,
    has(d.dob)            && `DOB: ${esc(d.dob)}`,
    has(d.marital)        && esc(d.marital),
    has(d.gender)         && esc(d.gender),
    has(d.drivingLicense) && `🚗 ${esc(d.drivingLicense)}`,
    has(d.notice)         && `⏱ ${esc(d.notice)}`,
  ].filter(Boolean);

  /* ── section wrapper ─────────────────────────────────────── */
  const section = (title, content, cls = '') =>
    content
      ? `<section class="cv-section ${cls}"><h3 class="cv-sec-title">${title}</h3><div class="cv-sec-body">${content}</div></section>`
      : '';

  /* ── accent RGB helper ───────────────────────────────────── */
  const hex2rgb = hex => {
    let v = (hex || '#1e3a8a').replace('#', '');
    if (v.length === 3) v = v.split('').map(c => c + c).join('');
    return `${parseInt(v.slice(0,2),16)}, ${parseInt(v.slice(2,4),16)}, ${parseInt(v.slice(4,6),16)}`;
  };
  const acRgb = hex2rgb(accent);

  /* ================================================================
     CONTENT BLOCKS
  ================================================================ */
  const blocks = {

    /* ── Photo ── */
    photo: d.photoDataUrl
      ? `<div class="cv-photo-wrapper"><img src="${d.photoDataUrl}" alt="Profile" class="cv-photo-img" /></div>`
      : '',

    /* ── Profile header ── */
    profile: `
      <div class="cv-profile-text">
        <h1 class="cv-name">${fullName}</h1>
        ${title ? `<h2 class="cv-role">${title}</h2>` : ''}
        <div class="cv-contact-row">${contactItems}</div>
        ${personalMeta.length
          ? `<div class="cv-personal-meta">${personalMeta.join('<span class="cv-meta-dot">·</span>')}</div>`
          : ''}
      </div>`,

    /* ── Summary ── */
    summary: section('Professional Summary',
      summary ? `<p class="cv-summary">${summary}</p>` : ''),

    /* ── Experience ── */
    exp: section('Experience', exp.map(x => {
      const dateRange = [x.start, x.current ? 'Present' : x.end].filter(Boolean).join(' – ');
      const subParts  = [
        has(x.company)  && esc(x.company),
        has(x.city)     && esc(x.city),
        has(x.empType)  && x.empType !== 'Full-time' && `<em>${esc(x.empType)}</em>`,
        has(x.industry) && esc(x.industry),
      ].filter(Boolean).join(' · ');
      return `
        <article class="cv-item cv-exp-item">
          <div class="cv-item-header">
            <div>
              <div class="cv-item-title">${esc(x.role)}</div>
              ${subParts ? `<div class="cv-item-sub">${subParts}</div>` : ''}
            </div>
            ${dateRange ? `<div class="cv-item-date">${esc(dateRange)}</div>` : ''}
          </div>
          ${x.bullets
            ? `<ul class="cv-bullets">${lines(x.bullets).map(b => `<li>${esc(b)}</li>`).join('')}</ul>`
            : ''}
        </article>`;
    }).join('')),

    /* ── Education — with GPA + notes ── */
    edu: section('Education', edu.map(x => {
      const dateRange = [x.start, x.end].filter(Boolean).join(' – ');
      const degLabel  = [x.degType, x.degree].filter(Boolean).join(' in ');
      const subParts  = [
        has(x.school) && esc(x.school),
        has(x.city)   && esc(x.city),
      ].filter(Boolean).join(' · ');
      return `
        <article class="cv-item">
          <div class="cv-item-header">
            <div>
              <div class="cv-item-title">${esc(degLabel)}</div>
              ${subParts ? `<div class="cv-item-sub">${subParts}</div>` : ''}
            </div>
            ${dateRange ? `<div class="cv-item-date">${esc(dateRange)}</div>` : ''}
          </div>
          ${has(x.gpa)   ? `<div class="cv-edu-meta">GPA / Grade: <strong>${esc(x.gpa)}</strong></div>` : ''}
          ${has(x.notes) ? `<p class="cv-edu-notes">${esc(x.notes)}</p>` : ''}
        </article>`;
    }).join('')),

    /* ── Projects — with status + URL ── */
    projects: section('Projects', projs.map(x => {
      return `
        <article class="cv-item">
          <div class="cv-item-header">
            <div>
              <div class="cv-item-title">${esc(x.name)}${has(x.status) ? ` <span class="cv-proj-status">${esc(x.status)}</span>` : ''}</div>
              ${has(x.tech) ? `<div class="cv-item-sub">${esc(x.tech)}</div>` : ''}
            </div>
            ${has(x.url)
              ? `<div class="cv-item-date"><a href="${esc(x.url)}" class="cv-link" target="_blank">${esc(x.url.replace(/^https?:\/\//, ''))}</a></div>`
              : ''}
          </div>
          ${x.bullets
            ? `<ul class="cv-bullets">${lines(x.bullets).map(b => `<li>${esc(b)}</li>`).join('')}</ul>`
            : ''}
        </article>`;
    }).join('')),

    /* ── Skills ── */
    skills: skills.length
      ? section('Skills', `<ul class="cv-skills-list">${skills.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`)
      : '',

    /* ── Languages ── */
    langs: langs.length ? section('Languages', `
      <div class="cv-langs-list">
        ${langs.map(l => {
          const p = { Native: 100, Fluent: 85, Professional: 70, Conversational: 50, Elementary: 30 }[l.level] || 60;
          return `
            <div class="cv-lang-item">
              <div class="cv-lang-top">
                <span class="cv-lang-name">${esc(l.lang)}</span>
                <span class="cv-lang-lvl">${esc(l.level)}</span>
              </div>
              <div class="cv-lang-bar"><div class="cv-lang-fill" style="width:${p}%"></div></div>
            </div>`;
        }).join('')}
      </div>`) : '',

    /* ── Certifications — with issuer, year, expiry, credId ── */
    certs: certs.length ? section('Certifications', `
      <ul class="cv-cert-list">
        ${certs.map(x => {
          const meta = [
            has(x.issuer) && esc(x.issuer),
            has(x.year)   && esc(x.year),
            has(x.expiry) && `Exp: ${esc(x.expiry)}`,
          ].filter(Boolean).join(' · ');
          return `
            <li class="cv-cert-item">
              <div class="cv-item-title">${esc(x.name)}</div>
              ${meta ? `<div class="cv-item-sub">${meta}</div>` : ''}
              ${has(x.credId) ? `<div class="cv-cert-cred">ID: ${esc(x.credId)}</div>` : ''}
            </li>`;
        }).join('')}
      </ul>`) : '',

    /* ── Awards — with issuer, year, description ── */
    awards: awards.length ? section('Awards', awards.map(x => `
      <article class="cv-item">
        <div class="cv-item-header">
          <div>
            <div class="cv-item-title">${esc(x.title)}</div>
            ${has(x.issuer) ? `<div class="cv-item-sub">${esc(x.issuer)}</div>` : ''}
          </div>
          ${has(x.year) ? `<div class="cv-item-date">${esc(x.year)}</div>` : ''}
        </div>
        ${has(x.desc) ? `<p class="cv-award-desc">${esc(x.desc)}</p>` : ''}
      </article>`).join('')) : '',

    /* ── References — with title, company, relationship, email, phone ── */
    refs: refs.length ? section('References', `
      <div class="cv-refs-grid">
        ${refs.map(x => {
          const role = [x.refTitle, x.relationship ? `(${esc(x.relationship)})` : ''].filter(Boolean).join(' ');
          return `
            <div class="cv-ref-item">
              <div class="cv-item-title">${esc(x.name)}</div>
              ${role ? `<div class="cv-item-sub">${role}</div>` : ''}
              ${has(x.company) ? `<div class="cv-ref-detail">🏢 ${esc(x.company)}</div>` : ''}
              ${has(x.email)   ? `<div class="cv-ref-detail">✉ ${esc(x.email)}</div>` : ''}
              ${has(x.phone)   ? `<div class="cv-ref-detail">📞 ${esc(x.phone)}</div>` : ''}
            </div>`;
        }).join('')}
      </div>`) : '',

    /* ── Hobbies ── */
    hobbies: hobbies.length
      ? section('Hobbies & Interests', `<p class="cv-summary">${esc(hobbies.join(' · '))}</p>`)
      : '',
  };

  /* ── Layout + CSS ── */
  const layout     = customConfig?.layout || BUILT_IN_LAYOUTS[tmplId] || BUILT_IN_LAYOUTS['modern-stack'];
  const templateCss = customConfig?.css   || BUILT_IN_CSS[tmplId]     || '';

  const renderZone = zoneKeys =>
    (zoneKeys || []).map(k => (blocks[k] !== undefined ? blocks[k] : k)).join('');

  /* ── Base CSS ── */
  const baseCss = `
    * { box-sizing: border-box; }
    .cv-doc {
      --ac: ${accent};
      --ac-rgb: ${acRgb};
      --text: #0f172a;
      --muted: #475569;
      --line: #e2e8f0;
      --bg: #ffffff;
      font-family: ${font};
      font-size: ${fs};
      line-height: 1.6;
      color: var(--text);
      background: var(--bg);
      min-height: ${paperH}px;
      padding: 35px;
      overflow: hidden;
    }
    h1, h2, h3 { margin: 0; }

    /* Name & title */
    .cv-name { font-size: 2.2em; font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
    .cv-role { font-size: 1.05em; font-weight: 700; color: var(--ac); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 6px; }

    /* Contact row */
    .cv-contact-row { display: flex; flex-wrap: wrap; gap: 6px 14px; margin-top: 10px; font-size: 0.84em; color: var(--muted); font-weight: 500; }
    .cv-contact-row span { display: flex; align-items: center; gap: 5px; word-break: break-word; }

    /* Personal meta (nationality, DOB, etc.) */
    .cv-personal-meta {
      display: flex; flex-wrap: wrap; gap: 4px 10px;
      margin-top: 6px; font-size: 0.78em; color: var(--muted); font-weight: 500;
    }
    .cv-meta-dot { opacity: 0.4; margin: 0 2px; }

    /* Photo */
    .cv-photo-wrapper {
      position: relative; overflow: hidden;
      display: flex; justify-content: center; align-items: center;
      flex-shrink: 0; background-color: rgba(var(--ac-rgb), 0.05); z-index: 1;
    }
    .cv-photo-wrapper .cv-photo-img {
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover; object-position: center 15%;
      display: block; z-index: 0;
    }

    /* Sections */
    .cv-section { margin-bottom: 22px; }
    .cv-sec-title { font-size: 1em; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text); margin-bottom: 12px; }
    .cv-item { margin-bottom: 16px; }
    .cv-item:last-child { margin-bottom: 0; }
    .cv-item-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 4px; }
    .cv-item-title { font-weight: 700; color: var(--text); }
    .cv-item-sub { font-size: 0.88em; color: var(--muted); font-weight: 600; margin-top: 2px; }
    .cv-item-date { font-size: 0.83em; font-weight: 700; color: var(--ac); white-space: nowrap; flex-shrink: 0; }

    /* Bullets */
    .cv-bullets { margin: 6px 0 0; padding-left: 18px; color: var(--muted); font-size: 0.93em; }
    .cv-bullets li { margin-bottom: 4px; line-height: 1.5; }

    /* Summary */
    .cv-summary { margin: 0; color: var(--muted); line-height: 1.7; }

    /* Education extras */
    .cv-edu-meta { font-size: 0.82em; color: var(--ac); font-weight: 700; margin-top: 4px; }
    .cv-edu-notes { margin: 4px 0 0; font-size: 0.88em; color: var(--muted); line-height: 1.55; }

    /* Project status badge */
    .cv-proj-status {
      display: inline-block; margin-left: 6px;
      padding: 1px 7px; border-radius: 99px;
      font-size: 0.72em; font-weight: 700;
      background: rgba(var(--ac-rgb), 0.1); color: var(--ac);
      vertical-align: middle;
    }
    .cv-link { color: var(--ac); text-decoration: none; font-size: 0.82em; font-weight: 600; word-break: break-all; }

    /* Skills */
    .cv-skills-list { display: flex; flex-wrap: wrap; gap: 7px; list-style: none; padding: 0; margin: 0; }
    .cv-skills-list li { background: rgba(var(--ac-rgb), 0.1); color: var(--ac); padding: 4px 11px; border-radius: 99px; font-size: 0.84em; font-weight: 700; }

    /* Languages */
    .cv-lang-item { margin-bottom: 9px; }
    .cv-lang-top { display: flex; justify-content: space-between; font-size: 0.84em; font-weight: 600; margin-bottom: 4px; }
    .cv-lang-name { color: var(--text); }
    .cv-lang-lvl { color: var(--ac); font-weight: 700; }
    .cv-lang-bar { height: 5px; background: var(--line); border-radius: 99px; overflow: hidden; }
    .cv-lang-fill { height: 100%; background: var(--ac); border-radius: 99px; }

    /* Certifications */
    .cv-cert-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    .cv-cert-item { padding: 8px 12px; background: rgba(var(--ac-rgb), 0.04); border-left: 3px solid var(--ac); border-radius: 0 6px 6px 0; }
    .cv-cert-cred { font-size: 0.78em; color: var(--muted); margin-top: 2px; font-style: italic; }

    /* Awards */
    .cv-award-desc { margin: 4px 0 0; font-size: 0.88em; color: var(--muted); line-height: 1.55; }

    /* References */
    .cv-refs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
    .cv-ref-item { padding: 12px 14px; border: 1px solid var(--line); border-radius: 8px; background: rgba(var(--ac-rgb), 0.02); }
    .cv-ref-detail { font-size: 0.82em; color: var(--muted); margin-top: 3px; word-break: break-word; }

    /* Simple list fallback */
    .cv-simple-list { margin: 0; padding-left: 18px; color: var(--muted); font-size: 0.93em; }
  `;

  return `
    <style>${baseCss}${templateCss}</style>
    <div class="cv-doc layout-${tmplId}">
      ${layout.header ? `<header class="cv-header">${renderZone(layout.header)}</header>` : ''}
      <div class="cv-body ${layout.sidebar ? 'has-sidebar' : ''} ${layout.right ? 'has-right' : ''}">
        ${layout.sidebar ? `<aside class="cv-sidebar">${renderZone(layout.sidebar)}</aside>` : ''}
        ${layout.main   ? `<main class="cv-main">${renderZone(layout.main)}</main>` : ''}
        ${layout.right  ? `<aside class="cv-right">${renderZone(layout.right)}</aside>` : ''}
      </div>
    </div>
  `;
}