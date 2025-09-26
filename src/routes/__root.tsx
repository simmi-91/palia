import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SubmenuProvider } from "../context/SubmenuContext";

const RootLayout = () => (
  <SubmenuProvider>
    <Navbar />
    <main className="pb-5 mb-5">
      <Outlet />
    </main>
    <Footer />
  </SubmenuProvider>
);

export const Route = createRootRoute({ component: RootLayout });
//<TanStackRouterDevtools />
