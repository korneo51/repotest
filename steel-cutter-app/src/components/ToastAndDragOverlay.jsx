import { PM } from "../data/profiles.js";
import { C } from "../theme/colors.js";
import ProfileIcon from "./ProfileIcon.jsx";

export default function ToastAndDragOverlay({ toast, isDragging, drag, dragPos, hasMovedRef }) {
  return (
    <>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 18px",
            borderRadius: 12,
            zIndex: 300,
            background: toast.type === "error" ? C.red : toast.type === "success" ? C.green : C.accent,
            color: "#000",
            fontWeight: 700,
            fontSize: 13,
            animation: "fadeIn .2s ease",
            maxWidth: "90vw",
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          }}
        >
          {toast.msg}
        </div>
      )}
      {isDragging && drag && hasMovedRef.current && (
        <div
          style={{
            position: "fixed",
            left: dragPos.x,
            top: dragPos.y - 50,
            transform: "translate(-50%,-50%)",
            zIndex: 250,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              padding: "8px 14px",
              borderRadius: 12,
              background: drag.orderColor + "dd",
              color: "#000",
              fontWeight: 700,
              fontSize: 14,
              fontFamily: "'Fira Code',monospace",
              boxShadow: "0 0 30px " + drag.orderColor + "66",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ProfileIcon cat={PM[drag.piece.profileId]?.cat} size={24} />
            {drag.piece.length}mm
          </div>
        </div>
      )}
    </>
  );
}
