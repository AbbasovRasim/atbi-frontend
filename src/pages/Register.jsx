import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../services/api";

function Register() {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ SADƏCƏ username və password göndər
      const registerData = {
        username: userData.username,
        password: userData.password,
      };

      await auth.register(registerData);
      toast.success("İstifadəçi uğurla yaradıldı!");
      navigate("/incidents");
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
      <div className="card" style={{ maxWidth: "500px", margin: "50px auto" }}>
        <div className="card-header">Yeni İstifadəçi Qeydiyyatı</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>İstifadəçi adı *</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
              placeholder="İstifadəçi adı daxil edin"
            />
          </div>

          <div className="form-group">
            <label>Şifrə *</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              placeholder="Şifrə daxil edin"
            />
          </div>

          <div className="form-group">
            <label>Tam Ad</label>
            <input
              type="text"
              name="fullName"
              value={userData.fullName}
              onChange={handleChange}
              placeholder="Tam ad daxil edin"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Email daxil edin"
            />
          </div>

          <div className="form-group">
            <label>Şöbə</label>
            <input
              type="text"
              name="department"
              value={userData.department}
              onChange={handleChange}
              placeholder="Şöbə daxil edin"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Yaradılır..." : "İstifadəçi Yarat"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/incidents" style={{ color: "#667eea" }}>
            Geri qayıt
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
