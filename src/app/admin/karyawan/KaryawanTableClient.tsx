"use client"

import { useState } from "react"
import { deleteEmployeeAction, toggleBlockEmployeeAction } from "@/actions/employee"
import Link from "next/link"
import styles from "@/styles/admin.module.css"

const IconSearch = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
)

const IconEdit = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
)

const IconLock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)

const IconUnlock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
)

const IconTrash = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
)

interface Karyawan {
  id: string
  nama: string
  jabatan: string | null
  phone: string | null
  email: string | null
  rekeningBank: string | null
  noRekening: string | null
  namaRekening: string | null
  alamat: string | null
  status: string
}

const IconEye = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
)

const IconX = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)

export default function KaryawanTableClient({ karyawanInitial }: { karyawanInitial: Karyawan[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(null)

  const filteredKaryawan = karyawanInitial.filter(k => 
    k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (k.jabatan?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  )

  return (
    <>
      {/* MODAL DETAIL - COMPACT HIGH END */}
      {selectedKaryawan && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.25)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ background: 'white', width: '100%', maxWidth: '380px', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}>
                  <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8fafc' }}>
                      <h3 style={{ margin: 0, fontWeight: 900, fontSize: '0.95rem', color: '#0f172a' }}>Detail Profil Personil</h3>
                      <button onClick={() => setSelectedKaryawan(null)} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                          <IconX />
                      </button>
                  </div>

                  <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                          <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: '#1e3a8a', marginBottom: '12px' }}>{selectedKaryawan.nama.charAt(0)}</div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', textAlign: 'center' }}>{selectedKaryawan.nama}</h4>
                          <span style={{ 
                              background: selectedKaryawan.status === 'AKTIF' ? '#f0fdf4' : '#fef2f2', 
                              color: selectedKaryawan.status === 'AKTIF' ? '#16a34a' : '#ef4444',
                              padding: '3px 10px',
                              borderRadius: '100px',
                              fontSize: '0.6rem',
                              fontWeight: 900,
                              textTransform: 'uppercase'
                          }}>{selectedKaryawan.status}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>ID STAF</span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{selectedKaryawan.id}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Jabatan</span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{selectedKaryawan.jabatan || '-'}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Kontak</span>
                              <div>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{selectedKaryawan.phone || '-'}</div>
                                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{selectedKaryawan.email || '-'}</div>
                              </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Rekening</span>
                              <div>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{selectedKaryawan.namaRekening || '-'}</div>
                                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{selectedKaryawan.rekeningBank || '-'}</div>
                                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{selectedKaryawan.noRekening || '-'}</div>
                              </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Alamat</span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', lineHeight: '1.4' }}>{selectedKaryawan.alamat || '-'}</span>
                          </div>
                      </div>
                  </div>

                  <div style={{ padding: '16px 24px', background: '#f8fafc', display: 'flex', gap: '10px' }}>
                      <button onClick={() => setSelectedKaryawan(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>TUTUP</button>
                      <Link href={`/admin/karyawan/edit/${selectedKaryawan.id}`} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#0f172a', border: 'none', color: 'white', fontWeight: 800, fontSize: '0.8rem', textAlign: 'center', textDecoration: 'none' }}>EDIT PROFIL</Link>
                  </div>
              </div>
          </div>
      )}
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className={styles.cardTitle} style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900 }}>Daftar Personil</h3>
        </div>
        <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '300px', flex: '1 1 250px' }}>
          <div className={styles.searchIcon} style={{ color: '#94a3b8' }}><IconSearch /></div>
          <input 
            type="text" 
            placeholder="Cari ID atau Nama..." 
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
              <th>Identitas Pengguna</th>
              <th>Informasi Kontak</th>
              <th>Informasi Rekening</th>
              <th>Status Akses</th>
              <th style={{ textAlign: 'right' }}>Opsi Kelola</th>
            </tr>
          </thead>
          <tbody>
            {filteredKaryawan.map((k) => (
              <tr key={k.id}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.userAvatar} style={{ background: '#f1f5f9', color: '#1e3a8a', fontWeight: 800 }}>{k.nama.charAt(0)}</div>
                    <div>
                      <span className={styles.userName} style={{ fontSize: '0.85rem', fontWeight: 800 }}>{k.nama}</span>
                      <span className={styles.userSub} style={{ fontSize: '0.7rem', fontWeight: 600 }}>ID: {k.id} • {k.jabatan || 'Staf'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ lineHeight: '1.4' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>{k.phone || '-'}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#64748b' }}>{k.email || '-'}</div>
                  </div>
                </td>
                <td>
                  <div style={{ lineHeight: '1.4' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{k.rekeningBank || '-'}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#64748b' }}>{k.noRekening || '-'}</div>
                  </div>
                </td>
                <td>
                  <div 
                    className={`${styles.badge}`} 
                    style={{ 
                        background: k.status === 'AKTIF' ? '#f0fdf4' : '#fef2f2', 
                        color: k.status === 'AKTIF' ? '#16a34a' : '#ef4444',
                        border: 'none',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        padding: '6px 12px',
                        borderRadius: '100px',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex' }}>
                        {k.status === 'AKTIF' ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        )}
                    </div>
                    {k.status}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => setSelectedKaryawan(k)}
                      className={styles.btnSm} 
                      style={{ background: '#f8fafc', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                      title="Lihat Detail"
                    >
                      <IconEye />
                    </button>
                    <Link 
                      href={`/admin/karyawan/edit/${k.id}`} 
                      className={styles.btnSm} 
                      style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px' }}
                      title="Edit Data"
                    >
                      <IconEdit />
                    </Link>
                    
                    <form action={async () => { await toggleBlockEmployeeAction(k.id, k.status) }}>
                      <button 
                        type="submit" 
                        className={styles.btnSm} 
                        style={{ background: k.status === 'AKTIF' ? '#f5f3ff' : '#ecfdf5', color: k.status === 'AKTIF' ? '#7c3aed' : '#10b981', border: 'none', borderRadius: '8px' }}
                        title={k.status === 'AKTIF' ? 'Blokir' : 'Aktifkan'}
                      >
                        {k.status === 'AKTIF' ? <IconLock /> : <IconUnlock />}
                      </button>
                    </form>
                    
                    <form action={async () => {
                      if (confirm(`Hapus permanen karyawan ${k.nama}? Tindakan ini tidak dapat dibatalkan.`)) {
                        await deleteEmployeeAction(k.id)
                      }
                    }}>
                      <button 
                        type="submit" 
                        className={styles.btnSm} 
                        style={{ background: '#fff1f2', color: '#e11d48', border: 'none', borderRadius: '8px' }}
                        title="Hapus Permanen"
                      >
                        <IconTrash />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {filteredKaryawan.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "80px 20px", color: "#94a3b8", fontWeight: "600", fontSize: "0.85rem" }}>
                  <div style={{ marginBottom: "16px", opacity: 0.5 }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </div>
                  Data karyawan tidak ditemukan dalam database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
