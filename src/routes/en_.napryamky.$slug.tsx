import { createFileRoute, notFound } from "@tanstack/react-router";
import { DirectionNotFound, DirectionPage } from "@/components/direction-page";
import { directionBySlug } from "@/lib/directions";
import { directionHead } from "@/lib/seo";

export const Route = createFileRoute("/en_/napryamky/$slug")({
  loader: ({ params }) => {
    const direction = directionBySlug(params.slug);
    if (!direction) throw notFound();
    return direction;
  },
  head: ({ params }) => {
    const direction = directionBySlug(params.slug);
    return direction ? directionHead("en", direction) : directionHead("en");
  },
  component: EnglishDirection,
  notFoundComponent: () => <DirectionNotFound locale="en" />,
});

function EnglishDirection() {
  const direction = Route.useLoaderData();
  return <DirectionPage locale="en" direction={direction} />;
}
