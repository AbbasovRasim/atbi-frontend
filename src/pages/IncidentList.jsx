import React, { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { incident } from "../services/api";

// Status tipləri
const STATUS_TYPES = {
  PENDING: "Yekunlaşmamış",
  RESOLVED: "Yekunlaşmış",
};

// Sabit style obyektləri (komponentdən kənarda)
const thStyle = {
  textAlign: "left",
  padding: "1rem",
  color: "#2b2b2b",
  fontSize: "1rem",
  fontWeight: "700",
  backgroundColor: "#f8f9fa",
  borderBottom: "2px solid #e9ecef",
};

const tdStyle = {
  padding: "1rem",
  fontSize: "1rem",
  color: "#222",
  verticalAlign: "middle",
  borderBottom: "1px solid #f0f0f0",
};

// Status badge componenti
const StatusBadge = ({ status }) => {
  const isPending = status === STATUS_TYPES.PENDING;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.25rem 0.75rem",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: "600",
        backgroundColor: isPending ? "#fff3cd" : "#d1e7dd",
        color: isPending ? "#856404" : "#0f5132",
      }}
    >
      {status}
    </span>
  );
};

// SUPER BÖYÜK VERSİYA
const ActionButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      borderRadius: "12px",
      padding: "0.85rem 1.8rem",
      fontSize: "1rem",
      fontWeight: "600",
      border: "none",
      backgroundColor: "#4361ee",
      color: "white",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: "all 0.2s ease",
      width: "145px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.backgroundColor = "#3a56d4";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(67,97,238,0.3)";
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.backgroundColor = "#4361ee";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
      }
    }}
  >
    Status dəyiş
  </button>
);

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch incidents
  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      const data = (await incident.getAll()) || [];
      setIncidents(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Pozuntular yüklənmədi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Update status
  const handleUpdateStatus = useCallback(async (id, currentStatus) => {
    const newStatus =
      currentStatus === STATUS_TYPES.PENDING
        ? STATUS_TYPES.RESOLVED
        : STATUS_TYPES.PENDING;

    setUpdatingId(id);

    try {
      await incident.updateStatus(id, newStatus);

      setIncidents((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );

      toast.success(`Status "${newStatus}" olaraq dəyişdirildi`, {
        duration: 2000,
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Status dəyişdirilə bilmədi");
    } finally {
      setUpdatingId(null);
    }
  }, []);

  // Filter incidents
  const filteredIncidents = useMemo(() => {
    if (!search.trim()) return incidents;

    const searchLower = search.toLowerCase();
    return incidents.filter((item) =>
      item.fullName?.toLowerCase().includes(searchLower),
    );
  }, [incidents, search]);

  // Stats
  const stats = useMemo(() => {
    const total = incidents.length;
    const pending = incidents.filter(
      (i) => i.status === STATUS_TYPES.PENDING,
    ).length;
    const resolved = incidents.filter(
      (i) => i.status === STATUS_TYPES.RESOLVED,
    ).length;
    return { total, pending, resolved };
  }, [incidents]);

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div style={{ fontSize: "1.2rem", color: "#6c757d" }}>
            Yüklənir...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header + Search + Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              color: "white",
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
            }}
          >
            Xidməti pozuntular
          </h1>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem" }}>
            <span style={{ color: "#adb5bd" }}>Ümumi: {stats.total}</span>
            <span style={{ color: "#ffc107" }}>Gözləyən: {stats.pending}</span>
            <span style={{ color: "#20c997" }}>Bitən: {stats.resolved}</span>
          </div>
        </div>

        <input
          type="text"
          placeholder="Əməkdaş axtar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "white",
            color: "#222",
            outline: "none",
            width: "260px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      {/* Table Card */}
      <div
        style={{
          borderRadius: "24px",
          padding: "0",
          backgroundColor: "white",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        {filteredIncidents.length === 0 ? (
          <div
            style={{ padding: "3rem", textAlign: "center", color: "#6c757d" }}
          >
            {search
              ? "Axtarışa uyğun pozuntu tapılmadı"
              : "Heç bir pozuntu yoxdur"}
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "900px",
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
              {filteredIncidents.map((item) => (
                <tr key={item.id}>
                  <td style={tdStyle}>
                    <strong>{item.fullName || "-"}</strong>
                  </td>
                  <td style={tdStyle}>{item.position || "-"}</td>
                  <td style={tdStyle}>{item.department || "-"}</td>
                  <td style={tdStyle}>{item.incidentType || "-"}</td>
                  <td style={tdStyle}>{item.punishment || "-"}</td>
                  <td style={tdStyle}>
                    <StatusBadge status={item.status} />
                  </td>
                  <td style={tdStyle}>{item.createdBy || "-"}</td>
                  <td style={tdStyle}>{item.incidentDate || "-"}</td>
                  <td style={tdStyle}>
                    <ActionButton
                      onClick={() => handleUpdateStatus(item.id, item.status)}
                      disabled={updatingId === item.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default IncidentList;
