import { createFileRoute } from "@tanstack/react-router";

import TradePage from "../pages/TradePage";

export const Route = createFileRoute("/trade")({
  component: Trade,
});

function Trade() {
  return <TradePage />;
}
