// functions/sitemap.xml.js
// Cloudflare Pages Function — replace your existing file completely
// Changes: Added all missing tool pages from App.jsx

function escXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${escXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}${changefreq ? `\n    <changefreq>${changefreq}</changefreq>` : ""}${priority != null ? `\n    <priority>${priority}</priority>` : ""}
  </url>`;
}

function toDate(ts) {
  if (!ts) return null;
  return new Date(ts).toISOString().split("T")[0];
}

async function fetchTable({ env, table, select, filters = [] }) {
  const supabaseUrl  = env.SUPABASE_URL;
  const supabaseAnon = env.SUPABASE_ANON_KEY;

  const params = new URLSearchParams();
  params.set("select", select);

  for (const [key, value] of filters) {
    params.set(key, value);
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${params.toString()}`, {
    headers: {
      apikey: supabaseAnon,
      Authorization: `Bearer ${supabaseAnon}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch ${table}: ${res.status} ${text}`);
  }

  return res.json();
}

export async function onRequestGet(context) {
  try {
    const { env } = context;
    const base = env.SITE_URL || "https://www.aidla.online";

    const [blogs, news, faqs, studyMaterials] = await Promise.all([
      fetchTable({
        env,
        table: "blogs_posts",
        select: "slug,updated_at,created_at",
        filters: [
          ["status", "eq.published"],
          ["deleted_at", "is.null"],
        ],
      }),
      fetchTable({
        env,
        table: "news_posts",
        select: "slug,updated_at,created_at",
        filters: [
          ["status", "eq.published"],
          ["deleted_at", "is.null"],
        ],
      }),
      fetchTable({
        env,
        table: "faqs",
        select: "slug,updated_at,created_at,is_visible,status",
        filters: [
          ["status", "eq.published"],
          ["is_visible", "eq.true"],
        ],
      }),
      fetchTable({
        env,
        table: "study_materials",
        select: "slug,updated_at,created_at",
        filters: [
          ["status", "eq.published"],
          ["deleted_at", "is.null"],
        ],
      }),
    ]);

    const staticPages = [
      // ── Core pages ──
      { loc: `${base}/`,               changefreq: "daily",   priority: 1.0  },
      { loc: `${base}/about`,          changefreq: "monthly", priority: 0.7  },
      { loc: `${base}/contact`,        changefreq: "monthly", priority: 0.6  },
      { loc: `${base}/privacy-policy`, changefreq: "yearly",  priority: 0.3  },
      { loc: `${base}/terms`,          changefreq: "yearly",  priority: 0.3  },

      // ── Content pages ──
      { loc: `${base}/blogs`,          changefreq: "daily",   priority: 0.9  },
      { loc: `${base}/news`,           changefreq: "daily",   priority: 0.9  },
      { loc: `${base}/faqs`, changefreq: "weekly", priority: 0.95 },
      { loc: `${base}/resources`,      changefreq: "daily",   priority: 0.9  },
      { loc: `${base}/leaderboard`,    changefreq: "daily",   priority: 0.7  },
      { loc: `${base}/autotube`,       changefreq: "weekly",  priority: 0.85 },

      // ── Tools hub ──
      { loc: `${base}/tools`,          changefreq: "weekly",  priority: 0.85 },

      // ── Results ──
      { loc: `${base}/tools/results`,  changefreq: "daily",   priority: 0.9  },

      // ── AI Tools ──
      { loc: `${base}/tools/ai/summarizer`,      changefreq: "monthly", priority: 0.85 },
      { loc: `${base}/tools/ai/paraphraser`,     changefreq: "monthly", priority: 0.85 },
      { loc: `${base}/tools/ai/email-writer`,    changefreq: "monthly", priority: 0.85 },
      { loc: `${base}/tools/ai/interview-prep`,  changefreq: "monthly", priority: 0.85 },
      { loc: `${base}/tools/ai/linkedin-bio`,    changefreq: "monthly", priority: 0.85 },
      { loc: `${base}/tools/ai/cover-letter`,    changefreq: "monthly", priority: 0.85 },

      // ── Education Tools ──
      { loc: `${base}/tools/education/cgpa-calculator`,         changefreq: "monthly", priority: 0.85 },
      { loc: `${base}/tools/education/mdcat-ecat-calculator`,   changefreq: "monthly", priority: 0.85 },
      { loc: `${base}/tools/education/percentage-calculator`,   changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/education/grade-calculator`,        changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/education/attendance-calculator`,   changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/education/marks-to-grade`,          changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/education/study-planner`,           changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/education/pomodoro-timer`,          changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/education/assignment-tracker`,      changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/education/flashcard-maker`,         changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/education/scholarship-eligibility`, changefreq: "monthly", priority: 0.8  },

      // ── Finance Tools ──
      { loc: `${base}/tools/finance/salary-calculator`,   changefreq: "monthly", priority: 0.8 },
      { loc: `${base}/tools/finance/zakat-calculator`,    changefreq: "monthly", priority: 0.8 },
      { loc: `${base}/tools/finance/loan-emi-calculator`, changefreq: "monthly", priority: 0.8 },
      { loc: `${base}/tools/finance/tip-calculator`,      changefreq: "monthly", priority: 0.75 },

      // ── Health Tools ──
      { loc: `${base}/tools/health/bmi-calculator`,          changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/health/calorie-calculator`,      changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/health/water-intake-calculator`, changefreq: "monthly", priority: 0.75 },
      { loc: `${base}/tools/health/sleep-calculator`,        changefreq: "monthly", priority: 0.75 },

      // ── Utility Tools ──
      { loc: `${base}/tools/utility/qr-code-generator`,      changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/utility/age-calculator`,         changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/utility/word-counter`,           changefreq: "monthly", priority: 0.75 },
      { loc: `${base}/tools/utility/password-generator`,     changefreq: "monthly", priority: 0.75 },
      { loc: `${base}/tools/utility/unit-converter`,         changefreq: "monthly", priority: 0.75 },
      { loc: `${base}/tools/utility/countdown-timer`,        changefreq: "monthly", priority: 0.75 },
      { loc: `${base}/tools/utility/percentage-change`,      changefreq: "monthly", priority: 0.75 },
      { loc: `${base}/tools/utility/roman-numeral-converter`,changefreq: "monthly", priority: 0.7  },
      { loc: `${base}/tools/utility/binary-converter`,       changefreq: "monthly", priority: 0.7  },
      { loc: `${base}/tools/utility/color-picker`,           changefreq: "monthly", priority: 0.7  },
      { loc: `${base}/tools/utility/text-case-converter`,    changefreq: "monthly", priority: 0.7  },

      // ── PDF Tools ──
      { loc: `${base}/tools/pdf/word-to-pdf`,      changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/pdf/image-to-pdf`,     changefreq: "monthly", priority: 0.8  },
      { loc: `${base}/tools/pdf/pdf-compressor`,   changefreq: "monthly", priority: 0.8  },

      // ── Image Tools ──
      { loc: `${base}/tools/image/jpg-to-png`,          changefreq: "monthly", priority: 0.75 },
      { loc: `${base}/tools/image/background-remover`,  changefreq: "monthly", priority: 0.8  },

      // ── Career Tools ──
      { loc: `${base}/tools/career/cv-maker`,           changefreq: "monthly", priority: 0.85 },
      { loc: `${base}/tools/career/cover-letter-maker`, changefreq: "monthly", priority: 0.85 },
    ];

    let urls = staticPages.map(urlEntry).join("\n");

    // ── Board result pages (26 boards) ──
    const BOARD_IDS = [
      "bise-lahore", "bise-gujranwala", "bise-faisalabad",
      "bise-rawalpindi", "bise-multan", "bise-sahiwal",
      "bise-dgkhan", "bise-sargodha", "bise-bahawalpur",
      "bise-peshawar", "bise-mardan", "bise-abbottabad",
      "bise-bannu", "bise-swat", "bise-kohat",
      "bise-malakand", "bise-dikhankpk", "bise-karachi",
      "bise-hyderabad", "bise-sukkur", "bise-larkana",
      "bise-mirpurkhas", "bise-quetta", "fbise-islamabad",
      "bise-ajk", "bise-gilgit",
    ];

    for (const id of BOARD_IDS) {
      urls += "\n" + urlEntry({
        loc: `${base}/tools/results/${id}`,
        changefreq: "weekly",
        priority: 0.85,
      });
    }

    // ── Blogs ──
    for (const b of blogs || []) {
      if (!b.slug) continue;
      urls += "\n" + urlEntry({
        loc: `${base}/blogs/${b.slug}`,
        lastmod: toDate(b.updated_at || b.created_at),
        changefreq: "weekly",
        priority: 0.8,
      });
    }

    // ── News ──
    for (const n of news || []) {
      if (!n.slug) continue;
      urls += "\n" + urlEntry({
        loc: `${base}/news/${n.slug}`,
        lastmod: toDate(n.updated_at || n.created_at),
        changefreq: "daily",
        priority: 0.8,
      });
    }

    // ── FAQs ──
    for (const f of faqs || []) {
      if (!f.slug) continue;
      urls += "\n" + urlEntry({
        loc: `${base}/faqs/${f.slug}`,
        lastmod: toDate(f.updated_at || f.created_at),
        changefreq: "weekly",
        priority: 0.75,
      });
    }

    // ── Resources / Study Materials ──
    for (const m of studyMaterials || []) {
      if (!m.slug) continue;
      urls += "\n" + urlEntry({
        loc: `${base}/resources/${m.slug}`,
        lastmod: toDate(m.updated_at || m.created_at),
        changefreq: "weekly",
        priority: 0.85,
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });

  } catch (error) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><error>${escXml(error.message)}</error>`,
      {
        status: 500,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}