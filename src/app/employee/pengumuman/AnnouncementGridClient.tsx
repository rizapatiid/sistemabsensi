"use client"

import { useState } from "react"
import homeStyles from "@/styles/employee_home.module.css"

interface Announcement {
  id: string;
  judul: string;
  konten: string;
  image: string | null;
  tanggal: string | Date;
}

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
)

export default function AnnouncementGridClient({ announcements }: { announcements: Announcement[] }) {
  const [selected, setSelected] = useState<Announcement | null>(null)

  return (
    <>
      <div className={homeStyles.announceGrid}>
        {announcements.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 40px', background: 'white', borderRadius: '32px', border: '1px dashed #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.2 }}>📰</div>
            <p style={{ color: '#94a3b8', fontWeight: '700', fontSize: '1.1rem' }}>Belum ada pengumuman untuk ditampilkan.</p>
          </div>
        ) : (
          announcements.map((a) => (
            <article 
              key={a.id} 
              className={homeStyles.modernAnnounceCard}
              onClick={() => setSelected(a)}
            >
              <div className={homeStyles.modernAnnounceImg}>
                {a.image ? (
                  <img src={a.image} alt={a.judul} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#cbd5e1' }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
              </div>
              
              <div className={homeStyles.modernAnnounceBody}>
                <div className={homeStyles.modernAnnounceMeta}>
                  <span className={homeStyles.modernAnnounceTag}>Official</span>
                  <span className={homeStyles.modernAnnounceDate}>
                    {new Intl.DateTimeFormat("id-ID", { month: "long", day: "numeric", year: "numeric" }).format(new Date(a.tanggal))}
                  </span>
                </div>
                
                <h3 className={homeStyles.modernAnnounceTitle}>{a.judul}</h3>
                <p className={homeStyles.modernAnnounceText}>{a.konten}</p>
                
                <div className={homeStyles.modernAnnounceFooter}>
                  <span className={homeStyles.readButton}>
                    BACA SELENGKAPNYA <IconArrowRight />
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Premium Detail Modal */}
      {selected && (
        <div className={homeStyles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={homeStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={homeStyles.closeBtn} onClick={() => setSelected(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className={homeStyles.modalBody}>
              <div className={homeStyles.modernAnnounceMeta} style={{ marginBottom: '16px' }}>
                <span className={homeStyles.modernAnnounceDate}>
                    {new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date(selected.tanggal))}
                </span>
              </div>
              <h2 className={homeStyles.modalTitle} style={{ fontSize: 'clamp(1.2rem, 4vw, 2.2rem)', marginBottom: '24px' }}>{selected.judul}</h2>
              {selected.image && (
                <div className={homeStyles.modalImageWrapper} style={{ borderRadius: '20px', marginBottom: '24px' }}>
                  <img src={selected.image} alt={selected.judul} style={{ maxHeight: '450px' }} />
                </div>
              )}
              <div className={homeStyles.modalText} style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: '#334155', fontWeight: 500 }}>
                {selected.konten}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
