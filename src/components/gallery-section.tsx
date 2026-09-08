import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { captionFor, urlFor, workImages, type WorkFile } from "@/lib/gallery";
import { socials, t, type Locale } from "@/lib/content";
import { asset, cn } from "@/lib/utils";

export function GallerySection({ locale }: { locale: Locale }) {
  const c = t(locale);
  const images = workImages;
  const [open, setOpen] = useState<number | null>(null);

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
    <section id="work" className="scroll-mt-20 border-t border-line py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{c.navWork}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {c.workTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{c.workLead}</p>

        {images.length === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-line px-6 py-16 text-center text-muted">
            {c.emptyGallery}
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5 lg:grid-cols-3">
            {images.map((img, i) => {
              const caption = captionFor(img, locale);
              const url = urlFor(img, locale);
              return (
                <li key={img.src} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className="group relative block aspect-photo w-full overflow-hidden rounded-md bg-surface"
                  >
                    <img
                      src={asset(img.src)}
                      alt={caption}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </button>
                  {caption ? (
                    url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 flex min-h-11 items-start gap-2 text-left text-sm leading-snug text-fg hover:text-accent"
                      >
                        <span className="min-w-0 flex-1">{caption}</span>
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted" />
                      </a>
                    ) : (
                      <p className="mt-3 text-sm leading-snug text-muted">{caption}</p>
                    )
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-8">
          <a
            href={socials[0].href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-fg hover:text-accent"
          >
            {c.seeMore}
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>

      {open != null && images[open] ? (
        <Lightbox
          image={images[open]}
          locale={locale}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((open - 1 + images.length) % images.length)}
          onNext={() => setOpen((open + 1) % images.length)}
        />
      ) : null}
    </section>
  );
}

function Lightbox({
  image,
  locale,
  onClose,
  onPrev,
  onNext,
}: {
  image: WorkFile;
  locale: Locale;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const c = t(locale);
  const caption = captionFor(image, locale);
  const url = urlFor(image, locale);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption || c.workTitle}
      className="fixed inset-0 z-50 flex flex-col bg-bg"
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5">
        <div className="min-w-0">
          {caption && url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-fg hover:text-accent"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate">{caption}</span>
              <ArrowUpRight className="size-4 shrink-0" />
            </a>
          ) : (
            <p className="truncate text-sm text-muted">{caption}</p>
          )}
        </div>
        <button
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
        <img src={asset(image.src)} alt={caption} className="max-h-full max-w-full object-contain" />
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
