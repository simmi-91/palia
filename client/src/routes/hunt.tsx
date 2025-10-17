import { createFileRoute } from "@tanstack/react-router";

import HuntPage from "../pages/HuntPage";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/hunt")({
  component: Hunt,
});

function Hunt() {
  const { profile } = useAuth();
  if (!profile) {
    return (
      <div className="text-center mt-5">
        Please log in to access the on the hunt page.
      </div>
    );
  }
  return <HuntPage profile={profile} />;
}
