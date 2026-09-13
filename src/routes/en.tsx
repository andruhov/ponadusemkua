import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { localeHead } from "@/lib/seo";

export const Route = createFileRoute("/en")({
  head: () => localeHead("en"),
  component: English,
});

function English() {
  return <HomePage locale="en" />;
}
