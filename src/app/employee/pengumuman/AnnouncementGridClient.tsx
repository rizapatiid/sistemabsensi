"use client"

import { useState, useMemo } from "react"
import styles from "@/styles/admin.module.css"

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
const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
)
const IconMegaphone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
)
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
)
const IconClose = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)

export default function AnnouncementGridClient({ announcements }: { announcements: Announcement[] }) {
  const [selected, setSelected] = useState<Announcement | null>(null)
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return announcements.filter(a => 
      a.judul.toLowerCase().includes(search.toLowerCase()) || 
      a.konten.toLowerCase().includes(search.toLowerCase())
    )
  }, [announcements, search])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. FILTER & SEARCH BAR */}
      <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '16px',
          background: 'white',
          padding: '16px 24px',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
          <div className={styles.searchBox} style={{ maxWidth: '400px' }}>
              <div className={styles.searchIcon}><IconSearch /></div>
              <input 
                  type="text" 
                  className={styles.searchInput} 
                  placeholder="Cari berita atau pengumuman..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              TOTAL BROADCAST: {filtered.length}
          </div>
      </div>

      {/* 2. MODERN GRID */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '24px' 
      }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 40px', background: 'white', borderRadius: '32px', border: '1px dashed #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.2 }}>📰</div>
            <p style={{ color: '#94a3b8', fontWeight: '800', fontSize: '1.1rem' }}>Data pengumuman tidak ditemukan.</p>
          </div>
        ) : (
          filtered.map((a) => (
            <article 
              key={a.id} 
              onClick={() => setSelected(a)}
              style={{
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)'
                e.currentTarget.style.borderColor = '#3b82f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
            >
              <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden', background: '#f8fafc' }}>
                {a.image ? (
                  <img src={a.image} alt={a.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    <span style={{ 
                        background: 'rgba(15, 23, 42, 0.8)', 
                        backdropFilter: 'blur(8px)',
                        color: 'white', 
                        padding: '4px 12px', 
                        borderRadius: '8px', 
                        fontSize: '0.65rem', 
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>Official Broadcast</span>
                </div>
              </div>
              
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', marginBottom: '12px' }}>
                  <IconCalendar />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                    {new Intl.DateTimeFormat("id-ID", { month: "long", day: "numeric", year: "numeric" }).format(new Date(a.tanggal))}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 12px', lineHeight: '1.3' }}>{a.judul}</h3>
                <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#64748b', 
                    fontWeight: 500, 
                    lineHeight: '1.6', 
                    margin: '0 0 24px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>{a.konten}</p>
                
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 900, 
                      color: '#3b82f6', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      letterSpacing: '0.02em'
                  }}>
                    BACA SELENGKAPNYA <IconArrowRight />
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* 3. PREMIUM DETAIL OVERLAY - PUBLICATION PREVIEW STYLE */}
      {selected && (
        <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(15, 23, 42, 0.4)', 
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            zIndex: 10000, padding: '20px' 
        }} onClick={() => setSelected(null)}>
          <div style={{ 
              background: 'white', 
              borderRadius: '28px', 
              maxWidth: '520px', 
              width: '100%', 
              height: 'auto',
              maxHeight: '85vh', 
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.2)',
              overflow: 'hidden'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* MODAL HEADER */}
            <div style={{ 
                padding: '24px 32px', 
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'white',
                zIndex: 20
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                        background: '#0f172a', 
                        color: 'white', 
                        height: '32px', 
                        width: '32px', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <IconMegaphone />
                    </div>
                    <div>
                        <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 900, 
                            color: '#0f172a', 
                            letterSpacing: '0.1em', 
                            textTransform: 'uppercase',
                            background: '#eff6ff',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            display: 'inline-block'
                        }}>OFFICIAL BROADCAST</span>
                    </div>
                </div>
                <button style={{ 
                    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
                    padding: '8px', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setSelected(null)}>
                    <IconClose />
                </button>
            </div>

            {/* MODAL SCROLLABLE CONTENT */}
            <div style={{ padding: '0', overflowY: 'auto', flex: 1 }}>
              {selected.image && (
                <div style={{ width: '100%', height: 'auto', maxHeight: '300px', overflow: 'hidden', borderBottom: '1px solid #f1f5f9' }}>
                  <img src={selected.image} alt={selected.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6' }}>
                        <IconCalendar />
                        <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                            {new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date(selected.tanggal))}
                        </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                        Estimasi Baca: {Math.ceil(selected.konten.split(' ').length / 200)} Menit
                    </div>
                </div>

                <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', marginBottom: '28px', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                    {selected.judul}
                </h2>

                <div style={{ 
                    fontSize: '1.1rem', 
                    color: '#334155', 
                    fontWeight: 500, 
                    lineHeight: '1.9', 
                    whiteSpace: 'pre-wrap',
                    paddingLeft: '20px',
                    borderLeft: '4px solid #eff6ff',
                    letterSpacing: '-0.011em'
                }}>
                  {selected.konten}
                </div>

                <div style={{ marginTop: '40px', padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ color: '#3b82f6', marginTop: '4px' }}>
                        <IconMegaphone />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600, lineHeight: '1.6' }}>
                        Informasi di atas merupakan komunikasi resmi dari manajemen RMP Digitals. Pastikan Anda telah memahami detail pengumuman ini untuk kelancaran operasional.
                    </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
