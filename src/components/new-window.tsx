import { t, type Locale } from "@/lib/content";

export function NewWindow({ locale }: { locale: Locale }) {
  return <span className="sr-only">{t(locale).newTab}</span>;
}
