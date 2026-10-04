import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DirectionLink } from "@/components/direction-link";
import { NewWindow } from "@/components/new-window";
import { directions } from "@/lib/directions";
import { telegramHref, t, type Locale } from "@/lib/content";
import { mediaAsset } from "@/lib/utils";

export function DirectionsSection({ locale }: { locale: Locale }) {
  const c = t(locale);

  return (
    <section id="work" className="scroll-mt-20 border-t border-line py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{c.navWork}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {c.workTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{c.workLead}</p>

        {directions.length === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-line px-6 py-16 text-center text-muted">
            {c.emptyGallery}
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5 lg:grid-cols-3">
            {directions.map((d) => {
              const cover = d.images[0];
              const title = d.title[locale];
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
                      {title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{d.lead[locale]}</p>
                    <span className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium">
                      {c.readMore}
                      <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </span>
                  </DirectionLink>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-8">
          <a
            href={telegramHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-fg hover:text-accent"
          >
            {c.seeMore}
            <ArrowUpRight className="size-4" />
            <NewWindow locale={locale} />
          </a>
        </div>
      </div>
    </section>
  );
}
