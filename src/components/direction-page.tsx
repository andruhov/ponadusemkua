import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { DirectionLink } from "@/components/direction-link";
import { NewWindow } from "@/components/new-window";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { t, type Locale } from "@/lib/content";
import { directions, type Direction } from "@/lib/directions";
import { homePath } from "@/lib/paths";
import { cn, mediaAsset } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function DirectionPage({ locale, direction }: { locale: Locale; direction: Direction }) {
  const c = t(locale);
  const home = homePath(locale);
  const others = directions.filter((d) => d.slug !== direction.slug);
  const [open, setOpen] = useState<number | null>(null);
  const images = direction.images;

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i == null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft")
        setOpen((i) => (i == null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, images.length]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a
        href="#direction"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-cta focus:px-3 focus:py-2 focus:text-cta-fg"
      >
        {c.skip}
      </a>
      <SiteHeader locale={locale} />

      <main id="direction" className="scroll-mt-20 pt-20 sm:pt-24">
        <article className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
          <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{c.navWork}</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            {direction.title[locale]}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg/90">{direction.lead[locale]}</p>

          {images[0] ? (
            <button
              type="button"
              onClick={() => setOpen(0)}
              aria-label={`${c.openPhoto}: ${direction.title[locale]}`}
              className="group relative mt-10 block aspect-photo w-full overflow-hidden rounded-md bg-surface sm:aspect-[16/9]"
            >
              <img
                src={mediaAsset(images[0])}
                alt={direction.title[locale]}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ) : null}

          <div className="mt-10 max-w-2xl space-y-5">
            {direction.body.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-muted">
                {p[locale]}
              </p>
            ))}
          </div>

          <div className="mt-10">
            <Button asChild size="lg">
              <a href={direction.href} target="_blank" rel="noreferrer">
                {c.supportDirection}
                <ArrowUpRight className="size-4" />
                <NewWindow locale={locale} />
              </a>
            </Button>
          </div>

          {images.length > 1 ? (
            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {images.slice(1).map((src, i) => {
                const index = i + 1;
                return (
                  <li key={src}>
                    <button
                      type="button"
                      onClick={() => setOpen(index)}
                      aria-label={c.openPhoto}
                      className="group relative block aspect-photo w-full overflow-hidden rounded-md bg-surface"
                    >
                      <img
                        src={mediaAsset(src)}
                        alt=""
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <div className="mt-12">
            <Link
              to={home}
              hash="work"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-fg hover:text-accent"
            >
              <ArrowLeft className="size-4" />
              {c.backToWork}
            </Link>
          </div>
        </article>

        {others.length > 0 ? (
          <section className="border-t border-line py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {c.otherDirections}
              </h2>
              <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((d) => {
                  const cover = d.images[0];
                  return (
                    <li key={d.slug}>
                      <DirectionLink
                        locale={locale}
                        slug={d.slug}
                        className="group flex h-full flex-col text-fg no-underline"
                      >
                        <span className="relative block aspect-photo w-full overflow-hidden rounded-md bg-surface">
                          {cover ? (
                            <img
                              src={mediaAsset(cover)}
                              alt=""
                              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : null}
                        </span>
                        <h3 className="mt-3 font-display text-xl font-medium tracking-tight group-hover:text-accent">
                          {d.title[locale]}
                        </h3>
                        <span className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium">
                          {c.readMore}
                          <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                        </span>
                      </DirectionLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter locale={locale} />

      {open != null && images[open] ? (
        <Lightbox
          src={images[open]}
          alt={direction.title[locale]}
          locale={locale}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((open - 1 + images.length) % images.length)}
          onNext={() => setOpen((open + 1) % images.length)}
        />
      ) : null}
    </div>
  );
}

export function DirectionNotFound({ locale }: { locale: Locale }) {
  const c = t(locale);
  const home = homePath(locale);
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <SiteHeader locale={locale} />
      <main className="mx-auto flex max-w-6xl flex-col px-4 pt-28 pb-16 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{c.directionNotFound}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{c.directionNotFoundLead}</p>
        <Link
          to={home}
          hash="work"
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-fg hover:text-accent"
        >
          <ArrowLeft className="size-4" />
          {c.backToWork}
        </Link>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

function Lightbox({
  src,
  alt,
  locale,
  onClose,
  onPrev,
  onNext,
}: {
  src: string;
  alt: string;
  locale: Locale;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const c = t(locale);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const node = dialogRef.current;
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus();
    };
  }, []);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex flex-col bg-bg"
      onClick={onClose}
    >
      <div className="flex items-center justify-end px-3 py-3 sm:px-5">
        <button
          ref={closeRef}
          type="button"
          aria-label={c.closePhoto}
          className="flex size-11 shrink-0 items-center justify-center text-fg"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
      </div>
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-8 sm:px-12"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={mediaAsset(src)} alt={alt} className="max-h-full max-w-full object-contain" />
        <button
          type="button"
          aria-label={c.prev}
          className={cn(
            "absolute top-1/2 left-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-md border border-line bg-surface text-fg sm:left-2",
          )}
          onClick={onPrev}
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label={c.next}
          className="absolute top-1/2 right-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-md border border-line bg-surface text-fg sm:right-2"
          onClick={onNext}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
