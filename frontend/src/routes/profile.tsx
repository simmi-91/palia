import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: Profilepage,
});

function Profilepage() {
  return <div className=" card m-4 p-2">profile</div>;
}
