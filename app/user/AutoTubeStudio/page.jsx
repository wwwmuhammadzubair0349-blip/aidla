"use client";
// app/user/AutoTubeStudio/page.jsx
// Converted from React Router AutoTubeStudio.jsx + AutoTubeStudio.css
//
// Changes:
//   1. "use client" directive
//   2. import { Link, useNavigate } → import Link from "next/link"; import { useRouter } from "next/navigation"
//   3. const navigate = useNavigate() → const router = useRouter()
//   4. navigate(path) → router.push(path)
//   5. <Link to="..."> → <Link href="...">
//   6. import.meta.env.VITE_SUPABASE_URL → process.env.NEXT_PUBLIC_SUPABASE_URL
//   7. import.meta.env.VITE_SUPABASE_ANON_KEY → process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
//   8. import "./AutoTubeStudio.css" removed — CSS inlined as const CSS at bottom
//   9. supabase: ../../lib/supabase → @/lib/supabase

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TOOLS = [
  { id:"video_creator",    icon:"🎬", label:"Video Creator",    sub:"A–Z long video package" },
  { id:"title_lab",        icon:"🎯", label:"Title Lab",        sub:"Titles, hooks, thumbnail package" },
  { id:"market_intel",     icon:"📈", label:"Market Intel",     sub:"Niche gaps and opportunities" },
  { id:"competitor_xray",  icon:"🕵️", label:"Competitor X-Ray", sub:"Analyze public YouTube links" },
  { id:"shorts_factory",   icon:"⚡", label:"Shorts Factory",   sub:"Short-form video package" },
  { id:"channel_doctor",   icon:"🏥", label:"Channel Doctor",   sub:"Audit channel direction" },
  { id:"content_calendar", icon:"🗓️", label:"Content Calendar", sub:"30-day plan" },
  { id:"upcoming_video",   icon:"🚀", label:"Upcoming Video",   sub:"Analyze 1–5 old videos and suggest next" },
];

const LIMITS = {
  topic:220, keywords:350, audience:180, niche:220, existing_title:160,
  global_prompt:1400, tool_prompt:1200, spy_input:300,
  previous_links:1800, channel_notes:1200, refine_instruction:700,
};

const INITIAL_FORM = {
  topic:"", keywords:"", audience:"", niche:"", existing_title:"",
  spy_input:"", previous_links:"", channel_notes:"",
  language:"", global_prompt:"", duration:"medium",
};

const safeParse = (key, defaultVal) => {
  try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : defaultVal; }
  catch { return defaultVal; }
};

function safeText(val) {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

function getCharTone(value, max) {
  const n = String(value || "").length;
  if (n > max) return "danger";
  if (n >= max * 0.8) return "warn";
  return "ok";
}

function pretty(value) {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function useCopy() {
  const [copied, setCopied] = useState("");
  const copy = async (text, id) => {
    await navigator.clipboard.writeText(String(text || ""));
    setCopied(id);
    setTimeout(() => setCopied(""), 1800);
  };
  return { copied, copy };
}

async function callAutotubeJSON(tool, input) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/autotube`, {
    method:"POST",
    headers:{ "Content-Type":"application/json", apikey:SUPABASE_ANON_KEY, Authorization:`Bearer ${SUPABASE_ANON_KEY}` },
    body:JSON.stringify({ tool, input }),
  });
  const data = await res.json();
  if (!data?.ok) throw new Error(data?.error || "Generation failed.");
  return data;
}

async function callAutotubeStream(tool, input, handlers) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/autotube`, {
    method:"POST",
    headers:{ "Content-Type":"application/json", apikey:SUPABASE_ANON_KEY, Authorization:`Bearer ${SUPABASE_ANON_KEY}` },
    body:JSON.stringify({ tool, input:{ ...input, stream:true } }),
  });
  if (!res.ok || !res.body) {
    let errorText = "Generation failed.";
    try { const data = await res.json(); errorText = data?.error || errorText; } catch {}
    throw new Error(errorText);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "", accumulated = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream:true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";
    for (const part of parts) {
      const line = part.split("\n").find(v => v.startsWith("data: "));
      if (!line) continue;
      const payload = line.replace(/^data:\s*/, "");
      if (payload === "[DONE]") continue;
      let parsed;
      try { parsed = JSON.parse(payload); } catch { continue; }
      if (parsed.type === "status") handlers.onStatus?.(parsed.message || "");
      if (parsed.type === "meta") handlers.onMeta?.(parsed.meta || null);
      if (parsed.type === "delta") { accumulated += parsed.text || ""; handlers.onDelta?.(accumulated); }
      if (parsed.type === "result") handlers.onResult?.(parsed.result || null, parsed.meta || null);
      if (parsed.type === "error") throw new Error(parsed.error || "Generation failed.");
    }
  }
}

function Field({ label, value, onChange, max, textarea, placeholder, hint, error }) {
  return (
    <div className="ats-field">
      <div className="ats-field__top">
        <label className="ats-label">{label}</label>
        {max ? <span className={`ats-counter ${getCharTone(value, max)}`}>{String(value || "").length}/{max}</span> : null}
      </div>
      {textarea
        ? <textarea className={`ats-input ats-textarea ${error ? "error" : ""}`} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>
        : <input className={`ats-input ${error ? "error" : ""}`} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>
      }
      {error ? <div className="ats-field__error">{error}</div> : hint ? <div className="ats-field__hint">{hint}</div> : null}
    </div>
  );
}

function Card({ title, subtitle, action, loading, children }) {
  return (
    <section className="ats-card">
      <div className="ats-card__header">
        <div>
          <h3>{title}</h3>
          {subtitle ? <div className="ats-card__sub">{subtitle}</div> : null}
        </div>
        {action}
      </div>
      {loading ? <div className="ats-card__skeleton"/> : children}
    </section>
  );
}

