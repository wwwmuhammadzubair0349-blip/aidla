import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

/* ─── Styles (Mobile First) ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');

  :root {
    --navy:#0b1437;--royal:#1a3a8f;--sky:#3b82f6;
    --gold:#f59e0b;--gold-light:#fcd34d;--slate:#64748b;
    --light:#f0f4ff;--card-bg:rgba(255,255,255,0.97);
  }
  
  * { box-sizing: border-box; }

  .blogpost-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .bp-progress-bar {
    position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
    background: linear-gradient(90deg, var(--gold), var(--sky), var(--royal));
    transition: width 0.1s linear; border-radius: 0 2px 2px 0;
    box-shadow: 0 0 8px rgba(59,130,246,0.5);
  }

  /* Background Effects */
  .bp-orbs { position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
  .bp-orb-1 { position:absolute;width:600px;height:600px;border-radius:50%;background:rgba(59,130,246,0.06);filter:blur(80px);top:-200px;left:-200px; }
  .bp-orb-2 { position:absolute;width:500px;height:500px;border-radius:50%;background:rgba(245,158,11,0.05);filter:blur(80px);top:300px;right:-250px; }
  .bp-orb-3 { position:absolute;width:400px;height:400px;border-radius:50%;background:rgba(26,58,143,0.04);filter:blur(80px);bottom:100px;left:30%; }

  /* Base Mobile Container */
  .blogpost-container {
    flex: 1;
    width: 100%;
    max-width: 860px;
    margin: 0 auto;
    padding: 24px 16px 48px;
    position: relative;
    z-index: 2;
  }

  .bp-back {
    display: inline-flex; align-items: center; gap: 6px;
    color: var(--royal); font-size: 0.8rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em; text-decoration: none;
    background: rgba(59,130,246,0.08); padding: 8px 16px; border-radius: 30px;
    margin-bottom: 20px; transition: background 0.2s, transform 0.2s;
  }
  .bp-back:active { transform: scale(0.96); }

  .bp-article-card {
    background: var(--card-bg);
    border-radius: 16px;
    box-shadow: 0 8px 40px rgba(11,20,55,0.07);
    border: 1px solid rgba(59,130,246,0.08);
    overflow: hidden;
  }

  /* Cover */
  .bp-cover-wrap {
    width: 100%; aspect-ratio: 16/9; overflow: hidden;
    position: relative; background: linear-gradient(135deg, var(--navy), var(--royal));
  }
  .bp-cover-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 6s ease; }
  .bp-cover-wrap::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 55%, rgba(11,20,55,0.35) 100%); }
  .bp-cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
  
  .bp-cover-download {
    position: absolute; bottom: 12px; right: 12px; z-index: 3;
    background: rgba(255,255,255,0.92); color: var(--navy); border: none;
    border-radius: 30px; padding: 8px 14px; font-size: 0.75rem; font-weight: 800;
    cursor: pointer; display: flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15); transition: transform 0.2s, box-shadow 0.2s;
    backdrop-filter: blur(8px);
  }
  .bp-cover-download:active { transform: translateY(2px); }

  /* Content Body base mobile */
  .bp-body { padding: 20px 16px; }

  .bp-label { display: inline-block; background: linear-gradient(135deg, var(--gold), var(--gold-light)); color: var(--navy); padding: 5px 12px; border-radius: 30px; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(245,158,11,0.25); }
  .bp-readtime-badge { display: inline-flex; align-items: center; gap: 5px; background: rgba(16,185,129,0.1); color: #065f46; border: 1px solid rgba(16,185,129,0.25); padding: 5px 10px; border-radius: 30px; font-size: 0.7rem; font-weight: 800; margin-bottom: 12px; margin-left: 8px; }

  .bp-title { font-family: 'Playfair Display', serif; font-size: 1.65rem; font-weight: 900; color: var(--navy); line-height: 1.2; margin: 0 0 16px; word-break: break-word; }
  .bp-title.urdu { font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; text-align: right; line-height: 1.8; }

  /* Meta Info */
  .bp-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(59,130,246,0.1); }
  .bp-author { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; color: var(--navy); font-size: 0.85rem; }
  .bp-author-icon { background: rgba(59,130,246,0.1); color: var(--sky); border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; }
  .bp-date-pill { background: rgba(59,130,246,0.1); color: var(--royal); padding: 4px 10px; border-radius: 10px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
  .bp-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--slate); opacity: 0.4; }
  .bp-read-time { color: var(--slate); font-size: 0.75rem; font-weight: 600; }

  .bp-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .bp-tag { background: rgba(26,58,143,0.07); color: var(--royal); border: 1px solid rgba(26,58,143,0.15); padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }

  .bp-excerpt { font-size: 0.95rem; color: var(--royal); font-style: italic; line-height: 1.65; margin: 0 0 24px; padding: 16px; border-left: 3px solid var(--sky); background: rgba(59,130,246,0.04); border-radius: 0 12px 12px 0; }

  /* Table of Contents */
  .bp-toc { background: rgba(26,58,143,0.04); border: 1px solid rgba(26,58,143,0.1); border-radius: 16px; padding: 16px; margin-bottom: 24px; }
  .bp-toc-title { font-size: 0.8rem; font-weight: 800; color: var(--royal); text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px; display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; }
  .bp-toc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
  .bp-toc-item a { color: var(--slate); font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: color 0.15s; display: flex; align-items: center; gap: 6px; padding: 4px 0; touch-action: manipulation; }
  .bp-toc-item a::before { content: '#'; font-size: 0.7em; opacity: 0.35; font-weight: 900; }
  .bp-toc-item.h3 a { padding-left: 14px; font-size: 0.85rem; }
  .bp-toc-item.h4 a { padding-left: 28px; font-size: 0.8rem; }

  .bp-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent); margin: 24px 0; }

  /* Content Body */
  .bp-content { color: #2d3748; font-size: 1rem; line-height: 1.8; word-break: break-word; overflow-wrap: break-word; }
  .bp-content p { margin: 0 0 16px; }
  .bp-content h1 { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 900; color: var(--navy); margin: 28px 0 12px; line-height: 1.2; }
  .bp-content h2 { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 800; color: var(--navy); margin: 24px 0 10px; padding-bottom: 8px; border-bottom: 2px solid rgba(59,130,246,0.12); }
  .bp-content h3 { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 800; color: var(--navy); margin: 20px 0 8px; }
  .bp-content h4 { font-size: 1.05rem; font-weight: 700; color: var(--navy); margin: 18px 0 6px; }
  .bp-content h5, .bp-content h6 { font-size: 1rem; font-weight: 700; color: var(--slate); margin: 14px 0 4px; }
  .bp-content a { color: var(--sky); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .bp-content a[target="_blank"]::after { content: " ↗"; font-size: 0.75em; opacity: 0.7; font-weight: 400; }
  .bp-content img { max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0; box-shadow: 0 6px 24px rgba(11,20,55,0.1); display: block; }
  .bp-content ul, .bp-content ol { padding-left: 24px; margin: 0 0 16px; }
  .bp-content li { margin-bottom: 8px; line-height: 1.7; }
  .bp-content ul li::marker { color: var(--sky); }
  .bp-content ol li::marker { color: var(--royal); font-weight: 700; }
  .bp-content blockquote { margin: 20px 0; padding: 14px 16px; border-left: 4px solid var(--gold); background: rgba(245,158,11,0.05); border-radius: 0 12px 12px 0; font-style: italic; color: var(--slate); }
  .bp-content pre { background: var(--navy); color: #e2e8f0; padding: 16px; border-radius: 12px; overflow-x: auto; font-size: 0.85rem; line-height: 1.6; margin: 20px 0; -webkit-overflow-scrolling: touch; }
  .bp-content code { background: rgba(59,130,246,0.1); color: var(--royal); padding: 3px 6px; border-radius: 5px; font-size: 0.85em; font-family: 'Courier New', monospace; }
  .bp-content pre code { background: none; color: inherit; padding: 0; }
  .bp-content table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.9em; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(11,20,55,0.06); display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .bp-content th { background: var(--royal); color: #fff; padding: 12px; text-align: left; font-weight: 700; }
  .bp-content td { padding: 10px 12px; border-bottom: 1px solid rgba(59,130,246,0.08); color: #374151; white-space: nowrap; }
  .bp-content tr:last-child td { border-bottom: none; }
  .bp-content tr:nth-child(even) td { background: rgba(59,130,246,0.025); }
  .bp-content hr { border: none; border-top: 2px solid rgba(59,130,246,0.12); margin: 28px 0; }

  /* Engagement Bar */
  .bp-engage { display: flex; flex-direction: column; align-items: stretch; gap: 14px; padding: 20px 16px; border-top: 1px solid rgba(59,130,246,0.08); border-bottom: 1px solid rgba(59,130,246,0.08); background: rgba(59,130,246,0.02); }
  .bp-engage-label { font-size: 0.75rem; font-weight: 700; color: var(--slate); text-transform: uppercase; letter-spacing: 0.08em; display: none; }
  .bp-like-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; border-radius: 30px; border: 2px solid rgba(239,68,68,0.2); background: #fff; cursor: pointer; font-size: 0.9rem; font-weight: 800; color: #64748b; transition: all 0.2s; user-select: none; width: 100%; }
  .bp-like-btn:active { transform: scale(0.97); }
  .bp-like-btn.liked { border-color: #ef4444; background: rgba(239,68,68,0.07); color: #dc2626; }
  .bp-like-btn .heart { font-size: 1.2rem; transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
  .bp-like-btn.liked .heart { transform: scale(1.3); }
  
  .bp-share-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
  .bp-share-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 10px; border-radius: 12px; border: none; font-size: 0.8rem; font-weight: 800; cursor: pointer; transition: all 0.2s; }
  .bp-share-wa { background: #25d366; color: #fff; }
  .bp-share-tw { background: #1da1f2; color: #fff; }
  .bp-share-copy { background: rgba(100,116,139,0.1); color: #475569; border: 1px solid rgba(100,116,139,0.2); grid-column: span 2; }
  .bp-share-copy.copied { background: rgba(16,185,129,0.1); color: #065f46; border-color: rgba(16,185,129,0.3); }

  /* Comments Section */
  .bp-comments-section { padding: 24px 16px; }
  .bp-comments-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--navy); font-weight: 800; margin: 0 0 20px; display: flex; align-items: center; gap: 8px; }
  .bp-comment-count { font-size: 0.8rem; font-weight: 700; background: rgba(26,58,143,0.1); color: var(--royal); padding: 3px 12px; border-radius: 20px; }

  /* Comment Form (Mobile First) */
  .bp-comment-form { background: rgba(26,58,143,0.03); border: 1px solid rgba(26,58,143,0.1); border-radius: 16px; padding: 16px; margin-bottom: 24px; }
  .bp-comment-form-title { font-size: 0.75rem; font-weight: 800; color: var(--slate); text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 14px; }
  .bp-form-row { display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 12px; }
  
  /* Font size 1rem (16px) is absolutely required to stop iOS zoom */
  .bp-form-input { width: 100%; padding: 12px 14px; border: 1px solid rgba(26,58,143,0.15); border-radius: 10px; font-size: 1rem; color: #0f172a; background: #fff; outline: none; font-family: inherit; transition: border-color 0.15s, box-shadow 0.15s; appearance: none; }
  .bp-form-input:focus { border-color: rgba(26,58,143,0.4); box-shadow: 0 0 0 3px rgba(26,58,143,0.07); }
  
  .bp-form-textarea { width: 100%; padding: 12px 14px; border: 1px solid rgba(26,58,143,0.15); border-radius: 10px; font-size: 1rem; color: #0f172a; background: #fff; outline: none; font-family: inherit; resize: vertical; min-height: 100px; margin-bottom: 12px; transition: border-color 0.15s; appearance: none; }
  .bp-form-textarea:focus { border-color: rgba(26,58,143,0.4); box-shadow: 0 0 0 3px rgba(26,58,143,0.07); }
  
  .bp-comment-submit { width: 100%; padding: 14px; border: none; border-radius: 12px; background: linear-gradient(135deg, var(--royal), var(--sky)); color: #fff; font-size: 0.9rem; font-weight: 800; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(26,58,143,0.2); }
  .bp-comment-submit:active:not(:disabled) { transform: translateY(2px); }
  .bp-comment-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Comment Tree */
  .bp-comment-list { display: flex; flex-direction: column; gap: 16px; }
  .bp-comment-thread { display: flex; flex-direction: column; gap: 10px; }
  .bp-comment-item { background: #fff; border: 1px solid rgba(26,58,143,0.08); border-radius: 14px; padding: 16px; position: relative; animation: cmtIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
  .bp-comment-item.is-mine { border-color: rgba(26,58,143,0.2); background: rgba(26,58,143,0.02); }
  .bp-comment-item.is-pinned { border-color: rgba(245,158,11,0.4); background: rgba(245,158,11,0.03); }
  .bp-comment-item.is-flagged { opacity: 0.6; }
  .bp-comment-replies { margin-top: 10px; margin-left: 12px; display: flex; flex-direction: column; gap: 10px; border-left: 2px solid rgba(59,130,246,0.1); padding-left: 12px; }
  @keyframes cmtIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }

  .bp-comment-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; gap: 8px; }
  .bp-comment-author-row { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; flex-wrap: wrap; }
  .bp-comment-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--royal), var(--sky)); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 900; flex-shrink: 0; }
  .bp-comment-avatar.mine { background: linear-gradient(135deg, var(--gold), #f97316); }
  .bp-comment-name { font-weight: 800; font-size: 0.9rem; color: var(--navy); }
  .bp-comment-date { font-size: 0.7rem; color: var(--slate); font-weight: 600; white-space: nowrap; }
  .bp-mine-badge { font-size: 0.6rem; font-weight: 800; background: rgba(245,158,11,0.15); color: #92400e; border: 1px solid rgba(245,158,11,0.3); padding: 2px 8px; border-radius: 10px; text-transform: uppercase; flex-shrink: 0; }
  .bp-pin-badge { font-size: 0.6rem; font-weight: 800; background: rgba(245,158,11,0.2); color: #78350f; border: 1px solid rgba(245,158,11,0.35); padding: 2px 8px; border-radius: 10px; flex-shrink: 0; }
  .bp-comment-edited { font-size: 0.65rem; color: var(--slate); font-style: italic; opacity: 0.7; }
  .bp-comment-body { font-size: 0.95rem; color: #374151; line-height: 1.6; margin: 0 0 12px; }

  /* Comment Actions Row */
  .bp-comment-actions-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .bp-cmt-like-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; border: 1px solid rgba(239,68,68,0.18); background: #fff; cursor: pointer; font-size: 0.75rem; font-weight: 800; color: #64748b; transition: all 0.15s; user-select: none; }
  .bp-cmt-like-btn.liked { border-color: #ef4444; color: #dc2626; background: rgba(239,68,68,0.05); }
  .bp-cmt-reply-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; border: 1px solid rgba(26,58,143,0.15); background: #fff; cursor: pointer; font-size: 0.75rem; font-weight: 800; color: var(--slate); transition: all 0.15s; }
  
  .bp-cmt-action-btn { padding: 6px 12px; border-radius: 20px; border: none; font-size: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px; }
  .bp-cmt-edit-btn { background: rgba(26,58,143,0.07); color: var(--royal); border: 1px solid rgba(26,58,143,0.15); }
  .bp-cmt-delete-btn { background: rgba(239,68,68,0.07); color: #dc2626; border: 1px solid rgba(239,68,68,0.15); }
  .bp-cmt-save-btn { background: linear-gradient(135deg, var(--royal), var(--sky)); color: #fff; border: none; }
  .bp-cmt-cancel-btn { background: rgba(100,116,139,0.1); color: #475569; border: 1px solid rgba(100,116,139,0.2); }
  .bp-cmt-flag-btn { background: rgba(245,158,11,0.07); color: #92400e; border: 1px solid rgba(245,158,11,0.2); font-size: 0.7rem; }
  .bp-cmt-flag-btn.flagged { opacity: 0.5; cursor: default; }

  /* Inline edit */
  .bp-comment-edit-area { width: 100%; padding: 12px; border: 1px solid rgba(26,58,143,0.25); border-radius: 10px; font-size: 1rem; color: #0f172a; background: #fff; outline: none; font-family: inherit; resize: vertical; min-height: 80px; margin: 8px 0 12px; transition: border-color 0.15s; appearance: none; }
  .bp-comment-edit-area:focus { border-color: rgba(26,58,143,0.4); box-shadow: 0 0 0 3px rgba(26,58,143,0.07); }

  /* Inline reply form */
  .bp-reply-form { background: rgba(26,58,143,0.03); border: 1px solid rgba(26,58,143,0.1); border-radius: 12px; padding: 14px; margin-top: 12px; }
  .bp-reply-form-title { font-size: 0.7rem; font-weight: 800; color: var(--slate); text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px; }
  .bp-reply-row { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 10px; }
  
  .bp-reply-textarea { width: 100%; padding: 10px 12px; border: 1px solid rgba(26,58,143,0.15); border-radius: 10px; font-size: 1rem; color: #0f172a; background: #fff; outline: none; font-family: inherit; resize: vertical; min-height: 80px; margin-bottom: 12px; transition: border-color 0.15s; appearance: none; }
  .bp-reply-textarea:focus { border-color: rgba(26,58,143,0.4); box-shadow: 0 0 0 3px rgba(26,58,143,0.07); }
  
  .bp-reply-actions { display: flex; flex-direction: column; gap: 8px; }
  .bp-reply-submit { padding: 12px 16px; border: none; border-radius: 12px; background: linear-gradient(135deg, var(--royal), var(--sky)); color: #fff; font-size: 0.85rem; font-weight: 800; cursor: pointer; text-align: center; }
  .bp-reply-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .bp-reply-cancel { padding: 12px 14px; border: 1px solid rgba(100,116,139,0.2); border-radius: 12px; background: #fff; font-size: 0.85rem; font-weight: 700; color: #475569; cursor: pointer; text-align: center; }

  /* Related Posts */
  .bp-related-section { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(59,130,246,0.1); }
  .bp-related-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--navy); margin: 0 0 20px; font-weight: 800; }
  .bp-related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .bp-related-card { text-decoration: none; background: #fff; border-radius: 12px; border: 1px solid rgba(59,130,246,0.08); overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
  .bp-related-card:active { transform: scale(0.97); }
  .bp-related-img { width: 100%; aspect-ratio: 16/9; background: var(--light); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; overflow: hidden; }
  .bp-related-img img { width: 100%; height: 100%; object-fit: cover; }
  .bp-related-text { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
  .bp-related-text h4 { font-size: 0.85rem; color: var(--navy); margin: 0; font-weight: 700; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .bp-related-text span { font-size: 0.65rem; color: var(--slate); font-weight: 600; text-transform: uppercase; }

  /* Footer CTA */
  .bp-footer-cta { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 24px 16px; background: rgba(59,130,246,0.03); border-top: 1px solid rgba(59,130,246,0.09); text-align: center; }
  .bp-footer-cta-text { color: var(--slate); font-size: 0.9rem; font-weight: 500; }
  .bp-back-btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; gap: 6px; background: linear-gradient(135deg, var(--royal), var(--sky)); color: #fff; text-decoration: none; padding: 14px 20px; border-radius: 30px; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; box-shadow: 0 4px 14px rgba(26,58,143,0.25); transition: transform 0.2s; }
  
  .skel-bg { background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%); background-size: 400% 100%; animation: skel-load 1.5s ease-in-out infinite; border-radius: 6px; }
  @keyframes skel-load { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
  .bp-skeleton-cover { width: 100%; aspect-ratio: 16/9; background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%); background-size: 400% 100%; animation: skel-load 1.5s ease-in-out infinite; }

  .bp-error { background: rgba(254,226,226,0.9); border: 1px solid #fca5a5; color: #991b1b; padding: 16px; border-radius: 12px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 10px; }
  .bp-not-found { text-align: center; padding: 40px 20px; background: var(--card-bg); border-radius: 16px; border: 1px dashed rgba(59,130,246,0.2); }
  .bp-not-found h2 { font-family: 'Playfair Display', serif; color: var(--navy); font-size: 1.4rem; margin: 12px 0 8px; }
  .bp-not-found p { color: var(--slate); font-size: 0.9rem; margin: 0 0 24px; }
  .bp-no-comments { text-align: center; padding: 32px 16px; color: var(--slate); font-size: 0.95rem; }

  /* Site Footer (Mobile First) */
  .site-footer { background: var(--navy); color: rgba(255,255,255,0.6); padding: 32px 16px; text-align: center; font-size: 0.8rem; margin-top: auto; position: relative; z-index: 2; }
  .site-footer strong { color: var(--gold-light); }
  .site-footer p > a { display: inline-block; color: rgba(255,255,255,0.4); text-decoration: none; padding: 8px; margin: 4px; transition: color 0.2s; }

  .bp-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--navy); color: #fff; padding: 12px 24px; border-radius: 30px; font-size: 0.85rem; font-weight: 700; z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.2); pointer-events: none; white-space: nowrap; }

  .bp-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 9998; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .bp-confirm-box { background: #fff; border-radius: 18px; padding: 24px; width: min(340px, 100%); box-shadow: 0 20px 60px rgba(0,0,0,0.2); text-align: center; }
  .bp-confirm-icon { font-size: 2.2rem; margin-bottom: 12px; }
  .bp-confirm-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 800; color: var(--navy); margin: 0 0 10px; }
  .bp-confirm-sub { font-size: 0.9rem; color: var(--slate); margin: 0 0 24px; line-height: 1.5; }
  .bp-confirm-btns { display: flex; flex-direction: column; gap: 10px; }
  .bp-confirm-delete { padding: 12px; border: none; border-radius: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; font-size: 0.9rem; font-weight: 800; cursor: pointer; }
  .bp-confirm-cancel { padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; font-size: 0.9rem; font-weight: 700; cursor: pointer; color: #475569; }

  /* ─────────────────────── MEDIA QUERIES (Tablet & Desktop Up) ─────────────────────── */

  @media(min-width: 640px) {
    .blogpost-container { padding: 40px 24px 60px; }
    
    .bp-article-card { border-radius: 24px; }
    .bp-cover-wrap { aspect-ratio: 16/7; }
    
    .bp-body, .bp-comments-section { padding: 32px 32px; }
    .bp-title { font-size: 2.2rem; }
    .bp-excerpt { font-size: 1.05rem; padding: 20px; }
    .bp-content { font-size: 1.05rem; }
    .bp-content h1 { font-size: 2.2rem; }
    .bp-content h2 { font-size: 1.7rem; }
    
    .bp-engage { flex-direction: row; align-items: center; padding: 24px 32px; }
    .bp-engage-label { display: block; margin-right: 8px; }
    .bp-like-btn { width: auto; padding: 10px 20px; }
    .bp-share-group { display: flex; width: auto; margin-left: auto; gap: 8px; }
    .bp-share-btn { padding: 10px 16px; border-radius: 30px; font-size: 0.8rem; }
    .bp-share-copy { grid-column: auto; }
    
    .bp-form-row { grid-template-columns: 1fr 1fr; }
    .bp-comment-submit { width: auto; padding: 12px 28px; border-radius: 30px; }
    
    .bp-comment-replies { margin-left: 28px; padding-left: 20px; }
    
    .bp-reply-row { grid-template-columns: 1fr 1fr; }
    .bp-reply-actions { flex-direction: row; gap: 12px; }
    .bp-reply-submit, .bp-reply-cancel { border-radius: 30px; padding: 10px 20px; }
    
    .bp-related-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
    
    .bp-footer-cta { flex-direction: row; justify-content: space-between; padding: 24px 32px; text-align: left; }
    .bp-back-btn { width: auto; padding: 12px 24px; border-radius: 30px; }
    
    .site-footer { padding: 40px 24px; font-size: 0.9rem; margin-top: 60px; }
    .site-footer p > a:hover { color: #fff; }
    
    .bp-confirm-btns { flex-direction: row; justify-content: center; }
    .bp-confirm-delete, .bp-confirm-cancel { padding: 10px 24px; border-radius: 30px; }
  }

  @media(min-width: 1024px) {
    .blogpost-container { padding: 60px 32px 80px; }
    .bp-body, .bp-comments-section { padding: 40px 48px; }
    .bp-title { font-size: 2.6rem; }
    .bp-engage { padding: 24px 48px; }
    .bp-footer-cta { padding: 24px 48px; }
  }
`;

/* ─── Helpers ─── */
function isUrdu(t) { return t ? /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(t) : false; }

function getFingerprint() {
  let fp = localStorage.getItem("bp_fp");
  if (!fp) { fp = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("bp_fp", fp); }
  return fp;
}

function sanitizeHtml(html) {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;["script","style","iframe","object","embed","form","input","button","meta"].forEach(tag =>
    tmp.querySelectorAll(tag).forEach(el => el.remove())
  );
  tmp.querySelectorAll("a").forEach(a => {
    a.setAttribute("target","_blank"); a.setAttribute("rel","noopener noreferrer");
    const href = a.getAttribute("href") || "";
    if (href.toLowerCase().startsWith("javascript:")) a.removeAttribute("href");
    else if (href && !href.startsWith("http") && !href.startsWith("/") && !href.startsWith("#") && !href.startsWith("mailto:"))
      a.setAttribute("href",`https://${href}`);
  });
  return tmp.innerHTML;
}

function estimateReadTime(html) {
  if (!html) return null;
  const tmp = document.createElement("div"); tmp.innerHTML = html;
  const words = (tmp.innerText||"").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1,Math.round(words/200))} min read`;
}

function buildTOC(html) {
  if (!html) return { toc:[], html:"" };
  const tmp = document.createElement("div"); tmp.innerHTML = html;
  const items =[];
  tmp.querySelectorAll("h2,h3,h4").forEach((h,i) => {
    const id = `bp-h-${i}`; h.setAttribute("id",id);
    items.push({ id, text:h.innerText||h.textContent||"", tag:h.tagName.toLowerCase() });
  });
  return { toc:items, html:tmp.innerHTML };
}

function getRenderedHtml(post) {
  const raw = post.content_html || (post.content ? post.content.split("\n").filter(l=>l.trim()).map(l=>`<p>${l}</p>`).join("") : "");
  return sanitizeHtml(raw);
}

function formatDate(d) {
  if (!d) return "New";
  return new Date(d).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" });
}

function setFullMeta({ title, description, canonical, image, author, datePublished, tags }) {
  document.title = title;
  const sm = (name, content, prop=false) => {
    const attr = prop?"property":"name";
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr,name); document.head.appendChild(el); }
    el.setAttribute("content", content||"");
  };
  const sl = (rel, href) => {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) { el = document.createElement("link"); el.setAttribute("rel",rel); document.head.appendChild(el); }
    el.setAttribute("href",href);
  };
  sm("description",description); sl("canonical",canonical||window.location.href);
  sm("og:type","article",true); sm("og:title",title,true); sm("og:description",description,true);
  sm("og:url",canonical||window.location.href,true); sm("og:site_name","AIDLA",true);
  if (image) sm("og:image",image,true);
  sm("twitter:card",image?"summary_large_image":"summary");
  sm("twitter:title",title); sm("twitter:description",description);
  if (image) sm("twitter:image",image);
  if (author) sm("article:author",author,true);
  if (datePublished) sm("article:published_time",datePublished,true);
  let ld = document.querySelector("#bp-jsonld");
  if (!ld) { ld = document.createElement("script"); ld.id="bp-jsonld"; ld.type="application/ld+json"; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({
    "@context":"https://schema.org","@type":"Article","headline":title,"description":description,
    "image":image?[image]:undefined,"author":{"@type":"Person","name":author||"AIDLA Team"},
    "publisher":{"@type":"Organization","name":"AIDLA","url":"https://aidla.online"},
    "datePublished":datePublished,"mainEntityOfPage":{"@type":"WebPage","@id":canonical||window.location.href},
    "keywords":tags?.join(", "),
  });
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100,(scrolled/total)*100) : 0);
    };
    window.addEventListener("scroll", update, { passive:true });
    return () => window.removeEventListener("scroll", update);
  },[]);
  return progress;
}

/* ─── Build comment tree (infinite nesting) ─── */
function buildTree(flat) {
  const map = {};
  flat.forEach(c => { map[c.id] = { ...c, replies:[] }; });
  const roots =[];
  flat.forEach(c => {
    if (c.parent_id && map[c.parent_id]) map[c.parent_id].replies.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  return roots;
}

/* ─── Confirm Dialog ─── */
function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div className="bp-confirm-overlay" onClick={onCancel}>
      <motion.div className="bp-confirm-box"
        initial={{opacity:0,scale:0.9,y:16}} animate={{opacity:1,scale:1,y:0}}
        exit={{opacity:0,scale:0.9,y:16}} transition={{duration:0.2}}
        onClick={e=>e.stopPropagation()}
      >
        <div className="bp-confirm-icon">🗑️</div>
        <div className="bp-confirm-title">Delete Comment?</div>
        <div className="bp-confirm-sub">This cannot be undone. The comment and all its replies will be removed.</div>
        <div className="bp-confirm-btns">
          <button className="bp-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="bp-confirm-delete" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Reply Form ─── */
function ReplyForm({ onSubmit, onCancel, loading }) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="bp-reply-form">
      <div className="bp-reply-form-title">↩ Write a Reply</div>
      <div className="bp-reply-row">
        <input className="bp-form-input" placeholder="Your name *" value={name} onChange={e=>setName(e.target.value)} />
        <input className="bp-form-input" placeholder="Email (optional)" value="" onChange={()=>{}} />
      </div>
      <textarea className="bp-reply-textarea" placeholder="Write your reply…" value={body} onChange={e=>setBody(e.target.value)}/>
      <div className="bp-reply-actions">
        <button className="bp-reply-submit" onClick={() => onSubmit(name, body)} disabled={loading||!name.trim()||!body.trim()}>
          {loading ? "Posting…" : "Post Reply →"}
        </button>
        <button className="bp-reply-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ─── Single Comment Node (recursive) ─── */
function CommentNode({ node, fp, depth=0, onDelete, onEdit, onReply, onLikeComment, commentLikes, postId }) {
  const [editing, setEditing]       = useState(false);
  const [editBody, setEditBody]     = useState(node.body);
  const [saving, setSaving]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReply, setShowReply]   = useState(false);
  const[replyLoading, setReplyLoading] = useState(false);
  const [flagged, setFlagged]       = useState(node.is_flagged);

  const isMine = node.fingerprint === fp;
  const likes = commentLikes[node.id] || { count:0, liked:false };

  const handleSave = async () => {
    if (!editBody.trim() || editBody.trim()===node.body) { setEditing(false); return; }
    setSaving(true); await onEdit(node.id, editBody.trim()); setSaving(false); setEditing(false);
  };

  const handleReplySubmit = async (name, body) => {
    setReplyLoading(true);
    await onReply({ parentId:node.id, name, body });
    setReplyLoading(false); setShowReply(false);
  };

  const handleFlag = async () => {
    if (flagged) return;
    const { error } = await supabase.rpc("blogs_flag_comment",{ p_comment_id:node.id });
    if (!error) setFlagged(true);
  };

  return (
    <>
      <div className={`bp-comment-item${isMine?" is-mine":""}${node.is_pinned?" is-pinned":""}${flagged?" is-flagged":""}`}>
        {/* Header */}
        <div className="bp-comment-header">
          <div className="bp-comment-author-row">
            <div className={`bp-comment-avatar${isMine?" mine":""}`}>{(node.author_name||"?")[0].toUpperCase()}</div>
            <span className="bp-comment-name">{node.author_name}</span>
            {isMine && <span className="bp-mine-badge">You</span>}
            {node.is_pinned && <span className="bp-pin-badge">📌 Pinned</span>}
            {node.edited_at && <span className="bp-comment-edited">(edited)</span>}
          </div>
          <span className="bp-comment-date">{formatDate(node.created_at)}</span>
        </div>

        {/* Body or Edit */}
        {editing ? (
          <>
            <textarea className="bp-comment-edit-area" value={editBody} onChange={e=>setEditBody(e.target.value)} autoFocus/>
            <div style={{display:"flex",gap:7}}>
              <button className="bp-cmt-action-btn bp-cmt-save-btn" onClick={handleSave} disabled={saving||!editBody.trim()}>{saving?"Saving…":"✅ Save"}</button>
              <button className="bp-cmt-action-btn bp-cmt-cancel-btn" onClick={()=>{setEditBody(node.body);setEditing(false);}}>Cancel</button>
            </div>
          </>
        ) : (
          <p className="bp-comment-body">{node.body}</p>
        )}

        {/* Actions Row */}
        {!editing && (
          <div className="bp-comment-actions-row">
            {/* Like comment */}
            <button className={`bp-cmt-like-btn${likes.liked?" liked":""}`} onClick={()=>onLikeComment(node.id)}>
              {likes.liked?"❤️":"🤍"} {likes.count > 0 ? likes.count : ""}
            </button>
            {/* Reply */}
            <button className="bp-cmt-reply-btn" onClick={()=>setShowReply(v=>!v)}>↩ Reply</button>
            {/* Own comment actions */}
            {isMine && (
              <>
                <button className="bp-cmt-action-btn bp-cmt-edit-btn" onClick={()=>{setEditBody(node.body);setEditing(true);}}>✏️ Edit</button>
                <button className="bp-cmt-action-btn bp-cmt-delete-btn" onClick={()=>setShowConfirm(true)}>🗑 Delete</button>
              </>
            )}
            {/* Flag (only for others' comments) */}
            {!isMine && (
              <button className={`bp-cmt-action-btn bp-cmt-flag-btn${flagged?" flagged":""}`} onClick={handleFlag} disabled={flagged}>
                {flagged?"🚩 Reported":"🚩 Report"}
              </button>
            )}
          </div>
        )}

        {/* Reply Form */}
        {showReply && (
          <ReplyForm
            onSubmit={handleReplySubmit}
            onCancel={()=>setShowReply(false)}
            loading={replyLoading}
          />
        )}
      </div>

      {/* Recursive Replies */}
      {node.replies?.length > 0 && (
        <div className="bp-comment-replies">
          {node.replies.map(child => (
            <CommentNode
              key={child.id} node={child} fp={fp} depth={depth+1}
              onDelete={onDelete} onEdit={onEdit} onReply={onReply}
              onLikeComment={onLikeComment} commentLikes={commentLikes} postId={postId}
            />
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      <AnimatePresence>
        {showConfirm && (
          <ConfirmDialog
            onConfirm={()=>{ setShowConfirm(false); onDelete(node.id); }}
            onCancel={()=>setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

const fadeUp = { initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:0.5} };

/* ══════════════════════════════════════════════════════ */
export default function BlogPost() {
  const { slug } = useParams();
  const progress = useReadingProgress();
  const fp = getFingerprint();
  const viewedRef = useRef(false);

  const [loading, setLoading]     = useState(true);
  const [post, setPost]           = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const[errorMsg, setErrorMsg]   = useState("");
  const [toc, setToc]             = useState([]);
  const [tocOpen, setTocOpen]     = useState(true);
  const[renderedHtml, setRenderedHtml] = useState("");

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked]         = useState(false);
  const[likeLoading, setLikeLoading] = useState(false);

  const [comments, setComments]   = useState([]); // flat list
  const [commentLikes, setCommentLikes] = useState({}); // { commentId: { count, liked } }
  const [cmtName, setCmtName]     = useState("");
  const[cmtEmail, setCmtEmail]   = useState("");
  const [cmtBody, setCmtBody]     = useState("");
  const [cmtLoading, setCmtLoading] = useState(false);

  const[copied, setCopied]       = useState(false);
  const [toast, setToast]         = useState("");
  const showToast = useCallback((m) => { setToast(m); setTimeout(()=>setToast(""),2800); },[]);

  useEffect(() => {
    window.scrollTo(0,0);
    viewedRef.current = false;
    const load = async () => {
      setLoading(true); setErrorMsg("");
      const { data, error } = await supabase.from("blogs_posts").select("*")
        .is("deleted_at",null).eq("status","published").eq("slug",slug).maybeSingle();
      if (error) { setErrorMsg(error.message); setPost(null); setLoading(false); return; }
      if (!data) { setPost(null); setLoading(false); return; }
      setPost(data);

      const rawHtml = getRenderedHtml(data);
      const { toc:tocItems, html:processedHtml } = buildTOC(rawHtml);
      setToc(tocItems); setRenderedHtml(processedHtml);

      // Related
      const { data:rel } = await supabase.from("blogs_posts")
        .select("id,title,slug,cover_image_url,published_at")
        .is("deleted_at",null).eq("status","published").neq("slug",slug).limit(4);
      if (rel) setRelatedPosts(rel);

      // Post likes
      const { count } = await supabase.from("blogs_likes")
        .select("*",{count:"exact",head:true}).eq("post_id",data.id);
      setLikeCount(count||0);
      const { data:myLike } = await supabase.from("blogs_likes")
        .select("id").eq("post_id",data.id).eq("fingerprint",fp).maybeSingle();
      setLiked(!!myLike);

      // Comments
      const { data:cmts } = await supabase.from("blogs_comments")
        .select("*").eq("post_id",data.id).order("created_at",{ascending:true});
      if (cmts) {
        setComments(cmts);
        await loadCommentLikes(cmts);
      }

      // Meta
      setFullMeta({
        title:data.meta_title||data.title, description:data.meta_description||data.excerpt||"",
        canonical:data.canonical_url||`https://aidla.online/blogs/${slug}`,
        image:data.cover_image_url||"", author:data.author_name||"AIDLA Team",
        datePublished:data.published_at, tags:data.tags||[],
      });

      setLoading(false);

      // Increment view count once
      if (!viewedRef.current) {
        viewedRef.current = true;
        supabase.rpc("blogs_increment_view",{ p_post_id:data.id });
      }
    };
    load();
  }, [slug]);

  const loadCommentLikes = async (cmts) => {
    if (!cmts?.length) return;
    const ids = cmts.map(c => c.id);
    // Get all likes for these comments
    const { data } = await supabase.from("blogs_comment_likes")
      .select("comment_id,fingerprint").in("comment_id",ids);
    if (!data) return;
    const map = {};
    ids.forEach(id => { map[id] = { count:0, liked:false }; });
    data.forEach(l => {
      if (!map[l.comment_id]) map[l.comment_id] = { count:0, liked:false };
      map[l.comment_id].count++;
      if (l.fingerprint === fp) map[l.comment_id].liked = true;
    });
    setCommentLikes(map);
  };

  const handleLike = async () => {
    if (!post || likeLoading) return;
    setLikeLoading(true);
    const { data, error } = await supabase.rpc("blogs_toggle_like",{ p_post_id:post.id, p_fingerprint:fp });
    if (!error && data?.ok) { setLiked(data.liked); setLikeCount(data.count); }
    setLikeLoading(false);
  };

  const handleComment = async () => {
    if (!post||cmtLoading) return;
    setCmtLoading(true);
    const { data, error } = await supabase.rpc("blogs_add_comment",{
      p_post_id:post.id, p_author_name:cmtName,
      p_author_email:cmtEmail, p_body:cmtBody, p_fingerprint:fp, p_parent_id:null,
    });
    if (error||!data?.ok) showToast(data?.error||error?.message||"Failed to post");
    else {
      const newCmt = { id:data.id, post_id:post.id, author_name:cmtName, body:cmtBody,
        fingerprint:fp, created_at:new Date().toISOString(), edited_at:null,
        parent_id:null, is_pinned:false, is_flagged:false };
      setComments(prev => [...prev, newCmt]);
      setCommentLikes(prev => ({ ...prev, [data.id]:{ count:0, liked:false } }));
      setCmtName(""); setCmtEmail(""); setCmtBody("");
      showToast("Comment posted! 🎉");
    }
    setCmtLoading(false);
  };

  const handleReply = async ({ parentId, name, body }) => {
    if (!post) return;
    const { data, error } = await supabase.rpc("blogs_add_comment",{
      p_post_id:post.id, p_author_name:name, p_author_email:"", p_body:body,
      p_fingerprint:fp, p_parent_id:parentId,
    });
    if (error||!data?.ok) { showToast(data?.error||error?.message||"Failed"); return; }
    const newCmt = { id:data.id, post_id:post.id, author_name:name, body, fingerprint:fp,
      created_at:new Date().toISOString(), edited_at:null,
      parent_id:parentId, is_pinned:false, is_flagged:false };
    setComments(prev => [...prev, newCmt]);
    setCommentLikes(prev => ({ ...prev,[data.id]:{ count:0, liked:false } }));
    showToast("Reply posted! 💬");
  };

  const handleDeleteComment = async (id) => {
    const { error } = await supabase.from("blogs_comments").delete().eq("id",id).eq("fingerprint",fp);
    if (error) { showToast("Could not delete comment"); return; }
    // Remove comment and all its descendants
    const removeIds = new Set();
    const collectIds = (cid) => {
      removeIds.add(cid);
      comments.filter(c => c.parent_id===cid).forEach(c => collectIds(c.id));
    };
    collectIds(id);
    setComments(prev => prev.filter(c => !removeIds.has(c.id)));
    showToast("Comment deleted");
  };

  const handleEditComment = async (id, newBody) => {
    const { error } = await supabase.from("blogs_comments")
      .update({ body:newBody, edited_at:new Date().toISOString() }).eq("id",id).eq("fingerprint",fp);
    if (error) { showToast("Could not update"); return; }
    setComments(prev => prev.map(c => c.id===id ? { ...c, body:newBody, edited_at:new Date().toISOString() } : c));
    showToast("Comment updated ✅");
  };

  const handleLikeComment = async (commentId) => {
    const { data, error } = await supabase.rpc("blogs_toggle_comment_like",{ p_comment_id:commentId, p_fingerprint:fp });
    if (!error && data?.ok) {
      setCommentLikes(prev => ({ ...prev,[commentId]:{ count:data.count, liked:data.liked } }));
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = post?.title || "Check this out";
    if (platform==="wa") window.open(`https://wa.me/?text=${encodeURIComponent(text+" "+url)}`,"_blank");
    else if (platform==="tw") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,"_blank");
    else { navigator.clipboard.writeText(url).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); showToast("Link copied! 📋"); }); }
  };

  const handleDownload = async () => {
    if (!post?.cover_image_url) return;
    try {
      const res = await fetch(post.cover_image_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url; a.download=`${post.slug||"cover"}.jpg`; a.click();
      URL.revokeObjectURL(url);
      showToast("Downloading image... 📥");
    } catch { showToast("Download failed"); }
  };

  const urduTitle = post && isUrdu(post.title);
  const commentTree = buildTree(comments);
  const totalComments = comments.length;

  return (
    <div className="blogpost-root">
      <style>{styles}</style>
      <div className="bp-progress-bar" style={{width:`${progress}%`}}/>

      <AnimatePresence>
        {toast && (
          <motion.div className="bp-toast"
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}} transition={{duration:0.25}}
          >{toast}</motion.div>
        )}
      </AnimatePresence>

      <div className="bp-orbs"><div className="bp-orb-1"/><div className="bp-orb-2"/><div className="bp-orb-3"/></div>

      <div className="blogpost-container">
        <motion.div {...fadeUp}><Link to="/blogs" className="bp-back">‹ All Insights</Link></motion.div>

        {errorMsg && <motion.div className="bp-error" {...fadeUp}><span>⚠️</span>{errorMsg}</motion.div>}

        {/* Skeleton */}
        {loading && (
          <motion.div className="bp-article-card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="bp-skeleton-cover"/>
            <div className="bp-body">
              {[80,90,60,100,100,78,100,95,82].map((w,i)=>(
                <div key={i} className="skel-bg" style={{height:i<2?22:13,width:`${w}%`,marginBottom:i===1?22:8}}/>
              ))}
            </div>
          </motion.div>
        )}

        {/* Not found */}
        {!loading && !post && !errorMsg && (
          <motion.div className="bp-not-found" {...fadeUp}>
            <span style={{fontSize:"2.5rem",display:"block"}}>📭</span>
            <h2>Insight Not Found</h2>
            <p>This article may have been moved or unpublished.</p>
            <Link to="/blogs" className="bp-back-btn">‹ Back to Insights</Link>
          </motion.div>
        )}

        {/* Article */}
        {post && (
          <motion.div className="bp-article-card" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.55}}>

            {/* Cover */}
            <div className="bp-cover-wrap">
              {post.cover_image_url
                ? <img src={post.cover_image_url} alt={post.title} loading="lazy"/>
                : <div className="bp-cover-placeholder">📰</div>
              }
              {post.cover_image_url && (
                <button className="bp-cover-download" onClick={handleDownload}>⬇ Download Image</button>
              )}
            </div>

            {/* Body */}
            <div className="bp-body">
              <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:6,marginBottom:8}}>
                <span className="bp-label">AIDLA Insights</span>
                {(post.content_html||post.content) && (
                  <span className="bp-readtime-badge">⏱ {estimateReadTime(post.content_html||post.content)}</span>
                )}
              </div>

              <h1 className={`bp-title${urduTitle?" urdu":""}`}>{post.title}</h1>

              <div className="bp-meta">
                <div className="bp-author"><span className="bp-author-icon">✍️</span>{post.author_name||"AIDLA Team"}</div>
                <span className="bp-dot"/>
                <span className="bp-date-pill">{formatDate(post.published_at)}</span>
                <span className="bp-dot"/>
                <span className="bp-read-time">👁 {(post.view_count||0).toLocaleString()} views</span>
                <span className="bp-dot"/>
                <span className="bp-read-time">❤️ {likeCount} {likeCount===1?"like":"likes"}</span>
              </div>

              {post.tags?.length > 0 && (
                <div className="bp-tags">{post.tags.map(t=><span key={t} className="bp-tag"># {t}</span>)}</div>
              )}

              {post.excerpt && <p className="bp-excerpt">{post.excerpt}</p>}

              {toc.length > 1 && (
                <div className="bp-toc">
                  <div className="bp-toc-title" onClick={()=>setTocOpen(v=>!v)}>
                    📋 Table of Contents <span style={{marginLeft:"auto",fontSize:"0.8em"}}>{tocOpen?"▲":"▼"}</span>
                  </div>
                  {tocOpen && (
                    <ul className="bp-toc-list">
                      {toc.map(item=>(
                        <li key={item.id} className={`bp-toc-item ${item.tag}`}>
                          <a href={`#${item.id}`} onClick={e=>{e.preventDefault();document.getElementById(item.id)?.scrollIntoView({behavior:"smooth",block:"start"});}}>
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="bp-divider"/>
              <div className="bp-content" dir={urduTitle?"rtl":"ltr"} dangerouslySetInnerHTML={{__html:renderedHtml}}/>

              {relatedPosts.length > 0 && (
                <div className="bp-related-section">
                  <h3 className="bp-related-title">You might also like...</h3>
                  <div className="bp-related-grid">
                    {relatedPosts.map(rp=>(
                      <Link to={`/blogs/${rp.slug}`} key={rp.id} className="bp-related-card">
                        <div className="bp-related-img">
                          {rp.cover_image_url?<img src={rp.cover_image_url} alt={rp.title} loading="lazy"/>:<span>📰</span>}
                        </div>
                        <div className="bp-related-text">
                          <h4>{rp.title}</h4><span>{formatDate(rp.published_at)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Engagement Bar */}
            <div className="bp-engage">
              <span className="bp-engage-label">React & Share</span>
              <button className={`bp-like-btn${liked?" liked":""}`} onClick={handleLike} disabled={likeLoading}>
                <span className="heart">{liked?"❤️":"🤍"}</span>
                {likeCount} {likeCount===1?"Like":"Likes"}
              </button>
              <div className="bp-share-group">
                <button className="bp-share-btn bp-share-wa" onClick={()=>handleShare("wa")}>💬 WhatsApp</button>
                <button className="bp-share-btn bp-share-tw" onClick={()=>handleShare("tw")}>𝕏 Twitter</button>
                <button className={`bp-share-btn bp-share-copy${copied?" copied":""}`} onClick={()=>handleShare("copy")}>
                  {copied?"✅ Copied!":"🔗 Copy Link"}
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="bp-comments-section">
              <h3 className="bp-comments-title">
                💬 Comments <span className="bp-comment-count">{totalComments}</span>
              </h3>

              {/* Post form */}
              <div className="bp-comment-form">
                <div className="bp-comment-form-title">✍️ Leave a Comment</div>
                <div className="bp-form-row">
                  <input className="bp-form-input" placeholder="Your name *" value={cmtName} onChange={e=>setCmtName(e.target.value)}/>
                  <input className="bp-form-input" placeholder="Email (optional)" type="email" value={cmtEmail} onChange={e=>setCmtEmail(e.target.value)}/>
                </div>
                <textarea className="bp-form-textarea" placeholder="Write your comment…" value={cmtBody} onChange={e=>setCmtBody(e.target.value)}/>
                <button className="bp-comment-submit" onClick={handleComment} disabled={cmtLoading||!cmtName.trim()||!cmtBody.trim()}>
                  {cmtLoading?"Posting…":"Post Comment →"}
                </button>
              </div>

              {/* Threaded comments */}
              {totalComments === 0
                ? <div className="bp-no-comments">No comments yet. Be the first! 💭</div>
                : (
                  <div className="bp-comment-list">
                    {commentTree.map(node=>(
                      <div key={node.id} className="bp-comment-thread">
                        <CommentNode
                          node={node} fp={fp} depth={0}
                          onDelete={handleDeleteComment}
                          onEdit={handleEditComment}
                          onReply={handleReply}
                          onLikeComment={handleLikeComment}
                          commentLikes={commentLikes}
                          postId={post.id}
                        />
                      </div>
                    ))}
                  </div>
                )
              }
            </div>

            {/* Footer CTA */}
            <div className="bp-footer-cta">
              <span className="bp-footer-cta-text">Thanks for reading ✨</span>
              <Link to="/blogs" className="bp-back-btn">‹ More Insights</Link>
            </div>
          </motion.div>
        )}
      </div>

      <footer className="site-footer">
        <div style={{marginBottom:10,fontSize:"1.1rem"}}>🕌</div>
        <p>© 2025 <strong>AIDLA</strong>. All rights reserved. Designed with ❤️ for learners everywhere.</p>
        <p style={{marginTop:8}}>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </p>
      </footer>
    </div>
  );
}