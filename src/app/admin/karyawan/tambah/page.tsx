"use client"

import { useState } from "react"
import { createEmployeeAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"
import Link from "next/link"

const IconPlusUser = () => (
    <div style={{ background: '#f8fafc', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
    </div>
)

const IconId = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 16h10"/><path d="M7 12h10"/><path d="M7 8h10"/></svg>
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconBriefcase = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="2" y="7" width="20" height="14" rx="2"/><line x1="2" y1="14" x2="22" y2="14"/></svg>
const IconLock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const IconPhone = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const IconMail = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>
const IconMapPin = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>

export default function CreateEmployeeForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const res = await createEmployeeAction(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer} style={{ background: '#f8fafc', padding: '0px', minHeight: '100vh' }}>
      
      {/* 1. STATUS LINE - PROFESSIONAL */}
      <div style={{ padding: 'clamp(12px, 2vw, 24px) clamp(16px, 4vw, 32px) 0 clamp(16px, 4vw, 32px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
              <div>
                  <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      marginBottom: '12px'
                  }}>
                      <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Personil Baru • Registrasi Sistem</span>
                  </div>
                  <h1 className={styles.pageTitle} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Pendaftaran Karyawan
                  </h1>
                  <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                    Input data personil baru ke dalam sistem RMP Digitals.
                  </p>
              </div>
          </div>
      </div>

      <div style={{ padding: '0 clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)' }}>
            <div className={styles.card} style={{ maxWidth: '900px', padding: 'clamp(20px, 4vw, 40px)', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '16px', borderRadius: '14px', marginBottom: '32px', fontWeight: 700, fontSize: '0.85rem' }}>
                        ⚠️ {error}
                    </div>
                )}
                
                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
                        <div className={styles.formGroup}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>ID Karyawan</label>
                            <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                <div className={styles.searchIcon}><IconId /></div>
                                <input style={{ background: 'transparent', border: 'none', fontWeight: 700 }} className={styles.searchInput} type="text" name="id" placeholder="Contoh: RMP-001" required />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Nama Lengkap</label>
                            <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                <div className={styles.searchIcon}><IconUser /></div>
                                <input style={{ background: 'transparent', border: 'none', fontWeight: 700 }} className={styles.searchInput} type="text" name="nama" placeholder="Masukkan Nama Lengkap" required />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
                        <div className={styles.formGroup}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Jabatan / Posisi</label>
                            <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                <div className={styles.searchIcon}><IconBriefcase /></div>
                                <input style={{ background: 'transparent', border: 'none', fontWeight: 700 }} className={styles.searchInput} type="text" name="jabatan" placeholder="Contoh: Staff Gudang" required />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#854d0e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Password Login</label>
                            <div className={styles.searchBox} style={{ background: '#fffbeb', borderRadius: '14px', border: '1px solid #fef08a' }}>
                                <div className={styles.searchIcon} style={{ color: '#a16207' }}><IconLock /></div>
                                <input style={{ background: 'transparent', border: 'none', fontWeight: 700, color: '#854d0e' }} className={styles.searchInput} type="text" name="password" defaultValue="123456" required />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
                        <div className={styles.formGroup}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>No. WhatsApp</label>
                            <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                <div className={styles.searchIcon}><IconPhone /></div>
                                <input style={{ background: 'transparent', border: 'none', fontWeight: 700 }} className={styles.searchInput} type="text" name="phone" placeholder="08..." />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Email Aktif</label>
                            <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                <div className={styles.searchIcon}><IconMail /></div>
                                <input style={{ background: 'transparent', border: 'none', fontWeight: 700 }} className={styles.searchInput} type="email" name="email" placeholder="contoh@rmp.com" />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Alamat Domisili Lengkap</label>
                        <textarea 
                            name="alamat" 
                            placeholder="Alamat lengkap saat ini..." 
                            rows={3} 
                            style={{ 
                                width: "100%", 
                                borderRadius: "16px", 
                                padding: '16px 20px', 
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: '#1e293b',
                                outline: 'none',
                                transition: 'all 0.2s',
                                resize: 'none',
                                boxSizing: 'border-box'
                            }}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <Link href="/admin/karyawan" className={styles.btnAction} style={{ 
                            flex: 1,
                            background: '#f1f5f9', 
                            color: '#64748b', 
                            border: '1px solid #e2e8f0',
                            justifyContent: 'center',
                            padding: '16px 12px',
                            borderRadius: '16px',
                            fontWeight: 900,
                            fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
                            boxShadow: 'none'
                        }}>
                          BATAL
                        </Link>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{ 
                                flex: 1.5,
                                padding: '16px 12px', 
                                fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', 
                                borderRadius: '16px',
                                fontWeight: 900,
                                border: 'none',
                                color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                background: '#0f172a',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1)'
                            }}
                        >
                            {loading ? "PROSES..." : "DAFTARKAN"}
                        </button>
                    </div>
                </form>
            </div>
      </div>
    </div>
  )
}
