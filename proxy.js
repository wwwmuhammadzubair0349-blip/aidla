// proxy.js — project ROOT
// 
// IMPORTANT: Supabase JS v2 stores sessions in localStorage by default,
// NOT in cookies. This means edge/server proxy cannot read the session.
//
// Auth protection is handled client-side in:
//   - app/user/layout.jsx   (useAuth hook)
//   - app/admin/layout.jsx  (useAuth hook with requireAdmin)
//
// This proxy file only handles the initial redirect to /login for
// unauthenticated users hitting protected routes directly. Because
// Supabase uses localStorage, we cannot verify the session here —
// we pass all requests through and let the layouts handle it.
//
// To get true server-side protection with Supabase, you would need to
// configure Supabase with cookie storage (see: supabase.com/docs/guides/auth/server-side).

import { NextResponse } from "next/server";

// Pass everything through — auth is handled by UserLayout and AdminLayout
export default function proxy(request) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*"],
};