import type { Locale } from "@/lib/content";

export const DIRECTIONS_PREFIX = "napryamky";

export function homePath(locale: Locale) {
  return locale === "en" ? "/en" : "/";
}

export function directionPath(locale: Locale, slug: string) {
  return locale === "en" ? `/en/${DIRECTIONS_PREFIX}/${slug}` : `/${DIRECTIONS_PREFIX}/${slug}`;
}

/** Map /napryamky/sitky ↔ /en/napryamky/sitky and / ↔ /en. */
export function siblingLocalePath(pathname: string, target: Locale) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const rest = clean.replace(/^\/en(?=\/|$)/, "") || "/";
  if (target === "en") return rest === "/" ? "/en" : `/en${rest}`;
  return rest;
}

export function directionSlugFromPath(pathname: string) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const match = clean.match(/\/napryamky\/([^/]+)$/);
  return match?.[1] ?? null;
}
