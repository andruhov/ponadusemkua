import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";
import { localeHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => localeHead("uk"),
  component: Home,
});

function Home() {
  return <HomePage locale="uk" />;
}
