// app/layout.jsx  — Root layout
// Controls when the public header/footer are shown.
// /user/* and /admin/* have their own layouts (UserLayout, AdminLayout)
// so the public header and footer must NOT render there.
//
// How it works:
//   - UserLayout  lives at app/user/layout.jsx   → wraps all /user/* pages
//   - AdminLayout lives at app/admin/layout.jsx  → wraps all /admin/* pages
//   - Those layouts render their own headers/footers.
//   - This root layout renders PublicHeader + Footer only for public pages.
//
// We use a client component (PublicShell) to read the pathname and
// conditionally render the public chrome, because layout.jsx itself
// must stay a server component to export metadata.

import { Inter } from "next/font/google";
import PublicShell from "@/components/PublicShell";
import "@/app/globals.css"; // your global styles — adjust path if needed

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: { default: "AIDLA", template: "%s | AIDLA" },
  description: "AIDLA — AI-powered learning, earning and career tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}