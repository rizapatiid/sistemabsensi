"use client"

import { useState } from "react"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import { deleteHolidayAction, deleteAnnouncementAction } from "@/actions/admin"
import { formatIndonesianDate } from "@/lib/date"

interface Holiday {
  id: string
  tanggal: string
  keterangan: string
}

interface Announcement {
  id: string
  judul: string
  konten: string
  image?: string | null
  tanggal: string
  scheduleDate?: Date | null
}

const IconKalender = () => (
    <div style={{ background: '#f8fafc', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    </div>
)

const IconPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconShield = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const IconMegaphone = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11.6 16.8l2.6 3.1c.5.6 1.4.6 1.9 0l3-3.6c.5-.6.5-1.5 0-2.1l-2.6-3.1"/><path d="M18.3 12.1l-10-8.6c-1-.8-2.5-.1-2.5 1.2v14.6c0 1.3 1.5 2 2.5 1.2l10-8.6c.8-.7.8-2 0-2.8z"/></svg>
const IconTrash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
const IconEye = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IconEdit = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>

export default function KalenderClient({ holidays, announcements }: { holidays: Holiday[], announcements: Announcement[] }) {
  const [activeTab, setActiveTab] = useState<'KALENDER' | 'PENGUMUMAN'>('KALENDER')
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  const handleDeleteHoliday = async (id: string) => {
    if (confirm("Hapus hari libur ini?")) {
      await deleteHolidayAction(id)
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm("Hapus pengumuman ini?")) {
      await deleteAnnouncementAction(id)
    }
  }

  return (
    <div style={{ padding: '0px' }}>
      {/* Header & Control Center (Responsive) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>
        <div style={{ flex: '1 1 400px', minWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <IconKalender />
                <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em', lineHeight: '1.2' }}>Manajemen Publikasi</h1>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600, marginTop: '12px', marginLeft: '2px', lineHeight: '1.5' }}>
                Kontrol kalender libur operasional dan pengumuman staf RMP.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
                <Link href="/admin/kalender/tambah-libur" className={styles.btnAction} style={{ padding: '14px 24px', borderRadius: '14px', background: '#1e3a8a', flex: '1 1 auto', justifyContent: 'center' }}>
                    <IconPlus /> SET LIBUR
                </Link>
                <Link href="/admin/kalender/tambah-pengumuman" className={styles.btnAction} style={{ padding: '14px 24px', borderRadius: '14px', background: '#3b82f6', flex: '1 1 auto', justifyContent: 'center' }}>
                    <IconPlus /> BUAT PENGUMUMAN
                </Link>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', flex: '1 1 auto' }}>
            <div className={styles.statPill} style={{ borderColor: '#fee2e2', flex: '1 1 180px' }}>
                <div className={styles.statIcon} style={{ background: '#fee2e2', color: '#dc2626' }}><IconShield /></div>
                <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a' }}>{holidays.length}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>HARI LIBUR</div>
                </div>
            </div>
            
            <div className={styles.statPill} style={{ borderColor: '#e0e7ff', flex: '1 1 180px' }}>
                <div className={styles.statIcon} style={{ background: '#e0e7ff', color: '#3730a3' }}><IconMegaphone /></div>
                <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a' }}>{announcements.length}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>PENGUMUMAN</div>
                </div>
            </div>
        </div>
      </div>

      {/* Tabs (Centering on Mobile) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '6px', borderRadius: '16px', width: 'fit-content' }}>
            <button 
                onClick={() => setActiveTab('KALENDER')}
                style={{ 
                    padding: '12px 24px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    fontSize: '0.85rem', 
                    fontWeight: 850,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: activeTab === 'KALENDER' ? 'white' : 'transparent',
                    color: activeTab === 'KALENDER' ? '#1e3a8a' : '#64748b',
                    boxShadow: activeTab === 'KALENDER' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
                }}
            >
                KALENDER
            </button>
            <button 
                onClick={() => setActiveTab('PENGUMUMAN')}
                style={{ 
                    padding: '12px 24px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    fontSize: '0.85rem', 
                    fontWeight: 850,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: activeTab === 'PENGUMUMAN' ? 'white' : 'transparent',
                    color: activeTab === 'PENGUMUMAN' ? '#1e3a8a' : '#64748b',
                    boxShadow: activeTab === 'PENGUMUMAN' ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
                }}
            >
                PENGUMUMAN
            </button>
        </div>
      </div>

      {/* Desktop List View (Table - hidden on small mobile) */}
      <div className={`${styles.card} hidden-mobile`} style={{ border: 'none', boxShadow: '0 4px 25px rgba(0,0,0,0.04)', padding: '24px' }}>
        <div className={styles.tableWrapper}>
          {activeTab === 'KALENDER' ? (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ background: '#fcfcfd' }}>TANGGAL</th>
                  <th style={{ background: '#fcfcfd' }}>KETERANGAN</th>
                  <th style={{ background: '#fcfcfd', textAlign: 'right' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map(h => (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 800, color: '#1e3a8a' }}>{formatIndonesianDate(h.tanggal)}</td>
                    <td style={{ fontWeight: 700, color: '#334155' }}>{h.keterangan}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDeleteHoliday(h.id)} className={styles.btnSm} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 850 }}>HAPUS</button>
                    </td>
                  </tr>
                ))}
                {holidays.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '100px', color: '#94a3b8', fontWeight: 700 }}>Belum ada hari libur.</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ background: '#fcfcfd' }}>DETAIL PENGUMUMAN</th>
                  <th style={{ background: '#fcfcfd' }}>PUBLIKASI</th>
                  <th style={{ background: '#fcfcfd', textAlign: 'right' }}>KONTROL</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {a.image && <img src={a.image} alt="thumb" style={{ width: '50px', height: '50px', borderRadius: '14px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />}
                        <div>
                          <div style={{ fontWeight: 850, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.01em' }}>{a.judul.toUpperCase()}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>{a.konten}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 750, color: '#334155', fontSize: '0.9rem' }}>
                        {formatIndonesianDate(a.tanggal, false)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setSelectedAnnouncement(a)} className={styles.btnSm} style={{ background: '#e0e7ff', color: '#3730a3', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 850, display: 'flex', alignItems: 'center', gap: '6px' }}><IconEye /> LIHAT</button>
                        <Link href={`/admin/kalender/edit-pengumuman/${a.id}`} className={styles.btnSm} style={{ background: '#f1f5f9', color: '#64748b', textDecoration: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 850, display: 'flex', alignItems: 'center', gap: '6px' }}><IconEdit /> EDIT</Link>
                        <button onClick={() => handleDeleteAnnouncement(a.id)} className={styles.btnSm} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 850, display: 'flex', alignItems: 'center', gap: '6px' }}><IconTrash /> HAPUS</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {announcements.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '100px', color: '#94a3b8', fontWeight: 700 }}>Belum ada pengumuman.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mobile Card View (Visible only on mobile) */}
      <div className="show-only-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
         {activeTab === 'KALENDER' ? (
            holidays.map(h => (
                <div key={h.id} style={{ background: 'white', padding: '20px', borderRadius: '18px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 850, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tanggal Libur</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e3a8a', marginTop: '4px' }}>{formatIndonesianDate(h.tanggal)}</div>
                        </div>
                        <button onClick={() => handleDeleteHoliday(h.id)} style={{ padding: '8px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', display: 'flex' }}><IconTrash /></button>
                    </div>
                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>
                        {h.keterangan}
                    </div>
                </div>
            ))
         ) : (
            announcements.map(a => (
                <div key={a.id} style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
                        {a.image ? (
                            <img src={a.image} alt="thumb" style={{ width: '60px', height: '60px', borderRadius: '14px', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><IconMegaphone /></div>
                        )}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', lineHeight: '1.3' }}>{a.judul.toUpperCase()}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>{formatIndonesianDate(a.tanggal, false)}</div>
                        </div>
                    </div>
                    
                    <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 550, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                        {a.konten}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <button onClick={() => setSelectedAnnouncement(a)} style={{ flex: 1, padding: '12px', background: '#e0e7ff', color: '#3730a3', border: 'none', borderRadius: '12px', fontWeight: 850, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><IconEye /> LIHAT</button>
                        <Link href={`/admin/kalender/edit-pengumuman/${a.id}`} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px', fontWeight: 850, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}><IconEdit /> EDIT</Link>
                        <button onClick={() => handleDeleteAnnouncement(a.id)} style={{ padding: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '12px', fontWeight: 850, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconTrash /></button>
                    </div>
                </div>
            ))
         )}
         {((activeTab === 'KALENDER' && holidays.length === 0) || (activeTab === 'PENGUMUMAN' && announcements.length === 0)) && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontWeight: 700 }}>Data tidak ditemukan.</div>
         )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-only-mobile { display: none !important; }
        }
      `}</style>

      {/* DETAIL MODAL */}
      {selectedAnnouncement && (
        <div className={styles.imageModal} style={{ alignItems: 'center' }} onClick={() => setSelectedAnnouncement(null)}>
            <div className={styles.card} style={{ 
                maxWidth: '800px', 
                width: '95%', 
                maxHeight: '90vh', 
                overflowY: 'auto', 
                padding: '24px', 
                position: 'relative',
                borderRadius: '24px'
            }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedAnnouncement(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#94a3b8', zIndex: 10 }}>×</button>
                
                <span style={{ fontSize: '0.7rem', fontWeight: 850, color: '#3b82f6', background: '#eff6ff', padding: '4px 10px', borderRadius: '6px' }}>DETAIL PUBLIKASI</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '12px 0 6px 0', lineHeight: '1.2' }}>{selectedAnnouncement.judul.toUpperCase()}</h2>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '20px' }}>Terbit: {formatIndonesianDate(selectedAnnouncement.tanggal)}</div>
                
                {selectedAnnouncement.image && (
                    <div style={{ marginBottom: '20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <img src={selectedAnnouncement.image} alt="Announcement" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                )}

                <div style={{ 
                    fontSize: '0.95rem', 
                    color: '#334155', 
                    lineHeight: '1.6', 
                    fontWeight: 550, 
                    whiteSpace: 'pre-wrap', 
                    background: '#f8fafc', 
                    padding: '20px', 
                    borderRadius: '16px',
                    border: '1px solid #f1f5f9' 
                }}>
                    {selectedAnnouncement.konten}
                </div>

                <div style={{ marginTop: '28px' }}>
                    <button 
                        onClick={() => setSelectedAnnouncement(null)}
                        className={styles.btnAction}
                        style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', justifyContent: 'center' }}
                    >
                        TUTUP
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
