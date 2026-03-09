import { createFileRoute } from "@tanstack/react-router";

import BugsPage from "../../pages/wiki/BugsPage";

export const Route = createFileRoute("/archive/bugs")({
  component: Bugs,
});

function Bugs() {
  return <BugsPage />;
}
