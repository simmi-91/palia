import { createFileRoute } from "@tanstack/react-router";

import PotatoPodsPage from "../../pages/wiki/PotatoPodsPage";

export const Route = createFileRoute("/archive/potatopods")({
  component: PotatoPods,
});

function PotatoPods() {
  return <PotatoPodsPage />;
}
