import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { z } from "zod";
import { parseJsonc } from "./parse-jsonc.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const Text = z.object({ uk: z.string(), en: z.string() });
const CopyValue = z.object({ label: Text, value: z.string().min(1) });

test("content jsonc files match the schema", () => {
  const strings = parseJsonc(
    readFileSync(join(root, "content/strings.jsonc"), "utf8"),
  );
  z.record(z.string(), Text).parse(strings);
  for (const key of [
    "short",
    "metaDescription",
    "copyFailed",
    "newTab",
    "openPhoto",
    "workTitle",
    "readMore",
    "backToWork",
    "supportDirection",
    "otherDirections",
    "directionNotFound",
    "directionNotFoundLead",
  ]) {
    assert.ok(key in strings, `missing strings key ${key}`);
  }

  const donate = parseJsonc(readFileSync(join(root, "content/donate.jsonc"), "utf8"));
  z.object({
    jars: z
      .array(
        z.object({
          id: z.string().min(1),
          href: z.string().url(),
          title: Text,
          text: Text,
        }),
      )
      .min(1),
    cards: z.array(CopyValue).min(1),
    bankPdfs: z.array(z.object({ code: z.string().min(1), href: z.string().min(1) })),
    crypto: z.array(CopyValue),
    monero: z.string().min(1),
  }).parse(donate);

  const socials = parseJsonc(readFileSync(join(root, "content/socials.jsonc"), "utf8"));
  z.array(
    z.object({ id: z.string().min(1), label: z.string().min(1), href: z.string().url() }),
  )
    .min(1)
    .parse(socials);

  const jarIds = new Set(donate.jars.map((j) => j.id));
  const directions = parseJsonc(readFileSync(join(root, "content/directions.jsonc"), "utf8"));
  const parsed = z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/),
        jar: z.string().min(1),
        title: Text,
        lead: Text,
        body: z.array(Text).min(1),
      }),
    )
    .min(1)
    .parse(directions);
  const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
  const workRoot = join(root, "public", "work");
  const slugs = new Set();
  for (const row of parsed) {
    assert.ok(jarIds.has(row.jar), `direction "${row.slug}" jar "${row.jar}" is not in donate.jsonc`);
    assert.equal(slugs.has(row.slug), false, `duplicate direction slug ${row.slug}`);
    slugs.add(row.slug);
    const dir = join(workRoot, row.slug);
    assert.ok(existsSync(dir), `missing photo folder public/work/${row.slug}/`);
    const photos = readdirSync(dir).filter((name) => IMAGE_EXTS.has(extname(name).toLowerCase()));
    assert.ok(photos.length > 0, `put at least one photo in public/work/${row.slug}/`);
  }
  const loose = readdirSync(workRoot).filter((name) => {
    const full = join(workRoot, name);
    return statSync(full).isFile() && IMAGE_EXTS.has(extname(name).toLowerCase());
  });
  assert.equal(
    loose.length,
    0,
    `move these out of public/work/ into a slug folder: ${loose.join(", ")}`,
  );
});
