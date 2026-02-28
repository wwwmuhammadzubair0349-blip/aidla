import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function handler() {
  const base = "https://aidla.netlify.app";

  // BLOGS
  const { data: blogs } = await supabase
    .from("blogs_posts")
    .select("slug")
    .eq("status", "published")
    .is("deleted_at", null);

  // NEWS
  const { data: news } = await supabase
    .from("news_posts")
    .select("slug")
    .eq("status", "published")
    .is("deleted_at", null);

  let urls = `
  <url><loc>${base}/</loc></url>
  <url><loc>${base}/about</loc></url>
  <url><loc>${base}/blogs</loc></url>
  <url><loc>${base}/news</loc></url>
  <url><loc>${base}/leaderboard</loc></url>
  <url><loc>${base}/tools</loc></url>

  <url><loc>${base}/tools/pdf/word-to-pdf</loc></url>
  <url><loc>${base}/tools/pdf/image-to-pdf</loc></url>
  <url><loc>${base}/tools/image/jpg-to-png</loc></url>
  <url><loc>${base}/tools/career/cv-maker</loc></url>
  <url><loc>${base}/tools/career/cover-letter-maker</loc></url>

  <url><loc>${base}/contact</loc></url>
  <url><loc>${base}/privacy-policy</loc></url>
  <url><loc>${base}/terms</loc></url>

  <url><loc>${base}/signup</loc></url>
<url><loc>${base}/login</loc></url>
<url><loc>${base}/forgot-password</loc></url>

  `;

  blogs?.forEach((b) => {
    urls += `<url><loc>${base}/blogs/${b.slug}</loc></url>`;
  });

  news?.forEach((n) => {
    urls += `<url><loc>${base}/news/${n.slug}</loc></url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
  </urlset>`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/xml" },
    body: xml,
  };
}