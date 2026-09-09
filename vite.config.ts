import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
// @ts-expect-error JS plugin alongside the TS vite config
import { grokPwaPlugin } from "./scripts/grok-pwa-plugin.mjs";
// @ts-expect-error JS plugin alongside the TS vite config
import { appEnvPlugin } from "./scripts/app-env-plugin.mjs";
// @ts-expect-error JS plugin alongside the TS vite config
import { galleryPlugin } from "./scripts/gallery-plugin.mjs";

// `0.0.0.0:8080` is the live-preview contract — don't change host/port.
export default defineConfig(({ command, isPreview }) => ({
  base: process.env.GITHUB_PAGES_BASE || (process.env.GITHUB_PAGES === "1" ? "/ponadusemkua/" : "/"),
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 8081,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    appEnvPlugin(),
    grokPwaPlugin(),
    galleryPlugin(),
    tailwindcss(),
    tanstackStart({
      pages: [
        { path: "/", prerender: { enabled: true } },
        { path: "/en", prerender: { enabled: true } },
        { path: "/eng", prerender: { enabled: true } },
      ],
    }),
    ...(command === "build" || isPreview
      ? [
          nitro({
            preset: "vercel",
            serverDir: "./server",
          }),
        ]
      : []),
    viteReact(),
  ],
}));
