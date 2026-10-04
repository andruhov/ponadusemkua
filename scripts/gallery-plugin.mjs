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

function listDirectionImages(workDir) {
  fs.mkdirSync(workDir, { recursive: true });
  const bySlug = {};
  for (const name of fs.readdirSync(workDir).sort((a, b) => a.localeCompare(b, "uk", { numeric: true }))) {
    const full = path.join(workDir, name);
    if (!fs.statSync(full).isDirectory()) continue;
    bySlug[name] = listImages(full, `/work/${name}`);
  }
  return bySlug;
}

function underDir(dir, file) {
  const rel = path.relative(dir, file);
  return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
}

export function writeGalleryManifest(root) {
  const slideshowDir = path.join(root, "public/slideshow");
  const workDir = path.join(root, "public/work");
  fs.mkdirSync(slideshowDir, { recursive: true });
  fs.mkdirSync(workDir, { recursive: true });

  const slideshowImages = listImages(slideshowDir, "/slideshow");
  const directionImages = listDirectionImages(workDir);

  const out = path.join(root, "src/lib/gallery.gen.ts");
  const body =
    `/* eslint-disable */\n` +
    `// Generated from public/slideshow and public/work/<slug> — do not edit.\n` +
    `export type GalleryFile = {\n` +
    `  src: string;\n` +
    `  name: string;\n` +
    `};\n\n` +
    `export const slideshowImages: GalleryFile[] = ${JSON.stringify(slideshowImages, null, 2)};\n\n` +
    `export const directionImages: Record<string, GalleryFile[]> = ${JSON.stringify(directionImages, null, 2)};\n`;

  fs.mkdirSync(path.dirname(out), { recursive: true });
  const prev = fs.existsSync(out) ? fs.readFileSync(out, "utf8") : "";
  if (prev !== body) fs.writeFileSync(out, body);
  return {
    slideshow: slideshowImages.length,
    directions: Object.fromEntries(Object.entries(directionImages).map(([slug, files]) => [slug, files.length])),
  };
}

export function galleryPlugin() {
  let rootDir = process.cwd();
  return {
    name: "gallery-folder",
    configResolved(config) {
      rootDir = config.root;
      writeGalleryManifest(rootDir);
    },
    configureServer(server) {
      const slideshowDir = path.join(rootDir, "public/slideshow");
      const workDir = path.join(rootDir, "public/work");
      fs.mkdirSync(slideshowDir, { recursive: true });
      fs.mkdirSync(workDir, { recursive: true });
      server.watcher.add(slideshowDir);
      server.watcher.add(workDir);
      const onFs = (file) => {
        if (!underDir(slideshowDir, file) && !underDir(workDir, file)) return;
        writeGalleryManifest(rootDir);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", onFs);
      server.watcher.on("unlink", onFs);
      server.watcher.on("change", onFs);
      server.watcher.on("addDir", onFs);
      server.watcher.on("unlinkDir", onFs);
    },
    buildStart() {
      writeGalleryManifest(rootDir);
    },
  };
}
