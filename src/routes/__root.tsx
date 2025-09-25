import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RootLayout = () => (
  <>
    <Navbar />
    <main className="pb-5 mb-5">
      <Outlet />
    </main>
    <Footer />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
//<TanStackRouterDevtools />
