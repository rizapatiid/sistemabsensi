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
          width: "36px", 
          height: "36px", 
          borderRadius: "6px", 
          objectFit: "cover", 
          cursor: "pointer",
          border: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
          display: "inline-block",
          verticalAlign: "middle",
          marginRight: "4px"
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
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "24px"
          }}
        >
          <div style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }} onClick={e => e.stopPropagation()}>
            <img 
              src={src} 
              alt={alt} 
              style={{ 
                maxWidth: "100%", 
                maxHeight: "85vh", 
                borderRadius: "8px", 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255,255,255,0.2)"
              }} 
            />
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "-24px",
                right: "-24px",
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: "#1e293b"
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}
