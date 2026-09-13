import type { Locale } from "@/lib/content";

export function localeFromPath(pathname: string): Locale {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/en" || path.startsWith("/en/") || path === "/eng" || path.startsWith("/eng/")) {
    return "en";
  }
  return "uk";
}
