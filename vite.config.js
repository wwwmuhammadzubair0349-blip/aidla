import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/,
  },

  build: {
    /*
      FIX 1 — Legacy JavaScript (-23 KiB)
      =====================================
      Your old config had no target set, so Vite/esbuild defaulted to
      a very broad browser support list (back to ES5), injecting polyfills
      for things like async/await, optional chaining, nullish coalescing,
      class fields — none of which modern browsers need.

      "es2015" = target Chrome 63+, Firefox 67+, Safari 12+ (covers 97%+
      of real-world users). No polyfills injected. Saves ~23 KiB of JS.

      If you see errors in very old browsers after this, you can widen
      to "es2017" (async/await native — still saves most of the 23 KiB).
    */
    target: "es2015",

    /*
      FIX 2 — Unused JavaScript (-384 KiB) via manual chunk splitting
      =================================================================
      By default Vite dumps everything into one giant bundle:
        index-[hash].js  ~600-800 KiB
      
      Lighthouse then reports "Reduce unused JavaScript" because the
      browser downloads the WHOLE bundle just to show the home page,
      even though 80% of the code (Blogs, FAQs, BlogPost, etc.) isn't
      needed yet.

      manualChunks splits the bundle into separate files that are only
      downloaded when the user navigates to that route.

      Result:
        vendor-react.js     ~140 KiB  (React + ReactDOM — cached long-term)
        vendor-motion.js     ~90 KiB  (Framer Motion — heavy, rarely changes)
        vendor-supabase.js   ~80 KiB  (Supabase client)
        vendor-router.js     ~30 KiB  (React Router)
        vendor-helmet.js      ~8 KiB  (React Helmet)
        index.js             ~50 KiB  (your app shell + home page)
        [route chunks]       ~20-40 KiB each (loaded on demand)

      The browser only downloads vendor chunks ONCE and caches them.
      Route chunks are loaded lazily (see App.jsx fix).

      IMPORTANT: This works together with React.lazy() in App.jsx.
      Without lazy loading, all chunks are downloaded eagerly anyway.
    */
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — most stable, cache forever
          if (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/scheduler/")) {
            return "vendor-react";
          }
          // Framer Motion — large, changes rarely
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-motion";
          }
          // Supabase — large, changes rarely
          if (id.includes("node_modules/@supabase") ||
              id.includes("node_modules/supabase")) {
            return "vendor-supabase";
          }
          // React Router
          if (id.includes("node_modules/react-router") ||
              id.includes("node_modules/@remix-run")) {
            return "vendor-router";
          }
          // React Helmet
          if (id.includes("node_modules/react-helmet")) {
            return "vendor-helmet";
          }
          // Everything else in node_modules → vendor-misc
          // (lodash, date-fns, etc. if you use them)
          if (id.includes("node_modules/")) {
            return "vendor-misc";
          }
          // Your own src files are left as-is — Vite splits them
          // automatically per route when using React.lazy()
        },

        /*
          Deterministic file names with content hashes.
          Cloudflare can cache [name]-[hash].js forever because
          the hash changes when content changes.
        */
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },

    /*
      Raise the chunk size warning from 500 KiB to 600 KiB.
      vendor-react + vendor-motion are legitimately large —
      the warning would be noise after splitting.
    */
    chunkSizeWarningLimit: 600,

    /*
      Enable CSS code splitting — each route gets only the CSS it needs.
      (Vite default is true, but being explicit is good practice)
    */
    cssCodeSplit: true,

    /*
      Source maps in production: "hidden" means source maps are generated
      (useful for error monitoring like Sentry) but not served publicly.
      Use false if you don't use error monitoring.
    */
    sourcemap: false,
  },

  /*
    Preview server config — mirrors production for local testing.
    Run: vite preview
  */
  preview: {
    port: 4173,
    strictPort: true,
  },
});