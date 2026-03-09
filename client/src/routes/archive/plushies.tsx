import { createFileRoute } from "@tanstack/react-router";

import PlushiesPage from "../../pages/wiki/PlushiesPage";

export const Route = createFileRoute("/archive/plushies")({
  component: Plushies,
});

function Plushies() {
  return <PlushiesPage />;
}
