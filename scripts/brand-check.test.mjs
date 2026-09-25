import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { MAX_CARD_BYTES, computeBrandWarnings, parseBrandCheckArgs } from "./brand-check.mjs";

function makeWorkspace({ cardFile, cardBytes = 200 * 1024 } = {}) {
  const root = mkdtempSync(join(tmpdir(), "brand-check-"));
  mkdirSync(join(root, "public"), { recursive: true });
  if (cardFile !== undefined) {
    writeFileSync(join(root, "public", cardFile), Buffer.alloc(cardBytes, 7));
  }
  return root;
}

test("missing og.jpg warns", () => {
  const root = makeWorkspace();
  const warnings = computeBrandWarnings({ workspaceRoot: root });
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /public\/og\.jpg is missing/);
});

test("compliant og.jpg is silent", () => {
  const root = makeWorkspace({ cardFile: "og.jpg" });
  assert.deepEqual(computeBrandWarnings({ workspaceRoot: root }), []);
});

test("oversized og.jpg warns", () => {
  const root = makeWorkspace({ cardFile: "og.jpg", cardBytes: MAX_CARD_BYTES + 1 });
  const warnings = computeBrandWarnings({ workspaceRoot: root });
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /over 600 KB/);
});

test("parseBrandCheckArgs", () => {
  assert.deepEqual(parseBrandCheckArgs([]), { root: null });
  assert.deepEqual(parseBrandCheckArgs(["--root", "/tmp/site"]), { root: "/tmp/site" });
  assert.match(parseBrandCheckArgs(["--root"]).error, /--root needs a directory/);
  assert.match(parseBrandCheckArgs(["--nope"]).error, /unexpected argument/);
});
