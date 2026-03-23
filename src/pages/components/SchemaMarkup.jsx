// src/components/SchemaMarkup.jsx
// ─────────────────────────────────────────────────────────────
// Drop-in global schema markup component
// Add once inside App.jsx — handles all pages automatically
//
// HOW TO ADD TO App.jsx:
//   1. Import at top: import SchemaMarkup from "./components/SchemaMarkup.jsx";
//   2. Add inside your return, before {!hidePublicHeader && <PublicHeader />}:
//      <SchemaMarkup />
// ─────────────────────────────────────────────────────────────

import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_URL  = "https://www.aidla.online";
const SITE_NAME = "AIDLA";
const LOGO_URL  = `${SITE_URL}/logo.png`;
const OG_IMAGE  = `${SITE_URL}/og-home.jpg`;

// ── Organization schema (shown on all pages) ──
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": SITE_NAME,
  "url": SITE_URL,
  "logo": {
    "@type": "ImageObject",
    "url": LOGO_URL,
    "width": 512,
    "height": 512,
  },
  "description": "Pakistan's free all-in-one education and rewards platform. Free tools, AI tools, board results, blogs, news, courses and more.",
  "sameAs": [
    "https://www.facebook.com/aidla.online",
    "https://twitter.com/aidla_online",
    "https://www.linkedin.com/company/aidla",
    "https://www.youtube.com/@aidla",
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": `${SITE_URL}/contact`,
    "availableLanguage": ["English", "Urdu"],
  },
  "areaServed": "PK",
  "knowsAbout": [
    "Pakistan Education",
    "MDCAT",
    "BISE Board Results",
    "Free Online Tools",
    "Pakistani Students",
  ],
};

// ── WebSite schema with SearchAction (Google Sitelinks Searchbox) ──
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_NAME,
  "url": SITE_URL,
  "description": "Pakistan's free education and rewards platform — AI tools, board results, CGPA calculator, MDCAT aggregate, blogs, news and more.",
  "inLanguage": ["en-PK", "ur"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_URL}/faqs?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ── Tool page schema ──
function toolSchema(name, description, url) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "url": url,
    "description": description,
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "PKR",
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
    "inLanguage": "en-PK",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
    },
  };
}

