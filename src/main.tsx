import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// auth provider
import { AuthProvider } from "./context/AuthContext";

// Create a new router instance
const router = createRouter({
  routeTree,
  basepath: "/games/palia",
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

import "./main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <StrictMode>
          <RouterProvider router={router} />
        </StrictMode>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
