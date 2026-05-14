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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                style={{
                  background: "white",
                  borderRadius: "24px",
                  padding: "1.5rem",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    color: "#222",
                  }}
                >
                  👤 {incident.fullName}
                </h2>

                <div style={{ color: "#444", fontSize: "1rem" }}>
                  💼 {incident.position}
                </div>

                <div style={{ color: "#444", fontSize: "1rem" }}>
                  🏢 {incident.department}
                </div>

                <div style={{ color: "#444", fontSize: "1rem" }}>
                  ⚠️ {incident.incidentType}
                </div>

                <div style={{ color: "#444", fontSize: "1rem" }}>
                  🔨 {incident.punishment}
                </div>

                <div>
                  <span
                    className={`status-badge ${
                      incident.status === "Yekunlaşmamış"
                        ? "status-active"
                        : "status-resolved"
                    }`}
                  >
                    {incident.status}
                  </span>
                </div>

                <div style={{ color: "#666", fontSize: "0.95rem" }}>
                  📅 {incident.incidentDate}
                </div>

                <div style={{ color: "#666", fontSize: "0.95rem" }}>
                  👨‍💻 {incident.createdBy}
                </div>

                <button
                  onClick={() =>
                    handleUpdateStatus(incident.id, incident.status)
                  }
                  className="btn btn-secondary"
                  style={{
                    marginTop: "1rem",
                    borderRadius: "12px",
                    padding: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  Status dəyiş
                </button>
              </div>
            ))}
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