// ── Tool metadata map ──
const TOOL_META = {
  "/tools/education/cgpa-calculator":         { name: "CGPA Calculator Pakistan",          desc: "Calculate CGPA for Pakistani universities on 4.0 and 5.0 scale." },
  "/tools/education/mdcat-ecat-calculator":   { name: "MDCAT ECAT Aggregate Calculator",   desc: "Calculate medical and engineering admission aggregate for Pakistani universities." },
  "/tools/education/percentage-calculator":   { name: "Percentage Calculator",             desc: "Convert marks to percentage, calculate increase/decrease for Pakistani students." },
  "/tools/education/grade-calculator":        { name: "Grade Calculator Pakistan",         desc: "Convert marks to letter grades A+, A, B, C based on Pakistani grading scale." },
  "/tools/education/attendance-calculator":   { name: "Attendance Calculator",             desc: "Check if your attendance meets the required percentage for exams in Pakistan." },
  "/tools/education/marks-to-grade":          { name: "Marks to Grade Converter",          desc: "Convert raw marks to GPA, percentage and letter grade instantly." },
  "/tools/education/study-planner":           { name: "Study Planner",                     desc: "Plan study sessions across subjects before Pakistani board exams." },
  "/tools/education/pomodoro-timer":          { name: "Pomodoro Study Timer",              desc: "Focus timer with work and break intervals to boost study productivity." },
  "/tools/education/assignment-tracker":      { name: "Assignment Tracker",                desc: "Track assignments, deadlines and completion status for Pakistani students." },
  "/tools/education/flashcard-maker":         { name: "Flashcard Maker",                   desc: "Create digital flashcards to memorise concepts faster." },
  "/tools/education/scholarship-eligibility": { name: "Scholarship Eligibility Checker",  desc: "Check if your marks qualify for HEC, government and private scholarships." },
  "/tools/finance/salary-calculator":         { name: "Salary Tax Calculator Pakistan",    desc: "Calculate net salary after Pakistan income tax deductions." },
  "/tools/finance/zakat-calculator":          { name: "Zakat Calculator Pakistan",         desc: "Calculate Zakat on savings, gold, silver and assets." },
  "/tools/finance/loan-emi-calculator":       { name: "Loan EMI Calculator Pakistan",      desc: "Calculate monthly EMI for home, car or personal loans in Pakistan." },
  "/tools/finance/tip-calculator":            { name: "Tip Calculator",                    desc: "Split bills and calculate tips for groups easily." },
  "/tools/health/bmi-calculator":             { name: "BMI Calculator",                    desc: "Calculate Body Mass Index and healthy weight range." },
  "/tools/health/calorie-calculator":         { name: "Calorie Calculator",                desc: "Calculate daily calorie needs based on age, weight and activity level." },
  "/tools/health/water-intake-calculator":    { name: "Water Intake Calculator",           desc: "Find out how much water you should drink daily." },
  "/tools/health/sleep-calculator":           { name: "Sleep Calculator",                  desc: "Find the best bedtime or wake-up time based on sleep cycles." },
  "/tools/utility/qr-code-generator":         { name: "QR Code Generator",                 desc: "Generate QR codes for URLs, text, WhatsApp and WiFi for free." },
  "/tools/utility/age-calculator":            { name: "Age Calculator",                    desc: "Calculate exact age in years, months and days from any date." },
  "/tools/utility/word-counter":              { name: "Word Counter",                      desc: "Count words, characters, sentences and reading time." },
  "/tools/utility/password-generator":        { name: "Password Generator",                desc: "Generate strong, secure random passwords instantly." },
  "/tools/utility/unit-converter":            { name: "Unit Converter",                    desc: "Convert length, weight, temperature, speed and more." },
  "/tools/utility/countdown-timer":           { name: "Countdown Timer",                   desc: "Count down to any date — exams, events, deadlines." },
  "/tools/utility/percentage-change":         { name: "Percentage Change Calculator",      desc: "Calculate percentage increase or decrease between two values." },
  "/tools/utility/roman-numeral-converter":   { name: "Roman Numeral Converter",           desc: "Convert numbers to Roman numerals and back." },
  "/tools/utility/binary-converter":          { name: "Binary Converter",                  desc: "Convert decimal, binary, octal and hexadecimal numbers." },
  "/tools/utility/color-picker":              { name: "Color Picker",                      desc: "Pick colours and get HEX, RGB, HSL values instantly." },
  "/tools/utility/text-case-converter":       { name: "Text Case Converter",               desc: "Convert text to UPPERCASE, lowercase, Title Case and more." },
  "/tools/pdf/word-to-pdf":                   { name: "Word to PDF Converter",             desc: "Convert Word documents to PDF with perfect layout and formatting." },
  "/tools/pdf/image-to-pdf":                  { name: "Image to PDF Converter",            desc: "Combine JPG, PNG, WebP images into a single PDF." },
  "/tools/pdf/pdf-compressor":                { name: "PDF Compressor",                    desc: "Compress PDF files to reduce size without losing quality." },
  "/tools/image/jpg-to-png":                  { name: "JPG to PNG Converter",              desc: "Convert JPG images to PNG format instantly online." },
  "/tools/image/background-remover":          { name: "Background Remover",                desc: "Remove background from images automatically using AI." },
  "/tools/career/cv-maker":                   { name: "CV Maker Pakistan",                 desc: "Create a professional CV with 20+ templates. Print to PDF, no sign-up." },
  "/tools/career/cover-letter-maker":         { name: "Cover Letter Maker",                desc: "Tailored cover letters with 4 templates, adjustable tone. Live preview." },
  "/tools/ai/summarizer":                     { name: "AI Text Summarizer",                desc: "Paste any article and get a smart AI summary in seconds." },
  "/tools/ai/paraphraser":                    { name: "AI Paraphraser",                    desc: "Rewrite text in academic, casual, formal or creative styles using AI." },
  "/tools/ai/email-writer":                   { name: "AI Email Writer",                   desc: "AI writes professional emails — open directly in Gmail or Outlook." },
  "/tools/ai/interview-prep":                 { name: "AI Interview Prep",                 desc: "Enter a job title — get interview questions with ideal answers." },
  "/tools/ai/linkedin-bio":                   { name: "AI LinkedIn Bio Generator",         desc: "Generate a powerful LinkedIn About section in seconds using AI." },
  "/tools/ai/cover-letter":                   { name: "AI Cover Letter Generator",         desc: "AI writes a tailored cover letter for any job in seconds." },
};

