import { createFileRoute } from "@tanstack/react-router";

import ArtifactsPage from "../../pages/wiki/ArtifactsPage";

export const Route = createFileRoute("/archive/artifacts")({
  component: Artifacts,
});

function Artifacts() {
  return <ArtifactsPage />;
}
