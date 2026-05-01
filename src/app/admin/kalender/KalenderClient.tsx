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
  image?: string | null
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

const IconShieldSmall = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const IconMegaphoneSmall = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11.6 16.8l2.6 3.1c.5.6 1.4.6 1.9 0l3-3.6c.5-.6.5-1.5 0-2.1l-2.6-3.1"/><path d="M18.3 12.1l-10-8.6c-1-.8-2.5-.1-2.5 1.2v14.6c0 1.3 1.5 2 2.5 1.2l10-8.6c.8-.7.8-2 0-2.8z"/></svg>

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
    <div className={styles.pageContainer} style={{ background: '#f8fafc', padding: '0px', minHeight: '100vh' }}>
      
      {/* 1. STATUS LINE - PROFESSIONAL */}
      <div style={{ padding: 'clamp(12px, 2vw, 24px) clamp(16px, 4vw, 32px) 0 clamp(16px, 4vw, 32px)' }}>
          <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginBottom: '12px'
          }}>
              <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Broadcasting Center • Live Updates</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
              <div style={{ flex: '1 1 300px' }}>
                  <h1 className={styles.pageTitle} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Manajemen Publikasi
                  </h1>
                  <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                    Kontrol kalender operasional dan sirkulasi pengumuman staf RMP.
                  </p>
                  
                  <div style={{ marginTop: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <Link 
                        href="/admin/kalender/tambah-libur" 
                        className={styles.btnAction}
                        style={{ 
                            flex: '1 1 auto',
                            padding: '12px 16px', 
                            borderRadius: '14px', 
                            background: '#0f172a', 
                            color: 'white', 
                            fontWeight: 900,
                            fontSize: '0.75rem',
                            boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
                            justifyContent: 'center',
                            minWidth: '140px'
                        }}
                      >
                        <IconPlus /> SET HARI LIBUR
                      </Link>
                      <Link 
                        href="/admin/kalender/tambah-pengumuman" 
                        className={styles.btnAction}
                        style={{ 
                            flex: '1 1 auto',
                            padding: '12px 16px', 
                            borderRadius: '14px', 
                            background: '#3b82f6', 
                            color: 'white', 
                            fontWeight: 900,
                            fontSize: '0.75rem',
                            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1)',
                            justifyContent: 'center',
                            minWidth: '140px'
                        }}
                      >
                        <IconPlus /> BUAT PENGUMUMAN
                      </Link>
                  </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '400px', flex: '1 1 auto' }}>
                  <div className={styles.statPill} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', flex: 1, padding: '12px', minWidth: 0 }}>
                      <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#1d4ed8', width: '36px', height: '36px', minWidth: '36px' }}><IconShieldSmall /></div>
                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{holidays.length}</div>
                          <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Hari Libur</div>
                      </div>
                  </div>
                  <div className={styles.statPill} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', flex: 1, padding: '12px', minWidth: 0 }}>
                      <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#15803d', width: '36px', height: '36px', minWidth: '36px' }}><IconMegaphoneSmall /></div>
                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{announcements.length}</div>
                          <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Publikasi</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div style={{ padding: '0 clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)' }}>
          <div className={styles.card} style={{ borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', padding: '0', overflow: 'hidden' }}>
              
              <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', padding: '4px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                      <button 
                          onClick={() => setActiveTab('KALENDER')}
                          style={{ 
                              padding: '10px 24px', 
                              borderRadius: '10px', 
                              border: 'none', 
                              fontSize: '0.75rem', 
                              fontWeight: 900,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              background: activeTab === 'KALENDER' ? '#ffffff' : 'transparent',
                              color: activeTab === 'KALENDER' ? '#0f172a' : '#64748b',
                              boxShadow: activeTab === 'KALENDER' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'
                          }}
                      >
                          KALENDAR OPERASIONAL
                      </button>
                      <button 
                          onClick={() => setActiveTab('PENGUMUMAN')}
                          style={{ 
                              padding: '10px 24px', 
                              borderRadius: '10px', 
                              border: 'none', 
                              fontSize: '0.75rem', 
                              fontWeight: 900,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              background: activeTab === 'PENGUMUMAN' ? '#ffffff' : 'transparent',
                              color: activeTab === 'PENGUMUMAN' ? '#0f172a' : '#64748b',
                              boxShadow: activeTab === 'PENGUMUMAN' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'
                          }}
                      >
                          SIRKULASI PENGUMUMAN
                      </button>
                  </div>
              </div>

              <div className="hidden-mobile" style={{ padding: '0 24px 24px 24px' }}>
                  <div className={styles.tableWrapper}>
                      {activeTab === 'KALENDER' ? (
                          <table className={styles.dataTable}>
                              <thead>
                                  <tr>
                                      <th style={{ background: 'transparent', paddingLeft: '0' }}>TANGGAL OPERASIONAL</th>
                                      <th style={{ background: 'transparent' }}>KETERANGAN AGENDA</th>
                                      <th style={{ background: 'transparent', textAlign: 'right' }}>MANAJEMEN</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {holidays.map(h => (
                                      <tr key={h.id}>
                                          <td style={{ fontWeight: 800, color: '#1e3a8a', paddingLeft: '0' }}>{formatIndonesianDate(h.tanggal)}</td>
                                          <td style={{ fontWeight: 700, color: '#475569' }}>
                                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                  {h.image && (
                                                      <img src={h.image} alt="thumb" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }} />
                                                  )}
                                                  <span>{h.keterangan}</span>
                                              </div>
                                          </td>
                                          <td style={{ textAlign: 'right' }}>
                                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                  <Link href={`/admin/kalender/edit-libur/${h.id}`} className={styles.btnSm} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px' }} title="Edit"><IconEdit /></Link>
                                                  <button 
                                                      onClick={() => handleDeleteHoliday(h.id)} 
                                                      className={styles.btnSm} 
                                                      style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px' }}
                                                      title="Hapus"
                                                  >
                                                      <IconTrash />
                                                  </button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                                  {holidays.length === 0 && (
                                      <tr><td colSpan={3} style={{ textAlign: 'center', padding: '100px', color: '#94a3b8', fontWeight: 700 }}>Belum ada agenda operasional.</td></tr>
                                  )}
                              </tbody>
                          </table>
                      ) : (
                          <table className={styles.dataTable}>
                              <thead>
                                  <tr>
                                      <th style={{ background: 'transparent', paddingLeft: '0' }}>DETAIL PUBLIKASI</th>
                                      <th style={{ background: 'transparent' }}>TANGGAL TERBIT</th>
                                      <th style={{ background: 'transparent', textAlign: 'right' }}>KONTROL</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {announcements.map(a => (
                                      <tr key={a.id}>
                                          <td style={{ paddingLeft: '0' }}>
                                              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                  {a.image ? (
                                                      <img src={a.image} alt="thumb" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                                                  ) : (
                                                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><IconMegaphone /></div>
                                                  )}
                                                  <div>
                                                      <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '0.9rem', letterSpacing: '-0.01em' }}>{a.judul.toUpperCase()}</div>
                                                      <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px', fontWeight: 600 }}>{a.konten}</div>
                                                  </div>
                                              </div>
                                          </td>
                                          <td style={{ fontWeight: 750, color: '#475569', fontSize: '0.85rem' }}>
                                              {formatIndonesianDate(a.tanggal, false)}
                                          </td>
                                          <td style={{ textAlign: 'right' }}>
                                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                  <button onClick={() => setSelectedAnnouncement(a)} className={styles.btnSm} style={{ background: '#f8fafc', color: '#64748b', border: 'none', borderRadius: '8px' }} title="Lihat Detail"><IconEye /></button>
                                                  <Link href={`/admin/kalender/edit-pengumuman/${a.id}`} className={styles.btnSm} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px' }} title="Edit Konten"><IconEdit /></Link>
                                                  <button onClick={() => handleDeleteAnnouncement(a.id)} className={styles.btnSm} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px' }} title="Hapus"><IconTrash /></button>
                                              </div>
                                          </td>
                                      </tr>
                                  ))}
                                  {announcements.length === 0 && (
                                      <tr><td colSpan={3} style={{ textAlign: 'center', padding: '100px', color: '#94a3b8', fontWeight: 700 }}>Belum ada materi publikasi.</td></tr>
                                  )}
                              </tbody>
                          </table>
                      )}
                  </div>
              </div>

              {/* Mobile Card View */}
              <div className="show-only-mobile" style={{ padding: '0 20px 24px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {activeTab === 'KALENDER' ? (
                          holidays.map(h => (
                              <div key={h.id} style={{ background: '#fcfcfd', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                      <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e3a8a' }}>{formatIndonesianDate(h.tanggal)}</span>
                                      <div style={{ display: 'flex', gap: '8px' }}>
                                        <Link href={`/admin/kalender/edit-libur/${h.id}`} style={{ padding: '6px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', border: 'none', display: 'flex', alignItems: 'center' }} title="Edit"><IconEdit /></Link>
                                        <button onClick={() => handleDeleteHoliday(h.id)} style={{ padding: '6px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', border: 'none', display: 'flex', alignItems: 'center' }} title="Hapus"><IconTrash /></button>
                                      </div>
                                  </div>
                                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                      {h.image && (
                                          <img src={h.image} alt="thumb" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                                      )}
                                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{h.keterangan}</p>
                                  </div>
                              </div>
                          ))
                      ) : (
                          announcements.map(a => (
                              <div key={a.id} style={{ background: '#fcfcfd', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                                      {a.image ? (
                                          <img src={a.image} alt="thumb" style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
                                      ) : (
                                          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><IconMegaphone /></div>
                                      )}
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.judul.toUpperCase()}</div>
                                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>{formatIndonesianDate(a.tanggal, false)}</div>
                                      </div>
                                  </div>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                      <button onClick={() => setSelectedAnnouncement(a)} style={{ flex: 1, padding: '10px', background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', fontWeight: 800, fontSize: '0.75rem' }}>LIHAT</button>
                                      <Link href={`/admin/kalender/edit-pengumuman/${a.id}`} style={{ flex: 1, padding: '10px', background: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', borderRadius: '10px', fontWeight: 800, fontSize: '0.75rem', textAlign: 'center', textDecoration: 'none' }}>EDIT</Link>
                                      <button onClick={() => handleDeleteAnnouncement(a.id)} style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '10px' }}><IconTrash /></button>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-only-mobile { display: none !important; }
        }
      `}</style>

      {/* PUBLICATION PREVIEW MODAL - SYNCED WITH COMMAND CENTER DESIGN */}
      {selectedAnnouncement && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.25)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* MODAL HEADER */}
                  <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8fafc', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '8px', borderRadius: '10px', display: 'flex' }}><IconMegaphone /></div>
                          <h3 style={{ margin: 0, fontWeight: 900, fontSize: '0.9rem', color: '#0f172a' }}>Pratinjau Publikasi</h3>
                      </div>
                      <button onClick={() => setSelectedAnnouncement(null)} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                          <IconX />
                      </button>
                  </div>

                  {/* MODAL BODY (SCROLLABLE) */}
                  <div style={{ padding: '24px', overflowY: 'auto' }}>
                      <div style={{ marginBottom: '24px' }}>
                          <div style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '6px', 
                              padding: '4px 10px', 
                              background: '#f8fafc', 
                              borderRadius: '100px', 
                              border: '1px solid #e2e8f0',
                              marginBottom: '12px'
                          }}>
                              <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
                              <span style={{ fontSize: '0.65rem', fontWeight: 850, color: '#64748b', textTransform: 'uppercase' }}>Terbit: {formatIndonesianDate(selectedAnnouncement.tanggal)}</span>
                          </div>
                          
                          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                              {selectedAnnouncement.judul.toUpperCase()}
                          </h2>
                      </div>

                      {selectedAnnouncement.image && (
                          <div style={{ marginBottom: '24px', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                              <img src={selectedAnnouncement.image} alt="Publicity" style={{ width: '100%', height: 'auto', display: 'block' }} />
                          </div>
                      )}

                      <div style={{ 
                          fontSize: '0.9rem', 
                          color: '#334155', 
                          lineHeight: '1.7', 
                          fontWeight: 500, 
                          whiteSpace: 'pre-wrap', // Restore this to respect newlines
                          background: '#f8fafc',
                          padding: '24px',
                          borderRadius: '20px',
                          border: '1px solid #f1f5f9'
                      }}>
                          <div dangerouslySetInnerHTML={{ __html: selectedAnnouncement.konten }} />
                      </div>
                  </div>

                  {/* MODAL FOOTER */}
                  <div style={{ padding: '16px 24px', background: '#ffffff', borderTop: '1px solid #f8fafc', display: 'flex', gap: '10px', flexShrink: 0 }}>
                      <button onClick={() => setSelectedAnnouncement(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>BATAL</button>
                      <Link href={`/admin/kalender/edit-pengumuman/${selectedAnnouncement.id}`} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#0f172a', border: 'none', color: 'white', fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none' }}>EDIT MATERI</Link>
                  </div>
              </div>
          </div>
      )}

      {/* Reusing IconX if already defined in the file or defining it here */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-only-mobile { display: none !important; }
        }
      `}</style>
      </div>
    );
}

const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
