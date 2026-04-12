"use client"

import { useState } from "react"
import { updateAdminAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"

const IconEditAdmin = () => (
    <div style={{ background: '#f8fafc', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M17 21v-2a4 4 0 0 0-3-3.87"/><path d="M9 3.13a4 4 0 0 1 0 7.75"/><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
    </div>
)

const IconId = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 16h10"/><path d="M7 12h10"/><path d="M7 8h10"/></svg>
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconLock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const IconChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>

export default function EditAdminForm({ user }: { user: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const res = await updateAdminAction(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push("/admin/kelola-admin")
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
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Konfigurasi Keamanan • Update Profil</span>
                  </div>
                  <h1 className={styles.pageTitle} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Edit Administrator
                  </h1>
                  <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                    Modifikasi kredensial dan informasi akses administratif sistem.
                  </p>
              </div>
          </div>
      </div>

      <div style={{ padding: '0 clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)' }}>
            <div className={styles.card} style={{ maxWidth: '700px', padding: 'clamp(20px, 4vw, 40px)', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '16px', borderRadius: '14px', marginBottom: '32px', fontWeight: 700, fontSize: '0.85rem' }}>
                        ⚠️ {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <input type="hidden" name="idOriginal" value={user.id} />

                    <div className={styles.formGroup}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Username / ID Otoritas</label>
                        <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                            <div className={styles.searchIcon}><IconId /></div>
                            <input style={{ background: 'transparent', border: 'none', fontWeight: 700 }} className={styles.searchInput} type="text" name="id" defaultValue={user.id} required />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Nama Lengkap Administrator</label>
                        <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                            <div className={styles.searchIcon}><IconUser /></div>
                            <input style={{ background: 'transparent', border: 'none', fontWeight: 700 }} className={styles.searchInput} type="text" name="nama" defaultValue={user.nama} required />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#854d0e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Perbarui Kata Sandi</label>
                        <div className={styles.searchBox} style={{ background: '#fffbeb', borderRadius: '14px', border: '1px solid #fef08a' }}>
                            <div className={styles.searchIcon} style={{ color: '#a16207' }}><IconLock /></div>
                            <input style={{ background: 'transparent', border: 'none', fontWeight: 700, color: '#854d0e' }} className={styles.searchInput} type="text" name="password" defaultValue={user.password} required />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <Link href="/admin/kelola-admin" className={styles.btnAction} style={{ 
                            flex: 1,
                            background: '#f1f5f9', 
                            color: '#64748b', 
                            border: '1px solid #e2e8f0',
                            justifyContent: 'center',
                            padding: '16px 12px',
                            borderRadius: '16px',
                            fontWeight: 900,
                            fontSize: '0.85rem',
                            boxShadow: 'none'
                        }}>
                          BATAL
                        </Link>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{ 
                                flex: 2,
                                padding: '16px 12px', 
                                fontSize: '0.85rem', 
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
                            {loading ? "MENYIMPAN..." : "SIMPAN PERUBAHAN DATA"}
                        </button>
                    </div>
                </form>
            </div>
      </div>
    </div>
  )
}
