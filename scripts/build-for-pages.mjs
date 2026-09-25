/**
 * Vite/Nitro treat a committed root `index.html` + `assets/*.css` as the app
 * template. Those files are the GitHub Pages tree, not source — stash them
 * for the duration of `vite build`, then let pages-export write a fresh copy.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { exportPages } from "./pages-export.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const STASH = join(ROOT, ".pages-stash");

export const PUBLISHED_NAMES = [
  ".nojekyll",
  "404.html",
  "eng.html",
  "favicon.svg",
  "index.html",
  "og.jpg",
  "assets",
  "en",
  "eng",
  "pdf",
  "slideshow",
  "work",
];

export function stashPublished(root = ROOT, stashDir = STASH) {
  rmSync(stashDir, { recursive: true, force: true });
  mkdirSync(stashDir, { recursive: true });
  const moved = [];
  for (const name of PUBLISHED_NAMES) {
    const from = join(root, name);
    if (!existsSync(from)) continue;
    renameSync(from, join(stashDir, name));
    moved.push(name);
  }
  return moved;
}

export function restorePublished(root = ROOT, stashDir = STASH) {
  if (!existsSync(stashDir)) return;
  for (const name of PUBLISHED_NAMES) {
    const from = join(stashDir, name);
    if (!existsSync(from)) continue;
    const to = join(root, name);
    rmSync(to, { recursive: true, force: true });
    renameSync(from, to);
  }
  rmSync(stashDir, { recursive: true, force: true });
}

export function discardStash(stashDir = STASH) {
  rmSync(stashDir, { recursive: true, force: true });
}

function runViteBuild() {
  const result = spawnSync(process.execPath, [join(ROOT, "scripts/with-app-env.mjs"), "vite", "build"], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if (result.error) {
    console.error("[build-for-pages]", result.error.message);
    return 127;
  }
  return result.status ?? 1;
}

const invoked =
  process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("build-for-pages.mjs");
if (invoked) {
  stashPublished();
  const code = runViteBuild();
  if (code !== 0) {
    restorePublished();
    process.exit(code);
  }
  discardStash();
  try {
    const { src } = exportPages(ROOT);
    console.log(`pages-export: ${src} -> docs/index.html`);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
