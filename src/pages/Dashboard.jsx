import React, { useState, useEffect } from "react";
import { incident } from "../services/api";
import toast from "react-hot-toast";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const data = (await incident.getAll()) || [];

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
          <div className="stat-label">Yekunlaşmamış pozuntular</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Yekunlaşmış pozuntular</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
