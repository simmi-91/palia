import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSubmenu, type SubmenuItem } from "../context/SubmenuContext";
import { Link } from "@tanstack/react-router";

import UserIcon from "./UserIcon";
import Clock from "./Clock";
import { clockColorMap } from "../utils/clockPhases";

const Navbar = () => {
  const [bgColor, setBgColor] = useState("");

  const { submenuItems } = useSubmenu();
  const { profile } = useAuth();

  const menuBtnClasses =
    "px-1 mb-1 mx-1 text-nowrap bg-light text-black text-decoration-none rounded-pill border border-dark align-content-center";

  return (
    <div
      className="sticky-top"
      style={{
        backgroundColor: clockColorMap[bgColor]?.bg,
      }}
    >
      <nav className="navbar navbar-expand-md p-0 p-md-1">
        <div className="container-fluid">
          <div
            className="navbar-brand d-inline-flex flex-grow-1 p-0"
            style={{
              color: clockColorMap[bgColor]?.text,
            }}
          >
            <Clock setBgColor={setBgColor} />
            <h2 className="px-3 align-content-center">
              <Link
                to="/"
                className="text-decoration-none"
                style={{ color: "inherit" }}
              >
                Palia
              </Link>
            </h2>
          </div>

          <div className=" d-flex d-md-none mx-1">
            <UserIcon />
          </div>

          <button
            className="navbar-toggler ms-1"
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
                className={menuBtnClasses}
                activeProps={{ className: "text-white bg-dark fw-bold" }}
              >
                Home
              </Link>

              <Link
                to="/garden"
                className={menuBtnClasses}
                activeProps={{ className: "text-white bg-dark fw-bold" }}
              >
                Garden
              </Link>

              <Link
                to="/ranching"
                className={menuBtnClasses}
                activeProps={{ className: "text-white bg-dark fw-bold" }}
              >
                Ranching
              </Link>

              <Link
                to="/wormfarm"
                className={menuBtnClasses}
                activeProps={{ className: "text-white bg-dark fw-bold" }}
              >
                Worm Farm
              </Link>

              <Link
                to="/wiki"
                className={menuBtnClasses}
                activeProps={{ className: "text-white bg-dark fw-bold" }}
              >
                Items Wiki
              </Link>

              {profile && (
                <>
                  <Link
                    to="/catch"
                    className={menuBtnClasses}
                    activeProps={{ className: "text-white bg-dark fw-bold" }}
                  >
                    Go Catch
                  </Link>

                  <Link
                    to="/trade"
                    className={menuBtnClasses}
                    activeProps={{ className: "text-white bg-dark fw-bold" }}
                  >
                    Trade
                  </Link>
                </>
              )}
            </div>

            <div className=" d-none d-md-flex mx-1">
              <UserIcon />
            </div>
          </div>
        </div>
      </nav>

      {submenuItems.length > 0 && (
        <div className="border-top">
          <div className="container-fluid d-flex gap-1 py-1 overflow-x-auto  justify-content-md-center">
            {submenuItems.map((item: SubmenuItem) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-1 text-nowrap text-decoration-none rounded-pill border border-1 text-s"
                activeProps={{
                  className:
                    "px-1 text-nowrap text-decoration-none rounded-pill border border-1 text-s fw-bold",
                  style: {
                    color: clockColorMap[bgColor]?.text || "inherit",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                  },
                }}
                style={{
                  color: clockColorMap[bgColor]?.text || "inherit",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                {item.icon && <i className={`bi ${item.icon} pe-1`}></i>}
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
