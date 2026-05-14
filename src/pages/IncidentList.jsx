import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { incident } from "../services/api";

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const data = (await incident.getAll()) || [];
      setIncidents(data);
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

      setIncidents((prevIncidents) =>
        prevIncidents.map((item) =>
          item.id === id
            ? {
                ...item,
                status: newStatus,
              }
            : item,
        ),
      );

      toast.success("Status dəyişdirildi");
    } catch (error) {
      toast.error("Status dəyişdirilə bilmədi");
    }
  };

  const filteredIncidents = incidents.filter((incident) => {
    return incident.fullName.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "3rem",
            fontWeight: "700",
          }}
        >
          Xidməti pozuntular
        </h1>

        <input
          type="text"
          placeholder="Əməkdaş axtar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.9rem 1.2rem",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "white",
            color: "#222",
            outline: "none",
            width: "260px",
            fontSize: "1rem",
            backdropFilter: "blur(8px)",
          }}
        />
      </div>

      <div
        className="card"
        style={{
          borderRadius: "24px",
          padding: "2rem",
        }}
      >
        {filteredIncidents.length === 0 ? (
          <p>Pozuntu tapılmadı</p>
        ) : (
          <div className="incident-table">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>Ad soyad</th>
                  <th style={thStyle}>Vəzifə</th>
                  <th style={thStyle}>İdarə</th>
                  <th style={thStyle}>Pozuntu tipi</th>
                  <th style={thStyle}>Cəza növü</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Əlavə edən</th>
                  <th style={thStyle}>Tarix</th>
                  <th style={thStyle}>Əməliyyat</th>
                </tr>
              </thead>

              <tbody>
                {filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <td style={tdStyle}>{incident.fullName}</td>

                    <td style={tdStyle}>{incident.position}</td>

                    <td style={tdStyle}>{incident.department}</td>

                    <td style={tdStyle}>{incident.incidentType}</td>

                    <td style={tdStyle}>{incident.punishment}</td>

                    <td style={tdStyle}>
                      <span
                        className={`status-badge ${
                          incident.status === "ARAŞDIRILIR"
                            ? "status-active"
                            : "status-resolved"
                        }`}
                      >
                        {incident.status}
                      </span>
                    </td>

                    <td style={tdStyle}>{incident.createdBy}</td>

                    <td style={tdStyle}>{incident.incidentDate}</td>

                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          handleUpdateStatus(incident.id, incident.status)
                        }
                        className="btn btn-secondary"
                        style={{
                          borderRadius: "10px",
                          padding: "0.45rem 0.9rem",
                          fontSize: "0.85rem",
                          fontWeight: "600",
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
        )}
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "1rem",
  color: "#2b2b2b",
  fontSize: "1rem",
  fontWeight: "700",
};

const tdStyle = {
  padding: "1rem",
  fontSize: "1rem",
  color: "#222",
  verticalAlign: "middle",
};

export default IncidentList;
