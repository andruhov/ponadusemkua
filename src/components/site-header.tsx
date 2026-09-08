import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { t, type Locale } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#about", key: "navAbout" },
  { href: "#work", key: "navWork" },
  { href: "#jars", key: "navJars" },
  { href: "#donate", key: "navDonate" },
] as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const c = t(locale);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-200",
        scrolled || open ? "border-b border-line bg-bg" : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="flex h-0.5">
        <span className="flex-1 bg-flag-blue" />
        <span className="flex-1 bg-flag-yellow" />
      </div>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link
          to={locale === "en" ? "/en" : "/"}
          className="flex min-w-0 items-center gap-3 text-fg no-underline"
        >
          <span className="flex size-8 shrink-0 flex-col overflow-hidden rounded-sm" aria-hidden="true">
            <span className="flex-1 bg-flag-blue" />
            <span className="flex-1 bg-flag-yellow" />
          </span>
          <span className="font-display truncate text-base font-semibold tracking-tight sm:text-lg">
            {c.short}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={c.short}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm text-muted transition-colors duration-150 hover:text-fg"
            >
              {c[l.key]}
            </a>
          ))}
          <LangSwitch locale={locale} />
          <Button asChild size="sm" className="ml-2">
            <a href="#donate">{c.heroCta}</a>
          </Button>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <LangSwitch locale={locale} />
          <button
            type="button"
            className="flex size-11 items-center justify-center text-fg"
            aria-expanded={open}
            aria-label={open ? c.close : c.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-bg lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-4" aria-label={c.menu}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="flex min-h-11 items-center text-base text-fg"
                onClick={() => setOpen(false)}
              >
                {c[l.key]}
              </a>
            ))}
            <Button asChild className="mt-3 w-full">
              <a href="#donate" onClick={() => setOpen(false)}>
                {c.heroCta}
              </a>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function LangSwitch({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <div className="flex items-center gap-1 rounded-md border border-line px-1 py-1 text-xs font-medium">
      {locale === "uk" ? (
        <span className="rounded-sm bg-surface-2 px-2 py-1 text-fg">{c.langUk}</span>
      ) : (
        <Link to="/" className="px-2 py-1 text-muted hover:text-fg">
          {c.langUk}
        </Link>
      )}
      {locale === "en" ? (
        <span className="rounded-sm bg-surface-2 px-2 py-1 text-fg">{c.langEn}</span>
      ) : (
        <Link to="/en" className="px-2 py-1 text-muted hover:text-fg">
          {c.langEn}
        </Link>
      )}
    </div>
  );
}
