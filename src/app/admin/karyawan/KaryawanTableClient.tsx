"use client"

import { useState } from "react"
import { deleteEmployeeAction, toggleBlockEmployeeAction, toggleAbsensiAccessAction } from "@/actions/employee"
import Link from "next/link"
import Image from "next/image"
import styles from "@/styles/admin.module.css"
import employeeStyles from "@/styles/employee_home.module.css"

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

const IconPower = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
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
  fotoProfil: string | null
  status: string
  absensiEnabled: boolean
  createdAt: string
}

const IconEye = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
)

const IconX = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)

const IconPlus = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
)

const IconCopy = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
)

const IconCheck = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
)

const IconUserCheck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
)

const IconUserX = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
)

export default function KaryawanTableClient({ karyawanInitial }: { karyawanInitial: Karyawan[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(null)
  const [karyawanToDelete, setKaryawanToDelete] = useState<Karyawan | null>(null)
  const [copiedId, setCopiedId] = useState(false)

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const filteredKaryawan = karyawanInitial.filter(k => 
    k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (k.jabatan?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  )

  const countAktif = karyawanInitial.filter(k => k.status === 'AKTIF').length
  const countBlokir = karyawanInitial.filter(k => k.status !== 'AKTIF').length

  return (
    <>
      {/* MODAL DETAIL */}
      {selectedKaryawan && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.25)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ background: 'white', width: '100%', maxWidth: '380px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}>
                  <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f8fafc' }}>
                      <h3 style={{ margin: 0, fontWeight: 900, fontSize: '0.95rem', color: '#0f172a' }}>Profil Karyawan</h3>
                  </div>

                  <div style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
                          <div style={{ width: '56px', height: '56px', background: '#f1f5f9', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#1e3a8a', marginBottom: '10px', overflow: 'hidden', position: 'relative' }}>
                            {selectedKaryawan.fotoProfil ? (
                                <Image src={selectedKaryawan.fotoProfil} alt={selectedKaryawan.nama} fill style={{ objectFit: 'cover' }} />
                            ) : (
                                selectedKaryawan.nama.charAt(0).toUpperCase()
                            )}
                          </div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', textAlign: 'center' }}>{selectedKaryawan.nama}</h4>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <span style={{ 
                                background: selectedKaryawan.status === 'AKTIF' ? '#f0fdf4' : '#fef2f2', color: selectedKaryawan.status === 'AKTIF' ? '#16a34a' : '#ef4444',
                                padding: '3px 8px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase'
                            }}>{selectedKaryawan.status}</span>
                            <span style={{ 
                                background: selectedKaryawan.absensiEnabled ? '#eff6ff' : '#fff7ed', color: selectedKaryawan.absensiEnabled ? '#3b82f6' : '#f97316',
                                padding: '3px 8px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase'
                            }}>{selectedKaryawan.absensiEnabled ? 'PORTAL BUKA' : 'PORTAL TUTUP'}</span>
                          </div>
                      </div>

                      <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid #e2e8f0' }}>
                          <div>
                              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Informasi Karyawan</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '4px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginTop: '2px' }}>ID Staf</span>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>{selectedKaryawan.id}</span>
                                          <button 
                                              onClick={() => handleCopyId(selectedKaryawan.id)}
                                              style={{ background: copiedId ? '#f0fdf4' : '#f1f5f9', border: 'none', padding: '4px', borderRadius: '6px', cursor: 'pointer', color: copiedId ? '#16a34a' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                              title="Salin ID"
                                          >
                                              {copiedId ? <IconCheck /> : <IconCopy />}
                                          </button>
                                      </div>
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '4px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Jabatan</span>
                                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>{selectedKaryawan.jabatan || '-'}</span>
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '4px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Kontak</span>
                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>{selectedKaryawan.phone || '-'}</span>
                                          {selectedKaryawan.email && <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>{selectedKaryawan.email}</span>}
                                      </div>
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '4px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Tgl Gabung</span>
                                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>{new Date(selectedKaryawan.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                  </div>
                              </div>
                          </div>
                          
                          <div style={{ height: '1px', background: '#e2e8f0' }}></div>
                          
                          <div>
                              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Data Rekening</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '4px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Bank</span>
                                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>{selectedKaryawan.rekeningBank || '-'}</span>
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '4px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>No. Rekening</span>
                                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>{selectedKaryawan.noRekening || '-'}</span>
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', gap: '4px', alignItems: 'flex-start' }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Atas Nama</span>
                                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>{selectedKaryawan.namaRekening || '-'}</span>
                                  </div>
                              </div>
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

      {/* MODAL HAPUS KONFIRMASI */}
      {karyawanToDelete && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ background: 'white', width: '100%', maxWidth: '320px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                  <div style={{ padding: '32px 24px 24px', textAlign: 'center' }}>
                      <div style={{ width: '80px', height: '80px', background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </div>
                      <h3 style={{ margin: '0 0 8px 0', fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>Hapus Karyawan?</h3>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', lineHeight: '1.5' }}>
                          Anda yakin ingin menghapus <strong>{karyawanToDelete.nama}</strong> permanen? Data yang telah dihapus tidak dapat dikembalikan.
                      </p>
                  </div>

                  <div style={{ padding: '16px 24px', background: '#f8fafc', display: 'flex', gap: '12px' }}>
                      <button onClick={() => setKaryawanToDelete(null)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>BATAL</button>
                      <form action={async () => { await deleteEmployeeAction(karyawanToDelete.id); setKaryawanToDelete(null) }} style={{ flex: 1, display: 'flex' }}>
                          <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#ef4444', border: 'none', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>YA, HAPUS</button>
                      </form>
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
                            <svg width="clamp(24px, 6vw, 32px)" height="clamp(24px, 6vw, 32px)" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <div>
                            <h1 className={styles.pengumumanHeaderTitle}>Database Karyawan</h1>
                            <p className={styles.pengumumanHeaderDesc}>Manajemen data personil dan kontrol akses staf RMP.</p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href="/admin/karyawan/tambah"
                        className={styles.pengumumanHeaderBtn}
                        style={{ textDecoration: 'none' }}
                    >
                        <IconPlus /> TAMBAH KARYAWAN
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
                        placeholder="Cari ID atau Nama Karyawan..."
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
                            <IconUserCheck />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Karyawan Aktif</span>
                        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, border: '1px solid #dcfce7' }}>
                            {countAktif}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '6px', background: '#fef2f2', color: '#dc2626' }}>
                            <IconUserX />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Akun Terblokir</span>
                        <span style={{ background: '#fff7ed', color: '#ea580c', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, border: '1px solid #ffedd5' }}>
                            {countBlokir}
                        </span>
                    </div>
                </div>
            </div>
        </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(16px, 4vw, 24px)', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <div className={employeeStyles.announceList}>
            {filteredKaryawan.map(k => (
                <div key={k.id} className={`${employeeStyles.announceItem} ${styles.adminAnnounceItem} ${styles.absensiItemGrid} ${styles.karyawanGrid}`} style={{ position: 'relative' }}>
                    <div className={employeeStyles.announceImageWrapper} style={{ background: '#f8fafc', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', fontSize: '1.4rem', fontWeight: 900, color: '#1e3a8a', flexShrink: 0, border: '1px solid #e2e8f0', overflow: 'hidden', position: 'relative' }}>
                        {k.fotoProfil ? (
                            <Image src={k.fotoProfil} alt={k.nama} fill style={{ objectFit: 'cover' }} />
                        ) : (
                            k.nama.charAt(0).toUpperCase()
                        )}
                    </div>
                    
                    <div className={employeeStyles.announceContent} style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                        <h4 className={employeeStyles.announceTitle} style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 900, lineHeight: 1.2 }}>
                            {k.nama.toUpperCase()}
                        </h4>
                        
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
                                background: k.status === 'AKTIF' ? '#f0fdf4' : '#fef2f2',
                                color: k.status === 'AKTIF' ? '#16a34a' : '#ef4444',
                                fontSize: '0.65rem',
                                fontWeight: 900,
                                letterSpacing: '0.02em'
                            }}>
                                {k.status}
                            </span>
                            <span style={{ 
                                padding: '4px 10px', 
                                borderRadius: '6px',
                                background: k.absensiEnabled ? '#eff6ff' : '#fff7ed',
                                color: k.absensiEnabled ? '#3b82f6' : '#f97316',
                                fontSize: '0.65rem',
                                fontWeight: 900,
                                letterSpacing: '0.02em'
                            }}>
                                {k.absensiEnabled ? 'PORTAL BUKA' : 'PORTAL TUTUP'}
                            </span>
                        </div>

                        <div className={styles.employeeInfoRow}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                {k.id}
                            </span>
                            <span className={styles.employeeInfoSeparator}>•</span>
                            <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                {k.jabatan || 'Staf'}
                            </span>
                        </div>
                    </div>

                    <div className={`${styles.adminAnnounceActions} ${styles.karyawanActions}`}>
                        <button onClick={() => setSelectedKaryawan(k)} className={styles.pengumumanActionEdit} title="Detail">
                            <IconEye /> Detail
                        </button>
                        
                        <button 
                            onClick={async () => { await toggleAbsensiAccessAction(k.id, k.absensiEnabled) }} 
                            className={styles.pengumumanActionEdit} 
                            style={{ color: k.absensiEnabled ? '#f97316' : '#3b82f6', borderColor: k.absensiEnabled ? '#fed7aa' : '#bfdbfe' }} 
                            title={k.absensiEnabled ? 'Tutup Akses Absensi' : 'Buka Akses Absensi'}
                        >
                            <IconPower /> {k.absensiEnabled ? 'Tutup Akses' : 'Buka Akses'}
                        </button>

                        <button 
                            onClick={async () => { await toggleBlockEmployeeAction(k.id, k.status) }} 
                            className={styles.pengumumanActionDelete} 
                            style={{ color: k.status === 'AKTIF' ? '#ef4444' : '#10b981', borderColor: k.status === 'AKTIF' ? '#fecaca' : '#a7f3d0' }} 
                            title={k.status === 'AKTIF' ? 'Blokir' : 'Aktifkan'}
                        >
                            {k.status === 'AKTIF' ? <IconLock /> : <IconUnlock />} {k.status === 'AKTIF' ? 'Blokir' : 'Aktifkan'}
                        </button>

                        <Link href={`/admin/karyawan/edit/${k.id}`} className={styles.pengumumanActionEdit} title="Edit">
                            <IconEdit /> Edit
                        </Link>

                        <button onClick={() => setKaryawanToDelete(k)} className={styles.pengumumanActionDelete} title="Hapus">
                            <IconTrash /> Hapus
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </>
  )
}
