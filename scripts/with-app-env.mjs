#!/usr/bin/env node
/**
 * Run a command (usually Vite) with optional `app-env.json` merged into its
 * environment, and start Vite as `node node_modules/vite/bin/vite.js` so Windows
 * does not go through `vite.cmd`.
 *
 * Only `VITE_`-prefixed keys from `app-env.json` are honored. A real
 * `process.env` entry always wins. A missing file is a no-op.
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { constants as osConstants } from "node:os";
import { dirname, delimiter, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";

export const APP_ENV_REL_PATH = "app-env.json";

const VITE_PREFIX = "VITE_";

/**
 * Parse an app-env document, keeping only `VITE_`-prefixed string entries.
 * Anything unparseable is an empty environment — a workspace without the file
 * must behave exactly like today (no overrides).
 */
export function parseAppEnv(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {};
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  const env = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (!key.startsWith(VITE_PREFIX)) continue;
    if (typeof value !== "string") continue;
    env[key] = value;
  }
  return env;
}

/** The app env recorded under `root`, or `{}` when the file is absent. */
export function readAppEnv(root) {
  try {
    return parseAppEnv(readFileSync(join(root, APP_ENV_REL_PATH), "utf8"));
  } catch {
    return {};
  }
}

/** File values under the process environment: an explicit override wins. */
export function mergeAppEnv(appEnv, processEnv) {
  return { ...appEnv, ...processEnv };
}

/**
 * Translate a child's `exit` `(code, signal)` into this process's exit status.
 *
 * Do not re-raise the signal with `process.kill(process.pid, signal)`: under
 * qemu-user a self-directed signal can be delivered as SIGSEGV to the wrong
 * process. `128 + signo` is what a shell reports for a signal-killed command.
 */
export function exitStatusFromChild(code, signal) {
  if (signal) {
    const signo = osConstants.signals[signal];
    return 128 + (typeof signo === "number" ? signo : 1);
  }
  return code ?? 1;
}

/** The workspace root (this file lives in `<root>/scripts/`). */
export function projectRoot() {
  return dirname(dirname(fileURLToPath(import.meta.url)));
}

/**
 * Prefer `<root>/node_modules/.bin/<cmd>` so `npm run build` works when PATH
 * does not include the local bin dir (GitHub Actions `spawn("vite")` ENOENT).
 * Absolute paths (`process.execPath` in tests) are left alone.
 */
export function resolveCommand(command, root = projectRoot()) {
  if (!command || isAbsolute(command) || command.includes("/") || command.includes("\\")) {
    return command;
  }
  const binName = process.platform === "win32" ? `${command}.cmd` : command;
  const local = join(root, "node_modules", ".bin", binName);
  return existsSync(local) ? local : command;
}

/**
 * Run `vite` as `node node_modules/vite/bin/vite.js` so Windows does not go
 * through `vite.cmd` (`shell: true` + `"node"` is ENOENT when PATH is odd).
 */
export function planSpawn(command, args, root = projectRoot()) {
  const viteJs = join(root, "node_modules", "vite", "bin", "vite.js");
  if (command === "vite" && existsSync(viteJs)) {
    return { command: process.execPath, args: [viteJs, ...args], shell: false };
  }
  return {
    command: resolveCommand(command, root),
    args,
    shell: process.platform === "win32",
  };
}

/**
 * Whether `moduleUrl` is the script node was asked to run.
 *
 * Both sides are resolved through symlinks: node realpaths `import.meta.url`
 * but leaves `process.argv[1]` as typed, so comparing them raw makes a CLI
 * launched through a symlinked path a silent no-op.
 */
export function isMainModule(moduleUrl) {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return realpathSync(entry) === fileURLToPath(moduleUrl);
  } catch {
    return false;
  }
}

function main(argv) {
  const [command, ...args] = argv;
  if (!command) {
    console.error("usage: node scripts/with-app-env.mjs <command> [args…]");
    process.exit(2);
  }
  const root = projectRoot();
  const env = mergeAppEnv(readAppEnv(root), process.env);
  const binDir = join(root, "node_modules", ".bin");
  env.PATH = `${binDir}${delimiter}${dirname(process.execPath)}${delimiter}${env.PATH || ""}`;
  const planned = planSpawn(command, args, root);
  const child = spawn(planned.command, planned.args, {
    stdio: "inherit",
    env,
    shell: planned.shell,
  });
  // The dev server is long-running and is stopped by signalling this wrapper.
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    process.on(signal, () => child.kill(signal));
  }
  child.on("error", (err) => {
    console.error(`[with-app-env] failed to run ${command}:`, err?.message || err);
    process.exit(127);
  });
  child.on("exit", (code, signal) => {
    process.exit(exitStatusFromChild(code, signal));
  });
}

if (isMainModule(import.meta.url)) {
  main(process.argv.slice(2));
}
