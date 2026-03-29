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
          <div className={styles.card} style={{ textAlign: "center", color: "#94a3b8" }}>
            Belum ada pengumuman terbaru.
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                )}
              </div>
              <div className={styles.announceInfo}>
                <span className={styles.announceDateBadge}>
                  {new Intl.DateTimeFormat("id-ID", { month: "short", day: "numeric", year: "numeric" }).format(new Date(a.tanggal))}
                </span>
                <h3 className={styles.announceMiniTitle}>{a.judul}</h3>
                <p className={styles.announceExcerpt}>{a.konten}</p>
                <span className={styles.readMoreHint}>Lihat Detail →</span>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Modern Detail Modal */}
      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className={styles.modalBody}>
              <span className={styles.modalDate}>
                Diterbitkan pada: {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(selected.tanggal))}
              </span>
              <h2 className={styles.modalTitle}>{selected.judul}</h2>
              {selected.image && (
                <div className={styles.modalImageWrapper}>
                  <img src={selected.image} alt={selected.judul} />
                </div>
              )}
              <div className={styles.modalText}>
                {selected.konten}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
