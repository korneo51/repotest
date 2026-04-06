import { C } from "../../theme/colors.js";

export default function ModalShell({ onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div style={{ flex: 1, background: "rgba(0,0,0,0.6)" }} />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.surface,
          borderRadius: "20px 20px 0 0",
          padding: "6px 14px 20px",
          border: "1px solid " + C.border,
          borderBottom: "none",
          maxHeight: "82vh",
          overflowY: "auto",
          animation: "slideUp .25s ease",
          paddingBottom: "calc(20px + env(safe-area-inset-bottom,0px))",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 10px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: C.border }} />
        </div>
        {children}
      </div>
    </div>
  );
}
