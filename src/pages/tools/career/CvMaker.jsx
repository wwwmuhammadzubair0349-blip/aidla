/**
 * CvMaker.jsx — Professional CV Maker v4
 * Mobile-first · Perfect Print · No focus bugs
 * Usage: import CvMaker from './CvMaker';
 * Required in index.html: Google Fonts — Outfit,Sora,Plus Jakarta Sans,Lora,Cormorant Garamond,Playfair Display
 */
import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import './cv-maker.css';

/* ================================================================
   CONSTANTS
================================================================ */
const SK = 'cvmk_v10';

const FONTS = [
  { id: 'outfit',   l: 'Outfit',   s: "'Outfit',sans-serif" },
  { id: 'sora',     l: 'Sora',     s: "'Sora',sans-serif" },
  { id: 'jakarta',  l: 'Jakarta',  s: "'Plus Jakarta Sans',sans-serif" },
  { id: 'lora',     l: 'Lora',     s: "'Lora','Georgia',serif" },
  { id: 'garamond', l: 'Garamond', s: "'Cormorant Garamond','Georgia',serif" },
  { id: 'playfair', l: 'Playfair', s: "'Playfair Display','Georgia',serif" },
];
const FSIZES = { small: '10.5px', medium: '12px', large: '13.5px' };
const PAPERS = {
  a4:     { w: 794,  h: 1123, l: 'A4' },
  letter: { w: 816,  h: 1056, l: 'Letter' },
  legal:  { w: 816,  h: 1344, l: 'Legal' },
};
const ACCENTS = [
  '#1e3a8a','#0f766e','#7c2d12','#4c1d95',
  '#065f46','#1f2937','#be123c','#0369a1',
  '#92400e','#166534','#0c4a6e','#3b0764',
];
const TEMPLATES = [
  { id:'executive-pro',   l:'Executive Pro',   cat:'Pro',      thumb:'leftbar'       },
  { id:'corporate-navy',  l:'Corporate Navy',  cat:'Pro',      thumb:'topband'       },
  { id:'sharp-angles',    l:'Sharp Angles',    cat:'Pro',      thumb:'diagonal-hdr'  },
  { id:'modern-stack',    l:'Modern Stack',    cat:'Pro',      thumb:'split-line'    },
  { id:'pure-white',      l:'Pure White',      cat:'Minimal',  thumb:'center'        },
  { id:'swiss-clean',     l:'Swiss Clean',     cat:'Minimal',  thumb:'swiss'         },
  { id:'ink-line',        l:'Ink Line',        cat:'Minimal',  thumb:'ink'           },
  { id:'dot-grid',        l:'Dot Grid',        cat:'Minimal',  thumb:'dots'          },
  { id:'sidebar-dark',    l:'Sidebar Dark',    cat:'Sidebar',  thumb:'sidebar-l'     },
  { id:'sidebar-light',   l:'Sidebar Light',   cat:'Sidebar',  thumb:'sidebar-lite'  },
  { id:'sidebar-right',   l:'Sidebar Right',   cat:'Sidebar',  thumb:'sidebar-r'     },
  { id:'sidebar-teal',    l:'Sidebar Teal',    cat:'Sidebar',  thumb:'sidebar-teal'  },
  { id:'magazine',        l:'Magazine',        cat:'Creative', thumb:'magazine'      },
  { id:'diagonal-burst',  l:'Diagonal Burst',  cat:'Creative', thumb:'diag-burst'    },
  { id:'geometric',       l:'Geometric',       cat:'Creative', thumb:'geometric'     },
  { id:'neon-dark',       l:'Neon Dark',       cat:'Creative', thumb:'dark'          },
  { id:'oxford',          l:'Oxford',          cat:'Academic', thumb:'oxford'        },
  { id:'research-paper',  l:'Research',        cat:'Academic', thumb:'research'      },
  { id:'european-cv',     l:'European CV',     cat:'Academic', thumb:'euro'          },
  { id:'gulf-premium',    l:'Gulf Premium',    cat:'Gulf/UAE', thumb:'gulf'          },
  { id:'bilingual',       l:'Bilingual',       cat:'Gulf/UAE', thumb:'bilingual'     },
  { id:'pearl-luxe',      l:'Pearl Luxe',      cat:'Gulf/UAE', thumb:'pearl'         },
  { id:'two-col',         l:'Two Column',      cat:'2-Column', thumb:'2col'          },
  { id:'infographic',     l:'Infographic',     cat:'2-Column', thumb:'infograph'     },
  { id:'timeline-cv',     l:'Timeline',        cat:'2-Column', thumb:'timeline'      },
];
const CATS = ['All', ...new Set(TEMPLATES.map(t => t.cat))];

/* Dropdown data */
const LANG_LEVELS  = ['Native','Fluent','Professional','Conversational','Elementary'];
const REL_TYPES    = ['Manager','Supervisor','Colleague','Professor','Client','Mentor','HR'];
const EMP_TYPES    = ['Full-time','Part-time','Contract','Freelance','Internship','Apprenticeship','Temporary'];
const DEG_TYPES    = ['High School','Diploma','Associate Degree',"Bachelor's Degree","Master's Degree",'PhD','MBA','Professional Certification','Short Course','Online Certificate'];
const PROJ_STATUS  = ['Completed','In Progress','Open Source','Personal','Academic','Client Work'];
const PUB_TYPES    = ['Journal Article','Conference Paper','Book Chapter','Thesis','Patent','White Paper','Blog Post','Case Study'];
const VOL_CAUSES   = ['','Education','Health','Environment','Community','Technology','Arts','Sports','Disaster Relief','Animal Welfare','Human Rights'];
const PHONE_CODES  = [
  {c:'+971',l:'🇦🇪 UAE'},   {c:'+966',l:'🇸🇦 KSA'},   {c:'+974',l:'🇶🇦 Qatar'},
  {c:'+973',l:'🇧🇭 Bahrain'},{c:'+968',l:'🇴🇲 Oman'},  {c:'+965',l:'🇰🇼 Kuwait'},
  {c:'+44', l:'🇬🇧 UK'},    {c:'+1',  l:'🇺🇸 USA'},    {c:'+91', l:'🇮🇳 India'},
  {c:'+92', l:'🇵🇰 Pakistan'},{c:'+20',l:'🇪🇬 Egypt'}, {c:'+880',l:'🇧🇩 Bangladesh'},
  {c:'+94', l:'🇱🇰 Sri Lanka'},{c:'+63',l:'🇵🇭 Philippines'},{c:'+60',l:'🇲🇾 Malaysia'},
  {c:'+62', l:'🇮🇩 Indonesia'},{c:'+49',l:'🇩🇪 Germany'},{c:'+33',l:'🇫🇷 France'},
  {c:'+39', l:'🇮🇹 Italy'},  {c:'+34',l:'🇪🇸 Spain'},  {c:'+7', l:'🇷🇺 Russia'},
  {c:'+86', l:'🇨🇳 China'},  {c:'+81',l:'🇯🇵 Japan'},  {c:'+82',l:'🇰🇷 Korea'},
  {c:'+55', l:'🇧🇷 Brazil'}, {c:'+27',l:'🇿🇦 S.Africa'},{c:'+234',l:'🇳🇬 Nigeria'},
  {c:'+254',l:'🇰🇪 Kenya'},  {c:'+212',l:'🇲🇦 Morocco'},{c:'+213',l:'🇩🇿 Algeria'},
];
const NATIONALITIES = [
  'Afghan','Albanian','Algerian','American','Argentine','Australian','Austrian',
  'Bahraini','Bangladeshi','Belgian','Brazilian','British','Bulgarian',
  'Cameroonian','Canadian','Chilean','Chinese','Colombian','Croatian','Czech',
  'Danish','Dutch','Egyptian','Emirati','Ethiopian','Filipino',
  'Finnish','French','German','Ghanaian','Greek','Hungarian',
  'Indian','Indonesian','Iranian','Iraqi','Irish','Italian','Ivorian',
  'Japanese','Jordanian','Kenyan','Korean','Kuwaiti',
  'Lebanese','Libyan','Malaysian','Moroccan','Mexican',
  'Nepali','New Zealander','Nigerian','Norwegian','Omani','Pakistani',
  'Palestinian','Polish','Portuguese','Qatari','Romanian','Russian',
  'Saudi','Serbian','Singaporean','South African','Spanish','Sri Lankan',
  'Sudanese','Swedish','Swiss','Syrian','Taiwanese','Thai','Tunisian',
  'Turkish','Ugandan','Ukrainian','Uzbek','Venezuelan','Vietnamese','Yemeni','Zimbabwean',
];
const MARITAL_STATUS = ['','Single','Married','Divorced','Widowed','Prefer not to say'];
const GENDERS        = ['','Male','Female','Non-binary','Other','Prefer not to say'];
const NOTICE_PERIODS = ['','Immediately Available','1 Week','2 Weeks','1 Month','2 Months','3 Months','6 Months'];
const DRIVING_LIC    = ['','UAE Light Vehicle','UAE Heavy Vehicle','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman','UK Full','US Driver\'s License','European','International','Class A','Class B','Class C'];

/* ================================================================
   UTILS
================================================================ */
const uid   = () => Math.random().toString(36).slice(2,9);
const he    = s  => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const lines = v  => String(v||'').split('\n').map(s=>s.trim()).filter(Boolean);

const INIT_DATA = () => ({
  fullName:'', title:'', email:'', phoneCode:'+971', phoneNum:'',
  location:'', linkedin:'', github:'', website:'',
  nationality:'', dob:'', drivingLicense:'', marital:'', gender:'', notice:'',
  summary:'', skills:'', hobbies:'', photoDataUrl:'',
  experience:[], education:[], projects:[], certifications:[],
  languages:[], awards:[], publications:[], volunteer:[], references:[],
});

/* SVG icons — inline so they print perfectly */
const ICO = {
  email:    `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;flex-shrink:0"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone:    `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;flex-shrink:0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg>`,
  location: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;flex-shrink:0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  linkedin: `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:3px;flex-shrink:0"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  github:   `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:3px;flex-shrink:0"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
  web:      `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;flex-shrink:0"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  calendar: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;flex-shrink:0"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  flag:     `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;flex-shrink:0"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  car:      `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;flex-shrink:0"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
};

