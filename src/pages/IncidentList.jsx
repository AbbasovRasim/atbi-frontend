// Status dəyişmə buttonu - YENİ VERSİYA
const ActionButton = ({ onClick, disabled, currentStatus }) => {
  const isPending = currentStatus === STATUS_TYPES.PENDING;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: "12px",
        padding: "0.6rem 1.2rem",
        fontSize: "0.85rem",
        fontWeight: "600",
        minWidth: "120px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.25s ease",
        background: isPending
          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
          : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.15)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
        }
      }}
    >
      {disabled ? (
        <span>⏳ Dəyişir...</span>
      ) : (
        <span>{isPending ? "✓ Yekunlaşdır" : "↺ Yenidən aç"}</span>
      )}
    </button>
  );
};
