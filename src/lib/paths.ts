import type { Locale } from "@/lib/content";

export const DIRECTIONS_PREFIX = "aid";

export function homePath(locale: Locale) {
  return locale === "en" ? "/en" : "/";
}

export function directionPath(locale: Locale, slug: string) {
  return locale === "en" ? `/en/${DIRECTIONS_PREFIX}/${slug}` : `/${DIRECTIONS_PREFIX}/${slug}`;
}

/** Map /aid/camo ↔ /en/aid/camo and / ↔ /en. */
export function siblingLocalePath(pathname: string, target: Locale) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const rest = clean.replace(/^\/en(?=\/|$)/, "") || "/";
  if (target === "en") return rest === "/" ? "/en" : `/en${rest}`;
  return rest;
}

export function directionSlugFromPath(pathname: string) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const match = clean.match(new RegExp(`/${DIRECTIONS_PREFIX}/([^/]+)$`));
  return match?.[1] ?? null;
}
