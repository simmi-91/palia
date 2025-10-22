import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSubmenu } from "../context/SubmenuContext";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function Admin() {
  const { setSubmenuItems, clearSubmenuItems } = useSubmenu();
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.isAdmin) {
      setSubmenuItems([
        {
          label: "Edit items",
          href: "/admin/edit-items",
          icon: "",
        },
      ]);

      return () => clearSubmenuItems();
    }
  }, [profile, setSubmenuItems, clearSubmenuItems]);

  if (!profile) {
    return <div className="container">Not logged in as an admin user</div>;
  }

  if (profile.isAdmin) {
    return <Outlet />;
  }

  return <div className="container">No access</div>;
}
