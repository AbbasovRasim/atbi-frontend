import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../services/api";

function Register() {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    fullname: "",
    email: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "ADMIN") {
      toast.error("Qeydiyyat yalnız administrator tərəfindən mümkündür");

      navigate("/login");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await auth.register(userData);

      toast.success("Registration successful! Please login.");

      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <div
        className="card"
        style={{
          maxWidth: "500px",
          margin: "50px auto",
        }}
      >
        <div className="card-header">Register</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username *</label>

            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>

            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              placeholder="Choose a password"
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="fullname"
              value={userData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Department</label>

            <input
              type="text"
              name="department"
              value={userData.department}
              onChange={handleChange}
              placeholder="Enter your department"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          <Link to="/login" style={{ color: "#667eea" }}>
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
