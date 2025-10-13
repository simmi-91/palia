import { createFileRoute } from "@tanstack/react-router";

import FishPage from "../../pages/wiki/FishPage";

export const Route = createFileRoute("/wiki/fish")({
  component: Fish,
});

function Fish() {
  return <FishPage />;
}
