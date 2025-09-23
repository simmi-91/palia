import { createFileRoute } from "@tanstack/react-router";

import WormFarmPage from "../pages/WormFarmPage";

export const Route = createFileRoute("/wormfarm")({
  component: Wormfarm,
});

function Wormfarm() {
  return <WormFarmPage />;
}