function CopyButton({ text, copyId, copied, copy }) {
  return <button className="ats-mini-btn" onClick={() => copy(text, copyId)}>{copied === copyId ? "Copied" : "Copy"}</button>;
}

function TitleRow({ title, index, copied, copy }) {
  const safeStr = safeText(title);
  return (
    <div className="ats-title-row">
      <div className="ats-title-text">{safeStr}</div>
      <div className="ats-title-actions">
        <span className={`ats-mini-badge ${safeStr.length > 70 ? "danger" : "ok"}`}>{safeStr.length}c</span>
        <CopyButton text={safeStr} copyId={`title-${index}`} copied={copied} copy={copy}/>
      </div>
    </div>
  );
}

function buildPayload(activeTool, form, toolPrompt) {
  const base = { language:form.language, global_prompt:form.global_prompt, tool_prompt:toolPrompt };
  switch (activeTool) {
    case "video_creator":    return { ...base, topic:form.topic, keywords:form.keywords, audience:form.audience, spy_input:form.spy_input, duration:form.duration };
    case "title_lab":        return { ...base, topic:form.topic, existing_title:form.existing_title, keywords:form.keywords, audience:form.audience, spy_input:form.spy_input };
    case "market_intel":     return { ...base, niche:form.niche, audience:form.audience };
    case "competitor_xray":  return { ...base, spy_input:form.spy_input };
    case "shorts_factory":   return { ...base, topic:form.topic, keywords:form.keywords, audience:form.audience, spy_input:form.spy_input };
    case "channel_doctor":   return { ...base, spy_input:form.spy_input, channel_notes:form.channel_notes };
    case "content_calendar": return { ...base, niche:form.niche, audience:form.audience };
    case "upcoming_video":   return { ...base, topic:form.topic, audience:form.audience, previous_links:form.previous_links };
    default: return base;
  }
}

function validate(activeTool, form, toolPrompt) {
  const errors = {};
  const check = (field, label) => {
    if (String(form[field] || "").length > LIMITS[field]) errors[field] = `${label} is too long. Max ${LIMITS[field]} characters.`;
  };
  [["topic","Topic"],["keywords","Keywords"],["audience","Audience"],["niche","Niche"],["existing_title","Existing title"],["spy_input","YouTube link"],["previous_links","Previous video links"],["channel_notes","Channel notes"],["global_prompt","Global instruction"]].forEach(([k, l]) => check(k, l));
  if (String(toolPrompt || "").length > LIMITS.tool_prompt) errors.tool_prompt = `Tool instruction is too long. Max ${LIMITS.tool_prompt} characters.`;
  if (["video_creator","shorts_factory"].includes(activeTool) && !form.topic.trim()) errors.topic = "Topic is required.";
  if (activeTool === "title_lab" && !form.topic.trim() && !form.existing_title.trim() && !form.spy_input.trim()) errors.topic = "Enter a topic, an existing title, or a YouTube video link.";
  if (["market_intel","content_calendar"].includes(activeTool) && !form.niche.trim()) errors.niche = "Niche is required.";
  if (activeTool === "competitor_xray" && !form.spy_input.trim()) errors.spy_input = "Paste a public YouTube video or channel link.";
  if (activeTool === "channel_doctor" && !form.spy_input.trim()) errors.spy_input = "Paste a public YouTube channel link.";
  if (activeTool === "upcoming_video") {
    const lines = String(form.previous_links || "").split(/\n+/).map(v => v.trim()).filter(Boolean);
    if (!lines.length) errors.previous_links = "Paste 1 to 5 previous YouTube video links.";
    if (lines.length > 5) errors.previous_links = "Maximum 5 video links allowed.";
  }
  return errors;
}

