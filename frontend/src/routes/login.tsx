import { createFileRoute } from "@tanstack/react-router";
import GoogleAuth from "../components/GoogleAuth";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <div className=" card m-4 p-2">
      <GoogleAuth />
    </div>
  );
}
