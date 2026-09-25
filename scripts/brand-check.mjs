#!/usr/bin/env node
/**
 * Share-card gate: `public/og.jpg` must exist and stay under 600 KB so link
 * scrapers can unfurl it. Used by browser-smoke and runnable on its own:
 *
 *   node scripts/brand-check.mjs [--root <dir>]
 */
import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const MAX_CARD_BYTES = 600 * 1024;

function defaultRoot() {
  return join(dirname(fileURLToPath(import.meta.url)), "..");
}

export function computeBrandWarnings({ workspaceRoot = defaultRoot() } = {}) {
  const cardPath = join(workspaceRoot, "public/og.jpg");
  if (!existsSync(cardPath)) {
    return ["BRAND WARNING: public/og.jpg is missing."];
  }
  if (statSync(cardPath).size > MAX_CARD_BYTES) {
    return [
      `BRAND WARNING: ${cardPath} is over 600 KB — link scrapers time out or skip images this heavy.`,
    ];
  }
  return [];
}

export function parseBrandCheckArgs(argv) {
  const usage = "usage: node scripts/brand-check.mjs [--root <dir>]";
  let root = null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--root") {
      root = argv[++i];
      if (root === undefined) return { error: `--root needs a directory — ${usage}` };
    } else {
      return { error: `unexpected argument: ${argv[i]} — ${usage}` };
    }
  }
  return { root };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseBrandCheckArgs(process.argv.slice(2));
  if (args.error) {
    console.error(JSON.stringify({ ok: false, error: args.error }, null, 2));
    process.exit(1);
  }
  const workspaceRoot = args.root ?? defaultRoot();
  const messages = computeBrandWarnings({ workspaceRoot });
  console.log(
    JSON.stringify(
      {
        ok: messages.length === 0,
        workspaceRoot,
        warnings: messages.length,
        messages,
      },
      null,
      2,
    ),
  );
  process.exitCode = messages.length === 0 ? 0 : 1;
}
