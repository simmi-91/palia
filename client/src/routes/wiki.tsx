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
      { label: "Bugs", href: "/wiki/bugs", icon: "bi-clipboard-heart" },
      { label: "Fish", href: "/wiki/fish", icon: "bi-clipboard-heart" },
      {
        label: "Artifacts",
        href: "/wiki/artifacts",
        icon: "bi-arrow-left-right",
      },
      {
        label: "Plushies",
        href: "/wiki/plushies",
        icon: "bi-arrow-left-right",
      },
      {
        label: "Potato Pods",
        href: "/wiki/potatopods",
        icon: "bi-arrow-left-right",
      },
      {
        label: "Stickers",
        href: "/wiki/stickers",
        icon: "bi-arrow-left-right",
      },
    ]);

    return () => clearSubmenuItems();
  }, [setSubmenuItems, clearSubmenuItems]);

  return (
    <div className="container-fluid py-1">
      <Outlet />
    </div>
  );
}
