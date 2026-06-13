"use client"

import { useState, useMemo } from "react"
import styles from "@/styles/admin.module.css"
import AnnouncementList from "@/components/AnnouncementList"

interface Announcement {
  id: string;
  judul: string;
  konten: string;
  image: string | null;
  tanggal: string | Date;
}

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
)

export default function AnnouncementGridClient({ announcements }: { announcements: Announcement[] }) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return announcements.filter(a => 
      a.judul.toLowerCase().includes(search.toLowerCase()) || 
      a.konten.toLowerCase().includes(search.toLowerCase())
    )
  }, [announcements, search])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      {/* 1. PREMIUM FILTER & SEARCH BAR */}
      <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          gap: '16px',
          background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.01)'
      }}>
          <div className={styles.searchBox} style={{ width: '100%', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', pointerEvents: 'none' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                  type="text" 
                  className={styles.searchInput} 
                  placeholder="Cari informasi, berita, atau pedoman..." 
                  style={{ 
                      width: '100%',
                      padding: '14px 20px 14px 48px',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Total Broadcast
              </span>
              <span style={{ 
                  background: '#eff6ff', 
                  color: '#2563eb', 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem', 
                  fontWeight: 900,
                  border: '1px solid #dbeafe'
              }}>
                  {filtered.length}
              </span>
          </div>
      </div>

      {/* 2. MODERN GRID / LIST */}
      <div>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 40px', background: 'white', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.2 }}>📰</div>
            <p style={{ color: '#94a3b8', fontWeight: '800', fontSize: '1.1rem' }}>Data pengumuman tidak ditemukan.</p>
          </div>
        ) : (
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: 'clamp(16px, 4vw, 24px)', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
          }}>
            <AnnouncementList announcements={filtered as any} />
          </div>
        )}
      </div>
    </div>
  )
}
