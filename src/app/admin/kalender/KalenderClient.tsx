"use client"

import styles from "@/styles/admin.module.css"
import Link from "next/link"
import { deleteHolidayAction } from "@/actions/admin"
import { formatIndonesianDate } from "@/lib/date"

interface Holiday {
  id: string
  tanggal: string
  keterangan: string
  image?: string | null
}

const IconPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconShieldSmall = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const IconTrash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
const IconEdit = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>

export default function KalenderClient({ holidays }: { holidays: Holiday[] }) {
  const handleDeleteHoliday = async (id: string) => {
    if (confirm("Hapus hari libur ini?")) {
      await deleteHolidayAction(id)
    }
  }

  return (
    <div className={styles.pageContainer} style={{ background: '#f8fafc', padding: '0px', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ padding: 'clamp(12px, 2vw, 24px) clamp(16px, 4vw, 32px) 0 clamp(16px, 4vw, 32px)' }}>
          <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginBottom: '12px'
          }}>
              <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Kalender Operasional • Live Updates</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
              <div style={{ flex: '1 1 300px' }}>
                  <h1 className={styles.pageTitle} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Kalender Operasional
                  </h1>
                  <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                    Kelola jadwal hari libur dan agenda operasional perusahaan.
                  </p>
                  
                  <div style={{ marginTop: '24px' }}>
                      <Link 
                        href="/admin/kalender/tambah-libur" 
                        className={styles.btnAction}
                        style={{ 
                            display: 'inline-flex',
                            padding: '12px 20px', 
                            borderRadius: '14px', 
                            background: '#0f172a', 
                            color: 'white', 
                            fontWeight: 900,
                            fontSize: '0.75rem',
                            boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
                            alignItems: 'center',
                            gap: '8px',
                            textDecoration: 'none'
                        }}
                      >
                        <IconPlus /> SET HARI LIBUR
                      </Link>
                  </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                  <div className={styles.statPill} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', padding: '12px', minWidth: '120px' }}>
                      <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#1d4ed8', width: '36px', height: '36px', minWidth: '36px' }}><IconShieldSmall /></div>
                      <div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{holidays.length}</div>
                          <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Hari Libur</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div style={{ padding: '0 clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)' }}>
          <div className={styles.card} style={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', padding: '0', overflow: 'hidden' }}>
              
              {/* Desktop Table */}
              <div className="hidden-mobile" style={{ padding: '24px' }}>
                  <div className={styles.tableWrapper}>
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
                  </div>
              </div>

              {/* Mobile Card View */}
              <div className="show-only-mobile" style={{ padding: '0 20px 24px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {holidays.map(h => (
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
                      ))}
                      {holidays.length === 0 && (
                          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontWeight: 700 }}>Belum ada agenda operasional.</div>
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
    </div>
  )
}
