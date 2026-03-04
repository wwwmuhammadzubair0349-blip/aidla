import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

/* ─── Styles ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');

  :root {
    --navy: #0b1437; --royal: #1a3a8f; --sky: #3b82f6;
    --gold: #f59e0b; --gold-light: #fcd34d; --slate: #64748b;
    --light: #f0f4ff; --card-bg: rgba(255,255,255,0.97);
  }
  * { box-sizing: border-box; }

  .blogpost-root {
    min-height:100vh;
    background:linear-gradient(160deg,#f0f4ff 0%,#fffbf0 60%,#e8f4fd 100%);
    font-family:'DM Sans',sans-serif;overflow-x:hidden;
    position:relative;display:flex;flex-direction:column;
  }

  /* Progress Bar */
  .bp-progress-bar {
    position:fixed;top:0;left:0;height:3px;z-index:9999;
    background:linear-gradient(90deg,var(--gold),var(--sky),var(--royal));
    transition:width 0.1s linear;border-radius:0 2px 2px 0;
    box-shadow:0 0 8px rgba(59,130,246,0.5);
  }

  /* Orbs */
  .bp-orbs{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
  .bp-orb-1{position:absolute;width:600px;height:600px;border-radius:50%;background:rgba(59,130,246,0.06);filter:blur(80px);top:-200px;left:-200px;}
  .bp-orb-2{position:absolute;width:500px;height:500px;border-radius:50%;background:rgba(245,158,11,0.05);filter:blur(80px);top:300px;right:-250px;}
  .bp-orb-3{position:absolute;width:400px;height:400px;border-radius:50%;background:rgba(26,58,143,0.04);filter:blur(80px);bottom:100px;left:30%;}

  .blogpost-container{flex:1;max-width:860px;margin:0 auto;padding:clamp(28px,5vw,64px) clamp(14px,4vw,32px) clamp(40px,8vw,80px);position:relative;z-index:2;width:100%;}

  /* Back */
  .bp-back{display:inline-flex;align-items:center;gap:6px;color:var(--royal);font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;text-decoration:none;background:rgba(59,130,246,0.08);padding:6px 14px;border-radius:30px;margin-bottom:clamp(16px,4vw,28px);transition:background 0.2s,transform 0.2s;}
  .bp-back:hover{background:rgba(59,130,246,0.15);transform:translateX(-2px);}

  /* Card */
  .bp-article-card{background:var(--card-bg);border-radius:24px;box-shadow:0 8px 40px rgba(11,20,55,0.07);border:1px solid rgba(59,130,246,0.08);overflow:hidden;}

  /* Cover */
  .bp-cover-wrap{width:100%;aspect-ratio:16/7;overflow:hidden;position:relative;background:linear-gradient(135deg,var(--navy),var(--royal));}
  .bp-cover-wrap img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 6s ease;}
  .bp-cover-wrap:hover img{transform:scale(1.02);}
  .bp-cover-wrap::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 55%,rgba(11,20,55,0.35) 100%);}
  .bp-cover-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:clamp(2rem,8vw,3.5rem);}
  .bp-cover-download{position:absolute;bottom:14px;right:14px;z-index:3;background:rgba(255,255,255,0.92);color:var(--navy);border:none;border-radius:30px;padding:7px 14px;font-size:0.7rem;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:5px;box-shadow:0 4px 14px rgba(0,0,0,0.15);transition:transform 0.2s,box-shadow 0.2s;backdrop-filter:blur(8px);letter-spacing:0.03em;}
  .bp-cover-download:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,0.2);}

  /* Body */
  .bp-body{padding:clamp(18px,5vw,40px) clamp(16px,5vw,44px);}

  /* Badges */
  .bp-label{display:inline-block;background:linear-gradient(135deg,var(--gold),var(--gold-light));color:var(--navy);padding:5px 12px;border-radius:30px;font-size:0.65rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:12px;box-shadow:0 4px 12px rgba(245,158,11,0.25);}
  .bp-readtime-badge{display:inline-flex;align-items:center;gap:5px;background:rgba(16,185,129,0.1);color:#065f46;border:1px solid rgba(16,185,129,0.25);padding:4px 10px;border-radius:30px;font-size:0.65rem;font-weight:800;letter-spacing:0.04em;margin-bottom:12px;margin-left:8px;}

  /* Title */
  .bp-title{font-family:'Playfair Display',serif;font-size:clamp(1.4rem,5.5vw,2.6rem);font-weight:900;color:var(--navy);line-height:1.15;margin:0 0 16px;word-break:break-word;}
  .bp-title.urdu{font-family:'Noto Nastaliq Urdu',serif;direction:rtl;text-align:right;line-height:1.8;}

  /* Meta */
  .bp-meta{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:clamp(16px,4vw,28px);padding-bottom:clamp(14px,3.5vw,22px);border-bottom:1px solid rgba(59,130,246,0.1);}
  .bp-author{display:inline-flex;align-items:center;gap:6px;font-weight:700;color:var(--navy);font-size:0.8rem;}
  .bp-author-icon{background:rgba(59,130,246,0.1);color:var(--sky);border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;}
  .bp-date-pill{background:rgba(59,130,246,0.1);color:var(--royal);padding:4px 10px;border-radius:10px;font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;}
  .bp-dot{width:4px;height:4px;border-radius:50%;background:var(--slate);opacity:0.4;}
  .bp-read-time{color:var(--slate);font-size:0.7rem;font-weight:600;}

  /* Tags */
  .bp-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}
  .bp-tag{background:rgba(26,58,143,0.07);color:var(--royal);border:1px solid rgba(26,58,143,0.15);padding:3px 10px;border-radius:20px;font-size:0.65rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;}

  /* Excerpt */
  .bp-excerpt{font-size:clamp(0.9rem,2.5vw,1.1rem);color:var(--royal);font-style:italic;line-height:1.65;margin:0 0 clamp(16px,4vw,28px);padding:clamp(10px,3vw,16px) clamp(14px,3.5vw,22px);border-left:3px solid var(--sky);background:rgba(59,130,246,0.04);border-radius:0 12px 12px 0;}

  /* TOC */
  .bp-toc{background:rgba(26,58,143,0.04);border:1px solid rgba(26,58,143,0.1);border-radius:16px;padding:18px 22px;margin-bottom:28px;}
  .bp-toc-title{font-size:0.72rem;font-weight:800;color:var(--royal);text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;}
  .bp-toc-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:5px;}
  .bp-toc-item a{color:var(--slate);font-size:0.82rem;font-weight:600;text-decoration:none;transition:color 0.15s;display:flex;align-items:center;gap:6px;padding:3px 0;}
  .bp-toc-item a:hover{color:var(--royal);}
  .bp-toc-item a::before{content:'#';font-size:0.7em;opacity:0.35;font-weight:900;}
  .bp-toc-item.h3 a{padding-left:14px;font-size:0.78rem;}
  .bp-toc-item.h4 a{padding-left:28px;font-size:0.74rem;}

  /* Divider */
  .bp-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(59,130,246,0.2),transparent);margin:clamp(18px,4vw,28px) 0;}

  /* Content */
  .bp-content{color:#2d3748;font-size:clamp(0.88rem,2.2vw,1.02rem);line-height:1.85;word-break:break-word;overflow-wrap:break-word;}
  .bp-content p{margin:0 0 18px;}
  .bp-content h1{font-family:'Playfair Display',serif;font-size:clamp(1.5rem,5vw,2.2rem);font-weight:900;color:var(--navy);margin:clamp(28px,5vw,40px) 0 12px;line-height:1.15;}
  .bp-content h2{font-family:'Playfair Display',serif;font-size:clamp(1.2rem,4vw,1.7rem);font-weight:800;color:var(--navy);margin:clamp(24px,4vw,36px) 0 10px;padding-bottom:8px;border-bottom:2px solid rgba(59,130,246,0.12);}
  .bp-content h3{font-family:'Playfair Display',serif;font-size:clamp(1.05rem,3.5vw,1.4rem);font-weight:800;color:var(--navy);margin:clamp(20px,4vw,28px) 0 8px;}
  .bp-content h4{font-size:clamp(0.95rem,3vw,1.1rem);font-weight:700;color:var(--navy);margin:18px 0 6px;}
  .bp-content h5,.bp-content h6{font-size:0.95rem;font-weight:700;color:var(--slate);margin:14px 0 4px;}
  .bp-content a{color:var(--sky);font-weight:600;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1.5px;transition:color 0.15s;cursor:pointer;}
  .bp-content a:hover{color:var(--royal);}
  .bp-content a:visited{color:#7c3aed;}
  .bp-content a[target="_blank"]::after{content:" ↗";font-size:0.75em;opacity:0.7;font-weight:400;}
  .bp-content img{max-width:100%;border-radius:14px;margin:20px 0;box-shadow:0 6px 24px rgba(11,20,55,0.1);display:block;}
  .bp-content ul,.bp-content ol{padding-left:clamp(18px,4vw,28px);margin:0 0 18px;}
  .bp-content li{margin-bottom:8px;line-height:1.7;}
  .bp-content ul li::marker{color:var(--sky);}
  .bp-content ol li::marker{color:var(--royal);font-weight:700;}
  .bp-content blockquote{margin:24px 0;padding:14px 20px;border-left:4px solid var(--gold);background:rgba(245,158,11,0.05);border-radius:0 12px 12px 0;font-style:italic;color:var(--slate);font-size:1.05em;}
  .bp-content pre{background:var(--navy);color:#e2e8f0;padding:18px 20px;border-radius:14px;overflow-x:auto;font-size:0.82rem;line-height:1.7;margin:20px 0;}
  .bp-content code{background:rgba(59,130,246,0.1);color:var(--royal);padding:2px 7px;border-radius:5px;font-size:0.85em;font-family:'Courier New',monospace;}
  .bp-content pre code{background:none;color:inherit;padding:0;font-size:inherit;}
  .bp-content table{width:100%;border-collapse:collapse;margin:20px 0;font-size:0.9em;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(11,20,55,0.06);}
  .bp-content th{background:var(--royal);color:#fff;padding:12px 16px;text-align:left;font-weight:700;font-size:0.85em;}
  .bp-content td{padding:11px 16px;border-bottom:1px solid rgba(59,130,246,0.08);color:#374151;}
  .bp-content tr:last-child td{border-bottom:none;}
  .bp-content tr:nth-child(even) td{background:rgba(59,130,246,0.025);}
  .bp-content hr{border:none;border-top:2px solid rgba(59,130,246,0.12);margin:28px 0;}
  .bp-content strong,.bp-content b{font-weight:700;color:var(--navy);}
  .bp-content sup{font-size:0.7em;vertical-align:super;}
  .bp-content sub{font-size:0.7em;vertical-align:sub;}

  /* Engagement */
  .bp-engage{display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:20px clamp(16px,5vw,44px);border-top:1px solid rgba(59,130,246,0.08);border-bottom:1px solid rgba(59,130,246,0.08);background:rgba(59,130,246,0.02);}
  .bp-engage-label{font-size:0.72rem;font-weight:700;color:var(--slate);text-transform:uppercase;letter-spacing:0.08em;margin-right:4px;}
  .bp-like-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:30px;border:2px solid rgba(239,68,68,0.2);background:#fff;cursor:pointer;font-size:0.8rem;font-weight:800;color:#64748b;transition:all 0.2s;user-select:none;}
  .bp-like-btn:hover{border-color:rgba(239,68,68,0.4);background:rgba(239,68,68,0.04);transform:scale(1.03);}
  .bp-like-btn.liked{border-color:#ef4444;background:rgba(239,68,68,0.07);color:#dc2626;}
  .bp-like-btn .heart{font-size:1.1rem;transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);}
  .bp-like-btn.liked .heart{transform:scale(1.3);}
  .bp-share-group{display:flex;align-items:center;gap:7px;margin-left:auto;}
  .bp-share-btn{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;border-radius:30px;border:none;font-size:0.72rem;font-weight:800;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
  .bp-share-wa{background:#25d366;color:#fff;}
  .bp-share-wa:hover{background:#1da851;transform:translateY(-2px);}
  .bp-share-tw{background:#1da1f2;color:#fff;}
  .bp-share-tw:hover{background:#1a8cd8;transform:translateY(-2px);}
  .bp-share-copy{background:rgba(100,116,139,0.1);color:#475569;border:1px solid rgba(100,116,139,0.2);}
  .bp-share-copy:hover{background:rgba(100,116,139,0.18);}
  .bp-share-copy.copied{background:rgba(16,185,129,0.1);color:#065f46;border-color:rgba(16,185,129,0.3);}

  /* Comments */
  .bp-comments-section{padding:clamp(18px,5vw,36px) clamp(16px,5vw,44px);}
  .bp-comments-title{font-family:'Playfair Display',serif;font-size:clamp(1.1rem,3.5vw,1.4rem);color:var(--navy);font-weight:800;margin:0 0 20px;display:flex;align-items:center;gap:8px;}
  .bp-comment-count{font-size:0.75rem;font-weight:700;background:rgba(26,58,143,0.1);color:var(--royal);padding:2px 10px;border-radius:20px;}

  /* Comment form */
  .bp-comment-form{background:rgba(26,58,143,0.03);border:1px solid rgba(26,58,143,0.1);border-radius:16px;padding:20px;margin-bottom:28px;}
  .bp-comment-form-title{font-size:0.72rem;font-weight:800;color:var(--slate);text-transform:uppercase;letter-spacing:0.1em;margin:0 0 14px;}
  .bp-form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;}
  .bp-form-input{width:100%;padding:10px 14px;border:1px solid rgba(26,58,143,0.15);border-radius:10px;font-size:0.85rem;color:#0f172a;background:#fff;outline:none;font-family:inherit;transition:border-color 0.15s,box-shadow 0.15s;}
  .bp-form-input:focus{border-color:rgba(26,58,143,0.4);box-shadow:0 0 0 3px rgba(26,58,143,0.07);}
  .bp-form-textarea{width:100%;padding:10px 14px;border:1px solid rgba(26,58,143,0.15);border-radius:10px;font-size:0.85rem;color:#0f172a;background:#fff;outline:none;font-family:inherit;resize:vertical;min-height:90px;transition:border-color 0.15s,box-shadow 0.15s;margin-bottom:10px;}
  .bp-form-textarea:focus{border-color:rgba(26,58,143,0.4);box-shadow:0 0 0 3px rgba(26,58,143,0.07);}
  .bp-comment-submit{padding:10px 22px;border:none;border-radius:30px;background:linear-gradient(135deg,var(--royal),var(--sky));color:#fff;font-size:0.8rem;font-weight:800;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 14px rgba(26,58,143,0.2);}
  .bp-comment-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 6px 18px rgba(26,58,143,0.28);}
  .bp-comment-submit:disabled{opacity:0.6;cursor:not-allowed;}

  /* Comment list */
  .bp-comment-list{display:flex;flex-direction:column;gap:14px;}
  .bp-comment-item{background:#fff;border:1px solid rgba(26,58,143,0.08);border-radius:14px;padding:16px 18px;animation:cmtIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards;position:relative;}
  .bp-comment-item.is-mine{border-color:rgba(26,58,143,0.2);background:rgba(26,58,143,0.02);}
  @keyframes cmtIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  .bp-comment-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:8px;}
  .bp-comment-author{font-weight:800;font-size:0.85rem;color:var(--navy);display:flex;align-items:center;gap:7px;flex:1;min-width:0;}
  .bp-comment-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--royal),var(--sky));color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:900;flex-shrink:0;}
  .bp-comment-avatar.mine{background:linear-gradient(135deg,var(--gold),#f97316);}
  .bp-comment-date{font-size:0.68rem;color:var(--slate);font-weight:600;white-space:nowrap;}
  .bp-comment-body{font-size:0.88rem;color:#374151;line-height:1.7;margin:0;}
  .bp-comment-edited{font-size:0.65rem;color:var(--slate);font-style:italic;margin-left:6px;opacity:0.7;}
  .bp-no-comments{text-align:center;padding:28px;color:var(--slate);font-size:0.88rem;}

  /* Comment owner actions */
  .bp-comment-actions{display:flex;gap:5px;flex-shrink:0;}
  .bp-cmt-action-btn{padding:4px 10px;border-radius:20px;border:none;font-size:0.68rem;font-weight:800;cursor:pointer;transition:all 0.15s;display:inline-flex;align-items:center;gap:4px;}
  .bp-cmt-edit-btn{background:rgba(26,58,143,0.07);color:var(--royal);border:1px solid rgba(26,58,143,0.15);}
  .bp-cmt-edit-btn:hover{background:rgba(26,58,143,0.14);}
  .bp-cmt-delete-btn{background:rgba(239,68,68,0.07);color:#dc2626;border:1px solid rgba(239,68,68,0.15);}
  .bp-cmt-delete-btn:hover{background:rgba(239,68,68,0.14);}
  .bp-cmt-save-btn{background:linear-gradient(135deg,var(--royal),var(--sky));color:#fff;border:none;}
  .bp-cmt-save-btn:hover{filter:brightness(1.08);}
  .bp-cmt-cancel-btn{background:rgba(100,116,139,0.1);color:#475569;border:1px solid rgba(100,116,139,0.2);}
  .bp-cmt-cancel-btn:hover{background:rgba(100,116,139,0.18);}

  /* Inline edit textarea */
  .bp-comment-edit-area{width:100%;padding:8px 12px;border:1px solid rgba(26,58,143,0.25);border-radius:10px;font-size:0.88rem;color:#0f172a;background:#fff;outline:none;font-family:inherit;resize:vertical;min-height:70px;transition:border-color 0.15s,box-shadow 0.15s;margin:8px 0;}
  .bp-comment-edit-area:focus{border-color:rgba(26,58,143,0.4);box-shadow:0 0 0 3px rgba(26,58,143,0.07);}

  /* Mine badge */
  .bp-mine-badge{font-size:0.6rem;font-weight:800;background:rgba(245,158,11,0.15);color:#92400e;border:1px solid rgba(245,158,11,0.3);padding:1px 7px;border-radius:10px;text-transform:uppercase;letter-spacing:0.05em;flex-shrink:0;}

  /* Related */
  .bp-related-section{margin-top:clamp(20px,4vw,32px);padding-top:clamp(20px,4vw,30px);border-top:1px solid rgba(59,130,246,0.1);}
  .bp-related-title{font-family:'Playfair Display',serif;font-size:clamp(1.1rem,4vw,1.4rem);color:var(--navy);margin:0 0 18px;font-weight:800;}
  .bp-related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;}
  .bp-related-card{text-decoration:none;background:#fff;border-radius:14px;border:1px solid rgba(59,130,246,0.08);overflow:hidden;transition:transform 0.2s,box-shadow 0.2s;display:flex;flex-direction:column;}
  .bp-related-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(11,20,55,0.08);}
  .bp-related-img{width:100%;aspect-ratio:16/9;background:var(--light);display:flex;align-items:center;justify-content:center;font-size:1.5rem;overflow:hidden;}
  .bp-related-img img{width:100%;height:100%;object-fit:cover;}
  .bp-related-text{padding:12px;display:flex;flex-direction:column;gap:6px;}
  .bp-related-text h4{font-size:0.88rem;color:var(--navy);margin:0;font-weight:700;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .bp-related-text span{font-size:0.65rem;color:var(--slate);font-weight:600;text-transform:uppercase;}

  /* Footer CTA */
  .bp-footer-cta{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:clamp(14px,3.5vw,20px) clamp(16px,5vw,44px);background:rgba(59,130,246,0.03);border-top:1px solid rgba(59,130,246,0.09);}
  .bp-footer-cta-text{color:var(--slate);font-size:0.8rem;font-weight:500;}
  .bp-back-btn{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--royal),var(--sky));color:#fff;text-decoration:none;padding:9px 18px;border-radius:30px;font-size:0.72rem;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;box-shadow:0 4px 14px rgba(26,58,143,0.25);transition:transform 0.2s,box-shadow 0.2s;white-space:nowrap;}
  .bp-back-btn:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(26,58,143,0.32);}

  /* Skeleton */
  .skel-bg{background:linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);background-size:400% 100%;animation:skel-load 1.5s ease-in-out infinite;border-radius:6px;}
  @keyframes skel-load{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .bp-skeleton-cover{width:100%;aspect-ratio:16/7;background:linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);background-size:400% 100%;animation:skel-load 1.5s ease-in-out infinite;}

  /* Error / Not found */
  .bp-error{background:rgba(254,226,226,0.9);border:1px solid #fca5a5;color:#991b1b;padding:clamp(14px,4vw,20px);border-radius:16px;margin-bottom:20px;font-size:0.88rem;font-weight:600;display:flex;align-items:center;gap:10px;}
  .bp-not-found{text-align:center;padding:clamp(30px,8vw,60px) 20px;background:var(--card-bg);border-radius:24px;border:1px dashed rgba(59,130,246,0.2);}
  .bp-not-found h2{font-family:'Playfair Display',serif;color:var(--navy);font-size:clamp(1.2rem,4vw,1.6rem);margin:12px 0 8px;}
  .bp-not-found p{color:var(--slate);font-size:clamp(0.8rem,2vw,0.95rem);margin:0 0 20px;}

  /* Footer */
  .site-footer{background:var(--navy);color:rgba(255,255,255,0.6);padding:36px 24px;text-align:center;font-size:0.85rem;margin-top:40px;position:relative;z-index:2;}
  .site-footer strong{color:var(--gold-light);}
  .site-footer a{color:rgba(255,255,255,0.4);text-decoration:none;margin:0 10px;transition:color 0.2s;}
  .site-footer a:hover{color:#fff;}

  /* Toast */
  .bp-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--navy);color:#fff;padding:10px 22px;border-radius:30px;font-size:0.8rem;font-weight:700;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.2);pointer-events:none;white-space:nowrap;}

  /* Delete confirm overlay */
  .bp-confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9998;display:flex;align-items:center;justify-content:center;padding:20px;}
  .bp-confirm-box{background:#fff;border-radius:18px;padding:28px;width:min(380px,100%);box-shadow:0 20px 60px rgba(0,0,0,0.2);text-align:center;}
  .bp-confirm-icon{font-size:2.2rem;margin-bottom:10px;}
  .bp-confirm-title{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:800;color:var(--navy);margin:0 0 8px;}
  .bp-confirm-sub{font-size:0.85rem;color:var(--slate);margin:0 0 22px;line-height:1.5;}
  .bp-confirm-btns{display:flex;gap:10px;justify-content:center;}
  .bp-confirm-cancel{padding:9px 20px;border:1px solid #e2e8f0;border-radius:30px;background:#f8fafc;font-size:0.8rem;font-weight:700;cursor:pointer;color:#475569;}
  .bp-confirm-delete{padding:9px 20px;border:none;border-radius:30px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:0.8rem;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(239,68,68,0.25);}
  .bp-confirm-delete:hover{filter:brightness(1.08);}

  @media(max-width:640px){
    .site-footer{padding:18px 14px;font-size:0.72rem;margin-top:24px;}
    .bp-footer-cta{justify-content:center;text-align:center;}
    .bp-related-grid{grid-template-columns:repeat(2,1fr);gap:10px;}
    .bp-engage{gap:7px;}
    .bp-share-group{margin-left:0;width:100%;}
    .bp-form-row{grid-template-columns:1fr;}
    .bp-share-btn{padding:7px 10px;font-size:0.68rem;}
    .bp-comment-actions{flex-direction:column;gap:3px;}
  }
  @media(max-width:360px){
    .bp-title{font-size:1.25rem;}
    .bp-body{padding:14px 12px;}
    .bp-footer-cta{padding:12px;}
  }
`;

/* ─── Helpers ─── */
function isUrdu(text) {
  if (!text) return false;
  return /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

function getFingerprint() {
  let fp = localStorage.getItem("bp_fp");
  if (!fp) { fp = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("bp_fp", fp); }
  return fp;
}

function sanitizeHtml(html) {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  ["script","style","iframe","object","embed","form","input","button","meta"].forEach(tag =>
    tmp.querySelectorAll(tag).forEach(el => el.remove())
  );
  tmp.querySelectorAll("a").forEach(a => {
    a.setAttribute("target","_blank");
    a.setAttribute("rel","noopener noreferrer");
    const href = a.getAttribute("href") || "";
    if (href.toLowerCase().startsWith("javascript:")) a.removeAttribute("href");
    else if (href && !href.startsWith("http") && !href.startsWith("/") && !href.startsWith("#") && !href.startsWith("mailto:"))
      a.setAttribute("href",`https://${href}`);
  });
  return tmp.innerHTML;
}

function estimateReadTime(html) {
  if (!html) return null;
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const words = (tmp.innerText || "").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function buildTOC(html) {
  if (!html) return { toc: [], html: "" };
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const items = [];
  tmp.querySelectorAll("h2,h3,h4").forEach((h, i) => {
    const id = `bp-h-${i}`;
    h.setAttribute("id", id);
    items.push({ id, text: h.innerText || h.textContent || "", tag: h.tagName.toLowerCase() });
  });
  return { toc: items, html: tmp.innerHTML };
}

function getRenderedHtml(post) {
  const raw = post.content_html ||
    (post.content ? post.content.split("\n").filter(l => l.trim()).map(l => `<p>${l}</p>`).join("") : "");
  return sanitizeHtml(raw);
}

function formatDate(d) {
  if (!d) return "New";
  return new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}

function setFullMeta({ title, description, canonical, image, author, datePublished, tags }) {
  document.title = title;
  const sm = (name, content, prop = false) => {
    const attr = prop ? "property" : "name";
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
    el.setAttribute("content", content || "");
  };
  const sl = (rel, href) => {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
    el.setAttribute("href", href);
  };
  sm("description", description);
  sl("canonical", canonical || window.location.href);
  sm("og:type","article",true); sm("og:title",title,true); sm("og:description",description,true);
  sm("og:url",canonical||window.location.href,true); sm("og:site_name","AIDLA",true);
  if (image) sm("og:image",image,true);
  sm("twitter:card", image ? "summary_large_image" : "summary");
  sm("twitter:title",title); sm("twitter:description",description);
  if (image) sm("twitter:image",image);
  if (author) sm("article:author",author,true);
  if (datePublished) sm("article:published_time",datePublished,true);
  let ld = document.querySelector("#bp-jsonld");
  if (!ld) { ld = document.createElement("script"); ld.id="bp-jsonld"; ld.type="application/ld+json"; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({
    "@context":"https://schema.org","@type":"Article",
    "headline":title,"description":description,
    "image":image?[image]:undefined,
    "author":{"@type":"Person","name":author||"AIDLA Team"},
    "publisher":{"@type":"Organization","name":"AIDLA"},
    "datePublished":datePublished,
    "mainEntityOfPage":{"@type":"WebPage","@id":canonical||window.location.href},
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
  }, []);
  return progress;
}

/* ─── Delete Confirm Dialog ─── */
function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div className="bp-confirm-overlay" onClick={onCancel}>
      <motion.div
        className="bp-confirm-box"
        initial={{ opacity:0, scale:0.9, y:16 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.9, y:16 }}
        transition={{ duration:0.2 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="bp-confirm-icon">🗑️</div>
        <div className="bp-confirm-title">Delete Comment?</div>
        <div className="bp-confirm-sub">This action cannot be undone. Your comment will be permanently removed.</div>
        <div className="bp-confirm-btns">
          <button className="bp-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="bp-confirm-delete" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Single Comment Item ─── */
function CommentItem({ comment, isMine, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = async () => {
    if (!editBody.trim() || editBody.trim() === comment.body) { setEditing(false); return; }
    setSaving(true);
    await onEdit(comment.id, editBody.trim());
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditBody(comment.body);
    setEditing(false);
  };

  return (
    <>
      <div className={`bp-comment-item${isMine ? " is-mine" : ""}`}>
        <div className="bp-comment-header">
          <div className="bp-comment-author">
            <div className={`bp-comment-avatar${isMine ? " mine" : ""}`}>
              {(comment.author_name || "?")[0].toUpperCase()}
            </div>
            <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {comment.author_name}
            </span>
            {isMine && <span className="bp-mine-badge">You</span>}
            {comment.edited_at && <span className="bp-comment-edited">(edited)</span>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <span className="bp-comment-date">{formatDate(comment.created_at)}</span>
            {isMine && !editing && (
              <div className="bp-comment-actions">
                <button className="bp-cmt-action-btn bp-cmt-edit-btn" onClick={() => { setEditBody(comment.body); setEditing(true); }}>
                  ✏️ Edit
                </button>
                <button className="bp-cmt-action-btn bp-cmt-delete-btn" onClick={() => setShowConfirm(true)}>
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {editing ? (
          <>
            <textarea
              className="bp-comment-edit-area"
              value={editBody}
              onChange={e => setEditBody(e.target.value)}
              autoFocus
            />
            <div style={{ display:"flex", gap:7 }}>
              <button className="bp-cmt-action-btn bp-cmt-save-btn" onClick={handleSave} disabled={saving || !editBody.trim()}>
                {saving ? "Saving…" : "✅ Save"}
              </button>
              <button className="bp-cmt-action-btn bp-cmt-cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className="bp-comment-body">{comment.body}</p>
        )}
      </div>

      <AnimatePresence>
        {showConfirm && (
          <ConfirmDialog
            onConfirm={() => { setShowConfirm(false); onDelete(comment.id); }}
            onCancel={() => setShowConfirm(false)}
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

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [toc, setToc] = useState([]);
  const [tocOpen, setTocOpen] = useState(true);
  const [renderedHtml, setRenderedHtml] = useState("");

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [cmtName, setCmtName] = useState("");
  const [cmtEmail, setCmtEmail] = useState("");
  const [cmtBody, setCmtBody] = useState("");
  const [cmtLoading, setCmtLoading] = useState(false);

  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = useCallback((m) => { setToast(m); setTimeout(() => setToast(""), 2800); }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      setLoading(true); setErrorMsg("");

      const { data, error } = await supabase.from("blogs_posts").select("*")
        .is("deleted_at",null).eq("status","published").eq("slug",slug).maybeSingle();
      if (error) { setErrorMsg(error.message); setPost(null); setLoading(false); return; }
      if (!data) { setPost(null); setLoading(false); return; }
      setPost(data);

      const rawHtml = getRenderedHtml(data);
      const { toc: tocItems, html: processedHtml } = buildTOC(rawHtml);
      setToc(tocItems);
      setRenderedHtml(processedHtml);

      const { data: rel } = await supabase.from("blogs_posts")
        .select("id,title,slug,cover_image_url,published_at")
        .is("deleted_at",null).eq("status","published").neq("slug",slug).limit(4);
      if (rel) setRelatedPosts(rel);

      const { count } = await supabase.from("blogs_likes")
        .select("*",{count:"exact",head:true}).eq("post_id",data.id);
      setLikeCount(count||0);
      const { data: myLike } = await supabase.from("blogs_likes")
        .select("id").eq("post_id",data.id).eq("fingerprint",fp).maybeSingle();
      setLiked(!!myLike);

      const { data: cmts } = await supabase.from("blogs_comments")
        .select("*").eq("post_id",data.id).order("created_at",{ascending:true});
      if (cmts) setComments(cmts);

      setFullMeta({
        title: data.meta_title || data.title,
        description: data.meta_description || data.excerpt || "",
        canonical: data.canonical_url || `https://aidla.netlify.app/blogs/${slug}`,
        image: data.cover_image_url || "",
        author: data.author_name || "AIDLA Team",
        datePublished: data.published_at,
        tags: data.tags || [],
      });

      setLoading(false);
    };
    load();
  }, [slug]);

  const handleLike = async () => {
    if (!post || likeLoading) return;
    setLikeLoading(true);
    const { data, error } = await supabase.rpc("blogs_toggle_like",{ p_post_id:post.id, p_fingerprint:fp });
    if (!error && data?.ok) { setLiked(data.liked); setLikeCount(data.count); }
    setLikeLoading(false);
  };

  const handleComment = async () => {
    if (!post || cmtLoading) return;
    setCmtLoading(true);
    const { data, error } = await supabase.rpc("blogs_add_comment",{
      p_post_id:post.id, p_author_name:cmtName,
      p_author_email:cmtEmail, p_body:cmtBody,
      p_fingerprint:fp,
    });
    if (error || !data?.ok) { showToast(data?.error || error?.message || "Failed to post"); }
    else {
      setComments(prev => [...prev,{
        id:data.id, author_name:cmtName, body:cmtBody,
        fingerprint:fp, created_at:new Date().toISOString(), edited_at:null,
      }]);
      setCmtName(""); setCmtEmail(""); setCmtBody("");
      showToast("Comment posted! 🎉");
    }
    setCmtLoading(false);
  };

  const handleDeleteComment = async (id) => {
    const { error } = await supabase.from("blogs_comments").delete().eq("id",id).eq("fingerprint",fp);
    if (error) { showToast("Could not delete comment"); return; }
    setComments(prev => prev.filter(c => c.id !== id));
    showToast("Comment deleted");
  };

  const handleEditComment = async (id, newBody) => {
    const { error } = await supabase.from("blogs_comments")
      .update({ body:newBody, edited_at:new Date().toISOString() })
      .eq("id",id).eq("fingerprint",fp);
    if (error) { showToast("Could not update comment"); return; }
    setComments(prev => prev.map(c => c.id===id ? { ...c, body:newBody, edited_at:new Date().toISOString() } : c));
    showToast("Comment updated ✅");
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = post?.title || "Check this out";
    if (platform==="wa") window.open(`https://wa.me/?text=${encodeURIComponent(text+" "+url)}`,"_blank");
    else if (platform==="tw") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,"_blank");
    else { navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000); showToast("Link copied! 📋"); }); }
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

  return (
    <div className="blogpost-root">
      <style>{styles}</style>

      <div className="bp-progress-bar" style={{ width:`${progress}%` }} />

      <AnimatePresence>
        {toast && (
          <motion.div className="bp-toast"
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}} transition={{duration:0.25}}
          >{toast}</motion.div>
        )}
      </AnimatePresence>

      <div className="bp-orbs"><div className="bp-orb-1"/><div className="bp-orb-2"/><div className="bp-orb-3"/></div>

      <div className="blogpost-container">
        <motion.div {...fadeUp}>
          <Link to="/blogs" className="bp-back">‹ All Insights</Link>
        </motion.div>

        {errorMsg && <motion.div className="bp-error" {...fadeUp}><span>⚠️</span>{errorMsg}</motion.div>}

        {/* Skeleton */}
        {loading && (
          <motion.div className="bp-article-card" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="bp-skeleton-cover"/>
            <div className="bp-body">
              {[80,90,60,100,100,78,100,95,82].map((w,i) => (
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
                <span className="bp-read-time">❤️ {likeCount} {likeCount===1?"like":"likes"}</span>
              </div>

              {post.tags?.length > 0 && (
                <div className="bp-tags">
                  {post.tags.map(t => <span key={t} className="bp-tag"># {t}</span>)}
                </div>
              )}

              {post.excerpt && <p className="bp-excerpt">{post.excerpt}</p>}

              {toc.length > 1 && (
                <div className="bp-toc">
                  <div className="bp-toc-title" onClick={() => setTocOpen(v=>!v)}>
                    📋 Table of Contents
                    <span style={{marginLeft:"auto",fontSize:"0.8em"}}>{tocOpen?"▲":"▼"}</span>
                  </div>
                  {tocOpen && (
                    <ul className="bp-toc-list">
                      {toc.map(item => (
                        <li key={item.id} className={`bp-toc-item ${item.tag}`}>
                          <a href={`#${item.id}`} onClick={e => {
                            e.preventDefault();
                            document.getElementById(item.id)?.scrollIntoView({behavior:"smooth",block:"start"});
                          }}>{item.text}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="bp-divider"/>

              <div
                className="bp-content"
                dir={urduTitle?"rtl":"ltr"}
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />

              {relatedPosts.length > 0 && (
                <div className="bp-related-section">
                  <h3 className="bp-related-title">You might also like...</h3>
                  <div className="bp-related-grid">
                    {relatedPosts.map(rp => (
                      <Link to={`/blogs/${rp.slug}`} key={rp.id} className="bp-related-card">
                        <div className="bp-related-img">
                          {rp.cover_image_url?<img src={rp.cover_image_url} alt={rp.title} loading="lazy"/>:<span>📰</span>}
                        </div>
                        <div className="bp-related-text">
                          <h4>{rp.title}</h4>
                          <span>{formatDate(rp.published_at)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Engagement bar */}
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
                💬 Comments <span className="bp-comment-count">{comments.length}</span>
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

              {/* List */}
              {comments.length === 0
                ? <div className="bp-no-comments">No comments yet. Be the first! 💭</div>
                : (
                  <div className="bp-comment-list">
                    {comments.map(c => (
                      <CommentItem
                        key={c.id}
                        comment={c}
                        isMine={c.fingerprint === fp}
                        onDelete={handleDeleteComment}
                        onEdit={handleEditComment}
                      />
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