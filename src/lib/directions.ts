import { parseJsonc } from "../../scripts/parse-jsonc.mjs";
import directionsRaw from "../../content/directions.jsonc?raw";
import { jars, type Jar, type Text } from "@/lib/content";

export type Direction = {
  slug: string;
  jar: string;
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

function parseDirections(raw: string): Direction[] {
  const data = parseJsonc<unknown>(raw);
  if (!Array.isArray(data) || data.length === 0) fail("expected a non-empty list");
  const seen = new Set<string>();
  return data.map((item, i) => {
    if (!item || typeof item !== "object") fail(`[${i}] expected an object`);
    const row = item as Record<string, unknown>;
    if (typeof row.slug !== "string" || !SLUG.test(row.slug)) {
      fail(`[${i}].slug must be lowercase latin (produkty, sitky)`);
    }
    if (seen.has(row.slug)) fail(`duplicate slug "${row.slug}"`);
    seen.add(row.slug);
    if (typeof row.jar !== "string" || !row.jar) fail(`[${i}].jar`);
    if (!jars.some((j) => j.id === row.jar)) {
      fail(`[${i}].jar "${row.jar}" is not an id in donate.jsonc`);
    }
    if (!isText(row.title) || !isText(row.lead)) fail(`[${i}] title/lead`);
    if (!Array.isArray(row.body) || row.body.length === 0 || !row.body.every(isText)) {
      fail(`[${i}].body`);
    }
    if (!Array.isArray(row.images) || !row.images.every((p) => typeof p === "string" && p.startsWith("/"))) {
      fail(`[${i}].images — paths like /work/photo.jpg`);
    }
    return {
      slug: row.slug,
      jar: row.jar,
      title: row.title,
      lead: row.lead,
      body: row.body,
      images: row.images,
    };
  });
}

export const directions = parseDirections(directionsRaw);

export function directionBySlug(slug: string) {
  return directions.find((d) => d.slug === slug);
}

export function jarForDirection(direction: Direction): Jar | undefined {
  return jars.find((j) => j.id === direction.jar);
}

export const directionSlugs = directions.map((d) => d.slug);
