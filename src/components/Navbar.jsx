import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { auth } from "../services/api";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const handleLogout = () => {
    auth.logout();

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/dashboard" className="navbar-brand">
            Daxili Araşdırmalar və Kadr Təhlükəsizliyi şöbəsi
          </Link>

          <div className="navbar-links">
            <Link to="/dashboard" className="nav-link">
              İdarə paneli
            </Link>

            <Link to="/incidents" className="nav-link">
              Baş vermiş intizam pozuntuları
            </Link>

            <Link to="/create-incident" className="nav-link">
              Yeni pozuntu
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{
                padding: "0.5rem 1rem",
              }}
            >
              Çıxış
            </button>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "20px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "18px",
            fontWeight: "700",
          }}
        >
          {username}
        </div>
      </nav>

      <Outlet />
    </>
  );
}

export default Navbar;
