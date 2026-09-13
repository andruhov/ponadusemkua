import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { t, type Locale } from "@/lib/content";
import { localeFromPath } from "@/lib/locale";
import { asset } from "@/lib/utils";

function localeNow(): Locale {
  if (typeof window === "undefined") return "uk";
  return localeFromPath(window.location.pathname);
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return fallback;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const c = t(localeNow());
  const home = localeNow() === "en" ? asset("/en") : asset("/");
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-accent" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-lg font-semibold">{c.errorTitle}</h1>
      <p className="max-w-md text-sm text-muted">{c.errorLead}</p>
      <p className="max-w-md text-sm break-words text-subtle">{errorMessage(error, c.errorLead)}</p>
      <a href={home} className="mt-4 text-sm text-fg underline decoration-line underline-offset-4 hover:text-accent">
        {c.short}
      </a>
    </main>
  );
}
