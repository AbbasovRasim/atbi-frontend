import React, { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { incident } from "../services/api";

// Status tipləri
const STATUS_TYPES = {
  PENDING: "Yekunlaşmamış",
  RESOLVED: "Yekunlaşmış",
};

// Style obyektləri
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
        padding: "0.5rem 1rem",
        borderRadius: "30px",
        fontSize: "0.9rem",
        fontWeight: "600",
        backgroundColor: isPending ? "#fff3cd" : "#d1e7dd",
        color: isPending ? "#856404" : "#0f5132",
      }}
    >
      {status}
    </span>
  );
};

// Action button componenti
const ActionButton = ({ onClick, disabled, currentStatus }) => {
  const isResolved = currentStatus === STATUS_TYPES.RESOLVED;
  const buttonText = isResolved ? "Aç" : "Yekunlaşdır";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: "10px",
        padding: "0.7rem 1rem",
        fontSize: "0.9rem",
        fontWeight: "600",
        border: "none",
        backgroundColor: isResolved ? "#dc3545" : "#28a745",
        color: "white",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        minWidth: "110px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = isResolved
            ? "#c82333"
            : "#218838";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = isResolved
            ? "#dc3545"
            : "#28a745";
        }
      }}
    >
      {buttonText}
    </button>
  );
};

// Pagination button componenti
const PaginationButton = ({ onClick, active, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: "0.5rem 1rem",
      margin: "0 0.25rem",
      borderRadius: "8px",
      border: "1px solid #dee2e6",
      backgroundColor: active ? "#667eea" : "white",
      color: active ? "white" : "#333",
      cursor: "pointer",
      fontWeight: active ? "600" : "400",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      if (!active) e.currentTarget.style.backgroundColor = "#f8f9fa";
    }}
    onMouseLeave={(e) => {
      if (!active) e.currentTarget.style.backgroundColor = "white";
    }}
  >
    {children}
  </button>
);

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // ========== PAGINATION STATE ==========
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // hər səhifədə 10 nəfər

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

  // Filter incidents (axtarış)
  const filteredIncidents = useMemo(() => {
    if (!search.trim()) return incidents;

    const searchLower = search.toLowerCase();
    return incidents.filter((item) =>
      item.fullName?.toLowerCase().includes(searchLower),
    );
  }, [incidents, search]);

  // ========== PAGINATION LOGIC ==========
  // Cari səhifədə göstəriləcək məlumatlar
  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredIncidents.slice(start, start + itemsPerPage);
  }, [filteredIncidents, currentPage]);

  // Ümumi səhifə sayı
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

  // Səhifə dəyişdikdə axtarış yenilənəndə 1-ci səhifəyə qayıt
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Səhifə dəyişmə funksiyası
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
              fontSize: "2rem",
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
          <>
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
                {paginatedIncidents.map((item) => (
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
                        currentStatus={item.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ========== PAGINATION UI ========== */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1.5rem",
                  borderTop: "1px solid #e9ecef",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Əvvəlki səhifə */}
                <PaginationButton
                  onClick={() => goToPage(currentPage - 1)}
                  active={false}
                >
                  « Əvvəl
                </PaginationButton>

                {/* Səhifə nömrələri */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Çox səhifə olduqda yalnız ətrafdakıları göstər
                    if (
                      totalPages > 7 &&
                      page > 3 &&
                      page < totalPages - 2 &&
                      page !== currentPage
                    ) {
                      if (page === 4 && currentPage < totalPages - 3) {
                        return (
                          <span key="ellipsis1" style={{ padding: "0 0.5rem" }}>
                            ...
                          </span>
                        );
                      }
                      if (page === totalPages - 3 && currentPage > 4) {
                        return (
                          <span key="ellipsis2" style={{ padding: "0 0.5rem" }}>
                            ...
                          </span>
                        );
                      }
                      if (page > 3 && page < totalPages - 2) return null;
                    }
                    return (
                      <PaginationButton
                        key={page}
                        onClick={() => goToPage(page)}
                        active={currentPage === page}
                      >
                        {page}
                      </PaginationButton>
                    );
                  },
                )}

                {/* Sonrakı səhifə */}
                <PaginationButton
                  onClick={() => goToPage(currentPage + 1)}
                  active={false}
                >
                  Sonra »
                </PaginationButton>
              </div>
            )}

            {/* Məlumat (neçə nəfər göstərilir) */}
            <div
              style={{
                padding: "0.75rem 1.5rem 1.5rem",
                textAlign: "center",
                fontSize: "0.8rem",
                color: "#6c757d",
                borderTop: "1px solid #e9ecef",
              }}
            >
              {`Göstərilir: ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
                currentPage * itemsPerPage,
                filteredIncidents.length,
              )} / Cəmi: ${filteredIncidents.length} qeyd`}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IncidentList;
