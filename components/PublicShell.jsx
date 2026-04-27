"use client";
// components/PublicShell.jsx
// Reads the current pathname and decides whether to render
// the public header and footer.
//
// Rules:
//   /user/*  → no public header/footer  (UserLayout has its own)
//   /admin/* → no public header/footer  (AdminLayout has its own)
//   everything else → show public header + footer
//
// This replaces the old React Router logic in App.jsx:
//   const hidePublicHeader = location.pathname.startsWith("/user") ||
//                            location.pathname.startsWith("/admin");

import { usePathname } from "next/navigation";
import PublicHeader from "@/components/Navbar"; // your existing header
import Footer from "@/components/Footer";             // your existing footer

const HIDE_PUBLIC_CHROME = ["/user", "/admin"];

export default function PublicShell({ children }) {
  const pathname = usePathname();

  const hideChrome = HIDE_PUBLIC_CHROME.some(p => pathname.startsWith(p));

  if (hideChrome) {
    // /user/* and /admin/* — render ONLY the page content.
    // UserLayout / AdminLayout wrap it with their own header.
    return <>{children}</>;
  }

  // Public pages — render with nav header + footer
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
      <Footer />
    </>
  );
}