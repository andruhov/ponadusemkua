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

export function writeGalleryManifest(root) {
  const slideshowDir = path.join(root, "public/slideshow");
  fs.mkdirSync(slideshowDir, { recursive: true });

  const slideshowImages = listImages(slideshowDir, "/slideshow");

  const out = path.join(root, "src/lib/gallery.gen.ts");
  const body =
    `/* eslint-disable */\n` +
    `// Generated from public/slideshow — do not edit.\n` +
    `export type GalleryFile = {\n` +
    `  src: string;\n` +
    `  name: string;\n` +
    `};\n\n` +
    `export const slideshowImages: GalleryFile[] = ${JSON.stringify(slideshowImages, null, 2)};\n`;

  fs.mkdirSync(path.dirname(out), { recursive: true });
  const prev = fs.existsSync(out) ? fs.readFileSync(out, "utf8") : "";
  if (prev !== body) fs.writeFileSync(out, body);
  return { slideshow: slideshowImages.length };
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
      fs.mkdirSync(slideshowDir, { recursive: true });
      server.watcher.add(slideshowDir);
      const onFs = (file) => {
        const inSlide = !path.relative(slideshowDir, file).startsWith("..");
        if (!inSlide) return;
        writeGalleryManifest(rootDir);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", onFs);
      server.watcher.on("unlink", onFs);
      server.watcher.on("change", onFs);
    },
    buildStart() {
      writeGalleryManifest(rootDir);
    },
  };
}
