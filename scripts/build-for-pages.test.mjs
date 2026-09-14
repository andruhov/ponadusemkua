import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { restorePublished, stashPublished } from "./build-for-pages.mjs";

test("stashPublished moves root Pages files aside and restorePublished puts them back", () => {
  const root = mkdtempSync(join(tmpdir(), "stash-pages-"));
  const stashDir = join(root, ".pages-stash");
  writeFileSync(join(root, "index.html"), "home");
  mkdirSync(join(root, "assets"));
  writeFileSync(join(root, "assets", "app.css"), "css");
  writeFileSync(join(root, "package.json"), "{}");

  const moved = stashPublished(root, stashDir);
  assert.deepEqual(moved.sort(), ["assets", "index.html"]);
  assert.equal(existsSync(join(root, "index.html")), false);
  assert.equal(existsSync(join(root, "assets")), false);
  assert.equal(existsSync(join(root, "package.json")), true);
  assert.equal(readFileSync(join(stashDir, "index.html"), "utf8"), "home");

  restorePublished(root, stashDir);
  assert.equal(readFileSync(join(root, "index.html"), "utf8"), "home");
  assert.equal(readFileSync(join(root, "assets", "app.css"), "utf8"), "css");
  assert.equal(existsSync(stashDir), false);
});
