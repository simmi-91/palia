import { Link } from "@tanstack/react-router";
import { useState } from "react";
import Clock from "./Clock";
import UserIcon from "../features/user/UserIcon";
import { useSubmenu } from "../context/SubmenuContext";
import type { SubmenuItem } from "../context/SubmenuContext";

const Navbar = () => {
  const [bgColor, setBgColor] = useState("");
  const colorMap: Record<string, { bg: string; text?: string }> = {
    Dawn: { bg: "#d5b58f", text: "black" },
    Day: { bg: "#83b4e7", text: "black" },
    Dusk: { bg: "#dda4aa", text: "black" },
    Night: { bg: "#535c84", text: "white" },
  };

  const { submenuItems } = useSubmenu();

  return (
    <div
      className=" sticky-top"
      style={{
        backgroundColor: colorMap[bgColor]?.bg,
      }}
    >
      <nav className="navbar navbar-expand-md">
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

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <div className="col d-flex flex-wrap justify-content-center">
              <Link
                to="/"
                className="px-2 m-1 text-nowrap bg-light text-black text-decoration-none rounded-pill border border-dark border-1"
                activeProps={{ className: "text-white bg-dark fw-bold" }}
              >
                Home
              </Link>
              <Link
                to="/trade"
                className="px-2 m-1 text-nowrap bg-light text-black text-decoration-none rounded-pill border border-dark border-1"
                activeProps={{ className: "text-white bg-dark fw-bold" }}
              >
                Trade
              </Link>
              <Link
                to="/wiki"
                className="px-2 m-1 text-nowrap bg-light text-black text-decoration-none rounded-pill border border-dark border-1"
                activeProps={{ className: "text-white bg-dark fw-bold" }}
              >
                Items Wiki
              </Link>
              <Link
                to="/garden"
                className="px-2 m-1 text-nowrap bg-light text-black text-decoration-none rounded-pill border border-dark border-1"
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

            <div className="col-12 col-sm-2 d-flex justify-content-end">
              <UserIcon />
            </div>
          </div>
        </div>
      </nav>

      {submenuItems.length > 0 && (
        <div className="border-top">
          <div className="container-fluid d-flex gap-1 py-1 overflow-x-auto justify-content-center">
            {submenuItems.map((item: SubmenuItem) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-1 text-nowrap text-decoration-none rounded-pill border border-1 text-s"
                activeProps={{
                  className:
                    "px-1 text-nowrap text-decoration-none rounded-pill border border-1 text-s fw-bold",
                  style: {
                    color: colorMap[bgColor]?.text || "inherit",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                  },
                }}
                style={{
                  color: colorMap[bgColor]?.text || "inherit",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Navbar;
