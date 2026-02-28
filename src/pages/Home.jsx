import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

/* ─────────────────────────────── Quotes ─────────────────────────────── */
const QUOTES = [
 // {
   // text: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
  //  translation: "Read in the name of your Lord who created.",
   // source: "Quran 96:1",
   // lang: "ar",
   // bg: "https://images.unsplash.com/photo-1585036156261-1e2ac2a46284?w=900&q=80",
 // },
  {
    text: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    translation: "Seeking knowledge is an obligation upon every Muslim.",
    source: "Prophet Muhammad ﷺ (Ibn Majah)",
    lang: "ar",
    bg: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=900&q=80",
  },
 // {
    //text: "وَقُلْ رَّبِّ زِدْنِي عِلْمًا",
    //translation: "And say: My Lord, increase me in knowledge.",
   // source: "Quran 20:114",
   // lang: "ar",
   // bg: "https://images.unsplash.com/photo-1566375981478-6bca65b5f8b9?w=900&q=80",
 // },
  {
    text: "خِيرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    translation: "The best of people are those most beneficial to others.",
    source: "Prophet Muhammad ﷺ",
    lang: "ar",
    bg: "https://images.unsplash.com/photo-1579547621309-5e57ab324182?w=900&q=80",
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    source: "Nelson Mandela",
    lang: "en",
    bg: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&q=80",
  },
  {
    text: "علم کی شمع جلاؤ، جہالت کا اندھیرا مٹاؤ",
    translation: "Light the candle of knowledge, erase the darkness of ignorance.",
    source: "Allama Iqbal",
    lang: "ur",
    bg: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&q=80",
  },
  {
    text: "عقل و دل دونوں کی تربیت پر توجہ دو",
    translation: "Pay attention to nurturing both intellect and heart.",
    source: "Allama Iqbal",
    lang: "ur",
    bg: "https://images.unsplash.com/photo-1513077202514-c511b41bd4c7?w=900&q=80",
  },
  {
    text: "پڑھو، آگے بڑھو — علم ہی اصل دولت ہے",
    translation: "Read, move forward — knowledge is the real wealth.",
    source: "Quaid-e-Azam Muhammad Ali Jinnah",
    lang: "ur",
    bg: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=900&q=80",
  },
  {
    text: "The day you plant the seed is not the day you eat the fruit.",
    source: "Islamic Proverb",
    lang: "en",
    bg: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80",
  },
  {
    text: "وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا",
    translation: "Whoever is given wisdom has been given much good.",
    source: "Quran 2:269",
    lang: "ar",
    bg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
  },
  {
    text: "د علم لاره اوږده ده، خو هره ګام یې ګنج دے",
    translation: "The path of knowledge is long, but every step of it is a treasure.",
    source: "Rahman Baba (Pashto Poet)",
    lang: "ps",
    bg: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80",
  },
  {
    text: "ਵਿੱਦਿਆ ਵਿਚਾਰੀ ਤਾਂ ਪਰਉਪਕਾਰੀ",
    translation: "Knowledge when reflected upon leads to service of others.",
    source: "Guru Nanak Dev Ji (Punjabi wisdom)",
    lang: "pa",
    bg: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80",
  },
  {
    text: "In the end, it's not the years in your life that count. It's the life in your years.",
    source: "Abraham Lincoln",
    lang: "en",
    bg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
  },
  {
    text: "Intelligence is the ability to adapt to change.",
    source: "Ibn Rushd (Averroes) — Islamic Philosopher",
    lang: "en",
    bg: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=80",
  },
  {
    text: "The ink of the scholar is more sacred than the blood of the martyr.",
    source: "Prophet Muhammad ﷺ",
    lang: "en",
    bg: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=900&q=80",
  },
  {
    text: "تعلیم ہی وہ ہتھیار ہے جو پوری دنیا بدل سکتا ہے",
    translation: "Education is the weapon that can change the entire world.",
    source: "Imran Khan",
    lang: "ur",
    bg: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80",
  },
  {
    text: "وَأَنزَلَ اللَّهُ عَلَيْكَ الْكِتَابَ وَالْحِكْمَةَ وَعَلَّمَكَ مَا لَمْ تَكُن تَعْلَمُ",
    translation: "And Allah revealed to you the Book and wisdom and taught you what you did not know.",
    source: "Quran 4:113",
    lang: "ar",
    bg: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=900&q=80",
  },
  {
    text: "آدمی کو چاہیے کہ علم حاصل کرنے میں کبھی نہ تھکے",
    translation: "A person should never tire of seeking knowledge.",
    source: "Imam Al-Ghazali",
    lang: "ur",
    bg: "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=900&q=80",
  },
  {
    text: "Educate a man and you educate an individual; educate a woman and you educate a nation.",
    source: "Dr. James E. Kwegyir Aggrey",
    lang: "en",
    bg: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80",
  },
  {
    text: "خود کو کر بلند اتنا کہ ہر تقدیر سے پہلے خدا بندے سے خود پوچھے — بتا تیری رضا کیا ہے",
    translation: "Raise yourself so high that before every decree, God Himself asks you: tell me, what is your desire?",
    source: "Allama Iqbal",
    lang: "ur",
    bg: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=900&q=80",
  },
];

