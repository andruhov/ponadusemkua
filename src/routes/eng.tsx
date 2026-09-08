import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/eng")({
  component: () => <Navigate to="/en" />,
});
