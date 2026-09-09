import donateRaw from "../../content/donate.jsonc?raw";
import socialsRaw from "../../content/socials.jsonc?raw";
import stringsRaw from "../../content/strings.jsonc?raw";

export type Locale = "uk" | "en";
export type Text = { uk: string; en: string };

export type Social = { id: string; label: string; href: string };
export type Jar = { id: string; href: string; title: Text; text: Text };
export type CopyValue = { label: Text; value: string };
export type BankPdf = { code: string; href: string };

type DonateFile = {
  jars: Jar[];
  cards: CopyValue[];
  bankPdfs: BankPdf[];
  crypto: CopyValue[];
  monero: string;
};

/** JSONC: // and /* comments, trailing commas. Not for strings that contain // inside quotes. */
function parseJsonc<T>(raw: string): T {
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
    out += ch;
    i += 1;
  }
  const noTrail = out.replace(/,\s*([\]}])/g, "$1");
  return JSON.parse(noTrail) as T;
}

const strings = parseJsonc<Record<string, Text>>(stringsRaw);
const donate = parseJsonc<DonateFile>(donateRaw);

export const socials = parseJsonc<Social[]>(socialsRaw);
export const jars = donate.jars;
export const cards = donate.cards;
export const bankPdfs = donate.bankPdfs;
export const cryptoWallets = donate.crypto;
export const monero = donate.monero;

export function t(locale: Locale): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of Object.keys(strings)) {
    const row = strings[key];
    out[key] = (locale === "en" ? row.en : row.uk) ?? "";
  }
  return out;
}
