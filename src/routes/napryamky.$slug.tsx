import { createFileRoute, notFound } from "@tanstack/react-router";
import { DirectionNotFound, DirectionPage } from "@/components/direction-page";
import { directionBySlug } from "@/lib/directions";
import { directionHead } from "@/lib/seo";

export const Route = createFileRoute("/napryamky/$slug")({
  loader: ({ params }) => {
    const direction = directionBySlug(params.slug);
    if (!direction) throw notFound();
    return direction;
  },
  head: ({ params }) => {
    const direction = directionBySlug(params.slug);
    return direction ? directionHead("uk", direction) : directionHead("uk");
  },
  component: UkrainianDirection,
  notFoundComponent: () => <DirectionNotFound locale="uk" />,
});

function UkrainianDirection() {
  const direction = Route.useLoaderData();
  return <DirectionPage locale="uk" direction={direction} />;
}
