import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <div>
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
      <Link to="/garden" className="[&.active]:font-bold">
        Garden
      </Link>
    </div>
    <hr />
    <div>
      <Outlet />
    </div>
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
