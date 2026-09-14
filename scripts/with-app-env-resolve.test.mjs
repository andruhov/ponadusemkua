import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { planSpawn, projectRoot, resolveCommand } from "./with-app-env.mjs";

test("resolveCommand keeps absolute paths (node in tests)", () => {
  assert.equal(resolveCommand(process.execPath), process.execPath);
});

test("resolveCommand finds the local vite binary", () => {
  const resolved = resolveCommand("vite");
  const expected = join(
    projectRoot(),
    "node_modules",
    ".bin",
    process.platform === "win32" ? "vite.cmd" : "vite",
  );
  assert.equal(resolved, expected);
  assert.equal(existsSync(resolved), true);
});

test("planSpawn runs vite via node and vite.js", () => {
  const planned = planSpawn("vite", ["build"]);
  const viteJs = join(projectRoot(), "node_modules", "vite", "bin", "vite.js");
  assert.equal(planned.command, process.execPath);
  assert.equal(planned.shell, false);
  assert.deepEqual(planned.args, [viteJs, "build"]);
});
