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
      <Link to="/en/napryamky/$slug" params={{ slug }} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/napryamky/$slug" params={{ slug }} className={className}>
      {children}
    </Link>
  );
}
