import { createFileRoute } from "@tanstack/react-router";

import CatchPage from "../pages/CatchPage";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/catch")({
  component: Catch,
});

function Catch() {
  const { profile } = useAuth();
  if (!profile) {
    return (
      <div className="text-center mt-5">
        Please log in to access the on the catch page.
      </div>
    );
  }
  return <CatchPage profile={profile} />;
}
