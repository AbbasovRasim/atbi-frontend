import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { incident } from "../services/api";

function CreateIncident() {
  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    department: "",
    incidentType: "",
    punishment: "",
    status: "Yekunlaşmamış",
    incidentDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await incident.create(formData);
      toast.success("Incident created successfully!");
      navigate("/incidents");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="card-header">Yeni pozuntu əlave </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad soyad *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Ad və soyadı daxil edin"
            />
          </div>

          <div className="form-group">
            <label> Əməkdaşın vəzifəsi *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              placeholder="Vəzifəni qeyd edin"
            />
          </div>

          <div className="form-group">
            <label>İdarə *</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="İdarəni daxil edin"
            />
          </div>

          <div className="form-group">
            <label>Baş vermiş pozuntunun növü *</label>
            <select
              name="incidentType"
              value={formData.incidentType}
              onChange={handleChange}
              required
            >
              <option value="">Pozuntunun növü</option>
              <option value="Postda Telefon istifadə etmək">
                Postda Telefon istifadə etmək
              </option>
              <option value="Baxışsız şəxs keçməsi">
                Baxışsız şəxs keçməsi
              </option>
              <option value="Postu öz başına tərk etmə">
                Postu öz başına tərk etmə
              </option>
              <option value="Postda yatmaq">Postda yatmaq</option>
              <option value="Digər">Digər</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cəza *</label>
            <select
              name="punishment"
              value={formData.punishment}
              onChange={handleChange}
              required
            >
              <option value="">Cəza növü</option>
              <option value="Yazılı xəbərdarlıq">Yazılı xəbərdarlıq</option>
              <option value="Şifahi xəbərdarlıq">Şifahi xəbərdarlıq</option>
              <option value="Töhmət">Töhmət</option>
              <option value="Şiddətli töhmət">Şiddətli töhmət</option>
              <option value=" Sonuncu xəbərdarlıqla şiddətli töhmət">
                Sonuncu xəbərdarlıqla şiddətli töhmət
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Yekunlaşmamış">Yekunlaşmamış</option>
              <option value="Yekunlaşmış">Yekunlaşmış</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tarix *</label>
            <input
              type="date"
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={() => navigate("/incidents")}
              className="btn btn-secondary"
            >
              Ləğv et
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Əlavə et"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateIncident;
