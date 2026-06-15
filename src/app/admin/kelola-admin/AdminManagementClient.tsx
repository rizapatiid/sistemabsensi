"use client"

import { useState } from "react"
import { deleteAdminAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"
import employeeStyles from "@/styles/employee_home.module.css"
import Link from "next/link"

export default function AdminManagementClient({ admins, currentUserId }: { admins: any[], currentUserId: string }) {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [adminToDelete, setAdminToDelete] = useState<any>(null)

  const countTotal = admins.length
  
  const filteredAdmins = admins.filter(admin => 
    admin.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={styles.pageContainer} style={{ padding: '16px 0', gap: '12px' }}>
      
      {/* MODAL HAPUS KONFIRMASI */}
      {adminToDelete && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ background: 'white', width: '100%', maxWidth: '320px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                  <div style={{ padding: '32px 24px 24px', textAlign: 'center' }}>
                      <div style={{ width: '80px', height: '80px', background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </div>
                      <h3 style={{ margin: '0 0 8px 0', fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>Cabut Akses Admin?</h3>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', lineHeight: '1.5' }}>
                          Anda yakin ingin mencabut otoritas admin dari <strong>{adminToDelete.nama}</strong> permanen?
                      </p>
                  </div>

                  <div style={{ padding: '16px 24px', background: '#f8fafc', display: 'flex', gap: '12px' }}>
                      <button onClick={() => setAdminToDelete(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>BATAL</button>
                      <form action={async () => { await deleteAdminAction(adminToDelete.id); setAdminToDelete(null) }} style={{ flex: 1, display: 'flex' }}>
                          <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>YA, CABUT</button>
                      </form>
                  </div>
              </div>
          </div>
      )}

      {/* MODAL DETAIL - SYNCED WITH KARYAWAN */}
      {selectedAdmin && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.25)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ background: 'white', width: '100%', maxWidth: '380px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}>
                  <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f8fafc' }}>
                      <h3 style={{ margin: 0, fontWeight: 900, fontSize: '0.95rem', color: '#0f172a' }}>Detail Profil Administrator</h3>
                  </div>

                  <div style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
                          <div style={{ width: '56px', height: '56px', background: '#f1f5f9', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#1e3a8a', marginBottom: '10px' }}>{selectedAdmin.nama.charAt(0).toUpperCase()}</div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', textAlign: 'center' }}>{selectedAdmin.nama.toUpperCase()}</h4>
                          <span style={{ 
                              background: '#f8fafc', 
                              color: '#0f172a',
                              padding: '3px 8px',
                              borderRadius: '100px',
                              fontSize: '0.6rem',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                          }}><IconShield size={10} /> Administrator</span>
                      </div>

                      <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid #e2e8f0' }}>
                          <div>
                              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Informasi Otoritas</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '4px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginTop: '2px' }}>Otoritas ID</span>
                                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>{selectedAdmin.id}</span>
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '4px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Kontak</span>
                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>{selectedAdmin.phone || '-'}</span>
                                          {selectedAdmin.email && <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>{selectedAdmin.email}</span>}
                                      </div>
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '4px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Scope</span>
                                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>FULL ADMINISTRATIVE ACCESS</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div style={{ padding: '16px 20px', background: 'white', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                      <button onClick={() => setSelectedAdmin(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>TUTUP</button>
                      <Link href={`/admin/kelola-admin/edit/${selectedAdmin.id}`} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#0f172a', border: 'none', color: 'white', fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none' }}>EDIT AKSES</Link>
                  </div>
              </div>
          </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
          
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

              <div className={styles.pengumumanHeaderFlex}>
                  <div className={styles.pengumumanHeaderLeft}>
                      <div className={styles.pengumumanHeaderIcon}>
                          <svg width="clamp(24px, 6vw, 32px)" height="clamp(24px, 6vw, 32px)" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      </div>
                      <div>
                          <h1 className={styles.pengumumanHeaderTitle}>Kelola Admin</h1>
                          <p className={styles.pengumumanHeaderDesc}>Manajemen hirarki hak akses dan otoritas administratif sistem.</p>
                      </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                      href="/admin/kelola-admin/tambah"
                      className={styles.pengumumanHeaderBtn}
                      style={{ textDecoration: 'none' }}
                  >
                      <IconPlus /> DAFTARKAN ADMIN
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
                      <IconSearch />
                  </div>
                  <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="Cari ID atau Nama Admin..."
                      style={{
                          width: '100%',
                          padding: '14px 20px 14px 48px',
                          borderRadius: '12px',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: '#0f172a',
                          boxSizing: 'border-box'
                      }}
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                  />
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingLeft: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '6px', background: '#eff6ff', color: '#1e40af' }}>
                          <IconShield size={14} />
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Admin</span>
                      <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, border: '1px solid #dcfce7' }}>
                          {countTotal}
                      </span>
                  </div>
              </div>
          </div>
      </div>

      {/* 2. MAIN CONTENT - CARD BASED */}
      <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(16px, 4vw, 24px)', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div className={employeeStyles.announceList}>
                {filteredAdmins.map(admin => (
                    <div key={admin.id} className={`${employeeStyles.announceItem} ${styles.adminAnnounceItem} ${styles.absensiItemGrid} ${styles.karyawanGrid}`} style={{ position: 'relative' }}>
                        <div className={employeeStyles.announceImageWrapper} style={{ background: '#f8fafc', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', fontSize: '1.4rem', fontWeight: 900, color: '#1e3a8a', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                            {admin.nama.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className={employeeStyles.announceContent} style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h4 className={employeeStyles.announceTitle} style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 900, lineHeight: 1.2 }}>
                                    {admin.nama.toUpperCase()}
                                </h4>
                                {admin.id === currentUserId && (
                                    <span style={{ fontSize: '0.55rem', fontWeight: 900, background: '#eff6ff', color: '#3b82f6', padding: '2px 6px', borderRadius: '6px' }}>PERSONAL</span>
                                )}
                            </div>
                            
                            <div style={{ 
                                display: 'inline-flex', 
                                gap: '6px', 
                                flexWrap: 'wrap', 
                                padding: '4px', 
                                background: '#f8fafc', 
                                border: '1px solid #e2e8f0', 
                                borderRadius: '8px' 
                            }}>
                                <span style={{ 
                                    padding: '4px 10px', 
                                    borderRadius: '6px',
                                    background: '#f8fafc',
                                    color: '#0f172a',
                                    fontSize: '0.65rem',
                                    fontWeight: 900,
                                    letterSpacing: '0.02em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <IconShield size={12} /> ADMINISTRATOR
                                </span>
                            </div>

                            <div className={styles.employeeInfoRow}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    ID: {admin.id}
                                </span>
                            </div>
                        </div>

                        <div className={`${styles.adminAnnounceActions} ${styles.karyawanActions}`}>
                            <button onClick={() => setSelectedAdmin(admin)} className={styles.pengumumanActionEdit} title="Detail">
                                <IconEye /> Detail
                            </button>
                            
                            <Link href={`/admin/kelola-admin/edit/${admin.id}`} className={styles.pengumumanActionEdit} title="Edit">
                                <IconEdit /> Edit
                            </Link>

                            {admin.id !== currentUserId && (
                                <button 
                                    onClick={() => setAdminToDelete(admin)} 
                                    className={styles.pengumumanActionEdit} 
                                    style={{ color: '#ef4444', borderColor: '#fecaca' }}
                                    title="Hapus"
                                >
                                    <IconTrash /> Hapus
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                
                {filteredAdmins.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8", fontWeight: "600", fontSize: "0.85rem", background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                        Data administrator tidak ditemukan.
                    </div>
                )}
              </div>
          </div>
    </div>
  )
}

const IconShield = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconPlus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
const IconTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
const IconEye = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
