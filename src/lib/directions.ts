import { parseJsonc } from "../../scripts/parse-jsonc.mjs";
import directionsRaw from "../../content/directions.jsonc?raw";
import { type Text } from "@/lib/content";
import { directionImages } from "./gallery.gen";

export type Direction = {
  slug: string;
  href: string;
  title: Text;
  lead: Text;
  body: Text[];
  images: string[];
};

const SLUG = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

function fail(msg: string): never {
  throw new Error(`content/directions.jsonc: ${msg}`);
}

function isText(v: unknown): v is Text {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as Text).uk === "string" &&
    typeof (v as Text).en === "string"
  );
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseDirections(raw: string): Direction[] {
  const data = parseJsonc<unknown>(raw);
  if (!Array.isArray(data) || data.length === 0) fail("expected a non-empty list");
  const seen = new Set<string>();
  return data.map((item, i) => {
    if (!item || typeof item !== "object") fail(`[${i}] expected an object`);
    const row = item as Record<string, unknown>;
    if (typeof row.slug !== "string" || !SLUG.test(row.slug)) {
      fail(`[${i}].slug must be lowercase latin (supplies, camo)`);
    }
    if (seen.has(row.slug)) fail(`duplicate slug "${row.slug}"`);
    seen.add(row.slug);
    if (typeof row.href !== "string" || !isHttpUrl(row.href)) {
      fail(`[${i}].href must be a full http(s) URL`);
    }
    if (!isText(row.title) || !isText(row.lead)) fail(`[${i}] title/lead`);
    if (!Array.isArray(row.body) || row.body.length === 0 || !row.body.every(isText)) {
      fail(`[${i}].body`);
    }
    const images = (directionImages[row.slug] ?? []).map((file) => file.src);
    if (images.length === 0) {
      fail(`[${i}] no photos in public/work/${row.slug}/ — put at least one image there`);
    }
    return {
      slug: row.slug,
      href: row.href,
      title: row.title,
      lead: row.lead,
      body: row.body,
      images,
    };
  });
}

export const directions = parseDirections(directionsRaw);

export function directionBySlug(slug: string) {
  return directions.find((d) => d.slug === slug);
}

export const directionSlugs = directions.map((d) => d.slug);
