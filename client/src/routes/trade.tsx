import { createFileRoute } from "@tanstack/react-router";

import TradePage from "../pages/TradePage";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/trade")({
  component: Trade,
});

function Trade() {
  const { profile, inventory } = useAuth();
  if (!profile) {
    return (
      <div className="text-center mt-5">
        Please log in to access the Trading Post.
      </div>
    );
  }
  return <TradePage profile={profile} inventory={inventory} />;
}