// ── Board results schema ──
function boardSchema(boardId, url) {
  const name = boardId
    .replace("bise-", "BISE ")
    .replace("fbise-", "FBISE ")
    .split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${name} Result 2025 — Pakistan Board Results`,
    "url": url,
    "description": `Check ${name} matric and inter exam results online. All classes and groups.`,
    "publisher": { "@type": "Organization", "name": SITE_NAME, "url": SITE_URL },
    "inLanguage": "en-PK",
    "audience": { "@type": "EducationalAudience", "educationalRole": "student" },
  };
}

// ── Breadcrumb schema builder ──
function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

export default function SchemaMarkup() {
  const location = useLocation();
  const path = location.pathname;

  const schemas = [organizationSchema, websiteSchema];
  const breadcrumbs = [{ name: "Home", url: SITE_URL }];

  // ── Tool pages ──
  if (path.startsWith("/tools/")) {
    const meta = TOOL_META[path];
    if (meta) {
      schemas.push(toolSchema(meta.name, meta.desc, `${SITE_URL}${path}`));
      breadcrumbs.push({ name: "Tools", url: `${SITE_URL}/tools` });
      breadcrumbs.push({ name: meta.name, url: `${SITE_URL}${path}` });
    } else if (path === "/tools") {
      breadcrumbs.push({ name: "Tools", url: `${SITE_URL}/tools` });
    } else if (path.startsWith("/tools/results/")) {
      const boardId = path.replace("/tools/results/", "");
      schemas.push(boardSchema(boardId, `${SITE_URL}${path}`));
      breadcrumbs.push({ name: "Tools", url: `${SITE_URL}/tools` });
      breadcrumbs.push({ name: "Board Results", url: `${SITE_URL}/tools/results` });
      breadcrumbs.push({ name: boardId.toUpperCase().replace(/-/g, " "), url: `${SITE_URL}${path}` });
    } else if (path === "/tools/results") {
      breadcrumbs.push({ name: "Tools", url: `${SITE_URL}/tools` });
      breadcrumbs.push({ name: "Pakistan Board Results", url: `${SITE_URL}/tools/results` });
    }
  }

  // ── Blogs ──
  else if (path.startsWith("/blogs/")) {
    breadcrumbs.push({ name: "Blogs", url: `${SITE_URL}/blogs` });
    breadcrumbs.push({ name: "Article", url: `${SITE_URL}${path}` });
  } else if (path === "/blogs") {
    breadcrumbs.push({ name: "Blogs", url: `${SITE_URL}/blogs` });
  }

  // ── News ──
  else if (path.startsWith("/news/")) {
    breadcrumbs.push({ name: "News", url: `${SITE_URL}/news` });
    breadcrumbs.push({ name: "Article", url: `${SITE_URL}${path}` });
  } else if (path === "/news") {
    breadcrumbs.push({ name: "News", url: `${SITE_URL}/news` });
  }

  // ── FAQs ──
  else if (path.startsWith("/faqs/")) {
    breadcrumbs.push({ name: "FAQs", url: `${SITE_URL}/faqs` });
    breadcrumbs.push({ name: "Question", url: `${SITE_URL}${path}` });
  } else if (path === "/faqs") {
    breadcrumbs.push({ name: "FAQs", url: `${SITE_URL}/faqs` });
  }

  // ── Resources ──
  else if (path.startsWith("/resources/")) {
    breadcrumbs.push({ name: "Resources", url: `${SITE_URL}/resources` });
    breadcrumbs.push({ name: "Resource", url: `${SITE_URL}${path}` });
  } else if (path === "/resources") {
    breadcrumbs.push({ name: "Resources", url: `${SITE_URL}/resources` });
  }

  // ── Static pages ──
  else if (path === "/about") {
    breadcrumbs.push({ name: "About", url: `${SITE_URL}/about` });
  } else if (path === "/contact") {
    breadcrumbs.push({ name: "Contact", url: `${SITE_URL}/contact` });
  } else if (path === "/leaderboard") {
    breadcrumbs.push({ name: "Leaderboard", url: `${SITE_URL}/leaderboard` });
  } else if (path === "/autotube") {
    breadcrumbs.push({ name: "AutoTube", url: `${SITE_URL}/autotube` });
  }

  // Add breadcrumb schema if more than just Home
  if (breadcrumbs.length > 1) {
    schemas.push(breadcrumbSchema(breadcrumbs));
  }

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}