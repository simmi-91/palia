import { createFileRoute } from "@tanstack/react-router";

import GardenPage from "../pages/GardenPage";

export const Route = createFileRoute("/garden")({
  component: Garden,
});

function Garden() {
  return <GardenPage />;
}
