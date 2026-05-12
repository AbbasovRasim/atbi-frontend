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
    status: "ARAŞDIRILIR",
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
        <div className="card-header">Create New Incident</div>
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
              <option value="Safety">Postda Telefon istifadə etmək</option>
              <option value="Security">Baxışsız şəxs keçməsi</option>
              <option value="Harassment">Postu öz başına tərk etmə</option>
              <option value="Policy Violation">Postda yatmaq</option>
              <option value="Other">Other</option>
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
              <option value="Warning">Yazılı xəbərdarlıq</option>
              <option value="Suspension">Şifahi xəbərdarlıq</option>
              <option value="Termination">Töhmət</option>
              <option value="Fine">Şiddətli töhmət</option>
              <option value="Training">
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
              <option value="ARAŞDIRILIR">Araşdırılır</option>
              <option value="BAĞLANIB">Araşdırma bitib</option>
            </select>
          </div>

          <div className="form-group">
            <label>Pozuntunun tarixi *</label>
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
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Incident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateIncident;
