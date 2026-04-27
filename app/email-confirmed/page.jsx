// app/email-confirmed/page.jsx
// Thin server wrapper — metadata only, noindex
export const metadata = {
  title: "Email Confirmed — AIDLA",
  description: "Your email has been confirmed. You can now sign in to AIDLA.",
  robots: { index: false, follow: true },
};

import EmailConfirmedClient from "./EmailConfirmedClient";

export default function EmailConfirmedPage() {
  return <EmailConfirmedClient />;
}