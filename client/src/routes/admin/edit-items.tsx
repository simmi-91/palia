import { createFileRoute } from "@tanstack/react-router";
//import EditItemsPage from "../../pages/admin/EditItemsPage";

export const Route = createFileRoute("/admin/edit-items")({
  component: EditItems,
});

function EditItems() {
  return null; //<EditItemsPage />;
}
