import { socials, t, type Locale } from "@/lib/content";
import { SocialIcon } from "@/components/social-icon";

export function SiteFooter({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <footer className="border-t border-line py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{c.socialTitle}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">{c.socialTitle}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{c.socialLead}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {socials.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer me"
                className="flex h-11 items-center gap-2 rounded-md border border-line bg-surface px-3.5 text-sm text-fg transition-colors duration-150 hover:border-accent/40 hover:bg-surface-2"
              >
                <SocialIcon id={s.id} />
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-12 max-w-xl font-display text-xl leading-snug text-fg">{c.thanks}</p>
        <p className="mt-8 text-sm text-subtle">{c.org}</p>
      </div>
    </footer>
  );
}
