"use client";

import React, { useState, useEffect } from "react";

interface OfflineWrapperProps {
  children: React.ReactNode;
}

export function OfflineView({
  isChecking,
  handleRetry,
  showErrorToast,
}: {
  isChecking: boolean;
  handleRetry: () => void;
  showErrorToast: boolean;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .off-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 50%, #f8fafc 0%, #e2e8f0 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          overflow: hidden;
          padding: 24px;
          user-select: none;
        }

        /* Floating Background Glow Orbs */
        .off-glow-1 {
          position: absolute;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0) 70%);
          top: -50px;
          left: -50px;
          border-radius: 50%;
          z-index: 1;
          filter: blur(40px);
          animation: off-float-orb-1 20s infinite alternate ease-in-out;
        }

        .off-glow-2 {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%);
          bottom: -50px;
          right: -50px;
          border-radius: 50%;
          z-index: 1;
          filter: blur(40px);
          animation: off-float-orb-2 15s infinite alternate ease-in-out;
        }

        @keyframes off-float-orb-1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, 40px) scale(1.15); }
        }

        @keyframes off-float-orb-2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-50px, -60px) scale(0.9); }
        }

        /* Cardless Content Wrapper */
        .off-panel {
          width: 100%;
          max-width: 360px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
          animation: off-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes off-fade-in {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Illustration wrapper with background blob */
        .off-illus-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Organic CSS Blob matching web's blue/indigo theme */
        .off-blob {
          position: absolute;
          width: 165px;
          height: 165px;
          background: linear-gradient(135deg, #e0e7ff 0%, #eff6ff 100%); /* Premium gradient corporate blue blob */
          border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          animation: off-blob-wobble 8s ease-in-out infinite alternate;
        }

        @keyframes off-blob-wobble {
          0% { border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%; }
          100% { border-radius: 50% 50% 40% 60% / 45% 45% 55% 55%; }
        }

        /* Phone SVG Illustration */
        .off-svg-phone {
          width: 165px;
          height: 165px;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 6px 12px rgba(15, 23, 42, 0.04));
          animation: off-phone-float 4s ease-in-out infinite alternate;
        }

        @keyframes off-phone-float {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-4px) rotate(1.5deg); }
        }

        /* Wi-Fi and Red X animations */
        .off-wifi-wave-1 {
          animation: off-wifi-pulse 2s infinite ease-in-out;
        }
        .off-wifi-wave-2 {
          animation: off-wifi-pulse 2s infinite 0.3s ease-in-out;
        }
        .off-wifi-dot {
          animation: off-wifi-pulse 2s infinite 0.6s ease-in-out;
        }
        .off-svg-x {
          transform-origin: 98px 95px;
          animation: off-x-shake 3s infinite ease-in-out;
        }

        @keyframes off-wifi-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes off-x-shake {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.08) rotate(5deg); }
        }

        /* Typography matching Inter web font */
        .off-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .off-desc {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 24px;
          max-width: 320px;
        }



        /* Clean Login-like Submit Button (Matching Login Style) */
        .off-btn-retry {
          width: fit-content;
          min-width: 160px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .off-btn-retry:hover:not(:disabled) {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15),
                      0 0 0 3px rgba(15, 23, 42, 0.05);
        }

        .off-btn-retry:focus {
          outline: none;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }

        .off-btn-retry:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.1);
          outline: none;
        }

        .off-btn-retry:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background: #cbd5e1;
          box-shadow: none;
        }

        /* Spinner Micro-animation */
        .off-spinner {
          animation: off-spin 1s linear infinite;
          flex-shrink: 0;
        }

        @keyframes off-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Auto Reconnect Text */
        .off-auto-text {
          margin-top: 24px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #4f46e5; /* beautiful indigo */
          background-color: #f5f3ff;
          border: 1px solid #e0e7ff;
          border-radius: 9999px;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 1px 2px rgba(99, 102, 241, 0.02);
        }

        .off-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #4f46e5;
          animation: off-pulse-anim 1.8s infinite ease-in-out;
        }

        @keyframes off-pulse-anim {
          0% { transform: scale(0.9); opacity: 0.4; box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.6); }
          70% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 0 5px rgba(79, 70, 229, 0); }
          100% { transform: scale(0.9); opacity: 0.4; box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }

        /* Notification Toast for Failure */
        .off-toast {
          position: fixed;
          top: 24px;
          right: 24px;
          bottom: auto;
          left: auto;
          transform: translateY(-20px);
          opacity: 0;
          pointer-events: none;
          background: rgba(254, 242, 242, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(254, 202, 202, 0.8);
          color: #991b1b;
          padding: 12px 22px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 600;
          z-index: 100000;
          box-shadow: 0 10px 25px -5px rgba(220, 38, 38, 0.08),
                      0 0 0 1px rgba(220, 38, 38, 0.02);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          gap: 10px;
          width: max-content;
          max-width: calc(100vw - 48px);
        }

        .off-toast.show {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .off-toast svg {
          color: #ef4444;
          flex-shrink: 0;
        }

        /* Responsive placement for mobile devices */
        @media (max-width: 768px) {
          .off-toast {
            top: 16px;
            right: auto;
            bottom: auto;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
          }

          .off-toast.show {
            transform: translateX(-50%) translateY(0);
          }
        }
        `
      }} />

      <div className="off-container" id="offline-screen">
        <div className="off-glow-1" />
        <div className="off-glow-2" />
        <div className="off-panel">
          <div className="off-illus-container">
            {/* Soft corporate blue blob behind phone */}
            <div className="off-blob" />
            
            {/* Vector Illustration matching Dribbble reference */}
            <svg className="off-svg-phone" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Decorative sparkles/crosses (re-colored to corporate colors) */}
              {/* Soft purple plus (top left) */}
              <path d="M 46 64 H 54 M 50 60 V 68" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" />
              {/* Slate grey plus (top right) */}
              <path d="M 148 72 H 156 M 152 68 V 76" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              {/* Tiny decorative circles */}
              <circle cx="56" cy="100" r="2.5" fill="#cbd5e1" />
              <circle cx="140" cy="115" r="2" fill="#94a3b8" />

              {/* The Phone Container */}
              {/* Phone body shadow */}
              <rect x="67" y="42" width="66" height="116" rx="14" fill="rgba(30, 41, 59, 0.04)" />
              {/* Phone frame */}
              <rect x="65" y="40" width="66" height="116" rx="14" fill="#ffffff" stroke="#0f172a" strokeWidth="4.5" />
              {/* Phone screen */}
              <rect x="71" y="46" width="54" height="92" rx="8" fill="#f8fafc" />
              {/* Home button circle */}
              <circle cx="98" cy="147" r="4.5" fill="#0f172a" />
              {/* Speaker bar */}
              <line x1="91" y1="43" x2="105" y2="43" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

              {/* Wi-Fi Waves inside the phone screen */}
              <path className="off-wifi-wave-1" d="M 82 96 A 24 24 0 0 1 114 96" fill="none" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" />
              <path className="off-wifi-wave-2" d="M 88 106 A 14 14 0 0 1 108 106" fill="none" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" />
              <circle className="off-wifi-dot" cx="98" cy="115" r="5" fill="#cbd5e1" />

              {/* White mask circle around X */}
              <circle cx="98" cy="95" r="14" fill="#f8fafc" />

              {/* Red 'X' cross over the Wi-Fi icon */}
              {/* Masking gap behind X */}
              <g className="off-svg-x">
                <path d="M 88 85 L 108 105 M 108 85 L 88 105" stroke="#f8fafc" strokeWidth="11" strokeLinecap="round" />
                <path d="M 88 85 L 108 105 M 108 85 L 88 105" stroke="#ef4444" strokeWidth="5.5" strokeLinecap="round" />
              </g>
            </svg>
          </div>

          <h1 className="off-title" id="offline-title">Koneksi Terputus</h1>
          <p className="off-desc" id="offline-description">
            Perangkat Anda kehilangan koneksi internet. Silakan periksa jaringan Wi-Fi atau data seluler Anda.
          </p>

          <button
            className="off-btn-retry"
            id="btn-retry-connection"
            onClick={handleRetry}
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <svg className="off-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#ffffff"></path>
                </svg>
                Memeriksa...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </svg>
                Coba Lagi
              </>
            )}
          </button>

          <div className="off-auto-text" id="auto-reconnect-badge">
            <span className="off-pulse"></span>
            Menghubungkan kembali secara otomatis...
          </div>
        </div>
      </div>

      <div className={`off-toast ${showErrorToast ? "show" : ""}`} id="offline-toast">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        Masih offline. Periksa koneksi Anda.
      </div>
    </>
  );
}

export default function OfflineWrapper({ children }: OfflineWrapperProps) {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);

  useEffect(() => {
    // Check initial online status
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        setIsOffline(!navigator.onLine);
      }, 0);

      const handleOnline = () => {
        setIsOffline(false);
        setIsChecking(false);
      };

      const handleOffline = () => {
        setIsOffline(true);
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  const handleRetry = async () => {
    if (isChecking) return;
    setIsChecking(true);
    setShowErrorToast(false);

    // Bounded check duration
    const checkPromise = new Promise<boolean>((resolve) => {
      // Try to fetch a lightweight resource with a cache-bypassing timestamp
      fetch(`/?t=${Date.now()}`, { method: "HEAD", cache: "no-store" })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });

    // Timeout fallback after 3s
    const timeoutPromise = new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(false), 3000);
    });

    const isConnected = await Promise.race([checkPromise, timeoutPromise]);

    setIsChecking(false);
    if (isConnected) {
      setIsOffline(false);
    } else {
      setIsOffline(true);
      setShowErrorToast(true);
      // Auto-hide error notification after 3.5s
      setTimeout(() => setShowErrorToast(false), 3500);
    }
  };

  if (!isOffline) {
    return <>{children}</>;
  }

  return (
    <OfflineView
      isChecking={isChecking}
      handleRetry={handleRetry}
      showErrorToast={showErrorToast}
    />
  );
}
