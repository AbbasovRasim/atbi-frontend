import React, { useState, useEffect } from "react";
import { incident } from "../services/api";
import toast from "react-hot-toast";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    recentIncidents: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const data = await incident.getAll();
      const activeCount = data.filter(
        (inc) => inc.status === "ARAŞDIRILIR",
      ).length;
      const resolvedCount = data.filter(
        (inc) => inc.status === "BAĞLANIB",
      ).length;

      setStats({
        total: data.length,
        active: activeCount,
        resolved: resolvedCount,
        recentIncidents: data.slice(0, 5),
      });
    } catch (error) {
      toast.error("Failed to fetch incidents");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: "2rem", color: "white" }}>İdarə paneli</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Ümumi pozuntular</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.active}</div>
          <div className="stat-label">Aktiv pozuntular</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Bağlanmış pozuntular</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"></div>
        {stats.recentIncidents.length === 0 ? (
          <p>No incidents found</p>
        ) : (
          <div className="incident-table">
            <table>
              <thead>
                <tr>
                  <th>Ad soyad</th>
                  <th>İdarə</th>
                  <th>Pozuntu tipi</th>
                  <th>Status</th>
                  <th>Tarix</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentIncidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.fullName}</td>
                    <td>{incident.department}</td>
                    <td>{incident.incidentType}</td>
                    <td>
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
                    <td>{incident.incidentDate}</td>
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

export default Dashboard;