export default function AutoTubeStudio() {
  const router = useRouter(); // ← replaces useNavigate
  const resultRef = useRef(null);
  const { copied, copy } = useCopy();

  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTool,  setActiveTool]  = useState(() => localStorage.getItem("ats_activeTool") || "video_creator");
  const [form,        setForm]        = useState(() => safeParse("ats_form", INITIAL_FORM));
  const [toolPrompts, setToolPrompts] = useState(() => safeParse("ats_toolPrompts", {}));
  const [result,      setResult]      = useState(() => safeParse("ats_result", null));
  const [meta,        setMeta]        = useState(() => safeParse("ats_meta", null));
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const [streamPreview, setStreamPreview] = useState("");
  const [streamStatus,  setStreamStatus]  = useState("");
  const [error,       setError]       = useState("");
  const [history,     setHistory]     = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [savingName,  setSavingName]  = useState("");
  const [refineState, setRefineState] = useState({ open:"", instruction:"", tone:"same", length:"same", error:"" });
  const [refiningKey, setRefiningKey] = useState("");

  const activeMeta        = useMemo(() => TOOLS.find(item => item.id === activeTool), [activeTool]);
  const currentToolPrompt = toolPrompts[activeTool] || "";

  useEffect(() => {
    localStorage.setItem("ats_activeTool", activeTool);
    localStorage.setItem("ats_form", JSON.stringify(form));
    localStorage.setItem("ats_toolPrompts", JSON.stringify(toolPrompts));
    if (result) localStorage.setItem("ats_result", JSON.stringify(result));
    else localStorage.removeItem("ats_result");
    if (meta) localStorage.setItem("ats_meta", JSON.stringify(meta));
    else localStorage.removeItem("ats_meta");
  }, [activeTool, form, result, meta, toolPrompts]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.push("/login?redirect=/user/AutoTubeStudio"); // ← router.push
        return;
      }
      setUser(data.user);
      setAuthLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadHistory = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.rpc("autotube_get_history", { p_user_id:user.id });
    setHistory(data || []);
  }, [user]);

  useEffect(() => { if (user) loadHistory(); }, [user, loadHistory]);

  const clearSession = () => {
    if (window.confirm("Are you sure you want to clear your current session data?")) {
      setForm(INITIAL_FORM); setResult(null); setMeta(null); setError(""); setErrors({});
    }
  };

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]:value }));
    setErrors(prev => ({ ...prev, [key]:"" }));
  };

  const handleGenerate = async () => {
    const nextErrors = validate(activeTool, form, currentToolPrompt);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setError(Object.values(nextErrors)[0]); return; }
    try {
      setLoading(true); setError(""); setResult(null); setMeta(null); setStreamPreview(""); setStreamStatus("Preparing request...");
      const payload = buildPayload(activeTool, form, currentToolPrompt);
      await callAutotubeStream(activeTool, payload, {
        onStatus: msg => setStreamStatus(msg),
        onMeta: m => setMeta(m),
        onDelta: text => setStreamPreview(text),
        onResult: (finalResult, finalMeta) => { setResult(finalResult); if (finalMeta) setMeta(finalMeta); },
      });
      setSavingName(`${activeMeta.label} — ${form.topic || form.niche || form.spy_input || "Result"}`);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
    } catch (e) {
      setError(e.message || "Generation failed.");
    } finally {
      setLoading(false); setStreamStatus("");
    }
  };

  const handleSave = async () => {
    if (!user || !result) return;
    setSaving(true);
    await supabase.rpc("autotube_save_history", {
      p_user_id:user.id, p_name:savingName || `${activeMeta.label} result`,
      p_tool:activeTool, p_input:buildPayload(activeTool, form, currentToolPrompt), p_output:{ result, meta },
    });
    await loadHistory();
    setSaving(false);
  };

  const openRefine = key => setRefineState({ open:key, instruction:"", tone:"same", length:"same", error:"" });

  const handleRefine = async (sectionKey, currentContent) => {
    if (String(refineState.instruction || "").length > LIMITS.refine_instruction) {
      setRefineState(prev => ({ ...prev, error:`Refine instruction is too long. Max ${LIMITS.refine_instruction} characters.` }));
      return;
    }
    try {
      setRefiningKey(sectionKey);
      const data = await callAutotubeJSON("refine_section", {
        section_key:sectionKey, current_content:currentContent,
        instruction:refineState.instruction, tone:refineState.tone, length:refineState.length,
        language:form.language, global_prompt:form.global_prompt, tool_prompt:currentToolPrompt,
      });
      let refined = data.result?.refined_content;
      if (refined !== null && typeof refined === "object" && !Array.isArray(refined) && refined[sectionKey]) refined = refined[sectionKey];
      setResult(prev => ({ ...prev, [sectionKey]:refined }));
      setRefineState({ open:"", instruction:"", tone:"same", length:"same", error:"" });
    } catch (e) {
      setRefineState(prev => ({ ...prev, error:e.message || "Refine failed." }));
    } finally {
      setRefiningKey("");
    }
  };

  const renderRefine = (key, currentContent) => {
    if (refineState.open !== key) return null;
    return (
      <div className="ats-refine-panel">
        <Field label="Refine instruction" value={refineState.instruction} onChange={v => setRefineState(prev => ({ ...prev, instruction:v, error:"" }))} max={LIMITS.refine_instruction} textarea placeholder="Example: make simpler for seniors, shorter, stronger for CTR, more natural" error={refineState.error}/>
        <div className="ats-refine-grid">
          <div>
            <div className="ats-label">Tone</div>
            <select className="ats-select" value={refineState.tone} onChange={e => setRefineState(prev => ({ ...prev, tone:e.target.value }))}>
              <option value="same">Same</option><option value="simple">Simple</option><option value="professional">Professional</option><option value="engaging">Engaging</option><option value="aggressive">Aggressive</option>
            </select>
          </div>
          <div>
            <div className="ats-label">Length</div>
            <select className="ats-select" value={refineState.length} onChange={e => setRefineState(prev => ({ ...prev, length:e.target.value }))}>
              <option value="same">Same</option><option value="shorter">Shorter</option><option value="longer">Longer</option>
            </select>
          </div>
        </div>
        <div className="ats-refine-actions">
          <button className="ats-btn ats-btn--ghost" onClick={() => setRefineState({ open:"", instruction:"", tone:"same", length:"same", error:"" })}>Cancel</button>
          <button className="ats-btn ats-btn--primary" disabled={refiningKey === key} onClick={() => handleRefine(key, currentContent)}>{refiningKey === key ? "Refining..." : "Refine section"}</button>
        </div>
      </div>
    );
  };

  const renderForm = () => (
    <>
      <div className="ats-form-grid">
        {["video_creator","title_lab","shorts_factory","upcoming_video"].includes(activeTool) && <Field label="Topic" value={form.topic} onChange={v => setField("topic", v)} max={LIMITS.topic} placeholder="Example: 3 reasons FCU is not cooling" error={errors.topic}/>}
        {["video_creator","title_lab","shorts_factory"].includes(activeTool) && <Field label="Keywords" value={form.keywords} onChange={v => setField("keywords", v)} max={LIMITS.keywords} placeholder="Comma-separated keywords" error={errors.keywords}/>}
        {["video_creator","title_lab","market_intel","shorts_factory","content_calendar","upcoming_video"].includes(activeTool) && <Field label="Audience" value={form.audience} onChange={v => setField("audience", v)} max={LIMITS.audience} placeholder="students, beginners, seniors, engineers..." error={errors.audience}/>}
        {activeTool === "video_creator" && (
          <div className="ats-field">
            <div className="ats-field__top"><label className="ats-label">Video Duration</label></div>
            <select className="ats-select" value={form.duration} onChange={e => setField("duration", e.target.value)}>
              <option value="short">Short (3–5 min)</option><option value="medium">Medium (6–10 min)</option><option value="long">Long (10–20 min)</option><option value="custom">Custom (follow prompt)</option>
            </select>
            <div className="ats-field__hint">This affects timestamps, script depth, voice-over length, and pacing.</div>
          </div>
        )}
        {["market_intel","content_calendar"].includes(activeTool) && <Field label="Niche" value={form.niche} onChange={v => setField("niche", v)} max={LIMITS.niche} placeholder="Example: HVAC troubleshooting in Urdu" error={errors.niche}/>}
        {activeTool === "title_lab" && <Field label="Existing Title" value={form.existing_title} onChange={v => setField("existing_title", v)} max={LIMITS.existing_title} placeholder="Optional: paste your current title" error={errors.existing_title}/>}
        {["video_creator","title_lab","shorts_factory"].includes(activeTool) && <Field label="Reference Video Link" value={form.spy_input} onChange={v => setField("spy_input", v)} max={LIMITS.spy_input} placeholder="Paste a public YouTube video link to spy from it" error={errors.spy_input} hint="The system will analyze that video and create a better/original package inspired by it."/>}
        {activeTool === "competitor_xray" && <Field label="Competitor Video or Channel Link" value={form.spy_input} onChange={v => setField("spy_input", v)} max={LIMITS.spy_input} placeholder="Paste a public YouTube video or channel link" error={errors.spy_input} hint="Uses real YouTube API context."/>}
        {activeTool === "channel_doctor" && <>
          <Field label="Channel Link" value={form.spy_input} onChange={v => setField("spy_input", v)} max={LIMITS.spy_input} placeholder="Paste a public YouTube channel link" error={errors.spy_input}/>
          <Field label="Channel Notes" value={form.channel_notes} onChange={v => setField("channel_notes", v)} max={LIMITS.channel_notes} textarea placeholder="Optional: low views, weak thumbnails, niche confusion, etc." error={errors.channel_notes}/>
        </>}
        {activeTool === "upcoming_video" && <Field label="Previous Video Links (1 to 5)" value={form.previous_links} onChange={v => setField("previous_links", v)} max={LIMITS.previous_links} textarea placeholder="Paste one YouTube video link per line" error={errors.previous_links} hint="You can paste winners, failures, or a mix. The tool will compare them and suggest the next move."/>}
        <Field label="Output Language" value={form.language} onChange={v => setField("language", v)} placeholder="Optional: Urdu, English, Arabic..."/>
        <Field label="Global Instruction" value={form.global_prompt} onChange={v => setField("global_prompt", v)} max={LIMITS.global_prompt} textarea placeholder="Applies to every generation. Example: simple words for seniors, natural tone, no slang." error={errors.global_prompt}/>
        <Field label="Tool Instruction" value={currentToolPrompt} onChange={v => { setToolPrompts(prev => ({ ...prev, [activeTool]:v })); setErrors(prev => ({ ...prev, tool_prompt:"" })); }} max={LIMITS.tool_prompt} textarea placeholder="Saved per tool. Example: titles under 60 chars, timestamps required, natural Urdu voice-over." error={errors.tool_prompt}/>
      </div>
      <div className="ats-actions">
        <button className="ats-btn ats-btn--primary" disabled={loading} onClick={handleGenerate}>{loading ? "Generating..." : `Generate ${activeMeta.label}`}</button>
        <button className="ats-btn ats-btn--ghost" disabled={!result || saving} onClick={handleSave}>{saving ? "Saving..." : "Save result"}</button>
      </div>
      {error ? <div className="ats-banner ats-banner--error">{error}</div> : null}
    </>
  );

  const renderArrayTextCard = (key, label) => {
    if (!Array.isArray(result?.[key]) || !result[key].length) return null;
    return (
      <Card key={key} title={label}>
        <div className="ats-stack-sm">
          {result[key].map((item, i) => <pre className="ats-note ats-prewrap" key={i}>{typeof item === "string" ? item : JSON.stringify(item, null, 2)}</pre>)}
        </div>
      </Card>
    );
  };

  const renderResult = () => {
    if (!result) return null;
    const cards = [];

    if (meta?.youtube_context_used) cards.push(<Card key="yt" title="Real YouTube Context Used" subtitle="This output used live YouTube API data."><pre className="ats-pre">{safeText(meta.youtube_context_summary)}</pre></Card>);

    if (Array.isArray(result.titles)) {
      cards.push(
        <Card key="titles" title="Titles" subtitle={result.recommended_title ? `Recommended: ${safeText(result.recommended_title)}` : ""} action={<button className="ats-mini-btn" onClick={() => openRefine("titles")}>Refine</button>} loading={refiningKey === "titles"}>
          <div className="ats-stack-sm">{result.titles.map((title, index) => <TitleRow key={index} title={title} index={index} copied={copied} copy={copy}/>)}</div>
          {renderRefine("titles", result.titles)}
        </Card>
      );
    }

    if (Array.isArray(result.title_analysis)) {
      cards.push(<Card key="title-analysis" title="Title Analysis"><div className="ats-stack-sm">{result.title_analysis.map((item, index) => <div key={index} className="ats-note"><strong>{safeText(item.title)}</strong><div><span className="ats-text-muted">Strength:</span> {safeText(item.strength)}</div><div><span className="ats-text-muted">Why:</span> {safeText(item.why)}</div></div>)}</div></Card>);
    }

    if (Array.isArray(result.thumbnail_texts) || result.thumbnail_idea || Array.isArray(result.thumbnail_prompts)) {
      cards.push(
        <Card key="thumb" title="Thumbnail Package" subtitle="Includes idea + image prompts for ChatGPT / Gemini / Meta AI" action={<button className="ats-mini-btn" onClick={() => openRefine("thumbnail_texts")}>Refine</button>} loading={refiningKey === "thumbnail_texts"}>
          {Array.isArray(result.thumbnail_texts) ? <div><div className="ats-section-title">Text Options</div><div className="ats-tags">{result.thumbnail_texts.map((t, i) => <span className="ats-tag" key={i}>{safeText(t)}</span>)}</div></div> : null}
          {result.thumbnail_idea ? <div className="ats-note"><strong>Thumbnail Idea</strong><pre className="ats-pre">{safeText(result.thumbnail_idea)}</pre></div> : null}
          {Array.isArray(result.thumbnail_prompts) ? <div className="ats-stack-sm">{result.thumbnail_prompts.map((item, i) => <div className="ats-note" key={i}><strong>{item.tool ? safeText(item.tool) : `Prompt ${i + 1}`}</strong><pre className="ats-pre">{item.prompt ? safeText(item.prompt) : pretty(item)}</pre></div>)}</div> : null}
          {renderRefine("thumbnail_texts", { thumbnail_texts:result.thumbnail_texts, thumbnail_idea:result.thumbnail_idea, thumbnail_prompts:result.thumbnail_prompts })}
        </Card>
      );
    }

    if (result.hook || Array.isArray(result.hook_options)) {
      cards.push(<Card key="hook" title="Hooks">{Array.isArray(result.hook_options) ? <div className="ats-stack-sm">{result.hook_options.map((item, i) => <div className="ats-note" key={i}>{safeText(item)}</div>)}</div> : <div className="ats-note">{safeText(result.hook)}</div>}</Card>);
    }

    if (result.voice_over_full || Array.isArray(result.voice_over_scenes) || Array.isArray(result.delivery_notes)) {
      cards.push(
        <Card key="voice" title="Complete Voice-over Package" subtitle="Script, scene narration, delivery notes, and cues" action={<button className="ats-mini-btn" onClick={() => openRefine("voice_over_full")}>Refine</button>} loading={refiningKey === "voice_over_full"}>
          {result.voice_over_full ? <div className="ats-note"><strong>Master Voice-over</strong><pre className="ats-pre">{safeText(result.voice_over_full)}</pre></div> : null}
          {Array.isArray(result.voice_over_scenes) ? result.voice_over_scenes.map((scene, i) => <div className="ats-note" key={i}><strong>{scene.scene ? safeText(scene.scene) : `Scene ${i + 1}`}</strong><div className="ats-stack-sm" style={{marginTop:"10px"}}>{scene.narration && <div><strong className="ats-text-muted">Narration: </strong><span className="ats-prewrap">{safeText(scene.narration)}</span></div>}{scene.visual && <div><strong className="ats-text-muted">Visual: </strong><span className="ats-prewrap">{safeText(scene.visual)}</span></div>}{scene.pace && <div><strong className="ats-text-muted">Pace: </strong><span>{safeText(scene.pace)}</span></div>}</div></div>) : null}
          {Array.isArray(result.delivery_notes) ? <div className="ats-stack-sm">{result.delivery_notes.map((item, i) => <div className="ats-note" key={i}>{safeText(item)}</div>)}</div> : null}
          {renderRefine("voice_over_full", result.voice_over_full || result.voice_over_scenes)}
        </Card>
      );
    }

    if (result.intro || Array.isArray(result.script_sections) || result.outro) {
      cards.push(
        <Card key="script" title="Script Package" action={<button className="ats-mini-btn" onClick={() => openRefine("script_sections")}>Refine</button>} loading={refiningKey === "script_sections"}>
          {result.intro ? <div className="ats-note"><strong>Intro</strong><pre className="ats-pre">{safeText(result.intro)}</pre></div> : null}
          {Array.isArray(result.script_sections) ? result.script_sections.map((section, i) => <div className="ats-note" key={i}><strong>{section.heading ? safeText(section.heading) : `Section ${i + 1}`}</strong><pre className="ats-pre">{safeText(section.content)}</pre></div>) : null}
          {result.outro ? <div className="ats-note"><strong>Outro</strong><pre className="ats-pre">{safeText(result.outro)}</pre></div> : null}
          {renderRefine("script_sections", result.script_sections)}
        </Card>
      );
    }

    if (Array.isArray(result.timestamps)) {
      cards.push(<Card key="timestamps" title="Timestamps / Chapters"><div className="ats-stack-sm">{result.timestamps.map((item, i) => <div className="ats-time-row" key={i}><span>{safeText(item.time)}</span><strong>{safeText(item.title)}</strong></div>)}</div></Card>);
    }

    if (result.description || result.caption) {
      const text = result.description || result.caption;
      cards.push(
        <Card key="desc" title="Description / Caption" action={<button className="ats-mini-btn" onClick={() => openRefine(result.description ? "description" : "caption")}>Refine</button>} loading={refiningKey === "description" || refiningKey === "caption"}>
          <pre className="ats-pre">{safeText(text)}</pre>
          {renderRefine(result.description ? "description" : "caption", text)}
        </Card>
      );
    }

    if (Array.isArray(result.subtitle_srt)) cards.push(<Card key="srt" title="Subtitle / SRT Pack" subtitle="Ready subtitles with time blocks"><pre className="ats-pre">{result.subtitle_srt.map(safeText).join("\n\n")}</pre></Card>);

    if (result.playlist_recommendation || result.end_screen_recommendation) {
      cards.push(<Card key="playlist" title="Playlist + End Screen Strategy">{result.playlist_recommendation ? <div className="ats-note"><strong>Playlist Recommendation</strong><pre className="ats-pre">{safeText(result.playlist_recommendation)}</pre></div> : null}{result.end_screen_recommendation ? <div className="ats-note"><strong>End Screen Recommendation</strong><pre className="ats-pre">{safeText(result.end_screen_recommendation)}</pre></div> : null}</Card>);
    }

    if (result.best_upload_time || Array.isArray(result.upload_time_options)) {
      cards.push(<Card key="upload-time" title="Best Upload Time">{result.best_upload_time ? <div className="ats-note"><pre className="ats-pre">{safeText(result.best_upload_time)}</pre></div> : null}{Array.isArray(result.upload_time_options) ? <div className="ats-stack-sm">{result.upload_time_options.map((item, i) => <div className="ats-note" key={i}>{safeText(item)}</div>)}</div> : null}</Card>);
    }

    if (Array.isArray(result.upload_checklist)) {
      cards.push(<Card key="checklist" title="Upload Checklist" subtitle="Interactive tick list"><div className="ats-checklist">{result.upload_checklist.map((item, i) => <label className="ats-check-item" key={i}><input type="checkbox" defaultChecked={!!item.done}/><span>{typeof item === "string" ? item : safeText(item.label)}</span></label>)}</div></Card>);
    }

    if (Array.isArray(result.tags) || Array.isArray(result.hashtags)) {
      cards.push(<Card key="meta" title="Metadata Pack">{Array.isArray(result.tags) ? <div><div className="ats-section-title">Tags</div><div className="ats-tags">{result.tags.map((tag, i) => <span className="ats-tag muted" key={i}>{safeText(tag)}</span>)}</div></div> : null}{Array.isArray(result.hashtags) ? <div><div className="ats-section-title">Hashtags</div><div className="ats-tags">{result.hashtags.map((tag, i) => <span className="ats-tag" key={i}>{safeText(tag)}</span>)}</div></div> : null}</Card>);
    }

    [["market_summary","Market Summary"],["summary","Summary"],["competitor_profile","Competitor Profile"],["posting_strategy","Posting Strategy"],["niche_analysis","Niche Analysis"],["target_audience_note","Audience Note"],["channel_positioning","Channel Positioning"],["next_video_idea","Next Video Idea"],["success_failure_summary","Success vs Failure Summary"],["success_reasoning","Likely Success Reasons"],["failure_reasoning","Likely Failure Reasons"],["cta","CTA"],["pinned_comment","Pinned Comment"]].forEach(([key, label]) => {
      if (result[key]) cards.push(<Card key={key} title={label}><pre className="ats-pre">{safeText(result[key])}</pre></Card>);
    });

    [["opportunities","Opportunities"],["content_pillars","Content Pillars"],["trend_opportunities","Trend Opportunities"],["video_ideas","Video Ideas"],["winning_patterns","Winning Patterns"],["avoid_patterns","Avoid Patterns"],["title_patterns","Title Patterns"],["topic_gaps","Topic Gaps"],["packaging_notes","Packaging Notes"],["action_plan","Action Plan"],["shot_plan","Shot Plan"],["broll_cues","B-roll Cues"],["on_screen_text","On-screen Text"],["whats_working","What is Working"],["what_to_fix","What to Fix"],["action_items","Action Items"],["keyword_gaps","Keyword Gaps"],["growth_tips","Growth Tips"],["watchouts","Watchouts"],["next_video_options","Next Video Options"]].forEach(([key, label]) => {
      const card = renderArrayTextCard(key, label); if (card) cards.push(card);
    });

    if (Array.isArray(result.days)) {
      cards.push(<Card key="days" title="30-Day Calendar"><div className="ats-calendar-grid">{result.days.map((day, idx) => <div key={day.day || idx} className="ats-day-card"><div className="ats-day-card__day">Day {safeText(day.day)}</div><div className="ats-day-card__title">{safeText(day.title)}</div><div className="ats-day-card__meta">{safeText(day.format)} · {safeText(day.focus_keyword)}</div><div className="ats-day-card__hook">{safeText(day.hook)}</div><div className="ats-day-card__time">Best time: {safeText(day.best_time)}</div></div>)}</div></Card>);
    }

    if (result.seo_score || result.overall_score || result.score_breakdown || result.seo_breakdown) {
      cards.push(
        <Card key="score" title="Computed Scores" subtitle="Scored from structure checks + context.">
          {result.seo_score ? <div className="ats-score">SEO Score: <strong>{safeText(result.seo_score)}/100</strong></div> : null}
          {result.overall_score ? <div className="ats-score">Overall Score: <strong>{safeText(result.overall_score)}/100</strong></div> : null}
          {result.channel_grade ? <div className="ats-score">Grade: <strong>{safeText(result.channel_grade)}</strong></div> : null}
          {result.seo_breakdown ? <div className="ats-note" style={{marginTop:"10px"}}><strong>SEO Breakdown</strong><div className="ats-stack-sm" style={{marginTop:"8px"}}>{Object.entries(result.seo_breakdown).map(([k, v]) => <div key={k}><strong className="ats-text-muted">{safeText(k.replace(/_/g," "))}:</strong> {safeText(v)}</div>)}</div></div> : null}
          {result.score_breakdown ? <div className="ats-note" style={{marginTop:"10px"}}><strong>Score Breakdown</strong><div className="ats-stack-sm" style={{marginTop:"8px"}}>{Object.entries(result.score_breakdown).map(([k, v]) => <div key={k}><strong className="ats-text-muted">{safeText(k.replace(/_/g," "))}:</strong> {safeText(v)}</div>)}</div></div> : null}
        </Card>
      );
    }

    return cards;
  };

  if (authLoading) return <><style>{CSS}</style><div className="ats-loading-screen">Loading AutoTube Studio...</div></>;

  return (
    <div className="ats-page-shell">
      <style>{CSS}</style>

      <header className="ats-topbar">
        <div>
          <div className="ats-brand">🎬 AutoTube Studio</div>
          <div className="ats-topbar__sub">Real YouTube API analysis, streaming generation, complete voice-over package, subtitle/SRT pack, thumbnail prompts, timestamps, upload timing, playlist and end-screen recommendations.</div>
        </div>
        <div className="ats-topbar__actions">
          <button className="ats-btn ats-btn--ghost" onClick={clearSession}>Clear Session</button>
          <button className="ats-btn ats-btn--ghost" onClick={() => setShowHistory(v => !v)}>{showHistory ? "Hide history" : `History (${history.length})`}</button>
          {/* ← Link href replaces Link to */}
          <Link className="ats-btn ats-btn--ghost" href="/user/autotube">Back</Link>
        </div>
      </header>

      <div className="ats-layout">
        <aside className="ats-sidebar">
          {TOOLS.map(tool => (
            <button key={tool.id} className={`ats-tool ${activeTool === tool.id ? "active" : ""}`}
              onClick={() => { setActiveTool(tool.id); setError(""); setResult(null); setMeta(null); setStreamPreview(""); setStreamStatus(""); }}>
              <span className="ats-tool__icon">{tool.icon}</span>
              <span><strong>{tool.label}</strong><small>{tool.sub}</small></span>
            </button>
          ))}
        </aside>

        <main className="ats-main">
          {showHistory ? (
            <Card title="Saved History" subtitle="Load previous output.">
              <div className="ats-stack-sm">
                {history.length ? history.map(item => (
                  <div key={item.id} className="ats-history-item">
                    <div><strong>{item.name}</strong><div>{new Date(item.created_at).toLocaleString()}</div></div>
                    <button className="ats-mini-btn" onClick={() => { setActiveTool(item.tool); setResult(item.output?.result || item.output); setMeta(item.output?.meta || null); setShowHistory(false); }}>Load</button>
                  </div>
                )) : <div className="ats-note">No saved results yet.</div>}
              </div>
            </Card>
          ) : null}

          <Card title={activeMeta.label} subtitle={activeMeta.sub}>{renderForm()}</Card>

          {loading ? (
            <Card title="Streaming Generation" subtitle={streamStatus || "Generating... please wait"}>
              <div className="ats-stream-box">
                <div className="ats-stream-status">{streamStatus || "Generating..."}</div>
                <pre className="ats-stream-preview">{streamPreview || "Waiting for streamed content..."}</pre>
              </div>
            </Card>
          ) : null}

          <div ref={resultRef} className="ats-stack-lg">{renderResult()}</div>
        </main>
      </div>
    </div>
  );
}

