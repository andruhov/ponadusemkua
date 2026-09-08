import fs from "node:fs";
import path from "node:path";

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function listImages(dir, urlPrefix) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((name) => EXTS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "uk", { numeric: true }))
    .map((name) => ({ src: `${urlPrefix}/${name}`, name }));
}

function readCaptions(file) {
  const map = new Map();
  if (!fs.existsSync(file)) return map;
  const text = fs.readFileSync(file, "utf8");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const parts = line.split("|").map((s) => s.trim());
    if (parts.length < 2) continue;
    if (parts[0] === "n") continue;
    const n = Number(parts[0]);
    if (!Number.isInteger(n) || n < 1) continue;
    map.set(n, {
      captionUk: parts[1] ?? "",
      captionEn: parts[2] ?? "",
      urlUk: parts[3] ?? "",
      urlEn: parts[4] ?? "",
    });
  }
  return map;
}

export function writeGalleryManifest(root) {
  const slideshowDir = path.join(root, "public/slideshow");
  const workDir = path.join(root, "public/work");
  fs.mkdirSync(slideshowDir, { recursive: true });
  fs.mkdirSync(workDir, { recursive: true });

  const slideshowImages = listImages(slideshowDir, "/slideshow");
  const captions = readCaptions(path.join(workDir, "captions.txt"));
  const workImages = listImages(workDir, "/work").map((img, i) => {
    const cap = captions.get(i + 1) ?? {};
    return {
      ...img,
      n: i + 1,
      captionUk: cap.captionUk ?? "",
      captionEn: cap.captionEn ?? "",
      urlUk: cap.urlUk ?? "",
      urlEn: cap.urlEn ?? "",
    };
  });

  const out = path.join(root, "src/lib/gallery.gen.ts");
  const body =
    `/* eslint-disable */\n` +
    `// Generated from public/slideshow and public/work — do not edit.\n` +
    `export type GalleryFile = {\n` +
    `  src: string;\n` +
    `  name: string;\n` +
    `};\n\n` +
    `export type WorkFile = GalleryFile & {\n` +
    `  n: number;\n` +
    `  captionUk: string;\n` +
    `  captionEn: string;\n` +
    `  urlUk: string;\n` +
    `  urlEn: string;\n` +
    `};\n\n` +
    `export const slideshowImages: GalleryFile[] = ${JSON.stringify(slideshowImages, null, 2)};\n\n` +
    `export const workImages: WorkFile[] = ${JSON.stringify(workImages, null, 2)};\n`;

  fs.mkdirSync(path.dirname(out), { recursive: true });
  const prev = fs.existsSync(out) ? fs.readFileSync(out, "utf8") : "";
  if (prev !== body) fs.writeFileSync(out, body);
  return { slideshow: slideshowImages.length, work: workImages.length };
}

export function galleryPlugin() {
  return {
    name: "gallery-folder",
    configResolved(config) {
      writeGalleryManifest(config.root);
    },
    configureServer(server) {
      const slideshowDir = path.join(server.config.root, "public/slideshow");
      const workDir = path.join(server.config.root, "public/work");
      fs.mkdirSync(slideshowDir, { recursive: true });
      fs.mkdirSync(workDir, { recursive: true });
      server.watcher.add(slideshowDir);
      server.watcher.add(workDir);
      const onFs = (file) => {
        const inSlide = !path.relative(slideshowDir, file).startsWith("..");
        const inWork = !path.relative(workDir, file).startsWith("..");
        if (!inSlide && !inWork) return;
        writeGalleryManifest(server.config.root);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", onFs);
      server.watcher.on("unlink", onFs);
      server.watcher.on("change", onFs);
    },
    buildStart() {
      writeGalleryManifest(process.cwd());
    },
  };
}
