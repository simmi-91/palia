import { createFileRoute } from "@tanstack/react-router";

import StickersPage from "../../pages/wiki/StickersPage";

export const Route = createFileRoute("/wiki/stickers")({
  component: Stickers,
});

function Stickers() {
  return <StickersPage />;
}
