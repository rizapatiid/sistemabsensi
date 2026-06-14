"use client"

import { useState, useEffect } from "react"

interface LiveServerTimeProps {
  initialTime: string
  initialDate: string
  initialDayName: string
}

export default function LiveServerTime({ initialTime, initialDate, initialDayName }: LiveServerTimeProps) {
  const [timeStr, setTimeStr] = useState(initialTime)
  const [dateStr, setDateStr] = useState(initialDate)
  const [dayName, setDayName] = useState(initialDayName)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      
      const timeFormatter = new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta"
      })
      
      const dateFormatter = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta"
      })

      const dayFormatter = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        timeZone: "Asia/Jakarta"
      })
      
      setTimeStr(timeFormatter.format(now) + " WIB")
      setDateStr(dateFormatter.format(now))
      setDayName(dayFormatter.format(now))
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <style jsx global>{`
        @keyframes clockPulse {
          0% { transform: scale(0.9); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 8px rgba(16, 185, 129, 0.6); }
          100% { transform: scale(0.9); opacity: 0.4; }
        }
        .live-pulse-dot {
          animation: clockPulse 2s infinite ease-in-out;
        }
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Waktu Server</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e3a8a', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {mounted && (
            <span 
              className="live-pulse-dot"
              style={{ 
                width: '6px', 
                height: '6px', 
                background: '#10b981', 
                borderRadius: '50%',
                display: 'inline-block'
              }}
            ></span>
          )}
          {timeStr}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Hari / Tanggal</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155' }}>{dayName}, {dateStr}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Status Uptime</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#059669' }}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          99.98% (Sangat Baik)
        </span>
      </div>
    </div>
  )
}
