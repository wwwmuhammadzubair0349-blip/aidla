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
  const supabaseUrl = env.SUPABASE_URL;
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
    const base = env.SITE_URL || "https://aidla.online";

    const [blogs, news, faqs] = await Promise.all([
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
    ]);

    const staticPages = [
      { loc: `${base}/`, changefreq: "daily", priority: 1.0 },
      { loc: `${base}/faqs`, changefreq: "daily", priority: 0.95 },
      { loc: `${base}/blogs`, changefreq: "daily", priority: 0.9 },
      { loc: `${base}/news`, changefreq: "daily", priority: 0.9 },
      { loc: `${base}/leaderboard`, changefreq: "daily", priority: 0.7 },
      { loc: `${base}/tools`, changefreq: "weekly", priority: 0.85 },

      { loc: `${base}/tools/pdf/word-to-pdf`, changefreq: "monthly", priority: 0.75 },
      { loc: `${base}/tools/pdf/image-to-pdf`, changefreq: "monthly", priority: 0.75 },
      { loc: `${base}/tools/image/jpg-to-png`, changefreq: "monthly", priority: 0.7 },
      { loc: `${base}/tools/career/cv-maker`, changefreq: "monthly", priority: 0.8 },
      { loc: `${base}/tools/career/cover-letter-maker`, changefreq: "monthly", priority: 0.8 },

      { loc: `${base}/contact`, changefreq: "monthly", priority: 0.6 },
      { loc: `${base}/privacy-policy`, changefreq: "yearly", priority: 0.3 },
      { loc: `${base}/terms`, changefreq: "yearly", priority: 0.3 },
    ];

    let urls = staticPages.map(urlEntry).join("\n");

    for (const b of blogs || []) {
      if (!b.slug) continue;
      urls += "\n" + urlEntry({
        loc: `${base}/blogs/${b.slug}`,
        lastmod: toDate(b.updated_at || b.created_at),
        changefreq: "weekly",
        priority: 0.8,
      });
    }

    for (const n of news || []) {
      if (!n.slug) continue;
      urls += "\n" + urlEntry({
        loc: `${base}/news/${n.slug}`,
        lastmod: toDate(n.updated_at || n.created_at),
        changefreq: "daily",
        priority: 0.8,
      });
    }

    for (const f of faqs || []) {
      if (!f.slug) continue;
      urls += "\n" + urlEntry({
        loc: `${base}/faqs/${f.slug}`,
        lastmod: toDate(f.updated_at || f.created_at),
        changefreq: "weekly",
        priority: 0.75,
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