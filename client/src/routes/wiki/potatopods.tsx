import { createFileRoute } from "@tanstack/react-router";

import PotatoPodsPage from "../../pages/wiki/PotatoPodsPage";

export const Route = createFileRoute("/wiki/potatopods")({
  component: PotatoPods,
});

function PotatoPods() {
  return <PotatoPodsPage />;
}
