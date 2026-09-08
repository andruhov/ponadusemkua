import fs from "node:fs";
import path from "node:path";

const candidates = [
  ".vercel/output/static",
  "dist/client",
  ".output/public",
  "dist",
];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

const root = process.cwd();
const src = candidates.map((p) => path.join(root, p)).find((p) => fs.existsSync(p));

if (!src) {
  console.error("pages-export: no static output in", candidates.join(", "));
  process.exit(1);
}

const dest = path.join(root, "docs");
fs.rmSync(dest, { recursive: true, force: true });
copyDir(src, dest);
fs.writeFileSync(path.join(dest, ".nojekyll"), "");

const index = path.join(dest, "index.html");
const shell = path.join(dest, "_shell.html");
if (!fs.existsSync(index) && fs.existsSync(shell)) {
  fs.copyFileSync(shell, index);
}
if (fs.existsSync(index)) {
  fs.copyFileSync(index, path.join(dest, "404.html"));
}

if (!fs.existsSync(index)) {
  console.error("pages-export: still no index.html in", dest);
  process.exit(1);
}

console.log(`pages-export: ${src} -> docs/index.html`);
