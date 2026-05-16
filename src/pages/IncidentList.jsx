import React, { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { incident } from "../services/api";

const STATUS_TYPES = {
  PENDING: "Yekunlaşmamış",
  RESOLVED: "Yekunlaşmış",
};

const thStyle = {
  textAlign: "left",
  padding: "1rem",
  color: "#e2e8f0",
  fontSize: "0.85rem",
  fontWeight: "600",
  backgroundColor: "#252536",
  borderBottom: "1px solid #334155",
};

const tdStyle = {
  padding: "1rem",
  fontSize: "0.85rem",
  color: "#cbd5e1",
  verticalAlign: "middle",
  borderBottom: "1px solid #2a2a3a",
};

const StatusBadge = ({ status }) => {
  const isPending = status === STATUS_TYPES.PENDING;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.5rem 1rem",
        fontSize: "0.8rem",
        borderRadius: "30px",
        fontWeight: "600",
        backgroundColor: isPending
          ? "rgba(251, 191, 36, 0.15)"
          : "rgba(34, 197, 94, 0.15)",
        color: isPending ? "#fbbf24" : "#22c55e",
        border: `1px solid ${isPending ? "#fbbf24" : "#22c55e"}`,
      }}
    >
      {status}
    </span>
  );
};

const ActionButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      borderRadius: "8px",
      padding: "0.4rem 0.9rem",
      fontSize: "0.75rem",
      fontWeight: "500",
      border: "1px solid #4a4a5a",
      backgroundColor: "#2a2a3a",
      color: "#cbd5e1",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.backgroundColor = "#a855f7";
        e.currentTarget.style.color = "white";
        e.currentTarget.style.borderColor = "#a855f7";
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.backgroundColor = "#2a2a3a";
        e.currentTarget.style.color = "#cbd5e1";
        e.currentTarget.style.borderColor = "#4a4a5a";
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
      toast.success(`Status "${newStatus}" olaraq dəyişdirildi`);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Status dəyişdirilə bilmədi");
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const filteredIncidents = useMemo(() => {
    if (!search.trim()) return incidents;
    const searchLower = search.toLowerCase();
    return incidents.filter((item) =>
      item.fullName?.toLowerCase().includes(searchLower),
    );
  }, [incidents, search]);

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
        <div style={{ textAlign: "center", padding: "50px", color: "#94a3b8" }}>
          Yüklənir...
        </div>
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
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              color: "white",
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "0.5rem",
            }}
          >
            Xidməti pozuntular
          </h1>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem" }}>
            <span style={{ color: "#94a3b8" }}>Ümumi: {stats.total}</span>
            <span style={{ color: "#fbbf24" }}>Gözləyən: {stats.pending}</span>
            <span style={{ color: "#22c55e" }}>Bitən: {stats.resolved}</span>
          </div>
        </div>

        <input
          type="text"
          placeholder="Əməkdaş axtar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.7rem 1rem",
            borderRadius: "12px",
            border: "1px solid #334155",
            background: "#2a2a3a",
            color: "#f1f5f9",
            outline: "none",
            width: "260px",
            fontSize: "0.9rem",
          }}
        />
      </div>

      <div
        style={{
          borderRadius: "20px",
          padding: "0",
          backgroundColor: "#1e1e2e",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          overflowX: "auto",
        }}
      >
        {filteredIncidents.length === 0 ? (
          <div
            style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}
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
                <th style={thStyle}>Anket</th>
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
                    {item.pdfFileName ? (
                      <a
                        href={`https://atbi-backend.onrender.com/files/download/${item.pdfFileName}`}
                        download
                        style={{
                          background:
                            "linear-gradient(135deg, #a855f7, #7c3aed)",
                          border: "none",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        📄 Yüklə
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
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
