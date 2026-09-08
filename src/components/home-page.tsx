import { useEffect } from "react";
import { DonateSection, JarsSection } from "@/components/donate-section";
import { GallerySection } from "@/components/gallery-section";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { slideshowImages } from "@/lib/gallery";
import { t, type Locale } from "@/lib/content";

export function HomePage({ locale }: { locale: Locale }) {
  const c = t(locale);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "uk";
  }, [locale]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-cta focus:px-3 focus:py-2 focus:text-cta-fg"
      >
        {c.skip}
      </a>
      <SiteHeader locale={locale} />

      <section className="relative isolate h-dvh min-h-hero">
        <HeroSlideshow locale={locale} />
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pt-28 pb-32 sm:px-6 sm:pb-28">
          <p className="w-fit max-w-full self-start rounded-sm bg-bg/30 px-2.5 py-1 text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {c.kicker}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] font-semibold tracking-tight text-fg sm:text-6xl">
            {c.short}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg/85 sm:text-lg">{c.lede}</p>
          <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#donate">{c.heroCta}</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#work">{c.heroWork}</a>
            </Button>
          </div>
          {slideshowImages.length === 0 ? (
            <p className="mt-6 text-sm text-muted">{c.emptyGallery}</p>
          ) : null}
        </div>
      </section>

      <section id="about" className="scroll-mt-20 border-t border-line py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{c.navAbout}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {c.aboutTitle}
            </h2>
          </div>
          <div className="lg:col-span-8">
            <p className="text-lg leading-relaxed text-fg/90">{c.aboutP1}</p>
            <p className="mt-5 text-base leading-relaxed text-muted">{c.aboutP2}</p>
            <blockquote className="mt-10 border-l-2 border-accent pl-5 font-display text-2xl leading-snug text-fg">
              {c.quote}
            </blockquote>
          </div>
        </div>
      </section>

      <GallerySection locale={locale} />
      <JarsSection locale={locale} />
      <DonateSection locale={locale} />
      <SiteFooter locale={locale} />
    </div>
  );
}
