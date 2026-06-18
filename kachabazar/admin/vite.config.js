import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
// import compression from "vite-plugin-compression2";
// import { visualizer } from "rollup-plugin-visualizer";

import dns from "dns";
import path from "path";

dns.setDefaultResultOrder("verbatim");

const apiTarget = process.env.VITE_API_TARGET || "http://localhost:5056";

export default defineConfig({
  // root: "./", // Set the root directory of your project
  base: "/admin/",

  build: {
    outDir: "build", // comment this if you select vite as project when deploy
    assetsDir: "@/assets", // Set the directory for the static assets
    // sourcemap: process.env.__DEV__ === "true",
    rollupOptions: {
      output: {
        // Add content hash to all output files for cache busting
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 10 * 1024,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      devOptions: {
        // enabled: process.env.SW_DEV === "true",
        enabled: false,
        /* when using generateSW the PWA plugin will switch to classic */
        type: "module",
        navigateFallback: "index.html",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        // Skip waiting is controlled by the prompt flow
        skipWaiting: false,
        clientsClaim: true,
        // Don't cache-bust URLs that already have hashes
        dontCacheBustURLsMatching: /\.[a-f0-9]{8}\./,
      },

      includeAssets: [
        "src/assets/img/logo/*.png",
        "src/assets/img/*.png",
        "src/assets/img/*.jepg",
        "src/assets/img/*.webp",
        "favicon.ico",
      ],
      manifest: {
        theme_color: "#FFFFFF",
        background_color: "#FFFFFF",
        display: "standalone",
        orientation: "portrait",
        scope: ".",
        start_url: ".",
        id: ".",
        short_name: "hautecouturejewellery - E-Commerce Website",
        name: "hautecouturejewellery | React eCommerce Admin Dashboard",
        description:
          "hautecouturejewellery : React Grocery & Organic Food Store e-commerce Admin Dashboard",
        icons: [
          {
            src: "favicon.ico",
            sizes: "48x48",
            type: "image/x-icon",
          },
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    // compression(),
    // visualizer({
    //   filename: "statistics.html",
    //   open: true,
    // }),
  ],

  server: {
    allowedHosts: ["kachabazar_admin", "192.168.29.108", ".local"],
    proxy: {
      "/api/": {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/v1"),
      },
      "/socket.io/": {
        target: apiTarget,
        changeOrigin: true,
        ws: true,
      },
      "/static/": {
        target: apiTarget,
        changeOrigin: true,
      },
      "/uploads/": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
  // define: {
  //   "process.env": process.env,
  //   // global: {}, //enable this when running on dev/local mode
  // },

  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src/"),
      // Patch @radix-ui/react-compose-refs to fix infinite loop in React 19
      // The original v1.1.2 useComposedRefs creates unstable callbacks that
      // cause "Maximum update depth exceeded" errors with React 19 callback refs
      "@radix-ui/react-compose-refs": path.resolve(
        __dirname,
        "./src/lib/radix-compose-refs-patch.js",
      ),
      // Patch @radix-ui/react-slot to use useComposedRefs (stable hook) instead
      // of composeRefs (new function each render) — prevents React 19 ref cycle
      "@radix-ui/react-slot": path.resolve(
        __dirname,
        "./src/lib/radix-slot-patch.js",
      ),
    },
  },
  test: {
    global: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTest.js"],
  },
});