// ── CSS inlined from AutoTubeStudio.css (identical to original) ───────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
:root{color-scheme:light;--ats-bg:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 60%,#e8f4fd 100%);--ats-card:rgba(255,255,255,0.94);--ats-border:rgba(11,20,55,0.08);--ats-text:#0b1437;--ats-muted:#64748b;--ats-blue:#2563eb;--ats-blue-dark:#1d4ed8;--ats-success:#16a34a;--ats-warn:#d97706;--ats-danger:#dc2626;--ats-shadow:0 8px 28px rgba(11,20,55,0.08);--ats-radius:20px;}
*,*::before,*::after{box-sizing:border-box;}
html,body,#root{min-height:100%;}
body{margin:0;font-family:'DM Sans',sans-serif;background:var(--ats-bg);color:var(--ats-text);}
button,input,textarea,select{font:inherit;}
pre{margin:0;}
.ats-text-muted{color:var(--ats-muted);text-transform:capitalize;}
.ats-loading-screen{min-height:100vh;display:grid;place-items:center;color:var(--ats-muted);font-weight:800;}
.ats-page-shell{max-width:1320px;margin:0 auto;padding:18px;}
.ats-topbar{display:flex;justify-content:space-between;gap:18px;align-items:center;background:var(--ats-card);border:1px solid var(--ats-border);border-radius:22px;padding:18px 20px;box-shadow:var(--ats-shadow);margin-bottom:18px;}
.ats-brand{font-size:24px;font-weight:900;}
.ats-topbar__sub{color:var(--ats-muted);font-size:13px;margin-top:4px;line-height:1.5;}
.ats-topbar__actions{display:flex;gap:10px;flex-wrap:wrap;}
.ats-layout{display:grid;grid-template-columns:280px minmax(0,1fr);gap:18px;}
.ats-sidebar{position:sticky;top:18px;align-self:start;display:flex;flex-direction:column;gap:10px;}
.ats-tool{display:flex;align-items:center;gap:12px;border:1px solid var(--ats-border);background:rgba(255,255,255,0.78);border-radius:16px;padding:12px;text-align:left;cursor:pointer;transition:0.18s ease;width:100%;}
.ats-tool:hover{transform:translateY(-1px);}
.ats-tool.active{border-color:rgba(37,99,235,0.34);background:rgba(37,99,235,0.08);box-shadow:0 8px 24px rgba(37,99,235,0.12);}
.ats-tool__icon{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;background:rgba(37,99,235,0.08);font-size:18px;flex-shrink:0;}
.ats-tool strong{display:block;font-size:14px;color:var(--ats-text);}
.ats-tool small{display:block;margin-top:2px;color:var(--ats-muted);font-size:12px;}
.ats-main{display:flex;flex-direction:column;gap:18px;min-width:0;}
.ats-card{background:var(--ats-card);border:1px solid var(--ats-border);border-radius:22px;padding:18px;box-shadow:var(--ats-shadow);}
.ats-card__header{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:14px;}
.ats-card__header h3{margin:0;font-size:19px;}
.ats-card__sub{margin-top:4px;color:var(--ats-muted);font-size:13px;}
.ats-card__skeleton{height:120px;border-radius:18px;background:linear-gradient(90deg,rgba(11,20,55,0.04),rgba(11,20,55,0.08),rgba(11,20,55,0.04));background-size:200% 100%;animation:atsShimmer 1.4s linear infinite;}
@keyframes atsShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.ats-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}
.ats-field{display:flex;flex-direction:column;gap:6px;min-width:0;}
.ats-field__top{display:flex;justify-content:space-between;gap:10px;align-items:center;}
.ats-label{font-size:11px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.06em;}
.ats-counter{font-size:11px;font-weight:700;}
.ats-counter.ok{color:var(--ats-muted)}.ats-counter.warn{color:#b45309}.ats-counter.danger{color:var(--ats-danger)}
.ats-input,.ats-select{width:100%;border:1.5px solid rgba(11,20,55,0.12);background:#fff;border-radius:14px;min-height:46px;padding:12px 14px;outline:none;transition:0.15s ease;color:var(--ats-text);}
.ats-input:focus,.ats-select:focus{border-color:#3b82f6;box-shadow:0 0 0 4px rgba(59,130,246,0.10);}
.ats-input.error,.ats-textarea.error{border-color:var(--ats-danger);}
.ats-textarea{min-height:120px;resize:vertical;}
.ats-field__hint,.ats-field__error{font-size:12px;}
.ats-field__hint{color:var(--ats-muted)}.ats-field__error{color:var(--ats-danger)}
.ats-actions,.ats-refine-actions{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;}
.ats-btn,.ats-mini-btn{border:none;border-radius:14px;cursor:pointer;transition:0.15s ease;}
.ats-btn{min-height:44px;padding:0 16px;font-weight:800;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;}
.ats-mini-btn{min-height:34px;padding:0 12px;font-size:12px;font-weight:800;background:rgba(11,20,55,0.05);color:#334155;}
.ats-btn--primary{background:linear-gradient(135deg,#0b1437,#1d4ed8);color:white;}
.ats-btn--ghost{background:rgba(11,20,55,0.05);color:#334155;border:1px solid rgba(11,20,55,0.08);}
.ats-banner{margin-top:14px;border-radius:16px;padding:12px 14px;font-size:14px;}
.ats-banner--error{color:#991b1b;background:#fef2f2;border:1px solid #fecaca;}
.ats-stack-sm,.ats-stack-lg{display:flex;flex-direction:column;gap:12px;}
.ats-stack-lg{gap:18px;}
.ats-title-row,.ats-time-row,.ats-history-item{display:flex;align-items:center;justify-content:space-between;gap:12px;background:rgba(11,20,55,0.03);border:1px solid rgba(11,20,55,0.06);border-radius:16px;padding:12px;}
.ats-title-text{font-weight:700;line-height:1.45;flex:1;}
.ats-title-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.ats-mini-badge{padding:4px 8px;border-radius:999px;font-size:11px;font-weight:800;background:rgba(11,20,55,0.06);}
.ats-mini-badge.ok{color:#0f766e}.ats-mini-badge.danger{color:var(--ats-danger)}
.ats-note{background:rgba(11,20,55,0.03);border:1px solid rgba(11,20,55,0.06);border-radius:16px;padding:12px;line-height:1.55;}
.ats-tags{display:flex;flex-wrap:wrap;gap:8px;}
.ats-tag{padding:8px 12px;border-radius:999px;background:rgba(37,99,235,0.10);border:1px solid rgba(37,99,235,0.16);color:#1d4ed8;font-size:13px;font-weight:700;}
.ats-tag.muted{background:rgba(11,20,55,0.04);border-color:rgba(11,20,55,0.08);color:#334155;}
.ats-score{font-size:16px;margin-bottom:8px;}
.ats-pre,.ats-prewrap{white-space:pre-wrap;word-break:break-word;font-family:'DM Sans',sans-serif;}
.ats-section-title{margin:8px 0;font-size:13px;font-weight:800;color:#475569;}
.ats-calendar-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}
.ats-day-card{border:1px solid rgba(11,20,55,0.08);border-radius:18px;padding:14px;background:rgba(11,20,55,0.03);}
.ats-day-card__day{font-size:12px;font-weight:800;color:var(--ats-muted);margin-bottom:8px;}
.ats-day-card__title{font-size:15px;font-weight:800;line-height:1.4;margin-bottom:8px;}
.ats-day-card__meta,.ats-day-card__time{color:#475569;font-size:13px;}
.ats-day-card__hook{margin:8px 0;font-size:13px;line-height:1.5;}
.ats-refine-panel{margin-top:12px;padding:14px;border-radius:18px;border:1px solid rgba(37,99,235,0.16);background:rgba(37,99,235,0.05);}
.ats-refine-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}
.ats-checklist{display:flex;flex-direction:column;gap:10px;}
.ats-check-item{display:flex;align-items:center;gap:10px;padding:12px;border-radius:14px;border:1px solid rgba(11,20,55,0.08);background:rgba(11,20,55,0.03);}
.ats-check-item input{width:16px;height:16px;}
.ats-stream-box{border:1px dashed rgba(37,99,235,0.24);background:rgba(37,99,235,0.04);border-radius:18px;padding:14px;}
.ats-stream-status{font-weight:800;color:#1d4ed8;margin-bottom:10px;}
.ats-stream-preview{max-height:420px;overflow:auto;white-space:pre-wrap;word-break:break-word;font-family:'DM Sans',sans-serif;line-height:1.55;color:#334155;}
@media(max-width:980px){.ats-layout{grid-template-columns:1fr}.ats-sidebar{position:static;display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.ats-form-grid,.ats-calendar-grid,.ats-refine-grid{grid-template-columns:1fr}}
@media(max-width:640px){.ats-page-shell{padding:12px}.ats-topbar{flex-direction:column;align-items:flex-start}.ats-sidebar{grid-template-columns:1fr}.ats-title-row,.ats-time-row,.ats-history-item{flex-direction:column;align-items:flex-start}}
`;