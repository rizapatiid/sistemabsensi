"use client"

import { useState, useEffect } from "react"
import styles from "@/styles/employee_home.module.css"

interface Announcement {
  id: string;
  judul: string;
  konten: string;
  image: string | null;
  tanggal: Date;
}

// Global Synced Icons
const IconMegaphone = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
)
const IconCalendar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
)
const IconClose = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)
const IconArrowRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
)

export default function AnnouncementClient({ announcements, autoOpenId }: { announcements: Announcement[], autoOpenId?: string }) {
  const [selected, setSelected] = useState<Announcement | null>(null)

  useEffect(() => {
    if (autoOpenId) {
      const found = announcements.find(a => a.id === autoOpenId)
      if (found) setSelected(found)
    }
  }, [autoOpenId, announcements])

  return (
    <>
      <div className={styles.announceWrapper}>
        {announcements.length === 0 ? (
          <div className={styles.card} style={{ textAlign: "center", color: "#94a3b8", padding: '40px' }}>
            Belum ada pengumuman terbaru saat ini.
          </div>
        ) : (
          announcements.map((a) => (
            <article 
              key={a.id} 
              className={styles.clickableAnnounce}
              onClick={() => setSelected(a)}
            >
              <div className={styles.announceThumb}>
                {a.image ? (
                  <img src={a.image} alt="" />
                ) : (
                  <div className={styles.thumbPlaceholder}>
                    <IconMegaphone />
                  </div>
                )}
              </div>
              <div className={styles.announceInfo}>
                <span className={styles.announceDateBadge}>
                  {new Intl.DateTimeFormat("id-ID", { month: "short", day: "numeric", year: "numeric" }).format(new Date(a.tanggal))}
                </span>
                <h3 className={styles.announceMiniTitle}>{a.judul}</h3>
                <p className={styles.announceExcerpt}>{a.konten.replace(/<[^>]*>/g, '')}</p>
                <div className={styles.readMoreHint}>
                    BACA SELENGKAPNYA <IconArrowRight />
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* GLOBAL OFFICIAL BROADCAST MODAL */}
      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
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
                    <div style={{ background: '#0f172a', color: 'white', height: '32px', width: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconMegaphone />
                    </div>
                    <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.1em', textTransform: 'uppercase', background: '#eff6ff', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>OFFICIAL BROADCAST</span>
                    </div>
                </div>
                <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '6px', cursor: 'pointer', color: '#94a3b8' }} onClick={() => setSelected(null)}>
                    <IconClose />
                </button>
            </div>

            <div style={{ padding: '0', overflowY: 'auto', flex: 1, maxHeight: '80vh' }}>
              {selected.image && (
                <div style={{ width: '100%', height: 'auto', maxHeight: '300px', overflow: 'hidden', borderBottom: '1px solid #f1f5f9' }}>
                  <img src={selected.image} alt={selected.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              
              <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6' }}>
                        <IconCalendar />
                        <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date(selected.tanggal))}</span>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.85rem', fontWeight: 1000, color: '#0f172a', marginBottom: '28px', lineHeight: '1.2' }}>{selected.judul}</h2>

                <div style={{ fontSize: '1.1rem', color: '#334155', fontWeight: 500, lineHeight: '1.9', whiteSpace: 'pre-wrap', paddingLeft: '24px', borderLeft: '4px solid #eff6ff' }}>
                  <div dangerouslySetInnerHTML={{ __html: selected.konten }} />
                </div>

                <div style={{ marginTop: '48px', padding: '24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ color: '#3b82f6', marginTop: '4px' }}>
                        <IconMegaphone />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#0f172a', fontWeight: 1000 }}>Validitas Publikasi</p>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 600, lineHeight: '1.6' }}>Dokumen ini diterbitkan secara otomatis melalui platform resmi RMP Digitals.</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
