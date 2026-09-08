import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";

export const Route = createFileRoute("/en")({ component: English });

function English() {
  return <HomePage locale="en" />;
}
