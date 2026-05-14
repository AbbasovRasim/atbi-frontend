import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { incident } from "../services/api";

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const data = await incident.getAll();
      setIncidents(data || []);
    } catch (error) {
      toast.error("Pozuntular yüklənmədi");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "Yekunlaşmamış" ? "Yekunlaşmış" : "Yekunlaşmamış";
    try {
      await incident.updateStatus(id, newStatus);
      setIncidents((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );
      toast.success("Status dəyişdirildi");
    } catch (error) {
      toast.error("Xəta baş verdi");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "50px" }}>Yüklənir...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ color: "white", marginBottom: "1rem" }}>
        Xidməti pozuntular
      </h1>

      {/* Axtarış inputu (isteğe bağlı) */}
      <input
        type="text"
        placeholder="Axtar..."
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "10px",
          border: "none",
          width: "250px",
          marginBottom: "1rem",
        }}
      />

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          overflow: "auto",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "900px",
          }}
        >
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "1rem", textAlign: "left" }}>Ad soyad</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Vəzifə</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>İdarə</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>
                Pozuntu tipi
              </th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Cəza növü</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Əlavə edən</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Tarix</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "1rem" }}>{item.fullName || "-"}</td>
                <td style={{ padding: "1rem" }}>{item.position || "-"}</td>
                <td style={{ padding: "1rem" }}>{item.department || "-"}</td>
                <td style={{ padding: "1rem" }}>{item.incidentType || "-"}</td>
                <td style={{ padding: "1rem" }}>{item.punishment || "-"}</td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      background:
                        item.status === "Yekunlaşmamış" ? "#fef3c7" : "#d1fae5",
                      color:
                        item.status === "Yekunlaşmamış" ? "#92400e" : "#065f46",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>{item.createdBy || "-"}</td>
                <td style={{ padding: "1rem" }}>{item.incidentDate || "-"}</td>
                <td style={{ padding: "1rem" }}>
                  <button
                    onClick={() => handleUpdateStatus(item.id, item.status)}
                    style={{
                      padding: "0.4rem 1rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      background: "white",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentList;
