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

            <button onClick={handleLogout} className="btn btn-secondary">
              Çıxış
            </button>
          </div>
        </div>

        {/* ✅ AŞAĞIDA SOLDA USERNAME */}
        <div className="navbar-footer">
          <span className="user-name-bottom">{username}</span>
        </div>
      </nav>

      <Outlet />
    </>
  );
}

export default Navbar;
