"use client"

import { useState } from "react"
import { deleteAdminAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"
import Link from "next/link"



export default function AdminManagementClient({ admins, currentUserId }: { admins: any[], currentUserId: string }) {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)

  const countTotal = admins.length
  
  const filteredAdmins = admins.filter(admin => 
    admin.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  async function handleDelete(id: string) {
    if (id === currentUserId) {
        alert("Tidak dapat menghapus akun Anda sendiri!")
        return
    }
    if (confirm("Ingin menghapus akses Admin ini? Karyawan yang terkait tidak akan terpengaruh.")) {
      setLoading(true)
      await deleteAdminAction(id)
      setLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer} style={{ background: '#f8fafc', padding: '0px', minHeight: '100vh' }}>
      
      {/* MODAL DETAIL - SYNCED WITH KARYAWAN */}
      {selectedAdmin && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.25)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ background: 'white', width: '100%', maxWidth: '380px', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}>
                  <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8fafc' }}>
                      <h3 style={{ margin: 0, fontWeight: 900, fontSize: '0.95rem', color: '#0f172a' }}>Detail Profil Administrator</h3>
                      <button onClick={() => setSelectedAdmin(null)} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                          <IconX />
                      </button>
                  </div>

                  <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                          <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6', marginBottom: '12px' }}>{selectedAdmin.nama.charAt(0)}</div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', textAlign: 'center' }}>{selectedAdmin.nama.toUpperCase()}</h4>
                          <span style={{ 
                              background: '#f8fafc', 
                              color: '#64748b',
                              padding: '3px 10px',
                              borderRadius: '100px',
                              fontSize: '0.6rem',
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              border: '1px solid #e2e8f0'
                          }}>Administrator System</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Otoritas ID</span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{selectedAdmin.id}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Kontak</span>
                              <div>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{selectedAdmin.phone || '-'}</div>
                                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{selectedAdmin.email || '-'}</div>
                              </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Scope</span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>FULL ADMINISTRATIVE ACCESS</span>
                          </div>
                      </div>
                  </div>

                  <div style={{ padding: '16px 24px', background: '#f8fafc', display: 'flex', gap: '10px' }}>
                      <button onClick={() => setSelectedAdmin(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>TUTUP</button>
                      <Link href={`/admin/kelola-admin/edit/${selectedAdmin.id}`} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#0f172a', border: 'none', color: 'white', fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none' }}>EDIT AKSES</Link>
                  </div>
              </div>
          </div>
      )}
      
      {/* 1. STATUS LINE - PROFESSIONAL */}
      <div style={{ padding: 'clamp(12px, 2vw, 24px) clamp(16px, 4vw, 32px) 0 clamp(16px, 4vw, 32px)' }}>
          <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginBottom: '12px'
          }}>
              <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Otoritas Keamanan • Real-time Sync</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
            <div>
                <h1 className={styles.pageTitle} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Kelola Admin
                </h1>
                <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                    Manajemen hirarki hak akses dan otoritas administratif sistem.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <div className={styles.statPill} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#3b82f6' }}>
                        <IconShield />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>{countTotal}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Total Admin</div>
                    </div>
                </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
             <Link href="/admin/kelola-admin/tambah" className={styles.btnAction} style={{ padding: '12px 24px', borderRadius: '12px', background: '#0f172a', fontWeight: 800 }}>
                <IconPlus /> DAFTARKAN ADMIN
             </Link>
          </div>
      </div>

      {/* 2. MAIN CONTENT - CARD BASED */}
      <div style={{ padding: '0 clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)' }}>
          <div className={styles.card} style={{ borderRadius: '24px', overflow: 'hidden', padding: 0 }}>
              <div className={styles.cardHeader} style={{ 
                padding: '20px 24px', 
                borderBottom: '1px solid #f1f5f9', 
                background: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff6ff', color: '#3b82f6', width: '32px', height: '32px', borderRadius: '10px' }}>
                        <IconShield size={18} />
                    </div>
                    <h3 className={styles.cardTitle} style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900 }}>Daftar Administrator</h3>
                </div>
                <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '300px', flex: '1 1 250px' }}>
                  <div className={styles.searchIcon} style={{ color: '#94a3b8' }}><IconSearch /></div>
                  <input 
                    type="text" 
                    placeholder="Cari Username atau Nama..." 
                    className={styles.searchInput}
                    value={searchTerm}
                    style={{ fontWeight: 600, fontSize: '0.85rem', height: '42px' }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Identitas Administrator</th>
                      <th>Informasi Kontak</th>
                      <th>Hak Akses</th>
                      <th style={{ textAlign: 'right' }}>Opsi Kelola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id}>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.userAvatar} style={{ background: admin.id === currentUserId ? '#eff6ff' : '#f1f5f9', color: admin.id === currentUserId ? '#3b82f6' : '#1e3a8a', fontWeight: 800 }}>{admin.nama.charAt(0)}</div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className={styles.userName} style={{ fontSize: '0.85rem', fontWeight: 800 }}>{admin.nama.toUpperCase()}</span>
                                {admin.id === currentUserId && (
                                    <span style={{ fontSize: '0.55rem', fontWeight: 900, background: '#eff6ff', color: '#3b82f6', padding: '2px 6px', borderRadius: '6px' }}>PERSONAL</span>
                                )}
                              </div>
                              <span className={styles.userSub} style={{ fontSize: '0.7rem', fontWeight: 600 }}>ID: {admin.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                           <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>{admin.phone || '-'}</div>
                           <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#64748b' }}>{admin.email || '-'}</div>
                        </td>
                        <td>
                           <div 
                                className={`${styles.badge}`} 
                                style={{ 
                                    background: '#f8fafc', 
                                    color: '#0f172a',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '0.6rem',
                                    fontWeight: 900,
                                    padding: '4px 10px',
                                    borderRadius: '100px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                ADMINISTRATOR
                            </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => setSelectedAdmin(admin)}
                                className={styles.btnSm} 
                                style={{ background: '#f8fafc', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                title="Lihat Detail"
                              >
                                <IconEye />
                              </button>
                              <Link 
                                href={`/admin/kelola-admin/edit/${admin.id}`} 
                                className={styles.btnSm} 
                                style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px' }}
                                title="Edit Akses"
                              >
                                <IconEdit />
                              </Link>
                              
                              {admin.id !== currentUserId && (
                                <button 
                                    onClick={() => handleDelete(admin.id)}
                                    className={styles.btnSm} 
                                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px' }}
                                    title="Hapus Administrator"
                                >
                                    <IconTrash />
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredAdmins.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8", fontWeight: "600", fontSize: "0.85rem" }}>
                          Data administrator tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
