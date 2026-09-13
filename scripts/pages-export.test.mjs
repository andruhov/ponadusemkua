import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { flattenNestedBase, publishToRepoRoot, writeSpaFallback } from "./pages-export.mjs";

test("flattenNestedBase promotes nested index when dest has none", () => {
  const dest = mkdtempSync(join(tmpdir(), "pages-flat-"));
  mkdirSync(join(dest, "ponadusemkua", "en"), { recursive: true });
  writeFileSync(join(dest, "ponadusemkua", "index.html"), "nested-home");
  writeFileSync(join(dest, "ponadusemkua", "en", "index.html"), "nested-en");
  flattenNestedBase(dest);
  assert.equal(readFileSync(join(dest, "index.html"), "utf8"), "nested-home");
  assert.equal(readFileSync(join(dest, "en", "index.html"), "utf8"), "nested-en");
  assert.equal(existsSync(join(dest, "ponadusemkua")), false);
});

test("flattenNestedBase drops nested duplicate when dest already has index", () => {
  const dest = mkdtempSync(join(tmpdir(), "pages-dup-"));
  mkdirSync(join(dest, "ponadusemkua"), { recursive: true });
  writeFileSync(join(dest, "index.html"), "root-home");
  writeFileSync(join(dest, "ponadusemkua", "index.html"), "nested-home");
  flattenNestedBase(dest);
  assert.equal(readFileSync(join(dest, "index.html"), "utf8"), "root-home");
  assert.equal(existsSync(join(dest, "ponadusemkua")), false);
});

test("writeSpaFallback copies index to 404.html", () => {
  const dest = mkdtempSync(join(tmpdir(), "pages-404-"));
  writeFileSync(join(dest, "index.html"), "home");
  writeSpaFallback(dest);
  assert.equal(readFileSync(join(dest, "404.html"), "utf8"), "home");
});

test("publishToRepoRoot copies the Pages tree onto the repo root", () => {
  const root = mkdtempSync(join(tmpdir(), "pages-root-"));
  const dest = join(root, "docs");
  mkdirSync(join(dest, "en"), { recursive: true });
  mkdirSync(join(dest, "assets"), { recursive: true });
  writeFileSync(join(dest, "index.html"), "home");
  writeFileSync(join(dest, "404.html"), "home");
  writeFileSync(join(dest, "en", "index.html"), "en-home");
  writeFileSync(join(dest, "assets", "app.js"), "js");
  publishToRepoRoot(root, dest);
  assert.equal(readFileSync(join(root, "index.html"), "utf8"), "home");
  assert.equal(readFileSync(join(root, "en", "index.html"), "utf8"), "en-home");
  assert.equal(readFileSync(join(root, "assets", "app.js"), "utf8"), "js");
});
