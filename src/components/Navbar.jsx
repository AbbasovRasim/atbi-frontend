import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../services/api";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();

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
            Daxili Araşdırmalar Xidməti
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
              style={{ padding: "0.5rem 1rem" }}
            >
              Çıxış
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
