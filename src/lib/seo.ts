import { t, type Locale } from "@/lib/content";
import type { Direction } from "@/lib/directions";
import { directionPath, homePath } from "@/lib/paths";
import { asset } from "@/lib/utils";

export const SITE_ORIGIN = "https://andruhov.github.io";

function pageHead(locale: Locale, opts: { title: string; description: string; path: string; altPath: string }) {
  const canonical = asset(opts.path);
  const pageUrl = `${SITE_ORIGIN}${canonical}`;
  const ogImage = `${SITE_ORIGIN}${asset("og.jpg")}`;
  const ukUrl = asset(locale === "uk" ? opts.path : opts.altPath);
  const enUrl = asset(locale === "en" ? opts.path : opts.altPath);
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: pageUrl },
      { property: "og:image", content: ogImage },
      { property: "og:locale", content: locale === "en" ? "en_US" : "uk_UA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "canonical", href: canonical },
      { rel: "alternate", hrefLang: "uk", href: ukUrl },
      { rel: "alternate", hrefLang: "en", href: enUrl },
      { rel: "alternate", hrefLang: "x-default", href: ukUrl },
    ],
  };
}

export function localeHead(locale: Locale) {
  const c = t(locale);
  return pageHead(locale, {
    title: c.short,
    description: c.metaDescription,
    path: homePath(locale),
    altPath: homePath(locale === "en" ? "uk" : "en"),
  });
}

export function directionHead(locale: Locale, direction?: Direction) {
  const c = t(locale);
  if (!direction) {
    return pageHead(locale, {
      title: `${c.directionNotFound} — ${c.short}`,
      description: c.directionNotFoundLead,
      path: homePath(locale),
      altPath: homePath(locale === "en" ? "uk" : "en"),
    });
  }
  const title = `${direction.title[locale]} — ${c.short}`;
  return pageHead(locale, {
    title,
    description: direction.lead[locale],
    path: directionPath(locale, direction.slug),
    altPath: directionPath(locale === "en" ? "uk" : "en", direction.slug),
  });
}
