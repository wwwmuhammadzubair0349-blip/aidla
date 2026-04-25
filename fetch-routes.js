// fetch-routes.js
// Place this file in project root (same folder as package.json)

import { createClient } from "@supabase/supabase-js";
import { writeFileSync, readFileSync } from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// This is the same toSlug function from your PublicCourses.jsx
function toSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchRoutes() {
  console.log("🔍 Fetching dynamic routes from Supabase...");

  // ── Static routes — always included ──
  const staticRoutes = [
    "/",
    "/about",
    "/blogs",
    "/news",
    "/faqs",
    "/tools",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/leaderboard",
    "/courses",
    "/resources",
    "/autotube",
  ];

  // ── Fetch blog slugs ──
  const { data: blogs } = await supabase
    .from("blogs_posts")
    .select("slug")
    .eq("status", "published")
    .is("deleted_at", null);

  // ── Fetch news slugs ──
  const { data: news } = await supabase
    .from("news_posts")
    .select("slug")
    .eq("status", "published")
    .is("deleted_at", null);

  // ── Fetch FAQ slugs ──
  const { data: faqs } = await supabase
    .from("faqs")
    .select("slug")
    .eq("status", "published")
    .eq("is_visible", true);

  // ── Fetch course titles (slugs are generated from title) ──
  const { data: courses } = await supabase
    .from("course_courses")
    .select("title")
    .eq("status", "published");

// ── Fetch resource slugs ──
  const { data: resources } = await supabase
    .from("study_materials")
    .select("slug")
    .eq("status", "published")
    .is("deleted_at", null);

  // ── Build all routes ──
  const blogRoutes     = (blogs     || []).map(b => `/blogs/${b.slug}`);
  const newsRoutes     = (news      || []).map(n => `/news/${n.slug}`);
  const faqRoutes      = (faqs      || []).map(f => `/faqs/${f.slug}`);
  const courseRoutes   = (courses   || []).map(c => `/courses/${toSlug(c.title)}`);
  const resourceRoutes = (resources || []).map(r => `/resources/${r.slug}`);

  const allRoutes = [
    ...staticRoutes,
    ...blogRoutes,
    ...newsRoutes,
    ...faqRoutes,
    ...courseRoutes,
    ...resourceRoutes,
  ];

// Save routes for react-snap
  writeFileSync(
    "./prerender-routes.json",
    JSON.stringify(allRoutes, null, 2)
  );

  // Also inject into package.json reactSnap.include
  const pkgRaw  = readFileSync("./package.json", "utf-8");
  const pkg     = JSON.parse(pkgRaw);
  pkg.reactSnap = pkg.reactSnap || {};
  pkg.reactSnap.include = allRoutes;
  writeFileSync("./package.json", JSON.stringify(pkg, null, 2));

  console.log(`✅ ${allRoutes.length} total routes saved`);
  console.log(`   Static:    ${staticRoutes.length}`);
  console.log(`   Blogs:     ${blogRoutes.length}`);
  console.log(`   News:      ${newsRoutes.length}`);
  console.log(`   FAQs:      ${faqRoutes.length}`);
  console.log(`   Courses:   ${courseRoutes.length}`);
  console.log(`   Resources: ${resourceRoutes.length}`);
}

fetchRoutes().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});