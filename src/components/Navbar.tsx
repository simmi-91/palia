import { Link } from "@tanstack/react-router";
import { useState } from "react";
import Clock from "./Clock";

const Navbar = () => {
  const [bgColor, setBgColor] = useState("");
  const colorMap: Record<string, { bg: string; text?: string }> = {
    Dawn: { bg: "#d5b58f", text: "black" },
    Day: { bg: "#83b4e7", text: "black" },
    Dusk: { bg: "#dda4aa", text: "black" },
    Night: { bg: "#535c84", text: "white" },
  };

  return (
    <nav
      className="navbar navbar-expand-md sticky-top"
      style={{
        backgroundColor: colorMap[bgColor]?.bg,
      }}
    >
      <div className="container-fluid">
        <div
          className="navbar-brand d-inline-flex"
          style={{
            color: colorMap[bgColor]?.text,
          }}
        >
          <Clock setBgColor={setBgColor} />
          <h2 className="px-3 ">
            <Link
              to="/"
              className="text-decoration-none"
              style={{ color: "inherit" }}
            >
              Palia
            </Link>
          </h2>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse flex-grow-0"
          id="navbarNavDropdown"
        >
          <div className="d-flex flex-wrap">
            <Link
              to="/login"
              className="px-2 m-1  text-nowrap bg-light text-black text-decoration-none rounded-pill border border-dark border-1"
              activeProps={{ className: "text-white bg-dark fw-bold" }}
            >
              Login
            </Link>
            <Link
              to="/"
              className="px-2 m-1  text-nowrap bg-light text-black text-decoration-none rounded-pill border border-dark border-1"
              activeProps={{ className: "text-white bg-dark fw-bold" }}
            >
              Home
            </Link>
            <Link
              to="/garden"
              className="px-2 m-1  text-nowrap bg-light text-black text-decoration-none rounded-pill border border-dark border-1"
              activeProps={{ className: "text-white bg-dark fw-bold" }}
            >
              Garden
            </Link>
            <Link
              to="/wormfarm"
              className="px-2 m-1 text-nowrap bg-light text-black text-decoration-none rounded-pill border border-dark border-1"
              activeProps={{ className: "text-white bg-dark fw-bold" }}
            >
              Worm Farm
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
