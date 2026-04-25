import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/,
  },

  build: {
    target: "es2015",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) return "vendor-react";
          if (id.includes("node_modules/framer-motion"))    return "vendor-motion";
          if (id.includes("node_modules/@supabase") ||
              id.includes("node_modules/supabase"))         return "vendor-supabase";
          if (id.includes("node_modules/react-router") ||
              id.includes("node_modules/@remix-run"))       return "vendor-router";
          if (id.includes("node_modules/react-helmet"))     return "vendor-helmet";
          if (id.includes("node_modules/"))                 return "vendor-misc";
        },
        chunkFileNames:  "assets/[name]-[hash].js",
        entryFileNames:  "assets/[name]-[hash].js",
        assetFileNames:  "assets/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    sourcemap: false,
  },

  preview: {
    port: 4173,
    strictPort: true,
  },
});