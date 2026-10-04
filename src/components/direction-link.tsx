import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/content";

export function DirectionLink({
  locale,
  slug,
  className,
  children,
}: {
  locale: Locale;
  slug: string;
  className?: string;
  children: ReactNode;
}) {
  if (locale === "en") {
    return (
      <Link to="/en/aid/$slug" params={{ slug }} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/aid/$slug" params={{ slug }} className={className}>
      {children}
    </Link>
  );
}
