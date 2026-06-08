import React, { useState, useEffect, useCallback } from "react";

const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const handleSWUpdate = () => {
      setShowUpdate(true);
    };

    window.addEventListener("sw-update-available", handleSWUpdate);

    return () => {
      window.removeEventListener("sw-update-available", handleSWUpdate);
    };
  }, []);

  const handleUpdate = useCallback(async () => {
    setUpdating(true);
    try {
      // Call the global update function set by main.jsx
      if (window.__updateSW) {
        await window.__updateSW(true);
      }

      // Clear all caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // Unregister all service workers
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((reg) => reg.unregister()));
      }

      // Force reload to get fresh content
      window.location.reload();
    } catch (error) {
      console.error("Update failed:", error);
      // Fallback: just reload
      window.location.reload();
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setShowUpdate(false);
  }, []);

  if (!showUpdate) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 999999,
        maxWidth: "380px",
        width: "calc(100% - 48px)",
        animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0e7e42 0%, #059669 100%)",
          borderRadius: "16px",
          padding: "20px",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1)",
          color: "#fff",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Refresh Icon */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
            </div>
            <div>
              <h4
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                Update Available
              </h4>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "13px",
                  opacity: 0.85,
                  lineHeight: 1.4,
                }}
              >
                A new version has been deployed
              </p>
            </div>
          </div>
          {/* Close button */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss update notification"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              borderRadius: "8px",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleUpdate}
          disabled={updating}
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: "10px",
            border: "none",
            background: "#fff",
            color: "#059669",
            fontSize: "14px",
            fontWeight: 600,
            cursor: updating ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s",
            opacity: updating ? 0.8 : 1,
          }}
          onMouseEnter={(e) => {
            if (!updating)
              e.currentTarget.style.background = "rgba(255,255,255,0.9)";
          }}
          onMouseLeave={(e) => {
            if (!updating) e.currentTarget.style.background = "#fff";
          }}
        >
          {updating ? (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Updating...
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Update Now
            </>
          )}
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UpdateNotification;