/* ─────────────────────────── Global Styles ──────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&family=Noto+Nastaliq+Urdu&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0b1437;
    --royal: #1a3a8f;
    --sky: #3b82f6;
    --gold: #f59e0b;
    --gold-light: #fcd34d;
    --cream: #fffbf0;
    --slate: #64748b;
    --white: #ffffff;
    --card-bg: rgba(255,255,255,0.95);
    --radius-xl: 24px;
    --radius-2xl: 36px;
    --shadow-card: 0 8px 40px rgba(11,20,55,0.10);
    --shadow-glow: 0 0 40px rgba(59,130,246,0.25);
    font-family: 'DM Sans', sans-serif;
  }

  .page-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #f0f4ff 0%, #fffbf0 60%, #e8f4fd 100%);
    overflow-x: hidden;
  }

  /* Quote slider */
  .quote-slider-outer {
    width: 100%;
    overflow: hidden;
    border-radius: var(--radius-2xl);
    position: relative;
    aspect-ratio: 16/7;
    min-height: 220px;
    max-height: 420px;
    box-shadow: 0 20px 60px rgba(11,20,55,0.18);
  }
  .quote-slide {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    transition: opacity 0.9s ease, transform 0.9s ease;
  }
  .quote-slide.active { opacity: 1; transform: scale(1); z-index: 2; }
  .quote-slide.inactive { opacity: 0; transform: scale(1.03); z-index: 1; }
  .quote-slide-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: brightness(0.42);
  }
  .quote-slide-content {
    position: relative;
    z-index: 3;
    padding: 28px 32px;
    width: 100%;
    background: linear-gradient(0deg, rgba(0,0,0,0.65) 60%, transparent 100%);
  }
  .quote-text-ar, .quote-text-ur {
    font-family: 'Noto Nastaliq Urdu', serif;
    direction: rtl;
    text-align: right;
  }
  .quote-text-ar { font-size: clamp(1.1rem, 2.8vw, 1.7rem); }
  .quote-text-ur { font-size: clamp(1rem, 2.4vw, 1.4rem); }
  .quote-text-en, .quote-text-ps, .quote-text-pa {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(1rem, 2.2vw, 1.4rem);
  }
  .quote-translation {
    font-size: clamp(0.75rem, 1.6vw, 0.95rem);
    color: rgba(255,255,255,0.78);
    margin-top: 6px;
    font-family: 'DM Sans', sans-serif;
  }
  .quote-source {
    display: inline-block;
    margin-top: 10px;
    font-size: 0.8rem;
    background: rgba(245,158,11,0.9);
    color: #fff;
    padding: 3px 12px;
    border-radius: 20px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .quote-dots {
    position: absolute;
    bottom: 14px;
    right: 18px;
    display: flex;
    gap: 6px;
    z-index: 10;
  }
  .quote-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: rgba(255,255,255,0.45);
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
  }
  .quote-dot.active { background: var(--gold); transform: scale(1.4); }

  /* Stats strip */
  .stats-strip {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0;
    background: linear-gradient(135deg, var(--navy), var(--royal));
    border-radius: var(--radius-xl);
    overflow: hidden;
    margin: 40px 0;
    box-shadow: 0 12px 40px rgba(11,20,55,0.22);
  }
  .stat-item {
    flex: 1;
    min-width: 120px;
    padding: 28px 20px;
    text-align: center;
    position: relative;
  }
  .stat-item::after {
    content: '';
    position: absolute;
    right: 0; top: 20%; bottom: 20%;
    width: 1px;
    background: rgba(255,255,255,0.12);
  }
  .stat-item:last-child::after { display: none; }
  .stat-number {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 900;
    color: var(--gold-light);
    line-height: 1;
  }
  .stat-label { color: rgba(255,255,255,0.7); font-size: 0.82rem; margin-top: 6px; }

  /* Feature cards */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin: 32px 0;
  }
  .feature-card {
    background: var(--card-bg);
    border-radius: var(--radius-xl);
    padding: 32px 24px;
    box-shadow: var(--shadow-card);
    border: 1px solid rgba(59,130,246,0.08);
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative;
    overflow: hidden;
  }
  .feature-card::before {
    content: '';
    position: absolute;
    top: -30px; right: -30px;
    width: 100px; height: 100px;
    border-radius: 50%;
    background: rgba(59,130,246,0.07);
  }
  .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(11,20,55,0.14); }
  .feature-icon {
    width: 56px; height: 56px;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem;
    margin-bottom: 16px;
  }
  .feature-card h3 { font-family: 'Playfair Display', serif; color: var(--navy); font-size: 1.15rem; margin-bottom: 8px; }
  .feature-card p { color: var(--slate); font-size: 0.9rem; line-height: 1.6; }

  /* Section headings */
  .section-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.7rem, 4vw, 2.4rem);
    font-weight: 900;
    background: linear-gradient(135deg, var(--navy) 30%, var(--sky));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    margin-bottom: 8px;
  }
  .section-sub {
    text-align: center;
    color: var(--slate);
    margin-bottom: 32px;
    font-size: 0.95rem;
  }

  /* Winners cards */
  .winners-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }
  .winner-card {
    background: var(--card-bg);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-card);
    border: 1px solid rgba(59,130,246,0.08);
  }
  .winner-card-header {
    background: linear-gradient(135deg, var(--navy), var(--royal));
    padding: 18px 22px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .winner-card-header h3 { color: #fff; font-family: 'Playfair Display', serif; font-size: 1.1rem; }
  .winner-table { width: 100%; border-collapse: collapse; }
  .winner-table th {
    text-align: left;
    padding: 10px 14px;
    font-size: 0.75rem;
    color: var(--slate);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid #f1f5f9;
    background: #fafbff;
  }
  .winner-table td { padding: 11px 14px; font-size: 0.87rem; border-bottom: 1px solid #f8fafc; }
  .winner-table tr:last-child td { border-bottom: none; }
  .winner-table tr:hover td { background: #f8faff; }

  /* CTA section */
  .cta-section {
    background: linear-gradient(135deg, var(--navy) 0%, var(--royal) 60%, #1e5abf 100%);
    border-radius: var(--radius-2xl);
    padding: 60px 32px;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin: 60px 0;
    box-shadow: 0 20px 60px rgba(11,20,55,0.28);
  }
  .cta-section::before {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: rgba(245,158,11,0.12);
    top: -200px; right: -100px;
  }
  .cta-section::after {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: rgba(59,130,246,0.15);
    bottom: -150px; left: -80px;
  }

  /* Coin badge */
  .coin-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: var(--navy);
    padding: 6px 16px;
    border-radius: 30px;
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: 0 4px 12px rgba(245,158,11,0.35);
  }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 44px; height: 44px;
    border: 3px solid #e2e8f0;
    border-top-color: var(--sky);
    border-radius: 50%;
    margin: 40px auto;
    animation: spin 0.8s linear infinite;
  }

  /* Rank badge */
  .rank-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px;
    border-radius: 50%;
    font-weight: 800;
    font-size: 0.8rem;
  }
  .rank-1 { background: linear-gradient(135deg, #ffd700, #ffb300); color: #7a4f00; }
  .rank-2 { background: linear-gradient(135deg, #c0c0c0, #9e9e9e); color: #3a3a3a; }
  .rank-3 { background: linear-gradient(135deg, #cd7f32, #a0522d); color: #fff; }
  .rank-other { background: #f1f5f9; color: var(--slate); }

  /* Wheel badge */
  .wheel-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: inline-block; }
  .wb-coins { background: linear-gradient(135deg, #10b981, #059669); color: #fff; }
  .wb-gift  { background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; }

  /* Hero */
  .hero-section {
    display: grid;
    grid-template-columns: 52% 48%;
    gap: 32px;
    align-items: stretch;
    margin-bottom: clamp(24px, 4vw, 48px);
  }
  .hero-text-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 0;
  }
  .hero-img-wrap {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    min-height: 440px;
    box-shadow: 0 20px 50px rgba(11,20,55,0.2);
  }
  .hero-img-wrap img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; }
  .hero-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 45%, rgba(11,20,55,0.62) 100%);
    z-index: 1;
  }
  .hero-floating-badge {
    position: absolute;
    bottom: 18px; left: 16px; right: 16px;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(12px);
    border-radius: 14px;
    padding: 12px 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.14);
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .hero-floating-badge .badge-icon { font-size: 1.6rem; flex-shrink: 0; }
  .hero-floating-badge .badge-title { font-weight: 800; color: var(--navy); font-size: 0.9rem; line-height: 1.2; }
  .hero-floating-badge .badge-sub { color: var(--slate); font-size: 0.72rem; margin-top: 2px; }
  .coin-badge {
    display: inline-flex;
    align-self: flex-start;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: var(--navy);
    padding: 7px 18px;
    border-radius: 30px;
    font-weight: 700;
    font-size: 0.85rem;
    box-shadow: 0 3px 10px rgba(245,158,11,0.3);
    white-space: nowrap;
    margin-bottom: 16px;
  }
  .hero-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 3vw, 3.2rem);
    font-weight: 900;
    line-height: 1.1;
    color: var(--navy);
    margin: 0 0 18px;
  }
  .hero-para {
    color: var(--slate);
    font-size: clamp(0.88rem, 1.15vw, 1rem);
    line-height: 1.7;
    margin-bottom: 24px;
    max-width: 400px;
  }
  .hero-btn-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
  .hero-btn-primary {
    display: inline-block;
    padding: 13px 30px;
    border-radius: 50px;
    background: linear-gradient(135deg, var(--navy), var(--sky));
    color: #fff;
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    box-shadow: 0 6px 18px rgba(59,130,246,0.3);
    transition: transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(59,130,246,0.4); }
  .hero-btn-secondary {
    display: inline-block;
    padding: 12px 26px;
    border-radius: 50px;
    border: 1.5px solid var(--royal);
    color: var(--navy);
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    background: transparent;
    transition: transform 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .hero-btn-secondary:hover { background: rgba(26,58,143,0.06); transform: translateY(-2px); }
  .trust-strip {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
  }
  .trust-strip span { color: var(--slate); font-size: 0.8rem; font-weight: 500; }

  /* How it works */
  .steps-row {
    display: flex;
    gap: 0;
    counter-reset: step;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 8px;
    -ms-overflow-style: none; scrollbar-width: none;
  }
  .steps-row::-webkit-scrollbar { display: none; }
  .step-item {
    flex: 1;
    min-width: 160px;
    text-align: center;
    position: relative;
    padding: 0 12px;
  }
  .step-item::after {
    content: '';
    position: absolute;
    top: 28px; right: -10px;
    width: 20px; height: 2px;
    background: linear-gradient(90deg, var(--sky), var(--gold));
    z-index: 0;
  }
  .step-item:last-child::after { display: none; }
  .step-circle {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--navy), var(--royal));
    color: #fff;
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 900;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
    position: relative; z-index: 1;
    box-shadow: 0 6px 20px rgba(26,58,143,0.3);
  }
  .step-item h4 { font-weight: 700; color: var(--navy); font-size: 0.9rem; margin-bottom: 4px; }
  .step-item p { color: var(--slate); font-size: 0.8rem; line-height: 1.5; }

  /* Footer */
  .site-footer {
    background: var(--navy);
    color: rgba(255,255,255,0.6);
    padding: 36px 24px;
    text-align: center;
    font-size: 0.85rem;
    margin-top: 60px;
  }
  .site-footer strong { color: var(--gold-light); }

  /* ── Mobile: side-by-side hero, scale everything down ── */
  @media (max-width: 640px) {
    .hero-section {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      min-height: unset;
    }
    .hero-text-col {
      padding: 12px 0;
      background: none;
      border-radius: 0;
      box-shadow: none;
    }
    .hero-img-wrap {
      order: unset;
      min-height: 220px;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(11,20,55,0.15);
    }
    .hero-floating-badge { display: none; }
    .coin-badge { font-size: 0.62rem; padding: 3px 10px; margin-bottom: 8px; }
    .hero-h1 { font-size: 1.15rem; margin-bottom: 7px; line-height: 1.15; }
    .hero-para { font-size: 0.68rem; line-height: 1.45; margin-bottom: 10px; max-width: 100%; }
    .hero-btn-row { gap: 6px; margin-bottom: 10px; flex-direction: column; }
    .hero-btn-primary { padding: 8px 14px; font-size: 0.72rem; text-align: center; }
    .hero-btn-secondary { padding: 7px 12px; font-size: 0.72rem; text-align: center; }
    .trust-strip { gap: 6px; }
    .trust-strip span { font-size: 0.6rem; }
    /* Rest of page */
    .winners-grid { grid-template-columns: 1fr; }
    .features-grid { grid-template-columns: 1fr 1fr; gap: 9px; margin: 16px 0; }
    .feature-card { padding: 12px 10px; border-radius: 12px; }
    .feature-card::before { display: none; }
    .feature-icon { width: 30px; height: 30px; font-size: 0.95rem; border-radius: 8px; margin-bottom: 6px; }
    .feature-card h3 { font-size: 0.74rem; margin-bottom: 3px; }
    .feature-card p { font-size: 0.67rem; line-height: 1.35; }
    .stats-strip { flex-wrap: wrap; margin: 16px 0; border-radius: 14px; }
    .stat-item { min-width: 50%; padding: 14px 8px; }
    .stat-item::after { display: none; }
    .stat-number { font-size: 1.25rem; }
    .stat-label { font-size: 0.64rem; }
    .quote-slider-outer { border-radius: 14px; max-height: 200px; }
    .quote-slide-content { padding: 12px 14px; }
    .quote-text-ar { font-size: 0.8rem; }
    .quote-text-ur { font-size: 0.74rem; }
    .quote-text-en, .quote-text-ps, .quote-text-pa { font-size: 0.76rem; }
    .quote-translation { font-size: 0.63rem; margin-top: 2px; }
    .quote-source { font-size: 0.6rem; padding: 1px 7px; margin-top: 4px; }
    .steps-row { gap: 0; }
    .step-item { min-width: 90px; padding: 0 5px; }
    .step-circle { width: 34px; height: 34px; font-size: 0.85rem; margin-bottom: 6px; }
    .step-item::after { width: 12px; top: 17px; right: -6px; }
    .step-item h4 { font-size: 0.68rem; }
    .step-item p { font-size: 0.62rem; }
    .cta-section { padding: 26px 14px; margin: 24px 0; border-radius: 16px; }
    .section-heading { font-size: 1.1rem; }
    .section-sub { font-size: 0.72rem; margin-bottom: 12px; }
    .winner-card-header { padding: 10px 12px; }
    .winner-card-header h3 { font-size: 0.82rem; }
    .winner-table th { padding: 5px 7px; font-size: 0.59rem; }
    .winner-table td { padding: 6px 7px; font-size: 0.7rem; }
    .wheel-badge { padding: 3px 6px; font-size: 0.59rem; }
    .rank-badge { width: 20px; height: 20px; font-size: 0.63rem; }
    .site-footer { padding: 18px 14px; font-size: 0.72rem; margin-top: 24px; }
  }
`;

/* ─────────────────────────── Helpers ──────────────────────────── */
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function WheelBadge({ type, coins }) {
  if (type === "coins") return <span className="wheel-badge wb-coins">💰 {coins} Coins</span>;
  if (type === "gift") return <span className="wheel-badge wb-gift">🎁 Gift Won!</span>;
  return null;
}

function RankBadge({ rank }) {
  const cls = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "rank-other";
  return <span className={`rank-badge ${cls}`}>#{rank}</span>;
}

/* ─────────────────────────── Quote Slider ──────────────────────── */
function QuoteSlider() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const next = (i) => setIdx(typeof i === "number" ? i : (prev) => (prev + 1) % QUOTES.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const q = QUOTES[idx];

  return (
    <div className="quote-slider-outer">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="quote-slide active"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="quote-slide-bg"
            style={{ backgroundImage: `url(${q.bg})` }}
          />
          <div className="quote-slide-content">
            <div style={{ color: "#fff" }}>
              <div className={`quote-text-${q.lang}`}>
                "{q.text}"
              </div>
              {q.translation && <div className="quote-translation">{q.translation}</div>}
              <span className="quote-source">{q.source}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="quote-dots">
        {QUOTES.map((_, i) => (
          <div
            key={i}
            className={`quote-dot ${i === idx ? "active" : ""}`}
            onClick={() => { clearInterval(timerRef.current); setIdx(i); timerRef.current = setInterval(next, 5000); }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Component ─────────────────────── */
export default function Home() {
  const [drawResults, setDrawResults] = useState([]);
  const [wheelHistory, setWheelHistory] = useState([]);
  const [testWinners, setTestWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Lucky Draws
        const { data: draws, error: drawsErr } = await supabase
          .from("luckydraw_results")
          .select("id, winner_name, draw_title, prize_text, announced_at")
          .order("announced_at", { ascending: false })
          .limit(5);
        if (drawsErr) throw drawsErr;
        setDrawResults(draws || []);

        // Lucky Wheel — only coins & gift (not try_again_free or plus1_chance)
        const { data: wheel, error: wheelErr } = await supabase
          .from("luckywheel_history")
          .select("id, user_id, result_type, coins_won, created_at")
          .in("result_type", ["coins", "gift"])
          .order("created_at", { ascending: false })
          .limit(5);
        if (wheelErr) throw wheelErr;

        const userIds = wheel?.map(w => w.user_id) || [];
        let userMap = {};
        if (userIds.length) {
          const { data: profiles } = await supabase
            .from("users_profiles")
            .select("id, full_name")
            .in("id", userIds);
          if (profiles) userMap = Object.fromEntries(profiles.map(p => [p.id, p.full_name || "Anonymous"]));
        }
        setWheelHistory(wheel?.map(w => ({ ...w, user_name: userMap[w.user_id] || "Anonymous" })) || []);

        // Test Winners
        const { data: winners, error: winnersErr } = await supabase
          .from("test_winners")
          .select("id, user_name, rank_no, approved_at, test_id, test_tests ( title )")
          .order("approved_at", { ascending: false })
          .limit(5);
        if (winnersErr) throw winnersErr;
        setTestWinners(winners || []);
      } catch (err) {
        console.error("Home fetch error:", err);
        setError("Could not load data. Please refresh.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="page-root">
      <style>{globalStyles}</style>

      {/* ── Subtle background orbs ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(59,130,246,0.06)", filter: "blur(80px)", top: -200, left: -200 }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(245,158,11,0.07)", filter: "blur(80px)", bottom: -150, right: -100 }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1140, margin: "0 auto", padding: "24px 14px" }}>

        {/* ════════════════════ HERO ════════════════════ */}
        <motion.section
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left: Text */}
          <div className="hero-text-col">
            <span className="coin-badge">🪙 AIDLA Coins — Learn & Earn</span>
            <h1 className="hero-h1">
              Learn.<br />
              <span style={{ background: "linear-gradient(135deg, var(--royal), var(--sky))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Earn Coins.</span>
              <br />Redeem Rewards.
            </h1>
            <p className="hero-para">
              Complete quizzes, spin the lucky wheel, and win big. Convert your <strong style={{ color: "var(--navy)" }}>AIDLA Coins</strong> to real products or withdraw to cash.
            </p>
            <div className="hero-btn-row">
              <Link to="/signup" className="hero-btn-primary">🚀 Start Free</Link>
              <Link to="/about" className="hero-btn-secondary">Learn More</Link>
            </div>
            <div className="trust-strip">
              {["✅ Free to Join", "🏆 Daily Prizes", "🌍 Global"].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <motion.div
            className="hero-img-wrap"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80"
              alt="Students learning and earning"
            />
            <div className="hero-img-overlay" />
            <div className="hero-floating-badge">
              <span className="badge-icon">🏅</span>
              <div>
                <div className="badge-title">1,200+ Winners</div>
                <div className="badge-sub">Prizes claimed this month</div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ════════════════════ STATS ════════════════════ */}
        <motion.div
          className="stats-strip"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { n: "50K+", l: "Registered Learners" },
            { n: "120K+", l: "Coins Redeemed" },
            { n: "1,200+", l: "Monthly Winners" },
            { n: "500+", l: "Daily Active Users" },
            { n: "98%", l: "Satisfaction Rate" },
          ].map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-number">{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </motion.div>

        {/* ════════════════════ QUOTE SLIDER ════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "clamp(32px, 5vw, 60px)" }}
        >
          <h2 className="section-heading">Words of Wisdom</h2>
          <p className="section-sub">Inspired by the Quran, Hadith, great thinkers & poets across languages</p>
          <QuoteSlider />
        </motion.section>

        {/* ════════════════════ HOW IT WORKS ════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "clamp(32px, 5vw, 60px)" }}
        >
          <h2 className="section-heading">How It Works</h2>
          <p className="section-sub">Four simple steps from sign-up to cash in hand</p>
          <div className="steps-row">
            {[
              { icon: "📝", title: "Sign Up Free", desc: "Create your account in under 30 seconds." },
              { icon: "📚", title: "Learn & Play", desc: "Take quizzes, enter draws, spin the wheel." },
              { icon: "🪙", title: "Earn Coins", desc: "Collect AIDLA Coins for every achievement." },
              { icon: "💵", title: "Redeem or Cash Out", desc: "Shop our store or withdraw to your bank." },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="step-item"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="step-circle">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ════════════════════ FEATURES ════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "clamp(32px, 5vw, 60px)" }}
        >
          <h2 className="section-heading">The AIDLA Ecosystem</h2>
          <p className="section-sub">Everything you need to learn, play and earn in one place</p>
          <div className="features-grid">
            {[
              { icon: "📚", color: "#dbeafe", label: "Smart Quizzes", desc: "Curriculum-aligned tests designed by expert educators to maximise learning outcomes." },
              { icon: "🎲", color: "#fef3c7", label: "Lucky Draws", desc: "Enter exclusive prize draws with your coins and win valuable gifts weekly." },
              { icon: "🎡", color: "#d1fae5", label: "Lucky Wheel", desc: "Spin daily for bonus coins, gifts, and extra draw chances." },
              { icon: "🛍️", color: "#ede9fe", label: "Rewards Shop", desc: "Redeem coins for gadgets, gift cards, vouchers, and exclusive merchandise." },
              { icon: "💵", color: "#fee2e2", label: "Cash Withdrawals", desc: "Transfer your coin balance directly to your bank account — real money, real fast." },
              { icon: "📊", color: "#e0f2fe", label: "Leaderboards", desc: "Compete with thousands of learners and climb the global rankings." },
              { icon: "🔔", color: "#fce7f3", label: "Instant Alerts", desc: "Get real-time alerts when you win a draw or your rank changes." },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="feature-icon" style={{ background: f.color }}>
                  {f.icon}
                </div>
                <h3>{f.label}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ════════════════════ RECENT WINNERS ════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "clamp(32px, 5vw, 60px)" }}
        >
          <h2 className="section-heading">🏆 Recent Winners</h2>
          <p className="section-sub">Real people. Real rewards. Updated live.</p>

          {loading && <div className="spinner" />}
          {error && (
            <div style={{ background: "#fee2e2", color: "#b91c1c", padding: 16, borderRadius: 14, textAlign: "center", marginBottom: 20 }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="winners-grid">
              {/* Lucky Draws */}
              <motion.div className="winner-card" whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                <div className="winner-card-header">
                  <span style={{ fontSize: "1.6rem" }}>🎲</span>
                  <h3>Lucky Draw Winners</h3>
                </div>
                {drawResults.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center", padding: 24 }}>No draws yet — check back soon!</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="winner-table">
                      <thead>
                        <tr>
                          <th>Winner</th>
                          <th>Prize</th>
                          <th>When</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drawResults.map((row, i) => (
                          <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                            <td>
                              <div style={{ fontWeight: 700, color: "var(--navy)" }}>{row.winner_name}</div>
                              <div style={{ fontSize: "0.76rem", color: "var(--slate)" }}>{row.draw_title}</div>
                            </td>
                            <td style={{ fontWeight: 700, color: "#059669" }}>{row.prize_text}</td>
                            <td style={{ color: "var(--slate)", fontSize: "0.8rem" }}>{formatDate(row.announced_at)}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              {/* Lucky Wheel */}
              <motion.div className="winner-card" whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                <div className="winner-card-header">
                  <span style={{ fontSize: "1.6rem" }}>🎡</span>
                  <h3>Wheel Winners</h3>
                </div>
                {wheelHistory.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center", padding: 24 }}>No wheel wins yet</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="winner-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Reward</th>
                          <th>When</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wheelHistory.map((row, i) => (
                          <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                            <td style={{ fontWeight: 700, color: "var(--navy)" }}>{row.user_name}</td>
                            <td><WheelBadge type={row.result_type} coins={row.coins_won} /></td>
                            <td style={{ color: "var(--slate)", fontSize: "0.8rem" }}>{formatDate(row.created_at)}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              {/* Test Toppers */}
              <motion.div className="winner-card" whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                <div className="winner-card-header">
                  <span style={{ fontSize: "1.6rem" }}>📝</span>
                  <h3>Test Toppers</h3>
                </div>
                {testWinners.length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center", padding: 24 }}>No test winners yet</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="winner-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Student</th>
                          <th>Test</th>
                          <th>When</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testWinners.map((row, i) => (
                          <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                            <td><RankBadge rank={row.rank_no} /></td>
                            <td style={{ fontWeight: 700, color: "var(--navy)" }}>{row.user_name}</td>
                            <td style={{ color: "var(--slate)" }}>{row.test_tests?.title || "Untitled"}</td>
                            <td style={{ color: "var(--slate)", fontSize: "0.8rem" }}>{formatDate(row.approved_at)}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.section>

        {/* ════════════════════ TESTIMONIALS ════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "clamp(32px, 5vw, 60px)" }}
        >
          <h2 className="section-heading">What Our Learners Say</h2>
          <p className="section-sub">Thousands of students worldwide trust AIDLA</p>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {[
              { name: "Sara Noor", loc: "Student", quote: "It helped me learn in a really fun way — I actually look forward to studying now!" },
              { name: "Hassan Ali", loc: "Student", quote: "I never thought studying could be this engaging. Feels like a game!" },
              { name: "Zainab Mir", loc: "Student", quote: "My grades improved so much. AIDLA makes every topic click!" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{ background: "var(--card-bg)", borderRadius: 14, padding: "14px 14px", boxShadow: "var(--shadow-card)", border: "1px solid rgba(59,130,246,0.08)", minWidth: 200, maxWidth: 240, flexShrink: 0 }}
              >
                <div style={{ color: "#f59e0b", fontSize: "0.8rem", marginBottom: 6 }}>★★★★★</div>
                <p style={{ color: "#374151", fontStyle: "italic", fontSize: "0.8rem", lineHeight: 1.45, marginBottom: 10 }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, var(--navy), var(--sky))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "0.75rem", flexShrink: 0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.75rem" }}>{t.name}</div>
                    <div style={{ color: "var(--slate)", fontSize: "0.66rem" }}>{t.loc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ════════════════════ CTA ════════════════════ */}
        <motion.div
          className="cta-section"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <span style={{ display: "inline-block", background: "rgba(245,158,11,0.2)", color: "#fcd34d", padding: "6px 18px", borderRadius: 30, fontSize: "0.85rem", fontWeight: 700, marginBottom: 20, border: "1px solid rgba(245,158,11,0.3)" }}>
              🌟 Join 50,000+ Learners Today
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 4.5vw, 3rem)", color: "#fff", fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
              Your Knowledge is<br />Your Greatest Asset
            </h2>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)", maxWidth: 480, margin: "0 auto 28px" }}>
              Every quiz you complete, every question you answer — it all earns you real, redeemable AIDLA Coins. Start your journey today.
            </p>
            <Link
              to="/signup"
              style={{ display: "inline-block", padding: "14px 40px", borderRadius: 50, background: "linear-gradient(135deg, #f59e0b, #fcd34d)", color: "#0b1437", fontWeight: 800, fontSize: "clamp(0.9rem, 2.5vw, 1.15rem)", textDecoration: "none", boxShadow: "0 14px 30px rgba(245,158,11,0.4)", transition: "transform 0.2s", whiteSpace: "nowrap" }}
            >
              ✨ Get Started — It's Free
            </Link>
          </div>
        </motion.div>

      </div>

      {/* ─── Footer ─── */}
      <footer className="site-footer">
        <div style={{ marginBottom: 10, fontSize: "1.1rem" }}>🕌</div>
        <p>© 2025 <strong>AIDLA</strong>. All rights reserved. Designed with ❤️ for learners everywhere.</p>
        <p style={{ marginTop: 8 }}>
          <Link to="/privacy-policy" style={{ color: "rgba(255,255,255,0.4)", marginRight: 16, textDecoration: "none" }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: "rgba(255,255,255,0.4)", marginRight: 16, textDecoration: "none" }}>Terms</Link>
          <Link to="/contact" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Contact</Link>
        </p>
      </footer>
    </div>
  );
}