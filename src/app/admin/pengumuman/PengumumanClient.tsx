"use client"

import { useState, useMemo, useEffect } from "react"
import { createPortal } from "react-dom"
import styles from "@/styles/employee_home.module.css"
import adminStyles from "@/styles/admin.module.css"
import Link from "next/link"
import { deleteAnnouncementAction } from "@/actions/admin"

interface Announcement {
  id: string
  judul: string
  konten: string
  image?: string | null
  tanggal: string
}

const IconPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>

export default function PengumumanClient({ announcements }: { announcements: Announcement[] }) {
  const [search, setSearch] = useState("")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const filtered = useMemo(() => {
    return announcements.filter(a =>
      a.judul.toLowerCase().includes(search.toLowerCase()) ||
      a.konten.toLowerCase().includes(search.toLowerCase())
    )
  }, [announcements, search])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Hapus pengumuman ini?")) {
      await deleteAnnouncementAction(id)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── DARK HERO HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 'clamp(12px, 3vw, 16px)',
        padding: 'clamp(20px, 5vw, 32px)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)'
      }}>
        {/* Geometric accents */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>

        <div className={adminStyles.pengumumanHeaderFlex}>
          <div className={adminStyles.pengumumanHeaderLeft}>
            <div className={adminStyles.pengumumanHeaderIcon}>
              <svg width="clamp(24px, 6vw, 32px)" height="clamp(24px, 6vw, 32px)" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div>
              <h1 className={adminStyles.pengumumanHeaderTitle}>Sirkulasi Pengumuman</h1>
              <p className={adminStyles.pengumumanHeaderDesc}>Kelola dan distribusikan informasi resmi kepada seluruh staf RMP.</p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/admin/pengumuman/tambah"
            className={adminStyles.pengumumanHeaderBtn}
          >
            <IconPlus /> BUAT PENGUMUMAN
          </Link>
        </div>
      </div>

      {/* ── SEARCH & STATS BAR ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{ position: 'absolute', left: '16px', top: 0, bottom: 0, display: 'flex', alignItems: 'center', color: '#64748b', pointerEvents: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input
            type="text"
            className={adminStyles.searchInput}
            placeholder="Cari judul atau isi pengumuman..."
            style={{
              width: '100%',
              padding: '14px 20px 14px 48px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#0f172a',
              boxSizing: 'border-box'
            }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Broadcast</span>
          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, border: '1px solid #dbeafe' }}>
            {filtered.length}
          </span>
        </div>
      </div>

      {/* ── ANNOUNCEMENT LIST (card style sama dengan karyawan) ── */}
      <div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 40px', background: 'white', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.2 }}>📰</div>
            <p style={{ color: '#94a3b8', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Data pengumuman tidak ditemukan.</p>
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: 'clamp(16px, 4vw, 24px)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
          }}>
            <div className={styles.announceList}>
              {filtered.map(a => {
                const date = new Date(a.tanggal)
                return (
                  <div
                    key={a.id}
                    className={`${styles.announceItem} ${adminStyles.adminAnnounceItem}`}
                    style={{ cursor: 'pointer', position: 'relative' }}
                    onClick={() => setSelectedAnnouncement(a)}
                  >
                    {a.image && (
                      <div className={styles.announceImageWrapper}>
                        <img src={a.image} alt={a.judul} className={styles.announceThumbnail} />
                      </div>
                    )}
                    <div className={styles.announceContent}>
                      <span className={styles.announceDateText}>
                        {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <h4 className={styles.announceTitle}>{a.judul}</h4>
                      <p className={styles.announcePreview}>{a.konten}</p>
                      <button className={styles.seeMoreBtn} onClick={e => { e.stopPropagation(); setSelectedAnnouncement(a) }}>
                        Lihat Selengkapnya
                      </button>
                    </div>

                    {/* Admin action buttons */}
                    <div
                      className={adminStyles.adminAnnounceActions}
                      onClick={e => e.stopPropagation()}
                    >
                      <Link
                        href={`/admin/pengumuman/edit/${a.id}`}
                        title="Edit"
                        className={adminStyles.pengumumanActionEdit}
                      >
                        <IconEdit /> Edit
                      </Link>
                      <button
                        title="Hapus"
                        onClick={e => handleDelete(a.id, e)}
                        className={adminStyles.pengumumanActionDelete}
                      >
                        <IconTrash /> Hapus
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL PREVIEW (sama dengan karyawan) ── */}
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
              <div className={styles.modalBody}>
                <div dangerouslySetInnerHTML={{ __html: selectedAnnouncement.konten }} />
              </div>

              {/* Admin footer in modal */}
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  TUTUP
                </button>
                <Link
                  href={`/admin/pengumuman/edit/${selectedAnnouncement.id}`}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#0f172a', color: 'white', fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none' }}
                >
                  EDIT MATERI
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
