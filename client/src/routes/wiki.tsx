import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSubmenu } from "../context/SubmenuContext";

export const Route = createFileRoute("/wiki")({
  component: WikiLayout,
});

function WikiLayout() {
  const { setSubmenuItems, clearSubmenuItems } = useSubmenu();

  useEffect(() => {
    setSubmenuItems([
      { label: "Artifacts", href: "/wiki/artifacts" },
      { label: "Plushies", href: "/wiki/plushies" },
    ]);

    return () => clearSubmenuItems();
  }, [setSubmenuItems, clearSubmenuItems]);

  return (
    <div className="container-fluid py-1">
      <Outlet />
    </div>
  );
}
