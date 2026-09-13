/**
 * JSONC: // and /* comments, trailing commas. Safe for // and `, }` inside strings.
 * @template T
 * @param {string} raw
 * @returns {T}
 */
export function parseJsonc(raw) {
  let out = "";
  let i = 0;
  let inStr = false;
  let escape = false;
  let inLine = false;
  let inBlock = false;
  while (i < raw.length) {
    const ch = raw[i];
    const next = raw[i + 1];
    if (inLine) {
      if (ch === "\n") {
        inLine = false;
        out += ch;
      }
      i += 1;
      continue;
    }
    if (inBlock) {
      if (ch === "*" && next === "/") {
        inBlock = false;
        i += 2;
        continue;
      }
      i += 1;
      continue;
    }
    if (inStr) {
      out += ch;
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inStr = false;
      i += 1;
      continue;
    }
    if (ch === '"') {
      inStr = true;
      out += ch;
      i += 1;
      continue;
    }
    if (ch === "/" && next === "/") {
      inLine = true;
      i += 2;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlock = true;
      i += 2;
      continue;
    }
    if (ch === ",") {
      let j = i + 1;
      while (j < raw.length && /[ \t\r\n]/.test(raw[j])) j += 1;
      if (raw[j] === "]" || raw[j] === "}") {
        i += 1;
        continue;
      }
    }
    out += ch;
    i += 1;
  }
  return JSON.parse(out);
}
