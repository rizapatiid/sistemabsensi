"use client"

import { useState } from "react"

export default function ImageModal({ src, alt }: { src: string, alt: string }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!src) return null

  return (
    <>
      <img 
        src={src} 
        alt={alt} 
        onClick={() => setIsOpen(true)}
        style={{ 
          width: "42px", 
          height: "42px", 
          borderRadius: "6px", 
          objectFit: "cover", 
          cursor: "pointer",
          border: "2px solid #ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          backgroundColor: "#f8fafc",
          display: "inline-block",
          verticalAlign: "middle",
          marginRight: "4px",
          transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.08)";
        }}
      />

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "24px",
            animation: "fadeIn 0.2s ease-out"
          }}
        >
          <div 
            style={{ 
              position: "relative", 
              maxWidth: "90%", 
              maxHeight: "90%",
              background: "#ffffff",
              padding: "16px",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
            }} 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "-16px",
                right: "-16px",
                background: "#3b82f6",
                border: "4px solid #ffffff",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                transition: "transform 0.2s ease, background 0.2s ease"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.background = "#2563eb";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "#3b82f6";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <img 
              src={src} 
              alt={alt} 
              style={{ 
                maxWidth: "100%", 
                maxHeight: "80vh", 
                borderRadius: "8px", 
                objectFit: "contain",
                display: "block"
              }} 
            />
            
            <div style={{ 
              textAlign: "center", 
              marginTop: "12px", 
              color: "#64748b", 
              fontSize: "0.85rem", 
              fontWeight: "700", 
              letterSpacing: "0.05em", 
              textTransform: "uppercase" 
            }}>
              Dokumentasi {alt}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
