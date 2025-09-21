import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/garden")({
  component: About,
});

function About() {
  return <div className="p-2">Hello from garden!</div>;
}
