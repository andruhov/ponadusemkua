import { t, type Locale } from "@/lib/content";
import { asset } from "@/lib/utils";

export function localeHead(locale: Locale) {
  const c = t(locale);
  const ukUrl = asset("/");
  const enUrl = asset("/en");
  const canonical = locale === "en" ? enUrl : ukUrl;
  return {
    meta: [
      { title: c.short },
      { name: "description", content: c.metaDescription },
    ],
    links: [
      { rel: "canonical", href: canonical },
      { rel: "alternate", hrefLang: "uk", href: ukUrl },
      { rel: "alternate", hrefLang: "en", href: enUrl },
      { rel: "alternate", hrefLang: "x-default", href: ukUrl },
    ],
  };
}
