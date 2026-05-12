import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { incident } from "../services/api";

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const data = await incident.getAll();
      setIncidents(data);
    } catch (error) {
      toast.error("Failed to fetch incidents");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "ARAŞDIRILIR" ? "BAĞLANIB" : "ARAŞDIRILIR";
    try {
      await incident.updateStatus(id, newStatus);
      toast.success("Status updated successfully");
      fetchIncidents();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      try {
        await incident.softDelete(id);
        toast.success("Incident deleted successfully");
        fetchIncidents();
      } catch (error) {
        toast.error("Failed to delete incident");
      }
    }
  };

  const filteredIncidents = incidents.filter((incident) => {
    if (filter === "all") return true;
    return incident.status === filter;
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
        }}
      >
        <h1 style={{ color: "white" }}>Incidents</h1>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="all">All</option>
            <option value="ARAŞDIRILIR">Active</option>
            <option value="BAĞLANIB">Resolved</option>
          </select>
        </div>
      </div>

      <div className="card">
        {filteredIncidents.length === 0 ? (
          <p>No incidents found</p>
        ) : (
          <div className="incident-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ad soyad</th>
                  <th>Vəzifə</th>
                  <th>idarə</th>
                  <th>Pozuntu tipi</th>
                  <th>Cəza növü</th>
                  <th>Status</th>
                  <th>Tarix</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>{incident.id}</td>
                    <td>{incident.fullName}</td>
                    <td>{incident.position}</td>
                    <td>{incident.department}</td>
                    <td>{incident.incidentType}</td>
                    <td>{incident.punishment}</td>
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
                    <td>
                      {/* Status buttonu - HƏR KƏS GÖRÜR */}
                      <button
                        onClick={() =>
                          handleUpdateStatus(incident.id, incident.status)
                        }
                        className="btn btn-secondary"
                        style={{
                          marginRight: "0.5rem",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.875rem",
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

export default IncidentList;
