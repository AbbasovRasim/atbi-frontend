import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { incident, fileUpload } from "../services/api";

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
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let pdfFileName = null;

      // 1. PDF faylı yüklə (əgər varsa)
      if (pdfFile) {
        setUploading(true);
        pdfFileName = await fileUpload(pdfFile);
        setUploading(false);
      }

      // 2. Incident məlumatlarını yarat
      const incidentData = {
        ...formData,
        pdfFileName: pdfFileName,
      };

      await incident.create(incidentData);
      toast.success("Pozuntu uğurla yaradıldı!");
      navigate("/incidents");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("Fayl ölçüsü 10MB-dan böyük ola bilməz!");
        setPdfFile(null);
      } else {
        setPdfFile(file);
        toast.success(`"${file.name}" seçildi`);
      }
    } else if (file) {
      toast.error("Yalnız PDF faylı yükləyə bilərsiniz!");
      setPdfFile(null);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="card-header">Yeni pozuntu əlavə</div>
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
            <label>Əməkdaşın vəzifəsi *</label>
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
              <option value="Sonuncu xəbərdarlıqla şiddətli töhmət">
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

          {/* ✅ PDF UPLOAD FIELD */}
          <div className="form-group">
            <label>Əməkdaşın Anketi (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{
                padding: "0.5rem",
                border: "1px solid #4a4a5a",
                borderRadius: "12px",
                background: "#2a2a3a",
                color: "#f1f5f9",
                width: "100%",
              }}
            />
            {pdfFile && (
              <small
                style={{ color: "#a855f7", display: "block", marginTop: "5px" }}
              >
                ✓ {pdfFile.name} ({(pdfFile.size / 1024).toFixed(2)} KB)
              </small>
            )}
            <small
              style={{ color: "#64748b", display: "block", marginTop: "5px" }}
            >
              Yalnız PDF formatında, maksimum 10MB
            </small>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
              marginTop: "1.5rem",
            }}
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
              disabled={loading || uploading}
            >
              {uploading
                ? "PDF yüklənir..."
                : loading
                  ? "Yaradılır..."
                  : "Əlavə et"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateIncident;
