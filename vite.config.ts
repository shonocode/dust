import { resolve } from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    }
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      // react-router builds the client to build/client; without this the
      // service worker is emitted to the default dist/ and never served
      outDir: "build/client",

      pwaAssets: {
        disabled: false,
        config: true,
        // the asset generator also defaults to dist/ instead of the
        // react-router client output; it requires an absolute path
        integration: {
          outDir: resolve(import.meta.dirname, "build/client"),
        },
      },

      manifest: {
        name: "D.U.S.T",
        short_name: "dust",
        description: "Digital Undercover Surveillance Terminal",
        theme_color: "#000000",
      },

      workbox: {
        globPatterns: ["**/*.{js,html,css,png,svg,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // FBI Wanted API responses: fresh when online, cached offline
            urlPattern: ({ url }) => url.origin === "https://api.fbi.gov",
            handler: "NetworkFirst",
            options: {
              cacheName: "fbi-api",
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // suspect photos are immutable-ish; serve from cache first.
            // These are no-cors/opaque responses, which Chromium pads to
            // ~7MB of quota each — keep maxEntries small and purge on
            // quota pressure.
            urlPattern: ({ url, request }) =>
              request.destination === "image" &&
              url.hostname.endsWith("fbi.gov"),
            handler: "CacheFirst",
            options: {
              cacheName: "fbi-images",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7,
                purgeOnQuotaError: true,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // VT323 font: cache so the terminal look survives offline
            urlPattern: ({ url }) => url.hostname === "fonts.googleapis.com",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-css" },
          },
          {
            urlPattern: ({ url }) => url.hostname === "fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-woff",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // crime statistics API (see routes/stats.tsx)
            urlPattern: ({ url }) => url.origin === "https://api.usa.gov",
            handler: "NetworkFirst",
            options: {
              cacheName: "cde-api",
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },

      devOptions: {
        enabled: false,
        suppressWarnings: true,
        navigateFallback: "/",
        navigateFallbackAllowlist: [/^\/$/],
        type: "module",
      },
    }),
  ],
});
