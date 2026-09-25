import { t, type Locale } from "@/lib/content";
import { asset } from "@/lib/utils";

export const SITE_ORIGIN = "https://andruhov.github.io";

export function localeHead(locale: Locale) {
  const c = t(locale);
  const ukUrl = asset("/");
  const enUrl = asset("/en");
  const canonical = locale === "en" ? enUrl : ukUrl;
  const pageUrl = `${SITE_ORIGIN}${canonical}`;
  const ogImage = `${SITE_ORIGIN}${asset("og.jpg")}`;
  return {
    meta: [
      { title: c.short },
      { name: "description", content: c.metaDescription },
      { property: "og:title", content: c.short },
      { property: "og:description", content: c.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: pageUrl },
      { property: "og:image", content: ogImage },
      { property: "og:locale", content: locale === "en" ? "en_US" : "uk_UA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: c.short },
      { name: "twitter:description", content: c.metaDescription },
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
