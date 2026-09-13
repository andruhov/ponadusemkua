import { parseJsonc } from "../../scripts/parse-jsonc.mjs";
import donateRaw from "../../content/donate.jsonc?raw";
import socialsRaw from "../../content/socials.jsonc?raw";
import stringsRaw from "../../content/strings.jsonc?raw";

export type Locale = "uk" | "en";
export type Text = { uk: string; en: string };

export type Social = { id: string; label: string; href: string };
export type Jar = { id: string; href: string; title: Text; text: Text };
export type CopyValue = { label: Text; value: string };
export type BankPdf = { code: string; href: string };

const REQUIRED_STRING_KEYS = [
  "org",
  "short",
  "metaDescription",
  "kicker",
  "lede",
  "heroCta",
  "heroWork",
  "aboutTitle",
  "aboutP1",
  "aboutP2",
  "quote",
  "workTitle",
  "workLead",
  "emptyGallery",
  "seeMore",
  "openPhoto",
  "socialTitle",
  "socialLead",
  "thanks",
  "jarsTitle",
  "jarsLead",
  "openJar",
  "donateTitle",
  "donateLead",
  "tabCards",
  "tabBank",
  "tabCrypto",
  "tabAnon",
  "bankLead",
  "downloadPdf",
  "cryptoLead",
  "anonLead",
  "navAbout",
  "navWork",
  "navJars",
  "navDonate",
  "menu",
  "close",
  "prev",
  "next",
  "pause",
  "play",
  "closePhoto",
  "copy",
  "copied",
  "copyFailed",
  "newTab",
  "errorTitle",
  "errorLead",
  "langUk",
  "langEn",
  "skip",
] as const;

export type StringKey = (typeof REQUIRED_STRING_KEYS)[number];
export type Copy = Record<StringKey, string>;

function fail(file: string, msg: string): never {
  throw new Error(`${file}: ${msg}`);
}

function isText(v: unknown): v is Text {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as Text).uk === "string" &&
    typeof (v as Text).en === "string"
  );
}

function isCopyValue(v: unknown): v is CopyValue {
  return (
    !!v &&
    typeof v === "object" &&
    isText((v as CopyValue).label) &&
    typeof (v as CopyValue).value === "string" &&
    (v as CopyValue).value.length > 0
  );
}

function parseStrings(raw: string): Record<string, Text> {
  const data = parseJsonc<unknown>(raw);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    fail("content/strings.jsonc", "expected an object");
  }
  const out: Record<string, Text> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (!isText(value)) fail("content/strings.jsonc", `invalid "${key}"`);
    out[key] = value;
  }
  for (const key of REQUIRED_STRING_KEYS) {
    if (!(key in out)) fail("content/strings.jsonc", `missing "${key}"`);
  }
  return out;
}

function parseDonate(raw: string) {
  const data = parseJsonc<unknown>(raw);
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    fail("content/donate.jsonc", "expected an object");
  }
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.jars) || d.jars.length === 0) fail("content/donate.jsonc", "jars");
  const jars: Jar[] = d.jars.map((jar, i) => {
    if (!jar || typeof jar !== "object") fail("content/donate.jsonc", `jars[${i}]`);
    const row = jar as Record<string, unknown>;
    if (typeof row.id !== "string" || !row.id) fail("content/donate.jsonc", `jars[${i}].id`);
    if (typeof row.href !== "string" || !row.href) fail("content/donate.jsonc", `jars[${i}].href`);
    if (!isText(row.title) || !isText(row.text)) fail("content/donate.jsonc", `jars[${i}] text`);
    return { id: row.id, href: row.href, title: row.title, text: row.text };
  });
  if (!Array.isArray(d.cards) || !d.cards.every(isCopyValue)) fail("content/donate.jsonc", "cards");
  if (!Array.isArray(d.bankPdfs)) fail("content/donate.jsonc", "bankPdfs");
  const bankPdfs: BankPdf[] = d.bankPdfs.map((pdf, i) => {
    if (!pdf || typeof pdf !== "object") fail("content/donate.jsonc", `bankPdfs[${i}]`);
    const row = pdf as Record<string, unknown>;
    if (typeof row.code !== "string" || typeof row.href !== "string") {
      fail("content/donate.jsonc", `bankPdfs[${i}]`);
    }
    return { code: row.code, href: row.href };
  });
  if (!Array.isArray(d.crypto) || !d.crypto.every(isCopyValue)) fail("content/donate.jsonc", "crypto");
  if (typeof d.monero !== "string" || !d.monero) fail("content/donate.jsonc", "monero");
  return {
    jars,
    cards: d.cards as CopyValue[],
    bankPdfs,
    crypto: d.crypto as CopyValue[],
    monero: d.monero,
  };
}

function parseSocials(raw: string): Social[] {
  const data = parseJsonc<unknown>(raw);
  if (!Array.isArray(data) || data.length === 0) fail("content/socials.jsonc", "expected a list");
  return data.map((item, i) => {
    if (!item || typeof item !== "object") fail("content/socials.jsonc", `[${i}]`);
    const row = item as Record<string, unknown>;
    if (typeof row.id !== "string" || typeof row.label !== "string" || typeof row.href !== "string") {
      fail("content/socials.jsonc", `[${i}]`);
    }
    return { id: row.id, label: row.label, href: row.href };
  });
}

const strings = parseStrings(stringsRaw);
const donate = parseDonate(donateRaw);
export const socials = parseSocials(socialsRaw);

export const jars = donate.jars;
export const cards = donate.cards;
export const bankPdfs = donate.bankPdfs;
export const cryptoWallets = donate.crypto;
export const monero = donate.monero;

export const telegramHref =
  socials.find((s) => s.id === "telegram")?.href ?? "https://t.me/PonaduseMkUa";

const byLocale: Record<Locale, Copy> = {
  uk: {} as Copy,
  en: {} as Copy,
};
for (const key of REQUIRED_STRING_KEYS) {
  const row = strings[key];
  byLocale.uk[key] = row.uk;
  byLocale.en[key] = row.en;
}

export function t(locale: Locale): Copy {
  return byLocale[locale] ?? byLocale.uk;
}
