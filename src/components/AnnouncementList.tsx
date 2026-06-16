'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from '@/styles/employee_home.module.css'
import RichTextRenderer from '@/components/RichTextRenderer'

interface Announcement {
  id: string
  judul: string
  konten: string
  image: string | null
  tanggal: Date | string
}

export default function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <div className={styles.announceList}>
        {announcements.map((p) => {
          const date = new Date(p.tanggal)
          return (
            <div key={p.id} className={styles.announceItem}>
               {p.image && (
                  <div className={styles.announceImageWrapper}>
                      <img src={p.image} alt={p.judul} className={styles.announceThumbnail} />
                  </div>
               )}
               <div className={styles.announceContent}>
                   <span className={styles.announceDateText}>
                       {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </span>
                   <h4 className={styles.announceTitle}>{p.judul}</h4>
                   <p className={styles.announcePreview}>{p.konten.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')}</p>
                   <button 
                     className={styles.seeMoreBtn}
                     onClick={() => setSelectedAnnouncement(p)}
                   >
                     Lihat Selengkapnya
                   </button>
               </div>
            </div>
          )
        })}
      </div>

      {/* Modal Popup using createPortal to escape overflow hidden */}
      {selectedAnnouncement && mounted && createPortal(
        <div className={styles.modalOverlay} onClick={() => setSelectedAnnouncement(null)}>
           <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
               <button className={styles.modalCloseBtn} onClick={() => setSelectedAnnouncement(null)}>✕</button>
               <div className={styles.modalContentWrapper}>
                   {selectedAnnouncement.image && (
                      <img src={selectedAnnouncement.image} alt={selectedAnnouncement.judul} className={styles.modalImage} />
                   )}
                   <h2 className={styles.modalTitle}>{selectedAnnouncement.judul}</h2>
                   <p className={styles.modalDate}>
                     {new Date(selectedAnnouncement.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </p>
                   <div className={styles.modalBody} style={{ padding: '0 24px 24px' }}>
                     <RichTextRenderer content={selectedAnnouncement.konten} />
                   </div>
               </div>
           </div>
        </div>,
        document.body
      )}
    </>
  )
}