/* ================================================================
   TOAST
================================================================ */
function Toasts({ toasts, onDismiss }) {
  return (
    <div className="cv-toasts" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`cv-toast t-${t.type}`} role="alert">
          <span>{t.msg}</span>
          <button onClick={() => onDismiss(t.id)} aria-label="Dismiss">×</button>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   ORG SEARCH — self-contained, no parent re-render
================================================================ */
function OrgSearch({ value, placeholder, suffix='', onTextChange, onSelect }) {
  const [results, setResults] = useState([]);
  const [open, setOpen]       = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const timer = useRef(null);
  const wrap  = useRef(null);

  const search = useCallback((q) => {
    clearTimeout(timer.current);
    if (!q || q.length < 2) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      try {
        const res  = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(q+suffix)}`);
        const data = res.ok ? await res.json() : [];
        setResults(data.slice(0,8));
        setOpen(data.length > 0);
      } catch { setOpen(false); }
    }, 300);
  }, [suffix]);

  useEffect(() => {
    const fn = e => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    document.addEventListener('touchstart', fn, { passive: true });
    return () => { document.removeEventListener('mousedown',fn); document.removeEventListener('touchstart',fn); };
  }, []);

  const pick = item => {
    const l = item.logo || (item.domain ? `https://logo.clearbit.com/${item.domain}` : '');
    setLogoUrl(l); setOpen(false);
    onSelect(item.name, l, item.domain||'');
  };

  return (
    <div className="cv-srch-wrap" ref={wrap}>
      <div className="cv-srch-row">
        {logoUrl && <img src={logoUrl} className="cv-org-logo" alt="" onError={e=>e.target.style.display='none'} />}
        <input className="cv-inp" value={value} placeholder={placeholder} autoComplete="off"
          style={{ flex:1, minWidth:0 }}
          onChange={e => { onTextChange(e.target.value); search(e.target.value); }} />
      </div>
      {open && (
        <ul className="cv-dd" role="listbox">
          {results.map((item, i) => {
            const l = item.logo || (item.domain ? `https://logo.clearbit.com/${item.domain}` : '');
            return (
              <li key={i} className="cv-dd-item" role="option" tabIndex={0}
                onClick={() => pick(item)}
                onKeyDown={e => (e.key==='Enter'||e.key===' ') && pick(item)}>
                {l ? <img src={l} alt="" onError={e=>e.target.style.display='none'}/> : <span style={{width:18}}>🏢</span>}
                <div><span className="cv-dd-name">{item.name}</span><span className="cv-dd-sub">{item.domain}</span></div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ================================================================
   EXPERIENCE ITEM — local state = no focus loss
================================================================ */
function ExpItem({ item, onUpdate, onRemove }) {
  const [L, setL] = useState({ ...item });
  const upd = (k, v) => { const n={...L,[k]:v}; setL(n); onUpdate(n); };
  return (
    <div className="cv-shell">
      <div className="cv-shell-h">
        <span className="cv-shell-t">{L.role||'New Role'}{L.company?' @ '+L.company:''}</span>
        <button className="cv-btn-rm" onClick={onRemove}>✕</button>
      </div>
      <div className="cv-g2">
        <div className="cv-field">
          <label className="cv-lbl">Role / Position *</label>
          <input className="cv-inp" value={L.role} placeholder="Senior Engineer" onChange={e=>upd('role',e.target.value)}/>
        </div>
        <div className="cv-field">
          <label className="cv-lbl">Employment Type</label>
          <select className="cv-inp" value={L.empType} onChange={e=>upd('empType',e.target.value)}>
            {EMP_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="cv-field cv-span2">
          <label className="cv-lbl">Company <span style={{fontWeight:500,textTransform:'none',fontSize:'.85em'}}>(search for logo)</span></label>
          <OrgSearch value={L.company} placeholder="Search company…"
            onTextChange={v=>upd('company',v)}
            onSelect={(name,logo)=>{ const n={...L,company:name,companyLogo:logo}; setL(n); onUpdate(n); }}/>
        </div>
        <div className="cv-field">
          <label className="cv-lbl">City</label>
          <input className="cv-inp" value={L.city} placeholder="Dubai, UAE" onChange={e=>upd('city',e.target.value)}/>
        </div>
        <div className="cv-field">
          <label className="cv-lbl">Industry</label>
          <select className="cv-inp" value={L.industry||''} onChange={e=>upd('industry',e.target.value)}>
            {['','Construction','Engineering','IT & Software','Finance','Healthcare','Education','Hospitality','Marketing','Legal','Manufacturing','Oil & Gas','Real Estate','Retail','Telecom','Transport','Other'].map(o=><option key={o} value={o}>{o||'— Select —'}</option>)}
          </select>
        </div>
        <div className="cv-field">
          <label className="cv-lbl">Start Date</label>
          <input className="cv-inp" value={L.start} placeholder="Jan 2022" onChange={e=>upd('start',e.target.value)}/>
        </div>
        <div className="cv-field">
          <label className="cv-lbl">End Date</label>
          <input className="cv-inp" value={L.current?'Present':L.end} placeholder="Present"
            disabled={L.current} onChange={e=>upd('end',e.target.value)}/>
        </div>
        <div className="cv-field cv-span2">
          <label style={{display:'flex',alignItems:'center',gap:7,fontSize:'.8rem',fontWeight:600,cursor:'pointer',minHeight:'44px'}}>
            <input type="checkbox" checked={!!L.current} onChange={e=>{const n={...L,current:e.target.checked};setL(n);onUpdate(n);}}/> Currently working here
          </label>
        </div>
      </div>
      <div style={{marginTop:10}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5,flexWrap:'wrap',gap:6}}>
          <span className="cv-lbl">Key Achievements (one per line)</span>
          <button className="cv-ai-btn" onClick={()=>onUpdate({...L,_aiBullets:true})}>✨ AI Write</button>
        </div>
        <textarea className="cv-inp" rows={4}
          placeholder={"Led a team of 8 engineers delivering $2M project on time\nReduced operational costs by 23% through automation"}
          value={L.bullets} onChange={e=>upd('bullets',e.target.value)}/>
      </div>
    </div>
  );
}

/* ================================================================
   EDUCATION ITEM
================================================================ */
function EduItem({ item, onUpdate, onRemove }) {
  const [L, setL] = useState({ ...item });
  const upd = (k,v) => { const n={...L,[k]:v}; setL(n); onUpdate(n); };
  return (
    <div className="cv-shell">
      <div className="cv-shell-h">
        <span className="cv-shell-t">{L.degree||'New Education'}{L.school?' — '+L.school:''}</span>
        <button className="cv-btn-rm" onClick={onRemove}>✕</button>
      </div>
      <div className="cv-g2">
        <div className="cv-field">
          <label className="cv-lbl">Degree Type</label>
          <select className="cv-inp" value={L.degType} onChange={e=>upd('degType',e.target.value)}>
            {DEG_TYPES.map(d=><option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="cv-field">
          <label className="cv-lbl">Subject / Major *</label>
          <input className="cv-inp" value={L.degree} placeholder="Mechanical Engineering" onChange={e=>upd('degree',e.target.value)}/>
        </div>
        <div className="cv-field cv-span2">
          <label className="cv-lbl">University / School <span style={{fontWeight:500,textTransform:'none',fontSize:'.85em'}}>(search logo)</span></label>
          <OrgSearch value={L.school} placeholder="Search university…" suffix=" university"
            onTextChange={v=>upd('school',v)}
            onSelect={(name,logo)=>{const n={...L,school:name,schoolLogo:logo};setL(n);onUpdate(n);}}/>
        </div>
        <div className="cv-field">
          <label className="cv-lbl">City</label>
          <input className="cv-inp" value={L.city} placeholder="London, UK" onChange={e=>upd('city',e.target.value)}/>
        </div>
        <div className="cv-field">
          <label className="cv-lbl">GPA / Grade</label>
          <input className="cv-inp" value={L.gpa} placeholder="3.8/4.0 or First Class" onChange={e=>upd('gpa',e.target.value)}/>
        </div>
        <div className="cv-field">
          <label className="cv-lbl">Start Year</label>
          <input className="cv-inp" value={L.start} placeholder="2018" onChange={e=>upd('start',e.target.value)}/>
        </div>
        <div className="cv-field">
          <label className="cv-lbl">End Year</label>
          <input className="cv-inp" value={L.end} placeholder="2022" onChange={e=>upd('end',e.target.value)}/>
        </div>
      </div>
      <div className="cv-field" style={{marginTop:8}}>
        <label className="cv-lbl">Achievements / Notes</label>
        <textarea className="cv-inp" rows={2} placeholder="Dean's List · Thesis: Renewable Energy Systems"
          value={L.notes} onChange={e=>upd('notes',e.target.value)}/>
      </div>
    </div>
  );
}

/* ================================================================
   GENERIC SIMPLE ITEM — render prop pattern
================================================================ */
function SItem({ item, onUpdate, onRemove, children }) {
  const [L, setL] = useState({ ...item });
  const upd = (k,v) => { const n={...L,[k]:v}; setL(n); onUpdate(n); };
  return children(L, upd, onRemove);
}

/* ================================================================
   PRINT FILENAME MODAL
================================================================ */
function PrintModal({ defaultName, onConfirm, onCancel }) {
  const [name, setName] = useState(defaultName);
  const inp = useRef(null);
  useEffect(() => { inp.current?.focus(); inp.current?.select(); }, []);
  return (
    <div className="cv-modal-backdrop" onClick={e=>e.target===e.currentTarget&&onCancel()}>
      <div className="cv-modal">
        <div className="cv-modal-title">🖨️ Name your PDF file</div>
        <div className="cv-modal-sub">Choose a filename before printing. Your browser will use this as the default save name.</div>
        <input className="cv-inp cv-span2" ref={inp} value={name}
          placeholder="my-cv" style={{marginBottom:12}}
          onChange={e=>setName(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&onConfirm(name)}/>
        <div className="cv-modal-row">
          <button className="cv-btn cv-btn-ghost" style={{flex:1}} onClick={onCancel}>Cancel</button>
          <button className="cv-btn cv-btn-primary" style={{flex:2}} onClick={()=>onConfirm(name)}>
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
================================================================ */
export default function CvMaker() {
  const [data,      setData]      = useState(INIT_DATA);
  const [tmpl,      setTmpl]      = useState('executive-pro');
  const [accent,    setAccent]    = useState('#1e3a8a');
  const [fontId,    setFontId]    = useState('outfit');
  const [fontSize,  setFontSize]  = useState('medium');
  const [paper,     setPaper]     = useState('a4');
  const [zoom,      setZoom]      = useState(1);
  const [activeTab, setActiveTab] = useState('personal');
  const [activeCat, setActiveCat] = useState('All');
  const [mobView,   setMobView]   = useState('form');
  const [atsOpen,   setAtsOpen]   = useState(false);
  const [toasts,    setToasts]    = useState([]);
  const [aiLoading, setAiLoading] = useState({});
  const [showPrintModal, setShowPrintModal] = useState(false);

  const prevScrollRef = useRef(null);
  const paperRef      = useRef(null);
  const saveTimer     = useRef(null);

  /* ── Toast ── */
  const toast = useCallback((msg, type='inf', dur=3200) => {
    const id = uid();
    setToasts(t => [...t,{id,msg,type}]);
    setTimeout(() => setToasts(t=>t.filter(x=>x.id!==id)), dur);
  }, []);
  const dismissToast = id => setToasts(t=>t.filter(x=>x.id!==id));

  /* ── Load saved ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SK); if(!raw) return;
      const sv  = JSON.parse(raw);
      if(sv.data)    setData(d=>({...d,...sv.data}));
      if(sv.tmpl)    setTmpl(sv.tmpl);
      if(sv.accent)  setAccent(sv.accent);
      if(sv.fontId)  setFontId(sv.fontId);
      if(sv.fontSize)setFontSize(sv.fontSize);
      if(sv.paper)   setPaper(sv.paper);
    } catch {}
  }, []);

  /* ── Auto-save ── */
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(SK,JSON.stringify({data,tmpl,accent,fontId,fontSize,paper})); }catch{}
    }, 400);
  }, [data,tmpl,accent,fontId,fontSize,paper]);

  /* ── Zoom ── */
  const fitZoom = useCallback(() => {
    if (!prevScrollRef.current) return;
    const cw = prevScrollRef.current.clientWidth - 24;
    setZoom(Math.min(1, +(cw / PAPERS[paper].w).toFixed(3)));
  }, [paper]);
  useEffect(()=>{ fitZoom(); },[fitZoom,paper]);
  useEffect(()=>{
    const fn=()=>fitZoom();
    window.addEventListener('resize',fn);
    return ()=>window.removeEventListener('resize',fn);
  },[fitZoom]);
  useEffect(()=>{
    if(!paperRef.current) return;
    const {w,h}=PAPERS[paper],pp=paperRef.current;
    pp.style.width=`${w}px`; pp.style.minHeight=`${h}px`;
    pp.style.transform=`scale(${zoom})`; pp.style.transformOrigin='top left';
    pp.style.position='absolute'; pp.style.left='0'; pp.style.top='0';
    const sc=pp.parentElement;
    if(sc){sc.style.width=`${w*zoom}px`;sc.style.height=`${h*zoom}px`;}
  },[zoom,paper]);

  /* ── Data helpers ── */
  const sf = (k,v) => setData(d=>({...d,[k]:v}));
  const addItem    = (sec,tpl)  => setData(d=>({...d,[sec]:[...(d[sec]||[]),{id:uid(),...tpl}]}));
  const removeItem = (sec,id)   => setData(d=>({...d,[sec]:d[sec].filter(x=>x.id!==id)}));
  const updateItem = (sec,upd)  => setData(d=>({...d,[sec]:d[sec].map(x=>x.id===upd.id?upd:x)}));

  /* ── Photo ── */
  const uploadPhoto = e => {
    const f=e.target.files?.[0]; if(!f) return;
    if(!f.type.startsWith('image/')) return toast('Pick an image file','err');
    if(f.size>5e6) return toast('Max 5MB','err');
    const r=new FileReader();
    r.onload=ev=>{ sf('photoDataUrl',ev.target.result); toast('Photo uploaded ✅','ok'); };
    r.readAsDataURL(f);
  };

  /* ── Export / Import ── */
  const exportJSON = () => {
    const b=new Blob([JSON.stringify({data,tmpl,accent,fontId,fontSize,paper},null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(b);
    a.download=(data.fullName||'cv').replace(/\s+/g,'_')+'_cv.json';
    a.click(); toast('CV saved as JSON ✅','ok');
  };
  const importJSON = e => {
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{
      try{
        const o=JSON.parse(ev.target.result);
        if(o.data)    setData(d=>({...d,...o.data}));
        if(o.tmpl)    setTmpl(o.tmpl);
        if(o.accent)  setAccent(o.accent);
        if(o.fontId)  setFontId(o.fontId);
        if(o.fontSize)setFontSize(o.fontSize);
        if(o.paper)   setPaper(o.paper);
        toast('CV loaded ✅','ok');
      }catch{ toast('Invalid JSON file','err'); }
    };
    r.readAsText(f); e.target.value='';
  };

  /* ── Reset ── */
  const resetAll = () => {
    if(!window.confirm('Reset all CV data?')) return;
    localStorage.removeItem(SK);
    setData(INIT_DATA()); setTmpl('executive-pro'); setAccent('#1e3a8a');
    setFontId('outfit'); setFontSize('medium'); setPaper('a4');
    toast('Reset complete ✅','ok');
  };

  /* ── PRINT — perfect, only CV, user names file ── */
  const doPrint = () => {
    if(!data.fullName?.trim()) return toast('Enter your full name first','err');
    setShowPrintModal(true);
  };
  const executePrint = (filename) => {
    setShowPrintModal(false);
    const src = paperRef.current;
    if (!src) return;

    // ── APPROACH: inject a <style> that hides everything EXCEPT our
    //    print wrapper, which we teleport directly onto <body>.
    //    We never rely on body > * specificity matching a React child. ──

    // 1. Clone the CV paper
    const clone = src.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.cssText = `
      display:block !important;
      transform:none !important;
      -webkit-transform:none !important;
      position:static !important;
      width:100% !important;
      height:auto !important;
      min-height:0 !important;
      max-height:none !important;
      box-shadow:none !important;
      border-radius:0 !important;
      overflow:visible !important;
      margin:0 !important;
      padding:0 !important;
      background:#fff !important;
    `;

    // 2. Create a wrapper div appended directly to <body>
    const wrapper = document.createElement('div');
    wrapper.id = '__cv_print_wrapper__';
    wrapper.style.cssText = 'display:none;position:static;margin:0;padding:0;background:#fff;';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // 3. Inject a <style> tag that uses a class-based approach to hide everything
    const styleEl = document.createElement('style');
    styleEl.id = '__cv_print_style__';
    styleEl.textContent = `
      @media print {
        @page { margin: 0mm !important; size: auto !important; }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        body.cv-printing > *:not(#__cv_print_wrapper__) {
          display: none !important;
          visibility: hidden !important;
        }
        body.cv-printing #__cv_print_wrapper__ {
          display: block !important;
          visibility: visible !important;
          position: static !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
        }
        body.cv-printing #__cv_print_wrapper__ * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          visibility: visible !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    // 4. Set filename via document.title
    const prevTitle = document.title;
    document.title = (filename || data.fullName || 'CV').replace(/\s+/g, '_');

    // 5. Show the wrapper, add printing class, print
    wrapper.style.display = 'block';
    document.body.classList.add('cv-printing');

    // Double rAF so browser paints the wrapper before opening print dialog
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.print();

      // 6. Cleanup after print dialog closes
      const cleanup = () => {
        document.title = prevTitle;
        document.body.classList.remove('cv-printing');
        wrapper.remove();
        styleEl.remove();
      };
      // afterprint fires when dialog closes in modern browsers
      window.addEventListener('afterprint', cleanup, { once: true });
      // Fallback timeout in case afterprint doesn't fire
      setTimeout(cleanup, 3000);
    }));
  };

  /* ── AI ── */
  const callClaude = async prompt => {
    const r = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:800,messages:[{role:'user',content:prompt}]}),
    });
    const d=await r.json();
    return d.content?.find(b=>b.type==='text')?.text?.trim()||'';
  };
  const aiSummary = async () => {
    setAiLoading(l=>({...l,summary:true})); toast('AI writing summary…','inf',8000);
    try {
      const sk=lines(data.skills).slice(0,6).join(', ')||'various skills';
      const exp=(data.experience||[]).slice(0,2).map(e=>`${e.role} at ${e.company}`).join('; ');
      const text=await callClaude(`Write a punchy 2-3 sentence professional CV summary for a ${data.title||'professional'}. Skills: ${sk}. ${exp?'Experience: '+exp+'.':''} Use strong action verbs, quantify where logical. Just the text, no labels or preamble.`);
      if(text){ sf('summary',text); toast('Summary written ✅','ok'); }
    }catch{ toast('AI error — check console','err'); }
    finally{ setAiLoading(l=>({...l,summary:false})); }
  };
  const aiSkills = async () => {
    setAiLoading(l=>({...l,skills:true}));
    try {
      const text=await callClaude(`List exactly 12 ATS-optimized professional skills for a ${data.title||'professional'}. One skill per line. No bullets, numbers, or preamble.`);
      if(text){ sf('skills',text); toast('Skills added ✅','ok'); }
    }catch{ toast('AI error','err'); }
    finally{ setAiLoading(l=>({...l,skills:false})); }
  };
  const aiBullets = async expItem => {
    toast('AI writing bullets…','inf',8000);
    try {
      const text=await callClaude(`Write 3 strong CV achievement bullet points for ${expItem.role||'a professional'} at ${expItem.company||'a company'}. Start each with a past-tense action verb, quantify impact where possible. One per line, no prefixes or bullet characters.`);
      if(text){ updateItem('experience',{...expItem,bullets:text,_aiBullets:false}); toast('Bullets written ✅','ok'); }
    }catch{ toast('AI error','err'); }
  };
  useEffect(()=>{
    const t=(data.experience||[]).find(x=>x._aiBullets);
    if(t) aiBullets(t);
  },[data.experience]);

  /* ── ATS ── */
  const {score:atsScore, checks:atsChecks} = useMemo(()=>{
    const d=data; let sc=0; const checks=[];
    const ck=(ok,msg,pts)=>{if(ok)sc+=pts;checks.push({ok,msg});};
    ck(d.fullName?.trim(),'Full name present',8);
    ck(d.email?.trim(),'Email address',8);
    ck(d.phoneNum?.trim(),'Phone number',5);
    ck(d.location?.trim(),'Location present',5);
    ck((d.summary||'').length>60,'Professional summary (60+ chars)',15);
    const sk=lines(d.skills).length;
    ck(sk>=6,`${sk} skills listed (aim 6+)`,12);
    const ex=(d.experience||[]).filter(x=>(x.role||x.company||'').trim()).length;
    ck(ex>=1,`${ex} experience entr${ex===1?'y':'ies'}`,18);
    ck((d.education||[]).filter(x=>(x.degree||x.school||'').trim()).length>=1,'Education section',10);
    ck(d.linkedin?.trim(),'LinkedIn URL added',5);
    ck((d.certifications||[]).filter(x=>x.name?.trim()).length>=1,'Certifications added',5);
    ck((d.experience||[]).some(x=>(x.bullets||'').trim().length>10),'Achievement bullets in experience',9);
    return {score:Math.min(sc,100),checks};
  },[data]);
  const atsColor = atsScore>=80?'#059669':atsScore>=50?'#f59e0b':'#dc2626';

  /* ── Template thumbnail ── */
  const buildThumb = t => {
    const c=accent; const W=58,H=72;
    const T={
      'leftbar':        `<rect width="${W}" height="${H}" fill="#fff"/><rect x="0" width="3" height="${H}" fill="${c}"/><rect x="7" y="8" width="28" height="3.5" rx="1.5" fill="${c}"/><rect x="7" y="14" width="20" height="2" rx="1" fill="#64748b" opacity=".5"/><rect x="7" y="22" width="${W-14}" height="1.3" rx=".6" fill="${c}" opacity=".35"/><rect x="7" y="27" width="${W-18}" height="1" rx=".5" fill="#94a3b8" opacity=".5"/>`,
      'topband':        `<rect width="${W}" height="${H}" fill="#fff"/><rect width="${W}" height="20" fill="${c}"/><circle cx="${W-10}" cy="10" r="7" fill="rgba(255,255,255,.25)"/><rect x="5" y="5" width="28" height="4" rx="2" fill="#fff" opacity=".9"/>`,
      'diagonal-hdr':   `<rect width="${W}" height="${H}" fill="#fff"/><polygon points="0,0 ${W},0 ${W},16 0,24" fill="${c}"/><rect x="5" y="5" width="28" height="3.5" rx="1.5" fill="#fff" opacity=".9"/><rect x="5" y="28" width="${W-10}" height="1.3" rx=".6" fill="${c}" opacity=".35"/>`,
      'split-line':     `<rect width="${W}" height="${H}" fill="#fff"/><rect x="5" y="8" width="30" height="3.5" rx="1.5" fill="${c}"/><rect y="20" width="${W}" height="1.5" fill="${c}"/><rect x="5" y="26" width="${W-10}" height="1.2" rx=".6" fill="#475569" opacity=".35"/>`,
      'center':         `<rect width="${W}" height="${H}" fill="#fff"/><rect x="8" y="14" width="42" height="4" rx="2" fill="${c}" opacity=".9"/><rect x="12" y="21" width="34" height="2" rx="1" fill="#64748b" opacity=".4"/><rect x="5" y="28" width="${W-10}" height="1" rx=".5" fill="#e2e8f0"/>`,
      'swiss':          `<rect width="${W}" height="${H}" fill="#fafafa"/><rect x="5" y="6" width="3" height="14" fill="${c}"/><rect x="12" y="8" width="30" height="4" fill="${c}"/><rect x="12" y="15" width="22" height="2" fill="#475569" opacity=".45"/>`,
      'ink':            `<rect width="${W}" height="${H}" fill="#fff"/><rect x="5" y="9" width="30" height="4" fill="${c}"/><rect x="5" y="16" width="48" height=".75" fill="${c}"/>`,
      'dots':           `<rect width="${W}" height="${H}" fill="#fff"/><rect x="5" y="8" width="30" height="4" rx="2" fill="${c}"/>${[0,8,16,24,32,40,48,56,64].map(y=>[0,8,16,24,32,40,48].map(x2=>`<circle cx="${x2+5}" cy="${y+20}" r=".5" fill="#e2e8f0"/>`).join('')).join('')}`,
      'sidebar-l':      `<rect width="${W}" height="${H}" fill="#fff"/><rect width="20" height="${H}" fill="${c}"/><circle cx="10" cy="10" r="6" fill="rgba(255,255,255,.25)"/><rect x="24" y="8" width="28" height="3.5" rx="1.5" fill="${c}"/>`,
      'sidebar-lite':   `<rect width="${W}" height="${H}" fill="#f8fafc"/><rect width="20" height="${H}" fill="${c}" opacity=".12"/><rect x="2" y="8" width="16" height="2" rx="1" fill="${c}"/><rect x="24" y="8" width="28" height="3.5" rx="1.5" fill="${c}"/>`,
      'sidebar-r':      `<rect width="${W}" height="${H}" fill="#fff"/><rect x="${W-20}" width="20" height="${H}" fill="${c}"/><rect x="5" y="8" width="28" height="3.5" rx="1.5" fill="${c}"/>`,
      'sidebar-teal':   `<rect width="${W}" height="${H}" fill="#fff"/><rect width="20" height="${H}" fill="${c}" opacity=".85"/><rect x="24" y="8" width="28" height="3.5" rx="1.5" fill="${c}" opacity=".8"/>`,
      'magazine':       `<rect width="${W}" height="${H}" fill="#fff"/><rect y="${H-16}" width="${W}" height="16" fill="${c}"/><rect x="5" y="5" width="36" height="6" rx="1" fill="${c}"/>`,
      'diag-burst':     `<rect width="${W}" height="${H}" fill="#fff"/><polygon points="0,0 ${W*0.6},0 0,${H*0.45}" fill="${c}"/><rect x="6" y="10" width="24" height="3.5" rx="1.5" fill="#fff"/>`,
      'geometric':      `<rect width="${W}" height="${H}" fill="#fff"/><polygon points="0,0 30,0 0,30" fill="${c}"/><rect x="5" y="35" width="30" height="3.5" rx="1.5" fill="${c}"/>`,
      'dark':           `<rect width="${W}" height="${H}" fill="#0f172a"/><rect x="5" y="8" width="30" height="4" rx="2" fill="${c}"/><rect x="5" y="15" width="22" height="2" rx="1" fill="rgba(255,255,255,.5)"/>`,
      'oxford':         `<rect width="${W}" height="${H}" fill="#fff"/><rect x="15" y="8" width="28" height="4" fill="#1a1a2e"/><rect x="5" y="15" width="${W-10}" height=".75" fill="#1a1a2e"/>`,
      'research':       `<rect width="${W}" height="${H}" fill="#fffef7"/><rect x="10" y="6" width="38" height="4" fill="#1a1a2e"/><rect x="5" y="13" width="${W-10}" height="1" fill="#1a1a2e"/>`,
      'euro':           `<rect width="${W}" height="${H}" fill="#fff"/><rect x="5" y="6" width="18" height="18" rx="2" fill="${c}" opacity=".12" stroke="${c}" stroke-width="1"/><rect x="26" y="8" width="26" height="3.5" rx="1.5" fill="${c}"/>`,
      'gulf':           `<rect width="${W}" height="${H}" fill="#fff"/><rect width="${W}" height="20" fill="${c}"/><rect y="20" width="${W}" height="3" fill="${c}" opacity=".4"/>`,
      'bilingual':      `<rect width="${W}" height="${H}" fill="#fff"/><rect x="0" width="${W/2}" height="18" fill="${c}"/><rect x="${W/2}" width="${W/2}" height="18" fill="${c}" opacity=".6"/>`,
      'pearl':          `<rect width="${W}" height="${H}" fill="#fdfcf8"/><rect x="4" y="4" width="${W-8}" height="${H-8}" rx="3" fill="none" stroke="${c}" stroke-width=".75"/><rect x="10" y="12" width="38" height="4" rx="2" fill="${c}"/>`,
      '2col':           `<rect width="${W}" height="${H}" fill="#fff"/><rect width="${W}" height="18" fill="${c}"/><rect x="${W*0.42}" y="0" width="1" height="${H}" fill="#e2e8f0"/>`,
      'infograph':      `<rect width="${W}" height="${H}" fill="#fff"/><rect width="${W}" height="16" fill="${c}"/><rect x="${W*0.45}" y="0" width="1.5" height="${H}" fill="${c}" opacity=".12"/><circle cx="${W*0.2}" cy="30" r="6" fill="${c}" opacity=".15" stroke="${c}" stroke-width=".75"/>`,
      'timeline':       `<rect width="${W}" height="${H}" fill="#fff"/><rect x="${W/2-.75}" y="0" width="1.5" height="${H}" fill="${c}" opacity=".25"/><circle cx="${W/2}" cy="20" r="3" fill="${c}"/><circle cx="${W/2}" cy="38" r="3" fill="${c}" opacity=".6"/>`,
    };
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" height="62" aria-hidden="true">${T[t.thumb]||T['leftbar']}</svg>`;
  };

  /* ================================================================
     CV HTML BUILDER — pure function, renders all 25 templates
  ================================================================ */
  const cvHtml = useMemo(() => {
    const d    = data;
    const font = (FONTS.find(f=>f.id===fontId)||FONTS[0]).s;
    const fs   = FSIZES[fontSize];
    const ac   = accent;
    const {w:pw, h:ph} = PAPERS[paper];

    const exp   = (d.experience||[]).filter(x=>(x.role||x.company||'').trim());
    const edu   = (d.education||[]).filter(x=>(x.degree||x.school||'').trim());
    const projs = (d.projects||[]).filter(x=>x.name?.trim());
    const certs = (d.certifications||[]).filter(x=>x.name?.trim());
    const langs = (d.languages||[]).filter(x=>x.lang?.trim());
    const awards= (d.awards||[]).filter(x=>x.title?.trim());
    const pubs  = (d.publications||[]).filter(x=>x.title?.trim());
    const vols  = (d.volunteer||[]).filter(x=>x.role?.trim());
    const refs  = (d.references||[]).filter(x=>x.name?.trim());
    const skills= lines(d.skills);
    const hobs  = lines(d.hobbies);
    const nm    = he(d.fullName||'Your Name');
    const hasP  = !!d.photoDataUrl;
    const phone = d.phoneCode&&d.phoneNum ? `${d.phoneCode} ${d.phoneNum}` : (d.phoneNum||'');

    /* ── Contact icon items ── */
    const ci=(icon,text,col='inherit')=>{
      if(!text?.trim()) return '';
      return `<span style="display:inline-flex;align-items:center;margin-right:12px;margin-bottom:4px;color:${col}">${icon}${he(text)}</span>`;
    };
    const contactRow=(col='#475569',justify='flex-start')=>{
      let h='';
      h+=ci(ICO.email,   d.email,  col);
      h+=ci(ICO.phone,   phone,    col);
      h+=ci(ICO.location,d.location,col);
      h+=ci(ICO.linkedin,(d.linkedin||'').replace(/https?:\/\//,''),col);
      h+=ci(ICO.github,  (d.github||'').replace(/https?:\/\//,''), col);
      h+=ci(ICO.web,     (d.website||'').replace(/https?:\/\//,''),col);
      h+=ci(ICO.calendar,d.dob,    col);
      h+=ci(ICO.flag,    d.nationality,col);
      h+=ci(ICO.car,     d.drivingLicense,col);
      return h?`<div style="display:flex;flex-wrap:wrap;font-size:.79em;line-height:1.65;justify-content:${justify}">${h}</div>`:'';
    };
    const sideContact=(col='rgba(255,255,255,.85)')=>{
      const items=[
        d.email&&`${ICO.email}<span style="word-break:break-all">${he(d.email)}</span>`,
        phone&&`${ICO.phone}${he(phone)}`,
        d.location&&`${ICO.location}${he(d.location)}`,
        d.linkedin&&`${ICO.linkedin}${he((d.linkedin).replace(/https?:\/\//,''))}`,
        d.nationality&&`${ICO.flag}${he(d.nationality)}`,
        d.drivingLicense&&`${ICO.car}${he(d.drivingLicense)}`,
      ].filter(Boolean);
      return items.map(i=>`<div style="display:flex;align-items:flex-start;gap:4px;font-size:.78em;color:${col};margin-bottom:5px">${i}</div>`).join('');
    };

    /* ── Photo ── */
    const photoEl=(size=90,shape='rect',border='2px solid rgba(255,255,255,.3)')=>{
      if(!hasP) return '';
      const br=shape==='circle'?'50%':shape==='rounded'?'8px':'4px';
      const h2=shape==='rect'?Math.round(size*1.25):size;
      return `<img src="${d.photoDataUrl}" alt="Profile" style="width:${size}px;height:${h2}px;object-fit:cover;object-position:top center;border-radius:${br};border:${border};flex-shrink:0"/>`;
    };

    /* ── Section title ── */
    const std=`color:${ac};border-bottom:2px solid ${ac};padding-bottom:3px;`;
    const ST=(txt,extra='')=>`<div style="font-family:${font};font-size:.74em;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;margin:15px 0 7px;${extra||std}">${txt}</div>`;

    /* ── Blocks ── */
    const expB=(x,opts={})=>{
      const b=lines(x.bullets);
      const dt=[x.start,x.current?'Present':x.end].filter(Boolean).join(' – ');
      return `<div style="margin-bottom:13px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <div style="flex:1;min-width:0">
            <div style="font-weight:800;font-size:.94em;display:flex;align-items:center;gap:5px;flex-wrap:wrap">
              ${x.companyLogo?`<img src="${x.companyLogo}" style="width:14px;height:14px;object-fit:contain;border-radius:2px;flex-shrink:0" onerror="this.style.display='none'" alt=""/>`:``}
              <span>${he(x.role)}</span>
            </div>
            <div style="font-size:.85em;color:${opts.sub||'#475569'};font-weight:600">${he(x.company||'')}${x.empType&&x.empType!=='Full-time'?` · <em style="font-weight:500">${he(x.empType)}</em>`:''}${x.city?` · ${he(x.city)}`:''}</div>
          </div>
          ${dt?`<span style="font-size:.78em;color:${opts.dt||'#64748b'};font-weight:700;white-space:nowrap;flex-shrink:0">${he(dt)}</span>`:''}
        </div>
        ${b.length?`<ul style="margin:4px 0 0;padding-left:15px">${b.map(li=>`<li style="margin:2px 0;font-size:.87em;color:${opts.bc||'#374151'};line-height:1.55">${he(li)}</li>`).join('')}</ul>`:''}
      </div>`;
    };
    const eduB=(x,opts={})=>{
      const n=lines(x.notes);
      return `<div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">
          <div style="flex:1;min-width:0">
            <div style="font-weight:800;font-size:.93em;display:flex;align-items:center;gap:5px;flex-wrap:wrap">
              ${x.schoolLogo?`<img src="${x.schoolLogo}" style="width:14px;height:14px;object-fit:contain;border-radius:2px" onerror="this.style.display='none'" alt=""/>`:``}
              <span>${he((x.degType?x.degType+' in ':'')+x.degree)}</span>
            </div>
            <div style="font-size:.85em;color:${opts.sub||'#475569'};font-weight:600">${he(x.school||'')}${x.city?` · ${he(x.city)}`:''}</div>
            ${x.gpa?`<div style="font-size:.8em;color:${opts.ac2||ac};font-weight:700;margin-top:1px">Grade: ${he(x.gpa)}</div>`:''}
          </div>
          ${(x.start||x.end)?`<span style="font-size:.78em;color:${opts.dt||'#64748b'};font-weight:700;white-space:nowrap;flex-shrink:0">${he([x.start,x.end].filter(Boolean).join(' – '))}</span>`:''}
        </div>
        ${n.length?`<ul style="margin:3px 0 0;padding-left:14px">${n.map(ni=>`<li style="font-size:.84em;color:${opts.bc||'#374151'}">${he(ni)}</li>`).join('')}</ul>`:''}
      </div>`;
    };
    const LLVL={Native:100,Fluent:88,Professional:72,Conversational:52,Elementary:30};
    const chips=(arr,bg=`rgba(0,0,0,.06)`,br=`rgba(0,0,0,.1)`,col='inherit')=>
      `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:5px">${arr.map(s=>`<span style="padding:2px 8px;border-radius:99px;background:${bg};border:1px solid ${br};font-weight:700;font-size:.76em;color:${col}">${he(s)}</span>`).join('')}</div>`;
    const langBars=(col=ac)=>langs.map(l=>`<div style="margin-bottom:5px">
      <div style="display:flex;justify-content:space-between;font-size:.8em;font-weight:600;margin-bottom:2px"><span>${he(l.lang)}</span><span style="font-size:.85em;opacity:.7">${he(l.level)}</span></div>
      <div style="height:4px;background:rgba(0,0,0,.1);border-radius:99px;overflow:hidden"><div style="height:100%;width:${LLVL[l.level]||70}%;background:${col};border-radius:99px"></div></div>
    </div>`).join('');
    const sideST=(txt,col='rgba(255,255,255,.55)')=>
      `<div style="font-size:.62em;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:${col};border-bottom:1px solid rgba(255,255,255,.18);padding-bottom:3px;margin:14px 0 7px">${txt}</div>`;
    const sideSkills=(col='rgba(255,255,255,.9)')=>skills.map(s=>`<div style="font-size:.8em;margin-bottom:3px;color:${col}">${he(s)}</div>`).join('');
    const sideLangs=(col='rgba(255,255,255,.9)')=>langs.map(l=>`<div style="margin-bottom:5px"><div style="display:flex;justify-content:space-between;font-size:.8em;color:${col};margin-bottom:2px"><span>${he(l.lang)}</span><span style="opacity:.7">${he(l.level)}</span></div><div style="height:3px;background:rgba(255,255,255,.2);border-radius:99px"><div style="height:100%;width:${LLVL[l.level]||70}%;background:rgba(255,255,255,.7);border-radius:99px"></div></div></div>`).join('');
    const sideEdu=()=>edu.map(x=>`<div style="margin-bottom:8px">${x.schoolLogo?`<img src="${x.schoolLogo}" style="width:15px;height:15px;object-fit:contain;border-radius:2px;margin-bottom:2px" onerror="this.style.display='none'" alt=""/>`:''}<div style="font-size:.84em;font-weight:700">${he(x.degree)}</div><div style="font-size:.78em;opacity:.75">${he(x.school)}</div><div style="font-size:.74em;opacity:.6">${he([x.start,x.end].filter(Boolean).join('–'))}</div></div>`).join('');

    const extras=(ac2=ac)=>{
      let h='';
      if(awards.length) h+=ST('Awards',`color:${ac2};${std}`)+awards.map(x=>`<div style="margin-bottom:9px"><div style="display:flex;justify-content:space-between;align-items:flex-start"><span style="font-size:.91em;font-weight:800">${he(x.title)}${x.issuer?` <span style="font-weight:500;color:${ac2}">— ${he(x.issuer)}</span>`:''}</span>${x.year?`<span style="font-size:.78em;color:#64748b;font-weight:700">${he(x.year)}</span>`:''}</div>${x.desc?`<p style="font-size:.86em;color:#374151;margin-top:2px">${he(x.desc)}</p>`:''}</div>`).join('');
      if(pubs.length)   h+=ST('Publications',`color:${ac2};${std}`)+pubs.map(x=>`<div style="margin-bottom:7px;font-size:.87em"><strong>${he(x.title)}</strong>${x.journal?` — ${he(x.journal)}`:''}${x.year?`. <em>${he(x.year)}</em>`:''}</div>`).join('');
      if(vols.length)   h+=ST('Volunteer',`color:${ac2};${std}`)+vols.map(x=>`<div style="margin-bottom:9px"><div style="font-size:.91em;font-weight:800">${he(x.role)}${x.org?` — ${he(x.org)}`:''}</div>${x.desc?`<p style="font-size:.86em;color:#374151;margin-top:2px">${he(x.desc)}</p>`:''}</div>`).join('');
      if(refs.length)   h+=ST('References',`color:${ac2};${std}`)+`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:8px;margin-top:5px">${refs.map(x=>`<div style="padding:8px;background:rgba(0,0,0,.025);border-radius:6px;border:1px solid rgba(0,0,0,.07);font-size:.84em"><strong>${he(x.name)}</strong><div style="font-size:.88em;color:${ac2};font-weight:600">${he(x.relationship||'')}${x.refTitle?` — ${he(x.refTitle)}`:''}</div><div style="opacity:.72">${he(x.company||'')}</div><div style="font-size:.88em;opacity:.6;word-break:break-all">${he(x.email||'')}${x.phone?`<br>${he(x.phone)}`:''}</div></div>`).join('')}</div>`;
      return h;
    };

    /* Main sections helper */
    const mainSec=()=>{
      let h='';
      if(d.summary) h+=`${ST('Summary')}<p style="font-size:.91em;color:#374151;line-height:1.75;margin-bottom:4px">${he(d.summary)}</p>`;
      if(exp.length) h+=ST('Experience')+exp.map(x=>expB(x)).join('');
      if(edu.length) h+=ST('Education')+edu.map(x=>eduB(x)).join('');
      if(projs.length) h+=ST('Projects')+projs.map(x=>`<div style="margin-bottom:10px"><strong style="font-size:.93em">${he(x.name)}</strong>${x.tech?`<span style="color:${ac};font-weight:600"> · ${he(x.tech)}</span>`:''}<ul style="padding-left:14px;margin-top:3px">${lines(x.bullets).map(b=>`<li style="font-size:.87em;color:#374151">${he(b)}</li>`).join('')}</ul></div>`).join('');
      if(skills.length) h+=ST('Skills')+chips(skills,`${ac}18`,'transparent',ac);
      if(langs.length)  h+=ST('Languages')+langBars(ac);
      if(certs.length)  h+=ST('Certifications')+`<ul style="padding-left:14px">${certs.map(x=>`<li style="font-size:.87em;margin:3px 0"><strong>${he(x.name)}</strong>${x.issuer?` — ${he(x.issuer)}`:''}${x.year?` (${he(x.year)})`:''}</li>`).join('')}</ul>`;
      h+=extras(ac);
      return h;
    };
    const sideMain=()=>{
      let h='';
      if(d.summary) h+=`<p style="font-size:.91em;color:#374151;line-height:1.75;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #e2e8f0">${he(d.summary)}</p>`;
      if(exp.length) h+=ST('Experience')+exp.map(x=>expB(x)).join('');
      if(projs.length) h+=ST('Projects')+projs.map(x=>`<div style="margin-bottom:10px"><strong>${he(x.name)}</strong>${x.tech?` · <em style="color:${ac}">${he(x.tech)}</em>`:''}<ul style="padding-left:13px;margin-top:3px">${lines(x.bullets).map(b=>`<li style="font-size:.86em">${he(b)}</li>`).join('')}</ul></div>`).join('');
      h+=extras(ac);
      return h;
    };

    /* Base document style */
    const DS=`font-family:${font};font-size:${fs};color:#0f172a;line-height:1.5;background:#fff;min-height:${ph}px;overflow:hidden`;
    const sdW=195;

    /* Helper for sidebar panel */
    const sidePanel=(dark=true,panelBg=ac)=>{
      const tc=dark?'#fff':'#374151';
      const tsub=dark?'rgba(255,255,255,.55)':'#64748b';
      const tbar=dark?'rgba(255,255,255,.7)':ac;
      return `<div style="width:${sdW}px;flex-shrink:0;background:${panelBg};padding:22px 15px;color:${tc};min-height:${ph}px">
        ${hasP?`<div style="margin-bottom:12px">${photoEl(76,'circle',dark?'3px solid rgba(255,255,255,.35)':`3px solid ${ac}`)}</div>`:''}
        <div style="font-size:1.25em;font-weight:900;line-height:1.2;margin-bottom:3px">${nm}</div>
        ${d.title?`<div style="font-size:.85em;font-weight:600;opacity:.85;margin-bottom:12px">${he(d.title)}</div>`:''}
        ${dark?sideST('Contact',tsub)+sideContact():`<div style="font-size:.65em;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${ac};margin:12px 0 6px">Contact</div><div style="font-size:.8em;color:#374151;display:flex;flex-direction:column;gap:4px">${sideContact('#374151')}</div>`}
        ${skills.length?(dark?sideST('Skills',tsub)+`<div style="display:flex;flex-wrap:wrap;gap:3px">${skills.map(s=>`<span style="font-size:.74em;padding:2px 7px;border-radius:99px;background:rgba(255,255,255,.18);margin-bottom:3px">${he(s)}</span>`).join('')}</div>`:
          `<div style="font-size:.65em;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${ac};margin:12px 0 6px">Skills</div>${skills.map(s=>`<div style="margin-bottom:5px"><div style="font-size:.8em;font-weight:600;margin-bottom:2px;color:#374151">${he(s)}</div><div style="height:3px;background:${ac}25;border-radius:99px"><div style="height:100%;width:75%;background:${ac};border-radius:99px"></div></div></div>`).join('')}`):''}
        ${langs.length?(dark?sideST('Languages',tsub)+sideLangs():`<div style="font-size:.65em;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${ac};margin:12px 0 6px">Languages</div>${langs.map(l=>`<div style="font-size:.8em;font-weight:700;margin-bottom:3px;color:#374151">${he(l.lang)} <span style="color:${ac}">${he(l.level)}</span></div>`).join('')}`):''}
        ${edu.length?(dark?sideST('Education',tsub)+sideEdu():`<div style="font-size:.65em;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${ac};margin:12px 0 6px">Education</div>${edu.map(x=>`<div style="margin-bottom:7px"><div style="font-size:.83em;font-weight:700;color:#1e293b">${he(x.degree)}</div><div style="font-size:.78em;color:#475569">${he(x.school)}</div></div>`).join('')}`):''}
        ${certs.length?(dark?sideST('Certifications',tsub)+certs.map(c=>`<div style="font-size:.8em;margin-bottom:4px;opacity:.9">${he(c.name)}</div>`).join(''):''):''}
      </div>`;
    };

    /* ════════ 25 TEMPLATES ════════ */
    if(tmpl==='executive-pro') return `<div style="${DS};padding:26px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:3px solid ${ac}">
        <div style="flex:1;min-width:0">${`<div style="font-size:2.1em;font-weight:900;line-height:1;letter-spacing:-.5px">${nm}</div>`}${d.title?`<div style="font-size:1.08em;font-weight:700;color:${ac};margin:4px 0 8px">${he(d.title)}</div>`:''}${contactRow()}</div>
        ${photoEl(88,'rect')}
      </div>
      ${d.summary?`<div style="margin:14px 0;padding:10px 14px;background:${ac}10;border-left:4px solid ${ac};border-radius:0 6px 6px 0;font-size:.91em;color:#374151;line-height:1.7">${he(d.summary)}</div>`:''}
      ${exp.length?ST('Experience',`color:${ac};background:${ac}10;padding:4px 9px 4px 10px;border-left:4px solid ${ac};border-radius:0 4px 4px 0;border-bottom:none;`)+exp.map(x=>expB(x)).join(''):''}
      ${edu.length?ST('Education',`color:${ac};background:${ac}10;padding:4px 9px 4px 10px;border-left:4px solid ${ac};border-radius:0 4px 4px 0;border-bottom:none;`)+edu.map(x=>eduB(x)).join(''):''}
      ${projs.length?ST('Projects',`color:${ac};background:${ac}10;padding:4px 9px 4px 10px;border-left:4px solid ${ac};border-radius:0 4px 4px 0;border-bottom:none;`)+projs.map(x=>`<div style="margin-bottom:10px"><strong>${he(x.name)}</strong>${x.tech?`<span style="color:${ac}"> · ${he(x.tech)}</span>`:''}<ul style="padding-left:14px;margin-top:3px">${lines(x.bullets).map(b=>`<li style="font-size:.87em">${he(b)}</li>`).join('')}</ul></div>`).join(''):''}
      ${skills.length?ST('Skills',`color:${ac};background:${ac}10;padding:4px 9px 4px 10px;border-left:4px solid ${ac};border-radius:0 4px 4px 0;border-bottom:none;`)+chips(skills):''}
      ${langs.length?ST('Languages',`color:${ac};background:${ac}10;padding:4px 9px 4px 10px;border-left:4px solid ${ac};border-radius:0 4px 4px 0;border-bottom:none;`)+langBars(ac):''}
      ${certs.length?ST('Certifications',`color:${ac};background:${ac}10;padding:4px 9px 4px 10px;border-left:4px solid ${ac};border-radius:0 4px 4px 0;border-bottom:none;`)+`<ul style="padding-left:14px">${certs.map(x=>`<li style="font-size:.87em;margin:3px 0"><strong>${he(x.name)}</strong>${x.issuer?` — ${he(x.issuer)}`:''}${x.year?` (${he(x.year)})`:''}</li>`).join('')}</ul>`:''}
      ${extras(ac)}
    </div>`;

    if(tmpl==='corporate-navy') return `<div style="${DS}">
      <div style="background:${ac};padding:24px 26px 18px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px">
        <div style="flex:1;min-width:0"><div style="font-size:2.2em;font-weight:900;color:#fff;line-height:1;letter-spacing:-.3px">${nm}</div>${d.title?`<div style="font-size:1.1em;font-weight:600;color:rgba(255,255,255,.85);margin:5px 0 10px;text-transform:uppercase;letter-spacing:.5px">${he(d.title)}</div>`:''}${contactRow('rgba(255,255,255,.8)')}</div>
        ${photoEl(82,'circle','3px solid rgba(255,255,255,.4)')}
      </div>
      <div style="background:${ac}22;height:4px"></div>
      <div style="padding:20px 26px">${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #e2e8f0">${he(d.summary)}</p>`:''}${mainSec()}</div>
    </div>`;

    if(tmpl==='sharp-angles') return `<div style="${DS};position:relative">
      <div style="height:132px;background:${ac};clip-path:polygon(0 0,100% 0,100% 68%,0 100%);display:flex;align-items:flex-start;padding:22px 26px;justify-content:space-between;gap:16px">
        <div style="flex:1;min-width:0"><div style="font-size:2em;font-weight:900;color:#fff;line-height:1;letter-spacing:-.3px">${nm}</div>${d.title?`<div style="color:rgba(255,255,255,.85);font-size:1em;font-weight:600;margin-top:5px">${he(d.title)}</div>`:''}${contactRow('rgba(255,255,255,.78)')}</div>
        ${photoEl(74,'circle','3px solid rgba(255,255,255,.5)')}
      </div>
      <div style="padding:0 26px 22px;margin-top:-8px">${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.72;margin-bottom:12px">${he(d.summary)}</p>`:''}${mainSec()}</div>
    </div>`;

    if(tmpl==='modern-stack') return `<div style="${DS};padding:28px">
      <div style="border-bottom:6px solid ${ac};padding-bottom:14px;margin-bottom:16px"><div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div style="flex:1;min-width:0"><div style="font-size:2.3em;font-weight:900;letter-spacing:-1px;line-height:1">${nm}</div>${d.title?`<div style="font-size:1em;color:${ac};font-weight:700;margin-top:4px;text-transform:uppercase;letter-spacing:.5px">${he(d.title)}</div>`:''}${contactRow(ac)}</div>
        ${photoEl(78,'rounded',`2px solid ${ac}22`)}
      </div></div>
      ${d.summary?`<div style="font-size:.91em;line-height:1.72;color:#374151;margin-bottom:14px;padding:10px;background:#f8fafc;border-radius:6px;font-style:italic">${he(d.summary)}</div>`:''}
      <div style="display:grid;grid-template-columns:1.4fr .6fr;gap:20px">
        <div>${exp.length?ST('Experience')+exp.map(x=>expB(x)).join(''):''}${edu.length?ST('Education')+edu.map(x=>eduB(x)).join(''):''}${projs.length?ST('Projects')+projs.map(x=>`<div style="margin-bottom:10px"><strong>${he(x.name)}</strong>${x.tech?` <em style="color:${ac}">${he(x.tech)}</em>`:''}<ul style="padding-left:13px;margin-top:3px">${lines(x.bullets).map(b=>`<li style="font-size:.86em">${he(b)}</li>`).join('')}</ul></div>`).join(''):''}${extras(ac)}</div>
        <div>${skills.length?ST('Skills')+chips(skills):''}${langs.length?ST('Languages')+langBars(ac):''}${certs.length?ST('Certs')+`<ul style="padding-left:13px">${certs.map(x=>`<li style="font-size:.84em;margin:3px 0">${he(x.name)}${x.year?` (${he(x.year)})`:''}</li>`).join('')}</ul>`:''}</div>
      </div>
    </div>`;

    if(tmpl==='pure-white') return `<div style="${DS};padding:34px 30px">
      <div style="text-align:center;margin-bottom:18px">${photoEl(78,'circle','none')}<div style="margin-top:10px;font-size:2.3em;font-weight:900;letter-spacing:-1px;line-height:1">${nm}</div>${d.title?`<div style="font-size:1em;color:#64748b;font-weight:600;margin-top:4px">${he(d.title)}</div>`:''}${contactRow('#64748b','center')}</div>
      ${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.8;margin-bottom:16px;text-align:center">${he(d.summary)}</p>`:''}
      <div style="width:60px;height:2px;background:${ac};margin:0 auto 16px"></div>
      ${mainSec()}
    </div>`;

    if(tmpl==='swiss-clean') return `<div style="${DS};display:grid;grid-template-columns:8px 1fr;overflow:hidden">
      <div style="background:${ac}"></div>
      <div style="padding:24px 22px">
        <div style="display:flex;align-items:flex-start;gap:14px;border-bottom:2px solid #000;padding-bottom:14px;margin-bottom:14px">
          <div style="flex:1;min-width:0"><div style="font-size:2.2em;font-weight:900;letter-spacing:-1.5px;line-height:.95;text-transform:uppercase">${nm}</div>${d.title?`<div style="font-size:1em;font-weight:700;color:${ac};margin-top:5px;text-transform:uppercase;letter-spacing:.5px">${he(d.title)}</div>`:''}</div>
          ${photoEl(74,'rect','none')}
        </div>
        ${contactRow('#000')}${d.summary?`<p style="font-size:.91em;line-height:1.7;margin:10px 0 14px;border-left:2px solid ${ac};padding-left:10px">${he(d.summary)}</p>`:''}
        ${exp.length?ST('Work Experience',`color:#000;border-bottom:2px solid #000;font-size:.72em;letter-spacing:2px;`)+exp.map(x=>expB(x,{sub:'#555',dt:'#333'})).join(''):''}
        ${edu.length?ST('Education',`color:#000;border-bottom:2px solid #000;font-size:.72em;letter-spacing:2px;`)+edu.map(x=>eduB(x)).join(''):''}
        ${skills.length?ST('Skills',`color:#000;border-bottom:2px solid #000;font-size:.72em;letter-spacing:2px;`)+chips(skills,'#f1f5f9','#e2e8f0','#000'):''}
        ${langs.length?ST('Languages',`color:#000;border-bottom:2px solid #000;font-size:.72em;letter-spacing:2px;`)+langBars('#000'):''}
        ${extras('#000')}
      </div>
    </div>`;

    if(tmpl==='ink-line') return `<div style="${DS};padding:28px">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:7px">
        <div style="flex:1;min-width:0"><div style="font-size:2.4em;font-weight:900;letter-spacing:-1px;line-height:1">${nm}</div>${d.title?`<div style="font-size:1em;color:${ac};font-weight:700;margin-top:3px">${he(d.title)}</div>`:''}</div>
        ${photoEl(78,'circle',`3px solid ${ac}`)}
      </div>
      <div style="height:4px;background:linear-gradient(90deg,${ac},${ac}55,transparent);margin-bottom:11px;border-radius:2px"></div>
      ${contactRow(ac)}${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;margin:10px 0 14px">${he(d.summary)}</p>`:''}
      ${mainSec()}
    </div>`;

    if(tmpl==='dot-grid') return `<div style="${DS};background-image:radial-gradient(#e2e8f0 1px,transparent 1px);background-size:14px 14px;padding:26px">
      <div style="background:rgba(255,255,255,.92);border-radius:12px;padding:20px;margin-bottom:12px;box-shadow:0 2px 12px rgba(0,0,0,.06)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
          <div style="flex:1;min-width:0"><div style="font-size:2em;font-weight:900;letter-spacing:-.5px;line-height:1">${nm}</div>${d.title?`<div style="font-size:1em;color:${ac};font-weight:700;margin:4px 0 8px">${he(d.title)}</div>`:''}${contactRow(ac)}</div>
          ${photoEl(80,'circle',`3px solid ${ac}`)}
        </div>
        ${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.72;margin-top:10px">${he(d.summary)}</p>`:''}
      </div>
      ${exp.length?`<div style="background:rgba(255,255,255,.92);border-radius:12px;padding:15px;margin-bottom:10px">${ST('Experience')}${exp.map(x=>expB(x)).join('')}</div>`:''}
      ${edu.length?`<div style="background:rgba(255,255,255,.92);border-radius:12px;padding:15px;margin-bottom:10px">${ST('Education')}${edu.map(x=>eduB(x)).join('')}</div>`:''}
      ${skills.length?`<div style="background:rgba(255,255,255,.92);border-radius:12px;padding:15px;margin-bottom:10px">${ST('Skills')}${chips(skills,`${ac}15`,'transparent',ac)}</div>`:''}
      ${langs.length?`<div style="background:rgba(255,255,255,.92);border-radius:12px;padding:15px;margin-bottom:10px">${ST('Languages')}${langBars(ac)}</div>`:''}
      ${extras(ac)}
    </div>`;

    // Sidebars
    if(tmpl==='sidebar-dark') return `<div style="${DS};display:flex">
      ${sidePanel(true,ac)}
      <div style="flex:1;padding:22px 20px;min-height:${ph}px">${sideMain()}</div>
    </div>`;

    if(tmpl==='sidebar-light') return `<div style="${DS};display:flex">
      ${sidePanel(false,`${ac}22`)}
      <div style="flex:1;padding:22px 20px;min-height:${ph}px">${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;margin-bottom:14px">${he(d.summary)}</p>`:''}${exp.length?ST('Experience')+exp.map(x=>expB(x)).join(''):''}${projs.length?ST('Projects')+projs.map(x=>`<div style="margin-bottom:10px"><strong>${he(x.name)}</strong>${x.tech?` · <em style="color:${ac}">${he(x.tech)}</em>`:''}<ul style="padding-left:13px;margin-top:3px">${lines(x.bullets).map(b=>`<li style="font-size:.86em">${he(b)}</li>`).join('')}</ul></div>`).join(''):''}${certs.length?ST('Certifications')+`<ul style="padding-left:13px">${certs.map(x=>`<li style="font-size:.87em;margin:3px 0">${he(x.name)}${x.year?` (${he(x.year)})`:''}</li>`).join('')}</ul>`:''}${extras(ac)}</div>
    </div>`;

    if(tmpl==='sidebar-right') return `<div style="${DS};display:flex">
      <div style="flex:1;padding:22px 20px;min-height:${ph}px"><div style="font-size:2em;font-weight:900;line-height:1;margin-bottom:4px">${nm}</div>${d.title?`<div style="font-size:1em;color:${ac};font-weight:700;margin-bottom:8px">${he(d.title)}</div>`:''}${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;margin-bottom:14px;padding-bottom:12px;border-bottom:2px solid ${ac}">${he(d.summary)}</p>`:''}${exp.length?ST('Experience')+exp.map(x=>expB(x)).join(''):''}${edu.length?ST('Education')+edu.map(x=>eduB(x)).join(''):''}${extras(ac)}</div>
      <div style="width:${sdW}px;flex-shrink:0;background:${ac};padding:22px 15px;color:#fff;min-height:${ph}px">${hasP?`<div style="margin-bottom:12px">${photoEl(74,'circle','3px solid rgba(255,255,255,.35)')}</div>`:''}${sideST('Contact')}${sideContact()}${skills.length?sideST('Skills')+sideSkills():''}${langs.length?sideST('Languages')+sideLangs():''}${certs.length?sideST('Certifications')+certs.map(c=>`<div style="font-size:.8em;margin-bottom:4px;opacity:.9">${he(c.name)}</div>`).join(''):''}</div>
    </div>`;

    if(tmpl==='sidebar-teal') return `<div style="${DS};display:flex">
      <div style="width:${sdW}px;flex-shrink:0;background:${ac};padding:0 0 22px;color:#fff;min-height:${ph}px">
        <div style="background:rgba(0,0,0,.18);padding:20px 15px 14px">${hasP?`<div style="margin-bottom:10px">${photoEl(72,'circle','2px solid rgba(255,255,255,.5)')}</div>`:''}
          <div style="font-size:1.28em;font-weight:900;line-height:1.2">${nm}</div>${d.title?`<div style="font-size:.84em;font-weight:600;opacity:.85;margin-top:3px">${he(d.title)}</div>`:''}
        </div>
        <div style="padding:0 15px">${sideST('Contact','rgba(255,255,255,.6)')}${sideContact('rgba(255,255,255,.85)')}${skills.length?sideST('Skills','rgba(255,255,255,.6)')+skills.map(s=>`<div style="display:flex;align-items:center;gap:5px;font-size:.8em;margin-bottom:4px"><span style="width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.7);flex-shrink:0"></span>${he(s)}</div>`).join(''):''}${langs.length?sideST('Languages','rgba(255,255,255,.6)')+sideLangs('rgba(255,255,255,.9)'):''}${edu.length?sideST('Education','rgba(255,255,255,.6)')+sideEdu():''}${certs.length?sideST('Certs','rgba(255,255,255,.6)')+certs.map(c=>`<div style="font-size:.8em;margin-bottom:4px;opacity:.88">${he(c.name)}</div>`).join(''):''}</div>
      </div>
      <div style="flex:1;padding:22px 20px;min-height:${ph}px">${sideMain()}</div>
    </div>`;

    if(tmpl==='magazine') return `<div style="${DS}">
      <div style="position:relative;background:${ac};padding:30px 26px 18px;overflow:hidden">
        <div style="position:absolute;top:-30px;right:-30px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.08)"></div>
        <div style="position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:14px">
          <div style="flex:1;min-width:0"><div style="font-size:2.5em;font-weight:900;color:#fff;line-height:.95;letter-spacing:-1.5px">${nm}</div>${d.title?`<div style="font-size:1.05em;font-weight:600;color:rgba(255,255,255,.8);margin-top:6px;text-transform:uppercase;letter-spacing:.5px">${he(d.title)}</div>`:''}</div>
          ${photoEl(86,'rect','3px solid rgba(255,255,255,.4)')}
        </div>
        ${contactRow('rgba(255,255,255,.75)')}
      </div>
      <div style="padding:20px 26px">${d.summary?`<p style="font-size:.93em;color:#374151;line-height:1.75;margin-bottom:14px;font-style:italic;border-left:3px solid ${ac};padding-left:12px">${he(d.summary)}</p>`:''}${mainSec()}</div>
    </div>`;

    if(tmpl==='diagonal-burst') return `<div style="${DS};overflow:hidden">
      <div style="position:relative;height:152px;overflow:hidden">
        <div style="position:absolute;inset:0;background:${ac}"></div>
        <div style="position:absolute;bottom:-1px;right:0;width:0;height:0;border-style:solid;border-width:0 0 152px ${pw*0.55}px;border-color:transparent transparent #fff transparent"></div>
        <div style="position:relative;z-index:1;padding:20px 26px;display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1;min-width:0"><div style="font-size:2em;font-weight:900;color:#fff;letter-spacing:-.3px;line-height:1">${nm}</div>${d.title?`<div style="font-size:1em;color:rgba(255,255,255,.85);font-weight:600;margin-top:4px">${he(d.title)}</div>`:''}${contactRow('rgba(255,255,255,.78)')}</div>
          ${photoEl(78,'circle','3px solid rgba(255,255,255,.5)')}
        </div>
      </div>
      <div style="padding:8px 26px 22px">${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;margin-bottom:14px">${he(d.summary)}</p>`:''}${mainSec()}</div>
    </div>`;

    if(tmpl==='geometric') return `<div style="${DS};position:relative;overflow:hidden">
      <div style="position:absolute;top:0;left:0;width:0;height:0;border-style:solid;border-width:90px 90px 0 0;border-color:${ac} transparent transparent transparent;z-index:1"></div>
      <div style="position:absolute;bottom:0;right:0;width:0;height:0;border-style:solid;border-width:0 0 65px 65px;border-color:transparent transparent ${ac}35 transparent;z-index:1"></div>
      <div style="position:relative;z-index:2;padding:28px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
          <div style="flex:1;min-width:0;padding-left:48px"><div style="font-size:2.1em;font-weight:900;line-height:1;letter-spacing:-.5px">${nm}</div>${d.title?`<div style="font-size:1em;color:${ac};font-weight:700;margin-top:4px">${he(d.title)}</div>`:''}</div>
          ${photoEl(78,'rounded',`2px solid ${ac}`)}
        </div>
        ${contactRow(ac)}${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;margin:10px 0 14px">${he(d.summary)}</p>`:''}
        ${mainSec()}
      </div>
    </div>`;

    if(tmpl==='neon-dark') return `<div style="${DS};background:#0f172a;color:#e2e8f0">
      <div style="padding:26px;border-bottom:1px solid ${ac}44"><div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div style="flex:1;min-width:0"><div style="font-size:2.2em;font-weight:900;letter-spacing:-.5px;line-height:1;color:#f1f5f9">${nm}</div>${d.title?`<div style="font-size:1em;color:${ac};font-weight:700;margin-top:4px">${he(d.title)}</div>`:''}${contactRow(ac)}</div>
        ${hasP?photoEl(78,'circle',`2px solid ${ac}`):''}
      </div></div>
      <div style="padding:20px 26px">${d.summary?`<p style="font-size:.91em;color:#94a3b8;line-height:1.75;margin-bottom:14px">${he(d.summary)}</p>`:''}
        ${exp.length?ST('Experience',`color:${ac};border-bottom:1px solid ${ac}44;`)+exp.map(x=>expB(x,{sub:'#94a3b8',dt:'#64748b',bc:'#cbd5e1'})).join(''):''}
        ${edu.length?ST('Education',`color:${ac};border-bottom:1px solid ${ac}44;`)+edu.map(x=>eduB(x,{sub:'#94a3b8',dt:'#64748b',ac2:ac,bc:'#cbd5e1'})).join(''):''}
        ${skills.length?ST('Skills',`color:${ac};border-bottom:1px solid ${ac}44;`)+chips(skills,`${ac}22`,`${ac}44`,ac):''}
        ${langs.length?ST('Languages',`color:${ac};border-bottom:1px solid ${ac}44;`)+langs.map(l=>`<div style="display:flex;justify-content:space-between;font-size:.84em;color:#94a3b8;margin-bottom:3px"><span>${he(l.lang)}</span><span style="color:${ac}">${he(l.level)}</span></div>`).join(''):''}
        ${extras(ac)}
      </div>
    </div>`;

    if(tmpl==='oxford') return `<div style="${DS};padding:32px;font-family:'Cormorant Garamond','Georgia',serif">
      <div style="text-align:center;margin-bottom:14px">${photoEl(70,'circle',`2px solid #1a1a2e`)}<div style="font-size:2.4em;font-weight:700;letter-spacing:1px;line-height:1;margin-top:10px;color:#1a1a2e">${nm}</div>${d.title?`<div style="font-size:1.1em;font-weight:600;color:#555;margin-top:4px;font-style:italic">${he(d.title)}</div>`:''}
        <div style="width:60px;height:1px;background:#1a1a2e;margin:10px auto"></div>${contactRow('#555','center')}
      </div>
      ${d.summary?`<p style="font-size:.93em;color:#374151;line-height:1.85;margin-bottom:14px;font-style:italic;text-align:center">${he(d.summary)}</p>`:''}
      ${exp.length?ST('EXPERIENCE',`color:#1a1a2e;border-bottom:1px solid #1a1a2e;font-family:'Cormorant Garamond',Georgia,serif;letter-spacing:2px;font-size:.76em;`)+exp.map(x=>expB(x,{sub:'#555',dt:'#777'})).join(''):''}
      ${edu.length?ST('EDUCATION',`color:#1a1a2e;border-bottom:1px solid #1a1a2e;font-family:'Cormorant Garamond',Georgia,serif;letter-spacing:2px;font-size:.76em;`)+edu.map(x=>eduB(x,{sub:'#555',ac2:'#1a1a2e'})).join(''):''}
      ${skills.length?ST('SKILLS',`color:#1a1a2e;border-bottom:1px solid #1a1a2e;font-family:'Cormorant Garamond',Georgia,serif;letter-spacing:2px;font-size:.76em;`)+chips(skills,'#f5f5f0','#ddd','#1a1a2e'):''}
      ${langs.length?ST('LANGUAGES',`color:#1a1a2e;border-bottom:1px solid #1a1a2e;font-family:'Cormorant Garamond',Georgia,serif;letter-spacing:2px;font-size:.76em;`)+langBars('#1a1a2e'):''}
      ${extras('#1a1a2e')}
    </div>`;

    if(tmpl==='research-paper') return `<div style="${DS};background:#fffef7;padding:32px">
      <div style="text-align:center;border-bottom:2px solid #1a1a2e;padding-bottom:12px;margin-bottom:14px"><div style="font-size:2em;font-weight:700;font-family:'Playfair Display',Georgia,serif;color:#1a1a2e;line-height:1">${nm}</div>${d.title?`<div style="font-size:1em;color:#475569;font-weight:600;margin-top:4px">${he(d.title)}</div>`:''}${contactRow('#475569','center')}</div>
      ${d.summary?`<div style="background:#f5f5eb;border:1px solid #ddd;padding:10px 14px;border-radius:4px;margin-bottom:14px"><div style="font-size:.63em;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#777;margin-bottom:4px">Abstract</div><p style="font-size:.91em;color:#374151;line-height:1.75;font-style:italic">${he(d.summary)}</p></div>`:''}
      <div style="display:grid;grid-template-columns:1.5fr .5fr;gap:20px">
        <div>${exp.length?ST('Professional Experience',`color:#1a1a2e;border-bottom:1px solid #aaa;font-family:'Playfair Display',Georgia,serif;`)+exp.map(x=>expB(x,{sub:'#555',dt:'#777'})).join(''):''}${edu.length?ST('Education',`color:#1a1a2e;border-bottom:1px solid #aaa;font-family:'Playfair Display',Georgia,serif;`)+edu.map(x=>eduB(x,{sub:'#555',ac2:ac})).join(''):''}${pubs.length?ST('Publications',`color:#1a1a2e;border-bottom:1px solid #aaa;font-family:'Playfair Display',Georgia,serif;`)+pubs.map(x=>`<div style="margin-bottom:7px;font-size:.87em"><strong>${he(x.title)}</strong>${x.journal?` <em>— ${he(x.journal)}</em>`:''}${x.year?`. ${he(x.year)}`:''}</div>`).join(''):''}</div>
        <div>${skills.length?ST('Keywords',`color:#1a1a2e;border-bottom:1px solid #aaa;`)+skills.map(s=>`<div style="font-size:.83em;color:#374151;margin-bottom:3px;padding-left:7px;border-left:2px solid ${ac}">${he(s)}</div>`).join(''):''}${langs.length?ST('Languages',`color:#1a1a2e;border-bottom:1px solid #aaa;`)+langs.map(l=>`<div style="font-size:.83em;margin-bottom:3px"><strong>${he(l.lang)}</strong> <span style="color:#64748b">${he(l.level)}</span></div>`).join(''):''}${certs.length?ST('Certifications',`color:#1a1a2e;border-bottom:1px solid #aaa;`)+certs.map(c=>`<div style="font-size:.83em;margin-bottom:3px">${he(c.name)}</div>`).join(''):''}</div>
      </div>
    </div>`;

    if(tmpl==='european-cv') return `<div style="${DS}">
      <div style="background:${ac};padding:20px 24px;display:flex;align-items:flex-start;justify-content:space-between;gap:14px"><div style="flex:1;min-width:0"><div style="font-size:2em;font-weight:900;color:#fff;letter-spacing:-.3px;line-height:1">${nm}</div>${d.title?`<div style="font-size:1em;color:rgba(255,255,255,.85);font-weight:600;margin-top:4px">${he(d.title)}</div>`:''}</div>${photoEl(78,'rect','2px solid rgba(255,255,255,.4)')}</div>
      <div style="background:#f8fafc;padding:11px 24px;border-bottom:2px solid ${ac}22">${contactRow(ac)}</div>
      <div style="padding:14px 24px">
        ${d.summary?`<div style="display:flex;gap:10px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #e2e8f0"><div style="width:135px;font-size:.72em;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${ac};flex-shrink:0;padding-top:2px">About Me</div><p style="font-size:.91em;color:#374151;line-height:1.7;flex:1">${he(d.summary)}</p></div>`:''}
        ${exp.length?`<div style="display:flex;gap:10px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #e2e8f0"><div style="width:135px;font-size:.72em;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${ac};flex-shrink:0">Work Experience</div><div style="flex:1">${exp.map(x=>expB(x)).join('')}</div></div>`:''}
        ${edu.length?`<div style="display:flex;gap:10px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #e2e8f0"><div style="width:135px;font-size:.72em;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${ac};flex-shrink:0">Education</div><div style="flex:1">${edu.map(x=>eduB(x)).join('')}</div></div>`:''}
        ${skills.length?`<div style="display:flex;gap:10px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #e2e8f0"><div style="width:135px;font-size:.72em;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${ac};flex-shrink:0">Skills</div><div style="flex:1">${chips(skills,`${ac}15`,'transparent',ac)}</div></div>`:''}
        ${langs.length?`<div style="display:flex;gap:10px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #e2e8f0"><div style="width:135px;font-size:.72em;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${ac};flex-shrink:0">Languages</div><div style="flex:1">${langBars(ac)}</div></div>`:''}
      </div>
    </div>`;

    if(tmpl==='gulf-premium') return `<div style="${DS}">
      <div style="background:${ac}">
        <div style="display:flex;align-items:stretch"><div style="width:7px;background:rgba(255,255,255,.3)"></div><div style="flex:1;padding:22px 22px 15px"><div style="font-size:2.1em;font-weight:900;color:#fff;letter-spacing:-.3px;line-height:1">${nm}</div>${d.title?`<div style="font-size:1em;color:rgba(255,255,255,.88);font-weight:600;margin:4px 0 10px;text-transform:uppercase;letter-spacing:.5px">${he(d.title)}</div>`:''}${contactRow('rgba(255,255,255,.78)')}</div>${photoEl(86,'rect','2px solid rgba(255,255,255,.35)')}</div>
        <div style="padding:7px 22px;font-size:.73em;font-weight:700;color:rgba(255,255,255,.55);letter-spacing:.5px">${[d.nationality,d.drivingLicense,d.notice].filter(Boolean).map(x=>`<span style="margin-right:14px">${he(x)}</span>`).join('')}</div>
      </div>
      <div style="padding:18px 22px">${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;margin-bottom:14px;padding:10px 14px;background:${ac}0d;border-radius:6px;border-left:3px solid ${ac}">${he(d.summary)}</p>`:''}
        ${exp.length?ST('Professional Experience')+exp.map(x=>expB(x)).join(''):''}
        ${edu.length?ST('Education')+edu.map(x=>eduB(x)).join(''):''}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
          <div>${skills.length?ST('Core Competencies')+chips(skills,`${ac}12`,'transparent',ac):''}${certs.length?ST('Certifications')+`<ul style="padding-left:13px">${certs.map(x=>`<li style="font-size:.87em;margin:3px 0">${he(x.name)}${x.year?` (${he(x.year)})`:''}</li>`).join('')}</ul>`:''}</div>
          <div>${langs.length?ST('Languages')+langBars(ac):''}${hobs.length?ST('Interests')+`<div style="font-size:.87em;color:#475569">${hobs.map(h=>`<span style="display:inline-block;margin-right:8px">• ${he(h)}</span>`).join('')}</div>`:''}</div>
        </div>
        ${extras(ac)}
      </div>
    </div>`;

    if(tmpl==='bilingual') return `<div style="${DS}">
      <div style="display:grid;grid-template-columns:1fr 1fr">
        <div style="background:${ac};padding:20px 17px 15px;color:#fff"><div style="font-size:1.9em;font-weight:900;line-height:1">${nm}</div>${d.title?`<div style="font-size:.9em;font-weight:600;opacity:.85;margin-top:4px">${he(d.title)}</div>`:''}<div style="margin-top:8px;font-size:.8em;opacity:.8">${d.email?`<div>${ICO.email}${he(d.email)}</div>`:''}${phone?`<div>${ICO.phone}${he(phone)}</div>`:''}</div></div>
        <div style="background:${ac}dd;padding:20px 17px 15px;color:#fff;text-align:right;direction:rtl">${hasP?`<div style="margin-bottom:8px;display:flex;justify-content:flex-start">${photoEl(62,'circle','2px solid rgba(255,255,255,.4)')}</div>`:''}${d.location?`<div style="font-size:.8em;opacity:.8">${he(d.location)}${ICO.location}</div>`:''}${d.nationality?`<div style="font-size:.8em;opacity:.8">${he(d.nationality)}${ICO.flag}</div>`:''}</div>
      </div>
      <div style="height:4px;background:linear-gradient(90deg,${ac},${ac}55)"></div>
      <div style="padding:18px 22px">${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;margin-bottom:14px">${he(d.summary)}</p>`:''}${mainSec()}</div>
    </div>`;

    if(tmpl==='pearl-luxe') return `<div style="${DS};background:#fdfcf8;padding:16px">
      <div style="border:2px solid ${ac};border-radius:4px;padding:22px;min-height:${ph-32}px">
        <div style="text-align:center;border-bottom:1px solid ${ac}44;padding-bottom:14px;margin-bottom:14px">${photoEl(74,'circle',`2px solid ${ac}`)}<div style="font-size:2.1em;font-weight:900;letter-spacing:.5px;line-height:1;margin-top:10px;color:#1a1a2e">${nm}</div>${d.title?`<div style="font-size:1em;color:${ac};font-weight:700;margin-top:3px">${he(d.title)}</div>`:''}${contactRow('#555','center')}</div>
        ${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;margin-bottom:14px;font-style:italic">${he(d.summary)}</p>`:''}${mainSec()}
      </div>
    </div>`;

    if(tmpl==='two-col') return `<div style="${DS}">
      <div style="background:${ac};padding:22px 24px 17px;display:flex;justify-content:space-between;align-items:flex-start;gap:14px"><div style="flex:1;min-width:0"><div style="font-size:2.2em;font-weight:900;color:#fff;letter-spacing:-.5px;line-height:1">${nm}</div>${d.title?`<div style="font-size:1em;color:rgba(255,255,255,.85);font-weight:600;margin-top:5px">${he(d.title)}</div>`:''}${contactRow('rgba(255,255,255,.78)')}</div>${photoEl(78,'circle','2px solid rgba(255,255,255,.45)')}</div>
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:0">
        <div style="padding:17px 20px;border-right:1px solid #e2e8f0">${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;margin-bottom:14px">${he(d.summary)}</p>`:''}${exp.length?ST('Experience')+exp.map(x=>expB(x)).join(''):''}${projs.length?ST('Projects')+projs.map(x=>`<div style="margin-bottom:10px"><strong>${he(x.name)}</strong>${x.tech?` · <em style="color:${ac}">${he(x.tech)}</em>`:''}<ul style="padding-left:13px;margin-top:3px">${lines(x.bullets).map(b=>`<li style="font-size:.86em">${he(b)}</li>`).join('')}</ul></div>`).join(''):''}${extras(ac)}</div>
        <div style="padding:17px 15px">${edu.length?ST('Education')+edu.map(x=>eduB(x)).join(''):''}${skills.length?ST('Skills')+chips(skills,`${ac}12`,'transparent',ac):''}${langs.length?ST('Languages')+langBars(ac):''}${certs.length?ST('Certs')+`<ul style="padding-left:13px">${certs.map(x=>`<li style="font-size:.84em;margin:3px 0">${he(x.name)}${x.year?` (${he(x.year)})`:''}</li>`).join('')}</ul>`:''}${hobs.length?ST('Interests')+`<div style="font-size:.85em;color:#475569">${hobs.map(h=>`• ${he(h)}`).join(' ')}</div>`:''}</div>
      </div>
    </div>`;

    if(tmpl==='infographic') return `<div style="${DS}">
      <div style="background:${ac};padding:22px 24px 17px"><div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px"><div style="flex:1;min-width:0"><div style="font-size:2.2em;font-weight:900;color:#fff;letter-spacing:-.5px;line-height:1">${nm}</div>${d.title?`<div style="font-size:1em;color:rgba(255,255,255,.85);font-weight:600;margin-top:4px">${he(d.title)}</div>`:''}</div>${photoEl(78,'circle','2px solid rgba(255,255,255,.4)')}</div>${contactRow('rgba(255,255,255,.78)')}</div>
      <div style="display:grid;grid-template-columns:1fr 1.5fr;gap:0">
        <div style="background:#f8fafc;padding:15px 13px;border-right:2px solid ${ac}22">
          ${skills.length?`<div style="font-size:.64em;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:${ac};margin-bottom:8px">Core Skills</div>${skills.map((s,i)=>`<div style="margin-bottom:7px"><div style="font-size:.8em;font-weight:600;margin-bottom:2px">${he(s)}</div><div style="height:5px;background:#e2e8f0;border-radius:99px;overflow:hidden"><div style="height:100%;width:${Math.max(55,100-(i*7))}%;background:${ac};border-radius:99px"></div></div></div>`).join('')}`:''}
          ${langs.length?`<div style="font-size:.64em;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:${ac};margin:12px 0 8px">Languages</div>${langBars(ac)}`:''}
          ${hobs.length?`<div style="font-size:.64em;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:${ac};margin:12px 0 8px">Interests</div><div style="font-size:.82em;color:#475569">${hobs.map(h=>`<span style="display:inline-block;margin:0 5px 4px 0">• ${he(h)}</span>`).join('')}</div>`:''}
        </div>
        <div style="padding:15px 17px">${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;margin-bottom:14px">${he(d.summary)}</p>`:''}${exp.length?ST('Experience')+exp.map(x=>expB(x)).join(''):''}${edu.length?ST('Education')+edu.map(x=>eduB(x)).join(''):''}${certs.length?ST('Certifications')+`<ul style="padding-left:13px">${certs.map(x=>`<li style="font-size:.86em;margin:3px 0">${he(x.name)}${x.year?` (${he(x.year)})`:''}</li>`).join('')}</ul>`:''}${extras(ac)}</div>
      </div>
    </div>`;

    if(tmpl==='timeline-cv') return `<div style="${DS};padding:26px 24px">
      <div style="text-align:center;margin-bottom:14px;padding-bottom:13px;border-bottom:3px solid ${ac}">${photoEl(70,'circle',`3px solid ${ac}`)}<div style="font-size:2.1em;font-weight:900;letter-spacing:-.5px;line-height:1;margin-top:9px">${nm}</div>${d.title?`<div style="font-size:1em;color:${ac};font-weight:700;margin-top:4px">${he(d.title)}</div>`:''}${contactRow('#475569','center')}</div>
      ${d.summary?`<p style="font-size:.91em;color:#374151;line-height:1.75;text-align:center;margin-bottom:14px">${he(d.summary)}</p>`:''}
      <div style="display:grid;grid-template-columns:1fr 24px 1fr;gap:0">
        <div style="padding-right:13px;text-align:right">${exp.length?`<div style="font-size:.72em;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:${ac};margin-bottom:8px">Experience</div>${exp.map(x=>`<div style="margin-bottom:12px"><div style="font-weight:800;font-size:.93em">${he(x.role)}</div><div style="font-size:.83em;color:#475569">${he(x.company||'')}</div><div style="font-size:.78em;color:#64748b">${he([x.start,x.current?'Present':x.end].filter(Boolean).join('–'))}</div>${lines(x.bullets).length?`<ul style="padding:0;margin:4px 0 0;list-style:none">${lines(x.bullets).map(b=>`<li style="font-size:.84em;color:#374151">${he(b)}</li>`).join('')}</ul>`:''}</div>`).join('')}`:''}</div>
        <div style="display:flex;flex-direction:column;align-items:center"><div style="width:2px;flex:1;background:linear-gradient(to bottom,${ac},${ac}33)"></div></div>
        <div style="padding-left:13px">${edu.length?`<div style="font-size:.72em;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:${ac};margin-bottom:8px">Education</div>${edu.map(x=>`<div style="margin-bottom:12px"><div style="font-weight:800;font-size:.93em">${he(x.degree)}</div><div style="font-size:.83em;color:#475569">${he(x.school||'')}</div></div>`).join('')}`:''} ${skills.length?`<div style="font-size:.72em;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:${ac};margin:13px 0 7px">Skills</div>${chips(skills,`${ac}15`,'transparent',ac)}`:''}${langs.length?`<div style="font-size:.72em;font-weight:900;text-transform:uppercase;letter-spacing:1.2px;color:${ac};margin:13px 0 7px">Languages</div>${langs.map(l=>`<div style="font-size:.83em;margin-bottom:3px"><strong>${he(l.lang)}</strong> <span style="color:${ac}">${he(l.level)}</span></div>`).join('')}`:''}</div>
      </div>
      ${extras(ac)}
    </div>`;

    return `<div style="${DS};padding:26px"><div style="font-size:2em;font-weight:900">${nm}</div><div style="color:${ac};margin-top:4px">${he(d.title)}</div></div>`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, tmpl, accent, fontId, fontSize, paper]);

  /* ================================================================
     RENDER
  ================================================================ */
  return (
    <>
      {/* Print is handled by JS injecting directly onto <body> */}

      <div className="cv-bg" aria-hidden="true" />

      <Toasts toasts={toasts} onDismiss={dismissToast} />

      {showPrintModal && (
        <PrintModal
          defaultName={(data.fullName||'My CV').replace(/\s+/g,'_')+'_CV'}
          onConfirm={executePrint}
          onCancel={()=>setShowPrintModal(false)}
        />
      )}

      <div className="cvapp">
        <div className="cv-wrap">

          {/* ── HERO ── */}
          <header className="cv-hero">
            <div className="cv-hero-l">
              <span className="cv-badge">🧑‍💼 Career Tools</span>
              <h1>Professional <span className="cv-grad">CV Maker</span></h1>
              <p className="cv-hero-sub">AI-powered · 25 templates · ATS checker · logo search · perfect PDF. 100% free.</p>
              <div className="cv-pills">
                {['25 Templates','AI Writing','ATS Score','Logo Search','Icons in Print','Custom Filename'].map(p=>(
                  <span key={p} className="cv-pill">✓ {p}</span>
                ))}
              </div>
            </div>
            <div className="cv-ats-wrap">
              <div className="cv-ats-ring"
                style={{background:`conic-gradient(${atsColor} ${atsScore}%,#e2e8f0 ${atsScore}%)`}}
                role="meter" aria-valuenow={atsScore} aria-valuemin={0} aria-valuemax={100}>
                <div className="cv-ats-inner">
                  <span className="cv-ats-score">{atsScore}</span>
                  <span className="cv-ats-lbl">ATS Score</span>
                </div>
              </div>
              <button className="cv-ats-btn" onClick={()=>setAtsOpen(o=>!o)}>
                {atsOpen?'Hide ↑':'Checks ↓'}
              </button>
            </div>
          </header>

          <div className={`cv-ats-panel${atsOpen?' open':''}`}>
            {atsChecks.map((c,i)=>(
              <div key={i} className={`cv-ck ${c.ok?'ok':'fail'}`}>
                <b>{c.ok?'✓':'✗'}</b><span>{c.msg}</span>
              </div>
            ))}
          </div>

          {/* ── TOOLBAR ── */}
          <nav className="cv-toolbar">
            <div className="cv-mob-tabs">
              <button className={`cv-mob-tab${mobView==='form'?' on':''}`} onClick={()=>setMobView('form')}>✍️ Edit</button>
              <button className={`cv-mob-tab${mobView==='prev'?' on':''}`} onClick={()=>setMobView('prev')}>👁 Preview</button>
            </div>
            <div className="cv-tbr">
              <label className="cv-btn cv-btn-ghost cv-btn-sm cv-file-btn">
                📂 Load<input type="file" accept=".json" onChange={importJSON}/>
              </label>
              <button className="cv-btn cv-btn-ghost cv-btn-sm" onClick={exportJSON}>💾 Save</button>
              <button className="cv-btn cv-btn-primary" onClick={doPrint}>🖨️ Print PDF</button>
            </div>
          </nav>

          {/* ── MAIN GRID ── */}
          <div className="cv-grid">

            {/* ══ FORM COLUMN ══ */}
            <section className="cv-col-form" id="col-form"
              style={mobView==='prev'&&window.innerWidth<960?{display:'none'}:{}}>

              <nav className="cv-ftabs" role="tablist" aria-label="CV sections">
                {[['personal','👤','Personal'],['experience','💼','Work'],['education','🎓','Education'],['skills','🛠','Skills'],['extras','⭐','Extras']].map(([tab,ico,lbl])=>(
                  <button key={tab} className={`cv-ftab${activeTab===tab?' on':''}`}
                    role="tab" aria-selected={activeTab===tab}
                    onClick={()=>setActiveTab(tab)}>
                    <span className="ico">{ico}</span><span>{lbl}</span>
                  </button>
                ))}
              </nav>

              {/* ─── PERSONAL ─── */}
              <div className={`cv-tpanel${activeTab==='personal'?' on':''}`}>
                <div className="cv-card">
                  <h2 className="cv-card-t" style={{marginBottom:12}}>👤 Personal Details</h2>
                  <div className="cv-g2">
                    <div className="cv-field">
                      <label className="cv-lbl">Full Name *</label>
                      <input className="cv-inp" value={data.fullName||''} placeholder="John Smith"
                        autoComplete="name" onChange={e=>sf('fullName',e.target.value)}/>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">Job Title</label>
                      <input className="cv-inp" value={data.title||''} placeholder="Senior Engineer"
                        onChange={e=>sf('title',e.target.value)}/>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">Email *</label>
                      <input className="cv-inp" type="email" value={data.email||''} placeholder="you@email.com"
                        autoComplete="email" onChange={e=>sf('email',e.target.value)}/>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">Phone Number</label>
                      <div className="cv-phone-row">
                        <select className="cv-inp" value={data.phoneCode||'+971'} onChange={e=>sf('phoneCode',e.target.value)}>
                          {PHONE_CODES.map(p=><option key={p.c} value={p.c}>{p.l} {p.c}</option>)}
                        </select>
                        <input className="cv-inp" type="tel" value={data.phoneNum||''} placeholder="50 123 4567"
                          onChange={e=>sf('phoneNum',e.target.value)}/>
                      </div>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">Location</label>
                      <input className="cv-inp" value={data.location||''} placeholder="Dubai, UAE"
                        onChange={e=>sf('location',e.target.value)}/>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">LinkedIn URL</label>
                      <input className="cv-inp" value={data.linkedin||''} placeholder="linkedin.com/in/you"
                        onChange={e=>sf('linkedin',e.target.value)}/>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">GitHub</label>
                      <input className="cv-inp" value={data.github||''} placeholder="github.com/user"
                        onChange={e=>sf('github',e.target.value)}/>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">Website / Portfolio</label>
                      <input className="cv-inp" value={data.website||''} placeholder="yoursite.com"
                        onChange={e=>sf('website',e.target.value)}/>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">Nationality</label>
                      <select className="cv-inp" value={data.nationality||''} onChange={e=>sf('nationality',e.target.value)}>
                        <option value="">— Select nationality —</option>
                        {NATIONALITIES.map(n=><option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">Date of Birth</label>
                      <input className="cv-inp" type="date" value={data.dob||''} onChange={e=>sf('dob',e.target.value)}/>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">Driving License</label>
                      <select className="cv-inp" value={data.drivingLicense||''} onChange={e=>sf('drivingLicense',e.target.value)}>
                        {DRIVING_LIC.map(o=><option key={o} value={o}>{o||'— None —'}</option>)}
                      </select>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">Notice Period</label>
                      <select className="cv-inp" value={data.notice||''} onChange={e=>sf('notice',e.target.value)}>
                        {NOTICE_PERIODS.map(o=><option key={o} value={o}>{o||'— Not specified —'}</option>)}
                      </select>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">Marital Status</label>
                      <select className="cv-inp" value={data.marital||''} onChange={e=>sf('marital',e.target.value)}>
                        {MARITAL_STATUS.map(o=><option key={o} value={o}>{o||'— Prefer not to say —'}</option>)}
                      </select>
                    </div>
                    <div className="cv-field">
                      <label className="cv-lbl">Gender</label>
                      <select className="cv-inp" value={data.gender||''} onChange={e=>sf('gender',e.target.value)}>
                        {GENDERS.map(o=><option key={o} value={o}>{o||'— Prefer not to say —'}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Photo */}
                  <div className="cv-photo-row">
                    <div className="cv-photo-thumb">
                      {data.photoDataUrl?<img src={data.photoDataUrl} alt="Profile"/>:'👤'}
                    </div>
                    <div className="cv-photo-btns">
                      <label className="cv-btn cv-btn-ghost cv-btn-sm cv-file-btn">
                        📷 Upload Photo<input type="file" accept="image/*" onChange={uploadPhoto}/>
                      </label>
                      {data.photoDataUrl&&(
                        <button className="cv-btn cv-btn-danger" onClick={()=>sf('photoDataUrl','')}>✕ Remove</button>
                      )}
                      <span style={{fontSize:'.64rem',color:'var(--slate)'}}>Max 5MB · JPG/PNG</span>
                    </div>
                  </div>
                </div>

                <div className="cv-card">
                  <div className="cv-card-h">
                    <h2 className="cv-card-t">📝 Professional Summary</h2>
                    <button className="cv-ai-btn" disabled={!!aiLoading.summary} onClick={aiSummary}>
                      {aiLoading.summary?<><span className="cv-spinner"/> Writing…</>:'✨ AI Write'}
                    </button>
                  </div>
                  <textarea className="cv-inp" rows={4}
                    placeholder="Results-driven engineer with 8+ years delivering complex projects on time and under budget…"
                    value={data.summary||''} onChange={e=>sf('summary',e.target.value)}/>
                </div>
              </div>

              {/* ─── EXPERIENCE ─── */}
              <div className={`cv-tpanel${activeTab==='experience'?' on':''}`}>
                <div className="cv-card">
                  <div className="cv-card-h">
                    <h2 className="cv-card-t">💼 Work Experience</h2>
                    <button className="cv-btn-add" onClick={()=>addItem('experience',{role:'',company:'',companyLogo:'',empType:'Full-time',industry:'',city:'',start:'',end:'',current:false,bullets:''})}>+ Add</button>
                  </div>
                  {!(data.experience||[]).length&&<div className="cv-empty">💼 No experience added. Click + Add to start.</div>}
                  {(data.experience||[]).map(item=>(
                    <ExpItem key={item.id} item={item}
                      onUpdate={upd=>updateItem('experience',upd)}
                      onRemove={()=>removeItem('experience',item.id)}/>
                  ))}
                </div>
              </div>

              {/* ─── EDUCATION ─── */}
              <div className={`cv-tpanel${activeTab==='education'?' on':''}`}>
                <div className="cv-card">
                  <div className="cv-card-h"><h2 className="cv-card-t">🎓 Education</h2><button className="cv-btn-add" onClick={()=>addItem('education',{degree:'',degType:"Bachelor's Degree",school:'',schoolLogo:'',city:'',start:'',end:'',gpa:'',notes:''})}>+ Add</button></div>
                  {!(data.education||[]).length&&<div className="cv-empty">🎓 No education added yet.</div>}
                  {(data.education||[]).map(item=><EduItem key={item.id} item={item} onUpdate={u=>updateItem('education',u)} onRemove={()=>removeItem('education',item.id)}/>)}
                </div>
                <div className="cv-card">
                  <div className="cv-card-h"><h2 className="cv-card-t">🛠 Projects</h2><button className="cv-btn-add" onClick={()=>addItem('projects',{name:'',tech:'',url:'',status:'Completed',bullets:''})}>+ Add</button></div>
                  {!(data.projects||[]).length&&<div className="cv-empty">🛠 No projects yet.</div>}
                  {(data.projects||[]).map(item=>(
                    <SItem key={item.id} item={item} onUpdate={u=>updateItem('projects',u)} onRemove={()=>removeItem('projects',item.id)}>
                      {(L,upd,rm)=>(
                        <div className="cv-shell">
                          <div className="cv-shell-h"><span className="cv-shell-t">{L.name||'New Project'}</span><button className="cv-btn-rm" onClick={rm}>✕</button></div>
                          <div className="cv-g2">
                            <div className="cv-field"><label className="cv-lbl">Name *</label><input className="cv-inp" value={L.name} placeholder="Smart Dashboard" onChange={e=>upd('name',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Status</label><select className="cv-inp" value={L.status} onChange={e=>upd('status',e.target.value)}>{PROJ_STATUS.map(s=><option key={s}>{s}</option>)}</select></div>
                            <div className="cv-field"><label className="cv-lbl">Tech / Year</label><input className="cv-inp" value={L.tech} placeholder="React, Python · 2024" onChange={e=>upd('tech',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">URL</label><input className="cv-inp" value={L.url} placeholder="github.com/…" onChange={e=>upd('url',e.target.value)}/></div>
                          </div>
                          <div className="cv-field" style={{marginTop:8}}><label className="cv-lbl">Description</label><textarea className="cv-inp" rows={2} value={L.bullets} onChange={e=>upd('bullets',e.target.value)}/></div>
                        </div>
                      )}
                    </SItem>
                  ))}
                </div>
                <div className="cv-card">
                  <div className="cv-card-h"><h2 className="cv-card-t">✅ Certifications</h2><button className="cv-btn-add" onClick={()=>addItem('certifications',{name:'',issuer:'',year:'',credId:'',expiry:''})}>+ Add</button></div>
                  {!(data.certifications||[]).length&&<div className="cv-empty">✅ No certifications yet.</div>}
                  {(data.certifications||[]).map(item=>(
                    <SItem key={item.id} item={item} onUpdate={u=>updateItem('certifications',u)} onRemove={()=>removeItem('certifications',item.id)}>
                      {(L,upd,rm)=>(
                        <div className="cv-shell">
                          <div className="cv-shell-h"><span className="cv-shell-t">{L.name||'New Cert'}</span><button className="cv-btn-rm" onClick={rm}>✕</button></div>
                          <div className="cv-g2">
                            <div className="cv-field"><label className="cv-lbl">Name *</label><input className="cv-inp" value={L.name} placeholder="AWS Solutions Architect" onChange={e=>upd('name',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Issuer</label><input className="cv-inp" value={L.issuer} placeholder="Amazon Web Services" onChange={e=>upd('issuer',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Year</label><input className="cv-inp" value={L.year} placeholder="2024" onChange={e=>upd('year',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Expiry</label><input className="cv-inp" value={L.expiry} placeholder="2027 / No Expiry" onChange={e=>upd('expiry',e.target.value)}/></div>
                            <div className="cv-field cv-span2"><label className="cv-lbl">Credential ID</label><input className="cv-inp" value={L.credId} placeholder="ABC-12345" onChange={e=>upd('credId',e.target.value)}/></div>
                          </div>
                        </div>
                      )}
                    </SItem>
                  ))}
                </div>
              </div>

              {/* ─── SKILLS ─── */}
              <div className={`cv-tpanel${activeTab==='skills'?' on':''}`}>
                <div className="cv-card">
                  <div className="cv-card-h">
                    <h2 className="cv-card-t">🛠 Skills</h2>
                    <button className="cv-ai-btn" disabled={!!aiLoading.skills} onClick={aiSkills}>
                      {aiLoading.skills?<><span className="cv-spinner"/>…</>:'✨ AI Suggest'}
                    </button>
                  </div>
                  <p style={{fontSize:'.7rem',color:'var(--slate)',marginBottom:6}}>One skill per line — ATS reads each keyword individually</p>
                  <textarea className="cv-inp" rows={9}
                    placeholder={"AutoCAD\nProject Management\nPython\nMS Excel\nLeadership\nHVAC Design"}
                    value={data.skills||''} onChange={e=>sf('skills',e.target.value)}/>
                  <div className="cv-chips">
                    {lines(data.skills).map((s,i)=><span key={i} className="cv-chip">{s}</span>)}
                  </div>
                </div>
                <div className="cv-card">
                  <h2 className="cv-card-t" style={{marginBottom:10}}>🌐 Languages</h2>
                  {!(data.languages||[]).length&&<div className="cv-empty">🌐 No languages added.</div>}
                  {(data.languages||[]).map(item=>(
                    <SItem key={item.id} item={item} onUpdate={u=>updateItem('languages',u)} onRemove={()=>removeItem('languages',item.id)}>
                      {(L,upd,rm)=>(
                        <div className="cv-shell" style={{padding:'10px 11px',marginTop:6}}>
                          <div style={{display:'flex',gap:7,alignItems:'center'}}>
                            <input className="cv-inp" value={L.lang} placeholder="e.g. Arabic" style={{flex:1}} onChange={e=>upd('lang',e.target.value)}/>
                            <select className="cv-inp" value={L.level} style={{flex:1}} onChange={e=>upd('level',e.target.value)}>
                              {LANG_LEVELS.map(l=><option key={l}>{l}</option>)}
                            </select>
                            <button className="cv-btn-rm" onClick={rm}>✕</button>
                          </div>
                        </div>
                      )}
                    </SItem>
                  ))}
                  <button className="cv-btn-add" style={{marginTop:9}} onClick={()=>addItem('languages',{lang:'',level:'Professional'})}>+ Add Language</button>
                </div>
                <div className="cv-card">
                  <h2 className="cv-card-t" style={{marginBottom:8}}>🎯 Hobbies &amp; Interests</h2>
                  <p style={{fontSize:'.7rem',color:'var(--slate)',marginBottom:6}}>One per line or comma-separated</p>
                  <textarea className="cv-inp" rows={3}
                    placeholder="Photography · Cricket · Reading · Travel"
                    value={data.hobbies||''} onChange={e=>sf('hobbies',e.target.value)}/>
                </div>
              </div>

              {/* ─── EXTRAS ─── */}
              <div className={`cv-tpanel${activeTab==='extras'?' on':''}`}>
                {/* Awards */}
                <div className="cv-card">
                  <div className="cv-card-h"><h2 className="cv-card-t">🏆 Awards</h2><button className="cv-btn-add" onClick={()=>addItem('awards',{title:'',issuer:'',year:'',desc:''})}>+ Add</button></div>
                  {!(data.awards||[]).length&&<div className="cv-empty">🏆 No awards yet.</div>}
                  {(data.awards||[]).map(item=>(
                    <SItem key={item.id} item={item} onUpdate={u=>updateItem('awards',u)} onRemove={()=>removeItem('awards',item.id)}>
                      {(L,upd,rm)=>(
                        <div className="cv-shell">
                          <div className="cv-shell-h"><span className="cv-shell-t">{L.title||'New Award'}</span><button className="cv-btn-rm" onClick={rm}>✕</button></div>
                          <div className="cv-g2">
                            <div className="cv-field"><label className="cv-lbl">Title *</label><input className="cv-inp" value={L.title} placeholder="Employee of the Year" onChange={e=>upd('title',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Issuer</label><input className="cv-inp" value={L.issuer} placeholder="Organization" onChange={e=>upd('issuer',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Year</label><input className="cv-inp" value={L.year} placeholder="2024" onChange={e=>upd('year',e.target.value)}/></div>
                          </div>
                          <div className="cv-field" style={{marginTop:8}}><label className="cv-lbl">Description</label><textarea className="cv-inp" rows={2} value={L.desc} onChange={e=>upd('desc',e.target.value)}/></div>
                        </div>
                      )}
                    </SItem>
                  ))}
                </div>
                {/* Publications */}
                <div className="cv-card">
                  <div className="cv-card-h"><h2 className="cv-card-t">📚 Publications</h2><button className="cv-btn-add" onClick={()=>addItem('publications',{title:'',journal:'',year:'',url:'',pubType:'Journal Article'})}>+ Add</button></div>
                  {!(data.publications||[]).length&&<div className="cv-empty">📚 No publications yet.</div>}
                  {(data.publications||[]).map(item=>(
                    <SItem key={item.id} item={item} onUpdate={u=>updateItem('publications',u)} onRemove={()=>removeItem('publications',item.id)}>
                      {(L,upd,rm)=>(
                        <div className="cv-shell">
                          <div className="cv-shell-h"><span className="cv-shell-t">{L.title||'New Publication'}</span><button className="cv-btn-rm" onClick={rm}>✕</button></div>
                          <div className="cv-g2">
                            <div className="cv-field"><label className="cv-lbl">Type</label><select className="cv-inp" value={L.pubType} onChange={e=>upd('pubType',e.target.value)}>{PUB_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                            <div className="cv-field"><label className="cv-lbl">Title *</label><input className="cv-inp" value={L.title} placeholder="Paper title" onChange={e=>upd('title',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Journal</label><input className="cv-inp" value={L.journal} placeholder="IEEE Journal" onChange={e=>upd('journal',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Year</label><input className="cv-inp" value={L.year} placeholder="2024" onChange={e=>upd('year',e.target.value)}/></div>
                            <div className="cv-field cv-span2"><label className="cv-lbl">URL / DOI</label><input className="cv-inp" value={L.url} placeholder="doi.org/…" onChange={e=>upd('url',e.target.value)}/></div>
                          </div>
                        </div>
                      )}
                    </SItem>
                  ))}
                </div>
                {/* Volunteer */}
                <div className="cv-card">
                  <div className="cv-card-h"><h2 className="cv-card-t">🤝 Volunteer</h2><button className="cv-btn-add" onClick={()=>addItem('volunteer',{role:'',org:'',cause:'',start:'',end:'',desc:''})}>+ Add</button></div>
                  {!(data.volunteer||[]).length&&<div className="cv-empty">🤝 No volunteer work yet.</div>}
                  {(data.volunteer||[]).map(item=>(
                    <SItem key={item.id} item={item} onUpdate={u=>updateItem('volunteer',u)} onRemove={()=>removeItem('volunteer',item.id)}>
                      {(L,upd,rm)=>(
                        <div className="cv-shell">
                          <div className="cv-shell-h"><span className="cv-shell-t">{L.role||'New Volunteer'}</span><button className="cv-btn-rm" onClick={rm}>✕</button></div>
                          <div className="cv-g2">
                            <div className="cv-field"><label className="cv-lbl">Role *</label><input className="cv-inp" value={L.role} placeholder="Community Mentor" onChange={e=>upd('role',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Organization</label><input className="cv-inp" value={L.org} placeholder="Red Crescent" onChange={e=>upd('org',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Cause</label><select className="cv-inp" value={L.cause||''} onChange={e=>upd('cause',e.target.value)}>{VOL_CAUSES.map(c=><option key={c} value={c}>{c||'— Select cause —'}</option>)}</select></div>
                            <div className="cv-field"><label className="cv-lbl">Start</label><input className="cv-inp" value={L.start} placeholder="Jan 2023" onChange={e=>upd('start',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">End</label><input className="cv-inp" value={L.end} placeholder="Present" onChange={e=>upd('end',e.target.value)}/></div>
                          </div>
                          <div className="cv-field" style={{marginTop:8}}><label className="cv-lbl">Description</label><textarea className="cv-inp" rows={2} value={L.desc} onChange={e=>upd('desc',e.target.value)}/></div>
                        </div>
                      )}
                    </SItem>
                  ))}
                </div>
                {/* References */}
                <div className="cv-card">
                  <div className="cv-card-h"><h2 className="cv-card-t">📋 References</h2><button className="cv-btn-add" onClick={()=>addItem('references',{name:'',refTitle:'',company:'',email:'',phone:'',relationship:'Manager'})}>+ Add</button></div>
                  {!(data.references||[]).length&&<div className="cv-empty">📋 No references added.</div>}
                  {(data.references||[]).map(item=>(
                    <SItem key={item.id} item={item} onUpdate={u=>updateItem('references',u)} onRemove={()=>removeItem('references',item.id)}>
                      {(L,upd,rm)=>(
                        <div className="cv-shell">
                          <div className="cv-shell-h"><span className="cv-shell-t">{L.name||'New Reference'}</span><button className="cv-btn-rm" onClick={rm}>✕</button></div>
                          <div className="cv-g2">
                            <div className="cv-field"><label className="cv-lbl">Name *</label><input className="cv-inp" value={L.name} placeholder="Dr. Sarah Johnson" onChange={e=>upd('name',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Relationship</label><select className="cv-inp" value={L.relationship} onChange={e=>upd('relationship',e.target.value)}>{REL_TYPES.map(r=><option key={r}>{r}</option>)}</select></div>
                            <div className="cv-field"><label className="cv-lbl">Job Title</label><input className="cv-inp" value={L.refTitle} placeholder="Head of Engineering" onChange={e=>upd('refTitle',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Company</label><input className="cv-inp" value={L.company} placeholder="Tech Corp" onChange={e=>upd('company',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Email</label><input className="cv-inp" value={L.email} placeholder="s@company.com" onChange={e=>upd('email',e.target.value)}/></div>
                            <div className="cv-field"><label className="cv-lbl">Phone</label><input className="cv-inp" value={L.phone} placeholder="+971…" onChange={e=>upd('phone',e.target.value)}/></div>
                          </div>
                        </div>
                      )}
                    </SItem>
                  ))}
                </div>
                <button className="cv-btn cv-btn-danger cv-btn-sm" style={{marginTop:8,width:'100%',justifyContent:'center',borderRadius:'var(--r)'}} onClick={resetAll}>
                  🗑️ Reset All Data
                </button>
              </div>

            </section>

            {/* ══ PREVIEW COLUMN ══ */}
            <section className="cv-col-prev" id="col-prev"
              style={mobView==='form'&&window.innerWidth<960?{display:'none'}:{}}>

              {/* Template */}
              <div className="cv-tmpl-panel">
                <div className="cv-panel-h"><span className="cv-panel-t">🎨 Template</span><span className="cv-cur-lbl">{(TEMPLATES.find(t=>t.id===tmpl)||{l:tmpl}).l}</span></div>
                <div className="cv-cat-row">
                  {CATS.map(c=><button key={c} className={`cv-cat-btn${activeCat===c?' on':''}`} onClick={()=>setActiveCat(c)}>{c}</button>)}
                </div>
                <div className="cv-tmpl-grid">
                  {(activeCat==='All'?TEMPLATES:TEMPLATES.filter(t=>t.cat===activeCat)).map(t=>(
                    <button key={t.id} className={`cv-tmpl-card${tmpl===t.id?' on':''}`}
                      onClick={()=>setTmpl(t.id)} title={t.l}>
                      <span dangerouslySetInnerHTML={{__html:buildThumb(t)}}/>
                      <span className="cv-tmpl-lbl">{t.l}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="cv-ctrls">
                <div className="cv-ctrl-row">
                  <span className="cv-ctrl-lbl">Accent</span>
                  <div className="cv-dots">
                    {ACCENTS.map(c=>(
                      <button key={c} className={`cv-dot${accent===c?' on':''}`}
                        style={{background:c}} onClick={()=>setAccent(c)} title={c}/>
                    ))}
                    <div style={{position:'relative'}}>
                      <button className="cv-dot" style={{background:'conic-gradient(red,yellow,lime,cyan,blue,magenta,red)',fontSize:'.6rem'}}
                        onClick={()=>document.getElementById('cv-cpick').click()} title="Custom">🎨</button>
                      <input type="color" id="cv-cpick" value={accent} onChange={e=>setAccent(e.target.value)}
                        style={{position:'absolute',opacity:0,width:0,height:0}} tabIndex={-1}/>
                    </div>
                  </div>
                </div>
                <div className="cv-ctrl-row">
                  <span className="cv-ctrl-lbl">Font</span>
                  <div className="cv-tog-g">
                    {FONTS.map(f=><button key={f.id} className={`cv-tog${fontId===f.id?' on':''}`} onClick={()=>setFontId(f.id)}>{f.l}</button>)}
                  </div>
                </div>
                <div className="cv-ctrl-row">
                  <span className="cv-ctrl-lbl">Size</span>
                  <div className="cv-tog-g">
                    {Object.keys(FSIZES).map(s=><button key={s} className={`cv-tog${fontSize===s?' on':''}`} onClick={()=>setFontSize(s)}>{s[0].toUpperCase()+s.slice(1)}</button>)}
                  </div>
                  <span className="cv-ctrl-lbl" style={{marginLeft:6}}>Paper</span>
                  <div className="cv-tog-g">
                    {Object.entries(PAPERS).map(([k,v])=><button key={k} className={`cv-tog${paper===k?' on':''}`} onClick={()=>setPaper(k)}>{v.l}</button>)}
                  </div>
                </div>
              </div>

              {/* Preview header + zoom */}
              <div className="cv-prev-h">
                <span>Live Preview</span>
                <div style={{display:'flex',gap:5,alignItems:'center'}}>
                  <button className="cv-tog" onClick={()=>setZoom(z=>Math.max(.25,+(z-.1).toFixed(2)))}>−</button>
                  <span style={{fontSize:'.68rem',fontWeight:700,minWidth:34,textAlign:'center'}}>{Math.round(zoom*100)}%</span>
                  <button className="cv-tog" onClick={()=>setZoom(z=>Math.min(1.4,+(z+.1).toFixed(2)))}>+</button>
                  <button className="cv-tog" onClick={fitZoom}>Fit</button>
                </div>
              </div>

              <div className="cv-prev-scroll" ref={prevScrollRef}>
                <div className="cv-prev-scale">
                  <div id="cv-paper" ref={paperRef} dangerouslySetInnerHTML={{__html:cvHtml}}/>
                </div>
              </div>

              <div className="cv-prev-foot">
                <button className="cv-btn cv-btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={doPrint}>
                  🖨️ Print / Save as PDF
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ── FIXED FOOTER ── */}
      <footer className="cv-footer">
        <div className="cv-footer-info">
          <span className="cv-footer-name">{data.fullName||'Your Name'}</span>
          <span className="cv-footer-meta">{(TEMPLATES.find(t=>t.id===tmpl)||{l:tmpl}).l} · ATS {atsScore}/100</span>
        </div>
        <div className="cv-footer-btns">
          <label className="cv-btn cv-btn-ghost cv-btn-sm cv-file-btn" style={{minHeight:36}}>
            📂<input type="file" accept=".json" onChange={importJSON}/>
          </label>
          <button className="cv-btn cv-btn-ghost cv-btn-sm" style={{minHeight:36}} onClick={exportJSON}>💾</button>
          <button className="cv-btn cv-btn-primary" onClick={doPrint}>🖨️ Print PDF</button>
        </div>
      </footer>
    </>
  );
}