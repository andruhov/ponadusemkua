import { ArrowUpRight, FileText } from "lucide-react";
import { useState } from "react";
import { CopyRow } from "@/components/copy-row";
import { Button } from "@/components/ui/button";
import {
  bankPdfs,
  cards,
  cryptoWallets,
  jars,
  monero,
  t,
  type Locale,
} from "@/lib/content";
import { cn, asset } from "@/lib/utils";

const tabs = ["cards", "bank", "crypto", "anon"] as const;
type Tab = (typeof tabs)[number];

export function JarsSection({ locale }: { locale: Locale }) {
  const c = t(locale);
  return (
    <section id="jars" className="scroll-mt-20 border-t border-line py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{c.navJars}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {c.jarsTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{c.jarsLead}</p>
        <ol className="mt-10 divide-y divide-line border-y border-line">
          {jars.map((jar, i) => (
            <li key={jar.id} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4 sm:gap-6">
                <span className="font-display text-2xl text-subtle tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium text-fg">{jar.title[locale]}</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">{jar.text[locale]}</p>
                </div>
              </div>
              <Button asChild variant="outline" className="shrink-0 self-start sm:self-center">
                <a href={jar.href} target="_blank" rel="noreferrer">
                  {c.openJar}
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function DonateSection({ locale }: { locale: Locale }) {
  const c = t(locale);
  const [tab, setTab] = useState<Tab>("cards");
  const labels: Record<Tab, string> = {
    cards: c.tabCards,
    bank: c.tabBank,
    crypto: c.tabCrypto,
    anon: c.tabAnon,
  };

  return (
    <section id="donate" className="scroll-mt-20 border-t border-line py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{c.navDonate}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {c.donateTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{c.donateLead}</p>

        <div className="mt-8 flex flex-wrap gap-1" role="tablist" aria-label={c.donateTitle}>
          {tabs.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "min-h-11 rounded-md px-4 text-sm",
                tab === id ? "bg-cta text-cta-fg" : "text-muted hover:text-fg",
              )}
            >
              {labels[id]}
            </button>
          ))}
        </div>

        <div className="mt-6" role="tabpanel">
          {tab === "cards" ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {cards.map((row) => (
                <CopyRow
                  key={row.value + row.label.uk}
                  locale={locale}
                  label={row.label[locale]}
                  value={row.value}
                />
              ))}
            </div>
          ) : null}

          {tab === "bank" ? (
            <div>
              <p className="mb-4 text-sm text-muted">{c.bankLead}</p>
              <div className="flex flex-wrap gap-2">
                {bankPdfs.map((pdf) => (
                  <Button key={pdf.code} asChild variant="outline">
                    <a href={asset(pdf.href)} target="_blank" rel="noreferrer">
                      <FileText className="size-4" />
                      {c.downloadPdf} {pdf.code}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "crypto" ? (
            <div>
              <p className="mb-4 text-sm text-muted">{c.cryptoLead}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {cryptoWallets.map((row) => (
                  <CopyRow
                    key={row.value}
                    locale={locale}
                    label={row.label[locale]}
                    value={row.value}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {tab === "anon" ? (
            <div>
              <p className="mb-4 text-sm text-muted">{c.anonLead}</p>
              <CopyRow locale={locale} label="Monero" value={monero} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
