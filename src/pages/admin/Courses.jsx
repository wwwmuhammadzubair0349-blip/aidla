// AdminCourses.jsx — Professional Admin Panel
// Mobile-first · Universal screens · Zero functionality changes
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  blue:      '#0056D2',
  blueDark:  '#003A8C',
  blueLight: '#EBF2FF',
  blueMid:   '#C7DCFF',
  ink:       '#1A1A2E',
  slate:     '#475569',
  muted:     '#94A3B8',
  border:    '#E2E8F4',
  bg:        '#F4F7FB',
  white:     '#FFFFFF',
  success:   '#12B76A',
  successBg: '#ECFDF3',
  amber:     '#F5A623',
  red:       '#E8453C',
  redLight:  '#FEF2F2',
  purple:    '#7C3AED',
  card:      '#FFFFFF',
};

const typeColors = {
  video:      { bg: '#FEF2F2', text: '#B91C1C', dot: '#E8453C' },
  article:    { bg: '#EEF2FF', text: '#3730A3', dot: '#6366F1' },
  quiz:       { bg: '#FFFBEB', text: '#92400E', dot: '#F5A623' },
  assignment: { bg: '#F0FDF4', text: '#065F46', dot: '#12B76A' },
};

// ─── Global CSS ───────────────────────────────────────────────────────────────
const ADMIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300;1,9..144,400&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', system-ui, sans-serif; background: ${C.bg}; color: ${C.ink}; -webkit-font-smoothing: antialiased; }
  button { font-family: 'DM Sans', sans-serif; cursor: pointer; }
  input, select, textarea { font-family: 'DM Sans', sans-serif; }

  @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp   { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes spin      { to { transform:rotate(360deg); } }
  @keyframes shimmer   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes pop       { 0%{transform:scale(0.95);opacity:0} 60%{transform:scale(1.02)} 100%{transform:scale(1);opacity:1} }
  @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }

  .fade-in   { animation: fadeIn   .25s ease both; }
  .slide-up  { animation: slideUp  .3s ease both; }
  .slide-down{ animation: slideDown .3s ease both; }
  .pop-in    { animation: pop .35s cubic-bezier(.34,1.56,.64,1) both; }

  /* Focus ring */
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: ${C.blue} !important;
    box-shadow: 0 0 0 3px rgba(0,86,210,.12) !important;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }

  /* Nav tabs */
  .nav-tab {
    padding: 8px 14px; border: none; border-radius: 8px;
    font-weight: 600; font-size: 12.5px; cursor: pointer;
    transition: all .18s; white-space: nowrap;
    display: inline-flex; align-items: center; gap: 5px;
  }
  .nav-tab.active {
    background: ${C.blue}; color: white;
    box-shadow: 0 2px 10px rgba(0,86,210,.3);
  }
  .nav-tab:not(.active) { background: transparent; color: ${C.slate}; }
  .nav-tab:not(.active):hover { background: ${C.blueLight}; color: ${C.blue}; }

  /* Course list item */
  .course-item {
    padding: 13px 14px; border-radius: 10px; cursor: pointer;
    transition: all .15s; border: 1.5px solid transparent;
    margin-bottom: 4px;
  }
  .course-item:hover { background: ${C.bg}; border-color: ${C.border}; }
  .course-item.active {
    background: ${C.blueLight}; border-color: ${C.blueMid};
  }

  /* Lesson row */
  .lesson-row {
    display: flex; align-items: center; justify-content: space-between;
    background: ${C.white}; padding: 10px 14px; border-radius: 9px;
    border: 1.5px solid ${C.border}; margin-top: 7px;
    transition: all .15s; gap: 8px;
  }
  .lesson-row:hover { border-color: #C7DCFF; box-shadow: 0 2px 8px rgba(0,86,210,.07); }

  /* Shimmer skeleton */
  .skeleton {
    background: linear-gradient(90deg, ${C.border} 25%, #f0f4f8 50%, ${C.border} 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
    border-radius: 8px;
  }

  /* Table */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th {
    padding: 10px 16px; text-align: left; font-weight: 600;
    font-size: 10.5px; text-transform: uppercase; letter-spacing: .8px;
    color: ${C.muted}; border-bottom: 1.5px solid ${C.border}; background: ${C.bg};
    white-space: nowrap;
  }
  td { padding: 12px 16px; border-bottom: 1px solid ${C.border}; color: ${C.slate}; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #FAFBFE; }

  /* Responsive helpers */
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .stack-mobile { flex-direction: column !important; align-items: stretch !important; }
    .full-mobile  { width: 100% !important; }
  }
  @media (max-width: 480px) {
    .hide-sm { display: none !important; }
  }
`;

// ─── Error Box ────────────────────────────────────────────────────────────────
function ErrorBox({ error, onDismiss }) {
  if (!error) return null;
  return (
    <div className="slide-down" style={{
      background: C.redLight, border: `1.5px solid #FECACA`,
      borderRadius: 12, padding: '14px 16px', marginBottom: 18,
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-start', gap: 12,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
        <div>
          <div style={{ fontWeight: 700, color: C.red, fontSize: 12.5, marginBottom: 4 }}>
            Something went wrong
          </div>
          <div style={{ fontSize: 11.5, color: '#7F1D1D', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.6 }}>
            {error}
          </div>
        </div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} style={{
          background: '#FECACA', border: 'none', color: C.red,
          width: 24, height: 24, borderRadius: 6, fontSize: 14,
          cursor: 'pointer', flexShrink: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontWeight: 700,
        }}>×</button>
      )}
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
const Btn = ({ children, variant = 'primary', onClick, disabled, style = {}, size = 'md', type = 'button' }) => {
  const sizes = {
    xs:  { padding: '4px 10px',  fontSize: 11, borderRadius: 6 },
    sm:  { padding: '6px 13px',  fontSize: 12, borderRadius: 7 },
    md:  { padding: '9px 18px',  fontSize: 13, borderRadius: 8 },
    lg:  { padding: '12px 24px', fontSize: 14, borderRadius: 9 },
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: { background: C.blue,    color: '#fff', boxShadow: '0 1px 4px rgba(0,86,210,.25)' },
    success: { background: C.success, color: '#fff', boxShadow: '0 1px 4px rgba(18,183,106,.25)' },
    danger:  { background: C.red,     color: '#fff' },
    ghost:   { background: C.white,   color: C.slate, border: `1.5px solid ${C.border}` },
    outline: { background: 'transparent', color: C.blue, border: `1.5px solid ${C.blue}` },
    purple:  { background: C.purple,  color: '#fff', boxShadow: '0 1px 4px rgba(124,58,237,.25)' },
    subtle:  { background: C.blueLight, color: C.blue },
  };
  return (
    <button
      type={type}
      style={{
        ...s, border: 'none', fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .5 : 1,
        transition: 'all .15s',
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontFamily: "'DM Sans', sans-serif",
        ...variants[variant], ...style,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Field = ({ label, htmlFor, children, hint }) => (
  <div style={{ marginBottom: 16 }}>
    <label htmlFor={htmlFor} style={{
      display: 'block', fontSize: 11, fontWeight: 600, color: C.muted,
      textTransform: 'uppercase', letterSpacing: .7, marginBottom: 6,
    }}>
      {label}
    </label>
    {children}
    {hint && <p style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>{hint}</p>}
  </div>
);

const Input = ({ id, value, onChange, ...props }) => (
  <input
    id={id} name={id} value={value} onChange={onChange}
    style={{
      width: '100%', padding: '9px 12px', borderRadius: 8,
      border: `1.5px solid ${C.border}`, fontSize: 13,
      color: C.ink, background: C.white, transition: 'border-color .15s',
    }}
    {...props}
  />
);

const Textarea = ({ id, value, onChange, rows = 4, ...props }) => (
  <textarea
    id={id} name={id} value={value} onChange={onChange} rows={rows}
    style={{
      width: '100%', padding: '9px 12px', borderRadius: 8,
      border: `1.5px solid ${C.border}`, fontSize: 13,
      color: C.ink, resize: 'vertical', background: C.white,
      lineHeight: 1.65, transition: 'border-color .15s',
    }}
    {...props}
  />
);

const Select = ({ id, value, onChange, children }) => (
  <select
    id={id} name={id} value={value} onChange={onChange}
    style={{
      width: '100%', padding: '9px 12px', borderRadius: 8,
      border: `1.5px solid ${C.border}`, fontSize: 13,
      color: C.ink, background: C.white, cursor: 'pointer',
      transition: 'border-color .15s',
    }}
  >
    {children}
  </select>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
const Card = ({ children, style = {}, className = '' }) => (
  <div className={className} style={{
    background: C.card, borderRadius: 14,
    border: `1.5px solid ${C.border}`,
    boxShadow: '0 1px 4px rgba(15,23,42,.05)',
    ...style,
  }}>
    {children}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ children, maxWidth = 640 }) => (
  <div className="fade-in" style={{
    position: 'fixed', inset: 0,
    background: 'rgba(10,15,30,.6)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px', zIndex: 9999,
  }}>
    <div className="pop-in" style={{
      background: C.white, borderRadius: 18,
      padding: 'clamp(20px, 4vw, 32px)',
      width: '100%', maxWidth,
      maxHeight: '94vh', overflowY: 'auto',
      boxShadow: '0 30px 80px rgba(0,0,0,.25)',
    }}>
      {children}
    </div>
  </div>
);

const ModalHeader = ({ title, subtitle, onClose }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 24,
    paddingBottom: 18, borderBottom: `1.5px solid ${C.border}`,
  }}>
    <div>
      <h2 style={{
        fontFamily: "'Fraunces', serif", fontWeight: 300,
        fontSize: 'clamp(18px,3vw,22px)', color: C.ink, letterSpacing: -.3,
      }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{subtitle}</p>}
    </div>
    <button
      type="button" onClick={onClose}
      style={{
        background: C.bg, border: `1.5px solid ${C.border}`,
        width: 32, height: 32, borderRadius: 8, fontSize: 16,
        color: C.muted, display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
        transition: 'all .15s',
      }}
    >×</button>
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ toast }) => !toast ? null : (
  <div className="slide-down" style={{
    position: 'fixed', top: 16, right: 16, zIndex: 99999,
    background: toast.type === 'error' ? C.red : '#0F172A',
    color: '#fff', padding: '11px 18px', borderRadius: 10,
    fontWeight: 600, fontSize: 13.5,
    boxShadow: '0 8px 32px rgba(0,0,0,.25)',
    maxWidth: 'calc(100vw - 32px)',
    display: 'flex', alignItems: 'center', gap: 8,
  }}>
    <span>{toast.type === 'error' ? '⚠️' : '✓'}</span>
    {toast.msg}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, delay = 0 }) => (
  <div className="slide-up" style={{
    animationDelay: `${delay}ms`,
    background: C.white, borderRadius: 14,
    border: `1.5px solid ${C.border}`,
    padding: '18px 16px',
    boxShadow: '0 1px 4px rgba(15,23,42,.04)',
  }}>
    <div style={{
      width: 38, height: 38, borderRadius: 10,
      background: `${color}18`, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: 18, marginBottom: 12,
    }}>{icon}</div>
    <div style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, color, lineHeight: 1, marginBottom: 5 }}>
      {value}
    </div>
    <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>{label}</div>
  </div>
);

