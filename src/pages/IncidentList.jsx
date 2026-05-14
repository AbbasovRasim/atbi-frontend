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

  if (loading) return <div>Yüklənir...</div>;

  return (
    <div className="container">
      <h1 style={{ color: "white" }}>Xidməti pozuntular</h1>

      <div
        style={{ background: "white", borderRadius: "20px", overflow: "auto" }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "1rem" }}>Ad soyad</th>
              <th style={{ padding: "1rem" }}>Vəzifə</th>
              <th style={{ padding: "1rem" }}>İdarə</th>
              <th style={{ padding: "1rem" }}>Pozuntu tipi</th>
              <th style={{ padding: "1rem" }}>Cəza növü</th>
              <th style={{ padding: "1rem" }}>Status</th>
              <th style={{ padding: "1rem" }}>Əlavə edən</th>
              <th style={{ padding: "1rem" }}>Tarix</th>
              <th style={{ padding: "1rem" }}>Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: "1rem" }}>{item.fullName}</td>
                <td style={{ padding: "1rem" }}>{item.position}</td>
                <td style={{ padding: "1rem" }}>{item.department}</td>
                <td style={{ padding: "1rem" }}>{item.incidentType}</td>
                <td style={{ padding: "1rem" }}>{item.punishment}</td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      background:
                        item.status === "Yekunlaşmamış" ? "#fef3c7" : "#d1fae5",
                      padding: "0.2rem 0.8rem",
                      borderRadius: "20px",
                    }}
                  >
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>{item.createdBy}</td>
                <td style={{ padding: "1rem" }}>{item.incidentDate}</td>
                <td style={{ padding: "1rem" }}>
                  <button
                    onClick={() => handleUpdateStatus(item.id, item.status)}
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
