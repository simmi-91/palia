import { createFileRoute } from "@tanstack/react-router";

import ArtifactsPage from "../../pages/wiki/ArtifactsPage";

export const Route = createFileRoute("/wiki/artifacts")({
  component: Artifacts,
});

function Artifacts() {
  return <ArtifactsPage />;
}