// ─── Analytics Dashboard ──────────────────────────────────────────────────────
function AnalyticsDashboard({ enrollments }) {
  const total      = enrollments.length;
  const completed  = enrollments.filter(e => e.progress_percent === 100).length;
  const inProgress = enrollments.filter(e => e.progress_percent > 0 && e.progress_percent < 100).length;
  const avgProgress = total > 0
    ? Math.round(enrollments.reduce((s, e) => s + (e.progress_percent || 0), 0) / total)
    : 0;
  const thisWeek = enrollments.filter(e => (Date.now() - new Date(e.enrolled_at)) < 7 * 86400 * 1000).length;
  const paidCert = enrollments.filter(e => e.has_paid_certificate).length;

  const stats = [
    { label: 'Total Enrolled',    value: total,             icon: '👥', color: C.blue    },
    { label: 'Completed',         value: completed,         icon: '🎓', color: C.success },
    { label: 'In Progress',       value: inProgress,        icon: '⚡', color: C.amber   },
    { label: 'Avg Progress',      value: `${avgProgress}%`, icon: '📈', color: '#8B5CF6' },
    { label: 'New This Week',     value: thisWeek,          icon: '🗓', color: '#EC4899' },
    { label: 'Paid Certificates', value: paidCert,          icon: '🏆', color: C.amber   },
  ];

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 300,
          fontSize: 'clamp(18px,3vw,22px)', color: C.ink, letterSpacing: -.3,
        }}>Platform Overview</h2>
        <span style={{ fontSize: 12, color: C.muted }}>All time</span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(140px, 100%), 1fr))',
        gap: 10,
      }}>
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 40} />)}
      </div>
    </div>
  );
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────
function Leaderboard({ enrollments }) {
  const sorted = [...enrollments]
    .filter(e => (e.progress_percent || 0) > 0)
    .sort((a, b) => (b.progress_percent || 0) - (a.progress_percent || 0))
    .slice(0, 20);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Card>
      <div style={{ padding: '18px 20px', borderBottom: `1.5px solid ${C.border}` }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 300,
          fontSize: 'clamp(17px,2.5vw,20px)', color: C.ink, letterSpacing: -.3,
        }}>
          🏆 Progress Leaderboard
        </h2>
        <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
          Top {sorted.length} students by learning progress
        </p>
      </div>

      {sorted.length === 0 ? (
        <div style={{ padding: '52px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <p style={{ color: C.muted, fontSize: 14 }}>No student progress yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: 52 }}>Rank</th>
                <th>Student</th>
                <th className="hide-mobile">Course</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e, i) => (
                <tr key={i}>
                  <td style={{ textAlign: 'center', fontSize: i < 3 ? 20 : 13, fontWeight: 700, color: C.muted }}>
                    {medals[i] || `#${i + 1}`}
                  </td>
                  <td>
                    <code style={{
                      background: C.bg, padding: '3px 8px',
                      borderRadius: 6, fontSize: 11.5, color: C.slate,
                    }}>
                      {String(e.user_id).slice(0, 10)}…
                    </code>
                  </td>
                  <td className="hide-mobile" style={{ fontWeight: 600, color: C.ink, fontSize: 13, maxWidth: 200 }}>
                    {e.course?.title || '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 120 }}>
                      <div style={{
                        flex: 1, maxWidth: 100, background: C.bg,
                        borderRadius: 100, height: 6, overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${e.progress_percent || 0}%`, height: '100%',
                          background: e.progress_percent === 100 ? C.success : C.blue,
                          borderRadius: 100, transition: 'width .6s ease',
                        }}/>
                      </div>
                      <span style={{
                        fontWeight: 700, fontSize: 12,
                        color: e.progress_percent === 100 ? C.success : C.blue,
                        minWidth: 36,
                      }}>
                        {e.progress_percent || 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ─── Quiz Builder Modal ───────────────────────────────────────────────────────
function QuizBuilderModal({ lesson, onClose, showMsg }) {
  const [quiz, setQuiz]           = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editQ, setEditQ]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const { data: qz, error: fetchErr } = await supabase
        .from('course_quizzes').select('*')
        .eq('lesson_id', lesson.id).maybeSingle();
      if (fetchErr) throw new Error(`Fetch quiz failed: ${fetchErr.message} (code: ${fetchErr.code})`);
      let finalQuiz = qz;
      if (!finalQuiz) {
        const { data: newQz, error: insertErr } = await supabase
          .from('course_quizzes')
          .upsert([{ lesson_id: lesson.id, passing_score: 70, max_attempts: 3, shuffle_questions: false }], { onConflict: 'lesson_id' })
          .select().single();
        if (insertErr) throw new Error(`Create quiz failed: ${insertErr.message} (code: ${insertErr.code})`);
        if (!newQz) throw new Error('Quiz was created but no data was returned. Check RLS policies.');
        finalQuiz = newQz;
      }
      if (!finalQuiz?.id) throw new Error('Quiz ID is missing.');
      setQuiz(finalQuiz);
      const { data: qs, error: qErr } = await supabase
        .from('course_questions').select('*')
        .eq('quiz_id', finalQuiz.id).order('order');
      if (qErr) throw new Error(`Fetch questions failed: ${qErr.message} (code: ${qErr.code})`);
      setQuestions(qs || []);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const saveSettings = async () => {
    setError(null);
    if (!quiz?.id) { setError('Quiz is not initialized.'); return; }
    const { error } = await supabase.from('course_quizzes').update({
      passing_score: Number(quiz.passing_score),
      max_attempts: Number(quiz.max_attempts),
      shuffle_questions: !!quiz.shuffle_questions,
    }).eq('id', quiz.id);
    if (error) setError(`Save settings failed: ${error.message} (code: ${error.code})`);
    else { showMsg('Settings saved!'); load(); }
  };

  const blankQuestion = () => ({
    question_text: '', question_type: 'multiple_choice',
    options: [{ id: 'a', text: '' }, { id: 'b', text: '' }, { id: 'c', text: '' }, { id: 'd', text: '' }],
    correct_answer: 'a', points: 1, explanation: '',
    quiz_id: quiz?.id || null, order: questions.length + 1,
  });

  const saveQuestion = async () => {
    setError(null);
    if (!editQ.question_text.trim()) { setError('Question text cannot be empty.'); return; }
    if (!editQ.quiz_id) { setError('quiz_id is missing — reload this panel.'); return; }
    setSaving(true);
    const payload = {
      quiz_id: editQ.quiz_id, question_text: editQ.question_text.trim(),
      question_type: editQ.question_type, options: JSON.stringify(editQ.options || []),
      correct_answer: editQ.correct_answer || '', points: Number(editQ.points) || 1,
      explanation: editQ.explanation || '', order: Number(editQ.order) || 1,
    };
    let dbError = null;
    if (editQ.id) {
      const { error } = await supabase.from('course_questions').update(payload).eq('id', editQ.id);
      dbError = error;
    } else {
      const { error } = await supabase.from('course_questions').insert([payload]);
      dbError = error;
    }
    if (dbError) setError(`Save question failed: ${dbError.message} (code: ${dbError.code})`);
    else { showMsg('Question saved!'); setEditQ(null); load(); }
    setSaving(false);
  };

  const deleteQ = async id => {
    if (!confirm('Delete this question?')) return;
    setError(null);
    const { error } = await supabase.from('course_questions').delete().eq('id', id);
    if (error) setError(`Delete failed: ${error.message}`);
    else load();
  };

  const updateOption = (idx, val) => {
    const opts = [...(editQ.options || [])];
    opts[idx] = { ...opts[idx], text: val };
    setEditQ({ ...editQ, options: opts });
  };

  return (
    <Modal maxWidth={760}>
      <ModalHeader
        title={`Quiz Builder`}
        subtitle={lesson.title}
        onClose={onClose}
      />
      <ErrorBox error={error} onDismiss={() => setError(null)} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: C.muted }}>
          <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 14px' }}/>
          <div style={{ fontSize: 13 }}>Loading quiz…</div>
        </div>
      ) : !quiz ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ color: C.red, fontWeight: 700, marginBottom: 14 }}>Quiz could not be loaded.</div>
          <Btn variant="primary" onClick={load}>Retry</Btn>
        </div>
      ) : (
        <>
          {/* Debug info */}
          <div style={{
            background: C.bg, borderRadius: 8, padding: '7px 12px',
            marginBottom: 18, fontSize: 10.5, color: C.muted, fontFamily: 'monospace',
            display: 'flex', gap: 16, flexWrap: 'wrap',
          }}>
            <span>Quiz ID: {quiz.id}</span>
            <span>Lesson ID: {lesson.id}</span>
          </div>

          {/* Settings */}
          <div style={{
            background: C.bg, borderRadius: 12, padding: '16px',
            marginBottom: 22, border: `1.5px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: .7, marginBottom: 14 }}>
              Quiz Settings
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 12, marginBottom: 14 }}>
              <Field label="Passing %" htmlFor="quiz-passing-score">
                <Input id="quiz-passing-score" type="number" value={quiz.passing_score ?? 70} onChange={e => setQuiz({ ...quiz, passing_score: e.target.value })}/>
              </Field>
              <Field label="Max Attempts" htmlFor="quiz-max-attempts">
                <Input id="quiz-max-attempts" type="number" value={quiz.max_attempts ?? 3} onChange={e => setQuiz({ ...quiz, max_attempts: e.target.value })}/>
              </Field>
              <Field label="Shuffle" htmlFor="quiz-shuffle">
                <Select id="quiz-shuffle" value={quiz.shuffle_questions ? 'yes' : 'no'} onChange={e => setQuiz({ ...quiz, shuffle_questions: e.target.value === 'yes' })}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </Select>
              </Field>
            </div>
            <Btn variant="primary" size="sm" onClick={saveSettings}>Save Settings</Btn>
          </div>

          {/* Question editor */}
          {editQ && (
            <div className="slide-up" style={{
              background: C.blueLight, borderRadius: 12, padding: 18,
              marginBottom: 22, border: `1.5px solid ${C.blueMid}`,
            }}>
              <div style={{ fontWeight: 700, color: C.blue, fontSize: 12.5, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
                {editQ.id ? '✏️ Editing Question' : '➕ New Question'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 14 }}>
                <Field label="Question Text *" htmlFor="q-text">
                  <Textarea id="q-text" value={editQ.question_text} onChange={e => setEditQ({ ...editQ, question_text: e.target.value })} rows={2} placeholder="Enter your question…"/>
                </Field>
                <Field label="Type" htmlFor="q-type">
                  <Select id="q-type" value={editQ.question_type} onChange={e => setEditQ({ ...editQ, question_type: e.target.value })}>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="single_choice">Single Choice</option>
                    <option value="true_false">True / False</option>
                    <option value="text">Short Text</option>
                  </Select>
                </Field>
                <Field label="Points" htmlFor="q-points">
                  <Input id="q-points" type="number" min="1" value={editQ.points} onChange={e => setEditQ({ ...editQ, points: e.target.value })}/>
                </Field>
              </div>

              {(editQ.question_type === 'multiple_choice' || editQ.question_type === 'single_choice') && (
                <Field label="Options — select correct answer" htmlFor="q-opt-0">
                  {(editQ.options || []).map((opt, idx) => (
                    <div key={opt.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                      <input
                        type="radio" id={`q-correct-${opt.id}`} name="q-correct-answer"
                        checked={editQ.correct_answer === opt.id}
                        onChange={() => setEditQ({ ...editQ, correct_answer: opt.id })}
                        style={{ width: 15, height: 15, cursor: 'pointer', accentColor: C.blue, flexShrink: 0 }}
                      />
                      <Input id={`q-opt-${idx}`} value={opt.text} onChange={e => updateOption(idx, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + idx)}`} style={{ flex: 1 }}/>
                    </div>
                  ))}
                  <button type="button" onClick={() => setEditQ({ ...editQ, options: [...(editQ.options || []), { id: String(Date.now()), text: '' }] })} style={{ background: 'none', border: 'none', color: C.blue, fontWeight: 600, fontSize: 12.5, cursor: 'pointer', marginTop: 4, padding: 0 }}>
                    + Add option
                  </button>
                </Field>
              )}

              {editQ.question_type === 'true_false' && (
                <Field label="Correct Answer" htmlFor="q-tf-answer">
                  <Select id="q-tf-answer" value={editQ.correct_answer} onChange={e => setEditQ({ ...editQ, correct_answer: e.target.value })}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Select>
                </Field>
              )}

              {editQ.question_type === 'text' && (
                <Field label="Expected Answer (case-insensitive)" htmlFor="q-text-answer">
                  <Input id="q-text-answer" value={editQ.correct_answer || ''} onChange={e => setEditQ({ ...editQ, correct_answer: e.target.value })} placeholder="Expected answer…"/>
                </Field>
              )}

              <Field label="Explanation (optional)" htmlFor="q-explanation">
                <Textarea id="q-explanation" value={editQ.explanation || ''} onChange={e => setEditQ({ ...editQ, explanation: e.target.value })} rows={2} placeholder="Explain the correct answer…"/>
              </Field>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Btn variant="ghost" onClick={() => { setEditQ(null); setError(null); }}>Cancel</Btn>
                <Btn variant="primary" onClick={saveQuestion} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Question'}
                </Btn>
              </div>
            </div>
          )}

          {/* Questions list */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>
              Questions
              <span style={{ marginLeft: 8, background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: '2px 9px', fontSize: 11, color: C.muted, fontWeight: 600 }}>
                {questions.length}
              </span>
            </div>
            <Btn variant="success" size="sm" disabled={!quiz?.id} onClick={() => { setError(null); setEditQ(blankQuestion()); }}>
              + Add Question
            </Btn>
          </div>

          {questions.length === 0 ? (
            <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: '36px 24px', textAlign: 'center', color: C.muted, fontSize: 13.5 }}>
              No questions yet — click "+ Add Question" to get started.
            </div>
          ) : questions.map((q, idx) => {
            const opts = q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : [];
            const correct = opts.find(o => o.id === q.correct_answer);
            return (
              <div key={q.id} style={{
                border: `1.5px solid ${C.border}`, borderRadius: 10,
                padding: '12px 15px', marginBottom: 8, background: C.white,
                transition: 'border-color .15s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 5, lineHeight: 1.4 }}>
                      <span style={{ color: C.blue, marginRight: 6 }}>Q{idx + 1}.</span>{q.question_text}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ background: C.bg, padding: '1px 7px', borderRadius: 4, fontWeight: 500 }}>{q.question_type.replace('_', ' ')}</span>
                      <span>{q.points} pt{q.points !== 1 ? 's' : ''}</span>
                      {correct && <span style={{ color: C.success }}>✓ {correct.text}</span>}
                      {q.question_type === 'true_false' && <span style={{ color: C.success }}>✓ {q.correct_answer}</span>}
                      {q.question_type === 'text' && <span style={{ color: C.success }}>✓ "{q.correct_answer}"</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <Btn variant="ghost" size="xs" onClick={() => {
                      setError(null);
                      const parsedOpts = q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : [];
                      setEditQ({ ...q, options: parsedOpts });
                    }}>Edit</Btn>
                    <Btn variant="danger" size="xs" onClick={() => deleteQ(q.id)}>✕</Btn>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </Modal>
  );
}

// ─── Assignment Grader Modal ──────────────────────────────────────────────────
function AssignmentGraderModal({ lesson, onClose, showMsg }) {
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [grades, setGrades]   = useState({});
  const [fbacks, setFbacks]   = useState({});

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      let { data: a, error: fetchErr } = await supabase
        .from('course_assignments').select('*').eq('lesson_id', lesson.id).maybeSingle();
      if (fetchErr) throw new Error(`Fetch assignment failed: ${fetchErr.message}`);
      if (!a) {
        const { data: na, error: insertErr } = await supabase
          .from('course_assignments')
          .insert([{ lesson_id: lesson.id, instructions: 'Upload your completed project.', total_points: 100 }])
          .select().single();
        if (insertErr) throw new Error(`Create assignment failed: ${insertErr.message}`);
        a = na;
      }
      setAssignment(a);
      const { data: subs, error: subsErr } = await supabase
        .from('course_assignment_submissions').select('*')
        .eq('assignment_id', a.id).order('submitted_at', { ascending: false });
      if (subsErr) throw new Error(`Fetch submissions failed: ${subsErr.message}`);
      const subsList = subs || [];
      setSubmissions(subsList);
      const g = {}, f = {};
      subsList.forEach(s => { g[s.id] = s.grade ?? ''; f[s.id] = s.feedback || ''; });
      setGrades(g); setFbacks(f);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const saveGrade = async id => {
    setError(null);
    const { error } = await supabase
      .from('course_assignment_submissions')
      .update({ grade: Number(grades[id]), feedback: fbacks[id], graded_at: new Date() })
      .eq('id', id);
    if (error) setError(`Save grade failed: ${error.message}`);
    else { showMsg('Grade saved!'); load(); }
  };

  const saveAssignment = async () => {
    setError(null);
    const { error } = await supabase
      .from('course_assignments')
      .update({ instructions: assignment.instructions, total_points: assignment.total_points })
      .eq('id', assignment.id);
    if (error) setError(`Save assignment failed: ${error.message}`);
    else showMsg('Assignment updated!');
  };

  return (
    <Modal maxWidth={800}>
      <ModalHeader title="Grade Submissions" subtitle={lesson.title} onClose={onClose}/>
      <ErrorBox error={error} onDismiss={() => setError(null)}/>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: C.muted }}>
          <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 14px' }}/>
          <div style={{ fontSize: 13 }}>Loading submissions…</div>
        </div>
      ) : assignment && (
        <>
          {/* Assignment Settings */}
          <div style={{ background: C.bg, borderRadius: 12, padding: 16, marginBottom: 24, border: `1.5px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: .7, marginBottom: 14 }}>
              Assignment Settings
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 140px', gap: 12, marginBottom: 14 }}>
              <Field label="Instructions" htmlFor="assign-instructions">
                <Textarea id="assign-instructions" value={assignment.instructions || ''} onChange={e => setAssignment({ ...assignment, instructions: e.target.value })} rows={3}/>
              </Field>
              <Field label="Total Points" htmlFor="assign-points">
                <Input id="assign-points" type="number" value={assignment.total_points || 100} onChange={e => setAssignment({ ...assignment, total_points: e.target.value })}/>
              </Field>
            </div>
            <Btn variant="primary" size="sm" onClick={saveAssignment}>Save</Btn>
          </div>

          {/* Submissions header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>
              Submissions
              <span style={{ marginLeft: 8, background: submissions.length > 0 ? C.successBg : C.bg, border: `1.5px solid ${submissions.length > 0 ? '#A7F3D0' : C.border}`, borderRadius: 20, padding: '2px 9px', fontSize: 11, color: submissions.length > 0 ? C.success : C.muted, fontWeight: 600 }}>
                {submissions.length}
              </span>
            </div>
            <div style={{ fontSize: 12, color: C.muted }}>
              {submissions.filter(s => s.grade != null).length} graded
            </div>
          </div>

          {submissions.length === 0 ? (
            <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
              <p style={{ color: C.muted, fontSize: 13.5 }}>No submissions yet.</p>
            </div>
          ) : submissions.map(sub => {
            const isGraded = sub.grade != null;
            const pct = isGraded ? Math.round((sub.grade / (assignment.total_points || 100)) * 100) : null;
            return (
              <div key={sub.id} style={{
                border: `1.5px solid ${isGraded ? '#A7F3D0' : C.border}`,
                background: isGraded ? '#FAFFFE' : C.white,
                borderRadius: 12, padding: '16px', marginBottom: 12,
                transition: 'all .15s',
              }}>
                {/* Submission header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                      👤
                    </div>
                    <div>
                      <code style={{ fontSize: 11.5, background: C.bg, padding: '2px 8px', borderRadius: 5, color: C.slate }}>
                        {sub.user_id.slice(0, 12)}…
                      </code>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
                        {new Date(sub.submitted_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  {isGraded && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: 20, color: pct >= 50 ? C.success : C.red, lineHeight: 1 }}>
                        {sub.grade}/{assignment.total_points}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{pct}%</div>
                    </div>
                  )}
                </div>

                {sub.text_submission && (
                  <div style={{ background: C.bg, borderRadius: 8, padding: '10px 13px', fontSize: 13, lineHeight: 1.65, color: C.slate, marginBottom: 12 }}>
                    {sub.text_submission}
                  </div>
                )}

                {sub.file_url && (
                  <a href={sub.file_url} target="_blank" rel="noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', background: C.blueLight, color: C.blue,
                    borderRadius: 7, fontSize: 12, fontWeight: 600, marginBottom: 14,
                    textDecoration: 'none',
                  }}>
                    📎 View Submission
                  </a>
                )}

                {/* Grade inputs */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ width: 110 }}>
                    <label htmlFor={`grade-${sub.id}`} style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .6 }}>
                      Grade / {assignment.total_points}
                    </label>
                    <Input id={`grade-${sub.id}`} type="number" min="0" max={assignment.total_points} value={grades[sub.id] ?? ''} onChange={e => setGrades(g => ({ ...g, [sub.id]: e.target.value }))}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <label htmlFor={`feedback-${sub.id}`} style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .6 }}>
                      Feedback
                    </label>
                    <Input id={`feedback-${sub.id}`} value={fbacks[sub.id] || ''} onChange={e => setFbacks(f => ({ ...f, [sub.id]: e.target.value }))} placeholder="Write feedback…"/>
                  </div>
                  <Btn variant="success" size="sm" onClick={() => saveGrade(sub.id)}>
                    {isGraded ? 'Update Grade' : 'Save Grade'}
                  </Btn>
                </div>
              </div>
            );
          })}
        </>
      )}
    </Modal>
  );
}

