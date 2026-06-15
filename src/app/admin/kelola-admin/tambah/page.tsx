"use client"

import { useState } from "react"
import { createAdminAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"

const IconShield = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)

const IconId = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 16h10"/><path d="M7 12h10"/><path d="M7 8h10"/></svg>
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconLock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>

export default function CreateAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const formData = new FormData(e.currentTarget)
      const res = await createAdminAction(formData)
      if (res?.error) {
        setError(res.error as string)
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/admin/kelola-admin"), 1500)
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem")
    }
    
    setLoading(false)
  }

  return (
    <div className={styles.pageContainer} style={{ padding: '16px 0', gap: '16px', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 4px' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '46px', height: '46px', borderRadius: '16px', background: '#eff6ff',
          color: '#2563eb', flexShrink: 0
        }}>
          <IconShield />
        </div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Tambah Administrator
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className={styles.card} style={{ width: '100%', maxWidth: '800px', padding: 'clamp(16px, 4vw, 24px)', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', marginBottom: '60px' }}>
              
              {error && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'linear-gradient(to right, #fef2f2, #ffffff)', border: '1px solid #fecaca', borderLeft: '4px solid #ef4444', color: '#dc2626', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)' }}>
                  <div style={{ background: '#fee2e2', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '2px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '-0.01em', color: '#991b1b' }}>Gagal Menyimpan Data</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#b91c1c', opacity: 0.9, lineHeight: 1.4 }}>{error}</span>
                  </div>
                </div>
              )}
              
              {success && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f0fdf4', border: '1px solid #dcfce7', color: '#16a34a', padding: '16px', borderRadius: '14px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.05)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Berhasil!</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '2px', opacity: 0.9 }}>Administrator telah ditambahkan. Mengalihkan...</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Akses Login */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', background: 'linear-gradient(to right, #f8fafc, #ffffff)', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                      <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9', paddingBottom: '6px' }}>
                          Akses Login & Otoritas
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
                          <div className={styles.formGroup}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>USERNAME / ID OTORITAS <span style={{color: '#ef4444'}}>*</span></label>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                                  <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconId /></div>
                                  <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 900, fontSize: '0.85rem', color: '#10b981', outline: 'none' }} type="text" name="id" placeholder="Misal: admin_ops_01" required />
                              </div>
                          </div>
                          <div className={styles.formGroup}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>PASSWORD LOGIN <span style={{color: '#ef4444'}}>*</span></label>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                                  <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconLock /></div>
                                  <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }} type="text" name="password" defaultValue="admin123" required />
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Profil Admin */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9', paddingBottom: '6px' }}>
                          Profil Administrator
                      </h3>
                      <div className={styles.formGroup}>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>NAMA LENGKAP <span style={{color: '#ef4444'}}>*</span></label>
                          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                              <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconUser /></div>
                              <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }} type="text" name="nama" placeholder="Masukkan Nama Lengkap" required />
                          </div>
                      </div>
                  </div>

                  <div style={{ 
                      background: '#eff6ff', 
                      padding: '16px', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      gap: '12px', 
                      alignItems: 'flex-start',
                      border: '1px solid #dbeafe'
                  }}>
                      <div style={{ color: '#3b82f6', marginTop: '2px' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', lineHeight: '1.5' }}>
                          Pemberian hak akses Admin akan memberikan wewenang penuh untuk mengelola data karyawan, absensi, dan pengaturan sistem lainnya.
                      </p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px', borderTop: '2px solid #f1f5f9', paddingTop: '24px' }}>
                      <Link href="/admin/kelola-admin" style={{ 
                          flex: 1,
                          background: '#f8fafc', 
                          color: '#64748b', 
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '12px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          textDecoration: 'none',
                          transition: 'all 0.2s'
                      }}>
                        BATAL
                      </Link>

                      <button 
                          type="submit" 
                          disabled={loading} 
                          style={{ 
                              flex: 2,
                              padding: '12px', 
                              fontSize: '0.8rem', 
                              borderRadius: '10px',
                              fontWeight: 800,
                              border: 'none',
                              color: 'white',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              opacity: loading ? 0.7 : 1,
                              background: '#0f172a',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px'
                          }}
                      >
                          {loading ? "MENGIRIM..." : "DAFTARKAN ADMIN"}
                      </button>
                  </div>
              </form>
          </div>
      </div>
    </div>
  )
}
