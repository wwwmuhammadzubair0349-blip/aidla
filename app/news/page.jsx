// app/news/page.jsx
import { supabase } from "@/lib/supabase";
import NewsClient from "./NewsClient";

// 🚀 ISR: Revalidate every 60 seconds — fresh news, instant TTFB
export const revalidate = 60;

const CANONICAL_URL = "https://www.aidla.online/news";
const OG_IMAGE      = "https://www.aidla.online/og-home.jpg";

// 🧠 100% SEO Metadata (Native Next.js — no react-helmet needed)
export const metadata = {
  title:       "AIDLA News – Latest Updates, Announcements & Events",
  description: "Read the latest news from AIDLA: platform updates, community events, educational tips, winner announcements, and breaking education news from Pakistan.",
  keywords:    ["AIDLA news", "platform updates", "community events", "educational news", "Pakistan edtech", "AIDLA announcements"],
  alternates:  { canonical: CANONICAL_URL },
  openGraph: {
    title:       "AIDLA News – Latest Updates & Announcements",
    description: "Stay informed with AIDLA's latest news, events, and winner announcements.",
    url:         CANONICAL_URL,
    siteName:    "AIDLA",
    images:      [{ url: OG_IMAGE, alt: "AIDLA News" }],
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "AIDLA News",
    description: "Catch up on the latest from AIDLA.",
    images:      [OG_IMAGE],
  },
};

export default async function NewsPage() {
  // ⚡ SERVER-SIDE FETCH — Googlebot, ClaudeBot, GPTBot see full content
  const { data: posts, error } = await supabase
    .from("news_posts")
    .select("id,title,slug,excerpt,cover_image_url,published_at,tags,view_count")
    .is("deleted_at", null)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  // 🤖 AI & Search Structured Data (CollectionPage + NewsArticle items)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name:        "AIDLA News",
        description: "Stay updated with the latest announcements, events, and community news from AIDLA.",
        url:         CANONICAL_URL,
        inLanguage:  "en",
        isPartOf:    { "@type": "WebSite", name: "AIDLA", url: "https://www.aidla.online" },
        publisher:   { "@type": "Organization", name: "AIDLA", url: "https://www.aidla.online" },
      },
      // Expose top 15 articles so AI crawlers can index individual pieces
      ...(posts?.slice(0, 15).map(post => ({
        "@type":          "NewsArticle",
        headline:         post.title,
        description:      post.excerpt || "",
        url:              `${CANONICAL_URL}/${post.slug}`,
        datePublished:    post.published_at,
        image:            post.cover_image_url || OG_IMAGE,
        publisher:        { "@type": "Organization", name: "AIDLA", url: "https://www.aidla.online" },
        author:           { "@type": "Organization", name: "AIDLA" },
        keywords:         (post.tags || []).join(", "),
      })) || []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Server-fetched posts passed directly — zero client waterfall */}
      <NewsClient initialPosts={posts || []} fetchError={!!error} />
    </>
  );
}