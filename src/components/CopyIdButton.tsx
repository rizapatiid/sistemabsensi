"use client"

import { useState } from "react"

// Clean Copy Icon
const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#166534' }}><polyline points="20 6 9 17 4 12"/></svg>
)

export default function CopyIdButton({ id, title = "Salin ID" }: { id: string, title?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Gagal menyalin", err)
    }
  }

  return (
    <button 
      onClick={handleCopy}
      title={title}
      type="button"
      style={{
        background: copied ? '#dcfce7' : '#f1f5f9',
        border: '1px solid',
        borderColor: copied ? '#dcfce7' : '#e2e8f0',
        padding: '6px 10px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        marginLeft: '4px'
      }}
    >
      {copied ? <IconCheck /> : <IconCopy />}
      <span style={{ 
        marginLeft: '6px', 
        fontSize: '0.65rem', 
        fontWeight: '800', 
        color: copied ? '#166534' : '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.025em'
      }}>
        {copied ? 'BERHASIL' : 'SALIN'}
      </span>
    </button>
  )
}
