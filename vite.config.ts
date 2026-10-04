import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
// @ts-expect-error JS plugin alongside the TS vite config
import { appEnvPlugin } from "./scripts/app-env-plugin.mjs";
// @ts-expect-error JS plugin alongside the TS vite config
import { galleryPlugin } from "./scripts/gallery-plugin.mjs";
// @ts-expect-error JS helper alongside the TS vite config
import { parseJsonc } from "./scripts/parse-jsonc.mjs";

const rootDir = dirname(fileURLToPath(import.meta.url));

function directionPrerenderPages() {
  const data = parseJsonc(readFileSync(join(rootDir, "content/directions.jsonc"), "utf8"));
  if (!Array.isArray(data)) return [];
  return data.flatMap((row) => {
    const slug = row && typeof row === "object" && "slug" in row ? String(row.slug) : "";
    if (!slug) return [];
    return [
      { path: `/napryamky/${slug}`, prerender: { enabled: true } },
      { path: `/en/napryamky/${slug}`, prerender: { enabled: true } },
    ];
  });
}

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
    galleryPlugin(),
    tailwindcss(),
    tanstackStart({
      pages: [
        { path: "/", prerender: { enabled: true } },
        { path: "/en", prerender: { enabled: true } },
        { path: "/eng", prerender: { enabled: true } },
        ...directionPrerenderPages(),
      ],
    }),
    ...(command === "build" || isPreview
      ? [
          nitro({
            preset: "vercel",
          }),
        ]
      : []),
    viteReact(),
  ],
}));