// ─── Main AdminCourses ────────────────────────────────────────────────────────
export default function AdminCourses() {
  const [view, setView]               = useState('courses');
  const [courses, setCourses]         = useState([]);
  const [selectedCourse, setSelected] = useState(null);
  const [modules, setModules]         = useState([]);
  const [lessons, setLessons]         = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [pageError, setPageError]     = useState(null);

  const [courseModal, setCourseModal] = useState(false);
  const [moduleModal, setModuleModal] = useState(false);
  const [lessonModal, setLessonModal] = useState(false);
  const [quizModal, setQuizModal]     = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [editing, setEditing]         = useState(null);
  const [mobileMenuOpen, setMobileMenu] = useState(false);

  const [toast, setToast] = useState(null);
  const showMsg = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => { fetchCourses(); fetchEnrollments(); }, []);

  const fetchCourses = async () => {
    setLoading(true); setPageError(null);
    const { data, error } = await supabase.from('course_courses').select('*').order('created_at', { ascending: false });
    if (error) setPageError(`Load courses failed: ${error.message} (code: ${error.code})`);
    else setCourses(data || []);
    setLoading(false);
  };

  const fetchEnrollments = async () => {
    const { data, error } = await supabase
      .from('course_enrollments').select('*, course:course_id(title)')
      .order('enrolled_at', { ascending: false });
    if (error) setPageError(`Load enrollments failed: ${error.message}`);
    else setEnrollments(data || []);
  };

  const selectCourse = useCallback(async course => {
    setSelected(course); setPageError(null);
    const { data: mods, error: modErr } = await supabase
      .from('course_modules').select('*').eq('course_id', course.id).order('order');
    if (modErr) { setPageError(`Load modules failed: ${modErr.message}`); return; }
    setModules(mods || []);
    if (mods?.length) {
      const { data: less, error: lessErr } = await supabase
        .from('course_lessons').select('*, course_quizzes(*), course_assignments(*)')
        .in('module_id', mods.map(m => m.id)).order('order');
      if (lessErr) setPageError(`Load lessons failed: ${lessErr.message}`);
      else setLessons(less || []);
    } else setLessons([]);
  }, []);

  const saveCourse = async data => {
    setPageError(null);
    try {
      if (!data.id) {
        data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const { error } = await supabase.from('course_courses').insert([data]);
        if (error) throw new Error(`Insert failed: ${error.message} (code: ${error.code})`);
      } else {
        const { error } = await supabase.from('course_courses').update(data).eq('id', data.id);
        if (error) throw new Error(`Update failed: ${error.message} (code: ${error.code})`);
      }
      showMsg('Course saved!'); fetchCourses(); setCourseModal(false);
    } catch (e) { setPageError(e.message); }
  };

  const deleteCourse = async id => {
    if (!confirm('Delete this course and all its content?')) return;
    setPageError(null);
    const { error } = await supabase.from('course_courses').delete().eq('id', id);
    if (error) setPageError(`Delete failed: ${error.message}`);
    else { showMsg('Deleted'); fetchCourses(); if (selectedCourse?.id === id) setSelected(null); }
  };

  const saveModule = async data => {
    setPageError(null);
    try {
      let err;
      if (data.id) {
        const { error } = await supabase.from('course_modules').update(data).eq('id', data.id); err = error;
      } else {
        const { error } = await supabase.from('course_modules').insert([{ ...data, course_id: selectedCourse.id, order: modules.length + 1 }]); err = error;
      }
      if (err) throw new Error(`${err.message} (code: ${err.code})`);
      showMsg('Module saved!'); selectCourse(selectedCourse); setModuleModal(false);
    } catch (e) { setPageError(e.message); }
  };

  const saveLesson = async data => {
    setPageError(null);
    try {
      let err;
      if (data.id) {
        const { error } = await supabase.from('course_lessons').update(data).eq('id', data.id); err = error;
      } else {
        const { error } = await supabase.from('course_lessons').insert([{ ...data, order: lessons.length + 1 }]); err = error;
      }
      if (err) throw new Error(`${err.message} (code: ${err.code})`);
      showMsg('Lesson saved!'); selectCourse(selectedCourse); setLessonModal(false);
    } catch (e) { setPageError(e.message); }
  };

  const deleteLesson = async id => {
    if (!confirm('Delete this lesson?')) return;
    setPageError(null);
    const { error } = await supabase.from('course_lessons').delete().eq('id', id);
    if (error) setPageError(`Delete lesson failed: ${error.message}`);
    else { showMsg('Deleted'); selectCourse(selectedCourse); }
  };

  const navItems = [['courses','📚','Courses'],['enrollments','📋','Enrollments'],['leaderboard','🏆','Leaderboard']];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: '100vh' }}>
      <style>{ADMIN_CSS}</style>
      <Toast toast={toast}/>

      {/* ── TOP NAV ── */}
      <nav style={{
        background: C.white, borderBottom: `1.5px solid ${C.border}`,
        padding: '0 clamp(16px,3vw,32px)', height: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 8px rgba(15,23,42,.06)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, background: C.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, flexShrink: 0,
          }}>🎓</div>
          <div>
            <div style={{
              fontFamily: "'Fraunces', serif", fontWeight: 300, fontStyle: 'italic',
              fontSize: 16, color: C.ink, lineHeight: 1.1,
            }}>Admin Panel</div>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 500 }}>Course Management</div>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 3, background: C.bg, padding: '4px', borderRadius: 10, border: `1.5px solid ${C.border}` }}>
          {navItems.map(([k, icon, label]) => (
            <button key={k} className={`nav-tab${view === k ? ' active' : ''}`} onClick={() => setView(k)}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="hide-desktop"
          onClick={() => setMobileMenu(v => !v)}
          style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer' }}
          aria-label="Menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="slide-down" style={{
          background: C.white, borderBottom: `1.5px solid ${C.border}`,
          padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4,
          position: 'sticky', top: 58, zIndex: 99,
        }}>
          {navItems.map(([k, icon, label]) => (
            <button key={k} className={`nav-tab${view === k ? ' active' : ''}`}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '10px 14px' }}
              onClick={() => { setView(k); setMobileMenu(false); }}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(16px,3vw,32px) clamp(12px,2.5vw,24px)' }}>

        <ErrorBox error={pageError} onDismiss={() => setPageError(null)}/>

        {/* ── COURSES VIEW ── */}
        {view === 'courses' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'clamp(220px,22vw,280px) minmax(0,1fr)',
            gap: 16,
          }}>
            {/* Course list sidebar */}
            <Card style={{ padding: 14, height: 'fit-content', position: 'sticky', top: 74 }}>
              <Btn
                variant="primary" size="sm"
                style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
                onClick={() => { setEditing({}); setCourseModal(true); }}
              >
                + New Course
              </Btn>

              {loading ? (
                [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 64, marginBottom: 6 }}/>)
              ) : courses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 0', color: C.muted, fontSize: 13 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>
                  No courses yet.
                </div>
              ) : courses.map(c => (
                <div key={c.id} className={`course-item${selectedCourse?.id === c.id ? ' active' : ''}`}
                  onClick={() => selectCourse(c)}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 5, lineHeight: 1.3 }}>
                    {c.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10.5, color: C.muted, textTransform: 'capitalize' }}>{c.level}</span>
                    <span style={{ fontSize: 10.5, color: C.muted }}>·</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20,
                      textTransform: 'uppercase', letterSpacing: .4,
                      background: c.status === 'published' ? C.successBg : C.bg,
                      color: c.status === 'published' ? C.success : C.muted,
                    }}>{c.status}</span>
                  </div>
                </div>
              ))}
            </Card>

            {/* Curriculum builder */}
            <Card style={{ padding: 'clamp(16px,2.5vw,24px)' }}>
              {selectedCourse ? (
                <>
                  {/* Course header */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', flexWrap: 'wrap', gap: 12,
                    paddingBottom: 18, borderBottom: `1.5px solid ${C.border}`, marginBottom: 20,
                  }}>
                    <div>
                      <h2 style={{
                        fontFamily: "'Fraunces', serif", fontWeight: 300,
                        fontSize: 'clamp(17px,2.5vw,22px)', color: C.ink,
                        letterSpacing: -.3, marginBottom: 4,
                      }}>{selectedCourse.title}</h2>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: C.muted }}>
                          {modules.length} module{modules.length !== 1 ? 's' : ''}
                        </span>
                        <span style={{ fontSize: 12, color: C.muted }}>·</span>
                        <span style={{ fontSize: 12, color: C.muted }}>
                          {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                      <Btn variant="ghost" size="sm" onClick={() => { setEditing({ ...selectedCourse }); setCourseModal(true); }}>
                        ⚙ Settings
                      </Btn>
                      <Btn variant="danger" size="sm" onClick={() => deleteCourse(selectedCourse.id)}>
                        Delete
                      </Btn>
                    </div>
                  </div>

                  <Btn variant="outline" size="sm" style={{ marginBottom: 18 }}
                    onClick={() => { setEditing({}); setModuleModal(true); }}>
                    + Add Module
                  </Btn>

                  {/* Modules */}
                  {modules.map(mod => (
                    <div key={mod.id} style={{
                      border: `1.5px solid ${C.border}`, borderRadius: 12,
                      marginBottom: 14, overflow: 'hidden',
                    }}>
                      {/* Module header */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '11px 15px', background: C.bg,
                        borderBottom: `1.5px solid ${C.border}`,
                        flexWrap: 'wrap', gap: 8,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 22, height: 22, borderRadius: 6,
                            background: C.blueMid, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 800, color: C.blue,
                          }}>
                            {mod.order}
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: C.ink }}>{mod.title}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Btn variant="primary" size="xs" onClick={() => { setEditing({ module_id: mod.id, content_type: 'video' }); setLessonModal(true); }}>
                            + Content
                          </Btn>
                          <Btn variant="ghost" size="xs" onClick={() => { setEditing({ ...mod }); setModuleModal(true); }}>
                            Edit
                          </Btn>
                        </div>
                      </div>

                      {/* Lessons */}
                      <div style={{ padding: '10px 14px 14px' }}>
                        {lessons.filter(l => l.module_id === mod.id).length === 0 ? (
                          <p style={{ color: C.muted, fontSize: 12.5, fontStyle: 'italic', padding: '6px 0' }}>
                            No content yet — click "+ Content" to add.
                          </p>
                        ) : lessons.filter(l => l.module_id === mod.id).map(lesson => {
                          const tc = typeColors[lesson.content_type] || typeColors.article;
                          return (
                            <div key={lesson.id} className="lesson-row">
                              <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, flex: 1 }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: tc.dot, flexShrink: 0 }}/>
                                <span style={{
                                  padding: '2px 8px', borderRadius: 20,
                                  fontSize: 10.5, fontWeight: 700,
                                  background: tc.bg, color: tc.text,
                                  flexShrink: 0, textTransform: 'capitalize',
                                }}>
                                  {lesson.content_type}
                                </span>
                                <span style={{
                                  fontWeight: 600, fontSize: 12.5, color: C.ink,
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                  {lesson.title}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                                {lesson.content_type === 'quiz' && (
                                  <Btn variant="subtle" size="xs" onClick={() => { setEditing(lesson); setQuizModal(true); }}>
                                    Quiz
                                  </Btn>
                                )}
                                {lesson.content_type === 'assignment' && (
                                  <Btn variant="purple" size="xs" onClick={() => { setEditing(lesson); setAssignModal(true); }}>
                                    Grade
                                  </Btn>
                                )}
                                <Btn variant="ghost" size="xs" onClick={() => { setEditing({ ...lesson }); setLessonModal(true); }}>
                                  Edit
                                </Btn>
                                <Btn variant="danger" size="xs" onClick={() => deleteLesson(lesson.id)}>✕</Btn>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: 380, flexDirection: 'column', gap: 14,
                }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 20, background: C.blueLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
                  }}>📖</div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{
                      fontFamily: "'Fraunces', serif", fontWeight: 300,
                      fontSize: 18, color: C.slate, marginBottom: 6,
                    }}>
                      Select a course
                    </p>
                    <p style={{ fontSize: 13, color: C.muted }}>to build its curriculum</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── ENROLLMENTS VIEW ── */}
        {view === 'enrollments' && (
          <div>
            <AnalyticsDashboard enrollments={enrollments}/>
            <Card>
              <div style={{ padding: '16px 20px', borderBottom: `1.5px solid ${C.border}` }}>
                <h2 style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 300,
                  fontSize: 'clamp(16px,2.5vw,20px)', color: C.ink, letterSpacing: -.3,
                }}>All Enrollments</h2>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
                  {enrollments.length} total record{enrollments.length !== 1 ? 's' : ''}
                </p>
              </div>
              {enrollments.length === 0 ? (
                <div style={{ padding: '52px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                  <p style={{ color: C.muted, fontSize: 14 }}>No enrollments yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Progress</th>
                        <th className="hide-mobile">Enrolled</th>
                        <th className="hide-mobile">Certificate</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map((e, i) => (
                        <tr key={i}>
                          <td>
                            <code style={{ background: C.bg, padding: '2px 8px', borderRadius: 5, fontSize: 11, color: C.slate }}>
                              {e.user_id.slice(0, 10)}…
                            </code>
                          </td>
                          <td style={{ fontWeight: 600, color: C.ink, fontSize: 12.5, maxWidth: 180 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {e.course?.title || '—'}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                              <div style={{ flex: 1, maxWidth: 70, background: C.bg, borderRadius: 100, height: 5, overflow: 'hidden' }}>
                                <div style={{ width: `${e.progress_percent || 0}%`, height: '100%', background: e.progress_percent === 100 ? C.success : C.blue, borderRadius: 100 }}/>
                              </div>
                              <span style={{ fontWeight: 700, fontSize: 12, color: e.progress_percent === 100 ? C.success : C.blue, minWidth: 34 }}>
                                {e.progress_percent || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="hide-mobile" style={{ fontSize: 12 }}>
                            {new Date(e.enrolled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="hide-mobile">
                            <span style={{
                              padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                              background: e.has_paid_certificate ? C.successBg : C.bg,
                              color: e.has_paid_certificate ? C.success : C.muted,
                            }}>
                              {e.has_paid_certificate ? '✓ Paid' : 'Free'}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                              background: e.progress_percent === 100 ? C.successBg : '#FFFBEB',
                              color: e.progress_percent === 100 ? C.success : '#92400E',
                            }}>
                              {e.progress_percent === 100 ? 'Done' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── LEADERBOARD VIEW ── */}
        {view === 'leaderboard' && <Leaderboard enrollments={enrollments}/>}
      </div>

      {/* ── MODALS ── */}

      {courseModal && (
        <Modal maxWidth={660}>
          <ModalHeader title={editing?.id ? 'Edit Course' : 'New Course'} onClose={() => setCourseModal(false)}/>
          <form onSubmit={e => { e.preventDefault(); saveCourse(editing); }}>
            <Field label="Course Title *" htmlFor="course-title">
              <Input id="course-title" required value={editing?.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Complete Web Development Bootcamp"/>
            </Field>
            <Field label="Description *" htmlFor="course-desc">
              <Textarea id="course-desc" required value={editing?.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="What students will learn…"/>
            </Field>
            <Field label="Thumbnail URL" htmlFor="course-thumb">
              <Input id="course-thumb" value={editing?.thumbnail_url || ''} onChange={e => setEditing({ ...editing, thumbnail_url: e.target.value })} placeholder="https://…"/>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
              <Field label="Price ($)" htmlFor="course-price">
                <Input id="course-price" type="number" step=".01" value={editing?.price || 0} onChange={e => setEditing({ ...editing, price: e.target.value })}/>
              </Field>
              <Field label="Cert Price ($)" htmlFor="course-cert-price">
                <Input id="course-cert-price" type="number" step=".01" value={editing?.certificate_price || 0} onChange={e => setEditing({ ...editing, certificate_price: e.target.value })}/>
              </Field>
              <Field label="Duration" htmlFor="course-duration">
                <Input id="course-duration" value={editing?.duration_estimate || ''} onChange={e => setEditing({ ...editing, duration_estimate: e.target.value })} placeholder="6 weeks"/>
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
              <Field label="Level" htmlFor="course-level">
                <Select id="course-level" value={editing?.level || 'beginner'} onChange={e => setEditing({ ...editing, level: e.target.value })}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all-levels">All Levels</option>
                </Select>
              </Field>
              <Field label="Status" htmlFor="course-status">
                <Select id="course-status" value={editing?.status || 'draft'} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Select>
              </Field>
              <Field label="Category" htmlFor="course-category">
                <Input id="course-category" value={editing?.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} placeholder="Programming"/>
              </Field>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <Btn variant="ghost" type="button" onClick={() => setCourseModal(false)}>Cancel</Btn>
              <Btn variant="primary" type="submit">Save Course</Btn>
            </div>
          </form>
        </Modal>
      )}

      {moduleModal && (
        <Modal maxWidth={480}>
          <ModalHeader title={editing?.id ? 'Edit Module' : 'New Module'} onClose={() => setModuleModal(false)}/>
          <form onSubmit={e => { e.preventDefault(); saveModule(editing); }}>
            <Field label="Module Title *" htmlFor="mod-title">
              <Input id="mod-title" required value={editing?.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Week 1: Getting Started"/>
            </Field>
            <Field label="Description" htmlFor="mod-desc">
              <Textarea id="mod-desc" value={editing?.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} placeholder="What this module covers…"/>
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
              <Btn variant="ghost" type="button" onClick={() => setModuleModal(false)}>Cancel</Btn>
              <Btn variant="primary" type="submit">Save Module</Btn>
            </div>
          </form>
        </Modal>
      )}

      {lessonModal && (
        <Modal maxWidth={560}>
          <ModalHeader title={editing?.id ? 'Edit Lesson' : 'Add Content'} onClose={() => setLessonModal(false)}/>
          <form onSubmit={e => { e.preventDefault(); saveLesson(editing); }}>
            <Field label="Content Type" htmlFor="lesson-type">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, marginTop: 2 }}>
                {[['video','🎬 Video'],['article','📄 Article'],['quiz','❓ Quiz'],['assignment','📝 Assignment']].map(([val, label]) => {
                  const sel = editing?.content_type === val;
                  const tc  = typeColors[val];
                  return (
                    <label key={val} htmlFor={`lesson-type-${val}`} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                      borderRadius: 9, border: `1.5px solid ${sel ? C.blue : C.border}`,
                      background: sel ? C.blueLight : C.white, cursor: 'pointer', transition: '.15s',
                    }}>
                      <input type="radio" id={`lesson-type-${val}`} name="lesson-type" value={val} checked={sel}
                        onChange={() => setEditing({ ...editing, content_type: val })}
                        style={{ accentColor: C.blue, flexShrink: 0 }}/>
                      <span style={{ fontWeight: 600, fontSize: 12.5, color: sel ? C.blue : C.slate }}>{label}</span>
                    </label>
                  );
                })}
              </div>
            </Field>
            <Field label="Title *" htmlFor="lesson-title">
              <Input id="lesson-title" required value={editing?.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Lesson title…"/>
            </Field>
            {editing?.content_type === 'video' && (
              <Field label="YouTube URL" htmlFor="lesson-url">
                <Input id="lesson-url" value={editing?.content_url || ''} onChange={e => setEditing({ ...editing, content_url: e.target.value })} placeholder="https://youtube.com/watch?v=…"/>
              </Field>
            )}
            {editing?.content_type === 'article' && (
              <Field label="Article Content" htmlFor="lesson-content">
                <Textarea id="lesson-content" value={editing?.content_text || ''} onChange={e => setEditing({ ...editing, content_text: e.target.value })} rows={6} placeholder="Write your article (HTML supported)…"/>
              </Field>
            )}
            {(editing?.content_type === 'quiz' || editing?.content_type === 'assignment') && (
              <div style={{ background: C.blueLight, borderRadius: 9, padding: '11px 14px', fontSize: 12.5, color: C.blue, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>ℹ️</span>
                Save first, then use the <strong>{editing.content_type === 'quiz' ? 'Quiz Builder' : 'Grade'}</strong> button.
              </div>
            )}
            <Field label="Description" htmlFor="lesson-desc">
              <Textarea id="lesson-desc" value={editing?.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={2} placeholder="Optional…"/>
            </Field>
            <label htmlFor="lesson-free-preview" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: C.slate, marginBottom: 18, padding: '10px 13px', background: C.bg, borderRadius: 8, border: `1.5px solid ${C.border}` }}>
              <input id="lesson-free-preview" name="lesson-free-preview" type="checkbox"
                style={{ width: 15, height: 15, accentColor: C.blue }}
                checked={editing?.is_free_preview || false}
                onChange={e => setEditing({ ...editing, is_free_preview: e.target.checked })}/>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Free preview</div>
                <div style={{ fontSize: 11, color: C.muted }}>Visible without enrollment</div>
              </div>
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
              <Btn variant="ghost" type="button" onClick={() => setLessonModal(false)}>Cancel</Btn>
              <Btn variant="primary" type="submit">Save Lesson</Btn>
            </div>
          </form>
        </Modal>
      )}

      {quizModal   && editing && <QuizBuilderModal     lesson={editing} onClose={() => setQuizModal(false)}   showMsg={showMsg}/>}
      {assignModal && editing && <AssignmentGraderModal lesson={editing} onClose={() => setAssignModal(false)} showMsg={showMsg}/>}
    </div>
  );
}