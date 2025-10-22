import { createFileRoute } from "@tanstack/react-router";

import RanchingPage from "../pages/RanchingPage";

export const Route = createFileRoute("/ranching")({
  component: Ranching,
});

function Ranching() {
  return <RanchingPage />;
}
