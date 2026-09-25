import fs from "node:fs";
import path from "node:path";

export const CANDIDATES = [
  ".vercel/output/static",
  "dist/client",
  ".output/public",
  "dist",
];

export function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

/** Drop a nested `base` folder (e.g. docs/ponadusemkua) left by a non-root Vite base. */
export function flattenNestedBase(dest, baseName = "ponadusemkua") {
  const nested = path.join(dest, baseName);
  if (!fs.existsSync(nested) || !fs.statSync(nested).isDirectory()) return false;
  const nestedIndex = path.join(nested, "index.html");
  const destIndex = path.join(dest, "index.html");
  if (fs.existsSync(nestedIndex) && !fs.existsSync(destIndex)) {
    for (const name of fs.readdirSync(nested)) {
      fs.renameSync(path.join(nested, name), path.join(dest, name));
    }
  }
  fs.rmSync(nested, { recursive: true, force: true });
  return true;
}

export function writeSpaFallback(dest) {
  const index = path.join(dest, "index.html");
  const shell = path.join(dest, "_shell.html");
  if (!fs.existsSync(index) && fs.existsSync(shell)) {
    fs.copyFileSync(shell, index);
  }
  if (fs.existsSync(index)) {
    fs.copyFileSync(index, path.join(dest, "404.html"));
  }
  return index;
}

export function assertEnglishPrerender(dest) {
  const enIndex = path.join(dest, "en", "index.html");
  if (!fs.existsSync(enIndex)) {
    throw new Error(`pages-export: missing ${enIndex}`);
  }
  const html = fs.readFileSync(enIndex, "utf8");
  if (!html.includes("Who we are") && !html.includes("Mykolaiv First")) {
    throw new Error("pages-export: en/index.html is not the English prerender");
  }
}

const ROOT_FILES = [".nojekyll", "404.html", "eng.html", "favicon.svg", "index.html", "og.jpg"];
const ROOT_DIRS = ["assets", "en", "eng", "pdf", "slideshow", "work"];

/** Copy the Pages tree onto the repo root. Unused while Pages is deployed from Actions. */
export function publishToRepoRoot(root, dest) {
  for (const name of ROOT_FILES) {
    const from = path.join(dest, name);
    const to = path.join(root, name);
    if (fs.existsSync(to) && fs.statSync(to).isFile()) fs.rmSync(to, { force: true });
    if (fs.existsSync(from) && fs.statSync(from).isFile()) fs.copyFileSync(from, to);
  }
  for (const name of ROOT_DIRS) {
    const from = path.join(dest, name);
    const to = path.join(root, name);
    if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
    if (fs.existsSync(from)) copyDir(from, to);
  }
}

export function exportPages(root = process.cwd()) {
  const src = CANDIDATES.map((p) => path.join(root, p)).find((p) => fs.existsSync(p));
  if (!src) {
    throw new Error(`pages-export: no static output in ${CANDIDATES.join(", ")}`);
  }

  const dest = path.join(root, "docs");
  fs.rmSync(dest, { recursive: true, force: true });
  copyDir(src, dest);
  flattenNestedBase(dest);
  fs.writeFileSync(path.join(dest, ".nojekyll"), "");

  const index = writeSpaFallback(dest);
  if (!fs.existsSync(index)) {
    throw new Error(`pages-export: still no index.html in ${dest}`);
  }
  assertEnglishPrerender(dest);
  return { src, dest };
}

const invoked =
  process.argv[1] && path.basename(process.argv[1]).replace(/\.[^.]+$/, "") === "pages-export";
if (invoked) {
  try {
    const { src } = exportPages();
    console.log(`pages-export: ${src} -> docs/index.html`);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
