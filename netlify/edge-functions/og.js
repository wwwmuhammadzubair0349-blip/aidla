export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Only handle blog/news pages
  const isBlog = path.startsWith("/blogs/");
  const isNews = path.startsWith("/news/");
  if (!isBlog && !isNews) return context.next();

  // Get slug: /blogs/:slug or /news/:slug
  const parts = path.split("/").filter(Boolean);
  const slug = parts[1];
  if (!slug) return context.next();

  // Load your HTML (Netlify will serve it)
  const indexRes = await fetch(new URL("/index.html", url.origin));
  let html = await indexRes.text();

  // Default OG (fallback)
  let ogTitle = "AIDLA - Learn, Earn & Win Rewards";
  let ogDesc = "Join AIDLA to learn, earn coins, and win exciting rewards.";
  let ogImage = "https://aidla.online/og-image.jpg";
  let ogUrl = `https://aidla.online${path}`;

  // Supabase REST (public)
  const supabaseUrl = Netlify.env.get("SUPABASE_URL");
  const supabaseAnon = Netlify.env.get("SUPABASE_ANON_KEY");

  // Your tables
  const table = isBlog ? "blogs_posts" : "news_posts";

  try {
    const api = `${supabaseUrl}/rest/v1/${table}?slug=eq.${encodeURIComponent(
      slug
    )}&select=title,excerpt,cover_image_url,meta_title,meta_description&limit=1`;

    const r = await fetch(api, {
      headers: {
        apikey: supabaseAnon,
        Authorization: `Bearer ${supabaseAnon}`,
      },
    });

    const data = await r.json();
    const row = Array.isArray(data) ? data[0] : null;

    if (row) {
      // Prefer meta fields if you filled them
      ogTitle = row.meta_title || row.title || ogTitle;
      ogDesc = row.meta_description || row.excerpt || ogDesc;
      ogImage = row.cover_image_url || ogImage;
    }
  } catch (e) {
    // keep defaults if anything fails
  }

  // Replace placeholders
  html = html
    .replaceAll("__OG_TITLE__", escapeHtml(ogTitle))
    .replaceAll("__OG_DESCRIPTION__", escapeHtml(ogDesc))
    .replaceAll("__OG_IMAGE__", ogImage)
    .replaceAll("__OG_URL__", ogUrl);

  return new Response(html, {
    headers: { "content-type": "text/html; charset=UTF-8" },
  });
};

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}