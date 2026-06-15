"use client"

import { useState } from "react"

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button 
      onClick={(e) => { e.preventDefault(); handleCopy(); }}
      style={{
        background: 'rgba(241, 245, 249, 0.8)', 
        border: 'none', 
        borderRadius: '6px',
        cursor: 'pointer', 
        padding: '6px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: copied ? '#10b981' : '#64748b', 
        transition: 'all 0.2s', 
        marginLeft: 'auto'
      }}
      title={copied ? "Tersalin!" : "Salin"}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      )}
    </button>
  )
}
