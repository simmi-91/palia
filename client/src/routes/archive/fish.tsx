import { createFileRoute } from "@tanstack/react-router";

import FishPage from "../../pages/wiki/FishPage";

export const Route = createFileRoute("/archive/fish")({
  component: Fish,
});

function Fish() {
  return <FishPage />;
}
