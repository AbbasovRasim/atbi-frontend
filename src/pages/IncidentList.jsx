import React, { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { incident } from "../services/api";
import { debounce } from "lodash";

const STATUS_TYPES = {
  PENDING: "Yekunlaşmamış",
  RESOLVED: "Yekunlaşmış",
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        padding: "1.5rem",
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#f8fafc",
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          backgroundColor: "white",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        ◀ Əvvəl
      </button>

      {getPageNumbers().map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === "number" && onPageChange(page)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: page === currentPage ? "none" : "1px solid #cbd5e1",
            backgroundColor: page === currentPage ? "#3b82f6" : "white",
            color: page === currentPage ? "white" : "#334155",
            fontWeight: page === currentPage ? "700" : "400",
            cursor: page === "..." ? "default" : "pointer",
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          backgroundColor: "white",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
      >
        Sonra ▶
      </button>
    </div>
  );
};

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(15); // Hər səhifədə 15 nəfər
  const [updatingId, setUpdatingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "fullName",
    direction: "asc",
  });

  // Debounced search
  const debouncedSetSearch = useCallback(
    debounce((value) => setSearch(value), 300),
    [],
  );

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      const data = (await incident.getAll()) || [];
      setIncidents(data);
    } catch (error) {
      toast.error("Pozuntular yüklənmədi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  // Filter
  const filteredIncidents = useMemo(() => {
    if (!search.trim()) return incidents;
    const searchLower = search.toLowerCase();
    return incidents.filter((item) =>
      item.fullName?.toLowerCase().includes(searchLower),
    );
  }, [incidents, search]);

  // Sort
  const sortedIncidents = useMemo(() => {
    return [...filteredIncidents].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredIncidents, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedIncidents.length / rowsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedIncidents.slice(start, end);
  }, [sortedIncidents, currentPage, rowsPerPage]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
      toast.success(`Status dəyişdirildi: ${newStatus}`);
    } catch (error) {
      toast.error("Status dəyişdirilə bilmədi");
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const stats = useMemo(
    () => ({
      total: incidents.length,
      pending: incidents.filter((i) => i.status === STATUS_TYPES.PENDING)
        .length,
      resolved: incidents.filter((i) => i.status === STATUS_TYPES.RESOLVED)
        .length,
      currentShowing: currentData.length,
    }),
    [incidents, currentData],
  );

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
      {/* Header */}
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
          <h1 style={{ color: "white", fontSize: "2rem", fontWeight: "700" }}>
            Xidməti pozuntular
          </h1>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem" }}>
            <span style={{ color: "#cbd5e1" }}>
              📊 Ümumi:{" "}
              <strong style={{ color: "white" }}>{stats.total}</strong>
            </span>
            <span style={{ color: "#fbbf24" }}>
              ⏳ Gözləyən: <strong>{stats.pending}</strong>
            </span>
            <span style={{ color: "#34d399" }}>
              ✅ Bitən: <strong>{stats.resolved}</strong>
            </span>
            <span style={{ color: "#60a5fa" }}>
              📄 Göstərilir: <strong>{stats.currentShowing}</strong>
            </span>
          </div>
        </div>

        <input
          type="text"
          placeholder="🔍 Əməkdaş axtar..."
          onChange={(e) => debouncedSetSearch(e.target.value)}
          style={{
            padding: "0.75rem 1.2rem",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "white",
            width: "280px",
            fontSize: "0.9rem",
            outline: "none",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          borderRadius: "20px",
          backgroundColor: "white",
          boxShadow: "0 20px 35px -10px rgba(0,0,0,0.15)",
          overflow: "auto",
          maxHeight: "65vh",
          position: "relative",
        }}
      >
        {currentData.length === 0 ? (
          <div
            style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}
          >
            {search
              ? "Axtarışa uyğun nəticə tapılmadı"
              : "Heç bir məlumat yoxdur"}
          </div>
        ) : (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1100px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={thStyleSticky}
                    onClick={() => handleSort("fullName")}
                    style={{ cursor: "pointer" }}
                  >
                    AD SOYAD{" "}
                    {sortConfig.key === "fullName" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    style={thStyle}
                    onClick={() => handleSort("position")}
                    style={{ cursor: "pointer" }}
                  >
                    VƏZİFƏ{" "}
                    {sortConfig.key === "position" &&
                      (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={thStyle}>İDARƏ</th>
                  <th style={thStyle}>POZUNTU TİPİ</th>
                  <th style={thStyle}>CƏZA NÖVÜ</th>
                  <th style={thStyle}>STATUS</th>
                  <th style={thStyle}>ƏLAVƏ EDƏN</th>
                  <th style={thStyle}>TARİX</th>
                  <th style={thStyle}>ƏMƏLİYYAT</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item) => (
                  <tr key={item.id}>
                    <td style={tdStyleSticky}>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Style obyektləri (əvvəlki kimi)
const thStyleSticky = {
  /* ... */
};
const tdStyleSticky = {
  /* ... */
};
const thStyle = {
  /* ... */
};
const tdStyle = {
  /* ... */
};
const StatusBadge = {
  /* ... */
};
const ActionButton = {
  /* ... */
};

export default IncidentList;
