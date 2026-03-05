import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');

  :root{
    --navy:#0b1437;--amber:#d97706;--amber-light:#f59e0b;--amber-pale:#fef3c7;
    --slate:#64748b;--card-bg:rgba(255,255,255,0.97);
  }
  *{box-sizing:border-box;}

  .np-root{min-height:100vh;background:linear-gradient(160deg,#fffbf0 0%,#fff7ed 50%,#fef3c7 100%);font-family:'DM Sans',sans-serif;overflow-x:hidden;position:relative;display:flex;flex-direction:column;}

  .np-progress{position:fixed;top:0;left:0;height:3px;z-index:9999;background:linear-gradient(90deg,var(--amber),var(--amber-light),#f97316);transition:width 0.1s linear;border-radius:0 2px 2px 0;box-shadow:0 0 8px rgba(217,119,6,0.5);}

  .np-orbs{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
  .np-orb-1{position:absolute;width:600px;height:600px;border-radius:50%;background:rgba(217,119,6,0.06);filter:blur(80px);top:-200px;left:-200px;}
  .np-orb-2{position:absolute;width:500px;height:500px;border-radius:50%;background:rgba(245,158,11,0.05);filter:blur(80px);top:300px;right:-250px;}

  .np-container{flex:1;width:100%;max-width:860px;margin:0 auto;padding:24px 16px 48px;position:relative;z-index:2;}

  .np-back{display:inline-flex;align-items:center;gap:6px;color:var(--amber);font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;text-decoration:none;background:rgba(217,119,6,0.08);padding:8px 16px;border-radius:30px;margin-bottom:20px;transition:background 0.2s,transform 0.2s;}
  .np-back:active{transform:scale(0.96);}

  .np-article{background:var(--card-bg);border-radius:16px;box-shadow:0 8px 40px rgba(11,20,55,0.07);border:1px solid rgba(217,119,6,0.08);overflow:hidden;}

  .np-cover-wrap{width:100%;aspect-ratio:16/9;overflow:hidden;position:relative;background:linear-gradient(135deg,#d97706,#f59e0b);}
  .np-cover-wrap img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 6s ease;}
  .np-cover-wrap::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 55%,rgba(11,20,55,0.3) 100%);}
  .np-cover-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;}
  .np-cover-dl{position:absolute;bottom:12px;right:12px;z-index:3;background:rgba(255,255,255,0.92);color:var(--navy);border:none;border-radius:30px;padding:8px 14px;font-size:0.75rem;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 4px 14px rgba(0,0,0,0.15);transition:transform 0.2s;backdrop-filter:blur(8px);}
  .np-cover-dl:active{transform:translateY(2px);}

  .np-body{padding:20px 16px;}
  .np-label{display:inline-block;background:linear-gradient(135deg,var(--amber),var(--amber-light));color:#fff;padding:5px 12px;border-radius:30px;font-size:0.7rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px;box-shadow:0 4px 12px rgba(217,119,6,0.25);}
  .np-readtime{display:inline-flex;align-items:center;gap:5px;background:rgba(16,185,129,0.1);color:#065f46;border:1px solid rgba(16,185,129,0.25);padding:5px 10px;border-radius:30px;font-size:0.7rem;font-weight:800;margin-bottom:8px;margin-left:8px;}

  .np-breaking-badge{display:inline-flex;align-items:center;gap:4px;background:rgba(239,68,68,0.9);color:#fff;padding:4px 10px;border-radius:8px;font-size:0.65rem;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px;animation:npBreath 1.5s ease-in-out infinite;}
  @keyframes npBreath{0%,100%{opacity:1}50%{opacity:0.65}}

  .np-cat-badge{display:inline-flex;align-items:center;padding:4px 12px;border-radius:20px;font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:10px;margin-left:6px;}

  .np-title{font-family:'Playfair Display',serif;font-size:1.65rem;font-weight:900;color:var(--navy);line-height:1.2;margin:0 0 16px;word-break:break-word;}
  .np-title.urdu{font-family:'Noto Nastaliq Urdu',serif;direction:rtl;text-align:right;line-height:1.8;}

  .np-meta{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(217,119,6,0.1);}
  .np-author{display:inline-flex;align-items:center;gap:6px;font-weight:700;color:var(--navy);font-size:0.85rem;}
  .np-author-icon{background:rgba(217,119,6,0.1);color:var(--amber);border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;}
  .np-date-pill{background:rgba(217,119,6,0.1);color:var(--amber);padding:4px 10px;border-radius:10px;font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;}
  .np-dot{width:4px;height:4px;border-radius:50%;background:var(--slate);opacity:0.4;}
  .np-stat-text{color:var(--slate);font-size:0.75rem;font-weight:600;}

  .np-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
  .np-tag{background:rgba(217,119,6,0.07);color:var(--amber);border:1px solid rgba(217,119,6,0.15);padding:4px 12px;border-radius:20px;font-size:0.7rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;}

  .np-excerpt{font-size:0.95rem;color:#92400e;font-style:italic;line-height:1.65;margin:0 0 24px;padding:16px;border-left:3px solid var(--amber);background:rgba(217,119,6,0.04);border-radius:0 12px 12px 0;}

  /* TOC */
  .np-toc{background:rgba(217,119,6,0.04);border:1px solid rgba(217,119,6,0.1);border-radius:16px;padding:16px;margin-bottom:24px;}
  .np-toc-title{font-size:0.8rem;font-weight:800;color:var(--amber);text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;}
  .np-toc-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;}
  .np-toc-item a{color:var(--slate);font-size:0.9rem;font-weight:600;text-decoration:none;transition:color 0.15s;display:flex;align-items:center;gap:6px;padding:4px 0;touch-action:manipulation;}
  .np-toc-item a::before{content:'#';font-size:0.7em;opacity:0.35;font-weight:900;}
  .np-toc-item.h3 a{padding-left:14px;font-size:0.85rem;}
  .np-toc-item.h4 a{padding-left:28px;font-size:0.8rem;}

  .np-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(217,119,6,0.2),transparent);margin:24px 0;}

  /* Article content */
  .np-content{color:#2d3748;font-size:1rem;line-height:1.8;word-break:break-word;overflow-wrap:break-word;}
  .np-content p{margin:0 0 16px;}
  .np-content h1{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:900;color:var(--navy);margin:28px 0 12px;line-height:1.2;}
  .np-content h2{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:800;color:var(--navy);margin:24px 0 10px;padding-bottom:8px;border-bottom:2px solid rgba(217,119,6,0.12);}
  .np-content h3{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:800;color:var(--navy);margin:20px 0 8px;}
  .np-content h4{font-size:1.05rem;font-weight:700;color:var(--navy);margin:18px 0 6px;}
  .np-content h5,.np-content h6{font-size:1rem;font-weight:700;color:var(--slate);margin:14px 0 4px;}
  .np-content a{color:var(--amber);font-weight:600;text-decoration:underline;text-underline-offset:3px;}
  .np-content a[target="_blank"]::after{content:" ↗";font-size:0.75em;opacity:0.7;font-weight:400;}
  .np-content img{max-width:100%;height:auto;border-radius:12px;margin:20px 0;box-shadow:0 6px 24px rgba(11,20,55,0.1);display:block;}
  .np-content ul,.np-content ol{padding-left:24px;margin:0 0 16px;}
  .np-content li{margin-bottom:8px;line-height:1.7;}
  .np-content ul li::marker{color:var(--amber);}
  .np-content ol li::marker{color:#d97706;font-weight:700;}
  .np-content blockquote{margin:20px 0;padding:14px 16px;border-left:4px solid var(--amber);background:rgba(217,119,6,0.05);border-radius:0 12px 12px 0;font-style:italic;color:var(--slate);}
  .np-content pre{background:var(--navy);color:#e2e8f0;padding:16px;border-radius:12px;overflow-x:auto;font-size:0.85rem;line-height:1.6;margin:20px 0;-webkit-overflow-scrolling:touch;}
  .np-content code{background:rgba(217,119,6,0.1);color:#92400e;padding:3px 6px;border-radius:5px;font-size:0.85em;font-family:'Courier New',monospace;}
  .np-content pre code{background:none;color:inherit;padding:0;}
  .np-content table{width:100%;border-collapse:collapse;margin:20px 0;font-size:0.9em;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(11,20,55,0.06);display:block;overflow-x:auto;-webkit-overflow-scrolling:touch;}
  .np-content th{background:#d97706;color:#fff;padding:12px;text-align:left;font-weight:700;}
  .np-content td{padding:10px 12px;border-bottom:1px solid rgba(217,119,6,0.08);color:#374151;white-space:nowrap;}
  .np-content tr:last-child td{border-bottom:none;}
  .np-content tr:nth-child(even) td{background:rgba(217,119,6,0.025);}
  .np-content hr{border:none;border-top:2px solid rgba(217,119,6,0.12);margin:28px 0;}
  .np-content mark{background:#fef08a;font-weight:700;border-radius:3px;padding:0 2px;}

  /* Engagement Bar */
  .np-engage{display:flex;flex-direction:column;align-items:stretch;gap:14px;padding:20px 16px;border-top:1px solid rgba(217,119,6,0.08);border-bottom:1px solid rgba(217,119,6,0.08);background:rgba(217,119,6,0.02);}
  .np-like-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:30px;border:2px solid rgba(239,68,68,0.2);background:#fff;cursor:pointer;font-size:0.9rem;font-weight:800;color:#64748b;transition:all 0.2s;user-select:none;width:100%;}
  .np-like-btn:active{transform:scale(0.97);}
  .np-like-btn.liked{border-color:#ef4444;background:rgba(239,68,68,0.07);color:#dc2626;}
  .np-like-btn .heart{font-size:1.2rem;transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);}
  .np-like-btn.liked .heart{transform:scale(1.3);}
  .np-share-group{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;}
  .np-share-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:12px 10px;border-radius:12px;border:none;font-size:0.8rem;font-weight:800;cursor:pointer;transition:all 0.2s;}
  .np-share-wa{background:#25d366;color:#fff;}
  .np-share-tw{background:#1da1f2;color:#fff;}
  .np-share-copy{background:rgba(100,116,139,0.1);color:#475569;border:1px solid rgba(100,116,139,0.2);grid-column:span 2;}
  .np-share-copy.copied{background:rgba(16,185,129,0.1);color:#065f46;border-color:rgba(16,185,129,0.3);}

  /* Related Posts */
  .np-related{margin-top:32px;padding-top:24px;border-top:1px solid rgba(217,119,6,0.1);}
  .np-related-title{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--navy);margin:0 0 20px;font-weight:800;}
  .np-related-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .np-related-card{text-decoration:none;background:#fff;border-radius:12px;border:1px solid rgba(217,119,6,0.08);overflow:hidden;transition:transform 0.2s,box-shadow 0.2s;display:flex;flex-direction:column;}
  .np-related-card:active{transform:scale(0.97);}
  .np-related-img{width:100%;aspect-ratio:16/9;background:var(--amber-pale);display:flex;align-items:center;justify-content:center;font-size:1.5rem;overflow:hidden;}
  .np-related-img img{width:100%;height:100%;object-fit:cover;}
  .np-related-text{padding:12px;}
  .np-related-text h4{font-size:0.85rem;color:var(--navy);margin:0 0 4px;font-weight:700;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .np-related-text span{font-size:0.65rem;color:var(--slate);font-weight:600;text-transform:uppercase;}

  /* Footer CTA */
  .np-footer-cta{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px 16px;background:rgba(217,119,6,0.03);border-top:1px solid rgba(217,119,6,0.09);text-align:center;}
  .np-footer-cta-text{color:var(--slate);font-size:0.9rem;font-weight:500;}
  .np-back-btn{display:inline-flex;align-items:center;justify-content:center;width:100%;gap:6px;background:linear-gradient(135deg,var(--amber),var(--amber-light));color:#fff;text-decoration:none;padding:14px 20px;border-radius:30px;font-size:0.85rem;font-weight:800;text-transform:uppercase;box-shadow:0 4px 14px rgba(217,119,6,0.3);transition:transform 0.2s;}

  /* ── Comments ── */
  .np-comments{padding:24px 16px;}
  .np-comments-title{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--navy);font-weight:800;margin:0 0 20px;display:flex;align-items:center;gap:8px;}
  .np-cmt-count{font-size:0.8rem;font-weight:700;background:rgba(217,119,6,0.1);color:var(--amber);padding:3px 12px;border-radius:20px;}

  .np-cmt-form{background:rgba(217,119,6,0.03);border:1px solid rgba(217,119,6,0.1);border-radius:16px;padding:16px;margin-bottom:24px;}
  .np-cmt-form-title{font-size:0.75rem;font-weight:800;color:var(--slate);text-transform:uppercase;letter-spacing:0.1em;margin:0 0 14px;}
  .np-form-row{display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:12px;}
  .np-form-input{width:100%;padding:12px 14px;border:1px solid rgba(217,119,6,0.15);border-radius:10px;font-size:1rem;color:#0f172a;background:#fff;outline:none;font-family:inherit;transition:border-color 0.15s,box-shadow 0.15s;appearance:none;}
  .np-form-input:focus{border-color:rgba(217,119,6,0.4);box-shadow:0 0 0 3px rgba(217,119,6,0.07);}
  .np-form-textarea{width:100%;padding:12px 14px;border:1px solid rgba(217,119,6,0.15);border-radius:10px;font-size:1rem;color:#0f172a;background:#fff;outline:none;font-family:inherit;resize:vertical;min-height:100px;margin-bottom:12px;transition:border-color 0.15s;appearance:none;}
  .np-form-textarea:focus{border-color:rgba(217,119,6,0.4);box-shadow:0 0 0 3px rgba(217,119,6,0.07);}
  .np-cmt-submit{width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,var(--amber),var(--amber-light));color:#fff;font-size:0.9rem;font-weight:800;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 14px rgba(217,119,6,0.2);}
  .np-cmt-submit:active:not(:disabled){transform:translateY(2px);}
  .np-cmt-submit:disabled{opacity:0.6;cursor:not-allowed;}

  /* Comment tree */
  .np-cmt-list{display:flex;flex-direction:column;gap:16px;}
  .np-cmt-thread{display:flex;flex-direction:column;gap:10px;}
  .np-cmt-item{background:#fff;border:1px solid rgba(217,119,6,0.08);border-radius:14px;padding:16px;position:relative;animation:npCmtIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards;}
  .np-cmt-item.mine{border-color:rgba(217,119,6,0.25);background:rgba(217,119,6,0.02);}
  .np-cmt-item.pinned{border-color:rgba(245,158,11,0.4);background:rgba(245,158,11,0.03);}
  .np-cmt-item.flagged{opacity:0.6;}
  .np-cmt-replies{margin-top:10px;margin-left:12px;display:flex;flex-direction:column;gap:10px;border-left:2px solid rgba(217,119,6,0.12);padding-left:12px;}
  @keyframes npCmtIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

  .np-cmt-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:8px;}
  .np-cmt-author-row{display:flex;align-items:center;gap:8px;flex:1;min-width:0;flex-wrap:wrap;}
  .np-cmt-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--amber),var(--amber-light));color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:900;flex-shrink:0;}
  .np-cmt-avatar.mine{background:linear-gradient(135deg,#0b1437,#1a3a8f);}
  .np-cmt-name{font-weight:800;font-size:0.9rem;color:var(--navy);}
  .np-cmt-date{font-size:0.7rem;color:var(--slate);font-weight:600;white-space:nowrap;}
  .np-mine-badge{font-size:0.6rem;font-weight:800;background:rgba(217,119,6,0.15);color:#92400e;border:1px solid rgba(217,119,6,0.3);padding:2px 8px;border-radius:10px;text-transform:uppercase;flex-shrink:0;}
  .np-pin-badge{font-size:0.6rem;font-weight:800;background:rgba(245,158,11,0.2);color:#78350f;border:1px solid rgba(245,158,11,0.35);padding:2px 8px;border-radius:10px;flex-shrink:0;}
  .np-cmt-edited{font-size:0.65rem;color:var(--slate);font-style:italic;opacity:0.7;}
  .np-cmt-body{font-size:0.95rem;color:#374151;line-height:1.6;margin:0 0 12px;}

  .np-cmt-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
  .np-cmt-like-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:20px;border:1px solid rgba(239,68,68,0.18);background:#fff;cursor:pointer;font-size:0.75rem;font-weight:800;color:#64748b;transition:all 0.15s;user-select:none;}
  .np-cmt-like-btn.liked{border-color:#ef4444;color:#dc2626;background:rgba(239,68,68,0.05);}
  .np-cmt-reply-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:20px;border:1px solid rgba(217,119,6,0.15);background:#fff;cursor:pointer;font-size:0.75rem;font-weight:800;color:var(--slate);transition:all 0.15s;}
  .np-cmt-action-btn{padding:6px 12px;border-radius:20px;border:none;font-size:0.75rem;font-weight:800;cursor:pointer;transition:all 0.15s;display:inline-flex;align-items:center;gap:4px;}
  .np-cmt-edit-btn{background:rgba(217,119,6,0.07);color:#92400e;border:1px solid rgba(217,119,6,0.15);}
  .np-cmt-del-btn{background:rgba(239,68,68,0.07);color:#dc2626;border:1px solid rgba(239,68,68,0.15);}
  .np-cmt-save-btn{background:linear-gradient(135deg,var(--amber),var(--amber-light));color:#fff;border:none;}
  .np-cmt-cancel-btn{background:rgba(100,116,139,0.1);color:#475569;border:1px solid rgba(100,116,139,0.2);}
  .np-cmt-flag-btn{background:rgba(239,68,68,0.07);color:#dc2626;border:1px solid rgba(239,68,68,0.15);font-size:0.7rem;}
  .np-cmt-flag-btn.flagged{opacity:0.5;cursor:default;}

  .np-cmt-edit-area{width:100%;padding:12px;border:1px solid rgba(217,119,6,0.25);border-radius:10px;font-size:1rem;color:#0f172a;background:#fff;outline:none;font-family:inherit;resize:vertical;min-height:80px;margin:8px 0 12px;transition:border-color 0.15s;appearance:none;}
  .np-cmt-edit-area:focus{border-color:rgba(217,119,6,0.4);box-shadow:0 0 0 3px rgba(217,119,6,0.07);}

  .np-reply-form{background:rgba(217,119,6,0.03);border:1px solid rgba(217,119,6,0.1);border-radius:12px;padding:14px;margin-top:12px;}
  .np-reply-form-title{font-size:0.7rem;font-weight:800;color:var(--slate);text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;}
  .np-reply-row{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:10px;}
  .np-reply-textarea{width:100%;padding:10px 12px;border:1px solid rgba(217,119,6,0.15);border-radius:10px;font-size:1rem;color:#0f172a;background:#fff;outline:none;font-family:inherit;resize:vertical;min-height:80px;margin-bottom:12px;transition:border-color 0.15s;appearance:none;}
  .np-reply-textarea:focus{border-color:rgba(217,119,6,0.4);box-shadow:0 0 0 3px rgba(217,119,6,0.07);}
  .np-reply-actions{display:flex;flex-direction:column;gap:8px;}
  .np-reply-submit{padding:12px 16px;border:none;border-radius:12px;background:linear-gradient(135deg,var(--amber),var(--amber-light));color:#fff;font-size:0.85rem;font-weight:800;cursor:pointer;text-align:center;}
  .np-reply-submit:disabled{opacity:0.5;cursor:not-allowed;}
  .np-reply-cancel{padding:12px 14px;border:1px solid rgba(100,116,139,0.2);border-radius:12px;background:#fff;font-size:0.85rem;font-weight:700;color:#475569;cursor:pointer;text-align:center;}
  .np-no-comments{text-align:center;padding:32px 16px;color:var(--slate);font-size:0.95rem;}

  /* Toast */
  .np-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--navy);color:#fff;padding:12px 24px;border-radius:30px;font-size:0.85rem;font-weight:700;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.2);pointer-events:none;white-space:nowrap;}

  /* Confirm Dialog */
  .np-confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9998;display:flex;align-items:center;justify-content:center;padding:20px;}
  .np-confirm-box{background:#fff;border-radius:18px;padding:24px;width:min(340px,100%);box-shadow:0 20px 60px rgba(0,0,0,0.2);text-align:center;}
  .np-confirm-icon{font-size:2.2rem;margin-bottom:12px;}
  .np-confirm-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:800;color:var(--navy);margin:0 0 10px;}
  .np-confirm-sub{font-size:0.9rem;color:var(--slate);margin:0 0 24px;line-height:1.5;}
  .np-confirm-btns{display:flex;flex-direction:column;gap:10px;}
  .np-confirm-delete{padding:12px;border:none;border-radius:12px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:0.9rem;font-weight:800;cursor:pointer;}
  .np-confirm-cancel{padding:12px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;font-size:0.9rem;font-weight:700;cursor:pointer;color:#475569;}

  /* Skeletons */
  .skel-bg{background:linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);background-size:400% 100%;animation:skelLoad 1.5s ease-in-out infinite;border-radius:6px;}
  @keyframes skelLoad{0%{background-position:200% 0}100%{background-position:-200% 0}}
  .np-skel-cover{width:100%;aspect-ratio:16/9;background:linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);background-size:400% 100%;animation:skelLoad 1.5s ease-in-out infinite;}

  .np-error{background:rgba(254,226,226,0.9);border:1px solid #fca5a5;color:#991b1b;padding:16px;border-radius:12px;margin-bottom:20px;font-size:0.9rem;font-weight:600;display:flex;align-items:center;gap:10px;}
  .np-not-found{text-align:center;padding:40px 20px;background:var(--card-bg);border-radius:16px;border:1px dashed rgba(217,119,6,0.2);}
  .np-not-found h2{font-family:'Playfair Display',serif;color:var(--navy);font-size:1.4rem;margin:12px 0 8px;}
  .np-not-found p{color:var(--slate);font-size:0.9rem;margin:0 0 24px;}

  .site-footer{background:var(--navy);color:rgba(255,255,255,0.6);padding:32px 16px;text-align:center;font-size:0.8rem;margin-top:auto;position:relative;z-index:2;}
  .site-footer strong{color:#fcd34d;}
  .site-footer p>a{display:inline-block;color:rgba(255,255,255,0.4);text-decoration:none;padding:8px;margin:4px;transition:color 0.2s;}

  @media(min-width:640px){
    .np-container{padding:40px 24px 60px;}
    .np-article{border-radius:24px;}
    .np-cover-wrap{aspect-ratio:16/7;}
    .np-body,.np-comments{padding:32px 32px;}
    .np-title{font-size:2.2rem;}
    .np-excerpt{font-size:1.05rem;padding:20px;}
    .np-content{font-size:1.05rem;}
    .np-engage{flex-direction:row;align-items:center;padding:24px 32px;}
    .np-like-btn{width:auto;padding:10px 20px;}
    .np-share-group{display:flex;width:auto;margin-left:auto;gap:8px;}
    .np-share-btn{padding:10px 16px;border-radius:30px;font-size:0.8rem;}
    .np-share-copy{grid-column:auto;}
    .np-form-row{grid-template-columns:1fr 1fr;}
    .np-cmt-submit{width:auto;padding:12px 28px;border-radius:30px;}
    .np-cmt-replies{margin-left:28px;padding-left:20px;}
    .np-reply-row{grid-template-columns:1fr 1fr;}
    .np-reply-actions{flex-direction:row;gap:12px;}
    .np-reply-submit,.np-reply-cancel{border-radius:30px;padding:10px 20px;}
    .np-related-grid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;}
    .np-footer-cta{flex-direction:row;justify-content:space-between;padding:24px 32px;text-align:left;}
    .np-back-btn{width:auto;padding:12px 24px;border-radius:30px;}
    .np-confirm-btns{flex-direction:row;justify-content:center;}
    .np-confirm-delete,.np-confirm-cancel{padding:10px 24px;border-radius:30px;}
    .site-footer{padding:40px 24px;font-size:0.9rem;margin-top:60px;}
  }
  @media(min-width:1024px){
    .np-container{padding:60px 32px 80px;}
    .np-body,.np-comments{padding:40px 48px;}
    .np-engage{padding:24px 48px;}
    .np-footer-cta{padding:24px 48px;}
  }
`;

/* ── helpers ── */
const CAT_COLORS = {general:"#3b82f6",politics:"#8b5cf6",education:"#0891b2",technology:"#0f766e",community:"#16a34a",events:"#d97706",announcements:"#dc2626"};
const CAT_LABELS = {general:"🌐 General",politics:"🏛️ Politics",education:"📚 Education",technology:"💻 Technology",community:"🤝 Community",events:"🎯 Events",announcements:"📢 Announcements"};
const KNOWN_CATS = Object.keys(CAT_COLORS);

function isUrdu(t){ return t ? /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(t) : false; }

function getFingerprint(){
  let fp = localStorage.getItem("np_fp");
  if(!fp){ fp=Math.random().toString(36).slice(2)+Date.now().toString(36); localStorage.setItem("np_fp",fp); }
  return fp;
}

function sanitizeHtml(html){
  if(!html) return "";
  const tmp=document.createElement("div"); tmp.innerHTML=html;
  ["script","style","iframe","object","embed","form","input","button","meta"].forEach(tag=>tmp.querySelectorAll(tag).forEach(el=>el.remove()));
  tmp.querySelectorAll("a").forEach(a=>{
    a.setAttribute("target","_blank"); a.setAttribute("rel","noopener noreferrer");
    const href=a.getAttribute("href")||"";
    if(href.toLowerCase().startsWith("javascript:")) a.removeAttribute("href");
    else if(href&&!href.startsWith("http")&&!href.startsWith("/")&&!href.startsWith("#")&&!href.startsWith("mailto:")) a.setAttribute("href",`https://${href}`);
  });
  return tmp.innerHTML;
}

function estimateReadTime(html){
  if(!html) return null;
  const tmp=document.createElement("div"); tmp.innerHTML=html;
  const words=(tmp.innerText||"").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1,Math.round(words/200))} min read`;
}

function buildTOC(html){
  if(!html) return {toc:[],html:""};
  const tmp=document.createElement("div"); tmp.innerHTML=html;
  const items=[];
  tmp.querySelectorAll("h2,h3,h4").forEach((h,i)=>{
    const id=`np-h-${i}`; h.setAttribute("id",id);
    items.push({id,text:h.innerText||h.textContent||"",tag:h.tagName.toLowerCase()});
  });
  return {toc:items,html:tmp.innerHTML};
}

function getRenderedHtml(post){
  const raw=post.content_html||(post.content?post.content.split("\n").filter(l=>l.trim()).map(l=>`<p>${l}</p>`).join(""):"");
  return sanitizeHtml(raw);
}

function formatDate(d){
  if(!d) return "New";
  return new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
}

function setFullMeta({title,description,canonical,image,author,datePublished,tags}){
  document.title=title;
  const sm=(name,content,prop=false)=>{
    const attr=prop?"property":"name";
    let el=document.querySelector(`meta[${attr}="${name}"]`);
    if(!el){el=document.createElement("meta");el.setAttribute(attr,name);document.head.appendChild(el);}
    el.setAttribute("content",content||"");
  };
  const sl=(rel,href)=>{
    let el=document.querySelector(`link[rel="${rel}"]`);
    if(!el){el=document.createElement("link");el.setAttribute("rel",rel);document.head.appendChild(el);}
    el.setAttribute("href",href);
  };
  sm("description",description); sl("canonical",canonical||window.location.href);
  sm("og:type","article",true); sm("og:title",title,true); sm("og:description",description,true);
  sm("og:url",canonical||window.location.href,true); sm("og:site_name","AIDLA",true);
  if(image) sm("og:image",image,true);
  sm("twitter:card",image?"summary_large_image":"summary");
  sm("twitter:title",title); sm("twitter:description",description);
  if(image) sm("twitter:image",image);
  let ld=document.querySelector("#np-jsonld");
  if(!ld){ld=document.createElement("script");ld.id="np-jsonld";ld.type="application/ld+json";document.head.appendChild(ld);}
  ld.textContent=JSON.stringify({"@context":"https://schema.org","@type":"NewsArticle","headline":title,"description":description,"image":image?[image]:undefined,"author":{"@type":"Person","name":author||"AIDLA Team"},"publisher":{"@type":"Organization","name":"AIDLA","url":"https://aidla.online"},"datePublished":datePublished,"mainEntityOfPage":{"@type":"WebPage","@id":canonical||window.location.href},"keywords":tags?.join(", ")});
}

function useReadingProgress(){
  const[progress,setProgress]=useState(0);
  useEffect(()=>{
    const update=()=>{const el=document.documentElement;const scrolled=el.scrollTop||document.body.scrollTop;const total=el.scrollHeight-el.clientHeight;setProgress(total>0?Math.min(100,(scrolled/total)*100):0);};
    window.addEventListener("scroll",update,{passive:true});
    return ()=>window.removeEventListener("scroll",update);
  },[]);
  return progress;
}

function buildTree(flat){
  const map={};
  flat.forEach(c=>{map[c.id]={...c,replies:[]};});
  const roots=[];
  flat.forEach(c=>{
    if(c.parent_id&&map[c.parent_id]) map[c.parent_id].replies.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  return roots;
}

/* ── Confirm Dialog ── */
function ConfirmDialog({onConfirm,onCancel}){
  return(
    <div className="np-confirm-overlay" onClick={onCancel}>
      <motion.div className="np-confirm-box"
        initial={{opacity:0,scale:0.9,y:16}} animate={{opacity:1,scale:1,y:0}}
        exit={{opacity:0,scale:0.9,y:16}} transition={{duration:0.2}}
        onClick={e=>e.stopPropagation()}>
        <div className="np-confirm-icon">🗑️</div>
        <div className="np-confirm-title">Delete Comment?</div>
        <div className="np-confirm-sub">This cannot be undone. All replies will be removed too.</div>
        <div className="np-confirm-btns">
          <button className="np-confirm-cancel" onClick={onCancel}>Cancel</button>
          <button className="np-confirm-delete" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Reply Form ── */
function ReplyForm({onSubmit,onCancel,loading}){
  const[name,setName]=useState("");
  const[body,setBody]=useState("");
  return(
    <div className="np-reply-form">
      <div className="np-reply-form-title">↩ Write a Reply</div>
      <div className="np-reply-row">
        <input className="np-form-input" placeholder="Your name *" value={name} onChange={e=>setName(e.target.value)}/>
        <input className="np-form-input" placeholder="Email (optional)" type="email"/>
      </div>
      <textarea className="np-reply-textarea" placeholder="Write your reply…" value={body} onChange={e=>setBody(e.target.value)}/>
      <div className="np-reply-actions">
        <button className="np-reply-submit" onClick={()=>onSubmit(name,body)} disabled={loading||!name.trim()||!body.trim()}>
          {loading?"Posting…":"Post Reply →"}
        </button>
        <button className="np-reply-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ── Comment Node (recursive) ── */
function CommentNode({node,fp,depth=0,onDelete,onEdit,onReply,onLikeComment,commentLikes}){
  const[editing,setEditing]=useState(false);
  const[editBody,setEditBody]=useState(node.body);
  const[saving,setSaving]=useState(false);
  const[showConfirm,setShowConfirm]=useState(false);
  const[showReply,setShowReply]=useState(false);
  const[replyLoading,setReplyLoading]=useState(false);
  const[flagged,setFlagged]=useState(node.is_flagged);

  const isMine=node.fingerprint===fp;
  const likes=commentLikes[node.id]||{count:0,liked:false};

  const handleSave=async()=>{
    if(!editBody.trim()||editBody.trim()===node.body){setEditing(false);return;}
    setSaving(true); await onEdit(node.id,editBody.trim()); setSaving(false); setEditing(false);
  };

  const handleReplySubmit=async(name,body)=>{
    setReplyLoading(true);
    await onReply({parentId:node.id,name,body});
    setReplyLoading(false); setShowReply(false);
  };

  const handleFlag=async()=>{
    if(flagged) return;
    const{error}=await supabase.rpc("news_flag_comment",{p_comment_id:node.id});
    if(!error) setFlagged(true);
  };

  return(
    <>
      <div className={`np-cmt-item${isMine?" mine":""}${node.is_pinned?" pinned":""}${flagged?" flagged":""}`}>
        <div className="np-cmt-header">
          <div className="np-cmt-author-row">
            <div className={`np-cmt-avatar${isMine?" mine":""}`}>{(node.author_name||"?")[0].toUpperCase()}</div>
            <span className="np-cmt-name">{node.author_name}</span>
            {isMine && <span className="np-mine-badge">You</span>}
            {node.is_pinned && <span className="np-pin-badge">📌 Pinned</span>}
            {node.edited_at && <span className="np-cmt-edited">(edited)</span>}
          </div>
          <span className="np-cmt-date">{formatDate(node.created_at)}</span>
        </div>

        {editing ? (
          <>
            <textarea className="np-cmt-edit-area" value={editBody} onChange={e=>setEditBody(e.target.value)} autoFocus/>
            <div style={{display:"flex",gap:7}}>
              <button className="np-cmt-action-btn np-cmt-save-btn" onClick={handleSave} disabled={saving||!editBody.trim()}>{saving?"Saving…":"✅ Save"}</button>
              <button className="np-cmt-action-btn np-cmt-cancel-btn" onClick={()=>{setEditBody(node.body);setEditing(false);}}>Cancel</button>
            </div>
          </>
        ) : (
          <p className="np-cmt-body">{node.body}</p>
        )}

        {!editing && (
          <div className="np-cmt-actions">
            <button className={`np-cmt-like-btn${likes.liked?" liked":""}`} onClick={()=>onLikeComment(node.id)}>
              {likes.liked?"❤️":"🤍"} {likes.count>0?likes.count:""}
            </button>
            <button className="np-cmt-reply-btn" onClick={()=>setShowReply(v=>!v)}>↩ Reply</button>
            {isMine && (
              <>
                <button className="np-cmt-action-btn np-cmt-edit-btn" onClick={()=>{setEditBody(node.body);setEditing(true);}}>✏️ Edit</button>
                <button className="np-cmt-action-btn np-cmt-del-btn" onClick={()=>setShowConfirm(true)}>🗑 Delete</button>
              </>
            )}
            {!isMine && (
              <button className={`np-cmt-action-btn np-cmt-flag-btn${flagged?" flagged":""}`} onClick={handleFlag} disabled={flagged}>
                {flagged?"🚩 Reported":"🚩 Report"}
              </button>
            )}
          </div>
        )}

        {showReply && <ReplyForm onSubmit={handleReplySubmit} onCancel={()=>setShowReply(false)} loading={replyLoading}/>}
      </div>

      {node.replies?.length>0 && (
        <div className="np-cmt-replies">
          {node.replies.map(child=>(
            <CommentNode key={child.id} node={child} fp={fp} depth={depth+1}
              onDelete={onDelete} onEdit={onEdit} onReply={onReply}
              onLikeComment={onLikeComment} commentLikes={commentLikes}/>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showConfirm && (
          <ConfirmDialog
            onConfirm={()=>{setShowConfirm(false);onDelete(node.id);}}
            onCancel={()=>setShowConfirm(false)}/>
        )}
      </AnimatePresence>
    </>
  );
}

const fadeUp={initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:0.5}};

/* ══════════════════════════════════
   MAIN NewsPost COMPONENT
══════════════════════════════════ */
export default function NewsPost(){
  const{slug}=useParams();
  const progress=useReadingProgress();
  const fp=getFingerprint();
  const viewedRef=useRef(false);

  const[loading,setLoading]=useState(true);
  const[post,setPost]=useState(null);
  const[relatedPosts,setRelatedPosts]=useState([]);
  const[errorMsg,setErrorMsg]=useState("");
  const[toc,setToc]=useState([]);
  const[tocOpen,setTocOpen]=useState(true);
  const[renderedHtml,setRenderedHtml]=useState("");

  const[likeCount,setLikeCount]=useState(0);
  const[liked,setLiked]=useState(false);
  const[likeLoading,setLikeLoading]=useState(false);

  const[comments,setComments]=useState([]);
  const[commentLikes,setCommentLikes]=useState({});
  const[cmtName,setCmtName]=useState("");
  const[cmtEmail,setCmtEmail]=useState("");
  const[cmtBody,setCmtBody]=useState("");
  const[cmtLoading,setCmtLoading]=useState(false);

  const[copied,setCopied]=useState(false);
  const[toast,setToast]=useState("");
  const showToast=useCallback(m=>{setToast(m);setTimeout(()=>setToast(""),2800);},[]);

  useEffect(()=>{
    window.scrollTo(0,0);
    viewedRef.current=false;
    const load=async()=>{
      setLoading(true); setErrorMsg("");
      const{data,error}=await supabase.from("news_posts").select("*")
        .is("deleted_at",null).eq("status","published").eq("slug",slug).maybeSingle();
      if(error){setErrorMsg(error.message);setPost(null);setLoading(false);return;}
      if(!data){setPost(null);setLoading(false);return;}
      setPost(data);

      const rawHtml=getRenderedHtml(data);
      const{toc:tocItems,html:processedHtml}=buildTOC(rawHtml);
      setToc(tocItems); setRenderedHtml(processedHtml);

      // Related
      const{data:rel}=await supabase.from("news_posts")
        .select("id,title,slug,cover_image_url,published_at")
        .is("deleted_at",null).eq("status","published").neq("slug",slug).limit(4);
      if(rel) setRelatedPosts(rel);

      // Post likes
      const{count}=await supabase.from("news_likes").select("*",{count:"exact",head:true}).eq("post_id",data.id);
      setLikeCount(count||0);
      const{data:myLike}=await supabase.from("news_likes").select("id").eq("post_id",data.id).eq("fingerprint",fp).maybeSingle();
      setLiked(!!myLike);

      // Comments
      const{data:cmts}=await supabase.from("news_comments").select("*").eq("post_id",data.id).order("created_at",{ascending:true});
      if(cmts){setComments(cmts);await loadCommentLikes(cmts);}

      // Meta
      const pTags=data.tags||[];
      setFullMeta({
        title:data.meta_title||data.title,description:data.meta_description||data.excerpt||"",
        canonical:data.canonical_url||`https://aidla.online/news/${slug}`,
        image:data.cover_image_url||"",author:data.author_name||"AIDLA Team",
        datePublished:data.published_at,tags:pTags,
      });

      setLoading(false);

      if(!viewedRef.current){
        viewedRef.current=true;
        supabase.rpc("news_increment_view",{p_post_id:data.id});
      }
    };
    load();
  },[slug]);

  const loadCommentLikes=async(cmts)=>{
    if(!cmts?.length) return;
    const ids=cmts.map(c=>c.id);
    const{data}=await supabase.from("news_comment_likes").select("comment_id,fingerprint").in("comment_id",ids);
    if(!data) return;
    const map={};
    ids.forEach(id=>{map[id]={count:0,liked:false};});
    data.forEach(l=>{
      if(!map[l.comment_id]) map[l.comment_id]={count:0,liked:false};
      map[l.comment_id].count++;
      if(l.fingerprint===fp) map[l.comment_id].liked=true;
    });
    setCommentLikes(map);
  };

  const handleLike=async()=>{
    if(!post||likeLoading) return;
    setLikeLoading(true);
    const{data,error}=await supabase.rpc("news_toggle_like",{p_post_id:post.id,p_fingerprint:fp});
    if(!error&&data?.ok){setLiked(data.liked);setLikeCount(data.count);}
    setLikeLoading(false);
  };

  const handleComment=async()=>{
    if(!post||cmtLoading) return;
    setCmtLoading(true);
    const{data,error}=await supabase.rpc("news_add_comment",{
      p_post_id:post.id,p_author_name:cmtName,p_author_email:cmtEmail,
      p_body:cmtBody,p_fingerprint:fp,p_parent_id:null,
    });
    if(error||!data?.ok) showToast(data?.error||error?.message||"Failed to post");
    else{
      const newCmt={id:data.id,post_id:post.id,author_name:cmtName,body:cmtBody,fingerprint:fp,
        created_at:new Date().toISOString(),edited_at:null,parent_id:null,is_pinned:false,is_flagged:false};
      setComments(prev=>[...prev,newCmt]);
      setCommentLikes(prev=>({...prev,[data.id]:{count:0,liked:false}}));
      setCmtName(""); setCmtEmail(""); setCmtBody("");
      showToast("Comment posted! 🎉");
    }
    setCmtLoading(false);
  };

  const handleReply=async({parentId,name,body})=>{
    if(!post) return;
    const{data,error}=await supabase.rpc("news_add_comment",{
      p_post_id:post.id,p_author_name:name,p_author_email:"",p_body:body,p_fingerprint:fp,p_parent_id:parentId,
    });
    if(error||!data?.ok){showToast(data?.error||error?.message||"Failed");return;}
    const newCmt={id:data.id,post_id:post.id,author_name:name,body,fingerprint:fp,
      created_at:new Date().toISOString(),edited_at:null,parent_id:parentId,is_pinned:false,is_flagged:false};
    setComments(prev=>[...prev,newCmt]);
    setCommentLikes(prev=>({...prev,[data.id]:{count:0,liked:false}}));
    showToast("Reply posted! 💬");
  };

  const handleDeleteComment=async(id)=>{
    const{error}=await supabase.from("news_comments").delete().eq("id",id).eq("fingerprint",fp);
    if(error){showToast("Could not delete comment");return;}
    const removeIds=new Set();
    const collectIds=(cid)=>{removeIds.add(cid);comments.filter(c=>c.parent_id===cid).forEach(c=>collectIds(c.id));};
    collectIds(id);
    setComments(prev=>prev.filter(c=>!removeIds.has(c.id)));
    showToast("Comment deleted");
  };

  const handleEditComment=async(id,newBody)=>{
    const{error}=await supabase.from("news_comments").update({body:newBody,edited_at:new Date().toISOString()}).eq("id",id).eq("fingerprint",fp);
    if(error){showToast("Could not update");return;}
    setComments(prev=>prev.map(c=>c.id===id?{...c,body:newBody,edited_at:new Date().toISOString()}:c));
    showToast("Comment updated ✅");
  };

  const handleLikeComment=async(commentId)=>{
    const{data,error}=await supabase.rpc("news_toggle_comment_like",{p_comment_id:commentId,p_fingerprint:fp});
    if(!error&&data?.ok) setCommentLikes(prev=>({...prev,[commentId]:{count:data.count,liked:data.liked}}));
  };

  const handleShare=(platform)=>{
    const url=window.location.href;
    const text=post?.title||"Check this out";
    if(platform==="wa") window.open(`https://wa.me/?text=${encodeURIComponent(text+" "+url)}`,"_blank");
    else if(platform==="tw") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,"_blank");
    else{navigator.clipboard.writeText(url).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);showToast("Link copied! 📋");});}
  };

  const handleDownload=async()=>{
    if(!post?.cover_image_url) return;
    try{
      const res=await fetch(post.cover_image_url);
      const blob=await res.blob();
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");a.href=url;a.download=`${post.slug||"cover"}.jpg`;a.click();
      URL.revokeObjectURL(url);
      showToast("Downloading… 📥");
    }catch{showToast("Download failed");}
  };

  const pTags = post?.tags||[];
  const pCat = pTags.find(t=>KNOWN_CATS.includes(t));
  const pBreaking = pTags.includes("breaking");
  const displayTags = pTags.filter(t=>!KNOWN_CATS.includes(t)&&t!=="breaking");
  const urduTitle = post && isUrdu(post.title);
  const commentTree = buildTree(comments);
  const totalComments = comments.length;

  return(
    <div className="np-root">
      <style>{styles}</style>
      <div className="np-progress" style={{width:`${progress}%`}}/>

      <AnimatePresence>
        {toast && (
          <motion.div className="np-toast"
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}} transition={{duration:0.25}}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="np-orbs"><div className="np-orb-1"/><div className="np-orb-2"/></div>

      <div className="np-container">
        <motion.div {...fadeUp}><Link to="/news" className="np-back">‹ All News</Link></motion.div>

        {errorMsg && <motion.div className="np-error" {...fadeUp}><span>⚠️</span>{errorMsg}</motion.div>}

        {/* Skeleton */}
        {loading && (
          <motion.div className="np-article" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="np-skel-cover"/>
            <div className="np-body">
              {[80,90,60,100,100,78,100,95,82].map((w,i)=>(
                <div key={i} className="skel-bg" style={{height:i<2?22:13,width:`${w}%`,marginBottom:i===1?22:8}}/>
              ))}
            </div>
          </motion.div>
        )}

        {/* Not found */}
        {!loading&&!post&&!errorMsg && (
          <motion.div className="np-not-found" {...fadeUp}>
            <span style={{fontSize:"2.5rem",display:"block"}}>📭</span>
            <h2>Article Not Found</h2>
            <p>This article may have been moved or unpublished.</p>
            <Link to="/news" className="np-back-btn">‹ Back to News</Link>
          </motion.div>
        )}

        {/* Article */}
        {post && (
          <motion.div className="np-article" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.55}}>

            {/* Cover */}
            <div className="np-cover-wrap">
              {post.cover_image_url
                ? <img src={post.cover_image_url} alt={post.title} loading="lazy"/>
                : <div className="np-cover-ph">📰</div>
              }
              {post.cover_image_url && (
                <button className="np-cover-dl" onClick={handleDownload}>⬇ Download</button>
              )}
            </div>

            {/* Body */}
            <div className="np-body">
              <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:6,marginBottom:8}}>
                <span className="np-label">AIDLA News</span>
                {(post.content_html||post.content) && (
                  <span className="np-readtime">⏱ {estimateReadTime(post.content_html||post.content)}</span>
                )}
              </div>

              {/* Breaking & Category */}
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                {pBreaking && <span className="np-breaking-badge">🔴 Breaking News</span>}
                {pCat && (
                  <span className="np-cat-badge" style={{background:`${CAT_COLORS[pCat]}18`,color:CAT_COLORS[pCat],border:`1px solid ${CAT_COLORS[pCat]}30`}}>
                    {CAT_LABELS[pCat]||pCat}
                  </span>
                )}
              </div>

              <h1 className={`np-title${urduTitle?" urdu":""}`}>{post.title}</h1>

              <div className="np-meta">
                <div className="np-author"><span className="np-author-icon">✍️</span>{post.author_name||"AIDLA Team"}</div>
                <span className="np-dot"/>
                <span className="np-date-pill">{formatDate(post.published_at)}</span>
                <span className="np-dot"/>
                <span className="np-stat-text">👁 {(post.view_count||0).toLocaleString()} views</span>
                <span className="np-dot"/>
                <span className="np-stat-text">❤️ {likeCount} {likeCount===1?"like":"likes"}</span>
                <span className="np-dot"/>
                <span className="np-stat-text">💬 {totalComments}</span>
              </div>

              {displayTags.length>0 && (
                <div className="np-tags">
                  {displayTags.map(t=><span key={t} className="np-tag"># {t}</span>)}
                </div>
              )}

              {post.excerpt && <p className="np-excerpt">{post.excerpt}</p>}

              {toc.length>1 && (
                <div className="np-toc">
                  <div className="np-toc-title" onClick={()=>setTocOpen(v=>!v)}>
                    📋 Table of Contents <span style={{marginLeft:"auto",fontSize:"0.8em"}}>{tocOpen?"▲":"▼"}</span>
                  </div>
                  {tocOpen && (
                    <ul className="np-toc-list">
                      {toc.map(item=>(
                        <li key={item.id} className={`np-toc-item ${item.tag}`}>
                          <a href={`#${item.id}`} onClick={e=>{e.preventDefault();document.getElementById(item.id)?.scrollIntoView({behavior:"smooth",block:"start"});}}>
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="np-divider"/>
              <div className="np-content" dir={urduTitle?"rtl":"ltr"} dangerouslySetInnerHTML={{__html:renderedHtml}}/>

              {relatedPosts.length>0 && (
                <div className="np-related">
                  <h3 className="np-related-title">More News…</h3>
                  <div className="np-related-grid">
                    {relatedPosts.map(rp=>(
                      <Link to={`/news/${rp.slug}`} key={rp.id} className="np-related-card">
                        <div className="np-related-img">
                          {rp.cover_image_url?<img src={rp.cover_image_url} alt={rp.title} loading="lazy"/>:<span>📰</span>}
                        </div>
                        <div className="np-related-text">
                          <h4>{rp.title}</h4><span>{formatDate(rp.published_at)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Engagement Bar */}
            <div className="np-engage">
              <button className={`np-like-btn${liked?" liked":""}`} onClick={handleLike} disabled={likeLoading}>
                <span className="heart">{liked?"❤️":"🤍"}</span>
                {likeCount} {likeCount===1?"Like":"Likes"}
              </button>
              <div className="np-share-group">
                <button className="np-share-btn np-share-wa" onClick={()=>handleShare("wa")}>💬 WhatsApp</button>
                <button className="np-share-btn np-share-tw" onClick={()=>handleShare("tw")}>𝕏 Twitter</button>
                <button className={`np-share-btn np-share-copy${copied?" copied":""}`} onClick={()=>handleShare("copy")}>
                  {copied?"✅ Copied!":"🔗 Copy Link"}
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="np-comments">
              <h3 className="np-comments-title">
                💬 Comments <span className="np-cmt-count">{totalComments}</span>
              </h3>

              {/* Post form */}
              <div className="np-cmt-form">
                <div className="np-cmt-form-title">✍️ Leave a Comment</div>
                <div className="np-form-row">
                  <input className="np-form-input" placeholder="Your name *" value={cmtName} onChange={e=>setCmtName(e.target.value)}/>
                  <input className="np-form-input" placeholder="Email (optional)" type="email" value={cmtEmail} onChange={e=>setCmtEmail(e.target.value)}/>
                </div>
                <textarea className="np-form-textarea" placeholder="Write your comment…" value={cmtBody} onChange={e=>setCmtBody(e.target.value)}/>
                <button className="np-cmt-submit" onClick={handleComment} disabled={cmtLoading||!cmtName.trim()||!cmtBody.trim()}>
                  {cmtLoading?"Posting…":"Post Comment →"}
                </button>
              </div>

              {/* Threaded comments */}
              {totalComments===0
                ? <div className="np-no-comments">No comments yet. Be the first! 💭</div>
                : (
                  <div className="np-cmt-list">
                    {commentTree.map(node=>(
                      <div key={node.id} className="np-cmt-thread">
                        <CommentNode
                          node={node} fp={fp} depth={0}
                          onDelete={handleDeleteComment}
                          onEdit={handleEditComment}
                          onReply={handleReply}
                          onLikeComment={handleLikeComment}
                          commentLikes={commentLikes}/>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>

            {/* Footer CTA */}
            <div className="np-footer-cta">
              <span className="np-footer-cta-text">Thanks for reading ✨</span>
              <Link to="/news" className="np-back-btn">‹ More News</Link>
            </div>
          </motion.div>
        )}
      </div>

      <footer className="site-footer">
        <div style={{marginBottom:10,fontSize:"1.2rem"}}>🕌</div>
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
